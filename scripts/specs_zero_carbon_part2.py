# -*- coding: utf-8 -*-
"""
特变电工能碳数字化双中心 · 零碳园区集控中心全量规格第 2 部分 (specs_zero_carbon_part2.py)
涵盖：对标管理 (1)、零碳项目 (4)、统计报表 (3)、基础管理 (3)
"""

ZERO_CARBON_SPECS_PART2 = [
    # 11. 对标管理
    {
        "id": "spec-energy-benchmark",
        "center": "零碳园区集控中心",
        "navGroup": "能耗能效分析",
        "pageName": "对标管理",
        "route": "/zero-carbon/energy/benchmark",
        "component": "components/energy/benchmark-view.tsx",
        "overview": "能效对标与节能潜力分析中枢。对接国家重点行业能耗限额标准（GB 31335 / GB 31336）先进值与行业平均基准，开展集团内部 6 大经营单位及重点装备单耗横向排比，客观量化偏离度与节能降碳技术改造潜力空间。",
        "subModules": [
            {"name": "国家能效领跑者对标", "desc": "变压器能耗限额 (GB 31335)、电线电缆能耗限额 (GB 31336) 先进标杆对比。"},
            {"name": "经营单位能效排比矩阵", "desc": "沈变、衡变、新变、鲁缆、德缆、新缆等综合能耗、产值单耗、工序单耗横向排比。"},
            {"name": "标杆偏离度矩阵分析", "desc": "测算各单位相比行业先进值的正负差距量与偏离百分比。"},
            {"name": "节能潜力空间动态测算", "desc": "量化达标行业先进值后企业可节约的标准煤与经济价值。"},
            {"name": "能效对标明细台账", "desc": "44px 工业高密表格，按行业规范单耗标准客观列支实测值、标杆值与偏差量。"}
        ],
        "parameters": [
            {"paramCode": "industryType", "paramName": "产业类型", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "产业切片下拉", "rangeOrEnum": "TRANSFORMER | CABLE | SWITCHGEAR", "description": "对标分析所属细分装备制造产业"},
            {"paramCode": "benchmarkTarget", "paramName": "对标基准类型", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "基准切换", "rangeOrEnum": "NATIONAL_TOP | INDUSTRY_AVG | GROUP_BEST", "description": "国家先进标杆、行业准入基准或集团最优标杆"},
            {"paramCode": "actualMetricValue", "paramName": "当前实际指标值", "category": "核心指标", "dataType": "number", "unit": "指标单位", "required": True, "source": "核算引擎", "rangeOrEnum": "0.1 ~ 1,000", "description": "参评单位当前实际指标水平"},
            {"paramCode": "targetBenchmarkValue", "paramName": "对标基准目标值", "category": "核心指标", "dataType": "number", "unit": "指标单位", "required": True, "source": "标准数据库", "rangeOrEnum": "0.1 ~ 800", "description": "对应标准规定的能耗限额先进值"},
            {"paramCode": "varianceRatePct", "paramName": "标杆偏离百分比", "category": "衍生计算", "dataType": "number", "unit": "%", "required": True, "source": "偏离度模型", "rangeOrEnum": "-50.0% ~ +100.0%", "description": "负值代表由于标杆（领跑），正值代表高耗能"},
            {"paramCode": "potentialEnergySavingsTce", "paramName": "年节能量潜力空间", "category": "衍生计算", "dataType": "number", "unit": "tce/年", "required": True, "source": "潜力评估模型", "rangeOrEnum": "0 ~ 10,000", "description": "达到标杆后预期每年可节约的标煤量"},
            {"paramCode": "potentialCostSavingsYuan", "paramName": "年经济效益空间", "category": "衍生计算", "dataType": "number", "unit": "万元/年", "required": True, "source": "综合单价折算", "rangeOrEnum": "0 ~ 1,500", "description": "预期节能量对应的综合能源费用节省金额"}
        ],
        "dataSources": [
            {"medium": "国家能效领跑者限额标准", "sourceType": "国家标准规范全文库", "protocol": "MySQL 系统标准表", "device": "`dim_national_standard_benchmark`", "tagExample": "STD_GB31335_LEVEL1", "frequency": "标准更新时录入", "securityLevel": "L0 (公开级)"},
            {"medium": "各单位实测单耗数据", "sourceType": "集控中心单耗数仓", "protocol": "数据库只读视图", "device": "`dwd_unit_product_energy`", "tagExample": "ACTUAL_UNIT_PRODUCT_TCE", "frequency": "月度更新", "securityLevel": "L2 (工作秘密)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "能耗标杆偏离度与节能潜力测算模型",
                "mathExpression": r"Dev = \frac{V_{actual} - V_{benchmark}}{V_{benchmark}} \times 100\%, \quad \Delta E_{savings} = (V_{actual} - V_{benchmark}) \times Q_{annual\_production}",
                "variables": [
                    {"name": "V_{actual}", "desc": "参评单位当前实际单位产品或工序单耗", "unit": "tce/单位"},
                    {"name": "V_{benchmark}", "desc": "对标基准（国家先进限额值）", "unit": "tce/单位"},
                    {"name": "Q_{annual_production}", "desc": "企业该产品全年设计规划产量", "unit": "实物台套或长度"}
                ],
                "logicDescription": "通过差距量乘以全年产能规模，精准量化节能技改的技术收益与投资必要性。",
                "boundaryRule": "若实际单耗已优于标杆 (V_actual ≤ V_benchmark)，节能量潜力自动置为 0 并提示处于领跑状态，不出现负节能潜力。"
            }
        ],
        "calculationLogic": "严格遵循客观中立原则，严禁使用'落后单位'、'达标处罚'等主观说教字眼，仅客观陈述量化偏差与基准数值。",
        "dtoSchema": """interface EnergyBenchmarkDTO {
  industry: string;
  benchmarks: {
    indicatorName: string;
    actualValue: number;
    benchmarkValue: number;
    unit: string;
    variancePct: number;
    potentialSavingsTce: number;
  }[];
}""",
        "frontendSpecs": "- 44px 工业高密表格，表头垂直居中；\n- 状态由客观差值自解释，无主观评价标签；\n- 标准 `<ExportButton />` 组件 (80x36px)。",
        "backendSpecs": "- 接口：`GET /api/v1/zero-carbon/energy/benchmark`\n- 标准数据库支持多版本历史溯源对比。",
        "qaTestSpecs": "- 偏离度测试: 验证当实际值正好等于标杆值时，偏离度为 0.0% 且潜力为 0；\n- 导出测试: 验证导出 Excel 表格行高与列名符合规范。"
    },

    # 12. 项目档案管理
    {
        "id": "spec-project-archive",
        "center": "零碳园区集控中心",
        "navGroup": "零碳项目评估",
        "pageName": "项目档案管理",
        "route": "/zero-carbon/project/archive",
        "component": "components/project/archive-view.tsx",
        "overview": "园区与工厂节能减排、新能源开发及数字化技改项目的全生命周期数字档案库。集中管理项目立项批复、设备型号技术参数、投资额、预期节能量与设计减排量，支持全生命周期状态流转跟踪。",
        "subModules": [
            {"name": "项目全生命周期状态机", "desc": "立项申报 ➔ 方案评审 ➔ 工程施工 ➔ 调试试运 ➔ 竣工投运 ➔ 效益评估六阶段闭环流转。"},
            {"name": "项目多维分类检索", "desc": "按项目类别（分布式光伏/电化学储能/空压站节能/余热回收/热泵应用/能碳数字化）与所属园区快捷检索。"},
            {"name": "技术参数与投资台账", "desc": "装机容量 (kWp/kWh)、合同投资额 (万元)、预期年节电量 (万kWh) 及年减碳量 (tCO2e)。"},
            {"name": "项目关键节点时间轴", "desc": "开工日期、并网日期、竣工验收日期与投资回收期里程碑标记。"},
            {"name": "项目档案明细表", "desc": "44px 工业高密表格，支持档案详情弹窗与投资效益报表导出。"}
        ],
        "parameters": [
            {"paramCode": "projectId", "paramName": "项目唯一编码", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "立项生成", "rangeOrEnum": "PRJ-2026-XXXX", "description": "节能技改项目唯一资产编码"},
            {"paramCode": "projectType", "paramName": "项目类别", "category": "入参过滤", "dataType": "string", "unit": "-", "required": False, "source": "类别下拉", "rangeOrEnum": "PV | ESS | HEAT_PUMP | COMPRESSOR | WASTE_HEAT | EMS", "description": "技改工程分类"},
            {"paramCode": "investmentAmountYuan", "paramName": "总投资金额", "category": "核心指标", "dataType": "number", "unit": "万元", "required": True, "source": "合同批复", "rangeOrEnum": "1.0 ~ 50,000.0", "description": "项目批复总投资概算"},
            {"paramCode": "expectedAnnualSavingsTce", "paramName": "预期年节能量", "category": "核心指标", "dataType": "number", "unit": "tce/年", "required": True, "source": "可行性研究报告", "rangeOrEnum": "10 ~ 10,000", "description": "可研报告设计的年节标煤量"},
            {"paramCode": "expectedAnnualCo2ReductionT", "paramName": "预期年减碳量", "category": "核心指标", "dataType": "number", "unit": "tCO2e/年", "required": True, "source": "可研报告", "rangeOrEnum": "20 ~ 20,000", "description": "设计年度温室气体减排量"},
            {"paramCode": "paybackPeriodYears", "paramName": "静态投资回收期", "category": "衍生计算", "dataType": "number", "unit": "年", "required": True, "source": "经济测算模型", "rangeOrEnum": "1.0 ~ 15.0", "description": "总投资除以年净节能效益"},
            {"paramCode": "projectLifecycleState", "paramName": "全生命周期状态", "category": "业务明细", "dataType": "string", "unit": "-", "required": True, "source": "工作流驱动", "rangeOrEnum": "APPLY | REVIEW | CONSTRUCT | DEBUG | RUNNING | ARCHIVED", "description": "项目当前阶段"}
        ],
        "dataSources": [
            {"medium": "立项批复与商务合同", "sourceType": "OA 协同办公系统 / ERP 项目管理模块", "protocol": "REST API 流程直连", "device": "集团项目审批数据库 `t_project_lifecycle`", "tagExample": "OA_PROJECT_APPROVAL_DOC", "frequency": "立项时更新", "securityLevel": "L3 (核心商密)"},
            {"medium": "设备铭牌技术参数", "sourceType": "设备台账管理系统", "protocol": "系统内部同步", "device": "设备资产台账表", "tagExample": "ASSET_RATED_CAPACITY", "frequency": "归档录入", "securityLevel": "L2 (工作秘密)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "节能项目静态投资回收期计算",
                "mathExpression": r"PBP = \frac{I_{total}}{B_{annual\_net}} = \frac{I_{total}}{\Delta E_{savings} \times P_{energy} - C_{om}}",
                "variables": [
                    {"name": "I_{total}", "desc": "项目工程总投资合同额", "unit": "万元"},
                    {"name": "B_{annual_net}", "desc": "年均净节能经济效益", "unit": "万元/年"},
                    {"name": "C_{om}", "desc": "年均运维保修与折旧成本支出", "unit": "万元/年"}
                ],
                "logicDescription": "评估技改投资财务合理性的基础指标，为项目立项决策提供量化依据。",
                "boundaryRule": "若预期年效益 B_annual_net ≤ 0，回收期标记为无效并阻止立项推进。"
            }
        ],
        "calculationLogic": "项目归档档案支持与后续实时监控与效益评估模块主外键关联，实现项目全生命周期穿透。",
        "dtoSchema": """interface ProjectArchiveDTO {
  projectId: string;
  name: string;
  type: string;
  park: string;
  investmentAmount: number;
  expectedAnnualSavingsTce: number;
  expectedAnnualCo2ReductionT: number;
  paybackYears: number;
  state: string;
}""",
        "frontendSpecs": "- 44px 工业高密表格，弹窗表单圆角固定 8px；\n- 标准 `<ExportButton />` 组件 (80x36px)；\n- 状态机采用中立徽章配色，无多余说明性标签。",
        "backendSpecs": "- 接口：`GET /api/v1/zero-carbon/project/archive`\n- 支持大附件（技术方案 PDF）上传至 MinIO 对象存储。",
        "qaTestSpecs": "- 状态流转测试: 验证从立项到投运状态变更时，各阶段时间戳不可逆；\n- 必填校验: 验证投资额与设计节能量为非空数字校验。"
    },

    # 13. 实时监控
    {
        "id": "spec-project-monitoring",
        "center": "零碳园区集控中心",
        "navGroup": "零碳项目评估",
        "pageName": "实时监控",
        "route": "/zero-carbon/project/monitoring",
        "component": "components/project/monitoring-view.tsx",
        "overview": "在运营节能减排技改项目的高频物理运行工况集中监控。实时监视分布式光伏组串发电效率、储能 PCS 充放电实时功率、变频空压机群实时比功率与余热回收温控状态，及时捕捉设备运行异常与越限工况。",
        "subModules": [
            {"name": "已投运项目状态概览", "desc": "展示各在运技改项目的实时有功功率、运行工况指示灯与累计运行时长。"},
            {"name": "项目能效曲线流式监控", "desc": "实时刷新瞬时节电功率曲线，并与未改造前的基准功率曲线动态叠加对比。"},
            {"name": "变频与节能设备实时效率", "desc": "监视变频器实时运行频率 (Hz)、电机负荷率及空压机比功率 (kW/(m³/min))。"},
            {"name": "设备异常预警与状态联锁", "desc": "机组过温、过压、低压差等异常工况秒级捕捉与声光弹窗报警。"},
            {"name": "实时测点数据台账", "desc": "44px 工业高密表格，按设备展示实时电压、电流、功率因数、温度及瞬时节能量。"}
        ],
        "parameters": [
            {"paramCode": "projectId", "paramName": "关联项目编码", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "左侧列表", "rangeOrEnum": "PRJ-2026-XXXX", "description": "当前监控的指定在运行技改项目"},
            {"paramCode": "realtimeActivePowerKw", "paramName": "当前运行功率", "category": "核心指标", "dataType": "number", "unit": "kW", "required": True, "source": "技改专机电表", "rangeOrEnum": "0 ~ 5,000", "description": "设备当前的瞬时电功率"},
            {"paramCode": "realtimeSavingsRateKw", "paramName": "瞬时节电功率", "category": "核心指标", "dataType": "number", "unit": "kW", "required": True, "source": "基准负荷扣减", "rangeOrEnum": "0 ~ 1,000", "description": "当前相较于基准工况正在节省的功率"},
            {"paramCode": "runningFrequencyHz", "paramName": "变频器运行频率", "category": "业务明细", "dataType": "number", "unit": "Hz", "required": False, "source": "变频器通信", "rangeOrEnum": "0.0 ~ 50.0", "description": "电机当前调节工作频率"},
            {"paramCode": "runningHours", "paramName": "累计安全运行时长", "category": "业务明细", "dataType": "number", "unit": "小时", "required": True, "source": "PLC 内部计时器", "rangeOrEnum": "0 ~ 87,600", "description": "投运至今累计开机小时数"},
            {"paramCode": "alarmState", "paramName": "实时预警状态", "category": "核心指标", "dataType": "string", "unit": "-", "required": True, "source": "阈值规则引擎", "rangeOrEnum": "NORMAL | WARNING | CRITICAL", "description": "当前有无越限故障"}
        ],
        "dataSources": [
            {"medium": "节能设备独立电能表", "sourceType": "配电抽屉物联网电表直采", "protocol": "Modbus-TCP", "device": "安科瑞导轨式电力仪表", "tagExample": "PRJ_METER_KW_INSTANT", "frequency": "5 秒遥测", "securityLevel": "L1 (内部级)"},
            {"medium": "节能控制柜 PLC 变量", "sourceType": "西门子 S7-1500 / 汇川 PLC", "protocol": "Profinet / OPC UA", "device": "空压机联控柜 / 变频控制柜", "tagExample": "PLC_RUN_FREQ_HZ", "frequency": "2 秒", "securityLevel": "L2 (工作秘密)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "瞬时节电功率差值核算",
                "mathExpression": r"P_{savings}(t) = P_{baseline}(工况) - P_{actual}(t)",
                "variables": [
                    {"name": "P_{baseline}", "desc": "对应相同工况负载下技改前的基准耗电功率", "unit": "kW"},
                    {"name": "P_{actual}", "desc": "当前改造后节能专机实测运行电功率", "unit": "kW"}
                ],
                "logicDescription": "通过基准线减去实测功率，秒级呈现节能技改产生的削减出力。",
                "boundaryRule": "若设备空载停机 (P_actual < 1kW)，节电功率强制置为 0，防止把停产错算为节电。"
            }
        ],
        "calculationLogic": "实时数据经由边缘网关缓冲后以 WebSocket 推送至前端页面，保证曲线平滑连续。",
        "dtoSchema": """interface ProjectMonitoringDTO {
  projectId: string;
  realtimePowerKw: number;
  realtimeSavingsKw: number;
  frequencyHz: number;
  runningHours: number;
  alarmLevel: string;
  telemetryStream: { timestamp: string; powerKw: number; baselineKw: number }[];
}""",
        "frontendSpecs": "- 图表悬停游标微透科技蓝 `rgba(56, 189, 248, 0.08)`；\n- 44px 工业高密表格；\n- 采用 SVG 矢量动画展示水泵与风机运转态势。",
        "backendSpecs": "- 接口：`GET /api/v1/zero-carbon/project/monitoring/stream`\n- 支持 SSE (Server-Sent Events) 高频低开销推送。",
        "qaTestSpecs": "- 停产过滤测试: 模拟设备停机断电，验证节电量不发生虚假累加；\n- 高频推送测试: 持续 1 小时 5s 频次推送，前端无内存泄漏与 DOM 卡顿。"
    },

    # 14. 项目运行评估 (节能效益评估)
    {
        "id": "spec-project-benefit",
        "center": "零碳园区集控中心",
        "navGroup": "零碳项目评估",
        "pageName": "项目运行评估",
        "route": "/zero-carbon/project/benefit",
        "component": "components/project/benefit-view.tsx",
        "overview": "特变电工节能降碳四大专项工程（储能、光伏、热泵、空调）运行效益客观评估中枢。依据权威业务规范，评估 Tab 顺序严格遵循【储能运行评估】➔【光伏运行评估】➔【热泵运行评估】➔【空调运行评估】。提供空调制冷机组功率、COP、用电量、供冷量、折算面积单耗能效双环图；热泵运行台账彻底去噪（剥离层高列与多余操作列），严格对比实际节能量与设计基准，量化节能增效收益。",
        "subModules": [
            {"name": "四大评估体系标准 Tab", "desc": "顺序严格固定为：【储能运行评估】➔【光伏运行评估】➔【热泵运行评估】➔【空调运行评估】。"},
            {"name": "空调运行评估能效双环图", "desc": "MiniStructureDonut 电能来源（市电/绿电/储能）与避峰时段构成双环图，展示 COP、冷机功率、供冷量。"},
            {"name": "热泵运行台账极简纯化", "desc": "彻底剥离建筑层高冗余列与最右侧操作列（层高折算查验），表格列宽舒展自适应。"},
            {"name": "储能削峰填谷效益测算", "desc": "储能电站谷充峰放度电量、实际套利金额、充放循环效率与合同能源管理收益分成。"},
            {"name": "光伏自发自用收益评估", "desc": "光伏本地消纳比例、余电上网电费、直发绿电替代外购火电节省成本核算。"},
            {"name": "效益评估高密台账", "desc": "44px 工业高密表格，空调台账表头纯粹为'COP'，白字白图标标准导出。"}
        ],
        "parameters": [
            {"paramCode": "evalType", "paramName": "评估专项体系", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "评估大 Tab 切换", "rangeOrEnum": "ESS | PV | HEAT_PUMP | HVAC_CHILLER", "description": "当前评估的工程类别（储能/光伏/热泵/空调）"},
            {"paramCode": "evalCycle", "paramName": "核算周期", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "月份选择器", "rangeOrEnum": "YYYY-MM", "description": "评估账单月份"},
            {"paramCode": "copValue", "paramName": "空调/热泵系统性能系数 COP", "category": "核心指标", "dataType": "number", "unit": "-", "required": True, "source": "冷热量与电耗之比", "rangeOrEnum": "2.00 ~ 7.00", "description": "制冷或供热系统综合能效比"},
            {"paramCode": "coolingEnergyGj", "paramName": "累计供冷量", "category": "核心指标", "dataType": "number", "unit": "GJ 或 万kWh", "required": True, "source": "水系统能量计", "rangeOrEnum": "0 ~ 50,000", "description": "空调水系统送出制冷显热与潜热总量"},
            {"paramCode": "hvacPowerKwh", "paramName": "空调机组耗电量", "category": "核心指标", "dataType": "number", "unit": "kWh", "required": True, "source": "冷机专用电表", "rangeOrEnum": "0 ~ 1,000,000", "description": "冷水机组、冷却塔、冷冻泵总用电"},
            {"paramCode": "unitAreaEnergyConsumption", "paramName": "单位面积折算单耗", "category": "核心指标", "dataType": "number", "unit": "kWh/m²", "required": True, "source": "总耗电除以服务面积", "rangeOrEnum": "5.0 ~ 120.0", "description": "厂房或办公区域单位面积空调能耗"},
            {"paramCode": "actualSavingsTce", "paramName": "核定节标煤量", "category": "核心指标", "dataType": "number", "unit": "tce", "required": True, "source": "IPMVP 节能量验证", "rangeOrEnum": "0 ~ 5,000", "description": "与基准期相比核定的实际节约标煤量"},
            {"paramCode": "economicBenefitYuan", "paramName": "综合经济效益", "category": "核心指标", "dataType": "number", "unit": "万元", "required": True, "source": "电费节省与绿电收益", "rangeOrEnum": "0 ~ 500", "description": "项目产生的月度实际净财务回报"}
        ],
        "dataSources": [
            {"medium": "冷水机组与循环水泵电量", "sourceType": "空调配电柜智能电表", "protocol": "Modbus-TCP", "device": "空调机房专线电能表 (APM810)", "tagExample": "CHILLER_METER_TOTAL_KWH", "frequency": "15 分钟累积", "securityLevel": "L1 (内部级)"},
            {"medium": "空调冷冻水流量与温差", "sourceType": "超声波冷热量能量计", "protocol": "M-Bus / 4-20mA", "device": "管网超声波冷量表 (带有供回水 PT1000 温度传感器)", "tagExample": "CHILLER_COOLING_GJ", "frequency": "1 分钟采样", "securityLevel": "L2 (工作秘密)"},
            {"medium": "储能充放电计量", "sourceType": "储能系统结算表", "protocol": "Modbus-TCP", "device": "双向电能表", "tagExample": "ESS_DISCHARGE_KWH", "frequency": "日结算", "securityLevel": "L1 (内部级)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "空调/冷水机组综合制冷性能系数 COP 核算",
                "mathExpression": r"COP = \frac{Q_{cooling\_kw}}{P_{input\_kw}} = \frac{L \times \Delta T \times 4.1868}{3600 \times P_{input\_kw}}",
                "variables": [
                    {"name": "L", "desc": "冷冻水循环水流量", "unit": "t/h 或 m³/h"},
                    {"name": r"\Delta T", "desc": "冷冻水供回水温差 (T_{return} - T_{supply})", "unit": "°C"},
                    {"name": "P_{input_kw}", "desc": "冷水机组及辅助泵组输入的实时总电功率", "unit": "kW"}
                ],
                "logicDescription": "依据焓差法与水流量温差法，实时精准测算空调机组能源转换效率。",
                "boundaryRule": r"机组停运或循环泵断电 (\Delta T ≤ 0.2°C) 时，COP 自动置空并标记待机，杜绝虚假极值。"
            },
            {
                "formulaName": "单位面积空调耗电量核算模型",
                "mathExpression": r"e_{area} = \frac{E_{hvac\_power}}{A_{service\_floor}}",
                "variables": [
                    {"name": "E_{hvac_power}", "desc": "统计期内空调制冷采暖消耗的电量", "unit": "kWh"},
                    {"name": "A_{service_floor}", "desc": "该空调系统实际覆盖的洁净厂房或建筑有效服务面积", "unit": "m²"}
                ],
                "logicDescription": "彻底去噪，剔除历史陈旧的'建筑层高'干扰，纯粹以建筑面积作为工业单耗基准标尺。",
                "boundaryRule": "服务面积由建筑平面竣工图锁定为只读参数，严禁前台手工篡改。"
            }
        ],
        "calculationLogic": "1. 评估大 Tab 顺序优化：【储能运行评估】➔【光伏运行评估】➔【热泵运行评估】➔【空调运行评估】；\n2. 热泵与空调运行台账极简纯化：彻底剥离'建筑层高'列，表头'系统 COP'去噪纯化为'COP'；\n3. 热泵台账彻底移除右侧整列操作列，表格舒展自适应。",
        "dtoSchema": """interface ProjectBenefitDTO {
  evalType: 'ESS' | 'PV' | 'HEAT_PUMP' | 'HVAC_CHILLER';
  cycle: string;
  cop: number;
  coolingGj: number;
  powerKwh: number;
  unitAreaKwh: number;
  actualSavingsTce: number;
  netBenefitYuan: number;
  donuts: {
    powerSourceShare: { gridPct: number; greenPct: number; essPct: number };
    avoidPeakShare: { sharpPct: number; peakPct: number; flatPct: number };
  };
}""",
        "frontendSpecs": "- 44px 工业高密表格，热泵台账彻底移除多余操作列；\n- 80x36px 标准白字白图标 `<ExportButton />`；\n- 甜甜圈图采用官方 8 大介质色与 4 段 TOU 分时色标准。",
        "backendSpecs": "- 接口：`GET /api/v1/zero-carbon/project/benefit`\n- 冷量流量计算引入热焓查表算法，消除水温非线性误差。",
        "qaTestSpecs": "- Tab 顺序检查: 验证评估 Tabs 从左到右严格为储能 ➔ 光伏 ➔ 热泵 ➔ 空调；\n- 字段去噪检查: 验证热泵与空调台账中无'建筑层高'列，最右侧无操作按钮列。"
    },

    # 15. 零碳工厂自评估
    {
        "id": "spec-project-self",
        "center": "零碳园区集控中心",
        "navGroup": "零碳项目评估",
        "pageName": "零碳工厂自评估",
        "route": "/zero-carbon/project/self",
        "component": "components/project/self-view.tsx",
        "overview": "国家级零碳工厂标准（GB/T 24067 / T/CECA-G 0171）全维度合规性自测与成熟度评价中枢。涵盖合规前置条件、基础设施、能源管理体系、节能减排技术、可再生能源利用与碳中和路径六大维度，自动核算综合得分、生成成熟度雷达图并导出国家标准申报材料。",
        "subModules": [
            {"name": "六大维度评估矩阵", "desc": "基础设施、能源利用、技术降碳、管理体系、碳抵消与数字化支撑全指标打分。"},
            {"name": "零碳前置一票否决项核验", "desc": "重大安全环保事故、能耗超限额强制核验，不满足直接阻断评级。"},
            {"name": "综合得分雷达图", "desc": "六大维度实测得分与国家五星级零碳工厂标杆值多轴对比雷达图。"},
            {"name": "短板差距与改进建议清单", "desc": "客观列出未拿满分指标项，展示基准差距与对应国家标准条款。"},
            {"name": "自评估标准台账", "desc": "44px 工业高密表格，游标统一为微透科技蓝与微灰，导出标准申报自评报告。"}
        ],
        "parameters": [
            {"paramCode": "factoryId", "paramName": "参评工厂ID", "category": "入参过滤", "dataType": "number", "unit": "-", "required": True, "source": "组织树", "rangeOrEnum": "1 ~ 9999", "description": "被评估的单体工厂"},
            {"paramCode": "evalYear", "paramName": "评价年度", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "年度下拉", "rangeOrEnum": "YYYY", "description": "申报评价的完整自然年度"},
            {"paramCode": "totalScore", "paramName": "自评估综合得分", "category": "核心指标", "dataType": "number", "unit": "分", "required": True, "source": "六维加权核算", "rangeOrEnum": "0.0 ~ 100.0", "description": "零碳工厂综合得分"},
            {"paramCode": "starLevel", "paramName": "评定星级等级", "category": "核心指标", "dataType": "string", "unit": "-", "required": True, "source": "分级判定引擎", "rangeOrEnum": "未达标 | 一星级 | 二星级 | 三星级 | 四星级 | 五星级 (领跑)", "description": "依据总分判定零碳成熟度等级"},
            {"paramCode": "compliancePassed", "paramName": "前置合规是否全数通过", "category": "业务明细", "dataType": "boolean", "unit": "-", "required": True, "source": "一票否决核验", "rangeOrEnum": "true | false", "description": "合规项未全过则不能评星"},
            {"paramCode": "infrastructureScore", "paramName": "基础设施维度得分", "category": "业务明细", "dataType": "number", "unit": "分", "required": True, "source": "指标评分", "rangeOrEnum": "0 ~ 20", "description": "绿色建筑、绿色照明、计量器具配备"},
            {"paramCode": "energyUseScore", "paramName": "能源利用维度得分", "category": "业务明细", "dataType": "number", "unit": "分", "required": True, "source": "指标评分", "rangeOrEnum": "0 ~ 30", "description": "清洁能源占比、工序能耗限额、余热利用"}
        ],
        "dataSources": [
            {"medium": "企业自评估申报答卷", "sourceType": "Web 填报工作台", "protocol": "HTTPS REST API", "device": "自评估核算模型矩阵", "tagExample": "SELF_EVAL_QUESTIONNAIRE", "frequency": "年度填报", "securityLevel": "L2 (工作秘密)"},
            {"medium": "全厂年度能碳核算账本", "sourceType": "集控中心年度核算归档", "protocol": "数据库只读", "device": "`dwd_indicator_yearly`", "tagExample": "YEARLY_TOTAL_INDICATORS", "frequency": "年度结存", "securityLevel": "L2 (工作秘密)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "零碳工厂综合评分加权计算模型",
                "mathExpression": r"\text{Score}_{total} = \sum_{i=1}^{6} (w_i \times \sum_{j=1}^{m_i} s_{ij}) \quad (\text{前提: 全部前置合规项 } C_k = 1)",
                "variables": [
                    {"name": "w_i", "desc": "第 i 维度权重 (如能源利用 30%, 碳抵消 20%)", "unit": "%"},
                    {"name": "s_{ij}", "desc": "第 i 维度第 j 项指标实测得分", "unit": "分"}
                ],
                "logicDescription": "六大维度分值加权汇总；若任意一项前置合规项为 0，总得分强制归零并阻断评级。",
                "boundaryRule": "星级划分门槛：≥90分 五星级，≥80分 四星级，≥70分 三星级，<60分 未达标。"
            }
        ],
        "calculationLogic": "浅色端游标彻底替换纯白为微灰 `rgba(0, 0, 0, 0.04)`，表格数据行严格补齐 `h-[44px]`，客观展示差距差距量。",
        "dtoSchema": """interface ZeroCarbonSelfEvalDTO {
  factoryId: number;
  year: string;
  totalScore: number;
  starLevel: string;
  compliancePassed: boolean;
  dimensionScores: { dimensionName: string; score: number; fullScore: number }[];
  gapList: { itemCode: string; itemName: string; gapDescription: string }[];
}""",
        "frontendSpecs": "- 44px 工业高密表格，11 处 tr 行高强制 h-[44px]；\n- 游标浅色微灰，暗黑微透科技蓝 `rgba(56, 189, 248, 0.08)`；\n- 严格客观中立，严禁出现'落后企业需整改'等说教词汇。",
        "backendSpecs": "- 接口：`POST /api/v1/zero-carbon/project/self/evaluate`\n- 自评估打分记录持久化至数据库并生成版本审签历史。",
        "qaTestSpecs": "- 一票否决测试: 模拟设置安全合规项为未通过，验证系统是否强行阻断评级；\n- 满分边界测试: 验证所有项打满分时，系统评级正确输出为五星级。"
    },

    # 16. 用能报表
    {
        "id": "spec-reports-usage",
        "center": "零碳园区集控中心",
        "navGroup": "统计报表",
        "pageName": "用能报表",
        "route": "/zero-carbon/reports/usage",
        "component": "components/reports/usage-report-view.tsx",
        "overview": "全系统能源消费多维明细报表中心。支持按日、按月、按年生成 8 大能源介质（电、水、气、汽、油、氮等）的高密统计账单，支持按车间与用能单元下钻，配备 80x36px 标准导出按键，满足企业能耗审计、能源管理月报与节能主管部门法定申报需求。",
        "subModules": [
            {"name": "报表统计维度选择器", "desc": "支持日结报表、月度报表与年度综合报表一键无缝切换。"},
            {"name": "组织架构级联过滤", "desc": "集团 ➔ 经营单位 ➔ 单体工厂 ➔ 生产车间四级逐级过滤汇总。"},
            {"name": "8大能源介质全景大宽表", "desc": "44px 工业高密表格，横向平铺展示各类介质实物量、折标系数及折标煤当量。"},
            {"name": "合计与小计行自动结存", "desc": "表格底部自动结存全厂总计、各类介质小计，支持点击车间行内联展开测点。"},
            {"name": "标准格式数据导出", "desc": "80x36px 标准科技蓝导出按键，一键导出格式化带样式的 Excel (.xlsx) / CSV 文件。"}
        ],
        "parameters": [
            {"paramCode": "reportDimension", "paramName": "统计周期维度", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "单选切换", "rangeOrEnum": "DAY | MONTH | YEAR", "description": "报表时间粒度"},
            {"paramCode": "startDate", "paramName": "报表起始日期", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "日期选择器", "rangeOrEnum": "YYYY-MM-DD 或 YYYY-MM", "description": "统计时间窗开始时间"},
            {"paramCode": "endDate", "paramName": "报表结束日期", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "日期选择器", "rangeOrEnum": "YYYY-MM-DD 或 YYYY-MM", "description": "统计时间窗截止时间"},
            {"paramCode": "orgUnitId", "paramName": "统计组织节点", "category": "入参过滤", "dataType": "number", "unit": "-", "required": True, "source": "组织级联框", "rangeOrEnum": "1 ~ 9999", "description": "汇总数据的根组织单元"},
            {"paramCode": "totalTceSum", "paramName": "报表期综合能耗合计", "category": "核心指标", "dataType": "number", "unit": "tce", "required": True, "source": "报表行汇总累加", "rangeOrEnum": "0 ~ 1,000,000", "description": "全部参与统计单元的折标煤总和"},
            {"paramCode": "totalPowerSumKwh", "paramName": "总用电量合计", "category": "核心指标", "dataType": "number", "unit": "kWh", "required": True, "source": "电量列汇总", "rangeOrEnum": "0 ~ 100,000,000", "description": "总耗电量求和"}
        ],
        "dataSources": [
            {"medium": "全厂分项计量时序数据库", "sourceType": "TDengine / IoTDB 每日汇总表", "protocol": "SQL 聚合查询", "device": "数仓事实表 `dwd_meter_daily_energy`", "tagExample": "METER_ENERGY_DAY_ACC", "frequency": "每日 00:00 自动结存", "securityLevel": "L1 (内部级)"},
            {"medium": "车间部门归属关系", "sourceType": "企业组织主数据", "protocol": "系统字典", "device": "`dim_org_structure`", "tagExample": "DEPT_HIERARCHY_TREE", "frequency": "静态配置", "securityLevel": "L1 (内部级)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "报表明细多层级聚合求和模型",
                "mathExpression": r"E_{dept\_total} = \sum_{j \in Dept} E_j, \quad E_{grand\_total} = \sum_{k=1}^{n} E_{dept\_k}",
                "variables": [
                    {"name": "E_j", "desc": "部门内单个测点表计当期累计能量", "unit": "各物理实物单位或 tce"},
                    {"name": "E_{dept}", "desc": "部门/车间级小计", "unit": "实物单位或 tce"},
                    {"name": "E_{grand_total}", "desc": "全厂总计汇总值", "unit": "tce"}
                ],
                "logicDescription": "自底向上逐级求和，杜绝由于表计分级导致的重复统计（仅汇总叶子节点表计）。",
                "boundaryRule": "若某表计当期处于停运维护，差值补齐为 0 并标注备注，禁止产生空指针异常。"
            }
        ],
        "calculationLogic": "报表行高全系统强制为 44px，单元格内容垂直居中，数字统一采用 Mono 等宽字体对齐。",
        "dtoSchema": """interface UsageReportDTO {
  dimension: 'DAY' | 'MONTH' | 'YEAR';
  periodLabel: string;
  rows: {
    unitName: string;
    powerKwh: number;
    waterTons: number;
    gasM3: number;
    steamTons: number;
    oilKg: number;
    totalTce: number;
  }[];
  summary: { totalTce: number; totalPower: number };
}""",
        "frontendSpecs": "- 44px 工业高密表格，严格锁定 h-[44px]；\n- 标准 `<ExportButton />` 组件，尺寸 80px × 36px，圆角 8px，背景色 #2C7CFF；\n- 密集数字采用 Mono 等宽字体右对齐展示。",
        "backendSpecs": "- 接口：`POST /api/v1/zero-carbon/reports/usage/export`\n- Excel 导出使用流式写入 (ExcelJS/EasyExcel)，支持 10 万行大数据量瞬间导出且无内存溢出。",
        "qaTestSpecs": "- 小计与总计校验: 验证各行数据累加和与底部总计行严格相等；\n- 导出测试: 点击导出按钮，验证文件名与下载文件字段完整性。"
    },

    # 17. 成本报表
    {
        "id": "spec-reports-cost",
        "center": "零碳园区集控中心",
        "navGroup": "统计报表",
        "pageName": "成本报表",
        "route": "/zero-carbon/reports/cost",
        "component": "components/reports/cost-report-view.tsx",
        "overview": "企业能源采购与消费综合财务核算报表。按账单月份生成各经营单位与车间的电费、气费、汽费、水费支出报表，详列尖峰平谷各时段费用分解与万元产值能耗成本，为财务内部结算与生产成本分摊提供权威凭证。",
        "subModules": [
            {"name": "财务账期与结算月度筛选", "desc": "按财务月度账期（如 2026年08月）筛选全量报表数据。"},
            {"name": "费用类型多栏分项汇总", "desc": "电度电费、容量需量基本电费、力调电费奖惩、天然气费、外购蒸汽费独立成列。"},
            {"name": "分时电费结构详单", "desc": "详列尖峰、高峰、平段、低谷各时段电量与对应电费金额。"},
            {"name": "车间成本分摊明细表", "desc": "44px 工业高密表格，按车间展示分摊比例、费用总额与同期对比。"},
            {"name": "财务格式报表导出", "desc": "标准 80x36px 导出按钮，一键导出含财务凭证科目的标准化对账表格。"}
        ],
        "parameters": [
            {"paramCode": "billingMonth", "paramName": "财务账期月份", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "月份选择框", "rangeOrEnum": "YYYY-MM", "description": "核算账期"},
            {"paramCode": "orgUnitId", "paramName": "核算组织节点", "category": "入参过滤", "dataType": "number", "unit": "-", "required": True, "source": "组织选择框", "rangeOrEnum": "1 ~ 9999", "description": "核算单位"},
            {"paramCode": "totalAmountYuan", "paramName": "能源支出总金额", "category": "核心指标", "dataType": "number", "unit": "万元", "required": True, "source": "各类介质费用求和", "rangeOrEnum": "0 ~ 10,000", "description": "全厂当月能源采购总支出"},
            {"paramCode": "electricityTotalYuan", "paramName": "总电费金额", "category": "核心指标", "dataType": "number", "unit": "万元", "required": True, "source": "电费账单", "rangeOrEnum": "0 ~ 8,000", "description": "电网购电费用"},
            {"paramCode": "steamTotalYuan", "paramName": "外购蒸汽费用", "category": "业务明细", "dataType": "number", "unit": "万元", "required": True, "source": "供热对账单", "rangeOrEnum": "0 ~ 1,500", "description": "工业用蒸汽采购支出"},
            {"paramCode": "gasTotalYuan", "paramName": "天然气总费用", "category": "业务明细", "dataType": "number", "unit": "万元", "required": True, "source": "燃气账单", "rangeOrEnum": "0 ~ 500", "description": "燃气费用支出"}
        ],
        "dataSources": [
            {"medium": "供电局正式电费账单", "sourceType": "财务发票与结算清单", "protocol": "财务中间表接口", "device": "SAP FI 财务核算模块", "tagExample": "SAP_FI_POWER_INVOICE", "frequency": "月度", "securityLevel": "L3 (核心商密)"},
            {"medium": "分时电价与气价参数表", "sourceType": "系统价格模型库", "protocol": "MySQL 字典", "device": "`t_energy_tariff`", "tagExample": "PRICE_CONFIG_PEAK_VALLEY", "frequency": "月度", "securityLevel": "L1 (内部级)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "车间能源成本分摊计算模型",
                "mathExpression": r"C_{workshop\_i} = \sum_{m} (Q_{i,m} \times P_m) + C_{public} \times \frac{Output_i}{\sum Output_k}",
                "variables": [
                    {"name": "Q_{i,m}", "desc": "第 i 车间消耗第 m 种介质实物量", "unit": "实物单位"},
                    {"name": "P_m", "desc": "第 m 种能源的当期加权平均单价", "unit": "元/单位"},
                    {"name": "C_{public}", "desc": "全厂公共变电与动力管网基本电费及公摊", "unit": "元"},
                    {"name": "Output_i", "desc": "第 i 车间完成的生产产值", "unit": "万元"}
                ],
                "logicDescription": "直接能耗由分表按分时单价直计，公摊电费按产值比例分摊至各车间成本中心。",
                "boundaryRule": "所有车间分摊之和严格等于财务月度采购发票总额，差额做平至分摊尾差。"
            }
        ],
        "calculationLogic": "全部导出按钮强制规范为 80px × 36px，圆角 8px，背景色 #2C7CFF。",
        "dtoSchema": """interface CostReportDTO {
  billingMonth: string;
  totalCostYuan: number;
  rows: {
    deptName: string;
    powerCost: number;
    steamCost: number;
    gasCost: number;
    waterCost: number;
    totalCost: number;
    yoyDeltaPct: number;
  }[];
}""",
        "frontendSpecs": "- 44px 工业高密表格，行高严格锁定；\n- 80x36px 标准 `<ExportButton />`；\n- 涉密财务数据行级权限脱敏控制。",
        "backendSpecs": "- 接口：`POST /api/v1/zero-carbon/reports/cost/export`\n- 权限拦截校验 `FINANCE_REPORT_EXPORT` 许可。",
        "qaTestSpecs": "- 导出校验: 验证无导出权限账号导出按钮置灰禁用；\n- 分摊平衡: 验证所有分厂分摊费用之和等于总额。"
    },

    # 18. 单耗报表
    {
        "id": "spec-reports-unit",
        "center": "零碳园区集控中心",
        "navGroup": "统计报表",
        "pageName": "单耗报表",
        "route": "/zero-carbon/reports/unit",
        "component": "components/reports/unit-report-view.tsx",
        "overview": "全产品品类与制造工序单耗明细报表中心。集中列支变压器、电缆、开关柜等产品型号单耗与 47 项关键工序单耗的历史演变，支持超标告警单耗行高亮标注与一键导出，服务于工艺改进与产品碳足迹底层定额测算。",
        "subModules": [
            {"name": "产品大类与工序分类筛选", "desc": "支持按主变压器、特种电缆、关键工序灵活筛选。"},
            {"name": "型号级单耗明细报表", "desc": "44px 工业高密表格，展示产量、电耗、汽耗、折标单耗与国标限额。"},
            {"name": "工序级单耗明细报表", "desc": "详列绕线、铁芯叠装、真空干燥、拉丝、交联挤出各工序单位产出能耗。"},
            {"name": "单耗越限基准红黄标识", "desc": "超出集团基准 10% 的单耗数据行客观标注，便于工艺专家快速定位。"},
            {"name": "单耗数据报表导出", "desc": "80x36px 标准导出按钮，导出工艺单耗台账供技术中心归档。"}
        ],
        "parameters": [
            {"paramCode": "categoryType", "paramName": "单耗报表类型", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "单选切换", "rangeOrEnum": "PRODUCT_UNIT | PROCESS_UNIT", "description": "查看产品单耗还是工序单耗"},
            {"paramCode": "timeCycle", "paramName": "统计周期", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "周期选择", "rangeOrEnum": "MONTH | QUARTER | YEAR", "description": "报表汇总跨度"},
            {"paramCode": "modelOrProcessName", "paramName": "型号/工序名称", "category": "业务明细", "dataType": "string", "unit": "-", "required": True, "source": "字典映射", "rangeOrEnum": "字符串", "description": "产品具体型号或工序编码"},
            {"paramCode": "outputQuantity", "paramName": "完工合格数量", "category": "核心指标", "dataType": "number", "unit": "台套 或 km", "required": True, "source": "MES 完工产量", "rangeOrEnum": "0 ~ 10,000", "description": "统计期内合格完工总产量"},
            {"paramCode": "actualUnitTce", "paramName": "实际折标单耗", "category": "核心指标", "dataType": "number", "unit": "tce/单位", "required": True, "source": "能耗除以产量", "rangeOrEnum": "0.01 ~ 50.00", "description": "实际核算得到的单耗"},
            {"paramCode": "benchmarkTce", "paramName": "考核基准单耗", "category": "业务明细", "dataType": "number", "unit": "tce/单位", "required": True, "source": "定额标准", "rangeOrEnum": "0.01 ~ 40.00", "description": "集团下达的工艺单耗考核目标"},
            {"paramCode": "variancePct", "paramName": "偏差百分比", "category": "衍生计算", "dataType": "number", "unit": "%", "required": True, "source": "偏离度模型", "rangeOrEnum": "-50.0% ~ +100.0%", "description": "超标或节约比例"}
        ],
        "dataSources": [
            {"medium": "MES 生产批次完工报工表", "sourceType": "MES 数据库中间表", "protocol": "REST API", "device": "MES 生产报工终端", "tagExample": "MES_WORK_ORDER_COMPLETED", "frequency": "工单入库即时", "securityLevel": "L2 (工作秘密)"},
            {"medium": "车间工序专用表计计量", "sourceType": "SCADA 数据库", "protocol": "Modbus-TCP", "device": "车间专线分项电表", "tagExample": "MTR_PROCESS_USAGE_SUM", "frequency": "班次结算", "securityLevel": "L1 (内部级)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "工序单位合格产量能耗核算模型",
                "mathExpression": r"e_{proc} = \frac{\sum E_{process\_energy}}{Q_{qualified\_lot}} \quad (Q_{qualified\_lot} > 0)",
                "variables": [
                    {"name": "E_{process_energy}", "desc": "工序专用设备电量与蒸汽折标总量", "unit": "tce"},
                    {"name": "Q_{qualified_lot}", "desc": "该工序质检通过合格转序的物料数量", "unit": "台套 或 km"}
                ],
                "logicDescription": "单道制造工序专机能耗直采加总，除以合格产量；废品不计入合格分母。",
                "boundaryRule": "若当期没有该型号产品完工 (Q_qualified_lot = 0)，单耗表格行安全显示为 `-`，杜绝抛出 NaN 异常。"
            }
        ],
        "calculationLogic": "严格遵循权威工序白名单，10 家无工序单位精准整行输出单行文本：`暂无相关工序！`。",
        "dtoSchema": """interface UnitReportDTO {
  category: string;
  cycle: string;
  rows: {
    itemCode: string;
    itemName: string;
    outputQty: number;
    energyTotalTce: number;
    unitConsumptionTce: number;
    benchmarkTce: number;
    variancePct: number;
  }[];
}""",
        "frontendSpecs": "- 44px 工业高密表格，行高统一锁定；\n- 80x36px 标准 `<ExportButton />`；\n- 10 家无工序单位单行输出 `暂无相关工序！`。",
        "backendSpecs": "- 接口：`POST /api/v1/zero-carbon/reports/unit/export`\n- 支持多表头层级复杂 Excel 模板导出。",
        "qaTestSpecs": "- 白名单排查: 验证无工序单位报表仅展示单行'暂无相关工序！'；\n- 零产量测试: 验证当产量为 0 时，单耗列正常展示 '-'。"
    },

    # 19. 数据录入 (人工填报)
    {
        "id": "spec-config-entry",
        "center": "零碳园区集控中心",
        "navGroup": "基础管理",
        "pageName": "数据录入",
        "route": "/zero-carbon/config/entry",
        "component": "components/config/entry-view.tsx",
        "overview": "全厂无自动化远传表计能源数据、财务产值及物料发票的标准化人工填报工作台。支持化石燃料采购（柴油/外购燃气/原煤）、工业总产值、工业增加值及外部发票附件上传，内置 3 倍标准差防输错校验与多级审核闭环流转。",
        "subModules": [
            {"name": "人工填报向导式表单", "desc": "按填报周期（月度/年度）与数据项分类（能源消耗/财务产值/物料发票）逐步录入。"},
            {"name": "发票与过磅凭证上传", "desc": "支持发票扫描件、地磅单、出入库单据 PDF/图片上传存证与在线查验。"},
            {"name": "防输错边界规则拦截引擎", "desc": "基于该工厂历史同类数据 3 倍标准差 (±3σ) 动态设置浮动阈值，防止输错数量级。"},
            {"name": "填报审批流与留痕追溯", "desc": "工厂工程师提交 ➔ 分厂厂长复核 ➔ 集团管理员终审三级审批，带不可篡改审计流。"},
            {"name": "历史填报台账明细表", "desc": "44px 工业高密表格，展示历史填报批次、填报人、审核状态与原始附件。"}
        ],
        "parameters": [
            {"paramCode": "batchId", "paramName": "填报批次号", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "系统自动生成", "rangeOrEnum": "BATCH-YYYYMM-XXXX", "description": "填报批次唯一追溯编号"},
            {"paramCode": "entryCategory", "paramName": "填报数据类别", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "表单分类选择", "rangeOrEnum": "FUEL_ENERGY | FINANCIAL_OUTPUT | RAW_MATERIAL | EMISSION_FACTOR", "description": "录入数据的业务类别"},
            {"paramCode": "periodMonth", "paramName": "所属统计月份", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "月份选择框", "rangeOrEnum": "YYYY-MM", "description": "数据对应的结算月份"},
            {"paramCode": "numericValue", "paramName": "录入数值", "category": "核心指标", "dataType": "number", "unit": "依据数据项", "required": True, "source": "用户输入", "rangeOrEnum": "0.001 ~ 10,000,000", "description": "实际填报的物理量或金额"},
            {"paramCode": "invoiceFileUrl", "paramName": "佐证发票附件URL", "category": "业务明细", "dataType": "string", "unit": "-", "required": True, "source": "文件上传组件", "rangeOrEnum": "URL 路径", "description": "发票凭证文件在 MinIO 上的存储地址"},
            {"paramCode": "approvalStatus", "paramName": "审批流转状态", "category": "业务明细", "dataType": "string", "unit": "-", "required": True, "source": "审批工作流", "rangeOrEnum": "SUBMITTED | APPROVED | REJECTED", "description": "待审核、审核通过、打回修改"}
        ],
        "dataSources": [
            {"medium": "手工采购发票与过磅单", "sourceType": "线下实物单据扫描", "protocol": "HTTPS 文件上传", "device": "企业扫描仪 / 手机拍照上传", "tagExample": "INVOICE_IMAGE_PDF", "frequency": "月度填报", "securityLevel": "L3 (核心商密)"},
            {"medium": "财务月结产值确认单", "sourceType": "财务部门用印盖章报表", "protocol": "PDF 上传", "device": "财务月报核对凭证", "tagExample": "FINANCE_SEALED_REPORT", "frequency": "月度填报", "securityLevel": "L3 (核心商密)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "输入数值合理性动态阈值拦截模型",
                "mathExpression": r"V_{min} = \max(0, \mu_{hist} - 3\sigma_{hist}), \quad V_{max} = \mu_{hist} + 3\sigma_{hist}",
                "variables": [
                    {"name": r"\mu_{hist}", "desc": "该工厂该指标过去 12 个月的历史均值", "unit": "指标物理单位"},
                    {"name": r"\sigma_{hist}", "desc": "该工厂该指标过去 12 个月的标准差", "unit": "指标物理单位"}
                ],
                "logicDescription": "防止用户因单位混淆（如吨与千克、万度与度）输错数量级，超出范围时强弹窗二次确认。",
                "boundaryRule": "负数绝对拦截阻断提交；偏离均值超过 200% 时必须填写偏差说明才允许提交审核。"
            }
        ],
        "calculationLogic": "表单输入框宽度统一为 200px × 36px，圆角 8px；表格行高统一固定 44px。",
        "dtoSchema": """interface ManualEntrySubmitReq {
  factoryId: number;
  period: string;
  category: string;
  itemCode: string;
  value: number;
  invoiceUrl: string;
  remark?: string;
}

interface ManualEntryHistoryDTO {
  batchId: string;
  submitTime: string;
  submitter: string;
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  items: { code: string; name: string; value: number; unit: string }[];
}""",
        "frontendSpecs": "- 输入框与下拉框严格锁定 200px × 36px，描边 #E2E8F0，圆角 8px；\n- 44px 工业高密表格，空状态行固定 44px；\n- 提交与导出按钮统一使用规范配色。",
        "backendSpecs": "- 接口：`POST /api/v1/zero-carbon/config/entry/submit`\n- 后端使用 JSR-303 / Zod 二次校验，防止绕过前端拦截越权写入非法负数。",
        "qaTestSpecs": "- 防输错测试: 模拟输入负数或偏离均值 10 倍数值，验证系统弹出阻断拦截；\n- 审批流测试: 验证打回修改后状态正确流转，且历史版本不可篡改。"
    },

    # 20. 组件规范库
    {
        "id": "spec-design-system",
        "center": "零碳园区集控中心",
        "navGroup": "基础管理",
        "pageName": "组件规范库",
        "route": "/design-system",
        "component": "components/design-system/showcase-view.tsx",
        "overview": "特变电工“双中心”专属工业设计规范交互画廊与调用中枢。全量呈现 Design Tokens 调色盘（8大能源介质标准色、4段TOU分时色彩）、44px 工业高密数据表格规范、260px 侧边栏与 30px 拓扑树人机工程、80x36px 导出按钮与表单控件库，提供可一键复制的组件调用代码与色彩字典。",
        "subModules": [
            {"name": "Design Tokens 官方调色盘", "desc": "主题科技蓝 #2C7CFF、8 大能源介质色、4 段 TOU 分时色，支持 Hex 一键复制。"},
            {"name": "44px 工业高密表格实操画廊", "desc": "全站数据表格行高统一固定 44px (h-[44px]) 演示，数字 Mono 等宽排版。"},
            {"name": "标准导出按钮与交互控件", "desc": "固定 80px × 36px、圆角 8px、背景 #2C7CFF 标准 ExportButton 及 SearchInput、StandardSelect。"},
            {"name": "组织拓扑树与品牌人机规范", "desc": "260px 导航栏、30px 树行高、Logo 与双中心切换胶囊规范演示。"},
            {"name": "极简克制与客观中立准则", "desc": "状态边框自解释演示，空状态单行结论规范，杜绝定性评价词句。"}
        ],
        "parameters": [
            {"paramCode": "tokenCategory", "paramName": "规范类别", "category": "入参过滤", "dataType": "string", "unit": "-", "required": False, "source": "画廊 Tab 切换", "rangeOrEnum": "COLOR | TABLE | BUTTON | INPUT | TREE", "description": "查看的组件设计规范分类"},
            {"paramCode": "hexCode", "paramName": "标准色值 Hex", "category": "业务明细", "dataType": "string", "unit": "-", "required": True, "source": "Tokens 常量库", "rangeOrEnum": "#2C7CFF | #41C0FF 等", "description": "特变电工官方权威色值"},
            {"paramCode": "tableRowHeightPx", "paramName": "表格标准行高", "category": "业务明细", "dataType": "number", "unit": "px", "required": True, "source": "工业设计规范", "rangeOrEnum": "44", "description": "全系统数据表格强制 44px 行高"},
            {"paramCode": "buttonWidthPx", "paramName": "导出按钮宽度", "category": "业务明细", "dataType": "number", "unit": "px", "required": True, "source": "工业设计规范", "rangeOrEnum": "80", "description": "全系统导出按键统一固定宽度 80px"},
            {"paramCode": "buttonHeightPx", "paramName": "导出按钮高度", "category": "业务明细", "dataType": "number", "unit": "px", "required": True, "source": "工业设计规范", "rangeOrEnum": "36", "description": "全系统导出按键统一固定高度 36px"}
        ],
        "dataSources": [
            {"medium": "官方权威工业设计规范", "sourceType": "《UI页面修改 (2).pdf》基准", "protocol": "代码常量文件 `tokens.ts`", "device": "组件库源码 `components/design-system/`", "tagExample": "ENERGY_MEDIA_TOKENS", "frequency": "构建期固化", "securityLevel": "L0 (公开级)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "工业级无障碍对比度校验算法 (WCAG 2.1 AA)",
                "mathExpression": r"Ratio = \frac{L_1 + 0.05}{L_2 + 0.05} \ge 4.5:1 \quad (\text{正文字号 } 14px)",
                "variables": [
                    {"name": "L_1, L_2", "desc": "前景色与背景色相对亮度 (Relative Luminance)", "unit": "-"}
                ],
                "logicDescription": "保证全站浅色底色 #F3F7FB 与深色底色下所有文本与图表均具备清晰辨识度。",
                "boundaryRule": "所有组件色彩必须通过 WCAG 2.1 AA 级对比度自动化校验。"
            }
        ],
        "calculationLogic": "组件库在 `components/design-system/index.ts` 集中解构导出，全站业务页面直接引用，严禁散落手写样式。",
        "dtoSchema": """interface DesignSystemGalleryDTO {
  tokens: {
    themePrimary: string;
    energyTokens: Record<string, string>;
    touTokens: Record<string, string>;
    dimensions: { tableRowH: number; exportBtnW: number; exportBtnH: number };
  };
}""",
        "frontendSpecs": "- 双端 100% 同构更新；\n- 点击色块自动复制 Hex 色值至剪贴板；\n- 页面自适应全宽展示。",
        "backendSpecs": "- 纯静态前端展示页面，0 数据库读写开销。",
        "qaTestSpecs": "- 尺寸检查: 验证导出按钮准确渲染为 80x36px，表格行高严格为 44px；\n- 色彩检查: 验证无遗留 Ant Design #1677ff 蓝。"
    }
]

print(f"Loaded {len(ZERO_CARBON_SPECS_PART2)} specs in part 2.")

