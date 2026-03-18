# Lucas Yang 的履歷

## 履歷版本

- [LUCAS_RESUME.md](LUCAS_RESUME.md) / [PDF](LUCAS_RESUME.pdf) — Yourator 版本（主要履歷）
- [LUCAS_RESUME_WITH_AUTOBIOGRAPHY.md](LUCAS_RESUME_WITH_AUTOBIOGRAPHY.md) — 104 版本（僅含個人簡介與自傳，其餘欄位與 Yourator 版本相同）

## 求職管理

👉 查看 [求職進度追蹤表](job-tracker.md)

透過 Claude Code Skill 管理求職流程，以 `jobs.json` 作為資料中心，自動產生追蹤表。

- `/cover-letter` — 將職缺資料填入 `jobs.txt`（CSV 格式：`URL,公司名稱,職位名稱`），批次產生求職信、新增追蹤記錄並更新追蹤表
- `/job-status` — 查看求職進度摘要與追蹤表
- `/job-update` — 互動式更新職缺狀態（如已投遞、面試、拿到 Offer 等）

### 求職信與婉拒信

- 求職信存放於 [`cover-letters/`](cover-letters/)
- 婉拒信範本與通用信件範本存放於 [`templates/`](templates/)
