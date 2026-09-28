# -*- coding: utf-8 -*-
"""生成「双中心」项目能碳管控平台 · 基础参数与指标字典 V2.0（最小颗粒度版）"""
import json
import os
import re
import sys

from openpyxl import Workbook
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from xl_style import *  # noqa

OUT = os.path.join(os.path.dirname(HERE),
                   "双中心能碳管控平台_基础参数与指标字典_V2.2.xlsx")

R = json.load(open(os.path.join(HERE, "rows_model.json"), encoding="utf-8"))

PARAMS = R["params"]
PMETA = R["param_meta"]
INDS = R["inds"]
VROWS = R["var_rows"]
PITEMS = R["pitems"]
PROD = R["prod"]
SOURCES = R["sources"]
ENUMS = R["enums"]
REQ_ROWS = R["req_rows"]
REQ_COUNTS = R["req_counts"]
TREE_ROWS = R["tree_rows"]
PENDING = R["pending"]

wb = Workbook()
ws1 = wb.active
ws1.title = "01-说明与查询"
ws2 = wb.create_sheet("02-基础参数表")
ws3 = wb.create_sheet("03-指标清单")
ws4 = wb.create_sheet("04-公式变量映射")
ws5 = wb.create_sheet("05-工序数据项矩阵")
ws6 = wb.create_sheet("06-数据源清单")
ws7 = wb.create_sheet("07-枚举字典")
ws8 = wb.create_sheet("08-数据接入对照")
ws9 = wb.create_sheet("09-指标参数构成明细")

GROUP_FILL = {"公共参数": FILL_PUB, "既有域补充": FILL_SUPP, "集控中心数据域": FILL_ZC,
              "产品级数据项": FILL_PROD, "工序级数据项": FILL_PROC, "指标定义": FILL_IND}

# ================================================================ 02 基础参数表
PCOLS = ["序号", "参数编码", "参数名称", "颗粒度层级", "数据类型", "变量符号（原表）",
         "所属产线", "所属工序", "数据类别", "数据说明", "单位", "数据格式", "小数位",
         "取值范围", "默认值", "数据来源", "来源字段 / 表", "获取方式",
         "采集 / 更新频率", "是否必填", "责任单位", "关联指标编码",
         "指标构成 / 参数构成（细分项）", "校验规则", "备注"]
PW = [5, 11, 40, 17, 13, 20, 14, 12, 11, 52, 13, 14, 6, 15, 8, 30, 34, 12, 12, 8, 20, 46, 66, 40, 60]
P2 = ["c", "l", "l", "c", "c", "l", "l", "l", "c", "l", "c", "c", "c", "l", "c",
      "l", "l", "c", "c", "c", "l", "l", "l", "l", "l"]

prows = []
pfills = []
for i, r in enumerate(PARAMS):
    prows.append([i + 1] + r)
    pfills.append(GROUP_FILL.get(PMETA[i]))

ws2.append([])
title_row(ws2, 1, len(PCOLS), "02 · 基础参数表（统一参数与数据项定义）",
          "共 %d 项 = 公共参数 %d（工厂级 / 主数据 / 系数）+ 既有域补充 %d（能源品种 / 系数）+ "
          "零碳园区与集控中心数据 %d + 产品级数据项 %d + 工序级数据项 %d + 指标定义 %d。"
          "颗粒度已拆分到「产线 × 工序 × 介质 / 物料」与「园区 / 设备 / 系统 / 订单」，公式取数请使用最小颗粒度编码。"
          "「指标构成 / 参数构成（细分项）」列：指标行写明该指标由哪些参数构成，"
          "复合参数行写明它由哪些分项折算而来，可直接据此追溯取数链路。"
          % (len(PARAMS), PMETA.count("公共参数"), PMETA.count("既有域补充"),
             PMETA.count("集控中心数据域"), PMETA.count("产品级数据项"),
             PMETA.count("工序级数据项"), PMETA.count("指标定义")))
write_table(ws2, 3, PCOLS, prows, widths=PW, fills=pfills, align=P2,
            freeze="C4", autofilter=True)
