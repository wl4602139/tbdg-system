# 特变电工（电装集团）能源双中心数字化集成平台 v1.01

> **特变电工股份有限公司 · 零碳园区集控中心 & 产品碳足迹集采中心**  
> 专为特变电工（电装集团）打造的工业级能碳管理、碳足迹核算、能效对标与减排资产全景数字化平台。

---

## 🌟 平台核心功能模块架构

系统包含 10 大核心子模块，支持在顶栏快捷切换【零碳园区集控中心】与【产品碳足迹集采中心】：

### 1. 零碳园区集控中心
- **集控中心大屏** (`/zero-carbon/screen`)：全景高保真微电网与工业能效三维物联看板；
- **集中监管模块** (`/zero-carbon/monitor/...`)
  - **指标管控** (`/zero-carbon/monitor/indicator`)：
    - **一、经营单位及项目公司整体指标** (前 10 项综合指标，如综合能源消费量、单位产值能耗、万元产值用水量(ESG)等)；
    - **二、产品管控指标** (5 大标准单位产品指标：能耗 e=E/M、电耗 q_电=Q/M、蒸汽耗 q_蒸汽=Q/M、天然气耗 q_天然气=Q/M、水耗 q_水=Q/M，支持直接跳转至单位产品能耗分析)；
    - **三、关键制造工序能效管控指标** (全量 47 项标准工序指标，覆盖序号 17-65 拉丝、交联、高压/中低压干燥固化、试验、钣金、喷涂、套管、互感器、二次SMT/波峰焊、电容器、GIL、GIS、铁心纵剪/叠装等)；
    - ** Mode A ⇄ Mode B 双模式**：点击任意卡片进入 Mode B 详情内页，包含指标标准定义、核算数学公式、数据来源与采集路径、近12个月趋势折线图、以及近12个月历史台账（拆解水、电、气、蒸汽 4 大底层能源介质）；
  - **在线监测** (`/zero-carbon/monitor/online`)：
    - **Tab 1 (电网全景监测)**：左侧树呈现 **园区 ➔ 企业** 拓扑；
    - **Tab 2 (重点用能设备监测)**：左侧树呈现 **企业 ➔ 设备** 拓扑；
    - **Tab 3 (关键工序监测)**：左侧树呈现 **1级企业 ➔ 2级工序** 拓扑；
    - 节点默认收起，展开节点可查看物联感知的仪表读数；
  - **绿电监测** (`/zero-carbon/monitor/green`)：包含自建分布式光伏(50%)、市场化交易绿电(28%)、中国绿证GEC核销(14%) 3 大来源构成卡片，并绘制 24 小时出力量/消纳/超发上网曲线与各地上网电价基准；
- **能耗能效分析** (`/zero-carbon/energy/...`)
  - **能源成本分析** (`/zero-carbon/energy/cost`)：南丁格尔玫瑰图、折标单价横向条形图、绿色降本指导、绿电收益4大卡片；
  - **用能结构分析** (`/zero-carbon/energy/structure`)：6 大二级单位水电能耗与工序分析；
  - **单位产品能耗 / 单位产值能耗 / 对标管理** (`/zero-carbon/energy/unit-product, unit-output, benchmark`)；
- **碳管理模块** (`/zero-carbon/carbon/...`)：碳排放核算 (ISO 14064 范围一二三)、碳排放分析、碳核算报告；
- **零碳项目与减排** (`/zero-carbon/project/...`)：项目台账、减排建模、效益评估、CCER 资产池；
- **统计报表** (`/zero-carbon/reports/...`)：用能报表、成本报表、单耗报表 (分变压器 kVA / 线缆 km 产业分类统计)、碳排报表 (纯客观统计，绝不包含惩罚/达标标签)；
- **数据采集与配置** (`/zero-carbon/data-catalog, alarm, config, assistant`)。

### 2. 产品碳足迹集采中心
- **足迹驾驶舱** (`/carbon-footprint/cockpit`)
- **生命周期建模与分析** (`/carbon-footprint/analysis`)
- **CBAM 欧盟碳关税合规** (`/carbon-footprint/cbam`)
- **碳足迹认证与因子库** (`/carbon-footprint/certification, database, factor`)

---

## 🛠️ 技术栈与部署说明

- **前端框架**：Next.js 16 (App Router + Turbopack)
- ** UI 组件与样式**：React 19 + Tailwind CSS + Lucide React 图标库 + Recharts / Highcharts 适配组件
- **静态导出 (Static Export)**：原生支持 100% 静态页面打包 (`npm run build` 生成 54/54 全量静态路由)

### 本地开发与构建指南

```bash
# 1. 安装依赖 (如果尚未安装)
npm install

# 2. 启动开发服务器 (HTTP://localhost:3000)
npm run dev

# 3. 生产环境构建与静态导出校验
npm run build
```

---

## 📁 目录结构

```
TJ-nengtan/
├── html/                     # 原始 HTML/Tailwind 原型页面
└── 产品原型/                  # 现代化 Next.js App Router 完整源代码
    ├── app/                  # 54 个全量页面组件 (App Router)
    │   ├── docs/             # 在线开发手册页面
    │   ├── carbon-footprint/ # 产品碳足迹集采中心子路由
    │   └── zero-carbon/      # 零碳园区集控中心子路由
    ├── components/           # 复用 UI 组件
    │   └── shared/           # 标准拓扑树 (StandardOrgTree)、PlatformShell、Charts 组件
    └── lib/                  # 导航配置 (nav-config.ts)、组织树机构 (org.ts)
```

---

*© 2026 特变电工股份有限公司 版权所有*
