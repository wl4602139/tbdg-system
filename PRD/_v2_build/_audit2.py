# -*- coding: utf-8 -*-
"""第二轮：标题文本形态 / 图片分布 / docx 与 md 源一致性"""
import docx, re, os, sys, collections, hashlib
from docx.table import Table
from docx.text.paragraph import Paragraph
from docx.oxml.ns import qn

sys.stdout.reconfigure(encoding='utf-8')
P = r'D:\Project\TJ-nengtan\PRD\特变电工能碳数字化双中心_产品需求规格说明书_PRD_v2.0.docx'
M = r'D:\Project\TJ-nengtan\PRD\特变电工能碳数字化双中心_产品需求规格说明书_PRD_v2.0.md'
d = docx.Document(P)

print('=' * 78)
print('【1】标题文本形态抽样（各层级前 6 条）')
print('=' * 78)
seen = collections.defaultdict(list)
for p in d.paragraphs:
    if re.match(r'^Heading', p.style.name):
        seen[p.style.name].append(p.text.strip())
for k in sorted(seen):
    print('--', k, '共', len(seen[k]))
    for t in seen[k][:6]:
        print('      repr:', repr(t[:70]))

print('\n' + '=' * 78)
print('【2】图片分布：统计每个 H1 段落区间内的内嵌图片数')
print('=' * 78)
body = d.element.body
cur = '(前置)'
img_by = collections.Counter()
img_ctx = []
for ch in body.iterchildren():
    if ch.tag == qn('w:p'):
        pr = Paragraph(ch, d)
        if pr.style.name == 'Heading 1':
            cur = pr.text.strip() or '(空标题)'
        n = len(ch.findall('.//' + qn('w:drawing'))) + len(ch.findall('.//' + qn('w:pict')))
        if n:
            img_by[cur] += n
            img_ctx.append((cur, n, pr.text.strip()[:50]))
    elif ch.tag == qn('w:tbl'):
        tb = Table(ch, d)
        n = len(ch.findall('.//' + qn('w:drawing'))) + len(ch.findall('.//' + qn('w:pict')))
        if n:
            img_by[cur] += n
            img_ctx.append((cur, n, '[表格] ' + tb.cell(0, 0).text[:44].replace('\n', ' ')))
for k, v in img_by.items():
    print('%-42s %d 张' % (k[:42], v))
print('\n图片落点明细:')
for c, n, s in img_ctx:
    print('   %s | %d张 | %s' % (c[:26], n, s))

print('\n' + '=' * 78)
print('【3】H3 模块的 H4 前两条（确认八段编号形态）')
print('=' * 78)
mods = []
for p in d.paragraphs:
    if p.style.name == 'Heading 3':
        mods.append({'n': p.text.strip(), 'h4': []})
    elif p.style.name == 'Heading 4' and mods:
        mods[-1]['h4'].append(p.text.strip())
for m in mods[:6] + mods[6:9]:
    print('◆', m['n'][:50])
    for h in m['h4']:
        print('     -', repr(h[:70]))

print('\n' + '=' * 78)
print('【4】docx 与 md 源文件文本一致性')
print('=' * 78)
md = open(M, encoding='utf-8').read()
docx_txt = '\n'.join(p.text for p in d.paragraphs)
for t in d.tables:
    for r in t.rows:
        for c in r.cells:
            docx_txt += '\n' + c.text
print('md  字符数 :', len(md))
print('docx字符数 :', len(docx_txt))
# 取 md 中的模块标题抽样，看在 docx 是否存在
for probe in ['指标管控', '全景环幕大屏', '重点设备在线监测', '综合能耗平衡与能效自评估',
              '领导驾驶舱', '碳足迹总览驾驶舱', '折标煤系数库', 'CBAM']:
    print('  md:%d  docx:%d   <-- %s' % (md.count(probe), docx_txt.count(probe), probe))
print()
print('md 中 H1/H2 标题数 :', len(re.findall(r'^#{1,2} ', md, re.M)))
print('md 中 H3 标题数    :', len(re.findall(r'^### ', md, re.M)))
print('md 中图片引用 ![]  :', len(re.findall(r'!\[', md)))
