#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
特变电工能碳数字化双中心 · Web 开发文档与技术评审中心数据生成引擎 (强化完整版)
读取 38 篇开发手册、PRD 12 篇分卷规格、标准数据字典，并注入面向前端/后端/测试三大角色的全站页面与模块五维技术规格，
生成纯静态 TypeScript 模块 lib/docs-data.ts，实现毫秒级纯前端检索与双端同构。
"""

import os
import re
import json
from pathlib import Path

ROOT_DIR = Path(r"D:\Project\TJ-nengtan")
MANUALS_DIR = ROOT_DIR / "开发手册"
PRD_DIR = ROOT_DIR / "PRD"

OUTPUT_DARK = ROOT_DIR / "产品原型" / "lib" / "docs-data.ts"
OUTPUT_LIGHT = ROOT_DIR / "产品原型-旧" / "产品原型" / "lib" / "docs-data.ts"

def get_manual_category(num: int) -> str:
    if num <= 10:
        return "总体架构与工程底座"
    elif num <= 20:
        return "集中监管与核心指标"
    elif num <= 30:
        return "能耗分析与下钻模型"
    else:
        return "数据录入与组件设计"

def extract_headings(content: str):
    headings = []
    lines = content.splitlines()
    for line in lines:
        line_clean = line.strip()
        m2 = re.match(r'^##\s+(.+)$', line_clean)
        m3 = re.match(r'^###\s+(.+)$', line_clean)
        if m2:
            title = m2.group(1).strip()
            slug = re.sub(r'[^\w\u4e00-\u9fa5\-]+', '-', title).strip('-').lower()
            headings.append({"level": 2, "title": title, "id": slug or f"heading-{len(headings)}"})
        elif m3:
            title = m3.group(1).strip()
            slug = re.sub(r'[^\w\u4e00-\u9fa5\-]+', '-', title).strip('-').lower()
            headings.append({"level": 3, "title": title, "id": slug or f"heading-{len(headings)}"})
    return headings

def load_manuals():
    manuals = []
    if not MANUALS_DIR.exists():
        return manuals
    
    files = sorted([f for f in MANUALS_DIR.glob("*.md") if f.name != "README.md" and not f.name.startswith("工作日志")])
    for f in files:
        m = re.match(r'^(\d+)[_、](.+?)\.md$', f.name)
        if not m:
            continue
        num = int(m.group(1))
        title = m.group(2)
        try:
            content = f.read_text(encoding='utf-8')
        except Exception:
            content = f.read_text(encoding='gbk', errors='ignore')
        
        headings = extract_headings(content)
        category = get_manual_category(num)
        word_count = len(content)
        read_time_min = max(1, round(word_count / 500))
        
        summary = ""
        for line in content.splitlines():
            line_str = line.strip()
            if line_str and not line_str.startswith("#") and not line_str.startswith(">"):
                summary = line_str[:120]
                break
        
        manuals.append({
            "id": f"manual-{num:02d}",
            "no": num,
            "filename": f.name,
            "title": title,
            "category": category,
            "readTime": f"{read_time_min} 分钟",
            "wordCount": word_count,
            "summary": summary,
            "headings": headings[:15],
            "content": content
        })
    return manuals

def load_prd_docs():
    prd_docs = []
    if not PRD_DIR.exists():
        return prd_docs
    
    files = sorted([f for f in PRD_DIR.glob("PRD-*.md")])
    for f in files:
        m = re.match(r'^PRD-(\d+)[_、](.+?)\.md$', f.name)
        if not m:
            continue
        vol = int(m.group(1))
        title = m.group(2)
        try:
            content = f.read_text(encoding='utf-8')
        except Exception:
            content = f.read_text(encoding='gbk', errors='ignore')
        
        headings = extract_headings(content)
        word_count = len(content)
        read_time_min = max(1, round(word_count / 500))
        
        summary = ""
        for line in content.splitlines():
            line_str = line.strip()
            if line_str and not line_str.startswith("#") and not line_str.startswith(">"):
                summary = line_str[:120]
                break
        
        prd_docs.append({
            "id": f"prd-{vol:02d}",
            "vol": f"PRD-{vol:02d}",
            "filename": f.name,
            "title": title,
            "readTime": f"{read_time_min} 分钟",
            "wordCount": word_count,
            "summary": summary,
            "headings": headings[:15],
            "content": content
        })
    return prd_docs

def get_page_module_specs():
    """
    针对前端、后端、测试三大角色的全站页面与模块详细技术规格清单
    涵盖：集中监管 (4)、能效分析 (5)、零碳项目 (4)、统计报表 (3)、基础配置 (2)、大屏 (2)、碳足迹 (5)
    """
    return [
        {
            "id": "spec-screen-panoramic",
            "center": "零碳园区集控中心",
            "navGroup": "集控中心大屏",
            "pageName": "全景环幕大屏",
            "route": "/zero-carbon/screen",
            "component": "components/screen/panoramic-screen-view.tsx",
            "overview": "集团级高保真环幕全景监控大屏。面向领导层与企业来访展示，融合全国 6 大产业园区 3D 浮雕地图定位、全集团新能源出力、储能充放功率、直供绿电消纳比、累计减排量与能碳态势雷达。",
            "subModules": [
                {"name": "3D 立体中国浮雕地图", "desc": "基于 D3-Geo 经纬度投影与 CSS perspective 1200px 倾角变换，园区焦点呼吸脉冲光圈"},
                {"name": "集团级能碳核心 KPI", "desc": "总用电负荷 (kW)、自发自用绿电消纳量、折标综合能耗、实时碳排放强度"},
                {"name": "源网荷储平衡环形玫瑰图", "desc": "市电受电、分布式光伏、储能放电、工业负荷四端动态流向图"},
                {"name": "园区能效对标红黑榜", "desc": "各园区零碳综合评分与领跑标杆排名动态轮播"}
            ],
            "dtoSchema": """interface ScreenOverviewDTO {
  timestamp: string;
  groupMetrics: {
    totalPowerLoadKw: number;    // 瞬时总负荷
    todayGenKwh: number;         // 当日新能源发电
    todayGreenOffsetT: number;   // 当日减碳量
    greenPowerRatioPct: number;  // 绿电消纳占比
    annualTargetProgressPct: number; // 年度双碳目标完成度
  };
  parkPoints: {
    parkId: string;
    name: string;
    coords: [number, number];   // [经度, 纬度]
    status: 'online' | 'warning';
    powerKw: number;
    greenRatioPct: number;
  }[];
}""",
            "dataSources": [
                {
                    "medium": "全集团总负荷",
                    "sourceType": "各大园区 SCADA 调度总线汇聚",
                    "protocol": "MQTT 5.0 / Kafka 分布式流处理",
                    "device": "集团调度数据中心网关",
                    "tagExample": "GROUP_TOTAL_ACTIVE_POWER_KW",
                    "frequency": "5 秒推送一次"
                },
                {
                    "medium": "园区经纬度与信息",
                    "sourceType": "系统配置数据库",
                    "protocol": "静态拓扑加载",
                    "device": "MySQL `dim_park_info`",
                    "tagExample": "PARK_GIS_COORDS",
                    "frequency": "系统初始化加载"
                }
            ],
            "calculationLogic": """1. 集团全域绿电占比计算:
   Green_Ratio_Group = (∑ Q_green_park_i / ∑ Q_total_power_park_i) × 100%

2. 3D 地图透视投影矩阵变换:
   CSS transform: perspective(1200px) rotateX(25deg) rotateZ(-3deg)
   动态引线连接算法: 依据园区 SVG 节点中心相对坐标与外部 HUD 卡片锚点绘制贝塞尔曲线。""",
            "frontendSpecs": """- 采用航天级 HUD 金属切角 (clip-path: polygon) 与微发光背板，杜绝切片图片锯齿；
- 原生弹性适配 1080P、2K 及 48:9 / 32:9 超宽环幕大屏；
- 图表采用微透防眩科技蓝 `rgba(56, 189, 248, 0.08)`。""",
            "backendSpecs": """- 接口：`GET /api/v1/screen/overview`
- 高并发吞吐保护：单机 10,000 QPS 承载，启用 Redis 内存快照，TTL = 5s。""",
            "qaTestSpecs": """- 分辨率适配测试: 验证 1920x1080, 2560x1440 与 5760x1080 下文字与图表无重叠遮挡。
