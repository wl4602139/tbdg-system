# -*- coding: utf-8 -*-
"""
特变电工能碳数字化双中心 · 零碳园区集控中心全量 21 页面规格字典 (specs_zero_carbon.py)
涵盖：大屏 (2)、集中监管 (4)、能效分析 (5)、零碳项目 (4)、统计报表 (3)、基础管理 (3)
包含：模块职责、参数规格字典、底层数据源血缘、核心计算方式与数学公式
"""

ZERO_CARBON_SPECS = [
    # 1. 全景环幕大屏
    {
        "id": "spec-screen-panoramic",
        "center": "零碳园区集控中心",
        "navGroup": "集控中心大屏",
        "pageName": "全景环幕大屏",
        "route": "/zero-carbon/screen",
        "component": "components/screen/panoramic-screen-view.tsx",
        "overview": "集团级高保真环幕全景监控大屏。面向集团决策层与企业来访展示，融合全国 6 大产业园区 3D 浮雕地图定位、全集团新能源出力、储能充放功率、直供绿电消纳比、累计减排量与能碳态势雷达。",
        "subModules": [
            {"name": "3D 立体中国浮雕地图", "desc": "基于 D3-Geo 经纬度投影与 CSS perspective 1200px 倾角变换，园区焦点呼吸脉冲光圈与动态交互引线。"},
            {"name": "集团级能碳核心 KPI", "desc": "总用电负荷 (kW)、自发自用绿电消纳量 (kWh)、折标综合能耗 (tce)、实时碳排放强度 (tCO2e)。"},
            {"name": "源网荷储平衡环形玫瑰图", "desc": "市电受电、分布式光伏、储能充放、工业负荷四端动态流向图与实时自平衡率。"},
            {"name": "园区能效对标红黑榜", "desc": "各园区零碳综合评分、万元产值能耗对标与领跑标杆排名动态轮播。"},
            {"name": "实时告警跑马灯", "desc": "厂区越限用电、表计离线与防逆流突发事件实时滚动播报与等级徽章。"},
            {"name": "双碳目标演进里程碑", "desc": "2026~2030 碳达峰与零碳园区建设时间轴与减碳达成率。"}
        ],
        "parameters": [
            {"paramCode": "parkId", "paramName": "园区标识", "category": "入参过滤", "dataType": "string", "unit": "-", "required": False, "source": "地图节点点击联动", "rangeOrEnum": "all | PARK_XJ | PARK_HB | PARK_SB | PARK_SD", "description": "选定的产业园区，不传则默认展示全集团汇总数据"},
            {"paramCode": "refreshRate", "paramName": "数据刷新周期", "category": "入参过滤", "dataType": "number", "unit": "秒", "required": False, "source": "前端定时轮询配置", "rangeOrEnum": "5 | 15 | 30", "description": "大屏前端向网关拉取聚合快照的轮询间隔"},
            {"paramCode": "totalPowerLoadKw", "paramName": "全集团瞬时总负荷", "category": "核心指标", "dataType": "number", "unit": "kW", "required": True, "source": "IoT SCADA 遥测汇聚", "rangeOrEnum": "0 ~ 500,000", "description": "全集团当前正在运行的有功用电负荷总和"},
            {"paramCode": "todayGenKwh", "paramName": "当日新能源发电量", "category": "核心指标", "dataType": "number", "unit": "kWh", "required": True, "source": "光伏逆变器日累计", "rangeOrEnum": "0 ~ 1,000,000", "description": "全集团各园区屋顶分布式光伏与风电当日累计发电量"},
            {"paramCode": "todayGreenOffsetT", "paramName": "当日二氧化碳减排量", "category": "核心指标", "dataType": "number", "unit": "tCO2e", "required": True, "source": "绿电核算引擎衍生", "rangeOrEnum": "0 ~ 1,000", "description": "基于当日自发自用绿电量乘以电网排放因子核算的减排量"},
            {"paramCode": "greenPowerRatioPct", "paramName": "全域绿电消纳占比", "category": "核心指标", "dataType": "number", "unit": "%", "required": True, "source": "源网荷储平衡计算", "rangeOrEnum": "0.0 ~ 100.0%", "description": "自发绿电与直供专线绿电在总用电负荷中的物理占比"},
            {"paramCode": "annualTargetProgressPct", "paramName": "年度双碳目标完成度", "category": "核心指标", "dataType": "number", "unit": "%", "required": True, "source": "年度计划台账对比", "rangeOrEnum": "0.0 ~ 150.0%", "description": "当年累计减碳量占集团年度双碳下达考核任务的比例"},
            {"paramCode": "gridLoadKw", "paramName": "大电网受电功率", "category": "业务明细", "dataType": "number", "unit": "kW", "required": True, "source": "总降变主变有功功率", "rangeOrEnum": "0 ~ 400,000", "description": "从国家电网 110kV/35kV 变电站受入的市电瞬时功率"},
            {"paramCode": "essPowerKw", "paramName": "储能电站瞬时功率", "category": "业务明细", "dataType": "number", "unit": "kW", "required": True, "source": "储能 PCS 变流器", "rangeOrEnum": "-50,000 ~ +50,000", "description": "正值代表放电供给工厂负荷，负值代表充电吸收光伏余电"},
            {"paramCode": "carbonIntensityRealtime", "paramName": "实时碳排放强度", "category": "衍生计算", "dataType": "number", "unit": "kgCO2/kWh", "required": True, "source": "电网因子加权核算", "rangeOrEnum": "0.000 ~ 1.000", "description": "当前每度工业用电对应的平均碳足迹排放强度"}
        ],
        "dataSources": [
            {"medium": "全集团总用电负荷", "sourceType": "各大园区 SCADA 调度总线汇聚", "protocol": "MQTT 5.0 / Kafka 分布式流处理", "device": "集团级能源调度网关集群", "tagExample": "GROUP_TOTAL_ACTIVE_POWER_KW", "frequency": "5 秒推送一次", "securityLevel": "L1 (内部级)"},
            {"medium": "园区分布式光伏出力", "sourceType": "华为 / 阳光电源光伏数采逆变器", "protocol": "Modbus-TCP / 104 远动规约", "device": "各园区屋顶光伏箱变测控一体装置", "tagExample": "PARK_XJ_PV_ACTIVE_POWER_KW", "frequency": "10 秒采集一次", "securityLevel": "L1 (内部级)"},
            {"medium": "电化学储能充放工况", "sourceType": "储能电站 EMS 能量管理系统", "protocol": "IEC 61850 / Modbus-TCP", "device": "储能双向变流器 PCS & BMS 电池管理", "tagExample": "PARK_HB_ESS_DISCHARGE_KW", "frequency": "5 秒采集一次", "securityLevel": "L1 (内部级)"},
            {"medium": "地理信息与园区元数据", "sourceType": "系统静态配置数据库", "protocol": "MySQL 直连加载", "device": "系统元数据库 `dim_park_topology`", "tagExample": "PARK_GIS_GEOJSON_COORDS", "frequency": "系统启动时载入", "securityLevel": "L0 (公开级)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "全集团实时绿电消纳占比",
                "mathExpression": r"R_{green} = \frac{\sum_{i=1}^{m} P_{pv\_self,i} + \sum_{i=1}^{m} P_{ess\_dis,i} + P_{direct\_green}}{\sum_{i=1}^{m} P_{load,i}} \times 100\%",
                "variables": [
                    {"name": "P_{pv_self,i}", "desc": "第 i 个园区光伏自发自用瞬时功率", "unit": "kW"},
                    {"name": "P_{ess_dis,i}", "desc": "第 i 个园区储能放电有功功率", "unit": "kW"},
                    {"name": "P_{direct_green}", "desc": "区域专线直供绿电受电功率", "unit": "kW"},
                    {"name": "P_{load,i}", "desc": "第 i 个园区全部工业用电有功负荷", "unit": "kW"}
                ],
                "logicDescription": "分子归集自用光伏、储能绿电与专线绿电，分母为全集团总负荷，反映物理级新能源消纳水平。",
                "boundaryRule": "当工厂全厂停工检修且总负荷 P_load = 0 时，消纳比强制封顶判定为 100%，防止除零崩溃。"
            },
            {
                "formulaName": "当日新能源自发绿电减碳量",
                "mathExpression": r"C_{offset} = \frac{E_{pv\_self} \times EF_{grid}}{1000}",
                "variables": [
                    {"name": "E_{pv_self}", "desc": "当日光伏累计自发自用电量", "unit": "kWh"},
                    {"name": "EF_{grid}", "desc": "所在区域电网平均供电碳排放因子", "unit": "kgCO2/kWh"}
                ],
                "logicDescription": "每消纳一度自发绿电，按等量替代区域电网火电测算减排二氧化碳当量。",
                "boundaryRule": "EF_grid 依据生态环境部最新公告因子基准动态绑定，杜绝写死历史脏数据。"
            }
        ],
        "calculationLogic": "1. 集团全域绿电占比计算:\n   Green_Ratio_Group = (∑ Q_green_park_i / ∑ Q_total_power_park_i) × 100%\n2. 3D 地图透视投影矩阵变换:\n   CSS transform: perspective(1200px) rotateX(25deg) rotateZ(-3deg)\n   动态引线连接算法: 依据园区 SVG 节点中心相对坐标与外部 HUD 卡片锚点绘制贝塞尔曲线。",
        "dtoSchema": """interface ScreenOverviewDTO {
  timestamp: string;
  groupMetrics: {
    totalPowerLoadKw: number;
    todayGenKwh: number;
    todayGreenOffsetT: number;
    greenPowerRatioPct: number;
    annualTargetProgressPct: number;
  };
  parkPoints: {
    parkId: string;
    name: string;
    coords: [number, number];
    status: 'online' | 'warning';
    powerKw: number;
    greenRatioPct: number;
  }[];
}""",
        "frontendSpecs": "- 采用航天级 HUD 金属切角 (clip-path: polygon) 与微发光背板，杜绝切片图片锯齿；\n- 原生弹性适配 1080P、2K 及 48:9 / 32:9 超宽环幕大屏；\n- 图表采用微透防眩科技蓝 `rgba(56, 189, 248, 0.08)`。",
        "backendSpecs": "- 接口：`GET /api/v1/screen/overview`\n- 高并发吞吐保护：单机 10,000 QPS 承载，启用 Redis 内存快照，TTL = 5s。",
        "qaTestSpecs": "- 分辨率适配测试: 验证 1920x1080, 2560x1440 与 5760x1080 下文字与图表无重叠遮挡。\n- 网络重连测试: 模拟断网 30s 恢复后，WebSocket/轮询机制能自动恢复数据刷新。"
    },

    # 2. 综合集控大屏 (16:9)
    {
        "id": "spec-screen-control-center",
        "center": "零碳园区集控中心",
        "navGroup": "集控中心大屏",
        "pageName": "综合集控大屏 (16:9)",
        "route": "/screen/control-center",
        "component": "components/screen/control-center-view.tsx",
        "overview": "符合标准 16:9 工控显示器及指挥调度室中屏的高保真集控大屏。聚焦 6 大直属经营单位（沈变、衡变、新变、鲁缆、德缆、新缆）的关键能耗指标 PK、重点用能设备监控及越限报警处置。",
        "subModules": [
            {"name": "16:9 标准工控布局", "desc": "严密适配 1920x1080 与 2K 工业显示器，无横向纵向滚动条，高密度 Bento 仪表网格。"},
            {"name": "6 大经营单位能耗 PK 矩阵", "desc": "沈变/衡变/新变/鲁缆/德缆/新缆实时负荷、万元产值能耗对标排名与环比浮动。"},
            {"name": "尖峰平谷负荷分布分析", "desc": "当日 24 小时 TOU 分时电量连续面积走势，实时标注当前尖峰平谷电价时段。"},
            {"name": "重点用能设备在线工况", "desc": "超高压立塔交联线、大型气相真空干燥机组等 32 台试点设备开机率与实时负荷率。"},
            {"name": "源网荷储微网运行状态", "desc": "园区光伏当前出力占比、储能充放功率、防逆流状态与市电需量预警。"}
        ],
        "parameters": [
            {"paramCode": "orgUnitId", "paramName": "经营单位ID", "category": "入参过滤", "dataType": "string", "unit": "-", "required": False, "source": "顶部下拉切换", "rangeOrEnum": "all | SB | HB | XB | LL | DL | XL", "description": "筛选查看单一经营单位或展示全集团综合横向对比"},
            {"paramCode": "totalActiveLoad", "paramName": "实时有功总负荷", "category": "核心指标", "dataType": "number", "unit": "kW", "required": True, "source": "总降变配电监控系统", "rangeOrEnum": "0 ~ 300,000", "description": "当前各厂区正在消耗的实际有功功率"},
            {"paramCode": "dailyPowerKwh", "paramName": "当日累计总用电量", "category": "核心指标", "dataType": "number", "unit": "kWh", "required": True, "source": "分时电度表冻结累加", "rangeOrEnum": "0 ~ 2,000,000", "description": "当日 00:00 至今的全厂有功总电量"},
            {"paramCode": "dailyGasM3", "paramName": "当日天然气消耗量", "category": "核心指标", "dataType": "number", "unit": "m³", "required": True, "source": "天然气总管膜式流量计", "rangeOrEnum": "0 ~ 10,000", "description": "当日锅炉与烘房燃气消耗总量"},
            {"paramCode": "dailySteamT", "paramName": "当日蒸汽外购量", "category": "核心指标", "dataType": "number", "unit": "t", "required": True, "source": "蒸汽供汽管道涡街流量计", "rangeOrEnum": "0 ~ 500", "description": "当日外购工业蒸汽累计进厂量"},
            {"paramCode": "energyPerOutputRealtime", "paramName": "实时万元产值能耗", "category": "衍生计算", "dataType": "number", "unit": "tce/万元", "required": True, "source": "能耗产值动态折算", "rangeOrEnum": "0.01 ~ 5.00", "description": "当日累计综合能耗与预计工业产值的比值"},
            {"paramCode": "peakValleyRatio", "paramName": "分时峰谷比", "category": "衍生计算", "dataType": "number", "unit": "-", "required": True, "source": "分时电量核算", "rangeOrEnum": "0.1 ~ 5.0", "description": "高峰时段用电量与低谷时段用电量的比值"}
        ],
        "dataSources": [
            {"medium": "全厂动力总降电能", "sourceType": "变电站电力自动化监控", "protocol": "Modbus-TCP / IEC 61850", "device": "110kV 总降主变测控柜多功能仪表", "tagExample": "SUB_MAIN_P1_ACT_PWR", "frequency": "10 秒", "securityLevel": "L1 (内部级)"},
            {"medium": "重点用能设备工况", "sourceType": "车间设备 PLC 采集网关", "protocol": "OPC UA / Modbus-RTU", "device": "超高压立塔配电柜 / 干燥罐电控柜", "tagExample": "EQP_CABLE_TOWER_01_P", "frequency": "15 秒", "securityLevel": "L2 (工作秘密)"},
            {"medium": "工业蒸汽瞬时流量", "sourceType": "供热管网监测流量计算机", "protocol": "4-20mA + HART 信号接入", "device": "涡街流量计 & 差压变送器", "tagExample": "STEAM_FLOW_RATE_TH", "frequency": "30 秒", "securityLevel": "L2 (工作秘密)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "综合折标综合能耗实时换算",
                "mathExpression": r"E_{tce} = \frac{E_{elec} \times 0.1229 + V_{gas} \times 1.2143 + M_{steam} \times 128.6}{1000}",
                "variables": [
                    {"name": "E_{elec}", "desc": "累计用电量", "unit": "kWh"},
                    {"name": "V_{gas}", "desc": "天然气消耗体积", "unit": "m³"},
                    {"name": "M_{steam}", "desc": "工业蒸汽质量", "unit": "t"}
                ],
                "logicDescription": "依据 GB/T 2589 综合能耗计算通则折标煤系数加权聚合。",
                "boundaryRule": "单项数据缺失时以 0 参与计算并触发标黄提示，禁止整式报错。"
            }
        ],
        "calculationLogic": "大屏各组件实时轮询拉取网关缓存快照，图表采用轻量化 Canvas 渲染保证 60fps 帧率。",
        "dtoSchema": """interface ControlCenterScreenDTO {
  timestamp: string;
  totalActiveLoadKw: number;
  dailyPowerKwh: number;
  dailyGasM3: number;
  dailySteamT: number;
  energyPerOutputTce: number;
  unitsRanking: { unitName: string; loadKw: number; yoyDelta: number }[];
  equipmentStatus: { eqName: string; powerKw: number; runningState: 'RUN'|'STOP' }[];
}""",
        "frontendSpecs": "- 固定 16:9 标准比例，支持 CSS Fullscreen API 一键全屏；\n- 表格行高 26px/44px 自适应，深色高对比度工业底色；\n- 图表悬停游标微透科技蓝 `rgba(56, 189, 248, 0.08)`。",
        "backendSpecs": "- 接口：`GET /api/v1/screen/control-center`\n- 内存缓存 3 秒，避免指挥中心多人并发查库。",
        "qaTestSpecs": "- 验证 16:9 比例锁定在 100% 缩放下无水平滚动条。\n- 模拟某单位断网数据缺失，界面优雅呈现离线指示。"
    },

    # 3. 指标管控
    {
        "id": "spec-monitor-indicator",
        "center": "零碳园区集控中心",
        "navGroup": "集中监管",
        "pageName": "指标管控",
        "route": "/zero-carbon/monitor/indicator",
        "component": "components/monitor/indicator-view.tsx",
        "overview": "能碳双中心核心管控中枢。统一管理经营单位级前 10 项综合指标、5 大标准单位产品指标及 47 项关键制造工序指标（共 65 项能碳管控体系）。支持 Mode A 宏观卡片与 Mode B 深入穿透详情（四项要素：算法公式、测点链路、时序趋势、四类介质历史台账），内置权威白名单判空规则。",
        "subModules": [
            {"name": "组织拓扑树下钻", "desc": "支持集团/经营单位/工厂/车间四级层级切换，自动识别 9 家未联网单位并纯字体置灰禁用。"},
            {"name": "全局时间粒度选择器", "desc": "支持按日/按月/按年多尺度切换，月度模式支持跨月区间选择联动。"},
            {"name": "指标分类切换 Tabs", "desc": "经营单位综合指标 (10项)、单位产品能耗指标 (5项)、关键制造工序指标 (47项)。"},
            {"name": "Mode A 核心指标卡片矩阵", "desc": "高密工业卡片网格，展示当前值、同环比、基准值偏差、标杆值对比与客观运行状态指示。"},
            {"name": "Mode B 深入穿透抽屉", "desc": "点击卡片右侧滑出深度穿透面板：包含完整算法公式、物理测点链路、12个月面积走势与四类介质台账。"},
            {"name": "尖峰平谷负荷与结构分析", "desc": "展示当日/当月尖峰平谷电量构成圆环图、2x2 明细微卡片及连续堆叠柱状图。"},
            {"name": "重点工序自身历史对比", "desc": "聚焦工序自身同比与环比走势，严禁虚假跨厂对抗。"},
            {"name": "权威工序白名单判空过滤", "desc": "依据权威工序表，10 家无工序单位精准判空输出单行结论：`暂无相关工序！`。"}
        ],
        "parameters": [
            {"paramCode": "orgUnitId", "paramName": "组织机构ID", "category": "入参过滤", "dataType": "number", "unit": "-", "required": True, "source": "左侧组织树选中项", "rangeOrEnum": "1 ~ 9999", "description": "当前选定的经营单位或单体工厂 ID"},
            {"paramCode": "periodType", "paramName": "统计周期类型", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "顶部时间组件", "rangeOrEnum": "day | month | year", "description": "核算时间维度：日、月、年"},
            {"paramCode": "startDate", "paramName": "起始时间标签", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "顶部时间组件", "rangeOrEnum": "YYYY-MM-DD 或 YYYY-MM", "description": "查询时间区间起始节点"},
            {"paramCode": "endDate", "paramName": "结束时间标签", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "顶部时间组件", "rangeOrEnum": "YYYY-MM-DD 或 YYYY-MM", "description": "查询时间区间截止节点"},
            {"paramCode": "category", "paramName": "指标大类", "category": "入参过滤", "dataType": "string", "unit": "-", "required": False, "source": "分类 Tabs", "rangeOrEnum": "group | product | process", "description": "过滤展示经营单位综合、单位产品或工序指标"},
            {"paramCode": "totalEnergyTce", "paramName": "综合能源消费总量", "category": "核心指标", "dataType": "number", "unit": "tce", "required": True, "source": "IoT 多能流折标聚合", "rangeOrEnum": "0 ~ 100,000", "description": "统计期内水、电、气、汽、油折标煤综合总量"},
            {"paramCode": "energyPerOutput", "paramName": "万元产值综合能耗", "category": "核心指标", "dataType": "number", "unit": "tce/万元", "required": True, "source": "能耗产值关联核算", "rangeOrEnum": "0.01 ~ 10.00", "description": "每万元工业总产值对应的折标综合能耗量"},
            {"paramCode": "unitProductEnergy", "paramName": "单位产品综合能耗", "category": "核心指标", "dataType": "number", "unit": "tce/万kVA 或 tce/km", "required": True, "source": "产量与工序加权分摊", "rangeOrEnum": "0.1 ~ 50.0", "description": "单台套或单位规格合格产品的综合能耗"},
            {"paramCode": "carbonEmissionT", "paramName": "综合碳排放总量", "category": "核心指标", "dataType": "number", "unit": "tCO2e", "required": True, "source": "范围一与范围二碳核算", "rangeOrEnum": "0 ~ 500,000", "description": "直接化石燃烧与外购电力热力对应的碳排放量"},
            {"paramCode": "carbonPerOutput", "paramName": "万元产值碳排放量", "category": "核心指标", "dataType": "number", "unit": "tCO2e/万元", "required": True, "source": "碳排产值关联核算", "rangeOrEnum": "0.01 ~ 20.00", "description": "每万元工业产值对应的二氧化碳排放强度"},
            {"paramCode": "greenPowerRatio", "paramName": "绿电消纳占比", "category": "核心指标", "dataType": "number", "unit": "%", "required": True, "source": "新能源结算数据", "rangeOrEnum": "0.0 ~ 100.0%", "description": "自发光伏与绿电直供量占总用电负荷比例"},
            {"paramCode": "pvSelfRatio", "paramName": "光伏自发自用率", "category": "核心指标", "dataType": "number", "unit": "%", "required": True, "source": "光伏发电系统结算", "rangeOrEnum": "0.0 ~ 100.0%", "description": "厂区光伏本地自用量占光伏总发电量的比例"},
            {"paramCode": "autoAcquisitionRate", "paramName": "关键数据自动采集率", "category": "核心指标", "dataType": "number", "unit": "%", "required": True, "source": "表计台账与远传对账", "rangeOrEnum": "0.0 ~ 100.0%", "description": "联网自动采集表计占理论应装表计比例"},
            {"paramCode": "meterEquipRate", "paramName": "计量器具配备完备率", "category": "核心指标", "dataType": "number", "unit": "%", "required": True, "source": "GB 17167 对账", "rangeOrEnum": "0.0 ~ 100.0%", "description": "按国标要求的能源计量器具实际配备比例"},
            {"paramCode": "processEnergyPerLot", "paramName": "关键工序单位消耗", "category": "业务明细", "dataType": "number", "unit": "kgce/台套 或 kWh/t", "required": True, "source": "车间工序电表除以产量", "rangeOrEnum": "0.01 ~ 5,000", "description": "线圈绕制/真空干燥/拉丝交联等单工序单耗"},
            {"paramCode": "yoyDeltaRate", "paramName": "同比变化率", "category": "衍生计算", "dataType": "number", "unit": "%", "required": True, "source": "时序对比引擎", "rangeOrEnum": "-100.0% ~ +500.0%", "description": "与去年同期相比的增减百分比，负值表示能效改善"},
            {"paramCode": "momDeltaRate", "paramName": "环比变化率", "category": "衍生计算", "dataType": "number", "unit": "%", "required": True, "source": "时序对比引擎", "rangeOrEnum": "-100.0% ~ +500.0%", "description": "与上一统计周期相比的增减百分比"},
            {"paramCode": "benchmarkDiff", "paramName": "基准值偏差量", "category": "衍生计算", "dataType": "number", "unit": "指标单位", "required": True, "source": "基准对比引擎", "rangeOrEnum": "任意实数", "description": "当前实际值减去集团设定基准值的差额"},
            {"paramCode": "status", "paramName": "客观运行状态", "category": "核心指标", "dataType": "string", "unit": "-", "required": True, "source": "状态判定引擎", "rangeOrEnum": "NORMAL | ALERT | EXCELLENT", "description": "指标运行状态，严禁定性主观说教词汇"}
        ],
        "dataSources": [
            {"medium": "车间动力及工序电能", "sourceType": "车间分项电能表与热量表 SCADA 直采", "protocol": "Modbus-TCP", "device": "车间动力配电柜导轨式多功能电表 (APM810)", "tagExample": "LINE2_DRY_OVEN_EP (干燥炉电量), LINE2_DRY_STEAM (干燥炉蒸汽)", "frequency": "每班次(8小时)结存，15秒遥测", "securityLevel": "L1 (内部级)"},
            {"medium": "工序完工合格产量", "sourceType": "MES 生产制造执行系统", "protocol": "REST API / 数据库中间视图", "device": "MES 生产过站报工终端 (Barcode / RFID 扫码)", "tagExample": "MES_OP_FINISH_QTY (工序过站合格数量)", "frequency": "工单完工过站即时", "securityLevel": "L2 (工作秘密)"},
            {"medium": "工业蒸汽瞬时与累计", "sourceType": "SCADA 蒸汽流量计算机", "protocol": "RS485 / Modbus-RTU", "device": "高温差压孔板蒸汽流量计", "tagExample": "XJ_STEAM_F1_MASS (气相干燥蒸汽流量)", "frequency": "1 分钟", "securityLevel": "L2 (工作秘密)"},
            {"medium": "天然气累计供气量", "sourceType": "工业气体流量计远传终端", "protocol": "M-Bus / 脉冲接口", "device": "天信膜式燃气表 / 气体涡轮流量计", "tagExample": "HB_GAS_M1_TOTAL", "frequency": "15 分钟累积", "securityLevel": "L2 (工作秘密)"},
            {"medium": "屋顶光伏与储能微网", "sourceType": "园区新能源集控网关", "protocol": "IEC 61850 / Modbus-TCP", "device": "光伏逆变器 & 储能双向变流器 PCS", "tagExample": "PV_INV_01_ETODAY, BESS_BAT_SOC_01", "frequency": "15 秒", "securityLevel": "L1 (内部级)"},
            {"medium": "工业总产值与增加值", "sourceType": "ERP 财务系统与月报填报", "protocol": "HTTPS REST API", "device": "SAP 财务核算模块 / 线下填报表单", "tagExample": "finance_monthly_report.industrial_output_value", "frequency": "每月 3 日前结账", "securityLevel": "L3 (核心商密)"},
            {"medium": "官方碳因子与折标系数", "sourceType": "集团因子库集中维护系统", "protocol": "MySQL 系统字典表", "device": "数据中心主数据库 `t_carbon_factor`", "tagExample": "factor_value (省级电网碳排放因子)", "frequency": "月度生效归档", "securityLevel": "L2 (工作秘密)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "综合能耗折标准煤当量模型",
                "mathExpression": r"E = \sum_{i=1}^{n} (E_i \times k_i)",
                "variables": [
                    {"name": "E_i", "desc": "第 i 类能源介质实物量 (电、汽、气、油)", "unit": "kWh, t, m³, kg"},
                    {"name": "k_i", "desc": "折标煤当量系数 (电:0.1229 kgce/kWh, 汽:0.1286 kgce/kg, 气:1.2143 kgce/m³)", "unit": "kgce/实物单位"}
                ],
                "logicDescription": "依据 GB/T 2589 综合能耗计算通则，将全厂各类能源实物量转换为统一吨标准煤当量 (tce)。",
                "boundaryRule": "实物消耗量必须为正实数，出现负数判定为表计倒走异常，系统阻断核算并告警。"
            },
            {
                "formulaName": "万元产值综合能耗核算模型",
                "mathExpression": r"e_{output} = \frac{E}{G_{output} / 10000}",
                "variables": [
                    {"name": "E", "desc": "全厂统计期折标综合能耗", "unit": "tce"},
                    {"name": "G_{output}", "desc": "全厂同期完成的工业总产值", "unit": "元"}
                ],
                "logicDescription": "衡量企业工业经济产出能效的核心指标，分子分母统计周期与核算范围严格闭环对齐。",
                "boundaryRule": "若某月全厂停工检修且工业产值 G_output = 0 时，单耗安全兜底显示为 `-`，严禁除以零抛出 NaN。"
            },
            {
                "formulaName": "关键工序单耗与白名单判空规则",
                "mathExpression": r"e_{process} = \frac{E_{elec} \times 0.1229 + T_{steam} \times 0.1286}{Q_{finished\_lot}}",
                "variables": [
                    {"name": "E_{elec}", "desc": "工序生产专用电表消耗电量", "unit": "kWh"},
                    {"name": "T_{steam}", "desc": "干燥炉等工序消耗蒸汽量", "unit": "kg"},
                    {"name": "Q_{finished_lot}", "desc": "工序 MES 报工质检合格台套数或重量", "unit": "台套 或 t"}
                ],
                "logicDescription": "工序专机能耗直采加总，除以合格产量；非工序公用辅助能耗不计入单道工序分子。",
                "boundaryRule": "严格遵循《生产单位与涉及关键工序对应表(1).et》，沈变、衡变、新变、鲁缆下属智慧能源等 10 家无工序企业精准判空为单行纯文本：`暂无相关工序！`。"
            },
            {
                "formulaName": "动态同环比核算与容错模型",
                "mathExpression": r"\text{YoY} = \frac{V_{current} - V_{last\_year}}{V_{last\_year}} \times 100\%, \quad \text{MoM} = \frac{V_{current} - V_{last\_month}}{V_{last\_month}} \times 100\%",
                "variables": [
                    {"name": "V_{current}", "desc": "当前核算周期实际值", "unit": "指标对应物理单位"},
                    {"name": "V_{last_year}", "desc": "去年同期历史核算值", "unit": "指标对应物理单位"},
                    {"name": "V_{last_month}", "desc": "上月基期历史核算值", "unit": "指标对应物理单位"}
                ],
                "logicDescription": "反映指标时序演进趋势，负值代表消耗降低或能效改善，正值代表能耗上升。",
                "boundaryRule": "基期历史值为 0 或缺失时，增长率统一安全显示为 `--` 并附加提示，避免无穷大异常。"
            }
        ],
        "calculationLogic": "1. 工序单位管耗核算:\n   e_process = (E_elec × 0.1229 + T_steam × 0.1286) / Q_finished_lot\n   若当期产量 Q = 0，消除除零异常，前端显示 '-' 并提示'当期无产出'。\n2. 权威工序白名单判空规则:\n   依据《生产单位与涉及关键工序对应表(1).et》，沈变、衡变、新变、鲁缆下属智慧能源等 10 家无工序企业，工序业务领域一律精准判空整行输出单行文本：暂无相关工序！",
        "dtoSchema": """interface IndicatorOverviewDTO {
  orgUnitId: number;
  period: string;
  summary: {
    totalIndicators: number;
    normalCount: number;
    alertCount: number;
  };
  metrics: {
    id: number;
    code: string;
    name: string;
    category: 'group' | 'product' | 'process';
    currentVal: number;
    unit: string;
    benchmarkVal: number;
    yoyRate: number;
    momRate: number;
    status: 'NORMAL' | 'ALERT' | 'EXCELLENT';
    formula: string;
  }[];
}""",
        "frontendSpecs": "- Mode A 与 Mode B 无缝抽屉切换，激活态通过 `border-primary ring-2` 自解释，杜绝说明性标签；\n- 44px 工业高密表格行高，字体对齐；\n- 8 大能源介质官方标准色与尖峰平谷 4 段色彩字典绝对统一。",
        "backendSpecs": "- 接口：`GET /api/v1/zero-carbon/indicators/list`\n- Redis 缓存 Key: `cache:ind:overview:{unitId}:{period}`，TTL = 30min + 5min Jitter；\n- 分布式锁 `lock:calc:{unitId}:{period}` 防止单工厂同周期重复核算并发写。",
        "qaTestSpecs": "- 边界值测试: 验证无工序工厂精准展示单行'暂无相关工序！'，无多余大段文字；\n- 除零测试: 模拟产量为 0，单耗无 NaN 抛错，正常展示 '-'；\n- 权限测试: 验证分厂专员无法越权调阅其他分厂核心产值与单耗数据。"
    },

    # 4. 用能在线监测
    {
        "id": "spec-monitor-usage",
        "center": "零碳园区集控中心",
        "navGroup": "集中监管",
        "pageName": "用能在线监测",
        "route": "/zero-carbon/monitor/online/usage",
        "component": "components/online/usage-view.tsx",
        "overview": "全厂多能流高频在线监测中枢。集中呈现水、电、气、蒸汽 4 大能源介质的 24 小时出力量、负荷走势、分时尖峰平谷电量与折标综合能耗，支持向下穿透至园区、车间及关键重点用能设备。",
        "subModules": [
            {"name": "实时多能流总览卡片", "desc": "总用电量、市电量、绿电消纳量、工业蒸汽消耗量 4 大 KPI 主指标卡，边框高亮自解释。"},
            {"name": "24小时负荷时序走势", "desc": "多能源介质动态曲线，支持日/周/月粒度切换及微透防眩游标。"},
            {"name": "分时电量 4 段构成", "desc": "尖、峰、平、谷电量柱状占比及综合电费加权分析。电力介质展示分时构成，非电介质动态联动为工序消耗结构。"},
            {"name": "车间及重点设备能耗列表", "desc": "高密 44px 表格，按介质与车间逐项展示实物量与折标量。"},
            {"name": "跨月区间选择器", "desc": "顶部统一升级为 [起始月份] 至 [结束月份]，折线图 X 轴联动展示为各月份节点。"}
        ],
        "parameters": [
            {"paramCode": "parkId", "paramName": "所属园区", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "顶部下拉", "rangeOrEnum": "PARK_XJ | PARK_HB | PARK_SB | PARK_SD", "description": "当前监测的园区编码"},
            {"paramCode": "energyMedium", "paramName": "能源介质类型", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "介质卡片切换", "rangeOrEnum": "TOTAL_POWER | GRID_POWER | GREEN_POWER | WATER | GAS | STEAM | OIL | N2", "description": "当前激活查看的能源介质"},
            {"paramCode": "period", "paramName": "统计维度", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "时间模式选择", "rangeOrEnum": "day | month", "description": "日连续高频监测或月度汇总累计"},
            {"paramCode": "dateRange", "paramName": "时间区间", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "日期选择器", "rangeOrEnum": "YYYY-MM-DD 或 YYYY-MM~YYYY-MM", "description": "连续采样时间窗"},
            {"paramCode": "instantTotalPowerKw", "paramName": "实时总有功功率", "category": "核心指标", "dataType": "number", "unit": "kW", "required": True, "source": "SCADA 遥测", "rangeOrEnum": "0 ~ 100,000", "description": "当前瞬时总用电负荷"},
            {"paramCode": "accumulatedPowerKwh", "paramName": "累计用电量", "category": "核心指标", "dataType": "number", "unit": "kWh", "required": True, "source": "表底度数累计", "rangeOrEnum": "0 ~ 10,000,000", "description": "统计期内总用电度数"},
            {"paramCode": "sharpPowerKwh", "paramName": "尖峰电量", "category": "业务明细", "dataType": "number", "unit": "kWh", "required": True, "source": "分时计度表", "rangeOrEnum": "0 ~ 2,000,000", "description": "执行尖峰电价时段消耗的电量"},
            {"paramCode": "peakPowerKwh", "paramName": "高峰电量", "category": "业务明细", "dataType": "number", "unit": "kWh", "required": True, "source": "分时计度表", "rangeOrEnum": "0 ~ 3,000,000", "description": "执行高峰电价时段消耗的电量"},
            {"paramCode": "flatPowerKwh", "paramName": "平时电量", "category": "业务明细", "dataType": "number", "unit": "kWh", "required": True, "source": "分时计度表", "rangeOrEnum": "0 ~ 4,000,000", "description": "执行平段电价时段消耗的电量"},
            {"paramCode": "valleyPowerKwh", "paramName": "低谷电量", "category": "业务明细", "dataType": "number", "unit": "kWh", "required": True, "source": "分时计度表", "rangeOrEnum": "0 ~ 5,000,000", "description": "执行低谷电价时段消耗的电量"},
            {"paramCode": "steamConsumptionT", "paramName": "蒸汽消耗量", "category": "核心指标", "dataType": "number", "unit": "t", "required": True, "source": "蒸汽流量表", "rangeOrEnum": "0 ~ 500", "description": "原管道工作压力更名为蒸汽消耗量"},
            {"paramCode": "totalTceEquivalent", "paramName": "综合折标能耗", "category": "衍生计算", "dataType": "number", "unit": "tce", "required": True, "source": "综合核算引擎", "rangeOrEnum": "0 ~ 5,000", "description": "全介质折标煤累计量"}
        ],
        "dataSources": [
            {"medium": "电力 (市电/绿电)", "sourceType": "IoT / SCADA 自动化直采", "protocol": "Modbus-TCP / IEC 60870-5-104", "device": "配电房智能电力仪表 (安科瑞 APM810 / 施耐德 PM8000)", "tagExample": "XJ_TRANS_P1_P_TOT (瞬时功率 kW), XJ_TRANS_P1_EP_IMP (累计有功度数 kWh)", "frequency": "15 秒采集一次遥测，15 分钟存储一次冻结底度", "securityLevel": "L1 (内部级)"},
            {"medium": "工业蒸汽", "sourceType": "SCADA 流量计算机", "protocol": "OPC UA / 4-20mA + HART", "device": "蒸汽涡街流量计 & 差压变送器", "tagExample": "XJ_STEAM_F1_MASS (瞬时流量 t/h), XJ_STEAM_F1_TOTAL (累积流量 t)", "frequency": "1 分钟采样", "securityLevel": "L2 (工作秘密)"},
            {"medium": "天然气", "sourceType": "城市燃气公司远传数据 / 厂内燃气总表", "protocol": "Modbus-RTU / 脉冲接口", "device": "气体涡轮流量计", "tagExample": "HB_GAS_M1_TOTAL (累计气量 m³)", "frequency": "15 分钟累加", "securityLevel": "L2 (工作秘密)"},
            {"medium": "工业用水", "sourceType": "给排水智慧水表", "protocol": "M-Bus / NB-IoT", "device": "超声波智能水表", "tagExample": "MTR_WATER_W01_ACC (累计吨数 t)", "frequency": "1 小时累加", "securityLevel": "L1 (内部级)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "分时尖峰平谷电度电费核算",
                "mathExpression": r"Cost_{power} = Q_{sharp} \times P_{sharp} + Q_{peak} \times P_{peak} + Q_{flat} \times P_{flat} + Q_{valley} \times P_{valley}",
                "variables": [
                    {"name": "Q_i", "desc": "各分时时段累计用电量", "unit": "kWh"},
                    {"name": "P_i", "desc": "当地电网对应分时销售电价", "unit": "元/kWh"}
                ],
                "logicDescription": "按发改委分时电价政策，精确测算各时段用电成本，用于指导错峰填谷排产。",
                "boundaryRule": "时段电价配置按月归档生效，存在电价突变时以当月第一天 00:00 分界执行。"
            },
            {
                "formulaName": "8大能源介质折标煤核算",
                "mathExpression": r"E_{total\_tce} = \sum_{m=1}^{8} (Q_m \times k_m) / 1000",
                "variables": [
                    {"name": "Q_m", "desc": "第 m 种介质实物消费量", "unit": "实物单位"},
                    {"name": "k_m", "desc": "国家统一折标煤系数 (kgce/单位)", "unit": "kgce"}
                ],
                "logicDescription": "电量按 0.1229、水按 0.0857、气按 1.2143、汽按 0.1286、油按 1.4571、氮按 0.4000 标准折算。",
                "boundaryRule": "实物量必须非负，单项表计出现反向递减时锁定报警。"
            }
        ],
        "calculationLogic": "1. 尖峰平谷电量计算:\n   Q_total = Q_sharp + Q_peak + Q_flat + Q_valley\n2. 折标综合能耗 (tce):\n   E_tce = (Q_elec × 0.1229 + Q_gas × 1.2143 + Q_steam × 128.6 + Q_water × 0.0857) / 1000\n3. 非电介质自动联动为工序消耗结构占比，消除用电峰平谷违和感。",
        "dtoSchema": """interface UsageQueryReq {
  parkId: string;
  unitId?: string;
  period: 'day' | 'month';
  date: string;
}

interface RealtimeUsageDTO {
  timestamp: string;
  metrics: {
    totalPowerKwh: number;
    gridPowerKwh: number;
    greenPowerKwh: number;
    steamKg: number;
    gasM3: number;
    waterTons: number;
    totalKgce: number;
    carbonEmissionsT: number;
  };
  timeSeries: { time: string; power: number; steam: number; gas: number }[];
  touShares: { sharpKwh: number; peakKwh: number; flatKwh: number; valleyKwh: number };
}""",
        "frontendSpecs": "- 选中非电介质时，下方模块自动无缝切换为重点工序消耗结构与负荷曲线；\n- 44px 高密表格，表格标题右侧彻底剥离说明性括号文本；\n- 跨月区间选择器联动 X 轴月份显示。",
        "backendSpecs": "- 接口：`GET /api/v1/zero-carbon/monitor/online/usage`\n- TDengine / IoTDB 时序聚合查询，分钟级数据自动 Rollup 降采样。",
        "qaTestSpecs": "- 介质联动测试: 点击水、气、汽等介质，验证下方峰平谷模块彻底替换为工序分布；\n- 跨月区间测试: 选择 2026-01 至 2026-08，图表 X 轴精确展示 8 个月份节点。"
    },

    # 5. 工业微电网监测
    {
        "id": "spec-monitor-microgrid",
        "center": "零碳园区集控中心",
        "navGroup": "集中监管",
        "pageName": "工业微电网监测",
        "route": "/zero-carbon/monitor/online/microgrid",
        "component": "components/online/microgrid-view.tsx",
        "overview": "园区级工业微电网“源-网-荷-储”多能互补协同控制与防逆流监控中枢。实时监视屋顶光伏出力、储能电池充放电工况（SOC/SOH/充放功率）、车间负荷吸收曲线，严格执行防逆流倒送保护与错峰填谷套利核算。",
        "subModules": [
            {"name": "源网荷储实时拓扑图", "desc": "市电进线、屋顶分布式光伏、电化学储能、车间生产负荷四端潮流动态流动图。"},
            {"name": "防逆流保护监控看板", "desc": "并网点倒送功率安全阈值实时监测，倒送触发与响应时间毫秒级报警。"},
            {"name": "储能电站健康与工况", "desc": "电池组 SOC (荷电状态)、SOH (健康度)、单体电芯最高/最低温差与双向充放电功率。"},
            {"name": "光伏发电效率与出力", "desc": "光伏实时有功出力、理论辐射出力对比、光伏系统性能比 PR 评估。"},
            {"name": "削峰填谷套利收益核算", "desc": "当日储能低谷充电电费支出与尖峰放电节省电费收益动态比对。"},
            {"name": "微网运行事件台账", "desc": "高密 44px 表格，记录微网削峰、填谷、防逆流切机历史事件。"}
        ],
        "parameters": [
            {"paramCode": "gridPccPowerKw", "paramName": "并网点有功功率", "category": "核心指标", "dataType": "number", "unit": "kW", "required": True, "source": "并网点双向计量表", "rangeOrEnum": "-10,000 ~ +50,000", "description": "正值代表从大电网购电，负值代表向电网倒送电量"},
            {"paramCode": "pvTotalPowerKw", "paramName": "光伏总输出功率", "category": "核心指标", "dataType": "number", "unit": "kW", "required": True, "source": "光伏逆变器遥测", "rangeOrEnum": "0 ~ 30,000", "description": "全园区屋顶光伏实时总交流出力"},
            {"paramCode": "essPowerKw", "paramName": "储能充放功率", "category": "核心指标", "dataType": "number", "unit": "kW", "required": True, "source": "储能 PCS 变流器", "rangeOrEnum": "-10,000 ~ +10,000", "description": "正值为放电供工厂，负值为充电吸纳光伏"},
            {"paramCode": "essSocPct", "paramName": "储能当前荷电状态", "category": "核心指标", "dataType": "number", "unit": "%", "required": True, "source": "BMS 电池管理系统", "rangeOrEnum": "10.0 ~ 95.0%", "description": "电池剩余可用电量百分比"},
            {"paramCode": "essSohPct", "paramName": "储能电池健康度", "category": "业务明细", "dataType": "number", "unit": "%", "required": True, "source": "BMS 寿命评估算法", "rangeOrEnum": "80.0 ~ 100.0%", "description": "当前最大可用容量与初始额定容量之比"},
            {"paramCode": "antiReverseState", "paramName": "防逆流保护状态", "category": "业务明细", "dataType": "string", "unit": "-", "required": True, "source": "微网调控一体机", "rangeOrEnum": "NORMAL | WARNING | TRIGGERED", "description": "正常监视、临界告警、已触发降功率保护"},
            {"paramCode": "todayArbitrageYuan", "paramName": "当日削峰填谷收益", "category": "衍生计算", "dataType": "number", "unit": "元", "required": True, "source": "峰谷套利核算模型", "rangeOrEnum": "0 ~ 50,000", "description": "储能谷充峰放产生的直接净电费差价收益"},
            {"paramCode": "maxCellTempDiffC", "paramName": "电芯最高温差", "category": "业务明细", "dataType": "number", "unit": "°C", "required": True, "source": "BMS 温度巡检", "rangeOrEnum": "0.0 ~ 15.0", "description": "电池模组内最高与最低电芯温差，>5°C 预警"}
        ],
        "dataSources": [
            {"medium": "关口并网双向有功电量", "sourceType": "高压电度表 SCADA 直采", "protocol": "DL/T 645 / IEC 104", "device": "10kV/35kV 产权分界点双向智能电能表", "tagExample": "PCC_BI_DIR_ACTIVE_POWER_KW", "frequency": "1 秒遥测", "securityLevel": "L1 (内部级)"},
            {"medium": "组串式光伏逆变器状态", "sourceType": "光伏数采网关通信机", "protocol": "Modbus-RTU 汇聚", "device": "华为 SUN2000 组串式逆变器", "tagExample": "PV_INV_RACK01_PAC", "frequency": "5 秒", "securityLevel": "L1 (内部级)"},
            {"medium": "电化学储能 PCS 变流器", "sourceType": "储能系统 EMS", "protocol": "Modbus-TCP", "device": "汇川 / 阳光电源双向储能变流器", "tagExample": "PCS_01_ACTIVE_POWER", "frequency": "1 秒", "securityLevel": "L1 (内部级)"},
            {"medium": "电池管理系统 BMS", "sourceType": "BMS 主控模块", "protocol": "CAN 转 Modbus-TCP", "device": "磷酸铁锂电池簇集中监控单元", "tagExample": "BMS_CLUSTER_SOC, BMS_MAX_CELL_TEMP", "frequency": "2 秒", "securityLevel": "L2 (工作秘密)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "防逆流倒送保护触发控制逻辑",
                "mathExpression": r"P_{reverse} \ge 10\text{ kW} \quad \text{且持续时间 } t \ge 100\text{ ms} \implies \text{执行指令 } \Delta P_{pv} = -5\% P_{rated}/\text{s}",
                "variables": [
                    {"name": "P_{reverse}", "desc": "并网关口点反向流入公用电网的有功功率", "unit": "kW"},
                    {"name": "t", "desc": "倒送持续监测时间窗", "unit": "ms"},
                    {"name": r"\Delta P_{pv}", "desc": "下发给光伏逆变器的出力压降斜率", "unit": "%/s"}
                ],
                "logicDescription": "当厂区负荷骤降导致光伏富余电量向公用电网倒送时，微网调控器在 200ms 内快速压降光伏出力，防止越级跳闸被电网罚款。",
                "boundaryRule": "厂内负荷回升且倒送持续 60 秒小于 2kW 时，控制器以 2% P_rated/min 斜率缓慢平滑恢复光伏至最大功率跟踪 MPPT 模式。"
            },
            {
                "formulaName": "储能削峰填谷日净收益测算",
                "mathExpression": r"B_{arbitrage} = \sum (E_{discharge} \times P_{peak\_price}) - \sum (E_{charge} \times P_{valley\_price}) - M_{loss}",
                "variables": [
                    {"name": "E_{discharge}", "desc": "峰段和尖峰时段储能向工厂负荷放电量", "unit": "kWh"},
                    {"name": "E_{charge}", "desc": "低谷时段储能从电网吸收充电量", "unit": "kWh"},
                    {"name": "P_{price}", "desc": "对应时段峰谷销售电价", "unit": "元/kWh"},
                    {"name": "M_{loss}", "desc": "充放电转换损耗折算成本 (系统综合充放效率 RTE 约 88%)", "unit": "元"}
                ],
                "logicDescription": "利用夜间谷电低价充电、白天尖峰高价放电，直接压降工厂高峰购电支出。",
                "boundaryRule": "放电深度 DoD 严格限制在 90% 以内 (SOC 10%~95%)，防止电池过充过放损耗寿命。"
            }
        ],
        "calculationLogic": "微网系统每秒评估并网点潮流，微网调控一体机通过闭环算法动态调节储能充放功率与光伏逆变器功率因数。",
        "dtoSchema": """interface MicrogridStatusDTO {
  pccPowerKw: number;
  pvPowerKw: number;
  essPowerKw: number;
  factoryLoadKw: number;
  socPct: number;
  sohPct: number;
  antiReverseState: 'NORMAL' | 'WARNING' | 'TRIGGERED';
  dailySavingsYuan: number;
  activeEvents: { id: string; type: string; triggerTime: string; powerOffset: number }[];
}""",
        "frontendSpecs": "- 潮流图采用动画光点流向表示电能输送方向与实时速率；\n- 44px 高密事件台账，防逆流异常以红色边框脉冲提示；\n- 导出按钮统一使用标准 `<ExportButton />` 组件 (80x36px)。",
        "backendSpecs": "- 接口：`GET /api/v1/zero-carbon/monitor/online/microgrid`\n- 遥测数据 1 秒高频缓存于 Redis，保留最新 60 个数据点供曲线无抖动流式刷新。",
        "qaTestSpecs": "- 逆流告警测试: 模拟 PCC 倒送功率达到 -15kW，验证系统在 100ms 内触发 ALERT 状态；\n- 恢复防抖测试: 模拟倒送消失，验证系统是否满足 60s 防抖延时后才复位 MPPT。"
    },

    # 6. 能源碳排放监测
    {
        "id": "spec-monitor-carbon-emission",
        "center": "零碳园区集控中心",
        "navGroup": "集中监管",
        "pageName": "能源碳排放监测",
        "route": "/zero-carbon/monitor/carbon-emission",
        "component": "components/online/carbon-emission-view.tsx",
        "overview": "企业温室气体排放实时监控看板。依据国家《工业企业温室气体排放核算方法与报告指南》，全面穿透范围一（直接化石燃料燃烧）与范围二（外购电力与蒸汽消耗间接排放），实时计算全厂碳排放速率、绿电减碳抵消量及万元产值碳排放强度。",
        "subModules": [
            {"name": "碳排放强度看板", "desc": "实时碳排放速率 (tCO2e/h)、累计碳排放量 (tCO2e)、万元产值碳强度 (tCO2e/万元)。"},
            {"name": "范围一/范围二动态拆解", "desc": "化石燃料燃烧 (直接排放) 与外购电力热力 (间接排放) 实时比例环形图。"},
            {"name": "能源活动时序碳排走势", "desc": "日/月/年多维度时序碳排放面积图，微透防眩科技蓝游标。"},
            {"name": "绿电直接减排抵消量", "desc": "基于物理溯源绿电消纳量计算的碳减排量，展示净排放与总排放差异。"},
            {"name": "各车间碳排放贡献明细表", "desc": "44px 工业高密表格，按车间/产线展示电、气、汽实物量及核算碳排吨数。"}
        ],
        "parameters": [
            {"paramCode": "orgUnitId", "paramName": "组织工厂ID", "category": "入参过滤", "dataType": "number", "unit": "-", "required": True, "source": "组织选择树", "rangeOrEnum": "1 ~ 9999", "description": "查看的指定单体工厂"},
            {"paramCode": "scope1Tco2", "paramName": "范围一直接排放量", "category": "核心指标", "dataType": "number", "unit": "tCO2e", "required": True, "source": "天然气与柴油燃烧核算", "rangeOrEnum": "0 ~ 10,000", "description": "厂区内固定燃烧源与移动源碳排放"},
            {"paramCode": "scope2Tco2", "paramName": "范围二间接排放量", "category": "核心指标", "dataType": "number", "unit": "tCO2e", "required": True, "source": "外购电与外购蒸汽核算", "rangeOrEnum": "0 ~ 100,000", "description": "消耗外购电力与热力隐含的碳排放"},
            {"paramCode": "greenOffsetTco2", "paramName": "绿电减排抵消量", "category": "核心指标", "dataType": "number", "unit": "tCO2e", "required": True, "source": "自发与直供绿电换算", "rangeOrEnum": "0 ~ 50,000", "description": "自用非化石能源电力减免的碳排放量"},
            {"paramCode": "netCarbonEmissionT", "paramName": "企业净碳排放量", "category": "核心指标", "dataType": "number", "unit": "tCO2e", "required": True, "source": "总排放减去绿电抵消", "rangeOrEnum": "0 ~ 100,000", "description": "Scope1 + Scope2 - GreenOffset"},
            {"paramCode": "carbonIntensityOutput", "paramName": "万元产值碳强度", "category": "衍生计算", "dataType": "number", "unit": "tCO2e/万元", "required": True, "source": "净碳排与产值之比", "rangeOrEnum": "0.01 ~ 15.00", "description": "每万元产值对应的温室气体排放"},
            {"paramCode": "powerEmissionFactor", "paramName": "电力碳排放因子", "category": "业务明细", "dataType": "number", "unit": "kgCO2/kWh", "required": True, "source": "生态环境部发布因子", "rangeOrEnum": "0.400 ~ 0.800", "description": "当前适用的区域省级电网基准平均因子"}
        ],
        "dataSources": [
            {"medium": "全厂外购市电量", "sourceType": "SCADA 关口主表", "protocol": "Modbus-TCP", "device": "110kV 主降变压器关口计量表", "tagExample": "GRID_METER_TOTAL_KWH", "frequency": "15 分钟冻结", "securityLevel": "L1 (内部级)"},
            {"medium": "工业天然气耗量", "sourceType": "燃气计量远传表", "protocol": "Modbus-RTU", "device": "锅炉房及热处理炉天然气流量计", "tagExample": "GAS_BOILER_TOTAL_M3", "frequency": "15 分钟", "securityLevel": "L2 (工作秘密)"},
            {"medium": "外购蒸汽质量", "sourceType": "供热管网监测仪", "protocol": "4-20mA", "device": "蒸汽流量计算机", "tagExample": "STEAM_PIPE_IN_TONS", "frequency": "15 分钟", "securityLevel": "L2 (工作秘密)"},
            {"medium": "省级电网碳排放因子", "sourceType": "集团因子库版本管理", "protocol": "MySQL 系统字典", "device": "`t_carbon_factor` 电网因子表", "tagExample": "EF_GRID_REGIONAL", "frequency": "年度更新生效", "securityLevel": "L1 (内部级)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "范围一化石燃料燃烧碳排放计算",
                "mathExpression": r"C_{scope1} = V_{gas} \times LHV_{gas} \times CC_{gas} \times OF_{gas} \times \frac{44}{12} + M_{diesel} \times LHV_{diesel} \times CC_{diesel} \times OF_{diesel} \times \frac{44}{12}",
                "variables": [
                    {"name": "V_{gas}", "desc": "天然气消耗体积", "unit": "万Nm³"},
                    {"name": "LHV", "desc": "燃料低位发热量", "unit": "GJ/万Nm³ 或 GJ/t"},
                    {"name": "CC", "desc": "单位热值含碳量", "unit": "tC/GJ"},
                    {"name": "OF", "desc": "碳氧化率 (天然气通常取 99%)", "unit": "%"}
                ],
                "logicDescription": "遵循发改委指南，基于燃料消耗量与实测或缺省发热量、含碳量核算直接二氧化碳排放。",
                "boundaryRule": "发热量以供气方月度检验报告为准，未检测时采用国家缺省值 389.31 GJ/万Nm³。"
            },
            {
                "formulaName": "范围二外购电力净间接排放核算",
                "mathExpression": r"C_{scope2} = (E_{total\_power} - E_{green\_physical}) \times EF_{grid} + M_{steam} \times EF_{steam}",
                "variables": [
                    {"name": "E_{total_power}", "desc": "企业总用电量", "unit": "MWh"},
                    {"name": "E_{green_physical}", "desc": "具备物理溯源的自用绿电与专线绿电", "unit": "MWh"},
                    {"name": "EF_{grid}", "desc": "全国或省级电网基准平均碳排放因子", "unit": "tCO2/MWh"},
                    {"name": "EF_{steam}", "desc": "外购蒸汽碳排放因子 (通常 0.11 tCO2/GJ)", "unit": "tCO2/GJ"}
                ],
                "logicDescription": "物理绿电直接扣减外购火电电量，体现企业投资新能源电站的直接降碳红利。",
                "boundaryRule": "扣减量严格以实际消纳量为上限，绿电超发上网部分不计入本厂抵扣。"
            }
        ],
        "calculationLogic": "碳排放核算引擎采用日结存批处理与小时级流式估算，双端同构统一采用 44px 高密表格排版。",
        "dtoSchema": """interface CarbonEmissionDTO {
  orgUnitId: number;
  period: string;
  scope1T: number;
  scope2T: number;
  greenOffsetT: number;
  netTotalT: number;
  carbonIntensity: number;
  timeSeries: { time: string; scope1: number; scope2: number }[];
  workshopDetails: { workshopName: string; powerKwh: number; gasM3: number; emissionT: number }[];
}""",
        "frontendSpecs": "- 44px 工业高密表格；\n- 纯客观数据呈现，严禁任何'减排表现优良'等定性评价标签；\n- 导出按钮统一接入标准 `<ExportButton />` 组件。",
        "backendSpecs": "- 接口：`GET /api/v1/zero-carbon/monitor/carbon-emission`\n- 数据写入生成审计哈希链，保证核算报告真实防篡改。",
        "qaTestSpecs": "- 因子匹配测试: 验证不同年份不同地区电网因子版本准确取数；\n- 绿电扣减测试: 验证无绿电单位扣减量为 0，净排放严格等于总排放。"
    },

    # 7. 用能结构分析
    {
        "id": "spec-energy-structure",
        "center": "零碳园区集控中心",
        "navGroup": "能耗能效分析",
        "pageName": "用能结构分析",
        "route": "/zero-carbon/energy/structure",
        "component": "components/energy/structure-view.tsx",
        "overview": "全厂多能源介质消费结构与能量流向全景透视中枢。通过 8 大能源介质官方配色甜甜圈图、全厂能流桑基图 (Sankey Diagram) 与介质时序消耗走势，穿透购入、转换、输配至各车间与工序终端的用能结构变化。",
        "subModules": [
            {"name": "8大能源介质结构甜甜圈图", "desc": "总用电量、市电量、直供绿电、水资源、天然气、蒸汽、油消耗、液氮实物量与折标占比。"},
            {"name": "全厂能流输送桑基图 (Sankey)", "desc": "购入端、转换端、车间配电端、终端用能四级能流拓扑流向与输配损失率。"},
            {"name": "能源介质消耗时序变化", "desc": "各能源品种月度消耗走势，支持堆叠柱状与趋势面积图切换。"},
            {"name": "高耗能重点车间介质构成", "desc": "特高压绕线、气相干燥、立塔挤出等重点车间多能流实物构成明细。"},
            {"name": "用能结构明细台账", "desc": "44px 工业高密表格，展示各车间各介质实物量、折标量及结构比例。"}
        ],
        "parameters": [
            {"paramCode": "orgUnitId", "paramName": "组织工厂ID", "category": "入参过滤", "dataType": "number", "unit": "-", "required": True, "source": "左侧拓扑树", "rangeOrEnum": "1 ~ 9999", "description": "查看的目标工厂"},
            {"paramCode": "periodYear", "paramName": "核算年度", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "年度筛选器", "rangeOrEnum": "YYYY", "description": "分析对比的年度基线"},
            {"paramCode": "powerSharePct", "paramName": "电力能耗占比", "category": "核心指标", "dataType": "number", "unit": "%", "required": True, "source": "折标结构核算", "rangeOrEnum": "40.0 ~ 90.0%", "description": "电力在全厂折标综合能耗中的比重"},
            {"paramCode": "steamSharePct", "paramName": "蒸汽能耗占比", "category": "核心指标", "dataType": "number", "unit": "%", "required": True, "source": "折标结构核算", "rangeOrEnum": "5.0 ~ 40.0%", "description": "外购蒸汽在折标能耗中的比重"},
            {"paramCode": "gasSharePct", "paramName": "天然气能耗占比", "category": "核心指标", "dataType": "number", "unit": "%", "required": True, "source": "折标结构核算", "rangeOrEnum": "1.0 ~ 20.0%", "description": "天然气折标比重"},
            {"paramCode": "waterTotalTons", "paramName": "全厂总用水量", "category": "核心指标", "dataType": "number", "unit": "t", "required": True, "source": "水表累计", "rangeOrEnum": "0 ~ 500,000", "description": "工业与生活用水实物量"},
            {"paramCode": "lossRatePct", "paramName": "输配电管网损失率", "category": "衍生计算", "dataType": "number", "unit": "%", "required": True, "source": "总分表差值对账", "rangeOrEnum": "1.0 ~ 10.0%", "description": "总表计量与二级分表汇总差额比率"}
        ],
        "dataSources": [
            {"medium": "全厂8大介质表计底数", "sourceType": "SCADA 数据库明细汇总", "protocol": "数据库只读视图", "device": "全厂分项计量表计集群 (400+ 测点)", "tagExample": "DWD_ENERGY_MEDIUM_MONTHLY", "frequency": "月度汇总", "securityLevel": "L1 (内部级)"},
            {"medium": "能流管网输配拓扑", "sourceType": "系统供用能单线图元数据", "protocol": "JSON 拓扑结构", "device": "配电一次系统图 & 供汽管网图", "tagExample": "SANKEY_PIPELINE_NODES", "frequency": "配置维护", "securityLevel": "L2 (工作秘密)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "桑基图节点能量守恒校验公式",
                "mathExpression": r"\sum E_{input\_k} = \sum E_{output\_k} + E_{loss\_k} \quad (\text{误差容限 } \le 3\%)",
                "variables": [
                    {"name": "E_{input_k}", "desc": "第 k 级节点流入能量总量 (折标煤)", "unit": "tce"},
                    {"name": "E_{output_k}", "desc": "第 k 级节点分流至下一级支路能量", "unit": "tce"},
                    {"name": "E_{loss_k}", "desc": "变压器铜铁损或管道热阻损失能量", "unit": "tce"}
                ],
                "logicDescription": "保证能流从一次购入端流向车间工序端时物理能量守恒，差额自动归集为管网损耗。",
                "boundaryRule": "若某支路损耗率超过 8%，系统自动标注红框警示可能存在表计故障或蒸汽泄漏。"
            }
        ],
        "calculationLogic": "8 大介质标准色：总用电 #2C7CFF、市电 #41C0FF、绿电 #00D492、水 #10C4CE、天然气 #FF6536、蒸汽 #FFBA00、油 #8E73ED、液氮 #4F39F6。彻底消灭紫色蒸汽等旧色值。",
        "dtoSchema": """interface EnergyStructureDTO {
  orgUnitId: number;
  period: string;
  totalTce: number;
  mediumShares: { medium: string; tce: number; sharePct: number; color: string }[];
  sankeyData: {
    nodes: { name: string; category: string }[];
    links: { source: string; target: string; value: number }[];
  };
}""",
        "frontendSpecs": "- 严格执行 8 大能源介质官方色彩字典；\n- 彻底清除历史遗留的`{isGroupLevel && <span>当前选中分析项...</span>}`过程联动标签；\n- 44px 工业高密表格。",
        "backendSpecs": "- 接口：`GET /api/v1/zero-carbon/energy/structure`\n- 桑基图数据使用有向无环图 (DAG) 算法递归遍历生成。",
        "qaTestSpecs": "- 能流守恒测试: 验证桑基图流入流出差额与管网损耗严格闭环；\n- 介质色值测试: 验证外购蒸汽严格为金色 #FFBA00，天然气为橙红 #FF6536。"
    },

    # 8. 能源成本分析
    {
        "id": "spec-energy-cost",
        "center": "零碳园区集控中心",
        "navGroup": "能耗能效分析",
        "pageName": "能源成本分析",
        "route": "/zero-carbon/energy/cost",
        "component": "components/energy/cost-view.tsx",
        "overview": "企业全品类能源费用支出核算与电价优化决策中枢。深入解构电费（电度电费、容量/需量基本电费、力调电费奖惩）、蒸汽费、燃气费与水费，通过直属经营单位层级下钻与南丁格尔玫瑰图，量化用电峰平谷错峰成本优化潜力。",
        "subModules": [
            {"name": "能源费用总额看板", "desc": "当期能源总费用 (万元)、电费支出、水气汽支出、万元产值能耗成本 (元/万元)。"},
            {"name": "电费三部制深度解构", "desc": "分时电度电费、基本电费 (按容量/需量核算最优性)、力率电费调整奖励/罚款。"},
            {"name": "能源介质成本玫瑰图", "desc": "南丁格尔玫瑰图直观展现电、水、气、汽费用权重比例。"},
            {"name": "分时电费优化潜力测算", "desc": "测算将 10% 尖峰电量转移至低谷时段可节省的直接电费金额。"},
            {"name": "车间级能源费用对账单", "desc": "44px 工业高密表格，按经营单位与车间明细列支各介质结算金额与同比。"}
        ],
        "parameters": [
            {"paramCode": "orgUnitId", "paramName": "经营单位ID", "category": "入参过滤", "dataType": "number", "unit": "-", "required": True, "source": "左侧树", "rangeOrEnum": "1 ~ 9999", "description": "查看的经营单位"},
            {"paramCode": "billingMonth", "paramName": "电费账单月份", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "月份选择器", "rangeOrEnum": "YYYY-MM", "description": "结算账期"},
            {"paramCode": "totalCostYuan", "paramName": "能源费用总额", "category": "核心指标", "dataType": "number", "unit": "万元", "required": True, "source": "财务结算汇总", "rangeOrEnum": "0 ~ 10,000", "description": "全厂各类能源采购与自发综合支出总额"},
            {"paramCode": "electricityCostYuan", "paramName": "总电费支出", "category": "核心指标", "dataType": "number", "unit": "万元", "required": True, "source": "供电局电费单", "rangeOrEnum": "0 ~ 8,000", "description": "含电度电费、基本电费与力调电费"},
            {"paramCode": "basicDemandCost", "paramName": "基本电费支出", "category": "业务明细", "dataType": "number", "unit": "万元", "required": True, "source": "变压器需量/容量合同", "rangeOrEnum": "0 ~ 1,000", "description": "大工业两部制电价的基本容量费或最大需量费"},
            {"paramCode": "powerFactorAward", "paramName": "力调电费奖惩额", "category": "业务明细", "dataType": "number", "unit": "万元", "required": True, "source": "功率因数考核换算", "rangeOrEnum": "-50.0 ~ +50.0", "description": "cosφ ≥ 0.90 奖励（负电费），< 0.90 惩罚追加"},
            {"paramCode": "costPerOutput", "paramName": "万元产值能源成本", "category": "衍生计算", "dataType": "number", "unit": "元/万元", "required": True, "source": "费用产值比", "rangeOrEnum": "50.0 ~ 2,000.0", "description": "每万元工业产值消耗的直接能源费用"},
            {"paramCode": "shiftSavingsPotential", "paramName": "错峰转移节电潜力", "category": "衍生计算", "dataType": "number", "unit": "万元/月", "required": True, "source": "优化测算模型", "rangeOrEnum": "0 ~ 200", "description": "执行移峰填谷生产调整后预期的月度节支空间"}
        ],
        "dataSources": [
            {"medium": "供电局正式电费账单", "sourceType": "财务发票与电力局营销系统直连", "protocol": "电子发票 PDF 解析 / 国网 API", "device": "国家电网 95598 营销计费系统", "tagExample": "INVOICE_STATE_GRID_BILL", "frequency": "每月出账一次", "securityLevel": "L3 (核心商密)"},
            {"medium": "车间分表分时计量", "sourceType": "厂内 SCADA 分时计费中间表", "protocol": "Modbus-TCP", "device": "车间进线多功能电能表", "tagExample": "MTR_POWER_SUB_BILL_FLAT", "frequency": "每日结存", "securityLevel": "L2 (工作秘密)"},
            {"medium": "当地阶梯电价与气价政策", "sourceType": "价格模型配置数据库", "protocol": "MySQL 字典表", "device": "`t_energy_tariff_config`", "tagExample": "TARIFF_PEAK_VALLEY_RATES", "frequency": "政府调价时更新", "securityLevel": "L1 (内部级)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "力调电费奖惩系数查表核算模型",
                "mathExpression": r"\text{Adjustment} = \text{TotalActiveCharge} \times \lambda(cos\phi) \quad (\text{考核基准 } cos\phi_{std} = 0.90)",
                "variables": [
                    {"name": r"cos\phi", "desc": "全厂月度加权平均功率因数 (有功电量与无功电量计算)", "unit": "-"},
                    {"name": r"\lambda", "desc": r"力调电费调整系数 (例如 cos\phi=0.95 奖励 -0.75%, cos\phi=0.85 惩罚 +2.5%)", "unit": "%"}
                ],
                "logicDescription": "激励厂区加装无功就地补偿装置，提高电网运行质量，降低无效损耗。",
                "boundaryRule": "无功电表反向倒送无功时，倒送量以 100% 计入无功绝对值参与考核，防止电容过补被罚。"
            },
            {
                "formulaName": "基本电费最优性申报比对 (容量 vs 需量)",
                "mathExpression": r"\text{Cost}_{cap} = C_{trans} \times P_{cap}, \quad \text{Cost}_{demand} = D_{max} \times P_{demand} \quad (\text{按需量核算门槛 } D_{max} \le 0.68 \times C_{trans})",
                "variables": [
                    {"name": "C_{trans}", "desc": "工厂全部受电变压器额定总容量", "unit": "kVA"},
                    {"name": "D_{max}", "desc": "统计期内 15 分钟滑窗最大需量有功功率", "unit": "kW"},
                    {"name": "P_{cap}, P_{demand}", "desc": "当地物价局核定的容量单价与需量单价", "unit": "元/kVA·月, 元/kW·月"}
                ],
                "logicDescription": "对比两种申报模式的费用支出，为集控中心管理员提供基本电费降本最优申报建议。",
                "boundaryRule": "若实际最大需量超过核定需量 105% 时，超出部分按 2 倍需量单价加罚，系统自动设置安全冗余告警。"
            }
        ],
        "calculationLogic": "能源成本全面对齐《UI页面修改 (2).pdf》规范，彻底替换掉旧版 Ant Design #1677ff 蓝，统一使用 #2C7CFF。",
        "dtoSchema": """interface EnergyCostDTO {
  orgUnitId: number;
  month: string;
  totalCostYuan: number;
  costBreakdown: {
    electricity: number;
    steam: number;
    gas: number;
    water: number;
  };
  powerDetails: {
    sharpCost: number;
    peakCost: number;
    flatCost: number;
    valleyCost: number;
    basicDemandCost: number;
    powerFactorAward: number;
  };
  optimizationAdvice: string;
}""",
        "frontendSpecs": "- 彻底移除卡片内部冗余的`当前选中分析项`过程提示标签；\n- 44px 工业高密表格；\n- 标准导出按钮 `<ExportButton />` (80x36px)。",
        "backendSpecs": "- 接口：`GET /api/v1/zero-carbon/energy/cost`\n- 电费敏感商密数据实行 L3 权限控制与脱敏展示。",
        "qaTestSpecs": "- 力调电费测试: 验证 cosφ=0.92 时正确计算奖励金额且符号为负；\n- 需量预警测试: 验证当瞬时负荷接近申报需量 95% 时触发超需量预警。"
    },

    # 9. 单位产品能耗
    {
        "id": "spec-energy-unit-product",
        "center": "零碳园区集控中心",
        "navGroup": "能耗能效分析",
        "pageName": "单位产品能耗",
        "route": "/zero-carbon/energy/unit-product",
        "component": "components/energy/unit-product-view.tsx",
        "overview": "特变电工高端制造装备（主变压器、箱式变电站、中高压电缆、特种电缆、开关柜等）单耗核算与工序穿透分析中枢。按产品订单与生产批次归集关键工序计量，非关键工序按容量加权分摊，严格对标国家先进能耗限额标准 (GB 31335 / GB 31336)，无对应产品单位显示单行干练结论 `暂无相关产品！`。",
        "subModules": [
            {"name": "产品大类与产品种类标准字典", "desc": "变压器产业（电力变压器/干式变压器/箱变）、电缆产业（超高压电缆/中低压电缆/特种控制线缆）。"},
            {"name": "型号级单耗核心 KPI", "desc": "当前产品单位综合能耗 (tce/万kVA 或 tce/km)、单位电耗 (kWh)、单位蒸汽耗 (t)、同比与标杆偏离度。"},
            {"name": "工序单耗穿透明细矩阵", "desc": "穿透绕线、铁芯叠装、气相干燥、总装试验等关键工序单耗占比与实测值。"},
            {"name": "产量与能耗相关性散点图", "desc": "判定产品规模效应，区分固定用能与变动用能。"},
            {"name": "空状态极简单行结论", "desc": "无产品生产单位（如智慧能源公司）仅输出单行纯文本 `暂无相关产品！`，彻底杜绝大段解释理由。"}
        ],
        "parameters": [
            {"paramCode": "productCategory", "paramName": "产品大类", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "字典选择器", "rangeOrEnum": "TRANSFORMER_MAIN | BOX_SUBSTATION | CABLE_HV | CABLE_SPECIAL | SWITCHGEAR", "description": "查询的产品工业大类"},
            {"paramCode": "productModel", "paramName": "具体产品型号", "category": "入参过滤", "dataType": "string", "unit": "-", "required": False, "source": "型号检索下拉", "rangeOrEnum": "S13-M-1000/10 | YJV22-8.7/15kV 等", "description": "精确到产品物料型号"},
            {"paramCode": "lotNumber", "paramName": "生产工单批次号", "category": "入参过滤", "dataType": "string", "unit": "-", "required": False, "source": "工单输入框", "rangeOrEnum": "WO-2026-XXXX", "description": "指定生产订单批次号"},
            {"paramCode": "unitProductTce", "paramName": "单位产品综合能耗", "category": "核心指标", "dataType": "number", "unit": "tce/万kVA 或 tce/km", "required": True, "source": "工序归集与分摊核算", "rangeOrEnum": "0.10 ~ 50.00", "description": "单型号综合折标能耗"},
            {"paramCode": "unitPowerKwh", "paramName": "单位产品综合电耗", "category": "核心指标", "dataType": "number", "unit": "kWh/万kVA 或 kWh/km", "required": True, "source": "电能归集", "rangeOrEnum": "100 ~ 50,000", "description": "生产该型号消耗的总电力"},
            {"paramCode": "unitSteamTon", "paramName": "单位产品蒸汽单耗", "category": "业务明细", "dataType": "number", "unit": "t/万kVA", "required": True, "source": "干燥工序蒸汽计量", "rangeOrEnum": "0.0 ~ 20.0", "description": "气相干燥等工序消耗蒸汽量"},
            {"paramCode": "nationalBenchmark", "paramName": "国家先进能耗限额", "category": "业务明细", "dataType": "number", "unit": "指标对应单位", "required": True, "source": "国标限额标准库", "rangeOrEnum": "0.10 ~ 40.00", "description": "GB 31335/GB 31336 先进标杆限额值"},
            {"paramCode": "benchmarkVariancePct", "paramName": "标杆偏离度", "category": "衍生计算", "dataType": "number", "unit": "%", "required": True, "source": "与国标限额比对", "rangeOrEnum": "-50.0% ~ +100.0%", "description": "负值代表优于国家先进标杆"}
        ],
        "dataSources": [
            {"medium": "SAP ERP 生产工单合格量", "sourceType": "SAP PP 模块完工确认", "protocol": "RFC 接口 / BAPI", "device": "SAP ERP 数据库 `AFPO` 完工入库表", "tagExample": "AFPO.WEMNG (入库合格数量)", "frequency": "工单入库即时", "securityLevel": "L3 (核心商密)"},
            {"medium": "工序专机电量计量", "sourceType": "车间工序多功能表 SCADA", "protocol": "Modbus-TCP", "device": "绕线机柜 / 干燥炉 / 试验站电表", "tagExample": "MTR_PROCESS_WINDING_EP", "frequency": "班次结算", "securityLevel": "L2 (工作秘密)"},
            {"medium": "车间公用设施分摊电量", "sourceType": "动力车间空压机与照明电表", "protocol": "Modbus-TCP", "device": "辅助车间干线智能表", "tagExample": "MTR_PUBLIC_COMPRESSOR_EP", "frequency": "月度汇总", "securityLevel": "L1 (内部级)"},
            {"medium": "国家能耗限额标准库", "sourceType": "系统行业标准字典", "protocol": "MySQL 字典表", "device": "`dim_benchmark_standard`", "tagExample": "GB_31335_2024_LIMIT", "frequency": "标准颁布更新", "securityLevel": "L0 (公开级)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "单型号产品能耗归集与公用分摊数学模型",
                "mathExpression": r"e_{product} = \frac{\sum_{j=1}^{m} E_{direct,j} + \sum_{p=1}^{k} (E_{public,p} \times \frac{C_{model} \times Q_{model}}{\sum (C_r \times Q_r)})}{Q_{model}}",
                "variables": [
                    {"name": "E_{direct,j}", "desc": "该型号各生产工序专用设备直接消耗能耗 (折标煤)", "unit": "tce"},
                    {"name": "E_{public,p}", "desc": "空压站、厂房通风照明、循环水泵等公共辅助能耗", "unit": "tce"},
                    {"name": "C_{model}", "desc": "该产品型号额定设计容量或横截面积定额权重", "unit": "kVA 或 mm²"},
                    {"name": "Q_{model}", "desc": "该批次实际完成入库的合格产品总数量", "unit": "台套 或 km"}
                ],
                "logicDescription": "关键工序直接归集，辅助公用能耗按产量与容量权重科学分摊至单台产品。",
                "boundaryRule": "若当期没有该型号产品完工 (Q_model = 0)，系统精准判空显示单行纯文本：`暂无相关产品！`。"
            }
        ],
        "calculationLogic": "严格执行白名单判空规则，无工序或无产品单位严禁编造横向跨厂虚假对抗排名，仅呈现客观自身工况。",
        "dtoSchema": """interface UnitProductEnergyDTO {
  category: string;
  model: string;
  unitConsumptionTce: number;
  unitPowerKwh: number;
  unitSteamTon: number;
  nationalBenchmark: number;
  variancePct: number;
  processBreakdown: { processName: string; consumptionTce: number; sharePct: number }[];
}""",
        "frontendSpecs": "- 44px 工业高密表格；\n- 空状态严格单行结论 `暂无相关产品！`，消除冗余理由陈述；\n- 纯客观量化对比，移除主观评价标签。",
        "backendSpecs": "- 接口：`GET /api/v1/zero-carbon/energy/unit-product`\n- 支持按工单号精准追溯底层 4 类介质计量原始批次号。",
        "qaTestSpecs": "- 空状态测试: 切换至智慧能源公司，验证界面仅显示单行'暂无相关产品！'；\n- 分摊系数测试: 验证大中小不同容量变压器公用能耗分摊比例符合设计定额。"
    },

    # 10. 单位产值能耗
    {
        "id": "spec-energy-unit-output",
        "center": "零碳园区集控中心",
        "navGroup": "能耗能效分析",
        "pageName": "单位产值能耗",
        "route": "/zero-carbon/energy/unit-output",
        "component": "components/energy/unit-output-view.tsx",
        "overview": "企业宏观工业经济效益与综合能耗协调度对标中枢。集中分析万元工业总产值综合能耗、万元工业增加值能耗及万元产值碳排放强度，量化企业“增产不增能”、“绿色高质量发展”战略执行成效。",
        "subModules": [
            {"name": "万元产值综合能耗核心 KPI", "desc": "全厂万元产值综合能耗当前值 (tce/万元)、同比变动率、环比变动率及集团考核下达基准。"},
            {"name": "产值与能耗协同脱钩走势", "desc": "工业总产值曲线与综合能耗曲线双 Y 轴对比图，直观展现经济增长与能耗脱钩态势。"},
            {"name": "6大经营单位产值单耗横向对标", "desc": "沈变、衡变、新变、鲁缆、德缆、新缆万元产值单耗横向排比与改善幅度。"},
            {"name": "工业增加值能耗月度估算与年度汇算", "desc": "国家工信部与统计局口径工业增加值能耗核算模块。"},
            {"name": "产值单耗历史明细表", "desc": "44px 工业高密表格，按月展示各经营单位工业产值、综合能耗与折标单耗。"}
        ],
        "parameters": [
            {"paramCode": "orgUnitId", "paramName": "经营单位ID", "category": "入参过滤", "dataType": "number", "unit": "-", "required": True, "source": "左侧组织树", "rangeOrEnum": "1 ~ 9999", "description": "查看的经营单位"},
            {"paramCode": "year", "paramName": "核算年度", "category": "入参过滤", "dataType": "string", "unit": "-", "required": True, "source": "年度切换", "rangeOrEnum": "YYYY", "description": "核算年份"},
            {"paramCode": "outputValueTenThousand", "paramName": "工业总产值", "category": "核心指标", "dataType": "number", "unit": "万元", "required": True, "source": "财务经营日报", "rangeOrEnum": "0 ~ 500,000", "description": "企业生产的工业最终产品市场总价值"},
            {"paramCode": "addedValueTenThousand", "paramName": "工业增加值", "category": "核心指标", "dataType": "number", "unit": "万元", "required": True, "source": "统计局月报", "rangeOrEnum": "0 ~ 200,000", "description": "总产值扣减中间物料投入后的净增加值"},
            {"paramCode": "totalTce", "paramName": "综合折标能耗总量", "category": "核心指标", "dataType": "number", "unit": "tce", "required": True, "source": "全厂折标计量", "rangeOrEnum": "0 ~ 50,000", "description": "同期全部能源消费量"},
            {"paramCode": "energyPerOutputTce", "paramName": "万元产值综合能耗", "category": "核心指标", "dataType": "number", "unit": "tce/万元", "required": True, "source": "总能耗除以总产值", "rangeOrEnum": "0.010 ~ 5.000", "description": "核心产值单耗指标"},
            {"paramCode": "energyPerAddedValueTce", "paramName": "万元增加值综合能耗", "category": "核心指标", "dataType": "number", "unit": "tce/万元", "required": True, "source": "总能耗除以增加值", "rangeOrEnum": "0.020 ~ 10.000", "description": "国家节能减排法定统计口径指标"},
            {"paramCode": "decouplingIndex", "paramName": "能耗产值脱钩弹性系数", "category": "衍生计算", "dataType": "number", "unit": "-", "required": True, "source": "增长率比值", "rangeOrEnum": "-5.0 ~ +5.0", "description": "能耗增长率与产值增长率之比，< 0 为强脱钩"}
        ],
        "dataSources": [
            {"medium": "工业总产值报表", "sourceType": "股份公司经营管理日报系统", "protocol": "REST API 定时提取", "device": "集团财务经营管控中心", "tagExample": "ERP_MONTHLY_OUTPUT_VALUE", "frequency": "每月 1 日汇总", "securityLevel": "L3 (核心商密)"},
            {"medium": "全厂综合折标能耗", "sourceType": "集控中心能碳核算引擎", "protocol": "数据库汇总中间表", "device": "能耗数仓核心表 `dwd_total_energy_monthly`", "tagExample": "TOTAL_TCE_SUM", "frequency": "月度结存", "securityLevel": "L1 (内部级)"}
        ],
        "calcFormulas": [
            {
                "formulaName": "万元工业增加值综合能耗核算模型",
                "mathExpression": r"e_{nva} = \frac{E_{total\_tce}}{G_{added\_value}} \quad (\text{按现价计算})",
                "variables": [
                    {"name": "E_{total_tce}", "desc": "企业全厂报告期综合能耗消费量", "unit": "tce"},
                    {"name": "G_{added_value}", "desc": "报告期完成的企业工业增加值", "unit": "万元"}
                ],
                "logicDescription": "用于与省市节能目标责任制评价考核对账，客观反映单位增加值用能水平。",
                "boundaryRule": "若当期发生非正常停产且增加值出现负数时，指标强制告警并置为异常态，禁止计算负能耗。"
            }
        ],
        "calculationLogic": "严禁出现主观褒贬定性词汇，指标卡片纯粹展示量化时序对比与基准偏差量。",
        "dtoSchema": """interface UnitOutputDTO {
  orgUnitId: number;
  year: string;
  metrics: {
    month: string;
    outputValueTenThousand: number;
    totalEnergyTce: number;
    energyPerOutput: number;
    energyPerAddedValue: number;
    yoyRate: number;
  }[];
}""",
        "frontendSpecs": "- 44px 工业高密数据表格；\n- 纯客观量化时序对比，严禁任何定性评判词；\n- 标准 `<ExportButton />` 导出按钮 (80x36px)。",
        "backendSpecs": "- 接口：`GET /api/v1/zero-carbon/energy/unit-output`\n- 产值敏感数据执行细粒度行级权限过滤。",
        "qaTestSpecs": "- 异常产值测试: 模拟产值为 0 时，系统自动显示 '-' 且不抛出除零异常；\n- 脱钩系数测试: 验证产值上升而能耗下降时，弹性系数准确判定为强脱钩态。"
    }
]
print(f"Loaded {len(ZERO_CARBON_SPECS)} specs in part 1.")
