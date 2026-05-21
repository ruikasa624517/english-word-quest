# 交接筆記（HANDOFF）

> 本檔案紀錄每次工作階段做了什麼、改了哪些檔案、ROADMAP 上對應到哪幾條，方便 codex 或下一位接手。

---

## 階段 21（2026-05-17）by Claude — 例句翻譯配對修正 + 字卡 lag + 多語字典

### 根因：例句配到別句的翻譯

`parseCambridge` 用 `pickBestCambridgeExample` 從整頁挑分數最高的英文例句，但 `exampleZh` 是**另一段** regex 抓「第一個」例句後面的翻譯——兩者不是同一組，導致例句配到不相干的翻譯。

**修法**（`server.js`）：

- 移除 `pickBestCambridgeExample` + 獨立 exampleZh 抓取
- 新增 `pickBestCambridgeExamplePair(html, word)`：用單一 regex 一次抓「`eg deg` 例句 + 緊鄰的 `trans` 翻譯」當一組；評分時「有附翻譯」+500 優先；回傳 `{ example, exampleZh }` 同組
- `parseCambridge` 直接回傳這組配對
- 若英文被切句（splitOccurred），保守把 exampleZh 設空（避免錯配），改由後續 MyMemory 處理
- 結論：Cambridge 雙語字典自帶的翻譯**直接貼上**，不再機翻（符合使用者要求）
- `CACHE_SCHEMA_VERSION` 升到 `v2`，舊的錯配快取自動失效

### 字卡 lag（`app.js`）

- 新增 `prefetchStudyWords(items)`：並行打 `/api/cambridge` 預抓全部 10 字，最久 5 秒後重 render
- `createStudySession` 建立 session 時就 prefetch → 進字卡時資料已到位
- 字卡 modal（弱點點擊）開啟前也 prefetch 該字

### 例句翻譯配對（`app.js applyDictionaryEntry`）

- 新增 `item.exampleZhFor` 欄位記錄翻譯對應的英文例句（前 60 字）
- example 換新 → exampleZh 強制用本次 entry，不 fallback 舊值
- 既存翻譯與目前例句 hash 對不上 → 清空

### 多語字典（前面階段 + 本階段）

- 語言選單移除 English，加入 한국어 / Español（共 zh-Hant / ja / ko / es）
- `server.js` 依 lang 選 Cambridge URL（english-chinese-traditional / english-japanese / english-korean / english-spanish）+ MyMemory 對應語碼
- i18n 補齊 ko / es 全套；ja 殘留中文翻完
- 硬編常數（levels / RANK_TITLES / battleRankTitle / goalLabels / 成就 tier 名稱與條件）全部改成依語言查表
- 分級測驗已由 codex 移除

### 給使用者的提醒

- **自訂單字庫的舊資料**仍存著之前錯配的翻譯，需到「自訂專區 → 重新查字典」刷新
- 內建字庫每次開 session 會自動 prefetch 新資料（cache v2），不用手動
- 若仍有錯：停 server → 刪 `data/lookup-cache.json` → 重啟

---

## 階段 1（2026-05-15）by Claude

### 完成項目

#### A. 產出 ROADMAP.md（檔案：`ROADMAP.md`）

把工作清單分三大類整理好，按使用者指定的優先順序：**內容 → 遊戲機制 → 演算法**，另外把 `需求.txt` 既有未修項放在最前面作為 P0 bug fix 區塊。每項都標檔案位置、難度、優先、狀態。

#### B. 實作 SRS 間隔重複演算法（對應 ROADMAP #3-1 / 3-2 / 3-3 / 3-4）

**改的檔案：只有 `app.js`**（單一檔案專案，沒拆模組）

具體變更：

1. **新增 SRS 模組區塊**（`app.js` 約 line 403 ~ 510，插在 `levels` 常數之後、`goals` 之前）
   - 常數：`SRS_DEFAULT_EASE=2.5`、`SRS_MIN_EASE=1.3`、`SRS_MAX_EASE=2.8`
   - `srsAddDays(dateStr, days)` — 日期工具
   - `srsEnsureEntry(profile, wordText)` — 確保某字有 SRS 紀錄，新字預設 `nextReview = TODAY`
   - `srsUpdate(wordText, isCorrect, opts)` — SM-2 lite 核心更新邏輯
   - `srsDueWords(profile, source)` — 取得到期字
   - `srsDueCount()` — dashboard 顯示用
   - `srsMigrateFromLearnedLog(profile)` — 把舊資料（learnedLog / weak）轉成初步 SRS 狀態

2. **i18n 字串**：三種語言（zh-Hant / en / ja）都加 `srsDue` 與 `srsAllClear`

3. **`ensureProfile()` 加 `srs: {}` 欄位**（line ~847）以及防呆補欄位（line 857）

4. **`migrateState()` 對所有 profile 跑一次 `srsMigrateFromLearnedLog`**（line ~870-874）

5. **`answerStudy()` 答對 / 答錯都呼叫 `srsUpdate`**（line ~2098, 2104）

6. **`answerQuiz()` 加 `srsUpdate` 呼叫**（line ~1996-1998），placement 測驗不計入（純測試）

7. **`buildDailyWords()` 完全重寫**（line ~1891-1916）：
   - 第一優先：取所有 `nextReview <= TODAY` 的字（最舊的最該複習），最多 10 個
   - 第二優先：補新字（SRS 內沒紀錄的）
   - 還不夠才從 study pool 補
   - 總題數上限 12

8. **`renderDashboard()` 顯示「今日要複習 N 字」**：
   - 每日測驗按鈕：`Daily (N)` 形式（line ~1149）
   - 今日進度卡片新增一行 `srsDue / srsAllClear`（line ~1143）

### SRS 設計參數（給人類 reviewer / codex）

| 情境 | reps | interval | ease |
|------|------|----------|------|
| 答對第 1 次 | +1 → 1 | 1 天 | +0.05 |
| 答對第 2 次 | +1 → 2 | 3 天 | +0.05 |
| 答對第 3+ 次 | +1 | `round(prev × ease)` | +0.05 |
| 答對且夠快（opts.fast=true）| 同上 | 同上 | +0.10 |
| 答錯 | 歸 0 | 1 天 | −0.20 |

Ease 上下限：`[1.3, 2.8]`。`opts.fast` 介面已留好，**目前還沒接「答題秒數判斷」**，要做 ROADMAP #3-9 時直接傳 `srsUpdate(word, true, { fast: true })` 即可。

### 沒做、需要 codex 注意

- **語法檢查未能跑成功**：bash mount 對 `C:\english-word-quest\` 這個資料夾有 FUSE 快取 bug，讀到截斷的舊內容（85974 bytes 卻只回傳 ~80kb 有效資料），導致 `node --check` 失敗於 line 2079 的 `window.speechSynthesi`。**這不是我編輯造成的語法錯誤** — 透過 Read 工具看到的檔案完整（2229 行，最後到 `shuffle()` 函式定義收尾乾淨）。建議 codex 在本機跑一次 `node --check app.js` 確認；如果 mount 同步問題仍在，請改用 PowerShell 直接執行 `node --check`。
- 沒做 ROADMAP #3-5（SRS 視覺化），那是 P3。

### 怎麼驗證 SRS 真的有運作

1. 開瀏覽器到 `http://localhost:5173/`（先跑 `node server.js`）
2. 完成分級測驗 → 進 dashboard
3. 按「學習 10 字」做完一輪
4. 打開 DevTools → `JSON.parse(localStorage.getItem("vocab-arcana-progress")).goalProfiles[活躍目標].srs` 應該看得到每個學過的字都有 `{ ease, interval, reps, nextReview, ... }`
5. 回 dashboard，「今日要複習」應該顯示 0（剛全答對的話）或剛剛答錯的字數
6. 答錯一題後，那個字的 `interval` 應該變 1、`ease` 應降到 2.3 左右

---

## ROADMAP 進度總覽

下一個建議動工順序：
1. **0-1, 0-2, 0-4, 0-5**（先把使用者 `需求.txt` 已提的 bug 收掉）— 還沒動
2. ✅ **3-1 ~ 3-4**（SRS）— 本階段完成
3. **0-6**（排行榜 + 人機）
4. **2-2**（戰鬥 = 答題）
5. **1-1**（單字擴充至 300）

---

## 階段 N（保留給 codex 接下去）

