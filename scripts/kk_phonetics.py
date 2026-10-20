"""CMU 發音字典（ARPAbet）→ 台灣習慣的 KK 式音標，例如 abandon → [əˈbændən]"""
import re
import cmudict

VOWELS = {
    "AA": "ɑ", "AE": "æ", "AO": "ɔ", "AW": "aʊ", "AY": "aɪ", "EH": "ɛ", "EY": "e",
    "IH": "ɪ", "IY": "i", "OW": "o", "OY": "ɔɪ", "UH": "ʊ", "UW": "u",
}
CONS = {
    "B": "b", "CH": "tʃ", "D": "d", "DH": "ð", "F": "f", "G": "ɡ", "HH": "h", "JH": "dʒ",
    "K": "k", "L": "l", "M": "m", "N": "n", "NG": "ŋ", "P": "p", "R": "r", "S": "s",
    "SH": "ʃ", "T": "t", "TH": "θ", "V": "v", "W": "w", "Y": "j", "Z": "z", "ZH": "ʒ",
}
ONSETS = {tuple(o.split()) for o in """
P B T D K G F V TH DH S Z SH ZH HH CH JH M N L R W Y
P L|B L|K L|G L|F L|S L|P R|B R|T R|D R|K R|G R|F R|TH R|SH R|S P|S T|S K|S M|S N|S W|K W|T W|D W|G W|TH W
S P L|S P R|S T R|S K R|S K W|P Y|B Y|K Y|F Y|M Y|HH Y|V Y|S K Y|S P Y
""".replace("\n", "|").split("|") if o.strip()} | {(c,) for c in "P B T D K G F V TH DH S Z SH ZH HH CH JH M N L R W Y".split()}

_DICT = cmudict.dict()

def vowel_symbol(base, stress):
    if base == "AH":
        return "ə" if stress == "0" else "ʌ"
    if base == "ER":
        return "ɚ" if stress == "0" else "ɝ"
    return VOWELS[base]

def arpabet_to_kk(phones):
    sylls = [i for i, p in enumerate(phones) if p[-1].isdigit()]
    out = []
    marks = {}
    if len(sylls) > 1:
        prev_vowel = -1
        for vi in sylls:
            stress = phones[vi][-1]
            if stress in "12":
                # 往前找最長的合法字首子音串，重音符號放在它前面
                cons = []
                j = vi - 1
                while j > prev_vowel and not phones[j][-1].isdigit():
                    cons.insert(0, phones[j]); j -= 1
                start = vi
                for k in range(len(cons), 0, -1):
                    if tuple(cons[-k:]) in ONSETS:
                        start = vi - k
                        break
                if prev_vowel == -1:
                    start = 0  # 第一個音節：前面的子音全都算字首
                marks[start] = "ˈ" if stress == "1" else "ˌ"
            prev_vowel = vi
    for i, p in enumerate(phones):
        if i in marks:
            out.append(marks[i])
        base, stress = (p[:-1], p[-1]) if p[-1].isdigit() else (p, None)
        out.append(vowel_symbol(base, stress) if stress is not None else CONS[base])
    return "".join(out)

def kk_for(text):
    words = re.split(r"[\s]+", text.strip().lower())
    parts = []
    for w in words:
        key = w.strip(".")
        if key not in _DICT:
            key2 = key.replace("-", "")
            if key2 in _DICT:
                key = key2
            elif "-" in key and all(k in _DICT for k in key.split("-")):
                parts.append("".join(arpabet_to_kk(_DICT[k][0]) for k in key.split("-")))
                continue
            else:
                return ""
        parts.append(arpabet_to_kk(_DICT[key][0]))
    return "[" + " ".join(parts) + "]" if parts else ""

if __name__ == "__main__":
    for w in ["abandon", "get", "vocabulary", "computer", "photograph", "photography", "ice cream", "a", "about", "understand", "Taiwan", "strategy", "address", "good-looking", "extraordinary", "the", "water", "bird", "teacher"]:
        print(w, kk_for(w))
