# -*- coding: utf-8 -*-
"""第五轮：字段字典行数 / 目录 / 封面 / 图片锚点 / 编号一致性"""
import docx, re, sys, zipfile, collections
from docx.table import Table
from docx.text.paragraph import Paragraph
from docx.oxml.ns import qn
sys.stdout.reconfigure(encoding='utf-8')

P = r'D:\Project\TJ-nengtan\PRD\特变电工能碳数字化双中心_产品需求规格说明书_PRD_v2.0.docx'
d = docx.Document(P)
body = d.element.body

print('=' * 78); print('【1】封面 / 前置内容（前 26 段）'); print('=' * 78)
for i, p in enumerate(d.paragraphs[:26]):
    print('  %2d [%-9s] %s' % (i, p.style.name[:9], p.text.strip()[:88]))

print('\n' + '=' * 78); print('【2】字段字典表统计（表头含 字段中文名称/字段名 + 校验）'); print('=' * 78)
def is_fd(t):
    h = ' '.join(c.text for c in t.rows[0].cells)
    return ('字段' in h and ('校验' in h or '数据类型' in h or '类型' in h))
cur, res = '(前置)', []
for ch in body.iterchildren():
    if ch.tag == qn('w:p'):
        p = Paragraph(ch, d)
        if p.style.name == 'Heading 1': cur = p.text.strip() or '?'
        if p.style.name == 'Heading 2': cur = p.text.strip() or '?'
        if p.style.name == 'Heading 3': cur = p.text.strip() or '?'
    elif ch.tag == qn('w:tbl'):
        t = Table(ch, d)
        if is_fd(t):
            res.append((cur, len(t.rows) - 1, len(t.columns)))
print('字段字典表总数 :', len(res))
print('%-4s %-42s %6s %5s' % ('#', '模块', '字段数', '列'))
tot = 0
for i, (m, r, c) in enumerate(res, 1):
    tot += r
    print('%-4d %-42s %6d %5d' % (i, m[:42], r, c))
print('\n字段条目合计 :', tot, '| 平均每模块 : %.1f' % (tot / max(len(res), 1)))
low = [(m, r) for m, r, c in res if r < 8]
print('字段数 <8 的模块 :', low)

print('\n' + '=' * 78); print('【3】目录域内容（前 45 行）'); print('=' * 78)
z = zipfile.ZipFile(P)
xml = z.read('word/document.xml').decode('utf-8', 'ignore')
# 抓 TOC 段落区间
m = re.search(r'(<w:sdt>.*?TOC.*?</w:sdt>)', xml, re.S)
seg = m.group(1) if m else xml[:0]
texts = re.findall(r'<w:t[^>]*>([^<]*)</w:t>', seg)
toc = [t for t in texts if t.strip()]
print('目录条目数 :', len(toc))
for t in toc[:45]:
    print('   ', t[:80])
print('   ...')
for t in toc[-12:]:
    print('   ', t[:80])

print('\n' + '=' * 78); print('【4】编号一致性：H3 模块标题形态'); print('=' * 78)
h3 = [p.text.strip() for p in d.paragraphs if p.style.name == 'Heading 3']
numbered = [t for t in h3 if re.match(r'^\d+[\.、]', t)]
plain = [t for t in h3 if not re.match(r'^\d+[\.、]', t)]
print('带数字前缀 %d 个 :' % len(numbered), numbered)
print('无数字前缀 %d 个（前 12）:' % len(plain), plain[:12])

print('\n' + '=' * 78); print('【5】图片锚点（图片所在模块）'); print('=' * 78)
cur, imgs = '(前置)', []
for ch in body.iterchildren():
    if ch.tag == qn('w:p'):
        p = Paragraph(ch, d)
        if p.style.name == 'Heading 3': cur = p.text.strip()
        if p.style.name in ('Heading 1', 'Heading 2'): cur = p.text.strip()
        n = len(ch.findall('.//' + qn('w:drawing')))
        if n: imgs.append((cur, n, p.text.strip()[:40]))
    elif ch.tag == qn('w:tbl'):
        t = Table(ch, d)
        n = len(ch.findall('.//' + qn('w:drawing')))
        if n: imgs.append((cur, n, '<表格内> ' + t.cell(0, 0).text[:30].replace('\n', ' ')))
for c, n, s in imgs:
    print('   %-34s %d 张  %s' % (c[:34], n, s))

print('\n' + '=' * 78); print('【6】折标煤系数库 空单元格（24 处）定位'); print('=' * 78)
cur = None
for ch in body.iterchildren():
    if ch.tag == qn('w:p'):
        p = Paragraph(ch, d)
        if p.style.name == 'Heading 3': cur = p.text.strip()
    elif ch.tag == qn('w:tbl') and cur and '折标煤' in cur:
        t = Table(ch, d)
        e = sum(1 for r in t.rows for c in r.cells if not c.text.strip())
        if e:
            print('  表 %dx%d  空单元格 %d' % (len(t.rows), len(t.columns), e))
            for ri, r in enumerate(t.rows):
                cells = [c.text.strip().replace('\n', ' ')[:22] for c in r.cells]
                if any(not x for x in cells):
                    print('     行%d: %s' % (ri, ' | '.join('(空)' if not x else x for x in cells)))
        break

print('\n' + '=' * 78); print('【7】表格样式/边框健全性 & 3 处竖线残留'); print('=' * 78)
for i, t in enumerate(d.tables):
    if len(t.columns) == 1:
        s = t.cell(0, 0).text
        if '|' in s:
            for ln in s.split('\n'):
                if '|' in ln:
                    print('  表#%d : %s' % (i, ln.strip()[:100]))