> codex 動工時請在下方新增區塊，照以下格式：
>
> ```

## 階段 19（2026-05-17）by Claude — 刷新條件 / 週測驗解鎖 / 弱點字卡 / 完整例句

### 完成

#### A. 刷新單字加每日測驗 70% 條件（`app.js`）

`todayLockComplete(libraryId)` 多加一條：今日的 `profile.dailyTests[todayKey()]` 必須存在且 `correct/total >= 0.7`。沒做每日測驗或答對率不足 → 按鈕不顯示。

#### B. 週測驗每 7 天解鎖 + 登入彈窗（`app.js`）

- `weeklyTestAvailable()` 加條件：`state.achievements.totalLoginDays > 0 && totalLoginDays % 7 === 0`
- 新增 `shouldShowWeeklyNotice()`：可考且該 7 天節點還沒被標記過
- 新增 `dismissWeeklyNotice()`：把 `state.weeklyNoticeShownFor = week-N`
- `renderDashboard` 上端加 modal（`.modal-backdrop` + `.modal-card`），標題「週測驗開啟！」內文「已連續學習 N 天」，兩個按鈕「立即測驗 / 等等再說」
- bindActions 加 `dismiss-weekly-notice` 與 `open-weekly-now` handler
- 三語 i18n 加 `weeklyNoticeTitle/Copy/Open/Later`

#### C. 弱點池點擊看字卡（`app.js` + `styles.css`）

- `renderWeak` 內每張卡片改為 `<button data-show-card-word="...">`
- 新 `renderCardModal()` 與 module 變數 `cardModalWord`：點擊卡片 → 設 `cardModalWord` → render 顯示字卡 modal
- Modal 內容：單字、音標、詞性、單字階級、精簡釋義、完整例句、例句中譯、朗讀按鈕、關閉
- 共用 `.modal-backdrop` / `.modal-card` 樣式（與週測驗通知共用）
- bindActions 加 `data-show-card-word` 與 `data-action="close-card-modal"`

#### D. 所有學習字卡保證有完整例句（`app.js` + `styles.css`）

- 新增 `ensureFullExample(item)`：若 example 為空就用 `fallbackExampleSentence(item.word)` 兜底
- `renderStudy` 預覽卡的例句改用 `ensureFullExample(current)`
- 弱點卡片與字卡 modal 都用 `ensureFullExample`
- `.weak-card` CSS：保留卡片外觀但可點擊、hover 微抬

### 檔案變更

- `app.js`：
  - `todayLockComplete` 加每日測驗條件
  - 新增 `shouldShowWeeklyNotice` / `dismissWeeklyNotice`
  - `weeklyTestAvailable` 加 7 倍數條件
  - module 變數 `cardModalWord`
  - 新增 `renderCardModal()` / `ensureFullExample()`
  - `renderDashboard` 上方加 weekly modal 區塊
  - `renderWeak` 卡片改成按鈕
  - `renderStudy` 預覽例句改 ensureFullExample
  - bindActions 加 dismiss-weekly-notice / open-weekly-now / show-card-word / close-card-modal
  - i18n 三語各加 4 個 weekly-notice key
- `styles.css`：加 `.modal-backdrop` / `.modal-card` / `@keyframes modalFadeIn` / `.weak-card`

### 驗證

1. 學完今日 10 字 → 沒做每日測驗 → 刷新按鈕不出現
2. 學完今日 10 字 → 做每日測驗答對 60% → 刷新按鈕不出現
3. 學完 + 每日測驗 ≥ 70% → 刷新按鈕出現
4. 用 admin skip-day 把 totalLoginDays 推到 7 → 重進 dashboard → 應跳出「週測驗開啟！」modal
5. 點 modal「立即測驗」→ 進週測驗；「等等再說」→ 關閉，不再跳（同一週節點）
6. 進弱點池 → 點任一字 → 跳出字卡 modal（完整例句 + 朗讀）→ 點關閉收起
7. 弱點字本來沒例句 → modal 內仍有模板兜底句

---

## 階段 18（2026-05-17）by Claude — 多帳號 / 無效字過濾 / 結算畫面 / 近義過濾 / 清中文夾英

### A. 多帳號各自存 state（`app.js`）

**問題**：登出後另一個帳號登入，等級沒重置 — localStorage 只有一份 state，所有帳號共用。

**修法**：

- 新 storage 結構：`vocab-arcana-store = { activeUserId, users: { [id]: state } }`
- 舊 `vocab-arcana-progress` 自動遷移為 store.users[第一個 id]
- 新增 `userKeyFor(user)`：mock 模式用 `name::小寫名` 當 id
- 新增 `switchUserAccount(name, goal)`：登入按鈕呼叫；若該帳號有 state 就載入，否則建立全新；最後設 activeUserId
- 新增 `freshState()`：完整預設 state（含所有欄位）
- `loadState()` / `saveState()` 全部改為操作 store
- 登出：activeUserId 設 null，但保留 store.users（之後同名登入可恢復）

### B. 過濾匯入的無效字（`app.js`）

**問題**：使用者匯入像 `xqzm` 之類亂打的字，過 regex filter（`[a-z-]+`）後仍被存入，意思變空或 fallback 為單字本身。

**修法**：`lookupWord` 若回傳 entry 沒 meaning、沒 example、sources 為空 → 視為無效，回 `null`，並計入 `stats.rejected`。`saveImportedLibrary` toast 顯示「已濾除 N 個無效字」。

### C. 結算畫面（`app.js`）

新增 `renderQuizSummary()` + screen `quiz-summary`：

- 顯示分類（每日/週/總複習/弱點/背誦）、答對 X/總 Y、答對率、錯題數
- 錯題列表用 `.word-bank` 排版，每題顯示「單字 + 正解」
- 一個「返回地圖」按鈕回 dashboard
- `finishQuiz` 與 `answerStudy`（含 weak training / 一般 recall）結束時將結算資料存進 `state.lastQuizSummary` 然後 navigate 到 quiz-summary
- placement 仍走原本的 `renderResult`（內容更特殊：分等級）

i18n 三語加 `quizSummary` / `quizSummaryTitle` / `wrongCount` / `correctAnswer`

### D. 選項避免幾近相同字義（`app.js`）

**問題**：選項常出現「快速的、迅速的」這類差異不大的詞。

**修法**：`finalizeChoices` 內 candidates 篩選時加 `tooSimilarToAny(value)` 判斷 — 與已選 answers 任一個共享 ≥70% 字符視為「太像」，跳過。若候選不夠 4 個再退讓補滿。新增 `meaningTooSimilar(a, b)` 函式。

### E. 清除中文翻譯中混入的英文字母（`app.js`）

**問題**：字典回的中文釋義中常有英文殘留（"v. 放棄 give up" 之類），顯示時看起來怪。

**修法**：`compactMeaning` 切分後對每個 part 套用新 `cleanChineseMeaning(part)`：

1. 去掉 POS 縮寫 (`v.` / `n.` / `adj.` 等)
2. 去掉連續 Latin 字串（含空白與連字號）
3. 去掉孤立 ASCII 標點殘留
4. 清空白
5. 最後過濾「必須含至少一個中文字」的 part 才保留

若全 part 都被過濾掉 → 回原文（fallback），不會變空字串。

### 檔案變更

- `app.js`：
  - storage 層重寫（`loadState` / `saveState`），新增 `userKeyFor` / `switchUserAccount` / `freshState`
  - `lookupWord` 加無效字過濾
  - `parseImportedWords` stats 加 `rejected`
  - `saveImportedLibrary` toast 加 importRejected
  - 新增 `renderQuizSummary` + screen 路由
  - `finishQuiz` 重構：daily/weekly/review/weak 都進 summary
  - `answerStudy` 加 mistakes 追蹤 + 結束進 summary
  - `finalizeChoices` 加近義過濾
  - 新增 `meaningTooSimilar` / `cleanChineseMeaning`
  - `compactMeaning` 重寫加清洗步驟
  - i18n 三語各加 5 個 key

### 驗證

1. 帳號 A 累積 XP → 登出 → 用帳號 B 登入 → XP / 等級應該歸零；再登出 → 登回 A 應該回到原 XP
2. 匯入一組亂打的字（`zxqv abcde xyzwq`）→ toast 應顯示「已濾除 N 個無效字」，這些字不會進庫
3. 結束任何測驗 → 進到結算畫面，看到分類、答對率、錯題清單；按返回回 dashboard
4. 開測驗 → 選項中不再有「快速的、迅速的」這類近義並列
5. 開學習卡或測驗 → 中文釋義中不再夾雜「v.」「give up」之類英文殘留

---

## 階段 17（2026-05-17）by Claude — 測驗題目+選項字義一律精簡

### 背景

使用者截圖：背誦測驗第 6 題顯示「____（趕快; 匆忙）」——一個沒有可用例句的單字 fallback 成「____ (中文釋義原文)」格式，而且字義沒精簡所以兩個都被秀出來。

### 修法（都動 `app.js`）

1. **`clozePrompt(item)`**：沒例句時 fallback 從「`____ (中文)`」改為「直接顯示精簡後的中文意思」當題目（拿掉「____ (... )」的視覺干擾），且呼叫 `compactMeaning`
2. **`buildQuestion` (meaning 分支)**：`correct: compactMeaning(item.meaning)`
3. **`buildMeaningChoices`**：`correctValue` 與所有 distractor meaning 都套 compactMeaning
4. **`finalizeChoices`**：所有 meaning 候選池都套 compactMeaning（避免「答案是精簡版但選項是長版」對不上）
5. **`renderStudy` 題目本體**（`isWordChoice` 時顯示中文當題目）也套 compactMeaning

### 為什麼要在多處套用

`current.correct` 是按 hash 比對的字串。如果顯示是精簡版但 correct / choices 是長版，按下按鈕 `dataset.studyAnswer === dataset.correct` 比較就會 mismatch。所以一定要在 buildQuestion / buildMeaningChoices / finalizeChoices 與 render 兩端統一套。

### 驗證

- 重新進「學習 10 字」做背誦測驗 → 題目不再有「____ (長串中文)」
- 答對的選項與正解對得上，不會出現「明明選了正確答案卻被判錯」

---

## 階段 16（2026-05-17）by Claude — 每日純字義 / 週測驗 / 排行返回上移 / 刷新單字

### 完成

#### A. 每日測驗只出字義互換題（`app.js / createQuiz`）

需求：每日測驗單純考字義互換，克漏字留給總複習。修法：

- `createQuiz` 的題型決定改為：
  - `daily` → 永遠 meaning
  - `weekly` → 混合 meaning + cloze（有 cloze 時奇數題 cloze）
  - `review` → 混合
  - `placement` → 交替（若有 cloze）
- 結果：每日測驗不再出現 cloze 題

#### B. 新增週測驗 5 分鐘（`app.js`）

- 新增 `buildWeeklyWords()`：篩 `profile.learnedLog` 內過去 7 天學過的字 → 轉成 word object → 取最多 20 字
- 新增 `weeklyTestAvailable()`：判斷是否有本週學過的字可考（給按鈕禁用條件）
- `createQuiz` 加 `kind === "weekly"` 分支，duration 300 秒（5 分）
- `screen === "weekly"` 路由 → `renderQuiz("weekly")`
- i18n 三語加 `weekly` / `weeklyTitle` / `weeklyHelper`
- `renderQuiz` 的標題/說明/eyebrow 加 weekly 分支
- Dashboard 學習區加「週測驗」按鈕（在每日測驗旁邊），無本週字時 `disabled`
- `bindActions` 加 `data-action="weekly"` handler
- `finishQuiz` 加 weekly 分支：寫到 `profile.weeklyTests[todayKey()]`（不蓋 dailyTests）

#### C. 排行榜返回按鈕移到上方（`app.js / renderRanking` + `styles.css`）

`renderRanking` 內把 actions 區塊從底部搬到 panel 頂端（eyebrow 上面）；CSS 新增 `.ranking-top-actions` 拿掉預設的 margin-top、給 margin-bottom 隔開。

#### D. 「再來一輪」改名「刷新單字」+ 完成條件（`app.js`）

- i18n key `nextRound` 三語都改成「刷新單字 / Refresh words / 単語をリフレッシュ」
- 新增 `todayLockComplete(libraryId)`：當日鎖定的 10 字是否都在 `profile.learned` 內
- Dashboard 顯示條件從「有當日鎖定」改為「今日 10 字全部學完」→ 防止使用者中途亂跳

### 檔案變更

- `app.js`：
  - `createQuiz` 改題型邏輯 + 加 weekly 分支
  - 新增 `buildWeeklyWords()` / `weeklyTestAvailable()`
  - render 路由加 weekly
  - i18n 三語加 weekly 相關 key
  - `renderQuiz` 標題/說明加 weekly
  - dashboard 加週測驗按鈕
  - bindActions 加 weekly handler
  - `finishQuiz` 加 weekly 分支
  - `renderRanking` 返回按鈕移到頂部
  - i18n `nextRound` 三語改字
  - 新增 `todayLockComplete()`
  - dashboard 刷新單字按鈕顯示條件改用 `todayLockComplete()`
- `styles.css`：加 `.ranking-top-actions`

### 驗證

1. 進「每日測驗」答題 → 全部題目應該是「英文字 → 4 個中文選項」或反過來，**不會有 ____ 填空題**
2. 學一些字 → 進 dashboard 看到「週測驗」按鈕 active（沒學過字時 disabled）→ 點進去能做 5 分鐘版測驗，題目混 meaning + cloze
3. 進排行榜 → 返回按鈕在**頁面頂部**而不是底部
4. 進學習 10 字 → 全部答對學完 → 回 dashboard → 看到「刷新單字」按鈕（之前的「再來一輪」）；中途離開 → 按鈕不會出現

---

## 階段 15（2026-05-17）by Claude — 字義精簡 / 移除字卡圖 / 徽章變化 / 全達成華麗框

### 完成

#### A. 字義精簡（`app.js`）

字典回的釋義常常一串列「放棄；遺棄；拋棄；丟棄；不再使用」太長，新增 `compactMeaning(raw)` 只挑 1-2 個常用 + 合併相近：

- 切分依據：`;；,，、/` 與英文 `or/and`
- 去掉常見贅字（`to / a / an / the` + 開頭括號註解）
- 相似判定 `isSimilarMeaning(a, b)`：共享字元 ≥ 60% 視為近義 → 跳過
- 取前 2 個非近義；合起來若 > 16 字只留第 1 個
- 套用位置：
  - 儲存層：`importedWordFromEntry` 與 `refetchCustomLibrary` 寫入前先精簡
  - 顯示層：`renderStudy` 預覽卡、`renderWeak`、`renderCustomLibraryView` 即時精簡（讓舊資料也能顯示短版）

#### B. 移除學習字卡圖片（`app.js` + `styles.css`）

需求：「如果沒辦法每個詞生一張圖就把圖移走」。新版 study 預覽卡：

- HTML 拿掉 `.flash-visual` div（連同 `cardImage()` 背景與 emoji badge）
- 加 `.flashcard-textonly` class，CSS 改成單欄滿版置中
- 加遊戲風裝飾：紙質徑向漸層 + 雙線描邊 + 四角金色 corner ornament
- 例句、釋義都置中，例句靠左對齊但限寬 720px

#### C. 每個小目標不同徽章圖案（`app.js`）

`badgeSvg(icon, done, tierIndex)` 新增 tierIndex 參數：

- 新增 `BADGE_VARIANTS` 常數：8 個 icon group × 6 個 tier 各自 SVG path
  - sword：劍 → 彎刀 → 寬劍 → 矛 → 戰斧 → 巨劍
  - flame：單焰 → 雙焰 → 三焰 → 環焰 → 環中焰 → 十字焰
  - sun：太陽 → 八角 → 月 → 雙月 → 星群 → 星環
  - hourglass：沙漏 → 鐘 → 環中環 → 雙圈 → 鑽石 → 多層圓
  - crown：5 階王冠（含寶石、星徽、雙環、三寶石）
  - monster：6 階獸首（眼睛、犬齒、利爪、惡魔角、巨牙）
  - book：6 階書（書本 → 展開頁 → 攤平 → 三本書 → 寶藏箱 → 含星徽）
  - gate：5 階門（單門 → 雙門 → 三層 → 含寶珠 → 大教堂含星徽）
- `achievementBadgeMeta` 回傳新增 `tierIndex` 欄位
- `renderAchievements` summary 用 `tiers.length - 1`（最高 tier 圖案）；earned / locked chip 用各自 tier 的真實 index；dashboard 上的裝備徽章用 `equipped.tierIndex`

#### D. 全達成華麗外框（`styles.css`）

`group.complete` 時加 `.badge-mythic` class，CSS 動畫：

- 邊框雙層 padding-box / border-box 漸層（白金 → 暗金 → 暗紅 → 暗金 → 白金）
- `mythicFlow` 8 秒 ease-in-out 無限循環，邊框顏色流動
- 偽元素 ::before 加金紅徑向漸層暈光 + `mythicShimmer` 透明度呼吸
- 徽章 SVG 加 drop-shadow 金光 + `mythicSpinSlow` 12 秒無限旋轉
- 標題 h3 加金色 text-shadow
- 卡片外發 0 0 22px 金光 + 12px 重影

### 檔案變更

- `app.js`：
  - 新增 `compactMeaning` / `isSimilarMeaning`
  - `importedWordFromEntry` / `refetchCustomLibrary` 寫前精簡
  - 顯示層三處（`renderStudy` 預覽、`renderWeak`、`renderCustomLibraryView`）即時精簡
  - `renderStudy` 預覽拿掉 `.flash-visual`，加 `.flashcard-textonly` class
  - 新增 `BADGE_VARIANTS` 常數（~48 個 SVG path）
  - `badgeSvg` 加 `tierIndex` 參數
  - `achievementBadgeMeta` 回傳 `tierIndex`
  - `renderAchievements` 三處 badge 渲染都傳 tierIndex
  - dashboard 裝備徽章傳 `equipped.tierIndex`
- `styles.css`：
  - 加 `.flashcard.flashcard-textonly` 樣式（含 corner ornament）
  - 加 `.achievement-group.badge-mythic` 動畫 + keyframes (mythicFlow / mythicShimmer / mythicSpinSlow)

### 驗證

1. 重啟 server、清快取，重抓任一單字 → 釋義應該短到 1-2 個意思
2. 開「學習 10 字」預覽卡 → **不應該有左半部圖片區**，整張卡置中文字 + 四角金色裝飾
3. 開「成就」頁 → 各分類 icon 是不同變體（例：累計答對的 tier 6 是巨劍而不是 sword）
4. 把某分類全部 tier 達成（用 admin 加 XP 或答對足夠題目）→ 該卡應該有金光流動邊框 + 徽章緩慢旋轉

### 沒做

- 沒做「字義英文 fallback 翻不到時也精簡」（compactMeaning 對英文一樣 work，但效果不如中文好）
- 沒做徽章 hover 預覽放大（之後可選）
- mythicSpinSlow 12 秒慢轉若會干擾使用者可調慢或拿掉

---

## 階段 14（2026-05-17）by Claude — 例句嚴格化 / 成就擴張 / 同分同名次 / UI 遊戲化

### 完成

#### A. 例句一定要完整句子（`server.js` + `app.js`）

之前的 `pickBestExample` 是「打分排序」，所以即便最高分仍可能是個片語。新版規則：

- `server.js / pickBestExample`：**先嚴格篩**只保留同時滿足這四項的候選——大寫/引號開頭、結尾標點、≥5 字、不含 `/` 或 `;`；過不了就回空字串
- `server.js / parseCambridge`：新加 `isCompleteSentence()`，Cambridge 例句也要過這關才採用
- `app.js / importedWordFromEntry` 與 `refetchCustomLibrary`：example 為空時自動用 `fallbackExampleSentence(word)` 生成模板句（6 個範本，依字 hash 固定）

例如 `bird` 之前回 `caged / wild birds`（片語列舉）→ 現在會跳過該候選；若沒其他合格句，就顯示 `Many students struggle with the word "bird".` 之類的模板句。

#### B. 成就擴充（`app.js`）

`achievementDefinitions` 改寫：

- 既有 6 個分類由 1-3 個 tier 擴到 4-7 個（accumulated 答對、連擊、連登、累計登入、打怪、自訂庫、總複習）
- 新增 4 個分類：
  - `totalLearned` 已學單字總數（彙總所有目標的 `profile.learned`）：6 個 tier 從 10 字到 1000 字
  - `srs` SRS 深度精通（彙總所有 srs 紀錄中 reps ≥ 3 的字數）：4 個 tier
  - `customWords` 自訂單字累計（彙總所有自訂庫的 words.length）：4 個 tier
  - `rankTier` 排行榜段位（讀 `state.rankTier`）：4 個 tier，對應到 RANK_TITLES 命名

#### C. 排行榜分數相同 → 同名次（`app.js`）

`renderRanking` 內：

- 新增 `computeRanks(items, key)`：「競技排名」(competition ranking)；同分共享名次，下一名跳過被佔的編號（1, 1, 3, 4...）
- 顯示與排序鍵嚴格對齊（前一輪已修）
- `ensureRankingWeek` 升降邏輯也改用同分同名次計算：玩家排名 = (嚴格大於玩家分數的人 + 1)；同分的 rival 跟玩家一起算「進入前三」

#### D. UI 遊戲化（`styles.css` + `index.html`）

`index.html` 加 Google Fonts 載入 Cinzel（西式 RPG 風 serif）與 Noto Serif TC（繁中襯線）。`styles.css` 在檔尾新增「遊戲化 UI 強化」區塊，覆蓋現有 class：

- **按鈕**：浮雕、hover 浮升、active 凹陷、Cinzel 字型、文字陰影；secondary 改成羊皮紙金、learning 改成翠玉綠、adventure 改成赤焰紅
- **Panel**：雙線描邊 + 內金線 + 四角金色裝飾 + 紙質徑向漸層
- **Page title**：Cinzel 字體、金色陰影描邊、深棕主色
- **Eyebrow**：兩側金色漸層裝飾線、Cinzel 字型、暗紅主色
- **HUD 數字**：Cinzel 粗體、金色發光
- **排行榜行**：左邊金色邊條、玩家行加紅色高亮 + 金色光暈
- **進度條**：金色三段漸層 + 微光
- **Tag**：徽章感（金色 / 暗木 + 金邊）
- **Toast / 動畫文字**：Cinzel + 紅金雙陰影
- 卡片 hover 微抬

### 檔案變更

- `server.js`：`pickBestExample` 嚴格化 + `isCompleteSentence` + Cambridge 例句過濾
- `app.js`：
  - `fallbackExampleSentence(word)` 新增
  - `importedWordFromEntry` 與 `refetchCustomLibrary` 用 fallback
  - `achievementDefinitions` 大幅擴張
  - `renderRanking` 內 `computeRanks` + 顯示同名次
  - `ensureRankingWeek` 升降判定改同分同名次邏輯
- `styles.css`：檔尾「遊戲化 UI 強化」區塊（~200 行）
- `index.html`：加 Google Fonts link

### 驗證

1. 重啟 server、清快取 `data/lookup-cache.json`，匯入 `bird, dog, cat` 等簡單字 → 例句應全是完整句（即便來源回片語也會被跳過或用模板）
2. 進「成就」頁面 → 應看到 ~12 個分類、每個 4-7 個 tier
3. 進「排行榜」→ 若有同分的人和你並列，他們應該顯示相同名次數字
4. 視覺：按鈕應該有立體浮雕效果、hover 會微浮升、page title 有金色陰影、panel 四角有金色裝飾線

### 沒做、待後續

- 沒處理「字義必須是中文」的硬性過濾（仍可能有英文 fallback meaning 沒翻成中文，會走 MyMemory；若 MyMemory 限流就會留英文）
- 沒加排行榜的「重置倒數時間」顯示
- 動畫保守處理（沒加粒子或翻牌動畫），怕影響效能

---

## 階段 12（2026-05-17）by Claude — 自訂專區 + 查看單字庫 + 段位加權選字

### 背景

使用者抱怨 codex 修改後字典系統壞掉。我用 Read 工具看 `server.js` 跟 `app.js` 的 lookup 相關函式，內容仍與我的版本一致；bash mount 看到的截短是先前確認過的 FUSE 快取問題。若使用者實際遇到字典回不對，最可能是 `data/lookup-cache.json` 殘留壞的快取項目；建議刪除該檔重啟 server。本階段未動 server，只處理 `需求2.txt` 的 #3 和 #5。

### 完成項目

#### A. 自訂專區（custom-hub）— 需求2 #3

把 dashboard 上散落的「匯入單字」「自訂單字測驗」收成單一入口「自訂專區」。

- Dashboard：拿掉 `data-action="custom-study"` 和 `data-action="import"` 兩顆按鈕，改放一顆 `data-action="custom-hub"`（顯示已建立的庫數量）
- Library-panel 內的快速「匯入單字」也拿掉（避免重複入口）
- 新 handler `data-action="custom-hub"` 與舊 `data-action="custom-study"` 都導向 `screen="custom-study-select"`（向下相容）
- `renderCustomStudySelect()` 改寫為一個真正的 hub：
  - 標題改成「自訂單字專區」
  - 頂部按鈕：匯入新單字 / 查看全部單字
  - 每個庫卡片有 4 個動作：學習 / 查看單字庫 / 重新查字典 / 刪除
  - 顯示「N 字釋義不全」提示
  - 空庫時提示「先匯入一組吧」

#### B. 查看單字庫頁面 — 需求2 #3

`renderCustomLibraryView()` 重寫支援兩種模式：

- 從 hub 點具體某個庫的「查看單字庫」→ 設 module 變數 `viewingLibraryId` → 只顯示該庫
- 從 hub 點「查看全部單字」→ `viewingLibraryId = null` → 顯示所有庫的所有字

每個字顯示：英文、音標、詞性、繁中釋義、英文例句、例句中譯（若有）。版面用新 CSS class `.word-bank-row` / `.word-bank-main` / `.word-bank-meaning` / `.word-bank-example` / `.word-bank-example-zh` 排版整齊。

#### C. 學習分配按段位加權 — 需求2 #5

原本 `createStudySession` 是「從 unseen 純隨機抽 10 個」。改為依玩家分級測驗結果加權：

- 抽出 `TIER_WEIGHTS_BY_LEVEL`（段位 1-5 各對 tier 1-5 的權重表）：
  - Lv1: 簡單字權重高 `[6,4,2,1,1]`
  - Lv3: 中等字權重高 `[2,4,5,3,2]`
  - Lv5: 困難字權重高 `[1,1,2,4,7]`
- 新增 `tierWeightedSample(pool, count, levelId)` 通用函式（任何 word pool 都能套用）
- 弱點字額外 ×3 boost（之前是 ×4）
- `weightedStudyWords` 改為呼叫 `tierWeightedSample`（DRY）
- `createStudySession`：抽當日 10 字時改用 `tierWeightedSample(unseen, 10, playerLevel.id)`
- 內建庫與自訂庫都套用（自訂字的 level 由 `importedWordFromEntry` 依字長估算 1-5）

### 檔案變更

- `app.js`：
  - module 變數 `viewingLibraryId`
  - `renderDashboard` 移除 `custom-study` 和 `import` 按鈕、加 `custom-hub`
  - `renderCustomStudySelect` 改為 hub 樣式
  - `renderCustomLibraryView` 支援 viewingLibraryId 單庫模式 + 完整單字資訊
  - 新增 `TIER_WEIGHTS_BY_LEVEL` 常數
  - 新增 `tierWeightedSample(pool, count, levelId)`
  - `weightedStudyWords` 重構為呼叫上述
  - `createStudySession` 抽字改用 `tierWeightedSample`
  - `bindActions`：`custom-hub` 加入 selector；`data-open-custom-library` 設定 `viewingLibraryId`；`data-action="custom-library-view"` 清空它
  - i18n 三語各加 6 個 key（customHub / customHubTitle / customHubCopy / customHubEmpty / viewAllLibraries / viewLibraryCopy / noMeaning + viewWordLibrary 統一）
- `styles.css`：加 `.word-bank-main` / `.phonetic-inline` / `.tag-pos` / `.word-bank-meaning` / `.word-bank-example` / `.word-bank-example-zh` / `.library-view-card` / `.library-view-head` / `.library-header`

### 驗證

1. Dashboard 學習區只剩：學習10字 / 每日測驗 / 弱點 / 總複習 / 自訂專區（再來一輪只在有當日鎖定時出現）
2. 點「自訂專區」→ 看到匯入新單字 + 查看全部單字 + 每個庫的卡片（含 4 顆動作按鈕）
3. 對某個庫點「查看單字庫」→ 只看那個庫的字，每字含音標 / 詞性 / 釋義 / 例句 / 例句中譯
4. 在 hub 點「查看全部單字」→ 看到所有庫排列
5. 完成分級測驗後（測得低段位）按「學習 10 字」→ 應該大多是 tier 1-2 的簡單字；如果段位 5 則多 tier 4-5 的難字
6. 弱點池內的字會比一般字更常被抽到

### 需求2 進度

| # | 需求 | 狀態 |
|---|------|------|
| 1 | 選項詞性一致 + 字義相近 + 可用單字庫外的字 | 未做 |
| 2 | 「回上一頁」 vs 「返回地圖」動態 | 部分（codex 已加 `backButtonLabel()`），未檢視覆蓋率 |
| 3 | 自訂專區 + 查看單字庫 | ✅ 本階段完成 |
| 4 | 排行榜每週重置 + 升降級 + 打怪稱號 | 未做 |
| 5 | 分級測驗 → 字彙難度加權 | ✅ 本階段完成 |
| 6 | 弱點加強小測驗 + 答對 2 次出弱點 | 未做 |

下一輪建議做：#1 + #2 + #6（個別小體驗修正），最後再做 #4（排行榜系統）。

---

## 階段 11（2026-05-17）by Claude — 再來一輪 + 庫名 dedup

### 完成

#### A. 「再來一輪」按鈕（`app.js`）

兩處按鈕、不同語意：

1. **Dashboard「學習」區的「再來一輪」**（只在當日已鎖定 10 字時顯示）
   - 點下去 confirm 「今天已學的 10 字會被取代成另外 10 個還沒做過的字。要繼續嗎？」
   - 確認後：刪除 `state.dailyStudy[dailyStudyKey()]` → `createStudySession()` 重抽 10 個 unseen 字
   - **不清 studyHistory**，保證跟之前所有做過的字仍不重複

2. **all-done 畫面的「再來一輪（重複學習）」**（整個字庫做完時顯示）
   - 點下去 confirm 「這個字庫已全部學過。再來一輪會清除學習史，從第一個字重新開始。要繼續嗎？」
   - 確認後：`resetStudyHistory(libraryId)`（清掉跨日學習史 + 當日鎖定）→ 重新從整個字庫挑 10 字
   - 等於完整重來一輪

新 i18n key：`nextRound` / `nextRoundReset` / `confirmNextRound` / `confirmNextRoundReset`（三語）。
新 bindActions：`[data-action="next-round"]` 與 `[data-action="next-round-reset"]`。

#### B. 匯入庫名稱自動去重（`app.js`）

需求：使用者沒取名字 / 取同一個名字時自動加 `(1)(2)`。

實作：新增 `uniqueLibraryName(requested)`：

- 沒輸入 → 用預設 `t("customLibrary")`（「自訂單字庫」/ "Custom Library" / 「カスタム単語帳」）
- 與既有撞名 → 取 base 名（剝除既有 `(n)` 後綴），從 (1) 開始往上找第一個不衝突的 → 回傳
- 例：第一次匯入「TOEIC」→ 名稱「TOEIC」；第二次也叫「TOEIC」→ 變「TOEIC (1)」；再來 → 「TOEIC (2)」
- 沒取名字反覆匯入 → 「自訂單字庫」、「自訂單字庫 (1)」、「自訂單字庫 (2)」…

`saveImportedLibrary` 開頭呼叫一次。

### 檔案變更

只動 `app.js`：
- `renderDashboard()` 加 next-round 按鈕（條件渲染）
- `renderStudy()` all-done 分支加 next-round-reset 按鈕
- `bindActions` 加 next-round 與 next-round-reset handler
- 新增 `uniqueLibraryName(requested)`
- `saveImportedLibrary` 改用 uniqueLibraryName
- i18n 三語各加 4 個 key

### 驗證

1. 匯入單字 → 取名「TEST」 → 完成 → 再匯入一次取名「TEST」 → 應出現「TEST (1)」
2. 匯入單字不取名字 → 出現「自訂單字庫」 → 再匯入不取名字 → 「自訂單字庫 (1)」
3. 學「學習 10 字」做完 → 退回 dashboard → 看到「再來一輪」按鈕（在「學習 10 字」旁邊）→ 點下去 confirm → 開始學另外 10 個沒做過的字
4. 把整庫做完 → 看到「這個字庫已全部學過」畫面 → 點「再來一輪（重複學習）」→ confirm → 從整庫重新挑 10 字

### 沒做

- 沒在自訂單字測驗的選庫頁面加「再來一輪」（all-done 畫面已有，UI 上夠用）
- 沒做「自動往下挑下一個 10 字」流程（要使用者手動點再來一輪）。如果想要無感連續學，可以做「按下 next-round 直接開新 session」自動接續，但會跟「每日鎖定」概念衝突

---

## 階段 10（2026-05-17）by Claude — 例句完整性 + 每日鎖定/不重複

### 修了什麼

#### A. `server.js`：例句優先挑完整句子

使用者反映 `bird` 的字卡例句顯示為 `caged / wild birds`（明顯是片語列舉而非完整句子）。原因：dictionaryapi.dev 的單一 entry 第一個 definition 例句剛好是片語。修法：

- `fetchDictionaryApi` 改為「遍歷所有 entries 與所有 meanings.definitions」收集 example 候選
- 新增 `pickBestExample(meanings, word)` 評分排序：
  - 完整句子（大寫開頭 + 結尾標點 + ≥4 字）+1000 分
  - 例句包含目標字 +200 分
  - ≥5 字 +50 分
  - 字數本身加分（上限 25）
  - 含斜線 `/`（多半是片語列舉）−30 分
- 排序後取最高分

效果：`bird` 應該會選到類似 `The bird flew over the trees.` 而不是 `caged / wild birds`。

#### B. `app.js`：每日學習鎖定 + 跨日不重複

需求：「每天登入完全更換學習字彙、不能跟之前做過的重複」。

原本行為：每次按「學習 10 字」都重抽 10 個，且 unseen 空了會自動 reset 讓使用者重學一輪（會重複）。新版：

- **新增 `state.dailyStudy[dailyKey]` 紀錄當日鎖定的 10 字**
  - `dailyKey = ${todayKey()}::${libraryId|'built-in'}::${activeGoal()}`
  - 每個 (日期, 庫, 目標) 組合一組
- **`createStudySession` 流程改成**：
  1. 先看當日鎖定有沒有 → 有就回那 10 字（同日重複按按鈕看到相同字）
  2. 沒有就從「跨日 `studyHistory` 之外的 unseen 字」挑 10 個 → 寫進 dailyStudy（鎖定）+ studyHistory（防止未來重複）
  3. 若 unseen 為空 → 進入新的 `phase: "all-done"`（顯示「這個字庫已全部學過」畫面），**不再自動 reset**
- **新增 `renderStudy()` 的 all-done 分支**：勾自訂庫時不顯示「每日測驗」按鈕（因為每日測驗是內建字庫的概念）
- `resetStudyHistory(libraryId)` 仍保留（給 admin/除錯）；現在也會清掉對應的 dailyStudy 鎖定

效果：
- 同一天反覆按「學習 10 字」 → 看到一樣的 10 字（避免使用者誤觸重抽）
- 隔日按 → 自動換新 10 字，且不會跟昨天那 10 字重複
- 全部學完 → 顯示「已學完」畫面，可去「每日測驗」複習 SRS 到期字 / 弱點池

### 檔案變更

- `server.js`：
  - `fetchDictionaryApi` 改為遍歷所有 meanings
  - 新增 `pickBestExample(meanings, word)`
- `app.js`：
  - 新增 `dailyStudyKey(libraryId)`
  - 重寫 `createStudySession()` 加入當日鎖定邏輯
  - `resetStudyHistory()` 也清 dailyStudy
  - `renderStudy()` 加 all-done 分支
  - `loadState()` fallback 加 `dailyStudy: {}`
  - `migrateState()` backfill `dailyStudy`
  - i18n 三語加 `allDoneTitle` / `allDoneCopy`

### 給使用者 / codex 的驗證

1. 重啟 `node server.js`
2. 對「bird」之類常見字按「重新查字典」（在自訂單字測驗頁面）→ 例句應變成完整句子
3. 進「學習 10 字」→ 記住那 10 個字
4. 退出 → 再進「學習 10 字」→ 應該看到**相同的 10 字**（鎖定生效）
5. 改系統時間到明天 → 再進「學習 10 字」→ 應該看到**完全不同的 10 字**（且沒有任何字跟昨天重複）
6. 重複到把整個字庫做完 → 應看到「這個字庫已全部學過」畫面，而不是又從第一個字重來

### 沒做、待後續決定

- 沒提供「忽視當日鎖定強制重抽」的 UI 按鈕（少數使用者可能想連背 20 字）。需要的話可加個「再來一輪」按鈕，呼叫 `resetStudyHistory` 並關掉鎖定
- 沒做 dailyStudy 的歷史清理（會無限累積，但每筆只是 10 個 wordText 字串，1000 天也才 ~50KB）；之後可加每月一次的清理
- Cambridge 抓回來的例句也可能有片語問題，但目前 Cambridge 只是「中文釋義」備援，例句以 dictapi 為主

---

## 階段 9（2026-05-17）by Claude — 字典抓不到的後續診斷 + 人機浮動

### 修了什麼

#### A. 字典查詢主備調換 + 加診斷 log（`server.js`）

階段 7 把 Cambridge 當主來源，但使用者重抓後仍然全失敗。**最可能的原因**：使用者的網路/作業系統環境連 Cambridge 不上（被 Cloudflare 擋、TLS 問題、防火牆等），或 Cambridge 改了 HTML 結構讓所有 regex 失效。

新版策略：

- **主來源換成 dictionaryapi.dev**（純 JSON、最可靠、不會被擋）
- Cambridge 變備援，主要用來「如果有繁中釋義就採用」（比機翻準）
- MyMemory 翻譯英文定義 → zh-TW 兜底
- 加 `console.log` 每一步：URL、status、parse 結果摘要、失敗原因
- **新增除錯端點 `/api/test-lookup?word=X`**：直接回傳每個來源的原始狀態（HTTP code、bytes、HTML 樣本、parse 結果），方便看是哪一層 fail
- `/api/cambridge?force=1` 跳過快取（refetch 按鈕現在自動帶 force=1）
- `Accept-Encoding: identity` 避免拿到 gzip 後無法解
- `LOOKUP_VERBOSE=0` 環境變數可關閉每字 log（預設開）

#### B. 人機分數浮動（`app.js`）

- **原問題**：`advanceRivals` 一天只跑一次，且玩家比較用累積 XP 而非 3 天 XP；對手 XP 一旦設定基本固定，玩家進步後對手不會跟著動
- **改法**：
  - 新函式 `driftRivalsTowardPlayer()`：每次開排行榜都跑，把對手 xp/kills 用 70/30 lerp 朝目標移動
  - 目標 = `playerXp × (1 + strengthBias + 隨機浮動)`，每 10 分鐘換一組隨機 seed → 排行榜每隔 10 分鐘看會洗牌
  - clamp 範圍：對手 xp 永遠在玩家 55%-145% 之間；kills 在 ±5~8 之間
  - 每個對手有固定的 `strengthBias`（-35%~+35%）作為「個性」，所以總是有人比較強、有人比較弱
- `rivalRecentXp()` 也改成依玩家近期 3 天 XP 浮動（不再是死值）
- 舊資料相容：existing rivals 沒有 `strengthBias` 欄位 → ensureRivals 會 backfill

### 檔案變更

- `server.js`：全部重寫，加 verbose logging + test-lookup 端點 + force 參數
- `app.js`：
  - 改 `ensureRivals()` — 加 strengthBias、backfill 舊資料
  - 替換 `advanceRivals()` 內容（保留名稱當 alias）→ 新 `driftRivalsTowardPlayer()`
  - 改 `rivalRecentXp()` — 浮動式
  - 移除 `rivalBoardScore()`（已無人用）
  - `renderRanking()` 改呼叫 `driftRivalsTowardPlayer()`
  - `refetchCustomLibrary()` 加 `&force=1`

### 給使用者 / codex 的診斷步驟

如果重抓後字義還是抓不到，請：

1. **確認 server 真的重啟過**（PowerShell Ctrl+C 後重跑 `node server.js`），看 console 有沒有印：
   ```
   Vocab Arcana running at http://localhost:5173
   Lookup cache: ...\data\lookup-cache.json (N entries)
   Debug endpoint: http://localhost:5173/api/test-lookup?word=abandon
   ```
2. **直接打 debug 端點**：開瀏覽器到 `http://localhost:5173/api/test-lookup?word=abandon`，會回傳 JSON 顯示三個來源各自的 HTTP 狀態：
   - 若 `dictionaryapi` status 不是 200 → 你的網路擋了 api.dictionaryapi.dev（換 DNS 或開 VPN）
   - 若 `cambridge` status 是 0 或 403 → Cambridge 擋了你的 IP / TLS（這個常見，沒關係，dictapi 能撐）
   - 若 `mymemory` status 不是 200 → 機翻會 fail，但至少還有英文定義
