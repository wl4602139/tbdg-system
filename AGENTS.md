# 特变电工能碳数字化双中心 · Agent 开发与工程维护准则 (AGENTS.md)

本项目为特变电工（TBEA）“双中心”数字化平台（零碳园区集控中心 + 产品碳足迹集采中心）。所有在本项目中运行的 AI 编程 Agent（Antigravity、Gemini、Claude、Cursor 等）在执行代码编写、页面重构、UI样式调整或功能维护时，**必须无条件遵循本文档记录的建档信息、专属技能（Skill）规范与日常维护工作守则**。

---

## 一、 功能修改建档信息与结构 (Documentation & Archiving Standards)

### 1. 全局修改档案定位
- **核心档案文件**：[`MODIFICATIONS_LOG.md`](./MODIFICATIONS_LOG.md)（位于项目根目录）。
- **建档目标**：全面收敛并结构化记录各业务功能模块的演进脉络，为客户、产品、设计与工程团队提供清晰、透明、权威的功能变更追溯档案。

### 2. 档案维护的模块聚类结构
严禁采用杂乱无序的流水账记录，所有功能修改的建档信息**必须严格按照以下六大核心业务功能模块**进行聚类维护：
1. **集中监管 (Zero-Carbon Monitor)**：
   - 用能在线监测 (`zero-carbon/monitor/online/usage`)
   - 设备在线监测 (`zero-carbon/monitor/online/equipment`)
   - 工业微电网监测 (`zero-carbon/monitor/online/microgrid`)
   - 指标管控看板 (`zero-carbon/monitor/indicator`)
2. **专项能效与评估 (Zero-Carbon Project & Benefit)**：
   - 节能效益评估 (`zero-carbon/project/benefit`)
   - 零碳工厂自评估 (`zero-carbon/project/self`)
3. **能效对标分析 (Zero-Carbon Energy)**：
   - 单位产品能耗与工序能耗对标 (`zero-carbon/energy/unit-product` & `benchmark`)
   - 能耗综合分析与万元产值单耗 (`structure`, `unit-output`)
4. **集中监控大屏 (Executive Screen)**：
   - 零碳园区集控大屏 (`zero-carbon/screen` & `screen/executive`)
5. **碳足迹集采中心 (Carbon Footprint)**：
   - 碳足迹数据台账与追溯 (`carbon-footprint/database/accounting`)
   - CBAM 碳边境调节机制与因子库 (`cbam`, `factor`)
6. **专属设计系统与工程规范 (Design System & Skills)**：
   - 特变电工专属工业设计规范 (`tbea-industrial-design`)
   - Agent 指南与工程守则 (`AGENTS.md`)

### 3. 项目 PRD 需求规格说明文档 (Product Requirement Documents)
- **官方文档根目录路径**：`D:\Project\TJ-nengtan\PRD`
- **文档定位与核心目标**：全量沉淀特变电工能碳数字化双中心（零碳园区集控中心 + 产品碳足迹集采中心）各业务模块的标准 PRD 需求规格说明书、业务控制流、数据字典、API 契约与验收准则。
- **编写与维护纪律**：
  1. **分卷分模块演进**：严格按照 PRD 全局架构规划分卷建立子文档，统一于 `D:\Project\TJ-nengtan\PRD\README.md` 形成总目录索引；
  2. **多角色协同闭环 (PM + Dev + QA)**：各模块 PRD 必须深度融合产品业务价值/User Stories (INVEST+Gherkin 规范)、系统架构/数据结构、以及 QA 边界测试矩阵；
  3. **工业设计与中立性约束**：文档中所有功能与原型描述必须无条件遵循 `tbea-industrial-design` 规范（如 44px 工业高密表格行高、严格杜绝主观定性评价、双端同构同步等）。

---

## 二、 本项目专属技能规范 (Project Custom Skill: tbea-industrial-design)

为了让所有 AI Agent 具备完全一致的业务认知与工业设计直觉，本项目创建并深度固化了专属 Skill —— **`tbea-industrial-design`**。

### 1. Skill 注册定位与存储路径
- **项目级路径**：[`.gemini/skills/tbea-industrial-design/SKILL.md`](./.gemini/skills/tbea-industrial-design/SKILL.md)
- **全局级路径**：`C:\Users\54321\.gemini\config\skills\tbea-industrial-design\SKILL.md`
- **调用规则**：Agent 在执行本项目任何页面开发、UI重构、组件编写或功能迭代时，**必须优先激活并全量遵循本 Skill**。

