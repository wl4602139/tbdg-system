# -*- coding: utf-8 -*-
"""从《"双中心"项目能碳管控指标体系》.et 解析指标与最小颗粒度数据项。

输出 .ref/model.json
"""
import xlrd
import json
import re
import os
from collections import OrderedDict, defaultdict

SRC = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                   "“双中心”项目能碳管控指标体系（9.16）V1.7.et")
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "model.json")


def clean(s):
    if s is None:
        return ""
    s = str(s).replace("\u3000", " ")
    s = s.replace("\r\n", "\n").replace("\r", "\n")
    lines = [re.sub(r"[ \t]+", " ", x).strip() for x in s.split("\n")]
    return "\n".join([x for x in lines if x]).strip()


def cell(sheet, r, c):
    v = sheet.cell_value(r, c)
    if isinstance(v, float) and v == int(v):
        v = int(v)
    return clean(v)


# ---------------------------------------------------------------- 读取源表
def read_source():
    wb = xlrd.open_workbook(SRC)
    sh = wb.sheet_by_index(0)
    inds = []
    sec = ""
    for r in range(2, sh.nrows):
        b = cell(sh, r, 1)
        if b and not b.isdigit():
            sec = b
            continue
        if not b:
            continue
        inds.append(OrderedDict([
            ("seq", int(float(b))),
            ("name", cell(sh, r, 2)),
            ("section", sec),
            ("definition", cell(sh, r, 3)),
            ("formula", cell(sh, r, 4)),
            ("note", cell(sh, r, 5)),
            ("unit", cell(sh, r, 6)),
            ("center", cell(sh, r, 7)),
            ("cat", cell(sh, r, 8)),
            ("src", cell(sh, r, 9)),
            ("usage", cell(sh, r, 10)),
            ("scope", cell(sh, r, 11)),
            ("need", cell(sh, r, 12)),
            ("work", cell(sh, r, 13)),
        ]))
    return inds


SEC_SHORT = {
    "经营单位及项目公司整体指标（重点对标国家零碳工厂要求）": "整体指标",
    "产品管控指标（最小到型号级别）": "产品管控",
    "关键工序管控指标（分产业设置，管控能耗较高的工序）": "关键工序",
}

CTR = {"集控": "集控中心", "集采": "集采中心"}


# ---------------------------------------------------------------- 变量切分
def seg_vars(note):
    """按行 + 分号切分「符号：说明」"""
    out = []
    for ln in (note or "").split("\n"):
        ln = ln.strip().rstrip("。")
        if not ln:
            continue
        for seg in re.split(r"[；;]", ln):
            seg = seg.strip().rstrip("。")
            if not seg:
                continue
            m = re.match(r"^([^：:]{1,60})[：:](.*)$", seg)
            if not m:
                continue
            sym = m.group(1).strip().replace("=", "-").replace(" ", "")
            desc = m.group(2).strip()
            out.append((sym, desc))
    return out


UNIT_PAT = re.compile(r"单位\s*[为是]?\s*[：:]?\s*([^，。；、）)]+)")


def pull_unit(desc):
    m = UNIT_PAT.search(desc)
    u = m.group(1).strip() if m else ""
    u = u.replace("km*mm2", "km·mm²").replace("km·mm²", "km·mm²")
    u = re.sub(r"[，。；、\s]+$", "", u)
    return u


def strip_unit(desc):
    d = UNIT_PAT.sub("，", desc)
    d = re.sub(r"[，、]?\s*单位\s*[为是]?\s*[：:]?\s*[^，。；、）)]*[，。；、)]?", "，", d)
    d = re.sub(r"^[，。；、\s]+", "", d)
    d = re.sub(r"[，。；、\s]+$", "", d)
    d = re.sub(r"[，]{2,}", "，", d)
    return d.strip("，。 ")


# ---------------------------------------------------------------- 颗粒度
# 工序级指标名称括号内 = 产线大类[-子产线]-工序
def split_line_process(name):
    ms = re.findall(r"[（(]([^（）()]+)[）)]", name)
    inner = ms[-1].strip() if ms else ""
    if not inner:
        return "", "", ""
    parts = [p.strip() for p in re.split(r"[-–—]", inner) if p.strip()]
    if len(parts) >= 3:
        return "-".join(parts[:-1]), parts[-2], parts[-1]
    if len(parts) == 2:
        return parts[0], "", parts[1]
    return parts[0], "", ""


