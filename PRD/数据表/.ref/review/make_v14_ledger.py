# -*- coding: utf-8 -*-
"""基于 V1.3 台账生成 V1.4 修订与核验台账"""
import openpyxl, shutil
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

SRC = r'D:\Project\TJ-nengtan\PRD\数据表\双中心能碳管控平台_数据字典V1.3_修订与核验台账.xlsx'
DST = r'D:\Project\TJ-nengtan\PRD\数据表\双中心能碳管控平台_数据字典V1.4_修订与核验台账.xlsx'
shutil.copyfile(SRC, DST)
wb = openpyxl.load_workbook(DST)

thin = Side(style='thin', color='BFBFBF')
BD = Border(left=thin, right=thin, top=thin, bottom=thin)
BF = Font(size=10, name='微软雅黑')
OK_F = Font(size=10, bold=True, color='375623', name='微软雅黑')
OK_FILL = PatternFill('solid', fgColor='E2EFDA')
WARN_F = Font(size=10, bold=True, color='BF8F00', name='微软雅黑')
WARN_FILL = PatternFill('solid', fgColor='FFF2CC')

ws = wb['问题清单']
ws.insert_cols(11)
h = ws.cell(1, 11, 'V1.4 处理说明')
h.fill = PatternFill('solid', fgColor='1F3864'); h.font = Font(color='FFFFFF', bold=True, size=10, name='微软雅黑')
h.border = BD; h.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
ws.column_dimensions[get_column_letter(11)].width = 62

S = {
 'P1-01': '补 15 个开发必需列（12→27 列）：变量符号/所属产线/所属工序/数据类型/数据格式/小数位/单位取值规则/取值范围/默认值/是否必填/校验规则/来源字段表/数据源编码/关联指标编码/参数构成。数据类型 310 条全填（数值 294 / 文本 16）；关联指标编码 166 条有值；所属产线·工序 137 条工序级参数有值。',
 'P1-02': '新建「00-主数据与维度」（置于最前，17 行）：ORG-001~008 + MD-001~008 共 16 项，另加主键维度组合说明行（工序级=组织×产线×工序×统计期；产品级=组织×型号×统计期；工厂级=组织×统计期）。',
 'P1-03': '新建「08-枚举字典」213 条 / 24 个枚举组（V2.2 原始 185 条 + 补充颗粒度层级 12 条 + 零碳产业园区 15 条 + 写法补充 1 条）。',
 'P1-04': '※ 原报告分批表遗漏此项，本轮补做。新建「10-数据接入对照」93 行，覆盖 9.16 版清单 78 项 + 8.27 版独有保留项 15 项；校正 13 处编码（EQ-005~014→ED-001~010、EN-026→EN-021、ZP-001/002→OD-004/005）。',
 'P1-05': '「05-数据源清单」补至 10 条 SRC-01~SRC-10 连续无缺号（原 SRC-05 直接跳 SRC-07）；01 表新增「数据源编码」列，310 条全部落到 SRC-01~10，无空白。',
 'P1-06': '02 表补写全部 93 条规范计算公式，93/93 以全角「＝」开头，半角 0 条，无法生成项 0 条。',
 'P1-07': '02 表新增「分组 / 行类型」列（B 列），原混入编码列的 3 个章节名已清除（A 列非指标行 = 0），分组信息改以「指标｜整体指标 / 指标｜产品管控 / 指标｜关键工序」形式并入该列。',
 'P1-08': '统一枚举为三值：02 表「指标层级」= 工厂级 10 / 产品级 5 / 工序级 78；03 表「颗粒度层级」= 工厂级 33 / 产品级 15 / 工序级 234。',
 'P1-09': '6 个一码多单位参数（EN-004 / EN-016 / OUT-008 / CAR-009 / CAR-014 / FAC-011）由 01 表新增「单位取值规则」列承载，未拆分或改动任何参数编码。',
 'P2-01': '01 表序号重排为 1~310 连续（原缺 21~25）。',
 'P2-02': '04 表删除 Q、R 空列，已用区收敛为 A1:N60（14 列 × 59 行）。注：子代理首轮自述已删但实际未生效，由主代理复算发现并二次清除。',
 'P2-03': 'IND-069/070 及 EN-KE29/EN-KE31/VAL-KG15/VAL-KG17 名称内的「能耗占比较小，沈变建议去掉」评语已移入备注，名称清洗为纯指标名；指标与参数均保留。',
 'P2-04': '新建「09-指标参数构成明细」253 行正文（序号 1~253 连续，原子参数 224 / 复合参数 40）+ 空行分隔 + 11 行数据缺口附录；覆盖 93/93 指标。',
 'P2-05': '05 表 SRC-02 备注已去除对不存在指标 IND-001 的引用（该备注内容是真实的数据源用途）。',
 'P0-04': '仍待业务确认：IND-001 产品碳足迹是否纳入本期范围。10 表已按清单实际口径处理，未挂靠该指标。',
}

