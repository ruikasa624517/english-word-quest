const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const csvFile = path.join(root, "單字列表", "GEPT_intermediate_only_words.csv");
const outFile = path.join(root, "data", "built-in-words.json");

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
      } else if (ch === '"') {
        quoted = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (ch !== "\r") {
      field += ch;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const headers = rows.shift() || [];
  return rows
    .filter((item) => item.some((cell) => String(cell).trim()))
    .map((item) => Object.fromEntries(headers.map((header, index) => [header, item[index] || ""])));
}

function normalizeWord(text) {
  return String(text || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizePos(text) {
  const value = String(text || "").toLowerCase();
  if (value.includes("phr")) return "phrase";
  if (/verb|vt\.|vi\.|\bv\./.test(value)) return "verb";
  if (/noun|\bn\./.test(value)) return "noun";
  if (/adjective|adj\.|\ba\./.test(value)) return "adjective";
  if (/adverb|adv\.|\br\./.test(value)) return "adverb";
  return "";
}

function isKeepWord(word) {
  const base = word.replace(/[^a-z-]/g, "");
  return base && !new Set(["a", "an", "in", "at", "for"]).has(base);
}

function main() {
  const existing = JSON.parse(fs.readFileSync(outFile, "utf8"));
  const rows = parseCsv(fs.readFileSync(csvFile, "utf8"));
  const total = Math.max(1, rows.length - 1);
  const seen = new Set();
  const geptIntermediate = [];

  rows.forEach((row, index) => {
    const word = normalizeWord(row["單字或片語"]);
    if (!word || !isKeepWord(word) || seen.has(word)) return;
    const pos = normalizePos(row["詞性"]);
    if (!pos) return;
    seen.add(word);
    const level = Math.min(5, 3 + Math.floor((index / total) * 3));
    geptIntermediate.push({
      word,
      phonetic: "",
      meaning: String(row["中文釋義"] || "").trim() || word,
      level,
      goal: ["英檢中級"],
      image: "📘",
      example: "",
      exampleZh: "",
      cloze: "",
      options: [],
      pos,
      library: "built-in",
    });
  });

  const merged = existing
    .filter((item) => !Array.isArray(item.goal) || !item.goal.includes("英檢中級"))
    .concat(geptIntermediate);
  fs.writeFileSync(outFile, JSON.stringify(merged), "utf8");
  console.log(`Added ${geptIntermediate.length} GEPT intermediate words. Total: ${merged.length}`);
}

main();
