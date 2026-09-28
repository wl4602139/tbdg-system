# -*- coding: utf-8 -*-
"""生成「指标 ↔ 参数 ↔ 分项」三级构成关系

产出：
  param_compose  参数编码 -> 构成说明（复合参数的拆分表达式；指标行则为取数构成）
  tree_rows      09 表行：指标 → 直接输入参数 → 复合参数的分项（递归展开到原子参数）
  pending        分项缺失的待确认项（源表未单列能源品种）
"""


def _role_short(role):
    if not role:
        return "参数"
    if role.startswith("单位指标值"):
        return "被计算量"
    if "分子" in role:
        return "分子"
    if "分母" in role:
        return "分母"
    if "加项" in role:
        return "加项"
    if "扣减" in role:
        return "扣减项"
    if "系数" in role:
        return "系数"
    if "维度" in role:
        return "维度"
    if "因子" in role:
        return "因子"
    return "参数"


# 源表说明中隐含、但未在「指标说明」里写成变量行的输入（补录）
IMPLICIT_INPUT = {
    11: [("EN-026", "取值", "原表该指标说明未列变量，指标定义明确等于「用水量（总量）」，故直接取 EN-026。")],
}


def build(rows, vrows, pitems, inds):
    PMAP = {r[0]: r for r in rows}

    def pname(c):
        r = PMAP.get(c)
        return r[1] if r else c

    def punit(c):
        r = PMAP.get(c)
        return (r[9] or "") if r else ""

    def pdesc(c):
        r = PMAP.get(c)
        return (r[8] or "") if r else ""

    def pcat(c):
        r = PMAP.get(c)
        return (r[7] or "") if r else ""

    def psrc(c):
        r = PMAP.get(c)
        return (r[14] or "") if r else ""

    def pway(c):
        r = PMAP.get(c)
        return (r[16] or "") if r else ""

    def pduty(c):
        r = PMAP.get(c)
        return (r[19] or "") if r else ""

    def pline(c):
        r = PMAP.get(c)
        return (r[5] or "—") if r else "—"

    def pproc(c):
        r = PMAP.get(c)
        return (r[6] or "—") if r else "—"

    # 工序组合 -> 品种 -> 数据项
    kp = {}
    for p in pitems:
        kp.setdefault((p["line"], p["process"]), {})[p["kind"]] = p
    kt_key = {p["code"]: (p["line"], p["process"]) for p in pitems if p["kind"] == "T"}

    # ---------------------------------------------------------- 复合参数分项
    def expand(code):
        """返回 (分项编码列表, 补充说明)"""
        if code in kt_key:
            line, proc = kt_key[code]
            d = kp[(line, proc)]
            subs = [d[k]["code"] for k in ("E", "S") if k in d]
            note = ""
            if "S" not in d:
                note = ("本工序除电力外的能源品种（蒸汽 / 天然气 / 热力等）源表未单列，"
                        "综合能耗值须由项目公司确认品种构成后补充对应参数编码。")
            return subs, note
        if code == "EN-P01":
            return (["EN-P02", "EN-P03", "EN-P04"],
                    "含电力、蒸汽、天然气三品种折标加总；热力品种源表未单列，如有须补建；"
                    "水（EN-P05）不计入综合能耗折标。")
        if code == "EN-013":
            return ([], "＝ Σ(EN-015 第 i 种能源消费量 × EN-016 第 i 种能源折标准煤系数) ÷ 1000；"
                        "品种覆盖 EN-001 电力、EN-006 天然气、EN-008 蒸汽（热量）、EN-009 热力、"
                        "EN-010~012 油品等，电力按当量值折标（FAC-001）。")
        if code == "EN-017":
            return ([], "涵盖自建新能源自发自用电量、绿电直连量、购入绿电及绿证对应电量等非化石能源品种，"
                        "各品种折标后加总；不含作为原料使用的能源。明细来源见 EN-003、EN-004、EN-005。")
        if code == "EN-018":
            return ([], "＝ EN-013 综合能源消费量 − 原料用能折标量，口径用于「非化石能源消费占比」分母。")
        if code == "EN-019":
            return ([], "＝ EN-017 非化石能源消费量 − 原料用能的非化石部分，口径用于「非化石能源消费占比」分子。")
        if code == "EN-015":
            return ([], "泛化维度项，实测取 EN-001 电力、EN-006 天然气、EN-008 蒸汽（热量）、EN-009 热力、"
                        "EN-010~012 油品等各能源品种实物消费量。")
        if code == "EN-020":
            return ([], "＝ EN-001 电力消费量（含市电与绿电，含公辅设备用电），与 EN-001 同源。")
        if code == "EN-032":
            return ([], "＝ EN-010 柴油 + EN-011 汽油 + EN-012 煤油（按体积折算合计）；"
                        "与按「t」计量的品种须经 FAC-015~017 密度系数换算，避免重复计量。")
        if code == "CAR-001":
            return ([], "＝ IND-004 总碳排放量，由 CAR-002~CAR-008 按公式加总后得出，本编码为对外引用口径。")
        return [], ""

    param_compose = {}
    for r in rows:
        code = r[0]
        subs, note = expand(code)
        if subs:
            s = "＝" + " + ".join("%s %s（%s）" % (c, pname(c), punit(c) or "—") for c in subs)
            if note:
                s += "；" + note
            param_compose[code] = s
        elif note:
            param_compose[code] = note

    # 泛化汇总口径参数：指向明细系列
    AGG_POINTER = {
        "EN-021": "全工厂各工序电力消费量合计；明细见 EN-KE01~EN-KE59「工序电力消费量（产线-工序）」，"
                  "开发取数必须使用明细编码。",
        "EN-022": "全工厂各工序蒸汽消费量合计（质量口径 t 或热量口径 GJ）；明细见 EN-KS01~EN-KS04，"
                  "开发取数必须使用明细编码。",
        "EN-023": "各工序天然气消费量合计；本指标体系未把天然气展开到工序级，"
                  "如需工序口径应由项目公司确认计量点后补充编码。",
        "EN-024": "各工序热力消费量合计；本指标体系未展开到工序级，工厂级见 EN-009。",
        "EN-025": "全工厂各工序综合能源消费量合计；明细见 EN-KT01~EN-KT15，开发取数必须使用明细编码。",
        "OUT-008": "工序 / 产品产量（通用分母）；已按产线-工序展开为 OUT-KM01~OUT-KM40，"
                   "产品级为 OUT-P01，开发取数必须使用明细编码。",
        "VAL-012": "各工序产品产值（通用分母）；已展开为 VAL-KG01~VAL-KG19，开发取数必须使用明细编码。",
    }
    for k, v in AGG_POINTER.items():
        if k in PMAP:
            param_compose[k] = v

    # 复合承载（一码多义）提示
    for k, v in {
        "OUT-P01": "本编码按「产品型号 × ERP 产品种类 × 电装产线大类」组合取值，单位随产品种类变化："
                   "变压器类＝万kVA、线缆类＝万km·mm²、开关柜 / 其他＝台套。"
                   "若需按产品大类分别汇总，建议按大类拆分为独立编码后再统计。",
        "EN-004": "复合单位已统一为「个（张）」计数，折电量 = 个数 × 1 MWh（1000 kWh），"
                  "折算电量进入 EN-003 口径时不得与物理绿电重复计量。",
    }.items():
        if k in PMAP:
            param_compose[k] = v

    # 其他系统内计算字段：取其「来源字段」中已写明的算式
    for r in rows:
        code = r[0]
        if code in param_compose:
            continue
        sf = str(r[15] or "")
        if sf.startswith("＝") or sf.startswith("="):
            param_compose[code] = sf.replace("=", "＝", 1) if sf.startswith("=") else sf

    # ---------------------------------------------------------- 指标构成
    byind = {}
    for v in vrows:
        byind.setdefault(v["ind_seq"], []).append(v)

    ind_compose = {}
    direct = {}
    for ind in inds:
        seq = ind["seq"]
        code = "IND-%03d" % seq
        vs = sorted([v for v in byind.get(seq, []) if v["idx"] > 0], key=lambda x: x["idx"])
        if not vs and seq in IMPLICIT_INPUT:
            vs = [{"param_code": c, "role": r, "desc": d} for c, r, d in IMPLICIT_INPUT[seq]]
        parts = []
        for v in vs:
            pc = v["param_code"]
            u = punit(pc) or v.get("unit") or "—"
            parts.append("%s · %s %s（%s）" % (_role_short(v["role"]), pc, pname(pc), u))
        if parts:
            ind_compose[code] = "　｜　".join(parts)
        else:
            ind_compose[code] = ("源表未给出可计算的输入参数，须按 GB/T 24067 / ISO 14067 方法"
                                 "另建核算模型（涉及原材料消耗、各类排放因子等），建议单独出具碳足迹核算附表。")
        direct[code] = vs

    # ---------------------------------------------------------- 09 表展开行
    tree_rows = []
    pending = []
    n = 0
    for ind in inds:
        seq = ind["seq"]
        code = "IND-%03d" % seq
        unit = ind["unit"].replace("km*mm2", "km·mm²")
        formula = ind.get("_formula", "—")
        vs = direct[code]
        if not vs:
            n += 1
            tree_rows.append([n, code, ind["name"], ind["short_section"], unit, formula,
                              1, "—", "—", "—", "无输入参数", "—", "—", "—", "—",
                              "—", "—", "—", ind_compose[code]])
            continue
        for v in vs:
            pc = v["param_code"] if isinstance(v, dict) else v[0]
            role = _role_short(v["role"])
            if pc == "—" or not pc:
                continue
            subs, extra = expand(pc)
            nature = "复合参数" if subs else "原子参数"
            n += 1
            tree_rows.append([n, code, ind["name"], ind["short_section"], unit, formula,
                              1, role, pc, pname(pc), nature, punit(pc) or "—", pcat(pc) or "—",
                              pline(pc), pproc(pc), psrc(pc) or "—", pway(pc) or "—",
                              pduty(pc) or "—",
                              "指标直接输入项。" + (pdesc(pc)[:60] if pdesc(pc) else "")])
            for sub in subs:
                ssubs, sextra = expand(sub)
                n += 1
                tree_rows.append([n, code, ind["name"], ind["short_section"], unit, formula,
                                  2, "分项", sub, pname(sub),
                                  "复合参数" if ssubs else "原子参数",
                                  punit(sub) or "—", pcat(sub) or "—",
                                  pline(sub), pproc(sub), psrc(sub) or "—", pway(sub) or "—",
                                  pduty(sub) or "—",
                                  "由「%s」拆分。" % pc + (sextra or ""),
                                  ])
                for s3 in ssubs:
                    n += 1
                    tree_rows.append([n, code, ind["name"], ind["short_section"], unit, formula,
                                      3, "分项", s3, pname(s3), "原子参数",
                                      punit(s3) or "—", pcat(s3) or "—",
                                      pline(s3), pproc(s3), psrc(s3) or "—", pway(s3) or "—",
                                      pduty(s3) or "—", "由「%s」拆分。" % sub])
    # ---------------------------------------------------------- 待确认项
    for ind in inds:
        seq = ind["seq"]
        code = "IND-%03d" % seq
        vs = direct[code]
        for v in vs:
            pc = v["param_code"] if isinstance(v, dict) else v[0]
            if pc in kt_key:
                line, proc = kt_key[pc]
                d = kp[(line, proc)]
                if "S" not in d:
                    pending.append([code, ind["name"], pc, pname(pc),
                                    "%s × %s" % (line, proc),
                                    "综合能耗（%s）与电力消费量（%s）为两个独立变量，说明本工序还存在非电能源品种，"
                                    "但源表未单列。" % (pc, d["E"]["code"] if "E" in d else "—"),
                                    "请项目公司确认该工序是否有蒸汽 / 天然气 / 热力计量点；"
                                    "如有，须补充对应参数编码后并入综合能耗折标计算。"])
    # 去重（同一 EN-KT 可能被多个指标引用）
    seen = set()
    up = []
    for p in pending:
        if p[2] in seen:
            continue
        seen.add(p[2])
        up.append(p)

    return param_compose, ind_compose, tree_rows, up
