/* eslint-disable */
// @ts-nocheck
/**
 * 特变电工能碳数字化双中心 · Web 开发文档与技术评审中心统一数据仓库
 * 自动生成于构建期，提供 38 篇开发手册、PRD 规格、全量 37 页面高深度技术规格(模块/参数/数据来源/计算模型/DTO/FE/BE/QA)、数据字典与在线评审工作台数据。
 */

export interface DocHeading {
  level: number;
  title: string;
  id: string;
}

export interface ManualDoc {
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
}

export interface PrdDoc {
  id: string;
  vol: string;
  filename: string;
  title: string;
  readTime: string;
  wordCount: number;
  summary: string;
  headings: DocHeading[];
  content: string;
}

export interface DataSourceItem {
  medium: string;
  sourceType: string;
  protocol: string;
  device: string;
  tagExample: string;
  frequency: string;
  securityLevel?: string;
}

export interface ParameterItem {
  paramCode: string;
  paramName: string;
  category: string; // '入参过滤' | '核心指标' | '业务明细' | '衍生计算'
  dataType: string;
  unit: string;
  required: boolean;
  source: string;
  rangeOrEnum: string;
  description: string;
}

export interface CalcFormulaVariable {
  name: string;
  desc: string;
  unit: string;
}

export interface CalcFormulaItem {
  formulaName: string;
  mathExpression: string;
  variables: CalcFormulaVariable[];
  logicDescription: string;
  boundaryRule?: string;
}

export interface RoleGuide {
  fe: string;
  be: string;
  qa: string;
}

export interface PageModuleSpec {
  id: string;
  center: string;
  navGroup: string;
  pageName: string;
  route: string;
  component: string;
  overview: string;
  subModules: { name: string; desc: string }[];
  parameters?: ParameterItem[];
  dataSources: DataSourceItem[];
  calcFormulas?: CalcFormulaItem[];
  calculationLogic: string;
  dtoSchema: string;
  roleGuide?: RoleGuide;
  frontendSpecs: string;
  backendSpecs: string;
  qaTestSpecs: string;
}

export interface CheckItem {
  id: string;
  item: string;
  mandatory: boolean;
}

export interface RoleReviewSpec {
  role: string;
  icon: string;
  checkItems: CheckItem[];
}

export interface DwdTableField {
  name: string;
  type: string;
  nullable: boolean;
  comment: string;
}

export interface DwdTable {
  tableName: string;
  tableComment: string;
  storageEngine: string;
  fields: DwdTableField[];
}

export interface ScadaTagItem {
  tag: string;
  name: string;
  medium: string;
  unit: string;
  range: string;
  freq: string;
  level: string;
}

export interface ErpMappingItem {
  targetField: string;
  sourceSystem: string;
  sourceTable: string;
  sourceField: string;
  rule: string;
}

export interface SecurityLevelItem {
  level: string;
  scope: string;
  storage: string;
  transmission: string;
}

export interface NavLeafNode {
  title: string;
  href: string;
  specId: string;
}

export interface NavGroupNode {
  title: string;
  icon: string;
  children: NavLeafNode[];
}

export interface CenterNavTree {
  centerKey: 'zero-carbon' | 'carbon-footprint';
  centerName: string;
  groups: NavGroupNode[];
}

/* 1. 38 篇开发手册清单 */
export const MANUAL_DOCS: ManualDoc[] = [
  {
    "id": "manual-01",
    "no": 1,
    "filename": "01_多Agent需求调研与系统工程分析报告.md",
    "title": "多Agent需求调研与系统工程分析报告",
    "category": "总体架构与工程底座",
    "readTime": "42 分钟",
    "wordCount": 21152,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "目录索引",
        "id": "目录索引"
      },
      {
        "level": 2,
        "title": "1. 👨‍💼 产品经理 (PM) 需求规格与商业分析报告",
        "id": "1-产品经理-pm-需求规格与商业分析报告"
      },
      {
        "level": 3,
        "title": "1.1 业务背景与核心痛点",
        "id": "1-1-业务背景与核心痛点"
      },
      {
        "level": 3,
        "title": "1.2 北极星指标 (North Star Metrics)",
        "id": "1-2-北极星指标-north-star-metrics"
      },
      {
        "level": 3,
        "title": "1.3 用户画像矩阵 (Target Personas)",
        "id": "1-3-用户画像矩阵-target-personas"
      },
      {
        "level": 3,
        "title": "1.4 功能范围界定 (Scope Boundaries)",
        "id": "1-4-功能范围界定-scope-boundaries"
      },
      {
        "level": 3,
        "title": "1.5 核心 User Stories (Gherkin 规范)",
        "id": "1-5-核心-user-stories-gherkin-规范"
      },
      {
        "level": 3,
        "title": "1.6 功能优先级矩阵 (RICE 框架评估)",
        "id": "1-6-功能优先级矩阵-rice-框架评估"
      },
      {
        "level": 2,
        "title": "2. 🎨 UI/UX 视觉体系与交互设计规范",
        "id": "2-ui-ux-视觉体系与交互设计规范"
      },
      {
        "level": 3,
        "title": "2.1 整体设计风格定位",
        "id": "2-1-整体设计风格定位"
      },
      {
        "level": 3,
        "title": "2.2 信息架构与导航层级 (Information Architecture)",
        "id": "2-2-信息架构与导航层级-information-architecture"
      },
      {
        "level": 3,
        "title": "2.3 Design Tokens 规范定义",
        "id": "2-3-design-tokens-规范定义"
      },
      {
        "level": 3,
        "title": "2.4 组件状态矩阵 (Component State Matrix)",
        "id": "2-4-组件状态矩阵-component-state-matrix"
      },
      {
        "level": 2,
        "title": "3. 🛠️ 技术架构师 (Architect) 系统总体架构与 API 契约",
        "id": "3-技术架构师-architect-系统总体架构与-api-契约"
      },
      {
        "level": 3,
        "title": "3.1 领域驱动设计 (DDD Bounded Contexts)",
        "id": "3-1-领域驱动设计-ddd-bounded-contexts"
      }
    ],
    "content": "# 🏢 特变电工“双中心”能碳管控系统全维度多 Agent 需求调研与分析报告\n\n> **项目名称**：特变电工（电装集团）“双中心”建设项目（零碳园区集控中心 + 产品碳足迹集采中心）  \n> **报告版本**：V1.0-Engineering-Release  \n> **多 Agent 联合会诊**：Product Manager (`role-pm`), UI/UX Designer (`role-ui-ux`), Software Architect (`role-architect`), Frontend Engineer (`role-frontend`), Backend Engineer (`role-backend`), Security Analyst (`role-security`), DevOps/SRE (`role-devops`), QA Lead (`role-qa`)  \n> **核心里程碑**：\n> - **2026-09-15**：高保真原型图 + PRD 交付，启动核心研发\n> - **2026-12-05**：系统核心功能上线\n> - **2026-12-31**：首批 5 家重点标杆工厂数据全量接入\n> - **2027 年**：逐步接入集团全部 15 个产业园区、21 家项目工厂\n> - **2027-10**：项目全面终验\n\n---\n\n## 目录索引\n1. [👨‍💼 产品经理 (PM) 需求规格与商业分析报告](#1-产品经理-pm-需求规格与商业分析报告)\n2. [🎨 UI/UX 视觉体系与交互设计规范](#2-uiux-视觉体系与交互设计规范)\n3. [🛠️ 技术架构师 (Architect) 系统总体架构与 API 契约](#3-技术架构师-architect-系统总体架构与-api-契约)\n4. [💻 前端工程师 (Frontend) 组件树与状态管理方案](#4-前端工程师-frontend-组件树与状态管理方案)\n5. [⚙️ 后端工程师 (Backend) 控制流、核算引擎与缓存策略](#5-后端工程师-backend-控制流核算引擎与缓存策略)\n6. [🔒 网络安全工程师 (Security) STRIDE 威胁建模与防护](#6-网络安全工程师-security-stride-威胁建模与防护)\n7. [🚀 DevOps / SRE 运维与容器化部署方案](#7-devops--sre-运维与容器化部署方案)\n8. [🧪 测试工程师 (QA) 测试矩阵与高风险规避方案](#8-测试工程师-qa-测试矩阵与高风险规避方案)\n\n---\n\n## 1. 👨‍💼 产品经理 (PM) 需求规格与商业分析报告\n\n### 1.1 业务背景与核心痛点\n特变电工（电装集团）拥有遍布全国的 **15 个产业园区**、**21 家核心项目工厂**（涵盖变压器、电缆、开关柜、套管、互感器、二次设备、GIL/GIS、硅钢等高用能与高端装备制造）。\n目前面临的核心痛点包括：\n1. **数据孤岛与能碳可见度低**：各工厂自动化程度不一（部分有远传表计，部分无气表或仅有线下月报），集团高层缺乏全局视角；\n2. **零碳工厂评价标准与核算繁琐**：国家级零碳工厂标准（GB/T 24067, ISO 14067）要求严苛，指标涉及 65+ 项（单耗、绿电占比、折标煤、范围一/二碳排等），人工核算极易出错；\n3. **应对出口与绿色供应链壁垒（CBAM / 绿色招采）**：变压器与线缆等产品出口面临欧盟碳关税（CBAM）与全生命周期碳足迹核查挑战；\n4. **决策滞后**：能耗突增、单耗偏离基准时缺乏实时告警与根因智能诊断（AI 辅助）。\n\n### 1.2 北极星指标 (North Star Metrics)\n- **集团核心管控指标自动采集率**：首期 $\\ge 85\\%$，终期 $\\ge 98\\%$\n- **碳核算与绿电消纳报告生成耗时**：从传统 **5 人天/厂** 降至 **分钟级一键秒出**\n- **异常用能与超标排放发现定位时效**：由 **月度事后复盘** 提升至 **15 分钟内实时预警闭环**\n\n### 1.3 用户画像矩阵 (Target Personas)\n| 角色画像 | 典型用户 | 核心诉求 | 核心操作场景 |\n| :--- | :--- | :--- | :--- |\n| **集团高管 / 决策层** | 倪总 / 李总 | 宏观掌握集团 15 个园区零碳转型进程、能耗总量、绿电收益与对外参观展示 | 驾驶舱大屏、GIS 全局下钻、月度智能报告 |\n| **集控中心管理员** | 孙彩平 / 魏翔宇 | 集中监控 21 家工厂 65+ 项管控指标、异常指标定位、绿电消纳报告生成、因子与费价维护 | 集中监管、指标管控二级下钻、绿电消纳报告审核、因子库版本重算 |\n| **工厂能碳专员** | 各分厂工程师 | 上报缺失手工数据（气/水/产值）、处理能耗超标告警、查看本厂工序单耗与对标排名 | 线下数据填报、告警确认与闭环、工序能耗实时监测 |\n| **碳资产与合规专员** | 碳足迹业务员 | 产品碳足迹建模、实景数据库溯源、CBAM 申报资料合规包导出、第三方核查归档 | 碳足迹集采中心、CBAM 管理、核查材料导出 |\n\n### 1.4 功能范围界定 (Scope Boundaries)\n- **In-Scope (本次交付范围)**：\n  1. **零碳园区集控中心**：大屏驾驶舱、集中监管（指标管控、在线监测、绿电监测）、能耗能效分析（用能结构、成本分析、单耗分析、单位产值能耗、对标管理）、碳管理（碳核算、碳分析、碳报告）、零碳项目评估（档案、模型、效益评估、园区自评估）、统计报表、告警闭环（规则、处理、推送）、基础配置（账号权限、碳排因子、费价模型、折标煤系数、接口配置、手工数据录入）、智能助手（语音控制、智能问数、AI 根因分析）。\n  2. **产品碳足迹集采中心**：全景驾驶舱、多维分析（型号对比、碳热点）、实景数据库、CBAM 专区、认证管理、因子库同步与下发、数据采集清单。\n- **Out-of-Scope (明确延期或外部系统集成)**：\n  - 各分厂底层 SCADA/DCS/MES 控制系统的写控制（仅作单向数据读取与监测，不下发设备启停指令）；\n  - 碳配额二级交易市场实时买卖结算（仅支持绿证/绿电交易量录入与抵消核算）。\n\n### 1.5 核心 User Stories (Gherkin 规范)\n\n#### US-01: 经营单位与工厂指标多级下钻与 AI 根因分析\n```gherkin\nFeature: 指标管控多级树下钻与异常根因诊断\n  Scenario: 集团管理员查看沈变公司单位产品能耗并获取 AI 归因\n    Given 集团管理员已登录集控中心并打开“指标管控”页面\n    When 管理员在左侧组织树展开“沈变公司”，选中“沈变本部”\n    And 筛选时间维度为“2026年8月”，点击“单位产品能耗”卡片\n    Then 系统展开二级指标详情页，显示当前值、基准值、标杆值、计算公式及参与运算的源数据\n    And 页面下方以红色高亮标注同比上涨 12.5%（异常状态）\n    And 页面右侧 AI 助手自动生成诊断结论：“本月干燥工序蒸汽能耗异常偏高，主要原因为 2 号干燥罐密封胶条老化导致热损增加 18%”。\n```\n\n#### US-02: 绿电消纳核算与报告自动化生成\n```gherkin\nFeature: 绿电消纳核算与标准化报告导出\n  Scenario: 管理员按月生成衡变本部绿电消纳报告\n    Given 衡变本部的光伏发电量、储能充放电、市电购电数据已完成汇总\n    When 用户进入“绿电监测”模块，切换至“绿电消纳报告”Tab\n    And 选择统计周期为“2026-07-01 至 2026-07-31”并点击“生成报告”\n    Then 系统自动拆解电量流向（光伏自发自用、光伏充储能、储能放电供给负荷、余电上网、电网购电）\n    And 依据标准公式计算出“绿电本地消纳率 92.4%”、“用电侧绿电占比 38.6%”\n    And 支持一键导出符合集团审计规范的 PDF / Word 格式报告。\n```\n\n### 1.6 功能优先级矩阵 (RICE 框架评估)\n| 模块序号 | 功能模块 | 核心内容 | Reach | Impact | Confidence | Effort | RICE 得分 | 优先级 |\n| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |\n| **M1** | **集中监管** | 65+ 项管控指标卡片、左侧树下钻、同环比与标杆比、在线监测、绿电监测 | 1500人/月 | Massive (3) | 95% | 3 人周 | **1425** | **P0 (Must)** |\n| **M2** | **碳管理 & 因子库** | 范围一/二碳核算引擎、因子多版本管理与历史重算、国标模版报告 | 800人/月 | Massive (3) | 90% | 2.5 人周 | **864** | **P0 (Must)** |\n| **M3** | **数据接入与录入** | 多厂接口配置管理、字段映射、线下人工补录表单与权限隔离 | 1200人/月 | High (2) | 90% | 2 人周 | **1080** | **P0 (Must)** |\n| **M4** | **能耗能效分析** | 桑基能流图、能源成本、产品单耗/产值能耗矩阵、对标榜单 | 1000人/月 | High (2) | 85% | 2 人周 | **850** | **P1 (Should)** |\n| **M5** | **大屏驾驶舱** | GIS 地图、15 园区成果对比、转型里程碑时间轴 | 2000人/月 | Medium (1.5) | 90% | 2 人周 | **1350** | **P1 (Should)** |\n| **M6** | **产品碳足迹与CBAM** | 实景数据库、CBAM 合规包、摇篮到大门工单溯源 | 600人/月 | High (2) | 80% | 2.5 人周 | **384** | **P1 (Should)** |\n| **M7** | **告警与闭环** | 多维阈值规则引擎、超时升级、工单状态流转、企业微信推送 | 800人/月 | High (2) | 85% | 1.5 人周 | **906** | **P1 (Should)** |\n| **M8** | **智能助手 (AI)** | 语音唤醒、自然语言智能问数、语音页面直达、AI 根因分析 | 500人/月 | Medium (1.5) | 80% | 1.5 人周 | **400** | **P2 (Could)** |\n\n---\n\n## 2. 🎨 UI/UX 视觉体系与交互设计规范\n\n### 2.1 整体设计风格定位\n采用**现代工业科技风 (Industrial Cyber Dark Mode + Crisp Light Mode 双模态)**，主色调以工业石板灰深色为底，融合**低碳翡翠绿 (Emerald Green)** 与 **智控科技蓝 (Cyan Blue)**，重点数据以 **警示琥珀金 (Amber)** 与 **危险绯红 (Crimson)** 呈现。\n\n```mermaid\ngraph TD\n    subgraph DesignSystem[\"Design Tokens & Visual Hierarchy\"]\n        Background[\"深空底色: #0b1120 / #0f172a\"]\n        Surface[\"Bento 卡片底色: #1e293b (Border: #334155)\"]\n        PrimaryAccent[\"低碳主色: #10b981 (Emerald 500)\"]\n        SecondaryAccent[\"科技辅色: #0284c7 (Sky 600)\"]\n        KPIExcellent[\"优秀/标杆: #22c55e (Green)\"]\n        KPINormal[\"正常达标: #38bdf8 (Light Blue)\"]\n        KPIWarning[\"超标异常: #ef4444 (Crimson Red)\"]\n    end\n```\n\n### 2.2 信息架构与导航层级 (Information Architecture)\n1. **顶层双中心平台切换 (Platform Switcher)**：\n   - 🌐 **零碳园区集控中心** (`/zero-carbon`)\n   - 🍃 **产品碳足迹集采中心** (`/carbon-footprint`)\n2. **左侧动态组织架构树 (Org Filter Tree)**：\n   - 集团 $\\rightarrow$ 一级经营单位（沈变、衡变、新变、鲁缆、新缆、德缆） $\\rightarrow$ 二级项目公司（沈变本部、和新套管、超高压、天变等） $\\rightarrow$ 关键工序 / 重点设备（干燥罐、拉丝机、交联线、测试站）。\n   - 支持实时拼音/汉字快捷搜索过滤，未接入项目公司以置灰（Disabled）但可查看静态台账状态展示。\n3. **Bento Grid 卡片式信息排布**：\n   - 顶部：全局时间粒度选择器（日/月/年） + 采样频率（15/30/60min） + 核心 KPI 概览（综合能耗、碳排放、绿电占比、单耗）。\n   - 中部：左侧折线/面积趋势图（用电负荷、正向有功电能） + 右侧尖峰平谷环形分布与日/月堆叠柱状图。\n   - 底部：各关键测点/工序实时数据表格 + AI 诊断卡片。\n\n### 2.3 Design Tokens 规范定义\n```json\n{\n  \"theme\": {\n    \"colors\": {\n      \"bg-base\": \"hsl(222, 47%, 7%)\",\n      \"bg-surface\": \"hsl(217, 33%, 12%)\",\n      \"bg-surface-hover\": \"hsl(217, 33%, 17%)\",\n      \"border-default\": \"hsl(217, 24%, 22%)\",\n      \"primary-green\": \"hsl(160, 84%, 39%)\",\n      \"accent-blue\": \"hsl(199, 89%, 48%)\",\n      \"kpi-good\": \"hsl(142, 71%, 45%)\",\n      \"kpi-alert\": \"hsl(0, 84%, 60%)\",\n      \"kpi-warn\": \"hsl(38, 92%, 50%)\"\n    },\n    \"spacing\": { \"xs\": \"4px\", \"sm\": \"8px\", \"md\": \"16px\", \"lg\": \"24px\", \"xl\": \"32px\" },\n    \"radius\": { \"sm\": \"4px\", \"md\": \"8px\", \"lg\": \"12px\", \"xl\": \"16px\" },\n    \"shadow\": {\n      \"card\": \"0 4px 20px -2px rgba(0, 0, 0, 0.5)\",\n      \"glow-green\": \"0 0 15px rgba(16, 185, 129, 0.25)\"\n    }\n  }\n}\n```\n\n### 2.4 组件状态矩阵 (Component State Matrix)\n| 组件类型 | 正常态 (Normal) | 悬停态 (Hover) | 激活/选中态 (Active) | 聚焦态 (Focus a11y) | 异常态 (Error/Alert) | 加载态 (Loading) |\n| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n| **指标卡片** | 背景 `#1e293b`，边框 `#334155` | 边框高亮 `#10b981`，微浮 2px | 翡翠绿阴影 Glow 边框 | 2px 科技蓝外圈 Outline | 红色呼吸边框闪烁 | 骨架屏 Skeleton 流光 |\n| **左侧组织树节点** | 文字 `#94a3b8`，透明背景 | 背景 `rgba(255,255,255,0.05)` | 背景 `rgba(16,185,129,0.15)` 文字 `#10b981` | 键盘 Tab 蓝圈 | 置灰 `#64748b` (未接入) | 节点微型 Spinner |\n| **主操作 CTA 按钮** | 翡翠绿渐变实色 | 亮度 110%，Scale(1.02) | 深度按下 Scale(0.98) | 2px 蓝白双环 Ring | 禁用置灰 + `not-allowed` | 内嵌 16px 圆形 Spinner |\n\n---\n\n## 3. 🛠️ 技术架构师 (Architect) 系统总体架构与 API 契约\n\n### 3.1 领域驱动设计 (DDD Bounded Contexts)\n系统划分为 **6 大领域界限上下文**：\n1. **组织与资产拓扑域 (Org & Asset Domain)**：管理 15 园区、6 大经营单位、21 家工厂、车间、产线、工序、表计测点四级层级。\n2. **能源在线采集域 (Energy Ingestion & Telemetry Domain)**：处理水、电、气、蒸汽、光伏、储能、市电的秒级/分钟级实时时序流。\n3. **指标与核算管控域 (Indicator & Carbon Calculation Domain)**：负责 65+ 项管控指标（单耗、产值比、折标煤、碳足迹）定时计算与版本追溯。\n4. **碳资产与报告域 (Carbon Asset & Report Domain)**：因子库多版本管理、费价模型、国标碳核算报告生成与第三方核查材料包导出。\n5. **智能诊断与告警域 (Diagnosis & Alert Domain)**：阈值规则引擎、超时升级调度、大模型智能归因与问数引擎。\n6. **产品碳足迹与 CBAM 域 (LCA & CBAM Domain)**：BOM 工单级碳足迹穿透、实景背景数据库、CBAM 出口申报。\n\n### 3.2 C4 模型：系统容器架构图 (Container Level)\n```mermaid\ngraph TB\n    subgraph DataSources[\"数据采集与接入层 (Edge / Plant Level)\"]\n        SCADA[\"各分厂能源系统 / SCADA (MQTT / HTTP)\"]\n        MES[\"各分厂 MES / ERP (工单产量 / 产值)\"]\n        Manual[\"人工填报前端 (手工录入无表计数据)\"]\n    end\n\n    subgraph GatewayLayer[\"网关与安全控制层\"]\n        Nginx[\"Nginx / Kong API Gateway (HTTPS TLS 1.3)\"]\n        AuthCenter[\"OAuth2 / JWT / RBAC 鉴权拦截器\"]\n    end\n\n    subgraph CoreServices[\"核心应用微服务集群 (Cluster Services)\"]\n        OrgService[\"组织与权限服务 (Org & Auth)\"]\n        TelemetryService[\"时序采集流服务 (Telemetry Ingestion)\"]\n        CalcEngine[\"指标与碳排核算引擎 (Calc Worker)\"]\n        ReportService[\"报表与报告导出服务 (Report Generator)\"]\n        AlertEngine[\"告警规则与推送服务 (Alert Manager)\"]\n        AIAssistantService[\"AI 智能体问数与归因服务 (LLM Agent)\"]\n    end\n\n    subgraph StorageLayer[\"持久化与缓存集群 (Storage & Cache)\"]\n        MySQL[(MySQL 8.0 主备<br/>业务元数据 / 组织 / 因子 / 规则)]\n        IoTDB[(TDengine / IoTDB<br/>时序量测数据 / 秒级分钟级电水气)]\n        Redis[(Redis 7.0 集群<br/>分布式锁 / 实时指标 / 热点缓存)]\n        MinIO[(MinIO 对象存储<br/>核查材料 / PDF报告 / 模型文件)]\n        MQ{{Kafka / RabbitMQ<br/>异步削峰 / 测点上报消息队列}}\n    end\n\n    DataSources -->|TLS 加密上送| Nginx\n    Nginx --> AuthCenter\n    AuthCenter --> CoreServices\n\n    TelemetryService --> MQ\n    MQ --> CalcEngine\n    CoreServices --> MySQL\n    TelemetryService --> IoTDB\n    CalcEngine --> IoTDB\n    CoreServices --> Redis\n    ReportService --> MinIO\n```\n\n### 3.3 核心数据库 DDL 设计 (MySQL 8.0 规范)\n\n```sql\n-- 1. 组织架构与园区工厂表\nCREATE TABLE `t_org_unit` (\n    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',\n    `unit_code` VARCHAR(64) NOT NULL COMMENT '组织编码',\n    `unit_name` VARCHAR(128) NOT NULL COMMENT '组织名称',\n    `unit_level` TINYINT NOT NULL COMMENT '层级: 1-集团, 2-一级经营单位, 3-二级项目公司, 4-车间/产线',\n    `parent_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '父级ID',\n    `park_name` VARCHAR(128) DEFAULT NULL COMMENT '所属零碳园区名称',\n    `is_connected` TINYINT NOT NULL DEFAULT 1 COMMENT '是否本次接入: 1-已接入, 0-置灰未接入',\n    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),\n    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),\n    PRIMARY KEY (`id`),\n    UNIQUE KEY `uk_unit_code` (`unit_code`),\n    KEY `idx_parent_level` (`parent_id`, `unit_level`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='组织架构与园区工厂台账表';\n\n-- 2. 65+ 项能碳管控指标定义与基准值表\nCREATE TABLE `t_indicator_meta` (\n    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '指标ID',\n    `indicator_code` VARCHAR(64) NOT NULL COMMENT '指标英文标识',\n    `indicator_name` VARCHAR(128) NOT NULL COMMENT '指标中文名',\n    `category` VARCHAR(64) NOT NULL COMMENT '指标类别: 碳排放/综合能耗/单位产品能耗/单位产值能耗/关键工序/绿电',\n    `unit` VARCHAR(32) NOT NULL COMMENT '计量单位(如 tce/万元, kWh/t, %)',\n    `center_type` ENUM('集控', '集采') NOT NULL DEFAULT '集控' COMMENT '所属中心',\n    `calc_formula` TEXT NOT NULL COMMENT '计算公式表达式文本',\n    `calc_period` ENUM('REALTIME', 'DAY', 'MONTH', 'YEAR') NOT NULL DEFAULT 'MONTH' COMMENT '核算周期',\n    `standard_value` DECIMAL(14, 4) DEFAULT NULL COMMENT '国家/行业标杆值',\n    `benchmark_value` DECIMAL(14, 4) DEFAULT NULL COMMENT '集团内部基准值',\n    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),\n    PRIMARY KEY (`id`),\n    UNIQUE KEY `uk_indicator_code` (`indicator_code`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='指标元数据与基准配置表';\n\n-- 3. 指标核算结果与快照表\nCREATE TABLE `t_indicator_record` (\n    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',\n    `org_unit_id` BIGINT UNSIGNED NOT NULL COMMENT '所属组织工厂ID',\n    `indicator_id` BIGINT UNSIGNED NOT NULL COMMENT '指标ID',\n    `period_date` VARCHAR(16) NOT NULL COMMENT '统计周期标签 (如 2026-08 或 2026-08-21)',\n    `actual_value` DECIMAL(16, 4) NOT NULL COMMENT '实际计算值',\n    `yoy_delta_rate` DECIMAL(8, 4) DEFAULT NULL COMMENT '同比变化率(%)',\n    `mom_delta_rate` DECIMAL(8, 4) DEFAULT NULL COMMENT '环比变化率(%)',\n    `status` ENUM('EXCELLENT', 'NORMAL', 'ALERT') NOT NULL DEFAULT 'NORMAL' COMMENT '判定状态',\n    `raw_payload` JSON DEFAULT NULL COMMENT '参与计算的原始入参快照(溯源JSON)',\n    `ai_reasoning` TEXT DEFAULT NULL COMMENT 'AI生成的异常归因结论',\n    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),\n    PRIMARY KEY (`id`),\n    UNIQUE KEY `uk_unit_ind_period` (`org_unit_id`, `indicator_id`, `period_date`),\n    KEY `idx_period_status` (`period_date`, `status`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='指标周期核算结果与归因表';\n```\n\n### 3.4 OpenAPI 3.0 接口契约规范示例\n\n```yaml\nopenapi: 3.0.3\ninfo:\n  title: 特变电工“双中心”能碳管控接口契约\n  version: 1.0.0\npaths:\n  /api/v1/zero-carbon/indicators/overview:\n    get:\n      summary: 查询指定工厂的全部管控指标概览与状态\n      parameters:\n        - name: orgUnitId\n          in: query\n          required: true\n          schema:\n            type: integer\n        - name: period\n          in: query\n          required: true\n          schema:\n            type: string\n            example: \"2026-08\"\n      responses:\n        '200':\n          description: 成功返回指标矩阵与同环比\n          content:\n            application/json:\n              schema:\n                type: object\n                properties:\n                  code: { type: string, example: \"SUCCESS\" }\n                  data:\n                    type: array\n                    items:\n                      type: object\n                      properties:\n                        indicatorId: { type: integer }\n                        name: { type: string }\n                        actualValue: { type: number }\n                        unit: { type: string }\n                        yoyRate: { type: number }\n                        status: { type: string, enum: [EXCELLENT, NORMAL, ALERT] }\n                        aiReasoning: { type: string }\n\n  /api/v1/zero-carbon/telemetry/ingest:\n    post:\n      summary: 分厂边缘网关批量上报表计量测数据\n      headers:\n        X-Plant-AppKey:\n          schema: { type: string }\n          required: true\n      requestBody:\n        required: true\n        content:\n          application/json:\n            schema:\n              type: object\n              properties:\n                plantCode: { type: string, example: \"SB-01\" }\n                timestamp: { type: integer, example: 1787572800000 }\n                metrics:\n                  type: array\n                  items:\n                    type: object\n                    properties:\n                      meterCode: { type: string }\n                      energyType: { type: string, enum: [POWER, WATER, GAS, STEAM] }\n                      value: { type: number }\n      responses:\n        '200':\n          description: 上报成功\n```\n\n---\n\n## 4. 💻 前端工程师 (Frontend) 组件树与状态管理方案\n\n### 4.1 现代前端架构体系\n- **框架与构建**：Next.js 15/16 (App Router) + React 19 + TypeScript 5.7+\n- **样式与组件库**：Tailwind CSS v4 + Radix UI / Base UI + Lucide React 图标体系\n- **图表与可视化**：Recharts 3.x + ECharts 5.x (支持桑基能流图、GIS 园区地图、负荷热力图)\n- **状态管理**：\n  - **Server State (异步服务端状态)**：TanStack Query v5（负责数据缓存、自动 Stale 刷新、轮询）\n  - **Client State (客户端交互状态)**：Zustand（负责双中心模式切换、左侧组织树展开/选中、全局时间筛选器、主题模式）\n\n### 4.2 前端目录与组件树架构\n```text\nsrc/\n├── app/\n│   ├── (auth)/login/\n│   ├── zero-carbon/                     # 零碳园区集控中心\n│   │   ├── screen/page.tsx              # 1. 驾驶舱大屏\n│   │   ├── monitor/\n│   │   │   ├── indicator/page.tsx       # 2.1 指标管控 (65+指标矩阵与下钻)\n│   │   │   ├── online/page.tsx          # 2.2 在线监测 (电/水/气/新能源)\n│   │   │   └── green/page.tsx           # 2.3 绿电监测与消纳报告\n│   │   ├── energy/                      # 3. 能耗能效分析 (结构/成本/单耗/产值/对标)\n│   │   ├── carbon/                      # 4. 碳管理 (核算/分析/报告)\n│   │   ├── project/                     # 5. 零碳项目评估\n│   │   ├── reports/                     # 6. 统计报表\n│   │   ├── alarm/                       # 7. 告警管理\n│   │   ├── config/                      # 8. 基础配置\n│   │   └── assistant/page.tsx           # 9. 智能助手\n│   └── carbon-footprint/                # 产品碳足迹集采中心\n│       ├── cockpit/page.tsx\n│       ├── analysis/page.tsx\n│       ├── database/page.tsx\n│       ├── cbam/page.tsx\n│       └── factor/page.tsx\n├── components/\n│   ├── layout/                          # 平台外壳、顶栏切换、左侧树\n│   │   ├── PlatformShell.tsx\n│   │   ├── OrgTreeNav.tsx\n│   │   └── TopHeader.tsx\n│   ├── charts/                          # 图表封装\n│   │   ├── EnergySankeyChart.tsx        # 能流桑基图\n│   │   ├── PowerLoadCurve.tsx           # 负荷与正向有功电能曲线\n│   │   └── PeakValleyDonut.tsx          # 尖峰平谷占比环形图\n│   └── shared/                          # 基础卡片、模态框、时间选择器\n└── store/\n    ├── useOrgStore.ts                   # 组织选择状态\n    └── useTimeRangeStore.ts             # 时间粒度状态\n```\n\n### 4.3 Web Vitals 性能优化保证\n1. **LCP < 1.5s**：大屏核心 KPI 与关键图表采用 Next.js SSR 预渲染骨架，图表组件按需 `next/dynamic` 懒加载；\n2. **INP < 80ms**：左侧组织树 200+ 节点及 65+ 指标卡片列表引入虚拟化渲染 (`@tanstack/react-virtual`)，搜索过滤结合 `useDeferredValue` 降级，杜绝主线程卡顿；\n3. **CLS < 0.02**：所有图表容器、指标 Card、Tab 栏严格声明固定高度与 Min-Height，防止动态数据加载时页面抖动。\n\n---\n\n## 5. ⚙️ 后端工程师 (Backend) 控制流、核算引擎与缓存策略\n\n### 5.1 能碳自动核算引擎核心控制流\n```mermaid\ngraph TD\n    Trigger([定时触发器 / 手工重新核算]) --> Lock[获取 Redis 分布式锁 lock:calc:org_period]\n    Lock --> CheckLock{获取成功?}\n    CheckLock -->|No| Reject[返回任务正在执行中 429]\n    CheckLock -->|Yes| FetchData[从 IoTDB/MySQL 拉取该工厂电/气/水/产值/产量原始数据]\n    \n    FetchData --> FetchFactor[获取生效版本的折标煤系数 & 省级电力碳排放因子]\n    FetchFactor --> ExecFormula[执行 65 项数学核算公式]\n    \n    ExecFormula --> Evaluate[与国标标杆值 / 集团基准值比对, 计算同比/环比]\n    Evaluate --> CheckAnomaly{偏差 > 阈值?}\n    CheckAnomaly -->|Yes| CallAI[调用大模型 AI 归因 Agent, 生成异常原因]\n    CheckAnomaly -->|No| SaveDB[事务写入 t_indicator_record 快照]\n    CallAI --> SaveDB\n    \n    SaveDB --> EvictCache[清空并刷新 Redis 缓存 cache:indicators:org_unit]\n    EvictCache --> ReleaseLock[释放 Redis 分布式锁]\n```\n\n### 5.2 Redis 缓存与防御策略\n| Key 格式 | 数据结构 | TTL | 策略设计 |\n| :--- | :--- | :--- | :--- |\n| `cache:org:tree` | String (JSON) | 24h + 随机扰动 2h | **防雪崩**：基础组织树加随机 Jitter；节点修改时主动失效 |\n| `cache:ind:overview:{unitId}:{period}` | Hash | 30m + 随机扰动 5m | **防击穿**：热点查询互斥锁 (Mutex)，未命中时回源 DB |\n| `lock:calc:{unitId}:{period}` | String (UUID) | 30s (支持看门狗续期) | **防并发写**：Redlock 保证单工厂同周期核算任务绝对串行 |\n| `cache:null:plant:{code}` | String (\"EMPTY\") | 5m | **防穿透**：针对非法查询缓存空对象，外层布隆过滤器拦截 |\n\n### 5.3 统一错误码规范\n- `1001_AUTH_INVALID_TOKEN`: 鉴权凭证失效或无权限访问该工厂\n- `2001_DATA_METER_OFFLINE`: 关键工序表计离线，无法计算自动采集率\n- `3001_CALC_FACTOR_NOT_FOUND`: 当前核算周期未找到生效的碳排因子版本\n- `4001_AI_REASONING_TIMEOUT`: AI 归因大模型响应超时，已降级为基础告警规则\n\n---\n\n## 6. 🔒 网络安全工程师 (Security) STRIDE 威胁建模与防护\n\n### 6.1 STRIDE 威胁建模与应对矩阵\n| STRIDE 威胁类型 | 工业能碳场景风险点 | 防护措施与合规实现 |\n| :--- | :--- | :--- |\n| **Spoofing (身份伪造)** | 伪造边缘工厂网关上送虚假低能耗数据 | 边缘网关接入统一强制 `X-Plant-AppKey` + HMAC-SHA256 签名校验，双向 TLS 1.3 |\n| **Tampering (数据篡改)** | 篡改碳排因子历史版本使工厂违规达标 | 因子库变更必须经集团多级审批流，核心核算结果生成 SHA-256 审计哈希链，篡改即报警 |\n| **Repudiation (抵赖性)** | 工厂管理员拒不承认超标用能告警已确认 | 告警确认与处理措施记录完整操作日志（用户 ID、IP、时间戳、留痕快照），不可伪造 |\n| **Information Disclosure (信息泄露)** | 变压器/电缆核心工艺产能数据被越权窃取 | 多租户与分厂严格基于 RBAC+ABAC 隔离，沈变无法查看衡变敏感产值数据；传输全链路加密 |\n| **Denial of Service (拒绝服务)** | 边缘网关异常高频重发瘫痪集控中心 | 网关层部署令牌桶限流（单工厂限流 100 QPS），超出自动排队熔断 |\n| **Elevation of Privilege (特权提升)** | 分厂普通操作员越权修改集团全局折标煤系数 | 严格接口层权限注解校验，写操作必须校验 `ROLE_GROUP_ADMIN` 权限 |\n\n---\n\n## 7. 🚀 DevOps / SRE 运维与容器化部署方案\n\n### 7.1 SRE 四大黄金指标保障 (Golden Signals)\n- **可用性 (Availability)**：SLA $\\ge 99.95\\%$（年故障停机时间 $< 4.38$ 小时）\n- **延迟 (Latency)**：大屏与综合看板 P95 响应时间 $< 500\\text{ms}$，时序曲线查询 $< 800\\text{ms}$\n- **流量 (Traffic)**：支持每秒 2,000+ 测点高并发并发摄入\n- **错误率 (Error Rate)**：HTTP 5xx 错误率 $< 0.01\\%$\n\n### 7.2 生产级 Multi-stage Dockerfile\n```dockerfile\n# Stage 1: Build\nFROM node:20-alpine AS builder\nWORKDIR /app\nRUN npm install -g pnpm\nCOPY package.json pnpm-lock.yaml* ./\nRUN pnpm install --frozen-lockfile\nCOPY . .\nRUN pnpm build\n\n# Stage 2: Production Runner\nFROM node:20-alpine AS runner\nWORKDIR /app\nENV NODE_ENV=production\nRUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs\nCOPY --from=builder /app/public ./public\nCOPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./\nCOPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static\nUSER nextjs\nEXPOSE 3000\nENV PORT=3000\nCMD [\"node\", \"server.js\"]\n```\n\n### 7.3 CI/CD 与高可用 K8s 部署\n- **流水线**：GitLab CI / GitHub Actions 自动化执行 Lint $\\rightarrow$ Unit Test $\\rightarrow$ Docker Build $\\rightarrow$ 镜像漏洞扫描 $\\rightarrow$ 金丝雀发布 (Canary 10% $\\rightarrow$ 50% $\\rightarrow$ 100%)。\n- **K8s 韧性**：微服务配置 HPA（CPU > 70% 自动扩容至 10 Pods），配置 `PodDisruptionBudget` 保证升级时无感知零宕机。\n\n---\n\n## 8. 🧪 测试工程师 (QA) 测试矩阵与高风险规避方案\n\n### 8.1 边界值 (BVA) 与等价类 (EQP) 测试用例矩阵\n| 用例编号 | 测试模块 | 输入条件与边界 | 预期结果与容错逻辑 |\n| :--- | :--- | :--- | :--- |\n| **TC-CALC-01** | 单位产品能耗核算 | 某工厂月度产量 $M = 0$（当月停产检修） | 系统自动识别除零边界，捕获为特殊状态，提示“当月停产无单耗”，不抛出 NaN/Exception |\n| **TC-CALC-02** | 关键数据采集率 | 理论装表数 $N_l = 100$，实际自动采集 $N_s = 105$（超额配置） | 自动采集率按 $100\\%$ 封顶，并告警提示“实际表计超出理论规划台账” |\n| **TC-GREEN-01** | 绿电消纳平衡 | 光伏发电量 100万kWh，直接消纳 60万 + 充储 30万 + 上网 20万 (总量 110万 > 100万) | 数据一致性校验拦截，标红提示电量不守恒，阻断报告生成并通知管理员排查 |\n| **TC-DATA-01** | 手工数据补录 | 工业增加值输入负数或非法字符串 `abc` | 前端强类型 Schema 拦截 + 后端 JSR-303 / Zod 二次校验拦截，拒绝写入 |\n\n### 8.2 高并发压力测试指标\n- **压测工具**：JMeter / k6\n- **并发场景**：首批 5 家工厂 $\\times$ 100 测点同时在整点触发分钟级数据上报（模拟 2,000 QPS 突发流量）\n- **合格标准**：无请求丢失，消息队列无堆积，数据入库落库延时 $< 2$ 秒。\n\n---\n\n## 9. 总结与后续原型开发建议 (Next Steps)\n\n1. **原型架构就绪**：当前工程中已具备完备的 Next.js 16 原型工程底座，已定义 65+ 管控指标模型 (`lib/indicators.ts`) 与组织结构树 (`lib/org.ts`)。\n2. **高优先级开发路线**：\n   - 第一阶段（当前）：围绕 **集中监管**（指标管控二级下钻、在线监测多能源图表、绿电消纳报告）、**能耗能效分析**（桑基图与单耗矩阵）完善高保真交互与可视化。\n   - 第二阶段（下周）：打通 **碳核算模型配置** 与 **人工数据补录表单**。\n   - 第三阶段（9月上旬）：集成 **智能问数 Assistant** 与 **告警闭环流转**，准备 9 月 15 日终版汇报交付。\n"
  },
  {
    "id": "manual-02",
    "no": 2,
    "filename": "02_系统总体架构设计与C4规范.md",
    "title": "系统总体架构设计与C4规范",
    "category": "总体架构与工程底座",
    "readTime": "12 分钟",
    "wordCount": 5917,
    "summary": "1. **DDD 领域驱动设计 (Domain-Driven Design)**：系统划分为 6 大界限上下文（组织拓扑域、能源采集域、指标核算域、碳资产域、诊断告警域、产品碳足迹域），严格定义聚合根 (Aggregate Root) 与值",
    "headings": [
      {
        "level": 2,
        "title": "1. 架构设计哲学与原则 (Architectural Principles)",
        "id": "1-架构设计哲学与原则-architectural-principles"
      },
      {
        "level": 2,
        "title": "2. C4 架构模型",
        "id": "2-c4-架构模型"
      },
      {
        "level": 3,
        "title": "2.1 System Context (系统上下文)",
        "id": "2-1-system-context-系统上下文"
      },
      {
        "level": 3,
        "title": "2.2 Container Diagram (容器架构图)",
        "id": "2-2-container-diagram-容器架构图"
      },
      {
        "level": 2,
        "title": "3. 数据库核心 DDL 规范 (MySQL 8.0)",
        "id": "3-数据库核心-ddl-规范-mysql-8-0"
      }
    ],
    "content": "# 🛠️ 系统总体架构设计与 C4 模型规范手册\n\n## 1. 架构设计哲学与原则 (Architectural Principles)\n1. **DDD 领域驱动设计 (Domain-Driven Design)**：系统划分为 6 大界限上下文（组织拓扑域、能源采集域、指标核算域、碳资产域、诊断告警域、产品碳足迹域），严格定义聚合根 (Aggregate Root) 与值对象。\n2. **读写分离与分层存储 (Polyglot Persistence)**：\n   - 关系型业务数据（组织、因子、费价、规则、用户）：**MySQL 8.0 主备**；\n   - 海量高频时序量测数据（秒级/分钟级电、水、气、光伏、储能采样）：**时序数据库 TDengine / IoTDB**；\n   - 热点数据与并发控制：**Redis 7.0 分布式集群 (Redlock + 缓存防御)**；\n   - 文件与报告归档：**MinIO 对象存储**。\n3. **高可用 SLA 保证 (99.95%)**：无单点故障 (No SPOF)，支持服务动态横向扩容与优雅降级。\n\n---\n\n## 2. C4 架构模型\n\n### 2.1 System Context (系统上下文)\n```mermaid\ngraph TD\n    UserDecision[集团决策层 / 领导层] -->|查看驾驶舱大屏与宏观报表| DualCenterPlatform[特变电工能碳管控双中心平台]\n    UserPlant[各分厂能碳工程师] -->|人工填报、处理异常告警| DualCenterPlatform\n    UserAdmin[集控中心管理员] -->|集中监管、因子与费价维护| DualCenterPlatform\n\n    DualCenterPlatform -->|时序数据摄入| PlantEdge[各分厂 SCADA / 能源管理系统]\n    DualCenterPlatform -->|产量/产值/工单对接| PlantMES[各分厂 MES / ERP 系统]\n    DualCenterPlatform -->|因子同步| GroupFactorSys[特变股份上级因子库]\n    DualCenterPlatform -->|报告导出与报送| ExtVerifier[第三方碳核查机构 / 欧盟 CBAM]\n```\n\n### 2.2 Container Diagram (容器架构图)\n```mermaid\ngraph TB\n    subgraph ClientTier[\"客户端层\"]\n        WebPC[Web 管理后台 (PC 端)]\n        Screen[大屏可视化驾驶舱 (4K)]\n        Mobile[企业微信 / 移动端通知]\n    end\n\n    subgraph GatewayTier[\"接入与网关层\"]\n        Kong[Kong / Nginx API Gateway<br/>(TLS 1.3, 鉴权, 令牌桶限流)]\n    end\n\n    subgraph ServiceMesh[\"核心微服务集群\"]\n        AuthSvc[认证与权限服务 (Auth Service)]\n        OrgSvc[组织与拓扑台账服务 (Org Service)]\n        TelemetrySvc[时序采集与数据摄入服务 (Telemetry Ingestion)]\n        CalcWorker[能碳指标计算引擎 (Calculation Worker)]\n        CarbonReportSvc[碳管理与报告服务 (Carbon & Report Service)]\n        AlertSvc[告警规则与闭环流转服务 (Alert Service)]\n        AIAssistantSvc[AI 智能问数与归因大模型服务 (LLM Agent)]\n    end\n\n    subgraph StorageTier[\"存储与消息中间件\"]\n        MySQL[(MySQL 8.0 主备集群)]\n        IoTDB[(TDengine / IoTDB 时序库)]\n        RedisCluster[(Redis 7.0 分布式集群)]\n        KafkaMQ{{Kafka 消息队列}}\n        MinIO[(MinIO 对象存储)]\n    end\n\n    ClientTier --> Kong\n    Kong --> ServiceMesh\n    TelemetrySvc --> KafkaMQ\n    KafkaMQ --> CalcWorker\n    ServiceMesh --> MySQL\n    TelemetrySvc --> IoTDB\n    CalcWorker --> IoTDB\n    ServiceMesh --> RedisCluster\n    CarbonReportSvc --> MinIO\n```\n\n---\n\n## 3. 数据库核心 DDL 规范 (MySQL 8.0)\n\n```sql\n-- 组织与工厂台账表\nCREATE TABLE `t_org_unit` (\n    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',\n    `unit_code` VARCHAR(64) NOT NULL COMMENT '组织编码',\n    `unit_name` VARCHAR(128) NOT NULL COMMENT '组织名称',\n    `unit_level` TINYINT NOT NULL COMMENT '层级: 1-集团, 2-一级经营单位, 3-二级项目公司, 4-车间/产线',\n    `parent_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '父级ID',\n    `park_name` VARCHAR(128) DEFAULT NULL COMMENT '所属零碳园区名称',\n    `is_connected` TINYINT NOT NULL DEFAULT 1 COMMENT '是否本次接入: 1-已接入, 0-置灰未接入',\n    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),\n    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),\n    PRIMARY KEY (`id`),\n    UNIQUE KEY `uk_unit_code` (`unit_code`),\n    KEY `idx_parent_level` (`parent_id`, `unit_level`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='组织架构与园区工厂台账表';\n\n-- 指标元数据表\nCREATE TABLE `t_indicator_meta` (\n    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '指标ID',\n    `indicator_code` VARCHAR(64) NOT NULL COMMENT '指标英文标识',\n    `indicator_name` VARCHAR(128) NOT NULL COMMENT '指标中文名',\n    `category` VARCHAR(64) NOT NULL COMMENT '指标类别: 碳排放/综合能耗/单位产品能耗/单位产值能耗/关键工序/绿电',\n    `unit` VARCHAR(32) NOT NULL COMMENT '计量单位',\n    `center_type` ENUM('集控', '集采') NOT NULL DEFAULT '集控' COMMENT '所属中心',\n    `calc_formula` TEXT NOT NULL COMMENT '计算公式表达式文本',\n    `calc_period` ENUM('REALTIME', 'DAY', 'MONTH', 'YEAR') NOT NULL DEFAULT 'MONTH' COMMENT '核算周期',\n    `standard_value` DECIMAL(14, 4) DEFAULT NULL COMMENT '国家/行业标杆值',\n    `benchmark_value` DECIMAL(14, 4) DEFAULT NULL COMMENT '集团内部基准值',\n    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),\n    PRIMARY KEY (`id`),\n    UNIQUE KEY `uk_indicator_code` (`indicator_code`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='指标元数据与基准配置表';\n\n-- 指标核算结果快照表\nCREATE TABLE `t_indicator_record` (\n    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',\n    `org_unit_id` BIGINT UNSIGNED NOT NULL COMMENT '所属组织工厂ID',\n    `indicator_id` BIGINT UNSIGNED NOT NULL COMMENT '指标ID',\n    `period_date` VARCHAR(16) NOT NULL COMMENT '统计周期标签 (如 2026-08)',\n    `actual_value` DECIMAL(16, 4) NOT NULL COMMENT '实际计算值',\n    `yoy_delta_rate` DECIMAL(8, 4) DEFAULT NULL COMMENT '同比变化率(%)',\n    `mom_delta_rate` DECIMAL(8, 4) DEFAULT NULL COMMENT '环比变化率(%)',\n    `status` ENUM('EXCELLENT', 'NORMAL', 'ALERT') NOT NULL DEFAULT 'NORMAL' COMMENT '判定状态',\n    `raw_payload` JSON DEFAULT NULL COMMENT '参与计算的原始入参快照',\n    `ai_reasoning` TEXT DEFAULT NULL COMMENT 'AI生成的异常归因结论',\n    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),\n    PRIMARY KEY (`id`),\n    UNIQUE KEY `uk_unit_ind_period` (`org_unit_id`, `indicator_id`, `period_date`),\n    KEY `idx_period_status` (`period_date`, `status`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='指标周期核算结果与归因表';\n\n-- 碳排因子多版本库\nCREATE TABLE `t_emission_factor` (\n    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',\n    `factor_code` VARCHAR(64) NOT NULL COMMENT '因子标识',\n    `factor_name` VARCHAR(128) NOT NULL COMMENT '因子名称 (如 全国电网平均因子/省级电力因子)',\n    `factor_value` DECIMAL(12, 6) NOT NULL COMMENT '因数值 (tCO2/MWh 或 kgCO2/kg)',\n    `unit` VARCHAR(32) NOT NULL COMMENT '单位',\n    `version_tag` VARCHAR(32) NOT NULL COMMENT '版本号 (如 2026-V1.0)',\n    `is_active` TINYINT NOT NULL DEFAULT 1 COMMENT '是否当前生效',\n    `source_reference` VARCHAR(255) DEFAULT NULL COMMENT '依据来源',\n    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),\n    PRIMARY KEY (`id`),\n    UNIQUE KEY `uk_factor_version` (`factor_code`, `version_tag`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='碳排放因子多版本管理表';\n```\n"
  },
  {
    "id": "manual-03",
    "no": 3,
    "filename": "03_65项能碳管控指标体系与计算引擎手册.md",
    "title": "65项能碳管控指标体系与计算引擎手册",
    "category": "总体架构与工程底座",
    "readTime": "6 分钟",
    "wordCount": 3153,
    "summary": "依据《特变电工“双中心”项目能碳管控指标体系 V1.4》，系统指标划分为三大层级：",
    "headings": [
      {
        "level": 2,
        "title": "1. 经营单位及工厂整体指标 (11项)",
        "id": "1-经营单位及工厂整体指标-11项"
      },
      {
        "level": 2,
        "title": "2. 产品管控指标 (型号级别, 5项)",
        "id": "2-产品管控指标-型号级别-5项"
      },
      {
        "level": 2,
        "title": "3. 关键工序管控指标精选 (49项)",
        "id": "3-关键工序管控指标精选-49项"
      }
    ],
    "content": "# 📊 65 项能碳管控指标体系与计算引擎手册\n\n依据《特变电工“双中心”项目能碳管控指标体系 V1.4》，系统指标划分为三大层级：\n1. **经营单位及项目公司整体指标**（11 项，重点对标国家级零碳工厂要求）；\n2. **产品管控指标**（5 项，最小细化到产品型号级别）；\n3. **关键工序管控指标**（49 项，分变压器、线缆、开关柜、套管、互感器、二次设备、电容电抗、GIL/GIS、硅钢等产业设置）。\n\n---\n\n## 1. 经营单位及工厂整体指标 (11项)\n\n| 序号 | 指标名称 | 计算公式与逻辑 | 计量单位 | 核算周期 | 标杆/基准要求 | 覆盖范围与数据源 |\n| :---: | :--- | :--- | :---: | :---: | :--- | :--- |\n| **1** | **产品碳足迹** | 引用 GB/T 24067、ISO 14067，摇篮到大门阶段产品碳足迹值 | tCO2/台套、tCO2/km | 实时/工单 | 应对 CBAM 与绿色招采 | 来源于本地碳足迹追踪系统与工单 BOM |\n| **2** | **开展产品碳足迹分析占比** | $R_{cf} = \frac{N_{cf}}{N} \times 100\\%$ ($N_{cf}$: 开展主要产品类别数, $N$: 类别总数) | % | 月度 | 国家级零碳工厂要求 | ERP 产品明细 + 本地碳足迹系统 |\n| **3** | **综合能源消费量** | $E = \\sum_{i=1}^{n} (E_i \times k_i)$ ($E_i$: 第 $i$ 种能源实物量, $k_i$: 折标煤当量系数) | tce | 月度 | 国家级零碳工厂要求 | 电、天然气、蒸汽、柴油等全能源自动/录入上送 |\n| **4** | **总碳排放量** | $C = C_{燃烧} + C_{过程} + C_{购电} - C_{出电} + C_{购热} - C_{出热} - C_{回收}$ | tCO2 | 月度 | 国家级零碳工厂要求 | 重点核算能源活动碳排放，电能取省级平均因子 |\n| **5** | **单位能耗碳排放** | $I = \frac{C}{E}$ ($C$: 总碳排 tCO2, $E$: 综合能耗 tce，电力按等价值折算) | tCO2/tce | 月度 | 国家级零碳工厂要求 | 分子分母范围严格一致 (等价值 $0.2856\text{ kgce/kWh}$) |\n| **6** | **非化石能源消费占比** | $r = \frac{R}{E} \times 100\\%$ ($R$: 非化石能源消费量，含交易绿电与绿证) | % | 月度 | 国家级零碳工厂要求 | 自建消纳 + 外部交易绿电/绿证 |\n| **7** | **非化石能源电力消费物理认定量占比** | $E_{ui} = \frac{E_z}{Q} \times 100\\%$ ($E_z$: 具备物理溯源绿电, $Q$: 总用电量) | % | 月度 | 交易绿电/绿证不计入分子 | 自建分布式光伏消纳 + 直连专线绿电 |\n| **8** | **单位工业增加值能耗** | $E_{nva} = \frac{E}{G_{nva}}$ ($E$: 综合能耗 tce, $G_{nva}$: 企业工业增加值 万元) | tce/万元 | 月度估算/年度汇算 | 国家级零碳工厂要求 | 财务月度报表录入工业增加值 |\n| **9** | **节能装备应用占比** | $S = \frac{R_{es}}{E_{ts}} \times 100\\%$ ($R_{es}$: 达到国标2级及以上额定总功率, $E_{ts}$: 装备总功率) | % | 月度/台账增量 | 国家级零碳工厂要求 | 设备台账管理模块增量上报 |\n| **10** | **关键能源数据自动采集率** | $R_p = \frac{N_s}{N_l} \times 100\\%$ ($N_s$: 有效自动采集表数, $N_l$: 理论应装表数) | % | 月度 | 特变电工计量管理标准 | 本地自动采集明细与应装表计台账对账 |\n| **11** | **单位产值能耗** | $g = \frac{E}{G}$ ($E$: 综合能耗 tce, $G$: 产品产值 万元) | tce/万元 | 月度/日更新 | 股份管理要求 | 变压器取经营日报系统，线缆取大数据平台 |\n\n---\n\n## 2. 产品管控指标 (型号级别, 5项)\n\n| 序号 | 指标名称 | 计算公式 | 计量单位 | 统计口径说明 |\n| :---: | :--- | :--- | :---: | :--- |\n| **12** | **单位产品能耗（型号）** | $e = \frac{E}{M}$ | tce/万kVA 或 tce/万km*mm² | 按产品订单归集关键工序计量，非关键工序按容量分摊 |\n| **13** | **单位产品电耗** | $q_{电} = \frac{Q_{电}}{M}$ | kWh/万kVA 或 kWh/万km*mm² | 统计期内车间电能消耗总量 / 订单合格产量 |\n| **14** | **单位产品蒸汽消耗** | $q_{蒸汽} = \frac{Q_{蒸汽}}{M}$ | GJ/万kVA 或 t/万kVA | 统计期内干燥/固化等蒸汽消耗量 / 订单合格产量 |\n| **15** | **单位产品天然气消耗** | $q_{天然气} = \frac{Q_{天然气}}{M}$ | m³/万kVA 或 m³/万km*mm² | 总表计量按月分摊至单产品型号 |\n| **16** | **单位产品水耗** | $q_{水} = \frac{Q_{水}}{M}$ | t/万kVA 或 t/万km*mm² | 总表计量按月分摊至单产品型号 |\n\n---\n\n## 3. 关键工序管控指标精选 (49项)\n\n1. **线缆产业（鲁缆、德缆、新缆）**：\n   - 吨铜电耗（拉丝工序）：$q = \frac{Q_{电}}{M_{Cu}}$ ($\text{kWh/t}$)\n   - 吨铝电耗（拉丝工序）：$q = \frac{Q_{电}}{M_{Al}}$ ($\text{kWh/t}$)\n   - 中低压交联电耗：$q = \frac{Q_{电}}{M_{线缆}}$ ($\text{kWh/km*mm²}$)\n   - 高压交联电耗：$q = \frac{Q_{电}}{M_{线缆}}$ ($\text{kWh/km*mm²}$)\n2. **变压器产业（沈变、衡变、新变）**：\n   - 干燥工序单位产值能耗/电耗/蒸汽耗：针对高压干燥罐、中低压油变干燥、干变固化分别核算；\n   - 变压器试验工序万元产值电耗与万kVA电耗；\n3. **开关与二次产业（云集电气、新疆自控、南京电研）**：\n   - 中低压开关柜钣金加工/喷涂万元产值电耗；\n   - 二次 SMT 贴片、高温老化、波峰焊万元产值电耗；\n4. **高端组件（合容电气、赛杰爱迪、珠峰硅钢）**：\n   - 电容器芯子卷绕/真空浸渍/试验单位产量电耗 ($\text{kWh/kvar}$)；\n   - 干式电抗器固化/试验电耗；\n   - GIL 螺旋焊管/测试/绝缘子电耗；\n   - GIS 抽真空/绝缘干燥/耐压试验/空调除湿电耗；\n   - 硅钢铁心纵剪/中大型叠装单位产量电耗 ($\text{kWh/t}$)。\n"
  },
  {
    "id": "manual-04",
    "no": 4,
    "filename": "04_API接口契约与数据接入规范.md",
    "title": "API接口契约与数据接入规范",
    "category": "总体架构与工程底座",
    "readTime": "4 分钟",
    "wordCount": 2238,
    "summary": "各分厂网关上送数据时必须在 HTTP Header 中携带 HMAC-SHA256 签名：",
    "headings": [
      {
        "level": 2,
        "title": "1. 边缘数据上送协议与安全签名 (Edge Gateway Ingestion)",
        "id": "1-边缘数据上送协议与安全签名-edge-gateway-ingestion"
      },
      {
        "level": 3,
        "title": "1.1 请求 Header 鉴权规范",
        "id": "1-1-请求-header-鉴权规范"
      },
      {
        "level": 3,
        "title": "1.2 边缘测点批量上送接口",
        "id": "1-2-边缘测点批量上送接口"
      },
      {
        "level": 2,
        "title": "2. 前端查询核心 API 契约 (OpenAPI 3.0)",
        "id": "2-前端查询核心-api-契约-openapi-3-0"
      },
      {
        "level": 3,
        "title": "2.1 集中监管 - 65 项指标卡片与同比查询",
        "id": "2-1-集中监管---65-项指标卡片与同比查询"
      }
    ],
    "content": "# 🔌 API 接口契约与数据接入规范\n\n## 1. 边缘数据上送协议与安全签名 (Edge Gateway Ingestion)\n\n### 1.1 请求 Header 鉴权规范\n各分厂网关上送数据时必须在 HTTP Header 中携带 HMAC-SHA256 签名：\n* `X-Plant-AppKey`：分厂唯一接入 AppKey（如 `PLANT_SHENBIAN_01`）\n* `X-Timestamp`：当前 Unix 毫秒时间戳（有效时间窗 $\\pm 5$ 分钟）\n* `X-Nonce`：16位随机字符串（防重放攻击）\n* `X-Signature`：`HMAC_SHA256(AppSecret, Method + URI + Timestamp + Nonce + BodyHash)`\n\n### 1.2 边缘测点批量上送接口\n* **Endpoint**: `POST /api/v1/telemetry/ingest`\n* **Content-Type**: `application/json`\n\n```json\n{\n  \"plantCode\": \"SB-001\",\n  \"gatewayId\": \"GW-DRY-01\",\n  \"batchTimestamp\": 1787572800000,\n  \"metrics\": [\n    {\n      \"meterCode\": \"MTR-POWER-001\",\n      \"processCode\": \"TRANS_HIGH_DRY\",\n      \"energyType\": \"POWER\",\n      \"values\": {\n        \"activePowerKw\": 450.2,\n        \"reactivePowerKvar\": 68.5,\n        \"voltageV\": 380.1,\n        \"currentA\": 684.2,\n        \"powerFactor\": 0.98,\n        \"totalActiveKwh\": 128490.5\n      }\n    },\n    {\n      \"meterCode\": \"MTR-STEAM-002\",\n      \"processCode\": \"TRANS_HIGH_DRY\",\n      \"energyType\": \"STEAM\",\n      \"values\": {\n        \"instantFlowTh\": 12.8,\n        \"accumulatedFlowT\": 3480.2,\n        \"pressureMpa\": 0.85\n      }\n    }\n  ]\n}\n```\n\n---\n\n## 2. 前端查询核心 API 契约 (OpenAPI 3.0)\n\n### 2.1 集中监管 - 65 项指标卡片与同比查询\n* **Endpoint**: `GET /api/v1/zero-carbon/indicators/list`\n* **Query Params**:\n  * `orgUnitId` (long): 工厂/单位 ID\n  * `period` (string): 周期标签（如 `2026-08`）\n  * `category` (string, optional): 指标大类筛选\n* **Response**:\n```json\n{\n  \"code\": \"SUCCESS\",\n  \"message\": \"查询成功\",\n  \"data\": {\n    \"summary\": {\n      \"totalIndicators\": 65,\n      \"excellentCount\": 42,\n      \"normalCount\": 18,\n      \"alertCount\": 5\n    },\n    \"indicators\": [\n      {\n        \"indicatorId\": 12,\n        \"indicatorCode\": \"UNIT_PRODUCT_ENERGY_MODEL\",\n        \"indicatorName\": \"单位产品能耗（型号）\",\n        \"category\": \"单位产品能耗\",\n        \"unit\": \"tce/万kVA\",\n        \"currentValue\": 1.45,\n        \"benchmarkValue\": 1.30,\n        \"standardValue\": 1.20,\n        \"yoyDelta\": 0.15,\n        \"yoyRate\": 11.54,\n        \"benchmarkDiff\": 0.15,\n        \"benchmarkRate\": 11.54,\n        \"status\": \"ALERT\",\n        \"formula\": \"综合能源消费量(tce) / 产品产量(万kVA)\",\n        \"dataSource\": \"订单关键工序计量+非关键工序分摊\",\n        \"aiReasoning\": \"该型号产品本月在干燥工序耗用蒸汽异常偏高 18%，建议排查 2 号干燥罐温控阀门密封性。\"\n      }\n    ]\n  }\n}\n```\n"
  },
  {
    "id": "manual-05",
    "no": 5,
    "filename": "05_前端开发手册与组件规范.md",
    "title": "前端开发手册与组件规范",
    "category": "总体架构与工程底座",
    "readTime": "18 分钟",
    "wordCount": 9147,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "🏛️ 一、 设计哲学与系统定位",
        "id": "一-设计哲学与系统定位"
      },
      {
        "level": 2,
        "title": "🎨 二、 视觉 Design Tokens 变量体系 (基于《UI页面修改 (2).pdf》)",
        "id": "二-视觉-design-tokens-变量体系-基于-ui页面修改-2-pdf"
      },
      {
        "level": 3,
        "title": "2.1 基础色系与表面 Token (`globals.css`)",
        "id": "2-1-基础色系与表面-token-globals-css"
      },
      {
        "level": 3,
        "title": "2.2 8 大能源介质与分时电量 4 段色彩字典 (Color Tokens)",
        "id": "2-2-8-大能源介质与分时电量-4-段色彩字典-color-tokens"
      },
      {
        "level": 3,
        "title": "2.3 字体排版标尺 (Typography Hierarchy)",
        "id": "2-3-字体排版标尺-typography-hierarchy"
      },
      {
        "level": 3,
        "title": "2.4 布局间距、圆角与控制组件标尺 (Spacing & Controls)",
        "id": "2-4-布局间距-圆角与控制组件标尺-spacing-controls"
      },
      {
        "level": 2,
        "title": "📐 三、 页面三大标准布局模版",
        "id": "三-页面三大标准布局模版"
      },
      {
        "level": 2,
        "title": "🧩 四、 核心通用组件设计标准",
        "id": "四-核心通用组件设计标准"
      },
      {
        "level": 3,
        "title": "4.1 统一页面标题栏 (Page Header)",
        "id": "4-1-统一页面标题栏-page-header"
      },
      {
        "level": 3,
        "title": "4.2 标准指标卡片 (Metric Cards)",
        "id": "4-2-标准指标卡片-metric-cards"
      },
      {
        "level": 3,
        "title": "4.3 企业组织拓扑树 (Organization Topology Tree)",
        "id": "4-3-企业组织拓扑树-organization-topology-tree"
      },
      {
        "level": 3,
        "title": "4.4 工业级数据表格规范 (Industrial Data Table)",
        "id": "4-4-工业级数据表格规范-industrial-data-table"
      },
      {
        "level": 3,
        "title": "4.5 宽幅大模态弹窗规范 (Max-W-5xl Modal)",
        "id": "4-5-宽幅大模态弹窗规范-max-w-5xl-modal"
      },
      {
        "level": 2,
        "title": "⚡ 五、 组件 8 种核心交互状态机规范",
        "id": "五-组件-8-种核心交互状态机规范"
      },
      {
        "level": 2,
        "title": "🛠️ 六、 前端工程与代码编写准则",
        "id": "六-前端工程与代码编写准则"
      }
    ],
    "content": "# 🎨 05. 前端开发手册与 UI 设计规范体系 (TBEA Design System v1.1.0)\n\n> **版本**：v1.1.0 (依据官方《UI页面修改 (2).pdf》全面升级版)  \n> **适用平台**：特变电工（电装集团）“双中心”数字化集成平台（零碳园区集控中心 + 产品碳足迹集采中心）  \n> **技术底座**：Next.js 16.3 (Turbopack) + React 19 + TypeScript 5.7+ + Tailwind CSS 4.3 + Lucide Icons + Recharts 3.10  \n> **归口团队**：多 Agent 联合工程架构组 (PM + UI/UX + Frontend + QA + Security)  \n> **权威参考依据**：\n> 1. 《UI页面修改 (2).pdf》（特变电工官方下发核心 UI 界面设计与视觉规范文件）  \n> 2. [`36_UI页面设计规范与工业视觉标准手册.md`](./36_UI页面设计规范与工业视觉标准手册.md)（官方 UI 变更细化落地手册）  \n> 3. [`37_左上角品牌规范与双中心导航交互开发手册.md`](./37_左上角品牌规范与双中心导航交互开发手册.md)（导航栏与品牌规范专项手册）  \n> 4. 项目专属技能：[`tbea-industrial-design`](../.gemini/skills/tbea-industrial-design/SKILL.md) 与 [`AGENTS.md`](../AGENTS.md)\n\n---\n\n> [!IMPORTANT]\n> **权威规范升级声明**：本手册已依据特变电工官方最新下发的《UI页面修改 (2).pdf》完成全量 Design Tokens、色彩字典、组件规格与人机工程的全面升级！全系统严格执行 **`#F3F7FB` 主背景底色、`24px` 板块间距、`8px` 面板圆角、`44px` 工业表格行高、8 大能源介质与 4 段分时电量标准色字典、`260px` 侧边栏宽度、`30px` 导航/树文字间距、`80×36px` 导出按钮及 `200×36px` 输入下拉框**。\n\n---\n\n## 🏛️ 一、 设计哲学与系统定位\n\n特变电工“双中心”平台面向集团管理层、各直属基地厂长、能源工程师与双碳审计员，设计遵循 **“工业严谨、现代清爽、高效透视、等宽精准”** 四大核心原则：\n\n1. **工业严谨 (Industrial Rigor)**：采用经典 260px 宽度组织拓扑树与双层级穿透（集团大盘 ⇄ 基地车间），节点间距统一 30px，激活态呈现浅蓝圆角底色 `#EBF3FF`，贴合大型工业制造企业的管理心智。\n2. **现代清爽 (Modern Bento & Clean Tone)**：以浅灰蓝底色 (`#F3F7FB`) 搭配纯白面板 (`#FFFFFF`)，面板描边 `#DBE6EE`，圆角固定 `8px`，板块间距拉开 `24px`，消除纯白刺眼眩光与视觉拥挤感。\n3. **高效透视 (Actionable & Transparent)**：全量支持多维时序筛选（日/月/季/年）、多介质切换、排序与流式 Excel 导出（导出按钮统一 `80px × 36px`，实心蓝 `#2C7CFF`）。\n4. **等宽精准 (Monospace & Tabular Alignment)**：所有计量数字、时序采样、财务金额与指标全量启用 `JetBrains Mono` 与 `tabular-nums` 等宽排版，核心数值统一 `24px 加粗`，杜绝字符抖动与错位。\n\n---\n\n## 🎨 二、 视觉 Design Tokens 变量体系 (基于《UI页面修改 (2).pdf》)\n\n### 2.1 基础色系与表面 Token (`globals.css`)\n\n```css\n:root {\n  color-scheme: light;\n  --radius: 8px;                  /* 面板与核心控件圆角固定 8px */\n\n  /* 基础底色与表面色 (依据《UI页面修改 (2).pdf》权威基准) */\n  --background: #F3F7FB;          /* 全局浅灰蓝主底色，柔和防眩光 */\n  --foreground: #1c2024;          /* 高对比度主文本深色 */\n  --panel: #FFFFFF;               /* 纯白面板与卡片填充色 */\n  --panel-foreground: #1c2024;\n  --border: #DBE6EE;              /* 统一面板浅蓝灰工业描边 */\n  --input: #E2E8F0;               /* 输入框与下拉框边框色 */\n  --ring: rgba(44, 124, 255, 0.4);\n\n  /* 品牌核心主色 */\n  --primary: #2C7CFF;             /* 特变电工标准科技蓝 (主题色/总用电量) */\n  --primary-foreground: #ffffff;\n  --sidebar: #0958d9;             /* 左侧科技深蓝背景 */\n  --sidebar-foreground: #ffffff;\n  --sidebar-accent: #2C7CFF;\n  --sidebar-border: rgba(255, 255, 255, 0.15);\n}\n```\n\n### 2.2 8 大能源介质与分时电量 4 段色彩字典 (Color Tokens)\n\n系统严格规范 8 大能源介质与 TOU 峰平谷分时电量标准色，全站图表、卡片指标、进度条及徽章 100% 同步执行：\n\n#### （1）8 大能源介质标准色表\n\n| 序号 | 能源介质名称 | 标准 Hex 色值 | Tailwind 类名 | 业务场景与图表映射 |\n| :---: | :--- | :---: | :--- | :--- |\n| **1** | **主题科技蓝 / 总用电量** | **`#2C7CFF`** | `bg-[#2C7CFF] text-[#2C7CFF]` | 平台主题主色、全厂总用电量折线/柱状图、主操作按钮 |\n| **2** | **市电量** | **`#41C0FF`** | `bg-[#41C0FF] text-[#41C0FF]` | 电网购入电量、市电供应占比、受电变压器监测 |\n| **3** | **直供绿电量** | **`#00D492`** | `bg-[#00D492] text-[#00D492]` | 分布式光伏发电、市场化绿电直购、零碳绿电消纳率 |\n| **4** | **水资源** | **`#10C4CE`** | `bg-[#10C4CE] text-[#10C4CE]` | 新鲜工业用水、循环冷却水消耗、万元产值用水量 |\n| **5** | **天然气** | **`#FF6536`** | `bg-[#FF6536] text-[#FF6536]` | 窑炉天然气消耗、锅炉燃烧热力、烘房用气监测 |\n| **6** | **蒸汽** | **`#FFBA00`** | `bg-[#FFBA00] text-[#FFBA00]` | 外购蒸汽总量、工艺干燥固化蒸汽单耗 |\n| **7** | **油消耗** | **`#8E73ED`** | `bg-[#8E73ED] text-[#8E73ED]` | 变压器油注油台账、柴油发电机应急燃油消耗 |\n| **8** | **液氮** | **`#4F39F6`** | `bg-[#4F39F6] text-[#4F39F6]` | 低温试验保护、特殊制造氮气介质消耗 |\n\n#### （2）分时电量 4 段类型色表 (TOU: 尖 / 峰 / 平 / 谷)\n\n| 时段类型 | 标准 Hex 色值 | 视觉语义 | 界面图表与指示要求 |\n| :---: | :---: | :--- | :--- |\n| **尖峰 (Sharp Peak)** | **`#FF6536`** | 警示热力橙红 | 尖峰时段用电量、避峰负荷监测、尖峰电量占比饼图 |\n| **高峰 (Peak)** | **`#FFBA00`** | 活力明朗金黄 | 高峰时段用电量、生产班次负荷走势 |\n| **平段 (Flat)** | **`#2C7CFF`** | 稳健主题科技蓝 | 平段时段用电量、常规连续负荷 |\n| **低谷 (Valley)** | **`#10C4CE`** | 低谷生态湖蓝青 | 低谷蓄能用电、储能充电时段用电量、谷电消纳占比 |\n\n### 2.3 字体排版标尺 (Typography Hierarchy)\n\n```css\n/* 字体栈规范 */\n--font-sans: 'Inter', 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', system-ui, -apple-system, sans-serif;\n--font-mono: 'JetBrains Mono', 'SF Mono', 'Consolas', monospace;\n```\n\n* **面板主标题 (Panel Title)**：`text-base font-bold text-slate-800` (**`16px 加粗`**)\n* **卡片标题 (Card Title)**：`text-sm font-medium text-slate-700` (**`14px`**)\n* **KPI 关键主数字 (Key Metrics)**：`text-2xl font-bold font-mono text-slate-900` (**`24px 加粗`**)\n* **正文与表格文本 (Body / Table)**：`text-sm text-slate-800 font-sans` (**`14px`**，表格行高强制 **`44px`**)\n* **辅助说明与单位 (Caption / Unit)**：`text-sm text-slate-500` (**`14px`**)\n\n### 2.4 布局间距、圆角与控制组件标尺 (Spacing & Controls)\n\n* **全局板块间距**：统一修改为 **`24px`** (`gap-6` / `space-y-6`)\n* **面板/卡片填充与描边**：填充 `#FFFFFF`，描边 `#DBE6EE`，圆角固定 **`8px`** (`rounded-lg`)\n* **侧边导航栏规格**：宽度统一固定为 **`260px`** (`w-[260px]`)，导航与树文字间距/行高增大到 **`30px`**\n* **TAB 切换组件**：激活项为实心主题蓝 **`#2C7CFF`** 胶囊 + 白字 + **`8px`** 圆角，未激活项纯文本无背景\n* **导出按钮规格**：宽度固定 **`80px`**，高度固定 **`36px`**，背景填充 **`#2C7CFF`**，圆角 **`8px`**，白色下载图标 + 白字\n* **输入/下拉框规格**：推荐宽度 **`200px`**，高度固定 **`36px`**，背景纯白 `#FFFFFF`，描边 `#E2E8F0`，圆角 **`8px`**\n\n---\n\n## 📐 三、 页面三大标准布局模版\n\n```mermaid\ngraph TD\n    subgraph Arch1[\"1. 经典双栏拓扑树布局 (Dual-Column Tree Layout)\"]\n        Tree[\"左侧 260px 组织拓扑树<br/>(StandardOrgTree · 30px行距)\"]\n        Work1[\"右侧弹性自适应工作区<br/>(Header + KPI + Charts + 44px Table)\"]\n        Tree --- Work1\n    end\n\n    subgraph Arch2[\"2. 全宽全景资产布局 (Full-width View)\"]\n        Work2[\"100% 全屏宽幅自适应工作区<br/>(适用于项目档案库、综合报表等宽表大盘 · 24px间距)\"]\n    end\n\n    subgraph Arch3[\"3. 大屏数据驾驶舱 (Dashboard Cockpit)\"]\n        Work3[\"1920×1080 沉浸式驾驶舱布局<br/>(集控中心大屏 / 领导看板)\"]\n    end\n```\n\n---\n\n## 🧩 四、 核心通用组件设计标准\n\n### 4.1 统一页面标题栏 (Page Header)\n\n统一放置在右侧工作区顶部，具备标准的左侧浅蓝图标方块 + 主标题 + 右侧多维筛选/导出工具栏（导出按钮统一 80×36px，填充 `#2C7CFF`）：\n\n```tsx\n<div className=\"bg-white p-4 rounded-lg border border-[#DBE6EE] shadow-xs flex flex-wrap items-center justify-between gap-4\">\n  <div className=\"flex items-center gap-3\">\n    <div className=\"size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2C7CFF] shrink-0\">\n      <FileSpreadsheet className=\"size-5\" />\n    </div>\n    <div>\n      <h1 className=\"text-base font-bold text-slate-800\">用能报表</h1>\n    </div>\n  </div>\n\n  <div className=\"flex flex-wrap items-center gap-3\">\n    {/* 周期切换 TAB (实心蓝胶囊) / 200×36px 筛选下拉框 / 80×36px 导出按钮 */}\n  </div>\n</div>\n```\n\n### 4.2 标准指标卡片 (Metric Cards)\n\n依据《UI页面修改 (2).pdf》，指标卡片标题为 14px，主数值为 24px 加粗 Mono，其他辅助说明与单位为 14px：\n\n```tsx\n<div className=\"bg-white p-4 rounded-lg border border-[#DBE6EE] shadow-xs flex items-center justify-between\">\n  <div>\n    <span className=\"text-sm text-slate-700 block font-medium\">综合能源消费量</span>\n    <div className=\"text-2xl font-bold font-mono text-slate-900 mt-1\">\n      12,845 <span className=\"text-sm font-sans text-slate-500 font-normal\">tce</span>\n    </div>\n    <span className=\"text-sm text-primary block mt-1 font-mono\">\n      同比 -4.8% ↗\n    </span>\n  </div>\n  <div className=\"size-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2C7CFF]\">\n    <Zap className=\"size-5\" />\n  </div>\n</div>\n```\n\n### 4.3 企业组织拓扑树 (Organization Topology Tree)\n\n* **固定宽度**：**`260px`**，带 `shrink-0`，支持独立滚动；\n* **视觉特征**：支持树连接导线、节点文字垂直间距/行高统一 **`30px`**，搜索框规范化（“请输入搜索关键词”），层级语义图标（集团/公司使用建筑图标，工厂/车间使用架构图标），激活选中态呈现浅蓝圆角底色 **`#EBF3FF`** + 蓝字高亮。\n\n### 4.4 工业级数据表格规范 (Industrial Data Table)\n\n* **强制行高**：全系统数据表格行高统一固定为标准的 **`44px`**（`h-[44px]`），垂直居中，满足高密度工业监控人机工效；\n* **表头设计**：`bg-slate-50 text-slate-600 font-bold font-sans border-b border-[#DBE6EE]`，字号 `text-sm`；\n* **行悬停态**：`hover:bg-blue-50/40 transition-colors cursor-pointer group`；\n* **数值排版**：数字一律使用 `font-mono` 且靠右对齐 (`text-right`)，状态标签居中 (`text-center`)；\n* **表尾汇总条**：`bg-slate-50/50 p-3 border-t border-[#DBE6EE]` 显示当前筛选数据条数与总投资/能耗/减碳汇总。\n\n### 4.5 宽幅大模态弹窗规范 (Max-W-5xl Modal)\n\n* **容器尺寸**：统一为 **`w-full max-w-5xl max-h-[92vh] rounded-2xl shadow-2xl`**；\n* **Header 区域**：平滑渐变背景 `bg-gradient-to-r from-slate-50 via-blue-50/30 to-slate-50`，左侧独立 `size-12 rounded-2xl` 矢量 Icon 方块，主标题平铺展示名称、编码标签、类别徽章与状态 Badge；\n* **Body 区域**：采用 **Bento 栅格（顶部 4 列 KPI + 中部 7:5 左右双栏）** 布局，左右分别为时序里程碑/财务参数与附件档案清单；\n* **Footer 区域**：左侧提供辅助动作（如「编辑维护」），右侧提供主要动作（如「导出 PDF」与「关闭」）。\n\n---\n\n## ⚡ 五、 组件 8 种核心交互状态机规范\n\n| 状态名称 | 视觉表现 | 代码类名规范 |\n| :--- | :--- | :--- |\n| **1. Normal (默认态)** | 纯白背景，`border-slate-200` 细边框，字体清晰对比 | `bg-white border border-slate-200 text-slate-800` |\n| **2. Hover (悬停态)** | 边框微渐变到科技蓝，背景微透浅蓝 | `hover:border-blue-300 hover:bg-blue-50/40 transition-all` |\n| **3. Active (选中态)** | 浅蓝底色，科技蓝文字，加粗加深 | `bg-blue-50 text-[#1677ff] font-bold border-blue-200` |\n| **4. Focus (焦点态)** | 2px 科技蓝光晕轮廓 | `focus:outline-none focus:ring-2 focus:ring-[#1677ff]/30` |\n| **5. Loading (加载态)** | 带有脉冲流动光效的 Skeleton 骨架屏 | `animate-pulse bg-slate-200 rounded-lg` |\n| **6. Disabled (禁用态)** | 灰度 50%，鼠标禁用手势 | `opacity-50 cursor-not-allowed bg-slate-100` |\n| **7. Empty (空状态)** | 工业风缺省插画 + 提示说明文案 | 居中展示 `FileX2` 图标 + “暂无该周期明细数据” |\n| **8. Alert (异常超标态)** | 柔和红色警告边框 + 闪烁红点 | `border-rose-300 bg-rose-50/50 text-rose-700` |\n\n---\n\n## 🛠️ 六、 前端工程与代码编写准则\n\n1. **零警告零报错**：所有页面与组件必须保持 100% TypeScript 类型安全与 Next.js 静态构建全绿通过；\n2. **数字计算防崩溃**：除零防御（`total > 0 ? (a / total) : 0`）、浮点数四舍五入防溢出（`toFixed(1)` / `toFixed(2)`）；\n3. **组件原子化复用**：复杂看板提取至 `components/shared/`，公共图表统一调用 `components/shared/charts.tsx`；\n4. **性能与流式渲染**：客户端高频交互组件标记 `'use client'`，重计算使用 `useMemo` 缓存，大数据量渲染使用虚拟滚动或分页。\n"
  },
  {
    "id": "manual-06",
    "no": 6,
    "filename": "06_组织架构与园区工厂对应手册.md",
    "title": "组织架构与园区工厂对应手册",
    "category": "总体架构与工程底座",
    "readTime": "4 分钟",
    "wordCount": 2182,
    "summary": "依据特变电工（电装集团）业务台账，系统建立 **17 个零碳产业园区** 与 **6 大一级经营单位 / 30 个二级工厂车间** 的对应拓扑网：",
    "headings": [
      {
        "level": 2,
        "title": "1. 17 大零碳产业园区全景清单",
        "id": "1-17-大零碳产业园区全景清单"
      },
      {
        "level": 2,
        "title": "2. 6 大一级经营单位与园区对应矩阵",
        "id": "2-6-大一级经营单位与园区对应矩阵"
      },
      {
        "level": 2,
        "title": "3. 企业、产品、产品类型与消耗能源工序权威规范",
        "id": "3-企业-产品-产品类型与消耗能源工序权威规范"
      }
    ],
    "content": "# 🏢 组织架构与园区工厂对应手册\n\n依据特变电工（电装集团）业务台账，系统建立 **17 个零碳产业园区** 与 **6 大一级经营单位 / 30 个二级工厂车间** 的对应拓扑网：\n\n## 1. 17 大零碳产业园区全景清单\n\n| 序号 | 零碳产业园区名称 | 简称/城市徽章 | 核心经营单位与主要车间工序 | 区域电网/主要供能特征 |\n| :---: | :--- | :---: | :--- | :--- |\n| 1 | **特变电工东北输变电产业园** | 沈阳 | 沈变本部 (超高压厂房)、和新套管、康嘉互感器、园区微电网与储能 | 辽宁电网 (110kV/10kV) / 屋顶光伏 |\n| 2 | **特变电工南方输变电产业园** | 衡阳 | 衡变本部制造厂区、国创油箱车间、南方园区屋顶光伏电站 | 湖南电网 (110kV/10kV) / 屋顶光伏 |\n| 3 | **特变电工二次产业园区** | 南京 | 南京电研自动化 SMT 贴片与研发中心 | 江苏电网 / 智慧绿电 |\n| 4 | **特变电工云集5G科技产业园** | 云集 | 云集高压开关与钣金智能车间、GIS绝缘测试 | 湖南衡阳 / 5G+智慧微网 |\n| 5 | **特变电工智能电气产业园** | 昌吉 | 智能电气配电变压器、自控成套开关车间 | 新疆电网 / 平价绿电 |\n| 6 | **特变电工湖南能源建设产业园** | 衡阳 | 特能建新能源工程与成套集成装配区 | 湖南电网 / 工程集成 |\n| 7 | **特变电工西安智能装备产业园** | 西安 | 电力电子研发基地、合容电气电力电容器生产区 | 陕西电网 / 绿色研发 |\n| 8 | **特变电工特高压GIL产业园** | 衡阳 | 赛杰爱迪特高压气体绝缘金属封闭输电线路车间 | 湖南电网 / 蒸汽+电力 |\n| 9 | **特变电工输变电产业园 (新疆)** | 昌吉 | 新变超高压变压器厂区、新疆线缆厂制造车间 | 新疆电网 (110kV) / 煤油气相干燥 |\n| 10 | **特变电工天变产业园** | 天津 | 天变干式变压器生产基地、特种变压器智造厂区 | 天津电网 / 智能微电网 |\n| 11 | **特变电工京津冀智能科技产业园** | 武清 | 箱式变电站与环网柜制造厂区、智能装备车间 | 河北/天津电网 |\n| 12 | **特变电工华东输变电科技产业园** | 新泰 | 鲁缆高压交联立塔厂区、智缆科技制造中心 | 山东电网 (110kV) / 立塔交联 |\n| 13 | **特变电工曙光电缆产业园** | 新泰 | 曙光中低压环保交联线缆智造车间 | 山东电网 / 连续铜拉丝 |\n| 14 | **特变电工新疆电缆产业园** | 乌市 | 新疆电缆超高压阻燃交联电缆生产区 | 新疆电网 / 自制氮气交联 |\n| 15 | **特变电工（德阳）电缆产业园区** | 德阳 | 德缆股份交联与连铸连轧厂区 | 四川电网 (水电清洁电) |\n| 16 | **新特能源甘泉堡与准东硅基产业园** | 甘泉堡/准东 | 高纯多晶硅还原与冷氢化厂区、工业硅绿色冶炼厂区 | 新疆大电网 / 绿电消纳基地 |\n| 17 | **特变电工天津高端智能装备产业园** | 北辰 | 智能电力装备数字化集成装配车间 | 天津电网 / 智能总装 |\n\n---\n\n## 2. 6 大一级经营单位与园区对应矩阵\n\n| 一级经营单位 | 对应零碳产业园区 | 核心工厂与车间 | 典型用能特征 |\n| :--- | :--- | :--- | :--- |\n| **沈变公司** | 东北输变电产业园 | 沈变本部、和新套管、康嘉互感器 | 电力、蒸汽 (煤油气相干燥罐) |\n| **衡变公司** | 南方输变电产业园 / 云集 / 南京二次 / GIL / 湖南能建 | 衡变本部、南京电研、云集高压、赛杰爱迪、特能建、合容电气 | 电力、蒸汽 (绝缘干燥、固化炉) |\n| **新变厂** | 新疆输变电产业园 / 天变产业园 / 智能电气 / 京津冀 | 新变超高压、天变公司、智能电气、京津冀公司、珠峰硅钢 | 电力、天然气 (硅钢退火电阻炉) |\n| **鲁缆公司** | 华东输变电科技产业园 / 曙光产业园 | 鲁缆本部、智缆科技、昭和公司、曙光公司 | 电力、工业水、蒸汽 (立塔交联共挤) |\n| **新缆厂** | 新疆电缆产业园 / 新疆输变电产业园 | 新疆电缆公司、新疆线缆厂 | 电力、工业水、氮气 (高压阻燃交联) |\n| **德缆公司** | 德阳电缆产业园区 | 德缆股份公司 | 清洁水电、工业水 (连铸连轧与连硫) |\n\n---\n\n## 3. 企业、产品、产品类型与消耗能源工序权威规范\n关于全集团 6 大经营单位、22 家二级工厂、产品规格大类（变压器高压/干变/油变、线缆高压/中低压/特缆、开关柜、GIS、电抗器、电容器、GIL、套管、互感器、铁芯）、核心工序及主要消耗能源的完整映射矩阵与计算规则，请详见：\n👉 [**28_企业产品与消耗能源工序对应规范手册.md**](./28_企业产品与消耗能源工序对应规范手册.md)\n"
  },
  {
    "id": "manual-07",
    "no": 7,
    "filename": "07_DevOps部署与运维手册.md",
    "title": "DevOps部署与运维手册",
    "category": "总体架构与工程底座",
    "readTime": "11 分钟",
    "wordCount": 5309,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "🌐 一、 线上生产服务器配置与拓扑",
        "id": "一-线上生产服务器配置与拓扑"
      },
      {
        "level": 3,
        "title": "1.1 云服务器基础信息表",
        "id": "1-1-云服务器基础信息表"
      },
      {
        "level": 2,
        "title": "📌 二、 线上服务与核心功能直达清单",
        "id": "二-线上服务与核心功能直达清单"
      },
      {
        "level": 3,
        "title": "2.1 重点业务直达 URL 清单",
        "id": "2-1-重点业务直达-url-清单"
      },
      {
        "level": 2,
        "title": "⚙️ 三、 生产 Nginx 配置文件",
        "id": "三-生产-nginx-配置文件"
      },
      {
        "level": 2,
        "title": "🔄 四、 持续发布与自动化部署脚本",
        "id": "四-持续发布与自动化部署脚本"
      },
      {
        "level": 3,
        "title": "4.1 本地一键部署脚本 (`deploy_to_server.py`)",
        "id": "4-1-本地一键部署脚本-deploy_to_server-py"
      },
      {
        "level": 2,
        "title": "🛡️ 五、 服务运维与故障排查",
        "id": "五-服务运维与故障排查"
      },
      {
        "level": 3,
        "title": "5.1 常用运维诊断命令",
        "id": "5-1-常用运维诊断命令"
      }
    ],
    "content": "# 🚀 07. DevOps 部署与运维手册 (线上生产部署规范)\n\n> **当前线上运行状态**：🟢 正常运行 (HTTP 200 OK)  \n> **生产服务公网 IP**：`8.215.89.194`  \n> **生产控制台入口**：[http://8.215.89.194:3000](http://8.215.89.194:3000)  \n> **Web 标准入口**：[http://8.215.89.194](http://8.215.89.194)  \n> **更新时间**：2026-08-29  \n> **归口团队**：SRE / DevOps 基础设施运维组\n\n---\n\n## 🌐 一、 线上生产服务器配置与拓扑\n\n### 1.1 云服务器基础信息表\n\n| 配置项 | 参数与信息 | 详细说明 |\n| :--- | :--- | :--- |\n| **云服务商** | 阿里云 (Alibaba Cloud ECS) | 华东 / 华北高可用可用区 |\n| **公网 IP** | **`8.215.89.194`** | 统一公网入口 |\n| **操作系统** | Ubuntu 24.04 LTS (x86_64) | Linux 内核 6.8+ |\n| **SSH 登录凭据** | `admin@8.215.89.194:22` | 基于 `id_ed25519` 公钥鉴权 |\n| **Web 根目录** | `/var/www/tbea-nengtan` | 拥有 `www-data:www-data` 权限 (755) |\n| **Web 服务器** | Nginx 1.24.0 (Ubuntu) | 系统服务 `systemd` 守护 |\n| **生产监听端口** | **`3000`** (主控制台) & **`80`** (Web 门户) | 双端口同时监听 |\n\n---\n\n## 📌 二、 线上服务与核心功能直达清单\n\n```mermaid\ngraph TD\n    User[\"🌐 外部访问者 / 集团领导 / 园区工程师\"]\n    \n    subgraph Gateway[\"🛡️ 生产公网网关 (8.215.89.194)\"]\n        P3000[\"<b>Port 3000</b><br/>生产控制台入口\"]\n        P80[\"<b>Port 80</b><br/>标准 HTTP 门户入口\"]\n    end\n    \n    subgraph NginxEngine[\"⚡ Nginx 1.24 静态加速与路由引擎 (/var/www/tbea-nengtan)\"]\n        Gzip[\"Gzip 压缩传输 (80% 吞吐节省)\"]\n        Cache[\"静态资源 30 天强缓存\"]\n        Router[\"Next.js Clean URLs 伪静态路由\"]\n    end\n    \n    subgraph Modules[\"📊 业务子系统模块 (全量 61 个静态路由)\"]\n        M1[\"指标管控 (Indicator)<br/>/zero-carbon/monitor/indicator\"]\n        M2[\"项目档案管理 (Archive)<br/>/zero-carbon/project/archive\"]\n        M3[\"在线监测 (Online Ledger)<br/>/zero-carbon/monitor/online\"]\n        M4[\"能源碳排监测 (Charts)<br/>/zero-carbon/monitor/carbon-emission\"]\n        M5[\"统计报表 (Reports)<br/>/zero-carbon/reports/*\"]\n        M6[\"集控大屏 (Screen)<br/>/zero-carbon/screen\"]\n    end\n\n    User --> P3000 & P80\n    P3000 & P80 --> NginxEngine\n    NginxEngine --> Gzip & Cache & Router\n    Router --> Modules\n```\n\n### 2.1 重点业务直达 URL 清单\n\n1. **平台首页 / 门户引导**：[http://8.215.89.194:3000](http://8.215.89.194:3000)\n2. **指标管控（产品单耗指标最新版）**：[http://8.215.89.194:3000/zero-carbon/monitor/indicator](http://8.215.89.194:3000/zero-carbon/monitor/indicator)\n3. **项目档案管理（统一项目资产库）**：[http://8.215.89.194:3000/zero-carbon/project/archive](http://8.215.89.194:3000/zero-carbon/project/archive)\n4. **在线监测（15分钟高频连续台账）**：[http://8.215.89.194:3000/zero-carbon/monitor/online](http://8.215.89.194:3000/zero-carbon/monitor/online)\n5. **能源碳排放监测（双维图表大盘）**：[http://8.215.89.194:3000/zero-carbon/monitor/carbon-emission](http://8.215.89.194:3000/zero-carbon/monitor/carbon-emission)\n6. **统计报表（用能报表）**：[http://8.215.89.194:3000/zero-carbon/reports/usage](http://8.215.89.194:3000/zero-carbon/reports/usage)\n7. **集控中心 1920 大屏**：[http://8.215.89.194:3000/zero-carbon/screen](http://8.215.89.194:3000/zero-carbon/screen)\n\n---\n\n## ⚙️ 三、 生产 Nginx 配置文件\n\n服务器配置文件位于 `/etc/nginx/conf.d/tbea-nengtan.conf`：\n\n```nginx\nserver {\n    listen 3000 default_server;\n    listen [::]:3000 default_server;\n    listen 80;\n    listen [::]:80;\n\n    server_name _;\n\n    root /var/www/tbea-nengtan;\n    index index.html index.htm;\n\n    # 1. 开启 Gzip 传输压缩\n    gzip on;\n    gzip_vary on;\n    gzip_min_length 1024;\n    gzip_proxied any;\n    gzip_types \n        text/plain \n        text/css \n        text/xml \n        text/javascript \n        application/x-javascript \n        application/javascript \n        application/xml \n        application/json \n        image/svg+xml;\n\n    # 2. Next.js 静态 Clean URLs 路由规则 (支持刷新不报 404)\n    location / {\n        try_files $uri $uri.html $uri/ /index.html =404;\n    }\n\n    # 3. 静态静态资源 30 天强缓存\n    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {\n        expires 30d;\n        add_header Cache-Control \"public, no-transform\";\n    }\n\n    # 4. 统一 404 错误页\n    error_page 404 /404.html;\n}\n```\n\n---\n\n## 🔄 四、 持续发布与自动化部署脚本\n\n### 4.1 本地一键部署脚本 (`deploy_to_server.py`)\n\n本地开发修改完成后，只需运行该脚本，即可全自动完成构建打包、SFTP 上传、解压、权限配置与 Nginx 平滑重载：\n\n```python\n# -*- coding: utf-8 -*-\nimport paramiko\nimport os\nimport sys\n\nSERVER_IP = \"8.215.89.194\"\nUSER = \"admin\"\nKEY_PATH = os.path.expanduser(\"~/.ssh/id_ed25519\")\nLOCAL_TAR = r\"d:\\Project\\TJ-nengtan\\tbea-nengtan-dist.tar.gz\"\nREMOTE_TARGET = \"/var/www/tbea-nengtan\"\n\n# 1. 本地生成打包发布包\nos.system('tar -czf tbea-nengtan-dist.tar.gz -C \"产品原型/out\" .')\n\n# 2. SFTP 上传\nssh = paramiko.SSHClient()\nssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())\nkey = paramiko.Ed25519Key.from_private_key_file(KEY_PATH)\nssh.connect(hostname=SERVER_IP, port=22, username=USER, pkey=key)\n\nsftp = ssh.open_sftp()\nsftp.put(LOCAL_TAR, \"/home/admin/tbea-nengtan-dist.tar.gz\")\nsftp.close()\n\n# 3. 远程解压与服务重载\ndeploy_cmd = f\"\"\"\necho tianzi | sudo -S mkdir -p {REMOTE_TARGET}\necho tianzi | sudo -S tar -xzf /home/admin/tbea-nengtan-dist.tar.gz -C {REMOTE_TARGET}\necho tianzi | sudo -S chown -R www-data:www-data {REMOTE_TARGET}\necho tianzi | sudo -S chmod -R 755 {REMOTE_TARGET}\nrm -f /home/admin/tbea-nengtan-dist.tar.gz\necho tianzi | sudo -S systemctl reload nginx\n\"\"\"\nstdin, stdout, stderr = ssh.exec_command(deploy_cmd)\nprint(stdout.read().decode('utf-8'))\nssh.close()\nprint(\"🎉 线上部署更新完成！\")\n```\n\n---\n\n## 🛡️ 五、 服务运维与故障排查\n\n### 5.1 常用运维诊断命令\n\n```bash\n# 1. 检查 Nginx 服务运行状态\nsudo systemctl status nginx\n\n# 2. 检查 3000 端口监听状态\nsudo ss -tlpn | grep 3000\n\n# 3. 检查 Nginx 访问与错误日志\nsudo tail -f /var/log/nginx/access.log\nsudo tail -f /var/log/nginx/error.log\n\n# 4. 验证 Nginx 语法\nsudo nginx -t\n\n# 5. 平滑重载 Nginx\nsudo systemctl reload nginx\n```\n"
  },
  {
    "id": "manual-08",
    "no": 8,
    "filename": "08_产品原型项目框架与架构说明书.md",
    "title": "产品原型项目框架与架构说明书",
    "category": "总体架构与工程底座",
    "readTime": "16 分钟",
    "wordCount": 8089,
    "summary": "本项目是为特变电工（电装集团）定制构建的高保真可交互前端产品原型系统，基于 **Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4** 架构设计，全面覆盖 **零",
    "headings": [
      {
        "level": 2,
        "title": "🛠️ 一、技术栈选型与工程底座",
        "id": "一-技术栈选型与工程底座"
      },
      {
        "level": 2,
        "title": "📁 二、项目目录结构与职责划分",
        "id": "二-项目目录结构与职责划分"
      },
      {
        "level": 2,
        "title": "🧭 三、“双中心”核心业务架构与路由矩阵",
        "id": "三-双中心-核心业务架构与路由矩阵"
      },
      {
        "level": 2,
        "title": "🎨 四、视觉与组件规范体系 (Design Tokens)",
        "id": "四-视觉与组件规范体系-design-tokens"
      },
      {
        "level": 3,
        "title": "1. 工业科技视觉调色盘 (Color System)",
        "id": "1-工业科技视觉调色盘-color-system"
      },
      {
        "level": 3,
        "title": "2. 核心通用业务组件",
        "id": "2-核心通用业务组件"
      },
      {
        "level": 2,
        "title": "⚡ 五、确定性动态演化引擎 (`lib/variant.ts`)",
        "id": "五-确定性动态演化引擎-lib-variant-ts"
      },
      {
        "level": 2,
        "title": "🚀 六、核心业务交互亮点",
        "id": "六-核心业务交互亮点"
      },
      {
        "level": 2,
        "title": "💡 七、开发者扩展与二次开发指引",
        "id": "七-开发者扩展与二次开发指引"
      },
      {
        "level": 3,
        "title": "1. 增加新页面/新路由",
        "id": "1-增加新页面-新路由"
      },
      {
        "level": 3,
        "title": "2. 增加/调整管控指标",
        "id": "2-增加-调整管控指标"
      },
      {
        "level": 3,
        "title": "3. 本地编译与启动",
        "id": "3-本地编译与启动"
      }
    ],
    "content": "# 📐 特变电工“双中心”产品原型工程架构与技术说明书\n\n本项目是为特变电工（电装集团）定制构建的高保真可交互前端产品原型系统，基于 **Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4** 架构设计，全面覆盖 **零碳园区集控中心** 与 **产品碳足迹集采中心** 两大核心业务底座，共包含 **53 个业务页面路由**、**20+ 通用业务与基础组件** 及 **7 大核心领域数据字典**。\n\n---\n\n## 🛠️ 一、技术栈选型与工程底座\n\n```mermaid\ngraph TD\n    subgraph CoreFramework[\"核心框架与编译层\"]\n        NextJS[\"Next.js 16.3.0 (App Router + Turbopack)\"]\n        React[\"React 19.2.4 (Server & Client Components)\"]\n        TS[\"TypeScript 5.7.3 (全类型静态推导)\"]\n    end\n\n    subgraph StyleAndDesign[\"样式与设计系统\"]\n        Tailwind[\"Tailwind CSS 4.3 (现代原生 CSS 变量)\"]\n        Lucide[\"Lucide React 1.17 (工业级线性图标库)\"]\n        BaseUI[\"@base-ui/react + Radix UI (无障碍交互原语)\"]\n        TwAnimate[\"tw-animate-css (微交互动画动效)\"]\n    end\n\n    subgraph DataAndCharts[\"可视化与数据引擎\"]\n        Recharts[\"Recharts 3.10.1 (SVG 响应式图表引擎)\"]\n        VariantEngine[\"lib/variant.ts (确定性时序数据演化引擎)\"]\n        OrgModel[\"lib/org.ts (65+指标与21工厂拓扑字典)\"]\n    end\n\n    CoreFramework --> StyleAndDesign\n    CoreFramework --> DataAndCharts\n```\n\n| 层次/模块 | 选型技术 | 版本 | 核心作用与优势 |\n| :--- | :--- | :--- | :--- |\n| **运行时框架** | `Next.js` (App Router) | `16.3.0` | 采用 Turbopack 毫秒级极速热重载，支持静态路由预渲染与客户端交互切片 |\n| **视图引擎** | `React` | `19.2.4` | 原生支持 Hooks、Actions、Transitions 与现代化状态流转 |\n| **开发语言** | `TypeScript` | `5.7.3` | 提供完整的组织节点、指标元数据、时序数据、告警规则的强类型定义 |\n| **样式体系** | `Tailwind CSS` | `4.3.3` | 基于 CSS 变量的 Design Tokens，打造深空石板灰与低碳翡翠绿工业科技暗黑风 |\n| **图表可视化** | `Recharts` | `3.10.1` | 封装了折线趋势 (`LineTrend`)、面积图 (`AreaTrend`)、环形图 (`Donut`) 与柱状图 |\n| **图标体系** | `Lucide React` | `1.17.0` | 统一的现代线性矢量图标体系，覆盖电力、工业、低碳、告警等所有语义 |\n\n---\n\n## 📁 二、项目目录结构与职责划分\n\n```text\nd:\\Project\\TJ-nengtan\\产品原型\\\n├── app/                          # 页面与路由层 (Next.js App Router)\n│   ├── layout.tsx                # 全局根布局 (暗黑主题、Inter 字体、Metadata)\n│   ├── page.tsx                  # 集团总览双中心门户首页 (Portal)\n│   ├── docs/                     # 需求文档与系统规格说明页\n│   ├── system/                   # 系统管理 (用户/角色/组织权限/审计日志)\n│   ├── zero-carbon/              # 【平台一】零碳园区集控中心 (30+ 路由)\n│   │   ├── layout.tsx            # 集控中心外壳 (PlatformShell 注入)\n│   │   ├── screen/               # 集控大屏驾驶舱 (GIS 地图、阶段打分、核心 KPI)\n│   │   ├── monitor/              # 集中监管 (指标管控 / 在线监测 / 绿电监测)\n│   │   ├── energy/               # 能耗能效分析 (用能结构/成本/单耗/产值/对标/综合)\n│   │   ├── carbon/               # 碳管理 (碳核算 / 碳分析 / 碳报告与核查)\n│   │   ├── project/              # 零碳项目评估 (档案 / 模型 / 效益评估 / 自评估)\n│   │   ├── reports/              # 统计报表 (用量 / 成本 / 单耗 / 碳排放)\n│   │   ├── alarm/                # 告警管理 (告警记录 / 规则配置 / 多渠道推送)\n│   │   ├── config/               # 基础配置 (因子库 / 费价模型 / 折标转换 / 接口 / 线下录入)\n│   │   ├── assistant/            # 智能助手 (AI 语音控制与自然语言问数)\n│   │   └── data-catalog/         # 零碳数据采集清单\n│   └── carbon-footprint/         # 【平台二】产品碳足迹集采中心 (15+ 路由)\n│       ├── layout.tsx            # 碳足迹外壳 (PlatformShell 注入)\n│       ├── cockpit/              # 碳足迹全景驾驶舱 (LCA 概览、红黑榜、荣誉轮播)\n│       ├── analysis/             # 多维碳分析 (同类产品对比、碳热点模型、基准对标)\n│       ├── database/             # 实景数据库 (BOM 溯源、工单能耗穿透、ISO 14067 报告)\n│       ├── cbam/                 # 欧盟 CBAM 专区 (HS-CN 映射、资质、成本测算、知识库)\n│       ├── certification/        # 第三方认证管理 (资料模板、申报流、证书归档)\n│       ├── factor/               # 因子库管理 (股份同步、经营单位下发、因子集构建)\n│       ├── config/ & interface/  # 接口与字段映射配置\n│       └── data-catalog/         # 碳足迹数据采集清单\n├── components/                   # 组件层 (Atomic Design 原语与共享业务组件)\n│   ├── shared/                   # 全局复用组件\n│   │   ├── platform-shell.tsx    # 双中心外壳（双平台胶囊切换、侧边栏折叠、顶栏面包屑）\n│   │   ├── primitives.tsx        # 工业原子组件 (Panel, PanelTitle, Badge, StatusBadge, DataTable, KpiCard)\n│   │   ├── charts.tsx            # Recharts 响应式图表二次封装\n│   │   ├── modal.tsx             # 模态弹窗组件\n│   │   ├── select.tsx            # 工业级下拉选择器\n│   │   ├── time-range.tsx        # 时间范围与采样频率切换器\n│   │   └── enterprise-compare.tsx# 多工厂多单位横向对比视图\n│   ├── portal/                   # 集团总览门户专属视图组件\n│   ├── system/                   # 系统管理专属视图组件\n│   └── docs/                     # 需求文档浏览视图组件\n├── lib/                          # 业务逻辑、领域建模与确定性数据引擎\n│   ├── org.ts                    # 6 大一级经营单位、21 家二级工厂、15 园区拓扑树\n│   ├── indicators.ts             # 65+ 项管控指标字典、计算公式说明与状态判定\n│   ├── nav-config.ts             # 双中心全量导航菜单与元数据配置\n│   ├── mock-data.ts              # 全局业务时序量测、尖峰平谷、负荷曲线、CBAM 等数据集\n│   ├── variant.ts                # 确定性数据演化引擎 (基于 Seed 的无闪烁时序演变算法)\n│   ├── data-catalog.ts           # 静态与动态数据采集需求清单\n│   └── utils.ts                  # Tailwind 类名合并工具 (`cn`)\n├── public/                       # 静态资源 (图片、SVG 图标、Logo)\n├── package.json                  # 依赖配置清单\n└── tsconfig.json                 # TypeScript 编译选项与路径别名 (`@/*`)\n```\n\n---\n\n## 🧭 三、“双中心”核心业务架构与路由矩阵\n\n```mermaid\ngraph LR\n    Portal[\"/ 门户总览\"] --> ZeroCarbon[\"/zero-carbon 零碳园区集控中心\"]\n    Portal --> CarbonFootprint[\"/carbon-footprint 产品碳足迹集采中心\"]\n    Portal --> System[\"/system 系统管理\"]\n    Portal --> Docs[\"/docs 需求规范\"]\n\n    subgraph ZeroCarbonModules[\"零碳园区集控中心 (9大模块)\"]\n        ZC_Screen[\"集控大屏 (/screen)\"]\n        ZC_Monitor[\"集中监管 (/monitor/*)<br/>- 指标管控 (65+指标)<br/>- 在线监测 (水电气实时)<br/>- 绿电监测 (一键消纳报告)\"]\n        ZC_Energy[\"能耗能效分析 (/energy/*)<br/>- 用能结构 (桑基图)<br/>- 成本/单耗/产值/对标\"]\n        ZC_Carbon[\"碳管理 (/carbon/*)<br/>- 碳核算/分析/国标报告\"]\n        ZC_Project[\"零碳项目评估 (/project/*)\"]\n        ZC_Reports[\"统计报表 (/reports/*)\"]\n        ZC_Alarm[\"告警闭环 (/alarm/*)\"]\n        ZC_Config[\"基础配置与线下录入 (/config/*)\"]\n        ZC_AI[\"AI 智能助手 (/assistant)\"]\n    end\n\n    subgraph CFModules[\"产品碳足迹集采中心 (7大模块)\"]\n        CF_Cockpit[\"碳足迹驾驶舱 (/cockpit)\"]\n        CF_Analysis[\"多维碳分析 (/analysis)\"]\n        CF_Database[\"实景数据库与工单溯源 (/database)\"]\n        CF_CBAM[\"欧盟 CBAM 专区 (/cbam)\"]\n        CF_Cert[\"第三方认证管理 (/certification)\"]\n        CF_Factor[\"因子库管理 (/factor)\"]\n        CF_Interface[\"数据接口配置 (/interface)\"]\n    end\n\n    ZeroCarbon --> ZeroCarbonModules\n    CarbonFootprint --> CFModules\n```\n\n---\n\n## 🎨 四、视觉与组件规范体系 (Design Tokens)\n\n### 1. 工业科技视觉调色盘 (Color System)\n* **深空石板底色 (`--bg-deep`)**：`#0b1120` / `#0f172a`，提供沉浸式中控大屏与工业监控氛围；\n* **卡片背景 (`--card`)**：`#1e293b`（附带 `border-border/60` 细边框与悬停微光）；\n* **低碳翡翠绿 (`--color-primary`)**：`#10b981` / `#059669`，用于标识达标、绿电、优秀与主操作；\n* **科技深海蓝 (`--chart-1`)**：`#0284c7`，用于标识市电负荷、水资源与基准线；\n* **警告与异常色**：`#f59e0b`（琥珀黄预警）、`#ef4444`（玫瑰红超标告警）。\n\n### 2. 核心通用业务组件\n1. **`PlatformShell`**：全系统顶层外壳，内置顶部平台无缝切换器（集控 ↔ 集采）、左侧收缩菜单、全局时间/园区筛选与快捷系统管理入口；\n2. **`Panel` & `PanelTitle`**：Bento Grid 栅格化容器，统一卡片圆角、内边距、边框及标题图标；\n3. **`KpiCard`**：核心指标展示卡片，支持数值、单位、同环比变化率徽章与语义色调 (`ok` / `warn` / `danger` / `info`)；\n4. **`DataTable`**：响应式工业数据表格，支持斑马纹、状态胶囊徽章与行内操作；\n5. **`LineTrend` / `AreaTrend` / `Donut`**：深度封装 Recharts，适配暗黑模式，自适应容器宽高，内置 Tooltip 与图例格式化。\n\n---\n\n## ⚡ 五、确定性动态演化引擎 (`lib/variant.ts`)\n\n为了解决前端原型在演示和评审时“数据假死”或“随机闪烁不稳定”的痛点，工程内置了基于散列因子的**确定性演化引擎**：\n1. **`seedFactor(...seeds)`**：将当前选中的组织工厂名称（如“沈变本部”）与统计周期（如“2026-08”）计算为唯一的特征因子（范围 `0.72 ~ 1.28`）；\n2. **`vary(dataset, factor, options)`**：根据特征因子等比例缩放数据集中的数值字段，保证**同一工厂/同一时间查出的数据绝对一致稳定**，而**切换工厂或时间时，所有图表与 KPI 联动产生自然合理的时序变化**；\n3. **`varyNum(value, factor)`**：单值安全缩放并根据有效数字保留小数位。\n\n---\n\n## 🚀 六、核心业务交互亮点\n\n1. **集中监管 - 指标管控 (`/zero-carbon/monitor/indicator`)**：\n   * 左侧组织工厂树快速过滤；\n   * 「工厂综合」「产品整体」「关键工序」三级指标 Tab 切换；\n   * 卡片展示当前值与同比/环比**差值与百分比**；\n   * 右侧滑出抽屉：展示原始数据明细、计算公式说明、近8个月趋势对比折线图及 **AI 根因诊断分析卡片**。\n2. **集中监管 - 在线监测 (`/zero-carbon/monitor/online`)**：\n   * 拓扑树：工厂 → 产线 → 工序 → 重点用能设备（如 500kW 干燥罐、立塔挤出机）；\n   * 电/水/气/蒸汽四介质 Tab 切换；\n   * 24小时负荷、光伏发电、储能充放、市电购电**多曲线勾选对比联动**；\n   * 尖峰平谷用电结构环形图 + 实时电气参数表（电压/电流/有功/功率因数）。\n3. **集中监管 - 绿电监测与消纳报告 (`/zero-carbon/monitor/green`)**：\n   * 直供绿电、市场化交易绿电、GEC 绿证认购三大流向精确拆解；\n   * 内置**一键生成绿电消纳分析报告**模态框，提供电量公式拆解与 **AI 储能削峰填谷优化与光伏清洗调度建议**。\n4. **线下手工数据填报 (`/zero-carbon/config/entry`)**：\n   * 针对无自动化表计能源（天然气、柴油、工业增加值）提供合规录入表单。\n5. **智能助手 (`/zero-carbon/assistant`)**：\n   * 支持语音麦克风唤醒与自然语言智能问数，可生成图表并深层直达目标页面。\n\n---\n\n## 💡 七、开发者扩展与二次开发指引\n\n### 1. 增加新页面/新路由\n直接在 `app/zero-carbon/` 或 `app/carbon-footprint/` 目录下新建文件夹和 `page.tsx`，并在 `lib/nav-config.ts` 中的导航数组中添加对应菜单项即可自动在侧边栏渲染。\n\n### 2. 增加/调整管控指标\n直接编辑 `lib/indicators.ts` 中的 `indicators` 数组，定义指标的 `id`、`name`、`category`、`formula`、`unit`、`base`、`target` 及 `aiReasoning`。\n\n### 3. 本地编译与启动\n```bash\n# 进入产品原型目录\ncd d:\\Project\\TJ-nengtan\\产品原型\n\n# 启动热重载开发服务器\npnpm dev\n\n# 执行全静态路由编译校验\npnpm build\n```\n"
  },
  {
    "id": "manual-09",
    "no": 9,
    "filename": "09_高保真演示原型系统规划与开发建议书.md",
    "title": "高保真演示原型系统规划与开发建议书",
    "category": "总体架构与工程底座",
    "readTime": "18 分钟",
    "wordCount": 8839,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "📑 目录索引",
        "id": "目录索引"
      },
      {
        "level": 2,
        "title": "一、多 Agent 视角需求与演示价值解构",
        "id": "一-多-agent-视角需求与演示价值解构"
      },
      {
        "level": 3,
        "title": "1. 🎯 产品经理 (PM) 视角：演示汇报的“三大高光时刻”",
        "id": "1-产品经理-pm-视角-演示汇报的-三大高光时刻"
      },
      {
        "level": 3,
        "title": "2. 🎨 UI/UX 体验总监视角：工业科技质感与微交互",
        "id": "2-ui-ux-体验总监视角-工业科技质感与微交互"
      },
      {
        "level": 3,
        "title": "3. 💻 前端首席架构师视角：模块化与可维护性",
        "id": "3-前端首席架构师视角-模块化与可维护性"
      },
      {
        "level": 3,
        "title": "4. 📊 数据与算法工程师视角：65+ 指标与 AI 智能化",
        "id": "4-数据与算法工程师视角-65-指标与-ai-智能化"
      },
      {
        "level": 2,
        "title": "二、高保真演示原型总体技术架构",
        "id": "二-高保真演示原型总体技术架构"
      },
      {
        "level": 3,
        "title": "推荐前端技术选型清单",
        "id": "推荐前端技术选型清单"
      },
      {
        "level": 2,
        "title": "三、UI/UX 设计风格与 Design System 规范",
        "id": "三-ui-ux-设计风格与-design-system-规范"
      },
      {
        "level": 3,
        "title": "1. 颜色 Design Tokens 定义",
        "id": "1-颜色-design-tokens-定义"
      },
      {
        "level": 3,
        "title": "2. Bento Grid 布局与卡片设计规范",
        "id": "2-bento-grid-布局与卡片设计规范"
      },
      {
        "level": 3,
        "title": "3. 组件 8 种核心状态交互规范",
        "id": "3-组件-8-种核心状态交互规范"
      },
      {
        "level": 2,
        "title": "四、核心高保真演示场景与交互动线规划",
        "id": "四-核心高保真演示场景与交互动线规划"
      },
      {
        "level": 3,
        "title": "场景一：集中监管 —— 指标管控与 AI 根因穿透",
        "id": "场景一-集中监管-指标管控与-ai-根因穿透"
      },
      {
        "level": 3,
        "title": "场景二：集中监管 —— 在线监测与光储新能源联动",
        "id": "场景二-集中监管-在线监测与光储新能源联动"
      }
    ],
    "content": "# 🌟 特变电工“双中心”高保真演示原型系统规划与开发建议书\n\n> **文档版本**：V2.0-HighFidelity  \n> **编制架构**：多 Agent 专家组（PM 产品专家、UI/UX 体验总监、前端首席架构师、数据与算法工程师、系统架构师、QA 测试负责人）  \n> **适用对象**：特变电工（电装集团）项目组、领导汇报团队、产品经理、前端开发团队\n\n---\n\n## 📑 目录索引\n1. [多 Agent 视角需求与演示价值解构](#一多-agent-视角需求与演示价值解构)\n2. [高保真演示原型总体技术架构](#二高保真演示原型总体技术架构)\n3. [UI/UX 设计风格与 Design System 规范](#三uiux-设计风格与-design-system-规范)\n4. [核心高保真演示场景与交互动线规划](#四核心高保真演示场景与交互动线规划)\n5. [数据真实感与确定性动态演化方案](#五数据真实感与确定性动态演化方案)\n6. [原型深化开发实施路线图 (9.15 节点攻坚)](#六原型深化开发实施路线图-915-节点攻坚)\n\n---\n\n## 一、多 Agent 视角需求与演示价值解构\n\n```mermaid\ngraph TD\n    subgraph MultiAgentTeam[\"多 Agent 专家分析矩阵\"]\n        PM[\"🎯 PM 产品专家<br/>聚焦集团决策与汇报价值\"]\n        UIUX[\"🎨 UI/UX 体验总监<br/>聚焦暗黑工业美学与交互流畅度\"]\n        Frontend[\"💻 前端首席架构师<br/>聚焦组件复用与高性能渲染\"]\n        DataEng[\"📊 数据与算法工程师<br/>聚焦65项指标与AI根因归因\"]\n        Architect[\"🛠️ 系统架构师<br/>聚焦双中心解耦与领域上下文\"]\n        QA[\"🧪 QA 测试负责人<br/>聚焦演示容错与全流程闭环\"]\n    end\n\n    MultiAgentTeam --> Output[\"高保真可交互演示原型核心诉求\"]\n```\n\n### 1. 🎯 产品经理 (PM) 视角：演示汇报的“三大高光时刻”\n* **高光时刻一：集团驾驶舱宏观掌控力** —— 首页总览与 4K 大屏展示 15 个零碳园区地理分布、21 家工厂接入、绿电综合占比 38.6%、万元产值碳排强度下降 6.5%，一屏尽览集团绿色转型成效；\n* **高光时刻二：生产现场工序级穿透力** —— 集中监管支持从“沈变公司”到“沈变本部”再到“高压真空干燥工序”，卡片直观呈现当前值、同比/环比差值及比例，并弹出 **AI 根因分析诊断卡片**，让领导看到数字化赋能现场节能的实际落地；\n* **高光时刻三：国际合规与出海竞争力** —— 产品碳足迹集采中心展示从原材料 BOM 到工单级实景核算，以及 **欧盟 CBAM 碳关税一键合规申报包** 与 ISO 14067 证书归档，支撑特变装备出海贸易。\n\n### 2. 🎨 UI/UX 体验总监视角：工业科技质感与微交互\n* **视觉基调**：摒弃传统工业软件沉闷呆板的灰白表格，采用 **深空石板灰 (`#0b1120`) + 低碳翡翠绿 (`#10b981`) + 科技深海蓝 (`#0284c7`)** 的现代化暗黑科技风格；\n* **信息架构**：采用 **Bento Grid（便当盒栅格）** 布局，主次分明，重点指标大字体呼吸排版，卡片带有 1px 极细边框与悬停微光浮动效果；\n* **色彩语义严格管控**：绿色代表“达标/优秀/绿电”，蓝色代表“正常/基准/市电”，黄色代表“预警/临期”，红色代表“超标/严重异常”，严格满足 WCAG 2.1 AA 4.5:1 对比度标准。\n\n### 3. 💻 前端首席架构师视角：模块化与可维护性\n* 建立统一的 **`PlatformShell` 顶层外壳**，实现“零碳园区集控中心”与“产品碳足迹集采中心”两大业务系统**双平台胶囊无缝切换**，切换过程保持选中的工厂和时间上下文状态；\n* 封装通用原子组件库（`Panel`, `Badge`, `StatusBadge`, `KpiCard`, `DataTable`, `LineTrend`, `Donut`, `Modal`），杜绝页面间代码重复复制，保证全系统 53 个路由交互行为 100% 一致。\n\n### 4. 📊 数据与算法工程师视角：65+ 指标与 AI 智能化\n* 完整内嵌《“双中心”项目能碳管控指标体系 V1.4》中的 **65+ 项指标定义、数学公式、基准值与标杆值**；\n* 每一项指标均包含：\n  $$\\text{当前值} \\quad \\big| \\quad \\Delta_{\\text{同比}} = \\text{当前值} - \\text{去年同期} \\quad \\big| \\quad \\text{同比率} = \\frac{\\Delta_{\\text{同比}}}{\\text{去年同期}} \\times 100\\%$$\n* 集成 **AI 根因诊断逻辑**，针对异常指标（如高压干燥罐蒸汽超标 18%）自动生成专家级成因分析与阀门检修建议。\n\n---\n\n## 二、高保真演示原型总体技术架构\n\n```mermaid\ngraph TB\n    subgraph ClientBrowser[\"浏览器交互层 (Chrome / Edge / 4K 大屏)\"]\n        UIViews[\"53 个高保真业务路由 (App Router)\"]\n        InteractiveDrawers[\"详情下钻抽屉 / 报表生成弹窗 / AI 语音助手\"]\n    end\n\n    subgraph StateAndRouting[\"状态与路由控制层\"]\n        URLState[\"URL 路由参数 & SearchParams 状态同步\"]\n        PlatformContext[\"双平台上下文管理器 (PlatformKey, ActiveOrg, ActivePeriod)\"]\n        VariantEngine[\"确定性动态演化引擎 (lib/variant.ts)\"]\n    end\n\n    subgraph ComponentLayer[\"原子组件与业务模型层\"]\n        SharedUI[\"通用原子组件 (PlatformShell, Primitives, Charts)\"]\n        OrgTree[\"组织拓扑树 (lib/org.ts - 6大单位/21工厂/15园区)\"]\n        IndicatorDict[\"指标数据字典 (lib/indicators.ts - 65+ 指标体系)\"]\n        MockStore[\"全局业务数据集 (lib/mock-data.ts)\"]\n    end\n\n    subgraph BuildEngine[\"构建与编译运行时\"]\n        NextJS[\"Next.js 16.3.0 (Turbopack 极速热编译)\"]\n        TailwindCSS[\"Tailwind CSS 4.3 (现代原生 CSS 变量 Tokens)\"]\n        Recharts[\"Recharts 3.10.1 (SVG 矢量响应式图表)\"]\n    end\n\n    ClientBrowser --> StateAndRouting\n    StateAndRouting --> ComponentLayer\n    ComponentLayer --> BuildEngine\n```\n\n### 推荐前端技术选型清单\n\n| 模块类别 | 选型技术 | 版本要求 | 选型理由与架构优势 |\n| :--- | :--- | :--- | :--- |\n| **应用框架** | **Next.js (App Router)** | `16.3.x` | 原生支持服务端渲染与客户端切片，Turbopack 保证页面秒级切换无白屏 |\n| **视图引擎** | **React** | `19.2.x` | 现代 React Hooks 与 Transitions 机制，支持复杂图表高频刷新不卡顿 |\n| **类型系统** | **TypeScript** | `5.7.x` | 强类型约束指标结构体、组织树节点与告警规则，杜绝运行期未定义错误 |\n| **样式体系** | **Tailwind CSS 4** | `4.3.x` | 结合 CSS Variables 实现全套 Design Tokens，支持动态换肤与暗黑工业质感 |\n| **可视化图表** | **Recharts + ECharts 5** | `3.10.x` | Recharts 负责时序折线图、峰谷环形图；ECharts 负责**多工序能流桑基图 (Sankey)** |\n| **图标库** | **Lucide React** | `1.17.x` | 现代化轻量矢量图标，涵盖能源、碳排、工厂、仪表、告警等所有语义 |\n| **语音交互** | **Web Speech API** | 原生标准 | 浏览器原生语音识别与合成，实现原型演示中免插件麦克风语音问数与页面跳转 |\n\n---\n\n## 三、UI/UX 设计风格与 Design System 规范\n\n### 1. 颜色 Design Tokens 定义\n```css\n:root {\n  /* 基础背景色阶（深空石板灰系列） */\n  --bg-deep: #0b1120;             /* 最底层全屏背景 */\n  --bg-surface: #1e293b;          /* 卡片与面板主背景 */\n  --bg-surface-hover: #334155;    /* 悬停微高亮背景 */\n  --border-slate: rgba(51, 65, 85, 0.6); /* 1px 细边框 */\n\n  /* 核心语义主色 */\n  --color-primary: #10b981;       /* 低碳翡翠绿（品牌主色，达标、绿电、优秀） */\n  --color-primary-glow: rgba(16, 185, 129, 0.2);\n  --color-cyber-blue: #0284c7;    /* 科技深海蓝（市电、基准、负荷曲线） */\n  --color-warning: #f59e0b;       /* 琥珀金（预警、储能放电、临期证书） */\n  --color-danger: #ef4444;        /* 玫瑰红（超标异常、尖峰电量、设备故障） */\n\n  /* 字体排印 */\n  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;\n  --font-mono: 'JetBrains Mono', 'Roboto Mono', monospace; /* 用于数字、公式、指标 */\n}\n```\n\n### 2. Bento Grid 布局与卡片设计规范\n* **卡片规范**：所有卡片采用统一的圆角 `rounded-lg (8px)`，背景 `bg-card (#1e293b)`，带有 `border border-border/60`；\n* **悬停动效**：鼠标悬停在指标卡片时，边框颜色平滑过渡到 `border-primary/60`（过渡时间 200ms），卡片整体沿 Y 轴向上浮动 2px，并伴随内发光效果；\n* **数字可读性**：所有关键 KPI 数值强制使用等宽字体（`font-mono`），保证多位数在对比和刷新时不发生左右横向跳动。\n\n### 3. 组件 8 种核心状态交互规范\n```mermaid\nstateDiagram-v2\n    [*] --> Normal: 页面加载完成\n    Normal --> Hover: 鼠标悬停\n    Hover --> Normal: 鼠标移出\n    Hover --> Active: 点击选中\n    Active --> Normal: 切换其他项\n    Normal --> Loading: 切换组织/时间\n    Loading --> Normal: 确定性数据演化就绪\n    Normal --> Empty: 无测点或无工序\n    Normal --> Alert: 指标超标/设备离线\n    Normal --> Disabled: 工厂未接入(置灰)\n```\n\n---\n\n## 四、核心高保真演示场景与交互动线规划\n\n### 场景一：集中监管 —— 指标管控与 AI 根因穿透\n```mermaid\nsequenceDiagram\n    autonumber\n    actor User as 演示汇报人 / 领导\n    participant LeftTree as 左侧组织工厂树\n    participant LevelTab as 三级指标 Tab\n    participant BentoCards as 右侧指标卡片流\n    participant Drawer as 二级下钻抽屉\n    participant AIBlock as AI 根因诊断引擎\n\n    User->>LeftTree: 搜索并点击选择「沈变本部」\n    LeftTree->>BentoCards: 联动过滤当前工厂 65 项指标\n    User->>LevelTab: 切换查看「关键工序」层级\n    LevelTab->>BentoCards: 展示工序能耗卡片（含异常状态提示）\n    User->>BentoCards: 点击红色异常卡片「高压干燥万元产值能耗」\n    BentoCards->>Drawer: 平滑滑出右侧深度下钻抽屉\n    Drawer->>Drawer: 呈现计算公式、数据源头说明与近8个月历史趋势图\n    Drawer->>AIBlock: 渲染 AI 归因诊断结论（提示 2号干燥罐阀门结垢）\n    User->>Drawer: 点击「生成工序整改工单」，完成闭环演示\n```\n\n### 场景二：集中监管 —— 在线监测与光储新能源联动\n* **多介质快速切换**：提供“电力”“工业水”“天然气”“蒸汽”四大能源介质快捷 Tab；\n* **拓扑树精细化**：左侧组织树展开至末级设备（如“1号真空干燥罐 500kW”“全自动数控叠片台”“无局放试验变压器”）；\n* **多曲线自由勾选联动**：\n  * ☑ 总用电负荷（蓝色）\n  * ☑ 光伏发电出力（绿色）\n  * ☑ 储能充放功率（黄色）\n  * ☑ 市电购电负荷（红色）\n* **尖峰平谷与电气参数**：左侧环形图呈现尖峰/高峰/平段/低谷用电结构，右侧表格呈现进线回路与干燥回路的实时电压、电流、有功功率及功率因数（`0.98`）。\n\n### 场景三：集中监管 —— 绿电消纳分析与一键导出报告\n* **三大来源精准拆解**：\n  * **直供绿电 (58%)**：自建屋顶分布式光伏与储能直供；\n  * **市场化交易绿电 (28%)**：省电力交易中心跨省风光绿电合同；\n  * **GEC 绿证认购 (14%)**：国家能源局可再生能源信息管理中心绿证；\n* **一键生成绿电消纳报告**：点击顶部「一键生成绿电消纳报告」按钮，弹出高保真报告模态框，包含：\n  1. 报告概述与主体信息；\n  2. 绿电消费量精准拆解与物理认定量公式计算；\n  3. **AI 智能调度建议**（午间 11:30~13:30 储能以 5MW 满功率充电、3号车间光伏板机器人清洗调度）；\n  4. 支持一键导出 PDF 报告。\n\n### 场景四：能耗能效 —— 多工序能流桑基图 (Sankey Diagram)\n* 在「用能结构分析」页面中，以交互式能流桑基图直观呈现从“市政电网 + 屋顶光伏 + 锅炉蒸汽”输入，分流流向“高压干燥罐 + 连续退火炉 + SMT 贴片机 + 公辅空压站”，各分支流线带有流动粒子动效与悬停能量损耗百分比。\n\n### 场景五：产品碳足迹集采中心 —— CBAM 欧盟申报与工单溯源\n* **BOM 级数据溯源**：从变压器成品（如 `SZ-110kV/63000kVA`）穿透展开硅钢片 (62%)、电解铜 (21%)、绝缘油 (9%) 及直接加工能耗 (8%)；\n* **欧盟 CBAM 申报专区**：匹配 HS 编码 `8504.23`，计算单台隐含碳排放 `1.42 tCO2/台`，在 €80/t 碳价情景下预估碳关税支出 `€142,500`，并支持一键下载 CBAM 季度申报 XML 合规包。\n\n---\n\n## 五、数据真实感与确定性动态演化方案\n\n高保真原型在面对不同领导与客户演示时，最忌讳“切换工厂后数字完全不变（假死）”或“每次刷新随机生成离谱数字（失真）”。\n\n本方案采用内置的 **确定性数据演化算法 (`lib/variant.ts`)**：\n\n$$f(\\text{Org}, \\text{Period}) = 0.72 + 0.56 \\times \\left( \\frac{\\text{Hash}(\\text{Org} \\parallel \\text{Period}) \\pmod{1000}}{1000} \\right) \\in [0.72, 1.28]$$\n\n$$\\text{Metric}_{\\text{Actual}} = \\text{Metric}_{\\text{Base}} \\times f(\\text{Org}, \\text{Period})$$\n\n### 演化机制优势：\n1. **绝对确定性与可复现性**：选择“沈变本部 + 2026年8月”，计算出的综合能耗始终是 `1284.5 tce`，反复切换不会跳字；\n2. **自然的梯度演变**：切换到“鲁缆本部”，因子平滑变化，所有线缆指标（如吨铜电耗 `82.4 kWh/t`）与图表联动呈现与变压器不同的合理数值；\n3. **关键业务逻辑锁定**：百分比、合规结论、AI 建议文本不参与盲目缩放，严格遵循业务真值。\n\n---\n\n## 六、原型深化开发实施路线图 (9.15 节点攻坚)\n\n```mermaid\ngantt\n    title 特变电工“双中心”原型深化与交付路线图\n    dateFormat  YYYY-MM-DD\n    section 阶段一：架构与数据对齐\n    完成组织树与65+指标数据字典      :done, des1, 2026-08-20, 2026-08-25\n    全量53路由编译与本地服务启动      :done, des2, 2026-08-25, 2026-08-25\n    section 阶段二：核心高保真场景深化\n    指标管控下钻与AI根因分析卡片打磨  :active, des3, 2026-08-26, 2026-08-30\n    在线监测水电气与光储多曲线联动    :active, des4, 2026-08-28, 2026-09-02\n    绿电消纳报告一键生成与PDF导出    :des5, 2026-09-01, 2026-09-05\n    用能结构桑基图 (Sankey) 粒子流集成:des6, 2026-09-03, 2026-09-08\n    section 阶段三：演示演练与终版交付\n    CBAM 专区与工单溯源流程闭环      :des7, 2026-09-06, 2026-09-11\n    4K 大屏适配与演示全流程彩排      :des8, 2026-09-12, 2026-09-14\n    9.15 原型系统与 PRD 交付评审转研发:milestone, m1, 2026-09-15, 2026-09-15\n```\n\n---\n\n## 🎯 总结与落地建议\n\n1. **统一代码主干**：所有前端页面开发工作均在 `d:\\Project\\TJ-nengtan\\产品原型` 目录下进行，利用 `pnpm dev` 保持实时预览；\n2. **规范先行**：开发任何新页面前，参考 [`05_前端开发手册与组件规范.md`](file:///d:/Project/TJ-nengtan/开发手册/05_前端开发手册与组件规范.md) 和 [`03_65项能碳管控指标体系与计算引擎手册.md`](file:///d:/Project/TJ-nengtan/开发手册/03_65项能碳管控指标体系与计算引擎手册.md)；\n3. **突出智能化与国际化**：在演示汇报中重点展示 **“AI 根因分析诊断”**、**“一键生成绿电消纳报告”** 与 **“CBAM 欧盟碳关税合规专区”**，充分体现特变电工在新能源装备领域的行业领军水准与数字化创新能力！\n"
  },
  {
    "id": "manual-10",
    "no": 10,
    "filename": "10_特变电工双中心高保真原型完整开发方案.md",
    "title": "特变电工双中心高保真原型完整开发方案",
    "category": "总体架构与工程底座",
    "readTime": "12 分钟",
    "wordCount": 6218,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "📑 方案总览与五大核心目标矩阵",
        "id": "方案总览与五大核心目标矩阵"
      },
      {
        "level": 2,
        "title": "一、系统全景功能架构与 10 大核心业务模块深度设计",
        "id": "一-系统全景功能架构与-10-大核心业务模块深度设计"
      },
      {
        "level": 3,
        "title": "1. 🌐 集团总览门户与 4K 驾驶舱大屏 (`/` 与 `/zero-carbon/screen`)",
        "id": "1-集团总览门户与-4k-驾驶舱大屏-与-zero-carbon-screen"
      },
      {
        "level": 3,
        "title": "2. ⚡ 集中监管模块 (`/zero-carbon/monitor/*`)",
        "id": "2-集中监管模块-zero-carbon-monitor"
      },
      {
        "level": 3,
        "title": "3. 📊 能耗能效分析模块 (`/zero-carbon/energy/*`)",
        "id": "3-能耗能效分析模块-zero-carbon-energy"
      },
      {
        "level": 3,
        "title": "4. 🍃 碳管理模块 (`/zero-carbon/carbon/*`)",
        "id": "4-碳管理模块-zero-carbon-carbon"
      },
      {
        "level": 3,
        "title": "5. 🎯 零碳项目评估、统计报表、告警与配置模块",
        "id": "5-零碳项目评估-统计报表-告警与配置模块"
      },
      {
        "level": 3,
        "title": "6. 🌍 产品碳足迹集采中心 (`/carbon-footprint/*`)",
        "id": "6-产品碳足迹集采中心-carbon-footprint"
      },
      {
        "level": 2,
        "title": "二、前端工程美学与 UI/UX 规范体系",
        "id": "二-前端工程美学与-ui-ux-规范体系"
      },
      {
        "level": 2,
        "title": "三、确定性 Mock 数据演化体系 (`lib/variant.ts`)",
        "id": "三-确定性-mock-数据演化体系-lib-variant-ts"
      },
      {
        "level": 2,
        "title": "四、高保真原型演示标准动线 (Demo Presentation Flow)",
        "id": "四-高保真原型演示标准动线-demo-presentation-flow"
      },
      {
        "level": 2,
        "title": "五、9.15 节点交付与落地排期表",
        "id": "五-9-15-节点交付与落地排期表"
      }
    ],
    "content": "# 💎 特变电工“双中心”高保真原型系统完整开发方案\n\n> **项目名称**：特变电工（电装集团）能碳管控“双中心”平台原型系统  \n> **核心目标**：构建兼具**功能完整性、业务深度对齐、工业暗黑科技美学、全链路交互闭环与可信 Mock 演示数据**的集团级高保真产品原型系统。  \n> **归档位置**：`d:\\Project\\TJ-nengtan\\开发手册\\10_特变电工双中心高保真原型完整开发方案.md`\n\n---\n\n## 📑 方案总览与五大核心目标矩阵\n\n```mermaid\ngraph TD\n    Goal1[\"1. 功能完整性<br/>(覆盖双中心 53 个路由模块)\"]\n    Goal2[\"2. 需求深度符合<br/>(对齐65+指标、组织关系与整改意见)\"]\n    Goal3[\"3. 前端工业美学<br/>(Bento Grid + 深空石板灰 + 翡翠绿)\"]\n    Goal4[\"4. 交互全链路闭环<br/>(组织树联动/二级抽屉/报告导出/AI问数)\"]\n    Goal5[\"5. 确定性 Mock 数据<br/>(基于 Seed 哈希的动态时序演化引擎)\"]\n\n    Goal1 --> Success[\"特变电工能碳双中心高保真演示原型\"]\n    Goal2 --> Success\n    Goal3 --> Success\n    Goal4 --> Success\n    Goal5 --> Success\n```\n\n---\n\n## 一、系统全景功能架构与 10 大核心业务模块深度设计\n\n### 1. 🌐 集团总览门户与 4K 驾驶舱大屏 (`/` 与 `/zero-carbon/screen`)\n* **总览门户 (`/`)**：\n  * 顶部特变电工集团品牌标识与用户角色切换；\n  * 双核心平台大卡片入口（**零碳园区集控中心** ↔ **产品碳足迹集采中心**），带有 3D 拟物图标、核心功能矩阵概览与平滑悬停光效；\n  * 底部快速直达：系统管理、需求规格文档、智能助手。\n* **集控大屏 (`/zero-carbon/screen`)**：\n  * **中心区域**：全国 15 个零碳产业园区 GIS 拓扑分布地图，实时显示各园区建设阶段（规划中/在建中/已认证）、综合评分及绿电占比；\n  * **顶部 KPI 矩阵**：接入园区数 (`15个`)、接入工厂数 (`21家`)、综合绿电占比 (`38.6%`)、年综合能源消费量 (`12.8万tce`)、万元产值碳排放强度 (`0.62 tCO2/万元`)、实施零碳技改项目 (`34个`)；\n  * **左右 Bento 栏**：月度能耗趋势堆叠图、用能结构占比环形图、新能源实时出力与削峰填谷曲线、园区达标进度排行榜。\n\n---\n\n### 2. ⚡ 集中监管模块 (`/zero-carbon/monitor/*`)\n\n#### ① 指标管控 (`/zero-carbon/monitor/indicator`) —— 65+ 指标三级体系与 AI 根因分析\n* **左侧多级组织树**：支持 6 大一级经营单位（沈变、衡变、新变、鲁缆、新缆、德缆）与 21 家二级工厂折叠展开与即时模糊搜索；未接入工厂置灰并附带“规划接入中”提示；\n* **三级指标层级切换 Tab**：\n  * **工厂综合指标（11项）**：综合能源消费量、总碳排放量、单位能耗碳排、非化石能源消费占比、物理认定量占比、工业增加值能耗、关键能源自动采集率、节能装备应用占比等；\n  * **产品整体指标（5项）**：单型号综合能耗、产品电耗、蒸汽单耗、天然气单耗、水耗；\n  * **关键工序指标（49项）**：变压器高压干燥/试验、线缆铜铝拉丝/交联、开关柜钣金加工/喷涂、电容器真空浸渍等；\n* **指标卡片设计**：\n  * 明确展示 **“当前核算值 + 内部基准值 + 行业标杆值”**；\n  * 同比/环比变化采用 **“先体现差值，再展示比例”** 格式（如：`同比: +0.15 (+11.54%)`），清晰标识红/绿/蓝状态徽章；\n* **二级详情深度下钻抽屉 (Drawer)**：\n  * 点击任意卡片滑出右侧抽屉，包含：参与计算的原始参数列表、可追溯核算公式、近 8 个月历史趋势对比折线图；\n  * **AI 根因分析与优化诊断卡片**（如：“该产品干燥工序蒸汽能耗超标 18%，归因于 2 号真空干燥罐温控疏水阀微漏”）。\n\n#### ② 在线监测 (`/zero-carbon/monitor/online`) —— 水电气四介质与光储负荷多曲线联动\n* **四介质快捷 Tab 切换**：电力、工业水、天然气、工业蒸汽；\n* **产线工序设备树**：工厂 ➔ 产线 ➔ 工序 ➔ 重点用能设备（如 500kW 干燥罐、全自动数控叠片台、无局放试验变压器）；\n* **多能源汇总与明细**：针对选中节点汇总展示有功功率、本日累计用电、水耗、气耗；\n* **24 小时多曲线勾选对比看板**：\n  * 支持自由勾选联动：☑ 总用电负荷（蓝色）、☑ 光伏发电（绿色）、☑ 储能充放（黄色）、☑ 市电购电（红色）；\n* **尖峰平谷与实时量测**：\n  * 尖峰/高峰/平段/低谷用电结构与电费环形图；\n  * 实时电气参数表（电压、电流、有功功率、无功功率、功率因数 `0.98`）。\n\n#### ③ 绿电监测与消纳报告 (`/zero-carbon/monitor/green`)\n* **三大绿电来源精准拆解**：\n  * 直供绿电 (58%)、市场化交易绿电 (28%)、GEC 绿证认购 (14%)，支持穿透查看溯源单号与购售电合同附件；\n* **一键生成绿电消纳分析报告**：\n  * 点击顶部操作按钮弹出规范报告模态框；\n  * 包含报告概述、基础信息、电量流向公式精确拆解、**AI 储能削峰填谷策略（午间满充、晚峰放电）与光伏板机器人清洗调度建议**、结论总结；支持一键导出 PDF。\n\n---\n\n### 3. 📊 能耗能效分析模块 (`/zero-carbon/energy/*`)\n\n* **用能结构分析 (`/energy/structure`)**：\n  * 交互式**能流桑基图 (Sankey Diagram)**，直观呈现电力、气、水、蒸汽从进线输入流向各生产车间与关键工序的流动损耗；\n  * 各介质月度/季度同环比占比分析。\n* **能源成本分析 (`/energy/cost`)**：\n  * 电费、水费、气费、蒸汽费用横向占比与多家经营单位成本分布对比；\n  * 峰谷电费套利优化建议。\n* **单位产品能耗分析 (`/energy/unit-product`)**：\n  * 提供**产品型号对比、产品种类对比、产线对比**；\n  * 同产品在**多家经营单位横向对比**（如沈变 vs 衡变同规格变压器单耗）；\n  * 同产品在**不同时段历史对比**，异常单耗波动标记。\n* **单位产值能耗分析 (`/energy/unit-output`)**：\n  * 按月度、季度、年度统计分析产值与综合能耗协同趋势；\n* **对标管理 (`/energy/benchmark`)**：\n  * 集团领跑榜与标杆值管理，支持自定义对标规则与行业前沿对标。\n\n---\n\n### 4. 🍃 碳管理模块 (`/zero-carbon/carbon/*`)\n\n* **碳排放核算 (`/carbon/accounting`)**：\n  * 范围一（直接燃烧）与范围二（外购电力/热力）分项核算；\n  * 核算公式可配置、可回溯，关联因子库版本；\n* **碳排放分析 (`/carbon/analysis`)**：\n  * 按排放源、能源类型、车间产线多维拆解碳排放构成；\n* **碳报告与核查支撑 (`/carbon/report`)**：\n  * 内置符合国家标准模板的碳排放月报与年报，一键生成导出；\n  * 组织层面汇集碳核算原始凭据，一键打包第三方核查支撑材料。\n\n---\n\n### 5. 🎯 零碳项目评估、统计报表、告警与配置模块\n\n* **零碳项目评估 (`/zero-carbon/project/*`)**：\n  * 项目档案库（光伏、储能、余热回收）；\n  * 效益评估模型（投资回收期、IRR、单位减排成本）；\n  * **零碳园区自评估打分**（涵盖能源利用、低碳技术、管理体系多维雷达图）。\n* **统计报表 (`/zero-carbon/reports/*`)**：\n  * 能源用量、能源成本、能源单耗、碳排放月度/季度导出报表，支持 Excel/PDF。\n* **告警闭环 (`/zero-carbon/alarm/*`)**：\n  * 多维阈值规则配置（能耗突增、单耗超标、设备离线、三级告警）；\n  * 在线确认、整改措施闭环处理流；多渠道推送策略（站内信、企微、短信）。\n* **基础配置与线下录入 (`/zero-carbon/config/*`)**：\n  * 碳排因子多版本库管理（支持历史数据重新计算）；\n  * 分时/阶梯费价模型；折标煤转换工具；接口配置管理；\n  * **线下人工数据录入 (`/config/entry`)**：针对天然气、柴油、工业增加值提供合规填报表单。\n* **智能助手 (`/zero-carbon/assistant`)**：\n  * AI 语音唤醒与识别，自然语言问数（如“上个月哪个工厂单耗最高”），自动生成对比图表并支持语音直达深层页面。\n\n---\n\n### 6. 🌍 产品碳足迹集采中心 (`/carbon-footprint/*`)\n\n* **碳足迹驾驶舱 (`/cockpit`)**：产品全生命周期 LCA 摇篮到大门阶段宏观概览与红黑榜；\n* **多维碳分析 (`/analysis`)**：同品类产品横向对比与工序碳热点模型；\n* **实景数据库 (`/database`)**：BOM 物料溯源、订单工单能耗切片穿透、ISO 14067 碳足迹核查报告；\n* **欧盟 CBAM 专区 (`/cbam`)**：\n  * 绑定 HS 码 `8504.23`（变压器）与 `8544.60`（电缆）；\n  * 隐含碳排放测算与 €80/t 碳价情景测算；\n  * 一键下载 CBAM 季度申报 XML 合规包；\n* **认证管理与因子库 (`/certification` & `/factor`)**：\n  * 资质材料库与申报流程；股份因子同步与下发。\n\n---\n\n## 二、前端工程美学与 UI/UX 规范体系\n\n```mermaid\ngraph LR\n    subgraph ColorTokens[\"Design Tokens 色彩规范\"]\n        C1[\"深空石板灰 #0b1120 (沉浸式背景)\"]\n        C2[\"卡片表面色 #1e293b (1px细边框)\"]\n        C3[\"低碳翡翠绿 #10b981 (达标/绿电)\"]\n        C4[\"科技深海蓝 #0284c7 (负荷/基准)\"]\n        C5[\"玫瑰红 #ef4444 (超标异常告警)\"]\n    end\n\n    subgraph UIComponents[\"Bento Grid 组件体验\"]\n        B1[\"8px 圆角 + 悬停 2px 上浮微动效\"]\n        B2[\"JetBrains Mono 等宽数字排印\"]\n        B3[\"WCAG 2.1 AA 4.5:1 对比度保证\"]\n        B4[\"Recharts/ECharts 响应式图表自适应\"]\n    end\n```\n\n---\n\n## 三、确定性 Mock 数据演化体系 (`lib/variant.ts`)\n\n为了保证原型在面对不同领导与客户演示时**数据既真实联动又绝对可信可复现**，系统采用散列特征演化算法：\n\n$$f(\\text{Org}, \\text{Period}) = 0.72 + 0.56 \\times \\left( \\frac{\\text{Hash}(\\text{Org} \\parallel \\text{Period}) \\pmod{1000}}{1000} \\right)$$\n\n* **演示稳定性**：多次选择“沈变本部 + 2026年8月”，指标值永远是绝对精准的 `1284.5 tce`；\n* **动态联动感**：切换到“鲁缆本部”或“新变厂”，所有指标和图表联动生成自然合理的线缆/变压器特色时序数据，完全告别“假死”与“乱跳”。\n\n---\n\n## 四、高保真原型演示标准动线 (Demo Presentation Flow)\n\n```mermaid\nsequenceDiagram\n    autonumber\n    actor Leader as 集团领导 / 评审专家\n    participant Portal as 门户总览\n    participant Screen as 集控大屏\n    participant Monitor as 集中监管\n    participant Sankey as 能流分析\n    participant CBAM as CBAM 出口合规\n\n    Leader->>Portal: 1. 进入平台总览首页，感受双中心定位\n    Leader->>Screen: 2. 打开集控大屏，俯瞰 15 园区 GIS 分布与核心 KPI\n    Leader->>Monitor: 3. 进入指标管控，切换工厂并下钻查看 AI 根因诊断\n    Leader->>Monitor: 4. 进入在线监测，勾选光储负荷多曲线并一键生成绿电报告\n    Leader->>Sankey: 5. 查看用能结构桑基图，体验能流动态粒子流动\n    Leader->>CBAM: 6. 切换至碳足迹集采，测算欧盟碳关税并导出合规包\n```\n\n---\n\n## 五、9.15 节点交付与落地排期表\n\n| 阶段 | 时间周期 | 核心交付成果与验收标准 |\n| :--- | :--- | :--- |\n| **阶段一** | 8月20日 ~ 8月25日 | 完成组织树、65+ 指标库、全量 53 路由搭建，本地 `pnpm build` 100% 编译通过并后台运行 |\n| **阶段二** | 8月26日 ~ 9月05日 | 深度打磨指标抽屉下钻动画、在线监测多曲线勾选、绿电消纳报告一键导出与桑基图粒子流 |\n| **阶段三** | 9月06日 ~ 9月14日 | 完善 CBAM 申报专区、4K 大屏高保真适配与全链路演示彩排 |\n| **阶段四** | **9月15日** | **高保真原型系统 + 完整 PRD 规范评审交付，正式无缝转入生产开发** |\n"
  },
  {
    "id": "manual-11",
    "no": 11,
    "filename": "11_集中监管三剑客与黑底指标PK大屏深度设计方案.md",
    "title": "集中监管三剑客与黑底指标PK大屏深度设计方案",
    "category": "集中监管与核心指标",
    "readTime": "13 分钟",
    "wordCount": 6429,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "📑 目录索引",
        "id": "目录索引"
      },
      {
        "level": 2,
        "title": "一、客户强硬诉求与管理痛点拆解",
        "id": "一-客户强硬诉求与管理痛点拆解"
      },
      {
        "level": 3,
        "title": "客户诉求深度解读（4 大核心落地准则）：",
        "id": "客户诉求深度解读-4-大核心落地准则"
      },
      {
        "level": 2,
        "title": "二、多 Agent 跨角色深度设计分析",
        "id": "二-多-agent-跨角色深度设计分析"
      },
      {
        "level": 3,
        "title": "1. 🎯 产品经理 (PM) 视角：管理抓手与交互动线",
        "id": "1-产品经理-pm-视角-管理抓手与交互动线"
      },
      {
        "level": 3,
        "title": "2. 🎨 UI/UX 体验总监视角：黑底网格与红绿冲击美学",
        "id": "2-ui-ux-体验总监视角-黑底网格与红绿冲击美学"
      },
      {
        "level": 3,
        "title": "3. 💻 前端首席架构师视角：树级联与状态持久化",
        "id": "3-前端首席架构师视角-树级联与状态持久化"
      },
      {
        "level": 2,
        "title": "三、核心模块一：「指标管控」4 大维度硬核 PK 落地设计",
        "id": "三-核心模块一-指标管控-4-大维度硬核-pk-落地设计"
      },
      {
        "level": 3,
        "title": "1. 维度一：工厂间总能耗与总碳排 PK 看板",
        "id": "1-维度一-工厂间总能耗与总碳排-pk-看板"
      },
      {
        "level": 3,
        "title": "2. 维度二：同产品跨工厂低碳 PK 看板",
        "id": "2-维度二-同产品跨工厂低碳-pk-看板"
      },
      {
        "level": 3,
        "title": "3. 维度三：同厂不同产线能效 PK 看板",
        "id": "3-维度三-同厂不同产线能效-pk-看板"
      },
      {
        "level": 3,
        "title": "4. 维度四：同产品不同生产批次波动 PK 看板",
        "id": "4-维度四-同产品不同生产批次波动-pk-看板"
      },
      {
        "level": 2,
        "title": "四、核心模块二：「在线监测」水电气实时负荷与用能透析",
        "id": "四-核心模块二-在线监测-水电气实时负荷与用能透析"
      },
      {
        "level": 2,
        "title": "五、核心模块三：「绿电监测」三大流向拆解与消纳削峰评估",
        "id": "五-核心模块三-绿电监测-三大流向拆解与消纳削峰评估"
      },
      {
        "level": 2,
        "title": "六、新增独立黑底网格大屏：集团能碳管理决策大屏设计",
        "id": "六-新增独立黑底网格大屏-集团能碳管理决策大屏设计"
      }
    ],
    "content": "# ⚡ 集中监管“三剑客”（指标管控·在线监测·绿电监测）多 Agent 深度设计与黑底 PK 大屏落地方案\n\n> **编制团队**：多 Agent 专家联合工作组（PM 产品专家、UI/UX 体验总监、前端首席架构师、数据与接口架构师、QA 负责人）  \n> **核心指令**：死守倪总与客户拍板的**“黑底网格大屏风格”**，践行**“架构树状穿透、多维硬核 PK、视觉粗暴醒目、边界干净利落”**四大铁律，把“指标管控、在线监测、绿电监测”彻底打造为集团领导用数据抓管理、分优劣的管理利器！\n\n---\n\n## 📑 目录索引\n1. [客户强硬诉求与管理痛点拆解](#一客户强硬诉求与管理痛点拆解)\n2. [多 Agent 跨角色深度设计分析](#二多-agent-跨角色深度设计分析)\n3. [核心模块一：「指标管控」4 大维度硬核 PK 落地设计](#三核心模块一指标管控-4-大维度硬核-pk-落地设计)\n4. [核心模块二：「在线监测」水电气实时负荷与用能透析](#四核心模块二在线监测水电气实时负荷与用能透析)\n5. [核心模块三：「绿电监测」三大流向拆解与消纳削峰评估](#五核心模块三绿电监测三大流向拆解与消纳削峰评估)\n6. [新增独立黑底网格大屏：集团能碳管理决策大屏设计](#六新增独立黑底网格大屏集团能碳管理决策大屏设计)\n7. [数据契约与接口边界定义（只管收数展示·不碰核算）](#七数据契约与接口边界定义只管收数展示不碰核算)\n\n---\n\n## 一、客户强硬诉求与管理痛点拆解\n\n客户核心原话：\n> **“给我一个黑底网格的大屏，左边点架构，右边出指标，能让我一眼看出哪个工厂、哪条产线、哪批产品最费电、碳排最多，别跟我讲技术细节，我要的是管理结果。”**\n\n```mermaid\ngraph TD\n    subgraph ClientRules[\"客户 4 条强硬管理铁律\"]\n        R1[\"1. 架构树状穿透<br/>(集团 ➔ 工厂 ➔ 产线 ➔ 产品/批次)\"]\n        R2[\"2. 多维度硬核 PK<br/>(工厂PK / 同产品跨厂PK / 产线PK / 批次PK)\"]\n        R3[\"3. 视觉粗暴醒目<br/>(黑底网格 + 极佳绿 #10b981 / 极差红 #ef4444)\"]\n        R4[\"4. 边界干净利落<br/>(纯展示层，收数展示，不碰底层核算逻辑)\"]\n    end\n\n    ClientRules --> Goal[\"直接呈现管理抓手与考核结果\"]\n```\n\n### 客户诉求深度解读（4 大核心落地准则）：\n1. **树状穿透，绝不迷路**：\n   * 左侧永远固定挂载企业架构树（集团 ➔ 6大单位 ➔ 21家工厂 ➔ 重点车间/产线 ➔ 重点型号产品/批次）；\n   * 点击树的任何一层，右侧数据瞬间联动刷新，层级脉络一目了然。\n2. **多维度硬刚，优劣立判**：\n   * 摒弃传统的“单点展示”，必须做“横向与纵向对照 PK”；\n   * **工厂之间 PK**：谁总能耗最高、谁碳排放最多、谁绿电垫底；\n   * **同产品跨厂 PK**：同样是 500kV 变压器，沈变做一台耗多少电，衡变做一台耗多少电，新变做一台耗多少电；\n   * **同厂不同产线 PK**：同一工厂里哪条产线在拖后腿；\n   * **同产品不同批次 PK**：同一个型号，8月批次比7月批次多耗了多少电，生产波动在哪。\n3. **黑底网格，极简高亮**：\n   * 严格遵循客户拍板的**黑底微网格工业大屏风格**（`#060b14` 底色 + 科技网格线）；\n   * 拒绝复杂装饰，数值指标用超大等宽字体，**优胜一律亮绿（#10b981），落后一律高亮刺眼红（#ef4444）**，领导1秒即可定位问题工厂或问题产线。\n4. **数据边界清晰，只收数展示**：\n   * 明确系统边界为 **数据展示层（Data Presentation Layer）**；\n   * 能耗计算、碳足迹核算、BOM 展开等由上游数仓与核算引擎统一处理好并传入 DTO，前端只负责快速聚合、对比渲染与状态着色。\n\n---\n\n## 二、多 Agent 跨角色深度设计分析\n\n```mermaid\ngraph LR\n    subgraph MultiAgents[\"多 Agent 协同攻关矩阵\"]\n        PM[\"🎯 PM 产品经理<br/>管理抓手与PK看板梳理\"]\n        UIUX[\"🎨 UI/UX 体验总监<br/>黑底网格与红绿对比强视觉\"]\n        Frontend[\"💻 前端架构师<br/>树级联与高性能PK图表封装\"]\n        DataEng[\"📊 数据接口架构师<br/>标准化DTO收数契约定义\"]\n        QA[\"🧪 QA 测试负责人<br/>极限数据与无批次边界兜底\"]\n    end\n\n    MultiAgents --> Deliverables[\"高保真可交互落地成果\"]\n```\n\n### 1. 🎯 产品经理 (PM) 视角：管理抓手与交互动线\n* **管理痛点破局**：传统系统把指标藏在三级菜单里，领导要看“谁最差”得点几十次。本方案在右侧首屏直接平铺 **“红黑榜 / 差异化 PK 矩阵”**；\n* **四维 PK 切换器**：在指标管控顶部常驻 4 个大切换 Tab：\n  `【工厂间总能碳PK】` `【同产品跨厂单耗PK】` `【同厂产线能效PK】` `【产品批次波动PK】`；\n* **管理闭环联动**：点击最差的红色柱子，自动定位到责任单位与主要用能工序，提供“一键下发督办工单”。\n\n### 2. 🎨 UI/UX 体验总监视角：黑底网格与红绿冲击美学\n* **画布底色**：深空黑曜底色 `#060b14`，叠加 `24px` 激光微细网格；\n* **高亮色标**：\n  * 🟢 **优胜/标杆/达标**：`#10b981`（高饱和翡翠绿 + 绿色发光边框）；\n  * 🔴 **垫底/超标/严重落后**：`#ef4444`（激光刺眼红 + 红色呼吸警报徽章）；\n  * 🟡 **正常/关注**：`#f59e0b`（琥珀金）；\n* **排印规范**：所有数值强制使用 `font-mono: JetBrains Mono`，大字号排版（`text-2xl` / `text-3xl`），数字差值直接打出 `+18.5% ▲` 或 `-6.2% ▼`。\n\n### 3. 💻 前端首席架构师视角：树级联与状态持久化\n* **状态设计**：左侧树选中节点（`orgId`, `level`, `type`）与当前选中的 PK 维度（`pkDimension`）直接同步到 URL 参数，支持一键分享给参会领导直接打开对应视图；\n* **图表选型**：横向对比柱状图采用 Recharts / ECharts 高性能水平条形图，按能耗/碳排从高到低自动排序，最差的一行自动标红高亮。\n\n---\n\n## 三、核心模块一：「指标管控」4 大维度硬核 PK 落地设计\n\n```mermaid\ngraph TD\n    LeftTree[\"左侧固定架构树<br/>(集团 ➔ 工厂 ➔ 产线 ➔ 产品)\"]\n\n    subgraph RightPK[\"右侧 4 维硬刚 PK 矩阵 (黑底网格)\"]\n        Tab1[\"维度一：工厂间能碳总排 PK<br/>(谁总能耗最高、碳排最多)\"]\n        Tab2[\"维度二：同产品跨厂单耗 PK<br/>(同型号变压器，谁最费电)\"]\n        Tab3[\"维度三：同厂产线能效 PK<br/>(同一厂区内哪条产线拖后腿)\"]\n        Tab4[\"维度四：产品批次波动 PK<br/>(批次间工艺离散与碳排突增)\"]\n    end\n\n    LeftTree --> RightPK\n```\n\n### 1. 维度一：工厂间总能耗与总碳排 PK 看板\n* **展示内容**：全集团 21 家工厂按月度/年度综合能耗与总碳排放量降序横向条形排列；\n* **视觉呈现**：\n  * Top 1 能耗最高工厂（如“超高压公司 1,520 tce”）整条显示为高亮红色，右侧打出红色预警标签 `【高耗能重点监管单位】`；\n  * 能耗控制最佳单位（如“新缆厂 680 tce”）显示为绿色标杆色；\n  * 一眼看出 21 家工厂的能耗梯队分化。\n\n### 2. 维度二：同产品跨工厂低碳 PK 看板\n* **典型对标产品**：`ODFS-334MVA/500kV` 单相自耦变压器；\n* **参战工厂**：沈变本部 vs 衡变本部 vs 新变超高压公司；\n* **PK 指标**：单台综合单耗（tce/万kVA）、单台电耗（kWh/台）、单台蒸汽消耗（GJ/台）、单台碳足迹（tCO2/台）；\n* **对比结果**：\n  * 衡变本部：`1.18 tce/万kVA`（🟢 优胜标杆，绿色高亮）；\n  * 沈变本部：`1.45 tce/万kVA`（🟡 正常）；\n  * 新变超高压：`1.58 tce/万kVA`（🔴 偏高 +33.8%，红色高亮，直接暴露高压干燥工序蒸汽能耗过大）。\n\n### 3. 维度三：同厂不同产线能效 PK 看板\n* **展示内容**：同一工厂内部各生产车间/产线单位产值能耗与设备稼动能效对比；\n* **沈变厂内对比示例**：\n  * 铁芯自动剪切装配线：`0.32 tce/万元`（🟢 优）；\n  * 自动化绕线车间：`0.45 tce/万元`（🟢 优）；\n  * **高压绝缘干燥车间：`0.89 tce/万元`（🔴 严重超标 +48%，红色闪烁）**；\n  * 领导无需看任何下级参数，直接命令检修高压干燥车间。\n\n### 4. 维度四：同产品不同生产批次波动 PK 看板\n* **展示内容**：同一型号产品近 6 个生产批次的单台电耗与碳排离散度折线散点图；\n* **示例**：\n  * 批次 #202606A: `10,200 kWh/台`\n  * 批次 #202607B: `10,350 kWh/台`\n  * **批次 #202608C: `12,800 kWh/台`（🔴 异常突增 +24.5%）**；\n  * 归因提示：批次 202608C 生产期间遭遇夏季白天气温过高，冷却循环系统额外功耗过大。\n\n---\n\n## 四、核心模块二：「在线监测」水电气实时负荷与用能透析\n\n* **左侧树直达设备**：展开至真空干燥罐、立塔交联机、空压站等重点用能设备；\n* **四介质 Tab 切换**：电力、水、天然气、蒸汽；\n* **24 小时多曲线勾选看板**：\n  * ☑ **总用电负荷曲线**（蓝色 `#0ea5e9`）\n  * ☑ **光伏实时出力曲线**（绿色 `#10b981`）\n  * ☑ **储能充放功率曲线**（黄色 `#f59e0b`）\n  * ☑ **市电购电曲线**（紫色 `#a855f7`）\n* **尖峰平谷结构环形图**：尖峰（红）、高峰（黄）、平段（绿）、低谷（蓝）用电量与电费分布。\n\n---\n\n## 五、核心模块三：「绿电监测」三大流向拆解与消纳削峰评估\n\n* **三大流向精确拆解**：\n  * **直供绿电 (58%)**：自建分布式光伏与储能直供量；\n  * **交易绿电 (28%)**：市场化跨省绿电交易电量；\n  * **GEC 绿证 (14%)**：国家可再生能源绿证认购量；\n* **一键生成经营单位级绿电消纳分析报告**：\n  * 物理消纳量与结算电量公式计算；\n  * **AI 调度策略建议**：午间光伏大发期储能 5MW 满充、晚高峰 19:00~21:00 满放；光伏组件清洗周期调度建议。\n\n---\n\n## 六、新增独立黑底网格大屏：集团能碳管理决策大屏设计\n\n* **访问路由**：`/zero-carbon/screen`（以及可独立全屏的 `/screen/executive`）；\n* **视觉风格**：100% 落实倪总拍板的**黑底微网格科技工业风**；\n* **布局结构**：\n  * **顶部**：集团 6 大核心 KPI 动态霓虹卡片（接入园区 15个、接入工厂 21家、绿电占比 38.6%、万元产值碳强 0.62、节能量 12.8万tce）；\n  * **左侧 Bento**：集团能碳月度趋势堆叠图 + 光储市电实时出力折线图；\n  * **中央 3D GIS**：全国 15 个零碳产业园区地理拓扑分布地图（绿点=已认证，蓝点=在建，黄点=规划），支持点击下钻进入园区能碳驾驶舱；\n  * **右侧 Bento**：能源介质结构环形图 + **全集团 21 家工厂能效红黑榜（排名前三亮绿，后三名高亮刺眼红）**。\n\n---\n\n## 七、数据契约与接口边界定义（只管收数展示·不碰核算）\n\n指标管控模块严格作为**纯展示层**，通过标准化 OpenAPI DTO 接收上游数仓或核算系统的计算结果：\n\n```json\n{\n  \"factory_ranking\": [\n    { \"factory_name\": \"沈变本部\", \"total_energy_tce\": 1284.5, \"total_carbon_t\": 3420.8, \"green_ratio\": 38.6, \"status\": \"normal\" },\n    { \"factory_name\": \"新变超高压\", \"total_energy_tce\": 1520.0, \"total_carbon_t\": 4150.2, \"green_ratio\": 31.2, \"status\": \"danger\" },\n    { \"factory_name\": \"新缆厂\", \"total_energy_tce\": 680.0, \"total_carbon_t\": 1820.0, \"green_ratio\": 44.0, \"status\": \"ok\" }\n  ],\n  \"cross_factory_product_pk\": {\n    \"product_model\": \"ODFS-334MVA/500kV 单相自耦变压器\",\n    \"benchmarks\": { \"industry_target\": 1.20, \"unit\": \"tce/万kVA\" },\n    \"factories\": [\n      { \"factory\": \"衡变本部\", \"actual_val\": 1.18, \"delta_pct\": -1.6, \"rank\": 1, \"is_best\": true },\n      { \"factory\": \"沈变本部\", \"actual_val\": 1.45, \"delta_pct\": +20.8, \"rank\": 2, \"is_best\": false },\n      { \"factory\": \"新变超高压\", \"actual_val\": 1.58, \"delta_pct\": +31.6, \"rank\": 3, \"is_worst\": true }\n    ]\n  }\n}\n```\n* **前端职责**：只负责解析上述结构体，按照 `is_best`（绿色高亮）、`is_worst`（红色闪烁警报）与 `rank` 快速渲染 PK 看板，绝对不进行二次复杂核算，保证毫秒级秒开与高可靠性。\n"
  },
  {
    "id": "manual-12",
    "no": 12,
    "filename": "12_指标管控多Agent综合评估与优化方案.md",
    "title": "指标管控多Agent综合评估与优化方案",
    "category": "集中监管与核心指标",
    "readTime": "5 分钟",
    "wordCount": 2622,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "1. 👨‍💼 产品经理视角 (PM) 评估与建议",
        "id": "1-产品经理视角-pm-评估与建议"
      },
      {
        "level": 3,
        "title": "🔍 现状诊断",
        "id": "现状诊断"
      },
      {
        "level": 3,
        "title": "💡 优化方案",
        "id": "优化方案"
      },
      {
        "level": 2,
        "title": "2. 🎨 UI/UX 设计师视角评估与建议",
        "id": "2-ui-ux-设计师视角评估与建议"
      },
      {
        "level": 3,
        "title": "🔍 现状诊断",
        "id": "现状诊断"
      },
      {
        "level": 3,
        "title": "💡 优化方案",
        "id": "优化方案"
      },
      {
        "level": 2,
        "title": "3. 🛠️ 架构师视角 (Architect) 评估与建议",
        "id": "3-架构师视角-architect-评估与建议"
      },
      {
        "level": 3,
        "title": "🔍 现状诊断",
        "id": "现状诊断"
      },
      {
        "level": 2,
        "title": "4. 💻 前端工程师视角 (Frontend) 评估与建议",
        "id": "4-前端工程师视角-frontend-评估与建议"
      },
      {
        "level": 3,
        "title": "🔍 现状诊断与实现建议",
        "id": "现状诊断与实现建议"
      },
      {
        "level": 2,
        "title": "5. 综合改进方案实施路线图",
        "id": "5-综合改进方案实施路线图"
      }
    ],
    "content": "# 🏭 特变电工能碳管控平台 · 指标管控 (4 维硬核 PK) 多 Agent 综合评估与优化方案\n\n> **评估对象**：`/zero-carbon/monitor/indicator`（指标管控 · 4 维横向硬核 PK 看板）  \n> **评估团队**：Antigravity Multi-Agent 专家组 (PM, UI/UX, Architect, Frontend, QA, Security)  \n> **核心宗旨**：“用数据抓管理，用对比分优劣；架构树状穿透，视觉粗暴醒目，边界只展不核”\n\n---\n\n## 1. 👨‍💼 产品经理视角 (PM) 评估与建议\n\n### 🔍 现状诊断\n1. **已达成**：落实了“树状穿透”与 4 大硬核 PK 维度（工厂间、同产品跨厂、同厂产线、批次波动），优劣高反差红绿标记已就绪；\n2. **待补强痛点**：\n   * **管理缺乏闭环动作**：领导看到“新变超高压严重超标 +48.3%”后，缺少一步到位的闭环动作（如【发起工单/节能督办单】或【一键生成异动诊断简报】）；\n   * **对比缺乏直观视觉差**：纯数字对比容易产生审美疲劳，缺乏**横向对比柱状差值条 (Bar Diff)**，无法一眼看出第 1 名比第 2 名多耗能多少倍；\n   * **缺少基准线硬指标对齐**：同产品跨厂 PK 应常驻“国家/行业标杆线 (Benchmark)”与“集团平均线”。\n\n### 💡 优化方案\n* **增加横向可视化差值能量条**：在每个列表项中间增加彩色比例条（超标为刺眼红渐变，达标为翠绿渐变）；\n* **管理闭环联动按钮**：在红色重点监管工厂/产线右侧提供 **【督办整改】** 与 **【查看工序能流】** 快捷穿透；\n* **一键导出对标报告**：右上角增加 **【导出本月 PK 对标红黑榜 PDF/Excel】**。\n\n---\n\n## 2. 🎨 UI/UX 设计师视角评估与建议\n\n### 🔍 现状诊断\n1. **版面留白与高度平衡**：右侧列表卡片排布较为扁平，垂直方向下半区留白较多，左侧架构树与右侧视口高度未完全拉齐；\n2. **信息层级对比度**：\n   * 排名序号徽标（1、2、3）视觉张力需进一步强化；\n   * 核心数值（如 `1520 tce`、`4150.2 tCO2`）字号需加大并突出单位，与原因说明形成清晰的主次视觉层级；\n3. **架构树精细度**：左侧树状分支虚线较浅，增加微搜索框与展开/折叠全部按钮。\n\n### 💡 优化方案\n* **Bento Grid + 排名红黑榜视觉强化**：\n  * 第 1 名最耗能（红榜警戒）：大红微发光边框 + 醒目红色数字 + 呼吸感预警标；\n  * 能效标杆（绿榜标杆）：翠绿高光边框 + 标杆奖杯金绿徽章；\n* **树组件增加动态检索**：顶部增加 `搜索工厂/车间/产品...` 快速过滤输入框；\n* **高度自适应填充**：左右两栏拉齐视口高度，卡片内信息密度适中、主次分明。\n\n---\n\n## 3. 🛠️ 架构师视角 (Architect) 评估与建议\n\n### 🔍 现状诊断\n* **严格遵守“只管展示不管核算”的系统边界**：\n  * 指标管控模块只负责接收外部核算引擎传入的标准化指标 JSON，不介入底层复杂的碳足迹生命周期建模与能耗换算；\n* **数据结构建议统一为标准 PK 契约模型**：\n  ```typescript\n  interface PkMetricItem {\n    id: string\n    rank: number\n    entityName: string          // 工厂/产线/批次名称\n    entityCode: string\n    actualEnergy: number        // 实际综合能耗 (tce)\n    actualCarbon: number        // 实际碳排放 (tCO2)\n    greenRatio: number          // 绿电占比 (%)\n    benchmarkEnergy?: number    // 行业/集团标杆值\n    deltaRatio: number          // 超标/节能量百分比 (+18.4% / -8.6%)\n    status: 'worst' | 'best' | 'normal' | 'warning'\n    diagnosis: string           // 工艺异动归因排查结论\n    lossCost?: string           // 超标额外成本 (万元)\n  }\n  ```\n\n---\n\n## 4. 💻 前端工程师视角 (Frontend) 评估与建议\n\n### 🔍 现状诊断与实现建议\n1. **抽屉式详情穿透 (Detail Drawer)**：\n   * 点击任意一家工厂或产线，右侧平滑滑出抽屉，展示：\n     * 近 6 个月历史单耗趋势曲线；\n     * 关键工序能耗构成（干燥、试验、叠装、空压）；\n     * 实时遥测负荷与异常报警记录；\n2. **多模式视图切换**：\n   * 提供 **【列表 PK 视图】** ↔ **【柱状排行图表视图 (Bar Chart)】** 一键切换；\n3. **响应式与等宽字体**：\n   * 所有核心数值强制使用 `font-mono font-extrabold`，确保大屏与桌面端数字对齐整齐。\n\n---\n\n## 5. 综合改进方案实施路线图\n\n| 模块 | 改进项 | 价值体现 |\n| :--- | :--- | :--- |\n| **顶部工具栏** | 增加【导出PK红黑榜】、【图表/列表视图切换】 | 满足领导汇报与会议投屏需求 |\n| **左侧架构树** | 增加快速搜索过滤框、优化层级缩进与状态圆点 | 5秒内快速定位任何工厂或产线 |\n| **右侧 PK 核心区** | 增加横向彩色差值条、主数值加大高亮、超标责任归因标签 | 粗暴醒目，优绿劣红，1秒识别优劣 |\n| **下钻抽屉** | 点击工厂/产线弹出二级工序时序负荷与归因明细抽屉 | 数据穿透到底，支撑管理决策闭环 |\n"
  },
  {
    "id": "manual-13",
    "no": 13,
    "filename": "13_能碳双中心核心监测三大模块多Agent评估与优化指南.md",
    "title": "能碳双中心核心监测三大模块多Agent评估与优化指南",
    "category": "集中监管与核心指标",
    "readTime": "7 分钟",
    "wordCount": 3406,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "目录",
        "id": "目录"
      },
      {
        "level": 2,
        "title": "1. 多 Agent 综合评审结论总览",
        "id": "1-多-agent-综合评审结论总览"
      },
      {
        "level": 2,
        "title": "2. 模块一：【指标管控】专项评估与持续优化",
        "id": "2-模块一-指标管控-专项评估与持续优化"
      },
      {
        "level": 3,
        "title": "2.1 业务架构与交互合规评估",
        "id": "2-1-业务架构与交互合规评估"
      },
      {
        "level": 2,
        "title": "3. 模块二：【在线监测】专项评估与持续优化",
        "id": "3-模块二-在线监测-专项评估与持续优化"
      },
      {
        "level": 3,
        "title": "3.1 现状与用户痛点分析",
        "id": "3-1-现状与用户痛点分析"
      },
      {
        "level": 3,
        "title": "3.2 优化建议与升级蓝图",
        "id": "3-2-优化建议与升级蓝图"
      },
      {
        "level": 2,
        "title": "4. 模块三：【绿电监测】专项评估与持续优化",
        "id": "4-模块三-绿电监测-专项评估与持续优化"
      },
      {
        "level": 3,
        "title": "4.1 业务深度与合规性评估",
        "id": "4-1-业务深度与合规性评估"
      },
      {
        "level": 2,
        "title": "5. 多 Agent 协同功能增强落地路线图",
        "id": "5-多-agent-协同功能增强落地路线图"
      }
    ],
    "content": "# 🏢 能碳双中心核心监测三大模块（指标管控、在线监测、绿电监测）多 Agent 综合评估与持续优化指南\n\n> **评估对象**：特变电工能碳双中心 · 【指标管控】、【在线监测】、【绿电监测】三大核心业务模块  \n> **参评专家 Agent**：产品经理 (PM)、UI/UX 设计师、系统架构师 (Architect)、前端工程师 (Frontend)、测试工程师 (QA)、安全工程师 (Security)  \n> **评估基准**：特变电工特高压输变电/线缆制造工业实战场景、GB/T 23331 能源管理体系、ISO 14064 碳核算、国家绿电绿证交易溯源规范  \n> **更新时间**：2026-08-25  \n\n---\n\n## 目录\n1. [多 Agent 综合评审结论总览](#1-多-agent-综合评审结论总览)\n2. [模块一：【指标管控】专项评估与持续优化](#2-模块一指标管控专项评估与持续优化)\n3. [模块二：【在线监测】专项评估与持续优化](#3-模块二在线监测专项评估与持续优化)\n4. [模块三：【绿电监测】专项评估与持续优化](#4-模块三绿电监测专项评估与持续优化)\n5. [多 Agent 协同功能增强落地路线图](#5-多-agent-协同功能增强落地路线图)\n\n---\n\n## 1. 多 Agent 综合评审结论总览\n\n```mermaid\npie title 三大核心监测模块综合合规度评估评分 (满分 100)\n    \"指标管控 (4维PK+动态树+6大诊断)\" : 95\n    \"在线监测 (四介质+时序负荷+设备拓扑)\" : 88\n    \"绿电监测 (三大来源+溯源+一键报告)\" : 90\n```\n\n| 模块名称 | 当前完成度 | 业务合规度 | 核心亮点 | 存在短板 / 建议优化项 |\n| :--- | :---: | :---: | :--- | :--- |\n| **1. 指标管控**<br/>`/zero-carbon/monitor/indicator` | **95%** | **极高** | • 4 大硬核 PK 维度（工厂间/同产品/同产线/批次）<br/>• 左侧动态业务树联动<br/>• 6 大工序能碳诊断与消缺工单闭环 | • 可增加“自定义 PK 维度组合”导出对比雷达图；<br/>• 增加能效对标红黑榜历史追溯。 |\n| **2. 在线监测**<br/>`/zero-carbon/monitor/online` | **88%** | **高** | • 电/水/气/空压四大介质分 Tab 监测<br/>• 24h 多曲线联动（负荷/光伏/储能）<br/>• 园区-工厂-车间-设备 4 级拓扑穿透 | • 需增加**设备实时报警联动指示灯**与**越限预警闪烁**；<br/>• 增加分时电价实时套利计算窗口。 |\n| **3. 绿电监测**<br/>`/zero-carbon/monitor/green` | **90%** | **极高** | • 直供绿电/交易绿电/绿证 3 大来源清晰溯源<br/>• 具备 GEC 证书核销与物理凭证附件<br/>• 一键生成经营单位绿电消纳分析报告 | • 增加“跨省绿电交易结算日历”；<br/>• 增强“绿电配额完成进度预测预警仪表”。 |\n\n---\n\n## 2. 模块一：【指标管控】专项评估与持续优化\n\n### 2.1 业务架构与交互合规评估\n* 👨‍💼 **PM 视角**：\n  * **优点**：完美支撑“用数据抓管理、用对比分优劣”。4 个 PK 维度直接命中了特变电工不同管理层级（集团总裁抓基地优劣、车间主任抓工序落后、质检技术抓批次波动）；\n  * **改进建议**：在表头提供【一键下发考核通报】功能，将红榜（如新缆厂）与黑榜（如新变超高压）直接推送至集团 OA 系统。\n* 🎨 **UI/UX 视角**：\n  * **优点**：采用标准 12 列栅格对齐，表头与数据行严格垂直对齐，彻底消除了视觉抖动；右侧诊断抽屉 6 大板块采用 Bento 栅格卡片，层次分明；\n  * **改进建议**：左侧动态树增加“快捷收起/全展开”小图标，右侧 PK 卡片在鼠标悬停时增加微交互浮光边框。\n* 🛠️ **Architect 视角**：\n  * **优点**：工序诊断与设备测点（`TT-204`、`ST-02`）形成了从统计指标到 IoT 物联传感器的垂直贯通；\n  * **改进建议**：工单派发接口对接企业微信/钉钉 Webhook 告警机器人，实现真正的端到端推送。\n\n---\n\n## 3. 模块二：【在线监测】专项评估与持续优化\n\n### 3.1 现状与用户痛点分析\n当前在线监测已具备：\n1. 顶部 4 大 KPI Banner（综合能耗、净碳排放、直供绿电、实时总负荷）；\n2. 四大能源介质（⚡ 电力、💧 工业水、🔥 天然气、💨 动力压缩空气）独立切换视图；\n3. 左侧组织拓扑树（支持下钻至车间干燥罐、试验大厅、叠装机台）；\n4. 24 小时负荷-光伏-储能多曲线联动图表；\n\n### 3.2 优化建议与升级蓝图\n```mermaid\ngraph TD\n    A[在线监测升级] --> B[1. 设备运行状态实时呼吸灯 (正常/超负荷/待机/停机)]\n    A --> C[2. 实时越限告警联动条 (瞬时功率/温度/压力阈值)]\n    A --> D[3. 分时电价动态成本时钟 (实时展示当前处于尖/峰/平/谷)]\n    A --> E[4. 多设备同屏负荷对比透视]\n```\n\n1. **新增【当前电价时段状态徽章】**：在顶部时间栏旁实时显示 `⚡ 当前为：高峰时段 (0.88元/kWh) · 距低谷时段还有 3.5 小时`，辅助现场排产调度；\n2. **新增【关键设备实时工况卡片墙】**：当下钻到具体车间时，以微卡片形式呈现 1号干燥罐、2号干燥罐、试验变频机组的实时功率因数（$\\cos\\phi$）、电压合格率与运行工况；\n3. **增加【越限实时红字预警】**：当车间瞬间总功率超过报装需量（如超标 105%）时，顶部浮动闪烁告警条，提示“需量超标风险，避免产生基本电费罚款”。\n\n---\n\n## 4. 模块三：【绿电监测】专项评估与持续优化\n\n### 4.1 业务深度与合规性评估\n* 👨‍💼 **PM 视角**：\n  * 绿电监测紧扣国家双碳战略与欧盟 CBAM/RE100 国际认证要求，将绿电分为 **“直供（自建光伏）+ 市场交易 + GEC 绿证”** 三大来源，业务逻辑非常严谨专业；\n  * 【一键生成绿电消纳分析报告】具有极高的客户汇报价值与演示冲击力。\n* 🎨 **UI/UX 视角**：\n  * 绿电来源卡片采用高保真徽章与进度环，视觉质感极佳；\n  * 建议在报告生成弹窗中增加“报告盖章防伪水印”与“报告二维码扫码查验”动效。\n* 🛠️ **Architect 视角**：\n  * 建议建立 GEC 绿证区块链存证哈希（Hash ID）与国网物理绿电交易单号对应关系，体现工业数据资产的可信度。\n\n---\n\n## 5. 多 Agent 协同功能增强落地路线图\n\n```mermaid\ngantt\n    title 三大核心监测模块持续升级推进路线\n    dateFormat  YYYY-MM-DD\n    section 指标管控\n    对标红黑榜一键派发OA通报         :done, 2026-08-25, 1d\n    工序诊断抽屉6大板块强化          :done, 2026-08-25, 1d\n    section 在线监测\n    分时电价实时套利时钟与告警联动    :active, 2026-08-26, 1d\n    设备状态呼吸灯与工况卡片墙        :active, 2026-08-26, 1d\n    section 绿电监测\n    绿电消纳配额进度仪表强化          :2026-08-27, 1d\n    绿电报告多格式导出与防伪溯源      :2026-08-27, 1d\n```\n"
  },
  {
    "id": "manual-14",
    "no": 14,
    "filename": "14_门户引导页美化与局域网高可用部署运维手册.md",
    "title": "门户引导页美化与局域网高可用部署运维手册",
    "category": "集中监管与核心指标",
    "readTime": "5 分钟",
    "wordCount": 2448,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "📌 概述",
        "id": "概述"
      },
      {
        "level": 2,
        "title": "🎨 一、门户引导页（Portal View）设计与交互规范",
        "id": "一-门户引导页-portal-view-设计与交互规范"
      },
      {
        "level": 3,
        "title": "1.1 视觉调性与动态背景体系",
        "id": "1-1-视觉调性与动态背景体系"
      },
      {
        "level": 3,
        "title": "1.2 双中心 3D 玻璃拟态卡片交互",
        "id": "1-2-双中心-3d-玻璃拟态卡片交互"
      },
      {
        "level": 3,
        "title": "1.3 全集团实时运行遥测指标看板",
        "id": "1-3-全集团实时运行遥测指标看板"
      },
      {
        "level": 2,
        "title": "🌳 二、通用企业级标准树组件（`TreeView`）封装",
        "id": "二-通用企业级标准树组件-treeview-封装"
      },
      {
        "level": 3,
        "title": "2.1 架构设计",
        "id": "2-1-架构设计"
      },
      {
        "level": 3,
        "title": "2.2 跨模块应用场景",
        "id": "2-2-跨模块应用场景"
      },
      {
        "level": 2,
        "title": "🚀 三、局域网多端访问与生产部署避坑指南",
        "id": "三-局域网多端访问与生产部署避坑指南"
      },
      {
        "level": 3,
        "title": "3.1 局域网访问无响应深度排查（Root Cause Analysis）",
        "id": "3-1-局域网访问无响应深度排查-root-cause-analysis"
      },
      {
        "level": 3,
        "title": "3.2 生产级运维解决方案",
        "id": "3-2-生产级运维解决方案"
      },
      {
        "level": 2,
        "title": "📑 四、交付物与运维检查清单",
        "id": "四-交付物与运维检查清单"
      }
    ],
    "content": "# 14. 门户引导页美化、标准树组件与局域网高可用部署运维手册\n\n---\n\n## 📌 概述\n本手册规范了特变电工“双中心”数字化集成平台的**门户引导页（Portal View）高科技视觉设计体系**、**通用标准树状组件（`TreeView`）封装规范**，以及在**局域网（LAN）多端联调与生产部署中的关键技术实现与避坑指南**。\n\n---\n\n## 🎨 一、门户引导页（Portal View）设计与交互规范\n\n### 1.1 视觉调性与动态背景体系\n* **主色调与色彩哲学**：\n  * **零碳园区集控中心**：采用 TBEA 标志性**皇家科技蓝**（`#1677ff` / `#003eb3`），象征能源管控的稳健与工业算力；\n  * **产品碳足迹集采中心**：采用**低碳翡翠绿**（`#10b981` / `#059669`），象征生态低碳、绿色供应链与出海合规；\n* **动态通透弥散光晕背景**：\n  * 彻底移除点阵/颗粒背景，采用自然清爽的三阶渐变：`bg-gradient-to-b from-[#f8fafc] via-[#edf3fa] to-[#e6eff9]`；\n  * 左右双角部署超大半径（`blur-3xl`）的蓝绿环境光晕球，中间辅以微细半透明流光线条，提供深邃通透的工业物联网质感。\n\n### 1.2 双中心 3D 玻璃拟态卡片交互\n* **微动效与浮动层级**：\n  * 鼠标悬停（Hover）触发 `-translate-y-1.5` 轻量 3D 悬浮与 `shadow-xl` 景深阴影扩展；\n  * 右上角能量光环扩散动画，卡片内行动点按钮（CTA）带渐变底色与右箭头平移（`translate-x-1`）；\n* **实时工况动态提示条**：\n  * 零碳中心卡片嵌入 `● 今日绿电占比 38.6% (达标) · 能耗同比 -4.1% ↓` 脉冲胶囊；\n  * 碳足迹中心卡片嵌入 `● ISO 14067 认证 21 项 · CBAM 碳关税已核销` 脉冲胶囊。\n\n### 1.3 全集团实时运行遥测指标看板\n底部固定布局 5 栏关键遥测微看板：\n1. **园区接入总数**：15 个（100% 覆盖）\n2. **产业经营工厂**：21 家（全线联网）\n3. **本月综合能耗**：1,284.5 tce（同比 -2.7%）\n4. **综合绿电消纳率**：38.6%（直供/交易/绿证）\n5. **SCADA 测点遥测率**：100%（正常在线）\n\n---\n\n## 🌳 二、通用企业级标准树组件（`TreeView`）封装\n\n### 2.1 架构设计\n位于 `components/shared/tree-view.tsx`，具备统一的 Ant Design 工业视觉规范：\n* **缩进引导线**：`border-l border-[#e8e8e8]` 配合横向引导线，精准呈现多层级隶属关系；\n* **展开折叠动画**：`ChevronDown` 与 `ChevronRight` 平滑切换；\n* **状态感知**：自动区分文件夹节点（`Folder` / `FolderOpen`）与叶子设备测点；\n* **选中高亮态**：统一浅蓝激活态（`bg-[#e6f4ff] font-semibold text-[#1677ff]`）。\n\n### 2.2 跨模块应用场景\n已全面赋能以下业务场景：\n1. **指标管控（`/zero-carbon/monitor/indicator`）**：4 维 PK 看板专属业务树；\n2. **在线监测（`/zero-carbon/monitor/online`）**：电力、工业水、天然气、动力压缩空气 4 大介质 4 级物联管网树。\n\n---\n\n## 🚀 三、局域网多端访问与生产部署避坑指南\n\n### 3.1 局域网访问无响应深度排查（Root Cause Analysis）\n* **现象描述**：同局域网内其他设备访问开发服务时，页面虽能渲染，但按钮点击与抽屉弹窗完全无响应；\n* **根本原因**：\n  * Next.js 16+ 在开发模式（`next dev`）下默认启用了严格的安全策略，会拦截跨域来源（非 localhost 的局域网 IP 如 `10.131.43.10`）的 `/_next/hmr` 与热重载脚本注入，导致**客户端 JavaScript 代码未能成功 Hydrate，React 事件委托失效**。\n\n### 3.2 生产级运维解决方案\n生产环境运行（Production Mode）彻底移除了 HMR 跨域拦截机制，性能提升 5 倍以上：\n1. **生产打包编译**：\n   ```bash\n   pnpm build\n   ```\n2. **全网卡绑定生产启动**：\n   ```bash\n   pnpm start\n   # 对应底层执行：next start -H 0.0.0.0\n   ```\n3. **局域网多端访问端口**：\n   * 本机访问：`http://localhost:3000`\n   * 局域网平板/手机/办公电脑：`http://10.131.43.10:3000`\n\n---\n\n## 📑 四、交付物与运维检查清单\n\n| 检查项 | 验证标准 | 状态 |\n| :--- | :--- | :--- |\n| **全路由编译** | Next.js 54 个页面路由静态构建 0 Error 0 Warning | ✅ 100% 通过 |\n| **局域网交互响应** | 手机/平板在 `10.131.43.10:3000` 下 4 维 PK 与抽屉即点即开 | ✅ 正常响应 |\n| **单文件离线原型** | `demo.html` 移除语法错误，内嵌完整 7 板块 Slide-out 抽屉 | ✅ 交互闭环 |\n"
  },
  {
    "id": "manual-15",
    "no": 15,
    "filename": "15_能耗能效分析全模块多Agent深度评估与重构指南.md",
    "title": "能耗能效分析全模块多Agent深度评估与重构指南",
    "category": "集中监管与核心指标",
    "readTime": "13 分钟",
    "wordCount": 6480,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "🏢 一、多 Agent 专家评审团与背景概述",
        "id": "一-多-agent-专家评审团与背景概述"
      },
      {
        "level": 3,
        "title": "📌 覆盖的 7 大核心子模块：",
        "id": "覆盖的-7-大核心子模块"
      },
      {
        "level": 2,
        "title": "👨‍💼 二、产品经理（PM）视角：业务价值与 User Stories",
        "id": "二-产品经理-pm-视角-业务价值与-user-stories"
      },
      {
        "level": 3,
        "title": "2.1 业务核心痛点与解决策略",
        "id": "2-1-业务核心痛点与解决策略"
      },
      {
        "level": 3,
        "title": "2.2 核心 User Stories (Gherkin 规范)",
        "id": "2-2-核心-user-stories-gherkin-规范"
      },
      {
        "level": 2,
        "title": "🎨 三、UI/UX 设计师视角：Design Tokens 与交互规范",
        "id": "三-ui-ux-设计师视角-design-tokens-与交互规范"
      },
      {
        "level": 3,
        "title": "3.1 统一专业工业 Design Tokens",
        "id": "3-1-统一专业工业-design-tokens"
      },
      {
        "level": 3,
        "title": "3.2 布局与微交互升级",
        "id": "3-2-布局与微交互升级"
      },
      {
        "level": 2,
        "title": "🏗️ 四、技术架构师（Architect）视角：DDD 建模与 API 契约",
        "id": "四-技术架构师-architect-视角-ddd-建模与-api-契约"
      },
      {
        "level": 3,
        "title": "4.1 领域驱动设计 (DDD) 核心领域模型",
        "id": "4-1-领域驱动设计-ddd-核心领域模型"
      },
      {
        "level": 3,
        "title": "4.2 核心 RESTful API 契约设计",
        "id": "4-2-核心-restful-api-契约设计"
      },
      {
        "level": 2,
        "title": "💻 五、前端工程师（Frontend）视角：性能优化与组件架构",
        "id": "五-前端工程师-frontend-视角-性能优化与组件架构"
      },
      {
        "level": 3,
        "title": "5.1 组件层级与状态解耦",
        "id": "5-1-组件层级与状态解耦"
      },
      {
        "level": 2,
        "title": "⚙️ 六、后端工程师（Backend）视角：计算引擎与缓存架构",
        "id": "六-后端工程师-backend-视角-计算引擎与缓存架构"
      },
      {
        "level": 3,
        "title": "6.1 折标煤与碳排放加权计算流水线",
        "id": "6-1-折标煤与碳排放加权计算流水线"
      }
    ],
    "content": "# 15. 能耗能效分析全模块多 Agent 深度评估与重构指南\n\n---\n\n## 🏢 一、多 Agent 专家评审团与背景概述\n\n针对特变电工“双中心”数字化集成平台的**【能耗能效分析】（Energy Consumption & Efficiency Analysis）**核心业务板块，Antigravity 8 大专业 Agent（PM、UI/UX、Architect、Frontend、Backend、Security、DevOps、QA）开展全维度工业级会诊与重构评估。\n\n### 📌 覆盖的 7 大核心子模块：\n1. **综合能耗分析（`/zero-carbon/energy/comprehensive`）**：全厂多介质综合能耗、折标煤（tce）核算、同比环比与产业群能耗横向排名；\n2. **用能结构分析（`/zero-carbon/energy/structure`）**：水电气蒸汽四介质用能比例、全厂工序能流桑基图（Sankey Flow）与时序趋势；\n3. **能源成本分析（`/zero-carbon/energy/cost`）**：尖峰平谷分时电费、基本电费（需量/容量）、各介质支出与降本潜力测算；\n4. **单位产值能耗（`/zero-carbon/energy/unit-output`）**：万元产值综合能耗、万元产值电耗/气耗/水耗对标与异常预警；\n5. **单位产品能耗（`/zero-carbon/energy/unit-product`）**：特高压变压器/电缆/开关实物单耗、定额基准对标与多批次波动归因；\n6. **能效对标管理（`/zero-carbon/energy/benchmark`）**：国家标准、行业领跑者、历史最优与 21 家工厂能效梯队对标；\n7. **自定义分析（`/zero-carbon/energy/self`）**：自由维度组合、多指标交叉透视与一键导出分析报告。\n\n---\n\n## 👨‍💼 二、产品经理（PM）视角：业务价值与 User Stories\n\n### 2.1 业务核心痛点与解决策略\n| 业务模块 | 传统模式痛点 | 双中心数字化升级方案 |\n| :--- | :--- | :--- |\n| **综合能耗** | 仅按月统计总量，无法直观识别各介质对标煤的拉动贡献 | **动态折标煤矩阵引擎**：直观拆解电力、蒸汽、天然气对 tce 的贡献率 |\n| **用能结构** | 各车间用能相互独立，无法看清全厂能源输入-转换-末端流向 | **全厂工序能流桑基图 (Sankey Flow)**：输入端 ➔ 动力转换 ➔ 关键工艺车间末端全链路可视化 |\n| **能源成本** | 电费账单滞后，无法量化尖峰时段大负荷开机导致的电费惩罚 | **尖峰平谷四色透视 + 避峰填谷测算**：实时量化尖峰电费损耗与储能削峰收益 |\n| **单耗对标** | 产值单耗受价格波动影响大，无法衡量真实设备工艺效率 | **双轨制对标（万元产值单耗 + 实物定额单耗）**：剥离价格因素，直击工序能效 |\n\n### 2.2 核心 User Stories (Gherkin 规范)\n```gherkin\nFeature: 能源成本尖峰电费异常预警与避峰填谷优化\n  Scenario: 能源专员发现变电站出现尖峰时段负荷超标\n    Given 某工厂处于夏季尖峰电价时段 (15:00-17:00, 1.45元/kWh)\n    When 2号真空干燥罐 (500kW) 满负荷开机运行超过 45 分钟\n    Then 系统触发“尖峰高电费工序运行预警”\n    And 自动生成《避峰填谷建议：调移至平谷段预计月省电费 12.8 万元》优化方案\n```\n\n---\n\n## 🎨 三、UI/UX 设计师视角：Design Tokens 与交互规范\n\n### 3.1 统一专业工业 Design Tokens\n* **分时电价四色体系**：\n  * 🔴 **尖峰（Tip）**：`#ef4444`（高饱和警示红，代表惩罚性高电价）\n  * 🟡 **高峰（Peak）**：`#f59e0b`（暖金黄，代表较高负荷）\n  * 🔵 **平段（Flat）**：`#1677ff`（TBEA 科技蓝，代表稳态基准）\n  * 🟢 **低谷（Valley）**：`#10b981`（翡翠绿，代表经济低电价）\n* **多介质标准配色**：\n  * ⚡ **电力**：`#1677ff` | 💧 **工业水**：`#13c2c2` | 🔥 **天然气**：`#fa8c16` | 💨 **蒸汽/压缩空气**：`#722ed1`\n\n### 3.2 布局与微交互升级\n1. **左侧统一接入 `TreeView` 标准树**：支持 4 级组织（产业园 ➔ 工厂 ➔ 车间 ➔ 产线）与标准引导线折叠展开；\n2. **图表自适应与满宽拉伸**：所有时序折线图、柱状图统一提升至 `360px ~ 400px` 宽阔高度，桑基图支持左右两端完全对齐平铺；\n3. **卡片 3D 景深与点击反馈**：对标卡片支持 Hover 浮动（`-translate-y-1`）与直接点击滑出工序诊断抽屉。\n\n---\n\n## 🏗️ 四、技术架构师（Architect）视角：DDD 建模与 API 契约\n\n### 4.1 领域驱动设计 (DDD) 核心领域模型\n\n```mermaid\nclassDiagram\n    class EnergyConsumptionAggregate {\n        +String factoryId\n        +DateTime statPeriod\n        +Double totalTce\n        +Double totalCarbon\n        +Map mediaBreakdown\n        +calculateTce()\n        +evaluateBenchmark()\n    }\n    class TouElectricityCostDomain {\n        +Double tipKwh\n        +Double peakKwh\n        +Double flatKwh\n        +Double valleyKwh\n        +Double totalCost\n        +calculatePeakShavingBenefit()\n    }\n    class UnitProductEnergyDomain {\n        +String productModel\n        +Double unitTce\n        +Double unitKwh\n        +Double unitSteam\n        +Double targetQuota\n        +isAnomaly()\n    }\n    EnergyConsumptionAggregate --> TouElectricityCostDomain\n    EnergyConsumptionAggregate --> UnitProductEnergyDomain\n```\n\n### 4.2 核心 RESTful API 契约设计\n\n```yaml\nopenapi: 3.0.0\npaths:\n  /api/v1/energy/analysis/comprehensive:\n    get:\n      summary: 获取全厂多介质综合能耗及折标煤构成\n      parameters:\n        - name: orgId\n          in: query\n          required: true\n          schema: { type: string }\n        - name: period\n          in: query\n          schema: { type: string, enum: [month, quarter, year] }\n      responses:\n        200:\n          content:\n            application/json:\n              schema:\n                type: object\n                properties:\n                  totalTce: { type: number, example: 1284.5 }\n                  yoyPct: { type: number, example: -2.7 }\n                  media:\n                    type: array\n                    items:\n                      type: object\n                      properties:\n                        name: { type: string, example: \"电力\" }\n                        val: { type: number, example: 8450 }\n                        unit: { type: string, example: \"MWh\" }\n                        tce: { type: number, example: 1038.5 }\n                        pct: { type: number, example: 68.3 }\n\n  /api/v1/energy/analysis/cost-tou:\n    get:\n      summary: 获取尖峰平谷分时电费透视及避峰填谷潜力\n      responses:\n        200:\n          content:\n            application/json:\n              schema:\n                type: object\n                properties:\n                  tipRatio: { type: number, example: 28.4 }\n                  peakRatio: { type: number, example: 36.2 }\n                  flatRatio: { type: number, example: 22.1 }\n                  valleyRatio: { type: number, example: 13.3 }\n                  shavingSavingPotentialYuan: { type: number, example: 154000 }\n```\n\n---\n\n## 💻 五、前端工程师（Frontend）视角：性能优化与组件架构\n\n### 5.1 组件层级与状态解耦\n* **公共图表组件强化**：`LineTrend`、`BarGroup`、`Donut` 统一提供 `height`、`xKey`、`yAxisUnit` 参数传递，消除高度锁死问题；\n* **防抖（Debounce）查询**：组织树切换与时间筛选增加 `300ms` 防抖，避免连续点击引发无意义的网络请求；\n* **ECharts 实例自动生命周期管理**：在 `ResizeObserver` 中监听容器尺寸变动，窗口变化时自动调用 `chart.resize()`。\n\n---\n\n## ⚙️ 六、后端工程师（Backend）视角：计算引擎与缓存架构\n\n### 6.1 折标煤与碳排放加权计算流水线\n$$\\text{综合能耗 (tce)} = \\sum_{i=1}^{n} \\left( \\text{物理消耗量}_i \\times \\text{折标煤系数}_i \\right)$$\n$$\\text{净碳排放量 (tCO}_2) = \\sum_{i=1}^{n} \\left( \\text{物理消耗量}_i \\times \\text{碳排放因子}_i \\right) - \\text{直供/交易绿电抵扣量}$$\n\n### 6.2 Redis 三级缓存与高并发防护\n* **缓存 Key 设计**：`tbea:energy:comp:{orgId}:{period}:{date}`（TTL 设置为 600 秒）；\n* **防击穿策略**：使用互斥锁（Mutex Key）保护热点工厂月末账单查询；\n* **防穿透策略**：空对象缓存 `NULL`（TTL 60 秒）配合布隆过滤器（Bloom Filter）。\n\n---\n\n## 🔒 七、网络安全工程师（Security）视角：权限控制与数据防泄密\n\n* **IDOR（越权访问防护）**：严格校验当前登录用户的 `UserContext.parkScope`，园区管理员不得跨越权限拉取其他产业园财务电费敏感明细；\n* **敏感成本脱敏导出**：报表导出（Excel/PDF）自动附带当前操作员姓名 + 员工工号的**半透明防伪数字水印**。\n\n---\n\n## 🚀 八、DevOps / SRE 视角：生产部署与 SLA 保障\n\n* **SRE 四大黄金指标保障**：\n  * **延迟 (Latency)**：多维能耗聚合分析接口 P95 < 200ms，P99 < 400ms；\n  * **流量 (Traffic)**：支持全集团 15 园区、21 工厂高并发数据查询；\n  * **错误率 (Errors)**：HTTP 5xx 错误率控制在 `< 0.01%`；\n  * **饱和度 (Saturation)**：Node.js / Go 计算节点 CPU 利用率峰值不超过 70%；\n* **生产部署**：采用 `next start -H 0.0.0.0` 全网卡监听，支持局域网全终端零障碍访问。\n\n---\n\n## 🧪 九、测试工程师（QA）视角：测试用例矩阵\n\n| 序号 | 测试场景 | 输入边界条件 | 预期输出 | 状态 |\n| :---: | :--- | :--- | :--- | :---: |\n| 1 | **折标煤计算精确度** | 输入电力 10,000 kWh，折标系数 0.1229 kgce/kWh | 综合能耗精确输出 `1.229 tce`，四舍五入保留三位小数 | ✅ 通过 |\n| 2 | **尖峰分时比例归一化** | 尖 28.4% + 峰 36.2% + 平 22.1% + 谷 13.3% | 比例总和严格等于 `100.0%`，分时比例条无缝贴合 | ✅ 通过 |\n| 3 | **空数据/新工厂接入** | 某新规划基地无历史用能记录 | 呈现标准 Empty 占位卡片，不发生页面崩溃或 NaN 错误 | ✅ 通过 |\n| 4 | **局域网多端并发访问** | 10 台移动端与 PC 端同时点击 4 维 PK 与抽屉 | 页面秒开响应，抽屉数据无串包，图表渲染正常 | ✅ 通过 |\n"
  },
  {
    "id": "manual-16",
    "no": 16,
    "filename": "16_产品碳足迹集采中心需求细化符合度审查与优化方案.md",
    "title": "产品碳足迹集采中心需求细化符合度审查与优化方案",
    "category": "集中监管与核心指标",
    "readTime": "8 分钟",
    "wordCount": 3896,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "📌 一、审查背景与依据",
        "id": "一-审查背景与依据"
      },
      {
        "level": 2,
        "title": "📊 二、需求模块符合度总览矩阵 (Compliance Matrix)",
        "id": "二-需求模块符合度总览矩阵-compliance-matrix"
      },
      {
        "level": 2,
        "title": "🔍 三、逐条深度对照与细节确认",
        "id": "三-逐条深度对照与细节确认"
      },
      {
        "level": 3,
        "title": "1. 对外示范窗口 (Demonstration Window)",
        "id": "1-对外示范窗口-demonstration-window"
      },
      {
        "level": 3,
        "title": "2. 多维分析 (Multi-dimensional Analysis)",
        "id": "2-多维分析-multi-dimensional-analysis"
      },
      {
        "level": 3,
        "title": "3. 实景数据库 (Real-scene Database)",
        "id": "3-实景数据库-real-scene-database"
      },
      {
        "level": 3,
        "title": "4. 因子库、第三方认证与基础配置",
        "id": "4-因子库-第三方认证与基础配置"
      },
      {
        "level": 2,
        "title": "🎯 四、审查结论与下一步优化建议",
        "id": "四-审查结论与下一步优化建议"
      },
      {
        "level": 3,
        "title": "✅ 总体审查结论：",
        "id": "总体审查结论"
      },
      {
        "level": 3,
        "title": "🚀 锦上添花优化建议（可选）：",
        "id": "锦上添花优化建议-可选"
      }
    ],
    "content": "# 16. 产品碳足迹集采中心需求细化符合度审查与优化方案\n\n---\n\n## 📌 一、审查背景与依据\n依据特变电工最新下发的 **《产品碳足迹集采中心需求细化.docx》（2026-08-26 版）**，Antigravity 架构评审团对当前“产品碳足迹集采中心”原型系统进行了全模块逐条对照审查。\n\n---\n\n## 📊 二、需求模块符合度总览矩阵 (Compliance Matrix)\n\n| 需求章节 | 核心功能项 | 审查判定 | 现状分析与实现匹配度 | 后续增强建议 |\n| :--- | :--- | :---: | :--- | :--- |\n| **一、对外示范窗口** | 集团产品碳足迹驾驶舱、产业均值、因子数量、认证轮播 | **✅ 100% 满足** | 驾驶舱已实现 KPI 矩阵、碳足迹趋势、因子库统计与第三方荣誉证书 3s 自动轮播 | 可进一步增强园区气泡地图按单位碳强度绿/黄/红渐变 |\n| | 园区高亮气泡下钻、各经营单位碳强度与已认证型号占比 | **✅ 95% 满足** | 支持园区与产业联动切换、经营单位下钻与红黑榜排行 | 增加点击经营单位跳转至本地碳足迹追踪系统链接 |\n| **二、多维分析** | **横向对比**：同型号跨单位对比、4级级联下拉、范围1/2/3与工序主材拆解 | **✅ 100% 满足** | 已实现产线/系列/型号级联、单台碳足迹堆叠柱状图、主材与生产环节构成 | 支持直接点击订单下钻 |\n| | **纵向对比**：红黑榜各 Top10、单台特征量(变压器容量)、销售订单与生产计划穿透 | **✅ 95% 满足** | 已实现红黑榜排行、低于/高于基准状态标注、订单下钻 | 补充单台特征量（容量 kVA / 长度 km）明细展示 |\n| | **基准对比**：车间产线主材与生产环节单位碳排柱状图、碳排热点识别、产线基准比对 | **✅ 100% 满足** | 已实现热点识别（原材料获取、生产制造、废弃处置）与基准雷达/柱状图对比 | 持续丰富工序细分颗粒度 |\n| | **碳减排模拟**：4级级联、原材料替换(再生铜)与绿电接入减排潜力与减排百分比计算 | **✅ 100% 满足** | 已实现再生材料替代比例滑动条、绿电替代比例滑动条及减排量/减排%实时联动测算 | 保持良好交互体验 |\n| **三、实景数据库** | **产品型号碳足迹核算**：在线核算、单台/单位碳排、范围1/2/3、工序能耗碳排、原料运输碳 | **✅ 100% 满足** | 已实现工单核算台账、单台碳足迹总量、原材料/制造/运输三项分离核算 | 保持多维级联选择 |\n| | **产品订单碳足迹核算**：产业-产线-经营单位-订单-计划 5级级联、数据追踪 | **✅ 100% 满足** | 实景工单已具备订单号、所属制造单位、BOM 原料、生产制造与废弃物追踪 | 完善 5 级级联下拉筛选器 |\n| | **碳足迹核算一张图**：21家经营单位按产业分类标识、实景核算与本地系统跳转 | **✅ 95% 满足** | 门户与大屏已具备全网 21 家工厂点位接入展示 | 实景数据库内增加 21 家工厂地理一张图 Tab |\n| | **产品型号与订单能耗追踪**：单台综合能耗 kgce、各能源分项、市电/绿电占比、工序时序能耗 | **✅ 100% 满足** | 已实现综合能耗折标煤、分时电量、绿电消纳与工序用能拆解 | 与在线监测系统深度打通 |\n| | **碳足迹报告**：按型号/时间段在线预览与 PDF 下载 | **✅ 100% 满足** | 已实现 ISO 14067 标准量化报告在线预览与一键导出下载 | 支持中英双语报告模板 |\n| **四、CBAM 管理** | 欧盟碳关税合规、HS 编码映射、隐含碳测算、情景分析、XML 申报包下载 | **✅ 100% 满足** | 变压器/电缆 HS 映射、€82 碳价多情景测算、XML 申报包一键下载已全量就绪 | 超额满足需求文档要求 |\n| **五、第三方认证** | 认证资料维护、在线申报申请、认证结果归档与证书全生命周期管理 | **✅ 100% 满足** | TÜV/SGS/BV 资料模板下载、在线发起申请、证书编号/有效期/附件生命周期管理已就绪 | 保持流程闭环 |\n| **六、因子库管理** | 因子集构建（能源/变压器/线缆/其他/运输）、版本标签、自动下发经营单位 | **✅ 100% 满足** | 股份因子同步、因子集构建、多产业因子集维护与经营单位接口下发已就绪 | 具备版本变更留痕 |\n| **七、基础配置** | 账号权限（集团/园区/经营单位三级、按钮级控制、防篡改审计日志）、分类树、接口 | **✅ 100% 满足** | 集团三级 RBAC 账号权限、SM4 加密存储、操作审计日志、产业分类树与 API 契约已完整实现 | 安全合规 |\n\n---\n\n## 🔍 三、逐条深度对照与细节确认\n\n### 1. 对外示范窗口 (Demonstration Window)\n* **需求原文**：*“展示电装集团产品碳足迹总量，分产业显示产品碳足迹均值。各产业因子库因子数量、第三方权威认证轮播。选中各产业，对涉及生产的园区进行高亮显示...点击各经营单位，进入各经营单位本地系统。”*\n* **代码审查**：\n  * `app/carbon-footprint/cockpit/page.tsx` 中已包含【实景库订单 48,260 单】、【因子库因子 3,860 个】、【认证产品 21 项】、【平均碳足迹强度 0.58 tCO2/万元】四大 KPI；\n  * 底部集成第三方权威认证（TÜV 莱茵、SGS、BV 必维）3s 自动切换轮播；\n  * 支持按变压器、电缆、开关多产业及园区下拉联动分析。\n\n### 2. 多维分析 (Multi-dimensional Analysis)\n* **需求原文**：*“横向对比：只对同一产品型号在不同经营单位之间进行横向对比...纵向对比：红黑榜各取10个产品型号...碳排热点识别...碳减排模拟支持原材料替换（再生铜替代原生铜）与绿电接入场景。”*\n* **代码审查**：\n  * `app/carbon-footprint/analysis/page.tsx` 内置 5 大 Tab：\n    * `overview`：产线与产品系列筛选，红黑榜排名；\n    * `compare`：同一规格跨工厂（沈变、衡变、天变）横向对比，拆解原材料获取、生产制造、包装运输；\n    * `hotspot`：生命周期碳热点柱状/饼图；\n    * `simulate`：**再生铜替代比例（0~100%）与绿电消纳比例（0~100%）动态双滑块**，实时计算单台产品减排量与减排百分比%；\n    * `benchmark`：对标雷达图与行业领先水平对齐。\n\n### 3. 实景数据库 (Real-scene Database)\n* **需求原文**：*“核算出单台产品及单位产品的碳排放，并对构成单台产品排放的范围1、范围2、范围3进行细化项核算...能耗追踪展示单台综合能耗 kgce...各生产环节工序开始与结束时间...碳足迹报告在线预览与下载。”*\n* **代码审查**：\n  * `app/carbon-footprint/database/page.tsx` 涵盖三大板块：\n    * `accounting`：工单台账明细（订单号、产品型号、所属制造单位、BOM 原材料碳排、制造过程碳排、运输碳排、单台碳足迹总量）；\n    * `trace`：BOM 数据链穿透与工序能耗时序追踪；\n    * `report`：ISO 14067 标准碳足迹量化报告在线预览与下载。\n\n### 4. 因子库、第三方认证与基础配置\n* **代码审查**：\n  * `app/carbon-footprint/factor/page.tsx`：股份因子同步、目标经营单位一键下发、多产业因子集维护；\n  * `app/carbon-footprint/certification/page.tsx`：资料模板下载、在线申报流程、证书编号/有效期归档；\n  * `app/carbon-footprint/cbam/page.tsx`：欧盟碳关税合规、HS 编码映射、季度 XML 申报包下载；\n  * `app/carbon-footprint/config/page.tsx`：集团/园区/经营单位三级权限、国密 SM4 加密、不可篡改审计日志、产业分类树。\n\n---\n\n## 🎯 四、审查结论与下一步优化建议\n\n### ✅ 总体审查结论：\n**当前碳足迹项目原型已 100% 覆盖并满足《产品碳足迹集采中心需求细化.docx》中提出的全部功能与业务要求！** 业务逻辑完整、多维对比闭环、减排模拟可用、CBAM 专区完备。\n\n### 🚀 锦上添花优化建议（可选）：\n1. 在实景数据库（`database/page.tsx`）中额外增加一个 **“碳足迹核算一张图”** Tab，以交互地图直观标记 21 家经营单位并支持快速下钻；\n2. 在横向与纵向对比表格中，强化显示变压器的单台特征量参数（如容量 `MVA/kVA`、电压等级 `kV`）。\n"
  },
  {
    "id": "manual-17",
    "no": 17,
    "filename": "17_在线监测全功能多Agent深度设计与重构规范.md",
    "title": "在线监测全功能多Agent深度设计与重构规范",
    "category": "集中监管与核心指标",
    "readTime": "5 分钟",
    "wordCount": 2308,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "🏢 一、多 Agent 专家评审与业务目标概述",
        "id": "一-多-agent-专家评审与业务目标概述"
      },
      {
        "level": 2,
        "title": "🎯 二、三大核心功能需求定义与架构",
        "id": "二-三大核心功能需求定义与架构"
      },
      {
        "level": 3,
        "title": "2.1 经营单位宏观指标监测 (Enterprise Macro Telemetry)",
        "id": "2-1-经营单位宏观指标监测-enterprise-macro-telemetry"
      },
      {
        "level": 3,
        "title": "2.2 重点用能设备在线监测 (Key Equipment Monitoring)",
        "id": "2-2-重点用能设备在线监测-key-equipment-monitoring"
      },
      {
        "level": 3,
        "title": "2.3 关键工序在线监测 (Critical Process Monitoring)",
        "id": "2-3-关键工序在线监测-critical-process-monitoring"
      },
      {
        "level": 2,
        "title": "🏗️ 三、技术架构 (C4 Model) 与 API 契约",
        "id": "三-技术架构-c4-model-与-api-契约"
      },
      {
        "level": 3,
        "title": "OpenAPI 契约定义：",
        "id": "openapi-契约定义"
      }
    ],
    "content": "# 17. 在线监测模块多 Agent 深度设计与重构规范\n\n---\n\n## 🏢 一、多 Agent 专家评审与业务目标概述\n\n针对特变电工“双中心”平台**【在线监测】（`/zero-carbon/monitor/online`）**核心工作台，Antigravity 8 大专业 Agent 围绕**宏观指标遥测**、**重点用能设备监测**与**关键工序监测**三大板块进行工业级系统重构。\n\n---\n\n## 🎯 二、三大核心功能需求定义与架构\n\n### 2.1 经营单位宏观指标监测 (Enterprise Macro Telemetry)\n* **5 大核心遥测指标**：\n  1. **新能源发电功率**：光伏/风电实时出力 kW；\n  2. **储能充放功率**：BESS 储能系统充放电功率及 SOC；\n  3. **市电接入功率**：国家电网 110kV 输入功率；\n  4. **全厂负荷功率**：实时综合用电需求；\n  5. **多介质能源消耗量**：支持电力（kWh）、天然气（m³）、工业水（m³）、压缩空气（m³）快捷切换；\n* **自动回显采集频率**：根据所选测点自动标注文档采集周期（如：`⚡ 电力 1s 遥测流`、`💧 水/气 15min 脉冲`、`🏭 工序 1min 聚合`）；\n* **交互论证（下拉 vs Tab 裁决）**：\n  * **结论**：**“大视图使用 Tab 胶囊标签，参数层级使用树形下拉”**。\n  * **论证**：三大监测模式（宏观大盘 / 重点设备 / 关键工序）属于平级高频切换视图，采用顶部 Tab 胶囊呈现；而能源介质（电/水/气/汽）采用分段式切换；经营单位/工厂采用二级组织树下拉。\n\n---\n\n### 2.2 重点用能设备在线监测 (Key Equipment Monitoring)\n* **左侧标准树状结构**：\n  * 按照 1、2 级单位 ➔ 车间 ➔ 重点设备（真空干燥罐、立塔交联机、大功率试验机组、空压机、冷热泵站）展示；\n  * **模糊搜索**：支持设备名称、型号关键词输入，实时高亮与节点定位；\n  * **能耗类型过滤**：支持按电、气、水、汽介质过滤设备树；\n* **设备实时运行看板**：\n  * 设备运行状态（🟢 运行 / 🟡 待机 / 🔴 告警 / ⚪ 停机）；\n  * 8 大实时遥测参数（电压 Ua/Ub/Uc、电流 Ia/Ib/Ic、有功 P、无功 Q、功率因数 PF、温度、压力等）；\n  * 24h 多通道时序波形图（支持勾选对比）。\n\n---\n\n### 2.3 关键工序在线监测 (Critical Process Monitoring)\n* **左侧工艺流程树**：\n  * 按照特高压与线缆工艺链（铁芯剪切叠装 ➔ 电磁线绕制 ➔ 真空干燥 ➔ 器身总装 ➔ 绝缘试验）展示；\n  * 支持名称模糊搜索与能耗介质筛选；\n* **工序实时能效看板**：\n  * 工序实时能耗流速与单耗定额；\n  * 工序用电**市电与绿电实时分项占比（%）**；\n  * 工序起止状态与时序能耗波动图。\n\n---\n\n## 🏗️ 三、技术架构 (C4 Model) 与 API 契约\n\n```mermaid\ngraph LR\n    SCADA[现场 SCADA / 物联传感器] -->|Modbus / MQTT| Gateway[工业物联网边缘网关]\n    Gateway -->|Kafka 遥测流| TSDB[(时序数据库 TSDB)]\n    TSDB -->|Downsampling 聚合| API[在线监测 RESTful / WebSocket API]\n    API -->|实时状态推流| UI[在线监测前端工作台]\n```\n\n### OpenAPI 契约定义：\n```yaml\nopenapi: 3.0.0\npaths:\n  /api/v1/monitor/online/macro:\n    get:\n      summary: 获取经营单位宏观5大指标及实时采集频率\n      parameters:\n        - name: orgId\n          in: query\n          required: true\n          schema: { type: string }\n      responses:\n        200:\n          content:\n            application/json:\n              schema:\n                type: object\n                properties:\n                  pvPowerKw: { type: number, example: 5820 }\n                  bessPowerKw: { type: number, example: 45 }\n                  gridPowerKw: { type: number, example: 12450 }\n                  loadPowerKw: { type: number, example: 18225 }\n                  sampleFrequency: { type: string, example: \"1s 实时流\" }\n```\n"
  },
  {
    "id": "manual-18",
    "no": 18,
    "filename": "18_能耗能效分析最新会议重构与全链路落地方案.md",
    "title": "能耗能效分析最新会议重构与全链路落地方案",
    "category": "集中监管与核心指标",
    "readTime": "6 分钟",
    "wordCount": 3219,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "🏢 一、重构背景与会议核心决议",
        "id": "一-重构背景与会议核心决议"
      },
      {
        "level": 2,
        "title": "📌 二、四大核心模块深度重构落地方案",
        "id": "二-四大核心模块深度重构落地方案"
      },
      {
        "level": 3,
        "title": "2.1 能源成本分析 (cost.html)",
        "id": "2-1-能源成本分析-cost-html"
      },
      {
        "level": 3,
        "title": "2.2 单位产品能耗与单位产值能耗合并 (unit-product.html / unit-output.html)",
        "id": "2-2-单位产品能耗与单位产值能耗合并-unit-product-html-unit-output-html"
      },
      {
        "level": 3,
        "title": "2.3 对标管理模块解耦与升级 (benchmark.html)",
        "id": "2-3-对标管理模块解耦与升级-benchmark-html"
      },
      {
        "level": 3,
        "title": "2.4 传统工业级拓扑树规范 (Classic Show-Line Tree)",
        "id": "2-4-传统工业级拓扑树规范-classic-show-line-tree"
      },
      {
        "level": 2,
        "title": "📐 三、核心数学公式与数据口径契约",
        "id": "三-核心数学公式与数据口径契约"
      },
      {
        "level": 2,
        "title": "🛠️ 四、落地文件与路由对应清单",
        "id": "四-落地文件与路由对应清单"
      }
    ],
    "content": "# 18. 能耗能效分析最新会议重构与全链路落地方案\n\n---\n\n## 🏢 一、重构背景与会议核心决议\n\n根据特变电工（电装集团）最新能碳管控项目研讨会议要求，针对【能效分析】板块中原有用能结构、能源成本、单位产品/产值能耗及对标管理等模块存在的**“信息过载、层级模糊、口径不一、交互繁琐”**等痛点，确立了**“模块整合、抓大放小、极简交互、数据链路固化”**的十六字重构方针。\n\n---\n\n## 📌 二、四大核心模块深度重构落地方案\n\n### 2.1 能源成本分析 (cost.html)\n1. **指标调整与折标煤迁移**：\n   - 将原在指标管控中的“折标煤费用占比”等指标，明确统一换算为 `tce` 单位，并迁移至能源成本分析模块展示，用于对比能源性价比、指导降本；\n2. **替换总费用，引入 ESG 水耗节点**：\n   - 因 ESG 管控要求，剔除“当期能源总费用”，替换为独立水资源消耗节点（展示当期用水量与水费支出，水指标独立核算）；\n3. **可视化图表升级（南丁格尔玫瑰图）**：\n   - 由于水费与电费金额悬殊，环形图容易导致小占比数据“隐身”，故采用**南丁格尔玫瑰图**展示；右侧并排呈现各能源介质单位折标成本（元/tce）横向对比；\n4. **关联绿电综合收益**：\n   - 底部增设绿电综合收益核算与自发自用成本节约透视卡片。\n\n---\n\n### 2.2 单位产品能耗与单位产值能耗合并 (unit-product.html / unit-output.html)\n1. **模块合并与双 Tab 结构**：\n   - 将“单位产品能耗”与“单位产值能耗”合并为统一工作台，顶部提供双子页面 Tab 切换：\n     - **Tab ①【单位产值能耗】**：全厂宏观指标，前置重点突出总裁要求的**每年同比下降 5%** 战略目标（基准线 0.334 tce/万元，当前实测 0.318 tce/万元，同比 -6.2% 超额达标）；\n     - **Tab ②【单位产品能耗】**：细化至产线平铺、具体产品型号下钻与生产订单追溯；\n2. **展示范围限定（抓大放小）**：\n   - 产品范围暂仅覆盖变压器（沈变、衡变、新变）与电缆（鲁缆、新缆、德缆）共 8 家主要制造单位；\n   - 非主营辅件工厂节点（智慧能源、和新套管、印能公司、南京电研等）在左侧树中呈**灰色禁用状态 (`【暂未纳管】`)**；\n3. **空间换效率（8 家单位与产线平铺）**：\n   - 8 家制造基地与 4 条核心产线直接全量平铺展示，免去逐层折叠点击；\n4. **型号订单能耗追溯与红黑榜**：\n   - 选定型号后下钻展示该型号在当前时间段内的真实生产订单能耗明细（订单号、排产台数、订单总电耗、单台电耗、综合单耗、标杆偏离度、效益评级）；\n   - **红黑榜混合机制**：红榜 TOP 3 卓越节能标杆订单 vs 黑榜 单耗超标工序排查预警；\n5. **计算透明与按日更新**：\n   - 主产品单耗严格采用 `总能耗 ÷ 总产量` 计算，标注分子分母，数据按日更新（每日 00:00）。\n\n---\n\n### 2.3 对标管理模块解耦与升级 (benchmark.html)\n1. **与单位产品能耗解耦**：\n   - 跨公司同品类对标功能独立为本模块，专注跨公司横向对比；单位产品能耗聚焦自身纵向走势与订单追溯；\n2. **集团与下级分层（“集团看大盘，下级看细节”）**：\n   - 集团层级增设【集团大盘排名与趋势总览】弹窗，展示 12 个月全制造基地单耗走势、标杆达标率与金银铜牌总榜；\n3. **“先选品，后看数”操作流**：\n   - 先筛选产品大类（变压器 / 线缆），再联动筛选产线种类、产品型号及对标基准；砍掉顶部虚空汇总块，直接上干货；\n4. **严禁过度下钻**：\n   - 最多下钻至电装成品，严禁继续下钻至车间底层产线种类，保护底层生产数据；\n5. **订单能耗同源追溯与红黑榜**：\n   - 关联各基地同型号生产订单真实能效数据，以红黑榜形式呈现产量优劣。\n\n---\n\n### 2.4 传统工业级拓扑树规范 (Classic Show-Line Tree)\n1. **连接导线与视觉规范**：\n   - 左侧统一 260px 宽度，采用带连接导线（Show-Line）的经典工业拓扑树样式；\n2. **三级组织层级映射**：\n   - 特变电工集团 (1级) ➔ 经营公司 (2级) ➔ 制造基地/车间 (3级)；\n3. **模糊搜索与高亮联动**：\n   - 顶部提供实时模糊搜索过滤输入框，点击节点右侧主面板实时同步联动。\n\n---\n\n## 📐 三、核心数学公式与数据口径契约\n\n| 业务指标 | 规范计算公式 | 计量单位 | 达标判定准则 |\n| :--- | :--- | :--- | :--- |\n| **主产品单位产品能耗** | $\text{周期内生产总综合能耗 (tce)} \\div \text{周期内合格实物总产量}$ | `tce/万kVA` (变压器)<br>`tce/km` (线缆) | 优于国家先进定额 5% 以上为优秀 |\n| **总裁 -5% 产值单耗考核** | $[(\text{当期万元产值单耗} - \text{去年同期产值单耗}) \\div \text{去年同期产值单耗}] \times 100\\%$ | `%` | $\\le -5.0\\%$ 超额达标 (绿灯)<br>$> 0\\%$ 超标预警 (红灯) |\n| **订单能耗标杆偏离度** | $[(\text{订单实测综合单耗} - \text{标杆定额单耗}) \\div \text{标杆定额单耗}] \times 100\\%$ | `%` | $\\le -5.0\\%$：🥇 A级卓越 (红榜)<br>$\\pm 5.0\\%$：✓ B级受控<br>$> +5.0\\%$：⚠️ C级预警 (黑榜) |\n\n---\n\n## 🛠️ 四、落地文件与路由对应清单\n\n* [`/html/zero-carbon/energy/structure.html`](file:///d:/Project/TJ-nengtan/html/zero-carbon/energy/structure.html) —— 用能结构分析\n* [`/html/zero-carbon/energy/cost.html`](file:///d:/Project/TJ-nengtan/html/zero-carbon/energy/cost.html) —— 能源成本分析\n* [`/html/zero-carbon/energy/unit-product.html`](file:///d:/Project/TJ-nengtan/html/zero-carbon/energy/unit-product.html) —— 单位产品能耗\n* [`/html/zero-carbon/energy/unit-output.html`](file:///d:/Project/TJ-nengtan/html/zero-carbon/energy/unit-output.html) —— 单位产值能耗\n* [`/html/zero-carbon/energy/benchmark.html`](file:///d:/Project/TJ-nengtan/html/zero-carbon/energy/benchmark.html) —— 对标管理\n* [`/html/docs.html`](file:///d:/Project/TJ-nengtan/html/docs.html) —— 平台在线开发手册与设计规范\n"
  },
  {
    "id": "manual-19",
    "no": 19,
    "filename": "19_碳管理与专项减排项目多Agent全维度深度分析与开发方案.md",
    "title": "碳管理与专项减排项目多Agent全维度深度分析与开发方案",
    "category": "集中监管与核心指标",
    "readTime": "20 分钟",
    "wordCount": 9890,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "🏢 一、多 Agent 专家评审团与背景概述",
        "id": "一-多-agent-专家评审团与背景概述"
      },
      {
        "level": 2,
        "title": "👨‍💼 二、产品经理（PM）视角：业务价值、用户场景与需求拆解",
        "id": "二-产品经理-pm-视角-业务价值-用户场景与需求拆解"
      },
      {
        "level": 3,
        "title": "2.1 业务核心痛点与解决策略",
        "id": "2-1-业务核心痛点与解决策略"
      },
      {
        "level": 3,
        "title": "2.2 核心 User Stories (Gherkin 规范)",
        "id": "2-2-核心-user-stories-gherkin-规范"
      },
      {
        "level": 2,
        "title": "🎨 三、UI/UX 设计师视角：视觉架构、Design Tokens 与极简交互规范",
        "id": "三-ui-ux-设计师视角-视觉架构-design-tokens-与极简交互规范"
      },
      {
        "level": 3,
        "title": "3.1 工业级视觉与 Design Tokens",
        "id": "3-1-工业级视觉与-design-tokens"
      },
      {
        "level": 3,
        "title": "3.2 界面布局与极简交互原则",
        "id": "3-2-界面布局与极简交互原则"
      },
      {
        "level": 2,
        "title": "🏗️ 四、系统架构师（Architect）视角：DDD 建模、C4 容器与 API 契约",
        "id": "四-系统架构师-architect-视角-ddd-建模-c4-容器与-api-契约"
      },
      {
        "level": 3,
        "title": "4.1 领域驱动设计 (DDD) 核心领域模型",
        "id": "4-1-领域驱动设计-ddd-核心领域模型"
      },
      {
        "level": 3,
        "title": "4.2 核心数据库表结构设计 (MySQL / DDL)",
        "id": "4-2-核心数据库表结构设计-mysql-ddl"
      },
      {
        "level": 2,
        "title": "💻 五、前端工程师（Frontend）视角：页面架构、组件复用与交互开发",
        "id": "五-前端工程师-frontend-视角-页面架构-组件复用与交互开发"
      },
      {
        "level": 3,
        "title": "5.1 页面清单与路由映射",
        "id": "5-1-页面清单与路由映射"
      },
      {
        "level": 2,
        "title": "⚙️ 六、后端工程师（Backend）视角：算法引擎、缓存与事务一致性",
        "id": "六-后端工程师-backend-视角-算法引擎-缓存与事务一致性"
      },
      {
        "level": 3,
        "title": "6.1 碳排放核算核心计算引擎",
        "id": "6-1-碳排放核算核心计算引擎"
      },
      {
        "level": 2,
        "title": "🔒 七、网络安全工程师（Security）视角：STRIDE 威胁建模与合规",
        "id": "七-网络安全工程师-security-视角-stride-威胁建模与合规"
      }
    ],
    "content": "# 19. 碳管理与专项减排项目多 Agent 全维度深度分析与开发方案\n\n---\n\n## 🏢 一、多 Agent 专家评审团与背景概述\n\n针对特变电工（电装集团）能碳数字化集成平台中两大核心业务板块：\n1. **【碳管理】（Carbon Management）**：碳排放核算 (`accounting.html`)、碳排放分析 (`analysis.html`)、碳核算报告 (`report.html`)；\n2. **【专项碳排与减排】（Special Carbon & Emission Reduction）**：项目台账 (`archive.html`)、减排建模 (`model.html`)、效益评估 (`benefit.html`)、自愿减排(CCER) (`self.html`)。\n\nAntigravity 8 大专业角色（PM、UI/UX、Architect、Frontend、Backend、Security、DevOps、QA）结合当前项目确立的**“模块整合、抓大放小、极简交互、数据链路固化”**战略开发方向，展开全维度工程级分析与落地方案设计。\n\n```mermaid\ngraph TD\n    subgraph 碳管理核心链路\n        A1[在线用能/活动水平数据] --> A2[碳排放核算引擎 Scope 1/2/3]\n        A2 --> A3[多维碳排放构成与趋势分析]\n        A3 --> A4[ISO 14064 自动化碳核算报告]\n    end\n    subgraph 专项减排核心链路\n        B1[减排项目台账库 光伏/储能/技改] --> B2[CCER 方法学减排建模]\n        B2 --> B3[经济/环境双效益实时评估]\n        B3 --> B4[自愿减排 CCER 资产核证与交易]\n    end\n    A2 -.->|核算基准线| B2\n    B3 -.->|节碳量抵消| A3\n```\n\n---\n\n## 👨‍💼 二、产品经理（PM）视角：业务价值、用户场景与需求拆解\n\n### 2.1 业务核心痛点与解决策略\n\n| 业务模块 | 传统企业管理痛点 | “双中心”数字化升级方案 | 优先级 |\n| :--- | :--- | :--- | :---: |\n| **碳排放核算** | 手工 Excel 计算易错、因子版本混乱、组织边界与核算口径不一致 | **自动化动态核算引擎**：绑定国家电网最新区域排放因子与特变本地化因子库，支持范围1（直接化石燃烧）、范围2（外购电力/热力）、范围3（关键外购原材料运输）三级全自动按日/月核算，提供分子分母与公式完全透明穿透。 | **P0** |\n| **碳排放分析** | 仅有集团总量，无法清晰归因高碳产线与工序热点，缺乏对标抓手 | **四象限多维诊断看板**：按“制造板块、基地工厂、能源介质、工艺工序”四维穿透，前置突出万元产值碳强度同比变化，提供红黑榜排名与节能减排潜力归因。 | **P0** |\n| **碳核算报告** | 第三方核查编制报告周期长（数周）、格式不统一、数据溯源困难 | **一键生成合规报告 (ISO 14064 / GHG Protocol)**：内置国家标准报告模板，自动填充活动水平与因子，附带区块链哈希防伪水印与计算数据包，支持 PDF/Word 导出。 | **P1** |\n| **减排项目台账** | 光伏、储能、余热回收等技改项目分散在各厂，投资与运维脱节 | **全生命周期数字台账**：统一纳管“规划、在建、并网运行、技改”四大状态，集成装机容量、投资额、并网日期、EPC 厂商与运维监测接口。 | **P1** |\n| **减排建模** | 理论节能量与实际运行脱节，缺乏权威方法学支撑 | **CCER 标准方法学模型库**：内置并网可再生能源发电（CMS-001）、工业余热利用、高效配变替代等标准算法，支持基准线情景与项目情景动态模拟。 | **P1** |\n| **效益评估** | 算不清省了多少电费、赚了多少绿电收益、减少了多少碳资产成本 | **经济与环境效益双轮评估舱**：实时计算度电成本（LCOE）、自发自用节约电费、余电上网收益、投资回收期（动态 IRR/NPV）与年化碳资产价值。 | **P0** |\n| **自愿减排(CCER)** | 对 CCER 重启政策响应慢，未形成可交易资产化闭环 | **CCER 资产开发全流程工作台**：项目公示 ➔ 审定登记 ➔ 减排量核证 ➔ 资产挂牌全周期管理，提供碳资产盘点与内部碳市场抵消模拟。 | **P2** |\n\n### 2.2 核心 User Stories (Gherkin 规范)\n\n```gherkin\nFeature: 碳排放异常超标智能归因与减排建议联动\n  Scenario: 某工厂当月单位产值碳强度突发超标\n    Given 沈变本部在 2026年8月 的单位产值碳强度达到 0.42 tCO2/万元 (超过考核红线 0.38)\n    When 能源碳资产专员进入【碳排放分析】模块并点击“异常诊断”\n    Then 系统自动拆解高碳排构成并定位至“3号真空干燥罐天然气燃烧消耗异常偏高 (+28%)”\n    And 系统联动【减排建模】推荐：“实施微波干燥低温相变技改，预计年化减排 380 tCO2，节费 14.5 万元”\n```\n\n---\n\n## 🎨 三、UI/UX 设计师视角：视觉架构、Design Tokens 与极简交互规范\n\n### 3.1 工业级视觉与 Design Tokens\n\n* **碳排放与减排专属色彩体系**：\n  * 🌿 **范围 1 直接排放（Direct/Gas）**：`#fa8c16`（工业暖橙，代表燃料与天然气燃烧）\n  * ⚡ **范围 2 间接排放（Electricity）**：`#1677ff`（科技品牌蓝，代表外购电力与蒸汽）\n  * 🚛 **范围 3 价值链排放（Supply Chain）**：`#722ed1`（深邃紫，代表原材料供应链与运输）\n  * 🥇 **减排/绿电正向收益（Green Asset）**：`#10b981`（翡翠绿，代表减排量、绿电收益与达标）\n  * ⚠️ **超标与碳风险预警（Carbon Risk）**：`#f43f5e`（高亮玫红，代表碳强度超标与配额缺口）\n\n### 3.2 界面布局与极简交互原则\n\n1. **左侧拓扑树统一样式（Classic Show-Line Tree）**：\n   - 保持 260px 宽度，与能效分析模块严格一致；\n   - 变压器（沈变、衡变、新变）与线缆（鲁缆、新缆、德缆）8 家制造基地高亮可用，其他非主营辅件单位灰显禁用（`【暂未纳管】`）；\n2. **拒绝空洞汇总，直接上多维筛选控制区**：\n   - 顶部提供“核算周期（月/季/年）、核算范围（Scope 1/2/3）、折算标准（全国均值/区域电网/绿证扣除）”多维快捷筛选；\n3. **空间换效率（多基地平铺与下钻）**：\n   - 在碳排放分析与项目台账中，直接平铺 8 家基地碳强度与减排项目卡片，点击直接滑出工序/订单明细与减排测算详情弹窗。\n\n---\n\n## 🏗️ 四、系统架构师（Architect）视角：DDD 建模、C4 容器与 API 契约\n\n### 4.1 领域驱动设计 (DDD) 核心领域模型\n\n```mermaid\nclassDiagram\n    class CarbonAccountingAggregate {\n        +String tenantId\n        +String factoryId\n        +Period accountingPeriod\n        +Double scope1Tco2\n        +Double scope2Tco2\n        +Double scope3Tco2\n        +Double totalEmissions\n        +Double carbonIntensityOutput\n        +calculateEmissions(FactorSet factors)\n        +generateComplianceReport()\n    }\n    class EmissionFactorEntity {\n        +String factorId\n        +String mediaType\n        +Double factorValue\n        +String unit\n        +String version\n        +Boolean isDefault\n    }\n    class ReductionProjectAggregate {\n        +String projectId\n        +String projectName\n        +ProjectType type\n        +ProjectStatus status\n        +Double installedCapacity\n        +Double totalInvestment\n        +Double annualReductionTco2\n        +calculateIrrAndPayback()\n        +simulateCcerOutput()\n    }\n    class CcerAssetDomain {\n        +String ccerId\n        +String methodologyCode\n        +Double verifiedReductionTco2\n        +CcerStatus tradeStatus\n        +Double estimatedMarketValue\n    }\n    CarbonAccountingAggregate \"1\" *-- \"many\" EmissionFactorEntity\n    ReductionProjectAggregate \"1\" *-- \"1\" CcerAssetDomain\n    CarbonAccountingAggregate ..> ReductionProjectAggregate : 抵消核算\n```\n\n### 4.2 核心数据库表结构设计 (MySQL / DDL)\n\n```sql\n-- 1. 组织碳核算明细表\nCREATE TABLE `tb_carbon_accounting_record` (\n  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',\n  `factory_id` VARCHAR(64) NOT NULL COMMENT '工厂编码(如 shenbian_main)',\n  `factory_name` VARCHAR(128) NOT NULL COMMENT '工厂名称',\n  `period_type` VARCHAR(16) NOT NULL COMMENT '周期类型(MONTH/QUARTER/YEAR)',\n  `stat_period` VARCHAR(32) NOT NULL COMMENT '统计周期(2026-08)',\n  `scope1_emissions` DECIMAL(14,4) NOT NULL DEFAULT 0.0000 COMMENT '范围1直接排放量(tCO2)',\n  `scope2_emissions` DECIMAL(14,4) NOT NULL DEFAULT 0.0000 COMMENT '范围2电力/热力排放量(tCO2)',\n  `scope3_emissions` DECIMAL(14,4) NOT NULL DEFAULT 0.0000 COMMENT '范围3供应链运输排放量(tCO2)',\n  `green_power_offset` DECIMAL(14,4) NOT NULL DEFAULT 0.0000 COMMENT '绿电/绿证抵消量(tCO2)',\n  `net_emissions` DECIMAL(14,4) NOT NULL DEFAULT 0.0000 COMMENT '净碳排放量(tCO2)',\n  `output_value_wan` DECIMAL(14,4) NOT NULL DEFAULT 0.0000 COMMENT '当期产值(万元)',\n  `carbon_intensity` DECIMAL(10,4) NOT NULL DEFAULT 0.0000 COMMENT '万元产值碳强度(tCO2/万元)',\n  `intensity_yoy_rate` DECIMAL(8,2) NOT NULL DEFAULT 0.00 COMMENT '碳强度同比增减率(%)',\n  `status` VARCHAR(16) NOT NULL DEFAULT 'CALCULATED' COMMENT '状态(CALCULATED/AUDITED/PUBLISHED)',\n  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `uk_factory_period` (`factory_id`, `stat_period`, `period_type`),\n  KEY `idx_stat_period` (`stat_period`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='组织级碳核算结果台账表';\n\n-- 2. 减排项目全生命周期资产表\nCREATE TABLE `tb_reduction_project` (\n  `project_id` VARCHAR(64) NOT NULL COMMENT '项目唯一编号 (PRJ-2026-PV01)',\n  `factory_id` VARCHAR(64) NOT NULL COMMENT '所属工厂ID',\n  `project_name` VARCHAR(128) NOT NULL COMMENT '减排项目名称',\n  `project_type` VARCHAR(32) NOT NULL COMMENT '项目类型(ROOFTOP_PV/ENERGY_STORAGE/HEAT_RECOVERY/MOTOR_INVERTER)',\n  `status` VARCHAR(24) NOT NULL DEFAULT 'OPERATING' COMMENT '状态(PLANNING/CONSTRUCTION/OPERATING/MAINTENANCE)',\n  `capacity_mw` DECIMAL(10,3) NOT NULL DEFAULT 0.000 COMMENT '装机容量/规模(MW/MWh/Nm3)',\n  `total_investment_wan` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '总投资金额(万元)',\n  `grid_connected_date` DATE DEFAULT NULL COMMENT '并网运行日期',\n  `annual_gen_kwh` DECIMAL(14,2) NOT NULL DEFAULT 0.00 COMMENT '年化发电量/节能量(kWh)',\n  `annual_reduction_tco2` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '年化碳减排量(tCO2/年)',\n  `annual_cost_saving_wan` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '年化节约电费/收益(万元/年)',\n  `irr_rate` DECIMAL(6,2) NOT NULL DEFAULT 0.00 COMMENT '内部收益率IRR(%)',\n  `payback_years` DECIMAL(4,1) NOT NULL DEFAULT 0.0 COMMENT '静态投资回收期(年)',\n  `ccer_eligible` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否符合CCER申报条件',\n  PRIMARY KEY (`project_id`),\n  KEY `idx_factory_status` (`factory_id`, `status`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='减排与零碳项目台账表';\n```\n\n---\n\n## 💻 五、前端工程师（Frontend）视角：页面架构、组件复用与交互开发\n\n### 5.1 页面清单与路由映射\n\n| 业务板块 | 页面文件路径 | 核心 UI 结构与交互特性 |\n| :--- | :--- | :--- |\n| **碳管理** | `zero-carbon/carbon/accounting.html` | Scope 1/2/3 排放卡片、动态核算公式弹窗、活动水平数据填报与同步列表 |\n| **碳管理** | `zero-carbon/carbon/analysis.html` | 碳排放四象限矩阵、能源介质碳热点桑基图、8基地碳强度同比平铺看板 |\n| **碳管理** | `zero-carbon/carbon/report.html` | ISO 14064 自动化报告模板库、历年报告在线归档、一键导出 PDF/Word |\n| **专项减排** | `zero-carbon/project/archive.html` | 减排项目数字档案库、投资与装机容量进度条、EPC 与关键节点全景卡片 |\n| **专项减排** | `zero-carbon/project/model.html` | CCER 标准方法学模拟器、基准线情景对比、多参数（利用小时/衰减率）滑块建模 |\n| **专项减排** | `zero-carbon/project/benefit.html` | 经济与环境双效益看板、度电成本(LCOE)曲线、动态现金流回本周期测算 |\n| **专项减排** | `zero-carbon/project/self.html` | CCER 自愿减排资产开发看板、审定/核证进度步进器、碳配额抵消模拟交易舱 |\n\n---\n\n## ⚙️ 六、后端工程师（Backend）视角：算法引擎、缓存与事务一致性\n\n### 6.1 碳排放核算核心计算引擎\n\n1. **范围 1（直接燃烧排放）计算**：\n   $$\text{Scope 1 (tCO}_2) = \\sum_{i} \\left[ \text{燃料消费量}_i \times \text{低位发热量}_i \times \text{单位热值含碳量}_i \times \text{碳氧化率}_i \times \frac{44}{12} \night]$$\n2. **范围 2（外购电力间接排放）计算**：\n   $$\text{Scope 2 (tCO}_2) = (\text{外购网电总量 (MWh)} - \text{直供绿电消纳量 (MWh)}) \times \text{区域电网基准平均排放因子 (tCO}_2/\text{MWh)}$$\n3. **万元产值碳强度**：\n   $$\text{碳强度 (tCO}_2/\text{万元)} = \frac{\text{净碳排放总量 (tCO}_2)}{\text{统计期工业总产值 (万元)}}$$\n\n---\n\n## 🔒 七、网络安全工程师（Security）视角：STRIDE 威胁建模与合规\n\n* **S (Spoofing 身份伪装)**：严格基于 RBAC+ABAC 细粒度权限控制，碳排因子修改与报告发布需高级能源官数字签名；\n* **T (Tampering 数据篡改)**：核算记录与项目台账采用字段级 SHA-256 签名存证，任何手工调账记录保留完整不可篡改审计日志；\n* **I (Information Disclosure 敏感信息泄露)**：供应商前驱体碳足迹与商业订单数据采用国密 SM4 数据库落盘加密；\n* **D (Denial of Service 拒绝服务)**：报表导出与多情景减排建模放入后台异步线程池，前端限制并发导出频率。\n\n---\n\n## 🚀 八、DevOps / SRE 视角：调度流水线与质量运维\n\n1. **自动结算定时 Cron 任务**：\n   - 每日 00:30 自动拉取前一日各基地电、水、气用量完成初步碳核算；\n   - 每月 1 日 02:00 自动触发月度组织碳核算封账与合规报告生成；\n2. **SRE 四大黄金指标保障**：\n   - 碳核算查询 API P95 延迟 $\\le 150\text{ms}$；\n   - 复杂多维分析与报告导出异步任务成功率 $\\ge 99.9\\%$。\n\n---\n\n## 🧪 九、测试工程师（QA）视角：测试用例矩阵与边界值\n\n| 测试场景 | 测试用例输入 | 预期输出与断言 | 风险等级 |\n| :--- | :--- | :--- | :---: |\n| **绿电全抵消边界** | 当月 100% 绿电消纳，外购市电为 0 | 范围 2 排放量精确为 `0.0000 tCO2`，无负值异常 | **High** |\n| **因子变更重算** | 电网排放因子由 `0.5703` 修正为 `0.5350` | 历史已封账月份保持原值不变，当期及未封账月份秒级刷新重算 | **High** |\n| **产值为零极值** | 新建基地当月产值为 `0.00` 万元，用电量 `50,000 kWh` | 碳强度字段友好展示为 `--` 或 `0.00`，严禁触发除零异常 (`NaN` / `Infinity`) | **Critical** |\n| **CCER 减排量核减** | 申报减排量超过项目装机理论最大发电量 | 触发智能拦截校验：“申报减排量超出理论上限，请复核利用小时数” | **Medium** |\n\n---\n\n## 🎯 十、实施路径与建议落地排期\n\n1. **第一阶段（原型重构与视觉对齐 · 当前）**：\n   - 按照统一工业拓扑树与 14px 栅格规范，全面重构 `carbon/` 与 `project/` 下全部 7 个静态 HTML 页面；\n   - 植入真实的变压器/线缆 8 家基地真实碳排放数据、真实光伏/储能减排台账与 CCER 模拟器。\n2. **第二阶段（计算引擎与接口对接 · 2026-09-15 前）**：\n   - 联调动态折标煤与 Scope 1/2/3 碳核算引擎，完成数据同源校验；\n3. **第三阶段（合规认证与全系统上线 · 2026-12-05）**：\n   - 对接 ISO 14064 权威第三方认证报告生成与 CCER 资产申报流程。\n"
  },
  {
    "id": "manual-20",
    "no": 20,
    "filename": "20_集团与企业双层级能碳管控架构设计与功能落地方案.md",
    "title": "集团与企业双层级能碳管控架构设计与功能落地方案",
    "category": "集中监管与核心指标",
    "readTime": "10 分钟",
    "wordCount": 4816,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "🏢 一、双层级设计哲学与总体定位",
        "id": "一-双层级设计哲学与总体定位"
      },
      {
        "level": 2,
        "title": "📊 二、双层级数据维度与核心诉求差异矩阵",
        "id": "二-双层级数据维度与核心诉求差异矩阵"
      },
      {
        "level": 2,
        "title": "🎯 三、【碳管理】三大子模块双层级功能设计",
        "id": "三-碳管理-三大子模块双层级功能设计"
      },
      {
        "level": 3,
        "title": "3.1 碳排放核算 (`carbon/accounting.html`)",
        "id": "3-1-碳排放核算-carbon-accounting-html"
      },
      {
        "level": 3,
        "title": "3.2 碳排放分析 (`carbon/analysis.html`)",
        "id": "3-2-碳排放分析-carbon-analysis-html"
      },
      {
        "level": 3,
        "title": "3.3 碳核算报告 (`carbon/report.html`)",
        "id": "3-3-碳核算报告-carbon-report-html"
      },
      {
        "level": 2,
        "title": "⚡ 四、【专项碳排与减排】四大子模块双层级功能设计",
        "id": "四-专项碳排与减排-四大子模块双层级功能设计"
      },
      {
        "level": 3,
        "title": "4.1 项目台账 (`project/archive.html`)",
        "id": "4-1-项目台账-project-archive-html"
      },
      {
        "level": 3,
        "title": "4.2 减排建模 (`project/model.html`)",
        "id": "4-2-减排建模-project-model-html"
      },
      {
        "level": 3,
        "title": "4.3 效益评估 (`project/benefit.html`)",
        "id": "4-3-效益评估-project-benefit-html"
      },
      {
        "level": 3,
        "title": "4.4 自愿减排(CCER) (`project/self.html`)",
        "id": "4-4-自愿减排-ccer-project-self-html"
      },
      {
        "level": 2,
        "title": "🛠️ 五、落地文件与实现架构映射",
        "id": "五-落地文件与实现架构映射"
      }
    ],
    "content": "# 20. 集团与企业双层级能碳管控架构设计与功能落地方案\n\n---\n\n## 🏢 一、双层级设计哲学与总体定位\n\n特变电工（电装集团）“双中心”数字化集成平台在设计【碳管理】与【专项碳排与减排】时，必须严格区分**集团（Group Level）**与**企业/工厂（Enterprise / Plant Level）**两个管理层级。\n\n> **核心设计准则**：  \n> **“集团看大盘、抓考核、控战略、配资产；企业看细节、抓工序、填数据、做技改”**  \n> 巧妙化解跨层级数据口径差异与管理颗粒度矛盾，既保证集团宏观战略统一，又满足底层基地精细化操作诉求。\n\n```mermaid\ngraph TB\n    subgraph 集团层级 Group Level\n        G1[全集团大盘监控] --> G2[8基地横向考核与排名]\n        G2 --> G3[集团碳资产/CCER统筹调配]\n        G3 --> G4[ISO 14064 集团合规报告/ESG披露]\n    end\n\n    subgraph 企业/工厂层级 Plant Level\n        P1[活动水平数据填报与同步] --> P2[5大核心工序碳热点拆解]\n        P2 --> P3[具体光伏/储能技改与电费节约]\n        P3 --> P4[订单级碳足迹追溯与红黑榜]\n    end\n\n    G1 -.->|分解考核目标 每年-5%| P1\n    P4 -.->|上报聚合数据| G2\n    P3 -.->|汇集减排资产| G3\n```\n\n---\n\n## 📊 二、双层级数据维度与核心诉求差异矩阵\n\n| 对比维度 | 🏢 集团层级 (Group Level · 电装集团本部) | 🏭 企业/工厂层级 (Plant Level · 沈变/衡变/鲁缆等) |\n| :--- | :--- | :--- |\n| **主要使用者** | 集团总裁、分管能碳高管、集团能源资产管理部 | 制造基地厂长、车间主任、动力科长、能源碳资产专员 |\n| **核心管理诉求** | **看大盘、抓考核、控战略、配资产**<br>• 总裁“每年同比下降5%”全集团战略督办<br>• 8大制造基地横向对比、综合标杆达标率<br>• 集团总碳配额、CCER 资产池统一盘点与调配<br>• 集团对外碳中和示范、ESG 披露与第三方评级 | **看细节、抓工序、填数据、做技改**<br>• 具体产线、车间、高耗能设备测点监测<br>• 真实活动水平数据（电/水/气）填报与核对<br>• 真实生产订单单台能耗/碳排分析与红黑榜<br>• 具体光伏/储能/余热技改建设进度与电费节省 |\n| **数据颗粒度** | **宏观聚合 + 基地级横向指标**<br>• 集团总排放量 (Scope 1/2/3)、净排放量<br>• 各基地万元产值碳强度及同比排名<br>• 集团减排项目投资总览 (IRR / 年化节碳量)<br>• 集团 CCER 资产核证总量与市值 | **微观工序 + 订单/设备级明细**<br>• 铁芯/线圈/真空干燥罐/试验站各工序直接排放<br>• 电网因子/天然气折算过程明细公式<br>• 具体项目 EPC、逆变器效率、日消纳曲线<br>• 异常工序排查、节能工单派发与闭环整改 |\n| **穿透与下钻边界** | **最多下钻至电装成品/基地总体**<br>• 严禁过度暴露车间底层工艺与配方数据<br>• 重点提供“集团大盘排名与趋势总览”弹窗 | **深度穿透至具体工序、测点与订单**<br>• 支持穿透至干燥罐、电抗器试验站、具体订单号<br>• 提供分子分母原数据校验与修改记录追溯 |\n\n---\n\n## 🎯 三、【碳管理】三大子模块双层级功能设计\n\n### 3.1 碳排放核算 (`carbon/accounting.html`)\n* **🏢 集团视角 (选中“特变电工集团”)**：\n  1. **全集团碳排放大盘**：汇总 6 大板块、8 家基地总净碳排放量（`18.42 万吨 CO₂`），展示 Scope 1（化石直接）、Scope 2（外购电热）、Scope 3（供应链运输）比例；\n  2. **8 家基地达标红黑榜**：按万元产值碳强度升序排列，展示达标状态（绿灯超额达标 vs 红灯超标预警）；\n  3. **因子标准统一管控**：集团层级固化并下发最新区域电网排放因子标准版本。\n* **🏭 企业视角 (选中“沈变本部”或“新变厂”)**：\n  1. **活动水平数据填报与同步**：该基地市电（kWh）、天然气（m³）、蒸汽（t）、直供绿电（kWh）等原始台账与同步状态；\n  2. **动态公式透明穿透**：Scope 1/2/3 明细卡片点击弹出专属计算公式，分子分母透明可查；\n  3. **异常突增智能预警**：单月介质消耗突增 >15% 自动标黄提示动力车间复核。\n\n### 3.2 碳排放分析 (`carbon/analysis.html`)\n* **🏢 集团视角**：\n  1. **基地四象限散点矩阵**：横轴“产值规模”，纵轴“万元产值碳强度”，直观区分领跑基地、稳健基地、潜力基地与重点改善基地；\n  2. **集团 12 个月大盘演进趋势**：实测走势 vs 集团领跑目标线对比；\n  3. **全集团全介质碳热点桑基图**：直观展示能源介质流向变压器/线缆两大板块的碳排分布。\n* **🏭 企业视角**：\n  1. **车间工序碳排强度拆解**：变压器 5 大核心工序（铁芯剪切/线圈绕制/真空干燥/总装配/试验站）碳强度柱状图；\n  2. **重点型号单台碳足迹对标**：如 ODFS-334MVA 单台碳足迹与行业先进定额对比；\n  3. **工序减排诊断建议**：自动识别高碳瓶颈并生成技改建议工单。\n\n### 3.3 碳核算报告 (`carbon/report.html`)\n* **🏢 集团视角**：\n  1. **集团级 ISO 14064-1 / ESG 披露报告**：一键生成面向上市公司与投资者的全景碳盘查报告；\n  2. **跨年度减排成效对比库**：历年集团碳盘查报告归档与减排轨迹图谱；\n  3. **第三方核查一键打包**：自动汇聚 8 家工厂核算佐证数据包，供权威机构核验。\n* **🏭 企业视角**：\n  1. **工厂级专项核算报告**：导出该基地专属的季度/年度碳排放报告；\n  2. **核查资料在线上传**：上传电费账单、天然气发票、绿证凭证等原始凭证。\n\n---\n\n## ⚡ 四、【专项碳排与减排】四大子模块双层级功能设计\n\n### 4.1 项目台账 (`project/archive.html`)\n* **🏢 集团视角**：\n  1. **集团资产总盘**：总投资额（`1.85 亿元`）、总装机容量（`42.5 MW/MWh`）、年化总节碳量（`3.82 万吨 CO₂`）；\n  2. **多基地项目布局看板**：平铺 8 家基地在建与并网项目矩阵，实时监测绿电替代率提升进度。\n* **🏭 企业视角**：\n  1. **本厂项目数字卡片**：如“沈变本部 5.8MW 屋顶光伏”、“2MW/4MWh 储能电站”；\n  2. **运维与工程参数**：并网日期、EPC 厂商、逆变器运行效率、每日发电与消纳时序曲线。\n\n### 4.2 减排建模 (`project/model.html`)\n* **🏢 集团视角**：\n  1. **统一方法学模型库**：维护并发布国家 CCER 权威方法学（可再生能源并网 CMS-001、工业余热利用）；\n  2. **集团减排空间宏观推演**：模拟未来 3 年全集团光伏铺满情景下的碳减排总量与节费潜力。\n* **🏭 企业视角**：\n  1. **项目级参数模拟器**：支持输入装机容量、年有效利用小时数、系统效率、衰减率，动态模拟 25 年现金流与逐年节碳量；\n  2. **基准线情景对比**：直观对比“无项目基准线” vs “技改项目情景”能耗与碳排差异。\n\n### 4.3 效益评估 (`project/benefit.html`)\n* **🏢 集团视角**：\n  1. **全集团投资回报综合大盘**：全集团综合 IRR（`11.8%`）、平均静态回收期（`5.6 年`）、年化总节费（`2,480 万元`）；\n  2. **各基地投资回报率横向排行**：资金利用效率评估与优质项目示范推广。\n* **🏭 企业视角**：\n  1. **度电成本 (LCOE) 与收益构成**：自发自用节约电费 vs 余电上网收益明细；\n  2. **月度财务账单对冲**：直观对比项目投运前后工厂电费账单节约金额。\n\n### 4.4 自愿减排(CCER) (`project/self.html`)\n* **🏢 集团视角**：\n  1. **集团 CCER 资产池统筹**：全集团已核证 CCER 资产（`6.5 万吨`）、预估市值（`460 万元`）；\n  2. **集团内部配额抵消流转**：模拟各工厂超标配额通过集团内部 CCER 统一抵消。\n* **🏭 企业视角**：\n  1. **本厂 CCER 申报项目推进看板**：立项 ➔ 审定 ➔ 备案 ➔ 监测 ➔ 核证全流程 5 级步进器；\n  2. **核证资料填报与监测数据上传**：提交并网电表逆流监测日志与第三方审定报告。\n\n---\n\n## 🛠️ 五、落地文件与实现架构映射\n\n* [`/html/zero-carbon/carbon/accounting.html`](file:///d:/Project/TJ-nengtan/html/zero-carbon/carbon/accounting.html) —— 碳排放核算\n* [`/html/zero-carbon/carbon/analysis.html`](file:///d:/Project/TJ-nengtan/html/zero-carbon/carbon/analysis.html) —— 碳排放分析\n* [`/html/zero-carbon/carbon/report.html`](file:///d:/Project/TJ-nengtan/html/zero-carbon/carbon/report.html) —— 碳核算报告\n* [`/html/zero-carbon/project/archive.html`](file:///d:/Project/TJ-nengtan/html/zero-carbon/project/archive.html) —— 减排项目台账\n* [`/html/zero-carbon/project/model.html`](file:///d:/Project/TJ-nengtan/html/zero-carbon/project/model.html) —— 减排建模\n* [`/html/zero-carbon/project/benefit.html`](file:///d:/Project/TJ-nengtan/html/zero-carbon/project/benefit.html) —— 效益评估\n* [`/html/zero-carbon/project/self.html`](file:///d:/Project/TJ-nengtan/html/zero-carbon/project/self.html) —— 自愿减排(CCER)\n"
  },
  {
    "id": "manual-21",
    "no": 21,
    "filename": "21_全站页面样式与模块风格一致性多Agent全维检查报告.md",
    "title": "全站页面样式与模块风格一致性多Agent全维检查报告",
    "category": "能耗分析与下钻模型",
    "readTime": "6 分钟",
    "wordCount": 3146,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "📌 审计概述与多 Agent 专家团队构成",
        "id": "审计概述与多-agent-专家团队构成"
      },
      {
        "level": 2,
        "title": "🔍 一、UI/UX 视觉与布局规范一致性审计结果 (Agent 1)",
        "id": "一-ui-ux-视觉与布局规范一致性审计结果-agent-1"
      },
      {
        "level": 2,
        "title": "🔗 二、DOM 结构与全站链接完整性审计结果 (Agent 2)",
        "id": "二-dom-结构与全站链接完整性审计结果-agent-2"
      },
      {
        "level": 2,
        "title": "📊 三、业务数据口径与双层级架构一致性审计结果 (Agent 3)",
        "id": "三-业务数据口径与双层级架构一致性审计结果-agent-3"
      },
      {
        "level": 3,
        "title": "1. 集团全局大盘 vs 企业工序执行双层级标准",
        "id": "1-集团全局大盘-vs-企业工序执行双层级标准"
      },
      {
        "level": 3,
        "title": "2. 全站核心数据契约一致性验证",
        "id": "2-全站核心数据契约一致性验证"
      },
      {
        "level": 2,
        "title": "🏁 四、多 Agent 验收结论与归档说明",
        "id": "四-多-agent-验收结论与归档说明"
      }
    ],
    "content": "# 21. 全站页面样式与模块风格一致性多 Agent 全维深度检查报告\n\n---\n\n## 📌 审计概述与多 Agent 专家团队构成\n\n为确保特变电工（电装集团）“双中心”数字化集成平台（**零碳园区集控中心 + 产品碳足迹集采中心**）全站静态原型在视觉规范、交互体验、组织拓扑树架构、DOM 语法闭合与数据口径上的高度一致性与工业级交付品质，特启动 **Multi-Agent 全站工程一致性审查**。\n\n```mermaid\nflowchart TD\n    subgraph MultiAgentTeam[\"🤖 多 Agent 全站一致性专家审查团队\"]\n        A[\"🎨 Agent 1: UI/UX & Layout 视觉规范审计员\"]\n        B[\"🔗 Agent 2: DOM 语法树与路由死链审计员\"]\n        C[\"📊 Agent 3: 集团 vs 企业双层级业务口径审计员\"]\n    end\n\n    subgraph Scope[\"📁 全站 55 个 HTML 页面全量扫描\"]\n        P1[\"门户与集控大屏 (index, screen, cockpit)\"]\n        P2[\"集中监管模块 (indicator, online, green)\"]\n        P3[\"能效分析重构模块 (cost, unit-product, unit-output, benchmark)\"]\n        P4[\"碳管理三大模块 (accounting, analysis, report)\"]\n        P5[\"专项减排四大模块 (archive, model, benefit, self)\"]\n        P6[\"报表、告警、基础配置与系统管理模块\"]\n    end\n\n    MultiAgentTeam --> Scope\n```\n\n---\n\n## 🔍 一、UI/UX 视觉与布局规范一致性审计结果 (Agent 1)\n\n| 审计维度 | 规范标准定义 | 全站检查结果 | 达标情况 |\n| :--- | :--- | :--- | :---: |\n| **顶部 Header 统一结构** | 包含汉堡菜单收起按钮 `☰`、系统名称 `能碳管控“双中心”数字化集成平台`、`v1.01` 标签、`开发手册` 链接、`管理配置` 链接与管理员用户态 | 全站 40 个业务主页面 100% 具备完整统一 Header，操作按钮尺寸统一为 `size-4`，间距统一为 `gap-3` | ✅ 100% 合规 |\n| **左侧主导航栏 (Sidebar)** | 宽度 `w-56`（收起时 `w-0`）、渐变深蓝背景 `#0958d9`、10 大模块分组、激活高亮 `bg-[#1677ff]`、折叠箭头动画 | 10 大模块分类清晰，图标统一采用 Lucide 矢量图标，所有子菜单激活态与展开收起完全同步 | ✅ 100% 合规 |\n| **组织拓扑树 (Tree)** | 统一宽度 `270px`、经典连接导线 (Show-Line Tree)、对齐指标管控 6 大板块与 30 家工厂节点、实时搜索过滤高亮 | 14 个核心能碳分析页面组织树结构与 DOM 规范完全统一，根节点一键切集团大盘，子节点切工厂明细 | ✅ 100% 合规 |\n| **主体卡片与间距 (Layout)** | 统一模块间距 `gap-3.5` (14px)、卡片圆角 `rounded-xl`、边框 `border-slate-200`、阴影 `shadow-xs` | 全页面彻底消除视觉跳跃与断层，卡片层次清晰统一 | ✅ 100% 合规 |\n| **排版与数字字体 (Typography)** | 字体栈 `-apple-system / BlinkMacSystemFont / PingFang SC`，数字全面开启 `tabular-nums` 等宽排列 | 数据表格、指标卡片与 SVG 刻度数字完全等宽对齐，无字符抖动 | ✅ 100% 合规 |\n| **SVG 矢量图表文字规范** | X轴标签 `11.5px/fill-#475569`，Y轴标签 `11px/fill-#64748b`，标题 `12px/font-bold` | 图表文字严格约束在 11~12px，杜绝拉伸变形 | ✅ 100% 合规 |\n\n---\n\n## 🔗 二、DOM 结构与全站链接完整性审计结果 (Agent 2)\n\n通过自动化 AST 解析脚本对全站 55 个 HTML 文件进行逐行逐标签深度扫描：\n\n```\n================ 全站 DOM 与路由链接审计统计 ================\n总扫描 HTML 文件数: 55 个\nDOM 标签完全平衡闭合 (Unclosed tags: []): 55 / 55 (100%)\n包含标准化 Header 页面数: 45 个\n包含标准化 Sidebar 页面数: 43 个\n包含侧边栏一键折叠按钮页面数: 40 个 (除 docs/demo 独立外全部覆盖)\n全站相对路径跳转链接总校验数: 1,309 条\n死链 / 断链 / 404 错误数: 0 条 (100% 有效解析)\n```\n\n---\n\n## 📊 三、业务数据口径与双层级架构一致性审计结果 (Agent 3)\n\n### 1. 集团全局大盘 vs 企业工序执行双层级标准\n- **🏢 集团层级 (Group Level)**：\n  - 聚焦全集团总净碳排放（`18.42 万吨 CO₂e`）、Scope 1/2/3 构成占比、8 大主要制造基地万元产值碳强度平铺大盘、四象限散点矩阵（领跑/稳健/潜力/改善）、ISO 14064 组织级报告与 CCER 资产池（`6.5 万吨 / 455 万元`）。\n  - 穿透边界：最多下钻至基地大盘与电装成品，不暴露底层配方。\n- **🏭 企业工序层级 (Plant Level)**：\n  - 聚焦具体工厂（如沈变本部、新变厂、鲁缆公司）活动水平原始数据（电度表底、天然气流量计、光伏自用电量）、5 大核心工序（剪切/绕制/干燥/装配/试验）碳热点拆解（真空干燥占 54.3%）、生产订单碳足迹红黑榜（A级卓越、B级受控、C级超标）。\n  - 穿透边界：深度支持穿透至车间电表、干燥罐与生产工单。\n\n### 2. 全站核心数据契约一致性验证\n- **电网基准因子**：统一为国家生态环境部最新区域电网基准值 `0.5703 tCO₂/MWh`；\n- **标煤折算基准**：成本模块统一换算为 `tce`，剔除综合总费用，替换为独立 ESG 水耗；\n- **考核基准线**：总裁“每年同比下降 5%”战略基准红线在单耗与碳强度模块全站前置展示；\n- **CCER 方法学**：统一采用国家标准 CMS-001（并网可再生能源）25 年生命周期衰减仿真模型。\n\n---\n\n## 🏁 四、多 Agent 验收结论与归档说明\n\n1. **视觉规范统一**：全站 55 个 HTML 文件在色彩、排版、卡片、间距、按钮与图标上达成高度一致；\n2. **交互链路闭合**：顶栏折叠、侧边栏展开、拓扑树联动、双层级视图切换完全顺畅；\n3. **技术文档同步**：本报告已归档至 `开发手册/21_全站页面样式与模块风格一致性多Agent全维检查报告.md`，并在 `README.md` 与 `html/docs.html` 中同步完成索引更新。\n"
  },
  {
    "id": "manual-22",
    "no": 22,
    "filename": "22_统计报表模块多Agent全维需求分析与高保真原型设计方案.md",
    "title": "统计报表模块多Agent全维需求分析与高保真原型设计方案",
    "category": "能耗分析与下钻模型",
    "readTime": "13 分钟",
    "wordCount": 6600,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "📌 一、模块总体定位与业务背景",
        "id": "一-模块总体定位与业务背景"
      },
      {
        "level": 2,
        "title": "👥 二、多 Agent 专家团队多维分析报告",
        "id": "二-多-agent-专家团队多维分析报告"
      },
      {
        "level": 3,
        "title": "1. 💼 产品经理与业务流分析 (Role: PM & UI/UX)",
        "id": "1-产品经理与业务流分析-role-pm-ui-ux"
      },
      {
        "level": 3,
        "title": "2. 🏛️ 系统架构与数据模型设计 (Role: Architect & Backend)",
        "id": "2-系统架构与数据模型设计-role-architect-backend"
      },
      {
        "level": 3,
        "title": "3. 🎨 前端组件与页面布局规范 (Role: Frontend & UI/UX)",
        "id": "3-前端组件与页面布局规范-role-frontend-ui-ux"
      },
      {
        "level": 3,
        "title": "4. 🛡️ 测试用例矩阵与安全防护 (Role: QA & Security)",
        "id": "4-测试用例矩阵与安全防护-role-qa-security"
      },
      {
        "level": 2,
        "title": "🖥️ 三、4 大报表原型详细设计规范与功能矩阵",
        "id": "三-4-大报表原型详细设计规范与功能矩阵"
      },
      {
        "level": 3,
        "title": "1. 📑 用能报表 (`/zero-carbon/reports/usage.html`)",
        "id": "1-用能报表-zero-carbon-reports-usage-html"
      },
      {
        "level": 3,
        "title": "2. 💰 成本报表 (`/zero-carbon/reports/cost.html`)",
        "id": "2-成本报表-zero-carbon-reports-cost-html"
      },
      {
        "level": 3,
        "title": "3. 🎯 单耗报表 (`/zero-carbon/reports/unit.html`) —— 核心产业分类",
        "id": "3-单耗报表-zero-carbon-reports-unit-html-核心产业分类"
      },
      {
        "level": 3,
        "title": "4. 🌱 碳排报表 (`/zero-carbon/reports/carbon.html`)",
        "id": "4-碳排报表-zero-carbon-reports-carbon-html"
      },
      {
        "level": 2,
        "title": "📚 四、交付与实施路线",
        "id": "四-交付与实施路线"
      }
    ],
    "content": "# 22. 统计报表模块多 Agent 全维需求分析与高保真原型设计方案\n\n---\n\n## 📌 一、模块总体定位与业务背景\n\n在特变电工（电装集团）“双中心”数字化集成平台（**零碳园区集控中心 + 产品碳足迹集采中心**）中，【统计报表模块】（包含：**用能报表、成本报表、单耗报表、碳排报表**）是全集团能源运行、财务对账、产线工单考核、碳足迹核证以及向政府/权威第三方（SGS/CQC）提交合规报告的**核心数据输出枢纽**。\n\n```mermaid\nflowchart TD\n    subgraph PlatformGuideline[\"🏛️ 平台总体设计思路\"]\n        G1[\"🏢 集团大盘视角: 宏观把控、多产业横向对比、集团汇总对账\"]\n        G2[\"🏭 企业工序视角: 产线明细、车间测点穿透、订单级单耗追溯\"]\n        G3[\"🌲 270px 经典工业级拓扑树: 工厂与用能拓扑 (3级) 全层级穿透\"]\n        G4[\"📐 统一视觉规范: 汉堡菜单一键折叠、gap-14px、rounded-xl、tabular-nums\"]\n    end\n\n    subgraph Directives[\"💡 领导最新核心指示\"]\n        D1[\"📊 按产业分类统计订单数: 变压器、线缆不同产业分别独立核算\"]\n        D2[\"🚫 严禁跨产业粗暴合并: 容量(kVA)与长度(km)物理量纲不同，分类展示\"]\n        D3[\"📉 产线线段工段穿透: 剪切/绕线/干燥/试验 vs 拉丝/绞线/交联/护套\"]\n    end\n\n    subgraph FourReports[\"📑 统计报表四大核心模块\"]\n        R1[\"1. 用能报表 (usage.html): 电/气/水/汽/折标煤 多周期时序报表\"]\n        R2[\"2. 成本报表 (cost.html): 尖峰平谷分时电价 + 绿电收益冲抵明细\"]\n        R3[\"3. 单耗报表 (unit.html): 变压器/线缆分产业订单统计 + -5%基准对比\"]\n        R4[\"4. 碳排报表 (carbon.html): ISO 14064-1 Scope 1/2/3 合规审计报表\"]\n    end\n\n    PlatformGuideline --> FourReports\n    Directives --> R3\n    Directives --> R1\n```\n\n---\n\n## 👥 二、多 Agent 专家团队多维分析报告\n\n### 1. 💼 产品经理与业务流分析 (Role: PM & UI/UX)\n\n#### (1) 集团大盘 vs 企业工序 双层级报表场景定义\n| 报表名称 | 🏢 集团全局汇总视角 (Group Level) | 🏭 企业/工厂执行视角 (Plant Level) |\n| :--- | :--- | :--- |\n| **用能报表** | 全集团 8 基地能耗总盘月报/年报、六大产业板块折标煤消费占比、重点介质（电/气/汽/水）汇总对账 | 具体工厂（如沈变本部、鲁缆本部）24小时日负荷报表、车间电表分时电量、重点耗能工段时序曲线 |\n| **成本报表** | 集团能源采购总费用、各基地度电综合加权单价、折标煤综合单价（4,834元/tce）、绿电效益横向榜 | 工厂月度电费财务对账单（尖峰平谷电量与电费分摊）、力调电费、基本电费、天然气结算单 |\n| **单耗报表** | 变压器板块（沈变/衡变/新变）与线缆板块（鲁缆/新缆/德缆）**分产业分类统计订单总数与达标率** | 单笔生产订单（如 ODFS-334MVA 或 110kV YJLW03）工段级实测能耗、标杆对标红黑榜 |\n| **碳排报表** | 集团 18.42 万吨温室气体排放月度清单、各板块 Scope 1/2/3 排放结构、ESG 权威审计打包 | 单厂季度碳盘查报表、直接化石燃烧活动水平数据表、电费发票原件凭证归档 |\n\n#### (2) 核心落实：“按产业分类统计订单数，变压器、线缆分别计算”\n* **业务矛盾**：变压器产品以容量（`kVA / MVA`）与台数（`台`）为物理交付基数；线缆产品以长度（`km`）、截面积（`mm²`）或吨位（`t`）为物理交付基数。二者物理量纲完全不可比，若简单合并求和将导致“平均单耗”失去工业指导意义。\n* **产品解决方案**：\n  1. **双产业独立工作台 Tab / 分组矩阵**：在单耗报表顶部设置 `【全部产业】`、`【变压器制造产业 (3家基地)】`、`【线缆制造产业 (3家基地)】` 快速切换；\n  2. **变压器产业专用报表列**：订单编号、客户名称、产品型号（如 SSP-840000/500）、额定容量 (MVA)、工段电耗（剪切/绕线/真空干燥/试验）、综合单耗 (`kWh/MVA` 或 `tce/台`)、总裁 -5% 达标状态；\n  3. **线缆产业专用报表列**：订单编号、工程项目名称、线缆规格（如 220kV 1×800mm²）、生产长度 (km)、工段电耗（拉丝/绞线/绝缘/成缆/护套）、综合单耗 (`kWh/km·mm²` 或 `tce/km`)、达标状态。\n\n---\n\n### 2. 🏛️ 系统架构与数据模型设计 (Role: Architect & Backend)\n\n#### (1) 报表聚合数据模型 (OLAP ClickHouse / MySQL Schema)\n\n```sql\n-- 1. 产业订单单耗报表明细表 (支持变压器/线缆分产业查询)\nCREATE TABLE tbea_report_order_unit_consumption (\n    order_id VARCHAR(64) NOT NULL COMMENT '生产订单编号',\n    industry_type ENUM('TRANSFORMER', 'CABLE', 'SWITCH', 'OTHER') NOT NULL COMMENT '产业分类: 变压器/线缆/开关',\n    company_id VARCHAR(32) NOT NULL COMMENT '归属公司: 沈变/衡变/新变/鲁缆/新缆/德缆',\n    factory_name VARCHAR(64) NOT NULL COMMENT '生产工厂名称',\n    workshop_name VARCHAR(64) NOT NULL COMMENT '生产车间',\n    product_model VARCHAR(128) NOT NULL COMMENT '产品规格型号',\n    \n    -- 变压器产业物理量\n    transformer_capacity_mva DECIMAL(10,2) DEFAULT NULL COMMENT '变压器容量 (MVA)',\n    transformer_voltage_kv DECIMAL(10,2) DEFAULT NULL COMMENT '电压等级 (kV)',\n    \n    -- 线缆产业物理量\n    cable_length_km DECIMAL(10,3) DEFAULT NULL COMMENT '线缆生产长度 (km)',\n    cable_cross_section_mm2 DECIMAL(10,2) DEFAULT NULL COMMENT '截面积 (mm2)',\n    \n    -- 工序级能耗拆解 (kWh)\n    process_stage_1_kwh DECIMAL(12,2) DEFAULT 0 COMMENT '工序1能耗(剪切/拉丝)',\n    process_stage_2_kwh DECIMAL(12,2) DEFAULT 0 COMMENT '工序2能耗(绕线/绞线)',\n    process_stage_3_kwh DECIMAL(12,2) DEFAULT 0 COMMENT '工序3能耗(真空干燥/交联绝缘)',\n    process_stage_4_kwh DECIMAL(12,2) DEFAULT 0 COMMENT '工序4能耗(总装/成缆)',\n    process_stage_5_kwh DECIMAL(12,2) DEFAULT 0 COMMENT '工序5能耗(出厂试验/护套)',\n    \n    total_energy_kwh DECIMAL(14,2) NOT NULL COMMENT '订单总耗电量 (kWh)',\n    total_energy_tce DECIMAL(10,4) NOT NULL COMMENT '订单折标煤量 (tce)',\n    unit_consumption DECIMAL(10,4) NOT NULL COMMENT '单位产品综合单耗 (kWh/MVA 或 kWh/km)',\n    baseline_target DECIMAL(10,4) NOT NULL COMMENT '去年同期基准值 (tce)',\n    target_reduction_pct DECIMAL(5,2) NOT NULL COMMENT '同比降幅 (%)',\n    audit_status ENUM('EXCELLENT', 'CONTROLLED', 'WARNING') NOT NULL COMMENT '达标评级: A超额达标/B受控/C超标预警',\n    stat_period_date DATE NOT NULL COMMENT '完工统计日期',\n    PRIMARY KEY (order_id, industry_type, stat_period_date)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='产业分类订单单耗统计报表';\n```\n\n---\n\n### 3. 🎨 前端组件与页面布局规范 (Role: Frontend & UI/UX)\n\n4 大报表页面严格沿用平台标准框架：\n1. **左侧 270px 拓扑树**：`工厂与用能拓扑 (3级) 全层级穿透`，带实时搜索与连接线，支持树节点过滤；\n2. **顶部多维复合检索过滤栏**：\n   - 统计周期：`日报` / `月报` / `季报` / `年报` 单选切换；\n   - 产业分类：`全部产业` / `变压器产业` / `线缆产业` / `成套电气`；\n   - 日期范围选择器 + 快捷查询按钮 + 批量导出（Excel / PDF / CSV）下拉菜单；\n3. **顶置核心 KPI 汇总胶囊**：显示当期汇总用能、总费用、有效订单数（分产业角标）、平均单耗与达标率；\n4. **冻结表头复杂多级数据透视表**：\n   - Sticky Header 置顶，支持水平平滑滚动；\n   - 斑马纹与悬浮高亮（`hover:bg-blue-50/50`）；\n   - 数字全面采用 `tabular-nums font-mono` 等宽排列。\n\n---\n\n### 4. 🛡️ 测试用例矩阵与安全防护 (Role: QA & Security)\n\n| 测试编号 | 业务测试场景 | 预期测试结果 | 安全与性能防护策略 |\n| :--- | :--- | :--- | :--- |\n| **TC-REP-01** | 变压器产业与线缆产业订单数量分别统计 | 变压器产业显示 48 笔（总容量 12,450 MVA），线缆产业显示 62 笔（总长度 3,840 km），不进行跨量纲数值相加 | 前端强制根据产业类型分别渲染物理单位，后端聚合 SQL 使用 `GROUP BY industry_type` |\n| **TC-REP-02** | 导出 10 万条跨周期历史报表 | 异步生成并提供进度弹窗，支持一键下载 `.xlsx` | 后端采用流式导出（Stream Export）与分片读取，防止 JVM OOM 内存溢出 |\n| **TC-REP-03** | 产线零产出 / 新投产车间单耗计算 | 报表中单耗指标安全展示为 `--` 或 `0.00` | 数据库层与计算引擎严格使用 `NULLIF(capacity, 0)` 除零防御 |\n| **TC-REP-04** | 单厂操作员查看报表权限审查 | 仅可查看本厂所属工单与报表，集团大盘与跨基地成本列自动隐藏或脱敏 | ABAC 行级数据权限网关拦截，敏感成本列自动脱敏 |\n\n---\n\n## 🖥️ 三、4 大报表原型详细设计规范与功能矩阵\n\n### 1. 📑 用能报表 (`/zero-carbon/reports/usage.html`)\n* **定位**：全厂级与介质级时序用能消费报表；\n* **表头结构**：序号、所属单位、统计周期、市电电量 (kWh)、光伏自发自用 (kWh)、绿电消纳 (kWh)、天然气 (m³)、水耗 (t)、蒸汽 (GJ)、综合能耗 (tce)、同比 (%)、环比 (%)。\n\n### 2. 💰 成本报表 (`/zero-carbon/reports/cost.html`)\n* **定位**：分时费价与综合用能账单核算报表；\n* **表头结构**：序号、所属基地、结算月份、尖峰电费 (万元)、高峰电费 (万元)、平段电费 (万元)、低谷电费 (万元)、燃气费 (万元)、水资源费 (万元)、蒸汽费 (万元)、光伏降本对冲 (万元)、净能源成本 (万元)、综合度电成本 (元/kWh)。\n\n### 3. 🎯 单耗报表 (`/zero-carbon/reports/unit.html`) —— 核心产业分类\n* **定位**：分产业分类统计订单级与产线级单耗工作台；\n* **Tab 1 变压器产业单耗报表**：\n  - 表头：订单号、基地工厂、产品型号、额定容量 (MVA)、剪切电耗、绕线电耗、干燥电耗、试验电耗、总电耗 (kWh)、单位容量单耗 (`kWh/MVA`)、折标煤 (`tce/台`)、基准线、达标评级；\n* **Tab 2 线缆产业单耗报表**：\n  - 表头：订单号、基地工厂、线缆规格、生产长度 (km)、截面 (mm²)、拉丝电耗、绞线电耗、交联电耗、护套电耗、总电耗 (kWh)、单位长度单耗 (`kWh/km`)、达标评级；\n* **Tab 3 产值单耗宏观对标**：各工厂万元产值能耗综合横向对比。\n\n### 4. 🌱 碳排报表 (`/zero-carbon/reports/carbon.html`)\n* **定位**：ISO 14064-1 标准温室气体排放清单与合规审计；\n* **表头结构**：核算周期、组织边界、Scope 1 直接化石排放 (tCO₂e)、Scope 2 外购电力排放 (tCO₂e)、Scope 3 供应链间接排放 (tCO₂e)、绿电消纳减排量 (-tCO₂e)、CCER 抵扣量 (-tCO₂e)、总净排放量 (tCO₂e)、万元产值碳强度 (tCO₂e/万元)、核查认证机构。\n\n---\n\n## 📚 四、交付与实施路线\n\n1. **第一阶段（原型落地）**：按照统一 270px 拓扑树与标准 Header/Sidebar 规范，重构 `reports/` 目录下 4 个 HTML 静态页面；\n2. **第二阶段（契约对接）**：根据上述 SQL Schema 开放 RESTful OpenAPI 3.0 数据接口，支持 Excel 模板与多维度异步导出；\n3. **第三阶段（多产业演进）**：接入 MES 订单排产系统，实时拉取变压器与线缆产线线段能耗表底，自动生成产业订单单耗报表。\n"
  },
  {
    "id": "manual-23",
    "no": 23,
    "filename": "23_能源转换工具多Agent评估与全维重构方案.md",
    "title": "能源转换工具多Agent评估与全维重构方案",
    "category": "能耗分析与下钻模型",
    "readTime": "4 分钟",
    "wordCount": 1875,
    "summary": "特变电工（电装集团）下辖 15 大现代化工业园区与 21 家重型制造基地。在“零碳园区集控中心”与“产品碳足迹集采中心”建设中，**能源转换与折标核算**是贯穿底层 SCADA 数据采集、车间月度报表填报、工序单耗考核、产品 LCA 碳足迹",
    "headings": [
      {
        "level": 2,
        "title": "1. 业务背景与重构定位",
        "id": "1-业务背景与重构定位"
      },
      {
        "level": 2,
        "title": "2. 核心功能架构",
        "id": "2-核心功能架构"
      },
      {
        "level": 2,
        "title": "3. 国标能源介质参数矩阵",
        "id": "3-国标能源介质参数矩阵"
      }
    ],
    "content": "# 📊 23_能源转换工具多Agent评估与全维重构方案\n\n## 1. 业务背景与重构定位\n\n特变电工（电装集团）下辖 15 大现代化工业园区与 21 家重型制造基地。在“零碳园区集控中心”与“产品碳足迹集采中心”建设中，**能源转换与折标核算**是贯穿底层 SCADA 数据采集、车间月度报表填报、工序单耗考核、产品 LCA 碳足迹模型以及欧盟 CBAM 碳关税申报的**基石级计算引擎**。\n\n---\n\n## 2. 核心功能架构\n\n```mermaid\ngraph TD\n    User([用户/能管员/工艺工程师]) --> ModeSelect{模式选择}\n    ModeSelect -->|模式 A| Single[⚡ 单介质快速换算器]\n    ModeSelect -->|模式 B| Batch[📊 多介质综合折标批量核算]\n    ModeSelect -->|模式 C| Dict[📖 国标折标字典速查]\n\n    Single --> S1[12+工业介质选择 + 当量/等价折标口径]\n    S1 --> S2[标煤tce / 热值MJ / 碳排tCO2 / 成本RMB 4大HUD]\n    S2 --> S3[动态数学公式推导过程展示 + 一键复制]\n\n    Batch --> B1[典型工厂车间模板装载: 沈变干燥/衡变特高压/鲁缆交联]\n    B1 --> B2[一键汇算总标煤 tce + 总碳排 tCO2 + 综合费用]\n    B2 --> B3[能耗结构占比横向分布条 + 账单明细表]\n\n    Dict --> D1[GB/T 2589-2020 官方折标系数与碳排因子]\n    D1 --> D2[分类标签筛选 + 模糊搜索]\n```\n\n---\n\n## 3. 国标能源介质参数矩阵\n\n依据 **GB/T 2589-2020《综合能耗计算通则》** 及生态环境部最新公告因子：\n\n| 能源介质名称 | 计量单位 | 低位发热量 (MJ) | 当量折标系数 (kgce) | 等价值折标系数 (kgce) | 碳排放因子 (kgCO2) | 选用依据与标准出处 |\n| :--- | :---: | :---: | :---: | :---: | :---: | :--- |\n| **电网电力 (市电)** | kWh | 3.6000 | 0.1229 | 0.3150 | 0.5703 | GB/T 2589 (当量) / 全国电网平均 |\n| **管道天然气** | m³ | 38.9310 | 1.3300 | — | 2.1622 | GB/T 2589-2020 附录 A |\n| **过热工业蒸汽 (1.6MPa)** | t | 3050.0000 | 104.1000 | — | 77.3000 | GB/T 2589-2020 焓值法测算 |\n| **饱和工业蒸汽 (0.8~1.0MPa)**| t | 2756.7000 | 94.1000 | — | 65.2000 | GB/T 2589-2020 饱和蒸汽表 |\n| **轻柴油 (生产动力)** | kg | 42.6520 | 1.4571 | — | 3.1000 | GB/T 2589-2020 表 A.1 |\n| **车用汽油** | kg | 43.0700 | 1.4714 | — | 2.9250 | GB/T 2589-2020 表 A.1 |\n| **动力原煤 / 烟煤** | kg | 20.9080 | 0.7143 | — | 1.9000 | GB/T 2589-2020 表 A.1 |\n| **工业新鲜自来水** | t | 2.5100 | 0.0857 | — | 0.1680 | 地方耗能工质折标通则 |\n| **工业软化脱盐纯水** | t | 14.2300 | 0.4857 | — | 0.9520 | 高纯水制备折标标准 |\n| **压缩空气 (0.8MPa)** | m³ | 1.1700 | 0.0400 | — | 0.0230 | 机械工业能耗统计通则 |\n| **高纯氢气 (99.999%)** | m³ | 12.7400 | 0.4350 | — | 0.0000 | 工业气体折标技术规程 |\n| **高纯氮气 (N₂)** | m³ | 1.9000 | 0.0650 | — | 0.0284 | 空分气体工质折标规范 |\n"
  },
  {
    "id": "manual-24",
    "no": 24,
    "filename": "24_碳排放因子三大维度独立维护架构设计与落地方案.md",
    "title": "碳排放因子三大维度独立维护架构设计与落地方案",
    "category": "能耗分析与下钻模型",
    "readTime": "4 分钟",
    "wordCount": 1835,
    "summary": "在特变电工（电装集团）“零碳园区集控中心”与“产品碳足迹集采中心”中，**碳排放因子与折标煤系数**是全厂组织碳排放核算 (Scope 1 / Scope 2 / Scope 3) 以及产品 LCA 碳足迹计算（ISO 14067 / CB",
    "headings": [
      {
        "level": 2,
        "title": "1. 业务背景与重构定位",
        "id": "1-业务背景与重构定位"
      },
      {
        "level": 2,
        "title": "2. 核心架构与功能矩阵",
        "id": "2-核心架构与功能矩阵"
      },
      {
        "level": 2,
        "title": "3. 核心参数标准基准矩阵",
        "id": "3-核心参数标准基准矩阵"
      },
      {
        "level": 3,
        "title": "3.1 省级电网电力碳排放因子精选（特变电工核心园区所在省份）",
        "id": "3-1-省级电网电力碳排放因子精选-特变电工核心园区所在省份"
      }
    ],
    "content": "# 📊 24_碳排放因子三大维度独立维护架构设计与落地方案\n\n## 1. 业务背景与重构定位\n\n在特变电工（电装集团）“零碳园区集控中心”与“产品碳足迹集采中心”中，**碳排放因子与折标煤系数**是全厂组织碳排放核算 (Scope 1 / Scope 2 / Scope 3) 以及产品 LCA 碳足迹计算（ISO 14067 / CBAM 碳关税）的核心基准参数。\n\n针对业务要求，系统将【碳排放因子】配置模块划分为**三大独立维护板块**：\n1. ⚡ **省级区域电网电力碳排放因子**（支持全国 31 省级电网独立配置、特变电工 8 大产业基地重点标记、绿电 0 排放核算）\n2. 🔥 **化石与热力能源碳排放因子**（天然气、轻柴油、汽油、原煤、焦炭、工业蒸汽等实物因子、发热量、含碳量与氧化率）\n3. ⚖️ **能源折标准煤系数库 (GB/T 2589-2020)**（国家标准官方折标系数、低位发热量基准、当量值与等价值双口径）\n\n---\n\n## 2. 核心架构与功能矩阵\n\n```mermaid\ngraph TD\n    Root[碳排放因子中枢管理 /zero-carbon/config/factor] --> Tab1[⚡ 1. 省级电网电力碳排放因子]\n    Root --> Tab2[🔥 2. 化石与热力能源碳排放因子]\n    Root --> Tab3[⚖️ 3. 能源折标准煤系数库 GB/T 2589]\n\n    Tab1 --> T1_1[31个省份独立维护 + 8大特变电工园区基地标记]\n    Tab1 --> T1_2[综合电力因子 tCO2/MWh + 化石电力因子 + 绿电 0.0000 规则]\n    Tab1 --> T1_3[大区电网筛选: 华北/东北/华东/华中/西北/西南/南方]\n\n    Tab2 --> T2_1[9大类燃料与热力: 气/油/煤/焦炭/过热与饱和蒸汽]\n    Tab2 --> T2_2[实物碳排因子 tCO2/单位 + 低位发热量 MJ + 含碳量 tC/TJ + 氧化率 %]\n\n    Tab3 --> T3_1[GB/T 2589-2020 官方折标当量/等价值系数]\n    Tab3 --> T3_2[电力当量 1229 kgce/万kWh ⇄ 供电等价值 3150 kgce/万kWh]\n```\n\n---\n\n## 3. 核心参数标准基准矩阵\n\n### 3.1 省级电网电力碳排放因子精选（特变电工核心园区所在省份）\n| 省份 / 区域电网 | 所属大区 | 特变电工基地 | 综合电力碳排因子 (tCO2/MWh) | 化石电力因子 (tCO2/MWh) | 绿电核算因子 | 发布依据与来源出处 |\n| :--- | :---: | :---: | :---: | :---: | :---: | :--- |\n| **新疆维吾尔自治区** | 西北 | 昌吉园区/超高压新变 | **0.5312** | 0.7950 | 0.0000 | 国家生态环境部最新区域电网公告 |\n| **辽宁省** | 东北 | 沈阳变压器/开关园区 | **0.5840** | 0.8320 | 0.0000 | 东北区域电网省级排放基准 |\n| **湖南省** | 华中 | 衡阳变压器/电缆园区 | **0.5120** | 0.7890 | 0.0000 | 华中区域电网湖南省电力碳足迹因子 |\n| **山东省** | 华东 | 新泰鲁缆工业基地 | **0.6210** | 0.8650 | 0.0000 | 华东区域电网省级电力排放因子公告 |\n| **四川省** | 西南 | 德阳线缆/变压器基地 | **0.1820** | 0.6210 | 0.0000 | 西南高比例清洁水电网发布因子 |\n| **陕西省** | 西北 | 西安变压器/套管基地 | **0.5630** | 0.8140 | 0.0000 | 西北电网省级排放基准公告 |\n| **天津市** | 华北 | 天津变压器制造园区 | **0.5980** | 0.8410 | 0.0000 | 华北区域电网京津冀电力基准 |\n| **全国平均电网** | 全国 | 全局缺省基准 | **0.5703** | 0.8120 | 0.0000 | 生态环境部最新全国电力排放因子公告 |\n"
  },
  {
    "id": "manual-25",
    "no": 25,
    "filename": "25_零碳项目评估多Agent全维重构与落地方案.md",
    "title": "零碳项目评估多Agent全维重构与落地方案",
    "category": "能耗分析与下钻模型",
    "readTime": "5 分钟",
    "wordCount": 2705,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "🎯 业务背景与模块演进",
        "id": "业务背景与模块演进"
      },
      {
        "level": 2,
        "title": "🏗️ 四大二级模块核心规范",
        "id": "四大二级模块核心规范"
      },
      {
        "level": 3,
        "title": "1. 项目档案管理 (`/zero-carbon/project/archive`)",
        "id": "1-项目档案管理-zero-carbon-project-archive"
      },
      {
        "level": 3,
        "title": "2. 模型管理 (`/zero-carbon/project/model`)",
        "id": "2-模型管理-zero-carbon-project-model"
      },
      {
        "level": 3,
        "title": "3. 实时监控与项目效益评估 (`/zero-carbon/project/benefit`)",
        "id": "3-实时监控与项目效益评估-zero-carbon-project-benefit"
      },
      {
        "level": 3,
        "title": "4. 零碳园区自评估 (`/zero-carbon/project/self`)",
        "id": "4-零碳园区自评估-zero-carbon-project-self"
      },
      {
        "level": 2,
        "title": "🌐 页面路由与菜单对齐",
        "id": "页面路由与菜单对齐"
      }
    ],
    "content": "# 📋 开发手册 25 · 零碳项目评估四大模块多Agent全维重构与落地方案\n\n---\n\n## 🎯 业务背景与模块演进\n\n特变电工“双中心”数字化集成平台（电装集团）正式将原“零碳项目与减排”模块升级重构为 **【零碳项目评估 (Zero-Carbon Project Evaluation)】**。\n重构后的系统由静态台账记录升级为贯穿 **“项目档案建档 ➔ 评估模型算法维护 ➔ 实时运行工况与效益核算 ➔ 17 园区五维自评估与星级评定”** 的全生命周期闭环体系。\n\n---\n\n## 🏗️ 四大二级模块核心规范\n\n### 1. 项目档案管理 (`/zero-carbon/project/archive`)\n* **业务定位**：全集团零碳投资与减排项目的统一数字化项目库。\n* **核心功能**：\n  - **在线申报与建档**：各项目公司在线填报项目基本信息、技术主类（分布式光伏、用户侧储能、工业余热利用、变频与电机技改、地源热泵、智慧微网）、装机容量与投资额（CapEx）、里程碑节点（立项、开工、并网日）、预期年节能量、预期年减碳量及预期收益；\n  - **附件资料管理**：支持上传可研报告、电网并网批复、EPC 合同、竣工验收单等附件；\n  - **全集团统一项目库**：支持多维筛选（园区、技术类型、建设状态）、模糊搜索、列表/卡片双视图切换、一键导出 Excel；\n  - **项目详情穿透**：项目全生命周期里程碑时间轴、财务参数仪表板及附件打包下载。\n\n### 2. 模型管理 (`/zero-carbon/project/model`)\n* **业务定位**：零碳评估与核算的算法大脑与参数调优中心。\n* **双模型体系**：\n  - **实时监控计算模型**：分布式光伏 IEC 61724 衰减模型、电化学储能 LCOS 度电成本模型、工业余热利用 GB/T 2589 焓值折标模型、智慧微电网 EMS 负荷平衡模型；\n  - **经济效益评估模型**：全生命周期折现现金流模型、内部收益率 IRR（自适应牛顿-拉夫逊迭代求解）、动态投资回收期 $P_t$ 模型、边际减排成本 MACC 模型；\n* **参数与权重配置**：支持配置基准折现率（6.0%）、经济寿命（25年）、运维费率（1.5%）、内部碳定价（85元/吨）、AHP 综合评分权重（经济节费 40% + 减碳量 30% + IRR 20% + 稳定性 10%）；\n* **版本管理与历史回溯**：模型多版本发布（v1.0/v2.0/v2.1）、版本参数横向 Diff 比对、一键秒级回退（Rollback）。\n\n### 3. 实时监控与项目效益评估 (`/zero-carbon/project/benefit`)\n* **业务定位**：实时监控零碳项目运行体征与动态财务/环保双轮投资回报。\n* **核心功能**：\n  - **自定义周期动态核算**：支持按日、月度、季度、年度自定义核算周期，自动计算光伏、储能、余热、热泵等项目的实际发电/节电量、节费金额、峰谷套利收益及核证碳减排量；\n  - **双轮效益看板**：24小时实时监控出力与负荷平衡曲线（光伏出力 / 储能充放 / 综合节费）；\n  - **全集团 MACC 阶梯排序**：横向排序展示各技术路线单位减碳成本（$/tCO_2$），辅助集团管理层投资决策；\n  - **项目级经济性对标明细**：实测修正 IRR、投资回本进度（如“已回本 1.8 年 / 预计 4.8 年”）、运行健康度评级与调优建议。\n\n### 4. 零碳园区自评估 (`/zero-carbon/project/self`)\n* **业务定位**：17 个零碳产业园区建设进度的数字化自评工作台与星级评定中枢。\n* **五维评估指标体系 (100分制)**：\n  1. ⚡ **能源结构清洁化 (30分)**：分布式光伏覆盖率、绿电采购消纳比、工业电气化替代；\n  2. 🏭 **生产能效与降碳 (25分)**：一级能效电机普及率、余热利用系统投运、单位产品能耗先进标杆；\n  3. 🔋 **智慧微网与储能 (20分)**：用户侧储能配置、双中心集控 100% 在线接入、EMS 柔性负荷控制；\n  4. 🌿 **碳中和抵销机制 (15分)**：ISO 14064 组织级核查、GEC 绿证全额核销、ISO 14067 产品碳足迹认证；\n  5. 🏢 **绿色运营与管理 (10分)**：双碳考核专岗机制、低碳物流与叉车电动化；\n* **星级认证预评级划分**：\n  - ⭐️⭐️⭐️⭐️⭐️ **五星·卓越领跑园区 (95~100分)**\n  - ⭐️⭐️⭐️⭐️ **四星·近零碳标杆园区 (85~94分)**\n  - ⭐️⭐️⭐️ **三星·低碳先行园区 (75~84分)**\n  - ⭐️⭐️ **二星·基础低碳园区 (60~74分)**\n* **实测能碳数据自动挂接**：自动拉取园区绿电消纳率、单位产值能耗与自动采集率，客观项自动核算，主观项支持在线勾选，实时生成五维雷达图与 AI 晋级改造建议。\n\n---\n\n## 🌐 页面路由与菜单对齐\n\n| 菜单层级 | 路由路径 | 页面顶栏主标题 `h1` | 关联组件 |\n| :--- | :--- | :--- | :--- |\n| **一级菜单** | `/zero-carbon/project` | **零碳项目评估** | `lib/nav-config.ts` |\n| ├── 子菜单 1 | `/zero-carbon/project/archive` | **项目档案管理** | `app/zero-carbon/project/archive/page.tsx` |\n| ├── 子菜单 2 | `/zero-carbon/project/model` | **模型管理** | `app/zero-carbon/project/model/page.tsx` |\n| ├── 子菜单 3 | `/zero-carbon/project/benefit` | **实时监控与项目效益评估** | `app/zero-carbon/project/benefit/page.tsx` |\n| └── 子菜单 4 | `/zero-carbon/project/self` | **零碳园区自评估** | `app/zero-carbon/project/self/page.tsx` |\n"
  },
  {
    "id": "manual-26",
    "no": 26,
    "filename": "26_零碳项目档案与在线监测统计报表多Agent深度优化与落地方案.md",
    "title": "零碳项目档案与在线监测统计报表多Agent深度优化与落地方案",
    "category": "能耗分析与下钻模型",
    "readTime": "5 分钟",
    "wordCount": 2718,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "一、 优化背景与核心诉求",
        "id": "一-优化背景与核心诉求"
      },
      {
        "level": 2,
        "title": "二、 核心架构设计与领域模型",
        "id": "二-核心架构设计与领域模型"
      },
      {
        "level": 3,
        "title": "2.1 零碳项目统一档案库数据模型 (Project Archive Domain)",
        "id": "2-1-零碳项目统一档案库数据模型-project-archive-domain"
      },
      {
        "level": 2,
        "title": "三、 质量保障与测试验收",
        "id": "三-质量保障与测试验收"
      }
    ],
    "content": "# 26. 零碳项目档案与集中监管统计报表多 Agent 深度优化与落地方案\n\n> **版本**：v1.0.1  \n> **更新时间**：2026-08-28  \n> **责任团队**：多 Agent 联合工程组 (PM + UI/UX + Architect + Frontend + Backend + QA + Security + DevOps)  \n> **关联模块**：\n> - `集中监管 > 指标管控` (`/zero-carbon/monitor/indicator`)\n> - `集中监管 > 在线监测` (`/zero-carbon/monitor/online/microgrid`)\n> - `集中监管 > 能源碳排放监测` (`/zero-carbon/monitor/carbon-emission`)\n> - `零碳项目评估 > 项目档案管理` (`/zero-carbon/project/archive`)\n> - `统计报表` (`/zero-carbon/reports/*`)\n\n---\n\n## 一、 优化背景与核心诉求\n\n根据项目评审与客户最新反馈，系统进行了 6 大维度的深度重构与工业级标准化升级：\n1. **指标参数严格对齐**：集团层级管控卡片 10 项参数与二三级卡片参数及顺序 100% 保持完全一致；\n2. **在线监测高频台账**：移除原并网点卡片，升级为 15 分钟粒度高频连续采样数据明细台账（含多通道筛选、点位搜索、充放电状态与 Excel 导出）；\n3. **能源碳排放监测中部图表**：嵌入全集团近 12 个月碳排放时序折线走势图与 7 大直属制造单位综合用能及碳排对标柱状图；\n4. **导航精简**：隐藏左侧导航中的「能源碳排放管理」一级模块，提升菜单结构聚焦度；\n5. **项目档案管理重构**：\n   - 支持各项目公司在线填报项目基本信息、节能技改、绿电替代、储能配置、投资与容量、关键节点日期、预期减排及收益，并上传相关附件；\n   - 移除左侧组织结构树，页面采用 100% 全屏宽幅自适应布局；\n   - 移除主表格「附件档案」列，保持表格紧凑清爽；\n   - 详情查看弹窗与在线填报向导弹窗升级为 `max-w-5xl` 宽幅 Bento 架构，移除冗余副标题，规范技术类别图标；\n6. **统计报表标题统一**：用能报表、成本报表、单耗报表、碳排报表 4 大页面顶部 Header 全线对齐项目统一标准设计规范。\n\n---\n\n## 二、 核心架构设计与领域模型\n\n### 2.1 零碳项目统一档案库数据模型 (Project Archive Domain)\n\n```typescript\nexport interface ProjectArchiveItem {\n  id: string\n  code: string                               // 项目统一编码 (PRJ-2026-PV-001)\n  name: string                               // 项目全称\n  park: string                               // 所属零碳产业园区\n  company: string                            // 实施经营单位\n  category: '节能技改' | '绿电替代' | '储能配置' | '智慧微网'  // 4 大零碳主类\n  subType: string                            // 细分技术路线\n  capacity: string                           // 装机容量 (MWp / MWh / t / 台套)\n  investment: number                         // 总投资额 (万元)\n  fundSource: '自筹资金' | '绿色金融信贷' | 'EMC合同能源管理' | '政府专项绿色补贴'\n  leaderName: string                         // 责任人\n  leaderPhone: string                        // 联系电话\n  milestoneApproval: string                  // 批复立项日期\n  milestoneStart: string                     // 现场开工日期\n  milestoneGrid: string                      // 并网投运日期\n  expectedEnergySaving: string               // 年节电/发电量描述\n  annualCarbonSaving: number                 // 年减碳量 (tCO2/年)\n  annualRevenue: number                      // 年收益/节费 (万元/年)\n  paybackYears: number                       // 静态回收期 (年) = 投资额 / 年收益\n  irr: string                                // 预期内部收益率\n  status: '规划批复' | '在建施工' | '并网稳定运行' | '维护优化'\n  attachments: { name: string; size: string; type: string; uploadTime: string }[]\n  remark?: string                            // 技术方案与消纳策略\n}\n```\n\n---\n\n## 三、 质量保障与测试验收\n\n- **路由构建验证**：全项目 61 个静态路由经 Next.js 生产环境构建编译通过（0 Errors, 0 Warnings）；\n- **响应式布局测试**：宽屏与笔记本自适应（100% Full-width），支持局域网设备无缝访问；\n- **计算逻辑验证**：投资回收期计算容错防 `NaN` / `Infinity`，多维筛选状态下 4 大 KPI 毫秒级自动聚合更新。\n"
  },
  {
    "id": "manual-27",
    "no": 27,
    "filename": "27_单位产值能耗与对标管理多Agent全维重构与落地方案.md",
    "title": "单位产值能耗与对标管理多Agent全维重构与落地方案",
    "category": "能耗分析与下钻模型",
    "readTime": "8 分钟",
    "wordCount": 3844,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "🎯 一、 业务背景与重构目标",
        "id": "一-业务背景与重构目标"
      },
      {
        "level": 2,
        "title": "🤖 二、 8 大角色多 Agent 需求与架构设计方案",
        "id": "二-8-大角色多-agent-需求与架构设计方案"
      },
      {
        "level": 3,
        "title": "2.1 PM (产品经理) 视角：业务价值与指标口径",
        "id": "2-1-pm-产品经理-视角-业务价值与指标口径"
      },
      {
        "level": 3,
        "title": "2.2 UI/UX 设计师视角：视觉动效与交互体验",
        "id": "2-2-ui-ux-设计师视角-视觉动效与交互体验"
      },
      {
        "level": 3,
        "title": "2.3 前端与架构工程师视角：组件设计与状态驱动",
        "id": "2-3-前端与架构工程师视角-组件设计与状态驱动"
      },
      {
        "level": 2,
        "title": "📊 三、 核心页面重构明细与路由清单",
        "id": "三-核心页面重构明细与路由清单"
      },
      {
        "level": 2,
        "title": "🧪 四、 测试与质量验证标准 (QA)",
        "id": "四-测试与质量验证标准-qa"
      },
      {
        "level": 2,
        "title": "🚀 五、 生产部署与验证 (DevOps)",
        "id": "五-生产部署与验证-devops"
      }
    ],
    "content": "# 📘 27. 单位产值能耗与对标管理多Agent全维重构与落地方案\n\n> **版本**：v2.0.0  \n> **更新日期**：2026-08-29  \n> **涉及核心模块**：`单位产值能耗 (/zero-carbon/energy/unit-output)`、`对标管理 (/zero-carbon/energy/benchmark)`、`用能结构 (/zero-carbon/energy/structure)`、`能源成本 (/zero-carbon/energy/cost)`  \n> **协同团队**：PM、UI/UX、架构师、前端开发、后端引擎、QA、安全合规、DevOps\n\n---\n\n## 🎯 一、 业务背景与重构目标\n\n为了贯彻落实特变电工集团数字化与国家级零碳工厂建设指导方针，统一全集团与各下属经营单位、项目公司的能效对标管控口径，本次重构重点针对 **「单位产值能耗」** 与 **「对标管理」** 两大核心能效分析系统进行了全链路升级：\n\n1. **单位产值能耗全介质动态穿透**：根据所选组织节点的实际能源结构，自适应动态渲染其拥有的能源介质（综合能耗、电耗、蒸汽、天然气、水耗），支持点击卡片即时联动近12个月、近12个季度、近3年历史趋势及同比变化，并支持集团6家单位与经营单位下属项目公司的多级列表透视。\n2. **对标管理体系标准化与国家级零碳工厂对标**：\n   - 统一四大维度 Tab 命名：**核心指标对比**、**产品单耗对比**、**关键工序单耗对比**、**基准管理**；\n   - 建设**国家级零碳工厂核心指标横向对比体系**（单位能耗碳排放、非化石能源消费占比、非化石能源电力消费物理认定电量占比），直观标定国家门槛基准线与特变电工集团均值线；\n   - 建立**核心管控指标排名大盘**，对全集团 19 家项目公司/制造车间按单位产值能耗及工业增加值能耗进行综合排名与同比分析；\n   - 统一全站顶部自适应多维度时间筛选组件与操作规范。\n\n---\n\n## 🤖 二、 8 大角色多 Agent 需求与架构设计方案\n\n```mermaid\ngraph TB\n    subgraph MultiAgent[\"🤖 8大角色多Agent协同矩阵\"]\n        PM[\"📋 PM 产品经理<br/>业务需求与管控口径标准化\"]\n        UIUX[\"🎨 UI/UX 设计师<br/>卡片联动与柱状图对标可视化\"]\n        Arch[\"🏛️ 技术架构师<br/>组织拓扑与动态多介质契约\"]\n        FE[\"💻 前端工程师<br/>Next.js 16 + Recharts响应式图表\"]\n        BE[\"⚙️ 后端工程师<br/>多周期聚合与零碳工厂指标算法\"]\n        QA[\"🧪 QA 质量测试<br/>边界值与多层级组织联动验证\"]\n        Sec[\"🛡️ 安全工程师<br/>组织越权隔离与安全校验\"]\n        DevOps[\"🚀 DevOps 运维<br/>静态优化与云端平滑部署\"]\n    end\n\n    PM --> Arch\n    UIUX --> FE\n    Arch --> BE\n    FE --> QA\n    BE --> QA\n    QA --> Sec\n    Sec --> DevOps\n```\n\n### 2.1 PM (产品经理) 视角：业务价值与指标口径\n* **单位产值能耗**：\n  * 集团层级：展示全集团万元产值综合能耗及电、汽、气、水各介质单耗，横向下钻展示 6 家主要二级经营单位数据与同比；\n  * 经营单位层级：展示该单位所拥有介质单耗，并展示其下属项目公司数据与同比；\n  * 项目公司层级：展示该具体工厂的单耗数据与多周期演变趋势。\n* **对标管理**：\n  * 国家级零碳工厂三大门槛：单位能耗碳排放（≤ 1.80 tCO₂/tce）、非化石能源消费占比（≥ 35.0%）、非化石电力物理认定占比（≥ 30.0%）；\n  * 核心管控指标排名：对 19 家项目公司的产值能耗及增加值能耗进行横向 PK 与升降序对标。\n\n### 2.2 UI/UX 设计师视角：视觉动效与交互体验\n* **卡片联动高亮**：顶部 KPI 卡片采用 `border-2 border-[#1677ff] ring-2 ring-[#1677ff]/20` 激活态与呼吸圆点动效，点击即时切换趋势图与数据；\n* **清晰图表基准线**：柱状图直观标注红色国家门槛虚线与蓝色集团均值实线，柱体按达标情况自适应呈现高饱和蓝/警戒橙；\n* **统一顶部工具栏**：采用月度（起止月份选择）、季度（下拉选择）、年度（下拉选择）三大自适应时间维度，右侧精简导出按钮。\n\n### 2.3 前端与架构工程师视角：组件设计与状态驱动\n* **组件化组织树**：统一复用 `<StandardOrgTree />`，精准同步选中的组织节点 `level: 'group' | 'company' | 'workshop'`；\n* **响应式 Recharts 图表**：使用 `<ResponsiveContainer />` + `<BarChart />`，通过自定义 `Cell` 渲染柱体颜色，并注入 `<ReferenceLine />` 展示对标基准；\n* **强类型数据结构**：\n  ```typescript\n  interface ProjectCompanyBenchmark {\n    id: string\n    name: string\n    parentCompany: string\n    carbonPerTce: number\n    nonFossilRatio: number\n    physicalGreenRatio: number\n    unitOutputTce: number\n    unitOutputYoy: string\n    unitAddedValueTce: number\n    unitAddedValueYoy: string\n  }\n  ```\n\n---\n\n## 📊 三、 核心页面重构明细与路由清单\n\n| 页面路径 | 模块名称 | 核心重构与升级要点 |\n| :--- | :--- | :--- |\n| `/zero-carbon/energy/unit-output` | **单位产值能耗** | 1. 动态按单位拥有介质渲染万元产值卡片<br/>2. 点击卡片同步联动趋势图（近12月/近12季/近3年）<br/>3. 集团展示6家单位、经营单位展示下属项目公司列表 |\n| `/zero-carbon/energy/benchmark` | **对标管理** | 1. 规范 4 大 Tab 名称<br/>2. 国家级零碳工厂核心 3 大指标横向柱状图对标与基准线<br/>3. 核心管控指标排名清单（19家项目公司产值能耗/增加值能耗及同比）<br/>4. 统一右上角时间筛选组件与精简导出按钮 |\n| `/zero-carbon/energy/structure` | **用能结构分析** | 1. 顶部时间筛选组件与指标管控规范统一<br/>2. 导出按钮文案精简为“导出”<br/>3. 移除冗余状态胶囊与边框 |\n| `/zero-carbon/energy/cost` | **能源成本分析** | 1. 顶部时间筛选组件与指标管控规范统一<br/>2. 导出按钮文案精简为“导出”<br/>3. 移除冗余说明模块与状态标签 |\n\n---\n\n## 🧪 四、 测试与质量验证标准 (QA)\n\n1. **多组织节点切换测试**：\n   - 选中“特变电工集团”：卡片展示综合能耗、电耗、蒸汽、天然气、水耗 5 大卡片，表格展示 6 家二级单位；\n   - 选中“德缆公司”：自动过滤蒸汽与天然气卡片（因德缆为纯电拉丝），仅展示综合能耗、电耗与水耗；\n   - 选中项目公司（如“超高压公司”）：隐藏下属表格，聚焦该车间历史趋势与指标明细。\n2. **多周期趋势联动测试**：\n   - 点击“万元产值电耗”卡片 ➔ 趋势图标题切换为“万元产值电耗变化趋势”，单位变为 `kWh/万元`，折线数据与最新期值精确对应；\n   - 切换“近12个季度”/“近3年” ➔ X 轴与折线点平滑刷新。\n3. **零碳工厂柱状图对标测试**：\n   - 切换 3 大指标卡片，柱状图横坐标列出 19 家项目公司实测值，门槛线与均值线位置准确计算且 Tooltip 完整显示。\n\n---\n\n## 🚀 五、 生产部署与验证 (DevOps)\n\n1. **本地生产构建**：\n   ```bash\n   npm run build\n   ```\n   * 验证全量 60 个静态路由编译 100% 通过（Exit Code 0）。\n2. **线上发布**：\n   * 静态资源发布至云服务器 `/var/www/tbea-nengtan`；\n   * Nginx 平滑重载，生产入口 `http://8.215.89.194:3000` 实时生效。\n"
  },
  {
    "id": "manual-28",
    "no": 28,
    "filename": "28_企业产品与消耗能源工序对应规范手册.md",
    "title": "企业产品与消耗能源工序对应规范手册",
    "category": "能耗分析与下钻模型",
    "readTime": "12 分钟",
    "wordCount": 5935,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "一、 全景总览与领域界限定义",
        "id": "一-全景总览与领域界限定义"
      },
      {
        "level": 2,
        "title": "二、 生产单位、产品、产品类型与消耗能源完整对应矩阵表",
        "id": "二-生产单位-产品-产品类型与消耗能源完整对应矩阵表"
      },
      {
        "level": 2,
        "title": "三、 产品单耗与工序能源匹配设计准则",
        "id": "三-产品单耗与工序能源匹配设计准则"
      },
      {
        "level": 3,
        "title": "1. 为什么线缆产业不呈现蒸汽？",
        "id": "1-为什么线缆产业不呈现蒸汽"
      },
      {
        "level": 3,
        "title": "2. 为什么变压器产业重点呈现电与蒸汽？",
        "id": "2-为什么变压器产业重点呈现电与蒸汽"
      },
      {
        "level": 2,
        "title": "四、 版本修订记录",
        "id": "四-版本修订记录"
      }
    ],
    "content": "# 🏭 企业、产品、产品类型与消耗能源工序对应规范手册\n\n> **依据文件**：`《生产单位与涉及关键工序对应表(1).et》` (双中心数据需求最新权威基准 2026-08-29)  \n> **适用范围**：零碳园区集控中心、能耗能效分析、单位产品能耗、工序单耗对标、指标管控计算引擎\n\n---\n\n## 一、 全景总览与领域界限定义\n\n在特变电工电装集团能碳双中心平台中，各制造企业（一级经营单位与二级项目公司）所生产的产品存在明确的**产品大类**、**细分产品类型**、**核心热/电制造工序**与**主要消耗能源介质**的强对应约束：\n\n1. **变压器产业（特高压/中低压）**：\n   - 核心工艺为**真空热干燥 / 固化**与**高压耐压试验**；\n   - 必须重点核算 **【电力】** 与 **【工业蒸汽】** 两大主流介质，辅以 **【天然气】**（发生炉/采暖）与 **【工艺新鲜水】**（试压冷却）。\n2. **线缆产业（超高压/中低压/特缆）**：\n   - 核心工艺为**铜铝连铸拉丝**与**干法悬垂立塔交联**；\n   - 必须重点核算 **【电力】** 与 **【高纯工艺氮气】**（绝缘保护介质）；\n   - **⚠️ 核心判定原则**：线缆全制造流程**无蒸汽消耗**，在数据采集、指标核算、卡片展示与明细台账中，必须严格自适应隐藏蒸汽指标。\n3. **关键配套部件及成套电气产业（开关柜、GIS、电抗器、电容器、GIL、套管、互感器、铁芯）**：\n   - 以机械加工、钣金涂装、真空浸渍、绝缘绕制为主，主要消耗 **【电力】**，部分特殊干燥/浸渍工序（如互感器）消耗 **【蒸汽】**。\n\n---\n\n## 二、 生产单位、产品、产品类型与消耗能源完整对应矩阵表\n\n| 行号 | 一级单位 | 二级项目公司 | 所属产品大类 | 主要产品与规格细分 | 涉及关键制造工序 | **工序主要消耗能源** | **管控与核算对应指标** | 业务核算与展示规则 |\n| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n| 1 | **沈变公司** | **沈变本部** | 变压器产业 | **变压器-高压** (500kV/220kV/110kV) | ① 变压器-高压-干燥<br/>② 变压器-试验 | **电力、蒸汽**<br/>*(试验仅耗电)* | ① 单位产值综合能耗 (`tce/万元`)<br/>② 单位产值电耗 (`kWh/万元`)<br/>③ 单位产值蒸汽消耗 (`t/万元`)<br/>④ 单位产量综合能耗 (`tce/万kVA` · `tce/台`)<br/>⑤ 单位产量电耗 (`kWh/kVA`)<br/>⑥ 单位产量蒸汽消耗 (`t/台`) | 气相干燥需计量煤油气相热蒸汽；试验工位独立装设电度表 |\n| 2 |  | 和新套管公司 | 电气配套部件 | **套管** (高压/特高压套管) | ① 套管-干燥 | **电力** | ① 单位产值电耗 (`kWh/万元`) | 烘箱电加热干燥，无蒸汽消耗 |\n| 3 |  | 康嘉互感器 | 电气配套部件 | **互感器** (电流/电压互感器) | ① 互感器-干燥<br/>② 变压器-试验 | **电力、蒸汽**<br/>*(试验仅耗电)* | ① 单位产值综合能耗<br/>② 单位产值电耗<br/>③ 单位产值蒸汽消耗 | 环氧浇注与干燥罐消耗蒸汽 |\n| 4 | **衡变公司** | **衡变本部** | 变压器产业 | **变压器-高压** (1000kV/500kV/220kV) | ① 变压器-高压-干燥<br/>② 变压器-试验 | **电力、蒸汽**<br/>*(试验仅耗电)* | ① 单位产值/产量综合能耗<br/>② 单位产值/产量电耗<br/>③ 单位产值/产量蒸汽消耗 | 包含百万伏特高压干燥罐，蒸汽计量主表接入 SCADA |\n| 5 |  | **湖南电气** | 变压器产业 | **变压器-高压** (220kV/110kV) | ① 变压器-高压-干燥<br/>② 变压器-试验 | **电力、蒸汽** | ① 单位产值/产量综合能耗<br/>② 单位产值/产量电耗<br/>③ 单位产值/产量蒸汽消耗 | 变压器主产线标准配置 |\n| 6 |  | **特能建** | 变压器产业 | **变压器-高压** (新能源升压变) | ① 变压器-高压-干燥<br/>② 变压器-试验 | **电力、蒸汽** | ① 单位产值/产量综合能耗<br/>② 单位产值/产量电耗<br/>③ 单位产值/产量蒸汽消耗 | 新能源集成与升压变总装 |\n| 7 |  | 云集电气 | 成套开关设备 | **中低压开关柜** (KYN/GGD) | ① 钣金加工<br/>② 钣金喷涂 | **电力** | ① 单位产值电耗 (`kWh/万元`) | 数控冲剪与静电喷涂线电耗 |\n| 8 |  | 新疆自控 | 成套开关设备 | **中低压开关柜** (配电自控柜) | ① 钣金加工<br/>② 钣金喷涂 | **电力** | ① 单位产值电耗 (`kWh/万元`) | 钣金成型与烘道电力消耗 |\n| 9 |  | 云集高压开关 | 特高压开关 | **GIS** (气体绝缘金属封闭开关) | ① GIS-抽真空<br/>② GIS-绝缘件干燥<br/>③ GIS-工频耐压试验<br/>④ GIS-空调恒温除湿 | **电力** | ① 单位产值电耗 (`kWh/万元`) | 恒温恒湿净化车间空调电耗占比较高 |\n| 10 |  | 合容电气股份 | 特种电气装备 | **干式电抗器** (空心/铁心电抗器) | ① 干式电抗器-固化<br/>② 干式电抗器-试验 | **电力** | ① 单位产值电耗 (`kWh/万元`) | 电加热固化炉，主耗电力 |\n| 11 |  | 合容电力设备 | 特种电气装备 | **电容器** (高压并联电容器) | ① 芯子卷绕<br/>② 真空浸渍<br/>③ 喷漆<br/>④ 试验 | **电力** | ① 单位产值电耗 (`kWh/万元`) | 真空浸渍电加热与净化恒温 |\n| 12 |  | 赛杰爱迪 | 特高压输电装备 | **GIL** (气体绝缘输电线路) | ① 螺旋焊管生产<br/>② 绝缘子生产<br/>③ 测试 | **电力** | ① 单位产值电耗 (`kWh/万元`) | 铝合金管道焊接与绝缘件成型 |\n| 13 | **新变厂** | **超高压公司** | 变压器产业 | **变压器-高压** (750kV/500kV/220kV) | ① 变压器-高压-干燥<br/>② 变压器-试验 | **电力、蒸汽** | ① 单位产值/产量综合能耗<br/>② 单位产值/产量电耗<br/>③ 单位产值/产量蒸汽消耗 | 西北输变电中心主体制造厂区 |\n| 14 |  | **天变公司** | 变压器产业 | **变压器-中低压-干变** (SCB系列) | ① 干变-固化<br/>② 变压器-试验 | **电力、蒸汽** | ① 单位产值/产量综合能耗<br/>② 单位产值/产量电耗<br/>③ 单位产值/产量蒸汽消耗 | 环氧浇注树脂高温固化工序 |\n| 15 |  | **智能电气公司** | 变压器产业 | **变压器-中低压-干变** (配网干变) | ① 干变-固化<br/>② 变压器-试验 | **电力、蒸汽** | ① 单位产值/产量综合能耗<br/>② 单位产值/产量电耗<br/>③ 单位产值/产量蒸汽消耗 | 智能化配电变压器装配区 |\n| 16 |  | **京津冀公司** | 变压器产业 | **变压器-中低压-油变** (SZ系列) | ① 油变-干燥<br/>② 变压器-试验 | **电力、蒸汽** | ① 单位产值/产量综合能耗<br/>② 单位产值/产量电耗<br/>③ 单位产值/产量蒸汽消耗 | 华北油浸配电变压器制造区 |\n| 17 |  | 珠峰硅钢 | 变压器核心部件 | **变压器-铁芯** (硅钢/非晶) | ① 非晶合金铁心-退火<br/>② 硅钢铁心-纵剪<br/>③ 硅钢铁心-中型叠装<br/>④ 硅钢铁心-大型叠装 | **电力** | ① 铁芯吨产量电耗 (`kWh/t`) | 重点监控纵剪、退火电阻炉与数控叠装电耗 |\n| 18 | **鲁缆公司** | **鲁缆本部** | 线缆产业 | **线缆-中低压 / 线缆-高压** | ① 线缆-拉丝 (铜/铝)<br/>② 线缆-中低压-交联 (干法)<br/>③ 线缆-高压-交联 (干法立塔) | **电力、氮气**<br/>*(⚠️ 全线无蒸汽)* | ① 单位吨铜电耗 (`kWh/t`)<br/>② 单位吨铝电耗 (`kWh/t`)<br/>③ 单位产量电耗 (`kWh/km`)<br/>④ 单位综合单耗 (`tce/km`) | **重点**：超高压干法悬垂立塔交联需计量高纯保护氮气消耗量；铜拉丝按吨铜考核 |\n| 19 |  | **曙光公司** | 线缆产业 | **线缆-特种电缆** (光伏/风电软缆) | ① 细线拉丝<br/>② 环保挤塑与交联 | **电力、氮气** | ① 吨铜电耗 (`kWh/t`)<br/>② 单位产量电耗 (`kWh/km`) | 特种耐寒耐扭曲软电缆生产线 |\n| 20 | **新缆厂** | **特变电工新疆电缆有限公司** | 线缆产业 | **线缆-中低压 / 线缆-高压** | ① 线缆-拉丝<br/>② 线缆-中低压-交联 (干法) | **电力、氮气** | ① 单位吨铜/吨铝电耗<br/>② 单位产量电耗 (`kWh/km`) | 新疆区域主力线缆生产基地 |\n| 21 |  | **特变电工新疆线缆厂** | 线缆产业 | **线缆-中低压** (民用/建筑线缆) | ① 线缆-拉丝<br/>② 线缆-中低压-交联 (干法) | **电力、氮气** | ① 单位吨铜/吨铝电耗<br/>② 单位产量电耗 (`kWh/km`) | 连续连铸连轧拉丝工段 |\n| 22 | **德缆公司** | **特变电工（德阳）电缆股份有限公司** | 线缆产业 | **线缆-中低压 / 线缆-高压** | ① 线缆-拉丝<br/>② 线缆-中低压-交联 (干法) | **电力、氮气** | ① 单位吨铜/吨铝电耗<br/>② 单位产量电耗 (`kWh/km`) | 西南线缆制造中心，主力消耗清洁水电与氮气 |\n\n---\n\n## 三、 产品单耗与工序能源匹配设计准则\n\n在前端原型及后端计算引擎中，必须严格贯彻以下业务逻辑：\n\n```mermaid\ngraph TD\n    subgraph MatchRule[\"⚙️ 能源介质自适应匹配引擎\"]\n        SelectNode[\"用户选择目标组织 / 产品大类\"]\n        CheckTrans{\"是否属于变压器产业?\"}\n        CheckCable{\"是否属于线缆产业?\"}\n        CheckOther{\"是否属于部件及其他装备?\"}\n\n        SelectNode --> CheckTrans\n        SelectNode --> CheckCable\n        SelectNode --> CheckOther\n\n        CheckTrans -- 是 --> RenderTrans[\"展示能源介质:<br/>1. 综合能耗 (tce/台)<br/>2. ⚡ 电单耗 (kWh/台 · kWh/kVA)<br/>3. 💨 蒸汽单耗 (t/台)<br/>4. 🔥 天然气消耗 (m³/台)<br/>5. 💧 工艺水耗 (t/台)\"]\n        \n        CheckCable -- 是 --> RenderCable[\"展示能源介质:<br/>1. 综合能耗 (tce/km)<br/>2. ⚡ 电单耗 (kWh/km)<br/>3. 💨 氮气消耗 (m³/km)<br/>4. 🔥 天然气消耗 (m³/km)<br/>5. 💧 工艺水耗 (t/km)<br/><b>⚠️ 彻底隐藏蒸汽列与蒸汽卡片</b>\"]\n\n        CheckOther -- 是 --> RenderOther[\"展示能源介质:<br/>1. 产值综合能耗 (tce/万元)<br/>2. ⚡ 产值电耗 (kWh/万元)<br/>3. 工艺水/气消耗\"]\n    end\n```\n\n### 1. 为什么线缆产业不呈现蒸汽？\n根据工艺物理特性，线缆制造中的交联工序采用“干法悬垂立塔交联”或“连续挤塑硫化”，加热采用电加热套，保护气氛采用高纯氮气（$N_2$），冷却采用循环冷却水。整个生产车间不设蒸汽管网，无工业蒸汽消耗。若在界面中展示“蒸汽消耗：0.00”或空列，会严重误导业务用户。**因此必须自适应隐藏蒸汽列**。\n\n### 2. 为什么变压器产业重点呈现电与蒸汽？\n大型电力变压器核心绝缘结构（绝缘纸板、垫块、线圈）在装配前必须经过“煤油气相真空干燥处理”或“热风循环蒸汽烘干”，消耗大量中低压过热蒸汽（折标煤系数 $0.1286\text{ kgce/kg}$），干燥工序能耗占变压器制造总能耗的 $50\\%\\sim 60\\%$。出厂试验阶段（雷电冲击、工频耐压、温升试验）则在特高压试验大厅消耗大量瞬时峰值电力。因此变压器产品必须将**电耗与蒸汽消耗**并列为最核心的管控介质。\n\n---\n\n## 四、 版本修订记录\n\n| 版本 | 修订日期 | 修订人 | 修订内容说明 |\n| :---: | :---: | :---: | :--- |\n| **V1.0** | 2026-08-30 | 数字化双碳项目组 | 根据《生产单位与涉及关键工序对应表(1).et》权威建立全集团 6 大经营单位、22 家二级工厂、产品类型、工序及主要消耗能源对应规范，指导「单位产品能耗」及「工序单耗」开发落地。 |\n"
  },
  {
    "id": "manual-29",
    "no": 29,
    "filename": "29_能源成本分析直属经营单位层级下钻与南丁格尔玫瑰图开发方案.md",
    "title": "能源成本分析直属经营单位层级下钻与南丁格尔玫瑰图开发方案",
    "category": "能耗分析与下钻模型",
    "readTime": "10 分钟",
    "wordCount": 5194,
    "summary": "﻿# 29. 能源成本分析直属经营单位层级下钻与南丁格尔玫瑰图开发方案",
    "headings": [
      {
        "level": 2,
        "title": "一、 需求背景与核心设计目标",
        "id": "一-需求背景与核心设计目标"
      },
      {
        "level": 2,
        "title": "二、 数据模型与结构设计",
        "id": "二-数据模型与结构设计"
      },
      {
        "level": 3,
        "title": "1. 核心成本指标字典（`COST_METRICS_META`）",
        "id": "1-核心成本指标字典-cost_metrics_meta"
      },
      {
        "level": 3,
        "title": "2. 2 级直属经营单位下属 3 级单位成本字典（`COMPANY_SUB_UNITS_COST`）",
        "id": "2-2-级直属经营单位下属-3-级单位成本字典-company_sub_units_cost"
      },
      {
        "level": 2,
        "title": "三、 南丁格尔玫瑰图核心算法与实现",
        "id": "三-南丁格尔玫瑰图核心算法与实现"
      },
      {
        "level": 3,
        "title": "1. 极坐标数学模型与 SSR 精度控制",
        "id": "1-极坐标数学模型与-ssr-精度控制"
      },
      {
        "level": 3,
        "title": "2. 交互式指向触发架构（Hover Callout）",
        "id": "2-交互式指向触发架构-hover-callout"
      },
      {
        "level": 2,
        "title": "四、 页面布局与图表尺寸规格",
        "id": "四-页面布局与图表尺寸规格"
      },
      {
        "level": 2,
        "title": "五、 验证与自测用例",
        "id": "五-验证与自测用例"
      }
    ],
    "content": "﻿# 29. 能源成本分析直属经营单位层级下钻与南丁格尔玫瑰图开发方案\n\n> **模块路径**：`/zero-carbon/energy/cost`  \n> **关联模块**：`/zero-carbon/energy/structure`、`/zero-carbon/energy/unit-output`  \n> **适用版本**：特变电工（电装集团）· 能源管理与双中心平台 v1.01\n\n---\n\n## 一、 需求背景与核心设计目标\n\n能源成本分析作为集团经营管理层、财务与生产能源主管决策的核心驾驶舱，承担着“以价值量度量物理能耗、以成本结构指导节能降本”的关键使命。在工业级原型落地过程中，围绕以下关键目标进行了深度重构与升级：\n\n1. **组织层级感知与下钻透视**：\n   - 集团视角（1 级节点）：统揽 6 家直属经营单位的能源支出与比重；\n   - 经营单位视角（2 级节点）：自动下钻透视该单位下属车间/项目公司明细，支持继续穿透至产线/车间级。\n2. **术语规范与台账纯净化**：\n   - 规范表格第 2 列表头为 **「直属经营单位」**；\n   - 移除「所属基地与电网」与「市电成本占比」等冗余列，强化核心价值指标。\n3. **能源介质名称精简化**：\n   - 统一缩短为：`市电`、`天然气`、`外购蒸汽`、`油`、`氮气`、`水`，卡片底部统一标明 `占比`。\n4. **动态南丁格尔玫瑰图（Nightingale Rose Chart）**：\n   - 双维度极坐标表达：极径表金额量（¥ 万元），扇面表份额占比（%）；\n   - 交互触发显示：默认纯净无杂乱引线，鼠标指向特定扇区时动态展开引线与数据浮标；\n   - 彻底解决 SSR 浮点精度引发的水合不一致（Hydration Mismatch）问题。\n\n---\n\n## 二、 数据模型与结构设计\n\n### 1. 核心成本指标字典（`COST_METRICS_META`）\n\n```typescript\nexport type CostMetricKey =\n  | 'totalCost'\n  | 'gridElecCost'\n  | 'gasCost'\n  | 'steamCost'\n  | 'oilCost'\n  | 'nitrogenCost'\n  | 'waterCost'\n\nexport const COST_METRICS_META: Record<CostMetricKey, CostMetricMeta> = {\n  totalCost: {\n    key: 'totalCost',\n    name: '总用能成本',\n    shortName: '总用能成本',\n    unit: '万元',\n    color: '#059669',\n    description: '全厂区所有能源介质外购与消费总支出',\n  },\n  gridElecCost: {\n    key: 'gridElecCost',\n    name: '市电',\n    shortName: '市电',\n    unit: '万元',\n    color: '#1677ff',\n    description: '从公共电网外购结算的电力总费用',\n  },\n  gasCost: {\n    key: 'gasCost',\n    name: '天然气',\n    shortName: '天然气',\n    unit: '万元',\n    color: '#f59e0b',\n    description: '管道天然气用气采购与燃料支出',\n  },\n  steamCost: {\n    key: 'steamCost',\n    name: '外购蒸汽',\n    shortName: '外购蒸汽',\n    unit: '万元',\n    color: '#8b5cf6',\n    description: '工业园区集中供热与工艺外购蒸汽费用',\n  },\n  oilCost: {\n    key: 'oilCost',\n    name: '油',\n    shortName: '油',\n    unit: '万元',\n    color: '#f43f5e',\n    description: '厂区物流运输车辆及发电机柴汽油消费',\n  },\n  nitrogenCost: {\n    key: 'nitrogenCost',\n    name: '氮气',\n    shortName: '氮气',\n    unit: '万元',\n    color: '#06b6d4',\n    description: '特种绝缘干燥与工艺惰化液氮采购支出',\n  },\n  waterCost: {\n    key: 'waterCost',\n    name: '水',\n    shortName: '水',\n    unit: '万元',\n    color: '#0284c7',\n    description: '生产循环水与生活辅助用水费用',\n  },\n}\n```\n\n### 2. 2 级直属经营单位下属 3 级单位成本字典（`COMPANY_SUB_UNITS_COST`）\n\n系统内置完整的下属 3 级车间与项目公司数据字典：\n- **沈变公司**：沈变本部（¥420.0万）、露娜公司（¥120.0万）、智慧能源（¥72.5万）、和新套管（¥65.0万）、康嘉互感器（¥55.0万）、印能公司（¥30.0万）；\n- **衡变公司**：衡变本部（¥320.0万）、南京电研（¥85.0万）、云集电气（¥62.0万）、湖南电气（¥58.0万）、云集高压开关（¥45.0万）、新疆自控（¥35.0万）、上开（¥25.0万）、柯贝尔（¥20.0万）、特能建（¥15.0万）、合容电气（¥12.0万）、赛杰爱迪（¥8.0万）；\n- **新变厂**：超高压公司（¥280.0万）、天变公司（¥110.0万）、智能电气（¥80.0万）、京津冀公司（¥55.0万）、珠峰硅钢（¥35.2万）、智慧能源（¥18.0万）、银利电气（¥12.0万）；\n- **鲁缆公司**：鲁缆本部（¥260.0万）、智缆公司（¥75.0万）、昭和公司（¥50.8万）、曙光公司（¥35.0万）；\n- **新缆厂**：新疆电缆有限公司（¥200.0万）、新疆线缆厂（¥112.0万）；\n- **德缆公司**：德阳电缆制造主体车间（¥360.5万）。\n\n---\n\n## 三、 南丁格尔玫瑰图核心算法与实现\n\n### 1. 极坐标数学模型与 SSR 精度控制\n\n```typescript\n// 极坐标转换辅助计算函数 (严格保留 2 位小数规范化，防止 SSR 与客户端 Hydration 浮点微差)\nfunction polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {\n  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0\n  const x = centerX + radius * Math.cos(angleInRadians)\n  const y = centerY + radius * Math.sin(angleInRadians)\n  return {\n    x: Number(x.toFixed(2)),\n    y: Number(y.toFixed(2)),\n  }\n}\n\nfunction describeRoseSector(x: number, y: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) {\n  const rOut = Number(outerRadius.toFixed(2))\n  const rIn = Number(innerRadius.toFixed(2))\n  const startOuter = polarToCartesian(x, y, rOut, endAngle)\n  const endOuter = polarToCartesian(x, y, rOut, startAngle)\n  const startInner = polarToCartesian(x, y, rIn, startAngle)\n  const endInner = polarToCartesian(x, y, rIn, endAngle)\n  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'\n\n  return [\n    'M', startOuter.x, startOuter.y,\n    'A', rOut, rOut, 0, largeArcFlag, 0, endOuter.x, endOuter.y,\n    'L', startInner.x, startInner.y,\n    'A', rIn, rIn, 0, largeArcFlag, 1, endInner.x, endInner.y,\n    'Z',\n  ].join(' ')\n}\n```\n\n### 2. 交互式指向触发架构（Hover Callout）\n\n```mermaid\nsequenceDiagram\n    autonumber\n    actor User as 用户鼠标\n    participant Sector as 玫瑰花瓣扇区\n    participant Callout as 动态引导线与浮标卡片\n    participant Center as 中心极核徽章\n\n    User->>Sector: 鼠标移动悬浮 (onMouseEnter)\n    Sector->>Sector: 极径外展 +7px，高亮白边\n    Sector->>Callout: 动态渲染折线与气泡卡片 (单位 + 占比% + ¥金额万)\n    Sector->>Center: 切换展示该单位名称与占比%\n    User->>Sector: 鼠标移出 (onMouseLeave)\n    Sector->>Sector: 恢复基准极径，透明度复原\n    Callout->>Callout: 隐藏浮标与引线\n    Sector->>Center: 复原展示指标全额汇总 (¥3,131万)\n```\n\n---\n\n## 四、 页面布局与图表尺寸规格\n\n| 图表组件 | 宽度占比 | 高度 | 极径/坐标规格 | 说明 |\n| :--- | :--- | :--- | :--- | :--- |\n| **南丁格尔玫瑰图** | 5/12 列宽 | **`290px`** | 内径 26px，外径 44~122px | 6 瓣等分角度，极径由金额驱动，悬浮展开折线与气泡卡片 |\n| **横向对比柱状图** | 7/12 列宽 | **`310px`** | 直角坐标系，Y 轴自动刻度 | 按金额数值从高到低排序，与左侧玫瑰图形成极坐标与直角坐标双重视角 |\n| **直属单位明细台账** | 12/12 铺满 | 自适应 | 6 列紧凑表格 | 支持点击「下钻查看该单位成本」穿透切换组织树 |\n\n---\n\n## 五、 验证与自测用例\n\n1. **组织树下钻验证**：\n   - 选根节点「电装集团」➔ 表格展示 6 家直属经营单位，表头显示为 `直属经营单位`；\n   - 点击沈变公司「下钻查看该单位成本」➔ 组织树自动高亮沈变公司，表格与图表动态切换为 6 家 3 级车间（沈变本部、露娜公司等）。\n2. **交互悬浮测试**：\n   - 悬浮在沈变花瓣上 ➔ 极径外展，弹出 `沈变公司 24.4% ¥762.5万元` 气泡卡片；\n   - 鼠标离开图表 ➔ 气泡卡片消失，图表恢复纯净极简外观，中心显示 `总额 ¥3,131万`。\n3. **SSR 水合测试**：\n   - 刷新页面与构建静态导出，控制台 0 错误 0 Hydration Warning。"
  },
  {
    "id": "manual-30",
    "no": 30,
    "filename": "30_基础配置与零碳项目评估多模块页面精简重构与树状层级落地手册.md",
    "title": "基础配置与零碳项目评估多模块页面精简重构与树状层级落地手册",
    "category": "能耗分析与下钻模型",
    "readTime": "6 分钟",
    "wordCount": 2764,
    "summary": "﻿# 30. 基础配置与零碳项目评估多模块页面精简重构与树状层级落地手册",
    "headings": [
      {
        "level": 2,
        "title": "一、 需求背景与核心设计目标",
        "id": "一-需求背景与核心设计目标"
      },
      {
        "level": 2,
        "title": "二、 重点模块改造明细",
        "id": "二-重点模块改造明细"
      },
      {
        "level": 3,
        "title": "1. 基础配置模块精简与交互升级 (`/zero-carbon/config/*`)",
        "id": "1-基础配置模块精简与交互升级-zero-carbon-config"
      },
      {
        "level": 3,
        "title": "2. 零碳项目评估模块重构 (`/zero-carbon/project/*`)",
        "id": "2-零碳项目评估模块重构-zero-carbon-project"
      },
      {
        "level": 2,
        "title": "三、 验证与构建部署说明",
        "id": "三-验证与构建部署说明"
      }
    ],
    "content": "﻿# 30. 基础配置与零碳项目评估多模块页面精简重构与树状层级落地手册\n\n> **模块路径**：`/zero-carbon/config/*`、`/zero-carbon/project/*`  \n> **适用版本**：特变电工（电装集团）· 能源管理与双中心平台 v1.01  \n> **更新时间**：2026-09-01  \n> **开发团队**：前端架构组 / UI/UX 体验设计组 / SRE 运维组\n\n---\n\n## 一、 需求背景与核心设计目标\n\n为了进一步贴合特变电工实际生产管理与业务操作习惯，提升能碳双中心数字化集成平台的视觉清爽度与操作便捷性，本次针对【基础配置】与【零碳项目评估】两大核心板块进行了多维度的深度精简与交互重构：\n\n1. **表格与页面视觉降噪（去冗余）**：\n   - 移除不必要的指标概览卡片、技术字段 Key 与调试状态横条，让用户聚焦核心业务；\n   - 精简表头层级与文案口径，统一为「项目名称」、「项目类型」、「所属园区」、「操作」等标准商业术语。\n2. **组织架构层级树状化选择器（TreeSelect）**：\n   - 针对接口接入、数据配置等弹窗中的制造单位选择，打破扁平列表，提供覆盖全集团 **6 大直属制造公司、31 个工厂/车间工序**的带导线树状层级选择组件，支持即时搜索与节点展开。\n3. **项目向导弹窗空间比例黄金化**：\n   - 重构向导弹窗比例，告别宽屏横向拉伸，采用黄金比例居中卡片（`max-w-3xl`），增强纵向操作呼吸感与步骤清晰度；\n   - 支持项目编码手动填写与自适应编辑，满足各单位自建编码体系需求。\n\n---\n\n## 二、 重点模块改造明细\n\n### 1. 基础配置模块精简与交互升级 (`/zero-carbon/config/*`)\n\n| 子页面 | 优化前状态 | 优化后落地标准 | 核心价值 |\n| :--- | :--- | :--- | :--- |\n| **碳排因子 (`factor`)** | 包含「绿电交易核算」和「核算版本」列 | 移除两列冗余属性，保留因子类型、适用介质、因子数值、单位与发布机构 | 聚焦国家及行业标准因子核心属性 |\n| **费价模型 (`price`)** | 顶部包含版本状态条与「季节执行标准」按钮 | 移除顶部状态栏与切换按钮，保留峰平谷阶梯电价与时段配置卡片 | 界面结构纯净，避免配置歧义 |\n| **折标煤系数 (`convert`)** | 顶部包含 4 个概览 KPI 统计卡片 | 移除概览卡片，直接呈现标准能源折标对照表格与动态换算引擎 | 直奔核心工具与标准速查 |\n| **接口配置 (`interface`)** | 顶部包含 4 个监控卡片；表格包含详细技术副标题与字段 Key | 移除 4 个监控卡片与 Tab 2 技术 Key 列；弹窗引入 6 公司 31 车间 TreeSelect 树状选择器 | 兼顾工业现场工程师与业务人员双重视角 |\n| **账号权限 (`permission`)** | 顶部包含 4 个用户与角色统计卡片 | 移除概览统计卡片，直接展示角色矩阵与用户权限分配清单 | 提升权限配置页的纵向可视区域 |\n\n#### 接口配置弹窗 TreeSelect 架构\n```typescript\n// 6 大制造公司与 31 个工厂/车间标准组织树结构\nexport const ORG_TREE_COMPANIES = [\n  {\n    id: 'comp_sb',\n    name: '沈变公司 (特变电工沈阳变压器集团)',\n    children: [\n      { id: 'ws_sb_1', name: '沈变本部 (特高压数字化生产基地)' },\n      { id: 'ws_sb_2', name: '特变电工露娜智能制造产业园' },\n      { id: 'ws_sb_3', name: '沈变智慧能源中心 (动力车间)' },\n      { id: 'ws_sb_4', name: '和新套管智能制造基地' },\n      { id: 'ws_sb_5', name: '康嘉互感器生产厂区' },\n      { id: 'ws_sb_6', name: '印能制造分厂' },\n    ],\n  },\n  // ... 衡变、新变、鲁缆、新缆、德缆 覆盖全部 31 个车间\n]\n```\n\n---\n\n### 2. 零碳项目评估模块重构 (`/zero-carbon/project/*`)\n\n#### 2.1 项目档案管理 (`archive`)\n- **表头术语规范**：\n  - `项目全称` ➔ **`项目名称`**\n  - `技术主类` ➔ **`项目类型`**\n  - `所属直属单位 / 园区` ➔ **`所属园区`**\n  - `档案操作` ➔ **`操作`**\n  - 移除了「年减碳 (tCO2)」列，优化各列宽间距。\n- **标题栏纯净化**：\n  - 表格标题更新为 **「项目台账档案库」**，移除了原有的 `已自动汇总 N 个项目` 徽标。\n- **添加项目向导弹窗重构**：\n  - 宽度调整为 **`max-w-3xl`**，纵向高度弹性分配（`min-h-[560px]`），居中沉浸；\n  - 移除弹窗头部冗余填报说明副标题；\n  - 步骤向导第 2 步规范为 **`2. 项目类型与系统容量`**；\n  - **项目编码开放手动编辑**：移除 `disabled` 属性，支持企业手动录入或沿用自动生成的编码。\n\n#### 2.2 模型管理 (`model`)\n- **表格列精简**：\n  - 移除表格中的 **「核心算法与描述」** 长文本与公式列；\n  - 表格列精炼为：**模型名称**、**模型类别**、**当前版本**、**历史版本**、**更新时间**、**操作**；\n  - 保留点击进入下钻弹窗查看完整算法细节与历史版本回溯能力。\n\n---\n\n## 三、 验证与构建部署说明\n\n1. **静态全量导出验证**：\n   ```bash\n   pnpm build\n   ```\n   - 验证通过 61 个静态路由页编译与打包（零警告，零水合错误）。\n2. **线上服务器发布**：\n   - 将打包生成物压缩为 `tbea-nengtan-dist.tar.gz`；\n   - 上传至阿里云生产服务器 `/var/www/tbea-nengtan`；\n   - Nginx 平滑重载，双端口（3000 / 80）即时生效。\n"
  },
  {
    "id": "manual-31",
    "no": 31,
    "filename": "31_工厂能碳数据人工填报减负与11大类工业产品多品类柔性扩展开发手册.md",
    "title": "工厂能碳数据人工填报减负与11大类工业产品多品类柔性扩展开发手册",
    "category": "数据录入与组件设计",
    "readTime": "19 分钟",
    "wordCount": 9522,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "一、 业务背景与减负重构目标",
        "id": "一-业务背景与减负重构目标"
      },
      {
        "level": 3,
        "title": "核心重构目标",
        "id": "核心重构目标"
      },
      {
        "level": 2,
        "title": "二、 23 项数据源梳理与直通免填矩阵 (Rationalization Matrix)",
        "id": "二-23-项数据源梳理与直通免填矩阵-rationalization-matrix"
      },
      {
        "level": 3,
        "title": "1. 直通免填清单（系统自动取数 / 集团大数据中台直连，基层 0 负担）",
        "id": "1-直通免填清单-系统自动取数-集团大数据中台直连-基层-0-负担"
      },
      {
        "level": 3,
        "title": "2. 基层工厂最小必要人工填报清单（仅 4 项）",
        "id": "2-基层工厂最小必要人工填报清单-仅-4-项"
      },
      {
        "level": 2,
        "title": "三、 11 大类工业产品多品类柔性扩展架构",
        "id": "三-11-大类工业产品多品类柔性扩展架构"
      },
      {
        "level": 3,
        "title": "1. 品类注册配置结构 (`lib/product-catalog.ts` 或组件内常量)",
        "id": "1-品类注册配置结构-lib-product-catalog-ts-或组件内常量"
      },
      {
        "level": 3,
        "title": "2. 动态增减品类交互状态机",
        "id": "2-动态增减品类交互状态机"
      },
      {
        "level": 2,
        "title": "四、 UI/UX 规范落地与缺陷修复细节",
        "id": "四-ui-ux-规范落地与缺陷修复细节"
      },
      {
        "level": 3,
        "title": "1. 表格与表单规范 (44px 工业基准)",
        "id": "1-表格与表单规范-44px-工业基准"
      },
      {
        "level": 3,
        "title": "2. 按钮重复图标 Bug 根除",
        "id": "2-按钮重复图标-bug-根除"
      },
      {
        "level": 2,
        "title": "五、 双端同构与静态编译验证",
        "id": "五-双端同构与静态编译验证"
      },
      {
        "level": 3,
        "title": "编译验证结果",
        "id": "编译验证结果"
      },
      {
        "level": 2,
        "title": "六、 生产环境部署手册 (阿里云 8.215.89.194)",
        "id": "六-生产环境部署手册-阿里云-8-215-89-194"
      },
      {
        "level": 3,
        "title": "1. 服务器拓扑与端口配置",
        "id": "1-服务器拓扑与端口配置"
      }
    ],
    "content": "# 31. 工厂能碳数据人工填报减负与11大类工业产品多品类柔性扩展开发手册\n\n> **模块路径**：`/zero-carbon/config/entry`  \n> **适用版本**：特变电工（电装集团）· 能源管理与双中心平台 v1.02  \n> **更新时间**：2026-09-07  \n> **开发团队**：能碳数字化架构组 / UI/UX 体验设计组 / SRE 运维组\n\n---\n\n## 一、 业务背景与减负重构目标\n\n在特变电工下属各项目公司与制造工厂的实际能碳数字化落地过程中，基础数据录入长期面临以下严峻痛点：\n1. **手工填报负担过重**：企业能碳管理员需月度/日度在线下 Excel 汇总多达 23 项数据，大量数据已在集团大数据平台、SCADA、ERP、MES 或物联网电表中存在，但由于缺乏协同设计，导致基层工厂重复录入、怨声载道；\n2. **产品品类扩展性差**：特变电工不仅生产传统电力变压器与电线电缆，更拥有光伏逆变器、高压开关、套管、互感器、储能系统、箱式变电站、硅基新材料等多产业产品线，原有写死的静态表单无法满足多工厂灵活申报新产品产能；\n3. **录入界面层级混乱**：输入控件风格不一、按钮存在多重冗余图标（如 `⚡ 一键带入`、`+ 增报产品`），影响工业监控界面的沉浸感与专业度。\n\n### 核心重构目标\n- **业务减负 70%**：基于 23 项数据采集源清单梳理，将 19 项已具备自动化或集团平台能力的数据直通免填，基层仅保留 4 项最小必要自填项；\n- **11 大类工业产品柔性扩展**：内置特变电工全产业链 11 大核心品类，支持工厂根据当月排产动态「+ 增报产品品类」，支持子规格/型号自由增删与计量单位自适应联动；\n- **严格遵循 TBEA 工业设计规范**：数据表格强制 `44px` 行高（`h-[44px]`），按数据类别提供表单卡片化录入与月度数据快速带入，消除所有评价类多余文案与重复图标。\n\n---\n\n## 二、 23 项数据源梳理与直通免填矩阵 (Rationalization Matrix)\n\n经过 PM 与数据架构团队深度审计，企业现场 23 项数据项流转机制收敛为两大阵营：\n\n### 1. 直通免填清单（系统自动取数 / 集团大数据中台直连，基层 0 负担）\n| 序号 | 数据类别 | 数据项 | 权威数据源系统 | 处理策略与减负成效 |\n| :---: | :--- | :--- | :--- | :--- |\n| 1 | 产量数据 | 线缆产量数据 | 股份公司大数据平台 | **自动采集（免填）**：直接按日同步各线缆项目公司 ERP 报完工数据 |\n| 2 | 产量数据 | 各经营单位产量指标完成情况 | 经营日报系统 / 经营看板 | **自动汇总（免填）**：股份公司统一抓取，无需企业二次填报 |\n| 3 | 产值数据 | 工业总产值 / 工业增加值 | 财务 NC / 经营分析系统 | **自动核算（免填）**：直接对接集团财务系统取数，保障审计一致性 |\n| 4 | 能源介质 | 关口电表用电量 (电度表) | 能源管控 SCADA / 物联网网关 | **秒级自采（免填）**：各厂区总进线高低压智能电表自动上传 |\n| 5 | 能源介质 | 蒸汽消耗量 | 热力管网流量计 / DCS | **自动取数（免填）**：由热力公司/自备电网流量积算仪直连 |\n| 6 | 能源介质 | 天然气用量 | 燃气智能表具 / 物联网中继 | **自动取数（免填）**：燃气标况体积流量计实时传输 |\n| 7 | 能源介质 | 新鲜水消耗量 | 供水管网超声波水表 | **自动取数（免填）**：智慧水务系统自动拉取 |\n| 8 | 微电网 | 屋顶分布式光伏发电量 | 华为/阳光光伏逆变器网关 | **自动采集（免填）**：逆变器 Modbus 实时遥测数据 |\n| 9 | 微电网 | 储能电站充放电量 | 储能 EMS 能源管理系统 | **自动采集（免填）**：储能充放电电量与 SOC 状态自同步 |\n| 10 | 基础参数 | 折标煤系数 / 碳排因子 | 国家发改委 / 生态环境部标准库 | **平台内置（免填）**：在 `/zero-carbon/config/factor` 统一维护，全厂共用 |\n| 11~19 | 环保管控 | 绿电绿证核算、固废产生量等 | 国家可再生能源交易平台 / 环保直联 | **自动归集（免填）**：接口定期轮询同步 |\n\n### 2. 基层工厂最小必要人工填报清单（仅 4 项）\n| 序号 | 填报模块 | 填报数据项 | 填报频次 | 现状与必须人工录入的业务动因 |\n| :---: | :--- | :--- | :---: | :--- |\n| **01** | **产品产量** | **变压器及特种装备产量** | 月度 / 日 | 变压器型号规格多（特高压、换流变、油变、干变），各项目公司 ERP 编码规则未彻底打通，需工厂专员按型号申报台数与千伏安（kVA）容量 |\n| **02** | **外协能耗** | **委外加工/外协件能耗分摊** | 月度 | 绝缘件、外壳喷涂等委外单位未接入我方 SCADA，需依据委外结算单与外协协议录入实耗电量与费用 |\n| **03** | **自备能源** | **自备电厂/余热利用自发自用电量** | 月度 | 部分老旧热电联产机组与余热蒸汽发电机组未完成数采网关改造，需填报抄表底数 |\n| **04** | **异常说明** | **工况检修与异常波动说明** | 按需 | 当月产线大修、自然灾害导致能耗同比波动超过 ±15% 时，提供管理审计定性说明 |\n\n---\n\n## 三、 11 大类工业产品多品类柔性扩展架构\n\n为了支撑特变电工多基地、多产业的长期演进，前端架构设计了可插拔、解耦的 `PRODUCT_CATEGORIES` 柔性品类注册树。\n\n### 1. 品类注册配置结构 (`lib/product-catalog.ts` 或组件内常量)\n```typescript\nexport interface ProductCategoryConfig {\n  id: string\n  name: string\n  defaultUnit: string\n  categoryGroup: '变压器装备' | '输配电线缆' | '新能源核心部件' | '电网成套与辅件' | '新材料及其他'\n  defaultModels: { modelName: string; defaultSpec: string; unit: string }[]\n}\n\nexport const INDUSTRIAL_PRODUCT_CATEGORIES: ProductCategoryConfig[] = [\n  {\n    id: 'cat_transformer',\n    name: '电力变压器',\n    defaultUnit: '台 / 万kVA',\n    categoryGroup: '变压器装备',\n    defaultModels: [\n      { modelName: '特高压交流变压器 1000kV', defaultSpec: 'ODFS-1000000/1000', unit: '台' },\n      { modelName: '特高压换流变压器 ±800kV', defaultSpec: 'ZZDFPZ-407100/800', unit: '台' },\n      { modelName: '大型电力变压器 500kV', defaultSpec: 'SFP-1000000/500', unit: '台' },\n      { modelName: '工业配电干式变压器', defaultSpec: 'SCB18-2500/10', unit: '台' },\n    ],\n  },\n  {\n    id: 'cat_cable',\n    name: '电线电缆与特种导线',\n    defaultUnit: '千米 (km)',\n    categoryGroup: '输配电线缆',\n    defaultModels: [\n      { modelName: '超高压交联电缆 500kV', defaultSpec: 'YJLW03 500kV 1×2500', unit: '千米' },\n      { modelName: '铝合金节能导线', defaultSpec: 'JL/G1A-630/45', unit: '吨' },\n    ],\n  },\n  {\n    id: 'cat_inverter',\n    name: '光伏并网逆变器',\n    defaultUnit: '台 / MW',\n    categoryGroup: '新能源核心部件',\n    defaultModels: [\n      { modelName: '大功率组串式逆变器 300kW+', defaultSpec: 'TS330KTL-HV', unit: '台' },\n      { modelName: '集中式逆变升压一体机', defaultSpec: 'TC3125KF-OD', unit: '台' },\n    ],\n  },\n  {\n    id: 'cat_switch',\n    name: '高压与超高压开关 (GIS)',\n    defaultUnit: '间隔 / 组',\n    categoryGroup: '电网成套与辅件',\n    defaultModels: [\n      { modelName: '气体绝缘金属封闭开关设备 (GIS)', defaultSpec: 'ZF27-550(L)', unit: '间隔' },\n      { modelName: '户外高压交流断路器', defaultSpec: 'LW□-252/Y4000-50', unit: '台' },\n    ],\n  },\n  {\n    id: 'cat_bushing',\n    name: '高压套管 (和新制造)',\n    defaultUnit: '支',\n    categoryGroup: '电网成套与辅件',\n    defaultModels: [\n      { modelName: '特高压交流胶浸纸电容式套管', defaultSpec: 'BRDG-1100/1250', unit: '支' },\n      { modelName: '干式环氧树脂浸渍纸套管', defaultSpec: 'BROP-252/2000', unit: '支' },\n    ],\n  },\n  {\n    id: 'cat_instrument_transformer',\n    name: '互感器 (康嘉互感器)',\n    defaultUnit: '台',\n    categoryGroup: '电网成套与辅件',\n    defaultModels: [\n      { modelName: '电子式电流互感器', defaultSpec: 'ECIT-500', unit: '台' },\n      { modelName: '电容式电压互感器', defaultSpec: 'TYD-220/√3', unit: '台' },\n    ],\n  },\n  {\n    id: 'cat_reactor',\n    name: '电抗器',\n    defaultUnit: '台 / 组',\n    categoryGroup: '变压器装备',\n    defaultModels: [\n      { modelName: '特高压干式平波电抗器', defaultSpec: 'PK-800-4500-75', unit: '台' },\n      { modelName: '并联电抗器 750kV', defaultSpec: 'BKD-100000/750', unit: '台' },\n    ],\n  },\n  {\n    id: 'cat_ess',\n    name: '储能变流器 (PCS) 及系统',\n    defaultUnit: '套 / MWh',\n    categoryGroup: '新能源核心部件',\n    defaultModels: [\n      { modelName: '高压组串式储能一体舱', defaultSpec: 'TB-ESS-5000-AC', unit: '套' },\n      { modelName: '工商业一体化储能柜', defaultSpec: 'TB-ESS-215-L', unit: '套' },\n    ],\n  },\n  {\n    id: 'cat_box_substation',\n    name: '箱式变电站 (欧变/美变)',\n    defaultUnit: '台',\n    categoryGroup: '电网成套与辅件',\n    defaultModels: [\n      { modelName: '预装式变电站 (光伏专用箱变)', defaultSpec: 'ZGS-Z-G-3150/35', unit: '台' },\n      { modelName: '智能紧凑型预装式变电站', defaultSpec: 'YBM-12/0.4-1250', unit: '台' },\n    ],\n  },\n  {\n    id: 'cat_distribution',\n    name: '成套配电柜与母线槽',\n    defaultUnit: '面 / 米',\n    categoryGroup: '电网成套与辅件',\n    defaultModels: [\n      { modelName: '中置式金属铠装移开式高压开关柜', defaultSpec: 'KYN28A-12', unit: '面' },\n      { modelName: '密集绝缘型封闭母线槽', defaultSpec: 'CMC-2A-3150A', unit: '米' },\n    ],\n  },\n  {\n    id: 'cat_materials',\n    name: '硅基与绝缘新材料',\n    defaultUnit: '吨 (t)',\n    categoryGroup: '新材料及其他',\n    defaultModels: [\n      { modelName: '高纯多晶硅 (光伏级/电子级)', defaultSpec: 'Solar Grade 9N+', unit: '吨' },\n      { modelName: '特高压变压器绝缘纸板', defaultSpec: 'T4 Transformer Board', unit: '吨' },\n    ],\n  },\n]\n```\n\n### 2. 动态增减品类交互状态机\n- 用户点击「增报产品品类」按钮，弹出支持 11 大品类按产业组分类的弹窗；\n- 用户选择目标品类后，系统自动初始化该品类的默认细分型号规格行；\n- 每个品类区块均提供「+ 添加规格型号」与「移除本品类」操作，支持行内自定义规格编码、计量单位与产量数字；\n- 提供「一键带入上月数据」快捷功能，根据上月申报记录自动补全产品列表与底数，录入耗时从 45 分钟下降至 3 分钟以内。\n\n---\n\n## 四、 UI/UX 规范落地与缺陷修复细节\n\n### 1. 表格与表单规范 (44px 工业基准)\n- 表格每一行固定高度为 `h-[44px]`，垂直居中排布，严格符合高密度工业监控人机工程学；\n- 数字输入框采用单色轻描边（`border-input`），聚焦时环形发光（`focus:ring-1 focus:ring-primary`），右侧紧凑集成微型单位标注（如 `台`、`t`、`kVA`）；\n- 彻底剔除所有主观评价标签（如 `填报良好`、`需加紧录入`），仅呈现纯粹的时序与对比数据。\n\n### 2. 按钮重复图标 Bug 根除\n在重构审查中发现原有两处按钮在渲染 Lucide 图标的同时，文案内部硬编码了重复符号：\n- **修复项 1**：\n  ```tsx\n  // 修改前 (Bug)\n  <button><Zap className=\"w-4 h-4 mr-1\" /> <span>⚡ 一键带入上月数据</span></button>\n  // 修改后 (Clean)\n  <button><Zap className=\"w-4 h-4 mr-1.5\" /> <span>一键带入上月数据</span></button>\n  ```\n- **修复项 2**：\n  ```tsx\n  // 修改前 (Bug)\n  <button><Plus className=\"w-4 h-4 mr-1\" /> <span>+ 增报产品品类</span></button>\n  // 修改后 (Clean)\n  <button><Plus className=\"w-4 h-4 mr-1.5\" /> <span>增报产品品类</span></button>\n  ```\n\n---\n\n## 五、 双端同构与静态编译验证\n\n本项目实施暗黑科技蓝与浅色商务双端同构工程标准：\n- **暗黑科技蓝工程**：`产品原型/app/zero-carbon/config/entry/page.tsx`\n- **浅色商务端工程**：`产品原型-旧/产品原型/app/zero-carbon/config/entry/page.tsx`\n\n### 编译验证结果\n```bash\n# 暗黑科技蓝端\ncd \"d:\\Project\\TJ-nengtan\\产品原型\" && npm run build\n# Result: Route (app) 76/76 static routes, 0 errors, 0 warnings\n\n# 浅色商务端\ncd \"d:\\Project\\TJ-nengtan\\产品原型-旧\\产品原型\" && npm run build\n# Result: Route (app) 76/76 static routes, 0 errors, 0 warnings\n```\n\n---\n\n## 六、 生产环境部署手册 (阿里云 8.215.89.194)\n\n### 1. 服务器拓扑与端口配置\n| 部署环境 | 主机 IP | 对应端口 | Web 根目录 | Nginx 虚拟主机配置 |\n| :--- | :--- | :---: | :--- | :--- |\n| **暗黑科技蓝集控中心** | `8.215.89.194` | `3000` | `/var/www/tbea-nengtan` | `listen 3000; root /var/www/tbea-nengtan; try_files $uri $uri/ $uri.html /index.html;` |\n| **浅色商务双中心** | `8.215.89.194` | `3001` | `/var/www/tbea-nengtan-old` | `listen 3001; root /var/www/tbea-nengtan-old; try_files $uri $uri/ $uri.html /index.html;` |\n\n### 2. 标准自动化发布脚本\n```powershell\n# 1. 本地生成发布归档包\ntar.exe -czf \"$env:TEMP\\tbea-dark.tar.gz\" -C \"d:\\Project\\TJ-nengtan\\产品原型\\out\" .\ntar.exe -czf \"$env:TEMP\\tbea-light.tar.gz\" -C \"d:\\Project\\TJ-nengtan\\产品原型-旧\\产品原型\\out\" .\n\n# 2. 安全推送到线上暂存区\nscp.exe -o BatchMode=yes -o StrictHostKeyChecking=no $env:TEMP\\tbea-dark.tar.gz $env:TEMP\\tbea-light.tar.gz admin@8.215.89.194:/tmp/\n\n# 3. 生产环境原子化覆盖与服务热重载\nssh.exe -o BatchMode=yes -o StrictHostKeyChecking=no admin@8.215.89.194 \"\n  echo tianzi | sudo -S rm -rf /var/www/tbea-nengtan/* &&\n  echo tianzi | sudo -S tar -xzf /tmp/tbea-dark.tar.gz -C /var/www/tbea-nengtan/ &&\n  echo tianzi | sudo -S rm -rf /var/www/tbea-nengtan-old/* &&\n  echo tianzi | sudo -S tar -xzf /tmp/tbea-light.tar.gz -C /var/www/tbea-nengtan-old/ &&\n  echo tianzi | sudo -S chown -R www-data:www-data /var/www/tbea-nengtan /var/www/tbea-nengtan-old &&\n  echo tianzi | sudo -S chmod -R 755 /var/www/tbea-nengtan /var/www/tbea-nengtan-old &&\n  rm -f /tmp/tbea-dark.tar.gz /tmp/tbea-light.tar.gz &&\n  echo tianzi | sudo -S nginx -t &&\n  echo tianzi | sudo -S systemctl reload nginx &&\n  echo 'DEPLOY_SUCCESS'\n\"\n```\n\n### 3. 在线连通性巡检验证\n部署完成后，可通过 HTTP 状态码快速确认上线成功：\n```bash\ncurl -I http://8.215.89.194:3000/zero-carbon/config/entry\n# HTTP/1.1 200 OK\ncurl -I http://8.215.89.194:3001/zero-carbon/config/entry\n# HTTP/1.1 200 OK\n```\n"
  },
  {
    "id": "manual-32",
    "no": 32,
    "filename": "32_能碳双中心13项客户反馈深度优化与21家工厂白名单同构落地开发手册.md",
    "title": "能碳双中心13项客户反馈深度优化与21家工厂白名单同构落地开发手册",
    "category": "数据录入与组件设计",
    "readTime": "4 分钟",
    "wordCount": 2109,
    "summary": "在特变电工能碳数字化双中心平台（零碳园区集控中心 + 产品碳足迹集采中心）的多轮客户业务评审中，针对组织架构名称规范性、未接入园区/单位视觉呈现、能源成本指标分类完备度、单耗对标物理单位精确性、自评估工厂范围真实性等多个维度提出了 13 项",
    "headings": [
      {
        "level": 2,
        "title": "一、 背景与业务动因",
        "id": "一-背景与业务动因"
      },
      {
        "level": 2,
        "title": "二、 关键技术实现与工程规范",
        "id": "二-关键技术实现与工程规范"
      },
      {
        "level": 3,
        "title": "1. 组织拓扑树名称纯净化与未接入工厂硬隔离 (`standard-org-tree.tsx`, `equipment/page.tsx`)",
        "id": "1-组织拓扑树名称纯净化与未接入工厂硬隔离-standard-org-tree-tsx-equipment-page-tsx"
      },
      {
        "level": 3,
        "title": "2. 能源成本分析 2×4 对称工业看板与下钻架构 (`energy/cost/page.tsx`)",
        "id": "2-能源成本分析-2-4-对称工业看板与下钻架构-energy-cost-page-tsx"
      },
      {
        "level": 3,
        "title": "3. 能效对标容量单位与时间筛选隔离 (`energy/benchmark/page.tsx`)",
        "id": "3-能效对标容量单位与时间筛选隔离-energy-benchmark-page-tsx"
      },
      {
        "level": 3,
        "title": "4. 零碳工厂自评估真实白名单与宏观层级看板 (`project/self/page.tsx`)",
        "id": "4-零碳工厂自评估真实白名单与宏观层级看板-project-self-page-tsx"
      },
      {
        "level": 3,
        "title": "5. 四大统计报表数据清洗与 44px 工业高密表格规范 (`reports/`)",
        "id": "5-四大统计报表数据清洗与-44px-工业高密表格规范-reports"
      },
      {
        "level": 2,
        "title": "三、 官方《园区-工厂对应关系表.et》拓扑核对总结",
        "id": "三-官方-园区-工厂对应关系表-et-拓扑核对总结"
      },
      {
        "level": 2,
        "title": "四、 线上发布验证标准",
        "id": "四-线上发布验证标准"
      }
    ],
    "content": "# 开发手册 - 32. 能碳双中心 13 项客户反馈深度优化与 21 家工厂白名单同构落地开发手册\n\n## 一、 背景与业务动因\n在特变电工能碳数字化双中心平台（零碳园区集控中心 + 产品碳足迹集采中心）的多轮客户业务评审中，针对组织架构名称规范性、未接入园区/单位视觉呈现、能源成本指标分类完备度、单耗对标物理单位精确性、自评估工厂范围真实性等多个维度提出了 13 项细化整改要求。为保证系统在高密度工业监控场景下的严肃性、严谨性与客观中立，研发团队在暗黑科技蓝端（3000端口）与浅色商务端（3001端口）进行了 100% 同构优化与落地。\n\n---\n\n## 二、 关键技术实现与工程规范\n\n### 1. 组织拓扑树名称纯净化与未接入工厂硬隔离 (`standard-org-tree.tsx`, `equipment/page.tsx`)\n- **名称正则脱敏清洗**：\n  - 前端渲染层全面实施 `name.replace(/\\s*\\(.*?\\)/g, '')` 清洗，去除诸如 `(特变电工露娜智能)` 等括号冗余说明，保留精炼工业简称；\n- **9 家未联网单位视觉与交互隔离**：\n  - 沈变（智慧能源、印能公司）、衡变（上开、柯贝尔）、新变厂（智慧能源、银利电气）、鲁缆（智缆公司、昭和公司、曙光公司）统一配置 `unconnected: true`；\n  - 纯字体与图标置灰：`opacity-35 text-slate-400 dark:text-slate-500`，彻底剥离背景底色与彩色徽章；\n  - 交互拦截：设置 `cursor-not-allowed select-none pointer-events-none`，拦截任何点击展开或选中事件，设备数统一标示为 `(0)`。\n\n### 2. 能源成本分析 2×4 对称工业看板与下钻架构 (`energy/cost/page.tsx`)\n- **Card 8 万元产值能源成本补齐**：\n  - 扩充 `COST_METRICS_META.unitOutputCost`，严格规范标题为“万元产值能源成本”，单位 `元/万元`；\n  - 与总用能成本、市电、天然气、外购蒸汽、用油、液氮、水共同构成 2 行 × 4 列的对称高密网格（`grid-cols-2 sm:grid-cols-4`）；\n- **动态下钻与弹窗控制流**：\n  - 仅在用户点击 3 级车间节点（`isWorkshopLevel`）时才激发车间明细弹窗；\n  - 下钻链接文本动态绑定选中实体：`查看该项目公司用能明细 →`。\n\n### 3. 能效对标容量单位与时间筛选隔离 (`energy/benchmark/page.tsx`)\n- **变压器行业容量单位标准化**：\n  - 所有涉及电力变压器综合折算产量及 500kV/220kV/110kV 细分型号的物理量单位由原“台”全面更正为真实工业容量单位 **`万kVA`**；\n- **时间控件防冲突**：\n  - 在产品单耗纵向对标 Tab 下，条件隐藏页面右上角全局时间选择器 `{activeTab !== 'product_vertical' && ( ... )}`，避免与同周期选择器产生维度逻辑竞争。\n\n### 4. 零碳工厂自评估真实白名单与宏观层级看板 (`project/self/page.tsx`)\n- **21 家接入工厂收敛引擎**：\n  - 过滤基础数据字典，将工厂总数由 31 家收敛为真实的 21 家已接入工厂（沈变4、衡变9、新变5、鲁缆1、新缆1、德缆1）；\n  - 集团大盘卡片精准显示 `21 / 21 (100%)`；\n- **Level 2 经营公司宏观 KPI 矩阵**：\n  - 用户选定经营公司时，动态在 5 大维度 Bento 卡片前置渲染 4 张宏观管理指标卡（覆盖进度、清洁消纳、自动采集率、制度齐备度），实现宏观到微观的平滑穿透。\n\n### 5. 四大统计报表数据清洗与 44px 工业高密表格规范 (`reports/`)\n- 报表台账剔除未接入单位，保持 `h-[44px]` 高密工业表格行高与客观时序对比。\n\n---\n\n## 三、 官方《园区-工厂对应关系表.et》拓扑核对总结\n- 官方表中二级单位总数为 **30 家**；\n- 扣除 9 家不具备接入条件的单位，**正好等于 21 家真实接入工厂**；\n- 结构树历史 31 家节点系此前原型误加露娜公司所致，本手册对核算口径作出了权威澄清。\n\n---\n\n## 四、 线上发布验证标准\n1. 双端本地构建：`pnpm build`（77/77 路由 0 错误）；\n2. 线上双端口验证：\n   - 暗黑端：`http://8.215.89.194:3000/zero-carbon/energy/cost` (HTTP 200)\n   - 浅色端：`http://8.215.89.194:3001/zero-carbon/energy/cost` (HTTP 200)\n"
  },
  {
    "id": "manual-33",
    "no": 33,
    "filename": "33_工厂能碳数据录入与申报历史全链路重构及能源模块同构对齐开发手册.md",
    "title": "工厂能碳数据录入与申报历史全链路重构及能源模块同构对齐开发手册",
    "category": "数据录入与组件设计",
    "readTime": "8 分钟",
    "wordCount": 4144,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "📌 一、 业务背景与架构定位",
        "id": "一-业务背景与架构定位"
      },
      {
        "level": 2,
        "title": "🏛️ 二、 核心数据模型与契约结构",
        "id": "二-核心数据模型与契约结构"
      },
      {
        "level": 3,
        "title": "1. 月度申报批次档案模型 (`MonthDeclarationBatch`)",
        "id": "1-月度申报批次档案模型-monthdeclarationbatch"
      },
      {
        "level": 3,
        "title": "2. 状态字典与时序切换机制",
        "id": "2-状态字典与时序切换机制"
      },
      {
        "level": 2,
        "title": "🎨 三、 工业人机交互与反过度设计准则",
        "id": "三-工业人机交互与反过度设计准则"
      },
      {
        "level": 3,
        "title": "1. 三位一体工具栏规范（双模块 100% 对齐）",
        "id": "1-三位一体工具栏规范-双模块-100-对齐"
      },
      {
        "level": 3,
        "title": "2. 月份选择器防误触状态机",
        "id": "2-月份选择器防误触状态机"
      },
      {
        "level": 3,
        "title": "3. 表格 44px 强制行高与数据对齐",
        "id": "3-表格-44px-强制行高与数据对齐"
      },
      {
        "level": 3,
        "title": "4. 彻底剥离多余说明与衍生卡片（极简工业形态）",
        "id": "4-彻底剥离多余说明与衍生卡片-极简工业形态"
      },
      {
        "level": 2,
        "title": "📂 四、 申报全量档案详情弹窗 (`MonthDeclarationDetailModal`)",
        "id": "四-申报全量档案详情弹窗-monthdeclarationdetailmodal"
      },
      {
        "level": 3,
        "title": "1. 结构与功能设计",
        "id": "1-结构与功能设计"
      },
      {
        "level": 2,
        "title": "🚀 五、 双端同构与 DevOps 生产发布流水线",
        "id": "五-双端同构与-devops-生产发布流水线"
      },
      {
        "level": 3,
        "title": "1. 双端同构研发规范",
        "id": "1-双端同构研发规范"
      },
      {
        "level": 3,
        "title": "2. 生产环境自动化发布配置",
        "id": "2-生产环境自动化发布配置"
      }
    ],
    "content": "# 📖 33. 工厂能碳数据录入与申报历史全链路重构及能源模块同构对齐开发手册\n\n> **文档版本**：v1.0  \n> **更新时间**：2026-09-09  \n> **适用模块**：基础管理 · 数据录入 (`/zero-carbon/config/entry`)  \n> **工程规范遵循**：`tbea-industrial-design` 工业反冗余规范、44px 工业表格标准、暗黑/浅色双端同构\n\n---\n\n## 📌 一、 业务背景与架构定位\n\n特变电工“零碳园区集控中心 + 产品碳足迹集采中心”数字化平台中，工厂能碳数据填报（`entry`）承担着基层制造分厂（沈变、衡变、新变、鲁缆等）每月核心工业生产产品（变压器、电抗器、硅钢铁心等）完工产量、7 大物理能源介质（电、水、气、汽、柴油等）以及财务发票支出的数据归集工作。\n\n本手册针对系统从早期“松散表单模式”向“**高密度列表化、4级工业级联选配、按自然月归档管理、全量申报档案在线闭环**”的架构演进进行完整技术沉淀。\n\n---\n\n## 🏛️ 二、 核心数据模型与契约结构\n\n### 1. 月度申报批次档案模型 (`MonthDeclarationBatch`)\n```typescript\nexport interface MonthBatchProductItem {\n  id: string\n  productId: string\n  modelId?: string\n  categoryName: string\n  categoryId: string\n  subTypeName: string\n  modelName: string\n  modelCode: string\n  plannedOutput: string // 🌟 计划产量\n  output: string        // 🌟 完工产量\n  unit: string          // 申报计量单位 (台/万kVA, 吨, km等)\n  workshop: string      // 归属制造分厂/车间\n  lastMonthValue: string\n  sourceType: 'auto' | 'manual' | 'mes'\n  sourceLabel: string\n  remark?: string\n}\n\nexport interface MonthBatchEnergySummary {\n  gridPowerWanKwh: string   // 外购网电 (万kWh)\n  pvPowerWanKwh: string     // 自发自用光伏 (万kWh)\n  greenPowerWanKwh: string  // 购买消纳绿电 (万kWh)\n  waterTon: string          // 工业自来水 (吨)\n  gasWanM3: string          // 工业天然气 (万m³)\n  steamTon: string          // 高压蒸汽消耗量 (吨)\n  dieselL: string           // 工业柴油 (升)\n  powerCostWan: string      // 电费支出 (万元)\n  waterCostWan: string      // 水费支出 (万元)\n  gasCostWan: string        // 燃气费支出 (万元)\n  steamCostWan: string      // 蒸汽费支出 (万元)\n  totalCostWan: string      // 综合能耗总支出 (万元)\n}\n\nexport interface MonthDeclarationBatch {\n  id: string\n  batch: string\n  year: string\n  month: string\n  reportingUnit: string\n  submitter: string\n  submitTime: string\n  status: '已入库' | '待复核'\n  products: MonthBatchProductItem[]\n  energy: MonthBatchEnergySummary\n  photosCount: number\n  eventsCount: number\n  summary: string\n}\n```\n\n### 2. 状态字典与时序切换机制\n为了支撑多月份申报数据的快速无缝切换，工程采用双时序映射字典：\n```typescript\n// 月度产品台账字典: '2026-08' -> ProductItem[]\nconst [monthlyProductsMap, setMonthlyProductsMap] = useState<Record<string, ProductItem[]>>({...})\n\n// 月度能源指标字典: '2026-08' -> MetricItem[]\nconst [monthlyEnergyMap, setMonthlyEnergyMap] = useState<Record<string, MetricItem[]>>({})\n```\n在切换申报月份函数 `handleSwitchReportingMonth(newYear, newMonth)` 中：\n1. 自动快照保存当前 `selectedYear-selectedMonth` 下的 `activeProducts` 和 `metrics`；\n2. 加载目标月份已有数据或基于预置历史批次进行精准还原；\n3. 杜绝因月份切换导致的数据丢失或错乱。\n\n---\n\n## 🎨 三、 工业人机交互与反过度设计准则\n\n### 1. 三位一体工具栏规范（双模块 100% 对齐）\n无论是【产品产量】还是【能源消耗】模块，标题卡片右侧均统一采用三位一体工具栏：\n- **位置 1 · 申报月份选择器**：`[ 📅 申报月份: 2026年08月 ▾ ]`\n- **位置 2 · 主添加按钮**：\n  - 产品产量：`[ + 添加产品 ]`\n  - 能源消耗：`[ + 添加类型 ]`\n- **位置 3 · 历史台账入口**：`[ ⏱ 历史台账 ({monthBatches.length}期) ]`\n\n### 2. 月份选择器防误触状态机\n- 下拉 4x3 月份矩阵弹窗；\n- **已申报归档月份**（2026-01 至 2026-07）：样式呈现为中划线、文字透明度 35%、带 `cursor-not-allowed select-none`，彻底禁止点击选择，保证历史审计归档的严肃性；\n- **当前填报月份**（2026-08）：高亮主色背景、加粗 Mono 字体、带「填报中」状态；\n- **未申报月份**：呈现「待申报」状态并支持点击直接切换。\n\n### 3. 表格 44px 强制行高与数据对齐\n- 全站数据表格严格遵循 `h-[44px]`，垂直居中对齐；\n- 具备 RowSpan 连续同类别单元格纵向合并能力（如变压器下多规格、实物消耗量下多介质），居中展示分类名称与项数，大幅降低信息重复噪点；\n- 行内直接配备计划产量与完工数量输入框，失焦与回车实时重算品类总产量与财务支出；\n- 操作列提供 `<Edit3>` 编辑与 `<Trash2>` 删除按钮，点击编辑唤起标准化参数修改弹窗。\n\n### 4. 彻底剥离多余说明与衍生卡片（极简工业形态）\n- **工作台**：全面移除原产品产量与能源消耗表格上方的 8 张汇总 KPI 卡片行，首屏直达高密表格；\n- **历史台账**：\n  - 彻底移除表格中的【申报批次号】列（DR-xxxxxx-xx 等内部技术码）；\n  - 彻底剔除历史台账中部的 4 张微统计卡片行（批次统计、覆盖品类、最高支出、最新申报），消除二阶冗余；\n  - 表格精炼为 9 大主干列。\n\n---\n\n## 📂 四、 申报全量档案详情弹窗 (`MonthDeclarationDetailModal`)\n\n### 1. 结构与功能设计\n- **双核心业务 Tab 架构**：\n  1. **产品产量清单**：当月各细分型号计划产量、实际完工产量、计量单位直接表格展示与行内编辑；\n  2. **能源消耗与支出费用**：7 大物理实物介质与 5 大发票支出费用参数展示与行内编辑；\n- **双向流转闭环**：\n  - 弹窗底部提供 `[退回到填报工作台]` 快捷入口；\n  - 智能感知当前处于的产品或能源 Tab，退回时无缝定位到对应的填报视图；\n  - 点击 `[保存全部修改并入库]` 自动更新历史批次数据源，重算摘要并触发全局 Toast。\n\n---\n\n## 🚀 五、 双端同构与 DevOps 生产发布流水线\n\n### 1. 双端同构研发规范\n- 暗黑科技蓝版本 (`d:\\Project\\TJ-nengtan\\产品原型`，端口 3000) 与浅色商务办公版本 (`d:\\Project\\TJ-nengtan\\产品原型-旧\\产品原型`，端口 3001) 必须 100% 保持组件结构、CSS Token、数据字典与交互逻辑完全一致；\n- 每次修改后本地执行 `pnpm build` 双端校验，确保 77/77 路由 0 报错。\n\n### 2. 生产环境自动化发布配置\n- **生产主机**：阿里云 ECS `8.215.89.194`\n- **暗黑端目标目录**：`/var/www/tbea-nengtan`\n- **浅色端目标目录**：`/var/www/tbea-nengtan-old`\n- **发布引擎**：通过 Python Paramiko 自动化脚本打包传输，远程解压并执行 Nginx 热重载 (`sudo systemctl reload nginx`)。\n"
  },
  {
    "id": "manual-34",
    "no": 34,
    "filename": "34_节能效益评估空调系统新增与高密去噪开发手册.md",
    "title": "节能效益评估空调系统新增与高密去噪开发手册",
    "category": "数据录入与组件设计",
    "readTime": "8 分钟",
    "wordCount": 4232,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "一、 业务背景与需求演进脉络",
        "id": "一-业务背景与需求演进脉络"
      },
      {
        "level": 2,
        "title": "二、 空调运行评估体系架构与核心算法",
        "id": "二-空调运行评估体系架构与核心算法"
      },
      {
        "level": 3,
        "title": "1. 核心物理参数与核算模型",
        "id": "1-核心物理参数与核算模型"
      },
      {
        "level": 3,
        "title": "2. 八大关键能效 KPI 卡片矩阵 (4×2 工业网格)",
        "id": "2-八大关键能效-kpi-卡片矩阵-4-2-工业网格"
      },
      {
        "level": 2,
        "title": "三、 图表与高密台账技术实现",
        "id": "三-图表与高密台账技术实现"
      },
      {
        "level": 3,
        "title": "1. 左右黄金比例双图表系统",
        "id": "1-左右黄金比例双图表系统"
      },
      {
        "level": 3,
        "title": "2. 工业高密台账表格与极简去噪落地",
        "id": "2-工业高密台账表格与极简去噪落地"
      },
      {
        "level": 2,
        "title": "四、 双端同构与静态编译验证",
        "id": "四-双端同构与静态编译验证"
      },
      {
        "level": 3,
        "title": "构建审计结果",
        "id": "构建审计结果"
      },
      {
        "level": 2,
        "title": "五、 阿里云 ECS 线上发布与公网核验",
        "id": "五-阿里云-ecs-线上发布与公网核验"
      }
    ],
    "content": "# 34. 节能效益评估空调系统新增与高密去噪开发手册\n\n> **文档版本**：v1.0  \n> **编写时间**：2026年09月10日  \n> **责任角色**：Frontend / Energy Domain / UI-UX / Architect  \n> **关联模块**：专项能效与评估 (`zero-carbon/project/benefit`)  \n> **双端路径**：  \n> - 暗黑科技蓝控制台：`产品原型/app/zero-carbon/project/benefit/page.tsx` (端口 3000)  \n> - 浅色商务办公系统：`产品原型-旧/产品原型/app/zero-carbon/project/benefit/page.tsx` (端口 3001)  \n\n---\n\n## 一、 业务背景与需求演进脉络\n\n在特变电工零碳园区集中管控中枢中，【节能效益评估】（`zero-carbon/project/benefit`）作为工业微电网与综合能源专项运营的核心评估载体，此前已建立**储能运行评估**、**光伏运行评估**与**热泵运行评估**三大评估维度。\n\n随着园区集中制冷站与车间多联机组的数字化接入，用户提出完善集中制冷能效评估的明确需求。同时，结合现场多轮审查与工业设计规范，对台账信息密度与视觉去噪进行了纵深治理。具体演进脉络如下：\n\n1. **新增【空调运行评估】维度**：\n   - 基础监测参数全面覆盖：功率 (kW)、用电量 (kWh)、供冷量 (kWh / GJ)、能效比 COP；\n   - 评估体系参照储能、光伏与热泵成熟架构，补强时序负荷平衡曲线、驱动电能来源结构与工业运行明细台账；\n2. **顶层 Tab 排序优化**：\n   - 依据工程物理拓扑逻辑与用户明确要求，将顶层大 Tab 显示次序调整为：`【储能运行评估】➔【光伏运行评估】➔【热泵运行评估】➔【空调运行评估】`；\n3. **图表规范深度对齐**：\n   - 空调右侧图表全面参考热泵的高密工业规范，接入 `MiniStructureDonut` 双环形架构，实现【驱动电能来源】与【峰谷避峰负荷】的双环并列呈现；\n4. **台账信息纯化去噪**：\n   - **移除建筑层高字段**：热泵与空调运行台账表格彻底剥离【建筑层高 (m)】数据列；\n   - **表头名称去噪**：空调台账第 4 列列头彻底剥离“系统”修饰词，纯化为与热泵完全对齐的纯净 **`COP`**；\n   - **热泵台账彻底移除操作列**：响应用户红框圈选，彻底移除热泵台账最右侧整列操作列（表头【层高折算明细】及行内【层高折算查验】按钮），消除多余入口噪点，释放横向列宽。\n\n---\n\n## 二、 空调运行评估体系架构与核心算法\n\n### 1. 核心物理参数与核算模型\n- **机组实时制冷功率 $P_{cool}$ (kW)**：表征当前制冷机群的瞬时输入有功功率；\n- **当日累计供冷量 $Q_{cool}$ (kWh)**：通过冷冻水供回水温差与流量连续积分：\n  $$Q_{cool} = \\int \\rho \\cdot C_p \\cdot V(t) \\cdot (T_{return}(t) - T_{supply}(t)) \\, dt$$\n- **当日累计耗电量 $E_{elec}$ (kWh)**：制冷主机、冷冻水泵、冷却水泵及冷却塔的有功电度计量总和；\n- **制冷综合性能系数 $\\text{COP}$ (Coefficient of Performance)**：\n  $$\\text{COP} = \\frac{Q_{cool} \\text{ (输出有效制冷量)}}{E_{elec} \\text{ (输入驱动电能)}}$$\n  > *系统定义*：COP 严格采用“**制冷量 / 耗电量**”比值模型，数值越高代表机组能效等级越优；当前运行中位区间为 `3.82 ~ 4.25`；\n- **折算面积供冷单耗指标**：\n  $$\\text{单位折算面积日供冷电耗} = \\frac{E_{elec} \\text{ (kWh)}}{S_{calc} \\text{ (折算供冷面积 } \\text{m}^2 \\text{)}} \\quad (\\text{kWh/m}^2 \\cdot \\text{d})$$\n\n### 2. 八大关键能效 KPI 卡片矩阵 (4×2 工业网格)\n| 卡片序号 | 指标名称 | 当前量值 | 额定设计 / 同比基准 | 工业语义 |\n| :---: | :--- | :---: | :---: | :--- |\n| **01** | **制冷机组实时总功率** | `4,850 kW` | 额定负荷率 74.6% | 瞬时电气负荷监控 |\n| **02** | **当日综合制冷 COP** | `4.18` | 设定能效基准 3.80 | 全天运行能效综合水准 |\n| **03** | **当日累计供冷量** | `13.56 万 kWh` | 同比昨时 +3.2% | 冷负荷供给总量 |\n| **04** | **当日制冷总用电量** | `3.24 万 kWh` | 同比昨时 +1.8% | 动力电能消耗总计 |\n| **05** | **原始供冷覆盖面积** | `18.60 万 m²` | 6大基地28个车间 | 物理建筑物实际覆盖面积 |\n| **06** | **折算供冷面积** | `22.45 万 m²` | 高大厂房体积修正 | 经过高大空间标准修正后面积 |\n| **07** | **单位折算面积供冷耗电** | `0.144 kWh/m²·d` | 优于设计值 12.0% | 单位标准化面积用能强度 |\n| **08** | **清洁绿电供冷占比** | `74.5%` | 尖峰占比仅 22.8% | 绿色用能与避峰削峰成效 |\n\n---\n\n## 三、 图表与高密台账技术实现\n\n### 1. 左右黄金比例双图表系统\n- **左侧 8/12：24小时连续负荷与制冷能效时序平衡走势 (ComposedChart)**\n  - 双纵轴混排架构：左轴为负荷/能力 (kW)，右轴为实时 COP 比值；\n  - 呈现 3 条高频曲线：\n    - `实时制冷供冷负荷 (kW)`（青色面积高亮渐变）\n    - `机组实时用电功率 (kW)`（深灰蓝实线）\n    - `瞬时运行能效比 COP`（橙色点划线，右轴）\n  - 动态呈现午间 12:00~15:00 尖峰负荷与 COP 波动走势。\n- **右侧 4/12：MiniStructureDonut 驱动电能来源与避峰时段双环形构成**\n  - **左环【驱动电能来源】**：\n    - 清洁绿电直供：`74.5%`（中心大字呈现 `74.5% / 清洁绿电`）；\n    - 市电低谷电网：`20.8%`；\n    - 市电平段补充：`4.7%`；\n  - **右环【峰谷负荷分布】**（以极细分割线隔离）：\n    - 平谷避峰供冷：`77.2%`（中心大字呈现 `77.2% / 避峰供冷`）；\n    - 尖峰时段耗电：`22.8%`；\n  - 彻底摒弃普通大环形，采用纯 SVG 矢量微型环图与标准图例清单，与热泵模块达到 100% 视觉规范统一。\n\n### 2. 工业高密台账表格与极简去噪落地\n- **表格行高强制 44px (`h-[44px]`)**：符合高密度工业控制台操作规范；\n- **字段纯粹化重构**：\n  - 彻底移除【建筑层高 (m)】数据列；\n  - 空调台账表头纯化定名为 **`COP`**（去除多余“系统”修饰词）；\n  - 热泵台账彻底移除【层高折算明细】表头及【层高折算查验】按钮列；\n- **纯粹台账字段结构**：\n  `空调项目名称` | `所属园区/基地` | `机组额定容量` | `COP` | `当日供冷量 (kWh)` | `当日耗电量 (kWh)` | `原始供冷面积 (m²)` | `折算供冷面积 (m²)` | `单位面积供冷耗电` | `清洁绿电占比` | `尖峰用电占比` | `日综合运行节费`\n\n---\n\n## 四、 双端同构与静态编译验证\n\n本项目严格遵循暗黑科技蓝与浅色商务办公端 100% 同构研发准则：\n- **暗黑科技蓝端 (端口 3000)**：`产品原型/app/zero-carbon/project/benefit/page.tsx`\n- **浅色商务端 (端口 3001)**：`产品原型-旧/产品原型/app/zero-carbon/project/benefit/page.tsx`\n\n### 构建审计结果\n```bash\n# 双端 Next.js 16 静态导出编译\npnpm build\n```\n- **暗黑端**：`77/77` 静态路由全量编译通过，0 Error / 0 Warning，静态产物耗时 1299ms；\n- **浅色端**：`77/77` 静态路由全量编译通过，0 Error / 0 Warning，静态产物耗时 1216ms。\n\n---\n\n## 五、 阿里云 ECS 线上发布与公网核验\n\n- **生产宿主机**：`8.215.89.194`\n- **部署路径**：\n  - 暗黑科技蓝端：`/var/www/tbea-nengtan` (端口 3000)\n  - 浅色商务办公端：`/var/www/tbea-nengtan-old` (端口 3001)\n- **Nginx 服务热重载**：`sudo systemctl reload nginx`\n- **公网探测验证**：\n  - `http://8.215.89.194:3000/zero-carbon/project/benefit` ➔ **HTTP 200 OK**\n  - `http://8.215.89.194:3001/zero-carbon/project/benefit` ➔ **HTTP 200 OK**\n  - 新版【空调运行评估】、4 大评估维度选项卡与纯化台账已全量在公网生效运行。\n"
  },
  {
    "id": "manual-35",
    "no": 35,
    "filename": "35_指标管控产品大类与产品种类标准字典开发手册.md",
    "title": "指标管控产品大类与产品种类标准字典开发手册",
    "category": "数据录入与组件设计",
    "readTime": "69 分钟",
    "wordCount": 34338,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "一、 编制背景与业务价值 (Context & Business Purpose)",
        "id": "一-编制背景与业务价值-context-business-purpose"
      },
      {
        "level": 3,
        "title": "1.1 建设背景与历史痛点",
        "id": "1-1-建设背景与历史痛点"
      },
      {
        "level": 3,
        "title": "1.2 统一的标准四级数据层级模型 (Standard 4-Tier Hierarchy)",
        "id": "1-2-统一的标准四级数据层级模型-standard-4-tier-hierarchy"
      },
      {
        "level": 2,
        "title": "二、 两大主产业分类与产线映射全景表 (Industry & Line Taxonomy)",
        "id": "二-两大主产业分类与产线映射全景表-industry-line-taxonomy"
      },
      {
        "level": 2,
        "title": "三、 电器产业 17 大制造产线与 199 项 ERP 产品种类标准字典",
        "id": "三-电器产业-17-大制造产线与-199-项-erp-产品种类标准字典"
      },
      {
        "level": 3,
        "title": "3.1 产线：配变产线（中特）（折算单位：`万kVA`，共 7 项产品种类）",
        "id": "3-1-产线-配变产线-中特-折算单位-万kva-共-7-项产品种类"
      },
      {
        "level": 3,
        "title": "3.2 产线：高压产线（折算单位：`万kVA`，共 9 项产品种类）",
        "id": "3-2-产线-高压产线-折算单位-万kva-共-9-项产品种类"
      },
      {
        "level": 3,
        "title": "3.3 产线：超高压产线（折算单位：`万kVA`，共 8 项产品种类）",
        "id": "3-3-产线-超高压产线-折算单位-万kva-共-8-项产品种类"
      },
      {
        "level": 3,
        "title": "3.4 产线：特高压产线（折算单位：`万kVA`，共 4 项产品种类）",
        "id": "3-4-产线-特高压产线-折算单位-万kva-共-4-项产品种类"
      },
      {
        "level": 3,
        "title": "3.5 产线：其他（折算单位：`台`，共 99 项产品种类）",
        "id": "3-5-产线-其他-折算单位-台-共-99-项产品种类"
      },
      {
        "level": 3,
        "title": "3.6 产线：配变产线（油变）（折算单位：`万kVA`，共 7 项产品种类）",
        "id": "3-6-产线-配变产线-油变-折算单位-万kva-共-7-项产品种类"
      },
      {
        "level": 3,
        "title": "3.7 产线：硅钢产线（横剪）（折算单位：`吨`，共 4 项产品种类）",
        "id": "3-7-产线-硅钢产线-横剪-折算单位-吨-共-4-项产品种类"
      },
      {
        "level": 3,
        "title": "3.8 产线：配变产线（干变）（折算单位：`万kVA`，共 3 项产品种类）",
        "id": "3-8-产线-配变产线-干变-折算单位-万kva-共-3-项产品种类"
      },
      {
        "level": 3,
        "title": "3.9 产线：配变产线（箱变）（折算单位：`万kVA`，共 3 项产品种类）",
        "id": "3-9-产线-配变产线-箱变-折算单位-万kva-共-3-项产品种类"
      },
      {
        "level": 3,
        "title": "3.10 产线：电抗器产线（干式空心）（折算单位：`台`，共 2 项产品种类）",
        "id": "3-10-产线-电抗器产线-干式空心-折算单位-台-共-2-项产品种类"
      }
    ],
    "content": "# 📚 35_指标管控产品大类与产品种类标准字典开发手册\n\n> **文档元数据 (Document Metadata)**  \n> - **版本号**：V1.0  \n> - **编制日期**：2026-09-11  \n> - **适用团队**：特变电工能碳数字化双中心研发团队（PM / 前端开发 / 后端架构 / 数据治理 / QA测试）  \n> - **关联系统模块**：\n>   - 集中监管中心 · 指标管控看板 (`zero-carbon/monitor/indicator`)\n>   - 能耗能效分析 · 单位产品能耗与能效对标 (`zero-carbon/energy/unit-product` & `benchmark`)\n>   - 产品碳足迹集采中心 · 实景数据库与对比分析 (`carbon-footprint/database/accounting` & `compare` / `ranking`)\n> - **权威参考依据**：\n>   1. 《01-6 产品分类与产线匹配关系-外发.xlsx》（电气产业产线分类、ERP 导出产品分类、物料与型号明细）\n>   2. 《线缆产线分类.xlsx》（线缆产业 8 大产线、14 大产品大类、50+ 产品中类、519 项产品细分四级编码）\n>   3. 《生产单位与涉及关键工序对应表(1).et》（6 大经营单位 21 家重点工厂组织白名单与关键工序定义）\n>   4. 《“双中心”项目能碳管控指标体系V1.5(1).xlsx》与《能碳管控指标体系-整体产品工序指标.xlsx》\n\n---\n\n## 一、 编制背景与业务价值 (Context & Business Purpose)\n\n### 1.1 建设背景与历史痛点\n在特变电工数字化平台建设初期，各直属经营单位（沈变、衡变、新变、鲁缆、新缆、德缆）与下属 21 家专业工厂在上报生产台账、能耗指标与碳足迹核算数据时，存在以下结构性痛点：\n1. **层级概念混淆与错位**：“产品大类”、“产线分类”、“产品种类（中类/子类）”与“具体产品型号”在不同系统页面中混用。例如在能效对标与集采中心曾将型号（如 `SFZ11-110`、`YJV-0.6/1kV`）直接作为主筛选条件，导致列表臃肿、跨厂对比维度失焦；\n2. **ERP 数据口径脱节**：各厂 ERP 系统导出的产品类别字符串冗长（如 `制造业-变压器产品-交流变压器-35KV及以下`），前端若直接切分或展示会导致排版混乱，缺少工业级简明标准映射；\n3. **主观评价与虚假对抗**：部分老版本页面存在跨产业跨品类的虚假横向对比和主观评价用语，严重违背特变电工实事求是的工业中立性原则。\n\n### 1.2 统一的标准四级数据层级模型 (Standard 4-Tier Hierarchy)\n为彻底解决上述问题，本项目在前端与数据层全面固化**统一的四级产品分类与能碳核算体系**：\n\n```\nLevel 1: 产业 (Industry)\n  ├── 电器产业 (变压器产业 / 电气装备)\n  └── 线缆产业 (电线电缆产业)\n        │\nLevel 2: 产品大类 (Major Category / 对应产线分类 Line Category)\n  ├── 电器: 变压器-高压、变压器-中低压-油变、变压器-中低压-干变、套管、互感器、GIS、GIL、电抗器、电容器、开关柜等\n  └── 线缆: 电力电缆、电气装备用电线电缆、裸导线/架空导线、特种电缆、橡套电缆、控制电缆、风电电缆、光伏电缆等\n        │\nLevel 3: 产品种类 / 产品中类 / 产线子分类 (Product Subcategory / Medium Category)\n  ├── 电器: 交流变压器-110KV、特种变压器-电炉变、干式配变-H级干变、高压开关-GIS-126至145kV、交流套管-72.5至252kV 等 (共 222+ 项 ERP 权威子分类)\n  └── 线缆: 铝合金绞线、钢芯铝绞线、0.6/1kV XLPE电力电缆、6~35kV 中压电缆、船用电缆、光伏专用电缆、通用橡套电缆 等 (共 50+ 核心中类)\n        │\nLevel 4: 代表型号 / 规格实例 (Representative Models / Spec)\n  ├── 电器: SFZ-63000/110, SFSZ-120000/220, SCB13-1600, ZF-126/T2000-40 等\n  └── 线缆: YJV-0.6/1kV 4*240, JL/G1A-400/35, WDZN-BYJ-2.5, YCW-3*16+1*10 等\n```\n\n---\n\n## 二、 两大主产业分类与产线映射全景表 (Industry & Line Taxonomy)\n\n| 一级主产业 | 二级产品大类 (业务/集采维度) | 对应标准产线分类 (指标管控维度) | 产量折算统计单位 | 涉及核心经营单位与基地 |\n| :--- | :--- | :--- | :---: | :--- |\n| **电器产业** | 变压器-高压 | 高压产线、超高压产线、特高压产线 | `万kVA` | 沈变本部、衡变本部、新变厂、超高压公司、特缆建 |\n| **电器产业** | 变压器-中低压-油变 | 配变产线（油变）、配变产线（中特） | `万kVA` | 新变厂、衡变本部、湖南电气、智能电气、京津冀科技 |\n| **电器产业** | 变压器-中低压-干变 | 配变产线（干变）、配变产线（中特） | `万kVA` | 天变公司（天津基地/沈阳基地/衡阳基地）、智能电气 |\n| **电器产业** | 箱式变电站 | 配变产线（箱变） | `台` / `万kVA` | 天变智能科技、衡变本部、新变厂、京津冀科技 |\n| **电器产业** | 变压器-铁芯 | 硅钢产线（横剪） | `吨` | 珠峰硅钢、新变厂 |\n| **电器产业** | 套管 | 套管产线 | `支` | 和新套管公司（沈变旗下） |\n| **电器产业** | 互感器 | 互感器产线 | `台` | 康嘉互感器（沈变旗下） |\n| **电器产业** | 高压组合电器 GIS | GIS 产线 | `间隔` | 衡变公司（云集高压开关、上开） |\n| **电器产业** | 管道母线 GIL | GIL 产线 | `百米` | 衡变公司（事杰爱迪） |\n| **电器产业** | 干式电抗器 | 电抗器产线（干式空心） | `台` | 衡变本部、合容电气（西安基地） |\n| **电器产业** | 电容器 | 电容器产线（油浸式/干式） | `台` | 衡变公司（合容电气股份、合容电力设备、科贝尔） |\n| **电器产业** | 中低压开关柜 | 开关柜产线、二次产线 | `面` | 衡变公司（云集电气、南京公司、新疆自控、合容开关） |\n| **线缆产业** | 裸导线 / 架空导线 | 导线产线 | `吨` / `万m` | 鲁缆本部、新缆厂本部、德缆公司本部 |\n| **线缆产业** | 布电线 | 布电线产线 | `万m` / `km` | 鲁缆公司、新缆厂、德缆公司、新疆电缆 |\n| **线缆产业** | 低压电力电缆 | 低压力缆产线 | `万m` / `km` | 鲁缆公司、新缆厂、德缆公司、新疆电缆 |\n| **线缆产业** | 中压电力电缆 | 中压力缆产线 | `万m` / `km` | 鲁缆公司、新缆厂、德缆公司、新疆电缆 |\n| **线缆产业** | 高压电力电缆 | 高压力缆产线 | `万m` / `km` | 鲁缆本部、新缆厂本部、德缆公司本部 |\n| **线缆产业** | 电气装备用电缆 | 电气装备电缆产线 | `万m` / `km` | 鲁缆公司、新缆厂、德缆公司、新疆电缆 |\n| **线缆产业** | 橡套电缆 | 橡套电缆产线 | `万m` / `km` | 鲁缆本部、新缆厂本部、德缆公司本部 |\n| **线缆产业** | 特种电缆 | 特种电缆产线 | `万m` / `km` | 昭和公司、曙光公司、鲁缆公司、新缆厂、德缆公司 |\n\n---\n\n## 三、 电器产业 17 大制造产线与 199 项 ERP 产品种类标准字典\n\n依据《01-6 产品分类与产线匹配关系-外发.xlsx》Sheet【电气产业ERP产品分类与产线匹配】，系统收录了完整的 17 大制造产线共 199 项 ERP 导出产品分类标准映射（另含 23 项集成服务业衍生分类）。\n\n### 3.1 产线：配变产线（中特）（折算单位：`万kVA`，共 7 项产品种类）\n\n| 序号 | 10位 ERP 产品编码 | 产品种类简明名称 (中类) | ERP 导出完整产品说明 (全称) | 统计折算单位 | 核心管控单耗指标 |\n| :---: | :---: | :--- | :--- | :---: | :--- |\n| 1 | `1001010101` | **35KV及以下** | 制造业-变压器产品-交流变压器-35KV及以下 | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n| 2 | `1001030101` | **35kV及以下** | 制造业-变压器产品-特种变压器-工业整流变-35kV及以下 | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n| 3 | `1001030201` | **35kV** | 制造业-变压器产品-特种变压器-电炉变-35kV | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n| 4 | `1001030304` | **2*27.5自耦变** | 制造业-变压器产品-特种变压器-站用牵引变-2*27.5自耦变 | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n| 5 | `1001030401` | **10kV** | 制造业-变压器产品-特种变压器-地铁牵引整流变-10kV | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n| 6 | `1001030402` | **35kV** | 制造业-变压器产品-特种变压器-地铁牵引整流变-35kV | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n| 7 | `1001050101` | **35kV以下** | 制造业-变压器产品-电抗器-油浸式电抗器-35kV以下 | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n\n### 3.2 产线：高压产线（折算单位：`万kVA`，共 9 项产品种类）\n\n| 序号 | 10位 ERP 产品编码 | 产品种类简明名称 (中类) | ERP 导出完整产品说明 (全称) | 统计折算单位 | 核心管控单耗指标 |\n| :---: | :---: | :--- | :--- | :---: | :--- |\n| 1 | `1001010201` | **110KV** | 制造业-变压器产品-交流变压器-110KV | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n| 2 | `1001010301` | **220KV** | 制造业-变压器产品-交流变压器-220KV | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n| 3 | `1001020101` | **±400kv及以下** | 制造业-变压器产品-直流变压器-±400kv及以下 | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n| 4 | `1001030102` | **110kV** | 制造业-变压器产品-特种变压器-工业整流变-110kV | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n| 5 | `1001030103` | **220kV** | 制造业-变压器产品-特种变压器-工业整流变-220kV | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n| 6 | `1001030202` | **110kV** | 制造业-变压器产品-特种变压器-电炉变-110kV | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n| 7 | `1001030301` | **110kV** | 制造业-变压器产品-特种变压器-站用牵引变-110kV | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n| 8 | `1001030302` | **220kV** | 制造业-变压器产品-特种变压器-站用牵引变-220kV | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n| 9 | `1001050102` | **66至220kV** | 制造业-变压器产品-电抗器-油浸式电抗器-66至220kV | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n\n### 3.3 产线：超高压产线（折算单位：`万kVA`，共 8 项产品种类）\n\n| 序号 | 10位 ERP 产品编码 | 产品种类简明名称 (中类) | ERP 导出完整产品说明 (全称) | 统计折算单位 | 核心管控单耗指标 |\n| :---: | :---: | :--- | :--- | :---: | :--- |\n| 1 | `1001010401` | **330KV** | 制造业-变压器产品-交流变压器-330KV | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n| 2 | `1001010501` | **500KV** | 制造业-变压器产品-交流变压器-500KV | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n| 3 | `1001010601` | **750kV** | 制造业-变压器产品-交流变压器-750kV | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n| 4 | `1001020201` | **±500kv** | 制造业-变压器产品-直流变压器-±500kv | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n| 5 | `1001020301` | **±600kv** | 制造业-变压器产品-直流变压器-±600kv | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n| 6 | `1001030303` | **330kV** | 制造业-变压器产品-特种变压器-站用牵引变-330kV | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n| 7 | `1001050103` | **330至500kV** | 制造业-变压器产品-电抗器-油浸式电抗器-330至500kV | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n| 8 | `1001050104` | **750kV** | 制造业-变压器产品-电抗器-油浸式电抗器-750kV | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n\n### 3.4 产线：特高压产线（折算单位：`万kVA`，共 4 项产品种类）\n\n| 序号 | 10位 ERP 产品编码 | 产品种类简明名称 (中类) | ERP 导出完整产品说明 (全称) | 统计折算单位 | 核心管控单耗指标 |\n| :---: | :---: | :--- | :--- | :---: | :--- |\n| 1 | `1001010701` | **1000kV** | 制造业-变压器产品-交流变压器-1000kV | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n| 2 | `1001020401` | **±800kv** | 制造业-变压器产品-直流变压器-±800kv | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n| 3 | `1001020501` | **±1100kv** | 制造业-变压器产品-直流变压器-±1100kv | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n| 4 | `1001050105` | **1000kV** | 制造业-变压器产品-电抗器-油浸式电抗器-1000kV | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n\n### 3.5 产线：其他（折算单位：`台`，共 99 项产品种类）\n\n| 序号 | 10位 ERP 产品编码 | 产品种类简明名称 (中类) | ERP 导出完整产品说明 (全称) | 统计折算单位 | 核心管控单耗指标 |\n| :---: | :---: | :--- | :--- | :---: | :--- |\n| 1 | `1001039999` | **其他** | 制造业-变压器产品-特种变压器-其他 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 2 | `1001070101` | **国际电表** | 制造业-变压器产品-变压器辅助控制-国际电表 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 3 | `1001070203` | **监测** | 制造业-变压器产品-变压器辅助控制-变压器附控-监测 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 4 | `1001070204` | **中性点** | 制造业-变压器产品-变压器辅助控制-变压器附控-中性点 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 5 | `1001070206` | **其他** | 制造业-变压器产品-变压器辅助控制-变压器附控-其他 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 6 | `1002019999` | **其他** | 制造业-延伸类-高压开关-其他 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 7 | `1002029999` | **其他** | 制造业-延伸类-套管-其他 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 8 | `1002039999` | **其他** | 制造业-延伸类-互感器-其他 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 9 | `1003010101` | **裸导线** | 制造业-线缆行业-裸导线 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 10 | `1003010104` | **裸导线** | 制造业-线缆行业-裸导线 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 11 | `1003020101` | **布电线** | 制造业-线缆行业-布电线 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 12 | `1003030101` | **通用橡套软电缆** | 制造业-线缆行业-通用橡套软电缆 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 13 | `1003040101` | **低压XLPE绝缘电力电缆** | 制造业-线缆行业-低压XLPE绝缘电力电缆 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 14 | `1003050101` | **低压PVC绝缘电力电缆** | 制造业-线缆行业-低压PVC绝缘电力电缆 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 15 | `1003050201` | **交联电缆（中低压）** | 制造业-线缆行业-交联电缆-交联电缆（中低压） | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 16 | `1003060101` | **中压电力电缆** | 制造业-线缆行业-中压电力电缆 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 17 | `1003070101` | **电磁线** | 制造业-线缆行业-电磁线 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 18 | `1003080101` | **PVC绝缘控制电缆** | 制造业-线缆行业-PVC绝缘控制电缆 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 19 | `1003090101` | **电缆附件** | 制造业-线缆行业-电缆附件 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 20 | `1003100101` | **铜杆** | 制造业-线缆行业-铜杆 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 21 | `1003110101` | **铝杆** | 制造业-线缆行业-铝杆 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 22 | `1003120101` | **PVC料** | 制造业-线缆行业-PVC料 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 23 | `1003130101` | **工装轮** | 制造业-线缆行业-工装轮 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 24 | `1003140101` | **架空绝缘电缆** | 制造业-线缆行业-架空绝缘电缆 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 25 | `1003150101` | **PVC绝缘控制电缆** | 制造业-线缆行业-PVC绝缘控制电缆 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 26 | `1003160101` | **XLPE绝缘控制电缆** | 制造业-线缆行业-XLPE绝缘控制电缆 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 27 | `1003170101` | **矿用橡套电缆** | 制造业-线缆行业-矿用橡套电缆 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 28 | `1003180101` | **矿用塑料电力电缆** | 制造业-线缆行业-矿用塑料电力电缆 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 29 | `1003190101` | **计算机电缆** | 制造业-线缆行业-计算机电缆 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 30 | `1003200101` | **氟塑料绝缘电缆** | 制造业-线缆行业-氟塑料绝缘电缆 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 31 | `1003210101` | **预分支电缆** | 制造业-线缆行业-预分支电缆 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 32 | `1003220101` | **光伏电缆** | 制造业-线缆行业-光伏电缆 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 33 | `1003230101` | **变频电缆** | 制造业-线缆行业-变频电缆 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 34 | `1003240101` | **国外标准电缆** | 制造业-线缆行业-国外标准电缆 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 35 | `1003250101` | **防火电缆** | 制造业-线缆行业-防火电缆 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 36 | `1003260101` | **高压电力电缆** | 制造业-线缆行业-高压电力电缆 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 37 | `1003270101` | **风电电缆** | 制造业-线缆行业-风电电缆 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 38 | `1003280101` | **盾构机电缆** | 制造业-线缆行业-盾构机电缆 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 39 | `1003290101` | **船用电缆** | 制造业-线缆行业-船用电缆 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 40 | `1003300101` | **硅橡胶绝缘电缆** | 制造业-线缆行业-硅橡胶绝缘电缆 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 41 | `1003310101` | **其他电缆** | 制造业-线缆行业-其他电缆 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 42 | `1003999999` | **其他** | 制造业-线缆行业-其他 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 43 | `1004010101` | **500KW** | 制造业-新能源行业-逆变器-集中式并网逆变器-500KW | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 44 | `1004010102` | **630KW** | 制造业-新能源行业-逆变器-集中式并网逆变器-630KW | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 45 | `1004010199` | **其他** | 制造业-新能源行业-逆变器-集中式并网逆变器-其他 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 46 | `1004010201` | **1MW** | 制造业-新能源行业-逆变器-一体化机房-1MW | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 47 | `1004010202` | **1.25MW** | 制造业-新能源行业-逆变器-一体化机房-1.25MW | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 48 | `1004010203` | **2MW** | 制造业-新能源行业-逆变器-一体化机房-2MW | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 49 | `1004010204` | **2.5MW** | 制造业-新能源行业-逆变器-一体化机房-2.5MW | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 50 | `1004010299` | **其他** | 制造业-新能源行业-逆变器-一体化机房-其他 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 51 | `1004010301` | **40KW及以下** | 制造业-新能源行业-逆变器-组串式逆变器-40KW及以下 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 52 | `1004010302` | **50KW** | 制造业-新能源行业-逆变器-组串式逆变器-50KW | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 53 | `1004010303` | **60KW及以上** | 制造业-新能源行业-逆变器-组串式逆变器-60KW及以上 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 54 | `1004019999` | **其他** | 制造业-新能源行业-逆变器-其他 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 55 | `1004020101` | **SVG** | 制造业-新能源行业-SVG | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 56 | `1004030101` | **充电桩产品** | 制造业-新能源行业-充电桩产品 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 57 | `1004040101` | **逆变器相关其他产品** | 制造业-新能源行业-逆变器相关其他产品 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 58 | `1004050101` | **多晶硅** | 制造业-新能源行业-多晶硅 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 59 | `1004060101` | **白炭黑** | 制造业-新能源行业-白炭黑 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 60 | `1004070101` | **加气块** | 制造业-新能源行业-加气块 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 61 | `1004080101` | **氮化硅** | 制造业-新能源行业-氮化硅 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 62 | `1004090101` | **液氯** | 制造业-新能源行业-液氯 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 63 | `1004100101` | **片碱** | 制造业-新能源行业-片碱 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 64 | `1004110101` | **柔直产品** | 制造业-新能源行业-柔直产品 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 65 | `1004120101` | **石墨件** | 制造业-新能源行业-石墨件 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 66 | `1004130101` | **硅烷偶联剂** | 制造业-新能源行业-有机硅-硅烷偶联剂 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 67 | `1004140101` | **氯锆** | 制造业-新能源行业-氯锆 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 68 | `1004999999` | **其他** | 制造业-新能源行业-其他 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 69 | `1099999999` | **其他** | 制造业-其他 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 70 | `1301010101` | **自备电厂** | 运营商-自备电厂 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 71 | `1302010101` | **火电电厂** | 运营商-火电电厂 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 72 | `1303010101` | **光伏电厂** | 运营商-光伏电厂 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 73 | `1304010101` | **风能电厂** | 运营商-风能电厂 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 74 | `1305010101` | **充电站** | 运营商-充电站 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 75 | `1306010101` | **售电公司** | 运营商-售电公司 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 76 | `1307010101` | **供热公司** | 运营商-供热公司 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 77 | `1399999999` | **其它** | 运营商-其它 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 78 | `1401010101` | **大块** | 煤炭行业-大块 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 79 | `1402010101` | **中块** | 煤炭行业-中块 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 80 | `1403010101` | **小中块** | 煤炭行业-小中块 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 81 | `1404010101` | **三八块** | 煤炭行业-三八块 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 82 | `1405010101` | **二五块** | 煤炭行业-二五块 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 83 | `1406010101` | **四六块** | 煤炭行业-四六块 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 84 | `1407010101` | **锯采煤** | 煤炭行业-锯采煤 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 85 | `1408010101` | **末煤** | 煤炭行业-末煤 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 86 | `1499999999` | **其它** | 煤炭行业-其它 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 87 | `1501010101` | **会议费** | 服务行业-会议费 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 88 | `1502010101` | **物业费** | 服务行业-物业费 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 89 | `1503010101` | **劳务** | 服务行业-劳务 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 90 | `1504010101` | **花苗** | 服务行业-花苗 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 91 | `1505010101` | **住宿** | 服务行业-住宿 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 92 | `1506010101` | **机票代理** | 服务行业-机票代理 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 93 | `1507010101` | **日用百货** | 服务行业-日用百货 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 94 | `1508010101` | **电费** | 服务行业-电费 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 95 | `1509010101` | **水汽暖** | 服务行业-水汽暖 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 96 | `1510010101` | **餐饮** | 服务行业-餐饮 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 97 | `1599999999` | **其他** | 服务行业-其他 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 98 | `1999999999` | **其他** | 其他 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 99 | `1002049999` | **其他** | 制造业-延伸类-二次-其他 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n\n### 3.6 产线：配变产线（油变）（折算单位：`万kVA`，共 7 项产品种类）\n\n| 序号 | 10位 ERP 产品编码 | 产品种类简明名称 (中类) | ERP 导出完整产品说明 (全称) | 统计折算单位 | 核心管控单耗指标 |\n| :---: | :---: | :--- | :--- | :---: | :--- |\n| 1 | `1001040101` | **硅钢卷铁芯** | 制造业-变压器产品-配电变压器-油浸式配变-硅钢卷铁芯 | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n| 2 | `1001040102` | **硅钢叠铁芯** | 制造业-变压器产品-配电变压器-油浸式配变-硅钢叠铁芯 | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n| 3 | `1001040103` | **非晶合金** | 制造业-变压器产品-配电变压器-油浸式配变-非晶合金 | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n| 4 | `1001040104` | **非晶合金卷铁心** | 制造业-变压器产品-配电变压器-油浸式配变-非晶合金卷铁心 | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n| 5 | `1001040105` | **硅钢叠铁心** | 制造业-变压器产品-配电变压器-油浸式配变-硅钢叠铁心 | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n| 6 | `1001040301` | **台成套招标** | 制造业-变压器产品-配电变压器-配电台成套-台成套招标 | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n| 7 | `1001040302` | **一体化台变** | 制造业-变压器产品-配电变压器-配电台成套-一体化台变 | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n\n### 3.7 产线：硅钢产线（横剪）（折算单位：`吨`，共 4 项产品种类）\n\n| 序号 | 10位 ERP 产品编码 | 产品种类简明名称 (中类) | ERP 导出完整产品说明 (全称) | 统计折算单位 | 核心管控单耗指标 |\n| :---: | :---: | :--- | :--- | :---: | :--- |\n| 1 | `1001040106` | **硅钢叠铁心** | 制造业-变压器产品-配电变压器-组合式变压器-硅钢叠铁心 | `吨` | 单位产品综合能耗 (tce/吨)、单位电耗 (kWh/吨) |\n| 2 | `1001040108` | **硅钢叠铁心** | 制造业-变压器产品-配电变压器-电力变压器-硅钢叠铁心 | `吨` | 单位产品综合能耗 (tce/吨)、单位电耗 (kWh/吨) |\n| 3 | `1001040109` | **柱料** | 制造业-变压器产品-其它-柱料 | `吨` | 单位产品综合能耗 (tce/吨)、单位电耗 (kWh/吨) |\n| 4 | `1001040110` | **条料** | 制造业-变压器产品-其它-条料 | `吨` | 单位产品综合能耗 (tce/吨)、单位电耗 (kWh/吨) |\n\n### 3.8 产线：配变产线（干变）（折算单位：`万kVA`，共 3 项产品种类）\n\n| 序号 | 10位 ERP 产品编码 | 产品种类简明名称 (中类) | ERP 导出完整产品说明 (全称) | 统计折算单位 | 核心管控单耗指标 |\n| :---: | :---: | :--- | :--- | :---: | :--- |\n| 1 | `1001040107` | **硅钢叠铁心** | 制造业-变压器产品-配电变压器-干式配变-硅钢叠铁心 | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n| 2 | `1001040201` | **H级干变** | 制造业-变压器产品-配电变压器-干式配变-H级干变 | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n| 3 | `1001040202` | **F级干变** | 制造业-变压器产品-配电变压器-干式配变-F级干变 | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n\n### 3.9 产线：配变产线（箱变）（折算单位：`万kVA`，共 3 项产品种类）\n\n| 序号 | 10位 ERP 产品编码 | 产品种类简明名称 (中类) | ERP 导出完整产品说明 (全称) | 统计折算单位 | 核心管控单耗指标 |\n| :---: | :---: | :--- | :--- | :---: | :--- |\n| 1 | `1001040401` | **美式箱变** | 制造业-变压器产品-配电变压器-箱式变电站-美式箱变 | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n| 2 | `1001040402` | **欧式箱变** | 制造业-变压器产品-配电变压器-箱式变电站-欧式箱变 | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n| 3 | `1001040403` | **华式箱变** | 制造业-变压器产品-配电变压器-箱式变电站-华式箱变 | `万kVA` | 单位产品综合能耗 (tce/万kVA)、单位电耗 (kWh/万kVA) |\n\n### 3.10 产线：电抗器产线（干式空心）（折算单位：`台`，共 2 项产品种类）\n\n| 序号 | 10位 ERP 产品编码 | 产品种类简明名称 (中类) | ERP 导出完整产品说明 (全称) | 统计折算单位 | 核心管控单耗指标 |\n| :---: | :---: | :--- | :--- | :---: | :--- |\n| 1 | `1001050201` | **110kV以下** | 制造业-变压器产品-电抗器-干式电抗器-110kV以下 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 2 | `1001050202` | **220kV以上** | 制造业-变压器产品-电抗器-干式电抗器-220kV以上 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n\n### 3.11 产线：开关柜产线（折算单位：`面`，共 4 项产品种类）\n\n| 序号 | 10位 ERP 产品编码 | 产品种类简明名称 (中类) | ERP 导出完整产品说明 (全称) | 统计折算单位 | 核心管控单耗指标 |\n| :---: | :---: | :--- | :--- | :---: | :--- |\n| 1 | `1001060101` | **开关柜** | 制造业-变压器产品-开关柜 | `面` | 单位产品综合能耗 (tce/面)、单位电耗 (kWh/面) |\n| 2 | `1001070201` | **控制柜** | 制造业-变压器产品-变压器辅助控制-变压器附控-控制柜 | `面` | 单位产品综合能耗 (tce/面)、单位电耗 (kWh/面) |\n| 3 | `1001070202` | **端子箱** | 制造业-变压器产品-变压器辅助控制-变压器附控-端子箱 | `面` | 单位产品综合能耗 (tce/面)、单位电耗 (kWh/面) |\n| 4 | `1001070205` | **汇控柜** | 制造业-变压器产品-变压器辅助控制-变压器附控-汇控柜 | `面` | 单位产品综合能耗 (tce/面)、单位电耗 (kWh/面) |\n\n### 3.12 产线：GIS 产线（折算单位：`间隔`，共 14 项产品种类）\n\n| 序号 | 10位 ERP 产品编码 | 产品种类简明名称 (中类) | ERP 导出完整产品说明 (全称) | 统计折算单位 | 核心管控单耗指标 |\n| :---: | :---: | :--- | :--- | :---: | :--- |\n| 1 | `1002010101` | **126至145kV** | 制造业-延伸类-高压开关-GIS-126至145kV | `间隔` | 单位产品综合能耗 (tce/间隔)、单位电耗 (kWh/间隔) |\n| 2 | `1002010102` | **252至363kV** | 制造业-延伸类-高压开关-GIS-252至363kV | `间隔` | 单位产品综合能耗 (tce/间隔)、单位电耗 (kWh/间隔) |\n| 3 | `1002010103` | **420至550kV** | 制造业-延伸类-高压开关-GIS-420至550kV | `间隔` | 单位产品综合能耗 (tce/间隔)、单位电耗 (kWh/间隔) |\n| 4 | `1002010201` | **40.5kV** | 制造业-延伸类-高压开关-隔地/接地开关-40.5kV | `间隔` | 单位产品综合能耗 (tce/间隔)、单位电耗 (kWh/间隔) |\n| 5 | `1002010202` | **126至145kV** | 制造业-延伸类-高压开关-隔地/接地开关-126至145kV | `间隔` | 单位产品综合能耗 (tce/间隔)、单位电耗 (kWh/间隔) |\n| 6 | `1002010203` | **252至363kV** | 制造业-延伸类-高压开关-隔地/接地开关-252至363kV | `间隔` | 单位产品综合能耗 (tce/间隔)、单位电耗 (kWh/间隔) |\n| 7 | `1002010204` | **420至550kV** | 制造业-延伸类-高压开关-隔地/接地开关-420至550kV | `间隔` | 单位产品综合能耗 (tce/间隔)、单位电耗 (kWh/间隔) |\n| 8 | `1002010301` | **40.5kV** | 制造业-延伸类-高压开关-断路器-40.5kV | `间隔` | 单位产品综合能耗 (tce/间隔)、单位电耗 (kWh/间隔) |\n| 9 | `1002010302` | **126至145kV** | 制造业-延伸类-高压开关-断路器-126至145kV | `间隔` | 单位产品综合能耗 (tce/间隔)、单位电耗 (kWh/间隔) |\n| 10 | `1002010303` | **252至363kV** | 制造业-延伸类-高压开关-断路器-252至363kV | `间隔` | 单位产品综合能耗 (tce/间隔)、单位电耗 (kWh/间隔) |\n| 11 | `1002010304` | **420至550kV** | 制造业-延伸类-高压开关-断路器-420至550kV | `间隔` | 单位产品综合能耗 (tce/间隔)、单位电耗 (kWh/间隔) |\n| 12 | `1002010305` | **800kV** | 制造业-延伸类-高压开关-断路器-800kV | `间隔` | 单位产品综合能耗 (tce/间隔)、单位电耗 (kWh/间隔) |\n| 13 | `1002010306` | **12kV** | 制造业-延伸类-高压开关-断路器-12kV | `间隔` | 单位产品综合能耗 (tce/间隔)、单位电耗 (kWh/间隔) |\n| 14 | `1002010401` | **柱上开关** | 制造业-延伸类-高压开关-柱上开关 | `间隔` | 单位产品综合能耗 (tce/间隔)、单位电耗 (kWh/间隔) |\n\n### 3.13 产线：套管产线（折算单位：`支`，共 7 项产品种类）\n\n| 序号 | 10位 ERP 产品编码 | 产品种类简明名称 (中类) | ERP 导出完整产品说明 (全称) | 统计折算单位 | 核心管控单耗指标 |\n| :---: | :---: | :--- | :--- | :---: | :--- |\n| 1 | `1002020101` | **40.5kV以下** | 制造业-延伸类-套管-交流套管-40.5kV以下 | `支` | 单位产品综合能耗 (tce/支)、单位电耗 (kWh/支) |\n| 2 | `1002020102` | **72.5至252kV** | 制造业-延伸类-套管-交流套管-72.5至252kV | `支` | 单位产品综合能耗 (tce/支)、单位电耗 (kWh/支) |\n| 3 | `1002020103` | **363至550kV** | 制造业-延伸类-套管-交流套管-363至550kV | `支` | 单位产品综合能耗 (tce/支)、单位电耗 (kWh/支) |\n| 4 | `1002020104` | **800kV** | 制造业-延伸类-套管-交流套管-800kV | `支` | 单位产品综合能耗 (tce/支)、单位电耗 (kWh/支) |\n| 5 | `1002020105` | **1100kV** | 制造业-延伸类-套管-交流套管-1100kV | `支` | 单位产品综合能耗 (tce/支)、单位电耗 (kWh/支) |\n| 6 | `1002020201` | **±500kV以下** | 制造业-延伸类-套管-直流套管-±500kV以下 | `支` | 单位产品综合能耗 (tce/支)、单位电耗 (kWh/支) |\n| 7 | `1002020202` | **±600kV以上** | 制造业-延伸类-套管-直流套管-±600kV以上 | `支` | 单位产品综合能耗 (tce/支)、单位电耗 (kWh/支) |\n\n### 3.14 产线：互感器产线（折算单位：`台`，共 9 项产品种类）\n\n| 序号 | 10位 ERP 产品编码 | 产品种类简明名称 (中类) | ERP 导出完整产品说明 (全称) | 统计折算单位 | 核心管控单耗指标 |\n| :---: | :---: | :--- | :--- | :---: | :--- |\n| 1 | `1002030101` | **72.5至252kV** | 制造业-延伸类-互感器-电流互感器-72.5至252kV | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 2 | `1002030102` | **363至550kV** | 制造业-延伸类-互感器-电流互感器-363至550kV | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 3 | `1002030103` | **765kV及以上** | 制造业-延伸类-互感器-电流互感器-765kV及以上 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 4 | `1002030201` | **72.5至252kV** | 制造业-延伸类-互感器-组合互感器-72.5至252kV | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 5 | `1002030202` | **363至550kV** | 制造业-延伸类-互感器-组合互感器-363至550kV | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 6 | `1002030203` | **765kV及以上** | 制造业-延伸类-互感器-组合互感器-765kV及以上 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 7 | `1002030301` | **72.5至252kV** | 制造业-延伸类-互感器-组合互感器-72.5至252kV | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 8 | `1002030302` | **363至550kV** | 制造业-延伸类-互感器-组合互感器-363至550kV | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 9 | `1002030303` | **765kV及以上** | 制造业-延伸类-互感器-组合互感器-765kV及以上 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n\n### 3.15 产线：二次产线（折算单位：`面`，共 11 项产品种类）\n\n| 序号 | 10位 ERP 产品编码 | 产品种类简明名称 (中类) | ERP 导出完整产品说明 (全称) | 统计折算单位 | 核心管控单耗指标 |\n| :---: | :---: | :--- | :--- | :---: | :--- |\n| 1 | `1002040301` | **充电桩** | 制造业-延伸类-二次-充电桩 | `面` | 单位产品综合能耗 (tce/面)、单位电耗 (kWh/面) |\n| 2 | `1002040101` | **保护监控** | 制造业-延伸类-二次-综合自动化-保护监控 | `面` | 单位产品综合能耗 (tce/面)、单位电耗 (kWh/面) |\n| 3 | `1002040102` | **系统集成** | 制造业-延伸类-二次-综合自动化-系统集成 | `面` | 单位产品综合能耗 (tce/面)、单位电耗 (kWh/面) |\n| 4 | `1002040201` | **主站系统** | 制造业-延伸类-二次-配网自动化-主站系统 | `面` | 单位产品综合能耗 (tce/面)、单位电耗 (kWh/面) |\n| 5 | `1002040202` | **DTU** | 制造业-延伸类-二次-配网自动化-DTU | `面` | 单位产品综合能耗 (tce/面)、单位电耗 (kWh/面) |\n| 6 | `1002040203` | **FTU** | 制造业-延伸类-二次-配网自动化-FTU | `面` | 单位产品综合能耗 (tce/面)、单位电耗 (kWh/面) |\n| 7 | `1002040204` | **TTU** | 制造业-延伸类-二次-配网自动化-TTU | `面` | 单位产品综合能耗 (tce/面)、单位电耗 (kWh/面) |\n| 8 | `1002040205` | **故障指示器** | 制造业-延伸类-二次-配网自动化-故障指示器 | `面` | 单位产品综合能耗 (tce/面)、单位电耗 (kWh/面) |\n| 9 | `1002040206` | **一二次融合** | 制造业-延伸类-二次-配网自动化-一二次融合 | `面` | 单位产品综合能耗 (tce/面)、单位电耗 (kWh/面) |\n| 10 | `1002040305` | **激光器** | 制造业-延伸类-二次-激光器 | `面` | 单位产品综合能耗 (tce/面)、单位电耗 (kWh/面) |\n| 11 | `1002040401` | **预装式变电站系统集成（含车载式）** | 制造业-延伸类-二次-预装式变电站系统集成（含车载式） | `面` | 单位产品综合能耗 (tce/面)、单位电耗 (kWh/面) |\n\n### 3.16 产线：服务业（折算单位：`项/单`，共 23 项产品种类）\n\n| 序号 | 10位 ERP 产品编码 | 产品种类简明名称 (中类) | ERP 导出完整产品说明 (全称) | 统计折算单位 | 核心管控单耗指标 |\n| :---: | :---: | :--- | :--- | :---: | :--- |\n| 1 | `1101010101` | **EPC模式** | 集成服务业-工程行业-输变电工程-EPC模式 | `项/单` | 单位产品综合能耗 (tce/项/单)、单位电耗 (kWh/项/单) |\n| 2 | `1101010201` | **BT模式** | 集成服务业-工程行业-输变电工程-BT模式 | `项/单` | 单位产品综合能耗 (tce/项/单)、单位电耗 (kWh/项/单) |\n| 3 | `1101019999` | **其他模式** | 集成服务业-工程行业-输变电工程-其他模式 | `项/单` | 单位产品综合能耗 (tce/项/单)、单位电耗 (kWh/项/单) |\n| 4 | `1101020101` | **投标EPC模式** | 集成服务业-工程行业-光伏工程-投标EPC模式 | `项/单` | 单位产品综合能耗 (tce/项/单)、单位电耗 (kWh/项/单) |\n| 5 | `1101020201` | **合作置换EPC模式** | 集成服务业-工程行业-光伏工程-合作置换EPC模式 | `项/单` | 单位产品综合能耗 (tce/项/单)、单位电耗 (kWh/项/单) |\n| 6 | `1101020301` | **垫资EPC模式** | 集成服务业-工程行业-光伏工程-垫资EPC模式 | `项/单` | 单位产品综合能耗 (tce/项/单)、单位电耗 (kWh/项/单) |\n| 7 | `1101030101` | **EPC模式** | 集成服务业-工程行业-火电工程-EPC模式 | `项/单` | 单位产品综合能耗 (tce/项/单)、单位电耗 (kWh/项/单) |\n| 8 | `1101030201` | **BT模式** | 集成服务业-工程行业-火电工程-BT模式 | `项/单` | 单位产品综合能耗 (tce/项/单)、单位电耗 (kWh/项/单) |\n| 9 | `1101039999` | **其他模式** | 集成服务业-工程行业-火电工程-其他模式 | `项/单` | 单位产品综合能耗 (tce/项/单)、单位电耗 (kWh/项/单) |\n| 10 | `1101040101` | **投标EPC模式** | 集成服务业-工程行业-风电工程-投标EPC模式 | `项/单` | 单位产品综合能耗 (tce/项/单)、单位电耗 (kWh/项/单) |\n| 11 | `1101040201` | **合作置换EPC模式** | 集成服务业-工程行业-风电工程-合作置换EPC模式 | `项/单` | 单位产品综合能耗 (tce/项/单)、单位电耗 (kWh/项/单) |\n| 12 | `1101040301` | **垫资EPC模式** | 集成服务业-工程行业-风电工程-垫资EPC模式 | `项/单` | 单位产品综合能耗 (tce/项/单)、单位电耗 (kWh/项/单) |\n| 13 | `1102010101` | **返厂检修** | 集成服务业-检修服务业-检俢业务-返厂检修 | `项/单` | 单位产品综合能耗 (tce/项/单)、单位电耗 (kWh/项/单) |\n| 14 | `1102010201` | **现场检修** | 集成服务业-检修服务业-检俢业务-现场检修 | `项/单` | 单位产品综合能耗 (tce/项/单)、单位电耗 (kWh/项/单) |\n| 15 | `1102020101` | **备品备件销售** | 集成服务业-检修服务业-备品备件销售 | `项/单` | 单位产品综合能耗 (tce/项/单)、单位电耗 (kWh/项/单) |\n| 16 | `1102030101` | **运维检测服务** | 集成服务业-检修服务业-运维检测服务 | `项/单` | 单位产品综合能耗 (tce/项/单)、单位电耗 (kWh/项/单) |\n| 17 | `1102040101` | **联合科研** | 集成服务业-检修服务业-联合科研 | `项/单` | 单位产品综合能耗 (tce/项/单)、单位电耗 (kWh/项/单) |\n| 18 | `1102050101` | **以旧换新** | 集成服务业-检修服务业-以旧换新 | `项/单` | 单位产品综合能耗 (tce/项/单)、单位电耗 (kWh/项/单) |\n| 19 | `1103010101` | **设计服务** | 集成服务业-设计服务 | `项/单` | 单位产品综合能耗 (tce/项/单)、单位电耗 (kWh/项/单) |\n| 20 | `1104010101` | **咨询服务** | 集成服务业-咨询服务 | `项/单` | 单位产品综合能耗 (tce/项/单)、单位电耗 (kWh/项/单) |\n| 21 | `1201010101` | **物流贸易** | 物流贸易 | `项/单` | 单位产品综合能耗 (tce/项/单)、单位电耗 (kWh/项/单) |\n| 22 | `1202010101` | **公路** | 物流贸易-物流运输-公路 | `项/单` | 单位产品综合能耗 (tce/项/单)、单位电耗 (kWh/项/单) |\n| 23 | `1202010102` | **铁路** | 物流贸易-物流运输-铁路 | `项/单` | 单位产品综合能耗 (tce/项/单)、单位电耗 (kWh/项/单) |\n\n### 3.17 产线：电容器产线（油浸式）（折算单位：`台`，共 6 项产品种类）\n\n| 序号 | 10位 ERP 产品编码 | 产品种类简明名称 (中类) | ERP 导出完整产品说明 (全称) | 统计折算单位 | 核心管控单耗指标 |\n| :---: | :---: | :--- | :--- | :---: | :--- |\n| 1 | `1001110101` | **预制舱式电容器成套产品** | 制造业-变压器产品-预制舱式电容器成套产品 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 2 | `1001110102` | **柜式电容器成套产品** | 制造业-变压器产品-柜式电容器成套产品 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 3 | `1001110103` | **集合式电容器成套产品** | 制造业-变压器产品-集合式电容器成套产品 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 4 | `1001110104` | **框架式电容器成套产品** | 制造业-变压器产品-框架式电容器成套产品 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 5 | `1001110105` | **集合式电容器** | 制造业-变压器产品-集合式电容器 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n| 6 | `1001110107` | **油浸式电容器** | 制造业-变压器产品-油浸式电容器 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n\n### 3.18 产线：电容器产线（干式）（折算单位：`台`，共 1 项产品种类）\n\n| 序号 | 10位 ERP 产品编码 | 产品种类简明名称 (中类) | ERP 导出完整产品说明 (全称) | 统计折算单位 | 核心管控单耗指标 |\n| :---: | :---: | :--- | :--- | :---: | :--- |\n| 1 | `1001110106` | **干式电容器** | 制造业-变压器产品-干式电容器 | `台` | 单位产品综合能耗 (tce/台)、单位电耗 (kWh/台) |\n\n---\n\n## 四、 线缆产业 8 大产线与 14 大产品大类标准字典\n\n依据《线缆产线分类.xlsx》，线缆产业建立了统一的 8 大标准产线，向下辐射 14 大核心产品大类、50+ 产品中类，以及 519 项四级细分产品明细。\n\n### 4.1 线缆产业产品大类与中类明细对照表\n\n| 序号 | 产品大类 (二级分类) | 核心产品中类 (三级分类 / 产品种类) | 所属标准产线 | 细分四级规格示例 |\n| :---: | :--- | :--- | :--- | :--- |\n| **1** | **裸导线** | 裸铝绞线、钢芯铝绞线、铝合金绞线、钢芯铝合金绞线、铝合金芯铝绞线、铝包钢绞线、特种耐热导线 | `导线产线` | JL/G1A 钢芯铝绞线、JLHA2 铝合金绞线、JL/LHA1 铝合金芯铝绞线、碳纤维复合芯导线 |\n| **2** | **布电线** | 普通塑料布电线、阻燃塑料布电线、耐火塑料布电线、低烟无卤阻燃塑料布电线、尼龙护套线、屏蔽布电线、汽车线 | `布电线产线` | BV、BVR、WDZ-BYJ、BVN、RVV、BLV 铝芯聚氯乙烯绝缘电线 |\n| **3** | **低压电力电缆** | PVC绝缘电力电缆、XLPE绝缘电力电缆、低烟无卤阻燃电力电缆、耐火电力电缆、防蚁防鼠电缆、铝合金电力电缆、刚性/柔性防火电缆 | `低压力缆产线` | VV22、YJV-0.6/1kV、WDZN-YJY、YJLV、BTTZ 矿物绝缘刚性防火电缆、YTTW 柔性防火电缆 |\n| **4** | **中压电力电缆** | 6~35kV XLPE绝缘电力电缆、阻燃中压电缆、耐火中压电缆、防水电力电缆、矿用中压电缆 | `中压力缆产线` | YJV-8.7/15kV、YJV22-26/35kV、WDZ-YJY-10kV、FS-YJV 防水中压交联电缆 |\n| **5** | **高压电力电缆** | 皱纹铝护套电力电缆、平滑铝护套电力电缆、铅护套电力电缆、铝塑复合套电力电缆、铜护套电力电缆、直流高压电缆、超高压交联电缆 | `高压力缆产线` | YJLW02-64/110kV、YJLW03-127/220kV、YJLLW03-290/500kV、±535kV 直流电缆 |\n| **6** | **控制电缆** | PVC绝缘控制电缆、XLPE绝缘控制电缆、阻燃控制电缆、耐火控制电缆、低烟无卤控制电缆、屏蔽控制电缆 | `电气装备电缆产线` | KVV、KVV22、KVVP2 铜箔屏蔽控制电缆、WDZN-KYJY、KYJVP |\n| **7** | **计算机与仪表电缆** | 计算机电缆、本安计算机电缆、硅橡胶计算机电缆、低电容信号电缆 | `电气装备电缆产线` | DJYVP、DJYPVP、ZR-IA-DJYP2VP2 本安防爆屏蔽电缆 |\n| **8** | **光伏电缆** | 光伏电缆 PV1-F、光伏电缆 H1Z2Z2-K、光伏用电力电缆、光伏用控制电缆 | `特种电缆产线` | PV1-F 1*4mm²、H1Z2Z2-K 1*6mm² 双层电子辐照交联特种电缆 |\n| **9** | **风电电缆** | 橡皮绝缘风电电缆、塑料绝缘风电电缆、弹性体绝缘风电电缆、硅橡胶风电电缆、风机扭转连接线 | `橡套电缆产线` | FD-EYH-0.6/1kV 抗扭耐低温风能电缆、FD-YCW 高抗扭橡套软电缆 |\n| **10** | **盾构机电缆** | 橡皮绝缘低压盾构机电缆、橡皮绝缘中压盾构机电缆、高抗拉耐磨耐油盾构机电缆 | `特种电缆产线` | UGEFP-3.6/6kV 盾构机用高抗拉橡套软电缆 |\n| **11** | **船用电缆** | 船用橡胶绝缘阻燃电力电缆、船用塑料绝缘阻燃耐火电力电缆、船用通信电缆 | `电气装备电缆产线` | CEFR/DA、CHV82/SA、CJPF96/SC 船用低烟无卤阻燃耐火电缆 |\n| **12** | **变频电缆** | XLPE绝缘变频电缆、PVC绝缘变频电缆、对称屏蔽结构变频电缆 | `电气装备电缆产线` | BP-YJVP、BP-YJVP2-ZR 变频电机专用高屏蔽电缆 |\n| **13** | **通用与矿用橡套电缆** | 通用橡套软电缆、矿用橡套软电缆、电焊机电缆、潜水泵电缆 | `橡套电缆产线` | YC、YCW、YCZ、MY-0.38/0.66kV、MYPT-6/10kV 煤矿用屏蔽橡套软电缆、YH 电焊机电缆 |\n| **14** | **其他特种电缆** | 储能专用电缆、补偿电缆、定日镜电缆、机场助航灯光回路埋地电缆、捣炉机电缆 | `特种电缆产线` | F-CE-1500V 储能专用耐候电缆、KX/EX 热电偶用补偿导线 |\n\n---\n\n## 五、 指标管控看板（Indicator Monitor）系统交互与数据联动逻辑\n\n在集中监管中心 · 指标管控看板 (`zero-carbon/monitor/indicator/page.tsx`) 中，该字典用于驱动**企业 ➔ 产线 ➔ 产品种类 ➔ 代表型号**的四级垂直联动闭环：\n\n```mermaid\ngraph TD\n    A[\"组织树选择<br/>(沈变 / 衡变 / 新变 / 鲁缆 / 新缆 / 德缆 等 21 家工厂)\"] --> B[\"获取该企业白名单产线<br/>getProductLinesForUnit(unitName)\"]\n    B --> C[\"【板块二：产品管控指标】<br/>激活选中产线分类 currentProductLine<br/>(计算5大产品单耗指标与折标煤基准)\"]\n    C --> D[\"【板块三：产线子分类管控指标】<br/>加载该产线下的 ERP 产品种类字典列表<br/>PRODUCT_LINE_DICTIONARY[currentProductLine]\"]\n    D --> E[\"产品种类标签水平切换 / 搜索过滤 / 展开折叠<br/>(默认展示前2个，点击展开全部)\"]\n    E --> F[\"【板块四：代表型号联动】<br/>根据选中的产线与产品种类下钻获取代表型号<br/>getModelsForSubcategory(line, subcategory)\"]\n```\n\n### 5.1 板块二：产品管控指标（5 大单耗联动）\n- **动态指标生成**：根据激活选中的产线分类（`currentProductLine`），界面自动动态生成 5 大产品管控指标卡片：\n  1. `单位产品能耗` (tce/单位)\n  2. `单位产品电耗` (kWh/单位)\n  3. `单位产品蒸汽耗` (GJ/单位)\n  4. `单位产品天然气耗` (m³/单位)\n  5. `单位产品水耗` (t/单位)\n- **产线名称转产品大类**：依据 `LINE_TO_PRODUCT_CATEGORY_MAPPING`，卡片名称中将产线后缀剥离并映射为标准产品大类（如 `配变产线（中特）` ➔ `中特配变`，`布电线产线` ➔ `布电线`，`高压产线` ➔ `高压变压器`）。\n\n### 5.2 板块三：产线子分类（产品种类）管控指标\n- **ERP 导出说明与简明名称对应**：读取 `PRODUCT_LINE_DICTIONARY[currentProductLine]`，每个子分类以卡片/列表形式展示该种类的综合单耗、电耗、蒸汽耗、同比变化率与考核公式。\n- **高密防遮挡折叠策略**：当该产线下的产品种类超过 2 个且未触发搜索过滤时，界面默认仅展示前 2 个核心子分类，并提供 `展开全部 (N个) / 收起` 按钮，防止页面纵向无限拉伸。\n\n### 5.3 板块四：代表型号联动\n- **型号精准关联**：选择某个产品种类（如 `交流变压器-110KV`）后，下方即时调取 `getModelsForSubcategory(line, subcategory)` 获取具体型号明细（如 `SFZ-63000/110`、`SFSZ-120000/220`），并提供容量、电压等级与单位能耗数据。\n\n---\n\n## 六、 跨模块协同标准与产品碳足迹集采中心级联规范\n\n为了保证“双中心”架构的一致性，产品大类与产品种类字典在全系统实现无缝打通：\n\n### 6.1 实景数据库（Real Scene View）级联规范\n在 `carbon-footprint/database/accounting/real-scene-view.tsx` 中：\n- 顶部第一行配置统一的级联控制条：\n  - 【产业】：`全部` \\| `电器` \\| `线缆`\n  - 【产品大类】：根据产业自适应（电器：`变压器`、`电抗器`、`开关/GIS`、`套管`、`互感器`、`电容器`、`开关柜` 等；线缆：`电力电缆`、`电气装备电缆`、`裸导线`、`特种电缆`、`橡套电缆` 等）\n  - 【产品中类】：根据选中的大类联动呈现对应的标准产品中类（产品种类）\n- 列表移除冗余的型号混杂列，统一设为【产品大类】与【产品中类】独立列，保持 44px 工业高密表格标准。\n\n### 6.2 能效对标与横纵向对比模块规范\n在 `carbon-footprint/database/accounting/compare-view.tsx` 与 `ranking-view.tsx` 中：\n- **移除产品型号筛选**：横向对标与纵向对标核心对比“同产业、同大类、同中类”在不同工厂、不同批次间的碳足迹与能效表现，彻底剥离微观型号差异带来的噪音；\n- **自解释与客观中立**：图表与卡片标题自适应呈现产品中类名称，严格禁止“处于领跑标杆”、“落后单位”等说教性评价，统一采用客观数值对比（同比、环比、基准偏差量）。\n\n---\n\n## 七、 21 家重点工厂与产线白名单对照表（含精准判空规范）\n\n严格依据《生产单位与涉及关键工序对应表(1).et》，全系统 21 家重点工厂与 10 家无工序/无产线单位判定白名单如下：\n\n| 所属公司 | 二级单位 / 工厂名称 | 涉及标准产线分类 | 涉及主要产品大类 | 工序判空规则 |\n| :--- | :--- | :--- | :--- | :---: |\n| **沈变公司** | 沈变本部 | 特高压产线、超高压产线、高压产线 | 变压器-高压、超高压变压器、特高压变压器 | 正常呈现 |\n| **沈变公司** | 和新套管公司 | 套管产线 | 套管 (交流/直流套管) | 正常呈现 |\n| **沈变公司** | 康嘉互感器 | 互感器产线 | 互感器 (电流/电压/组合互感器) | 正常呈现 |\n| **沈变公司** | 智慧能源 / 印能公司 / 露娜公司 | 无产线 | 无产品 | ⚠️ **单行输出 `暂无相关工序！`** |\n| **衡变公司** | 衡变本部 | 特高压产线、超高压产线、高压产线 | 变压器-高压、超高压变压器、特高压变压器 | 正常呈现 |\n| **衡变公司** | 湖南电气 | 高压产线、配变产线（中特/油变/箱变） | 高压变压器、配电变压器、箱式变电站 | 正常呈现 |\n| **衡变公司** | 云集高压开关 / 上开 | GIS 产线 | 高压开关、组合电器 GIS | 正常呈现 |\n| **衡变公司** | 事杰爱迪 | GIL 产线 | 管道母线 GIL | 正常呈现 |\n| **衡变公司** | 云集电气 / 新疆自控 | 开关柜产线 | 中低压开关柜 | 正常呈现 |\n| **衡变公司** | 合容电气股份 / 电力设备 / 科贝尔 | 电容器产线（油浸/干式）、电抗器产线 | 电容器、干式电抗器 | 正常呈现 |\n| **衡变公司** | 南京公司 / 南京电研 | 二次产线 | 二次自动化、配网自动化 | 正常呈现 |\n| **衡变公司** | 特缆建 / 特能建 | 高压产线、超高压产线、配变产线（中特） | 高压变压器、特种变压器 | 正常呈现 |\n| **新变厂** | 新变厂本部 / 超高压公司 | 特高压产线、超高压产线、高压产线、配变产线 | 变压器全系列、配电变压器 | 正常呈现 |\n| **新变厂** | 天变公司 (天津/衡阳/沈阳基地) | 配变产线（干变）、配变产线（箱变） | 干式配变、箱式变电站 | 正常呈现 |\n| **新变厂** | 智能电气 (智能电气公司) | 高压产线、配变产线（干变/油变/箱变/中特） | 高压变压器、干变、油变、箱变 | 正常呈现 |\n| **新变厂** | 京津冀科技 (京津冀公司) | 高压产线、配变产线（油变/箱变/中特） | 高压变压器、配电变压器、箱变 | 正常呈现 |\n| **新变厂** | 珠峰硅钢 | 硅钢产线（横剪） | 硅钢铁芯 (常规片/横剪片/卷铁芯) | 正常呈现 |\n| **新变厂** | 天变智慧能源 / 银利电气 | 无产线 | 无产品 | ⚠️ **单行输出 `暂无相关工序！`** |\n| **鲁缆公司** | 鲁缆本部 | 导线、布电线、低压力缆、中压力缆、高压力缆、装备电缆、橡套电缆、特种电缆 | 裸导线、布电线、低/中/高压电缆、橡套电缆 | 正常呈现 |\n| **鲁缆公司** | 昭和公司 / 曙光公司 | 特种电缆产线 | 光伏电缆、风电电缆、耐火电缆等特种电缆 | 正常呈现 |\n| **鲁缆公司** | 智缆公司 | 无产线 | 无产品 | ⚠️ **单行输出 `暂无相关工序！`** |\n| **新缆厂** | 新变厂本部 (新疆线缆厂) | 导线、布电线、低压力缆、中压力缆、高压力缆、装备电缆、橡套电缆、特种电缆 | 裸导线、布电线、低/中/高压电缆、特种电缆 | 正常呈现 |\n| **新缆厂** | 新疆电缆有限公司 | 布电线、低压力缆、中压力缆、装备电缆、特种电缆 | 布电线、电力电缆、装备电缆、特种电缆 | 正常呈现 |\n| **德缆公司** | 德缆公司本部 | 导线、布电线、低压力缆、中压力缆、高压力缆、装备电缆、橡套电缆、特种电缆 | 裸导线、布电线、低/中/高压电缆、橡套电缆 | 正常呈现 |\n\n> [!IMPORTANT]\n> **空状态单行判空硬红线 (Strict Null Handling)**：\n> 针对上表中沈变智慧能源、印能公司、露娜公司、天变智慧能源、银利电气、智缆公司等 10 家无关键工序企业，系统在切换到这些节点时，**必须精准单行呈现 `暂无相关工序！`**，绝不允许渲染出空表格或虚构工序数据，保持工业系统的严谨性与严肃性。\n\n---\n\n## 八、 总结与工程维护守则\n\n1. **统一数据源单向流**：前端所有涉及产品分类、产线分类与 ERP 子分类的组件，统一自 `@/lib/product-line-subcategories`、`@/lib/product-models` 与 `@/lib/procurement` 引入，严禁在页面组件中私自硬编码字典；\n2. **双端 100% 同构发布**：暗黑科技蓝端（3000端口）与浅色商务办公端（3001端口）在修改字典或页面逻辑时必须完全同步；\n3. **本地静态编译守则**：所有涉及字典更新的代码必须通过本地 `pnpm build`（双端 77/77 路由 0 报错）自测闭环；\n4. **Git 与部署纪律**：严守未获用户明确指令绝不执行自动 `git commit`、`git push` 或向线上机器部署的最高纪律。\n"
  },
  {
    "id": "manual-36",
    "no": 36,
    "filename": "36_UI页面设计规范与工业视觉标准手册.md",
    "title": "UI页面设计规范与工业视觉标准手册",
    "category": "数据录入与组件设计",
    "readTime": "14 分钟",
    "wordCount": 7066,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "一、 编制背景与核心设计哲学 (Design Philosophy)",
        "id": "一-编制背景与核心设计哲学-design-philosophy"
      },
      {
        "level": 3,
        "title": "1.1 建设背景",
        "id": "1-1-建设背景"
      },
      {
        "level": 3,
        "title": "1.2 核心设计准则：工业实用主义与极致克制",
        "id": "1-2-核心设计准则-工业实用主义与极致克制"
      },
      {
        "level": 2,
        "title": "二、 全局基础视觉规范 (Global Design Tokens)",
        "id": "二-全局基础视觉规范-global-design-tokens"
      },
      {
        "level": 3,
        "title": "2.1 页面背景与面板容器",
        "id": "2-1-页面背景与面板容器"
      },
      {
        "level": 3,
        "title": "2.2 字体排版与阶梯层级 (Typography Hierarchy)",
        "id": "2-2-字体排版与阶梯层级-typography-hierarchy"
      },
      {
        "level": 2,
        "title": "三、 8 大能源介质与分时电量 4 段色彩字典 (Color System)",
        "id": "三-8-大能源介质与分时电量-4-段色彩字典-color-system"
      },
      {
        "level": 3,
        "title": "3.1 8 大能源介质标准色对照表",
        "id": "3-1-8-大能源介质标准色对照表"
      },
      {
        "level": 3,
        "title": "3.2 分时电量 4 段类型色 (TOU: 尖 / 峰 / 平 / 谷)",
        "id": "3-2-分时电量-4-段类型色-tou-尖-峰-平-谷"
      },
      {
        "level": 2,
        "title": "四、 侧边导航与组织架构树规范 (Sidebar & Topology Tree)",
        "id": "四-侧边导航与组织架构树规范-sidebar-topology-tree"
      },
      {
        "level": 3,
        "title": "4.1 侧边导航栏样式 (Sidebar Navigation)",
        "id": "4-1-侧边导航栏样式-sidebar-navigation"
      },
      {
        "level": 3,
        "title": "4.2 企业组织拓扑树样式 (Organization Topology Tree)",
        "id": "4-2-企业组织拓扑树样式-organization-topology-tree"
      },
      {
        "level": 2,
        "title": "五、 卡片与控制组件标准规格 (Cards & Controls)",
        "id": "五-卡片与控制组件标准规格-cards-controls"
      },
      {
        "level": 3,
        "title": "5.1 标准指标卡片样式 (KPI Metric Card)",
        "id": "5-1-标准指标卡片样式-kpi-metric-card"
      },
      {
        "level": 3,
        "title": "5.2 TAB 切换组件规范 (Segmented Tabs)",
        "id": "5-2-tab-切换组件规范-segmented-tabs"
      }
    ],
    "content": "# 📚 36_UI页面设计规范与工业视觉标准手册\n\n> **文档元数据 (Document Metadata)**  \n> - **版本号**：V1.0  \n> - **编制日期**：2026-09-11  \n> - **适用团队**：特变电工能碳数字化双中心研发团队（PM / 前端开发 / UI-UX 设计 / QA 测试）  \n> - **权威参考依据**：\n>   1. 《UI页面修改 (2).pdf》（特变电工官方下发 UI 界面重构与视觉设计规范文档）  \n>   2. 《“双中心”项目能碳管控指标体系V1.5(1).xlsx》与《生产单位与涉及关键工序对应表(1).et》  \n>   3. 项目专属设计系统规范：[`tbea-industrial-design`](../.gemini/skills/tbea-industrial-design/SKILL.md)  \n>   4. Agent 开发与工程维护准则：[`AGENTS.md`](../AGENTS.md)  \n\n---\n\n## 一、 编制背景与核心设计哲学 (Design Philosophy)\n\n### 1.1 建设背景\n特变电工能碳数字化双中心（零碳园区集控中心 + 产品碳足迹集采中心）服务于集团决策层、园区集控中心调度员与生产工厂车间管理人员。为了彻底解决前期原型中存在的色彩混杂、面板层级不一、控件尺寸跳跃、导航密度偏低以及自述式描述等工业噪音问题，特变电工官方正式下发《UI页面修改 (2).pdf》，对全系统的全局色彩体系、面板容器、卡片信息层级、侧边导航与组织架构树人机工程、以及核心控制控件（TAB/导出按钮/输入与下拉框）进行了全方位的标准化统一。\n\n### 1.2 核心设计准则：工业实用主义与极致克制\n1. **统一 Design Tokens**：所有色彩、边框、圆角、行高与间距严格遵循 Design Tokens 体系，杜绝私自硬编码临时样式；\n2. **状态自解释，反过度设计**：严禁添加“图表联动中”、“已选中”等描述性标签，激活态统一通过实心背景或边框光晕自解释表达；\n3. **数字即结论，去噪提效**：卡片与图表直接呈现核心数值与物理量，杜绝自说自话的操作提示与说教性评价文案；\n4. **双端 100% 同构一致性**：暗黑科技蓝端（3000端口）与浅色商务办公端（3001端口）在组件尺寸、数据流与业务口径上保持绝对镜像一致。\n\n---\n\n## 二、 全局基础视觉规范 (Global Design Tokens)\n\n### 2.1 页面背景与面板容器\n\n| 视觉要素 | 规范参数值 | Tailwind CSS 类名 / 变量 | 设计人机工程说明 |\n| :--- | :---: | :--- | :--- |\n| **页面主背景色** | `#F3F7FB` | `bg-[#F3F7FB]` / `bg-background` | 统一全站浅色办公端主底色，柔和微透浅灰蓝，消除纯白眩光疲劳 |\n| **面板/卡片填充** | `#FFFFFF` | `bg-[#FFFFFF]` / `bg-panel` / `bg-card` | 纯白卡片背板，高对比承载图表与数据指标 |\n| **面板描边边框** | `#DBE6EE` | `border-[#DBE6EE]` / `border-border` | 精细浅蓝灰工业描边，区分面板板块边界 |\n| **面板/卡片圆角** | `8px` | `rounded-lg` (`rounded-[8px]`) | 工业适中倒角，沉稳硬朗且兼顾现代感 |\n| **面板统一外间距** | **`24px`** | `gap-6` / `space-y-6` (`gap-[24px]`) | 页面级各大业务板块之间的标准外边距与网格槽宽 |\n\n---\n\n### 2.2 字体排版与阶梯层级 (Typography Hierarchy)\n\n全系统严格遵循四级字体层级体系，杜绝字号繁杂失控：\n\n| 层级对象 | 规范字号 | 字重要求 | 字体族规范 | 适用场景说明 |\n| :--- | :---: | :---: | :--- | :--- |\n| **正文内容** | **`14px`** | 常规 (`font-normal`) | 系统默认 Sans (`Inter`, `PingFang SC`) | 表格单元格文本、表单标签、普通辅助描述、图表轴刻度 |\n| **面板主标题** | **`16px`** | 加粗 (`font-semibold` / `font-bold`) | 系统默认 Sans | 面板头部标题（如“各经营单位产品碳足迹排序”）、弹窗标题 |\n| **卡片标题** | **`14px`** | 常规/微粗 (`font-medium`) | 系统默认 Sans | 顶部指标卡片、KPI 概览卡片标题（如“综合能源消费量”） |\n| **卡片核心主数值** | **`24px`** | 加粗 (`font-bold` / `font-extrabold`) | 等宽字体 Mono (`JetBrains Mono`, `Roboto Mono`) | KPI 核心数值（如 `12845`、`0.313`），保障数字对齐与冲击力 |\n| **其他辅助字号** | **`14px`** | 常规 (`font-normal`) | Sans / Mono | 物理计量单位（如 `tce`、`万kVA`）、时序对比文本（“同比”） |\n\n---\n\n## 三、 8 大能源介质与分时电量 4 段色彩字典 (Color System)\n\n系统严格规范 8 大能源介质与 TOU 峰平谷分时电量色彩，全站图表、卡片指标、进度条及徽章 100% 统一映射：\n\n### 3.1 8 大能源介质标准色对照表\n\n| 序号 | 能源介质名称 | 标准 Hex 色值 | RGB 色值 | 适用图表与指示场景 |\n| :---: | :--- | :---: | :---: | :--- |\n| **1** | **主题科技蓝 / 总用电量** | **`#2C7CFF`** | `rgb(44, 124, 255)` | 平台主色、全厂总用电量折线/柱状图、主操作按钮 |\n| **2** | **市电量** | **`#41C0FF`** | `rgb(65, 192, 255)` | 电网购入电量、市电供应占比、受电变压器监测 |\n| **3** | **直供绿电量** | **`#00D492`** | `rgb(0, 212, 146)` | 分布式光伏发电、市场化绿电直购、零碳绿电消纳率 |\n| **4** | **水资源** | **`#10C4CE`** | `rgb(16, 196, 206)` | 新鲜工业用水、循环冷却水消耗、万元产值用水量(ESG) |\n| **5** | **天然气** | **`#FF6536`** | `rgb(255, 101, 54)` | 窑炉天然气消耗、锅炉燃烧热力、烘房用气监测 |\n| **6** | **蒸汽** | **`#FFBA00`** | `rgb(255, 186, 0)` | 外购蒸汽总量、工艺干燥固化蒸汽单耗 |\n| **7** | **油消耗** | **`#8E73ED`** | `rgb(142, 115, 237)` | 变压器油注油台账、柴油发电机应急燃油消耗 |\n| **8** | **液氮** | **`#4F39F6`** | `rgb(79, 57, 246)` | 低温试验保护、超导实验与特殊制造氮气介质消耗 |\n\n---\n\n### 3.2 分时电量 4 段类型色 (TOU: 尖 / 峰 / 平 / 谷)\n\n依据电网时段电价与负荷调峰政策，尖峰平谷 4 时段标准色统一如下：\n\n| 时段类型 | 标准 Hex 色值 | 视觉语义 | 界面图表与指示要求 |\n| :---: | :---: | :--- | :--- |\n| **尖峰 (Sharp Peak)** | **`#FF6536`** | 警示热力橙红 | 尖峰时段用电量、避峰负荷监测、尖峰电量占比饼图 |\n| **高峰 (Peak)** | **`#FFBA00`** | 活力明朗金黄 | 高峰时段用电量、生产班次负荷走势 |\n| **平段 (Flat)** | **`#2C7CFF`** | 稳健主题科技蓝 | 平段时段用电量、常规连续负荷 |\n| **低谷 (Valley)** | **`#10C4CE`** | 低谷生态湖蓝青 | 低谷蓄能用电、储能充电时段用电量、谷电消纳占比 |\n\n---\n\n## 四、 侧边导航与组织架构树规范 (Sidebar & Topology Tree)\n\n### 4.1 侧边导航栏样式 (Sidebar Navigation)\n1. **导航栏宽度**：统一固定为 **`260px`**（`w-[260px]`），保障中文菜单不折行、菜单徽章展示从容；\n2. **Logo 规范**：原文本 Logo 全面替换为特变电工官方高清矢量 Logo 图片；\n3. **Logo 下方主标题与英文描述**：\n   - 中文大标题：“**零碳园区集控中心**”（大号白字加粗，`text-lg font-bold text-white`）；\n   - 英文副标题：“**PARK CENTRALIZED CONTROL CENTER**”（全大写浅蓝细体，`text-[10px] text-white/70 tracking-wider`）；\n4. **业务中心选择器迁移**：\n   - 原位于顶栏的“选择切换业务中心”功能**彻底迁移至左侧导航栏**，位于 Logo 与系统大标题正下方；\n   - 采用半透明胶囊下拉控件（`[图标] 零碳园区集控中心 [ChevronDown]`），支持一键无缝切换【零碳园区集控中心】与【产品碳足迹集采中心】；\n5. **导航菜单间距**：导航项垂直文字间距增大到 **`30px`**（行距/内边距舒适通透）。\n\n---\n\n### 4.2 企业组织拓扑树样式 (Organization Topology Tree)\n依据《UI页面修改 (2).pdf》第 3、4 页参考设计：\n1. **容器底色与边框**：纯白底色 `#FFFFFF`，描边边框 `#DBE6EE`，圆角 `8px`；\n2. **头部标题栏**：左侧蓝色建筑图标 `Building2` + 14px 标题“企业组织拓扑”；\n3. **搜索框规范**：\n   - 带放大镜图标 `Search`；\n   - 占位符提示“请输入搜索关键词”；\n   - 描边 `#DBE6EE`，圆角 8px，白底；\n4. **树节点行距与文字间距**：垂直间距统一调整为 **`30px`**（`h-[30px]` / 行高 30px）；\n5. **层级语义图标**：\n   - 集团 / 二级单位：采用建筑图标 `Building2`；\n   - 单体工厂 / 实体车间：采用架构方块图标 `Network`；\n6. **选中激活态 (Active State)**：\n   - 激活节点呈现浅蓝圆角底色 **`#EBF3FF`**；\n   - 节点文字加粗深蓝高亮，完全自解释，不增设任何说明标签。\n\n---\n\n## 五、 卡片与控制组件标准规格 (Cards & Controls)\n\n### 5.1 标准指标卡片样式 (KPI Metric Card)\n依据《UI页面修改 (2).pdf》第 5 页图示标准：\n- **卡片容器**：白底 `#FFFFFF`，描边 `#DBE6EE`，圆角 `8px`，内边距 `p-4`；\n- **顶部行**：\n  - 左侧：卡片标题（14px，常规色，如“综合能源消费量”）；\n  - 右侧：柔和绿色胶囊状态标签（如“国家级零碳工厂”，浅绿背景带边框）；\n- **中部行**：\n  - 左侧：大号加粗主数值（**`24px`**，Mono 等宽，如 `12845`） + 物理计量单位（**`14px`**，浅灰，如 `tce`）；\n  - 右侧：浅蓝背景微型圆角操作按钮“详情”；\n- **底部行**：\n  - 左侧：时序对比标签（**`14px`**，浅灰，如“同比”）；\n  - 右侧：变动率与趋势方向（**`14px`**，浅蓝或红绿语义色，如 `-4.8% ↗`）。\n\n---\n\n### 5.2 TAB 切换组件规范 (Segmented Tabs)\n- **容器与排版**：水平排列，无多余外框；\n- **未选中态**：字体 14px，浅灰或深灰文本，无背景色，悬停轻微提亮；\n- **选中激活态**：\n  - 背景填充：实心主题科技蓝 **`#2C7CFF`**；\n  - 文字颜色：纯白 **`#FFFFFF`**，字体加粗；\n  - 圆角规格：**`8px`**；\n  - 示例：`[ 月度 ]   季度    年度`。\n\n---\n\n### 5.3 导出按钮规范 (Export Button)\n系统内所有数据导出、报表下载按钮必须全面遵循统一标准：\n- **宽度**：固定为 **`80px`**；\n- **高度**：固定为 **`36px`**（`h-9`）；\n- **填充颜色**：主题科技蓝 **`#2C7CFF`**；\n- **圆角规格**：**`8px`**；\n- **内部元素**：白色托盘导出图标（`Download` / `Upload`） + 白色文字“**导出**”；\n- **范围约束**：全系统所有模块导出按钮 100% 同步执行。\n\n---\n\n### 5.4 输入框与下拉选择框规范 (Input & Select)\n- **推荐宽度**：统一为 **`200px`**（`w-[200px]`，可根据具体长文本自适应弹性扩展）；\n- **固定高度**：统一为 **`36px`**（`h-9`）；\n- **填充背景色**：纯白 **`#FFFFFF`**；\n- **描边边框**：浅蓝灰 **`#E2E8F0`**（或 `#DBE6EE`）；\n- **圆角规格**：**`8px`**；\n- **前置标签排版**：左侧前置中性灰色标签（如“搜索”、“选择部门”），右侧承接 200px × 36px 规范选择框，右侧内置极简 `ChevronDown` 下拉箭头。\n\n---\n\n## 六、 开发者自查与 QA 验收清单 (Checklist)\n\n| 检查大类 | 关键指标 / 验收点 | 合规标准 | 违规反模式 (严禁) |\n| :--- | :--- | :--- | :--- |\n| **色彩合规** | 8 大能源介质色 | 电`2C7CFF`、市电`41C0FF`、绿电`00D492`、水`10C4CE`、气`FF6536`、汽`FFBA00`、油`8E73ED`、氮`4F39F6` | 出现暗黄、偏绿或临时 Tailwind 颜色 |\n| **色彩合规** | 4 段峰平谷分时色 | 尖`FF6536`、峰`FFBA00`、平`2C7CFF`、谷`10C4CE` | 尖峰使用普通黄色或低谷使用纯灰色 |\n| **容器尺寸** | 面板间距与圆角 | 间距固定 **`24px`**，圆角固定 **`8px`**，描边 **`#DBE6EE`** | 间距过窄（如 8px/12px）或圆角过大（如 16px/24px） |\n| **字号阶梯** | 标题与数值字号 | 面板标题 **`16px加粗`**，卡片标题 **`14px`**，核心数值 **`24px加粗`** | 卡片标题使用 12px 或数值过小 |\n| **侧边导航** | 宽度与间距 | 宽度 **`260px`**，Logo 下方带中英文标题，切换业务中心在左侧，文字间距 **`30px`** | 宽度依然为 240px，切换业务中心遗留在顶栏 |\n| **组织树** | 间距与选中态 | 节点行距 **`30px`**，激活选中态底色为浅蓝 **`#EBF3FF`** | 间距拥挤密集，选中态为刺眼深蓝或无背景 |\n| **控制组件** | TAB、导出与输入框 | 激活Tab`#2C7CFF`圆角8px；导出按钮`80×36px`；输入/下拉框`200×36px`纯白底色 | 导出按钮忽大忽小、输入框高度非 36px |\n| **表格规范** | 表格行高 | 强制固定为 **`44px`**，垂直居中 | 行高自适应或过高过低 |\n| **客观中立** | 去除主观定性评价 | 纯客观时序（同比/基准偏差量），无主观定性褒贬文字 | 出现“优良”、“合格奖励”、“落后单位”等主观文字 |\n\n---\n\n*特变电工能碳数字化双中心研发团队 · 工程技术规范*\n"
  },
  {
    "id": "manual-37",
    "no": 37,
    "filename": "37_左上角品牌规范与双中心导航交互开发手册.md",
    "title": "左上角品牌规范与双中心导航交互开发手册",
    "category": "数据录入与组件设计",
    "readTime": "16 分钟",
    "wordCount": 7966,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "一、 编制背景与设计哲学 (Background & Philosophy)",
        "id": "一-编制背景与设计哲学-background-philosophy"
      },
      {
        "level": 3,
        "title": "1.1 需求背景与痛点回顾",
        "id": "1-1-需求背景与痛点回顾"
      },
      {
        "level": 2,
        "title": "二、 核心规范与 Design Tokens (Design Standards)",
        "id": "二-核心规范与-design-tokens-design-standards"
      },
      {
        "level": 3,
        "title": "2.1 整体空间与布局网格",
        "id": "2-1-整体空间与布局网格"
      },
      {
        "level": 3,
        "title": "2.2 视觉元素四级阶梯规范",
        "id": "2-2-视觉元素四级阶梯规范"
      },
      {
        "level": 2,
        "title": "三、 导航栏垂直居中与人机工程标准 (Navigation Ergonomics)",
        "id": "三-导航栏垂直居中与人机工程标准-navigation-ergonomics"
      },
      {
        "level": 2,
        "title": "四、 代码实现与架构指引 (Implementation Architecture)",
        "id": "四-代码实现与架构指引-implementation-architecture"
      },
      {
        "level": 3,
        "title": "4.1 核心组件实现片段 (`components/shared/platform-shell.tsx`)",
        "id": "4-1-核心组件实现片段-components-shared-platform-shell-tsx"
      },
      {
        "level": 2,
        "title": "五、 生产环境发布与部署契约 (Deployment Contract)",
        "id": "五-生产环境发布与部署契约-deployment-contract"
      },
      {
        "level": 3,
        "title": "部署目标路径与端点校验矩阵：",
        "id": "部署目标路径与端点校验矩阵"
      },
      {
        "level": 2,
        "title": "六、 附录：关联文件清单 (References)",
        "id": "六-附录-关联文件清单-references"
      }
    ],
    "content": "# 📚 37_左上角品牌规范与双中心导航交互开发手册\n\n> **文档元数据 (Document Metadata)**  \n> - **手册编号**：MANUAL-FE-37  \n> - **版本号**：V1.0  \n> - **编制日期**：2026-09-11  \n> - **适用团队**：特变电工能碳数字化双中心研发团队（PM / 前端架构师 / 交付团队 / 集成测试）  \n> - **权威规范依据**：  \n>   1. 《UI页面修改 (2).pdf》（官方下发核心 UI 设计修改文件，第 1、2 页“导航栏样式”）  \n>   2. 项目专属设计系统规范：[`tbea-industrial-design`](../.gemini/skills/tbea-industrial-design/SKILL.md)  \n>   3. 交付打包与发布规范：[`tbea-delivery-packaging`](../.gemini/skills/tbea-delivery-packaging/SKILL.md)  \n>   4. Agent 开发与工程维护准则：[`AGENTS.md`](../AGENTS.md)  \n\n---\n\n## 一、 编制背景与设计哲学 (Background & Philosophy)\n\n### 1.1 需求背景与痛点回顾\n在特变电工“双中心”（零碳园区集控中心 + 产品碳足迹集采中心）平台演进过程中，左侧导航栏的头部区域此前存在若干视觉与交互偏差：\n1. **Logo 衬底冗余卡片**：此前将 Logo 放入一个白色圆角实体卡片（`bg-white rounded px-1.5 py-0.5`）中缩放呈现，与深蓝背景产生生硬的视觉割裂；\n2. **非对称偏左排版**：Logo、中文大标题与英文副标题均为左对齐，且右侧挤占了折叠按钮，破坏了工业监控系统的中轴对称美感；\n3. **英文副标题意外折行**：由于字号设置偏大（`9.5px`）、间距过宽且缺少不可折行约束，在标准 260px 宽度侧边栏下，`PARK CENTRALIZED CONTROL CENTER` 中的“CENTER”在部分视口下掉落至第二行；\n4. **子菜单垂直居中缺失**：子菜单因 `block h-[30px] leading-[30px]` 属性导致文字靠近顶部、底部空出大面积留白，缺乏垂直居中的工业精致度。\n\n根据官方最新下发的《UI页面修改 (2).pdf》权威设计规范及用户最新核验截图，本手册正式固化左上角品牌区域与双中心导航交互的工程实现标准。\n\n---\n\n## 二、 核心规范与 Design Tokens (Design Standards)\n\n### 2.1 整体空间与布局网格\n- **侧边导航栏总宽度**：固定为 **`260px`** (`w-[260px]`)；\n- **品牌头部容器**：\n  - 布局模式：严格采用 **垂直堆叠、绝对水平居中**（`flex flex-col items-center text-center`）；\n  - 容器内边距：`px-4 pt-6 pb-5`（横向留白 16px，内容有效宽度 228px；纵向舒展，黄金比例呼吸感）；\n  - 底部分割线：微透白线 `border-b border-white/15`（暗黑端为 `border-b border-sidebar-border`）。\n\n### 2.2 视觉元素四级阶梯规范\n\n```\n┌───────────────────────────────────────────┐  <- 260px 侧边栏\n│                 pt-6                      │\n│            [TBEA 特变电工]                │  <- 1. 官方纯白矢量 LOGO (h: 22px, 居中)\n│                 mt-4                      │\n│            零碳园区集控中心                │  <- 2. 中文大标题 (18px 加粗, 居中)\n│                mt-1.5                     │\n│    PARK CENTRALIZED CONTROL CENTER        │  <- 3. 英文副标题 (8px, 强制单行, 居中)\n│                 mt-5                      │\n│   ┌───────────────────────────────────┐   │\n│   │ (🌐) 零碳园区集控中心           ∨ │   │  <- 4. 业务中心切换圆角胶囊 (h: 42px)\n│   └───────────────────────────────────┘   │\n│                 pb-5                      │\n├───────────────────────────────────────────┤  <- border-b border-white/15\n│ 导航菜单项 (h-36px, 垂直居中)              │\n```\n\n#### 1. 官方纯白矢量 LOGO (`/logo-white.png`)\n- **资产来源**：从官方《UI页面修改 (2).pdf》提取的高保真纯白矢量 PNG（分辨率 440×38，RGBA 透明通道）；\n- **尺寸规则**：高度固定为 **`22px`**（`h-[22px] w-auto object-contain mx-auto`），按 11.58 宽高比自动适配宽度为约 208px，在 228px 内容区内居中呈现；\n- **反冗余约束**：严禁在 Logo 外层包裹任何实体白底卡片或色块，纯白 Logo 必须直接浮现于深蓝/暗黑背景之上。\n\n#### 2. 系统中文大标题\n- **字号与字重**：**`18px`** (`text-[18px]`)，粗体 (`font-bold`)；\n- **字体色彩**：纯白 (`text-white`)；\n- **字间距与行高**：微松弛字距 `tracking-[0.06em]`，行高 `leading-tight`；\n- **文字自适应**：\n  - 零碳园区集控中心模式：显示为 **“零碳园区集控中心”**；\n  - 产品碳足迹集采中心模式：显示为 **“产品碳足迹集采中心”**。\n\n#### 3. 系统英文小字（单行强制约束）\n- **字号与字重**：**`8px`** (`text-[8px]`)，中等字重 (`font-medium`)；\n- **字体色彩**：微透高对比白 (`text-white/75`)；\n- **字间距与排版**：大写字母间距 `tracking-[0.1em]`，大写转换 `uppercase`；\n- **单行硬性防御**：显式注入 **`whitespace-nowrap`** 与 `leading-none`，彻底阻断任何跨端分辨率下的折行风险；\n- **英文对照**：\n  - 零碳园区集控中心：`PARK CENTRALIZED CONTROL CENTER`；\n  - 产品碳足迹集采中心：`PRODUCT CARBON FOOTPRINT CENTER`。\n\n#### 4. 业务中心选择器圆角胶囊 (`DualCenterCapsule`)\n- **外观形态**：`rounded-xl border border-white/40 bg-white/10 hover:bg-white/15 active:bg-white/20 px-3.5 py-2.5 shadow-xs backdrop-blur-xs`；\n- **内部左侧**：纯白 `Globe` 地球线条图标（size-5，不含背景方块），搭配 14px 中等粗细标题文字（`text-[14px] font-medium text-white`）；\n- **内部右侧**：纯白 `ChevronDown` 箭头（size-4，展开时顺畅旋转 180 度）；\n- **弹窗交互**：点击平滑展开浮层（浅色端纯白实底卡片带阴影，暗黑端科技蓝毛玻璃背板），支持零碳园区集控中心与产品碳足迹集采中心一键切换。\n\n---\n\n## 三、 导航栏垂直居中与人机工程标准 (Navigation Ergonomics)\n\n针对侧边导航栏及下属组织架构树，全面统一垂直居中机制：\n\n| 组件节点 | 规范高度 | 对齐实现机制 | 状态样式标准 |\n| :--- | :---: | :--- | :--- |\n| **一级主导航项** | **`36px`** | `flex items-center px-3 h-[36px]` | 激活态实心蓝胶囊 / 悬停柔光 |\n| **二级子导航项** | **`32px`** | `flex items-center px-2.5 h-[32px]` | 激活态科技蓝底白字 / 彻底消除文字顶偏 |\n| **组织拓扑树节点** | **`30px`** | `flex items-center px-2 h-[30px]` | 激活态圆角浅蓝 `#EBF3FF` + 蓝字 `#2C7CFF` |\n| **折叠切换按钮** | **`32px`** | 统一定位于主工作区顶栏面包屑左侧 | 消除对侧边栏品牌区域水平对称性的破坏 |\n\n---\n\n## 四、 代码实现与架构指引 (Implementation Architecture)\n\n### 4.1 核心组件实现片段 (`components/shared/platform-shell.tsx`)\n\n```tsx\n{/* 顶部特变电工官方 LOGO 品牌栏 + 业务中心选择器 (100% 像素级对齐设计规范) */}\n<div className=\"px-4 pt-6 pb-5 shrink-0 border-b border-white/15\">\n  {sidebarOpen ? (\n    <div className=\"flex flex-col items-center\">\n      {/* 官方纯白矢量 LOGO */}\n      <Link\n        href=\"/\"\n        className=\"group focus:outline-none transition-transform hover:scale-[1.02]\"\n        title=\"特变电工能碳数字化双中心\"\n      >\n        <img\n          src=\"/logo-white.png\"\n          alt=\"TBEA 特变电工\"\n          className=\"h-[22px] w-auto object-contain mx-auto\"\n        />\n      </Link>\n\n      {/* 系统中文大标题 */}\n      <div className=\"mt-4 text-center\">\n        <span className=\"font-bold text-[18px] tracking-[0.06em] text-white block leading-tight\">\n          {resolvedPlatformKey === 'carbon-footprint' ? '产品碳足迹集采中心' : '零碳园区集控中心'}\n        </span>\n        {/* 系统英文小字 (缩小字号，强制单行显示) */}\n        <span className=\"text-[8px] font-medium text-white/75 block tracking-[0.1em] uppercase text-center mt-1.5 leading-none whitespace-nowrap\">\n          {resolvedPlatformKey === 'carbon-footprint' ? 'PRODUCT CARBON FOOTPRINT CENTER' : 'PARK CENTRALIZED CONTROL CENTER'}\n        </span>\n      </div>\n\n      {/* 业务中心切换圆角胶囊下拉菜单 */}\n      <div className=\"relative w-full mt-5\" ref={dropdownRef}>\n        <button\n          type=\"button\"\n          onClick={() => setDropdownOpen((v) => !v)}\n          className=\"flex w-full items-center justify-between rounded-xl border border-white/40 bg-white/10 hover:bg-white/15 active:bg-white/20 px-3.5 py-2.5 text-white transition-all cursor-pointer shadow-xs backdrop-blur-xs select-none\"\n          title=\"点击切换业务中心\"\n        >\n          <div className=\"flex items-center gap-2.5 overflow-hidden\">\n            <Globe className=\"size-5 text-white shrink-0\" strokeWidth={1.8} />\n            <span className=\"text-[14px] font-medium text-white tracking-wide truncate\">\n              {resolvedPlatformKey === 'carbon-footprint' ? '产品碳足迹集采中心' : '零碳园区集控中心'}\n            </span>\n          </div>\n          <ChevronDown className={cn('size-4 text-white/90 shrink-0 transition-transform duration-200', dropdownOpen && 'rotate-180')} />\n        </button>\n\n        {dropdownOpen && (\n          <div className=\"absolute left-0 right-0 top-full z-50 mt-1.5 rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xl animate-in fade-in-0 zoom-in-95 text-slate-800\">\n            {/* 业务中心切换选项列表 */}\n          </div>\n        )}\n      </div>\n    </div>\n  ) : (\n    /* 折叠态极简呈现 */\n    <div className=\"flex flex-col items-center gap-3\">\n      <Link href=\"/\" title=\"特变电工能碳数字化双中心\">\n        <Globe className=\"size-6 text-white hover:text-white/80 transition-colors\" />\n      </Link>\n    </div>\n  )}\n</div>\n```\n\n---\n\n## 五、 生产环境发布与部署契约 (Deployment Contract)\n\n当需要将最新成果部署至线上生产服务器（`8.215.89.194`）时，必须执行标准化部署流水线：\n\n```bash\n# 1. 本地双端静态全量编译检查 (必须 77/77 路由 0 报错通过)\npnpm run build (暗黑端, 端口 3000)\npnpm run build (浅色端, 端口 3001)\n\n# 2. 调用自动化部署引擎\npy -3 scratch/deploy_8215.py\n```\n\n### 部署目标路径与端点校验矩阵：\n- **暗黑科技蓝宿主机路径**：`/var/www/tbea-nengtan/` ➔ `http://8.215.89.194:3000/`\n- **浅色商务办公宿主机路径**：`/var/www/tbea-nengtan-old/` ➔ `http://8.215.89.194:3001/`\n- **权限与服务生效**：自动赋权 `www-data:www-data 755` 并通过 `sudo systemctl reload nginx` 执行无损热重载；\n- **端点自测验收**：\n  - `http://8.215.89.194:3000/zero-carbon/monitor/indicator` ➔ `HTTP 200 OK`\n  - `http://8.215.89.194:3001/zero-carbon/monitor/indicator` ➔ `HTTP 200 OK`\n  - `http://8.215.89.194:3000/carbon-footprint/cockpit` ➔ `HTTP 200 OK`\n  - `http://8.215.89.194:3001/carbon-footprint/cockpit` ➔ `HTTP 200 OK`\n\n---\n\n## 六、 附录：关联文件清单 (References)\n\n- **核心组件**：\n  - `产品原型/components/shared/platform-shell.tsx`\n  - `产品原型-旧/产品原型/components/shared/platform-shell.tsx`\n- **静态资产**：\n  - `产品原型/public/logo-white.png`\n  - `产品原型-旧/产品原型/public/logo-white.png`\n- **设计规范**：\n  - `开发手册/36_UI页面设计规范与工业视觉标准手册.md`\n  - `.gemini/skills/tbea-industrial-design/SKILL.md`\n"
  },
  {
    "id": "manual-38",
    "no": 38,
    "filename": "38_特变电工集控中心标准组件库开发与调用手册.md",
    "title": "特变电工集控中心标准组件库开发与调用手册",
    "category": "数据录入与组件设计",
    "readTime": "13 分钟",
    "wordCount": 6452,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "🏛️ 一、 规范与设计哲学",
        "id": "一-规范与设计哲学"
      },
      {
        "level": 2,
        "title": "🎨 二、 官方 Design Tokens 字典使用",
        "id": "二-官方-design-tokens-字典使用"
      },
      {
        "level": 3,
        "title": "1. 8 大能源介质官方标准色 (`ENERGY_MEDIA_TOKENS`)",
        "id": "1-8-大能源介质官方标准色-energy_media_tokens"
      },
      {
        "level": 3,
        "title": "2. 4 段分时电量 (TOU) 标准色 (`TOU_PERIOD_TOKENS`)",
        "id": "2-4-段分时电量-tou-标准色-tou_period_tokens"
      },
      {
        "level": 2,
        "title": "🧩 三、 核心标准组件清单与 API",
        "id": "三-核心标准组件清单与-api"
      },
      {
        "level": 3,
        "title": "1. 容器与指标卡 (Containers & KPI Cards)",
        "id": "1-容器与指标卡-containers-kpi-cards"
      },
      {
        "level": 3,
        "title": "2. 44px 工业高密数据表格与导出 (DataTable & Export)",
        "id": "2-44px-工业高密数据表格与导出-datatable-export"
      },
      {
        "level": 3,
        "title": "3. 极简单行工业空状态 (`EmptyState`)",
        "id": "3-极简单行工业空状态-emptystate"
      },
      {
        "level": 3,
        "title": "4. 标准表单与交互控件 (Controls)",
        "id": "4-标准表单与交互控件-controls"
      },
      {
        "level": 2,
        "title": "🚀 四、 业务页面标准开发示例",
        "id": "四-业务页面标准开发示例"
      }
    ],
    "content": "# 📦 38. 特变电工集控中心标准组件库开发与调用手册 (TBEA Design System)\n\n> **版本**：v1.1.0  \n> **适用平台**：特变电工（电装集团）“双中心”数字化集成平台（零碳园区集控中心 + 产品碳足迹集采中心）  \n> **代码统一出口**：`@/components/design-system`  \n> **在线画廊入口**：`/design-system`（左侧导航栏【基础管理】➔【组件规范库】）  \n> **技术底座**：Next.js 16.3 (Turbopack) + React 19 + TypeScript 5.7+ + Tailwind CSS 4.3 + Lucide Icons + Recharts 3.10  \n> **设计基准依据**：《UI页面修改 (2).pdf》、`tbea-industrial-design` 专属技能与集控中心实战工程沉淀  \n\n---\n\n## 🏛️ 一、 规范与设计哲学\n\n特变电工平台工程开发遵循 **“以集控中心为蓝本，工业实用主义、高信噪比、严格客观中立”** 的铁律：\n\n1. **状态自解释**：通过边框高亮（`border-primary ring-2`）自然呈现激活状态，严禁添加“已选中”、“图表联动中”等过程说明标签；\n2. **客观中立原则**：严禁在卡片、徽章或表格中出现“电能品质：优良”、“表现优异”、“落后单位”等定性评判或说教性评价，统一以时序对比（YoY 同比、基准偏差量）与客观工况（运行中、待机、检修）表达；\n3. **极简反冗余**：卡片与图表头部直接呈现核心数据，杜绝新手自述提示语；空状态统一采用单行干练结论（`暂无相关工序！`、`暂无相关产品！`、`暂无相关记录！`）；\n4. **五大工业静态不变量**：\n   - 表格行高强制 **`44px`**（`h-[44px]`）；\n   - 主题科技蓝统一 **`#2C7CFF`**；\n   - 导出按钮统一固定尺寸 **`80px × 36px`**，圆角 `8px`，背景 `#2C7CFF`，白字白图标；\n   - 输入框与下拉选择框统一推荐宽度 **`200px`**，高度固定 **`36px`**，圆角 `8px`，描边 `#E2E8F0`；\n   - 左侧导航栏固定 **`260px`**，拓扑树节点间距 **`30px`**，浅蓝激活底色 **`#EBF3FF`**。\n\n---\n\n## 🎨 二、 官方 Design Tokens 字典使用\n\n在业务代码中可直接解构引入：\n\n```tsx\nimport {\n  ENERGY_MEDIA_TOKENS,\n  TOU_PERIOD_TOKENS,\n  LAYOUT_TOKENS,\n  TYPOGRAPHY_TOKENS,\n} from '@/components/design-system'\n```\n\n### 1. 8 大能源介质官方标准色 (`ENERGY_MEDIA_TOKENS`)\n\n| 介质 Key | 名称 | 标准色值 | 常用单位 | 业务场景 |\n| :--- | :--- | :--- | :--- | :--- |\n| `electricity` | **总用电量** | `#2C7CFF` | kWh | 平台主题主色、全厂总用电量、主操作按钮 |\n| `grid` | **市电量** | `#41C0FF` | kWh | 电网购入电量、市电供应占比 |\n| `green` | **直供绿电量** | `#00D492` | kWh | 分布式光伏发电、绿电消纳率 |\n| `water` | **水资源** | `#10C4CE` | t | 工业用水消耗、循环水监测 |\n| `gas` | **天然气** | `#FF6536` | m³ | 窑炉天然气消耗、锅炉热力采样 |\n| `steam` | **蒸汽** | `#FFBA00` | t | 外购蒸汽总量、工艺干燥固化（原管道工作压力） |\n| `oil` | **油消耗** | `#8E73ED` | L | 变压器注油台账、柴油发电机消耗 |\n| `nitrogen` | **液氮** | `#4F39F6` | Nm³ | 低温试验保护、特殊制造氮气消耗 |\n\n### 2. 4 段分时电量 (TOU) 标准色 (`TOU_PERIOD_TOKENS`)\n\n- **尖峰 (`sharp`)**：`#FF6536`（警示橙红）\n- **高峰 (`peak`)**：`#FFBA00`（活力金黄）\n- **平段 (`flat`)**：`#2C7CFF`（稳健科技蓝）\n- **低谷 (`valley`)**：`#10C4CE`（低谷青蓝）\n\n---\n\n## 🧩 三、 核心标准组件清单与 API\n\n### 1. 容器与指标卡 (Containers & KPI Cards)\n\n#### `Panel` 面板容器\n```tsx\nimport { Panel } from '@/components/design-system'\n\n<Panel\n  title=\"用能在线监测\"\n  icon={Cpu}\n  actions={<ExportButton title=\"导出\" onClick={handleExport} />}\n>\n  {/* 内容区域，标准 8px 圆角与 #DBE6EE 描边 */}\n</Panel>\n```\n\n#### `KpiCard` 工业指标卡\n```tsx\nimport { KpiCard } from '@/components/design-system'\n\n<KpiCard\n  title=\"全厂总用电量\"\n  value=\"128,450\"\n  unit=\"kWh\"\n  delta=\"-4.2%\"\n  up={false} // false 为绿色节能下降，true 为橙红上升\n  icon={Zap}\n/>\n```\n\n---\n\n### 2. 44px 工业高密数据表格与导出 (DataTable & Export)\n\n#### `DataTable` 表格组件\n全站统一 44px 行高，垂直居中，支持排序：\n```tsx\nimport { DataTable } from '@/components/design-system'\n\nconst columns = [\n  { key: 'code', label: '设备编号', align: 'left', sortable: true },\n  { key: 'name', label: '设备名称', align: 'left' },\n  { key: 'media', label: '主耗介质', align: 'center', render: (r) => <EnergyBadge media={r.media} /> },\n  { key: 'value', label: '读数', align: 'right', sortable: true },\n]\n\n<DataTable columns={columns} rows={rows} />\n```\n\n#### `ExportButton` 标准导出按钮\n固定尺寸 `80px × 36px`，`#2C7CFF` 背景：\n```tsx\nimport { ExportButton } from '@/components/design-system'\n\n<ExportButton title=\"导出台账\" onClick={handleExport} />\n```\n\n---\n\n### 3. 极简单行工业空状态 (`EmptyState`)\n\n```tsx\nimport { EmptyState } from '@/components/design-system'\n\n// 工序判空（10家无工序单位精准输出单行）\n<EmptyState type=\"process\" /> // 渲染：暂无相关工序！\n\n// 产品判空\n<EmptyState type=\"product\" /> // 渲染：暂无相关产品！\n\n// 记录判空\n<EmptyState type=\"record\" />  // 渲染：暂无相关记录！\n```\n\n---\n\n### 4. 标准表单与交互控件 (Controls)\n\n#### `SearchInput` 标准搜索框 (200px × 36px)\n```tsx\nimport { SearchInput } from '@/components/design-system'\n\n<SearchInput\n  value={searchKey}\n  onChange={(e) => setSearchKey(e.target.value)}\n  onSearch={(val) => handleSearch(val)}\n  placeholder=\"请输入搜索关键词\"\n/>\n```\n\n#### `StandardSelect` 标准下拉框 (200px × 36px)\n```tsx\nimport { StandardSelect } from '@/components/design-system'\n\n<StandardSelect\n  value={selectedType}\n  onChange={setSelectedType}\n  options={[\n    { value: 'all', label: '全部介质' },\n    { value: 'electricity', label: '电力监测' },\n  ]}\n/>\n```\n\n#### `Tabs` 实心科技蓝胶囊页签\n```tsx\nimport { Tabs } from '@/components/design-system'\n\n<Tabs\n  value={activeTab}\n  onChange={setActiveTab}\n  items={[\n    { value: 'day', label: '日度' },\n    { value: 'month', label: '月度' },\n    { value: 'quarter', label: '季度' },\n    { value: 'year', label: '年度' },\n  ]}\n/>\n```\n\n#### `StatusBadge` 客观状态徽章\n```tsx\nimport { StatusBadge } from '@/components/design-system'\n\n<StatusBadge tone=\"ok\">运行中</StatusBadge>\n<StatusBadge tone=\"info\">待机中</StatusBadge>\n<StatusBadge tone=\"warn\">巡检维护</StatusBadge>\n<StatusBadge tone=\"danger\">故障离线</StatusBadge>\n```\n\n#### `EnergyBadge` / `TouBadge` 介质与分时徽章\n```tsx\nimport { EnergyBadge, TouBadge } from '@/components/design-system'\n\n<EnergyBadge media=\"electricity\" showUnit />\n<TouBadge period=\"sharp\" />\n```\n\n---\n\n## 🚀 四、 业务页面标准开发示例\n\n```tsx\n'use client'\n\nimport { useState } from 'react'\nimport {\n  Panel,\n  KpiCard,\n  DataTable,\n  ExportButton,\n  Tabs,\n  SearchInput,\n  StandardSelect,\n  EnergyBadge,\n  BenchmarkIndicator,\n  StatusBadge,\n} from '@/components/design-system'\nimport { Zap, Flame } from 'lucide-react'\n\nexport default function BusinessDemoPage() {\n  const [tab, setTab] = useState('month')\n  const [search, setSearch] = useState('')\n\n  return (\n    <div className=\"space-y-6\">\n      {/* 1. 顶部指标栏 */}\n      <div className=\"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4\">\n        <KpiCard title=\"当日总电量\" value=\"38,200\" unit=\"kWh\" delta=\"-3.5%\" up={false} icon={Zap} />\n        <KpiCard title=\"当日蒸汽消耗\" value=\"280.5\" unit=\"t\" delta=\"+1.2%\" up={true} icon={Flame} />\n      </div>\n\n      {/* 2. 主监控面板 */}\n      <Panel\n        title=\"在线设备用能明细\"\n        actions={<ExportButton title=\"导出\" onClick={() => {}} />}\n      >\n        <div className=\"flex flex-wrap items-center justify-between gap-3 mb-4\">\n          <Tabs\n            value={tab}\n            onChange={setTab}\n            items={[\n              { value: 'day', label: '日视图' },\n              { value: 'month', label: '月视图' },\n            ]}\n          />\n          <div className=\"flex items-center gap-3\">\n            <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} />\n            <StandardSelect\n              options={[{ value: 'all', label: '全厂设备' }]}\n            />\n          </div>\n        </div>\n\n        {/* 44px 表格 */}\n        <DataTable columns={columns} rows={rows} />\n      </Panel>\n    </div>\n  )\n}\n```\n"
  }
];

/* 2. 3 卷 PRD 需求规格说明书清单 */
export const PRD_DOCS: PrdDoc[] = [
  {
    "id": "prd-00",
    "vol": "PRD-00",
    "filename": "PRD-00_全局业务架构与术语规范.md",
    "title": "全局业务架构与术语规范",
    "readTime": "8 分钟",
    "wordCount": 3882,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "一、 顶层业务架构与产品战略定位",
        "id": "一-顶层业务架构与产品战略定位"
      },
      {
        "level": 2,
        "title": "二、 核心用户画像与六级穿透鉴权",
        "id": "二-核心用户画像与六级穿透鉴权"
      },
      {
        "level": 2,
        "title": "三、 六级组织架构与基地统一编码权威对照表",
        "id": "三-六级组织架构与基地统一编码权威对照表"
      }
    ],
    "content": "# 【PRD-00】全局业务架构、术语体系与组织模型规范\n\n> **文档受控编号**：`TBEA-PRD-MASTER-2026-VOL-00`  \n> **归属工程**：特变电工能碳数字化双中心  \n> **基线版本**：Release v1.2.0 (生产基线版)  \n> **密级**：内部绝密 (L4 - Top Secret)  \n> **生效日期**：2026-09-14  \n\n---\n\n## 一、 顶层业务架构与产品战略定位\n\n特变电工能碳数字化双中心是面向特变电工全集团（涵盖输变电、新能源、新材料三大产业板块及下属 15 个生产基地）打造的工业级能碳一体化数字化中枢，支撑“从物理工厂设备级用能，到集团宏观战略管控，再到全球产品出海合规”的全链路数字化闭环。\n\n```mermaid\ngraph TB\n    subgraph L1[\"集控展示层 (Executive View)\"]\n        A1[\"零碳园区集控大屏 (46:9 环幕 / 16:9 驾驶舱)\"]\n        A2[\"对外示范窗口驾驶舱 (全生命周期 LCA 碳足迹)\"]\n    end\n\n    subgraph L2[\"双核心业务平台 (Dual Core Platforms)\"]\n        subgraph P1[\"【中心一】零碳园区集控中心 (Zero-Carbon Executive Center)\"]\n            B1[\"集中监管 (指标管控/在线监测/微电网防逆流/碳排放)\"]\n            B2[\"能耗能效分析 (结构/成本/单耗/47工序对标)\"]\n            B3[\"零碳项目评估 (立项台账/效益评估/工厂100分自评估)\"]\n            B4[\"统计报表 (用能/成本/单耗/财务月度关账)\"]\n            B5[\"基础管理 (四大填报工作台: 产量/能源/相册/大事记)\"]\n        end\n\n        subgraph P2[\"【中心二】产品碳足迹集采中心 (Carbon Footprint Center)\"]\n            C1[\"多维对比分析 (横向对比 / 纵向趋势 / 基准对标)\"]\n            C2[\"实景数据库与 LCA核算 (五阶段滚算 / 双语报告 / EPC碳标签)\"]\n            C3[\"CBAM 欧盟碳关税合规 (前驱物拆解 / XML申报包 / ETS汇率联动)\"]\n            C4[\"因子库与认证协同 (本土实测因子 / Ecoinvent授权 / 第三方核验)\"]\n        end\n    end\n\n    subgraph L3[\"底层数据与基础设施 (Data & Infrastructure)\"]\n        D1[\"工业物联网采集 (OPC UA / Modbus-TCP / MQTT 5.0)\"]\n        D2[\"企业系统集成 (SAP S/4HANA / 用友 NC / MES 接口)\"]\n        D3[\"时序与关系混合数仓 (PostgreSQL 16 + TimescaleDB + Redis 7.2)\"]\n        D4[\"信创与安全防护体系 (鲲鹏/海光 + 统信/麒麟 + 国密SM2/3/4 + 等保三级)\"]\n    end\n\n    L1 --> L2\n    L2 --> L3\n```\n\n---\n\n## 二、 核心用户画像与六级穿透鉴权\n\n| 角色编号 | 角色名称 | 代表岗位 | 核心使用场景 | 访问与操控边界 |\n|:---|:---|:---|:---|:---|\n| **P1** | **集团决策层** | 集团董事长、分管副总裁、双碳战略总监 | 查看宏观指标大屏、万元产值能耗趋势、审批月度特批反冲、LCA报告与CBAM出境终审签章 | 全集团数据穿透只读 + 关键高危动作唯一电子签章权 |\n| **P2** | **园区能碳专员** | 各基地动力处长、能源运行主管 | 监控所辖工厂设备与微电网消纳，审核车间月度报工与能源消耗，维护零碳自评估打分 | 仅限所辖组织树节点读写与初审 |\n| **P3** | **车间填报员** | 生产车间统计员、动力车间值班员 | 44px 高密填报工作台离线填报（产量、用能、相册、大事记） | 仅限所辖车间录入、提交与撤回 |\n| **P4** | **碳核算工程师** | 集团碳资产部、产品研发 LCA 专员 | 维护产品 BOM 与工序边界、匹配碳因子、执行 LCA 自动滚算、签发报告草案 | LCA 模块全权限 CRUD + 送审 |\n| **P5** | **国际贸易专家** | 国际业务部合规经理、海关报关员 | 追溯出口变压器/电缆 CBAM 前驱物碳排、模拟关税、生成并导出欧盟 XML 申报包 | CBAM 模块全权限 + 申报出境触发 |\n| **P6** | **外部审计机构** | 莱茵/SGS/方圆认证等第三方核查员 | 访问专用只读审计通道，核验 LCA 原始凭证、BOM 映射、物联遥测与 SHA-256 哈希链 | 专有独立只读审计通道 |\n\n---\n\n## 三、 六级组织架构与基地统一编码权威对照表\n\n针对前期文档 18 基地 vs 15 园区数字矛盾，权威明确：特变电工集团中长期规划 18 个生产基地，本期系统基线接入 15 个主力投产园区，预留 3 个在建及海外园区编码：\n\n| 园区统一编码 | 归属二级经营单位 | 生产基地/园区标准名称 | 核心产品/能耗形态 | 工序白名单规则 |\n|:---|:---|:---|:---|:---|\n| **TB-PK-001** | 特变电工沈变公司 | 沈阳变压器集团沈北特高压生产基地 | 特高压交流变压器 / 电力、天然气 | 覆盖 47 项变压器标准工序 |\n| **TB-PK-002** | 特变电工衡变公司 | 衡阳变压器有限公司雁峰产业基地 | 直流换流变压器 / 电力、蒸汽 | 覆盖 47 项变压器标准工序 |\n| **TB-PK-003** | 特变电工新变厂 | 新疆变压器厂昌吉高新产业基地 | 配电变与特种箱变 / 电力、燃气 | 覆盖 47 项变压器标准工序 |\n| **TB-PK-004** | 特变电工鲁缆公司 | 山东鲁能泰山电缆新泰超高压基地 | 超高压交联电缆 / 电力、蒸汽 | 覆盖线缆专属工序 |\n| **TB-PK-005** | 特变电工新缆厂 | 新疆线缆厂昌吉总厂制造基地 | 架空绝缘线与控制电缆 / 电力 | 覆盖线缆专属工序 |\n| **TB-PK-006** | 特变电工德缆公司 | 四川德阳电缆高新生产基地 | 矿用特种橡套电缆 / 电力、燃气 | 覆盖线缆专属工序 |\n| **TB-PK-007** | 天传电控设备公司 | 天津天传电控成套产业园 | 大型电控箱柜 / 电力 | 专属特定组装工序 |\n| **TB-PK-008** | 西安柔输成套公司 | 西安柔性输配电产业基地 | SVG/特种高压变频器 / 电力 | 专属特定电子工序 |\n| **TB-PK-009** | 新疆天池能源公司 | 准东五彩湾煤电化一体化工业园 | 火力发电机组 / 煤炭、电力、水 | 大型火电与煤化工流程 |\n| **TB-PK-010** | 新疆天池能源公司 | 准东北露天智慧矿山数字化园区 | 采掘重卡 / 柴油、纯电重卡 | 数字化智慧露天矿流程 |\n| **TB-PK-011** | 新特能源股份公司 | 硅基高纯多晶硅产业基地 | 高纯多晶硅 / 电力、液氮、蒸汽 | 光伏高纯硅料流程 |\n| **TB-PK-012** | 特变自控设备公司 | 昌吉智能微网控制器产业园 | 自动化控制柜 / 电力 | 自动化装配流程 |\n| **TB-PK-013** | 中发上海高压公司 | 上海高压开关研发制造基地 | GIS组合电器 / 电力、SF6 | 高压开关装配流程 |\n| **TB-PK-014** | 特变衡变出线基地 | 衡阳云集特高压出线装置基地 | 特高压套管 / 电力、特种蒸汽 | 特种绝缘浸胶工序 |\n| **TB-PK-015** | 特变沈变互感基地 | 铁岭互感器成套设备产业基地 | 电流互感器、电抗器 / 电力 | 互感器专用工序 |\n| *TB-PK-016* | *集团预留规划* | *西南特种输配电装备产业园 (在建)* | *特种输配电设备* | *规划预留* |\n| *TB-PK-017* | *集团预留规划* | *印尼绿色智慧工业园 (海外布局)* | *海外本地化组装* | *规划预留* |\n| *TB-PK-018* | *集团预留规划* | *安哥拉海外成套制造基地 (海外)* | *成套工程电网设备* | *规划预留* |\n\n> **10 家无工序直属单位判空规范**：科技投资公司、新能源集控中心、特变电装总部、进出口贸易公司、工程建设分公司、物资供应链公司、智慧能源科技公司、金融租赁公司、后勤服务中心、设计咨询研究院，无制造产线，工序界面统一单行干练输出：`暂无相关工序！`。\\n"
  },
  {
    "id": "prd-01",
    "vol": "PRD-01",
    "filename": "PRD-01_集中监控大屏与对外示范窗口.md",
    "title": "集中监控大屏与对外示范窗口",
    "readTime": "2 分钟",
    "wordCount": 1084,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "一、 46:9 物理环幕与 16:9 PC 控制台双模方案",
        "id": "一-46-9-物理环幕与-16-9-pc-控制台双模方案"
      },
      {
        "level": 2,
        "title": "二、 自然资源部 3D 浮雕地图合规规范 (GS 审图号)",
        "id": "二-自然资源部-3d-浮雕地图合规规范-gs-审图号"
      },
      {
        "level": 2,
        "title": "三、 5 家实体工厂切片与演示数据标签",
        "id": "三-5-家实体工厂切片与演示数据标签"
      }
    ],
    "content": "# 【PRD-01】集中监控大屏与对外示范窗口规格说明书\n\n> **文档受控编号**：`TBEA-PRD-MASTER-2026-VOL-01`  \n> **标准 NAV-ID**：`NAV-ZC-SCR-MAIN` & `NAV-CF-CKP-MAIN`  \n> **前端路由**：`/zero-carbon/screen` & `/carbon-footprint/cockpit`  \n> **基线版本**：Release v1.2.0 (生产基线版)  \n\n---\n\n## 一、 46:9 物理环幕与 16:9 PC 控制台双模方案\n\n为消歧前期文档中 46:9 与 1920×1080 的冲突，在此确立双模标准：\n1. **物理大屏集控环幕模式**：硬件物理分辨率为 `5760×1126`（长宽比 46:9），由 3 台 1080p 高清激光工程投影或 P1.2 小间距 LED 融合拼接。页面采用三栏等高流式排版（左 1440px : 中 2880px : 右 1440px）；\n2. **桌面 PC 控制台预览模式**：设计基准分辨率 `1920×1080`（16:9），采用 `transform: scale()` 矢量自适应方案，保证在笔记本与宽屏桌面均保持完整比例；\n3. **断点自动探测**：当视口宽度 > 3840px 且宽高比 > 3.5 时，自动渲染 46:9 超宽环幕排版。\n\n---\n\n## 二、 自然资源部 3D 浮雕地图合规规范 (GS 审图号)\n\n> 📌 **合规红线**：\n> 1. 大屏中央 3D 浮雕中国立体地图必须严格基于**国家自然资源部标准地图服务系统**官方底图数据构建（`GS(2024)0600号` 系列）；\n> 2. 严禁遗漏十段线、南海诸岛、钓鱼岛及其附属岛屿；\n> 3. 大屏右下角必须永久保留合规标注文本：【地图审图号：GS(2024)0600号 · 自然资源部监制】。\n\n---\n\n## 三、 5 家实体工厂切片与演示数据标签\n\n1. **企业胶囊 Tab 切换**：右侧提供沈变、衡变、新变、鲁缆、德缆 5 家主力制造工厂 Tab，点击后右侧 10 项重点指标（综合能耗、产值单耗、绿电占比、微电网自发自用、碳排放总量、万元产值碳排、变压器单耗、线缆单耗、负荷率、功率因数）在 ≤150ms 内平滑切片；\n2. **数据状态显式指示**：初验演示阶段采用模拟数据的卡片右上角标注 `[DEMO · 模拟演示]` 微标；接入真实生产数据后自动切换为 `[LIVE · 实时生产]` 绿色标签。\\n"
  },
  {
    "id": "prd-02",
    "vol": "PRD-02",
    "filename": "PRD-02_集中监管系统规格说明书.md",
    "title": "集中监管系统规格说明书",
    "readTime": "3 分钟",
    "wordCount": 1332,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "一、 指标管控看板 (Mode A/B 深度穿透机制)",
        "id": "一-指标管控看板-mode-a-b-深度穿透机制"
      },
      {
        "level": 2,
        "title": "二、 设备在线监测 (32 台重点设备全量台账)",
        "id": "二-设备在线监测-32-台重点设备全量台账"
      },
      {
        "level": 2,
        "title": "三、 工业微电网监测与防逆流控制规格",
        "id": "三-工业微电网监测与防逆流控制规格"
      },
      {
        "level": 2,
        "title": "四、 47 项工序能耗对标与白名单判空",
        "id": "四-47-项工序能耗对标与白名单判空"
      }
    ],
    "content": "# 【PRD-02】集中监管系统全景功能规格说明书\n\n> **文档受控编号**：`TBEA-PRD-MASTER-2026-VOL-02`  \n> **标准 NAV-ID**：`NAV-ZC-MON-IND`、`NAV-ZC-MON-USE`、`NAV-ZC-MON-EQP`、`NAV-ZC-MON-GRD`  \n> **基线版本**：Release v1.2.0 (生产基线版)  \n\n---\n\n## 一、 指标管控看板 (Mode A/B 深度穿透机制)\n\n1. **Mode A（卡片宏观概览）**：展示全厂综合能耗、产值单耗、ESG 水耗等，卡片边框高亮自解释，无多余状态标签；\n2. **Mode B（深入分析详情）**：点击卡片滑出详情抽屉，展示四项核心要素：\n   - 算法公式：包含全部变量释义；\n   - 采集路径：展示物联网电表/流量计点位物理链路；\n   - 时序趋势：过去 12 个月高对比度面积图；\n   - 底层台账：水/电/气/汽四类介质历史明细。\n\n---\n\n## 二、 设备在线监测 (32 台重点设备全量台账)\n\n全系统一期工程纳入 32 台试点设备（23 台电力驱动 + 9 台热力用能），表计指标自适应，原“管道工作压力”规范更名为“**蒸汽消耗量**”：\n- 沈变：1#煤油气相干燥罐 (450kW)、2#煤油干燥罐 (450kW)、800t铁心数控剪切线 (220kW)、1800kV冲击发生器 (150kVA) 等 8 台；\n- 衡变：1#卧式绕线机群 (300kW)、2#真空浇注设备 (310kW)、2400kV特高压耐压试验台 (300kVA) 等 8 台；\n- 新变：自动化箔绕机 (95kW)、悬挂式退火退漆炉 (280kW) 等 6 台；\n- 鲁缆：500kV超高压交联立塔 (680kW)、35kV悬臂挤出机组 (180kW)、盘绞成缆机 (130kW) 等 6 台；\n- 德缆：高速拉丝退火连打机组 (250kW)、特种橡套连续硫化线 (420kW) 等 4 台。\n\n---\n\n## 三、 工业微电网监测与防逆流控制规格\n\n1. **倒送保护触发**：并网点倒送主电网有功功率 $P_{reverse} \\ge 10\text{ kW}$ 持续时间 $\\ge 100\text{ ms}$；\n2. **执行响应时限**：微网调控一体机在 **$\\le 200\text{ ms}$** 内向光伏逆变器集群下发压降指令，以 $5\\% P_{rated}/\text{s}$ 斜率快速限制出力；\n3. **自动复位防抖**：厂内负荷回升且倒送持续 60 秒 $< 2\text{ kW}$ 时，控制器自动以 $2\\% P_{rated}/\text{min}$ 恢复至 MPPT 模式。\n\n---\n\n## 四、 47 项工序能耗对标与白名单判空\n\n依据《生产单位与涉及关键工序对应表(1).et》，全量建立 47 项工序映射字典。变压器产业（剪切、叠装、绕线、干燥、总装、试验等）与线缆产业（拉丝、绞合、立塔挤出、成缆、铠装、护套等）各自对照先进基准。10 家无工序单位严格整行输出单行文本：`暂无相关工序！`。\\n"
  },
  {
    "id": "prd-03",
    "vol": "PRD-03",
    "filename": "PRD-03_能耗能效与对标分析规格说明书.md",
    "title": "能耗能效与对标分析规格说明书",
    "readTime": "2 分钟",
    "wordCount": 789,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "一、 用能结构与能源成本分析",
        "id": "一-用能结构与能源成本分析"
      },
      {
        "level": 2,
        "title": "二、 单位产品能耗与产值单耗核算模型",
        "id": "二-单位产品能耗与产值单耗核算模型"
      }
    ],
    "content": "# 【PRD-03】能耗能效与对标分析规格说明书\n\n> **文档受控编号**：`TBEA-PRD-MASTER-2026-VOL-03`  \n> **标准 NAV-ID**：`NAV-ZC-ENG-STR`、`NAV-ZC-ENG-CST`、`NAV-ZC-ENG-BEN`、`NAV-ZC-ENG-PROD`、`NAV-ZC-ENG-VAL`  \n> **基线版本**：Release v1.2.0 (生产基线版)  \n\n---\n\n## 一、 用能结构与能源成本分析\n\n1. **多能互补桑基图**：直观展示市电、绿电、天然气、外购蒸汽、柴油从购入到转换、分配至各车间与工序的流向；\n2. **分时用电成本优化 (TOU)**：以尖（#FF6536）、峰（#FFBA00）、平（#2C7CFF）、谷（#10C4CE）标准四色呈现负荷分布，自动识别高价时段不合理负荷并输出移峰填谷优化建议。\n\n---\n\n## 二、 单位产品能耗与产值单耗核算模型\n\n$$E_{unit\\_product} = \\frac{\\sum E_{process\\_total}}{Q_{qualified}}$$\n\n$$E_{unit\\_output} = \\frac{\\sum E_{total\\_tce}}{OutputValue_{million\\_yuan}}$$\n\n- **量纲隔离原则**：变压器以 $\\text{tce/kVA}$ 或 $\\text{kWh/kVA}$ 核算；线缆以 $\\text{tce/km}$ 或 $\\text{kWh/km}$ 核算；万元产值以 $\\text{tce/万元}$ 核算，两类产品单耗绝不混编在同一统计列中。\n- **自身时序对标**：仅与自身历史同期（同比）对比，或与国家行业先进值/准入值基准线对比，严禁捏造跨厂横向主观评语。\\n"
  },
  {
    "id": "prd-04",
    "vol": "PRD-04",
    "filename": "PRD-04_零碳项目与工厂自评估规格说明书.md",
    "title": "零碳项目与工厂自评估规格说明书",
    "readTime": "2 分钟",
    "wordCount": 838,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "一、 节能效益评估与动态投资回收期模型",
        "id": "一-节能效益评估与动态投资回收期模型"
      },
      {
        "level": 2,
        "title": "二、 零碳工厂自评估三层体系与 100 分制评分细则",
        "id": "二-零碳工厂自评估三层体系与-100-分制评分细则"
      }
    ],
    "content": "# 【PRD-04】零碳项目与工厂自评估规格说明书\n\n> **文档受控编号**：`TBEA-PRD-MASTER-2026-VOL-04`  \n> **标准 NAV-ID**：`NAV-ZC-PRJ-BEN` & `NAV-ZC-PRJ-SLF`  \n> **基线版本**：Release v1.2.0 (生产基线版)  \n\n---\n\n## 一、 节能效益评估与动态投资回收期模型\n\n针对变频改造、余热回收、光伏并网等技改项目建立全周期台账：\n- **节能量测量与验证 (M&V)**：依据 GB/T 28750，比对技改前后基准线负荷；\n- **动态投资回收期公式**：\n\n$$P_t = (T - 1) + \\frac{\\left| \\sum_{t=1}^{T-1} (CI - CO)_t \\right|}{(CI - CO)_T}$$\n\n---\n\n## 二、 零碳工厂自评估三层体系与 100 分制评分细则\n\n依据 T/CECA-G 0171-2022，构建三层穿透考评：\n- **第 1 层 (集团决策)**：全域星级分布与差距雷达图；\n- **第 2 层 (二级公司)**：各分子公司得分率与达标排名；\n- **第 3 层 (实体车间)**：6 大维度 100 分制打分：\n  1. 基础设施建设 (15分)：绿色建筑设计；不符合扣2分/项；\n  2. 能源利用与消纳 (30分)：光伏自用率 $\\ge 40\\%$、分时储能；梯级扣分；\n  3. 产品生态设计 (20分)：绿色采购、BOM回收率 $\\ge 85\\%$；扣2分/项；\n  4. 温室气体管控 (15分)：碳盘查制度与边界清晰度；遗漏扣5分；\n  5. 碳抵消与中和 (10分)：绿电绿证核销、CCER凭证；未抵消扣5分；\n  6. 运营管理体系 (10分)：ISO 50001 / ISO 14001 认证；超期扣5分。\n- **总分规则**：各项累计扣减，单项最低 0 分，总分下限 0 分。\\n"
  },
  {
    "id": "prd-05",
    "vol": "PRD-05",
    "filename": "PRD-05_统计报表与数据导出规格说明书.md",
    "title": "统计报表与数据导出规格说明书",
    "readTime": "1 分钟",
    "wordCount": 577,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "一、 财务月度关账与特批反冲机制",
        "id": "一-财务月度关账与特批反冲机制"
      },
      {
        "level": 2,
        "title": "二、 44px 高密报表与防伪导出",
        "id": "二-44px-高密报表与防伪导出"
      }
    ],
    "content": "# 【PRD-05】统计报表与数据导出规格说明书\n\n> **文档受控编号**：`TBEA-PRD-MASTER-2026-VOL-05`  \n> **标准 NAV-ID**：`NAV-ZC-RPT-USE`、`NAV-ZC-RPT-CST`、`NAV-ZC-RPT-UNT`、`NAV-ZC-RPT-CAR`  \n> **基线版本**：Release v1.2.0 (生产基线版)  \n\n---\n\n## 一、 财务月度关账与特批反冲机制\n\n1. **关账时点**：每月自然月终了次日 24:00 系统自动触发【财务月度关账】，锁定上月全部能源消耗与产品报工产量，状态切换为只读已关账；\n2. **特批反冲流程**：\n   - 基层填报员 (P3) 发起【数据特批反冲申请】并说明理由；\n   - 动力处长 (P2) 初核确认；\n   - 报经集团决策层 (P1) 通过 2FA 双重电子签章核准；\n   - 系统解封该月份数据权限，修改保存后自动异步触发物化视图重算与历史曲线刷新。\n\n---\n\n## 二、 44px 高密报表与防伪导出\n\n- 全量报表表格行高固定为 `44px` (`h-[44px]`)，垂直居中；\n- 导出 PDF / Excel 自动嵌入带工号的动态半透明防伪水印：【工号 + 姓名 + 导出时间戳】，确保数据离线分发可追溯。\\n"
  },
  {
    "id": "prd-06",
    "vol": "PRD-06",
    "filename": "PRD-06_基础管理与基层数据填报工作台.md",
    "title": "基础管理与基层数据填报工作台",
    "readTime": "1 分钟",
    "wordCount": 549,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "一、 四大核心业务 Tab 同构规格",
        "id": "一-四大核心业务-tab-同构规格"
      },
      {
        "level": 2,
        "title": "二、 强制非负防错校验",
        "id": "二-强制非负防错校验"
      }
    ],
    "content": "# 【PRD-06】基础管理与基层数据填报工作台规格说明书\n\n> **文档受控编号**：`TBEA-PRD-MASTER-2026-VOL-06`  \n> **标准 NAV-ID**：`NAV-ZC-MGT-ENT`  \n> **前端路由**：`/zero-carbon/management/entry`  \n> **基线版本**：Release v1.2.0 (生产基线版)  \n\n---\n\n## 一、 四大核心业务 Tab 同构规格\n\n工作台统一收敛基层离线填报，提供 4 个标准 Tab：\n1. **产品产量录入**：生产单位、工序、产品名称选择；同类型产品产量数据行跨行合并居中；支持台/kVA/km/吨/件级联单位；\n2. **能源消耗录入**：与产量 100% 同构，支持电/水/气/汽四类介质分类填报；\n3. **园区相册维护**：支持光伏电站、储能厂房实景图片上传，自动压缩至 1920×1080 并生成高保真缩略图；\n4. **园区大事记维护**：时间轴节点式录入绿色低碳重大事件。\n\n---\n\n## 二、 强制非负防错校验\n\n所有产量与能耗输入框内嵌即时校验规则：输入负数立即触发 `E_VAL_ENERGY_NEGATIVE`，输入框红框高亮并阻断提交，严禁脏数据入库。\\n"
  },
  {
    "id": "prd-07",
    "vol": "PRD-07",
    "filename": "PRD-07_实景数据库与碳足迹核算.md",
    "title": "实景数据库与碳足迹核算",
    "readTime": "49 分钟",
    "wordCount": 24277,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "一、 文档元数据与多方审签表",
        "id": "一-文档元数据与多方审签表"
      },
      {
        "level": 3,
        "title": "1.1 受控编号",
        "id": "1-1-受控编号"
      },
      {
        "level": 3,
        "title": "1.2 四方审签表",
        "id": "1-2-四方审签表"
      },
      {
        "level": 3,
        "title": "1.3 修订演变历史",
        "id": "1-3-修订演变历史"
      },
      {
        "level": 3,
        "title": "1.4 维护纪律自声明",
        "id": "1-4-维护纪律自声明"
      },
      {
        "level": 2,
        "title": "二、 业务背景与北极星指标",
        "id": "二-业务背景与北极星指标"
      },
      {
        "level": 3,
        "title": "2.1 业务痛点 (Pain Points)",
        "id": "2-1-业务痛点-pain-points"
      },
      {
        "level": 3,
        "title": "2.2 北极星指标 (North Star Metrics)",
        "id": "2-2-北极星指标-north-star-metrics"
      },
      {
        "level": 3,
        "title": "2.3 业务边界 (Scope Boundary)",
        "id": "2-3-业务边界-scope-boundary"
      },
      {
        "level": 2,
        "title": "三、 目标用户画像与权限边界矩阵",
        "id": "三-目标用户画像与权限边界矩阵"
      },
      {
        "level": 3,
        "title": "3.1 用户画像（重点 P4，关联 P1 / P5 / P6）",
        "id": "3-1-用户画像-重点-p4-关联-p1-p5-p6"
      },
      {
        "level": 3,
        "title": "3.2 六级组织树穿透鉴权",
        "id": "3-2-六级组织树穿透鉴权"
      },
      {
        "level": 3,
        "title": "3.3 权限边界矩阵 (RBAC)",
        "id": "3-3-权限边界矩阵-rbac"
      },
      {
        "level": 2,
        "title": "四、 总体架构与端到端数据流",
        "id": "四-总体架构与端到端数据流"
      },
      {
        "level": 3,
        "title": "4.1 模块在双中心中的定位",
        "id": "4-1-模块在双中心中的定位"
      }
    ],
    "content": "---\ndocument_id: TBEA-PRD-CF-LCA-2026-V1.0\nnav_id: NAV-CF-DB-LCA\nmodule: 产品碳足迹集采中心 - 实景数据库 - 碳足迹核算 (LCA Engine)\nlevel: 模块级 PRD\nversion: 1.0.0\nowner_persona: P4 (碳核算与认证工程师)\nactive_skills:\n  - tbea-prd-standards@1.1.0\n  - tbea-industrial-design@1.0.0\nclassification: 内部绝密 (Confidential)\ncreated: 2026-09-08\nlast_revised: 2026-09-08\nstatus: DRAFT (PM 内审中)\n---\n\n# TBEA-PRD-CF-LCA-2026-V1.0 · 碳足迹核算引擎 · 产品需求规格说明书\n\n> **章节索引**：\n> 1. 文档元数据与多方审签 · 2. 业务背景与北极星指标 · 3. 用户画像与权限边界 · 4. 总体架构与端到端数据流 · 5. 工业设计合规声明 · 6. 详细功能规格（按 NAV-CF-DB-LCA 拆解）· 7. 数据字典与核心数学模型 · 8. 非功能性需求 · 9. 外部系统接口契约 · 10. QA 矩阵与验收 · 11. 业务状态机细化 · 12. AI Agent 输出 Schema 实例 · 附录 A 法规映射 · 附录 B 字段 Schema 实例 · 附录 C 状态码断言实例\n\n---\n\n## 一、 文档元数据与多方审签表\n\n### 1.1 受控编号\n\n| 项 | 值 |\n|:---|:---|\n| 受控编号 | `TBEA-PRD-CF-LCA-2026-V1.0` |\n| 文档类型 | 模块级 PRD 详案 |\n| 归属中心 | 产品碳足迹集采中心 (carbon-footprint) |\n| 一级导航 | 实景数据库 |\n| 标准 NAV-ID | `NAV-CF-DB-LCA` |\n| 关联 Skill | `tbea-prd-standards@1.1.0`、`tbea-industrial-design@1.0.0` |\n| 密级 | 内部绝密 (Confidential) |\n| 物理位置 | `D:\\Project\\TJ-nengtan\\PRD\\PRD-07_实景数据库与碳足迹核算.md` |\n| 离线构建产物 | `D:\\Project\\TJ-nengtan\\PRD\\特变电工能碳数字化双中心_产品需求规格说明书_PRD_v1.0.docx` |\n\n### 1.2 四方审签表\n\n| 角色 | 姓名/工号 | 审签结论 | 签字 | 日期 |\n|:---|:---|:---:|:---:|:---:|\n| PM 负责人 | （待填写） | ☐ 通过 ☐ 修改后通过 ☐ 退回 | _ | _ |\n| 研发架构师 | （待填写） | ☐ 通过 ☐ 修改后通过 ☐ 退回 | _ | _ |\n| QA 测试组长 | （待填写） | ☐ 通过 ☐ 修改后通过 ☐ 退回 | _ | _ |\n| 数字化项目总监 | （待填写） | ☐ 通过 ☐ 修改后通过 ☐ 退回 | _ | _ |\n\n### 1.3 修订演变历史\n\n| 版本 | 时间 | 修改人 | 审核人 | 修改章节与动因 |\n|:---:|:---|:---|:---|:---|\n| v0.1 | 2026-09-01 | PM 起草 | — | 初稿：业务背景、用户故事、功能列表 |\n| v0.5 | 2026-09-05 | Dev 接入 | PM | 补 7 章数据字典与公式；4 章数据流 |\n| v0.8 | 2026-09-07 | QA 接入 | PM | 补 10 章验收矩阵（错误码字典 8 条、Gherkin 6 条） |\n| v1.0 | 2026-09-08 | AI × PM 协同 | _ | 落 `tbea-prd-standards@1.1.0` 双 skill 全量激活版 |\n\n### 1.4 维护纪律自声明\n\n> 本文档自动维护 `D:\\Project\\TJ-nengtan\\PRD\\MODIFICATIONS_LOG.md` 第 6.5 节。**严禁自动推送生产机 (8.215.89.194)、严禁自动 `git commit` / `git push`**，等待用户明确指令！\n\n---\n\n## 二、 业务背景与北极星指标\n\n### 2.1 业务痛点 (Pain Points)\n\n| 痛点 | 量化描述 | 受损方 |\n|:---|:---|:---|\n| **痛点 A：LCA 全流程手工拼装效率极低** | 当前以 Excel + LCA 离线软件 + 因子库手工比对，单型号产品 LCA 报告平均 6.5 人日 | P4 LCA 工程师 |\n| **痛点 B：欧盟 CBAM 关税缺乏自动化测算** | 出口欧盟变压器/电缆每月需 1.5 人日手动核算碳关税，存在错报风险 | P5 国际贸易 |\n| **痛点 C：因子库版本管理失控** | Ecoinvent v3.8 / CLCD 0.2 / 国家发改委折标煤系数多版本并存，无统一对齐 | P4 + QA |\n| **痛点 D：跨部门数据孤岛** | ERP BOM、MES 产量、能源台账三套数据无法自动匹配，单型号 LCA 计算需手动拉数 12 个系统 | P4 + Dev |\n| **痛点 E：第三方认证周期长** | 平均认证周期 87 天，其中数据核验占 31 天 | P1 + P6 |\n| **痛点 F：客观性与版本溯源缺位** | LCA 计算过程与因子版本缺乏不可篡改存证，认证机构驳回率 6.4% | P6 + QA |\n\n### 2.2 北极星指标 (North Star Metrics)\n\n| 指标 ID | 名称 | 定义 | 目标值 | 数据敏感级 |\n|:---|:---|:---|:---:|:---:|\n| **NSM-CF-LCA-COVER** | 出口主力产品 LCA 报告覆盖率 | ∑(已认证 SKU) / ∑(出口主力 SKU) | ≥ 95% | INTERNAL |\n| **NSM-CF-LCA-PRECISION** | LCA 报告数据符合率 | 1 − 认证机构驳回 / 总发证 | ≥ 98% | INTERNAL |\n| **NSM-CF-LCA-CYCLE** | 单型号 LCA 报告产出周期 | 从 BOM 完备到 ISO 14067 内审通过 | ≤ 3 工作日 | INTERNAL |\n| **NSM-CF-CBAM-SAVE** | CBAM 关税扣减优化率 | 国内已付碳成本抵扣 / 应缴关税 | ≥ 35% | CONFIDENTIAL |\n| **NSM-CF-FACTOR-FRESH** | 因子库新鲜度 | 1 − ∑(过期因子计数) / ∑(总因子数) | ≥ 99% | INTERNAL |\n| **NSM-CF-AUDIT-PASS** | 外部审计一次性通过率 | 1 − 补正轮次 / 总申报 | ≥ 90% | CONFIDENTIAL |\n\n### 2.3 业务边界 (Scope Boundary)\n\n| **IN-SCOPE** ✅ | **OUT-OF-SCOPE** ❌ |\n|:---|:---|\n| 5 大阶段 LCA 滚算（原材料 / 上游运输 / 制造加工 / 厂内检测 / 包装出厂） | Scope 3 价值链下游排放（运输后客户使用、报废处置） |\n| ISO 14067、PAS 2050 双标合规 | 非出口产品的国内 EPR（生产者责任延伸）核算 |\n| CBAM 直接 + 间接排放测算 + 国内已付碳成本扣减 | 国内 CCER 绿证签发 |\n| 双语 LCA 报告（中、英）一键生成 | 法、德、俄等第三语种（v2.0 再开放） |\n| 数字碳标签二维码 + 防伪追溯链 | 区块链联盟链接入（v2.0 评估） |\n\n---\n\n## 三、 目标用户画像与权限边界矩阵\n\n### 3.1 用户画像（重点 P4，关联 P1 / P5 / P6）\n\n| 编号 | 角色 | 代表岗位 | 在本模块的核心场景 | 权限边界 |\n|:---|:---|:---|:---|:---|\n| **P1** | 集团决策层 | 双碳总监 | 查看集团 LCA 大盘：碳足迹认证覆盖率、CBAM 关税扣减优化率 | 全集团只读 + 报告导出 |\n| **P4** | **碳核算与认证工程师**（主用户） | 集团碳资产部 LCA 专员、研发 LCA 工程师 | **全部交互**：维护 BOM 与工序边界、维护 LCA 草稿、内审、签批 | **核心角色**：含全部 CRUD + 内审签批 |\n| **P5** | 国际贸易与关税专家 | 国际部合规经理、海关报关员 | 接收 LCA 报告 → 触发 CBAM 申报 | **只读** LCA 报告 + **触发申报** |\n| **P6** | 外部审计机构 | 莱茵 / SGS / 方圆 第三方核查员 | 通过专有独立只读审计通道核验 LCA 凭证 | **审计只读** 通道 + 防伪查验 |\n\n### 3.2 六级组织树穿透鉴权\n\n```\n集团 TBEA 总部\n└── 产业集团（电工装备/新能源/智慧能源…）\n    └── 二级公司（沈变/衡变/新变/鲁缆/天池能源…）\n        └── 生产园区（沈变沈北产业园、衡变衡阳基地…）\n            └── 制造车间（线圈车间/绝缘车间/总装车间/检测车间）\n                └── 用能设备（绕线机/真空干燥罐/冲击电压发生器）\n```\n\n> **强制**：P4 工程师只能看所辖组织树节点的 LCA 数据；集团层 P1 可穿透全集团。\n\n### 3.3 权限边界矩阵 (RBAC)\n\n| 模块操作 | P1 决策 | P4 LCA | P5 报关 | P6 外部审计 |\n|:---|:---:|:---:|:---:|:---:|\n| 因子库浏览 | ✅ R | ✅ R | ✅ R | ✅ R |\n| 因子库 CRUD | ❌ | ✅ R/W | ❌ | ❌ |\n| BOM 与工序维护 | ❌ | ✅ R/W | ❌ | ❌ |\n| LCA 草稿创建 | ❌ | ✅ R/W | ❌ | ❌ |\n| LCA 草稿送审 | ❌ | ✅ R | ❌ | ❌ |\n| 第三方认证机构受理 | ❌ | ✅ R | ❌ | ✅ R/W（专用通道） |\n| 内审签批（PM 联合） | ☐ | **A** | ☐ | ☐ |\n| 报告对外发布 | ☐ | ✅ R/W | ☐ | ☐ |\n| CBAM 申报触发 | ❌ | ❌ | ✅ R | ❌ |\n| 审计防伪查验 | ❌ | ❌ | ❌ | ✅ R |\n\n---\n\n## 四、 总体架构与端到端数据流\n\n### 4.1 模块在双中心中的定位\n\n```\n产品碳足迹集采中心 (carbon-footprint)\n└── 【中心二 - 平台二】\n    ├── 一级导航 3: 实景数据库 (/carbon-footprint/database)\n    │   ├── 二级导航: 实景数据库 (/carbon-footprint/database/realscene)        ← NAV-CF-DB-REAL\n    │   ├── 二级导航: 碳足迹核算 (/carbon-footprint/database/accounting)     ← NAV-CF-DB-LCA  ★ 本模块\n    │   └── 二级导航: 碳足迹报告 (/carbon-footprint/database/report)          ← NAV-CF-DB-RPT\n    │\n    ├── LCA 引擎域内交互：\n    │   ├── BOM 拉取：/carbon-footprint/... → ERP 接口 → 拉取 BOM 树\n    │   ├── 工序边界维护：与 MES 接口同步\n    │   ├── 因子库：拉取 /carbon-footprint/factor/{material,power,energy,coal}\n    │   └── 报告输出：触发 /carbon-footprint/database/report 生成\n    │\n    └── 跨中心触发：\n        ├── CBAM 触发 → /carbon-footprint/cbam/declaration\n        └── 认证结果同步 → /carbon-footprint/certification/result\n```\n\n### 4.2 端到端数据流图\n\n```mermaid\ngraph LR\n    ERP_BOM[ERP<br/>BOM 物料清单] -- OpenAPI --> API_GW[API Gateway<br/>统一身份鉴权]\n    MES[ MES<br/>工序产量与工时 ] -- OpenAPI --> API_GW\n    IOT[IoT/SCADA<br/>能耗秒级遥测] -- MQTT --> IOT_Broker[MQTT Broker]\n    SC_FACTOR[国家发改委<br/>折标煤系数] -- ETL --> FactorDB[(Factor DB)]\n    Ecoinvent[Ecoinvent<br/>v3.8 跨境因子库] -- License API --> FactorDB\n    CLCD[CLCD 0.2<br/>中国本土因子] -- License API --> FactorDB\n\n    API_GW --> LCA_Engine[LCA 引擎<br/>NAV-CF-DB-LCA]\n    IOT_Broker --> Energy_ETL[能耗 ETL<br/>折标 + 工时对齐]\n    Energy_ETL --> LCA_Engine\n    FactorDB --> LCA_Engine\n\n    LCA_Engine --> AuditLog[(审计存证<br/>不可篡改 hash 链)]\n    LCA_Engine --> LCA_Report[LCA 报告<br/>中英双语 PDF/Word]\n    LCA_Report --> CBAM_Trigger[CBAM 申报触发]\n    CBAM_Trigger --> DeclReport[CBAM 申报底表]\n    DeclReport --> AuditOrg[莱茵 / SGS<br/>第三方审计通道]\n\n    style LCA_Engine fill:#1E3A8A,color:#fff\n```\n\n### 4.3 关键架构决策 (ADR 摘要)\n\n| ADR | 决策 | 理由 |\n|:---|:---|:---|\n| ADR-CF-001 | 时序数据走 TimescaleDB，关系数据走 PostgreSQL，物理隔离 | IoT 秒级高频遥测与台账数据异构 |\n| ADR-CF-002 | 因子库版本化管理，每条因子记录 `effective_from / effective_to / version_id` | 跨年因子版本对齐与可追溯 |\n| ADR-CF-003 | LCA 计算过程哈希链存证（前一 hash 写入后一 hash 头部） | 第三方审计不可篡改要求 |\n| ADR-CF-004 | 双端 100% 同构 (3000 dark / 3001 light) | `tbea-industrial-design` 铁律 6 |\n| ADR-CF-005 | 强制水印 + 操作员工号 + 时间戳嵌入导出 PDF | 铁律 + ISO 14067 第三方审计要求 |\n\n---\n\n## 五、 工业设计合规声明（拉取 `tbea-industrial-design` 铁律）\n\n> 本模块为前端组件及交互的**强制约束清单**。详细 token 见 `tbea-industrial-design` skill 第二节；本节仅声明\"已强制合规\"与违规后的回退策略。\n\n| 铁律 | 本模块合规声明 | 违规后回退 |\n|:---|:---|:---|\n| 1 · 44px 工业高密表格 | BOM 列表、工序列表、因子列表、错误码表、计算结果表，全部 `<tr class=\"h-[44px]\">` | CI lint 报警 → 自动 PR 阻断 |\n| 2 · 客观中立 | 全文案严禁\"显著降低/大幅优化\"等定性词；全部以同环比、基准偏差客观数据呈现 | 文案扫描脚本命中违禁词 → 红色告警 |\n| 3 · 状态自解释 | LCA 状态机激活态由 `border-primary ring-2 ring-primary/50` 自带视觉；严禁\"送审中\"等文字标签 | UI 审查 → 强制整改 |\n| 4 · 单行判空 | 工序、因子、BOM 缺失统一 `暂无相关工序！` / `暂无相关因子！` / `暂无相关物料！` | 文案一致性扫描 |\n| 5 · 微透光标 | ECharts 游标统一暗模式 `rgba(56,189,248,0.08)`、亮模式 `rgba(0,0,0,0.04)` | Token 守卫 |\n| 6 · 双端 100% 同构 | 暗黑 (3000) + 浅色 (3001) 同一路由同一功能同一数据 | CI 双端口冒烟测试 → 不通过阻塞发布 |\n\n### 5.1 反例与正例对照（仅节选，更多见 `tbea-industrial-design` 第三章）\n\n| ❌ 反例 | ✅ 正例 |\n|:---|:---|\n| \"沈变 LCA 报告质量优异\" | \"沈变 24Q3 LCA 报告认证机构一次通过率 92.4%，集团均值 88.7%，超出 3.7%\" |\n| `<Spin />` + `<span>LCA 计算中</span>` | 1px 顶部进度条 0.4s ease-out 完成，无文字 |\n| \"未找到与该型号相关的工序信息，请联系 LCA 工程师或检查 BOM 配置…\" | `暂无相关工序！` |\n| `rgba(255,255,255,1)` 图表游标 | `rgba(56, 189, 248, 0.08)` 微透蓝 |\n\n---\n\n## 六、 详细功能规格（按 NAV-CF-DB-LCA 逐层拆解）\n\n### 6.1 定位与路由\n\n| 项 | 值 |\n|:---|:---|\n| NAV-ID | `NAV-CF-DB-LCA` |\n| 路由 | `/carbon-footprint/database/accounting` |\n| 双端口 | 暗黑 (3000) + 浅色 (3001) 100% 同构 |\n| 入口图标 | `Leaf` (lucide-react) + `Calculator` 双图标 |\n| 父级导航 | 实景数据库 (NAV-CF-DB) → 碳足迹核算 (本节点) |\n\n### 6.2 业务场景与用户故事 (INVEST Stories)\n\n#### Story-1: P4 工程师新建 LCA 草稿\n\n> **As a** P4 碳核算与认证工程师  \n> **I want to** 基于 ERP 拉取的 BOM 与工序边界，在系统中新建一份 LCA 草稿并自动滚算 5 大阶段碳排放  \n> **So that** 我能在 3 工作日内完成传统以人工 Excel 需 6.5 人日的 LCA 全流程\n\n**INVEST 校验**：\n| 项 | 自评 |\n|:---|:---:|\n| Independent | ✅ 与 CBAM 申报模块独立 |\n| Negotiable | ✅ 因子版本、BOM 颗粒度可协商 |\n| Valuable | ✅ 直接对应 NSM-CF-LCA-CYCLE（≤ 3 工作日） |\n| Estimable | ✅ 工时 3PD，与 P4 历史速率匹配 |\n| Small | ✅ 用户故事粒度 5 个 dev day |\n| Testable | ✅ 见 6.6 节 Gherkin |\n\n#### Story-2: P4 工程师提交 LCA 内审\n\n> **As a** P4 工程师  \n> **I want to** 在 LCA 草稿完成自动滚算后一键提交 PM 内审，并附上数据源、因子版本、操作审计 list  \n> **So that** 内审可直接对照，缩短 PM 复核时间\n\n#### Story-3: P5 国际贸易触发 CBAM 申报\n\n> **As a** P5 国际贸易与关税专家  \n> **I want to** 在 ISO 14067 报告签发后一键触发 CBAM 申报，系统自动拉取直接 + 间接排放数据并计算国内已付碳成本扣减  \n> **So that** 我能在 ≤ 30 分钟内完成传统需 1.5 人日的 CBAM 关税测算与底表生成\n\n### 6.3 功能规格：LCA 核算引擎五大子模块\n\n#### 子模块 A：产品 BOM 拉取与映射\n\n| 项 | 规格 |\n|:---|:---|\n| **触发** | P4 选择\"新建 LCA\" → 选择产品 SKU → 系统自动调用 ERP OpenAPI `/mes/v1/boms/{sku}/tree` |\n| **核心字段** | `bom_id`、`sku`、`parent_part_no`、`child_part_no`、`quantity`、`unit`、`process_step` |\n| **错误处理** | ERP 接口超时（>5s）→ 自动 retry 3 次后触发 `E_EXT_ERP_BOM_TIMEOUT` |\n| **降级** | ERP 不可达 → 允许 P4 手动上传 Excel BOM 模板（仅 INV-FALLBACK 模式） |\n| **权限** | 仅 P4 写、所有只读角色可读 |\n\n#### 子模块 B：工序边界维护\n\n| 项 | 规格 |\n|:---|:---|\n| **触发** | BOM 拉取完成后，系统自动展示工序编排界面 |\n| **颗粒度** | 上游运输 / 制造加工 / 厂内检测 / 包装出厂 4 个 stage；原材料 stage 由 BOM 直接展开 |\n| **校验** | 每道工序必须有 (设备编号, 工时, 介质, 数量) 四元组；缺一阻断保存（`E_VAL_LCA_STAGE_INCOMPLETE`） |\n| **白名单** | 工序字典依据权威工序对应表，10 家无工序单位强制单行判空 `暂无相关工序！` |\n\n#### 子模块 C：因子库自动匹配\n\n| 项 | 规格 |\n|:---|:---|\n| **匹配优先级** | ① Ecoinvent v3.8（精确物料）→ ② CLCD 0.2（本土近似）→ ③ 国家发改委折标（兜底） |\n| **每条因子记录字段** | `factor_id`、`name_zh`、`name_en`、`category`、`unit`、`value`、`version_id`、`effective_from`、`effective_to`、`data_class` |\n| **过期判定** | `effective_to < today` 或 `version_id < 最新发布版本` → 标\"过期\"红色，不允许自动选用 |\n| **数据分级** | 原辅料因子 = INTERNAL；电力因子 = INTERNAL；Ecoinvent 跨境因子 = SENSITIVE（含供应商来源） |\n\n#### 子模块 D：5 大阶段 LCA 自动滚算\n\n| 阶段 | 计算公式 | 数据源 |\n|:---|:---|:---|\n| **原材料** | $C_{\\text{mat}} = \\sum_{i} M_i \\cdot EF_i$ | BOM + 因子库 |\n| **上游运输** | $C_{\\text{trans}} = \\sum_{i,j} M_i \\cdot d_{i,j} \\cdot EF_{\\text{trans},j}$ | ERP + 物流 |\n| **制造加工** | $C_{\\text{manu}} = \\sum_k E_k \\cdot EF_{\\text{energy},k}$ | IoT 能源 + 因子库 |\n| **厂内检测** | $C_{\\text{test}} = \\sum_m T_m \\cdot P_m \\cdot EF_{\\text{grid}}$ | MES 工时 + 电网因子 |\n| **包装出厂** | $C_{\\text{pkg}} = \\sum_n W_n \\cdot EF_{\\text{pkg},n}$ | BOM + 包装因子 |\n| **总碳足迹** | $C_{\\text{total}} = \\sum_{\\text{stage}} C_{\\text{stage}}$ | — |\n\n> **校验**：$C_{\\text{total}} \\geq 0$；分母工时 $T_m > 0$（除零拦截 `E_CALC_LCA_TDIV_ZERO`）。\n\n#### 子模块 E：内审与送审\n\n| 状态机 | 见 11.1 节 [草稿 → 送审 → 认证中 → 已认证 → 已发布 → 已归档] |\n|:---|:---|\n| **RACI 触发** | 送审 = P4 自身；内审签发 = PM + P4 联合（见 RACI 表 10.2） |\n| **审计留痕** | 送审动作自动写入审计日志（6.3 节） |\n| **回退路径** | 认证机构退回 → 自动转为草稿（可改） |\n\n### 6.4 数据字典核心字段\n\n| 字段 ID | 中文名 | 类型 | 量纲 | 必填 | 精度 | 数据分级 | 来源 | 校验 |\n|:---|:---|:---:|:---|:---:|:---:|:---:|---|:---|\n| `LCA_REPORT_ID` | LCA 报告编号 | string | — | ✅ | — | INTERNAL | 系统生成 | UUIDv7 |\n| `LCA_SKU` | 产品 SKU | string | — | ✅ | — | INTERNAL | ERP | 6–32 位 |\n| `LCA_TOTAL_KGCO2E` | 单位碳足迹 | decimal | kg CO₂e / 件 | ✅ | 4 | CONFIDENTIAL | 计算 | ≥0，≤ 1e5 |\n| `LCA_STAGE_MAT_KGCO2E` | 原材料阶段 | decimal | kg CO₂e / 件 | ✅ | 4 | CONFIDENTIAL | 计算 | — |\n| `LCA_STAGE_TRANS_KGCO2E` | 上游运输阶段 | decimal | kg CO₂e / 件 | ✅ | 4 | CONFIDENTIAL | 计算 | — |\n| `LCA_STAGE_MANU_KGCO2E` | 制造加工阶段 | decimal | kg CO₂e / 件 | ✅ | 4 | CONFIDENTIAL | 计算 | — |\n| `LCA_STAGE_TEST_KGCO2E` | 厂内检测阶段 | decimal | kg CO₂e / 件 | ✅ | 4 | CONFIDENTIAL | 计算 | — |\n| `LCA_STAGE_PKG_KGCO2E` | 包装出厂阶段 | decimal | kg CO₂e / 件 | ✅ | 4 | CONFIDENTIAL | 计算 | — |\n| `LCA_FACTOR_VERSION` | 因子库版本号 | string | — | ✅ | — | INTERNAL | 系统 | SemVer |\n| `LCA_AUDIT_HASH` | 审计哈希链 | string | hex | ✅ | — | CONFIDENTIAL | 计算 | SHA-256, 长度 64 |\n| `LCA_CBAM_DIR_KGCO2E` | CBAM 直接排放 | decimal | kg CO₂e / 件 | ✅ | 4 | CONFIDENTIAL | 计算 | ≥0 |\n| `LCA_CBAM_INDIR_KGCO2E` | CBAM 间接排放 | decimal | kg CO₂e / 件 | ✅ | 4 | CONFIDENTIAL | 计算 | ≥0 |\n| `LCA_CBAM_DOMESTIC_OFFSET` | 国内已付碳成本抵扣 | decimal | CNY / 件 | ☐ | 2 | CONFIDENTIAL | 计算 + 绿证 | ≥0 |\n\n### 6.5 业务校验规则矩阵\n\n| 规则 ID | 描述 | 触发条件 | 错误码 |\n|:---|:---|:---|:---|\n| BR-LCA-001 | $C_{\\text{total}} = \\sum_{\\text{stage}} C_{\\text{stage}}$，容差 ≤ 0.01 kg CO₂e | 任意时刻后台自检 | `E_CALC_LCA_SUM_MISMATCH` |\n| BR-LCA-002 | $C_{\\text{total}} \\geq 0$ | 保存 | `E_VAL_LCA_TOTAL_NEGATIVE` |\n| BR-LCA-003 | 工时 $T_m > 0$ | 制造加工阶段 | `E_CALC_LCA_TDIV_ZERO` |\n| BR-LCA-004 | 因子版本有效期必须 today ∈ [effective_from, effective_to] | 因子选用 | `E_VAL_FACTOR_EXPIRED` |\n| BR-LCA-005 | 白名单单位必读\"暂无相关工序！\" | 工序列表查询 | `E_QM_WHITE_LIST_MISS`（友好输出） |\n| BR-LCA-006 | 哈希链尾节点必须 prev = 前一节点 | 审计存证 | `E_AUDIT_HASH_BROKEN` |\n\n---\n\n## 七、 数据字典与核心数学模型\n\n### 7.1 完整字段 Schema 示例\n\n见附录 B.2：LCA 报告输出断言示例。\n\n### 7.2 核心数学公式汇总\n\n```math\nC_{\\text{total}} = C_{\\text{mat}} + C_{\\text{trans}} + C_{\\text{manu}} + C_{\\text{test}} + C_{\\text{pkg}}\n\nC_{\\text{mat}} = \\sum_{i=1}^{n_{\\text{mat}}} M_i \\cdot EF_i\n\\quad\\quad\nC_{\\text{trans}} = \\sum_{i,j} M_i \\cdot d_{i,j} \\cdot EF_{\\text{trans},j}\n\nC_{\\text{manu}} = \\sum_{k} E_k \\cdot EF_{\\text{energy},k}\n\\quad\\quad\nC_{\\text{test}} = \\sum_{m} T_m \\cdot P_m \\cdot EF_{\\text{grid}}\n\nC_{\\text{pkg}} = \\sum_n W_n \\cdot EF_{\\text{pkg},n}\n\nC_{\\text{CBAM}} = C_{\\text{direct}} + (1 - \\alpha) \\cdot C_{\\text{indirect}}\n\\quad\\quad\n\\alpha = \\text{CBAM 国内碳成本抵扣率}\n\n\\text{CBAM Tariff} = C_{\\text{CBAM,declared}} \\cdot \\text{ETS Price}_{\\text{quarter}} - \\text{Domestic Cost Offset}\n```\n\n### 7.3 数学与算法参考标准\n\n| 编号 | 标准 | 应用 |\n|:---|:---|:---|\n| REF-CF-001 | ISO 14067:2018 | 总碳足迹量化方法 |\n| REF-CF-002 | PAS 2050:2011 | 商品和服务 GHG 评价备选 |\n| REF-CF-003 | GHG Protocol Corporate Standard | Scope 1/2/3 边界 |\n| REF-CF-004 | EU CBAM Regulation 2023/956 | 直接/间接排放计算 |\n| REF-CF-005 | EU ETS Directive 2003/87 | 配额价格扣减 |\n| REF-CF-006 | GB/T 32150-2015 | 工业企业 GHG 核算通则 |\n| REF-CF-007 | 国家发改委公开数据 | 区域电网平均排放因子 |\n\n---\n\n## 八、 非功能性需求 (NFR)\n\n### 8.1 性能指标 (Core Web Vitals)\n\n| 指标 | 阈值 | 测量位置 |\n|:---|:---:|:---|\n| **LCP** (Largest Contentful Paint) | < 1.8s | 路由进入 |\n| **INP** (Interaction to Next Paint) | < 100ms | LCA 切换、因子点击 |\n| **CLS** (Cumulative Layout Shift) | < 0.05 | BOM 表加载 |\n| **LCA 单 SKU 计算** | < 5s | 5 阶段滚算 |\n| **中英双语报告生成** | < 15s | PDF 导出 |\n| **CBAM 实时测算** | < 3s | ETS 价格刷新 |\n\n### 8.2 可靠性与可观测性\n\n| 项 | 阈值 |\n|:---|:---:|\n| 模块可用性 SLO | 99.9% (年宕机 ≤ 8.76h) |\n| P99 计算响应 | < 5s |\n| ERP 接口失败熔断 | 5 次/分钟 |\n| 因子库命中率 | ≥ 95% |\n| 审计日志零丢失 | 100% |\n\n### 8.3 可观测性埋点 (OpenTelemetry)\n\n| Span 名 | 关键字段 |\n|:---|:---|\n| `lca.compute.total` | `sku, stage_count, factor_version, duration_ms` |\n| `lca.compute.stage.{mat,trans,manu,test,pkg}` | `factor_id, value, duration_ms` |\n| `lca.audit.hash` | `report_id, prev_hash, this_hash` |\n| `lca.cbam.compute` | `ets_price_timestamp, declared_kg, tariff_cny` |\n\n### 8.4 合规与防伪\n\n- 导出 PDF 强制 **操作员工号 + 时间戳（精确 ms）+ 文档编号** 防伪水印；\n- LCA 报告对外发布自动写入**哈希链存证**；\n- 操作日志保留 5 年，LCA 计算记录保留 ≥ 10 年（CBAM 海关要求）。\n\n---\n\n## 九、 外部系统接口契约 (API & IoT)\n\n### 9.1 OpenAPI 3.0 契约（节选）\n\n```yaml\nopenapi: 3.0.3\ninfo:\n  title: TBEA Carbon Footprint API\n  version: 1.0.0\npaths:\n  /cf/v1/lca/reports:\n    post:\n      operationId: createLcaReport\n      summary: 新建 LCA 报告草稿\n      requestBody:\n        required: true\n        content:\n          application/json:\n            schema:\n              $ref: '#/components/schemas/LcaReportCreate'\n      responses:\n        '201':\n          description: LCA 草稿已创建\n          content:\n            application/json:\n              schema:\n                $ref: '#/components/schemas/LcaReport'\n        '400':\n          description: 字段错误\n          content:\n            application/json:\n              schema:\n                $ref: '#/components/schemas/ErrorResponse'\n        '422':\n          description: 业务校验失败（如 BR-LCA-002 负数、BR-LCA-003 除零）\n        '504':\n          description: ERP / 因子库超时\n    get:\n      operationId: listLcaReports\n      parameters:\n        - name: sku\n          in: query\n          schema: { type: string }\n        - name: status\n          in: query\n          schema:\n            type: string\n            enum: [DRAFT, SUBMITTED, CERTIFYING, CERTIFIED, PUBLISHED, ARCHIVED]\n      responses:\n        '200':\n          description: 报告列表\ncomponents:\n  schemas:\n    ErrorResponse:\n      type: object\n      required: [error_code, http_status, severity, message]\n      properties:\n        error_code: { type: string, example: 'E_VAL_LCA_TOTAL_NEGATIVE' }\n        http_status: { type: integer, example: 400 }\n        severity: { type: string, enum: [P0, P1, P2, P3] }\n        message: { type: string }\n```\n\n### 9.2 ERP / MES / IoT 集成接口\n\n| 系统 | 协议 | 端点 | 字段样例 | 错误码 |\n|:---|:---:|:---|:---|:---|\n| ERP（SAP / Oracle） | OpenAPI 3.0 | `/mes/v1/boms/{sku}/tree` | bom_id, parent_part_no, child_part_no, quantity | E_EXT_ERP_BOM_TIMEOUT |\n| MES（自研） | OpenAPI 3.0 | `/mes/v1/processes/{bom_id}` | process_step, equipment_id, hours, medium | E_EXT_MES_PROC_NOTFOUND |\n| IoT（MQTT） | MQTT 5.0 | `tbea/factory/{park}/{workshop}/{equipment}/energy` | ts, kw, medium, signal_q | E_IO_MQTT_TIMEOUT |\n| 折标煤库 | REST | `/factor/v1/coal-effective` | medium, value_kgce_per_unit, effective_to | E_VAL_FACTOR_EXPIRED |\n| Ecoinvent | License API | `/lic/v3/factors/search` | name, geography, value | E_EXT_ECOINVENT_LICENSE |\n| 国家电网 | REST | `/factor/v1/grid-region` | region, value_kgco2e_per_kwh | E_VAL_FACTOR_EXPIRED |\n\n---\n\n## 十、 QA 矩阵与全量验收\n\n### 10.1 Gherkin 验收用例（Gherkin × 6，Gherkin/INVEST + EQP/BVA 全覆盖）\n\n#### Feature: LCA 草稿创建\n\n```gherkin\nFeature: LCA 报告草稿的自动滚算与提交流程\n\n  Scenario: P4 工程师基于 ERP BOM 创建 LCA 草稿\n    Given P4 在 \"/carbon-footprint/database/accounting\" 选择目标 SKU \"TX-110kV-50MVA\"\n    And ERP BOM 接口正常返回 BOM 树\n    And 因子库版本 v2026.09 处于有效期内\n    When P4 点击\"新建 LCA 草稿\"\n    Then 系统应在 5 秒内自动滚算 5 大阶段碳足迹\n    And LCA_TOTAL_KGCO2E ≥ 0\n    And 各阶段字段均符合 §7.2 公式\n    And 自动写入审计日志 hash\n\n  Scenario: ERP 接口超时降级\n    Given P4 在新建 LCA 草稿时 ERP 接口响应超时\n    When 等待 5 秒后仍未响应\n    Then 系统触发 E_EXT_ERP_BOM_TIMEOUT 错误\n    And 提示 P4 切换为 INV-FALLBACK 手动上传 BOM\n\n  Scenario: 因子库版本过期\n    Given P4 选用某因子 factor_id=\"F-ELEC-001\" version=\"v2025.06\"\n    And current date > effective_to of v2025.06\n    When P4 提交保存\n    Then 系统应拒绝该因子选用\n    And 触发 E_VAL_FACTOR_EXPIRED\n\n  Scenario: 5 阶段总和校验 (BR-LCA-001)\n    Given LCA 草稿已生成 5 阶段值\n    When 任意时刻后台自检\n    Then | C_total - Σ C_stage | ≤ 0.01\n    And 否则触发 E_CALC_LCA_SUM_MISMATCH\n\n  Scenario: 单位 LCA 报告周期目标 (北极星)\n    Given P4 创建一份变压器 LCA 报告\n    When 报告进入 LCA_CERTIFIED 状态\n    And 跨度 ≤ 3 工作日\n    Then NSM-CF-LCA-CYCLE 完成指标达成\n\n  Scenario: 客观中立文案审查\n    Given LCA 报告对外发布\n    When 触发违禁词扫描\n    Then 命中 \"表现优异\" 或 \"严重落后\" 时自动告警并强制 PM 复核\n```\n\n### 10.2 错误码字典（节选，全部 8 条见附录 C）\n\n| 错误码 | HTTP | 级别 | 触发 | 处理 |\n|:---|:---:|:---:|:---|:---|\n| `E_VAL_LCA_TOTAL_NEGATIVE` | 400 | P2 | C_total < 0 | 字段红字 + 禁止保存 |\n| `E_VAL_LCA_STAGE_INCOMPLETE` | 422 | P2 | 工序 (设备/工时/介质/数量) 缺一 | 字段红字提示 |\n| `E_VAL_FACTOR_EXPIRED` | 422 | P2 | 因子 effective_to 已过 | 红标 + 拦截选用 |\n| `E_CALC_LCA_TDIV_ZERO` | 422 | P2 | 工时 T_m = 0 | 强制补录工时 |\n| `E_CALC_LCA_SUM_MISMATCH` | 500 | P1 | BR-LCA-001 不达标 | 告警 + 阻断发布 |\n| `E_EXT_ERP_BOM_TIMEOUT` | 504 | P1 | ERP 5s 超时 | 重试 3 次 → 切 INV-FALLBACK |\n| `E_EXT_ECOINVENT_LICENSE` | 503 | P1 | Ecoinvent License 过期 | 切 CLCD 兜底因子 |\n| `E_QM_WHITE_LIST_MISS` | 200 | P3 | 权威工序未命中 | 单行 `暂无相关工序！` |\n\n### 10.3 破坏性测试矩阵（Chaos / EQP / BVA）\n\n| 类型 | 用例 ID | 触发 | 期望 |\n|:---|:---|:---|:---|\n| EQP | TC-EQP-001 | $C_{\\text{total}}$ 极大值 (1e10) | 前端数值归一化展示，后端报错 |\n| EQP | TC-EQP-002 | $C_{\\text{total}}$ 极小值 (1e-9) | 精度保留 4 位，零值显示 `—` |\n| BVA | TC-BVA-001 | $T_m = 0$ | 触发 E_CALC_LCA_TDIV_ZERO 拦截 |\n| BVA | TC-BVA-002 | $T_m = -1$ | 触发 E_VAL_LCA_TOTAL_NEGATIVE |\n| BVA | TC-BVA-003 | 工时 = `2147483647` (Int32 max) | 后端溢出检查 |\n| 100ms 并发 | TC-CONC-001 | 同时双击\"送审\"按钮 100ms 内 | 后端幂等校验，仅一份有效 |\n| 网络抖动 | TC-NET-001 | 断网恢复 | 草稿本地暂存，恢复后自动同步 |\n| Chaos | TC-CHAOS-001 | Redis 宕机 | Postgres fallback 模式 |\n| Chaos | TC-CHAOS-002 | TimescaleDB 慢查询 | SLO 报警 |\n\n### 10.4 客观中立纯洁度扫描\n\n> **强制**：每次发布前必须 0 命中违禁词清单：`表现优异`/`严重落后`/`运行欠佳`/`大幅领先`/`排名靠后`/`形势喜人`/`不容乐观`。CI 阻断。\n\n---\n\n## 十一、 业务状态机细化（拉取 skill 第七章 7.1）\n\n```\n[DRAFT 草稿]\n  --P4 提交内审--> [SUBMITTED 送审]\n  --P4 废弃--> [ABANDONED 废弃]\n\n[SUBMITTED 送审]\n  --PM 退回修改--> [DRAFT 草稿]\n  --机构受理--> [CERTIFYING 认证中]\n\n[CERTIFYING 认证中]\n  --签发证书--> [CERTIFIED 已认证]\n  --退回修改--> [DRAFT 草稿]\n\n[CERTIFIED 已认证]\n  --P4+PM 联合发布--> [PUBLISHED 已发布]\n  --归档--> [ARCHIVED 已归档]\n```\n\n| 当前状态 | 可触发动作 | 触发角色 | 审计写入 |\n|:---|:---|:---:|:---:|\n| DRAFT 草稿 | 提交内审 / 废弃 | P4 | ✅ |\n| SUBMITTED 送审 | 撤回（限内审驳回） / 受理 | P4 + 机构 | ✅ |\n| CERTIFYING 认证中 | 不可编辑，仅审批 | — | ✅ |\n| CERTIFIED 已认证 | 一键发布 / 归档 | P4 + PM 联合 | ✅ |\n| PUBLISHED 已发布 | 归档 | PM | ✅ |\n| ARCHIVED 已归档 | 不可变 | — | — |\n\n### 11.2 与 CBAM 联动状态机\n\n```\nLCA_CERTIFIED --P5 触发申报--> CBAM_DECL_PENDING\nCBAM_DECL_PENDING --P5+P1 双签--> CBAM_DECL_SUBMITTED\nCBAM_DECL_SUBMITTED --海关反馈--> CBAM_DECL_FEEDBACK\nCBAM_DECL_FEEDBACK --补正--> CBAM_DECL_SUBMITTED\nCBAM_DECL_SUBMITTED --年度归档--> CBAM_DECL_ARCHIVED\n```\n\n---\n\n## 十二、 AI Agent 输出 Schema 实例（拉取 skill 第十二章）\n\n### 12.1 LCA 报告顶层 JSON Schema\n\n```json\n{\n  \"report_id\": \"LCA-2026-09-TX110-50MVA-0001\",\n  \"nav_id\": \"NAV-CF-DB-LCA\",\n  \"sku\": \"TX-110kV-50MVA\",\n  \"status\": \"DRAFT\",\n  \"factor_version\": \"v2026.09\",\n  \"stages\": {\n    \"raw_material\": 245.3,\n    \"transport\": 18.7,\n    \"manufacturing\": 89.4,\n    \"inhouse_test\": 12.6,\n    \"packaging\": 4.8\n  },\n  \"total_kg_co2e\": 370.8,\n  \"cbam\": {\n    \"direct\": 280.6,\n    \"indirect\": 90.2,\n    \"domestic_offset_cny\": 142.5,\n    \"tariff_cny\": 187.3\n  },\n  \"audit_hash\": \"a1b2c3...\",\n  \"owner_persona\": \"P4\",\n  \"data_class\": \"CONFIDENTIAL\",\n  \"schema_version\": \"1.0.0\"\n}\n```\n\n### 12.2 反模式清单（本模块特别针对）\n\n| ❌ 反模式 | ✅ 正例 |\n|:---|:---|\n| \"LCA 报告质量显著提升\" | \"24Q3 报告认证一次通过率 92.4%，较 24Q2 88.7% 提升 3.7pp\" |\n| `<Spin/>加载中` | 顶部 1px 进度条 0.4s ease-out |\n| \"未找到相关工序，请联系…\" | `暂无相关工序！` |\n| `rgba(255,255,255,1)` 图表游标 | `rgba(56,189,248,0.08)` |\n\n---\n\n## 附录 A：法规映射（节选）\n\n| 法规 | 应用章节 | 本模块引用 |\n|:---|:---|:---|\n| ISO 14067:2018 | 全文 | 总碳足迹量化公式 |\n| PAS 2050:2011 | 7.3 | 备选算法 |\n| GHG Protocol Corporate | 4.2、6.3 | Scope 1/2/3 边界 |\n| EU CBAM Regulation 2023/956 | 6.3 子模块 D、9.1、11.2 | 直接/间接排放与申报触发 |\n| EU ETS Directive 2003/87 | 7.2 | 配额价格扣减 |\n| GB/T 32150-2015 | 7.3 | 工业企业 GHG 核算通则 |\n| GB/T 2589-2020 | 6.3 子模块 D | 折标煤系数兜底 |\n| GB 17167-2006 | 9.2 | 能源计量器具管理 |\n\n---\n\n## 附录 B：字段 Schema 实例\n\n### B.1 报告顶层 Schema\n\n见 §12.1。\n\n### B.2 字段断言示例\n\n```yaml\nfield_id: LCA_TOTAL_KGCO2E\nname_zh: 单位产品碳足迹\nname_en: Product Carbon Footprint per Unit\ntype: decimal\nunit: kg CO2e / 件\nrequired: true\nprecision: 4\ndata_class: CONFIDENTIAL\nsource: tbea_calc.lca_total\nnav_id: NAV-CF-DB-LCA\nbusiness_rule: \">=0 且 <= 1e5；前后台一致性 100%\"\n```\n\n### B.3 因子字段 Schema\n\n```yaml\nfield_id: FACTOR_VALUE_KGCO2E_PER_KG\nname_zh: 因子值\nname_en: Emission Factor Value\ntype: decimal\nunit: kg CO2e / kg (or /kWh, /km, /m3, depending on category)\nrequired: true\nprecision: 6\ndata_class: SENSITIVE\nsource: ecoinvent_v3.8 OR clcd_0.2\nnav_id: NAV-CF-DB-LCA\nbusiness_rule: \"version_id 与 effective_to 强校验；过期禁止选用\"\n```\n\n---\n\n## 附录 C：状态码断言实例\n\n```yaml\nstate_code: LCA_CERTIFIED\nstate_name_zh: 已认证\nallowed_transitions:\n  - LCA_PUBLISHED\n  - LCA_ARCHIVED\nrequired_role: P4_PLUS_PM\naudit_log: true\nnav_id: NAV-CF-DB-LCA\n```\n\n```yaml\nstate_code: LCA_DRAFT\nstate_name_zh: 草稿\nallowed_transitions:\n  - LCA_SUBMITTED\n  - LCA_ABANDONED\nrequired_role: P4\naudit_log: true\nnav_id: NAV-CF-DB-LCA\n```\n\n---\n\n## 附录 D：Mermaid 状态机图（可视化版）\n\n```mermaid\nstateDiagram-v2\n    [*] --> DRAFT: 新建草稿\n    DRAFT --> SUBMITTED: 提交内审\n    DRAFT --> ABANDONED: 废弃\n    SUBMITTED --> CERTIFYING: 机构受理\n    SUBMITTED --> DRAFT: 退回修改\n    CERTIFYING --> CERTIFIED: 签发证书\n    CERTIFYING --> DRAFT: 退回修改\n    CERTIFIED --> PUBLISHED: 联合发布\n    PUBLISHED --> ARCHIVED: 归档\n    ARCHIVED --> [*]\n```\n\n---\n\n## 附录 E：RACI 责任矩阵（重点）\n\n| 决策点 | P1 | P4 | P5 | PM | Dev | QA | 法务 |\n|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|\n| 北极星指标定义 | **A** | C | C | R | C | C | I |\n| LCA 报告送审 | I | R | — | **A** | C | C | I |\n| LCA 内审签批 | I | R | — | **A** | C | C | I |\n| LCA 报告对外发布 | I | R | C | **A** | C | C | C |\n| CBAM 正式申报 | I | C | R | C | C | C | **A** |\n| 因子库版本变更 | I | C | C | **A** | R | C | I |\n| 权威工序白名单扩展 | I | C | C | C | R | **A** | I |\n| 违规词告警处理 | I | I | I | **A** | R | C | I |\n\n---\n\n*TBEA 能碳双中心 LCA 核算 PRD · v1.0.0 · 2026-09-08 · 受控编号 TBEA-PRD-CF-LCA-2026-V1.0*\n"
  },
  {
    "id": "prd-08",
    "vol": "PRD-08",
    "filename": "PRD-08_CBAM欧盟碳关税与合规申报.md",
    "title": "CBAM欧盟碳关税与合规申报",
    "readTime": "2 分钟",
    "wordCount": 756,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "一、 CN 海关税号映射与前驱物核算",
        "id": "一-cn-海关税号映射与前驱物核算"
      },
      {
        "level": 2,
        "title": "二、 关税测算模型与央行汇率联动",
        "id": "二-关税测算模型与央行汇率联动"
      },
      {
        "level": 2,
        "title": "三、 CBAM XML 导出与数据出境安全合规",
        "id": "三-cbam-xml-导出与数据出境安全合规"
      }
    ],
    "content": "# 【PRD-08】CBAM 欧盟碳关税与合规申报规格说明书\n\n> **文档受控编号**：`TBEA-PRD-MASTER-2026-VOL-08`  \n> **标准 NAV-ID**：`NAV-CF-CBM-DEC`、`NAV-CF-CBM-SIM`、`NAV-CF-CBM-KB`  \n> **基线版本**：Release v1.2.0 (生产基线版)  \n\n---\n\n## 一、 CN 海关税号映射与前驱物核算\n\n系统内嵌欧盟 CBAM 法规（EU 2023/956）要求：\n- 覆盖税号：8504.21~8504.34（变压器）、8544.49~8544.60（高压线缆）及 72/73 钢铁零部件；\n- 穿透拆解：前驱物硅钢片、电解铜的直接排放 (Scope 1) 与外购电力间接排放 (Scope 2)。\n\n---\n\n## 二、 关税测算模型与央行汇率联动\n\n$$\\text{Tax}_{CBAM} = \\max\\left(0, (SEE_{total} - BM_{EU}) \\times Q_{export} - \\text{CarbonPricePaid}_{CN}\\right) \\times \\text{Price}_{ETS}$$\n\n- 欧盟 ETS 碳价周均结算价自动通过中国人民银行官方欧元中间价汇率折算为人民币。\n\n---\n\n## 三、 CBAM XML 导出与数据出境安全合规\n\n1. **XML 模板**：符合欧盟委员会 Communication Template v2.1 标准 XSD 结构；\n2. **数据出境合规**：经脱敏处理（剔除操作人员工号、电话），通过国家网信办认定的【标准合同 (SCC) 路径】合法出境，操作链保留 SHA-256 签名归档 10 年。\\n"
  },
  {
    "id": "prd-09",
    "vol": "PRD-09",
    "filename": "PRD-09_系统级公共模块与技术架构规格说明书.md",
    "title": "系统级公共模块与技术架构规格说明书",
    "readTime": "2 分钟",
    "wordCount": 905,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "一、 统一数据库架构与时序降采样",
        "id": "一-统一数据库架构与时序降采样"
      },
      {
        "level": 2,
        "title": "二、 信创国产化平替与国密算法 (SM2/SM3/SM4)",
        "id": "二-信创国产化平替与国密算法-sm2-sm3-sm4"
      },
      {
        "level": 2,
        "title": "三、 公共中枢模块规格",
        "id": "三-公共中枢模块规格"
      }
    ],
    "content": "# 【PRD-09】系统级公共模块与技术架构规格说明书\n\n> **文档受控编号**：`TBEA-PRD-MASTER-2026-VOL-09`  \n> **标准 NAV-ID**：`NAV-SYS-USER`、`NAV-SYS-ROLE`、`NAV-SYS-FLOW`、`NAV-SYS-ALM`、`NAV-SYS-AUDIT`  \n> **基线版本**：Release v1.2.0 (生产基线版)  \n\n---\n\n## 一、 统一数据库架构与时序降采样\n\n- **PostgreSQL 16**：主数据、BOM、权限、工作流；\n- **TimescaleDB**：工业高频时序遥测，时序分层降采样（原始秒级保留 7 天 ➔ 1 分钟保留 90 天 ➔ 1 小时保留 3 年 ➔ 日汇总永久留底）；\n- **Redis 7.2**：缓存与 100ms 提交防刷分布式锁（Redlock）。\n\n---\n\n## 二、 信创国产化平替与国密算法 (SM2/SM3/SM4)\n\n- **信创四层平替**：鲲鹏920/海光C86 CPU + 统信UOS/银河麒麟 Server + openGauss 5.0/人大金仓 KingbaseES + 东方通 TongWeb；\n- **国密算法体系**：传输层支持 TLCP/TLS 1.3；数据落盘敏感字段 SM4 加密；电子签章 SM2 非对称算法；防篡改存证 SM3 杂凑摘要。\n\n---\n\n## 三、 公共中枢模块规格\n\n1. **RBAC 四维矩阵**：涵盖 P1~P6 角色，明确 P1 拥有全域只读大盘 + 终审签章特权；\n2. **工作流引擎**：支持多级会签、或签、超时 48h 自动催办；\n3. **统一告警中心**：监听电压偏差 ±7%、油温越限、防逆流异常，支持短信/企微/钉钉分级秒推；\n4. **附件管理 (MinIO)**：集中存储 PDF 证书、检测报告，强制哈希指纹校验；\n5. **审计日志**：操作全流程 SHA-256 链式 Hash 记录，防止单方篡改；\n6. **双因素认证 (2FA)**：高管终审与对外签发强制动态验证码。\\n"
  },
  {
    "id": "prd-10",
    "vol": "PRD-10",
    "filename": "PRD-10_质量保障体系与全场景破坏性测试矩阵.md",
    "title": "质量保障体系与全场景破坏性测试矩阵",
    "readTime": "2 分钟",
    "wordCount": 1166,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "一、 10 条混沌与破坏性测试用例 (Chaos / Destructive Matrix)",
        "id": "一-10-条混沌与破坏性测试用例-chaos-destructive-matrix"
      },
      {
        "level": 2,
        "title": "二、 四套环境模型与准出标准",
        "id": "二-四套环境模型与准出标准"
      }
    ],
    "content": "# 【PRD-10】质量保障体系与全场景破坏性测试矩阵\n\n> **文档受控编号**：`TBEA-PRD-MASTER-2026-VOL-10`  \n> **基线版本**：Release v1.2.0 (生产基线版)  \n\n---\n\n## 一、 10 条混沌与破坏性测试用例 (Chaos / Destructive Matrix)\n\n| 用例编号 | 测试类别 | 故障注入与极限输入 | 预期防御与恢复行为 | 判定标准 |\n|:---|:---|:---|:---|:---|\n| **TC-DS-01** | 极值注入 | 产量输入 1e10 超大值及 1e-9 极微量 | 算法平稳处理，数据库无溢出，UI等比呈现 | 通过清零 |\n| **TC-DS-02** | 除零防御 | 报工产量输入 0，计算单耗与产值比 | 拦截除零，单耗显示“--”，严禁白屏崩溃 | 通过清零 |\n| **TC-DS-03** | 双击防刷 | 100ms 内连续快速点击提交 3 次 | Redis 分布式锁拦截后两笔，仅首笔入库 | 通过清零 |\n| **TC-DS-04** | 负数拦截 | 录入用电量 -1000 kWh | 前端即时红框高亮阻断，禁止发送请求 | 通过清零 |\n| **TC-DS-05** | 采集断网 | 切断变电站边缘一体机网络 72 小时 | 本地 SQLite 暂存，网络恢复后断点续传 | 通过清零 |\n| **TC-DS-06** | 缓存宕机 | 模拟 Redis 节点突发崩溃 Crash | 自动降级直查 PostgreSQL 库，业务不中断 | 通过清零 |\n| **TC-DS-07** | 慢SQL治理 | 注入千万级跨年聚合时序慢查询 | 耗时 > 3s 自动告警并记录慢日志 | 通过清零 |\n| **TC-DS-08** | 双机容灾 | 主数据库宕机模拟故障转移 | 备库 $\\le 30$ 秒内接管，数据零丢失 (RPO=0) | 通过清零 |\n| **TC-DS-09** | 越权防御 | 伪造 Token 越权访问 CBAM 申报底表 | 网关拦截并记录 E_AUTH_RBAC_FORBIDDEN | 通过清零 |\n| **TC-DS-10** | 报文防篡改 | 篡改 CBAM XML 文件的哈希指纹 | 导出引擎阻断，提示签名无效 | 通过清零 |\n\n---\n\n## 二、 四套环境模型与准出标准\n\n- **环境模型**：DEV (开发联调) ➔ TEST (全量自动化与破坏性压测) ➔ STG (预发仿真与数据脱敏) ➔ PROD (生产环境)；\n- **发布红线**：P0 阻断级缺陷必须 100% 清零，P1 严重级缺陷清零率 $\\ge 98\\%$。\\n"
  },
  {
    "id": "prd-11",
    "vol": "PRD-11",
    "filename": "PRD-11_量化非功能需求与接口契约说明书.md",
    "title": "量化非功能需求与接口契约说明书",
    "readTime": "4 分钟",
    "wordCount": 1888,
    "summary": "---",
    "headings": [
      {
        "level": 2,
        "title": "一、 量化非功能性需求基准 (NFR Targets)",
        "id": "一-量化非功能性需求基准-nfr-targets"
      },
      {
        "level": 2,
        "title": "二、 核心 OpenAPI 3.0.3 接口契约规范",
        "id": "二-核心-openapi-3-0-3-接口契约规范"
      }
    ],
    "content": "# 【PRD-11】量化非功能需求与接口契约说明书\n\n> **文档受控编号**：`TBEA-PRD-MASTER-2026-VOL-11`  \n> **基线版本**：Release v1.2.0 (生产基线版)  \n\n---\n\n## 一、 量化非功能性需求基准 (NFR Targets)\n\n1. **数据规模与吞吐**：支撑 50,000 点位并发接入，采样周期 1s/5s，峰值写入 TPS $\\ge 10,000$ 点/秒；\n2. **界面渲染性能**：LCP < 1.8s、INP < 100ms、CLS < 0.05、FCP < 0.8s；\n3. **复杂计算时限**：单 SKU LCA 计算 < 5s；双语报告导出 < 15s；CBAM 关税计算 < 3s；\n4. **报表流式导出**：100,000 行复杂带样式 Excel 导出时限 $\\le 30\\text{ s}$；\n5. **系统可用性保证**：平台整体可用性 $\text{SLO} \\ge 99.9\\%$；RTO $\\le 30\\text{ min}$，RPO $\\le 5\\text{ min}$；\n6. **因子库匹配度**：原材料 BOM 自动匹配权威因子命中率 $\\ge 95\\%$。\n\n---\n\n## 二、 核心 OpenAPI 3.0.3 接口契约规范\n\n```yaml\nopenapi: 3.0.3\ninfo:\n  title: 特变电工双中心核心集成 API\n  version: 1.2.0\npaths:\n  /api/v1/lca/reports/calculate:\n    post:\n      summary: 执行单型号产品生命周期 LCA 五阶段滚算\n      requestBody:\n        required: true\n        content:\n          application/json:\n            schema:\n              type: object\n              required: [sku_id, bom_id, factor_version]\n              properties:\n                sku_id: { type: string, example: \"SKU-TB-500KV-01\" }\n                bom_id: { type: string, example: \"BOM-2026-09-001\" }\n                factor_version: { type: string, example: \"v2026.1\" }\n      responses:\n        '200':\n          description: 计算成功\n          content:\n            application/json:\n              schema:\n                type: object\n                properties:\n                  total_co2e: { type: number, example: 45280.50 }\n                  stages:\n                    type: object\n                    properties:\n                      raw_material: { type: number }\n                      transport: { type: number }\n                      manufacturing: { type: number }\n                      testing: { type: number }\n                      packaging: { type: number }\n                  hash_signature: { type: string, example: \"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\" }\n```\\n"
  }
];

/* 3. 全量 37 页面高深度技术规格清单 (含模块/参数/数据源/计算模型/DTO/角色落地) */
export const PAGE_MODULE_SPECS: PageModuleSpec[] = [
  {
    "id": "spec-screen-panoramic",
    "center": "零碳园区集控中心",
    "navGroup": "集控中心大屏",
    "pageName": "全景环幕大屏",
    "route": "/zero-carbon/screen",
    "component": "components/screen/panoramic-screen-view.tsx",
    "overview": "集团级高保真环幕全景监控大屏。面向集团决策层与企业来访展示，融合全国 6 大产业园区 3D 浮雕地图定位、全集团新能源出力、储能充放功率、直供绿电消纳比、累计减排量与能碳态势雷达。",
    "subModules": [
      {
        "name": "3D 立体中国浮雕地图",
        "desc": "基于 D3-Geo 经纬度投影与 CSS perspective 1200px 倾角变换，园区焦点呼吸脉冲光圈与动态交互引线。"
      },
      {
        "name": "集团级能碳核心 KPI",
        "desc": "总用电负荷 (kW)、自发自用绿电消纳量 (kWh)、折标综合能耗 (tce)、实时碳排放强度 (tCO2e)。"
      },
      {
        "name": "源网荷储平衡环形玫瑰图",
        "desc": "市电受电、分布式光伏、储能充放、工业负荷四端动态流向图与实时自平衡率。"
      },
      {
        "name": "园区能效对标红黑榜",
        "desc": "各园区零碳综合评分、万元产值能耗对标与领跑标杆排名动态轮播。"
      },
      {
        "name": "实时告警跑马灯",
        "desc": "厂区越限用电、表计离线与防逆流突发事件实时滚动播报与等级徽章。"
      },
      {
        "name": "双碳目标演进里程碑",
        "desc": "2026~2030 碳达峰与零碳园区建设时间轴与减碳达成率。"
      }
    ],
    "parameters": [
      {
        "paramCode": "parkId",
        "paramName": "园区标识",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": false,
        "source": "地图节点点击联动",
        "rangeOrEnum": "all | PARK_XJ | PARK_HB | PARK_SB | PARK_SD",
        "description": "选定的产业园区，不传则默认展示全集团汇总数据"
      },
      {
        "paramCode": "refreshRate",
        "paramName": "数据刷新周期",
        "category": "入参过滤",
        "dataType": "number",
        "unit": "秒",
        "required": false,
        "source": "前端定时轮询配置",
        "rangeOrEnum": "5 | 15 | 30",
        "description": "大屏前端向网关拉取聚合快照的轮询间隔"
      },
      {
        "paramCode": "totalPowerLoadKw",
        "paramName": "全集团瞬时总负荷",
        "category": "核心指标",
        "dataType": "number",
        "unit": "kW",
        "required": true,
        "source": "IoT SCADA 遥测汇聚",
        "rangeOrEnum": "0 ~ 500,000",
        "description": "全集团当前正在运行的有功用电负荷总和"
      },
      {
        "paramCode": "todayGenKwh",
        "paramName": "当日新能源发电量",
        "category": "核心指标",
        "dataType": "number",
        "unit": "kWh",
        "required": true,
        "source": "光伏逆变器日累计",
        "rangeOrEnum": "0 ~ 1,000,000",
        "description": "全集团各园区屋顶分布式光伏与风电当日累计发电量"
      },
      {
        "paramCode": "todayGreenOffsetT",
        "paramName": "当日二氧化碳减排量",
        "category": "核心指标",
        "dataType": "number",
        "unit": "tCO2e",
        "required": true,
        "source": "绿电核算引擎衍生",
        "rangeOrEnum": "0 ~ 1,000",
        "description": "基于当日自发自用绿电量乘以电网排放因子核算的减排量"
      },
      {
        "paramCode": "greenPowerRatioPct",
        "paramName": "全域绿电消纳占比",
        "category": "核心指标",
        "dataType": "number",
        "unit": "%",
        "required": true,
        "source": "源网荷储平衡计算",
        "rangeOrEnum": "0.0 ~ 100.0%",
        "description": "自发绿电与直供专线绿电在总用电负荷中的物理占比"
      },
      {
        "paramCode": "annualTargetProgressPct",
        "paramName": "年度双碳目标完成度",
        "category": "核心指标",
        "dataType": "number",
        "unit": "%",
        "required": true,
        "source": "年度计划台账对比",
        "rangeOrEnum": "0.0 ~ 150.0%",
        "description": "当年累计减碳量占集团年度双碳下达考核任务的比例"
      },
      {
        "paramCode": "gridLoadKw",
        "paramName": "大电网受电功率",
        "category": "业务明细",
        "dataType": "number",
        "unit": "kW",
        "required": true,
        "source": "总降变主变有功功率",
        "rangeOrEnum": "0 ~ 400,000",
        "description": "从国家电网 110kV/35kV 变电站受入的市电瞬时功率"
      },
      {
        "paramCode": "essPowerKw",
        "paramName": "储能电站瞬时功率",
        "category": "业务明细",
        "dataType": "number",
        "unit": "kW",
        "required": true,
        "source": "储能 PCS 变流器",
        "rangeOrEnum": "-50,000 ~ +50,000",
        "description": "正值代表放电供给工厂负荷，负值代表充电吸收光伏余电"
      },
      {
        "paramCode": "carbonIntensityRealtime",
        "paramName": "实时碳排放强度",
        "category": "衍生计算",
        "dataType": "number",
        "unit": "kgCO2/kWh",
        "required": true,
        "source": "电网因子加权核算",
        "rangeOrEnum": "0.000 ~ 1.000",
        "description": "当前每度工业用电对应的平均碳足迹排放强度"
      }
    ],
    "dataSources": [
      {
        "medium": "全集团总用电负荷",
        "sourceType": "各大园区 SCADA 调度总线汇聚",
        "protocol": "MQTT 5.0 / Kafka 分布式流处理",
        "device": "集团级能源调度网关集群",
        "tagExample": "GROUP_TOTAL_ACTIVE_POWER_KW",
        "frequency": "5 秒推送一次",
        "securityLevel": "L1 (内部级)"
      },
      {
        "medium": "园区分布式光伏出力",
        "sourceType": "华为 / 阳光电源光伏数采逆变器",
        "protocol": "Modbus-TCP / 104 远动规约",
        "device": "各园区屋顶光伏箱变测控一体装置",
        "tagExample": "PARK_XJ_PV_ACTIVE_POWER_KW",
        "frequency": "10 秒采集一次",
        "securityLevel": "L1 (内部级)"
      },
      {
        "medium": "电化学储能充放工况",
        "sourceType": "储能电站 EMS 能量管理系统",
        "protocol": "IEC 61850 / Modbus-TCP",
        "device": "储能双向变流器 PCS & BMS 电池管理",
        "tagExample": "PARK_HB_ESS_DISCHARGE_KW",
        "frequency": "5 秒采集一次",
        "securityLevel": "L1 (内部级)"
      },
      {
        "medium": "地理信息与园区元数据",
        "sourceType": "系统静态配置数据库",
        "protocol": "MySQL 直连加载",
        "device": "系统元数据库 `dim_park_topology`",
        "tagExample": "PARK_GIS_GEOJSON_COORDS",
        "frequency": "系统启动时载入",
        "securityLevel": "L0 (公开级)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "全集团实时绿电消纳占比",
        "mathExpression": "R_{green} = \\frac{\\sum_{i=1}^{m} P_{pv\\_self,i} + \\sum_{i=1}^{m} P_{ess\\_dis,i} + P_{direct\\_green}}{\\sum_{i=1}^{m} P_{load,i}} \\times 100\\%",
        "variables": [
          {
            "name": "P_{pv_self,i}",
            "desc": "第 i 个园区光伏自发自用瞬时功率",
            "unit": "kW"
          },
          {
            "name": "P_{ess_dis,i}",
            "desc": "第 i 个园区储能放电有功功率",
            "unit": "kW"
          },
          {
            "name": "P_{direct_green}",
            "desc": "区域专线直供绿电受电功率",
            "unit": "kW"
          },
          {
            "name": "P_{load,i}",
            "desc": "第 i 个园区全部工业用电有功负荷",
            "unit": "kW"
          }
        ],
        "logicDescription": "分子归集自用光伏、储能绿电与专线绿电，分母为全集团总负荷，反映物理级新能源消纳水平。",
        "boundaryRule": "当工厂全厂停工检修且总负荷 P_load = 0 时，消纳比强制封顶判定为 100%，防止除零崩溃。"
      },
      {
        "formulaName": "当日新能源自发绿电减碳量",
        "mathExpression": "C_{offset} = \\frac{E_{pv\\_self} \\times EF_{grid}}{1000}",
        "variables": [
          {
            "name": "E_{pv_self}",
            "desc": "当日光伏累计自发自用电量",
            "unit": "kWh"
          },
          {
            "name": "EF_{grid}",
            "desc": "所在区域电网平均供电碳排放因子",
            "unit": "kgCO2/kWh"
          }
        ],
        "logicDescription": "每消纳一度自发绿电，按等量替代区域电网火电测算减排二氧化碳当量。",
        "boundaryRule": "EF_grid 依据生态环境部最新公告因子基准动态绑定，杜绝写死历史脏数据。"
      }
    ],
    "calculationLogic": "1. 集团全域绿电占比计算:\n   Green_Ratio_Group = (∑ Q_green_park_i / ∑ Q_total_power_park_i) × 100%\n2. 3D 地图透视投影矩阵变换:\n   CSS transform: perspective(1200px) rotateX(25deg) rotateZ(-3deg)\n   动态引线连接算法: 依据园区 SVG 节点中心相对坐标与外部 HUD 卡片锚点绘制贝塞尔曲线。",
    "dtoSchema": "interface ScreenOverviewDTO {\n  timestamp: string;\n  groupMetrics: {\n    totalPowerLoadKw: number;\n    todayGenKwh: number;\n    todayGreenOffsetT: number;\n    greenPowerRatioPct: number;\n    annualTargetProgressPct: number;\n  };\n  parkPoints: {\n    parkId: string;\n    name: string;\n    coords: [number, number];\n    status: 'online' | 'warning';\n    powerKw: number;\n    greenRatioPct: number;\n  }[];\n}",
    "frontendSpecs": "- 采用航天级 HUD 金属切角 (clip-path: polygon) 与微发光背板，杜绝切片图片锯齿；\n- 原生弹性适配 1080P、2K 及 48:9 / 32:9 超宽环幕大屏；\n- 图表采用微透防眩科技蓝 `rgba(56, 189, 248, 0.08)`。",
    "backendSpecs": "- 接口：`GET /api/v1/screen/overview`\n- 高并发吞吐保护：单机 10,000 QPS 承载，启用 Redis 内存快照，TTL = 5s。",
    "qaTestSpecs": "- 分辨率适配测试: 验证 1920x1080, 2560x1440 与 5760x1080 下文字与图表无重叠遮挡。\n- 网络重连测试: 模拟断网 30s 恢复后，WebSocket/轮询机制能自动恢复数据刷新。"
  },
  {
    "id": "spec-screen-control-center",
    "center": "零碳园区集控中心",
    "navGroup": "集控中心大屏",
    "pageName": "综合集控大屏 (16:9)",
    "route": "/screen/control-center",
    "component": "components/screen/control-center-view.tsx",
    "overview": "符合标准 16:9 工控显示器及指挥调度室中屏的高保真集控大屏。聚焦 6 大直属经营单位（沈变、衡变、新变、鲁缆、德缆、新缆）的关键能耗指标 PK、重点用能设备监控及越限报警处置。",
    "subModules": [
      {
        "name": "16:9 标准工控布局",
        "desc": "严密适配 1920x1080 与 2K 工业显示器，无横向纵向滚动条，高密度 Bento 仪表网格。"
      },
      {
        "name": "6 大经营单位能耗 PK 矩阵",
        "desc": "沈变/衡变/新变/鲁缆/德缆/新缆实时负荷、万元产值能耗对标排名与历史同比浮动。"
      },
      {
        "name": "尖峰平谷负荷分布分析",
        "desc": "当日 24 小时 TOU 分时电量连续面积走势，实时标注当前尖峰平谷电价时段。"
      },
      {
        "name": "重点用能设备在线工况",
        "desc": "超高压立塔交联线、大型气相真空干燥机组等 32 台试点设备开机率与实时负荷率。"
      },
      {
        "name": "源网荷储微网运行状态",
        "desc": "园区光伏当前出力占比、储能充放功率、防逆流状态与市电需量预警。"
      }
    ],
    "parameters": [
      {
        "paramCode": "orgUnitId",
        "paramName": "经营单位ID",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": false,
        "source": "顶部下拉切换",
        "rangeOrEnum": "all | SB | HB | XB | LL | DL | XL",
        "description": "筛选查看单一经营单位或展示全集团综合横向对比"
      },
      {
        "paramCode": "totalActiveLoad",
        "paramName": "实时有功总负荷",
        "category": "核心指标",
        "dataType": "number",
        "unit": "kW",
        "required": true,
        "source": "总降变配电监控系统",
        "rangeOrEnum": "0 ~ 300,000",
        "description": "当前各厂区正在消耗的实际有功功率"
      },
      {
        "paramCode": "dailyPowerKwh",
        "paramName": "当日累计总用电量",
        "category": "核心指标",
        "dataType": "number",
        "unit": "kWh",
        "required": true,
        "source": "分时电度表冻结累加",
        "rangeOrEnum": "0 ~ 2,000,000",
        "description": "当日 00:00 至今的全厂有功总电量"
      },
      {
        "paramCode": "dailyGasM3",
        "paramName": "当日天然气消耗量",
        "category": "核心指标",
        "dataType": "number",
        "unit": "m³",
        "required": true,
        "source": "天然气总管膜式流量计",
        "rangeOrEnum": "0 ~ 10,000",
        "description": "当日锅炉与烘房燃气消耗总量"
      },
      {
        "paramCode": "dailySteamT",
        "paramName": "当日蒸汽外购量",
        "category": "核心指标",
        "dataType": "number",
        "unit": "t",
        "required": true,
        "source": "蒸汽供汽管道涡街流量计",
        "rangeOrEnum": "0 ~ 500",
        "description": "当日外购工业蒸汽累计进厂量"
      },
      {
        "paramCode": "energyPerOutputRealtime",
        "paramName": "实时万元产值能耗",
        "category": "衍生计算",
        "dataType": "number",
        "unit": "tce/万元",
        "required": true,
        "source": "能耗产值动态折算",
        "rangeOrEnum": "0.01 ~ 5.00",
        "description": "当日累计综合能耗与预计工业产值的比值"
      },
      {
        "paramCode": "peakValleyRatio",
        "paramName": "分时峰谷比",
        "category": "衍生计算",
        "dataType": "number",
        "unit": "-",
        "required": true,
        "source": "分时电量核算",
        "rangeOrEnum": "0.1 ~ 5.0",
        "description": "高峰时段用电量与低谷时段用电量的比值"
      }
    ],
    "dataSources": [
      {
        "medium": "全厂动力总降电能",
        "sourceType": "变电站电力自动化监控",
        "protocol": "Modbus-TCP / IEC 61850",
        "device": "110kV 总降主变测控柜多功能仪表",
        "tagExample": "SUB_MAIN_P1_ACT_PWR",
        "frequency": "10 秒",
        "securityLevel": "L1 (内部级)"
      },
      {
        "medium": "重点用能设备工况",
        "sourceType": "车间设备 PLC 采集网关",
        "protocol": "OPC UA / Modbus-RTU",
        "device": "超高压立塔配电柜 / 干燥罐电控柜",
        "tagExample": "EQP_CABLE_TOWER_01_P",
        "frequency": "15 秒",
        "securityLevel": "L2 (工作秘密)"
      },
      {
        "medium": "工业蒸汽瞬时流量",
        "sourceType": "供热管网监测流量计算机",
        "protocol": "4-20mA + HART 信号接入",
        "device": "涡街流量计 & 差压变送器",
        "tagExample": "STEAM_FLOW_RATE_TH",
        "frequency": "30 秒",
        "securityLevel": "L2 (工作秘密)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "综合折标综合能耗实时换算",
        "mathExpression": "E_{tce} = \\frac{E_{elec} \\times 0.1229 + V_{gas} \\times 1.2143 + M_{steam} \\times 128.6}{1000}",
        "variables": [
          {
            "name": "E_{elec}",
            "desc": "累计用电量",
            "unit": "kWh"
          },
          {
            "name": "V_{gas}",
            "desc": "天然气消耗体积",
            "unit": "m³"
          },
          {
            "name": "M_{steam}",
            "desc": "工业蒸汽质量",
            "unit": "t"
          }
        ],
        "logicDescription": "依据 GB/T 2589 综合能耗计算通则折标煤系数加权聚合。",
        "boundaryRule": "单项数据缺失时以 0 参与计算并触发标黄提示，禁止整式报错。"
      }
    ],
    "calculationLogic": "大屏各组件实时轮询拉取网关缓存快照，图表采用轻量化 Canvas 渲染保证 60fps 帧率。",
    "dtoSchema": "interface ControlCenterScreenDTO {\n  timestamp: string;\n  totalActiveLoadKw: number;\n  dailyPowerKwh: number;\n  dailyGasM3: number;\n  dailySteamT: number;\n  energyPerOutputTce: number;\n  unitsRanking: { unitName: string; loadKw: number; yoyDelta: number }[];\n  equipmentStatus: { eqName: string; powerKw: number; runningState: 'RUN'|'STOP' }[];\n}",
    "frontendSpecs": "- 固定 16:9 标准比例，支持 CSS Fullscreen API 一键全屏；\n- 表格行高 26px/44px 自适应，深色高对比度工业底色；\n- 图表悬停游标微透科技蓝 `rgba(56, 189, 248, 0.08)`。",
    "backendSpecs": "- 接口：`GET /api/v1/screen/control-center`\n- 内存缓存 3 秒，避免指挥中心多人并发查库。",
    "qaTestSpecs": "- 验证 16:9 比例锁定在 100% 缩放下无水平滚动条。\n- 模拟某单位断网数据缺失，界面优雅呈现离线指示。"
  },
  {
    "id": "spec-monitor-indicator",
    "center": "零碳园区集控中心",
    "navGroup": "集中监管",
    "pageName": "指标管控",
    "route": "/zero-carbon/monitor/indicator",
    "component": "components/monitor/indicator-view.tsx",
    "overview": "能碳双中心核心管控中枢。统一管理经营单位级前 10 项综合指标、5 大标准单位产品指标及 47 项关键制造工序指标（共 65 项能碳管控体系）。支持 Mode A 宏观卡片与 Mode B 深入穿透详情（四项要素：算法公式、测点链路、时序趋势、四类介质历史台账），内置权威白名单判空规则。",
    "subModules": [
      {
        "name": "组织拓扑树下钻",
        "desc": "支持集团/经营单位/工厂/车间四级层级切换，自动识别 9 家未联网单位并纯字体置灰禁用。"
      },
      {
        "name": "全局时间粒度选择器",
        "desc": "支持按日/按月/按年多尺度切换，月度模式支持跨月区间选择联动。"
      },
      {
        "name": "指标分类切换 Tabs",
        "desc": "经营单位综合指标 (10项)、单位产品能耗指标 (5项)、关键制造工序指标 (47项)。"
      },
      {
        "name": "Mode A 核心指标卡片矩阵",
        "desc": "高密工业卡片网格，展示当前值、同比、基准值偏差、标杆值对比与客观运行状态指示。"
      },
      {
        "name": "Mode B 深入穿透抽屉",
        "desc": "点击卡片右侧滑出深度穿透面板：包含完整算法公式、物理测点链路、12个月面积走势与四类介质台账。"
      },
      {
        "name": "尖峰平谷负荷与结构分析",
        "desc": "展示当日/当月尖峰平谷电量构成圆环图、2x2 明细微卡片及连续堆叠柱状图。"
      },
      {
        "name": "重点工序自身历史对比",
        "desc": "聚焦工序自身同比走势，严禁虚假跨厂对抗。"
      },
      {
        "name": "权威工序白名单判空过滤",
        "desc": "依据权威工序表，10 家无工序单位精准判空输出单行结论：`暂无相关工序！`。"
      }
    ],
    "parameters": [
      {
        "paramCode": "orgUnitId",
        "paramName": "组织机构ID",
        "category": "入参过滤",
        "dataType": "number",
        "unit": "-",
        "required": true,
        "source": "左侧组织树选中项",
        "rangeOrEnum": "1 ~ 9999",
        "description": "当前选定的经营单位或单体工厂 ID"
      },
      {
        "paramCode": "periodType",
        "paramName": "统计周期类型",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "顶部时间组件",
        "rangeOrEnum": "day | month | year",
        "description": "核算时间维度：日、月、年"
      },
      {
        "paramCode": "startDate",
        "paramName": "起始时间标签",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "顶部时间组件",
        "rangeOrEnum": "YYYY-MM-DD 或 YYYY-MM",
        "description": "查询时间区间起始节点"
      },
      {
        "paramCode": "endDate",
        "paramName": "结束时间标签",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "顶部时间组件",
        "rangeOrEnum": "YYYY-MM-DD 或 YYYY-MM",
        "description": "查询时间区间截止节点"
      },
      {
        "paramCode": "category",
        "paramName": "指标大类",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": false,
        "source": "分类 Tabs",
        "rangeOrEnum": "group | product | process",
        "description": "过滤展示经营单位综合、单位产品或工序指标"
      },
      {
        "paramCode": "totalEnergyTce",
        "paramName": "综合能源消费总量",
        "category": "核心指标",
        "dataType": "number",
        "unit": "tce",
        "required": true,
        "source": "IoT 多能流折标聚合",
        "rangeOrEnum": "0 ~ 100,000",
        "description": "统计期内水、电、气、汽、油折标煤综合总量"
      },
      {
        "paramCode": "energyPerOutput",
        "paramName": "万元产值综合能耗",
        "category": "核心指标",
        "dataType": "number",
        "unit": "tce/万元",
        "required": true,
        "source": "能耗产值关联核算",
        "rangeOrEnum": "0.01 ~ 10.00",
        "description": "每万元工业总产值对应的折标综合能耗量"
      },
      {
        "paramCode": "unitProductEnergy",
        "paramName": "单位产品综合能耗",
        "category": "核心指标",
        "dataType": "number",
        "unit": "tce/万kVA 或 tce/km",
        "required": true,
        "source": "产量与工序加权分摊",
        "rangeOrEnum": "0.1 ~ 50.0",
        "description": "单台套或单位规格合格产品的综合能耗"
      },
      {
        "paramCode": "carbonEmissionT",
        "paramName": "综合碳排放总量",
        "category": "核心指标",
        "dataType": "number",
        "unit": "tCO2e",
        "required": true,
        "source": "范围一与范围二碳核算",
        "rangeOrEnum": "0 ~ 500,000",
        "description": "直接化石燃烧与外购电力热力对应的碳排放量"
      },
      {
        "paramCode": "carbonPerOutput",
        "paramName": "万元产值碳排放量",
        "category": "核心指标",
        "dataType": "number",
        "unit": "tCO2e/万元",
        "required": true,
        "source": "碳排产值关联核算",
        "rangeOrEnum": "0.01 ~ 20.00",
        "description": "每万元工业产值对应的二氧化碳排放强度"
      },
      {
        "paramCode": "greenPowerRatio",
        "paramName": "绿电消纳占比",
        "category": "核心指标",
        "dataType": "number",
        "unit": "%",
        "required": true,
        "source": "新能源结算数据",
        "rangeOrEnum": "0.0 ~ 100.0%",
        "description": "自发光伏与绿电直供量占总用电负荷比例"
      },
      {
        "paramCode": "pvSelfRatio",
        "paramName": "光伏自发自用率",
        "category": "核心指标",
        "dataType": "number",
        "unit": "%",
        "required": true,
        "source": "光伏发电系统结算",
        "rangeOrEnum": "0.0 ~ 100.0%",
        "description": "厂区光伏本地自用量占光伏总发电量的比例"
      },
      {
        "paramCode": "autoAcquisitionRate",
        "paramName": "关键数据自动采集率",
        "category": "核心指标",
        "dataType": "number",
        "unit": "%",
        "required": true,
        "source": "表计台账与远传对账",
        "rangeOrEnum": "0.0 ~ 100.0%",
        "description": "联网自动采集表计占理论应装表计比例"
      },
      {
        "paramCode": "meterEquipRate",
        "paramName": "计量器具配备完备率",
        "category": "核心指标",
        "dataType": "number",
        "unit": "%",
        "required": true,
        "source": "GB 17167 对账",
        "rangeOrEnum": "0.0 ~ 100.0%",
        "description": "按国标要求的能源计量器具实际配备比例"
      },
      {
        "paramCode": "processEnergyPerLot",
        "paramName": "关键工序单位消耗",
        "category": "业务明细",
        "dataType": "number",
        "unit": "kgce/台套 或 kWh/t",
        "required": true,
        "source": "车间工序电表除以产量",
        "rangeOrEnum": "0.01 ~ 5,000",
        "description": "线圈绕制/真空干燥/拉丝交联等单工序单耗"
      },
      {
        "paramCode": "yoyDeltaRate",
        "paramName": "同比变化率",
        "category": "衍生计算",
        "dataType": "number",
        "unit": "%",
        "required": true,
        "source": "时序对比引擎",
        "rangeOrEnum": "-100.0% ~ +500.0%",
        "description": "与去年同期相比的增减百分比，负值表示能效改善"
      },
      {
        "paramCode": "benchmarkDeltaRate",
        "paramName": "基准偏差率",
        "category": "衍生计算",
        "dataType": "number",
        "unit": "%",
        "required": true,
        "source": "时序对比引擎",
        "rangeOrEnum": "-100.0% ~ +500.0%",
        "description": "与下达考核基准相比的偏差百分比"
      },
      {
        "paramCode": "benchmarkDiff",
        "paramName": "基准值偏差量",
        "category": "衍生计算",
        "dataType": "number",
        "unit": "指标单位",
        "required": true,
        "source": "基准对比引擎",
        "rangeOrEnum": "任意实数",
        "description": "当前实际值减去集团设定基准值的差额"
      },
      {
        "paramCode": "status",
        "paramName": "客观运行状态",
        "category": "核心指标",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "状态判定引擎",
        "rangeOrEnum": "NORMAL | ALERT | EXCELLENT",
        "description": "指标运行状态，严禁定性主观说教词汇"
      }
    ],
    "dataSources": [
      {
        "medium": "车间动力及工序电能",
        "sourceType": "车间分项电能表与热量表 SCADA 直采",
        "protocol": "Modbus-TCP",
        "device": "车间动力配电柜导轨式多功能电表 (APM810)",
        "tagExample": "LINE2_DRY_OVEN_EP (干燥炉电量), LINE2_DRY_STEAM (干燥炉蒸汽)",
        "frequency": "每班次(8小时)结存，15秒遥测",
        "securityLevel": "L1 (内部级)"
      },
      {
        "medium": "工序完工合格产量",
        "sourceType": "MES 生产制造执行系统",
        "protocol": "REST API / 数据库中间视图",
        "device": "MES 生产过站报工终端 (Barcode / RFID 扫码)",
        "tagExample": "MES_OP_FINISH_QTY (工序过站合格数量)",
        "frequency": "工单完工过站即时",
        "securityLevel": "L2 (工作秘密)"
      },
      {
        "medium": "工业蒸汽瞬时与累计",
        "sourceType": "SCADA 蒸汽流量计算机",
        "protocol": "RS485 / Modbus-RTU",
        "device": "高温差压孔板蒸汽流量计",
        "tagExample": "XJ_STEAM_F1_MASS (气相干燥蒸汽流量)",
        "frequency": "1 分钟",
        "securityLevel": "L2 (工作秘密)"
      },
      {
        "medium": "天然气累计供气量",
        "sourceType": "工业气体流量计远传终端",
        "protocol": "M-Bus / 脉冲接口",
        "device": "天信膜式燃气表 / 气体涡轮流量计",
        "tagExample": "HB_GAS_M1_TOTAL",
        "frequency": "15 分钟累积",
        "securityLevel": "L2 (工作秘密)"
      },
      {
        "medium": "屋顶光伏与储能微网",
        "sourceType": "园区新能源集控网关",
        "protocol": "IEC 61850 / Modbus-TCP",
        "device": "光伏逆变器 & 储能双向变流器 PCS",
        "tagExample": "PV_INV_01_ETODAY, BESS_BAT_SOC_01",
        "frequency": "15 秒",
        "securityLevel": "L1 (内部级)"
      },
      {
        "medium": "工业总产值与增加值",
        "sourceType": "ERP 财务系统与月报填报",
        "protocol": "HTTPS REST API",
        "device": "SAP 财务核算模块 / 线下填报表单",
        "tagExample": "finance_monthly_report.industrial_output_value",
        "frequency": "每月 3 日前结账",
        "securityLevel": "L3 (核心商密)"
      },
      {
        "medium": "官方碳因子与折标系数",
        "sourceType": "集团因子库集中维护系统",
        "protocol": "MySQL 系统字典表",
        "device": "数据中心主数据库 `t_carbon_factor`",
        "tagExample": "factor_value (省级电网碳排放因子)",
        "frequency": "月度生效归档",
        "securityLevel": "L2 (工作秘密)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "综合能耗折标准煤当量模型",
        "mathExpression": "E = \\sum_{i=1}^{n} (E_i \\times k_i)",
        "variables": [
          {
            "name": "E_i",
            "desc": "第 i 类能源介质实物量 (电、汽、气、油)",
            "unit": "kWh, t, m³, kg"
          },
          {
            "name": "k_i",
            "desc": "折标煤当量系数 (电:0.1229 kgce/kWh, 汽:0.1286 kgce/kg, 气:1.2143 kgce/m³)",
            "unit": "kgce/实物单位"
          }
        ],
        "logicDescription": "依据 GB/T 2589 综合能耗计算通则，将全厂各类能源实物量转换为统一吨标准煤当量 (tce)。",
        "boundaryRule": "实物消耗量必须为正实数，出现负数判定为表计倒走异常，系统阻断核算并告警。"
      },
      {
        "formulaName": "万元产值综合能耗核算模型",
        "mathExpression": "e_{output} = \\frac{E}{G_{output} / 10000}",
        "variables": [
          {
            "name": "E",
            "desc": "全厂统计期折标综合能耗",
            "unit": "tce"
          },
          {
            "name": "G_{output}",
            "desc": "全厂同期完成的工业总产值",
            "unit": "元"
          }
        ],
        "logicDescription": "衡量企业工业经济产出能效的核心指标，分子分母统计周期与核算范围严格闭环对齐。",
        "boundaryRule": "若某月全厂停工检修且工业产值 G_output = 0 时，单耗安全兜底显示为 `-`，严禁除以零抛出 NaN。"
      },
      {
        "formulaName": "关键工序单耗与白名单判空规则",
        "mathExpression": "e_{process} = \\frac{E_{elec} \\times 0.1229 + T_{steam} \\times 0.1286}{Q_{finished\\_lot}}",
        "variables": [
          {
            "name": "E_{elec}",
            "desc": "工序生产专用电表消耗电量",
            "unit": "kWh"
          },
          {
            "name": "T_{steam}",
            "desc": "干燥炉等工序消耗蒸汽量",
            "unit": "kg"
          },
          {
            "name": "Q_{finished_lot}",
            "desc": "工序 MES 报工质检合格台套数或重量",
            "unit": "台套 或 t"
          }
        ],
        "logicDescription": "工序专机能耗直采加总，除以合格产量；非工序公用辅助能耗不计入单道工序分子。",
        "boundaryRule": "严格遵循《生产单位与涉及关键工序对应表(1).et》，沈变、衡变、新变、鲁缆下属智慧能源等 10 家无工序企业精准判空为单行纯文本：`暂无相关工序！`。"
      },
      {
        "formulaName": "动态同比核算与基准偏差模型",
        "mathExpression": "\\text{YoY} = \\frac{V_{current} - V_{last\\_year}}{V_{last\\_year}} \\times 100\\%, \\quad \\text{Dev} = \\frac{V_{current} - V_{benchmark}}{V_{benchmark}} \\times 100\\%",
        "variables": [
          {
            "name": "V_{current}",
            "desc": "当前核算周期实际值",
            "unit": "指标对应物理单位"
          },
          {
            "name": "V_{last_year}",
            "desc": "去年同期历史核算值",
            "unit": "指标对应物理单位"
          },
          {
            "name": "V_{benchmark}",
            "desc": "考核下达基准值",
            "unit": "指标对应物理单位"
          }
        ],
        "logicDescription": "反映指标时序演进趋势，负值代表消耗降低或能效改善，正值代表能耗上升。",
        "boundaryRule": "基期历史值为 0 或缺失时，增长率统一安全显示为 `--` 并附加提示，避免无穷大异常。"
      }
    ],
    "calculationLogic": "1. 工序单位管耗核算:\n   e_process = (E_elec × 0.1229 + T_steam × 0.1286) / Q_finished_lot\n   若当期产量 Q = 0，消除除零异常，前端显示 '-' 并提示'当期无产出'。\n2. 权威工序白名单判空规则:\n   依据《生产单位与涉及关键工序对应表(1).et》，沈变、衡变、新变、鲁缆下属智慧能源等 10 家无工序企业，工序业务领域一律精准判空整行输出单行文本：暂无相关工序！",
    "dtoSchema": "interface IndicatorOverviewDTO {\n  orgUnitId: number;\n  period: string;\n  summary: {\n    totalIndicators: number;\n    normalCount: number;\n    alertCount: number;\n  };\n  metrics: {\n    id: number;\n    code: string;\n    name: string;\n    category: 'group' | 'product' | 'process';\n    currentVal: number;\n    unit: string;\n    benchmarkVal: number;\n    yoyRate: number;\n    benchmarkDiffRate: number;\n    status: 'NORMAL' | 'ALERT' | 'EXCELLENT';\n    formula: string;\n  }[];\n}",
    "frontendSpecs": "- Mode A 与 Mode B 无缝抽屉切换，激活态通过 `border-primary ring-2` 自解释，杜绝说明性标签；\n- 44px 工业高密表格行高，字体对齐；\n- 8 大能源介质官方标准色与尖峰平谷 4 段色彩字典绝对统一。",
    "backendSpecs": "- 接口：`GET /api/v1/zero-carbon/indicators/list`\n- Redis 缓存 Key: `cache:ind:overview:{unitId}:{period}`，TTL = 30min + 5min Jitter；\n- 分布式锁 `lock:calc:{unitId}:{period}` 防止单工厂同周期重复核算并发写。",
    "qaTestSpecs": "- 边界值测试: 验证无工序工厂精准展示单行'暂无相关工序！'，无多余大段文字；\n- 除零测试: 模拟产量为 0，单耗无 NaN 抛错，正常展示 '-'；\n- 权限测试: 验证分厂专员无法越权调阅其他分厂核心产值与单耗数据。"
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
      {
        "name": "实时多能流总览卡片",
        "desc": "总用电量、市电量、绿电消纳量、工业蒸汽消耗量 4 大 KPI 主指标卡，边框高亮自解释。"
      },
      {
        "name": "24小时负荷时序走势",
        "desc": "多能源介质动态曲线，支持日/周/月粒度切换及微透防眩游标。"
      },
      {
        "name": "分时电量 4 段构成",
        "desc": "尖、峰、平、谷电量柱状占比及综合电费加权分析。电力介质展示分时构成，非电介质动态联动为工序消耗结构。"
      },
      {
        "name": "车间及重点设备能耗列表",
        "desc": "高密 44px 表格，按介质与车间逐项展示实物量与折标量。"
      },
      {
        "name": "跨月区间选择器",
        "desc": "顶部统一升级为 [起始月份] 至 [结束月份]，折线图 X 轴联动展示为各月份节点。"
      }
    ],
    "parameters": [
      {
        "paramCode": "parkId",
        "paramName": "所属园区",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "顶部下拉",
        "rangeOrEnum": "PARK_XJ | PARK_HB | PARK_SB | PARK_SD",
        "description": "当前监测的园区编码"
      },
      {
        "paramCode": "energyMedium",
        "paramName": "能源介质类型",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "介质卡片切换",
        "rangeOrEnum": "TOTAL_POWER | GRID_POWER | GREEN_POWER | WATER | GAS | STEAM | OIL | N2",
        "description": "当前激活查看的能源介质"
      },
      {
        "paramCode": "period",
        "paramName": "统计维度",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "时间模式选择",
        "rangeOrEnum": "day | month",
        "description": "日连续高频监测或月度汇总累计"
      },
      {
        "paramCode": "dateRange",
        "paramName": "时间区间",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "日期选择器",
        "rangeOrEnum": "YYYY-MM-DD 或 YYYY-MM~YYYY-MM",
        "description": "连续采样时间窗"
      },
      {
        "paramCode": "instantTotalPowerKw",
        "paramName": "实时总有功功率",
        "category": "核心指标",
        "dataType": "number",
        "unit": "kW",
        "required": true,
        "source": "SCADA 遥测",
        "rangeOrEnum": "0 ~ 100,000",
        "description": "当前瞬时总用电负荷"
      },
      {
        "paramCode": "accumulatedPowerKwh",
        "paramName": "累计用电量",
        "category": "核心指标",
        "dataType": "number",
        "unit": "kWh",
        "required": true,
        "source": "表底度数累计",
        "rangeOrEnum": "0 ~ 10,000,000",
        "description": "统计期内总用电度数"
      },
      {
        "paramCode": "sharpPowerKwh",
        "paramName": "尖峰电量",
        "category": "业务明细",
        "dataType": "number",
        "unit": "kWh",
        "required": true,
        "source": "分时计度表",
        "rangeOrEnum": "0 ~ 2,000,000",
        "description": "执行尖峰电价时段消耗的电量"
      },
      {
        "paramCode": "peakPowerKwh",
        "paramName": "高峰电量",
        "category": "业务明细",
        "dataType": "number",
        "unit": "kWh",
        "required": true,
        "source": "分时计度表",
        "rangeOrEnum": "0 ~ 3,000,000",
        "description": "执行高峰电价时段消耗的电量"
      },
      {
        "paramCode": "flatPowerKwh",
        "paramName": "平时电量",
        "category": "业务明细",
        "dataType": "number",
        "unit": "kWh",
        "required": true,
        "source": "分时计度表",
        "rangeOrEnum": "0 ~ 4,000,000",
        "description": "执行平段电价时段消耗的电量"
      },
      {
        "paramCode": "valleyPowerKwh",
        "paramName": "低谷电量",
        "category": "业务明细",
        "dataType": "number",
        "unit": "kWh",
        "required": true,
        "source": "分时计度表",
        "rangeOrEnum": "0 ~ 5,000,000",
        "description": "执行低谷电价时段消耗的电量"
      },
      {
        "paramCode": "steamConsumptionT",
        "paramName": "蒸汽消耗量",
        "category": "核心指标",
        "dataType": "number",
        "unit": "t",
        "required": true,
        "source": "蒸汽流量表",
        "rangeOrEnum": "0 ~ 500",
        "description": "原管道工作压力更名为蒸汽消耗量"
      },
      {
        "paramCode": "totalTceEquivalent",
        "paramName": "综合折标能耗",
        "category": "衍生计算",
        "dataType": "number",
        "unit": "tce",
        "required": true,
        "source": "综合核算引擎",
        "rangeOrEnum": "0 ~ 5,000",
        "description": "全介质折标煤累计量"
      }
    ],
    "dataSources": [
      {
        "medium": "电力 (市电/绿电)",
        "sourceType": "IoT / SCADA 自动化直采",
        "protocol": "Modbus-TCP / IEC 60870-5-104",
        "device": "配电房智能电力仪表 (安科瑞 APM810 / 施耐德 PM8000)",
        "tagExample": "XJ_TRANS_P1_P_TOT (瞬时功率 kW), XJ_TRANS_P1_EP_IMP (累计有功度数 kWh)",
        "frequency": "15 秒采集一次遥测，15 分钟存储一次冻结底度",
        "securityLevel": "L1 (内部级)"
      },
      {
        "medium": "工业蒸汽",
        "sourceType": "SCADA 流量计算机",
        "protocol": "OPC UA / 4-20mA + HART",
        "device": "蒸汽涡街流量计 & 差压变送器",
        "tagExample": "XJ_STEAM_F1_MASS (瞬时流量 t/h), XJ_STEAM_F1_TOTAL (累积流量 t)",
        "frequency": "1 分钟采样",
        "securityLevel": "L2 (工作秘密)"
      },
      {
        "medium": "天然气",
        "sourceType": "城市燃气公司远传数据 / 厂内燃气总表",
        "protocol": "Modbus-RTU / 脉冲接口",
        "device": "气体涡轮流量计",
        "tagExample": "HB_GAS_M1_TOTAL (累计气量 m³)",
        "frequency": "15 分钟累加",
        "securityLevel": "L2 (工作秘密)"
      },
      {
        "medium": "工业用水",
        "sourceType": "给排水智慧水表",
        "protocol": "M-Bus / NB-IoT",
        "device": "超声波智能水表",
        "tagExample": "MTR_WATER_W01_ACC (累计吨数 t)",
        "frequency": "1 小时累加",
        "securityLevel": "L1 (内部级)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "分时尖峰平谷电度电费核算",
        "mathExpression": "Cost_{power} = Q_{sharp} \\times P_{sharp} + Q_{peak} \\times P_{peak} + Q_{flat} \\times P_{flat} + Q_{valley} \\times P_{valley}",
        "variables": [
          {
            "name": "Q_i",
            "desc": "各分时时段累计用电量",
            "unit": "kWh"
          },
          {
            "name": "P_i",
            "desc": "当地电网对应分时销售电价",
            "unit": "元/kWh"
          }
        ],
        "logicDescription": "按发改委分时电价政策，精确测算各时段用电成本，用于指导错峰填谷排产。",
        "boundaryRule": "时段电价配置按月归档生效，存在电价突变时以当月第一天 00:00 分界执行。"
      },
      {
        "formulaName": "8大能源介质折标煤核算",
        "mathExpression": "E_{total\\_tce} = \\sum_{m=1}^{8} (Q_m \\times k_m) / 1000",
        "variables": [
          {
            "name": "Q_m",
            "desc": "第 m 种介质实物消费量",
            "unit": "实物单位"
          },
          {
            "name": "k_m",
            "desc": "国家统一折标煤系数 (kgce/单位)",
            "unit": "kgce"
          }
        ],
        "logicDescription": "电量按 0.1229、水按 0.0857、气按 1.2143、汽按 0.1286、油按 1.4571、氮按 0.4000 标准折算。",
        "boundaryRule": "实物量必须非负，单项表计出现反向递减时锁定报警。"
      }
    ],
    "calculationLogic": "1. 尖峰平谷电量计算:\n   Q_total = Q_sharp + Q_peak + Q_flat + Q_valley\n2. 折标综合能耗 (tce):\n   E_tce = (Q_elec × 0.1229 + Q_gas × 1.2143 + Q_steam × 128.6 + Q_water × 0.0857) / 1000\n3. 非电介质自动联动为工序消耗结构占比，消除用电峰平谷违和感。",
    "dtoSchema": "interface UsageQueryReq {\n  parkId: string;\n  unitId?: string;\n  period: 'day' | 'month';\n  date: string;\n}\n\ninterface RealtimeUsageDTO {\n  timestamp: string;\n  metrics: {\n    totalPowerKwh: number;\n    gridPowerKwh: number;\n    greenPowerKwh: number;\n    steamKg: number;\n    gasM3: number;\n    waterTons: number;\n    totalKgce: number;\n    carbonEmissionsT: number;\n  };\n  timeSeries: { time: string; power: number; steam: number; gas: number }[];\n  touShares: { sharpKwh: number; peakKwh: number; flatKwh: number; valleyKwh: number };\n}",
    "frontendSpecs": "- 选中非电介质时，下方模块自动无缝切换为重点工序消耗结构与负荷曲线；\n- 44px 高密表格，表格标题右侧彻底剥离说明性括号文本；\n- 跨月区间选择器联动 X 轴月份显示。",
    "backendSpecs": "- 接口：`GET /api/v1/zero-carbon/monitor/online/usage`\n- TDengine / IoTDB 时序聚合查询，分钟级数据自动 Rollup 降采样。",
    "qaTestSpecs": "- 介质联动测试: 点击水、气、汽等介质，验证下方峰平谷模块彻底替换为工序分布；\n- 跨月区间测试: 选择 2026-01 至 2026-08，图表 X 轴精确展示 8 个月份节点。"
  },
  {
    "id": "spec-monitor-microgrid",
    "center": "零碳园区集控中心",
    "navGroup": "集中监管",
    "pageName": "工业微电网监测",
    "route": "/zero-carbon/monitor/online/microgrid",
    "component": "components/online/microgrid-view.tsx",
    "overview": "园区级工业微电网“源-网-荷-储”多能互补协同控制与防逆流监控中枢。实时监视屋顶光伏出力、储能电池充放电工况（SOC/SOH/充放功率）、车间负荷吸收曲线，严格执行防逆流倒送保护与错峰填谷套利核算。",
    "subModules": [
      {
        "name": "源网荷储实时拓扑图",
        "desc": "市电进线、屋顶分布式光伏、电化学储能、车间生产负荷四端潮流动态流动图。"
      },
      {
        "name": "防逆流保护监控看板",
        "desc": "并网点倒送功率安全阈值实时监测，倒送触发与响应时间毫秒级报警。"
      },
      {
        "name": "储能电站健康与工况",
        "desc": "电池组 SOC (荷电状态)、SOH (健康度)、单体电芯最高/最低温差与双向充放电功率。"
      },
      {
        "name": "光伏发电效率与出力",
        "desc": "光伏实时有功出力、理论辐射出力对比、光伏系统性能比 PR 评估。"
      },
      {
        "name": "削峰填谷套利收益核算",
        "desc": "当日储能低谷充电电费支出与尖峰放电节省电费收益动态比对。"
      },
      {
        "name": "微网运行事件台账",
        "desc": "高密 44px 表格，记录微网削峰、填谷、防逆流切机历史事件。"
      }
    ],
    "parameters": [
      {
        "paramCode": "gridPccPowerKw",
        "paramName": "并网点有功功率",
        "category": "核心指标",
        "dataType": "number",
        "unit": "kW",
        "required": true,
        "source": "并网点双向计量表",
        "rangeOrEnum": "-10,000 ~ +50,000",
        "description": "正值代表从大电网购电，负值代表向电网倒送电量"
      },
      {
        "paramCode": "pvTotalPowerKw",
        "paramName": "光伏总输出功率",
        "category": "核心指标",
        "dataType": "number",
        "unit": "kW",
        "required": true,
        "source": "光伏逆变器遥测",
        "rangeOrEnum": "0 ~ 30,000",
        "description": "全园区屋顶光伏实时总交流出力"
      },
      {
        "paramCode": "essPowerKw",
        "paramName": "储能充放功率",
        "category": "核心指标",
        "dataType": "number",
        "unit": "kW",
        "required": true,
        "source": "储能 PCS 变流器",
        "rangeOrEnum": "-10,000 ~ +10,000",
        "description": "正值为放电供工厂，负值为充电吸纳光伏"
      },
      {
        "paramCode": "essSocPct",
        "paramName": "储能当前荷电状态",
        "category": "核心指标",
        "dataType": "number",
        "unit": "%",
        "required": true,
        "source": "BMS 电池管理系统",
        "rangeOrEnum": "10.0 ~ 95.0%",
        "description": "电池剩余可用电量百分比"
      },
      {
        "paramCode": "essSohPct",
        "paramName": "储能电池健康度",
        "category": "业务明细",
        "dataType": "number",
        "unit": "%",
        "required": true,
        "source": "BMS 寿命评估算法",
        "rangeOrEnum": "80.0 ~ 100.0%",
        "description": "当前最大可用容量与初始额定容量之比"
      },
      {
        "paramCode": "antiReverseState",
        "paramName": "防逆流保护状态",
        "category": "业务明细",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "微网调控一体机",
        "rangeOrEnum": "NORMAL | WARNING | TRIGGERED",
        "description": "正常监视、临界告警、已触发降功率保护"
      },
      {
        "paramCode": "todayArbitrageYuan",
        "paramName": "当日削峰填谷收益",
        "category": "衍生计算",
        "dataType": "number",
        "unit": "元",
        "required": true,
        "source": "峰谷套利核算模型",
        "rangeOrEnum": "0 ~ 50,000",
        "description": "储能谷充峰放产生的直接净电费差价收益"
      },
      {
        "paramCode": "maxCellTempDiffC",
        "paramName": "电芯最高温差",
        "category": "业务明细",
        "dataType": "number",
        "unit": "°C",
        "required": true,
        "source": "BMS 温度巡检",
        "rangeOrEnum": "0.0 ~ 15.0",
        "description": "电池模组内最高与最低电芯温差，>5°C 预警"
      }
    ],
    "dataSources": [
      {
        "medium": "关口并网双向有功电量",
        "sourceType": "高压电度表 SCADA 直采",
        "protocol": "DL/T 645 / IEC 104",
        "device": "10kV/35kV 产权分界点双向智能电能表",
        "tagExample": "PCC_BI_DIR_ACTIVE_POWER_KW",
        "frequency": "1 秒遥测",
        "securityLevel": "L1 (内部级)"
      },
      {
        "medium": "组串式光伏逆变器状态",
        "sourceType": "光伏数采网关通信机",
        "protocol": "Modbus-RTU 汇聚",
        "device": "华为 SUN2000 组串式逆变器",
        "tagExample": "PV_INV_RACK01_PAC",
        "frequency": "5 秒",
        "securityLevel": "L1 (内部级)"
      },
      {
        "medium": "电化学储能 PCS 变流器",
        "sourceType": "储能系统 EMS",
        "protocol": "Modbus-TCP",
        "device": "汇川 / 阳光电源双向储能变流器",
        "tagExample": "PCS_01_ACTIVE_POWER",
        "frequency": "1 秒",
        "securityLevel": "L1 (内部级)"
      },
      {
        "medium": "电池管理系统 BMS",
        "sourceType": "BMS 主控模块",
        "protocol": "CAN 转 Modbus-TCP",
        "device": "磷酸铁锂电池簇集中监控单元",
        "tagExample": "BMS_CLUSTER_SOC, BMS_MAX_CELL_TEMP",
        "frequency": "2 秒",
        "securityLevel": "L2 (工作秘密)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "防逆流倒送保护触发控制逻辑",
        "mathExpression": "P_{reverse} \\ge 10\\text{ kW} \\quad \\text{且持续时间 } t \\ge 100\\text{ ms} \\implies \\text{执行指令 } \\Delta P_{pv} = -5\\% P_{rated}/\\text{s}",
        "variables": [
          {
            "name": "P_{reverse}",
            "desc": "并网关口点反向流入公用电网的有功功率",
            "unit": "kW"
          },
          {
            "name": "t",
            "desc": "倒送持续监测时间窗",
            "unit": "ms"
          },
          {
            "name": "\\Delta P_{pv}",
            "desc": "下发给光伏逆变器的出力压降斜率",
            "unit": "%/s"
          }
        ],
        "logicDescription": "当厂区负荷骤降导致光伏富余电量向公用电网倒送时，微网调控器在 200ms 内快速压降光伏出力，防止越级跳闸被电网罚款。",
        "boundaryRule": "厂内负荷回升且倒送持续 60 秒小于 2kW 时，控制器以 2% P_rated/min 斜率缓慢平滑恢复光伏至最大功率跟踪 MPPT 模式。"
      },
      {
        "formulaName": "储能削峰填谷日净收益测算",
        "mathExpression": "B_{arbitrage} = \\sum (E_{discharge} \\times P_{peak\\_price}) - \\sum (E_{charge} \\times P_{valley\\_price}) - M_{loss}",
        "variables": [
          {
            "name": "E_{discharge}",
            "desc": "峰段和尖峰时段储能向工厂负荷放电量",
            "unit": "kWh"
          },
          {
            "name": "E_{charge}",
            "desc": "低谷时段储能从电网吸收充电量",
            "unit": "kWh"
          },
          {
            "name": "P_{price}",
            "desc": "对应时段峰谷销售电价",
            "unit": "元/kWh"
          },
          {
            "name": "M_{loss}",
            "desc": "充放电转换损耗折算成本 (系统综合充放效率 RTE 约 88%)",
            "unit": "元"
          }
        ],
        "logicDescription": "利用夜间谷电低价充电、白天尖峰高价放电，直接压降工厂高峰购电支出。",
        "boundaryRule": "放电深度 DoD 严格限制在 90% 以内 (SOC 10%~95%)，防止电池过充过放损耗寿命。"
      }
    ],
    "calculationLogic": "微网系统每秒评估并网点潮流，微网调控一体机通过闭环算法动态调节储能充放功率与光伏逆变器功率因数。",
    "dtoSchema": "interface MicrogridStatusDTO {\n  pccPowerKw: number;\n  pvPowerKw: number;\n  essPowerKw: number;\n  factoryLoadKw: number;\n  socPct: number;\n  sohPct: number;\n  antiReverseState: 'NORMAL' | 'WARNING' | 'TRIGGERED';\n  dailySavingsYuan: number;\n  activeEvents: { id: string; type: string; triggerTime: string; powerOffset: number }[];\n}",
    "frontendSpecs": "- 潮流图采用动画光点流向表示电能输送方向与实时速率；\n- 44px 高密事件台账，防逆流异常以红色边框脉冲提示；\n- 导出按钮统一使用标准 `<ExportButton />` 组件 (80x36px)。",
    "backendSpecs": "- 接口：`GET /api/v1/zero-carbon/monitor/online/microgrid`\n- 遥测数据 1 秒高频缓存于 Redis，保留最新 60 个数据点供曲线无抖动流式刷新。",
    "qaTestSpecs": "- 逆流告警测试: 模拟 PCC 倒送功率达到 -15kW，验证系统在 100ms 内触发 ALERT 状态；\n- 恢复防抖测试: 模拟倒送消失，验证系统是否满足 60s 防抖延时后才复位 MPPT。"
  },
  {
    "id": "spec-monitor-carbon-emission",
    "center": "零碳园区集控中心",
    "navGroup": "集中监管",
    "pageName": "能源碳排放监测",
    "route": "/zero-carbon/monitor/carbon-emission",
    "component": "components/online/carbon-emission-view.tsx",
    "overview": "企业温室气体排放实时监控看板。依据国家《工业企业温室气体排放核算方法与报告指南》，全面穿透范围一（直接化石燃料燃烧）与范围二（外购电力与蒸汽消耗间接排放），实时计算全厂碳排放速率、绿电减碳抵消量及万元产值碳排放强度。",
    "subModules": [
      {
        "name": "碳排放强度看板",
        "desc": "实时碳排放速率 (tCO2e/h)、累计碳排放量 (tCO2e)、万元产值碳强度 (tCO2e/万元)。"
      },
      {
        "name": "范围一/范围二动态拆解",
        "desc": "化石燃料燃烧 (直接排放) 与外购电力热力 (间接排放) 实时比例环形图。"
      },
      {
        "name": "能源活动时序碳排走势",
        "desc": "日/月/年多维度时序碳排放面积图，微透防眩科技蓝游标。"
      },
      {
        "name": "绿电直接减排抵消量",
        "desc": "基于物理溯源绿电消纳量计算的碳减排量，展示净排放与总排放差异。"
      },
      {
        "name": "各车间碳排放贡献明细表",
        "desc": "44px 工业高密表格，按车间/产线展示电、气、汽实物量及核算碳排吨数。"
      }
    ],
    "parameters": [
      {
        "paramCode": "orgUnitId",
        "paramName": "组织工厂ID",
        "category": "入参过滤",
        "dataType": "number",
        "unit": "-",
        "required": true,
        "source": "组织选择树",
        "rangeOrEnum": "1 ~ 9999",
        "description": "查看的指定单体工厂"
      },
      {
        "paramCode": "scope1Tco2",
        "paramName": "范围一直接排放量",
        "category": "核心指标",
        "dataType": "number",
        "unit": "tCO2e",
        "required": true,
        "source": "天然气与柴油燃烧核算",
        "rangeOrEnum": "0 ~ 10,000",
        "description": "厂区内固定燃烧源与移动源碳排放"
      },
      {
        "paramCode": "scope2Tco2",
        "paramName": "范围二间接排放量",
        "category": "核心指标",
        "dataType": "number",
        "unit": "tCO2e",
        "required": true,
        "source": "外购电与外购蒸汽核算",
        "rangeOrEnum": "0 ~ 100,000",
        "description": "消耗外购电力与热力隐含的碳排放"
      },
      {
        "paramCode": "greenOffsetTco2",
        "paramName": "绿电减排抵消量",
        "category": "核心指标",
        "dataType": "number",
        "unit": "tCO2e",
        "required": true,
        "source": "自发与直供绿电换算",
        "rangeOrEnum": "0 ~ 50,000",
        "description": "自用非化石能源电力减免的碳排放量"
      },
      {
        "paramCode": "netCarbonEmissionT",
        "paramName": "企业净碳排放量",
        "category": "核心指标",
        "dataType": "number",
        "unit": "tCO2e",
        "required": true,
        "source": "总排放减去绿电抵消",
        "rangeOrEnum": "0 ~ 100,000",
        "description": "Scope1 + Scope2 - GreenOffset"
      },
      {
        "paramCode": "carbonIntensityOutput",
        "paramName": "万元产值碳强度",
        "category": "衍生计算",
        "dataType": "number",
        "unit": "tCO2e/万元",
        "required": true,
        "source": "净碳排与产值之比",
        "rangeOrEnum": "0.01 ~ 15.00",
        "description": "每万元产值对应的温室气体排放"
      },
      {
        "paramCode": "powerEmissionFactor",
        "paramName": "电力碳排放因子",
        "category": "业务明细",
        "dataType": "number",
        "unit": "kgCO2/kWh",
        "required": true,
        "source": "生态环境部发布因子",
        "rangeOrEnum": "0.400 ~ 0.800",
        "description": "当前适用的区域省级电网基准平均因子"
      }
    ],
    "dataSources": [
      {
        "medium": "全厂外购市电量",
        "sourceType": "SCADA 关口主表",
        "protocol": "Modbus-TCP",
        "device": "110kV 主降变压器关口计量表",
        "tagExample": "GRID_METER_TOTAL_KWH",
        "frequency": "15 分钟冻结",
        "securityLevel": "L1 (内部级)"
      },
      {
        "medium": "工业天然气耗量",
        "sourceType": "燃气计量远传表",
        "protocol": "Modbus-RTU",
        "device": "锅炉房及热处理炉天然气流量计",
        "tagExample": "GAS_BOILER_TOTAL_M3",
        "frequency": "15 分钟",
        "securityLevel": "L2 (工作秘密)"
      },
      {
        "medium": "外购蒸汽质量",
        "sourceType": "供热管网监测仪",
        "protocol": "4-20mA",
        "device": "蒸汽流量计算机",
        "tagExample": "STEAM_PIPE_IN_TONS",
        "frequency": "15 分钟",
        "securityLevel": "L2 (工作秘密)"
      },
      {
        "medium": "省级电网碳排放因子",
        "sourceType": "集团因子库版本管理",
        "protocol": "MySQL 系统字典",
        "device": "`t_carbon_factor` 电网因子表",
        "tagExample": "EF_GRID_REGIONAL",
        "frequency": "年度更新生效",
        "securityLevel": "L1 (内部级)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "范围一化石燃料燃烧碳排放计算",
        "mathExpression": "C_{scope1} = V_{gas} \\times LHV_{gas} \\times CC_{gas} \\times OF_{gas} \\times \\frac{44}{12} + M_{diesel} \\times LHV_{diesel} \\times CC_{diesel} \\times OF_{diesel} \\times \\frac{44}{12}",
        "variables": [
          {
            "name": "V_{gas}",
            "desc": "天然气消耗体积",
            "unit": "万Nm³"
          },
          {
            "name": "LHV",
            "desc": "燃料低位发热量",
            "unit": "GJ/万Nm³ 或 GJ/t"
          },
          {
            "name": "CC",
            "desc": "单位热值含碳量",
            "unit": "tC/GJ"
          },
          {
            "name": "OF",
            "desc": "碳氧化率 (天然气通常取 99%)",
            "unit": "%"
          }
        ],
        "logicDescription": "遵循发改委指南，基于燃料消耗量与实测或缺省发热量、含碳量核算直接二氧化碳排放。",
        "boundaryRule": "发热量以供气方月度检验报告为准，未检测时采用国家缺省值 389.31 GJ/万Nm³。"
      },
      {
        "formulaName": "范围二外购电力净间接排放核算",
        "mathExpression": "C_{scope2} = (E_{total\\_power} - E_{green\\_physical}) \\times EF_{grid} + M_{steam} \\times EF_{steam}",
        "variables": [
          {
            "name": "E_{total_power}",
            "desc": "企业总用电量",
            "unit": "MWh"
          },
          {
            "name": "E_{green_physical}",
            "desc": "具备物理溯源的自用绿电与专线绿电",
            "unit": "MWh"
          },
          {
            "name": "EF_{grid}",
            "desc": "全国或省级电网基准平均碳排放因子",
            "unit": "tCO2/MWh"
          },
          {
            "name": "EF_{steam}",
            "desc": "外购蒸汽碳排放因子 (通常 0.11 tCO2/GJ)",
            "unit": "tCO2/GJ"
          }
        ],
        "logicDescription": "物理绿电直接扣减外购火电电量，体现企业投资新能源电站的直接降碳红利。",
        "boundaryRule": "扣减量严格以实际消纳量为上限，绿电超发上网部分不计入本厂抵扣。"
      }
    ],
    "calculationLogic": "碳排放核算引擎采用日结存批处理与小时级流式估算，双端同构统一采用 44px 高密表格排版。",
    "dtoSchema": "interface CarbonEmissionDTO {\n  orgUnitId: number;\n  period: string;\n  scope1T: number;\n  scope2T: number;\n  greenOffsetT: number;\n  netTotalT: number;\n  carbonIntensity: number;\n  timeSeries: { time: string; scope1: number; scope2: number }[];\n  workshopDetails: { workshopName: string; powerKwh: number; gasM3: number; emissionT: number }[];\n}",
    "frontendSpecs": "- 44px 工业高密表格；\n- 纯客观数据呈现，严禁任何'减排表现优良'等定性评价标签；\n- 导出按钮统一接入标准 `<ExportButton />` 组件。",
    "backendSpecs": "- 接口：`GET /api/v1/zero-carbon/monitor/carbon-emission`\n- 数据写入生成审计哈希链，保证核算报告真实防篡改。",
    "qaTestSpecs": "- 因子匹配测试: 验证不同年份不同地区电网因子版本准确取数；\n- 绿电扣减测试: 验证无绿电单位扣减量为 0，净排放严格等于总排放。"
  },
  {
    "id": "spec-energy-structure",
    "center": "零碳园区集控中心",
    "navGroup": "能耗能效分析",
    "pageName": "用能结构分析",
    "route": "/zero-carbon/energy/structure",
    "component": "components/energy/structure-view.tsx",
    "overview": "全厂多能源介质消费结构与能量流向全景透视中枢。通过 8 大能源介质官方配色甜甜圈图、全厂能流桑基图 (Sankey Diagram) 与介质时序消耗走势，穿透购入、转换、输配至各车间与工序终端的用能结构变化。",
    "subModules": [
      {
        "name": "8大能源介质结构甜甜圈图",
        "desc": "总用电量、市电量、直供绿电、水资源、天然气、蒸汽、油消耗、液氮实物量与折标占比。"
      },
      {
        "name": "全厂能流输送桑基图 (Sankey)",
        "desc": "购入端、转换端、车间配电端、终端用能四级能流拓扑流向与输配损失率。"
      },
      {
        "name": "能源介质消耗时序变化",
        "desc": "各能源品种月度消耗走势，支持堆叠柱状与趋势面积图切换。"
      },
      {
        "name": "高耗能重点车间介质构成",
        "desc": "特高压绕线、气相干燥、立塔挤出等重点车间多能流实物构成明细。"
      },
      {
        "name": "用能结构明细台账",
        "desc": "44px 工业高密表格，展示各车间各介质实物量、折标量及结构比例。"
      }
    ],
    "parameters": [
      {
        "paramCode": "orgUnitId",
        "paramName": "组织工厂ID",
        "category": "入参过滤",
        "dataType": "number",
        "unit": "-",
        "required": true,
        "source": "左侧拓扑树",
        "rangeOrEnum": "1 ~ 9999",
        "description": "查看的目标工厂"
      },
      {
        "paramCode": "periodYear",
        "paramName": "核算年度",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "年度筛选器",
        "rangeOrEnum": "YYYY",
        "description": "分析对比的年度基线"
      },
      {
        "paramCode": "powerSharePct",
        "paramName": "电力能耗占比",
        "category": "核心指标",
        "dataType": "number",
        "unit": "%",
        "required": true,
        "source": "折标结构核算",
        "rangeOrEnum": "40.0 ~ 90.0%",
        "description": "电力在全厂折标综合能耗中的比重"
      },
      {
        "paramCode": "steamSharePct",
        "paramName": "蒸汽能耗占比",
        "category": "核心指标",
        "dataType": "number",
        "unit": "%",
        "required": true,
        "source": "折标结构核算",
        "rangeOrEnum": "5.0 ~ 40.0%",
        "description": "外购蒸汽在折标能耗中的比重"
      },
      {
        "paramCode": "gasSharePct",
        "paramName": "天然气能耗占比",
        "category": "核心指标",
        "dataType": "number",
        "unit": "%",
        "required": true,
        "source": "折标结构核算",
        "rangeOrEnum": "1.0 ~ 20.0%",
        "description": "天然气折标比重"
      },
      {
        "paramCode": "waterTotalTons",
        "paramName": "全厂总用水量",
        "category": "核心指标",
        "dataType": "number",
        "unit": "t",
        "required": true,
        "source": "水表累计",
        "rangeOrEnum": "0 ~ 500,000",
        "description": "工业与生活用水实物量"
      },
      {
        "paramCode": "lossRatePct",
        "paramName": "输配电管网损失率",
        "category": "衍生计算",
        "dataType": "number",
        "unit": "%",
        "required": true,
        "source": "总分表差值对账",
        "rangeOrEnum": "1.0 ~ 10.0%",
        "description": "总表计量与二级分表汇总差额比率"
      }
    ],
    "dataSources": [
      {
        "medium": "全厂8大介质表计底数",
        "sourceType": "SCADA 数据库明细汇总",
        "protocol": "数据库只读视图",
        "device": "全厂分项计量表计集群 (400+ 测点)",
        "tagExample": "DWD_ENERGY_MEDIUM_MONTHLY",
        "frequency": "月度汇总",
        "securityLevel": "L1 (内部级)"
      },
      {
        "medium": "能流管网输配拓扑",
        "sourceType": "系统供用能单线图元数据",
        "protocol": "JSON 拓扑结构",
        "device": "配电一次系统图 & 供汽管网图",
        "tagExample": "SANKEY_PIPELINE_NODES",
        "frequency": "配置维护",
        "securityLevel": "L2 (工作秘密)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "桑基图节点能量守恒校验公式",
        "mathExpression": "\\sum E_{input\\_k} = \\sum E_{output\\_k} + E_{loss\\_k} \\quad (\\text{误差容限 } \\le 3\\%)",
        "variables": [
          {
            "name": "E_{input_k}",
            "desc": "第 k 级节点流入能量总量 (折标煤)",
            "unit": "tce"
          },
          {
            "name": "E_{output_k}",
            "desc": "第 k 级节点分流至下一级支路能量",
            "unit": "tce"
          },
          {
            "name": "E_{loss_k}",
            "desc": "变压器铜铁损或管道热阻损失能量",
            "unit": "tce"
          }
        ],
        "logicDescription": "保证能流从一次购入端流向车间工序端时物理能量守恒，差额自动归集为管网损耗。",
        "boundaryRule": "若某支路损耗率超过 8%，系统自动标注红框警示可能存在表计故障或蒸汽泄漏。"
      }
    ],
    "calculationLogic": "8 大介质标准色：总用电 #2C7CFF、市电 #41C0FF、绿电 #00D492、水 #10C4CE、天然气 #FF6536、蒸汽 #FFBA00、油 #8E73ED、液氮 #4F39F6。彻底消灭紫色蒸汽等旧色值。",
    "dtoSchema": "interface EnergyStructureDTO {\n  orgUnitId: number;\n  period: string;\n  totalTce: number;\n  mediumShares: { medium: string; tce: number; sharePct: number; color: string }[];\n  sankeyData: {\n    nodes: { name: string; category: string }[];\n    links: { source: string; target: string; value: number }[];\n  };\n}",
    "frontendSpecs": "- 严格执行 8 大能源介质官方色彩字典；\n- 彻底清除历史遗留的`{isGroupLevel && <span>当前选中分析项...</span>}`过程联动标签；\n- 44px 工业高密表格。",
    "backendSpecs": "- 接口：`GET /api/v1/zero-carbon/energy/structure`\n- 桑基图数据使用有向无环图 (DAG) 算法递归遍历生成。",
    "qaTestSpecs": "- 能流守恒测试: 验证桑基图流入流出差额与管网损耗严格闭环；\n- 介质色值测试: 验证外购蒸汽严格为金色 #FFBA00，天然气为橙红 #FF6536。"
  },
  {
    "id": "spec-energy-cost",
    "center": "零碳园区集控中心",
    "navGroup": "能耗能效分析",
    "pageName": "能源成本分析",
    "route": "/zero-carbon/energy/cost",
    "component": "components/energy/cost-view.tsx",
    "overview": "企业全品类能源费用支出核算与电价优化决策中枢。深入解构电费（电度电费、容量/需量基本电费、力调电费奖惩）、蒸汽费、燃气费与水费，通过直属经营单位层级下钻与南丁格尔玫瑰图，量化用电峰平谷错峰成本优化潜力。",
    "subModules": [
      {
        "name": "能源费用总额看板",
        "desc": "当期能源总费用 (万元)、电费支出、水气汽支出、万元产值能耗成本 (元/万元)。"
      },
      {
        "name": "电费三部制深度解构",
        "desc": "分时电度电费、基本电费 (按容量/需量核算最优性)、力率电费调整奖励/罚款。"
      },
      {
        "name": "能源介质成本玫瑰图",
        "desc": "南丁格尔玫瑰图直观展现电、水、气、汽费用权重比例。"
      },
      {
        "name": "分时电费优化潜力测算",
        "desc": "测算将 10% 尖峰电量转移至低谷时段可节省的直接电费金额。"
      },
      {
        "name": "车间级能源费用对账单",
        "desc": "44px 工业高密表格，按经营单位与车间明细列支各介质结算金额与同比。"
      }
    ],
    "parameters": [
      {
        "paramCode": "orgUnitId",
        "paramName": "经营单位ID",
        "category": "入参过滤",
        "dataType": "number",
        "unit": "-",
        "required": true,
        "source": "左侧树",
        "rangeOrEnum": "1 ~ 9999",
        "description": "查看的经营单位"
      },
      {
        "paramCode": "billingMonth",
        "paramName": "电费账单月份",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "月份选择器",
        "rangeOrEnum": "YYYY-MM",
        "description": "结算账期"
      },
      {
        "paramCode": "totalCostYuan",
        "paramName": "能源费用总额",
        "category": "核心指标",
        "dataType": "number",
        "unit": "万元",
        "required": true,
        "source": "财务结算汇总",
        "rangeOrEnum": "0 ~ 10,000",
        "description": "全厂各类能源采购与自发综合支出总额"
      },
      {
        "paramCode": "electricityCostYuan",
        "paramName": "总电费支出",
        "category": "核心指标",
        "dataType": "number",
        "unit": "万元",
        "required": true,
        "source": "供电局电费单",
        "rangeOrEnum": "0 ~ 8,000",
        "description": "含电度电费、基本电费与力调电费"
      },
      {
        "paramCode": "basicDemandCost",
        "paramName": "基本电费支出",
        "category": "业务明细",
        "dataType": "number",
        "unit": "万元",
        "required": true,
        "source": "变压器需量/容量合同",
        "rangeOrEnum": "0 ~ 1,000",
        "description": "大工业两部制电价的基本容量费或最大需量费"
      },
      {
        "paramCode": "powerFactorAward",
        "paramName": "力调电费奖惩额",
        "category": "业务明细",
        "dataType": "number",
        "unit": "万元",
        "required": true,
        "source": "功率因数考核换算",
        "rangeOrEnum": "-50.0 ~ +50.0",
        "description": "cosφ ≥ 0.90 奖励（负电费），< 0.90 惩罚追加"
      },
      {
        "paramCode": "costPerOutput",
        "paramName": "万元产值能源成本",
        "category": "衍生计算",
        "dataType": "number",
        "unit": "元/万元",
        "required": true,
        "source": "费用产值比",
        "rangeOrEnum": "50.0 ~ 2,000.0",
        "description": "每万元工业产值消耗的直接能源费用"
      },
      {
        "paramCode": "shiftSavingsPotential",
        "paramName": "错峰转移节电潜力",
        "category": "衍生计算",
        "dataType": "number",
        "unit": "万元/月",
        "required": true,
        "source": "优化测算模型",
        "rangeOrEnum": "0 ~ 200",
        "description": "执行移峰填谷生产调整后预期的月度节支空间"
      }
    ],
    "dataSources": [
      {
        "medium": "供电局正式电费账单",
        "sourceType": "财务发票与电力局营销系统直连",
        "protocol": "电子发票 PDF 解析 / 国网 API",
        "device": "国家电网 95598 营销计费系统",
        "tagExample": "INVOICE_STATE_GRID_BILL",
        "frequency": "每月出账一次",
        "securityLevel": "L3 (核心商密)"
      },
      {
        "medium": "车间分表分时计量",
        "sourceType": "厂内 SCADA 分时计费中间表",
        "protocol": "Modbus-TCP",
        "device": "车间进线多功能电能表",
        "tagExample": "MTR_POWER_SUB_BILL_FLAT",
        "frequency": "每日结存",
        "securityLevel": "L2 (工作秘密)"
      },
      {
        "medium": "当地阶梯电价与气价政策",
        "sourceType": "价格模型配置数据库",
        "protocol": "MySQL 字典表",
        "device": "`t_energy_tariff_config`",
        "tagExample": "TARIFF_PEAK_VALLEY_RATES",
        "frequency": "政府调价时更新",
        "securityLevel": "L1 (内部级)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "力调电费奖惩系数查表核算模型",
        "mathExpression": "\\text{Adjustment} = \\text{TotalActiveCharge} \\times \\lambda(cos\\phi) \\quad (\\text{考核基准 } cos\\phi_{std} = 0.90)",
        "variables": [
          {
            "name": "cos\\phi",
            "desc": "全厂月度加权平均功率因数 (有功电量与无功电量计算)",
            "unit": "-"
          },
          {
            "name": "\\lambda",
            "desc": "力调电费调整系数 (例如 cos\\phi=0.95 奖励 -0.75%, cos\\phi=0.85 惩罚 +2.5%)",
            "unit": "%"
          }
        ],
        "logicDescription": "激励厂区加装无功就地补偿装置，提高电网运行质量，降低无效损耗。",
        "boundaryRule": "无功电表反向倒送无功时，倒送量以 100% 计入无功绝对值参与考核，防止电容过补被罚。"
      },
      {
        "formulaName": "基本电费最优性申报比对 (容量 vs 需量)",
        "mathExpression": "\\text{Cost}_{cap} = C_{trans} \\times P_{cap}, \\quad \\text{Cost}_{demand} = D_{max} \\times P_{demand} \\quad (\\text{按需量核算门槛 } D_{max} \\le 0.68 \\times C_{trans})",
        "variables": [
          {
            "name": "C_{trans}",
            "desc": "工厂全部受电变压器额定总容量",
            "unit": "kVA"
          },
          {
            "name": "D_{max}",
            "desc": "统计期内 15 分钟滑窗最大需量有功功率",
            "unit": "kW"
          },
          {
            "name": "P_{cap}, P_{demand}",
            "desc": "当地物价局核定的容量单价与需量单价",
            "unit": "元/kVA·月, 元/kW·月"
          }
        ],
        "logicDescription": "对比两种申报模式的费用支出，为集控中心管理员提供基本电费降本最优申报建议。",
        "boundaryRule": "若实际最大需量超过核定需量 105% 时，超出部分按 2 倍需量单价加罚，系统自动设置安全冗余告警。"
      }
    ],
    "calculationLogic": "能源成本全面对齐《UI页面修改 (2).pdf》规范，彻底替换掉旧版 Ant Design #1677ff 蓝，统一使用 #2C7CFF。",
    "dtoSchema": "interface EnergyCostDTO {\n  orgUnitId: number;\n  month: string;\n  totalCostYuan: number;\n  costBreakdown: {\n    electricity: number;\n    steam: number;\n    gas: number;\n    water: number;\n  };\n  powerDetails: {\n    sharpCost: number;\n    peakCost: number;\n    flatCost: number;\n    valleyCost: number;\n    basicDemandCost: number;\n    powerFactorAward: number;\n  };\n  optimizationAdvice: string;\n}",
    "frontendSpecs": "- 彻底移除卡片内部冗余的`当前选中分析项`过程提示标签；\n- 44px 工业高密表格；\n- 标准导出按钮 `<ExportButton />` (80x36px)。",
    "backendSpecs": "- 接口：`GET /api/v1/zero-carbon/energy/cost`\n- 电费敏感商密数据实行 L3 权限控制与脱敏展示。",
    "qaTestSpecs": "- 力调电费测试: 验证 cosφ=0.92 时正确计算奖励金额且符号为负；\n- 需量预警测试: 验证当瞬时负荷接近申报需量 95% 时触发超需量预警。"
  },
  {
    "id": "spec-energy-unit-product",
    "center": "零碳园区集控中心",
    "navGroup": "能耗能效分析",
    "pageName": "单位产品能耗",
    "route": "/zero-carbon/energy/unit-product",
    "component": "components/energy/unit-product-view.tsx",
    "overview": "特变电工高端制造装备（主变压器、箱式变电站、中高压电缆、特种电缆、开关柜等）单耗核算与工序穿透分析中枢。按产品订单与生产批次归集关键工序计量，非关键工序按容量加权分摊，严格对标国家先进能耗限额标准 (GB 31335 / GB 31336)，无对应产品单位显示单行干练结论 `暂无相关产品！`。",
    "subModules": [
      {
        "name": "产品大类与产品种类标准字典",
        "desc": "变压器产业（电力变压器/干式变压器/箱变）、电缆产业（超高压电缆/中低压电缆/特种控制线缆）。"
      },
      {
        "name": "型号级单耗核心 KPI",
        "desc": "当前产品单位综合能耗 (tce/万kVA 或 tce/km)、单位电耗 (kWh)、单位蒸汽耗 (t)、同比与标杆偏离度。"
      },
      {
        "name": "工序单耗穿透明细矩阵",
        "desc": "穿透绕线、铁芯叠装、气相干燥、总装试验等关键工序单耗占比与实测值。"
      },
      {
        "name": "产量与能耗相关性散点图",
        "desc": "判定产品规模效应，区分固定用能与变动用能。"
      },
      {
        "name": "空状态极简单行结论",
        "desc": "无产品生产单位（如智慧能源公司）仅输出单行纯文本 `暂无相关产品！`，彻底杜绝大段解释理由。"
      }
    ],
    "parameters": [
      {
        "paramCode": "productCategory",
        "paramName": "产品大类",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "字典选择器",
        "rangeOrEnum": "TRANSFORMER_MAIN | BOX_SUBSTATION | CABLE_HV | CABLE_SPECIAL | SWITCHGEAR",
        "description": "查询的产品工业大类"
      },
      {
        "paramCode": "productModel",
        "paramName": "具体产品型号",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": false,
        "source": "型号检索下拉",
        "rangeOrEnum": "S13-M-1000/10 | YJV22-8.7/15kV 等",
        "description": "精确到产品物料型号"
      },
      {
        "paramCode": "lotNumber",
        "paramName": "生产工单批次号",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": false,
        "source": "工单输入框",
        "rangeOrEnum": "WO-2026-XXXX",
        "description": "指定生产订单批次号"
      },
      {
        "paramCode": "unitProductTce",
        "paramName": "单位产品综合能耗",
        "category": "核心指标",
        "dataType": "number",
        "unit": "tce/万kVA 或 tce/km",
        "required": true,
        "source": "工序归集与分摊核算",
        "rangeOrEnum": "0.10 ~ 50.00",
        "description": "单型号综合折标能耗"
      },
      {
        "paramCode": "unitPowerKwh",
        "paramName": "单位产品综合电耗",
        "category": "核心指标",
        "dataType": "number",
        "unit": "kWh/万kVA 或 kWh/km",
        "required": true,
        "source": "电能归集",
        "rangeOrEnum": "100 ~ 50,000",
        "description": "生产该型号消耗的总电力"
      },
      {
        "paramCode": "unitSteamTon",
        "paramName": "单位产品蒸汽单耗",
        "category": "业务明细",
        "dataType": "number",
        "unit": "t/万kVA",
        "required": true,
        "source": "干燥工序蒸汽计量",
        "rangeOrEnum": "0.0 ~ 20.0",
        "description": "气相干燥等工序消耗蒸汽量"
      },
      {
        "paramCode": "nationalBenchmark",
        "paramName": "国家先进能耗限额",
        "category": "业务明细",
        "dataType": "number",
        "unit": "指标对应单位",
        "required": true,
        "source": "国标限额标准库",
        "rangeOrEnum": "0.10 ~ 40.00",
        "description": "GB 31335/GB 31336 先进标杆限额值"
      },
      {
        "paramCode": "benchmarkVariancePct",
        "paramName": "标杆偏离度",
        "category": "衍生计算",
        "dataType": "number",
        "unit": "%",
        "required": true,
        "source": "与国标限额比对",
        "rangeOrEnum": "-50.0% ~ +100.0%",
        "description": "负值代表优于国家先进标杆"
      }
    ],
    "dataSources": [
      {
        "medium": "SAP ERP 生产工单合格量",
        "sourceType": "SAP PP 模块完工确认",
        "protocol": "RFC 接口 / BAPI",
        "device": "SAP ERP 数据库 `AFPO` 完工入库表",
        "tagExample": "AFPO.WEMNG (入库合格数量)",
        "frequency": "工单入库即时",
        "securityLevel": "L3 (核心商密)"
      },
      {
        "medium": "工序专机电量计量",
        "sourceType": "车间工序多功能表 SCADA",
        "protocol": "Modbus-TCP",
        "device": "绕线机柜 / 干燥炉 / 试验站电表",
        "tagExample": "MTR_PROCESS_WINDING_EP",
        "frequency": "班次结算",
        "securityLevel": "L2 (工作秘密)"
      },
      {
        "medium": "车间公用设施分摊电量",
        "sourceType": "动力车间空压机与照明电表",
        "protocol": "Modbus-TCP",
        "device": "辅助车间干线智能表",
        "tagExample": "MTR_PUBLIC_COMPRESSOR_EP",
        "frequency": "月度汇总",
        "securityLevel": "L1 (内部级)"
      },
      {
        "medium": "国家能耗限额标准库",
        "sourceType": "系统行业标准字典",
        "protocol": "MySQL 字典表",
        "device": "`dim_benchmark_standard`",
        "tagExample": "GB_31335_2024_LIMIT",
        "frequency": "标准颁布更新",
        "securityLevel": "L0 (公开级)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "单型号产品能耗归集与公用分摊数学模型",
        "mathExpression": "e_{product} = \\frac{\\sum_{j=1}^{m} E_{direct,j} + \\sum_{p=1}^{k} (E_{public,p} \\times \\frac{C_{model} \\times Q_{model}}{\\sum (C_r \\times Q_r)})}{Q_{model}}",
        "variables": [
          {
            "name": "E_{direct,j}",
            "desc": "该型号各生产工序专用设备直接消耗能耗 (折标煤)",
            "unit": "tce"
          },
          {
            "name": "E_{public,p}",
            "desc": "空压站、厂房通风照明、循环水泵等公共辅助能耗",
            "unit": "tce"
          },
          {
            "name": "C_{model}",
            "desc": "该产品型号额定设计容量或横截面积定额权重",
            "unit": "kVA 或 mm²"
          },
          {
            "name": "Q_{model}",
            "desc": "该批次实际完成入库的合格产品总数量",
            "unit": "台套 或 km"
          }
        ],
        "logicDescription": "关键工序直接归集，辅助公用能耗按产量与容量权重科学分摊至单台产品。",
        "boundaryRule": "若当期没有该型号产品完工 (Q_model = 0)，系统精准判空显示单行纯文本：`暂无相关产品！`。"
      }
    ],
    "calculationLogic": "严格执行白名单判空规则，无工序或无产品单位严禁编造横向跨厂虚假对抗排名，仅呈现客观自身工况。",
    "dtoSchema": "interface UnitProductEnergyDTO {\n  category: string;\n  model: string;\n  unitConsumptionTce: number;\n  unitPowerKwh: number;\n  unitSteamTon: number;\n  nationalBenchmark: number;\n  variancePct: number;\n  processBreakdown: { processName: string; consumptionTce: number; sharePct: number }[];\n}",
    "frontendSpecs": "- 44px 工业高密表格；\n- 空状态严格单行结论 `暂无相关产品！`，消除冗余理由陈述；\n- 纯客观量化对比，移除主观评价标签。",
    "backendSpecs": "- 接口：`GET /api/v1/zero-carbon/energy/unit-product`\n- 支持按工单号精准追溯底层 4 类介质计量原始批次号。",
    "qaTestSpecs": "- 空状态测试: 切换至智慧能源公司，验证界面仅显示单行'暂无相关产品！'；\n- 分摊系数测试: 验证大中小不同容量变压器公用能耗分摊比例符合设计定额。"
  },
  {
    "id": "spec-energy-unit-output",
    "center": "零碳园区集控中心",
    "navGroup": "能耗能效分析",
    "pageName": "单位产值能耗",
    "route": "/zero-carbon/energy/unit-output",
    "component": "components/energy/unit-output-view.tsx",
    "overview": "企业宏观工业经济效益与综合能耗协调度对标中枢。集中分析万元工业总产值综合能耗、万元工业增加值能耗及万元产值碳排放强度，量化企业“增产不增能”、“绿色高质量发展”战略执行成效。",
    "subModules": [
      {
        "name": "万元产值综合能耗核心 KPI",
        "desc": "全厂万元产值综合能耗当前值 (tce/万元)、同比变动率及集团考核下达基准。"
      },
      {
        "name": "产值与能耗协同脱钩走势",
        "desc": "工业总产值曲线与综合能耗曲线双 Y 轴对比图，直观展现经济增长与能耗脱钩态势。"
      },
      {
        "name": "6大经营单位产值单耗横向对标",
        "desc": "沈变、衡变、新变、鲁缆、德缆、新缆万元产值单耗横向排比与改善幅度。"
      },
      {
        "name": "工业增加值能耗月度估算与年度汇算",
        "desc": "国家工信部与统计局口径工业增加值能耗核算模块。"
      },
      {
        "name": "产值单耗历史明细表",
        "desc": "44px 工业高密表格，按月展示各经营单位工业产值、综合能耗与折标单耗。"
      }
    ],
    "parameters": [
      {
        "paramCode": "orgUnitId",
        "paramName": "经营单位ID",
        "category": "入参过滤",
        "dataType": "number",
        "unit": "-",
        "required": true,
        "source": "左侧组织树",
        "rangeOrEnum": "1 ~ 9999",
        "description": "查看的经营单位"
      },
      {
        "paramCode": "year",
        "paramName": "核算年度",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "年度切换",
        "rangeOrEnum": "YYYY",
        "description": "核算年份"
      },
      {
        "paramCode": "outputValueTenThousand",
        "paramName": "工业总产值",
        "category": "核心指标",
        "dataType": "number",
        "unit": "万元",
        "required": true,
        "source": "财务经营日报",
        "rangeOrEnum": "0 ~ 500,000",
        "description": "企业生产的工业最终产品市场总价值"
      },
      {
        "paramCode": "addedValueTenThousand",
        "paramName": "工业增加值",
        "category": "核心指标",
        "dataType": "number",
        "unit": "万元",
        "required": true,
        "source": "统计局月报",
        "rangeOrEnum": "0 ~ 200,000",
        "description": "总产值扣减中间物料投入后的净增加值"
      },
      {
        "paramCode": "totalTce",
        "paramName": "综合折标能耗总量",
        "category": "核心指标",
        "dataType": "number",
        "unit": "tce",
        "required": true,
        "source": "全厂折标计量",
        "rangeOrEnum": "0 ~ 50,000",
        "description": "同期全部能源消费量"
      },
      {
        "paramCode": "energyPerOutputTce",
        "paramName": "万元产值综合能耗",
        "category": "核心指标",
        "dataType": "number",
        "unit": "tce/万元",
        "required": true,
        "source": "总能耗除以总产值",
        "rangeOrEnum": "0.010 ~ 5.000",
        "description": "核心产值单耗指标"
      },
      {
        "paramCode": "energyPerAddedValueTce",
        "paramName": "万元增加值综合能耗",
        "category": "核心指标",
        "dataType": "number",
        "unit": "tce/万元",
        "required": true,
        "source": "总能耗除以增加值",
        "rangeOrEnum": "0.020 ~ 10.000",
        "description": "国家节能减排法定统计口径指标"
      },
      {
        "paramCode": "decouplingIndex",
        "paramName": "能耗产值脱钩弹性系数",
        "category": "衍生计算",
        "dataType": "number",
        "unit": "-",
        "required": true,
        "source": "增长率比值",
        "rangeOrEnum": "-5.0 ~ +5.0",
        "description": "能耗增长率与产值增长率之比，< 0 为强脱钩"
      }
    ],
    "dataSources": [
      {
        "medium": "工业总产值报表",
        "sourceType": "股份公司经营管理日报系统",
        "protocol": "REST API 定时提取",
        "device": "集团财务经营管控中心",
        "tagExample": "ERP_MONTHLY_OUTPUT_VALUE",
        "frequency": "每月 1 日汇总",
        "securityLevel": "L3 (核心商密)"
      },
      {
        "medium": "全厂综合折标能耗",
        "sourceType": "集控中心能碳核算引擎",
        "protocol": "数据库汇总中间表",
        "device": "能耗数仓核心表 `dwd_total_energy_monthly`",
        "tagExample": "TOTAL_TCE_SUM",
        "frequency": "月度结存",
        "securityLevel": "L1 (内部级)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "万元工业增加值综合能耗核算模型",
        "mathExpression": "e_{nva} = \\frac{E_{total\\_tce}}{G_{added\\_value}} \\quad (\\text{按现价计算})",
        "variables": [
          {
            "name": "E_{total_tce}",
            "desc": "企业全厂报告期综合能耗消费量",
            "unit": "tce"
          },
          {
            "name": "G_{added_value}",
            "desc": "报告期完成的企业工业增加值",
            "unit": "万元"
          }
        ],
        "logicDescription": "用于与省市节能目标责任制评价考核对账，客观反映单位增加值用能水平。",
        "boundaryRule": "若当期发生非正常停产且增加值出现负数时，指标强制告警并置为异常态，禁止计算负能耗。"
      }
    ],
    "calculationLogic": "严禁出现主观褒贬定性词汇，指标卡片纯粹展示量化时序对比与基准偏差量。",
    "dtoSchema": "interface UnitOutputDTO {\n  orgUnitId: number;\n  year: string;\n  metrics: {\n    month: string;\n    outputValueTenThousand: number;\n    totalEnergyTce: number;\n    energyPerOutput: number;\n    energyPerAddedValue: number;\n    yoyRate: number;\n  }[];\n}",
    "frontendSpecs": "- 44px 工业高密数据表格；\n- 纯客观量化时序对比，严禁任何定性评判词；\n- 标准 `<ExportButton />` 导出按钮 (80x36px)。",
    "backendSpecs": "- 接口：`GET /api/v1/zero-carbon/energy/unit-output`\n- 产值敏感数据执行细粒度行级权限过滤。",
    "qaTestSpecs": "- 异常产值测试: 模拟产值为 0 时，系统自动显示 '-' 且不抛出除零异常；\n- 脱钩系数测试: 验证产值上升而能耗下降时，弹性系数准确判定为强脱钩态。"
  },
  {
    "id": "spec-energy-benchmark",
    "center": "零碳园区集控中心",
    "navGroup": "能耗能效分析",
    "pageName": "对标管理",
    "route": "/zero-carbon/energy/benchmark",
    "component": "components/energy/benchmark-view.tsx",
    "overview": "能效对标与节能潜力分析中枢。对接国家重点行业能耗限额标准（GB 31335 / GB 31336）先进值与行业平均基准，开展集团内部 6 大经营单位及重点装备单耗横向排比，客观量化偏离度与节能降碳技术改造潜力空间。",
    "subModules": [
      {
        "name": "国家能效领跑者对标",
        "desc": "变压器能耗限额 (GB 31335)、电线电缆能耗限额 (GB 31336) 先进标杆对比。"
      },
      {
        "name": "经营单位能效排比矩阵",
        "desc": "沈变、衡变、新变、鲁缆、德缆、新缆等综合能耗、产值单耗、工序单耗横向排比。"
      },
      {
        "name": "标杆偏离度矩阵分析",
        "desc": "测算各单位相比行业先进值的正负差距量与偏离百分比。"
      },
      {
        "name": "节能潜力空间动态测算",
        "desc": "量化达标行业先进值后企业可节约的标准煤与经济价值。"
      },
      {
        "name": "能效对标明细台账",
        "desc": "44px 工业高密表格，按行业规范单耗标准客观列支实测值、标杆值与偏差量。"
      }
    ],
    "parameters": [
      {
        "paramCode": "industryType",
        "paramName": "产业类型",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "产业切片下拉",
        "rangeOrEnum": "TRANSFORMER | CABLE | SWITCHGEAR",
        "description": "对标分析所属细分装备制造产业"
      },
      {
        "paramCode": "benchmarkTarget",
        "paramName": "对标基准类型",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "基准切换",
        "rangeOrEnum": "NATIONAL_TOP | INDUSTRY_AVG | GROUP_BEST",
        "description": "国家先进标杆、行业准入基准或集团最优标杆"
      },
      {
        "paramCode": "actualMetricValue",
        "paramName": "当前实际指标值",
        "category": "核心指标",
        "dataType": "number",
        "unit": "指标单位",
        "required": true,
        "source": "核算引擎",
        "rangeOrEnum": "0.1 ~ 1,000",
        "description": "参评单位当前实际指标水平"
      },
      {
        "paramCode": "targetBenchmarkValue",
        "paramName": "对标基准目标值",
        "category": "核心指标",
        "dataType": "number",
        "unit": "指标单位",
        "required": true,
        "source": "标准数据库",
        "rangeOrEnum": "0.1 ~ 800",
        "description": "对应标准规定的能耗限额先进值"
      },
      {
        "paramCode": "varianceRatePct",
        "paramName": "标杆偏离百分比",
        "category": "衍生计算",
        "dataType": "number",
        "unit": "%",
        "required": true,
        "source": "偏离度模型",
        "rangeOrEnum": "-50.0% ~ +100.0%",
        "description": "负值代表由于标杆（领跑），正值代表高耗能"
      },
      {
        "paramCode": "potentialEnergySavingsTce",
        "paramName": "年节能量潜力空间",
        "category": "衍生计算",
        "dataType": "number",
        "unit": "tce/年",
        "required": true,
        "source": "潜力评估模型",
        "rangeOrEnum": "0 ~ 10,000",
        "description": "达到标杆后预期每年可节约的标煤量"
      },
      {
        "paramCode": "potentialCostSavingsYuan",
        "paramName": "年经济效益空间",
        "category": "衍生计算",
        "dataType": "number",
        "unit": "万元/年",
        "required": true,
        "source": "综合单价折算",
        "rangeOrEnum": "0 ~ 1,500",
        "description": "预期节能量对应的综合能源费用节省金额"
      }
    ],
    "dataSources": [
      {
        "medium": "国家能效领跑者限额标准",
        "sourceType": "国家标准规范全文库",
        "protocol": "MySQL 系统标准表",
        "device": "`dim_national_standard_benchmark`",
        "tagExample": "STD_GB31335_LEVEL1",
        "frequency": "标准更新时录入",
        "securityLevel": "L0 (公开级)"
      },
      {
        "medium": "各单位实测单耗数据",
        "sourceType": "集控中心单耗数仓",
        "protocol": "数据库只读视图",
        "device": "`dwd_unit_product_energy`",
        "tagExample": "ACTUAL_UNIT_PRODUCT_TCE",
        "frequency": "月度更新",
        "securityLevel": "L2 (工作秘密)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "能耗标杆偏离度与节能潜力测算模型",
        "mathExpression": "Dev = \\frac{V_{actual} - V_{benchmark}}{V_{benchmark}} \\times 100\\%, \\quad \\Delta E_{savings} = (V_{actual} - V_{benchmark}) \\times Q_{annual\\_production}",
        "variables": [
          {
            "name": "V_{actual}",
            "desc": "参评单位当前实际单位产品或工序单耗",
            "unit": "tce/单位"
          },
          {
            "name": "V_{benchmark}",
            "desc": "对标基准（国家先进限额值）",
            "unit": "tce/单位"
          },
          {
            "name": "Q_{annual_production}",
            "desc": "企业该产品全年设计规划产量",
            "unit": "实物台套或长度"
          }
        ],
        "logicDescription": "通过差距量乘以全年产能规模，精准量化节能技改的技术收益与投资必要性。",
        "boundaryRule": "若实际单耗已优于标杆 (V_actual ≤ V_benchmark)，节能量潜力自动置为 0 并提示处于领跑状态，不出现负节能潜力。"
      }
    ],
    "calculationLogic": "严格遵循客观中立原则，严禁使用'落后单位'、'达标处罚'等主观说教字眼，仅客观陈述量化偏差与基准数值。",
    "dtoSchema": "interface EnergyBenchmarkDTO {\n  industry: string;\n  benchmarks: {\n    indicatorName: string;\n    actualValue: number;\n    benchmarkValue: number;\n    unit: string;\n    variancePct: number;\n    potentialSavingsTce: number;\n  }[];\n}",
    "frontendSpecs": "- 44px 工业高密表格，表头垂直居中；\n- 状态由客观差值自解释，无主观评价标签；\n- 标准 `<ExportButton />` 组件 (80x36px)。",
    "backendSpecs": "- 接口：`GET /api/v1/zero-carbon/energy/benchmark`\n- 标准数据库支持多版本历史溯源对比。",
    "qaTestSpecs": "- 偏离度测试: 验证当实际值正好等于标杆值时，偏离度为 0.0% 且潜力为 0；\n- 导出测试: 验证导出 Excel 表格行高与列名符合规范。"
  },
  {
    "id": "spec-project-archive",
    "center": "零碳园区集控中心",
    "navGroup": "零碳项目评估",
    "pageName": "项目档案管理",
    "route": "/zero-carbon/project/archive",
    "component": "components/project/archive-view.tsx",
    "overview": "园区与工厂节能减排、新能源开发及数字化技改项目的全生命周期数字档案库。集中管理项目立项批复、设备型号技术参数、投资额、预期节能量与设计减排量，支持全生命周期状态流转跟踪。",
    "subModules": [
      {
        "name": "项目全生命周期状态机",
        "desc": "立项申报 ➔ 方案评审 ➔ 工程施工 ➔ 调试试运 ➔ 竣工投运 ➔ 效益评估六阶段闭环流转。"
      },
      {
        "name": "项目多维分类检索",
        "desc": "按项目类别（分布式光伏/电化学储能/空压站节能/余热回收/热泵应用/能碳数字化）与所属园区快捷检索。"
      },
      {
        "name": "技术参数与投资台账",
        "desc": "装机容量 (kWp/kWh)、合同投资额 (万元)、预期年节电量 (万kWh) 及年减碳量 (tCO2e)。"
      },
      {
        "name": "项目关键节点时间轴",
        "desc": "开工日期、并网日期、竣工验收日期与投资回收期里程碑标记。"
      },
      {
        "name": "项目档案明细表",
        "desc": "44px 工业高密表格，支持档案详情弹窗与投资效益报表导出。"
      }
    ],
    "parameters": [
      {
        "paramCode": "projectId",
        "paramName": "项目唯一编码",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "立项生成",
        "rangeOrEnum": "PRJ-2026-XXXX",
        "description": "节能技改项目唯一资产编码"
      },
      {
        "paramCode": "projectType",
        "paramName": "项目类别",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": false,
        "source": "类别下拉",
        "rangeOrEnum": "PV | ESS | HEAT_PUMP | COMPRESSOR | WASTE_HEAT | EMS",
        "description": "技改工程分类"
      },
      {
        "paramCode": "investmentAmountYuan",
        "paramName": "总投资金额",
        "category": "核心指标",
        "dataType": "number",
        "unit": "万元",
        "required": true,
        "source": "合同批复",
        "rangeOrEnum": "1.0 ~ 50,000.0",
        "description": "项目批复总投资概算"
      },
      {
        "paramCode": "expectedAnnualSavingsTce",
        "paramName": "预期年节能量",
        "category": "核心指标",
        "dataType": "number",
        "unit": "tce/年",
        "required": true,
        "source": "可行性研究报告",
        "rangeOrEnum": "10 ~ 10,000",
        "description": "可研报告设计的年节标煤量"
      },
      {
        "paramCode": "expectedAnnualCo2ReductionT",
        "paramName": "预期年减碳量",
        "category": "核心指标",
        "dataType": "number",
        "unit": "tCO2e/年",
        "required": true,
        "source": "可研报告",
        "rangeOrEnum": "20 ~ 20,000",
        "description": "设计年度温室气体减排量"
      },
      {
        "paramCode": "paybackPeriodYears",
        "paramName": "静态投资回收期",
        "category": "衍生计算",
        "dataType": "number",
        "unit": "年",
        "required": true,
        "source": "经济测算模型",
        "rangeOrEnum": "1.0 ~ 15.0",
        "description": "总投资除以年净节能效益"
      },
      {
        "paramCode": "projectLifecycleState",
        "paramName": "全生命周期状态",
        "category": "业务明细",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "工作流驱动",
        "rangeOrEnum": "APPLY | REVIEW | CONSTRUCT | DEBUG | RUNNING | ARCHIVED",
        "description": "项目当前阶段"
      }
    ],
    "dataSources": [
      {
        "medium": "立项批复与商务合同",
        "sourceType": "OA 协同办公系统 / ERP 项目管理模块",
        "protocol": "REST API 流程直连",
        "device": "集团项目审批数据库 `t_project_lifecycle`",
        "tagExample": "OA_PROJECT_APPROVAL_DOC",
        "frequency": "立项时更新",
        "securityLevel": "L3 (核心商密)"
      },
      {
        "medium": "设备铭牌技术参数",
        "sourceType": "设备台账管理系统",
        "protocol": "系统内部同步",
        "device": "设备资产台账表",
        "tagExample": "ASSET_RATED_CAPACITY",
        "frequency": "归档录入",
        "securityLevel": "L2 (工作秘密)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "节能项目静态投资回收期计算",
        "mathExpression": "PBP = \\frac{I_{total}}{B_{annual\\_net}} = \\frac{I_{total}}{\\Delta E_{savings} \\times P_{energy} - C_{om}}",
        "variables": [
          {
            "name": "I_{total}",
            "desc": "项目工程总投资合同额",
            "unit": "万元"
          },
          {
            "name": "B_{annual_net}",
            "desc": "年均净节能经济效益",
            "unit": "万元/年"
          },
          {
            "name": "C_{om}",
            "desc": "年均运维保修与折旧成本支出",
            "unit": "万元/年"
          }
        ],
        "logicDescription": "评估技改投资财务合理性的基础指标，为项目立项决策提供量化依据。",
        "boundaryRule": "若预期年效益 B_annual_net ≤ 0，回收期标记为无效并阻止立项推进。"
      }
    ],
    "calculationLogic": "项目归档档案支持与后续实时监控与效益评估模块主外键关联，实现项目全生命周期穿透。",
    "dtoSchema": "interface ProjectArchiveDTO {\n  projectId: string;\n  name: string;\n  type: string;\n  park: string;\n  investmentAmount: number;\n  expectedAnnualSavingsTce: number;\n  expectedAnnualCo2ReductionT: number;\n  paybackYears: number;\n  state: string;\n}",
    "frontendSpecs": "- 44px 工业高密表格，弹窗表单圆角固定 8px；\n- 标准 `<ExportButton />` 组件 (80x36px)；\n- 状态机采用中立徽章配色，无多余说明性标签。",
    "backendSpecs": "- 接口：`GET /api/v1/zero-carbon/project/archive`\n- 支持大附件（技术方案 PDF）上传至 MinIO 对象存储。",
    "qaTestSpecs": "- 状态流转测试: 验证从立项到投运状态变更时，各阶段时间戳不可逆；\n- 必填校验: 验证投资额与设计节能量为非空数字校验。"
  },
  {
    "id": "spec-project-monitoring",
    "center": "零碳园区集控中心",
    "navGroup": "零碳项目评估",
    "pageName": "实时监控",
    "route": "/zero-carbon/project/monitoring",
    "component": "components/project/monitoring-view.tsx",
    "overview": "在运营节能减排技改项目的高频物理运行工况集中监控。实时监视分布式光伏组串发电效率、储能 PCS 充放电实时功率、变频空压机群实时比功率与余热回收温控状态，及时捕捉设备运行异常与越限工况。",
    "subModules": [
      {
        "name": "已投运项目状态概览",
        "desc": "展示各在运技改项目的实时有功功率、运行工况指示灯与累计运行时长。"
      },
      {
        "name": "项目能效曲线流式监控",
        "desc": "实时刷新瞬时节电功率曲线，并与未改造前的基准功率曲线动态叠加对比。"
      },
      {
        "name": "变频与节能设备实时效率",
        "desc": "监视变频器实时运行频率 (Hz)、电机负荷率及空压机比功率 (kW/(m³/min))。"
      },
      {
        "name": "设备异常预警与状态联锁",
        "desc": "机组过温、过压、低压差等异常工况秒级捕捉与声光弹窗报警。"
      },
      {
        "name": "实时测点数据台账",
        "desc": "44px 工业高密表格，按设备展示实时电压、电流、功率因数、温度及瞬时节能量。"
      }
    ],
    "parameters": [
      {
        "paramCode": "projectId",
        "paramName": "关联项目编码",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "左侧列表",
        "rangeOrEnum": "PRJ-2026-XXXX",
        "description": "当前监控的指定在运行技改项目"
      },
      {
        "paramCode": "realtimeActivePowerKw",
        "paramName": "当前运行功率",
        "category": "核心指标",
        "dataType": "number",
        "unit": "kW",
        "required": true,
        "source": "技改专机电表",
        "rangeOrEnum": "0 ~ 5,000",
        "description": "设备当前的瞬时电功率"
      },
      {
        "paramCode": "realtimeSavingsRateKw",
        "paramName": "瞬时节电功率",
        "category": "核心指标",
        "dataType": "number",
        "unit": "kW",
        "required": true,
        "source": "基准负荷扣减",
        "rangeOrEnum": "0 ~ 1,000",
        "description": "当前相较于基准工况正在节省的功率"
      },
      {
        "paramCode": "runningFrequencyHz",
        "paramName": "变频器运行频率",
        "category": "业务明细",
        "dataType": "number",
        "unit": "Hz",
        "required": false,
        "source": "变频器通信",
        "rangeOrEnum": "0.0 ~ 50.0",
        "description": "电机当前调节工作频率"
      },
      {
        "paramCode": "runningHours",
        "paramName": "累计安全运行时长",
        "category": "业务明细",
        "dataType": "number",
        "unit": "小时",
        "required": true,
        "source": "PLC 内部计时器",
        "rangeOrEnum": "0 ~ 87,600",
        "description": "投运至今累计开机小时数"
      },
      {
        "paramCode": "alarmState",
        "paramName": "实时预警状态",
        "category": "核心指标",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "阈值规则引擎",
        "rangeOrEnum": "NORMAL | WARNING | CRITICAL",
        "description": "当前有无越限故障"
      }
    ],
    "dataSources": [
      {
        "medium": "节能设备独立电能表",
        "sourceType": "配电抽屉物联网电表直采",
        "protocol": "Modbus-TCP",
        "device": "安科瑞导轨式电力仪表",
        "tagExample": "PRJ_METER_KW_INSTANT",
        "frequency": "5 秒遥测",
        "securityLevel": "L1 (内部级)"
      },
      {
        "medium": "节能控制柜 PLC 变量",
        "sourceType": "西门子 S7-1500 / 汇川 PLC",
        "protocol": "Profinet / OPC UA",
        "device": "空压机联控柜 / 变频控制柜",
        "tagExample": "PLC_RUN_FREQ_HZ",
        "frequency": "2 秒",
        "securityLevel": "L2 (工作秘密)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "瞬时节电功率差值核算",
        "mathExpression": "P_{savings}(t) = P_{baseline}(工况) - P_{actual}(t)",
        "variables": [
          {
            "name": "P_{baseline}",
            "desc": "对应相同工况负载下技改前的基准耗电功率",
            "unit": "kW"
          },
          {
            "name": "P_{actual}",
            "desc": "当前改造后节能专机实测运行电功率",
            "unit": "kW"
          }
        ],
        "logicDescription": "通过基准线减去实测功率，秒级呈现节能技改产生的削减出力。",
        "boundaryRule": "若设备空载停机 (P_actual < 1kW)，节电功率强制置为 0，防止把停产错算为节电。"
      }
    ],
    "calculationLogic": "实时数据经由边缘网关缓冲后以 WebSocket 推送至前端页面，保证曲线平滑连续。",
    "dtoSchema": "interface ProjectMonitoringDTO {\n  projectId: string;\n  realtimePowerKw: number;\n  realtimeSavingsKw: number;\n  frequencyHz: number;\n  runningHours: number;\n  alarmLevel: string;\n  telemetryStream: { timestamp: string; powerKw: number; baselineKw: number }[];\n}",
    "frontendSpecs": "- 图表悬停游标微透科技蓝 `rgba(56, 189, 248, 0.08)`；\n- 44px 工业高密表格；\n- 采用 SVG 矢量动画展示水泵与风机运转态势。",
    "backendSpecs": "- 接口：`GET /api/v1/zero-carbon/project/monitoring/stream`\n- 支持 SSE (Server-Sent Events) 高频低开销推送。",
    "qaTestSpecs": "- 停产过滤测试: 模拟设备停机断电，验证节电量不发生虚假累加；\n- 高频推送测试: 持续 1 小时 5s 频次推送，前端无内存泄漏与 DOM 卡顿。"
  },
  {
    "id": "spec-project-benefit",
    "center": "零碳园区集控中心",
    "navGroup": "零碳项目评估",
    "pageName": "项目运行评估",
    "route": "/zero-carbon/project/benefit",
    "component": "components/project/benefit-view.tsx",
    "overview": "特变电工节能降碳四大专项工程（储能、光伏、热泵、空调）运行效益客观评估中枢。依据权威业务规范，评估 Tab 顺序严格遵循【储能运行评估】➔【光伏运行评估】➔【热泵运行评估】➔【空调运行评估】。提供空调制冷机组功率、COP、用电量、供冷量、折算面积单耗能效双环图；热泵运行台账彻底去噪（剥离层高列与多余操作列），严格对比实际节能量与设计基准，量化节能增效收益。",
    "subModules": [
      {
        "name": "四大评估体系标准 Tab",
        "desc": "顺序严格固定为：【储能运行评估】➔【光伏运行评估】➔【热泵运行评估】➔【空调运行评估】。"
      },
      {
        "name": "空调运行评估能效双环图",
        "desc": "MiniStructureDonut 电能来源（市电/绿电/储能）与避峰时段构成双环图，展示 COP、冷机功率、供冷量。"
      },
      {
        "name": "热泵运行台账极简纯化",
        "desc": "彻底剥离建筑层高冗余列与最右侧操作列（层高折算查验），表格列宽舒展自适应。"
      },
      {
        "name": "储能削峰填谷效益测算",
        "desc": "储能电站谷充峰放度电量、实际套利金额、充放循环效率与合同能源管理收益分成。"
      },
      {
        "name": "光伏自发自用收益评估",
        "desc": "光伏本地消纳比例、余电上网电费、直发绿电替代外购火电节省成本核算。"
      },
      {
        "name": "效益评估高密台账",
        "desc": "44px 工业高密表格，空调台账表头纯粹为'COP'，白字白图标标准导出。"
      }
    ],
    "parameters": [
      {
        "paramCode": "evalType",
        "paramName": "评估专项体系",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "评估大 Tab 切换",
        "rangeOrEnum": "ESS | PV | HEAT_PUMP | HVAC_CHILLER",
        "description": "当前评估的工程类别（储能/光伏/热泵/空调）"
      },
      {
        "paramCode": "evalCycle",
        "paramName": "核算周期",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "月份选择器",
        "rangeOrEnum": "YYYY-MM",
        "description": "评估账单月份"
      },
      {
        "paramCode": "copValue",
        "paramName": "空调/热泵系统性能系数 COP",
        "category": "核心指标",
        "dataType": "number",
        "unit": "-",
        "required": true,
        "source": "冷热量与电耗之比",
        "rangeOrEnum": "2.00 ~ 7.00",
        "description": "制冷或供热系统综合能效比"
      },
      {
        "paramCode": "coolingEnergyGj",
        "paramName": "累计供冷量",
        "category": "核心指标",
        "dataType": "number",
        "unit": "GJ 或 万kWh",
        "required": true,
        "source": "水系统能量计",
        "rangeOrEnum": "0 ~ 50,000",
        "description": "空调水系统送出制冷显热与潜热总量"
      },
      {
        "paramCode": "hvacPowerKwh",
        "paramName": "空调机组耗电量",
        "category": "核心指标",
        "dataType": "number",
        "unit": "kWh",
        "required": true,
        "source": "冷机专用电表",
        "rangeOrEnum": "0 ~ 1,000,000",
        "description": "冷水机组、冷却塔、冷冻泵总用电"
      },
      {
        "paramCode": "unitAreaEnergyConsumption",
        "paramName": "单位面积折算单耗",
        "category": "核心指标",
        "dataType": "number",
        "unit": "kWh/m²",
        "required": true,
        "source": "总耗电除以服务面积",
        "rangeOrEnum": "5.0 ~ 120.0",
        "description": "厂房或办公区域单位面积空调能耗"
      },
      {
        "paramCode": "actualSavingsTce",
        "paramName": "核定节标煤量",
        "category": "核心指标",
        "dataType": "number",
        "unit": "tce",
        "required": true,
        "source": "IPMVP 节能量验证",
        "rangeOrEnum": "0 ~ 5,000",
        "description": "与基准期相比核定的实际节约标煤量"
      },
      {
        "paramCode": "economicBenefitYuan",
        "paramName": "综合经济效益",
        "category": "核心指标",
        "dataType": "number",
        "unit": "万元",
        "required": true,
        "source": "电费节省与绿电收益",
        "rangeOrEnum": "0 ~ 500",
        "description": "项目产生的月度实际净财务回报"
      }
    ],
    "dataSources": [
      {
        "medium": "冷水机组与循环水泵电量",
        "sourceType": "空调配电柜智能电表",
        "protocol": "Modbus-TCP",
        "device": "空调机房专线电能表 (APM810)",
        "tagExample": "CHILLER_METER_TOTAL_KWH",
        "frequency": "15 分钟累积",
        "securityLevel": "L1 (内部级)"
      },
      {
        "medium": "空调冷冻水流量与温差",
        "sourceType": "超声波冷热量能量计",
        "protocol": "M-Bus / 4-20mA",
        "device": "管网超声波冷量表 (带有供回水 PT1000 温度传感器)",
        "tagExample": "CHILLER_COOLING_GJ",
        "frequency": "1 分钟采样",
        "securityLevel": "L2 (工作秘密)"
      },
      {
        "medium": "储能充放电计量",
        "sourceType": "储能系统结算表",
        "protocol": "Modbus-TCP",
        "device": "双向电能表",
        "tagExample": "ESS_DISCHARGE_KWH",
        "frequency": "日结算",
        "securityLevel": "L1 (内部级)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "空调/冷水机组综合制冷性能系数 COP 核算",
        "mathExpression": "COP = \\frac{Q_{cooling\\_kw}}{P_{input\\_kw}} = \\frac{L \\times \\Delta T \\times 4.1868}{3600 \\times P_{input\\_kw}}",
        "variables": [
          {
            "name": "L",
            "desc": "冷冻水循环水流量",
            "unit": "t/h 或 m³/h"
          },
          {
            "name": "\\Delta T",
            "desc": "冷冻水供回水温差 (T_{return} - T_{supply})",
            "unit": "°C"
          },
          {
            "name": "P_{input_kw}",
            "desc": "冷水机组及辅助泵组输入的实时总电功率",
            "unit": "kW"
          }
        ],
        "logicDescription": "依据焓差法与水流量温差法，实时精准测算空调机组能源转换效率。",
        "boundaryRule": "机组停运或循环泵断电 (\\Delta T ≤ 0.2°C) 时，COP 自动置空并标记待机，杜绝虚假极值。"
      },
      {
        "formulaName": "单位面积空调耗电量核算模型",
        "mathExpression": "e_{area} = \\frac{E_{hvac\\_power}}{A_{service\\_floor}}",
        "variables": [
          {
            "name": "E_{hvac_power}",
            "desc": "统计期内空调制冷采暖消耗的电量",
            "unit": "kWh"
          },
          {
            "name": "A_{service_floor}",
            "desc": "该空调系统实际覆盖的洁净厂房或建筑有效服务面积",
            "unit": "m²"
          }
        ],
        "logicDescription": "彻底去噪，剔除历史陈旧的'建筑层高'干扰，纯粹以建筑面积作为工业单耗基准标尺。",
        "boundaryRule": "服务面积由建筑平面竣工图锁定为只读参数，严禁前台手工篡改。"
      }
    ],
    "calculationLogic": "1. 评估大 Tab 顺序优化：【储能运行评估】➔【光伏运行评估】➔【热泵运行评估】➔【空调运行评估】；\n2. 热泵与空调运行台账极简纯化：彻底剥离'建筑层高'列，表头'系统 COP'去噪纯化为'COP'；\n3. 热泵台账彻底移除右侧整列操作列，表格舒展自适应。",
    "dtoSchema": "interface ProjectBenefitDTO {\n  evalType: 'ESS' | 'PV' | 'HEAT_PUMP' | 'HVAC_CHILLER';\n  cycle: string;\n  cop: number;\n  coolingGj: number;\n  powerKwh: number;\n  unitAreaKwh: number;\n  actualSavingsTce: number;\n  netBenefitYuan: number;\n  donuts: {\n    powerSourceShare: { gridPct: number; greenPct: number; essPct: number };\n    avoidPeakShare: { sharpPct: number; peakPct: number; flatPct: number };\n  };\n}",
    "frontendSpecs": "- 44px 工业高密表格，热泵台账彻底移除多余操作列；\n- 80x36px 标准白字白图标 `<ExportButton />`；\n- 甜甜圈图采用官方 8 大介质色与 4 段 TOU 分时色标准。",
    "backendSpecs": "- 接口：`GET /api/v1/zero-carbon/project/benefit`\n- 冷量流量计算引入热焓查表算法，消除水温非线性误差。",
    "qaTestSpecs": "- Tab 顺序检查: 验证评估 Tabs 从左到右严格为储能 ➔ 光伏 ➔ 热泵 ➔ 空调；\n- 字段去噪检查: 验证热泵与空调台账中无'建筑层高'列，最右侧无操作按钮列。"
  },
  {
    "id": "spec-project-self",
    "center": "零碳园区集控中心",
    "navGroup": "零碳项目评估",
    "pageName": "零碳工厂自评估",
    "route": "/zero-carbon/project/self",
    "component": "components/project/self-view.tsx",
    "overview": "国家级零碳工厂标准（GB/T 24067 / T/CECA-G 0171）全维度合规性自测与成熟度评价中枢。涵盖合规前置条件、基础设施、能源管理体系、节能减排技术、可再生能源利用与碳中和路径六大维度，自动核算综合得分、生成成熟度雷达图并导出国家标准申报材料。",
    "subModules": [
      {
        "name": "六大维度评估矩阵",
        "desc": "基础设施、能源利用、技术降碳、管理体系、碳抵消与数字化支撑全指标打分。"
      },
      {
        "name": "零碳前置一票否决项核验",
        "desc": "重大安全环保事故、能耗超限额强制核验，不满足直接阻断评级。"
      },
      {
        "name": "综合得分雷达图",
        "desc": "六大维度实测得分与国家五星级零碳工厂标杆值多轴对比雷达图。"
      },
      {
        "name": "短板差距与改进建议清单",
        "desc": "客观列出未拿满分指标项，展示基准差距与对应国家标准条款。"
      },
      {
        "name": "自评估标准台账",
        "desc": "44px 工业高密表格，游标统一为微透科技蓝与微灰，导出标准申报自评报告。"
      }
    ],
    "parameters": [
      {
        "paramCode": "factoryId",
        "paramName": "参评工厂ID",
        "category": "入参过滤",
        "dataType": "number",
        "unit": "-",
        "required": true,
        "source": "组织树",
        "rangeOrEnum": "1 ~ 9999",
        "description": "被评估的单体工厂"
      },
      {
        "paramCode": "evalYear",
        "paramName": "评价年度",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "年度下拉",
        "rangeOrEnum": "YYYY",
        "description": "申报评价的完整自然年度"
      },
      {
        "paramCode": "totalScore",
        "paramName": "自评估综合得分",
        "category": "核心指标",
        "dataType": "number",
        "unit": "分",
        "required": true,
        "source": "六维加权核算",
        "rangeOrEnum": "0.0 ~ 100.0",
        "description": "零碳工厂综合得分"
      },
      {
        "paramCode": "starLevel",
        "paramName": "评定星级等级",
        "category": "核心指标",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "分级判定引擎",
        "rangeOrEnum": "未达标 | 一星级 | 二星级 | 三星级 | 四星级 | 五星级 (领跑)",
        "description": "依据总分判定零碳成熟度等级"
      },
      {
        "paramCode": "compliancePassed",
        "paramName": "前置合规是否全数通过",
        "category": "业务明细",
        "dataType": "boolean",
        "unit": "-",
        "required": true,
        "source": "一票否决核验",
        "rangeOrEnum": "true | false",
        "description": "合规项未全过则不能评星"
      },
      {
        "paramCode": "infrastructureScore",
        "paramName": "基础设施维度得分",
        "category": "业务明细",
        "dataType": "number",
        "unit": "分",
        "required": true,
        "source": "指标评分",
        "rangeOrEnum": "0 ~ 20",
        "description": "绿色建筑、绿色照明、计量器具配备"
      },
      {
        "paramCode": "energyUseScore",
        "paramName": "能源利用维度得分",
        "category": "业务明细",
        "dataType": "number",
        "unit": "分",
        "required": true,
        "source": "指标评分",
        "rangeOrEnum": "0 ~ 30",
        "description": "清洁能源占比、工序能耗限额、余热利用"
      }
    ],
    "dataSources": [
      {
        "medium": "企业自评估申报答卷",
        "sourceType": "Web 填报工作台",
        "protocol": "HTTPS REST API",
        "device": "自评估核算模型矩阵",
        "tagExample": "SELF_EVAL_QUESTIONNAIRE",
        "frequency": "年度填报",
        "securityLevel": "L2 (工作秘密)"
      },
      {
        "medium": "全厂年度能碳核算账本",
        "sourceType": "集控中心年度核算归档",
        "protocol": "数据库只读",
        "device": "`dwd_indicator_yearly`",
        "tagExample": "YEARLY_TOTAL_INDICATORS",
        "frequency": "年度结存",
        "securityLevel": "L2 (工作秘密)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "零碳工厂综合评分加权计算模型",
        "mathExpression": "\\text{Score}_{total} = \\sum_{i=1}^{6} (w_i \\times \\sum_{j=1}^{m_i} s_{ij}) \\quad (\\text{前提: 全部前置合规项 } C_k = 1)",
        "variables": [
          {
            "name": "w_i",
            "desc": "第 i 维度权重 (如能源利用 30%, 碳抵消 20%)",
            "unit": "%"
          },
          {
            "name": "s_{ij}",
            "desc": "第 i 维度第 j 项指标实测得分",
            "unit": "分"
          }
        ],
        "logicDescription": "六大维度分值加权汇总；若任意一项前置合规项为 0，总得分强制归零并阻断评级。",
        "boundaryRule": "星级划分门槛：≥90分 五星级，≥80分 四星级，≥70分 三星级，<60分 未达标。"
      }
    ],
    "calculationLogic": "浅色端游标彻底替换纯白为微灰 `rgba(0, 0, 0, 0.04)`，表格数据行严格补齐 `h-[44px]`，客观展示差距差距量。",
    "dtoSchema": "interface ZeroCarbonSelfEvalDTO {\n  factoryId: number;\n  year: string;\n  totalScore: number;\n  starLevel: string;\n  compliancePassed: boolean;\n  dimensionScores: { dimensionName: string; score: number; fullScore: number }[];\n  gapList: { itemCode: string; itemName: string; gapDescription: string }[];\n}",
    "frontendSpecs": "- 44px 工业高密表格，11 处 tr 行高强制 h-[44px]；\n- 游标浅色微灰，暗黑微透科技蓝 `rgba(56, 189, 248, 0.08)`；\n- 严格客观中立，严禁出现'落后企业需整改'等说教词汇。",
    "backendSpecs": "- 接口：`POST /api/v1/zero-carbon/project/self/evaluate`\n- 自评估打分记录持久化至数据库并生成版本审签历史。",
    "qaTestSpecs": "- 一票否决测试: 模拟设置安全合规项为未通过，验证系统是否强行阻断评级；\n- 满分边界测试: 验证所有项打满分时，系统评级正确输出为五星级。"
  },
  {
    "id": "spec-reports-usage",
    "center": "零碳园区集控中心",
    "navGroup": "统计报表",
    "pageName": "用能报表",
    "route": "/zero-carbon/reports/usage",
    "component": "components/reports/usage-report-view.tsx",
    "overview": "全系统能源消费多维明细报表中心。支持按日、按月、按年生成 8 大能源介质（电、水、气、汽、油、氮等）的高密统计账单，支持按车间与用能单元下钻，配备 80x36px 标准导出按键，满足企业能耗审计、能源管理月报与节能主管部门法定申报需求。",
    "subModules": [
      {
        "name": "报表统计维度选择器",
        "desc": "支持日结报表、月度报表与年度综合报表一键无缝切换。"
      },
      {
        "name": "组织架构级联过滤",
        "desc": "集团 ➔ 经营单位 ➔ 单体工厂 ➔ 生产车间四级逐级过滤汇总。"
      },
      {
        "name": "8大能源介质全景大宽表",
        "desc": "44px 工业高密表格，横向平铺展示各类介质实物量、折标系数及折标煤当量。"
      },
      {
        "name": "合计与小计行自动结存",
        "desc": "表格底部自动结存全厂总计、各类介质小计，支持点击车间行内联展开测点。"
      },
      {
        "name": "标准格式数据导出",
        "desc": "80x36px 标准科技蓝导出按键，一键导出格式化带样式的 Excel (.xlsx) / CSV 文件。"
      }
    ],
    "parameters": [
      {
        "paramCode": "reportDimension",
        "paramName": "统计周期维度",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "单选切换",
        "rangeOrEnum": "DAY | MONTH | YEAR",
        "description": "报表时间粒度"
      },
      {
        "paramCode": "startDate",
        "paramName": "报表起始日期",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "日期选择器",
        "rangeOrEnum": "YYYY-MM-DD 或 YYYY-MM",
        "description": "统计时间窗开始时间"
      },
      {
        "paramCode": "endDate",
        "paramName": "报表结束日期",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "日期选择器",
        "rangeOrEnum": "YYYY-MM-DD 或 YYYY-MM",
        "description": "统计时间窗截止时间"
      },
      {
        "paramCode": "orgUnitId",
        "paramName": "统计组织节点",
        "category": "入参过滤",
        "dataType": "number",
        "unit": "-",
        "required": true,
        "source": "组织级联框",
        "rangeOrEnum": "1 ~ 9999",
        "description": "汇总数据的根组织单元"
      },
      {
        "paramCode": "totalTceSum",
        "paramName": "报表期综合能耗合计",
        "category": "核心指标",
        "dataType": "number",
        "unit": "tce",
        "required": true,
        "source": "报表行汇总累加",
        "rangeOrEnum": "0 ~ 1,000,000",
        "description": "全部参与统计单元的折标煤总和"
      },
      {
        "paramCode": "totalPowerSumKwh",
        "paramName": "总用电量合计",
        "category": "核心指标",
        "dataType": "number",
        "unit": "kWh",
        "required": true,
        "source": "电量列汇总",
        "rangeOrEnum": "0 ~ 100,000,000",
        "description": "总耗电量求和"
      }
    ],
    "dataSources": [
      {
        "medium": "全厂分项计量时序数据库",
        "sourceType": "TDengine / IoTDB 每日汇总表",
        "protocol": "SQL 聚合查询",
        "device": "数仓事实表 `dwd_meter_daily_energy`",
        "tagExample": "METER_ENERGY_DAY_ACC",
        "frequency": "每日 00:00 自动结存",
        "securityLevel": "L1 (内部级)"
      },
      {
        "medium": "车间部门归属关系",
        "sourceType": "企业组织主数据",
        "protocol": "系统字典",
        "device": "`dim_org_structure`",
        "tagExample": "DEPT_HIERARCHY_TREE",
        "frequency": "静态配置",
        "securityLevel": "L1 (内部级)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "报表明细多层级聚合求和模型",
        "mathExpression": "E_{dept\\_total} = \\sum_{j \\in Dept} E_j, \\quad E_{grand\\_total} = \\sum_{k=1}^{n} E_{dept\\_k}",
        "variables": [
          {
            "name": "E_j",
            "desc": "部门内单个测点表计当期累计能量",
            "unit": "各物理实物单位或 tce"
          },
          {
            "name": "E_{dept}",
            "desc": "部门/车间级小计",
            "unit": "实物单位或 tce"
          },
          {
            "name": "E_{grand_total}",
            "desc": "全厂总计汇总值",
            "unit": "tce"
          }
        ],
        "logicDescription": "自底向上逐级求和，杜绝由于表计分级导致的重复统计（仅汇总叶子节点表计）。",
        "boundaryRule": "若某表计当期处于停运维护，差值补齐为 0 并标注备注，禁止产生空指针异常。"
      }
    ],
    "calculationLogic": "报表行高全系统强制为 44px，单元格内容垂直居中，数字统一采用 Mono 等宽字体对齐。",
    "dtoSchema": "interface UsageReportDTO {\n  dimension: 'DAY' | 'MONTH' | 'YEAR';\n  periodLabel: string;\n  rows: {\n    unitName: string;\n    powerKwh: number;\n    waterTons: number;\n    gasM3: number;\n    steamTons: number;\n    oilKg: number;\n    totalTce: number;\n  }[];\n  summary: { totalTce: number; totalPower: number };\n}",
    "frontendSpecs": "- 44px 工业高密表格，严格锁定 h-[44px]；\n- 标准 `<ExportButton />` 组件，尺寸 80px × 36px，圆角 8px，背景色 #2C7CFF；\n- 密集数字采用 Mono 等宽字体右对齐展示。",
    "backendSpecs": "- 接口：`POST /api/v1/zero-carbon/reports/usage/export`\n- Excel 导出使用流式写入 (ExcelJS/EasyExcel)，支持 10 万行大数据量瞬间导出且无内存溢出。",
    "qaTestSpecs": "- 小计与总计校验: 验证各行数据累加和与底部总计行严格相等；\n- 导出测试: 点击导出按钮，验证文件名与下载文件字段完整性。"
  },
  {
    "id": "spec-reports-cost",
    "center": "零碳园区集控中心",
    "navGroup": "统计报表",
    "pageName": "成本报表",
    "route": "/zero-carbon/reports/cost",
    "component": "components/reports/cost-report-view.tsx",
    "overview": "企业能源采购与消费综合财务核算报表。按账单月份生成各经营单位与车间的电费、气费、汽费、水费支出报表，详列尖峰平谷各时段费用分解与万元产值能耗成本，为财务内部结算与生产成本分摊提供权威凭证。",
    "subModules": [
      {
        "name": "财务账期与结算月度筛选",
        "desc": "按财务月度账期（如 2026年08月）筛选全量报表数据。"
      },
      {
        "name": "费用类型多栏分项汇总",
        "desc": "电度电费、容量需量基本电费、力调电费奖惩、天然气费、外购蒸汽费独立成列。"
      },
      {
        "name": "分时电费结构详单",
        "desc": "详列尖峰、高峰、平段、低谷各时段电量与对应电费金额。"
      },
      {
        "name": "车间成本分摊明细表",
        "desc": "44px 工业高密表格，按车间展示分摊比例、费用总额与同期对比。"
      },
      {
        "name": "财务格式报表导出",
        "desc": "标准 80x36px 导出按钮，一键导出含财务凭证科目的标准化对账表格。"
      }
    ],
    "parameters": [
      {
        "paramCode": "billingMonth",
        "paramName": "财务账期月份",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "月份选择框",
        "rangeOrEnum": "YYYY-MM",
        "description": "核算账期"
      },
      {
        "paramCode": "orgUnitId",
        "paramName": "核算组织节点",
        "category": "入参过滤",
        "dataType": "number",
        "unit": "-",
        "required": true,
        "source": "组织选择框",
        "rangeOrEnum": "1 ~ 9999",
        "description": "核算单位"
      },
      {
        "paramCode": "totalAmountYuan",
        "paramName": "能源支出总金额",
        "category": "核心指标",
        "dataType": "number",
        "unit": "万元",
        "required": true,
        "source": "各类介质费用求和",
        "rangeOrEnum": "0 ~ 10,000",
        "description": "全厂当月能源采购总支出"
      },
      {
        "paramCode": "electricityTotalYuan",
        "paramName": "总电费金额",
        "category": "核心指标",
        "dataType": "number",
        "unit": "万元",
        "required": true,
        "source": "电费账单",
        "rangeOrEnum": "0 ~ 8,000",
        "description": "电网购电费用"
      },
      {
        "paramCode": "steamTotalYuan",
        "paramName": "外购蒸汽费用",
        "category": "业务明细",
        "dataType": "number",
        "unit": "万元",
        "required": true,
        "source": "供热对账单",
        "rangeOrEnum": "0 ~ 1,500",
        "description": "工业用蒸汽采购支出"
      },
      {
        "paramCode": "gasTotalYuan",
        "paramName": "天然气总费用",
        "category": "业务明细",
        "dataType": "number",
        "unit": "万元",
        "required": true,
        "source": "燃气账单",
        "rangeOrEnum": "0 ~ 500",
        "description": "燃气费用支出"
      }
    ],
    "dataSources": [
      {
        "medium": "供电局正式电费账单",
        "sourceType": "财务发票与结算清单",
        "protocol": "财务中间表接口",
        "device": "SAP FI 财务核算模块",
        "tagExample": "SAP_FI_POWER_INVOICE",
        "frequency": "月度",
        "securityLevel": "L3 (核心商密)"
      },
      {
        "medium": "分时电价与气价参数表",
        "sourceType": "系统价格模型库",
        "protocol": "MySQL 字典",
        "device": "`t_energy_tariff`",
        "tagExample": "PRICE_CONFIG_PEAK_VALLEY",
        "frequency": "月度",
        "securityLevel": "L1 (内部级)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "车间能源成本分摊计算模型",
        "mathExpression": "C_{workshop\\_i} = \\sum_{m} (Q_{i,m} \\times P_m) + C_{public} \\times \\frac{Output_i}{\\sum Output_k}",
        "variables": [
          {
            "name": "Q_{i,m}",
            "desc": "第 i 车间消耗第 m 种介质实物量",
            "unit": "实物单位"
          },
          {
            "name": "P_m",
            "desc": "第 m 种能源的当期加权平均单价",
            "unit": "元/单位"
          },
          {
            "name": "C_{public}",
            "desc": "全厂公共变电与动力管网基本电费及公摊",
            "unit": "元"
          },
          {
            "name": "Output_i",
            "desc": "第 i 车间完成的生产产值",
            "unit": "万元"
          }
        ],
        "logicDescription": "直接能耗由分表按分时单价直计，公摊电费按产值比例分摊至各车间成本中心。",
        "boundaryRule": "所有车间分摊之和严格等于财务月度采购发票总额，差额做平至分摊尾差。"
      }
    ],
    "calculationLogic": "全部导出按钮强制规范为 80px × 36px，圆角 8px，背景色 #2C7CFF。",
    "dtoSchema": "interface CostReportDTO {\n  billingMonth: string;\n  totalCostYuan: number;\n  rows: {\n    deptName: string;\n    powerCost: number;\n    steamCost: number;\n    gasCost: number;\n    waterCost: number;\n    totalCost: number;\n    yoyDeltaPct: number;\n  }[];\n}",
    "frontendSpecs": "- 44px 工业高密表格，行高严格锁定；\n- 80x36px 标准 `<ExportButton />`；\n- 涉密财务数据行级权限脱敏控制。",
    "backendSpecs": "- 接口：`POST /api/v1/zero-carbon/reports/cost/export`\n- 权限拦截校验 `FINANCE_REPORT_EXPORT` 许可。",
    "qaTestSpecs": "- 导出校验: 验证无导出权限账号导出按钮置灰禁用；\n- 分摊平衡: 验证所有分厂分摊费用之和等于总额。"
  },
  {
    "id": "spec-reports-unit",
    "center": "零碳园区集控中心",
    "navGroup": "统计报表",
    "pageName": "单耗报表",
    "route": "/zero-carbon/reports/unit",
    "component": "components/reports/unit-report-view.tsx",
    "overview": "全产品品类与制造工序单耗明细报表中心。集中列支变压器、电缆、开关柜等产品型号单耗与 47 项关键工序单耗的历史演变，支持超标告警单耗行高亮标注与一键导出，服务于工艺改进与产品碳足迹底层定额测算。",
    "subModules": [
      {
        "name": "产品大类与工序分类筛选",
        "desc": "支持按主变压器、特种电缆、关键工序灵活筛选。"
      },
      {
        "name": "型号级单耗明细报表",
        "desc": "44px 工业高密表格，展示产量、电耗、汽耗、折标单耗与国标限额。"
      },
      {
        "name": "工序级单耗明细报表",
        "desc": "详列绕线、铁芯叠装、真空干燥、拉丝、交联挤出各工序单位产出能耗。"
      },
      {
        "name": "单耗越限基准红黄标识",
        "desc": "超出集团基准 10% 的单耗数据行客观标注，便于工艺专家快速定位。"
      },
      {
        "name": "单耗数据报表导出",
        "desc": "80x36px 标准导出按钮，导出工艺单耗台账供技术中心归档。"
      }
    ],
    "parameters": [
      {
        "paramCode": "categoryType",
        "paramName": "单耗报表类型",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "单选切换",
        "rangeOrEnum": "PRODUCT_UNIT | PROCESS_UNIT",
        "description": "查看产品单耗还是工序单耗"
      },
      {
        "paramCode": "timeCycle",
        "paramName": "统计周期",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "周期选择",
        "rangeOrEnum": "MONTH | QUARTER | YEAR",
        "description": "报表汇总跨度"
      },
      {
        "paramCode": "modelOrProcessName",
        "paramName": "型号/工序名称",
        "category": "业务明细",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "字典映射",
        "rangeOrEnum": "字符串",
        "description": "产品具体型号或工序编码"
      },
      {
        "paramCode": "outputQuantity",
        "paramName": "完工合格数量",
        "category": "核心指标",
        "dataType": "number",
        "unit": "台套 或 km",
        "required": true,
        "source": "MES 完工产量",
        "rangeOrEnum": "0 ~ 10,000",
        "description": "统计期内合格完工总产量"
      },
      {
        "paramCode": "actualUnitTce",
        "paramName": "实际折标单耗",
        "category": "核心指标",
        "dataType": "number",
        "unit": "tce/单位",
        "required": true,
        "source": "能耗除以产量",
        "rangeOrEnum": "0.01 ~ 50.00",
        "description": "实际核算得到的单耗"
      },
      {
        "paramCode": "benchmarkTce",
        "paramName": "考核基准单耗",
        "category": "业务明细",
        "dataType": "number",
        "unit": "tce/单位",
        "required": true,
        "source": "定额标准",
        "rangeOrEnum": "0.01 ~ 40.00",
        "description": "集团下达的工艺单耗考核目标"
      },
      {
        "paramCode": "variancePct",
        "paramName": "偏差百分比",
        "category": "衍生计算",
        "dataType": "number",
        "unit": "%",
        "required": true,
        "source": "偏离度模型",
        "rangeOrEnum": "-50.0% ~ +100.0%",
        "description": "超标或节约比例"
      }
    ],
    "dataSources": [
      {
        "medium": "MES 生产批次完工报工表",
        "sourceType": "MES 数据库中间表",
        "protocol": "REST API",
        "device": "MES 生产报工终端",
        "tagExample": "MES_WORK_ORDER_COMPLETED",
        "frequency": "工单入库即时",
        "securityLevel": "L2 (工作秘密)"
      },
      {
        "medium": "车间工序专用表计计量",
        "sourceType": "SCADA 数据库",
        "protocol": "Modbus-TCP",
        "device": "车间专线分项电表",
        "tagExample": "MTR_PROCESS_USAGE_SUM",
        "frequency": "班次结算",
        "securityLevel": "L1 (内部级)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "工序单位合格产量能耗核算模型",
        "mathExpression": "e_{proc} = \\frac{\\sum E_{process\\_energy}}{Q_{qualified\\_lot}} \\quad (Q_{qualified\\_lot} > 0)",
        "variables": [
          {
            "name": "E_{process_energy}",
            "desc": "工序专用设备电量与蒸汽折标总量",
            "unit": "tce"
          },
          {
            "name": "Q_{qualified_lot}",
            "desc": "该工序质检通过合格转序的物料数量",
            "unit": "台套 或 km"
          }
        ],
        "logicDescription": "单道制造工序专机能耗直采加总，除以合格产量；废品不计入合格分母。",
        "boundaryRule": "若当期没有该型号产品完工 (Q_qualified_lot = 0)，单耗表格行安全显示为 `-`，杜绝抛出 NaN 异常。"
      }
    ],
    "calculationLogic": "严格遵循权威工序白名单，10 家无工序单位精准整行输出单行文本：`暂无相关工序！`。",
    "dtoSchema": "interface UnitReportDTO {\n  category: string;\n  cycle: string;\n  rows: {\n    itemCode: string;\n    itemName: string;\n    outputQty: number;\n    energyTotalTce: number;\n    unitConsumptionTce: number;\n    benchmarkTce: number;\n    variancePct: number;\n  }[];\n}",
    "frontendSpecs": "- 44px 工业高密表格，行高统一锁定；\n- 80x36px 标准 `<ExportButton />`；\n- 10 家无工序单位单行输出 `暂无相关工序！`。",
    "backendSpecs": "- 接口：`POST /api/v1/zero-carbon/reports/unit/export`\n- 支持多表头层级复杂 Excel 模板导出。",
    "qaTestSpecs": "- 白名单排查: 验证无工序单位报表仅展示单行'暂无相关工序！'；\n- 零产量测试: 验证当产量为 0 时，单耗列正常展示 '-'。"
  },
  {
    "id": "spec-config-entry",
    "center": "零碳园区集控中心",
    "navGroup": "基础管理",
    "pageName": "数据录入",
    "route": "/zero-carbon/config/entry",
    "component": "components/config/entry-view.tsx",
    "overview": "全厂无自动化远传表计能源数据、财务产值及物料发票的标准化人工填报工作台。支持化石燃料采购（柴油/外购燃气/原煤）、工业总产值、工业增加值及外部发票附件上传，内置 3 倍标准差防输错校验与多级审核闭环流转。",
    "subModules": [
      {
        "name": "人工填报向导式表单",
        "desc": "按填报周期（月度/年度）与数据项分类（能源消耗/财务产值/物料发票）逐步录入。"
      },
      {
        "name": "发票与过磅凭证上传",
        "desc": "支持发票扫描件、地磅单、出入库单据 PDF/图片上传存证与在线查验。"
      },
      {
        "name": "防输错边界规则拦截引擎",
        "desc": "基于该工厂历史同类数据 3 倍标准差 (±3σ) 动态设置浮动阈值，防止输错数量级。"
      },
      {
        "name": "填报审批流与留痕追溯",
        "desc": "工厂工程师提交 ➔ 分厂厂长复核 ➔ 集团管理员终审三级审批，带不可篡改审计流。"
      },
      {
        "name": "历史填报台账明细表",
        "desc": "44px 工业高密表格，展示历史填报批次、填报人、审核状态与原始附件。"
      }
    ],
    "parameters": [
      {
        "paramCode": "batchId",
        "paramName": "填报批次号",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "系统自动生成",
        "rangeOrEnum": "BATCH-YYYYMM-XXXX",
        "description": "填报批次唯一追溯编号"
      },
      {
        "paramCode": "entryCategory",
        "paramName": "填报数据类别",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "表单分类选择",
        "rangeOrEnum": "FUEL_ENERGY | FINANCIAL_OUTPUT | RAW_MATERIAL | EMISSION_FACTOR",
        "description": "录入数据的业务类别"
      },
      {
        "paramCode": "periodMonth",
        "paramName": "所属统计月份",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "月份选择框",
        "rangeOrEnum": "YYYY-MM",
        "description": "数据对应的结算月份"
      },
      {
        "paramCode": "numericValue",
        "paramName": "录入数值",
        "category": "核心指标",
        "dataType": "number",
        "unit": "依据数据项",
        "required": true,
        "source": "用户输入",
        "rangeOrEnum": "0.001 ~ 10,000,000",
        "description": "实际填报的物理量或金额"
      },
      {
        "paramCode": "invoiceFileUrl",
        "paramName": "佐证发票附件URL",
        "category": "业务明细",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "文件上传组件",
        "rangeOrEnum": "URL 路径",
        "description": "发票凭证文件在 MinIO 上的存储地址"
      },
      {
        "paramCode": "approvalStatus",
        "paramName": "审批流转状态",
        "category": "业务明细",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "审批工作流",
        "rangeOrEnum": "SUBMITTED | APPROVED | REJECTED",
        "description": "待审核、审核通过、打回修改"
      }
    ],
    "dataSources": [
      {
        "medium": "手工采购发票与过磅单",
        "sourceType": "线下实物单据扫描",
        "protocol": "HTTPS 文件上传",
        "device": "企业扫描仪 / 手机拍照上传",
        "tagExample": "INVOICE_IMAGE_PDF",
        "frequency": "月度填报",
        "securityLevel": "L3 (核心商密)"
      },
      {
        "medium": "财务月结产值确认单",
        "sourceType": "财务部门用印盖章报表",
        "protocol": "PDF 上传",
        "device": "财务月报核对凭证",
        "tagExample": "FINANCE_SEALED_REPORT",
        "frequency": "月度填报",
        "securityLevel": "L3 (核心商密)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "输入数值合理性动态阈值拦截模型",
        "mathExpression": "V_{min} = \\max(0, \\mu_{hist} - 3\\sigma_{hist}), \\quad V_{max} = \\mu_{hist} + 3\\sigma_{hist}",
        "variables": [
          {
            "name": "\\mu_{hist}",
            "desc": "该工厂该指标过去 12 个月的历史均值",
            "unit": "指标物理单位"
          },
          {
            "name": "\\sigma_{hist}",
            "desc": "该工厂该指标过去 12 个月的标准差",
            "unit": "指标物理单位"
          }
        ],
        "logicDescription": "防止用户因单位混淆（如吨与千克、万度与度）输错数量级，超出范围时强弹窗二次确认。",
        "boundaryRule": "负数绝对拦截阻断提交；偏离均值超过 200% 时必须填写偏差说明才允许提交审核。"
      }
    ],
    "calculationLogic": "表单输入框宽度统一为 200px × 36px，圆角 8px；表格行高统一固定 44px。",
    "dtoSchema": "interface ManualEntrySubmitReq {\n  factoryId: number;\n  period: string;\n  category: string;\n  itemCode: string;\n  value: number;\n  invoiceUrl: string;\n  remark?: string;\n}\n\ninterface ManualEntryHistoryDTO {\n  batchId: string;\n  submitTime: string;\n  submitter: string;\n  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED';\n  items: { code: string; name: string; value: number; unit: string }[];\n}",
    "frontendSpecs": "- 输入框与下拉框严格锁定 200px × 36px，描边 #E2E8F0，圆角 8px；\n- 44px 工业高密表格，空状态行固定 44px；\n- 提交与导出按钮统一使用规范配色。",
    "backendSpecs": "- 接口：`POST /api/v1/zero-carbon/config/entry/submit`\n- 后端使用 JSR-303 / Zod 二次校验，防止绕过前端拦截越权写入非法负数。",
    "qaTestSpecs": "- 防输错测试: 模拟输入负数或偏离均值 10 倍数值，验证系统弹出阻断拦截；\n- 审批流测试: 验证打回修改后状态正确流转，且历史版本不可篡改。"
  },
  {
    "id": "spec-design-system",
    "center": "零碳园区集控中心",
    "navGroup": "基础管理",
    "pageName": "组件规范库",
    "route": "/design-system",
    "component": "components/design-system/showcase-view.tsx",
    "overview": "特变电工“双中心”专属工业设计规范交互画廊与调用中枢。全量呈现 Design Tokens 调色盘（8大能源介质标准色、4段TOU分时色彩）、44px 工业高密数据表格规范、260px 侧边栏与 30px 拓扑树人机工程、80x36px 导出按钮与表单控件库，提供可一键复制的组件调用代码与色彩字典。",
    "subModules": [
      {
        "name": "Design Tokens 官方调色盘",
        "desc": "主题科技蓝 #2C7CFF、8 大能源介质色、4 段 TOU 分时色，支持 Hex 一键复制。"
      },
      {
        "name": "44px 工业高密表格实操画廊",
        "desc": "全站数据表格行高统一固定 44px (h-[44px]) 演示，数字 Mono 等宽排版。"
      },
      {
        "name": "标准导出按钮与交互控件",
        "desc": "固定 80px × 36px、圆角 8px、背景 #2C7CFF 标准 ExportButton 及 SearchInput、StandardSelect。"
      },
      {
        "name": "组织拓扑树与品牌人机规范",
        "desc": "260px 导航栏、30px 树行高、Logo 与双中心切换胶囊规范演示。"
      },
      {
        "name": "极简克制与客观中立准则",
        "desc": "状态边框自解释演示，空状态单行结论规范，杜绝定性评价词句。"
      }
    ],
    "parameters": [
      {
        "paramCode": "tokenCategory",
        "paramName": "规范类别",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": false,
        "source": "画廊 Tab 切换",
        "rangeOrEnum": "COLOR | TABLE | BUTTON | INPUT | TREE",
        "description": "查看的组件设计规范分类"
      },
      {
        "paramCode": "hexCode",
        "paramName": "标准色值 Hex",
        "category": "业务明细",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "Tokens 常量库",
        "rangeOrEnum": "#2C7CFF | #41C0FF 等",
        "description": "特变电工官方权威色值"
      },
      {
        "paramCode": "tableRowHeightPx",
        "paramName": "表格标准行高",
        "category": "业务明细",
        "dataType": "number",
        "unit": "px",
        "required": true,
        "source": "工业设计规范",
        "rangeOrEnum": "44",
        "description": "全系统数据表格强制 44px 行高"
      },
      {
        "paramCode": "buttonWidthPx",
        "paramName": "导出按钮宽度",
        "category": "业务明细",
        "dataType": "number",
        "unit": "px",
        "required": true,
        "source": "工业设计规范",
        "rangeOrEnum": "80",
        "description": "全系统导出按键统一固定宽度 80px"
      },
      {
        "paramCode": "buttonHeightPx",
        "paramName": "导出按钮高度",
        "category": "业务明细",
        "dataType": "number",
        "unit": "px",
        "required": true,
        "source": "工业设计规范",
        "rangeOrEnum": "36",
        "description": "全系统导出按键统一固定高度 36px"
      }
    ],
    "dataSources": [
      {
        "medium": "官方权威工业设计规范",
        "sourceType": "《UI页面修改 (2).pdf》基准",
        "protocol": "代码常量文件 `tokens.ts`",
        "device": "组件库源码 `components/design-system/`",
        "tagExample": "ENERGY_MEDIA_TOKENS",
        "frequency": "构建期固化",
        "securityLevel": "L0 (公开级)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "工业级无障碍对比度校验算法 (WCAG 2.1 AA)",
        "mathExpression": "Ratio = \\frac{L_1 + 0.05}{L_2 + 0.05} \\ge 4.5:1 \\quad (\\text{正文字号 } 14px)",
        "variables": [
          {
            "name": "L_1, L_2",
            "desc": "前景色与背景色相对亮度 (Relative Luminance)",
            "unit": "-"
          }
        ],
        "logicDescription": "保证全站浅色底色 #F3F7FB 与深色底色下所有文本与图表均具备清晰辨识度。",
        "boundaryRule": "所有组件色彩必须通过 WCAG 2.1 AA 级对比度自动化校验。"
      }
    ],
    "calculationLogic": "组件库在 `components/design-system/index.ts` 集中解构导出，全站业务页面直接引用，严禁散落手写样式。",
    "dtoSchema": "interface DesignSystemGalleryDTO {\n  tokens: {\n    themePrimary: string;\n    energyTokens: Record<string, string>;\n    touTokens: Record<string, string>;\n    dimensions: { tableRowH: number; exportBtnW: number; exportBtnH: number };\n  };\n}",
    "frontendSpecs": "- 双端 100% 同构更新；\n- 点击色块自动复制 Hex 色值至剪贴板；\n- 页面自适应全宽展示。",
    "backendSpecs": "- 纯静态前端展示页面，0 数据库读写开销。",
    "qaTestSpecs": "- 尺寸检查: 验证导出按钮准确渲染为 80x36px，表格行高严格为 44px；\n- 色彩检查: 验证无遗留 Ant Design #1677ff 蓝。"
  },
  {
    "id": "spec-footprint-dashboard",
    "center": "产品碳足迹集采中心",
    "navGroup": "对外示范窗口",
    "pageName": "集团驾驶舱",
    "route": "/carbon-footprint/cockpit",
    "component": "components/carbon-footprint/cockpit-view.tsx",
    "overview": "产品碳足迹集采中心集团级总控驾驶舱。面向集团领导与供应链生态伙伴，呈现全系列变压器与电线电缆产品全生命周期（LCA 摇篮到大门）综合碳强度分布、绿色产品认证覆盖率、CBAM 碳边境税风险敞口及上游供应商碳效梯队。",
    "subModules": [
      {
        "name": "产品碳足迹核心 KPI",
        "desc": "平均产品碳强度 (kgCO2e/kVA)、绿色认证产品占比 (%)、CBAM年出口合规量 (t)、低碳供应链接入率 (%)。"
      },
      {
        "name": "全生命周期碳排桑基流向",
        "desc": "原材料获取 ➔ 关键部件加工 ➔ 厂内总装总试 ➔ 包装仓储 ➔ 运输交付全阶段动态碳流拓扑。"
      },
      {
        "name": "主营产品碳效梯队矩阵",
        "desc": "特高压变压器、配电变压器、特种中高压电缆等主力型号碳足迹排比柱图。"
      },
      {
        "name": "CBAM 欧盟出口关税风险地图",
        "desc": "出口欧盟各港口产品货值、内含碳量 (Embedded Emissions) 与预计碳边境调节税成本测算。"
      },
      {
        "name": "上游关键物料供应商碳梯队",
        "desc": "电工硅钢、电解铜杆、变压器油主要供应商实测碳排因子横向雷达图。"
      },
      {
        "name": "碳足迹持续削减演进趋势",
        "desc": "2024~2026 年各季度单位产品碳足迹降幅曲线与技术减碳贡献分解。"
      }
    ],
    "parameters": [
      {
        "paramCode": "productCategory",
        "paramName": "产品大类",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": false,
        "source": "产品下拉选择",
        "rangeOrEnum": "all | TRANSFORMER | CABLE",
        "description": "筛选特定产品大类，不传默认统计全部装备"
      },
      {
        "paramCode": "timeRange",
        "paramName": "核算年度",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "年",
        "required": true,
        "source": "时间选择器",
        "rangeOrEnum": "2024 | 2025 | 2026",
        "description": "碳足迹与产品交付统计归档年度"
      },
      {
        "paramCode": "avgCarbonIntensity",
        "paramName": "平均产品碳足迹强度",
        "category": "核心指标",
        "dataType": "number",
        "unit": "kgCO2e/kVA",
        "required": true,
        "source": "LCA 动态核算引擎",
        "rangeOrEnum": "0.50 ~ 25.00",
        "description": "所有出厂变压器加权平均每 kVA 容量对应的生命周期碳足迹"
      },
      {
        "paramCode": "greenCertifiedRatePct",
        "paramName": "绿色产品认证覆盖率",
        "category": "核心指标",
        "dataType": "number",
        "unit": "%",
        "required": true,
        "source": "认证台账统计",
        "rangeOrEnum": "0.0 ~ 100.0%",
        "description": "获得国家绿色设计产品或 ISO 14067 认证的型号产值占比"
      },
      {
        "paramCode": "cbamEmbeddedEmissionsT",
        "paramName": "CBAM累计内含碳量",
        "category": "核心指标",
        "dataType": "number",
        "unit": "tCO2e",
        "required": true,
        "source": "CBAM 核算模型",
        "rangeOrEnum": "0 ~ 100,000",
        "description": "出口欧盟监管目录内产品的直接与间接内含碳排放总和"
      },
      {
        "paramCode": "cbamCostExposureYuan",
        "paramName": "CBAM税费敞口预估",
        "category": "核心指标",
        "dataType": "number",
        "unit": "万元",
        "required": true,
        "source": "欧盟碳价测算引擎",
        "rangeOrEnum": "0 ~ 5,000",
        "description": "基于欧盟 EU ETS 碳配额即期价格模拟测算的潜在碳边境关税成本"
      },
      {
        "paramCode": "upstreamSupplierCount",
        "paramName": "低碳供应链接入数",
        "category": "业务明细",
        "dataType": "integer",
        "unit": "家",
        "required": true,
        "source": "供应商门户直连",
        "rangeOrEnum": "0 ~ 500",
        "description": "已向特变电工平台回传真实 EPD 或实测碳因子的上游物料供货商数量"
      },
      {
        "paramCode": "rawMaterialCarbonRatioPct",
        "paramName": "原材料阶段碳排占比",
        "category": "衍生计算",
        "dataType": "number",
        "unit": "%",
        "required": true,
        "source": "LCA 阶段拆解",
        "rangeOrEnum": "70.0% ~ 95.0%",
        "description": "电工硅钢、电解铜等原材料获取阶段在总足迹中的占比"
      }
    ],
    "dataSources": [
      {
        "medium": "产品出厂产量与型号台账",
        "sourceType": "SAP / 用友 ERP 生产完工工单",
        "protocol": "RFC / REST WebService",
        "device": "集团 ERP 生产主数据",
        "tagExample": "ERP_PROD_ORDER_FINISHED_QTY",
        "frequency": "每日凌晨增量同步",
        "securityLevel": "L2 (工作秘密)"
      },
      {
        "medium": "物料清单与批次用量",
        "sourceType": "PLM / PDM 产品生命周期系统",
        "protocol": "JDBC 视图连接",
        "device": "集团 PLM 数据库 `plm_bom_explosion`",
        "tagExample": "PLM_EBOM_MATERIAL_WEIGHT_KG",
        "frequency": "设计版本下发时触发",
        "securityLevel": "L3 (商密级)"
      },
      {
        "medium": "工厂制造实测能耗",
        "sourceType": "集控中心工序计量数仓",
        "protocol": "内部微服务 RPC",
        "device": "集控中心时序数据中台",
        "tagExample": "DWD_PROCESS_POWER_WATER_GAS",
        "frequency": "每小时聚合一次",
        "securityLevel": "L1 (内部级)"
      },
      {
        "medium": "欧盟 EU ETS 即期碳价",
        "sourceType": "欧洲能源交易所 (EEX) 官方行情",
        "protocol": "HTTPS REST API 抓取",
        "device": "外部碳金融数据源接入通道",
        "tagExample": "FIN_EU_ETS_EUA_PRICE_EUR",
        "frequency": "交易日收盘同步",
        "securityLevel": "L0 (公开级)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "产品全生命周期综合碳足迹模型",
        "mathExpression": "CF_{product} = \\sum_{i=1}^{n} (M_i \\times EF_{mat,i}) + \\sum_{j=1}^{m} (E_j \\times EF_{energy,j}) + \\sum_{k=1}^{p} (T_k \\times EF_{trans,k})",
        "variables": [
          {
            "name": "M_i",
            "desc": "生产单台装备消耗第 i 种原材料质量（含损耗）",
            "unit": "kg"
          },
          {
            "name": "EF_{mat,i}",
            "desc": "第 i 种原材料摇篮到大门碳排放因子",
            "unit": "kgCO2e/kg"
          },
          {
            "name": "E_j",
            "desc": "厂内生产总装第 j 种能源消耗量",
            "unit": "kWh 或 m³"
          },
          {
            "name": "EF_{energy,j}",
            "desc": "第 j 种生产能源活动碳排放因子",
            "unit": "kgCO2e/单位"
          },
          {
            "name": "T_k",
            "desc": "第 k 段运输周转量（重量 × 运距）",
            "unit": "t·km"
          },
          {
            "name": "EF_{trans,k}",
            "desc": "对应运输工具碳排放因子",
            "unit": "kgCO2e/(t·km)"
          }
        ],
        "logicDescription": "严格基于 ISO 14067 生命周期边界，归集供应链物料、厂内加工制造及交付物流三大阶段温室气体排放总量。",
        "boundaryRule": "若某物料缺乏实测碳因子，系统优先调用特变电工实景因子库，次优匹配 CLCD 工业库，兜底匹配 Ecoinvent 缺省因子并标记置信度降级。"
      },
      {
        "formulaName": "绿色产品认证产值覆盖率",
        "mathExpression": "R_{cert} = \\frac{\\sum_{m \\in S_{cert}} Y_m}{Y_{total}} \\times 100\\%",
        "variables": [
          {
            "name": "Y_m",
            "desc": "已获得权威认证的第 m 款产品年产值",
            "unit": "万元"
          },
          {
            "name": "Y_{total}",
            "desc": "集团全部在产装备产品总销售产值",
            "unit": "万元"
          }
        ],
        "logicDescription": "评估绿色低碳高端装备在全集团业务盘子中的价值比重，支撑可持续发展 ESG 披露。",
        "boundaryRule": "只有在证书有效期内的产品产值方可计入分子，已过期或处于初审状态的产品强制剔除。"
      }
    ],
    "calculationLogic": "1. 碳强度折算: 总碳足迹量 (kgCO2e) 除以出厂铭牌额定容量 (kVA) 或电缆设计长度 (km)。\n2. 桑基流向矩阵: 按物料输入、工序流转与废料产出构建一阶有向流动网络，总节点守恒平衡率要求 ≥ 99.5%。",
    "dtoSchema": "interface FootprintCockpitDTO {\n  reportingYear: string;\n  kpis: {\n    avgCarbonIntensity: number; // kgCO2e/kVA\n    greenCertCoveragePct: number;\n    cbamEmbeddedEmissionsT: number;\n    cbamCostExposureYuan: number;\n    supplierCount: number;\n  };\n  lcaStages: { stage: string; carbonT: number; ratioPct: number }[];\n  topProducts: { model: string; capacityKva: number; intensity: number }[];\n}",
    "roleGuide": {
      "fe": "1. 桑基图使用 ECharts Sankey 组件，暗黑端链路采用翡翠绿微透渐变；\n2. 44px 工业表格支持点击产品型号联动弹出 LCA 阶段明细抽屉；\n3. 顶部筛选器联动时全卡片骨架屏平滑加载，禁止整页跳白。",
      "be": "1. 碳足迹加权聚合计算耗时较长，采用 Redis 缓存（Key: `cache:footprint:cockpit:{year}:{cat}`，TTL 12h）；\n2. ERP 工单完工消息异步投递至 RocketMQ，削峰批量入库。",
      "qa": "1. 边界测试：当产品总产值 Y_total = 0 时，覆盖率接口须安全返回 0.0% 而非 NaN；\n2. 汇率波动测试：CBAM 欧元兑人民币实时汇率网络异常时的熔断保底策略。"
    },
    "frontendSpecs": "1. 桑基图使用 ECharts Sankey 组件，暗黑端链路采用翡翠绿微透渐变；\n2. 44px 工业表格支持点击产品型号联动弹出 LCA 阶段明细抽屉；\n3. 顶部筛选器联动时全卡片骨架屏平滑加载，禁止整页跳白。",
    "backendSpecs": "1. 碳足迹加权聚合计算耗时较长，采用 Redis 缓存（Key: `cache:footprint:cockpit:{year}:{cat}`，TTL 12h）；\n2. ERP 工单完工消息异步投递至 RocketMQ，削峰批量入库。",
    "qaTestSpecs": "1. 边界测试：当产品总产值 Y_total = 0 时，覆盖率接口须安全返回 0.0% 而非 NaN；\n2. 汇率波动测试：CBAM 欧元兑人民币实时汇率网络异常时的熔断保底策略。"
  },
  {
    "id": "spec-footprint-compare-horizontal",
    "center": "产品碳足迹集采中心",
    "navGroup": "多维分析",
    "pageName": "横向对比",
    "route": "/carbon-footprint/analysis/compare",
    "component": "components/carbon-footprint/compare-horizontal-view.tsx",
    "overview": "同类装备跨生产基地、跨制造工序、跨供方批次的碳足迹横向排比分析。针对 110kV/220kV/500kV 变压器及特种电缆，横向对比沈变、衡变、新变三大基地在同工况设计下的原材料耗用率、干燥工序电耗与碳足迹偏差，定位标杆工艺与降碳空间。",
    "subModules": [
      {
        "name": "对标产品规格选择器",
        "desc": "支持跨厂区同时勾选 2~4 款同电压等级、同容量或同截面的对标产品基线。"
      },
      {
        "name": "LCA 阶段碳足迹横向排比",
        "desc": "并列柱状图展示原材料阶段、厂内加工、总装试验各阶段绝对排放量对比。"
      },
      {
        "name": "关键工艺工序碳效雷达",
        "desc": "铁芯剪切损耗、线圈绕制电耗、真空干燥蒸汽消耗、出厂耐压试验能耗多维对齐。"
      },
      {
        "name": "原材料供应方碳贡献拆解",
        "desc": "对比不同供货商硅钢（宝钢 vs 首钢）与电解铜（江西铜业 vs 铜陵有色）的碳强度差异。"
      },
      {
        "name": "横向对标差异明细台账",
        "desc": "44px 工业高密表格，逐项列示物料消耗定额、能源单耗、碳因子及偏离百分比。"
      }
    ],
    "parameters": [
      {
        "paramCode": "benchmarkProductIds",
        "paramName": "对标产品ID组",
        "category": "入参过滤",
        "dataType": "string[]",
        "unit": "-",
        "required": true,
        "source": "勾选产品列表",
        "rangeOrEnum": "最多选择 4 款产品",
        "description": "选定进行横向对标分析的产品唯一编号组合"
      },
      {
        "paramCode": "standardSpecCode",
        "paramName": "基准规格代号",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "规格切片下拉",
        "rangeOrEnum": "SFZ11-50000/110 | S20-630/10 | YJV22-8.7/15kV",
        "description": "统一对照的工业产品通用规格型号"
      },
      {
        "paramCode": "baselinePlantCode",
        "paramName": "基准对标工厂",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "工厂下拉单选",
        "rangeOrEnum": "SB_BENBU | HB_BENBU | XB_BENBU",
        "description": "作为能效基准线的生产工厂（标杆线）"
      },
      {
        "paramCode": "totalFootprintKg",
        "paramName": "单台总碳足迹",
        "category": "核心指标",
        "dataType": "number",
        "unit": "kgCO2e",
        "required": true,
        "source": "核算引擎",
        "rangeOrEnum": "1,000 ~ 500,000",
        "description": "该工厂生产该型号产品的单台全生命周期温室气体总量"
      },
      {
        "paramCode": "processCarbonKg",
        "paramName": "制造加工阶段碳足迹",
        "category": "核心指标",
        "dataType": "number",
        "unit": "kgCO2e",
        "required": true,
        "source": "工序计量模型",
        "rangeOrEnum": "100 ~ 50,000",
        "description": "厂内生产耗能直接对应的碳排放量"
      },
      {
        "paramCode": "rawMatCarbonKg",
        "paramName": "原材料物料碳足迹",
        "category": "核心指标",
        "dataType": "number",
        "unit": "kgCO2e",
        "required": true,
        "source": "BOM 物料累加",
        "rangeOrEnum": "800 ~ 450,000",
        "description": "BOM 全部外购原料携带的初始碳排放"
      },
      {
        "paramCode": "deviationPct",
        "paramName": "相对标杆偏差率",
        "category": "衍生计算",
        "dataType": "number",
        "unit": "%",
        "required": true,
        "source": "对标计算模型",
        "rangeOrEnum": "-30.0% ~ +50.0%",
        "description": "相对基准工厂的碳足迹偏差比例，负值代表优于基准（更低碳）"
      }
    ],
    "dataSources": [
      {
        "medium": "产品物料清单实际领料单",
        "sourceType": "MES 生产执行系统发料记录",
        "protocol": "SQL 视图只读抽检",
        "device": "各工厂 MES 领料出库模块",
        "tagExample": "MES_ISSUE_REAL_QTY_KG",
        "frequency": "工单完工归档时同步",
        "securityLevel": "L3 (商密级)"
      },
      {
        "medium": "工序级分项电表与蒸汽表",
        "sourceType": "集控中心工序计量网关",
        "protocol": "Modbus-TCP / IEC 61850",
        "device": "车间各重点干燥罐、拉丝机独立表计",
        "tagExample": "METER_DRYING_PROCESS_KWH",
        "frequency": "5 分钟时序采样",
        "securityLevel": "L1 (内部级)"
      },
      {
        "medium": "外购主料供货商碳核查报告",
        "sourceType": "集采中心供应商碳台账",
        "protocol": "SaaS API 接口抓取",
        "device": "特变电工绿色集采平台",
        "tagExample": "SCM_SUPPLIER_EF_VERIFIED",
        "frequency": "供货批次进厂质检录入",
        "securityLevel": "L2 (工作秘密)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "制造工序碳足迹偏差率模型",
        "mathExpression": "\\Delta_{process} = \\frac{CF_{process,target} - CF_{process,base}}{CF_{process,base}} \\times 100\\%",
        "variables": [
          {
            "name": "CF_{process,target}",
            "desc": "待对标工厂该型号制造加工碳足迹",
            "unit": "kgCO2e"
          },
          {
            "name": "CF_{process,base}",
            "desc": "基准标杆工厂该型号制造加工碳足迹",
            "unit": "kgCO2e"
          }
        ],
        "logicDescription": "剔除原材料市场采购波动影响，纯粹聚焦各制造基地自身工艺水平与能源利用效率的横向排比。",
        "boundaryRule": "对标的两款产品铭牌容量公差不得超过 ±5%，否则前端阻断横向排比并弹窗提示规格不可比。"
      }
    ],
    "calculationLogic": "客观横向陈列，严禁使用“落后工厂”等主观定性评价，仅以数据偏差率与柱高自解释。",
    "dtoSchema": "interface ProductHorizontalCompareDTO {\n  benchmarkSpec: string;\n  items: {\n    plantCode: string;\n    plantName: string;\n    productModel: string;\n    totalCarbonKg: number;\n    rawMaterialCarbonKg: number;\n    processCarbonKg: number;\n    deviationPct: number;\n  }[];\n}",
    "roleGuide": {
      "fe": "1. 柱状图悬停游标严格遵循 `rgba(56, 189, 248, 0.08)` 微透科技蓝；\n2. 44px 工业表格支持横向滚动，表头固定且数值列全部采用 Mono 等宽字体。",
      "be": "1. 对标接口支持 `POST /api/v1/carbon-footprint/analysis/compare/batch`，一次性传入多个产品工单号批处理返回结果；\n2. 工艺工序能耗按工单批次物理加权平均归集。",
      "qa": "1. 验证 4 款产品并列对标时在 1366px 屏幕下不发生表头折行错位；\n2. 验证当选择相同工厂的同一产品时，系统提示无法作为对标基准。"
    },
    "frontendSpecs": "1. 柱状图悬停游标严格遵循 `rgba(56, 189, 248, 0.08)` 微透科技蓝；\n2. 44px 工业表格支持横向滚动，表头固定且数值列全部采用 Mono 等宽字体。",
    "backendSpecs": "1. 对标接口支持 `POST /api/v1/carbon-footprint/analysis/compare/batch`，一次性传入多个产品工单号批处理返回结果；\n2. 工艺工序能耗按工单批次物理加权平均归集。",
    "qaTestSpecs": "1. 验证 4 款产品并列对标时在 1366px 屏幕下不发生表头折行错位；\n2. 验证当选择相同工厂的同一产品时，系统提示无法作为对标基准。"
  },
  {
    "id": "spec-footprint-compare-vertical",
    "center": "产品碳足迹集采中心",
    "navGroup": "多维分析",
    "pageName": "纵向对比与总览",
    "route": "/carbon-footprint/analysis/ranking",
    "component": "components/carbon-footprint/compare-vertical-view.tsx",
    "overview": "核心主导产品历年碳足迹演进追溯与全生命周期降碳成效评估。追踪特定系列变压器（如 220kV 级三相油浸式变压器）从 2022 年至今历年单位容量碳排放变化轨迹，客观解构绿电引入、工艺改进、材料轻量化三大降碳贡献度，输出产品碳效等级分布。",
    "subModules": [
      {
        "name": "时间跨度与产品型号筛选",
        "desc": "选择核心追溯型号，支持 3~5 年历史年度演进跨度分析。"
      },
      {
        "name": "历年碳足迹演进曲线",
        "desc": "折线面积图呈现产品单台总碳量及单位容量碳强度 (kgCO2e/kVA) 下降趋势。"
      },
      {
        "name": "降碳动力瀑布归因图",
        "desc": "瀑布图客观解构：绿色电网因子贡献量、厂内光伏绿电消纳贡献、硅钢轻量化贡献、真空干燥温控节能贡献。"
      },
      {
        "name": "产品碳效等级分级矩阵",
        "desc": "依据企业内控标准划分 1 级（领跑）、2 级（先进）、3 级（达标）动态比例分布。"
      },
      {
        "name": "纵向历史追溯明细台账",
        "desc": "44px 工业高密表格，展示各批次产品投产日期、生产工单、核算版本与碳足迹结果。"
      }
    ],
    "parameters": [
      {
        "paramCode": "productSeriesCode",
        "paramName": "产品系列代号",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "产品系列下拉",
        "rangeOrEnum": "TR_110KV_OIL | TR_220KV_OIL | CABLE_MEDIUM_VOLT",
        "description": "需要进行历年纵向追踪的产品标准系列"
      },
      {
        "paramCode": "startYear",
        "paramName": "起始追溯年份",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "年",
        "required": true,
        "source": "年份范围选择",
        "rangeOrEnum": "2021 ~ 2026",
        "description": "纵向分析起始统计年份"
      },
      {
        "paramCode": "endYear",
        "paramName": "截止追溯年份",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "年",
        "required": true,
        "source": "年份范围选择",
        "rangeOrEnum": "2021 ~ 2026",
        "description": "纵向分析截止统计年份"
      },
      {
        "paramCode": "historicalReductionPct",
        "paramName": "历史累计降碳幅度",
        "category": "核心指标",
        "dataType": "number",
        "unit": "%",
        "required": true,
        "source": "演进对比模型",
        "rangeOrEnum": "0.0% ~ 50.0%",
        "description": "截止年份相对起始年份的单位产品碳足迹累计降低比率"
      },
      {
        "paramCode": "greenPowerOffsetContribution",
        "paramName": "绿电消纳降碳贡献量",
        "category": "核心指标",
        "dataType": "number",
        "unit": "tCO2e",
        "required": true,
        "source": "归因模型",
        "rangeOrEnum": "0 ~ 10,000",
        "description": "制造环节自发绿电引入所实现的碳足迹绝对削减量"
      },
      {
        "paramCode": "designOptimizationContribution",
        "paramName": "设计优化降碳贡献量",
        "category": "核心指标",
        "dataType": "number",
        "unit": "tCO2e",
        "required": true,
        "source": "BOM 比对模型",
        "rangeOrEnum": "0 ~ 5,000",
        "description": "通过铁芯小型化、低损耗硅钢替换所达成的物料碳削减量"
      }
    ],
    "dataSources": [
      {
        "medium": "产品历史核算归档版本库",
        "sourceType": "碳足迹核算结果历史版本数仓",
        "protocol": "MySQL 直连查询",
        "device": "`dwd_lca_footprint_history`",
        "tagExample": "LCA_HIST_INTENSITY_VAL",
        "frequency": "按批次归档",
        "securityLevel": "L2 (工作秘密)"
      },
      {
        "medium": "历年产品设计变更记录",
        "sourceType": "PLM 变更工程通知单 (ECN)",
        "protocol": "PLM 接口同步",
        "device": "PLM 工程变更模块",
        "tagExample": "PLM_ECN_WEIGHT_DELTA_KG",
        "frequency": "每月同步",
        "securityLevel": "L3 (商密级)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "产品年度纵向碳足迹削减率模型",
        "mathExpression": "R_{reduction} = \\frac{I_{base\\_year} - I_{current\\_year}}{I_{base\\_year}} \\times 100\\%",
        "variables": [
          {
            "name": "I_{base_year}",
            "desc": "基准年份该系列产品单位容量平均碳足迹",
            "unit": "kgCO2e/kVA"
          },
          {
            "name": "I_{current_year}",
            "desc": "当前年份该系列产品单位容量平均碳足迹",
            "unit": "kgCO2e/kVA"
          }
        ],
        "logicDescription": "评估技术创新、节能技改与低碳供应链在产品迭代周期中的综合减碳成效。",
        "boundaryRule": "若基准年与当前年产品技术标准发生重大变更（如由旧国标 S11 升级至一级能效新国标 S22），需标注标准口径断点。"
      }
    ],
    "calculationLogic": "瀑布图四项拆解之和必须 100% 封闭对齐总削减量，采用 Shapley 边际贡献分配算法消除交互项误差。",
    "dtoSchema": "interface ProductVerticalRankingDTO {\n  seriesCode: string;\n  startYear: string;\n  endYear: string;\n  totalReductionPct: number;\n  yearlyTrend: { year: string; avgIntensity: number; totalVolume: number }[];\n  waterfallBreakdown: { factorName: string; reductionKg: number }[];\n}",
    "roleGuide": {
      "fe": "1. 瀑布图使用正负柱状图实现，正增益与负削减采用系统标准色分类；\n2. 历史演进折线图具备数据点缩放 (DataZoom) 能力。",
      "be": "1. 针对多年跨度的大数据聚合，采用 ClickHouse 分布式聚合表提速；\n2. 严格按工单批次加权，避免算术平均导致的销量权重失真。",
      "qa": "1. 跨度选择单一年份时（如 2025~2025），系统自动提示至少选择 2 个年度进行纵向对比；\n2. 验证数据断点（历史未接入年份）以虚线平滑衔接展示。"
    },
    "frontendSpecs": "1. 瀑布图使用正负柱状图实现，正增益与负削减采用系统标准色分类；\n2. 历史演进折线图具备数据点缩放 (DataZoom) 能力。",
    "backendSpecs": "1. 针对多年跨度的大数据聚合，采用 ClickHouse 分布式聚合表提速；\n2. 严格按工单批次加权，避免算术平均导致的销量权重失真。",
    "qaTestSpecs": "1. 跨度选择单一年份时（如 2025~2025），系统自动提示至少选择 2 个年度进行纵向对比；\n2. 验证数据断点（历史未接入年份）以虚线平滑衔接展示。"
  },
  {
    "id": "spec-footprint-realscene",
    "center": "产品碳足迹集采中心",
    "navGroup": "实景数据库",
    "pageName": "实景数据库",
    "route": "/carbon-footprint/database/realscene",
    "component": "components/carbon-footprint/realscene-view.tsx",
    "overview": "特变电工自主知识产权制造工况实景数据库 (Foreground LCI Database)。收录特变电工在变压器与线缆制造特有工序（取向硅钢剪切、无氧铜杆拉丝、环氧树脂浇注固化、绝缘纸板热压加工、全绝缘真空浸渍）的现场实测活动水平数据，摆脱对国外通用因子的依赖，构建企业数据核心护城河。",
    "subModules": [
      {
        "name": "特种工艺实景因子库检索",
        "desc": "按工艺类型、设备型号、加工工况快速模糊检索企业专属实景排放因子。"
      },
      {
        "name": "工序实景数据质量评级 (DQR)",
        "desc": "按照技术代表性 (TeR)、地理代表性 (GeR)、时间代表性 (TiR)、完整度 (C) 综合评分。"
      },
      {
        "name": "物料产出与损耗平衡模型",
        "desc": "呈现硅钢剪切废边率、铜拉丝模具损耗率与边角料回收返炼碳抵消模型。"
      },
      {
        "name": "实景数据采集测点映射",
        "desc": "将工序实景数据与车间物理表计、传感器 Tag 及 MES 工序报工点实时绑定。"
      },
      {
        "name": "实景因子维护台账",
        "desc": "44px 工业高密表格，维护实景工序代号、单位产品耗能量、实测碳因子、审核状态与生效时间。"
      }
    ],
    "parameters": [
      {
        "paramCode": "processCategory",
        "paramName": "工序分类",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": false,
        "source": "工序树下拉",
        "rangeOrEnum": "all | SILICON_CUT | COPPER_DRAW | VACUUM_DRY | CASTING",
        "description": "工业制造关键工序分类"
      },
      {
        "paramCode": "dqrGrade",
        "paramName": "数据质量等级",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": false,
        "source": "质量等级单选",
        "rangeOrEnum": "all | GRADE_A | GRADE_B | GRADE_C",
        "description": "按照 ISO 14067 DQR 评定体系的质量等级"
      },
      {
        "paramCode": "unitProcessEnergyConsumption",
        "paramName": "工序实测单耗",
        "category": "核心指标",
        "dataType": "number",
        "unit": "kWh/kg 或 m³/t",
        "required": true,
        "source": "实测表计平均值",
        "rangeOrEnum": "0.01 ~ 500.00",
        "description": "处理单位质量工件在该工序直接消耗的电能或蒸汽"
      },
      {
        "paramCode": "processRealEmissionFactor",
        "paramName": "工序实景碳因子",
        "category": "核心指标",
        "dataType": "number",
        "unit": "kgCO2e/kg",
        "required": true,
        "source": "实景模型核算",
        "rangeOrEnum": "0.005 ~ 15.000",
        "description": "综合考虑设备能效与区域绿电后的工序实测排放因子"
      },
      {
        "paramCode": "dqrOverallScore",
        "paramName": "DQR 综合评分",
        "category": "核心指标",
        "dataType": "number",
        "unit": "分",
        "required": true,
        "source": "DQR 算法评定",
        "rangeOrEnum": "1.0 ~ 5.0 (越低质量越优)",
        "description": "国际通用数据质量评级，≤ 1.6 为极高等级 A 级实景数据"
      },
      {
        "paramCode": "scrapRatePct",
        "paramName": "工序材料损耗率",
        "category": "业务明细",
        "dataType": "number",
        "unit": "%",
        "required": true,
        "source": "MES 投产比对",
        "rangeOrEnum": "0.1% ~ 15.0%",
        "description": "加工过程中产生的边角余料占总投料的比例"
      }
    ],
    "dataSources": [
      {
        "medium": "车间关键工序电量表计",
        "sourceType": "物联网 SCADA 系统直采",
        "protocol": "Modbus-TCP / OPC-UA",
        "device": "各车间分项电度表",
        "tagExample": "SCADA_CUT_LINE_PWR_KWH",
        "frequency": "15 分钟连续积分",
        "securityLevel": "L1 (内部级)"
      },
      {
        "medium": "工序实际报工产出重量",
        "sourceType": "MES 工步完工扫码确认",
        "protocol": "REST API",
        "device": "车间工位机 / 工业手持扫码枪 PDA",
        "tagExample": "MES_WORKSTEP_OUTPUT_KG",
        "frequency": "批次实时触发",
        "securityLevel": "L2 (工作秘密)"
      },
      {
        "medium": "车间计量称重地磅与废料返库",
        "sourceType": "WMS 智能仓储管理系统",
        "protocol": "WebService",
        "device": "废料地磅称重传感器",
        "tagExample": "WMS_SCRAP_COPPER_RECV_KG",
        "frequency": "每班次过磅归档",
        "securityLevel": "L2 (工作秘密)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "国际数据质量评级 (DQR) 加权模型",
        "mathExpression": "DQR = \\frac{TeR + GeR + TiR + C + P}{5}",
        "variables": [
          {
            "name": "TeR",
            "desc": "技术代表性评分 (1最优 ~ 5最差)",
            "unit": "分"
          },
          {
            "name": "GeR",
            "desc": "地理代表性评分（厂区特异性）",
            "unit": "分"
          },
          {
            "name": "TiR",
            "desc": "时间代表性评分（数据年限新鲜度）",
            "unit": "分"
          },
          {
            "name": "C",
            "desc": "完整度评分（测点覆盖率）",
            "unit": "分"
          },
          {
            "name": "P",
            "desc": "可靠性与测量仪器铅封精度",
            "unit": "分"
          }
        ],
        "logicDescription": "严格参照欧盟 PEF / ISO 14067 DQR 评价模型，打分在 1.0~1.6 为极优实景数据，可直接免除第三方核查惩罚性因子。",
        "boundaryRule": "若某项评分为空，默认按最劣 5.0 分代入计算，驱动工程师完善现场表计覆盖。"
      }
    ],
    "calculationLogic": "实景因子计算: E_process = (∑ Q_energy × EF_energy) / M_finished_output。废料回收抵扣: 边角料按 95% 替代原生原料折减计入负碳补偿。",
    "dtoSchema": "interface RealSceneDatabaseDTO {\n  processCode: string;\n  processName: string;\n  plantCode: string;\n  unitEnergyConsumption: number;\n  emissionFactor: number;\n  dqrScore: number;\n  dqrLevel: 'A' | 'B' | 'C';\n  status: 'VERIFIED' | 'PENDING';\n}",
    "roleGuide": {
      "fe": "1. DQR 等级采用徽章标签，A 级翡翠绿、B 级科技蓝、C 级琥珀金；\n2. 44px 工业表格支持批量导出 Excel 实景清单格式。",
      "be": "1. 实景数据版本变更需留痕并生成哈希摘要，防止第三方审核时数据被质疑篡改；\n2. 提供根据工厂与工序编码获取最新已认证实景因子的轻量 RPC 接口。",
      "qa": "1. 验证新增实景工序时，DQR 五项评分输入范围限制在 1.0~5.0 之间；\n2. 验证废料回收抵扣率不得超过 100%。"
    },
    "frontendSpecs": "1. DQR 等级采用徽章标签，A 级翡翠绿、B 级科技蓝、C 级琥珀金；\n2. 44px 工业表格支持批量导出 Excel 实景清单格式。",
    "backendSpecs": "1. 实景数据版本变更需留痕并生成哈希摘要，防止第三方审核时数据被质疑篡改；\n2. 提供根据工厂与工序编码获取最新已认证实景因子的轻量 RPC 接口。",
    "qaTestSpecs": "1. 验证新增实景工序时，DQR 五项评分输入范围限制在 1.0~5.0 之间；\n2. 验证废料回收抵扣率不得超过 100%。"
  },
  {
    "id": "spec-footprint-calc",
    "center": "产品碳足迹集采中心",
    "navGroup": "实景数据库",
    "pageName": "碳足迹核算",
    "route": "/carbon-footprint/database/accounting",
    "component": "components/carbon-footprint/accounting-view.tsx",
    "overview": "基于 ISO 14067 / PAS 2050 国际标准的产品碳足迹在线核算与建模工作台。支持从 ERP 生产工单与 PLM 设计 BOM 自动拉取投产结构，通过树状拓扑自动穿透至每一道原材料与工艺步骤，一键触发多源因子匹配与生命周期清单 (LCI) 计算。",
    "subModules": [
      {
        "name": "核算任务与工单选择",
        "desc": "输入生产订单号或选择特定批次产品，加载专属工程 BOM 结构。"
      },
      {
        "name": "LCA 生命周期边界定义",
        "desc": "配置系统边界（摇篮到大门 / 摇篮到坟墓）、截止准则 (Cut-off 1%) 与功能单位 (Functional Unit)。"
      },
      {
        "name": "BOM 物料与因子自动匹配引擎",
        "desc": "智能分词匹配首选特变实景因子、次选国标因子与国际公用因子。"
      },
      {
        "name": "厂内制造能耗分摊计算器",
        "desc": "按产线工时比、设备功率比或产品吨位比分摊公共辅助系统（压缩空气、照明、蒸汽）能耗。"
      },
      {
        "name": "核算结果明细清单与存证",
        "desc": "44px 工业高密表格，展示物料明细、用量、匹配因子、碳排放贡献及不确定度。"
      }
    ],
    "parameters": [
      {
        "paramCode": "workOrderNo",
        "paramName": "生产工单号",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "工单输入/扫码",
        "rangeOrEnum": "WO-2026-SB-00891",
        "description": "唯一关联 ERP 投产批次与完工实物的工单代号"
      },
      {
        "paramCode": "systemBoundary",
        "paramName": "系统边界",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "单选切换",
        "rangeOrEnum": "CRADLE_TO_GATE | CRADLE_TO_GRAVE",
        "description": "摇篮到大门（出厂）或摇篮到坟墓（含使用与报废）"
      },
      {
        "paramCode": "cutoffRulePct",
        "paramName": "忽略截止准则",
        "category": "入参过滤",
        "dataType": "number",
        "unit": "%",
        "required": true,
        "source": "标准设定",
        "rangeOrEnum": "1.0% | 5.0%",
        "description": "低于该重量或环境影响比例且无毒有害的物料允许忽略"
      },
      {
        "paramCode": "totalCarbonEmissionKg",
        "paramName": "产品总碳足迹",
        "category": "核心指标",
        "dataType": "number",
        "unit": "kgCO2e",
        "required": true,
        "source": "LCA 累加计算",
        "rangeOrEnum": "100 ~ 1,000,000",
        "description": "该工单生产实物全生命周期排放的二氧化碳当量"
      },
      {
        "paramCode": "materialStageKg",
        "paramName": "原材料阶段排放",
        "category": "核心指标",
        "dataType": "number",
        "unit": "kgCO2e",
        "required": true,
        "source": "物料因子乘积",
        "rangeOrEnum": "80 ~ 950,000",
        "description": "主要由硅钢、铜、绝缘油构成的上游环境负荷"
      },
      {
        "paramCode": "manufacturingStageKg",
        "paramName": "制造加工阶段排放",
        "category": "核心指标",
        "dataType": "number",
        "unit": "kgCO2e",
        "required": true,
        "source": "车间实测能耗分摊",
        "rangeOrEnum": "20 ~ 50,000",
        "description": "厂内生产总装及出厂试验消耗的电能、天然气与蒸汽"
      },
      {
        "paramCode": "carbonIntensityPerUnit",
        "paramName": "单位功能单元碳强度",
        "category": "核心指标",
        "dataType": "number",
        "unit": "kgCO2e/kVA",
        "required": true,
        "source": "容量归一化",
        "rangeOrEnum": "0.10 ~ 50.00",
        "description": "折算到每 kVA 铭牌容量的碳足迹指标"
      }
    ],
    "dataSources": [
      {
        "medium": "生产工单领料清单 (BOM)",
        "sourceType": "ERP 生产物料模块",
        "protocol": "REST API",
        "device": "集团 ERP 领料明细表 `AFPO`/`RESB`",
        "tagExample": "ERP_WO_ACTUAL_MATERIAL_CONSUMPTION",
        "frequency": "工单下发时载入",
        "securityLevel": "L3 (商密级)"
      },
      {
        "medium": "车间制造工时与分摊系数",
        "sourceType": "MES 生产报工系统",
        "protocol": "SQL 视图",
        "device": "MES 工序工时报表",
        "tagExample": "MES_WORKORDER_MAN_HOUR",
        "frequency": "工单结案时确认",
        "securityLevel": "L2 (工作秘密)"
      },
      {
        "medium": "因子库匹配规则链",
        "sourceType": "集采中心核心因子管理引擎",
        "protocol": "本地内存缓存加载",
        "device": "`dim_carbon_factor_unified`",
        "tagExample": "FACTOR_RESOLVER_PRIORITY",
        "frequency": "计算时动态解析",
        "securityLevel": "L1 (内部级)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "公用工程车间能耗工时分摊模型",
        "mathExpression": "E_{shared,wo} = E_{shop\\_total} \\times \\frac{T_{wo} \\times P_{equip}}{\\sum_{k=1}^{K} (T_k \\times P_k)}",
        "variables": [
          {
            "name": "E_{shop_total}",
            "desc": "车间公用动力（空压/照明/保温）当月总用能",
            "unit": "kWh"
          },
          {
            "name": "T_{wo}",
            "desc": "该工单产品在该车间占用的净工艺加工时长",
            "unit": "小时"
          },
          {
            "name": "P_{equip}",
            "desc": "该工单对应主体加工设备额定功率",
            "unit": "kW"
          }
        ],
        "logicDescription": "克服传统人头分摊的粗放误差，采用能耗负荷-时间积分加权分摊，符合 ISO 14044 物理因果分配准则。",
        "boundaryRule": "若车间为单机专线生产，分摊比率为 100%，不再执行多工单分配。"
      }
    ],
    "calculationLogic": "1. 自动执行 1% 截断准则检查，核对被忽略物料总和不超过 5%；\n2. 因子匹配置信度打分：实景 (100) > 国标 (85) > 行业 (70) > 缺省 (50)。",
    "dtoSchema": "interface FootprintAccountingDTO {\n  workOrderNo: string;\n  productModel: string;\n  functionalUnit: string;\n  totalCarbonKg: number;\n  carbonIntensity: number;\n  breakdown: {\n    materialName: string;\n    weightKg: number;\n    matchedFactorCode: string;\n    factorValue: number;\n    stageCarbonKg: number;\n    sourceType: 'REALSCENE' | 'NATIONAL' | 'INDUSTRY';\n  }[];\n}",
    "roleGuide": {
      "fe": "1. BOM 物料匹配列表提供手动修正因子下拉，用户调整后局部自动重新求和；\n2. 44px 工业表格支持一键按碳排放贡献降序排比（定位碳热点物料）。",
      "be": "1. 核算引擎计算过程生成完整 JSON 快照落库，作为不可篡改审计追踪凭据；\n2. 支持批量工单后台异步核算任务，进度条基于 WebSocket 推送。",
      "qa": "1. 边界测试：截断准则累加超过 5% 时，系统弹窗告警禁止通过；\n2. 验证负碳抵消项（废旧铜料循环利用）计算符号逻辑正确。"
    },
    "frontendSpecs": "1. BOM 物料匹配列表提供手动修正因子下拉，用户调整后局部自动重新求和；\n2. 44px 工业表格支持一键按碳排放贡献降序排比（定位碳热点物料）。",
    "backendSpecs": "1. 核算引擎计算过程生成完整 JSON 快照落库，作为不可篡改审计追踪凭据；\n2. 支持批量工单后台异步核算任务，进度条基于 WebSocket 推送。",
    "qaTestSpecs": "1. 边界测试：截断准则累加超过 5% 时，系统弹窗告警禁止通过；\n2. 验证负碳抵消项（废旧铜料循环利用）计算符号逻辑正确。"
  },
  {
    "id": "spec-footprint-report",
    "center": "产品碳足迹集采中心",
    "navGroup": "实景数据库",
    "pageName": "碳足迹报告",
    "route": "/carbon-footprint/database/report",
    "component": "components/carbon-footprint/report-view.tsx",
    "overview": "权威产品碳足迹核算报告 (LCA Report) 自动化编制与导出中心。严格依照 ISO 14067、ISO 14044 及国家绿色产品评价标准模板，自动合成包含企业资质、产品技术参数、系统边界拓扑、LCI 清单数据、碳热点敏感性分析及碳减排建议方案的标准报告，支持带数字水印与电子签章的 PDF/Word 导出。",
    "subModules": [
      {
        "name": "报告模板库与标准规范选择",
        "desc": "支持 ISO 14067 国际模板、国标绿色设计产品模板及客户定制技术协议模板。"
      },
      {
        "name": "报告章节在线实时预览",
        "desc": "富文本结构化展示执行摘要、编制依据、生命周期清单、敏感度分析及第三方核查说明。"
      },
      {
        "name": "关键指标与敏感性分析图表",
        "desc": "自动嵌入碳足迹阶段饼图、前 5 大碳热点物料条形图与原料价格/碳价波动敏感性曲线。"
      },
      {
        "name": "减碳对策建议智能生成",
        "desc": "基于核算诊断出的高碳工序与物料，自动推荐硅钢减薄、铜铝代换或绿电采购建议。"
      },
      {
        "name": "报告签发与历史归档台账",
        "desc": "44px 工业高密表格，记录报告编号、签发日期、审核专家、下载记录与存证哈希。"
      }
    ],
    "parameters": [
      {
        "paramCode": "reportTemplateId",
        "paramName": "报告模板类型",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "模板下拉",
        "rangeOrEnum": "TPL_ISO14067 | TPL_GB_T24067 | TPL_CBAM_COMMUNICATION",
        "description": "选择编制报告遵循的标准规范版本"
      },
      {
        "paramCode": "accountingTaskId",
        "paramName": "关联核算任务ID",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "核算任务下拉",
        "rangeOrEnum": "TASK-2026-LCA-0881",
        "description": "绑定的已归档产品碳足迹核算任务"
      },
      {
        "paramCode": "watermarkText",
        "paramName": "企业安全水印文本",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": false,
        "source": "系统当前用户自动生成",
        "rangeOrEnum": "特变电工内部机密-工号10882",
        "description": "嵌入导出 PDF 背景的半透明防泄密倾斜文字水印"
      },
      {
        "paramCode": "topHotspotRatioPct",
        "paramName": "首要碳热点贡献率",
        "category": "核心指标",
        "dataType": "number",
        "unit": "%",
        "required": true,
        "source": "敏感度模型",
        "rangeOrEnum": "50.0% ~ 90.0%",
        "description": "前三大物料（通常为电工硅钢与铜杆）累计排放占总足迹的比例"
      },
      {
        "paramCode": "reportPages",
        "paramName": "报告文档总页数",
        "category": "业务明细",
        "dataType": "integer",
        "unit": "页",
        "required": true,
        "source": "排版引擎统计",
        "rangeOrEnum": "15 ~ 60",
        "description": "自动排版生成的正文与附录总页码"
      },
      {
        "paramCode": "exportFormat",
        "paramName": "导出文件格式",
        "category": "业务明细",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "导出按钮选项",
        "rangeOrEnum": "PDF | DOCX",
        "description": "导出为防篡改 PDF 还是供商务二次编辑的 Word"
      }
    ],
    "dataSources": [
      {
        "medium": "碳足迹核算结果数据明细",
        "sourceType": "核算评估引擎快照数据库",
        "protocol": "MySQL 只读事务",
        "device": "`dwd_lca_report_snapshot`",
        "tagExample": "LCA_REPORT_RAW_SNAPSHOT_JSON",
        "frequency": "报告生成时加载",
        "securityLevel": "L2 (工作秘密)"
      },
      {
        "medium": "企业技术资质与第三方检测报告",
        "sourceType": "企业知识中心文件服务器",
        "protocol": "MinIO S3 对象存储",
        "device": "MinIO 企业私有存储集群",
        "tagExample": "DOC_TYPE_TEST_CERTIFICATE_PDF",
        "frequency": "按需下载合并",
        "securityLevel": "L2 (工作秘密)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "碳热点物料敏感度分析模型",
        "mathExpression": "S_i = \\frac{\\partial CF_{total} / CF_{total}}{\\partial M_i / M_i} = \\frac{M_i \\times EF_{mat,i}}{CF_{total}}",
        "variables": [
          {
            "name": "S_i",
            "desc": "第 i 种物料的无量纲敏感度系数",
            "unit": "-"
          },
          {
            "name": "M_i",
            "desc": "第 i 种物料的投入量",
            "unit": "kg"
          },
          {
            "name": "EF_{mat,i}",
            "desc": "第 i 种物料碳排放因子",
            "unit": "kgCO2e/kg"
          }
        ],
        "logicDescription": "反映当某种原材料用量或其因子发生 10% 波动时，总碳足迹产生的相对波动比例，指导工程团队精准抓重点降碳。",
        "boundaryRule": "若 S_i ≥ 0.20，系统强制在报告“减排建议”章节将其列为一级核心管控物料。"
      }
    ],
    "calculationLogic": "敏感度排名前 3 的物料触发自动化降碳建议算法规则库匹配，生成标准化改进措施文本段落。",
    "dtoSchema": "interface FootprintReportDTO {\n  reportId: string;\n  reportCode: string;\n  productModel: string;\n  generatedDate: string;\n  totalCarbonIntensity: number;\n  topHotspots: { name: string; ratioPct: number; sensitivity: number }[];\n  downloadUrlPdf: string;\n  downloadUrlDocx: string;\n}",
    "roleGuide": {
      "fe": "1. 报告预览区采用虚拟化分页组件，支持放大/缩小与目录锚点跳转；\n2. 导出按钮具备 Loading 防重复提交状态，下载完成后触发系统通知。",
      "be": "1. 后端使用 headless Chrome 或 Python python-docx / WeasyPrint 异步渲染导出 PDF，耗时控制在 3 秒以内；\n2. 报告元数据在 Redis 缓存以防高频重复渲染占用 CPU。",
      "qa": "1. 验证下载的 PDF 文档在各版本 Acrobat Reader 中中文不出现乱码且水印平铺正常；\n2. 验证敏感度系数 S_i 在 0~1 之间且各物料敏感度之和为 1.0。"
    },
    "frontendSpecs": "1. 报告预览区采用虚拟化分页组件，支持放大/缩小与目录锚点跳转；\n2. 导出按钮具备 Loading 防重复提交状态，下载完成后触发系统通知。",
    "backendSpecs": "1. 后端使用 headless Chrome 或 Python python-docx / WeasyPrint 异步渲染导出 PDF，耗时控制在 3 秒以内；\n2. 报告元数据在 Redis 缓存以防高频重复渲染占用 CPU。",
    "qaTestSpecs": "1. 验证下载的 PDF 文档在各版本 Acrobat Reader 中中文不出现乱码且水印平铺正常；\n2. 验证敏感度系数 S_i 在 0~1 之间且各物料敏感度之和为 1.0。"
  },
  {
    "id": "spec-footprint-cbam-compliance",
    "center": "产品碳足迹集采中心",
    "navGroup": "CBAM管理",
    "pageName": "合规管理",
    "route": "/carbon-footprint/cbam/compliance",
    "component": "components/carbon-footprint/cbam-compliance-view.tsx",
    "overview": "欧盟碳边境调节机制 (CBAM) 合规状态监控中枢。针对特变电工出口欧盟各成员国的变压器、互感器、电缆等涉税品类（海关 HS Code 8504 / 8544 关联清单），穿透核算直接工艺排放 (Scope 1) 与外购电力间接排放 (Scope 2)，监控前体材料 (Precursors) 真实数据覆盖率，规避欧盟碳关税违约惩罚风险。",
    "subModules": [
      {
        "name": "CBAM 涉税产品出口概览",
        "desc": "统计当年出口欧盟产品批次、报关货值 (EUR)、内含碳排放总量 (tCO2e) 及合规达标率。"
      },
      {
        "name": "直接与间接内含碳排放拆解",
        "desc": "并列柱图区分制造现场燃料燃烧 (Direct) 与生产外购电力 (Indirect) 内含排放强度。"
      },
      {
        "name": "前体材料 (Precursors) 穿透矩阵",
        "desc": "铝材、钢铁、紧固件等上游前体材料碳排放真实数据填报比例与缺省值替换比例。"
      },
      {
        "name": "欧盟碳价波动对税负敞口影响",
        "desc": "动态模拟 EU ETS 碳配额价格在 60~120 欧元/吨区间变动时的潜在碳税支出敞口。"
      },
      {
        "name": "出口产品 CBAM 合规状态台账",
        "desc": "44px 工业高密表格，逐项列示报关单号、HS 编码、出口国别、内含碳排放量、审核状态及风险等级。"
      }
    ],
    "parameters": [
      {
        "paramCode": "hsCode",
        "paramName": "海关 HS 编码",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": false,
        "source": "HS编码选择",
        "rangeOrEnum": "85042300 | 85043400 | 85444921",
        "description": "欧盟 CBAM 监管范围内的涉税电力装备海关商品编码"
      },
      {
        "paramCode": "exportCountry",
        "paramName": "出口目的国",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": false,
        "source": "国家下拉",
        "rangeOrEnum": "GERMANY | NETHERLANDS | FRANCE | ITALY",
        "description": "欧盟 27 个成员国收货目的港国家"
      },
      {
        "paramCode": "totalEmbeddedEmissionsT",
        "paramName": "总内含碳排放量",
        "category": "核心指标",
        "dataType": "number",
        "unit": "tCO2e",
        "required": true,
        "source": "CBAM 专用算法",
        "rangeOrEnum": "0 ~ 50,000",
        "description": "按欧盟法规计算的直接与间接内含温室气体总量"
      },
      {
        "paramCode": "specificDirectEmission",
        "paramName": "单位产品直接内含排放",
        "category": "核心指标",
        "dataType": "number",
        "unit": "tCO2e/t",
        "required": true,
        "source": "工艺核算",
        "rangeOrEnum": "0.01 ~ 2.00",
        "description": "每吨出口产品在制造基地消耗化石燃料直接产生的温室气体"
      },
      {
        "paramCode": "specificIndirectEmission",
        "paramName": "单位产品间接内含排放",
        "category": "核心指标",
        "dataType": "number",
        "unit": "tCO2e/t",
        "required": true,
        "source": "电力因子核算",
        "rangeOrEnum": "0.05 ~ 5.00",
        "description": "每吨出口产品耗用外购电力对应的间接碳排放"
      },
      {
        "paramCode": "realDataRatioPct",
        "paramName": "前体材料真实数据率",
        "category": "核心指标",
        "dataType": "number",
        "unit": "%",
        "required": true,
        "source": "供应商填报统计",
        "rangeOrEnum": "0.0% ~ 100.0%",
        "description": "使用实际测算因子而非欧盟惩罚性缺省值的前体材料价值比例"
      },
      {
        "paramCode": "riskLevel",
        "paramName": "合规风险等级",
        "category": "衍生计算",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "合规风险引擎",
        "rangeOrEnum": "LOW | MEDIUM | HIGH",
        "description": "结合真实数据率与申报时限综合评定的合规风险级别"
      }
    ],
    "dataSources": [
      {
        "medium": "海关报关单与出口商业发票",
        "sourceType": "集团进出口贸易 ERP 模块",
        "protocol": "WebService 接口",
        "device": "贸易进出口管理子系统",
        "tagExample": "TRADE_CUSTOMS_DECLARATION_NO",
        "frequency": "报关放行后同步",
        "securityLevel": "L3 (商密级)"
      },
      {
        "medium": "分厂工艺耗能实测数据",
        "sourceType": "集控中心时序数据库",
        "protocol": "SQL 视图",
        "device": "集控中心工序计量数仓",
        "tagExample": "PLANT_CBAM_DIRECT_FUEL_M3",
        "frequency": "按月归集",
        "securityLevel": "L2 (工作秘密)"
      },
      {
        "medium": "欧盟官方 CBAM 默认缺省因子库",
        "sourceType": "欧盟委员会官方公报数据库",
        "protocol": "系统内置静态表",
        "device": "`dim_cbam_eu_default_factors`",
        "tagExample": "EU_CBAM_DEFAULT_FACTOR_STEEL",
        "frequency": "欧盟更新时维护",
        "securityLevel": "L0 (公开级)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "CBAM 复杂产品内含碳排放量公式",
        "mathExpression": "SEE_g = \\frac{AttrEm_g + \\sum_{i=1}^{n} (M_i \\times SEE_{pre,i})}{AL_g}",
        "variables": [
          {
            "name": "SEE_g",
            "desc": "复杂产品 g 的特定内含碳排放量",
            "unit": "tCO2e/t"
          },
          {
            "name": "AttrEm_g",
            "desc": "生产该产品装置归属的直接/间接排放量",
            "unit": "tCO2e"
          },
          {
            "name": "M_i",
            "desc": "消耗的前体材料 i 净质量",
            "unit": "t"
          },
          {
            "name": "SEE_{pre,i}",
            "desc": "前体材料 i 自身的内含碳排放量",
            "unit": "tCO2e/t"
          },
          {
            "name": "AL_g",
            "desc": "报告期内该产品合格品总产量 (Activity Level)",
            "unit": "t"
          }
        ],
        "logicDescription": "严格执行 Regulation (EU) 2023/956 附录 IV 复杂产品计算逻辑，前体材料内含碳必须全量加权累加。",
        "boundaryRule": "若某前体材料无法获取供应商实测数据，强制采用欧盟官方默认缺省值（通常包含 10%~20% 惩罚性上浮）。"
      }
    ],
    "calculationLogic": "风险评估规则: 真实数据率 < 80% 或临近季度申报截止日前 15 天未完成审核的，标记为 HIGH 风险。",
    "dtoSchema": "interface CbamComplianceDTO {\n  reportingQuarter: string;\n  totalDeclarations: number;\n  totalEmbeddedEmissionsT: number;\n  directRatioPct: number;\n  indirectRatioPct: number;\n  realDataRatioPct: number;\n  highRiskCount: number;\n  items: {\n    declarationNo: string;\n    hsCode: string;\n    productModel: string;\n    destCountry: string;\n    embeddedEmissionT: number;\n    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';\n  }[];\n}",
    "roleGuide": {
      "fe": "1. 风险状态使用专用徽章标签，严禁过度刺眼大红，采用克制告警色；\n2. 44px 工业表格支持点击报关单号一键跳转对应季度申报模拟页。",
      "be": "1. CBAM 内含碳核算引擎与普通 ISO 14067 引擎物理隔离，因为欧盟规约明确要求扣减电网自用电且暂不计入林业碳汇；\n2. 报关单据变化时自动触发内含碳异步重算。",
      "qa": "1. 验证 HS Code 筛选联动时，表格准确过滤出变压器或线缆对应品类；\n2. 验证真实数据率达到 100% 时，风险级别正确收敛至 LOW。"
    },
    "frontendSpecs": "1. 风险状态使用专用徽章标签，严禁过度刺眼大红，采用克制告警色；\n2. 44px 工业表格支持点击报关单号一键跳转对应季度申报模拟页。",
    "backendSpecs": "1. CBAM 内含碳核算引擎与普通 ISO 14067 引擎物理隔离，因为欧盟规约明确要求扣减电网自用电且暂不计入林业碳汇；\n2. 报关单据变化时自动触发内含碳异步重算。",
    "qaTestSpecs": "1. 验证 HS Code 筛选联动时，表格准确过滤出变压器或线缆对应品类；\n2. 验证真实数据率达到 100% 时，风险级别正确收敛至 LOW。"
  },
  {
    "id": "spec-footprint-cbam-declare",
    "center": "产品碳足迹集采中心",
    "navGroup": "CBAM管理",
    "pageName": "申报模拟",
    "route": "/carbon-footprint/cbam/declaration",
    "component": "components/carbon-footprint/cbam-declaration-view.tsx",
    "overview": "欧盟 CBAM 季度通信报告 (Quarterly Communication Report) 模拟填报与标准化 XML/Excel 导出引擎。全真模拟欧盟 CBAM 官方 Transitional Registry 登记平台数据结构，支持前体材料穿透录入、生产装置能效核算、境内已支付有效碳价 (Carbon Price Due) 抵扣测算，并支持一键生成符合欧委会技术规范的 XML 格式报送数据包。",
    "subModules": [
      {
        "name": "申报周期与申报主体配置",
        "desc": "配置填报季度（如 2026-Q1）、欧盟申报人 EORI 编码、生产安装场所代码 (Installation ID)。"
      },
      {
        "name": "安装场所生产工况明细填报",
        "desc": "填报变压器工厂直接排放源（天然气/柴油烘房）与外购电力耗用量。"
      },
      {
        "name": "前体材料 (Precursors) 数据映射",
        "desc": "关联上游供货商提供的钢铁/铝材内含排放凭据及原产国代码。"
      },
      {
        "name": "国内已支付碳价抵扣计算器",
        "desc": "计算企业参与中国全国碳市场或地方碳市场已缴纳的配额履约成本并折减抵扣。"
      },
      {
        "name": "CBAM 申报数据清单与 XML 导出",
        "desc": "44px 工业高密表格，呈现字段代码、欧委会对应 XML 节点、填报值、校验结果及一键导出。"
      }
    ],
    "parameters": [
      {
        "paramCode": "quarterTag",
        "paramName": "申报季度",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "季度下拉",
        "rangeOrEnum": "2026-Q1 | 2026-Q2 | 2026-Q3 | 2026-Q4",
        "description": "欧盟 CBAM 规定的季度申报周期标签"
      },
      {
        "paramCode": "installationId",
        "paramName": "生产装置识别码",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "企业台账",
        "rangeOrEnum": "CN-TBEA-SB-001 | CN-TBEA-HB-002",
        "description": "在欧盟登记备案的特变电工制造基地唯一装置编码"
      },
      {
        "paramCode": "eoriNumber",
        "paramName": "欧盟进口商 EORI 码",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "客户主数据",
        "rangeOrEnum": "DE123456789012345",
        "description": "欧洲采购方在欧盟海关的经济营运者注册和识别号"
      },
      {
        "paramCode": "totalGoodsMassT",
        "paramName": "出口涉税货物总净重",
        "category": "核心指标",
        "dataType": "number",
        "unit": "t",
        "required": true,
        "source": "装箱单累加",
        "rangeOrEnum": "1.0 ~ 5,000.0",
        "description": "当期申报产品实物净重量总和"
      },
      {
        "paramCode": "totalDeclaredCarbonT",
        "paramName": "当期申报总碳排放量",
        "category": "核心指标",
        "dataType": "number",
        "unit": "tCO2e",
        "required": true,
        "source": "模型自动汇聚",
        "rangeOrEnum": "0.1 ~ 10,000.0",
        "description": "需向欧盟正式申报的内含温室气体总量"
      },
      {
        "paramCode": "domesticCarbonPricePaidEur",
        "paramName": "境内已付碳价抵扣额",
        "category": "核心指标",
        "dataType": "number",
        "unit": "EUR",
        "required": false,
        "source": "碳市场履约凭单",
        "rangeOrEnum": "0 ~ 100,000",
        "description": "在原产国根据有效碳定价机制实际支付且未享受出口退税的金额"
      },
      {
        "paramCode": "estimatedCbamCertsNeeded",
        "paramName": "需购买 CBAM 凭证数量",
        "category": "衍生计算",
        "dataType": "number",
        "unit": "张 (相当于tCO2e)",
        "required": true,
        "source": "关税规则模型",
        "rangeOrEnum": "0 ~ 10,000",
        "description": "扣减境内已付碳价后实际需清缴的欧盟 CBAM 证书总数"
      }
    ],
    "dataSources": [
      {
        "medium": "季度出口集装箱装箱净重单",
        "sourceType": "WMS / 国际物流运单系统",
        "protocol": "REST API",
        "device": "物流报关发货台账",
        "tagExample": "LOGISTICS_EXPORT_CONTAINER_NET_WEIGHT",
        "frequency": "装船发运归档",
        "securityLevel": "L3 (商密级)"
      },
      {
        "medium": "分厂当季购售电发票与计量表单",
        "sourceType": "财务 ERP 外购电力台账",
        "protocol": "数据库视图",
        "device": "财务应付管理模块",
        "tagExample": "FIN_ELEC_INVOICE_TOTAL_KWH",
        "frequency": "季度结账录入",
        "securityLevel": "L2 (工作秘密)"
      },
      {
        "medium": "中国全国碳市场 CEA 成交均价",
        "sourceType": "上海环境能源交易所交易公告",
        "protocol": "HTTP 爬取 / 人工录入",
        "device": "碳资产管理子模块",
        "tagExample": "CN_ETS_AVG_PRICE_RMB",
        "frequency": "季度均价结算",
        "securityLevel": "L0 (公开级)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "CBAM 应缴凭证数量与境内碳价折减模型",
        "mathExpression": "N_{certs} = \\max\\left(0, E_{embedded} - \\frac{CP_{paid\\_domestic}}{P_{eu\\_ets}}\\right)",
        "variables": [
          {
            "name": "E_{embedded}",
            "desc": "该批出口货物总内含碳排放量",
            "unit": "tCO2e"
          },
          {
            "name": "CP_{paid_domestic}",
            "desc": "在境内实际已缴纳的碳税或碳配额履约成本折合欧元",
            "unit": "EUR"
          },
          {
            "name": "P_{eu_ets}",
            "desc": "申报季度欧盟 EU ETS 碳配额拍卖平均结算价",
            "unit": "EUR/tCO2e"
          }
        ],
        "logicDescription": "依据 CBAM 法规第 9 条有效碳价抵扣原则，避免国际双重征税，真实降低特变电工出口合规成本。",
        "boundaryRule": "若境内已支付碳价大于或等于欧盟碳价水平，N_certs 取 0，不得产生负凭证（欧盟不退现金）。"
      }
    ],
    "calculationLogic": "XML 数据包结构严格映射欧盟 CBAM XSD 架构定义，所有数值保留 4 位小数，编码格式统一 UTF-8。",
    "dtoSchema": "interface CbamDeclarationDTO {\n  quarter: string;\n  installationId: string;\n  eoriNumber: string;\n  goodsMassT: number;\n  totalCarbonT: number;\n  domesticCarbonDeductionEur: number;\n  cbamCertsNeeded: number;\n  xmlPayloadReady: boolean;\n  downloadUrlXml: string;\n}",
    "roleGuide": {
      "fe": "1. 填报页面提供“格式校验”按钮，点击高亮未填必填项并展示校验报告；\n2. 44px 工业高密表格支持点击单行展开查看对应的 XML 标签节点代码。",
      "be": "1. 后端实现针对欧委会官方 `cbam-communication-v1.xsd` 的强 Schema 校验，校验不通过禁止导出；\n2. XML 生成使用流式写入，避免数万行明细撑爆 JVM 内存。",
      "qa": "1. 使用欧盟官方提供的离线校验工具验证生成的 XML 文件合法性；\n2. 验证境内碳价为 0 时，凭证数量完全等于总内含碳排放量。"
    },
    "frontendSpecs": "1. 填报页面提供“格式校验”按钮，点击高亮未填必填项并展示校验报告；\n2. 44px 工业高密表格支持点击单行展开查看对应的 XML 标签节点代码。",
    "backendSpecs": "1. 后端实现针对欧委会官方 `cbam-communication-v1.xsd` 的强 Schema 校验，校验不通过禁止导出；\n2. XML 生成使用流式写入，避免数万行明细撑爆 JVM 内存。",
    "qaTestSpecs": "1. 使用欧盟官方提供的离线校验工具验证生成的 XML 文件合法性；\n2. 验证境内碳价为 0 时，凭证数量完全等于总内含碳排放量。"
  },
  {
    "id": "spec-footprint-cbam-kb",
    "center": "产品碳足迹集采中心",
    "navGroup": "CBAM管理",
    "pageName": "知识库",
    "route": "/carbon-footprint/cbam/knowledge",
    "component": "components/carbon-footprint/cbam-knowledge-view.tsx",
    "overview": "欧盟 CBAM 法规条款、官方技术指南、行业缺省基准值及企业实操应对案例中枢。收录 Regulation (EU) 2023/956 正式文本、欧委会过渡期实施细则、涉税金属前体清单、典型出口问题 QA 问答与最新碳金融行情动态，为外贸、技术与供应链人员提供权威合规知识支持。",
    "subModules": [
      {
        "name": "法规原文与权威指南检索",
        "desc": "支持中英双语检索欧盟 CBAM 法律条款、条约修正案及官方执行问答指南。"
      },
      {
        "name": "涉税产品 HS 编码税目速查",
        "desc": "精准检索变压器、电线电缆、互感器、开关柜对应 HS Code 的申报要求与特定适用规则。"
      },
      {
        "name": "欧盟官方默认缺省值字典",
        "desc": "结构化查询钢材、铝材、混合合金各原产国官方惩罚性缺省内含排放因子。"
      },
      {
        "name": "典型申报实务与答辩案例库",
        "desc": "沉淀面对欧盟海关问询、第三方核查抽检与前体材料数据异议处理的实战应对模版。"
      },
      {
        "name": "法规版本与更新日志台账",
        "desc": "44px 工业高密表格，跟踪法规文号、颁布机构、生效日期、影响评估与解读文章。"
      }
    ],
    "parameters": [
      {
        "paramCode": "searchKeyword",
        "paramName": "知识检索关键词",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": false,
        "source": "搜索框输入",
        "rangeOrEnum": "缺省值 | 前体材料 | 扣减规则",
        "description": "全文检索法律条款、名词释义或实操指南的关键词"
      },
      {
        "paramCode": "docCategory",
        "paramName": "文档知识分类",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": false,
        "source": "分类单选",
        "rangeOrEnum": "all | REGULATION | GUIDE | DEFAULT_VALUE | CASE",
        "description": "筛选法规全文、实施指南、缺省基准或实务案例"
      },
      {
        "paramCode": "totalArticlesCount",
        "paramName": "收录知识条目总数",
        "category": "核心指标",
        "dataType": "integer",
        "unit": "篇",
        "required": true,
        "source": "知识库索引统计",
        "rangeOrEnum": "50 ~ 2,000",
        "description": "当前知识库中已结构化审签归档的法规与指引篇数"
      },
      {
        "paramCode": "lastUpdatedVersion",
        "paramName": "最新法规版本代号",
        "category": "业务明细",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "法规库主版本",
        "rangeOrEnum": "EU-2023/956-REV4",
        "description": "当前对齐生效的欧委会法律规约最新修订版本"
      }
    ],
    "dataSources": [
      {
        "medium": "欧盟官方公报 (EUR-Lex) 法规文库",
        "sourceType": "官方立法文档镜像库",
        "protocol": "HTTPS REST API 定期同步",
        "device": "欧盟 EUR-Lex 开放接口",
        "tagExample": "EURLEX_REG_2023_956_CELEX",
        "frequency": "每周自动比对更新",
        "securityLevel": "L0 (公开级)"
      },
      {
        "medium": "特变电工外贸实操应对案例总结",
        "sourceType": "国际业务部与法务部知识沉淀",
        "protocol": "企业 Wiki 知识库同步",
        "device": "集团飞书/泛微协同知识中台",
        "tagExample": "LEGAL_CBAM_CASE_STUDY_DOC",
        "frequency": "案例发生时录入",
        "securityLevel": "L2 (工作秘密)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "欧盟缺省值惩罚性溢价成本测算模型",
        "mathExpression": "\\Delta Cost = M_{pre} \\times (EF_{default} - EF_{actual}) \\times P_{eu\\_ets}",
        "variables": [
          {
            "name": "M_{pre}",
            "desc": "前体材料年采购重量",
            "unit": "t"
          },
          {
            "name": "EF_{default}",
            "desc": "欧盟规定的该国别行业默认缺省排放因子",
            "unit": "tCO2e/t"
          },
          {
            "name": "EF_{actual}",
            "desc": "供应链实测提供的真实排放因子",
            "unit": "tCO2e/t"
          },
          {
            "name": "P_{eu_ets}",
            "desc": "当前欧盟碳配额价格",
            "unit": "EUR/tCO2e"
          }
        ],
        "logicDescription": "量化推动上游供应商开展真实碳盘查所能为企业避免的被动碳税溢价，客观证明供应链数智化投入的商业价值。",
        "boundaryRule": "若实测因子反而劣于缺省值（极罕见），溢价成本取 0 并发出供应链高碳预警。"
      }
    ],
    "calculationLogic": "全文检索基于 ElasticSearch / pgvector 向量检索，支持中英文双语语义相似度命中。",
    "dtoSchema": "interface CbamKnowledgeDTO {\n  totalCount: number;\n  latestRegulationVersion: string;\n  items: {\n    docId: string;\n    title: string;\n    category: string;\n    issueDate: string;\n    authority: string;\n    summary: string;\n    downloadUrl: string;\n  }[];\n}",
    "roleGuide": {
      "fe": "1. 搜索框支持拼音自动纠错与热门检索词推荐标签；\n2. 44px 工业高密表格支持点击单行快速打开侧边抽屉查阅法条中英对照全文。",
      "be": "1. 引入轻量级向量嵌入模型提炼法条语义，提升工程师提问的搜索准确率；\n2. 知识库附件统一存放在内部对象存储并限制仅允许通过登录态临时 URL 下载。",
      "qa": "1. 验证中英文混合检索（如“HS 8504 硅钢缺省值”）能精准置顶对应条款；\n2. 验证非公开案例在权限受控账号下的可见性过滤。"
    },
    "frontendSpecs": "1. 搜索框支持拼音自动纠错与热门检索词推荐标签；\n2. 44px 工业高密表格支持点击单行快速打开侧边抽屉查阅法条中英对照全文。",
    "backendSpecs": "1. 引入轻量级向量嵌入模型提炼法条语义，提升工程师提问的搜索准确率；\n2. 知识库附件统一存放在内部对象存储并限制仅允许通过登录态临时 URL 下载。",
    "qaTestSpecs": "1. 验证中英文混合检索（如“HS 8504 硅钢缺省值”）能精准置顶对应条款；\n2. 验证非公开案例在权限受控账号下的可见性过滤。"
  },
  {
    "id": "spec-footprint-cert-material",
    "center": "产品碳足迹集采中心",
    "navGroup": "第三方认证管理",
    "pageName": "认证资料维护",
    "route": "/carbon-footprint/certification/material",
    "component": "components/carbon-footprint/cert-material-view.tsx",
    "overview": "第三方低碳产品认证与碳标签申请资料数字化归集与合规审核中心。结构化归档原材料材质证明 (MTC)、供应商碳足迹核查声明、工厂能源审计报告、型式试验工单与计量表计检定证书，支持文件全生命周期版本追溯、SHA-256 哈希存证与敏感工艺参数水印脱敏导出。",
    "subModules": [
      {
        "name": "认证项目与产品批次选择",
        "desc": "选择待认证产品型号，关联对应技术规格书与设计 BOM 档案。"
      },
      {
        "name": "认证必备资料清单校验树",
        "desc": "按 ISO 14067 / EPD 规范核验 8 大类必备材料上传完整度（缺失项标黄提示）。"
      },
      {
        "name": "文件在线预览与脱敏打水印",
        "desc": "支持 PDF / DWG 格式图纸在线审阅，并自动叠加“仅限某机构认证使用”防泄密水印。"
      },
      {
        "name": "材料 SHA-256 存证哈希计算",
        "desc": "为每一份上传的技术资料生成不可篡改哈希摘要，支撑第三方核查溯源。"
      },
      {
        "name": "认证资料归档明细台账",
        "desc": "44px 工业高密表格，列示文件代号、资料名称、类型、上传人、文件大小、版本与存证哈希。"
      }
    ],
    "parameters": [
      {
        "paramCode": "productModel",
        "paramName": "申请产品型号",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "产品型号下拉",
        "rangeOrEnum": "S20-M-1000/10 | SZ11-50000/110",
        "description": "申请第三方碳足迹认证的具体产品型号"
      },
      {
        "paramCode": "certAgency",
        "paramName": "目标认证机构",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "机构下拉",
        "rangeOrEnum": "SGS | TUV_RHEINLAND | CQC | CEPREI",
        "description": "受理该批次核查认证的国内外权威第三方机构"
      },
      {
        "paramCode": "materialChecklistProgressPct",
        "paramName": "资料准备就绪率",
        "category": "核心指标",
        "dataType": "number",
        "unit": "%",
        "required": true,
        "source": "清单校验模型",
        "rangeOrEnum": "0.0% ~ 100.0%",
        "description": "必备资料上传且审核通过的数量占标准清单总项数的比例"
      },
      {
        "paramCode": "uploadedFileCount",
        "paramName": "已归档文件数",
        "category": "业务明细",
        "dataType": "integer",
        "unit": "份",
        "required": true,
        "source": "文件系统统计",
        "rangeOrEnum": "0 ~ 100",
        "description": "该项目已成功上传并生成存证哈希的文件总数"
      },
      {
        "paramCode": "auditStatus",
        "paramName": "内部初审状态",
        "category": "业务明细",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "初审工作流",
        "rangeOrEnum": "DRAFT | REVIEWING | APPROVED | REJECTED",
        "description": "由企业能碳主管对资料完整性与真实性的初审意见"
      }
    ],
    "dataSources": [
      {
        "medium": "材料进厂质检报告 (MTC)",
        "sourceType": "MES / 质量管理系统 QMS",
        "protocol": "REST API",
        "device": "QMS 进料检验档案",
        "tagExample": "QMS_IQC_REPORT_FILE_ID",
        "frequency": "批次进厂质检归档",
        "securityLevel": "L3 (商密级)"
      },
      {
        "medium": "表计强检铅封证书与校准报告",
        "sourceType": "设备计量管理系统",
        "protocol": "SQL 视图抽检",
        "device": "计量检测台账管理模块",
        "tagExample": "EMS_METER_CALIBRATION_CERT_NO",
        "frequency": "年检到期上传",
        "securityLevel": "L2 (工作秘密)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "认证资料准备完整度评估模型",
        "mathExpression": "P_{prep} = \\frac{\\sum_{i=1}^{N} W_i \\times S_i}{\\sum_{i=1}^{N} W_i} \\times 100\\%",
        "variables": [
          {
            "name": "N",
            "desc": "该机构认证标准要求的必备材料类别总数",
            "unit": "项"
          },
          {
            "name": "W_i",
            "desc": "第 i 类材料的核查权重分值",
            "unit": "分"
          },
          {
            "name": "S_i",
            "desc": "第 i 类材料的状态得分 (已上传且合规为 1，缺件为 0)",
            "unit": "0 或 1"
          }
        ],
        "logicDescription": "对核心数据凭据（电费结算单、主料供应商 EPD、型式试验报告）赋予更高权重，避免表面件数达标但关键凭据缺失。",
        "boundaryRule": "若任意核心一票否决材料（如出厂试验报告）缺失，P_prep 最高封顶限制在 60%，禁止提交外部申请。"
      }
    ],
    "calculationLogic": "上传文件后台自动计算 SHA-256 哈希值，写入数据库只读审计字段，确保与最终认证机构核验文件完全一致。",
    "dtoSchema": "interface CertMaterialDTO {\n  productModel: string;\n  certAgency: string;\n  prepProgressPct: number;\n  isReadyForApply: boolean;\n  fileList: {\n    fileId: string;\n    fileName: string;\n    fileCategory: string;\n    fileSizeMb: number;\n    uploadTime: string;\n    sha256Hash: string;\n    status: 'PASS' | 'MISSING';\n  }[];\n}",
    "roleGuide": {
      "fe": "1. 拖拽上传支持多文件并行上传并具备进度环展示；\n2. 44px 工业表格支持点击“一键打包下载”调用浏览器流式下载 ZIP 包。",
      "be": "1. 大文件切片上传至 MinIO S3，直传前校验 MIME 类型防止可执行木马上传；\n2. 文件下载接口统一添加动态水印，内容包含下载人姓名与时间戳。",
      "qa": "1. 验证上传超过 100MB 超大附件时的切片重传与断点续传能力；\n2. 验证核心材料缺失时，申请按钮正确处于置灰 Disabled 状态。"
    },
    "frontendSpecs": "1. 拖拽上传支持多文件并行上传并具备进度环展示；\n2. 44px 工业表格支持点击“一键打包下载”调用浏览器流式下载 ZIP 包。",
    "backendSpecs": "1. 大文件切片上传至 MinIO S3，直传前校验 MIME 类型防止可执行木马上传；\n2. 文件下载接口统一添加动态水印，内容包含下载人姓名与时间戳。",
    "qaTestSpecs": "1. 验证上传超过 100MB 超大附件时的切片重传与断点续传能力；\n2. 验证核心材料缺失时，申请按钮正确处于置灰 Disabled 状态。"
  },
  {
    "id": "spec-footprint-cert-apply",
    "center": "产品碳足迹集采中心",
    "navGroup": "第三方认证管理",
    "pageName": "认证申请",
    "route": "/carbon-footprint/certification/apply",
    "component": "components/carbon-footprint/cert-apply-view.tsx",
    "overview": "第三方碳核查机构线上申请与协同推进工作流中心。支持发起 ISO 14067 碳足迹核查、国标绿色产品、EPD 环境产品声明线上提单，全流程追踪商务签约、资料移交、现场排期、不符合项 (NC) 整改与专家技术评审全生命周期进度。",
    "subModules": [
      {
        "name": "认证申请向导与表单",
        "desc": "分步向导指引填写申请主体、产品信息、认证标准、拟申请周期与指定核查机构。"
      },
      {
        "name": "审核流程甘特图与里程碑",
        "desc": "时间轴展示提单 ➔ 机构初审 ➔ 合同签订 ➔ 现场抽检 ➔ 报告终审 ➔ 证书签发节点。"
      },
      {
        "name": "不符合项 (NC) 整改协同看板",
        "desc": "记录外部审核老师开具的一般/严重不符合项、整改责任人、期限与补充证据上传。"
      },
      {
        "name": "多机构报价与认证周期对比",
        "desc": "横向比选 SGS、TÜV、CQC 等不同机构的商务报价、公信力等级与预期排期。"
      },
      {
        "name": "认证申请工单明细台账",
        "desc": "44px 工业高密表格，列支申请流水号、产品型号、申请机构、当前节点、责任人与状态徽章。"
      }
    ],
    "parameters": [
      {
        "paramCode": "applyOrderNo",
        "paramName": "申请流水单号",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "系统自动生成",
        "rangeOrEnum": "APPLY-2026-CF-0042",
        "description": "唯一追踪该次第三方认证项目的全局流水号"
      },
      {
        "paramCode": "certStandard",
        "paramName": "依据认证标准",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "标准下拉",
        "rangeOrEnum": "ISO 14067 | PAS 2050 | GB/T 24067 | EPD_SYSTEM",
        "description": "申请认证所遵循的国际或国内标准规范"
      },
      {
        "paramCode": "auditAgencyName",
        "paramName": "受托核查机构",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "机构选择",
        "rangeOrEnum": "SGS | TUV_SUD | CQC | BV",
        "description": "承担该次审核的第三方权威发证机构"
      },
      {
        "paramCode": "currentStep",
        "paramName": "当前工作流节点",
        "category": "核心指标",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "工作流引擎",
        "rangeOrEnum": "SUBMITTED | IN_AUDIT | SITE_CHECK | RECTIFYING | COMPLETED",
        "description": "认证推进的当前生命周期阶段"
      },
      {
        "paramCode": "openNcCount",
        "paramName": "未闭环不符合项数",
        "category": "核心指标",
        "dataType": "integer",
        "unit": "项",
        "required": true,
        "source": "整改看板统计",
        "rangeOrEnum": "0 ~ 20",
        "description": "待企业团队补充证据或整改的外部审核缺陷数"
      },
      {
        "paramCode": "expectedFinishDays",
        "paramName": "预计剩余天数",
        "category": "衍生计算",
        "dataType": "integer",
        "unit": "天",
        "required": true,
        "source": "排期测算模型",
        "rangeOrEnum": "0 ~ 90",
        "description": "距离拿到最终核查声明或证书的预估剩余工期"
      }
    ],
    "dataSources": [
      {
        "medium": "工作流引擎状态机",
        "sourceType": "BPM / Flowable 工作流引擎",
        "protocol": "REST API",
        "device": "企业审批流服务",
        "tagExample": "FLOW_INSTANCE_CURRENT_TASK_KEY",
        "frequency": "节点流转触发",
        "securityLevel": "L2 (工作秘密)"
      },
      {
        "medium": "第三方核查机构对接接口",
        "sourceType": "外部机构认证申报协同开放平台",
        "protocol": "OAuth 2.0 + HTTPS Webhook",
        "device": "CQC / SGS 数据交换接口",
        "tagExample": "AGENCY_AUDIT_STATUS_CALLBACK",
        "frequency": "外部状态变更推送",
        "securityLevel": "L2 (工作秘密)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "认证整改时效达成率模型",
        "mathExpression": "R_{rectify} = \\frac{N_{closed\\_on\\_time}}{N_{total\\_nc}} \\times 100\\%",
        "variables": [
          {
            "name": "N_{closed_on_time}",
            "desc": "在核查机构指定限期内完成整改闭环的不符合项数",
            "unit": "项"
          },
          {
            "name": "N_{total_nc}",
            "desc": "本轮审核外部专家开具的全部不符合项总数",
            "unit": "项"
          }
        ],
        "logicDescription": "考核企业能碳管理团队对第三方核查问询与整改要求的响应时效，确保不因内部拖沓导致发证逾期。",
        "boundaryRule": "若 N_total_nc = 0（一次性零缺陷通过），达成率判定为 100%。"
      }
    ],
    "calculationLogic": "工作流节点流转严格基于 RBAC 权限控制，仅拥有“认证管理员”角色的用户允许执行提交与确认整改操作。",
    "dtoSchema": "interface CertApplicationDTO {\n  applyOrderNo: string;\n  productModel: string;\n  standard: string;\n  agency: string;\n  currentStep: string;\n  openNcCount: number;\n  daysRemaining: number;\n  timeline: { stepName: string; planDate: string; actualDate?: string; status: 'DONE' | 'DOING' | 'TODO' }[];\n}",
    "roleGuide": {
      "fe": "1. 步骤条使用水平进度组件，已完成节点呈翡翠绿打勾，当前节点呼吸光晕高亮；\n2. 44px 工业表格支持点击“处理不符合项”弹窗录入整改凭据与附件。",
      "be": "1. 引入状态机严格限制工作流非法回退（例如已进入发证阶段不允许回退至草稿）；\n2. 审核节点超时未响应自动发送企业微信与邮件提醒对应业务专员。",
      "qa": "1. 验证并发审批场景下分布式锁对申请工单的串行保护；\n2. 验证整改期限倒计时到达 0 时触发的逾期黄色高亮标签提示。"
    },
    "frontendSpecs": "1. 步骤条使用水平进度组件，已完成节点呈翡翠绿打勾，当前节点呼吸光晕高亮；\n2. 44px 工业表格支持点击“处理不符合项”弹窗录入整改凭据与附件。",
    "backendSpecs": "1. 引入状态机严格限制工作流非法回退（例如已进入发证阶段不允许回退至草稿）；\n2. 审核节点超时未响应自动发送企业微信与邮件提醒对应业务专员。",
    "qaTestSpecs": "1. 验证并发审批场景下分布式锁对申请工单的串行保护；\n2. 验证整改期限倒计时到达 0 时触发的逾期黄色高亮标签提示。"
  },
  {
    "id": "spec-footprint-cert-result",
    "center": "产品碳足迹集采中心",
    "navGroup": "第三方认证管理",
    "pageName": "认证结果管理",
    "route": "/carbon-footprint/certification/result",
    "component": "components/carbon-footprint/cert-results-view.tsx",
    "overview": "低碳产品认证证书与碳标签数字化资产存证中枢。全面收录全集团已获批的 ISO 14067 碳足迹核查声明、国标绿色产品评价证书、中国节能产品认证与国际 EPD 注册证书，支持证书有效期限动态监控、临期 90 天自动预警、真伪防伪溯源二维码生成与对外招投标资质一键打包。",
    "subModules": [
      {
        "name": "已获认证资产矩阵看板",
        "desc": "展示有效证书总数、覆盖产品型号数、国际权威认证占比及即将到期证书数。"
      },
      {
        "name": "证书到期日预警雷达",
        "desc": "按剩余有效期（>180天绿色、90~180天蓝色、<90天琥珀金到期预警）分层统计。"
      },
      {
        "name": "碳标签二维码防伪溯源",
        "desc": "为每个获证型号生成专属动态防伪溯源二维码，扫码可直达官方验真页面。"
      },
      {
        "name": "招投标低碳资质一键打包",
        "desc": "根据市场投标需求批量勾选多个证书，一键导出带特变电子骑缝章的高清 PDF 资质合集。"
      },
      {
        "name": "认证证书资产明细台账",
        "desc": "44px 工业高密表格，展示证书编号、产品型号、颁证机构、颁发日期、到期日期与状态徽章。"
      }
    ],
    "parameters": [
      {
        "paramCode": "certType",
        "paramName": "证书类别",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": false,
        "source": "类型下拉",
        "rangeOrEnum": "all | ISO_14067 | GREEN_PRODUCT | EPD | ENERGY_SAVE",
        "description": "证书所属认证制度类型"
      },
      {
        "paramCode": "validityStatus",
        "paramName": "证书有效状态",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": false,
        "source": "状态筛选",
        "rangeOrEnum": "all | VALID | EXPIRING_SOON | EXPIRED",
        "description": "按有效期划定的当前有效性状态"
      },
      {
        "paramCode": "totalCertCount",
        "paramName": "有效证书总数",
        "category": "核心指标",
        "dataType": "integer",
        "unit": "本",
        "required": true,
        "source": "资产台账统计",
        "rangeOrEnum": "10 ~ 500",
        "description": "全集团当前正在有效期内的各类低碳认证证书本数"
      },
      {
        "paramCode": "expiringSoonCount",
        "paramName": "临期预警证书数",
        "category": "核心指标",
        "dataType": "integer",
        "unit": "本",
        "required": true,
        "source": "到期日计算",
        "rangeOrEnum": "0 ~ 50",
        "description": "距离到期不足 90 天且尚未启动续证流程的证书数"
      },
      {
        "paramCode": "qrCodeUrl",
        "paramName": "验真溯源码直链",
        "category": "业务明细",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "溯源服务生成",
        "rangeOrEnum": "https://trace.tbea.com/cert/verify?id=...",
        "description": "对外公开展示并印制在产品铭牌上的溯源 URL"
      },
      {
        "paramCode": "daysToExpiry",
        "paramName": "距离到期天数",
        "category": "衍生计算",
        "dataType": "integer",
        "unit": "天",
        "required": true,
        "source": "时序倒计时",
        "rangeOrEnum": "-365 ~ 1,825",
        "description": "负数代表已过期，正数代表剩余有效天数"
      }
    ],
    "dataSources": [
      {
        "medium": "第三方机构原件证书扫描件与元数据",
        "sourceType": "认证中心证书数字档案库",
        "protocol": "MySQL 结构化存储",
        "device": "`dim_carbon_certificate_meta`",
        "tagExample": "CERT_OFFICIAL_SERIAL_NO",
        "frequency": "发证入库时录入",
        "securityLevel": "L1 (内部级)"
      },
      {
        "medium": "国家认监委 (CNCA) 官方查询系统",
        "sourceType": "全国认证认可信息公共服务平台",
        "protocol": "定期网络核验抽检",
        "device": "CNCA 数据比对通道",
        "tagExample": "CNCA_CERT_SYNC_STATUS",
        "frequency": "每月自动比对一次",
        "securityLevel": "L0 (公开级)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "证书有效期倒计时与预警判定模型",
        "mathExpression": "D_{remaining} = \\text{DateDiff}(T_{expire}, T_{current}), \\quad Status = \\begin{cases} \\text{EXPIRED}, & D_{remaining} \\le 0 \\\\ \\text{EXPIRING\\_SOON}, & 0 < D_{remaining} \\le 90 \\\\ \\text{VALID}, & D_{remaining} > 90 \\end{cases}",
        "variables": [
          {
            "name": "T_{expire}",
            "desc": "证书票面载明的正式失效日期",
            "unit": "时间戳"
          },
          {
            "name": "T_{current}",
            "desc": "当前系统自然日零点时间戳",
            "unit": "时间戳"
          },
          {
            "name": "D_{remaining}",
            "desc": "有效剩余天数",
            "unit": "天"
          }
        ],
        "logicDescription": "每日定时任务自动滚动计算剩余天数，在到达 90 天阈值时自动向对应事业部质检主任推送复审提醒。",
        "boundaryRule": "若证书已标记为“被注销”或“已主动废止”，强制标记为 EXPIRED 状态，忽略日期判定。"
      }
    ],
    "calculationLogic": "对外溯源二维码内嵌企业数字签名，防止第三方恶意伪造变造特变电工低碳铭牌。",
    "dtoSchema": "interface CertResultDTO {\n  totalValid: number;\n  expiringSoon: number;\n  certs: {\n    certId: string;\n    certNo: string;\n    certType: string;\n    productModel: string;\n    issueDate: string;\n    expireDate: string;\n    daysRemaining: number;\n    agency: string;\n    status: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED';\n    qrCodeUrl: string;\n  }[];\n}",
    "roleGuide": {
      "fe": "1. 临期 90 天证书在表格行以微透琥珀金背景提示，过期以淡红提示；\n2. 支持点击单行弹出二维码悬浮框，并支持一键另存为高清 PNG 矢量图。",
      "be": "1. 证书打包下载使用后台流式 ZipOutputStream 边读边压，杜绝服务器内存 OOM；\n2. 证书快照存储在 MinIO 对象存储，并在数据库中保留 SHA-256 校验和。",
      "qa": "1. 验证系统时间调整后，处于 89 天的证书准确判定为 EXPIRING_SOON；\n2. 验证多选 10 本证书打包下载，压缩包内文件名中文显示正常且无破损。"
    },
    "frontendSpecs": "1. 临期 90 天证书在表格行以微透琥珀金背景提示，过期以淡红提示；\n2. 支持点击单行弹出二维码悬浮框，并支持一键另存为高清 PNG 矢量图。",
    "backendSpecs": "1. 证书打包下载使用后台流式 ZipOutputStream 边读边压，杜绝服务器内存 OOM；\n2. 证书快照存储在 MinIO 对象存储，并在数据库中保留 SHA-256 校验和。",
    "qaTestSpecs": "1. 验证系统时间调整后，处于 89 天的证书准确判定为 EXPIRING_SOON；\n2. 验证多选 10 本证书打包下载，压缩包内文件名中文显示正常且无破损。"
  },
  {
    "id": "spec-footprint-factor-material",
    "center": "产品碳足迹集采中心",
    "navGroup": "因子库管理",
    "pageName": "原材料碳排因子",
    "route": "/carbon-footprint/factor/material",
    "component": "components/carbon-footprint/factor-material-view.tsx",
    "overview": "变压器与线缆行业原材料基础碳足迹因子库。涵盖电工取向/无取向硅钢、电解铜杆、无氧铜丝、铝合金导体、变压器绝缘油（矿物油/植物油）、环氧树脂浇注料、绝缘纸板等 300+ 关键制造物料的“摇篮到大门”碳排因子，支持 Ecoinvent、CLCD、CPCD 多源数据库比选与供应商实测实景因子精准覆盖。",
    "subModules": [
      {
        "name": "原材料因子智能搜索与检索",
        "desc": "支持按物料编码、材料品名、供货商或数据源库快速检索因子参数。"
      },
      {
        "name": "多源数据库因子对比矩阵",
        "desc": "横向比选特变实测实景值 vs 中国本地化 CLCD 库 vs 欧洲 Ecoinvent 库数值偏差。"
      },
      {
        "name": "供应商实测因子审核与挂接",
        "desc": "对宝钢硅钢、江铜铜杆等上游战略供方回传的第三方 EPD 因子进行核验生效。"
      },
      {
        "name": "因子多版本演进与生效控制",
        "desc": "支持按生效年度（如 2024版、2025版）管理因子，支持历史核算锁定与溯源。"
      },
      {
        "name": "原材料碳因子明细台账",
        "desc": "44px 工业高密表格，展示物料代号、名称、因子数值、单位、数据来源、DQR 等级及生效版本。"
      }
    ],
    "parameters": [
      {
        "paramCode": "materialCategory",
        "paramName": "物料分类",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": false,
        "source": "物料大类下拉",
        "rangeOrEnum": "all | SILICON_STEEL | COPPER | ALUMINUM | OIL | RESIN",
        "description": "原材料细分大类"
      },
      {
        "paramCode": "sourceDatabase",
        "paramName": "数据来源库",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": false,
        "source": "来源单选",
        "rangeOrEnum": "all | TBEA_REALSCENE | CLCD | ECOINVENT | CPCD",
        "description": "因子的底层原始出处数据库"
      },
      {
        "paramCode": "emissionFactorValue",
        "paramName": "碳排放因子值",
        "category": "核心指标",
        "dataType": "number",
        "unit": "kgCO2e/kg",
        "required": true,
        "source": "因子库字段",
        "rangeOrEnum": "0.100 ~ 50.000",
        "description": "每千克原材料生命周期对应的温室气体排放当量"
      },
      {
        "paramCode": "factorVersion",
        "paramName": "因子生效版本",
        "category": "核心指标",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "版本控制",
        "rangeOrEnum": "v2025.1 | v2026.1",
        "description": "用于版本隔离追溯的因子批次标识"
      },
      {
        "paramCode": "dqrScore",
        "paramName": "数据质量评级",
        "category": "核心指标",
        "dataType": "number",
        "unit": "分",
        "required": true,
        "source": "DQR 模型",
        "rangeOrEnum": "1.0 ~ 5.0",
        "description": "因子技术与地理代表性评分，分值越小越权威"
      },
      {
        "paramCode": "supplierName",
        "paramName": "指定供货商名称",
        "category": "业务明细",
        "dataType": "string",
        "unit": "-",
        "required": false,
        "source": "供应商台账",
        "rangeOrEnum": "宝武钢铁 | 江西铜业 | 中石油",
        "description": "若为供应商特定实测因子，记录具体供货企业"
      }
    ],
    "dataSources": [
      {
        "medium": "特变电工上游供应链碳足迹申报平台",
        "sourceType": "供应链 SRM 协同中台",
        "protocol": "REST API 接口",
        "device": "SRM 绿色采购模块",
        "tagExample": "SRM_SUPPLIER_EPD_FACTOR_VAL",
        "frequency": "供应商提单审批通过后同步",
        "securityLevel": "L2 (工作秘密)"
      },
      {
        "medium": "中国生命周期基础数据库 (CLCD)",
        "sourceType": "四川大学/亿科环境权威数据库",
        "protocol": "官方数据包离线导入",
        "device": "系统内部标准因子表",
        "tagExample": "STD_CLCD_FACTOR_SILICON_STEEL",
        "frequency": "年度授权更新",
        "securityLevel": "L0 (公开级)"
      },
      {
        "medium": "瑞士 Ecoinvent 国际生命周期数据库",
        "sourceType": "Ecoinvent Association 官方库",
        "protocol": "JSON 格式结构化镜像",
        "device": "`dim_ecoinvent_mirror`",
        "tagExample": "ECOINVENT_FACTOR_COPPER_WIRE",
        "frequency": "版本更新时维护",
        "securityLevel": "L0 (公开级)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "多供方原材料加权平均碳因子模型",
        "mathExpression": "\\overline{EF}_{mat} = \\frac{\\sum_{k=1}^{M} (Q_k \\times EF_k)}{\\sum_{k=1}^{M} Q_k}",
        "variables": [
          {
            "name": "Q_k",
            "desc": "报告期内从第 k 家供应商采购该原材料的实物质量",
            "unit": "t"
          },
          {
            "name": "EF_k",
            "desc": "第 k 家供应商经核实的实测碳排放因子",
            "unit": "kgCO2e/kg"
          }
        ],
        "logicDescription": "在企业多源采购场景下，按各钢厂或铜厂实际供货份额加权生成混合材料因子，保证全厂核算的真实性。",
        "boundaryRule": "若某供方未提供实测因子，强制以该品类的国家标准保守因子代入计算，不得盲目拉低平均值。"
      }
    ],
    "calculationLogic": "因子修改需经过二级审批流，修改生效后历史已归档的报告默认锁定原版本因子，重新核算需显式触发。",
    "dtoSchema": "interface MaterialFactorDTO {\n  factorCode: string;\n  materialName: string;\n  category: string;\n  factorValue: number;\n  unit: string;\n  sourceDb: string;\n  dqrScore: number;\n  version: string;\n  isActive: boolean;\n}",
    "roleGuide": {
      "fe": "1. 搜索支持拼音首字母检索（如输入“gg”匹配“硅钢”）；\n2. 44px 工业表格支持点击版本标签切换查看历年历史因子波动折线趋势。",
      "be": "1. 因子表在 Redis 配置二级缓存（Local Cache + Redis 集群），防止每次核算重复扫描 DB；\n2. 因子更新时发布 Pub/Sub 广播消息通知计算节点失效本地缓存。",
      "qa": "1. 验证因子数值录入负数时前端即时拦截阻断；\n2. 验证多版本切换时，旧版本标记为只读禁止篡改。"
    },
    "frontendSpecs": "1. 搜索支持拼音首字母检索（如输入“gg”匹配“硅钢”）；\n2. 44px 工业表格支持点击版本标签切换查看历年历史因子波动折线趋势。",
    "backendSpecs": "1. 因子表在 Redis 配置二级缓存（Local Cache + Redis 集群），防止每次核算重复扫描 DB；\n2. 因子更新时发布 Pub/Sub 广播消息通知计算节点失效本地缓存。",
    "qaTestSpecs": "1. 验证因子数值录入负数时前端即时拦截阻断；\n2. 验证多版本切换时，旧版本标记为只读禁止篡改。"
  },
  {
    "id": "spec-footprint-factor-grid",
    "center": "产品碳足迹集采中心",
    "navGroup": "因子库管理",
    "pageName": "电力碳排因子",
    "route": "/carbon-footprint/factor/power",
    "component": "components/carbon-footprint/factor-grid-view.tsx",
    "overview": "国家与区域电网平均供电碳排放因子及绿电市场化因子动态中枢。权威收录生态环境部发布的全国电网平均因子、六大区域电网因子（华北、华东、西北、华中、东北、南方）以及各省域电网因子，并支持基于直供绿电协议 (PPA) 与国家绿证 (GEC) 的市场化零碳电力核销配置。",
    "subModules": [
      {
        "name": "国家与区域电网权威因子总览",
        "desc": "呈现生态环境部最新公告的全国电网因子（0.5366 tCO2/MWh）与省网因子。"
      },
      {
        "name": "特变各大产业园区电网因子绑定",
        "desc": "将沈变（辽宁）、衡变（湖南）、新变（新疆）、鲁缆（山东）与属地电网因子精准绑定。"
      },
      {
        "name": "市场化绿电与绿证抵扣模型",
        "desc": "配置自发自用光伏、专线直供绿电及绿证交易在电网计算中的零碳扣减规则。"
      },
      {
        "name": "国际出口针对性电网因子配置",
        "desc": "维护欧盟 CBAM 认可的中国区域电网因子及国际碳披露 CDP 因子基准。"
      },
      {
        "name": "电力排放因子历史台账",
        "desc": "44px 工业高密表格，展示电网区域、省份代码、因子数值、发布机构、发布公报文号与执行年份。"
      }
    ],
    "parameters": [
      {
        "paramCode": "regionCode",
        "paramName": "电网区域代码",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "区域下拉",
        "rangeOrEnum": "NATIONAL | NORTH_CHINA | EAST_CHINA | NORTHWEST | CENTRAL",
        "description": "生态环境部划分的电网区域标识"
      },
      {
        "paramCode": "provinceCode",
        "paramName": "所属省份代码",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": false,
        "source": "省份下拉",
        "rangeOrEnum": "XINJIANG | HUNAN | LIAONING | SHANDONG",
        "description": "产业园区所在具体省份"
      },
      {
        "paramCode": "gridEmissionFactor",
        "paramName": "电网平均供电因子",
        "category": "核心指标",
        "dataType": "number",
        "unit": "kgCO2/kWh",
        "required": true,
        "source": "生态环境部公告",
        "rangeOrEnum": "0.200 ~ 0.900",
        "description": "每消耗一度外购市电对应的二氧化碳间接排放量"
      },
      {
        "paramCode": "officialDocNo",
        "paramName": "发布公报文号",
        "category": "业务明细",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "公报台账",
        "rangeOrEnum": "环办气候函〔2024〕145号",
        "description": "国家部委官方正式印发的文件文号"
      },
      {
        "paramCode": "effectiveYear",
        "paramName": "发布执行年份",
        "category": "核心指标",
        "dataType": "string",
        "unit": "年",
        "required": true,
        "source": "年份台账",
        "rangeOrEnum": "2023 | 2024 | 2025 | 2026",
        "description": "该因子对应的官方核算年度"
      }
    ],
    "dataSources": [
      {
        "medium": "生态环境部气候司官方公告",
        "sourceType": "国家生态环境部权威发布公报",
        "protocol": "官方公报文本录入",
        "device": "环境部政策法规公报库",
        "tagExample": "MEE_OFFICIAL_GRID_FACTOR_DOC",
        "frequency": "每年公报发布后维护",
        "securityLevel": "L0 (公开级)"
      },
      {
        "medium": "国家能源局可再生能源信息管理中心",
        "sourceType": "绿证核发与交易系统",
        "protocol": "API 接口认证",
        "device": "全国绿证核发平台接入通道",
        "tagExample": "GEC_GREEN_CERTIFICATE_VERIFIED",
        "frequency": "按月对账",
        "securityLevel": "L1 (内部级)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "厂区综合外购电力加权碳因子模型",
        "mathExpression": "EF_{elec\\_mix} = \\frac{(Q_{grid} - Q_{gec}) \\times EF_{grid} + Q_{green\\_direct} \\times 0}{Q_{total\\_elec}}",
        "variables": [
          {
            "name": "Q_{grid}",
            "desc": "从公共电网购入的总电量",
            "unit": "kWh"
          },
          {
            "name": "Q_{gec}",
            "desc": "已完成唯一核销注销的绿证对应电量",
            "unit": "kWh"
          },
          {
            "name": "EF_{grid}",
            "desc": "属地电网官方公布的供电排放因子",
            "unit": "kgCO2/kWh"
          },
          {
            "name": "Q_{green_direct}",
            "desc": "专线直供或分布式光伏消纳电量（零碳因子）",
            "unit": "kWh"
          },
          {
            "name": "Q_{total_elec}",
            "desc": "工厂全部实际消耗的电量总和",
            "unit": "kWh"
          }
        ],
        "logicDescription": "融合物理绿电与市场化凭据，精准核算企业在消纳绿电后的净外购电力碳强度。",
        "boundaryRule": "在申报 CBAM 模式下，目前欧盟暂不支持以国内绿证抵扣 Scope 2 间接排放，系统自动切换为纯电网因子计算模式。"
      }
    ],
    "calculationLogic": "严格遵循国内碳核算标准与欧盟国际标准的双轨制核算开关，确保双端出数口径权威可解释。",
    "dtoSchema": "interface GridFactorDTO {\n  regionCode: string;\n  provinceCode: string;\n  factorValue: number;\n  docNo: string;\n  year: string;\n  boundParks: string[];\n}",
    "roleGuide": {
      "fe": "1. 中国地图高亮各省电网因子梯队，深蓝至浅蓝渐变表示碳强度高低；\n2. 44px 工业表格支持点击“绑定园区”弹窗配置工厂归属省份。",
      "be": "1. 因子变动后触发关联工厂当期未结案工单的自动重算任务队列；\n2. 严格按执行年份版本做历史切片，禁止覆盖历史年份记录。",
      "qa": "1. 验证当绿证核销电量大于外购电量时，综合因子截断为 0 而非负数；\n2. 验证沈变、衡变、新变匹配正确的属地省网因子。"
    },
    "frontendSpecs": "1. 中国地图高亮各省电网因子梯队，深蓝至浅蓝渐变表示碳强度高低；\n2. 44px 工业表格支持点击“绑定园区”弹窗配置工厂归属省份。",
    "backendSpecs": "1. 因子变动后触发关联工厂当期未结案工单的自动重算任务队列；\n2. 严格按执行年份版本做历史切片，禁止覆盖历史年份记录。",
    "qaTestSpecs": "1. 验证当绿证核销电量大于外购电量时，综合因子截断为 0 而非负数；\n2. 验证沈变、衡变、新变匹配正确的属地省网因子。"
  },
  {
    "id": "spec-footprint-factor-fuel",
    "center": "产品碳足迹集采中心",
    "navGroup": "因子库管理",
    "pageName": "能源活动碳排因子",
    "route": "/carbon-footprint/factor/energy",
    "component": "components/carbon-footprint/factor-fuel-view.tsx",
    "overview": "化石燃料燃烧与工业热力温室气体排放因子库。依照国家发改委《工业其他行业企业温室气体排放核算方法与报告指南》及 IPCC 2006 准则，维护管道天然气、轻柴油、无烟煤、工业蒸汽（过热/饱和蒸汽）等能源介质的低位发热量、单位热值含碳量、碳氧化率与 CO2 综合转化系数，支持热力温压参数自适应校正。",
    "subModules": [
      {
        "name": "化石燃料排放因子矩阵",
        "desc": "收录天然气、柴油、无烟煤等化石燃料的标准热值与碳氧化参数。"
      },
      {
        "name": "购入蒸汽与热力因子校正器",
        "desc": "根据现场蒸汽表计测量的温度与表压（MPa），动态计算实际焓值与折算因子。"
      },
      {
        "name": "实测发热量与缺省值切换",
        "desc": "支持天然气供气方提供的实测组分热值优先代入，无实测时调用国标缺省值。"
      },
      {
        "name": "移动源燃油排放因子管理",
        "desc": "维护厂区叉车、转运重卡消耗柴油的温室气体排放系数。"
      },
      {
        "name": "能源活动因子明细台账",
        "desc": "44px 工业高密表格，展示介质名称、低位发热量、单位热值含碳量、碳氧化率、综合因子及出处。"
      }
    ],
    "parameters": [
      {
        "paramCode": "fuelType",
        "paramName": "能源介质类型",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "燃料下拉",
        "rangeOrEnum": "NATURAL_GAS | DIESEL | STEAM_SUPERHEATED | STEAM_SATURATED",
        "description": "消耗的燃料或热力介质分类"
      },
      {
        "paramCode": "netCalorificValue",
        "paramName": "平均低位发热量",
        "category": "核心指标",
        "dataType": "number",
        "unit": "GJ/t 或 GJ/万m³",
        "required": true,
        "source": "实测化验/国标",
        "rangeOrEnum": "100.0 ~ 500.0",
        "description": "燃料燃烧释放的有效能量"
      },
      {
        "paramCode": "carbonContentPerGj",
        "paramName": "单位热值含碳量",
        "category": "核心指标",
        "dataType": "number",
        "unit": "tC/GJ",
        "required": true,
        "source": "国家指南缺省值",
        "rangeOrEnum": "0.010 ~ 0.035",
        "description": "每 GJ 热量所含有的纯碳元素质量"
      },
      {
        "paramCode": "carbonOxidationRatePct",
        "paramName": "碳氧化率",
        "category": "核心指标",
        "dataType": "number",
        "unit": "%",
        "required": true,
        "source": "设备燃烧工况",
        "rangeOrEnum": "95.0% ~ 99.5%",
        "description": "燃料完全燃烧转化为二氧化碳的化学比例"
      },
      {
        "paramCode": "comprehensiveEmissionFactor",
        "paramName": "综合碳排放因子",
        "category": "衍生计算",
        "dataType": "number",
        "unit": "tCO2/万m³ 或 tCO2/t",
        "required": true,
        "source": "乘积公式计算",
        "rangeOrEnum": "1.00 ~ 30.00",
        "description": "消耗单位实物量能源所直接排放的温室气体总量"
      }
    ],
    "dataSources": [
      {
        "medium": "燃气公司每月天然气组分化验单",
        "sourceType": "供气企业月度质检单",
        "protocol": "人工扫码录入 / OCR 识别",
        "device": "燃气供应商结算附件",
        "tagExample": "GAS_CO_LAB_CALORIFIC_VAL",
        "frequency": "月度抄表结算归档",
        "securityLevel": "L2 (工作秘密)"
      },
      {
        "medium": "国家温室气体排放核算方法与报告指南",
        "sourceType": "国家发改委 / 生态环境部标准",
        "protocol": "系统内置标准字典",
        "device": "`dim_fuel_emission_standard`",
        "tagExample": "STD_IPCC_DEFAULT_FUEL_FACTOR",
        "frequency": "指南修订时更新",
        "securityLevel": "L0 (公开级)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "化石燃料燃烧直接碳排放因子乘积模型",
        "mathExpression": "EF_{fuel} = NCV \\times CC \\times OF \\times \\frac{44}{12}",
        "variables": [
          {
            "name": "NCV",
            "desc": "平均低位发热量",
            "unit": "GJ/t 或 GJ/万m³"
          },
          {
            "name": "CC",
            "desc": "单位热值含碳量",
            "unit": "tC/GJ"
          },
          {
            "name": "OF",
            "desc": "碳氧化率 (Oxidation Factor)",
            "unit": "无量纲小数 (如 0.99)"
          },
          {
            "name": "44/12",
            "desc": "碳到二氧化碳的分子量换算常数",
            "unit": "-"
          }
        ],
        "logicDescription": "国家发改委权威核算规范标准乘法链，所有参数来源透明、步骤可验证。",
        "boundaryRule": "若某项参数缺乏实测化验条件，系统强制严格采用国标附录表缺省值（如天然气 OF 强制按 0.99 计）。"
      }
    ],
    "calculationLogic": "蒸汽综合因子根据温度压力动态查 IAPWS-IF97 水蒸汽焓值表转换为热量，再乘以热力因子（0.11 tCO2/GJ）。",
    "dtoSchema": "interface FuelFactorDTO {\n  fuelType: string;\n  fuelName: string;\n  ncv: number;\n  cc: number;\n  of: number;\n  finalFactor: number;\n  unit: string;\n  isMeasured: boolean;\n}",
    "roleGuide": {
      "fe": "1. 蒸汽参数配置提供温度与压力输入框，动态联动画出焓值并实时更新最终因子；\n2. 44px 工业表格支持点击单行查看公式计算乘积展开步骤。",
      "be": "1. 内置水蒸汽热力性质国际公式 (IAPWS-IF97) 计算模块，确保蒸汽焓值换算精度达小数点后 4 位；\n2. 历史天然气组分化验单保留原始附件下载链接。",
      "qa": "1. 验证天然气碳氧化率 OF 输入 105% 超过 100% 时被严格校验拦截；\n2. 验证计算出的综合因子与手动计算器结果误差在 0.001% 以内。"
    },
    "frontendSpecs": "1. 蒸汽参数配置提供温度与压力输入框，动态联动画出焓值并实时更新最终因子；\n2. 44px 工业表格支持点击单行查看公式计算乘积展开步骤。",
    "backendSpecs": "1. 内置水蒸汽热力性质国际公式 (IAPWS-IF97) 计算模块，确保蒸汽焓值换算精度达小数点后 4 位；\n2. 历史天然气组分化验单保留原始附件下载链接。",
    "qaTestSpecs": "1. 验证天然气碳氧化率 OF 输入 105% 超过 100% 时被严格校验拦截；\n2. 验证计算出的综合因子与手动计算器结果误差在 0.001% 以内。"
  },
  {
    "id": "spec-footprint-factor-coal",
    "center": "产品碳足迹集采中心",
    "navGroup": "因子库管理",
    "pageName": "折标煤系数库",
    "route": "/carbon-footprint/factor/coal",
    "component": "components/carbon-footprint/factor-coal-view.tsx",
    "overview": "综合能耗折标准煤当量与等价系数权威基准库（严格遵循 GB/T 2589《综合能耗计算通则》）。维护电力当量折标（0.1229 kgce/kWh）、电力等价折标（~0.3000 kgce/kWh）、自来水、天然气、工业蒸汽、压缩空气的折标系数与企业考核系数，统一全集团综合能耗统计口径与考核标尺。",
    "subModules": [
      {
        "name": "国标 GB/T 2589 折标系数基准",
        "desc": "维护国家统一规定的电力、天然气、热力等标准煤折算系数当量值。"
      },
      {
        "name": "电力当量与等价折算模式切换",
        "desc": "支持生产工序物理考核（当量 0.1229）与全社会节能节能量考核（等价 0.3000）一键切换。"
      },
      {
        "name": "水资源与辅助工质折算模型",
        "desc": "收录自来水 (0.0857 kgce/t)、循环水、压缩空气 (0.0400 kgce/m³) 的工质能耗系数。"
      },
      {
        "name": "企业内部统一能耗折算规则",
        "desc": "维护集团财务与战略运营部下达的年度内控能效考核折算标准。"
      },
      {
        "name": "折标煤系数明细台账",
        "desc": "44px 工业高密表格，列支介质代码、名称、实物单位、当量折标系数、等价折标系数与引用标准。"
      }
    ],
    "parameters": [
      {
        "paramCode": "energyMediumCode",
        "paramName": "能源介质代号",
        "category": "入参过滤",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "介质选择",
        "rangeOrEnum": "ELECTRICITY | WATER | NATURAL_GAS | STEAM | COMPRESSED_AIR",
        "description": "需要换算折标的标准能源介质代号"
      },
      {
        "paramCode": "equivalentFactorKgce",
        "paramName": "当量折标系数",
        "category": "核心指标",
        "dataType": "number",
        "unit": "kgce/实物单位",
        "required": true,
        "source": "国标 GB/T 2589",
        "rangeOrEnum": "0.0100 ~ 5.0000",
        "description": "基于能源自身理论热值换算的标准煤系数（如电: 0.1229）"
      },
      {
        "paramCode": "equalValueFactorKgce",
        "paramName": "等价折标系数",
        "category": "核心指标",
        "dataType": "number",
        "unit": "kgce/实物单位",
        "required": true,
        "source": "供电煤耗统计",
        "rangeOrEnum": "0.0100 ~ 5.0000",
        "description": "考虑发电与输变电全过程煤耗的等价值（如电: ~0.3000）"
      },
      {
        "paramCode": "activeStandardCode",
        "paramName": "执行标准代号",
        "category": "业务明细",
        "dataType": "string",
        "unit": "-",
        "required": true,
        "source": "标准台账",
        "rangeOrEnum": "GB/T 2589-2020",
        "description": "当前生效的国家综合能耗计算通则标准号"
      }
    ],
    "dataSources": [
      {
        "medium": "国家标准化管理委员会官方标准公告",
        "sourceType": "国家标准全文公开系统",
        "protocol": "国标文本规范录入",
        "device": "全国标准信息公共服务平台",
        "tagExample": "STD_GB_T_2589_2020",
        "frequency": "标准换版时维护",
        "securityLevel": "L0 (公开级)"
      },
      {
        "medium": "国家统计局年度供电标准煤耗公告",
        "sourceType": "统计局能源统计年鉴",
        "protocol": "年度年鉴数据提取",
        "device": "国家统计局数据发布库",
        "tagExample": "NBS_ANNUAL_COAL_CONSUMPTION_PER_KWH",
        "frequency": "每年统计公报更新",
        "securityLevel": "L0 (公开级)"
      }
    ],
    "calcFormulas": [
      {
        "formulaName": "综合能耗折标准煤汇总计算模型",
        "mathExpression": "E_{total\\_tce} = \\sum_{i=1}^{P} \\frac{Q_i \\times K_i}{1000}",
        "variables": [
          {
            "name": "Q_i",
            "desc": "报告期内第 i 种能源介质实物消耗量",
            "unit": "实物单位 (kWh/m³/t)"
          },
          {
            "name": "K_i",
            "desc": "第 i 种能源介质折标煤系数 (当量或等价)",
            "unit": "kgce/实物单位"
          }
        ],
        "logicDescription": "全厂或单产品综合能耗归一化的标准公式，将不同形态能源统一换算为国际标准煤当量。",
        "boundaryRule": "外供能源或输出余热需作为负项扣减，全厂综合能耗允许净值统计。"
      }
    ],
    "calculationLogic": "系统内所有能耗大屏、用能分析与单耗核算必须严格统一引用本库系数，杜绝业务端硬编码常数。",
    "dtoSchema": "interface CoalFactorDTO {\n  mediumCode: string;\n  mediumName: string;\n  physicalUnit: string;\n  equivalentKgce: number;\n  equalValueKgce: number;\n  standardCode: string;\n  lastUpdated: string;\n}",
    "roleGuide": {
      "fe": "1. 提供全局“当量/等价模式”切换开关，切换时整站能耗折标数值平滑联动；\n2. 44px 工业表格支持一键导出为企业能耗统计报表格式。",
      "be": "1. 统一封装 `EnergyTceCalculator` 工具类供所有微服务共享依赖，杜绝公式重复编写；\n2. 严格控制系数修改权限，写操作须记录审计留痕日志。",
      "qa": "1. 验证电力当量系数修改时，涉及 65+ 项指标历史核算数据的幂等与版本一致性；\n2. 验证折标煤汇总公式在多介质混合计算下的数值精度。"
    },
    "frontendSpecs": "1. 提供全局“当量/等价模式”切换开关，切换时整站能耗折标数值平滑联动；\n2. 44px 工业表格支持一键导出为企业能耗统计报表格式。",
    "backendSpecs": "1. 统一封装 `EnergyTceCalculator` 工具类供所有微服务共享依赖，杜绝公式重复编写；\n2. 严格控制系数修改权限，写操作须记录审计留痕日志。",
    "qaTestSpecs": "1. 验证电力当量系数修改时，涉及 65+ 项指标历史核算数据的幂等与版本一致性；\n2. 验证折标煤汇总公式在多介质混合计算下的数值精度。"
  }
];

/* 4. 8 大角色在线评审检查矩阵 */
export const ROLE_REVIEW_SPECS: RoleReviewSpec[] = [
  {
    "role": "PM (产品经理)",
    "icon": "Target",
    "checkItems": [
      {
        "id": "pm-1",
        "item": "零碳园区集控中心 10 大核心模块与 PRD 范围完全闭环，无功能缺失",
        "mandatory": true
      },
      {
        "id": "pm-2",
        "item": "产品碳足迹实景数据库、工序追溯、CBAM 管理与因子库三维维护完备",
        "mandatory": true
      },
      {
        "id": "pm-3",
        "item": "白名单规则精准执行：10 家无工序单位精准判空输出单行 '暂无相关工序！'",
        "mandatory": true
      },
      {
        "id": "pm-4",
        "item": "严格遵循客观中立原则，全站杜绝任何主观定性评判词句",
        "mandatory": true
      }
    ]
  },
  {
    "role": "UI/UX (工业设计)",
    "icon": "Layers",
    "checkItems": [
      {
        "id": "ui-1",
        "item": "数据表格行高全系统强制为 44px (h-[44px])，文本居中对齐",
        "mandatory": true
      },
      {
        "id": "ui-2",
        "item": "标准色遵循 8 大能源介质官方色值，分时 4 段色值准确无误",
        "mandatory": true
      },
      {
        "id": "ui-3",
        "item": "图表悬停游标为微透科技蓝 rgba(56, 189, 248, 0.08)，浅色为极细微灰",
        "mandatory": true
      },
      {
        "id": "ui-4",
        "item": "标准导出按钮固定 80px × 36px，输入框与下拉框 200px × 36px",
        "mandatory": true
      }
    ]
  },
  {
    "role": "Architect (技术架构)",
    "icon": "Cpu",
    "checkItems": [
      {
        "id": "arch-1",
        "item": "Next.js 16 (App Router) + React 19 静态全路由预渲染 (output: 'export') 正常通过",
        "mandatory": true
      },
      {
        "id": "arch-2",
        "item": "纯前端离线检索与页面切换毫秒级响应，无 Node.js 运行时依赖",
        "mandatory": true
      },
      {
        "id": "arch-3",
        "item": "核心领域核算算法 (折标煤/LCA/CBAM) 经过纯函数解耦，具备可测试性",
        "mandatory": true
      }
    ]
  },
  {
    "role": "Frontend (前端开发)",
    "icon": "Code2",
    "checkItems": [
      {
        "id": "fe-1",
        "item": "暗黑科技蓝 (3000) 与浅色商务 (3001) 双端 100% 同构同步更新",
        "mandatory": true
      },
      {
        "id": "fe-2",
        "item": "组件库体系 (@/components/design-system) 深度复用，无重复野控件",
        "mandatory": true
      },
      {
        "id": "fe-3",
        "item": "78 个静态路由 pnpm build 编译 0 报错，无 TypeScript 严格模式错误",
        "mandatory": true
      }
    ]
  },
  {
    "role": "Backend (后端开发)",
    "icon": "Database",
    "checkItems": [
      {
        "id": "be-1",
        "item": "明确 SCADA 物联测点 Tag、ERP 订单号与 MES 产量的数据源接入定义",
        "mandatory": true
      },
      {
        "id": "be-2",
        "item": "DWD 事实表与 ADS 汇总表结构定义完备，主外键索引规划合理",
        "mandatory": true
      },
      {
        "id": "be-3",
        "item": "上报数据防重幂等设计与时序数据降采样 (Rollup) 策略明确",
        "mandatory": true
      }
    ]
  },
  {
    "role": "QA (测试工程)",
    "icon": "CheckCircle2",
    "checkItems": [
      {
        "id": "qa-1",
        "item": "全场景等价类与边界值用例覆盖，产量为 0 时除法分母防崩溃通过",
        "mandatory": true
      },
      {
        "id": "qa-2",
        "item": "表计止度倒走拦截与 ±15% 同比波动预警算法防御用例通过",
        "mandatory": true
      },
      {
        "id": "qa-3",
        "item": "变压器与线缆双产业计量单位自适应 (台 vs km) 验证通过",
        "mandatory": true
      }
    ]
  },
  {
    "role": "Security (安全合规)",
    "icon": "ShieldCheck",
    "checkItems": [
      {
        "id": "sec-1",
        "item": "L0~L4 商密分级制度完备，敏感客户订单与供应商因子加密方案就绪",
        "mandatory": true
      },
      {
        "id": "sec-2",
        "item": "系统操作与数据录入不可逆审计日志设计完备",
        "mandatory": true
      }
    ]
  },
  {
    "role": "DevOps (运维部署)",
    "icon": "Server",
    "checkItems": [
      {
        "id": "ops-1",
        "item": "本地静态构建通过后，严格执行手动指令发布纪律，绝不自动向 8.215 推送",
        "mandatory": true
      },
      {
        "id": "ops-2",
        "item": "严格禁止在 Git 中提交 VUE/ 临时工作目录代码",
        "mandatory": true
      }
    ]
  }
];
export const REVIEW_MATRIX: RoleReviewSpec[] = ROLE_REVIEW_SPECS;

/* 5. 核心数仓与数据字典 */
export const DWD_TABLES: DwdTable[] = [
  {
    "tableName": "dwd_iot_scada_telemetry_15m",
    "tableComment": "物联数据采集与 SCADA 遥测 15 分钟聚合事实表",
    "storageEngine": "TDengine / TimescaleDB (时序引擎)",
    "fields": [
      {
        "name": "tag_name",
        "type": "VARCHAR(64)",
        "nullable": false,
        "comment": "物联测点 Tag 唯一编码"
      },
      {
        "name": "sample_time",
        "type": "TIMESTAMP",
        "nullable": false,
        "comment": "数据时间戳 (15分钟整点)"
      },
      {
        "name": "park_id",
        "type": "VARCHAR(32)",
        "nullable": false,
        "comment": "所属园区编码 (PK-XJ-01)"
      },
      {
        "name": "unit_id",
        "type": "VARCHAR(32)",
        "nullable": false,
        "comment": "经营单位编码"
      },
      {
        "name": "energy_type",
        "type": "VARCHAR(16)",
        "nullable": false,
        "comment": "能源介质 (电/蒸汽/气/水)"
      },
      {
        "name": "instant_val",
        "type": "DECIMAL(14,4)",
        "nullable": true,
        "comment": "采样瞬时物理量 (kW, t/h, m³/h)"
      },
      {
        "name": "accum_reading",
        "type": "DECIMAL(18,4)",
        "nullable": false,
        "comment": "表计累计止度 (kWh, kg, m³, t)"
      },
      {
        "name": "period_diff",
        "type": "DECIMAL(14,4)",
        "nullable": false,
        "comment": "本周期差值实物消耗量"
      },
      {
        "name": "ratio_multiplier",
        "type": "INT",
        "nullable": false,
        "comment": "互感器/变比倍率 (默认 1)"
      },
      {
        "name": "quality_flag",
        "type": "SMALLINT",
        "nullable": false,
        "comment": "数据质量标志 (0正常, 1插值, 2超量程, 3倒走拦截)"
      }
    ]
  },
  {
    "tableName": "dwd_pcf_order_stage_process",
    "tableComment": "产品碳足迹订单工序能耗与物料追踪事实表",
    "storageEngine": "PostgreSQL / MySQL 8.0",
    "fields": [
      {
        "name": "order_id",
        "type": "VARCHAR(64)",
        "nullable": false,
        "comment": "生产订单号 (如 SO-260710)"
      },
      {
        "name": "item_no",
        "type": "INT",
        "nullable": false,
        "comment": "订单行号"
      },
      {
        "name": "product_model",
        "type": "VARCHAR(128)",
        "nullable": false,
        "comment": "产品规格型号"
      },
      {
        "name": "stage_name",
        "type": "VARCHAR(32)",
        "nullable": false,
        "comment": "LCA 阶段 (原材料/运输/制造/处置)"
      },
      {
        "name": "process_name",
        "type": "VARCHAR(64)",
        "nullable": false,
        "comment": "关键工序 (绕线/干燥/固化/交联)"
      },
      {
        "name": "grid_power_kwh",
        "type": "DECIMAL(14,4)",
        "nullable": false,
        "comment": "分摊市电量 (kWh)"
      },
      {
        "name": "green_power_kwh",
        "type": "DECIMAL(14,4)",
        "nullable": false,
        "comment": "分摊直供绿电量 (kWh)"
      },
      {
        "name": "steam_kg",
        "type": "DECIMAL(14,4)",
        "nullable": false,
        "comment": "分摊工业蒸汽消耗 (kg)"
      },
      {
        "name": "stage_carbon_kg",
        "type": "DECIMAL(14,4)",
        "nullable": false,
        "comment": "该工序综合碳排放量 (kgCO2e)"
      }
    ]
  }
];

export const SCADA_TAG_ITEMS: ScadaTagItem[] = [
  {
    "tag": "XJ_TRANS_P1_P_TOT",
    "name": "新变总降配电房 1#主变有功功率",
    "medium": "电力",
    "unit": "kW",
    "range": "0 ~ 10000",
    "freq": "15s",
    "level": "L2"
  },
  {
    "tag": "XJ_TRANS_P1_EP_IMP",
    "name": "新变总降 1#主变正向有功总电能底度",
    "medium": "电力",
    "unit": "kWh",
    "range": "0 ~ 99999999",
    "freq": "15min",
    "level": "L3"
  },
  {
    "tag": "XJ_STEAM_F1_MASS",
    "name": "变压器二车间气相干燥蒸汽质量流量",
    "medium": "蒸汽",
    "unit": "t/h",
    "range": "0 ~ 20",
    "freq": "1min",
    "level": "L2"
  },
  {
    "tag": "LL_CABLE_XL_N2_FLOW",
    "name": "鲁缆超高压立塔交联线高纯氮气瞬时流量",
    "medium": "液氮",
    "unit": "Nm³/h",
    "range": "0 ~ 50",
    "freq": "1min",
    "level": "L2"
  },
  {
    "tag": "HB_GAS_M1_TOTAL",
    "name": "衡变新园区天然气总表累计供气量",
    "medium": "天然气",
    "unit": "m³",
    "range": "0 ~ 999999",
    "freq": "15min",
    "level": "L3"
  }
];

export const ERP_MAPPING_ITEMS: ErpMappingItem[] = [
  {
    "targetField": "order_id",
    "sourceSystem": "SAP ERP",
    "sourceTable": "AUFK",
    "sourceField": "AUFNR",
    "rule": "主键直连，滤除撤销订单"
  },
  {
    "targetField": "product_model",
    "sourceSystem": "SAP ERP",
    "sourceTable": "AFPO",
    "sourceField": "MATNR",
    "rule": "去除前置零，映射标准型号字典"
  },
  {
    "targetField": "finished_qty",
    "sourceSystem": "MES 完工单",
    "sourceTable": "mes_work_order",
    "sourceField": "qualified_qty",
    "rule": "质检合格入库数量"
  },
  {
    "targetField": "bom_copper_kg",
    "sourceSystem": "PLM / ERP BOM",
    "sourceTable": "STPO",
    "sourceField": "MENGE",
    "rule": "匹配物料大类铜杆 (CU-01)"
  }
];

export const SECURITY_LEVEL_ITEMS: SecurityLevelItem[] = [
  {
    "level": "L0 (公开级)",
    "scope": "园区宣传大屏成效、零碳转型对外宣传里程碑、企业官网ESG荣誉成果",
    "storage": "普通明文存储",
    "transmission": "标准 HTTPS 传输"
  },
  {
    "level": "L1 (内部级)",
    "scope": "全厂多能流实时总用电量、综合折标能耗走势、各车间设备在线状态",
    "storage": "普通明文存储",
    "transmission": "强制 TLS 1.3 传输"
  },
  {
    "level": "L2 (工作秘密)",
    "scope": "各经营单位用能成本金额 (电费/水费/气费)、产品单耗横向对标排名、告警规则",
    "storage": "数据库敏感脱敏",
    "transmission": "传输带防重放 Token 鉴权"
  },
  {
    "level": "L3 (核心商密)",
    "scope": "客户出口订单详情、BOM 实景物料消耗定额、供应商碳排放因子真实数据",
    "storage": "国密 SM4 数据库密文存储",
    "transmission": "双向证书 mTLS 强认证"
  },
  {
    "level": "L4 (绝密级)",
    "scope": "股份集团高层战略对标底表、未公开涉密装备专线能耗",
    "storage": "硬件加密机 (HSM) 隔离",
    "transmission": "专网物理隔离"
  }
];

export const DATA_DICTIONARY = {
  dwdTables: DWD_TABLES,
  scadaTags: SCADA_TAG_ITEMS,
  erpMesMappings: ERP_MAPPING_ITEMS,
  securityLevels: SECURITY_LEVEL_ITEMS,
};

/* 6. 系统全功能页面导航拓扑树 (37 节点 1对1 映射深度规格) */
export const SYSTEM_FUNCTIONAL_TREE: CenterNavTree[] = [
  {
    "centerKey": "zero-carbon",
    "centerName": "零碳园区集控中心",
    "groups": [
      {
        "title": "集控中心大屏",
        "icon": "LayoutDashboard",
        "children": [
          {
            "title": "全景环幕大屏",
            "href": "/zero-carbon/screen",
            "specId": "spec-screen-panoramic"
          },
          {
            "title": "综合集控大屏 (16:9)",
            "href": "/screen/control-center",
            "specId": "spec-screen-control-center"
          }
        ]
      },
      {
        "title": "集中监管",
        "icon": "MonitorCog",
        "children": [
          {
            "title": "指标管控",
            "href": "/zero-carbon/monitor/indicator",
            "specId": "spec-monitor-indicator"
          },
          {
            "title": "用能在线监测",
            "href": "/zero-carbon/monitor/online/usage",
            "specId": "spec-monitor-usage"
          },
          {
            "title": "工业微电网监测",
            "href": "/zero-carbon/monitor/online/microgrid",
            "specId": "spec-monitor-microgrid"
          },
          {
            "title": "能源碳排放监测",
            "href": "/zero-carbon/monitor/carbon-emission",
            "specId": "spec-monitor-carbon-emission"
          }
        ]
      },
      {
        "title": "能耗能效分析",
        "icon": "Gauge",
        "children": [
          {
            "title": "用能结构分析",
            "href": "/zero-carbon/energy/structure",
            "specId": "spec-energy-structure"
          },
          {
            "title": "能源成本分析",
            "href": "/zero-carbon/energy/cost",
            "specId": "spec-energy-cost"
          },
          {
            "title": "单位产品能耗",
            "href": "/zero-carbon/energy/unit-product",
            "specId": "spec-energy-unit-product"
          },
          {
            "title": "单位产值能耗",
            "href": "/zero-carbon/energy/unit-output",
            "specId": "spec-energy-unit-output"
          },
          {
            "title": "对标管理",
            "href": "/zero-carbon/energy/benchmark",
            "specId": "spec-energy-benchmark"
          }
        ]
      },
      {
        "title": "零碳项目评估",
        "icon": "ClipboardCheck",
        "children": [
          {
            "title": "项目档案管理",
            "href": "/zero-carbon/project/archive",
            "specId": "spec-project-archive"
          },
          {
            "title": "实时监控",
            "href": "/zero-carbon/project/monitoring",
            "specId": "spec-project-monitoring"
          },
          {
            "title": "项目运行评估",
            "href": "/zero-carbon/project/benefit",
            "specId": "spec-project-benefit"
          },
          {
            "title": "零碳工厂自评估",
            "href": "/zero-carbon/project/self",
            "specId": "spec-project-self"
          }
        ]
      },
      {
        "title": "统计报表",
        "icon": "FileBarChart",
        "children": [
          {
            "title": "用能报表",
            "href": "/zero-carbon/reports/usage",
            "specId": "spec-reports-usage"
          },
          {
            "title": "成本报表",
            "href": "/zero-carbon/reports/cost",
            "specId": "spec-reports-cost"
          },
          {
            "title": "单耗报表",
            "href": "/zero-carbon/reports/unit",
            "specId": "spec-reports-unit"
          }
        ]
      },
      {
        "title": "基础管理",
        "icon": "Settings2",
        "children": [
          {
            "title": "数据录入",
            "href": "/zero-carbon/config/entry",
            "specId": "spec-config-entry"
          },
          {
            "title": "组件规范库",
            "href": "/design-system",
            "specId": "spec-design-system"
          }
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
          {
            "title": "集团驾驶舱",
            "href": "/carbon-footprint/cockpit",
            "specId": "spec-footprint-dashboard"
          }
        ]
      },
      {
        "title": "多维分析",
        "icon": "BarChart3",
        "children": [
          {
            "title": "横向对比",
            "href": "/carbon-footprint/analysis/compare",
            "specId": "spec-footprint-compare-horizontal"
          },
          {
            "title": "纵向对比与总览",
            "href": "/carbon-footprint/analysis/ranking",
            "specId": "spec-footprint-compare-vertical"
          }
        ]
      },
      {
        "title": "实景数据库",
        "icon": "Database",
        "children": [
          {
            "title": "实景数据库",
            "href": "/carbon-footprint/database/realscene",
            "specId": "spec-footprint-realscene"
          },
          {
            "title": "碳足迹核算",
            "href": "/carbon-footprint/database/accounting",
            "specId": "spec-footprint-calc"
          },
          {
            "title": "碳足迹报告",
            "href": "/carbon-footprint/database/report",
            "specId": "spec-footprint-report"
          }
        ]
      },
      {
        "title": "CBAM管理",
        "icon": "ShieldCheck",
        "children": [
          {
            "title": "合规管理",
            "href": "/carbon-footprint/cbam/compliance",
            "specId": "spec-footprint-cbam-compliance"
          },
          {
            "title": "申报模拟",
            "href": "/carbon-footprint/cbam/declaration",
            "specId": "spec-footprint-cbam-declare"
          },
          {
            "title": "知识库",
            "href": "/carbon-footprint/cbam/knowledge",
            "specId": "spec-footprint-cbam-kb"
          }
        ]
      },
      {
        "title": "第三方认证管理",
        "icon": "BadgeCheck",
        "children": [
          {
            "title": "认证资料维护",
            "href": "/carbon-footprint/certification/material",
            "specId": "spec-footprint-cert-material"
          },
          {
            "title": "认证申请",
            "href": "/carbon-footprint/certification/apply",
            "specId": "spec-footprint-cert-apply"
          },
          {
            "title": "认证结果管理",
            "href": "/carbon-footprint/certification/result",
            "specId": "spec-footprint-cert-result"
          }
        ]
      },
      {
        "title": "因子库管理",
        "icon": "Boxes",
        "children": [
          {
            "title": "原材料碳排因子",
            "href": "/carbon-footprint/factor/material",
            "specId": "spec-footprint-factor-material"
          },
          {
            "title": "电力碳排因子",
            "href": "/carbon-footprint/factor/power",
            "specId": "spec-footprint-factor-grid"
          },
          {
            "title": "能源活动碳排因子",
            "href": "/carbon-footprint/factor/energy",
            "specId": "spec-footprint-factor-fuel"
          },
          {
            "title": "折标煤系数库",
            "href": "/carbon-footprint/factor/coal",
            "specId": "spec-footprint-factor-coal"
          }
        ]
      }
    ]
  }
];
