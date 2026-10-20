"""依官方分級重算 data/built-in-words.json 的 level（1–5），並加上字卡顯示用的 grade 標籤。
- 學測：大考中心高中英文參考詞彙表 第一級～第六級（第五、六級都算 level 5，標籤保留原級數）
- 會考：基本 1200 字 → level 1，常用 800 字 → level 2
- 其餘沒有官方分級的目標（英檢初級／中級、多益、托福、生活英文）：依英文常用程度（wordfreq）在原本的難度區間內平均分段，不加標籤
需要：pip install wordfreq
"""
import csv, json, pathlib, collections
from wordfreq import zipf_frequency

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "built-in-words.json"
LISTS = ROOT / "單字列表"
GSAT_NAMES = {"第一級": 1, "第二級": 2, "第三級": 3, "第四級": 4, "第五級": 5, "第六級": 6}
CHINESE_NUM = "一二三四五六"
FREQ_RANGES = {"生活英文": (1, 1), "英檢初級": (1, 3), "英檢中級": (3, 5), "多益": (3, 5), "托福": (3, 5)}

def norm(word):
    return word.strip().lower()

def read_csv(name):
    with open(LISTS / name, encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))

def main():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    gsat = {}
    for row in read_csv("GSAT_high_school_english_vocabulary.csv"):
        n = GSAT_NAMES.get(row["級別"].strip())
        if n:
            gsat.setdefault(norm(row["單字或片語"]), n)
    cap = {}
    for row in read_csv("BCT_CAP_english_2000_words.csv"):
        cap.setdefault(norm(row["單字或片語"]), row["級別"].strip())
    stats = collections.Counter()
    by_goal = collections.defaultdict(list)
    for item in data:
        goal = item["goal"][0]
        item.pop("grade", None)
        if goal == "學測":
            n = gsat.get(norm(item["word"]))
            if n:
                item["level"] = min(5, n)
                item["grade"] = f"學測第{CHINESE_NUM[n - 1]}級"
                stats["學測"] += 1
            else:
                item["level"] = 1  # 附錄（星期、月份、數字等）
                stats["學測附錄"] += 1
        elif goal == "會考":
            g = cap.get(norm(item["word"]))
            item["level"] = 1 if g == "基本1200" else 2
            item["grade"] = "會考基本 1200 字" if g == "基本1200" else "會考常用 800 字"
            stats["會考"] += 1
        else:
            by_goal[goal].append(item)
    for goal, items in by_goal.items():
        low, high = FREQ_RANGES.get(goal, (1, 5))
        span = high - low + 1
        ordered = sorted(items, key=lambda x: -zipf_frequency(x["word"], "en"))
        for index, item in enumerate(ordered):
            item["level"] = low + min(span - 1, index * span // max(1, len(ordered)))
        stats[goal] += len(items)
    DATA.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(dict(stats))
    for goal in ["生活英文", "會考", "英檢初級", "英檢中級", "學測", "多益", "托福"]:
        print(goal, sorted(collections.Counter(x["level"] for x in data if x["goal"][0] == goal).items()))

if __name__ == "__main__":
    main()
