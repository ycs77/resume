---
name: job-status
description: >
  產生並顯示求職進度追蹤報告，包含各狀態的職缺數量統計與完整追蹤表。
  Use when the user types /job-status, asks about job application progress, wants to check
  which jobs are pending/applied/interviewing, or asks to see the job tracker overview.
user_invocable: true
---

# /job-status — 查看求職進度

## 流程

1. 執行以下指令產生最新的追蹤表：
   ```bash
   node scripts/generate-tracker.js
   ```

2. 讀取產出的 `job-tracker.md`

3. 向使用者顯示摘要，包含：
   - 各分類的職缺數量統計（待處理、等待中、歸檔）
   - 完整的追蹤表內容