for i in range(len(prows)):
    rr = 4 + i
    ws2.row_dimensions[rr].height = None
    ws2.cell(rr, 2).font = F_BODY_B
    ws2.cell(rr, 23).font = F_SMALL
ws2.auto_filter.ref = "A3:Y%d" % (3 + len(prows))

# ================================================================ 03 指标清单
ICOLS = ["指标编码", "指标名称", "指标体系", "所属中心", "指标层级", "指标定义",
         "规范计算公式（按参数编码）", "最小颗粒度输入项", "指标说明（原表）", "指标单位",
         "指标类别", "指标来源", "指标用途", "覆盖范围", "所需各单位数据",
         "各单位所需开展工作", "依赖基础参数", "开发实现要点", "参数构成（细分项）"]
IW = [10, 36, 10, 10, 10, 46, 44, 24, 60, 20, 10, 22, 40, 34, 42, 46, 30, 42, 62]
I2 = ["c", "l", "c", "c", "c", "l", "l", "l", "l", "c", "c", "l", "l", "l", "l", "l", "l", "l", "l"]
write_table(ws3, 1, ICOLS, INDS, widths=IW, align=I2, freeze="C2")
for i in range(len(INDS)):
    ws3.cell(2 + i, 1).font = F_BODY_B
    ws3.cell(2 + i, 7).font = F_MONO
    ws3.cell(2 + i, 19).font = F_SMALL
    ws3.row_dimensions[2 + i].height = 62

# ================================================================ 04 公式变量映射
VCOLS = ["指标编码", "指标名称", "颗粒度层级", "变量序号", "变量符号（原表）", "变量角色",
         "对应参数编码", "对应数据项名称", "变量单位", "所属产线", "所属工序",
         "变量含义（原表）"]
VW = [10, 36, 14, 8, 26, 22, 12, 40, 14, 14, 12, 60]
V2 = ["c", "l", "c", "c", "l", "l", "c", "l", "c", "l", "l", "l"]

PNAME = {r[1]: r[2] for r in PARAMS}
vrows = []
for v in VROWS:
    sec = v["section"]
    level = {"整体指标": "工厂级", "产品管控": "产品级", "关键工序": "工序级"}.get(sec, sec)
    code = v["param_code"]
    vrows.append(["IND-%03d" % v["ind_seq"], v["ind_name"], level, v["idx"] + 1,
                  v["sym"], v["role"], code, PNAME.get(code, "—"),
                  v["unit"] or "—", v["line"] or "—", v["process"] or "—", v["desc"]])
write_table(ws4, 1, VCOLS, vrows, widths=VW, align=V2, freeze="C2")
for i in range(len(vrows)):
    ws4.cell(2 + i, 1).font = F_BODY_B
    ws4.cell(2 + i, 7).font = F_MONO

# ================================================================ 05 工序数据项矩阵
KIND_COL = {"E": "电力消费量", "S": "蒸汽消费量", "T": "综合能源消费量",
            "M": "产品产量", "G": "产品产值"}
KIND_ORDER = ["E", "S", "T", "M", "G"]
matrix = {}
order = []
for it in PITEMS:
    k = (it["line"], it["process"])
    if k not in matrix:
        matrix[k] = {}
        order.append(k)
    matrix[k][it["kind"]] = it
order.sort(key=lambda x: (x[0], x[1]))

MCOLS = ["序号", "产线", "工序"] + ["%s 编码" % KIND_COL[k] for k in KIND_ORDER] + \
        ["%s 单位" % KIND_COL[k] for k in KIND_ORDER] + ["关联指标"]
MW = [5, 16, 14] + [14] * 5 + [9] * 5 + [30]
M2 = ["c", "l", "l"] + ["c"] * 10 + ["l"]
mrows = []
for n, k in enumerate(order, start=1):
    d = matrix[k]
    codes = [d[x]["code"] if x in d else "—" for x in KIND_ORDER]
    units = [d[x]["unit"] if x in d else "—" for x in KIND_ORDER]
    inds = sorted({s for x in KIND_ORDER if x in d for s in d[x]["inds"]})
    mrows.append([n, k[0], k[1]] + codes + units +
                 ["、".join("IND-%03d" % s for s in inds)])
