const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const jobs = JSON.parse(fs.readFileSync(path.join(root, "jobs.json"), "utf8"));
const today = new Date().toISOString().slice(0, 10);

const emojis = {
  "待處理": "📋",
  "等待中": "⏳",
  "歸檔": "📁",
};

const categories = {
  "待處理": {
    "已收到面試邀約": {
      statuses: ["interview"],
      columns: ["公司", "職位", "來源", "更新日期", "連結"],
      row: (j) => `| ${j.company} | ${j.position} | ${j.source} | ${j.updatedAt} | [連結](${j.url}) |`,
    },
    "待投遞": {
      statuses: ["pending"],
      columns: ["公司", "職位", "來源", "加入日期", "連結", "求職信"],
      row: (j) => {
        const cl = fs.existsSync(path.join(root, "cover-letters", `${j.id}.md`))
          ? `[查看](cover-letters/${j.id}.md)`
          : "";
        return `| ${j.company} | ${j.position} | ${j.source} | ${j.updatedAt} | [連結](${j.url}) | ${cl} |`;
      },
    },
  },
  "等待中": {
    "已投遞等回覆": {
      statuses: ["applied"],
      columns: ["公司", "職位", "來源", "投遞日期", "連結"],
      row: (j) => `| ${j.company} | ${j.position} | ${j.source} | ${j.appliedAt || j.updatedAt} | [連結](${j.url}) |`,
    },
    "面試完等結果": {
      statuses: ["interviewed"],
      columns: ["公司", "職位", "來源", "面試日期", "連結"],
      row: (j) => `| ${j.company} | ${j.position} | ${j.source} | ${j.interviewAt || j.updatedAt} | [連結](${j.url}) |`,
    },
  },
  "歸檔": {
    "拿到 Offer": {
      statuses: ["offer"],
      columns: ["公司", "職位", "來源", "日期", "連結"],
      row: (j) => `| ${j.company} | ${j.position} | ${j.source} | ${j.updatedAt} | [連結](${j.url}) |`,
    },
    "面試被拒": {
      statuses: ["rejected"],
      columns: ["公司", "職位", "來源", "日期", "連結"],
      row: (j) => `| ${j.company} | ${j.position} | ${j.source} | ${j.updatedAt} | [連結](${j.url}) |`,
    },
    "面試無聲卡": {
      statuses: ["interview_ghosted"],
      columns: ["公司", "職位", "來源", "日期", "連結"],
      row: (j) => `| ${j.company} | ${j.position} | ${j.source} | ${j.updatedAt} | [連結](${j.url}) |`,
    },
    "投遞無聲卡": {
      statuses: ["applied_ghosted"],
      columns: ["公司", "職位", "來源", "日期", "連結"],
      row: (j) => `| ${j.company} | ${j.position} | ${j.source} | ${j.updatedAt} | [連結](${j.url}) |`,
    },
  },
};

const lines = [
  "# 求職進度追蹤",
  "",
  `> 自動產生，請勿手動編輯。最後更新：${today}`,
  ">",
  "> 快速查閱：[104](https://www.104.com.tw/) | [Yourator](https://www.yourator.co/)",
  "",
];

for (const [catName, sections] of Object.entries(categories)) {
  lines.push(`## ${emojis[catName] || ""} ${catName}`, "");
  for (const [secName, sec] of Object.entries(sections)) {
    lines.push(`### ${emojis[secName] || ""} ${secName}`);
    const header = `| ${sec.columns.join(" | ")} |`;
    const separator = `|${sec.columns.map(() => "------").join("|")}|`;
    lines.push(header, separator);
    const matched = jobs.filter((j) => sec.statuses.includes(j.status));
    for (const j of matched) {
      lines.push(sec.row(j));
    }
    lines.push("");
  }
}

fs.writeFileSync(path.join(root, "job-tracker.md"), lines.join("\n"));
console.log("job-tracker.md generated.");
