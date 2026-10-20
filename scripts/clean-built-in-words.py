"""整理 data/built-in-words.json 的資料錯誤（2026-10-18）
1. 托福詞表是從簡體 PDF 轉出來的：轉成繁體，去掉 PDF 抽字造成的重複字（例如「管理理」「敏敏銳」）與部首殘字（⻝、⻛）。
   同一個字在其他詞表有乾淨釋義時，直接用那份。
2. 多益詞表有 PDF 斷字（kidna、mortgag…），改回正確拼字；同一格擠了好幾個詞性的釋義（「抽象的 n 摘要」）只留第一段。
需要：pip install opencc-python-reimplemented
用法：python scripts/clean-built-in-words.py
"""
import json, re, collections, pathlib
import opencc

PATH = pathlib.Path(__file__).resolve().parent.parent / "data" / "built-in-words.json"
S2T = opencc.OpenCC("s2tw")

TOEIC_FIX = {
    "bas": "base", "benignl": "benign", "bruta": "brutal", "cabine": "cabinet", "efficiencyn": "efficiency",
    "entirel": "entirely", "fitnes": "fitness", "kidna": "kidnap", "lamentl": "lament", "leathe": "leather",
    "mortgag": "mortgage", "mul": "mull", "reac": "reach", "retai": "retain", "smoothl": "smoothly",
    "titl": "title", "validat": "validate", "vas": "vast", "breakdown=break down": "breakdown", "ball (party)": "ball",
    "facto": "factor", "ow": "owe", "sola": "solar", "vita": "vital", "wo": "woo", "downwards downward": "downward",
}
# 中文裡本來就會疊字的詞，去重複字時保留
REDUP_OK = set("常慢漸剛偏往紛輕微稍謝爸媽哥姊姐弟妹奶爺星寶娃狒猩默匆悄偷隱冷統處人天家個種層步斤津洋濛綿滔茫蒸栩彬赫琅喋叨孜兢戰鬱楚姍翩謙淡暗恰凜蕭朦隆轟嘩潺淙蹦跳嘻哈呵咯嗡嘀咕叮噹乒滴答拉扯絲毫沉巍峨鼎皚熙攘洶湧紛擾斑點瑟縮怯巴巴嗚咽碌碌庸庸碌")
RADICALS = re.compile(r"[⺀-⿟]")
POS_MARK = re.compile(r"\s(?:n|v|a|ad|adj|adv|prep|conj)\s")

def dedupe_doubles(text):
    out = []
    for ch in text:
        if out and ch == out[-1] and "一" <= ch <= "鿿" and ch not in REDUP_OK:
            continue
        out.append(ch)
    return "".join(out)

def clean_toefl_meaning(m):
    m = RADICALS.sub("", m)
    m = S2T.convert(m)
    m = dedupe_doubles(m)
    return re.sub(r"\s+", " ", m).strip()

def main():
    data = json.loads(PATH.read_text(encoding="utf-8"))
    clean_by_word = {}
    for item in data:
        if "托福" not in item["goal"] and item.get("meaning"):
            clean_by_word.setdefault(item["word"], item["meaning"])
    stats = collections.Counter()
    for item in data:
        if item["word"] in TOEIC_FIX:
            item["word"] = TOEIC_FIX[item["word"]]
            stats["word_fixed"] += 1
        if "多益" in item["goal"]:
            m = item.get("meaning", "")
            cut = POS_MARK.split(m, maxsplit=1)[0].strip()
            if cut != m:
                item["meaning"] = cut
                stats["toeic_meaning"] += 1
        if "托福" in item["goal"]:
            old = item.get("meaning", "")
            new = clean_by_word.get(item["word"]) or clean_toefl_meaning(old)
            if new != old:
                item["meaning"] = new
                stats["toefl_meaning"] += 1
    # 改字後同一目標可能出現重複，保留第一筆
    seen, result = set(), []
    for item in data:
        key = (item["word"], tuple(item["goal"]))
        if key in seen:
            stats["dropped_duplicate"] += 1
            continue
        seen.add(key)
        result.append(item)
    PATH.write_text(json.dumps(result, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(dict(stats), "total", len(result))

if __name__ == "__main__":
    main()