ws5.append([])
title_row(ws5, 1, len(MCOLS), "05 · 工序数据项矩阵（最小颗粒度展开对照）",
          "共 %d 个「产线 × 工序」组合。" % len(order))
write_table(ws5, 3, MCOLS, mrows, widths=MW, align=M2, freeze="D4")
for i in range(len(mrows)):
    for j in range(4, 9):
        ws5.cell(4 + i, j).font = F_MONO

# ================================================================ 06 数据源清单
SCOLS = ["序号", "数据源编码", "数据源系统 / 部门", "提供方", "提供数据内容", "对接方式",
         "数据频率", "责任方", "备注"]
SW = [5, 11, 26, 14, 58, 16, 12, 20, 44]
S2 = ["c", "c", "l", "l", "l", "l", "c", "l", "l"]
srows = [[i + 1] + list(s) for i, s in enumerate(SOURCES)]
title_row(ws6, 1, len(SCOLS), "06 · 数据源清单",
          "共 %d 个数据源。工序级数据项的来源系统与责任方见「02-基础参数表」对应行。" % len(srows))
write_table(ws6, 3, SCOLS, srows, widths=SW, align=S2, freeze="A4")

# ================================================================ 07 枚举字典
ECOLS = ["序号", "字典编码", "字典名称", "取值", "取值说明", "关联参数编码", "备注"]
EW = [5, 12, 20, 18, 52, 26, 46]
E2 = ["c", "c", "l", "l", "l", "l", "l"]
erows = []
for i, e in enumerate(ENUMS, start=1):
    erows.append([i, e[0], e[1], e[2], e[3], e[4], e[5]])
ws7.append([])
title_row(ws7, 1, len(ECOLS), "07 · 枚举字典",
          "共 %d 条取值。产线、工序、物料等维度取值以此为准。" % len(erows))
write_table(ws7, 3, ECOLS, erows, widths=EW, align=E2, freeze="A4")

# ================================================================ 08 数据接入对照
RCOLS = ["序号", "数据域 / 中心", "数据类型", "数据项名称（清单原文）", "数据单位（清单）",
         "数据对象", "数据来源（清单原文）", "采集频率（清单）", "业务用途（清单原文）",
         "对应参数编码", "清单版本", "处理说明 / 差异与口径提示"]
RW = [5, 22, 10, 42, 14, 14, 24, 14, 30, 30, 10, 70]
R2 = ["c", "l", "c", "l", "c", "l", "l", "c", "l", "l", "c", "l"]
ws8.append([])
title_row(ws8, 1, len(RCOLS), "08 · 数据需求清单 → 基础参数编码 逐项对照",
          "覆盖《“双中心”数据需求清单9.16》全部 %d 项（集控 %d + 集采 %d），"
          "并纳入 8.27 V1.0 版独有而 9.16 版删除的 %d 项（保留理由见「处理说明」列）。"
          "「清单版本」列标注来源版本；「对应参数编码」列为该清单项的落库编码，"
          "含「+」表示按最小颗粒度拆为多个编码（拆分依据见「处理说明」列）。"
          % (REQ_COUNTS["916"], REQ_COUNTS["916"] - 2, 2, REQ_COUNTS["827only"]))
write_table(ws8, 3, RCOLS, REQ_ROWS, widths=RW, align=R2, freeze="D4")
for i in range(len(REQ_ROWS)):
    ws8.cell(4 + i, 10).font = F_MONO
    ws8.cell(4 + i, 1).font = F_BODY


def _cnt(pfx):
    """统计 V2.1 新增块中某前缀的参数条数（公共参数区不计 EQ-/EN-/FAC- 原有项）"""
    base = PMETA.count("公共参数")
    return sum(1 for k in range(base, len(PARAMS)) if PARAMS[k][0].startswith(pfx))


