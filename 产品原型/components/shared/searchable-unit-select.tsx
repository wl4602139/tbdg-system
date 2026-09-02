'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { Check, ChevronDown, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface UnitOption {
  id: string
  name: string
  company?: string
}

interface SearchableUnitSelectProps {
  options: UnitOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function SearchableUnitSelect({
  options,
  value,
  onChange,
  placeholder = '全部所属单位',
  className,
  disabled = false,
}: SearchableUnitSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 当下拉展开时，自动聚焦输入框并重置过滤词
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
    } else {
      setQuery('')
    }
  }, [open])

  // 点击外部自动收起
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 判断是否包含多个不同企业（若包含则展示企业辅助标签）
  const hasMultipleCompanies = useMemo(() => {
    const companies = new Set(options.map((o) => o.company).filter(Boolean))
    return companies.size > 1
  }, [options])

  // 模糊匹配过滤
  const filteredOptions = useMemo(() => {
    if (!query.trim()) return options
    const q = query.trim().toLowerCase()
    return options.filter((opt) => {
      const matchName = opt.name.toLowerCase().includes(q)
      const matchCompany = opt.company ? opt.company.toLowerCase().includes(q) : false
      return matchName || matchCompany
    })
  }, [options, query])

  // 当前选中的显示文本
  const currentLabel = useMemo(() => {
    if (value === 'all' || !value) return placeholder
    const found = options.find((o) => o.name === value || o.id === value)
    return found ? found.name : value
  }, [value, options, placeholder])

  const handleSelect = (val: string) => {
    onChange(val)
    setOpen(false)
  }

  return (
    <div className={cn('relative inline-block font-sans', className)} ref={containerRef}>
      {/* 触发按钮 */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 shadow-2xs',
          'flex items-center justify-between gap-2 min-w-[200px] max-w-[260px] text-left transition-colors cursor-pointer select-none',
          'hover:border-blue-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200',
          open && 'border-blue-500 ring-1 ring-blue-200',
          disabled && 'opacity-60 cursor-not-allowed bg-slate-50',
        )}
      >
        <span className={cn('truncate', value === 'all' || !value ? 'text-slate-800 font-medium' : 'text-slate-900 font-semibold')}>
          {currentLabel}
        </span>
        <ChevronDown
          className={cn('size-3.5 text-slate-400 shrink-0 transition-transform duration-200', open && 'rotate-180 text-blue-500')}
        />
      </button>

      {/* 下拉面板 */}
      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 min-w-[280px] max-w-[340px] rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-100 flex flex-col">
          {/* 🌟 顶部模糊匹配搜索框 */}
          <div className="p-2 border-b border-slate-100 bg-slate-50/80 sticky top-0 z-10">
            <div className="relative flex items-center">
              <Search className="pointer-events-none absolute left-2.5 size-3.5 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="输入单位名称模糊搜索..."
                className="h-7 w-full rounded-md border border-slate-200 bg-white pl-8 pr-7 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none shadow-2xs"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    inputRef.current?.focus()
                  }}
                  className="absolute right-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title="清空搜索"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* 选项列表 */}
          <div className="max-h-64 overflow-y-auto custom-scrollbar p-1">
            {/* 全部单位通用选项 */}
            <button
              type="button"
              onClick={() => handleSelect('all')}
              className={cn(
                'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left cursor-pointer mb-0.5',
                value === 'all' || !value
                  ? 'bg-blue-50 text-[#1677ff] font-bold'
                  : 'text-slate-700 hover:bg-slate-100 font-medium',
              )}
            >
              <span>全部所属单位</span>
              {(value === 'all' || !value) && <Check className="size-3.5 text-[#1677ff] shrink-0" />}
            </button>

            {/* 匹配的单位列表 */}
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                未找到匹配的单位名称
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = value === opt.name || value === opt.id
                return (
                  <button
                    key={opt.id || opt.name}
                    type="button"
                    onClick={() => handleSelect(opt.name)}
                    className={cn(
                      'w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left cursor-pointer group',
                      isSelected
                        ? 'bg-blue-50 text-[#1677ff] font-bold'
                        : 'text-slate-700 hover:bg-slate-100 font-medium',
                    )}
                  >
                    <span className="truncate flex-1 text-slate-800 group-hover:text-slate-900 font-medium">
                      {opt.name}
                    </span>
                    {hasMultipleCompanies && opt.company && (
                      <span className="text-[10px] text-slate-400 group-hover:text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded font-normal shrink-0">
                        {opt.company}
                      </span>
                    )}
                    {isSelected && <Check className="size-3.5 text-[#1677ff] shrink-0 ml-1" />}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
