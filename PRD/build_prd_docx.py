# -*- coding: utf-8 -*-
"""
特变电工能碳数字化双中心 · 产品需求规格说明书 (PRD) 全景详案构建引擎 (v1.1.0 全量详案深度版)
覆盖：PRD 10大板块、主导航逐层拆解法、六级组织架构、PM/Dev/QA 三方闭环、
44px高密表格、客观中立、四大状态机、L0~L4数据分级、统一错误码、RACI矩阵与法规映射。
深度扩充：每个功能模块补齐全量数据字典表、严密核算数学公式、完整字段校验约束、
步骤化业务控制流、状态机跃迁与 Gherkin 验收准则。
"""

import os
import sys
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

OUTPUT_DIR = r"D:\Project\TJ-nengtan\PRD"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "特变电工能碳数字化双中心_产品需求规格说明书_PRD_v1.1.docx")
FALLBACK_FILE = os.path.join(OUTPUT_DIR, "特变电工能碳数字化双中心_产品需求规格说明书_PRD_v1.0.docx")

COLOR_PRIMARY_HEX = "1E3A8A"        # 特变标志深蓝
COLOR_SECONDARY_HEX = "0284C7"      # 科技蓝
COLOR_LIGHT_BG_HEX = "F8FAFC"       # 表格交替底色
COLOR_BORDER_HEX = "CBD5E1"         # 边框浅灰
COLOR_CALLOUT_BG_HEX = "EFF6FF"     # 业务约束浅蓝底
COLOR_CALLOUT_BORDER_HEX = "2563EB" # 业务约束蓝边
COLOR_WARN_BG_HEX = "FEF2F2"        # 警告底色
COLOR_WARN_BORDER_HEX = "DC2626"    # 警告红边
COLOR_FORMULA_BG_HEX = "F0FDF4"     # 公式绿色底
COLOR_FORMULA_BORDER_HEX = "16A34A"  # 公式绿边
COLOR_GHERKIN_BG_HEX = "F5F3FF"     # Gherkin 紫色底
COLOR_GHERKIN_BORDER_HEX = "7C3AED" # Gherkin 紫边

COLOR_PRIMARY = RGBColor(30, 58, 138)
COLOR_SECONDARY = RGBColor(2, 132, 199)
COLOR_TEXT_MAIN = RGBColor(31, 41, 55)
COLOR_TEXT_MUTED = RGBColor(100, 116, 139)

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    tcPr.append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>'))

def set_cell_margins(cell, top=90, bottom=90, left=120, right=120):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_cell_border(cell, **kwargs):
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = tcPr.first_child_found_in("w:tcBorders")
    if tcBorders is None:
        tcBorders = OxmlElement('w:tcBorders')
        tcPr.append(tcBorders)
    for edge in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV'):
        edge_data = kwargs.get(edge)
        if edge_data:
            tag = 'w:{}'.format(edge)
            element = tcBorders.find(qn(tag))
            if element is None:
                element = OxmlElement(tag)
                tcBorders.append(element)
            for key, attr in [("val", "w:val"), ("color", "w:color"), ("sz", "w:sz"), ("space", "w:space")]:
                if key in edge_data:
                    element.set(qn(attr), str(edge_data[key]))

def add_header_footer(doc):
    for s in doc.sections:
        s.different_first_page_header_footer = True
        header = s.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("特变电工能碳数字化双中心 · 产品需求规格说明书 (PRD) v1.1.0")
        hrun.font.name = "微软雅黑"
        hrun.font.size = Pt(8.5)
        hrun.font.color.rgb = COLOR_TEXT_MUTED
        
        footer = s.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        frun = fp.add_run("特变电工股份有限公司 · 商业绝密技术资产 严禁未经授权复制与外传")
        frun.font.name = "微软雅黑"
        frun.font.size = Pt(8.5)
        frun.font.color.rgb = COLOR_TEXT_MUTED

def add_cover(doc):
    p_sec = doc.add_paragraph()
    p_sec.paragraph_format.space_before = Pt(30)
    p_sec.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_sec = p_sec.add_run("密级：内部绝密 (L4 - Top Secret)")
    r_sec.font.name = "微软雅黑"
    r_sec.font.size = Pt(10)
    r_sec.font.bold = True
    r_sec.font.color.rgb = RGBColor(220, 38, 38)
    
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(35)
    p_title.paragraph_format.space_after = Pt(8)
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_tbea = p_title.add_run("特变电工股份有限公司\n")
    r_tbea.font.name = "微软雅黑"
    r_tbea.font.size = Pt(18)
    r_tbea.font.bold = True
    r_tbea.font.color.rgb = COLOR_PRIMARY
    
    r_main = p_title.add_run("能碳数字化“双中心”集成平台\n全景产品需求规格说明书 (PRD)")
    r_main.font.name = "微软雅黑"
    r_main.font.size = Pt(25)
    r_main.font.bold = True
    r_main.font.color.rgb = COLOR_PRIMARY
    
    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(45)
    r_sub = p_sub.add_run("零碳园区集控中心 + 产品碳足迹集采中心 · 全生命周期研发、测试与工程交付基线\nProduct Requirements Specification Document · Release v1.1.0")
    r_sub.font.name = "Calibri"
    r_sub.font.size = Pt(11.5)
    r_sub.font.color.rgb = COLOR_SECONDARY
    
    table = doc.add_table(rows=7, cols=2)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    
    meta_info = [
        ("文档受控编号", "TBEA-PRD-MASTER-2026-V1.1.0"),
        ("系统基线版本", "Release v1.1.0 (生产基线全景工程详案版)"),
        ("多角色会签团队", "产品管理部 (PM) × 数字化研发中心 (Dev) × 质量保障中心 (QA)"),
        ("遵循工程规范", "tbea-industrial-design (44px表格/客观中立/状态自解释/双端同构)"),
        ("遵循需求规范", "tbea-prd-standards v1.1.0 (主导航拆解/L0-L4数据治理/状态机/错误码)"),
        ("工程归档路径", "D:\\Project\\TJ-nengtan\\PRD"),
        ("正式生效日期", "2026 年 09 月 08 日"),
    ]
    
    for i, (k, v) in enumerate(meta_info):
        r = table.rows[i]
        c0, c1 = r.cells[0], r.cells[1]
        c0.width = Inches(2.2)
        c1.width = Inches(4.5)
        set_cell_background(c0, "F1F5F9")
        set_cell_background(c1, "FFFFFF")
        set_cell_margins(c0, 80, 80, 120, 120)
        set_cell_margins(c1, 80, 80, 120, 120)
        
        p0 = c0.paragraphs[0]
        p0.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        run0 = p0.add_run(k)
        run0.font.name = "微软雅黑"
        run0.font.bold = True
        run0.font.size = Pt(9.5)
        run0.font.color.rgb = COLOR_PRIMARY
        
        p1 = c1.paragraphs[0]
        p1.alignment = WD_ALIGN_PARAGRAPH.LEFT
        run1 = p1.add_run(v)
        run1.font.name = "微软雅黑"
        run1.font.size = Pt(9.5)
        run1.font.color.rgb = COLOR_TEXT_MAIN
        
        for c in (c0, c1):
            set_cell_border(c, 
                top={"val": "single", "sz": "4", "color": COLOR_BORDER_HEX},
                bottom={"val": "single", "sz": "4", "color": COLOR_BORDER_HEX},
                left={"val": "single", "sz": "4", "color": COLOR_BORDER_HEX},
                right={"val": "single", "sz": "4", "color": COLOR_BORDER_HEX})

    doc.add_page_break()

def add_styled_heading(doc, text, level):
    h = doc.add_heading(text, level=level)
    h.paragraph_format.keep_with_next = True
    run = h.runs[0]
    run.font.name = "微软雅黑"
    if level == 1:
        h.paragraph_format.space_before = Pt(18)
        h.paragraph_format.space_after = Pt(8)
        run.font.size = Pt(15.5)
        run.font.bold = True
        run.font.color.rgb = COLOR_PRIMARY
    elif level == 2:
        h.paragraph_format.space_before = Pt(13)
        h.paragraph_format.space_after = Pt(5)
        run.font.size = Pt(12.5)
        run.font.bold = True
        run.font.color.rgb = COLOR_SECONDARY
    elif level == 3:
        h.paragraph_format.space_before = Pt(9)
        h.paragraph_format.space_after = Pt(3)
        run.font.size = Pt(10.5)
        run.font.bold = True
        run.font.color.rgb = COLOR_PRIMARY
    return h

def add_p(doc, text, bold_prefix=None, space_after=4):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.2
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = "微软雅黑"
        r_pre.font.bold = True
        r_pre.font.size = Pt(9.5)
        r_pre.font.color.rgb = COLOR_PRIMARY
    r_body = p.add_run(text)
    r_body.font.name = "微软雅黑"
    r_body.font.size = Pt(9.5)
    r_body.font.color.rgb = COLOR_TEXT_MAIN
    return p

def add_callout(doc, text, title="业务约束与质检红线", is_warn=False):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    cell = table.cell(0, 0)
    cell.width = Inches(6.7)
    bg_color = COLOR_WARN_BG_HEX if is_warn else COLOR_CALLOUT_BG_HEX
    border_color = COLOR_WARN_BORDER_HEX if is_warn else COLOR_CALLOUT_BORDER_HEX
    set_cell_background(cell, bg_color)
    set_cell_margins(cell, top=100, bottom=100, left=140, right=140)
    set_cell_border(cell,
        left={"val": "single", "sz": "24", "color": border_color},
        top={"val": "none"}, bottom={"val": "none"}, right={"val": "none"})
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(2)
    r_title = p.add_run(f"📌 【{title}】\n")
    r_title.font.name = "微软雅黑"
    r_title.font.bold = True
    r_title.font.size = Pt(9.5)
    r_title.font.color.rgb = RGBColor(220, 38, 38) if is_warn else COLOR_PRIMARY
    r_text = p.add_run(text)
    r_text.font.name = "微软雅黑"
    r_text.font.size = Pt(9.0)
    r_text.font.color.rgb = COLOR_TEXT_MAIN
    doc.add_paragraph().paragraph_format.space_after = Pt(2)

def add_formula_box(doc, formula_str, desc_str, var_table=None):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    cell = table.cell(0, 0)
    cell.width = Inches(6.7)
    set_cell_background(cell, COLOR_FORMULA_BG_HEX)
    set_cell_margins(cell, top=100, bottom=100, left=140, right=140)
    set_cell_border(cell,
        left={"val": "single", "sz": "24", "color": COLOR_FORMULA_BORDER_HEX},
        top={"val": "none"}, bottom={"val": "none"}, right={"val": "none"})
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(2)
    r_title = p.add_run("📐 【核心数学模型与算法公式】\n")
    r_title.font.name = "微软雅黑"
    r_title.font.bold = True
    r_title.font.size = Pt(9.5)
    r_title.font.color.rgb = RGBColor(22, 163, 74)
    r_form = p.add_run(f"【核算公式】：{formula_str}\n")
    r_form.font.name = "Consolas"
    r_form.font.bold = True
    r_form.font.size = Pt(9.5)
    r_form.font.color.rgb = COLOR_PRIMARY
    r_desc = p.add_run(f"【逻辑说明】：{desc_str}")
    r_desc.font.name = "微软雅黑"
    r_desc.font.size = Pt(9.0)
    r_desc.font.color.rgb = COLOR_TEXT_MAIN
    if var_table:
        r_var = p.add_run("\n【变量定义与取值约定】：\n" + var_table)
        r_var.font.name = "微软雅黑"
        r_var.font.size = Pt(8.5)
        r_var.font.color.rgb = COLOR_TEXT_MUTED
    doc.add_paragraph().paragraph_format.space_after = Pt(2)

