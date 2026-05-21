const STORAGE_KEY = "vocab-arcana-progress";
const TODAY = new Date().toISOString().slice(0, 10);
const ADMIN_EMAILS = ["your-email@example.com"];

const i18n = {
  "zh-Hant": {
    subtitle: "遊戲化英文單字修煉場",
    introTitle: "Vocab Arcana",
    introCopy:
      "先用三分鐘測出等級，再依照你的目標、母語與弱點安排單字戰鬥。每日測驗會混入今天學的字與以前學過的字，降低遺忘。",
    google: "使用 Google 繼續",
    mock: "本機測試登入",
    native: "母語",
    goal: "學習目標",
    name: "暱稱",
    dashboard: "修煉地圖",
    test: "分級測驗",
    learn: "學習 10 字",
    daily: "每日測驗",
    weak: "弱點池",
    reset: "重置進度",
    placementDone: "測驗完成",
    previewDone: "看完了，開始背誦測驗",
    back: "回地圖",
    signout: "登出",
    setup: "開始設定",
    firebaseNote: "正式上線版會接 Firebase Authentication 與 Firestore；目前先用本機帳號與 localStorage 測完整流程。",
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
    xp: "經驗值",
    adventurerRank: "冒險階級",
    wordTier: "單字階級",
    tier1: "簡單",
    tier2: "普通",
    tier3: "中等",
    tier4: "困難",
    tier5: "超難",
    nextLevel: "距離升級",
    levelUp: "升級挑戰",
    playMiniGame: "開始復古小遊戲",
    claimLevelLoot: "領取升級道具",
    battleMonster: "挑戰怪物",
    inventory: "道具袋",
    achievements: "成就",
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
    reward1: "+10 XP 旅人乾糧",
    reward3: "+30 XP 記憶藥水",
    reward5: "+60 XP 祝福護符",
    reward7: "+100 XP 古代寶箱",
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
    correctFx: "答對！",
    activeGoal: "目前目標",
    addGoal: "新增目標",
    review: "總複習測驗",
    reviewReady: "已背 {percent}%：可以挑戰總複習升級。",
    reviewLocked: "背完 60% 單字後開放總複習。",
    reviewTitle: "10-15 分鐘總複習",
    reviewHelper: "隨機挑選目前等級含以下的單字，通過後提升等級稱號。",
    reviewPassed: "總複習通過，等級提升！",
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
    adminClear: "清除本機進度",
  },
  en: {
    subtitle: "A game-first English vocabulary arena",
    introTitle: "Vocab Arcana",
    introCopy:
      "Take a three-minute placement test, then train words based on your goal, native language, and weak spots. Daily tests mix today's words with older learned words.",
    google: "Continue with Google",
    mock: "Local test login",
    native: "Native language",
    goal: "Learning goal",
    name: "Nickname",
    dashboard: "Quest Map",
    test: "Placement Test",
    learn: "Study 10 Words",
    daily: "Daily Test",
    weak: "Weak Words",
    reset: "Reset Progress",
    placementDone: "Placement complete",
    previewDone: "Start Recall Test",
    back: "Back to map",
    signout: "Sign out",
    setup: "Setup",
    firebaseNote: "The production version will connect Firebase Authentication and Firestore. This MVP uses a local account and localStorage for testing.",
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
    achievements: "Achievements",
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
    reward1: "+10 XP travel ration",
    reward3: "+30 XP memory potion",
    reward5: "+60 XP blessing charm",
    reward7: "+100 XP ancient chest",
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
    correctFx: "Correct!",
    activeGoal: "Active Goal",
    addGoal: "Add Goal",
    review: "Grand Review",
    reviewReady: "{percent}% learned: grand review is available.",
    reviewLocked: "Grand review unlocks after learning 60% of the words.",
    reviewTitle: "10-15 Minute Grand Review",
    reviewHelper: "Random words from your current rank and below. Pass to rank up.",
    reviewPassed: "Grand review passed. Rank upgraded!",
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
    adminClear: "Clear Local Progress",
  },
  ja: {
    subtitle: "英単語をゲーム感覚で鍛える",
    introTitle: "Vocab Arcana",
    introCopy:
      "三分間の診断でレベルを判定し、目的・母語・弱点に合わせて単語を練習します。毎日のテストでは今日の単語と過去の単語を混ぜます。",
    google: "Google で続行",
    mock: "ローカルで試す",
    native: "母語",
    goal: "学習目標",
    name: "名前",
    dashboard: "修練マップ",
    test: "レベル診断",
    learn: "10語を学習",
    daily: "毎日テスト",
    weak: "弱点リスト",
    reset: "リセット",
    placementDone: "診断完了",
    previewDone: "暗記テスト開始",
    back: "マップへ",
    signout: "ログアウト",
    setup: "初期設定",
    firebaseNote: "正式版では Firebase Authentication と Firestore に接続します。現在はローカルアカウントと localStorage でテストします。",
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
    achievements: "実績",
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
    reward1: "+10 XP 旅の食料",
    reward3: "+30 XP 記憶ポーション",
    reward5: "+60 XP 祝福のお守り",
    reward7: "+100 XP 古代宝箱",
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
    correctFx: "正解！",
    activeGoal: "現在の目標",
    addGoal: "目標を追加",
    review: "総復習テスト",
    reviewReady: "{percent}% 学習済み：総復習に挑戦できます。",
    reviewLocked: "60% 学習すると総復習が開放されます。",
    reviewTitle: "10-15分の総復習",
    reviewHelper: "現在ランク以下の単語からランダム出題。合格すると昇級します。",
    reviewPassed: "総復習に合格。ランクアップ！",
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
    adminClear: "ローカル進度削除",
  },
};

const levels = [
  { id: 1, name: "見習咒文使", min: 0, tone: "基礎生活字彙" },
  { id: 2, name: "語彙劍士", min: 26, tone: "常用閱讀字彙" },
  { id: 3, name: "文法魔導士", min: 46, tone: "考試與抽象字彙" },
  { id: 4, name: "深淵譯者", min: 66, tone: "職場與學術字彙" },
  { id: 5, name: "終焉詞皇", min: 86, tone: "高階語感與近義辨析" },
];

const goals = ["英檢初級", "會考", "學測", "多益", "托福", "生活英文"];
const nativeLanguages = [
  { value: "zh-Hant", label: "繁體中文" },
  { value: "en", label: "English" },
  { value: "ja", label: "日本語" },
];

const goalLabels = {
  "zh-Hant": {
    英檢初級: "英檢初級",
    會考: "會考",
    學測: "學測",
    多益: "多益",
    托福: "托福",
    生活英文: "生活英文",
  },
  en: {
    英檢初級: "GEPT Elementary",
    會考: "CAP Exam",
    學測: "GSAT",
    多益: "TOEIC",
    托福: "TOEFL",
    生活英文: "Daily English",
  },
  ja: {
    英檢初級: "GEPT 初級",
    會考: "台湾高校入試",
    學測: "大学入試",
    多益: "TOEIC",
    托福: "TOEFL",
    生活英文: "日常英語",
  },
};

