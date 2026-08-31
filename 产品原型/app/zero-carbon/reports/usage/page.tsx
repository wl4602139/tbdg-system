'use client'

import { useState, useMemo } from 'react'
import {
  Download,
  FileSpreadsheet,
  Zap,
  Flame,
  Droplets,
  Calendar,
  Building2,
  Filter,
  ArrowUpDown,
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { cn } from '@/lib/utils'

interface UsageRow {
  id: string
  name: string
  industry: '变压器制造' | '线缆制造' | '高压成套'
  gridElec: number
  pvSelf: number
  greenElec: number
  gas: number
  water: number
  steam: number
  totalTce: number
  yoy: string
  mom: string
}

const USAGE_MOCK_ROWS: UsageRow[] = [
  {
    id: '01',
    name: '沈变公司 (变压器)',
    industry: '变压器制造',
    gridElec: 8420.5,
    pvSelf: 92.0,
    greenElec: 180.0,
    gas: 98.4,
    water: 10.5,
    steam: 1240.0,
    totalTce: 10854.2,
    yoy: '-6.4%',
    mom: '-1.5%',
  },
  {
    id: '02',
    name: '衡变公司 (南变中心)',
    industry: '变压器制造',
    gridElec: 7850.0,
    pvSelf: 84.5,
    greenElec: 150.0,
    gas: 86.2,
    water: 9.8,
    steam: 980.0,
    totalTce: 9940.6,
    yoy: '-5.9%',
    mom: '-1.1%',
  },
  {
    id: '03',
    name: '新变厂 (特高压)',
    industry: '变压器制造',
    gridElec: 6920.0,
    pvSelf: 78.0,
    greenElec: 120.0,
    gas: 74.5,
    water: 8.6,
    steam: 850.0,
    totalTce: 8760.3,
    yoy: '-5.5%',
    mom: '-0.8%',
  },
  {
    id: '04',
    name: '鲁缆公司 (山东线缆)',
    industry: '线缆制造',
    gridElec: 5840.0,
    pvSelf: 65.0,
    greenElec: 90.0,
    gas: 62.0,
    water: 7.4,
    steam: 620.0,
    totalTce: 7380.5,
    yoy: '-5.2%',
    mom: '-1.4%',
  },
  {
    id: '05',
    name: '新缆厂 (特种线缆)',
    industry: '线缆制造',
    gridElec: 4620.0,
    pvSelf: 52.0,
    greenElec: 80.0,
    gas: 54.0,
    water: 6.2,
    steam: 480.0,
    totalTce: 5840.2,
    yoy: '-5.1%',
    mom: '-0.9%',
  },
  {
    id: '06',
    name: '德缆公司 (德阳电缆)',
    industry: '线缆制造',
    gridElec: 4120.0,
    pvSelf: 48.0,
    greenElec: 70.0,
    gas: 46.5,
    water: 5.5,
    steam: 390.0,
    totalTce: 5210.4,
    yoy: '-4.1%',
    mom: '+0.3%',
  },
  {
    id: '07',
    name: '天变制造公司',
    industry: '变压器制造',
    gridElec: 2850.0,
    pvSelf: 32.0,
    greenElec: 50.0,
    gas: 32.0,
    water: 4.1,
    steam: 280.0,
    totalTce: 3610.1,
    yoy: '-5.3%',
    mom: '-1.0%',
  },
  {
    id: '08',
    name: '中辰开关成套',
    industry: '高压成套',
    gridElec: 1820.0,
    pvSelf: 21.0,
    greenElec: 30.0,
    gas: 22.2,
    water: 2.8,
    steam: 180.0,
    totalTce: 2304.2,
    yoy: '-5.0%',
    mom: '-0.5%',
  },
]

export default function UsageReportPage() {
  const [selectedNode, setSelectedNode] = useState<StandardOrgNode>({
    id: 'group_root',
    name: '电装集团',
    fullName: '电装集团',
    level: 'group',
    badge: '全集团',
  })

  const [period, setPeriod] = useState<'day' | 'month' | 'quarter' | 'year'>('month')
  const [industryFilter, setIndustryFilter] = useState('all')
  const [mediumFilter, setMediumFilter] = useState('all')
  const [sortField, setSortField] = useState<keyof UsageRow>('totalTce')
  const [sortAsc, setSortAsc] = useState(false)

  const handleSort = (field: keyof UsageRow) => {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(false)
    }
  }

  const filteredRows = useMemo(() => {
    let rows = [...USAGE_MOCK_ROWS]
    if (industryFilter === 'transformer') {
      rows = rows.filter((r) => r.industry === '变压器制造')
    } else if (industryFilter === 'cable') {
      rows = rows.filter((r) => r.industry === '线缆制造')
    } else if (industryFilter === 'set') {
      rows = rows.filter((r) => r.industry === '高压成套')
    }

    rows.sort((a, b) => {
      const va = a[sortField]
      const vb = b[sortField]
      if (typeof va === 'number' && typeof vb === 'number') {
        return sortAsc ? va - vb : vb - va
      }
      return 0
    })

    return rows
  }, [industryFilter, sortField, sortAsc])

  const totals = useMemo(() => {
    return filteredRows.reduce(
      (acc, r) => {
        acc.gridElec += r.gridElec
        acc.pvSelf += r.pvSelf
        acc.greenElec += r.greenElec
        acc.gas += r.gas
        acc.water += r.water
        acc.steam += r.steam
        acc.totalTce += r.totalTce
        return acc
      },
      { gridElec: 0, pvSelf: 0, greenElec: 0, gas: 0, water: 0, steam: 0, totalTce: 0 },
    )
  }, [filteredRows])

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
              <FileSpreadsheet className="size-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800">用能报表</h1>
            </div>
          </div>

          {/* 多维筛选与导出工具 */}
          <div className="flex flex-wrap items-center gap-2">
            {/* 统计周期切换 */}
            <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
              {(['day', 'month', 'quarter', 'year'] as const).map((p) => {
                const map = { day: '日报', month: '月报', quarter: '季报', year: '年报' }
                return (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={cn(
                      'px-2.5 py-1 rounded-md font-medium transition-all',
                      period === p
                        ? 'bg-white text-[#1677ff] font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900',
                    )}
                  >
                    {map[p]}
                  </button>
                )
              })}
            </div>

            {/* 产业分类下拉 */}
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="h-8 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="all">全产业板块 (变压器+线缆+成套)</option>
              <option value="transformer">变压器制造产业 (沈变/衡变/新变)</option>
              <option value="cable">线缆制造产业 (鲁缆/新缆/德缆)</option>
              <option value="set">成套电气与工程板块</option>
            </select>

            {/* 能源介质筛选 */}
            <select
              value={mediumFilter}
              onChange={(e) => setMediumFilter(e.target.value)}
              className="h-8 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="all">全部能源介质 (电/气/水/汽/标煤)</option>
              <option value="elec">电力消费 (市电/光伏/绿电)</option>
              <option value="gas">天然气消费 (万m³)</option>
              <option value="water">工业新鲜水 (万t)</option>
              <option value="steam">蒸汽热力 (GJ)</option>
            </select>

            {/* 日期选择器 */}
            <div className="flex items-center gap-1.5 h-8 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium">
              <Calendar className="size-3.5 text-slate-400" />
              <span>2026年08月 (当月累计)</span>
            </div>

            {/* 批量导出按钮 */}
            <button
              onClick={() => alert('正在导出【全集团用能汇总统计报表 (Excel/PDF)】...')}
              className="h-8 px-3 rounded-lg bg-[#1677ff] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-blue-600 shadow-xs transition-colors"
            >
              <Download className="size-3.5" />
              <span>导出</span>
            </button>
          </div>
        </div>

        {/* KPI 客观汇总卡片 (4列) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. 综合用能总折标煤 */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500">综合用能总折标煤 (tce)</div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                48,320.5 <span className="text-xs font-normal text-slate-500 font-sans">tce</span>
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                <span>↓ 5.8% 同比下降</span>
                <span className="text-slate-400 font-normal">| 环比 -1.2%</span>
              </div>
            </div>
            <div className="size-10 rounded-xl bg-blue-50 text-[#1677ff] flex items-center justify-center font-bold text-lg shadow-xs">
              ⚡
            </div>
          </div>

          {/* 2. 用电量合计 */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500">用电量合计 (万kWh)</div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                38,240.0 <span className="text-xs font-normal text-slate-500 font-sans">万kWh</span>
              </div>
              <div className="text-[11px] text-blue-600 font-semibold mt-0.5 flex items-center gap-1">
                <span>含光伏自用 380万kWh</span>
              </div>
            </div>
            <div className="size-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg shadow-xs">
              🔌
            </div>
          </div>

          {/* 3. 天然气消费 */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500">天然气消费 (万m³)</div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                426.8 <span className="text-xs font-normal text-slate-500 font-sans">万m³</span>
              </div>
              <div className="text-[11px] text-slate-500 font-semibold mt-0.5 flex items-center gap-1">
                <span>折标煤 567.6 tce</span>
              </div>
            </div>
            <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg shadow-xs">
              🔥
            </div>
          </div>

          {/* 4. 工业新鲜水耗 */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500">工业新鲜水耗 (万吨)</div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                48.20 <span className="text-xs font-normal text-slate-500 font-sans">万t</span>
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                <span>↓ 3.2% 同比节水</span>
              </div>
            </div>
            <div className="size-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold text-lg shadow-xs">
              💧
            </div>
          </div>
        </div>

        {/* 主数据透视报表卡片 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-[#fafbfc]">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#1677ff]" />
              <h3 className="text-xs font-bold text-slate-800">
                全集团月度用能汇总透视报表 (2026年08月)
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">按产业板块聚合 · 支持列排序</span>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-blue-500" />
                变压器板块: 3家基地
              </span>
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-amber-500" />
                线缆板块: 3家基地
              </span>
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-purple-500" />
                工程成套: 2家基地
              </span>
            </div>
          </div>

          {/* 报表表格 (Sticky Header) */}
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-bold select-none">
                  <th className="py-2.5 px-3 sticky left-0 bg-slate-50 z-10 w-12 text-center">序号</th>
                  <th className="py-2.5 px-3 sticky left-12 bg-slate-50 z-10 min-w-[150px]">制造基地 / 单位</th>
                  <th className="py-2.5 px-3 min-w-[100px]">所属产业</th>
                  <th
                    className="py-2.5 px-3 text-right cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => handleSort('gridElec')}
                  >
                    <div className="inline-flex items-center gap-1">
                      <span>市电电量 (万kWh)</span>
                      <ArrowUpDown className="size-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 text-right">光伏自用 (万kWh)</th>
                  <th className="py-2.5 px-3 text-right">绿电交易 (万kWh)</th>
                  <th
                    className="py-2.5 px-3 text-right cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => handleSort('gas')}
                  >
                    <div className="inline-flex items-center gap-1">
                      <span>天然气 (万m³)</span>
                      <ArrowUpDown className="size-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 text-right">工业水 (万t)</th>
                  <th className="py-2.5 px-3 text-right">蒸汽 (GJ)</th>
                  <th
                    className="py-2.5 px-3 text-right font-bold text-slate-900 bg-blue-50/50 cursor-pointer hover:bg-blue-100/60 transition-colors"
                    onClick={() => handleSort('totalTce')}
                  >
                    <div className="inline-flex items-center gap-1">
                      <span>综合能耗 (tce)</span>
                      <ArrowUpDown className="size-3 text-blue-600" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 text-center">同比变动</th>
                  <th className="py-2.5 px-3 text-center">环比变动</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11.5px]">
                {filteredRows.map((r, i) => (
                  <tr key={r.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-2.5 px-3 sticky left-0 bg-white font-sans text-slate-400 text-center">
                      {String(i + 1).padStart(2, '0')}
                    </td>
                    <td className="py-2.5 px-3 sticky left-12 bg-white font-sans font-bold text-slate-900">
                      {r.name}
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded text-[10px] font-bold',
                          r.industry === '变压器制造'
                            ? 'bg-blue-50 text-blue-700'
                            : r.industry === '线缆制造'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-purple-50 text-purple-700',
                        )}
                      >
                        {r.industry}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums">
                      {r.gridElec.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-600 font-bold tabular-nums">
                      {r.pvSelf.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                    </td>
                    <td className="py-2.5 px-3 text-right text-blue-600 tabular-nums">
                      {r.greenElec.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums">
                      {r.gas.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums">
                      {r.water.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums">
                      {r.steam.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 bg-blue-50/40 tabular-nums">
                      {r.totalTce.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                    </td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-semibold">{r.yoy}</td>
                    <td className="py-2.5 px-3 text-center text-slate-600 font-medium">{r.mom}</td>
                  </tr>
                ))}
              </tbody>

              {/* 汇总行 */}
              <tfoot>
                <tr className="bg-slate-100/90 font-bold text-slate-900 border-t-2 border-slate-300">
                  <td className="py-2.5 px-3 sticky left-0 bg-slate-100 font-sans text-center" colSpan={2}>
                    全集团综合汇总
                  </td>
                  <td className="py-2.5 px-3 font-sans text-blue-700">全板块聚合</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                    {totals.gridElec.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-700 tabular-nums">
                    {totals.pvSelf.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-blue-700 tabular-nums">
                    {totals.greenElec.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                    {totals.gas.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                    {totals.water.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                    {totals.steam.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-blue-700 bg-blue-100/60 tabular-nums text-sm">
                    {totals.totalTce.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-center text-emerald-700 font-extrabold">-5.8%</td>
                  <td className="py-2.5 px-3 text-center text-slate-700 font-bold">-1.2%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