def add_gherkin_box(doc, feature_name, scenario_name, given_str, when_str, then_str):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    cell = table.cell(0, 0)
    cell.width = Inches(6.7)
    set_cell_background(cell, COLOR_GHERKIN_BG_HEX)
    set_cell_margins(cell, top=90, bottom=90, left=130, right=130)
    set_cell_border(cell,
        left={"val": "single", "sz": "24", "color": COLOR_GHERKIN_BORDER_HEX},
        top={"val": "none"}, bottom={"val": "none"}, right={"val": "none"})
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(2)
    r_title = p.add_run(f"🧪 【QA 自动化验收准则 · Gherkin 用例】 Feature: {feature_name}\n")
    r_title.font.name = "微软雅黑"
    r_title.font.bold = True
    r_title.font.size = Pt(9.0)
    r_title.font.color.rgb = RGBColor(124, 58, 237)
    r_sc = p.add_run(f"Scenario: {scenario_name}\n")
    r_sc.font.name = "Consolas"
    r_sc.font.bold = True
    r_sc.font.size = Pt(8.5)
    r_sc.font.color.rgb = COLOR_PRIMARY
    r_g = p.add_run(f"  Given {given_str}\n")
    r_g.font.name = "Consolas"
    r_g.font.size = Pt(8.5)
    r_g.font.color.rgb = COLOR_TEXT_MAIN
    r_w = p.add_run(f"  When  {when_str}\n")
    r_w.font.name = "Consolas"
    r_w.font.size = Pt(8.5)
    r_w.font.color.rgb = COLOR_TEXT_MAIN
    r_t = p.add_run(f"  Then  {then_str}")
    r_t.font.name = "Consolas"
    r_t.font.bold = True
    r_t.font.size = Pt(8.5)
    r_t.font.color.rgb = RGBColor(22, 163, 74)
    doc.add_paragraph().paragraph_format.space_after = Pt(2)

