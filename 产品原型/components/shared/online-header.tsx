'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Activity, Calendar, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

export function OnlineHeader() {
  const pathname = usePathname()
  const [timeDim, setTimeDim] = useState<'month' | 'quarter' | 'year'>('month')
  const [selectedMonthRange, setSelectedMonthRange] = useState({ start: '2026-01', end: '2026-08' })
  const [selectedQuarter, setSelectedQuarter] = useState('2026-Q3')
  const [selectedYear, setSelectedYear] = useState('2026')

  return (
    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
          <Activity className="size-5" />
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-800">用能在线监测</h1>
        </div>

        {/* 🌟 3 大子模块 Tab 切换：用能监测 (面向园区/工厂) | 设备监测 (面向重点设备) | 工序监测 (面向关键工序) */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-medium ml-2">
          <Link
            href="/zero-carbon/monitor/online/usage"
            className={cn(
              'px-3 py-1 rounded-md transition-all select-none',
              pathname.includes('/online/usage') || pathname === '/zero-carbon/monitor/online'
                ? 'bg-white text-[#1677ff] font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            用能监测
          </Link>
          <Link
            href="/zero-carbon/monitor/online/equipment"
            className={cn(
              'px-3 py-1 rounded-md transition-all select-none',
              pathname.includes('/online/equipment')
                ? 'bg-white text-[#1677ff] font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            设备监测
          </Link>
          <Link
            href="/zero-carbon/monitor/online/process"
            className={cn(
              'px-3 py-1 rounded-md transition-all select-none',
              pathname.includes('/online/process')
                ? 'bg-white text-[#1677ff] font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            工序监测
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* 时间维度切换 (月度 / 季度 / 年度) */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-sans">
          <button
            type="button"
            onClick={() => setTimeDim('month')}
            className={cn(
              'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
              timeDim === 'month' ? 'font-bold bg-white text-[#1677ff] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            )}
          >
            月度
          </button>
          <button
            type="button"
            onClick={() => setTimeDim('quarter')}
            className={cn(
              'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
              timeDim === 'quarter' ? 'font-bold bg-white text-[#1677ff] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            )}
          >
            季度
          </button>
          <button
            type="button"
            onClick={() => setTimeDim('year')}
            className={cn(
              'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
              timeDim === 'year' ? 'font-bold bg-white text-[#1677ff] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            )}
          >
            年度
          </button>
        </div>

        {/* 时间范围选择控件 (随维度自适应切换) */}
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

        {/* 导出按钮 */}
        <button
          type="button"
          onClick={() => alert('正在导出【用能在线监测】综合数据报表 (Excel)...')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
        >
          <Download className="size-3.5" />
          <span>导出</span>
        </button>
      </div>
    </div>
  )
}
