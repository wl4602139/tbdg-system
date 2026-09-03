'use client'

import { useMemo, useState, Fragment } from 'react'
import { ChevronRight } from 'lucide-react'
import { Modal } from '@/components/shared/modal'
import { DataTable } from '@/components/shared/primitives'
import type { energyStages, orderEnergyDetail } from '@/lib/accounting'
import type { ProdOrder } from '@/lib/procurement'

type Stages = ReturnType<typeof energyStages>
type EnergyRows = ReturnType<typeof orderEnergyDetail>

const ELEC_KGCE = 0.1229 // 电力折标系数 kgce/kWh

const STAGE_META: Record<string, { processName: string; startTime: string; endTime: string }> = {
  绕线: {
    processName: '低压箔绕与高压绕制',
    startTime: '2026-07-10 08:30:00',
    endTime: '2026-07-11 17:30:00',
  },
  器身: {
    processName: '铁芯叠装与器身绝缘装配',
    startTime: '2026-07-12 08:30:00',
    endTime: '2026-07-14 18:00:00',
  },
  总装: {
    processName: '器身气相干燥与总装配',
    startTime: '2026-07-15 08:30:00',
    endTime: '2026-07-17 17:00:00',
  },
  成品: {
    processName: '真空注油密封与例行出厂试验',
    startTime: '2026-07-18 09:00:00',
    endTime: '2026-07-19 16:30:00',
  },
  公共: {
    processName: '厂区动力与辅助工程配电',
    startTime: '2026-07-10 08:00:00',
    endTime: '2026-07-19 18:00:00',
  },
}

type TabKey = 'process' | 'energy' | 'orders'

