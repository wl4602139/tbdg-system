'use client'

import { useMemo, useState } from 'react'
import { Building2, FileStack, Boxes, ChevronRight, Search, RotateCcw, Layers } from 'lucide-react'
import { Panel, KpiCard, DataTable } from '@/components/shared/primitives'
import { Modal } from '@/components/shared/modal'
import { BarGroup } from '@/components/shared/charts'
import { CascadeFilter, TimeFilter, initCascade, type CascadeSel } from './cascade-filter'
import {
  unitMetrics,
  ordersOf,
  featureOf,
  transformerSpec,
  ALL_COMPANIES,
  type UnitMetric,
} from '@/lib/procurement'

/* 一个型号最多同时由 5 个经营单位生产 */
const MAX_UNITS = 5

/* 阶段对比配色（区别于单台排序），含废弃物回收环节 */
const STAGE_KEYS = [
  { key: 'material', name: '原材料获取', color: 'var(--chart-4)' },
  { key: 'transport', name: '原材料运输', color: 'var(--chart-3)' },
  { key: 'produce', name: '生产制造', color: 'var(--chart-1)' },
  { key: 'waste', name: '废弃物回收', color: 'var(--chart-2)' },
]

export function CompareView() {
  // 编辑态
  const [sel, setSel] = useState<CascadeSel>(() => initCascade('变压器'))
  const [from, setFrom] = useState('2026-06')
  const [to, setTo] = useState('2026-08')
  // 提交态（点击查询后生效）
  const [applied, setApplied] = useState({ sel, from, to })
  const [drillUnit, setDrillUnit] = useState<UnitMetric | null>(null)
  const [breakdown, setBreakdown] = useState(false)

  const feat = featureOf(applied.sel.model)
  const trSpec = applied.sel.ind === '变压器' ? transformerSpec(applied.sel.model) : null

  function onQuery() {
    setApplied({ sel, from, to })
  }
  function onReset() {
    const s = initCascade('变压器')
    setSel(s)
    setFrom('2026-06')
    setTo('2026-08')
    setApplied({ sel: s, from: '2026-06', to: '2026-08' })
  }

  /* 单台产品碳足迹升序（越小越好）；项目公司选中具体公司时仅保留该单位；最多 5 家 */
  const rows = useMemo(() => {
    const all = unitMetrics(applied.sel.model, applied.sel.ind)
    const scoped = applied.sel.company === ALL_COMPANIES ? all : all.filter((r) => r.unit === applied.sel.company)
    const base = scoped.length ? scoped : all
    return base
      .slice()
      .sort((a, b) => a.perUnit - b.perUnit)
      .slice(0, MAX_UNITS)
  }, [applied])

  const maxPerUnit = Math.max(...rows.map((r) => r.perUnit), 0)
  const totalOrders = rows.reduce((s, r) => s + r.orders, 0)
  const stageData = rows.map((r) => ({ name: r.unit, material: r.material, transport: r.transport, produce: r.produce, waste: r.waste }))

  return (
    <div className="space-y-5">
      <Panel className="relative z-30" title="横向对比">
        <CascadeFilter
          value={sel}
          onChange={setSel}
          time={<TimeFilter from={from} to={to} onFrom={setFrom} onTo={setTo} />}
        >
          <button
            type="button"
            onClick={onQuery}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Search className="size-4" />
            查询
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="size-4" />
            重置
          </button>
        </CascadeFilter>
      </Panel>

      {/* 重点指标（去掉车间产线数量） */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="涉及经营单位" value={String(rows.length)} unit="家" icon={Building2} />
        <button
          type="button"
          onClick={() => setBreakdown(true)}
          className="rounded-xl text-left transition-transform hover:-translate-y-0.5"
        >
          <KpiCard label="生产订单数" value={String(totalOrders)} unit="条" icon={FileStack} trend="点击查看各经营单位明细" up />
        </button>
        {trSpec ? (
          <div className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground">产品特征量</span>
              <div className="flex items-end gap-5">
                <div>
                  <div className="font-mono text-lg font-semibold text-foreground">{trSpec.voltage}</div>
                  <div className="text-[11px] text-muted-foreground">电压等级</div>
                </div>
                <div className="h-7 w-px bg-border" />
                <div>
                  <div className="font-mono text-lg font-semibold text-foreground">{trSpec.capacity}</div>
                  <div className="text-[11px] text-muted-foreground">容量</div>
                </div>
              </div>
            </div>
            <Boxes className="size-5 shrink-0 text-primary" />
          </div>
        ) : (
          <KpiCard label="产品特征量" value={feat.feature.toLocaleString()} unit={feat.unit} icon={Boxes} />
        )}
      </div>

      {/* 单台产品碳足迹排序（横向排名条） */}
      <Panel title={`同型号经营单位排序 · ${applied.sel.model}`} desc="按单台产品碳足迹升序排列（越低越优），最多展示 5 家同时生产的经营单位">
        <div className="space-y-1.5">
          {rows.map((r, i) => {
            const pct = maxPerUnit > 0 ? (r.perUnit / maxPerUnit) * 100 : 0
            return (
              <button
                key={r.unit}
                onClick={() => setDrillUnit(r)}
                className="group flex w-full items-center gap-3 rounded-lg border border-transparent px-2.5 py-2 text-left transition-colors hover:border-border hover:bg-accent/40"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                  {i + 1}
                </span>
                <span className="w-28 shrink-0 truncate text-sm text-foreground">{r.unit}</span>
                <div className="h-4 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,var(--chart-1),var(--primary))] transition-all"
                    style={{ width: `${Math.max(pct, 4)}%` }}
                  />
                </div>
                <span className="w-28 shrink-0 text-right font-mono text-sm font-semibold text-foreground">
                  {r.perUnit}
                  <span className="ml-0.5 font-sans text-[10px] font-normal text-muted-foreground">tCO2/台</span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            )
          })}
        </div>
      </Panel>

      {/* 生命周期阶段碳排对比（分组柱状，区别于上方排序） */}
      <Panel
        title="生命周期阶段碳排对比"
        desc="各经营单位在原材料获取、原材料运输、生产制造、废弃物回收四个阶段的单台碳排对比（tCO2/台）"
        actions={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground">
            <Layers className="size-3.5" />
            阶段构成分析
          </span>
        }
      >
        <BarGroup data={stageData} keys={STAGE_KEYS} height={260} />
        {/* 阶段明细表：与柱状互为补充 */}
        <div className="mt-4">
          <DataTable
            columns={[
              { key: 'unit', label: '经营单位' },
              { key: 'material', label: '原材料获取', align: 'right', className: 'font-mono', render: (r: UnitMetric) => `${r.material}` },
              { key: 'transport', label: '原材料运输', align: 'right', className: 'font-mono', render: (r: UnitMetric) => `${r.transport}` },
              { key: 'produce', label: '生产制造', align: 'right', className: 'font-mono', render: (r: UnitMetric) => `${r.produce}` },
              { key: 'waste', label: '废弃物回收', align: 'right', className: 'font-mono', render: (r: UnitMetric) => `${r.waste}` },
              { key: 'perUnit', label: '单台合计', align: 'right', className: 'font-mono font-semibold', render: (r: UnitMetric) => `${r.perUnit}` },
            ]}
            rows={rows}
          />
        </div>
      </Panel>

      {/* KPI 明细弹窗：各经营单位订单数 */}
      <Modal open={breakdown} onClose={() => setBreakdown(false)} title="各经营单位生产订单数" size="md">
        <DataTable
          columns={[
            { key: 'unit', label: '经营单位' },
            { key: 'orders', label: '生产订单数', align: 'right' as const, render: (r: UnitMetric) => `${r.orders} 条` },
          ]}
          rows={[...rows].sort((a, b) => b.orders - a.orders)}
        />
        <div className="mt-3 flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-4 py-2.5 text-sm">
          <span className="text-muted-foreground">合计</span>
          <span className="font-mono font-semibold text-foreground">{totalOrders} 条</span>
        </div>
      </Modal>

      <UnitDrill
        unit={drillUnit}
        model={applied.sel.model}
        industry={applied.sel.ind}
        period={`${applied.from} 至 ${applied.to}`}
        onClose={() => setDrillUnit(null)}
      />
    </div>
  )
}

/* 下钻：经营单位 → 全部生产订单统一对比（列表 + 多维柱状） */
function UnitDrill({
  unit,
  model,
  industry,
  period,
  onClose,
}: {
  unit: UnitMetric | null
  model: string
  industry: string
  period: string
  onClose: () => void
}) {
  const orders = useMemo(
    () => (unit ? ordersOf(model, unit.unit, industry) : []),
    [unit, model, industry],
  )

  const perUnitByOrder = orders.map((o) => ({ name: o.order, value: o.perUnit }))
  const materialByOrder = orders.map((o) => ({ name: o.order, value: o.material }))
  const produceByOrder = orders.map((o) => ({ name: o.order, value: o.produce }))
  const wasteByOrder = orders.map((o) => ({ name: o.order, value: o.waste }))

  if (!unit) return null

  return (
    <Modal open={!!unit} onClose={onClose} title={`${unit.unit} · ${model}`} size="xl">
      <p className="mb-4 text-xs text-muted-foreground">{period} · 全部生产订单统一对比分析</p>
      <div className="space-y-4">
        <div className="rounded-lg border border-border p-3">
          <div className="mb-2 text-sm font-medium text-foreground">生产订单数据详情</div>
          <DataTable
            columns={[
              { key: 'order', label: '生产订单', className: 'font-mono text-xs' },
              { key: 'qty', label: '数量', align: 'right', render: (r) => `${r.qty} 台` },
              { key: 'perUnit', label: '单台(tCO2)', align: 'right', className: 'font-mono' },
              { key: 'material', label: '原材料获取(tCO2)', align: 'right', className: 'font-mono text-muted-foreground' },
              { key: 'transport', label: '原材料运输(tCO2)', align: 'right', className: 'font-mono text-muted-foreground' },
              { key: 'produce', label: '生产制造(tCO2)', align: 'right', className: 'font-mono text-muted-foreground' },
              { key: 'waste', label: '废弃物处理(tCO2)', align: 'right', className: 'font-mono text-muted-foreground' },
              { key: 'plans', label: '生产计划', align: 'right', render: (r) => `${r.plans.length} 个` },
            ]}
            rows={orders}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border p-3">
            <div className="mb-2 text-sm font-medium text-foreground">各订单单台碳排对比（tCO2/台）</div>
            <BarGroup data={perUnitByOrder} keys={[{ key: 'value', name: '单台碳排', color: 'var(--chart-2)' }]} height={200} />
          </div>
          <div className="rounded-lg border border-border p-3">
            <div className="mb-2 text-sm font-medium text-foreground">各订单原材料获取碳排对比（tCO2/台）</div>
            <BarGroup data={materialByOrder} keys={[{ key: 'value', name: '原材料获取', color: 'var(--chart-4)' }]} height={200} />
          </div>
          <div className="rounded-lg border border-border p-3">
            <div className="mb-2 text-sm font-medium text-foreground">各订单废弃物回收碳排对比（tCO2/台）</div>
            <BarGroup data={wasteByOrder} keys={[{ key: 'value', name: '废弃物回收', color: 'var(--chart-2)' }]} height={200} />
          </div>
          <div className="rounded-lg border border-border p-3">
            <div className="mb-2 text-sm font-medium text-foreground">各订单生产环节碳排对比（tCO2/台）</div>
            <BarGroup data={produceByOrder} keys={[{ key: 'value', name: '生产环节', color: 'var(--chart-3)' }]} height={200} />
          </div>
        </div>
      </div>
    </Modal>
  )
}
