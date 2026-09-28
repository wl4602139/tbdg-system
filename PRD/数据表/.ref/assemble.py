# -*- coding: utf-8 -*-
"""组装 V2.0 工作簿的行数据 -> rows_model.json

统一参数表 = 公共参数（工厂级/主数据/系数）+ 产品级 + 工序级 + 指标定义
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
V1 = os.path.join(os.path.dirname(HERE), ".双中心能碳管控平台_基础参数与指标字典_V1.0.ref")
sys.path.insert(0, V1)
sys.path.insert(0, HERE)

import data_params as dp          # noqa: E402
import data_zc                    # noqa: E402
from data_dicts import SOURCES, ENUMS  # noqa: E402

M = json.load(open(os.path.join(HERE, "model.json"), encoding="utf-8"))
INDS = M["indicators"]
PITEMS = M["process_items"]
PROD = M["product_items"]
VROWS = M["var_rows"]

# ================================================================ 参数表列定义
COLS = ["序号", "参数编码", "参数名称", "颗粒度层级", "数据类型", "变量符号（原表）",
        "所属产线", "所属工序", "数据类别", "数据说明", "单位", "数据格式", "小数位",
        "取值范围", "默认值", "数据来源", "来源字段 / 表", "获取方式",
        "采集 / 更新频率", "是否必填", "责任单位", "关联指标编码",
        "指标构成 / 参数构成（细分项）", "校验规则", "备注"]

# V1.0 中属于「工序 / 产线」泛化口径的编码 -> 汇总说明
AGGREGATE = {
    "EN-021": "工序 / 产线电力消费量",
    "EN-022": "工序 / 产线蒸汽消费量",
    "EN-023": "工序 / 产线天然气消费量",
    "EN-024": "工序 / 产线热力消费量",
    "EN-025": "工序 / 产线综合能源消费量",
    "OUT-003": "工序铜产量",
    "OUT-004": "工序铝产量",
    "OUT-005": "非晶合金铁心产量",
    "OUT-006": "硅钢铁心产量",
    "OUT-007": "电容器产量",
    "OUT-008": "工序 / 产品产量（通用）",
    "VAL-012": "工序产值",
}
AGG_REMARK = {
    "EN-021": "【汇总口径】本编码为全工厂工序电力消费量合计，明细数据项见 EN-KE01~EN-KE59。开发取数请使用明细编码，本编码仅用于校验合计。",
    "EN-022": "【汇总口径】明细见 EN-KS01~EN-KS04。",
    "EN-023": "【汇总口径】产品级口径明细见 EN-P04；工序级暂只需采集产品级。",
    "EN-024": "【汇总口径】本次指标体系未展开到工序级热力，明细见 EN-009 工厂级。",
    "EN-025": "【汇总口径】明细见 EN-KT01~EN-KT15。",
    "OUT-003": "【汇总口径】铜产量明细按产线展开，见 OUT-KM01 起的「工序产品产量（线缆-*-拉丝·铜）」系列。",
    "OUT-004": "【汇总口径】铝产量明细见「工序产品产量（线缆-*-拉丝·铝）」系列。",
    "OUT-005": "【汇总口径】明细见「工序产品产量（非晶合金铁心-退火）」。",
    "OUT-006": "【汇总口径】明细见「工序产品产量（硅钢铁心-*）」系列。",
    "OUT-007": "【汇总口径】明细见「工序产品产量（电容器-*）」系列。",
    "OUT-008": "【汇总口径】原表分母统一表述为「工序 / 产品产量」，实际已按产线-工序展开为 OUT-KM01~OUT-KM40 与 OUT-P01，请勿直接使用本编码取数。",
    "VAL-012": "【汇总口径】明细见 VAL-KG01~VAL-KG19。",
}

# 工序级数据项属性模板
MED_ATTR = {
    "电力": ("能源计量系统 / 产线工序电表", "能源计量系统.产线-工序计量点.正向有功电量累计值",
             "自动采集", "月度", "各项目公司能源管理岗", "数值（0 位小数）", "0",
             "≥ 0，≤ 该产线总电量", "非负、与计量点绑定、按月累计、单位 kWh"),
    "蒸汽": ("能源计量系统 / 蒸汽流量计", "能源计量系统.产线-工序计量点.蒸汽累计流量",
             "自动采集", "月度", "各项目公司能源管理岗", "数值（2 位小数）", "2",
             "≥ 0", "非负、与计量点绑定、按月累计、单位 t"),
    "综合能源": ("能源计量系统（各能源品种折算汇总）", "由本工序电力、蒸汽等品种折算汇总",
               "计算", "月度", "各项目公司能源管理岗", "数值（3 位小数）", "3",
               "≥ 0", "非负、= Σ(本工序各能源品种消费量 × 折标准煤系数) ÷ 1000"),
    "产量": ("ERP / MES 生产工单与入库记录", "ERP.生产入库单.产量（按产线-工序归集）",
           "系统接口", "月度", "各项目公司生产管理岗", "数值（2 位小数）", "2",
           "≥ 0", "非负、须能与产线-工序主数据对应、按月归集"),
    "产值": ("ERP 财务 / 生产模块", "ERP.产值报表.工序归集产值",
           "系统接口", "月度", "各项目公司财务岗", "数值（2 位小数）", "2",
           "≥ 0", "非负、口径与产量一致、按月归集"),
}

DEC_BY_UNIT = {"kWh": ("数值（0 位小数）", "0"), "t": ("数值（3 位小数）", "3"),
               "tce": ("数值（3 位小数）", "3"), "万元": ("数值（2 位小数）", "2"),
               "万kVA": ("数值（3 位小数）", "3"), "kvar": ("数值（2 位小数）", "2"),
               "km·mm²": ("数值（2 位小数）", "2")}

rows = []          # 参数表行（24 列）
meta = []          # 与参数表行同序：颗粒度分组键，用于分组着色

IND_BY_SEQ = {i["seq"]: i for i in INDS}

CTR_SHORT = {"集控": "集控中心", "集采": "集采中心"}
CTR_OWNER = {"集控": "电装集控中心", "集采": "电装集采中心"}

# 既有参数在数据需求清单中的对应项（写入备注，便于双向追溯）
REMARK_PATCH = {
    "EN-002": "【清单对应】数据需求清单9.16 第 7 项「累计市电电量（表底值）| MWh」；本编码为其 kWh 统一存储口径，大屏按 MWh 展示见 LD-001。",
    "EN-003": "【清单对应】数据需求清单9.16 第 13 项「购买绿电量 | MWh」；本编码为 kWh 口径，对应 GV-001。",
    "EN-004": "【清单对应】数据需求清单9.16 第 14 项「购买绿证量 | 个」；单位口径已由「张 / MWh」统一为「个（张）」，折电量 = 个数 × 1 MWh，对应 GV-002。",
    "EN-005": "【清单对应】数据需求清单9.16 第 6 / 8 项「累计发电量」「累计消纳电量」，对应 NE-001 / NE-002。",
    "EN-006": "【清单对应】数据需求清单9.16 第 60 项「天然气量 | m³」；对应费用科目见 CO-002。",
    "EN-007": "【清单对应】数据需求清单9.16 第 61 项「外购蒸汽量 | t」（原备注：自己产的不纳入统计范围）。清单口径仅指外购部分，已单列为 EN-031；本编码为含自产的消费总量。",
    "EN-020": "【清单对应】数据需求清单9.16 第 12 项「累计负荷用电量（表底值）| MWh」，对应 LD-002。",
    "EN-026": "【清单对应】数据需求清单9.16 第 59 项「用水量 | t」；对应费用科目见 CO-001。",
    "VAL-001": "【清单对应】数据需求清单9.16 第 66 项「工业增加值（月度、年度）| 万元」，数据对象＝工厂整体。",
    "VAL-002": "【清单对应】数据需求清单9.16 第 67 项「产值 | 万元」，原备注：线缆到产线，变压器到项目公司。",
    "EQ-001": "【清单对应】数据需求清单9.16 第 64 项「达到或优于能效强制性国家标准 2 级的设备明细」，明细见 EQ-003。",
    "EQ-002": "【清单对应】数据需求清单9.16 第 65 项「纳入统计范围装备明细」，明细见 EQ-004。",
    "ORG-008": "【清单对应】数据需求清单9.16 第 75 项「生产单元-能耗计量绑定关系」。本编码为主键定义；MT-002 为同数据的域归属登记。",
    "OUT-001": "【清单对应】数据需求清单V1.0 (8.27) 第 56 项「产量（非线缆产业，项目公司）」。9.16 版该项已由「订单信息」与「生产单元能耗计量数据」替代，本编码继续保留作为工厂级产量口径。",
    "OUT-002": "【清单对应】数据需求清单V1.0 (8.27) 第 55 项「产量（线缆，分产线）| km」。9.16 版该项已由「订单信息」与「生产单元能耗计量数据」替代；注意 8.27 清单单位为 km，本编码单位为 万km·mm²，换算须补充截面数据。",
    "CAR-010": "【清单对应】数据需求清单9.16 集采中心第 1 项「开展产品碳足迹核算的类别」，明细清单见 OD-004。",
    "CAR-011": "【清单对应】数据需求清单9.16 集采中心第 2 项「主要产品类别」，明细清单见 OD-005。",
}


# ---------------------------------------------------------------- 1. 公共参数
for p in dp.PARAMS:
    code = p[0]
    level = "工厂级"
    if code.startswith("ORG-"):
        level = "组织主数据"
    elif code.startswith("MD-"):
        level = "生产主数据"
    elif code.startswith("FAC-"):
        level = "计算系数"
    elif code.startswith("EQ-"):
        level = "设备台账"
    elif code.startswith("EN-014"):
        level = "统计维度"
    d_type = "主数据" if code.startswith(("ORG-", "MD-")) else ("计算系数" if code.startswith("FAC-") else "实测值/接口值")
    remark = p[18]
    related = p[16]
    if code in AGGREGATE:
        level = "工序级（汇总口径）"
        remark = AGG_REMARK[code] + ("　原备注：" + remark if remark not in ("—", "") else "")
        d_type = "汇总计算值"
    if code == "EN-013":
        remark = "【汇总口径】组织级综合能源消费量，= 各能源品种消费量折标准煤后加总（见 IND-003）。" + ("" if remark in ("—", "") else "　原备注：" + remark)
    if code in REMARK_PATCH:
        remark = REMARK_PATCH[code] + ("" if remark in ("—", "") else "　原备注：" + remark)
    rows.append([p[0], p[1], level, d_type, p[2], "", "", p[3], p[4], p[5], p[6],
                 p[7] if p[7] not in ("", None) else "—", p[8], p[9], p[10], p[11],
                 p[12], p[13], p[14], p[15], related, p[17], p[18]])
    meta.append("公共参数")

# ---------------------------------------------------------------- 1b. V2.1 新增：既有域补充
SUPP = {"EN-030", "EN-031", "EN-032", "FAC-014", "FAC-015", "FAC-016", "FAC-017"}
supp_rows = sorted([r for r in data_zc.ROWS if r[0] in SUPP], key=lambda r: r[0])
zc_rows = [r for r in data_zc.ROWS if r[0] not in SUPP]
for r in supp_rows:
    rows.append(list(r))
    meta.append("既有域补充")

# ---------------------------------------------------------------- 1c. V2.1 新增：零碳园区与集控中心数据域
ZC_DOMAIN = ["ZP-", "NE-", "LD-", "GV-", "RV-", "EQ-", "HV-", "CO-", "OD-", "MT-"]


def _zc_key(r):
    code = r[0]
    for i, p in enumerate(ZC_DOMAIN):
        if code.startswith(p):
            tail = code[len(p):]
            return (i, int(tail) if tail.isdigit() else 0)
    return (len(ZC_DOMAIN), 0)


for r in sorted(zc_rows, key=_zc_key):
    rows.append(list(r))
    meta.append("集控中心数据域")

# ---------------------------------------------------------------- 2. 产品级数据项
for it in PROD:
    inds = it["inds"]
    rel = "、".join("IND-%03d" % s for s in inds)
    relnm = "、".join(IND_BY_SEQ[s]["name"] for s in inds)
    fmt, dec = DEC_BY_UNIT.get(it["unit"], ("数值", "2"))
    rows.append([it["code"], it["name"], "产品级", "接口值 / 计算值", it["sym"], "", "",
                 it["data_class"], it["desc"], it["unit"], fmt, dec, "≥ 0", "—",
                 it["src"], "ERP / 能源计量系统（按型号-种类-产线分摊）", it["way"],
                 it["freq"], "是", it["duty"],
                 rel + "（" + relnm + "）",
                 "非负；须先完成「型号-产品种类-产线」映射（MD-005）与能源分摊",
                 "颗粒度：产品型号 × ERP 产品种类 × 电装产线大类。原表变量符号「%s」。" % it["sym"]])
    meta.append("产品级数据项")

# ---------------------------------------------------------------- 3. 工序级数据项
for it in PITEMS:
    kind = it["kind"]
    medium = it["medium"] or ("产量" if kind == "M" else "产值")
    a = MED_ATTR[medium]
    fmt, dec = DEC_BY_UNIT.get(it["unit"], (a[5], a[6]))
    rel = "、".join("IND-%03d" % s for s in it["inds"])
    relnm = "、".join(IND_BY_SEQ[s]["name"] for s in it["inds"])
    name = it["name"]
    # 源表文字勘误归一：「电能源消费量」应为「电力消费量」（原表全表统一笔误）
    desc_clean = it["desc"].replace("电能源消费量", "电力消费量").replace("电能源消耗量", "电力消耗量")
    _mat = (it.get("material") or "").strip()
    if _mat:
        _mat = {"Cu": "铜", "Al": "铝"}.get(_mat, _mat)
        desc_clean = desc_clean.rstrip("。") + "（计量对象：%s）" % _mat
    rows.append([it["code"], name, "工序级", "实测值" if medium != "综合能源" else "计算值",
                 it["sym"], it["line"], it["process"], it["data_class"],
                 desc_clean + "。", it["unit"], fmt, dec, a[7], "—",
                 a[0], a[1], a[2], a[3], "是", a[4],
                 rel + "（" + relnm + "）", a[8],
                 "颗粒度：产线「%s」× 工序「%s」%s。原表变量符号「%s」。"
                 % (it["line"], it["process"],
                    ("× 物料「" + it["material"] + "」") if it["material"] else "",
                    it["sym"])])
    meta.append("工序级数据项")

# ---------------------------------------------------------------- 4. 指标定义
for i in INDS:
    code = "IND-%03d" % i["seq"]
    level = "指标·" + i["short_section"]
    unit = i["unit"].replace("km*mm2", "km·mm²")
    desc = i["definition"] or "—"
    note_lines = [x.strip() for x in i["note"].split("\n") if x.strip()]
    remark = "；".join(note_lines[1:]) if len(note_lines) > 1 else "—"
    rows.append([code, i["name"], level, "指标值", "", "", "",
                 "指标 / " + i["short_section"], desc, unit, "数值", "—", "—", "—",
                 i["src"] or "—", "由基础数据项按公式计算",
                 "系统自动计算", i["cat"] or "—",
                 "—", CTR_OWNER.get(i["center"], i["center"]),
                 "由本指标公式决定",
                 "见「03-指标清单」", remark if remark else "—"])
    meta.append("指标定义")

# ---------------------------------------------------------------- 5. 规范计算公式
FORMULA_FIX = {
    1: "按 GB/T 24067、ISO 14067 方法核算（摇篮到大门）",
    2: "CAR-010 ÷ CAR-011 × 100",
    3: "Σ( EN-015 × EN-016 ) ÷ 1000",
    4: "( CAR-002 + CAR-003 + CAR-004 + CAR-006 ) − ( CAR-005 + CAR-007 + CAR-008 )",
    5: "CAR-001 ÷ EN-013",
    6: "EN-019 ÷ EN-018 × 100",
    7: "EN-005 ÷ EN-020 × 100",
    8: "EN-013 ÷ VAL-001",
    9: "EQ-001 ÷ EQ-002 × 100",
    10: "EN-013 ÷ VAL-002",
    11: "EN-026",
    12: "EN-P01 ÷ OUT-P01",
    13: "EN-P02 ÷ OUT-P01",
    14: "EN-P03 ÷ OUT-P01",
    15: "EN-P04 ÷ OUT-P01",
    16: "EN-P05 ÷ OUT-P01",
}


def build_formula(i):
    if i["seq"] in FORMULA_FIX:
        return FORMULA_FIX[i["seq"]]
    vs = [v for v in i["vars"]]
    nums = [v["param_code"] for v in vs if v["role"].startswith("分子")]
    dens = [v["param_code"] for v in vs if v["role"].startswith("分母")]
    if len(nums) == 1 and len(dens) == 1:
        return "%s ÷ %s" % (nums[0], dens[0])
    if nums and not dens:
        return nums[0]
    return "—"


# ---------------------------------------------------------------- 6. 指标清单行
IND_COLS = ["指标编码", "指标名称", "指标体系", "所属中心", "指标层级", "指标定义",
            "规范计算公式", "最小颗粒度输入项", "指标说明（原表）", "指标单位",
            "指标类别", "指标来源", "指标用途", "覆盖范围", "所需各单位数据",
            "各单位所需开展工作", "依赖基础参数", "开发实现要点"]

ind_rows = []
for i in INDS:
    code = "IND-%03d" % i["seq"]
    f = build_formula(i)
    items = [v["param_code"] for v in i["vars"] if v["param_code"] and v["idx"] > 0]
    items = [x for x in items if x]
    allparams = sorted(set(v["param_code"] for v in i["vars"]
                           if v["param_code"] and v["param_code"] != code))
    tip = ""
    if i["short_section"] == "关键工序":
        tip = "分子取「本产线-本工序」能源计量点读数，分母取同产线同工序产量/产值，两者期间必须一致。"
    elif i["short_section"] == "产品管控":
        tip = "须先建立「产品型号 × ERP 产品种类 × 电装产线大类」映射并完成能源分摊。"
    else:
        tip = "组织级口径，按项目公司分别计算后再汇总。"
    ind_rows.append([code, i["name"], i["short_section"], CTR_SHORT.get(i["center"], i["center"]),
                     i["cat"], i["definition"] or "—", f, "\n".join(items) if items else "—",
                     i["note"], i["unit"].replace("km*mm2", "km·mm²"), i["cat"],
                     i["src"] or "—", i["usage"] or "—", i["scope"] or "—",
                     i["need"] or "—", i["work"] or "—", "、".join(allparams), tip])

from_dict = None

import compose  # noqa: E402
import reqdata  # noqa: E402

REQ_ROWS, REQ916 = reqdata.build()

# ---------------------------------------------------------------- 7. 构成关系（V2.2）
_inds_c = []
for _i, _r in zip(INDS, ind_rows):
    _d = dict(_i)
    _d["_formula"] = _r[6]
    _inds_c.append(_d)

PARAM_COMPOSE, IND_COMPOSE, TREE_ROWS, PENDING = compose.build(rows, VROWS, PITEMS, _inds_c)
for _r in rows:
    _c = IND_COMPOSE.get(_r[0]) or PARAM_COMPOSE.get(_r[0]) or "—"
    _r.insert(21, _c)          # 置于「关联指标编码」之后
for _r in ind_rows:
    _r.append(IND_COMPOSE.get(_r[0], "—"))   # 03 表新增「参数构成（细分项）」列


def _esc_eq(rows_):
    """兜底：以「=」开头的文本会被 Excel 解析为公式，统一改为全角等号"""
    n = 0
    for _r in rows_:
        for _j, _v in enumerate(_r):
            if isinstance(_v, str) and _v.startswith("="):
                _r[_j] = "＝" + _v[1:]
                n += 1
    return n


_nfix = _esc_eq(rows) + _esc_eq(ind_rows) + _esc_eq(TREE_ROWS)
if _nfix:
    print("全角化等号前缀:", _nfix, "处")

out = {"params": rows, "param_meta": meta, "inds": ind_rows,
       "var_rows": VROWS, "sources": SOURCES, "enums": ENUMS,
       "pitems": PITEMS, "prod": PROD,
       "ind_compose": IND_COMPOSE, "param_compose": PARAM_COMPOSE,
       "tree_rows": TREE_ROWS, "pending": PENDING,
       "req_rows": REQ_ROWS, "req_counts": {"916": len(REQ916), "827only": len(REQ_ROWS) - len(REQ916)}}
with open(os.path.join(HERE, "rows_model.json"), "w", encoding="utf-8") as fh:
    json.dump(out, fh, ensure_ascii=False)
print("params rows:", len(rows), "| 列数:", len(rows[0]))
print("inds rows:", len(ind_rows))
print("tree rows:", len(TREE_ROWS), "| 待确认分项:", len(PENDING))
print("req rows:", len(REQ_ROWS), "| 9.16 items:", len(REQ916))
print("新增参数:", len(supp_rows) + len(zc_rows), "= 既有域补充", len(supp_rows), "+ 集控中心数据域", len(zc_rows))
