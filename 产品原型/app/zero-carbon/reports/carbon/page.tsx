'use client'

import { useState, useMemo } from 'react'
import {
  Download,
  Calendar,
  Leaf,
  Globe2,
  Factory,
  Zap,
  Flame,
  FileSpreadsheet,
  ArrowUpDown,
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { cn } from '@/lib/utils'

interface CarbonRow {
  id: string
  name: string
  industry: '变压器制造' | '线缆制造' | '高压成套'
  fossilCombustion: number
  processEmission: number
  gridElecEmission: number
  steamEmission: number
  pvGreenDeduct: number
  ccerDeduct: number
  netEmission: number
  yoy: string
}

const CARBON_MOCK_ROWS: CarbonRow[] = [
  {
    id: '01',
    name: '沈变公司',
    industry: '变压器制造',
    fossilCombustion: 2127.6,
    processEmission: 480.0,
    gridElecEmission: 48022.1,
    steamEmission: 1364.0,
    pvGreenDeduct: -1550.0,
    ccerDeduct: -500.0,
    netEmission: 49943.7,
    yoy: '-6.4%',
  },
  {
    id: '02',
    name: '衡变公司',
    industry: '变压器制造',
    fossilCombustion: 1863.8,
    processEmission: 420.0,
    gridElecEmission: 44768.6,
    steamEmission: 1078.0,
    pvGreenDeduct: -1330.0,
    ccerDeduct: -400.0,
    netEmission: 46400.4,
    yoy: '-5.9%',
  },
  {
    id: '03',
    name: '鲁缆公司',
    industry: '线缆制造',
    fossilCombustion: 1340.6,
    processEmission: 310.0,
    gridElecEmission: 33305.5,
    steamEmission: 682.0,
    pvGreenDeduct: -880.0,
    ccerDeduct: -300.0,
    netEmission: 34458.1,
    yoy: '-5.2%',
  },
  {
    id: '04',
    name: '新变厂',
    industry: '变压器制造',
    fossilCombustion: 1611.0,
    processEmission: 360.0,
    gridElecEmission: 39464.8,
    steamEmission: 935.0,
    pvGreenDeduct: -1120.0,
    ccerDeduct: -350.0,
    netEmission: 40900.8,
    yoy: '-5.5%',
  },
  {
    id: '05',
    name: '新缆厂',
    industry: '线缆制造',
    fossilCombustion: 1167.6,
    processEmission: 270.0,
    gridElecEmission: 26347.9,
    steamEmission: 528.0,
    pvGreenDeduct: -710.0,
    ccerDeduct: -250.0,
    netEmission: 27353.5,
    yoy: '-5.1%',
  },
  {
    id: '06',
    name: '德缆公司',
    industry: '线缆制造',
    fossilCombustion: 1005.4,
    processEmission: 230.0,
    gridElecEmission: 23496.4,
    steamEmission: 429.0,
    pvGreenDeduct: -630.0,
    ccerDeduct: -200.0,
    netEmission: 24330.8,
    yoy: '-4.1%',
  },
  {
    id: '07',
    name: '天变制造',
    industry: '变压器制造',
    fossilCombustion: 691.9,
    processEmission: 160.0,
    gridElecEmission: 16253.6,
    steamEmission: 308.0,
    pvGreenDeduct: -440.0,
    ccerDeduct: -150.0,
    netEmission: 16823.5,
    yoy: '-5.3%',
  },
  {
    id: '08',
    name: '中辰开关成套',
    industry: '高压成套',
    fossilCombustion: 480.0,
    processEmission: 110.0,
    gridElecEmission: 10379.5,
    steamEmission: 198.0,
    pvGreenDeduct: -280.0,
    ccerDeduct: -90.0,
    netEmission: 10797.5,
    yoy: '-5.0%',
  },
]

export default function CarbonReportPage() {
  const [selectedNode, setSelectedNode] = useState<StandardOrgNode>({
    id: 'group_root',
    name: '特变电工集团 (全景汇总)',
    fullName: '特变电工集团 (全景汇总)',
    level: 'group',
    badge: '全集团',
  })

  const [period, setPeriod] = useState<'month' | 'year' | 'esg'>('year')
  const [sortField, setSortField] = useState<keyof CarbonRow>('netEmission')
  const [sortAsc, setSortAsc] = useState(false)

  const handleSort = (field: keyof CarbonRow) => {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(false)
    }
  }

  const sortedRows = useMemo(() => {
    const rows = [...CARBON_MOCK_ROWS]
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
        acc.fossilCombustion += r.fossilCombustion
        acc.processEmission += r.processEmission
        acc.gridElecEmission += r.gridElecEmission
        acc.steamEmission += r.steamEmission
        acc.pvGreenDeduct += r.pvGreenDeduct
        acc.ccerDeduct += r.ccerDeduct
        acc.netEmission += r.netEmission
        return acc
      },
      {
        fossilCombustion: 0,
        processEmission: 0,
        gridElecEmission: 0,
        steamEmission: 0,
        pvGreenDeduct: 0,
        ccerDeduct: 0,
        netEmission: 0,
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
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
              <Globe2 className="size-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800">碳排报表</h1>
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
                    ? 'bg-white text-emerald-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900',
                )}
              >
                月度核算
              </button>
              <button
                onClick={() => setPeriod('year')}
                className={cn(
                  'px-2.5 py-1 rounded-md font-medium transition-all',
                  period === 'year'
                    ? 'bg-white text-emerald-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900',
                )}
              >
                年度履约报告
              </button>
              <button
                onClick={() => setPeriod('esg')}
                className={cn(
                  'px-2.5 py-1 rounded-md font-medium transition-all',
                  period === 'esg'
                    ? 'bg-white text-emerald-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900',
                )}
              >
                ESG披露专版
              </button>
            </div>

            <div className="flex items-center gap-1.5 h-8 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium">
              <Calendar className="size-3.5 text-slate-400" />
              <span>2026年度 (累计)</span>
            </div>

            <button
              onClick={() => alert('正在生成并导出【ISO 14064 碳盘查合规报表 (PDF/Excel)】...')}
              className="h-8 px-3 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-700 shadow-xs transition-colors"
            >
              <Download className="size-3.5" />
              <span>导出合规清单</span>
            </button>
          </div>
        </div>

        {/* KPI 汇总卡片 (4列) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. 总净碳排放量 */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500">总净碳排放量 (tCO₂e)</div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                184,210.5 <span className="text-xs font-normal text-slate-500 font-sans">t</span>
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                <span>↓ 6.1% 同比减排</span>
              </div>
            </div>
            <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg shadow-xs">
              🌍
            </div>
          </div>

          {/* 2. 直接排放 Scope 1 */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500">直接排放 Scope 1 (tCO₂e)</div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                14,280.0 <span className="text-xs font-normal text-slate-500 font-sans">t</span>
              </div>
              <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                占总排 7.7% (天然气/柴油)
              </div>
            </div>
            <div className="size-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg shadow-xs">
              🏭
            </div>
          </div>

          {/* 3. 间接排放 Scope 2 */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500">间接排放 Scope 2 (tCO₂e)</div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                174,480.5 <span className="text-xs font-normal text-slate-500 font-sans">t</span>
              </div>
              <div className="text-[11px] text-blue-600 font-semibold mt-0.5">
                外购电力与外购蒸汽
              </div>
            </div>
            <div className="size-10 rounded-xl bg-blue-50 text-[#1677ff] flex items-center justify-center font-bold text-lg shadow-xs">
              ⚡
            </div>
          </div>

          {/* 4. 绿电/CCER 抵扣量 */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500">绿电/CCER 抵扣量 (tCO₂e)</div>
              <div className="text-xl font-bold font-mono text-emerald-600 mt-1 tabular-nums">
                -4,550.0 <span className="text-xs font-normal text-emerald-600 font-sans">t</span>
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                绿色权益抵扣履约
              </div>
            </div>
            <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg shadow-xs">
              🌿
            </div>
          </div>
        </div>

        {/* 主数据报表卡片 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-[#fafbfc]">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" />
              <h3 className="text-xs font-bold text-slate-800">
                全集团 8 大基地温室气体排放 Scope 1/2 分解与核算透视表 (2026年度)
              </h3>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              因子基准：电网 0.5703 tCO₂/MWh | 天然气 2.1622 kgCO₂/m³
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-bold select-none">
                  <th className="py-2.5 px-3 sticky left-0 bg-slate-50 z-10 w-12 text-center">序号</th>
                  <th className="py-2.5 px-3 sticky left-12 bg-slate-50 z-10 min-w-[140px]">制造基地</th>
                  <th className="py-2.5 px-3 text-right">化石燃料燃烧 (Scope 1)</th>
                  <th className="py-2.5 px-3 text-right">工业制程逸散 (Scope 1)</th>
                  <th className="py-2.5 px-3 text-right">外购市电排放 (Scope 2)</th>
                  <th className="py-2.5 px-3 text-right">外购蒸汽排放 (Scope 2)</th>
                  <th className="py-2.5 px-3 text-right text-emerald-600">光伏绿电核减</th>
                  <th className="py-2.5 px-3 text-right text-emerald-600">CCER注销抵销</th>
                  <th
                    className="py-2.5 px-3 text-right font-bold text-slate-900 bg-emerald-50/50 cursor-pointer hover:bg-emerald-100/60 transition-colors"
                    onClick={() => handleSort('netEmission')}
                  >
                    <div className="inline-flex items-center gap-1">
                      <span>净排放总量 (tCO₂e)</span>
                      <ArrowUpDown className="size-3 text-emerald-700" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 text-center">同比变动</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11.5px]">
                {sortedRows.map((r, i) => (
                  <tr key={r.id} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="py-2.5 px-3 sticky left-0 bg-white font-sans text-slate-400 text-center">
                      {String(i + 1).padStart(2, '0')}
                    </td>
                    <td className="py-2.5 px-3 sticky left-12 bg-white font-sans font-bold text-slate-900">
                      {r.name}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums">
                      {r.fossilCombustion.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums">
                      {r.processEmission.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums">
                      {r.gridElecEmission.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums">
                      {r.steamEmission.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-600 font-bold tabular-nums">
                      {r.pvGreenDeduct.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-600 font-bold tabular-nums">
                      {r.ccerDeduct.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 bg-emerald-50/40 tabular-nums">
                      {r.netEmission.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                    </td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">
                      {r.yoy}
                    </td>
                  </tr>
                ))}
              </tbody>

              {/* 汇总行 */}
              <tfoot>
                <tr className="bg-slate-100/90 font-bold text-slate-900 border-t-2 border-slate-300">
                  <td className="py-2.5 px-3 sticky left-0 bg-slate-100 font-sans text-center" colSpan={2}>
                    全集团碳排放汇总 (8大基地)
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                    {totals.fossilCombustion.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                    {totals.processEmission.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                    {totals.gridElecEmission.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                    {totals.steamEmission.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-700 tabular-nums">
                    {totals.pvGreenDeduct.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-700 tabular-nums">
                    {totals.ccerDeduct.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-800 bg-emerald-100/60 tabular-nums text-sm">
                    {totals.netEmission.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-center text-emerald-700 font-extrabold">-6.1%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
