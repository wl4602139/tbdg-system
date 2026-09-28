'use client'

import { useMemo, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { Modal } from '@/components/shared/modal'
import { DataTable } from '@/components/shared/primitives'
import { acquireTrace, transportTrace, manufactureTrace, manufactureTotals, wasteTrace, stageBreakdown } from '@/lib/accounting'
import { featureOf, type ProdOrder } from '@/lib/procurement'

const baseTabs = [
  { key: 'acquire', label: '原料获取碳' },
  { key: 'transport', label: '原料运输碳' },
  { key: 'manufacture', label: '生产制造碳' },
  { key: 'waste', label: '废弃物排放碳' },
] as const

type TabKey = 'acquire' | 'transport' | 'manufacture' | 'waste' | 'orders'

function Pct({ v }: { v: number }) {
  return <span className="font-mono text-xs text-muted-foreground">{(v * 100).toFixed(1)}%</span>
}

/** 数据追踪：因子级明细页签；传入 orders 时追加“产品订单”页签 */
export function DataTraceTabs({
  model,
  unit,
  perUnitKg,
  orders,
  onJump,
}: {
  model: string
  unit: string
  perUnitKg: number
  orders?: ProdOrder[]
  onJump?: (order: string) => void
}) {
  const [tab, setTab] = useState<TabKey>('acquire')
  const seed = `${model}|${unit}`
  const feat = featureOf(model)
  const stages = useMemo(() => stageBreakdown(perUnitKg), [perUnitKg])
  const materialKg = stages.find((s) => s.key === 'material')!.value
  const produceKg = stages.find((s) => s.key === 'produce')!.value
  const wasteKg = stages.find((s) => s.key === 'waste')!.value

  const acquire = useMemo(() => acquireTrace(seed, materialKg), [seed, materialKg])
  const transport = useMemo(() => transportTrace(seed, materialKg), [seed, materialKg])
  const manufacture = useMemo(() => manufactureTrace(seed, produceKg), [seed, produceKg])
  const manuTotals = useMemo(() => manufactureTotals(manufacture), [manufacture])
  const waste = useMemo(() => wasteTrace(seed, wasteKg, feat.feature), [seed, wasteKg, feat.feature])
  const wastePerUnit = useMemo(() => Math.round(waste.reduce((s, w) => s + w.carbon, 0) * 100) / 100, [waste])

  const tabs = orders ? [...baseTabs, { key: 'orders' as const, label: '产品订单明细' }] : baseTabs

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
              tab === t.key
                ? 'bg-primary text-primary-foreground'
                : 'border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'acquire' && (
        <DataTable
          columns={[
            { key: 'name', label: '原材料名称' },
            { key: 'weight', label: '重量(kg)', align: 'right' },
            { key: 'wsource', label: '重量来源' },
            { key: 'factor', label: '排放因子(kgCO2e/kg)', align: 'right' },
            { key: 'fsource', label: '排放因子来源' },
            {
              key: 'carbon',
              label: '碳排放量(kgCO2e)',
              align: 'right',
              render: (r) => <span className="font-mono text-primary">{r.carbon}</span>,
            },
            { key: 'ratio', label: '占比', align: 'right', render: (r) => <Pct v={r.ratio} /> },
          ]}
          rows={acquire}
        />
      )}

      {tab === 'transport' && (
        <DataTable
          columns={[
            { key: 'name', label: '原材料名称' },
            { key: 'maker', label: '制造单位' },
            { key: 'weight', label: '重量(kg)', align: 'right' },
            { key: 'distance', label: '里程(km)', align: 'right' },
            { key: 'mode', label: '运输方式' },
            { key: 'factor', label: '排放因子', align: 'right' },
            { key: 'fsource', label: '因子来源' },
            {
              key: 'carbon',
              label: '碳排放量(kgCO2e)',
              align: 'right',
              render: (r) => <span className="font-mono text-primary">{r.carbon}</span>,
            },
            { key: 'ratio', label: '占比', align: 'right', render: (r) => <Pct v={r.ratio} /> },
          ]}
          rows={transport}
        />
      )}

      {tab === 'manufacture' && (
        <div>
          <DataTable
            columns={[
              { key: 'stage', label: '生产环节', render: (r) => <span className="text-foreground">{r.stage}</span> },
              { key: 'process', label: '生产工序' },
              {
                key: 'energy',
                label: '能源类型',
                render: (r) => (
                  <span className={r.energy === '绿电' ? 'text-[var(--success)]' : 'text-foreground'}>{r.energy}</span>
                ),
              },
              { key: 'unit', label: '单位' },
              { key: 'amount', label: '用量', align: 'right', render: (r) => <span className="font-mono">{r.amount}</span> },
              { key: 'convert', label: '能源转换(kgce)', align: 'right', render: (r) => <span className="font-mono text-muted-foreground">{r.convert}</span> },
              { key: 'factor', label: '排放因子(kgCO2/kWh)', align: 'right' },
              { key: 'fsource', label: '排放因子来源' },
              {
                key: 'carbon',
                label: '碳排放量(kgCO2e)',
                align: 'right',
                render: (r) => <span className="font-mono text-primary">{r.carbon}</span>,
              },
            ]}
            rows={manufacture}
          />
          <div className="mt-3 flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm">
            <span className="font-medium text-foreground">合计（净碳排 = 市电口径排放 − 绿电减排）</span>
            <span className="font-mono text-primary">
              {manuTotals.net.toLocaleString()}
              <span className="ml-1.5 text-xs text-muted-foreground">
                （{manuTotals.gross.toLocaleString()} − {manuTotals.reduction.toLocaleString()}）kgCO2e
              </span>
            </span>
          </div>
        </div>
      )}

      {tab === 'waste' && (
        <div>
          <div className="mb-3 text-sm text-muted-foreground">
            单台产品废弃物碳排放估算：
            <span className="ml-1 font-mono text-primary">{wastePerUnit}</span> kgCO2e
          </div>
          <DataTable
            columns={[
              { key: 'year', label: '年份' },
              { key: 'name', label: '名称' },
              { key: 'weight', label: '重量(kg)', align: 'right', render: (r) => <span className="font-mono">{r.weight}</span> },
              { key: 'factor', label: '排放因子(kgCO2e/kg)', align: 'right' },
              { key: 'carbon', label: '碳排放量(kgCO2e)', align: 'right', render: (r) => <span className="font-mono text-primary">{r.carbon}</span> },
              { key: 'totalCarbon', label: '总碳排放量(kgCO2e)', align: 'right', render: (r) => <span className="font-mono">{r.totalCarbon.toLocaleString()}</span> },
              { key: 'output', label: `总产量(${feat.unit})`, align: 'right', render: (r) => <span className="font-mono text-muted-foreground">{r.output.toLocaleString()}</span> },
              { key: 'perFeature', label: `单位产量碳排(kgCO2e/${feat.unit})`, align: 'right', render: (r) => <span className="font-mono">{r.perFeature}</span> },
            ]}
            rows={waste}
          />
        </div>
      )}

      {tab === 'orders' && orders && (
        <DataTable
          columns={[
            { key: 'order', label: '产品订单', className: 'font-mono' },
            { key: 'customer', label: '客户' },
            { key: 'qty', label: '数量(台)', align: 'right' },
            { key: 'perUnit', label: '单台碳排(tCO2)', align: 'right', render: (r: ProdOrder) => <span className="font-mono">{r.perUnit.toFixed(3)}</span> },
            { key: 'plans', label: '生产计划', align: 'right', render: (r: ProdOrder) => <span className="text-xs text-muted-foreground">{r.plans.length} 个</span> },
            {
              key: 'action',
              label: '操作',
              align: 'right',
              render: (r: ProdOrder) =>
                onJump ? (
                  <button type="button" onClick={() => onJump(r.order)} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                    订单详情 <ChevronRight className="size-3.5" />
                  </button>
                ) : null,
            },
          ]}
          rows={orders}
        />
      )}
    </div>
  )
}

export function DataTraceModal({
  open,
  onClose,
  model,
  unit,
  perUnitKg,
  subtitle,
  orders,
  onJump,
}: {
  open: boolean
  onClose: () => void
  model: string
  unit: string
  perUnitKg: number
  subtitle?: string
  orders?: ProdOrder[]
  onJump?: (order: string) => void
}) {
  return (
    <Modal open={open} onClose={onClose} title="数据追踪" size="xl">
      <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="text-sm font-medium text-foreground">{model}</span>
        <span className="text-border">·</span>
        <span>{subtitle ?? unit}</span>
      </div>
      <DataTraceTabs model={model} unit={unit} perUnitKg={perUnitKg} orders={orders} onJump={onJump} />
    </Modal>
  )
}
