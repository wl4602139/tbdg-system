'use client'

import { useState, useMemo } from 'react'
import {
  Download,
  Calendar,
  Coins,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ExportButton } from '@/components/shared/primitives'
import { SearchableUnitSelect } from '@/components/shared/searchable-unit-select'
import { getPeriodScaleFactor } from '@/components/shared/time-dimension-engine'

interface CostRow {
  id: string
  unitId: string
  unitName: string
  company: string
  totalElecCost?: number
  tipElec: number
  peakElec: number
  flatElec: number
  valleyElec: number
  gasCost: number
  waterCost: number
  steamCost: number
  selfUseDeduct: number
  gridRevenue: number
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
    selfUseDeduct: -260.0,
    gridRevenue: -60.0,
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
    selfUseDeduct: -60.0,
    gridRevenue: -15.0,
    netCost: 806.8,
    avgPrice: '0.562 元',
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
    selfUseDeduct: -21.0,
    gridRevenue: -5.0,
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
    selfUseDeduct: -15.0,
    gridRevenue: -4.0,
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
    selfUseDeduct: -12.0,
    gridRevenue: -3.0,
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
    selfUseDeduct: -235.0,
    gridRevenue: -55.0,
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
    selfUseDeduct: -72.0,
    gridRevenue: -18.0,
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
    selfUseDeduct: -45.0,
    gridRevenue: -10.0,
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
    selfUseDeduct: -170.0,
    gridRevenue: -40.0,
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
    selfUseDeduct: -120.0,
    gridRevenue: -30.0,
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
    selfUseDeduct: -160.0,
    gridRevenue: -40.0,
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
    selfUseDeduct: -48.0,
    gridRevenue: -12.0,
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
    selfUseDeduct: -38.0,
    gridRevenue: -10.0,
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
    selfUseDeduct: -125.0,
    gridRevenue: -30.0,
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
    selfUseDeduct: -68.0,
    gridRevenue: -17.0,
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
    selfUseDeduct: -170.0,
    gridRevenue: -40.0,
    netCost: 2321.0,
    avgPrice: '0.563 元',
  },
]

