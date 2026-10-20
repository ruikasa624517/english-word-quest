const STORAGE_KEY = "vocab-arcana-progress";
const BASE_DATE = new Date();
let runtimeConfig = {
  googleClientId: "",
  adminEmails: [],
  localTestLoginEnabled: false,
  staticGoogleLogin: false,
};
const CUSTOM_LIBRARY_LIMITS = {
  生活英文: 3000,
  會考: 2000,
  "英檢初級": 2000,
  "英檢中級": 3000,
  學測: 7000,
  多益: 8000,
  托福: 8000,
};
const GOAL_LEVEL_CEILINGS = {
  "生活英文": 2,
  會考: 4,
  "英檢初級": 3,
  "英檢中級": 5,
  學測: 5,
  多益: 5,
  托福: 5,
};
const DEFAULT_CUSTOM_LIBRARY_LIMIT = 8000;
const IMPORT_LOOKUP_BATCH_SIZE = 40;
const BUILT_IN_CARD_ART = new Set([
  "alternative",
  "ambiguous",
  "analyze",
  "arrive",
  "benefit",
  "borrow",
  "bright",
  "choose",
  "compare",
  "complex",
  "comprehensive",
  "consequence",
  "deteriorate",
  "diminish",
  "efficient",
  "evaluate",
  "evidence",
  "hypothesis",
  "improve",
  "include",
  "inevitable",
  "interpret",
  "journey",
  "maintain",
  "meticulous",
  "negotiate",
  "notice",
  "ordinary",
  "predict",
  "preliminary",
  "priority",
  "protect",
  "recent",
  "require",
  "significant",
  "simple",
  "strategy",
  "substantial",
  "sufficient",
  "support",
]);

function todayKey() {
  // 用本地日期：toISOString() 是 UTC，台灣早上 8 點前會被算成前一天
  const d = new Date();
  const offset = Number(state?.dayOffset || 0);
  d.setDate(d.getDate() + offset);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const i18n = {
  "zh-Hant": {
    subtitle: "英文單字練習機",
    introTitle: "Vocab Arcana",
    introCopy:
      "選好考試目標，每天看 10 張字卡、做一次背誦測驗。學過的字會依照遺忘曲線回到每日測驗，答錯的字進弱點池，直到你連續答對兩次。",
    google: "使用 Google 繼續",
    mock: "本機測試登入",
    native: "母語",
    goal: "學習目標",
    name: "暱稱",
    dashboard: "修煉地圖",
    test: "分級測驗",
    learn: "學習 10 字",
    daily: "每日測驗",
    weekly: "週測驗",
    weeklyTitle: "週測驗（5 分鐘）",
    weeklyHelper: "本週學過的單字總考一次，混合字義選擇與克漏字。",
    weeklyNoticeTitle: "週測驗開啟！",
    weeklyNoticeCopy: "已連續學習 {day} 天。挑戰本週的單字總考來鞏固記憶吧！",
    weeklyNoticeOpen: "立即測驗",
    weeklyNoticeLater: "等等再說",
    weak: "弱點池",
    reset: "重置進度",
    placementDone: "測驗完成",
    previewDone: "看完了，開始背誦測驗",
    startLearningCustom: "開始學習",
    studyNewWords: "學習新單字",
    back: "回地圖",
    backMap: "返回地圖",
    backPrevious: "回上一頁",
    signout: "登出",
    setup: "開始設定",
    firebaseNote: "正式版使用 Google 帳號註冊登入；本機測試登入只在開發環境且伺服器允許時顯示。",
    placementTitle: "3 分鐘喚醒你的詞魂",
    dailyTitle: "每日 3 分鐘應用小測",
    placementHelper: "題庫不重複，並混合字義選擇與簡短句子填空。",
    dailyHelper: "題目會混合今天學的字、以前學過的字與弱點字。",
    questionProgress: "第 {current} 題 / {total}",
    clozeHint: "選出最適合填入空格的單字",
    resultCopy: "你的初始分數是 {score}。目前適合從「{tone}」開始，錯題會自動進入弱點池。",
    correct: "答對",
    totalQuestions: "題數",
    target: "目標",
    accuracy: "答對率",
    quizSummary: "結算",
    quizSummaryTitle: "測驗結束",
    wrongCount: "錯題數",
    correctAnswer: "正解",
    dashboardCopy: "目標：{goal}。建議先一次看完 10 個單字，再進行背誦測驗；每日測驗會混入舊字追蹤記憶。",
    todayProgress: "今日進度",
    todayProgressCopy: "今天已學 {today} 字；總計 {total} 字。",
    previewEyebrow: "10 字預覽",
    previewTitle: "先看完整批單字",
    previewCopy: "這一輪會先讓你快速看完 10 個字，接著才進入背誦測驗。舊字與弱點字會依照你的進度混入。",
    recallTitle: "背誦測驗",
    weakTitle: "弱點池",
    weakCopyFilled: "這些單字會在學習與每日測驗中更常出現。",
    weakCopyEmpty: "目前沒有錯題。去打一輪單字戰鬥吧。",
    hit: "命中。",
    hitStudy: "命中！這個單字已刻進魔導書。",
    miss: "失手，正解是 {answer}。",
    missStudy: "答錯。正解是「{answer}」，已放進弱點池。",
    dailyDone: "每日測驗完成：{correct}/{total}",
    traveler: "旅人",
    statPlacement: "分級測驗",
    statWords: "每輪單字",
    statRanks: "魔導階級",
    speak: "朗讀",
    previousCard: "上一張",
    nextCard: "下一張",
    cardProgress: "{current} / {total}",
    cardHint: "左右滑動換下一張",
    exampleLabel: "例句",
    studyLoading: "準備單字中",
    xp: "經驗值",
    adventurerRank: "段位",
    wordTier: "單字階級",
    tier1: "簡單",
    tier2: "普通",
    tier3: "中等",
    tier4: "困難",
    tier5: "超難",
    nextLevel: "距離升級",
    levelUp: "段位挑戰",
    playMiniGame: "開始復古小遊戲",
    claimLevelLoot: "領取升級道具",
    battleMonster: "挑戰怪物",
    inventory: "道具袋",
    inventoryTitle: "背包",
    inventoryCopy: "道具在週測驗和總複習打怪時使用：鐵劍讓下一題答對的傷害加倍，火焰瓶直接造成傷害，治療藥水回復生命。",
    emptyInventory: "背包是空的。登入、升級或完成挑戰可以取得道具。",
    learningActions: "學習",
    adventureActions: "冒險",
    achievements: "成就",
    achievementsCopy: "每一類成就都會顯示下一個目標。點開卡片可以看已取得與尚未完成的稱號。",
    achNextTarget: "下一個目標",
    achEarnedTitles: "已取得稱號",
    achLockedTitles: "尚未完成",
    achAllComplete: "全部完成",
    noTitle: "尚未裝備稱號",
    monsterBattle: "怪物討伐",
    playerHp: "玩家生命",
    monsterHp: "怪物生命",
    useItem: "使用",
    victory: "討伐成功！",
    noItems: "沒有道具，先升級取得補給。",
    miniTitle: "符文反應戰",
    miniCopy: "在時間內點擊發光符文，分數越高，額外經驗值越多。",
    miniScore: "分數",
    miniTime: "時間",
    claimReward: "領取獎勵",
    streak: "連續登入",
    streakReward: "今日補給：{reward}",
    reward1: "鐵劍 x1",
    reward3: "鐵劍 x1、治療藥水 x1",
    reward5: "火焰瓶 x1、治療藥水 x1",
    reward7: "火焰瓶 x2、治療藥水 x2",
    importWords: "匯入單字",
    library: "單字庫",
    builtInLibrary: "內建考試單字庫",
    customLibrary: "自訂單字庫",
    importTitle: "建立新的單字庫",
    importCopy: "每行輸入一個英文單字就好，中文釋義、詞性和例句會自動查。也可以拍照上傳，再把辨識出的英文字貼進下面的框。",
    libraryName: "單字庫名稱",
    wordInput: "單字內容",
    photoInput: "拍照/上傳圖片",
    saveLibrary: "儲存並切換",
    importPlaceholder: "abandon, 放棄, Never abandon your dream.\naccurate, 精準的, The report is accurate.",
    englishOnlyPlaceholder: "abandon\naccurate\nstrategy\nsignificant",
    imported: "已匯入 {count} 個單字。",
    importLimit: "目前目標上限：{limit} 字。超過時會先保留前 {limit} 個不重複英文單字。",
    importTrimmed: "已達本目標上限，已保留前 {limit} 個單字。",
    noNewStudyWords: "這個單字庫目前沒有新的學習單字了。",
    startTraining: "開始修練",
    customStudy: "自訂單字測驗",
    chooseStudyLibrary: "選擇要使用的自訂單字庫",
    chooseStudyWord: "選出對應英文單字",
    viewWordLibrary: "查看記憶字卡",
    viewWordLibraryCopy: "只顯示已匯入的單字，不混入內建庫。",
    weakTrain: "錯題加強",
    currentTitle: "目前稱號",
    limitedTitle: "限時稱號",
    claimBattleTitle: "領取打怪榜稱號",
    battleTitleReady: "本週打怪榜結算稱號：{title}",
    battleTitleActive: "限時稱號：{title}，下次週結算失效",
    ranking: "排行榜",
    xpRanking: "XP 排名",
    recentXp: "本週 XP",
    killRanking: "本週擊殺",
    rankYou: "你",
    quizBattle: "答題討伐",
    quizAttack: "答對造成 {damage} 傷害。",
    quizCounter: "答錯受到 {damage} 傷害。",
    battleDefeat: "生命歸零，回地圖整備。",
    correctFx: "答對！",
    wrongFx: "答錯！",
    activeGoal: "目前目標",
    addGoal: "新增目標",
    selectGoalRequired: "請先選擇學習目標",
    selectGoalNotice: "選擇一個目標後，學習、測驗、背包、排行榜等功能才會開啟。",
    review: "總複習測驗",
    reviewReady: "已背 {percent}%：可以挑戰總複習升級。",
    reviewLocked: "背完 60% 單字後開放總複習。",
    reviewTitle: "10-15 分鐘總複習",
    reviewHelper: "隨機挑選目前等級含以下的單字，通過後提升等級稱號。",
    reviewPassed: "總複習通過，等級提升！",
    quizNoReveal: "已記錄作答，結果會在測驗完成後公布。",
    quizHitHidden: "命中。",
    quizMissHidden: "已記錄，繼續下一題。",
    wrongReview: "錯題回顧",
    noWrongAnswers: "沒有錯題。",
    deferBattle: "下次再說",
    itemReward: "獲得打怪道具：{items}",
    itemRewardTitle: "獲得道具",
    guestStart: "直接開始",
    googleOptional: "不用註冊，進度會存在這台裝置的瀏覽器裡。想在畫面上顯示自己的名字，也可以用 Google 帳號登入。",
    battleWonContinue: "討伐成功！把剩下的題目做完就能領獎勵。",
    battleLostContinue: "你倒下了，怪物逃走了。剩下的題目還是要做完，成績照常計算。",
    swordReady: "鐵劍準備好了，下一題答對傷害加倍。",
    bossTag: "升級頭目",
    bossWaiting: "Lv.{level} 頭目「{name}」會出現在下一次週測驗或總複習。",
    battleWonSummary: "打倒了「{name}」：經驗值 +{xp}，獲得 {loot}",
    battleLostSummary: "這次沒打贏「{name}」，用掉的道具退還一半。",
    battleEscapedSummary: "「{name}」還沒被打倒就逃走了，用掉的道具退還一半。",
    studyStreak: "連續學習",
    calendarTitle: "學習月曆",
    calendarDays: "天連續學習",
    freezeCount: "補簽 {count} 張",
    useFreeze: "用一張補簽補昨天",
    calendarNote: "完成每日測驗就會蓋章。連續學習每滿 7 天送一張補簽，最多存 2 張，可以補昨天漏掉的一格。",
    freezeEarned: "連續學習 {days} 天，送你一張補簽。",
    weekdayLetters: "日一二三四五六",
    progressTitle: "我的進度",
    progressNote: "長期記憶 {count} 個字",
    progressLearned: "學過的字",
    progressLongTerm: "長期記憶",
    progressDue: "今天該複習",
    progressHint: "長期記憶是指連續答對三次以上、複習間隔已經拉長的字。",
    progressWeekCompare: "這 7 天學會 {now} 個字，前 7 天是 {prev} 個。",
    progressRetention: "兩週以前學的 {total} 個字，現在有 {kept} 個不在弱點池，大約 {percent}%。",
    progressRetentionEmpty: "學滿兩週以後，這裡會告訴你以前學的字還記得多少。",
    progressWeeks: "每週學會的字數",
    weakTrainCount: "錯題加強（{count} 個字）",
    weakTrainNote: "混合這次和之前答錯的字，同一個字答對兩次就會移出。",
    slowSpeak: "慢速",
    speakExample: "朗讀例句",
    noQuizWords: "目前沒有可以考的字。先去「學習 10 字」學幾個字再回來。",
    adminLogin: "萬能管理員模式",
    adminLoginNote: "只在這台電腦（localhost）上出現，用來測試各項功能，網路上的版本看不到。",
    importNoneFound: "這些字都查不到釋義。請確認拼字（只接受英文單字），或稍後在有網路時再試。",
    todayWordsEmpty: "按下「學習 10 字」就會抽出今天的字，同一天重新進來都是同一批。",
    monsterAttack: "攻擊力",
    confirmReset: "這會清除此帳號在這台裝置上的所有進度（學過的字、弱點池、道具、成就），而且無法復原。建議先匯出存檔。確定要重置嗎？",
    battleReady: "選一個道具出手，怪物每回合都會反擊，生命見底前記得喝藥水。",
    keyHint: "鍵盤：← → 換卡，空白鍵朗讀",
    answerKeyHint: "可直接按數字鍵 1–4 作答",
    loginLead: "每天 10 個字，背熟了才往下一關。",
    loginStep1: "翻完今天的 10 張字卡，聽發音、看例句",
    loginStep2: "背誦測驗：答對才算真的學會",
    loginStep3: "每日測驗把舊字和弱點字再拿出來考一次",
    loginStepNote: "週測驗和總複習會遇到怪物，答對就是攻擊，平常累積的道具也是在那時候用。",
    loginNameHint: "本機測試登入用的暱稱",
    todayWords: "今天的 10 個字",
    todayCount: "{today} / 10",
    reviewZone: "複習",
    adventureZone: "冒險",
    saveZone: "存檔與設定",
    streakDays: "連續登入 {days} 天",
    itemsTotal: "{count} 件道具",
    weeklyLockedNote: "每累計登入 7 天開放",
    reviewLockedNote: "學過 60% 後開放",
    rankLabel: "週排名稱號",
    battleDamage: "{item} 造成 {damage} 傷害。",
    battleHeal: "{item} 回復 {heal} 生命。",
    battleLost: "討伐失敗，返還已消耗道具的一半。",
    equippedTitle: "掛上稱號",
    equipped: "已掛稱號",
    monsterPreview: "怪物預覽",
    monsterPreviewCopy: "先確認敵人的生命、攻擊與特性，再決定是否開戰。",
    monsterTrait: "特性",
    startBattle: "開始討伐",
    dangerLevel: "危險度",
    achTotalCorrect: "累計答對題數",
    achBestCombo: "最高連續答對",
    achLoginStreak: "目前連續登入",
    achTotalLogin: "累計登入天數",
    achFirstLevel: "第一次升級",
    achMonster: "打怪成就",
    achTotalLearned: "累計學會單字",
    achSrs: "長期記憶",
    achCustomWords: "自訂單字數",
    achRankTier: "週排名段位",
    admin: "管理員",
    adminPanel: "管理員測試面板",
    adminNote: "正式版會以 Google 帳號 email allowlist 限制。",
    adminXp: "+500 XP",
    adminLevel: "觸發升級",
    adminLearn: "標記本目標全學完",
    adminReview: "開總複習",
    adminBattle: "開打怪",
    adminItems: "補滿道具",
    adminSkipDay: "跳過一天",
    adminClear: "清除本機進度",
    srsDue: "今日要複習",
    srsAllClear: "今日無到期複習",
    importProgressPrefix: "查詢字典中",
    importStats: "完整 {full}、部分 {partial}、未取得 {none}",
    importRejected: "已濾除 {count} 個無效字",
    refetchLibrary: "重新查字典",
    deleteLibrary: "刪除",
    refetching: "正在重新查詢 {count} 個字…",
    refetchDone: "完成。完整 {full}、部分 {partial}、未取得 {none}",
    confirmDeleteLibrary: "確定要刪除這個自訂單字庫嗎？此動作無法復原。",
    allDoneTitle: "這個字庫已全部學過",
    allDoneCopy: "你已學過此字庫所有單字。等待新匯入的字或切換到其他字庫；若要複習，請用每日測驗或弱點池。",
    nextRound: "刷新單字",
    nextRoundReset: "再來一輪（重複學習）",
    confirmNextRound: "今天已學的 10 字會被取代成另外 10 個還沒做過的字。要繼續嗎？",
    confirmNextRoundReset: "這個字庫已全部學過。再來一輪會清除學習史，從第一個字重新開始。要繼續嗎？",
    customHub: "自訂單字庫",
    customHubTitle: "自訂單字庫",
    customHubCopy: "在這裡管理你的自訂單字庫：匯入新字、查看記憶字卡、重新查字典或刪除整個庫。",
    customHubEmpty: "還沒有任何自訂單字庫，先匯入一組吧。",
    addWordsToLibrary: "新增單字到這個字庫",
    addWordsPlaceholder: "輸入要新增的英文單字，每行一個",
    addWordsDone: "已新增 {count} 個單字。",
    viewAllLibraries: "查看全部字卡",
    viewWordLibrary: "查看單字庫",
    viewLibraryCopy: "純粹顯示已匯入的單字，含音標、詞性、釋義與例句。",
    noMeaning: "（無釋義）",
    saveFailed: "進度儲存失敗：瀏覽器儲存空間可能已滿，最近的進度可能不會保留。建議先「匯出存檔」備份。",
    learnedWords: "學過的單字",
    learnedWordsTitle: "學過的單字",
    learnedWordsCopy: "這裡列出你在目前學習目標中學過的所有單字，可用下方搜尋快速查找。",
    learnedSearchPlaceholder: "搜尋單字或字義…",
    learnedEmpty: "還沒有學過任何單字，先去「學習 10 字」吧。",
    learnedNoResults: "沒有符合搜尋的單字。",
    learnedTotal: "共 {count} 字",
    exportProgress: "匯出存檔",
    importProgressBtn: "匯入存檔",
    exportDone: "已下載存檔備份。",
    importProgressDone: "匯入成功，進度已還原。",
    importProgressInvalid: "存檔格式錯誤，未做任何變更。",
    confirmImportProgress: "匯入會覆蓋此瀏覽器上所有帳號的本機進度。確定要繼續嗎？",
    backupHint: "進度存在瀏覽器內，清除瀏覽紀錄會歸零。可匯出 JSON 存檔備份或搬到其他裝置。",
    listenPrompt: "聽發音，選出正確的單字",
    replayAudio: "重播發音",
    darkMode: "夜間模式",
    lightMode: "日間模式",
  },
  en: {
    subtitle: "A game-first English vocabulary arena",
    introTitle: "Vocab Arcana",
    introCopy:
      "Start training right after choosing a goal. Words adapt to your native language, weak spots, and weekly rank. Daily tests mix today's words with older learned words.",
    google: "Continue with Google",
    mock: "Local test login",
    native: "Native language",
    goal: "Learning goal",
    name: "Nickname",
    dashboard: "Quest Map",
    test: "Placement Test",
    learn: "Study 10 Words",
    daily: "Daily Test",
    weekly: "Weekly Test",
    weeklyTitle: "Weekly test (5 min)",
    weeklyHelper: "Covers all words learned this week, mixing meaning and cloze.",
    weeklyNoticeTitle: "Weekly test unlocked!",
    weeklyNoticeCopy: "You have studied for {day} days. Take this week's challenge!",
    weeklyNoticeOpen: "Start now",
    weeklyNoticeLater: "Maybe later",
    weak: "Weak Words",
    reset: "Reset Progress",
    placementDone: "Placement complete",
    previewDone: "Start Recall Test",
    startLearningCustom: "Start Learning",
    studyNewWords: "Study New Words",
    back: "Back to map",
    backMap: "Back to map",
    backPrevious: "Back to previous page",
    signout: "Sign out",
    setup: "Setup",
    firebaseNote: "Production uses Google sign-in. Local test login only appears in development when the server allows it.",
    placementTitle: "Awaken your word power in 3 minutes",
    dailyTitle: "Daily 3-minute application test",
    placementHelper: "No repeated words. Questions mix meaning choices and short sentence blanks.",
    dailyHelper: "Questions mix today's words, older learned words, and weak words.",
    questionProgress: "Question {current} / {total}",
    clozeHint: "Choose the best word for the blank",
    resultCopy: "Your initial score is {score}. Start from {tone}; missed words will enter the weak-word pool.",
    correct: "Correct",
    totalQuestions: "Questions",
    target: "Goal",
    accuracy: "Accuracy",
    quizSummary: "Summary",
    quizSummaryTitle: "Quiz finished",
    wrongCount: "Wrong",
    correctAnswer: "Answer",
    dashboardCopy: "Goal: {goal}. Study 10 words first, then take a recall test. Daily tests mix older words to track memory.",
    todayProgress: "Today's Progress",
    todayProgressCopy: "{today} words learned today; {total} words learned in total.",
    previewEyebrow: "10-word preview",
    previewTitle: "Review the full batch first",
    previewCopy: "This round shows 10 words before the recall test. Older words and weak words can be mixed in based on your progress.",
    recallTitle: "Recall Test",
    weakTitle: "Shadow Error Book",
    weakCopyFilled: "These words will appear more often in training and daily tests.",
    weakCopyEmpty: "No weak words yet. Run a word battle first.",
    hit: "Hit.",
    hitStudy: "Hit. This word is now recorded.",
    miss: "Missed. The answer is {answer}.",
    missStudy: "Missed. The answer is {answer}. Added to weak words.",
    dailyDone: "Daily test complete: {correct}/{total}",
    traveler: "Traveler",
    statPlacement: "placement",
    statWords: "words/session",
    statRanks: "arcane ranks",
    speak: "Speak",
    previousCard: "Previous",
    nextCard: "Next",
    cardProgress: "{current} / {total}",
    cardHint: "Swipe sideways for the next card",
    exampleLabel: "Example",
    studyLoading: "Preparing words",
    xp: "XP",
    adventurerRank: "Adventurer Rank",
    wordTier: "Word Tier",
    tier1: "Easy",
    tier2: "Basic",
    tier3: "Medium",
    tier4: "Hard",
    tier5: "Ultra Hard",
    nextLevel: "Next Level",
    levelUp: "Level-up Quest",
    playMiniGame: "Play Retro Mini-game",
    claimLevelLoot: "Claim Level Loot",
    battleMonster: "Fight Monster",
    inventory: "Inventory",
    inventoryTitle: "Bag",
    inventoryCopy: "Check your current hunt items.",
    emptyInventory: "Your bag is empty. Log in, rank up, or finish challenges to gain items.",
    learningActions: "Learning",
    adventureActions: "Adventure",
    achievements: "Achievements",
    achievementsCopy: "Each category shows the next goal. Open a card to review earned and locked titles.",
    achNextTarget: "Next target",
    achEarnedTitles: "Earned titles",
    achLockedTitles: "Locked titles",
    achAllComplete: "All complete",
    noTitle: "No title equipped",
    monsterBattle: "Monster Hunt",
    playerHp: "Player HP",
    monsterHp: "Monster HP",
    useItem: "Use",
    victory: "Victory!",
    noItems: "No items. Level up to gain supplies.",
    miniTitle: "Rune Reflex",
    miniCopy: "Click the glowing runes before time runs out. Higher score gives more bonus XP.",
    miniScore: "Score",
    miniTime: "Time",
    claimReward: "Claim Reward",
    streak: "Login Streak",
    streakReward: "Daily supply: {reward}",
    reward1: "Sword x1",
    reward3: "Sword x1, Potion x1",
    reward5: "Bomb x1, Potion x1",
    reward7: "Bomb x2, Potion x2",
    importWords: "Import Words",
    library: "Library",
    builtInLibrary: "Built-in Exam Library",
    customLibrary: "Custom Library",
    importTitle: "Create a New Word Library",
    importCopy: "Enter one English word per line. Meaning, part of speech and an example are looked up for you. You can also upload a photo and paste the recognized words below.",
    libraryName: "Library Name",
    wordInput: "Word Content",
    photoInput: "Photo Upload",
    saveLibrary: "Save and Switch",
    importPlaceholder: "abandon, give up, Never abandon your dream.\naccurate, precise, The report is accurate.",
    englishOnlyPlaceholder: "abandon\naccurate\nstrategy\nsignificant",
    imported: "Imported {count} words.",
    importLimit: "Current goal limit: {limit} words. If exceeded, only the first {limit} unique English words are kept.",
    importTrimmed: "Goal limit reached. Kept the first {limit} words.",
    noNewStudyWords: "This library has no new study words left.",
    startTraining: "Start Training",
    customStudy: "Custom Word Test",
    chooseStudyLibrary: "Choose a custom library",
    chooseStudyWord: "Choose the matching English word",
    viewWordLibrary: "View memory cards",
    viewWordLibraryCopy: "Only imported words are shown here, separate from the built-in pool.",
    weakTrain: "Weak Training",
    currentTitle: "Current title",
    limitedTitle: "Limited title",
    claimBattleTitle: "Claim hunt title",
    battleTitleReady: "Weekly hunt title ready: {title}",
    battleTitleActive: "Limited title: {title}. Expires at next weekly settlement.",
    ranking: "Ranking",
    xpRanking: "XP Ranking",
    recentXp: "Weekly XP",
    killRanking: "Weekly Defeats",
    rankYou: "You",
    quizBattle: "Quiz Hunt",
    quizAttack: "Correct: dealt {damage} damage.",
    quizCounter: "Missed: took {damage} damage.",
    battleDefeat: "HP reached zero. Return to the map and recover.",
    correctFx: "Correct!",
    wrongFx: "Wrong!",
    activeGoal: "Active Goal",
    addGoal: "Add Goal",
    selectGoalRequired: "Choose a learning goal first",
    selectGoalNotice: "Learning, tests, inventory, and rankings unlock after choosing one goal.",
    review: "Grand Review",
    reviewReady: "{percent}% learned: grand review is available.",
    reviewLocked: "Grand review unlocks after learning 60% of the words.",
    reviewTitle: "10-15 Minute Grand Review",
    reviewHelper: "Random words from your current rank and below. Pass to rank up.",
    reviewPassed: "Grand review passed. Rank upgraded!",
    quizNoReveal: "Answer recorded. Results appear after the test.",
    quizHitHidden: "Hit.",
    quizMissHidden: "Recorded. Continue.",
    wrongReview: "Missed Words",
    noWrongAnswers: "No missed words.",
    deferBattle: "Later",
    itemReward: "Gained battle items: {items}",
    itemRewardTitle: "Items received",
    guestStart: "Start now",
    googleOptional: "No sign-up needed; progress is saved in this browser. Sign in with Google if you want your name shown.",
    battleWonContinue: "Monster defeated! Finish the remaining questions to claim the reward.",
    battleLostContinue: "You fell and the monster escaped. Finish the remaining questions; your score still counts.",
    swordReady: "Sword ready: your next correct answer deals double damage.",
    bossTag: "Boss",
    bossWaiting: "The Lv.{level} boss “{name}” will appear in your next weekly test or grand review.",
    battleWonSummary: "Defeated “{name}”: +{xp} XP, received {loot}",
    battleLostSummary: "You lost to “{name}” this time. Half of the items you used were returned.",
    battleEscapedSummary: "“{name}” escaped before it was defeated. Half of the items you used were returned.",
    studyStreak: "Study streak",
    calendarTitle: "Study calendar",
    calendarDays: "days in a row",
    freezeCount: "{count} streak savers",
    useFreeze: "Use a saver for yesterday",
    calendarNote: "Finish the daily quiz to get a stamp. Every 7-day streak earns a saver (keep up to 2) that can fill in yesterday.",
    freezeEarned: "{days}-day streak! You earned a streak saver.",
    weekdayLetters: "SMTWTFS",
    progressTitle: "My progress",
    progressNote: "{count} words in long-term memory",
    progressLearned: "Learned",
    progressLongTerm: "Long-term",
    progressDue: "Due today",
    progressHint: "Long-term words are ones you've answered right three times in a row, so reviews are spaced further apart.",
    progressWeekCompare: "{now} words learned in the last 7 days, {prev} in the 7 days before.",
    progressRetention: "Of {total} words learned two or more weeks ago, {kept} are not in your weak words (about {percent}%).",
    progressRetentionEmpty: "After two weeks, this shows how many older words you still remember.",
    progressWeeks: "Words learned per week",
    weakTrainCount: "Practice mistakes ({count} words)",
    weakTrainNote: "Mixes this quiz's mistakes with older ones. A word leaves after two correct answers.",
    slowSpeak: "Slow",
    speakExample: "Read the example aloud",
    noQuizWords: "There are no words to test yet. Study a few words first.",
    adminLogin: "Admin test mode",
    adminLoginNote: "Only shown on localhost for testing; the online version never shows it.",
    importNoneFound: "None of these words could be found. Check the spelling (English words only) or try again when you're online.",
    todayWordsEmpty: "Tap “Study 10 Words” to draw today's set. It stays the same all day.",
    monsterAttack: "Attack",
    confirmReset: "This erases all progress for this account on this device (learned words, weak words, items, achievements) and cannot be undone. Export a backup first if you need one. Reset now?",
    battleReady: "Pick an item to strike. The monster hits back every turn, so drink a potion before your HP runs out.",
    keyHint: "Keyboard: ← → to flip, Space to hear it",
    answerKeyHint: "Press 1–4 to answer",
    loginLead: "Ten words a day. Learn them before moving on.",
    loginStep1: "Flip through today's 10 cards, hear each word, read the example",
    loginStep2: "Recall quiz: a word only counts once you get it right",
    loginStep3: "Daily quiz brings back older and weak words",
    loginStepNote: "Weekly tests and grand reviews come with a monster: every correct answer is an attack, and that's where your saved items come in.",
    loginNameHint: "Nickname for local test login",
    todayWords: "Today's 10 words",
    todayCount: "{today} / 10",
    reviewZone: "Review",
    adventureZone: "Adventure",
    saveZone: "Save & settings",
    streakDays: "{days}-day streak",
    itemsTotal: "{count} items",
    weeklyLockedNote: "Opens every 7 login days",
    reviewLockedNote: "Opens at 60% learned",
    rankLabel: "Weekly title",
    battleDamage: "{item} dealt {damage} damage.",
    battleHeal: "{item} restored {heal} HP.",
    battleLost: "Hunt failed. Half of used items were returned.",
    equippedTitle: "Equip Title",
    equipped: "Equipped",
    monsterPreview: "Monster Preview",
    monsterPreviewCopy: "Check HP, attack, and traits before starting the hunt.",
    monsterTrait: "Trait",
    startBattle: "Start Hunt",
    dangerLevel: "Danger",
    achTotalCorrect: "Total Correct",
    achBestCombo: "Best Correct Streak",
    achLoginStreak: "Current Login Streak",
    achTotalLogin: "Total Login Days",
    achFirstLevel: "First Level Up",
    achMonster: "Monster Hunt",
    achTotalLearned: "Total Words Learned",
    achSrs: "Long-Term Memory",
    achCustomWords: "Custom Words",
    achRankTier: "Weekly Rank Tier",
    admin: "Admin",
    adminPanel: "Admin Test Panel",
    adminNote: "Production will restrict this by Google account email allowlist.",
    adminXp: "+500 XP",
    adminLevel: "Trigger Level Up",
    adminLearn: "Mark Goal Learned",
    adminReview: "Open Review",
    adminBattle: "Open Battle",
    adminItems: "Fill Items",
    adminSkipDay: "Skip a Day",
    adminClear: "Clear Local Progress",
    srsDue: "Due Today",
    srsAllClear: "All caught up",
    importProgressPrefix: "Looking up dictionary",
    importStats: "full {full} · partial {partial} · missing {none}",
    importRejected: "filtered out {count} invalid",
    refetchLibrary: "Refetch",
    deleteLibrary: "Delete",
    refetching: "Refetching {count} words…",
    refetchDone: "Done. full {full} · partial {partial} · missing {none}",
    confirmDeleteLibrary: "Delete this custom library? This cannot be undone.",
    allDoneTitle: "All words studied",
    allDoneCopy: "You have studied every word in this library. Import more words, switch libraries, or use the daily test / weak words pool to review.",
    nextRound: "Refresh words",
    nextRoundReset: "Next round (replay)",
    confirmNextRound: "Today's 10 words will be replaced with 10 different unseen words. Continue?",
    confirmNextRoundReset: "This library has been fully studied. Next round will clear history and restart from the beginning. Continue?",
    customHub: "Custom Libraries",
    customHubTitle: "Custom Libraries",
    customHubCopy: "Manage your custom libraries here: import new words, view memory cards, refetch dictionary data, or delete an entire library.",
    customHubEmpty: "No custom libraries yet. Import one first.",
    addWordsToLibrary: "Add words to this library",
    addWordsPlaceholder: "Enter new English words, one per line",
    addWordsDone: "Added {count} words.",
    viewAllLibraries: "View all cards",
    viewWordLibrary: "View library",
    viewLibraryCopy: "Imported words only, with phonetic, POS, meaning and example.",
    noMeaning: "(no meaning)",
    saveFailed: "Failed to save progress: browser storage may be full. Recent progress may be lost. Consider exporting a backup.",
    learnedWords: "Learned Words",
    learnedWordsTitle: "Learned Words",
    learnedWordsCopy: "All words you have learned for the current goal. Use the search box to find one quickly.",
    learnedSearchPlaceholder: "Search word or meaning…",
    learnedEmpty: "No learned words yet. Start with \"Study 10 words\".",
    learnedNoResults: "No words match your search.",
    learnedTotal: "{count} words in total",
    exportProgress: "Export save",
    importProgressBtn: "Import save",
    exportDone: "Backup downloaded.",
    importProgressDone: "Import complete. Progress restored.",
    importProgressInvalid: "Invalid save file. Nothing was changed.",
    confirmImportProgress: "Importing will overwrite local progress for all accounts in this browser. Continue?",
    backupHint: "Progress lives in this browser; clearing site data wipes it. Export a JSON backup or move it to another device.",
    listenPrompt: "Listen and pick the word you hear",
    replayAudio: "Replay audio",
    darkMode: "Dark mode",
    lightMode: "Light mode",
  },
  ja: {
    subtitle: "英単語をゲーム感覚で鍛える",
    introTitle: "Vocab Arcana",
    introCopy:
      "目標を選んだらすぐに修練開始。母語・弱点・週間ランクに合わせて単語を調整し、毎日テストでは今日の単語と過去の単語を混ぜます。",
    google: "Google で続行",
    mock: "ローカルで試す",
    native: "母語",
    goal: "学習目標",
    name: "名前",
    dashboard: "修練マップ",
    test: "レベル診断",
    learn: "10語を学習",
    daily: "毎日テスト",
    weekly: "週テスト",
    weeklyTitle: "週テスト（5分）",
    weeklyHelper: "今週学習した語をまとめてテスト。意味選択と穴埋めを混在。",
    weeklyNoticeTitle: "週テスト解放！",
    weeklyNoticeCopy: "{day} 日間継続！今週の単語テストに挑戦しよう。",
    weeklyNoticeOpen: "今すぐ",
    weeklyNoticeLater: "後で",
    weak: "弱点リスト",
    reset: "リセット",
    placementDone: "診断完了",
    previewDone: "暗記テスト開始",
    startLearningCustom: "学習を開始",
    studyNewWords: "新しい単語を学習",
    back: "マップへ",
    backMap: "マップへ",
    backPrevious: "前のページへ",
    signout: "ログアウト",
    setup: "初期設定",
    firebaseNote: "正式版は Google ログインを使用します。ローカルテストログインは開発環境でサーバーが許可した場合のみ表示されます。",
    placementTitle: "3分で語彙力を診断",
    dailyTitle: "毎日3分の応用テスト",
    placementHelper: "単語は重複せず、意味選択と短文穴埋めを混ぜます。",
    dailyHelper: "今日学んだ単語、過去の単語、弱点単語を混ぜます。",
    questionProgress: "{current} / {total} 問",
    clozeHint: "空欄に最も合う単語を選んでください",
    resultCopy: "初期スコアは {score} です。まず「{tone}」から始めます。間違えた単語は弱点リストに入ります。",
    correct: "正解",
    totalQuestions: "問題数",
    target: "目標",
    accuracy: "正答率",
    quizSummary: "結果",
    quizSummaryTitle: "テスト終了",
    wrongCount: "誤答",
    correctAnswer: "正解",
    dashboardCopy: "目標：{goal}。まず10語を確認してから暗記テストに進みます。毎日テストでは過去の単語も混ぜます。",
    todayProgress: "今日の進度",
    todayProgressCopy: "今日は {today} 語、合計 {total} 語を学習済み。",
    previewEyebrow: "10語プレビュー",
    previewTitle: "まず全単語を確認",
    previewCopy: "このラウンドでは10語を先に確認し、その後で暗記テストに進みます。進度に応じて過去の単語と弱点単語も混ざります。",
    recallTitle: "暗記テスト",
    weakTitle: "弱点ノート",
    weakCopyFilled: "これらの単語は学習と毎日テストで多めに出ます。",
    weakCopyEmpty: "弱点単語はまだありません。まず単語バトルを行ってください。",
    hit: "正解。",
    hitStudy: "正解。この単語を記録しました。",
    miss: "不正解。正解は {answer} です。",
    missStudy: "不正解。正解は「{answer}」です。弱点リストに追加しました。",
    dailyDone: "毎日テスト完了：{correct}/{total}",
    traveler: "旅人",
    statPlacement: "診断",
    statWords: "語/回",
    statRanks: "ランク",
    speak: "発音",
    previousCard: "前へ",
    nextCard: "次へ",
    cardProgress: "{current} / {total}",
    cardHint: "左右にスワイプして次のカードへ",
    exampleLabel: "例文",
    studyLoading: "単語を準備中",
    xp: "経験値",
    adventurerRank: "冒険ランク",
    wordTier: "単語ランク",
    tier1: "簡単",
    tier2: "普通",
    tier3: "中級",
    tier4: "難しい",
    tier5: "超難問",
    nextLevel: "次のレベル",
    levelUp: "昇級クエスト",
    playMiniGame: "レトロゲーム開始",
    claimLevelLoot: "昇級アイテムを受け取る",
    battleMonster: "モンスターに挑戦",
    inventory: "道具袋",
    inventoryTitle: "バッグ",
    inventoryCopy: "現在使える討伐アイテムを確認します。",
    emptyInventory: "バッグは空です。ログイン、昇級、挑戦でアイテムを入手できます。",
    learningActions: "学習",
    adventureActions: "冒険",
    achievements: "実績",
    achievementsCopy: "各カテゴリには次の目標が表示されます。カードを開くと獲得済みと未達成の称号を確認できます。",
    achNextTarget: "次の目標",
    achEarnedTitles: "獲得済み称号",
    achLockedTitles: "未達成",
    achAllComplete: "すべて達成",
    noTitle: "称号未装備",
    monsterBattle: "モンスター討伐",
    playerHp: "プレイヤーHP",
    monsterHp: "モンスターHP",
    useItem: "使う",
    victory: "討伐成功！",
    noItems: "道具がありません。昇級して補給を得ましょう。",
    miniTitle: "ルーン反応戦",
    miniCopy: "時間内に光るルーンをクリックします。高得点ほどボーナス経験値が増えます。",
    miniScore: "スコア",
    miniTime: "時間",
    claimReward: "報酬を受け取る",
    streak: "連続ログイン",
    streakReward: "今日の補給：{reward}",
    reward1: "剣 x1",
    reward3: "剣 x1、回復薬 x1",
    reward5: "爆弾 x1、回復薬 x1",
    reward7: "爆弾 x2、回復薬 x2",
    importWords: "単語をインポート",
    library: "単語帳",
    builtInLibrary: "内蔵試験単語帳",
    customLibrary: "カスタム単語帳",
    importTitle: "新しい単語帳を作成",
    importCopy: "1行に英単語を1つ入力するだけで、意味・品詞・例文は自動で調べます。写真をアップロードして、認識した英単語を貼り付けることもできます。",
    libraryName: "単語帳名",
    wordInput: "単語内容",
    photoInput: "写真アップロード",
    saveLibrary: "保存して切替",
    importPlaceholder: "abandon, あきらめる, Never abandon your dream.\naccurate, 正確な, The report is accurate.",
    englishOnlyPlaceholder: "abandon\naccurate\nstrategy\nsignificant",
    imported: "{count} 語をインポートしました。",
    importLimit: "現在の目標上限：{limit} 語。超過時は最初の {limit} 語のみ保存します。",
    importTrimmed: "目標上限に達しました。最初の {limit} 語を保存しました。",
    noNewStudyWords: "この単語帳には新しい学習語がもうありません。",
    startTraining: "修練開始",
    customStudy: "カスタム単語テスト",
    chooseStudyLibrary: "使うカスタム単語帳を選択",
    chooseStudyWord: "対応する英単語を選んでください",
    viewWordLibrary: "記憶カードを見る",
    viewWordLibraryCopy: "ここでは取り込んだ単語だけを表示し、内蔵単語庫とは分けます。",
    weakTrain: "弱点強化",
    currentTitle: "現在の称号",
    limitedTitle: "期間限定称号",
    claimBattleTitle: "討伐称号を受け取る",
    battleTitleReady: "週間討伐ランキング称号：{title}",
    battleTitleActive: "期間限定称号：{title}。次の週間集計で失効します。",
    ranking: "ランキング",
    xpRanking: "XP順位",
    recentXp: "今週XP",
    killRanking: "今週討伐",
    rankYou: "あなた",
    quizBattle: "クイズ討伐",
    quizAttack: "正解：{damage} ダメージ。",
    quizCounter: "不正解：{damage} ダメージを受けた。",
    battleDefeat: "HPが0になりました。マップに戻って準備しましょう。",
    correctFx: "正解！",
    wrongFx: "不正解！",
    activeGoal: "現在の目標",
    addGoal: "目標を追加",
    selectGoalRequired: "先に学習目標を選択してください",
    selectGoalNotice: "目標を選ぶと、学習・テスト・バッグ・ランキングが使えるようになります。",
    review: "総復習テスト",
    reviewReady: "{percent}% 学習済み：総復習に挑戦できます。",
    reviewLocked: "60% 学習すると総復習が開放されます。",
    reviewTitle: "10-15分の総復習",
    reviewHelper: "現在ランク以下の単語からランダム出題。合格すると昇級します。",
    reviewPassed: "総復習に合格。ランクアップ！",
    quizNoReveal: "回答を記録しました。結果は終了後に表示します。",
    quizHitHidden: "命中。",
    quizMissHidden: "記録しました。次へ進みます。",
    wrongReview: "間違えた単語",
    noWrongAnswers: "間違いはありません。",
    deferBattle: "次回にする",
    itemReward: "討伐アイテムを獲得：{items}",
    itemRewardTitle: "アイテム獲得",
    guestStart: "すぐに始める",
    googleOptional: "登録不要。進捗はこのブラウザに保存されます。名前を表示したい場合は Google でログインできます。",
    battleWonContinue: "討伐成功！残りの問題を終えると報酬がもらえます。",
    battleLostContinue: "倒れてしまい、モンスターは逃げました。残りの問題も解いてください。成績は通常どおり記録されます。",
    swordReady: "鉄剣の準備完了。次に正解するとダメージ2倍。",
    bossTag: "ボス",
    bossWaiting: "Lv.{level} のボス「{name}」が次の週テストか総復習に現れます。",
    battleWonSummary: "「{name}」を討伐：経験値 +{xp}、{loot} を獲得",
    battleLostSummary: "今回は「{name}」に負けました。使ったアイテムの半分を返却します。",
    battleEscapedSummary: "「{name}」は倒される前に逃げました。使ったアイテムの半分を返却します。",
    studyStreak: "連続学習",
    calendarTitle: "学習カレンダー",
    calendarDays: "日連続",
    freezeCount: "補填 {count} 枚",
    useFreeze: "補填券で昨日を埋める",
    calendarNote: "デイリーテストを終えるとスタンプ。7日連続ごとに補填券1枚（最大2枚）で昨日を埋められます。",
    freezeEarned: "{days}日連続！補填券を1枚獲得。",
    weekdayLetters: "日月火水木金土",
    progressTitle: "自分の進み具合",
    progressNote: "長期記憶 {count} 語",
    progressLearned: "学習済み",
    progressLongTerm: "長期記憶",
    progressDue: "今日の復習",
    progressHint: "長期記憶は3回連続で正解し、復習間隔が長くなった単語です。",
    progressWeekCompare: "この7日間で {now} 語、その前の7日間は {prev} 語。",
    progressRetention: "2週間以上前に学んだ {total} 語のうち {kept} 語が苦手リストにありません（約 {percent}%）。",
    progressRetentionEmpty: "2週間たつと、以前の単語をどれだけ覚えているかが表示されます。",
    progressWeeks: "週ごとの習得語数",
    weakTrainCount: "ミス復習（{count} 語）",
    weakTrainNote: "今回と以前のミスを混ぜて出題。2回正解すると外れます。",
    slowSpeak: "ゆっくり",
    speakExample: "例文を読み上げる",
    noQuizWords: "テストできる単語がまだありません。先に単語を学習してください。",
    adminLogin: "管理者テストモード",
    adminLoginNote: "localhost でのみ表示されるテスト用モードです。",
    importNoneFound: "どの単語も意味が見つかりませんでした。綴りを確認するか、オンライン時に再試行してください。",
    todayWordsEmpty: "「10語を学習」を押すと今日の単語が決まります。同じ日は同じセットです。",
    monsterAttack: "攻撃力",
    confirmReset: "この端末にあるこのアカウントの進捗（学習済み単語・苦手単語・アイテム・実績）をすべて消去します。元に戻せません。リセットしますか？",
    battleReady: "アイテムを選んで攻撃しよう。モンスターは毎ターン反撃してくるので、HP が尽きる前に回復を。",
    keyHint: "キーボード：← → でめくる、スペースで発音",
    answerKeyHint: "数字キー 1–4 で回答できます",
    loginLead: "1日10語。覚えてから次へ進む。",
    loginStep1: "今日の10枚のカードをめくり、発音と例文を確認",
    loginStep2: "暗記テスト：正解して初めて覚えたことになる",
    loginStep3: "デイリーテストで古い単語と苦手な単語をもう一度",
    loginStepNote: "週テストと総復習ではモンスターが登場し、正解が攻撃になります。貯めたアイテムもそこで使います。",
    loginNameHint: "ローカルテスト用のニックネーム",
    todayWords: "今日の10語",
    todayCount: "{today} / 10",
    reviewZone: "復習",
    adventureZone: "冒険",
    saveZone: "セーブと設定",
    streakDays: "{days}日連続ログイン",
    itemsTotal: "アイテム {count} 個",
    weeklyLockedNote: "累計ログイン7日ごとに開放",
    reviewLockedNote: "60% 学習後に開放",
    rankLabel: "週間称号",
    battleDamage: "{item} が {damage} ダメージ。",
    battleHeal: "{item} が {heal} HP 回復。",
    battleLost: "討伐失敗。使用アイテムの半分を返還しました。",
    equippedTitle: "称号を装備",
    equipped: "装備中",
    monsterPreview: "モンスタープレビュー",
    monsterPreviewCopy: "HP、攻撃力、特性を確認してから挑戦できます。",
    monsterTrait: "特性",
    startBattle: "討伐開始",
    dangerLevel: "危険度",
    achTotalCorrect: "累計正解数",
    achBestCombo: "最高連続正解",
    achLoginStreak: "現在の連続ログイン",
    achTotalLogin: "累計ログイン日数",
    achFirstLevel: "初回レベルアップ",
    achMonster: "討伐実績",
    achTotalLearned: "累計習得単語",
    achSrs: "長期記憶",
    achCustomWords: "カスタム単語数",
    achRankTier: "週間ランキング段位",
    admin: "管理者",
    adminPanel: "管理者テストパネル",
    adminNote: "正式版では Google アカウントの email allowlist で制限します。",
    adminXp: "+500 XP",
    adminLevel: "昇級を発生",
    adminLearn: "目標を全学習済みにする",
    adminReview: "総復習を開く",
    adminBattle: "討伐を開く",
    adminItems: "道具補充",
    adminSkipDay: "1日進める",
    adminClear: "ローカル進度削除",
    srsDue: "本日復習",
    srsAllClear: "本日復習なし",
    importProgressPrefix: "辞書を検索中",
    importStats: "完全 {full} · 部分 {partial} · 不足 {none}",
    importRejected: "{count} 個の無効語を除外",
    refetchLibrary: "再検索",
    deleteLibrary: "削除",
    refetching: "{count} 語を再検索中…",
    refetchDone: "完了。完全 {full} · 部分 {partial} · 不足 {none}",
    confirmDeleteLibrary: "このカスタム単語帳を削除しますか？元に戻せません。",
    allDoneTitle: "この単語帳は完了",
    allDoneCopy: "この単語帳のすべての語を学習しました。新しい語の追加、別の単語帳への切替、または毎日テスト・弱点リストで復習してください。",
    nextRound: "単語をリフレッシュ",
    nextRoundReset: "もう一周（最初から）",
    confirmNextRound: "今日の10語を、まだ学習していない別の10語に差し替えます。よろしいですか？",
    confirmNextRoundReset: "この単語帳は完了済みです。もう一周すると学習履歴がリセットされ最初から始まります。よろしいですか？",
    customHub: "カスタム単語帳",
    customHubTitle: "カスタム単語帳",
    customHubCopy: "ここでカスタム単語帳を管理：新規追加、記憶カード確認、辞書再検索、削除など。",
    customHubEmpty: "カスタム単語帳がまだありません。まずインポートしてください。",
    addWordsToLibrary: "この単語帳に追加",
    addWordsPlaceholder: "追加する英単語を1行に1語入力",
    addWordsDone: "{count} 語を追加しました。",
    viewAllLibraries: "全カードを見る",
    viewWordLibrary: "単語帳を表示",
    viewLibraryCopy: "インポートした単語のみ表示（発音記号・品詞・意味・例文）。",
    noMeaning: "（意味なし）",
    saveFailed: "進捗の保存に失敗しました。ブラウザの保存領域が満杯の可能性があります。「セーブを書き出す」でバックアップしてください。",
    learnedWords: "学習済みの単語",
    learnedWordsTitle: "学習済みの単語",
    learnedWordsCopy: "現在の学習目標で学んだすべての単語です。検索ボックスで素早く探せます。",
    learnedSearchPlaceholder: "単語や意味を検索…",
    learnedEmpty: "まだ学習した単語がありません。「10単語を学ぶ」から始めましょう。",
    learnedNoResults: "検索に一致する単語がありません。",
    learnedTotal: "合計 {count} 語",
    exportProgress: "セーブを書き出す",
    importProgressBtn: "セーブを読み込む",
    exportDone: "バックアップをダウンロードしました。",
    importProgressDone: "読み込み完了。進捗を復元しました。",
    importProgressInvalid: "セーブファイルが不正です。変更は行われていません。",
    confirmImportProgress: "読み込むと、このブラウザ内すべてのアカウントの進捗が上書きされます。続行しますか？",
    backupHint: "進捗はブラウザ内に保存されます。閲覧データを消すと初期化されるため、JSONバックアップの書き出しをおすすめします。",
    listenPrompt: "発音を聞いて正しい単語を選ぼう",
    replayAudio: "もう一度再生",
    darkMode: "ダークモード",
    lightMode: "ライトモード",
  },
  ko: {
    subtitle: "게임으로 익히는 영단어 도장",
    introTitle: "Vocab Arcana",
    introCopy:
      "목표를 고르면 바로 단어 수련을 시작합니다. 모국어·약점·주간 랭크에 맞춰 단어를 조정하고, 매일 테스트는 오늘 단어와 이전 단어를 섞습니다.",
    google: "Google로 계속",
    mock: "로컬 테스트 로그인",
    native: "모국어",
    goal: "학습 목표",
    name: "닉네임",
    dashboard: "수련 지도",
    test: "레벨 진단",
    learn: "10단어 학습",
    daily: "매일 테스트",
    weekly: "주간 테스트",
    weeklyTitle: "주간 테스트 (5분)",
    weeklyHelper: "이번 주 학습한 단어를 종합 시험합니다. 의미 선택과 빈칸 채우기를 혼합.",
    weeklyNoticeTitle: "주간 테스트 개방!",
    weeklyNoticeCopy: "{day}일 연속 학습! 이번 주 단어 종합 시험에 도전해 보세요.",
    weeklyNoticeOpen: "지금 시작",
    weeklyNoticeLater: "나중에",
    weak: "약점 단어",
    reset: "진행 초기화",
    placementDone: "진단 완료",
    previewDone: "암기 테스트 시작",
    startLearningCustom: "학습 시작",
    studyNewWords: "새 단어 학습",
    back: "지도로",
    backMap: "지도로 돌아가기",
    backPrevious: "이전 페이지",
    signout: "로그아웃",
    setup: "설정 시작",
    firebaseNote: "정식판은 Google 로그인을 사용합니다. 로컬 테스트 로그인은 개발 환경에서 서버가 허용할 때만 표시됩니다.",
    placementTitle: "3분 어휘력 진단",
    dailyTitle: "매일 3분 실전 테스트",
    placementHelper: "단어 중복 없이 의미 선택과 짧은 빈칸을 섞습니다.",
    dailyHelper: "오늘 배운 단어, 이전에 배운 단어, 약점 단어를 섞어 출제합니다.",
    questionProgress: "{current} / {total} 문제",
    clozeHint: "빈칸에 가장 적절한 단어를 고르세요",
    resultCopy: "초기 점수는 {score}점입니다. 우선 \"{tone}\"부터 시작하며 틀린 단어는 약점 풀에 들어갑니다.",
    correct: "정답",
    totalQuestions: "문항",
    target: "목표",
    accuracy: "정답률",
    quizSummary: "결산",
    quizSummaryTitle: "테스트 종료",
    wrongCount: "오답",
    correctAnswer: "정답",
    dashboardCopy: "목표: {goal}. 10단어 먼저 살펴본 뒤 암기 테스트로 진행합니다. 매일 테스트에는 옛 단어가 섞입니다.",
    todayProgress: "오늘 진도",
    todayProgressCopy: "오늘 {today}단어 학습, 누적 {total}단어.",
    previewEyebrow: "10단어 미리보기",
    previewTitle: "전체 단어 먼저 보기",
    previewCopy: "이번 라운드는 10단어를 먼저 본 뒤 암기 테스트로 진행합니다. 진도에 따라 이전 단어와 약점 단어가 섞입니다.",
    recallTitle: "암기 테스트",
    weakTitle: "약점 노트",
    weakCopyFilled: "이 단어들은 학습과 매일 테스트에서 자주 나옵니다.",
    weakCopyEmpty: "약점 단어가 없습니다. 단어 전투를 한 번 해보세요.",
    hit: "정답!",
    hitStudy: "정답! 이 단어를 마법서에 기록했습니다.",
    miss: "오답, 정답은 {answer} 입니다.",
    missStudy: "오답. 정답은 \"{answer}\" 이며 약점 노트에 추가되었습니다.",
    dailyDone: "매일 테스트 완료: {correct}/{total}",
    traveler: "여행자",
    statPlacement: "진단",
    statWords: "어/회",
    statRanks: "랭크",
    speak: "발음",
    previousCard: "이전",
    nextCard: "다음",
    cardProgress: "{current} / {total}",
    cardHint: "좌우로 스와이프해 다음 카드",
    exampleLabel: "예문",
    studyLoading: "단어 준비 중",
    xp: "경험치",
    adventurerRank: "모험 랭크",
    wordTier: "단어 랭크",
    tier1: "쉬움",
    tier2: "보통",
    tier3: "중급",
    tier4: "어려움",
    tier5: "최상급",
    nextLevel: "다음 레벨까지",
    levelUp: "승급 퀘스트",
    playMiniGame: "레트로 게임 시작",
    claimLevelLoot: "승급 보상 받기",
    battleMonster: "몬스터 도전",
    inventory: "도구 가방",
    inventoryTitle: "가방",
    inventoryCopy: "현재 사용 가능한 토벌 아이템을 확인합니다.",
    emptyInventory: "가방이 비었습니다. 로그인, 승급, 도전으로 아이템을 얻으세요.",
    learningActions: "학습",
    adventureActions: "모험",
    achievements: "업적",
    achievementsCopy: "각 카테고리에는 다음 목표가 표시됩니다. 카드를 펼치면 획득한 칭호와 미달성 칭호를 확인할 수 있습니다.",
    achNextTarget: "다음 목표",
    achEarnedTitles: "획득한 칭호",
    achLockedTitles: "미달성",
    achAllComplete: "전부 달성",
    noTitle: "칭호 없음",
    monsterBattle: "몬스터 토벌",
    playerHp: "플레이어 HP",
    monsterHp: "몬스터 HP",
    useItem: "사용",
    victory: "토벌 성공!",
    noItems: "도구가 없습니다. 승급해서 보급을 얻으세요.",
    miniTitle: "룬 반응전",
    miniCopy: "시간 내 빛나는 룬을 클릭하세요. 점수가 높을수록 보너스 경험치가 늘어납니다.",
    miniScore: "점수",
    miniTime: "시간",
    claimReward: "보상 받기",
    streak: "연속 로그인",
    streakReward: "오늘의 보급: {reward}",
    reward1: "검 x1",
    reward3: "검 x1, 회복약 x1",
    reward5: "폭탄 x1, 회복약 x1",
    reward7: "폭탄 x2, 회복약 x2",
    importWords: "단어 가져오기",
    library: "단어집",
    builtInLibrary: "기본 시험 단어집",
    customLibrary: "커스텀 단어집",
    importTitle: "새 단어집 만들기",
    importCopy: "한 줄에 영어 단어 하나만 입력하면 뜻, 품사, 예문은 자동으로 찾습니다. 사진을 올려 인식된 단어를 붙여넣을 수도 있습니다.",
    libraryName: "단어집 이름",
    wordInput: "단어 내용",
    photoInput: "사진 업로드",
    saveLibrary: "저장하고 전환",
    importPlaceholder: "abandon, 포기하다, Never abandon your dream.\naccurate, 정확한, The report is accurate.",
    englishOnlyPlaceholder: "abandon\naccurate\nstrategy\nsignificant",
    imported: "{count}개의 단어를 가져왔습니다.",
    importLimit: "현재 목표 상한: {limit} 단어. 초과 시 처음 {limit}개만 저장됩니다.",
    importTrimmed: "목표 상한에 도달. 처음 {limit}개의 단어를 저장했습니다.",
    noNewStudyWords: "이 단어집에는 새로운 학습 단어가 없습니다.",
    startTraining: "수련 시작",
    customStudy: "커스텀 단어 테스트",
    chooseStudyLibrary: "사용할 커스텀 단어집을 선택",
    chooseStudyWord: "해당 영단어를 고르세요",
    viewWordLibrary: "기억 카드 보기",
    viewWordLibraryCopy: "여기서는 가져온 단어만 표시하며 기본 라이브러리와 분리합니다.",
    weakTrain: "약점 강화",
    currentTitle: "현재 칭호",
    limitedTitle: "기간 한정 칭호",
    claimBattleTitle: "토벌 랭킹 칭호 받기",
    battleTitleReady: "주간 토벌 랭킹 칭호: {title}",
    battleTitleActive: "기간 한정 칭호: {title}. 다음 주간 결산 때 만료됩니다.",
    ranking: "랭킹",
    xpRanking: "XP 순위",
    recentXp: "이번 주 XP",
    killRanking: "이번 주 토벌",
    rankYou: "당신",
    quizBattle: "퀴즈 토벌",
    quizAttack: "정답: {damage} 데미지.",
    quizCounter: "오답: {damage} 데미지를 받았습니다.",
    battleDefeat: "HP가 0이 되었습니다. 지도로 돌아가 재정비하세요.",
    correctFx: "정답!",
    wrongFx: "오답!",
    activeGoal: "현재 목표",
    addGoal: "목표 추가",
    selectGoalRequired: "먼저 학습 목표를 선택하세요",
    selectGoalNotice: "목표를 선택하면 학습, 시험, 가방, 랭킹 기능이 열립니다.",
    review: "종합 복습 시험",
    reviewReady: "{percent}% 학습됨: 종합 복습에 도전할 수 있습니다.",
    reviewLocked: "60% 학습 후 종합 복습이 열립니다.",
    reviewTitle: "10-15분 종합 복습",
    reviewHelper: "현재 랭크 이하의 단어에서 무작위 출제. 통과 시 승급합니다.",
    reviewPassed: "종합 복습 통과. 랭크 업!",
    quizNoReveal: "응답을 기록했습니다. 결과는 종료 후 표시됩니다.",
    quizHitHidden: "명중.",
    quizMissHidden: "기록 완료. 다음으로 진행합니다.",
    wrongReview: "틀린 단어",
    noWrongAnswers: "오답이 없습니다.",
    deferBattle: "다음으로",
    itemReward: "토벌 아이템 획득: {items}",
    itemRewardTitle: "아이템 획득",
    guestStart: "바로 시작",
    googleOptional: "가입 없이 시작해요. 진도는 이 브라우저에 저장되며, 이름을 표시하려면 Google로 로그인할 수 있어요.",
    battleWonContinue: "토벌 성공! 남은 문제를 끝내면 보상을 받아요.",
    battleLostContinue: "쓰러졌고 몬스터는 도망갔어요. 남은 문제도 풀어 주세요. 점수는 그대로 계산됩니다.",
    swordReady: "철검 준비 완료. 다음 정답은 피해 2배.",
    bossTag: "보스",
    bossWaiting: "Lv.{level} 보스 「{name}」가 다음 주간 테스트나 총복습에 나타납니다.",
    battleWonSummary: "「{name}」 토벌: 경험치 +{xp}, {loot} 획득",
    battleLostSummary: "이번에는 「{name}」에게 졌어요. 사용한 아이템의 절반을 돌려드려요.",
    battleEscapedSummary: "「{name}」가 쓰러지기 전에 도망갔어요. 사용한 아이템의 절반을 돌려드려요.",
    studyStreak: "연속 학습",
    calendarTitle: "학습 달력",
    calendarDays: "일 연속",
    freezeCount: "보충권 {count}장",
    useFreeze: "보충권으로 어제 채우기",
    calendarNote: "데일리 테스트를 끝내면 도장. 7일 연속마다 보충권 1장(최대 2장)으로 어제를 채울 수 있어요.",
    freezeEarned: "{days}일 연속! 보충권 1장 획득.",
    weekdayLetters: "일월화수목금토",
    progressTitle: "내 진도",
    progressNote: "장기 기억 {count}단어",
    progressLearned: "학습한 단어",
    progressLongTerm: "장기 기억",
    progressDue: "오늘 복습",
    progressHint: "장기 기억은 세 번 연속 맞혀 복습 간격이 길어진 단어입니다.",
    progressWeekCompare: "최근 7일 {now}단어, 그 전 7일 {prev}단어.",
    progressRetention: "2주 이상 전에 배운 {total}단어 중 {kept}단어가 약점에 없습니다(약 {percent}%).",
    progressRetentionEmpty: "2주가 지나면 예전 단어를 얼마나 기억하는지 보여 줍니다.",
    progressWeeks: "주별 학습 단어 수",
    weakTrainCount: "오답 연습 ({count}단어)",
    weakTrainNote: "이번과 이전 오답을 섞어 출제하며, 두 번 맞히면 빠집니다.",
    slowSpeak: "느리게",
    speakExample: "예문 읽기",
    noQuizWords: "아직 시험 볼 단어가 없습니다. 먼저 단어를 학습하세요.",
    adminLogin: "관리자 테스트 모드",
    adminLoginNote: "localhost에서만 보이는 테스트용 모드입니다.",
    importNoneFound: "어떤 단어도 뜻을 찾지 못했습니다. 철자를 확인하거나 온라인 상태에서 다시 시도하세요.",
    todayWordsEmpty: "‘10단어 학습’을 누르면 오늘의 단어가 정해지고, 하루 동안 그대로 유지됩니다.",
    monsterAttack: "공격력",
    confirmReset: "이 기기에 있는 이 계정의 모든 진행(학습 단어, 약점 단어, 아이템, 업적)이 삭제되며 되돌릴 수 없습니다. 초기화할까요?",
    battleReady: "아이템을 골라 공격하세요. 몬스터는 매 턴 반격하니 HP가 바닥나기 전에 회복하세요.",
    keyHint: "키보드: ← → 로 넘기기, 스페이스로 발음",
    answerKeyHint: "숫자 키 1–4 로 답할 수 있어요",
    loginLead: "하루 10단어, 외우고 나서 다음으로.",
    loginStep1: "오늘의 카드 10장을 넘기며 발음과 예문 확인",
    loginStep2: "암기 테스트: 맞혀야 외운 것으로 기록",
    loginStep3: "데일리 테스트로 예전 단어와 약점 단어를 다시",
    loginStepNote: "주간 테스트와 총복습에는 몬스터가 나오고, 정답이 곧 공격이에요. 모은 아이템도 그때 씁니다.",
    loginNameHint: "로컬 테스트용 닉네임",
    todayWords: "오늘의 10단어",
    todayCount: "{today} / 10",
    reviewZone: "복습",
    adventureZone: "모험",
    saveZone: "저장 및 설정",
    streakDays: "{days}일 연속 로그인",
    itemsTotal: "아이템 {count}개",
    weeklyLockedNote: "누적 로그인 7일마다 열림",
    reviewLockedNote: "60% 학습 후 열림",
    rankLabel: "주간 칭호",
    battleDamage: "{item}이(가) {damage} 데미지.",
    battleHeal: "{item}이(가) {heal} HP 회복.",
    battleLost: "토벌 실패. 사용한 아이템의 절반을 돌려받았습니다.",
    equippedTitle: "칭호 장착",
    equipped: "장착 중",
    monsterPreview: "몬스터 미리보기",
    monsterPreviewCopy: "HP, 공격력, 특성을 확인한 뒤 도전할 수 있습니다.",
    monsterTrait: "특성",
    startBattle: "토벌 시작",
    dangerLevel: "위험도",
    achTotalCorrect: "누적 정답 수",
    achBestCombo: "최고 연속 정답",
    achLoginStreak: "현재 연속 로그인",
    achTotalLogin: "누적 로그인 일수",
    achFirstLevel: "최초 승급",
    achMonster: "토벌 업적",
    achTotalLearned: "누적 학습 단어",
    achSrs: "장기 기억",
    achCustomWords: "커스텀 단어 수",
    achRankTier: "주간 랭킹 단계",
    admin: "관리자",
    adminPanel: "관리자 테스트 패널",
    adminNote: "정식판에서는 Google 계정 email allowlist로 제한합니다.",
    adminXp: "+500 XP",
    adminLevel: "승급 발동",
    adminLearn: "목표 전체 학습 처리",
    adminReview: "종합 복습 열기",
    adminBattle: "토벌 열기",
    adminItems: "도구 보충",
    adminSkipDay: "하루 진행",
    adminClear: "로컬 진행 삭제",
    srsDue: "오늘 복습",
    srsAllClear: "오늘 복습 없음",
    importProgressPrefix: "사전 검색 중",
    importStats: "완전 {full} · 일부 {partial} · 부족 {none}",
    importRejected: "유효하지 않은 단어 {count}개 제외",
    refetchLibrary: "사전 재검색",
    deleteLibrary: "삭제",
    refetching: "{count}개 단어를 재검색 중…",
    refetchDone: "완료. 완전 {full} · 일부 {partial} · 부족 {none}",
    confirmDeleteLibrary: "이 커스텀 단어집을 삭제하시겠습니까? 되돌릴 수 없습니다.",
    allDoneTitle: "이 단어집을 모두 학습함",
    allDoneCopy: "이 단어집의 모든 단어를 학습했습니다. 단어를 추가하거나 단어집을 전환하거나, 매일 테스트 · 약점 풀로 복습하세요.",
    nextRound: "단어 새로고침",
    nextRoundReset: "다시 한 바퀴 (반복 학습)",
    confirmNextRound: "오늘 학습한 10개 단어를 아직 안 한 다른 10개로 교체합니다. 계속하시겠습니까?",
    confirmNextRoundReset: "이 단어집을 모두 학습했습니다. 다시 한 바퀴를 돌면 학습 기록이 초기화되어 처음부터 시작합니다. 계속하시겠습니까?",
    customHub: "커스텀 단어집",
    customHubTitle: "커스텀 단어 전용 구역",
    customHubCopy: "여기서 커스텀 단어집을 관리합니다: 추가, 카드 확인, 사전 재검색, 삭제 등.",
    customHubEmpty: "아직 커스텀 단어집이 없습니다. 먼저 가져오기를 해보세요.",
    addWordsToLibrary: "이 단어집에 단어 추가",
    addWordsPlaceholder: "추가할 영어 단어를 한 줄에 하나씩 입력",
    addWordsDone: "{count}개 단어를 추가했습니다.",
    viewAllLibraries: "전체 카드 보기",
    viewWordLibrary: "단어집 보기",
    viewLibraryCopy: "가져온 단어만 표시합니다 (발음 기호 · 품사 · 뜻 · 예문).",
    noMeaning: "(뜻 없음)",
    saveFailed: "진행 상황 저장 실패: 브라우저 저장 공간이 가득 찼을 수 있습니다. 최근 진행 상황이 사라질 수 있으니 백업을 내보내세요.",
    learnedWords: "학습한 단어",
    learnedWordsTitle: "학습한 단어",
    learnedWordsCopy: "현재 학습 목표에서 학습한 모든 단어입니다. 검색창으로 빠르게 찾을 수 있습니다.",
    learnedSearchPlaceholder: "단어 또는 뜻 검색…",
    learnedEmpty: "아직 학습한 단어가 없습니다. \"10단어 학습\"부터 시작하세요.",
    learnedNoResults: "검색과 일치하는 단어가 없습니다.",
    learnedTotal: "총 {count} 단어",
    exportProgress: "저장 내보내기",
    importProgressBtn: "저장 가져오기",
    exportDone: "백업을 다운로드했습니다.",
    importProgressDone: "가져오기 완료. 진행 상황이 복원되었습니다.",
    importProgressInvalid: "잘못된 저장 파일입니다. 아무것도 변경되지 않았습니다.",
    confirmImportProgress: "가져오면 이 브라우저의 모든 계정 진행 상황을 덮어씁니다. 계속할까요?",
    backupHint: "진행 상황은 브라우저에 저장됩니다. 데이터 삭제 시 초기화되므로 JSON 백업을 내보내 두세요.",
    listenPrompt: "발음을 듣고 알맞은 단어를 고르세요",
    replayAudio: "다시 듣기",
    darkMode: "다크 모드",
    lightMode: "라이트 모드",
  },
  es: {
    subtitle: "Dojo gamificado de vocabulario en inglés",
    introTitle: "Vocab Arcana",
    introCopy:
      "Empieza a entrenar justo después de elegir un objetivo. Las palabras se ajustan a tu idioma, puntos débiles y rango semanal. Las pruebas diarias mezclan palabras de hoy con anteriores.",
    google: "Continuar con Google",
    mock: "Inicio local de prueba",
    native: "Idioma nativo",
    goal: "Objetivo de estudio",
    name: "Nombre",
    dashboard: "Mapa de entrenamiento",
    test: "Prueba de nivel",
    learn: "Estudiar 10 palabras",
    daily: "Prueba diaria",
    weekly: "Prueba semanal",
    weeklyTitle: "Prueba semanal (5 min)",
    weeklyHelper: "Cubre todas las palabras aprendidas esta semana, mezclando significado y rellenar huecos.",
    weeklyNoticeTitle: "¡Prueba semanal desbloqueada!",
    weeklyNoticeCopy: "Llevas {day} días aprendiendo. ¡Acepta el desafío semanal!",
    weeklyNoticeOpen: "Empezar ahora",
    weeklyNoticeLater: "Más tarde",
    weak: "Palabras débiles",
    reset: "Reiniciar progreso",
    placementDone: "Prueba completada",
    previewDone: "Empezar prueba de memoria",
    startLearningCustom: "Empezar a estudiar",
    studyNewWords: "Estudiar palabras nuevas",
    back: "Al mapa",
    backMap: "Volver al mapa",
    backPrevious: "Página anterior",
    signout: "Cerrar sesión",
    setup: "Iniciar configuración",
    firebaseNote: "La versión final usa inicio con Google. El login local solo aparece en desarrollo si el servidor lo permite.",
    placementTitle: "Despierta tu vocabulario en 3 minutos",
    dailyTitle: "Prueba diaria de 3 minutos",
    placementHelper: "Sin palabras repetidas. Mezcla selección de significado y huecos cortos.",
    dailyHelper: "Mezcla palabras de hoy, palabras anteriores y palabras débiles.",
    questionProgress: "Pregunta {current} / {total}",
    clozeHint: "Elige la palabra que mejor encaja en el hueco",
    resultCopy: "Tu puntuación inicial es {score}. Empieza por \"{tone}\"; las palabras falladas van al banco de palabras débiles.",
    correct: "Aciertos",
    totalQuestions: "Total",
    target: "Objetivo",
    accuracy: "Precisión",
    quizSummary: "Resumen",
    quizSummaryTitle: "Prueba terminada",
    wrongCount: "Falladas",
    correctAnswer: "Respuesta",
    dashboardCopy: "Objetivo: {goal}. Primero repasa 10 palabras, luego haz la prueba de memoria. Las diarias mezclan palabras antiguas.",
    todayProgress: "Progreso de hoy",
    todayProgressCopy: "{today} palabras hoy; {total} en total.",
    previewEyebrow: "Vista previa de 10 palabras",
    previewTitle: "Revisa todas las palabras primero",
    previewCopy: "Esta ronda muestra 10 palabras antes de la prueba. Palabras antiguas y débiles se mezclan según tu progreso.",
    recallTitle: "Prueba de memoria",
    weakTitle: "Cuaderno de errores",
    weakCopyFilled: "Estas palabras saldrán con más frecuencia en estudios y pruebas diarias.",
    weakCopyEmpty: "Aún no hay palabras débiles. Haz una ronda de batalla.",
    hit: "Acierto.",
    hitStudy: "Acierto. Esta palabra queda registrada.",
    miss: "Fallo, la respuesta es {answer}.",
    missStudy: "Fallo. La respuesta es \"{answer}\", añadida al cuaderno de errores.",
    dailyDone: "Prueba diaria completada: {correct}/{total}",
    traveler: "Viajero",
    statPlacement: "nivel",
    statWords: "palabras/sesión",
    statRanks: "rangos",
    speak: "Hablar",
    previousCard: "Anterior",
    nextCard: "Siguiente",
    cardProgress: "{current} / {total}",
    cardHint: "Desliza a los lados para la siguiente tarjeta",
    exampleLabel: "Ejemplo",
    studyLoading: "Preparando palabras",
    xp: "XP",
    adventurerRank: "Rango aventurero",
    wordTier: "Nivel de palabra",
    tier1: "Fácil",
    tier2: "Básico",
    tier3: "Medio",
    tier4: "Difícil",
    tier5: "Muy difícil",
    nextLevel: "Próximo nivel",
    levelUp: "Misión de ascenso",
    playMiniGame: "Jugar minijuego retro",
    claimLevelLoot: "Recoger botín",
    battleMonster: "Combatir monstruo",
    inventory: "Inventario",
    inventoryTitle: "Mochila",
    inventoryCopy: "Consulta los objetos de combate disponibles.",
    emptyInventory: "Mochila vacía. Consigue objetos iniciando sesión, subiendo de nivel o en combates.",
    learningActions: "Aprendizaje",
    adventureActions: "Aventura",
    achievements: "Logros",
    achievementsCopy: "Cada categoría muestra el próximo objetivo. Abre la tarjeta para ver títulos obtenidos y pendientes.",
    achNextTarget: "Próximo objetivo",
    achEarnedTitles: "Títulos obtenidos",
    achLockedTitles: "Pendientes",
    achAllComplete: "Todo completado",
    noTitle: "Sin título",
    monsterBattle: "Caza de monstruos",
    playerHp: "HP del jugador",
    monsterHp: "HP del monstruo",
    useItem: "Usar",
    victory: "¡Victoria!",
    noItems: "No hay objetos. Sube de nivel para obtener suministros.",
    miniTitle: "Reflejos rúnicos",
    miniCopy: "Haz clic en las runas brillantes antes de que se acabe el tiempo. Mayor puntuación, más XP de bonus.",
    miniScore: "Puntuación",
    miniTime: "Tiempo",
    claimReward: "Reclamar recompensa",
    streak: "Racha de inicios",
    streakReward: "Suministro de hoy: {reward}",
    reward1: "Espada x1",
    reward3: "Espada x1, poción x1",
    reward5: "Bomba x1, poción x1",
    reward7: "Bomba x2, poción x2",
    importWords: "Importar palabras",
    library: "Biblioteca",
    builtInLibrary: "Biblioteca integrada",
    customLibrary: "Biblioteca personal",
    importTitle: "Crear una biblioteca nueva",
    importCopy: "Escribe una palabra en inglés por línea; el significado, la categoría y un ejemplo se buscan solos. También puedes subir una foto y pegar las palabras reconocidas.",
    libraryName: "Nombre de la biblioteca",
    wordInput: "Contenido",
    photoInput: "Subir foto",
    saveLibrary: "Guardar y cambiar",
    importPlaceholder: "abandon, dejar, Never abandon your dream.\naccurate, preciso, The report is accurate.",
    englishOnlyPlaceholder: "abandon\naccurate\nstrategy\nsignificant",
    imported: "{count} palabras importadas.",
    importLimit: "Límite actual: {limit} palabras. Si te pasas, solo se guardan las primeras {limit}.",
    importTrimmed: "Límite alcanzado. Se guardaron las primeras {limit} palabras.",
    noNewStudyWords: "Esta biblioteca ya no tiene palabras nuevas que estudiar.",
    startTraining: "Empezar entrenamiento",
    customStudy: "Prueba personal",
    chooseStudyLibrary: "Elige una biblioteca personal",
    chooseStudyWord: "Elige la palabra inglesa correspondiente",
    viewWordLibrary: "Ver tarjetas de memoria",
    viewWordLibraryCopy: "Muestra solo las palabras importadas, separadas de la biblioteca integrada.",
    weakTrain: "Refuerzo de débiles",
    currentTitle: "Título actual",
    limitedTitle: "Título limitado",
    claimBattleTitle: "Reclamar título de caza",
    battleTitleReady: "Título semanal de caza listo: {title}",
    battleTitleActive: "Título limitado: {title}. Caduca en el próximo cierre semanal.",
    ranking: "Clasificación",
    xpRanking: "Ranking XP",
    recentXp: "XP semanal",
    killRanking: "Cazas semanales",
    rankYou: "Tú",
    quizBattle: "Combate de preguntas",
    quizAttack: "Acierto: {damage} de daño.",
    quizCounter: "Fallo: recibes {damage} de daño.",
    battleDefeat: "Tu HP llegó a 0. Vuelve al mapa para prepararte.",
    correctFx: "¡Correcto!",
    wrongFx: "¡Incorrecto!",
    activeGoal: "Objetivo actual",
    addGoal: "Añadir objetivo",
    selectGoalRequired: "Elige primero un objetivo",
    selectGoalNotice: "Aprendizaje, pruebas, inventario y rankings se activan después de elegir un objetivo.",
    review: "Examen general",
    reviewReady: "{percent}% aprendido: puedes intentar el examen general.",
    reviewLocked: "El examen general se desbloquea al 60% aprendido.",
    reviewTitle: "Examen general de 10-15 min",
    reviewHelper: "Palabras aleatorias de tu rango actual o inferior. Aprueba para subir de rango.",
    reviewPassed: "¡Examen general aprobado! Rango mejorado.",
    quizNoReveal: "Respuesta registrada. El resultado aparece al final.",
    quizHitHidden: "Acierto.",
    quizMissHidden: "Registrado. Pasa a la siguiente.",
    wrongReview: "Palabras falladas",
    noWrongAnswers: "Sin fallos.",
    deferBattle: "Para luego",
    itemReward: "Objeto obtenido: {items}",
    itemRewardTitle: "Objetos obtenidos",
    guestStart: "Empezar ahora",
    googleOptional: "Sin registro: el progreso se guarda en este navegador. Entra con Google si quieres ver tu nombre.",
    battleWonContinue: "¡Monstruo derrotado! Termina las preguntas para recibir la recompensa.",
    battleLostContinue: "Caíste y el monstruo escapó. Termina las preguntas; tu nota cuenta igual.",
    swordReady: "Espada lista: tu próximo acierto hace el doble de daño.",
    bossTag: "Jefe",
    bossWaiting: "El jefe Lv.{level} «{name}» aparecerá en tu próxima prueba semanal o repaso general.",
    battleWonSummary: "Derrotaste a «{name}»: +{xp} XP y {loot}",
    battleLostSummary: "Esta vez perdiste contra «{name}». Se devolvió la mitad de los objetos usados.",
    battleEscapedSummary: "«{name}» escapó antes de ser derrotado. Se devolvió la mitad de los objetos usados.",
    studyStreak: "Racha",
    calendarTitle: "Calendario",
    calendarDays: "días seguidos",
    freezeCount: "{count} comodines",
    useFreeze: "Usar un comodín para ayer",
    calendarNote: "Termina la prueba diaria para sellar el día. Cada racha de 7 días da un comodín (máx. 2) para cubrir ayer.",
    freezeEarned: "¡Racha de {days} días! Ganaste un comodín.",
    weekdayLetters: "DLMXJVS",
    progressTitle: "Mi progreso",
    progressNote: "{count} palabras en memoria a largo plazo",
    progressLearned: "Aprendidas",
    progressLongTerm: "Largo plazo",
    progressDue: "Para hoy",
    progressHint: "Largo plazo: palabras acertadas tres veces seguidas, con repasos más espaciados.",
    progressWeekCompare: "{now} palabras en los últimos 7 días; {prev} en los 7 anteriores.",
    progressRetention: "De {total} palabras aprendidas hace dos semanas o más, {kept} no están entre las débiles (≈{percent} %).",
    progressRetentionEmpty: "Tras dos semanas verás cuántas palabras antiguas recuerdas.",
    progressWeeks: "Palabras por semana",
    weakTrainCount: "Repasar errores ({count} palabras)",
    weakTrainNote: "Mezcla los errores de hoy y anteriores; una palabra sale tras dos aciertos.",
    slowSpeak: "Lento",
    speakExample: "Leer el ejemplo",
    noQuizWords: "Todavía no hay palabras para evaluar. Estudia algunas primero.",
    adminLogin: "Modo de prueba de administrador",
    adminLoginNote: "Solo aparece en localhost para pruebas.",
    importNoneFound: "No se encontró ninguna de estas palabras. Revisa la ortografía o inténtalo de nuevo con conexión.",
    todayWordsEmpty: "Pulsa «Estudiar 10 palabras» para sacar las palabras de hoy; no cambian en todo el día.",
    monsterAttack: "Ataque",
    confirmReset: "Esto borra todo el progreso de esta cuenta en este dispositivo (palabras aprendidas, débiles, objetos y logros) y no se puede deshacer. ¿Reiniciar?",
    battleReady: "Elige un objeto para atacar. El monstruo contraataca cada turno: usa una poción antes de quedarte sin vida.",
    keyHint: "Teclado: ← → para pasar, Espacio para escuchar",
    answerKeyHint: "Pulsa 1–4 para responder",
    loginLead: "Diez palabras al día. Apréndelas antes de seguir.",
    loginStep1: "Pasa las 10 tarjetas de hoy, escucha cada palabra y lee el ejemplo",
    loginStep2: "Prueba de memoria: solo cuenta si aciertas",
    loginStep3: "La prueba diaria repasa palabras antiguas y débiles",
    loginStepNote: "Las pruebas semanales y el repaso general traen un monstruo: cada acierto es un ataque, y ahí usas tus objetos.",
    loginNameHint: "Apodo para el inicio de sesión local",
    todayWords: "Las 10 palabras de hoy",
    todayCount: "{today} / 10",
    reviewZone: "Repaso",
    adventureZone: "Aventura",
    saveZone: "Guardado y ajustes",
    streakDays: "Racha de {days} días",
    itemsTotal: "{count} objetos",
    weeklyLockedNote: "Se abre cada 7 días de acceso",
    reviewLockedNote: "Se abre al 60 % aprendido",
    rankLabel: "Título semanal",
    battleDamage: "{item} causa {damage} de daño.",
    battleHeal: "{item} recupera {heal} HP.",
    battleLost: "Caza fallida. Se reembolsa la mitad de los objetos usados.",
    equippedTitle: "Equipar título",
    equipped: "Equipado",
    monsterPreview: "Vista previa del monstruo",
    monsterPreviewCopy: "Revisa HP, ataque y rasgos antes de combatir.",
    monsterTrait: "Rasgo",
    startBattle: "Iniciar combate",
    dangerLevel: "Peligro",
    achTotalCorrect: "Aciertos totales",
    achBestCombo: "Mejor racha de aciertos",
    achLoginStreak: "Racha actual",
    achTotalLogin: "Días de login totales",
    achFirstLevel: "Primer ascenso",
    achMonster: "Caza",
    achTotalLearned: "Palabras aprendidas",
    achSrs: "Memoria a largo plazo",
    achCustomWords: "Palabras personalizadas",
    achRankTier: "Rango semanal",
    admin: "Admin",
    adminPanel: "Panel de admin",
    adminNote: "La versión final restringe esto con allowlist de email.",
    adminXp: "+500 XP",
    adminLevel: "Ascenso",
    adminLearn: "Marcar objetivo completo",
    adminReview: "Abrir examen",
    adminBattle: "Abrir caza",
    adminItems: "Rellenar objetos",
    adminSkipDay: "Avanzar 1 día",
    adminClear: "Borrar progreso local",
    srsDue: "Repasar hoy",
    srsAllClear: "Sin repasos hoy",
    importProgressPrefix: "Consultando diccionario",
    importStats: "completo {full} · parcial {partial} · sin datos {none}",
    importRejected: "{count} palabras inválidas excluidas",
    refetchLibrary: "Reconsultar",
    deleteLibrary: "Eliminar",
    refetching: "Reconsultando {count} palabras…",
    refetchDone: "Hecho. completo {full} · parcial {partial} · sin datos {none}",
    confirmDeleteLibrary: "¿Eliminar esta biblioteca personal? No se puede deshacer.",
    allDoneTitle: "Biblioteca completada",
    allDoneCopy: "Has estudiado todas las palabras. Importa más, cambia de biblioteca o usa pruebas diarias y débiles para repasar.",
    nextRound: "Refrescar palabras",
    nextRoundReset: "Otra ronda (repetir)",
    confirmNextRound: "Las 10 palabras de hoy se cambiarán por otras 10 que aún no has estudiado. ¿Continuar?",
    confirmNextRoundReset: "Has terminado esta biblioteca. Reiniciar borrará el historial y empezarás de cero. ¿Continuar?",
    customHub: "Zona personal",
    customHubTitle: "Zona de palabras personales",
    customHubCopy: "Gestiona aquí tus bibliotecas personales: importar, ver tarjetas, reconsultar diccionario, eliminar.",
    customHubEmpty: "Aún no hay bibliotecas personales. Importa una primero.",
    addWordsToLibrary: "Añadir palabras a esta biblioteca",
    addWordsPlaceholder: "Introduce palabras inglesas nuevas, una por línea",
    addWordsDone: "Se añadieron {count} palabras.",
    viewAllLibraries: "Ver todas las tarjetas",
    viewWordLibrary: "Ver biblioteca",
    viewLibraryCopy: "Solo las palabras importadas (fonética, parte de la oración, significado, ejemplo).",
    noMeaning: "(sin significado)",
    saveFailed: "No se pudo guardar el progreso: el almacenamiento del navegador puede estar lleno. Exporta una copia de seguridad.",
    learnedWords: "Palabras aprendidas",
    learnedWordsTitle: "Palabras aprendidas",
    learnedWordsCopy: "Todas las palabras aprendidas para tu meta actual. Usa el buscador para encontrarlas rápido.",
    learnedSearchPlaceholder: "Buscar palabra o significado…",
    learnedEmpty: "Aún no hay palabras aprendidas. Empieza con \"Estudiar 10 palabras\".",
    learnedNoResults: "Ninguna palabra coincide con la búsqueda.",
    learnedTotal: "{count} palabras en total",
    exportProgress: "Exportar partida",
    importProgressBtn: "Importar partida",
    exportDone: "Copia de seguridad descargada.",
    importProgressDone: "Importación completa. Progreso restaurado.",
    importProgressInvalid: "Archivo de guardado no válido. No se cambió nada.",
    confirmImportProgress: "Importar sobrescribirá el progreso local de todas las cuentas en este navegador. ¿Continuar?",
    backupHint: "El progreso vive en este navegador; borrar los datos lo reinicia. Exporta una copia JSON de seguridad.",
    listenPrompt: "Escucha y elige la palabra correcta",
    replayAudio: "Repetir audio",
    darkMode: "Modo oscuro",
    lightMode: "Modo claro",
  },
};

const levels = [
  { id: 1, name: "燭火侍從", min: 0, tone: "初入行會" },
  { id: 2, name: "銅環見習騎士", min: 15, tone: "掌握基礎戰技" },
  { id: 3, name: "銀頁誓約者", min: 30, tone: "能穩定完成委託" },
  { id: 4, name: "霜刃巡獵官", min: 45, tone: "具備前線討伐資格" },
  { id: 5, name: "聖紋守城將", min: 60, tone: "守護城邦的主力" },
  { id: 6, name: "龍脊遠征侯", min: 75, tone: "率隊穿越禁域" },
  { id: 7, name: "星冠大賢王", min: 90, tone: "週榜最高榮銜" },
];

// ---------- SRS (SM-2 lite) ----------
// 每個單字在 profile.srs[wordText] 內存放：
//   { ease, interval, reps, lapses, lastReview, nextReview }
// ease   : 難度係數，越高代表越好背，1.3 ~ 2.8
// interval: 距離下次複習的天數
// reps   : 連續答對次數（答錯歸零）
// lapses : 累計答錯次數
// lastReview / nextReview: 'YYYY-MM-DD' 字串
const SRS_DEFAULT_EASE = 2.5;
const SRS_MIN_EASE = 1.3;
const SRS_MAX_EASE = 2.8;

function srsAddDays(dateStr, days) {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function srsEnsureEntry(profile, wordText) {
  if (!profile.srs) profile.srs = {};
  if (!profile.srs[wordText]) {
    profile.srs[wordText] = {
      ease: SRS_DEFAULT_EASE,
      interval: 0,
      reps: 0,
      lapses: 0,
      lastReview: null,
      nextReview: todayKey(), // 新字預設今天到期
    };
  }
  return profile.srs[wordText];
}

function srsUpdate(wordText, isCorrect, opts = {}) {
  const profile = activeProfile();
  const entry = srsEnsureEntry(profile, wordText);
  const fast = opts.fast === true; // 答對且夠快 → 加分
  if (isCorrect && entry.reps > 0 && entry.nextReview && entry.nextReview > todayKey()) {
    // 還沒到期就答對（同一天在不同測驗又遇到）：只記錄，不拉長間隔
    entry.lastReview = todayKey();
    return entry;
  }
  if (isCorrect) {
    entry.reps += 1;
    if (entry.reps === 1) entry.interval = 1;
    else if (entry.reps === 2) entry.interval = 3;
    else entry.interval = Math.max(1, Math.round(entry.interval * entry.ease));
    const bump = fast ? 0.1 : 0.05;
    entry.ease = Math.min(SRS_MAX_EASE, entry.ease + bump);
  } else {
    entry.reps = 0;
    entry.lapses += 1;
    entry.interval = 1;
    entry.ease = Math.max(SRS_MIN_EASE, entry.ease - 0.2);
  }
  entry.lastReview = todayKey();
  entry.nextReview = srsAddDays(todayKey(), entry.interval);
  return entry;
}

function srsDueWords(profile, source) {
  if (!profile.srs) return [];
  return source.filter((item) => {
    const entry = profile.srs[item.word];
    if (!entry) return false;
    return entry.nextReview && entry.nextReview <= todayKey();
  });
}

function srsDueCount() {
  const profile = activeProfile();
  return srsDueWords(profile, wordsForGoal(activeGoal(), words)).length;
}

// 把現有 learnedLog 轉成初步 SRS 紀錄（舊資料相容）
function srsMigrateFromLearnedLog(profile) {
  if (!profile.srs) profile.srs = {};
  if (!profile.learnedLog) return;
  Object.entries(profile.learnedLog).forEach(([wordText, learnedDate]) => {
    if (profile.srs[wordText]) return;
    const daysSince = Math.max(
      0,
      Math.floor((Date.parse(todayKey()) - Date.parse(learnedDate)) / 86400000),
    );
    // 已學過的字假設成功背過 1 次，依距今天數估初始 interval
    const initialInterval = Math.min(7, Math.max(1, daysSince || 1));
    profile.srs[wordText] = {
      ease: SRS_DEFAULT_EASE,
      interval: initialInterval,
      reps: 1,
      lapses: 0,
      lastReview: learnedDate,
      nextReview: srsAddDays(learnedDate, initialInterval),
    };
  });
  // 弱點字 → 直接設成今天到期、ease 偏低
  (profile.weak || []).forEach((wordText) => {
    if (!profile.srs[wordText]) {
      profile.srs[wordText] = {
        ease: 1.8,
        interval: 1,
        reps: 0,
        lapses: 1,
        lastReview: null,
        nextReview: todayKey(),
      };
    } else {
      profile.srs[wordText].nextReview = todayKey();
      profile.srs[wordText].ease = Math.min(profile.srs[wordText].ease, 2.0);
    }
  });
}
// ---------- /SRS ----------

const goals = ["生活英文", "會考", "英檢初級", "英檢中級", "學測", "多益", "托福"];
const nativeLanguages = [
  { value: "zh-Hant", label: "繁體中文" },
  { value: "ja", label: "日本語" },
  { value: "ko", label: "한국어" },
  { value: "es", label: "Español" },
];

const goalLabels = {
  "zh-Hant": {
    英檢初級: "英檢初級",
    英檢中級: "英檢中級",
    會考: "會考",
    學測: "學測",
    多益: "多益",
    托福: "托福",
    生活英文: "生活英文",
  },
  en: {
    英檢初級: "GEPT Elementary",
    英檢中級: "GEPT Intermediate",
    會考: "CAP Exam",
    學測: "GSAT",
    多益: "TOEIC",
    托福: "TOEFL",
    生活英文: "Daily English",
  },
  ja: {
    英檢初級: "GEPT 初級",
    英檢中級: "GEPT 中級",
    會考: "台湾高校入試",
    學測: "大学入試",
    多益: "TOEIC",
    托福: "TOEFL",
    生活英文: "日常英語",
  },
  ko: {
    英檢初級: "GEPT 초급",
    英檢中級: "GEPT 중급",
    會考: "대만 고입",
    學測: "대학 입시",
    多益: "TOEIC",
    托福: "TOEFL",
    生活英文: "일상 영어",
  },
  es: {
    英檢初級: "GEPT Inicial",
    英檢中級: "GEPT Intermedio",
    會考: "Examen CAP",
    學測: "GSAT",
    多益: "TOEIC",
    托福: "TOEFL",
    生活英文: "Inglés diario",
  },
};

const levelLabels = {
  "zh-Hant": [
    ["燭火侍從", "初入行會"],
    ["銅環見習騎士", "掌握基礎戰技"],
    ["銀頁誓約者", "能穩定完成委託"],
    ["霜刃巡獵官", "具備前線討伐資格"],
    ["聖紋守城將", "守護城邦的主力"],
    ["龍脊遠征侯", "率隊穿越禁域"],
    ["星冠大賢王", "週榜最高榮銜"],
  ],
  en: [
    ["Candle Squire", "new to the guild"],
    ["Copper-Ring Knight", "basic field craft"],
    ["Silverleaf Oathbound", "steady contract work"],
    ["Frostblade Ranger", "frontline hunt ready"],
    ["Sigil Keep Warden", "city defense rank"],
    ["Dragonspine Margrave", "forbidden-route commander"],
    ["Starcrown High Sage", "top weekly honor"],
  ],
  ja: [
    ["灯火の従者", "ギルド入門"],
    ["銅環の見習騎士", "基礎戦技"],
    ["銀頁の誓約者", "依頼を安定遂行"],
    ["霜刃の巡猟官", "前線討伐資格"],
    ["聖紋の城塞守", "城邦防衛の主力"],
    ["竜脊の遠征侯", "禁域遠征の指揮"],
    ["星冠の大賢王", "週榜最高栄誉"],
  ],
  ko: [
    ["촛불 시종", "길드 입문"],
    ["동환 견습기사", "기초 전투 기술"],
    ["은빛 서약자", "의뢰 안정 수행"],
    ["서리칼날 순찰관", "전선 토벌 자격"],
    ["성문 성채수호장", "도시 방위 주력"],
    ["용등성이 원정후", "금역 원정 지휘"],
    ["별왕관 대현왕", "주간 최고 영예"],
  ],
  es: [
    ["Escudero de Vela", "entrada al gremio"],
    ["Caballero del Aro de Cobre", "oficio básico de campo"],
    ["Juramentado de Hoja Plateada", "contratos estables"],
    ["Montaraz Filoescarcha", "listo para el frente"],
    ["Guardián del Sello", "defensa de la ciudad"],
    ["Margrave de Espinadragón", "mando en tierras vedadas"],
    ["Alto Sabio Coronoestelar", "máximo honor semanal"],
  ],
};

const partOfSpeech = {
  borrow: "verb",
  journey: "noun",
  bright: "adjective",
  protect: "verb",
  support: "verb",
  efficient: "adjective",
  ordinary: "adjective",
  require: "verb",
  analyze: "verb",
  consequence: "noun",
  strategy: "noun",
  evaluate: "verb",
  negotiate: "verb",
  substantial: "adjective",
  priority: "noun",
  interpret: "verb",
  meticulous: "adjective",
  ambiguous: "adjective",
  deteriorate: "verb",
  preliminary: "adjective",
  arrive: "verb",
  choose: "verb",
  simple: "adjective",
  notice: "verb",
  improve: "verb",
  compare: "verb",
  include: "verb",
  recent: "adjective",
  benefit: "noun",
  predict: "verb",
  maintain: "verb",
  evidence: "noun",
  significant: "adjective",
  alternative: "noun",
  sufficient: "adjective",
  complex: "adjective",
  hypothesis: "noun",
  comprehensive: "adjective",
  diminish: "verb",
  inevitable: "adjective",
};

const imageTopics = {
  borrow: "library,book",
  journey: "travel,map",
  bright: "sunlight,room",
  protect: "helmet,safety",
  support: "teamwork,handshake",
  efficient: "technology,workflow",
  ordinary: "morning,coffee",
  require: "checklist,planning",
  analyze: "data,analysis",
  consequence: "domino,choice",
  strategy: "chess,strategy",
  evaluate: "chart,assessment",
  negotiate: "business,meeting",
  substantial: "investment,building",
  priority: "target,focus",
  interpret: "language,translation",
  meticulous: "detail,craft",
  ambiguous: "fog,mystery",
  deteriorate: "decline,broken",
  preliminary: "laboratory,research",
};

const fallbackWords = [
  word("borrow", "/ˈbɑːroʊ/", "借入", 1, ["生活英文", "國中英文"], "📚", "Can I borrow your pencil for a minute?", "Can I ____ your pencil for a minute?", ["借入", "保存", "忘記", "修理"]),
  word("journey", "/ˈdʒɝːni/", "旅程", 1, ["生活英文", "國中英文"], "🧭", "The journey across the island took three days.", "The ____ across the island took three days.", ["旅程", "價格", "規則", "答案"]),
  word("bright", "/braɪt/", "明亮的；聰明的", 1, ["生活英文", "國中英文"], "💡", "The room is bright in the morning.", "The room is ____ in the morning.", ["明亮的；聰明的", "安靜的", "沉重的", "遲到的"]),
  word("protect", "/prəˈtekt/", "保護", 1, ["生活英文", "國中英文"], "🛡️", "A helmet can protect your head.", "A helmet can ____ your head.", ["保護", "邀請", "打開", "比較"]),
  word("support", "/səˈpɔːrt/", "支持", 2, ["生活英文", "高中英文", "TOEIC"], "🤝", "Her friends support her decision.", "Her friends ____ her decision.", ["支持", "逃跑", "發明", "污染"]),
  word("efficient", "/ɪˈfɪʃənt/", "有效率的", 2, ["高中英文", "TOEIC", "商務英文"], "⚙️", "The new system is faster and more efficient.", "The new system is faster and more ____.", ["有效率的", "吵鬧的", "脆弱的", "昂貴的"]),
  word("ordinary", "/ˈɔːrdneri/", "普通的", 2, ["生活英文", "高中英文"], "☕", "It was an ordinary Tuesday morning.", "It was an ____ Tuesday morning.", ["普通的", "危險的", "華麗的", "遙遠的"]),
  word("require", "/rɪˈkwaɪr/", "需要；要求", 2, ["高中英文", "TOEIC", "商務英文"], "📌", "This task will require more time.", "This task will ____ more time.", ["需要；要求", "拒絕", "消失", "慶祝"]),
  word("analyze", "/ˈænəlaɪz/", "分析", 3, ["高中英文", "TOEIC", "全民英檢"], "🔎", "We need to analyze the results carefully.", "We need to ____ the results carefully.", ["分析", "慶祝", "隱藏", "借用"]),
  word("consequence", "/ˈkɑːnsəkwens/", "後果", 3, ["高中英文", "全民英檢"], "⛓️", "Every choice has a consequence.", "Every choice has a ____.", ["後果", "邀請", "證書", "設備"]),
  word("strategy", "/ˈstrætədʒi/", "策略", 3, ["高中英文", "TOEIC", "商務英文"], "♟️", "The team needs a better strategy.", "The team needs a better ____.", ["策略", "天氣", "噪音", "座位"]),
  word("evaluate", "/ɪˈvæljueɪt/", "評估", 3, ["高中英文", "TOEIC", "全民英檢"], "📊", "Teachers evaluate students in different ways.", "Teachers ____ students in different ways.", ["評估", "折疊", "借出", "追趕"]),
  word("negotiate", "/nɪˈɡoʊʃieɪt/", "協商", 4, ["TOEIC", "商務英文"], "📝", "The teams will negotiate a new contract.", "The teams will ____ a new contract.", ["協商", "蒐集", "命令", "拆除"]),
  word("substantial", "/səbˈstænʃl/", "大量的；重大的", 4, ["TOEIC", "全民英檢", "商務英文"], "🏛️", "The plan requires a substantial investment.", "The plan requires a ____ investment.", ["大量的；重大的", "臨時的", "幼稚的", "透明的"]),
  word("priority", "/praɪˈɔːrəti/", "優先事項", 4, ["TOEIC", "商務英文"], "🎯", "Customer safety is our top priority.", "Customer safety is our top ____.", ["優先事項", "錯覺", "裝飾", "藉口"]),
  word("interpret", "/ɪnˈtɝːprət/", "解釋；口譯", 4, ["高中英文", "全民英檢", "商務英文"], "🗣️", "It is hard to interpret the message.", "It is hard to ____ the message.", ["解釋；口譯", "凍結", "擁抱", "測量"]),
  word("meticulous", "/məˈtɪkjələs/", "一絲不苟的", 5, ["TOEIC", "商務英文"], "🧩", "The editor gave the report a meticulous review.", "The editor gave the report a ____ review.", ["一絲不苟的", "粗心的", "短暫的", "空洞的"]),
  word("ambiguous", "/æmˈbɪɡjuəs/", "模稜兩可的", 5, ["高中英文", "全民英檢", "商務英文"], "🌫️", "The instructions were ambiguous and confusing.", "The instructions were ____ and confusing.", ["模稜兩可的", "勇敢的", "飢餓的", "固定的"]),
  word("deteriorate", "/dɪˈtɪriəreɪt/", "惡化", 5, ["全民英檢", "商務英文"], "📉", "The situation may deteriorate without action.", "The situation may ____ without action.", ["惡化", "發光", "捐贈", "適應"]),
  word("preliminary", "/prɪˈlɪməneri/", "初步的", 5, ["TOEIC", "全民英檢", "商務英文"], "🧪", "The preliminary results look promising.", "The ____ results look promising.", ["初步的", "永恆的", "吵雜的", "潮濕的"]),
  word("arrive", "/əˈraɪv/", "抵達", 1, ["國中英文", "生活英文"], "🏰", "We will arrive before sunset.", "We will ____ before sunset.", ["抵達", "購買", "爭論", "修復"]),
  word("choose", "/tʃuːz/", "選擇", 1, ["國中英文", "生活英文"], "🧺", "Choose the answer carefully.", "____ the answer carefully.", ["選擇", "打破", "隱藏", "測量"]),
  word("simple", "/ˈsɪmpl/", "簡單的", 1, ["國中英文", "生活英文"], "🕯️", "This is a simple question.", "This is a ____ question.", ["簡單的", "遙遠的", "潮濕的", "兇猛的"]),
  word("notice", "/ˈnoʊtɪs/", "注意到", 1, ["國中英文", "生活英文"], "👁️", "Did you notice the sign?", "Did you ____ the sign?", ["注意到", "命令", "借出", "融化"]),
  word("improve", "/ɪmˈpruːv/", "改善", 2, ["國中英文", "高中英文"], "🛠️", "Practice can improve your skills.", "Practice can ____ your skills.", ["改善", "偷竊", "關閉", "延遲"]),
  word("compare", "/kəmˈper/", "比較", 2, ["國中英文", "高中英文"], "⚖️", "Compare the two pictures.", "____ the two pictures.", ["比較", "燃燒", "慶祝", "忍受"]),
  word("include", "/ɪnˈkluːd/", "包含", 2, ["高中英文", "TOEIC"], "📦", "The price does not include tax.", "The price does not ____ tax.", ["包含", "折疊", "追逐", "假裝"]),
  word("recent", "/ˈriːsnt/", "最近的", 2, ["高中英文", "TOEIC"], "📜", "Recent studies show the same result.", "____ studies show the same result.", ["最近的", "空的", "粗魯的", "沉默的"]),
  word("benefit", "/ˈbenɪfɪt/", "好處", 3, ["高中英文", "TOEIC"], "🎁", "Exercise has many benefits.", "Exercise has many ____.", ["好處", "裂縫", "謠言", "階梯"]),
  word("predict", "/prɪˈdɪkt/", "預測", 3, ["高中英文", "TOEFL"], "🔮", "Experts predict heavy rain.", "Experts ____ heavy rain.", ["預測", "拒絕", "打磨", "擁抱"]),
  word("maintain", "/meɪnˈteɪn/", "維持", 3, ["高中英文", "TOEIC"], "🏛️", "We must maintain the quality.", "We must ____ the quality.", ["維持", "尖叫", "漂浮", "挖掘"]),
  word("evidence", "/ˈevɪdəns/", "證據", 3, ["高中英文", "TOEFL"], "🔍", "The scientist found strong evidence.", "The scientist found strong ____.", ["證據", "行李", "香味", "折扣"]),
  word("significant", "/sɪɡˈnɪfɪkənt/", "重要的；顯著的", 4, ["高中英文", "TOEIC", "TOEFL"], "⭐", "The change was significant.", "The change was ____.", ["重要的；顯著的", "黏的", "平坦的", "膽小的"]),
  word("alternative", "/ɔːlˈtɝːnətɪv/", "替代方案", 4, ["高中英文", "TOEFL"], "🛤️", "We need an alternative plan.", "We need an ____ plan.", ["替代方案", "噪音", "儀式", "羽毛"]),
  word("sufficient", "/səˈfɪʃnt/", "足夠的", 4, ["高中英文", "TOEIC"], "🥖", "There is sufficient food for everyone.", "There is ____ food for everyone.", ["足夠的", "尖銳的", "古老的", "尷尬的"]),
  word("complex", "/kəmˈpleks/", "複雜的", 4, ["高中英文", "TOEFL"], "🧠", "This is a complex problem.", "This is a ____ problem.", ["複雜的", "明亮的", "柔軟的", "誠實的"]),
  word("hypothesis", "/haɪˈpɑːθəsɪs/", "假設", 5, ["TOEFL"], "🧬", "The experiment tested the hypothesis.", "The experiment tested the ____.", ["假設", "港口", "習俗", "罰款"]),
  word("comprehensive", "/ˌkɑːmprɪˈhensɪv/", "全面的", 5, ["TOEFL", "TOEIC"], "🗺️", "The report gives a comprehensive review.", "The report gives a ____ review.", ["全面的", "潮濕的", "懶惰的", "短暫的"]),
  word("diminish", "/dɪˈmɪnɪʃ/", "減少", 5, ["TOEFL"], "🕯️", "The pain will diminish over time.", "The pain will ____ over time.", ["減少", "爆炸", "裝飾", "批准"]),
  word("inevitable", "/ɪnˈevɪtəbl/", "不可避免的", 5, ["TOEFL"], "⏳", "Change is inevitable.", "Change is ____.", ["不可避免的", "鬆散的", "甜美的", "狹窄的"]),
];

let words = [];
let builtInWordsLoaded = false;
let appBootError = "";

let state = loadState();
let screen = state.user ? "dashboard" : "login";
let selectedGoal = state.activeGoal || state.goal || "";
let screenHistory = [];
let activeQuiz = null;
let studySession = null;
let viewingLibraryId = null; // 查看單字庫頁面：null 表示看全部，有值表示只看那個庫
let cardModalWord = null; // 點擊弱點/查字時開的字卡 modal（null 表示不顯示）
let miniGame = null;
let toast = "";
let celebrate = false;
let quizEffect = null;
let quizFxTimer = null;
let achievementFocus = null;
const cambridgeExampleRequests = new Set();

function word(wordText, phonetic, meaning, level, goal, image, example, cloze, options) {
  return { word: wordText, phonetic, meaning, level, goal: expandGoals(goal), image, example, cloze, options, pos: partOfSpeech[wordText] || "word", library: "built-in" };
}

function expandGoals(goalList) {
  return Array.from(new Set(goalList));
}

function goalLevelCeiling(goal) {
  return GOAL_LEVEL_CEILINGS[goal] || 5;
}

function wordsForGoal(goal = activeGoal(), source = words) {
  const exact = source.filter((item) => item.goal.includes(goal) && item.level <= goalLevelCeiling(goal));
  if (exact.length) return exact;
  return source.filter((item) => item.goal.includes(goal));
}

function defaultScreen() {
  return state.user ? "dashboard" : "login";
}

function navigateTo(next, options = {}) {
  const { pushHistory = true, clearHistory = false } = options;
  if (clearHistory) screenHistory = [];
  if (pushHistory && screen && screen !== next) screenHistory.push(screen);
  screen = next;
}

function goBack() {
  const previous = screenHistory.pop();
  screen = previous || defaultScreen();
  stopActiveQuiz();
  studySession = null;
  miniGame = null;
  toast = "";
  render();
}

function stopActiveQuiz() {
  if (activeQuiz?.timer) clearInterval(activeQuiz.timer);
  activeQuiz = null;
  if (quizFxTimer) clearTimeout(quizFxTimer);
  quizFxTimer = null;
  quizEffect = null;
  celebrate = false;
}

function t(key) {
  return (i18n[state.native || "zh-Hant"] || i18n["zh-Hant"])[key] || key;
}

function msg(key, values = {}) {
  return Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, value), t(key));
}

function goalLabel(goal) {
  return (goalLabels[state.native || "zh-Hant"] || goalLabels["zh-Hant"])[goal] || goal;
}

function levelLabel(level) {
  const labels = levelLabels[state.native || "zh-Hant"] || levelLabels["zh-Hant"];
  const [name, tone] = labels[level.id - 1] || [level.name, level.tone];
  return { name, tone };
}

function currentRankLevel() {
  const tier = Math.max(1, Math.min(levels.length, Number(state.rankTier || 1)));
  return levels[tier - 1] || levels[0];
}

function wordDifficultyLevelId() {
  return Math.max(1, Math.min(5, Number(state.rankTier || 1)));
}

function cardImage(item) {
  if (item.library === "built-in") {
    if (BUILT_IN_CARD_ART.has(item.word)) return `./assets/cards/${item.word}.svg`;
    return builtInFallbackCardImage(item);
  }
  return customCardImage(item);
}

function wordIcon(item) {
  const icon = String(item?.image || "").trim();
  if (icon && icon !== "undefined" && icon !== "null") return icon;
  const posIcons = {
    noun: "◆",
    verb: "▲",
    adjective: "✦",
    adverb: "●",
  };
  return posIcons[item?.pos] || "✧";
}

function builtInFallbackCardImage(item) {
  const label = String(item.word || "").replace(/[&<>"]/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
  }[ch]));
  const meaning = String(item.meaning || item.zh || "").replace(/[&<>"]/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
  }[ch]));
  const bg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#1f2937"/>
          <stop offset="55%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#111827"/>
        </linearGradient>
        <linearGradient id="frame" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#d8b56b"/>
          <stop offset="100%" stop-color="#7c5c18"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="900" rx="56" fill="url(#bg)"/>
      <circle cx="950" cy="170" r="110" fill="#3b82f6" opacity="0.18"/>
      <circle cx="270" cy="720" r="170" fill="#8b5cf6" opacity="0.12"/>
      <rect x="160" y="120" width="880" height="660" rx="42" fill="#f8f1dc" fill-opacity="0.07" stroke="url(#frame)" stroke-width="18"/>
      <path d="M330 540c90-150 200-220 270-220s180 70 270 220" fill="none" stroke="#d8b56b" stroke-width="22" stroke-linecap="round"/>
      <path d="M450 250h300M450 320h210M450 390h260" stroke="#f5d58d" stroke-width="18" stroke-linecap="round" opacity="0.7"/>
      <text x="600" y="610" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="60" fill="#f8f1dc" font-weight="700">${label}</text>
      <text x="600" y="680" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="#d9c7a0">${meaning}</text>
    </svg>
  `);
  return `data:image/svg+xml,${bg}`;
}

function customCardImage(item) {
  const label = String(item.word || "").replace(/[&<>"]/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
  }[ch]));
  const meaning = String(item.meaning || "").replace(/[&<>"]/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
  }[ch]));
  const bg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#17324a"/>
          <stop offset="58%" stop-color="#152536"/>
          <stop offset="100%" stop-color="#4c2f1e"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="900" rx="56" fill="url(#bg)"/>
      <path d="M120 720c220-150 420-150 640 0s300 120 440 20v160H0V760z" fill="#6b4b2a" opacity="0.72"/>
      <rect x="230" y="150" width="740" height="560" rx="38" fill="#fff6df" fill-opacity="0.1" stroke="#e7b64b" stroke-width="16"/>
      <path d="M380 310h440M380 410h320M380 510h390" stroke="#f6d58d" stroke-width="26" stroke-linecap="round" opacity="0.82"/>
      <circle cx="910" cy="190" r="76" fill="#e7b64b"/>
      <text x="600" y="640" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="58" fill="#fff6df" font-weight="700">${label}</text>
      <text x="600" y="700" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="#d9c7a0">${meaning}</text>
    </svg>
  `);
  return `data:image/svg+xml,${bg}`;
}

// 單字難度（1–5）：內建字已依官方分級整理（scripts/apply-official-levels.py），直接用 level
function getWordTier(item) {
  return clamp(Math.round(Number(item?.level) || 1), 1, 5);
}

function getPlayerRank() {
  let rank = 1;
  let remaining = state.xp || 0;
  while (remaining >= xpNeededForRank(rank)) {
    remaining -= xpNeededForRank(rank);
    rank += 1;
  }
  return rank;
}

function xpProgress() {
  const progress = xpIntoCurrentRank();
  const need = xpNeededForRank(getPlayerRank());
  return Math.min(100, Math.round((progress / need) * 100));
}

function xpIntoCurrentRank() {
  let remaining = state.xp || 0;
  let rank = 1;
  while (remaining >= xpNeededForRank(rank)) {
    remaining -= xpNeededForRank(rank);
    rank += 1;
  }
  return remaining;
}

function xpNeededForRank(rank) {
  return 100 + (rank - 1) * 60 + Math.floor((rank - 1) * (rank - 1) * 12);
}

function milestoneLevelBetween(before, after) {
  for (let level = after; level > before; level -= 1) {
    if (level % 5 === 0) return level;
  }
  return null;
}

function canBattlePendingLevelUp() {
  const pending = state.pendingLevelUp;
  return !!(pending?.monster && (pending.monsterLevel || pending.to) % 5 === 0);
}

function addXp(amount) {
  const before = getPlayerRank();
  state.xp = (state.xp || 0) + amount;
  state.xpLog = state.xpLog || {};
  const today = todayKey();
  state.xpLog[today] = (state.xpLog[today] || 0) + amount;
  const after = getPlayerRank();
  if (after > before) {
    const monsterLevel = milestoneLevelBetween(before, after);
    if (monsterLevel) {
      state.pendingLevelUp = {
        from: before,
        to: after,
        loot: levelLoot(monsterLevel),
        monster: createMonster(monsterLevel),
        monsterLevel,
      };
    } else if (!state.pendingLevelUp) {
      state.pendingLevelUp = { from: before, to: after, loot: levelLoot(after), monster: null, monsterLevel: null };
    }
    state.achievements.firstLevelUp = true;
    state.achievements.levelUps += 1;
  }
}

function playerDisplayName() {
  return state.user?.name || t("traveler");
}

function customLibraryLimit(goal = activeGoal()) {
  return CUSTOM_LIBRARY_LIMITS[goal] || DEFAULT_CUSTOM_LIBRARY_LIMIT;
}

// 每次開排行榜都跑：把對手分數往玩家附近拉，並加上隨機浮動讓排名會洗牌

function recentDates(days) {
  return Array.from({ length: days }, (_, index) => {
    const d = new Date(todayKey() + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() - index);
    return d.toISOString().slice(0, 10);
  });
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function levelLoot(level) {
  const ids = battleItems().map((item) => item.id);
  const typeCount = 1 + Math.floor(Math.random() * Math.min(3, ids.length));
  const selected = shuffle(ids).slice(0, typeCount);
  return selected.reduce((loot, id) => {
    const base = id === "bomb" ? 1 : 1 + Math.floor(Math.random() * 2);
    loot[id] = base + (level % 5 === 0 && Math.random() < 0.35 ? 1 : 0);
    return loot;
  }, {});
}

function addInventory(items) {
  Object.entries(items).forEach(([key, amount]) => {
    state.inventory[key] = (state.inventory[key] || 0) + amount;
  });
}

function monsterRoster() {
  return [
    { id: "slime", name: "月露凝魔", icon: "○", hp: 70, attack: 18, color: "#58b8a8", accent: "#d7f3e8", trait: "會吸附魔力，生命較低但很靈活。", shape: "orb" },
    { id: "golem", name: "白塔石衛", icon: "▣", hp: 120, attack: 24, color: "#9b9488", accent: "#f1ead8", trait: "裝甲厚重，生命值偏高。", shape: "golem" },
    { id: "wraith", name: "霜紗幽影", icon: "☾", hp: 96, attack: 30, color: "#788aa0", accent: "#e5eef7", trait: "攻擊銳利，適合先用道具壓低生命。", shape: "wraith" },
    { id: "dragon", name: "赤焰幼龍", icon: "△", hp: 160, attack: 36, color: "#c45a43", accent: "#ffd7b1", trait: "高生命高攻擊，是危險的段位試煉。", shape: "dragon" },
    { id: "mimic", name: "貪婪寶箱", icon: "□", hp: 88, attack: 28, color: "#b98244", accent: "#ffe0a3", trait: "生命不高，但反擊速度很快。", shape: "mimic" },
    { id: "knight", name: "失落騎士", icon: "♞", hp: 140, attack: 32, color: "#4f6875", accent: "#dbe8ed", trait: "攻守均衡，拖久會很危險。", shape: "knight" },
    { id: "serpent", name: "深林毒蛇", icon: "◇", hp: 104, attack: 38, color: "#5c8b56", accent: "#dff0c8", trait: "攻擊力很高，答錯代價重。", shape: "serpent" },
    { id: "phoenix", name: "餘燼鳳凰", icon: "▲", hp: 132, attack: 34, color: "#d98245", accent: "#ffe4c2", trait: "火焰反擊強，建議帶治療藥水。", shape: "phoenix" },
    { id: "moth", name: "銀翼書蛾", icon: "✦", hp: 82, attack: 26, color: "#b8bfd9", accent: "#f6f2ff", trait: "閃避感強，但承受不了重擊。", shape: "moth" },
    { id: "stag", name: "青角鹿靈", icon: "♢", hp: 118, attack: 29, color: "#3d8c7a", accent: "#d8f2de", trait: "生命穩定，會用角衝撞反擊。", shape: "stag" },
    { id: "lantern", name: "迷霧燈靈", icon: "✧", hp: 92, attack: 31, color: "#6b80b8", accent: "#fff2bf", trait: "會干擾視線，攻擊節奏不穩。", shape: "lantern" },
    { id: "mandrake", name: "哭泣蔓根", icon: "♧", hp: 110, attack: 27, color: "#7fa35a", accent: "#f2d9c4", trait: "耐打且會纏住冒險者。", shape: "mandrake" },
  ];
}

function createMonster(level, monsterId = "") {
  const monsters = monsterRoster();
  const base = monsters.find((monster) => monster.id === monsterId)
    || monsters[(Math.max(0, Math.floor(level / 5) - 1) + Math.floor(Math.random() * monsters.length)) % monsters.length];
  return { ...base, hp: base.hp + level * 6, maxHp: base.hp + level * 6, level };
}

function allWords() {
  return [...words, ...state.customLibraries.flatMap((library) => library.words || [])];
}

function orderedGoals(list) {
  const set = new Set((list || []).filter((goal) => goals.includes(goal)));
  return goals.filter((goal) => set.has(goal));
}

function orderedUserGoals() {
  return orderedGoals(state.userGoals || []);
}

function unselectedGoals() {
  const selected = new Set(orderedUserGoals());
  return goals.filter((goal) => !selected.has(goal));
}

function hasSelectedGoal() {
  return orderedUserGoals().length > 0 && goals.includes(activeGoal());
}

function activeGoal() {
  const userGoals = orderedUserGoals();
  if (state.activeGoal && userGoals.includes(state.activeGoal)) return state.activeGoal;
  return userGoals[0] || "";
}

// 萬能管理員模式只在本機開放（localhost / 127.0.0.1 / 直接開檔案），GitHub Pages 上永遠看不到
function isLocalHost() {
  return location.protocol === "file:" || ["localhost", "127.0.0.1", "::1", "[::1]"].includes(location.hostname);
}

function canUseAdmin() {
  return !!state.user && isLocalHost();
}

function activeProfile() {
  if (!activeGoal()) return ensureProfile("__unselected__");
  return ensureProfile(activeGoal());
}

function ensureProfile(goal) {
  if (!state.goalProfiles) state.goalProfiles = {};
  if (typeof state.dayOffset !== "number") state.dayOffset = 0;
  if (!state.goalProfiles[goal]) {
    state.goalProfiles[goal] = {
      placement: null,
      learned: [],
      learnedLog: {},
      weak: [],
      weakHits: {},
      dailyTests: {},
      srs: {},
    };
  }
  if (!state.goalProfiles[goal].weakHits) state.goalProfiles[goal].weakHits = {};
  if (!state.goalProfiles[goal].srs) state.goalProfiles[goal].srs = {};
  return state.goalProfiles[goal];
}

function currentWeekKey(dateKey = todayKey()) {
  const date = new Date(`${dateKey}T00:00:00Z`);
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() - day + 1);
  return date.toISOString().slice(0, 10);
}

function nextWeekKey(dateKey = todayKey()) {
  const date = new Date(`${currentWeekKey(dateKey)}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 7);
  return date.toISOString().slice(0, 10);
}

function backButtonLabel() {
  const previous = screenHistory[screenHistory.length - 1];
  return previous === "dashboard" ? t("backMap") : t("backPrevious");
}

function migrateState() {
  // en 已從介面移除 → 既有設定為 en 的使用者改回 zh-Hant
  if (state.native === "en") state.native = "zh-Hant";
  const legacyGoals = Array.isArray(state.userGoals)
    ? state.userGoals
    : [state.activeGoal || state.goal].filter(Boolean);
  state.userGoals = orderedGoals(legacyGoals);
  if (!state.userGoals.length) {
    state.activeGoal = "";
    state.goal = "";
  } else if (!state.activeGoal || !state.userGoals.includes(state.activeGoal)) {
    state.activeGoal = state.userGoals[0];
    state.goal = state.activeGoal;
  }
  const profile = state.activeGoal ? ensureProfile(state.activeGoal) : null;
  if (profile) {
    if (state.placement && !profile.placement) profile.placement = state.placement;
    if (state.learned?.length && !profile.learned.length) profile.learned = state.learned;
    if (state.learnedLog && !Object.keys(profile.learnedLog).length) profile.learnedLog = state.learnedLog;
    if (state.weak?.length && !profile.weak.length) profile.weak = state.weak;
    if (state.weakHits && !Object.keys(profile.weakHits || {}).length) profile.weakHits = state.weakHits;
    if (state.dailyTests && !Object.keys(profile.dailyTests).length) profile.dailyTests = state.dailyTests;
  }
  if (!state.xpLog) state.xpLog = {};
  if (typeof state.rankTier !== "number") state.rankTier = 1;
  if (!state.studyHistory) state.studyHistory = {};
  if (!state.dailyStudy) state.dailyStudy = {};
  if (!state.dailyStudyCompleted) state.dailyStudyCompleted = {};
  if (!state.completedAchievements) state.completedAchievements = [];
  if (!state.equippedTitle) state.equippedTitle = "";
  // 舊版的排行榜對手與打怪榜稱號已移除
  delete state.rivals;
  delete state.rankingWeekKey;
  delete state.weeklyXpLog;
  delete state.pendingBattleTitle;
  delete state.limitedBattleTitle;
  // SRS 相容遷移：所有 profile 都跑一次
  Object.entries(state.goalProfiles).forEach(([goal, p]) => {
    if (goal === "__unselected__") return;
    if (!p.srs) p.srs = {};
    srsMigrateFromLearnedLog(p);
  });
}

function activeWords() {
  return studySourceForLibrary(currentStudyLibraryId());
}

function currentStudyLibraryId() {
  if (!state.activeLibraryId || state.activeLibraryId === "built-in") return null;
  const library = (state.customLibraries || []).find((item) => item.id === state.activeLibraryId);
  return library?.words?.length ? state.activeLibraryId : null;
}

function studySourceForLibrary(libraryId = currentStudyLibraryId()) {
  if (libraryId) {
    const library = (state.customLibraries || []).find((item) => item.id === libraryId);
    return library?.words?.length ? library.words : [];
  }
  return wordsForGoal(activeGoal(), words);
}

function activeLibraryLabel() {
  const libraryId = currentStudyLibraryId();
  if (!libraryId) return goalLabel(activeGoal());
  const library = (state.customLibraries || []).find((item) => item.id === libraryId);
  return library?.name || t("customLibrary");
}

function loadState() {
  const fallback = {
    user: null,
    native: "zh-Hant",
    goal: "",
    activeGoal: "",
    userGoals: [],
    goalProfiles: {},
    dayOffset: 0,
    studyHistory: {},
    dailyStudy: {},
    dailyStudyCompleted: {},
    placement: null,
    learned: [],
    learnedLog: {},
    weak: [],
    weakHits: {},
    streak: 0,
    dailyTests: {},
    xp: 0,
    xpLog: {},
    rankTier: 1,
    pendingLevelUp: null,
    lastLoginDate: null,
    streakDays: 0,
    streakReward: null,
    streakRewardKey: null,
    rewardNotice: null,
    customLibraries: [],
    activeLibraryId: "built-in",
    inventory: {},
    equippedTitle: "",
    completedAchievements: [],
    battle: null,
    achievements: {
      totalCorrect: 0,
      currentCombo: 0,
      bestCombo: 0,
      totalLoginDays: 0,
      firstLevelUp: false,
      levelUps: 0,
      monstersDefeated: 0,
      importedLibraries: 0,
      grandReviews: 0,
    },
  };
  // 新版多帳號 store：{ activeUserId, users: { [id]: state } }
  const STORE_KEY = "vocab-arcana-store";
  let store = {};
  try {
    store = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
  } catch {
    store = {};
  }
  if (!store || typeof store !== "object") store = {};
  if (!store.users || typeof store.users !== "object") store.users = {};
  // 嘗試遷移舊版單一 state（vocab-arcana-progress）
  try {
    const legacyRaw = localStorage.getItem(STORAGE_KEY);
    if (legacyRaw && !Object.keys(store.users).length) {
      const legacy = JSON.parse(legacyRaw);
      if (legacy && legacy.user) {
        const id = userKeyFor(legacy.user);
        store.users[id] = legacy;
        store.activeUserId = id;
        localStorage.setItem(STORE_KEY, JSON.stringify(store));
      }
    }
  } catch {}
  // 載入當前活躍使用者的 state
  if (store.activeUserId && store.users[store.activeUserId]) {
    return { ...fallback, ...store.users[store.activeUserId] };
  }
  return fallback;
}

// saveState 改為 debounce 寫入：高頻呼叫只會在停下來 250ms 後真正 stringify + 寫盤一次，
// 避免 store 變大後每答一題都全量序列化卡 UI。頁面隱藏 / 關閉前會強制 flush。
let saveStateTimer = null;
let saveStateWarned = false;

function saveState() {
  if (saveStateTimer) clearTimeout(saveStateTimer);
  saveStateTimer = setTimeout(saveStateNow, 250);
}

function saveStateNow() {
  if (saveStateTimer) {
    clearTimeout(saveStateTimer);
    saveStateTimer = null;
  }
  const STORE_KEY = "vocab-arcana-store";
  let store = {};
  try {
    store = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
  } catch {
    store = {};
  }
  if (!store.users || typeof store.users !== "object") store.users = {};
  const id = userKeyFor(state.user);
  if (id) {
    store.activeUserId = id;
    store.users[id] = state;
  } else {
    store.activeUserId = null;
  }
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch (error) {
    warnSaveFailed(error);
  }
}

// 儲存失敗（多半是 localStorage quota 滿）不再靜默：console 記錄 + 顯示一次性警告橫幅
function warnSaveFailed(error) {
  console.error("[saveState] failed to persist progress:", error);
  if (saveStateWarned) return;
  saveStateWarned = true;
  try {
    const note = document.createElement("div");
    note.className = "save-warning";
    note.setAttribute("role", "alert");
    note.textContent = t("saveFailed");
    document.body.appendChild(note);
    setTimeout(() => note.remove(), 10000);
  } catch {}
}

window.addEventListener("beforeunload", () => {
  if (saveStateTimer) saveStateNow();
});
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden" && saveStateTimer) saveStateNow();
});

// ===== 主題（日間 / 夜間）=====
// 主題是全瀏覽器共用設定（登入頁也要生效），所以獨立存一個 key，不放進 state。
const THEME_KEY = "vocab-arcana-theme";

function currentTheme() {
  try {
    return localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function applyTheme() {
  document.body.classList.toggle("theme-dark", currentTheme() === "dark");
}

function toggleTheme() {
  try {
    localStorage.setItem(THEME_KEY, currentTheme() === "dark" ? "light" : "dark");
  } catch {}
  applyTheme();
  render();
}

// ===== 匯出 / 匯入進度（JSON 存檔）=====
function exportProgressFile() {
  saveStateNow(); // 先 flush 未寫入的 debounce 存檔
  let raw = "";
  try {
    raw = localStorage.getItem("vocab-arcana-store") || "";
  } catch {}
  if (!raw) raw = JSON.stringify({ activeUserId: null, users: {} });
  const stamp = todayKey().replaceAll("-", "");
  const blob = new Blob([raw], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `vocab-arcana-save-${stamp}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  toast = t("exportDone");
  render();
}

function importProgressFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    let parsed = null;
    try {
      parsed = JSON.parse(String(reader.result || ""));
    } catch {}
    // 最低限度驗證：必須是有 users 物件的 store 結構
    if (!parsed || typeof parsed !== "object" || !parsed.users || typeof parsed.users !== "object") {
      toast = t("importProgressInvalid");
      render();
      return;
    }
    if (!confirm(t("confirmImportProgress"))) return;
    try {
      localStorage.setItem("vocab-arcana-store", JSON.stringify(parsed));
    } catch (error) {
      warnSaveFailed(error);
      return;
    }
    // 重新載入讓 loadState 走一次完整流程（含 migrate）
    location.reload();
  };
  reader.readAsText(file);
}

// 從 user 物件算出穩定的 user id（mock 模式用 name 為 key）
function userKeyFor(user) {
  if (!user) return null;
  if (user.id) return `id::${user.id}`;
  if (user.email) return `email::${String(user.email).toLowerCase()}`;
  if (user.name) return `name::${String(user.name).trim().toLowerCase()}`;
  return null;
}

// 切換到指定帳號：若該帳號已有 state 就載入；否則全新開始
function switchUserAccount(user) {
  // 先把當前帳號的狀態存進 store
  if (state.user) saveState();
  const STORE_KEY = "vocab-arcana-store";
  let store = {};
  try { store = JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); } catch {}
  if (!store.users || typeof store.users !== "object") store.users = {};
  const newUser = {
    id: user.id,
    provider: user.provider || "local",
    name: user.name || user.email || t("traveler"),
    email: user.email || "",
    picture: user.picture || "",
    isAdmin: user.isAdmin === true,
  };
  const targetId = userKeyFor(newUser);
  if (targetId && store.users[targetId]) {
    // 既有帳號 → 把 state 整個換成該帳號的版本
    const fresh = freshState();
    state = { ...fresh, ...store.users[targetId] };
    // 確保有 user 欄位（有些舊資料可能沒記 user）
    state.user = { ...(state.user || {}), ...newUser };
  } else {
    // 全新帳號 → 從預設開始
    state = freshState();
    state.user = newUser;
    state.userGoals = [];
    state.activeGoal = "";
    state.goal = "";
  }
  // 更新 store 的 activeUserId
  if (targetId) {
    store.activeUserId = targetId;
    if (!store.users[targetId]) store.users[targetId] = state;
    try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch {}
  }
  migrateState();
  applyLoginReward();
  saveState();
  if (state.activeGoal) ensureProfile(state.activeGoal);
  navigateTo("dashboard", { clearHistory: true, pushHistory: false });
  stopActiveQuiz();
  studySession = null;
}

function switchLocalTestAccount(name) {
  if (!runtimeConfig.localTestLoginEnabled) return;
  switchUserAccount({
    id: `local:${String(name || t("traveler")).trim().toLowerCase()}`,
    provider: "local-test",
    name: name || t("traveler"),
    isAdmin: false,
  });
}

// 預設空白 state（供 switchUserAccount 重置用）
function freshState() {
  return {
    user: null,
    native: state?.native || "zh-Hant",
    goal: "",
    activeGoal: "",
    userGoals: [],
    goalProfiles: {},
    dayOffset: 0,
    studyHistory: {},
    dailyStudy: {},
    dailyStudyCompleted: {},
    placement: null,
    learned: [],
    learnedLog: {},
    weak: [],
    streak: 0,
    dailyTests: {},
    xp: 0,
    xpLog: {},
    rankTier: 1,
    pendingLevelUp: null,
    lastLoginDate: null,
    streakDays: 0,
    streakReward: null,
    streakRewardKey: null,
    customLibraries: [],
    activeLibraryId: "built-in",
    inventory: {},
    battle: null,
    completedAchievements: [],
    equippedTitle: "",
    achievements: {
      totalCorrect: 0,
      currentCombo: 0,
      bestCombo: 0,
      totalLoginDays: 0,
      firstLevelUp: false,
      levelUps: 0,
      monstersDefeated: 0,
      importedLibraries: 0,
      grandReviews: 0,
    },
  };
}

function appShell(content) {
  return `
    <div class="shell">
      <header class="topbar">
        <div class="brand">
          <span class="mark" aria-hidden="true">Aa</span>
          <div>
            <h1>Vocab Arcana</h1>
            <p>${t("subtitle")}</p>
          </div>
        </div>
        <div class="controls">
          <label class="select-wrap">
            <span class="sr-only">${t("native")}</span>
            <select class="select" data-action="native">
              ${nativeLanguages.map((lang) => `<option value="${lang.value}" ${state.native === lang.value ? "selected" : ""}>${lang.label}</option>`).join("")}
            </select>
          </label>
          ${canUseAdmin() ? `<button class="btn ghost small" data-action="admin">${t("admin")}</button>` : ""}
          ${state.user ? `<button class="btn ghost small" data-action="signout">${t("signout")}</button>` : ""}
        </div>
      </header>
      ${state.rewardNotice ? `
        <section class="reward-modal" role="dialog" aria-modal="true" aria-label="${t("itemRewardTitle")}">
          <div class="reward-backdrop" data-action="dismiss-reward"></div>
          <div class="reward-dialog">
            <span class="eyebrow">${t("itemRewardTitle")}</span>
            <strong>${escapeHtml(state.rewardNotice.items)}</strong>
            <div class="actions">
              <button class="btn" data-action="dismiss-reward">${t("claimReward")}</button>
            </div>
          </div>
        </section>
      ` : ""}
      <div class="screen-area">
        ${content}
      </div>
    </div>
  `;
}

function render() {
  if (!builtInWordsLoaded) {
    const app = document.querySelector("#app");
    if (app) {
      app.innerHTML = appShell(`
        <section class="panel">
          <div class="eyebrow">${t("dashboard")}</div>
          <h2 class="page-title">${t("subtitle")}</h2>
          <p class="hero-copy">${appBootError || "Loading built-in vocabulary..."}</p>
        </section>
      `);
    }
    return;
  }
  if (activeQuiz?.timer) clearInterval(activeQuiz.timer);
  if (screen !== "minigame" && miniGame?.timer) {
    clearInterval(miniGame.timer);
    miniGame.timer = null;
  }
  if (state.user && !hasSelectedGoal() && screen !== "dashboard" && screen !== "login") {
    screen = "dashboard";
    stopActiveQuiz();
    studySession = null;
    }
  const app = document.querySelector("#app");
  if (screen === "login") app.innerHTML = renderLogin();
  if (["placement", "result", "monster-preview", "minigame"].includes(screen)) screen = "dashboard";
  if (screen === "daily") app.innerHTML = renderQuiz("daily");
  if (screen === "weekly") app.innerHTML = renderQuiz("weekly");
  if (screen === "review") app.innerHTML = renderQuiz("review");
  if (screen === "quiz-summary") app.innerHTML = renderQuizSummary();
  if (screen === "dashboard") app.innerHTML = renderDashboard();
  if (screen === "custom-study-select") app.innerHTML = renderCustomStudySelect();
  if (screen === "custom-library-view") app.innerHTML = renderCustomLibraryView();
  if (screen === "study") app.innerHTML = renderStudy();
  if (screen === "weak") app.innerHTML = renderWeak();
  if (screen === "learned-words") app.innerHTML = renderLearnedWords();
  if (screen === "inventory") app.innerHTML = renderInventory();
  if (screen === "import") app.innerHTML = renderImport();
  if (screen === "achievements") app.innerHTML = renderAchievements();
  if (screen === "ranking") screen = "progress";
  if (screen === "progress") app.innerHTML = renderProgress();
  if (screen === "admin") app.innerHTML = renderAdmin();
  bindActions();
}

async function loadBuiltInWords() {
  try {
    const response = await fetch("./data/built-in-words.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data) || !data.length) throw new Error("empty built-in word list");
    return data;
  } catch (error) {
    appBootError = `Built-in vocabulary fallback loaded. (${error?.message || error})`;
    return fallbackWords;
  }
}

// 字卡補充資料：音標、例句、例句中文（data/word-details.json，以單字為 key）
// GitHub Pages 沒有查字典的伺服器，內建字的例句與音標都靠這份檔案。
async function loadWordDetails() {
  try {
    const response = await fetch("./data/word-details.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data && typeof data === "object" ? data : {};
  } catch {
    return {};
  }
}

function clozeFromExample(example, wordText) {
  const pattern = new RegExp(`(?<![A-Za-z])${escapeRegExp(wordText)}(?![A-Za-z])`, "i");
  return pattern.test(example) ? example.replace(pattern, "____") : "";
}

function applyWordDetails(list, details) {
  list.forEach((item) => {
    const detail = details[item.word];
    if (!detail) return;
    if (detail.p && !isUsablePhonetic(item.phonetic)) item.phonetic = detail.p;
    if (detail.e) {
      item.example = detail.e;
      item.exampleZh = detail.z || "";
      item.exampleZhFor = detail.e.slice(0, 60);
      item.cloze = clozeFromExample(detail.e, item.word);
    }
  });
}

async function loadRuntimeConfig() {
  const normalizeConfig = (config) => ({
    googleClientId: String(config.googleClientId || ""),
    adminEmails: Array.isArray(config.adminEmails)
      ? config.adminEmails.map((email) => String(email).toLowerCase())
      : [],
    localTestLoginEnabled: config.localTestLoginEnabled === true,
    staticGoogleLogin: config.staticGoogleLogin === true,
  });
  try {
    const response = await fetch("./api/config", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    runtimeConfig = normalizeConfig(await response.json());
  } catch {
    try {
      const response = await fetch("./data/runtime-config.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      runtimeConfig = normalizeConfig(await response.json());
    } catch {
      runtimeConfig = {
        googleClientId: "",
        adminEmails: [],
        localTestLoginEnabled: false,
        staticGoogleLogin: false,
      };
    }
  }
}

// PWA：註冊 service worker（file:// 或不支援的環境自動略過）
function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (!/^https?:$/.test(location.protocol)) return;
  // 新版 service worker 接手時自動重新整理一次，改版推上去後不必叫學生手動重整。
  // 只在首頁或登入頁才重整，避免測驗做到一半被打斷；第一次安裝（原本沒有 controller）不重整。
  const hadController = !!navigator.serviceWorker.controller;
  let reloadingForUpdate = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadController || reloadingForUpdate) return;
    if (screen !== "dashboard" && screen !== "login") return;
    reloadingForUpdate = true;
    saveStateNow();
    location.reload();
  });
  navigator.serviceWorker.register("./sw.js").catch((error) => {
    console.warn("[sw] register failed:", error);
  });
}

async function bootstrap() {
  applyTheme();
  registerServiceWorker();
  await loadRuntimeConfig();
  const [builtIn, details] = await Promise.all([loadBuiltInWords(), loadWordDetails()]);
  words = builtIn;
  applyWordDetails(words, details);
  migrateState();
  builtInWordsLoaded = true;
  if (state.user) {
    applyLoginReward();
    saveState();
  }
  render();
}

function renderLogin() {
  return appShell(`
    <section class="login">
      <div class="panel login-intro">
        <h2 class="login-word"><span class="marker">vocabulary</span></h2>
        <p class="login-phonetic">/vəˈkæbjəˌleri/ <span class="tag">noun</span></p>
        <p class="login-meaning">${t("loginLead")}</p>
        <p class="hero-copy">${t("introCopy")}</p>
      </div>
      <aside class="panel login-side">
        <ol class="login-steps">
          <li>${t("loginStep1")}</li>
          <li>${t("loginStep2")}</li>
          <li>${t("loginStep3")}</li>
        </ol>
        <p class="muted">${t("loginStepNote")}</p>
        <div class="login-actions">
          <button class="btn login-start" data-action="guest-start">${t("guestStart")}</button>
          <p class="muted">${t("googleOptional")}</p>
          <div id="googleSignInButton" class="google-signin-slot"></div>
          ${isLocalHost() ? `
            <button class="btn" data-action="admin-login">${t("adminLogin")}</button>
            <p class="muted">${t("adminLoginNote")}</p>
          ` : ""}
          ${runtimeConfig.localTestLoginEnabled ? `
            <div class="field">
              <label for="nameInput">${t("loginNameHint")}</label>
              <input class="input" id="nameInput" value="${t("traveler")}" />
            </div>
            <button class="btn secondary" data-action="local-test-login">${t("mock")}</button>
          ` : ""}
        </div>
      </aside>
    </section>
  `);
}

function mountGoogleSignInButton() {
  const slot = document.querySelector("#googleSignInButton");
  if (!slot) return;
  if (!runtimeConfig.googleClientId) {
    slot.innerHTML = `<button class="btn" type="button" disabled>${t("google")}</button>`;
    return;
  }
  if (!window.google?.accounts?.id) {
    window.setTimeout(mountGoogleSignInButton, 250);
    return;
  }
  window.google.accounts.id.initialize({
    client_id: runtimeConfig.googleClientId,
    callback: handleGoogleCredential,
    auto_select: false,
  });
  window.google.accounts.id.renderButton(slot, {
    theme: "filled_black",
    size: "large",
    text: "continue_with",
    shape: "pill",
    width: 260,
  });
}

async function handleGoogleCredential(response) {
  try {
    if (runtimeConfig.staticGoogleLogin) {
      const user = parseGoogleCredential(response?.credential || "");
      switchUserAccount(user);
      render();
      return;
    }
    const authResponse = await fetch("./api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: response?.credential || "" }),
    });
    const payload = await authResponse.json();
    if (!authResponse.ok || !payload.user) throw new Error(payload.error || "Google login failed");
    switchUserAccount(payload.user);
    render();
  } catch (error) {
    toast = error?.message || "Google login failed";
    render();
  }
}

function parseGoogleCredential(credential) {
  if (!credential || typeof credential !== "string") throw new Error("Google login failed");
  const parts = credential.split(".");
  if (parts.length < 2) throw new Error("Google login failed");
  const payload = JSON.parse(decodeBase64Url(parts[1]));
  if (payload.aud !== runtimeConfig.googleClientId) throw new Error("Google login client mismatch");
  if (payload.email_verified !== true && payload.email_verified !== "true") throw new Error("Google email is not verified");
  const email = String(payload.email || "").toLowerCase();
  if (!email) throw new Error("Google account has no email");
  return {
    id: `google:${payload.sub}`,
    provider: "google",
    name: payload.name || email,
    email,
    picture: payload.picture || "",
    isAdmin: runtimeConfig.adminEmails.includes(email),
  };
}

function decodeBase64Url(value) {
  const base64 = String(value).replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function renderGoalGate() {
  return appShell(`
    <section class="panel goal-required">
      <div class="eyebrow">${t("goal")}</div>
      <h2 class="page-title">${t("selectGoalRequired")}</h2>
      <p class="hero-copy">${t("selectGoalNotice")}</p>
      <div class="goal-switch goal-required-options">
        ${goals.map((goal) => `<button class="chip add" data-add-goal="${goal}">${goalLabel(goal)}</button>`).join("")}
      </div>
    </section>
  `);
}

function renderQuiz(kind) {
  if (!activeQuiz || activeQuiz.kind !== kind) activeQuiz = createQuiz(kind);
  if (!activeQuiz.questions.length) {
    stopActiveQuiz();
    return appShell(`
      <section class="panel">
        <h2 class="page-title">${kind === "review" ? t("reviewTitle") : kind === "weekly" ? t("weeklyTitle") : t("daily")}</h2>
        <p class="hero-copy">${t("noQuizWords")}</p>
        <div class="actions"><button class="btn secondary" data-action="back">${backButtonLabel()}</button></div>
      </section>
    `);
  }
  const current = activeQuiz.questions[activeQuiz.index] || activeQuiz.questions[0];
  const remaining = getQuizRemainingSeconds();
  activeQuiz.timer = setInterval(updateQuizTimer, 1000);
  const isCloze = current.type === "cloze";
  const isListen = current.type === "listen";
  const questionText = isListen ? t("listenPrompt") : isCloze ? clozePrompt(current) : current.word;
  if (isListen) scheduleListenAutoplay(current.word, kind, activeQuiz.index);
  const title =
    kind === "daily" ? t("daily")
    : kind === "weekly" ? t("weeklyTitle")
    : t("placementTitle");
  const helper =
    kind === "review" ? t("reviewHelper")
    : kind === "daily" ? t("dailyHelper")
    : kind === "weekly" ? t("weeklyHelper")
    : t("placementHelper");
  const heading = kind === "review" ? t("reviewTitle") : title;

  return appShell(`
    <section class="panel quiz-wrap">
      <div class="quiz-head">
        <div>
          <span class="eyebrow">${msg("questionProgress", { current: activeQuiz.index + 1, total: activeQuiz.questions.length })}</span>
          <h2 class="page-title">${heading}</h2>
          ${kind === "daily" ? "" : `<p class="muted">${helper}</p>`}
        </div>
        <div class="timer lcd" id="timer" aria-label="timer">${formatTime(remaining)}</div>
      </div>
      ${kind === "placement" ? `
        <div class="goal-switch">
          <span>${t("activeGoal")}</span>
          ${orderedUserGoals().map((goal) => `<button class="chip ${activeGoal() === goal ? "active" : ""}" data-active-goal="${goal}">${goalLabel(goal)}</button>`).join("")}
        </div>
      ` : ""}
      ${activeQuiz.battle ? renderQuizBattle(activeQuiz.battle) : ""}
      <div class="meter"><span style="width:${(activeQuiz.index / activeQuiz.questions.length) * 100}%"></span></div>
      <div class="question">
        <div>
          <div class="${isCloze || isListen ? "sentence" : "word"}">${escapeHtml(questionText)}</div>
          <div class="phonetic">${isListen
            ? `<button class="btn secondary" data-action="speak-word" data-word="${escapeHtml(current.word)}">${speakerIcon()} ${t("replayAudio")}</button>`
            : isCloze ? t("clozeHint") : escapeHtml(current.phonetic || "")}</div>
        </div>
      </div>
      <div class="answers ${current.type === "meaning" ? "answers-zh" : "answers-en"}">
        ${current.choices.map((option) => `<button class="answer" data-quiz-answer="${escapeHtml(option)}" data-correct="${escapeHtml(current.correct)}">${escapeHtml(option)}</button>`).join("")}
      </div>
      ${toast ? `<div class="toast">${toast}</div>` : ""}
      ${quizEffect ? `<div class="quiz-effect ${quizEffect}" aria-live="polite">${quizEffect === "good" ? t("correctFx") : t("wrongFx")}</div>` : ""}
      <div class="actions quiz-foot">
        <button class="btn secondary" data-action="back">${backButtonLabel()}</button>
        <span class="key-hint">${t("answerKeyHint")}</span>
      </div>
    </section>
  `);
}

// 結算畫面：daily / weekly / review / weak-train 結束後顯示
// 內容：答對率、答對題數、答錯字列表（含正解）
function renderQuizSummary() {
  const summary = state.lastQuizSummary || { kind: "daily", correct: 0, total: 0, mistakes: [] };
  const kindLabel =
    summary.kind === "weekly" ? t("weekly")
    : summary.kind === "review" ? t("review")
    : summary.kind === "weak" ? t("weakTrain")
    : summary.kind === "recall" ? t("recallTitle")
    : t("daily");
  const accuracy = summary.total ? Math.round((summary.correct / summary.total) * 100) : 0;
  const mistakes = Array.isArray(summary.mistakes) ? summary.mistakes : [];
  // 這次答錯、而且還留在弱點池的字（分級測驗不算）
  const weakNow = new Set(activeProfile().weak || []);
  const weakLeft = summary.kind === "placement" ? [] : [...new Set(mistakes.map((item) => item.word))].filter((wordText) => weakNow.has(wordText));
  const passedNote =
    summary.kind === "review" && summary.extra?.passed
      ? `<p class="hero-copy">${summary.extra.message || t("reviewPassed")}</p>`
      : "";
  return appShell(`
    <section class="panel">
      <span class="eyebrow">${kindLabel}</span>
      <h2 class="page-title">${t("quizSummaryTitle")}</h2>
      ${passedNote}
      ${summary.battle ? `<div class="quest-alert ${summary.battle.result === "won" ? "" : "small"}"><strong>${summary.battle.result === "won" ? msg("battleWonSummary", { name: escapeHtml(summary.battle.name), xp: summary.battle.xp, loot: summary.battle.loot }) : summary.battle.result === "lost" ? msg("battleLostSummary", { name: escapeHtml(summary.battle.name) }) : msg("battleEscapedSummary", { name: escapeHtml(summary.battle.name) })}</strong></div>` : ""}
      <div class="summary-score">
        <p class="summary-big"><span class="lcd">${accuracy}</span><span>%</span></p>
        <dl class="readout">
          <div><dt>${t("correct")}</dt><dd class="lcd">${summary.correct}/${summary.total}</dd></div>
          <div><dt>${t("wrongCount") || "錯題"}</dt><dd class="lcd">${mistakes.length}</dd></div>
        </dl>
      </div>
      <div class="wrong-review">
        <h3>${t("wrongReview") || "錯題回顧"}</h3>
        ${mistakes.length
          ? `<ul class="word-bank">${mistakes.map((item) => `
              <li class="word-bank-row">
                <div class="word-bank-main">
                  <strong>${escapeHtml(item.word || "")}</strong>
                </div>
                <div class="word-bank-meaning">${escapeHtml(compactMeaning(entryForActiveGoal(item.word)?.meaning || "") || item.correct || "")}</div>
              </li>
            `).join("")}</ul>`
          : `<p class="muted">${t("noWrongAnswers") || "沒有錯題"}</p>`}
      </div>
      <div class="actions">
        ${weakLeft.length ? `<button class="btn" data-action="weak-train" data-recent="${escapeHtml(weakLeft.join("|"))}">${msg("weakTrainCount", { count: Math.min(WEAK_TRAINING_SIZE, Math.max(weakLeft.length, activeProfile().weak.length)) })}</button>` : ""}
        <button class="btn ${weakLeft.length ? "secondary" : ""}" data-action="dashboard">${t("backMap")}</button>
      </div>
      ${weakLeft.length ? `<p class="muted">${t("weakTrainNote")}</p>` : ""}
    </section>
  `);
}

function renderResult() {
  navigateTo("dashboard", { clearHistory: true, pushHistory: false });
  return renderDashboard();
}

function renderDashboard() {
  if (!hasSelectedGoal()) return renderGoalGate();
  const profile = activeProfile();
  const level = currentRankLevel();
  const label = levelLabel(level);
  // 「今天的 10 個字」只算真的學會的（之前是算當日鎖定的字數，一打開字卡就顯示 10/10）
  const learnedNow = new Set(profile.learned || []);
  const todayLocked = todayStudyWords(studySourceForLibrary(), currentStudyLibraryId());
  const todayComplete = todayStudyComplete();
  const todayTotal = todayLocked.length || 10;
  const todayCount = todayComplete ? todayTotal : todayLocked.filter((item) => learnedNow.has(item.word)).length;
  const learnedPercent = getLearnedPercent();
  const rank = getPlayerRank();
  const xp = state.xp || 0;
  const nextNeed = xpNeededForRank(rank);
  const currentXp = xpIntoCurrentRank();
  const dueCount = srsDueCount();
  const pendingLevel = state.pendingLevelUp || null;
  const showWeeklyNotice = shouldShowWeeklyNotice();
  const showLevelUpAlert = !!(pendingLevel && !pendingLevel.lootClaimed);
  const waitingBoss = canBattlePendingLevelUp() && pendingLevel.lootClaimed ? pendingLevel.monster : null;
  const equipped = achievementBadgeMeta(state.equippedTitle) || achievementBadgeMeta(state.completedAchievements?.[state.completedAchievements.length - 1]) || { icon: "crown", title: t("noTitle"), done: false };
  const dailyOpen = dailyTestAvailable();
  const weeklyOpen = weeklyTestAvailable();
  const reviewOpen = learnedPercent >= 60;
  const itemTotal = battleItems().reduce((sum, item) => sum + (state.inventory[item.id] || 0), 0);
  const menuRow = (action, title, note, value = "", disabled = false) => `
    <button class="menu-row" data-action="${action}" ${disabled ? "disabled" : ""}>
      <span class="menu-row-title">${title}</span>
      ${note ? `<span class="menu-row-note">${note}</span>` : ""}
      ${value !== "" ? `<span class="menu-row-value">${value}</span>` : ""}
    </button>`;
  return appShell(`
    ${showWeeklyNotice ? `
      <div class="modal-backdrop" data-action="dismiss-weekly-notice">
        <div class="modal-card" onclick="event.stopPropagation()">
          <h2>${t("weeklyNoticeTitle")}</h2>
          <p>${msg("weeklyNoticeCopy", { day: state.achievements?.totalLoginDays || 0 })}</p>
          <div class="actions">
            <button class="btn" data-action="open-weekly-now">${t("weeklyNoticeOpen")}</button>
            <button class="btn secondary" data-action="dismiss-weekly-notice">${t("weeklyNoticeLater")}</button>
          </div>
        </div>
      </div>
    ` : ""}
    <section class="dashboard">
      ${toast ? `<div class="quest-alert small" role="status"><span>${toast}</span></div>` : ""}
      <header class="panel status-panel">
        <div class="status-who">
          <span class="eyebrow">${t("dashboard")}</span>
          <h2 class="page-title">${escapeHtml(playerDisplayName())}</h2>
          <p class="status-title">${label.name}${rankTierTitle(state.rankTier || 1) !== label.name ? `<span>${t("rankLabel")}：${rankTierTitle(state.rankTier || 1)}</span>` : ""}</p>
        </div>
        <dl class="readout">
          <div><dt>${t("adventurerRank")}</dt><dd class="lcd">Lv.${rank}</dd></div>
          <div><dt>${t("xp")}</dt><dd class="lcd">${xp}</dd></div>
          <div><dt>${t("studyStreak")}</dt><dd class="lcd">${studyStreak()}</dd></div>
        </dl>
        <div class="status-xp">
          <div class="meter" role="progressbar" aria-valuemin="0" aria-valuemax="${nextNeed}" aria-valuenow="${currentXp}"><span style="width:${xpProgress()}%"></span></div>
          <small>${t("nextLevel")} ${currentXp}/${nextNeed}</small>
        </div>
        <button class="dashboard-badge" data-action="achievements" title="${equipped.title || t("noTitle")}" aria-label="${t("achievements")}">
          ${badgeSvg(equipped.icon, equipped.done, equipped.tierIndex || 0)}
        </button>
      </header>
      <nav class="goal-switch" aria-label="${t("activeGoal")}">
        ${orderedUserGoals().map((goal) => `<button class="chip ${activeGoal() === goal ? "active" : ""}" data-active-goal="${goal}" ${activeGoal() === goal ? 'aria-current="true"' : ""}>${goalLabel(goal)}</button>`).join("")}
        ${unselectedGoals().map((goal) => `<button class="chip add" data-add-goal="${goal}">+ ${goalLabel(goal)}</button>`).join("")}
      </nav>
      ${showLevelUpAlert ? `<div class="quest-alert"><strong>${t("levelUp")} Lv.${pendingLevel.from} → Lv.${pendingLevel.to}</strong><button class="btn" data-action="claim-level-loot">${t("claimLevelLoot")}</button></div>` : ""}
      ${waitingBoss ? `<div class="quest-alert small"><span>${msg("bossWaiting", { level: pendingLevel.monsterLevel || pendingLevel.to, name: escapeHtml(waitingBoss.name) })}</span></div>` : ""}
      <div class="dash-grid">
        <section class="panel today-panel ${todayComplete ? "complete" : ""}">
          <span class="eyebrow">${activeLibraryLabel()}</span>
          <h3>${t("todayWords")}</h3>
          <p class="today-count"><span class="lcd">${todayCount}</span><span>/ ${todayTotal}</span></p>
          <div class="meter"><span style="width:${Math.min(100, Math.round((todayCount / todayTotal) * 100))}%"></span></div>
          <p class="muted">${dueCount > 0 ? `${t("srsDue")} ${dueCount}` : t("srsAllClear")}${state.streakRewardKey ? `，${msg("streakReward", { reward: t(state.streakRewardKey) })}` : ""}</p>
          ${todayLocked.length
            ? `<ul class="today-words" lang="en">${todayLocked.map((item) => `<li class="${learnedNow.has(item.word) ? "done" : ""}">${escapeHtml(item.word)}</li>`).join("")}</ul>`
            : `<p class="muted today-words-empty">${t("todayWordsEmpty")}</p>`}
          <div class="actions">
            <button class="btn" data-action="study">${t("learn")}</button>
            <button class="btn ${dailyOpen ? "" : "secondary"}" data-action="daily" ${dailyOpen ? "" : "disabled"}>${t("daily")}</button>
            ${todayLockComplete() ? `<button class="btn secondary" data-action="next-round">${t("nextRound")}</button>` : ""}
          </div>
        </section>
        ${renderCalendar()}
        <section class="panel menu-panel">
          <h3>${t("reviewZone")}</h3>
          <div class="menu-list">
            ${profile.weak.length ? menuRow("weak-train", t("weakTrain"), t("weakTrainNote"), Math.min(WEAK_TRAINING_SIZE, profile.weak.length)) : ""}
            ${menuRow("weak", t("weak"), "", profile.weak.length)}
            ${menuRow("learned-words", t("learnedWords"), "", profile.learned.length)}
            ${menuRow("weekly", t("weekly"), weeklyOpen ? "" : t("weeklyLockedNote"), "", !weeklyOpen)}
            ${menuRow("review", t("review"), reviewOpen ? msg("reviewReady", { percent: learnedPercent }) : t("reviewLockedNote"), `${learnedPercent}%`, !reviewOpen)}
            ${menuRow("custom-hub", t("customHub"), "", state.customLibraries.length || "")}
          </div>
        </section>
        <section class="panel menu-panel adventure-panel">
          <h3>${t("adventureZone")}</h3>
          <div class="menu-list">
            ${menuRow("inventory", t("inventory"), "", itemTotal)}
            ${menuRow("achievements", t("achievements"), equipped.title || t("noTitle"))}
            ${menuRow("progress", t("progressTitle"), msg("progressNote", { count: longTermCount(profile) }))}
          </div>
        </section>
      </div>
      <footer class="dash-footer">
        <div class="dash-footer-keys">
          <button class="btn ghost small" data-action="export-progress">${t("exportProgress")}</button>
          <button class="btn ghost small" data-action="import-progress">${t("importProgressBtn")}</button>
          <button class="btn ghost small" data-action="toggle-theme">${currentTheme() === "dark" ? t("lightMode") : t("darkMode")}</button>
          <button class="btn ghost small danger" data-action="reset">${t("reset")}</button>
          <input type="file" id="importProgressFile" accept="application/json,.json" hidden />
        </div>
        <p class="backup-hint">${t("backupHint")}</p>
      </footer>
    </section>
  `);
}

function renderCustomStudySelect() {
  return appShell(`
    <section class="panel">
      <h2 class="page-title">${t("customHubTitle")}</h2>
      <div class="actions top-return-actions">
        <button class="btn secondary" data-action="back">${backButtonLabel()}</button>
      </div>
      <p class="hero-copy">${t("customHubCopy")}</p>
      <div class="actions">
        <button class="btn" data-action="import">${t("importWords")}</button>
        ${state.customLibraries.length ? `<button class="btn secondary" data-action="custom-library-view">${t("viewAllLibraries")}</button>` : ""}
      </div>
      ${state.customLibraries.length ? `
        <div class="grid">
          ${state.customLibraries.map((library) => {
            const broken = (library.words || []).filter((item) => {
              const m = (item.meaning || "").trim();
              const noChinese = !/[一-鿿]/.test(m);
              return !m || noChinese || !cambridgeExampleText(item);
            }).length;
            const complete = (library.words || []).length > 0 && (library.words || []).every((item) => activeProfile().learned.includes(item.word));
            return `
              <article class="card admin-card library-card ${complete ? "complete" : ""}">
                <div class="library-header">
                  <strong>${escapeHtml(library.name)}</strong>
                  <p class="muted">${(library.words || []).length} 字${broken > 0 ? `，<span class="warn-text">${broken} 字釋義不全</span>` : ""}</p>
                </div>
                <div class="library-tools">
                  <button class="btn small" data-start-custom-study="${library.id}">${t("startLearningCustom")}</button>
                  <button class="btn ghost small" data-open-custom-library="${library.id}">${t("viewWordLibrary")}</button>
                  <button class="btn ghost small danger" data-delete-library="${library.id}">${t("deleteLibrary")}</button>
                </div>
              </article>
            `;
          }).join("")}
        </div>
      ` : `<p class="muted">${t("customHubEmpty")}</p>`}
    </section>
  `);
}

function renderCustomLibraryView() {
  const all = state.customLibraries || [];
  // 如果指定了 viewingLibraryId 就只顯示那一個庫；否則全部列出
  const libraries = viewingLibraryId
    ? all.filter((library) => library.id === viewingLibraryId)
    : all;
  const headerName = viewingLibraryId && libraries[0] ? libraries[0].name : t("viewAllLibraries");
  return appShell(`
    <section class="panel">
      <div class="eyebrow">${t("customLibrary")}</div>
      <h2 class="page-title">${headerName}</h2>
      <div class="actions top-return-actions">
        <button class="btn secondary" data-action="back">${backButtonLabel()}</button>
      </div>
      <p class="hero-copy">${t("viewLibraryCopy")}</p>
      ${toast ? `<div class="toast" role="status">${toast}</div>` : ""}
      ${libraries.length ? `
        ${libraries.map((library) => {
          const profile = activeProfile();
          const complete = (library.words || []).length > 0 && (library.words || []).every((item) => profile.learned.includes(item.word));
          return `
          <article class="card library-view-card ${complete ? "complete" : ""}">
            <div class="library-view-head">
              <h3>${escapeHtml(library.name)}</h3>
              <p class="muted">${(library.words || []).length} 字</p>
            </div>
            <div class="library-add-box">
              <label>${t("addWordsToLibrary")}</label>
              <textarea class="textarea" rows="4" data-add-words-input="${library.id}" placeholder="${t("addWordsPlaceholder")}"></textarea>
              <div class="actions">
                <button class="btn small" data-add-words-library="${library.id}">${t("addWordsToLibrary")}</button>
              </div>
            </div>
            <ul class="word-bank">
              ${(library.words || []).map((item) => `
                <li class="word-bank-row">
                  <div class="word-bank-main">
                    <strong>${escapeHtml(item.word)}</strong>
                    ${item.phonetic ? `<span class="phonetic-inline">${escapeHtml(item.phonetic)}</span>` : ""}
                    ${item.pos ? `<span class="tag tag-pos">${escapeHtml(item.pos)}</span>` : ""}
                  </div>
                  <div class="word-bank-meaning">${displayMeaning(item) || `<span class="muted">${t("noMeaning")}</span>`}</div>
                  ${renderCambridgeExample(item)}
              </li>
            `).join("")}
            </ul>
          </article>
        `;}).join("")}
      ` : `<p class="muted">${t("noNewStudyWords")}</p>`}
    </section>
  `);
}

// ===== 學過的單字（需求.txt #5）=====
// 列出目前學習目標所有學過的單字，附搜尋（單字或字義）。
let learnedSearchQuery = "";

function learnedWordEntries() {
  const profile = activeProfile();
  return (profile.learned || [])
    .map((text) => {
      const item = findWord(text) || { word: text, meaning: "", phonetic: "", pos: "" };
      return { ...item, learnedDate: profile.learnedLog?.[text] || "" };
    })
    .sort((a, b) => String(b.learnedDate).localeCompare(String(a.learnedDate)) || String(a.word).localeCompare(String(b.word)));
}

function learnedWordsListHtml() {
  const query = learnedSearchQuery.trim().toLowerCase();
  const all = learnedWordEntries();
  const entries = query
    ? all.filter((item) =>
        String(item.word || "").toLowerCase().includes(query) ||
        String(item.meaning || "").toLowerCase().includes(query))
    : all;
  if (!entries.length) {
    return `<p class="muted">${all.length ? t("learnedNoResults") : t("learnedEmpty")}</p>`;
  }
  return `
    <ul class="word-bank">
      ${entries.map((item) => `
        <li class="word-bank-row">
          <div class="word-bank-main">
            <strong>${escapeHtml(item.word)}</strong>
            ${item.phonetic ? `<span class="phonetic-inline">${escapeHtml(item.phonetic)}</span>` : ""}
            ${item.pos ? `<span class="tag tag-pos">${escapeHtml(item.pos)}</span>` : ""}
            ${item.learnedDate ? `<span class="learned-date">${escapeHtml(item.learnedDate)}</span>` : ""}
            <button class="speak-btn" data-action="speak-word" data-word="${escapeHtml(item.word)}" title="${t("speak")}" aria-label="${t("speak")}">${speakerIcon()}</button>
          </div>
          <div class="word-bank-meaning">${displayMeaning(item) || `<span class="muted">${t("noMeaning")}</span>`}</div>
        </li>
      `).join("")}
    </ul>
  `;
}

function renderLearnedWords() {
  const total = learnedWordEntries().length;
  return appShell(`
    <section class="panel">
      <h2 class="page-title">${t("learnedWordsTitle")} <span class="title-count">${total}</span></h2>
      <div class="actions top-return-actions">
        <button class="btn secondary" data-action="back">${backButtonLabel()}</button>
      </div>
      <p class="hero-copy">${t("learnedWordsCopy")}</p>
      <input class="input learned-search" type="search" data-learned-search placeholder="${t("learnedSearchPlaceholder")}" value="${escapeHtml(learnedSearchQuery)}" />
      <div id="learnedWordsList">${learnedWordsListHtml()}</div>
    </section>
  `);
}

function renderStudy() {
  if (!studySession) studySession = createStudySession();
  if (studySession.phase === "loading") {
    return appShell(`
      <section class="panel">
        <div class="eyebrow">${t("learn")}</div>
        <h2 class="page-title">${t("learn")}</h2>
        <p class="hero-copy">${t("studyLoading")}…</p>
      </section>
    `);
  }
  if (studySession.phase === "empty") {
    return appShell(`
      <section class="panel">
        <div class="eyebrow">${t("learn")}</div>
        <h2 class="page-title">${t("learn")}</h2>
        <p class="hero-copy">${t("noNewStudyWords")}</p>
        <div class="actions">
          <button class="btn secondary" data-action="back">${backButtonLabel()}</button>
        </div>
      </section>
    `);
  }
  if (studySession.phase === "all-done") {
    const lid = studySession.libraryId || "";
    return appShell(`
      <section class="panel">
        <div class="eyebrow">${t("learn")}</div>
        <h2 class="page-title">${t("allDoneTitle")}</h2>
        <p class="hero-copy">${t("allDoneCopy")}</p>
        <div class="actions">
          <button class="btn secondary" data-action="back">${backButtonLabel()}</button>
          <button class="btn" data-action="next-round-reset" data-library-id="${lid}">${t("nextRoundReset")}</button>
          ${lid ? "" : `<button class="btn" data-action="daily" ${dailyTestAvailable() ? "" : "disabled"}>${t("daily")}</button>`}
        </div>
      </section>
    `);
  }
  if (studySession.phase === "preview") {
    const current = studySession.words[studySession.previewIndex] || studySession.words[0];
    const phonetic = phoneticText(current);
    return appShell(`
      <section class="flash-stage">
        <article class="panel flashcard" data-card-swipe>
          <header class="flash-head">
            <span class="eyebrow">${t("previewEyebrow")}</span>
            <ol class="card-dots" aria-label="${msg("cardProgress", { current: studySession.previewIndex + 1, total: studySession.words.length })}">
              ${studySession.words.map((_, index) => `<li class="${index === studySession.previewIndex ? "on" : index < studySession.previewIndex ? "seen" : ""}"></li>`).join("")}
            </ol>
            <span class="flash-count lcd">${studySession.previewIndex + 1}/${studySession.words.length}</span>
          </header>
          <div class="flash-copy">
            <h2 class="headword"><span class="marker">${escapeHtml(current.word)}</span></h2>
            <p class="flash-meta">
              ${phonetic ? `<span class="phonetic">${escapeHtml(phonetic)}</span>` : ""}
              ${current.pos && current.pos !== "word" ? `<span class="tag">${escapeHtml(current.pos)}</span>` : ""}
              ${current.grade ? `<span class="tag grade-tag">${escapeHtml(current.grade)}</span>` : ""}
              ${speakButtons(current.word)}
            </p>
            <h3 class="flash-meaning">${displayMeaning(current)}</h3>
            ${renderCambridgeExample(current, "", { withAudio: true })}
          </div>
          <footer class="flash-foot">
            <div class="actions">
              <button class="btn secondary" data-action="prev-card" ${studySession.previewIndex === 0 ? "disabled" : ""}>${t("previousCard")}</button>
              ${studySession.previewIndex < studySession.words.length - 1
                ? `<button class="btn" data-action="next-card">${t("nextCard")}</button>`
                : `<button class="btn" data-action="start-study-quiz">${t("previewDone")}</button>`}
            </div>
            <div class="actions">
              ${studySession.previewIndex < studySession.words.length - 1 ? `<button class="btn ghost small" data-action="start-study-quiz">${t("previewDone")}</button>` : ""}
              <button class="btn ghost small" data-action="back">${backButtonLabel()}</button>
            </div>
            <p class="key-hint"><span class="touch-only">${t("cardHint")}</span><span class="pointer-only">${t("keyHint")}</span></p>
          </footer>
        </article>
      </section>
    `);
  }

  const current = studySession.questions[studySession.index] || studySession.questions[0];
  const isWordChoice = current.type === "word";
  const isCloze = current.type === "cloze";
  const studyQuestionText = isWordChoice ? compactMeaning(current.meaning) : isCloze ? clozePrompt(current) : current.word;
  return appShell(`
    <section class="panel quiz-wrap">
      <div class="quiz-head">
        <div>
          <span class="eyebrow">${msg("questionProgress", { current: studySession.index + 1, total: studySession.questions.length })}</span>
          <h2 class="page-title">${studySession.mode === "weak" ? t("weakTrain") : t("recallTitle")}</h2>
        </div>
      </div>
      <div class="question">
        <div>
          <div class="${isCloze || isWordChoice ? "sentence" : "word"}">${escapeHtml(studyQuestionText)}</div>
          <div class="phonetic">${isWordChoice ? t("chooseStudyWord") : isCloze ? t("clozeHint") : escapeHtml(current.phonetic || "")}</div>
        </div>
      </div>
      <div class="meter"><span style="width:${(studySession.index / studySession.questions.length) * 100}%"></span></div>
      <div class="answers ${isWordChoice ? "answers-en" : "answers-zh"}">
        ${current.choices.map((option) => `<button class="answer" data-study-answer="${escapeHtml(option)}" data-correct="${escapeHtml(current.correct)}">${escapeHtml(option)}</button>`).join("")}
      </div>
      ${toast ? `<div class="toast">${toast}</div>` : ""}
      <div class="actions quiz-foot">
        <button class="btn secondary" data-action="back">${backButtonLabel()}</button>
        <span class="key-hint">${t("answerKeyHint")}</span>
      </div>
      ${celebrate ? `<div class="celebrate">${t("correctFx")}</div>` : ""}
    </section>
  `);
}

function renderWeak() {
  const profile = activeProfile();
  // 用 allWords() 找弱點字（同時涵蓋內建與自訂庫），不再被當前目標篩掉
  const weakSet = new Set(profile.weak || []);
  const weakWords = uniqueWordObjects(allWords().filter((item) => weakSet.has(item.word)));
  const weakComplete = !weakWords.length;
  return appShell(`
    ${renderCardModal()}
    <section class="panel ${weakComplete ? "complete" : ""}">
      <h2 class="page-title">${t("weakTitle")} <span class="title-count">${weakWords.length}</span></h2>
      <p class="hero-copy">${weakWords.length ? t("weakCopyFilled") : t("weakCopyEmpty")}</p>
      <div class="actions weak-actions">
        ${weakWords.length ? `<button class="btn" data-action="weak-train">${t("weakTrain") || "弱點加強"}</button>` : ""}
        <button class="btn secondary" data-action="back">${backButtonLabel()}</button>
      </div>
      <div class="grid weak-grid">
        ${weakWords
          .map(
            (item) => {
              const phonetic = phoneticText(item);
              return `
              <button class="card weak-card" data-show-card-word="${escapeHtml(item.word)}">
                <h3>${escapeHtml(item.word)}</h3>
                ${phonetic ? `<p class="phonetic">${escapeHtml(phonetic)}</p>` : ""}
                <p><strong>${displayMeaning(item)}</strong></p>
                ${renderCambridgeExample(item, "muted")}
              </button>
            `;},
          )
          .join("")}
      </div>
    </section>
  `);
}

// 顯示字卡 modal（弱點點擊、查單字按鈕等共用）
// 同一個字在不同考試目標各有一筆（釋義、分級不同），優先拿目前目標的那一筆
function entryForActiveGoal(wordText) {
  const goal = activeGoal();
  return words.find((item) => item.word === wordText && item.goal.includes(goal)) || findWord(wordText);
}

function renderCardModal() {
  if (!cardModalWord) return "";
  const item = entryForActiveGoal(cardModalWord);
  if (!item) return "";
  const phonetic = phoneticText(item);
  return `
    <div class="modal-backdrop" data-action="close-card-modal">
      <article class="modal-card word-modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(item.word)}" onclick="event.stopPropagation()">
        <div class="flash-copy">
          <h2 class="headword"><span class="marker">${escapeHtml(item.word)}</span></h2>
          <p class="flash-meta">
            ${phonetic ? `<span class="phonetic">${escapeHtml(phonetic)}</span>` : ""}
            ${item.pos && item.pos !== "word" ? `<span class="tag">${escapeHtml(item.pos)}</span>` : ""}
            ${item.grade ? `<span class="tag grade-tag">${escapeHtml(item.grade)}</span>` : ""}
            ${speakButtons(item.word)}
          </p>
          <h3 class="flash-meaning">${displayMeaning(item)}</h3>
          ${renderCambridgeExample(item, "", { withAudio: true })}
        </div>
        <div class="actions">
          <button class="btn" data-action="close-card-modal">${t("backPrevious")}</button>
        </div>
      </article>
    </div>
  `;
}

function hasCambridgeExampleSource(item) {
  const sources = Array.isArray(item?.sources) ? item.sources : [];
  return sources.some((source) => ["cambridge-example", "cambridge-english-example", "yahoo-example", "dictionaryapi-example"].includes(String(source)));
}

function hasNativeMeaningSource(item) {
  const sources = Array.isArray(item?.sources) ? item.sources : [];
  return sources.includes(`cambridge-${state.native || "zh-Hant"}`);
}

// 轉義使用者輸入 / 字典抓回的內容，避免 XSS 與 HTML 破版
function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function displayMeaning(item) {
  const meaning = compactMeaning(item?.meaning || "");
  if (!meaning) {
    requestDictionaryEntry(item);
    return "";
  }
  if (hasNativeMeaningSource(item)) return escapeHtml(meaning);
  if (isSpanishNative()) {
    requestDictionaryEntry(item);
    return "";
  }
  if (hasNativeMeaningChars(meaning)) return escapeHtml(meaning);
  requestDictionaryEntry(item);
  return "";
}

function cambridgeExampleText(item) {
  const ex = String(item?.example || "").trim();
  return ex && isCompleteExample(ex) ? ex : "";
}

// 單字朗讀：正常速度＋慢速（給聽不清楚的學生）
function speakButtons(wordText) {
  const word = escapeHtml(wordText);
  return `
    <button class="speak-btn" data-action="speak-word" data-word="${word}" title="${t("speak")}" aria-label="${t("speak")}">${speakerIcon()}</button>
    <button class="speak-btn slow" data-action="speak-word" data-word="${word}" data-rate="${SPEAK_RATE_SLOW}" title="${t("slowSpeak")}" aria-label="${t("slowSpeak")}">${speakerIcon()}<span>${t("slowSpeak")}</span></button>`;
}

function renderCambridgeExample(item, className = "", options = {}) {
  const exampleText = cambridgeExampleText(item);
  if (!exampleText) {
    requestDictionaryEntry(item);
  }
  if (!exampleText) {
    return "";
  }
  const extraClass = className ? ` ${className}` : "";
  const englishOnly = exampleText.replace(/\s*\([^)]*[\u3400-\u9fff][^)]*\)\s*$/, "").trim();
  return `
    <p class="example-label">${t("exampleLabel")}${options.withAudio ? `<button class="speak-btn small" data-action="speak-word" data-word="${escapeHtml(englishOnly)}" title="${t("speakExample")}" aria-label="${t("speakExample")}">${speakerIcon()}</button>` : ""}</p>
    <p class="example${extraClass}">${escapeHtml(exampleText)}</p>
    ${item.exampleZh ? `<p class="example-zh muted">${escapeHtml(item.exampleZh)}</p>` : ""}
  `;
}

function dictionaryLookupUrl(wordText, force = false) {
  const params = new URLSearchParams({
    word: wordText,
    lang: state.native || "zh-Hant",
  });
  if (force) params.set("force", "1");
  return `/api/cambridge?${params.toString()}`;
}

// 內建字在中文介面下，有中文釋義、完整例句、例句中文、音標，就不必再查字典
function isEntryComplete(item) {
  if (!item || item.library !== "built-in" || (state.native || "zh-Hant") !== "zh-Hant") return false;
  return hasNativeMeaningChars(item.meaning) && !!cambridgeExampleText(item) && hasText(item.exampleZh) && isUsablePhonetic(item.phonetic);
}

function requestDictionaryEntry(item) {
  if (isEntryComplete(item)) return;
  const wordText = String(item?.word || "").trim().toLowerCase();
  const requestKey = `${state.native || "zh-Hant"}::${wordText}`;
  if (!wordText || cambridgeExampleRequests.has(requestKey)) return;
  const needsPhonetic = !isUsablePhonetic(item?.phonetic);
  if (cambridgeExampleText(item) && hasNativeMeaningSource(item) && !needsPhonetic) return;
  cambridgeExampleRequests.add(requestKey);
  fetch(dictionaryLookupUrl(wordText, needsPhonetic))
    .then((response) => response.json())
    .then((entry) => {
      const example = String(entry?.example || "").trim();
      const meaning = String(entry?.meaning || "").trim();
      const phonetic = String(entry?.phonetic || "").trim();
      const sources = Array.isArray(entry?.sources) ? entry.sources : [];
      if (!example && !meaning && !phonetic) return;
      applyDictionaryEntry(wordText, entry);
      if (!(screen === "study" && studySession?.phase === "preview")) render();
    })
    .catch(() => {})
    .finally(() => cambridgeExampleRequests.delete(requestKey));
}

function applyDictionaryEntry(wordText, entry) {
  const update = (item) => {
    if (!item || String(item.word || "").toLowerCase() !== wordText) return;
    const newExample = String(entry.example || "").trim();
    const newExampleZh = String(entry.exampleZh || "").trim();
    const meaning = compactMeaning(String(entry.meaning || "").trim());
    const phonetic = String(entry.phonetic || "").trim();
    if (meaning) item.meaning = meaning;
    if (isUsablePhonetic(phonetic)) item.phonetic = phonetic;
    // example 與 exampleZh 必須一起更新，防止舊翻譯沾到新例句上
    if (newExample && isCompleteExample(newExample)) {
      const exampleChanged = newExample !== item.example;
      item.example = newExample;
      // 例句換新 → 翻譯一定要從本次 entry 取，不能 fallback 到舊值
      if (exampleChanged || newExampleZh) {
        item.exampleZh = newExampleZh;
        // 記下這份翻譯對應哪個英文 example（用前 60 字 hash 比對）
        item.exampleZhFor = newExample.slice(0, 60);
      }
    } else if (newExampleZh && item.example && item.exampleZhFor === item.example.slice(0, 60)) {
      // 例句沒換但有新翻譯 → 更新
      item.exampleZh = newExampleZh;
    } else if (item.exampleZh && item.exampleZhFor && item.example && item.exampleZhFor !== item.example.slice(0, 60)) {
      // 既存翻譯與目前例句不配對 → 清掉避免誤導
      item.exampleZh = "";
      delete item.exampleZhFor;
    }
    item.sources = Array.isArray(entry.sources) ? entry.sources : [];
    item.cloze = item.example && item.example.toLowerCase().includes(wordText)
      ? item.example.replace(new RegExp(escapeRegExp(wordText), "i"), "____")
      : "";
  };
  words.forEach(update);
  (state.customLibraries || []).forEach((library) => {
    (library.words || []).forEach(update);
  });
  if (state.customLibraries?.length) saveState();
}

function isUsablePhonetic(value) {
  const text = String(value || "").trim();
  if (!text || text.length < 3) return false;
  if (/[\u3400-\u9fff?]/.test(text)) return false;
  if (!/^([/].+[/]|\[.+\])$/.test(text)) return false;
  return /[A-Za-z\u0250-\u02af\u02c8\u02cc\u02d0]/.test(text);
}

function phoneticText(item) {
  const text = String(item?.phonetic || "").trim();
  if (isUsablePhonetic(text)) return text;
  requestDictionaryEntry(item);
  return "";
}

function renderInventory() {
  const items = battleItems();
  const total = items.reduce((sum, item) => sum + (state.inventory[item.id] || 0), 0);
  return appShell(`
    <section class="panel">
      <div class="eyebrow">${t("inventory")}</div>
      <h2 class="page-title">${t("inventoryTitle")}</h2>
      <div class="actions top-return-actions">
        <button class="btn secondary" data-action="back">${backButtonLabel()}</button>
      </div>
      <p class="hero-copy">${t("inventoryCopy")}</p>
      ${!total ? `<p class="muted">${t("emptyInventory")}</p>` : ""}
      <div class="item-grid inventory-grid">
        ${items.map((item) => `
          <article class="item-card inventory-card">
            ${assetImage(treasureImagePath(item.id), item.name, "item-art")}
            <strong>${item.name}</strong>
            <span class="item-count lcd">×${state.inventory[item.id] || 0}</span>
            <small>${item.effect}</small>
          </article>
        `).join("")}
      </div>
    </section>
  `);
}

let importDraft = { name: "", text: "" };

// ===== 我的進度：跟自己比 =====
function longTermCount(profile = activeProfile()) {
  return Object.values(profile.srs || {}).filter((entry) => (entry.reps || 0) >= 3).length;
}

function learnedOnDates(profile, dates) {
  const set = new Set(dates);
  return Object.values(profile.learnedLog || {}).filter((date) => set.has(date)).length;
}

// ===== 學習月曆與補簽 =====
// 完成每日測驗就蓋章；連續學習每滿 7 天送一張補簽（最多存 2 張），可以補「昨天」漏掉的那一格
const MAX_STREAK_FREEZES = 2;

function stampToday() {
  state.stamps = state.stamps || {};
  const today = todayKey();
  if (state.stamps[today]) return;
  state.stamps[today] = "done";
  const streak = studyStreak();
  if (streak > 0 && streak % 7 === 0 && (state.streakFreezes || 0) < MAX_STREAK_FREEZES) {
    state.streakFreezes = (state.streakFreezes || 0) + 1;
    toast = msg("freezeEarned", { days: streak });
  }
}

function studyStreak() {
  const stamps = state.stamps || {};
  let day = todayKey();
  if (!stamps[day]) day = srsAddDays(day, -1);
  let count = 0;
  while (stamps[day]) {
    count += 1;
    day = srsAddDays(day, -1);
  }
  return count;
}

function canUseFreeze() {
  const stamps = state.stamps || {};
  const yesterday = srsAddDays(todayKey(), -1);
  return (state.streakFreezes || 0) > 0 && !stamps[yesterday] && !!stamps[srsAddDays(todayKey(), -2)];
}

function useStreakFreeze() {
  if (!canUseFreeze()) return;
  state.stamps[srsAddDays(todayKey(), -1)] = "freeze";
  state.streakFreezes -= 1;
}

function renderCalendar() {
  const stamps = state.stamps || {};
  const today = todayKey();
  const [year, month] = today.split("-").map(Number);
  const first = new Date(Date.UTC(year, month - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const blanks = first.getUTCDay();
  const cells = [];
  for (let i = 0; i < blanks; i += 1) cells.push(`<span class="cal-cell empty"></span>`);
  for (let day = 1; day <= daysInMonth; day += 1) {
    const key = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const mark = stamps[key];
    const classes = ["cal-cell", mark === "done" ? "done" : "", mark === "freeze" ? "freeze" : "", key === today ? "today" : "", key > today ? "future" : ""].filter(Boolean).join(" ");
    cells.push(`<span class="${classes}" title="${key}">${day}</span>`);
  }
  return `
    <section class="panel calendar-panel">
      <div class="calendar-head">
        <h3>${t("calendarTitle")}<span>${year}／${month}</span></h3>
        <p><strong class="lcd">${studyStreak()}</strong> ${t("calendarDays")}<span class="freeze-count">${msg("freezeCount", { count: state.streakFreezes || 0 })}</span></p>
      </div>
      <div class="cal-grid" aria-label="${t("calendarTitle")}">
        ${t("weekdayLetters").split("").map((letter) => `<span class="cal-weekday">${letter}</span>`).join("")}
        ${cells.join("")}
      </div>
      ${canUseFreeze() ? `<button class="btn secondary small" data-action="use-freeze">${t("useFreeze")}</button>` : ""}
      <p class="muted">${t("calendarNote")}</p>
    </section>
  `;
}

function renderProgress() {
  const profile = activeProfile();
  const learned = profile.learned || [];
  const learnedSet = new Set(learned);
  const dueToday = Object.entries(profile.srs || {}).filter(([wordText, entry]) => learnedSet.has(wordText) && entry.nextReview && entry.nextReview <= todayKey()).length;
  const last14 = recentDates(14);
  const thisWeek = learnedOnDates(profile, last14.slice(0, 7));
  const prevWeek = learnedOnDates(profile, last14.slice(7));
  const cutoff = srsAddDays(todayKey(), -14);
  const older = learned.filter((wordText) => profile.learnedLog?.[wordText] && profile.learnedLog[wordText] <= cutoff);
  const weakSet = new Set(profile.weak || []);
  const kept = older.filter((wordText) => !weakSet.has(wordText)).length;
  const weeks = Array.from({ length: 8 }, (_, index) => {
    const start = srsAddDays(currentWeekKey(), -7 * (7 - index));
    const dates = Array.from({ length: 7 }, (_, day) => srsAddDays(start, day));
    return { label: `${Number(start.slice(5, 7))}/${Number(start.slice(8, 10))}`, count: learnedOnDates(profile, dates) };
  });
  const maxWeek = Math.max(10, ...weeks.map((week) => week.count));
  return appShell(`
    <section class="panel progress-panel">
      <div class="page-head">
        <h2 class="page-title">${t("progressTitle")}</h2>
        <button class="btn secondary" data-action="back">${backButtonLabel()}</button>
      </div>
      <dl class="readout progress-readout">
        <div><dt>${t("progressLearned")}</dt><dd class="lcd">${learned.length}</dd></div>
        <div><dt>${t("progressLongTerm")}</dt><dd class="lcd">${longTermCount(profile)}</dd></div>
        <div><dt>${t("progressDue")}</dt><dd class="lcd">${dueToday}</dd></div>
        <div><dt>${t("weak")}</dt><dd class="lcd">${weakSet.size}</dd></div>
      </dl>
      <p class="muted">${t("progressHint")}</p>
      <p class="progress-line">${msg("progressWeekCompare", { now: thisWeek, prev: prevWeek })}</p>
      <p class="progress-line">${older.length ? msg("progressRetention", { total: older.length, kept, percent: Math.round((kept / older.length) * 100) }) : t("progressRetentionEmpty")}</p>
      <h3 class="progress-sub">${t("progressWeeks")}</h3>
      <div class="week-bars" role="img" aria-label="${t("progressWeeks")}">
        ${weeks.map((week, index) => `
          <div class="week-bar ${index === weeks.length - 1 ? "now" : ""}">
            <span class="week-bar-count">${week.count}</span>
            <span class="week-bar-fill" style="height:${Math.round((week.count / maxWeek) * 100)}%"></span>
            <span class="week-bar-label">${week.label}</span>
          </div>
        `).join("")}
      </div>
    </section>
  `);
}

function renderImport() {
  const limit = customLibraryLimit();
  return appShell(`
    <section class="panel import-panel">
      <div class="eyebrow">${t("importWords")}</div>
      <h2 class="page-title">${t("importTitle")}</h2>
      <div class="actions top-return-actions">
        <button class="btn secondary" data-action="back">${backButtonLabel()}</button>
      </div>
      <p class="hero-copy">${t("importCopy")}</p>
      <p class="muted">${msg("importLimit", { limit })}</p>
      <div class="form-grid">
        <div class="field">
          <label>${t("libraryName")}</label>
          <input class="input" id="libraryName" value="${escapeHtml(importDraft.name || t("customLibrary"))}" />
        </div>
        <div class="field">
          <label>${t("photoInput")}</label>
          <input class="input" type="file" accept="image/*" capture="environment" id="photoInput" />
          <img class="photo-preview" id="photoPreview" alt="" />
        </div>
        <div class="field">
          <label>${t("wordInput")}</label>
          <textarea class="textarea" id="wordImportText" rows="10" placeholder="${t("englishOnlyPlaceholder")}">${escapeHtml(importDraft.text)}</textarea>
        </div>
      </div>
      <div class="actions">
        <button class="btn" data-action="save-import">${t("saveLibrary")}</button>
      </div>
      <div class="toast">${toast}</div>
    </section>
  `);
}

function renderAchievements() {
  checkAchievementUnlocks();
  const groups = achievementGroups();
  const equipped = achievementBadgeMeta(state.equippedTitle) || achievementBadgeMeta(state.completedAchievements?.[state.completedAchievements.length - 1]) || { icon: "crown", done: false, title: t("noTitle"), name: t("noTitle") };
  return appShell(`
    <section class="panel">
      <div class="page-head">
        <div>
          <h2 class="page-title">${t("achievements")}</h2>
          <div class="actions top-return-actions"><button class="btn secondary" data-action="back">${backButtonLabel()}</button></div>
          <p class="hero-copy">${t("achievementsCopy")}</p>
        </div>
        <button class="dashboard-badge" data-action="achievements" title="${equipped.title || t("noTitle")}">
          ${badgeSvg(equipped.icon, equipped.done)}
        </button>
      </div>
      <div class="achievement-grid">
        ${groups
          .map(
            (group) => `
              <article class="card achievement-group ${group.complete ? "done badge-mythic" : ""}">
                <button class="achievement-summary" data-achievement-group="${group.id}">
                  <div class="achievement-summary-head">
                    <div class="achievement-icon">${badgeSvg(group.icon, group.complete, group.tiers.length - 1)}</div>
                    <div>
                      <h3>${group.heading}<span class="ach-count lcd">${group.count}</span></h3>
                      <p class="muted">${t("achNextTarget")}：${group.complete ? t("achAllComplete") : group.next.name}</p>
                    </div>
                  </div>
                  <p class="muted">${group.complete ? t("achAllComplete") : group.next.condition}</p>
                  <div class="meter"><span style="width:${group.progress}%"></span></div>
                </button>
                ${achievementFocus === group.id ? `
                  <div class="achievement-detail">
                    <div class="achievement-section">
                      <h4>${t("achEarnedTitles")}</h4>
                      <div class="title-rack">
                        ${group.earned.length ? group.earned.map((tier, tIdx) => {
                          // 在原本 tiers 中的真實 index
                          const realIdx = group.tiers.findIndex((t) => t.key === tier.key);
                          return `
                          <button class="chip title-chip earned" data-equip-title="${tier.key}">
                            <span class="title-chip-icon">${badgeSvg(group.icon, true, realIdx)}</span>
                            <span>${tier.name}</span>
                          </button>
                        `;
                        }).join("") : `<p class="muted">${t("noTitle")}</p>`}
                      </div>
                    </div>
                    <div class="achievement-section">
                      <h4>${t("achLockedTitles")}</h4>
                      <div class="title-rack">
                        ${group.locked.length ? group.locked.map((tier) => {
                          const realIdx = group.tiers.findIndex((t) => t.key === tier.key);
                          return `
                          <span class="chip title-chip locked">
                            <span class="title-chip-icon">${badgeSvg(group.icon, false, realIdx)}</span>
                            <span>${tier.name}</span>
                          </span>
                        `;
                        }).join("") : `<span class="chip title-chip locked"><span>${t("achAllComplete")}</span></span>`}
                      </div>
                    </div>
                  </div>
                ` : ""}
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `);
}

const RANK_TITLES_BY_LANG = {
  "zh-Hant": ["燭火侍從", "銅環見習騎士", "銀頁誓約者", "霜刃巡獵官", "聖紋守城將", "龍脊遠征侯", "星冠大賢王"],
  en: ["Candle Squire", "Copper-Ring Knight", "Silverleaf Oathbound", "Frostblade Ranger", "Sigil Keep Warden", "Dragonspine Margrave", "Starcrown High Sage"],
  ja: ["灯火の従者", "銅環の見習騎士", "銀頁の誓約者", "霜刃の巡猟官", "聖紋の城塞守", "竜脊の遠征侯", "星冠の大賢王"],
  ko: ["촛불 시종", "동환 견습기사", "은빛 서약자", "서리칼날 순찰관", "성문 성채수호장", "용등성이 원정후", "별왕관 대현왕"],
  es: ["Escudero de Vela", "Caballero del Aro de Cobre", "Juramentado de Hoja Plateada", "Montaraz Filoescarcha", "Guardián del Sello", "Margrave de Espinadragón", "Alto Sabio Coronoestelar"],
};

const RANK_TITLES = RANK_TITLES_BY_LANG["zh-Hant"]; // 相容舊呼叫；長度=7

function rankTierTitle(tier = 1) {
  const list = RANK_TITLES_BY_LANG[state.native || "zh-Hant"] || RANK_TITLES_BY_LANG["zh-Hant"];
  return list[Math.max(0, Math.min(list.length - 1, tier - 1))];
}

// 成就 tier 條件模板：依分類 + 目標數動態組合句子（按語言）
function achConditionTemplate(catId, goal) {
  const lang = String(state.native || "zh-Hant").toLowerCase();
  const T = {
    correct: {
      "zh-hant": `累計答對 ${goal} 題。`,
      ja: `累計 ${goal} 問正解。`,
      ko: `누적 ${goal}문 정답.`,
      es: `Acertar ${goal} preguntas en total.`,
    },
    combo: {
      "zh-hant": `單次連續答對 ${goal} 題。`,
      ja: `1 回で連続 ${goal} 問正解。`,
      ko: `한 번에 ${goal}문 연속 정답.`,
      es: `Encadenar ${goal} aciertos seguidos.`,
    },
    streak: {
      "zh-hant": goal === 1 ? "登入 1 天。" : `連續登入 ${goal} 天。`,
      ja: goal === 1 ? "1 日ログイン。" : `${goal} 日連続ログイン。`,
      ko: goal === 1 ? "1일 로그인." : `${goal}일 연속 로그인.`,
      es: goal === 1 ? "Inicia sesión 1 día." : `${goal} días seguidos de inicio.`,
    },
    login: {
      "zh-hant": `累計登入 ${goal} 天。`,
      ja: `累計 ${goal} 日ログイン。`,
      ko: `누적 ${goal}일 로그인.`,
      es: `${goal} días de inicio en total.`,
    },
    level: {
      "zh-hant": "第一次升級。",
      ja: "初めての昇級。",
      ko: "최초 승급.",
      es: "Primer ascenso.",
    },
    monster: {
      "zh-hant": `擊敗 ${goal} 隻怪物。`,
      ja: `モンスター ${goal} 体を討伐。`,
      ko: `몬스터 ${goal}마리 처치.`,
      es: `Derrota a ${goal} monstruos.`,
    },
    import: {
      "zh-hant": `建立 ${goal} 個自訂單字庫。`,
      ja: `${goal} 個のカスタム単語帳を作成。`,
      ko: `${goal}개의 커스텀 단어집 생성.`,
      es: `Crea ${goal} bibliotecas personales.`,
    },
    review: {
      "zh-hant": `通過 ${goal} 次總複習測驗。`,
      ja: `${goal} 回の総復習に合格。`,
      ko: `${goal}회 종합 복습 합격.`,
      es: `Aprueba ${goal} exámenes generales.`,
    },
    totalLearned: {
      "zh-hant": `學會 ${goal} 個單字。`,
      ja: `${goal} 個の単語を習得。`,
      ko: `${goal}개의 단어를 학습.`,
      es: `Aprende ${goal} palabras.`,
    },
    srs: {
      "zh-hant": `${goal} 個字進入長期記憶（複習 3 次以上）。`,
      ja: `${goal} 語が長期記憶に定着（3 回以上復習）。`,
      ko: `${goal}개의 단어가 장기 기억에 정착 (3회 이상 복습).`,
      es: `${goal} palabras en memoria a largo plazo (3+ repasos).`,
    },
    customWords: {
      "zh-hant": `自訂庫累計 ${goal} 字。`,
      ja: `カスタム単語帳に累計 ${goal} 語。`,
      ko: `커스텀 단어집 누적 ${goal}어.`,
      es: `Acumula ${goal} palabras en bibliotecas personales.`,
    },
    rankTier: {
      "zh-hant": goal === 7 ? "週排名達到最高段位。" : `週排名段位達到 ${goal}。`,
      ja: goal === 7 ? "週間ランキング最高ランクに到達。" : `週間ランキングでランク ${goal} に到達。`,
      ko: goal === 7 ? "주간 랭킹 최고 단계 도달." : `주간 랭킹 ${goal}단계 도달.`,
      es: goal === 7 ? "Alcanza el rango semanal máximo." : `Alcanza el rango semanal ${goal}.`,
    },
  };
  const langKey = (lang === "zh-tw" || lang === "zh-hk" || lang === "zh-hant") ? "zh-hant" : lang;
  return T[catId]?.[langKey] || T[catId]?.["zh-hant"] || "";
}

// 成就 tier 名稱：每個分類提供各語言版本（5 語）
// 順序與 tier index 對應；不夠的 tier 用 fallback「分類名 + 羅馬數字」
const ACH_TIER_NAMES = {
  correct: {
    "zh-Hant": ["初斬之刃", "百鍛劍徒", "千答斬", "破軍劍聖", "斷罪之刃", "千刃審判官"],
    ja: ["初斬の刃", "百鍛剣徒", "千答の斬", "破軍剣聖", "断罪の刃", "千刃の審判者"],
    ko: ["첫 베기의 칼", "백련검도", "천답의 일도", "파군검성", "단죄의 칼날", "천검의 심판자"],
    es: ["Filo Inicial", "Acero Centenario", "Mil Tajos", "Espada Quebrarmados", "Filo de Condena", "Juez de Mil Filos"],
  },
  combo: {
    "zh-Hant": ["三重共鳴", "連擊火苗", "不熄火誓者", "不斷連擊的誓約者", "三十連環的魔導", "永燃連鎖"],
    ja: ["三重共鳴", "連撃の火種", "不滅の誓い", "連撃の誓約者", "三十連環の魔導", "永遠の連鎖"],
    ko: ["삼중 공명", "연격의 불씨", "꺼지지 않는 맹세", "연격의 서약자", "삼십 연환 마도", "영원의 연쇄"],
    es: ["Triple Resonancia", "Chispa Encadenada", "Llama Eterna", "Jurador de Cadenas", "Magia de 30 Eslabones", "Cadena Eterna"],
  },
  streak: {
    "zh-Hant": ["晨星初見者", "三日盟誓者", "晨星巡禮者", "雙週曙光守望", "月相守誓者", "雙月儀典執行者", "百日不熄之燭"],
    ja: ["朝星の初見", "三日の盟約者", "朝星の巡礼者", "双週の曙光守", "月相の誓い", "双月の儀典執行者", "百日の灯"],
    ko: ["새벽별의 첫 만남", "삼일 맹세자", "새벽별 순례자", "이주 여명의 수호자", "월상 서약자", "쌍월 의식 집행자", "백일의 등불"],
    es: ["Primer Lucero", "Pacto de 3 Días", "Peregrino del Lucero", "Vigía de Alba (2 sem)", "Jurado Lunar", "Ejecutor Bilunar", "Llama Centenaria"],
  },
  login: {
    "zh-Hant": ["七日刻印者", "半月時術士", "時之門守望者", "雙月年代記者", "百日刻紋師", "時光迴廊掌管者"],
    ja: ["七日の刻印者", "半月の時術士", "時の門の守護者", "双月の年代記者", "百日の刻紋師", "時の回廊の主"],
    ko: ["7일 각인자", "보름의 시술사", "시간의 문지기", "쌍월 연대기 기록자", "백일 각문사", "시간 회랑의 주인"],
    es: ["Marcador de 7 Días", "Cronomago Quincenal", "Guardián del Portal", "Cronista Bilunar", "Tallador Centenario", "Señor del Pasillo Temporal"],
  },
  level: {
    "zh-Hant": ["破殼的初階勇者"],
    ja: ["殻を破る勇者"],
    ko: ["껍질을 깬 용사"],
    es: ["Héroe que Rompe el Cascarón"],
  },
  monster: {
    "zh-Hant": ["初討伐者", "魔物討伐錄", "十獸鎮壓者", "深淵獵犬", "魔境征討者", "百獸殲滅將"],
    ja: ["初討伐者", "魔物討伐録", "十獣を制す者", "深淵の猟犬", "魔境の征討者", "百獣殲滅将"],
    ko: ["첫 토벌자", "마물 토벌록", "열 짐승의 진압자", "심연의 사냥개", "마경 정벌자", "백수 섬멸장"],
    es: ["Primer Cazador", "Crónica de Monstruos", "Aplastador de Diez", "Sabueso del Abismo", "Conquistador del Yermo", "General de Cien Bestias"],
  },
  import: {
    "zh-Hant": ["單字抄寫員", "秘典編纂者", "藏經閣管理員", "詞海書記官"],
    ja: ["単語写字生", "秘典編纂者", "蔵経閣管理者", "詞海書記官"],
    ko: ["단어 필사가", "비전 편찬자", "장경각 관리자", "어해 서기관"],
    es: ["Escriba de Palabras", "Editor de Códices", "Bibliotecario", "Secretario del Mar de Palabras"],
  },
  review: {
    "zh-Hant": ["終章試煉突破者", "三試煉征服者", "七門賢者"],
    ja: ["終章試練の突破者", "三試練の征服者", "七門の賢者"],
    ko: ["최종장 시련 돌파자", "삼시련 정복자", "일곱 문의 현자"],
    es: ["Superador del Capítulo Final", "Conquistador de 3 Pruebas", "Sabio de las 7 Puertas"],
  },
  totalLearned: {
    "zh-Hant": ["詞之雛鳥", "辭典初心者", "字海游者", "詞韻吟者", "辭海航行士", "千字咒紋師"],
    ja: ["詞の雛鳥", "辞典の初心者", "字海の游者", "詞韻の吟唱者", "辞海の航海士", "千字咒紋師"],
    ko: ["단어의 새 새끼", "사전 초심자", "어해 유랑자", "운율 음창자", "어해 항해사", "천자 주문사"],
    es: ["Pájaro Léxico", "Aprendiz del Diccionario", "Vagabundo del Mar Léxico", "Bardo Rítmico", "Navegante Léxico", "Mil Glifos Mágicos"],
  },
  srs: {
    "zh-Hant": ["回溯之徒", "時序咒文家", "永世記憶者", "記憶迴廊主"],
    ja: ["回溯の徒", "時序の咒文家", "永遠の記憶者", "記憶回廊の主"],
    ko: ["회상의 도제", "시간 주문사", "영원의 기억자", "기억 회랑의 주인"],
    es: ["Discípulo del Recuerdo", "Cronomántico", "Memoria Eterna", "Señor del Pasillo Mental"],
  },
  customWords: {
    "zh-Hant": ["私家筆記初稿", "魔導筆記持有者", "私人辭海編纂者", "詞冊收藏家"],
    ja: ["私家ノート初稿", "魔導ノートの所持者", "私辞海の編纂者", "詞冊収集家"],
    ko: ["개인 노트 초고", "마도서 소지자", "개인 어해 편찬자", "단어집 수집가"],
    es: ["Primer Borrador", "Portador de Notas Arcanas", "Editor de Léxico Personal", "Coleccionista de Códices"],
  },
  rankTier: {
    "zh-Hant": ["銅環見習騎士", "銀頁誓約者", "霜刃巡獵官", "聖紋守城將", "龍脊遠征侯", "星冠大賢王"],
    ja: ["銅環の見習騎士", "銀頁の誓約者", "霜刃の巡猟官", "聖紋の城塞守", "竜脊の遠征侯", "星冠の大賢王"],
    ko: ["동환 견습기사", "은빛 서약자", "서리칼날 순찰관", "성문 성채수호장", "용등성이 원정후", "별왕관 대현왕"],
    es: ["Caballero del Aro de Cobre", "Juramentado de Hoja Plateada", "Montaraz Filoescarcha", "Guardián del Sello", "Margrave de Espinadragón", "Alto Sabio Coronoestelar"],
  },
};

const ACH_FALLBACK_LABELS = {
  correct: { "zh-Hant": "答題劍徽", ja: "正解の剣章", ko: "정답 검장", es: "Emblema de aciertos", en: "Correct Emblem" },
  combo: { "zh-Hant": "連擊誓印", ja: "連撃の誓印", ko: "연격 맹세장", es: "Sello de racha", en: "Combo Seal" },
  streak: { "zh-Hant": "晨星盟約", ja: "朝星の盟約", ko: "새벽별 서약", es: "Pacto del lucero", en: "Morningstar Pact" },
  login: { "zh-Hant": "時光刻印", ja: "時の刻印", ko: "시간 각인", es: "Marca temporal", en: "Time Mark" },
  level: { "zh-Hant": "升級勇者", ja: "昇級勇者", ko: "승급 용사", es: "Héroe ascendido", en: "Ranked Hero" },
  monster: { "zh-Hant": "討伐徽章", ja: "討伐徽章", ko: "토벌 휘장", es: "Insignia de caza", en: "Hunt Badge" },
  import: { "zh-Hant": "秘典書記", ja: "秘典書記", ko: "비전 서기관", es: "Escriba arcano", en: "Arcane Scribe" },
  review: { "zh-Hant": "試煉賢者", ja: "試練の賢者", ko: "시련의 현자", es: "Sabio de pruebas", en: "Trial Sage" },
  totalLearned: { "zh-Hant": "詞海旅人", ja: "詞海の旅人", ko: "어해 여행자", es: "Viajero léxico", en: "Lexicon Traveler" },
  srs: { "zh-Hant": "記憶術士", ja: "記憶術士", ko: "기억 술사", es: "Mago de memoria", en: "Memory Mage" },
  customWords: { "zh-Hant": "私庫編纂者", ja: "私庫の編纂者", ko: "개인 서고 편찬자", es: "Editor personal", en: "Personal Archivist" },
  rankTier: { "zh-Hant": "週榜段位", ja: "週間ランク", ko: "주간 등급", es: "Rango semanal", en: "Weekly Rank" },
};

// 取得分類 categoryId 第 tierIndex 個 tier 的本地化名稱
function achTierName(catId, tierIndex) {
  const lang = String(state.native || "zh-Hant");
  const list = ACH_TIER_NAMES[catId]?.[lang] || ACH_TIER_NAMES[catId]?.["zh-Hant"];
  if (Array.isArray(list) && list[tierIndex]) return list[tierIndex];
  const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"][tierIndex] || `T${tierIndex + 1}`;
  const label = ACH_FALLBACK_LABELS[catId]?.[lang] || ACH_FALLBACK_LABELS[catId]?.["zh-Hant"] || catId;
  return `${label} ${roman}`;
}

function achievementKey(catId, tierIndex) {
  return `${catId}:${tierIndex}`;
}

// 輔助：把 [goal...] 與 catId 轉成完整 tier 物件陣列
function makeTiers(catId, goals) {
  return goals.map((goal, idx) => ({
    key: achievementKey(catId, idx),
    goal,
    name: achTierName(catId, idx),
    condition: achConditionTemplate(catId, goal),
  }));
}

function achievementDefinitions() {
  const a = state.achievements;
  const streak = state.streakDays || 0;
  const totalLearned = Object.values(state.goalProfiles || {})
    .reduce((sum, p) => sum + (p.learned?.length || 0), 0);
  const customWordCount = (state.customLibraries || [])
    .reduce((sum, lib) => sum + (lib.words?.length || 0), 0);
  const srsMastered = Object.values(state.goalProfiles || {})
    .reduce((sum, p) => sum + Object.values(p.srs || {}).filter((e) => (e.reps || 0) >= 3).length, 0);
  const playerRankTier = state.rankTier || 1;
  return [
    { id: "correct", label: t("achTotalCorrect"), value: a.totalCorrect, icon: "sword",
      tiers: makeTiers("correct", [10, 50, 100, 300, 600, 1000]) },
    { id: "combo", label: t("achBestCombo"), value: a.bestCombo, icon: "flame",
      tiers: makeTiers("combo", [3, 5, 10, 20, 30, 50]) },
    { id: "streak", label: t("achLoginStreak"), value: streak, icon: "sun",
      tiers: makeTiers("streak", [1, 3, 7, 14, 30, 60, 100]) },
    { id: "login", label: t("achTotalLogin"), value: a.totalLoginDays, icon: "hourglass",
      tiers: makeTiers("login", [7, 14, 30, 60, 100, 200]) },
    { id: "level", label: t("achFirstLevel"), value: a.firstLevelUp ? 1 : 0, icon: "crown",
      tiers: makeTiers("level", [1]) },
    { id: "monster", label: t("achMonster"), value: a.monstersDefeated, icon: "monster",
      tiers: makeTiers("monster", [1, 3, 10, 25, 50, 100]) },
    { id: "import", label: t("importWords"), value: a.importedLibraries, icon: "book",
      tiers: makeTiers("import", [1, 3, 5, 10]) },
    { id: "review", label: t("review"), value: a.grandReviews, icon: "gate",
      tiers: makeTiers("review", [1, 3, 7]) },
    { id: "totalLearned", label: t("achTotalLearned"), value: totalLearned, icon: "book",
      tiers: makeTiers("totalLearned", [10, 50, 100, 300, 600, 1000]) },
    { id: "srs", label: t("achSrs"), value: srsMastered, icon: "hourglass",
      tiers: makeTiers("srs", [5, 30, 100, 300]) },
    { id: "customWords", label: t("achCustomWords"), value: customWordCount, icon: "book",
      tiers: makeTiers("customWords", [20, 100, 500, 2000]) },
    { id: "rankTier", label: t("achRankTier"), value: playerRankTier, icon: "crown",
      tiers: makeTiers("rankTier", [2, 3, 4, 5, 6, 7]) },
  ];
}

function achievementGroups() {
  return achievementDefinitions().map((def) => {
    const tiers = def.tiers.map((tier) => ({ ...tier, done: def.value >= tier.goal }));
    const locked = tiers.filter((tier) => !tier.done);
    const earned = tiers.filter((tier) => tier.done);
    const next = locked[0] || tiers[tiers.length - 1];
    return {
      ...def,
      tiers,
      earned,
      locked,
      next,
      complete: locked.length === 0,
      progress: locked.length ? Math.min(100, Math.round((def.value / next.goal) * 100)) : 100,
      heading: def.label,
      count: `${def.value}/${next.goal}`,
      label: `${def.label} ${def.value}/${next.goal}`,
    };
  });
}

function achievementKeyFromLegacyTitle(title) {
  const text = String(title || "");
  if (!text) return "";
  for (const [catId, byLang] of Object.entries(ACH_TIER_NAMES)) {
    for (const list of Object.values(byLang)) {
      const tierIndex = Array.isArray(list) ? list.indexOf(text) : -1;
      if (tierIndex >= 0) return achievementKey(catId, tierIndex);
    }
  }
  return "";
}

function normalizeAchievementKey(value) {
  const text = String(value || "");
  if (!text) return "";
  if (/^[A-Za-z]+:\d+$/.test(text)) return text;
  return achievementKeyFromLegacyTitle(text);
}

function achievementBadgeMeta(value) {
  const key = normalizeAchievementKey(value);
  if (!key) return null;
  const group = achievementDefinitions().find((def) => def.tiers.some((tier) => tier.key === key));
  if (!group) return null;
  const tierIndex = group.tiers.findIndex((item) => item.key === key);
  const tier = group.tiers[tierIndex];
  return {
    id: group.id,
    icon: group.icon,
    key,
    title: tier?.name || key,
    label: group.label,
    done: true,
    tierIndex: Math.max(0, tierIndex),
  };
}

function achievementBadges() {
  return achievementGroups().map((group) => ({
    ...group,
    done: group.complete,
  }));
}

function checkAchievementUnlocks() {
  const rawCompleted = state.completedAchievements || [];
  const completed = new Set(rawCompleted.map(normalizeAchievementKey).filter(Boolean));
  const before = completed.size;
  achievementBadgesRaw().forEach((def) => {
    def.tiers.forEach((tier) => {
      if (def.value >= tier.goal) completed.add(tier.key);
    });
  });
  state.completedAchievements = Array.from(completed);
  const equippedKey = normalizeAchievementKey(state.equippedTitle);
  const changedStoredKeys = state.completedAchievements.length !== rawCompleted.length
    || state.completedAchievements.some((key, index) => key !== rawCompleted[index]);
  const changedEquippedKey = equippedKey !== state.equippedTitle;
  if (equippedKey !== state.equippedTitle) state.equippedTitle = equippedKey;
  if (completed.size > before || changedStoredKeys || changedEquippedKey) {
    saveState();
    if (completed.size > before) triggerCelebrate();
  }
}

function achievementBadgesRaw() {
  return achievementDefinitions().map((def) => ({ value: def.value, tiers: def.tiers.map((tier) => ({ goal: tier.goal, key: tier.key })) }));
}

// 每個分類有 6 個 tier 的不同 SVG mark；tier 高的圖案更繁複
const BADGE_VARIANTS = {
  sword: [
    '<path d="M64 18l8 50-8 8-8-8z"/><path d="M48 60h32v6h-32z"/>',
    '<path d="M40 24c30 4 44 36 44 64l-12-4c-8-26-22-46-32-60z"/>',
    '<path d="M52 16h24v74h-24z"/><path d="M40 30h48v8h-48z"/><circle cx="64" cy="100" r="6"/>',
    '<path d="M64 14l6 84-6 6-6-6z"/><path d="M48 28h32v8h-32z"/>',
    '<path d="M30 54c0-22 28-32 36-32 8 0 16 10 24 26-8 28-50 30-60 6z"/><path d="M58 80v28h12V80z"/>',
    '<path d="M64 12l14 70 14 30-28-14-28 14 14-30z"/><path d="M44 38h40v8h-40z"/><circle cx="64" cy="108" r="5"/>',
  ],
  flame: [
    '<path d="M64 30c12 14-4 22 4 36 10-4 12-12 8-22 10 14 4 36-12 36-22 0-26-22-12-32 0 8 6 8 12-18z"/>',
    '<path d="M50 28c8 16-12 24 0 36 8-2 10-10 8-18 12 18 4 36-12 36-20 0-28-26-12-38 0 8 8 10 16-16z"/><path d="M86 36c4 8-6 16 0 22 6 0 8-6 4-12 8 8 4 22-8 22-10 0-12-12-4-20z"/>',
    '<path d="M64 14c14 18-10 26 0 44 14-4 16-16 8-30 12 18 4 50-16 50-26 0-30-32-12-46 0 12 12 12 20-18z"/>',
    '<path d="M64 14c14 18-10 26 0 44 14-4 16-16 8-30 12 18 4 50-16 50-26 0-30-32-12-46 0 12 12 12 20-18z"/><circle cx="64" cy="98" r="6"/>',
    '<circle cx="64" cy="62" r="32" fill="none"/><path d="M64 22c12 16-8 26 0 42 12-4 14-14 8-26 12 14 4 42-16 42-22 0-26-28-10-42 0 10 10 12 18-16z"/>',
    '<path d="M16 64h12M100 64h12M64 16v12M64 100v12"/><circle cx="64" cy="62" r="34" fill="none"/><path d="M64 28c12 16-8 26 0 42 12-4 14-14 8-26 12 14 4 42-16 42-22 0-26-28-10-42 0 10 10 12 18-16z"/>',
  ],
  sun: [
    '<circle cx="64" cy="64" r="22"/><path d="M64 22v14M64 92v14M22 64h14M92 64h14"/>',
    '<circle cx="64" cy="64" r="22"/><path d="M64 22v14M64 92v14M22 64h14M92 64h14M34 34l10 10M84 84l10 10M94 34l-10 10M44 84l-10 10"/>',
    '<path d="M40 64a24 24 0 1 0 48 0 18 18 0 1 1-48 0z"/>',
    '<circle cx="46" cy="64" r="16"/><circle cx="82" cy="64" r="16"/>',
    '<circle cx="64" cy="64" r="20"/><circle cx="64" cy="20" r="3"/><circle cx="64" cy="108" r="3"/><circle cx="20" cy="64" r="3"/><circle cx="108" cy="64" r="3"/><circle cx="36" cy="36" r="3"/><circle cx="92" cy="92" r="3"/><circle cx="92" cy="36" r="3"/><circle cx="36" cy="92" r="3"/>',
    '<circle cx="64" cy="64" r="14"/><circle cx="64" cy="64" r="28" fill="none"/><circle cx="64" cy="64" r="44" fill="none" stroke-dasharray="6 6"/>',
  ],
  hourglass: [
    '<path d="M34 22h60M34 106h60M44 28c0 26 40 28 40 36s-40 10-40 38M84 28c0 26-40 28-40 36s40 10 40 38"/>',
    '<circle cx="64" cy="64" r="32" fill="none"/><path d="M64 36v28l18 12"/>',
    '<path d="M30 64a34 34 0 1 1 68 0 34 34 0 1 1-68 0"/><path d="M64 64a18 18 0 1 1 36 0 18 18 0 1 1-36 0M64 64a18 18 0 1 0-36 0"/>',
    '<circle cx="40" cy="64" r="16"/><circle cx="88" cy="64" r="16"/><path d="M56 64h16"/>',
    '<path d="M64 18l28 16v60l-28 16-28-16V34z" fill="none"/><circle cx="64" cy="64" r="10"/><path d="M64 64l16-10"/>',
    '<circle cx="64" cy="64" r="40" fill="none"/><circle cx="64" cy="64" r="26" fill="none"/><circle cx="64" cy="64" r="12" fill="none"/><circle cx="64" cy="64" r="3"/>',
  ],
  crown: [
    '<path d="M22 92h84l-6-46-22 20-14-32-14 32-22-20z"/>',
    '<path d="M22 92h84l-6-46-22 20-14-32-14 32-22-20z"/><circle cx="64" cy="36" r="5"/><circle cx="32" cy="58" r="4"/><circle cx="96" cy="58" r="4"/>',
    '<path d="M22 92h84l-6-50-22 22-14-36-14 36-22-22z"/><path d="M22 100h84v6h-84z"/><circle cx="64" cy="32" r="6"/>',
    '<path d="M22 92h84l-6-50-22 22-14-36-14 36-22-22z"/><path d="M22 100h84v8h-84z"/><path d="M64 26l4 8h8l-6 6 2 8-8-4-8 4 2-8-6-6h8z"/>',
    '<path d="M22 90h84l-6-50-22 22-14-36-14 36-22-22z"/><path d="M22 98h84v10h-84z"/><path d="M64 22l5 10 10 1-8 8 2 10-9-5-9 5 2-10-8-8 10-1z"/><circle cx="32" cy="52" r="5"/><circle cx="96" cy="52" r="5"/>',
    '<path d="M14 88h100l-8-58-26 24-16-40-16 40-26-24z"/><path d="M14 98h100v12h-100z"/><path d="M64 16l6 14 14 2-10 10 2 14-12-7-12 7 2-14-10-10 14-2z"/><circle cx="30" cy="50" r="6"/><circle cx="98" cy="50" r="6"/><circle cx="64" cy="60" r="6"/>',
  ],
  monster: [
    '<circle cx="64" cy="68" r="30"/><circle cx="52" cy="60" r="5" fill="#fff"/><circle cx="76" cy="60" r="5" fill="#fff"/>',
    '<path d="M30 72c0-22 16-40 34-40s34 18 34 40c0 24-68 24-68 0z"/><circle cx="52" cy="62" r="5" fill="#fff"/><circle cx="76" cy="62" r="5" fill="#fff"/><path d="M50 82l8 4 6-4 6 4 8-4"/>',
    '<path d="M28 76c0-26 18-46 36-46s36 20 36 46c0 14-72 14-72 0z"/><path d="M44 30l8 16M84 30l-8 16"/><circle cx="50" cy="64" r="5" fill="#fff"/><circle cx="78" cy="64" r="5" fill="#fff"/>',
    '<path d="M22 92c0-30 20-58 42-58s42 28 42 58z"/><circle cx="50" cy="64" r="6" fill="#fff"/><circle cx="78" cy="64" r="6" fill="#fff"/><path d="M50 82l6-8h16l6 8"/><path d="M28 92l-8 12M100 92l8 12"/>',
    '<path d="M20 96c0-34 22-66 44-66s44 32 44 66z"/><path d="M40 34l-8-18M88 34l8-18"/><circle cx="48" cy="60" r="7" fill="#fff"/><circle cx="80" cy="60" r="7" fill="#fff"/><circle cx="48" cy="60" r="3"/><circle cx="80" cy="60" r="3"/><path d="M46 86l8-10h20l8 10"/>',
    '<path d="M14 102c0-40 24-78 50-78s50 38 50 78z"/><path d="M40 30l-12-22M88 30l12-22"/><circle cx="48" cy="60" r="8" fill="#fff"/><circle cx="80" cy="60" r="8" fill="#fff"/><circle cx="48" cy="60" r="4"/><circle cx="80" cy="60" r="4"/><path d="M40 92l10-12h28l10 12"/><path d="M52 84l-2 8M62 84l-2 8M72 84l-2 8M82 84l-2 8"/>',
  ],
  book: [
    '<path d="M22 24h38c12 0 18 6 18 18v62c0-12-8-18-20-18H22z M106 24H78v80c0-12 8-18 20-18h8z"/>',
    '<path d="M28 30c12-6 28-6 36 0v68c-8-6-24-6-36 0z M100 30c-12-6-28-6-36 0v68c8-6 24-6 36 0z"/><path d="M40 50h12M40 64h12M40 78h10M76 50h12M76 64h12M76 78h10"/>',
    '<path d="M20 100l44-12 44 12V36L64 24 20 36z"/><path d="M64 24v76"/><circle cx="64" cy="62" r="4"/>',
    '<path d="M18 28h32v76h-32zM50 28h32v76h-32zM82 28h28v76h-28z"/>',
    '<path d="M64 12l44 22-44 22-44-22z"/><path d="M28 50v50l36 18 36-18V50"/><path d="M44 60h40M44 76h40M44 92h28"/>',
    '<path d="M22 24h36c10 0 16 6 16 18v62c0-12-6-18-18-18H22z M106 24H74v80c0-12 6-18 18-18h14z"/><path d="M44 40h20M44 54h20M44 68h16M84 40h16M84 54h16M84 68h12"/><path d="M64 18l4 8 8 1-6 6 2 8-8-4-8 4 2-8-6-6 8-1z"/>',
  ],
  gate: [
    '<path d="M28 106V52c0-26 72-26 72 0v54M28 106h72"/>',
    '<path d="M28 106V52c0-26 72-26 72 0v54M44 106V60c0-14 40-14 40 0v46"/>',
    '<path d="M22 110V46c0-30 84-30 84 0v64M22 110h84M36 80c0-22 56-22 56 0"/>',
    '<path d="M22 110V40c0-32 84-32 84 0v70M22 110h84M40 110V64c0-16 48-16 48 0v46M64 110V80"/>',
    '<path d="M18 110V36c0-34 92-34 92 0v74M40 110V58c0-18 48-18 48 0v52M62 110V80"/><circle cx="64" cy="40" r="6"/>',
    '<path d="M14 110V32c0-36 100-36 100 0v78"/><path d="M38 110V60c0-20 52-20 52 0v50"/><path d="M62 110V80a8 8 0 1 1 4 0v30"/><path d="M14 110h100"/><path d="M64 24l4 8 10 1-8 8 2 10-8-4-8 4 2-10-8-8 10-1z"/>',
  ],
};

function badgeSvg(icon, done, tierIndex = 0) {
  const variants = BADGE_VARIANTS[icon] || BADGE_VARIANTS.crown;
  const idx = Math.max(0, Math.min(variants.length - 1, tierIndex || 0));
  const mark = variants[idx];
  // 顏色交給 CSS（.badge / .badge.is-done），日夜主題自動跟著換
  return `<svg class="badge ${done ? "is-done" : ""}" viewBox="0 0 128 128" aria-hidden="true"><path class="badge-plate" d="M64 8l49 28v56l-49 28-49-28V36z" stroke-width="6"/><g class="badge-mark" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${mark}</g></svg>`;
}

// 萬能管理員面板（本機限定，純測試用，文字只做中文）
function adminGroups() {
  return [
    { title: "經驗與段位", items: [
      ["xp100", "+100 經驗"], ["xp500", "+500 經驗"], ["level-up", "升一級"],
      ["level-next5", "升到下一個 5 的倍數級（會遇到怪物）"], ["rank-tier", "週排名稱號升一階"],
    ] },
    { title: "學習進度", items: [
      ["today-done", "完成今天的 10 個字（開放每日測驗）"], ["learn60", "學到 60%（開放總複習）"],
      ["learn-all", "這個目標全部學完"], ["weak10", "隨機加 10 個字進弱點池"], ["weak-clear", "清空弱點池"],
      ["srs-due", "讓 10 個學過的字今天到期複習"],
    ] },
    { title: "測驗", items: [
      ["open-daily", "直接開每日測驗"], ["open-weekly", "直接開週測驗"], ["open-review", "直接開總複習"],
      ["weekly-notice", "跳出「週測驗開放」通知"],
    ] },
    { title: "打怪與道具（點怪物名稱：設成頭目並開週測驗）", items: [
      ["items", "道具各 +9"], ["items-clear", "清空道具"], ["battle", "隨機頭目（開週測驗）"],
      ...monsterRoster().map((monster) => [`monster:${monster.id}`, monster.name]),
    ] },
    { title: "時間與登入", items: [
      ["skip-day", "跳到明天"], ["back-today", "回到真正的今天"], ["streak7", "連續登入改成 7 天"],
      ["stamp-today", "蓋今天的章"], ["freeze-plus", "給一張補簽"], ["miss-yesterday", "做出「昨天漏簽」（測補簽）"],
    ] },
    { title: "成就", items: [
      ["ach-all", "成就數值全部拉滿"],
    ] },
  ];
}

function renderAdmin() {
  if (!canUseAdmin()) {
    navigateTo("dashboard", { clearHistory: true, pushHistory: false });
    return renderDashboard();
  }
  const profile = activeProfile();
  const itemTotal = battleItems().reduce((sum, item) => sum + (state.inventory[item.id] || 0), 0);
  return appShell(`
    <section class="panel admin-panel">
      <div class="page-head">
        <div>
          <span class="eyebrow">localhost</span>
          <h2 class="page-title">${t("adminLogin")}</h2>
        </div>
        <button class="btn secondary" data-action="back">${backButtonLabel()}</button>
      </div>
      <dl class="readout admin-readout">
        <div><dt>日期</dt><dd>${todayKey()}${state.dayOffset ? `（+${state.dayOffset} 天）` : ""}</dd></div>
        <div><dt>段位</dt><dd>Lv.${getPlayerRank()}</dd></div>
        <div><dt>經驗值</dt><dd>${state.xp || 0}</dd></div>
        <div><dt>連續／累計登入</dt><dd>${state.streakDays || 0}／${state.achievements?.totalLoginDays || 0}</dd></div>
        <div><dt>學過／弱點</dt><dd>${profile.learned.length}／${profile.weak.length}</dd></div>
        <div><dt>已學比例</dt><dd>${getLearnedPercent()}%</dd></div>
        <div><dt>道具</dt><dd>${itemTotal}</dd></div>
      </dl>
      ${toast ? `<div class="toast" role="status">${toast}</div>` : ""}
      <div class="admin-groups">
        ${adminGroups().map((group) => `
          <section class="admin-group">
            <h3>${group.title}</h3>
            <div class="admin-keys">
              ${group.items.map(([action, label]) => `<button class="btn secondary small" data-admin="${action}">${escapeHtml(label)}</button>`).join("")}
            </div>
          </section>
        `).join("")}
        <section class="admin-group">
          <h3>存檔</h3>
          <div class="admin-keys">
            <button class="btn secondary small danger" data-admin="admin-clear">${t("adminClear")}</button>
          </div>
        </section>
      </div>
    </section>
  `);
}

function bindActions() {
  mountGoogleSignInButton();
  document.querySelectorAll("[data-action='native']").forEach((select) => {
    select.addEventListener("change", (event) => {
      state.native = event.target.value;
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-action='library']").forEach((select) => {
    select.addEventListener("change", (event) => {
      state.activeLibraryId = event.target.value;
      studySession = null;
      stopActiveQuiz();
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-switch-library]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeLibraryId = button.dataset.switchLibrary;
      studySession = null;
      stopActiveQuiz();
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-goal]").forEach((button) => {
    button.addEventListener("click", () => {
      const goal = button.dataset.goal;
      selectedGoal = goal;
      render();
    });
  });
  document.querySelectorAll("[data-active-goal]").forEach((button) => {
    button.addEventListener("click", () => switchActiveGoal(button.dataset.activeGoal));
  });
  document.querySelectorAll("[data-add-goal]").forEach((button) => {
    button.addEventListener("click", () => {
      const goal = button.dataset.addGoal;
      state.userGoals = Array.from(new Set([...(state.userGoals || []), goal]));
      switchActiveGoal(goal);
    });
  });
  document.querySelectorAll("[data-action='local-test-login']").forEach((button) => {
    button.addEventListener("click", () => {
      const name = document.querySelector("#nameInput")?.value?.trim() || t("traveler");
      switchLocalTestAccount(name);
      render();
    });
  });
  // 不用登入就能開始：用這台裝置上的訪客帳號（進度一樣存在瀏覽器裡）
  document.querySelectorAll("[data-action='guest-start']").forEach((button) => {
    button.addEventListener("click", () => {
      switchUserAccount({ id: "local:guest", provider: "guest", name: t("traveler") });
      render();
    });
  });
  document.querySelectorAll("[data-action='admin-login']").forEach((button) => {
    button.addEventListener("click", () => {
      if (!isLocalHost()) return;
      switchUserAccount({ id: "local:admin", provider: "local-admin", name: t("adminLogin"), isAdmin: true });
      render();
    });
  });
  document.querySelectorAll("[data-action='signout']").forEach((button) => {
    button.addEventListener("click", () => {
      state.user = null;
      saveState();
      navigateTo("login", { clearHistory: true, pushHistory: false });
      stopActiveQuiz();
      studySession = null;
          render();
    });
  });
  document.querySelectorAll("[data-action='admin']").forEach((button) => {
    button.addEventListener("click", () => {
      if (!canUseAdmin()) return;
      navigateTo("admin");
      render();
    });
  });
  document.querySelectorAll("[data-admin]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!canUseAdmin()) return;
      runAdminAction(button.dataset.admin);
    });
  });
  document.querySelectorAll("[data-quiz-answer]").forEach((button) => {
    button.addEventListener("click", () => answerQuiz(button.dataset.quizAnswer, button.dataset.correct));
  });
  document.querySelectorAll("[data-action='back']").forEach((button) => {
    button.addEventListener("click", () => {
      if (screen === "study" && studySession?.phase === "quiz" && studySession.mode !== "weak") {
        studySession.phase = "preview";
        studySession.index = 0;
        toast = "";
        render();
        return;
      }
      goBack();
    });
  });
  document.querySelectorAll("[data-action='dashboard']").forEach((button) => {
    button.addEventListener("click", () => {
      navigateTo("dashboard", { clearHistory: true, pushHistory: false });
      studySession = null;
      stopActiveQuiz();
      toast = "";
      render();
    });
  });
  document.querySelectorAll("[data-action='dismiss-reward']").forEach((button) => {
    button.addEventListener("click", () => {
      state.rewardNotice = null;
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-action='dismiss-weekly-notice']").forEach((el) => {
    el.addEventListener("click", () => {
      dismissWeeklyNotice();
      render();
    });
  });
  document.querySelectorAll("[data-action='open-weekly-now']").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      dismissWeeklyNotice();
      navigateTo("weekly");
      stopActiveQuiz();
      toast = "";
      render();
    });
  });
  document.querySelectorAll("[data-show-card-word]").forEach((button) => {
    button.addEventListener("click", () => {
      cardModalWord = button.dataset.showCardWord;
      // 立刻 prefetch 該字資料，讓 modal 一打開就有完整例句/音標
      const item = findWord(cardModalWord);
      if (item) prefetchStudyWords([item]);
      render();
    });
  });
  document.querySelectorAll("[data-action='close-card-modal']").forEach((el) => {
    el.addEventListener("click", () => {
      cardModalWord = null;
      render();
    });
  });
  document.querySelectorAll("[data-action='study']").forEach((button) => {
    button.addEventListener("click", () => {
      const libraryId = currentStudyLibraryId();
      navigateTo("study");
      studySession = { phase: "loading", previewIndex: 0, words: [], libraryId, questions: [], index: 0, correct: 0 };
      toast = "";
      render();
      setTimeout(() => {
        studySession = createStudySession(libraryId);
        render();
      }, 0);
    });
  });
  document.querySelectorAll("[data-action='next-round']").forEach((button) => {
    button.addEventListener("click", () => {
      if (!window.confirm(t("confirmNextRound"))) return;
      const libraryId = currentStudyLibraryId();
      // 清掉當日鎖定 → 重新抽 10 個未做過的字
      state.dailyStudy = state.dailyStudy || {};
      state.dailyStudyCompleted = state.dailyStudyCompleted || {};
      delete state.dailyStudy[dailyStudyKey(libraryId)];
      delete state.dailyStudyCompleted[dailyStudyKey(libraryId)];
      saveState();
      navigateTo("study");
      studySession = { phase: "loading", previewIndex: 0, words: [], libraryId, questions: [], index: 0, correct: 0 };
      toast = "";
      render();
      setTimeout(() => {
        studySession = createStudySession(libraryId);
        render();
      }, 0);
    });
  });
  document.querySelectorAll("[data-action='next-round-reset']").forEach((button) => {
    button.addEventListener("click", () => {
      if (!window.confirm(t("confirmNextRoundReset"))) return;
      const libraryId = button.dataset.libraryId || null;
      // 清學習史 + 當日鎖定 → 整個字庫重新算未做
      resetStudyHistory(libraryId || null);
      saveState();
      navigateTo("study");
      studySession = { phase: "loading", previewIndex: 0, words: [], libraryId: libraryId || null, questions: [], index: 0, correct: 0 };
      toast = "";
      render();
      setTimeout(() => {
        studySession = createStudySession(libraryId || null);
        render();
      }, 0);
    });
  });
  document.querySelectorAll("[data-action='custom-study'], [data-action='custom-hub']").forEach((button) => {
    button.addEventListener("click", () => {
      navigateTo("custom-study-select");
      toast = "";
      render();
    });
  });
  document.querySelectorAll("[data-action='custom-library-view']").forEach((button) => {
    button.addEventListener("click", () => {
      viewingLibraryId = null; // 查看全部
      navigateTo("custom-library-view");
      toast = "";
      render();
    });
  });
  document.querySelectorAll("[data-start-custom-study]").forEach((button) => {
    button.addEventListener("click", () => {
      const libraryId = button.dataset.startCustomStudy;
      state.activeLibraryId = libraryId;
      saveState();
      navigateTo("study");
      studySession = { phase: "loading", previewIndex: 0, words: [], libraryId, questions: [], index: 0, correct: 0 };
      toast = "";
      render();
      setTimeout(() => {
        studySession = createStudySession(libraryId);
        render();
      }, 0);
    });
  });
  document.querySelectorAll("[data-open-custom-library]").forEach((button) => {
    button.addEventListener("click", () => {
      const libraryId = button.dataset.openCustomLibrary;
      viewingLibraryId = libraryId; // 只看這個庫
      state.activeLibraryId = libraryId;
      saveState();
      navigateTo("custom-library-view");
      toast = "";
      render();
    });
  });
  document.querySelectorAll("[data-refetch-library]").forEach((button) => {
    button.addEventListener("click", async () => {
      const libraryId = button.dataset.refetchLibrary;
      await refetchCustomLibrary(libraryId);
    });
  });
  document.querySelectorAll("[data-add-words-library]").forEach((button) => {
    button.addEventListener("click", async () => {
      await addWordsToLibrary(button.dataset.addWordsLibrary);
    });
  });
  document.querySelectorAll("[data-delete-library]").forEach((button) => {
    button.addEventListener("click", () => {
      const libraryId = button.dataset.deleteLibrary;
      if (!window.confirm(t("confirmDeleteLibrary"))) return;
      state.customLibraries = (state.customLibraries || []).filter((library) => library.id !== libraryId);
      if (state.activeLibraryId === libraryId) state.activeLibraryId = "built-in";
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-action='start-study-quiz']").forEach((button) => {
    button.addEventListener("click", () => {
      studySession.phase = "quiz";
      studySession.index = 0;
      render();
    });
  });
  document.querySelectorAll("[data-action='study-new-words']").forEach((button) => {
    button.addEventListener("click", () => {
      if (!window.confirm(t("confirmNextRound"))) return;
      const libraryId = studySession?.libraryId || null;
      state.dailyStudy = state.dailyStudy || {};
      state.dailyStudyCompleted = state.dailyStudyCompleted || {};
      delete state.dailyStudy[dailyStudyKey(libraryId)];
      delete state.dailyStudyCompleted[dailyStudyKey(libraryId)];
      saveState();
      studySession = createStudySession(libraryId);
      toast = "";
      render();
    });
  });
  document.querySelectorAll("[data-action='next-card']").forEach((button) => {
    button.addEventListener("click", () => moveCard(1));
  });
  document.querySelectorAll("[data-action='prev-card']").forEach((button) => {
    button.addEventListener("click", () => moveCard(-1));
  });
  document.querySelectorAll("[data-action='speak-word']").forEach((button) => {
    button.addEventListener("click", () => speakWord(button.dataset.word, Number(button.dataset.rate) || SPEAK_RATE_NORMAL));
  });
  document.querySelectorAll("[data-action='learned-words']").forEach((button) => {
    button.addEventListener("click", () => {
      learnedSearchQuery = "";
      navigateTo("learned-words");
      render();
    });
  });
  document.querySelectorAll("[data-learned-search]").forEach((input) => {
    input.addEventListener("input", (event) => {
      learnedSearchQuery = event.target.value || "";
      // 只更新列表區塊，避免整頁重 render 造成輸入框失焦
      const list = document.querySelector("#learnedWordsList");
      if (!list) return;
      list.innerHTML = learnedWordsListHtml();
      list.querySelectorAll("[data-action='speak-word']").forEach((button) => {
        button.addEventListener("click", () => speakWord(button.dataset.word));
      });
    });
  });
  document.querySelectorAll("[data-action='export-progress']").forEach((button) => {
    button.addEventListener("click", () => exportProgressFile());
  });
  document.querySelectorAll("[data-action='import-progress']").forEach((button) => {
    button.addEventListener("click", () => document.querySelector("#importProgressFile")?.click());
  });
  document.querySelectorAll("#importProgressFile").forEach((input) => {
    input.addEventListener("change", (event) => importProgressFile(event.target.files?.[0] || null));
  });
  document.querySelectorAll("[data-action='toggle-theme']").forEach((button) => {
    button.addEventListener("click", () => toggleTheme());
  });
  document.querySelectorAll("[data-card-swipe]").forEach((card) => {
    let startX = 0;
    card.addEventListener("touchstart", (event) => {
      startX = event.changedTouches[0].clientX;
    });
    card.addEventListener("touchend", (event) => {
      const deltaX = event.changedTouches[0].clientX - startX;
      if (deltaX > 45) moveCard(1);
      if (deltaX < -45) moveCard(-1);
    });
  });
  document.querySelectorAll("[data-action='daily']").forEach((button) => {
    button.addEventListener("click", () => {
      if (!dailyTestAvailable()) return;
      navigateTo("daily");
      stopActiveQuiz();
      toast = "";
      render();
    });
  });
  document.querySelectorAll("[data-action='weekly']").forEach((button) => {
    button.addEventListener("click", () => {
      if (!weeklyTestAvailable()) return;
      navigateTo("weekly");
      stopActiveQuiz();
      toast = "";
      render();
    });
  });
  document.querySelectorAll("[data-action='review']").forEach((button) => {
    button.addEventListener("click", () => {
      if (getLearnedPercent() < 60) return;
      navigateTo("review");
      stopActiveQuiz();
      toast = "";
      render();
    });
  });
  document.querySelectorAll("[data-action='import']").forEach((button) => {
    button.addEventListener("click", () => {
      navigateTo("import");
      toast = "";
      render();
    });
  });
  document.querySelectorAll("[data-action='save-import']").forEach((button) => {
    button.addEventListener("click", () => saveImportedLibrary());
  });
  document.querySelectorAll("#photoInput").forEach((input) => {
    input.addEventListener("change", (event) => {
      const file = event.target.files?.[0];
      const preview = document.querySelector("#photoPreview");
      if (file && preview) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
      }
    });
  });
  document.querySelectorAll("[data-action='weak']").forEach((button) => {
    button.addEventListener("click", () => {
      navigateTo("weak");
      render();
    });
  });
  document.querySelectorAll("[data-action='weak-train']").forEach((button) => {
    button.addEventListener("click", () => {
      const recent = button.dataset.recent ? button.dataset.recent.split("|") : [];
      studySession = createWeakTrainingSession(recent);
      navigateTo("study");
      toast = "";
      render();
    });
  });
  document.querySelectorAll("[data-quiz-item]").forEach((button) => {
    button.addEventListener("click", () => useQuizItem(button.dataset.quizItem));
  });
  document.querySelectorAll("[data-action='claim-level-loot']").forEach((button) => {
    button.addEventListener("click", () => claimLevelLoot());
  });
  document.querySelectorAll("[data-action='achievements']").forEach((button) => {
    button.addEventListener("click", () => {
      navigateTo("achievements");
      render();
    });
  });
  document.querySelectorAll("[data-action='use-freeze']").forEach((button) => {
    button.addEventListener("click", () => {
      useStreakFreeze();
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-action='progress']").forEach((button) => {
    button.addEventListener("click", () => {
      navigateTo("progress");
      render();
    });
  });
  document.querySelectorAll("[data-action='inventory']").forEach((button) => {
    button.addEventListener("click", () => {
      navigateTo("inventory");
      render();
    });
  });
  document.querySelectorAll("[data-achievement-group]").forEach((button) => {
    button.addEventListener("click", () => {
      const groupId = button.dataset.achievementGroup;
      achievementFocus = achievementFocus === groupId ? null : groupId;
      render();
    });
  });
  document.querySelectorAll("[data-equip-title]").forEach((button) => {
    button.addEventListener("click", () => {
      state.equippedTitle = button.dataset.equipTitle;
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-study-answer]").forEach((button) => {
    button.addEventListener("click", () => answerStudy(button.dataset.studyAnswer, button.dataset.correct));
  });
  document.querySelectorAll("[data-action='reset']").forEach((button) => {
    button.addEventListener("click", () => {
      if (!window.confirm(t("confirmReset"))) return;
      resetCurrentAccountProgress();
      render();
    });
  });
}

// 清除「目前帳號」在本機的進度（多帳號 store 裡其他帳號不受影響），回到登入頁
function resetCurrentAccountProgress() {
  if (saveStateTimer) {
    clearTimeout(saveStateTimer);
    saveStateTimer = null;
  }
  const STORE_KEY = "vocab-arcana-store";
  try {
    const store = JSON.parse(localStorage.getItem(STORE_KEY) || "{}") || {};
    const id = userKeyFor(state.user);
    if (store.users && id) delete store.users[id];
    store.activeUserId = null;
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
  state = loadState();
  migrateState();
  selectedGoal = "";
  stopActiveQuiz();
  studySession = null;
  navigateTo("login", { clearHistory: true, pushHistory: false });
}

function applyLoginReward() {
  const today = todayKey();
  if (state.lastLoginDate === today) return;
  const yesterdayDate = new Date(`${today}T00:00:00Z`);
  yesterdayDate.setUTCDate(yesterdayDate.getUTCDate() - 1);
  const yesterday = yesterdayDate.toISOString().slice(0, 10);
  state.streakDays = state.lastLoginDate === yesterday ? (state.streakDays || 0) + 1 : 1;
  state.lastLoginDate = today;
  state.achievements.totalLoginDays += 1;
  const rewardKey = state.streakDays % 7 === 0 ? "reward7" : state.streakDays % 5 === 0 ? "reward5" : state.streakDays % 3 === 0 ? "reward3" : "reward1";
  state.streakRewardKey = rewardKey;
  state.streakReward = t(rewardKey);
  const loot = rewardKey === "reward7" ? { bomb: 2, potion: 2 } : rewardKey === "reward5" ? { bomb: 1, potion: 1 } : rewardKey === "reward3" ? { sword: 1, potion: 1 } : { sword: 1 };
  addInventory(loot);
  state.rewardNotice = { title: t("itemReward"), items: formatLoot(loot) };
  // 獎勵改由 rewardNotice 視窗顯示，不再同時出 toast
}

function switchActiveGoal(goal) {
  state.activeGoal = goal;
  state.goal = goal;
  state.activeLibraryId = "built-in";
  ensureProfile(goal);
  stopActiveQuiz();
  studySession = null;
  navigateTo("dashboard");
  saveState();
  render();
}

// 今天的 10 個字直接標成學會（沒抽過就先抽），用來解鎖每日測驗
function adminCompleteToday() {
  const libraryId = currentStudyLibraryId();
  const key = dailyStudyKey(libraryId);
  state.dailyStudy = state.dailyStudy || {};
  if (!Array.isArray(state.dailyStudy[key]) || !state.dailyStudy[key].length) createStudySession(libraryId);
  const profile = activeProfile();
  const locked = state.dailyStudy[key] || [];
  profile.learned = Array.from(new Set([...(profile.learned || []), ...locked]));
  locked.forEach((wordText) => {
    profile.learnedLog[wordText] = todayKey();
  });
  state.dailyStudyCompleted = state.dailyStudyCompleted || {};
  state.dailyStudyCompleted[key] = true;
}

function adminLearnPercent(percent) {
  const profile = activeProfile();
  const source = uniqueWordObjects(studySourceForLibrary());
  const learnedSet = new Set(profile.learned || []);
  const need = Math.ceil(source.length * percent / 100) - source.filter((item) => learnedSet.has(item.word)).length;
  shuffle(source.filter((item) => !learnedSet.has(item.word))).slice(0, Math.max(0, need)).forEach((item) => {
    learnedSet.add(item.word);
    profile.learnedLog[item.word] = todayKey();
  });
  profile.learned = Array.from(learnedSet);
}

function adminAddXpToRank(targetRank) {
  let needed = 0;
  for (let rank = getPlayerRank(); rank < targetRank; rank += 1) needed += xpNeededForRank(rank);
  addXp(Math.max(0, needed - xpIntoCurrentRank()));
}

function adminOpenMonster(monsterId = "") {
  const rank = getPlayerRank();
  const monsterLevel = Math.max(5, Math.ceil(rank / 5) * 5);
  state.pendingLevelUp = { from: rank, to: monsterLevel, loot: {}, monster: createMonster(monsterLevel, monsterId), monsterLevel, lootClaimed: true };
  // 頭目只出現在週測驗、總複習：直接開一場週測驗測試
  if (!buildWeeklyWords().length) adminCompleteToday();
  stopActiveQuiz();
  navigateTo("weekly");
}

function runAdminAction(action) {
  if (!canUseAdmin()) return;
  const profile = activeProfile();
  const label = adminGroups().flatMap((group) => group.items).find(([key]) => key === action)?.[1] || "";
  let leaveAdmin = false;
  if (action === "xp100") addXp(100);
  if (action === "xp500") addXp(500);
  if (action === "level-up") adminAddXpToRank(getPlayerRank() + 1);
  if (action === "level-next5") {
    adminAddXpToRank(Math.floor(getPlayerRank() / 5) * 5 + 5);
    navigateTo("dashboard", { clearHistory: true, pushHistory: false });
    leaveAdmin = true;
  }
  if (action === "rank-tier") state.rankTier = Math.min(RANK_TITLES.length, (state.rankTier || 1) + 1);
  if (action === "today-done") adminCompleteToday();
  if (action === "learn60") adminLearnPercent(60);
  if (action === "learn-all") adminLearnPercent(100);
  if (action === "weak10") {
    const learned = new Set(profile.learned || []);
    const source = uniqueWordObjects(studySourceForLibrary());
    const pool = source.filter((item) => learned.has(item.word));
    shuffle(pool.length >= 10 ? pool : source).slice(0, 10).forEach((item) => addWeak(item.word));
  }
  if (action === "weak-clear") {
    profile.weak = [];
    profile.weakHits = {};
  }
  if (action === "srs-due") {
    if (!profile.learned.length) adminCompleteToday();
    shuffle(profile.learned).slice(0, 10).forEach((wordText) => {
      const entry = srsEnsureEntry(profile, wordText);
      entry.nextReview = todayKey();
    });
  }
  if (action === "open-daily" || action === "open-weekly" || action === "open-review") {
    if (!dailyTestAvailable() || !buildWeeklyWords().length) adminCompleteToday();
    stopActiveQuiz();
    navigateTo(action === "open-daily" ? "daily" : action === "open-weekly" ? "weekly" : "review");
    leaveAdmin = true;
  }
  if (action === "weekly-notice") {
    if (!buildWeeklyWords().length) adminCompleteToday();
    const days = state.achievements.totalLoginDays || 0;
    state.achievements.totalLoginDays = Math.max(7, Math.ceil(days / 7) * 7);
    state.weeklyNoticeShownFor = null;
    navigateTo("dashboard", { clearHistory: true, pushHistory: false });
    leaveAdmin = true;
  }
  if (action === "items") addInventory({ sword: 9, bomb: 9, potion: 9 });
  if (action === "items-clear") state.inventory = {};
  if (action === "battle") {
    adminOpenMonster();
    leaveAdmin = true;
  }
  if (action.startsWith("monster:")) {
    adminOpenMonster(action.slice("monster:".length));
    leaveAdmin = true;
  }
  if (action === "skip-day" || action === "back-today") {
    state.dayOffset = action === "skip-day" ? Number(state.dayOffset || 0) + 1 : 0;
    studySession = null;
    stopActiveQuiz();
    applyLoginReward();
  }
  if (action === "streak7") state.streakDays = 7;
  if (action === "stamp-today") stampToday();
  if (action === "freeze-plus") state.streakFreezes = Math.min(MAX_STREAK_FREEZES, (state.streakFreezes || 0) + 1);
  if (action === "miss-yesterday") {
    state.stamps = state.stamps || {};
    delete state.stamps[srsAddDays(todayKey(), -1)];
    state.stamps[srsAddDays(todayKey(), -2)] = "done";
    state.stamps[srsAddDays(todayKey(), -3)] = "done";
    state.streakFreezes = Math.max(1, state.streakFreezes || 0);
  }
  if (action === "ach-all") {
    Object.assign(state.achievements, {
      totalCorrect: 1000, bestCombo: 50, totalLoginDays: 200, firstLevelUp: true,
      monstersDefeated: 100, importedLibraries: 10, grandReviews: 7,
    });
    state.streakDays = 100;
    state.rankTier = RANK_TITLES.length;
    checkAchievementUnlocks();
  }
  if (action === "admin-clear") {
    if (!window.confirm(t("confirmReset"))) return;
    resetCurrentAccountProgress();
    leaveAdmin = true;
  }
  toast = leaveAdmin ? "" : `已執行：${label || action}`;
  if (!leaveAdmin && screen !== "admin") toast = "";
  saveState();
  render();
}

// 道具只在週測驗、總複習的答題打怪中使用
function battleItems() {
  return [
    { id: "sword", name: "鐵劍", effect: "下一題答對，傷害加倍", image: treasureImagePath("sword") },
    { id: "bomb", name: "火焰瓶", damage: 20, effect: "直接造成 20 點傷害", image: treasureImagePath("bomb") },
    { id: "potion", name: "治療藥水", heal: 32, effect: "回復 32 點生命", image: treasureImagePath("potion") },
  ];
}

function refundHalfUsedItems(quizBattle) {
  Object.entries(quizBattle?.usedItems || {}).forEach(([itemId, amount]) => {
    state.inventory[itemId] = (state.inventory[itemId] || 0) + Math.ceil(amount / 2);
  });
}

function claimLevelLoot() {
  if (!state.pendingLevelUp) return;
  if (!state.pendingLevelUp.lootClaimed) {
    addInventory(state.pendingLevelUp.loot || {});
    const rewardText = formatLoot(state.pendingLevelUp.loot || {});
    state.rewardNotice = { title: t("itemReward"), items: rewardText };
    // 獎勵改由 rewardNotice 視窗顯示，不再同時出 toast
    state.pendingLevelUp.lootClaimed = true;
  }
  if (!canBattlePendingLevelUp()) state.pendingLevelUp = null;
  saveState();
  render();
}

function formatLoot(items) {
  return Object.entries(items).map(([key, amount]) => `${battleItems().find((item) => item.id === key)?.name || key} x${amount}`).join("、");
}

function monsterImagePath(monster) {
  return `assets/generated/monsters/${monster.id}.webp`;
}

function treasureImagePath(itemId) {
  return `assets/generated/treasures/${itemId}.webp`;
}

function assetImage(src, alt, className) {
  return `<img class="${className}" src="${src}" alt="${escapeHtml(alt)}" loading="lazy" onerror="this.style.display='none'; this.parentElement && this.parentElement.classList.add('img-missing');" />`;
}

function monsterArt(monster) {
  return `<div class="generated-monster">${assetImage(monsterImagePath(monster), monster.name, "monster-raster")}${monsterSvg(monster)}</div>`;
}

// ===== 答題打怪（週測驗、總複習）=====
// 怪物血量設成「答對七成」剛好打倒（升級頭目要八成）；每答錯一次被反擊，錯太多就倒下。
// 倒下或怪物被打倒後，剩下的題目照常作答，測驗成績不受影響。
const QUIZ_HIT = 10;

function createQuizBattle(questionCount) {
  const boss = canBattlePendingLevelUp() ? state.pendingLevelUp.monster : null;
  const base = boss || createMonster(Math.max(1, getPlayerRank()));
  const hitsNeeded = Math.max(1, Math.ceil(questionCount * (boss ? 0.8 : 0.7)));
  const allowedWrong = Math.max(1, questionCount - hitsNeeded);
  const maxHp = hitsNeeded * QUIZ_HIT;
  return {
    monster: { ...base, hp: maxHp, maxHp, attack: Math.ceil(100 / (allowedWrong + 1)) },
    isBoss: !!boss,
    playerHp: 100,
    swordReady: false,
    usedItems: {},
    lastHit: null,
    lastTaken: null,
    log: "",
    result: null,
  };
}

function hitMonster(quizBattle, damage) {
  quizBattle.monster.hp = Math.max(0, quizBattle.monster.hp - damage);
  quizBattle.lastHit = damage;
  if (quizBattle.monster.hp <= 0) {
    quizBattle.result = "won";
    quizBattle.log = t("battleWonContinue");
  }
}

function applyQuizBattleTurn(quizBattle, isCorrect) {
  if (!quizBattle || quizBattle.result) return;
  quizBattle.lastHit = null;
  quizBattle.lastTaken = null;
  if (isCorrect) {
    const damage = QUIZ_HIT * (quizBattle.swordReady ? 2 : 1);
    quizBattle.swordReady = false;
    quizBattle.log = msg("quizAttack", { damage });
    hitMonster(quizBattle, damage);
    return;
  }
  const taken = quizBattle.monster.attack;
  quizBattle.playerHp = Math.max(0, quizBattle.playerHp - taken);
  quizBattle.lastTaken = taken;
  quizBattle.log = msg("quizCounter", { damage: taken });
  if (quizBattle.playerHp <= 0) {
    quizBattle.result = "lost";
    quizBattle.log = t("battleLostContinue");
  }
}

function useQuizItem(itemId) {
  const quizBattle = activeQuiz?.battle;
  const item = battleItems().find((entry) => entry.id === itemId);
  if (!quizBattle || quizBattle.result || !item || (state.inventory[itemId] || 0) <= 0) return;
  if (itemId === "sword" && quizBattle.swordReady) return;
  if (itemId === "potion" && quizBattle.playerHp >= 100) return;
  state.inventory[itemId] -= 1;
  quizBattle.usedItems[itemId] = (quizBattle.usedItems[itemId] || 0) + 1;
  quizBattle.lastHit = null;
  quizBattle.lastTaken = null;
  if (itemId === "sword") {
    quizBattle.swordReady = true;
    quizBattle.log = t("swordReady");
  }
  if (item.damage) {
    quizBattle.log = msg("battleDamage", { item: item.name, damage: item.damage });
    hitMonster(quizBattle, item.damage);
  }
  if (item.heal) {
    quizBattle.playerHp = Math.min(100, quizBattle.playerHp + item.heal);
    quizBattle.log = msg("battleHeal", { item: item.name, heal: item.heal });
  }
  saveState();
  render();
}

// 測驗結束時結算戰鬥：打倒給經驗與道具；沒打倒（倒下或時間到）退還一半用掉的道具
function settleQuizBattle(quizBattle) {
  if (!quizBattle) return null;
  const monster = quizBattle.monster;
  if (quizBattle.result === "won") {
    const loot = levelLoot(monster.level || getPlayerRank());
    const xpGain = 50 + (monster.level || 1) * 5;
    addInventory(loot);
    addXp(xpGain);
    state.achievements.monstersDefeated += 1;
    if (quizBattle.isBoss) state.pendingLevelUp = null;
    return { result: "won", name: monster.name, loot: formatLoot(loot), xp: xpGain, boss: quizBattle.isBoss };
  }
  refundHalfUsedItems(quizBattle);
  return { result: quizBattle.result === "lost" ? "lost" : "escaped", name: monster.name, boss: quizBattle.isBoss };
}

function renderQuizBattle(quizBattle) {
  const monster = quizBattle.monster;
  const monsterPct = Math.round((monster.hp / Math.max(1, monster.maxHp)) * 100);
  const playerPct = Math.max(0, Math.min(100, quizBattle.playerHp));
  return `
    <div class="quiz-battle ${quizBattle.result ? `is-${quizBattle.result}` : ""}">
      <div class="quiz-battle-art ${quizBattle.lastHit ? "hit" : ""} ${quizBattle.result === "won" ? "defeated" : ""}">
        ${monsterArt(monster)}
        ${quizBattle.lastHit ? `<span class="damage-pop">-${quizBattle.lastHit}</span>` : ""}
      </div>
      <div class="quiz-battle-body">
        <p class="quiz-battle-name"><strong>${escapeHtml(monster.name)}</strong>${quizBattle.isBoss ? `<span class="tag">${t("bossTag")}</span>` : ""}</p>
        <div class="battle-meter-card monster-meter-card">
          <div class="battle-meter-head"><span>${t("monsterHp")}</span><span>${monster.hp}/${monster.maxHp}</span></div>
          <div class="battle-meter"><span style="width:${monsterPct}%"></span></div>
        </div>
        <div class="battle-meter-card">
          <div class="battle-meter-head"><span>${t("playerHp")}${quizBattle.lastTaken ? `<b class="taken">-${quizBattle.lastTaken}</b>` : ""}</span><span>${quizBattle.playerHp}/100</span></div>
          <div class="battle-meter"><span style="width:${playerPct}%"></span></div>
        </div>
        <p class="quiz-battle-log">${escapeHtml(quizBattle.log || monster.trait || "")}</p>
        <div class="quiz-items">
          ${battleItems().map((item) => {
            const count = state.inventory[item.id] || 0;
            const disabled = quizBattle.result || count <= 0 || (item.id === "sword" && quizBattle.swordReady) || (item.id === "potion" && quizBattle.playerHp >= 100);
            return `<button class="item-chip ${item.id === "sword" && quizBattle.swordReady ? "armed" : ""}" data-quiz-item="${item.id}" title="${item.effect}" ${disabled ? "disabled" : ""}>${assetImage(treasureImagePath(item.id), item.name, "item-art")}<span>${item.name}</span><b>×${count}</b></button>`;
          }).join("")}
        </div>
      </div>
    </div>
  `;
}

function monsterSvg(monster) {
  const shape = monsterShapeSvg(monster);
  return `
    <svg viewBox="0 0 520 380" role="img" aria-label="${monster.name}">
      <defs>
        <linearGradient id="mist-${monster.id}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#f8f1df"/>
          <stop offset="0.52" stop-color="#d8e7e4"/>
          <stop offset="1" stop-color="#9fb7c1"/>
        </linearGradient>
        <radialGradient id="aura-${monster.id}" cx="50%" cy="44%" r="50%">
          <stop offset="0" stop-color="${monster.accent || "#fff6df"}" stop-opacity="0.95"/>
          <stop offset="0.62" stop-color="${monster.color || "#168c7c"}" stop-opacity="0.34"/>
          <stop offset="1" stop-color="#17202a" stop-opacity="0"/>
        </radialGradient>
        <filter id="soft-${monster.id}">
          <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#17202a" flood-opacity="0.28"/>
        </filter>
      </defs>
      <rect width="520" height="380" rx="22" fill="url(#mist-${monster.id})"/>
      <path d="M0 286c94-40 150-30 226 0s154 34 294-18v112H0z" fill="#eff4ed" opacity="0.72"/>
      <circle cx="260" cy="174" r="134" fill="url(#aura-${monster.id})"/>
      <g opacity="0.42" stroke="#fffaf0" stroke-width="3" fill="none">
        <path d="M72 86h58M390 72h44M82 250h74M366 270h78"/>
        <path d="M102 112c24 8 44 8 68 0M350 108c26 10 48 10 74 0"/>
      </g>
      <g filter="url(#soft-${monster.id})">${shape}</g>
      <g fill="none" stroke="#fffaf0" stroke-width="3" opacity="0.76">
        <path d="M156 64c-22 28-22 58 0 86M366 66c24 26 24 56 0 84"/>
        <path d="M140 316c76 26 164 30 240 0"/>
      </g>
      <text x="260" y="344" fill="#24313a" font-size="30" font-weight="800" text-anchor="middle">${monster.name}</text>
    </svg>`;
}

function monsterShapeSvg(monster) {
  const c = monster.color || "#168c7c";
  const a = monster.accent || "#fff6df";
  const commonEyes = `<circle cx="232" cy="158" r="7" fill="#fffaf0"/><circle cx="288" cy="158" r="7" fill="#fffaf0"/>`;
  const shapes = {
    orb: `<g><ellipse cx="260" cy="178" rx="82" ry="76" fill="${c}"/><path d="M206 126c36-28 86-26 112 4" stroke="${a}" stroke-width="10" fill="none" stroke-linecap="round"/>${commonEyes}<path d="M230 204c22 12 42 12 64 0" stroke="#fffaf0" stroke-width="7" fill="none" stroke-linecap="round"/></g>`,
    golem: `<g><path d="M196 132h128l34 64-34 76H196l-34-76z" fill="${c}"/><path d="M198 132l62-48 64 48M186 220h148" stroke="${a}" stroke-width="10" fill="none" stroke-linecap="round"/>${commonEyes}</g>`,
    wraith: `<g><path d="M190 286c20-122 6-176 70-206 64 30 50 84 70 206-36-24-48-24-70 0-22-24-34-24-70 0z" fill="${c}"/><path d="M204 118c32 34 80 34 112 0" stroke="${a}" stroke-width="9" fill="none" stroke-linecap="round"/>${commonEyes}</g>`,
    dragon: `<g><path d="M174 232c38-92 70-132 128-120 46 10 76 54 64 108-14 66-90 72-144 52z" fill="${c}"/><path d="M224 112l-34-42 66 24 62-28-24 50" fill="${a}" opacity="0.82"/><path d="M342 174c42-8 72 10 88 50" stroke="${c}" stroke-width="22" fill="none" stroke-linecap="round"/>${commonEyes}</g>`,
    mimic: `<g><path d="M178 150h164v112H178z" fill="${c}"/><path d="M168 126h184v54H168z" fill="${a}"/><path d="M202 214h116M224 150v112M296 150v112" stroke="#fffaf0" stroke-width="8"/><circle cx="260" cy="198" r="12" fill="#fffaf0"/></g>`,
    knight: `<g><path d="M198 134c20-42 104-42 124 0v118c-32 28-92 28-124 0z" fill="${c}"/><path d="M196 150h128M214 188h92M260 92v190" stroke="${a}" stroke-width="9" fill="none" stroke-linecap="round"/>${commonEyes}</g>`,
    serpent: `<g><path d="M160 250c58-96 132-18 184-118 18-34 62-20 62 16 0 60-82 72-112 116-38 56-106 38-134-14z" fill="${c}"/><path d="M320 122c26 24 52 24 78 0" stroke="${a}" stroke-width="8" fill="none"/><circle cx="350" cy="146" r="7" fill="#fffaf0"/><circle cx="390" cy="146" r="7" fill="#fffaf0"/></g>`,
    phoenix: `<g><path d="M260 76c56 62 86 124 18 212-58-48-82-106-18-212z" fill="${c}"/><path d="M252 164c-60-36-102-20-128 50 62-18 94 0 132 42M268 164c60-36 102-20 128 50-62-18-94 0-132 42" fill="${a}" opacity="0.82"/>${commonEyes}</g>`,
    moth: `<g><ellipse cx="220" cy="180" rx="66" ry="92" fill="${a}" opacity="0.9"/><ellipse cx="300" cy="180" rx="66" ry="92" fill="${a}" opacity="0.9"/><path d="M260 104c28 48 28 102 0 162-28-60-28-114 0-162z" fill="${c}"/>${commonEyes}</g>`,
    stag: `<g><ellipse cx="260" cy="194" rx="76" ry="68" fill="${c}"/><path d="M218 128c-46-30-46-66-10-90M302 128c46-30 46-66 10-90M222 116h76" stroke="${a}" stroke-width="10" fill="none" stroke-linecap="round"/>${commonEyes}</g>`,
    lantern: `<g><path d="M210 126h100l28 132H182z" fill="${c}"/><path d="M226 104h68M260 70v34M208 176h104" stroke="${a}" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="260" cy="206" r="34" fill="${a}" opacity="0.85"/></g>`,
    mandrake: `<g><path d="M208 150c0-54 104-54 104 0v80c0 58-104 58-104 0z" fill="${c}"/><path d="M222 112c-28-30-22-58 18-78M260 104c-8-42 12-70 60-76M298 114c34-24 62-16 84 24" stroke="${a}" stroke-width="10" fill="none" stroke-linecap="round"/>${commonEyes}</g>`,
  };
  return shapes[monster.shape] || shapes.orb;
}

function triggerCelebrate() {
  celebrate = true;
  setTimeout(() => {
    celebrate = false;
    render();
  }, 800);
}

function studyHistoryKey(libraryId = null) {
  return `${libraryId || "built-in"}::${activeGoal()}`;
}

function studyHistorySet(libraryId = null) {
  if (!state.studyHistory) state.studyHistory = {};
  const key = studyHistoryKey(libraryId);
  if (!state.studyHistory[key]) state.studyHistory[key] = [];
  return new Set(state.studyHistory[key]);
}

function recordStudyHistory(words, libraryId = null) {
  if (!state.studyHistory) state.studyHistory = {};
  const key = studyHistoryKey(libraryId);
  const existing = new Set(state.studyHistory[key] || []);
  words.forEach((wordText) => {
    if (wordText) existing.add(wordText);
  });
  state.studyHistory[key] = Array.from(existing);
}

function playCorrectSound() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.value = 720;
  gain.gain.setValueAtTime(0.001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.18);
}

async function saveImportedLibrary() {
  const requested = document.querySelector("#libraryName")?.value?.trim() || t("customLibrary");
  const name = uniqueLibraryName(requested);
  const raw = document.querySelector("#wordImportText")?.value || "";
  // 先記下草稿：查詢過程會重新 render，失敗時輸入框內容不能消失
  importDraft = { name: requested, text: raw };
  toast = t("importProgressPrefix") || "查詢字典中…";
  render();
  const imported = await parseImportedWords(raw);
  if (!imported.length) {
    toast = raw.trim() ? t("importNoneFound") : t("importCopy");
    render();
    return;
  }
  importDraft = { name: "", text: "" };
  const id = `custom-${Date.now()}`;
  const library = { id, name, words: imported.map((item) => ({ ...item, library: id })) };
  state.customLibraries = [...state.customLibraries, library];
  state.activeLibraryId = id;
  state.achievements.importedLibraries += 1;
  const stats = parseImportedWords._lastStats || {};
  const breakdown = stats.total
    ? ` (${msg("importStats", {
        full: stats.full || 0,
        partial: stats.partial || 0,
        none: stats.none || 0,
      })}${stats.rejected ? ` · ${msg("importRejected", { count: stats.rejected })}` : ""})`
    : "";
  toast = `${msg("imported", { count: imported.length })}${breakdown}`;
  saveState();
  navigateTo("dashboard", { clearHistory: true, pushHistory: false });
  render();
}

async function parseImportedWords(raw) {
  const limit = customLibraryLimit();
  const entries = raw
    .split(/\r?\n/)
    .flatMap((line) => line.split(/,|\s/))
    .map((line) => line.trim().toLowerCase())
    .filter(Boolean)
    .filter((entry) => /^[a-z-]+$/.test(entry));
  const uniqueAll = Array.from(new Set(entries));
  const unique = uniqueAll.slice(0, limit);
  if (uniqueAll.length > limit) toast = msg("importTrimmed", { limit });
  const lookedUp = [];
  // 統計：完整查到中文 vs 只有英文 vs 完全沒拿到
  const lookupStats = { full: 0, partial: 0, none: 0 };
  const total = unique.length;
  for (let i = 0; i < unique.length; i += IMPORT_LOOKUP_BATCH_SIZE) {
    const batch = unique.slice(i, i + IMPORT_LOOKUP_BATCH_SIZE);
    // 顯示批次進度（給使用者一點存在感，特別是匯入幾百個字時）
    const done = Math.min(total, i);
    toast = `${t("importProgressPrefix") || "查詢字典中"} ${done} / ${total}…`;
    render();
    const results = await Promise.all(batch.map((wordText, offset) => lookupWord(wordText, i + offset, lookupStats)));
    lookedUp.push(...results.filter(Boolean));
  }
  // 把統計結果暫存到全域，saveImportedLibrary 會用它組 toast
  parseImportedWords._lastStats = { ...lookupStats, total };
  return lookedUp;
}

async function addWordsToLibrary(libraryId) {
  const library = (state.customLibraries || []).find((item) => item.id === libraryId);
  if (!library) return;
  const input = document.querySelector(`[data-add-words-input="${CSS.escape(libraryId)}"]`);
  const raw = input?.value || "";
  const existing = new Set((library.words || []).map((item) => String(item.word || "").toLowerCase()));
  toast = t("importProgressPrefix") || "查詢字典中…";
  render();
  const imported = (await parseImportedWords(raw)).filter((item) => !existing.has(String(item.word || "").toLowerCase()));
  if (!imported.length) {
    toast = raw.trim() ? t("importNoneFound") : t("importCopy");
    render();
    return;
  }
  library.words = [...(library.words || []), ...imported.map((item) => ({ ...item, library: library.id }))];
  state.customLibraries = (state.customLibraries || []).map((item) => (item.id === library.id ? library : item));
  delete state.dailyStudy?.[dailyStudyKey(library.id)];
  saveState();
  toast = msg("addWordsDone", { count: imported.length });
  render();
}

// 把使用者輸入的庫名稱去重，與既有自訂庫不撞 → 撞了自動加 (1)(2)...
function uniqueLibraryName(requested) {
  const base = String(requested || "").trim() || t("customLibrary");
  const taken = new Set((state.customLibraries || []).map((library) => library.name));
  if (!taken.has(base)) return base;
  // 如果原名已含 "(n)" 後綴 → 用底名再算下一個編號
  const match = base.match(/^(.*?)(?:\s*\((\d+)\))?$/);
  const rawBase = (match?.[1] || base).trim();
  for (let i = 1; i < 9999; i += 1) {
    const candidate = `${rawBase} (${i})`;
    if (!taken.has(candidate)) return candidate;
  }
  return `${rawBase} (${Date.now()})`; // 理論上不會到這
}

async function refetchCustomLibrary(libraryId) {
  const library = (state.customLibraries || []).find((item) => item.id === libraryId);
  if (!library || !library.words?.length) return;
  const words = library.words;
  const stats = { full: 0, partial: 0, none: 0 };
  toast = msg("refetching", { count: words.length });
  render();
  for (let i = 0; i < words.length; i += IMPORT_LOOKUP_BATCH_SIZE) {
    const batch = words.slice(i, i + IMPORT_LOOKUP_BATCH_SIZE);
    const done = Math.min(words.length, i);
    toast = `${t("importProgressPrefix")} ${done} / ${words.length}…`;
    render();
    const results = await Promise.all(
      batch.map(async (item) => {
        try {
          const response = await fetch(dictionaryLookupUrl(item.word, true));
          const entry = await response.json();
          const hasMeaning = !!(entry.meaning && entry.meaning.trim());
          const hasExample = !!(entry.example && entry.example.trim());
          if (hasMeaning && hasExample) stats.full += 1;
          else if (hasMeaning || hasExample) stats.partial += 1;
          else stats.none += 1;
          const newExample = (entry.example || "").trim();
          const newMeaning = compactMeaning((entry.meaning || "").trim()) || compactMeaning(item.meaning || "");
          return {
            ...item,
            meaning: newMeaning,
            example: newExample,
            exampleZh: (entry.exampleZh || "").trim() || item.exampleZh || "",
            phonetic: (entry.phonetic || "").trim() || item.phonetic || "",
            pos: normalizePos(entry.pos || item.pos || "word"),
            sources: Array.isArray(entry.sources) ? entry.sources : (item.sources || []),
            cloze:
              newExample.toLowerCase().includes(item.word.toLowerCase())
                ? newExample.replace(new RegExp(escapeRegExp(item.word), "i"), "____")
                : "",
            options: [(entry.meaning || "").trim() || item.meaning || item.word],
          };
        } catch {
          stats.none += 1;
          return item;
        }
      }),
    );
    // 寫回該批
    for (let offset = 0; offset < batch.length; offset += 1) {
      const idx = i + offset;
      library.words[idx] = results[offset];
    }
  }
  state.customLibraries = state.customLibraries.map((item) => (item.id === libraryId ? library : item));
  saveState();
  toast = msg("refetchDone", { full: stats.full, partial: stats.partial, none: stats.none });
  render();
}

// 線上字典查不到（GitHub Pages 沒有 /api、或離線）時，改用內建 1.7 萬字的資料
function builtInEntryFor(wordText) {
  const item = words.find((candidate) => candidate.word === wordText && hasText(candidate.meaning));
  if (!item) return null;
  return {
    meaning: item.meaning,
    example: cambridgeExampleText(item),
    exampleZh: item.exampleZh || "",
    phonetic: isUsablePhonetic(item.phonetic) ? item.phonetic : "",
    pos: item.pos || "word",
    sources: ["built-in"],
  };
}

async function lookupWord(wordText, index, stats) {
  try {
    let entry = {};
    try {
      const response = await fetch(dictionaryLookupUrl(wordText));
      entry = response.ok ? (await response.json()) || {} : {};
    } catch {
      entry = {};
    }
    if (!(entry.meaning && String(entry.meaning).trim())) {
      const fallback = builtInEntryFor(wordText);
      if (fallback) entry = { ...fallback, ...Object.fromEntries(Object.entries(entry).filter(([, value]) => hasText(value))), meaning: fallback.meaning };
    }
    const hasMeaning = !!(entry.meaning && entry.meaning.trim());
    const hasExample = !!(entry.example && entry.example.trim());
    const hasSources = Array.isArray(entry.sources) && entry.sources.length > 0;
    // 字典完全查不到（沒中文、沒例句、沒任何來源命中）→ 視為無效字
    if (!hasMeaning && !hasExample && !hasSources) {
      if (stats) {
        stats.none += 1;
        stats.rejected = (stats.rejected || 0) + 1;
      }
      return null; // 過濾掉
    }
    if (stats) {
      if (hasMeaning && hasExample) stats.full += 1;
      else if (hasMeaning || hasExample) stats.partial += 1;
      else stats.none += 1;
    }
    return importedWordFromEntry(wordText, entry, index);
  } catch {
    if (stats) {
      stats.none += 1;
      stats.rejected = (stats.rejected || 0) + 1;
    }
    return null;
  }
}

function importedWordFromEntry(wordText, entry, index) {
  const level = Math.min(5, Math.max(1, Math.ceil((wordText.length + index / 2) / 4)));
  const rawMeaning = (entry.meaning || "").trim();
  // 精簡成 1-2 個常用意義
  const meaning = compactMeaning(rawMeaning);
  const example = (entry.example || "").trim();
  const exampleZh = (entry.exampleZh || "").trim();
  const phonetic = (entry.phonetic || "").trim();
  return {
    word: wordText.toLowerCase(),
    phonetic,
    meaning,
    level,
    goal: [activeGoal()],
    image: "🗡️",
    example,
    exampleZh, // 例句的中文翻譯（如果有）— UI 顯示時可選用
    cloze: example && example.toLowerCase().includes(wordText.toLowerCase())
      ? example.replace(new RegExp(escapeRegExp(wordText), "i"), "____")
      : "",
    options: [meaning],
    pos: normalizePos(entry.pos || "word"),
    sources: Array.isArray(entry.sources) ? entry.sources : [],
  };
}

// 把字典回的長串釋義精簡成 1-2 個常用意義
// 例：「放棄；遺棄；拋棄；丟棄；不再使用」→「放棄、不再使用」
// 例：「to leave behind, abandon, forsake, give up」→「leave behind、give up」
function compactMeaning(raw) {
  if (!raw) return "";
  const text = String(raw).trim();
  const parts = text
    .split(/[;；,，、/]+|\s+(?:or|and)\s+/i)
    .map((p) => cleanMeaningPartForNative(p))
    .filter(Boolean);
  if (!parts.length) {
    return "";
  }
  const picked = [];
  for (const p of parts) {
    if (picked.some((prev) => isSimilarMeaning(prev, p))) continue;
    picked.push(p);
    if (picked.length >= 2) break;
  }
  const joined = picked.join(nativeMeaningSeparator());
  if (!isSpanishNative() && joined.length > 16 && picked.length > 1) return picked[0];
  return joined;
}

function cleanMeaningPartForNative(part) {
  if (!part) return "";
  let s = String(part)
    .replace(/^(to|a|an|the)\s+/i, "")
    .replace(/^\s*\([^)]*\)\s*/, "")
    .replace(/\b(?:v|n|adj|adv|prep|conj|pron|interj|aux)\.?\b/gi, "")
    .trim();
  // 括號補充說明（例如「是（複數形式）」）拿掉；只剩半邊括號的也一併清掉，避免出現「是（複數形式」
  const withoutNotes = s.replace(/[（(][^）)]*[）)]/g, "").trim();
  if (withoutNotes) s = withoutNotes;
  s = s.replace(/[（(][^）)]*$/, "").replace(/^[^（(]*[）)]/, (m) => m.replace(/[）)]/g, "")).trim();
  if (!isSpanishNative()) s = s.replace(/[A-Za-z][A-Za-z'\-\s]*/g, " ");
  s = s.replace(/[`~!@#$%^&*()_+=|\\<>?[\]{}":']/g, "");
  s = s.replace(/\s+/g, isSpanishNative() ? " " : "").trim();
  return hasNativeMeaningChars(s) ? s : "";
}

function nativeMeaningSeparator() {
  return isSpanishNative() ? ", " : "、";
}

function isSpanishNative() {
  return ["es", "es-es", "es-mx"].includes(String(state.native || "").toLowerCase());
}

function hasNativeMeaningChars(value) {
  const s = String(value || "");
  switch (String(state.native || "zh-Hant").toLowerCase()) {
    case "ja":
    case "ja-jp":
      return /[\u3040-\u30ff\u3400-\u9fff]/.test(s);
    case "ko":
    case "ko-kr":
      return /[\uac00-\ud7af\u1100-\u11ff\u3130-\u318f]/.test(s);
    case "es":
    case "es-es":
    case "es-mx":
      return /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ¿¡]/.test(s);
    case "zh-hant":
    case "zh-tw":
    case "zh-hk":
    default:
      return /[\u3400-\u9fff]/.test(s);
  }
}

function isCompleteExample(text) {
  const s = String(text || "").trim();
  if (!s || s.includes("/") || s.includes(";")) return false;
  const englishPart = s.replace(/\s*\([^)]*[\u3400-\u9fff][^)]*\)\s*$/, "").trim();
  if (englishPart.split(/\s+/).filter(Boolean).length < 5) return false;
  return /^[A-Z"'(]/.test(englishPart) && /[.!?]["']?\s*$/.test(englishPart);
}

// 兩段釋義是否接近重複（共享 ≥ 60% 字符）
function isSimilarMeaning(a, b) {
  if (!a || !b) return false;
  const sa = new Set(String(a));
  const sb = new Set(String(b));
  let common = 0;
  sa.forEach((c) => {
    if (sb.has(c)) common += 1;
  });
  const minLen = Math.min(sa.size, sb.size);
  return minLen > 0 && common / minLen >= 0.6;
}

function normalizePos(pos) {
  const value = String(pos).toLowerCase();
  if (value.includes("verb")) return "verb";
  if (value.includes("noun")) return "noun";
  if (value.includes("adjective")) return "adjective";
  if (value.includes("adverb")) return "adverb";
  return "word";
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasText(value) {
  return String(value || "").trim().length > 0;
}

function clozePrompt(item) {
  const saved = String(item.cloze || "").trim();
  if (saved && hasCambridgeExampleSource(item)) return saved;
  const example = cambridgeExampleText(item);
  const wordText = String(item.word || "").trim();
  const blanked = example && wordText ? clozeFromExample(example, wordText) : "";
  if (blanked) return blanked;
  // 沒例句可用 → 直接顯示精簡後的中文意思當題目（不要再夾「____ (...)」格式）
  const meaning = compactMeaning(String(item.meaning || "").trim());
  return meaning || String(item.pos || "") || t("wordInput");
}

function questionTypeForItem(item, requestedType) {
  if (requestedType === "listen") {
    // 聽音選字：需要 TTS 支援 + 有單字文字；不支援時退回 meaning
    return hasText(item.word) && "speechSynthesis" in window ? "listen" : hasText(item.meaning) ? "meaning" : "word";
  }
  if (requestedType === "cloze") {
    return hasText(item.word) && hasText(cambridgeExampleText(item)) ? "cloze" : hasText(item.meaning) ? "meaning" : "word";
  }
  if (requestedType === "meaning") {
    return hasText(item.meaning) ? "meaning" : "word";
  }
  return hasText(item.word) ? "word" : "meaning";
}

function createQuiz(kind) {
  const source =
    kind === "daily" ? buildDailyWords()
    : kind === "review" ? buildReviewWords()
    : kind === "weekly" ? buildWeeklyWords()
    : buildPlacementWords();
  const questions = source.map((item, index) => {
    const forceMeaning = state.activeLibraryId && state.activeLibraryId !== "built-in";
    const canCloze = hasText(item.word) && hasText(cambridgeExampleText(item));
    // 每日測驗：永遠 meaning（字義互換）
    // 週測驗：混合 meaning + cloze
    // 總複習：混合 meaning + cloze
    // placement：交替 meaning / cloze（若有 cloze）
    const canListen = hasText(item.word) && "speechSynthesis" in window;
    let type;
    if (kind === "daily") {
      type = "meaning";
    } else if ((kind === "weekly" || kind === "review") && canListen && index % 3 === 2) {
      // 週測驗 / 總複習：每 3 題混一題「聽音選字」練聽力
      type = "listen";
    } else if (forceMeaning || !canCloze) {
      type = "meaning";
    } else {
      type = index % 2 === 1 ? "cloze" : "meaning";
    }
    return buildQuestion(item, type);
  });
  return {
    kind,
    questions,
    index: 0,
    score: 0,
    correct: 0,
    answers: 0,
    startedAt: Date.now(),
    duration: kind === "review" ? 900 : kind === "weekly" ? 300 : 180,
    mistakes: [],
    timer: null,
    battle: (kind === "weekly" || kind === "review") && questions.length ? createQuizBattle(questions.length) : null,
  };
}

function buildPlacementWords() {
  const source = wordsForGoal(activeGoal(), words);
  return sampleUniqueWords(source, Math.min(36, source.length));
}

function buildReviewWords() {
  const learnedSet = new Set(activeProfile().learned || []);
  const source = wordsForGoal(activeGoal(), words)
    .filter((item) => learnedSet.has(item.word));
  return sampleUniqueWords(source, Math.min(60, source.length));
}

// 週測驗：本週（最近 7 天）學過的單字
function buildWeeklyWords() {
  const profile = activeProfile();
  // 過去 7 天的日期 set
  const weekDates = new Set(recentDates(7));
  const weeklyLearned = Object.entries(profile.learnedLog || {})
    .filter(([, date]) => weekDates.has(date))
    .map(([word]) => word);
  // 把字 text 轉成 word object
  const words = uniqueWordObjects(
    weeklyLearned.map((w) => findWord(w)).filter(Boolean),
  );
  // 5 分鐘約 15-20 題剛好，這邊上限 20
  return sampleUniqueWords(words, Math.min(20, words.length));
}

// 週測驗解鎖條件：
// 1) 累計登入天數是 7 的倍數（達到第 7、14、21... 天）
// 2) 本週有學過的字可考
function weeklyTestAvailable() {
  const totalLogin = state.achievements?.totalLoginDays || 0;
  if (totalLogin <= 0) return false;
  if (totalLogin % 7 !== 0) return false;
  return buildWeeklyWords().length > 0;
}

// 是否該對使用者跳出「週測驗解鎖」通知（每個 7 天節點只跳一次）
function shouldShowWeeklyNotice() {
  if (!weeklyTestAvailable()) return false;
  const totalLogin = state.achievements?.totalLoginDays || 0;
  const noticeKey = `week-${Math.floor(totalLogin / 7)}`;
  return state.weeklyNoticeShownFor !== noticeKey;
}

function dismissWeeklyNotice() {
  const totalLogin = state.achievements?.totalLoginDays || 0;
  state.weeklyNoticeShownFor = `week-${Math.floor(totalLogin / 7)}`;
  saveState();
}

function buildDailyWords() {
  const profile = activeProfile();
  const libraryId = currentStudyLibraryId();
  const source = studySourceForLibrary(libraryId);
  if (!dailyTestAvailable()) return [];
  const todayWords = todayStudyWords(source, libraryId).slice(0, 10);
  const seen = new Set(todayWords.map((item) => item.word));
  const sourceWords = new Set(source.map((candidate) => candidate.word));
  const reviewWords = uniqueWordObjects(
    getWordsLearnedBefore(todayKey()).map((wordText) => findWord(wordText)).filter((item) => item && sourceWords.has(item.word) && !seen.has(item.word)),
  );
  const dueReview = srsDueWords(profile, reviewWords).filter((item) => !seen.has(item.word));
  const reviewPool = uniqueWordObjects([...dueReview, ...reviewWords]).filter((item) => !seen.has(item.word));
  return [...todayWords, ...sampleUniqueWords(reviewPool, 5)].slice(0, 15);
}

function todayStudyComplete() {
  return dailyStudyCompleted(currentStudyLibraryId());
}

function dailyTestAvailable() {
  return todayStudyComplete();
}

function todayStudyWords(source = studySourceForLibrary(), libraryId = currentStudyLibraryId()) {
  state.dailyStudy = state.dailyStudy || {};
  const locked = state.dailyStudy[dailyStudyKey(libraryId)];
  if (!Array.isArray(locked) || !locked.length) return [];
  const sourceWords = new Set(source.map((candidate) => candidate.word));
  return uniqueWordObjects(
    locked
      .map((wordText) => findWord(wordText))
      .filter((item) => item && sourceWords.has(item.word)),
  );
}

function getLearnedPercent() {
  // 修正：自訂庫模式下應以當前學習來源為分母，不能寫死內建字庫
  const source = studySourceForLibrary();
  if (!source.length) return 0;
  const learnedSet = new Set(activeProfile().learned || []);
  const sourceWords = new Set(source.map((item) => item.word));
  let learnedCount = 0;
  sourceWords.forEach((wordText) => {
    if (learnedSet.has(wordText)) learnedCount += 1;
  });
  return Math.round((learnedCount / sourceWords.size) * 100);
}

// 段位 → 各 tier 抽中權重
// 低段位偏簡單字（tier 1 高權重）；高段位偏難字（tier 5 高權重）
const TIER_WEIGHTS_BY_LEVEL = {
  1: [6, 4, 2, 1, 1],
  2: [4, 5, 3, 2, 1],
  3: [2, 4, 5, 3, 2],
  4: [1, 2, 4, 5, 4],
  5: [1, 1, 2, 4, 7],
};

// 對任一字串 pool 套用 tier 權重抽樣（給 createStudySession / weightedStudyWords 共用）
function tierWeightedSample(pool, count, levelId) {
  const weights = TIER_WEIGHTS_BY_LEVEL[levelId] || TIER_WEIGHTS_BY_LEVEL[1];
  const profile = activeProfile();
  const weighted = [];
  pool.forEach((item) => {
    const tier = getWordTier(item);
    const weakBoost = profile.weak.includes(item.word) ? 3 : 1;
    const amount = Math.max(1, (weights[tier - 1] || 1) * weakBoost);
    for (let i = 0; i < amount; i += 1) weighted.push(item);
  });
  return weightedSampleUnique(weighted.length ? weighted : pool, count);
}

function weightedStudyWords(count) {
  const level = { id: wordDifficultyLevelId() };
  const source = wordsForGoal(activeGoal(), words).filter((item) => item.level <= Math.min(5, level.id + 1));
  return tierWeightedSample(source, count, level.id);
}

function weightedSampleUnique(pool, count) {
  const selected = [];
  const seen = new Set();
  const shuffled = shuffle(pool);
  for (const item of shuffled) {
    if (!seen.has(item.word)) {
      selected.push(item);
      seen.add(item.word);
    }
    if (selected.length >= count) break;
  }
  return selected;
}

function buildQuestion(item, type) {
  const resolvedType = questionTypeForItem(item, type);
  const choices = resolvedType === "word" || resolvedType === "cloze" || resolvedType === "listen" ? buildWordChoices(item) : buildMeaningChoices(item);
  if (resolvedType === "listen") {
    return {
      ...item,
      type: resolvedType,
      correct: item.word,
      choices,
    };
  }
  if (resolvedType === "word") {
    return {
      ...item,
      type: resolvedType,
      correct: item.word,
      choices,
    };
  }
  if (resolvedType === "cloze") {
    return {
      ...item,
      type: resolvedType,
      cloze: clozePrompt(item),
      correct: item.word,
      choices,
    };
  }
  return {
    ...item,
    type: resolvedType,
    correct: compactMeaning(item.meaning),
    choices,
  };
}

function answerQuiz(answer, correct) {
  if (!activeQuiz || activeQuiz.finishing) return;
  const current = activeQuiz.questions[activeQuiz.index];
  if (!current) return;
  activeQuiz.answers += 1;
  const isCorrect = answer === correct;
  if (isCorrect) {
    activeQuiz.score += current.level * 8 + 4;
    activeQuiz.correct += 1;
    recordCorrect();
    addXp(activeQuiz.kind === "daily" ? 12 : 8);
    toast = "";
    if (activeQuiz.kind === "daily") {
      celebrate = false;
      quizEffect = "good";
      if (quizFxTimer) clearTimeout(quizFxTimer);
      quizFxTimer = setTimeout(() => {
        quizEffect = null;
        quizFxTimer = null;
        render();
      }, 700);
    }
  } else {
    activeQuiz.mistakes = [...(activeQuiz.mistakes || []), { word: current.word, correct }];
    addWeak(current.word);
    recordWrong();
    addXp(2);
    toast = "";
    if (activeQuiz.kind === "daily") {
      celebrate = false;
      quizEffect = "bad";
      if (quizFxTimer) clearTimeout(quizFxTimer);
      quizFxTimer = setTimeout(() => {
        quizEffect = null;
        quizFxTimer = null;
        render();
      }, 700);
    }
  }
  if (isCorrect) advanceWeakMastery(current.word);
  if (activeQuiz.kind !== "placement") srsUpdate(current.word, isCorrect);
  applyQuizBattleTurn(activeQuiz.battle, isCorrect);
  saveState();
  activeQuiz.index += 1;
  const shouldFinish = activeQuiz.index >= activeQuiz.questions.length || getQuizRemainingSeconds() <= 0;
  if (activeQuiz.kind === "daily" && shouldFinish) {
    activeQuiz.finishing = true;
    if (quizFxTimer) clearTimeout(quizFxTimer);
    quizFxTimer = setTimeout(() => finishQuiz(), 700);
    return;
  }
  if (shouldFinish) finishQuiz();
  else render();
}

function finishQuiz() {
  if (!activeQuiz) return;
  const profile = activeProfile();
  // 統一打包本次結算摘要供 renderQuizSummary 使用
  const summary = {
    kind: activeQuiz.kind,
    correct: activeQuiz.correct,
    total: activeQuiz.answers,
    score: activeQuiz.score || 0,
    mistakes: activeQuiz.mistakes || [],
    finishedAt: new Date().toISOString(),
    extra: null,
  };
  if (activeQuiz.kind === "placement") {
    const maxScore = activeQuiz.questions.reduce((sum, item) => sum + item.level * 8 + 4, 0);
    profile.placement = {
      score: Math.round((activeQuiz.score / maxScore) * 100),
      correct: activeQuiz.correct,
      total: activeQuiz.answers,
      finishedAt: new Date().toISOString(),
      mistakes: activeQuiz.mistakes || [],
    };
    // placement 仍走原本的 result 畫面（內容比較特殊：分等級、命名）
    saveState();
    stopActiveQuiz();
    navigateTo("result");
    render();
    return;
  }
  if (activeQuiz.kind === "review") {
    const passed = activeQuiz.answers > 0 && activeQuiz.correct / activeQuiz.answers >= 0.7;
    if (passed) {
      state.rankTier = Math.min(RANK_TITLES.length, (state.rankTier || 1) + 1);
      state.achievements.grandReviews += 1;
      summary.extra = { passed: true, message: t("reviewPassed") };
    } else {
      summary.extra = { passed: false };
    }
  } else if (activeQuiz.kind === "weekly") {
    profile.weeklyTests = profile.weeklyTests || {};
    profile.weeklyTests[todayKey()] = {
      correct: activeQuiz.correct,
      total: activeQuiz.answers,
      finishedAt: new Date().toISOString(),
    };
  } else if (activeQuiz.kind === "daily") {
    profile.dailyTests[todayKey()] = {
      correct: activeQuiz.correct,
      total: activeQuiz.answers,
      finishedAt: new Date().toISOString(),
    };
    stampToday();
  }
  summary.battle = settleQuizBattle(activeQuiz.battle);
  // 把結果暫存到 state.lastQuizSummary 供 renderQuizSummary 讀取
  state.lastQuizSummary = summary;
  toast = "";
  saveState();
  stopActiveQuiz();
  navigateTo("quiz-summary", { clearHistory: true, pushHistory: false });
  render();
}

// 每日學習鎖定 key: 日期::庫::目標
// 同一天無論按幾次「學習 10 字」都會看到相同的字；隔日才換新
function dailyStudyKey(libraryId = null) {
  return `${todayKey()}::${libraryId || "built-in"}::${activeGoal()}`;
}

function dailyStudyCompleted(libraryId = null) {
  state.dailyStudyCompleted = state.dailyStudyCompleted || {};
  const key = dailyStudyKey(libraryId);
  if (state.dailyStudyCompleted[key]) return true;
  const locked = state.dailyStudy?.[key];
  if (!Array.isArray(locked) || !locked.length) return false;
  const learnedSet = new Set(activeProfile().learned || []);
  return locked.every((wordText) => learnedSet.has(wordText));
}

// 今日鎖定的 10 字是否已全部學過（profile.learned 涵蓋全部）
// 給「刷新單字」按鈕用：只有完成今日後才能點
function todayLockComplete(libraryId = null) {
  state.dailyStudy = state.dailyStudy || {};
  const key = dailyStudyKey(libraryId);
  const locked = state.dailyStudy[key];
  if (!Array.isArray(locked) || !locked.length) return false;
  if (!dailyStudyCompleted(libraryId)) return false;
  // 加條件：今日每日測驗通過 70% 才能解鎖刷新
  const profile = activeProfile();
  const todayTest = profile.dailyTests?.[todayKey()];
  if (!todayTest || !todayTest.total) return false;
  return todayTest.correct / todayTest.total >= 0.7;
}

function createStudySession(libraryId = null) {
  const profile = activeProfile();
  const source = libraryId
    ? (state.customLibraries.find((library) => library.id === libraryId)?.words || [])
    : wordsForGoal(activeGoal(), words);
  if (!source.length) {
    return { phase: "empty", previewIndex: 0, words: [], libraryId, questions: [], index: 0, correct: 0 };
  }

  // 1) 先查當日是否已有鎖定的 10 字（隔日才會重新挑）
  state.dailyStudy = state.dailyStudy || {};
  const dailyKey = dailyStudyKey(libraryId);
  let finalWords = [];
  if (Array.isArray(state.dailyStudy[dailyKey]) && state.dailyStudy[dailyKey].length) {
    const lockedWords = state.dailyStudy[dailyKey];
    finalWords = lockedWords.map((wt) => source.find((item) => item.word === wt)).filter(Boolean);
  }

  // 2) 沒有當日鎖定 → 從「之前完全沒做過」的字裡挑 10 個（按段位加權）
  if (!finalWords.length) {
    const seen = studyHistorySet(libraryId); // 跨日累積的學習史
    const learnedSet = new Set(profile.learned || []);
    const unseen = libraryId
      ? source.filter((item) => !seen.has(item.word))
      : source.filter((item) => !seen.has(item.word) && !profile.learned.includes(item.word));
    if (!unseen.length) {
      const recoverable = source.filter((item) => !learnedSet.has(item.word));
      if (!libraryId && recoverable.length) {
        finalWords = tierWeightedSample(recoverable, Math.min(10, recoverable.length), wordDifficultyLevelId());
        state.dailyStudy[dailyKey] = finalWords.map((item) => item.word);
        recordStudyHistory(finalWords.map((item) => item.word), libraryId);
        saveState();
      } else if (!libraryId) {
        return { phase: "all-done", previewIndex: 0, words: [], libraryId, questions: [], index: 0, correct: 0 };
      } else {
        finalWords = tierWeightedSample(source, Math.min(10, source.length), wordDifficultyLevelId());
        state.dailyStudy[dailyKey] = finalWords.map((item) => item.word);
        saveState();
      }
    } else {
      // 依玩家段位選字：低段位多挑簡單字、高段位多挑難字
      finalWords = tierWeightedSample(unseen, Math.min(10, unseen.length), wordDifficultyLevelId());
      state.dailyStudy[dailyKey] = finalWords.map((item) => item.word);
      recordStudyHistory(finalWords.map((item) => item.word), libraryId);
      saveState();
    }
  }

  if (!finalWords.length) {
    return { phase: "empty", previewIndex: 0, words: [], libraryId, questions: [], index: 0, correct: 0 };
  }

  const session = {
    phase: finalWords.length ? "preview" : "empty",
    previewIndex: 0,
    words: finalWords,
    libraryId,
    questions: finalWords.map((item, index) => buildQuestion(item, libraryId ? (index % 2 === 0 ? "meaning" : "word") : (index % 2 === 0 ? "meaning" : "cloze"))),
    index: 0,
    correct: 0,
  };
  // 進入字卡前先 prefetch，讓例句/音標/釋義第一張就有完整內容、不會 lag 跳改
  if (finalWords.length) prefetchStudyWords(finalWords);
  return session;
}

// 並行 prefetch 字典資料（不阻塞 UI）：發完所有請求後一次重 render
// 每個字 fetch 完都會走 applyDictionaryEntry 更新 word object，render 直接讀到完整資料
function prefetchStudyWords(items) {
  const tasks = (items || []).map((item) => {
    const wordText = String(item?.word || "").trim().toLowerCase();
    if (!wordText || isEntryComplete(item)) return Promise.resolve();
    const key = `${state.native || "zh-Hant"}::${wordText}`;
    if (cambridgeExampleRequests.has(key)) return Promise.resolve();
    cambridgeExampleRequests.add(key);
    return fetch(dictionaryLookupUrl(wordText))
      .then((res) => res.json())
      .then((entry) => {
        if (!entry) return;
        applyDictionaryEntry(wordText, entry);
      })
      .catch(() => {})
      .finally(() => cambridgeExampleRequests.delete(key));
  });
  // 全部 settle（最久不超過 5 秒）後重新 render；不阻塞當下流程
  Promise.race([
    Promise.allSettled(tasks),
    new Promise((r) => setTimeout(r, 5000)),
  ]).then(() => render());
}

// 錯題加強：剛才答錯的字優先，再從弱點池補到 12 個；同一個字在任何測驗答對兩次就會移出弱點池
const WEAK_TRAINING_SIZE = 12;
function createWeakTrainingSession(priorityWords = []) {
  const profile = activeProfile();
  const weakSet = new Set(profile.weak || []);
  // 弱點字可能來自內建或自訂庫；同一個字優先用目前目標那一筆
  const source = uniqueWordObjects([...weakSet].map((wordText) => entryForActiveGoal(wordText)).filter(Boolean));
  if (!source.length) {
    return { phase: "empty", previewIndex: 0, words: [], libraryId: null, questions: [], index: 0, correct: 0 };
  }
  const priority = source.filter((item) => priorityWords.includes(item.word));
  const others = shuffle(source.filter((item) => !priorityWords.includes(item.word)));
  const selectedWords = [...priority, ...others].slice(0, Math.max(WEAK_TRAINING_SIZE, priority.length));
  // 輪流換題型（看英文選中文、看中文選英文、克漏字），沒有例句的字會自動退回字義題
  const questionTypes = ["word", "cloze", "meaning"];
  return {
    phase: "quiz",
    previewIndex: 0,
    words: selectedWords,
    libraryId: null,
    questions: selectedWords.map((item, index) => buildQuestion(item, questionTypes[index % questionTypes.length])),
    index: 0,
    correct: 0,
    score: 0,
    answers: 0,
    startedAt: Date.now(),
    duration: 240,
    mistakes: [],
    timer: null,
    mode: "weak",
  };
}

// 仍保留 reset 函式（給 admin / 除錯用），但日常流程不會自動呼叫
function resetStudyHistory(libraryId = null) {
  if (!state.studyHistory) state.studyHistory = {};
  const key = studyHistoryKey(libraryId);
  state.studyHistory[key] = [];
  // 也清掉今日鎖定，讓下次進入會重新挑
  if (state.dailyStudy) {
    Object.keys(state.dailyStudy).forEach((k) => {
      if (k.endsWith(`::${libraryId || "built-in"}::${activeGoal()}`)) {
        delete state.dailyStudy[k];
      }
    });
  }
}

function moveCard(step) {
  if (!studySession) return;
  const max = studySession.words.length - 1;
  studySession.previewIndex = Math.min(max, Math.max(0, studySession.previewIndex + step));
  render();
}

function speakerIcon() {
  return `<svg class="icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
}

// 鍵盤操作：字卡 ← → 換卡、空白鍵朗讀；測驗數字鍵 1–4 作答；Esc 關閉字卡視窗
document.addEventListener("keydown", (event) => {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
  const target = event.target;
  if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
  if (event.key === "Escape" && cardModalWord) {
    cardModalWord = null;
    render();
    return;
  }
  if (screen === "study" && studySession?.phase === "preview") {
    if (event.key === "ArrowRight") { event.preventDefault(); moveCard(1); return; }
    if (event.key === "ArrowLeft") { event.preventDefault(); moveCard(-1); return; }
    if (event.key === " ") {
      event.preventDefault();
      const current = studySession.words[studySession.previewIndex];
      if (current) speakWord(current.word);
      return;
    }
  }
  if (/^[1-9]$/.test(event.key)) {
    const options = document.querySelectorAll("[data-quiz-answer], [data-study-answer]");
    const button = options[Number(event.key) - 1];
    if (button && !button.disabled) {
      event.preventDefault();
      button.click();
    }
  }
});

const SPEAK_RATE_NORMAL = 0.86;
const SPEAK_RATE_SLOW = 0.5;

function speakWord(wordText, rate = SPEAK_RATE_NORMAL) {
  if (!("speechSynthesis" in window) || !wordText) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(wordText);
  utterance.lang = "en-US";
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
}

// 聽音選字題：進入該題時自動播一次發音（同一題重 render 不重播）
let lastListenAutoplayKey = "";
function scheduleListenAutoplay(wordText, kind, index) {
  const key = `${kind}:${index}:${wordText}`;
  if (lastListenAutoplayKey === key) return;
  lastListenAutoplayKey = key;
  setTimeout(() => speakWord(wordText), 350);
}

function answerStudy(answer, correct) {
  if (!studySession || studySession.phase !== "quiz") return;
  const profile = activeProfile();
  const current = studySession.questions[studySession.index];
  if (!current) return;
  studySession.mistakes = studySession.mistakes || [];
  if (answer === correct) {
    toast = t("hitStudy");
    profile.learned = Array.from(new Set([...profile.learned, current.word]));
    // 弱點加強答對時保留原本的學習日期，避免舊字被誤算成「本週新學」
    if (studySession.mode !== "weak" || !profile.learnedLog[current.word]) profile.learnedLog[current.word] = todayKey();
    studySession.correct += 1;
    recordCorrect();
    addXp(10 + getWordTier(current));
    triggerCelebrate();
    srsUpdate(current.word, true);
    advanceWeakMastery(current.word);
  } else {
    toast = msg("missStudy", { answer: correct });
    studySession.mistakes.push({ word: current.word, correct });
    addWeak(current.word);
    recordWrong();
    addXp(2);
    srsUpdate(current.word, false);
  }
  studySession.index += 1;
  if (studySession.index >= studySession.questions.length) {
    state.streak += 1;
    if (studySession.mode !== "weak") {
      const completedWords = (studySession.words || []).map((item) => item.word).filter(Boolean);
      profile.learned = Array.from(new Set([...(profile.learned || []), ...completedWords]));
      completedWords.forEach((wordText) => {
        profile.learnedLog[wordText] = todayKey();
      });
      state.dailyStudyCompleted = state.dailyStudyCompleted || {};
      state.dailyStudyCompleted[dailyStudyKey(studySession.libraryId || null)] = true;
    }
    // 進結算畫面
    state.lastQuizSummary = {
      kind: studySession.mode === "weak" ? "weak" : "recall",
      correct: studySession.correct || 0,
      total: studySession.questions.length,
      mistakes: studySession.mistakes || [],
      finishedAt: new Date().toISOString(),
      extra: null,
    };
    studySession = null;
    saveState();
    navigateTo("quiz-summary", { clearHistory: true, pushHistory: false });
    render();
    return;
  }
  saveState();
  render();
}

function recordCorrect() {
  const a = state.achievements;
  a.totalCorrect += 1;
  a.currentCombo += 1;
  a.bestCombo = Math.max(a.bestCombo, a.currentCombo);
}

function recordWrong() {
  state.achievements.currentCombo = 0;
}

function getLevel(score) {
  return levels.reduce((matched, level) => (score >= level.min ? level : matched), levels[0]);
}

function addWeak(wordText) {
  const profile = activeProfile();
  profile.weak = Array.from(new Set([...profile.weak, wordText]));
  profile.weakHits = profile.weakHits || {};
  if (!(wordText in profile.weakHits)) profile.weakHits[wordText] = 0;
}

function advanceWeakMastery(wordText) {
  const profile = activeProfile();
  if (!profile.weak?.includes(wordText)) return false;
  profile.weakHits = profile.weakHits || {};
  profile.weakHits[wordText] = (profile.weakHits[wordText] || 0) + 1;
  if (profile.weakHits[wordText] >= 2) {
    profile.weak = profile.weak.filter((entry) => entry !== wordText);
    delete profile.weakHits[wordText];
    return true;
  }
  return false;
}

function getWordsLearnedOn(date) {
  const profile = activeProfile();
  return profile.learned.filter((wordText) => profile.learnedLog[wordText] === date);
}

function getWordsLearnedBefore(date) {
  const profile = activeProfile();
  return profile.learned.filter((wordText) => profile.learnedLog[wordText] && profile.learnedLog[wordText] < date);
}

// 單字索引：allWords() 每次都會複製 1.7 萬筆陣列，迴圈內反覆呼叫會拖慢整頁 render。
// 以「內建字陣列 + 各自訂庫字數」當簽章，資料變動時才重建。
let wordIndexCache = { source: null, signature: "", map: new Map() };
function findWord(wordText) {
  const libraries = state.customLibraries || [];
  const signature = libraries.map((library) => `${library.id}:${(library.words || []).length}`).join("|");
  if (wordIndexCache.source !== words || wordIndexCache.signature !== signature) {
    const map = new Map();
    allWords().forEach((item) => {
      if (item && !map.has(item.word)) map.set(item.word, item);
    });
    wordIndexCache = { source: words, signature, map };
  }
  return wordIndexCache.map.get(wordText);
}

function buildWordChoices(item) {
  return buildChoices(item, "word");
}

function buildMeaningChoices(item) {
  return buildChoices(item, "meaning");
}

// ===== 選項（干擾項）=====
// 原則：同一個考試目標、同詞性、難度相近；優先挑「拼字相近」（adapt／adopt）或「意思同一個範圍但不同」（借／租）的字；
// 意思幾乎一樣的字（巨大的／龐大的）不能當選項，四個選項彼此也不能同義，否則題目會有兩個答案。
const meaningSenseCache = new Map();
function meaningInfo(meaning) {
  const key = String(meaning || "");
  let info = meaningSenseCache.get(key);
  if (!info) {
    const senses = String(compactMeaning(key) || key)
      .split(/[、；;,，/]/)
      .map((part) => part.replace(/[（(][^）)]*[）)]/g, "").replace(/[的地得了之]/g, "").trim())
      .filter(Boolean);
    info = { senses, chars: new Set(senses.join("")) };
    meaningSenseCache.set(key, info);
  }
  return info;
}

function meaningOverlap(a, b) {
  const ca = meaningInfo(a).chars;
  const cb = meaningInfo(b).chars;
  if (!ca.size || !cb.size) return 0;
  let common = 0;
  ca.forEach((ch) => {
    if (cb.has(ch)) common += 1;
  });
  return common / (ca.size + cb.size - common);
}

// 判斷兩個字是否「中文意思一樣或幾乎一樣」，寧可多排除，也不要讓題目出現兩個正解。
// 規則：義項相同或互相包含（租／租用）、兩個雙字詞最後一個字相同（迅速／快速、巨大／龐大）、整體用字重疊過半。
function sameMeaning(a, b) {
  const sa = meaningInfo(a).senses;
  const sb = meaningInfo(b).senses;
  if (!sa.length || !sb.length) return false;
  const related = sa.some((x) => sb.some((y) => x.includes(y) || y.includes(x) || (x.length >= 2 && y.length >= 2 && x.slice(-1) === y.slice(-1))));
  return related || meaningOverlap(a, b) >= 0.5;
}

function editDistance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const temp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = temp;
    }
  }
  return row[b.length];
}

function formSimilarity(a, b) {
  const x = String(a).toLowerCase();
  const y = String(b).toLowerCase();
  let score = 1 - editDistance(x, y) / Math.max(x.length, y.length, 1);
  if (x[0] === y[0]) score += 0.15;
  if (x.length > 3 && x.slice(-3) === y.slice(-3)) score += 0.1;
  return score;
}

// 依「目標＋詞性」快取候選池；內建字或自訂庫有變動時重建
const distractorPoolCache = new Map();
let distractorPoolSignature = "";
function cachedPool(key, build) {
  const signature = `${words.length}|${(state.customLibraries || []).map((library) => `${library.id}:${(library.words || []).length}`).join(",")}`;
  if (signature !== distractorPoolSignature) {
    distractorPoolCache.clear();
    distractorPoolSignature = signature;
  }
  if (!distractorPoolCache.has(key)) distractorPoolCache.set(key, build());
  return distractorPoolCache.get(key);
}

function distractorPool(item) {
  const pos = normalizePos(item.pos);
  const goal = item.library === "built-in" ? item.goal?.[0] || "" : "";
  const sameGoal = goal
    ? cachedPool(`${goal}|${pos}`, () => uniqueWordObjects(words.filter((candidate) => candidate.goal.includes(goal) && normalizePos(candidate.pos) === pos && hasText(candidate.meaning))))
    : [];
  const pool = sameGoal.length >= 12
    ? sameGoal
    : cachedPool(`*|${pos}`, () => uniqueWordObjects(allWords().filter((candidate) => normalizePos(candidate.pos) === pos && hasText(candidate.meaning))));
  return pool.filter((candidate) => candidate.word !== item.word);
}

function getSimilarWords(item) {
  const level = item.level || 1;
  const all = distractorPool(item);
  const near = all.filter((candidate) => Math.abs((candidate.level || 1) - level) <= 1);
  const pool = near.length >= 30 ? near : all;
  const scored = pool.map((candidate) => {
    const lengthGap = Math.abs(candidate.word.length - item.word.length);
    const form = lengthGap <= 4 ? formSimilarity(item.word, candidate.word) : 0;
    const related = meaningOverlap(candidate.meaning, item.meaning);
    return { candidate, form, related, score: form * 3 + related * 2 - Math.abs((candidate.level || 1) - level) * 0.2 };
  });
  // 先用便宜的分數排出前 40 名，再做比較嚴格的同義檢查
  const top = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 40)
    .filter((entry) => !sameMeaning(entry.candidate.meaning, item.meaning));
  if (!top.length) return [];
  const byForm = [...top].sort((a, b) => b.form - a.form)[0];
  const byMeaning = [...top].sort((a, b) => b.related - a.related)[0];
  const picks = [];
  if (byForm.form >= 0.45) picks.push(byForm.candidate);
  if (byMeaning.related > 0) picks.push(byMeaning.candidate);
  // 其餘從前 10 名洗牌補，讓同一個字每次出題的選項有些變化
  return uniqueWordObjects([...picks, ...shuffle(top.slice(0, 10)).map((entry) => entry.candidate)]);
}

function buildChoices(item, mode) {
  const valueOf = (entry) => (mode === "word" ? entry.word : compactMeaning(entry.meaning));
  const chosen = [item];
  const values = new Set([valueOf(item)]);
  const tryAdd = (candidate) => {
    if (chosen.length >= 4 || !candidate) return;
    const value = valueOf(candidate);
    if (!value || values.has(value)) return;
    if (chosen.some((entry) => sameMeaning(entry.meaning, candidate.meaning))) return;
    chosen.push(candidate);
    values.add(value);
  };
  getSimilarWords(item).forEach(tryAdd);
  if (chosen.length < 4) shuffle(distractorPool(item)).forEach(tryAdd);
  if (chosen.length < 4) shuffle(allWords().filter((candidate) => candidate.word !== item.word)).slice(0, 200).forEach(tryAdd);
  return shuffle(chosen.map(valueOf));
}

// 需求2 #1：干擾項從 allWords()（內建 + 所有自訂庫）取，不受 activeLibrary 限制
// 即使單字庫很小，選項也不會重複度太高

// 中文字義相近度：共享字元 Jaccard 相似度（0~1）

// 兩個 meaning 是否「太像」（70% 字符共享 + 至少其中之一很短時更嚴格）

function sampleUniqueWords(source, count) {
  return shuffle(Array.from(new Map(source.map((item) => [item.word, item])).values())).slice(0, count);
}

function uniqueWords(wordTexts) {
  return Array.from(new Set(wordTexts));
}

function uniqueWordObjects(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.word)) return false;
    seen.add(item.word);
    return true;
  });
}

function getQuizRemainingSeconds() {
  if (!activeQuiz?.startedAt) return 180;
  return Math.max(0, activeQuiz.duration - Math.floor((Date.now() - activeQuiz.startedAt) / 1000));
}

function updateQuizTimer() {
  const timer = document.querySelector("#timer");
  if (!timer || !activeQuiz) return;
  const remaining = getQuizRemainingSeconds();
  timer.textContent = formatTime(remaining);
  if (remaining <= 0) finishQuiz();
}

function formatTime(seconds) {
  const min = String(Math.floor(seconds / 60)).padStart(1, "0");
  const sec = String(seconds % 60).padStart(2, "0");
  return `${min}:${sec}`;
}

function shuffle(items) {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

bootstrap();
// v0.2.3 maintenance pass: escapeHtml + custom-library progress fix (2026-07-07)
