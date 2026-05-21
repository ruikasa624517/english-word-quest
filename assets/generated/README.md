# Generated Image Assets

This project is wired to use GPT Image generated PNGs when present:

- `assets/generated/monsters/*.png`
- `assets/generated/treasures/*.png`

The prompt batch is stored at:

- `tmp/imagegen/gpt-image2-assets.jsonl`

Generate with the imagegen skill CLI after setting `OPENAI_API_KEY`:

```powershell
python C:\Users\Zhenyi\.codex\skills\.system\imagegen\scripts\image_gen.py generate-batch `
  --input tmp\imagegen\gpt-image2-assets.jsonl `
  --out-dir assets\generated `
  --concurrency 3
```

The prompts request medieval fantasy watercolor RPG assets while avoiding direct imitation of copyrighted characters or a specific protected franchise style.
