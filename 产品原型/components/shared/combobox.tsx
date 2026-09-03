'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

/* 可检索下拉：用于产品型号 / 订单 / 生产计划等模糊查询 */
export function ComboBox({
  options,
  value,
  onChange,
  label,
  placeholder = '搜索…',
  className,
  minWidth = '11rem',
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
  label?: string
  placeholder?: string
  className?: string
  minWidth?: string
}) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const filtered = options.filter((o) => o.toLowerCase().includes(q.trim().toLowerCase()))

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {label && <span className="whitespace-nowrap text-xs text-muted-foreground">{label}</span>}
      <div className="relative" ref={ref} style={{ minWidth }}>
        <button
          type="button"
          onClick={() => {
            setOpen((v) => !v)
            setQ('')
          }}
          className={cn(
            'flex h-9 w-full items-center justify-between gap-2 rounded-md border border-border bg-panel px-3 text-sm text-foreground transition-colors',
            'hover:border-primary/60 focus:outline-none focus:ring-2 focus:ring-ring',
          )}
        >
          <span className="truncate font-mono text-[13px]">{value || placeholder}</span>
          <ChevronDown className={cn('size-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')} />
        </button>
        {open && (
          <div className="absolute z-50 mt-1 w-full min-w-[13rem] overflow-hidden rounded-md border border-border bg-popover shadow-xl shadow-black/40 backdrop-blur">
            <div className="flex items-center gap-2 border-b border-border px-2.5 py-2">
              <Search className="size-3.5 text-muted-foreground" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
            <ul role="listbox" className="max-h-56 overflow-auto p-1">
              {filtered.length === 0 && (
                <li className="px-2.5 py-3 text-center text-xs text-muted-foreground">无匹配结果</li>
              )}
              {filtered.map((o) => (
                <li key={o}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(o)
                      setOpen(false)
                    }}
                    className={cn(
                      'flex w-full items-center justify-between gap-2 rounded-sm px-2.5 py-1.5 text-left font-mono text-[13px] text-popover-foreground transition-colors',
                      'hover:bg-accent hover:text-accent-foreground',
                      o === value && 'text-primary',
                    )}
                  >
                    {o}
                    {o === value && <Check className="size-4" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
