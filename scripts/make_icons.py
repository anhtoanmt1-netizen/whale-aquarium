#!/usr/bin/env python3
"""Tạo icon launcher Android (thường + tròn + thích ứng) từ icon-512.png.
Dùng:  python3 scripts/make_icons.py android/app/src/main/res"""
import sys, os
from PIL import Image, ImageDraw

res = sys.argv[1] if len(sys.argv) > 1 else 'android/app/src/main/res'
src = Image.open(os.path.join(os.path.dirname(__file__), '..', 'icon-512.png')).convert('RGBA')
crop = src.crop((62, 62, 450, 450))                      # bỏ viền khung đậm của ảnh gốc
avg = crop.resize((1, 1), Image.LANCZOS).getpixel((0, 0))  # màu nền trung bình (xanh biển)
bg_hex = '#%02x%02x%02x' % avg[:3]

legacy = {'mdpi': 48, 'hdpi': 72, 'xhdpi': 96, 'xxhdpi': 144, 'xxxhdpi': 192}
for d, px in legacy.items():
    out = os.path.join(res, 'mipmap-' + d)
    os.makedirs(out, exist_ok=True)
    sq = crop.resize((px, px), Image.LANCZOS)
    sq.save(os.path.join(out, 'ic_launcher.png'))
    m = Image.new('L', (px * 4, px * 4), 0)
    ImageDraw.Draw(m).ellipse((0, 0, px * 4 - 1, px * 4 - 1), fill=255)
    m = m.resize((px, px), Image.LANCZOS)
    rd = Image.new('RGBA', (px, px), (0, 0, 0, 0)); rd.paste(sq, (0, 0), m)
    rd.save(os.path.join(out, 'ic_launcher_round.png'))
    fpx = int(px * 108 / 48)                              # lớp trước của icon thích ứng: canvas 108dp, hình nằm vùng an toàn ~70dp
    fg = Image.new('RGBA', (fpx, fpx), (0, 0, 0, 0))
    inner = int(fpx * 70 / 108)
    fg.paste(crop.resize((inner, inner), Image.LANCZOS), ((fpx - inner) // 2, (fpx - inner) // 2))
    fg.save(os.path.join(out, 'ic_launcher_foreground.png'))

vals = os.path.join(res, 'values'); os.makedirs(vals, exist_ok=True)
with open(os.path.join(vals, 'ic_launcher_background.xml'), 'w', encoding='utf8') as f:
    f.write('<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">%s</color>\n</resources>\n' % bg_hex)
print('Đã tạo icon, màu nền', bg_hex)
