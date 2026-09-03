'use client'

import { useMemo, useState } from 'react'
import { Building2, FileStack, Factory, Boxes, ChevronRight } from 'lucide-react'
import { Panel, KpiCard, DataTable } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import { Modal } from '@/components/shared/modal'
import { BarGroup } from '@/components/shared/charts'
import { CascadeFilter, TimeFilter, initCascade, type CascadeSel } from './cascade-filter'
import {
  unitMetrics,
  ordersOf,
  sortMetrics,
  featureOf,
  transformerSpec,
  type SortMetricKey,
  type UnitMetric,
} from '@/lib/procurement'

export function CompareView() {
  const [sel, setSel] = useState<CascadeSel>(() => initCascade('变压器'))
  const [from, setFrom] = useState('2026-06')
  const [to, setTo] = useState('2026-08')
  const [sortKey, setSortKey] = useState<SortMetricKey>('perKva')
  const [drillUnit, setDrillUnit] = useState<UnitMetric | null>(null)
  const [breakdown, setBreakdown] = useState<'orders' | 'lines' | null>(null)

  const metric = sortMetrics.find((m) => m.key === sortKey)!
  const feat = featureOf(sel.model)
  const trSpec = sel.ind === '变压器' ? transformerSpec(sel.model) : null

  /* 经营单位排序（升序：越小越好） */
  const rows = useMemo(() => {
    return unitMetrics(sel.model, sel.ind)
      .slice()
      .sort((a, b) => (a[sortKey] as number) - (b[sortKey] as number))
  }, [sel.model, sel.ind, sortKey])

  const maxVal = Math.max(...rows.map((r) => r[sortKey] as number))
  const totalOrders = rows.reduce((s, r) => s + r.orders, 0)
  const totalLines = rows.reduce((s, r) => s + r.lines, 0)

  return (
    <div className="space-y-5">
      <Panel className="relative z-30" title="横向对比">
        <CascadeFilter
          value={sel}
          onChange={setSel}
          time={<TimeFilter from={from} to={to} onFrom={setFrom} onTo={setTo} />}
        />
      </Panel>

      {/* 重点指标 */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="涉及经营单位" value={String(rows.length)} unit="家" icon={Building2} />
        <button
          type="button"
          onClick={() => setBreakdown('orders')}
          className="rounded-xl text-left transition-transform hover:-translate-y-0.5"
        >
          <KpiCard label="生产订单数" value={String(totalOrders)} unit="条" icon={FileStack} trend="点击查看各经营单位明细" up />
        </button>
        <button
          type="button"
          onClick={() => setBreakdown('lines')}
          className="rounded-xl text-left transition-transform hover:-translate-y-0.5"
        >
          <KpiCard label="车间产线数量" value={String(totalLines)} unit="条" icon={Factory} trend="点击查看各经营单位明细" up />
        </button>
        {/* 产品特征量：变压器展示电压等级 + 容量 */}
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

      {/* 经营单位排序 */}
      <Panel
        title={`同型号经营单位排序 · ${sel.model}`}
        actions={
          <Select
            label="排序内容"
            value={sortKey}
            onChange={(v) => setSortKey(v as SortMetricKey)}
            options={sortMetrics.map((m) => ({ label: m.name, value: m.key }))}
          />
        }
      >
        <div className="space-y-1.5">
          {rows.map((r, i) => {
            const val = r[sortKey] as number
            const pct = maxVal > 0 ? ((val as number) / maxVal) * 100 : 0
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
                  {val}
                  <span className="ml-0.5 font-sans text-[10px] font-normal text-muted-foreground">{metric.unit}</span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            )
          })}
        </div>
      </Panel>

      {/* KPI 明细弹窗：各经营单位订单数 / 产线数量 */}
      <Modal
        open={breakdown !== null}
        onClose={() => setBreakdown(null)}
        title={breakdown === 'lines' ? '各经营单位车间产线数量' : '各经营单位生产订单数'}
        size="md"
      >
        <DataTable
          columns={[
            { key: 'unit', label: '经营单位' },
            breakdown === 'lines'
              ? { key: 'lines', label: '车间产线数量', align: 'right' as const, render: (r: UnitMetric) => `${r.lines} 条` }
              : { key: 'orders', label: '生产订单数', align: 'right' as const, render: (r: UnitMetric) => `${r.orders} 条` },
          ]}
          rows={[...rows].sort((a, b) =>
            breakdown === 'lines' ? b.lines - a.lines : b.orders - a.orders,
          )}
        />
        <div className="mt-3 flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-4 py-2.5 text-sm">
          <span className="text-muted-foreground">合计</span>
          <span className="font-mono font-semibold text-foreground">
            {breakdown === 'lines' ? totalLines : totalOrders} 条
          </span>
        </div>
      </Modal>

      <UnitDrill
        unit={drillUnit}
        model={sel.model}
        industry={sel.ind}
        period={`${from} 至 ${to}`}
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

  /* 各订单对比：横轴为订单号，值为该订单单台对应碳排 */
  const perUnitByOrder = orders.map((o) => ({ name: o.order, value: o.perUnit }))
  const materialByOrder = orders.map((o) => ({ name: o.order, value: o.material }))
  const produceByOrder = orders.map((o) => ({ name: o.order, value: o.produce }))

  if (!unit) return null

  return (
    <Modal open={!!unit} onClose={onClose} title={`${unit.unit} · ${model}`} size="xl">
      <p className="mb-4 text-xs text-muted-foreground">{period} · 全部生产订单统一对比分析</p>
      <div className="space-y-4">
        {/* 生产订单数据详情（列表）：去客户、运输改原材料运输、增加废弃物处理 */}
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

        {/* 各订单对比：单台碳排放在第一位 */}
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
            <div className="mb-2 text-sm font-medium text-foreground">各订单主材碳排对比（tCO2/台）</div>
            <BarGroup data={materialByOrder} keys={[{ key: 'value', name: '主材碳排', color: 'var(--chart-1)' }]} height={200} />
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