- 网络重连测试: 模拟断网 30s 恢复后，WebSocket/轮询机制能自动恢复数据刷新。"""
        },
        {
            "id": "spec-monitor-usage",
            "center": "零碳园区集控中心",
            "navGroup": "集中监管",
            "pageName": "用能在线监测",
            "route": "/zero-carbon/monitor/online/usage",
            "component": "components/online/usage-view.tsx",
            "overview": "全厂多能流高频在线监测中枢。集中呈现水、电、气、蒸汽 4 大能源介质的 24 小时出力量、负荷走势、分时尖峰平谷电量与折标综合能耗，支持向下穿透至园区、车间及关键重点用能设备。",
            "subModules": [
                {"name": "实时多能流总览卡片", "desc": "总用电量、市电量、绿电消纳量、工业蒸汽消耗量 4 大 KPI 主指标卡"},
                {"name": "24小时负荷时序走势", "desc": "多能源介质动态曲线，支持日/周/月粒度切换及微透防眩游标"},
                {"name": "分时电量 4 段构成", "desc": "尖、峰、平、谷电量柱状占比及综合电费加权分析"},
                {"name": "车间及重点设备能耗列表", "desc": "高密 44px 表格，按介质与车间逐项展示实物量与折标量"}
            ],
            "dtoSchema": """interface UsageQueryReq {
  parkId: string;
  unitId?: string;
  period: 'day' | 'month' | 'year';
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
            "dataSources": [
                {
                    "medium": "电力 (市电/绿电)",
                    "sourceType": "IoT / SCADA 自动化直采",
                    "protocol": "Modbus-TCP / IEC 60870-5-104",
                    "device": "配电房智能电力仪表 (安科瑞 APM810 / 施耐德 PM8000)",
                    "tagExample": "XJ_TRANS_P1_P_TOT (瞬时功率 kW), XJ_TRANS_P1_EP_IMP (累计有功度数 kWh)",
                    "frequency": "15 秒采集一次遥测，15 分钟存储一次冻结底度"
                },
                {
                    "medium": "工业蒸汽",
                    "sourceType": "SCADA 流量计算机",
                    "protocol": "OPC UA / 4-20mA + HART",
                    "device": "蒸汽总管温压补偿涡街流量计",
                    "tagExample": "XJ_STEAM_FLOW_MASS (蒸汽瞬时质量流量 t/h), XJ_STEAM_TOTAL_MASS (累计量 kg)",
                    "frequency": "1 分钟平均值"
                },
                {
                    "medium": "天然气",
                    "sourceType": "SCADA 燃气管网监控",
                    "protocol": "Modbus-RTU",
                    "device": "燃气气体罗茨流量计 (体积修正仪)",
                    "tagExample": "XJ_GAS_VOL_STD (标况流量 Nm³/h), XJ_GAS_VOL_CUM (累计消耗量 m³)",
                    "frequency": "5 分钟采集"
                },
                {
                    "medium": "水资源",
                    "sourceType": "IoT 物联网水表",
                    "protocol": "NB-IoT / M-Bus",
                    "device": "超声波大口径远传水表",
                    "tagExample": "XJ_WATER_M1_CUM (累计进水体积 t)",
                    "frequency": "1 小时上报"
                }
            ],
            "calculationLogic": """1. 综合能耗折标煤计算 (GB/T 2589-2020 当量值):
   E_kgce = Q_elec × 0.1229 + M_steam × 0.1286 + V_gas × 1.2143 + V_water × 0.0857
   - 电力当量折标系数: 0.1229 kgce/kWh
   - 工业蒸汽折标系数 (0.8MPa 饱和): 0.1286 kgce/kg (即 128.6 kgce/t)
   - 天然气折标系数: 1.2143 kgce/m³
   - 水资源折标系数: 0.0857 kgce/t

2. 绿电消纳率计算:
   R_green = (Q_green / Q_total_elec) × 100%

3. 异常防伪校验判定:
   - 表计倒走判定: 若 Reading_t < Reading_{t-1} 且无换表工单，系统拦截并发出告警。
   - 负荷超量程判定: P_instant > 1.25 × Rated_Capacity 判定为变比异常。""",
            "frontendSpecs": """- 组件：`UsageView` (`components/online/usage-view.tsx`)
- 8 大介质色标：总电 `#2C7CFF`、绿电 `#00D492`、蒸汽 `#FFBA00`、水 `#10C4CE`
- 44px 工业高密表格 (`h-[44px]`)，文本居中，数字 Mono 等宽字体
- 图表游标显式统一为微透科技蓝 `rgba(56, 189, 248, 0.08)`，严禁纯白实心块
- 空状态单行输出 `暂无相关记录！`""",
            "backendSpecs": """- 表结构：`dwd_iot_meter_reading_15m`, `ads_energy_usage_daily`
- 接口：`GET /api/v1/monitor/online/usage/realtime` (Redis TTL = 60s)
- 时序聚合：时序数据库降采样 Rollup，查询 90 天数据 < 300ms""",
            "qaTestSpecs": """- 停产车间所有介质为 0 时，综合能耗正常显示 0.00 kgce，无 NaN。
- 模拟表计底度归零倒走，系统产生“表计止度倒走异常”高危拦截并记录审计日志。
- 验收准则: 市电 1000 kWh + 蒸汽 500 kg 必须精确折标为 187.20 kgce。"""
        },
        {
            "id": "spec-monitor-indicator",
            "center": "零碳园区集控中心",
            "navGroup": "集中监管",
            "pageName": "指标管控",
            "route": "/zero-carbon/monitor/indicator",
            "component": "components/monitor/indicator-view.tsx",
            "overview": "能碳双中心指标治理核心。统一管理经营单位级前10项综合指标、5大标准单位产品指标及47项关键制造工序指标（共65项管控指标体系），支持 Mode A 总览看板与 Mode B 穿透详情内页切换。",
            "subModules": [
                {"name": "指标分类 Tabs", "desc": "经营单位综合指标、单位产品单耗指标、关键工序指标"},
                {"name": "指标监控卡片网格", "desc": "客观时序对比（环比、同比、基准偏差），严禁主观评判标签"},
                {"name": "Mode B 详情穿透抽屉", "desc": "定义公式、传感器数据路径、12个月趋势曲线与介质历史台账"},
                {"name": "权威工序白名单过滤", "desc": "沈变/新变等企业看自身工序，10家无工序单位单行判空"}
            ],
            "dtoSchema": """interface IndicatorCardDTO {
  code: string;
  name: string;
  category: 'group' | 'product' | 'process';
  unit: string;
  currentValue: number;
  targetValue: number;
  variancePct: number;
  yoyPct: number;
  momPct: number;
  status: 'normal' | 'exceed';
  sensorPath: string;
  formulaDesc: string;
}""",
            "dataSources": [
                {
                    "medium": "制造工序能耗",
                    "sourceType": "车间分项电能表与热量表 SCADA 直采",
                    "protocol": "Modbus-TCP",
                    "device": "车间动力配电柜导轨式多功能电表",
                    "tagExample": "LINE2_DRY_OVEN_EP (干燥炉电量), LINE2_DRY_STEAM (干燥炉蒸汽)",
                    "frequency": "每班次 (8小时) 结存"
                },
                {
                    "medium": "工序完工合格产量",
                    "sourceType": "MES 制造执行系统",
                    "protocol": "REST API / 数据库中间视图",
                    "device": "MES 生产过站报工终端 (Barcode / RFID 扫描)",
                    "tagExample": "MES_OP_FINISH_QTY (工序过站合格数量)",
                    "frequency": "工单完工实时过账"
                }
            ],
            "calculationLogic": """1. 工序单位能耗核算:
   e_process = (E_elec × 0.1229 + E_steam × 0.1286) / Q_finished_lot
   - 若合格产量 Q = 0，指标展示 “—” 并提示“无产出”，防除以零崩溃。

2. 权威工序白名单判空规则:
   依据《生产单位与涉及关键工序对应表(1).et》，沈变、衡变、新变、鲁缆下属智慧能源等 10 家无工序企业，工序标签页统一直接渲染单行:
   暂无相关工序！""",
            "frontendSpecs": """- 严禁出现“点击卡片联动下方图表”等显而易见的文字；
- 严禁出现主观评价文字（如“优良”、“落后”），以客观时序偏差自解释呈现；
- 激活态统一使用 `border-primary ring-2` 边框高亮，杜绝“已选中”标签；
- 表格严格 44px 行高。""",
            "backendSpecs": """- 接口：`GET /api/v1/indicators/list?category=process`
- 数据库表：`dim_indicator_def`, `dws_indicator_monthly_snapshot`""",
            "qaTestSpecs": """- 白名单判空校验: 切换至“沈变智慧能源”，工序指标栏必须精准输出单行“暂无相关工序！”，无报错。
- 除零测试: 工序合格产量为 0 时界面单耗不显示 Infinity / NaN。"""
        },
        {
            "id": "spec-energy-structure",
            "center": "零碳园区集控中心",
            "navGroup": "能耗能效分析",
            "pageName": "用能结构分析",
            "route": "/zero-carbon/energy/structure",
            "component": "components/energy/structure-view.tsx",
            "overview": "全厂多能流消费体量、比重结构及多时间维度历史同环比分析看板。支持按日、月、年粒度拆解电、蒸汽、天然气、水等能源介质的实物量与折标量占比，定位高耗能工段与介质异动。",
            "subModules": [
                {"name": "能源介质占比环形图", "desc": "8 大能源介质官方色彩编码环形图与防重叠碰撞保护"},
                {"name": "历年用能结构堆叠柱状图", "desc": "时序柱状堆叠展示各介质折标煤逐月走势与微透游标"},
                {"name": "用能结构同环比台账", "desc": "44px 工业表格，各介质消耗量、折标量、占比、同比与环比增减额"}
            ],
            "dtoSchema": """interface EnergyStructureDTO {
  period: string;
  totalKgce: number;
  breakdown: {
    medium: string;
    physicalVal: number;
    unit: string;
    coefKgce: number;
    totalKgce: number;
    sharePct: number;
    yoyPct: number;
  }[];
}""",
            "dataSources": [
                {
                    "medium": "全厂各介质总表",
                    "sourceType": "SCADA 计量总线日结快照",
                    "protocol": "数据库时序卷积",
                    "device": "企业总降与能源计量中心",
                    "tagExample": "DWD_DAILY_ENERGY_AGG",
                    "frequency": "每日凌晨 01:00 汇总"
                }
            ],
            "calculationLogic": """1. 介质占比计算公式:
   Share_i = (E_kgce_i / ∑ E_kgce_k) × 100%
   所有介质 Share_i 求和严格等于 100.00% (末位精度平差)。""",
            "frontendSpecs": """- 环形图严格遵循 8 大能源介质官方颜色；
- 表格严格 44px 行高；
- 导出按钮统一 80px × 36px。""",
            "backendSpecs": """- 接口：`GET /api/v1/energy/structure/summary`
- 表：`ads_energy_structure_monthly`""",
            "qaTestSpecs": """- 占比求和精度校验: 验证所有介质占比之和严格为 100.0%，无 99.9% 浮点截断。"""
        },
        {
            "id": "spec-energy-cost",
            "center": "零碳园区集控中心",
            "navGroup": "能耗能效分析",
            "pageName": "能源成本分析",
            "route": "/zero-carbon/energy/cost",
            "component": "components/energy/cost-view.tsx",
            "overview": "企业与车间用能财务成本洞察看板。将水电气实物量结合当地供电局分时电价、天然气价格及蒸汽热力单价，测算电费、水费、气费支出占比与横向单位对比，赋能避峰填谷降本。",
            "subModules": [
                {"name": "能源总成本看板", "desc": "月度总能耗费用(万元)、电费支出占比、分时尖峰平谷电费分布"},
                {"name": "经营单位成本下钻", "desc": "南丁格尔玫瑰图直观展示 21 家工厂能源成本体量分布"},
                {"name": "用能成本明细核算表", "desc": "44px 表格，市电费、绿电附加费、基本电费、容需量电费"}
            ],
            "dtoSchema": """interface EnergyCostDTO {
  unitId: string;
  totalCostWan: number;
  powerCostWan: number;
  steamCostWan: number;
  gasCostWan: number;
  waterCostWan: number;
  touCost: { sharpWan: number; peakWan: number; flatWan: number; valleyWan: number };
}""",
            "dataSources": [
                {
                    "medium": "电网账单与费价模型",
                    "sourceType": "供电局电费出账单 / 本地费价配置表",
                    "protocol": "系统配置与人工填报校准",
                    "device": "MySQL `dim_tariff_price`",
                    "tagExample": "TARIFF_SHARP_PRICE_PER_KWH",
                    "frequency": "每月出账后校准"
                }
            ],
            "calculationLogic": """1. 分时综合电费计算:
   Cost_elec = Q_sharp × P_sharp + Q_peak × P_peak + Q_flat × P_flat + Q_valley × P_valley + Capacity_Fee""",
            "frontendSpecs": """- 南丁格尔玫瑰图注入文字防重叠算法；
- 货币单位明确为 万元 或 元；
- 44px 表格规范。""",
            "backendSpecs": """- 接口：`GET /api/v1/energy/cost/summary`
- 表：`ads_energy_cost_monthly`""",
            "qaTestSpecs": """- 费价阶梯变更测试: 验证分时费价调整后历史月度账单保持不变 (不可篡改隔离)。"""
        },
        {
            "id": "spec-energy-unit-product",
            "center": "零碳园区集控中心",
            "navGroup": "能耗能效分析",
            "pageName": "单位产品能耗分析",
            "route": "/zero-carbon/energy/unit-product",
            "component": "components/energy/unit-product-view.tsx",
            "overview": "综合能耗与生产产量动态联动分析中枢。支持按产品大类（变压器、线缆、开关柜等）横向对标与纵向趋势穿透，按 8 大能源介质拆解单耗构成，识别高单耗工艺环节与异常批次。",
            "subModules": [
                {"name": "综合单耗趋势对比", "desc": "折线柱状双轴图：综合能耗(kgce) vs 产品合格产量(台/km)"},
                {"name": "产品单耗横向对标表", "desc": "44px 高密表格，同品类不同规格单耗对比与同环比变化"},
                {"name": "工序单耗介质拆解", "desc": "电耗(kWh/台)、蒸汽耗(kg/台)、气耗(m³/台)拆分"}
            ],
            "dtoSchema": """interface UnitProductRowDTO {
  id: string;
  productCategory: '变压器' | '线缆' | '开关成套';
  productModel: string;
  unitName: string;
  outputQty: number;
  totalEnergyKgce: number;
  unitEnergyKgce: number;
  unitPowerKwh: number;
  unitSteamKg: number;
  yoyPct: number;
  benchmarkKgce: number;
}""",
            "dataSources": [
                {
                    "medium": "能耗分子 (Energy)",
                    "sourceType": "SCADA 物联电能表 / 热量表按产品批次分摊",
                    "protocol": "Modbus-TCP",
                    "device": "产线动力电表",
                    "tagExample": "LINE1_ENERGY_LOT_ACC",
                    "frequency": "每工单批次结存"
                },
                {
                    "medium": "产量分母 (Output)",
                    "sourceType": "ERP 生产订单完工入库单 (SAP / 用友 NC)",
                    "protocol": "RFC / REST API",
                    "device": "ERP 物料移动 101 入库凭证",
                    "tagExample": "MBLNR (凭证号), MENGE (入库合格数量)",
                    "frequency": "每日日结同步"
                }
            ],
            "calculationLogic": """1. 单位产品综合能耗公式:
   e = E_total_kgce / M_output
   - 变压器: kgce/台 或 kgce/kVA
   - 线缆: kgce/km 或 kgce/吨

2. 动力能耗加权分摊:
   W_i = (T_i × Cap_i) / ∑ (T_k × Cap_k)
   E_allocated_i = E_shared × W_i""",
            "frontendSpecs": """- 导出按钮统一固定为 80px × 36px，背景 `#2C7CFF`；
- 表格严格 44px 行高；
- 变压器黄标、线缆绿标，客观区分。""",
            "backendSpecs": """- 数据库表：`dws_product_unit_energy_monthly`
- 定时任务：每日 02:00 同步 ERP 完工数据并卷积 SCADA 能耗""",
            "qaTestSpecs": """- 变压器显示 kgce/台，线缆显示 kgce/km 自适应切换。
- 分摊权重和严格 100% 精度校验。"""
        },
        {
            "id": "spec-energy-unit-output",
            "center": "零碳园区集控中心",
            "navGroup": "能耗能效分析",
            "pageName": "单位产值能耗分析",
            "route": "/zero-carbon/energy/unit-output",
            "component": "components/energy/unit-output-view.tsx",
            "overview": "综合能耗与工业总产值（万元）宏观效益联动分析。测算集团与各经营单位万元产值综合能耗、万元产值电耗走势，支撑能耗双控与绿色高质量发展评价。",
            "subModules": [
                {"name": "万元产值能耗趋势图", "desc": "折标能耗 vs 工业产值双轴走势，支持年/季粒度对比"},
                {"name": "万元产值单耗横向对标表", "desc": "44px 表格，21家核心工厂万元产值综合能耗对标与同环比"}
            ],
            "dtoSchema": """interface UnitOutputDTO {
  unitId: string;
  outputValueWan: number;        // 工业总产值 (万元)
  totalEnergyKgce: number;       // 综合能耗折标 (kgce)
  energyPerWanKgce: number;      // 万元产值综合能耗 (kgce/万元)
  powerPerWanKwh: number;        // 万元产值电耗 (kWh/万元)
  yoyPct: number;
}""",
            "dataSources": [
                {
                    "medium": "工业总产值",
                    "sourceType": "财务 ERP 财务总账 / 统计报表填报",
                    "protocol": "每月 5 日前结账导入",
                    "device": "财务管理数据库",
                    "tagExample": "FIN_OUTPUT_VALUE_MONTHLY",
                    "frequency": "按月归档"
                }
            ],
            "calculationLogic": """1. 万元产值综合能耗公式:
   Energy_per_output = Total_Energy_kgce / Output_Value_Wan (kgce/万元)""",
            "frontendSpecs": """- 表格 44px 行高；
- 导出按钮 80px × 36px；
- 纯数据呈现，严禁出现说教定性词。""",
            "backendSpecs": """- 表：`ads_unit_output_energy_monthly`""",
            "qaTestSpecs": """- 新建在建厂产值为 0 时显示 “—”，无除零异常。"""
        },
        {
            "id": "spec-energy-benchmark",
            "center": "零碳园区集控中心",
            "navGroup": "能耗能效分析",
            "pageName": "能效对标管理",
            "route": "/zero-carbon/energy/benchmark",
            "component": "components/energy/benchmark-view.tsx",
            "overview": "能效领跑与基准横向对标引擎。可按产品单耗、绿电占比、碳排放强度设定集团内部标杆值或国家能效领跑者标准，自动计算偏差幅度，支持自定义对标维度与时序对比。",
            "subModules": [
                {"name": "对标配置与基准管理", "desc": "指标选择、对标范围 (集团内/行业领跑)、标杆值设定"},
                {"name": "对标偏差散点与雷达图", "desc": "各经营单位与标杆线相对位置散点图"},
                {"name": "能效对标矩阵表", "desc": "44px 表格，当前值、标杆值、偏差量、偏差百分比与时序排名"}
            ],
            "dtoSchema": """interface BenchmarkRowDTO {
  unitId: string;
  metricCode: string;
  metricName: string;
  currentVal: number;
  benchmarkVal: number;
  varianceVal: number;
  variancePct: number;
  rank: number;
}""",
            "dataSources": [
                {
                    "medium": "行业能效领跑标准",
                    "sourceType": "国家发展改革委重点行业能效标杆水平标准",
                    "protocol": "系统参数维护",
                    "device": "MySQL `dim_benchmark_standard`",
                    "tagExample": "STD_BENCHMARK_LEVEL",
                    "frequency": "年度更新"
                }
            ],
            "calculationLogic": """1. 标杆偏差计算:
   Variance_Pct = ((Current_Val - Benchmark_Val) / Benchmark_Val) × 100%
   - 耗能类指标 (如单耗): 负偏差为节能提升，正偏差为超标；
   - 效益类指标 (如绿电占比): 正偏差为领跑提升。""",
            "frontendSpecs": """- 严格遵循客观中立原则：禁止出现“达标模范”、“落后淘汰”等定性评判词句，统一以偏差数值呈现；
- 44px 高密表格。""",
            "backendSpecs": """- 接口：`GET /api/v1/energy/benchmark/list`""",
            "qaTestSpecs": """- 标杆值正负偏差方向性测试: 耗能指标低于标杆显示绿色降箭头，高于显示红色升箭头。"""
        },
        {
            "id": "spec-project-benefit",
            "center": "零碳园区集控中心",
            "navGroup": "零碳项目评估",
            "pageName": "节能效益评估",
            "route": "/zero-carbon/project/benefit",
            "component": "components/project/benefit-view.tsx",
            "overview": "节能改造与新能源项目投资效益量化跟踪中心。涵盖光伏发电、储能充放、余热回收、高效空调与变频技改项目，精确测算累计节电量、标准煤节约量、节约费用(元)与碳减排量(tCO2e)。",
            "subModules": [
                {"name": "项目效益核心指标", "desc": "累计节能费用(万元)、节约折标煤(tce)、碳减排总量(tCO2e)、平均投资回收期"},
                {"name": "项目分类效益柱状图", "desc": "光伏/储能/余热/空调技改分项收益对比"},
                {"name": "工程项目台账高密表", "desc": "44px 表格，项目编号、建设地点、投运时间、节能量、节费及投资回报率"}
            ],
            "dtoSchema": """interface ProjectBenefitDTO {
  id: string;
  projectName: string;
  type: '光伏' | '储能' | '热泵余热' | '变频空调';
  commissionDate: string;
  investmentWan: number;
  cumEnergySavedTce: number;
  cumCostSavedWan: number;
  cumCarbonReducedT: number;
  paybackYears: number;
}""",
            "dataSources": [
                {
                    "medium": "光伏/储能实际出力",
                    "sourceType": "微电网 EMS 能量管理系统",
                    "protocol": "IEC 61850 / Modbus",
                    "device": "光伏并网双向电表 / 储能 PCS",
                    "tagExample": "PV_GEN_TOTAL_KWH, ESS_DISCHARGE_KWH",
                    "frequency": "15 分钟"
                },
                {
                    "medium": "节能技改基准线 (Baseline)",
                    "sourceType": "项目技改档案与第三方节能量审核报告",
                    "protocol": "档案手工录入校准",
                    "device": "档案管理数据库",
                    "tagExample": "BASE_CONSUMPTION_HOURLY",
                    "frequency": "立项固化"
                }
            ],
            "calculationLogic": """1. 光伏节费与碳减排:
   Cost_Saved = Q_solar_self × P_grid + Q_solar_feed × P_feed
   Carbon_Reduced = Q_solar_total × 0.5366 tCO2/MWh

2. 动态投资回收期:
   Payback_Period = Total_Investment / Annual_Net_Cost_Saved""",
            "frontendSpecs": """- 严格遵循反冗余设计：下方已有 Tabs，上方卡片不重复放切换按钮；
- 44px 表格规范；
- 严禁出现“表现优异”等评语。""",
            "backendSpecs": """- 接口：`GET /api/v1/projects/benefit/summary`""",
            "qaTestSpecs": """- 节费为 0 时，投资回收期显示 “—”，无除零报错。"""
        },
        {
            "id": "spec-project-self",
            "center": "零碳园区集控中心",
            "navGroup": "零碳项目评估",
            "pageName": "零碳工厂自评估",
            "route": "/zero-carbon/project/self",
            "component": "components/project/self-assessment-view.tsx",
            "overview": "依据国家《零碳工厂评价规范》开展的多维自评估与成熟度打分引擎。涵盖基础设施、能源利用、节能减排、温室气体管控与数字化管理 5 大维度，在线勾选考核项并自动测算零碳综合得分。",
            "subModules": [
                {"name": "零碳成熟度五维雷达图", "desc": "基础设施、能源利用、工艺能效、碳排抵扣、数字化体系得分"},
                {"name": "自评估核验清单工作台", "desc": "44px 表格，指标项、满分权重、评估要求、自评得分、佐证附件上传"},
                {"name": "零碳评级证书预览", "desc": "依据得分生成一星/二星/三星/四星/卓越级零碳工厂证书草稿"}
            ],
            "dtoSchema": """interface SelfAssessmentDTO {
  factoryId: string;
  totalScore: number;            // 综合得分 (45-99分)
  levelName: string;             // 评定等级
  dimensions: {
    code: string;
    name: string;
    maxScore: number;
    scoredVal: number;
  }[];
}""",
            "dataSources": [
                {
                    "medium": "自评估标准库",
                    "sourceType": "国家标准 / 中国节能协会零碳工厂标准",
                    "protocol": "数据库预置字典",
                    "device": "MySQL `dim_zero_carbon_standard`",
                    "tagExample": "STD_WEIGHT_SCORE",
                    "frequency": "版本迭代"
                }
            ],
            "calculationLogic": """1. 零碳综合评价截断加权算法:
   Score = clamp(45, 99, (1/K) × ∑ min(1.15, Achievement_k) × 86)
   - 截断上限 min(1.15, ·): 防止单项绿电极优掩盖工艺能效短板；
   - 红黑榜阈值: ≥90 分 (绿标), 78~89 分 (达标), <78 分 (管理督办)。""",
            "frontendSpecs": """- 雷达图与得分仪表盘配合展示；
- 44px 表格，支持在线点击打分与附件查看；
- 导出评估报告 80px × 36px。""",
            "backendSpecs": """- 接口：`POST /api/v1/projects/self-assessment/submit`""",
            "qaTestSpecs": """- 极端单项满分溢出测试: 验证单项得分超过 150% 时是否被截断在 1.15 倍，综合总分不超过 99 分。"""
        },
        {
            "id": "spec-config-entry",
            "center": "零碳园区集控中心",
            "navGroup": "基础管理",
            "pageName": "工厂能碳数据录入",
            "route": "/zero-carbon/config/entry",
            "component": "components/data-entry/data-entry-view.tsx",
            "overview": "基层工厂水电气发票止度与产量人工离线填报减负工作台。支持 11 大类工业产品柔性配置、上月止度自动带出、差值自动计算、互感器倍率核验、表计倒走防伪拦截及 ±15% 环比波动智能预警。",
            "subModules": [
                {"name": "工厂与报告期选择器", "desc": "200px 下拉框，选择经营单位、产线与填报月份"},
                {"name": "能源消耗填报表", "desc": "44px 表格，上月底度(只读带出)、本月止度、倍率、本月用量、差值防伪"},
                {"name": "合格产量与产值录入", "desc": "产品型号、产量、计量单位(台/km)、产值(万元)"},
                {"name": "申报历史与审计溯源", "desc": "填报历史台账、修改留痕与不可删除审计日志"}
            ],
            "dtoSchema": """interface DataEntrySubmitReq {
  factoryId: string;
  periodMonth: string;           // YYYY-MM
  meterEntries: {
    meterTag: string;
    prevReading: number;         // 上月止度 (后端强校验)
    currReading: number;         // 本月止度
    multiplier: number;          // 互感器倍率
    consumption: number;         // (curr - prev) * mult
    reasonNote?: string;         // 波动预警填报原因
  }[];
  productionEntries: {
    productModel: string;
    qty: number;
    unit: string;
    outputWan: number;
  }[];
}""",
            "dataSources": [
                {
                    "medium": "上月历史止度底数",
                    "sourceType": "系统历史月度申报归档表 (只读自动带出)",
                    "protocol": "数据库主键锁定",
                    "device": "MySQL `dwd_manual_meter_entry`",
                    "tagExample": "PREV_MONTH_CONFIRMED_READING",
                    "frequency": "申报时带出"
                }
            ],
            "calculationLogic": """1. 本月实物用量自动联动计算:
   Consumption = (currReading - prevReading) × multiplier

2. 拦截与预警规则:
   - 表计倒走拦截: currReading < prevReading 且无“换表证明”勾选，前端即刻拦截禁止提交！
   - 环比波动预警: |Consumption - Last_Month| / Last_Month > 15%，触发琥珀色提示并强制要求录入原因。""",
            "frontendSpecs": """- 输入框统一推荐 200px × 36px，圆角 8px，纯白底描边 `#E2E8F0`；
- 表格严格 44px 行高；
- 提交按钮 `#2C7CFF`，白字。""",
            "backendSpecs": """- 强校验：后端必须重新拉取上月止度进行防篡改二次校验；
- 写入 `sys_audit_log` 审计日志。""",
            "qaTestSpecs": """- 防伪倒走测试: 输入本月止度小于上月，系统弹窗拦截并锁定提交按钮。
- 环比波动测试: 输入偏差 > 15% 时弹出原因输入框，未填原因不能提交。"""
        },
        {
            "id": "spec-design-system",
            "center": "零碳园区集控中心",
            "navGroup": "基础管理",
            "pageName": "组件规范库",
            "route": "/design-system",
            "component": "components/design-system/showcase-view.tsx",
            "overview": "特变电工集控中心工业级标准组件库交互画廊。全景呈现 8 大介质 Design Tokens、4 段分时色卡、Panel 容器、KpiCard、44px 高密表格、80x36px 导出按钮、胶囊 Tabs、微透防眩图表及一键复制代码模板。",
            "subModules": [
                {"name": "Design Tokens 调色盘", "desc": "8 大介质色标与 4 段 TOU 分时色卡，点击一键复制 Hex 色值"},
                {"name": "原子控件展区", "desc": "Panel, KpiCard, DataTable (44px), ExportButton, Tabs, SearchInput (200x36)"},
                {"name": "业务复合组件展区", "desc": "StandardOrgTree (260px/30px), EmptyState (单行判空), BenchmarkIndicator"},
                {"name": "Code Snippets 复制代码模板", "desc": "标准 JSX 代码范例，带一键复制到剪贴板功能"}
            ],
            "dtoSchema": """// 组件库全量导出声明
import {
  Panel, PanelTitle, KpiCard, DataTable, ExportButton, Tabs,
  SearchInput, StandardSelect, EmptyState,
  ENERGY_MEDIA_TOKENS, TOU_PERIOD_TOKENS, LAYOUT_TOKENS
} from '@/components/design-system';""",
            "dataSources": [
                {
                    "medium": "设计系统 Tokens",
                    "sourceType": "代码工程内嵌规范",
                    "protocol": "TypeScript 常量",
                    "device": "前端模块 `@/components/design-system/tokens.ts`",
                    "tagExample": "ENERGY_MEDIA_TOKENS",
                    "frequency": "编译期绑定"
                }
            ],
            "calculationLogic": """遵循《UI页面修改 (2).pdf》权威设计标尺:
- 背景色: #F3F7FB (浅色) / #050C1B (深色科技蓝)
- 表格行高: 44px 强制
- 侧边栏: 260px
- 导出按钮: 80px × 36px
- 输入框: 200px × 36px
- 圆角: 8px, 间距: 24px""",
            "frontendSpecs": """- 双端同构，支持在 3000 (暗黑) 与 3001 (浅色) 下交互预览；
- 代码块带一键复制代码功能；
- 严格遵循客观中立与反冗余设计准则。""",
            "backendSpecs": """- 纯前端静态视图，0 数据库依赖。""",
            "qaTestSpecs": """- 响应式检查: 验证画廊在 1280px 到 2560px 分辨率下排版整齐无错位。"""
        },
        {
            "id": "spec-footprint-dashboard",
            "center": "产品碳足迹集采中心",
            "navGroup": "对外示范窗口",
            "pageName": "集团驾驶舱",
            "route": "/carbon-footprint/dashboard",
            "component": "components/carbon/dashboard-view.tsx",
            "overview": "特变电工产品碳足迹集团宏观决策与对外示范驾驶舱。集中呈现各园区产品碳足迹分布热力图、实景库订单总量、认证产品数、行业标准与海外出口 CBAM 总体合规态势。",
            "subModules": [
                {"name": "碳足迹宏观 KPI 看板", "desc": "核算产品数、实景订单数、累计减碳量、平均单位容量碳强度"},
                {"name": "产业碳足迹热力地图", "desc": "全国制造基地产品碳足迹均值热力分布与下钻联动"},
                {"name": "各产品大类碳足迹构成", "desc": "变压器、线缆、开关成套产品原材料/运输/制造三阶段碳排占比"},
                {"name": "行业荣誉与认证轮播", "desc": "国家级绿色供应链、ISO 14067 权威认证、碳中和示范标杆"}
            ],
            "dtoSchema": """interface FootprintDashboardDTO {
  totalCertifiedProducts: number;
  totalOrdersCount: number;
  avgIntensityKgCo2ePerKva: number;
  totalReductionT: number;
  parkHeatmaps: { parkId: string; intensity: number; status: string }[];
}""",
            "dataSources": [
                {
                    "medium": "实景库订单汇总",
                    "sourceType": "产品碳足迹实景数据库 Rollup",
                    "protocol": "数据库只读聚合",
                    "device": "MySQL `ads_pcf_dashboard_summary`",
                    "tagExample": "DWD_PCF_ORDER_COUNT",
                    "frequency": "小时级同步"
                }
            ],
            "calculationLogic": """1. 集团加权平均碳强度:
   Avg_Intensity = ∑ (PCF_order_i) / ∑ (Capacity_kVA_i)""",
            "frontendSpecs": """- 沉浸式科技蓝背景；
- 44px 高密表格；
- 游标微透科技蓝 `rgba(56, 189, 248, 0.08)`。""",
            "backendSpecs": """- 接口：`GET /api/v1/footprint/dashboard/summary` (Redis TTL = 120s)""",
            "qaTestSpecs": """- 园区点击下钻测试: 点击地图上“沈变”，平滑下钻至沈变产品碳足迹明细列表。"""
        },
        {
            "id": "spec-footprint-accounting",
            "center": "产品碳足迹集采中心",
            "navGroup": "实景数据库",
            "pageName": "碳足迹核算与工序穿透",
            "route": "/carbon-footprint/database/accounting",
            "component": "components/database/accounting-view.tsx",
            "overview": "特变电工产品碳足迹实景溯源与认证核心。依托实景数据库实现原材料-制造-运输-处置全生命周期 (LCA) 碳核算，支持由订单下钻至工序级能耗并自动化生成 ISO 14067 碳足迹报告与防伪二维码。",
            "subModules": [
                {"name": "LCA 四阶段瀑布分解图", "desc": "原材料获取(Cradle)、厂际运输、工厂生产制造(Gate)、废弃处置各阶段碳排放占比"},
                {"name": "绿电消纳减排测算模型", "desc": "展示绿电接入后相较于纯市电基准的碳减排量与减碳幅度(89.4%)"},
                {"name": "工序级能耗穿透表", "desc": "44px 表格，绕线、干燥、固化、总装、试验分项能耗与折标碳排"},
                {"name": "ISO 14067 认证报告导出", "desc": "标准 80x36px 导出按钮，一键生成带防伪二维码的 PDF 报告"}
            ],
            "dtoSchema": """interface ProductLcaAccountingDTO {
  orderId: string;
  productModel: string;
  productionFacility: string;
  boundary: 'Cradle-to-Gate';
  totalCarbonKgCo2e: number;
  unitCarbonIntensity: number;
  stageBreakdown: {
    rawMaterialKgCo2e: number;
    transportKgCo2e: number;
    manufacturingKgCo2e: number;
    wasteDisposalKgCo2e: number;
  };
  greenPowerOffsetT: number;
  verificationHash: string;
}""",
            "dataSources": [
                {
                    "medium": "原材料碳排放 (Raw Materials)",
                    "sourceType": "ERP 系统工程 BOM 清单 + 本地化因子库",
                    "protocol": "SAP RFC BAPI_MATERIAL_GET_DETAIL",
                    "device": "ERP BOM 数据库",
                    "tagExample": "BOM_CU_KG (铜), BOM_SILICON_STEEL (硅钢), EF_CU_CRADLE (铜因子)",
                    "frequency": "每订单锁定计算"
                },
                {
                    "medium": "生产制造碳排放 (Manufacturing)",
                    "sourceType": "车间 SCADA 电量/蒸汽实测 + 绿电交易台账",
                    "protocol": "Modbus-TCP 直采",
                    "device": "车间电能表与供热计量表",
                    "tagExample": "MFG_ELEC_KWH, MFG_STEAM_KG",
                    "frequency": "工序完工批次"
                },
                {
                    "medium": "运输阶段碳排放 (Logistics)",
                    "sourceType": "TMS 运输管理系统",
                    "protocol": "REST API",
                    "device": "货运调度单",
                    "tagExample": "TRANS_DISTANCE_KM, TRANS_WEIGHT_T",
                    "frequency": "发货出库"
                }
            ],
            "calculationLogic": """1. ISO 14067 LCA 总碳足迹:
   PCF_total = E_raw + E_trans + E_mfg + E_waste

2. 制造阶段绿电消纳减排算法 (特变电工核心优势):
   E_mfg = Q_grid × EF_grid + Q_green × EF_green + M_steam × EF_steam
   - 市电因子: EF_grid = 0.5366 kgCO2e/kWh
   - 直供绿电因子: EF_green = 0.05664 kgCO2e/kWh (减排达 89.4%)
   - 绿电减排量: Reduction = Q_green × (EF_grid - EF_green)""",
            "frontendSpecs": """- 44px 表格行高；
- 弹窗采用高阶金属切角；
- 导出按钮统一 80px × 36px，背景 `#2C7CFF`。""",
            "backendSpecs": """- 算法纯函数：`lib/accounting.ts`
- 表：`dwd_pcf_order_lca_summary`, `dwd_pcf_stage_process_log`
- SLA: 单订单 LCA 计算 < 180ms""",
            "qaTestSpecs": """- 因子缺失自动 fallback 至行业缺省因子校验。
- BOM 零件重量守恒校验 (偏差 < ±1.5%)。"""
        },
        {
            "id": "spec-footprint-cbam",
            "center": "产品碳足迹集采中心",
            "navGroup": "CBAM 管理",
            "pageName": "CBAM 欧盟碳关税合规与成本测算",
            "route": "/carbon-footprint/cbam/compliance",
            "component": "components/cbam/compliance-view.tsx",
            "overview": "特变电工输变电装备出海合规护航引擎。内置欧盟 CBAM 管控产品清单、HS 编码与欧盟 CN 码智能映射台账、前驱物嵌入排放核算与多情景碳关税成本测算模型，保障海外贸易合规申报。",
            "subModules": [
                {"name": "CBAM 合规概览看板", "desc": "出海产品总数、HS-CN 匹配率、合规申报单量、预计总碳关税风险敞口"},
                {"name": "HS-CN 编码映射台账", "desc": "44px 表格，国内 HS 码与欧盟 CN 码自动匹配、前驱物要求及豁免评估"},
                {"name": "碳关税情景预测模型", "desc": "基准 (75€/t)、高位 (100€/t)、低位 (50€/t) 三种碳价情景测算"},
                {"name": "前驱物供应商碳绩效地图", "desc": "外采硅钢片、铜材前驱物碳排放因子达标情况"}
            ],
            "dtoSchema": """interface CbamComplianceRowDTO {
  id: string;
  hsCode: string;
  cnCode: string;
  productName: string;
  cbamCategory: 'Electricity' | 'Iron and Steel' | 'Aluminium';
  exportVolumeTons: number;
  embeddedDirectKgCo2e: number;
  embeddedIndirectKgCo2e: number;
  euEtsCarbonPriceEur: number;
  domesticCarbonPriceEur: number;
  estimatedTaxEur: number;
}""",
            "dataSources": [
                {
                    "medium": "海关报关单",
                    "sourceType": "ERP 出口外贸管理模块 / 电子海关申报单",
                    "protocol": "EDI / SAP SD",
                    "device": "外贸业务系统",
                    "tagExample": "EXP_DECLARATION_NO, EXP_HS_CODE, EXP_NET_WEIGHT_KG",
                    "frequency": "报关批次同步"
                },
                {
                    "medium": "欧盟官方碳价与因子",
                    "sourceType": "欧盟委员会官方公报 (EU Official Journal)",
                    "protocol": "API 爬取 / 管理员维护",
                    "device": "CBAM 规则数据库",
                    "tagExample": "EU_ETS_ALLOWANCE_PRICE",
                    "frequency": "每周/每月更新"
                }
            ],
            "calculationLogic": """1. CBAM 碳关税应缴成本公式 (EU Regulation 2023/956):
   Cost_CBAM = ExportVolume_t × SE_direct × max(0, Price_EU_ETS - Price_Domestic_Paid)
   - 基准情景: P_EU_ETS = 75 欧元/吨
   - 高位情景: P_EU_ETS = 100 欧元/吨
   - 低位情景: P_EU_ETS = 50 欧元/吨""",
            "frontendSpecs": """- 货币单位严格标注为 € (EUR) 或 ￥ (CNY)；
- 44px 表格规范，HS/CN 编码使用 Mono 等宽字体；
- 导出按钮统一 80px × 36px。""",
            "backendSpecs": """- 计算引擎：`lib/cbam.ts`
- 表：`dwd_cbam_export_declaration`, `dim_cbam_cn_mapping`""",
            "qaTestSpecs": """- 碳价倒挂校验: 国内已纳碳价 > 欧盟碳价时应缴税额自动置 0，严禁负数。"""
        },
        {
            "id": "spec-footprint-factor",
            "center": "产品碳足迹集采中心",
            "navGroup": "因子库管理",
            "pageName": "碳排放因子库管理",
            "route": "/carbon-footprint/factor/group",
            "component": "components/carbon/factor-view.tsx",
            "overview": "特变电工本地化碳排放因子中枢。统一维护变压器、线缆、开关三大产业的原材料因子、能源因子、运输因子及海外供应链因子，支持多版本并存、股份因子同步与下发审核机制。",
            "subModules": [
                {"name": "因子分类与版本树", "desc": "原材料、能源、运输、供应商因子 4 大类别及版本切换"},
                {"name": "因子台账高密表", "desc": "44px 表格，因子名称、因子值、单位、数据来源、不确定度、发布年份、审核状态"},
                {"name": "因子版本发布与同步", "desc": "股份集团因子接口同步、经营单位因子下发广播"}
            ],
            "dtoSchema": """interface CarbonFactorDTO {
  id: string;
  factorCode: string;
  name: string;
  category: '能源' | '原材料' | '运输' | '废弃物';
  factorValue: number;
  unit: string;                  // 如 kgCO2e/kg, kgCO2e/kWh
  sourceOrg: string;             // 如 Ecoinvent, CPCD, 特变实测
  uncertaintyPct: number;        // 不确定度 (%)
  versionTag: string;            // 如 V2026.1
  publishYear: number;
}""",
            "dataSources": [
                {
                    "medium": "官方与第三方数据库",
                    "sourceType": "Ecoinvent 3.9 / 中国产品全生命周期温室气体排放系数库 (CPCD) / 企业实测",
                    "protocol": "定期导入 / 审核入库",
                    "device": "MySQL `dim_carbon_factor`",
                    "tagExample": "FACTOR_VAL_ACTIVE",
                    "frequency": "按年/按需发布新版本"
                }
            ],
            "calculationLogic": """1. 因子版本化继承策略:
   历史订单核算结果永久绑定核算时的因子快照 (Snapshot Factor)，新发布因子仅对生效日期后的新订单生效，禁止回溯篡改历史认证报告。""",
            "frontendSpecs": """- 表格严格 44px 行高；
- 状态标签采用客观中立颜色（已发布/审核中/已失效）；
- 导出按钮 80px × 36px。""",
            "backendSpecs": """- 表：`dim_carbon_factor`, `dim_carbon_factor_version`""",
            "qaTestSpecs": """- 版本不可篡改测试: 验证当发布新版本因子后，历史已出具 ISO 14067 报告的订单碳足迹数值严格保持不变。"""
        }
    ]

