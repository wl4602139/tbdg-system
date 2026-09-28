# -*- coding: utf-8 -*-
"""sheet 01 的静态说明区块（V2.1，含集控中心数据域）"""
from xl_style import *  # noqa
from openpyxl.styles import Font, PatternFill, Alignment


def _h(ws, r, text):
    ws.cell(r, 1, text).font = Font(name="微软雅黑", size=12, bold=True, color=C_HEAD)
    return r + 1


def _note(ws, r, text, ncols=8, h=20, fill=None):
    ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=ncols)
    c = ws.cell(r, 1, text)
    c.font = F_SMALL
    c.alignment = AL_WRAP
    if fill:
        c.fill = fill
    ws.row_dimensions[r].height = h
    return r + 1


def _table(ws, r, headers, rows2, widths_note=None):
    for j, h in enumerate(headers, start=1):
        c = ws.cell(r, j, h)
        c.font = F_HEAD
        c.fill = FILL_HEAD2
        c.alignment = AL_CTR
        c.border = BORDER
    ws.row_dimensions[r].height = 22
    r += 1
    for row in rows2:
        for j, v in enumerate(row, start=1):
            c = ws.cell(r, j, v)
            c.font = F_BODY
            c.border = BORDER
            c.alignment = AL_WRAP
        ws.row_dimensions[r].height = 30
        r += 1
    return r