3. **看 server console**：每次重抓會印
   ```
   [lookup] abandon → start lookup
   [lookup] abandon dictionaryapi: {"pos":"verb","definition":"to leave...","example":"..."}
   [lookup] abandon mymemory meaning: 放棄
   [lookup] abandon DONE sources= dictionaryapi,mymemory-meaning
   ```
   若看到 `ERROR` 字眼就把整段貼來我看

### 沒做、待 codex 決定

- 沒幫你接付費翻譯（OpenAI / DeepL），MyMemory 限流 5000 字元/日/IP，大量重抓可能會 fail
- 沒做「點對手頭像看更多資訊」，但既然分數會浮動，這個變得比較有意義（可選）
- 排行榜的 `applyRankingPressure` 還在跑（玩家排名第 15 名以後會扣 5 分），目前邏輯沒動

---

## 階段 8（2026-05-17）by Claude — 排行榜 / 分級測驗 / 自訂庫修復

### 修了什麼

#### Bug 1：兩個排行榜沒按數字大小排序
- **根因**：`renderRanking` 的顯示鍵 vs 排序鍵不一致。排序用的 `xpSort = rivalBoardScore(rival, index, "xp")` 是 `rival.xp + (seed % 33) - 16`（加了隨機 noise）；killSort 還把 `rival.kills` 乘 18 倍。但顯示欄位是 `recentXp` / `kills` 沒乘倍率。所以視覺上順序是亂的。
- **修法**：`renderRanking` 直接用顯示值排序（`leaderboardRows(player, rivals, "recentXp")` 跟 `"kills"`）；玩家 `recentXp` 改成 `recentXpTotal()`（3 天 XP）對應榜單名稱；對手用 `rivalRecentXp(rival, index)` 而不是 `rival.xp`（累積），讓 XP 榜真的是「3 天 XP」榜。

