'use client'

import { cn } from '@/lib/utils'

/* 系统管理模块统一的输入框样式 */
export const inputCls =
  'h-9 w-full rounded-md border border-border bg-panel px-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-ring placeholder:text-muted-foreground'

/* 表单字段容器 */
export function Field({
  label,
  required,
  hint,
  children,
  className,
}: {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <label className={cn('grid gap-1.5', className)}>
      <span className="text-xs text-muted-foreground">
        {label}
        {required && <span className="ml-0.5 text-[var(--destructive)]">*</span>}
      </span>
      {children}
      {hint && <span className="text-[11px] text-muted-foreground/80">{hint}</span>}
    </label>
  )
}

/* 内容区次级操作栏 */
export function ActionBtn({
  children,
  onClick,
  variant = 'ghost',
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'ghost' | 'danger'
}) {
  const cls =
    variant === 'primary'
      ? 'bg-primary text-primary-foreground hover:opacity-90'
      : variant === 'danger'
        ? 'border border-[var(--destructive)]/40 text-[var(--destructive)] hover:bg-[var(--destructive)]/10'
        : 'border border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors', cls)}
    >
      {children}
    </button>
  )
}