def build_static(ws, r, params, pitems, prod, n_inds, n_vrows, info=None):
    info = info or {}

    def cnt(pred):
        return sum(1 for p in params if pred(p[0]))

    n_base = info.get("n_base", cnt(lambda c: True))
    n_supp = info.get("n_supp", 0)
    n_zc = info.get("n_zc", 0)

    # ---------------------------------------------- 三、编码规则
    r = _h(ws, r + 1, "【三】参数编码规则")
    r = _note(ws, r, "编码结构：<域>-<段><序号>。域表示数据类别；工序级数据项用两位段字母标识介质或性质，"
                     "序号为两位流水号，便于排序与人工识别；★ 标注为 V2.1 新增的数据域。", h=18)

    grp = [
        ("ORG-", "组织主数据（含生产单元、计量点）", "全局", cnt(lambda c: c.startswith("ORG-")), "ORG-008 生产单元-计量点绑定关系"),
        ("MD-", "生产主数据（型号 / 产线 / 工序 / 工单）", "全局", cnt(lambda c: c.startswith("MD-")), "MD-003 产线编码"),
        ("EN-0", "工厂级能源消费量", "工厂级", cnt(lambda c: c.startswith("EN-0")), "EN-013 综合能源消费量"),
        ("EN-P", "产品级能源消费量（型号口径）", "产品级", cnt(lambda c: c.startswith("EN-P")), "EN-P02 产品电力消费量"),
        ("EN-KE", "工序级电力消费量", "工序级", cnt(lambda c: c.startswith("EN-KE")), "EN-KE46 导线拉丝·铜电耗"),
        ("EN-KS", "工序级蒸汽消费量", "工序级", cnt(lambda c: c.startswith("EN-KS")), "EN-KS02 特高压器身干燥蒸汽"),
        ("EN-KT", "工序级综合能源消费量", "工序级", cnt(lambda c: c.startswith("EN-KT")), "EN-KT02 特高压器身干燥综合能耗"),
        ("OUT-KM", "工序级产品产量", "工序级", cnt(lambda c: c.startswith("OUT-KM")), "OUT-KM27 导线拉丝铜产量"),
        ("OUT-P", "产品级产品产量（型号口径）", "产品级", cnt(lambda c: c.startswith("OUT-P")), "OUT-P01 产品产量"),
        ("VAL-KG", "工序级产品产值", "工序级", cnt(lambda c: c.startswith("VAL-KG")), "VAL-KG08 钣金加工产值"),
        ("OUT-", "工厂级 / 汇总口径产量", "工厂级 / 汇总", cnt(lambda c: c.startswith("OUT-") and not c.startswith(("OUT-KM", "OUT-P"))), "OUT-001 产品产量（变压器）"),
        ("VAL-", "工厂级 / 汇总口径产值", "工厂级 / 汇总", cnt(lambda c: c.startswith("VAL-") and not c.startswith("VAL-KG")), "VAL-001 工业增加值"),
        ("CAR-", "碳排放数据", "工厂级", cnt(lambda c: c.startswith("CAR-")), "CAR-001 二氧化碳排放量"),
        ("EQ-0", "设备台账与重点设备运行数据", "工厂级 / 设备级 ★", cnt(lambda c: c.startswith("EQ-")), "EQ-005 重点设备用电功率"),
        ("FAC-", "计算系数（折标煤 / 排放因子 / 密度）", "全局", cnt(lambda c: c.startswith("FAC-")), "FAC-001 电力折标煤系数（当量值）"),
        ("IND-", "指标值（被计算量本身）", "指标", cnt(lambda c: c.startswith("IND-")), "IND-017 吨铜电耗（线缆-导线-拉丝）"),
        ("ZP-", "★ 零碳园区基础配置（静态台账）", "园区级", cnt(lambda c: c.startswith("ZP-")), "ZP-001 光伏装机量"),
        ("NE-", "★ 新能源发电与储能运行", "园区级", cnt(lambda c: c.startswith("NE-")), "NE-001 累计发电量（表底值）"),
        ("LD-", "★ 园区负荷与电量（含分时电量）", "园区级", cnt(lambda c: c.startswith("LD-")), "LD-005 日负荷尖电量"),
        ("GV-", "★ 绿色电力与绿证", "工厂级", cnt(lambda c: c.startswith("GV-")), "GV-002 购买绿证量"),
        ("RV-", "★ 绿色与储能收益", "园区级", cnt(lambda c: c.startswith("RV-")), "RV-003 储能收益"),
        ("HV-", "★ 暖通系统（热泵 / 空调）", "系统级", cnt(lambda c: c.startswith("HV-")), "HV-001 热泵系统 COP"),
        ("CO-", "★ 能源费用（成本台账）", "工厂级", cnt(lambda c: c.startswith("CO-")), "CO-001 用水费用"),
        ("OD-", "★ 订单数据（订单 / BOM / 订单能耗）", "订单级", cnt(lambda c: c.startswith("OD-")), "OD-002 订单物料明细（BOM）"),
        ("MT-", "★ 计量绑定与计量时序数据", "计量点级", cnt(lambda c: c.startswith("MT-")), "MT-001 生产单元能耗计量数据"),
    ]
    hdr = ["编码前缀", "含义", "颗粒度层级", "数量", "示例"]
    for j, h in enumerate(hdr, start=1):
        c = ws.cell(r, j, h)
        c.font = F_HEAD
        c.fill = FILL_HEAD
        c.alignment = AL_CTR
        c.border = BORDER
    ws.row_dimensions[r].height = 22
    r += 1
    for g in grp:
        if g[3] == 0:
            continue
        for j, v in enumerate(g, start=1):
            c = ws.cell(r, j, v)
            c.font = F_MONO if j == 1 else F_BODY
            c.border = BORDER
            c.alignment = AL_LEFT_C if j in (2, 5) else AL_CTR
            if j == 5:
                c.font = F_MONO
        ws.row_dimensions[r].height = 18
        r += 1

    # ---------------------------------------------- 四、V2.0 数据域补充
    r = _h(ws, r + 1, "【四】V2.1 数据域补充：零碳园区集控中心（依据两份数据需求清单）")
    r = _note(ws, r,
              "V2.0 仅覆盖《能碳管控指标体系》口径（能耗 / 产量 / 产值 / 碳排放 / 关键工序）。"
              "本次依据《“双中心”数据需求清单9.16》（78 项）与《“双中心”数据需求清单V1.0 (8.27)》（66 项），"
              "补齐零碳园区集控中心与产品碳足迹集采中心的全部数据项，共新增 %d 项参数"
              "（既有域补充 %d + 新增数据域 %d）。逐项对照见「08-数据接入对照」。"
              % (info.get("n_new", 0), n_supp, n_zc), h=34, fill=FILL_TIP)

    dim2 = [
        ("园区基础配置 ZP-", "光伏装机量、变压器容量、储能装机功率 / 容量、园区照片、零碳项目信息、零碳关键事件", FILL_ZC),
        ("新能源与储能 NE-", "累计发电量 / 消纳电量 / 上网电量、发电功率、储能充放电量与功率、SOC、状态、日充放分时电量", FILL_ZC),
        ("园区负荷 LD-", "累计市电电量、累计负荷用电量、总负荷功率、市电功率、日负荷尖 / 峰 / 平 / 谷 / 深谷电量", FILL_ZC),
        ("绿色电力 GV-", "购买绿电量（MWh）、购买绿证量（个 / 张）", FILL_ZC),
        ("收益 RV-", "绿电上网收益、绿电消纳收益、储能收益", FILL_ZC),
        ("重点设备 EQ-005~014", "用电功率、用电量、五段分时电量、额定负荷、蒸汽瞬时流量、蒸汽消耗量", FILL_ZC),
        ("暖通系统 HV-", "热泵 / 空调系统的 COP、供回水温度、制热（冷）量、耗电量、压力、用电功率、绿电占比、尖峰占比、服务面积", FILL_ZC),
        ("能源费用 CO-", "用水 / 天然气 / 外购蒸汽 / 油品 / 市电 / 氮气 6 类费用（万元）", FILL_ZC),
        ("订单数据 OD-", "订单基本信息、订单物料明细（BOM）、订单能耗、碳足迹核算类别、主要产品类别", FILL_ZC),
        ("计量数据 MT-", "生产单元-能耗计量绑定关系、生产单元能耗计量时序数据", FILL_ZC),
        ("既有域补充", "EN-030 液氮、EN-031 外购蒸汽（外购口径）、EN-032 油品合计（L）；"
                       "FAC-014 液氮折标煤系数、FAC-015~017 柴油 / 汽油 / 煤油密度系数", FILL_SUPP),
    ]
    for j, h in enumerate(["数据域", "覆盖参数内容", ""], start=1):
        if j == 3:
            break
        c = ws.cell(r, j, h)
        c.font = F_HEAD
        c.fill = FILL_HEAD2
        c.alignment = AL_CTR
        c.border = BORDER
    for j in range(3, 9):
        c = ws.cell(r, j)
        c.fill = FILL_HEAD2
        c.border = BORDER
    ws.row_dimensions[r].height = 22
    r += 1
    for a, b, _f in dim2:
        c = ws.cell(r, 1, a)
        c.font = F_BODY_B
        c.border = BORDER
        c.alignment = AL_LEFT_C
        c.fill = _f
        ws.merge_cells(start_row=r, start_column=2, end_row=r, end_column=8)
        c = ws.cell(r, 2, b)
        c.font = F_BODY
        c.border = BORDER
        c.alignment = AL_LEFT_C
        c.fill = _f
        for j in range(3, 9):
            ws.cell(r, j).border = BORDER
            ws.cell(r, j).fill = _f
        ws.row_dimensions[r].height = 20
        r += 1

    # ---------------------------------------------- 五、最小颗粒度拆分原则
    r = _h(ws, r + 1, "【五】「最小颗粒度」拆分原则")
    r = _note(ws, r,
              "每个指标的计算输入，必须逐项落到唯一可采集、可定位的数据项，不得用「工序 / 产线」这类泛化表述合并多个产线、"
              "多个工序、多个物料的口径，也不得用复合单位或复合业务对象承载多项数据。本版按下列维度拆分：", h=18)
    dim = [("① 产线维度", "同一工序在不同产线分别建项", "线缆-导线 / 线缆-布电线 / 线缆-高压电缆 … 变压器-特高压 / 变压器-高压 …"),
           ("② 工序维度", "同一产线不同工序分别建项", "拉丝 / 交联 / 器身干燥 / 试验 / 钣金加工 / SMT 贴片 / 退火 / 纵剪 / 叠装 …"),
           ("③ 介质维度", "能耗按能源品种分别建项", "电力（kWh）/ 蒸汽（t）/ 综合能源（tce）"),
           ("④ 物料维度", "同工序多物料分别建项", "拉丝工序：铜（Cu）/ 铝（Al）"),
           ("⑤ 单位维度 ★", "复合单位拆为独立字段", "储能装机「MW/MWh」→ ZP-003 功率 + ZP-004 容量；储能「充放电功率」→ NE-007 充电 + NE-008 放电"),
           ("⑥ 业务对象维度 ★", "复合业务项拆为独立记录", "清单第 74 项「订单信息（基本信息、对应产量、物料明细、工单信息）」→ OD-001 + OUT-009 + OD-002 + MD-006"),
           ("⑦ 系统维度 ★", "同一类参数按系统分别建项", "暖通系统：热泵（HV-001~010）/ 空调（HV-011~020）分别建项")]
    for j, h in enumerate(["拆分维度", "拆分规则", "示例"], start=1):
        c = ws.cell(r, j, h)
        c.font = F_HEAD
        c.fill = FILL_HEAD2
        c.alignment = AL_CTR
        c.border = BORDER
    ws.merge_cells(start_row=r, start_column=3, end_row=r, end_column=8)
    r += 1
    for d in dim:
        c = ws.cell(r, 1, d[0])
        c.font = F_BODY_B
        c.border = BORDER
        c.alignment = AL_LEFT_C
        c = ws.cell(r, 2, d[1])
        c.font = F_BODY
        c.border = BORDER
        c.alignment = AL_LEFT_C
        ws.merge_cells(start_row=r, start_column=3, end_row=r, end_column=8)
        c = ws.cell(r, 3, d[2])
        c.font = F_BODY
        c.border = BORDER
        c.alignment = AL_LEFT_C
        ws.row_dimensions[r].height = 18
        r += 1

    r = _note(ws, r + 1,
              "示例　指标「吨铜电耗（线缆-导线-拉丝）」＝ EN-KE46（工序电力消费量（线缆-导线-拉丝·铜），单位 kWh）"
              "÷ OUT-KM27（工序产品产量（线缆-导线-拉丝·铜），单位 t）。"
              "原 V1.0 中该分子分母均挂在「EN-021 工序 / 产线电力消费量」「OUT-008 工序 / 产品产量（通用）」两个泛化参数上，"
              "无法定位到具体产线与工序，V2.0 已全部展开。", h=34, fill=FILL_TIP)
    r += 1

    # ---------------------------------------------- 五·补、指标 ↔ 参数构成
    r = _h(ws, r, "【五·补】指标 ↔ 参数构成（细分项）—— V2.2 新增")
    r = _note(ws, r,
              "问题：V2.1 的参数与指标关系是单向的 —— 参数行有「关联指标编码」，但指标行看不出自己由哪些参数构成。"
              "开发拿到「吨铜电耗（线缆-导线-拉丝）」时，须在 426 项参数里自行反查「电量」与「产量」；"
              "更麻烦的是「综合能源消费量」这类复合参数，看不出它由哪些能源品种折算而来。"
              "V2.2 把这条链路补全：指标 → 公式输入项 → 复合参数分项 → 原子参数。", h=34, fill=FILL_TIP)
    for _t, _h2 in [
        ("示例　IND-035　单位产量能耗（变压器-特高压-器身干燥），单位 tce/万kVA", 20),
        ("　① 输入项 · 分子　　EN-KT02　工序综合能源消费量（变压器-特高压-器身干燥）　　tce", 18),
        ("　②　　　分项　　　　EN-KE15　工序电力消费量（变压器-特高压-器身干燥）　　kWh", 18),
        ("　②　　　分项　　　　EN-KS02　工序蒸汽消费量（变压器-特高压-器身干燥）　　t", 18),
        ("　① 输入项 · 分母　　OUT-KM01　工序产品产量（变压器-特高压-器身干燥）　　万kVA", 18),
    ]:
        ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=8)
        c = ws.cell(r, 1, _t)
        c.font = Font(name="Consolas", size=9, color="1F4E79")
        c.alignment = AL_LEFT_C
        c.border = BORDER
        ws.row_dimensions[r].height = _h2
        r += 1
    r = _note(ws, r,
              "该链路在三处可见：① 「02-基础参数表」第 23 列「指标构成 / 参数构成（细分项）」；"
              "② 「03-指标清单」第 19 列「参数构成（细分项）」；"
              "③ 「09-指标参数构成明细」表 —— 按指标逐行展开到原子参数，是开发取数的直接依据。"
              "原子参数直接取数；复合参数按其分项折算（或由系统上送合计值，两者必须一致）。", h=34, fill=FILL_CALC)
    r += 1

    # ---------------------------------------------- 六、修订说明
    r = _h(ws, r, "【六】版本修订说明（V1.0 → V2.0 → V2.1 → V2.2）")
    rev = [
        ("【V2.0】工序级参数颗粒度", "5 个泛化参数（EN-021~025、OUT-003~008、VAL-012）承载全部 161 处工序级引用",
         "展开为 %d 个最小颗粒度数据项（工序电力 59 + 蒸汽 4 + 综合能源 15 + 产量 40 + 产值 19）" % len(pitems), "已修正"),
        ("【V2.0】产品级参数颗粒度", "仅 EN-021 / OUT-008 泛指「工序 / 产品」",
         "新增 6 个产品级数据项（EN-P01~P05、OUT-P01），口径为「型号 × ERP 产品种类 × 产线大类」", "已修正"),
        ("【V2.0】指标公式可执行性", "原表「计算公式」列多为空，需人工从指标说明中辨认",
         "新增「规范计算公式（按参数编码）」列，%d 个指标全部给出可直接实现的公式" % n_inds, "已补充"),
        ("【V2.0】变量映射", "变量符号→泛化参数，多对一",
         "变量符号→唯一数据项编码，%d 条变量映射一一对应（映射率 100%%）" % n_vrows, "已修正"),
        ("【V2.0】原表分组标题", "分组标题行（整体 / 产品管控 / 关键工序）混在数据行中",
         "并入「指标体系」列与「颗粒度层级」列，数据行纯净，可直接导入数据库", "已规范"),
        ("【V2.1】数据域不完整", "仅覆盖指标体系口径，缺零碳园区集控中心与集采中心的 %d 项数据需求" % info.get("n_req916", 0),
         "新增 ZP / NE / LD / GV / RV / EQ / HV / CO / OD / MT 共 10 个数据域 %d 项，"
         "并补充 EN-030~032、FAC-014~017 共 %d 项既有域缺项；逐项对应见「08-数据接入对照」"
         % (n_zc, n_supp), "已补齐"),
        ("【V2.1】复合单位未拆", "储能装机容量「MW/MWh」、储能「充放电功率」为复合口径",
         "按最小颗粒度拆为 ZP-003 / ZP-004、NE-007 / NE-008 独立字段", "已修正"),
        ("【V2.1】单位口径冲突", "油品清单按 L、参数表按 t；绿证按「张 / MWh」；电量 MWh 与 kWh 混用",
         "新增 EN-032（L）与 FAC-015~017 密度系数换算；绿证统一为「个（张）」；电量统一以 kWh 存储、MWh 仅作展示", "已统一"),
        ("【V2.1】参数表覆盖度", "V2.0 共 334 项，其中指标 94 项 + 原子参数 240 项",
         "V2.1 共 %d 项 = 指标 94 + 原子参数 %d（原 240 + 新增 %d）" % (n_base, n_base - 94, info.get("n_new", 0)), "已补齐"),
        ("【V2.2】指标 ⇄ 参数构成关系缺失",
         "参数表只有「参数 → 关联指标编码」单向信息；指标行看不出由哪些参数构成，"
         "「综合能源消费量」等复合参数也看不出由哪些能源品种折算而来",
         "① 02 表新增第 23 列「指标构成 / 参数构成（细分项）」；"
         "② 03 表新增第 19 列「参数构成（细分项）」；"
         "③ 新增「09-指标参数构成明细」表，按指标把输入项拆到原子参数（%d 行）"
         % info.get("n_tree", 0), "已补齐"),
        ("【V2.2】源表未单列的能源品种分项",
         "部分工序「综合能源消费量」与「电力消费量」是两个独立变量，说明还存在非电能源品种，但源表未单列",
         "在「09-指标参数构成明细」表尾列出 %d 项待确认清单（工序 / 参数 / 需确认内容 / 处理建议），"
         "请项目公司确认后补充编码" % info.get("n_pending", 0), "待确认"),
    ]
    for j, h in enumerate(["修订项", "变更前情况", "处理结果", "状态"], start=1):
        c = ws.cell(r, j, h)
        c.font = F_HEAD
        c.fill = FILL_HEAD2
        c.alignment = AL_CTR
        c.border = BORDER
    ws.merge_cells(start_row=r, start_column=2, end_row=r, end_column=4)
    ws.merge_cells(start_row=r, start_column=5, end_row=r, end_column=7)
    ws.cell(r, 8).border = BORDER
    ws.cell(r, 8).fill = FILL_HEAD2
    r += 1
    for a, b, ccol, d in rev:
        ws.cell(r, 1, a).font = F_BODY_B
        ws.cell(r, 1).border = BORDER
        ws.cell(r, 1).alignment = AL_LEFT_C
        ws.merge_cells(start_row=r, start_column=2, end_row=r, end_column=4)
        ws.cell(r, 2, b).font = F_BODY
        for j in range(2, 5):
            ws.cell(r, j).border = BORDER
        ws.cell(r, 2).alignment = AL_WRAP
        ws.merge_cells(start_row=r, start_column=5, end_row=r, end_column=7)
        ws.cell(r, 5, ccol).font = F_BODY
        for j in range(5, 8):
            ws.cell(r, j).border = BORDER
        ws.cell(r, 5).alignment = AL_WRAP
        ws.cell(r, 8, d).font = F_BODY_B
        ws.cell(r, 8).border = BORDER
        ws.cell(r, 8).alignment = AL_CTR
        ws.row_dimensions[r].height = 30
        r += 1
    r += 1

    # ---------------------------------------------- 七、公式速查
    r = _h(ws, r, "【七】Excel 公式速查（开发 / 联调自测用）")
    fx = [
        '按编码查数据说明：=VLOOKUP("EN-KE46",\'02-基础参数表\'!$B:$Y,9,0)',
        '按编码查数据来源：=VLOOKUP("NE-001",\'02-基础参数表\'!$B:$Y,15,0)',
        '按编码查单位与格式：=VLOOKUP("HV-001",\'02-基础参数表\'!$B:$Y,10,0)&" / "&VLOOKUP("HV-001",\'02-基础参数表\'!$B:$Y,11,0)',
        '按编码查责任单位：=VLOOKUP("CO-001",\'02-基础参数表\'!$B:$Y,20,0)',
        '按编码查构成（细分项）：=VLOOKUP("EN-KT02",\'02-基础参数表\'!$B:$Y,23,0)　（返回该复合参数由哪些分项折算而来）',
        '按名称反查编码：=INDEX(\'02-基础参数表\'!$B:$B,MATCH("工序产品产量（线缆-导线-拉丝·铜）",\'02-基础参数表\'!$C:$C,0))',
        '按数据域筛选参数：=FILTER(\'02-基础参数表\'!$B$4:$D$%d,LEFT(\'02-基础参数表\'!$B$4:$B$%d,2)="HV")　（HV 换 NE / CO / OD 等前缀）'
        % (3 + len(params), 3 + len(params)),
        '查某指标的全部依赖参数：=VLOOKUP("IND-017",\'03-指标清单\'!$A:$S,17,0)',
        '查某指标的规范公式：=VLOOKUP("IND-017",\'03-指标清单\'!$A:$S,7,0)',
        '查某指标的颗粒度输入项：=VLOOKUP("IND-017",\'03-指标清单\'!$A:$S,8,0)',
        '查某指标的参数构成：=VLOOKUP("IND-035",\'03-指标清单\'!$A:$S,19,0)　（分子 / 分母各自对应哪个参数编码）',
        '筛出某指标的全部构成行：=FILTER(\'09-指标参数构成明细\'!$F$4:$S$%d,\'09-指标参数构成明细\'!$B$4:$B$%d="IND-035")'
        % (3 + info.get("n_tree", 0), 3 + info.get("n_tree", 0)),
        '查某指标用到某变量的参数编码：=INDEX(\'04-公式变量映射\'!$G:$G,MATCH("IND-017"&"|"&"Q线缆-导线-拉丝Cu-电",\'04-公式变量映射\'!$A:$A&"|"&\'04-公式变量映射\'!$E:$E,0))　（数组公式，Ctrl+Shift+Enter）',
        '按产线+工序查全部数据项编码：=INDEX(\'05-工序数据项矩阵\'!$D:$H,MATCH("线缆-导线"&"|"&"拉丝",\'05-工序数据项矩阵\'!$B:$B&"|"&\'05-工序数据项矩阵\'!$C:$C,0),1)　（数组公式）',
        '按清单项反查参数编码：=VLOOKUP(74,\'08-数据接入对照\'!$A:$J,10,0)　（第 74 项 → OD-001 等）',
        '按清单原文查处理说明：=VLOOKUP("外购蒸汽量",\'08-数据接入对照\'!$D:$L,8,0)',
    ]
    for k, s in enumerate(fx, start=1):
        ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=8)
        c = ws.cell(r, 1, "%2d. %s" % (k, s))
        c.font = Font(name="Consolas", size=9, color="1F4E79")
        c.alignment = AL_LEFT_C
        c.border = BORDER
        ws.row_dimensions[r].height = 18
        r += 1
    r += 1

    # ---------------------------------------------- 八、维护约定
    r = _h(ws, r, "【八】维护约定")
    for s in [
        "1. 「02-基础参数表」是唯一权威定义表，编码一经发布不得复用；新增数据项须在对应前缀段内顺延编号。",
        "2. 工序级数据项的「所属产线 / 所属工序」两列是取数定位键，须与「07-枚举字典」中的产线、工序取值保持一致。",
        "3. 标为「工序级（汇总口径）」的 EN-021~EN-025、OUT-003~008、VAL-012，仅供合计校验使用，禁止直接用于指标取数。",
        "4. 折标准煤系数（FAC-001~FAC-008、FAC-014）与排放因子（FAC-009~FAC-013）为参考缺省值，正式取值由电装统一维护、年度更新。",
        "5. 源表或数据需求清单更新时，替换「02-基础参数表」对应行即可，指标公式无需改动（公式按编码引用）。",
        "6. 本版口径问题已在「02-基础参数表」备注列逐条标注：EN-020 单位千kWh、蒸汽质量/热量双口径、非化石能源不含原料用能、"
        "过程排放与固碳暂按 0 计、油品 L/t 双口径、储能收益元/万元等。",
        "7. 「08-数据接入对照」是数据需求清单与参数编码的双向索引；清单改版时先更新该表，再同步「02-基础参数表」。",
        "8. 集控中心域参数（ZP / NE / LD / GV / RV / HV）多为实时（15 分钟）曲线数据，建议按时序库存储、保留 5 年；"
        "ZP- / EQ-012 / HV-010 / HV-020 为静态台账，变更时更新即可。",
        "9. 「09-指标参数构成明细」以及「02-基础参数表」第 23 列、「03-指标清单」第 19 列的构成信息由生成脚本统一产出，"
        "请勿手工修改；指标公式、变量映射或参数表变更后须整体重跑生成脚本，以保证三处一致。",
        "10. 「09-指标参数构成明细」表尾列出源表未单列的能源品种分项（待确认清单），项目公司确认后须补充对应参数编码，"
        "并同步更新该工序综合能耗（EN-KT*）的折标口径。",
    ]:
        ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=8)
        c = ws.cell(r, 1, s)
        c.font = F_SMALL
        c.alignment = AL_WRAP
        ws.row_dimensions[r].height = 26
        r += 1

    return r
