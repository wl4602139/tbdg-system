# -*- coding: utf-8 -*-
"""
PRD v2.0 → v2.1 修复脚本
修复项：
  P0-1 目录域级别 1-2 → 1-3，并置 dirty 以便打开时自动更新页码
  P0-2 清除空白 Heading 1（保留其分节属性），章号归位为 11 章
  P1-3 页面尺寸 Letter → A4
  P1-4 4 个因子库模块的 32 个【n】子标题 正文 → Heading 4（并新建各模块独立编号实例）
  P1-5 8 个模块标题补挂多级编号、删除手写序号（按 H2 分组新建编号实例）
  P1-6 3 个缺图模块插入显式缺口说明（便于追踪，取得原型图后可直接删除该段）
  P2-9 版本升 v2.1.0 + 追加修订记录行
"""
import docx, re, sys, copy, datetime
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
from docx.shared import Cm
from docx.text.paragraph import Paragraph
from docx.table import Table
sys.stdout.reconfigure(encoding='utf-8')

SRC = r'D:\Project\TJ-nengtan\PRD\特变电工能碳数字化双中心_产品需求规格说明书_PRD_v2.0.docx'
DST = r'D:\Project\TJ-nengtan\PRD\特变电工能碳数字化双中心_产品需求规格说明书_PRD_v2.1.docx'
log = []
def say(s):
    print(s); log.append(s)

d = docx.Document(SRC)
body = d.element.body
kids = list(body.iterchildren())

# ---------------------------------------------------------------- 工具函数
def pPr_of(p):
    pPr = p._p.find(qn('w:pPr'))
    if pPr is None:
        pPr = OxmlElement('w:pPr'); p._p.insert(0, pPr)
    return pPr

def set_style(p, style_id):
    pPr = pPr_of(p)
    ps = pPr.find(qn('w:pStyle'))
    if ps is None:
        ps = OxmlElement('w:pStyle'); pPr.insert(0, ps)
    ps.set(qn('w:val'), style_id)

def set_num(p, num_id, ilvl=0, template_para=None):
    """挂载编号；template_para 提供同级 pPr 的其它属性（缩进等）"""
    pPr = pPr_of(p)
    old = pPr.find(qn('w:numPr'))
    if old is not None:
        pPr.remove(old)
    np_ = OxmlElement('w:numPr')
    il = OxmlElement('w:ilvl'); il.set(qn('w:val'), str(ilvl)); np_.append(il)
    ni = OxmlElement('w:numId'); ni.set(qn('w:val'), str(num_id)); np_.append(ni)
    if template_para is not None:
        tPr = template_para._p.find(qn('w:pPr'))
        tNum = tPr.find(qn('w:numPr')) if tPr is not None else None
        idx = list(pPr).index(tNum) if tNum is not None and tNum in list(pPr) else None
        # 参考同级段落 pPr 中 numPr 的位置，保证元素顺序合法
        order = ['w:pStyle','w:keepNext','w:keepLines','w:pageBreakBefore','w:framePr',
                 'w:widowControl','w:numPr','w:suppressLineNumbers','w:pBdr','w:shd',
                 'w:tabs','w:suppressAutoHyphens','w:kinsoku','w:wordWrap',
                 'w:overflowPunct','w:topLinePunct','w:autoSpaceDE','w:autoSpaceDN',
                 'w:bidi','w:adjustRightInd','w:snapToGrid','w:spacing','w:ind',
                 'w:contextualSpacing','w:mirrorIndents','w:suppressOverlap','w:jc',
                 'w:textDirection','w:textAlignment','w:textboxTightWrap',
                 'w:outlineLvl','w:divId','w:cnfStyle','w:rPr','w:sectPr']
        want = order.index('w:numPr')
        pos = len(pPr)
        for i, ch in enumerate(pPr):
            tag = ch.tag.split('}')[1]
            full = 'w:' + tag
            if full in order and order.index(full) > want:
                pos = i; break
        pPr.insert(pos, np_)
    else:
        # 默认插到 pStyle 之后
        ps = pPr.find(qn('w:pStyle'))
        pos = (list(pPr).index(ps) + 1) if ps is not None else 0
        pPr.insert(pos, np_)

