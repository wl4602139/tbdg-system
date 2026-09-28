'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import {
  Building2,
  Factory,
  ChevronRight,
  ChevronDown,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  ENTERPRISE_TREE_DATA,
  type StandardOrgNode,
} from '@/components/shared/standard-org-tree'

export interface OrgTreeSelectProps {
  value?: string
  onChange?: (value: string, node?: StandardOrgNode) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  required?: boolean
  id?: string
}

export function OrgTreeSelect({
  value = '',
  onChange,
  placeholder = '请选择所属机构',
  className,
  disabled = false,
}: OrgTreeSelectProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // 默认展开所有分支，便于用户直接在下拉列表中浏览与点选
  const defaultExpanded = useMemo(() => {
    const set = new Set<string>()
    const walk = (nodes: StandardOrgNode[]) => {
      nodes.forEach((n) => {
        set.add(n.id)
        if (n.children) walk(n.children)
      })
    }
    walk(ENTERPRISE_TREE_DATA)
    return set
  }, [])

  const [expandedIds, setExpandedIds] = useState<Set<string>>(defaultExpanded)

  // 点击外部收起下拉框
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 展开/折叠分支
  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // 选中节点：设值并立即收起下拉框（标准 Select 交互）
  const handleSelectNode = (node: StandardOrgNode) => {
    onChange?.(node.name, node)
    setOpen(false)
  }

  // 递归渲染树形下拉选项
  const renderTreeOptions = (node: StandardOrgNode, depth = 0) => {
    const hasChildren = Boolean(node.children && node.children.length > 0)
    const isExpanded = expandedIds.has(node.id)
    const isSelected = value === node.name || value === node.id
    const Icon = node.level === 'group' || node.level === 'company' ? Building2 : Factory

    return (
      <div key={node.id} className="w-full">
        <div
          role="option"
          aria-selected={isSelected}
          onClick={() => handleSelectNode(node)}
          style={{ paddingLeft: `${depth * 14 + 6}px` }}
          className={cn(
            'flex w-full items-center justify-between gap-1.5 rounded-sm py-1.5 pr-2.5 text-left text-sm transition-colors cursor-pointer select-none',
            isSelected
              ? 'bg-primary/10 text-primary font-medium'
              : 'text-popover-foreground hover:bg-accent hover:text-accent-foreground',
            node.unconnected && 'opacity-60',
          )}
        >
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            {/* 折叠/展开小箭头 */}
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => toggleExpand(node.id, e)}
                className="size-4 flex items-center justify-center rounded hover:bg-muted text-muted-foreground shrink-0 transition-transform cursor-pointer"
                title={isExpanded ? '折叠' : '展开'}
              >
                {isExpanded ? (
                  <ChevronDown className="size-3.5" />
                ) : (
                  <ChevronRight className="size-3.5" />
                )}
              </button>
            ) : (
              <span className="size-4 shrink-0" />
            )}

            {/* 语义图标 */}
            <Icon className={cn('size-3.5 shrink-0', isSelected ? 'text-primary' : 'text-muted-foreground')} />

            {/* 机构名称 */}
            <span className="truncate">{node.name}</span>

            {/* 级别标签（极简浅色徽章） */}
            {node.badge && (
              <span
                className={cn(
                  'text-[10px] px-1 py-0 rounded font-normal shrink-0 border ml-1',
                  node.badge === '全集团'
                    ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10'
                    : node.badge.includes('公司')
                      ? 'border-blue-500/30 text-blue-400 bg-blue-500/10'
                      : 'border-border/60 text-muted-foreground bg-muted/40',
                )}
              >
                {node.badge}
              </span>
            )}
          </div>

          {/* 选中指示勾选 */}
          {isSelected && <Check className="size-4 text-primary shrink-0" />}
        </div>

        {/* 子节点列表 */}
        {hasChildren && isExpanded && (
          <div className="w-full">
            {node.children!.map((child) => renderTreeOptions(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn('relative w-full', className)} ref={containerRef}>
      {/* 触发下拉按钮 - 严格对齐系统标准 Select 组件尺寸与质感 */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-border bg-panel px-3 text-sm text-foreground transition-colors',
          'hover:border-primary/60 focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer select-none text-left',
          open && 'border-primary ring-2 ring-ring',
          disabled && 'opacity-60 cursor-not-allowed bg-muted',
        )}
      >
        <span className={cn('truncate flex-1 min-w-0', !value && 'text-muted-foreground')}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={cn(
            'size-4 text-muted-foreground transition-transform duration-200 shrink-0',
            open && 'rotate-180 text-primary',
          )}
        />
      </button>

      {/* 下拉菜单列表 - 标准 Select 下拉容器，紧贴输入框，等宽呈现 */}
      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-full z-50 mt-1 max-h-60 w-full min-w-full overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-xl shadow-black/40 backdrop-blur custom-scrollbar"
        >
          {ENTERPRISE_TREE_DATA.map((node) => renderTreeOptions(node, 0))}
        </div>
      )}
    </div>
  )
}
