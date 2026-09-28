# -*- coding: utf-8 -*-
"""
特变电工能碳数字化双中心 · 产品碳足迹集采中心全量 16 页面深度规格字典 (specs_carbon_footprint.py)
涵盖：对外示范窗口 (1)、多维分析 (2)、实景数据库 (3)、CBAM管理 (3)、第三方认证管理 (3)、因子库管理 (4)
每页具备：
1. 页面业务定位与 4~6 个结构化子模块；
2. 8~12 项核心业务参数规格 (参数编码、名称、分类、类型、单位、必填、来源、枚举/范围、业务规则说明)；
3. 4~6 项底层物理数据源血缘与采集规约；
4. 结构化计算公式卡片 (公式名称、数学表达式 LaTeX、变量列表、业务逻辑、边界容错防伪规则)；
5. DTO Schema 与 FE/BE/QA 专业落地与测试要点。
"""

CARBON_FOOTPRINT_SPECS = [
    # 1. 集团驾驶舱
    {
        "id": "spec-footprint-dashboard",
        "center": "产品碳足迹集采中心",
        "navGroup": "对外示范窗口",
        "pageName": "集团驾驶舱",
        "route": "/carbon-footprint/cockpit",
        "component": "components/carbon-footprint/cockpit-view.tsx",
        "overview": "产品碳足迹集采中心集团级总控驾驶舱。面向集团领导与供应链生态伙伴，呈现全系列变压器与电线电缆产品全生命周期（LCA 摇篮到大门）综合碳强度分布、绿色产品认证覆盖率、CBAM 碳边境税风险敞口及上游供应商碳效梯队。",
        "subModules": [
            {"name": "产品碳足迹核心 KPI", "desc": "平均产品碳强度 (kgCO2e/kVA)、绿色认证产品占比 (%)、CBAM年出口合规量 (t)、低碳供应链接入率 (%)。"},
            {"name": "全生命周期碳排桑基流向", "desc": "原材料获取 ➔ 关键部件加工 ➔ 厂内总装总试 ➔ 包装仓储 ➔ 运输交付全阶段动态碳流拓扑。"},
            {"name": "主营产品碳效梯队矩阵", "desc": "特高压变压器、配电变压器、特种中高压电缆等主力型号碳足迹排比柱图。"},
            {"name": "CBAM 欧盟出口关税风险地图", "desc": "出口欧盟各港口产品货值、内含碳量 (Embedded Emissions) 与预计碳边境调节税成本测算。"},
            {"name": "上游关键物料供应商碳梯队", "desc": "电工硅钢、电解铜杆、变压器油主要供应商实测碳排因子横向雷达图。"},
            {"name": "碳足迹持续削减演进趋势", "desc": "2024~2026 年各季度单位产品碳足迹降幅曲线与技术减碳贡献分解。"}
        ],
        "parameters": [
            {"paramCode": "productCategory", "paramName": "产品大类", "category": "入参过滤", "dataType": "string", "unit": "-", "required": False, "source": "产品下拉选择", "rangeOrEnum": "all | TRANSFORMER | CABLE", "description": "筛选特定产品大类，不传默认统计全部装备"},
            {"paramCode": "timeRange", "paramName": "核算年度", "category": "入参过滤", "dataType": "string", "unit": "年", "required": True, "source": "时间选择器", "rangeOrEnum": "2024 | 2025 | 2026", "description": "碳足迹与产品交付统计归档年度"},
            {"paramCode": "avgCarbonIntensity", "paramName": "平均产品碳足迹强度", "category": "核心指标", "dataType": "number", "unit": "kgCO2e/kVA", "required": True, "source": "LCA 动态核算引擎", "rangeOrEnum": "0.50 ~ 25.00", "description": "所有出厂变压器加权平均每 kVA 容量对应的生命周期碳足迹"},
            {"paramCode": "greenCertifiedRatePct", "paramName": "绿色产品认证覆盖率", "category": "核心指标", "dataType": "number", "unit": "%", "required": True, "source": "认证台账统计", "rangeOrEnum": "0.0 ~ 100.0%", "description": "获得国家绿色设计产品或 ISO 14067 认证的型号产值占比"},
            {"paramCode": "cbamEmbeddedEmissionsT", "paramName": "CBAM累计内含碳量", "category": "核心指标", "dataType": "number", "unit": "tCO2e", "required": True, "source": "CBAM 核算模型", "rangeOrEnum": "0 ~ 100,000", "description": "出口欧盟监管目录内产品的直接与间接内含碳排放总和"},
            {"paramCode": "cbamCostExposureYuan", "paramName": "CBAM税费敞口预估", "category": "核心指标", "dataType": "number", "unit": "万元", "required": True, "source": "欧盟碳价测算引擎", "rangeOrEnum": "0 ~ 5,000", "description": "基于欧盟 EU ETS 碳配额即期价格模拟测算的潜在碳边境关税成本"},
            {"paramCode": "upstreamSupplierCount", "paramName": "低碳供应链接入数", "category": "业务明细", "dataType": "integer", "unit": "家", "required": True, "source": "供应商门户直连", "rangeOrEnum": "0 ~ 500", "description": "已向特变电工平台回传真实 EPD 或实测碳因子的上游物料供货商数量"},
            {"paramCode": "rawMaterialCarbonRatioPct", "paramName": "原材料阶段碳排占比", "category": "衍生计算", "dataType": "number", "unit": "%", "required": True, "source": "LCA 阶段拆解", "rangeOrEnum": "70.0% ~ 95.0%", "description": "电工硅钢、电解铜等原材料获取阶段在总足迹中的占比"}
        ],
        "dataSources": [
            {"medium": "产品出厂产量与型号台账", "sourceType": "SAP / 用友 ERP 生产完工工单", "protocol": "RFC / REST WebService", "device": "集团 ERP 生产主数据", "tagExample": "ERP_PROD_ORDER_FINISHED_QTY", "frequency": "每日凌晨增量同步", "securityLevel": "L2 (工作秘密)"},
            {"medium": "物料清单与批次用量", "sourceType": "PLM / PDM 产品生命周期系统", "protocol": "JDBC 视图连接", "device": "集团 PLM 数据库 `plm_bom_explosion`", "tagExample": "PLM_EBOM_MATERIAL_WEIGHT_KG", "frequency": "设计版本下发时触发", "securityLevel": "L3 (商密级)"},
            {"medium": "工厂制造实测能耗", "sourceType": "集控中心工序计量数仓", "protocol": "内部微服务 RPC", "device": "集控中心时序数据中台", "tagExample": "DWD_PROCESS_POWER_WATER_GAS", "frequency": "每小时聚合一次", "securityLevel": "L1 (内部级)"},
            {"medium": "欧盟 EU ETS 即期碳价", "sourceType": "欧洲能源交易所 (EEX) 官方行情", "protocol": "HTTPS REST API 抓取", "device": "外部碳金融数据源接入通道", "tagExample": "FIN_EU_ETS_EUA_PRICE_EUR", "frequency": "交易日收盘同步", "securityLevel": "L0 (公开级)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "产品全生命周期综合碳足迹模型",
                "mathExpression": r"CF_{product} = \sum_{i=1}^{n} (M_i \times EF_{mat,i}) + \sum_{j=1}^{m} (E_j \times EF_{energy,j}) + \sum_{k=1}^{p} (T_k \times EF_{trans,k})",
                "variables": [
                    {"name": "M_i", "desc": "生产单台装备消耗第 i 种原材料质量（含损耗）", "unit": "kg"},
                    {"name": "EF_{mat,i}", "desc": "第 i 种原材料摇篮到大门碳排放因子", "unit": "kgCO2e/kg"},
                    {"name": "E_j", "desc": "厂内生产总装第 j 种能源消耗量", "unit": "kWh 或 m³"},
                    {"name": "EF_{energy,j}", "desc": "第 j 种生产能源活动碳排放因子", "unit": "kgCO2e/单位"},
                    {"name": "T_k", "desc": "第 k 段运输周转量（重量 × 运距）", "unit": "t·km"},
                    {"name": "EF_{trans,k}", "desc": "对应运输工具碳排放因子", "unit": "kgCO2e/(t·km)"}
                ],
                "logicDescription": "严格基于 ISO 14067 生命周期边界，归集供应链物料、厂内加工制造及交付物流三大阶段温室气体排放总量。",
                "boundaryRule": "若某物料缺乏实测碳因子，系统优先调用特变电工实景因子库，次优匹配 CLCD 工业库，兜底匹配 Ecoinvent 缺省因子并标记置信度降级。"
            },
            {
                "formulaName": "绿色产品认证产值覆盖率",
                "mathExpression": r"R_{cert} = \frac{\sum_{m \in S_{cert}} Y_m}{Y_{total}} \times 100\%",
                "variables": [
                    {"name": "Y_m", "desc": "已获得权威认证的第 m 款产品年产值", "unit": "万元"},
                    {"name": "Y_{total}", "desc": "集团全部在产装备产品总销售产值", "unit": "万元"}
                ],
                "logicDescription": "评估绿色低碳高端装备在全集团业务盘子中的价值比重，支撑可持续发展 ESG 披露。",
                "boundaryRule": "只有在证书有效期内的产品产值方可计入分子，已过期或处于初审状态的产品强制剔除。"
            }
        ],
        "calculationLogic": "1. 碳强度折算: 总碳足迹量 (kgCO2e) 除以出厂铭牌额定容量 (kVA) 或电缆设计长度 (km)。\n2. 桑基流向矩阵: 按物料输入、工序流转与废料产出构建一阶有向流动网络，总节点守恒平衡率要求 ≥ 99.5%。",
        "dtoSchema": """interface FootprintCockpitDTO {
  reportingYear: string;
  kpis: {
    avgCarbonIntensity: number; // kgCO2e/kVA
    greenCertCoveragePct: number;
    cbamEmbeddedEmissionsT: number;
    cbamCostExposureYuan: number;
    supplierCount: number;
  };
  lcaStages: { stage: string; carbonT: number; ratioPct: number }[];
  topProducts: { model: string; capacityKva: number; intensity: number }[];
}""",
        "roleGuide": {
            "fe": "1. 桑基图使用 ECharts Sankey 组件，暗黑端链路采用翡翠绿微透渐变；\n2. 44px 工业表格支持点击产品型号联动弹出 LCA 阶段明细抽屉；\n3. 顶部筛选器联动时全卡片骨架屏平滑加载，禁止整页跳白。",
            "be": "1. 碳足迹加权聚合计算耗时较长，采用 Redis 缓存（Key: `cache:footprint:cockpit:{year}:{cat}`，TTL 12h）；\n2. ERP 工单完工消息异步投递至 RocketMQ，削峰批量入库。",
            "qa": "1. 边界测试：当产品总产值 Y_total = 0 时，覆盖率接口须安全返回 0.0% 而非 NaN；\n2. 汇率波动测试：CBAM 欧元兑人民币实时汇率网络异常时的熔断保底策略。"
        }
    },

    # 2. 产品横向对标
    {
        "id": "spec-footprint-compare-horizontal",
        "center": "产品碳足迹集采中心",
        "navGroup": "多维分析",
        "pageName": "横向对比",
        "route": "/carbon-footprint/analysis/compare",
        "component": "components/carbon-footprint/compare-horizontal-view.tsx",
        "overview": "同类装备跨生产基地、跨制造工序、跨供方批次的碳足迹横向排比分析。针对 110kV/220kV/500kV 变压器及特种电缆，横向对比沈变、衡变、新变三大基地在同工况设计下的原材料耗用率、干燥工序电耗与碳足迹偏差，定位标杆工艺与降碳空间。",
        "subModules": [
            {"name": "对标产品规格选择器", "desc": "支持跨厂区同时勾选 2~4 款同电压等级、同容量或同截面的对标产品基线。"},
            {"name": "LCA 阶段碳足迹横向排比", "desc": "并列柱状图展示原材料阶段、厂内加工、总装试验各阶段绝对排放量对比。"},
            {"name": "关键工艺工序碳效雷达", "desc": "铁芯剪切损耗、线圈绕制电耗、真空干燥蒸汽消耗、出厂耐压试验能耗多维对齐。"},
            {"name": "原材料供应方碳贡献拆解", "desc": "对比不同供货商硅钢（宝钢 vs 首钢）与电解铜（江西铜业 vs 铜陵有色）的碳强度差异。"},
            {"name": "横向对标差异明细台账", "desc": "44px 工业高密表格，逐项列示物料消耗定额、能源单耗、碳因子及偏离百分比。"}
        ],
        "parameters": [
            {"paramCode": "benchmarkProductIds", "paramName": "对标产品ID组", "category": "入参过滤", "dataType": "string[]", "unit": "-", "required": True, "source": "勾选产品列表", "rangeOrEnum": "最多选择 4 款产品", "description": "选定进行横向对标分析的产品唯一编号组合"},
            {"paramCode": "standardSpecCode", "paramName": "基准规格代号", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "规格切片下拉", "rangeOrEnum": "SFZ11-50000/110 | S20-630/10 | YJV22-8.7/15kV", "description": "统一对照的工业产品通用规格型号"},
            {"paramCode": "baselinePlantCode", "paramName": "基准对标工厂", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "工厂下拉单选", "rangeOrEnum": "SB_BENBU | HB_BENBU | XB_BENBU", "description": "作为能效基准线的生产工厂（标杆线）"},
            {"paramCode": "totalFootprintKg", "paramName": "单台总碳足迹", "category": "核心指标", "dataType": "number", "unit": "kgCO2e", "required": True, "source": "核算引擎", "rangeOrEnum": "1,000 ~ 500,000", "description": "该工厂生产该型号产品的单台全生命周期温室气体总量"},
            {"paramCode": "processCarbonKg", "paramName": "制造加工阶段碳足迹", "category": "核心指标", "dataType": "number", "unit": "kgCO2e", "required": True, "source": "工序计量模型", "rangeOrEnum": "100 ~ 50,000", "description": "厂内生产耗能直接对应的碳排放量"},
            {"paramCode": "rawMatCarbonKg", "paramName": "原材料物料碳足迹", "category": "核心指标", "dataType": "number", "unit": "kgCO2e", "required": True, "source": "BOM 物料累加", "rangeOrEnum": "800 ~ 450,000", "description": "BOM 全部外购原料携带的初始碳排放"},
            {"paramCode": "deviationPct", "paramName": "相对标杆偏差率", "category": "衍生计算", "dataType": "number", "unit": "%", "required": True, "source": "对标计算模型", "rangeOrEnum": "-30.0% ~ +50.0%", "description": "相对基准工厂的碳足迹偏差比例，负值代表优于基准（更低碳）"}
        ],
        "dataSources": [
            {"medium": "产品物料清单实际领料单", "sourceType": "MES 生产执行系统发料记录", "protocol": "SQL 视图只读抽检", "device": "各工厂 MES 领料出库模块", "tagExample": "MES_ISSUE_REAL_QTY_KG", "frequency": "工单完工归档时同步", "securityLevel": "L3 (商密级)"},
            {"medium": "工序级分项电表与蒸汽表", "sourceType": "集控中心工序计量网关", "protocol": "Modbus-TCP / IEC 61850", "device": "车间各重点干燥罐、拉丝机独立表计", "tagExample": "METER_DRYING_PROCESS_KWH", "frequency": "5 分钟时序采样", "securityLevel": "L1 (内部级)"},
            {"medium": "外购主料供货商碳核查报告", "sourceType": "集采中心供应商碳台账", "protocol": "SaaS API 接口抓取", "device": "特变电工绿色集采平台", "tagExample": "SCM_SUPPLIER_EF_VERIFIED", "frequency": "供货批次进厂质检录入", "securityLevel": "L2 (工作秘密)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "制造工序碳足迹偏差率模型",
                "mathExpression": r"\Delta_{process} = \frac{CF_{process,target} - CF_{process,base}}{CF_{process,base}} \times 100\%",
                "variables": [
                    {"name": "CF_{process,target}", "desc": "待对标工厂该型号制造加工碳足迹", "unit": "kgCO2e"},
                    {"name": "CF_{process,base}", "desc": "基准标杆工厂该型号制造加工碳足迹", "unit": "kgCO2e"}
                ],
                "logicDescription": "剔除原材料市场采购波动影响，纯粹聚焦各制造基地自身工艺水平与能源利用效率的横向排比。",
                "boundaryRule": "对标的两款产品铭牌容量公差不得超过 ±5%，否则前端阻断横向排比并弹窗提示规格不可比。"
            }
        ],
        "calculationLogic": "客观横向陈列，严禁使用“落后工厂”等主观定性评价，仅以数据偏差率与柱高自解释。",
        "dtoSchema": """interface ProductHorizontalCompareDTO {
  benchmarkSpec: string;
  items: {
    plantCode: string;
    plantName: string;
    productModel: string;
    totalCarbonKg: number;
    rawMaterialCarbonKg: number;
    processCarbonKg: number;
    deviationPct: number;
  }[];
}""",
        "roleGuide": {
            "fe": "1. 柱状图悬停游标严格遵循 `rgba(56, 189, 248, 0.08)` 微透科技蓝；\n2. 44px 工业表格支持横向滚动，表头固定且数值列全部采用 Mono 等宽字体。",
            "be": "1. 对标接口支持 `POST /api/v1/carbon-footprint/analysis/compare/batch`，一次性传入多个产品工单号批处理返回结果；\n2. 工艺工序能耗按工单批次物理加权平均归集。",
            "qa": "1. 验证 4 款产品并列对标时在 1366px 屏幕下不发生表头折行错位；\n2. 验证当选择相同工厂的同一产品时，系统提示无法作为对标基准。"
        }
    },

    # 3. 纵向对比与总览
    {
        "id": "spec-footprint-compare-vertical",
        "center": "产品碳足迹集采中心",
        "navGroup": "多维分析",
        "pageName": "纵向对比与总览",
        "route": "/carbon-footprint/analysis/ranking",
        "component": "components/carbon-footprint/compare-vertical-view.tsx",
        "overview": "核心主导产品历年碳足迹演进追溯与全生命周期降碳成效评估。追踪特定系列变压器（如 220kV 级三相油浸式变压器）从 2022 年至今历年单位容量碳排放变化轨迹，客观解构绿电引入、工艺改进、材料轻量化三大降碳贡献度，输出产品碳效等级分布。",
        "subModules": [
            {"name": "时间跨度与产品型号筛选", "desc": "选择核心追溯型号，支持 3~5 年历史年度演进跨度分析。"},
            {"name": "历年碳足迹演进曲线", "desc": "折线面积图呈现产品单台总碳量及单位容量碳强度 (kgCO2e/kVA) 下降趋势。"},
            {"name": "降碳动力瀑布归因图", "desc": "瀑布图客观解构：绿色电网因子贡献量、厂内光伏绿电消纳贡献、硅钢轻量化贡献、真空干燥温控节能贡献。"},
            {"name": "产品碳效等级分级矩阵", "desc": "依据企业内控标准划分 1 级（领跑）、2 级（先进）、3 级（达标）动态比例分布。"},
            {"name": "纵向历史追溯明细台账", "desc": "44px 工业高密表格，展示各批次产品投产日期、生产工单、核算版本与碳足迹结果。"}
        ],
        "parameters": [
            {"paramCode": "productSeriesCode", "paramName": "产品系列代号", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "产品系列下拉", "rangeOrEnum": "TR_110KV_OIL | TR_220KV_OIL | CABLE_MEDIUM_VOLT", "description": "需要进行历年纵向追踪的产品标准系列"},
            {"paramCode": "startYear", "paramName": "起始追溯年份", "category": "入参过滤", "dataType": "string", "unit": "年", "required": True, "source": "年份范围选择", "rangeOrEnum": "2021 ~ 2026", "description": "纵向分析起始统计年份"},
            {"paramCode": "endYear", "paramName": "截止追溯年份", "category": "入参过滤", "dataType": "string", "unit": "年", "required": True, "source": "年份范围选择", "rangeOrEnum": "2021 ~ 2026", "description": "纵向分析截止统计年份"},
            {"paramCode": "historicalReductionPct", "paramName": "历史累计降碳幅度", "category": "核心指标", "dataType": "number", "unit": "%", "required": True, "source": "演进对比模型", "rangeOrEnum": "0.0% ~ 50.0%", "description": "截止年份相对起始年份的单位产品碳足迹累计降低比率"},
            {"paramCode": "greenPowerOffsetContribution", "paramName": "绿电消纳降碳贡献量", "category": "核心指标", "dataType": "number", "unit": "tCO2e", "required": True, "source": "归因模型", "rangeOrEnum": "0 ~ 10,000", "description": "制造环节自发绿电引入所实现的碳足迹绝对削减量"},
            {"paramCode": "designOptimizationContribution", "paramName": "设计优化降碳贡献量", "category": "核心指标", "dataType": "number", "unit": "tCO2e", "required": True, "source": "BOM 比对模型", "rangeOrEnum": "0 ~ 5,000", "description": "通过铁芯小型化、低损耗硅钢替换所达成的物料碳削减量"}
        ],
        "dataSources": [
            {"medium": "产品历史核算归档版本库", "sourceType": "碳足迹核算结果历史版本数仓", "protocol": "MySQL 直连查询", "device": "`dwd_lca_footprint_history`", "tagExample": "LCA_HIST_INTENSITY_VAL", "frequency": "按批次归档", "securityLevel": "L2 (工作秘密)"},
            {"medium": "历年产品设计变更记录", "sourceType": "PLM 变更工程通知单 (ECN)", "protocol": "PLM 接口同步", "device": "PLM 工程变更模块", "tagExample": "PLM_ECN_WEIGHT_DELTA_KG", "frequency": "每月同步", "securityLevel": "L3 (商密级)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "产品年度纵向碳足迹削减率模型",
                "mathExpression": r"R_{reduction} = \frac{I_{base\_year} - I_{current\_year}}{I_{base\_year}} \times 100\%",
                "variables": [
                    {"name": "I_{base_year}", "desc": "基准年份该系列产品单位容量平均碳足迹", "unit": "kgCO2e/kVA"},
                    {"name": "I_{current_year}", "desc": "当前年份该系列产品单位容量平均碳足迹", "unit": "kgCO2e/kVA"}
                ],
                "logicDescription": "评估技术创新、节能技改与低碳供应链在产品迭代周期中的综合减碳成效。",
                "boundaryRule": "若基准年与当前年产品技术标准发生重大变更（如由旧国标 S11 升级至一级能效新国标 S22），需标注标准口径断点。"
            }
        ],
        "calculationLogic": "瀑布图四项拆解之和必须 100% 封闭对齐总削减量，采用 Shapley 边际贡献分配算法消除交互项误差。",
        "dtoSchema": """interface ProductVerticalRankingDTO {
  seriesCode: string;
  startYear: string;
  endYear: string;
  totalReductionPct: number;
  yearlyTrend: { year: string; avgIntensity: number; totalVolume: number }[];
  waterfallBreakdown: { factorName: string; reductionKg: number }[];
}""",
        "roleGuide": {
            "fe": "1. 瀑布图使用正负柱状图实现，正增益与负削减采用系统标准色分类；\n2. 历史演进折线图具备数据点缩放 (DataZoom) 能力。",
            "be": "1. 针对多年跨度的大数据聚合，采用 ClickHouse 分布式聚合表提速；\n2. 严格按工单批次加权，避免算术平均导致的销量权重失真。",
            "qa": "1. 跨度选择单一年份时（如 2025~2025），系统自动提示至少选择 2 个年度进行纵向对比；\n2. 验证数据断点（历史未接入年份）以虚线平滑衔接展示。"
        }
    },

    # 4. 实景数据库
    {
        "id": "spec-footprint-realscene",
        "center": "产品碳足迹集采中心",
        "navGroup": "实景数据库",
        "pageName": "实景数据库",
        "route": "/carbon-footprint/database/realscene",
        "component": "components/carbon-footprint/realscene-view.tsx",
        "overview": "特变电工自主知识产权制造工况实景数据库 (Foreground LCI Database)。收录特变电工在变压器与线缆制造特有工序（取向硅钢剪切、无氧铜杆拉丝、环氧树脂浇注固化、绝缘纸板热压加工、全绝缘真空浸渍）的现场实测活动水平数据，摆脱对国外通用因子的依赖，构建企业数据核心护城河。",
        "subModules": [
            {"name": "特种工艺实景因子库检索", "desc": "按工艺类型、设备型号、加工工况快速模糊检索企业专属实景排放因子。"},
            {"name": "工序实景数据质量评级 (DQR)", "desc": "按照技术代表性 (TeR)、地理代表性 (GeR)、时间代表性 (TiR)、完整度 (C) 综合评分。"},
            {"name": "物料产出与损耗平衡模型", "desc": "呈现硅钢剪切废边率、铜拉丝模具损耗率与边角料回收返炼碳抵消模型。"},
            {"name": "实景数据采集测点映射", "desc": "将工序实景数据与车间物理表计、传感器 Tag 及 MES 工序报工点实时绑定。"},
            {"name": "实景因子维护台账", "desc": "44px 工业高密表格，维护实景工序代号、单位产品耗能量、实测碳因子、审核状态与生效时间。"}
        ],
        "parameters": [
            {"paramCode": "processCategory", "paramName": "工序分类", "category": "入参过滤", "dataType": "string", "unit": "-", "required": False, "source": "工序树下拉", "rangeOrEnum": "all | SILICON_CUT | COPPER_DRAW | VACUUM_DRY | CASTING", "description": "工业制造关键工序分类"},
            {"paramCode": "dqrGrade", "paramName": "数据质量等级", "category": "入参过滤", "dataType": "string", "unit": "-", "required": False, "source": "质量等级单选", "rangeOrEnum": "all | GRADE_A | GRADE_B | GRADE_C", "description": "按照 ISO 14067 DQR 评定体系的质量等级"},
            {"paramCode": "unitProcessEnergyConsumption", "paramName": "工序实测单耗", "category": "核心指标", "dataType": "number", "unit": "kWh/kg 或 m³/t", "required": True, "source": "实测表计平均值", "rangeOrEnum": "0.01 ~ 500.00", "description": "处理单位质量工件在该工序直接消耗的电能或蒸汽"},
            {"paramCode": "processRealEmissionFactor", "paramName": "工序实景碳因子", "category": "核心指标", "dataType": "number", "unit": "kgCO2e/kg", "required": True, "source": "实景模型核算", "rangeOrEnum": "0.005 ~ 15.000", "description": "综合考虑设备能效与区域绿电后的工序实测排放因子"},
            {"paramCode": "dqrOverallScore", "paramName": "DQR 综合评分", "category": "核心指标", "dataType": "number", "unit": "分", "required": True, "source": "DQR 算法评定", "rangeOrEnum": "1.0 ~ 5.0 (越低质量越优)", "description": "国际通用数据质量评级，≤ 1.6 为极高等级 A 级实景数据"},
            {"paramCode": "scrapRatePct", "paramName": "工序材料损耗率", "category": "业务明细", "dataType": "number", "unit": "%", "required": True, "source": "MES 投产比对", "rangeOrEnum": "0.1% ~ 15.0%", "description": "加工过程中产生的边角余料占总投料的比例"}
        ],
        "dataSources": [
            {"medium": "车间关键工序电量表计", "sourceType": "物联网 SCADA 系统直采", "protocol": "Modbus-TCP / OPC-UA", "device": "各车间分项电度表", "tagExample": "SCADA_CUT_LINE_PWR_KWH", "frequency": "15 分钟连续积分", "securityLevel": "L1 (内部级)"},
            {"medium": "工序实际报工产出重量", "sourceType": "MES 工步完工扫码确认", "protocol": "REST API", "device": "车间工位机 / 工业手持扫码枪 PDA", "tagExample": "MES_WORKSTEP_OUTPUT_KG", "frequency": "批次实时触发", "securityLevel": "L2 (工作秘密)"},
            {"medium": "车间计量称重地磅与废料返库", "sourceType": "WMS 智能仓储管理系统", "protocol": "WebService", "device": "废料地磅称重传感器", "tagExample": "WMS_SCRAP_COPPER_RECV_KG", "frequency": "每班次过磅归档", "securityLevel": "L2 (工作秘密)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "国际数据质量评级 (DQR) 加权模型",
                "mathExpression": r"DQR = \frac{TeR + GeR + TiR + C + P}{5}",
                "variables": [
                    {"name": "TeR", "desc": "技术代表性评分 (1最优 ~ 5最差)", "unit": "分"},
                    {"name": "GeR", "desc": "地理代表性评分（厂区特异性）", "unit": "分"},
                    {"name": "TiR", "desc": "时间代表性评分（数据年限新鲜度）", "unit": "分"},
                    {"name": "C", "desc": "完整度评分（测点覆盖率）", "unit": "分"},
                    {"name": "P", "desc": "可靠性与测量仪器铅封精度", "unit": "分"}
                ],
                "logicDescription": "严格参照欧盟 PEF / ISO 14067 DQR 评价模型，打分在 1.0~1.6 为极优实景数据，可直接免除第三方核查惩罚性因子。",
                "boundaryRule": "若某项评分为空，默认按最劣 5.0 分代入计算，驱动工程师完善现场表计覆盖。"
            }
        ],
        "calculationLogic": "实景因子计算: E_process = (∑ Q_energy × EF_energy) / M_finished_output。废料回收抵扣: 边角料按 95% 替代原生原料折减计入负碳补偿。",
        "dtoSchema": """interface RealSceneDatabaseDTO {
  processCode: string;
  processName: string;
  plantCode: string;
  unitEnergyConsumption: number;
  emissionFactor: number;
  dqrScore: number;
  dqrLevel: 'A' | 'B' | 'C';
  status: 'VERIFIED' | 'PENDING';
}""",
        "roleGuide": {
            "fe": "1. DQR 等级采用徽章标签，A 级翡翠绿、B 级科技蓝、C 级琥珀金；\n2. 44px 工业表格支持批量导出 Excel 实景清单格式。",
            "be": "1. 实景数据版本变更需留痕并生成哈希摘要，防止第三方审核时数据被质疑篡改；\n2. 提供根据工厂与工序编码获取最新已认证实景因子的轻量 RPC 接口。",
            "qa": "1. 验证新增实景工序时，DQR 五项评分输入范围限制在 1.0~5.0 之间；\n2. 验证废料回收抵扣率不得超过 100%。"
        }
    },

    # 5. 碳足迹核算评估
    {
        "id": "spec-footprint-calc",
        "center": "产品碳足迹集采中心",
        "navGroup": "实景数据库",
        "pageName": "碳足迹核算",
        "route": "/carbon-footprint/database/accounting",
        "component": "components/carbon-footprint/accounting-view.tsx",
        "overview": "基于 ISO 14067 / PAS 2050 国际标准的产品碳足迹在线核算与建模工作台。支持从 ERP 生产工单与 PLM 设计 BOM 自动拉取投产结构，通过树状拓扑自动穿透至每一道原材料与工艺步骤，一键触发多源因子匹配与生命周期清单 (LCI) 计算。",
        "subModules": [
            {"name": "核算任务与工单选择", "desc": "输入生产订单号或选择特定批次产品，加载专属工程 BOM 结构。"},
            {"name": "LCA 生命周期边界定义", "desc": "配置系统边界（摇篮到大门 / 摇篮到坟墓）、截止准则 (Cut-off 1%) 与功能单位 (Functional Unit)。"},
            {"name": "BOM 物料与因子自动匹配引擎", "desc": "智能分词匹配首选特变实景因子、次选国标因子与国际公用因子。"},
            {"name": "厂内制造能耗分摊计算器", "desc": "按产线工时比、设备功率比或产品吨位比分摊公共辅助系统（压缩空气、照明、蒸汽）能耗。"},
            {"name": "核算结果明细清单与存证", "desc": "44px 工业高密表格，展示物料明细、用量、匹配因子、碳排放贡献及不确定度。"}
        ],
        "parameters": [
            {"paramCode": "workOrderNo", "paramName": "生产工单号", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "工单输入/扫码", "rangeOrEnum": "WO-2026-SB-00891", "description": "唯一关联 ERP 投产批次与完工实物的工单代号"},
            {"paramCode": "systemBoundary", "paramName": "系统边界", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "单选切换", "rangeOrEnum": "CRADLE_TO_GATE | CRADLE_TO_GRAVE", "description": "摇篮到大门（出厂）或摇篮到坟墓（含使用与报废）"},
            {"paramCode": "cutoffRulePct", "paramName": "忽略截止准则", "category": "入参过滤", "dataType": "number", "unit": "%", "required": True, "source": "标准设定", "rangeOrEnum": "1.0% | 5.0%", "description": "低于该重量或环境影响比例且无毒有害的物料允许忽略"},
            {"paramCode": "totalCarbonEmissionKg", "paramName": "产品总碳足迹", "category": "核心指标", "dataType": "number", "unit": "kgCO2e", "required": True, "source": "LCA 累加计算", "rangeOrEnum": "100 ~ 1,000,000", "description": "该工单生产实物全生命周期排放的二氧化碳当量"},
            {"paramCode": "materialStageKg", "paramName": "原材料阶段排放", "category": "核心指标", "dataType": "number", "unit": "kgCO2e", "required": True, "source": "物料因子乘积", "rangeOrEnum": "80 ~ 950,000", "description": "主要由硅钢、铜、绝缘油构成的上游环境负荷"},
            {"paramCode": "manufacturingStageKg", "paramName": "制造加工阶段排放", "category": "核心指标", "dataType": "number", "unit": "kgCO2e", "required": True, "source": "车间实测能耗分摊", "rangeOrEnum": "20 ~ 50,000", "description": "厂内生产总装及出厂试验消耗的电能、天然气与蒸汽"},
            {"paramCode": "carbonIntensityPerUnit", "paramName": "单位功能单元碳强度", "category": "核心指标", "dataType": "number", "unit": "kgCO2e/kVA", "required": True, "source": "容量归一化", "rangeOrEnum": "0.10 ~ 50.00", "description": "折算到每 kVA 铭牌容量的碳足迹指标"}
        ],
        "dataSources": [
            {"medium": "生产工单领料清单 (BOM)", "sourceType": "ERP 生产物料模块", "protocol": "REST API", "device": "集团 ERP 领料明细表 `AFPO`/`RESB`", "tagExample": "ERP_WO_ACTUAL_MATERIAL_CONSUMPTION", "frequency": "工单下发时载入", "securityLevel": "L3 (商密级)"},
            {"medium": "车间制造工时与分摊系数", "sourceType": "MES 生产报工系统", "protocol": "SQL 视图", "device": "MES 工序工时报表", "tagExample": "MES_WORKORDER_MAN_HOUR", "frequency": "工单结案时确认", "securityLevel": "L2 (工作秘密)"},
            {"medium": "因子库匹配规则链", "sourceType": "集采中心核心因子管理引擎", "protocol": "本地内存缓存加载", "device": "`dim_carbon_factor_unified`", "tagExample": "FACTOR_RESOLVER_PRIORITY", "frequency": "计算时动态解析", "securityLevel": "L1 (内部级)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "公用工程车间能耗工时分摊模型",
                "mathExpression": r"E_{shared,wo} = E_{shop\_total} \times \frac{T_{wo} \times P_{equip}}{\sum_{k=1}^{K} (T_k \times P_k)}",
                "variables": [
                    {"name": "E_{shop_total}", "desc": "车间公用动力（空压/照明/保温）当月总用能", "unit": "kWh"},
                    {"name": "T_{wo}", "desc": "该工单产品在该车间占用的净工艺加工时长", "unit": "小时"},
                    {"name": "P_{equip}", "desc": "该工单对应主体加工设备额定功率", "unit": "kW"}
                ],
                "logicDescription": "克服传统人头分摊的粗放误差，采用能耗负荷-时间积分加权分摊，符合 ISO 14044 物理因果分配准则。",
                "boundaryRule": "若车间为单机专线生产，分摊比率为 100%，不再执行多工单分配。"
            }
        ],
        "calculationLogic": "1. 自动执行 1% 截断准则检查，核对被忽略物料总和不超过 5%；\n2. 因子匹配置信度打分：实景 (100) > 国标 (85) > 行业 (70) > 缺省 (50)。",
        "dtoSchema": """interface FootprintAccountingDTO {
  workOrderNo: string;
  productModel: string;
  functionalUnit: string;
  totalCarbonKg: number;
  carbonIntensity: number;
  breakdown: {
    materialName: string;
    weightKg: number;
    matchedFactorCode: string;
    factorValue: number;
    stageCarbonKg: number;
    sourceType: 'REALSCENE' | 'NATIONAL' | 'INDUSTRY';
  }[];
}""",
        "roleGuide": {
            "fe": "1. BOM 物料匹配列表提供手动修正因子下拉，用户调整后局部自动重新求和；\n2. 44px 工业表格支持一键按碳排放贡献降序排比（定位碳热点物料）。",
            "be": "1. 核算引擎计算过程生成完整 JSON 快照落库，作为不可篡改审计追踪凭据；\n2. 支持批量工单后台异步核算任务，进度条基于 WebSocket 推送。",
            "qa": "1. 边界测试：截断准则累加超过 5% 时，系统弹窗告警禁止通过；\n2. 验证负碳抵消项（废旧铜料循环利用）计算符号逻辑正确。"
        }
    },

    # 6. 碳足迹报告生成
    {
        "id": "spec-footprint-report",
        "center": "产品碳足迹集采中心",
        "navGroup": "实景数据库",
        "pageName": "碳足迹报告",
        "route": "/carbon-footprint/database/report",
        "component": "components/carbon-footprint/report-view.tsx",
        "overview": "权威产品碳足迹核算报告 (LCA Report) 自动化编制与导出中心。严格依照 ISO 14067、ISO 14044 及国家绿色产品评价标准模板，自动合成包含企业资质、产品技术参数、系统边界拓扑、LCI 清单数据、碳热点敏感性分析及碳减排建议方案的标准报告，支持带数字水印与电子签章的 PDF/Word 导出。",
        "subModules": [
            {"name": "报告模板库与标准规范选择", "desc": "支持 ISO 14067 国际模板、国标绿色设计产品模板及客户定制技术协议模板。"},
            {"name": "报告章节在线实时预览", "desc": "富文本结构化展示执行摘要、编制依据、生命周期清单、敏感度分析及第三方核查说明。"},
            {"name": "关键指标与敏感性分析图表", "desc": "自动嵌入碳足迹阶段饼图、前 5 大碳热点物料条形图与原料价格/碳价波动敏感性曲线。"},
            {"name": "减碳对策建议智能生成", "desc": "基于核算诊断出的高碳工序与物料，自动推荐硅钢减薄、铜铝代换或绿电采购建议。"},
            {"name": "报告签发与历史归档台账", "desc": "44px 工业高密表格，记录报告编号、签发日期、审核专家、下载记录与存证哈希。"}
        ],
        "parameters": [
            {"paramCode": "reportTemplateId", "paramName": "报告模板类型", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "模板下拉", "rangeOrEnum": "TPL_ISO14067 | TPL_GB_T24067 | TPL_CBAM_COMMUNICATION", "description": "选择编制报告遵循的标准规范版本"},
            {"paramCode": "accountingTaskId", "paramName": "关联核算任务ID", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "核算任务下拉", "rangeOrEnum": "TASK-2026-LCA-0881", "description": "绑定的已归档产品碳足迹核算任务"},
            {"paramCode": "watermarkText", "paramName": "企业安全水印文本", "category": "入参过滤", "dataType": "string", "unit": "-", "required": False, "source": "系统当前用户自动生成", "rangeOrEnum": "特变电工内部机密-工号10882", "description": "嵌入导出 PDF 背景的半透明防泄密倾斜文字水印"},
            {"paramCode": "topHotspotRatioPct", "paramName": "首要碳热点贡献率", "category": "核心指标", "dataType": "number", "unit": "%", "required": True, "source": "敏感度模型", "rangeOrEnum": "50.0% ~ 90.0%", "description": "前三大物料（通常为电工硅钢与铜杆）累计排放占总足迹的比例"},
            {"paramCode": "reportPages", "paramName": "报告文档总页数", "category": "业务明细", "dataType": "integer", "unit": "页", "required": True, "source": "排版引擎统计", "rangeOrEnum": "15 ~ 60", "description": "自动排版生成的正文与附录总页码"},
            {"paramCode": "exportFormat", "paramName": "导出文件格式", "category": "业务明细", "dataType": "string", "unit": "-", "required": True, "source": "导出按钮选项", "rangeOrEnum": "PDF | DOCX", "description": "导出为防篡改 PDF 还是供商务二次编辑的 Word"}
        ],
        "dataSources": [
            {"medium": "碳足迹核算结果数据明细", "sourceType": "核算评估引擎快照数据库", "protocol": "MySQL 只读事务", "device": "`dwd_lca_report_snapshot`", "tagExample": "LCA_REPORT_RAW_SNAPSHOT_JSON", "frequency": "报告生成时加载", "securityLevel": "L2 (工作秘密)"},
            {"medium": "企业技术资质与第三方检测报告", "sourceType": "企业知识中心文件服务器", "protocol": "MinIO S3 对象存储", "device": "MinIO 企业私有存储集群", "tagExample": "DOC_TYPE_TEST_CERTIFICATE_PDF", "frequency": "按需下载合并", "securityLevel": "L2 (工作秘密)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "碳热点物料敏感度分析模型",
                "mathExpression": r"S_i = \frac{\partial CF_{total} / CF_{total}}{\partial M_i / M_i} = \frac{M_i \times EF_{mat,i}}{CF_{total}}",
                "variables": [
                    {"name": "S_i", "desc": "第 i 种物料的无量纲敏感度系数", "unit": "-"},
                    {"name": "M_i", "desc": "第 i 种物料的投入量", "unit": "kg"},
                    {"name": "EF_{mat,i}", "desc": "第 i 种物料碳排放因子", "unit": "kgCO2e/kg"}
                ],
                "logicDescription": "反映当某种原材料用量或其因子发生 10% 波动时，总碳足迹产生的相对波动比例，指导工程团队精准抓重点降碳。",
                "boundaryRule": "若 S_i ≥ 0.20，系统强制在报告“减排建议”章节将其列为一级核心管控物料。"
            }
        ],
        "calculationLogic": "敏感度排名前 3 的物料触发自动化降碳建议算法规则库匹配，生成标准化改进措施文本段落。",
        "dtoSchema": """interface FootprintReportDTO {
  reportId: string;
  reportCode: string;
  productModel: string;
  generatedDate: string;
  totalCarbonIntensity: number;
  topHotspots: { name: string; ratioPct: number; sensitivity: number }[];
  downloadUrlPdf: string;
  downloadUrlDocx: string;
}""",
        "roleGuide": {
            "fe": "1. 报告预览区采用虚拟化分页组件，支持放大/缩小与目录锚点跳转；\n2. 导出按钮具备 Loading 防重复提交状态，下载完成后触发系统通知。",
            "be": "1. 后端使用 headless Chrome 或 Python python-docx / WeasyPrint 异步渲染导出 PDF，耗时控制在 3 秒以内；\n2. 报告元数据在 Redis 缓存以防高频重复渲染占用 CPU。",
            "qa": "1. 验证下载的 PDF 文档在各版本 Acrobat Reader 中中文不出现乱码且水印平铺正常；\n2. 验证敏感度系数 S_i 在 0~1 之间且各物料敏感度之和为 1.0。"
        }
    },

    # 7. CBAM合规管理
    {
        "id": "spec-footprint-cbam-compliance",
        "center": "产品碳足迹集采中心",
        "navGroup": "CBAM管理",
        "pageName": "合规管理",
        "route": "/carbon-footprint/cbam/compliance",
        "component": "components/carbon-footprint/cbam-compliance-view.tsx",
        "overview": "欧盟碳边境调节机制 (CBAM) 合规状态监控中枢。针对特变电工出口欧盟各成员国的变压器、互感器、电缆等涉税品类（海关 HS Code 8504 / 8544 关联清单），穿透核算直接工艺排放 (Scope 1) 与外购电力间接排放 (Scope 2)，监控前体材料 (Precursors) 真实数据覆盖率，规避欧盟碳关税违约惩罚风险。",
        "subModules": [
            {"name": "CBAM 涉税产品出口概览", "desc": "统计当年出口欧盟产品批次、报关货值 (EUR)、内含碳排放总量 (tCO2e) 及合规达标率。"},
            {"name": "直接与间接内含碳排放拆解", "desc": "并列柱图区分制造现场燃料燃烧 (Direct) 与生产外购电力 (Indirect) 内含排放强度。"},
            {"name": "前体材料 (Precursors) 穿透矩阵", "desc": "铝材、钢铁、紧固件等上游前体材料碳排放真实数据填报比例与缺省值替换比例。"},
            {"name": "欧盟碳价波动对税负敞口影响", "desc": "动态模拟 EU ETS 碳配额价格在 60~120 欧元/吨区间变动时的潜在碳税支出敞口。"},
            {"name": "出口产品 CBAM 合规状态台账", "desc": "44px 工业高密表格，逐项列示报关单号、HS 编码、出口国别、内含碳排放量、审核状态及风险等级。"}
        ],
        "parameters": [
            {"paramCode": "hsCode", "paramName": "海关 HS 编码", "category": "入参过滤", "dataType": "string", "unit": "-", "required": False, "source": "HS编码选择", "rangeOrEnum": "85042300 | 85043400 | 85444921", "description": "欧盟 CBAM 监管范围内的涉税电力装备海关商品编码"},
            {"paramCode": "exportCountry", "paramName": "出口目的国", "category": "入参过滤", "dataType": "string", "unit": "-", "required": False, "source": "国家下拉", "rangeOrEnum": "GERMANY | NETHERLANDS | FRANCE | ITALY", "description": "欧盟 27 个成员国收货目的港国家"},
            {"paramCode": "totalEmbeddedEmissionsT", "paramName": "总内含碳排放量", "category": "核心指标", "dataType": "number", "unit": "tCO2e", "required": True, "source": "CBAM 专用算法", "rangeOrEnum": "0 ~ 50,000", "description": "按欧盟法规计算的直接与间接内含温室气体总量"},
            {"paramCode": "specificDirectEmission", "paramName": "单位产品直接内含排放", "category": "核心指标", "dataType": "number", "unit": "tCO2e/t", "required": True, "source": "工艺核算", "rangeOrEnum": "0.01 ~ 2.00", "description": "每吨出口产品在制造基地消耗化石燃料直接产生的温室气体"},
            {"paramCode": "specificIndirectEmission", "paramName": "单位产品间接内含排放", "category": "核心指标", "dataType": "number", "unit": "tCO2e/t", "required": True, "source": "电力因子核算", "rangeOrEnum": "0.05 ~ 5.00", "description": "每吨出口产品耗用外购电力对应的间接碳排放"},
            {"paramCode": "realDataRatioPct", "paramName": "前体材料真实数据率", "category": "核心指标", "dataType": "number", "unit": "%", "required": True, "source": "供应商填报统计", "rangeOrEnum": "0.0% ~ 100.0%", "description": "使用实际测算因子而非欧盟惩罚性缺省值的前体材料价值比例"},
            {"paramCode": "riskLevel", "paramName": "合规风险等级", "category": "衍生计算", "dataType": "string", "unit": "-", "required": True, "source": "合规风险引擎", "rangeOrEnum": "LOW | MEDIUM | HIGH", "description": "结合真实数据率与申报时限综合评定的合规风险级别"}
        ],
        "dataSources": [
            {"medium": "海关报关单与出口商业发票", "sourceType": "集团进出口贸易 ERP 模块", "protocol": "WebService 接口", "device": "贸易进出口管理子系统", "tagExample": "TRADE_CUSTOMS_DECLARATION_NO", "frequency": "报关放行后同步", "securityLevel": "L3 (商密级)"},
            {"medium": "分厂工艺耗能实测数据", "sourceType": "集控中心时序数据库", "protocol": "SQL 视图", "device": "集控中心工序计量数仓", "tagExample": "PLANT_CBAM_DIRECT_FUEL_M3", "frequency": "按月归集", "securityLevel": "L2 (工作秘密)"},
            {"medium": "欧盟官方 CBAM 默认缺省因子库", "sourceType": "欧盟委员会官方公报数据库", "protocol": "系统内置静态表", "device": "`dim_cbam_eu_default_factors`", "tagExample": "EU_CBAM_DEFAULT_FACTOR_STEEL", "frequency": "欧盟更新时维护", "securityLevel": "L0 (公开级)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "CBAM 复杂产品内含碳排放量公式",
                "mathExpression": r"SEE_g = \frac{AttrEm_g + \sum_{i=1}^{n} (M_i \times SEE_{pre,i})}{AL_g}",
                "variables": [
                    {"name": "SEE_g", "desc": "复杂产品 g 的特定内含碳排放量", "unit": "tCO2e/t"},
                    {"name": "AttrEm_g", "desc": "生产该产品装置归属的直接/间接排放量", "unit": "tCO2e"},
                    {"name": "M_i", "desc": "消耗的前体材料 i 净质量", "unit": "t"},
                    {"name": "SEE_{pre,i}", "desc": "前体材料 i 自身的内含碳排放量", "unit": "tCO2e/t"},
                    {"name": "AL_g", "desc": "报告期内该产品合格品总产量 (Activity Level)", "unit": "t"}
                ],
                "logicDescription": "严格执行 Regulation (EU) 2023/956 附录 IV 复杂产品计算逻辑，前体材料内含碳必须全量加权累加。",
                "boundaryRule": "若某前体材料无法获取供应商实测数据，强制采用欧盟官方默认缺省值（通常包含 10%~20% 惩罚性上浮）。"
            }
        ],
        "calculationLogic": "风险评估规则: 真实数据率 < 80% 或临近季度申报截止日前 15 天未完成审核的，标记为 HIGH 风险。",
        "dtoSchema": """interface CbamComplianceDTO {
  reportingQuarter: string;
  totalDeclarations: number;
  totalEmbeddedEmissionsT: number;
  directRatioPct: number;
  indirectRatioPct: number;
  realDataRatioPct: number;
  highRiskCount: number;
  items: {
    declarationNo: string;
    hsCode: string;
    productModel: string;
    destCountry: string;
    embeddedEmissionT: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  }[];
}""",
        "roleGuide": {
            "fe": "1. 风险状态使用专用徽章标签，严禁过度刺眼大红，采用克制告警色；\n2. 44px 工业表格支持点击报关单号一键跳转对应季度申报模拟页。",
            "be": "1. CBAM 内含碳核算引擎与普通 ISO 14067 引擎物理隔离，因为欧盟规约明确要求扣减电网自用电且暂不计入林业碳汇；\n2. 报关单据变化时自动触发内含碳异步重算。",
            "qa": "1. 验证 HS Code 筛选联动时，表格准确过滤出变压器或线缆对应品类；\n2. 验证真实数据率达到 100% 时，风险级别正确收敛至 LOW。"
        }
    },

    # 8. CBAM申报模拟
    {
        "id": "spec-footprint-cbam-declare",
        "center": "产品碳足迹集采中心",
        "navGroup": "CBAM管理",
        "pageName": "申报模拟",
        "route": "/carbon-footprint/cbam/declaration",
        "component": "components/carbon-footprint/cbam-declaration-view.tsx",
        "overview": "欧盟 CBAM 季度通信报告 (Quarterly Communication Report) 模拟填报与标准化 XML/Excel 导出引擎。全真模拟欧盟 CBAM 官方 Transitional Registry 登记平台数据结构，支持前体材料穿透录入、生产装置能效核算、境内已支付有效碳价 (Carbon Price Due) 抵扣测算，并支持一键生成符合欧委会技术规范的 XML 格式报送数据包。",
        "subModules": [
            {"name": "申报周期与申报主体配置", "desc": "配置填报季度（如 2026-Q1）、欧盟申报人 EORI 编码、生产安装场所代码 (Installation ID)。"},
            {"name": "安装场所生产工况明细填报", "desc": "填报变压器工厂直接排放源（天然气/柴油烘房）与外购电力耗用量。"},
            {"name": "前体材料 (Precursors) 数据映射", "desc": "关联上游供货商提供的钢铁/铝材内含排放凭据及原产国代码。"},
            {"name": "国内已支付碳价抵扣计算器", "desc": "计算企业参与中国全国碳市场或地方碳市场已缴纳的配额履约成本并折减抵扣。"},
            {"name": "CBAM 申报数据清单与 XML 导出", "desc": "44px 工业高密表格，呈现字段代码、欧委会对应 XML 节点、填报值、校验结果及一键导出。"}
        ],
        "parameters": [
            {"paramCode": "quarterTag", "paramName": "申报季度", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "季度下拉", "rangeOrEnum": "2026-Q1 | 2026-Q2 | 2026-Q3 | 2026-Q4", "description": "欧盟 CBAM 规定的季度申报周期标签"},
            {"paramCode": "installationId", "paramName": "生产装置识别码", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "企业台账", "rangeOrEnum": "CN-TBEA-SB-001 | CN-TBEA-HB-002", "description": "在欧盟登记备案的特变电工制造基地唯一装置编码"},
            {"paramCode": "eoriNumber", "paramName": "欧盟进口商 EORI 码", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "客户主数据", "rangeOrEnum": "DE123456789012345", "description": "欧洲采购方在欧盟海关的经济营运者注册和识别号"},
            {"paramCode": "totalGoodsMassT", "paramName": "出口涉税货物总净重", "category": "核心指标", "dataType": "number", "unit": "t", "required": True, "source": "装箱单累加", "rangeOrEnum": "1.0 ~ 5,000.0", "description": "当期申报产品实物净重量总和"},
            {"paramCode": "totalDeclaredCarbonT", "paramName": "当期申报总碳排放量", "category": "核心指标", "dataType": "number", "unit": "tCO2e", "required": True, "source": "模型自动汇聚", "rangeOrEnum": "0.1 ~ 10,000.0", "description": "需向欧盟正式申报的内含温室气体总量"},
            {"paramCode": "domesticCarbonPricePaidEur", "paramName": "境内已付碳价抵扣额", "category": "核心指标", "dataType": "number", "unit": "EUR", "required": False, "source": "碳市场履约凭单", "rangeOrEnum": "0 ~ 100,000", "description": "在原产国根据有效碳定价机制实际支付且未享受出口退税的金额"},
            {"paramCode": "estimatedCbamCertsNeeded", "paramName": "需购买 CBAM 凭证数量", "category": "衍生计算", "dataType": "number", "unit": "张 (相当于tCO2e)", "required": True, "source": "关税规则模型", "rangeOrEnum": "0 ~ 10,000", "description": "扣减境内已付碳价后实际需清缴的欧盟 CBAM 证书总数"}
        ],
        "dataSources": [
            {"medium": "季度出口集装箱装箱净重单", "sourceType": "WMS / 国际物流运单系统", "protocol": "REST API", "device": "物流报关发货台账", "tagExample": "LOGISTICS_EXPORT_CONTAINER_NET_WEIGHT", "frequency": "装船发运归档", "securityLevel": "L3 (商密级)"},
            {"medium": "分厂当季购售电发票与计量表单", "sourceType": "财务 ERP 外购电力台账", "protocol": "数据库视图", "device": "财务应付管理模块", "tagExample": "FIN_ELEC_INVOICE_TOTAL_KWH", "frequency": "季度结账录入", "securityLevel": "L2 (工作秘密)"},
            {"medium": "中国全国碳市场 CEA 成交均价", "sourceType": "上海环境能源交易所交易公告", "protocol": "HTTP 爬取 / 人工录入", "device": "碳资产管理子模块", "tagExample": "CN_ETS_AVG_PRICE_RMB", "frequency": "季度均价结算", "securityLevel": "L0 (公开级)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "CBAM 应缴凭证数量与境内碳价折减模型",
                "mathExpression": r"N_{certs} = \max\left(0, E_{embedded} - \frac{CP_{paid\_domestic}}{P_{eu\_ets}}\right)",
                "variables": [
                    {"name": "E_{embedded}", "desc": "该批出口货物总内含碳排放量", "unit": "tCO2e"},
                    {"name": "CP_{paid_domestic}", "desc": "在境内实际已缴纳的碳税或碳配额履约成本折合欧元", "unit": "EUR"},
                    {"name": "P_{eu_ets}", "desc": "申报季度欧盟 EU ETS 碳配额拍卖平均结算价", "unit": "EUR/tCO2e"}
                ],
                "logicDescription": "依据 CBAM 法规第 9 条有效碳价抵扣原则，避免国际双重征税，真实降低特变电工出口合规成本。",
                "boundaryRule": "若境内已支付碳价大于或等于欧盟碳价水平，N_certs 取 0，不得产生负凭证（欧盟不退现金）。"
            }
        ],
        "calculationLogic": "XML 数据包结构严格映射欧盟 CBAM XSD 架构定义，所有数值保留 4 位小数，编码格式统一 UTF-8。",
        "dtoSchema": """interface CbamDeclarationDTO {
  quarter: string;
  installationId: string;
  eoriNumber: string;
  goodsMassT: number;
  totalCarbonT: number;
  domesticCarbonDeductionEur: number;
  cbamCertsNeeded: number;
  xmlPayloadReady: boolean;
  downloadUrlXml: string;
}""",
        "roleGuide": {
            "fe": "1. 填报页面提供“格式校验”按钮，点击高亮未填必填项并展示校验报告；\n2. 44px 工业高密表格支持点击单行展开查看对应的 XML 标签节点代码。",
            "be": "1. 后端实现针对欧委会官方 `cbam-communication-v1.xsd` 的强 Schema 校验，校验不通过禁止导出；\n2. XML 生成使用流式写入，避免数万行明细撑爆 JVM 内存。",
            "qa": "1. 使用欧盟官方提供的离线校验工具验证生成的 XML 文件合法性；\n2. 验证境内碳价为 0 时，凭证数量完全等于总内含碳排放量。"
        }
    },

    # 9. CBAM规则知识库
    {
        "id": "spec-footprint-cbam-kb",
        "center": "产品碳足迹集采中心",
        "navGroup": "CBAM管理",
        "pageName": "知识库",
        "route": "/carbon-footprint/cbam/knowledge",
        "component": "components/carbon-footprint/cbam-knowledge-view.tsx",
        "overview": "欧盟 CBAM 法规条款、官方技术指南、行业缺省基准值及企业实操应对案例中枢。收录 Regulation (EU) 2023/956 正式文本、欧委会过渡期实施细则、涉税金属前体清单、典型出口问题 QA 问答与最新碳金融行情动态，为外贸、技术与供应链人员提供权威合规知识支持。",
        "subModules": [
            {"name": "法规原文与权威指南检索", "desc": "支持中英双语检索欧盟 CBAM 法律条款、条约修正案及官方执行问答指南。"},
            {"name": "涉税产品 HS 编码税目速查", "desc": "精准检索变压器、电线电缆、互感器、开关柜对应 HS Code 的申报要求与特定适用规则。"},
            {"name": "欧盟官方默认缺省值字典", "desc": "结构化查询钢材、铝材、混合合金各原产国官方惩罚性缺省内含排放因子。"},
            {"name": "典型申报实务与答辩案例库", "desc": "沉淀面对欧盟海关问询、第三方核查抽检与前体材料数据异议处理的实战应对模版。"},
            {"name": "法规版本与更新日志台账", "desc": "44px 工业高密表格，跟踪法规文号、颁布机构、生效日期、影响评估与解读文章。"}
        ],
        "parameters": [
            {"paramCode": "searchKeyword", "paramName": "知识检索关键词", "category": "入参过滤", "dataType": "string", "unit": "-", "required": False, "source": "搜索框输入", "rangeOrEnum": "缺省值 | 前体材料 | 扣减规则", "description": "全文检索法律条款、名词释义或实操指南的关键词"},
            {"paramCode": "docCategory", "paramName": "文档知识分类", "category": "入参过滤", "dataType": "string", "unit": "-", "required": False, "source": "分类单选", "rangeOrEnum": "all | REGULATION | GUIDE | DEFAULT_VALUE | CASE", "description": "筛选法规全文、实施指南、缺省基准或实务案例"},
            {"paramCode": "totalArticlesCount", "paramName": "收录知识条目总数", "category": "核心指标", "dataType": "integer", "unit": "篇", "required": True, "source": "知识库索引统计", "rangeOrEnum": "50 ~ 2,000", "description": "当前知识库中已结构化审签归档的法规与指引篇数"},
            {"paramCode": "lastUpdatedVersion", "paramName": "最新法规版本代号", "category": "业务明细", "dataType": "string", "unit": "-", "required": True, "source": "法规库主版本", "rangeOrEnum": "EU-2023/956-REV4", "description": "当前对齐生效的欧委会法律规约最新修订版本"}
        ],
        "dataSources": [
            {"medium": "欧盟官方公报 (EUR-Lex) 法规文库", "sourceType": "官方立法文档镜像库", "protocol": "HTTPS REST API 定期同步", "device": "欧盟 EUR-Lex 开放接口", "tagExample": "EURLEX_REG_2023_956_CELEX", "frequency": "每周自动比对更新", "securityLevel": "L0 (公开级)"},
            {"medium": "特变电工外贸实操应对案例总结", "sourceType": "国际业务部与法务部知识沉淀", "protocol": "企业 Wiki 知识库同步", "device": "集团飞书/泛微协同知识中台", "tagExample": "LEGAL_CBAM_CASE_STUDY_DOC", "frequency": "案例发生时录入", "securityLevel": "L2 (工作秘密)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "欧盟缺省值惩罚性溢价成本测算模型",
                "mathExpression": r"\Delta Cost = M_{pre} \times (EF_{default} - EF_{actual}) \times P_{eu\_ets}",
                "variables": [
                    {"name": "M_{pre}", "desc": "前体材料年采购重量", "unit": "t"},
                    {"name": "EF_{default}", "desc": "欧盟规定的该国别行业默认缺省排放因子", "unit": "tCO2e/t"},
                    {"name": "EF_{actual}", "desc": "供应链实测提供的真实排放因子", "unit": "tCO2e/t"},
                    {"name": "P_{eu_ets}", "desc": "当前欧盟碳配额价格", "unit": "EUR/tCO2e"}
                ],
                "logicDescription": "量化推动上游供应商开展真实碳盘查所能为企业避免的被动碳税溢价，客观证明供应链数智化投入的商业价值。",
                "boundaryRule": "若实测因子反而劣于缺省值（极罕见），溢价成本取 0 并发出供应链高碳预警。"
            }
        ],
        "calculationLogic": "全文检索基于 ElasticSearch / pgvector 向量检索，支持中英文双语语义相似度命中。",
        "dtoSchema": """interface CbamKnowledgeDTO {
  totalCount: number;
  latestRegulationVersion: string;
  items: {
    docId: string;
    title: string;
    category: string;
    issueDate: string;
    authority: string;
    summary: string;
    downloadUrl: string;
  }[];
}""",
        "roleGuide": {
            "fe": "1. 搜索框支持拼音自动纠错与热门检索词推荐标签；\n2. 44px 工业高密表格支持点击单行快速打开侧边抽屉查阅法条中英对照全文。",
            "be": "1. 引入轻量级向量嵌入模型提炼法条语义，提升工程师提问的搜索准确率；\n2. 知识库附件统一存放在内部对象存储并限制仅允许通过登录态临时 URL 下载。",
            "qa": "1. 验证中英文混合检索（如“HS 8504 硅钢缺省值”）能精准置顶对应条款；\n2. 验证非公开案例在权限受控账号下的可见性过滤。"
        }
    },

    # 10. 碳足迹认证资料
    {
        "id": "spec-footprint-cert-material",
        "center": "产品碳足迹集采中心",
        "navGroup": "第三方认证管理",
        "pageName": "认证资料维护",
        "route": "/carbon-footprint/certification/material",
        "component": "components/carbon-footprint/cert-material-view.tsx",
        "overview": "第三方低碳产品认证与碳标签申请资料数字化归集与合规审核中心。结构化归档原材料材质证明 (MTC)、供应商碳足迹核查声明、工厂能源审计报告、型式试验工单与计量表计检定证书，支持文件全生命周期版本追溯、SHA-256 哈希存证与敏感工艺参数水印脱敏导出。",
        "subModules": [
            {"name": "认证项目与产品批次选择", "desc": "选择待认证产品型号，关联对应技术规格书与设计 BOM 档案。"},
            {"name": "认证必备资料清单校验树", "desc": "按 ISO 14067 / EPD 规范核验 8 大类必备材料上传完整度（缺失项标黄提示）。"},
            {"name": "文件在线预览与脱敏打水印", "desc": "支持 PDF / DWG 格式图纸在线审阅，并自动叠加“仅限某机构认证使用”防泄密水印。"},
            {"name": "材料 SHA-256 存证哈希计算", "desc": "为每一份上传的技术资料生成不可篡改哈希摘要，支撑第三方核查溯源。"},
            {"name": "认证资料归档明细台账", "desc": "44px 工业高密表格，列示文件代号、资料名称、类型、上传人、文件大小、版本与存证哈希。"}
        ],
        "parameters": [
            {"paramCode": "productModel", "paramName": "申请产品型号", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "产品型号下拉", "rangeOrEnum": "S20-M-1000/10 | SZ11-50000/110", "description": "申请第三方碳足迹认证的具体产品型号"},
            {"paramCode": "certAgency", "paramName": "目标认证机构", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "机构下拉", "rangeOrEnum": "SGS | TUV_RHEINLAND | CQC | CEPREI", "description": "受理该批次核查认证的国内外权威第三方机构"},
            {"paramCode": "materialChecklistProgressPct", "paramName": "资料准备就绪率", "category": "核心指标", "dataType": "number", "unit": "%", "required": True, "source": "清单校验模型", "rangeOrEnum": "0.0% ~ 100.0%", "description": "必备资料上传且审核通过的数量占标准清单总项数的比例"},
            {"paramCode": "uploadedFileCount", "paramName": "已归档文件数", "category": "业务明细", "dataType": "integer", "unit": "份", "required": True, "source": "文件系统统计", "rangeOrEnum": "0 ~ 100", "description": "该项目已成功上传并生成存证哈希的文件总数"},
            {"paramCode": "auditStatus", "paramName": "内部初审状态", "category": "业务明细", "dataType": "string", "unit": "-", "required": True, "source": "初审工作流", "rangeOrEnum": "DRAFT | REVIEWING | APPROVED | REJECTED", "description": "由企业能碳主管对资料完整性与真实性的初审意见"}
        ],
        "dataSources": [
            {"medium": "材料进厂质检报告 (MTC)", "sourceType": "MES / 质量管理系统 QMS", "protocol": "REST API", "device": "QMS 进料检验档案", "tagExample": "QMS_IQC_REPORT_FILE_ID", "frequency": "批次进厂质检归档", "securityLevel": "L3 (商密级)"},
            {"medium": "表计强检铅封证书与校准报告", "sourceType": "设备计量管理系统", "protocol": "SQL 视图抽检", "device": "计量检测台账管理模块", "tagExample": "EMS_METER_CALIBRATION_CERT_NO", "frequency": "年检到期上传", "securityLevel": "L2 (工作秘密)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "认证资料准备完整度评估模型",
                "mathExpression": r"P_{prep} = \frac{\sum_{i=1}^{N} W_i \times S_i}{\sum_{i=1}^{N} W_i} \times 100\%",
                "variables": [
                    {"name": "N", "desc": "该机构认证标准要求的必备材料类别总数", "unit": "项"},
                    {"name": "W_i", "desc": "第 i 类材料的核查权重分值", "unit": "分"},
                    {"name": "S_i", "desc": "第 i 类材料的状态得分 (已上传且合规为 1，缺件为 0)", "unit": "0 或 1"}
                ],
                "logicDescription": "对核心数据凭据（电费结算单、主料供应商 EPD、型式试验报告）赋予更高权重，避免表面件数达标但关键凭据缺失。",
                "boundaryRule": "若任意核心一票否决材料（如出厂试验报告）缺失，P_prep 最高封顶限制在 60%，禁止提交外部申请。"
            }
        ],
        "calculationLogic": "上传文件后台自动计算 SHA-256 哈希值，写入数据库只读审计字段，确保与最终认证机构核验文件完全一致。",
        "dtoSchema": """interface CertMaterialDTO {
  productModel: string;
  certAgency: string;
  prepProgressPct: number;
  isReadyForApply: boolean;
  fileList: {
    fileId: string;
    fileName: string;
    fileCategory: string;
    fileSizeMb: number;
    uploadTime: string;
    sha256Hash: string;
    status: 'PASS' | 'MISSING';
  }[];
}""",
        "roleGuide": {
            "fe": "1. 拖拽上传支持多文件并行上传并具备进度环展示；\n2. 44px 工业表格支持点击“一键打包下载”调用浏览器流式下载 ZIP 包。",
            "be": "1. 大文件切片上传至 MinIO S3，直传前校验 MIME 类型防止可执行木马上传；\n2. 文件下载接口统一添加动态水印，内容包含下载人姓名与时间戳。",
            "qa": "1. 验证上传超过 100MB 超大附件时的切片重传与断点续传能力；\n2. 验证核心材料缺失时，申请按钮正确处于置灰 Disabled 状态。"
        }
    },

    # 11. 认证申请
    {
        "id": "spec-footprint-cert-apply",
        "center": "产品碳足迹集采中心",
        "navGroup": "第三方认证管理",
        "pageName": "认证申请",
        "route": "/carbon-footprint/certification/apply",
        "component": "components/carbon-footprint/cert-apply-view.tsx",
        "overview": "第三方碳核查机构线上申请与协同推进工作流中心。支持发起 ISO 14067 碳足迹核查、国标绿色产品、EPD 环境产品声明线上提单，全流程追踪商务签约、资料移交、现场排期、不符合项 (NC) 整改与专家技术评审全生命周期进度。",
        "subModules": [
            {"name": "认证申请向导与表单", "desc": "分步向导指引填写申请主体、产品信息、认证标准、拟申请周期与指定核查机构。"},
            {"name": "审核流程甘特图与里程碑", "desc": "时间轴展示提单 ➔ 机构初审 ➔ 合同签订 ➔ 现场抽检 ➔ 报告终审 ➔ 证书签发节点。"},
            {"name": "不符合项 (NC) 整改协同看板", "desc": "记录外部审核老师开具的一般/严重不符合项、整改责任人、期限与补充证据上传。"},
            {"name": "多机构报价与认证周期对比", "desc": "横向比选 SGS、TÜV、CQC 等不同机构的商务报价、公信力等级与预期排期。"},
            {"name": "认证申请工单明细台账", "desc": "44px 工业高密表格，列支申请流水号、产品型号、申请机构、当前节点、责任人与状态徽章。"}
        ],
        "parameters": [
            {"paramCode": "applyOrderNo", "paramName": "申请流水单号", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "系统自动生成", "rangeOrEnum": "APPLY-2026-CF-0042", "description": "唯一追踪该次第三方认证项目的全局流水号"},
            {"paramCode": "certStandard", "paramName": "依据认证标准", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "标准下拉", "rangeOrEnum": "ISO 14067 | PAS 2050 | GB/T 24067 | EPD_SYSTEM", "description": "申请认证所遵循的国际或国内标准规范"},
            {"paramCode": "auditAgencyName", "paramName": "受托核查机构", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "机构选择", "rangeOrEnum": "SGS | TUV_SUD | CQC | BV", "description": "承担该次审核的第三方权威发证机构"},
            {"paramCode": "currentStep", "paramName": "当前工作流节点", "category": "核心指标", "dataType": "string", "unit": "-", "required": True, "source": "工作流引擎", "rangeOrEnum": "SUBMITTED | IN_AUDIT | SITE_CHECK | RECTIFYING | COMPLETED", "description": "认证推进的当前生命周期阶段"},
            {"paramCode": "openNcCount", "paramName": "未闭环不符合项数", "category": "核心指标", "dataType": "integer", "unit": "项", "required": True, "source": "整改看板统计", "rangeOrEnum": "0 ~ 20", "description": "待企业团队补充证据或整改的外部审核缺陷数"},
            {"paramCode": "expectedFinishDays", "paramName": "预计剩余天数", "category": "衍生计算", "dataType": "integer", "unit": "天", "required": True, "source": "排期测算模型", "rangeOrEnum": "0 ~ 90", "description": "距离拿到最终核查声明或证书的预估剩余工期"}
        ],
        "dataSources": [
            {"medium": "工作流引擎状态机", "sourceType": "BPM / Flowable 工作流引擎", "protocol": "REST API", "device": "企业审批流服务", "tagExample": "FLOW_INSTANCE_CURRENT_TASK_KEY", "frequency": "节点流转触发", "securityLevel": "L2 (工作秘密)"},
            {"medium": "第三方核查机构对接接口", "sourceType": "外部机构认证申报协同开放平台", "protocol": "OAuth 2.0 + HTTPS Webhook", "device": "CQC / SGS 数据交换接口", "tagExample": "AGENCY_AUDIT_STATUS_CALLBACK", "frequency": "外部状态变更推送", "securityLevel": "L2 (工作秘密)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "认证整改时效达成率模型",
                "mathExpression": r"R_{rectify} = \frac{N_{closed\_on\_time}}{N_{total\_nc}} \times 100\%",
                "variables": [
                    {"name": "N_{closed_on_time}", "desc": "在核查机构指定限期内完成整改闭环的不符合项数", "unit": "项"},
                    {"name": "N_{total_nc}", "desc": "本轮审核外部专家开具的全部不符合项总数", "unit": "项"}
                ],
                "logicDescription": "考核企业能碳管理团队对第三方核查问询与整改要求的响应时效，确保不因内部拖沓导致发证逾期。",
                "boundaryRule": "若 N_total_nc = 0（一次性零缺陷通过），达成率判定为 100%。"
            }
        ],
        "calculationLogic": "工作流节点流转严格基于 RBAC 权限控制，仅拥有“认证管理员”角色的用户允许执行提交与确认整改操作。",
        "dtoSchema": """interface CertApplicationDTO {
  applyOrderNo: string;
  productModel: string;
  standard: string;
  agency: string;
  currentStep: string;
  openNcCount: number;
  daysRemaining: number;
  timeline: { stepName: string; planDate: string; actualDate?: string; status: 'DONE' | 'DOING' | 'TODO' }[];
}""",
        "roleGuide": {
            "fe": "1. 步骤条使用水平进度组件，已完成节点呈翡翠绿打勾，当前节点呼吸光晕高亮；\n2. 44px 工业表格支持点击“处理不符合项”弹窗录入整改凭据与附件。",
            "be": "1. 引入状态机严格限制工作流非法回退（例如已进入发证阶段不允许回退至草稿）；\n2. 审核节点超时未响应自动发送企业微信与邮件提醒对应业务专员。",
            "qa": "1. 验证并发审批场景下分布式锁对申请工单的串行保护；\n2. 验证整改期限倒计时到达 0 时触发的逾期黄色高亮标签提示。"
        }
    },

    # 12. 认证结果管理
    {
        "id": "spec-footprint-cert-result",
        "center": "产品碳足迹集采中心",
        "navGroup": "第三方认证管理",
        "pageName": "认证结果管理",
        "route": "/carbon-footprint/certification/result",
        "component": "components/carbon-footprint/cert-results-view.tsx",
        "overview": "低碳产品认证证书与碳标签数字化资产存证中枢。全面收录全集团已获批的 ISO 14067 碳足迹核查声明、国标绿色产品评价证书、中国节能产品认证与国际 EPD 注册证书，支持证书有效期限动态监控、临期 90 天自动预警、真伪防伪溯源二维码生成与对外招投标资质一键打包。",
        "subModules": [
            {"name": "已获认证资产矩阵看板", "desc": "展示有效证书总数、覆盖产品型号数、国际权威认证占比及即将到期证书数。"},
            {"name": "证书到期日预警雷达", "desc": "按剩余有效期（>180天绿色、90~180天蓝色、<90天琥珀金到期预警）分层统计。"},
            {"name": "碳标签二维码防伪溯源", "desc": "为每个获证型号生成专属动态防伪溯源二维码，扫码可直达官方验真页面。"},
            {"name": "招投标低碳资质一键打包", "desc": "根据市场投标需求批量勾选多个证书，一键导出带特变电子骑缝章的高清 PDF 资质合集。"},
            {"name": "认证证书资产明细台账", "desc": "44px 工业高密表格，展示证书编号、产品型号、颁证机构、颁发日期、到期日期与状态徽章。"}
        ],
        "parameters": [
            {"paramCode": "certType", "paramName": "证书类别", "category": "入参过滤", "dataType": "string", "unit": "-", "required": False, "source": "类型下拉", "rangeOrEnum": "all | ISO_14067 | GREEN_PRODUCT | EPD | ENERGY_SAVE", "description": "证书所属认证制度类型"},
            {"paramCode": "validityStatus", "paramName": "证书有效状态", "category": "入参过滤", "dataType": "string", "unit": "-", "required": False, "source": "状态筛选", "rangeOrEnum": "all | VALID | EXPIRING_SOON | EXPIRED", "description": "按有效期划定的当前有效性状态"},
            {"paramCode": "totalCertCount", "paramName": "有效证书总数", "category": "核心指标", "dataType": "integer", "unit": "本", "required": True, "source": "资产台账统计", "rangeOrEnum": "10 ~ 500", "description": "全集团当前正在有效期内的各类低碳认证证书本数"},
            {"paramCode": "expiringSoonCount", "paramName": "临期预警证书数", "category": "核心指标", "dataType": "integer", "unit": "本", "required": True, "source": "到期日计算", "rangeOrEnum": "0 ~ 50", "description": "距离到期不足 90 天且尚未启动续证流程的证书数"},
            {"paramCode": "qrCodeUrl", "paramName": "验真溯源码直链", "category": "业务明细", "dataType": "string", "unit": "-", "required": True, "source": "溯源服务生成", "rangeOrEnum": "https://trace.tbea.com/cert/verify?id=...", "description": "对外公开展示并印制在产品铭牌上的溯源 URL"},
            {"paramCode": "daysToExpiry", "paramName": "距离到期天数", "category": "衍生计算", "dataType": "integer", "unit": "天", "required": True, "source": "时序倒计时", "rangeOrEnum": "-365 ~ 1,825", "description": "负数代表已过期，正数代表剩余有效天数"}
        ],
        "dataSources": [
            {"medium": "第三方机构原件证书扫描件与元数据", "sourceType": "认证中心证书数字档案库", "protocol": "MySQL 结构化存储", "device": "`dim_carbon_certificate_meta`", "tagExample": "CERT_OFFICIAL_SERIAL_NO", "frequency": "发证入库时录入", "securityLevel": "L1 (内部级)"},
            {"medium": "国家认监委 (CNCA) 官方查询系统", "sourceType": "全国认证认可信息公共服务平台", "protocol": "定期网络核验抽检", "device": "CNCA 数据比对通道", "tagExample": "CNCA_CERT_SYNC_STATUS", "frequency": "每月自动比对一次", "securityLevel": "L0 (公开级)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "证书有效期倒计时与预警判定模型",
                "mathExpression": r"D_{remaining} = \text{DateDiff}(T_{expire}, T_{current}), \quad Status = \begin{cases} \text{EXPIRED}, & D_{remaining} \le 0 \\ \text{EXPIRING\_SOON}, & 0 < D_{remaining} \le 90 \\ \text{VALID}, & D_{remaining} > 90 \end{cases}",
                "variables": [
                    {"name": "T_{expire}", "desc": "证书票面载明的正式失效日期", "unit": "时间戳"},
                    {"name": "T_{current}", "desc": "当前系统自然日零点时间戳", "unit": "时间戳"},
                    {"name": "D_{remaining}", "desc": "有效剩余天数", "unit": "天"}
                ],
                "logicDescription": "每日定时任务自动滚动计算剩余天数，在到达 90 天阈值时自动向对应事业部质检主任推送复审提醒。",
                "boundaryRule": "若证书已标记为“被注销”或“已主动废止”，强制标记为 EXPIRED 状态，忽略日期判定。"
            }
        ],
        "calculationLogic": "对外溯源二维码内嵌企业数字签名，防止第三方恶意伪造变造特变电工低碳铭牌。",
        "dtoSchema": """interface CertResultDTO {
  totalValid: number;
  expiringSoon: number;
  certs: {
    certId: string;
    certNo: string;
    certType: string;
    productModel: string;
    issueDate: string;
    expireDate: string;
    daysRemaining: number;
    agency: string;
    status: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED';
    qrCodeUrl: string;
  }[];
}""",
        "roleGuide": {
            "fe": "1. 临期 90 天证书在表格行以微透琥珀金背景提示，过期以淡红提示；\n2. 支持点击单行弹出二维码悬浮框，并支持一键另存为高清 PNG 矢量图。",
            "be": "1. 证书打包下载使用后台流式 ZipOutputStream 边读边压，杜绝服务器内存 OOM；\n2. 证书快照存储在 MinIO 对象存储，并在数据库中保留 SHA-256 校验和。",
            "qa": "1. 验证系统时间调整后，处于 89 天的证书准确判定为 EXPIRING_SOON；\n2. 验证多选 10 本证书打包下载，压缩包内文件名中文显示正常且无破损。"
        }
    },

    # 13. 原材料碳排放因子库
    {
        "id": "spec-footprint-factor-material",
        "center": "产品碳足迹集采中心",
        "navGroup": "因子库管理",
        "pageName": "原材料碳排因子",
        "route": "/carbon-footprint/factor/material",
        "component": "components/carbon-footprint/factor-material-view.tsx",
        "overview": "变压器与线缆行业原材料基础碳足迹因子库。涵盖电工取向/无取向硅钢、电解铜杆、无氧铜丝、铝合金导体、变压器绝缘油（矿物油/植物油）、环氧树脂浇注料、绝缘纸板等 300+ 关键制造物料的“摇篮到大门”碳排因子，支持 Ecoinvent、CLCD、CPCD 多源数据库比选与供应商实测实景因子精准覆盖。",
        "subModules": [
            {"name": "原材料因子智能搜索与检索", "desc": "支持按物料编码、材料品名、供货商或数据源库快速检索因子参数。"},
            {"name": "多源数据库因子对比矩阵", "desc": "横向比选特变实测实景值 vs 中国本地化 CLCD 库 vs 欧洲 Ecoinvent 库数值偏差。"},
            {"name": "供应商实测因子审核与挂接", "desc": "对宝钢硅钢、江铜铜杆等上游战略供方回传的第三方 EPD 因子进行核验生效。"},
            {"name": "因子多版本演进与生效控制", "desc": "支持按生效年度（如 2024版、2025版）管理因子，支持历史核算锁定与溯源。"},
            {"name": "原材料碳因子明细台账", "desc": "44px 工业高密表格，展示物料代号、名称、因子数值、单位、数据来源、DQR 等级及生效版本。"}
        ],
        "parameters": [
            {"paramCode": "materialCategory", "paramName": "物料分类", "category": "入参过滤", "dataType": "string", "unit": "-", "required": False, "source": "物料大类下拉", "rangeOrEnum": "all | SILICON_STEEL | COPPER | ALUMINUM | OIL | RESIN", "description": "原材料细分大类"},
            {"paramCode": "sourceDatabase", "paramName": "数据来源库", "category": "入参过滤", "dataType": "string", "unit": "-", "required": False, "source": "来源单选", "rangeOrEnum": "all | TBEA_REALSCENE | CLCD | ECOINVENT | CPCD", "description": "因子的底层原始出处数据库"},
            {"paramCode": "emissionFactorValue", "paramName": "碳排放因子值", "category": "核心指标", "dataType": "number", "unit": "kgCO2e/kg", "required": True, "source": "因子库字段", "rangeOrEnum": "0.100 ~ 50.000", "description": "每千克原材料生命周期对应的温室气体排放当量"},
            {"paramCode": "factorVersion", "paramName": "因子生效版本", "category": "核心指标", "dataType": "string", "unit": "-", "required": True, "source": "版本控制", "rangeOrEnum": "v2025.1 | v2026.1", "description": "用于版本隔离追溯的因子批次标识"},
            {"paramCode": "dqrScore", "paramName": "数据质量评级", "category": "核心指标", "dataType": "number", "unit": "分", "required": True, "source": "DQR 模型", "rangeOrEnum": "1.0 ~ 5.0", "description": "因子技术与地理代表性评分，分值越小越权威"},
            {"paramCode": "supplierName", "paramName": "指定供货商名称", "category": "业务明细", "dataType": "string", "unit": "-", "required": False, "source": "供应商台账", "rangeOrEnum": "宝武钢铁 | 江西铜业 | 中石油", "description": "若为供应商特定实测因子，记录具体供货企业"}
        ],
        "dataSources": [
            {"medium": "特变电工上游供应链碳足迹申报平台", "sourceType": "供应链 SRM 协同中台", "protocol": "REST API 接口", "device": "SRM 绿色采购模块", "tagExample": "SRM_SUPPLIER_EPD_FACTOR_VAL", "frequency": "供应商提单审批通过后同步", "securityLevel": "L2 (工作秘密)"},
            {"medium": "中国生命周期基础数据库 (CLCD)", "sourceType": "四川大学/亿科环境权威数据库", "protocol": "官方数据包离线导入", "device": "系统内部标准因子表", "tagExample": "STD_CLCD_FACTOR_SILICON_STEEL", "frequency": "年度授权更新", "securityLevel": "L0 (公开级)"},
            {"medium": "瑞士 Ecoinvent 国际生命周期数据库", "sourceType": "Ecoinvent Association 官方库", "protocol": "JSON 格式结构化镜像", "device": "`dim_ecoinvent_mirror`", "tagExample": "ECOINVENT_FACTOR_COPPER_WIRE", "frequency": "版本更新时维护", "securityLevel": "L0 (公开级)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "多供方原材料加权平均碳因子模型",
                "mathExpression": r"\overline{EF}_{mat} = \frac{\sum_{k=1}^{M} (Q_k \times EF_k)}{\sum_{k=1}^{M} Q_k}",
                "variables": [
                    {"name": "Q_k", "desc": "报告期内从第 k 家供应商采购该原材料的实物质量", "unit": "t"},
                    {"name": "EF_k", "desc": "第 k 家供应商经核实的实测碳排放因子", "unit": "kgCO2e/kg"}
                ],
                "logicDescription": "在企业多源采购场景下，按各钢厂或铜厂实际供货份额加权生成混合材料因子，保证全厂核算的真实性。",
                "boundaryRule": "若某供方未提供实测因子，强制以该品类的国家标准保守因子代入计算，不得盲目拉低平均值。"
            }
        ],
        "calculationLogic": "因子修改需经过二级审批流，修改生效后历史已归档的报告默认锁定原版本因子，重新核算需显式触发。",
        "dtoSchema": """interface MaterialFactorDTO {
  factorCode: string;
  materialName: string;
  category: string;
  factorValue: number;
  unit: string;
  sourceDb: string;
  dqrScore: number;
  version: string;
  isActive: boolean;
}""",
        "roleGuide": {
            "fe": "1. 搜索支持拼音首字母检索（如输入“gg”匹配“硅钢”）；\n2. 44px 工业表格支持点击版本标签切换查看历年历史因子波动折线趋势。",
            "be": "1. 因子表在 Redis 配置二级缓存（Local Cache + Redis 集群），防止每次核算重复扫描 DB；\n2. 因子更新时发布 Pub/Sub 广播消息通知计算节点失效本地缓存。",
            "qa": "1. 验证因子数值录入负数时前端即时拦截阻断；\n2. 验证多版本切换时，旧版本标记为只读禁止篡改。"
        }
    },

    # 14. 区域电网排放因子库
    {
        "id": "spec-footprint-factor-grid",
        "center": "产品碳足迹集采中心",
        "navGroup": "因子库管理",
        "pageName": "电力碳排因子",
        "route": "/carbon-footprint/factor/power",
        "component": "components/carbon-footprint/factor-grid-view.tsx",
        "overview": "国家与区域电网平均供电碳排放因子及绿电市场化因子动态中枢。权威收录生态环境部发布的全国电网平均因子、六大区域电网因子（华北、华东、西北、华中、东北、南方）以及各省域电网因子，并支持基于直供绿电协议 (PPA) 与国家绿证 (GEC) 的市场化零碳电力核销配置。",
        "subModules": [
            {"name": "国家与区域电网权威因子总览", "desc": "呈现生态环境部最新公告的全国电网因子（0.5366 tCO2/MWh）与省网因子。"},
            {"name": "特变各大产业园区电网因子绑定", "desc": "将沈变（辽宁）、衡变（湖南）、新变（新疆）、鲁缆（山东）与属地电网因子精准绑定。"},
            {"name": "市场化绿电与绿证抵扣模型", "desc": "配置自发自用光伏、专线直供绿电及绿证交易在电网计算中的零碳扣减规则。"},
            {"name": "国际出口针对性电网因子配置", "desc": "维护欧盟 CBAM 认可的中国区域电网因子及国际碳披露 CDP 因子基准。"},
            {"name": "电力排放因子历史台账", "desc": "44px 工业高密表格，展示电网区域、省份代码、因子数值、发布机构、发布公报文号与执行年份。"}
        ],
        "parameters": [
            {"paramCode": "regionCode", "paramName": "电网区域代码", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "区域下拉", "rangeOrEnum": "NATIONAL | NORTH_CHINA | EAST_CHINA | NORTHWEST | CENTRAL", "description": "生态环境部划分的电网区域标识"},
            {"paramCode": "provinceCode", "paramName": "所属省份代码", "category": "入参过滤", "dataType": "string", "unit": "-", "required": False, "source": "省份下拉", "rangeOrEnum": "XINJIANG | HUNAN | LIAONING | SHANDONG", "description": "产业园区所在具体省份"},
            {"paramCode": "gridEmissionFactor", "paramName": "电网平均供电因子", "category": "核心指标", "dataType": "number", "unit": "kgCO2/kWh", "required": True, "source": "生态环境部公告", "rangeOrEnum": "0.200 ~ 0.900", "description": "每消耗一度外购市电对应的二氧化碳间接排放量"},
            {"paramCode": "officialDocNo", "paramName": "发布公报文号", "category": "业务明细", "dataType": "string", "unit": "-", "required": True, "source": "公报台账", "rangeOrEnum": "环办气候函〔2024〕145号", "description": "国家部委官方正式印发的文件文号"},
            {"paramCode": "effectiveYear", "paramName": "发布执行年份", "category": "核心指标", "dataType": "string", "unit": "年", "required": True, "source": "年份台账", "rangeOrEnum": "2023 | 2024 | 2025 | 2026", "description": "该因子对应的官方核算年度"}
        ],
        "dataSources": [
            {"medium": "生态环境部气候司官方公告", "sourceType": "国家生态环境部权威发布公报", "protocol": "官方公报文本录入", "device": "环境部政策法规公报库", "tagExample": "MEE_OFFICIAL_GRID_FACTOR_DOC", "frequency": "每年公报发布后维护", "securityLevel": "L0 (公开级)"},
            {"medium": "国家能源局可再生能源信息管理中心", "sourceType": "绿证核发与交易系统", "protocol": "API 接口认证", "device": "全国绿证核发平台接入通道", "tagExample": "GEC_GREEN_CERTIFICATE_VERIFIED", "frequency": "按月对账", "securityLevel": "L1 (内部级)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "厂区综合外购电力加权碳因子模型",
                "mathExpression": r"EF_{elec\_mix} = \frac{(Q_{grid} - Q_{gec}) \times EF_{grid} + Q_{green\_direct} \times 0}{Q_{total\_elec}}",
                "variables": [
                    {"name": "Q_{grid}", "desc": "从公共电网购入的总电量", "unit": "kWh"},
                    {"name": "Q_{gec}", "desc": "已完成唯一核销注销的绿证对应电量", "unit": "kWh"},
                    {"name": "EF_{grid}", "desc": "属地电网官方公布的供电排放因子", "unit": "kgCO2/kWh"},
                    {"name": "Q_{green_direct}", "desc": "专线直供或分布式光伏消纳电量（零碳因子）", "unit": "kWh"},
                    {"name": "Q_{total_elec}", "desc": "工厂全部实际消耗的电量总和", "unit": "kWh"}
                ],
                "logicDescription": "融合物理绿电与市场化凭据，精准核算企业在消纳绿电后的净外购电力碳强度。",
                "boundaryRule": "在申报 CBAM 模式下，目前欧盟暂不支持以国内绿证抵扣 Scope 2 间接排放，系统自动切换为纯电网因子计算模式。"
            }
        ],
        "calculationLogic": "严格遵循国内碳核算标准与欧盟国际标准的双轨制核算开关，确保双端出数口径权威可解释。",
        "dtoSchema": """interface GridFactorDTO {
  regionCode: string;
  provinceCode: string;
  factorValue: number;
  docNo: string;
  year: string;
  boundParks: string[];
}""",
        "roleGuide": {
            "fe": "1. 中国地图高亮各省电网因子梯队，深蓝至浅蓝渐变表示碳强度高低；\n2. 44px 工业表格支持点击“绑定园区”弹窗配置工厂归属省份。",
            "be": "1. 因子变动后触发关联工厂当期未结案工单的自动重算任务队列；\n2. 严格按执行年份版本做历史切片，禁止覆盖历史年份记录。",
            "qa": "1. 验证当绿证核销电量大于外购电量时，综合因子截断为 0 而非负数；\n2. 验证沈变、衡变、新变匹配正确的属地省网因子。"
        }
    },

    # 15. 能源活动碳排因子库
    {
        "id": "spec-footprint-factor-fuel",
        "center": "产品碳足迹集采中心",
        "navGroup": "因子库管理",
        "pageName": "能源活动碳排因子",
        "route": "/carbon-footprint/factor/energy",
        "component": "components/carbon-footprint/factor-fuel-view.tsx",
        "overview": "化石燃料燃烧与工业热力温室气体排放因子库。依照国家发改委《工业其他行业企业温室气体排放核算方法与报告指南》及 IPCC 2006 准则，维护管道天然气、轻柴油、无烟煤、工业蒸汽（过热/饱和蒸汽）等能源介质的低位发热量、单位热值含碳量、碳氧化率与 CO2 综合转化系数，支持热力温压参数自适应校正。",
        "subModules": [
            {"name": "化石燃料排放因子矩阵", "desc": "收录天然气、柴油、无烟煤等化石燃料的标准热值与碳氧化参数。"},
            {"name": "购入蒸汽与热力因子校正器", "desc": "根据现场蒸汽表计测量的温度与表压（MPa），动态计算实际焓值与折算因子。"},
            {"name": "实测发热量与缺省值切换", "desc": "支持天然气供气方提供的实测组分热值优先代入，无实测时调用国标缺省值。"},
            {"name": "移动源燃油排放因子管理", "desc": "维护厂区叉车、转运重卡消耗柴油的温室气体排放系数。"},
            {"name": "能源活动因子明细台账", "desc": "44px 工业高密表格，展示介质名称、低位发热量、单位热值含碳量、碳氧化率、综合因子及出处。"}
        ],
        "parameters": [
            {"paramCode": "fuelType", "paramName": "能源介质类型", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "燃料下拉", "rangeOrEnum": "NATURAL_GAS | DIESEL | STEAM_SUPERHEATED | STEAM_SATURATED", "description": "消耗的燃料或热力介质分类"},
            {"paramCode": "netCalorificValue", "paramName": "平均低位发热量", "category": "核心指标", "dataType": "number", "unit": "GJ/t 或 GJ/万m³", "required": True, "source": "实测化验/国标", "rangeOrEnum": "100.0 ~ 500.0", "description": "燃料燃烧释放的有效能量"},
            {"paramCode": "carbonContentPerGj", "paramName": "单位热值含碳量", "category": "核心指标", "dataType": "number", "unit": "tC/GJ", "required": True, "source": "国家指南缺省值", "rangeOrEnum": "0.010 ~ 0.035", "description": "每 GJ 热量所含有的纯碳元素质量"},
            {"paramCode": "carbonOxidationRatePct", "paramName": "碳氧化率", "category": "核心指标", "dataType": "number", "unit": "%", "required": True, "source": "设备燃烧工况", "rangeOrEnum": "95.0% ~ 99.5%", "description": "燃料完全燃烧转化为二氧化碳的化学比例"},
            {"paramCode": "comprehensiveEmissionFactor", "paramName": "综合碳排放因子", "category": "衍生计算", "dataType": "number", "unit": "tCO2/万m³ 或 tCO2/t", "required": True, "source": "乘积公式计算", "rangeOrEnum": "1.00 ~ 30.00", "description": "消耗单位实物量能源所直接排放的温室气体总量"}
        ],
        "dataSources": [
            {"medium": "燃气公司每月天然气组分化验单", "sourceType": "供气企业月度质检单", "protocol": "人工扫码录入 / OCR 识别", "device": "燃气供应商结算附件", "tagExample": "GAS_CO_LAB_CALORIFIC_VAL", "frequency": "月度抄表结算归档", "securityLevel": "L2 (工作秘密)"},
            {"medium": "国家温室气体排放核算方法与报告指南", "sourceType": "国家发改委 / 生态环境部标准", "protocol": "系统内置标准字典", "device": "`dim_fuel_emission_standard`", "tagExample": "STD_IPCC_DEFAULT_FUEL_FACTOR", "frequency": "指南修订时更新", "securityLevel": "L0 (公开级)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "化石燃料燃烧直接碳排放因子乘积模型",
                "mathExpression": r"EF_{fuel} = NCV \times CC \times OF \times \frac{44}{12}",
                "variables": [
                    {"name": "NCV", "desc": "平均低位发热量", "unit": "GJ/t 或 GJ/万m³"},
                    {"name": "CC", "desc": "单位热值含碳量", "unit": "tC/GJ"},
                    {"name": "OF", "desc": "碳氧化率 (Oxidation Factor)", "unit": "无量纲小数 (如 0.99)"},
                    {"name": "44/12", "desc": "碳到二氧化碳的分子量换算常数", "unit": "-"}
                ],
                "logicDescription": "国家发改委权威核算规范标准乘法链，所有参数来源透明、步骤可验证。",
                "boundaryRule": "若某项参数缺乏实测化验条件，系统强制严格采用国标附录表缺省值（如天然气 OF 强制按 0.99 计）。"
            }
        ],
        "calculationLogic": "蒸汽综合因子根据温度压力动态查 IAPWS-IF97 水蒸汽焓值表转换为热量，再乘以热力因子（0.11 tCO2/GJ）。",
        "dtoSchema": """interface FuelFactorDTO {
  fuelType: string;
  fuelName: string;
  ncv: number;
  cc: number;
  of: number;
  finalFactor: number;
  unit: string;
  isMeasured: boolean;
}""",
        "roleGuide": {
            "fe": "1. 蒸汽参数配置提供温度与压力输入框，动态联动画出焓值并实时更新最终因子；\n2. 44px 工业表格支持点击单行查看公式计算乘积展开步骤。",
            "be": "1. 内置水蒸汽热力性质国际公式 (IAPWS-IF97) 计算模块，确保蒸汽焓值换算精度达小数点后 4 位；\n2. 历史天然气组分化验单保留原始附件下载链接。",
            "qa": "1. 验证天然气碳氧化率 OF 输入 105% 超过 100% 时被严格校验拦截；\n2. 验证计算出的综合因子与手动计算器结果误差在 0.001% 以内。"
        }
    },

    # 16. 综合能耗折标煤系数库
    {
        "id": "spec-footprint-factor-coal",
        "center": "产品碳足迹集采中心",
        "navGroup": "因子库管理",
        "pageName": "折标煤系数库",
        "route": "/carbon-footprint/factor/coal",
        "component": "components/carbon-footprint/factor-coal-view.tsx",
        "overview": "综合能耗折标准煤当量与等价系数权威基准库（严格遵循 GB/T 2589《综合能耗计算通则》）。维护电力当量折标（0.1229 kgce/kWh）、电力等价折标（~0.3000 kgce/kWh）、自来水、天然气、工业蒸汽、压缩空气的折标系数与企业考核系数，统一全集团综合能耗统计口径与考核标尺。",
        "subModules": [
            {"name": "国标 GB/T 2589 折标系数基准", "desc": "维护国家统一规定的电力、天然气、热力等标准煤折算系数当量值。"},
            {"name": "电力当量与等价折算模式切换", "desc": "支持生产工序物理考核（当量 0.1229）与全社会节能节能量考核（等价 0.3000）一键切换。"},
            {"name": "水资源与辅助工质折算模型", "desc": "收录自来水 (0.0857 kgce/t)、循环水、压缩空气 (0.0400 kgce/m³) 的工质能耗系数。"},
            {"name": "企业内部统一能耗折算规则", "desc": "维护集团财务与战略运营部下达的年度内控能效考核折算标准。"},
            {"name": "折标煤系数明细台账", "desc": "44px 工业高密表格，列支介质代码、名称、实物单位、当量折标系数、等价折标系数与引用标准。"}
        ],
        "parameters": [
            {"paramCode": "energyMediumCode", "paramName": "能源介质代号", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "介质选择", "rangeOrEnum": "ELECTRICITY | WATER | NATURAL_GAS | STEAM | COMPRESSED_AIR", "description": "需要换算折标的标准能源介质代号"},
            {"paramCode": "equivalentFactorKgce", "paramName": "当量折标系数", "category": "核心指标", "dataType": "number", "unit": "kgce/实物单位", "required": True, "source": "国标 GB/T 2589", "rangeOrEnum": "0.0100 ~ 5.0000", "description": "基于能源自身理论热值换算的标准煤系数（如电: 0.1229）"},
            {"paramCode": "equalValueFactorKgce", "paramName": "等价折标系数", "category": "核心指标", "dataType": "number", "unit": "kgce/实物单位", "required": True, "source": "供电煤耗统计", "rangeOrEnum": "0.0100 ~ 5.0000", "description": "考虑发电与输变电全过程煤耗的等价值（如电: ~0.3000）"},
            {"paramCode": "activeStandardCode", "paramName": "执行标准代号", "category": "业务明细", "dataType": "string", "unit": "-", "required": True, "source": "标准台账", "rangeOrEnum": "GB/T 2589-2020", "description": "当前生效的国家综合能耗计算通则标准号"}
        ],
        "dataSources": [
            {"medium": "国家标准化管理委员会官方标准公告", "sourceType": "国家标准全文公开系统", "protocol": "国标文本规范录入", "device": "全国标准信息公共服务平台", "tagExample": "STD_GB_T_2589_2020", "frequency": "标准换版时维护", "securityLevel": "L0 (公开级)"},
            {"medium": "国家统计局年度供电标准煤耗公告", "sourceType": "统计局能源统计年鉴", "protocol": "年度年鉴数据提取", "device": "国家统计局数据发布库", "tagExample": "NBS_ANNUAL_COAL_CONSUMPTION_PER_KWH", "frequency": "每年统计公报更新", "securityLevel": "L0 (公开级)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "综合能耗折标准煤汇总计算模型",
                "mathExpression": r"E_{total\_tce} = \sum_{i=1}^{P} \frac{Q_i \times K_i}{1000}",
                "variables": [
                    {"name": "Q_i", "desc": "报告期内第 i 种能源介质实物消耗量", "unit": "实物单位 (kWh/m³/t)"},
                    {"name": "K_i", "desc": "第 i 种能源介质折标煤系数 (当量或等价)", "unit": "kgce/实物单位"}
                ],
                "logicDescription": "全厂或单产品综合能耗归一化的标准公式，将不同形态能源统一换算为国际标准煤当量。",
                "boundaryRule": "外供能源或输出余热需作为负项扣减，全厂综合能耗允许净值统计。"
            }
        ],
        "calculationLogic": "系统内所有能耗大屏、用能分析与单耗核算必须严格统一引用本库系数，杜绝业务端硬编码常数。",
        "dtoSchema": """interface CoalFactorDTO {
  mediumCode: string;
  mediumName: string;
  physicalUnit: string;
  equivalentKgce: number;
  equalValueKgce: number;
  standardCode: string;
  lastUpdated: string;
}""",
        "roleGuide": {
            "fe": "1. 提供全局“当量/等价模式”切换开关，切换时整站能耗折标数值平滑联动；\n2. 44px 工业表格支持一键导出为企业能耗统计报表格式。",
            "be": "1. 统一封装 `EnergyTceCalculator` 工具类供所有微服务共享依赖，杜绝公式重复编写；\n2. 严格控制系数修改权限，写操作须记录审计留痕日志。",
            "qa": "1. 验证电力当量系数修改时，涉及 65+ 项指标历史核算数据的幂等与版本一致性；\n2. 验证折标煤汇总公式在多介质混合计算下的数值精度。"
        }
    }
]