def load_data_dictionary():
    return {
        "dwdTables": [
            {
                "tableName": "dwd_iot_scada_telemetry_15m",
                "tableComment": "物联数据采集与 SCADA 遥测 15 分钟聚合事实表",
                "storageEngine": "TDengine / TimescaleDB (时序引擎)",
                "fields": [
                    {"name": "tag_name", "type": "VARCHAR(64)", "nullable": False, "comment": "物联测点 Tag 唯一编码"},
                    {"name": "sample_time", "type": "TIMESTAMP", "nullable": False, "comment": "数据时间戳 (15分钟整点)"},
                    {"name": "park_id", "type": "VARCHAR(32)", "nullable": False, "comment": "所属园区编码 (PK-XJ-01)"},
                    {"name": "unit_id", "type": "VARCHAR(32)", "nullable": False, "comment": "经营单位编码"},
                    {"name": "energy_type", "type": "VARCHAR(16)", "nullable": False, "comment": "能源介质 (电/蒸汽/气/水)"},
                    {"name": "instant_val", "type": "DECIMAL(14,4)", "nullable": True, "comment": "采样瞬时物理量 (kW, t/h, m³/h)"},
                    {"name": "accum_reading", "type": "DECIMAL(18,4)", "nullable": False, "comment": "表计累计止度 (kWh, kg, m³, t)"},
                    {"name": "period_diff", "type": "DECIMAL(14,4)", "nullable": False, "comment": "本周期差值实物消耗量"},
                    {"name": "ratio_multiplier", "type": "INT", "nullable": False, "comment": "互感器/变比倍率 (默认 1)"},
                    {"name": "quality_flag", "type": "SMALLINT", "nullable": False, "comment": "数据质量标志 (0正常, 1插值, 2超量程, 3倒走拦截)"}
                ]
            },
            {
                "tableName": "dwd_pcf_order_stage_process",
                "tableComment": "产品碳足迹订单工序能耗与物料追踪事实表",
                "storageEngine": "PostgreSQL / MySQL 8.0",
                "fields": [
                    {"name": "order_id", "type": "VARCHAR(64)", "nullable": False, "comment": "生产订单号 (如 SO-260710)"},
                    {"name": "item_no", "type": "INT", "nullable": False, "comment": "订单行号"},
                    {"name": "product_model", "type": "VARCHAR(128)", "nullable": False, "comment": "产品规格型号"},
                    {"name": "stage_name", "type": "VARCHAR(32)", "nullable": False, "comment": "LCA 阶段 (原材料/运输/制造/处置)"},
                    {"name": "process_name", "type": "VARCHAR(64)", "nullable": False, "comment": "关键工序 (绕线/干燥/固化/交联)"},
                    {"name": "grid_power_kwh", "type": "DECIMAL(14,4)", "nullable": False, "comment": "分摊市电量 (kWh)"},
                    {"name": "green_power_kwh", "type": "DECIMAL(14,4)", "nullable": False, "comment": "分摊直供绿电量 (kWh)"},
                    {"name": "steam_kg", "type": "DECIMAL(14,4)", "nullable": False, "comment": "分摊工业蒸汽消耗 (kg)"},
                    {"name": "stage_carbon_kg", "type": "DECIMAL(14,4)", "nullable": False, "comment": "该工序综合碳排放量 (kgCO2e)"}
                ]
            }
        ],
        "scadaTags": [
            {"tag": "XJ_TRANS_P1_P_TOT", "name": "新变总降配电房 1#主变有功功率", "medium": "电力", "unit": "kW", "range": "0 ~ 10000", "freq": "15s", "level": "L2"},
            {"tag": "XJ_TRANS_P1_EP_IMP", "name": "新变总降 1#主变正向有功总电能底度", "medium": "电力", "unit": "kWh", "range": "0 ~ 99999999", "freq": "15min", "level": "L3"},
            {"tag": "XJ_STEAM_F1_MASS", "name": "变压器二车间气相干燥蒸汽质量流量", "medium": "蒸汽", "unit": "t/h", "range": "0 ~ 20", "freq": "1min", "level": "L2"},
            {"tag": "LL_CABLE_XL_N2_FLOW", "name": "鲁缆超高压立塔交联线高纯氮气瞬时流量", "medium": "液氮", "unit": "Nm³/h", "range": "0 ~ 50", "freq": "1min", "level": "L2"},
            {"tag": "HB_GAS_M1_TOTAL", "name": "衡变新园区天然气总表累计供气量", "medium": "天然气", "unit": "m³", "range": "0 ~ 999999", "freq": "15min", "level": "L3"}
        ],
        "erpMesMappings": [
            {"targetField": "order_id", "sourceSystem": "SAP ERP", "sourceTable": "AUFK", "sourceField": "AUFNR", "rule": "主键直连，滤除撤销订单"},
            {"targetField": "product_model", "sourceSystem": "SAP ERP", "sourceTable": "AFPO", "sourceField": "MATNR", "rule": "去除前置零，映射标准型号字典"},
            {"targetField": "finished_qty", "sourceSystem": "MES 完工单", "sourceTable": "mes_work_order", "sourceField": "qualified_qty", "rule": "质检合格入库数量"},
            {"targetField": "bom_copper_kg", "sourceSystem": "PLM / ERP BOM", "sourceTable": "STPO", "sourceField": "MENGE", "rule": "匹配物料大类铜杆 (CU-01)"}
        ],
        "securityLevels": [
            {"level": "L0 (公开级)", "scope": "园区宣传大屏成效、零碳转型对外宣传里程碑、企业官网ESG荣誉成果", "storage": "普通明文存储", "transmission": "标准 HTTPS 传输"},
            {"level": "L1 (内部级)", "scope": "全厂多能流实时总用电量、综合折标能耗走势、各车间设备在线状态", "storage": "普通明文存储", "transmission": "强制 TLS 1.3 传输"},
            {"level": "L2 (工作秘密)", "scope": "各经营单位用能成本金额 (电费/水费/气费)、产品单耗横向对标排名、告警规则", "storage": "数据库敏感脱敏", "transmission": "传输带防重放 Token 鉴权"},
            {"level": "L3 (核心商密)", "scope": "客户出口订单详情、BOM 实景物料消耗定额、供应商碳排放因子真实数据", "storage": "国密 SM4 数据库密文存储", "transmission": "双向证书 mTLS 强认证"},
            {"level": "L4 (绝密级)", "scope": "股份集团高层战略对标底表、未公开涉密装备专线能耗", "storage": "硬件加密机 (HSM) 隔离", "transmission": "专网物理隔离"}
        ]
    }

