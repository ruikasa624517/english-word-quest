// Vocab Arcana Service Worker
// 策略：
//   - 頁面、JS、CSS、JSON（會改版的程式與資料）：network-first，連得上就拿最新版，離線才用快取。
//     （v2 以前是 cache-first，改版推上去後使用者要重整好幾次、甚至卡在舊版。）
//   - 圖片、字型（幾乎不變、檔案較大）：cache-first，沒有才抓網路。
//   - /api/*：network-first，離線時回退快取（字典查詢結果可離線重看）。
//   - 預快取一律用 cache: "reload"，避免把瀏覽器 HTTP 快取裡的舊檔存進來。
const CACHE_VERSION = "vocab-arcana-v4";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./assets/app-icon.svg",
  "./assets/app-icon-maskable.svg",
  "./assets/fonts/atkinson-hyperlegible-latin-400-normal.woff2",
  "./assets/fonts/atkinson-hyperlegible-latin-700-normal.woff2",
  "./assets/fonts/doto-latin-800-normal.woff2",
  "./data/built-in-words.json",
  "./data/word-details.json",
];

const LONG_LIVED = /\.(?:png|jpe?g|webp|gif|svg|ico|woff2?)$/i;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      // 個別 add：單一資源失敗（如 built-in-words.json 不存在）不擋整體安裝
      .then((cache) => Promise.allSettled(APP_SHELL.map((url) => cache.add(new Request(url, { cache: "reload" })))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => !key.startsWith(CACHE_VERSION)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

function putInCache(request, response) {
  if (!response || !response.ok) return response;
  const clone = response.clone();
  caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone));
  return response;
}

function networkFirst(request) {
  return fetch(request, { cache: "no-cache" })
    .then((response) => putInCache(request, response))
    .catch(() => caches.match(request, { ignoreSearch: request.mode === "navigate" }));
}

function cacheFirst(request) {
  return caches.match(request).then((cached) => cached || fetch(request).then((response) => putInCache(request, response)));
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // 跨網域（Google 登入等）不攔，交給瀏覽器
  if (url.origin !== self.location.origin) return;

  if (LONG_LIVED.test(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }
  event.respondWith(networkFirst(request));
});
