'use client'

import { useState } from 'react'
import {
  Database,
  Search,
  Download,
  FileText,
  Layers,
  ChevronRight,
  Package,
  Activity,
  CheckCircle2,
  GitBranch,
} from 'lucide-react'
import { Panel, PanelTitle, Badge, StatusBadge, DataTable, KpiCard } from '@/components/shared/primitives'
import { orderAccounting, traceNodes, cfReports } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export default function DatabasePage() {
  const [activeTab, setActiveTab] = useState<'accounting' | 'trace' | 'report'>('accounting')
  const [selectedOrder, setSelectedOrder] = useState(orderAccounting[0])

  return (
    <div className="space-y-4">
      {/* 顶部标题 */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card p-3.5 rounded-xl border border-border">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Database className="size-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">
              产品碳足迹实景数据库与 BOM 溯源系统
            </h1>
            <p className="text-xs text-muted-foreground">
              实现工单级实景核算、BOM 原材料溯源、工序能耗直接切片匹配与 ISO 14067 报告生成
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {[
            { key: 'accounting', label: '订单级核算明细' },
            { key: 'trace', label: 'BOM 数据链穿透' },
            { key: 'report', label: '碳足迹量化报告' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                activeTab === t.key
                  ? 'bg-sky-500 text-white shadow font-semibold'
                  : 'bg-card text-muted-foreground hover:text-foreground border border-border'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: 订单级核算明细 */}
      {activeTab === 'accounting' && (
        <Panel className="p-4">
          <PanelTitle icon={Package}>实景工单核算台账明细</PanelTitle>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-accent/40 text-muted-foreground border-b border-border/60 font-medium">
                <tr>
                  <th className="py-2.5 px-3">生产工单号</th>
                  <th className="py-2.5 px-3">产品型号</th>
                  <th className="py-2.5 px-3">所属制造单位</th>
                  <th className="py-2.5 px-3">BOM 原材料碳排</th>
                  <th className="py-2.5 px-3">制造过程碳排</th>
                  <th className="py-2.5 px-3">运输碳排</th>
                  <th className="py-2.5 px-3">单台碳足迹总量</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-mono">
                {orderAccounting.map((ord) => (
                  <tr
                    key={ord.order}
                    onClick={() => setSelectedOrder(ord)}
                    className="hover:bg-accent/30 cursor-pointer"
                  >
                    <td className="py-2.5 px-3 text-sky-400 font-bold">{ord.order}</td>
                    <td className="py-2.5 px-3 font-sans font-medium text-foreground">{ord.product}</td>
                    <td className="py-2.5 px-3 font-sans text-muted-foreground">{ord.unit}</td>
                    <td className="py-2.5 px-3">{ord.material} kg</td>
                    <td className="py-2.5 px-3">{ord.produce} kg</td>
                    <td className="py-2.5 px-3">{ord.transport} kg</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold font-sans">
                      {ord.total} kgCO2/台
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {/* Tab 2: BOM 数据链穿透 */}
      {activeTab === 'trace' && (
        <Panel className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <PanelTitle icon={GitBranch}>工单【{selectedOrder.order}】从原材料到成品的计算链路穿透</PanelTitle>
            <Badge tone="ok">{selectedOrder.product}</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
            {traceNodes.map((node, i) => (
              <div key={node.stage} className="p-3.5 rounded-lg bg-accent/30 border border-border/60 space-y-2">
                <div className="flex items-center justify-between font-sans">
                  <span className="font-semibold text-foreground">{node.stage}</span>
                  <span className="size-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-[10px] font-bold">
                    {i + 1}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-sky-400">{node.value}</span>
                  <span className="text-muted-foreground text-[11px]">kgCO2</span>
                </div>
                <p className="text-[11px] text-muted-foreground/90 font-sans leading-relaxed">
                  {node.detail}
                </p>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {/* Tab 3: 碳足迹量化报告 */}
      {activeTab === 'report' && (
        <Panel className="p-4">
          <PanelTitle icon={FileText}>ISO 14067 碳足迹评价报告归档</PanelTitle>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
            {cfReports.map((rep) => (
              <div key={rep.no} className="p-3.5 rounded-lg bg-card border border-border/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sky-400 font-bold">{rep.no}</span>
                  <StatusBadge tone="ok">{rep.status}</StatusBadge>
                </div>
                <span className="font-semibold text-foreground block">{rep.product}</span>
                <div className="flex items-center justify-between text-muted-foreground text-[11px] pt-1">
                  <span>标准：{rep.standard}</span>
                  <button className="text-primary hover:underline flex items-center gap-1">
                    <Download className="size-3" /> 下载 PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  )
}
