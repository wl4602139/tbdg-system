'use client'

import type { LucideIcon } from 'lucide-react'
import * as React from 'react'
import { ArrowDownRight, ArrowUpRight, ChevronUp, ChevronDown, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

/* 面板：既可作为纯容器，也可传 title/desc/actions 自带标题栏 (圆角 8px, 标题 16px 加粗) */
export function Panel({
  title,
  desc,
  icon: Icon,
  actions,
  className,
  bodyClassName,
  children,
}: {
  title?: React.ReactNode
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
        'rounded-lg border border-border bg-card p-4 backdrop-blur-sm',
        'shadow-[0_1px_0_0_oklch(0.8_0.1_220/8%)_inset]',
        className,
      )}
    >
      {(title || actions) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="h-4 w-1 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
            {Icon && <Icon className="size-4 text-primary" />}
            <div>
              {title && <h3 className="text-base font-bold text-foreground">{title}</h3>}
            </div>
          </div>
          {actions}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  )
}

/* 面板内标题栏（用于 Panel 作纯容器时手动放置标题，16px 加粗） */
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
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span className="mt-0.5 h-4 w-1 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
        {Icon && <Icon className="size-4 text-primary" />}
        <div>
          <h3 className="text-base font-bold text-foreground">{displayTitle || children}</h3>
        </div>
      </div>
      {action}
    </div>
  )
}

/* KPI 卡片：trend 与 delta 二选一均可，兼容 title / label (标题 14px, 主数值 24px Mono 加粗, 辅助 14px) */
export function KpiCard({
  title,
  label,
  value,
  unit,
  trend,
  delta,
  up,
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
  const displayLabel = label || title || ''
  const change = trend ?? delta
  return (
    <div className={cn('relative overflow-hidden rounded-lg border border-border bg-card p-4 backdrop-blur-sm', className)}>
      <div className="tech-radial pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{displayLabel}</p>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-bold text-foreground text-glow">{value}</span>
            {unit && <span className="text-sm text-muted-foreground font-sans">{unit}</span>}
          </div>
          {change && (
            <div
              className={cn(
                'mt-2 flex items-center gap-1 text-sm font-mono font-medium',
                up ? 'text-[var(--success)]' : 'text-[var(--warning)]',
              )}
            >
              {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
              <span>{change}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="rounded-lg border border-border bg-primary/10 p-2">
            <Icon className="size-5 text-primary" />
          </div>
        )}
      </div>
    </div>
  )
}

/* 语义徽章基类 */
const TONE_CLS = {
  ok: 'border-[var(--success)]/30 bg-[var(--success)]/10 text-[var(--success)]',
  info: 'border-primary/30 bg-primary/10 text-primary',
  warn: 'border-[var(--warning)]/30 bg-[var(--warning)]/10 text-[var(--warning)]',
  danger: 'border-[var(--destructive)]/30 bg-[var(--destructive)]/10 text-[var(--destructive)]',
  muted: 'border-border bg-muted text-muted-foreground',
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
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
        TONE_CLS[mappedTone],
        className,
      )}
    >
      {children}
    </span>
  )
}

/* 兼容旧命名：Badge */
export function Badge({
  children,
  tone = 'default',
  className,
}: {
  children: React.ReactNode
  tone?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'ok' | 'info' | 'warn'
  className?: string
}) {
  return (
    <StatusBadge tone={tone} className={className}>
      {children}
    </StatusBadge>
  )
}

/* 工具条（筛选/操作区容器） */
export function Toolbar({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mb-4 flex flex-wrap items-end gap-3', className)}>{children}</div>
}

/* 页签：实心科技蓝胶囊 Tab 切换 (规范标准: 激活态实心胶囊 + 8px 圆角, 未激活纯文本) */
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
        const itemKey = t.value ?? t.key ?? ''
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
                ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/40',
            )}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}

/* 数据表格 (圆角 8px, 44px 行高) */
type Col = {
  key: string
  label: string
  align?: 'left' | 'right' | 'center'
  className?: string
  sortable?: boolean
  render?: (row: any) => React.ReactNode
}
export function DataTable({ columns, rows }: { columns: Col[]; rows: Record<string, any>[] }) {
  const alignCls = (a?: string) =>
    a === 'right' ? 'text-right' : a === 'center' ? 'text-center' : 'text-left'
  const [sort, setSort] = React.useState<{ key: string; dir: 'asc' | 'desc' } | null>(null)

  const sortedRows = React.useMemo(() => {
    if (!sort) return rows
    const arr = [...rows]
    arr.sort((a, b) => {
      const va = a[sort.key]
      const vb = b[sort.key]
      let cmp: number
      if (typeof va === 'number' && typeof vb === 'number') cmp = va - vb
      else cmp = String(va ?? '').localeCompare(String(vb ?? ''), 'zh-CN')
      return sort.dir === 'asc' ? cmp : -cmp
    })
    return arr
  }, [rows, sort])

  function toggleSort(key: string) {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: 'desc' }
      if (prev.dir === 'desc') return { key, dir: 'asc' }
      return null
    })
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-xs text-muted-foreground bg-panel h-[44px]">
            {columns.map((c) => {
              const active = sort?.key === c.key
              return (
                <th
                  key={c.key}
                  className={cn('whitespace-nowrap px-3.5 py-3 font-medium', alignCls(c.align))}
                >
                  {c.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(c.key)}
                      className={cn(
                        'inline-flex items-center gap-1 transition-colors hover:text-foreground',
                        c.align === 'right' && 'flex-row-reverse',
                        active && 'text-primary',
                      )}
                    >
                      {c.label}
                      <span className="flex flex-col leading-[0.5]">
                        <ChevronUp className={cn('size-2.5', active && sort?.dir === 'asc' ? 'text-primary' : 'text-muted-foreground/40')} />
                        <ChevronDown className={cn('size-2.5', active && sort?.dir === 'desc' ? 'text-primary' : 'text-muted-foreground/40')} />
                      </span>
                    </button>
                  ) : (
                    c.label
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, i) => (
            <tr key={i}
              className="border-b border-border/50 transition-colors last:border-0 hover:bg-accent/40 h-[44px]"
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={cn('whitespace-nowrap px-3.5 py-3 text-foreground font-sans', alignCls(c.align), c.className)}
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
