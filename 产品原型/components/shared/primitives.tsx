'use client'

import * as React from 'react'
import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight, Activity, Download, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

/* TBEA 风格白底卡片容器 (圆角 8px, 边框 #DBE6EE, 标题 16px 加粗) */
export function Panel({
  title,
  desc,
  icon: Icon,
  actions,
  className,
  bodyClassName,
  children,
}: {
  title?: string
  desc?: string
  icon?: LucideIcon
  actions?: React.ReactNode
  className?: string
  bodyClassName?: string
  children?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'rounded-lg border border-[#DBE6EE] dark:border-border bg-white dark:bg-card p-4 shadow-xs',
        className,
      )}
    >
      {(title || actions) && (
        <div className="mb-3.5 flex items-center justify-between gap-3 border-b border-slate-100 dark:border-border pb-2.5">
          <div className="flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-[#2C7CFF]" />
            {Icon && <Icon className="size-4 text-[#2C7CFF] dark:text-primary" />}
            <div>
              {title && <h3 className="text-base font-bold text-slate-800 dark:text-foreground">{title}</h3>}
            </div>
          </div>
          {actions}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  )
}

/* 标题组件 (16px 加粗) */
export function PanelTitle({
  title,
  subtitle,
  icon: Icon,
  action,
  children,
}: {
  title?: string
  subtitle?: string
  icon?: LucideIcon
  action?: React.ReactNode
  children?: React.ReactNode
}) {
  const displayTitle = title || (typeof children === 'string' ? children : '')
  return (
    <div className="mb-3 flex items-center justify-between gap-3 border-b border-slate-100 dark:border-border pb-2">
      <div className="flex items-center gap-2">
        <span className="h-4 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
        {Icon && <Icon className="size-4 text-[#2C7CFF] dark:text-primary shrink-0" />}
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-foreground">
            {displayTitle || children}
          </h3>
        </div>
      </div>
      {action}
    </div>
  )
}

/* KPI 指标卡片 (标题 14px, 主数值 24px Mono 加粗, 辅助 14px) */
export function KpiCard({
  title,
  label,
  value,
  unit,
  trend,
  delta,
  up,
  tone = 'ok',
  icon: Icon,
  className,
}: {
  title?: string
  label?: string
  value: string | number
  unit?: string
  trend?: string
  delta?: string
  up?: boolean
  tone?: 'ok' | 'info' | 'warn' | 'danger'
  icon?: LucideIcon
  className?: string
}) {
  const displayLabel = title || label || ''
  const change = trend ?? delta

  return (
    <div
      className={cn(
        'rounded-lg border border-[#DBE6EE] dark:border-border bg-white dark:bg-card p-3.5 shadow-xs hover:border-blue-300 dark:hover:border-primary/40 transition-colors',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-slate-600 dark:text-muted-foreground font-medium">{displayLabel}</p>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-bold text-slate-800 dark:text-foreground">
              {value}
            </span>
            {unit && <span className="text-sm text-slate-500 dark:text-muted-foreground font-medium font-sans">{unit}</span>}
          </div>
          {change && (
            <div
              className={cn(
                'inline-flex items-center gap-1 text-sm font-mono font-medium',
                up ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-muted-foreground',
              )}
            >
              {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
              <span>{change}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="rounded-lg bg-blue-50 dark:bg-primary/10 p-2 text-[#2C7CFF] dark:text-primary">
            <Icon className="size-4" />
          </div>
        )}
      </div>
    </div>
  )
}

/* 状态徽章 */
const TONE_CLS = {
  ok: 'border-emerald-200 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  info: 'border-blue-200 dark:border-blue-800/40 bg-blue-50 dark:bg-blue-500/10 text-[#2C7CFF] dark:text-primary',
  warn: 'border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400',
  danger: 'border-rose-200 dark:border-rose-800/40 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400',
  muted: 'border-slate-200 dark:border-border bg-slate-50 dark:bg-secondary/40 text-slate-600 dark:text-muted-foreground',
} as const
export type BadgeTone = keyof typeof TONE_CLS

export function StatusBadge({
  children,
  tone = 'muted',
  className,
}: {
  children: React.ReactNode
  tone?: BadgeTone | 'default' | 'primary' | 'success' | 'warning' | 'danger'
  className?: string
}) {
  const map: Record<string, BadgeTone> = {
    default: 'muted',
    muted: 'muted',
    primary: 'info',
    info: 'info',
    success: 'ok',
    ok: 'ok',
    warning: 'warn',
    warn: 'warn',
    danger: 'danger',
  }
  const mappedTone = map[tone] || 'muted'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.2 text-[11px] font-medium',
        TONE_CLS[mappedTone],
        className,
      )}
    >
      <span>{children}</span>
    </span>
  )
}

export function Badge({
  children,
  tone = 'default',
  className,
}: {
  children: React.ReactNode
  tone?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'ok' | 'info' | 'warn'
  className?: string
}) {
  const map: Record<string, BadgeTone> = {
    default: 'muted',
    primary: 'info',
    info: 'info',
    success: 'ok',
    ok: 'ok',
    warning: 'warn',
    warn: 'warn',
    danger: 'danger',
  }
  const mappedTone = map[tone] || 'muted'
  return (
    <StatusBadge tone={mappedTone} className={className}>
      {children}
    </StatusBadge>
  )
}

export function Toolbar({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mb-4 flex flex-wrap items-center gap-3', className)}>{children}</div>
}

/**
 * 标准工业搜索输入框 (SearchInput)
 * 依据特变电工 UI 规范：宽 200px、高 36px、纯白底色、#E2E8F0 边框、8px 圆角
 * 支持 label 属性：自动以“标题在左，输入框在右”规范呈现
 */
export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  onSearch?: (val: string) => void
  containerClassName?: string
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, containerClassName, placeholder = '请输入搜索关键词', label, onSearch, ...props }, ref) => {
    const inputElement = (
      <div className={cn('relative inline-flex items-center w-[200px] h-9 shrink-0', containerClassName)}>
        <Search className="absolute left-2.5 size-4 text-muted-foreground pointer-events-none" />
        <input
          ref={ref}
          type="text"
          placeholder={placeholder}
          className={cn(
            'w-full h-9 pl-8 pr-3 text-sm rounded-lg border border-[#E2E8F0] dark:border-border bg-white dark:bg-panel text-foreground placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]',
            className
          )}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && onSearch) {
              onSearch((e.target as HTMLInputElement).value)
            }
            props.onKeyDown?.(e)
          }}
          {...props}
        />
      </div>
    )

    if (label) {
      return (
        <div className="inline-flex items-center gap-2">
          <span className="whitespace-nowrap text-sm font-medium text-muted-foreground">{label}</span>
          {inputElement}
        </div>
      )
    }

    return inputElement
  }
)
SearchInput.displayName = 'SearchInput'

