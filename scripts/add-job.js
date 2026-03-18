const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const forceMode = args.includes("--force");

function getArg(name, required = true) {
  const idx = args.indexOf(`--${name}`);
  if (idx === -1 || idx + 1 >= args.length) {
    if (required) {
      console.error(`Missing required argument: --${name}`);
      process.exit(1);
    }
    return null;
  }
  return args[idx + 1];
}

const company = getArg("company");
const companyName = getArg("company-name");
const position = getArg("position");
const url = getArg("url");

// Auto-detect source platform from URL hostname
function detectSource(url) {
  try {
    const hostname = new URL(url).hostname;
    const mapping = {
      "www.104.com.tw": "104",
      "www.yourator.co": "Yourator",
      "www.cakeresume.com": "CakeResume",
    };
    return mapping[hostname] || hostname;
  } catch {
    return "unknown";
  }
}

// Convert text to slug: English → lowercase, spaces → hyphens, Chinese kept as-is
function toSlug(text) {
  // Characters illegal in Windows filenames: < > : " / \ | ? *
  const sanitize = (s) => s.replace(/[<>:"/\\|?*]+/g, "-").replace(/\s+/g, "-").replace(/-{2,}/g, "-");

  const englishMatch = text.match(/[a-zA-Z][a-zA-Z0-9 -]*/g);
  if (englishMatch) {
    return sanitize(englishMatch.join(" ").trim().toLowerCase());
  }
  return sanitize(text);
}

// Generate id: {YYYYMMDDHHMMSS}-{company slug}-{position slug}
function generateId(company, position) {
  const now = new Date();
  const timestamp = now.getFullYear().toString()
    + String(now.getMonth() + 1).padStart(2, "0")
    + String(now.getDate()).padStart(2, "0")
    + String(now.getHours()).padStart(2, "0")
    + String(now.getMinutes()).padStart(2, "0")
    + String(now.getSeconds()).padStart(2, "0");
  const companySlug = toSlug(company);
  const positionSlug = toSlug(position);
  return `${timestamp}-${companySlug}-${positionSlug}`;
}

const source = detectSource(url);
const jobsPath = path.resolve(__dirname, "..", "jobs.json");
const jobs = JSON.parse(fs.readFileSync(jobsPath, "utf8"));

const duplicate = jobs.find((j) => j.company === company && j.position === position);
if (duplicate && !forceMode) {
  console.error(`Job already exists: ${company} - ${position} (id: ${duplicate.id})`);
  process.exit(1);
}

const id = duplicate ? duplicate.id : generateId(company, position);

if (!duplicate) {
  const today = new Date().toISOString().slice(0, 10);

  jobs.push({
    id,
    company,
    position,
    url,
    source,
    status: "pending",
    appliedAt: null,
    interviewAt: null,
    updatedAt: today,
  });

  fs.writeFileSync(jobsPath, JSON.stringify(jobs, null, 2) + "\n");
  console.log(`Added job: ${company} - ${position} (id: ${id})`);
}

// Generate cover letter from template
const templatePath = path.resolve(__dirname, "..", "templates", "cover-letter-general.md");
const coverLettersDir = path.resolve(__dirname, "..", "cover-letters");

if (fs.existsSync(templatePath)) {
  const template = fs.readFileSync(templatePath, "utf8");
  const coverLetter = template.replace(/OO公司/g, companyName);

  if (!fs.existsSync(coverLettersDir)) {
    fs.mkdirSync(coverLettersDir, { recursive: true });
  }

  const coverLetterPath = path.join(coverLettersDir, `${id}.md`);
  fs.writeFileSync(coverLetterPath, coverLetter);
  console.log(`Generated cover letter: cover-letters/${id}.md`);
} else {
  console.warn("Warning: templates/cover-letter-general.md not found, skipping cover letter generation.");
}
