import os
import sys
import zipfile
import shutil
import time

sys.stdout.reconfigure(encoding='utf-8')

root_proj = r'D:\Project\TJ-nengtan'
light_proj = r'D:\Project\TJ-nengtan\产品原型-旧\产品原型'
dark_proj = r'D:\Project\TJ-nengtan\产品原型'

dev_guide_content = """# 特变电工能碳数字化双中心 · 前端开发交接与系统集成手册 (DEVELOPER_GUIDE.md)

欢迎查阅特变电工（TBEA）“能碳数字化双中心”（零碳园区集控中心 + 产品碳足迹集采中心）最新前端交付工程包。
本手册旨在为接手继续开发的前端工程师、全栈工程师与系统集成架构师提供**端到端、零障碍**的工程接水与系统集成指导。

---

## 一、 项目背景与业务架构

本项目为特变电工电装集团建设的能碳一体化数字化管控中枢，核心涵盖两大业务中心：
1. **零碳园区集控中心**：
   - **集中监管**：用能在线监测 (`/zero-carbon/monitor/online/usage`)、重点设备在线监测 (`/zero-carbon/monitor/online/equipment`)、工业微电网监测 (`/zero-carbon/monitor/online/microgrid`)、指标管控看板 (`/zero-carbon/monitor/indicator`，5列高密双能耗卡片+桑基图+44px高密台账)、能源碳排放监测；
   - **能效对标与综合分析**：综合能耗分析、万元产值能耗/成本、单位产品能耗对标、工序单耗分析、能效对标分析 (`/zero-carbon/energy/benchmark`，5大Tab表头去噪纯净呈现)；
   - **专项能效与评估**：节能效益评估 (`/zero-carbon/project/benefit`，涵盖储能、光伏、热泵、空调 4 大核心评估体系与工业高密台账)、国家级零碳工厂自评估成熟度模型 (`/zero-carbon/project/self`，三级下钻纯净“返回”按钮、3列均匀平铺宏观KPI)；
   - **集中监控大屏**：16:9 集控中心展厅专属大屏 (`/screen/control-center`) 与零碳园区全景大屏 (`/zero-carbon/screen`)；
   - **数据申报工作台**：工厂月度能碳数据定时申报与11大类工业产品多品类柔性填报工作台 (`/zero-carbon/config/entry`，平铺直达单月档案凭证与快捷填报)。
2. **产品碳足迹集采中心**：
   - **碳足迹管理驾驶舱** (`/carbon-footprint/cockpit`，11类装备产品网格卡片仅展示1项核心标杆型号，弹窗无损查看全量细分对比)；
   - **碳足迹数据台账与追溯核算** (`/carbon-footprint/database/accounting`)；
   - **CBAM 欧盟碳边境调节机制合规与申报** (`/carbon-footprint/cbam`)；
   - **第三方认证与因子库维护** (`/carbon-footprint/factor`)。

---

## 二、 技术栈清单与环境配置要求

### 1. 核心技术栈
- **核心框架**：Next.js 16 (App Router 架构，77个全量预渲染页面路由)
- **UI 视图库**：React 19 (Server & Client Components)
- **样式引擎**：Tailwind CSS v4 + tw-animate-css + Lucide React 工业图标库
- **工业图表引擎**：
  - Apache ECharts 6.1 (用于高保真桑基图 Sankey、复杂多维坐标系)
  - Recharts 3.10 (用于时序走势 Line、双纵轴柱线混排 ComposedChart、南丁格尔玫瑰图、Donut 环形图)
  - Three.js 0.185 (用于 3D 数字孪生地图)
- **语言与规范**：TypeScript 5 (严格类型声明) + ESLint

### 2. 本地开发环境要求
- **Node.js**：推荐 `Node.js 20.x` 或 `Node.js 18.18+`
- **包管理器**：推荐使用 **`pnpm`** (v8.x 或 v9.x)
  ```bash
  # 全局安装 pnpm（若尚未安装）
  npm install -g pnpm
  ```

---

## 三、 快速启动与常用命令

### 1. 安装依赖
在解压后的工程根目录下执行：
```bash
pnpm install
```
> 💡 工程附带了严格锁定的 `pnpm-lock.yaml`，可实现 100% 幂等无冲突安装。

### 2. 启动本地开发服务
```bash
# 启动浅色商务端（默认推荐端口 3001）
pnpm dev -p 3001

# 或启动暗黑科技蓝端（默认推荐端口 3000）
pnpm dev -p 3000
```
启动成功后，在浏览器访问对应地址：
- 浅色商务端：`http://localhost:3001`
- 暗黑科技蓝端：`http://localhost:3000`
- 16:9 集控大屏：`http://localhost:3001/screen/control-center`

### 3. 生产环境静态导出构建 (Static Export)
```bash
pnpm build
```
编译产物将全量静态导出至 `out/` 目录（包含全量 77 个静态 HTML 与配套 CSS/JS/静态资源）。可直接通过 Nginx 进行纯静态托管。

---

## 四、 核心目录拓扑与模块分布

```
├── app/                                # Next.js App Router 页面路由树 (77个页面)
│   ├── layout.tsx                      # 根布局与主题底色注入
│   ├── globals.css                     # Tailwind CSS 4 主题变量定义 (:root tokens)
│   ├── screen/                         # 监控大屏模块
│   │   └── control-center/page.tsx     # 🌟 16:9 展厅集控中心专属大屏
│   ├── zero-carbon/                    # 零碳园区集控中心业务模块
│   │   ├── monitor/                    # 集中监管 (用能/设备/微电网/指标看板/碳排放)
│   │   ├── energy/                     # 综合能耗、成本对标、单位产品单耗、工序能耗
│   │   ├── project/                    # 节能效益评估、零碳工厂自评估
│   │   ├── config/entry/page.tsx       # 🌟 工厂能碳数据定时申报与11大类产品填报工作台
│   │   └── screen/page.tsx             # 零碳园区全景大屏
│   └── carbon-footprint/               # 产品碳足迹集采中心业务模块
│       ├── cockpit/page.tsx            # 碳足迹驾驶舱 (单代表型号精炼卡片)
│       ├── database/                   # 碳足迹实景数据台账与追溯核算
│       └── cbam/                       # 欧盟 CBAM 边境调节机制
├── components/                         # 通用工业 UI 组件库
│   ├── shared/
│   │   ├── charts.tsx                  # 核心图表封装 (SankeyFlow, LineTrend, BarChartGroup, Donut)
│   │   ├── standard-org-tree.tsx       # 🏢 6大经营单位 ➔ 21家已接入工厂 & 15零碳产业园区组织树
│   │   ├── online-header.tsx           # 用能/设备在线监测公共顶部控制栏
│   │   └── modal.tsx                   # 工业弹窗与 Dialog 容器
│   └── screen/                         # 大屏专属组件
├── lib/                                # 业务数据字典、计算引擎与 Mock 契约 (后端集成核心)
│   ├── indicators.ts                   # 10大集团指标字典、核算公式与桑基图数据源
│   ├── mock-data.ts                    # 经营单位与工厂用能、设备状态、峰平谷电量 Mock
│   ├── park-geo.ts                     # 15个零碳产业园区地理坐标与装机容量
│   ├── product-line-subcategories.ts   # 《线缆产线分类.xlsx》8大所属产线权威映射字典
│   └── utils.ts                        # 格式化、单位换算工具函数
├── public/                             # 静态资源 (图片、GeoJSON、图标)
├── PRD_需求文档与权威规范/              # 📚 交付附带的完整需求规格说明书与业务字典表
├── DEVELOPER_GUIDE.md                  # 📖 本手册
├── package.json                        # 项目依赖清单
├── tsconfig.json                       # TypeScript 配置
└── pnpm-lock.yaml                      # pnpm 依赖锁定版本
```

---

## 五、 后端 API 接口替换与集成指引

在后续接入后端真实 RESTful / GraphQL API 时，请重点关注以下文件模块的平滑替换：

### 1. 组织架构与工厂树 (`components/shared/standard-org-tree.tsx`)
- **当前状态**：使用本地权威白名单 `ENTERPRISE_TREE_DATA` (企业树，21家接入工厂，9家未联网工厂精准置灰禁用) 与 `PARK_ORG_TREE_DATA` (15大产业园区树)；
- **接口替换建议**：在组件内引入 TanStack Query (React Query) 或 SWR，调用后端 `/api/v1/org/tree?type=enterprise` 接口，字段契约严格遵循 `StandardOrgNode` 规范。

### 2. 集团 10 大指标管控与桑基图能流 (`lib/indicators.ts`)
- **当前状态**：`GROUP_TOP10_METRICS` 字典维护了综合能耗、总碳排放、非化石能源占比等 10 项核心指标，`getMetricSankeyData` 动态计算 1-2-3 级能流守恒矩阵；
- **接口替换建议**：直接替换 `getMetricSankeyData(metricId, dateRange)` 为后端接口调用：`GET /api/v1/metrics/sankey?metric_id={id}&start={start}&end={end}`。

### 3. 用能监测与设备运行数据 (`app/zero-carbon/monitor/online/usage` & `equipment`)
- **当前状态**：由 `OnlineHeader` 驱动时间维度（日/跨月区间）与介质类型（电/气/汽/水/油/氮），下方图表根据介质自适应渲染；
- **核心逻辑**：
  - 当选中【电力】介质时：展示【用电峰平谷时段负荷与结构监测】（尖/峰/平/谷 TOU 构成）；
  - 当选中【非电】介质（蒸汽、气、水）时：**自动隐藏峰平谷字样**，切换为【工序消耗结构与连续负荷分布】；
  - 后端接口：`GET /api/v1/monitor/usage?medium={elec|steam|gas}&period={day|month}`。

---

## 六、 特变电工专属工业设计硬性规范 (Design System Rules)

在进行后续页面迭代与新功能开发时，**必须严格遵守以下特变电工工业设计规范**：
1. **表格行高强制 44px (`h-[44px]`)**：系统内所有数据表格行高统一固定为 `44px`，垂直居中对齐；
2. **客观中立原则（严禁主观评判文字）**：严禁出现主观评价、定性评判或说教指责类信息；
3. **空状态极简单行结论**：无工序统一显示 `暂无相关工序！`，无产品显示 `暂无相关产品！`；
4. **工序白名单机制**：严格遵循《生产单位与涉及关键工序对应表(1).et》，10 家无工序单位精准判空；
5. **图表悬停游标微透科技蓝规范**：深色游标统一为 `rgba(56, 189, 248, 0.08)`，浅色为 `rgba(0, 0, 0, 0.04)`；
6. **极简克制与状态自解释**：严禁出现“图表联动中”等多余标签，返回按钮统一精炼为“返回”。

---

## 七、 附带文档与权威业务表格清单

在交付包的 `PRD_需求文档与权威规范/` 目录下，附带了以下完整权威业务文档：
1. `特变电工能碳数字化双中心_产品需求规格说明书_PRD_v1.1.docx`
2. `生产单位与涉及关键工序对应表(1).et`
3. `园区-工厂对应关系表.et`
4. `线缆产线分类.xlsx`
5. `“双中心”项目能碳管控指标体系V1.5(1).xlsx`
6. `MODIFICATIONS_LOG.md`
7. `开发手册(35篇)/`
"""

