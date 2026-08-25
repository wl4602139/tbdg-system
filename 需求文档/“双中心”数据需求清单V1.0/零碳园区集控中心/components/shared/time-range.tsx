'use client'

import { useState } from 'react'
import { CalendarRange } from 'lucide-react'
import { cn } from '@/lib/utils'

const quickOptions = ['最近1天', '最近一周', '最近一月']

export function TimeRange({ className }: { className?: string }) {
  const [quick, setQuick] = useState('最近一周')
  const [start, setStart] = useState('2026-08-14')
  const [end, setEnd] = useState('2026-08-21')

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <div className="inline-flex overflow-hidden rounded-md border border-border">
        {quickOptions.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => setQuick(q)}
            className={cn(
              'px-3 py-1.5 text-xs transition-colors',
              quick === q ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {q}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1.5 rounded-md border border-border bg-panel px-2 py-1">
        <CalendarRange className="size-3.5 text-muted-foreground" />
        <input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="bg-transparent text-xs text-foreground outline-none"
        />
        <span className="text-xs text-muted-foreground">至</span>
        <input
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="bg-transparent text-xs text-foreground outline-none"
        />
      </div>
    </div>
  )
}