_r = 4 + len(REQ_ROWS) + 1
_tip = [
    ("A", "两版清单差异", "9.16 版共 78 项（集控 76 + 集采 2），8.27 V1.0 版共 66 项。"
     "9.16 版新增：重点设备额定负荷 / 蒸汽瞬时流量 / 蒸汽消耗量（3 项）、热泵与空调系统完整运行参数（20 项）、氮气费用、"
     "生产单元-能耗计量绑定关系、生产单元能耗计量数据；"
     "9.16 版删除：零碳关键事件、储能日充放分时电量（10 项）、产量（线缆 / 非线缆）2 项、订单能耗、关键工序能耗指标。"
     "删除项中凡对指标计算或能效分析有价值的，本版均予保留并在「八」列标注理由。"),
    ("B", "单位口径冲突（须开发前确认）", "① 油品：清单按「L」，V1.0 参数表柴油 / 汽油 / 煤油按「t」→ 新增 EN-032（L）与 FAC-015~017 密度系数换算；"
     "② 绿证：V1.0 作「张 / MWh」复合单位，统一为「个（张）」计数（GV-002）；"
     "③ 电量：清单用 MWh，V1.0 用 kWh，统一以 kWh 存储（EN-002 / EN-003），MWh 仅作展示（LD-001 / GV-001）；"
     "④ 储能收益单位「元」与绿电收益「万元」不一致；"
     "⑤ 储能装机容量「MW/MWh」复合单位已拆为 ZP-003 + ZP-004。"),
    ("C", "新增数据域（V2.1）", "本次共新增 %d 项参数：既有域补充 %d 项（EN-030~032 液氮 / 外购蒸汽 / 油品合计、"
     "FAC-014~017 液氮折标煤与油品密度系数），零碳园区与集控中心数据域 %d 项"
     "（ZP- 园区基础配置 %d、NE- 新能源与储能 %d、LD- 园区负荷 %d、GV- 绿色电力 %d、RV- 收益 %d、"
     "EQ- 重点设备运行 %d、HV- 暖通系统 %d、CO- 能源费用 %d、OD- 订单 %d、MT- 计量 %d）。"
     % (len(PARAMS) - 334, PMETA.count("既有域补充"), PMETA.count("集控中心数据域"),
        _cnt("ZP-"), _cnt("NE-"), _cnt("LD-"), _cnt("GV-"), _cnt("RV-"),
        _cnt("EQ-"), _cnt("HV-"), _cnt("CO-"), _cnt("OD-"), _cnt("MT-"))),
    ("D", "保留但提示偏差的清单项", "9.16 清单第 48 / 58 项（热泵供热面积、空调供冷面积）数据来源标「界面手动录入」但备注写「15 分钟」，"
     "本版按静态台账处理（变更时更新）；第 36 项重点设备额定负荷亦为静态数据。"),
    ("E", "非参数类清单内容", "「服务器资源」段（存储 / 应用 / 数据接入 / 算力 / 智能体服务器配置）属硬件与部署需求，"
     "不进入基础参数表，由项目实施文档单独承载。"),
]
for _k, (_no, _t, _d) in enumerate(_tip):
    ws8.merge_cells(start_row=_r, start_column=1, end_row=_r, end_column=2)
    c = ws8.cell(_r, 1, _no)
    c.font = F_BODY_B
    c.alignment = AL_CTR
    c.border = BORDER
    c.fill = FILL_TIP
    ws8.merge_cells(start_row=_r, start_column=3, end_row=_r, end_column=4)
    c = ws8.cell(_r, 3, _t)
    c.font = F_BODY_B
    c.alignment = AL_LEFT_C
    c.border = BORDER
    c.fill = FILL_TIP
    ws8.merge_cells(start_row=_r, start_column=5, end_row=_r, end_column=12)
    c = ws8.cell(_r, 5, _d)
    c.font = F_BODY
    c.alignment = AL_WRAP
    c.border = BORDER
    c.fill = FILL_TIP
    ws8.row_dimensions[_r].height = 52
    _r += 1

# ================================================================ 09 指标参数构成明细
CCOLS = ["序号", "指标编码", "指标名称", "指标体系", "指标单位", "规范计算公式（按参数编码）",
         "层级", "参数角色", "参数编码", "参数名称", "参数性质", "单位", "数据类别",
         "所属产线", "所属工序", "数据来源", "获取方式", "责任单位", "构成说明 / 备注"]
CW = [5, 10, 30, 10, 13, 34, 6, 10, 11, 38, 11, 12, 11, 15, 12, 26, 12, 20, 62]
C2 = ["c", "c", "l", "c", "c", "l", "c", "c", "l", "l", "c", "c", "c",
      "l", "l", "l", "c", "l", "l"]

