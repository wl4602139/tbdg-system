'use client'

/* 能耗追踪：产品用能分析 / 订单能耗追溯 两页签
 * 结构与交互对齐「碳足迹核算」，仅将碳排数据替换为能耗数据 */
import { useMemo, useState } from 'react'
import { Panel, KpiCard, Tabs } from '@/components/shared/primitives'
import { CascadeFilter, TimeFilter, initCascade, type CascadeSel } from '@/components/procurement/cascade-filter'
import { Select } from '@/components/shared/select'
import { Donut, donutColors } from '@/components/shared/charts'
import { EnergyTraceModal } from '@/components/database/energy-trace-modal'
import {
  modelEnergy,
  energyAverage,
  energyProfile,
  energyStages,
  orderEnergyDetail,
} from '@/lib/accounting'
import { featureOf, ordersOf, transformerSpec, industries, linesOf, categoriesOf, modelsOf } from '@/lib/procurement'
import { Zap, Plug, Leaf, Boxes, Link2, Search, RotateCcw, ChevronRight } from 'lucide-react'

const DEFAULT_FROM = '2026-06'
const DEFAULT_TO = '2026-08'

/* ============ 通用用能三栏明细（用能阶段占比/能源类型构成/生产制造用能） ============ */
/* stages/energyRows 为已算好的数据，产品与订单两处复用同一表达 */
function EnergyDetailGrid({
  suffix,
  stages,
  energyRows,
}: {
  suffix: string
  stages: ReturnType<typeof energyStages>
  energyRows: ReturnType<typeof orderEnergyDetail>
}) {
  const stagesColored = stages.map((s, i) => ({ ...s, color: donutColors[i % donutColors.length] }))
  const totalKgce = stages.reduce((s, x) => s + x.kgce, 0) || 1
  const energyTotal = energyRows.reduce((s, x) => s + x.kgce, 0) || 1
  const maxProc = Math.max(...stages.map((s) => s.kgce))
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* 用能阶段占比：饼图 + 图例/数值/占比列表 */}
      <Panel title={`用能阶段占比 · ${suffix}`} desc="单台产品各生产单元综合能耗（kgce）">
        <Donut data={stagesColored.map((s) => ({ name: s.name, value: s.kgce, color: s.color }))} showLegend={false} unit=" kgce" />
        <div className="mt-4 space-y-2">
          {stagesColored.map((s) => (
            <div key={s.name} className="flex items-center gap-2 text-sm">
              <span className="size-2.5 shrink-0 rounded-sm" style={{ background: s.color }} />
              <span className="flex-1 text-muted-foreground">{s.name}</span>
              <span className="font-mono text-foreground">{s.kgce}</span>
              <span className="w-12 text-right font-mono text-xs text-muted-foreground">{((s.kgce / totalKgce) * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </Panel>

      {/* 能源类型构成：市电/绿电/压缩空气/天然气 折标占比 */}
      <Panel title="能源类型构成" desc="各能源折标准煤量（kgce）及占比">
        <div className="space-y-2.5">
          {energyRows.map((m) => (
            <div key={m.type} className="flex items-center gap-2">
              <span className="w-20 truncate text-sm text-foreground">{m.type}</span>
              <div className="h-3.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,var(--chart-3),var(--chart-1))]"
                  style={{ width: `${Math.max((m.kgce / energyTotal) * 100, 3)}%` }}
                />
              </div>
              <span className="w-16 text-right font-mono text-xs text-foreground">{m.kgce}</span>
              <span className="w-12 text-right text-xs text-muted-foreground">{((m.kgce / energyTotal) * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
        <div className="mt-3 text-[11px] text-muted-foreground">用量：{energyRows.map((m) => `${m.type} ${m.amount}${m.unit}`).join(' · ')}</div>
      </Panel>

      {/* 生产制造用能：各生产单元 kgce + 市电/绿电 */}
      <Panel title="生产制造用能" desc="各生产单元综合能耗及市电/绿电用量">
        <div className="space-y-2.5">
          {stages.map((p) => (
            <div key={p.name} className="rounded-lg border border-border bg-secondary/40 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{p.name}</span>
                <span className="font-mono text-sm text-primary">
                  {p.kgce} <span className="text-xs text-muted-foreground">kgce · {(p.ratio * 100).toFixed(1)}%</span>
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-[linear-gradient(90deg,var(--chart-1),var(--primary))]" style={{ width: `${Math.max((p.kgce / maxProc) * 100, 3)}%` }} />
              </div>
              <div className="mt-1.5 flex gap-4 text-[11px] text-muted-foreground">
                <span>市电 <span className="font-mono text-[var(--chart-1)]">{p.gridKwh}</span> kWh</span>
                <span>绿电 <span className="font-mono text-[var(--success)]">{p.greenKwh}</span> kWh</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}

/* 单台总量 + 用能阶段条（对齐核算的「型号均值·生命周期阶段构成」） */
function EnergyTotalBar({
  title,
  perUnitKgce,
  perFeatureKgce,
  featureUnit,
  stages,
  showFeature = false,
}: {
  title: string
  perUnitKgce: number
  perFeatureKgce: number
  featureUnit: string
  stages: ReturnType<typeof energyStages>
  showFeature?: boolean
}) {
  const total = stages.reduce((s, x) => s + x.kgce, 0) || 1
  return (
    <Panel title={title} desc="基于综合能耗折标准煤（kgce）的单台产品用能构成">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
        <div className="flex shrink-0 gap-3">
          <div className="rounded-xl border border-primary/30 bg-primary/5 px-6 py-4 text-center">
            <div className="text-xs text-muted-foreground">单台综合能耗{showFeature ? '' : '均值'}</div>
            <div className="mt-1 font-mono text-3xl font-semibold text-primary text-glow">{perUnitKgce.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">kgce / 台</div>
          </div>
          <div className="rounded-xl border border-border bg-secondary/40 px-6 py-4 text-center">
            <div className="text-xs text-muted-foreground">单位产品能耗</div>
            <div className="mt-1 font-mono text-3xl font-semibold text-foreground">{perFeatureKgce.toFixed(4)}</div>
            <div className="text-xs text-muted-foreground">kgce / {featureUnit}</div>
          </div>
        </div>
        <div className="flex-1 space-y-2.5">
          {stages.map((s) => {
            const ratio = s.kgce / total
            return (
              <div key={s.name} className="flex items-center gap-3">
                <span className="w-20 shrink-0 text-sm text-muted-foreground">{s.name}</span>
                <div className="h-5 flex-1 overflow-hidden rounded-md bg-muted">
                  <div className="flex h-full items-center rounded-md bg-[linear-gradient(90deg,var(--chart-3),var(--primary))] px-2" style={{ width: `${Math.max(ratio * 100, 6)}%` }}>
                    <span className="font-mono text-[10px] text-primary-foreground">{(ratio * 100).toFixed(0)}%</span>
                  </div>
                </div>
                <span className="w-24 shrink-0 text-right font-mono text-sm text-foreground">
                  {s.kgce}
                  <span className="ml-1 text-[10px] text-muted-foreground">kgce</span>
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </Panel>
  )
}

/* ============================ 产品用能分析 Tab ============================ */
function ProductEnergyTab({ onJump }: { onJump: (sel: CascadeSel, unit: string, order: string) => void }) {
  const [draft, setDraft] = useState<CascadeSel>(() => initCascade('变压器'))
  const [dFrom, setDFrom] = useState(DEFAULT_FROM)
  const [dTo, setDTo] = useState(DEFAULT_TO)
  const [applied, setApplied] = useState<CascadeSel>(() => initCascade('变压器'))
  const [traceOpen, setTraceOpen] = useState(false)

  const rows = useMemo(() => modelEnergy(applied.model, applied.ind), [applied.model, applied.ind])
  const avg = useMemo(() => energyAverage(applied.model, applied.ind), [applied.model, applied.ind])
  const ranked = useMemo(() => [...rows].sort((a, b) => b.perUnitKgce - a.perUnitKgce), [rows])
  const [selUnit, setSelUnit] = useState<string>('')
  const focusUnit = selUnit && rows.some((r) => r.unit === selUnit) ? selUnit : (rows.find((r) => !r.isProject)?.unit ?? rows[0]?.unit ?? '')

  const focusPerUnit = rows.find((r) => r.unit === focusUnit)?.perUnitKgce ?? avg.perUnitKgce
  const focusPerFeat = rows.find((r) => r.unit === focusUnit)?.perFeatureKgce ?? avg.perFeatureKgce
  const seed = `${applied.model}|${focusUnit}|acct-e`
  const avgStages = useMemo(() => energyStages(`${applied.model}|avg-e`, avg.perUnitKgce), [applied.model, avg.perUnitKgce])
  const focusStages = useMemo(() => energyStages(seed, focusPerUnit), [seed, focusPerUnit])
  const focusEnergyRows = useMemo(() => orderEnergyDetail(`${seed}|oe`), [seed])
  const orders = useMemo(() => ordersOf(applied.model, focusUnit, applied.ind), [applied.model, focusUnit, applied.ind])
  const maxPerUnit = Math.max(...ranked.map((r) => r.perUnitKgce), 1)
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
      <Panel className="relative z-30" title="产品用能分析">
        <CascadeFilter value={draft} onChange={setDraft} time={<TimeFilter from={dFrom} to={dTo} onFrom={setDFrom} onTo={setDTo} />}>
          <button type="button" onClick={onQuery} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
            <Search className="size-4" /> 查询
          </button>
          <button type="button" onClick={onReset} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <RotateCcw className="size-4" /> 重置
          </button>
        </CascadeFilter>
      </Panel>

      {/* KPI：综合能耗均值 / 单位产品能耗 / 特征量（变压器展示电压+容量） */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="综合能耗（单台·均值）" value={avg.perUnitKgce.toLocaleString()} unit="kgce" icon={Zap} />
        <KpiCard label="单位产品能耗（均值）" value={avg.perFeatureKgce.toFixed(4)} unit={`kgce/${avg.featureUnit}`} icon={Plug} />
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

      {/* 型号均值 · 用能阶段构成 */}
      <EnergyTotalBar
        title={`型号均值 · 用能阶段构成 · ${applied.model}`}
        perUnitKgce={avg.perUnitKgce}
        perFeatureKgce={avg.perFeatureKgce}
        featureUnit={avg.featureUnit}
        stages={avgStages}
      />

      {/* 各经营单位综合能耗总量排名 */}
      <Panel title={`各经营单位综合能耗排名 · ${applied.model}`} desc="按单台综合能耗从高到低排名；点击经营单位查看其明细与订单">
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
                  <div className="h-full rounded-full" style={{ width: `${Math.max((r.perUnitKgce / maxPerUnit) * 100, 4)}%`, background: 'linear-gradient(90deg,var(--chart-1),var(--primary))' }} />
                </div>
                <span className="w-28 shrink-0 text-right font-mono text-sm font-semibold text-foreground">
                  {r.perUnitKgce.toLocaleString()}
                  <span className="ml-1 text-[10px] font-normal text-muted-foreground">kgce/台</span>
                </span>
                <ChevronRight className={`size-4 shrink-0 transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`} />
              </button>
            )
          })}
        </div>
      </Panel>

      {/* 经营单位用能明细区块：下钻明细 + 数据追踪 */}
      <section className="relative space-y-4 rounded-2xl border border-primary/25 bg-primary/[0.03] p-4 shadow-[0_0_0_1px_var(--primary)/10,0_8px_30px_-12px_var(--primary)]">
        <span className="pointer-events-none absolute inset-x-0 -top-px mx-auto h-px w-2/3 bg-[linear-gradient(90deg,transparent,var(--primary),transparent)]" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              经营单位用能明细 · <span className="text-primary">{focusUnit}</span>
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

        <EnergyDetailGrid suffix={focusUnit} stages={focusStages} energyRows={focusEnergyRows} />
      </section>

      <EnergyTraceModal
        open={traceOpen}
        onClose={() => setTraceOpen(false)}
        model={applied.model}
        unit={focusUnit}
        perUnitKgce={focusPerUnit}
        perFeatureKgce={focusPerFeat}
        stages={focusStages}
        energyRows={focusEnergyRows}
        orders={orders}
        onJump={(order) => {
          setTraceOpen(false)
          onJump(applied, focusUnit, order)
        }}
      />
    </div>
  )
}

/* ============================ 订单能耗追溯 Tab ============================ */
export type EnergyJump = { sel: CascadeSel; unit: string; order: string }

function OrderEnergyTab({ jump }: { jump: EnergyJump | null }) {
  const initSel = jump?.sel ?? initCascade('变压器')
  const [sel, setSel] = useState<CascadeSel>(initSel)
  const [dFrom, setDFrom] = useState(DEFAULT_FROM)
  const [dTo, setDTo] = useState(DEFAULT_TO)
  const [unit, setUnit] = useState(jump?.unit ?? (modelEnergy(initSel.model, initSel.ind).find((r) => !r.isProject)?.unit ?? ''))
  const orders = useMemo(() => ordersOf(sel.model, unit, sel.ind), [sel.model, unit, sel.ind])
  const [orderId, setOrderId] = useState(jump?.order ?? orders[0]?.order ?? '')
  const order = orders.find((o) => o.order === orderId) ?? orders[0]
  const [planId, setPlanId] = useState(order?.plans[0]?.plan ?? '')
  const plan = order?.plans.find((p) => p.plan === planId) ?? order?.plans[0]
  const [traceOpen, setTraceOpen] = useState(false)

  function applySel(ns: CascadeSel) {
    setSel(ns)
    const nu = modelEnergy(ns.model, ns.ind).find((r) => !r.isProject)?.unit ?? ''
    const nOrders = ordersOf(ns.model, nu, ns.ind)
    setUnit(nu)
    setOrderId(nOrders[0]?.order ?? '')
    setPlanId(nOrders[0]?.plans[0]?.plan ?? '')
  }
  function setInd(ind: string) {
    applySel(initCascade(ind))
  }
  function setLine(line: string) {
    const cat = categoriesOf(sel.ind, line)[0]
    const model = modelsOf(sel.ind, line, cat)[0]
    applySel({ ind: sel.ind, line, cat, model })
  }

  const feat = featureOf(sel.model)
  const seed = `${sel.model}|${unit}|${planId}`
  const prof = useMemo(() => energyProfile(sel.model, seed), [sel.model, seed])
  const perUnitKgce = prof.totalKgce
  const perFeatureKgce = prof.perFeatureKgce
  const stages = useMemo(() => energyStages(seed, perUnitKgce), [seed, perUnitKgce])
  const energyRows = useMemo(() => orderEnergyDetail(`${seed}|oe`), [seed])
  const orderTrSpec = sel.ind === '变压器' ? transformerSpec(sel.model) : null

  function onReset() {
    applySel(initCascade('变压器'))
    setDFrom(DEFAULT_FROM)
    setDTo(DEFAULT_TO)
  }

  return (
    <div className="space-y-4">
      <Panel className="relative z-30" title="订单能耗追溯">
        <div className="flex flex-wrap items-end gap-3">
          <Select label="产业" value={sel.ind} onChange={setInd} options={industries.map((v) => ({ label: v, value: v }))} />
          <Select label="产线" value={sel.line} onChange={setLine} options={linesOf(sel.ind).map((v) => ({ label: v, value: v }))} />
          <Select label="经营单位" value={unit} onChange={(u) => { setUnit(u); const no = ordersOf(sel.model, u, sel.ind); setOrderId(no[0]?.order ?? ''); setPlanId(no[0]?.plans[0]?.plan ?? '') }} options={modelEnergy(sel.model, sel.ind).map((r) => ({ label: r.unit, value: r.unit }))} />
          <TimeFilter from={dFrom} to={dTo} onFrom={setDFrom} onTo={setDTo} />
          <Select label="产品订单" value={orderId} onChange={(o) => { setOrderId(o); const no = orders.find((x) => x.order === o); setPlanId(no?.plans[0]?.plan ?? '') }} options={orders.map((o) => ({ label: o.order, value: o.order }))} />
          <Select label="生产计划" value={planId} onChange={setPlanId} options={(order?.plans ?? []).map((p) => ({ label: p.plan, value: p.plan }))} />
          <button type="button" onClick={() => setTraceOpen(false)} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
            <Search className="size-4" /> 查询
          </button>
          <button type="button" onClick={onReset} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <RotateCcw className="size-4" /> 重置
          </button>
        </div>
      </Panel>

      {/* 计划信息条：去客户；变压器展示电压等级+容量 */}
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

      {/* 综合能耗（单台）：与产品用能分析的「型号均值」块布局一致 */}
      <EnergyTotalBar
        title={`综合能耗（单台） · ${planId}`}
        perUnitKgce={perUnitKgce}
        perFeatureKgce={perFeatureKgce}
        featureUnit={feat.unit}
        stages={stages}
        showFeature
      />

      {/* 订单/生产计划用能明细：与产品用能分析下方一致的三栏 + 数据追踪 */}
      <section className="relative space-y-4 rounded-2xl border border-primary/25 bg-primary/[0.03] p-4 shadow-[0_0_0_1px_var(--primary)/10,0_8px_30px_-12px_var(--primary)]">
        <span className="pointer-events-none absolute inset-x-0 -top-px mx-auto h-px w-2/3 bg-[linear-gradient(90deg,transparent,var(--primary),transparent)]" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              订单用能明细 · <span className="text-primary">{orderId}</span>
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

        <EnergyDetailGrid suffix={planId} stages={stages} energyRows={energyRows} />
      </section>

      <EnergyTraceModal
        open={traceOpen}
        onClose={() => setTraceOpen(false)}
        model={sel.model}
        unit={unit}
        perUnitKgce={perUnitKgce}
        perFeatureKgce={perFeatureKgce}
        stages={stages}
        energyRows={energyRows}
        subtitle={`${unit} · ${orderId} · ${planId}`}
      />
    </div>
  )
}

/* ============================ 外层：Tab 容器 ============================ */
export function EnergyView() {
  const [tab, setTab] = useState('product')
  const [jump, setJump] = useState<EnergyJump | null>(null)

  function handleJump(sel: CascadeSel, unit: string, order: string) {
    setJump({ sel, unit, order })
    setTab('order')
  }

  return (
    <div className="space-y-4">
      <Tabs
        tabs={[
          { key: 'product', label: '产品用能分析' },
          { key: 'order', label: '订单能耗追溯' },
        ]}
        value={tab}
        onChange={setTab}
      />
      {tab === 'product' && <ProductEnergyTab onJump={handleJump} />}
      {tab === 'order' && <OrderEnergyTab key={jump ? `${jump.unit}|${jump.order}` : 'default'} jump={jump} />}
    </div>
  )
}