def strip_prefix(p, pattern):
    """从段落 runs 中剥掉开头的固定前缀（可能跨 run）"""
    runs = p.runs
    if not runs:
        return False
    texts = [r.text for r in runs]
    joined = ''.join(texts)
    m = re.match(pattern, joined)
    if not m:
        return False
    cut = m.end()
    remain = joined[cut:]
    for i, r in enumerate(runs):
        r.text = remain if i == 0 else ''
    return True

# ---------------------------------------------------------------- 编号表操作
numbering_root = d.part.numbering_part.element
abs_ids = re.findall(r'<w:abstractNum w:abstractNumId="(\d+)"', numbering_root.xml)
existing_num_ids = [int(v) for v in re.findall(r'<w:num w:numId="(\d+)"', numbering_root.xml)]
next_id = max(existing_num_ids) + 1

def abstract_with_lvltext(want):
    for aid in abs_ids:
        e = numbering_root.find(qn('w:abstractNum'))
    for el in numbering_root.findall(qn('w:abstractNum')):
        lv0 = el.find(qn('w:lvl'))
        if lv0 is not None:
            lt = lv0.find(qn('w:lvlText'))
            if lt is not None and lt.get(qn('w:val')) == want:
                return el.get(qn('w:abstractNumId'))
    return None

ABS_H3 = abstract_with_lvltext('%1.')      # 模块级：1. 2. 3.
ABS_H4 = abstract_with_lvltext('【%1】')    # 八段子节：【1】~【8】
say('编号模板定位：H3 abstract=%s (%%1.)  |  H4 abstract=%s (【%%1】)' % (ABS_H3, ABS_H4))
assert ABS_H3 and ABS_H4, '未找到 %1. 或 【%1】 编号模板'

def new_num(abstract_id):
    global next_id
    el = OxmlElement('w:num')
    el.set(qn('w:numId'), str(next_id))
    a = OxmlElement('w:abstractNumId'); a.set(qn('w:val'), str(abstract_id))
    el.append(a)
    numbering_root.append(el)
    nid = next_id; next_id += 1
    return nid

# 取同级模板段落
h3_template = None; h4_template = None
for p in d.paragraphs:
    if p.style.name == 'Heading 3' and h3_template is None and p.text.strip() == '指标管控':
        h3_template = p
    if p.style.name == 'Heading 4' and h4_template is None:
        h4_template = p
say('模板：H3=%r  H4=%r' % (h3_template.text.strip(), h4_template.text.strip()))

# ================================================================ P0-2
say('\n=== P0-2 清除空白 Heading 1 ===')
fixed_empty = 0
for p in d.paragraphs:
    if p.style.name == 'Heading 1' and not p.text.strip():
        pPr = pPr_of(p)
        keep_sect = pPr.find(qn('w:sectPr'))
        set_style(p, '1')                       # 正文
        np_ = pPr.find(qn('w:numPr'))
        if np_ is not None:
            pPr.remove(np_)
        for tag in ('w:outlineLvl',):
            e = pPr.find(qn(tag))
            if e is not None: pPr.remove(e)
        fixed_empty += 1
        say('  已处理：空白 H1 → 正文样式，移除 numPr，分节属性保留=%s' % (keep_sect is not None))
assert fixed_empty == 1

