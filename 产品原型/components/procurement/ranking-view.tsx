'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Boxes, Package, Ruler, ArrowUpRight, Gauge, Search, RotateCcw } from 'lucide-react'
import { Panel, KpiCard, DataTable } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import { Modal } from '@/components/shared/modal'
import { Donut } from '@/components/shared/charts'
import { TimeFilter } from './cascade-filter'
import {
  industries,
  linesOf,
  categoriesOf,
  allModelsOf,
  unitMetrics,
  featureOf,
  ordersOf,
  lifecycleStages,
  orgTree,
  leavesUnder,
  type OrgNode,
} from '@/lib/procurement'

type AggModel = {
  model: string
  line: string
  category: string
  perKva: number
  perUnit: number
  material: number
  qty: number
  feature: number
  featureUnit: string
}

export function RankingView() {
  const [ind, setInd] = useState('变压器')
  const [line, setLine] = useState(() => linesOf('变压器')[0])
  const [cat, setCat] = useState(() => categoriesOf('变压器', linesOf('变压器')[0])[0])
  const [from, setFrom] = useState('2026-06')
  const [to, setTo] = useState('2026-08')

  /* 组织树选中节点（可为集团/二级单位/三级经营单位） */
  const [scope, setScope] = useState<string>('特变电工电装集团')
  /* 已应用的查询条件 */
  const [applied, setApplied] = useState({ ind: '变压器', line: linesOf('变压器')[0], cat: categoriesOf('变压器', linesOf('变压器')[0])[0], scope: '特变电工电装集团' })
  const [drill, setDrill] = useState<AggModel | null>(null)

  /* 选中节点覆盖的叶子经营单位集合 */
  const scopeLeaves = useMemo(() => {
    if (applied.scope === '特变电工电装集团') return null // null = 全集团
    return leavesUnder(applied.scope)
  }, [applied.scope])

  /* 型号聚合：对选中范围内的叶子单位取均值 */
  const agg = useMemo<AggModel[]>(() => {
    return allModelsOf(applied.ind).map((m) => {
      let ms = unitMetrics(m.model, applied.ind)
      if (scopeLeaves) ms = ms.filter((x) => scopeLeaves.includes(x.unit))
      if (ms.length === 0) ms = unitMetrics(m.model, applied.ind)
      const mean = (arr: number[]) => arr.reduce((s, v) => s + v, 0) / arr.length
      const feat = featureOf(m.model)
      return {
        ...m,
        perKva: Math.round(mean(ms.map((x) => x.perKva)) * 10000) / 10000,
        perUnit: Math.round(mean(ms.map((x) => x.perUnit)) * 1000) / 1000,
        material: Math.round(mean(ms.map((x) => x.material)) * 1000) / 1000,
        qty: ms.reduce((s, x) => s + x.qty, 0),
        feature: feat.feature,
        featureUnit: feat.unit,
      }
    })
  }, [applied, scopeLeaves])

  const sorted = [...agg].sort((a, b) => a.perKva - b.perKva)
  const n = Math.min(5, Math.ceil(sorted.length / 2))
  const good = sorted.slice(0, n)
  const poor = sorted.slice(-n).reverse()

  const totalQty = agg.reduce((s, m) => s + m.qty, 0)
  const meanKva = agg.length ? agg.reduce((s, m) => s + m.perKva, 0) / agg.length : 0

  function onQuery() {
    setApplied({ ind, line, cat, scope })
  }
  function onReset() {
    const l = linesOf('变压器')[0]
    const c = categoriesOf('变压器', l)[0]
    setInd('变压器')
    setLine(l)
    setCat(c)
    setScope('特变电工电装集团')
    setFrom('2026-06')
    setTo('2026-08')
    setApplied({ ind: '变压器', line: l, cat: c, scope: '特变电工电装集团' })
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
      {/* 左侧三级组织树 */}
      <OrgTreePanel scope={scope} onScope={setScope} />

      <div className="space-y-5">
        <Panel className="relative z-30" title="纵向对比">
          <div className="flex flex-wrap items-center gap-3">
            <Select
              label="产业"
              value={ind}
              onChange={(v) => {
                setInd(v)
                const l = linesOf(v)[0]
                setLine(l)
                setCat(categoriesOf(v, l)[0])
              }}
              options={industries.map((v) => ({ label: v, value: v }))}
            />
            <Select
              label="产线"
              value={line}
              onChange={(v) => {
                setLine(v)
                setCat(categoriesOf(ind, v)[0])
              }}
              options={linesOf(ind).map((v) => ({ label: v, value: v }))}
            />
            <Select label="产品类别" value={cat} onChange={setCat} options={categoriesOf(ind, line).map((v) => ({ label: v, value: v }))} />
            <TimeFilter from={from} to={to} onFrom={setFrom} onTo={setTo} />
            <button type="button" onClick={onQuery} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
              <Search className="size-4" /> 查询
            </button>
            <button type="button" onClick={onReset} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <RotateCcw className="size-4" /> 重置
            </button>
          </div>
        </Panel>

        {/* 当前对比范围提示 */}
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card/60 px-3 py-2 text-xs text-muted-foreground">
          <Gauge className="size-3.5 text-primary" />
          当前对比范围：
          <span className="font-medium text-foreground">{applied.scope}</span>
          {scopeLeaves && scopeLeaves.length > 1 && <span>（{scopeLeaves.length} 家三级经营单位均值）</span>}
          <span className="text-muted-foreground">· 在左侧组织树选择单位可切换对比范围</span>
        </div>

        {/* 重点指标 */}
        <div className="grid grid-cols-3 gap-4">
          <KpiCard label="产品型号数量" value={String(agg.length)} unit="个" icon={Boxes} />
          <KpiCard label="生产产品总数" value={totalQty.toLocaleString()} unit="台" icon={Package} />
          <KpiCard label="单位产品碳足迹（均值）" value={meanKva.toFixed(4)} unit="kgCO2/kVA" icon={Ruler} />
        </div>

        {/* 榜单 */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="低碳标杆 Top5" className="border-t-2 border-t-[var(--success)]">
            <div className="space-y-2">
              {good.map((m, i) => (
                <RankCard key={m.model} m={m} idx={i} kind="good" onClick={() => setDrill(m)} />
              ))}
            </div>
          </Panel>
          <Panel title="改进对象 Top5" className="border-t-2 border-t-[var(--destructive)]">
            <div className="space-y-2">
              {poor.map((m, i) => (
                <RankCard key={m.model} m={m} idx={i} kind="poor" onClick={() => setDrill(m)} />
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <ModelDrill model={drill} industry={applied.ind} scope={applied.scope} scopeLeaves={scopeLeaves} onClose={() => setDrill(null)} />
    </div>
  )
}

/* 榜单卡片 */
function RankCard({
  m,
  idx,
  kind,
  onClick,
}: {
  m: AggModel
  idx: number
  kind: 'good' | 'poor'
  onClick: () => void
}) {
  const tone = kind === 'good' ? 'var(--success)' : 'var(--destructive)'
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-lg border border-border px-3 py-2.5 text-left transition-colors hover:bg-accent/40"
    >
      <span
        className="flex size-6 shrink-0 items-center justify-center rounded-md text-xs font-bold"
        style={{ background: `color-mix(in oklch, ${tone} 16%, transparent)`, color: tone }}
      >
        {idx + 1}
      </span>
      <div className="min-w-0 flex-1">
        <span className="truncate font-mono text-[13px] font-medium text-foreground">{m.model}</span>
        <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
          {m.qty} 台 · 单台 {m.perUnit} tCO2 · 特征量 {m.feature.toLocaleString()}
          {m.featureUnit}
        </div>
      </div>
      <div className="shrink-0 text-right">
        <div className="font-mono text-sm font-semibold" style={{ color: tone }}>
          {m.perKva}
        </div>
        <div className="text-[10px] text-muted-foreground">kgCO2/{m.featureUnit}</div>
      </div>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  )
}

/* 三级组织树：电装集团 → 二级单位 → 三级经营单位 */
function OrgTreePanel({ scope, onScope }: { scope: string; onScope: (v: string) => void }) {
  return (
    <div className="h-fit rounded-xl border border-border bg-card p-3">
      <div className="mb-3 flex items-center gap-2 border-b border-border pb-2.5 text-sm font-semibold text-primary">
        <Boxes className="size-4" />
        组织结构
      </div>
      <TreeRow name="特变电工电装集团" level={0} scope={scope} onScope={onScope} defaultOpen>
        {orgTree.map((n) => (
          <OrgBranch key={n.name} node={n} level={1} scope={scope} onScope={onScope} />
        ))}
      </TreeRow>
    </div>
  )
}

function OrgBranch({ node, level, scope, onScope }: { node: OrgNode; level: number; scope: string; onScope: (v: string) => void }) {
  if (!node.children?.length) {
    return <TreeLeaf name={node.name} level={level} scope={scope} onScope={onScope} />
  }
  return (
    <TreeRow name={node.name} level={level} scope={scope} onScope={onScope}>
      {node.children.map((c) => (
        <OrgBranch key={c.name} node={c} level={level + 1} scope={scope} onScope={onScope} />
      ))}
    </TreeRow>
  )
}

function TreeRow({
  name,
  level,
  scope,
  onScope,
  children,
  defaultOpen = false,
}: {
  name: string
  level: number
  scope: string
  onScope: (v: string) => void
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen || level <= 1)
  const active = scope === name
  return (
    <div>
      <div
        className={`flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-[13px] transition-colors ${
          active ? 'bg-primary/10 font-medium text-primary' : 'text-foreground hover:bg-accent/40'
        }`}
      >
        <button onClick={() => setOpen((v) => !v)} className="text-muted-foreground" aria-label={open ? '收起' : '展开'}>
          <ChevronRight className={`size-3.5 transition-transform ${open ? 'rotate-90' : ''}`} />
        </button>
        <button onClick={() => onScope(name)} className="flex-1 truncate text-left">
          {name}
        </button>
      </div>
      {open && <div className="ml-3 mt-0.5 space-y-0.5 border-l border-dashed border-border pl-2">{children}</div>}
    </div>
  )
}

function TreeLeaf({ name, level, scope, onScope }: { name: string; level: number; scope: string; onScope: (v: string) => void }) {
  const active = scope === name
  return (
    <button
      onClick={() => onScope(name)}
      className={`flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 pl-4 text-left text-[13px] transition-colors ${
        active ? 'bg-primary/10 font-medium text-primary' : 'text-foreground hover:bg-accent/40'
      }`}
    >
      <span className="truncate">{name}</span>
    </button>
  )
}

/* 型号下钻：若选中二级单位则下面有多个三级经营单位生产该型号，用 Tab 分别展示 */
function ModelDrill({
  model,
  industry,
  scope,
  scopeLeaves,
  onClose,
}: {
  model: AggModel | null
  industry: string
  scope: string
  scopeLeaves: string[] | null
  onClose: () => void
}) {
  /* 该型号在当前范围内、实际有生产记录的三级经营单位（最多展示 4 个 Tab） */
  const units = useMemo(() => {
    if (!model) return []
    const all = unitMetrics(model.model, industry).map((x) => x.unit)
    let list = all
    if (scopeLeaves) {
      const inScope = all.filter((u) => scopeLeaves.includes(u))
      list = inScope.length ? inScope : all
    }
    return list.slice(0, 4)
  }, [model, industry, scopeLeaves])

  const [activeUnit, setActiveUnit] = useState(0)
  const unit = units[activeUnit] ?? units[0]

  if (!model || !unit) return null

  return (
    <Modal open={!!model} onClose={onClose} title={`${model.model} · ${scope}`} description={`${industry} · ${model.category}`} size="xl">
      {/* 多三级单元：Tab 切换 */}
      {units.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {units.map((u, i) => (
            <button
              key={u}
              onClick={() => setActiveUnit(i)}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                i === activeUnit ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      )}
      <UnitDrillBody key={unit} model={model} industry={industry} unit={unit} />
    </Modal>
  )
}

/* 单个三级经营单位的型号详情 */
function UnitDrillBody({ model, industry, unit }: { model: AggModel; industry: string; unit: string }) {
  const orders = useMemo(() => ordersOf(model.model, unit, industry), [model.model, unit, industry])
  const um = useMemo(() => unitMetrics(model.model, industry).find((x) => x.unit === unit) ?? null, [model.model, industry, unit])
  const perUnit = um?.perUnit ?? model.perUnit
  const totalQty = orders.reduce((s, o) => s + o.qty, 0)

  const composition = lifecycleStages.map((s, i) => ({
    name: s.name,
    value: Math.round(perUnit * s.ratio * 1000) / 1000,
    color: `var(--chart-${i + 1})`,
  }))

  /* 深链到 实景数据库-碳足迹核算-订单碳足迹追溯 */
  function orderTraceHref(orderId: string) {
    const p = new URLSearchParams({ view: 'order', ind: industry, line: model.line, cat: model.category, model: model.model, unit, order: orderId })
    return `/carbon-footprint/database/accounting?${p.toString()}`
  }

  return (
    <div className="space-y-4">
      {/* 关键指标：单台碳排量、单位碳排量在前两位 */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MiniStat label="单台碳排量" value={perUnit.toFixed(3)} unit="tCO2/台" accent />
        <MiniStat label="单位碳排量" value={model.perKva.toFixed(4)} unit={`kgCO2/${model.featureUnit}`} accent />
        <MiniStat label="生产总产品数" value={totalQty.toLocaleString()} unit="台" />
        <MiniStat label="单台特征量" value={model.feature.toLocaleString()} unit={model.featureUnit} />
      </div>

      {/* 整体碳排构成：一整排（饼图 + 阶段明细列表并排铺满） */}
      <div className="rounded-lg border border-border p-4">
        <div className="mb-3 text-sm font-medium text-foreground">整体碳排构成 · 单台 {perUnit.toFixed(3)} tCO2/台</div>
        <div className="grid items-center gap-4 lg:grid-cols-[280px_1fr]">
          <Donut data={composition} height={200} unit=" tCO2" innerRadius={52} showLegend={false} />
          <div className="grid grid-cols-2 gap-3">
            {composition.map((c) => {
              const pct = perUnit > 0 ? (c.value / perUnit) * 100 : 0
              return (
                <div key={c.name} className="rounded-lg border border-border bg-secondary/40 p-3">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-sm" style={{ background: c.color }} />
                    <span className="text-sm text-foreground">{c.name}</span>
                    <span className="ml-auto font-mono text-sm text-primary">{pct.toFixed(1)}%</span>
                  </div>
                  <div className="mt-2 font-mono text-lg font-semibold text-foreground">
                    {c.value} <span className="text-[11px] font-normal text-muted-foreground">tCO2/台</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 销售订单各环节碳排构成及占比：去客户、生产计划；增加订单详情操作列；支持排序 */}
      <div className="rounded-lg border border-border p-3">
        <div className="mb-2 text-sm font-medium text-foreground">销售订单各环节碳排构成及占比</div>
        <DataTable
          columns={[
            { key: 'order', label: '销售订单', className: 'font-mono text-xs', sortable: true },
            { key: 'qty', label: '数量', align: 'right', sortable: true, render: (r) => `${r.qty} 台` },
            { key: 'material', label: '原材料获取', align: 'right', sortable: true, render: (r) => <StagePct value={r.material} total={r.perUnit} /> },
            { key: 'transport', label: '原材料运输', align: 'right', sortable: true, render: (r) => <StagePct value={r.transport} total={r.perUnit} /> },
            { key: 'produce', label: '生产制造', align: 'right', sortable: true, render: (r) => <StagePct value={r.produce} total={r.perUnit} /> },
            { key: 'waste', label: '废弃物处理', align: 'right', sortable: true, render: (r) => <StagePct value={r.waste} total={r.perUnit} /> },
            { key: 'perUnit', label: '单台合计', align: 'right', className: 'font-mono text-primary', sortable: true, render: (r) => `${r.perUnit}` },
            {
              key: 'op',
              label: '操作',
              align: 'center',
              render: (r) => (
                <Link
                  href={orderTraceHref(r.order)}
                  className="inline-flex items-center gap-1 rounded-md border border-primary/40 px-2 py-1 text-xs text-primary transition-colors hover:bg-primary/10"
                >
                  订单详情
                  <ArrowUpRight className="size-3" />
                </Link>
              ),
            },
          ]}
          rows={orders}
        />
      </div>
    </div>
  )
}

function MiniStat({ label, value, unit, accent = false }: { label: string; value: string; unit: string; accent?: boolean }) {
  return (
    <div className={`rounded-lg border p-3 ${accent ? 'border-primary/30 bg-primary/5' : 'border-border bg-card/60'}`}>
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className={`font-mono text-lg font-semibold ${accent ? 'text-primary' : 'text-foreground'}`}>{value}</span>
        <span className="text-[10px] text-muted-foreground">{unit}</span>
      </div>
    </div>
  )
}

/* 环节碳排 + 占比 */
function StagePct({ value, total }: { value: number; total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <span className="font-mono text-xs">
      {value}
      <span className="ml-1 text-[10px] text-muted-foreground">{pct}%</span>
    </span>
  )
}
