#!/usr/bin/env python3
"""Cắt các bảng biểu tượng trong assets/skill_library/_source/*.jpg thành từng ảnh riêng.

Mọi ảnh ra có cùng kích thước 192×192 (bằng ảnh giữa thẻ assets/cards/art_*.png) nên
dùng thay nhau mà không phải chỉnh gì. Ảnh đã dùng cho thẻ hiện tại được bỏ qua.
Chạy lại:  python3 tools/slice_skills.py     (cần Pillow, numpy)
Kết quả:   assets/skill_library/<gói>/<gói>_rHHcCC.png  +  assets/skill_library/index.json
"""
import json, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'skill_library')
SRC = os.path.join(ROOT, '_source')
OUT_SIZE = 192

# (hàng, cột) đã dùng cho thẻ, đếm từ 1  ->  khóa thẻ trong js/cards.js
USED = {
    'neon':   {(3, 1): 'dmg', (6, 5): 'rate', (2, 2): 'steal', (8, 2): 'pierce'},
    'dark':   {(1, 2): 'multi', (4, 5): 'storm', (5, 5): 'ancient', (6, 5): 'boom'},
    'gold':   {(1, 3): 'def', (2, 6): 'revive', (5, 3): 'wall', (1, 6): 'evo'},
    'nature': {(2, 5): 'regen'},
    'rpg':    {(9, 3): 'hp', (6, 3): 'gold'},
}

def runs(v, thr, minlen):
    r, s = [], None
    for i, x in enumerate(v):
        if x > thr and s is None: s = i
        if x <= thr and s is not None:
            if i - s >= minlen: r.append((s, i))
            s = None
    if s is not None and len(v) - s >= minlen: r.append((s, len(v)))
    return r

def fixed(xs, ys, size, inset):
    return [[(x + inset, y + inset, x + size - inset, y + size - inset) for x in xs] for y in ys]

def detected(path, y0, y1, thr_px, thr_col, thr_row, min_c, min_r, inset=1, x0=0, x1=None):
    g = np.array(Image.open(path).convert('L')).astype(float)
    m = (g > thr_px)
    cols = runs(m[y0:y1, x0:x1].mean(0), thr_col, min_c)
    rows = runs(m[y0:y1, x0:x1].mean(1), thr_row, min_r)
    off = x0
    return [[(c0 + off + inset, r0 + y0 + inset, c1 + off - inset, r1 + y0 - inset) for c0, c1 in cols] for r0, r1 in rows]

def round_cells(path):
    a = np.array(Image.open(path).convert('HSV')).astype(float)
    m = ~((a[..., 1] < 30) & (a[..., 2] > 150))        # bỏ nền ca-rô
    cols = runs(m.mean(0), .3, 20); rows = runs(m[:, 20:].mean(1), .3, 20)
    return [[(c0, r0, c1, r1) for c0, c1 in cols] for r0, r1 in rows]

def grids():
    P = lambda n: os.path.join(SRC, n + '.jpg')
    G = {}
    G['neon']   = (fixed([57, 185, 313, 441, 569], [25, 152, 280, 407, 535, 662, 790, 918, 1045, 1173], 110, 2), False)
    G['dark']   = (fixed([30, 166, 304, 442, 579], [33, 171, 310, 448, 587, 725], 125, 8), False)
    G['gold']   = (fixed([10, 130, 250, 372, 493, 615], [10, 130, 250, 372, 493], 113, 2), False)
    G['nature'] = (fixed([10, 155, 300, 445, 590], [10, 155, 300, 447, 593], 135, 2), False)
    G['rpg']    = (detected(P('rpg'), 300, 898, 40, .25, .25, 20, 20), False)
    G['arcane'] = (detected(P('arcane'), 305, 1049, 40, .25, .25, 20, 20), False)
    rows = runs((np.array(Image.open(P('mini')).convert('L')) > 52)[:, 15:700].mean(1), .35, 12)
    xs = [round(12 + 47.6 * i) for i in range(15)]
    G['mini']   = ([[(x + 1, r0 + 1, x + 36, r1 - 1) for x in xs] for r0, r1 in rows], False)
    G['round']  = (round_cells(P('round')), True)
    # 9 biểu tượng nổi bật ở đầu bảng arcane (xếp theo hàng đặc biệt, hàng 0)
    feat = [(88, 60, 172, 143), (180, 60, 264, 143), (273, 60, 455, 240), (462, 60, 546, 143), (556, 60, 640, 143),
            (88, 157, 172, 240), (180, 157, 264, 240), (462, 157, 546, 240), (556, 157, 640, 240)]
    return G, feat