# ================================================================ P0-1
say('\n=== P0-1 目录域 1-2 → 1-3 ===')
cnt_toc = 0
for instr in d.element.body.iter(qn('w:instrText')):
    if instr.text and 'TOC' in instr.text:
        say('  原指令: %r' % instr.text)
        instr.text = 'TOC \\o "1-3" \\h \\z \\u '
        say('  新指令: %r' % instr.text)
        cnt_toc += 1
        # 置 dirty：Word/WPS 打开时自动重算页码
        run = instr.getparent()
        para = run.getparent()
        for sib in para:
            for fc in sib.iter(qn('w:fldChar')):
                if fc.get(qn('w:fldCharType')) == 'begin':
                    fc.set(qn('w:dirty'), 'true')
                    say('  已置 dirty=true（打开文档即自动更新目录页码）')
                    break
            else:
                continue
            break
assert cnt_toc == 1, '目录域数量异常: %d' % cnt_toc

# ================================================================ P1-3
say('\n=== P1-3 页面尺寸 Letter → A4 ===')
for i, s in enumerate(d.sections):
    old = '%.2f x %.2f cm' % (s.page_width.cm, s.page_height.cm)
    s.page_width = Cm(21.0); s.page_height = Cm(29.7)
    say('  节%d: %s → %.2f x %.2f cm' % (i, old, s.page_width.cm, s.page_height.cm))

# ================================================================ P1-5
say('\n=== P1-5 8 个模块标题补挂编号 ===')
GROUPS = {                     # H2 名称 -> 该组模块标题（原手写序号）
    '对外示范窗口':    ['1. 碳足迹总览驾驶舱'],
    '第三方认证管理':  ['1. 认证资料维护', '2. 认证申请', '3. 认证结果管理'],
    '因子库管理':      ['1. 原材料碳排因子', '2. 电力碳排因子', '3. 能源活动碳排因子', '4. 折标煤系数库'],
}
done = 0
group_num = {}
for h2name, titles in GROUPS.items():
    nid = new_num(ABS_H3)
    group_num[h2name] = nid
    for p in d.paragraphs:
        if p.style.name != 'Heading 3':
            continue
        if p.text.strip() in titles:
            ok = strip_prefix(p, r'^\s*\d+\s*[\.、]\s*')
            set_num(p, nid, 0, template_para=h3_template)
            done += 1
            say('  [%s] %-20s → %-18s numId=%d 去前缀=%s'
                % (h2name, titles[titles.index(p.text.strip())] if False else '', p.text.strip(), nid, ok))
assert done == 8, '模块标题处理数异常: %d' % done

# ================================================================ P1-4
say('\n=== P1-4 因子库模块 32 个子标题 正文 → Heading 4 ===')
MODS = ['原材料碳排因子', '电力碳排因子', '能源活动碳排因子', '折标煤系数库']
titles = ['1. 原材料碳排因子', '2. 电力碳排因子', '3. 能源活动碳排因子', '4. 折标煤系数库']
converted = 0
mod_seq = []
for idx, p in enumerate(d.paragraphs):
    if p.style.name == 'Heading 3' and p.text.strip() in MODS:
        mod_seq.append((idx, p.text.strip()))
say('  命中因子库模块 %d 个: %s' % (len(mod_seq), [m[1] for m in mod_seq]))
for k, (h3idx, name) in enumerate(mod_seq):
    nid = new_num(ABS_H4)                 # 每个模块一个独立实例 → 【1】~【8】
    cnt = 0
    for p in d.paragraphs:
        if p.style.name != 'Body Text':
            continue
        if not re.match(r'^【[1-8]】', p.text.strip()):
            continue
        # 判断归属：向上找最近的 Heading 3
        cur = p._p.getprevious()
        owner = None
        while cur is not None:
            if cur.tag == qn('w:p'):
                pp = Paragraph(cur, d)
                if pp.style.name == 'Heading 3':
                    owner = pp.text.strip(); break
                if pp.style.name in ('Heading 1', 'Heading 2'):
                    break
            cur = cur.getprevious()
        if owner != name:
            continue
        strip_prefix(p, r'^\s*【[1-8]】\s*')
        set_style(p, '6')                 # Heading 4
        set_num(p, nid, 0, template_para=h4_template)
        cnt += 1; converted += 1
    say('  %-16s → %d 段转为 Heading 4，numId=%d' % (name, cnt, nid))
