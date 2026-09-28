# -*- coding: utf-8 -*-
"""xlsx 样式与写入工具（浅色主题，打印友好）"""
import re
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# ---------------- 配色（浅色主题）
C_HEAD = "1F4E79"      # 表头深蓝
C_HEAD2 = "2E75B6"     # 次级表头
C_TITLE = "0F3A5F"
C_BAND = "F2F7FC"      # 隔行
C_TIP = "FFF4E5"       # 提示底
C_CALC = "EAF3E9"      # 计算格
C_NOTE = "F5F5F5"

G_PUB = "E8EEF5"       # 公共参数
G_SUPP = "DEEBF7"      # 既有域补充（V2.1）
G_ZC = "FCE9F1"        # 集控中心数据域（V2.1）
G_PROD = "FDF0E3"      # 产品级
G_PROC = "E9F5EC"      # 工序级
G_IND = "F0EAF8"       # 指标

F_TITLE = Font(name="微软雅黑", size=15, bold=True, color=C_TITLE)
F_SUB = Font(name="微软雅黑", size=10.5, color="555555")
F_HEAD = Font(name="微软雅黑", size=10, bold=True, color="FFFFFF")
F_BODY = Font(name="微软雅黑", size=9.5, color="222222")
F_BODY_B = Font(name="微软雅黑", size=9.5, bold=True, color="1F4E79")
F_MONO = Font(name="Consolas", size=9.5, color="1F4E79")
F_SMALL = Font(name="微软雅黑", size=9, color="666666")

FILL_HEAD = PatternFill("solid", fgColor=C_HEAD)
FILL_HEAD2 = PatternFill("solid", fgColor=C_HEAD2)
FILL_BAND = PatternFill("solid", fgColor=C_BAND)
FILL_TIP = PatternFill("solid", fgColor=C_TIP)
FILL_CALC = PatternFill("solid", fgColor=C_CALC)
FILL_PUB = PatternFill("solid", fgColor=G_PUB)
FILL_SUPP = PatternFill("solid", fgColor=G_SUPP)
FILL_ZC = PatternFill("solid", fgColor=G_ZC)
FILL_PROD = PatternFill("solid", fgColor=G_PROD)
FILL_PROC = PatternFill("solid", fgColor=G_PROC)
FILL_IND = PatternFill("solid", fgColor=G_IND)

THIN = Side(style="thin", color="BFCEDD")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)

AL_WRAP = Alignment(horizontal="left", vertical="top", wrap_text=True)
AL_CTR = Alignment(horizontal="center", vertical="center", wrap_text=True)
AL_CTR_T = Alignment(horizontal="center", vertical="top", wrap_text=True)
AL_LEFT_C = Alignment(horizontal="left", vertical="center", wrap_text=True)


def set_widths(ws, widths):
    for i, w in enumerate(widths, start=1):
        ws.column_dimensions[get_column_letter(i)].width = w


def title_row(ws, row, ncols, text, sub=None):
    ws.merge_cells(start_row=row, start_column=1, end_row=row, end_column=ncols)
    c = ws.cell(row, 1, text)
    c.font = F_TITLE
    c.alignment = Alignment(horizontal="left", vertical="center")
    ws.row_dimensions[row].height = 30
    if sub:
        ws.merge_cells(start_row=row + 1, start_column=1, end_row=row + 1, end_column=ncols)
        c2 = ws.cell(row + 1, 1, sub)
        c2.font = F_SUB
        c2.alignment = Alignment(horizontal="left", vertical="center")
        ws.row_dimensions[row + 1].height = 18


def header_row(ws, row, headers, fill=None, height=34):
    for j, h in enumerate(headers, start=1):
        c = ws.cell(row, j, h)
        c.font = F_HEAD
        c.fill = fill or FILL_HEAD
        c.alignment = AL_CTR
        c.border = BORDER
    ws.row_dimensions[row].height = height


def write_table(ws, start_row, headers, rows, widths=None, fills=None,
                align=None, height=None, freeze=None, autofilter=True):
    """fills: list of 关键字用于选中行底色（按 rows 顺序）；align: 每列对齐"""
    header_row(ws, start_row, headers)
    if widths:
        set_widths(ws, widths)
    for i, r in enumerate(rows):
        rr = start_row + 1 + i
        f = fills[i] if fills else None
        for j, v in enumerate(r, start=1):
            c = ws.cell(rr, j, v)
            c.font = F_BODY
            c.border = BORDER
            if align and j - 1 < len(align):
                c.alignment = {"c": AL_CTR_T, "l": AL_WRAP}[align[j - 1]]
            else:
                c.alignment = AL_WRAP
            if f:
                c.fill = f
        if height:
            ws.row_dimensions[rr].height = height
    if autofilter:
        ws.auto_filter.ref = "A%d:%s%d" % (start_row, get_column_letter(len(headers)),
                                           start_row + len(rows))
    if freeze:
        ws.freeze_panes = freeze