def load_review_matrix():
    return [
        {
            "role": "PM (产品经理)",
            "icon": "Target",
            "checkItems": [
                {"id": "pm-1", "item": "零碳园区集控中心 10 大核心模块与 PRD 范围完全闭环，无功能缺失", "mandatory": True},
                {"id": "pm-2", "item": "产品碳足迹实景数据库、工序追溯、CBAM 管理与因子库三维维护完备", "mandatory": True},
                {"id": "pm-3", "item": "白名单规则精准执行：10 家无工序单位精准判空输出单行 '暂无相关工序！'", "mandatory": True},
                {"id": "pm-4", "item": "严格遵循客观中立原则，全站杜绝任何主观定性评判词句", "mandatory": True}
            ]
        },
        {
            "role": "UI/UX (工业设计)",
            "icon": "Layers",
            "checkItems": [
                {"id": "ui-1", "item": "数据表格行高全系统强制为 44px (h-[44px])，文本居中对齐", "mandatory": True},
                {"id": "ui-2", "item": "标准色遵循 8 大能源介质官方色值，分时 4 段色值准确无误", "mandatory": True},
                {"id": "ui-3", "item": "图表悬停游标为微透科技蓝 rgba(56, 189, 248, 0.08)，浅色为极细微灰", "mandatory": True},
                {"id": "ui-4", "item": "标准导出按钮固定 80px × 36px，输入框与下拉框 200px × 36px", "mandatory": True}
            ]
        },
        {
            "role": "Architect (技术架构)",
            "icon": "Cpu",
            "checkItems": [
                {"id": "arch-1", "item": "Next.js 16 (App Router) + React 19 静态全路由预渲染 (output: 'export') 正常通过", "mandatory": True},
                {"id": "arch-2", "item": "纯前端离线检索与页面切换毫秒级响应，无 Node.js 运行时依赖", "mandatory": True},
                {"id": "arch-3", "item": "核心领域核算算法 (折标煤/LCA/CBAM) 经过纯函数解耦，具备可测试性", "mandatory": True}
            ]
        },
        {
            "role": "Frontend (前端开发)",
            "icon": "Code2",
            "checkItems": [
                {"id": "fe-1", "item": "暗黑科技蓝 (3000) 与浅色商务 (3001) 双端 100% 同构同步更新", "mandatory": True},
                {"id": "fe-2", "item": "组件库体系 (@/components/design-system) 深度复用，无重复野控件", "mandatory": True},
                {"id": "fe-3", "item": "78 个静态路由 pnpm build 编译 0 报错，无 TypeScript 严格模式错误", "mandatory": True}
            ]
        },
        {
            "role": "Backend (后端开发)",
            "icon": "Database",
            "checkItems": [
                {"id": "be-1", "item": "明确 SCADA 物联测点 Tag、ERP 订单号与 MES 产量的数据源接入定义", "mandatory": True},
                {"id": "be-2", "item": "DWD 事实表与 ADS 汇总表结构定义完备，主外键索引规划合理", "mandatory": True},
                {"id": "be-3", "item": "上报数据防重幂等设计与时序数据降采样 (Rollup) 策略明确", "mandatory": True}
            ]
        },
        {
            "role": "QA (测试工程)",
            "icon": "CheckCircle2",
            "checkItems": [
                {"id": "qa-1", "item": "全场景等价类与边界值用例覆盖，产量为 0 时除法分母防崩溃通过", "mandatory": True},
                {"id": "qa-2", "item": "表计止度倒走拦截与 ±15% 环比波动预警算法防御用例通过", "mandatory": True},
                {"id": "qa-3", "item": "变压器与线缆双产业计量单位自适应 (台 vs km) 验证通过", "mandatory": True}
            ]
        },
        {
            "role": "Security (安全合规)",
            "icon": "ShieldCheck",
            "checkItems": [
                {"id": "sec-1", "item": "L0~L4 商密分级制度完备，敏感客户订单与供应商因子加密方案就绪", "mandatory": True},
                {"id": "sec-2", "item": "系统操作与数据录入不可逆审计日志设计完备", "mandatory": True}
            ]
        },
        {
            "role": "DevOps (运维部署)",
            "icon": "Server",
            "checkItems": [
                {"id": "ops-1", "item": "本地静态构建通过后，严格执行手动指令发布纪律，绝不自动向 8.215 推送", "mandatory": True},
                {"id": "ops-2", "item": "严格禁止在 Git 中提交 VUE/ 临时工作目录代码", "mandatory": True}
            ]
        }
    ]