#### Bug 2：分級測驗途中可離開
- **根因**：`renderQuiz` 在 `kind === "placement"` 時還是渲染了一顆「開始修練」按鈕，按下去 `data-action="dashboard"` 就直接跳走（且分數還沒算完）。
- **修法**：placement 模式不渲染那顆按鈕；測驗完成 → `renderResult` 才顯示「開始修練」（按鈕也合併為單顆主要 CTA）。

#### Bug 3：自訂單字測驗點下去顯示「沒有學習單字了」
- **根因**：`createStudySession(libraryId)` 用 `profile.learned.includes(item.word)` 過濾。但 `profile.learned` 是以「當前學習目標」為單位累積的（含內建字庫的進度），套到自訂庫上會把使用者剛匯入的字全濾掉——特別是當使用者剛背過內建庫的常見字時。
- **修法**：libraryId 存在時只看 `seen`（本庫的學習史），不再被 `profile.learned` 影響。另外若 `unseen` 為空（這個庫每個字都背過了），自動 `resetStudyHistory(libraryId)` 重新一輪，讓使用者不會卡死。

#### Bug 4（延伸補救）：「重新查字典」與「刪除」按鈕
- 階段 7 修了 server 端字典查詢，但**已經匯入的舊單字庫資料仍然是壞的**（裡面 meaning 是英文字本身 / example 是 placeholder）。使用者要嘛刪掉重匯，要嘛我們提供重新查詢按鈕。
- **新功能**：`renderCustomStudySelect` 每個庫卡片加：
  - 「重新查字典」按鈕：呼叫 `refetchCustomLibrary(libraryId)`，重跑 `/api/cambridge` 把整個庫的 meaning / example / exampleZh / phonetic / pos 全部更新，期間顯示批次進度，結束顯示「完整 X、部分 Y、未取得 Z」
  - 「刪除」按鈕：含 confirm，刪除後若該庫是 active 就退回 built-in
  - 卡片副標自動顯示「N 字釋義不全」（meaning 為空 / 沒中文字 / 沒例句的計數），讓使用者一眼看出哪個庫該重抓