for r in range(2, ws.max_row + 1):
    code = ws.cell(r, 1).value
    code = str(code).strip() if code else ''
    if code in S:
        c = ws.cell(r, 9)
        if code == 'P0-04':
            c.value = '待业务确认'; c.fill = WARN_FILL; c.font = WARN_F
        else:
            c.value = '已修复 · V1.4'; c.fill = OK_FILL; c.font = OK_F
        c.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
        n = ws.cell(r, 11, S[code]); n.font = BF; n.border = BD
        n.alignment = Alignment(vertical='top', wrap_text=True)
    else:
        n = ws.cell(r, 11, ''); n.border = BD
ws.auto_filter.ref = f'A1:K{ws.max_row}'

# ===== 新增 V1.4 独立核验表 =====
if 'V1.4 独立核验' in wb.sheetnames:
    del wb['V1.4 独立核验']
ws3 = wb.create_sheet('V1.4 独立核验', 2)
h3 = ['#', '核验项', '核验方法', 'V1.3 基线', 'V1.4 结果', '判定']
for i, c in enumerate(h3, 1):
    cell = ws3.cell(1, i, c); cell.fill = PatternFill('solid', fgColor='1F3864')
    cell.font = Font(color='FFFFFF', bold=True, size=10, name='微软雅黑'); cell.border = BD
    cell.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
for i, w in enumerate([5, 24, 36, 30, 36, 10], 1):
    ws3.column_dimensions[get_column_letter(i)].width = w
D = [
 [1, '工作表数量', '清点 sheet 目录', '7 张', '11 张（新增 00 / 08 / 09 / 10）', '通过'],
 [2, '01 表列数', '读取表头', '12 列', '27 列（+15 个开发必需列）', '通过'],
 [3, '01 表编码唯一性', '参数编码去重', '310 / 310 唯一', '310 / 310 唯一', '通过'],
 [4, '01 表序号连续性', '序号列校验', '1~310 连续', '1~310 连续', '通过'],
 [5, '全表悬挂引用', '提取编码在 00+01 表反查', '0 处', '0 处（编码全集 326）', '通过'],
 [6, '02 表规范计算公式', '非空行 + 开头字符检查', '整列空（0 条）', '93 / 93 条，全角「＝」93 条、半角 0 条', '通过'],
 [7, '02 表章节名污染', 'A 列非指标内容检查', '3 行（第 2/13/19 行）', '0 行', '通过'],
 [8, '03 表颗粒度枚举', '取值分布', '三套并存', '统一为 工厂级/产品级/工序级', '通过'],
 [9, '04 表空列', 'max_column 检查', 'P 列（16 列）', 'N 列（14 列，A1:N60）', '通过'],
 [10, '04 表工序覆盖', 'EN-KE 集合差集', '59 / 59', '59 / 59，8 个吨铜电耗指标全有行', '通过'],
 [11, '05 表 SRC 编号', '编码连续性', '缺 SRC-06', 'SRC-01~10 连续无缺号', '通过'],
 [12, '01 表数据源编码', '逐行检查', '无该列', '310 条全部落到 SRC-01~10，无空白', '通过'],
 [13, '08 枚举字典完整性', '逐行扫描 + 空洞检查', '无该表', '213 条 / 24 组，行 2~214 连续无空洞', '通过'],
 [14, '09 构成明细覆盖度', 'IND-* 反查 02 表', '无该表', '覆盖 93 / 93 指标，序号 1~253 连续', '通过'],
 [15, '10 数据接入对照', '清单项 ↔ 参数编码反查', '无该表', '93 项，对应编码 0 悬挂', '通过'],
 [16, '半角「=」开头文本', '全表扫描', '0 处', '0 处（避免被 Excel 当公式）', '通过'],
]
r = 2
for row in D:
    for j, v in enumerate(row, 1):
        c = ws3.cell(r, j, v); c.font = BF; c.border = BD
        c.alignment = Alignment(vertical='top', wrap_text=True, horizontal='center' if j in (1, 6) else 'left')
    ws3.cell(r, 6).fill = OK_FILL; ws3.cell(r, 6).font = OK_F
    r += 1
