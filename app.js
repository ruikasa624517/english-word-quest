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
  const d = new Date();
  const offset = Number(state?.dayOffset || 0);
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

const i18n = {
  "zh-Hant": {
    subtitle: "遊戲化英文單字修煉場",
    introTitle: "Vocab Arcana",
    introCopy:
      "選定目標後直接開始單字修煉；系統會依照你的母語、弱點與週排名段位安排單字戰鬥。每日測驗會混入今天學的字與以前學過的字，降低遺忘。",
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
    weeklyTitle: "週測驗 · 5 分鐘",
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
    quizSummaryTitle: "測驗結束 · 答題回顧",
    wrongCount: "錯題數",
    correctAnswer: "正解",
    dashboardCopy: "目標：{goal}。建議先一次看完 10 個單字，再進行背誦測驗；每日測驗會混入舊字追蹤記憶。",
    todayProgress: "今日進度",
    todayProgressCopy: "今天已學 {today} 字；總計 {total} 字。",
    previewEyebrow: "10 字預覽",
    previewTitle: "先看完整批單字",
    previewCopy: "這一輪會先讓你快速看完 10 個字，接著才進入背誦測驗。舊字與弱點字會依照你的進度混入。",
    recallTitle: "背誦測驗",
    weakTitle: "暗影錯題本",
    weakCopyFilled: "這些單字會在學習與每日測驗中更常出現。",
    weakCopyEmpty: "目前沒有錯題。去打一輪單字戰鬥吧。",
    hit: "命中。",
    hitStudy: "命中！這個單字已刻進魔導書。",
    miss: "失手，正解是 {answer}。",
    missStudy: "失手。正解是「{answer}」，已加入暗影錯題本。",
    dailyDone: "每日測驗完成：{correct}/{total}",
    traveler: "旅人",
    statPlacement: "分級測驗",
    statWords: "每輪單字",
    statRanks: "魔導階級",
    speak: "朗讀",
    previousCard: "上一張",
    nextCard: "下一張",
    cardProgress: "{current} / {total}",
    cardHint: "往右滑進入下一個單字",
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
    inventoryCopy: "查看目前可用的討伐道具。",
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
    importCopy: "輸入每行一個單字，格式：英文, 中文意思, 例句。也可以上傳照片後，把辨識出的文字貼到輸入框。",
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
    weakTrain: "弱點加強",
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
    weeklyTitle: "Weekly Test · 5 min",
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
    quizSummaryTitle: "Quiz finished · Review",
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
    cardHint: "Swipe right to move to the next word",
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
    importCopy: "Enter one word per line: English, meaning, example. You can also upload a photo and paste recognized text into the box.",
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
    weeklyTitle: "週テスト · 5分",
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
    quizSummaryTitle: "テスト終了 · 振り返り",
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
    cardHint: "右にスワイプすると次の単語へ進みます",
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
    importCopy: "1行に1語を入力：英語, 意味, 例文。写真をアップロードして、認識した文字を貼り付けることもできます。",
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
    weeklyTitle: "주간 테스트 · 5분",
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
    quizSummaryTitle: "테스트 종료 · 답안 정리",
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
    cardHint: "오른쪽으로 스와이프하면 다음 단어",
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
    importCopy: "한 줄에 하나의 단어 입력: 영어, 뜻, 예문. 사진을 올려 인식된 텍스트를 붙여넣을 수도 있습니다.",
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
    weeklyTitle: "Prueba semanal · 5 min",
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
    quizSummaryTitle: "Prueba terminada · Repaso",
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
    cardHint: "Desliza a la derecha para la siguiente palabra",
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
    importCopy: "Una palabra por línea: inglés, significado, ejemplo. También puedes subir una foto y pegar el texto reconocido.",
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
let battle = null;
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
  battle = null;
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

let wordTierCacheKey = "";
let wordTierCache = new Map();

function wordTierItemKey(item) {
  return `${item?.library || "core"}::${String(item?.word || "").toLowerCase()}`;
}

function wordTierSignature() {
  const custom = (state.customLibraries || [])
    .map((lib) => `${lib.id}:${(lib.words || []).map((word) => `${word.word}:${word.level || ""}`).join(",")}`)
    .join("|");
  return `${words.length}:${custom}`;
}

function rebuildWordTierCache(signature) {
  const grouped = new Map();
  allWords().forEach((candidate) => {
    const level = candidate.level || 1;
    if (!grouped.has(level)) grouped.set(level, []);
    grouped.get(level).push(candidate);
  });
  wordTierCache = new Map();
  grouped.forEach((list) => {
    const ordered = [...list].sort((a, b) => {
      if (a.word.length !== b.word.length) return a.word.length - b.word.length;
      return a.word.localeCompare(b.word);
    });
    ordered.forEach((candidate, index) => {
      const tier = Math.min(5, Math.floor((index / Math.max(1, ordered.length)) * 5) + 1);
      wordTierCache.set(wordTierItemKey(candidate), tier);
      if (!candidate.library && !wordTierCache.has(String(candidate.word || "").toLowerCase())) {
        wordTierCache.set(String(candidate.word || "").toLowerCase(), tier);
      }
    });
  });
  wordTierCacheKey = signature;
}

function getWordTier(item) {
  const signature = wordTierSignature();
  if (signature !== wordTierCacheKey) rebuildWordTierCache(signature);
  return wordTierCache.get(wordTierItemKey(item)) || wordTierCache.get(String(item?.word || "").toLowerCase()) || 1;
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
  state.weeklyXpLog = state.weeklyXpLog || {};
  const today = todayKey();
  state.xpLog[today] = (state.xpLog[today] || 0) + amount;
  state.weeklyXpLog[today] = (state.weeklyXpLog[today] || 0) + amount;
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

function ensureRivals() {
  const names = [
    "夜澤翼", "Mika_01", "霧島澪", "Kaze", "月森琉",
    "WhiteFox", "星川希", "WindRune", "Nori", "柚木遙",
    "朝霧悠真", "Rin", "海堂蒼", "LunaByte", "Haru_7",
    "橘凜音", "Mori", "三澤葵", "LittleNorth", "Sora.n",
  ];
  const existing = Array.isArray(state.rivals) ? state.rivals : [];
  // 已建立過 → 補上缺漏的 strengthBias 欄位（舊資料相容）
  if (existing.length === names.length) {
    let patched = false;
    state.rivals = existing.map((rival, index) => {
      if (rival.strengthBias !== undefined) return rival;
      patched = true;
      const seed = hashText(rival.name || names[index]);
      return { ...rival, strengthBias: ((seed % 71) / 100) - 0.35 };
    });
    if (patched) saveState();
    return;
  }
  // 首次建立：給每個對手一個「個性」 — 強度偏移與每日基準
  state.rivals = names.map((name, index) => {
    const saved = existing[index];
    const seed = hashText(name);
    return {
      name,
      // strengthBias: -0.35 ~ +0.35，決定這個對手長期 trend 是落在玩家之上還是之下
      strengthBias: saved?.strengthBias ?? (((seed % 71) / 100) - 0.35),
      dailyBase: saved?.dailyBase ?? 10 + (seed % 9) * 2,
      xp: saved?.xp ?? 0,
      kills: saved?.kills ?? 0,
      weeklyXp: saved?.weeklyXp ?? 0,
      weeklyKills: saved?.weeklyKills ?? 0,
    };
  });
}

function ensureRankingWeek() {
  const current = currentWeekKey();
  if (!state.rankingWeekKey) state.rankingWeekKey = current;
  if (state.rankingWeekKey === current) return;
  if (state.limitedBattleTitle?.expiresWeekKey && state.limitedBattleTitle.expiresWeekKey <= current) {
    state.limitedBattleTitle = null;
  }
  const player = {
    isPlayer: true,
    name: state.user?.name || t("rankYou"),
    weekXp: weeklyXpTotal(),
    weekKills: weeklyKillTotal(),
  };
  const rivals = state.rivals.map((rival, index) => ({
    ...rival,
    weekXp: rival.weeklyXp || 0,
    weekKills: rival.weeklyKills || 0,
    recentXp: rivalWeeklyXp(rival, index),
  }));
  const xpRows = leaderboardRows(player, rivals, "weekXp");
  const killRows = leaderboardRows(player, rivals, "weekKills");
  const playerIndex = xpRows.findIndex((item) => item.isPlayer);
  if (playerIndex > -1) {
    // 用「同分同名次」邏輯計算實際名次再判定升降
    const playerScore = xpRows[playerIndex].weekXp || 0;
    // 嚴格優於玩家分數的人數 + 1 = 玩家名次
    const playerRank = xpRows.filter((r) => (r.weekXp || 0) > playerScore).length + 1;
    // 嚴格輸給玩家的人數 = 後面的位置數
    const behindCount = xpRows.filter((r) => (r.weekXp || 0) < playerScore).length;
    if (playerRank <= 3) state.rankTier = Math.min(RANK_TITLES.length, (state.rankTier || 1) + 1);
    if (behindCount < 3) state.rankTier = Math.max(1, (state.rankTier || 1) - 1);
  }
  const playerKillIndex = killRows.findIndex((item) => item.isPlayer);
  if (playerKillIndex > -1 && (killRows[playerKillIndex].weekKills || 0) > 0) {
    const playerKills = killRows[playerKillIndex].weekKills || 0;
    const playerKillRank = killRows.filter((row) => (row.weekKills || 0) > playerKills).length + 1;
    state.pendingBattleTitle = {
      rank: playerKillRank,
      earnedWeekKey: state.rankingWeekKey,
      claimWeekKey: current,
      expiresWeekKey: nextWeekKey(current),
    };
  } else {
    state.pendingBattleTitle = null;
  }
  state.rivals = state.rivals.map((rival) => ({
    ...rival,
    weeklyXp: 0,
    weeklyKills: 0,
  }));
  state.weeklyXpLog = {};
  state.weeklyKillLog = {};
  state.rankingWeekKey = current;
  saveState();
}

// 每次開排行榜都跑：把對手分數往玩家附近拉，並加上隨機浮動讓排名會洗牌
function driftRivalsTowardPlayer() {
  ensureRivals();
  ensureRankingWeek();
  const playerXp = Math.max(weeklyXpTotal() || 0, 60);
  const playerKills = Math.max(weeklyKillTotal() || 0, 1);
  // 每個玩家 session 內，對手浮動的時間 seed —— 每 10 分鐘換一組，避免一秒一變
  const timeSlot = Math.floor(Date.now() / (10 * 60 * 1000));
  state.rivals = state.rivals.map((rival, index) => {
    const seed = hashText(`${rival.name}:${index}:${timeSlot}`);
    // 對手目標 XP：玩家 ± 35% 範圍，以 strengthBias 偏移
    const baseTarget = playerXp * (1 + rival.strengthBias * 0.55);
    // 加入 ±15% 隨機浮動
    const noise = ((seed % 31) - 15) / 100; // -0.15 ~ +0.15
    const xpTarget = Math.round(baseTarget * (1 + noise));
    // 慢慢朝目標移動（70/30 lerp），避免一次跳太多
    const newXp = Math.round(rival.weeklyXp * 0.35 + xpTarget * 0.65);
    // 卡在玩家 ±30% 區間內，保持可追趕
    const xpFloor = Math.max(0, Math.round(playerXp * 0.7));
    const xpCeil = Math.round(playerXp * 1.3) + 18;
    // Kills 邏輯類似但範圍較小
    const killBase = playerKills * (1 + rival.strengthBias * 0.45);
    const killNoise = (((seed >> 5) % 21) - 10) / 100;
    const killTarget = Math.max(0, Math.round(killBase * (1 + killNoise)));
    const newKills = Math.round(rival.weeklyKills * 0.35 + killTarget * 0.65);
    const killFloor = Math.max(0, playerKills - 3);
    const killCeil = playerKills + 4;
    return {
      ...rival,
      xp: rival.xp || 0,
      kills: rival.kills || 0,
      weeklyXp: clamp(newXp, xpFloor, xpCeil),
      weeklyKills: clamp(newKills, killFloor, killCeil),
    };
  });
  state.lastRivalAdvanceDate = todayKey();
  saveState();
}

function recentXpTotal() {
  state.xpLog = state.xpLog || {};
  return recentDates(3).reduce((sum, date) => sum + (state.xpLog[date] || 0), 0);
}

function weeklyXpTotal() {
  state.weeklyXpLog = state.weeklyXpLog || {};
  const current = currentWeekKey();
  return Object.entries(state.weeklyXpLog).reduce((sum, [date, amount]) => (currentWeekKey(date) === current ? sum + amount : sum), 0);
}

function weeklyKillTotal() {
  state.weeklyKillLog = state.weeklyKillLog || {};
  const current = currentWeekKey();
  return Object.entries(state.weeklyKillLog).reduce((sum, [date, amount]) => (currentWeekKey(date) === current ? sum + amount : sum), 0);
}

function recentDates(days) {
  return Array.from({ length: days }, (_, index) => {
    const d = new Date(todayKey() + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() - index);
    return d.toISOString().slice(0, 10);
  });
}

function hashText(text) {
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// 舊版每日只跑一次的 advanceRivals 已由 driftRivalsTowardPlayer 取代
// 保留 export 名稱 advanceRivals 作為相容 alias，內部直接呼叫 drift
function advanceRivals() {
  driftRivalsTowardPlayer();
}

// 顯示用的「最近 XP」：不再是固定值，而是隨玩家 3 天 XP 浮動
function rivalWeeklyXp(rival, index) {
  const playerRecent = Math.max(weeklyXpTotal(), 30);
  const timeSlot = Math.floor(Date.now() / (10 * 60 * 1000));
  const seed = hashText(`recent:${rival.name}:${index}:${timeSlot}`);
  // 對手的「最近 XP」 = 玩家近期 × (1 + strengthBias*0.7 + noise)
  const noise = ((seed % 41) - 20) / 100; // -0.20 ~ +0.20
  const factor = 1 + (rival.strengthBias || 0) * 0.7 + noise;
  const value = Math.round((rival.weeklyXp || 0) * 0.35 + playerRecent * factor * 0.65);
  // 範圍：玩家本週 XP 的 60%-140%，讓追趕感比較明確
  const floor = Math.max(5, Math.round(playerRecent * 0.6));
  const ceil = Math.round(playerRecent * 1.4) + 16;
  return clamp(value, floor, ceil);
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

function createMonster(level) {
  const monsters = [
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
  const base = monsters[(Math.max(0, Math.floor(level / 5) - 1) + Math.floor(Math.random() * monsters.length)) % monsters.length];
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

function canUseAdmin() {
  if (!state.user) return false;
  if (state.user.isAdmin === true) return true;
  return runtimeConfig.adminEmails.includes(String(state.user.email || "").toLowerCase());
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
  if (!state.weeklyXpLog) state.weeklyXpLog = {};
  if (!state.weeklyKillLog) state.weeklyKillLog = {};
  if (!state.rivals) state.rivals = [];
  if (!("lastRankPenaltyDate" in state)) state.lastRankPenaltyDate = null;
  if (!("lastRivalAdvanceDate" in state)) state.lastRivalAdvanceDate = null;
  if (!("rankingWeekKey" in state) || !state.rankingWeekKey) state.rankingWeekKey = currentWeekKey();
  if (typeof state.rankTier !== "number") state.rankTier = 1;
  if (!("pendingBattleTitle" in state)) state.pendingBattleTitle = null;
  if (!("limitedBattleTitle" in state)) state.limitedBattleTitle = null;
  if (state.limitedBattleTitle?.expiresWeekKey && state.limitedBattleTitle.expiresWeekKey <= currentWeekKey()) state.limitedBattleTitle = null;
  if (!state.studyHistory) state.studyHistory = {};
  if (!state.dailyStudy) state.dailyStudy = {};
  if (!state.dailyStudyCompleted) state.dailyStudyCompleted = {};
  if (!state.completedAchievements) state.completedAchievements = [];
  if (!state.equippedTitle) state.equippedTitle = "";
  ensureRivals();
  ensureRankingWeek();
  advanceRivals();
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
    weeklyXpLog: {},
    weeklyKillLog: {},
    rankingWeekKey: "",
    rankTier: 1,
    pendingBattleTitle: null,
    limitedBattleTitle: null,
    rivals: [],
    lastRivalAdvanceDate: null,
    lastRankPenaltyDate: null,
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

function saveState() {
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
  } catch {}
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
    weeklyXpLog: {},
    weeklyKillLog: {},
    rankingWeekKey: null,
    rankTier: 1,
    pendingBattleTitle: null,
    limitedBattleTitle: null,
    rivals: [],
    lastRivalAdvanceDate: null,
    lastRankPenaltyDate: null,
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
          <div class="mark">VA</div>
          <div>
            <h1>Vocab Arcana</h1>
            <p>${t("subtitle")}</p>
          </div>
        </div>
        <div class="controls">
          <select class="select" data-action="native">
            ${nativeLanguages.map((lang) => `<option value="${lang.value}" ${state.native === lang.value ? "selected" : ""}>${lang.label}</option>`).join("")}
          </select>
          ${canUseAdmin() ? `<button class="btn ghost" data-action="admin">${t("admin")}</button>` : ""}
          ${state.user ? `<button class="btn secondary" data-action="signout">${t("signout")}</button>` : ""}
        </div>
      </header>
      ${state.rewardNotice ? `
        <section class="reward-modal" role="dialog" aria-modal="true" aria-label="${state.rewardNotice.title}">
          <div class="reward-backdrop" data-action="dismiss-reward"></div>
          <div class="reward-dialog">
            <strong>${state.rewardNotice.title}</strong>
            <p>${state.rewardNotice.items}</p>
            <div class="actions">
              <button class="btn" data-action="dismiss-reward">${t("claimReward")}</button>
            </div>
          </div>
        </section>
      ` : ""}
      ${content}
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
  if (state.user) ensureRankingWeek();
  if (state.user && !hasSelectedGoal() && screen !== "dashboard" && screen !== "login") {
    screen = "dashboard";
    stopActiveQuiz();
    studySession = null;
    battle = null;
  }
  const app = document.querySelector("#app");
  if (screen === "login") app.innerHTML = renderLogin();
  if (screen === "placement" || screen === "result") screen = "dashboard";
  if (screen === "daily") app.innerHTML = renderQuiz("daily");
  if (screen === "weekly") app.innerHTML = renderQuiz("weekly");
  if (screen === "review") app.innerHTML = renderQuiz("review");
  if (screen === "quiz-summary") app.innerHTML = renderQuizSummary();
  if (screen === "dashboard") app.innerHTML = renderDashboard();
  if (screen === "custom-study-select") app.innerHTML = renderCustomStudySelect();
  if (screen === "custom-library-view") app.innerHTML = renderCustomLibraryView();
  if (screen === "study") app.innerHTML = renderStudy();
  if (screen === "weak") app.innerHTML = renderWeak();
  if (screen === "monster-preview") app.innerHTML = renderMonsterPreview();
  if (screen === "minigame") app.innerHTML = renderMonsterBattle();
  if (screen === "inventory") app.innerHTML = renderInventory();
  if (screen === "import") app.innerHTML = renderImport();
  if (screen === "achievements") app.innerHTML = renderAchievements();
  if (screen === "ranking") app.innerHTML = renderRanking();
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

async function bootstrap() {
  await loadRuntimeConfig();
  words = await loadBuiltInWords();
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
    <section class="layout">
      <div class="hero">
        <div>
          <div class="eyebrow">Adaptive vocabulary RPG</div>
          <h2>${t("introTitle")}</h2>
          <p class="hero-copy">${t("introCopy")}</p>
          <div class="actions">
            <div id="googleSignInButton" class="google-signin-slot"></div>
            ${runtimeConfig.localTestLoginEnabled ? `<button class="btn secondary" data-action="local-test-login">${t("mock")}</button>` : ""}
          </div>
        </div>
        <div class="stats">
          <div class="stat"><strong>7</strong><span>${t("adventurerRank")}</span></div>
          <div class="stat"><strong>10</strong><span>${t("statWords")}</span></div>
          <div class="stat"><strong>7</strong><span>${t("weekly")}</span></div>
        </div>
      </div>
      <aside class="panel">
        <h3>${t("setup")}</h3>
        <div class="form-grid">
          <div class="field">
            <label>${t("name")}</label>
            <input class="input" id="nameInput" value="${t("traveler")}" />
          </div>
          <p class="muted">${t("firebaseNote")}</p>
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
  const current = activeQuiz.questions[activeQuiz.index] || activeQuiz.questions[0];
  const remaining = getQuizRemainingSeconds();
  activeQuiz.timer = setInterval(updateQuizTimer, 1000);
  const isCloze = current.type === "cloze";
  const questionText = isCloze ? clozePrompt(current) : current.word;
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
          <div class="eyebrow">${kind === "review" ? t("review") : kind === "daily" ? t("daily") : kind === "weekly" ? t("weekly") : t("test")}</div>
          <h2 class="page-title">${heading}</h2>
          <p class="muted">${kind === "daily" ? msg("questionProgress", { current: activeQuiz.index + 1, total: activeQuiz.questions.length }) : `${msg("questionProgress", { current: activeQuiz.index + 1, total: activeQuiz.questions.length })} · ${helper}`}</p>
        </div>
        <div class="timer" id="timer">${formatTime(remaining)}</div>
      </div>
      ${kind === "placement" ? `
        <div class="goal-switch">
          <span>${t("activeGoal")}</span>
          ${orderedUserGoals().map((goal) => `<button class="chip ${activeGoal() === goal ? "active" : ""}" data-active-goal="${goal}">${goalLabel(goal)}</button>`).join("")}
        </div>
      ` : ""}
      <div class="meter"><span style="width:${(activeQuiz.index / activeQuiz.questions.length) * 100}%"></span></div>
      <div class="question">
        <div>
          <div class="${isCloze ? "sentence" : "word"}">${questionText}</div>
          <div class="phonetic">${isCloze ? t("clozeHint") : current.phonetic}</div>
        </div>
      </div>
      <div class="answers">
        ${current.choices.map((option) => `<button class="answer" data-quiz-answer="${option}" data-correct="${current.correct}">${option}</button>`).join("")}
      </div>
      <div class="toast">${toast}</div>
      ${quizEffect ? `<div class="quiz-effect ${quizEffect}">${quizEffect === "good" ? t("correctFx") : t("wrongFx")}</div>` : ""}
      <div class="actions">
        <button class="btn secondary" data-action="back">${backButtonLabel()}</button>
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
  const passedNote =
    summary.kind === "review" && summary.extra?.passed
      ? `<p class="hero-copy">${summary.extra.message || t("reviewPassed")}</p>`
      : "";
  return appShell(`
    <section class="panel">
      <div class="eyebrow">${kindLabel} · ${t("quizSummary")}</div>
      <h2 class="page-title">${t("quizSummaryTitle")}</h2>
      <div class="actions top-return-actions">
        <button class="btn" data-action="dashboard">${t("backMap")}</button>
      </div>
      ${passedNote}
      <div class="stats">
        <div class="stat"><strong>${summary.correct}/${summary.total}</strong><span>${t("correct")}</span></div>
        <div class="stat"><strong>${accuracy}%</strong><span>${t("accuracy")}</span></div>
        <div class="stat"><strong>${mistakes.length}</strong><span>${t("wrongCount") || "錯題"}</span></div>
      </div>
      <div class="wrong-review">
        <h3>${t("wrongReview") || "錯題回顧"}</h3>
        ${mistakes.length
          ? `<ul class="word-bank">${mistakes.map((item) => `
              <li class="word-bank-row">
                <div class="word-bank-main">
                  <strong>${item.word || ""}</strong>
                </div>
                <div class="word-bank-meaning">${t("correctAnswer") || "正解"}：${item.correct || ""}</div>
              </li>
            `).join("")}</ul>`
          : `<p class="muted">${t("noWrongAnswers") || "沒有錯題"}</p>`}
      </div>
    </section>
  `);
}

function renderResult() {
  navigateTo("dashboard", { clearHistory: true, pushHistory: false });
  return renderDashboard();
}

function renderDashboard() {
  if (!hasSelectedGoal()) return renderGoalGate();
  ensureRivals();
  ensureRankingWeek();
  const profile = activeProfile();
  const level = currentRankLevel();
  const label = levelLabel(level);
  const today = todayKey();
  const todayCount = todayStudyWords(studySourceForLibrary(), currentStudyLibraryId()).length;
  const todayComplete = todayCount >= 10;
  const learnedPercent = getLearnedPercent();
  const progress = learnedPercent;
  const rank = getPlayerRank();
  const xp = state.xp || 0;
  const nextNeed = xpNeededForRank(rank);
  const currentXp = xpIntoCurrentRank();
  const dueCount = srsDueCount();
  const pendingLevel = state.pendingLevelUp || null;
  const showWeeklyNotice = shouldShowWeeklyNotice();
  const canBattlePendingMonster = canBattlePendingLevelUp();
  const showMonsterChallenge = !!(canBattlePendingMonster && !pendingLevel?.deferred);
  const showLevelUpAlert = !!(pendingLevel && !pendingLevel.monster && !pendingLevel.lootClaimed && !pendingLevel.deferred);
  const pendingBattleTitle = state.pendingBattleTitle || null;
  const limitedBattleTitle = state.limitedBattleTitle?.expiresWeekKey > currentWeekKey() ? state.limitedBattleTitle : null;
  const equipped = achievementBadgeMeta(state.equippedTitle) || achievementBadgeMeta(state.completedAchievements?.[state.completedAchievements.length - 1]) || { icon: "crown", title: t("noTitle"), done: false };
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
    ${showMonsterChallenge ? `
      <div class="modal-backdrop">
        <div class="modal-card" onclick="event.stopPropagation()">
          <h2>${t("monsterPreview")}</h2>
          <p>${t("monsterPreviewCopy")}</p>
          <div class="actions">
            <button class="btn" data-action="start-monster-battle">${t("startBattle")}</button>
            <button class="btn secondary" data-action="defer-battle">${t("deferBattle")}</button>
          </div>
        </div>
      </div>
    ` : ""}
    <section class="dashboard">
      <div class="panel game-panel">
        <div class="eyebrow">${t("dashboard")}</div>
        <div class="page-head">
          <div>
            <h2 class="page-title">${playerDisplayName()} · ${label.name}</h2>
          </div>
          <button class="dashboard-badge" data-action="achievements" title="${equipped.title || t("noTitle")}">
            ${badgeSvg(equipped.icon, equipped.done, equipped.tierIndex || 0)}
          </button>
        </div>
        <div class="goal-switch">
          <span>${t("activeGoal")}</span>
          ${orderedUserGoals().map((goal) => `<button class="chip ${activeGoal() === goal ? "active" : ""}" data-active-goal="${goal}">${goalLabel(goal)}</button>`).join("")}
          ${unselectedGoals().map((goal) => `<button class="chip add" data-add-goal="${goal}">+ ${goalLabel(goal)}</button>`).join("")}
        </div>
        <p class="hero-copy">${msg("dashboardCopy", { goal: activeLibraryLabel() })}</p>
        <div class="hud">
          <div class="hud-item">
            <span>${t("adventurerRank")}</span>
            <strong>Lv.${rank}</strong>
          </div>
          <div class="hud-item">
            <span>${t("xp")}</span>
            <strong>${xp}</strong>
          </div>
          <div class="hud-item">
            <span>${t("nextLevel")}</span>
            <strong>${currentXp}/${nextNeed}</strong>
          </div>
          <div class="hud-meter"><span style="width:${xpProgress()}%"></span></div>
        </div>
        ${showLevelUpAlert ? `<div class="quest-alert"><strong>${t("levelUp")} Lv.${pendingLevel.from} -> Lv.${pendingLevel.to}</strong><button class="btn" data-action="claim-level-loot">${t("claimLevelLoot")}</button></div>` : ""}
        ${pendingBattleTitle ? `<div class="quest-alert"><strong>${msg("battleTitleReady", { title: battleRankTitle(pendingBattleTitle.rank) })}</strong><button class="btn" data-action="claim-battle-title">${t("claimBattleTitle")}</button></div>` : ""}
        ${limitedBattleTitle ? `<div class="quest-alert small"><strong>${t("limitedTitle")}</strong><span>${msg("battleTitleActive", { title: battleRankTitle(limitedBattleTitle.rank) })}</span></div>` : ""}
        ${state.streakRewardKey ? `<div class="quest-alert small"><strong>${t("streak")} ${state.streakDays}</strong><span>${msg("streakReward", { reward: t(state.streakRewardKey) })}</span></div>` : ""}
        <div class="action-zones">
          <div class="action-zone learning-zone">
            <h3>${t("learningActions")}</h3>
            <div class="actions">
              <button class="btn learning" data-action="study">${t("learn")}</button>
              <button class="btn learning" data-action="daily" ${dailyTestAvailable() ? "" : "disabled"}>${t("daily")}</button>
              <button class="btn learning secondary" data-action="weak">${t("weak")} (${profile.weak.length})</button>
              <button class="btn learning secondary" data-action="custom-hub">${t("customHub")}${state.customLibraries.length ? ` (${state.customLibraries.length})` : ""}</button>
              <div class="paired-actions">
                <button class="btn learning secondary" data-action="weekly" ${weeklyTestAvailable() ? "" : "disabled"}>${t("weekly")}</button>
                <button class="btn learning secondary" data-action="review" ${learnedPercent >= 60 ? "" : "disabled"}>${t("review")}</button>
              </div>
              ${todayLockComplete() ? `<button class="btn learning secondary" data-action="next-round">${t("nextRound")}</button>` : ""}
            </div>
          </div>
          <div class="action-zone adventure-zone">
            <h3>${t("adventureActions")}</h3>
            <div class="actions">
              <button class="btn adventure" data-action="inventory">${t("inventory")}</button>
              <button class="btn adventure" data-action="achievements">${t("achievements")}</button>
              <button class="btn adventure" data-action="ranking">${t("ranking")}</button>
              <button class="btn secondary" data-action="reset">${t("reset")}</button>
            </div>
          </div>
        </div>
      </div>
      <div class="grid dashboard-summary">
        <article class="card level-card ${todayComplete ? "complete" : ""}">
          <h3>${t("todayProgress")}</h3>
          <p class="muted">${msg("todayProgressCopy", { today: todayCount, total: profile.learned.length })}</p>
          <p class="muted">${dueCount > 0 ? `${t("srsDue")}：${dueCount}` : t("srsAllClear")}</p>
          <p class="muted">${learnedPercent >= 60 ? msg("reviewReady", { percent: learnedPercent }) : t("reviewLocked")}</p>
          <div class="meter"><span style="width:${Math.min(100, todayCount * 10)}%"></span></div>
        </article>
        <article class="card level-card">
          <h3>${label.name}</h3>
          <p class="muted">${label.tone}</p>
          <p class="muted">${t("adventurerRank")}：${rankTierTitle(state.rankTier || 1)}</p>
        </article>
        <button class="card level-card summary-link-card" data-action="ranking">
          <h3>${t("ranking")}</h3>
          <p class="muted">${t("recentXp")}：${weeklyXpTotal()}</p>
          <p class="muted">${t("killRanking")}：${weeklyKillTotal()}</p>
        </button>
      </div>
    </section>
  `);
}

function renderCustomStudySelect() {
  return appShell(`
    <section class="panel">
      <div class="eyebrow">${t("customLibrary")}</div>
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
                  <strong>${library.name}</strong>
                  <p class="muted">${(library.words || []).length} 字${broken > 0 ? ` · <span style="color:#c45a43">${broken} 字釋義不全</span>` : ""}</p>
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
      ${libraries.length ? `
        ${libraries.map((library) => {
          const profile = activeProfile();
          const complete = (library.words || []).length > 0 && (library.words || []).every((item) => profile.learned.includes(item.word));
          return `
          <article class="card library-view-card ${complete ? "complete" : ""}">
            <div class="library-view-head">
              <h3>${library.name}</h3>
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
                    <strong>${item.word}</strong>
                    ${item.phonetic ? `<span class="phonetic-inline">${item.phonetic}</span>` : ""}
                    ${item.pos ? `<span class="tag tag-pos">${item.pos}</span>` : ""}
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
        <article class="flashcard flashcard-textonly" data-card-swipe>
          <div class="flash-copy">
            <div class="eyebrow">${t("previewEyebrow")} · ${msg("cardProgress", { current: studySession.previewIndex + 1, total: studySession.words.length })}</div>
            <h2>${current.word}</h2>
            <p class="phonetic">${phonetic}</p>
            <div class="card-tags">
              <span class="tag">${current.pos}</span>
              ${phonetic ? `<span class="tag phonetic-tag">${phonetic}</span>` : ""}
            </div>
            <h3>${displayMeaning(current)}</h3>
            ${renderCambridgeExample(current)}
            <p class="muted">${t("cardHint")}</p>
          </div>
          <div class="actions">
            <button class="btn secondary icon-btn" data-action="speak-word" data-word="${current.word}" title="${t("speak")}">🔊</button>
            <button class="btn secondary" data-action="prev-card">${t("previousCard")}</button>
            <button class="btn" data-action="next-card">${t("nextCard")}</button>
            <button class="btn" data-action="start-study-quiz">${t("previewDone")}</button>
            <button class="btn secondary flashcard-back" data-action="back">${backButtonLabel()}</button>
          </div>
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
          <div class="eyebrow">Recall battle</div>
          <h2 class="page-title">${t("recallTitle")}</h2>
          <p class="muted">${msg("questionProgress", { current: studySession.index + 1, total: studySession.questions.length })}</p>
        </div>
      </div>
      <div class="question">
        <div>
          <div class="${isCloze || isWordChoice ? "sentence" : "word"}">${studyQuestionText}</div>
          <div class="phonetic">${isWordChoice ? t("chooseStudyWord") : isCloze ? t("clozeHint") : current.phonetic}</div>
        </div>
      </div>
      <div class="battle-options">
        ${current.choices.map((option) => `<button class="answer" data-study-answer="${option}" data-correct="${current.correct}">${option}</button>`).join("")}
      </div>
      <div class="toast">${toast}</div>
      <div class="actions">
        <button class="btn secondary" data-action="back">${backButtonLabel()}</button>
      </div>
      ${celebrate ? `<div class="celebrate">${t("correctFx")}</div>` : ""}
    </section>
  `);
}

function renderWeak() {
  const profile = activeProfile();
  // 用 allWords() 找弱點字（同時涵蓋內建與自訂庫），不再被當前目標篩掉
  const weakWords = allWords().filter((item) => profile.weak.includes(item.word));
  const weakComplete = !weakWords.length;
  return appShell(`
    ${renderCardModal()}
    <section class="panel ${weakComplete ? "complete" : ""}">
      <div class="eyebrow">${t("weak")}</div>
      <h2 class="page-title">${t("weakTitle")}</h2>
      <div class="actions weak-actions">
        <button class="btn" data-action="weak-train">${t("weakTrain") || "弱點加強"}</button>
        <button class="btn secondary" data-action="back">${backButtonLabel()}</button>
      </div>
      <p class="hero-copy">${weakWords.length ? t("weakCopyFilled") : t("weakCopyEmpty")}</p>
      <div class="grid">
        ${weakWords
          .map(
            (item) => {
              const phonetic = phoneticText(item);
              return `
              <button class="card weak-card" data-show-card-word="${item.word}">
                <h3>${item.image} ${item.word}</h3>
                ${phonetic ? `<p class="phonetic">${phonetic}</p>` : ""}
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
function renderCardModal() {
  if (!cardModalWord) return "";
  const item = findWord(cardModalWord);
  if (!item) return "";
  const phonetic = phoneticText(item);
  return `
    <div class="modal-backdrop" data-action="close-card-modal">
      <article class="modal-card flashcard-textonly" onclick="event.stopPropagation()">
        <div class="flash-copy">
          <h2>${item.word}</h2>
          <p class="phonetic">${phonetic}</p>
          <div class="card-tags">
            ${item.pos ? `<span class="tag">${item.pos}</span>` : ""}
            ${phonetic ? `<span class="tag phonetic-tag">${phonetic}</span>` : ""}
          </div>
          <h3>${displayMeaning(item)}</h3>
          ${renderCambridgeExample(item)}
        </div>
        <div class="actions">
          <button class="btn secondary icon-btn" data-action="speak-word" data-word="${item.word}" title="${t("speak")}">🔊</button>
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

function displayMeaning(item) {
  const meaning = compactMeaning(item?.meaning || "");
  if (!meaning) {
    requestDictionaryEntry(item);
    return "";
  }
  if (hasNativeMeaningSource(item)) return meaning;
  if (isSpanishNative()) {
    requestDictionaryEntry(item);
    return "";
  }
  if (hasNativeMeaningChars(meaning)) return meaning;
  requestDictionaryEntry(item);
  return "";
}

function cambridgeExampleText(item) {
  const ex = String(item?.example || "").trim();
  return ex && isCompleteExample(ex) ? ex : "";
}

function renderCambridgeExample(item, className = "") {
  const exampleText = cambridgeExampleText(item);
  if (!exampleText) {
    requestDictionaryEntry(item);
  }
  if (!exampleText) {
    return "";
  }
  const extraClass = className ? ` ${className}` : "";
  return `
    <p class="example-label">${t("exampleLabel")}</p>
    <p class="example${extraClass}">${exampleText}</p>
    ${item.exampleZh ? `<p class="example-zh muted">${item.exampleZh}</p>` : ""}
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

function requestDictionaryEntry(item) {
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
            <strong>${item.icon} ${item.name}</strong>
            <span class="item-count">x${state.inventory[item.id] || 0}</span>
            <small>${item.effect}</small>
          </article>
        `).join("")}
      </div>
    </section>
  `);
}

function activeMonsterForPreview() {
  if (!canBattlePendingLevelUp()) return null;
  return state.pendingLevelUp.monster;
}

function renderMonsterPreview() {
  const monster = activeMonsterForPreview();
  if (!monster) {
    navigateTo("dashboard", { pushHistory: false });
    return renderDashboard();
  }
  const danger = Math.min(5, Math.max(1, Math.ceil(monster.attack / 10)));
  return appShell(`
    <section class="monster-preview panel">
      <div class="monster-preview-copy">
        <div class="eyebrow">${t("monsterPreview")}</div>
        <h2 class="page-title">${monster.name} ${monster.icon}</h2>
        <p class="hero-copy">${t("monsterPreviewCopy")}</p>
        <div class="stats">
          <div class="stat"><strong>${monster.maxHp}</strong><span>${t("monsterHp")}</span></div>
          <div class="stat"><strong>${monster.attack}</strong><span>${t("playerHp")} - ${t("dangerLevel")}</span></div>
          <div class="stat"><strong>${"★".repeat(danger)}</strong><span>${t("dangerLevel")}</span></div>
        </div>
        <div class="wrong-review">
          <h3>${t("monsterTrait")}</h3>
          <p class="muted">${monster.trait}</p>
        </div>
        <div class="actions">
          <button class="btn" data-action="start-monster-battle">${t("startBattle")}</button>
          <button class="btn secondary" data-action="defer-battle">${t("deferBattle")}</button>
        </div>
      </div>
      <div class="monster-preview-art">${monsterArt(monster)}</div>
    </section>
  `);
}

function renderMonsterBattle() {
  if (!battle) {
    const monster = state.pendingLevelUp?.monster || createMonster(getPlayerRank());
    battle = { monster: { ...monster }, playerHp: 100, log: "", usedItems: {}, lastHit: null, lastTaken: null };
  }
  const monster = battle.monster;
  const won = monster.hp <= 0;
  const lost = battle.lost === true;
  const playerHpPct = Math.max(0, Math.min(100, battle.playerHp));
  const monsterHpPct = Math.max(0, Math.min(100, Math.round((Math.max(0, monster.hp) / Math.max(1, monster.maxHp)) * 100)));
  return appShell(`
    <section class="panel retro-game battle-layout ${won ? "battle-victory" : ""} ${lost ? "battle-loss" : ""}">
      <div class="battle-hud">
        <div class="battle-meter-card">
          <div class="battle-meter-head"><strong>${t("playerHp")}</strong><span>${battle.playerHp}/100</span></div>
          <div class="battle-meter"><span style="width:${playerHpPct}%"></span></div>
        </div>
        <div class="battle-meter-card monster-meter-card">
          <div class="battle-meter-head"><strong>${t("monsterHp")}</strong><span>${Math.max(0, monster.hp)}/${monster.maxHp}</span></div>
          <div class="battle-meter"><span style="width:${monsterHpPct}%"></span></div>
        </div>
      </div>
      <div class="battle-title-row">
        <div>
          <div class="eyebrow">${t("monsterBattle")}</div>
          <h2 class="page-title">${monster.name} ${monster.icon}</h2>
          <p class="hero-copy">${won ? t("victory") : lost ? t("battleLost") : battle.log || t("noItems")}</p>
        </div>
        <div class="actions battle-actions">
          ${won ? `<button class="btn" data-action="claim-battle">${t("claimReward")}</button>` : ""}
          <button class="btn secondary" data-action="back">${backButtonLabel()}</button>
        </div>
      </div>
      <div class="monster-art ${won ? "defeated" : ""} ${lost ? "fallen" : ""} ${battle.lastHit ? "hit" : ""}">${monsterArt(monster)}</div>
      ${battle.lastHit ? `<div class="damage-pop">-${battle.lastHit}</div>` : ""}
      ${battle.lastTaken ? `<div class="damage-pop enemy-damage">${t("playerHp")} -${battle.lastTaken}</div>` : ""}
      ${won ? `<div class="battle-fx victory-fx">${t("victory")}</div>` : ""}
      ${lost ? `<div class="battle-fx loss-fx">${t("battleLost")}</div>` : ""}
      <div class="item-grid battle-item-grid">
        ${battleItems().map((item) => `<button class="item-card battle-item-card" data-use-item="${item.id}" ${won || lost || (state.inventory[item.id] || 0) <= 0 ? "disabled" : ""}>${assetImage(treasureImagePath(item.id), item.name, "item-art")}<strong>${item.icon} ${item.name}</strong><span class="item-count">x${state.inventory[item.id] || 0}</span><small>${item.effect}</small></button>`).join("")}
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
          <input class="input" id="libraryName" value="${t("customLibrary")}" />
        </div>
        <div class="field">
          <label>${t("photoInput")}</label>
          <input class="input" type="file" accept="image/*" capture="environment" id="photoInput" />
          <img class="photo-preview" id="photoPreview" alt="" />
        </div>
        <div class="field">
          <label>${t("wordInput")}</label>
          <textarea class="textarea" id="wordImportText" rows="10" placeholder="${t("englishOnlyPlaceholder")}"></textarea>
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
      <div class="eyebrow">${t("achievements")}</div>
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
                      <h3>${group.label}</h3>
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

function renderRanking() {
  ensureRivals();
  ensureRankingWeek();
  driftRivalsTowardPlayer();
  // 「3 天 XP」榜：玩家用 recentXpTotal()；對手用 rivalRecentXp() 模擬最近表現
  // 排序鍵直接等於顯示值，不再額外加 noise，避免顯示順序看起來亂跳
  const player = {
    name: state.user?.name || t("rankYou"),
    isPlayer: true,
    weekXp: weeklyXpTotal(),
    weekKills: weeklyKillTotal(),
  };
  const rivals = state.rivals.map((rival, index) => ({
    ...rival,
    weekXp: rivalWeeklyXp(rival, index),
    weekKills: Math.max(0, rival.weeklyKills || 0),
  }));
  const xpRows = leaderboardRows(player, rivals, "weekXp");
  const killRows = leaderboardRows(player, rivals, "weekKills");
  // 競技排名（competition ranking）：分數相同 → 同名次；下一個跳過被佔的位置（1,1,3,4...）
  const computeRanks = (items, key) => {
    const ranks = [];
    items.forEach((item, index) => {
      if (index === 0) {
        ranks.push(1);
        return;
      }
      const prevValue = items[index - 1][key] || 0;
      const currValue = item[key] || 0;
      if (currValue === prevValue) ranks.push(ranks[index - 1]);
      else ranks.push(index + 1);
    });
    return ranks;
  };
  const rows = (items, key, type) => {
    const ranks = computeRanks(items, key);
    return items.map((item, index) => `
      <div class="rank-row ${item.isPlayer ? "active" : ""}">
        <strong>${ranks[index]}</strong>
        <span>${item.isPlayer ? `${item.name} (${t("rankYou")})` : item.name}</span>
        <b>${item[key]}</b>
      </div>
    `).join("");
  };
  const playerXpRank = computeRanks(xpRows, "weekXp")[xpRows.findIndex((item) => item.isPlayer)] || "-";
  const playerKillRank = computeRanks(killRows, "weekKills")[killRows.findIndex((item) => item.isPlayer)] || "-";
  return appShell(`
    <section class="panel">
      <div class="eyebrow">${t("ranking")}</div>
      <div class="page-head ranking-head">
        <div>
          <h2 class="page-title">${t("ranking")}</h2>
          <div class="actions top-return-actions"><button class="btn secondary" data-action="back">${backButtonLabel()}</button></div>
        </div>
        <div class="ranking-self">
          <span>${t("rankYou")}</span>
          <strong>${t("xpRanking")} #${playerXpRank}</strong>
          <strong>${t("killRanking")} #${playerKillRank}</strong>
        </div>
      </div>
      <div class="ranking-grid">
        <article class="card">
          <h3>${t("xpRanking")}</h3>
          <div class="rank-list">${rows(xpRows, "weekXp", "xp")}</div>
        </article>
        <article class="card">
          <h3>${t("killRanking")}</h3>
          <div class="rank-list">${rows(killRows, "weekKills", "kill")}</div>
        </article>
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

const BATTLE_RANK_TITLES = {
  "zh-Hant": { champion: "討伐冠軍", front: "前線獵手", veteran: "征戰勇者", explorer: "遠征者" },
  en: { champion: "Slayer Champion", front: "Frontline Hunter", veteran: "Battle Veteran", explorer: "Explorer" },
  ja: { champion: "討伐王者", front: "前線の狩人", veteran: "征戦の勇者", explorer: "遠征者" },
  ko: { champion: "토벌 챔피언", front: "전선 사냥꾼", veteran: "전투 베테랑", explorer: "원정자" },
  es: { champion: "Campeón cazador", front: "Cazador de línea", veteran: "Veterano de combate", explorer: "Explorador" },
};

function battleRankTitle(rank) {
  const map = BATTLE_RANK_TITLES[state.native || "zh-Hant"] || BATTLE_RANK_TITLES["zh-Hant"];
  if (rank === 1) return map.champion;
  if (rank <= 3) return map.front;
  if (rank <= 10) return map.veteran;
  return map.explorer;
}

function leaderboardRows(player, rivals, key) {
  const all = [player, ...rivals];
  // 直接拿顯示鍵排序，確保視覺與順序一致
  all.sort((a, b) => (b[key] || 0) - (a[key] || 0));
  return all.slice(0, 21);
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
      label: `${def.label}: ${def.value}/${next.goal}`,
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
  const color = done ? "#e7b64b" : "#8a8175";
  const variants = BADGE_VARIANTS[icon] || BADGE_VARIANTS.crown;
  const idx = Math.max(0, Math.min(variants.length - 1, tierIndex || 0));
  const mark = variants[idx];
  return `<svg viewBox="0 0 128 128" aria-hidden="true"><path d="M64 8l49 28v56l-49 28-49-28V36z" fill="${color}" stroke="#4c2f1e" stroke-width="6"/><g fill="#4c2f1e" stroke="#4c2f1e" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${mark}</g></svg>`;
}

function renderAdmin() {
  if (!canUseAdmin()) {
    navigateTo("dashboard", { clearHistory: true, pushHistory: false });
    return renderDashboard();
  }
  return appShell(`
    <section class="panel">
      <div class="eyebrow">${t("admin")}</div>
      <h2 class="page-title">${t("adminPanel")}</h2>
      <p class="hero-copy">${t("adminNote")}</p>
      <div class="grid">
        ${[
          ["admin-xp", t("adminXp")],
          ["admin-level", t("adminLevel")],
          ["admin-learn", t("adminLearn")],
          ["admin-review", t("adminReview")],
          ["admin-battle", t("adminBattle")],
          ["admin-items", t("adminItems")],
          ["admin-skip-day", t("adminSkipDay")],
        ].map(([action, label]) => `<button class="card admin-card" data-admin="${action}"><strong>${label}</strong></button>`).join("")}
      </div>
      <div class="actions">
        <button class="btn secondary" data-action="back">${backButtonLabel()}</button>
        <button class="btn ghost" data-admin="admin-clear">${t("adminClear")}</button>
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
  document.querySelectorAll("[data-action='signout']").forEach((button) => {
    button.addEventListener("click", () => {
      state.user = null;
      saveState();
      navigateTo("login", { clearHistory: true, pushHistory: false });
      stopActiveQuiz();
      studySession = null;
      battle = null;
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
    button.addEventListener("click", () => speakWord(button.dataset.word));
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
      studySession = createWeakTrainingSession();
      navigateTo("study");
      toast = "";
      render();
    });
  });
  document.querySelectorAll("[data-action='minigame']").forEach((button) => {
    button.addEventListener("click", () => {
      if (!canBattlePendingLevelUp()) return;
      navigateTo("monster-preview");
      battle = null;
      render();
    });
  });
  document.querySelectorAll("[data-action='start-monster-battle']").forEach((button) => {
    button.addEventListener("click", () => {
      navigateTo("minigame");
      battle = null;
      render();
    });
  });
  document.querySelectorAll("[data-action='claim-level-loot']").forEach((button) => {
    button.addEventListener("click", () => claimLevelLoot());
  });
  document.querySelectorAll("[data-action='claim-battle-title']").forEach((button) => {
    button.addEventListener("click", () => claimBattleTitle());
  });
  document.querySelectorAll("[data-action='defer-battle']").forEach((button) => {
    button.addEventListener("click", () => {
      if (state.pendingLevelUp) {
        state.pendingLevelUp.deferred = true;
        if (state.pendingLevelUp.loot && !state.pendingLevelUp.lootClaimed) {
          addInventory(state.pendingLevelUp.loot || {});
          const rewardText = formatLoot(state.pendingLevelUp.loot || {});
          state.rewardNotice = { title: t("itemReward"), items: rewardText };
          toast = msg("itemReward", { items: rewardText });
          state.pendingLevelUp.lootClaimed = true;
        }
      }
      navigateTo("dashboard", { clearHistory: true, pushHistory: false });
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-use-item]").forEach((button) => {
    button.addEventListener("click", () => useBattleItem(button.dataset.useItem));
  });
  document.querySelectorAll("[data-action='claim-battle']").forEach((button) => {
    button.addEventListener("click", () => claimBattleReward());
  });
  document.querySelectorAll("[data-action='achievements']").forEach((button) => {
    button.addEventListener("click", () => {
      navigateTo("achievements");
      render();
    });
  });
  document.querySelectorAll("[data-action='ranking']").forEach((button) => {
    button.addEventListener("click", () => {
      navigateTo("ranking");
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
      localStorage.removeItem(STORAGE_KEY);
      state = loadState();
      migrateState();
      selectedGoal = activeGoal();
      navigateTo("login", { clearHistory: true, pushHistory: false });
      stopActiveQuiz();
      studySession = null;
      render();
    });
  });
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
  toast = msg("itemReward", { items: formatLoot(loot) });
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

function runAdminAction(action) {
  if (!canUseAdmin()) return;
  const profile = activeProfile();
  if (action === "admin-xp") addXp(500);
  if (action === "admin-level") {
    const rank = getPlayerRank();
    const monsterLevel = (rank + 1) % 5 === 0 ? rank + 1 : null;
    state.pendingLevelUp = { from: rank, to: rank + 1, loot: levelLoot(rank + 1), monster: monsterLevel ? createMonster(monsterLevel) : null, monsterLevel };
  }
  if (action === "admin-learn") {
    profile.learned = activeWords().map((item) => item.word);
    activeWords().forEach((item) => {
      profile.learnedLog[item.word] = todayKey();
    });
  }
  if (action === "admin-review") {
    navigateTo("review");
    stopActiveQuiz();
  }
  if (action === "admin-battle") {
    const rank = getPlayerRank();
    const monsterLevel = rank % 5 === 0 ? rank : Math.ceil(rank / 5) * 5;
    state.pendingLevelUp = state.pendingLevelUp || { from: rank - 1, to: monsterLevel, loot: {}, monster: createMonster(monsterLevel), monsterLevel, lootClaimed: true, deferred: true };
    state.pendingLevelUp.monster = state.pendingLevelUp.monster || createMonster(monsterLevel);
    state.pendingLevelUp.monsterLevel = state.pendingLevelUp.monsterLevel || monsterLevel;
    navigateTo("monster-preview");
    battle = null;
  }
  if (action === "admin-items") addInventory({ sword: 9, bomb: 9, potion: 9 });
  if (action === "admin-skip-day") {
    state.dayOffset = (Number(state.dayOffset || 0) + 1);
    state.lastRivalAdvanceDate = null;
    studySession = null;
    stopActiveQuiz();
    applyLoginReward();
    toast = t("adminSkipDay");
  }
  if (action === "admin-clear") {
    localStorage.removeItem(STORAGE_KEY);
    state = loadState();
    migrateState();
    selectedGoal = activeGoal();
    navigateTo("login", { clearHistory: true, pushHistory: false });
  }
  saveState();
  render();
}

function battleItems() {
  return [
    { id: "sword", name: "鐵劍", icon: "⚔️", damage: 24, effect: "-24 HP", image: treasureImagePath("sword") },
    { id: "bomb", name: "火焰瓶", icon: "🔥", damage: 42, effect: "-42 HP", image: treasureImagePath("bomb") },
    { id: "potion", name: "治療藥水", icon: "🧪", heal: 32, effect: "+32 HP", image: treasureImagePath("potion") },
  ];
}

function useBattleItem(itemId) {
  if (!battle || (state.inventory[itemId] || 0) <= 0 || battle.monster.hp <= 0) return;
  const item = battleItems().find((entry) => entry.id === itemId);
  state.inventory[itemId] -= 1;
  battle.usedItems = battle.usedItems || {};
  battle.usedItems[itemId] = (battle.usedItems[itemId] || 0) + 1;
  battle.lastHit = item.damage || null;
  if (item.damage) battle.monster.hp = Math.max(0, battle.monster.hp - item.damage);
  if (item.heal) battle.playerHp = Math.min(100, battle.playerHp + item.heal);
  if (battle.monster.hp > 0) {
    battle.lastTaken = battle.monster.attack;
    battle.playerHp = Math.max(0, battle.playerHp - battle.monster.attack);
  } else {
    battle.lastTaken = null;
  }
  battle.log = item.damage ? msg("battleDamage", { item: item.name, damage: item.damage }) : msg("battleHeal", { item: item.name, heal: item.heal });
  if (battle.playerHp <= 0) {
    refundHalfUsedItems();
    battle.lost = true;
    battle.log = t("battleLost");
    saveState();
    render();
    return;
  }
  saveState();
  render();
}

function refundHalfUsedItems() {
  Object.entries(battle?.usedItems || {}).forEach(([itemId, amount]) => {
    state.inventory[itemId] = (state.inventory[itemId] || 0) + Math.ceil(amount / 2);
  });
}

function claimLevelLoot() {
  if (!state.pendingLevelUp) return;
  if (!state.pendingLevelUp.lootClaimed) {
    addInventory(state.pendingLevelUp.loot || {});
    const rewardText = formatLoot(state.pendingLevelUp.loot || {});
    state.rewardNotice = { title: t("itemReward"), items: rewardText };
    toast = msg("itemReward", { items: rewardText });
    state.pendingLevelUp.lootClaimed = true;
  }
  if (canBattlePendingLevelUp()) {
    state.pendingLevelUp.deferred = true;
  } else {
    state.pendingLevelUp = null;
  }
  saveState();
  render();
}

function formatLoot(items) {
  return Object.entries(items).map(([key, amount]) => `${battleItems().find((item) => item.id === key)?.name || key} x${amount}`).join("、");
}

function claimBattleTitle() {
  if (!state.pendingBattleTitle) return;
  state.limitedBattleTitle = {
    rank: state.pendingBattleTitle.rank,
    claimedWeekKey: currentWeekKey(),
    expiresWeekKey: state.pendingBattleTitle.expiresWeekKey || nextWeekKey(),
  };
  state.pendingBattleTitle = null;
  toast = msg("battleTitleActive", { title: battleRankTitle(state.limitedBattleTitle.rank) });
  saveState();
  render();
}

function claimBattleReward() {
  if (!battle || battle.monster.hp > 0) return;
  state.achievements.monstersDefeated += 1;
  state.weeklyKillLog = state.weeklyKillLog || {};
  const today = todayKey();
  state.weeklyKillLog[today] = (state.weeklyKillLog[today] || 0) + 1;
  state.pendingLevelUp = null;
  addXp(50 + battle.monster.level * 5);
  battle = null;
  navigateTo("dashboard", { clearHistory: true, pushHistory: false });
  saveState();
  render();
}

function monsterImagePath(monster) {
  return `assets/generated/monsters/${monster.id}.png`;
}

function treasureImagePath(itemId) {
  return `assets/generated/treasures/${itemId}.png`;
}

function assetImage(src, alt, className) {
  return `<img class="${className}" src="${src}" alt="${alt}" loading="lazy" onerror="this.style.display='none'; this.dataset.missing='true';" />`;
}

function monsterArt(monster) {
  return `<div class="generated-monster">${assetImage(monsterImagePath(monster), monster.name, "monster-raster")}${monsterSvg(monster)}</div>`;
}

function applyQuizBattleTurn(current, isCorrect) {
  const damage = 16 + current.level * 6;
  if (isCorrect) {
    battle.monster.hp = Math.max(0, battle.monster.hp - damage);
    battle.lastHit = damage;
    battle.lastTaken = null;
    battle.log = msg("quizAttack", { damage });
  } else {
    const taken = battle.monster.attack;
    battle.lastHit = null;
    battle.playerHp = Math.max(0, battle.playerHp - taken);
    battle.lastTaken = taken;
    battle.log = msg("quizCounter", { damage: taken });
  }
}

function claimQuizBattleVictory() {
  const defeated = battle.monster;
  state.achievements.monstersDefeated += 1;
  state.weeklyKillLog = state.weeklyKillLog || {};
  const today = todayKey();
  state.weeklyKillLog[today] = (state.weeklyKillLog[today] || 0) + 1;
  state.pendingLevelUp = null;
  addXp(50 + defeated.level * 5);
  battle = null;
  stopActiveQuiz();
  toast = t("victory");
  navigateTo("dashboard", { clearHistory: true, pushHistory: false });
  saveState();
  render();
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
  toast = t("importProgressPrefix") || "查詢字典中…";
  render();
  const imported = await parseImportedWords(raw);
  if (!imported.length) {
    toast = t("importCopy");
    render();
    return;
  }
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
    toast = t("importCopy");
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

async function lookupWord(wordText, index, stats) {
  try {
    const response = await fetch(dictionaryLookupUrl(wordText));
    const entry = await response.json();
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
    .replace(/^[（(]\s*/, "")
    .replace(/[）)]\s*$/, "")
    .replace(/\b(?:v|n|adj|adv|prep|conj|pron|interj|aux)\.?\b/gi, "")
    .trim();
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
  if (example && wordText && example.toLowerCase().includes(wordText.toLowerCase())) {
    return example.replace(new RegExp(escapeRegExp(wordText), "i"), "____");
  }
  // 沒例句可用 → 直接顯示精簡後的中文意思當題目（不要再夾「____ (...)」格式）
  const meaning = compactMeaning(String(item.meaning || "").trim());
  return meaning || String(item.pos || "") || t("wordInput");
}

function questionTypeForItem(item, requestedType) {
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
    let type;
    if (kind === "daily") {
      type = "meaning";
    } else if (forceMeaning || !canCloze) {
      type = "meaning";
    } else {
      type = index % 2 === 1 ? "cloze" : "meaning";
    }
    return buildQuestion(item, type, source);
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
  const reviewWords = uniqueWordObjects(
    getWordsLearnedBefore(todayKey()).map((wordText) => findWord(wordText)).filter((item) => item && source.some((candidate) => candidate.word === item.word) && !seen.has(item.word)),
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
  return uniqueWordObjects(
    locked
      .map((wordText) => findWord(wordText))
      .filter((item) => item && source.some((candidate) => candidate.word === item.word)),
  );
}

function getLearnedPercent() {
  const source = wordsForGoal(activeGoal(), words);
  if (!source.length) return 0;
  const learned = activeProfile().learned.filter((wordText) => source.some((item) => item.word === wordText));
  return Math.round((new Set(learned).size / source.length) * 100);
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

function buildQuestion(item, type, source = quizChoicePool()) {
  const resolvedType = questionTypeForItem(item, type);
  const choices = resolvedType === "word" || resolvedType === "cloze" ? buildWordChoices(item, source) : buildMeaningChoices(item, source);
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
  activeQuiz.answers += 1;
  const current = activeQuiz.questions[activeQuiz.index];
  const isCorrect = answer === correct;
  if (isCorrect) {
    activeQuiz.score += current.level * 8 + 4;
    activeQuiz.correct += 1;
    recordCorrect();
    addXp(activeQuiz.kind === "daily" ? 12 : 8);
    toast = activeQuiz.kind === "daily" ? t("correctFx") : "";
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
    toast = activeQuiz.kind === "daily" ? t("wrongFx") : "";
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
  saveState();
  activeQuiz.index += 1;
  const shouldFinish = activeQuiz.index >= activeQuiz.questions.length || getQuizRemainingSeconds() <= 0;
  if (activeQuiz.kind === "daily" && shouldFinish) {
    if (quizFxTimer) clearTimeout(quizFxTimer);
    quizFxTimer = setTimeout(() => finishQuiz(), 700);
    return;
  }
  if (shouldFinish) finishQuiz();
  else render();
}

function finishQuiz() {
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
  }
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
    questions: finalWords.map((item, index) => buildQuestion(item, libraryId ? (index % 2 === 0 ? "meaning" : "word") : (index % 2 === 0 ? "meaning" : "cloze"), source)),
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
    if (!wordText) return Promise.resolve();
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

function createWeakTrainingSession() {
  const profile = activeProfile();
  // 弱點字可能來自內建或自訂庫，用 allWords() 才能找齊
  const source = allWords().filter((item) => profile.weak.includes(item.word));
  if (!source.length) {
    return { phase: "empty", previewIndex: 0, words: [], libraryId: null, questions: [], index: 0, correct: 0 };
  }
  const count = source.length > 10 ? Math.ceil(source.length / 2) : source.length;
  const selectedWords = sampleUniqueWords(source, count);
  // 干擾項池用全字庫，確保選項詞性 + 字義相近邏輯能正常運作
  const quizSource = allWords();
  const questionTypes = source.length < 5 ? ["cloze", "meaning", "word"] : ["meaning", "word"];
  return {
    phase: "quiz",
    previewIndex: 0,
    words: selectedWords,
    libraryId: null,
    questions: selectedWords.map((item, index) => buildQuestion(item, questionTypes[index % questionTypes.length], quizSource)),
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

function speakWord(wordText) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(wordText);
  utterance.lang = "en-US";
  utterance.rate = 0.86;
  window.speechSynthesis.speak(utterance);
}

function answerStudy(answer, correct) {
  const profile = activeProfile();
  const current = studySession.questions[studySession.index];
  studySession.mistakes = studySession.mistakes || [];
  if (answer === correct) {
    toast = t("hitStudy");
    profile.learned = Array.from(new Set([...profile.learned, current.word]));
    profile.learnedLog[current.word] = todayKey();
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

function getStudyPool() {
  const profile = activeProfile();
  const level = { id: wordDifficultyLevelId() };
  const source = wordsForGoal(activeGoal(), words);
  const weakWords = source.filter((item) => profile.weak.includes(item.word));
  const goalWords = source.filter((item) => item.goal.includes(activeGoal()) && item.level <= Math.min(5, level.id + 1));
  const oldWords = getWordsLearnedBefore(todayKey()).map((wordText) => findWord(wordText)).filter(Boolean);
  const combined = [...weakWords, ...weakWords, ...weakWords, ...oldWords, ...goalWords];
  return combined.length ? uniqueWordObjects(combined) : source;
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

function findWord(wordText) {
  return allWords().find((item) => item.word === wordText);
}

function buildWordChoices(item, source = quizChoicePool()) {
  const distractors = getSimilarWords(item, source).map((candidate) => candidate.word);
  return finalizeChoices(item, item.word, distractors, "word", source);
}

function buildMeaningChoices(item, source = quizChoicePool()) {
  const distractors = getSimilarWords(item, source).map((candidate) => compactMeaning(candidate.meaning));
  return finalizeChoices(item, compactMeaning(item.meaning), distractors, "meaning", source);
}

// 需求2 #1：干擾項從 allWords()（內建 + 所有自訂庫）取，不受 activeLibrary 限制
// 即使單字庫很小，選項也不會重複度太高
function quizChoicePool() {
  return allWords();
}

// 中文字義相近度：共享字元 Jaccard 相似度（0~1）
function meaningSimilarity(a, b) {
  if (!a || !b) return 0;
  const clean = (s) => String(s).replace(/[\s；;()（）的得地了]/g, "");
  const setA = new Set(clean(a).split(""));
  const setB = new Set(clean(b).split(""));
  if (!setA.size || !setB.size) return 0;
  let common = 0;
  setA.forEach((ch) => {
    if (setB.has(ch)) common += 1;
  });
  const denom = setA.size + setB.size - common;
  return denom > 0 ? common / denom : 0;
}

function getSimilarWords(item, source = quizChoicePool()) {
  // 先用 source 篩同詞性；若候選太少（< 6 個）就再從 allWords 補
  let pool = source.filter((candidate) => candidate.word !== item.word && candidate.pos === item.pos);
  if (pool.length < 6) {
    const fallback = allWords().filter((candidate) => candidate.word !== item.word && candidate.pos === item.pos);
    pool = uniqueWordObjects([...pool, ...fallback]);
  }
  if (!pool.length) return [];
  // 打分：字義相近權重最高、段位接近、字形拼寫相近
  const scored = pool.map((candidate) => ({
    candidate,
    score:
      meaningSimilarity(candidate.meaning, item.meaning) * 10 +
      (Math.abs((candidate.level || 1) - (item.level || 1)) <= 1 ? 3 : 0) +
      similarityScore(item.word, candidate.word),
  }));
  scored.sort((a, b) => b.score - a.score);
  // 取前 12 名做候選池、shuffle 取 3 → 同一個字每次出題時干擾項會洗牌增加變化
  const top = scored.slice(0, Math.min(12, scored.length)).map((s) => s.candidate);
  return shuffle(top).slice(0, 3);
}

function finalizeChoices(item, correctValue, distractors, mode, source = quizChoicePool()) {
  const samePosPool = uniqueWordObjects([
    ...allWords().filter((candidate) => candidate.word !== item.word && candidate.pos === item.pos),
    ...source.filter((candidate) => candidate.word !== item.word && candidate.pos === item.pos),
  ]);
  // meaning 模式 → 所有選項用精簡版，避免「答案是精簡版但選項是長版」對不上
  const meaningOf = (entry) => mode === "word" ? entry.word : compactMeaning(entry.meaning);
  const pool = samePosPool.map(meaningOf);
  const seen = new Set([correctValue]);
  const answers = [correctValue];
  const candidates = uniqueWords([
    ...distractors,
    ...getSimilarWords(item, source).map(meaningOf),
    ...sampleUniqueValues(pool, 8),
    ...pool,
  ].filter(Boolean));
  // 過濾「跟正解或已選選項字義太相近（≥70% 共享字）」的候選 — 避免「快速的」vs「迅速的」這類差異不大的選項
  const tooSimilarToAny = (value) => {
    if (mode !== "meaning") return false;
    return answers.some((existing) => meaningTooSimilar(value, existing));
  };
  candidates.forEach((value) => {
    if (answers.length >= 4) return;
    if (seen.has(value) || value === correctValue) return;
    if (tooSimilarToAny(value)) return;
    seen.add(value);
    answers.push(value);
  });
  // 還不夠 4 個 → 即使較相近也補（保證題目有 4 個選項）
  while (answers.length < 4) {
    const extra = pool.find((value) => !answers.includes(value) && value !== correctValue);
    if (!extra) break;
    answers.push(extra);
  }
  return shuffle(answers);
}

// 兩個 meaning 是否「太像」（70% 字符共享 + 至少其中之一很短時更嚴格）
function meaningTooSimilar(a, b) {
  if (!a || !b) return false;
  if (a === b) return true;
  const sa = new Set(String(a).replace(/[；;、,，/(){}（）的得地了]/g, ""));
  const sb = new Set(String(b).replace(/[；;、,，/(){}（）的得地了]/g, ""));
  if (!sa.size || !sb.size) return false;
  let common = 0;
  sa.forEach((c) => { if (sb.has(c)) common += 1; });
  const minLen = Math.min(sa.size, sb.size);
  return minLen > 0 && common / minLen >= 0.7;
}

function sampleUniqueValues(values, count) {
  return shuffle(Array.from(new Set(values))).slice(0, count);
}

function sampleUniqueWords(source, count) {
  return shuffle(Array.from(new Map(source.map((item) => [item.word, item])).values())).slice(0, count);
}

function similarityScore(a, b) {
  const prefix = commonPrefix(a, b);
  const lengthCloseness = 1 / (1 + Math.abs(a.length - b.length));
  return prefix * 2 + lengthCloseness;
}

function commonPrefix(a, b) {
  let count = 0;
  while (count < a.length && count < b.length && a[count] === b[count]) count += 1;
  return count;
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
