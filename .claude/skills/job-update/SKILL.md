---
name: job-update
description: >
  互動式更新求職狀態。列出非歸檔職缺讓使用者選擇要更新的項目與新狀態，更新後重新產生追蹤表。
  Use when the user types /job-update, wants to change a job's status (e.g., mark as applied,
  interviewed, rejected, got offer), or mentions updating application progress for a specific company.
user_invocable: true
---

# /job-update — 更新求職狀態

這是一個純互動式的 skill，不接受參數。

## 流程

1. 執行以下指令取得非歸檔職缺清單：
   ```bash
   node scripts/list-jobs.js
   ```

2. 如果清單為空，告知使用者目前沒有需要更新的職缺。

3. 列出清單讓使用者選擇要更新哪一筆，格式如：
   ```
   1. OakMega 大橡科技 - Frontend Engineer (pending)
   2. 鼎新電腦 - 前端工程師 (applied)
   ```

4. 使用者選擇後，根據當前狀態顯示可用的狀態轉換：
   - `pending` → applied, applied_ghosted
   - `applied` → interview, applied_ghosted
   - `interview` → interviewed, rejected, interview_ghosted
   - `interviewed` → offer, rejected, interview_ghosted

5. 使用者選擇新狀態後，執行：
   ```bash
   node scripts/update-job.js --id "{id}" --status "{new_status}"
   ```

6. 更新完成後，執行：
   ```bash
   node scripts/generate-tracker.js
   ```

7. 告知使用者更新結果。
