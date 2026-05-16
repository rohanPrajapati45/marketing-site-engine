from pathlib import Path
import sys

p = Path('src/routes/Contact.jsx')
text = p.read_text(encoding='utf-8')
start = text.find('<style>{`')
end = text.find('`}</style>', start)
if start == -1 or end == -1:
    raise SystemExit('STYLE_BLOCK_NOT_FOUND')
p.write_text(text[:start] + text[end + len('`}</style>'):], encoding='utf-8')
print('removed style block')