### 2. Skill 固化的核心设计与工程准则
1. **极简克制与反冗余设计准则**：
   - **状态自解释**：严禁在卡片或控件上增加 `图表联动中`、`已选中` 等说明性标签，激活态统一由边框高亮（`border-primary ring-2`）自解释；
   - **杜绝自述式描述**：严禁在卡片或图表头部编写“点击卡片联动下方图表”、“本区域展示全厂各类能耗”等显而易见的文字，直接呈现图表与数据本身；
   - **单一职责**：下方已有切换 Tabs，上方卡片绝不重复出现切换按钮组；
   - **标题纯粹**：设备或指标卡片标题仅保留主标题名称与精炼语义图标（如 `Cpu`），彻底剥离编码、车间、协议和状态灯；
   - **空状态单行结论**：无数据或无工序时仅输出单行干练结论（如 `暂无相关工序！`），严禁大段理由与依据解释；
   - **聚焦自身对比**：设备与车间指标仅与自身历史（环比、同比）或设定基准对比，严禁捏造跨厂跨车间的虚假横向对抗；
   - **严禁评价类信息（客观中立原则）**：系统必须保持纯粹的工业数据客观性，**严禁在任何界面、卡片、图表或报表中出现主观评价类、定性评判类或说教指责类的信息**（如“电能品质：优良”、“表现优异”、“运行欠佳”、“落后单位”、“达标奖励”、“处于领跑标杆；需推进技改”等），统一以**客观时序对比（同比、环比、基准偏差量）与客观运行状态（运行中、待机、检修）**自解释呈现，将价值评估与管理裁决完全交由企业管理者。
2. **表格行高强制 44px**：
   - 全系统数据表格行高统一固定为 **`44px`**（`h-[44px]`），垂直居中，符合高密度工业监控人机工程。
3. **权威工序表白名单映射**：
   - 严格遵循《生产单位与涉及关键工序对应表(1).et》，沈变、衡变、新变、鲁缆下属智慧能源等 10 家无工序企业精准判空为 `暂无相关工序！`，有工序单位仅看自身工序。
4. **设备介质自适应与命名标准**：
   - 设备以纯电力驱动为主，卡片指标根据设备真实上传类型自适应，原“管道工作压力”统一更名为“**蒸汽消耗量**”。
5. **双端同构开发要求**：
   - 暗黑科技蓝（端口 3000）与浅色办公商务（端口 3001）双端必须 100% 同构更新。
6. **图表悬停游标微透科技蓝规范 (No-Glare Chart Cursors)**：
   - 深色模式下所有柱状图游标严禁硬编码纯白（`#f8fafc`）或依赖未设 cursor 导致的灰白实体块（`#f5f5f5`），强制显式统一为微透科技蓝 `rgba(56, 189, 248, 0.08)`，折线/面积图游标统一为 `rgba(56, 189, 248, 0.25)`；浅色模式统一为极细微灰 `rgba(0, 0, 0, 0.04)`。

### 3. 本项目 PRD 编制专属技能 (Project Custom Skill: tbea-prd-standards)
- **项目级路径**：[`.gemini/skills/tbea-prd-standards/SKILL.md`](./.gemini/skills/tbea-prd-standards/SKILL.md)
- **全局级路径**：`C:\Users\54321\.gemini\config\skills\tbea-prd-standards\SKILL.md`
- **调用规则**：Agent 在执行本项目 PRD 需求规格说明书撰写、功能章节细化、数据字典补充或验收矩阵设计时，**必须优先激活并全量遵循本 Skill**。
- **核心规范要点**：
  1. **PRD 10 大标准板块**：元数据审签、背景定位、角色画像、系统架构数据流、设计规范、详细功能需求、数据字典/公式、NFR非功能需求、接口契约、QA验收矩阵；
  2. **主导航逐层拆解法**：功能需求严格映射真实系统的系统顶层 ➔ 一级主导航 ➔ 二级子导航 ➔ 三级页面/标签页逐层展开；
  3. **PM/Dev/QA 三位一体闭环**：融入 INVEST 用户故事、Gherkin 验收准则、44px 行高约束、白名单精准判空（10家无工序单位单行输出 `暂无相关工序！`）及破坏性边界防刷测试；
  4. **Word (.docx) 工业级排版导出**：统一通过 `D:\Project\TJ-nengtan\PRD\build_prd_docx.py` 自动化引擎构建，保持深蓝封面、高密表格与 Callout 业务约束样式。