### 檔案變更
- `app.js`：
  - `renderRanking()` 重寫排序邏輯
  - `leaderboardRows()` 簡化（移除冗餘的 xpSort/killSort 重塞）
  - `renderQuiz()` placement 模式拿掉離開按鈕
  - `renderResult()` 結果頁按鈕改成單一「開始修練」CTA
  - `createStudySession()` 自訂庫不再被 `profile.learned` 過濾、加 reset 邏輯
  - 新增 `resetStudyHistory(libraryId)`
  - 新增 `refetchCustomLibrary(libraryId)`
  - `renderCustomStudySelect()` 加重抓 / 刪除按鈕、釋義不全提示
  - `bindActions` 加 `data-refetch-library` / `data-delete-library` handler
  - i18n 三語各加 5 個 key（`refetchLibrary` / `deleteLibrary` / `refetching` / `refetchDone` / `confirmDeleteLibrary`）
- `styles.css`：加 `.library-card` / `.library-open` / `.library-tools` / `.btn.small` / `.btn.danger`

### 需要 codex 協助驗證
1. **沒能在沙盒跑起來測試**（同階段 7：外網被擋）。請在本機：
   - 重啟 `node server.js`（很重要！階段 7 改的程式碼需要重啟才會生效）
   - 進入自訂單字測驗頁 → 對舊庫按「重新查字典」→ 看 toast 進度與最終統計
   - 如果統計顯示「完整 0、部分 0、未取得 N」→ Cambridge / dictionaryapi.dev / MyMemory 全 fail，看 server console；若顯示「完整 ≥ 1」就成功了
