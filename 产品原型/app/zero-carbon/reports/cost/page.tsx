'use client'

import { useState, useMemo } from 'react'
import {
  Download,
  Calendar,
  Coins,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SearchableUnitSelect } from '@/components/shared/searchable-unit-select'

interface CostRow {
  id: string
  unitId: string
  unitName: string
  company: string
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

const ALL_COST_ROWS: CostRow[] = [
  // --- 沈变公司 ---
  {
    id: 'SB-01',
    unitId: 'ws_sb_main',
    unitName: '沈变本部',
    company: '沈变公司',
    tipElec: 680.5,
    peakElec: 1240.0,
    flatElec: 890.0,
    valleyElec: 480.0,
    gasCost: 238.4,
    waterCost: 12.8,
    steamCost: 84.0,
    greenDeduct: -320.0,
    netCost: 3305.7,
    avgPrice: '0.560 元',
  },
  {
    id: 'SB-02',
    unitId: 'ws_sb_luna',
    unitName: '露娜公司 (特变电工露娜智能)',
    company: '沈变公司',
    tipElec: 160.0,
    peakElec: 310.0,
    flatElec: 220.0,
    valleyElec: 120.0,
    gasCost: 51.0,
    waterCost: 2.8,
    steamCost: 18.0,
    greenDeduct: -75.0,
    netCost: 806.8,
    avgPrice: '0.562 元',
  },
  {
    id: 'SB-03',
    unitId: 'ws_sb_zh',
    unitName: '智慧能源',
    company: '沈变公司',
    tipElec: 85.0,
    peakElec: 160.0,
    flatElec: 110.0,
    valleyElec: 60.0,
    gasCost: 25.0,
    waterCost: 1.4,
    steamCost: 9.5,
    greenDeduct: -42.0,
    netCost: 408.9,
    avgPrice: '0.558 元',
  },
  {
    id: 'SB-04',
    unitId: 'ws_sb_hx',
    unitName: '和新套管公司',
    company: '沈变公司',
    tipElec: 70.0,
    peakElec: 130.0,
    flatElec: 90.0,
    valleyElec: 50.0,
    gasCost: 18.0,
    waterCost: 0.8,
    steamCost: 8.0,
    greenDeduct: -26.0,
    netCost: 340.8,
    avgPrice: '0.564 元',
  },
  {
    id: 'SB-05',
    unitId: 'ws_sb_kj',
    unitName: '康嘉互感器',
    company: '沈变公司',
    tipElec: 55.0,
    peakElec: 105.0,
    flatElec: 75.0,
    valleyElec: 40.0,
    gasCost: 14.5,
    waterCost: 0.6,
    steamCost: 5.0,
    greenDeduct: -19.0,
    netCost: 276.1,
    avgPrice: '0.561 元',
  },
  {
    id: 'SB-06',
    unitId: 'ws_sb_yn',
    unitName: '印能公司',
    company: '沈变公司',
    tipElec: 42.0,
    peakElec: 80.0,
    flatElec: 55.0,
    valleyElec: 30.0,
    gasCost: 10.5,
    waterCost: 0.5,
    steamCost: 3.5,
    greenDeduct: -15.0,
    netCost: 206.5,
    avgPrice: '0.559 元',
  },

  // --- 衡变公司 ---
  {
    id: 'HB-01',
    unitId: 'ws_hb_main',
    unitName: '衡变本部',
    company: '衡变公司',
    tipElec: 620.0,
    peakElec: 1150.0,
    flatElec: 820.0,
    valleyElec: 440.0,
    gasCost: 196.7,
    waterCost: 11.2,
    steamCost: 68.0,
    greenDeduct: -290.0,
    netCost: 3015.9,
    avgPrice: '0.552 元',
  },
  {
    id: 'HB-02',
    unitId: 'ws_hb_kg',
    unitName: '云集高压开关',
    company: '衡变公司',
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
  {
    id: 'HB-03',
    unitId: 'ws_hb_nj',
    unitName: '南京电研',
    company: '衡变公司',
    tipElec: 120.0,
    peakElec: 230.0,
    flatElec: 160.0,
    valleyElec: 90.0,
    gasCost: 45.0,
    waterCost: 2.5,
    steamCost: 12.0,
    greenDeduct: -55.0,
    netCost: 604.5,
    avgPrice: '0.556 元',
  },

  // --- 新变厂 ---
  {
    id: 'XB-01',
    unitId: 'ws_xb_uhv',
    unitName: '超高压公司',
    company: '新变厂',
    tipElec: 510.0,
    peakElec: 950.0,
    flatElec: 680.0,
    valleyElec: 360.0,
    gasCost: 148.8,
    waterCost: 8.0,
    steamCost: 57.0,
    greenDeduct: -210.0,
    netCost: 2503.8,
    avgPrice: '0.551 元',
  },
  {
    id: 'XB-02',
    unitId: 'ws_xb_tb',
    unitName: '天变公司',
    company: '新变厂',
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

  // --- 鲁缆公司 ---
  {
    id: 'LL-01',
    unitId: 'ws_ll_main',
    unitName: '鲁缆本部',
    company: '鲁缆公司',
    tipElec: 450.0,
    peakElec: 820.0,
    flatElec: 580.0,
    valleyElec: 320.0,
    gasCost: 147.0,
    waterCost: 8.5,
    steamCost: 42.0,
    greenDeduct: -200.0,
    netCost: 2167.5,
    avgPrice: '0.562 元',
  },
  {
    id: 'LL-02',
    unitId: 'ws_ll_zl',
    unitName: '智缆公司',
    company: '鲁缆公司',
    tipElec: 140.0,
    peakElec: 260.0,
    flatElec: 180.0,
    valleyElec: 100.0,
    gasCost: 42.0,
    waterCost: 2.2,
    steamCost: 11.0,
    greenDeduct: -60.0,
    netCost: 675.2,
    avgPrice: '0.560 元',
  },
  {
    id: 'LL-03',
    unitId: 'ws_ll_sg',
    unitName: '曙光公司',
    company: '鲁缆公司',
    tipElec: 110.0,
    peakElec: 210.0,
    flatElec: 150.0,
    valleyElec: 80.0,
    gasCost: 35.0,
    waterCost: 1.8,
    steamCost: 9.0,
    greenDeduct: -48.0,
    netCost: 547.8,
    avgPrice: '0.561 元',
  },

  // --- 新缆厂 ---
  {
    id: 'XL-01',
    unitId: 'ws_xl_main',
    unitName: '特变电工新疆电缆有限公司',
    company: '新缆厂',
    tipElec: 340.0,
    peakElec: 630.0,
    flatElec: 460.0,
    valleyElec: 250.0,
    gasCost: 122.5,
    waterCost: 6.8,
    steamCost: 31.0,
    greenDeduct: -155.0,
    netCost: 1685.3,
    avgPrice: '0.563 元',
  },
  {
    id: 'XL-02',
    unitId: 'ws_xl_sub',
    unitName: '特变电工新疆线缆厂',
    company: '新缆厂',
    tipElec: 180.0,
    peakElec: 350.0,
    flatElec: 250.0,
    valleyElec: 140.0,
    gasCost: 66.5,
    waterCost: 3.7,
    steamCost: 17.0,
    greenDeduct: -85.0,
    netCost: 922.2,
    avgPrice: '0.565 元',
  },

  // --- 德缆公司 ---
  {
    id: 'DL-01',
    unitId: 'ws_dl_main',
    unitName: '特变电工（德阳）电缆股份有限公司',
    company: '德缆公司',
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
]

export default function CostReportPage() {
  // 时间维度与范围
  const [timeDim, setTimeDim] = useState<'month' | 'quarter' | 'year'>('month')
  const [selectedMonthRange, setSelectedMonthRange] = useState({ start: '2026-01', end: '2026-08' })
  const [selectedQuarter, setSelectedQuarter] = useState('2026-Q3')
  const [selectedYear, setSelectedYear] = useState('2026')

  const [companyFilter, setCompanyFilter] = useState<string>('all')
  const [unitFilter, setUnitFilter] = useState<string>('all')

  // 获取所有企业列表
  const allCompanies = useMemo(() => {
    return Array.from(new Set(ALL_COST_ROWS.map((r) => r.company)))
  }, [])

  // 联动获取单位列表
  const availableUnits = useMemo(() => {
    if (companyFilter === 'all') {
      return ALL_COST_ROWS.map((r) => ({ id: r.unitId, name: r.unitName, company: r.company }))
    }
    return ALL_COST_ROWS
      .filter((r) => r.company === companyFilter)
      .map((r) => ({ id: r.unitId, name: r.unitName, company: r.company }))
  }, [companyFilter])

  // 联动过滤
  const filteredRows = useMemo(() => {
    let rows = [...ALL_COST_ROWS]

    // 1. 企业过滤
    if (companyFilter !== 'all') {
      rows = rows.filter((r) => r.company === companyFilter)
    }

    // 2. 单位过滤
    if (unitFilter !== 'all') {
      rows = rows.filter((r) => r.unitName === unitFilter || r.unitId === unitFilter)
    }

    return rows
  }, [companyFilter, unitFilter])

  // 预计算相同公司的 rowSpan 合并信息
  const companyRowSpans = useMemo(() => {
    const spans: number[] = []
    let i = 0
    while (i < filteredRows.length) {
      let span = 1
      while (i + span < filteredRows.length && filteredRows[i + span].company === filteredRows[i].company) {
        span++
      }
      spans[i] = span
      for (let k = 1; k < span; k++) {
        spans[i + k] = 0
      }
      i += span
    }
    return spans
  }, [filteredRows])

  const totals = useMemo(() => {
    return filteredRows.reduce(
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
  }, [filteredRows])

  return (
    <div className="flex flex-col gap-3.5 w-full font-sans">
      {/* 顶部面包屑与操作栏 */}
      <div className="bg-card p-3.5 rounded-xl border border-border shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0">
            <Coins className="size-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">成本报表 (财务级对账单)</h1>
          </div>
        </div>

        {/* 工具栏 */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 时间维度切换 */}
          <div className="flex rounded-lg border border-border bg-panel p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setTimeDim('month')}
              className={cn(
                'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
                timeDim === 'month' ? 'font-bold bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              月度
            </button>
            <button
              type="button"
              onClick={() => setTimeDim('quarter')}
              className={cn(
                'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
                timeDim === 'quarter' ? 'font-bold bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              季度
            </button>
            <button
              type="button"
              onClick={() => setTimeDim('year')}
              className={cn(
                'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
                timeDim === 'year' ? 'font-bold bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              年度
            </button>
          </div>

          {/* 时间范围选择控件 */}
          {timeDim === 'month' && (
            <div className="flex items-center gap-1.5 bg-panel px-2.5 py-1 rounded-lg border border-border text-xs shadow-2xs font-mono">
              <Calendar className="size-3.5 text-muted-foreground shrink-0" />
              <input
                type="month"
                value={selectedMonthRange.start}
                onChange={(e) => setSelectedMonthRange((prev) => ({ ...prev, start: e.target.value }))}
                className="bg-transparent border-0 text-foreground text-xs focus:outline-none cursor-pointer"
                title="起始月份"
              />
              <span className="text-muted-foreground font-sans">至</span>
              <input
                type="month"
                value={selectedMonthRange.end}
                onChange={(e) => setSelectedMonthRange((prev) => ({ ...prev, end: e.target.value }))}
                className="bg-transparent border-0 text-foreground text-xs focus:outline-none cursor-pointer"
                title="结束月份"
              />
            </div>
          )}

          {timeDim === 'quarter' && (
            <div className="flex items-center gap-1.5 bg-panel px-2.5 py-1 rounded-lg border border-border text-xs shadow-2xs">
              <Calendar className="size-3.5 text-muted-foreground shrink-0" />
              <select
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value)}
                className="bg-panel border-0 text-foreground text-xs font-mono font-medium focus:outline-none cursor-pointer pr-1"
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
            <div className="flex items-center gap-1.5 bg-panel px-2.5 py-1 rounded-lg border border-border text-xs shadow-2xs">
              <Calendar className="size-3.5 text-muted-foreground shrink-0" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-panel border-0 text-foreground text-xs font-mono font-medium focus:outline-none cursor-pointer pr-1"
              >
                <option value="2026">2026 年度</option>
                <option value="2025">2025 年度</option>
                <option value="2024">2024 年度</option>
              </select>
            </div>
          )}

          <button
            onClick={() => alert('正在导出能源成本财务对账单 (Excel/PDF)...')}
            className="h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 hover:bg-primary/90 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="size-3.5" />
            <span>导出</span>
          </button>
        </div>
      </div>

      {/* 主数据报表 */}
      <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden flex flex-col">
        {/* 操作搜索栏 */}
        <div className="p-2.5 border-b border-border/60 bg-panel flex flex-wrap items-center justify-between gap-3 font-sans">
          <div className="flex flex-wrap items-center gap-3">
            {/* 企业下拉筛选 */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-foreground whitespace-nowrap">所属企业：</span>
              <select
                value={companyFilter}
                onChange={(e) => {
                  setCompanyFilter(e.target.value)
                  setUnitFilter('all') // 联动重置下属单位
                }}
                className="h-8 px-2.5 rounded-lg border border-border bg-panel text-xs text-foreground font-medium focus:outline-none focus:border-primary shadow-2xs cursor-pointer"
              >
                <option value="all">全部所属企业</option>
                {allCompanies.map((comp) => (
                  <option key={comp} value={comp}>
                    {comp}
                  </option>
                ))}
              </select>
            </div>

            {/* 单位下拉筛选 (带顶部模糊匹配搜索框，与企业联动) */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-foreground whitespace-nowrap">所属单位：</span>
              <SearchableUnitSelect
                options={availableUnits}
                value={unitFilter}
                onChange={(val) => setUnitFilter(val)}
                placeholder="全部所属单位"
              />
            </div>
          </div>
        </div>

        {/* 表格区域 */}
        <div className="overflow-x-auto custom-scrollbar">
          {filteredRows.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground text-xs flex flex-col items-center gap-2">
              <div>暂无匹配的成本报表数据</div>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-panel text-muted-foreground border-b border-border font-bold select-none font-sans">
                  <th className="py-2.5 px-3 sticky left-0 bg-panel z-10 min-w-[130px] border-r border-border/60">企业名称</th>
                  <th className="py-2.5 px-3 min-w-[150px]">单位名称</th>
                  <th className="py-2.5 px-3 text-right">尖段电费 (万元)</th>
                  <th className="py-2.5 px-3 text-right">峰段电费 (万元)</th>
                  <th className="py-2.5 px-3 text-right">平段电费 (万元)</th>
                  <th className="py-2.5 px-3 text-right">谷段电费 (万元)</th>
                  <th className="py-2.5 px-3 text-right">天然气费 (万元)</th>
                  <th className="py-2.5 px-3 text-right">水费 (万元)</th>
                  <th className="py-2.5 px-3 text-right">蒸汽热力费 (万元)</th>
                  <th className="py-2.5 px-3 text-right text-emerald-400 font-bold">绿电省电扣减 (万元)</th>
                  <th className="py-2.5 px-3 text-right text-primary font-bold bg-accent/20">净能源成本 (万元)</th>
                  <th className="py-2.5 px-3 text-right">综合电价</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-mono text-foreground">
                {filteredRows.map((r, idx) => {
                  const span = companyRowSpans[idx]
                  return (
                    <tr key={r.id} className="hover:bg-accent/30 transition-colors">
                      {span > 0 && (
                        <td
                          rowSpan={span}
                          className="py-2.5 px-3 sticky left-0 bg-card font-sans font-bold text-foreground text-center align-middle border-r border-b border-border z-10 select-none"
                        >
                          <div className="flex items-center justify-center h-full">
                            <span className="leading-snug">{r.company}</span>
                          </div>
                        </td>
                      )}
                      <td className="py-2.5 px-3 font-sans font-bold text-foreground border-b border-border/40">
                        {r.unitName}
                      </td>
                    <td className="py-2.5 px-3 text-right text-rose-400 font-bold tabular-nums">
                      {r.tipElec.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-amber-400 tabular-nums">
                      {r.peakElec.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-muted-foreground tabular-nums">
                      {r.flatElec.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-400 tabular-nums">
                      {r.valleyElec.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-foreground">
                      {r.gasCost.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-foreground">
                      {r.waterCost.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-foreground">
                      {r.steamCost.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-400 font-bold tabular-nums">
                      {r.greenDeduct.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-primary bg-accent/20 tabular-nums">
                      {r.netCost.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-muted-foreground font-sans">
                      {r.avgPrice}
                    </td>
                  </tr>
                )})}
              </tbody>
              <tfoot className="bg-panel border-t-2 border-border font-bold text-foreground">
                <tr>
                  <td className="py-2.5 px-3 sticky left-0 bg-panel font-sans font-bold text-foreground border-r border-border" colSpan={2}>
                    全集团合计 ({filteredRows.length} 家)
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-rose-400 tabular-nums">
                    {totals.tipElec.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-amber-400 tabular-nums">
                    {totals.peakElec.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                    {totals.flatElec.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-400 tabular-nums">
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
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-400 tabular-nums">
                    {totals.greenDeduct.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-primary bg-primary/20 tabular-nums text-sm">
                    {totals.netCost.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-primary">0.558 元</td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