# 变量符号 -> 介质 / 物料
def var_medium(sym, desc, ind_unit):
    if "蒸汽" in sym:
        return "蒸汽"
    if "天然气" in sym:
        return "天然气"
    if "水" in sym:
        return "水"
    if sym.startswith("E") or sym.startswith("e"):
        return "综合能源"
    if sym.startswith("Q") or sym.startswith("q"):
        return "电力"
    return ""


def var_material(sym, desc, ind_name):
    m = re.search(r"(Cu|Al)\b", sym)
    if m:
        return {"Cu": "铜", "Al": "铝"}[m.group(1)]
    if "铜" in sym or "铜" in desc:
        return "铜"
    if "铝" in sym or "铝" in desc:
        return "铝"
    return ""


# 数据类别（按介质/产量/产值）
def data_class(sym):
    if re.match(r"^[Qq]", sym):
        return "能源数据"
    if re.match(r"^[Ee]", sym):
        return "能源数据"
    if re.match(r"^M", sym):
        return "产量数据"
    if re.match(r"^G", sym):
        return "产值数据"
    return "其他"


# 变量角色
ROLE_MAIN = "单位指标值（即本指标被计算量）"
ROLE_NUM = "分子·能源消费量"
ROLE_DEN = "分母·产量/产值"


def var_role(sym, idx, ind=None, medium=""):
    """角色按「位置语义」判定，比重按符号前缀判定更可靠。"""
    if idx == 0:
        return ROLE_MAIN
    seq = ind["seq"] if ind else -1
    if seq == 3:                       # 综合能源消费量：n / Ei / ki
        return [ROLE_MAIN, "维度（能源品种计数）", "因子（第 i 种能源消费量）",
                "系数（第 i 种能源折标准煤系数）"][idx]
    if seq == 4:                       # 总碳排放量：加项 - 扣减项
        if sym.startswith("C输出") or "回收" in sym:
            return "扣减项·碳排放分量"
        return "加项·碳排放分量"
    sec = ind["short_section"] if ind else ""
    if idx == 1:
        if sym.startswith("M"):
            return "分子·产量"
        if sym.startswith("G"):
            return "分子·产值"
        return "分子·能源消费量（%s）" % medium if medium and sec == "关键工序" else "分子"
    if idx == 2:
        if sym.startswith("M"):
            return "分母·产量"
        if sym.startswith(("G", "V")):
            return "分母·产值"
        return "分母·能源消费量" if sec == "关键工序" else "分母"
    return "参数"


# ---------------------------------------------------------------- 汇总口径（工厂级）
SCOPE_HINT = {
    "整体指标": "工厂级",
    "产品管控": "产品级",
    "关键工序": "工序级",
}

# 数据来源描述（依来源类型）
SRC_KIND = {
    "电力": ("能源计量系统 / 电表", "自动采集", "月度", "各项目公司能源管理岗"),
    "蒸汽": ("能源计量系统 / 流量计", "自动采集", "月度", "各项目公司能源管理岗"),
    "天然气": ("能源计量系统 / 流量计", "自动采集", "月度", "各项目公司能源管理岗"),
    "水": ("水务计量系统", "自动采集", "月度", "各项目公司能源管理岗"),
    "综合能源": ("能源计量系统（各能源品种折算汇总）", "计算", "月度", "各项目公司能源管理岗"),
}

MEASURE_KIND = {
    "产量数据": ("ERP / MES 生产工单与入库记录", "系统接口", "月度", "各项目公司生产管理岗"),
    "产值数据": ("ERP 财务/生产模块", "系统接口", "月度", "各项目公司财务岗"),
}

PROD_IND_SEQ = {12: ["EN-P01", "OUT-P01"], 13: ["EN-P02", "OUT-P01"],
                14: ["EN-P03", "OUT-P01"], 15: ["EN-P04", "OUT-P01"],
                16: ["EN-P05", "OUT-P01"]}

# 整体指标（IND-001~011）变量 -> 「02-基础参数表」公共参数编码
OVERALL_VARMAP = {
    (2, "Ncf"): "CAR-010", (2, "N"): "CAR-011",
    (3, "n"): "EN-014", (3, "Ei"): "EN-015", (3, "ki"): "EN-016",
    (4, "C燃烧"): "CAR-002", (4, "C过程"): "CAR-003", (4, "C购入电"): "CAR-004",
    (4, "C输出电"): "CAR-005", (4, "C购入热"): "CAR-006",
    (4, "C输出热"): "CAR-007", (4, "C回收利用"): "CAR-008",
    (5, "C"): "CAR-001", (5, "E"): "EN-013",
    (6, "R"): "EN-019", (6, "E"): "EN-018",
    (7, "Ez"): "EN-005", (7, "Q"): "EN-020",
    (8, "E"): "EN-013", (8, "Gnva"): "VAL-001",
    (9, "Res"): "EQ-001", (9, "Ets"): "EQ-002",
    (10, "E"): "EN-013", (10, "G"): "VAL-002",
}


