import csv
import base64
import html
import json
import re
import ssl
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
WORDLIST_DIR = ROOT / "\u55ae\u5b57\u5217\u8868"
SOURCE_URL = "https://www.lttc.ntu.edu.tw/en/vocabulary"
BASE_URL = "https://www.lttc.ntu.edu.tw"


def fetch_text(url):
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (compatible; word-list-builder/1.0)",
        },
    )
    context = ssl._create_unverified_context()
    with urllib.request.urlopen(req, timeout=30, context=context) as resp:
        return resp.read().decode("utf-8", errors="replace")


def clean_text(raw):
    text = re.sub(r"<[^>]+>", " ", raw)
    text = html.unescape(text)
    return re.sub(r"\s+", " ", text).strip()


def extract_intermediate_links(index_html):
    marker = '<p class="title">Intermediate</p>'
    section = index_html.split(marker, 1)[1].split('<p class="title">High-Intermediate</p>', 1)[0]
    links = []
    seen = set()
    for href in re.findall(r'href="([^"]*/en/vocabulary_detail/[^"]+)"', section):
        url = href if href.startswith("http") else f"{BASE_URL}{href}"
        if url not in seen:
            seen.add(url)
            links.append(url)
    return links


def extract_tag_content(block, tag_name):
    for row in re.findall(r'<div class="collapse-body__row">(.*?)</div>\s*</div>', block, re.S):
        tag = clean_text(" ".join(re.findall(r'<div class="tag">(.*?)</div>', row, re.S)))
        if tag == tag_name:
            return clean_text(" ".join(re.findall(r'<p class="content">(.*?)</p>', row, re.S)))
    return ""


def parse_page(page_html, source_url):
    rows = []
    blocks = page_html.split('<div class="list-row">')[1:]
    for block in blocks:
        pc = block.split("<!-- 手機版 -->", 1)[0]
        level_match = re.search(r'<div class="level [^"]* cn">(.*?)</div>', pc, re.S)
        word_match = re.search(r'data-vocabulary="([^"]+)"', pc)
        values = [
            clean_text(item)
            for item in re.findall(r'<p class="list-row__text"[^>]*>(.*?)</p>', pc, re.S)
        ]
        if not level_match or not word_match or len(values) < 3:
            continue
        word = html.unescape(word_match.group(1)).strip()
        pos = values[1]
        meaning = values[2]
        if not word or not pos or not meaning:
            continue
        note = extract_tag_content(block, "Note")
        awl = extract_tag_content(block, "AWL Sublist")
        rows.append(
            {
                "\u5206\u985e": "\u82f1\u6aa2\u4e2d\u7d1a GEPT Intermediate",
                "\u5b57\u6bcd": word[0].upper() if word else "",
                "\u7d1a\u6578": clean_text(level_match.group(1)),
                "\u7d1a\u6578\u4ee3\u78bc": "I" if clean_text(level_match.group(1)) == "\u4e2d\u7d1a" else "E",
                "\u55ae\u5b57\u6216\u7247\u8a9e": word,
                "\u8a5e\u6027": pos,
                "\u4e2d\u6587\u91cb\u7fa9": meaning,
                "\u8a3b\u89e3": note,
                "\u5b78\u8853\u5b57\u5f59": awl,
                "\u4f86\u6e90": source_url,
            }
        )
    return rows


def extract_last_page(page_html):
    match = re.search(r'<div class="next-arrow last[^"]* active" data-page="([^"]+)"', page_html)
    if not match:
        return 1
    payload = base64.b64decode(match.group(1)).decode("utf-8")
    return int(json.loads(payload).get("page", 1))


def page_filter(page_number):
    payload = json.dumps({"page": page_number}, separators=(",", ":")).encode("utf-8")
    return base64.b64encode(payload).decode("ascii")


def write_csv(path, rows):
    headers = [
        "\u5e8f\u865f",
        "\u5206\u985e",
        "\u5b57\u6bcd",
        "\u7d1a\u6578",
        "\u7d1a\u6578\u4ee3\u78bc",
        "\u55ae\u5b57\u6216\u7247\u8a9e",
        "\u8a5e\u6027",
        "\u4e2d\u6587\u91cb\u7fa9",
        "\u8a3b\u89e3",
        "\u5b78\u8853\u5b57\u5f59",
        "\u4f86\u6e90",
    ]
    with path.open("w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=headers, quoting=csv.QUOTE_ALL)
        writer.writeheader()
        for index, row in enumerate(rows, 1):
            writer.writerow({"\u5e8f\u865f": index, **row})


def main():
    WORDLIST_DIR.mkdir(exist_ok=True)
    index_html = fetch_text(SOURCE_URL)
    links = extract_intermediate_links(index_html)
    if len(links) != 26:
        raise RuntimeError(f"Expected 26 intermediate letter pages, found {len(links)}")

    all_rows = []
    for url in links:
        first_page = fetch_text(url)
        last_page = extract_last_page(first_page)
        all_rows.extend(parse_page(first_page, url))
        for page_number in range(2, last_page + 1):
            page_url = f"{url}?filter={page_filter(page_number)}"
            all_rows.extend(parse_page(fetch_text(page_url), url))

    unique_rows = []
    seen = set()
    for row in all_rows:
        key = (row["\u7d1a\u6578"], row["\u55ae\u5b57\u6216\u7247\u8a9e"], row["\u8a5e\u6027"], row["\u4e2d\u6587\u91cb\u7fa9"])
        if key in seen:
            continue
        seen.add(key)
        unique_rows.append(row)

    full_path = WORDLIST_DIR / "GEPT_intermediate_words.csv"
    only_path = WORDLIST_DIR / "GEPT_intermediate_only_words.csv"
    write_csv(full_path, unique_rows)
    write_csv(only_path, [row for row in unique_rows if row["\u7d1a\u6578"] == "\u4e2d\u7d1a"])
    print(f"{full_path}: {len(unique_rows)} rows")
    print(f"{only_path}: {sum(1 for row in unique_rows if row['\u7d1a\u6578'] == '\u4e2d\u7d1a')} rows")


if __name__ == "__main__":
    main()
