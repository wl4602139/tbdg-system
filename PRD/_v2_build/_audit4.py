# -*- coding: utf-8 -*-
"""第四轮：目录/编号/字段字典详实度/空单元格/因子库模块结构/图片规格"""
import docx, re, os, sys, zipfile, struct, collections
from docx.table import Table
from docx.text.paragraph import Paragraph
from docx.oxml.ns import qn
sys.stdout.reconfigure(encoding='utf-8')

P = r'D:\Project\TJ-nengtan\PRD\特变电工能碳数字化双中心_产品需求规格说明书_PRD_v2.0.docx'
d = docx.Document(P)

print('=' * 78); print('【1】目录域 / 页码 / 编号域 检查'); print('=' * 78)
z = zipfile.ZipFile(P)
doc_xml = z.read('word/document.xml').decode('utf-8', 'ignore')
print('TOC 域 (TOC \\o) :', len(re.findall(r'TOC\s*\\', doc_xml)))
print('PAGEREF 域      :', len(re.findall(r'PAGEREF', doc_xml)))
print('SEQ 域(图表号)  :', len(re.findall(r'SEQ\s', doc_xml)))
print('numPr(自动编号) :', len(re.findall(r'<w:numPr>', doc_xml)))
# 页眉页脚
names = [n for n in z.namelist() if 'header' in n or 'footer' in n]
print('页眉页脚部件    :', names)
for n in names[:4]:
    s = z.read(n).decode('utf-8', 'ignore')
    txt = ' '.join(re.findall(r'<w:t[^>]*>([^<]*)</w:t>', s))
    print('   %-24s -> %s' % (n.split('/')[-1], txt[:100]))

print('\n' + '=' * 78); print('【2】四个"因子库"模块的内部结构（H4=0，需确认其形态）'); print('=' * 78)
body = d.element.body
capture = False; cnt = 0
for ch in body.iterchildren():
    if ch.tag == qn('w:p'):
        p = Paragraph(ch, d)
        if p.style.name == 'Heading 3' and '原材料碳排因子' in p.text:
            capture = True
        elif p.style.name in ('Heading 1', 'Heading 2', 'Heading 3') and capture and '原材料碳排因子' not in p.text:
            if p.style.name != 'Heading 2' or '因子' not in p.text:
                capture = False
        if capture and cnt < 26:
            print('  [%s] %s' % (p.style.name[:9], p.text.strip()[:95])); cnt += 1
    elif ch.tag == qn('w:tbl') and capture:
        t = Table(ch, d)
        print('  <表格 %dx%d> 表头: %s' % (len(t.rows), len(t.columns), ' | '.join(c.text.replace(chr(10), ' ')[:16] for c in t.rows[0].cells)))

print('\n' + '=' * 78); print('【3】字段字典表详实度（表头含"字段"的表，统计行数与列数）'); print('=' * 78)
mods = []
for p in d.paragraphs:
    if p.style.name == 'Heading 3':
        mods.append({'n': p.text.strip(), 'fd': None})
    elif p.style.name == 'Heading 4' and mods:
        if '字段字典' in p.text:
            mods[-1]['fd'] = 'H4'
cur = None
for ch in body.iterchildren():
    if ch.tag == qn('w:p'):
        p = Paragraph(ch, d)
        if p.style.name == 'Heading 3':
            cur = p.text.strip()
        if p.style.name in ('Heading 1', 'Heading 2'):
            cur = None
    elif ch.tag == qn('w:tbl'):
        t = Table(ch, d)
        hdr = ' '.join(c.text for c in t.rows[0].cells)
        if '字段' in hdr and '字典' in hdr or ('字段名称' in hdr or '字段名' in hdr):
            for m in mods:
                if m['n'] == cur:
                    m['fd'] = (len(t.rows) - 1, len(t.columns))
print('%-4s %-44s %s' % ('#', '模块', '字段字典[字段数 x 列数]'))
empt = []
for i, m in enumerate(mods, 1):
    v = m['fd'] if not isinstance(m['fd'], str) else None
    if m['n'] in ('项目建设背景', '建设目标', '端—边—云三层物联网架构', '双中心定位与协同'):
        continue
    print('%-4d %-44s %s' % (i, m['n'][:44], v if v else '  —— 未检出 ——'))
    if not v: empt.append(m['n'])
print('\n缺少字段字典的模块:', empt)

print('\n' + '=' * 78); print('【4】空单元格分布（72 处）'); print('=' * 78)
loc = collections.Counter(); samples = []
for ch in body.iterchildren():
    if ch.tag == qn('w:p'):
        p = Paragraph(ch, d)
        if p.style.name == 'Heading 3':
            loc['__cur__'] = p.text.strip()
    elif ch.tag == qn('w:tbl'):
        t = Table(ch, d)
        for ri, r in enumerate(t.rows):
            for c in r.cells:
                if not c.text.strip():
                    key = '%s | 表%d(%dx%d)' % (str(loc.get('__cur__'))[:26], 0, len(t.rows), len(t.columns))
                    samples.append((loc.get('__cur__'), t, ri))
                    break
print('含空单元格的表格数:', len(samples))
c2 = collections.Counter(str(s[0])[:40] for s in samples)
for k, v in c2.most_common(12):
    print('   %-44s %d 处' % (k, v))

print('\n' + '=' * 78); print('【5】图片规格（PNG 尺寸识别）'); print('=' * 78)
mm = sorted([n for n in z.namelist() if n.startswith('word/media/')], key=lambda x: z.getinfo(x).file_size, reverse=True)
for n in mm[:6]:
    b = z.read(n)
    if b[:8] == b'\x89PNG\r\n\x1a\n':
        w, h = struct.unpack('>II', b[16:24])
        print('  %-22s %5dx%-5d  %8d B' % (n.split('/')[-1], w, h, len(b)))
    else:
        print('  %-22s 非PNG  %8d B' % (n.split('/')[-1], len(b)))
print('  合计 %d 张，共 %.2f MB' % (len(mm), sum(z.getinfo(n).file_size for n in mm) / 1048576))

print('\n' + '=' * 78); print('【6】Gherkin 场景总数'); print('=' * 78)
alltxt = '\n'.join([p.text for p in d.paragraphs] + [c.text for t in d.tables for r in t.rows for c in r.cells])
for k in ['Scenario:', 'Scenario Outline:', 'Given ', 'When ', 'Then ', 'Feature:', 'Examples:']:
    print('  %-18s %d' % (k, alltxt.count(k)))