assert converted == 32, '转换段数异常: %d' % converted

# ================================================================ P1-6
say('\n=== P1-6 3 个缺图模块插入缺口说明 ===')
NOTE = '【原型缺口】本模块原型图尚未提供，待设计与业务方补充后插入本行下方（责任人与计划完成时间待确认）。'
targets = ['综合集控大屏 16:9', '综合能耗平衡与能效自评估', '基础参数配置']
tpl_body = None
for p in d.paragraphs:
    if p.style.name == 'Body Text' and len(p.text.strip()) > 40:
        tpl_body = p; break
inserted = 0
for p in d.paragraphs:
    if p.style.name == 'Heading 3' and p.text.strip() in targets:
        newp = copy.deepcopy(tpl_body._p)
        # 清空 runs，仅保留一个
        runs = newp.findall(qn('w:r'))
        for r in runs[1:]:
            newp.remove(r)
        if runs:
            for t in runs[0].findall(qn('w:t')):
                t.text = NOTE
                t.set(qn('xml:space'), 'preserve')
            rPr = runs[0].find(qn('w:rPr'))
            if rPr is None:
                rPr = OxmlElement('w:rPr'); runs[0].insert(0, rPr)
            for tag in ('w:b', 'w:i', 'w:color'):
                e = rPr.find(qn(tag))
                if e is not None: rPr.remove(e)
            c = OxmlElement('w:color'); c.set(qn('w:val'), '9A6A00'); rPr.append(c)
            it = OxmlElement('w:i'); rPr.append(it)
        p._p.addnext(newp)
        inserted += 1
        say('  已在 [%s] 标题下插入缺口说明' % p.text.strip())
assert inserted == 3

# ================================================================ P2-9 版本
say('\n=== P2-9 版本号与修订记录 ===')
t0 = d.tables[0]
def set_cell(cell, text, bold=None):
    ps = cell.paragraphs
    p = ps[0]
    for extra in ps[1:]:
        extra._p.getparent().remove(extra._p)
    if p.runs:
        p.runs[0].text = text
        for r in p.runs[1:]:
            r._r.getparent().remove(r._r)
    else:
        p.add_run(text)
set_cell(t0.rows[0].cells[1], 'TBEA-PRD-MASTER-2026-V2.1')
set_cell(t0.rows[1].cells[1], 'v2.1.0（格式与结构修复版）')
set_cell(t0.rows[3].cells[1], '2026-09-16 (正式生效)')
say('  封面：受控编号→TBEA-PRD-MASTER-2026-V2.1，版本→v2.1.0')

rev = d.tables[2]
last = rev.rows[-1]
newrow = copy.deepcopy(last._tr)
rev._tbl.append(newrow)
from docx.table import _Row
row = _Row(newrow, rev)
vals = ['v2.1.0', '2026-09-16',
        '格式与结构修复：目录域升级至 3 级并自动刷新；清除空白章标题占用章号；页面尺寸统一 A4；因子库 4 模块子标题改为标题样式；8 个模块标题统一自动编号；补记 3 处原型缺口。',
        '王亮', '产品经理']
for c, v in zip(row.cells, vals):
    set_cell(c, v)
say('  修订记录追加：v2.1.0 / 2026-09-16')

# core props
cp = d.core_properties
cp.version = '2.1.0'
cp.modified = datetime.datetime.now()
cp.comments = 'v2.1.0 格式与结构修复版（基于 v2.0.0）'

d.save(DST)
say('\n已保存: %s' % DST)

open(r'D:\Project\TJ-nengtan\PRD\_v2_build\_fix_log.txt', 'w', encoding='utf-8').write('\n'.join(log))
