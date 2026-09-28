# -*- coding: utf-8 -*-
"""基于 V1.2 问题清单，生成 V1.3 修订与核验台账"""
import openpyxl, shutil, os
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

SRC = r'D:\Project\TJ-nengtan\PRD\数据表\双中心能碳管控平台_数据字典V1.2_开发就绪度问题清单.xlsx'
DST = r'D:\Project\TJ-nengtan\PRD\数据表\双中心能碳管控平台_数据字典V1.3_修订与核验台账.xlsx'
shutil.copyfile(SRC, DST)

wb = openpyxl.load_workbook(DST)
thin = Side(style='thin', color='BFBFBF')
BD = Border(left=thin, right=thin, top=thin, bottom=thin)
BF = Font(size=10, name='微软雅黑')

ws = wb['问题清单']
STATUS = {
    'P0-01': ('已修复 · V1.3', 'ED-001~ED-010', '重点设备组改用 ED- 前缀，EQ-001~004 归节能装备组；03/04 表经反查无该组引用'),
    'P0-02': ('已修复 · V1.3', 'OUT-009', '采纳方案②：02表 H14:H18、03表 5 处分母引用统一改为 OUT-009 订单产量（按型号）；01表 F34 补写统计维度「组织 × 型号 × 统计期」'),
    'P0-03': ('已修复 · V1.3', 'EN-021', '02表 H12 IND-011 引用 EN-026 → EN-021 用水量（总量）'),
    'P0-04': ('待业务确认', '—', 'IND-001 产品碳足迹去留属业务决策，且未列入第1/2批，本次未动'),
    'P0-05': ('已修复 · V1.3', '04表 +8行', '8 条线缆产线拉丝工序补铜计量点：EN-KE42/44/46/48/50/52/54/57 + OUT-KM23/25/27/29/31/33/35/38，挂接 IND-017/019/021/024/027/029/031/033'),
    'P0-06': ('已修复 · V1.3', '58行×4列', '口径统一为 ERP 系统 / 自动采集 / 日更新 / 各项目公司；MT-001/002 仅补责任单位'),
    'P1-05': ('部分处理 · V1.3', '—', 'V1.3 补齐后 EMS 系统已成为 70+ 项参数的来源，但 05 数据源清单仍未登记 EMS、SRC-06 仍缺号；01↔05 编码级关联未打通（属第4批）'),
}
# 定位列(第5列)后面插入一列「V1.3 处理说明」
ws.insert_cols(10)
h = ws.cell(1, 10, 'V1.3 处理说明')
h.fill = PatternFill('solid', fgColor='1F3864'); h.font = Font(color='FFFFFF', bold=True, size=10, name='微软雅黑')
h.border = BD; h.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
ws.column_dimensions[get_column_letter(10)].width = 58

col_status = 9
for r in range(2, ws.max_row + 1):
    code = ws.cell(r, 1).value
    code = str(code).strip() if code else ''
    key = code.split(' ')[0] if ' ' in code else code
    if key in STATUS:
        st, brief, note = STATUS[key]
        c = ws.cell(r, col_status, st)
        c.fill = PatternFill('solid', fgColor='E2EFDA' if '已修复' in st else ('FFF2CC' if '部分' in st or '待' in st else 'FFFFFF'))
        c.font = Font(size=10, bold=True, color='375623' if '已修复' in st else 'BF8F00', name='微软雅黑')
        c.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
        n = ws.cell(r, 10, note); n.font = BF; n.border = BD
        n.alignment = Alignment(vertical='top', wrap_text=True)
    else:
        n = ws.cell(r, 10, '本次未涉及（属第 3~5 批范围）'); n.font = Font(size=10, name='微软雅黑', color='808080')
        n.border = BD; n.alignment = Alignment(vertical='top', wrap_text=True)
ws.auto_filter.ref = f'A1:J{ws.max_row}'

# ============ 新增：V1.3 独立核验（主代理复算） ============
if 'V1.3 独立核验' in wb.sheetnames:
    del wb['V1.3 独立核验']
ws3 = wb.create_sheet('V1.3 独立核验', 1)
hdr3 = ['#', '核验项', '核验方法', 'V1.2 结果', 'V1.3 结果', '判定']
for i, c in enumerate(hdr3, 1):
    cell = ws3.cell(1, i, c); cell.fill = PatternFill('solid', fgColor='1F3864')
    cell.font = Font(color='FFFFFF', bold=True, size=10, name='微软雅黑'); cell.border = BD
    cell.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
for i, w in enumerate([5, 24, 40, 34, 34, 10], 1):
    ws3.column_dimensions[get_column_letter(i)].width = w
data3 = [
    [1, '01 表编码全局唯一性', '参数编码列去重比对', '310 项 / 306 唯一 / 4 个重复（EQ-001~004 各 2 次）', '310 项 / 310 唯一 / 0 重复', '通过'],
    [2, '02/03/04/05 表悬挂引用', '提取全部参数编码在 01 表反查', '2 处（OUT-P01、EN-026）', '0 处', '通过'],
    [3, 'OUT-P01 / EN-026 残留文本', '全文扫描', '存在', '0 处', '通过'],
    [4, '04 表 EN-KE 覆盖度', '与 01 表 EN-KE 编码集合比对', '51 / 59（缺 8 个拉丝·铜）', '59 / 59，缺 0', '通过'],
    [5, '04 表 OUT-KM 覆盖度', '与 01 表 OUT-KM 编码集合比对', '32 / 40', '40 / 40', '通过'],
    [6, '8 个吨铜电耗指标矩阵行', 'IND-017/019/021/024/027/029/031/033 反查 04 表关联指标列', '全部无行', '全部有行', '通过'],
    [7, '04 表序号连续性', '序号列校验', '1~51 连续', '1~59 连续', '通过'],
    [8, '01 表接入信息四列完整度', '逐行检查 数据来源/方式/频率/责任单位', '58 行空缺', '0 行空缺', '通过'],
    [9, 'EQ / ED 前缀语义分离', '两组合并检查编码与名称归属', 'EQ-001~004 归属歧义', 'EQ-001~004=节能装备；ED-001~010=重点设备', '通过'],
    [10, 'IND-009 对 EQ-001/EQ-002 引用', '反查引用语义', '指向节能装备组', '不变，语义正确', '通过'],
]
r = 2
for row in data3:
    for j, v in enumerate(row, 1):
        c = ws3.cell(r, j, v); c.font = BF; c.border = BD
        c.alignment = Alignment(vertical='top', wrap_text=True, horizontal='center' if j in (1, 6) else 'left')
    c = ws3.cell(r, 6)
    c.fill = PatternFill('solid', fgColor='E2EFDA')
    c.font = Font(size=10, bold=True, color='375623', name='微软雅黑')
    r += 1
ws3.freeze_panes = 'A2'

wb.save(DST)
print('saved', DST)
print('sheets:', wb.sheetnames)
