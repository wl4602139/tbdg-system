import React from 'react'
import type { LucideIcon } from 'lucide-react'

export function PageHeader({
  title,
  icon: Icon,
  actions,
}: {
  title?: string
  desc?: string
  badge?: string
  icon?: LucideIcon
  actions?: React.ReactNode
}) {
  if (!title && !actions) return null
  return (
    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 mb-3.5">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
            <Icon className="size-5" />
          </div>
        )}
        {title && <h1 className="text-base font-bold text-slate-800">{title}</h1>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
