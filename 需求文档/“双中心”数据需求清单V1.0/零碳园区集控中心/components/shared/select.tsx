'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SelectOption = { label: string; value: string }

export function Select({
  options,
  value,
  onChange,
  defaultValue,
  placeholder = '请选择',
  className,
  label,
}: {
  options: SelectOption[]
  /** 受控值；不传则组件内部维护选中状态（非受控） */
  value?: string
  onChange?: (value: string) => void
  defaultValue?: string
  placeholder?: string
  className?: string
  label?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // 非受控模式：无 value 时用内部状态，默认取 defaultValue 或首个选项
  const isControlled = value !== undefined
  const [internal, setInternal] = useState(defaultValue ?? options[0]?.value ?? '')
  const selected = isControlled ? value : internal

  function handleSelect(v: string) {
    if (!isControlled) setInternal(v)
    onChange?.(v)
  }

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const current = options.find((o) => o.value === selected)

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {label && <span className="whitespace-nowrap text-xs text-muted-foreground">{label}</span>}
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            'flex h-9 min-w-[9rem] items-center justify-between gap-3 rounded-md border border-border bg-panel px-3 text-sm text-foreground transition-colors',
            'hover:border-primary/60 focus:outline-none focus:ring-2 focus:ring-ring',
          )}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className={cn(!current && 'text-muted-foreground')}>
            {current ? current.label : placeholder}
          </span>
          <ChevronDown
            className={cn('size-4 text-muted-foreground transition-transform', open && 'rotate-180')}
          />
        </button>
        {open && (
          <ul
            role="listbox"
            className="absolute z-50 mt-1 max-h-64 w-full min-w-full overflow-auto rounded-md border border-border bg-popover p-1 shadow-xl shadow-black/40 backdrop-blur"
          >
            {options.map((o) => (
              <li key={o.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={o.value === selected}
                  onClick={() => {
                    handleSelect(o.value)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 rounded-sm px-2.5 py-1.5 text-left text-sm text-popover-foreground transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    o.value === selected && 'text-primary',
                  )}
                >
                  {o.label}
                  {o.value === selected && <Check className="size-4" />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