def get_system_functional_tree():
    return [
        {
            "centerKey": "zero-carbon",
            "centerName": "零碳园区集控中心",
            "groups": [
                {
                    "title": "集控中心大屏",
                    "icon": "LayoutDashboard",
                    "children": [
                        {"title": "全景环幕大屏", "href": "/zero-carbon/screen", "specId": "spec-screen-panoramic"},
                        {"title": "综合集控大屏 (16:9)", "href": "/screen/control-center", "specId": "spec-screen-panoramic"}
                    ]
                },
                {
                    "title": "集中监管",
                    "icon": "MonitorCog",
                    "children": [
                        {"title": "指标管控", "href": "/zero-carbon/monitor/indicator", "specId": "spec-monitor-indicator"},
                        {"title": "用能在线监测", "href": "/zero-carbon/monitor/online/usage", "specId": "spec-monitor-usage"},
                        {"title": "工业微电网监测", "href": "/zero-carbon/monitor/online/microgrid", "specId": "spec-monitor-microgrid"},
                        {"title": "能源碳排放监测", "href": "/zero-carbon/monitor/carbon-emission", "specId": "spec-monitor-usage"}
                    ]
                },
                {
                    "title": "能耗能效分析",
                    "icon": "Gauge",
                    "children": [
                        {"title": "用能结构分析", "href": "/zero-carbon/energy/structure", "specId": "spec-energy-structure"},
                        {"title": "能源成本分析", "href": "/zero-carbon/energy/cost", "specId": "spec-energy-cost"},
                        {"title": "单位产品能耗", "href": "/zero-carbon/energy/unit-product", "specId": "spec-energy-unit-product"},
                        {"title": "单位产值能耗", "href": "/zero-carbon/energy/unit-output", "specId": "spec-energy-unit-output"},
                        {"title": "对标管理", "href": "/zero-carbon/energy/benchmark", "specId": "spec-energy-benchmark"}
                    ]
                },
                {
                    "title": "零碳项目评估",
                    "icon": "ClipboardCheck",
                    "children": [
                        {"title": "项目档案管理", "href": "/zero-carbon/project/archive", "specId": "spec-project-benefit"},
                        {"title": "实时监控", "href": "/zero-carbon/project/monitoring", "specId": "spec-project-benefit"},
                        {"title": "项目运行评估", "href": "/zero-carbon/project/benefit", "specId": "spec-project-benefit"},
                        {"title": "零碳工厂自评估", "href": "/zero-carbon/project/self", "specId": "spec-project-self"}
                    ]
                },
                {
                    "title": "统计报表",
                    "icon": "FileBarChart",
                    "children": [
                        {"title": "用能报表", "href": "/zero-carbon/reports/usage", "specId": "spec-energy-structure"},
                        {"title": "成本报表", "href": "/zero-carbon/reports/cost", "specId": "spec-energy-cost"},
                        {"title": "单耗报表", "href": "/zero-carbon/reports/unit", "specId": "spec-energy-unit-product"}
                    ]
                },
                {
                    "title": "基础管理",
                    "icon": "Settings2",
                    "children": [
                        {"title": "数据录入", "href": "/zero-carbon/config/entry", "specId": "spec-config-entry"},
                        {"title": "组件规范库", "href": "/design-system", "specId": "spec-design-system"},
                        {"title": "开发与评审中心", "href": "/docs", "specId": "spec-design-system"}
                    ]
                }
            ]
        },
        {
            "centerKey": "carbon-footprint",
            "centerName": "产品碳足迹集采中心",
            "groups": [
                {
                    "title": "对外示范窗口",
                    "icon": "LayoutDashboard",
                    "children": [
                        {"title": "集团驾驶舱", "href": "/carbon-footprint/cockpit", "specId": "spec-footprint-dashboard"}
                    ]
                },
                {
                    "title": "多维分析",
                    "icon": "BarChart3",
                    "children": [
                        {"title": "横向对比", "href": "/carbon-footprint/analysis/compare", "specId": "spec-footprint-dashboard"},
                        {"title": "纵向对比与总览", "href": "/carbon-footprint/analysis/ranking", "specId": "spec-footprint-dashboard"}
                    ]
                },
                {
                    "title": "实景数据库",
                    "icon": "Database",
                    "children": [
                        {"title": "实景数据库", "href": "/carbon-footprint/database/realscene", "specId": "spec-footprint-accounting"},
                        {"title": "碳足迹核算", "href": "/carbon-footprint/database/accounting", "specId": "spec-footprint-accounting"},
                        {"title": "碳足迹报告", "href": "/carbon-footprint/database/report", "specId": "spec-footprint-accounting"}
                    ]
                },
                {
                    "title": "CBAM管理",
                    "icon": "ShieldCheck",
                    "children": [
                        {"title": "合规管理", "href": "/carbon-footprint/cbam/compliance", "specId": "spec-footprint-cbam"},
                        {"title": "申报模拟", "href": "/carbon-footprint/cbam/declaration", "specId": "spec-footprint-cbam"},
                        {"title": "知识库", "href": "/carbon-footprint/cbam/knowledge", "specId": "spec-footprint-cbam"}
                    ]
                },
                {
                    "title": "第三方认证管理",
                    "icon": "BadgeCheck",
                    "children": [
                        {"title": "认证资料维护", "href": "/carbon-footprint/certification/material", "specId": "spec-footprint-factor"},
                        {"title": "认证申请", "href": "/carbon-footprint/certification/apply", "specId": "spec-footprint-factor"},
                        {"title": "认证结果管理", "href": "/carbon-footprint/certification/result", "specId": "spec-footprint-factor"}
                    ]
                },
                {
                    "title": "因子库管理",
                    "icon": "Boxes",
                    "children": [
                        {"title": "原材料碳排因子", "href": "/carbon-footprint/factor/material", "specId": "spec-footprint-factor"},
                        {"title": "电力碳排因子", "href": "/carbon-footprint/factor/power", "specId": "spec-footprint-factor"},
                        {"title": "能源活动碳排因子", "href": "/carbon-footprint/factor/energy", "specId": "spec-footprint-factor"},
                        {"title": "折标煤系数库", "href": "/carbon-footprint/factor/coal", "specId": "spec-footprint-factor"}
                    ]
                }
            ]
        }
    ]

