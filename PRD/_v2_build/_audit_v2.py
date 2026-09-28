# -*- coding: utf-8 -*-
"""PRD v2.0 交付物质量审查（只读）"""
import docx, re, os, io, sys, collections
from docx.table import Table
from docx.text.paragraph import Paragraph
from docx.oxml.ns import qn

sys.stdout.reconfigure(encoding='utf-8')
P = r'D:\Project\TJ-nengtan\PRD\特变电工能碳数字化双中心_产品需求规格说明书_PRD_v2.0.docx'
d = docx.Document(P)

def blocks(doc):
    body = doc.element.body
    for ch in body.iterchildren():
        if ch.tag == qn('w:p'):
            yield ('p', Paragraph(ch, doc))
        elif ch.tag == qn('w:tbl'):
            yield ('t', Table(ch, doc))

paras = d.paragraphs
tabs = d.tables
print('=' * 78)
print('【A】包体基础指标')
print('=' * 78)
print('段落总数 :', len(paras))
print('表格总数 :', len(tabs))
print('内嵌图片 :', len(d.inline_shapes))
print('节(section)数 :', len(d.sections))
print('文件大小 : %.2f MB' % (os.path.getsize(P) / 1048576))
alltext = '\n'.join(p.text for p in paras)
for t in tabs:
    for r in t.rows:
        for c in r.cells:
            alltext += '\n' + c.text
print('全文字符数 :', len(alltext))

# ---------- 标题树 ----------
heads = [(p.style.name, p.text.strip()) for p in paras if re.match(r'^Heading', p.style.name)]
cnt = collections.Counter(s for s, _ in heads)
print('\n各级标题数 :', dict(sorted(cnt.items())))

print('\n' + '=' * 78)
print('【B】章级结构（H1 / H2）')
print('=' * 78)
for s, t in heads:
    if s in ('Heading 1', 'Heading 2'):
        print(('  ' if s == 'Heading 1' else '      ') + t[:88])

# ---------- 模块（H3）与八段 ----------
print('\n' + '=' * 78)
print('【C】功能模块清单与"八段式"完整性')
print('=' * 78)
cur = None
mods = []
for s, t in heads:
    if s == 'Heading 3':
        cur = {'n': t, 'sec': set(), 'h4': []}
        mods.append(cur)
    elif s == 'Heading 4' and cur is not None:
        m = re.match(r'^\s*[【\[]?\s*(\d)\s*[】\]]', t)
        key = m.group(1) if m else t[:14]
        if m:
            cur['sec'].add(key)
        cur['h4'].append(t)
print('H3 模块总数 :', len(mods))
ok = [m for m in mods if len(m['sec']) == 8]
bad = [m for m in mods if len(m['sec']) != 8]
print('八段完整 : %d / %d  (%.1f%%)' % (len(ok), len(mods), 100.0 * len(ok) / max(len(mods), 1)))
print('\n-- 八段不完整模块 --')
for m in bad:
    print('  ✗', m['n'][:60], '已含段:', sorted(m['sec']))
print('\n-- 模块逐项 --')
for i, m in enumerate(mods, 1):
    flag = 'OK ' if len(m['sec']) == 8 else 'NG '
    print('%s%2d. %-52s [%d/8]  H4数=%d' % (flag, i, m['n'][:52], len(m['sec']), len(m['h4'])))

# ---------- 按模块统计详实度 ----------
print('\n' + '=' * 78)
print('【D】逐模块详实度（正文块/表格/卡片/字数）')
print('=' * 78)
def scan_module_blocks(doc):
    """把 doc 流式切分为 [前置, 模块1, 模块2, ...]"""
    buckets = []
    curk = None
    for k, o in blocks(doc):
        if k == 'p':
            st = o.style.name
            if st == 'Heading 3':
                curk = {'name': o.text.strip(), 'p': 0, 'tbl': [], 'txt': 0,
                        'gherkin': 0, 'formula': 0, 'card': 0}
                buckets.append(curk)
                continue
            if st == 'Heading 1' or st == 'Heading 2':
                curk = None
            if curk is not None:
                curk['p'] += 1
                curk['txt'] += len(o.text)
        else:
            if curk is not None:
                curk['tbl'].append(o)
                curk['txt'] += sum(len(c.text) for r in o.rows for c in r.cells)
    return buckets

