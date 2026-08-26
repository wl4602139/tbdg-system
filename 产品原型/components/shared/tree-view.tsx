'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { ChevronDown, ChevronRight, Folder, FolderOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TreeViewNode {
  key: string
  label: ReactNode
  icon?: ReactNode
  badge?: ReactNode
  className?: string
  selected?: boolean
  children?: TreeViewNode[]
  onSelect?: (node: TreeViewNode) => void
}

/* 经典标准树：缩进引导线 + 展开箭头 + 文件夹/节点图标 + 选中高亮 */
export function TreeView({
  data,
  expandedKeys,
  onToggle,
  onSelect,
  className,
}: {
  data: TreeViewNode[]
  expandedKeys?: Record<string, boolean>
  onToggle?: (key: string) => void
  onSelect?: (node: TreeViewNode) => void
  className?: string
}) {
  const [internalExpanded, setInternalExpanded] = useState<Record<string, boolean>>({})

  const isControlled = expandedKeys !== undefined

  const isExpanded = (node: TreeViewNode) =>
    isControlled ? !!expandedKeys[node.key] : (internalExpanded[node.key] ?? true)

  const handleToggle = (key: string) => {
    if (isControlled) onToggle?.(key)
    else setInternalExpanded((prev) => ({ ...prev, [key]: !(prev[key] ?? true) }))
  }

  const renderBranch = (node: TreeViewNode, depth: number) => {
    const hasChildren = !!node.children?.length
    const open = isExpanded(node)
    const selected = !!node.selected

    return (
      <div key={node.key}>
        <div
          onClick={() => {
            if (hasChildren) handleToggle(node.key)
            ;(node.onSelect ?? onSelect)?.(node)
          }}
          className={cn(
            'relative flex min-h-[28px] cursor-pointer select-none items-center gap-1.5 rounded py-[5px] pr-1.5 text-[12px] leading-none transition-colors',
            selected
              ? 'bg-[#e6f4ff] font-semibold text-[#1677ff]'
              : 'text-slate-700 hover:bg-slate-100/70',
            node.className,
          )}
        >
          {depth > 0 && (
            <span className="pointer-events-none absolute left-0 top-1/2 h-px w-[16px] -translate-y-1/2 bg-[#d9d9d9]" />
          )}
          <span className="flex w-[16px] shrink-0 items-center justify-center text-slate-400">
            {hasChildren ? open ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" /> : null}
          </span>
          {node.icon !== undefined ? (
            <span className="flex shrink-0 items-center">{node.icon}</span>
          ) : hasChildren ? (
            <span className="flex shrink-0 items-center text-[#1677ff]">
              {open ? <FolderOpen className="size-3.5" /> : <Folder className="size-3.5" />}
            </span>
          ) : (
            <span className="flex shrink-0 items-center">
              <span className="size-1.5 rounded-full bg-slate-300" />
            </span>
          )}
          <span className="truncate">{node.label}</span>
          {node.badge && <span className="ml-auto shrink-0 pl-2">{node.badge}</span>}
        </div>
        {hasChildren && open && (
          <div className="ml-[20px] border-l border-[#e8e8e8]">
            {node.children!.map((child) => renderBranch(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return <div className={cn('text-xs', className)}>{data.map((node) => renderBranch(node, 0))}</div>
}
