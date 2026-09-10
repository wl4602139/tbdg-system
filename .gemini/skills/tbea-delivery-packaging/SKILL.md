---
name: tbea-delivery-packaging
description: "特变电工能碳数字化双中心标准化交付工程包与发布流水线规范。覆盖三大核心交付包（全套双端+PRD总包、暗黑版独立包、浅色版独立包）、包内目录结构规范（00_PRD需求字典、01_浅色端源码、02_暗黑端源码、DEVELOPER_GUIDE.md）、Windows开箱即用批处理启动脚本、权威业务表与全量开发手册挂载、8.215远程生产部署前置静态构建验证、代码排除白名单（node_modules/.next/out/.git等）及交付完整性审计。在执行项目打包、交付包签发、交接归档或部署准备时必须全量遵循。"
---

# 特变电工能碳数字化双中心 · 标准化交付工程包与发布规范 (TBEA Delivery Packaging Standards)

本规范深度固化特变电工（TBEA）“能碳数字化双中心”（零碳园区集控中心 + 产品碳足迹集采中心）的前端交付工程包结构、自动化打包流水线与交付纪律。  
当用户提出“打包前端”、“签发交付包”、“导出工程包给开发继续开发”或“参考昨天打包的前端项目”时，**必须全量激活并严格遵循本 Skill**。

---

## 一、 交付核心原则与目标 (Core Delivery Principles)

1. **零配置、开箱即用 (Zero-Barrier Setup)**：
   - 交付对象面向客户技术团队、后端开发人员或第三方系统集成商；
   - 接收人员解压后**无需进行复杂的 Node.js / monorepo / 环境变量配置**，双击 Windows 批处理脚本（`.bat`）即可自动检测安装包管理器、安装依赖并启动本地服务器；
2. **源码纯净无噪 (Clean Source Tree)**：
   - 严格剔除开发构建缓存、依赖库二进制文件及本地临时日志，保证包体积轻量且不含机器特异性产物；
3. **业务需求与技术手册强闭环 (PRD & Manuals Bundled)**：
   - 交付包中不仅包含源码，**必须 100% 随包内嵌权威业务规格文档**（PRD v1.1 Word、工序对应表、线缆产线分类、园区空间映射、指标管控字典、变更演化日志及全套 35 篇技术手册）；
4. **双端同构对齐 (Dual-Theme Parity)**：
   - 暗黑科技蓝（3000）与浅色商务办公（3001）双端必须 100% 同构对齐，提供统一的独立版本与旗舰总包。

---

## 二、 三大标准化交付工程包体系 (Three Standard Delivery Packages)

