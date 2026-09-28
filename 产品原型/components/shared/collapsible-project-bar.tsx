'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ProjectItem {
  id: string
  name: string
  displayName: string
  fullName: string
  stationGroup?: string
}

export interface CollapsibleProjectBarProps {
  items: ProjectItem[]
  activeItem?: string
  onSelect: (item: ProjectItem) => void
  className?: string
}

export function CollapsibleProjectBar({
  items = [],
  activeItem,
  onSelect,
  className,
}: CollapsibleProjectBarProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const [visibleCount, setVisibleCount] = useState<number>(items.length)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  // 1. 响应式计算当前单行可用宽度内最多能容纳的项目标签数
  useEffect(() => {
    const calculateVisible = () => {
      if (!wrapperRef.current || !measureRef.current) return
      const availableW = wrapperRef.current.clientWidth
      if (availableW <= 0) return

      const children = Array.from(measureRef.current.children) as HTMLElement[]
      if (children.length === 0) return

      // measureRef 最后一个子元素为“更多”按钮
      const moreBtn = children[children.length - 1]
      const moreBtnW = moreBtn ? moreBtn.offsetWidth : 68
      const itemElements = children.slice(0, children.length - 1)

      const gap = 4 // gap-1 = 4px

      let totalW = 0
      for (let i = 0; i < itemElements.length; i++) {
        totalW += itemElements[i].offsetWidth + (i > 0 ? gap : 0)
      }

      // 如果全部项目能直接在单行容纳
      if (totalW <= availableW) {
        setVisibleCount(items.length)
        return
      }

      // 超出单行时，扣除“更多”按钮预留空间进行贪心截断
      const budget = availableW - moreBtnW - gap - 4
      let accW = 0
      let count = 0
      for (let i = 0; i < itemElements.length; i++) {
        const nextW = accW + itemElements[i].offsetWidth + (i > 0 ? gap : 0)
        if (nextW <= budget) {
          accW = nextW
          count++
        } else {
          break
        }
      }
      setVisibleCount(Math.max(1, count))
    }

    calculateVisible()

    const ro = new ResizeObserver(() => {
      calculateVisible()
    })

    if (wrapperRef.current) {
      ro.observe(wrapperRef.current)
    }

    return () => {
      ro.disconnect()
    }
  }, [items, activeItem])

  // 2. 点击外部区域或按 Escape 键关闭浮层
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
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

  if (!items || items.length === 0) return null

  const hasOverflow = visibleCount < items.length
  const activeIdx = items.findIndex((p) => p.name === activeItem)

  // 如果当前激活的项目位于被折叠的后半段，将其提权到可见区域末尾，确保激活态始终可见
  let visibleItems: ProjectItem[] = []
  if (!hasOverflow) {
    visibleItems = items
  } else if (activeIdx >= visibleCount && activeIdx !== -1) {
    visibleItems = [...items.slice(0, Math.max(1, visibleCount - 1)), items[activeIdx]]
  } else {
    visibleItems = items.slice(0, visibleCount)
  }

  return (
    <div
      ref={wrapperRef}
      className={cn('relative min-w-0 flex-1 flex justify-end', isOpen ? 'z-50' : 'z-10', className)}
    >
      {/* 真实渲染单行项目切换栏 (严格单行不换行，超出后展示更多按钮) */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900/60 p-0.5 rounded-lg border border-slate-200 dark:border-border text-xs font-sans flex-nowrap overflow-hidden max-w-full">
        {visibleItems.map((proj) => {
          const isActive = proj.name === activeItem
          return (
            <button
              key={proj.name}
              type="button"
              onClick={() => onSelect(proj)}
              className={cn(
                'px-3 py-1.5 rounded-md transition-all cursor-pointer font-bold text-xs whitespace-nowrap select-none flex items-center gap-1 shrink-0',
                isActive
                  ? 'bg-white dark:bg-[#2C7CFF] text-[#2C7CFF] dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
              )}
              title={proj.fullName}
            >
              <span>{proj.displayName}</span>
            </button>
          )
        })}

        {/* “更多”按钮：仅在项目超长无法单行完全容纳时显示 */}
        {hasOverflow && (
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className={cn(
              'px-2.5 py-1.5 rounded-md transition-all cursor-pointer font-bold text-xs whitespace-nowrap select-none flex items-center gap-1 shrink-0',
              isOpen
                ? 'bg-white dark:bg-[#2C7CFF] text-[#2C7CFF] dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-[#2C7CFF] dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800',
            )}
            title="查看全部项目"
          >
            <span>更多</span>
            <ChevronDown
              className={cn('size-3.5 transition-transform duration-200', isOpen && 'rotate-180')}
            />
          </button>
        )}
      </div>

      {/* 隐藏的离屏测量容器：用于精准测量每个项目按钮及更多按钮的实际像素宽度 */}
      <div
        ref={measureRef}
        aria-hidden="true"
        className="absolute left-[-9999px] top-[-9999px] invisible pointer-events-none flex items-center gap-1 whitespace-nowrap p-0.5"
      >
        {items.map((proj) => (
          <button
            key={proj.name}
            type="button"
            tabIndex={-1}
            className="px-3 py-1.5 rounded-md font-bold text-xs whitespace-nowrap"
          >
            <span>{proj.displayName}</span>
          </button>
        ))}
        <button
          type="button"
          tabIndex={-1}
          className="px-2.5 py-1.5 rounded-md font-bold text-xs whitespace-nowrap flex items-center gap-1"
        >
          <span>更多</span>
          <ChevronDown className="size-3.5" />
        </button>
      </div>

      {/* 🌟 浮层：点击“更多”后弹出展示全部项目 (强制实心不透明、最高层级 z-50、抗穿透) */}
      {isOpen && (
        <div
          ref={popoverRef}
          className="tbea-popover-panel absolute right-0 top-full mt-2 z-50 p-4 bg-white dark:bg-[#0c1826] border border-slate-200 dark:border-[#1e3b56] rounded-xl shadow-2xl min-w-[340px] max-w-[680px] max-h-[460px] flex flex-col font-sans animate-in fade-in zoom-in-95 duration-150"
          style={{ maxWidth: 'calc(100vw - 32px)' }}
        >
          {/* 浮层 Header */}
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100 dark:border-[#1e3b56] shrink-0">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-100">
              <span className="size-2 rounded-full bg-[#2C7CFF] dark:bg-[#00B9E5]" />
              <span>全部项目</span>
              <span className="text-[11px] text-slate-400 dark:text-slate-400 font-mono font-normal">
                (共 {items.length} 个)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[11px] text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer transition-colors px-2 py-0.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#152738]"
            >
              <span>收起</span>
              <ChevronUp className="size-3" />
            </button>
          </div>

          {/* 浮层项目列表 */}
          <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[320px] pr-1">
            {items.map((proj) => {
              const isActive = proj.name === activeItem
              return (
                <button
                  key={proj.name}
                  type="button"
                  onClick={() => {
                    onSelect(proj)
                    setIsOpen(false)
                  }}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-left flex items-center gap-2 border select-none',
                    isActive
                      ? 'bg-blue-50 dark:bg-[#00B9E5]/15 text-[#2C7CFF] dark:text-[#00D4FF] border-[#2C7CFF] dark:border-[#00D4FF] shadow-xs'
                      : 'bg-slate-50 dark:bg-[#122232] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-[#1d354b] hover:bg-blue-50/60 dark:hover:bg-[#1a334d] dark:hover:text-white dark:hover:border-[#00D4FF]/50',
                  )}
                  title={proj.fullName}
                >
                  <span
                    className={cn(
                      'size-1.5 rounded-full shrink-0',
                      isActive ? 'bg-[#2C7CFF] dark:bg-[#00D4FF]' : 'bg-slate-300 dark:bg-slate-500',
                    )}
                  />
                  <span className="truncate max-w-[420px]">{proj.displayName}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
