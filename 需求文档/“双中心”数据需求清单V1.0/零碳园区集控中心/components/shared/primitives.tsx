import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/* 面板：既可作为纯容器，也可传 title/desc/actions 自带标题栏 */
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
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card p-4 backdrop-blur-sm',
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
              {title && <h3 className="text-sm font-semibold text-foreground">{title}</h3>}
              {desc && <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>}
            </div>
          </div>
          {actions}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  )
}

/* 面板内标题栏（用于 Panel 作纯容器时手动放置标题） */
export function PanelTitle({
  title,
  subtitle,
  icon: Icon,
  action,
}: {
  title: string
  subtitle?: string
  icon?: LucideIcon
  action?: React.ReactNode
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span className="mt-0.5 h-4 w-1 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
        {Icon && <Icon className="size-4 text-primary" />}
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}

/* KPI 卡片：trend 与 delta 二选一均可 */
export function KpiCard({
  label,
  value,
  unit,
  trend,
  delta,
  up,
  icon: Icon,
}: {
  label: string
  value: string
  unit?: string
  trend?: string
  delta?: string
  up?: boolean
  icon?: LucideIcon
}) {
  const change = trend ?? delta
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-4 backdrop-blur-sm">
      <div className="tech-radial pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-mono text-2xl font-semibold text-foreground text-glow">{value}</span>
            {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
          </div>
          {change && (
            <div
              className={cn(
                'mt-2 flex items-center gap-1 text-xs',
                up ? 'text-[var(--success)]' : 'text-[var(--warning)]',
              )}
            >
              {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
              {change}
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
  tone?: BadgeTone
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
        TONE_CLS[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

/* 兼容旧命名：Badge（tone: default/primary/success/warning/danger） */
export function Badge({
  children,
  tone = 'default',
  className,
}: {
  children: React.ReactNode
  tone?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  className?: string
}) {
  const map: Record<string, BadgeTone> = {
    default: 'muted',
    primary: 'info',
    success: 'ok',
    warning: 'warn',
    danger: 'danger',
  }
  return (
    <StatusBadge tone={map[tone]} className={className}>
      {children}
    </StatusBadge>
  )
}

/* 工具条（筛选/操作区容器） */
export function Toolbar({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mb-4 flex flex-wrap items-end gap-3', className)}>{children}</div>
}

/* 数据表格 */
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
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-xs text-muted-foreground">
            {columns.map((c) => (
              <th
                key={c.key}
                className={cn('whitespace-nowrap px-3 py-2.5 font-medium', alignCls(c.align))}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-border/60 transition-colors last:border-0 hover:bg-accent/40"
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={cn('whitespace-nowrap px-3 py-2.5 text-foreground', alignCls(c.align), c.className)}
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
