'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { Modal } from '@/components/shared/modal'
import { DataTable } from '@/components/shared/primitives'
import type { energyStages, orderEnergyDetail } from '@/lib/accounting'
import type { ProdOrder } from '@/lib/procurement'

type Stages = ReturnType<typeof energyStages>
type EnergyRows = ReturnType<typeof orderEnergyDetail>

type TabKey = 'energy' | 'orders'

/** 能耗数据追踪：能源类型明细 /（可选）产品订单明细 */
function EnergyTraceTabs({
  energyRows,
  perUnitKgce,
  orders,
  onJump,
}: {
  stages?: Stages
  energyRows: EnergyRows
  perUnitKgce: number
  orders?: ProdOrder[]
  onJump?: (order: string) => void
}) {
  const [tab, setTab] = useState<TabKey>('energy')
  const energyTotal = Math.round(energyRows.reduce((s, r) => s + r.kgce, 0) * 100) / 100

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'energy', label: '能源类型明细' },
    ...(orders ? [{ key: 'orders' as const, label: '产品订单明细' }] : []),
  ]

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
              tab === t.key ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'energy' && (
        <div>
          <DataTable
            columns={[
              { key: 'type', label: '能源类型', render: (r) => <span className={r.type === '绿电' ? 'text-[var(--success)]' : 'text-foreground'}>{r.type}</span> },
              { key: 'amount', label: '用量', align: 'right', render: (r) => <span className="font-mono">{r.amount}</span> },
              { key: 'unit', label: '单位', align: 'right' },
              { key: 'coef', label: '折标系数(kgce/单位)', align: 'right', render: (r) => <span className="font-mono text-muted-foreground">{r.coef}</span> },
              { key: 'kgce', label: '标准煤(kgce)', align: 'right', render: (r) => <span className="font-mono text-primary">{r.kgce}</span> },
              { key: 'ratio', label: '占比', align: 'right', render: (r) => <span className="font-mono text-xs text-muted-foreground">{((r.kgce / (energyTotal || 1)) * 100).toFixed(1)}%</span> },
            ]}
            rows={energyRows}
          />
          <div className="mt-3 flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm">
            <span className="font-medium text-foreground">单台综合能耗合计</span>
            <span className="font-mono text-primary">{energyTotal.toLocaleString()} <span className="text-xs text-muted-foreground">kgce</span></span>
          </div>
        </div>
      )}

      {tab === 'orders' && orders && (
        <DataTable
          columns={[
            { key: 'order', label: '产品订单', className: 'font-mono' },
            { key: 'qty', label: '数量(台)', align: 'right' },
            { key: 'perUnit', label: '单台综合能耗(kgce)', align: 'right', render: () => <span className="font-mono">{perUnitKgce.toLocaleString()}</span> },
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

export function EnergyTraceModal({
  open,
  onClose,
  model,
  unit,
  perUnitKgce,
  perFeatureKgce,
  stages,
  energyRows,
  subtitle,
  orders,
  onJump,
}: {
  open: boolean
  onClose: () => void
  model: string
  unit: string
  perUnitKgce: number
  perFeatureKgce: number
  stages: Stages
  energyRows: EnergyRows
  subtitle?: string
  orders?: ProdOrder[]
  onJump?: (order: string) => void
}) {
  return (
    <Modal open={open} onClose={onClose} title="数据追踪" size="xl">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="text-sm font-medium text-foreground">{model}</span>
        <span className="text-border">·</span>
        <span>{subtitle ?? unit}</span>
        <span className="text-border">·</span>
        <span>单台 <span className="font-mono text-primary">{perUnitKgce.toLocaleString()}</span> kgce</span>
        <span className="text-border">·</span>
        <span>单位产品 <span className="font-mono text-foreground">{perFeatureKgce.toFixed(4)}</span> kgce</span>
      </div>
      <EnergyTraceTabs stages={stages} energyRows={energyRows} perUnitKgce={perUnitKgce} orders={orders} onJump={onJump} />
    </Modal>
  )
}
