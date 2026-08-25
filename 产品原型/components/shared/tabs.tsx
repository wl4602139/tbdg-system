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
        'inline-flex items-center gap-1 rounded-lg border border-border bg-panel p-1',
        className,
      )}
      role="tablist"
    >
      {list.map((t) => (
        <button
          key={t.value}
          type="button"
          role="tab"
          aria-selected={value === t.value}
          onClick={() => onChange(t.value)}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            value === t.value
              ? 'bg-primary/15 text-primary shadow-[0_0_16px_-6px_var(--primary)]'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