交付流水线必须在项目根目录（`D:\Project\TJ-nengtan\`）规范签发以下 3 套交付文件包：

| 序号 | 交付包标准文件名称 | 规格大小 | 目标受众与交接场景 | 内部顶级结构 |
| :---: | :--- | :---: | :--- | :--- |
| **01** | **`特变电工能碳数字化双中心_全套前端完整开发交付总包(含双端与全套PRD文档).zip`** | **~29.3 MB** | **⭐ 官方推荐旗舰总包**<br>交付项目技术负责人、架构师、系统集成主力团队 | • `01_浅色商务端工程源码(端口3001)`<br>• `02_暗黑科技蓝工程源码(端口3000)`<br>• `00_PRD需求规格说明书与业务字典`<br>• `DEVELOPER_GUIDE.md` |
| **02** | **`特变电工能碳数字化双中心_前端开发交付完整工程包_暗黑科技蓝版.zip`** | **~18.2 MB** | **暗黑科技蓝专属独立工程包**<br>交付集控展厅大屏系统开发团队（端口 3000） | • `tbea-nengtan-dark-project/`（内嵌源码、启动bat、PRD文档与开发指南） |
| **03** | **`特变电工能碳数字化双中心_前端开发交付完整工程包_浅色商务版.zip`** | **~18.2 MB** | **浅色商务办公专属独立工程包**<br>交付企业日常能碳管理与协同人员（端口 3001） | • `tbea-nengtan-light-project/`（内嵌源码、启动bat、PRD文档与开发指南） |

---

## 三、 交付总包标准目录树规范 (Master Package Directory Architecture)

旗舰交付总包解压后必须呈现以下清晰、规范、职责分明的顶级拓扑结构：

```
特变电工能碳数字化双中心_全套前端完整开发交付总包(含双端与全套PRD文档)/
├── 00_PRD需求规格说明书与业务字典/
│   ├── 特变电工能碳数字化双中心_产品需求规格说明书_PRD_v1.1.docx    # 🌟 官方正式 PRD 需求规格说明书
│   ├── 特变电工能碳数字化双中心_产品需求规格说明书_PRD_v1.0.docx
│   ├── 生产单位与涉及关键工序对应表(1).et                           # 🏭 10家无工序/有工序白名单权威表
│   ├── 园区-工厂对应关系表.et                                       # 🏢 15大产业园区与工厂空间分布映射
│   ├── 线缆产线分类.xlsx                                            # 🔌 8大标准所属产线与分类映射表
│   ├── “双中心”项目能碳管控指标体系V1.5(1).xlsx                      # 📊 双中心管控指标体系字典
│   ├── MODIFICATIONS_LOG.md                                       # 📜 全量系统演进功能变更追溯日志
│   ├── AGENTS.md                                                  # 🤖 Agent 开发准则与工程纪律
│   └── 开发手册(35篇)/                                             # 📚 涵盖 35 篇详细开发技术落地手册
├── 01_浅色商务端工程源码(端口3001)/
│   ├── app/                                                       # Next.js 16 全量 77 个页面源码
│   ├── components/                                                # 44px 工业高密组件库
│   ├── lib/                                                       # 指标字典、算力引擎、Mock契约
│   ├── public/                                                    # 静态媒体与 GeoJSON 地图数据
│   ├── package.json                                               # 完整依赖清单
│   ├── pnpm-lock.yaml                                             # 依赖严格锁文件 (实现100%幂等安装)
│   ├── 一键安装依赖并启动.bat                                      # 🚀 Windows 一键免配安装启动
│   └── 启动开发调试服务.bat                                        # ⚡ 日常调试秒级拉起服务
├── 02_暗黑科技蓝工程源码(端口3000)/
│   ├── app/                                                       # 100% 同构暗黑端全量 77 个页面源码
│   ├── components/、lib/、public/                                 # 共享核心工业组件与样式资产
│   ├── 一键安装依赖并启动.bat
│   └── 启动开发调试服务.bat
└── DEVELOPER_GUIDE.md                                             # 📖 全套系统集成与二次开发手册
```

---

## 四、 源码过滤白名单与黑名单规范 (Source Tree Filter Rules)

在打包源码工程时，必须严格执行目录与文件排除，严禁将以下杂质打入交付包：

### 1. 严格排除黑名单 (Must Ignore)
- **依赖与构建缓存目录**：
  - `node_modules/`（体积过大且包含平台特异性二进制文件）
  - `.next/`（本地 Next.js 开发运行时与增量缓存）
  - `out/`（静态导出产物，源码包无需包含）
  - `.turbo/`
  - `.pnpm-store/`
- **版本控制与 IDE 配置**：
  - `.git/`、`.gitignore`（若不需要）、`.vscode/`、`.idea/`
- **临时与构建副产物文件**：
  - `*.log`、`npm-debug.log*`、`yarn-debug.log*`、`pnpm-debug.log*`
  - `*.tsbuildinfo`
  - `*.zip`、`*.tar.gz`（严禁套娃压缩）

### 2. 必须包含白名单 (Must Include)
- 完整应用路由与组件：`app/`、`components/`、`lib/`、`public/`、`data/`、`docs/`；
- 核心配置文件：`package.json`、`pnpm-lock.yaml`、`pnpm-workspace.yaml`、`tsconfig.json`、`next.config.mjs`、`postcss.config.mjs`、`components.json`；
- 平台准则：`AGENTS.md`、`CLAUDE.md`、`README.md`。

---

## 五、 Windows 免配一键运行脚本规范 (Zero-Config Batch Scripts)

每个工程包根目录下必须配备经过严密验证的 Windows 批处理脚本：

### 1. `一键安装依赖并启动.bat`
```bat
@echo off
chcp 65001 >nul
title 特变电工能碳双中心 · 开发环境一键安装与启动
echo =========================================================
echo   特变电工能碳数字化双中心 - 前端开发环境准备与启动
echo =========================================================
echo.

echo 1. 正在检查 pnpm 包管理器...
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo [提示] 未检测到 pnpm，正在通过 npm 安装 pnpm...
    call npm install -g pnpm
)

echo.
echo 2. 正在安装工程依赖 (pnpm install)...
call pnpm install
if %errorlevel% neq 0 (
    echo [错误] 依赖安装失败，请检查网络或 Node.js 环境！
    pause
    exit /b %errorlevel%
)