2. **排行榜驗證**：開排行榜，看 XP 那欄是否單調遞減；看 Kill 那欄是否單調遞減；玩家位置是否合理（不會莫名跳到第一）
3. **分級測驗**：開始 placement → 確認過程中沒有任何按鈕能跳離 → 答完 → 結果頁應該有「開始修練」按鈕，按下回 dashboard
4. **自訂庫測驗**：匯入一個新的自訂庫 → 立刻點「自訂單字測驗」→ 選那個庫 → 應該進入學習流程，不再顯示「沒有學習單字」

### 沒做、待 codex 決定
- 還沒處理「自訂庫的每日測驗」（`buildDailyWords` 用 `activeWords()` 自動切換到自訂庫，但同樣有「全部還沒進 SRS、靠新字 fallback 路徑」要驗）；如果使用者在自訂庫又遇到每日測驗顯示空，請告訴我，我再 patch
- 沒處理「重抓字典時 MyMemory 限流」的退避（若量大會卡）；目前是 silent skip

---

## 階段 13（2026-05-17）by codex — 依 `需求.txt` 收斂 UI / 返回 / 完成態

### 完成項目

- 分級測驗結果頁的主按鈕改成 `開始修練`，按下直接回主地圖。
- 刪掉 dashboard 內多餘的單字庫欄位，保留自訂單字庫專區入口，不再重複顯示庫切換。
- 自訂單字專區改為 `自訂單字庫`，卡片按鈕改成 `開始學習`，並保留每個庫的記憶字卡頁。
- 弱點池把 `弱點加強` 和 `返回地圖` 移到頁面最上方，避免長列表時要捲很久。
- 完成狀態卡片加了顏色變化：今日進度完成、自訂單字庫全數學完時會切換完成色。
- 主操作按鈕主色從棕色系改成藍綠系，減少整體偏棕的視覺。

