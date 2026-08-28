'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Sparkles, Cpu, Sliders, History } from 'lucide-react'
import { cn } from '@/lib/utils'

const MODEL_TABS = [
  { key: 'monitoring', label: '1. 实时监控计算模型', href: '/zero-carbon/project/model/monitoring', icon: Cpu, iconColor: 'text-blue-500' },
  { key: 'benefit', label: '2. 项目经济效益评估模型', href: '/zero-carbon/project/model/benefit', icon: Sliders, iconColor: 'text-emerald-500' },
  { key: 'history', label: '3. 模型版本历史回溯库', href: '/zero-carbon/project/model/history', icon: History, iconColor: 'text-purple-500' },
]

export default function ModelManageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="space-y-3.5 w-full font-sans relative z-10">
      {/* 顶部 Header 与 3 大模型 Tab 切换栏 (原生 Next.js Link 导航，100% 可点击) */}
      <div className="relative z-50 pointer-events-auto bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">模型管理</h1>
          </div>
        </div>

        {/* 原生 Link + Router Tab 切换胶囊 */}
        <div className="relative z-50 pointer-events-auto flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 font-sans text-xs">
          {MODEL_TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = pathname.startsWith(tab.href) || (pathname === '/zero-carbon/project/model' && tab.key === 'monitoring')
            return (
              <Link
                key={tab.key}
                href={tab.href}
                prefetch={true}
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(tab.href)
                }}
                className={cn(
                  'px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none text-xs sm:text-sm',
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

      {/* 子视图内容渲染 */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  )
}
