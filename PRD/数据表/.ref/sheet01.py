# -*- coding: utf-8 -*-
"""sheet 01-说明与查询 的内容构建（被 build2.py 调用）"""
from openpyxl.utils import get_column_letter
from xl_style import *  # noqa

NROW = 337          # 02 表数据最后一行（334 行数据，表头在第 3 行）

# 指标速查区属性 → 03-指标清单列号（A=1 ... S=19）
IATTRS = [("指标编码", 1), ("指标名称", 2), ("指标体系", 3), ("所属中心", 4),
          ("指标层级", 5), ("规范计算公式（按参数编码）", 7),
          ("最小颗粒度输入项", 8), ("指标单位", 10), ("指标来源", 12),
          ("依赖基础参数", 17), ("开发实现要点", 18),
          ("▶ 参数构成（细分项）", 19)]


def build(ws, params, inds, pcols_note):
    from openpyxl.styles import Font, PatternFill, Alignment
    set_widths(ws, [26, 96, 16, 16, 16, 12, 12, 12])

    title_row(ws, 1, 8, "「双中心」项目能碳管控平台 · 基础参数与指标字典 V2.2",
              "指标参数构成展开版　|　数据来源：《“双中心”项目能碳管控指标体系（9.16）V1.7》、"
              "《“双中心”数据需求清单9.16》、《“双中心”数据需求清单V1.0 (8.27)》　|　"
              "适用范围：电装零碳集控中心 + 产品碳足迹集采中心")

    # ------------------------------------------------ 一、参数速查
    r = 4
    ws.cell(r, 1, "【一】参数 / 数据项速查").font = Font(name="微软雅黑", size=12, bold=True, color=C_HEAD)
    r += 1
    ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=8)
    c = ws.cell(r, 1, "在下方黄色单元格输入【参数编码】或【参数名称】（点右侧下拉可选取全部 %d 项），"
                      "下方自动返回数据说明、来源、格式等全部属性；"
                      "若该参数是复合参数（如「综合能源消费量」），还会返回它由哪些分项折算而来。" % len(params))
    c.font = F_SMALL
    c.fill = FILL_TIP
    c.alignment = AL_LEFT_C
    ws.row_dimensions[r].height = 20

    in_r = r + 1
    ws.cell(in_r, 1, "① 输入参数编码 / 名称").font = F_BODY_B
    ws.merge_cells(start_row=in_r, start_column=2, end_row=in_r, end_column=4)
    t = ws.cell(in_r, 2, "EN-KE46")
    t.font = Font(name="Consolas", size=11, bold=True, color="7F3F00")
    t.fill = PatternFill("solid", fgColor="FFE699")
    t.alignment = AL_LEFT_C
    ws.row_dimensions[in_r].height = 22

    m_r = in_r + 1
    ws.cell(m_r, 1, "② 匹配行号（辅助列）").font = F_SMALL
    ws.merge_cells(start_row=m_r, start_column=2, end_row=m_r, end_column=4)
    f = ('=IF($B$%d="","",IFERROR(MATCH($B$%d,\'02-基础参数表\'!$B:$B,0),'
         'IFERROR(MATCH($B$%d,\'02-基础参数表\'!$C:$C,0),"")))' % (in_r, in_r, in_r))
    ws.cell(m_r, 2, f).font = F_SMALL
    ws.cell(m_r, 2).fill = FILL_CALC

    hr = m_r + 2
    header_row(ws, hr, ["属性", "取值", "", "", "", "", "", ""], height=22)
    ws.merge_cells(start_row=hr, start_column=2, end_row=hr, end_column=8)

    attrs = pcols_note      # [(属性名, 在 B:X 中的位置)]
    first = hr + 1
    for i, (nm, pos) in enumerate(attrs):
        rr = first + i
        a = ws.cell(rr, 1, nm)
        a.font = F_BODY_B
        a.border = BORDER
        a.alignment = AL_LEFT_C
        ws.merge_cells(start_row=rr, start_column=2, end_row=rr, end_column=8)
        b = ws.cell(rr, 2,
                    '=IF($B$%d="","",IFERROR(INDEX(\'02-基础参数表\'!$B:$Y,$B$%d,%d),""))'
                    % (m_r, m_r, pos))
        b.font = F_SMALL if pos == 22 else F_BODY
        b.border = BORDER
        b.alignment = AL_WRAP if pos in (9, 16, 17, 22, 23, 24) else AL_LEFT_C
        if pos in (3, 10, 11, 12, 16, 17, 18, 20, 22):
            b.fill = FILL_CALC
        ws.row_dimensions[rr].height = 42 if pos in (9, 22, 24) else (
            30 if pos in (16, 17, 23) else 18)

    # ------------------------------------------------ 二、指标速查
    r = first + len(attrs) + 1
    ws.cell(r, 1, "【二】指标速查").font = Font(name="微软雅黑", size=12, bold=True, color=C_HEAD)
    r += 1
    ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=8)
    c = ws.cell(r, 1, "输入【指标编码】或【指标名称】，自动返回该指标的规范计算公式、所需的最小颗粒度数据项编码，"
                      "以及构成该指标的全部参数细分项（分子 / 分母 / 加项 / 扣减项），可直接据此取数。")
    c.font = F_SMALL
    c.fill = FILL_TIP
    c.alignment = AL_LEFT_C
    ws.row_dimensions[r].height = 20

    i_in = r + 1
    ws.cell(i_in, 1, "① 输入指标编码 / 名称").font = F_BODY_B
    ws.merge_cells(start_row=i_in, start_column=2, end_row=i_in, end_column=4)
    t = ws.cell(i_in, 2, "IND-017")
    t.font = Font(name="Consolas", size=11, bold=True, color="7F3F00")
    t.fill = PatternFill("solid", fgColor="FFE699")
    t.alignment = AL_LEFT_C
    ws.row_dimensions[i_in].height = 22

    i_m = i_in + 1
    ws.cell(i_m, 1, "② 匹配行号（辅助列）").font = F_SMALL
    ws.merge_cells(start_row=i_m, start_column=2, end_row=i_m, end_column=4)
    f = ('=IF($B$%d="","",IFERROR(MATCH($B$%d,\'03-指标清单\'!$A:$A,0),'
         'IFERROR(MATCH($B$%d,\'03-指标清单\'!$B:$B,0),"")))' % (i_in, i_in, i_in))
    ws.cell(i_m, 2, f).font = F_SMALL
    ws.cell(i_m, 2).fill = FILL_CALC

    i_hr = i_m + 2
    header_row(ws, i_hr, ["属性", "取值", "", "", "", "", "", ""], height=22)
    ws.merge_cells(start_row=i_hr, start_column=2, end_row=i_hr, end_column=8)

    # 03-指标清单 列位置（A=1 ... S=19）
    iattrs = IATTRS
    i_first = i_hr + 1
    for i, (nm, pos) in enumerate(iattrs):
        rr = i_first + i
        a = ws.cell(rr, 1, nm)
        a.font = F_BODY_B
        a.border = BORDER
        a.alignment = AL_LEFT_C
        ws.merge_cells(start_row=rr, start_column=2, end_row=rr, end_column=8)
        b = ws.cell(rr, 2,
                    '=IF($B$%d="","",IFERROR(INDEX(\'03-指标清单\'!$A:$S,$B$%d,%d),""))'
                    % (i_m, i_m, pos))
        b.font = F_SMALL if pos == 19 else (F_MONO if pos in (7, 8, 17) else F_BODY)
        b.border = BORDER
        b.alignment = AL_WRAP if pos in (8, 17, 18, 19) else AL_LEFT_C
        if pos in (7, 8, 17, 19):
            b.fill = FILL_CALC
        ws.row_dimensions[rr].height = 54 if pos == 19 else (40 if pos in (8, 18, 17) else 18)

    return {"end": i_first + len(iattrs), "p_in": in_r, "p_m": m_r,
            "i_in": i_in, "i_m": i_m, "p_first": first, "i_first": i_first}
