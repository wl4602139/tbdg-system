# -*- coding: utf-8 -*-
"""v2.2.0 结构审计"""
import zipfile, io, os, re, sys
import docx
from docx.table import Table
from docx.text.paragraph import Paragraph
from PIL import Image

BASE = r'D:\Project\TJ-nengtan\PRD'
DST = os.path.join(BASE, '特变电工能碳数字化双中心_产品需求规格说明书_PRD_v2.2.docx')
W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'

out = []
def A(s=''): out.append(s); print(s)

z = zipfile.ZipFile(DST)
media = [n for n in z.namelist() if n.startswith('word/media/') and n.rsplit('.', 1)[-1].lower() in ('png', 'jpeg', 'jpg', 'emf', 'wmf')]
A('媒体文件数 = %d' % len(media))
A('文件大小 = %.2f MB' % (os.path.getsize(DST) / 1048576.0))

d = docx.Document(DST)
paras = d.paragraphs
tables = d.tables
A('段落数 = %d | 表格数 = %d' % (len(paras), len(tables)))

# --- 1. 图片总数（含页眉页脚 drawing）
img_paras = sum(1 for p in paras if p._p.findall('.//' + W + 'drawing'))
A('正文图片段落数 = %d' % img_paras)

# --- 2. 遗留待补充/待确认
left = []
for i, p in enumerate(paras):
    t = p.text
    if '待补充' in t or '待确认' in t:
        left.append('P%d: %s' % (i, t[:110]))
A('')
A('### 正文遗留【待补充/待确认】(%d 处)' % len(left))
for s in left: A('  ' + s)

# --- 3. 目视：三模块差异化校验
A('')
A('### 第三方认证管理三模块差异化校验')
for name in ('认证资料维护', '认证申请', '认证结果管理'):
    idx = [i for i, p in enumerate(paras) if p.text.strip() == name]
    A('  H3 "%s" 出现 %d 次，位置 %s' % (name, len(idx), idx))

# --- 4. 附录 F
A('')
A('### 附录 F 落位')
for i, p in enumerate(paras):
    if p.text.startswith('附录 ') and len(p.text) < 60:
        A('  P%d [%s] %s' % (i, p.style.name, p.text))

# --- 5. 新增表格尺寸
A('')
A('### 关键表格')
for i, t in enumerate(tables):
    hdr = ' | '.join(c.text.strip()[:12] for c in t.rows[0].cells)
    if i in (0, 1, 2, 156, 160, 164, 189, 190, 191, 192, 193, 197, 198, 199) or '北极星' in hdr or '字段类别' in hdr or '冲突场景' in hdr or '指标中文名称' in hdr:
        A('  T%-4d %dx%d :: %s' % (i, len(t.rows), len(t.columns), hdr[:110]))

# --- 6. 标题编号
A('')
A('### 新增标题编号检查')
for i, p in enumerate(paras):
    if p.style.name in ('Heading 2', 'Heading 3') and ('仲裁' in p.text or '北极星' in p.text or '数据源与端点' in p.text or '出境' in p.text or '裁决' in p.text):
        pPr = p._p.find(W + 'pPr')
        nid = None
        if pPr is not None:
            n = pPr.find(W + 'numPr')
            if n is not None:
                ni = n.find(W + 'numId')
                nid = None if ni is None else ni.get(W + 'val')
        A('  P%-5d %-10s numId=%-5s :: %s' % (i, p.style.name, str(nid), p.text[:60]))

# --- 7. 空白标题检查
blank = [i for i, p in enumerate(paras) if p.style.name.startswith('Heading') and p.text.strip() == '']
A('')
A('空白标题段落 = %s' % blank)

# --- 8. 新增图片尺寸
A('')
A('### 新增原型图')
for n in ['word/media/image40.png', 'word/media/image41.png', 'word/media/image42.png']:
    if n in z.namelist():
        im = Image.open(io.BytesIO(z.read(n)))
        A('  %s %s' % (n, im.size))
A('')
A('媒体清单尾部: %s' % media[-6:])

open(os.path.join(BASE, '_v2_build', '_verify_v22_out.txt'), 'w', encoding='utf-8').write('\n'.join(out))