def process(img, circle):
    w, h = img.size
    s = min(w, h)
    img = img.crop(((w - s) // 2, (h - s) // 2, (w - s) // 2 + s, (h - s) // 2 + s))
    big = img.resize((OUT_SIZE, OUT_SIZE), Image.LANCZOS)
    if s < 80: big = big.filter(ImageFilter.UnsharpMask(radius=1.2, percent=70, threshold=2))
    if circle:                                         # biểu tượng tròn: nền ngoài vòng trong suốt
        mask = Image.new('L', (OUT_SIZE * 4, OUT_SIZE * 4), 0)
        ImageDraw.Draw(mask).ellipse((2, 2, OUT_SIZE * 4 - 3, OUT_SIZE * 4 - 3), fill=255)
        big = big.convert('RGBA'); big.putalpha(mask.resize((OUT_SIZE, OUT_SIZE), Image.LANCZOS))
        return big.quantize(colors=256, method=Image.Quantize.FASTOCTREE), s
    return big.convert('P', palette=Image.ADAPTIVE, colors=256), s   # PNG 8-bit: nhẹ hơn nhiều

def main():
    G, feat = grids()
    index = {'size': OUT_SIZE, 'path': 'assets/skill_library/', 'packs': {}, 'icons': [], 'used': {}}
    names = {'neon': 'Neon (lửa, tím, xanh dương, xanh lá)', 'dark': 'Khung tối (độc, băng, hắc ám, lửa)',
             'gold': 'Vàng thánh (khiên, cánh, búa)', 'nature': 'Thiên nhiên (xanh lục, độc)',
             'arcane': 'Huyền bí (tím, đỏ, lửa, xanh ngọc)', 'rpg': 'RPG 02 (băng, độc, lửa, tím)',
             'mini': 'Mini (nhỏ, độ phân giải thấp)', 'round': 'Tròn (độ phân giải thấp, nền trong suốt)'}
    for pack, (cells, circle) in G.items():
        im = Image.open(os.path.join(SRC, pack + '.jpg')).convert('RGB')
        d = os.path.join(ROOT, pack); os.makedirs(d, exist_ok=True)
        for f in os.listdir(d): os.remove(os.path.join(d, f))
        n = 0
        entries = [(r + 1, c + 1, box) for r, row in enumerate(cells) for c, box in enumerate(row)]
        if pack == 'arcane':
            entries = [(0, i + 1, b) for i, b in enumerate(feat)] + entries   # hàng 0 = nhóm nổi bật
        for r, c, box in entries:
            if (r, c) in USED.get(pack, {}): continue
            crop = im.crop(box)
            g = np.array(crop.convert('L')).astype(float)
            if g.mean() < 52 and g.std() < 9: continue            # ô trống của bảng
            out, src = process(crop, circle)
            id_ = f'{pack}_r{r:02d}c{c:02d}'
            out.save(os.path.join(d, id_ + '.png'), optimize=True)
            index['icons'].append({'id': id_, 'pack': pack, 'file': f'{pack}/{id_}.png', 'row': r, 'col': c,
                                   'src_px': src, 'low': src < 64})
            n += 1
        index['packs'][pack] = {'name': names[pack], 'count': n, 'round': circle}
        print(f'{pack}: {n} ảnh')
    for pack, u in USED.items():
        for (r, c), key in u.items(): index['used'][f'{pack}_r{r:02d}c{c:02d}'] = key
    json.dump(index, open(os.path.join(ROOT, 'index.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('Tổng:', len(index['icons']))

if __name__ == '__main__':
    main()
