'use client'

import React, { useState, useMemo, useEffect } from 'react'
import type { ReactNode } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Search,
  X,
  PlusSquare,
  MinusSquare,
  Building2,
  Factory,
  Layers,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  fullGroupOrgTree,
  industryOrgTree,
  transformerIndustryNode,
  cableIndustryNode,
  type OrgNode,
  filterOrg,
  findOrgNode,
  getAllOrgKeys,
} from '@/lib/org'

export interface TreeViewNode {
  key: string
  label: ReactNode
  title?: string
  icon?: ReactNode
  badge?: ReactNode
  className?: string
  selected?: boolean
  children?: TreeViewNode[]
  onSelect?: (node: TreeViewNode) => void
  raw?: any
}

export interface TreeViewProps {
  data: TreeViewNode[]
  expandedKeys?: Record<string, boolean>
  onToggle?: (key: string) => void
  onSelect?: (node: TreeViewNode) => void
  selectedKey?: string
  className?: string
  defaultExpandAll?: boolean
  showSearch?: boolean
  searchPlaceholder?: string
  showControls?: boolean
  showLines?: boolean
  headerTitle?: string
  headerSubtitle?: string
}

/* ============================================================
 * 1. 经典工业级导线连接拓扑树 (Show-Line Tree)
 * 包含模糊搜索、全部展开/折叠、经典导线连接样式
 * ============================================================ */
