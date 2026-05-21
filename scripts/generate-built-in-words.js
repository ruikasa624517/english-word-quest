const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const sources = [
  {
    file: path.join(root, "單字列表", "daily_life_english_vocabulary.csv"),
    goal: "生活英文",
    categoryIcon: "🏠",
    level: () => 1,
    wordField: "單字或片語",
    meaningField: "中文意思",
    phoneticField: "IPA音標",
    exampleField: "例句",
    posField: "詞性",
  },
  {
    file: path.join(root, "單字列表", "GEPT_elementary_words.csv"),
    goal: "英檢初級",
    categoryIcon: "📘",
    level: (rowIndex, total) => bucketLevel(rowIndex, total, 1, 3),
    wordField: "單字",
    meaningField: "中文解釋",
    phoneticField: "音標",
    exampleField: "",
    posField: "詞性",
  },
  {
    file: path.join(root, "單字列表", "BCT_CAP_english_2000_words.csv"),
    goal: "會考",
    categoryIcon: "📝",
    level: (rowIndex, total) => bucketLevel(rowIndex, total, 2, 4),
    wordField: "單字或片語",
    meaningField: "中文釋義",
    phoneticField: "",
    exampleField: "",
    posField: "詞性",
  },
  {
    file: path.join(root, "單字列表", "GSAT_high_school_english_vocabulary.csv"),
    goal: "學測",
    categoryIcon: "🎓",
    level: (rowIndex, total, row) => scaleGsatLevel(row["級別"], rowIndex, total),
    wordField: "單字或片語",
    meaningField: "中文釋義",
    phoneticField: "",
    exampleField: "",
    posField: "詞性",
  },
  {
    file: path.join(root, "單字列表", "TOEIC_essential_3000_vocabulary_clean.csv"),
    goal: "多益",
    categoryIcon: "💼",
    level: (rowIndex, total) => bucketLevel(rowIndex, total, 3, 5),
    wordField: "單字或片語",
    meaningField: "中文釋義",
    phoneticField: "",
    exampleField: "",
    posField: "詞性",
  },
  {
    file: path.join(root, "單字列表", "TOEFL_vocabulary_1000.csv"),
    goal: "托福",
    categoryIcon: "🧪",
    level: (rowIndex, total) => bucketLevel(rowIndex, total, 4, 5),
    wordField: "單字或片語",
    meaningField: "中文含義",
    phoneticField: "",
    exampleField: "",
    posField: "詞性",
  },
];

const stopWords = new Set(["a", "an", "in", "at", "for"]);

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];
    if (quoted) {
      if (ch === '"' && next === '"') {
        field += '"';
        i += 1;
        continue;
      }
      if (ch === '"') {
        quoted = false;
        continue;
      }
      field += ch;
      continue;
    }
    if (ch === '"') {
      quoted = true;
      continue;
    }
    if (ch === ",") {
      row.push(field);
      field = "";
      continue;
    }
    if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }
    if (ch !== "\r") field += ch;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  const headers = (rows.shift() || []).map((item) => item.trim().replace(/^"|"$/g, ""));
  return rows
    .filter((rowItem) => rowItem.some((cell) => String(cell).trim()))
    .map((rowItem) => Object.fromEntries(headers.map((header, index) => [header, rowItem[index] ?? ""])));
}

function normalizeWord(text) {
  return String(text || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function normalizePos(raw) {
  const value = String(raw || "").toLowerCase();
  if (value.includes("片語")) return "phrase";
  if (value.includes("verb") || value.includes("動詞") || /\bvt\.|\bvi\.|\bv\./.test(value)) return "verb";
  if (value.includes("noun") || value.includes("名詞") || /\bn\./.test(value)) return "noun";
  if (value.includes("adjective") || value.includes("形容詞") || /\badj\.|\ba\./.test(value)) return "adjective";
  if (value.includes("adverb") || value.includes("副詞") || /\badv\.|\br\./.test(value)) return "adverb";
  return null;
}

function bucketLevel(rowIndex, total, min, max) {
  if (total <= 1) return min;
  const span = Math.max(0, max - min);
  return Math.max(min, Math.min(max, min + Math.floor((rowIndex / Math.max(1, total - 1)) * span)));
}

function scaleGsatLevel(raw, rowIndex, total) {
  const text = String(raw || "").trim();
  const numerals = {
    "一": 1,
    "二": 2,
    "三": 3,
    "四": 4,
    "五": 5,
    "六": 6,
    "七": 7,
    "八": 8,
    "九": 9,
    "十": 10,
  };
  let base = 7;
  const match = text.match(/第\s*([一二三四五六七八九十]+|\d+)\s*級/);
  if (match) {
    if (/^\d+$/.test(match[1])) base = Number(match[1]);
    else base = numerals[match[1][0]] || 7;
  } else if (/附錄/.test(text)) {
    base = 7;
  }
  const mapped = Math.min(5, Math.max(1, Math.ceil((base / 7) * 5)));
  if (Number.isNaN(mapped)) return bucketLevel(rowIndex, total, 1, 5);
  return mapped;
}

function isKeepWord(word) {
  const base = word.replace(/[^a-z-]/g, "");
  return base && !stopWords.has(base);
}

function escapeRegExp(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function readSource(def) {
  const rows = parseCsv(fs.readFileSync(def.file, "utf8"));
  const total = rows.length;
  const seen = new Set();
  return rows
    .map((row, index) => {
      const rawWord = normalizeWord(row[def.wordField] || row["單字"] || row["單字或片語"] || "");
      const word = rawWord;
      if (!word || !isKeepWord(word)) return null;
      if (seen.has(word)) return null;
      seen.add(word);
      const pos = normalizePos(row[def.posField] || row["詞性"] || row["詞性縮寫"] || "");
      if (!pos) return null;
      const example = def.exampleField ? String(row[def.exampleField] || "").trim() : "";
      const meaning = String(row[def.meaningField] || row["中文解釋"] || row["中文釋義"] || row["中文含義"] || row["中文意思"] || "").trim();
      const phonetic = def.phoneticField ? String(row[def.phoneticField] || "").trim() : "";
      const level = typeof def.level === "function" ? def.level(index, total, row) : def.level;
      const cloze = example && example.toLowerCase().includes(word.toLowerCase())
        ? example.replace(new RegExp(escapeRegExp(word), "i"), "____")
        : "";
      return {
        word,
        phonetic,
        meaning: meaning || word,
        level: Math.max(1, Math.min(5, level || 1)),
        goal: [def.goal],
        image: def.categoryIcon,
        example,
        exampleZh: "",
        cloze,
        options: [],
        pos,
        library: "built-in",
      };
    })
    .filter(Boolean);
}

function main() {
  const words = sources.flatMap((def) => readSource(def));
  const outFile = path.join(root, "data", "built-in-words.json");
  fs.writeFileSync(outFile, JSON.stringify(words), "utf8");
  console.log(`Wrote ${words.length} built-in words to ${outFile}`);
}

main();
