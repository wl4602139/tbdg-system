'use client'

/* 能耗页签：产品用能分析 / 订单能耗追溯
 * 展示形式回滚为「能耗(单台)环形图 + 生产制造用能分析(工序流) + 能源计量卡」，
 * 数据追踪由订单级细化到工序级；能力不变，作为碳足迹核算的两个页签复用。 */
import { useMemo, useState } from 'react'
import { Panel, KpiCard } from '@/components/shared/primitives'
import { CascadeFilter, TimeFilter, initCascade, type CascadeSel } from '@/components/procurement/cascade-filter'
import { Select } from '@/components/shared/select'
import { Donut } from '@/components/shared/charts'
import { EnergyTraceModal } from '@/components/database/energy-trace-modal'
import {
  modelEnergy,
  energyAverage,
  energyProfile,
  energyStages,
  orderEnergyDetail,
} from '@/lib/accounting'
import { featureOf, ordersOf, transformerSpec, industries, ALL_COMPANIES } from '@/lib/procurement'
import { Zap, Plug, Leaf, Wind, Boxes, Link2, Search, RotateCcw, ChevronRight, Gauge } from 'lucide-react'

const DEFAULT_FROM = '2026-06'
const DEFAULT_TO = '2026-08'

/* ============ 回滚版布局：能耗(单台)环形图 + 生产制造用能分析(工序流+计量卡) ============ */
function EnergyProcessLayout({
  suffix,
  perUnitKgce,
  stages,
  energyRows,
}: {
  suffix: string
  perUnitKgce: number
  stages: ReturnType<typeof energyStages>
  energyRows: ReturnType<typeof orderEnergyDetail>
}) {
  const totalGrid = Math.round(stages.reduce((s, x) => s + x.gridKwh, 0) * 10) / 10
  const totalGreen = Math.round(stages.reduce((s, x) => s + x.greenKwh, 0) * 10) / 10
  const totalKwh = Math.round((totalGrid + totalGreen) * 10) / 10
  const air = energyRows.find((r) => r.type === '压缩空气')
  const gridPct = totalKwh > 0 ? (totalGrid / totalKwh) * 100 : 0
  const greenPct = totalKwh > 0 ? (totalGreen / totalKwh) * 100 : 0

  return (
    <div className="space-y-4">
      {/* 上：能耗（单台）— 环形图 + 能源计量卡（占用较窄空间） */}
      <Panel title="能耗（单台）" desc={suffix}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr] lg:items-center">
          <div>
            <Donut
              data={[
                { name: '市电', value: totalGrid, color: 'var(--chart-1)' },
                { name: '绿电', value: totalGreen, color: 'var(--success)' },
              ]}
              unit=" kWh"
              height={200}
            />
            <div className="mt-1 text-center text-xs text-muted-foreground">
              单台综合能耗 <span className="font-mono text-foreground">{perUnitKgce.toLocaleString()}</span> kgce
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <MetricCard icon={Gauge} label="综合能耗" value={perUnitKgce.toLocaleString()} unit="kgce" />
            <MetricCard icon={Zap} label="总电量" value={totalKwh.toLocaleString()} unit="kWh" />
            <MetricCard icon={Plug} label="市电" value={totalGrid.toLocaleString()} unit="kWh" foot={`占比 ${gridPct.toFixed(1)}%`} tone="grid" />
            <MetricCard icon={Leaf} label="绿电" value={totalGreen.toLocaleString()} unit="kWh" foot={`占比 ${greenPct.toFixed(1)}%`} tone="green" />
            <MetricCard icon={Wind} label="压缩空气" value={air ? air.amount.toLocaleString() : '—'} unit={air?.unit ?? 'Nm³'} />
          </div>
        </div>
      </Panel>

      {/* 下：生产制造用能分析（工序流，占满整宽，给流程更宽的空间） */}
      <Panel title="生产制造用能分析" desc="各生产单元综合能耗（kgce）与市电/绿电用量（kWh）">
        <div className="flex items-stretch gap-2 overflow-x-auto pb-2">
          <div className="flex shrink-0 items-center justify-center rounded-lg border border-border bg-secondary/40 px-3 text-sm text-muted-foreground">
            开始
          </div>
          {stages.map((p) => (
            <div key={p.name} className="flex flex-1 items-center gap-2">
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-40 flex-1 rounded-lg border border-border bg-card p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{p.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">{(p.ratio * 100).toFixed(1)}%</span>
                </div>
                <div className="mt-1 font-mono text-xl font-semibold text-primary">
                  {p.kgce}
                  <span className="ml-1 text-xs font-normal text-muted-foreground">kgce</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-[linear-gradient(90deg,var(--chart-1),var(--primary))]" style={{ width: `${Math.max(p.ratio * 100, 3)}%` }} />
                </div>
                <div className="mt-2 space-y-0.5 text-[11px] text-muted-foreground">
                  <div className="flex justify-between"><span>市电</span><span className="font-mono text-[var(--chart-1)]">{p.gridKwh} kWh</span></div>
                  <div className="flex justify-between"><span>绿电</span><span className="font-mono text-[var(--success)]">{p.greenKwh} kWh</span></div>
                </div>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            <div className="flex shrink-0 items-center justify-center rounded-lg border border-border bg-secondary/40 px-3 text-sm text-muted-foreground">
              结束
            </div>
          </div>
        </div>
      </Panel>
    </div>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
  unit,
  foot,
  tone,
}: {
  icon: typeof Zap
  label: string
  value: string
  unit: string
  foot?: string
  tone?: 'grid' | 'green'
}) {
  return (
    <div className="rounded-lg border border-border bg-secondary/40 p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <Icon className={`size-4 ${tone === 'green' ? 'text-[var(--success)]' : tone === 'grid' ? 'text-[var(--chart-1)]' : 'text-primary'}`} />
      </div>
      <div className="mt-1.5 font-mono text-2xl font-semibold text-foreground">
        {value}
        <span className="ml-1 text-xs font-normal text-muted-foreground">{unit}</span>
      </div>
      {foot ? <div className="mt-0.5 text-[11px] text-muted-foreground">{foot}</div> : null}
    </div>
  )
}

/* ============================ 产品用能分析 Tab ============================ */
export function ProductEnergyTab({ onJump }: { onJump: (sel: CascadeSel, unit: string, order: string) => void }) {
  const [draft, setDraft] = useState<CascadeSel>(() => initCascade('变压器'))
  const [dFrom, setDFrom] = useState(DEFAULT_FROM)
  const [dTo, setDTo] = useState(DEFAULT_TO)
  const [applied, setApplied] = useState<CascadeSel>(() => initCascade('变压器'))
  const [traceOpen, setTraceOpen] = useState(false)

  const allRows = useMemo(() => modelEnergy(applied.model, applied.ind), [applied.model, applied.ind])
  const rows = useMemo(() => {
    if (applied.company === ALL_COMPANIES) return allRows
    const scoped = allRows.filter((r) => r.unit === applied.company)
    return scoped.length ? scoped : allRows
  }, [allRows, applied.company])
  const avg = useMemo(() => energyAverage(applied.model, applied.ind), [applied.model, applied.ind])
  const ranked = useMemo(() => [...rows].sort((a, b) => b.perUnitKgce - a.perUnitKgce).slice(0, 5), [rows])
  const [selUnit, setSelUnit] = useState<string>('')
  const focusUnit = selUnit && rows.some((r) => r.unit === selUnit) ? selUnit : (rows.find((r) => !r.isProject)?.unit ?? rows[0]?.unit ?? '')

  const focusPerUnit = rows.find((r) => r.unit === focusUnit)?.perUnitKgce ?? avg.perUnitKgce
  const focusPerFeat = rows.find((r) => r.unit === focusUnit)?.perFeatureKgce ?? avg.perFeatureKgce
  const seed = `${applied.model}|${focusUnit}|acct-e`
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

      {/* 各经营单位综合能耗排名（点击切换焦点单位） */}
      <Panel title={`各经营单位综合能耗排名 · ${applied.model}`} desc="按单台综合能耗从高到低排名，最多展示前 5 家；点击经营单位查看其工序用能明细">
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
                <span className="w-32 shrink-0 truncate text-sm text-foreground">{r.unit}</span>
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

      {/* 经营单位工序用能明细 + 数据追踪 */}
      <section className="relative space-y-4 rounded-2xl border border-primary/25 bg-primary/[0.03] p-4">
        <span className="pointer-events-none absolute inset-x-0 -top-px mx-auto h-px w-2/3 bg-[linear-gradient(90deg,transparent,var(--primary),transparent)]" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              经营单位用能明细 · <span className="text-primary">{focusUnit}</span>
            </h3>
            <span className="text-xs text-muted-foreground">{applied.model} · 工序能耗追踪</span>
          </div>
          <button
            type="button"
            onClick={() => setTraceOpen(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
          >
            <Link2 className="size-4" /> 数据追踪
          </button>
        </div>

        <EnergyProcessLayout suffix={`${focusUnit} · ${applied.model}`} perUnitKgce={focusPerUnit} stages={focusStages} energyRows={focusEnergyRows} />
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

export function OrderEnergyTab({ jump }: { jump: EnergyJump | null }) {
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

  const feat = featureOf(sel.model)
  const seed = `${sel.model}|${unit}|${planId}`
  const prof = useMemo(() => energyProfile(sel.model, seed), [sel.model, seed])
  const perUnitKgce = prof.totalKgce
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
      <Panel className="relative z-30" title="订单能耗追溯" desc="将产品能耗拆分至订单与生产计划级别，追溯批次工序用能">
        <div className="flex flex-wrap items-end gap-3">
          <Select label="产业" value={sel.ind} onChange={setInd} options={industries.map((v) => ({ label: v, value: v }))} />
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

      {/* 计划信息条 */}
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

      {/* 工序用能明细 + 数据追踪 */}
      <section className="relative space-y-4 rounded-2xl border border-primary/25 bg-primary/[0.03] p-4">
        <span className="pointer-events-none absolute inset-x-0 -top-px mx-auto h-px w-2/3 bg-[linear-gradient(90deg,transparent,var(--primary),transparent)]" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              订单工序用能明细 · <span className="text-primary">{orderId}</span>
            </h3>
            <span className="text-xs text-muted-foreground">{planId} · 工序能耗追踪</span>
          </div>
          <button
            type="button"
            onClick={() => setTraceOpen(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
          >
            <Link2 className="size-4" /> 数据追踪
          </button>
        </div>

        <EnergyProcessLayout suffix={`${orderId} · ${planId}`} perUnitKgce={perUnitKgce} stages={stages} energyRows={energyRows} />
      </section>

      <EnergyTraceModal
        open={traceOpen}
        onClose={() => setTraceOpen(false)}
        model={sel.model}
        unit={unit}
        perUnitKgce={perUnitKgce}
        perFeatureKgce={prof.perFeatureKgce}
        stages={stages}
        energyRows={energyRows}
        subtitle={`${unit} · ${orderId} · ${planId}`}
      />
    </div>
  )
}