def main():
    print("[1/5] 扫描提取 38 篇开发手册...")
    manuals = load_manuals()
    print(f"      共提取 {len(manuals)} 篇开发手册。")

    print("[2/5] 扫描提取 PRD 分卷需求规格...")
    prds = load_prd_docs()
    print(f"      共提取 {len(prds)} 篇 PRD 需求规格。")

    print("[3/5] 载入全站页面与模块五维技术规格 (FE/BE/QA)...")
    specs = get_page_module_specs()
    print(f"      共生成 {len(specs)} 个核心页面技术剖析规格。")

    print("[4/5] 载入标准数据字典、8 角色评审矩阵与系统功能树...")
    data_dict = load_data_dictionary()
    review_matrix = load_review_matrix()
    nav_tree = get_system_functional_tree()

    print("[5/5] 编译并输出纯静态 TypeScript 模块...")
    
    ts_content = f"""/* eslint-disable */
// @ts-nocheck
/**
 * 特变电工能碳数字化双中心 · Web 开发文档与技术评审中心统一数据仓库
 * 自动生成于构建期，提供 38 篇开发手册、PRD 规格、页面技术剖析(前端/后端/测试)、数据字典与在线评审工作台数据。
 */

export interface DocHeading {{
  level: number;
  title: string;
  id: string;
}}

export interface ManualDoc {{
  id: string;
  no: number;
  filename: string;
  title: string;
  category: string;
  readTime: string;
  wordCount: number;
  summary: string;
  headings: DocHeading[];
  content: string;
}}

export interface PrdDoc {{
  id: string;
  vol: string;
  filename: string;
  title: string;
  readTime: string;
  wordCount: number;
  summary: string;
  headings: DocHeading[];
  content: string;
}}

export interface DataSourceItem {{
  medium: string;
  sourceType: string;
  protocol: string;
  device: string;
  tagExample: string;
  frequency: string;
}}

export interface PageModuleSpec {{
  id: string;
  center: string;
  navGroup: string;
  pageName: string;
  route: string;
  component: string;
  overview: string;
  subModules: {{ name: string; desc: string }}[];
  dtoSchema: string;
  dataSources: DataSourceItem[];
  calculationLogic: string;
  frontendSpecs: string;
  backendSpecs: string;
  qaTestSpecs: string;
}}

export interface CheckItem {{
  id: string;
  item: string;
  mandatory: boolean;
}}

export interface RoleReviewSpec {{
  role: string;
  icon: string;
  checkItems: CheckItem[];
}}

export interface DwdTableField {{
  name: string;
  type: string;
  nullable: boolean;
  comment: string;
}}

export interface DwdTable {{
  tableName: string;
  tableComment: string;
  storageEngine: string;
  fields: DwdTableField[];
}}

export interface ScadaTagItem {{
  tag: string;
  name: string;
  medium: string;
  unit: string;
  range: string;
  freq: string;
  level: string;
}}

export interface ErpMappingItem {{
  targetField: string;
  sourceSystem: string;
  sourceTable: string;
  sourceField: string;
  rule: string;
}}

export interface SecurityLevelItem {{
  level: string;
  scope: string;
  storage: string;
  transmission: string;
}}

export interface NavLeafNode {{
  title: string;
  href: string;
  specId: string;
}}

export interface NavGroupNode {{
  title: string;
  icon: string;
  children: NavLeafNode[];
}}

export interface CenterNavTree {{
  centerKey: 'zero-carbon' | 'carbon-footprint';
  centerName: string;
  groups: NavGroupNode[];
}}

/* 1. 38 篇开发手册清单 */
export const MANUAL_DOCS: ManualDoc[] = {json.dumps(manuals, ensure_ascii=False, indent=2)};

/* 2. PRD 需求规格分卷清单 */
export const PRD_DOCS: PrdDoc[] = {json.dumps(prds, ensure_ascii=False, indent=2)};

/* 3. 页面与模块五维技术规格清单 (供前端/后端/测试查阅) */
export const PAGE_MODULE_SPECS: PageModuleSpec[] = {json.dumps(specs, ensure_ascii=False, indent=2)};

/* 4. 标准数据字典与物联点表 */
export const DATA_DICTIONARY = {json.dumps(data_dict, ensure_ascii=False, indent=2)};

/* 5. 8 角色技术评审准入检查矩阵 */
export const REVIEW_MATRIX: RoleReviewSpec[] = {json.dumps(review_matrix, ensure_ascii=False, indent=2)};

/* 6. 系统页面功能结构树 (双中心完整层级结构) */
export const SYSTEM_FUNCTIONAL_TREE: CenterNavTree[] = {json.dumps(nav_tree, ensure_ascii=False, indent=2)};
"""

    OUTPUT_DARK.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_DARK.write_text(ts_content, encoding='utf-8')
    print(f"      [OK] 暗黑端数据写入: {OUTPUT_DARK} ({len(ts_content)} bytes)")

    OUTPUT_LIGHT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_LIGHT.write_text(ts_content, encoding='utf-8')
    print(f"      [OK] 浅色端数据同步: {OUTPUT_LIGHT} ({len(ts_content)} bytes)")
    print("Done!")

if __name__ == '__main__':
    main()