export function TreeView({
  data,
  expandedKeys: controlledExpandedKeys,
  onToggle,
  onSelect,
  selectedKey,
  className,
  defaultExpandAll = false,
  showSearch = false,
  searchPlaceholder = '模糊搜索单位/车间/测点...',
  showControls = false,
  showLines = true,
  headerTitle,
  headerSubtitle,
}: TreeViewProps) {
  const [internalExpanded, setInternalExpanded] = useState<Record<string, boolean>>({})
  const [searchKw, setSearchKw] = useState('')

  // 收集所有节点的 key
  const allKeys = useMemo(() => {
    const keys: string[] = []
    function collect(nodes: TreeViewNode[]) {
      for (const n of nodes) {
        keys.push(n.key)
        if (n.children && n.children.length > 0) collect(n.children)
      }
    }
    collect(data)
    return keys
  }, [data])

  // 初始化展开状态
  useEffect(() => {
    if (defaultExpandAll && allKeys.length > 0) {
      const map: Record<string, boolean> = {}
      for (const k of allKeys) map[k] = true
      setInternalExpanded(map)
    }
  }, [defaultExpandAll, allKeys])

  const isControlled = controlledExpandedKeys !== undefined

  const isExpanded = (node: TreeViewNode) => {
    if (searchKw.trim()) return true // 搜索状态下默认全部展开命中路径
    return isControlled
      ? !!controlledExpandedKeys[node.key]
      : (internalExpanded[node.key] ?? defaultExpandAll)
  }

  const handleToggle = (key: string) => {
    if (isControlled) {
      onToggle?.(key)
    } else {
      setInternalExpanded((prev) => ({
        ...prev,
        [key]: !(prev[key] ?? defaultExpandAll),
      }))
    }
  }

  const handleExpandAll = () => {
    const map: Record<string, boolean> = {}
    for (const k of allKeys) map[k] = true
    if (isControlled) {
      for (const k of allKeys) onToggle?.(k)
    } else {
      setInternalExpanded(map)
    }
  }

  const handleCollapseAll = () => {
    const map: Record<string, boolean> = {}
    for (const k of allKeys) map[k] = false
    if (isControlled) {
      for (const k of allKeys) onToggle?.(k)
    } else {
      setInternalExpanded(map)
    }
  }

  // 递归过滤节点
  const filteredData = useMemo(() => {
    if (!searchKw.trim()) return data
    const kw = searchKw.trim().toLowerCase()

    function filterTree(nodes: TreeViewNode[]): TreeViewNode[] {
      const res: TreeViewNode[] = []
      for (const n of nodes) {
        const textToMatch = (
          n.title ||
          (typeof n.label === 'string' ? n.label : '') ||
          n.key
        ).toLowerCase()
        const isMatch = textToMatch.includes(kw)
        const childMatches = n.children ? filterTree(n.children) : []

        if (isMatch || childMatches.length > 0) {
          res.push({
            ...n,
            children: childMatches.length > 0 ? childMatches : n.children,
          })
        }
      }
      return res
    }

    return filterTree(data)
  }, [data, searchKw])

  // 渲染单个节点与导线分支
  const renderBranch = (node: TreeViewNode, depth: number, isLast: boolean, parentLines: boolean[] = []) => {
    const hasChildren = !!node.children?.length
    const open = isExpanded(node)
    const isSelected = selectedKey ? selectedKey === node.key : !!node.selected

    return (
      <div key={node.key} className="relative select-none text-[12px]">
        {/* 节点行 */}
        <div
          onClick={(e) => {
            e.stopPropagation()
            if (hasChildren) handleToggle(node.key)
            ;(node.onSelect ?? onSelect)?.(node)
          }}
          className={cn(
            'group relative flex min-h-[28px] cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 transition-all duration-150',
            isSelected
              ? 'bg-[#e6f4ff] font-semibold text-[#1677ff] shadow-xs'
              : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
          )}
          style={{ paddingLeft: `${depth * 18 + 6}px` }}
        >
          {/* 水平分支连接线 (Show-Line) */}
          {showLines && depth > 0 && (
            <span
              className="pointer-events-none absolute h-px border-t border-dashed border-slate-300"
              style={{
                left: `${depth * 18 - 10}px`,
                width: '12px',
                top: '50%',
              }}
            />
          )}

          {/* 展开/折叠 Switcher */}
          <span
            onClick={(e) => {
              e.stopPropagation()
              handleToggle(node.key)
            }}
            className="flex size-4 shrink-0 items-center justify-center rounded text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition-colors"
          >
            {hasChildren ? (
              <ChevronRight
                className={cn('size-3.5 transition-transform duration-150', open && 'rotate-90 text-[#1677ff]')}
              />
            ) : (
              <span className="size-1.5 rounded-full bg-slate-300" />
            )}
          </span>

          {/* 节点图标 */}
          {node.icon !== undefined ? (
            <span className="flex shrink-0 items-center justify-center text-xs">{node.icon}</span>
          ) : hasChildren ? (
            <span className="flex shrink-0 items-center text-[#1677ff]">
              {open ? <FolderOpen className="size-3.5" /> : <Folder className="size-3.5" />}
            </span>
          ) : null}

          {/* 节点标题 */}
          <span className="flex-1 truncate leading-tight font-sans">{node.label}</span>

          {/* 节点徽标 Badge */}
          {node.badge && (
            <span className="ml-auto shrink-0 pl-1 font-mono text-[10px]">{node.badge}</span>
          )}
        </div>

        {/* 子节点容器 (垂直引导线) */}
        {hasChildren && open && (
          <div className="relative">
            {showLines && (
              <span
                className="pointer-events-none absolute border-l border-dashed border-slate-300"
                style={{
                  left: `${depth * 18 + 14}px`,
                  top: '0px',
                  bottom: '14px',
                }}
              />
            )}
            {node.children!.map((child, idx) =>
              renderBranch(
                child,
                depth + 1,
                idx === node.children!.length - 1,
                [...parentLines, !isLast]
              )
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden', className)}>
      {/* 头部标题与控制栏 */}
      {(headerTitle || showControls) && (
        <div className="flex items-center justify-between px-3 py-2.5 bg-slate-50/80 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <Layers className="size-3.5 text-[#1677ff] shrink-0" />
            <span className="text-xs font-bold text-slate-800 truncate">{headerTitle || '组织拓扑树'}</span>
            {headerSubtitle && (
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">{headerSubtitle}</span>
            )}
          </div>

          {showControls && (
            <div className="flex items-center gap-1 shrink-0 text-[11px]">
              <button
                type="button"
                onClick={handleExpandAll}
                className="px-1.5 py-0.5 rounded text-slate-500 hover:text-[#1677ff] hover:bg-slate-100 transition-colors flex items-center gap-0.5"
                title="全部展开"
              >
                <PlusSquare className="size-3" />
                <span className="hidden sm:inline">全展开</span>
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={handleCollapseAll}
                className="px-1.5 py-0.5 rounded text-slate-500 hover:text-[#1677ff] hover:bg-slate-100 transition-colors flex items-center gap-0.5"
                title="全部折叠"
              >
                <MinusSquare className="size-3" />
                <span className="hidden sm:inline">全折叠</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* 模糊搜索框 */}
      {showSearch && (
        <div className="p-2 border-b border-slate-100 bg-white shrink-0">
          <div className="relative">
            <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchKw}
              onChange={(e) => setSearchKw(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-slate-50 border border-slate-200 rounded-md py-1.5 pl-8 pr-7 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#1677ff] focus:outline-none transition-all"
            />
            {searchKw && (
              <button
                type="button"
                onClick={() => setSearchKw('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 树体滚动区域 */}
      <div className="flex-1 overflow-y-auto p-1.5 custom-scrollbar">
        {filteredData.length > 0 ? (
          filteredData.map((node, idx) =>
            renderBranch(node, 0, idx === filteredData.length - 1)
          )
        ) : (
          <div className="py-8 text-center text-xs text-slate-400">未找到匹配单位或车间</div>
        )}
      </div>
    </div>
  )
}

/* ============================================================
 * 2. 预置的特变电工标准 3 级组织拓扑树组件 (OrgTopologyTree)
 * 直接注入：2大产业板块 + 6大公司 + 26工厂车间工序
 * ============================================================ */
export function OrgTopologyTree({
  onSelect,
  selectedName = '电装集团',
  className,
  defaultExpandAll = true,
  showSearch = true,
  showControls = true,
  title = '工厂与用能拓扑 (3级)',
  subtitle = '全层级穿透',
}: {
  onSelect?: (name: string, node?: OrgNode) => void
  selectedName?: string
  className?: string
  defaultExpandAll?: boolean
  showSearch?: boolean
  showControls?: boolean
  title?: string
  subtitle?: string
}) {
  // 将 OrgNode[] 递归转换为 TreeViewNode[]
  const treeData = useMemo<TreeViewNode[]>(() => {
    function mapNode(node: OrgNode): TreeViewNode {
      const isGroup = node.level === 0
      const isIndustry = node.level === 1
      const isCompany = node.level === 2
      const isWorkshop = node.level === 3

      let iconNode: ReactNode = '🏭'
      if (isGroup) {
        iconNode = <Building2 className="size-3.5 text-[#1677ff]" />
      } else if (isIndustry) {
        iconNode = <Layers className={cn('size-3.5', node.industry === 'cable' ? 'text-emerald-600' : 'text-blue-500')} />
      } else if (isCompany) {
        iconNode = <Factory className={cn('size-3.5', node.industry === 'cable' ? 'text-emerald-600' : 'text-amber-500')} />
      }

      return {
        key: node.name,
        title: `${node.name} ${node.fullName || ''} ${node.badge || ''}`,
        label: (
          <span className={cn(isGroup && 'font-bold text-slate-900', isIndustry && 'font-bold text-slate-800', isCompany && 'font-medium')}>
            {node.name}
          </span>
        ),
        icon: iconNode,
        badge: node.badge ? (
          <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
            {node.badge}
          </span>
        ) : undefined,
        raw: node,
        children: node.children?.map(mapNode),
      }
    }

    return [mapNode(fullGroupOrgTree)]
  }, [])

  return (
    <TreeView
      data={treeData}
      selectedKey={selectedName}
      onSelect={(node) => {
        onSelect?.(node.key, node.raw as OrgNode)
      }}
      className={className}
      defaultExpandAll={defaultExpandAll}
      showSearch={showSearch}
      showControls={showControls}
      headerTitle={title}
      headerSubtitle={subtitle}
    />
  )
}

