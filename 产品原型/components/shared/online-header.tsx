'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Activity, Calendar, Download, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface OnlineHeaderProps {
  timeDim?: 'day' | 'month'
  onTimeDimChange?: (dim: 'day' | 'month') => void
  startDate?: string
  endDate?: string
  onDateRangeChange?: (start: string, end: string) => void
  selectedMonth?: string
  onMonthChange?: (month: string) => void
  onExport?: () => void
  // 兼容老参数
  startMonth?: string
  endMonth?: string
  onMonthRangeChange?: (start: string, end: string) => void
}

export function OnlineHeader({
  timeDim: propTimeDim,
  onTimeDimChange,
  startDate: propStartDate,
  endDate: propEndDate,
  onDateRangeChange,
  selectedMonth: propSelectedMonth,
  onMonthChange,
  onExport,
  startMonth: legacyStartMonth,
  endMonth: legacyEndMonth,
  onMonthRangeChange: legacyOnMonthRangeChange,
}: OnlineHeaderProps = {}) {
  const pathname = usePathname()
  
  // 默认时间维度：'day' (日) | 'month' (月)
  const [internalTimeDim, setInternalTimeDim] = useState<'day' | 'month'>('day')
  const [internalStartDate, setInternalStartDate] = useState(propStartDate || '2026-08-01')
  const [internalEndDate, setInternalEndDate] = useState(propEndDate || '2026-08-28')
  const [internalMonth, setInternalMonth] = useState(propSelectedMonth || legacyEndMonth || '2026-08')

  const timeDim = propTimeDim || internalTimeDim
  const startDate = propStartDate || internalStartDate
  const endDate = propEndDate || internalEndDate
  const selectedMonth = propSelectedMonth || internalMonth

  const handleTimeDimChange = (dim: 'day' | 'month') => {
    setInternalTimeDim(dim)
    onTimeDimChange?.(dim)
  }

  // 辅助函数：计算两日期相差天数
  const getDaysDiff = (d1: string, d2: string) => {
    const t1 = new Date(d1).getTime()
    const t2 = new Date(d2).getTime()
    return Math.round(Math.abs(t2 - t1) / (1000 * 60 * 60 * 24)) + 1
  }

  // 辅助函数：给定起始日期加 N 天生成合法日期字符串
  const addDays = (dStr: string, days: number) => {
    const d = new Date(dStr)
    d.setDate(d.getDate() + days)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  // 日期变更处理 (限制最大范围为 30 天)
  const handleStartDateChange = (newStart: string) => {
    let newEnd = endDate
    if (newStart > newEnd) {
      newEnd = newStart
    } else {
      const diff = getDaysDiff(newStart, newEnd)
      if (diff > 30) {
        newEnd = addDays(newStart, 29)
      }
    }
    setInternalStartDate(newStart)
    setInternalEndDate(newEnd)
    onDateRangeChange?.(newStart, newEnd)
    legacyOnMonthRangeChange?.(newStart.slice(0, 7), newEnd.slice(0, 7))
  }

  const handleEndDateChange = (newEnd: string) => {
    let newStart = startDate
    if (newEnd < newStart) {
      newStart = newEnd
    } else {
      const diff = getDaysDiff(newStart, newEnd)
      if (diff > 30) {
        newStart = addDays(newEnd, -29)
      }
    }
    setInternalStartDate(newStart)
    setInternalEndDate(newEnd)
    onDateRangeChange?.(newStart, newEnd)
    legacyOnMonthRangeChange?.(newStart.slice(0, 7), newEnd.slice(0, 7))
  }

  const handleMonthChange = (newMonth: string) => {
    setInternalMonth(newMonth)
    onMonthChange?.(newMonth)
    legacyOnMonthRangeChange?.(newMonth, newMonth)
  }

  return (
    <div className="bg-card p-3.5 rounded-xl border border-border shadow-xs flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">
          <Activity className="size-5" />
        </div>
        <div>
          <h1 className="text-base font-bold text-foreground">用能在线监测</h1>
        </div>

        {/* 🌟 2 大子模块 Tab 切换：用能监测 (面向园区/工厂) | 设备监测 (面向重点设备) */}
        <div className="flex items-center bg-panel p-0.5 rounded-lg border border-border text-xs font-medium ml-2">
          <Link
            href="/zero-carbon/monitor/online/usage"
            className={cn(
              'px-3 py-1 rounded-md transition-all select-none',
              pathname.includes('/online/usage') || pathname === '/zero-carbon/monitor/online'
                ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            用能监测
          </Link>
          <Link
            href="/zero-carbon/monitor/online/equipment"
            className={cn(
              'px-3 py-1 rounded-md transition-all select-none',
              pathname.includes('/online/equipment')
                ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            设备监测
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* 时间维度切换：日 / 月 */}
        <div className="flex items-center bg-panel p-0.5 rounded-lg border border-border text-xs font-sans">
          <button
            type="button"
            onClick={() => handleTimeDimChange('day')}
            className={cn(
              'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
              timeDim === 'day' ? 'font-bold bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            日
          </button>
          <button
            type="button"
            onClick={() => handleTimeDimChange('month')}
            className={cn(
              'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
              timeDim === 'month' ? 'font-bold bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            月
          </button>
        </div>

        {/* 1. 日维度：日期范围 (最多30天) + 15分钟固定频率标识 */}
        {timeDim === 'day' && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-panel px-2.5 py-1 rounded-lg border border-border text-xs shadow-2xs font-mono">
              <Calendar className="size-3.5 text-muted-foreground shrink-0" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="bg-transparent border-0 text-foreground text-xs focus:outline-none cursor-pointer"
                title="起始日期 (最多可选30天)"
              />
              <span className="text-muted-foreground font-sans">至</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                className="bg-transparent border-0 text-foreground text-xs focus:outline-none cursor-pointer"
                title="结束日期 (最多可选30天)"
              />
            </div>
          </div>
        )}

        {/* 2. 月维度：选择指定月份 */}
        {timeDim === 'month' && (
          <div className="flex items-center gap-1.5 bg-panel px-2.5 py-1 rounded-lg border border-border text-xs shadow-2xs font-mono">
            <Calendar className="size-3.5 text-muted-foreground shrink-0" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
              className="bg-transparent border-0 text-foreground text-xs focus:outline-none cursor-pointer font-bold"
              title="选择指定月份"
            />
          </div>
        )}

        {/* 导出按钮 */}
        <button
          type="button"
          onClick={() => {
            if (onExport) {
              onExport()
            } else {
              alert(`正在导出当前${timeDim === 'day' ? '日范围 (15min高频)' : '月度'}在线监测数据 (Excel)...`)
            }
          }}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs shadow-2xs cursor-pointer transition-colors select-none"
        >
          <Download className="size-3.5" />
          <span>导出</span>
        </button>
      </div>
    </div>
  )
}