LEVEL_TXT = {1: "① 输入项", 2: "② 分项", 3: "③ 分项"}
PREFIX = {1: "", 2: "└─ ", 3: "　└─ "}

crows = []
cfills = []
_prev_ind = None
_band = 0
for r in TREE_ROWS:
    ind = r[1]
    if ind != _prev_ind:
        _band ^= 1
        _prev_ind = ind
    d = r[6]
    crows.append([r[0], r[1], r[2], r[3], r[4], r[5],
                  LEVEL_TXT.get(d, d), r[7], r[8],
                  PREFIX.get(d, "") + str(r[9]), r[10], r[11], r[12],
                  r[13], r[14], r[15], r[16], r[17], r[18]])
    cfills.append(FILL_BAND if _band else None)

ws9.append([])
title_row(ws9, 1, len(CCOLS), "09 · 指标参数构成明细（指标 → 参数 → 分项 全展开）",
          "共 %d 行，覆盖全部 %d 个指标。第 ① 层为该指标的公式输入项（分子 / 分母 / 加项 / 扣减项等）；"
          "第 ②③ 层为复合参数（如「综合能源消费量」）继续拆出的最小颗粒度分项。"
          "开发实现时，原子参数直接取数，复合参数按其分项折算或上送。"
          % (len(crows), len(INDS)))
write_table(ws9, 3, CCOLS, crows, widths=CW, fills=cfills, align=C2, freeze="D4")
for i, r in enumerate(crows):
    rr = 4 + i
    ws9.cell(rr, 2).font = F_BODY_B
    ws9.cell(rr, 9).font = F_MONO
    ws9.cell(rr, 6).font = F_MONO
    ws9.cell(rr, 7).alignment = AL_CTR
    if r[6].startswith("②") or r[6].startswith("③"):
        ws9.cell(rr, 7).font = F_SMALL
        ws9.cell(rr, 10).font = F_SMALL

_r9 = 4 + len(crows) + 1
ws9.merge_cells(start_row=_r9, start_column=1, end_row=_r9, end_column=len(CCOLS))
c = ws9.cell(_r9, 1, "附 · 源表未单列的能源品种分项（待项目公司确认，共 %d 项）" % len(PENDING))
c.font = Font(name="微软雅黑", size=11, bold=True, color=C_HEAD)
ws9.row_dimensions[_r9].height = 22
_r9 += 1
for _p in PENDING:
    ws9.merge_cells(start_row=_r9, start_column=1, end_row=_r9, end_column=2)
    c = ws9.cell(_r9, 1, _p[0])
    c.font = F_BODY_B
    c.alignment = AL_LEFT_C
    c.border = BORDER
    c.fill = FILL_TIP
    ws9.merge_cells(start_row=_r9, start_column=3, end_row=_r9, end_column=4)
    c = ws9.cell(_r9, 3, _p[1])
    c.font = F_BODY
    c.alignment = AL_WRAP
    c.border = BORDER
    c.fill = FILL_TIP
    ws9.merge_cells(start_row=_r9, start_column=5, end_row=_r9, end_column=6)
    c = ws9.cell(_r9, 5, "%s（%s）" % (_p[3], _p[2]))
    c.font = F_MONO
    c.alignment = AL_WRAP
    c.border = BORDER
    c.fill = FILL_TIP
    ws9.merge_cells(start_row=_r9, start_column=7, end_row=_r9, end_column=12)
    c = ws9.cell(_r9, 7, _p[5])
    c.font = F_BODY
    c.alignment = AL_WRAP
    c.border = BORDER
    c.fill = FILL_TIP
    ws9.merge_cells(start_row=_r9, start_column=13, end_row=_r9, end_column=len(CCOLS))
    c = ws9.cell(_r9, 13, _p[6])
    c.font = F_BODY
    c.alignment = AL_WRAP
    c.border = BORDER
    c.fill = FILL_TIP
    ws9.row_dimensions[_r9].height = 46
    _r9 += 1

# ================================================================ 01 说明与查询
import sheet01
import sheet01b

