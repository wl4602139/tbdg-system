'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Panel, KpiCard, Tabs } from '@/components/shared/primitives'
import { CascadeFilter, TimeFilter, initCascade, type CascadeSel } from '@/components/procurement/cascade-filter'
import { Select } from '@/components/shared/select'
import { Donut, donutColors } from '@/components/shared/charts'
import { DataTraceModal } from '@/components/database/data-trace-modal'
import { ProductEnergyTab, OrderEnergyTab, type EnergyJump } from '@/components/database/energy-view'
import { modelAccounting, accountingAverage, stageBreakdown, processCarbon, materialCarbon } from '@/lib/accounting'
import { featureOf, transformerSpec, ordersOf, industries, categoriesOfInd, modelsOfIndCat, ALL_COMPANIES } from '@/lib/procurement'
import { Cloud, Layers, Boxes, Link2, Search, RotateCcw, ChevronRight } from 'lucide-react'

const stageLabel: Record<string, string> = {
  material: '原材料获取',
  transport: '原材料运输',
  produce: '生产制造',
  waste: '废弃物处理',
}
const DEFAULT_FROM = '2026-06'
const DEFAULT_TO = '2026-08'

/* ============ 通用核算三栏明细（生命周期/主材/生产制造） ============ */
/* stages/mats/procs 均为已算好的数据，产品与订单两处复用同一表达 */
function AcctDetailGrid({
  suffix,
  stages,
  mats,
  procs,
}: {
  suffix: string
  stages: { key: string; name: string; value: number; ratio: number }[]
  mats: { name: string; total: number; ratio: number }[]
  procs: { name: string; carbon: number; ratio: number }[]
}) {
  const stagesColored = stages.map((s, i) => ({ ...s, color: donutColors[i % donutColors.length] }))
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Panel title={`生命周期阶段占比 · ${suffix}`} desc="单台产品各阶段碳排放（kgCO2e）">
        <Donut data={stagesColored.map((s) => ({ name: stageLabel[s.key] ?? s.name, value: s.value, color: s.color }))} showLegend={false} />
        <div className="mt-4 space-y-2">
          {stagesColored.map((s) => (
            <div key={s.key} className="flex items-center gap-2 text-sm">
              <span className="size-2.5 shrink-0 rounded-sm" style={{ background: s.color }} />
              <span className="flex-1 text-muted-foreground">{stageLabel[s.key] ?? s.name}</span>
              <span className="font-mono text-foreground">{s.value}</span>
              <span className="w-12 text-right font-mono text-xs text-muted-foreground">{(s.ratio * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="主材碳足迹" desc="各原材料获取+运输碳排（占原材料碳排比重）">
        <div className="space-y-2">
          {mats.slice(0, 7).map((m) => (
            <div key={m.name} className="flex items-center gap-2">
              <span className="w-28 truncate text-sm text-foreground">{m.name}</span>
              <div className="h-3.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,var(--chart-3),var(--chart-1))]"
                  style={{ width: `${Math.max(m.ratio * 100, 3)}%` }}
                />
              </div>
              <span className="w-14 text-right font-mono text-xs text-foreground">{m.total}</span>
              <span className="w-12 text-right text-xs text-muted-foreground">{(m.ratio * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="生产制造碳排" desc="各生产单元碳排放及占比">
        <div className="space-y-2.5">
          {procs.map((p) => (
            <div key={p.name} className="rounded-lg border border-border bg-secondary/40 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{p.name}</span>
                <span className="font-mono text-sm text-primary">
                  {p.carbon} <span className="text-xs text-muted-foreground">kgCO2e · {(p.ratio * 100).toFixed(1)}%</span>
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-[linear-gradient(90deg,var(--chart-1),var(--primary))]" style={{ width: `${Math.max(p.ratio * 100, 3)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}

/* 经营单位核算三栏明细：按型号+经营单位取数后交给通用明细组件 */
function UnitDetail({ model, industry, unit }: { model: string; industry: string; unit: string }) {
  const summary = useMemo(() => modelAccounting(model, industry).find((r) => r.unit === unit)!, [model, industry, unit])
  const seed = `${model}|${unit}`
  const stages = useMemo(() => stageBreakdown(summary.perUnit), [summary.perUnit])
  const materialKg = stages.find((s) => s.key === 'material')!.value
  const produceKg = stages.find((s) => s.key === 'produce')!.value
  const procs = useMemo(() => processCarbon(seed, produceKg), [seed, produceKg])
  const mats = useMemo(() => materialCarbon(seed, materialKg), [seed, materialKg])

  return <AcctDetailGrid suffix={unit} stages={stages} mats={mats} procs={procs} />
}

/* ============================ 产品碳足迹展示 Tab ============================ */
function ProductTab({ onJump, initial, initUnit }: { onJump: (sel: CascadeSel, unit: string, order: string) => void; initial?: CascadeSel; initUnit?: string }) {
  const [draft, setDraft] = useState<CascadeSel>(() => initial ?? initCascade('变压器'))
  const [dFrom, setDFrom] = useState(DEFAULT_FROM)
  const [dTo, setDTo] = useState(DEFAULT_TO)
  const [applied, setApplied] = useState<CascadeSel>(() => initial ?? initCascade('变压器'))
  const [traceOpen, setTraceOpen] = useState(false)

  const allRows = useMemo(() => modelAccounting(applied.model, applied.ind), [applied.model, applied.ind])
  /* 项目公司范围筛选：选中具体公司时仅保留该经营单位（无匹配则回退全部） */
  const rows = useMemo(() => {
    if (applied.company === ALL_COMPANIES) return allRows
    const scoped = allRows.filter((r) => r.unit === applied.company)
    return scoped.length ? scoped : allRows
  }, [allRows, applied.company])
  const avg = useMemo(() => accountingAverage(applied.model, applied.ind), [applied.model, applied.ind])
  const ranked = useMemo(() => [...rows].sort((a, b) => b.perUnit - a.perUnit).slice(0, 5), [rows])
  const [selUnit, setSelUnit] = useState<string>(initUnit ?? '')
  const focusUnit = selUnit && rows.some((r) => r.unit === selUnit) ? selUnit : (rows.find((r) => !r.isProject)?.unit ?? rows[0].unit)

  const avgStages = useMemo(() => stageBreakdown(avg.perUnit), [avg.perUnit])
  const orders = useMemo(() => ordersOf(applied.model, focusUnit, applied.ind), [applied.model, focusUnit, applied.ind])
  const maxPerUnit = Math.max(...ranked.map((r) => r.perUnit))
  const focusPerUnitKg = rows.find((r) => r.unit === focusUnit)?.perUnit ?? avg.perUnit
  const trSpec = applied.ind === '变压器' ? transformerSpec(applied.model) : null

  function onQuery() {
    setApplied({ ...draft })
    setSelUnit('')
  }
  function onReset() {
    const init = initCascade('变压器')
    setDraft(init)
    setDFrom(DEFAULT_FROM)
    setDTo(DEFAULT_TO)
    setApplied(init)
    setSelUnit('')
  }

  return (
    <div className="space-y-4">
      <Panel className="relative z-30" title="产品碳足迹展示" desc="按型号汇总各经营单位产品碳足迹核算结果，展示型号均值与生命周期阶段构成；点击数据追踪穿透因子级明细">
        <CascadeFilter value={draft} onChange={setDraft} time={<TimeFilter from={dFrom} to={dTo} onFrom={setDFrom} onTo={setDTo} />}>
          <button type="button" onClick={onQuery} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
            <Search className="size-4" /> 查询
          </button>
          <button type="button" onClick={onReset} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <RotateCcw className="size-4" /> 重置
          </button>
        </CascadeFilter>
      </Panel>

      {/* KPI：去掉生产制造碳排；变压器额外展示电压等级+容量 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="总碳排（单台·均值）" value={avg.perUnit.toLocaleString()} unit="kgCO2e" icon={Cloud} />
        <KpiCard label="单位产品碳足迹（均值）" value={avg.perFeature.toFixed(4)} unit={`kgCO2e/${avg.featureUnit}`} icon={Layers} />
        {trSpec ? (
          <div className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground">单台特征量</span>
              <div className="flex items-end gap-5">
                <div>
                  <div className="font-mono text-xl font-semibold text-foreground">{trSpec.voltage}</div>
                  <div className="text-[11px] text-muted-foreground">电压等级</div>
                </div>
                <div className="h-8 w-px bg-border" />
                <div>
                  <div className="font-mono text-xl font-semibold text-foreground">{trSpec.capacity}</div>
                  <div className="text-[11px] text-muted-foreground">容量</div>
                </div>
              </div>
            </div>
            <Boxes className="size-5 shrink-0 text-primary" />
          </div>
        ) : (
          <KpiCard label="单台特征量" value={avg.feature.toLocaleString()} unit={avg.featureUnit} icon={Boxes} />
        )}
      </div>

      {/* 整行区块：型号均值总量 + 生命周期阶段详情 */}
      <Panel title={`型号均值 · 生命周期阶段构成 · ${applied.model}`} desc="基于各经营单位核算结果的单台产品碳足迹均值">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
          <div className="shrink-0 rounded-xl border border-primary/30 bg-primary/5 px-6 py-4 text-center">
            <div className="text-xs text-muted-foreground">单台产品碳足迹均值</div>
            <div className="mt-1 font-mono text-3xl font-semibold text-primary text-glow">{avg.perUnit.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">kgCO2e / 台</div>
          </div>
          <div className="flex-1 space-y-2.5">
            {avgStages.map((s) => (
              <div key={s.key} className="flex items-center gap-3">
                <span className="w-20 shrink-0 text-sm text-muted-foreground">{stageLabel[s.key] ?? s.name}</span>
                <div className="h-5 flex-1 overflow-hidden rounded-md bg-muted">
                  <div className="flex h-full items-center rounded-md bg-[linear-gradient(90deg,var(--chart-3),var(--primary))] px-2" style={{ width: `${Math.max(s.ratio * 100, 6)}%` }}>
                    <span className="font-mono text-[10px] text-primary-foreground">{(s.ratio * 100).toFixed(0)}%</span>
                  </div>
                </div>
                <span className="w-24 shrink-0 text-right font-mono text-sm text-foreground">
                  {s.value}
                  <span className="ml-1 text-[10px] text-muted-foreground">kgCO2e</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      {/* 各经营单位碳排数据总量排名（可点击） */}
      <Panel title={`各经营单位碳排总量排名 · ${applied.model}`} desc="按单台产品碳足迹从高到低排名，最多展示前 5 家；点击经营单位查看其明细与订单">
        <div className="space-y-1.5">
          {ranked.map((r, i) => {
            const active = r.unit === focusUnit
            return (
              <button
                key={r.unit}
                type="button"
                onClick={() => setSelUnit(r.unit)}
                className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors ${active ? 'border-primary/50 bg-primary/10' : 'border-transparent hover:border-border hover:bg-accent/40'}`}
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">{i + 1}</span>
                <div className="flex w-32 shrink-0 items-center gap-1.5">
                  <span className="truncate text-sm text-foreground">{r.unit}</span>
                </div>
                <div className="h-4 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full" style={{ width: `${Math.max((r.perUnit / maxPerUnit) * 100, 4)}%`, background: 'linear-gradient(90deg,var(--chart-1),var(--primary))' }} />
                </div>
                <span className="w-28 shrink-0 text-right font-mono text-sm font-semibold text-foreground">
                  {r.perUnit.toLocaleString()}
                  <span className="ml-1 text-[10px] font-normal text-muted-foreground">kgCO2e/台</span>
                </span>
                <ChevronRight className={`size-4 shrink-0 transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`} />
              </button>
            )
          })}
        </div>
      </Panel>

      {/* 经营单位核算明细区块：下钻明细 + 数据追踪（弹窗），同一查询结果统一成组展示 */}
      <section className="relative space-y-4 rounded-2xl border border-primary/25 bg-primary/[0.03] p-4 shadow-[0_0_0_1px_var(--primary)/10,0_8px_30px_-12px_var(--primary)]">
        <span className="pointer-events-none absolute inset-x-0 -top-px mx-auto h-px w-2/3 bg-[linear-gradient(90deg,transparent,var(--primary),transparent)]" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              经营单位核算明细 · <span className="text-primary">{focusUnit}</span>
            </h3>
            <span className="text-xs text-muted-foreground">{applied.model} · 同一查询结果</span>
          </div>
          <button
            type="button"
            onClick={() => setTraceOpen(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
          >
            <Link2 className="size-4" /> 数据追踪
          </button>
        </div>

        <UnitDetail model={applied.model} industry={applied.ind} unit={focusUnit} />
      </section>

      {/* 数据追踪弹窗：因子级明细 + 产品订单（末列跳转订单碳足迹追溯） */}
      <DataTraceModal
        open={traceOpen}
        onClose={() => setTraceOpen(false)}
        model={applied.model}
        unit={focusUnit}
        perUnitKg={focusPerUnitKg}
        orders={orders}
        onJump={(order) => {
          setTraceOpen(false)
          onJump(applied, focusUnit, order)
        }}
      />
    </div>
  )
}

/* ============================ 订单碳足迹追溯 Tab ============================ */
export type OrderJump = { sel: CascadeSel; unit: string; order: string }

function OrderTab({ jump }: { jump: OrderJump | null }) {
  const initSel = jump?.sel ?? initCascade('变压器')
  const [sel, setSel] = useState<CascadeSel>(initSel)
  const [dFrom, setDFrom] = useState(DEFAULT_FROM)
  const [dTo, setDTo] = useState(DEFAULT_TO)
  const [unit, setUnit] = useState(jump?.unit ?? (modelAccounting(initSel.model, initSel.ind).find((r) => !r.isProject)?.unit ?? ''))
  const orders = useMemo(() => ordersOf(sel.model, unit, sel.ind), [sel.model, unit, sel.ind])
  const [orderId, setOrderId] = useState(jump?.order ?? orders[0]?.order ?? '')
  const order = orders.find((o) => o.order === orderId) ?? orders[0]
  const [planId, setPlanId] = useState(order?.plans[0]?.plan ?? '')
  const plan = order?.plans.find((p) => p.plan === planId) ?? order?.plans[0]
  const [traceOpen, setTraceOpen] = useState(false)

  /* 切换产业/产线时，重置下游经营单位/订单/生产计划为首项 */
  function applySel(ns: CascadeSel) {
    setSel(ns)
    const nu = modelAccounting(ns.model, ns.ind).find((r) => !r.isProject)?.unit ?? ''
    const nOrders = ordersOf(ns.model, nu, ns.ind)
    setUnit(nu)
    setOrderId(nOrders[0]?.order ?? '')
    setPlanId(nOrders[0]?.plans[0]?.plan ?? '')
  }
  function setInd(ind: string) {
    applySel(initCascade(ind))
  }

  const feat = featureOf(sel.model)
  const perUnitKg = Math.round((plan?.perUnit ?? order?.perUnit ?? 0) * 1000 * 100) / 100
  const seed = `${sel.model}|${unit}|${planId}`
  const stages = useMemo(() => stageBreakdown(perUnitKg), [perUnitKg])
  const materialKg = stages.find((s) => s.key === 'material')!.value
  const produceKg = stages.find((s) => s.key === 'produce')!.value
  const procs = useMemo(() => processCarbon(seed, produceKg), [seed, produceKg])
  const mats = useMemo(() => materialCarbon(seed, materialKg), [seed, materialKg])
  const perFeature = feat.feature > 0 ? Math.round((perUnitKg / feat.feature) * 10000) / 10000 : 0

  const orderTrSpec = sel.ind === '变压器' ? transformerSpec(sel.model) : null

  function onQuery() {
    setTraceOpen(false)
  }
  function onReset() {
    applySel(initCascade('变压器'))
    setDFrom(DEFAULT_FROM)
    setDTo(DEFAULT_TO)
  }

  return (
    <div className="space-y-4">
      <Panel className="relative z-30" title="订单碳足迹追溯">
        <div className="flex flex-wrap items-end gap-3">
          <Select label="产业" value={sel.ind} onChange={setInd} options={industries.map((v) => ({ label: v, value: v }))} />
          <Select label="经营单位" value={unit} onChange={(u) => { setUnit(u); const no = ordersOf(sel.model, u, sel.ind); setOrderId(no[0]?.order ?? ''); setPlanId(no[0]?.plans[0]?.plan ?? '') }} options={modelAccounting(sel.model, sel.ind).map((r) => ({ label: r.unit, value: r.unit }))} />
          {/* 时间控件放在产品订单前面 */}
          <TimeFilter from={dFrom} to={dTo} onFrom={setDFrom} onTo={setDTo} />
          <Select label="产品订单" value={orderId} onChange={(o) => { setOrderId(o); const no = orders.find((x) => x.order === o); setPlanId(no?.plans[0]?.plan ?? '') }} options={orders.map((o) => ({ label: o.order, value: o.order }))} />
          <Select label="生产计划" value={planId} onChange={setPlanId} options={(order?.plans ?? []).map((p) => ({ label: p.plan, value: p.plan }))} />
          <button type="button" onClick={onQuery} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
            <Search className="size-4" /> 查询
          </button>
          <button type="button" onClick={onReset} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <RotateCcw className="size-4" /> 重置
          </button>
        </div>
      </Panel>

      {/* 订单/计划信息条：去掉客户信息；变压器展示电压等级+容量 */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-2 rounded-xl border border-border bg-card px-5 py-3 text-sm">
        <span className="font-mono text-base font-semibold text-primary">{planId}</span>
        <span className="text-muted-foreground">生产计划周期 <span className="text-foreground">{plan?.window}</span></span>
        <span className="text-muted-foreground">产品型号 <span className="text-foreground">{sel.model}</span></span>
        <span className="text-muted-foreground">生产数量 <span className="text-foreground">{plan?.qty} 台</span></span>
        {orderTrSpec ? (
          <>
            <span className="text-muted-foreground">电压等级 <span className="text-foreground">{orderTrSpec.voltage}</span></span>
            <span className="text-muted-foreground">容量 <span className="text-foreground">{orderTrSpec.capacity}</span></span>
          </>
        ) : (
          <span className="text-muted-foreground">单台特征量 <span className="text-foreground">{feat.feature.toLocaleString()} {feat.unit}</span></span>
        )}
      </div>

      {/* 单台/单位总量条：与产品碳足迹展示的“型号均值”块保持一致 */}
      <Panel title={`产品碳足迹（单台） · ${planId}`}>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
          <div className="flex shrink-0 gap-3">
            <div className="rounded-xl border border-primary/30 bg-primary/5 px-6 py-4 text-center">
              <div className="text-xs text-muted-foreground">单台产品总碳排</div>
              <div className="mt-1 font-mono text-3xl font-semibold text-primary text-glow">{perUnitKg.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">kgCO2e / 台</div>
            </div>
            <div className="rounded-xl border border-border bg-secondary/40 px-6 py-4 text-center">
              <div className="text-xs text-muted-foreground">单位产品碳足迹</div>
              <div className="mt-1 font-mono text-3xl font-semibold text-foreground">{perFeature.toFixed(4)}</div>
              <div className="text-xs text-muted-foreground">kgCO2e / {feat.unit}</div>
            </div>
          </div>
          <div className="flex-1 space-y-2.5">
            {stages.map((s) => (
              <div key={s.key} className="flex items-center gap-3">
                <span className="w-20 shrink-0 text-sm text-muted-foreground">{stageLabel[s.key] ?? s.name}</span>
                <div className="h-5 flex-1 overflow-hidden rounded-md bg-muted">
                  <div className="flex h-full items-center rounded-md bg-[linear-gradient(90deg,var(--chart-3),var(--primary))] px-2" style={{ width: `${Math.max(s.ratio * 100, 6)}%` }}>
                    <span className="font-mono text-[10px] text-primary-foreground">{(s.ratio * 100).toFixed(0)}%</span>
                  </div>
                </div>
                <span className="w-24 shrink-0 text-right font-mono text-sm text-foreground">
                  {s.value}
                  <span className="ml-1 text-[10px] text-muted-foreground">kgCO2e</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      {/* 订单/生产计划核算明细：与“产品碳足迹展示”下方一致的三栏（生命周期占比/主材/生产制造），数据追踪按钮放在同样位置 */}
      <section className="relative space-y-4 rounded-2xl border border-primary/25 bg-primary/[0.03] p-4 shadow-[0_0_0_1px_var(--primary)/10,0_8px_30px_-12px_var(--primary)]">
        <span className="pointer-events-none absolute inset-x-0 -top-px mx-auto h-px w-2/3 bg-[linear-gradient(90deg,transparent,var(--primary),transparent)]" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              订单核算明细 · <span className="text-primary">{orderId}</span>
            </h3>
            <span className="text-xs text-muted-foreground">{planId} · 生产计划</span>
          </div>
          <button
            type="button"
            onClick={() => setTraceOpen(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
          >
            <Link2 className="size-4" /> 数据追踪
          </button>
        </div>

        <AcctDetailGrid suffix={planId} stages={stages} mats={mats} procs={procs} />
      </section>

      <DataTraceModal
        open={traceOpen}
        onClose={() => setTraceOpen(false)}
        model={sel.model}
        unit={unit}
        perUnitKg={perUnitKg}
        subtitle={`${unit} · ${orderId} · ${planId}`}
      />
    </div>
  )
}

/* ============================ 外层：Tab 容器（4 页签） ============================ */
export function AccountingView() {
  const searchParams = useSearchParams()
  /* 外部深链：?view=order&... 直接打开订单碳足迹追溯 */
  const linkedJump = useMemo<OrderJump | null>(() => {
    if (searchParams.get('view') !== 'order') return null
    const ind = searchParams.get('ind') ?? '变压器'
    const cat = searchParams.get('cat') ?? categoriesOfInd(ind)[0]
    const model = searchParams.get('model') ?? modelsOfIndCat(ind, cat)[0]
    const unit = searchParams.get('unit') ?? ''
    const order = searchParams.get('order') ?? ''
    return { sel: { ind, company: ALL_COMPANIES, cat, model }, unit, order }
  }, [searchParams])

  /* 实景数据库「因子详情」深链：?ind=&cat=&model=&unit= 打开产品碳足迹(型号)并定位单位 */
  const productLink = useMemo<{ sel: CascadeSel; unit: string } | null>(() => {
    if (searchParams.get('view') === 'order') return null
    const model = searchParams.get('model')
    if (!model) return null
    const ind = searchParams.get('ind') ?? '变压器'
    const cat = searchParams.get('cat') ?? categoriesOfInd(ind)[0]
    const unit = searchParams.get('unit') ?? ''
    return { sel: { ind, company: ALL_COMPANIES, cat, model }, unit }
  }, [searchParams])

  const [tab, setTab] = useState(linkedJump ? 'order' : 'product')
  const [jump, setJump] = useState<OrderJump | null>(linkedJump)
  const [energyJump, setEnergyJump] = useState<EnergyJump | null>(null)

  function handleJump(sel: CascadeSel, unit: string, order: string) {
    setJump({ sel, unit, order })
    setTab('order')
  }
  function handleEnergyJump(sel: CascadeSel, unit: string, order: string) {
    setEnergyJump({ sel, unit, order })
    setTab('energy-order')
  }

  return (
    <div className="space-y-4">
      <Tabs
        tabs={[
          { key: 'product', label: '产品碳足迹（型号）' },
          { key: 'order', label: '产品碳足迹（订单）' },
          { key: 'energy-product', label: '产品用能分析' },
          { key: 'energy-order', label: '订单能耗追溯' },
        ]}
        value={tab}
        onChange={setTab}
      />
      {tab === 'product' && <ProductTab onJump={handleJump} initial={productLink?.sel} initUnit={productLink?.unit} />}
      {tab === 'order' && <OrderTab key={jump ? `${jump.unit}|${jump.order}` : 'default'} jump={jump} />}
      {tab === 'energy-product' && <ProductEnergyTab onJump={handleEnergyJump} />}
      {tab === 'energy-order' && <OrderEnergyTab key={energyJump ? `${energyJump.unit}|${energyJump.order}` : 'default'} jump={energyJump} />}
    </div>
  )
}
