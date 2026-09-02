'use client'

import { useState, useMemo } from 'react'
import {
  Download,
  Calendar,
  Globe2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CarbonRow {
  id: string
  unitId: string
  unitName: string
  company: string
  fossilCombustion: number  // 化石燃料直接燃烧 (tCO2)
  processEmission: number   // 工业生产过程排放 (tCO2)
  gridElecEmission: number  // 净购入电力排放 (tCO2)
  steamEmission: number     // 净购入蒸汽排放 (tCO2)
  pvGreenDeduct: number     // 光伏与绿电对冲 (-tCO2)
  ccerDeduct: number        // CCER/碳汇抵扣 (-tCO2)
  netEmission: number       // 净碳排放总量 (tCO2)
  yoy: string
}

const ALL_CARBON_ROWS: CarbonRow[] = [
  // --- 沈变公司 ---
  {
    id: 'SB-01',
    unitId: 'ws_sb_main',
    unitName: '沈变本部',
    company: '沈变公司',
    fossilCombustion: 1480.0,
    processEmission: 320.0,
    gridElecEmission: 30850.5,
    steamEmission: 924.0,
    pvGreenDeduct: -1050.0,
    ccerDeduct: -350.0,
    netEmission: 32174.5,
    yoy: '-6.4%',
  },
  {
    id: 'SB-02',
    unitId: 'ws_sb_luna',
    unitName: '露娜公司 (特变电工露娜智能)',
    company: '沈变公司',
    fossilCombustion: 310.0,
    processEmission: 80.0,
    gridElecEmission: 7068.0,
    steamEmission: 198.0,
    pvGreenDeduct: -250.0,
    ccerDeduct: -80.0,
    netEmission: 7326.0,
    yoy: '-5.8%',
  },
  {
    id: 'SB-03',
    unitId: 'ws_sb_zh',
    unitName: '智慧能源',
    company: '沈变公司',
    fossilCombustion: 155.0,
    processEmission: 40.0,
    gridElecEmission: 3876.0,
    steamEmission: 104.5,
    pvGreenDeduct: -140.0,
    ccerDeduct: -40.0,
    netEmission: 3995.5,
    yoy: '-4.9%',
  },
  {
    id: 'SB-04',
    unitId: 'ws_sb_hx',
    unitName: '和新套管公司',
    company: '沈变公司',
    fossilCombustion: 110.0,
    processEmission: 25.0,
    gridElecEmission: 3192.0,
    steamEmission: 88.0,
    pvGreenDeduct: -90.0,
    ccerDeduct: -30.0,
    netEmission: 3295.0,
    yoy: '-5.2%',
  },
  {
    id: 'SB-05',
    unitId: 'ws_sb_kj',
    unitName: '康嘉互感器',
    company: '沈变公司',
    fossilCombustion: 85.0,
    processEmission: 20.0,
    gridElecEmission: 2450.0,
    steamEmission: 65.0,
    pvGreenDeduct: -70.0,
    ccerDeduct: -25.0,
    netEmission: 2525.0,
    yoy: '-4.5%',
  },
  {
    id: 'SB-06',
    unitId: 'ws_sb_yn',
    unitName: '印能公司',
    company: '沈变公司',
    fossilCombustion: 65.0,
    processEmission: 15.0,
    gridElecEmission: 1860.0,
    steamEmission: 45.0,
    pvGreenDeduct: -50.0,
    ccerDeduct: -18.0,
    netEmission: 1917.0,
    yoy: '-3.9%',
  },

  // --- 衡变公司 ---
  {
    id: 'HB-01',
    unitId: 'ws_hb_main',
    unitName: '衡变本部',
    company: '衡变公司',
    fossilCombustion: 1220.0,
    processEmission: 280.0,
    gridElecEmission: 27645.0,
    steamEmission: 748.0,
    pvGreenDeduct: -920.0,
    ccerDeduct: -280.0,
    netEmission: 28693.0,
    yoy: '-5.9%',
  },
  {
    id: 'HB-02',
    unitId: 'ws_hb_kg',
    unitName: '云集高压开关',
    company: '衡变公司',
    fossilCombustion: 480.0,
    processEmission: 110.0,
    gridElecEmission: 10379.5,
    steamEmission: 198.0,
    pvGreenDeduct: -280.0,
    ccerDeduct: -90.0,
    netEmission: 10797.5,
    yoy: '-5.0%',
  },
  {
    id: 'HB-03',
    unitId: 'ws_hb_nj',
    unitName: '南京电研',
    company: '衡变公司',
    fossilCombustion: 220.0,
    processEmission: 50.0,
    gridElecEmission: 5850.0,
    steamEmission: 130.0,
    pvGreenDeduct: -160.0,
    ccerDeduct: -50.0,
    netEmission: 6040.0,
    yoy: '-5.4%',
  },

  // --- 新变厂 ---
  {
    id: 'XB-01',
    unitId: 'ws_xb_uhv',
    unitName: '超高压公司',
    company: '新变厂',
    fossilCombustion: 920.0,
    processEmission: 200.0,
    gridElecEmission: 23199.0,
    steamEmission: 627.0,
    pvGreenDeduct: -680.0,
    ccerDeduct: -200.0,
    netEmission: 24066.0,
    yoy: '-5.5%',
  },
  {
    id: 'XB-02',
    unitId: 'ws_xb_tb',
    unitName: '天变公司',
    company: '新变厂',
    fossilCombustion: 691.9,
    processEmission: 160.0,
    gridElecEmission: 16253.6,
    steamEmission: 308.0,
    pvGreenDeduct: -440.0,
    ccerDeduct: -150.0,
    netEmission: 16823.5,
    yoy: '-5.3%',
  },

  // --- 鲁缆公司 ---
  {
    id: 'LL-01',
    unitId: 'ws_ll_main',
    unitName: '鲁缆本部',
    company: '鲁缆公司',
    fossilCombustion: 880.0,
    processEmission: 200.0,
    gridElecEmission: 21888.0,
    steamEmission: 462.0,
    pvGreenDeduct: -580.0,
    ccerDeduct: -200.0,
    netEmission: 22650.0,
    yoy: '-5.2%',
  },
  {
    id: 'LL-02',
    unitId: 'ws_ll_zl',
    unitName: '智缆公司',
    company: '鲁缆公司',
    fossilCombustion: 280.0,
    processEmission: 60.0,
    gridElecEmission: 6840.0,
    steamEmission: 121.0,
    pvGreenDeduct: -180.0,
    ccerDeduct: -60.0,
    netEmission: 7061.0,
    yoy: '-4.8%',
  },
  {
    id: 'LL-03',
    unitId: 'ws_ll_sg',
    unitName: '曙光公司',
    company: '鲁缆公司',
    fossilCombustion: 210.0,
    processEmission: 45.0,
    gridElecEmission: 5120.0,
    steamEmission: 99.0,
    pvGreenDeduct: -130.0,
    ccerDeduct: -45.0,
    netEmission: 5299.0,
    yoy: '-5.1%',
  },

  // --- 新缆厂 ---
  {
    id: 'XL-01',
    unitId: 'ws_xl_main',
    unitName: '特变电工新疆电缆有限公司',
    company: '新缆厂',
    fossilCombustion: 740.0,
    processEmission: 170.0,
    gridElecEmission: 16644.0,
    steamEmission: 341.0,
    pvGreenDeduct: -450.0,
    ccerDeduct: -160.0,
    netEmission: 17285.0,
    yoy: '-5.1%',
  },
  {
    id: 'XL-02',
    unitId: 'ws_xl_sub',
    unitName: '特变电工新疆线缆厂',
    company: '新缆厂',
    fossilCombustion: 427.6,
    processEmission: 100.0,
    gridElecEmission: 9690.0,
    steamEmission: 187.0,
    pvGreenDeduct: -260.0,
    ccerDeduct: -90.0,
    netEmission: 10054.6,
    yoy: '-4.9%',
  },

  // --- 德缆公司 ---
  {
    id: 'DL-01',
    unitId: 'ws_dl_main',
    unitName: '特变电工（德阳）电缆股份有限公司',
    company: '德缆公司',
    fossilCombustion: 1005.4,
    processEmission: 230.0,
    gridElecEmission: 23496.4,
    steamEmission: 429.0,
    pvGreenDeduct: -630.0,
    ccerDeduct: -200.0,
    netEmission: 24330.8,
    yoy: '-4.1%',
  },
]

export default function CarbonReportPage() {
  // 时间维度与范围
  const [timeDim, setTimeDim] = useState<'month' | 'quarter' | 'year'>('month')
  const [selectedMonthRange, setSelectedMonthRange] = useState({ start: '2026-01', end: '2026-08' })
  const [selectedQuarter, setSelectedQuarter] = useState('2026-Q3')
  const [selectedYear, setSelectedYear] = useState('2026')

  const [companyFilter, setCompanyFilter] = useState<string>('all')
  const [unitFilter, setUnitFilter] = useState<string>('all')

  // 获取所有企业列表
  const allCompanies = useMemo(() => {
    return Array.from(new Set(ALL_CARBON_ROWS.map((r) => r.company)))
  }, [])

  // 联动获取单位列表
  const availableUnits = useMemo(() => {
    if (companyFilter === 'all') {
      return ALL_CARBON_ROWS.map((r) => ({ id: r.unitId, name: r.unitName, company: r.company }))
    }
    return ALL_CARBON_ROWS
      .filter((r) => r.company === companyFilter)
      .map((r) => ({ id: r.unitId, name: r.unitName, company: r.company }))
  }, [companyFilter])

  // 联动过滤
  const filteredRows = useMemo(() => {
    let rows = [...ALL_CARBON_ROWS]

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
  }, [filteredRows])

  return (
    <div className="flex flex-col gap-3.5 w-full font-sans">
      {/* 顶部面包屑与操作栏 */}
      <div className="bg-card p-3.5 rounded-xl border border-border shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0">
            <Globe2 className="size-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">碳排报表</h1>
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
            onClick={() => alert('正在导出碳排履约核算报表 (Excel/PDF)...')}
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

            {/* 单位下拉筛选 (与企业联动) */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-foreground whitespace-nowrap">所属单位：</span>
              <select
                value={unitFilter}
                onChange={(e) => setUnitFilter(e.target.value)}
                className="h-8 px-2.5 rounded-lg border border-border bg-panel text-xs text-foreground font-medium focus:outline-none focus:border-primary shadow-2xs max-w-[220px] cursor-pointer"
              >
                <option value="all">全部所属单位</option>
                {availableUnits.map((u) => (
                  <option key={u.id} value={u.name}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 表格区域 */}
        <div className="overflow-x-auto custom-scrollbar">
          {filteredRows.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground text-xs flex flex-col items-center gap-2">
              <div>暂无匹配的碳排报表数据</div>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-panel text-muted-foreground border-b border-border font-bold select-none font-sans">
                  <th className="py-2.5 px-3 sticky left-0 bg-panel z-10 min-w-[130px] border-r border-border/60">企业名称</th>
                  <th className="py-2.5 px-3 min-w-[150px]">单位名称</th>
                  <th className="py-2.5 px-3 text-right">化石燃料燃烧 (tCO₂)</th>
                  <th className="py-2.5 px-3 text-right">工业过程排放 (tCO₂)</th>
                  <th className="py-2.5 px-3 text-right">净购入电力 (tCO₂)</th>
                  <th className="py-2.5 px-3 text-right">净购入蒸汽 (tCO₂)</th>
                  <th className="py-2.5 px-3 text-right text-emerald-400 font-bold">光伏/绿电对冲</th>
                  <th className="py-2.5 px-3 text-right text-emerald-400 font-bold">CCER/碳汇核减</th>
                  <th className="py-2.5 px-3 text-right font-bold text-foreground bg-accent/20">
                    净碳排放总量 (tCO₂)
                  </th>
                  <th className="py-2.5 px-3 text-center">同比变动</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-foreground font-mono text-[11.5px]">
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
                      <td className="py-2.5 px-3 font-sans font-semibold text-foreground border-b border-border/40">
                        {r.unitName}
                      </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-foreground">
                      {r.fossilCombustion.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-foreground">
                      {r.processEmission.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-foreground">
                      {r.gridElecEmission.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-foreground">
                      {r.steamEmission.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-400 font-bold tabular-nums">
                      {r.pvGreenDeduct.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-400 font-bold tabular-nums">
                      {r.ccerDeduct.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-primary bg-accent/20 tabular-nums">
                      {r.netEmission.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                    </td>
                    <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">
                      {r.yoy}
                    </td>
                  </tr>
                )})}
              </tbody>
              {/* 汇总行 */}
              <tfoot>
                <tr className="bg-panel font-bold text-foreground border-t-2 border-border">
                  <td className="py-2.5 px-3 sticky left-0 bg-panel font-sans border-r border-border" colSpan={2}>
                    全集团总碳排汇总
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
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-400 tabular-nums">
                    {totals.pvGreenDeduct.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-400 tabular-nums">
                    {totals.ccerDeduct.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-primary bg-primary/20 tabular-nums text-sm">
                    {totals.netEmission.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">-5.7%</td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
