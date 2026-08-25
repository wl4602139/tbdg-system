'use client'

import { useState } from 'react'
import {
  Gauge,
  Layers,
  Factory,
  TrendingDown,
  TrendingUp,
  Search,
  Filter,
  BarChart3,
  Calendar,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react'
import { Panel, PanelTitle, Badge, StatusBadge, DataTable, KpiCard } from '@/components/shared/primitives'
import { LineTrend, BarChartGroup } from '@/components/shared/charts'
import { TimeRange } from '@/components/shared/time-range'
import { cn } from '@/lib/utils'

export default function UnitProductPage() {
  const [activeTab, setActiveTab] = useState<'model' | 'factory' | 'history'>('model')
  const [selectedProduct, setSelectedProduct] = useState('ODFS-334MVA/500kV')

  // 产品型号对比数据
  const productModels = [
    { model: 'ODFS-334MVA/500kV 单相自耦变压器', category: '超高压变压器', unitEnergy: '1.45 tce/万kVA', elec: '10,420 kWh', steam: '4.82 GJ', target: '1.20', status: '异常' },
    { model: 'SZ-110kV/63000kVA 三相双绕组变压器', category: '配电变压器', unitEnergy: '1.18 tce/万kVA', elec: '8,250 kWh', steam: '3.40 GJ', target: '1.15', status: '正常' },
    { model: 'S13-M-800kVA 节能配电变压器', category: '配电变压器', unitEnergy: '0.96 tce/万kVA', elec: '6,800 kWh', steam: '2.10 GJ', target: '0.98', status: '优秀' },
    { model: 'YJLW03-64/110kV 1x1200mm² 高压电缆', category: '电力电缆', unitEnergy: '0.68 kWh/km*mm²', elec: '0.68 kWh', steam: '/', target: '0.65', status: '正常' },
    { model: 'YJV22-8.7/15kV 3x300mm² 中压电缆', category: '电力电缆', unitEnergy: '0.42 kWh/km*mm²', elec: '0.42 kWh', steam: '/', target: '0.40', status: '优秀' },
  ]

  // 同产品跨单位横向对比
  const crossFactoryData = [
    { factory: '沈变本部', 单耗: 1.45, 行业标杆: 1.20, 蒸汽单耗: 4.82, 电耗: 10420 },
    { factory: '衡变本部', 单耗: 1.38, 行业标杆: 1.20, 蒸汽单耗: 4.40, 电耗: 10150 },
    { factory: '超高压公司 (新变)', 单耗: 1.52, 行业标杆: 1.20, 蒸汽单耗: 5.10, 电耗: 10800 },
  ]

  // 历史时段对比
  const historyTrend = [
    { period: '1月', 本期单耗: 1.48, 去年同期: 1.55, 基准线: 1.30 },
    { period: '2月', 本期单耗: 1.42, 去年同期: 1.50, 基准线: 1.30 },
    { period: '3月', 本期单耗: 1.50, 去年同期: 1.52, 基准线: 1.30 },
    { period: '4月', 本期单耗: 1.46, 去年同期: 1.48, 基准线: 1.30 },
    { period: '5月', 本期单耗: 1.44, 去年同期: 1.46, 基准线: 1.30 },
    { period: '6月', 本期单耗: 1.43, 去年同期: 1.45, 基准线: 1.30 },
    { period: '7月', 本期单耗: 1.47, 去年同期: 1.46, 基准线: 1.30 },
    { period: '8月', 本期单耗: 1.45, 去年同期: 1.42, 基准线: 1.30 },
  ]

  return (
    <div className="space-y-4">
      {/* 顶部标题与 Tab */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card p-3.5 rounded-xl border border-border">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-primary">
            <Gauge className="size-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">
              单位产品能耗多维对比分析 (Unit Product Energy)
            </h1>
            <p className="text-xs text-muted-foreground">
              支持按产品型号/种类/产线对比、同产品多家单位横向对标及历史多时段趋势分析
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {[
            { key: 'model', label: '产品型号对比' },
            { key: 'factory', label: '同产品跨单位对比' },
            { key: 'history', label: '不同时段历史对比' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                activeTab === t.key
                  ? 'bg-primary text-primary-foreground shadow font-semibold'
                  : 'bg-accent/40 text-muted-foreground hover:text-foreground border border-border/60'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: 产品型号对比 */}
      {activeTab === 'model' && (
        <Panel className="p-4">
          <PanelTitle icon={Layers}>重点产品型号综合能耗与单耗对标矩阵</PanelTitle>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-accent/40 text-muted-foreground border-b border-border/60 font-medium">
                <tr>
                  <th className="py-2.5 px-3">产品型号及规格</th>
                  <th className="py-2.5 px-3">产品大类</th>
                  <th className="py-2.5 px-3">单位产品能耗</th>
                  <th className="py-2.5 px-3">单产品电耗</th>
                  <th className="py-2.5 px-3">蒸汽消耗</th>
                  <th className="py-2.5 px-3">标杆目标</th>
                  <th className="py-2.5 px-3">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-mono">
                {productModels.map((p) => (
                  <tr key={p.model} className="hover:bg-accent/30">
                    <td className="py-2.5 px-3 font-sans font-medium text-foreground">{p.model}</td>
                    <td className="py-2.5 px-3 font-sans text-muted-foreground">{p.category}</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">{p.unitEnergy}</td>
                    <td className="py-2.5 px-3">{p.elec}</td>
                    <td className="py-2.5 px-3">{p.steam}</td>
                    <td className="py-2.5 px-3 text-sky-400">{p.target}</td>
                    <td className="py-2.5 px-3 font-sans">
                      <StatusBadge tone={p.status === '优秀' ? 'ok' : p.status === '正常' ? 'info' : 'danger'}>
                        {p.status}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {/* Tab 2: 同产品跨单位对比 */}
      {activeTab === 'factory' && (
        <Panel className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <PanelTitle icon={Factory}>同型号产品（ODFS-334MVA/500kV）跨工厂横向能效对比</PanelTitle>
            <Badge tone="info">对标产品：500kV 单相自耦变</Badge>
          </div>
          <div className="h-60">
            <LineTrend
              data={crossFactoryData}
              xKey="factory"
              lines={[
                { key: '单耗', color: '#10b981' },
                { key: '行业标杆', color: '#0284c7' },
                { key: '蒸汽单耗', color: '#f59e0b' },
              ]}
            />
          </div>
        </Panel>
      )}

      {/* Tab 3: 不同时段历史对比 */}
      {activeTab === 'history' && (
        <Panel className="p-4 space-y-4">
          <PanelTitle icon={Calendar}>单产品月度单耗同环比演变趋势</PanelTitle>
          <div className="h-60">
            <LineTrend
              data={historyTrend}
              xKey="period"
              lines={[
                { key: '本期单耗', color: '#10b981' },
                { key: '去年同期', color: '#f59e0b' },
                { key: '基准线', color: '#0284c7' },
              ]}
            />
          </div>
        </Panel>
      )}
    </div>
  )
}
