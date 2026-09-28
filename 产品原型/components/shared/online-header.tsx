'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Activity, Calendar, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TimeDimension = 'day' | 'month' | 'quarter' | 'year' | 'custom'

export interface OnlineHeaderProps {
  title?: string
  timeDim?: TimeDimension
  onTimeDimChange?: (dim: TimeDimension) => void
  allowedDimensions?: TimeDimension[]
  // 单日选择 (日维度)
  selectedDate?: string
  onDateChange?: (date: string) => void
  // 单月选择 (月维度)
  selectedMonth?: string
  onMonthChange?: (month: string) => void
  // 季度选择 (季度维度)
  selectedQuarter?: string
  onQuarterChange?: (quarter: string) => void
  // 年度选择 (年度维度)
  selectedYear?: string
  onYearChange?: (year: string) => void
  // 自定义区间 (日期区间或跨月区间)
  startDate?: string
  endDate?: string
  onDateRangeChange?: (start: string, end: string) => void
  startMonth?: string
  endMonth?: string
  onMonthRangeChange?: (start: string, end: string) => void
  onExport?: () => void
  hideExport?: boolean
}

export function OnlineHeader({
  title,
  timeDim: propTimeDim,
  onTimeDimChange,
  allowedDimensions = ['day', 'month', 'quarter', 'year', 'custom'],
  selectedDate: propSelectedDate,
  onDateChange,
  selectedMonth: propSelectedMonth,
  onMonthChange,
  selectedQuarter: propSelectedQuarter,
  onQuarterChange,
  selectedYear: propSelectedYear,
  onYearChange,
  startDate: propStartDate,
  endDate: propEndDate,
  onDateRangeChange,
  startMonth: propStartMonth,
  endMonth: propEndMonth,
  onMonthRangeChange,
  onExport,
  hideExport = false,
}: OnlineHeaderProps = {}) {
  const pathname = usePathname()
  
  // 默认时间维度：'day' (日) | 'month' (月) | 'quarter' (季度) | 'year' (年) | 'custom' (跨月自定义)
  const [internalTimeDim, setInternalTimeDim] = useState<TimeDimension>('day')
  const [internalDate, setInternalDate] = useState(propSelectedDate || propEndDate || '2026-08-28')
  const [internalMonth, setInternalMonth] = useState(propSelectedMonth || propEndMonth || '2026-08')
  const [internalQuarter, setInternalQuarter] = useState(propSelectedQuarter || '2026-Q3')
  const [internalYear, setInternalYear] = useState(propSelectedYear || '2026')
  const [internalStartDate, setInternalStartDate] = useState(propStartDate || '2026-08-01')
  const [internalEndDate, setInternalEndDate] = useState(propEndDate || '2026-08-28')
  const [internalStartMonth, setInternalStartMonth] = useState(propStartMonth || '2026-01')
  const [internalEndMonth, setInternalEndMonth] = useState(propEndMonth || '2026-08')

  const timeDim = propTimeDim || internalTimeDim
  const selectedDate = propSelectedDate || internalDate
  const selectedMonth = propSelectedMonth || internalMonth
  const selectedQuarter = propSelectedQuarter || internalQuarter
  const selectedYear = propSelectedYear || internalYear
  const startDate = propStartDate || internalStartDate
  const endDate = propEndDate || internalEndDate
  const customStartMonth = propStartMonth || internalStartMonth
  const customEndMonth = propEndMonth || internalEndMonth

  const handleTimeDimChange = (dim: TimeDimension) => {
    setInternalTimeDim(dim)
    onTimeDimChange?.(dim)
  }

  const handleDateChange = (newDate: string) => {
    setInternalDate(newDate)
    onDateChange?.(newDate)
  }

  const handleMonthChange = (newMonth: string) => {
    setInternalMonth(newMonth)
    onMonthChange?.(newMonth)
  }

  const handleQuarterChange = (newQuarter: string) => {
    setInternalQuarter(newQuarter)
    onQuarterChange?.(newQuarter)
  }

  const handleYearChange = (newYear: string) => {
    setInternalYear(newYear)
    onYearChange?.(newYear)
  }

  const handleCustomStartMonthChange = (val: string) => {
    let nextEnd = customEndMonth
    if (val > nextEnd) {
      nextEnd = val
    }
    setInternalStartMonth(val)
    setInternalEndMonth(nextEnd)
    onMonthRangeChange?.(val, nextEnd)
  }

  const handleCustomEndMonthChange = (val: string) => {
    let nextStart = customStartMonth
    if (val < nextStart) {
      nextStart = val
    }
    setInternalStartMonth(nextStart)
    setInternalEndMonth(val)
    onMonthRangeChange?.(nextStart, val)
  }

  const DIM_LABELS: Record<TimeDimension, string> = {
    day: '日',
    month: '月',
    quarter: '季度',
    year: '年',
    custom: '自定义',
  }

  return (
    <div className="bg-card p-3.5 rounded-lg border border-border shadow-xs flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">
          <Activity className="size-5" />
        </div>
        <div>
          <h1 className="text-base font-bold text-foreground">
            {title || (pathname.includes('/online/equipment') ? '重点用能设备' : '用能监测')}
          </h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* 时间维度切换 */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg text-sm font-sans">
          {allowedDimensions.map((dim) => (
            <button
              key={dim}
              type="button"
              onClick={() => handleTimeDimChange(dim)}
              className={cn(
                'px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer select-none text-sm',
                timeDim === dim
                  ? 'font-bold bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
              )}
            >
              {DIM_LABELS[dim]}
            </button>
          ))}
        </div>

        {/* 1. 日维度：单日选择器 */}
        {timeDim === 'day' && (
          <div className="flex items-center gap-2 bg-panel px-3 h-9 rounded-lg border border-border text-sm shadow-xs font-mono">
            <Calendar className="size-4 text-muted-foreground shrink-0" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="bg-transparent border-0 text-foreground text-sm focus:outline-none cursor-pointer"
              title="选择具体监测日期"
            />
          </div>
        )}

        {/* 2. 月维度：单一月份选择器 */}
        {timeDim === 'month' && (
          <div className="flex items-center gap-2 bg-panel px-3 h-9 rounded-lg border border-border text-sm shadow-xs font-mono">
            <Calendar className="size-4 text-muted-foreground shrink-0" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
              className="bg-transparent border-0 text-foreground text-sm focus:outline-none cursor-pointer font-bold"
              title="选择监测月份"
            />
          </div>
        )}

        {/* 3. 季度维度：季度下拉选择器 */}
        {timeDim === 'quarter' && (
          <div className="flex items-center gap-2 bg-panel px-3 h-9 rounded-lg border border-border text-sm shadow-xs font-mono">
            <Calendar className="size-4 text-muted-foreground shrink-0" />
            <select
              value={selectedQuarter}
              onChange={(e) => handleQuarterChange(e.target.value)}
              className="bg-transparent border-0 text-foreground text-sm focus:outline-none cursor-pointer font-medium"
              title="选择监测季度"
            >
              <option value="2026-Q3">2026年 第3季度 (Q3)</option>
              <option value="2026-Q2">2026年 第2季度 (Q2)</option>
              <option value="2026-Q1">2026年 第1季度 (Q1)</option>
              <option value="2025-Q4">2025年 第4季度 (Q4)</option>
              <option value="2025-Q3">2025年 第3季度 (Q3)</option>
              <option value="2025-Q2">2025年 第2季度 (Q2)</option>
              <option value="2025-Q1">2025年 第1季度 (Q1)</option>
            </select>
          </div>
        )}

        {/* 4. 年度维度：年度下拉选择器 */}
        {timeDim === 'year' && (
          <div className="flex items-center gap-2 bg-panel px-3 h-9 rounded-lg border border-border text-sm shadow-xs font-mono">
            <Calendar className="size-4 text-muted-foreground shrink-0" />
            <select
              value={selectedYear}
              onChange={(e) => handleYearChange(e.target.value)}
              className="bg-transparent border-0 text-foreground text-sm focus:outline-none cursor-pointer font-medium"
              title="选择监测年度"
            >
              <option value="2026">2026 年度</option>
              <option value="2025">2025 年度</option>
              <option value="2024">2024 年度</option>
            </select>
          </div>
        )}

        {/* 5. 跨月自定义维度：起止月份选择器 */}
        {timeDim === 'custom' && (
          <div className="flex items-center gap-2 bg-panel px-3 h-9 rounded-lg border border-border text-sm shadow-xs font-mono">
            <Calendar className="size-4 text-muted-foreground shrink-0" />
            <input
              type="month"
              value={customStartMonth}
              onChange={(e) => handleCustomStartMonthChange(e.target.value)}
              className="bg-transparent border-0 text-foreground text-sm focus:outline-none cursor-pointer font-medium"
              title="开始月份 (跨度最多12个月)"
            />
            <span className="text-muted-foreground font-sans">至</span>
            <input
              type="month"
              value={customEndMonth}
              onChange={(e) => handleCustomEndMonthChange(e.target.value)}
              className="bg-transparent border-0 text-foreground text-sm focus:outline-none cursor-pointer font-medium"
              title="结束月份 (跨度最多12个月)"
            />
          </div>
        )}

        {/* 导出按钮 (统一 80px × 36px, #2C7CFF, 8px 圆角, 白字白图标) */}
        {!hideExport && (
          <button
            type="button"
            onClick={() => {
              if (onExport) {
                onExport()
              } else {
                const exportDesc =
                  timeDim === 'day'
                    ? `${selectedDate} 单日逐时`
                    : timeDim === 'month'
                    ? `${selectedMonth} 月度逐日`
                    : timeDim === 'quarter'
                    ? `${selectedQuarter} 季度逐月`
                    : timeDim === 'year'
                    ? `${selectedYear} 年度逐月`
                    : `${customStartMonth} 至 ${customEndMonth} 跨月自定义区间`
                alert(`正在导出【${exportDesc}】监测数据 (Excel)...`)
              }
            }}
            className="w-[80px] h-9 rounded-lg bg-[#2C7CFF] hover:bg-[#1f6be8] text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors select-none shrink-0"
          >
            <Download className="size-3.5 text-white" />
            <span>导出</span>
          </button>
        )}
      </div>
    </div>
  )
}
