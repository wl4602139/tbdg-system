'use client'

import { useState, useMemo } from 'react'
import {
  Download,
  Calendar,
  DollarSign,
  Coins,
  Zap,
  Flame,
  Droplets,
  Leaf,
  FileSpreadsheet,
  ArrowUpDown,
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { cn } from '@/lib/utils'

interface CostRow {
  id: string
  name: string
  industry: '变压器制造' | '线缆制造' | '高压成套'
  tipElec: number
  peakElec: number
  flatElec: number
  valleyElec: number
  gasCost: number
  waterCost: number
  steamCost: number
  greenDeduct: number
  netCost: number
  avgPrice: string
}

const COST_MOCK_ROWS: CostRow[] = [
  {
    id: '01',
    name: '沈变公司',
    industry: '变压器制造',
    tipElec: 980.5,
    peakElec: 1820.0,
    flatElec: 1240.0,
    valleyElec: 680.0,
    gasCost: 344.4,
    waterCost: 18.5,
    steamCost: 124.0,
    greenDeduct: -480.0,
    netCost: 4727.4,
    avgPrice: '0.561 元',
  },
  {
    id: '02',
    name: '衡变公司',
    industry: '变压器制造',
    tipElec: 890.0,
    peakElec: 1680.0,
    flatElec: 1150.0,
    valleyElec: 620.0,
    gasCost: 301.7,
    waterCost: 16.2,
    steamCost: 98.0,
    greenDeduct: -420.0,
    netCost: 4335.9,
    avgPrice: '0.552 元',
  },
  {
    id: '03',
    name: '鲁缆公司',
    industry: '线缆制造',
    tipElec: 680.0,
    peakElec: 1240.0,
    flatElec: 890.0,
    valleyElec: 490.0,
    gasCost: 217.0,
    waterCost: 12.5,
    steamCost: 62.0,
    greenDeduct: -310.0,
    netCost: 3281.5,
    avgPrice: '0.562 元',
  },
  {
    id: '04',
    name: '新变厂',
    industry: '变压器制造',
    tipElec: 780.0,
    peakElec: 1460.0,
    flatElec: 1020.0,
    valleyElec: 560.0,
    gasCost: 260.8,
    waterCost: 14.8,
    steamCost: 85.0,
    greenDeduct: -360.0,
    netCost: 3820.6,
    avgPrice: '0.551 元',
  },
  {
    id: '05',
    name: '新缆厂',
    industry: '线缆制造',
    tipElec: 520.0,
    peakElec: 980.0,
    flatElec: 710.0,
    valleyElec: 390.0,
    gasCost: 189.0,
    waterCost: 10.5,
    steamCost: 48.0,
    greenDeduct: -240.0,
    netCost: 2607.5,
    avgPrice: '0.564 元',
  },
  {
    id: '06',
    name: '德缆公司',
    industry: '线缆制造',
    tipElec: 460.0,
    peakElec: 880.0,
    flatElec: 630.0,
    valleyElec: 350.0,
    gasCost: 162.8,
    waterCost: 9.2,
    steamCost: 39.0,
    greenDeduct: -210.0,
    netCost: 2321.0,
    avgPrice: '0.563 元',
  },
  {
    id: '07',
    name: '天变制造公司',
    industry: '变压器制造',
    tipElec: 320.0,
    peakElec: 610.0,
    flatElec: 440.0,
    valleyElec: 240.0,
    gasCost: 112.0,
    waterCost: 6.8,
    steamCost: 28.0,
    greenDeduct: -150.0,
    netCost: 1606.8,
    avgPrice: '0.564 元',
  },
  {
    id: '08',
    name: '中辰开关成套',
    industry: '高压成套',
    tipElec: 210.0,
    peakElec: 390.0,
    flatElec: 280.0,
    valleyElec: 160.0,
    gasCost: 77.7,
    waterCost: 4.8,
    steamCost: 18.0,
    greenDeduct: -90.0,
    netCost: 1049.5,
    avgPrice: '0.577 元',
  },
]

export default function CostReportPage() {
  const [selectedNode, setSelectedNode] = useState<StandardOrgNode>({
    id: 'group_root',
    name: '特变电工集团 (全景汇总)',
    fullName: '特变电工集团 (全景汇总)',
    level: 'group',
    badge: '全集团',
  })

  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month')
  const [sortField, setSortField] = useState<keyof CostRow>('netCost')
  const [sortAsc, setSortAsc] = useState(false)

  const handleSort = (field: keyof CostRow) => {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(false)
    }
  }

  const sortedRows = useMemo(() => {
    const rows = [...COST_MOCK_ROWS]
    rows.sort((a, b) => {
      const va = a[sortField]
      const vb = b[sortField]
      if (typeof va === 'number' && typeof vb === 'number') {
        return sortAsc ? va - vb : vb - va
      }
      return 0
    })
    return rows
  }, [sortField, sortAsc])

  const totals = useMemo(() => {
    return sortedRows.reduce(
      (acc, r) => {
        acc.tipElec += r.tipElec
        acc.peakElec += r.peakElec
        acc.flatElec += r.flatElec
        acc.valleyElec += r.valleyElec
        acc.gasCost += r.gasCost
        acc.waterCost += r.waterCost
        acc.steamCost += r.steamCost
        acc.greenDeduct += r.greenDeduct
        acc.netCost += r.netCost
        return acc
      },
      {
        tipElec: 0,
        peakElec: 0,
        flatElec: 0,
        valleyElec: 0,
        gasCost: 0,
        waterCost: 0,
        steamCost: 0,
        greenDeduct: 0,
        netCost: 0,
      },
    )
  }, [sortedRows])

  return (
    <div className="flex gap-3.5 items-start">
      {/* 左侧 270px 经典工业级拓扑树 */}
      <StandardOrgTree
        selectedId={selectedNode.id}
        onSelect={(node) => setSelectedNode(node)}
      />

      {/* 右侧主面板 */}
      <div className="flex-1 min-w-0 flex flex-col gap-3.5">
        {/* 顶部面包屑与操作栏 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-blue-50 text-[#1677ff]">
              <Coins className="size-4.5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-slate-800">{selectedNode.name}</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold flex items-center gap-1">
                  🏢 集团全局大盘视角 (电装宏观总览)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                分时电价（尖峰平谷）计费与综合用能财务账单核算报表
              </p>
            </div>
          </div>

          {/* 工具栏 */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
              <button
                onClick={() => setPeriod('month')}
                className={cn(
                  'px-2.5 py-1 rounded-md font-medium transition-all',
                  period === 'month'
                    ? 'bg-white text-[#1677ff] font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900',
                )}
              >
                月度账单
              </button>
              <button
                onClick={() => setPeriod('quarter')}
                className={cn(
                  'px-2.5 py-1 rounded-md font-medium transition-all',
                  period === 'quarter'
                    ? 'bg-white text-[#1677ff] font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900',
                )}
              >
                季度汇总
              </button>
              <button
                onClick={() => setPeriod('year')}
                className={cn(
                  'px-2.5 py-1 rounded-md font-medium transition-all',
                  period === 'year'
                    ? 'bg-white text-[#1677ff] font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900',
                )}
              >
                年度决算
              </button>
            </div>

            <div className="flex items-center gap-1.5 h-8 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium">
              <Calendar className="size-3.5 text-slate-400" />
              <span>2026年08月账期</span>
            </div>

            <button
              onClick={() => alert('正在导出【全集团能源成本财务对账单】...')}
              className="h-8 px-3 rounded-lg bg-[#1677ff] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-blue-600 shadow-xs transition-colors"
            >
              <Download className="size-3.5" />
              <span>导出账单</span>
            </button>
          </div>
        </div>

        {/* KPI 汇总卡片 (4列) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. 综合用能总成本 */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500">综合用能总成本 (万元)</div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                2,684.5 <span className="text-xs font-normal text-slate-500 font-sans">万元</span>
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                <span>↓ 4.2% 同比节约</span>
              </div>
            </div>
            <div className="size-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg shadow-xs">
              💰
            </div>
          </div>

          {/* 2. 分时电费总支出 */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500">分时电费总支出 (万元)</div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                2,140.2 <span className="text-xs font-normal text-slate-500 font-sans">万元</span>
              </div>
              <div className="text-[11px] text-blue-600 font-semibold mt-0.5 flex items-center gap-1">
                <span>平均综合电价 0.560 元/kWh</span>
              </div>
            </div>
            <div className="size-10 rounded-xl bg-blue-50 text-[#1677ff] flex items-center justify-center font-bold text-lg shadow-xs">
              ⚡
            </div>
          </div>

          {/* 3. 天然气成本 */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500">天然气成本 (万元)</div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                149.3 <span className="text-xs font-normal text-slate-500 font-sans">万元</span>
              </div>
              <div className="text-[11px] text-slate-500 font-semibold mt-0.5 flex items-center gap-1">
                <span>均价 3.50 元/m³</span>
              </div>
            </div>
            <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg shadow-xs">
              🔥
            </div>
          </div>

          {/* 4. 绿电与光伏对冲收益 */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500">绿电与光伏对冲收益 (万元)</div>
              <div className="text-xl font-bold font-mono text-emerald-600 mt-1 tabular-nums">
                -198.6 <span className="text-xs font-normal text-emerald-600 font-sans">万元</span>
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                <span>度电降低 0.052 元</span>
              </div>
            </div>
            <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg shadow-xs">
              🌿
            </div>
          </div>
        </div>

        {/* 主数据报表卡片 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-[#fafbfc]">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-amber-500" />
              <h3 className="text-xs font-bold text-slate-800">
                全集团 8 大制造基地能源成本财务分摊与分时电费明细表 (2026年08月)
              </h3>
            </div>
            <div className="text-xs text-slate-500">单位：万元 (含税)</div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-bold select-none">
                  <th className="py-2.5 px-3 sticky left-0 bg-slate-50 z-10 w-12 text-center">序号</th>
                  <th className="py-2.5 px-3 sticky left-12 bg-slate-50 z-10 min-w-[140px]">制造基地</th>
                  <th className="py-2.5 px-3 text-right">尖段电费</th>
                  <th className="py-2.5 px-3 text-right">峰段电费</th>
                  <th className="py-2.5 px-3 text-right">平段电费</th>
                  <th className="py-2.5 px-3 text-right">谷段电费</th>
                  <th className="py-2.5 px-3 text-right">天然气费</th>
                  <th className="py-2.5 px-3 text-right">水费</th>
                  <th className="py-2.5 px-3 text-right">蒸汽热力费</th>
                  <th className="py-2.5 px-3 text-right text-emerald-600">光伏/绿电抵扣</th>
                  <th
                    className="py-2.5 px-3 text-right font-bold text-slate-900 bg-blue-50/50 cursor-pointer hover:bg-blue-100/60 transition-colors"
                    onClick={() => handleSort('netCost')}
                  >
                    <div className="inline-flex items-center gap-1">
                      <span>净结算成本</span>
                      <ArrowUpDown className="size-3 text-blue-600" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 text-right font-bold text-blue-700">综合平均单价</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11.5px]">
                {sortedRows.map((r, i) => (
                  <tr key={r.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-2.5 px-3 sticky left-0 bg-white font-sans text-slate-400 text-center">
                      {String(i + 1).padStart(2, '0')}
                    </td>
                    <td className="py-2.5 px-3 sticky left-12 bg-white font-sans font-bold text-slate-900">
                      {r.name}
                    </td>
                    <td className="py-2.5 px-3 text-right text-rose-600 tabular-nums">
                      {r.tipElec.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums">
                      {r.peakElec.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums">
                      {r.flatElec.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums">
                      {r.valleyElec.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums">
                      {r.gasCost.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums">
                      {r.waterCost.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums">
                      {r.steamCost.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-600 font-bold tabular-nums">
                      {r.greenDeduct.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 bg-blue-50/40 tabular-nums">
                      {r.netCost.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-blue-700 tabular-nums">
                      {r.avgPrice}
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* 汇总行 */}
              <tfoot>
                <tr className="bg-slate-100/90 font-bold text-slate-900 border-t-2 border-slate-300">
                  <td className="py-2.5 px-3 sticky left-0 bg-slate-100 font-sans text-center" colSpan={2}>
                    全集团总费用汇总 (8大基地)
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-rose-600 tabular-nums">
                    {totals.tipElec.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                    {totals.peakElec.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                    {totals.flatElec.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                    {totals.valleyElec.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                    {totals.gasCost.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                    {totals.waterCost.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                    {totals.steamCost.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-700 tabular-nums">
                    {totals.greenDeduct.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-blue-700 bg-blue-100/60 tabular-nums text-sm">
                    {totals.netCost.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-blue-700">0.558 元</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