buk = scan_module_blocks(d)
for m in buk:
    for t in m['tbl']:
        if len(t.columns) == 1:
            h = t.cell(0, 0).text
            if 'Gherkin' in h or 'Given' in h: m['gherkin'] += 1
            elif '数学模型' in h or '公式' in h: m['formula'] += 1
            else: m['card'] += 1
print('%-4s %-46s %5s %5s %5s %6s' % ('#', '模块', '段落', '表格', '卡片', '字数'))
for i, m in enumerate(buk, 1):
    print('%-4d %-46s %5d %5d %5d %6d' % (i, m['name'][:46], m['p'], len(m['tbl']), m['gherkin'] + m['formula'], m['txt']))
weak = [m for m in buk if m['txt'] < 800]
print('\n字数偏少(<800)模块数:', len(weak))
for m in weak:
    print('  ! %s  %d字' % (m['name'][:50], m['txt']))

# ---------- 表格形态 ----------
print('\n' + '=' * 78)
print('【E】表格形态与畸形检查')
print('=' * 78)
colcnt = collections.Counter(len(t.columns) for t in tabs)
print('列数分布 :', dict(sorted(colcnt.items())))
emptytab = [i for i, t in enumerate(tabs) if len(t.rows) == 0 or len(t.columns) == 0]
print('空表(0行/0列) :', len(emptytab))
suspect = []
for i, t in enumerate(tabs):
    if len(t.columns) == 1 and len(t.rows) == 1 and len(t.cell(0, 0).text) > 400:
        suspect.append((i, len(t.cell(0, 0).text), t.cell(0, 0).text[:60]))
print('单格超长可疑畸形表(>400字) :', len(suspect))
for i, l, s in suspect[:6]:
    print('   #%d %d字 %s' % (i, l, s.replace('\n', ' / ')[:80]))
# 空单元格
empty = 0; tot = 0
for t in tabs:
    for r in t.rows:
        for c in r.cells:
            tot += 1
            if not c.text.strip(): empty += 1
print('单元格总数 : %d | 空单元格 : %d (%.1f%%)' % (tot, empty, 100.0 * empty / max(tot, 1)))

# ---------- Markdown 残留 / 占位符 ----------
print('\n' + '=' * 78)
print('【F】渲染残留与占位符扫描')
print('=' * 78)
pats = {
    'Markdown加粗 **': r'\*\*',
    'Markdown表线 |': r'(?<!\|)\|(?!\|)',
    '分隔线 ---': r'^\s*-{3,}\s*$',
    '围栏 ``` ': r'```',
    '容器 :::': r':::+',
    'TODO/待补/TBD': r'TODO|TBD|FIXME|待补充|待补|待定|待确认|占位',
    'XXX/??': r'XXX|xxx|\?\?\?|\？\？\？',
    '未填占位 []': r'\[\s*\]|【\s*】',
    'HTML标签残留': r'<[a-zA-Z/][^>]{0,40}>',
}
for label, pat in pats.items():
    hits = []
    for p in paras:
        if re.search(pat, p.text):
            hits.append(('P', p.text.strip()[:70]))
    for t in tabs:
        for r in t.rows:
            for c in r.cells:
                if re.search(pat, c.text):
                    hits.append(('T', c.text.strip().replace('\n', ' ')[:70]))
    print('%-18s 命中 %d' % (label, len(hits)))
    for h in hits[:4]:
        print('        [%s] %s' % h)

# ---------- 附录 / 专项表 ----------
print('\n' + '=' * 78)
print('【G】关键专项内容定位')
print('=' * 78)
keys = ['错误码', 'Gherkin', 'RACI', '数据分级', '状态机', '接口', '破坏性', '折标煤', '因子库', 'CBAM', '附录']
for k in keys:
    n = alltext.count(k)
    print('%-8s 出现 %d 次' % (k, n))