def main():
    inds = read_source()
    rec = []           # 全部指标
    items = []         # 最小颗粒度数据项
    var_rows = []      # 变量映射

    for i in inds:
        short = SEC_SHORT.get(i["section"], i["section"])
        i["short_section"] = short
        i["scope_level"] = SCOPE_HINT.get(short, "")
        vs = seg_vars(i["note"])
        line, sub, proc = split_line_process(i["name"])

        vlist = []
        for idx, (sym, desc) in enumerate(vs):
            medium = var_medium(sym, desc, i["unit"])
            material = var_material(sym, desc, i["name"])
            unit = pull_unit(desc)
            vlist.append(OrderedDict([
                ("sym", sym), ("idx", idx), ("desc", desc),
                ("meaning", strip_unit(desc)), ("unit", unit),
                ("role", var_role(sym, idx, i, medium)),
                ("medium", medium), ("material", material),
                ("line", line), ("sub_line", sub), ("process", proc),
            ]))
        i["vars"] = vlist
        rec.append(i)

    # ---------------- 工序级最小颗粒度数据项 ----------------
    # key = (kind, 产线, 工序, 物料) kind ∈ E/S/T(综合)/M/G
    KIND_ORDER = ["E", "S", "T", "M", "G"]
    KIND_NAME = {
        "E": ("EN", "工序电力消费量"),
        "S": ("EN", "工序蒸汽消费量"),
        "T": ("EN", "工序综合能源消费量"),
        "M": ("OUT", "工序产品产量"),
        "G": ("VAL", "工序产品产值"),
    }
    KIND_SUFFIX = {"E": "KE", "S": "KS", "T": "KT", "M": "KM", "G": "KG"}

    buckets = OrderedDict()
    for i in rec:
        if i["short_section"] != "关键工序":
            continue
        if len(i["vars"]) != 3:
            continue
        v_main, v_num, v_den = i["vars"]
        if v_num["medium"] == "电力":
            k = "E"
        elif v_num["medium"] == "蒸汽":
            k = "S"
        else:
            k = "T"
        key = (k, v_num["line"], v_num["process"], v_num["material"])
        buckets.setdefault(key, {"num": v_num, "inds": []})
        buckets[key]["inds"].append((i, "num"))
        dk = ("M" if re.match(r"^M", v_den["sym"]) else "G",
              v_den["line"], v_den["process"], v_den["material"])
        buckets.setdefault(dk, {"num": v_den, "inds": []})
        buckets[dk]["inds"].append((i, "den"))

    seqs = defaultdict(int)
    key2code = {}
    for key in sorted(buckets.keys(), key=lambda x: (KIND_ORDER.index(x[0]), x[1], x[2], x[3])):
        k, line, proc, material = key
        seqs[k] += 1
        domain, base = KIND_NAME[k]
        code = "%s-%s%02d" % (domain, KIND_SUFFIX[k], seqs[k])
        key2code[key] = code
        b = buckets[key]
        v = b["num"]
        name = base
        if line:
            name = "%s（%s%s）" % (base, line, ("-" + proc) if proc else "")
        if material:
            name = name.rstrip("）") + "·" + material + "）"
        items.append(OrderedDict([
            ("code", code), ("kind", k), ("name", name),
            ("level", "工序级"), ("line", line), ("process", proc),
            ("material", material), ("medium", v["medium"]),
            ("sym", v["sym"]), ("desc", v["meaning"]), ("unit", v["unit"]),
            ("data_class", data_class(v["sym"])),
            ("inds", sorted(set(x[0]["seq"] for x in b["inds"]))),
        ]))

    # ---------------- 产品级数据项 ----------------
    prod_items = []
    PROD_DEF = [
        ("OUT-P01", "产品产量（型号 × 产品种类 × 产线大类）", "产量数据", "M", "万kVA / 万km·mm² / 台套 等",
         "统计期内，按「产品型号 × ERP 产品种类 × 电装产线大类」口径归集的入库产品产量。",
         "ERP / MES 生产工单与入库记录", "系统接口", "月度", "各项目公司生产管理岗"),
        ("EN-P01", "产品综合能源消费量（型号口径）", "能源数据", "E", "tce",
         "统计期内，归属到「产品型号 × ERP 产品种类 × 电装产线大类」口径的电、天然气、蒸汽、热力等全部能源折算后的综合能源消费量。",
         "能源计量系统（按型号分摊后汇总）", "计算", "月度", "各项目公司能源管理岗"),
        ("EN-P02", "产品电力消费量（型号口径）", "能源数据", "Q电", "kWh",
         "统计期内，归属到「产品型号 × ERP 产品种类 × 电装产线大类」口径的电力消费量（含市电与绿电、含公辅设备分摊量）。",
         "能源计量系统（按型号分摊后汇总）", "计算", "月度", "各项目公司能源管理岗"),
        ("EN-P03", "产品蒸汽消费量（型号口径）", "能源数据", "Q蒸汽", "GJ",
         "统计期内，归属到「产品型号 × ERP 产品种类 × 电装产线大类」口径的蒸汽消费量（热量口径）。",
         "能源计量系统（按型号分摊后汇总）", "计算", "月度", "各项目公司能源管理岗"),
        ("EN-P04", "产品天然气消费量（型号口径）", "能源数据", "Q天然气", "m³",
         "统计期内，归属到「产品型号 × ERP 产品种类 × 电装产线大类」口径的天然气消费量。",
         "能源计量系统（按型号分摊后汇总）", "计算", "月度", "各项目公司能源管理岗"),
        ("EN-P05", "产品水消费量（型号口径）", "能源数据", "Q水", "t",
         "统计期内，归属到「产品型号 × ERP 产品种类 × 电装产线大类」口径的取水量。",
         "水务计量系统（按型号分摊后汇总）", "计算", "月度", "各项目公司能源管理岗"),
    ]

    PROD_IND_SEQ_LOCAL = PROD_IND_SEQ

    for code, name, dc, sym, unit, desc, src, way, freq, duty in PROD_DEF:
        used = sorted({s for s, cs in PROD_IND_SEQ.items() if code in cs})
        prod_items.append(OrderedDict([
            ("code", code), ("name", name), ("level", "产品级"),
            ("sym", sym), ("unit", unit), ("desc", desc), ("data_class", dc),
            ("line", ""), ("process", ""), ("material", ""), ("medium", ""),
            ("src", src), ("way", way), ("freq", freq), ("duty", duty),
            ("inds", used),
        ]))

    # ---------------- 变量映射表 ----------------
    for i in rec:
        for idx, v in enumerate(i["vars"]):
            if i["short_section"] == "关键工序" and len(i["vars"]) == 3 and idx > 0:
                if v["medium"] == "电力":
                    kk = "E"
                elif v["medium"] == "蒸汽":
                    kk = "S"
                elif idx == 1:
                    kk = "T"
                else:
                    kk = "M" if v["sym"].startswith("M") else "G"
                key = (kk, v["line"], v["process"], v["material"])
                code = key2code.get(key, "")
            elif i["short_section"] == "产品管控":
                # 变量顺序：0=单位指标值，1=能源消费量（按介质），2=产品产量
                if idx == 0:
                    code = ""
                elif idx == 2:
                    code = "OUT-P01"
                else:
                    code = "EN-P%02d" % (i["seq"] - 11)
            else:
                code = OVERALL_VARMAP.get((i["seq"], v["sym"]), "")
            if idx == 0:
                code = "IND-%03d" % i["seq"]
            v["param_code"] = code
            var_rows.append(OrderedDict([
                ("ind_seq", i["seq"]), ("ind_name", i["name"]),
                ("section", i["short_section"]),
                ("idx", idx), ("sym", v["sym"]), ("meaning", v["meaning"]),
                ("role", v["role"]), ("param_code", code),
                ("unit", v["unit"]), ("desc", v["desc"]),
                ("line", v["line"]), ("process", v["process"]),
                ("material", v["material"]), ("medium", v["medium"]),
            ]))

    model = OrderedDict([
        ("indicators", rec),
        ("process_items", items),
        ("product_items", prod_items),
        ("var_rows", var_rows),
    ])
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(model, f, ensure_ascii=False, indent=1)

    print("indicators:", len(rec))
    print("process items:", len(items))
    from collections import Counter
    print("  by kind:", Counter(x["kind"] for x in items))
    print("product items:", len(prod_items))
    print("var rows:", len(var_rows))
    miss = [r for r in var_rows if not r["param_code"] and r["section"] == "关键工序"]
    print("未映射工序变量:", len(miss))
    for m in miss[:10]:
        print("   ", m["ind_seq"], m["ind_name"], m["sym"])


if __name__ == "__main__":
    main()