ws3.freeze_panes = 'A2'

# ===== 新增：遗留与待确认 =====
if '待确认与遗留' in wb.sheetnames:
    del wb['待确认与遗留']
ws4 = wb.create_sheet('待确认与遗留')
h4 = ['#', '事项', '层级', '现状', '需要谁确认 / 怎么补']
for i, c in enumerate(h4, 1):
    cell = ws4.cell(1, i, c); cell.fill = PatternFill('solid', fgColor='1F3864')
    cell.font = Font(color='FFFFFF', bold=True, size=10, name='微软雅黑'); cell.border = BD
    cell.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
for i, w in enumerate([5, 34, 12, 46, 46], 1):
    ws4.column_dimensions[get_column_letter(i)].width = w
D4 = [
 [1, 'P0-04 · IND-001 产品碳足迹去留', 'P0', '02 表无 IND-001；05 表备注已去除对该指标的引用；10 表按清单实际口径处理', '业务决策：① 剔除 → 需在需求清单说明产品碳足迹指标归属其他系统；② 保留 → 需补回 IND-001 定义与公式'],
 [2, '01 表「来源字段/表」310 条为占位', 'P1', '全部填「待确认（需 <数据来源> 表结构）」', '需 ERP / EMS / 经营日报 / 集控中心各系统的表结构文档，才能补真实字段名'],
 [3, '01 表「默认值」310 条全空', 'P2', '原表未规定默认值', '业务确认是否需要默认值口径'],
 [4, '01 表「是否必填」310 条统一为「是」', 'P2', '未区分必填 / 选填', '详设阶段按指标计算链路标出可选项'],
 [5, '01 表「单位取值规则」仅 6 条', 'P2', '仅覆盖 EN-004 / EN-016 / OUT-008 / CAR-009 / CAR-014 / FAC-011', '确认是否还有其他一码多单位情形'],
 [6, '09 表附录 11 项数据缺口', 'P1', '11 个工序的「综合能源消费量」与其「电力消费量」为两个独立变量，说明尚有非电能源品种未单列', '项目公司确认这些工序是否有蒸汽 / 天然气 / 热力计量点，如有须补编码并入折标计算'],
 [7, '08 表 ZC-06 费用↔实物量映射', 'P2', 'CO-001↔EN-021 已校正；CO-003↔EN-031、CO-004↔EN-032、CO-005↔EN-002、CO-006↔EN-030 待复核', '业务复核费用科目与实物量参数的对应关系'],
 [8, '「二次」产线数据来源口径', 'P2', 'SMT 贴片 / 波峰焊 / 高温老化（EN-KE10~12、VAL-KG10~12）未出现在 06-企业组织结构表，按变压器板块口径推断为 ERP 系统', '确认二次产线归属经营单位；若走 MES 需改这 6 行'],
 [9, '工序产值 VAL-KG01~19 口径', 'P2', '本轮填「ERP 系统 · 自动采集」；同表产线级产值 VAL-003~012 用「系统对接」', '确认是否要按「产值」数据类别统一为系统对接'],
 [10, '10 表未覆盖「服务器资源」段', 'P2', 'V2.2 备注明确该段属硬件与部署需求，不进基础参数表', '确认由实施文档承载即可'],
]
r = 2
for row in D4:
    for j, v in enumerate(row, 1):
        c = ws4.cell(r, j, v); c.font = BF; c.border = BD
        c.alignment = Alignment(vertical='top', wrap_text=True, horizontal='center' if j in (1, 3) else 'left')
    lv = row[2]
    ws4.cell(r, 3).fill = PatternFill('solid', fgColor='FCE4E4' if lv == 'P0' else ('FFF2CC' if lv == 'P1' else 'E8EEF7'))
    ws4.cell(r, 3).font = Font(size=10, bold=True, name='微软雅黑',
                              color='C00000' if lv == 'P0' else ('BF8F00' if lv == 'P1' else '1F4E79'))
    r += 1
ws4.freeze_panes = 'A2'

wb.save(DST)
print('saved', DST, ' sheets:', wb.sheetnames)
