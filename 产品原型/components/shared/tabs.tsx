'use client'

import { cn } from '@/lib/utils'

export function Tabs({
  tabs,
  items,
  value,
  onChange,
  className,
}: {
  tabs?: { label: string; value: string }[]
  items?: { label: string; value: string }[]
  value: string
  onChange: (v: string) => void
  className?: string
}) {
  const list = tabs ?? items ?? []
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 p-0.5',
        className,
      )}
      role="tablist"
    >
      {list.map((t) => {
        const active = value === t.value
        return (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.value)}
            className={cn(
              'rounded-lg px-4 py-1.5 text-sm font-medium transition-all cursor-pointer select-none',
              active
                ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/40',
            )}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}