/** 能耗数据追踪：工序用能明细 / 能源类型明细 /（可选）产品订单明细 */
function EnergyTraceTabs({
  stages,
  energyRows,
  perUnitKgce,
  orders,
  onJump,
  showProcess = true,
}: {
  stages?: Stages
  energyRows: EnergyRows
  perUnitKgce: number
  orders?: ProdOrder[]
  onJump?: (order: string) => void
  showProcess?: boolean
}) {
  const [tab, setTab] = useState<TabKey>(showProcess ? 'process' : 'energy')

  /* 组织生产单元与工序维度数据（支持单元格合并） */
  const procStages = useMemo(() => {
    if (!stages) return []
    return stages.map((s) => {
      const meta = STAGE_META[s.name] ?? {
        processName: `${s.name}加工制造工序`,
        startTime: '2026-07-10 08:30:00',
        endTime: '2026-07-12 17:30:00',
      }
      const gridConvert = Math.round(s.gridKwh * ELEC_KGCE * 100) / 100
      const greenConvert = Math.round(s.greenKwh * ELEC_KGCE * 100) / 100
      return {
        unit: s.name,
        processName: meta.processName,
        startTime: meta.startTime,
        endTime: meta.endTime,
        gridKwh: s.gridKwh,
        greenKwh: s.greenKwh,
        gridConvert,
        greenConvert,
      }
    })
  }, [stages])

  const procTotal = useMemo(
    () => Math.round(procStages.reduce((sum, s) => sum + s.gridConvert + s.greenConvert, 0) * 100) / 100,
    [procStages],
  )
  const energyTotal = Math.round(energyRows.reduce((s, r) => s + r.kgce, 0) * 100) / 100

  const tabs: { key: TabKey; label: string }[] = [
    ...(showProcess ? [{ key: 'process' as const, label: '工序用能明细' }] : []),
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

      {tab === 'process' && showProcess && (
        <div>
          <div className="overflow-x-auto rounded-lg border border-border bg-panel">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground h-[44px]">
                  <th className="px-3.5 font-medium text-center align-middle">生产单元</th>
                  <th className="px-3.5 font-medium align-middle">工序名称</th>
                  <th className="px-3.5 font-medium align-middle">能源类型</th>
                  <th className="px-3.5 font-medium text-center align-middle">开始时间</th>
                  <th className="px-3.5 font-medium text-center align-middle">结束时间</th>
                  <th className="px-3.5 font-medium text-right align-middle">用量(kWh)</th>
                  <th className="px-3.5 font-medium text-right align-middle">折标系数(kgce/kWh)</th>
                  <th className="px-3.5 font-medium text-right align-middle">综合能耗(kgce)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {procStages.map((ps) => (
                  <Fragment key={ps.unit}>
                    <tr className="hover:bg-muted/15 transition-colors border-t border-border/60 h-[44px]">
                      <td
                        rowSpan={2}
                        className="border-r border-border/50 px-3.5 align-middle text-center font-medium text-foreground bg-muted/10"
                      >
                        {ps.unit}
                      </td>
                      <td
                        rowSpan={2}
                        className="border-r border-border/50 px-3.5 align-middle text-foreground/90 font-medium"
                      >
                        {ps.processName}
                      </td>
                      <td className="px-3.5 align-middle text-foreground border-b border-border/30 h-[44px]">市电</td>
                      <td className="px-3.5 align-middle text-center font-mono text-muted-foreground whitespace-nowrap border-b border-border/30 h-[44px]">{ps.startTime}</td>
                      <td className="px-3.5 align-middle text-center font-mono text-muted-foreground whitespace-nowrap border-b border-border/30 h-[44px]">{ps.endTime}</td>
                      <td className="px-3.5 align-middle text-right font-mono text-foreground border-b border-border/30 h-[44px]">{ps.gridKwh}</td>
                      <td className="px-3.5 align-middle text-right font-mono text-muted-foreground border-b border-border/30 h-[44px]">{ELEC_KGCE}</td>
                      <td className="px-3.5 align-middle text-right font-mono text-primary font-medium border-b border-border/30 h-[44px]">{ps.gridConvert}</td>
                    </tr>
                    <tr className="hover:bg-muted/15 transition-colors h-[44px]">
                      <td className="px-3.5 align-middle text-[var(--success)] font-medium h-[44px]">绿电</td>
                      <td className="px-3.5 align-middle text-center font-mono text-muted-foreground whitespace-nowrap h-[44px]">{ps.startTime}</td>
                      <td className="px-3.5 align-middle text-center font-mono text-muted-foreground whitespace-nowrap h-[44px]">{ps.endTime}</td>
                      <td className="px-3.5 align-middle text-right font-mono text-foreground h-[44px]">{ps.greenKwh}</td>
                      <td className="px-3.5 align-middle text-right font-mono text-muted-foreground h-[44px]">{ELEC_KGCE}</td>
                      <td className="px-3.5 align-middle text-right font-mono text-primary font-medium h-[44px]">{ps.greenConvert}</td>
                    </tr>
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm">
            <span className="font-medium text-foreground">工序综合能耗合计</span>
            <span className="font-mono text-primary font-semibold">
              {procTotal.toLocaleString()} <span className="text-xs text-muted-foreground">kgce</span>
            </span>
          </div>
        </div>
      )}

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
            <span className="font-mono text-primary font-semibold">{energyTotal.toLocaleString()} <span className="text-xs text-muted-foreground">kgce</span></span>
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
  showProcess,
}: {
  open: boolean
  onClose: () => void
  model: string
  unit: string
  perUnitKgce: number
  perFeatureKgce: number
  stages?: Stages
  energyRows: EnergyRows
  subtitle?: string
  orders?: ProdOrder[]
  onJump?: (order: string) => void
  showProcess?: boolean
}) {
  const shouldShowProcess = showProcess !== undefined ? showProcess : !orders

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
      <EnergyTraceTabs
        stages={stages}
        energyRows={energyRows}
        perUnitKgce={perUnitKgce}
        orders={orders}
        onJump={onJump}
        showProcess={shouldShowProcess}
      />
    </Modal>
  )
}