def add_table_data(doc, headers, rows, col_widths=None):
    table = doc.add_table(rows=len(rows) + 1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    hdr_row = table.rows[0]
    hdr_row._tr.get_or_add_trPr().append(parse_xml(f'<w:tblHeader {nsdecls("w")}/>'))
    for idx, heading in enumerate(headers):
        cell = hdr_row.cells[idx]
        set_cell_background(cell, COLOR_PRIMARY_HEX)
        set_cell_margins(cell, 70, 70, 90, 90)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run(heading)
        run.font.name = "微软雅黑"
        run.font.bold = True
        run.font.size = Pt(9)
        run.font.color.rgb = RGBColor(255, 255, 255)
    for r_idx, row_data in enumerate(rows):
        row = table.rows[r_idx + 1]
        bg_hex = COLOR_LIGHT_BG_HEX if (r_idx % 2 == 1) else "FFFFFF"
        for c_idx, val in enumerate(row_data):
            cell = row.cells[c_idx]
            set_cell_background(cell, bg_hex)
            set_cell_margins(cell, 60, 60, 80, 80)
            p = cell.paragraphs[0]
            if c_idx == 0:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            run = p.add_run(str(val))
            run.font.name = "微软雅黑"
            run.font.size = Pt(8.5)
            run.font.color.rgb = COLOR_TEXT_MAIN
    for row in table.rows:
        for c_idx, cell in enumerate(row.cells):
            set_cell_border(cell,
                top={"val": "single", "sz": "4", "color": COLOR_BORDER_HEX},
                bottom={"val": "single", "sz": "4", "color": COLOR_BORDER_HEX},
                left={"val": "single", "sz": "4", "color": COLOR_BORDER_HEX},
                right={"val": "single", "sz": "4", "color": COLOR_BORDER_HEX})
            if col_widths and c_idx < len(col_widths):
                cell.width = Inches(col_widths[c_idx])
    doc.add_paragraph().paragraph_format.space_after = Pt(3)

def render_part1(doc):
    # 审签与版本演进记录
    add_styled_heading(doc, "【文档审签与版本演进记录】", level=1)
    add_p(doc, "本文档作为特变电工股份有限公司（电装集团）能碳数字化双中心（零碳园区集控中心 + 产品碳足迹集采中心）官方产品需求规格说明书，由产品管理部 (PM)、系统架构研发组 (Dev)、质量保障中心 (QA) 及项目总监共同签署生效。")
    
    sign_headers = ["审签角色", "责任人姓名", "部门/岗位", "审签结论", "签署日期"]
    sign_rows = [
        ["PM 负责人", "产品管理部代表", "数字化产品规划部", "通过 (主导航逐层展开/业务闭环)", "2026-09-08"],
        ["系统架构师", "技术架构组代表", "数字化研发中心架构部", "通过 (双数仓分离/双端100%同构)", "2026-09-08"],
        ["QA 组长", "质量保障组代表", "质量保障中心测试部", "通过 (白名单与BVA极限测试矩阵完备)", "2026-09-08"],
        ["合规/安全负责人", "法务合规部代表", "集团合规与信息安全部", "通过 (L0-L4数据脱敏与CBAM出海合规)", "2026-09-08"],
        ["项目总监", "双中心项目总监", "特变电工数字化转型领导小组", "批准作为全生命周期生产基线", "2026-09-08"]
    ]
    add_table_data(doc, sign_headers, sign_rows, [1.2, 1.1, 1.6, 1.8, 1.0])
    
    rev_headers = ["版本", "修订日期", "主要修订内容与动因", "修订人", "审核人"]
    rev_rows = [
        ["v1.1.0", "2026-09-08", "全面升版：补齐全量数据字典、数学公式、字段校验、控制流逻辑与 Gherkin 验收准则", "联合项目组", "项目总监"],
        ["v1.0.0", "2026-09-08", "完成按主导航层级逐层编制，固化 44px 工业表格、客观中立与权威白名单规则", "PM/Dev/QA", "项目总监"],
        ["v0.9.0", "2026-09-05", "输出 PRD 架构大纲与 10 大分卷蓝图", "产品规划组", "技术委员会"]
    ]
    add_table_data(doc, rev_headers, rev_rows, [0.7, 1.0, 3.4, 0.9, 0.7])
    doc.add_page_break()

    # 第一篇
    add_styled_heading(doc, "第一篇：顶层业务架构与标准规范", level=1)
    add_styled_heading(doc, "第 1 章 编制原则与三方协同工作机制", level=2)
    add_p(doc, "特变电工能碳数字化双中心平台承载着集团从传统装备制造迈向全球绿色零碳制造标杆转型的战略重任。本 PRD 彻底消除传统软件开发中需求、研发与测试脱节的弊病，执行 PM、Dev 与 QA 三方闭环机制：\n"
               "1. PM 产品角色：所有需求均以 INVEST 原则分解，通过 Gherkin 语法书写 Given-When-Then 验收准则，明确北极星指标与业务闭环；\n"
               "2. Dev 研发角色：明确双端（暗黑 3000 / 浅色 3001 端口）100% 同构契约，时序数仓（IoT 秒级高频读数）与关系数仓（ERP/MES/BOM）物理隔离；\n"
               "3. QA 测试角色：践行破坏性测试思维与极限边界防护网（EQP/BVA/Chaos），执行权威工序表白名单判定矩阵与客观中立性代码审查。")
    
    add_styled_heading(doc, "第 2 章 业务背景、目标与 6 大用户角色画像矩阵", level=2)
    add_p(doc, "【核心痛点】：全产业链（变压器、电缆、硅基材料等）综合能耗穿透难、基层离线数据填报分散杂乱、出海产品面临欧盟 CBAM 碳关税壁垒。\n"
               "【北极星指标】：万元产值综合能耗下降率（目标年降 3.5%）、关键制造工序能效提升比、出口产品碳足迹认证覆盖率 (100%)、CBAM 关税成本最低化。")
    
    persona_headers = ["编号", "角色名称", "代表岗位", "主导航主要操作路径", "核心业务诉求", "系统权限边界"]
    persona_rows = [
        ["P1", "集团决策层", "董事长/分管副总裁", "集控大屏、碳足迹对外窗口", "掌控全集团综合能耗趋势与国际碳关税合规态势", "全系统只读大盘、战略批示"],
        ["P2", "园区能碳专员", "各基地动力处长/能源主管", "集中监管、能耗能效分析、对标管理", "穿透式排查工序用能跑冒滴漏，错峰用电降本", "所辖基地读写与全量导出"],
        ["P3", "车间填报员", "车间统计员/动力值班员", "基础管理 -> 数据录入工作台", "高密快速录入离线产量、能耗、相册与大事记", "44px 数据表录入/修改/纠错"],
        ["P4", "碳核算工程师", "碳资产部/产品技术部", "实景数据库、碳足迹核算、报告", "展开产品 BOM 树，匹配本土实测因子，导出报告", "LCA 建模、因子库、碳标签"],
        ["P5", "国际关税专家", "国际业务部/报关主管", "CBAM管理(合规/申报模拟/知识库)", "欧盟税号精准映射，测算关税成本并生成 XML", "CBAM 模块全配置与申报包"],
        ["P6", "外部审计机构", "SGS/TÜV/方圆核查员", "第三方认证管理、实景数据库", "复核物料平衡、绿电凭证与碳因子溯源链条", "专有只读通道与原始存证核验"]
    ]
    add_table_data(doc, persona_headers, persona_rows, [0.5, 1.0, 1.2, 1.5, 1.6, 0.9])

    add_styled_heading(doc, "第 3 章 专属工业设计规范 (tbea-industrial-design) 6 大硬性铁律", level=2)
    add_callout(doc,
        "1. 表格行高强制 44px：全系统所有数据表格 <tr> 行高固定为 44px (h-[44px])，垂直居中无抖动；\n"
        "2. 绝对客观中立：严禁任何界面出现主观评价、定性评判与说教词汇（如“表现优异”、“落后单位”、“运行欠佳”等），统一以客观时序对比（同比/环比/基准偏差）自解释呈现；\n"
        "3. 状态自解释：严禁在卡片上增加“图表联动中”、“已选中”等标签，激活态由蓝框高亮 (border-primary ring-2) 自解释；\n"
        "4. 单行干练判空：无工序单位严禁输出大段解释说明，统一单行干练输出：暂无相关工序！；\n"
        "5. 双端 100% 同构：暗黑科技蓝 (3000端口) 与浅色办公商务 (3001端口) 交互、数据、路由完全一致；\n"
        "6. 悬停游标微透蓝：柱状图游标统一为 rgba(56, 189, 248, 0.08)，浅色为 rgba(0, 0, 0, 0.04)，严禁纯白眩光。",
        title="tbea-industrial-design 工业设计硬性红线", is_warn=True)
    doc.add_page_break()
def render_part2_ch4_ch5(doc):
    # 第二篇
    add_styled_heading(doc, "第二篇：【平台一】零碳园区集控中心功能需求规格（逐层拆解）", level=1)
    add_p(doc, "严格对应系统切换至【零碳园区集控中心】时的 6 大一级主导航逐层展开，每个功能点均分配唯一 NAV-ID 稳定锚点，并深度补充全量数据字典、数学模型、控制逻辑与 Gherkin 验收准则。")

    # 第 4 章 集控中心大屏
    add_styled_heading(doc, "第 4 章 一级导航【集控中心大屏】", level=2)
    add_styled_heading(doc, "4.1 全景环幕大屏 (NAV-ZC-SCR-PANORAMA · /zero-carbon/screen)", level=3)
    add_p(doc, "面向特变电工集团高管视察、工信部/发改委绿碳专项验收及海外战略客户参观的高端 1920×1080 矢量等比缩放工业环幕控制台。", bold_prefix="PM 业务场景：")
    add_p(doc, "1. 顶层 HUD 框架：动态集成空气质量 (AQI)、环境温湿度、风向风速与微秒级 NTP 授时时钟；\n"
               "2. 3D 浮雕中国地图：精确点亮特变电工新疆基地、沈阳变压器、衡阳变压器、天津中发、山东鲁缆等生产据点，采用 WebGL 渲染脉冲雷达波纹与飞线潮流；\n"
               "3. 左侧综合能耗与绿电看板：环形呈现集团本年度能碳勋章建设进度（100% 达成率）、重大能碳里程碑大事记、分布式光伏瞬时出力滚动流与园区高清实景轮播；\n"
               "4. 右侧穿透控制台：提供二级公司级联筛选、5 家核心实体工厂胶囊切片 Tab、10 大综合指标环形矩阵 (5×2 排布) 以及一键跳转至 16:9 标准运营中心的交互入口。", bold_prefix="UI 原型布局与组件状态：")
    
    scr_dict_headers = ["字段代码", "字段名称", "数据类型", "工程量纲", "数据来源与频次", "校验与边界约束", "密级"]
    scr_dict_rows = [
        ["total_energy_tce", "集团年度综合能耗", "Decimal(12,2)", "tce (吨标煤)", "多介质表计/日结汇总", "≥ 0.00，非空", "L1"],
        ["unit_output_tce", "万元产值综合能耗", "Decimal(6,4)", "tce/万元", "能耗总量 / 产值，月结", "0.0001 ~ 10.0000", "L1"],
        ["green_ratio", "综合绿电消纳占比", "Decimal(5,2)", "%", "微电网自发 + 绿电交易", "0.00% ~ 100.00%", "L1"],
        ["pv_power_kw", "分布式光伏瞬时出力", "Decimal(8,2)", "kW", "逆变器 SCADA / 秒级", "0.00 ~ 50000.00", "L2"],
        ["storage_soc", "储能电站荷电状态", "Decimal(5,2)", "% (SOC)", "BMS 电池管理系统 / 秒级", "0.00% ~ 100.00%", "L2"],
        ["annual_saved_tce", "本年累计节能量", "Decimal(10,2)", "tce", "节能技改 M&V 计量 / 月度", "≥ 0.00", "L1"],
        ["annual_saved_cost", "本年累计节能效益", "Decimal(10,2)", "万元", "节能量 × 能源价格 / 月度", "≥ 0.00", "L1"],
        ["carbon_intensity", "万元产值碳排放强度", "Decimal(6,4)", "tCO2e/万元", "Scope1+Scope2 / 产值", "≥ 0.0000", "L1"]
    ]
    add_table_data(doc, scr_dict_headers, scr_dict_rows, [1.4, 1.3, 1.0, 0.9, 1.2, 1.2, 0.6])

    add_formula_box(doc,
        formula_str="E_total = ∑ [ E_i × K_i ] ; R_green = ( (E_pv_self + E_green_market) / E_elec_total ) × 100%",
        desc_str="依据 GB/T 2589-2020 计算全厂综合能耗折标煤总量；绿电消纳率严格由园区屋顶光伏自发自用电量与电力交易中心绿电凭证 (GEC) 合并计入分子，总用电量为分母。",
        var_table="E_i: 各能源介质实物消耗量；K_i: 对应能源折标煤系数 (电力当量 0.1229 kgce/kWh, 天然气 1.2143 kgce/m³, 蒸汽 0.1286 kgce/kg)")

    add_gherkin_box(doc,
        feature_name="全景大屏 10 大综合指标联动",
        scenario_name="切换不同二级工厂胶囊 Tab 时数据秒级无损刷新",
        given_str="用户已登录进入 /zero-carbon/screen 页面，大屏右侧处于沈变公司默认视图",
        when_str="用户点击切换至【鲁缆公司】胶囊 Tab",
        then_str="系统在 300ms 内重绘右侧 5×2 指标环形图，数值切换为鲁缆公司指标，且中央 3D 地图视角平滑平移至山东泰安基地，无任何白屏或数据抖动")

    add_styled_heading(doc, "4.2 综合集控大屏 16:9 (NAV-ZC-SCR-169 · /screen/control-center)", level=3)
    add_p(doc, "标准 16:9 比例工业调度级监控视图，专为园区运行值班室定制，集成高压配电一次单线图、微电网电能潮流拓扑、变压器绕组温升红外监测与储能系统热失控预警。", bold_prefix="功能概述：")
    
    ctrl_dict_headers = ["字段代码", "字段名称", "数据类型", "工程量纲", "数据来源与频次", "阈值与告警规则", "密级"]
    ctrl_dict_rows = [
        ["bus_voltage_kv", "10kV母线运行电压", "Decimal(6,2)", "kV", "高压进线 PT / 1秒", "额定 10.0kV，偏差超 ±7% 告警", "L2"],
        ["line_current_a", "主变进线运行电流", "Decimal(6,2)", "A", "高压进线 CT / 1秒", "不得超过 CT 额定过载能力 120%", "L2"],
        ["active_power_kw", "变电所瞬时有功功率", "Decimal(8,2)", "kW", "多功能数字电表 / 1秒", "≥ 0.00，逆流立即切断防倒送", "L2"],
        ["power_factor", "全厂综合功率因数", "Decimal(4,3)", "cosφ", "数字电表 / 1秒", "考核标准 ≥ 0.95，低于0.90力率罚款", "L1"],
        ["grid_freq_hz", "电网运行实时频率", "Decimal(4,2)", "Hz", "电能质量监测仪 / 1秒", "额定 50.00Hz，允许偏差 ±0.20Hz", "L2"],
        ["trans_temp_deg", "变压器顶层油温/绕组温度", "Decimal(5,1)", "°C", "PT100 铂电阻 / 5秒", "油温超 85°C 告警，超 105°C 跳闸", "L2"],
        ["storage_power_kw", "储能 PCS 充放功率", "Decimal(7,2)", "kW", "储能变流器 PCS / 1秒", "正值为放电供厂，负值为充电吸纳", "L2"]
    ]
    add_table_data(doc, ctrl_dict_headers, ctrl_dict_rows, [1.4, 1.4, 1.0, 0.8, 1.2, 1.3, 0.6])

    # 第 5 章 集中监管
    add_styled_heading(doc, "第 5 章 一级导航【集中监管】", level=2)
    
    add_styled_heading(doc, "5.1 指标管控 (NAV-ZC-MON-IND · /zero-carbon/monitor/indicator)", level=3)
    add_p(doc, "作为全集团能碳运行中枢，构建 Mode A（宏观指标卡片矩阵）与 Mode B（深入分析详情内页）双模无损穿透体系，彻底剥离冗余标签，实现纯粹的工业数据自解释。", bold_prefix="PM 架构定位：")
    add_p(doc, "1. 顶层切换：支持【经营单位及项目公司整体指标】、【产品管控指标】与【关键制造工序能耗管控指标】三大核心板块；\n"
               "2. 组织联动：左侧 StandardOrgTree 六级组织树驱动右侧数据联动，支持产业集团、二级公司及车间级下钻；\n"
               "3. Mode B 详情展开：点击任意指标卡片平滑展开 Mode B 详情内页，呈现指标标准定义、分子分母工程物理量、核算公式、仪表点位路径、近 12 个月趋势图与底层水电气汽折标台账。", bold_prefix="UI 原型交互：")

    add_styled_heading(doc, "5.1.1 板块一：经营单位及项目公司整体指标 (10 项核心指标)", level=3)
    
    ind_grp_headers = ["指标代码", "指标中文名称", "单位", "核算数学模型", "分子来源", "分母来源", "密级"]
    ind_grp_rows = [
        ["gm-total-energy", "综合能源消费量", "tce", "E_total = ∑ (E_i × K_i)", "水电气汽等各介质计量表", "国家当量折标系数", "L1"],
        ["gm-unit-output-energy", "万元产值综合能耗", "tce/万元", "e_gdp = (E_total / GDP) × 10000", "综合能源消费量 (tce)", "财务 ERP 月度营业总产值", "L1"],
        ["gm-unit-output-elec", "万元产值电耗", "kWh/万元", "q_elec = (Q_elec / GDP) × 10000", "总用电量 (kWh)", "财务 ERP 月度营业总产值", "L1"],
        ["gm-unit-output-water", "ESG 万元产值水耗", "m³/万元", "q_water = (Q_water / GDP) × 10000", "全厂自来水+地下水总表", "财务 ERP 月度营业总产值", "L1"],
        ["gm-green-energy-ratio", "综合绿电消纳占比", "%", "R_green = (Q_green / Q_total) × 100%", "光伏自用量 + 绿电市场交易量", "全厂总用电量", "L1"],
        ["gm-energy-cost-ratio", "能源消费成本占比", "%", "R_cost = (Cost_energy / Cost_prod) × 100%", "水电气汽总能耗账单金额", "财务系统产品生产制造成本", "L3"],
        ["gm-clean-energy-ratio", "清洁能源替代率", "%", "R_clean = (E_clean / E_total) × 100%", "电力+天然气等清洁能源折标量", "综合能源消费总量", "L1"],
        ["gm-equip-efficiency", "重点设备综合效率", "%", "η_equip = ∑ (η_j × P_rated_j) / ∑ P_rated_j", "设备在线监测有效做功量", "设备在线监测总输入功量", "L2"],
        ["gm-waste-heat-ratio", "余热余压利用率", "%", "R_waste = (Q_recovered / Q_waste_total) × 100%", "余热锅炉/热泵回收蒸汽与热量", "可回收余热余压理论总量", "L2"],
        ["gm-carbon-intensity", "万元产值碳排放强度", "tCO2e/万元", "I_co2 = (E_GHG / GDP) × 10000", "Scope 1 直接 + Scope 2 间接碳排", "财务 ERP 月度营业总产值", "L1"]
    ]
    add_table_data(doc, ind_grp_headers, ind_grp_rows, [1.3, 1.4, 0.7, 1.5, 1.2, 1.1, 0.5])

    add_styled_heading(doc, "5.1.2 板块二：产品管控指标 (5 项产品单位产品能耗指标)", level=3)
    add_p(doc, "【产业分母严格隔离铁律】：\n"
               "1. 变压器产业：分母物理量统一为容量【万kVA】（或千伏安 kVA），单位产品综合能耗单位为【tce/万kVA】或【tce/kVA】；\n"
               "2. 线缆产业：分母物理量统一为导体规格【万km·mm²】（公里×毫米平方），单位产品综合能耗单位为【tce/万km·mm²】；\n"
               "3. QA 防除零拦截：当生产单位月度检修或产量为 0 时，系统后端必须捕获 ZeroDivisionError，前端单耗字段展示“--”，严禁抛出 NaN、Infinity 或引发页面崩溃。", bold_prefix="算法与单位约束：")
    
    prod_ind_headers = ["指标编码", "产品管控指标名称", "变压器产业单位", "线缆产业单位", "核算数学公式", "密级"]
    prod_ind_rows = [
        ["pm-unit-energy", "单位产品综合能耗", "tce/万kVA", "tce/万km·mm²", "e = (E_total_period / M_product_period)", "L1"],
        ["pm-unit-elec", "单位产品电耗", "kWh/kVA", "kWh/km·mm²", "q_elec = (Q_elec_period / M_product_period)", "L1"],
        ["pm-unit-steam", "单位产品蒸汽耗", "GJ/kVA", "GJ/km·mm²", "q_steam = (Q_steam_period / M_product_period)", "L1"],
        ["pm-unit-gas", "单位产品天然气耗", "m³/kVA", "m³/km·mm²", "q_gas = (Q_gas_period / M_product_period)", "L1"],
        ["pm-unit-water", "单位产品水耗", "t/kVA", "t/km·mm²", "q_water = (Q_water_period / M_product_period)", "L1"]
    ]
    add_table_data(doc, prod_ind_headers, prod_ind_rows, [1.2, 1.4, 1.1, 1.2, 1.6, 0.5])

    add_styled_heading(doc, "5.1.3 板块三：关键制造工序能耗管控指标 (47项工序白名单判定)", level=3)
    add_callout(doc,
        "【权威工序白名单判定与单行极简判空规则】\n"
        "依据集团《生产单位与涉及关键工序对应表(1).et》，全集团下属单位划分为两类：\n"
        "1. 实体制造单位（沈变、衡变、新变、鲁缆、新缆、德缆等）：仅展示其业务真实涉及的制造工序（如变压器绕制、铁芯叠装、真空干燥固化；线缆拉丝、绝缘挤出、交联等）；\n"
        "2. 10 家无工序单位（沈变智慧能源、衡变智慧能源、新变智慧能源、鲁缆智慧能源、天池能源管理、科技投资、新能源集控、特变电装总部、进出口贸易、工程建设）：\n"
        "   - 在切换至该类单位时，工序管控区域整行必须精准输出单行干练结论：【暂无相关工序！】；\n"
        "   - 严禁出现空白占位卡片，严禁出现“由于白名单未配置因此无工序...”等主观解释说教文案；\n"
        "   - 状态自解释：激活态仅由边框高亮呈现，严禁在卡片右上角增加“已联动过滤”等过程标签。",
        title="权威工序白名单与客观判空铁律", is_warn=True)

    add_styled_heading(doc, "5.1.4 Mode B 深入分析内页数据字典与台账结构", level=3)
    add_p(doc, "在 Mode B 展开视图中，底部固定渲染【水电气汽四介质折标历史台账表】，表格行高强制固定为 44px (h-[44px])，垂直居中。")
    
    meter_tbl_headers = ["介质分类", "计量表计编码", "安装点位/回路", "起码读数", "止码读数", "倍率", "实物消费量", "折标系数", "折标能耗(tce)"]
    meter_tbl_rows = [
        ["电力 (市电)", "EM-SB-TR01-01", "10kV 1#主变进线柜", "14,250.00", "15,890.00", "80.0", "131,200.00 kWh", "0.1229 kgce/kWh", "16.12"],
        ["电力 (光伏)", "EM-SB-PV01-02", "35kV 厂房屋顶光伏并网点", "8,200.00", "9,150.00", "40.0", "38,000.00 kWh", "0.1229 kgce/kWh", "4.67"],
        ["外购蒸汽", "SM-SB-DRY02", "真空干燥固化车间进汽总管", "1,120.50", "1,265.80", "1.0", "145.30 t", "0.1286 kgce/kg", "18.69"],
        ["天然气", "GM-SB-FURN01", "退火炉燃气调压站出口", "45,210.00", "46,380.00", "1.0", "1,170.00 m³", "1.2143 kgce/m³", "1.42"],
        ["自来水", "WM-SB-MAIN01", "变压器园区市政供水总表", "22,400.00", "22,820.00", "1.0", "420.00 m³", "0.2571 kgce/t", "0.11"]
    ]
    add_table_data(doc, meter_tbl_headers, meter_tbl_rows, [1.0, 1.2, 1.4, 0.8, 0.8, 0.5, 1.1, 1.0, 0.9])

    add_styled_heading(doc, "5.2 用能在线监测 (NAV-ZC-MON-USAGE · /zero-carbon/monitor/online/usage)", level=3)
    add_p(doc, "1. 拓扑树规范：左侧固定采用【园区 ➔ 企业】两级拓扑树，未接入单位纯字体置灰禁用（opacity-35, cursor-not-allowed）；\n"
               "2. 顶部全局控制：支持“日监测”与“跨月区间选择器”（如 2026年01月 至 2026年08月），下方折线图 X 轴随之联动为各月份；\n"
               "3. 能源介质智能自适应与联动替换（双端同构铁律）：\n"
               "   - 选中电力介质（总用电量、市电量、直供绿电）：展示【当日/当月总体峰平谷构成】（尖/峰/平/谷 2×2 微卡片 + 逐时/逐日连续堆叠柱状图）；\n"
               "   - 选中非电介质（水资源、天然气、外购蒸汽、柴油、液氮）：彻底移除峰平谷字样与图表，100% 动态联动替换为【该介质重点工序/车间消耗结构与时段负荷分布】（左侧圆环图，右侧连续采样走势与额定基准对比）；\n"
               "4. 44px 工业高密表格：底部实时台账表格行高强制固定为 44px (h-[44px])，垂直居中。", bold_prefix="功能交互规格：")

    usage_dict_headers = ["字段标识", "字段中文名称", "数据类型", "工程单位", "采集来源", "校验与防错规则", "密级"]
    usage_dict_rows = [
        ["timestamp", "数据采集时间戳", "DateTime", "YYYY-MM-DD HH:mm", "IoT 采集网关时序同步", "非空，不得晚于当前服务器时间", "L2"],
        ["meter_code", "能源计量表计编码", "String(32)", "—", "计量资产档案台账", "字母数字下划线，唯一主键", "L2"],
        ["medium_type", "能源介质类型", "Enum", "电/水/气/汽/油/氮", "介质配置字典", "必须在 6 类受控介质枚举内", "L1"],
        ["val_peak_sharp", "尖峰时段用电量", "Decimal(10,2)", "kWh", "TOU 时段电表寄存器", "≥ 0.00 (非电介质时置空)", "L1"],
        ["val_peak", "高峰时段用电量", "Decimal(10,2)", "kWh", "TOU 时段电表寄存器", "≥ 0.00 (非电介质时置空)", "L1"],
        ["val_flat", "平时段用电量", "Decimal(10,2)", "kWh", "TOU 时段电表寄存器", "≥ 0.00 (非电介质时置空)", "L1"],
        ["val_valley", "低谷时段用电量", "Decimal(10,2)", "kWh", "TOU 时段电表寄存器", "≥ 0.00 (非电介质时置空)", "L1"],
        ["actual_consumption", "实物消耗量", "Decimal(12,2)", "kWh / m³ / t", "止码 - 起码 × 倍率", "≥ 0.00，突增超 200% 告警", "L1"],
        ["tce_consumption", "折标准煤能源量", "Decimal(10,4)", "tce", "实物量 × GB/T 2589系数", "≥ 0.0000", "L1"]
    ]
    add_table_data(doc, usage_dict_headers, usage_dict_rows, [1.3, 1.3, 0.9, 0.9, 1.2, 1.2, 0.5])

    add_gherkin_box(doc,
        feature_name="用能在线监测非电介质智能替换",
        scenario_name="点击非电介质时彻底移除用电峰平谷并替换为工序消耗结构",
        given_str="用户处于用能在线监测页面，当前选中【电力介质】，下方展示尖峰平谷圆环图与堆叠柱状图",
        when_str="用户点击上方介质切换卡片中的【外购蒸汽】",
        then_str="系统彻底卸载峰平谷相关组件与文本，平滑动态替换为左侧重点车间用汽占比圆环图及右侧蒸汽管道压力负荷曲线，0 报错且完全符合双端同构")

    add_styled_heading(doc, "5.3 设备在线监测 (NAV-ZC-MON-EQP · /zero-carbon/monitor/online/equipment)", level=3)
    add_p(doc, "1. 拓扑树规范：左侧展示【企业 ➔ 设备】（全量纳入 23 台电力驱动设备与 9 台热力用能设备），设备节点前置语义图标（Zap/Flame），彻底剥离末尾冗余胶囊徽章；未接入单位字体置灰禁用；\n"
               "2. 核心自适应机制：选中电力设备自动呈现有功功率、累计电量、功率因数与负荷率（环比维度）；选中热力设备自动呈现瞬时蒸汽流量、蒸汽消耗量、供汽压力与供汽温度；\n"
               "3. 客观中立准则：工况对比统一使用时序“环比”（如负荷率环比 +1.8%），严禁出现主观评价文字（如“电能品质优良”等）。原“管道工作压力”统一标准化更名为【蒸汽消耗量】。", bold_prefix="功能交互规则：")

    eqp_dict_headers = ["字段标识", "字段中文名称", "数据类型", "工程单位", "适用设备类型", "计算模型/来源", "密级"]
    eqp_dict_rows = [
        ["real_power_kw", "实时有功功率", "Decimal(8,2)", "kW", "电力设备", "P = √3 × U × I × cosφ / 1s采集", "L2"],
        ["elec_total_kwh", "累计用电量", "Decimal(12,2)", "kWh", "电力设备", "电能表底数累加，每日0点清零日累计", "L1"],
        ["power_factor", "运行功率因数", "Decimal(4,3)", "cosφ", "电力设备", "cosφ = P / S (有功功率 / 视在功率)", "L1"],
        ["load_ratio", "设备负荷率", "Decimal(5,2)", "%", "电力/热力", "Load = (P_actual / P_rated) × 100%", "L1"],
        ["load_mom", "负荷率环比变动", "String(16)", "%", "电力/热力", "MoM = (Load_t - Load_t-1) / Load_t-1", "L1"],
        ["steam_flow_th", "瞬时蒸汽流量", "Decimal(6,2)", "t/h", "热力设备", "涡街/孔板流量计温度压力补偿积算", "L2"],
        ["steam_consumption", "蒸汽消耗量", "Decimal(10,2)", "t", "热力设备", "瞬时流量时间积分累加量", "L1"],
        ["steam_pressure_mpa", "供汽管道工作压力", "Decimal(5,2)", "MPa", "热力设备", "压力变送器 4-20mA 实时遥测", "L2"]
    ]
    add_table_data(doc, eqp_dict_headers, eqp_dict_rows, [1.3, 1.3, 0.9, 0.8, 0.9, 1.4, 0.5])

    add_styled_heading(doc, "5.4 工业微电网与能源碳排放监测", level=3)
    add_p(doc, "1. 工业微电网监测 (NAV-ZC-MON-MICROGRID · /zero-carbon/monitor/online/microgrid)：\n"
               "   - 汇聚屋顶分布式光伏、磷酸铁锂储能系统 (PCS+BMS) 及工业负荷构成交直流混合微电网；\n"
               "   - 核心监控指标：光伏出力曲线 (24h走势)、储能充放电状态 (SOC/SOH/充放功率)、微电网绿电自发自用消纳率 R_micro；\n"
               "   - 防逆流保护：实时计算下级负荷与光伏出力差额，当倒送电网功率 ≥ 10kW 时，微电网控制器毫秒级调节逆变器有功降额；\n"
               "2. 能源碳排放监测 (NAV-ZC-MON-CARBON · /zero-carbon/monitor/carbon)：\n"
               "   - Scope 1 化石燃烧直接排放：监测厂内退火炉天然气、备用发电机柴油等化石燃料燃烧产生的温室气体；\n"
               "   - Scope 2 外购电热间接排放：监测外部电网输入电力及热网外购蒸汽隐含排放；\n"
               "   - 碳减排抵消量：实时计算绿电使用折算的 CO2 减排当量并绘制走势图。", bold_prefix="功能概述：")

    add_formula_box(doc,
        formula_str="E_Scope1 = ∑ [ FC_i × NCV_i × CC_i × OF_i × (44/12) ] ; E_Scope2 = AD_grid × EF_grid + AD_steam × EF_steam",
        desc_str="符合 GB/T 32150-2015 工业企业温室气体排放核算通则。Scope 1 直接由燃料实物量经低位发热量、单位热值含碳量与氧化率滚算；Scope 2 采用生态环境部最新发布的全国电网平均排放因子 (0.5703 tCO2/MWh) 与区域电网因子动态切换。",
        var_table="FC_i: 燃料消耗量；NCV_i: 平均低位发热量；CC_i: 单位热值含碳量；OF_i: 碳氧化率；EF_grid: 电网排放因子")
def render_part2_ch6_ch9(doc):
    # 第 6 章 能耗能效分析
    add_styled_heading(doc, "第 6 章 一级导航【能耗能效分析】", level=2)
    
    add_styled_heading(doc, "6.1 用能结构分析与成本分析", level=3)
    add_p(doc, "1. 用能结构分析 (NAV-ZC-ENG-STRUCT · /zero-carbon/energy/structure)：\n"
               "   - 绘制电、水、气、汽多能互补能量流向桑基图 (Sankey Flow)，量化多级能量转换与输配损失；\n"
               "   - 采用南丁格尔玫瑰图与环形图展示各二级公司用能占比与能源品位分布；\n"
               "2. 能源成本分析 (NAV-ZC-ENG-COST · /zero-carbon/energy/cost)：\n"
               "   - TOU 尖峰平谷分时电费优化模型：核算各车间错峰用电度电综合成本，提供需量申报优化与绿色降本测算；\n"
               "   - 功率因数奖惩电费模型：实时跟踪力率调整电费，避免力调罚款。", bold_prefix="业务模型说明：")

    cost_dict_headers = ["字段标识", "字段中文名称", "数据类型", "工程单位", "计算模型/来源", "密级"]
    cost_dict_rows = [
        ["cost_peak_sharp", "尖峰时段电费", "Decimal(10,2)", "元", "Q_尖 × P_尖 (高电价时段)", "L2"],
        ["cost_peak", "高峰时段电费", "Decimal(10,2)", "元", "Q_峰 × P_峰", "L2"],
        ["cost_flat", "平时段电费", "Decimal(10,2)", "元", "Q_平 × P_平", "L2"],
        ["cost_valley", "低谷时段电费", "Decimal(10,2)", "元", "Q_谷 × P_谷 (低电价谷段)", "L2"],
        ["cost_base", "基本电费", "Decimal(10,2)", "元", "按变压器容量 (元/kVA·月) 或最大需量 (元/kW·月)", "L2"],
        ["cost_pf_adj", "功率因数调整电费", "Decimal(8,2)", "元", "依据国家电力力率调整系数表计算奖惩金额", "L2"],
        ["cost_total_wan", "总用电成本", "Decimal(12,2)", "万元", "∑ 分时电费 + 基本电费 ± 力调电费", "L2"],
        ["avg_elec_price", "综合度电综合单价", "Decimal(6,4)", "元/kWh", "总用能费用 / 总用能实物量", "L2"]
    ]
    add_table_data(doc, cost_dict_headers, cost_dict_rows, [1.3, 1.4, 0.9, 0.8, 2.0, 0.5])

    add_styled_heading(doc, "6.2 单位产品能耗 (NAV-ZC-ENG-PROD · /zero-carbon/energy/unit-product)", level=3)
    add_p(doc, "1. 产业物理分母严格隔离：\n"
               "   - 变压器产业：以【kVA】为基准分母，计算单耗 e = E / M_kVA (tce/kVA)；\n"
               "   - 线缆产业：以【km·mm²】为基准分母，计算单耗 e = E / M_km (tce/km·mm²)；\n"
               "2. 纵向对比原则：各基地与车间仅与自身历史同期（同比）或上期（环比）对比，严禁跨产业或跨厂横向拉踩；\n"
               "3. QA 除零极限拦截：当月度产量为 0 时，系统自动拦截除以零异常，单耗显示“--”，严禁抛出 NaN 或前端白屏崩溃。", bold_prefix="算法与工程规则：")

    prod_dict_headers = ["字段标识", "字段中文名称", "数据类型", "工程单位", "计算规则与防错逻辑", "密级"]
    prod_dict_rows = [
        ["product_id", "产品型号编码", "String(32)", "—", "ERP 物料主数据唯一编码", "L1"],
        ["industry_type", "所属产业分类", "Enum", "变压器/线缆", "严格决定分母物理量量纲", "L0"],
        ["period_output", "当期合格品产量", "Decimal(12,2)", "kVA 或 km·mm²", "MES 报工质检入库总量，若为0单耗置“--”", "L1"],
        ["period_energy_tce", "当期消耗总标煤量", "Decimal(12,4)", "tce", "车间各能源介质按工序分摊折标煤累加", "L1"],
        ["unit_energy_val", "单位产品综合能耗", "Decimal(8,6)", "tce/kVA 或 tce/km·mm²", "period_energy_tce / period_output", "L1"],
        ["yoy_percent", "同比变动率", "Decimal(5,2)", "%", "(本期单耗 - 去年同期) / 去年同期 × 100%", "L1"],
        ["mom_percent", "环比变动率", "Decimal(5,2)", "%", "(本期单耗 - 上月单耗) / 上月单耗 × 100%", "L1"],
        ["benchmark_diff", "与准入基准偏差", "Decimal(8,6)", "tce/单位", "本期单耗 - 国家准入先进值", "L1"]
    ]
    add_table_data(doc, prod_dict_headers, prod_dict_rows, [1.3, 1.3, 0.9, 1.1, 1.8, 0.5])

    add_styled_heading(doc, "6.3 单位产值能耗与对标管理", level=3)
    add_p(doc, "1. 单位产值能耗 (NAV-ZC-ENG-OUTPUT · /zero-carbon/energy/unit-output)：\n"
               "   - 测算万元产值综合能耗（tce/万元）与万元产值水耗（m³/万元）；\n"
               "2. 能效对标管理 (NAV-ZC-ENG-BENCHMARK · /zero-carbon/energy/benchmark)：\n"
               "   - 引入【国家先进值】、【国家准入值】与【特变电工领跑线】三线对标体系；\n"
               "   - 图表悬停游标强制微透科技蓝 rgba(56, 189, 248, 0.08)，浅色为 rgba(0, 0, 0, 0.04)，严禁纯白眩光。", bold_prefix="对标规范：")

    # 第 7 章 零碳项目评估
    add_styled_heading(doc, "第 7 章 一级导航【零碳项目评估】", level=2)
    
    add_styled_heading(doc, "7.1 项目档案、实时监控与节能效益评估", level=3)
    add_p(doc, "1. 项目档案 (NAV-ZC-PRJ-ARCHIVE · /zero-carbon/project/archive)：管理光伏电站、蓄冷蓄热、空压机群控、变频改造等技改工程台账；\n"
               "2. 实时监控 (NAV-ZC-PRJ-MONITOR · /zero-carbon/project/monitoring)：直连技改项目现场 PLC 与电表，监测实时工况；\n"
               "3. 节能效益评估 (NAV-ZC-PRJ-BENEFIT · /zero-carbon/project/benefit)：遵循国际通用 IPMVP 测量与验证 (M&V) 规程，测算节能量、节约费用与动态投资回收期。", bold_prefix="功能模块定义：")

    add_formula_box(doc,
        formula_str="E_saved = ( E_baseline - E_post ) ± △E_adj ; PBP_dynamic = ln( CF / (CF - I_0 × r) ) / ln(1 + r)",
        desc_str="依据国际 IPMVP 规程选项 B/C 建立基线能耗模型，排除气象温湿度与产量波动影响；计算动态投资回收期（考虑资金贴现率 r）。",
        var_table="E_baseline: 基准期调整后能耗；E_post: 改造后实际能耗；△E_adj: 生产工况修正量；I_0: 技改初次投资；CF: 年净节能现金流；r: 贴现率 (基准8%)")

    add_styled_heading(doc, "7.2 零碳工厂自评估 (NAV-ZC-PRJ-SELF · /zero-carbon/project/self)", level=3)
    add_p(doc, "构建三层穿透体系：第 1 层集团大盘雷达与星级分布 ➔ 第 2 层二级公司总分达标率 ➔ 第 3 层工厂 6 大维度 100 分细化考核表：\n"
               "- 评级星级标准：五星级 (≥90分)、四星级 (80~89分)、三星级 (70~79分)、未达标 (<70分)。", bold_prefix="三层评估架构：")

    self_eval_headers = ["评估维度", "标准分值", "核心考评条款与扣分规则", "数据来源与佐证材料"]
    self_eval_rows = [
        ["基础设施", "15 分", "厂房采光天窗采光比、一级能效节能变压器配置率。不达标扣 2 分/项", "基础设施台账、工程竣工图纸"],
        ["能源利用", "30 分", "屋顶分布式光伏消纳率(≥30%)、储能削峰填谷、工业余热余压回收。消纳每低 5% 扣 2 分", "微电网采集数据、绿电交易凭证"],
        ["产品生态", "20 分", "主力产品全生命周期 LCA 碳足迹认证、绿色包装材料使用率。出口产品无碳标签扣 3 分", "ISO 14067 第三方认证证书"],
        ["温室气体", "15 分", "ISO 14064 组织碳盘查报告、年度减排目标达成率。未出具盘查报告扣 5 分", "权威第三方核查声明"],
        ["碳抵消", "10 分", "国家绿色电力证书 (GEC) 批量核销、CCER 碳资产抵消额度。未核销绿证扣 3 分", "国家绿证平台核销证明文件"],
        ["运营管理", "10 分", "ISO 50001 能源管理体系认证、专职能碳工程师岗位。体系未年审扣 3 分", "体系证书、管理制度任命文件"]
    ]
    add_table_data(doc, self_eval_headers, self_eval_rows, [1.1, 0.8, 2.8, 2.0])

    # 第 8 章 统计报表
    add_styled_heading(doc, "第 8 章 一级导航【统计报表】", level=2)
    add_p(doc, "涵盖用能报表 (NAV-ZC-RPT-USAGE)、成本报表 (NAV-ZC-RPT-COST)、单耗报表 (NAV-ZC-RPT-UNIT) 与碳排报表 (NAV-ZC-RPT-CARBON)。\n"
               "1. 44px 强制行高：所有表格 <tr> 高度固定为 44px，垂直居中；\n"
               "2. 产业分类隔离：变压器以 kVA 汇算，线缆以 km·mm² 汇算；\n"
               "3. 防伪动态水印：导出 Excel/PDF 强制注入导出员工号、姓名、操作时间戳与防截屏防篡改哈希校验码。", bold_prefix="功能要求：")

    rpt_dict_headers = ["报表字段", "字段中文名称", "数据类型", "工程单位", "聚合滚算规则", "密级"]
    rpt_dict_rows = [
        ["report_period", "统计周期标签", "String(16)", "日/月/年", "日报按0点截断，月报按自然月自然闭环", "L1"],
        ["org_name", "组织节点名称", "String(64)", "—", "集团/产业/二级公司/车间层级树", "L1"],
        ["elec_consumption", "用电量总计", "Decimal(12,2)", "kWh", "∑ (尖峰 + 高峰 + 平段 + 低谷)", "L1"],
        ["water_consumption", "自来水用量", "Decimal(10,2)", "m³", "市政总表与自备井流量累加", "L1"],
        ["steam_consumption", "外购蒸汽量", "Decimal(10,2)", "t", "车间进汽流量计温压补偿积算", "L1"],
        ["gas_consumption", "天然气消耗量", "Decimal(10,2)", "m³", "燃气调压计量站流量计", "L1"],
        ["total_energy_tce", "折标准煤总能耗", "Decimal(12,4)", "tce", "∑ (各介质消耗量 × 当量折标系数)", "L1"],
        ["total_cost_wan", "综合能源总成本", "Decimal(12,2)", "万元", "∑ (各介质实物量 × 现行能源单价)", "L2"]
    ]
    add_table_data(doc, rpt_dict_headers, rpt_dict_rows, [1.3, 1.3, 0.9, 0.9, 1.8, 0.5])

    # 第 9 章 基础管理
    add_styled_heading(doc, "第 9 章 一级导航【基础管理】", level=2)
    
    add_styled_heading(doc, "9.1 数据录入工作台 (NAV-ZC-CON-ENTRY · /zero-carbon/config/entry)", level=3)
    add_p(doc, "专为车间统计员 (P3) 打造的高效数据录入中枢，解决基层离线生产台账人工录入痛点，按标签页划分 4 大核心工作台：", bold_prefix="PM 业务定位：")

    add_styled_heading(doc, "9.1.1 Tab 1：产品产量录入 (Product Output Entry)", level=3)
    add_p(doc, "1. 布局与跨行合并：同生产单位、同工序的跨行单元格自动合并居中；\n"
               "2. 单位自适应联动：选择变压器产品单位自动锁定为台/kVA；选择线缆自动联动为 km·mm²；\n"
               "3. 防错校验：产量输入必须 ≥ 0，录入负数即时触发 E_VAL_ENERGY_NEGATIVE 阻断。")
    
    entry_prod_headers = ["字段标识", "字段中文名称", "数据类型", "单位", "界面控件", "校验与约束规则", "密级"]
    entry_prod_rows = [
        ["unit_name", "生产单位名称", "Enum", "—", "下拉级联选择器", "必须在六级组织架构有效生产基地内", "L1"],
        ["process_name", "生产涉及工序", "Enum", "—", "下拉级联选择器", "严格受控于《关键工序对应表》白名单", "L1"],
        ["product_category", "产品大类分类", "Enum", "变压器/线缆", "单选 Radio", "决定规格型号联动字典", "L0"],
        ["product_model", "产品规格型号", "String(64)", "—", "文本输入/模糊匹配", "非空，最长 64 字符", "L1"],
        ["output_quantity", "产品产量数值", "Decimal(12,2)", "自适应", "数字输入框 (Number)", "必须 ≥ 0.00，录入负数前端即时拦截", "L1"],
        ["operator_name", "录入填报人员", "String(32)", "—", "系统登录态自动带出", "只读禁用，记录员工真实工号", "L2"],
        ["report_date", "统计核算月份", "Date", "YYYY-MM", "月份选择器 (MonthPicker)", "不可晚于当前月，关账后禁止填报", "L1"]
    ]
    add_table_data(doc, entry_prod_headers, entry_prod_rows, [1.3, 1.2, 0.9, 0.7, 1.2, 1.5, 0.5])

    add_styled_heading(doc, "9.1.2 Tab 2：能源消耗录入 (Energy Consumption Entry)", level=3)
    add_p(doc, "结构与 Tab 1 严格 100% 同构，按电力、水资源、天然气、蒸汽四介质分组合并展示。支持起码、止码输入自动计算实物量，并带非负拦截校验。")

    add_styled_heading(doc, "9.1.3 Tab 3：园区相册维护 与 Tab 4：园区大事记维护", level=3)
    add_p(doc, "1. 园区相册维护：支持各基地实景高清图上传（限制 10MB，JPG/PNG/WEBP），配置相册标题、拍摄日期、展示排序与轮播激活开关；\n"
               "2. 园区大事记维护：时间轴节点式录入里程碑事件（如光伏全容量并网、获批国家级零碳工厂等），支持事件标题、发生日期、详细描述与荣誉徽章配置。", bold_prefix="功能概述：")

    add_styled_heading(doc, "9.2 基础参数配置 (NAV-ZC-CON-PARAM)", level=3)
    add_p(doc, "包含能源价格管理 (NAV-ZC-CON-PRICE) 与折标系数管理 (NAV-ZC-CON-COEFF)。实现峰平谷分时电价阶梯版本化维护与国家标准当量/等价折标系数审计留痕。")
    doc.add_page_break()
def render_part3(doc):
    # 第三篇
    add_styled_heading(doc, "第三篇：【平台二】产品碳足迹集采中心功能需求规格（逐层拆解）", level=1)
    add_p(doc, "严格对应系统切换至【产品碳足迹集采中心】时的 6 大一级主导航逐层展开，全面支撑产品全生命周期 LCA 建模、ISO 14067 认证、二维码数字碳标签与欧盟 CBAM 关税申报。")

    # 第 10 章 对外示范窗口
    add_styled_heading(doc, "第 10 章 一级导航【对外示范窗口】(NAV-CF-DEMO-COCKPIT · /carbon-footprint/cockpit)", level=2)
    add_p(doc, "面向国际客户、海外驻华使节及欧盟碳关税审查专员的高端碳驾驶舱，全屏呈现特变电工主力出口特高压变压器与高端特种电缆 LCA 碳足迹全景桑基图、可交互验证的防伪二维码数字碳标签、全厂绿电消纳减碳量化成果以及欧盟 CBAM 关税节省测算总览。", bold_prefix="功能概述：")
    
    cockpit_headers = ["字段标识", "字段中文名称", "数据类型", "工程单位", "数据来源与核算逻辑", "密级"]
    cockpit_rows = [
        ["product_pcf_co2e", "单台产品全生命周期碳排", "Decimal(10,2)", "kgCO2e/台 或 kgCO2e/km", "LCA 5大阶段排放滚算累加", "L1"],
        ["pcf_raw_ratio", "原材料获取阶段碳排占比", "Decimal(5,2)", "%", "(E_原材料 / E_总碳足迹) × 100%", "L1"],
        ["pcf_manuf_ratio", "制造加工阶段碳排占比", "Decimal(5,2)", "%", "(E_加工 / E_总碳足迹) × 100%", "L1"],
        ["green_elec_offset", "绿电消纳贡献减排量", "Decimal(10,2)", "kgCO2e", "光伏自发自用量 × 区域电网碳因子", "L1"],
        ["cbam_tariff_saved", "CBAM 关税累计节省金额", "Decimal(10,2)", "€ (欧元)", "已抵扣国内碳成本折算节省关税", "L3"],
        ["qr_verify_hash", "防伪数字验真哈希", "String(64)", "SHA-256", "产品批次+认证机构私钥数字签名", "L0"]
    ]
    add_table_data(doc, cockpit_headers, cockpit_rows, [1.4, 1.4, 0.9, 1.1, 1.9, 0.5])

    # 第 11 章 多维分析
    add_styled_heading(doc, "第 11 章 一级导航【多维分析】", level=2)
    add_styled_heading(doc, "11.1 横向对比分析 (NAV-CF-ANA-COMPARE · /carbon-footprint/analysis/compare)", level=3)
    add_p(doc, "支持选择不同生产基地生产的同规格产品（例如沈变厂与衡变厂同型号 220kV 油浸式变压器），按【原材料获取】、【上游运输】、【制造加工】、【试验检测】与【包装出厂】五大阶段进行横向雷达图与柱状图对标，深入挖掘各基地工艺工序降碳潜力。", bold_prefix="业务逻辑：")

    add_styled_heading(doc, "11.2 纵向追溯分析 (NAV-CF-ANA-RANKING · /carbon-footprint/analysis/ranking)", level=3)
    add_p(doc, "支持按批次号追踪同一产品历年碳足迹演变趋势，提供原材料替代（如高磁感取向硅钢片替代传统硅钢）、绿电消纳提升及工艺优化对碳排变动的敏感性归因瀑布图。", bold_prefix="业务逻辑：")

    # 第 12 章 实景数据库与碳足迹核算
    add_styled_heading(doc, "第 12 章 一级导航【实景数据库与碳足迹核算】", level=2)
    
    add_styled_heading(doc, "12.1 工业实景数据库 (NAV-CF-DB-REALSCENE · /carbon-footprint/database/realscene)", level=3)
    add_p(doc, "汇聚硅钢片、电解铜、变压器油、绝缘纸板、结构钢材等重点原材料本土实测碳排放因子图谱。每个物料节点均具备完整的供应链溯源链条、实测检测报告附件与第三方认证声明编号。", bold_prefix="功能概述：")

    add_styled_heading(doc, "12.2 LCA 碳足迹核算引擎 (NAV-CF-DB-ACCOUNTING · /carbon-footprint/database/accounting)", level=3)
    add_p(doc, "1. BOM 层级自动展开：从 ERP/PLM 自动拉取多级产品工程物料清单 (BOM)，计算物料损耗系数 Q_mat = Q_bom × (1 + R_loss)；\n"
               "2. 5 大阶段 LCA 滚算模型：严格依照 ISO 14067 标准执行生命周期评价滚算；\n"
               "3. 工艺能耗分摊：基于工时或产量权重分摊真空干燥、退火炉等公共工序的水电气能耗。", bold_prefix="核心业务逻辑：")

    add_formula_box(doc,
        formula_str="E_PCF = E_raw + E_trans + E_manuf + E_test + E_pack",
        desc_str="全生命周期碳足迹核算涵盖摇篮到大门 (Cradle-to-Gate) 5 大阶段。各阶段严密计算公式如下：\n"
                 "1. 原材料获取：E_raw = ∑ [ M_i × (1 + R_loss_i) × EF_mat_i ]\n"
                 "2. 上游运输：E_trans = ∑ [ M_i × D_i × EF_trans_mode ]\n"
                 "3. 制造加工：E_manuf = ∑ [ (E_process_energy / Batch_Output) × EF_energy ]\n"
                 "4. 试验检测：E_test = ( Q_test_elec / Test_Capacity ) × EF_grid\n"
                 "5. 包装出厂：E_pack = ∑ [ M_pack_k × EF_pack_k ]",
        var_table="M_i: 物料净重 (t)；R_loss_i: 工艺损耗率 (%)；EF_mat_i: 物料实测碳因子 (kgCO2e/kg)；D_i: 运输距离 (km)；EF_trans: 吨公里运输因子")

    pcf_dict_headers = ["字段标识", "字段中文名称", "数据类型", "工程单位", "核算来源与约束规则", "密级"]
    pcf_dict_rows = [
        ["sku_code", "产品唯一物料号", "String(32)", "—", "ERP/PLM 主物料编号，唯一主键", "L1"],
        ["bom_version", "BOM 清单版本号", "String(16)", "—", "工程技术部生效版本，如 REV-C", "L1"],
        ["batch_no", "生产批次流水号", "String(32)", "—", "MES 制造工单流水号", "L2"],
        ["e_raw_total", "原材料阶段碳排", "Decimal(10,2)", "kgCO2e", "∑ (物料重量 × 实测因子)，占比通常超 70%", "L1"],
        ["e_trans_total", "上游运输阶段碳排", "Decimal(8,2)", "kgCO2e", "∑ (吨公里 × 运输工具排放因子)", "L1"],
        ["e_manuf_total", "生产加工阶段碳排", "Decimal(8,2)", "kgCO2e", "制造工序电/汽/气消耗公摊碳排", "L1"],
        ["e_test_total", "试验检测阶段碳排", "Decimal(8,2)", "kgCO2e", "出厂耐压/温升试验用电碳排", "L1"],
        ["e_pack_total", "包装出厂阶段碳排", "Decimal(8,2)", "kgCO2e", "包装箱木材/缠绕膜碳排", "L1"],
        ["pcf_total", "总碳足迹数值", "Decimal(12,2)", "kgCO2e", "5 大阶段排放量严密累加和", "L1"],
        ["calc_status", "核算审批状态", "Enum", "—", "草稿/已提交/认证中/已签发/已归档", "L1"]
    ]
    add_table_data(doc, pcf_dict_headers, pcf_dict_rows, [1.3, 1.3, 0.9, 0.9, 1.8, 0.5])

    add_styled_heading(doc, "12.3 碳足迹报告与数字碳标签 (NAV-CF-DB-REPORT · /carbon-footprint/database/report)", level=3)
    add_p(doc, "1. 双语报告导出：一键导出符合 ISO 14067:2018 规范的双语（中、英文）官方碳足迹核算报告；\n"
               "2. 数字碳标签：生成包含产品唯一 EPC 编码与防伪签名哈希的二维码标签，支持手机扫码穿透查验原材料来源与第三方证书。", bold_prefix="功能概述：")

    # 第 13 章 CBAM管理
    add_styled_heading(doc, "第 13 章 一级导航【CBAM管理】", level=2)
    
    add_styled_heading(doc, "13.1 欧盟合规管理 (NAV-CF-CBAM-COMPLIANCE · /carbon-footprint/cbam/compliance)", level=3)
    add_p(doc, "维护特变电工出口欧盟电气装备海关 CN 税号白名单（变压器 CN 85042100、85042200、85042300；电缆 CN 85444920 等），明确直接排放 (Direct Emissions) 与前驱物隐含间接排放 (Indirect Emissions) 的法定边界。", bold_prefix="合规规则：")

    add_styled_heading(doc, "13.2 关税申报模拟器 (NAV-CF-CBAM-DECLARATION · /carbon-footprint/cbam/declaration)", level=3)
    add_p(doc, "1. 隐含碳强度核算：测算出口单位产品直接与间接隐含碳强度 Embedded_Carbon (tCO2e/t)；\n"
               "2. 欧盟 ETS 实时碳价联动：API 动态对接欧洲能源交易所 (EEX) 碳配额拍卖结算均价（€75 ~ €95/tCO2e）；\n"
               "3. 国内已支付碳成本抵扣：严格计算在国内已承担的全国碳市场配额费用或绿电附加成本，依法申请等额抵扣；\n"
               "4. 官方 XML 申报包导出：生成完全符合欧盟委员会 CBAM Communication Template v2.1 规范的结构化 XML 申报包。", bold_prefix="关税模型：")

    add_formula_box(doc,
        formula_str="Cost_CBAM = [ (Direct_Em + Indirect_Em) / Output ] × Export_Qty × ( Price_EU_ETS - Price_Domestic_Paid )",
        desc_str="符合欧盟正式法规 EU 2023/956 条例。若国内已支付碳成本等于或高于欧盟 ETS 碳价，则当期应缴 CBAM 关税凭证金额为 0（零关税入欧）。",
        var_table="Direct_Em: 工厂直接化石燃烧排放；Indirect_Em: 外购电热及前驱物间接排放；Export_Qty: 出口实物总量；Price_EU_ETS: 欧盟碳价；Price_Domestic: 国内已付碳价")

    cbam_dict_headers = ["字段标识", "字段中文名称", "数据类型", "工程单位", "核算模型与业务规则", "密级"]
    cbam_dict_rows = [
        ["cn_code", "欧盟海关 CN 税号", "String(16)", "—", "欧盟海关税则编码，如 85042100", "L0"],
        ["export_quantity", "申报出口数量", "Decimal(10,2)", "台 / km / t", "国际贸易报关单提单实际数量", "L3"],
        ["direct_em_t", "制造直接排放量", "Decimal(10,2)", "tCO2e", "厂内燃烧直接排放总量", "L2"],
        ["indirect_em_t", "外购电热间接排放量", "Decimal(10,2)", "tCO2e", "外购电力及前驱物隐含间接排放", "L2"],
        ["embedded_carbon", "单位产品隐含碳强度", "Decimal(8,4)", "tCO2e/单位", "(Direct + Indirect) / 总产量", "L2"],
        ["ets_price_eur", "欧盟 ETS 结算碳价", "Decimal(6,2)", "€/tCO2e", "EEX 官方接口实时拉取最新周结算均价", "L0"],
        ["domestic_paid_eur", "国内已付碳成本折算", "Decimal(6,2)", "€/tCO2e", "中国碳市场价格汇率折算 (€)", "L2"],
        ["cbam_certificates", "应缴 CBAM 凭证数", "Decimal(10,2)", "张", "每张对应 1 tCO2e 需清缴凭证", "L3"],
        ["est_tariff_eur", "预计应纳 CBAM 关税", "Decimal(12,2)", "€ (欧元)", "应缴凭证数 × (ETS碳价 - 国内已付成本)", "L3"]
    ]
    add_table_data(doc, cbam_dict_headers, cbam_dict_rows, [1.3, 1.3, 0.9, 0.9, 1.8, 0.5])

    add_styled_heading(doc, "13.3 CBAM 规则知识库 (NAV-CF-CBAM-KNOWLEDGE · /carbon-footprint/cbam/knowledge)", level=3)
    add_p(doc, "集中收录欧盟委员会官方最新发布的行业填报指引、默认值 (Default Values) 清单、过渡期质询问答库与豁免条款法规释义。", bold_prefix="功能概述：")

    # 第 14 章 与 第 15 章
    add_styled_heading(doc, "第 14 章 一级导航【第三方认证管理】(NAV-CF-CERT-MAIN · /carbon-footprint/certification)", level=2)
    add_p(doc, "1. 认证资料维护 (/material)：全套 LCA 计算原始凭证、物料平衡单与绿电发票在线封装；\n"
               "2. 认证申请流转 (/apply)：向 SGS、TÜV 南德、中国方圆等国际认证机构发起协同在线核验；\n"
               "3. 认证证书存证 (/result)：结构化存储证书流水号、颁证机构、有效期限、标准代号与证书 PDF 存证哈希。", bold_prefix="功能概述：")

    add_styled_heading(doc, "第 15 章 一级导航【因子库管理】(NAV-CF-FAC-MAIN · /carbon-footprint/factor)", level=2)
    add_p(doc, "建立 4 大专业子库架构：原材料碳因子库 (/material)、电网碳排放因子库 (/power)、能源活动因子库 (/energy) 与国家折标煤系数库 (/coal)。\n"
               "严格执行【草稿 ➔ 审核中 ➔ 已生效 ➔ 已废止】生命周期管理与变更审计留痕。", bold_prefix="功能概述：")

    fac_dict_headers = ["字段标识", "字段中文名称", "数据类型", "工程单位", "因子取值范围与版本规则", "密级"]
    fac_dict_rows = [
        ["factor_code", "因子唯一编码", "String(32)", "—", "FAC-MAT-COPPER-01 等唯一标识", "L0"],
        ["factor_name", "因子中文名称", "String(64)", "—", "如：高纯阴极铜 (含冶炼)", "L0"],
        ["factor_val", "排放因子数值", "Decimal(10,4)", "kgCO2e/单位", "必须严格 > 0.0000", "L0"],
        ["data_source", "权威数据来源", "String(64)", "—", "实测 / Ecoinvent 3.8 / CLCD / 官方公报", "L0"],
        ["version_no", "因子版本编号", "String(16)", "—", "如 v2026.1，支持多版本并存追溯", "L0"],
        ["valid_start", "版本生效日期", "Date", "YYYY-MM-DD", "生效开始时间戳", "L0"],
        ["status", "生命周期状态", "Enum", "—", "草稿 / 待审 / 生效中 / 历史废止", "L0"]
    ]
    add_table_data(doc, fac_dict_headers, fac_dict_rows, [1.3, 1.4, 0.9, 1.0, 1.6, 0.5])
    doc.add_page_break()
def render_part4(doc):
    # 第四篇
    add_styled_heading(doc, "第四篇：系统底座、接口契约与 QA 质量验收", level=1)

    add_styled_heading(doc, "第 16 章 六级组织架构与穿透鉴权体系", level=2)
    add_p(doc, "系统严格执行【特变电工集团 ➔ 产业集团 ➔ 二级公司 ➔ 生产园区 ➔ 制造车间 ➔ 用能设备】六级穿透鉴权与数据物理隔离。上级节点通过物化视图自动聚合下级指标，下级节点严格隔离，越权请求触发 E_AUTH_RBAC_FORBIDDEN。", bold_prefix="架构规范：")

    add_styled_heading(doc, "第 17 章 外部系统集成与 API 契约 (OpenAPI 3.0 & IoT)", level=2)
    add_p(doc, "1. IoT 物联采集网关：通过 Modbus-TCP / MQTT 协议实现全厂数千台数字电表、变送器秒级遥测高频采集，写入分布式时序数据库 (InfluxDB/TDengine)；\n"
               "2. 企业 ERP/MES 集成：基于 OpenAPI 3.0 契约，自动定时同步产品批次 BOM 清单、实际报工产量工时及财务电费账单。", bold_prefix="接口协议：")

    add_styled_heading(doc, "第 18 章 质量保障体系与全量验收测试用例矩阵 (QA Matrix)", level=2)
    qa_headers = ["用例编号", "验证要点", "测试输入与方法", "期望输出与验收指标", "阻断级别"]
    qa_rows = [
        ["TC-01", "44px 工业表格行高", "CSS 样式扫描 + 像素检查", "全站所有 <tr> 固定为 h-[44px]，垂直居中无抖动", "阻断 (Red-Line)"],
        ["TC-02", "双端 100% 同构", "自动化对标双端 76 路由", "暗黑端(3000)与浅色端(3001)功能、图表与样式 100% 一致", "阻断 (Red-Line)"],
        ["TC-03", "工序白名单判空", "选择沈变/鲁缆智慧能源等无工序单位", "工序区域整行仅输出单行“暂无相关工序！”，无大段说教", "阻断 (Red-Line)"],
        ["TC-04", "客观中立性纯洁度", "全系统文字定性词正则扫描", "零主观定性词汇（“表现优异/运行欠佳/落后单位”等）", "阻断 (Red-Line)"],
        ["TC-05", "极限除零边界防御", "BVA 极限输入月度产量 M = 0", "自动拦截除以零异常，单耗显示“--”，严禁出现 NaN 或白屏", "阻断 (Red-Line)"],
        ["TC-06", "数据录入并发防刷", "100ms 内快速连续点击提交 3 次", "Token 幂等拦截，仅首笔入库，提示防刷，防止重复记账", "阻断 (Red-Line)"],
        ["TC-07", "非负防错校验", "录入工作台输入产量为 -500 kVA", "前端即时拦截并红框高亮，禁止发送请求", "阻断 (Red-Line)"],
        ["TC-08", "网络故障降级容灾", "断网混沌工程故障注入", "优雅提示网络连接异常，恢复后支持一键重试刷新", "高优先级"]
    ]
    add_table_data(doc, qa_headers, qa_rows, [0.8, 1.4, 1.6, 2.1, 0.8])
    doc.add_page_break()

def render_part5_and_appendices(doc):
    # 第五篇
    add_styled_heading(doc, "第五篇：工程治理、状态机与合规保障体系 (v1.1.0 补强专篇)", level=1)

    # 第 19 章 数据治理与商密合规
    add_styled_heading(doc, "第 19 章 数据治理与商密合规 (Data Governance & Confidentiality)", level=2)
    add_p(doc, "依据大型央国企商密规范与海外出海安全条例，建立严格的 L0~L4 数据分级、脱敏与审计留痕机制：")
    
    data_class_headers = ["级别标签", "密级名称", "典型业务字段", "展示脱敏规则", "导出与存储处理要求"]
    data_class_rows = [
        ["L0", "公开 (PUBLIC)", "国家行业能耗先进值、国家准入值、折标煤系数", "明文正常展示", "允许对外发布与公开引用"],
        ["L1", "内部 (INTERNAL)", "各基地万元产值能耗、单位产品单耗、绿电消纳率", "全集团统一内网展示", "仅限特变电工内部网络访问与流转"],
        ["L2", "敏感 (SENSITIVE)", "重点设备编码、车间统计员手机号、采集表计 UUID", "手机号保留前3后4，UUID保留尾4位", "访问审计留痕，导出带工号动态水印"],
        ["L3", "商密 (CONFIDENTIAL)", "变压器工艺配方、月度电费金额、CBAM 申报底表", "电费四舍五入到万元，CBAM底表仅P5/PM可见", "落盘AES-256加密存储，操作链式Hash留痕"],
        ["L4", "绝密 (TOP_SECRET)", "集团双碳战略投资路线图、上市公司核心能耗决算", "高管双重鉴权展示，强制显式全屏防截屏水印", "仅P1集团决策层授权访问，双人签批导出"]
    ]
    add_table_data(doc, data_class_headers, data_class_rows, [0.6, 1.1, 1.7, 1.6, 1.7])
    
    add_p(doc, "【数据法定保留与销毁期限】：\n"
               "1. 工业时序遥测数据：在线存储 ≥ 3 年，冷归档存储 ≥ 10 年；\n"
               "2. 财务电费与用能台账：法定保留 ≥ 10 年，到期按国家档案法规销毁；\n"
               "3. 欧盟 CBAM 申报底表：法定保留 ≥ 10 年（欧盟海关追溯要求）；\n"
               "4. LCA 碳足迹报告与认证声明：永久留底，严禁销毁。")

    # 第 20 章 关键业务长流程状态机图谱
    add_styled_heading(doc, "第 20 章 关键业务长流程状态机图谱 (Business State Machines)", level=2)
    add_p(doc, "为全系统长流程、跨角色、涉及审批与回退的业务节点定义标准化状态流转机制：")
    
    sm_headers = ["业务流程名称", "全生命周期状态流转链", "可触发动作与角色边界", "异常回退策略"]
    sm_rows = [
        ["LCA 碳足迹核算", "草稿 (DRAFT) ➔ 送审 (SUBMITTED) ➔ 认证中 (CERTIFYING) ➔ 已认证 (CERTIFIED) ➔ 已发布 (PUBLISHED) ➔ 已归档 (ARCHIVED)", "草稿仅 P4 自身编辑；送审后锁定；认证中第三方介入；发布需 P4+PM 联合签字", "机构退回时状态回退至“草稿”，释放编辑锁并记录退回意见"],
        ["CBAM 关税申报", "模拟测算 (SIMULATING) ➔ 待审 (PENDING_REVIEW) ➔ 已提交 (SUBMITTED) ➔ 海关反馈 (CUSTOMS_FEEDBACK) ➔ 已归档 (ARCHIVED)", "模拟仅 P5 可触发；提交必须经 P5 报关专家与 P1 集团决策层双重电子签章", "海关质询时转入“海关反馈”，补正后重新提交并生成新修订流水号"],
        ["节能效益评估", "项目立项 (REGISTERED) ➔ 建设施工 (CONSTRUCTING) ➔ 并网试运行 (TRIAL_RUN) ➔ 稳定运行 (STABLE) ➔ 已完结 (CLOSED)", "并网试运行需满足 90 天 M&V 连续采数，验收通过方可流转至“稳定运行”", "年度复评未达标时转入“整改 (RECTIFICATION)”，整改完毕复核转回"],
        ["基层数据填报", "空白 (BLANK) ➔ 录入中 (EDITING) ➔ 已暂存 (SAVED) ➔ 已提交 (SUBMITTED) ➔ 已入账 (POSTED) ➔ 锁账 (LOCKED)", "车间统计员 (P3) 录入暂存；动力处长审核提交；月度终了财务关账后状态变为“锁账”", "审核驳回时退回至“已暂存”，入账后如需纠错须走特批反冲审批流程"]
    ]
    add_table_data(doc, sm_headers, sm_rows, [1.1, 2.3, 2.0, 1.3])

    # 第 21 章 术语表与缩略语
    add_styled_heading(doc, "第 21 章 术语表与缩略语大全 (Glossary & Abbreviations)", level=2)
    term_headers = ["术语/缩写", "英文全称", "工业/业务释义", "PRD 关联章节"]
    term_rows = [
        ["PRD", "Product Requirements Document", "产品需求规格说明书，最高研发与交付契约", "全文"],
        ["CBAM", "Carbon Border Adjustment Mechanism", "欧盟碳边境调节机制（碳关税），2026年正式开征", "第 13 章"],
        ["ETS", "Emissions Trading System", "欧盟碳排放交易体系，碳配额实时拍卖价格", "第 13 章"],
        ["LCA", "Life Cycle Assessment", "生命周期评价（涵盖原材料、制造、运输、使用、废弃）", "第 12 章"],
        ["BOM", "Bill of Materials", "产品物料清单，碳足迹核算层级分解的基础输入", "第 12 章"],
        ["SCADA", "Supervisory Control and Data Acquisition", "数据采集与监视控制系统，变配电秒级遥测来源", "第 5、17 章"],
        ["MQTT", "Message Queuing Telemetry Transport", "轻量级物联网消息发布订阅协议，传感器上报标准", "第 17 章"],
        ["M&V", "Measurement and Verification", "节能量测量与验证（遵循国际通用 IPMVP 规程）", "第 7 章"],
        ["kgce / tce", "kilogram / ton of coal equivalent", "千克标准煤 / 吨标准煤，我国通用综合能源计量单位", "第 5、6、8 章"],
        ["Scope 1", "Direct GHG Emissions", "范围一：企业拥有或控制的排放源燃烧化石燃料的直接排放", "第 5 章"],
        ["Scope 2", "Electricity Indirect GHG Emissions", "范围二：外购电力、热力或蒸汽消费导致的间接温室气体排放", "第 5 章"],
        ["Scope 3", "Other Indirect GHG Emissions", "范围三：企业价值链上下游所有其他间接排放（采购、外协等）", "第 12 章"],
        ["EQP / BVA", "Equivalence Partitioning / Boundary Value Analysis", "等价类划分与边界值分析，QA 极限测试方法论", "第 18 章"],
        ["RACI", "Responsible / Accountable / Consulted / Informed", "责任分配矩阵，明确各项决策的唯一最终责任人", "第 23 章"]
    ]
    add_table_data(doc, term_headers, term_rows, [1.0, 1.8, 2.7, 1.2])

    # 第 22 章 标准化错误码字典
    add_styled_heading(doc, "第 22 章 标准化错误码字典与异常分级 (Error Code Catalog)", level=2)
    add_p(doc, "全平台执行统一规范格式：E_<DOMAIN>_<MODULE>_<REASON>[_<SUFFIX>]，分划 P0 系统级、P1 业务级、P2 提示级、P3 信息级四大级别：")
    
    err_headers = ["标准错误码", "HTTP状态", "级别", "触发业务场景", "前端交互与后端处理建议"]
    err_rows = [
        ["E_VAL_ENERGY_NEGATIVE", "400", "P2", "车间能源消耗或产品产量录入负数", "输入框即时红框高亮，拦截表单提交，提示请输入非负数"],
        ["E_VAL_MON_KVA_ZERO", "400", "P2", "测算单位产品能耗时分母产量录入为零", "拦截除零运算，单耗显示为“--”，提示无生产批次"],
        ["E_CALC_UNIT_DIV_ZERO_SOFT", "200", "P3", "图表渲染遭遇除以零异常", "前端软降级显示“--”，严禁出现 NaN 或页面崩溃"],
        ["E_IO_MQTT_TIMEOUT", "504", "P1", "微电网或设备采集网关超过 5 秒未响应", "图表展示最近一次缓存读数并打上“数据延迟”微标签"],
        ["E_AUTH_RBAC_FORBIDDEN", "403", "P1", "非授权角色（如P3）试图访问CBAM底表", "拦截操作，展示无权访问提示并记录越权审计日志"],
        ["E_EXT_ETS_PRICE_STALE", "200", "P2", "CBAM 模拟时欧盟 ETS 价格超 24h 未更新", "测算结果上方以黄色提示框注明碳价滞后，提供手动拉取按钮"],
        ["E_SYS_DB_CONN_LOST", "503", "P0", "时序数仓或业务主库连接中断", "双中心自动切换至只读备灾集群，触发 PagerDuty 报警"],
        ["E_QM_WHITE_LIST_MISS", "200", "P3", "选中企业在关键工序对应表无映射工序", "单行干练输出：暂无相关工序！，无空白卡片与说教文案"]
    ]
    add_table_data(doc, err_headers, err_rows, [1.6, 0.7, 0.5, 1.8, 2.1])

    # 第 23 章 RACI 责任矩阵
    add_styled_heading(doc, "第 23 章 决策治理 RACI 责任矩阵", level=2)
    add_p(doc, "明确关键决策点单一 A (Accountable 唯一最终责任人)，杜绝职责推诿：")
    
    raci_headers = ["核心决策事项", "P1 集团", "P4 碳专员", "P5 报关", "PM", "Dev", "QA", "法务"]
    raci_rows = [
        ["北极星指标与业务范围定义", "A", "C", "C", "R", "C", "C", "I"],
        ["LCA 碳足迹报告正式对外签发", "I", "A", "C", "R", "C", "C", "C"],
        ["欧盟 CBAM 申报数据包终审报送", "I", "C", "A", "R", "C", "C", "A"],
        ["月度基层数据关账与反冲审批", "I", "—", "—", "A", "R", "C", "I"],
        ["统一错误码与 API 契约变更", "I", "C", "C", "A", "R", "C", "I"],
        ["tbea-industrial-design 铁律修订", "I", "I", "I", "C", "A", "R", "I"],
        ["权威工序白名单判定扩展", "I", "—", "—", "C", "R", "A", "I"]
    ]
    add_table_data(doc, raci_headers, raci_rows, [1.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.8])

    # 第 24 章 Skill 依赖契约与降级策略
    add_styled_heading(doc, "第 24 章 Skill 依赖契约与降级策略", level=2)
    add_p(doc, "1. 强制硬依赖：tbea-industrial-design（44px表格/客观中立/状态自解释/单行判空/微透蓝游标/双端同构），缺失时系统与 Agent 必须显式阻断并拒绝出稿；\n"
               "2. 软依赖优雅降级：tbea-data-dictionary、tbea-qa-destructive-testing、tbea-domain-glossary 缺失时，自动启用本文档内联标准规范平滑继续执行，并在文档头部打上 [FALLBACK] 降级标识。")

    # 附录 A
    add_styled_heading(doc, "附录 A：现行国标 / 行标 / 欧标 法规映射表", level=2)
    std_headers = ["标准代号", "标准名称", "工程适用范围", "PRD 关联章节"]
    std_rows = [
        ["GB/T 2589-2020", "综合能耗计算通则", "全平台能耗折算、折标煤系数库", "第 3、5、6、8 章"],
        ["GB 17167-2006", "用能单位能源计量器具配备和管理通则", "重点用能设备表计配备、物联点位布设", "第 5、17 章"],
        ["GB/T 32150-2015", "工业企业温室气体排放核算和报告通则", "Scope 1 直接化石燃烧 + Scope 2 外购电热测算", "第 5 章"],
        ["ISO 14067:2018", "温室气体 产品碳足迹 量化要求和指南", "变压器/线缆生命周期评价与双语报告导出", "第 12 章"],
        ["ISO 14064-1:2018", "组织层次上温室气体排放清单编制指南", "零碳园区全景碳盘查与减排抵消量核算", "第 5 章"],
        ["ISO 50001:2018", "能源管理体系 要求及使用指南", "零碳工厂自评估运营管理考核维度", "第 7 章"],
        ["EU CBAM 2023/956", "欧盟碳边境调节机制正式条例", "欧盟海关税号映射、前驱物测算、XML导出", "第 13 章"],
        ["EU ETS 2003/87/EC", "欧盟温室气体排放配额交易体系指令", "CBAM 关税扣减测算联动实时 ETS 碳价", "第 13 章"]
    ]
    add_table_data(doc, std_headers, std_rows, [1.3, 2.2, 2.0, 1.2])

    # 附录 B
    add_styled_heading(doc, "附录 B：反模式与反例对照治理清单", level=2)
    anti_headers = ["反模式类别", "典型错误反例 (严禁使用)", "工业级标准正例 (强制执行)"]
    anti_rows = [
        ["主观定性评价", "该车间电能品质优良，运行表现极为欠佳，处于落后单位", "功率因数 0.96，负荷率 68.5%，万元产值能耗同比 +5.2% ↑"],
        ["说教指责建议", "沈变厂处于领跑标杆；鲁缆公司能效偏低，需限期推进技改", "客观绘制行业先进基准虚线与集团历史平均线，数据位置自解释"],
        ["模糊状态标签", "卡片右上角显示“已选中”、“图表正在联动中，请稍候”", "卡片边框高亮 (border-primary ring-2) 自解释，右上角纯留白"],
        ["大段解释判空", "未查到相关工序数据，请核对生产单位白名单配置或联系管理员", "单行干练输出：暂无相关工序！"],
        ["负数非法吞没", "录入 -500 kVA 产量前端静默通过或存入负数", "触发 E_VAL_ENERGY_NEGATIVE，输入框红框拦截并提示请输入非负数"]
    ]
    add_table_data(doc, anti_headers, anti_rows, [1.2, 2.6, 2.9])

def build_full_prd():
    print("正在生成特变电工能碳数字化双中心全景深度 PRD 详案 Word 文档 (v1.1.0)...")
    doc = docx.Document()
    
    for s in doc.sections:
        s.top_margin = Inches(0.85)
        s.bottom_margin = Inches(0.85)
        s.left_margin = Inches(0.85)
        s.right_margin = Inches(0.85)
        
    add_header_footer(doc)
    add_cover(doc)
    
    render_part1(doc)
    render_part2_ch4_ch5(doc)
    render_part2_ch6_ch9(doc)
    render_part3(doc)
    render_part4(doc)
    render_part5_and_appendices(doc)
    
    try:
        doc.save(OUTPUT_FILE)
        print(f"特变电工 PRD 全景详案 Word 文档构建成功：{OUTPUT_FILE}")
        return OUTPUT_FILE
    except PermissionError:
        print(f"文件被占用，尝试保存至备用文件：{FALLBACK_FILE}")
        doc.save(FALLBACK_FILE)
        print(f"特变电工 PRD 全景详案 Word 文档已保存至备用路径：{FALLBACK_FILE}")
        return FALLBACK_FILE

if __name__ == "__main__":
    build_full_prd()