### 檔案變更

- `app.js`
- `styles.css`
- `HANDOFF.md`

### 驗證

- `node --check app.js` 已通過。

---

## 階段 14（2026-05-17）by codex — 成就圖像化 + 目標詞庫收斂 + 選項同詞性收緊

### 完成項目

- 成就頁改成每一類一張摘要卡，會顯示下一個目標成就；點開卡片可看已取得與尚未完成的稱號。
- 已取得的稱號改成彩色徽章顯示，未完成的維持灰色。
- 主頁右上角新增一個可點的稱號徽章圖像，不再只靠文字顯示稱號。
- 分級/學習目標詞庫來源收斂，拿掉 `高中英文 -> 英檢初級` 的擴展，避免英檢初級抽到明顯偏高階的字。
- 選項生成改成只在同詞性池內補滿，不再退回到不相干詞性，降低亂選命中的情況。

### 檔案變更

- `app.js`
- `styles.css`
- `HANDOFF.md`

### 驗證

- `node --check app.js` 已通過。

### 備註

- 這次只改前端與本機狀態邏輯，伺服器不用重啟；瀏覽器請做一次硬重新整理。

---

## 階段 15（2026-05-17）by codex — 內建單字庫改讀 `單字列表`

### 完成項目

- 內建單字庫改為從 `單字列表` 資料夾生成的 `data/built-in-words.json` 讀取。
- 生成時先濾掉 `a / an / in / at / for` 這類功能字，並且只保留內容詞性與 `片語`。
- 來源切分為：
  - `daily_life_english_vocabulary.csv` -> `生活英文`
  - `GEPT_elementary_words.csv` -> `英檢初級`
  - `BCT_CAP_english_2000_words.csv` -> `會考`
  - `GSAT_high_school_english_vocabulary.csv` -> `學測`
  - `TOEIC_essential_3000_vocabulary_clean.csv` -> `多益`
  - `TOEFL_vocabulary_1000.csv` -> `托福`
- 新增 `scripts/generate-built-in-words.js`，之後若 `單字列表` 更新，可以直接重跑生成。
- 新內建字庫載入失敗時仍會退回舊的 fallback 清單，避免整頁掛掉。

### 檔案變更

- `app.js`
- `styles.css`
- `scripts/generate-built-in-words.js`
- `data/built-in-words.json`
- `HANDOFF.md`

### 驗證

- `node --check app.js` 已通過。
- `node .\\scripts\\generate-built-in-words.js` 已成功產出 14603 筆內建單字。

---

## 階段 7（2026-05-17）by Claude — 字典查詢可靠化

### 完成項目

#### A. 重寫 `server.js`

舊版只有 4 條 Cambridge regex 且全部寫死、Cambridge 改 HTML 後幾乎全失效，於是 fallback 永遠回到 `meaning = word` 與 `example = "I want to remember ___"`，這就是使用者反映「字義例句不對」的根因。

新版查詢流程：

```
lookupWord(word):
  1. 先看 data/lookup-cache.json 有沒有快取 → 有就直接回
  2. fetchCambridge() — 多套 regex（cover 不同命名變體）抓中文釋義 / 英文定義 / 例句 / 例句中譯 / 音標 / POS
  3. 若沒例句、沒音標、沒 POS → fetchDictionaryApi() 從 api.dictionaryapi.dev 補
  4. 若 meaning 不是中文（沒中文字元）→ translateToZhTw() 走 MyMemory API 機翻
  5. 若有英文例句但沒中文翻譯 → 同上機翻
  6. 寫入永久檔案快取
```

附加：

- 加 IP 重導向處理（最多 3 跳）、15 秒 timeout、HTTP ≥400 直接視為失敗
- 加 User-Agent 與 Accept-Language 模擬 Chrome 提高命中率
- 快取使用 debounce 寫盤（300ms），避免高頻寫入
- 啟動時印出快取項目數，方便確認