bat_install_and_start = """@echo off
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
echo 3. 依赖安装完成！正在启动本地开发调试服务 (pnpm dev -p 3001)...
echo 访问地址: http://localhost:3001
echo 16:9集控大屏: http://localhost:3001/screen/control-center
echo.
start "" http://localhost:3001
call pnpm dev -p 3001
pause
"""

bat_start_dev = """@echo off
chcp 65001 >nul
title 特变电工能碳双中心 · 本地开发调试服务
echo =========================================================
echo   特变电工能碳数字化双中心 - 本地开发调试服务启动中...
echo =========================================================
echo.
echo 启动端口: 3001
echo 正在打开默认浏览器: http://localhost:3001
echo.
start "" http://localhost:3001
call pnpm dev -p 3001
pause
"""

docs_to_include = [
    (os.path.join(root_proj, 'PRD', '特变电工能碳数字化双中心_产品需求规格说明书_PRD_v1.1.docx'), 'PRD_需求文档与权威规范/特变电工能碳数字化双中心_产品需求规格说明书_PRD_v1.1.docx'),
    (os.path.join(root_proj, 'PRD', '特变电工能碳数字化双中心_产品需求规格说明书_PRD_v1.0.docx'), 'PRD_需求文档与权威规范/特变电工能碳数字化双中心_产品需求规格说明书_PRD_v1.0.docx'),
    (os.path.join(root_proj, '需求文档', '生产单位与涉及关键工序对应表(1).et'), 'PRD_需求文档与权威规范/生产单位与涉及关键工序对应表(1).et'),
    (os.path.join(root_proj, '需求文档', '园区-工厂对应关系表.et'), 'PRD_需求文档与权威规范/园区-工厂对应关系表.et'),
    (os.path.join(root_proj, '需求文档', '“双中心”项目能碳管控指标体系V1.5(1).xlsx'), 'PRD_需求文档与权威规范/“双中心”项目能碳管控指标体系V1.5(1).xlsx'),
    (os.path.join(root_proj, '需求文档', '0909', '线缆产线分类.xlsx'), 'PRD_需求文档与权威规范/线缆产线分类.xlsx'),
    (os.path.join(root_proj, 'MODIFICATIONS_LOG.md'), 'PRD_需求文档与权威规范/MODIFICATIONS_LOG.md'),
    (os.path.join(root_proj, 'AGENTS.md'), 'PRD_需求文档与权威规范/AGENTS.md'),
]