const levelLabels = {
  "zh-Hant": [
    ["見習咒文使", "基礎生活字彙"],
    ["語彙劍士", "常用閱讀字彙"],
    ["文法魔導士", "考試與抽象字彙"],
    ["深淵譯者", "職場與學術字彙"],
    ["終焉詞皇", "高階語感與近義辨析"],
  ],
  en: [
    ["Apprentice Spellcaster", "basic daily vocabulary"],
    ["Lexicon Swordsman", "common reading vocabulary"],
    ["Grammar Archmage", "exam and abstract vocabulary"],
    ["Abyss Translator", "workplace and academic vocabulary"],
    ["Final Word Emperor", "advanced nuance and synonyms"],
  ],
  ja: [
    ["見習い呪文使い", "基礎生活語彙"],
    ["語彙剣士", "よく使う読解語彙"],
    ["文法魔導士", "試験と抽象語彙"],
    ["深淵の翻訳者", "職場と学術語彙"],
    ["終焉の語皇", "高度な語感と類義語"],
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

const words = [
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

let state = loadState();
migrateState();
let screen = state.user ? (activeProfile().placement ? "dashboard" : "placement") : "login";
let selectedGoals = state.userGoals?.length ? [...state.userGoals] : [state.activeGoal || state.goal || goals[0]];
let selectedGoal = selectedGoals[0];
let activeQuiz = null;
let studySession = null;
let miniGame = null;
let battle = null;
let toast = "";
let celebrate = false;

if (state.user) {
  applyLoginReward();
  saveState();
}

function word(wordText, phonetic, meaning, level, goal, image, example, cloze, options) {
  return { word: wordText, phonetic, meaning, level, goal: expandGoals(goal), image, example, cloze, options, pos: partOfSpeech[wordText] || "word", library: "built-in" };
}

function expandGoals(goalList) {
  const mapped = new Set(goalList);
  const map = {
    國中英文: ["會考", "英檢初級"],
    高中英文: ["學測", "英檢初級"],
    TOEIC: ["多益"],
    全民英檢: ["英檢初級"],
    商務英文: ["多益", "托福"],
    生活英文: ["生活英文", "英檢初級", "會考"],
  };
  goalList.forEach((goal) => (map[goal] || []).forEach((item) => mapped.add(item)));
  return Array.from(mapped);
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

function cardImage(item) {
  if (item.library === "built-in") return `./assets/cards/${item.word}.svg`;
  return customCardImage(item);
}

function customCardImage(item) {
  const bg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
      <rect width="1200" height="900" fill="#17202a"/>
      <path d="M120 720c220-150 420-150 640 0s300 120 440 20v160H0V760z" fill="#4c2f1e"/>
      <rect x="280" y="180" width="640" height="470" rx="34" fill="#fff6df"/>
      <path d="M360 330h480M360 440h360M360 550h440" stroke="#7f231d" stroke-width="30" stroke-linecap="round"/>
      <circle cx="920" cy="190" r="76" fill="#e7b64b"/>
    </svg>
  `);
  return `data:image/svg+xml,${bg}`;
}

function getWordTier(item) {
  const sameLevel = allWords().filter((candidate) => candidate.level === item.level);
  const ordered = sameLevel.sort((a, b) => {
    if (a.word.length !== b.word.length) return a.word.length - b.word.length;
    return a.word.localeCompare(b.word);
  });
  const index = Math.max(0, ordered.findIndex((candidate) => candidate.word === item.word));
  return Math.min(5, Math.floor((index / Math.max(1, ordered.length)) * 5) + 1);
}

function wordTierLabel(item) {
  return t(`tier${getWordTier(item)}`);
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

function addXp(amount) {
  const before = getPlayerRank();
  state.xp = (state.xp || 0) + amount;
  const after = getPlayerRank();
  if (after > before && !state.pendingLevelUp) {
    const monster = after % 5 === 0 ? createMonster(after) : null;
    state.pendingLevelUp = { from: before, to: after, loot: levelLoot(after), monster };
    state.achievements.firstLevelUp = true;
    state.achievements.levelUps += 1;
  }
}

function levelLoot(level) {
  return level % 3 === 0 ? { bomb: 1, potion: 1 } : level % 2 === 0 ? { sword: 1, potion: 1 } : { sword: 1 };
}

function addInventory(items) {
  Object.entries(items).forEach(([key, amount]) => {
    state.inventory[key] = (state.inventory[key] || 0) + amount;
  });
}

function createMonster(level) {
  const monsters = [
    { id: "slime", name: "沼澤史萊姆", icon: "🟢", hp: 70, attack: 8 },
    { id: "golem", name: "石甲魔像", icon: "🗿", hp: 110, attack: 12 },
    { id: "wraith", name: "古堡幽影", icon: "👻", hp: 90, attack: 16 },
    { id: "dragon", name: "赤焰幼龍", icon: "🐉", hp: 150, attack: 18 },
  ];
  const base = monsters[(Math.floor(level / 5) - 1) % monsters.length];
  return { ...base, hp: base.hp + level * 6, maxHp: base.hp + level * 6, level };
}

function allWords() {
  return [...words, ...state.customLibraries.flatMap((library) => library.words || [])];
}

function activeGoal() {
  return state.activeGoal || state.goal || goals[0];
}

function canUseAdmin() {
  if (!state.user) return false;
  if (state.user.id === "local-google-user") return true;
  return ADMIN_EMAILS.includes(String(state.user.email || "").toLowerCase());
}

function activeProfile() {
  return ensureProfile(activeGoal());
}

function ensureProfile(goal) {
  if (!state.goalProfiles) state.goalProfiles = {};
  if (!state.goalProfiles[goal]) {
    state.goalProfiles[goal] = {
      placement: null,
      learned: [],
      learnedLog: {},
      weak: [],
      dailyTests: {},
    };
  }
  return state.goalProfiles[goal];
}

function migrateState() {
  if (!state.userGoals) state.userGoals = [state.activeGoal || state.goal || goals[0]];
  if (!state.activeGoal) state.activeGoal = state.userGoals[0] || state.goal || goals[0];
  const profile = ensureProfile(state.activeGoal);
  if (state.placement && !profile.placement) profile.placement = state.placement;
  if (state.learned?.length && !profile.learned.length) profile.learned = state.learned;
  if (state.learnedLog && !Object.keys(profile.learnedLog).length) profile.learnedLog = state.learnedLog;
  if (state.weak?.length && !profile.weak.length) profile.weak = state.weak;
  if (state.dailyTests && !Object.keys(profile.dailyTests).length) profile.dailyTests = state.dailyTests;
}

function activeWords() {
  if (state.activeLibraryId && state.activeLibraryId !== "built-in") {
    const library = state.customLibraries.find((item) => item.id === state.activeLibraryId);
    return library?.words?.length ? library.words : words;
  }
  const targeted = words.filter((item) => item.goal.includes(activeGoal()));
  return targeted.length ? targeted : words;
}

function loadState() {
  const fallback = {
    user: null,
    native: "zh-Hant",
    goal: goals[0],
    activeGoal: goals[0],
    userGoals: [goals[0]],
    goalProfiles: {},
    placement: null,
    learned: [],
    learnedLog: {},
    weak: [],
    streak: 0,
    dailyTests: {},
    xp: 0,
    pendingLevelUp: null,
    lastLoginDate: null,
    streakDays: 0,
    streakReward: null,
    streakRewardKey: null,
    customLibraries: [],
    activeLibraryId: "built-in",
    inventory: {},
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
  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
  } catch {
    return fallback;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
      ${content}
    </div>
  `;
}

function render() {
  if (activeQuiz?.timer) clearInterval(activeQuiz.timer);
  if (screen !== "minigame" && miniGame?.timer) {
    clearInterval(miniGame.timer);
    miniGame.timer = null;
  }
  const app = document.querySelector("#app");
  if (screen === "login") app.innerHTML = renderLogin();
  if (screen === "placement") app.innerHTML = renderQuiz("placement");
  if (screen === "daily") app.innerHTML = renderQuiz("daily");
  if (screen === "review") app.innerHTML = renderQuiz("review");
  if (screen === "result") app.innerHTML = renderResult();
  if (screen === "dashboard") app.innerHTML = renderDashboard();
  if (screen === "study") app.innerHTML = renderStudy();
  if (screen === "weak") app.innerHTML = renderWeak();
  if (screen === "minigame") app.innerHTML = renderMonsterBattle();
  if (screen === "import") app.innerHTML = renderImport();
  if (screen === "achievements") app.innerHTML = renderAchievements();
  if (screen === "admin") app.innerHTML = renderAdmin();
  bindActions();
}

function renderLogin() {
  return appShell(`
    <section class="layout">
      <div class="hero">
        <div>
          <div class="eyebrow">Adaptive vocabulary RPG</div>
          <h2>${t("introTitle")}</h2>
          <p class="hero-copy">${t("introCopy")}</p>
          <div class="goal-altar">
            <div class="eyebrow">${t("goal")}</div>
            <div class="chips large">
              ${goals.map((goal) => `<button class="chip ${selectedGoals.includes(goal) ? "active" : ""}" data-goal="${goal}">${goalLabel(goal)}</button>`).join("")}
            </div>
          </div>
          <div class="actions">
            <button class="btn" data-action="login">${t("google")}</button>
            <button class="btn secondary" data-action="login">${t("mock")}</button>
          </div>
        </div>
        <div class="stats">
          <div class="stat"><strong>3:00</strong><span>${t("statPlacement")}</span></div>
          <div class="stat"><strong>10</strong><span>${t("statWords")}</span></div>
          <div class="stat"><strong>5</strong><span>${t("statRanks")}</span></div>
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

function renderQuiz(kind) {
  if (!activeQuiz || activeQuiz.kind !== kind) activeQuiz = createQuiz(kind);
  const current = activeQuiz.questions[activeQuiz.index] || activeQuiz.questions[0];
  const remaining = getQuizRemainingSeconds();
  activeQuiz.timer = setInterval(updateQuizTimer, 1000);
  const isCloze = current.type === "cloze";
  const title = kind === "daily" ? t("dailyTitle") : t("placementTitle");
  const helper = kind === "review" ? t("reviewHelper") : kind === "daily" ? t("dailyHelper") : t("placementHelper");
  const heading = kind === "review" ? t("reviewTitle") : title;

  return appShell(`
    <section class="panel quiz-wrap">
      <div class="quiz-head">
        <div>
          <div class="eyebrow">${kind === "review" ? t("review") : kind === "daily" ? t("daily") : t("test")}</div>
          <h2 class="page-title">${heading}</h2>
          <p class="muted">${msg("questionProgress", { current: activeQuiz.index + 1, total: activeQuiz.questions.length })} · ${helper}</p>
        </div>
        <div class="timer" id="timer">${formatTime(remaining)}</div>
      </div>
      <div class="meter"><span style="width:${(activeQuiz.index / activeQuiz.questions.length) * 100}%"></span></div>
      <div class="question">
        <div>
          <div class="${isCloze ? "sentence" : "word"}">${isCloze ? current.cloze : current.word}</div>
          <div class="phonetic">${isCloze ? t("clozeHint") : current.phonetic}</div>
        </div>
      </div>
      <div class="answers">
        ${shuffle(current.choices).map((option) => `<button class="answer" data-quiz-answer="${option}" data-correct="${current.correct}">${option}</button>`).join("")}
      </div>
      <div class="toast">${toast}</div>
      ${celebrate ? `<div class="celebrate">${t("correctFx")}</div>` : ""}
    </section>
  `);
}

function renderResult() {
  const profile = activeProfile();
  const level = getLevel(profile.placement.score);
  const label = levelLabel(level);
  return appShell(`
    <section class="panel">
      <div class="eyebrow">${t("placementDone")}</div>
      <h2 class="page-title">${label.name}</h2>
      <p class="hero-copy">${msg("resultCopy", { score: profile.placement.score, tone: label.tone })}</p>
      <div class="stats">
        <div class="stat"><strong>${profile.placement.correct}</strong><span>${t("correct")}</span></div>
        <div class="stat"><strong>${profile.placement.total}</strong><span>${t("totalQuestions")}</span></div>
        <div class="stat"><strong>${goalLabel(activeGoal())}</strong><span>${t("target")}</span></div>
      </div>
      <div class="actions">
        <button class="btn" data-action="dashboard">${t("dashboard")}</button>
      </div>
    </section>
  `);
}

function renderDashboard() {
  const profile = activeProfile();
  const level = getLevel(profile.placement.score);
  const label = levelLabel(level);
  const todayCount = getWordsLearnedOn(TODAY).length;
  const learnedPercent = getLearnedPercent();
  const progress = learnedPercent;
  const rank = getPlayerRank();
  const xp = state.xp || 0;
  const nextNeed = xpNeededForRank(rank);
  const currentXp = xpIntoCurrentRank();
  return appShell(`
    <section class="dashboard">
      <div class="panel game-panel">
        <div class="eyebrow">${t("dashboard")}</div>
        <h2 class="page-title">${state.user.name} · ${label.name}</h2>
        <div class="goal-switch">
          <span>${t("activeGoal")}</span>
          ${state.userGoals.map((goal) => `<button class="chip ${activeGoal() === goal ? "active" : ""}" data-active-goal="${goal}">${goalLabel(goal)}</button>`).join("")}
          ${goals.filter((goal) => !state.userGoals.includes(goal)).map((goal) => `<button class="chip add" data-add-goal="${goal}">+ ${goalLabel(goal)}</button>`).join("")}
        </div>
        <p class="hero-copy">${msg("dashboardCopy", { goal: goalLabel(activeGoal()) })}</p>
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
        ${state.pendingLevelUp ? `<div class="quest-alert"><strong>${t("levelUp")} Lv.${state.pendingLevelUp.from} -> Lv.${state.pendingLevelUp.to}</strong><button class="btn" data-action="claim-level-loot">${t("claimLevelLoot")}</button>${state.pendingLevelUp.monster ? `<button class="btn" data-action="minigame">${t("battleMonster")}</button>` : ""}</div>` : ""}
        ${state.streakRewardKey ? `<div class="quest-alert small"><strong>${t("streak")} ${state.streakDays}</strong><span>${msg("streakReward", { reward: t(state.streakRewardKey) })}</span></div>` : ""}
        <div class="actions">
          <button class="btn" data-action="study">${t("learn")}</button>
          <button class="btn ghost" data-action="daily">${t("daily")}</button>
          <button class="btn ghost" data-action="weak">${t("weak")} (${profile.weak.length})</button>
          <button class="btn ghost" data-action="review" ${learnedPercent >= 60 ? "" : "disabled"}>${t("review")}</button>
          <button class="btn ghost" data-action="import">${t("importWords")}</button>
          <button class="btn ghost" data-action="achievements">${t("achievements")}</button>
          <button class="btn secondary" data-action="reset">${t("reset")}</button>
        </div>
      </div>
      <div class="panel library-panel">
        <div class="field">
          <label>${t("library")}</label>
          <select class="select" data-action="library">
            <option value="built-in" ${state.activeLibraryId === "built-in" ? "selected" : ""}>${t("builtInLibrary")} · ${goalLabel(activeGoal())}</option>
            ${state.customLibraries.map((library) => `<option value="${library.id}" ${state.activeLibraryId === library.id ? "selected" : ""}>${t("customLibrary")} · ${library.name}</option>`).join("")}
          </select>
        </div>
        <div class="library-switches">
          <button class="btn ${state.activeLibraryId === "built-in" ? "" : "secondary"}" data-switch-library="built-in">${t("builtInLibrary")}</button>
          ${state.customLibraries.map((library) => `<button class="btn ${state.activeLibraryId === library.id ? "" : "secondary"}" data-switch-library="${library.id}">${library.name}</button>`).join("")}
          <button class="btn ghost" data-action="import">${t("importWords")}</button>
        </div>
      </div>
      <div class="grid">
        <article class="card level-card">
          <h3>${t("todayProgress")}</h3>
          <p class="muted">${msg("todayProgressCopy", { today: todayCount, total: profile.learned.length })}</p>
          <p class="muted">${learnedPercent >= 60 ? msg("reviewReady", { percent: learnedPercent }) : t("reviewLocked")}</p>
          <div class="meter"><span style="width:${Math.min(100, todayCount * 10)}%"></span></div>
        </article>
        ${levels
          .map(
            (item) => `
              <article class="card level-card">
                <h3>${levelLabel(item).name}</h3>
                <p class="muted">${levelLabel(item).tone}</p>
                <div class="meter"><span style="width:${item.id <= level.id ? progress : 0}%"></span></div>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `);
}

function renderStudy() {
  if (!studySession) studySession = createStudySession();
  if (studySession.phase === "preview") {
    const current = studySession.words[studySession.previewIndex] || studySession.words[0];
    return appShell(`
      <section class="flash-stage">
        <article class="flashcard" data-card-swipe>
          <div class="flash-visual" style="background-image: linear-gradient(135deg, rgba(18, 32, 45, 0.18), rgba(17, 24, 39, 0.32)), url('${cardImage(current)}');" aria-hidden="true">
            <span class="image-badge">${current.image}</span>
          </div>
          <div class="flash-copy">
            <div class="eyebrow">${t("previewEyebrow")} · ${msg("cardProgress", { current: studySession.previewIndex + 1, total: studySession.words.length })}</div>
            <h2>${current.word}</h2>
            <p class="phonetic">${current.phonetic}</p>
            <div class="card-tags">
              <span class="tag">${current.pos}</span>
              <span class="tag tier">${t("wordTier")} · ${wordTierLabel(current)}</span>
            </div>
            <h3>${current.meaning}</h3>
            <p class="example">${current.example}</p>
            <p class="muted">${t("cardHint")}</p>
          </div>
          <div class="actions">
            <button class="btn secondary" data-action="speak-word" data-word="${current.word}">${t("speak")}</button>
            <button class="btn secondary" data-action="prev-card">${t("previousCard")}</button>
            <button class="btn" data-action="next-card">${t("nextCard")}</button>
            <button class="btn" data-action="start-study-quiz">${t("previewDone")}</button>
            <button class="btn secondary" data-action="dashboard">${t("back")}</button>
          </div>
        </article>
      </section>
    `);
  }

  const current = studySession.questions[studySession.index] || studySession.questions[0];
  const isCloze = current.type === "cloze";
  return appShell(`
    <section class="panel quiz-wrap">
      <div class="quiz-head">
        <div>
          <div class="eyebrow">Recall battle</div>
          <h2 class="page-title">${t("recallTitle")}</h2>
          <p class="muted">${msg("questionProgress", { current: studySession.index + 1, total: studySession.questions.length })}</p>
        </div>
        <div class="visual" style="min-height:120px;font-size:56px">${current.image}</div>
      </div>
      <div class="question">
        <div>
          <div class="${isCloze ? "sentence" : "word"}">${isCloze ? current.cloze : current.word}</div>
          <div class="phonetic">${isCloze ? t("clozeHint") : current.phonetic}</div>
        </div>
      </div>
      <div class="battle-options">
        ${shuffle(current.choices).map((option) => `<button class="answer" data-study-answer="${option}" data-correct="${current.correct}">${option}</button>`).join("")}
      </div>
      <div class="toast">${toast}</div>
      ${celebrate ? `<div class="celebrate">${t("correctFx")}</div>` : ""}
    </section>
  `);
}

function renderWeak() {
  const profile = activeProfile();
  const weakWords = activeWords().filter((item) => profile.weak.includes(item.word));
  return appShell(`
    <section class="panel">
      <div class="eyebrow">${t("weak")}</div>
      <h2 class="page-title">${t("weakTitle")}</h2>
      <p class="hero-copy">${weakWords.length ? t("weakCopyFilled") : t("weakCopyEmpty")}</p>
      <div class="grid">
        ${weakWords
          .map(
            (item) => `
              <article class="card">
                <h3>${item.image} ${item.word}</h3>
                <p><strong>${item.meaning}</strong></p>
                <p class="muted">${item.example}</p>
              </article>
            `,
          )
          .join("")}
      </div>
      <div class="actions">
        <button class="btn secondary" data-action="dashboard">${t("back")}</button>
      </div>
    </section>
  `);
}

function renderMonsterBattle() {
  if (!battle) {
    const monster = state.pendingLevelUp?.monster || createMonster(getPlayerRank());
    battle = { monster: { ...monster }, playerHp: 100, log: "" };
  }
  const monster = battle.monster;
  const won = monster.hp <= 0;
  return appShell(`
    <section class="panel retro-game">
      <div>
        <div class="eyebrow">${t("monsterBattle")}</div>
        <h2 class="page-title">${monster.name} ${monster.icon}</h2>
        <p class="hero-copy">${won ? t("victory") : battle.log || t("noItems")}</p>
        <div class="stats">
          <div class="stat"><strong>${battle.playerHp}</strong><span>${t("playerHp")}</span></div>
          <div class="stat"><strong>${Math.max(0, monster.hp)}/${monster.maxHp}</strong><span>${t("monsterHp")}</span></div>
          <div class="stat"><strong>${Object.values(state.inventory).reduce((sum, n) => sum + n, 0)}</strong><span>${t("inventory")}</span></div>
        </div>
      </div>
      <div class="monster-art">${monsterSvg(monster)}</div>
      <div class="item-grid">
        ${battleItems().map((item) => `<button class="item-card" data-use-item="${item.id}" ${won || (state.inventory[item.id] || 0) <= 0 ? "disabled" : ""}><strong>${item.icon} ${item.name}</strong><span>x${state.inventory[item.id] || 0}</span><small>${item.effect}</small></button>`).join("")}
      </div>
      <div class="actions">
        ${won ? `<button class="btn" data-action="claim-battle">${t("claimReward")}</button>` : ""}
        <button class="btn secondary" data-action="dashboard">${t("back")}</button>
      </div>
    </section>
  `);
}

function renderImport() {
  return appShell(`
    <section class="panel import-panel">
      <div class="eyebrow">${t("importWords")}</div>
      <h2 class="page-title">${t("importTitle")}</h2>
          <p class="hero-copy">${t("importCopy")}</p>
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
        <button class="btn secondary" data-action="dashboard">${t("back")}</button>
      </div>
      <div class="toast">${toast}</div>
    </section>
  `);
}

function renderAchievements() {
  const badges = achievementBadges();
  return appShell(`
    <section class="panel">
      <div class="eyebrow">${t("achievements")}</div>
      <h2 class="page-title">${t("achievements")}</h2>
      <div class="badge-grid">
        ${badges
          .map(
            (badge) => `
              <article class="card achievement-badge ${badge.done ? "done" : ""}">
                <div class="badge-art">${badgeSvg(badge.icon, badge.done)}</div>
                <div>
                  <h3>${badge.name}</h3>
                  <p><strong>${badge.label}</strong></p>
                  <p class="muted">${badge.condition}</p>
                  <div class="meter"><span style="width:${badge.progress}%"></span></div>
                </div>
              </article>
            `,
          )
          .join("")}
      </div>
      <div class="actions"><button class="btn secondary" data-action="dashboard">${t("back")}</button></div>
    </section>
  `);
}

function achievementBadges() {
  const a = state.achievements;
  const streak = state.streakDays || 0;
  return [
    {
      name: "千答斬",
      label: t("achTotalCorrect"),
      condition: "累計答對 100 題。",
      value: a.totalCorrect,
      goal: 100,
      icon: "sword",
    },
    {
      name: "不斷連擊的誓約者",
      label: t("achBestCombo"),
      condition: "單次最高連續答對 20 題。",
      value: a.bestCombo,
      goal: 20,
      icon: "flame",
    },
    {
      name: "晨星巡禮者",
      label: t("achLoginStreak"),
      condition: "連續登入 7 天。",
      value: streak,
      goal: 7,
      icon: "sun",
    },
    {
      name: "時之門守望者",
      label: t("achTotalLogin"),
      condition: "累計登入 30 天。",
      value: a.totalLoginDays,
      goal: 30,
      icon: "hourglass",
    },
    {
      name: "破殼的初階勇者",
      label: t("achFirstLevel"),
      condition: "第一次升級。",
      value: a.firstLevelUp ? 1 : 0,
      goal: 1,
      icon: "crown",
    },
    {
      name: "魔物討伐錄",
      label: t("achMonster"),
      condition: "成功擊敗 3 隻怪物。",
      value: a.monstersDefeated,
      goal: 3,
      icon: "monster",
    },
    {
      name: "秘典編纂者",
      label: t("importWords"),
      condition: "建立 3 個自訂單字庫。",
      value: a.importedLibraries,
      goal: 3,
      icon: "book",
    },
    {
      name: "終章試煉突破者",
      label: t("review"),
      condition: "通過 1 次總複習測驗。",
      value: a.grandReviews,
      goal: 1,
      icon: "gate",
    },
  ].map((badge) => ({
    ...badge,
    done: badge.value >= badge.goal,
    progress: Math.min(100, Math.round((badge.value / badge.goal) * 100)),
    label: `${badge.label}: ${badge.value}/${badge.goal}`,
  }));
}

function badgeSvg(icon, done) {
  const color = done ? "#e7b64b" : "#8a8175";
  const mark = {
    sword: '<path d="M64 20l18 18-38 38-18-18z"/><path d="M24 74l22-22 14 14-22 22z"/>',
    flame: '<path d="M64 14c28 30-18 34 8 64 16-10 24-24 20-42 28 30 18 76-28 76-42 0-58-42-30-70 0 22 22 20 30-28z"/>',
    sun: '<circle cx="64" cy="64" r="24"/><path d="M64 10v18M64 100v18M10 64h18M100 64h18M25 25l13 13M90 90l13 13M103 25L90 38M38 90l-13 13"/>',
    hourglass: '<path d="M34 18h60M34 110h60M44 24c0 28 40 28 40 40s-40 12-40 40M84 24c0 28-40 28-40 40s40 12 40 40"/>',
    crown: '<path d="M22 92h84l-8-54-24 24-10-34-18 34-24-24z"/>',
    monster: '<circle cx="64" cy="68" r="36"/><circle cx="50" cy="58" r="6"/><circle cx="78" cy="58" r="6"/><path d="M42 82c16 12 28 12 44 0"/>',
    book: '<path d="M22 24h38c12 0 18 6 18 18v62c0-12-8-18-20-18H22zM106 24H78v80c0-12 8-18 20-18h8z"/>',
    gate: '<path d="M28 106V48c0-28 72-28 72 0v58M46 106V56c0-14 36-14 36 0v50"/>',
  }[icon];
  return `<svg viewBox="0 0 128 128" aria-hidden="true"><path d="M64 8l49 28v56l-49 28-49-28V36z" fill="${color}" stroke="#4c2f1e" stroke-width="6"/><g fill="#4c2f1e" stroke="#4c2f1e" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${mark}</g></svg>`;
}

function renderAdmin() {
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
        ].map(([action, label]) => `<button class="card admin-card" data-admin="${action}"><strong>${label}</strong></button>`).join("")}
      </div>
      <div class="actions">
        <button class="btn secondary" data-action="dashboard">${t("back")}</button>
        <button class="btn ghost" data-admin="admin-clear">${t("adminClear")}</button>
      </div>
    </section>
  `);
}

function bindActions() {
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
      activeQuiz = null;
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-switch-library]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeLibraryId = button.dataset.switchLibrary;
      studySession = null;
      activeQuiz = null;
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-goal]").forEach((button) => {
    button.addEventListener("click", () => {
      const goal = button.dataset.goal;
      selectedGoals = selectedGoals.includes(goal)
        ? selectedGoals.filter((item) => item !== goal)
        : [...selectedGoals, goal];
      if (!selectedGoals.length) selectedGoals = [goal];
      selectedGoal = selectedGoals[0];
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
  document.querySelectorAll("[data-action='login']").forEach((button) => {
    button.addEventListener("click", () => {
      const name = document.querySelector("#nameInput")?.value?.trim() || t("traveler");
      state.user = { id: "local-google-user", name };
      state.userGoals = selectedGoals;
      state.activeGoal = selectedGoals[0];
      state.goal = state.activeGoal;
      selectedGoals.forEach((goal) => ensureProfile(goal));
      applyLoginReward();
      saveState();
      screen = "placement";
      activeQuiz = null;
      render();
    });
  });
  document.querySelectorAll("[data-action='signout']").forEach((button) => {
    button.addEventListener("click", () => {
      state.user = null;
      saveState();
      screen = "login";
      render();
    });
  });
  document.querySelectorAll("[data-action='admin']").forEach((button) => {
    button.addEventListener("click", () => {
      if (!canUseAdmin()) return;
      screen = "admin";
      render();
    });
  });
  document.querySelectorAll("[data-admin]").forEach((button) => {
    button.addEventListener("click", () => runAdminAction(button.dataset.admin));
  });
  document.querySelectorAll("[data-quiz-answer]").forEach((button) => {
    button.addEventListener("click", () => answerQuiz(button.dataset.quizAnswer, button.dataset.correct));
  });
  document.querySelectorAll("[data-action='dashboard']").forEach((button) => {
    button.addEventListener("click", () => {
      screen = "dashboard";
      studySession = null;
      activeQuiz = null;
      toast = "";
      render();
    });
  });
  document.querySelectorAll("[data-action='study']").forEach((button) => {
    button.addEventListener("click", () => {
      screen = "study";
      studySession = createStudySession();
      toast = "";
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
      screen = "daily";
      activeQuiz = null;
      toast = "";
      render();
    });
  });
  document.querySelectorAll("[data-action='review']").forEach((button) => {
    button.addEventListener("click", () => {
      if (getLearnedPercent() < 60) return;
      screen = "review";
      activeQuiz = null;
      toast = "";
      render();
    });
  });
  document.querySelectorAll("[data-action='import']").forEach((button) => {
    button.addEventListener("click", () => {
      screen = "import";
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
      screen = "weak";
      render();
    });
  });
  document.querySelectorAll("[data-action='minigame']").forEach((button) => {
    button.addEventListener("click", () => {
      screen = "minigame";
      battle = null;
      render();
    });
  });
  document.querySelectorAll("[data-action='claim-level-loot']").forEach((button) => {
    button.addEventListener("click", () => claimLevelLoot());
  });
  document.querySelectorAll("[data-use-item]").forEach((button) => {
    button.addEventListener("click", () => useBattleItem(button.dataset.useItem));
  });
  document.querySelectorAll("[data-action='claim-battle']").forEach((button) => {
    button.addEventListener("click", () => claimBattleReward());
  });
  document.querySelectorAll("[data-action='achievements']").forEach((button) => {
    button.addEventListener("click", () => {
      screen = "achievements";
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
      selectedGoals = state.userGoals?.length ? [...state.userGoals] : [activeGoal()];
      selectedGoal = selectedGoals[0];
      screen = "login";
      activeQuiz = null;
      studySession = null;
      render();
    });
  });
}

function applyLoginReward() {
  if (state.lastLoginDate === TODAY) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  state.streakDays = state.lastLoginDate === yesterday ? (state.streakDays || 0) + 1 : 1;
  state.lastLoginDate = TODAY;
  state.achievements.totalLoginDays += 1;
  const rewardKey = state.streakDays % 7 === 0 ? "reward7" : state.streakDays % 5 === 0 ? "reward5" : state.streakDays % 3 === 0 ? "reward3" : "reward1";
  const rewardXp = rewardKey === "reward7" ? 100 : rewardKey === "reward5" ? 60 : rewardKey === "reward3" ? 30 : 10;
  state.streakRewardKey = rewardKey;
  state.streakReward = t(rewardKey);
  addXp(rewardXp);
}

function switchActiveGoal(goal) {
  state.activeGoal = goal;
  state.goal = goal;
  ensureProfile(goal);
  activeQuiz = null;
  studySession = null;
  screen = activeProfile().placement ? "dashboard" : "placement";
  saveState();
  render();
}

function runAdminAction(action) {
  if (!canUseAdmin()) return;
  const profile = activeProfile();
  if (action === "admin-xp") addXp(500);
  if (action === "admin-level") {
    const rank = getPlayerRank();
    state.pendingLevelUp = { from: rank, to: rank + 1, loot: levelLoot(rank + 1), monster: (rank + 1) % 5 === 0 ? createMonster(rank + 1) : null };
  }
  if (action === "admin-learn") {
    profile.learned = activeWords().map((item) => item.word);
    activeWords().forEach((item) => {
      profile.learnedLog[item.word] = TODAY;
    });
  }
  if (action === "admin-review") {
    screen = "review";
    activeQuiz = null;
  }
  if (action === "admin-battle") {
    state.pendingLevelUp = state.pendingLevelUp || { from: getPlayerRank(), to: getPlayerRank(), loot: {}, monster: createMonster(getPlayerRank()) };
    state.pendingLevelUp.monster = state.pendingLevelUp.monster || createMonster(getPlayerRank());
    screen = "minigame";
    battle = null;
  }
  if (action === "admin-items") addInventory({ sword: 9, bomb: 9, potion: 9 });
  if (action === "admin-clear") {
    localStorage.removeItem(STORAGE_KEY);
    state = loadState();
    migrateState();
    selectedGoals = state.userGoals?.length ? [...state.userGoals] : [activeGoal()];
    selectedGoal = selectedGoals[0];
    screen = "login";
  }
  saveState();
  render();
}

function battleItems() {
  return [
    { id: "sword", name: "鐵劍", icon: "⚔️", damage: 24, effect: "-24 HP" },
    { id: "bomb", name: "火焰瓶", icon: "🔥", damage: 42, effect: "-42 HP" },
    { id: "potion", name: "治療藥水", icon: "🧪", heal: 32, effect: "+32 HP" },
  ];
}

function useBattleItem(itemId) {
  if (!battle || (state.inventory[itemId] || 0) <= 0 || battle.monster.hp <= 0) return;
  const item = battleItems().find((entry) => entry.id === itemId);
  state.inventory[itemId] -= 1;
  if (item.damage) battle.monster.hp -= item.damage;
  if (item.heal) battle.playerHp = Math.min(100, battle.playerHp + item.heal);
  if (battle.monster.hp > 0) battle.playerHp = Math.max(0, battle.playerHp - battle.monster.attack);
  battle.log = `${item.name} ${item.effect}`;
  if (battle.playerHp <= 0) {
    battle.playerHp = 100;
    battle.log = t("noItems");
  }
  saveState();
  render();
}

function claimLevelLoot() {
  if (!state.pendingLevelUp) return;
  addInventory(state.pendingLevelUp.loot || {});
  if (!state.pendingLevelUp.monster) state.pendingLevelUp = null;
  saveState();
  render();
}

function claimBattleReward() {
  if (!battle || battle.monster.hp > 0) return;
  state.achievements.monstersDefeated += 1;
  addXp(50 + battle.monster.level * 5);
  state.pendingLevelUp = null;
  battle = null;
  screen = "dashboard";
  saveState();
  render();
}

function monsterSvg(monster) {
  return `
    <svg viewBox="0 0 420 300" role="img" aria-label="${monster.name}">
      <rect width="420" height="300" rx="18" fill="#101820"/>
      <circle cx="210" cy="150" r="82" fill="${monster.id === "dragon" ? "#b4362b" : monster.id === "golem" ? "#8a8175" : monster.id === "wraith" ? "#637083" : "#168c7c"}"/>
      <circle cx="178" cy="132" r="13" fill="#fff6df"/><circle cx="242" cy="132" r="13" fill="#fff6df"/>
      <path d="M165 190c30 24 60 24 90 0" fill="none" stroke="#fff6df" stroke-width="12" stroke-linecap="round"/>
      <text x="210" y="270" fill="#fff6df" font-size="28" text-anchor="middle">${monster.name}</text>
    </svg>`;
}

function triggerCelebrate() {
  celebrate = true;
  setTimeout(() => {
    celebrate = false;
    render();
  }, 800);
}

async function saveImportedLibrary() {
  const name = document.querySelector("#libraryName")?.value?.trim() || t("customLibrary");
  const raw = document.querySelector("#wordImportText")?.value || "";
  toast = "Loading...";
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
  toast = msg("imported", { count: imported.length });
  saveState();
  screen = "dashboard";
  render();
}

async function parseImportedWords(raw) {
  const entries = raw
    .split(/\r?\n/)
    .flatMap((line) => line.split(/,|\s/))
    .map((line) => line.trim().toLowerCase())
    .filter(Boolean)
    .filter((entry) => /^[a-z-]+$/.test(entry));
  const unique = Array.from(new Set(entries));
  const lookedUp = await Promise.all(unique.map((wordText, index) => lookupWord(wordText, index)));
  return lookedUp.filter(Boolean);
}

async function lookupWord(wordText, index) {
  try {
    const response = await fetch(`/api/cambridge?word=${encodeURIComponent(wordText)}`);
    const entry = await response.json();
    return importedWordFromEntry(wordText, entry, index);
  } catch {
    return importedWordFromEntry(wordText, {}, index);
  }
}

function importedWordFromEntry(wordText, entry, index) {
      const level = Math.min(5, Math.max(1, Math.ceil((wordText.length + index / 2) / 4)));
      const meaning = entry.meaning || wordText;
      const example = entry.example || `I want to remember ${wordText}.`;
      return {
        word: wordText.toLowerCase(),
        phonetic: "",
        meaning,
        level,
        goal: [activeGoal()],
        image: "🗡️",
        example,
        cloze: example.toLowerCase().includes(wordText.toLowerCase()) ? example.replace(new RegExp(escapeRegExp(wordText), "i"), "____") : `____ means ${meaning}.`,
        options: [meaning],
        pos: normalizePos(entry.pos || "word"),
      };
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

function createQuiz(kind) {
  const source = kind === "daily" ? buildDailyWords() : kind === "review" ? buildReviewWords() : buildPlacementWords();
  const questions = source.map((item, index) => buildQuestion(item, kind === "daily" || index % 2 === 1 ? "cloze" : "meaning"));
  return {
    kind,
    questions,
    index: 0,
    score: 0,
    correct: 0,
    answers: 0,
    startedAt: Date.now(),
    duration: kind === "review" ? 900 : 180,
    timer: null,
  };
}

function buildPlacementWords() {
  const source = activeWords();
  return shuffle(source).slice(0, Math.min(36, source.length));
}

function buildReviewWords() {
  const profile = activeProfile();
  const level = getLevel(profile.placement?.score || 0);
  const source = activeWords().filter((item) => item.level <= level.id);
  return shuffle(source).slice(0, Math.min(60, source.length));
}

function buildDailyWords() {
  const profile = activeProfile();
  const today = getWordsLearnedOn(TODAY);
  const older = profile.learned.filter((wordText) => !today.includes(wordText));
  const weak = profile.weak;
  const selected = uniqueWords([
    ...shuffle(today).slice(0, 7),
    ...shuffle(older).slice(0, 3),
    ...shuffle(weak).slice(0, 3),
  ]);
  const fallback = selected.length >= 8 ? [] : getStudyPool().map((item) => item.word);
  return uniqueWords([...selected, ...fallback])
    .map((wordText) => findWord(wordText))
    .filter(Boolean)
    .slice(0, 12);
}

function getLearnedPercent() {
  const source = activeWords();
  if (!source.length) return 0;
  const learned = activeProfile().learned.filter((wordText) => source.some((item) => item.word === wordText));
  return Math.round((new Set(learned).size / source.length) * 100);
}

function weightedStudyWords(count) {
  const profile = activeProfile();
  const level = getLevel(profile.placement?.score || 0);
  const source = activeWords().filter((item) => item.level <= Math.min(5, level.id + 1));
  const weightsByLevel = {
    1: [6, 4, 2, 1, 1],
    2: [4, 5, 3, 2, 1],
    3: [2, 4, 5, 3, 2],
    4: [1, 2, 4, 5, 4],
    5: [1, 1, 2, 4, 7],
  };
  const weights = weightsByLevel[level.id] || weightsByLevel[1];
  const weighted = [];
  source.forEach((item) => {
    const tier = getWordTier(item);
    const weakBoost = profile.weak.includes(item.word) ? 4 : 1;
    const amount = (weights[tier - 1] || 1) * weakBoost;
    for (let i = 0; i < amount; i += 1) weighted.push(item);
  });
  return weightedSampleUnique(weighted.length ? weighted : source, count);
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
  if (type === "cloze") {
    return {
      ...item,
      type,
      correct: item.word,
      choices: buildWordChoices(item),
    };
  }
  return {
    ...item,
    type,
    correct: item.meaning,
    choices: buildMeaningChoices(item),
  };
}

function answerQuiz(answer, correct) {
  activeQuiz.answers += 1;
  const current = activeQuiz.questions[activeQuiz.index];
  if (answer === correct) {
    activeQuiz.score += current.level * 8 + 4;
    activeQuiz.correct += 1;
    recordCorrect();
    addXp(activeQuiz.kind === "daily" ? 12 : 8);
    toast = t("hit");
    triggerCelebrate();
  } else {
    addWeak(current.word);
    recordWrong();
    addXp(2);
    toast = msg("miss", { answer: correct });
  }
  activeQuiz.index += 1;
  if (activeQuiz.index >= activeQuiz.questions.length || getQuizRemainingSeconds() <= 0) finishQuiz();
  else render();
}

function finishQuiz() {
  const profile = activeProfile();
  if (activeQuiz.kind === "placement") {
    const maxScore = activeQuiz.questions.reduce((sum, item) => sum + item.level * 8 + 4, 0);
    profile.placement = {
      score: Math.round((activeQuiz.score / maxScore) * 100),
      correct: activeQuiz.correct,
      total: activeQuiz.answers,
      finishedAt: new Date().toISOString(),
    };
    screen = "result";
  } else if (activeQuiz.kind === "review") {
    const passed = activeQuiz.answers > 0 && activeQuiz.correct / activeQuiz.answers >= 0.7;
    if (passed) {
      const currentScore = profile.placement?.score || 0;
      const currentLevel = getLevel(currentScore);
      const nextLevel = levels[Math.min(levels.length - 1, currentLevel.id)];
      profile.placement = {
        ...(profile.placement || {}),
        score: Math.max(currentScore, nextLevel.min),
        reviewPassedAt: new Date().toISOString(),
      };
      state.achievements.grandReviews += 1;
      toast = t("reviewPassed");
    } else {
      toast = msg("dailyDone", { correct: activeQuiz.correct, total: activeQuiz.answers });
    }
    screen = "dashboard";
  } else {
    profile.dailyTests[TODAY] = {
      correct: activeQuiz.correct,
      total: activeQuiz.answers,
      finishedAt: new Date().toISOString(),
    };
    toast = msg("dailyDone", { correct: activeQuiz.correct, total: activeQuiz.answers });
    screen = "dashboard";
  }
  saveState();
  activeQuiz = null;
  render();
}

function createStudySession() {
  const profile = activeProfile();
  const sessionWords = uniqueWords([
    ...profile.weak,
    ...shuffle(getWordsLearnedBefore(TODAY)).slice(0, 2),
    ...weightedStudyWords(10).map((item) => item.word),
  ])
    .map((wordText) => findWord(wordText))
    .filter(Boolean)
    .slice(0, 10);
  const source = activeWords();
  const finalWords = sessionWords.length === 10 ? sessionWords : shuffle(source).slice(0, Math.min(10, source.length));
  return {
    phase: "preview",
    previewIndex: 0,
    words: finalWords,
    questions: finalWords.flatMap((item, index) => [
      buildQuestion(item, index % 2 === 0 ? "meaning" : "cloze"),
    ]),
    index: 0,
    correct: 0,
  };
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
  if (answer === correct) {
    toast = t("hitStudy");
    profile.learned = Array.from(new Set([...profile.learned, current.word]));
    profile.learnedLog[current.word] = TODAY;
    profile.weak = profile.weak.filter((wordText) => wordText !== current.word);
    studySession.correct += 1;
    recordCorrect();
    addXp(10 + getWordTier(current));
    triggerCelebrate();
  } else {
    toast = msg("missStudy", { answer: correct });
    addWeak(current.word);
    recordWrong();
    addXp(2);
  }
  studySession.index += 1;
  if (studySession.index >= studySession.questions.length) {
    state.streak += 1;
    studySession = null;
    screen = "dashboard";
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
  const level = getLevel(profile.placement?.score || 0);
  const source = activeWords();
  const weakWords = source.filter((item) => profile.weak.includes(item.word));
  const goalWords = source.filter((item) => item.goal.includes(activeGoal()) && item.level <= Math.min(5, level.id + 1));
  const oldWords = getWordsLearnedBefore(TODAY).map((wordText) => findWord(wordText)).filter(Boolean);
  const combined = [...weakWords, ...weakWords, ...weakWords, ...oldWords, ...goalWords];
  return combined.length ? uniqueWordObjects(combined) : source;
}

function getLevel(score) {
  return levels.reduce((matched, level) => (score >= level.min ? level : matched), levels[0]);
}

function addWeak(wordText) {
  const profile = activeProfile();
  profile.weak = Array.from(new Set([...profile.weak, wordText]));
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

function buildWordChoices(item) {
  const distractors = getSimilarWords(item).map((candidate) => candidate.word);
  return shuffle([item.word, ...distractors]).slice(0, 4);
}

function buildMeaningChoices(item) {
  const distractors = getSimilarWords(item).map((candidate) => candidate.meaning);
  return shuffle([item.meaning, ...distractors]).slice(0, 4);
}

function getSimilarWords(item) {
  const source = allWords();
  const samePos = source.filter((candidate) => candidate.word !== item.word && candidate.pos === item.pos);
  const nearLevel = samePos.filter((candidate) => Math.abs(candidate.level - item.level) <= 1);
  const lookAlikes = samePos
    .sort((a, b) => similarityScore(item.word, b.word) - similarityScore(item.word, a.word));
  const strict = uniqueWordObjects([...shuffle(nearLevel), ...lookAlikes.slice(0, 8), ...shuffle(samePos)]).slice(0, 3);
  if (strict.length >= 3) return strict;
  return [...strict, ...samePos.filter((candidate) => !strict.some((picked) => picked.word === candidate.word)).slice(0, 3 - strict.length)];
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
  return [...items].sort(() => Math.random() - 0.5);
}

render();



