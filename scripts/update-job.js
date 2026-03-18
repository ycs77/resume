const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);

function getArg(name) {
  const idx = args.indexOf(`--${name}`);
  if (idx === -1 || idx + 1 >= args.length) {
    console.error(`Missing required argument: --${name}`);
    process.exit(1);
  }
  return args[idx + 1];
}

const id = getArg("id");
const status = getArg("status");
const today = new Date().toISOString().slice(0, 10);

const validStatuses = [
  "pending", "applied", "interview", "interviewed",
  "offer", "rejected", "interview_ghosted", "applied_ghosted",
];

if (!validStatuses.includes(status)) {
  console.error(`Invalid status: ${status}. Valid: ${validStatuses.join(", ")}`);
  process.exit(1);
}

const filePath = path.resolve(__dirname, "..", "jobs.json");
const jobs = JSON.parse(fs.readFileSync(filePath, "utf8"));
const job = jobs.find((j) => j.id === id);

if (!job) {
  console.error(`Job with id "${id}" not found.`);
  process.exit(1);
}

job.status = status;
job.updatedAt = today;

if (status === "applied" && !job.appliedAt) {
  job.appliedAt = today;
}
if (status === "interview" && !job.interviewAt) {
  job.interviewAt = today;
}

fs.writeFileSync(filePath, JSON.stringify(jobs, null, 2) + "\n");
console.log(`Updated ${job.company} - ${job.position} → ${status}`);
