'use client'

import React from 'react'
import { Database, FolderTree, Cpu, ArrowRightLeft } from 'lucide-react'
import { GOVERNANCE_MODULES } from '@/lib/data-governance-hub'

interface GovernanceModuleNavProps {
  currentModule: 'basic-data' | 'product-type' | 'product-model'
  onNavigate?: (module: 'basic-data' | 'product-type' | 'product-model', params?: Record<string, string>) => void
}

const MODULE_ICONS = {
  'basic-data': Database,
  'product-type': FolderTree,
  'product-model': Cpu,
}

export function GovernanceModuleNav({ currentModule, onNavigate }: GovernanceModuleNavProps) {
  function handleJump(id: string) {
    if (id === currentModule) return
    if (onNavigate) {
      onNavigate(id as 'basic-data' | 'product-type' | 'product-model')
    } else {
      // 降级使用 URL 参数跳转
      window.location.href = `/system?section=${id}`
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-lg border border-[#DBE6EE] bg-white p-2.5 shadow-2xs">
      <div className="flex items-center gap-2 px-2">
        <div className="flex size-6 items-center justify-center rounded bg-[#2C7CFF]/10 text-[#2C7CFF]">
          <ArrowRightLeft className="size-3.5" />
        </div>
        <span className="text-xs font-bold text-slate-700">生产数据协同治理中枢:</span>
        <span className="text-[11px] text-slate-400 hidden md:inline">
          产品类型 (两级标准) ⟷ 产品型号 (生产实例) ⟷ 基础数据 (底座字典)
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 shrink-0">
        {GOVERNANCE_MODULES.map((m) => {
          const isActive = m.id === currentModule
          const Icon = MODULE_ICONS[m.id as keyof typeof MODULE_ICONS]
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => handleJump(m.id)}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-xs transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#2C7CFF] text-white font-bold shadow-xs'
                  : 'border border-[#E2E8F0] bg-slate-50/70 hover:bg-slate-100/80 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="size-3.5 shrink-0" />
              <div className="flex items-center gap-1.5 truncate">
                <span>{m.title}</span>
                <span
                  className={`text-[10px] rounded px-1 py-0.2 select-none ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200/60 text-slate-500'
                  }`}
                >
                  {m.id === 'basic-data' ? '310项' : m.id === 'product-type' ? '14大类' : '21型号'}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