type Col = {
  key: string
  label: string
  align?: 'left' | 'right' | 'center'
  className?: string
  render?: (row: any) => React.ReactNode
}
export function DataTable({ columns, rows }: { columns: Col[]; rows: Record<string, any>[] }) {
  const alignCls = (a?: string) =>
    a === 'right' ? 'text-right' : a === 'center' ? 'text-center' : 'text-left'
  return (
    <div className="overflow-x-auto rounded-lg border border-[#DBE6EE] dark:border-border">
      <table className="w-full text-xs text-left">
        <thead className="bg-[#f8fafc] dark:bg-panel text-slate-600 dark:text-muted-foreground border-b border-[#DBE6EE] dark:border-border font-semibold select-none">
          <tr className="h-[44px]">
            {columns.map((c) => (
              <th
                key={c.key}
                className={cn('whitespace-nowrap px-3.5 py-2.5', alignCls(c.align))}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f1f5f9] dark:divide-border/60 font-mono">
          {rows.map((row, i) => (
            <tr key={i}
              className="transition-colors hover:bg-blue-50/40 dark:hover:bg-primary/10 bg-white dark:bg-card h-[44px]"
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={cn('whitespace-nowrap px-3.5 py-2.5 text-slate-800 dark:text-foreground font-sans', alignCls(c.align), c.className)}
                >
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* 页签：实心科技蓝胶囊 Tab 切换 (规范标准: 激活态实心蓝 #2C7CFF + 白字加粗 + 8px 圆角, 未激活纯文本) */
export function Tabs({
  tabs,
  items,
  value,
  onChange,
  className,
}: {
  tabs?: { key?: string; value?: string; label: string }[]
  items?: { key?: string; value?: string; label: string }[]
  value: string
  onChange: (key: string) => void
  className?: string
}) {
  const list = tabs ?? items ?? []
  return (
    <div className={cn('inline-flex items-center gap-1 p-0.5', className)} role="tablist">
      {list.map((t) => {
        const itemKey = t.key ?? t.value ?? ''
        const active = itemKey === value
        return (
          <button
            key={itemKey}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(itemKey)}
            className={cn(
              'rounded-lg px-4 py-1.5 text-sm font-medium transition-all cursor-pointer select-none',
              active
                ? 'bg-[#2C7CFF] text-white font-bold shadow-xs'
                : 'text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground hover:bg-slate-100/60 dark:hover:bg-white/10',
            )}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}

/* 全系统统一导出按钮规格 (80px × 36px, #2C7CFF, 8px 圆角, 白字白图标) */
export function ExportButton({
  onClick,
  disabled,
  title = '导出',
  className,
}: {
  onClick?: () => void
  disabled?: boolean
  title?: string
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-[80px] h-9 rounded-lg bg-[#2C7CFF] hover:bg-[#1f6be8] disabled:opacity-50 text-white text-xs font-medium flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0',
        className
      )}
      title={title}
    >
      <Download className="size-3.5 text-white" />
      <span>{title}</span>
    </button>
  )
}
