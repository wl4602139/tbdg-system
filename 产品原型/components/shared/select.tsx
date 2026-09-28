'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
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
  direction = 'auto',
  maxHeight: maxHeightProp,
}: {
  options: SelectOption[]
  /** 受控值；不传则组件内部维护选中状态（非受控） */
  value?: string
  onChange?: (value: string) => void
  defaultValue?: string
  placeholder?: string
  className?: string
  label?: string
  /** 下拉方向：'auto' 自动根据视口/容器剩余空间判定；'up' 向上弹出；'down' 向下弹出 */
  direction?: 'auto' | 'up' | 'down'
  maxHeight?: number
}) {
  const [open, setOpen] = useState(false)
  const [openUp, setOpenUp] = useState(false)
  const [calculatedMaxHeight, setCalculatedMaxHeight] = useState<number | undefined>(undefined)
  const ref = useRef<HTMLDivElement>(null)

  // 非受控模式：无 value 时用内部状态，默认取 defaultValue 或首个选项
  const isControlled = value !== undefined
  const [internal, setInternal] = useState(defaultValue ?? options[0]?.value ?? '')
  const selected = isControlled ? value : internal

  function handleSelect(v: string) {
    if (!isControlled) setInternal(v)
    onChange?.(v)
  }

  // 动态测量位置与计算开合方向（避免在 Modal 或页面底部被截断）
  const updatePlacement = useCallback(() => {
    if (!ref.current) return
    if (direction === 'up') {
      setOpenUp(true)
      setCalculatedMaxHeight(maxHeightProp ?? 256)
      return
    }
    if (direction === 'down') {
      setOpenUp(false)
      setCalculatedMaxHeight(maxHeightProp ?? 256)
      return
    }

    const rect = ref.current.getBoundingClientRect()
    let spaceBelow = window.innerHeight - rect.bottom
    let spaceAbove = rect.top

    // 向上遍历查找具备 overflow 滚动的父级容器（如 Modal 内部）
    let parent = ref.current.parentElement
    while (parent && parent !== document.body) {
      const style = window.getComputedStyle(parent)
      const overflowY = style.overflowY
      if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'hidden') {
        const parentRect = parent.getBoundingClientRect()
        const parentSpaceBelow = parentRect.bottom - rect.bottom
        const parentSpaceAbove = rect.top - parentRect.top
        if (parentSpaceBelow < spaceBelow) spaceBelow = parentSpaceBelow
        if (parentSpaceAbove < spaceAbove) spaceAbove = parentSpaceAbove
        break
      }
      parent = parent.parentElement
    }

    // 当下方空间小于 180px 且上方空间更宽敞时，自动向上弹出
    const shouldOpenUp = spaceBelow < 180 && spaceAbove > spaceBelow
    setOpenUp(shouldOpenUp)

    const availableSpace = shouldOpenUp ? spaceAbove - 12 : spaceBelow - 12
    if (availableSpace > 0) {
      setCalculatedMaxHeight(Math.min(maxHeightProp ?? 256, Math.max(100, Math.floor(availableSpace))))
    } else {
      setCalculatedMaxHeight(maxHeightProp ?? 256)
    }
  }, [direction, maxHeightProp])

  function toggleOpen() {
    if (!open) {
      updatePlacement()
    }
    setOpen((v) => !v)
  }

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  // 监听滚动与尺寸变化更新定位
  useEffect(() => {
    if (!open) return
    const handleScrollOrResize = () => updatePlacement()
    window.addEventListener('resize', handleScrollOrResize)
    window.addEventListener('scroll', handleScrollOrResize, true)
    return () => {
      window.removeEventListener('resize', handleScrollOrResize)
      window.removeEventListener('scroll', handleScrollOrResize, true)
    }
  }, [open, updatePlacement])

  const current = options.find((o) => o.value === selected)

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {label && <span className="whitespace-nowrap text-sm text-muted-foreground font-medium shrink-0">{label}</span>}
      <div className="relative flex-1 min-w-0" ref={ref}>
        <button
          type="button"
          onClick={toggleOpen}
          className={cn(
            'flex h-9 w-full min-w-[160px] items-center justify-between gap-2 rounded-lg border border-border bg-panel px-3 text-sm text-foreground transition-colors',
            'hover:border-primary/60 focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer select-none',
            open && 'border-primary ring-2 ring-ring',
          )}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className={cn('truncate', !current && 'text-slate-400')}>
            {current ? current.label : placeholder}
          </span>
          <ChevronDown
            className={cn('size-4 text-slate-400 transition-transform duration-200 shrink-0', open && 'rotate-180 text-primary')}
          />
        </button>
        {open && (
          <ul
            role="listbox"
            style={{ maxHeight: calculatedMaxHeight ? `${calculatedMaxHeight}px` : undefined }}
            className={cn(
              'absolute z-50 w-full min-w-full overflow-y-auto rounded-lg border border-[#DBE6EE] bg-white p-1 shadow-xl shadow-black/10 backdrop-blur custom-scrollbar',
              openUp ? 'bottom-full mb-1' : 'top-full mt-1',
            )}
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
                    'flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-foreground transition-colors cursor-pointer',
                    'hover:bg-accent/80 hover:text-accent-foreground',
                    o.value === selected ? 'text-primary font-semibold bg-primary/10' : 'text-slate-700',
                  )}
                >
                  <span className="truncate">{o.label}</span>
                  {o.value === selected && <Check className="size-4 text-primary shrink-0" />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
