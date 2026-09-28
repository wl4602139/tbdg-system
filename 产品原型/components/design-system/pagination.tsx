'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PaginationProps {
  currentPage: number
  totalItems: number
  pageSize?: number
  pageSizeOptions?: number[]
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  showQuickJumper?: boolean
  showSizeChanger?: boolean
  showTotal?: boolean
  className?: string
}

/**
 * 特变电工标准工业分页器 (Pagination)
 * 专为 44px 高密工业数据表格设计，固定 8px 圆角、#2C7CFF 实心高亮、支持每页条数切换与快速跳转
 */
export function Pagination({
  currentPage,
  totalItems,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
  onPageChange,
  onPageSizeChange,
  showQuickJumper = true,
  showSizeChanger = true,
  showTotal = true,
  className,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const [jumpPage, setJumpPage] = React.useState('')

  // 计算带省略号的页码数组
  const getPageNumbers = () => {
    const pages: (number | '...')[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) {
        pages.push('...')
      }
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      if (currentPage < totalPages - 2) {
        pages.push('...')
      }
      pages.push(totalPages)
    }
    return pages
  }

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault()
    const p = parseInt(jumpPage, 10)
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      onPageChange(p)
      setJumpPage('')
    }
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground select-none pt-3',
        className
      )}
    >
      {/* 左侧：总条数与每页条数选择 */}
      <div className="flex items-center gap-3">
        {showTotal && (
          <span className="font-sans">
            共 <strong className="font-mono text-foreground font-semibold">{totalItems}</strong> 条记录
          </span>
        )}
        {showSizeChanger && onPageSizeChange && (
          <div className="relative inline-flex items-center">
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-8 rounded-lg border border-[#E2E8F0] dark:border-border bg-white dark:bg-card px-2.5 pr-6 text-xs text-foreground cursor-pointer transition-colors focus:outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} 条/页
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 右侧：页码切换与快速跳转 */}
      <div className="flex items-center gap-1.5">
        {/* 上一页 */}
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E8F0] dark:border-border bg-white dark:bg-card text-foreground transition-colors hover:border-[#2C7CFF] hover:text-[#2C7CFF] disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          title="上一页"
        >
          <ChevronLeft className="size-4" />
        </button>

        {/* 页码组 */}
        {getPageNumbers().map((page, idx) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${idx}`} className="inline-flex h-8 w-7 items-center justify-center text-muted-foreground font-mono">
                ...
              </span>
            )
          }
          const isActive = page === currentPage
          return (
            <button
              key={`page-${page}`}
              type="button"
              onClick={() => onPageChange(page)}
              className={cn(
                'inline-flex h-8 min-w-8 px-2 items-center justify-center rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer',
                isActive
                  ? 'bg-[#2C7CFF] text-white font-bold shadow-xs'
                  : 'border border-[#E2E8F0] dark:border-border bg-white dark:bg-card text-foreground hover:border-[#2C7CFF] hover:text-[#2C7CFF]'
              )}
            >
              {page}
            </button>
          )
        })}

        {/* 下一页 */}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E8F0] dark:border-border bg-white dark:bg-card text-foreground transition-colors hover:border-[#2C7CFF] hover:text-[#2C7CFF] disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          title="下一页"
        >
          <ChevronRight className="size-4" />
        </button>

        {/* 快速跳转 */}
        {showQuickJumper && (
          <form onSubmit={handleJump} className="ml-2 flex items-center gap-1.5 font-sans">
            <span>前往</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              className="h-8 w-12 rounded-lg border border-[#E2E8F0] dark:border-border bg-white dark:bg-card px-1.5 text-center font-mono text-xs text-foreground transition-colors focus:outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]"
            />
            <span>页</span>
          </form>
        )}
      </div>
    </div>
  )
}
