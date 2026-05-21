const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 5173);
const VERBOSE = process.env.LOOKUP_VERBOSE !== "0"; // 預設開 log，要關就 LOOKUP_VERBOSE=0 啟動
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".json": "application/json; charset=utf-8",
};

// ----------------------------------------------------------------------
// 永久檔案快取：data/lookup-cache.json
// ----------------------------------------------------------------------
const CACHE_DIR = path.join(root, "data");
const CACHE_FILE = path.join(CACHE_DIR, "lookup-cache.json");
const CACHE_SCHEMA_VERSION = "native-meaning-paired-example-v2";
let cache = loadCache();

function loadCache() {
  try {
    if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
    if (!fs.existsSync(CACHE_FILE)) return {};
    return JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8") || "{}");
  } catch {
    return {};
  }
}

let writeCacheTimer = null;
function persistCache() {
  if (writeCacheTimer) return;
  writeCacheTimer = setTimeout(() => {
    writeCacheTimer = null;
    try {
      fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf-8");
    } catch {
      // ignore
    }
  }, 300);
}

function log(...args) {
  if (VERBOSE) console.log("[lookup]", ...args);
}

// ----------------------------------------------------------------------
// 主路由
// ----------------------------------------------------------------------
const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/api/cambridge" || urlPath === "/api/lookup") {
    const url = new URL(req.url, `http://localhost:${port}`);
    const word = url.searchParams.get("word") || "";
    const force = url.searchParams.get("force") === "1";
    const lang = url.searchParams.get("lang") || "zh-Hant";
    lookupWord(word, { force, lang })
      .then((entry) => {
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(entry));
      })
      .catch((err) => {
        log("ERROR lookup", word, err?.message);
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({}));
      });
    return;
  }
  // 除錯用：返回 verbose 結果（含每個來源是否命中）
  if (urlPath === "/api/test-lookup") {
    const url = new URL(req.url, `http://localhost:${port}`);
    const word = url.searchParams.get("word") || "";
    lookupWordVerbose(word)
      .then((report) => {
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(report, null, 2));
      })
      .catch((err) => {
        res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ error: String(err?.message || err) }));
      });
    return;
  }

  const routePath = urlPath === "/" ? "index.html" : urlPath.replace(/^[/\\]+/, "");
  const safePath = path.normalize(routePath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(root, safePath);

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": types[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
  });
});

// ----------------------------------------------------------------------
// 主查詢入口
// 順序：cache → dictionaryapi.dev (主要，最可靠) → Cambridge (補中文釋義) → MyMemory (翻譯)
// ----------------------------------------------------------------------
// 把 native lang code 對應到 Cambridge URL 子目錄
function cambridgePathForLang(lang) {
  switch ((lang || "").toLowerCase()) {
    case "ja":
    case "ja-jp":
      return "english-japanese";
    case "ko":
    case "ko-kr":
      return "english-korean";
    case "es":
    case "es-es":
    case "es-mx":
      return "english-spanish";
    case "zh-hant":
    case "zh-tw":
    case "zh-hk":
    default:
      return "english-chinese-traditional";
  }
}

// MyMemory 語碼
function myMemoryPairForLang(lang) {
  switch ((lang || "").toLowerCase()) {
    case "ja":
    case "ja-jp":
      return "en|ja";
    case "ko":
    case "ko-kr":
      return "en|ko";
    case "es":
    case "es-es":
    case "es-mx":
      return "en|es";
    case "zh-hant":
    case "zh-tw":
    case "zh-hk":
    default:
      return "en|zh-TW";
  }
}

