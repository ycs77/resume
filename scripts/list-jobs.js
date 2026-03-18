const fs = require("fs");
const path = require("path");

const archived = ["offer", "rejected", "interview_ghosted", "applied_ghosted"];
const filePath = path.resolve(__dirname, "..", "jobs.json");
const jobs = JSON.parse(fs.readFileSync(filePath, "utf8"));
const active = jobs.filter((j) => !archived.includes(j.status));

console.log(JSON.stringify(active, null, 2));
