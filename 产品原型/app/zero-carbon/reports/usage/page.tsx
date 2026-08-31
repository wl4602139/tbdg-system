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
  Wind,
  Sun,
  Leaf,
  Scale,
  Sparkles,
  RefreshCw,
  Gauge,
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { cn } from '@/lib/utils'

interface UsageRow {
  id: string
  name: string
  company: string
  industry: '变压器制造' | '线缆制造' | '高压成套'
  gridElec: number       // 市电 (万kWh)
  pvSelf: number         // 光伏自用 (万kWh)
  greenElec: number      // 绿电交易 (万kWh)
  gas: number            // 天然气 (万m³)
  water: number          // 工业水 (万t)
  steam: number          // 蒸汽 (GJ)
  waterRecycle: number   // 循环水量 (万t)
  steamCondense: number  // 冷凝水回收 (t)
  totalTce: number       // 综合能耗 (tce)
  yoy: string
  mom: string
}

const USAGE_MOCK_ROWS: UsageRow[] = [
  {
    id: '01',
    name: '沈变公司 (变压器)',
    company: '沈变公司',
    industry: '变压器制造',
    gridElec: 8420.5,
    pvSelf: 92.0,
    greenElec: 180.0,
    gas: 98.4,
    water: 10.5,
    steam: 1240.0,
    waterRecycle: 24.5,
    steamCondense: 1080,
    totalTce: 10854.2,
    yoy: '-6.4%',
    mom: '-1.5%',
  },
  {
    id: '02',
    name: '衡变公司 (南变中心)',
    company: '衡变公司',
    industry: '变压器制造',
    gridElec: 7850.0,
    pvSelf: 84.5,
    greenElec: 150.0,
    gas: 86.2,
    water: 9.8,
    steam: 980.0,
    waterRecycle: 22.0,
    steamCondense: 850,
    totalTce: 9940.6,
    yoy: '-5.9%',
    mom: '-1.1%',
  },
  {
    id: '03',
    name: '新变厂 (特高压)',
    company: '新变厂',
    industry: '变压器制造',
    gridElec: 6920.0,
    pvSelf: 78.0,
    greenElec: 120.0,
    gas: 74.5,
    water: 8.6,
    steam: 850.0,
    waterRecycle: 19.5,
    steamCondense: 740,
    totalTce: 8760.3,
    yoy: '-5.5%',
    mom: '-0.8%',
  },
  {
    id: '04',
    name: '鲁缆公司 (山东线缆)',
    company: '鲁缆公司',
    industry: '线缆制造',
    gridElec: 5840.0,
    pvSelf: 65.0,
    greenElec: 90.0,
    gas: 62.0,
    water: 7.4,
    steam: 620.0,
    waterRecycle: 18.0,
    steamCondense: 540,
    totalTce: 7380.5,
    yoy: '-5.2%',
    mom: '-1.4%',
  },
  {
    id: '05',
    name: '新缆厂 (特种线缆)',
    company: '新缆厂',
    industry: '线缆制造',
    gridElec: 4620.0,
    pvSelf: 52.0,
    greenElec: 80.0,
    gas: 54.0,
    water: 6.2,
    steam: 480.0,
    waterRecycle: 14.5,
    steamCondense: 410,
    totalTce: 5840.2,
    yoy: '-5.1%',
    mom: '-0.9%',
  },
  {
    id: '06',
    name: '德缆公司 (德阳电缆)',
    company: '德缆公司',
    industry: '线缆制造',
    gridElec: 4120.0,
    pvSelf: 48.0,
    greenElec: 70.0,
    gas: 46.5,
    water: 5.5,
    steam: 390.0,
    waterRecycle: 13.0,
    steamCondense: 330,
    totalTce: 5210.4,
    yoy: '-4.1%',
    mom: '+0.3%',
  },
  {
    id: '07',
    name: '天变制造公司',
    company: '新变厂',
    industry: '变压器制造',
    gridElec: 2850.0,
    pvSelf: 32.0,
    greenElec: 50.0,
    gas: 32.0,
    water: 4.1,
    steam: 280.0,
    waterRecycle: 9.5,
    steamCondense: 240,
    totalTce: 3610.1,
    yoy: '-5.3%',
    mom: '-1.0%',
  },
  {
    id: '08',
    name: '中辰开关成套',
    company: '衡变公司',
    industry: '高压成套',
    gridElec: 1820.0,
    pvSelf: 21.0,
    greenElec: 30.0,
    gas: 22.2,
    water: 2.8,
    steam: 180.0,
    waterRecycle: 7.5,
    steamCondense: 150,
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
  const [mediumFilter, setMediumFilter] = useState<'all' | 'elec' | 'gas' | 'water' | 'steam'>('all')
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

  // 根据产业筛选和组织树筛选
  const filteredRows = useMemo(() => {
    let rows = [...USAGE_MOCK_ROWS]

    // 1. 产业过滤
    if (industryFilter === 'transformer') {
      rows = rows.filter((r) => r.industry === '变压器制造')
    } else if (industryFilter === 'cable') {
      rows = rows.filter((r) => r.industry === '线缆制造')
    } else if (industryFilter === 'set') {
      rows = rows.filter((r) => r.industry === '高压成套')
    }

    // 2. 组织树联动过滤 (若选中了特定公司)
    if (selectedNode.id !== 'group_root' && selectedNode.id !== 'ent_root') {
      const matchName = selectedNode.name.slice(0, 2)
      const matched = rows.filter((r) => r.company.includes(matchName) || r.name.includes(matchName))
      if (matched.length > 0) {
        rows = matched
      }
    }

    // 3. 排序
    rows.sort((a, b) => {
      const va = a[sortField]
      const vb = b[sortField]
      if (typeof va === 'number' && typeof vb === 'number') {
        return sortAsc ? va - vb : vb - va
      }
      return 0
    })

    return rows
  }, [industryFilter, selectedNode, sortField, sortAsc])

  // 汇总统计数据
  const totals = useMemo(() => {
    return filteredRows.reduce(
      (acc, r) => {
        acc.gridElec += r.gridElec
        acc.pvSelf += r.pvSelf
        acc.greenElec += r.greenElec
        acc.gas += r.gas
        acc.water += r.water
        acc.steam += r.steam
        acc.waterRecycle += r.waterRecycle
        acc.steamCondense += r.steamCondense
        acc.totalTce += r.totalTce
        return acc
      },
      { gridElec: 0, pvSelf: 0, greenElec: 0, gas: 0, water: 0, steam: 0, waterRecycle: 0, steamCondense: 0, totalTce: 0 },
    )
  }, [filteredRows])

  // 计算合计用电总量
  const totalElecSum = totals.gridElec + totals.pvSelf + totals.greenElec
  const greenElecRatio = totalElecSum > 0 ? (((totals.pvSelf + totals.greenElec) / totalElecSum) * 100).toFixed(1) : '0.0'
  const waterRecycleRate = totals.water + totals.waterRecycle > 0 ? ((totals.waterRecycle / (totals.water + totals.waterRecycle)) * 100).toFixed(1) : '0.0'

  // 报表标题文案
  const reportTitle = useMemo(() => {
    const periodText = period === 'day' ? '日度' : period === 'month' ? '月度' : period === 'quarter' ? '季度' : '年度'
    if (mediumFilter === 'elec') return `全集团${periodText}电力消费透视报表 (市电/光伏/绿电) (2026年08月)`
    if (mediumFilter === 'gas') return `全集团${periodText}天然气能源消费透视报表 (2026年08月)`
    if (mediumFilter === 'water') return `全集团${periodText}工业水资源消费透视报表 (2026年08月)`
    if (mediumFilter === 'steam') return `全集团${periodText}蒸汽热力能源消费透视报表 (2026年08月)`
    return `全集团${periodText}用能汇总透视报表 (2026年08月)`
  }, [period, mediumFilter])

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
                      'px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
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
              className="h-8 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">全产业板块 (变压器+线缆+成套)</option>
              <option value="transformer">变压器制造产业 (沈变/衡变/新变)</option>
              <option value="cable">线缆制造产业 (鲁缆/新缆/德缆)</option>
              <option value="set">成套电气与工程板块</option>
            </select>

            {/* 🌟 能源介质筛选 (与下方表格及KPI卡片实时联动) */}
            <select
              value={mediumFilter}
              onChange={(e) => setMediumFilter(e.target.value as any)}
              className="h-8 px-2.5 text-xs bg-blue-50/70 border border-blue-200 rounded-lg text-blue-800 font-bold focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
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
              onClick={() => alert(`正在导出【${reportTitle}】(Excel/PDF)...`)}
              className="h-8 px-3 rounded-lg bg-[#1677ff] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-blue-600 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="size-3.5" />
              <span>导出</span>
            </button>
          </div>
        </div>

        {/* 🌟 KPI 客观汇总卡片 (根据 mediumFilter 介质类型动态切换数据) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* ======================= 1. 全部能源介质 KPI ======================= */}
          {mediumFilter === 'all' && (
            <>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500">综合用能总折标煤 (tce)</div>
                  <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                    {totals.totalTce.toLocaleString('en-US', { minimumFractionDigits: 1 })}{' '}
                    <span className="text-xs font-normal text-slate-500 font-sans">tce</span>
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

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500">用电量合计 (万kWh)</div>
                  <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                    {totalElecSum.toLocaleString('en-US', { minimumFractionDigits: 1 })}{' '}
                    <span className="text-xs font-normal text-slate-500 font-sans">万kWh</span>
                  </div>
                  <div className="text-[11px] text-blue-600 font-semibold mt-0.5 flex items-center gap-1">
                    <span>含光伏自用 {totals.pvSelf.toFixed(1)}万kWh</span>
                  </div>
                </div>
                <div className="size-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg shadow-xs">
                  🔌
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500">天然气消费 (万m³)</div>
                  <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                    {totals.gas.toLocaleString('en-US', { minimumFractionDigits: 1 })}{' '}
                    <span className="text-xs font-normal text-slate-500 font-sans">万m³</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-semibold mt-0.5 flex items-center gap-1">
                    <span>折标煤 {(totals.gas * 1.33).toFixed(1)} tce</span>
                  </div>
                </div>
                <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg shadow-xs">
                  🔥
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500">工业新鲜水耗 (万吨)</div>
                  <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                    {totals.water.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
                    <span className="text-xs font-normal text-slate-500 font-sans">万t</span>
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                    <span>↓ 3.2% 同比节水</span>
                  </div>
                </div>
                <div className="size-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold text-lg shadow-xs">
                  💧
                </div>
              </div>
            </>
          )}

          {/* ======================= 2. 电力消费 KPI ======================= */}
          {mediumFilter === 'elec' && (
            <>
              <div className="bg-white p-3.5 rounded-xl border border-blue-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-blue-700">总用电量合计 (万kWh)</div>
                  <div className="text-xl font-bold font-mono text-blue-600 mt-1 tabular-nums">
                    {totalElecSum.toLocaleString('en-US', { minimumFractionDigits: 1 })}{' '}
                    <span className="text-xs font-normal text-slate-500 font-sans">万kWh</span>
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                    <span>↓ 5.4% 同比用电优化</span>
                  </div>
                </div>
                <div className="size-10 rounded-xl bg-blue-50 text-[#1677ff] flex items-center justify-center font-bold text-lg shadow-xs">
                  ⚡
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500">市网供电 (万kWh)</div>
                  <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                    {totals.gridElec.toLocaleString('en-US', { minimumFractionDigits: 1 })}{' '}
                    <span className="text-xs font-normal text-slate-500 font-sans">万kWh</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-semibold mt-0.5 flex items-center gap-1">
                    <span>占比 {((totals.gridElec / totalElecSum) * 100).toFixed(1)}%</span>
                  </div>
                </div>
                <div className="size-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center font-bold text-lg shadow-xs">
                  🏢
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500">光伏发电自用 (万kWh)</div>
                  <div className="text-xl font-bold font-mono text-emerald-600 mt-1 tabular-nums">
                    {totals.pvSelf.toLocaleString('en-US', { minimumFractionDigits: 1 })}{' '}
                    <span className="text-xs font-normal text-slate-500 font-sans">万kWh</span>
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                    <span>消纳率 98.2%</span>
                  </div>
                </div>
                <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg shadow-xs">
                  ☀️
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500">绿电交易与绿电占比</div>
                  <div className="text-xl font-bold font-mono text-emerald-600 mt-1 tabular-nums">
                    {greenElecRatio} <span className="text-xs font-normal text-slate-500 font-sans">%</span>
                  </div>
                  <div className="text-[11px] text-blue-600 font-semibold mt-0.5 flex items-center gap-1">
                    <span>市场化绿电 {totals.greenElec.toFixed(1)}万kWh</span>
                  </div>
                </div>
                <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg shadow-xs">
                  🌿
                </div>
              </div>
            </>
          )}

          {/* ======================= 3. 天然气消费 KPI ======================= */}
          {mediumFilter === 'gas' && (
            <>
              <div className="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-emerald-800">天然气总消费量 (万m³)</div>
                  <div className="text-xl font-bold font-mono text-emerald-600 mt-1 tabular-nums">
                    {totals.gas.toLocaleString('en-US', { minimumFractionDigits: 1 })}{' '}
                    <span className="text-xs font-normal text-slate-500 font-sans">万m³</span>
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                    <span>↓ 4.8% 同比降耗</span>
                  </div>
                </div>
                <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg shadow-xs">
                  🔥
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500">折标煤当量 (tce)</div>
                  <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                    {(totals.gas * 1.33).toLocaleString('en-US', { minimumFractionDigits: 1 })}{' '}
                    <span className="text-xs font-normal text-slate-500 font-sans">tce</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-semibold mt-0.5 flex items-center gap-1">
                    <span>在总能耗占比 {((totals.gas * 1.33 / totals.totalTce) * 100).toFixed(1)}%</span>
                  </div>
                </div>
                <div className="size-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg shadow-xs">
                  ⚖️
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500">折合热力总量 (GJ)</div>
                  <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                    {(totals.gas * 38.93).toLocaleString('en-US', { minimumFractionDigits: 1 })}{' '}
                    <span className="text-xs font-normal text-slate-500 font-sans">GJ</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-semibold mt-0.5 flex items-center gap-1">
                    <span>工业退火与干燥供热</span>
                  </div>
                </div>
                <div className="size-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg shadow-xs">
                  ♨️
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500">燃气直接碳排放 (Scope 1)</div>
                  <div className="text-xl font-bold font-mono text-rose-600 mt-1 tabular-nums">
                    {(totals.gas * 2.1622).toLocaleString('en-US', { minimumFractionDigits: 1 })}{' '}
                    <span className="text-xs font-normal text-slate-500 font-sans">tCO₂</span>
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                    <span>因子 2.1622 kgCO₂/m³</span>
                  </div>
                </div>
                <div className="size-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-lg shadow-xs">
                  ☁️
                </div>
              </div>
            </>
          )}

          {/* ======================= 4. 工业新鲜水 KPI ======================= */}
          {mediumFilter === 'water' && (
            <>
              <div className="bg-white p-3.5 rounded-xl border border-cyan-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-cyan-800">工业新鲜水总量 (万t)</div>
                  <div className="text-xl font-bold font-mono text-cyan-600 mt-1 tabular-nums">
                    {totals.water.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
                    <span className="text-xs font-normal text-slate-500 font-sans">万t</span>
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                    <span>↓ 3.2% 同比节水</span>
                  </div>
                </div>
                <div className="size-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold text-lg shadow-xs">
                  💧
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500">循环水重复利用量 (万t)</div>
                  <div className="text-xl font-bold font-mono text-emerald-600 mt-1 tabular-nums">
                    {totals.waterRecycle.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
                    <span className="text-xs font-normal text-slate-500 font-sans">万t</span>
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                    <span>节约新鲜水资源</span>
                  </div>
                </div>
                <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg shadow-xs">
                  🔄
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500">工业水重复利用率</div>
                  <div className="text-xl font-bold font-mono text-blue-600 mt-1 tabular-nums">
                    {waterRecycleRate} <span className="text-xs font-normal text-slate-500 font-sans">%</span>
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                    <span>重点企业达标 100%</span>
                  </div>
                </div>
                <div className="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg shadow-xs">
                  🎯
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500">水资源综合折标能耗</div>
                  <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                    {(totals.water * 0.257).toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
                    <span className="text-xs font-normal text-slate-500 font-sans">tce</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-semibold mt-0.5 flex items-center gap-1">
                    <span>耗能工质综合核算</span>
                  </div>
                </div>
                <div className="size-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center font-bold text-lg shadow-xs">
                  ⚖️
                </div>
              </div>
            </>
          )}

          {/* ======================= 5. 蒸汽热力 KPI ======================= */}
          {mediumFilter === 'steam' && (
            <>
              <div className="bg-white p-3.5 rounded-xl border border-purple-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-purple-800">外购蒸汽总消耗量 (GJ)</div>
                  <div className="text-xl font-bold font-mono text-purple-600 mt-1 tabular-nums">
                    {totals.steam.toLocaleString('en-US', { minimumFractionDigits: 1 })}{' '}
                    <span className="text-xs font-normal text-slate-500 font-sans">GJ</span>
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                    <span>↓ 4.1% 同比降耗</span>
                  </div>
                </div>
                <div className="size-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg shadow-xs">
                  💨
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500">蒸汽折标煤当量 (tce)</div>
                  <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                    {(totals.steam * 0.0341).toLocaleString('en-US', { minimumFractionDigits: 1 })}{' '}
                    <span className="text-xs font-normal text-slate-500 font-sans">tce</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-semibold mt-0.5 flex items-center gap-1">
                    <span>热力折标系数 0.0341</span>
                  </div>
                </div>
                <div className="size-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg shadow-xs">
                  ⚖️
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500">冷凝水回收总量 (t)</div>
                  <div className="text-xl font-bold font-mono text-emerald-600 mt-1 tabular-nums">
                    {totals.steamCondense.toLocaleString('en-US')}{' '}
                    <span className="text-xs font-normal text-slate-500 font-sans">t</span>
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                    <span>热能二次循环利用</span>
                  </div>
                </div>
                <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg shadow-xs">
                  🌡️
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500">蒸汽间接碳排放 (Scope 2)</div>
                  <div className="text-xl font-bold font-mono text-rose-600 mt-1 tabular-nums">
                    {(totals.steam * 0.11).toLocaleString('en-US', { minimumFractionDigits: 1 })}{' '}
                    <span className="text-xs font-normal text-slate-500 font-sans">tCO₂</span>
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                    <span>因子 0.1100 tCO₂/GJ</span>
                  </div>
                </div>
                <div className="size-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-lg shadow-xs">
                  ☁️
                </div>
              </div>
            </>
          )}
        </div>

        {/* 主数据透视报表卡片 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-[#fafbfc]">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#1677ff]" />
              <h3 className="text-xs font-bold text-slate-800">
                {reportTitle}
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

          {/* 报表表格 (根据 mediumFilter 动态定制列结构) */}
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                {/* 1. 全部能源介质模式表头 */}
                {mediumFilter === 'all' && (
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
                )}

                {/* 2. 电力消费模式表头 */}
                {mediumFilter === 'elec' && (
                  <tr className="bg-blue-50/60 text-slate-700 border-b border-blue-200 font-bold select-none">
                    <th className="py-2.5 px-3 sticky left-0 bg-blue-50 z-10 w-12 text-center">序号</th>
                    <th className="py-2.5 px-3 sticky left-12 bg-blue-50 z-10 min-w-[150px]">制造基地 / 单位</th>
                    <th className="py-2.5 px-3 min-w-[100px]">所属产业</th>
                    <th
                      className="py-2.5 px-3 text-right cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={() => handleSort('gridElec')}
                    >
                      <div className="inline-flex items-center gap-1">
                        <span>市电受电 (万kWh)</span>
                        <ArrowUpDown className="size-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-2.5 px-3 text-right text-emerald-700">分布式光伏 (万kWh)</th>
                    <th className="py-2.5 px-3 text-right text-blue-700">市场化绿电 (万kWh)</th>
                    <th className="py-2.5 px-3 text-right font-bold text-slate-900 bg-blue-100/60">
                      总用电量合计 (万kWh)
                    </th>
                    <th className="py-2.5 px-3 text-right text-emerald-700 font-bold">绿电占比 (%)</th>
                    <th className="py-2.5 px-3 text-right">折标煤 (tce)</th>
                    <th className="py-2.5 px-3 text-center">同比变动</th>
                    <th className="py-2.5 px-3 text-center">环比变动</th>
                  </tr>
                )}

                {/* 3. 天然气消费模式表头 */}
                {mediumFilter === 'gas' && (
                  <tr className="bg-emerald-50/60 text-slate-700 border-b border-emerald-200 font-bold select-none">
                    <th className="py-2.5 px-3 sticky left-0 bg-emerald-50 z-10 w-12 text-center">序号</th>
                    <th className="py-2.5 px-3 sticky left-12 bg-emerald-50 z-10 min-w-[150px]">制造基地 / 单位</th>
                    <th className="py-2.5 px-3 min-w-[100px]">所属产业</th>
                    <th
                      className="py-2.5 px-3 text-right cursor-pointer hover:bg-emerald-100 transition-colors font-bold text-emerald-800"
                      onClick={() => handleSort('gas')}
                    >
                      <div className="inline-flex items-center gap-1">
                        <span>天然气消费量 (万m³)</span>
                        <ArrowUpDown className="size-3 text-emerald-600" />
                      </div>
                    </th>
                    <th className="py-2.5 px-3 text-right">折合热力 (GJ)</th>
                    <th className="py-2.5 px-3 text-right font-bold text-slate-900 bg-emerald-100/60">
                      燃气折标煤 (tce)
                    </th>
                    <th className="py-2.5 px-3 text-right text-rose-700">直接碳排放 (tCO₂)</th>
                    <th className="py-2.5 px-3 text-center">同比变动</th>
                    <th className="py-2.5 px-3 text-center">环比变动</th>
                  </tr>
                )}

                {/* 4. 工业新鲜水模式表头 */}
                {mediumFilter === 'water' && (
                  <tr className="bg-cyan-50/60 text-slate-700 border-b border-cyan-200 font-bold select-none">
                    <th className="py-2.5 px-3 sticky left-0 bg-cyan-50 z-10 w-12 text-center">序号</th>
                    <th className="py-2.5 px-3 sticky left-12 bg-cyan-50 z-10 min-w-[150px]">制造基地 / 单位</th>
                    <th className="py-2.5 px-3 min-w-[100px]">所属产业</th>
                    <th
                      className="py-2.5 px-3 text-right cursor-pointer hover:bg-cyan-100 transition-colors font-bold text-cyan-800"
                      onClick={() => handleSort('water')}
                    >
                      <div className="inline-flex items-center gap-1">
                        <span>新鲜水用量 (万t)</span>
                        <ArrowUpDown className="size-3 text-cyan-600" />
                      </div>
                    </th>
                    <th className="py-2.5 px-3 text-right text-emerald-700 font-bold">循环水量 (万t)</th>
                    <th className="py-2.5 px-3 text-right text-blue-700 font-bold">重复利用率 (%)</th>
                    <th className="py-2.5 px-3 text-right font-bold text-slate-900 bg-cyan-100/60">
                      水耗折标 (tce)
                    </th>
                    <th className="py-2.5 px-3 text-center">节水同比</th>
                    <th className="py-2.5 px-3 text-center">环比变动</th>
                  </tr>
                )}

                {/* 5. 蒸汽热力模式表头 */}
                {mediumFilter === 'steam' && (
                  <tr className="bg-purple-50/60 text-slate-700 border-b border-purple-200 font-bold select-none">
                    <th className="py-2.5 px-3 sticky left-0 bg-purple-50 z-10 w-12 text-center">序号</th>
                    <th className="py-2.5 px-3 sticky left-12 bg-purple-50 z-10 min-w-[150px]">制造基地 / 单位</th>
                    <th className="py-2.5 px-3 min-w-[100px]">所属产业</th>
                    <th
                      className="py-2.5 px-3 text-right cursor-pointer hover:bg-purple-100 transition-colors font-bold text-purple-800"
                      onClick={() => handleSort('steam')}
                    >
                      <div className="inline-flex items-center gap-1">
                        <span>蒸汽消耗量 (GJ)</span>
                        <ArrowUpDown className="size-3 text-purple-600" />
                      </div>
                    </th>
                    <th className="py-2.5 px-3 text-right text-emerald-700 font-bold">冷凝水回收 (t)</th>
                    <th className="py-2.5 px-3 text-right font-bold text-slate-900 bg-purple-100/60">
                      热力折标煤 (tce)
                    </th>
                    <th className="py-2.5 px-3 text-right text-rose-700">间接碳排放 (tCO₂)</th>
                    <th className="py-2.5 px-3 text-center">同比变动</th>
                    <th className="py-2.5 px-3 text-center">环比变动</th>
                  </tr>
                )}
              </thead>

              {/* 报表数据行 (根据 mediumFilter 动态渲染对应数据单元格) */}
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11.5px]">
                {filteredRows.map((r, i) => {
                  const rowTotalElec = r.gridElec + r.pvSelf + r.greenElec
                  const rowGreenRatio = rowTotalElec > 0 ? (((r.pvSelf + r.greenElec) / rowTotalElec) * 100).toFixed(1) : '0.0'
                  const rowWaterRate = r.water + r.waterRecycle > 0 ? ((r.waterRecycle / (r.water + r.waterRecycle)) * 100).toFixed(1) : '0.0'

                  return (
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

                      {/* 1. 全部能源介质数据列 */}
                      {mediumFilter === 'all' && (
                        <>
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
                        </>
                      )}

                      {/* 2. 电力消费数据列 */}
                      {mediumFilter === 'elec' && (
                        <>
                          <td className="py-2.5 px-3 text-right tabular-nums">
                            {r.gridElec.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                          </td>
                          <td className="py-2.5 px-3 text-right text-emerald-600 font-bold tabular-nums">
                            {r.pvSelf.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                          </td>
                          <td className="py-2.5 px-3 text-right text-blue-600 tabular-nums">
                            {r.greenElec.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-blue-700 bg-blue-50/60 tabular-nums">
                            {rowTotalElec.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                          </td>
                          <td className="py-2.5 px-3 text-right text-emerald-600 font-bold tabular-nums">
                            {rowGreenRatio}%
                          </td>
                          <td className="py-2.5 px-3 text-right tabular-nums">
                            {(rowTotalElec * 0.1229).toFixed(1)}
                          </td>
                        </>
                      )}

                      {/* 3. 天然气数据列 */}
                      {mediumFilter === 'gas' && (
                        <>
                          <td className="py-2.5 px-3 text-right text-emerald-700 font-bold tabular-nums">
                            {r.gas.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                          </td>
                          <td className="py-2.5 px-3 text-right tabular-nums">
                            {(r.gas * 38.93).toFixed(1)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-900 bg-emerald-50/60 tabular-nums">
                            {(r.gas * 1.33).toFixed(1)}
                          </td>
                          <td className="py-2.5 px-3 text-right text-rose-600 tabular-nums">
                            {(r.gas * 2.1622).toFixed(1)}
                          </td>
                        </>
                      )}

                      {/* 4. 工业新鲜水数据列 */}
                      {mediumFilter === 'water' && (
                        <>
                          <td className="py-2.5 px-3 text-right text-cyan-700 font-bold tabular-nums">
                            {r.water.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-2.5 px-3 text-right text-emerald-600 font-bold tabular-nums">
                            {r.waterRecycle.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-2.5 px-3 text-right text-blue-600 font-bold tabular-nums">
                            {rowWaterRate}%
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-900 bg-cyan-50/60 tabular-nums">
                            {(r.water * 0.257).toFixed(2)}
                          </td>
                        </>
                      )}

                      {/* 5. 蒸汽热力数据列 */}
                      {mediumFilter === 'steam' && (
                        <>
                          <td className="py-2.5 px-3 text-right text-purple-700 font-bold tabular-nums">
                            {r.steam.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                          </td>
                          <td className="py-2.5 px-3 text-right text-emerald-600 font-bold tabular-nums">
                            {r.steamCondense.toLocaleString('en-US')}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-900 bg-purple-50/60 tabular-nums">
                            {(r.steam * 0.0341).toFixed(1)}
                          </td>
                          <td className="py-2.5 px-3 text-right text-rose-600 tabular-nums">
                            {(r.steam * 0.11).toFixed(1)}
                          </td>
                        </>
                      )}

                      <td className="py-2.5 px-3 text-center text-emerald-600 font-semibold">{r.yoy}</td>
                      <td className="py-2.5 px-3 text-center text-slate-600 font-medium">{r.mom}</td>
                    </tr>
                  )
                })}
              </tbody>

              {/* 汇总行 (根据 mediumFilter 动态展示对应的聚合合计) */}
              <tfoot>
                <tr className="bg-slate-100/90 font-bold text-slate-900 border-t-2 border-slate-300">
                  <td className="py-2.5 px-3 sticky left-0 bg-slate-100 font-sans text-center" colSpan={2}>
                    全集团综合汇总
                  </td>
                  <td className="py-2.5 px-3 font-sans text-blue-700">全板块聚合</td>

                  {/* 1. 全部介质汇总 */}
                  {mediumFilter === 'all' && (
                    <>
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
                    </>
                  )}

                  {/* 2. 电力消费汇总 */}
                  {mediumFilter === 'elec' && (
                    <>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                        {totals.gridElec.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-700 tabular-nums">
                        {totals.pvSelf.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-blue-700 tabular-nums">
                        {totals.greenElec.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-blue-800 bg-blue-100/70 tabular-nums text-sm">
                        {totalElecSum.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-700 tabular-nums">
                        {greenElecRatio}%
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                        {(totalElecSum * 0.1229).toLocaleString('en-US', { minimumFractionDigits: 1 })}
                      </td>
                    </>
                  )}

                  {/* 3. 天然气汇总 */}
                  {mediumFilter === 'gas' && (
                    <>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-800 tabular-nums text-sm">
                        {totals.gas.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                        {(totals.gas * 38.93).toLocaleString('en-US', { minimumFractionDigits: 1 })}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-900 bg-emerald-100/70 tabular-nums text-sm">
                        {(totals.gas * 1.33).toLocaleString('en-US', { minimumFractionDigits: 1 })}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-rose-700 tabular-nums">
                        {(totals.gas * 2.1622).toLocaleString('en-US', { minimumFractionDigits: 1 })}
                      </td>
                    </>
                  )}

                  {/* 4. 工业新鲜水汇总 */}
                  {mediumFilter === 'water' && (
                    <>
                      <td className="py-2.5 px-3 text-right font-mono text-cyan-800 tabular-nums text-sm">
                        {totals.water.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-700 tabular-nums">
                        {totals.waterRecycle.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-blue-700 tabular-nums">
                        {waterRecycleRate}%
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-900 bg-cyan-100/70 tabular-nums text-sm">
                        {(totals.water * 0.257).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </>
                  )}

                  {/* 5. 蒸汽热力汇总 */}
                  {mediumFilter === 'steam' && (
                    <>
                      <td className="py-2.5 px-3 text-right font-mono text-purple-800 tabular-nums text-sm">
                        {totals.steam.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-700 tabular-nums">
                        {totals.steamCondense.toLocaleString('en-US')}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-900 bg-purple-100/70 tabular-nums text-sm">
                        {(totals.steam * 0.0341).toLocaleString('en-US', { minimumFractionDigits: 1 })}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-rose-700 tabular-nums">
                        {(totals.steam * 0.11).toLocaleString('en-US', { minimumFractionDigits: 1 })}
                      </td>
                    </>
                  )}

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