// 該語言「字典釋義應該長什麼樣子」的判斷正規式
function hasNativeChars(text, lang) {
  const s = String(text || "");
  switch ((lang || "").toLowerCase()) {
    case "ja":
    case "ja-jp":
      // 平假名 + 片假名 + 漢字
      return /[ぁ-んァ-ヿ一-鿿]/.test(s);
    case "ko":
    case "ko-kr":
      return /[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(s);
    case "es":
    case "es-es":
    case "es-mx":
      // 西班牙文 — 任何拉丁字 + 西語特殊字
      return /[A-Za-záéíóúñü¿¡]/i.test(s);
    case "zh-hant":
    case "zh-tw":
    case "zh-hk":
    default:
      return /[一-鿿]/.test(s);
  }
}

function hasTargetNativeChars(text, lang) {
  const s = String(text || "");
  switch ((lang || "").toLowerCase()) {
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

async function lookupWord(rawWord, opts = {}) {
  const word = String(rawWord).toLowerCase().replace(/[^a-z-]/g, "");
  if (!word) return {};
  const lang = opts.lang || "zh-Hant";
  // 快取 key 加入 lang 以區分不同語言的查詢結果
  const cacheKey = `${CACHE_SCHEMA_VERSION}::${word}::${lang}`;
  if (!opts.force && cache[cacheKey]) {
    log(word, "cache hit", lang);
    return cache[cacheKey];
  }

  log(word, "→ start lookup");
  const result = {
    word,
    meaning: "",
    example: "",
    exampleZh: "",
    phonetic: "",
    pos: "",
    sources: [],
  };

  // 1) dictionaryapi.dev：只補英文定義、音標、詞性；例句一律只允許 Cambridge 來源
  try {
    const dict = await fetchDictionaryApi(word);
    log(word, "dictionaryapi:", JSON.stringify(dict).slice(0, 200));
    if (dict.phonetic) result.phonetic = dict.phonetic;
    if (dict.pos) result.pos = dict.pos;
    if (dict.definition || dict.phonetic || dict.pos) result.sources.push("dictionaryapi");
  } catch (e) {
    log(word, "dictionaryapi ERROR:", e?.message);
  }

  // 2) Cambridge：嘗試補目標語言釋義 / 例句翻譯
  try {
    const cam = await fetchCambridge(word, lang);
    log(word, "cambridge:", JSON.stringify(cam).slice(0, 200));
    const camMeaning = compactNativeMeaning(cam.meaning, lang);
    if (camMeaning && hasTargetNativeChars(camMeaning, lang)) {
      result.meaning = camMeaning;
      result.sources.push(`cambridge-${lang}`);
    }
    if (cam.example) {
      result.example = cam.example;
      result.sources.push("cambridge-example");
      if (cam.exampleZh) result.exampleZh = cam.exampleZh; // 沿用欄位名，實際存「目標語言翻譯」
    }
    if (!result.phonetic && cam.phonetic) result.phonetic = cam.phonetic;
    if (!result.pos && cam.pos) result.pos = cam.pos;
  } catch (e) {
    log(word, "cambridge ERROR:", e?.message);
  }

  if (!result.meaning || !result.example) {
    try {
      const camEn = await fetchCambridgeEnglish(word);
      log(word, "cambridge-english:", JSON.stringify(camEn).slice(0, 200));
      if (!result.example && camEn.example) {
        result.example = camEn.example;
        result.sources.push("cambridge-english-example");
      }
      if (!result.meaning && camEn.meaning) {
        const wordTranslation = await translateToLang(word, lang);
        if (wordTranslation) {
          result.meaning = compactNativeMeaning(wordTranslation, lang);
          result.sources.push("mymemory-meaning");
        } else {
          const tr = await translateToLang(camEn.meaning, lang);
          if (tr) {
            result.meaning = compactNativeMeaning(tr, lang);
            result.sources.push("mymemory-meaning");
          }
        }
      }
    } catch (e) {
      log(word, "cambridge-english ERROR:", e?.message);
    }
  }

  // 3) 若 meaning 仍非目標語言，走 MyMemory 翻成目標語言
  if (!result.example) {
    try {
      const yahoo = await fetchYahooDictionary(word);
      log(word, "yahoo:", JSON.stringify(yahoo).slice(0, 200));
      if (yahoo.example) {
        result.example = yahoo.example;
        result.sources.push("yahoo-example");
      }
      if (!result.exampleZh && yahoo.exampleZh) result.exampleZh = yahoo.exampleZh;
    } catch (e) {
      log(word, "yahoo ERROR:", e?.message);
    }
  }

  if (!result.example) {
    try {
      const dict = await fetchDictionaryApi(word);
      if (dict.example) {
        result.example = dict.example;
        result.sources.push("dictionaryapi-example");
      }
    } catch (e) {
      log(word, "dictionaryapi example ERROR:", e?.message);
    }
  }

  // 4) 例句翻譯
  if (result.example && !result.exampleZh) {
    try {
      const tr = await translateToLang(result.example, lang);
      log(word, "mymemory example:", (tr || "(empty)").slice(0, 80));
      if (tr) {
        result.exampleZh = tr;
        if (!result.sources.includes("mymemory-meaning")) result.sources.push("mymemory-example");
      }
    } catch (e) {
      log(word, "mymemory example ERROR:", e?.message);
    }
  }

  result.fetchedAt = new Date().toISOString();
  cache[cacheKey] = result;
  persistCache();
  log(word, "DONE sources=", result.sources.join(",") || "(none)", lang);
  return result;
}

// ----------------------------------------------------------------------
// 除錯端點：每一步的原始回應一併回傳
// ----------------------------------------------------------------------
async function lookupWordVerbose(rawWord) {
  const word = String(rawWord).toLowerCase().replace(/[^a-z-]/g, "");
  if (!word) return { error: "empty word" };
  const report = { word, steps: [] };

  const camUrl = `https://dictionary.cambridge.org/dictionary/english-chinese-traditional/${encodeURIComponent(word)}`;
  const camRaw = await httpsGetTextWithStatus(camUrl, browserHeaders("en-US,zh-TW;q=0.9"));
  report.steps.push({
    source: "cambridge",
    url: camUrl,
    status: camRaw.status,
    bytes: camRaw.body.length,
    sample: camRaw.body.slice(0, 500),
    parsed: parseCambridge(camRaw.body, word),
  });

  const dictUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
  const dictRaw = await httpsGetTextWithStatus(dictUrl, browserHeaders("en-US"));
  let dictParsed = {};
  try {
    const data = JSON.parse(dictRaw.body || "[]");
    if (Array.isArray(data) && data.length) {
      const entry = data[0];
      const phoneticItem = (entry.phonetics || []).find((p) => p && p.text);
      const meaningBlock = (entry.meanings || [])[0];
      const definitionItem = meaningBlock?.definitions?.find((d) => d && d.definition);
      dictParsed = {
        pos: meaningBlock?.partOfSpeech || "",
        definition: definitionItem?.definition || "",
        example: definitionItem?.example || "",
        phonetic: phoneticItem?.text || entry.phonetic || "",
      };
    }
  } catch (e) {
    dictParsed = { parseError: String(e?.message) };
  }
  report.steps.push({
    source: "dictionaryapi",
    url: dictUrl,
    status: dictRaw.status,
    bytes: dictRaw.body.length,
    sample: dictRaw.body.slice(0, 500),
    parsed: dictParsed,
  });

  const yahooUrl = `https://tw.dictionary.search.yahoo.com/search?p=${encodeURIComponent(word)}`;
  const yahooRaw = await httpsGetTextWithStatus(yahooUrl, browserHeaders("zh-TW,zh;q=0.9,en;q=0.8"));
  report.steps.push({
    source: "yahoo",
    url: yahooUrl,
    status: yahooRaw.status,
    bytes: yahooRaw.body.length,
    sample: yahooRaw.body.slice(0, 500),
    parsed: parseYahooDictionary(yahooRaw.body, word),
  });

  const myUrl = `https://api.mymemory.translated.net/get?q=test&langpair=en|zh-TW`;
  const myRaw = await httpsGetTextWithStatus(myUrl, { "User-Agent": "VocabArcanaLocalPrototype/1.0" });
  report.steps.push({
    source: "mymemory",
    url: myUrl,
    status: myRaw.status,
    bytes: myRaw.body.length,
    sample: myRaw.body.slice(0, 300),
  });

  return report;
}

// ----------------------------------------------------------------------
// Cambridge HTML 抓取 + parse
// ----------------------------------------------------------------------
function fetchCambridge(word, lang = "zh-Hant") {
  const path = cambridgePathForLang(lang);
  const acceptLang =
    lang === "ja" ? "ja,en;q=0.8" :
    lang === "ko" ? "ko,en;q=0.8" :
    lang === "es" ? "es,en;q=0.8" :
    "zh-TW,zh;q=0.9,en;q=0.8";
  const url = `https://dictionary.cambridge.org/dictionary/${path}/${encodeURIComponent(word)}`;
  return httpsGetText(url, browserHeaders(acceptLang)).then((html) =>
    parseCambridge(html, word),
  );
}

function fetchCambridgeEnglish(word) {
  const url = `https://dictionary.cambridge.org/dictionary/english/${encodeURIComponent(word)}`;
  return httpsGetText(url, browserHeaders("en-US,en;q=0.9")).then((html) =>
    parseCambridge(html, word),
  );
}

function parseCambridge(html, word) {
  if (!html) return {};
  const pickFirst = (...patterns) => {
    for (const pat of patterns) {
      const m = html.match(pat);
      if (m) {
        const cleaned = cleanHtml(m[1]);
        if (cleaned) return cleaned;
      }
    }
    return "";
  };

  const pos = pickFirst(
    /<span[^>]*class="[^"]*\bpos\s+dpos\b[^"]*"[^>]*>([\s\S]*?)<\/span>/,
    /<span[^>]*class="[^"]*\bdpos\b[^"]*"[^>]*>([\s\S]*?)<\/span>/,
  );

  const meaning = pickFirst(
    /<span[^>]*class="[^"]*\btrans\s+dtrans[^"]*"[^>]*>([\s\S]*?)<\/span>/,
    /<span[^>]*class="[^"]*\bdtrans-se\b[^"]*"[^>]*>([\s\S]*?)<\/span>/,
    /<span[^>]*class="[^"]*\bdtrans\b[^"]*"[^>]*>([\s\S]*?)<\/span>/,
  );

  const definition = pickFirst(
    /<div[^>]*class="[^"]*\bdef\s+ddef_d\s+db\b[^"]*"[^>]*>([\s\S]*?)<\/div>/,
    /<div[^>]*class="[^"]*\bddef_d\b[^"]*"[^>]*>([\s\S]*?)<\/div>/,
  );

  // 把「英文例句 + 緊鄰的翻譯」當成一組抓，確保配對正確
  const pair = pickBestCambridgeExamplePair(html, word);

  const phonetic = pickFirst(
    /<span[^>]*class="[^"]*\bipa\s+dipa\s+lpr-2[^"]*"[^>]*>([\s\S]*?)<\/span>/,
    /<span[^>]*class="[^"]*\bipa\s+dipa\b[^"]*"[^>]*>([\s\S]*?)<\/span>/,
  );

  return {
    word,
    pos,
    meaning: meaning || definition || "",
    example: pair.example,
    exampleZh: pair.exampleZh, // 與 example 同組，直接來自 Cambridge
    phonetic: phonetic ? `/${phonetic}/` : "",
  };
}

// 從 Cambridge 頁面抓「例句 + 其緊鄰翻譯」配對；優先回傳「有附翻譯」的最佳組
function pickBestCambridgeExamplePair(html, word) {
  const wordLower = String(word || "").toLowerCase();
  // 一次抓 eg 例句 + 後面可能緊鄰的 trans 翻譯（同一個 example block 內）
  const blockRe = /<span[^>]*class="[^"]*\beg\s+deg\b[^"]*"[^>]*>([\s\S]*?)<\/span>\s*(?:<span[^>]*class="[^"]*\btrans[^"]*"[^>]*>([\s\S]*?)<\/span>)?/g;
  const candidates = [];
  for (const match of html.matchAll(blockRe)) {
    const rawEng = cleanHtml(match[1]);
    const trans = cleanHtml(match[2] || "");
    for (const eng of englishSentenceCandidates(rawEng, word)) {
      const wordCount = eng.split(/\s+/).filter(Boolean).length;
      let score = 0;
      if (trans) score += 500; // 有附翻譯的優先
      if (wordLower && eng.toLowerCase().includes(wordLower)) score += 200;
      if (wordCount >= 6 && wordCount <= 18) score += 50;
      score += Math.min(wordCount, 25);
      // 只有當整句被取出（englishSentenceCandidates 可能切句）時，trans 才一定對得上整段；
      // 若英文被切成多句，翻譯可能對應整段，僅在「未被切句」時採用 trans
      const splitOccurred = rawEng.trim() !== eng;
      candidates.push({ example: eng, exampleZh: splitOccurred ? "" : trans, score });
    }
  }
  candidates.sort((a, b) => b.score - a.score);
  const best = candidates[0];
  return { example: best?.example || "", exampleZh: best?.exampleZh || "" };
}

function englishSentenceCandidates(text, word) {
  const source = String(text || "").trim();
  const pieces = source.match(/[^.!?]+[.!?]["']?/g) || [source];
  const wordLower = String(word || "").toLowerCase();
  return pieces
    .map((piece) => piece.trim())
    .filter((piece) => isCompleteSentence(piece))
    .filter((piece) => !wordLower || piece.toLowerCase().includes(wordLower));
}

function compactNativeMeaning(raw, lang = "zh-Hant") {
  const text = String(raw || "").trim();
  if (!text) return "";
  const parts = text.split(/[;；,，、/]+|\s+(?:or|and)\s+/i)
    .map((part) => cleanMeaningPart(part, lang))
    .filter(Boolean);
  const picked = [];
  for (const part of parts) {
    if (picked.some((prev) => meaningTooClose(prev, part))) continue;
    picked.push(part);
    if (picked.length >= 2) break;
  }
  return picked.join(nativeMeaningSeparator(lang));
}

function cleanMeaningPart(part, lang = "zh-Hant") {
  let s = String(part || "")
    .replace(/^\s*\([^)]*\)\s*/, "")
    .replace(/^[（(]\s*/, "")
    .replace(/[）)]\s*$/, "")
    .replace(/^(to|a|an|the)\s+/i, "")
    .replace(/\b(?:v|n|adj|adv|prep|conj|pron|interj|aux)\.?\b/gi, "")
    .trim();
  if (!s) return "";
  if (isChineseLang(lang) || isJapaneseLang(lang) || isKoreanLang(lang)) {
    s = s.replace(/[A-Za-z][A-Za-z'\-\s]*/g, " ");
  }
  s = s.replace(/\s+/g, isSpanishLang(lang) ? " " : "").trim();
  return hasTargetNativeChars(s, lang) ? s : "";
}

function nativeMeaningSeparator(lang) {
  return isSpanishLang(lang) ? ", " : "、";
}
function isChineseLang(lang) {
  return ["zh-hant", "zh-tw", "zh-hk"].includes(String(lang || "").toLowerCase());
}

function isJapaneseLang(lang) {
  return ["ja", "ja-jp"].includes(String(lang || "").toLowerCase());
}

function isKoreanLang(lang) {
  return ["ko", "ko-kr"].includes(String(lang || "").toLowerCase());
}

function isSpanishLang(lang) {
  return ["es", "es-es", "es-mx"].includes(String(lang || "").toLowerCase());
}

function meaningTooClose(a, b) {
  const sa = new Set(String(a || "").toLowerCase().replace(/\s+/g, ""));
  const sb = new Set(String(b || "").toLowerCase().replace(/\s+/g, ""));
  if (!sa.size || !sb.size) return false;
  let common = 0;
  sa.forEach((ch) => {
    if (sb.has(ch)) common += 1;
  });
  return common / Math.min(sa.size, sb.size) >= 0.6;
}

function fetchYahooDictionary(word) {
  const url = `https://tw.dictionary.search.yahoo.com/search?p=${encodeURIComponent(word)}`;
  return httpsGetText(url, browserHeaders("zh-TW,zh;q=0.9,en;q=0.8")).then((html) =>
    parseYahooDictionary(html, word),
  );
}

function parseYahooDictionary(html, word) {
  if (!html) return {};
  const matches = Array.from(
    html.matchAll(/<span[^>]*class="[^"]*\bd-b\s+fz-14\s+fc-2nd\s+lh-20\b[^"]*"[^>]*>([\s\S]*?)<\/span>/g),
  );
  const candidates = matches
    .map((match) => yahooExampleParts(match[1], word))
    .filter((item) => item.example);
  if (!candidates.length) return {};
  candidates.sort((a, b) => b.score - a.score);
  return {
    word,
    example: candidates[0].example,
    exampleZh: candidates[0].exampleZh,
  };
}

function yahooExampleParts(rawHtml, word) {
  const cleaned = cleanHtml(rawHtml);
  if (!cleaned) return { example: "", exampleZh: "", score: 0 };
  const split = splitEnglishAndChinese(cleaned);
  const example = normalizeYahooExample(split.example);
  if (!example || !looksLikeUsefulExample(example, word)) return { example: "", exampleZh: "", score: 0 };
  const wordLower = String(word || "").toLowerCase();
  const wordCount = example.split(/\s+/).filter(Boolean).length;
  let score = 0;
  if (example.toLowerCase().includes(wordLower)) score += 200;
  if (isCompleteSentence(example)) score += 100;
  if (wordCount >= 4 && wordCount <= 14) score += 40;
  score += Math.min(wordCount, 20);
  return {
    example,
    exampleZh: split.exampleZh,
    score,
  };
}

function splitEnglishAndChinese(text) {
  const match = String(text || "").match(/[\u3400-\u9fff]/);
  if (!match) return { example: text.trim(), exampleZh: "" };
  const idx = match.index;
  return {
    example: text.slice(0, idx).trim(),
    exampleZh: text.slice(idx).trim(),
  };
}

function normalizeYahooExample(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .replace(/\s+([.!?,])/g, "$1")
    .trim();
}

function looksLikeUsefulExample(text, word) {
  const s = String(text || "").trim();
  if (!s || /[{}[\]<>]/.test(s)) return false;
  if (!/[A-Za-z]/.test(s)) return false;
  if (!isCompleteSentence(s)) return false;
  if (s.length < 6 || s.length > 180) return false;
  const wordLower = String(word || "").toLowerCase();
  if (wordLower && !s.toLowerCase().includes(wordLower)) return false;
  return true;
}

// ----------------------------------------------------------------------
// dictionaryapi.dev — 主要英文來源
// ----------------------------------------------------------------------
function fetchDictionaryApi(word) {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
  return httpsGetText(url, {
    "User-Agent": "VocabArcanaLocalPrototype/1.0",
    Accept: "application/json",
  }).then((text) => {
    if (!text) return {};
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return {};
    }
    if (!Array.isArray(data) || !data.length) return {};
    // 收集所有 entries 的 phonetic / meanings，找最好的 example 與 definition
    const allMeanings = [];
    const allPhonetics = [];
    for (const entry of data) {
      (entry.phonetics || []).forEach((p) => {
        if (p && p.text) allPhonetics.push(p.text);
      });
      if (entry.phonetic) allPhonetics.push(entry.phonetic);
      (entry.meanings || []).forEach((m) => allMeanings.push(m));
    }
    const phonetic = allPhonetics[0] || "";
    const meaningBlock = allMeanings[0];
    const definitionItem = meaningBlock?.definitions?.find((d) => d && d.definition);
    const example = pickBestExample(allMeanings, word);
    return {
      pos: meaningBlock?.partOfSpeech || "",
      definition: definitionItem?.definition || "",
      example,
      phonetic,
    };
  });
}

// 從所有定義中挑出「完整句子」的例句
// 嚴格規則：必須大寫開頭 + 結尾標點 + ≥5 字 + 不含斜線
// 若沒任何候選符合，回傳空字串（讓前端用模板兜底）
function pickBestExample(meanings, word) {
  const candidates = [];
  const wordLower = String(word).toLowerCase();
  for (const meaning of meanings || []) {
    for (const def of meaning.definitions || []) {
      if (def.example && typeof def.example === "string") {
        candidates.push(def.example.trim());
      }
    }
  }
  if (!candidates.length) return "";
  // 第一輪：嚴格篩出完整句子
  const sentences = candidates.filter((text) => {
    if (!text) return false;
    if (text.includes("/")) return false; // 片語列舉
    if (text.includes(";")) return false; // 多片語分隔
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    if (wordCount < 5) return false;
    if (!/^[A-Z"'(]/.test(text)) return false; // 大寫或引號開頭
    if (!/[.!?]["']?\s*$/.test(text)) return false; // 標點結尾
    return true;
  });
  if (!sentences.length) return ""; // 沒有合格句子 → 讓前端用模板
  // 第二輪：在合格句子中挑最好的
  const scored = sentences.map((text) => {
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const containsWord = text.toLowerCase().includes(wordLower);
    let score = 0;
    if (containsWord) score += 200;
    if (wordCount >= 7 && wordCount <= 18) score += 50; // 偏好中等長度
    score += Math.min(wordCount, 20);
    return { text, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0].text;
}

// ----------------------------------------------------------------------
// MyMemory 翻譯 API（en → zh-TW）
// ----------------------------------------------------------------------
function translateToLang(text, lang = "zh-Hant") {
  const trimmed = String(text || "").trim();
  if (!trimmed) return Promise.resolve("");
  const pair = myMemoryPairForLang(lang);
  const key = `__tr__::${lang}::${trimmed.slice(0, 240)}`;
  if (cache[key]?.translated) return Promise.resolve(cache[key].translated);
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed.slice(0, 240))}&langpair=${pair}`;
  return httpsGetText(url, { "User-Agent": "VocabArcanaLocalPrototype/1.0" }).then((body) => {
    if (!body) return "";
    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch {
      return "";
    }
    const translated = String(parsed?.responseData?.translatedText || "").trim();
    if (translated && hasTargetNativeChars(translated, lang)) {
      cache[key] = { translated, fetchedAt: new Date().toISOString() };
      persistCache();
      return translated;
    }
    return "";
  });
}

// 相容舊呼叫
function translateToZhTw(text) { return translateToLang(text, "zh-Hant"); }

// ----------------------------------------------------------------------
// helpers
// ----------------------------------------------------------------------
function browserHeaders(acceptLang = "en-US") {
  return {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": acceptLang,
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Encoding": "identity", // 避免拿到 gzip 後不會解
  };
}

function httpsGetText(url, headers, redirectsLeft = 3) {
  return httpsGetTextWithStatus(url, headers, redirectsLeft).then((r) => r.body);
}

function httpsGetTextWithStatus(url, headers, redirectsLeft = 3) {
  return new Promise((resolve) => {
    const req = https.get(url, { headers }, (response) => {
      const status = response.statusCode || 0;
      if (
        [301, 302, 303, 307, 308].includes(status) &&
        response.headers.location &&
        redirectsLeft > 0
      ) {
        const next = new URL(response.headers.location, url).toString();
        response.resume();
        httpsGetTextWithStatus(next, headers, redirectsLeft - 1).then(resolve);
        return;
      }
      let body = "";
      response.setEncoding("utf-8");
      response.on("data", (chunk) => (body += chunk));
      response.on("end", () => resolve({ status, body }));
    });
    req.setTimeout(15000, () => {
      req.destroy();
      resolve({ status: 0, body: "" });
    });
    req.on("error", (err) => {
      log("https error:", url, err?.message);
      resolve({ status: 0, body: "" });
    });
  });
}

function cleanHtml(value) {
  return String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+([.!?,;:])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function hasChinese(text) {
  return /[一-鿿]/.test(String(text || ""));
}

// 判斷一段文字是否為完整句子（給 Cambridge 解析後過濾用）
function isCompleteSentence(text) {
  if (!text) return false;
  const s = String(text).trim();
  if (s.includes("/") || s.includes(";")) return false;
  const wc = s.split(/\s+/).filter(Boolean).length;
  if (wc < 5) return false;
  if (!/^[A-Z"'(]/.test(s)) return false;
  if (!/[.!?]["']?\s*$/.test(s)) return false;
  return true;
}

server.listen(port, () => {
  console.log(`Vocab Arcana running at http://localhost:${port}`);
  console.log(`Lookup cache: ${CACHE_FILE} (${Object.keys(cache).length} entries)`);
  console.log(`Debug endpoint: http://localhost:${port}/api/test-lookup?word=abandon`);
  console.log(`Set LOOKUP_VERBOSE=0 to silence per-word logs`);
});

