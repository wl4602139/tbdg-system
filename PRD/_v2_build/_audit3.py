# -*- coding: utf-8 -*-
"""第三轮：docx vs md 差异定位 / 图片实体提取 / 缺陷明细"""
import docx, re, os, sys, zipfile, collections
from docx.table import Table
from docx.text.paragraph import Paragraph
from docx.oxml.ns import qn
sys.stdout.reconfigure(encoding='utf-8')

P = r'D:\Project\TJ-nengtan\PRD\特变电工能碳数字化双中心_产品需求规格说明书_PRD_v2.0.docx'
M = r'D:\Project\TJ-nengtan\PRD\特变电工能碳数字化双中心_产品需求规格说明书_PRD_v2.0.md'
d = docx.Document(P)
md = open(M, encoding='utf-8').read()

print('=' * 78)
print('【1】md 是否包含 docx 中的"因子库"模块与图片')
print('=' * 78)
for probe in ['原材料碳排因子', '电力碳排因子', '能源活动碳排因子', '折标煤系数库', '因子库管理']:
    print('  %-12s  md:%d  docx:%d' % (probe, md.count(probe),
          sum(c.text.count(probe) for t in d.tables for r in t.rows for c in r.cells)
          + sum(p.text.count(probe) for p in d.paragraphs)))

print('\n' + '=' * 78)
print('【2】docx 全文 H1 完整清单')
print('=' * 78)
h1 = [p.text.strip() for p in d.paragraphs if p.style.name == 'Heading 1']
for i, t in enumerate(h1, 1):
    print('  %2d. %s' % (i, ('<空标题>' if not t else t)))

print('\n' + '=' * 78)
print('【3】空标题 / 异常段落定位')
print('=' * 78)
bad = []
for i, p in enumerate(d.paragraphs):
    t = p.text.strip()
    if p.style.name.startswith('Heading') and not t:
        bad.append(('空标题', i, p.style.name, ''))
print('空标题数:', len(bad))
for b in bad[:10]:
    print('   ', b)

print('\n' + '=' * 78)
print('【4】"待确认/待补充" 完整清单（研发准入关注项）')
print('=' * 78)
pat = re.compile(r'.{0,45}(待确认|待补充|待定|待明确|待评估|TODO|TBD).{0,45}')
hits = []
for p in d.paragraphs:
    for m in pat.finditer(p.text):
        hits.append(m.group(0).strip())
for t in d.tables:
    for r in t.rows:
        for c in r.cells:
            for m in pat.finditer(c.text):
                hits.append(m.group(0).strip().replace('\n', ' '))
seen = set(); uniq = []
for h in hits:
    k = h[:60]
    if k not in seen:
        seen.add(k); uniq.append(h)
print('去重后待确认项:', len(uniq))
for i, h in enumerate(uniq[:30], 1):
    print('  %2d. %s' % (i, h[:110]))

print('\n' + '=' * 78)
print('【5】无八段结构的 H3 模块（结构缺口）')
print('=' * 78)
mods = []
for p in d.paragraphs:
    if p.style.name == 'Heading 3':
        mods.append({'n': p.text.strip(), 'h4': []})
    elif p.style.name == 'Heading 4' and mods:
        mods[-1]['h4'].append(p.text.strip())
print('H3 总数 :', len(mods))
gap = [m for m in mods if len(m['h4']) < 8]
print('H4 段落不足 8 的模块 :', len(gap))
for m in gap:
    print('  ✗ %-28s H4=%d  %s' % (m['n'][:28], len(m['h4']), m['h4'][:3]))

print('\n' + '=' * 78)
print('【6】提取图片实体（检查是否为有效截图）')
print('=' * 78)
out = r'D:\Project\TJ-nengtan\PRD\_v2_build\_img'
os.makedirs(out, exist_ok=True)
z = zipfile.ZipFile(P)
medias = sorted([n for n in z.namelist() if n.startswith('word/media/')],
                key=lambda x: z.getinfo(x).file_size, reverse=True)
print('媒体文件总数 :', len(medias))
for i, n in enumerate(medias[:5]):
    data = z.read(n)
    ext = os.path.splitext(n)[1]
    fp = os.path.join(out, 'img%02d%s' % (i, ext))
    open(fp, 'wb').write(data)
    # 读 PNG 宽高
    print('  %-22s %8d bytes  -> %s' % (n, len(data), os.path.basename(fp)))