### 4. 本项目标准化交付打包专属技能 (Project Custom Skill: tbea-delivery-packaging)
- **项目级路径**：[`.gemini/skills/tbea-delivery-packaging/SKILL.md`](./.gemini/skills/tbea-delivery-packaging/SKILL.md)
- **全局级路径**：`C:\Users\54321\.gemini\config\skills\tbea-delivery-packaging\SKILL.md`
- **自动化构建脚本**：[`.gemini/skills/tbea-delivery-packaging/scripts/package_release.py`](./.gemini/skills/tbea-delivery-packaging/scripts/package_release.py)
- **调用规则**：Agent 在执行前端代码打包、签发交付包、交接归档或部署准备时，**必须优先激活并全量遵循本 Skill**。
- **核心规范要点**：
  1. **三大标准化交付工程包体系**：双端同构+PRD总包（~29.3MB）、暗黑科技蓝独立包（~18.2MB）、浅色商务办公独立包（~18.2MB）；
  2. **零门槛开箱即用**：各工程包内嵌免配置的 Windows 启动脚本（`一键安装依赖并启动.bat` 与 `启动开发调试服务.bat`），双击自适应 pnpm/npm 并在独立端口（3000/3001）快速拉起；
  3. **PRD 文档与业务字典强闭环**：随包挂载全套 PRD v1.1 docx、工序/园区/产线白名单权威对应表、MODIFICATIONS_LOG.md 以及 35 篇详尽开发手册；
  4. **纯净源码过滤铁律**：严密剔除 `node_modules`、`.next`、`out`、`.git`、`.turbo`、`.vscode` 等临时缓存产物。

### 5. Skill 持续演进机制
- 当客户提出新的交互偏好、反模式、打包交付结构或业务核算模型变更时，Agent 必须第一时间将该规则提炼并更新沉淀至 `tbea-industrial-design`、`tbea-prd-standards` 或 `tbea-delivery-packaging` 的 `SKILL.md` 中，形成闭环。

---

## 三、 Agent 日常维护工作职责与执行纪律 (Agent Maintenance Responsibilities)

### 1. 每次修改后的自动维护机制 (Automatic Log Maintenance)
- **强制触发**：Agent 在完成任何功能开发、页面优化、样式调整或 Bug 修复后，**必须在向用户汇报前自动更新 `MODIFICATIONS_LOG.md`**；
- **同功能原位合并更新原则（强制执行）**：
  - 若修改属于已有的功能模块，**严禁在文件末尾新增重复章节，必须定位到该功能模块的历史条目下方**；
  - 原位更新该模块的“最新更新时间”；
  - 追加或合并本次具体的修改项、改动动因（用户反馈/权威工序依据）；
  - 更新关联代码文件路径（必须同时标明暗黑端与浅色端路径）。

### 2. 线上部署与 Git 提交纪律：严格禁止自动执行，手动按需触发（最高执行铁律）
- ❌ **绝对严禁行为（红线）**：
  - **每次修改完成后，绝不允许自动向远程生产服务器（`8.215.89.194`）执行打包推送或 Nginx 重载**；
  - **每次修改完成后，绝不允许自动执行 `git commit` 与 `git push`**；
  - **Vue 3 工程（`VUE/` 目录）严格禁止提交 Git**：`VUE/` 目录仅作为本地独立研发与验证工作区，已在根目录 `.gitignore` 中加入全局忽略，任何情况下绝不向 Git 仓库提交或推送 `VUE/` 目录下的任何代码与资产！
- ✅ **指令触发制（Strict Manual Trigger On-Demand）**：
  - **每次任务或代码修改完成后，仅在本地执行双端静态编译检查**（`pnpm build`，确保双端 76/76 路由编译通过且 0 报错）；
  - 自动将修改内容原位维护更新至 `MODIFICATIONS_LOG.md`；
  - 向用户汇报本地自测就绪状态与修改清单，等待用户查阅；
  - **必须严格等待用户明确发出指令（例如：“提交代码”、“部署到线上”、“推送上线”等）后，才允许执行 Git 提交或线上部署流水线**。未经用户明确要求，代码仅留存本地工作区！