ignore_dirs = {'node_modules', '.next', 'out', '.git', '.pnpm-store', '.turbo', '.vscode'}

def package_all():
    print("==================================================================")
    print("特变电工交付工程包自动化流水线启动...")
    print("==================================================================")

    # 1. 浅色商务版
    light_pkg_name = '特变电工能碳数字化双中心_前端开发交付完整工程包_浅色商务版.zip'
    light_pkg_path = os.path.join(root_proj, light_pkg_name)
    print(f"\n[1/3] 正在打包: {light_pkg_name}")
    t0 = time.time()
    with zipfile.ZipFile(light_pkg_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(light_proj):
            dirs[:] = [d for d in dirs if d not in ignore_dirs]
            for file in files:
                if file.endswith('.zip') or file.endswith('.tar.gz') or file.endswith('.log') or file.endswith('.tsbuildinfo'):
                    continue
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, light_proj)
                zf.write(full_path, arcname=os.path.join('tbea-nengtan-light-project', rel_path))

        zf.writestr('tbea-nengtan-light-project/DEVELOPER_GUIDE.md', dev_guide_content.encode('utf-8'))
        zf.writestr('tbea-nengtan-light-project/一键安装依赖并启动.bat', bat_install_and_start.encode('utf-8'))
        zf.writestr('tbea-nengtan-light-project/启动开发调试服务.bat', bat_start_dev.encode('utf-8'))

        for src_path, target_rel in docs_to_include:
            if os.path.exists(src_path):
                zf.write(src_path, arcname=os.path.join('tbea-nengtan-light-project', target_rel))

    s0 = os.path.getsize(light_pkg_path) / (1024 * 1024)
    print(f"  [OK] 浅色商务版生成成功: {s0:.2f} MB ({time.time() - t0:.1f}s)")

    # 2. 暗黑科技蓝版
    dark_pkg_name = '特变电工能碳数字化双中心_前端开发交付完整工程包_暗黑科技蓝版.zip'
    dark_pkg_path = os.path.join(root_proj, dark_pkg_name)
    print(f"\n[2/3] 正在打包: {dark_pkg_name}")
    t1 = time.time()
    dark_bat_start_dev = bat_start_dev.replace('3001', '3000')
    dark_bat_install = bat_install_and_start.replace('3001', '3000')
    dark_dev_guide = dev_guide_content.replace('浅色商务端（默认推荐端口 3001）', '暗黑科技蓝端（默认推荐端口 3000）')

    with zipfile.ZipFile(dark_pkg_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(dark_proj):
            dirs[:] = [d for d in dirs if d not in ignore_dirs]
            for file in files:
                if file.endswith('.zip') or file.endswith('.tar.gz') or file.endswith('.log') or file.endswith('.tsbuildinfo'):
                    continue
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, dark_proj)
                zf.write(full_path, arcname=os.path.join('tbea-nengtan-dark-project', rel_path))

        zf.writestr('tbea-nengtan-dark-project/DEVELOPER_GUIDE.md', dark_dev_guide.encode('utf-8'))
        zf.writestr('tbea-nengtan-dark-project/一键安装依赖并启动.bat', dark_bat_install.encode('utf-8'))
        zf.writestr('tbea-nengtan-dark-project/启动开发调试服务.bat', dark_bat_start_dev.encode('utf-8'))

        for src_path, target_rel in docs_to_include:
            if os.path.exists(src_path):
                zf.write(src_path, arcname=os.path.join('tbea-nengtan-dark-project', target_rel))

    s1 = os.path.getsize(dark_pkg_path) / (1024 * 1024)
    print(f"  [OK] 暗黑科技蓝版生成成功: {s1:.2f} MB ({time.time() - t1:.1f}s)")

    # 3. 全套交付总包
    master_pkg_name = '特变电工能碳数字化双中心_全套前端完整开发交付总包(含双端与全套PRD文档).zip'
    master_pkg_path = os.path.join(root_proj, master_pkg_name)
    print(f"\n[3/3] 正在打包: {master_pkg_name}")
    t2 = time.time()

    with zipfile.ZipFile(master_pkg_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(light_proj):
            dirs[:] = [d for d in dirs if d not in ignore_dirs]
            for file in files:
                if file.endswith('.zip') or file.endswith('.tar.gz') or file.endswith('.log') or file.endswith('.tsbuildinfo'):
                    continue
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, light_proj)
                zf.write(full_path, arcname=os.path.join('01_浅色商务端工程源码(端口3001)', rel_path))
        zf.writestr('01_浅色商务端工程源码(端口3001)/一键安装依赖并启动.bat', bat_install_and_start.encode('utf-8'))
        zf.writestr('01_浅色商务端工程源码(端口3001)/启动开发调试服务.bat', bat_start_dev.encode('utf-8'))

        for root, dirs, files in os.walk(dark_proj):
            dirs[:] = [d for d in dirs if d not in ignore_dirs]
            for file in files:
                if file.endswith('.zip') or file.endswith('.tar.gz') or file.endswith('.log') or file.endswith('.tsbuildinfo'):
                    continue
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, dark_proj)
                zf.write(full_path, arcname=os.path.join('02_暗黑科技蓝工程源码(端口3000)', rel_path))
        zf.writestr('02_暗黑科技蓝工程源码(端口3000)/一键安装依赖并启动.bat', dark_bat_install.encode('utf-8'))
        zf.writestr('02_暗黑科技蓝工程源码(端口3000)/启动开发调试服务.bat', dark_bat_start_dev.encode('utf-8'))

        zf.writestr('DEVELOPER_GUIDE.md', dev_guide_content.encode('utf-8'))
        for src_path, target_rel in docs_to_include:
            if os.path.exists(src_path):
                zf.write(src_path, arcname=os.path.join('00_PRD需求规格说明书与业务字典', os.path.basename(src_path)))

        dev_manuals_dir = os.path.join(root_proj, '开发手册')
        if os.path.exists(dev_manuals_dir):
            for f in os.listdir(dev_manuals_dir):
                full_f = os.path.join(dev_manuals_dir, f)
                if os.path.isfile(full_f):
                    zf.write(full_f, arcname=os.path.join('00_PRD需求规格说明书与业务字典/开发手册(35篇)', f))

    s2 = os.path.getsize(master_pkg_path) / (1024 * 1024)
    print(f"  [OK] 全套交付总包生成成功: {s2:.2f} MB ({time.time() - t2:.1f}s)")
    print("\n==================================================================")
    print("三大标准化交付工程包全部签署生成完毕！")
    print("==================================================================")

if __name__ == '__main__':
    package_all()
