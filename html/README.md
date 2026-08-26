# 🌐 特变电工能碳双中心 · 静态 HTML 产品原型交付包

---

## 📌 概述
本文件夹（`html/`）为特变电工“双中心”数字化集成平台（**零碳园区集控中心 + 产品碳足迹集采中心**）的**全量静态 HTML 原型交付包**。包含全部 54 个页面路由的高保真静态页面及单文件离线交互演示原型。

---

## 🚀 运行与查看方式

### 方式 1：使用任意静态 Web 服务器打开（推荐体验全部 54 个子路由）
在终端中进入本目录或项目根目录，执行任意以下静态托管命令：

```bash
# 方式 A：使用 npx serve (Node 环境)
npx serve d:/Project/TJ-nengtan/html -p 8080

# 方式 B：使用 Python 内置 HTTP 服务
python -m http.server 8080 -d d:/Project/TJ-nengtan/html
```
打开浏览器访问：👉 **`http://localhost:8080`**

---

### 方式 2：无环境直接双击运行（离线单文件高保真版）
直接在资源管理器中**双击打开**以下文件：
👉 **[`standalone_demo.html`](./standalone_demo.html)**
* 内置完整响应式样式、Tailwind CSS、ECharts 与 Lucide 图标；
* 无需安装任何环境与依赖，断网环境下依然可丝滑交互！

---

## 📂 核心页面与子模块索引

| 页面文件 / 路径 | 对应业务板块 | 核心交互特性 |
| :--- | :--- | :--- |
| **`index.html`** | **集团双中心门户引导页** | 通透科技渐变、3D 玻璃拟态卡片、5栏实时指标条 |
| **`zero-carbon/screen.html`** | **零碳园区能碳双控数据大屏** | 3D 虚拟沙盘、天气模拟联动、储能控制舱、Sankey 能流 |
| **`zero-carbon/monitor/indicator.html`** | **指标管控 (4 维 PK 看板)** | 1-2级组织树、工厂间/同产品/产线/批次 PK、7 板块工序抽屉 |
| **`zero-carbon/monitor/online.html`** | **在线监测全景工作台** | 宏观五大指标遥测舱、重点设备树(模糊搜索)、关键工序市电绿电拆解 |
| **`carbon-footprint/database.html`** | **碳足迹实景数据库** | 21家单位核算一张图、工序能耗时序追踪、BOM 数据链穿透 |
| **`carbon-footprint/analysis.html`** | **碳足迹多维分析平台** | 红黑榜Top10订单穿透、双滑块低碳技术选型模拟(再生铜+绿电) |
| **`carbon-footprint/cbam.html`** | **欧盟碳关税 (CBAM) 专区** | 变压器/电缆 HS 映射、€82 关税情景测算、XML 申报包一键下载 |
| **`carbon-footprint/cockpit.html`** | **碳足迹对外示范驾驶舱** | 动态气泡地图(总碳排+碳强度)、经营单位下钻与第三方认证轮播 |
