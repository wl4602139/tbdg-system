'use client'

import * as React from 'react'
import { Search, ChevronDown, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ENERGY_MEDIA_TOKENS, TOU_PERIOD_TOKENS } from './tokens'

/**
 * 1. 标准 200px × 36px 搜索输入框 (SearchInput)
 * 依据特变电工 UI 规范：宽 200px、高 36px、纯白底色、#E2E8F0 边框、8px 圆角
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
            'w-full h-9 pl-8 pr-3 text-sm rounded-lg border border-[#E2E8F0] dark:border-border bg-white dark:bg-card text-foreground placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]',
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

/**
 * 2. 标准 200px × 36px 下拉选择框 (StandardSelect)
 */
export interface StandardSelectProps {
  value?: string
  onChange?: (val: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function StandardSelect({
  value,
  onChange,
  options,
  placeholder = '请选择',
  className,
  disabled = false,
}: StandardSelectProps) {
  return (
    <div className={cn('relative inline-flex items-center w-[200px] h-9 shrink-0', className)}>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          'w-full h-9 px-3 pr-8 text-sm rounded-lg border border-[#E2E8F0] dark:border-border bg-white dark:bg-card text-foreground transition-colors appearance-none cursor-pointer focus:outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF] disabled:opacity-50 disabled:cursor-not-allowed',
        )}
      >
        {placeholder && !value && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 size-4 text-muted-foreground pointer-events-none" />
    </div>
  )
}

/**
 * 3. 极简单行工业空状态 (EmptyState)
 * 严格遵循反冗余与客观中立原则，杜绝冗长自述与说教文案，仅输出单行干练结论
 */
export interface EmptyStateProps {
  type?: 'process' | 'product' | 'record' | 'device' | 'custom'
  text?: string
  className?: string
}

export function EmptyState({ type = 'record', text, className }: EmptyStateProps) {
  let displayText = text
  if (!displayText) {
    switch (type) {
      case 'process':
        displayText = '暂无相关工序！'
        break
      case 'product':
        displayText = '暂无相关产品！'
        break
      case 'device':
        displayText = '暂无相关设备！'
        break
      case 'record':
      default:
        displayText = '暂无相关记录！'
        break
    }
  }

  return (
    <div className={cn('w-full py-8 flex items-center justify-center text-sm text-slate-400 dark:text-muted-foreground select-none', className)}>
      <span>{displayText}</span>
    </div>
  )
}

/**
 * 4. 8 大能源介质彩色徽章与呼吸指示点 (EnergyBadge & EnergyDot)
 */
export function EnergyDot({ media, className }: { media: string; className?: string }) {
  const token = ENERGY_MEDIA_TOKENS[media]
  const color = token ? token.color : '#2C7CFF'
  return (
    <span
      className={cn('inline-block size-2 rounded-full shrink-0', className)}
      style={{ backgroundColor: color }}
    />
  )
}

export function EnergyBadge({
  media,
  showUnit = false,
  className,
}: {
  media: string
  showUnit?: boolean
  className?: string
}) {
  const token = ENERGY_MEDIA_TOKENS[media]
  if (!token) return null

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border border-border/40 select-none',
        className
      )}
      style={{
        backgroundColor: `${token.color}15`,
        color: token.color,
        borderColor: `${token.color}35`,
      }}
    >
      <span className="size-1.5 rounded-full" style={{ backgroundColor: token.color }} />
      <span>{token.name}</span>
      {showUnit && <span className="opacity-70 text-[11px] font-mono">({token.unit})</span>}
    </span>
  )
}

/**
 * 5. 4 段分时电量 (TOU) 专用徽章 (TouBadge)
 */
export function TouBadge({
  period,
  className,
}: {
  period: 'sharp' | 'peak' | 'flat' | 'valley'
  className?: string
}) {
  const token = TOU_PERIOD_TOKENS[period]
  if (!token) return null

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border select-none',
        className
      )}
      style={{
        backgroundColor: `${token.color}15`,
        color: token.color,
        borderColor: `${token.color}30`,
      }}
    >
      <span className="size-1.5 rounded-full" style={{ backgroundColor: token.color }} />
      <span>{token.name}</span>
    </span>
  )
}

/**
 * 6. 客观时序与基准对比指示器 (BenchmarkIndicator)
 * 严格保持客观中立，仅展示量化数值与升降趋势，严禁主观评级或说教建议
 */
export function BenchmarkIndicator({
  label = '同比',
  value,
  delta,
  up,
  reverse = false, // 默认下降为好(绿色节能)，上升为差(橙红超标)
  className,
}: {
  label?: string
  value?: string | number
  delta?: string
  up?: boolean
  reverse?: boolean
  className?: string
}) {
  const displayDelta = delta ?? (typeof value === 'string' ? value : '')
  const isPositive = reverse ? !up : up
  // 能源场景：下降是节约(绿)，上升是消耗增加(橙红)
  const isGreen = reverse ? isPositive : !isPositive

  return (
    <div className={cn('inline-flex items-center gap-1 text-sm font-mono', className)}>
      {label && <span className="text-muted-foreground font-sans text-xs">{label}</span>}
      <div
        className={cn(
          'flex items-center gap-0.5 font-medium',
          isGreen ? 'text-[var(--success)]' : 'text-[var(--warning)]'
        )}
      >
        {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
        <span>{displayDelta}</span>
      </div>
    </div>
  )
}

/**
 * 7. 标准工业开关 (Switch)
 * 宽 36px、高 20px，开启态 #2C7CFF，关闭态中性底色，平滑滑动动画
 */
export interface SwitchProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  label?: string
  className?: string
}

export function Switch({
  checked = false,
  onChange,
  disabled = false,
  label,
  className,
}: SwitchProps) {
  return (
    <label
      className={cn(
        'inline-flex items-center gap-2 cursor-pointer select-none',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange?.(!checked)}
        className={cn(
          'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#2C7CFF]/40 cursor-pointer',
          checked ? 'bg-[#2C7CFF]' : 'bg-slate-300 dark:bg-slate-700'
        )}
      >
        <span
          className={cn(
            'inline-block size-3.5 transform rounded-full bg-white transition-transform shadow-xs',
            checked ? 'translate-x-4.5' : 'translate-x-1'
          )}
        />
      </button>
      {label && <span className="text-sm font-medium text-foreground">{label}</span>}
    </label>
  )
}

/**
 * 8. 标准工业复选框 (Checkbox)
 * 16×16px (size-4)，4px 圆角，勾选态 #2C7CFF 填充与白色勾选
 */
export interface CheckboxProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  label?: string
  className?: string
}

export function Checkbox({
  checked = false,
  onChange,
  disabled = false,
  label,
  className,
}: CheckboxProps) {
  return (
    <label
      className={cn(
        'inline-flex items-center gap-2 cursor-pointer select-none text-sm text-foreground',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <span
        role="checkbox"
        aria-checked={checked}
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && onChange?.(!checked)}
        onKeyDown={(e) => {
          if ((e.key === ' ' || e.key === 'Enter') && !disabled) {
            e.preventDefault()
            onChange?.(!checked)
          }
        }}
        className={cn(
          'size-4 shrink-0 rounded border flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#2C7CFF]/40',
          checked
            ? 'bg-[#2C7CFF] border-[#2C7CFF] text-white'
            : 'border-[#CBD5E1] dark:border-border bg-white dark:bg-card hover:border-[#2C7CFF]'
        )}
      >
        {checked && (
          <svg className="size-3 fill-none stroke-current stroke-[2.5]" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      {label && <span className="font-medium">{label}</span>}
    </label>
  )
}