export default function CostReportPage() {
  // 时间维度: 'month' | 'quarter' | 'year' | 'custom' (默认月度)
  const [timeDim, setTimeDim] = useState<'month' | 'quarter' | 'year' | 'custom'>('month')
  // 指定单月选择 (默认 2026-08)
  const [selectedMonth, setSelectedMonth] = useState('2026-08')
  // 指定季度选择 (默认 2026-Q3)
  const [selectedQuarter, setSelectedQuarter] = useState('2026-Q3')
  // 指定年度选择 (默认 2026)
  const [selectedYear, setSelectedYear] = useState('2026')
  // 自定义月度区间 (最多选择12个月)
  const [selectedMonthRange, setSelectedMonthRange] = useState({ start: '2026-01', end: '2026-08' })

  // 计算月份间隔数（包含起止月）
  const getMonthsCount = (start: string, end: string): number => {
    if (!start || !end) return 1
    const [sy, sm] = start.split('-').map(Number)
    const [ey, em] = end.split('-').map(Number)
    return (ey - sy) * 12 + (em - sm) + 1
  }

  // 基于年月增减月数，返回 YYYY-MM
  const addMonthsToYm = (ym: string, delta: number): string => {
    const [y, m] = ym.split('-').map(Number)
    const totalMonths = y * 12 + (m - 1) + delta
    const newY = Math.floor(totalMonths / 12)
    const newM = (totalMonths % 12) + 1
    return `${newY}-${newM < 10 ? '0' + newM : newM}`
  }

  const handleCustomStartMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value
    if (!newStart) return
    setSelectedMonthRange((prev) => {
      let newEnd = prev.end
      if (newStart > newEnd) {
        newEnd = newStart
      }
      if (getMonthsCount(newStart, newEnd) > 12) {
        newEnd = addMonthsToYm(newStart, 11)
      }
      return { start: newStart, end: newEnd }
    })
  }

  const handleCustomEndMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = e.target.value
    if (!newEnd) return
    setSelectedMonthRange((prev) => {
      let newStart = prev.start
      if (newEnd < newStart) {
        newStart = newEnd
      }
      if (getMonthsCount(newStart, newEnd) > 12) {
        newStart = addMonthsToYm(newEnd, -11)
      }
      return { start: newStart, end: newEnd }
    })
  }

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

    // 依据时间维度动态缩放累计成本与费用
    const periodScale = getPeriodScaleFactor('sum', timeDim, {
      selectedMonth,
      selectedMonthRange,
      monthRange: selectedMonthRange,
      selectedQuarter,
      quarter: selectedQuarter,
      selectedYear,
      year: selectedYear,
    })

    return rows.map((r) => {
      const tipElec = Number((r.tipElec * periodScale).toFixed(1))
      const peakElec = Number((r.peakElec * periodScale).toFixed(1))
      const flatElec = Number((r.flatElec * periodScale).toFixed(1))
      const valleyElec = Number((r.valleyElec * periodScale).toFixed(1))
      const totalElecCost = Number((tipElec + peakElec + flatElec + valleyElec).toFixed(1))
      const gasCost = Number((r.gasCost * periodScale).toFixed(1))
      const waterCost = Number((r.waterCost * periodScale).toFixed(1))
      const steamCost = Number((r.steamCost * periodScale).toFixed(1))
      const selfUseDeduct = Number((r.selfUseDeduct * periodScale).toFixed(1))
      const gridRevenue = Number((r.gridRevenue * periodScale).toFixed(1))
      const netCost = Number((r.netCost * periodScale).toFixed(1))

      return {
        ...r,
        totalElecCost,
        tipElec,
        peakElec,
        flatElec,
        valleyElec,
        gasCost,
        waterCost,
        steamCost,
        selfUseDeduct,
        gridRevenue,
        netCost,
      }
    })
  }, [companyFilter, unitFilter, timeDim, selectedMonth, selectedQuarter, selectedYear, selectedMonthRange])

  // 当前时间显示字符串
  const currentTimeDisplay = useMemo(() => {
    if (timeDim === 'month') return selectedMonth
    if (timeDim === 'quarter') return selectedQuarter
    if (timeDim === 'year') return `${selectedYear}年度`
    return `${selectedMonthRange.start} ~ ${selectedMonthRange.end}`
  }, [timeDim, selectedMonth, selectedQuarter, selectedYear, selectedMonthRange])

  // 顶部主表头（由查询条件动态拼接）
  const reportHeaderTitle = useMemo(() => {
    const compText = companyFilter === 'all' ? '全集团' : companyFilter
    const unitText = unitFilter === 'all' ? '全部单位' : unitFilter
    return `${compText} · ${unitText} · ${currentTimeDisplay} · 能源成本分析报表`
  }, [companyFilter, unitFilter, currentTimeDisplay])

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
        acc.totalElecCost += (r.totalElecCost || 0)
        acc.tipElec += r.tipElec
        acc.peakElec += r.peakElec
        acc.flatElec += r.flatElec
        acc.valleyElec += r.valleyElec
        acc.gasCost += r.gasCost
        acc.waterCost += r.waterCost
        acc.steamCost += r.steamCost
        acc.selfUseDeduct += r.selfUseDeduct
        acc.gridRevenue += r.gridRevenue
        acc.netCost += r.netCost
        return acc
      },
      {
        totalElecCost: 0,
        tipElec: 0,
        peakElec: 0,
        flatElec: 0,
        valleyElec: 0,
        gasCost: 0,
        waterCost: 0,
        steamCost: 0,
        selfUseDeduct: 0,
        gridRevenue: 0,
        netCost: 0,
      },
    )
  }, [filteredRows])

  return (
    <div className="flex flex-col gap-3.5 w-full font-sans">
      {/* 顶部面包屑与操作栏 */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2C7CFF] shrink-0">
            <Coins className="size-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">成本报表</h1>
          </div>
        </div>

        {/* 工具栏 */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* 时间维度统一 (日 / 月 / 季度 / 年 / 自定义，样式参照用能监测) */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg text-sm font-sans">
            <button
              type="button"
              onClick={() => setTimeDim('month')}
              className={cn(
                'px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer select-none text-sm',
                timeDim === 'month'
                  ? 'font-bold bg-[#2C7CFF] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              )}
            >
              月
            </button>
            <button
              type="button"
              onClick={() => setTimeDim('quarter')}
              className={cn(
                'px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer select-none text-sm',
                timeDim === 'quarter'
                  ? 'font-bold bg-[#2C7CFF] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              )}
            >
              季度
            </button>
            <button
              type="button"
              onClick={() => setTimeDim('year')}
              className={cn(
                'px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer select-none text-sm',
                timeDim === 'year'
                  ? 'font-bold bg-[#2C7CFF] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              )}
            >
              年
            </button>
            <button
              type="button"
              onClick={() => setTimeDim('custom')}
              className={cn(
                'px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer select-none text-sm',
                timeDim === 'custom'
                  ? 'font-bold bg-[#2C7CFF] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              )}
            >
              自定义
            </button>
          </div>

          {/* 时间范围选择控件 (随维度自适应切换，样式参照用能监测) */}
          {timeDim === 'month' && (
            <div className="flex items-center gap-2 bg-white px-3 h-9 rounded-lg border border-[#DBE6EE] text-sm shadow-xs font-mono">
              <Calendar className="size-4 text-slate-400 shrink-0" />
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => e.target.value && setSelectedMonth(e.target.value)}
                className="bg-transparent border-0 text-slate-800 text-sm focus:outline-none cursor-pointer font-bold"
                title="选择指定月份"
              />
            </div>
          )}

          {timeDim === 'quarter' && (
            <div className="flex items-center gap-2 bg-white px-3 h-9 rounded-lg border border-[#DBE6EE] text-sm shadow-xs">
              <Calendar className="size-4 text-slate-400 shrink-0" />
              <select
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value)}
                className="bg-transparent border-0 text-slate-800 text-sm font-mono font-medium focus:outline-none cursor-pointer pr-1"
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
            <div className="flex items-center gap-2 bg-white px-3 h-9 rounded-lg border border-[#DBE6EE] text-sm shadow-xs">
              <Calendar className="size-4 text-slate-400 shrink-0" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-transparent border-0 text-slate-800 text-sm font-mono font-medium focus:outline-none cursor-pointer pr-1"
              >
                <option value="2026">2026 年度</option>
                <option value="2025">2025 年度</option>
                <option value="2024">2024 年度</option>
              </select>
            </div>
          )}

          {timeDim === 'custom' && (
            <div className="flex items-center gap-2 bg-white px-3 h-9 rounded-lg border border-[#DBE6EE] text-sm shadow-xs font-mono">
              <Calendar className="size-4 text-slate-400 shrink-0" />
              <input
                type="month"
                value={selectedMonthRange.start}
                onChange={handleCustomStartMonthChange}
                className="bg-transparent border-0 text-slate-800 text-sm focus:outline-none cursor-pointer font-bold"
                title="开始月份 (最多选12个月)"
              />
              <span className="text-slate-400 font-sans">至</span>
              <input
                type="month"
                value={selectedMonthRange.end}
                onChange={handleCustomEndMonthChange}
                className="bg-transparent border-0 text-slate-800 text-sm focus:outline-none cursor-pointer font-bold"
                title="结束月份 (最多选12个月)"
              />
            </div>
          )}

          <ExportButton onClick={() => alert('正在导出能源成本财务对账单 (Excel/PDF)...')} />
        </div>
      </div>

      {/* 主数据报表 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
        {/* 操作搜索栏 */}
        <div className="p-2.5 border-b border-slate-200 bg-[#fafbfc] flex flex-wrap items-center justify-between gap-3 font-sans">
          <div className="flex flex-wrap items-center gap-3">
            {/* 企业下拉筛选 */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-700 whitespace-nowrap">所属企业：</span>
              <select
                value={companyFilter}
                onChange={(e) => {
                  setCompanyFilter(e.target.value)
                  setUnitFilter('all') // 联动重置下属单位
                }}
                className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500 shadow-2xs cursor-pointer"
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
              <span className="text-xs font-bold text-slate-700 whitespace-nowrap">所属单位：</span>
              <SearchableUnitSelect
                options={availableUnits}
                value={unitFilter}
                onChange={(val) => setUnitFilter(val)}
                placeholder="全部所属单位"
              />
            </div>
          </div>
        </div>

        {/* 动态主表头（由查询条件拼接而成） */}
        <div className="px-4 py-2.5 bg-blue-50/60 border-b border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
            <h2 className="text-base font-bold text-slate-800 tracking-wide font-sans">
              【{reportHeaderTitle}】
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            统计周期: {currentTimeDisplay}
          </span>
        </div>

        {/* 表格区域 */}
        <div className="overflow-x-auto custom-scrollbar">
          {filteredRows.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
              <div>暂无匹配的成本报表数据</div>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-bold select-none h-[44px]">
                  <th className="py-2.5 px-3 sticky left-0 bg-slate-50 z-10 min-w-[130px]">企业名称</th>
                  <th className="py-2.5 px-3 min-w-[150px]">单位名称</th>
                  <th className="py-2.5 px-3 min-w-[90px] text-center font-mono whitespace-nowrap">时间</th>
                  <th className="py-2.5 px-3 text-right font-bold text-slate-900 bg-blue-50/30">总电费 (万元)</th>
                  <th className="py-2.5 px-3 text-right">尖段电费 (万元)</th>
                  <th className="py-2.5 px-3 text-right">峰段电费 (万元)</th>
                  <th className="py-2.5 px-3 text-right">平段电费 (万元)</th>
                  <th className="py-2.5 px-3 text-right">谷段电费 (万元)</th>
                  <th className="py-2.5 px-3 text-right">天然气费 (万元)</th>
                  <th className="py-2.5 px-3 text-right">水费 (万元)</th>
                  <th className="py-2.5 px-3 text-right">蒸汽热力费 (万元)</th>
                  <th className="py-2.5 px-3 text-right text-emerald-600">上网收益 (万元)</th>
                  <th className="py-2.5 px-3 text-right text-blue-600 font-bold bg-blue-50/50">净能源成本 (万元)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredRows.map((r, idx) => {
                  const span = companyRowSpans[idx]
                  return (
                    <tr key={r.id} className="hover:bg-blue-50/30 transition-colors h-[44px]">
                      {span > 0 && (
                        <td
                          rowSpan={span}
                          className="py-2.5 px-3 sticky left-0 bg-slate-50 font-sans font-bold text-slate-800 text-center align-middle border-r border-b border-slate-200 z-10 select-none shadow-[1px_0_0_0_#e2e8f0]"
                        >
                          <div className="flex items-center justify-center h-full">
                            <span className="leading-snug">{r.company}</span>
                          </div>
                        </td>
                      )}
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-800 border-b border-slate-100">
                        {r.unitName}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-center text-slate-600 border-b border-slate-100">
                        {currentTimeDisplay}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900 bg-blue-50/30 tabular-nums">
                        {(r.totalElecCost || 0).toFixed(1)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-rose-600 font-bold tabular-nums">
                        {r.tipElec.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-amber-600 tabular-nums">
                        {r.peakElec.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-600 tabular-nums">
                        {r.flatElec.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-emerald-600 tabular-nums">
                        {r.valleyElec.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums">
                        {r.gasCost.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums">
                        {r.waterCost.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums">
                        {r.steamCost.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-emerald-600 font-bold tabular-nums">
                        {r.gridRevenue.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-blue-700 bg-blue-50/30 tabular-nums">
                        {r.netCost.toFixed(1)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot className="bg-slate-100 border-t border-slate-300 font-bold text-slate-800">
                <tr className="h-[44px]">
                  <td className="py-2.5 px-3 sticky left-0 bg-slate-100 font-sans font-bold text-slate-900" colSpan={3}>
                    全集团合计 ({filteredRows.length} 家)
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 bg-blue-100/40 tabular-nums">
                    {totals.totalElecCost.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-rose-700 tabular-nums">
                    {totals.tipElec.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-amber-700 tabular-nums">
                    {totals.peakElec.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                    {totals.flatElec.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-700 tabular-nums">
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
                    {totals.gridRevenue.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-blue-700 bg-blue-100/60 tabular-nums text-sm">
                    {totals.netCost.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