#### B. 改 `app.js` 匯入流程

- `parseImportedWords()`：每批次顯示「查詢字典中 X / Y」進度（每 `IMPORT_LOOKUP_BATCH_SIZE` 個更新一次 toast 並 render）
- `lookupWord()`：統計每個字的結果（完整 / 部分 / 無）
- `importedWordFromEntry()`：接 `phonetic`、`exampleZh`、`sources` 三個新欄位
- `saveImportedLibrary()`：完成時 toast 多顯示「完整 X、部分 Y、未取得 Z」
- 學習卡（`renderStudy()`）與弱點頁（`renderWeak()`）：若有 `exampleZh` 就顯示在英文例句下方

#### C. CSS

`styles.css` 加 `.example-zh`：與英文例句同色塊但較小、半透明，視覺上是副標。

### 檔案變更

- `server.js`（完全重寫，~280 行）
- `app.js`（`parseImportedWords` / `lookupWord` / `importedWordFromEntry` / `saveImportedLibrary` / `renderStudy` 例句、`renderWeak` 例句、i18n 三語各加 2 個 key）
- `styles.css`（加 `.example-zh`）
- `data/lookup-cache.json`（首次啟動時自動建立的快取，建議加進 `.gitignore`）

### 沒做、需要 codex 注意

- **沒能在本機跑起來測試**。Claude 這邊的沙盒擋外網（curl Cambridge 與 dictionaryapi.dev 都 403），所以沒辦法 e2e 驗證新流程。請 codex 接手後做以下測試：
  1. `node server.js` → 看 console 有沒有 `Lookup cache:` 那行
  2. 開瀏覽器，匯入幾個字（建議混合測：常見字 `abandon` / 罕見字 `meticulous` / 假字 `zxqvb`）
  3. 看 toast 顯示「完整 X、部分 Y、未取得 Z」是否合理
  4. 看學習卡：英文例句下方有沒有中文翻譯（沒有也可能是 MyMemory 那條失敗，看 server console）
  5. 看 `data/lookup-cache.json` 有沒有真的寫進去
- **MyMemory 有用量上限**（免費版每日約 5000 字元 / IP）。大批匯入時可能會被限流，server 內現在會 silently 失敗。要做更高頻使用得考慮：(a) 換成 LibreTranslate 自架；(b) 用 OpenAI / 其他付費翻譯
- **Cambridge regex 還是可能失效**。長期方案是用 cheerio 之類正規 HTML parser；目前用 regex 是怕拉新 dependency。若 codex 想動，加 cheerio 進 package.json 即可（這是純 server-side 用，不影響 client bundle）
- **沒處理 `cloze`**：自訂單字的 cloze 仍只在「例句包含原字」時才產生，建議之後考慮用 `\b<word>\b` 並支援屈折變化（loves → love）

### 怎麼快速 smoke-test

```powershell
cd C:\english-word-quest
node server.js
# 另開瀏覽器 http://localhost:5173/
# 登入後 → 匯入單字 → 貼以下測試組
#   abandon
#   meticulous
#   notebook
#   zxqvb         (故意亂打)
# 看 toast 的「完整 / 部分 / 未取得」分佈，再點任一字看卡片
```

---

## Stage 2 (2026-05-16) by codex

### Completed
- ROADMAP #0-1: custom libraries now stay isolated during study/daily/placement/review choice generation. `getSimilarWords()` uses `activeWords()` instead of `allWords()`, so distractors no longer leak in from built-in or other custom libraries.
- ROADMAP #0-4: quiz distractors are deduplicated and constrained to the same part of speech through `buildWordChoices()`, `buildMeaningChoices()`, and `getSimilarWords()`.
- ROADMAP #0-5: placement quiz now shows active learning-goal chips and uses the existing `data-active-goal` handler, so users can switch targets during placement.
- ROADMAP #0-6: added `state.rivals`, `state.xpLog`, `ensureRivals()`, `renderRanking()`, and a dashboard Ranking button. Ranking has two boards: last 3 days XP and total defeats.
- ROADMAP #2-2: pending level-up monsters are now tied into daily/review quiz flow. Correct answers damage the monster; wrong answers trigger monster counter-damage.
- Import capacity: custom library cap is no longer 300. The app now uses `CUSTOM_LIBRARY_LIMITS`: GEPT Elementary/會考 2000, 學測 7000, 多益/托福 8000, 生活英文 3000. The parser batches Cambridge lookups in groups of 40.

### Files Changed
- `app.js`
- `styles.css`
- `HANDOFF.md`

### Verification
- `node --check app.js` passed in PowerShell.

---

## Stage 6 (2026-05-16) by codex

### Completed
- Project now supports GPT Image generated raster assets for monsters and treasures.
- App checks `assets/generated/monsters/{monster.id}.png` and `assets/generated/treasures/{item.id}.png` first, then falls back to the existing generated SVG art if PNGs are missing.
- Added `tmp/imagegen/gpt-image2-assets.jsonl` with 12 monster prompts and 3 treasure prompts for `gpt-image-2`.
- Prompts use medieval fantasy watercolor RPG language and explicitly avoid direct imitation of copyrighted franchises or existing characters.
- Added `assets/generated/README.md` with the generation command and output paths.
- Battle victory and battle loss now both render explicit effects on the battle screen. Loss no longer jumps immediately back to dashboard.
- Treasure item cards and inventory cards are ready to show generated item art.

### Files Changed
- `app.js`
- `styles.css`
- `tmp/imagegen/gpt-image2-assets.jsonl`
- `assets/generated/README.md`
- `HANDOFF.md`

### Verification
- `node --check app.js` passed in PowerShell.
- `OPENAI_API_KEY` is not set in this environment, so live `gpt-image-2` generation was not run.

---

## Stage 5 (2026-05-16) by codex

### Completed
- Login goal selection is now single-select. New users choose one initial goal; more goals can still be added later from the dashboard.
- Selected goal chips now change to a stronger filled background for clearer visual feedback.
- Added Inventory/Bag page with current battle items and counts.
- Dashboard actions are split into Learning and Adventure sections with different button colors.
- Added dashboard return buttons to placement quiz for existing logged-in users, keeping the no-dashboard login flow intact.

### Files Changed
- `app.js`
- `styles.css`
- `HANDOFF.md`

### Verification
- `node --check app.js` passed in PowerShell.

---

## Stage 4 (2026-05-16) by codex

### Completed
- Monster visuals were rebuilt as generated fantasy watercolor-style SVG cards instead of simple shapes. The implementation avoids copying a specific IP style while aiming for a quiet magic-anime fantasy mood.
- Monster variety expanded from 8 to 12 types with individual colors, accents, traits, and body shapes.
- Added `renderMonsterPreview()` and `activeMonsterForPreview()`. Clicking Fight Monster now opens a preview screen first.
- Preview screen shows monster HP, attack/danger, trait text, large generated monster art, and lets the player start or back out.
- Admin battle flow also routes through the preview screen.

### Files Changed
- `app.js`
- `styles.css`
- `HANDOFF.md`

### Verification
- `node --check app.js` passed in PowerShell.

### Notes
- The official CEEC high-school English reference vocabulary is the right source for the 學測-style upper bound. This implementation allows 7000 words for 學測 and 8000 for broader exam goals.
- `ROADMAP.md` appears mojibake in this environment, so this stage appends a readable handoff instead of rewriting the existing table.

---

## Stage 3 (2026-05-16) by codex

### Completed From `需求2.txt`
- Goal selection is visually stronger: selected chips now use a solid dark background, gold outline, and stronger shadow.
- Quiz feedback no longer reveals the answer during placement/daily/review. Placement results now show a missed-word review after the test, and missed words still enter the weak pool.
- Correct answers play a short generated sound and keep the visual correct animation.
- Dashboard no longer shows the unclear per-rank progress cards. It now shows a compact progress/word-level/ranking summary.
- Login rewards and level-up rewards now give battle items instead of XP.
- Level-5 monster prompts support fighting now or deferring. Deferred fights remain available from the dashboard.
- Monster battle now has more monster variants, higher attack, clearer text, item damage logs, hit animation, floating damage text, and defeated fade-out.
- Battle failure refunds half of consumed items.
- Achievements are now tiered. Completed achievement titles are stored in `state.completedAchievements`, and the user can equip one title next to their name.
- Ranking pressure added: if the player is below rank 15 on the 3-day XP board, the active profile is penalized once per day.

### Files Changed
- `app.js`
- `styles.css`
- `HANDOFF.md`

### Verification
- `node --check app.js` passed in PowerShell.
> ## 階段 N（YYYY-MM-DD）by codex
>
> ### 完成項目
> - ROADMAP #X-Y 的 _____：改了 `app.js` 第 ~~~ 行的 `funcName`...
>
> ### 待修
> - 還沒處理 _____
> ```