PCOLS_NOTE = [("参数编码", 1), ("参数名称", 2), ("颗粒度层级", 3), ("数据类型", 4),
              ("变量符号（原表）", 5), ("所属产线", 6), ("所属工序", 7), ("数据类别", 8),
              ("数据说明", 9), ("单位", 10), ("数据格式", 11), ("小数位", 12),
              ("取值范围", 13), ("默认值", 14), ("数据来源", 15), ("来源字段 / 表", 16),
              ("获取方式", 17), ("采集 / 更新频率", 18), ("是否必填", 19),
              ("责任单位", 20), ("关联指标编码", 21),
              ("▶ 指标构成 / 参数构成（细分项）", 22), ("校验规则", 23), ("备注", 24)]
pos1 = sheet01.build(ws1, PARAMS, INDS, PCOLS_NOTE)
_INFO = {"n_base": len(PARAMS), "n_supp": PMETA.count("既有域补充"),
         "n_zc": PMETA.count("集控中心数据域"), "n_new": PMETA.count("既有域补充") + PMETA.count("集控中心数据域"),
         "n_req916": REQ_COUNTS["916"],
         "n_tree": len(TREE_ROWS), "n_pending": len(PENDING)}
sheet01b.build_static(ws1, pos1["end"], PARAMS, PITEMS, PROD, len(INDS), len(vrows), _INFO)

# 参数编码下拉
dv = DataValidation(type="list", formula1="='02-基础参数表'!$B$4:$B$%d" % (3 + len(PARAMS)),
                    allow_blank=True, showDropDown=False)
ws1.add_data_validation(dv)
dv.add(ws1["B%d" % pos1["p_in"]])

# 指标编码下拉
dv2 = DataValidation(type="list", formula1="='03-指标清单'!$A$2:$A$%d" % (1 + len(INDS)),
                     allow_blank=True, showDropDown=False)
ws1.add_data_validation(dv2)
dv2.add(ws1["B%d" % pos1["i_in"]])

# ================================================================ 打印与标签设置
TAB = {"01-说明与查询": "1F4E79", "02-基础参数表": "2E75B6", "03-指标清单": "548235",
       "04-公式变量映射": "7030A0", "05-工序数据项矩阵": "BF8F00",
       "06-数据源清单": "C55A11", "07-枚举字典": "808080", "08-数据接入对照": "C00000",
       "09-指标参数构成明细": "0F7B6C"}
TITLES = {"01-说明与查询": None, "02-基础参数表": "3:3", "03-指标清单": "1:1",
          "04-公式变量映射": "1:1", "05-工序数据项矩阵": "3:3",
          "06-数据源清单": "3:3", "07-枚举字典": "3:3", "08-数据接入对照": "3:3",
          "09-指标参数构成明细": "3:3"}
for nm in wb.sheetnames:
    w = wb[nm]
    w.sheet_properties.tabColor = TAB.get(nm)
    w.page_setup.orientation = "landscape"
    w.page_setup.paperSize = 9          # A4
    w.sheet_properties.pageSetUpPr.fitToPage = True
    w.page_setup.fitToWidth = 1
    w.page_setup.fitToHeight = 0
    w.print_options.horizontalCentered = True
    w.page_margins.left = w.page_margins.right = 0.28
    w.page_margins.top = w.page_margins.bottom = 0.4
    if TITLES.get(nm):
        w.print_title_rows = TITLES[nm]

# 保存 01 页布局（供 inject.py 定位公式单元格，避免硬编码行号）
with open(os.path.join(HERE, "layout.json"), "w", encoding="utf-8") as fh:
    json.dump({"p_in": pos1["p_in"], "p_m": pos1["p_m"], "i_in": pos1["i_in"],
               "i_m": pos1["i_m"], "p_first": pos1["p_first"], "i_first": pos1["i_first"],
               "pcols_note": PCOLS_NOTE, "iattrs": sheet01.IATTRS,
               "n_params": len(PARAMS), "n_inds": len(INDS)}, fh,
              ensure_ascii=False, indent=1)

wb.save(OUT)
print("OK ->", OUT)
print("02 列数:", len(PCOLS), "| 03 列数:", len(ICOLS), "| 09 行数:", len(crows))
print("01 布局:", pos1)
