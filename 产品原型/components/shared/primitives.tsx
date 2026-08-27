import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

/* TBEA 风格白底卡片容器 */
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
        'rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-xs',
        className,
      )}
    >
      {(title || actions) && (
        <div className="mb-3.5 flex items-center justify-between gap-3 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="h-3.5 w-1 rounded-full bg-[#1677ff]" />
            {Icon && <Icon className="size-4 text-[#1677ff]" />}
            <div>
              {title && <h3 className="text-xs font-bold text-slate-800">{title}</h3>}
              {desc && <p className="text-[11px] text-slate-500">{desc}</p>}
            </div>
          </div>
          {actions}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  )
}

/* 标题组件 */
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
    <div className="mb-3 flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
      <div className="flex items-center gap-2">
        <span className="h-3.5 w-1 rounded-full bg-[#1677ff] shrink-0" />
        {Icon && <Icon className="size-4 text-[#1677ff] shrink-0" />}
        <div>
          <h3 className="text-xs font-bold text-slate-800">
            {displayTitle || children}
          </h3>
          {subtitle && <p className="text-[11px] text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}

/* KPI 指标卡片（参考图2中上部 KPI 设计） */
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
        'rounded-lg border border-[#e5e7eb] bg-white p-3.5 shadow-xs hover:border-blue-300 transition-colors',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs text-slate-500 font-medium">{displayLabel}</p>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl font-bold text-slate-800">
              {value}
            </span>
            {unit && <span className="text-xs text-slate-500 font-medium">{unit}</span>}
          </div>
          {change && (
            <div
              className={cn(
                'inline-flex items-center gap-1 text-[11px] font-mono font-medium',
                up ? 'text-emerald-600' : 'text-slate-600',
              )}
            >
              {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
              <span>{change}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="rounded-lg bg-blue-50 p-2 text-[#1677ff]">
            <Icon className="size-4" />
          </div>
        )}
      </div>
    </div>
  )
}

/* 状态徽章 */
const TONE_CLS = {
  ok: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  info: 'border-blue-200 bg-blue-50 text-[#1677ff]',
  warn: 'border-amber-200 bg-amber-50 text-amber-700',
  danger: 'border-rose-200 bg-rose-50 text-rose-700',
  muted: 'border-slate-200 bg-slate-50 text-slate-600',
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
  return <div className={cn('mb-3.5 flex flex-wrap items-center gap-2.5', className)}>{children}</div>
}

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
    <div className="overflow-x-auto rounded-lg border border-[#e5e7eb]">
      <table className="w-full text-xs text-left">
        <thead className="bg-[#f8fafc] text-slate-600 border-b border-[#e5e7eb] font-semibold">
          <tr>
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
        <tbody className="divide-y divide-[#f1f5f9] font-mono">
          {rows.map((row, i) => (
            <tr
              key={i}
              className="transition-colors hover:bg-blue-50/40 bg-white"
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={cn('whitespace-nowrap px-3.5 py-2.5 text-slate-800 font-sans', alignCls(c.align), c.className)}
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
