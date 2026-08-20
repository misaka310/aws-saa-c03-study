from pathlib import Path

path = Path('quiz/index.html')
text = path.read_text(encoding='utf-8')
old = '\n  setMode("exam");\n}\nfunction render()'
new = '\n  setMode("all");\n}\nfunction render()'
if old not in text:
    raise SystemExit('first-run exam fallback not found')
path.write_text(text.replace(old, new, 1), encoding='utf-8')
