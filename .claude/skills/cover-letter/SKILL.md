---
name: cover-letter
description: >
  從 jobs.txt 批次產生求職信並新增求職追蹤記錄。讀取 CSV 格式的職缺資料（URL、公司、職位），
  逐筆呼叫腳本產生求職信、寫入 jobs.json、更新追蹤表。
  Use when the user types /cover-letter, mentions generating cover letters, wants to process job listings
  from jobs.txt, or asks to add new jobs and create cover letters in batch.
user_invocable: true
---

# /cover-letter — 批次產生求職信

## 流程

1. **讀取 `jobs.txt`**：如果檔案為空或不存在，提示使用者先填入職缺資料（CSV 格式：`URL,公司名稱,職位名稱`，每行一筆）後再執行。

2. **逐行解析 CSV**：每行格式為 `URL,公司名稱,職位名稱`，解析出三個欄位。
   - 範例：`https://www.104.com.tw/job/5bwo8,OakMega 大橡科技,Frontend Engineer`

3. **對每一筆資料**：
   a. 從原始公司名稱擷取**簡短公司名稱**（用於求職信中的稱呼）：
      - 去除法人後綴（「股份有限公司」「有限公司」）：「一零四資訊科技股份有限公司」→「一零四資訊科技」
      - 去除後綴後若剩餘名稱 ≤ 3 個字，改用含後綴的完整名稱：「磐弈有限公司」→「磐弈有限公司」（非「磐弈」）
      - 有中文名時優先用中文：「OakMega 大橡科技」→「大橡科技」
      - 純英文直接使用：「Google」→「Google」
      - 純中文直接使用：「鼎新電腦」→「鼎新電腦」
   b. 正常模式——執行指令：
      ```bash
      node scripts/add-job.js --company "{原始公司名稱}" --company-name "{簡短名稱}" --position "{職位名稱}" --url "{URL}"
      ```
   c. 重新產生模式——當使用者提到「force」、「重新產生」、「regenerate」時，加上 `--force`：
      ```bash
      node scripts/add-job.js --force --company "{原始公司名稱}" --company-name "{簡短名稱}" --position "{職位名稱}" --url "{URL}"
      ```

4. **全部處理完後**：
   ```bash
   node scripts/generate-tracker.js
   ```

5. **清空 `jobs.txt`**：將檔案內容清空（寫入空字串）

6. **回報結果**：列出每個處理的職缺和對應的求職信路徑

## 注意事項

- 今天日期：使用系統提供的 currentDate
- 來源平台由腳本從 URL domain 自動判斷，skill 不需處理
- id 由腳本內部自動產生，skill 不需處理
- slug 轉換由腳本內部處理，skill 只需傳入原始文字
- 求職信從模板產生，「OO公司」會被替換為 `--company-name` 的值
- 遵循 EditorConfig：UTF-8、LF、2-space indent
