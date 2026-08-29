'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Activity, Zap, Cpu, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'

export const ONLINE_TABS = [
  { key: 'equipment', label: '1. 重点用能设备监测', href: '/zero-carbon/monitor/online/equipment', icon: Cpu, iconColor: 'text-blue-500' },
  { key: 'process', label: '2. 关键工序监测', href: '/zero-carbon/monitor/online/process', icon: Layers, iconColor: 'text-purple-500' },
]

export function OnlineHeader() {
  const pathname = usePathname()

  return (
    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
          <Activity className="size-5" />
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-800">用能在线监测</h1>
        </div>
      </div>

      <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 font-sans text-xs">
        {ONLINE_TABS.map((tab) => {
          const Icon = tab.icon
          const isActive =
            pathname.startsWith(tab.href) ||
            (pathname === '/zero-carbon/monitor/online' && tab.key === 'equipment')
          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={cn(
                'px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none text-xs',
                isActive
                  ? 'bg-[#1677ff] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              )}
            >
              <Icon className={cn('size-3.5 shrink-0', isActive ? 'text-white' : tab.iconColor)} />
              <span>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
