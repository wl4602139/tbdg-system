'use client'

import { useState, useMemo } from 'react'
import {
  Download,
  Calendar,
  Search,
  FileSpreadsheet,
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { cn } from '@/lib/utils'

// 🌟 依据【用能在线监测】统一的能源介质字段模型
interface UsageRow {
  id: string
  unitId: string
  unitName: string
  company: string
  totalElec: number       // 总用电量 (万kWh)
  gridElec: number        // 市网用电量 (万kWh)
  solarElec: number       // 直供绿电量 (万kWh)
  greenElecRatio: number  // 绿电占比 (%)
  gasM3: number           // 天然气量 (万m³)
  waterM3: number         // 工业用水量 (万m³)
  steamT: number          // 外购蒸汽量 (t)
  oilLiter: number        // 柴油/油耗量 (L)
  liquidNitrogenT: number // 液氮消耗量 (t)
  totalTce: number        // 综合能耗 (tce)
  yoy: string
  mom: string
}

const ALL_USAGE_ROWS: UsageRow[] = [
  // --- 沈变公司 ---
  {
    id: 'SB-01',
    unitId: 'ws_sb_main',
    unitName: '沈变本部',
    company: '沈变公司',
    totalElec: 845.0,
    gridElec: 520.0,
    solarElec: 325.0,
    greenElecRatio: 38.5,
    gasM3: 32.0,
    waterM3: 4.82,
    steamT: 420.0,
    oilLiter: 680,
    liquidNitrogenT: 6.5,
    totalTce: 7154.2,
    yoy: '-6.4%',
    mom: '-1.5%',
  },
  {
    id: 'SB-02',
    unitId: 'ws_sb_luna',
    unitName: '露娜公司 (特变电工露娜智能)',
    company: '沈变公司',
    totalElec: 520.0,
    gridElec: 322.0,
    solarElec: 198.0,
    greenElecRatio: 38.1,
    gasM3: 18.0,
    waterM3: 2.95,
    steamT: 185.0,
    oilLiter: 390,
    liquidNitrogenT: 4.2,
    totalTce: 1620.5,
    yoy: '-5.8%',
    mom: '-1.2%',
  },
  {
    id: 'SB-03',
    unitId: 'ws_sb_zh',
    unitName: '智慧能源',
    company: '沈变公司',
    totalElec: 280.0,
    gridElec: 160.0,
    solarElec: 120.0,
    greenElecRatio: 42.9,
    gasM3: 8.5,
    waterM3: 1.20,
    steamT: 95.0,
    oilLiter: 180,
    liquidNitrogenT: 1.8,
    totalTce: 890.3,
    yoy: '-4.9%',
    mom: '-0.8%',
  },
  {
    id: 'SB-04',
    unitId: 'ws_sb_hx',
    unitName: '和新套管公司',
    company: '沈变公司',
    totalElec: 210.0,
    gridElec: 130.0,
    solarElec: 80.0,
    greenElecRatio: 38.1,
    gasM3: 6.2,
    waterM3: 0.95,
    steamT: 80.0,
    oilLiter: 150,
    liquidNitrogenT: 1.5,
    totalTce: 710.2,
    yoy: '-5.2%',
    mom: '-1.0%',
  },
  {
    id: 'SB-05',
    unitId: 'ws_sb_kj',
    unitName: '康嘉互感器',
    company: '沈变公司',
    totalElec: 165.0,
    gridElec: 105.0,
    solarElec: 60.0,
    greenElecRatio: 36.4,
    gasM3: 4.8,
    waterM3: 0.72,
    steamT: 45.0,
    oilLiter: 110,
    liquidNitrogenT: 1.1,
    totalTce: 479.0,
    yoy: '-4.5%',
    mom: '-0.6%',
  },
  {
    id: 'SB-06',
    unitId: 'ws_sb_yn',
    unitName: '印能公司',
    company: '沈变公司',
    totalElec: 125.0,
    gridElec: 80.0,
    solarElec: 45.0,
    greenElecRatio: 36.0,
    gasM3: 3.5,
    waterM3: 0.55,
    steamT: 30.0,
    oilLiter: 90,
    liquidNitrogenT: 0.8,
    totalTce: 360.4,
    yoy: '-3.9%',
    mom: '-0.4%',
  },

  // --- 衡变公司 ---
  {
    id: 'HB-01',
    unitId: 'ws_hb_main',
    unitName: '衡变本部',
    company: '衡变公司',
    totalElec: 780.0,
    gridElec: 491.0,
    solarElec: 289.0,
    greenElecRatio: 37.1,
    gasM3: 29.0,
    waterM3: 4.26,
    steamT: 390.0,
    oilLiter: 580,
    liquidNitrogenT: 5.8,
    totalTce: 6240.6,
    yoy: '-5.9%',
    mom: '-1.1%',
  },
  {
    id: 'HB-02',
    unitId: 'ws_hb_kg',
    unitName: '云集高压开关',
    company: '衡变公司',
    totalElec: 320.0,
    gridElec: 195.0,
    solarElec: 125.0,
    greenElecRatio: 39.1,
    gasM3: 11.5,
    waterM3: 1.85,
    steamT: 180.0,
    oilLiter: 240,
    liquidNitrogenT: 2.4,
    totalTce: 2304.2,
    yoy: '-5.0%',
    mom: '-0.5%',
  },
  {
    id: 'HB-03',
    unitId: 'ws_hb_nj',
    unitName: '南京电研',
    company: '衡变公司',
    totalElec: 195.0,
    gridElec: 115.0,
    solarElec: 80.0,
    greenElecRatio: 41.0,
    gasM3: 6.8,
    waterM3: 1.05,
    steamT: 120.0,
    oilLiter: 130,
    liquidNitrogenT: 1.4,
    totalTce: 1395.8,
    yoy: '-5.4%',
    mom: '-0.9%',
  },

  // --- 新变厂 ---
  {
    id: 'XB-01',
    unitId: 'ws_xb_uhv',
    unitName: '超高压公司',
    company: '新变厂',
    totalElec: 920.0,
    gridElec: 510.0,
    solarElec: 410.0,
    greenElecRatio: 44.6,
    gasM3: 35.0,
    waterM3: 5.60,
    steamT: 460.0,
    oilLiter: 750,
    liquidNitrogenT: 7.2,
    totalTce: 5150.2,
    yoy: '-5.5%',
    mom: '-0.8%',
  },
  {
    id: 'XB-02',
    unitId: 'ws_xb_tb',
    unitName: '天变公司',
    company: '新变厂',
    totalElec: 480.0,
    gridElec: 285.0,
    solarElec: 195.0,
    greenElecRatio: 40.6,
    gasM3: 16.5,
    waterM3: 2.65,
    steamT: 280.0,
    oilLiter: 360,
    liquidNitrogenT: 3.5,
    totalTce: 3610.1,
    yoy: '-5.3%',
    mom: '-1.0%',
  },

  // --- 鲁缆公司 ---
  {
    id: 'LL-01',
    unitId: 'ws_ll_main',
    unitName: '鲁缆本部',
    company: '鲁缆公司',
    totalElec: 680.0,
    gridElec: 470.0,
    solarElec: 210.0,
    greenElecRatio: 30.9,
    gasM3: 21.0,
    waterM3: 3.84,
    steamT: 280.0,
    oilLiter: 520,
    liquidNitrogenT: 5.5,
    totalTce: 4880.5,
    yoy: '-5.2%',
    mom: '-1.4%',
  },
  {
    id: 'LL-02',
    unitId: 'ws_ll_zl',
    unitName: '智缆公司',
    company: '鲁缆公司',
    totalElec: 240.0,
    gridElec: 160.0,
    solarElec: 80.0,
    greenElecRatio: 33.3,
    gasM3: 8.2,
    waterM3: 1.45,
    steamT: 110.0,
    oilLiter: 180,
    liquidNitrogenT: 1.8,
    totalTce: 1420.0,
    yoy: '-4.8%',
    mom: '-0.9%',
  },
  {
    id: 'LL-03',
    unitId: 'ws_ll_sg',
    unitName: '曙光公司',
    company: '鲁缆公司',
    totalElec: 185.0,
    gridElec: 120.0,
    solarElec: 65.0,
    greenElecRatio: 35.1,
    gasM3: 6.4,
    waterM3: 1.10,
    steamT: 90.0,
    oilLiter: 140,
    liquidNitrogenT: 1.3,
    totalTce: 1080.0,
    yoy: '-5.1%',
    mom: '-1.1%',
  },

  // --- 新缆厂 ---
  {
    id: 'XL-01',
    unitId: 'ws_xl_main',
    unitName: '特变电工新疆电缆有限公司',
    company: '新缆厂',
    totalElec: 490.0,
    gridElec: 310.0,
    solarElec: 180.0,
    greenElecRatio: 36.7,
    gasM3: 15.0,
    waterM3: 2.68,
    steamT: 190.0,
    oilLiter: 360,
    liquidNitrogenT: 4.8,
    totalTce: 3740.2,
    yoy: '-5.1%',
    mom: '-0.9%',
  },
  {
    id: 'XL-02',
    unitId: 'ws_xl_sub',
    unitName: '特变电工新疆线缆厂',
    company: '新缆厂',
    totalElec: 310.0,
    gridElec: 190.0,
    solarElec: 120.0,
    greenElecRatio: 38.7,
    gasM3: 9.8,
    waterM3: 1.75,
    steamT: 170.0,
    oilLiter: 220,
    liquidNitrogenT: 2.2,
    totalTce: 2100.0,
    yoy: '-4.9%',
    mom: '-0.8%',
  },

  // --- 德缆公司 ---
  {
    id: 'DL-01',
    unitId: 'ws_dl_main',
    unitName: '特变电工（德阳）电缆股份有限公司',
    company: '德缆公司',
    totalElec: 430.0,
    gridElec: 280.0,
    solarElec: 150.0,
    greenElecRatio: 34.9,
    gasM3: 12.0,
    waterM3: 2.45,
    steamT: 150.0,
    oilLiter: 320,
    liquidNitrogenT: 4.0,
    totalTce: 5210.4,
    yoy: '-4.1%',
    mom: '+0.3%',
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

  // 时间维度与范围
  const [timeDim, setTimeDim] = useState<'month' | 'quarter' | 'year'>('month')
  const [selectedMonthRange, setSelectedMonthRange] = useState({ start: '2026-01', end: '2026-08' })
  const [selectedQuarter, setSelectedQuarter] = useState('2026-Q3')
  const [selectedYear, setSelectedYear] = useState('2026')

  const [mediumFilter, setMediumFilter] = useState<'all' | 'elec' | 'gas' | 'water' | 'steam' | 'oil' | 'nitrogen'>('all')
  const [searchKw, setSearchKw] = useState('')

  // 组织树与关键词联动过滤
  const filteredRows = useMemo(() => {
    let rows = [...ALL_USAGE_ROWS]

    if (selectedNode.id !== 'group_root' && selectedNode.id !== 'ent_root' && selectedNode.id !== 'park_root') {
      const matchKey = selectedNode.name.slice(0, 2)
      const matched = rows.filter((r) => {
        return (
          r.unitId === selectedNode.id ||
          r.unitName.includes(selectedNode.name) ||
          selectedNode.name.includes(r.unitName) ||
          r.company.includes(matchKey) ||
          r.unitName.includes(matchKey)
        )
      })
      if (matched.length > 0) {
        rows = matched
      } else {
        rows = rows.filter((r) => r.company.includes(matchKey))
      }
    }

    if (searchKw.trim()) {
      const kw = searchKw.toLowerCase()
      rows = rows.filter((r) => r.unitName.toLowerCase().includes(kw) || r.company.toLowerCase().includes(kw))
    }
    return rows
  }, [selectedNode, searchKw])

  const totals = useMemo(() => {
    const sum = filteredRows.reduce(
      (acc, r) => {
        acc.totalElec += r.totalElec
        acc.gridElec += r.gridElec
        acc.solarElec += r.solarElec
        acc.gasM3 += r.gasM3
        acc.waterM3 += r.waterM3
        acc.steamT += r.steamT
        acc.oilLiter += r.oilLiter
        acc.liquidNitrogenT += r.liquidNitrogenT
        acc.totalTce += r.totalTce
        return acc
      },
      {
        totalElec: 0,
        gridElec: 0,
        solarElec: 0,
        gasM3: 0,
        waterM3: 0,
        steamT: 0,
        oilLiter: 0,
        liquidNitrogenT: 0,
        totalTce: 0,
      },
    )
    const avgGreenRatio = sum.totalElec > 0 ? Number(((sum.solarElec / sum.totalElec) * 100).toFixed(1)) : 0
    return { ...sum, greenElecRatio: avgGreenRatio }
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

          {/* 工具栏 */}
          <div className="flex flex-wrap items-center gap-2">
            {/* 时间维度切换 */}
            <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setTimeDim('month')}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
                  timeDim === 'month' ? 'font-bold bg-white text-[#1677ff] shadow-xs' : 'text-slate-600 hover:text-slate-900',
                )}
              >
                月度
              </button>
              <button
                type="button"
                onClick={() => setTimeDim('quarter')}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
                  timeDim === 'quarter' ? 'font-bold bg-white text-[#1677ff] shadow-xs' : 'text-slate-600 hover:text-slate-900',
                )}
              >
                季度
              </button>
              <button
                type="button"
                onClick={() => setTimeDim('year')}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
                  timeDim === 'year' ? 'font-bold bg-white text-[#1677ff] shadow-xs' : 'text-slate-600 hover:text-slate-900',
                )}
              >
                年度
              </button>
            </div>

            {/* 时间范围选择控件 */}
            {timeDim === 'month' && (
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs shadow-2xs font-mono">
                <Calendar className="size-3.5 text-slate-400 shrink-0" />
                <input
                  type="month"
                  value={selectedMonthRange.start}
                  onChange={(e) => setSelectedMonthRange((prev) => ({ ...prev, start: e.target.value }))}
                  className="bg-transparent border-0 text-slate-700 text-xs focus:outline-none cursor-pointer"
                  title="起始月份"
                />
                <span className="text-slate-400 font-sans">至</span>
                <input
                  type="month"
                  value={selectedMonthRange.end}
                  onChange={(e) => setSelectedMonthRange((prev) => ({ ...prev, end: e.target.value }))}
                  className="bg-transparent border-0 text-slate-700 text-xs focus:outline-none cursor-pointer"
                  title="结束月份"
                />
              </div>
            )}

            {timeDim === 'quarter' && (
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs shadow-2xs">
                <Calendar className="size-3.5 text-slate-400 shrink-0" />
                <select
                  value={selectedQuarter}
                  onChange={(e) => setSelectedQuarter(e.target.value)}
                  className="bg-transparent border-0 text-slate-700 text-xs font-mono font-medium focus:outline-none cursor-pointer pr-1"
                >
                  <option value="2026-Q1">2026年 第1季度 (Q1)</option>
                  <option value="2026-Q2">2026年 第2季度 (Q2)</option>
                  <option value="2026-Q3">2026年 第3季度 (Q3)</option>
                  <option value="2026-Q4">2026年 第4季度 (Q4)</option>
                  <option value="2025-Q4">2025年 第4季度 (Q4)</option>
                </select>
              </div>
            )}

            {timeDim === 'year' && (
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs shadow-2xs">
                <Calendar className="size-3.5 text-slate-400 shrink-0" />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="bg-transparent border-0 text-slate-700 text-xs font-mono font-medium focus:outline-none cursor-pointer pr-1"
                >
                  <option value="2026">2026 年度</option>
                  <option value="2025">2025 年度</option>
                  <option value="2024">2024 年度</option>
                </select>
              </div>
            )}

            <button
              onClick={() => alert(`正在导出【${selectedNode.name}】用能报表 (Excel/PDF)...`)}
              className="h-8 px-3 rounded-lg bg-[#1677ff] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-blue-600 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="size-3.5" />
              <span>导出</span>
            </button>
          </div>
        </div>

        {/* 主数据报表 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          {/* 操作过滤栏 */}
          <div className="p-2.5 border-b border-slate-200 bg-[#fafbfc] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">能源介质筛选：</span>
              <select
                value={mediumFilter}
                onChange={(e) => setMediumFilter(e.target.value as any)}
                className="h-8 px-2.5 text-xs bg-white border border-slate-200 rounded-md text-slate-700 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="all">全部能源介质 (8类)</option>
                <option value="elec">电力消费 (总电/市电/绿电)</option>
                <option value="gas">天然气</option>
                <option value="water">工业用水</option>
                <option value="steam">外购蒸汽</option>
                <option value="oil">柴油/油耗</option>
                <option value="nitrogen">液氮消耗</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchKw}
                  onChange={(e) => setSearchKw(e.target.value)}
                  placeholder="搜索制造单位/车间..."
                  className="h-8 pl-8 pr-2.5 text-xs bg-white border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:border-blue-500 w-60"
                />
              </div>
            </div>
          </div>

          {/* 表格区域 */}
          <div className="overflow-x-auto custom-scrollbar">
            {filteredRows.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                <div>所选单位【{selectedNode.name}】暂无用能数据</div>
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-bold select-none">
                    <th className="py-2.5 px-3 sticky left-0 bg-slate-50 z-10 min-w-[160px]">制造单位 / 车间</th>
                    {(mediumFilter === 'all' || mediumFilter === 'elec') && (
                      <>
                        <th className="py-2.5 px-3 text-right">总用电量 (万kWh)</th>
                        <th className="py-2.5 px-3 text-right">市网用电 (万kWh)</th>
                        <th className="py-2.5 px-3 text-right text-emerald-600">直供绿电 (万kWh)</th>
                        <th className="py-2.5 px-3 text-right text-emerald-700">绿电占比 (%)</th>
                      </>
                    )}
                    {(mediumFilter === 'all' || mediumFilter === 'gas') && (
                      <th className="py-2.5 px-3 text-right">天然气量 (万m³)</th>
                    )}
                    {(mediumFilter === 'all' || mediumFilter === 'water') && (
                      <th className="py-2.5 px-3 text-right">工业用水 (万m³)</th>
                    )}
                    {(mediumFilter === 'all' || mediumFilter === 'steam') && (
                      <th className="py-2.5 px-3 text-right">外购蒸汽 (t)</th>
                    )}
                    {(mediumFilter === 'all' || mediumFilter === 'oil') && (
                      <th className="py-2.5 px-3 text-right">柴油/油耗 (L)</th>
                    )}
                    {(mediumFilter === 'all' || mediumFilter === 'nitrogen') && (
                      <th className="py-2.5 px-3 text-right">液氮消耗 (t)</th>
                    )}
                    <th className="py-2.5 px-3 text-right font-bold text-slate-900 bg-blue-50/40">
                      综合能耗 (tce)
                    </th>
                    <th className="py-2.5 px-3 text-center">同比变动</th>
                    <th className="py-2.5 px-3 text-center">环比变动</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11.5px]">
                  {filteredRows.map((r) => (
                    <tr key={r.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-2.5 px-3 sticky left-0 bg-white font-sans font-semibold text-slate-900">
                        {r.unitName}
                      </td>
                      {(mediumFilter === 'all' || mediumFilter === 'elec') && (
                        <>
                          <td className="py-2.5 px-3 text-right tabular-nums font-bold">
                            {r.totalElec.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                          </td>
                          <td className="py-2.5 px-3 text-right tabular-nums">
                            {r.gridElec.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                          </td>
                          <td className="py-2.5 px-3 text-right tabular-nums text-emerald-600 font-bold">
                            {r.solarElec.toFixed(1)}
                          </td>
                          <td className="py-2.5 px-3 text-right tabular-nums text-emerald-700 font-bold">
                            {r.greenElecRatio.toFixed(1)}%
                          </td>
                        </>
                      )}
                      {(mediumFilter === 'all' || mediumFilter === 'gas') && (
                        <td className="py-2.5 px-3 text-right tabular-nums">
                          {r.gasM3.toFixed(1)}
                        </td>
                      )}
                      {(mediumFilter === 'all' || mediumFilter === 'water') && (
                        <td className="py-2.5 px-3 text-right tabular-nums">
                          {r.waterM3.toFixed(2)}
                        </td>
                      )}
                      {(mediumFilter === 'all' || mediumFilter === 'steam') && (
                        <td className="py-2.5 px-3 text-right tabular-nums">
                          {r.steamT.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                        </td>
                      )}
                      {(mediumFilter === 'all' || mediumFilter === 'oil') && (
                        <td className="py-2.5 px-3 text-right tabular-nums">
                          {r.oilLiter.toLocaleString()}
                        </td>
                      )}
                      {(mediumFilter === 'all' || mediumFilter === 'nitrogen') && (
                        <td className="py-2.5 px-3 text-right tabular-nums">
                          {r.liquidNitrogenT.toFixed(1)}
                        </td>
                      )}
                      <td className="py-2.5 px-3 text-right font-bold text-blue-700 bg-blue-50/40 tabular-nums">
                        {r.totalTce.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                      </td>
                      <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">
                        {r.yoy}
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-600">
                        {r.mom}
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* 汇总行 */}
                <tfoot>
                  <tr className="bg-slate-100/90 font-bold text-slate-900 border-t-2 border-slate-300">
                    <td className="py-2.5 px-3 sticky left-0 bg-slate-100 font-sans">
                      全集团总计汇总
                    </td>
                    {(mediumFilter === 'all' || mediumFilter === 'elec') && (
                      <>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                          {totals.totalElec.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                          {totals.gridElec.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-emerald-700 tabular-nums">
                          {totals.solarElec.toFixed(1)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-emerald-700 tabular-nums">
                          {totals.greenElecRatio.toFixed(1)}%
                        </td>
                      </>
                    )}
                    {(mediumFilter === 'all' || mediumFilter === 'gas') && (
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                        {totals.gasM3.toFixed(1)}
                      </td>
                    )}
                    {(mediumFilter === 'all' || mediumFilter === 'water') && (
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                        {totals.waterM3.toFixed(2)}
                      </td>
                    )}
                    {(mediumFilter === 'all' || mediumFilter === 'steam') && (
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                        {totals.steamT.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                      </td>
                    )}
                    {(mediumFilter === 'all' || mediumFilter === 'oil') && (
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                        {totals.oilLiter.toLocaleString()}
                      </td>
                    )}
                    {(mediumFilter === 'all' || mediumFilter === 'nitrogen') && (
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                        {totals.liquidNitrogenT.toFixed(1)}
                      </td>
                    )}
                    <td className="py-2.5 px-3 text-right font-mono text-blue-700 bg-blue-100/60 tabular-nums">
                      {totals.totalTce.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                    </td>
                    <td className="py-2.5 px-3 text-center text-emerald-700">-5.8%</td>
                    <td className="py-2.5 px-3 text-center text-slate-700">-1.0%</td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
