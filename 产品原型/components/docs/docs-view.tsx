'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  zeroCarbonFuncs,
  carbonFootprintFuncs,
  interactionSpecs,
  productEnergyMappings,
  type FuncRow,
  type ProductEnergyMappingRow,
} from '@/lib/requirements'
import {
  ArrowLeft,
  FileText,
  Layers,
  MousePointerClick,
  ListChecks,
  Target,
  Factory,
  Zap,
  Code2,
  Cpu,
  Database,
  Terminal,
  ShieldCheck,
  Server,
  Scale,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'

/* PRD 业务需求大纲目录 */
const prdSections = [
  { id: 'overview', label: '一、项目概述' },
  { id: 'goals', label: '二、建设目标' },
  { id: 'architecture', label: '三、总体架构' },
  { id: 'zero-carbon', label: '四、零碳园区集控中心' },
  { id: 'carbon-footprint', label: '五、产品碳足迹集采中心' },
  { id: 'product-energy', label: '六、企业产品与工序能源消耗规范' },
  { id: 'interaction', label: '七、页面与交互设计' },
  { id: 'common', label: '八、共性系统管理' },
  { id: 'nonfunctional', label: '九、非功能性需求' },
]

/* 开发技术文档大纲目录 */
const techSections = [
  { id: 'tech-arch', label: '1. 总体技术架构与工程结构' },
  { id: 'tech-algorithms', label: '2. 核心领域核算模型与算法' },
  { id: 'tech-data', label: '3. 六级组织与多维数据实体模型' },
  { id: 'tech-screen', label: '4. 大屏可视化与 3D 地图工程规范' },
  { id: 'tech-api-entry', label: '5. 接口协议、采集边界与离线填报' },
  { id: 'tech-devops', label: '6. 构建打包、生产部署与运维保障' },
]

function FuncTable({ rows }: { rows: FuncRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-secondary text-left text-xs uppercase text-muted-foreground">
            <th className="w-12 px-3 py-2.5 font-medium">序号</th>
            <th className="w-32 px-3 py-2.5 font-medium">一级功能</th>
            <th className="w-40 px-3 py-2.5 font-medium">二级功能</th>
            <th className="px-3 py-2.5 font-medium">功能说明</th>
            <th className="w-40 px-3 py-2.5 font-medium">功能定位</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-border align-top hover:bg-secondary/40">
              <td className="px-3 py-2.5 font-mono text-muted-foreground">{r.no}</td>
              <td className="px-3 py-2.5 font-medium text-foreground">{r.l1}</td>
              <td className="px-3 py-2.5 text-primary">{r.l2}</td>
              <td className="px-3 py-2.5 leading-relaxed text-muted-foreground">{r.desc}</td>
              <td className="px-3 py-2.5 text-xs leading-relaxed text-foreground/80">{r.positioning ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ProductEnergyTable({ rows }: { rows: ProductEnergyMappingRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-xs font-mono">
        <thead>
          <tr className="bg-secondary text-left text-xs uppercase text-muted-foreground font-sans">
            <th className="w-10 px-2.5 py-2.5 font-medium">序号</th>
            <th className="w-20 px-2.5 py-2.5 font-medium">一级单位</th>
            <th className="w-28 px-2.5 py-2.5 font-medium">二级项目公司</th>
            <th className="w-24 px-2.5 py-2.5 font-medium">产品大类</th>
            <th className="w-44 px-2.5 py-2.5 font-medium">主要产品及规格细分</th>
            <th className="w-48 px-2.5 py-2.5 font-medium">涉及关键制造工序</th>
            <th className="w-36 px-2.5 py-2.5 font-bold text-primary font-sans">主要消耗能源</th>
            <th className="w-44 px-2.5 py-2.5 font-medium">管控与核算对应指标</th>
            <th className="px-2.5 py-2.5 font-medium font-sans">业务核算与展示规则</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r) => (
            <tr key={r.no} className="hover:bg-secondary/40 align-top">
              <td className="px-2.5 py-2 text-muted-foreground">{r.no}</td>
              <td className="px-2.5 py-2 font-bold font-sans text-foreground">{r.compL1}</td>
              <td className="px-2.5 py-2 font-sans text-foreground">{r.compL2}</td>
              <td className="px-2.5 py-2 font-sans">
                <span
                  className={
                    r.productCategory.includes('变压器')
                      ? 'px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[10px] font-bold border border-amber-500/20'
                      : r.productCategory.includes('线缆')
                      ? 'px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold border border-emerald-500/20'
                      : 'px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[10px]'
                  }
                >
                  {r.productCategory}
                </span>
              </td>
              <td className="px-2.5 py-2 font-sans font-semibold text-foreground">{r.productName}</td>
              <td className="px-2.5 py-2 font-sans text-muted-foreground leading-relaxed">{r.processes}</td>
              <td className="px-2.5 py-2 font-sans font-bold text-primary">{r.energyConsumed}</td>
              <td className="px-2.5 py-2 font-sans text-foreground/80 leading-relaxed">{r.metrics}</td>
              <td className="px-2.5 py-2 font-sans text-muted-foreground leading-relaxed">{r.remark || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function H({ id, icon: Icon, children }: { id: string; icon: any; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 flex items-center gap-2 text-xl font-bold text-foreground">
      <Icon className="size-5 text-primary" />
      {children}
    </h2>
  )
}

export function DocsView() {
  const [docType, setDocType] = useState<'tech' | 'prd'>('tech')
  const [active, setActive] = useState('tech-arch')

  const sections = docType === 'tech' ? techSections : prdSections

  return (
    <div className="min-h-screen bg-background">
      {/* 顶栏 */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/90 px-6 backdrop-blur">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" /> 返回总览
          </Link>
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-primary" />
            <span className="font-semibold text-foreground">特变电工电装集团能碳双中心 · 开发技术文档与规范</span>
          </div>
        </div>

        {/* 模式切换胶囊 */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-border bg-muted/30 p-1">
            <button
              type="button"
              onClick={() => {
                setDocType('tech')
                setActive('tech-arch')
              }}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                docType === 'tech' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Code2 className="size-3.5" /> 开发技术文档 (Tech Spec)
            </button>
            <button
              type="button"
              onClick={() => {
                setDocType('prd')
                setActive('overview')
              }}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                docType === 'prd' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <ListChecks className="size-3.5" /> 业务需求手册 (PRD)
            </button>
          </div>
          <span className="hidden sm:inline text-xs text-muted-foreground ml-2 border-l border-border pl-3">
            生产运行版本：V2.0 · 8.215.89.194
          </span>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-6 py-8">
        {/* 侧边目录 */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <nav className="sticky top-20 space-y-1">
            <p className="mb-2 px-3 text-xs font-medium uppercase text-muted-foreground">
              {docType === 'tech' ? '技术架构与实现大纲' : '业务与功能需求目录'}
            </p>
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setActive(s.id)}
                className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                  active === s.id
                    ? 'bg-primary/10 font-medium text-primary border-l-2 border-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                {s.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* 主体内容 */}
        <main className="min-w-0 flex-1 space-y-12">
          {docType === 'tech' ? (
            <>
              {/* 1. 总体技术架构与工程结构 */}
              <section className="space-y-4">
                <H id="tech-arch" icon={Code2}>1. 总体技术架构与工程结构</H>
                <p className="leading-relaxed text-muted-foreground text-sm">
                  系统基于 <strong>Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4</strong> 现代企业级前端单体架构搭建，全面启用 Turbopack 编译提速并配置静态全路由预渲染 (<code>output: 'export'</code>)，零 Node.js 运行时依赖即可由 Nginx 高性能分发，单机吞吐能力超过 10,000 QPS。
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
                      <Cpu className="size-4 text-primary" /> 技术栈与基建清单
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1.5 font-mono">
                      <li>• 框架引擎：Next.js 16.3.0 (App Router, Turbopack)</li>
                      <li>• 视图核心：React 19.0.0 (客户端/服务端组件完全解耦)</li>
                      <li>• 类型系统：TypeScript 5.x (全工程严格模式 strict: true)</li>
                      <li>• 样式体系：Tailwind CSS 4.0 (@theme 变量，暗黑科技蓝与浅色秒级切换)</li>
                      <li>• 图表矩阵：ECharts 6.1.0 (GIS地图/仪表盘) + Recharts 3.10.1 (响应式图表)</li>
                      <li>• 地理渲染：React Simple Maps 3.0 + D3 Geo 3.1.1 (中国立体浮雕拓扑)</li>
                    </ul>
                  </div>

                  <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
                      <Layers className="size-4 text-primary" /> 分层解耦工程规范
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1.5">
                      <li>• <code>app/</code>：76+ 纯静态路由，负责布局、上下文注入与页面装配。</li>
                      <li>• <code>components/shared/</code>：设计规范原子级通用组件 (Modal, Table, Charts, Tabs)。</li>
                      <li>• <code>components/database/</code>：产品碳足迹实景数据库、工序追溯弹窗与下钻视图。</li>
                      <li>• <code>components/screen/</code>：1080P/2K 领导驾驶舱 3D 地图 HUD 高保真看板组件。</li>
                      <li>• <code>lib/</code>：无副作用纯函数层，承载 LCA 碳核算、CBAM 关税、对标评分等核心业务算法。</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 2. 核心领域核算模型与算法 */}
              <section className="space-y-4">
                <H id="tech-algorithms" icon={Scale}>2. 核心领域核算模型与算法实现</H>
                <p className="leading-relaxed text-muted-foreground text-sm">
                  系统内置特变电工集团能源与双碳核心计算公式库，所有算法在 <code>lib/accounting.ts</code>、<code>lib/benchmark.ts</code>、<code>lib/cbam.ts</code> 中经过严格数学建模与行业标准校验：
                </p>

                <div className="space-y-4">
                  {/* 折标煤 */}
                  <div className="rounded-xl border border-border bg-card p-4.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                        <Zap className="size-4 text-amber-500" />
                        (1) 综合能源消费折标煤算法模型 (国家标准 GB/T 2589)
                      </h3>
                      <span className="text-[11px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">当量值 / 等价值双口径</span>
                    </div>
                    <div className="bg-muted/40 p-3 rounded-lg font-mono text-xs text-foreground/90 leading-relaxed border border-border/60">
                      <div>E_kgce = ∑(M_i × C_i)</div>
                      <div className="mt-1 text-muted-foreground font-sans">
                        • <strong>电力当量折标系数</strong>：0.1229 kgce/kWh（理论热值）；<strong>电力等价折标系数</strong>：0.3150 kgce/kWh（供电煤耗）。<br />
                        • <strong>蒸汽折标系数</strong>：0.1286 kgce/kg（0.8MPa 饱和蒸汽）；<strong>天然气折标系数</strong>：1.2143 kgce/m³。
                      </div>
                    </div>
                  </div>

                  {/* LCA 碳足迹 */}
                  <div className="rounded-xl border border-border bg-card p-4.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                        <Factory className="size-4 text-emerald-500" />
                        (2) 全生命周期 LCA 产品碳足迹核算模型 (ISO 14067 · Cradle to Gate)
                      </h3>
                      <span className="text-[11px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">工序级穿透溯源</span>
                    </div>
                    <div className="bg-muted/40 p-3 rounded-lg font-mono text-xs text-foreground/90 leading-relaxed border border-border/60">
                      <div>PCF_total = E_raw + E_trans + E_mfg + E_waste</div>
                      <div className="mt-1 text-muted-foreground font-sans">
                        其中工厂生产制造阶段 (E_mfg) 引入<strong>绿电消纳减排算法</strong>：<br />
                        E_mfg = ∑[Q_grid × EF_grid + Q_green × EF_green + Q_steam × EF_steam]<br />
                        • 市电电网排放因子 EF_grid = 0.5366 kgCO2/kWh；绿电排放因子 EF_green = 0.05664 kgCO2/kWh（减排幅度达 89.4%）。
                      </div>
                    </div>
                  </div>

                  {/* 零碳对标与综合得分 */}
                  <div className="rounded-xl border border-border bg-card p-4.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                        <BarChart3 className="size-4 text-cyan-500" />
                        (3) 零碳工厂多维对标综合评价与红黑榜加权算法
                      </h3>
                      <span className="text-[11px] font-mono text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded">防单项过度溢出</span>
                    </div>
                    <div className="bg-muted/40 p-3 rounded-lg font-mono text-xs text-foreground/90 leading-relaxed border border-border/60">
                      <div>Score = clamp(45, 99, (1/K) × ∑ min(1.15, Achievement_k) × 86)</div>
                      <div className="mt-1 text-muted-foreground font-sans">
                        • <strong>截断上限 min(1.15, ·)</strong>：防止单项极优（如绿电买满）掩盖其余工艺能效短板；<br />
                        • <strong>红黑榜阈值</strong>：≥ 90 分（领跑绿标），78 ~ 89 分（正常达标），&lt; 78 分（落后红标，重点管理抓手）。
                      </div>
                    </div>
                  </div>

                  {/* CBAM 关税 */}
                  <div className="rounded-xl border border-border bg-card p-4.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                        <ShieldCheck className="size-4 text-purple-500" />
                        (4) 欧盟 CBAM 嵌入排放核算与碳关税成本测算
                      </h3>
                      <span className="text-[11px] font-mono text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded">HS-CN 映射台账</span>
                    </div>
                    <div className="bg-muted/40 p-3 rounded-lg font-mono text-xs text-foreground/90 leading-relaxed border border-border/60">
                      <div>Cost_CBAM = ExportVolume × SE_direct × max(0, P_EU_ETS - P_Domestic_Carbon)</div>
                      <div className="mt-1 text-muted-foreground font-sans">
                        • 动态支持 <strong>基准（75 欧元）</strong>、<strong>高位（100 欧元）</strong>、<strong>低位（50 欧元）</strong> 3 种情景预测，保护海外输变电装备外贸出口合规。
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. 六级组织与多维数据实体模型 */}
              <section className="space-y-4">
                <H id="tech-data" icon={Database}>3. 六级组织与多维数据实体模型</H>
                <p className="leading-relaxed text-muted-foreground text-sm">
                  数据架构深度贴合特变电工工业管理实际，实现自顶向下的逐级下钻穿透与自底向上的数据卷积：
                </p>

                <div className="rounded-xl border border-border bg-muted/20 p-4 font-mono text-xs space-y-2">
                  <div className="text-primary font-bold">六级组织对象树拓扑：</div>
                  <div className="text-foreground/90">
                    集团总揽 (Group) ➔ 产业园区 (6 Parks) ➔ 经营单位 (37 Units) ➔ 产线车间 (Lines) ➔ 产品型号 (Models) ➔ 生产订单/批次 (Orders)
                  </div>
                  <div className="text-muted-foreground text-[11px]">
                    特别约束：在建项目公司与未投产单位在指标管控左侧树中一律置灰呈现，不参与红黑榜排名与零碳达标率统计。
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                    <h4 className="font-semibold text-foreground text-sm">订单级生产计划实体 (ProdOrder)</h4>
                    <div className="bg-panel p-3 rounded-lg text-xs font-mono text-muted-foreground overflow-x-auto whitespace-pre">
{'interface ProdOrder {\n  order: string          // 订单号 (SO-260710)\n  model: string          // 产品规格 (SFZ11-110)\n  qty: number            // 订单总量 (台)\n  plans: {\n    plan: string         // 生产计划号 (PI-260710-01)\n    window: string       // 执行周期 (2026-07-10 ~ 07-20)\n    qty: number          // 计划台数\n  }[]\n}'}
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                    <h4 className="font-semibold text-foreground text-sm">工序能耗时序追踪行 (StageProcessRow)</h4>
                    <div className="bg-panel p-3 rounded-lg text-xs font-mono text-muted-foreground overflow-x-auto whitespace-pre">
{'interface StageProcessRow {\n  unit: string           // 生产单元 (绕线/器身/总装/成品)\n  processName: string    // 关键工序 (低压箔绕与高压绕制)\n  energyType: \'市电\' | \'绿电\' | \'蒸汽\'\n  startTime: string      // YYYY-MM-DD HH:mm:ss\n  endTime: string        // YYYY-MM-DD HH:mm:ss\n  consumption: number    // 实物量 (kWh)\n  coefKgce: number       // 折标系数 (0.1229)\n  totalKgce: number      // 综合折标能耗\n}'}
                    </div>
                  </div>
                </div>
              </section>

              {/* 4. 大屏可视化与 3D 地图工程规范 */}
              <section className="space-y-4">
                <H id="tech-screen" icon={Layers}>4. 大屏可视化与 3D 地图工程规范</H>
                <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3.5 rounded-lg bg-secondary/50 border border-border space-y-1">
                      <div className="font-semibold text-foreground text-sm">3D 浮雕地图与雷达脉冲</div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        基于 D3-Geo 经纬度投影与 CSS <code>perspective: 1200px</code> 倾角变换，叠加 <code>animate-ping</code> 呼吸光圈与专属发光折线引线，实现各园区实景焦点聚焦。
                      </p>
                    </div>

                    <div className="p-3.5 rounded-lg bg-secondary/50 border border-border space-y-1">
                      <div className="font-semibold text-foreground text-sm">航天级 HUD 金属切角</div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        采用高阶 CSS <code>clip-path: polygon(...)</code> 切角与科技微发光背板，杜绝切片图片锯齿，原生完美自适应 1080P、2K 及 4K 大屏展示。
                      </p>
                    </div>

                    <div className="p-3.5 rounded-lg bg-secondary/50 border border-border space-y-1">
                      <div className="font-semibold text-foreground text-sm">防重叠安全图表渲染</div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        在 Recharts 环形玫瑰图与甜甜圈饼图中注入文字防重叠碰撞保护阈值，透明背景渲染无缝融合科技蓝沉浸式体验。
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 5. 接口协议、采集边界与离线填报 */}
              <section className="space-y-4">
                <H id="tech-api-entry" icon={Terminal}>5. 接口协议、采集边界与离线填报</H>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    数据采集涵盖 <strong>自动化直连（SCADA/IoT）</strong> 与 <strong>人工离线填报校准</strong> 两大路径，构建严密的数据质控闭环：
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-border bg-card space-y-2">
                      <div className="font-semibold text-foreground text-sm flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-primary" /> 表计差值防伪校验算法
                      </div>
                      <p className="text-xs leading-relaxed">
                        填报模块按公式 <code>本月用量 = (本月止度 - 上月止度) × 互感器倍率</code> 计算。当检测到 <code>本月止度 &lt; 上月止度</code> 时，立即拦截并触发“表计倒走或重置归零”安全异常确认。
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-border bg-card space-y-2">
                      <div className="font-semibold text-foreground text-sm flex items-center gap-2">
                        <AlertTriangle className="size-4 text-amber-500" /> ±5% 环比波动智能预警
                      </div>
                      <p className="text-xs leading-relaxed">
                        当填报介质消费量环比上月偏差超过 ±15% 时呈现琥珀色警告，提示选择工艺异常原因；偏差超过 ±50% 时强制要求二级责任人双签名审核方可通过。
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 6. 构建打包、生产部署与运维保障 */}
              <section className="space-y-4">
                <H id="tech-devops" icon={Server}>6. 构建打包、生产部署与运维保障</H>
                <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <span className="font-semibold text-foreground text-sm">生产集群拓扑与端口分流</span>
                    <span className="font-mono text-xs text-primary">Ubuntu 24.04 LTS · Nginx 1.24.0</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-lg bg-panel border border-primary/30">
                      <div className="font-bold text-primary mb-1">主环境：暗黑科技蓝 (Dark Tech-Blue)</div>
                      <div className="font-mono text-muted-foreground">URL: http://8.215.89.194:3000</div>
                      <div className="font-mono text-muted-foreground">Path: /var/www/tbea-nengtan</div>
                    </div>

                    <div className="p-3.5 rounded-lg bg-panel border border-border">
                      <div className="font-bold text-foreground mb-1">副环境：清爽浅色镜像 (Light Mode)</div>
                      <div className="font-mono text-muted-foreground">URL: http://8.215.89.194:3001</div>
                      <div className="font-mono text-muted-foreground">Path: /var/www/tbea-nengtan-old</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="font-semibold text-foreground text-xs">标准发布构建命令序列：</div>
                    <div className="bg-panel p-3 rounded-lg text-xs font-mono text-primary/90 overflow-x-auto whitespace-pre">
{'# 1. 静态产物构建导出\npnpm build\n\n# 2. 本地打包归档\ntar.exe -czf "$env:TEMP\\tbea-deploy.tar.gz" -C "out" .\n\n# 3. 远端原子解压与 Nginx 平滑重载\nscp.exe "$env:TEMP\\tbea-deploy.tar.gz" admin@8.215.89.194:/home/admin/\nssh.exe admin@8.215.89.194 "sudo tar -xzf /home/admin/tbea-deploy.tar.gz -C /var/www/tbea-nengtan/ && sudo systemctl reload nginx"'}
                    </div>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <>
              <section className="space-y-4">
                <H id="overview" icon={Layers}>一、项目概述</H>
                <p className="leading-relaxed text-muted-foreground">
                  本项目为<strong>特变电工电装集团零碳数字化管理平台</strong>（简称“双中心”），包含
                  <strong>「零碳园区集控中心」</strong>与<strong>「产品碳足迹集采中心」</strong>两大业务核心，
                  覆盖集团下属各大产业园区、制造公司、车间及关键工序的能耗监测、碳核算、CBAM 应对、碳足迹评价与共性系统管理。
                </p>
              </section>

              <section className="space-y-4">
                <H id="goals" icon={Target}>二、建设目标</H>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="rounded-lg border border-border bg-card p-4">
                    <h3 className="mb-1.5 font-semibold text-foreground">集中监管与能效领跑</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      统一接入 15 个产业园区、22 家核心工厂水、电、气、蒸汽等实测数据，实现集团-园区-车间三级穿透监控与对标分析。
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-4">
                    <h3 className="mb-1.5 font-semibold text-foreground">全链条碳足迹实景溯源</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      依托实景数据库实现原材料-制造-运输-处置全生命周期碳核算与 ISO 14067 认证报告自动化生成。
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-4">
                    <h3 className="mb-1.5 font-semibold text-foreground">国际合规与出海护航</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      内置欧盟 CBAM 管控清单、HS-CN 智能映射、缺省因子库与成本测算模型，保障海外贸易合规申报。
                    </p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <H id="architecture" icon={Layers}>三、总体架构</H>
                <div className="rounded-lg border border-border bg-card p-5">
                  <div className="space-y-3">
                    <div className="rounded-md border border-dashed border-border px-4 py-3 text-center text-sm text-muted-foreground">
                      总览门户（统一入口 · 园区/产业/时间范围全局切换 · 智能问数助手）
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="rounded-md border border-border bg-secondary/50 px-4 py-3 text-center text-sm text-foreground font-bold">
                        零碳园区集控中心
                      </div>
                      <div className="rounded-md border border-border bg-secondary/50 px-4 py-3 text-center text-sm text-foreground font-bold">
                        产品碳足迹集采中心
                      </div>
                    </div>
                    <div className="rounded-md border border-dashed border-border px-4 py-3 text-center text-sm text-muted-foreground">
                      共性系统管理（账号权限 · 数据安全 · 审计日志）｜ 数据接口层（股份系统 / 各经营单位本地系统 / 因子库）
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <H id="zero-carbon" icon={ListChecks}>四、零碳园区集控中心 · 功能清单</H>
                <FuncTable rows={zeroCarbonFuncs} />
              </section>

              <section className="space-y-4">
                <H id="carbon-footprint" icon={ListChecks}>五、产品碳足迹集采中心 · 功能清单</H>
                <FuncTable rows={carbonFootprintFuncs} />
              </section>

              <section className="space-y-4">
                <H id="product-energy" icon={Factory}>六、企业、产品与工序能源消耗对应规范 (权威基准)</H>
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-xs leading-relaxed text-foreground space-y-1.5 font-sans">
                  <div className="font-bold text-primary text-sm flex items-center gap-1.5">
                    <Zap className="size-4 text-primary" />
                    数据源基准：依据《生产单位与涉及关键工序对应表(1).et》
                  </div>
                  <div>
                    • <strong>变压器产业</strong>：核心热工序为气相真空干燥与固化，重点核算 <strong>【电力】</strong> 与 <strong>【工业蒸汽】</strong>；
                  </div>
                  <div>
                    • <strong>线缆产业</strong>：核心工序为铜铝拉丝与干法悬垂立塔交联，重点核算 <strong>【电力】</strong> 与保护介质 <strong>【高纯氮气】</strong>，<strong>全流程无蒸汽消耗</strong>；
                  </div>
                  <div>
                    • <strong>成套与部件装备</strong>：开关柜、GIS、电抗器、电容器、GIL、套管、铁芯等重点核算 <strong>【电力】</strong>。
                  </div>
                </div>
                <ProductEnergyTable rows={productEnergyMappings} />
              </section>

              <section className="space-y-4">
                <H id="interaction" icon={MousePointerClick}>七、页面与交互设计</H>
                {interactionSpecs.map((spec) => (
                  <div key={spec.area} className="rounded-lg border border-border bg-card p-4">
                    <h3 className="mb-2 font-semibold text-foreground">{spec.area}</h3>
                    <ul className="space-y-2">
                      {spec.points.map((p, i) => (
                        <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>

              <section className="space-y-4">
                <H id="common" icon={Layers}>八、共性系统管理</H>
                <p className="leading-relaxed text-muted-foreground">
                  系统管理为两大平台共性能力，入口置于总览页右上角，包含：账号与三级组织权限（集团/园区/经营单位，细化至按钮级）、
                  角色管理、数据安全（国密算法加密）、操作审计日志（不可删除）、消息通知配置。两大平台复用同一账号权限体系。
                </p>
              </section>

              <section className="space-y-4">
                <H id="nonfunctional" icon={Target}>九、非功能性需求</H>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {[
                    { t: '安全性', d: '等保三级；敏感字段国密（SM2/SM4）加密；审计日志留存 ≥180 天且不可篡改；参数化查询防注入。' },
                    { t: '性能', d: '大屏首屏 ≤3s；核心图表交互响应 ≤1s；支持大数据量表格分页与虚拟滚动。' },
                    { t: '兼容与响应式', d: '桌面优先，兼容主流浏览器；大屏适配 1080P/2K；关键页面移动端可查看。' },
                    { t: '可扩展性', d: '因子/费价/核算公式可配置、多版本；接口字段映射可配置；模型版本化管理。' },
                  ].map((n) => (
                    <div key={n.t} className="rounded-lg border border-border bg-card p-4">
                      <h3 className="mb-1.5 font-semibold text-foreground">{n.t}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{n.d}</p>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
