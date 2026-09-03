import React from 'react'
import type { LucideIcon } from 'lucide-react'

export function PageHeader({
  title,
  desc,
  positioning,
  icon: Icon,
  actions,
}: {
  title?: string
  desc?: string
  positioning?: string
  icon?: LucideIcon
  actions?: React.ReactNode
}) {
  if (!title && !desc && !actions) return null

  if (!title && !desc) {
    return <div className="mb-5 flex flex-wrap items-center justify-end gap-2">{actions}</div>
  }

  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div>
        {title && (
          <div className="flex items-center gap-3">
            <span className="h-6 w-1 rounded-full bg-primary shadow-[0_0_12px_var(--primary)]" />
            {Icon && (
              <div className="size-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                <Icon className="size-4.5" />
              </div>
            )}
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            {positioning && (
              <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
                {positioning}
              </span>
            )}
          </div>
        )}
        {desc && <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{desc}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}