echo.
echo 3. 依赖安装完成！正在启动本地开发调试服务...
echo 访问地址: http://localhost:PORT
start "" http://localhost:PORT
call pnpm dev -p PORT
pause
```
*(注：浅色端 PORT 设为 3001，暗黑端 PORT 设为 3000)*

### 2. `启动开发调试服务.bat`
```bat
@echo off
chcp 65001 >nul
title 特变电工能碳双中心 · 本地开发调试服务
echo =========================================================
echo   特变电工能碳数字化双中心 - 本地开发调试服务启动中...
echo =========================================================
echo.
echo 启动端口: PORT
echo 正在打开默认浏览器: http://localhost:PORT
echo.
start "" http://localhost:PORT
call pnpm dev -p PORT
pause
```

---

## 六、 交付手册 `DEVELOPER_GUIDE.md` 编制标准 (Integration Guide Spec)

每个总包根目录必须内嵌标准 `DEVELOPER_GUIDE.md`，至少包含以下七大核心章节：
1. **项目背景与业务架构**：零碳园区集控中心 + 产品碳足迹集采中心；
2. **技术栈与环境要求**：Next.js 16 (App Router) + React 19 + Tailwind CSS 4 + ECharts 6 + Recharts 3 + TypeScript 5，Node.js 20.x + pnpm；
3. **快速启动与常用命令**：`pnpm install`、`pnpm dev -p 3001`、`pnpm build`；
4. **核心目录拓扑与模块分布**：全量 77 个页面与 `lib/` 字典分布；
5. **后端 API 接口替换与集成指引**：
   - `standard-org-tree.tsx` 组织树对接 `/api/v1/org/tree`；
   - `lib/indicators.ts` 桑基图与 10 大指标对接 `/api/v1/metrics/sankey`；
   - `online/usage` 峰平谷与非电工序负荷切换逻辑；
   - `carbon-footprint/cockpit` 单代表型号卡片与细分对比弹窗对接；
6. **特变电工专属工业设计硬性规范**：
   - 44px 强制表格行高 (`h-[44px]`)；
   - 客观中立原则（杜绝主观褒贬与定性说教文字）；
   - 空状态单行极简结论（`暂无相关工序！` / `暂无相关产品！`）；
   - 工序白名单机制（10家无工序单位精准判空）；
   - 图表微透科技蓝悬停游标；
   - 纯净“返回”按钮与极简无噪卡片。
7. **附带文档与权威业务表格清单**：PRD Word、工序表、产线分类表、园区表、35篇开发手册索引。

---

## 七、 自动化打包执行流水线 (Automated Packaging Pipeline)

本项目在 `.gemini/skills/tbea-delivery-packaging/scripts/package_release.py` 内置了工业级打包引擎。执行流水线步骤如下：

```bash
# 执行自动化打包脚本
py .gemini/skills/tbea-delivery-packaging/scripts/package_release.py
```

### 自动化执行步骤流：
1. **前置构建检查**：必须确保双端 `pnpm build` **77/77 静态路由 0 报错通过**；
2. **浅色版打包**：遍历 `产品原型-旧/产品原型`，写入 `DEVELOPER_GUIDE.md`、批处理脚本与 PRD 核心文件，生成 `...浅色商务版.zip`；
3. **暗黑版打包**：遍历 `产品原型`，写入 `DEVELOPER_GUIDE.md`、批处理脚本与 PRD 核心文件，生成 `...暗黑科技蓝版.zip`；
4. **全套交付总包打包**：构建包含 `01_浅色`、`02_暗黑`、`00_PRD`（含 35 篇手册）及根目录 `DEVELOPER_GUIDE.md` 的旗舰总包；
5. **完整性校验**：通过 `zf.testzip() is None` 进行 CRC 校验，断言关键文件数量与核心入口；
6. **建档与日志维护**：原位更新根目录 `MODIFICATIONS_LOG.md` 第 6.7 节并记录时间戳与包体积。

---

## 八、 交付与部署最高铁律 (Execution Disciplines)

1. ❌ **严格禁止自动推送线上或自动 Git 提交**：
   - 打包完成后，交付文件保存在本地根目录 `D:\Project\TJ-nengtan\`；
   - **绝不允许**在未获得用户明确指令前向远程生产服务器（`8.215.89.194`）推送发布；
   - **绝不允许**在未获得用户明确指令前自动执行 `git commit` 或 `git push`；
2. ✅ **指令触发制**：
   - 必须等待用户明确下达“部署到 8.215 线上”、“提交 Git 代码”或“推送上线”指令后，方可触发后续发布流程。
