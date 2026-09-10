'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CollapsibleTagBarProps {
  items: string[]
  activeItem?: string
  onSelect: (item: string) => void
  colorTheme?: 'amber' | 'cyan' | 'purple'
  className?: string
}

export function CollapsibleTagBar({
  items = [],
  activeItem,
  onSelect,
  colorTheme = 'cyan',
  className,
}: CollapsibleTagBarProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const [visibleCount, setVisibleCount] = useState<number>(items.length)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [popoverWidth, setPopoverWidth] = useState<number | null>(null)

  // Calculate visible tag count on container resize or items change
  useEffect(() => {
    const calculateVisible = () => {
      if (!containerRef.current || !measureRef.current) return
      const containerW = containerRef.current.clientWidth
      if (containerW <= 0) return

      const children = Array.from(measureRef.current.children) as HTMLElement[]
      if (children.length === 0) return

      // The last child in measureRef is the more button
      const moreBtn = children[children.length - 1]
      const moreBtnW = moreBtn ? moreBtn.offsetWidth : 68
      const itemElements = children.slice(0, children.length - 1)

      const gap = 6 // gap-1.5 = 6px

      // Calculate total width of all tags
      let totalW = 0
      for (let i = 0; i < itemElements.length; i++) {
        totalW += itemElements[i].offsetWidth + (i > 0 ? gap : 0)
      }

      // If all items fit within container width
      if (totalW <= containerW) {
        setVisibleCount(items.length)
        return
      }

      // Need space for more button
      const availableW = containerW - moreBtnW - gap - 4
      let accW = 0
      let count = 0
      for (let i = 0; i < itemElements.length; i++) {
        const nextW = accW + itemElements[i].offsetWidth + (i > 0 ? gap : 0)
        if (nextW <= availableW) {
          accW = nextW
          count++
        } else {
          break
        }
      }
      setVisibleCount(Math.max(1, count))
    }

    calculateVisible()

    const resizeObserver = new ResizeObserver(() => {
      calculateVisible()
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [items])

  // Dynamically compute popover width so it NEVER exceeds card boundary or screen edge
  useEffect(() => {
    if (!isOpen) return

    const updatePopoverWidth = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()

      // Find nearest parent card / panel container
      const card = containerRef.current.closest('.bg-card, .bg-panel, [class*="rounded-xl"]') as HTMLElement | null
      let maxAvailable = window.innerWidth - rect.left - 24

      if (card) {
        const cardRect = card.getBoundingClientRect()
        const cardInnerRight = cardRect.right - 16 // 16px card right padding
        const insideCard = cardInnerRight - rect.left
        if (insideCard > 220) {
          maxAvailable = Math.min(maxAvailable, insideCard)
        }
      }

      // Ideal max width is 960px, strictly bounded by maxAvailable, min 280px
      const targetWidth = Math.max(280, Math.min(960, Math.floor(maxAvailable)))
      setPopoverWidth(targetWidth)
    }

    updatePopoverWidth()

    window.addEventListener('resize', updatePopoverWidth)
    return () => {
      window.removeEventListener('resize', updatePopoverWidth)
    }
  }, [isOpen])

  // Close dropdown on click outside or Escape
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  // If items empty, render nothing
  if (!items || items.length === 0) return null

  const hasOverflow = visibleCount < items.length

  // Determine visible items: if activeItem is beyond visibleCount, elevate activeItem so it stays visible
  const activeIdx = activeItem ? items.indexOf(activeItem) : -1
  let visibleItems: string[] = []
  if (!hasOverflow) {
    visibleItems = items
  } else if (activeIdx >= visibleCount && activeIdx !== -1) {
    // Keep activeItem visible by placing it at the end of visible row
    visibleItems = [...items.slice(0, Math.max(1, visibleCount - 1)), activeItem]
  } else {
    visibleItems = items.slice(0, visibleCount)
  }

  // Tag styling helper
  const getTagClass = (isActive: boolean) => {
    if (colorTheme === 'amber') {
      return cn(
        'text-[11px] font-bold px-2.5 py-0.5 rounded-full border transition-all cursor-pointer shadow-2xs select-none flex items-center gap-1 shrink-0 whitespace-nowrap',
        isActive
          ? 'text-white bg-amber-500 dark:bg-amber-500 bg-amber-600 border-amber-500 dark:border-amber-500 border-amber-600 shadow-xs scale-105'
          : 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/15 hover:bg-amber-100 dark:hover:bg-amber-500/25 border-amber-200 dark:border-amber-500/30'
      )
    }
    if (colorTheme === 'purple') {
      return cn(
        'text-[11px] font-bold px-2.5 py-0.5 rounded-full border transition-all cursor-pointer shadow-2xs select-none flex items-center gap-1 shrink-0 whitespace-nowrap',
        isActive
          ? 'text-white bg-purple-600 dark:bg-purple-500 border-purple-500 shadow-xs scale-105'
          : 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-500/15 hover:bg-purple-100 dark:hover:bg-purple-500/25 border-purple-200 dark:border-purple-500/30'
      )
    }
    // Default cyan
    return cn(
      'text-[11px] font-bold px-2.5 py-0.5 rounded-full border transition-all cursor-pointer shadow-2xs select-none flex items-center gap-1 shrink-0 whitespace-nowrap',
      isActive
        ? 'text-white bg-cyan-600 border-cyan-500 shadow-xs scale-105'
        : 'text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/15 hover:bg-cyan-100 dark:hover:bg-cyan-500/25 border-cyan-200 dark:border-cyan-500/30'
    )
  }

  const getDotClass = () => {
    if (colorTheme === 'amber') return 'size-1.5 rounded-full bg-cyan-400 dark:bg-cyan-400 bg-white animate-pulse'
    if (colorTheme === 'purple') return 'size-1.5 rounded-full bg-cyan-400 dark:bg-cyan-400 bg-white animate-pulse'
    return 'size-1.5 rounded-full bg-amber-400 dark:bg-amber-400 bg-white animate-pulse'
  }

  return (
    <div className={cn('relative min-w-0 flex-1', className)}>
      {/* Real visible container - strictly single-line, overflow-hidden */}
      <div
        ref={containerRef}
        className="flex items-center gap-1.5 overflow-hidden flex-nowrap w-full"
      >
        {visibleItems.map((item) => {
          const isActive = item === activeItem
          return (
            <button
              key={item}
              type="button"
              onClick={() => onSelect(item)}
              className={getTagClass(isActive)}
            >
              {isActive && <span className={getDotClass()} />}
              <span>{item}</span>
            </button>
          )
        })}

        {/* More Button */}
        {hasOverflow && (
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className={cn(
              'text-[11px] font-bold px-2.5 py-0.5 rounded-full border transition-all cursor-pointer shadow-2xs select-none flex items-center gap-1 shrink-0 whitespace-nowrap',
              isOpen
                ? 'text-white bg-primary border-primary shadow-xs'
                : 'text-muted-foreground hover:text-foreground bg-panel hover:bg-muted/80 border-border/80 hover:border-border'
            )}
            title="查看全部标签"
          >
            <span>更多</span>
            <ChevronDown className={cn('size-3 transition-transform duration-200', isOpen && 'rotate-180')} />
          </button>
        )}
      </div>

      {/* Hidden container for accurate DOM width measurement */}
      <div
        ref={measureRef}
        aria-hidden="true"
        className="absolute left-[-9999px] top-[-9999px] invisible pointer-events-none flex items-center gap-1.5 whitespace-nowrap"
      >
        {items.map((item) => {
          const isActive = item === activeItem
          return (
            <button
              key={item}
              type="button"
              tabIndex={-1}
              className={getTagClass(isActive)}
            >
              {isActive && <span className={getDotClass()} />}
              <span>{item}</span>
            </button>
          )
        })}
        <button
          type="button"
          tabIndex={-1}
          className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 shrink-0 whitespace-nowrap"
        >
          <span>更多</span>
          <ChevronDown className="size-3" />
        </button>
      </div>

      {/* Dropdown Popover Panel for All Tags - strictly bounded inside card and screen */}
      {isOpen && (
        <div
          ref={popoverRef}
          style={{
            width: popoverWidth ? `${popoverWidth}px` : undefined,
            maxWidth: 'calc(100vw - 32px)',
          }}
          className="absolute left-0 top-full mt-2 z-50 p-4 bg-card border border-border rounded-xl shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-border/60">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <span className="h-3 w-1 rounded-full bg-primary" />
              <span>全部标签</span>
              <span className="text-[11px] text-muted-foreground font-mono font-normal">
                (共 {items.length} 项)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer transition-colors px-2 py-0.5 rounded-lg hover:bg-muted"
            >
              <span>收起</span>
              <ChevronUp className="size-3" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto pr-1">
            {items.map((item) => {
              const isActive = item === activeItem
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    onSelect(item)
                    setIsOpen(false)
                  }}
                  className={getTagClass(isActive)}
                >
                  {isActive && <span className={getDotClass()} />}
                  <span>{item}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
