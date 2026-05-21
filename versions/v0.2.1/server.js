const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 5173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
};

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/api/cambridge") {
    const url = new URL(req.url, `http://localhost:${port}`);
    lookupCambridge(url.searchParams.get("word") || "")
      .then((entry) => {
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(entry));
      })
      .catch(() => {
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({}));
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

function lookupCambridge(word) {
  const safeWord = String(word).toLowerCase().replace(/[^a-z-]/g, "");
  if (!safeWord) return Promise.resolve({});
  const url = `https://dictionary.cambridge.org/dictionary/english-chinese-traditional/${encodeURIComponent(safeWord)}`;
  return new Promise((resolve) => {
    https
      .get(
        url,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 VocabArcanaLocalPrototype/1.0",
          },
        },
        (response) => {
          let html = "";
          response.on("data", (chunk) => {
            html += chunk;
          });
          response.on("end", () => {
            resolve(parseCambridge(html, safeWord));
          });
        },
      )
      .on("error", () => resolve({}));
  });
}

function parseCambridge(html, word) {
  const clean = (value) =>
    String(value || "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();
  const pos = clean(html.match(/<span class="pos dpos"[^>]*>(.*?)<\/span>/s)?.[1]);
  const meaning =
    clean(html.match(/<span class="trans dtrans[^"]*"[^>]*>(.*?)<\/span>/s)?.[1]) ||
    clean(html.match(/<div class="def ddef_d db"[^>]*>(.*?)<\/div>/s)?.[1]);
  const example = clean(html.match(/<span class="eg deg"[^>]*>(.*?)<\/span>/s)?.[1]);
  return {
    word,
    meaning: meaning || word,
    example: example || `I want to remember ${word}.`,
    pos: pos || "word",
  };
}

server.listen(port, () => {
  console.log(`Vocab Arcana running at http://localhost:${port}`);
});
