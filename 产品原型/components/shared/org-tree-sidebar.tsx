'use client'

import { useState, useMemo } from 'react'
import {
  ChevronRight,
  ChevronDown,
  Building2,
  Factory,
  Search,
  Maximize2,
  Minimize2,
  Folder,
  Layers,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type OrgLevel =
  | 'group'
  | 'sector'
  | 'company'
  | 'workshop'
  | 'meter'
  | 'park'
  | 'product_cat'
  | 'product_item'

export interface StandardOrgNode {
  id: string
  name: string
  fullName?: string
  level: OrgLevel
  badge?: string
  active?: boolean
  children?: StandardOrgNode[]
}

/**
 * 严格依据用户官方核定表（media_1787826462298.png）构建的标准企业树状数据结构
 * 6 大一级单位 ➔ 30 个二级单位
 */
export const ENTERPRISE_TREE_DATA: StandardOrgNode[] = [
  {
    id: 'ent_root',
    name: '电装集团',
    fullName: '电装集团',
    level: 'group',
    badge: '全集团',
    children: [
      // 1. 沈变公司 (5个二级单位)
      {
        id: 'comp_sb',
        name: '沈变公司',
        level: 'company',
        badge: '5单位',
        children: [
          { id: 'ws_sb_main', name: '沈变本部', level: 'workshop', badge: '主体' },
          { id: 'ws_sb_zh', name: '智慧能源', level: 'workshop', badge: '综合' },
          { id: 'ws_sb_hx', name: '和新套管公司', level: 'workshop', badge: '主体' },
          { id: 'ws_sb_kj', name: '康嘉互感器', level: 'workshop', badge: '主体' },
          { id: 'ws_sb_yn', name: '印能公司', level: 'workshop' },
        ],
      },
      // 2. 衡变公司 (11个二级单位)
      {
        id: 'comp_hb',
        name: '衡变公司',
        level: 'company',
        badge: '11单位',
        children: [
          { id: 'ws_hb_main', name: '衡变本部', level: 'workshop', badge: '主体' },
          { id: 'ws_hb_nj', name: '南京电研', level: 'workshop', badge: '主体' },
          { id: 'ws_hb_yj', name: '云集电气', level: 'workshop', badge: '主体' },
          { id: 'ws_hb_hn', name: '湖南电气', level: 'workshop', badge: '主体' },
          { id: 'ws_hb_kg', name: '云集高压开关', level: 'workshop', badge: '主体' },
          { id: 'ws_hb_xj', name: '新疆自控', level: 'workshop', badge: '主体' },
          { id: 'ws_hb_sk', name: '上开', level: 'workshop' },
          { id: 'ws_hb_kbe', name: '柯贝尔', level: 'workshop' },
          { id: 'ws_hb_tnj', name: '特能建', level: 'workshop', badge: '主体' },
          {
            id: 'ws_hb_hr',
            name: '合容电气',
            level: 'workshop',
            badge: '主体',
            children: [
              { id: 'ws_hb_hr_gf', name: '合容电气股份', level: 'workshop' },
              { id: 'ws_hb_hr_kg', name: '合容开关', level: 'workshop' },
              { id: 'ws_hb_hr_sb', name: '合容电力设备', level: 'workshop' },
            ],
          },
          { id: 'ws_hb_gil', name: '赛杰爱迪', level: 'workshop', badge: '主体' },
        ],
      },
      // 3. 新变厂 (7个二级单位)
      {
        id: 'comp_xb',
        name: '新变厂',
        level: 'company',
        badge: '7单位',
        children: [
          { id: 'ws_xb_uhv', name: '超高压公司', level: 'workshop', badge: '主体' },
          {
            id: 'ws_xb_tb',
            name: '天变公司',
            level: 'workshop',
            badge: '主体',
            children: [
              { id: 'ws_xb_tb_tj', name: '天变天津基地', level: 'workshop' },
              { id: 'ws_xb_tb_zh', name: '天变智慧能源', level: 'workshop' },
              { id: 'ws_xb_tb_zn', name: '天变智能科技', level: 'workshop' },
              { id: 'ws_xb_tb_hy', name: '天变衡阳基地', level: 'workshop' },
              { id: 'ws_xb_tb_sy', name: '天变沈阳基地', level: 'workshop' },
            ],
          },
          { id: 'ws_xb_zndq', name: '智能电气公司', level: 'workshop', badge: '主体' },
          { id: 'ws_xb_jjj', name: '京津冀公司', level: 'workshop', badge: '主体' },
          { id: 'ws_xb_zf', name: '珠峰硅钢', level: 'workshop', badge: '主体' },
          { id: 'ws_xb_zhny', name: '智慧能源', level: 'workshop' },
          { id: 'ws_xb_yl', name: '银利电气', level: 'workshop' },
        ],
      },
      // 4. 鲁缆公司 (4个二级单位)
      {
        id: 'comp_ll',
        name: '鲁缆公司',
        level: 'company',
        badge: '4单位',
        children: [
          { id: 'ws_ll_main', name: '鲁缆本部', level: 'workshop', badge: '主体' },
          { id: 'ws_ll_zl', name: '智缆公司', level: 'workshop' },
          { id: 'ws_ll_sw', name: '昭和公司', level: 'workshop' },
          { id: 'ws_ll_sg', name: '曙光公司', level: 'workshop', badge: '主体' },
        ],
      },
      // 5. 新缆厂 (2个二级单位)
      {
        id: 'comp_xl',
        name: '新缆厂',
        level: 'company',
        badge: '2单位',
        children: [
          { id: 'ws_xl_main', name: '特变电工新疆电缆有限公司', level: 'workshop', badge: '主体' },
          { id: 'ws_xl_sub', name: '特变电工新疆线缆厂', level: 'workshop', badge: '主体' },
        ],
      },
      // 6. 德缆公司 (1个二级单位)
      {
        id: 'comp_dl',
        name: '德缆公司',
        level: 'company',
        badge: '1单位',
        children: [
          { id: 'ws_dl_main', name: '特变电工（德阳）电缆股份有限公司', level: 'workshop', badge: '主体' },
        ],
      },
    ],
  },
]

export const TBEA_ORG_TREE_DATA = ENTERPRISE_TREE_DATA

export interface OrgTreeSidebarProps {
  selectedNodeId?: string
  selectedId?: string
  onSelectNode?: (node: StandardOrgNode) => void
  onSelect?: (node: StandardOrgNode) => void
  className?: string
}

export function OrgTreeSidebar({
  selectedNodeId,
  selectedId,
  onSelectNode,
  onSelect,
  className,
}: OrgTreeSidebarProps) {
  const currentSelectedId = selectedId || selectedNodeId || 'ws_sb_main'
  const handleSelect = onSelect || onSelectNode || (() => {})

  const [keyword, setKeyword] = useState('')
  const [collapsedKeys, setCollapsedKeys] = useState<Record<string, boolean>>({
    comp_hb: true,
    comp_xb: true,
    comp_ll: true,
    comp_xl: true,
    comp_dl: true,
    ws_hb_hr: true,
    ws_xb_tb: true,
  })

  const toggleCollapse = (id: string) => {
    setCollapsedKeys((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const expandAll = () => {
    setCollapsedKeys({})
  }

  const collapseAll = () => {
    setCollapsedKeys({
      comp_sb: true,
      comp_hb: true,
      comp_xb: true,
      comp_ll: true,
      comp_xl: true,
      comp_dl: true,
      ws_hb_hr: true,
      ws_xb_tb: true,
    })
  }

  // 递归过滤
  const filterNode = (node: StandardOrgNode, kw: string): StandardOrgNode | null => {
    const matches = node.name.toLowerCase().includes(kw) || (node.badge && node.badge.toLowerCase().includes(kw))
    if (!node.children || node.children.length === 0) {
      return matches ? node : null
    }
    const filteredChildren = node.children
      .map((c) => filterNode(c, kw))
      .filter((c): c is StandardOrgNode => c !== null)

    if (matches || filteredChildren.length > 0) {
      return {
        ...node,
        children: filteredChildren,
      }
    }
    return null
  }

  const displayData = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    if (!kw) return ENTERPRISE_TREE_DATA
    return ENTERPRISE_TREE_DATA.map((n) => filterNode(n, kw)).filter((n): n is StandardOrgNode => n !== null)
  }, [keyword])

  const renderTreeNodes = (nodes: StandardOrgNode[], level = 0) => {
    return nodes.map((node) => {
      const hasChildren = node.children && node.children.length > 0
      const isCollapsed = Boolean(collapsedKeys[node.id])
      const isSelected = node.id === currentSelectedId

      return (
        <div key={node.id} className="relative select-none text-[12px]">
          {/* 节点行 */}
          <div
            onClick={() => handleSelect(node)}
            className={cn(
              'flex items-center gap-1.5 py-1 px-1.5 rounded-md cursor-pointer transition-colors relative group',
              isSelected
                ? 'bg-primary/15 text-primary font-semibold shadow-xs'
                : 'hover:bg-accent/50 text-foreground'
            )}
            style={{ paddingLeft: `${level * 14 + 6}px` }}
          >
            {/* 折叠箭头 */}
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleCollapse(node.id)
                }}
                className="size-4 flex items-center justify-center text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
              >
                {isCollapsed ? (
                  <ChevronRight className="size-3.5" />
                ) : (
                  <ChevronDown className="size-3.5" />
                )}
              </button>
            ) : (
              <span className="size-4 shrink-0 flex items-center justify-center">
                <span className="size-1 rounded-full bg-border" />
              </span>
            )}

            {/* 节点图标 */}
            {node.level === 'group' && <Building2 className="size-3.5 text-primary shrink-0" />}
            {node.level === 'company' && <Building2 className="size-3.5 text-amber-400 shrink-0" />}
            {node.level === 'workshop' && <Factory className="size-3.5 text-muted-foreground shrink-0" />}

            {/* 节点名称 */}
            <span className="truncate flex-1" title={node.fullName || node.name}>
              {node.name}
            </span>

            {/* 徽标 */}
            {node.badge && (
              <span
                className={cn(
                  'text-[9.5px] px-1 py-0.2 rounded font-mono shrink-0 scale-95',
                  node.badge === '全集团' && 'bg-primary/20 text-primary border border-primary/30 font-bold',
                  node.badge === '主体' && 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-medium',
                  node.badge === '综合' && 'bg-panel text-muted-foreground font-normal',
                  node.badge.endsWith('单位') && 'bg-panel text-muted-foreground font-medium'
                )}
              >
                {node.badge}
              </span>
            )}
          </div>

          {/* 子节点容器 */}
          {hasChildren && !isCollapsed && (
            <div className="relative border-l border-border ml-3.5 my-0.5">
              {renderTreeNodes(node.children!, level + 1)}
            </div>
          )}
        </div>
      )
    })
  }

  return (
    <aside
      className={cn(
        'w-[270px] min-w-[270px] max-w-[270px] shrink-0 bg-card rounded-xl border border-border backdrop-blur-sm shadow-sm flex flex-col h-[calc(100vh-84px)] sticky top-0 overflow-hidden',
        className
      )}
    >
      {/* 1. 顶部 Header 与 快捷操作 */}
      <div className="p-3 border-b border-border flex items-center justify-between shrink-0 bg-panel">
        <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
          <Building2 className="size-4 text-primary" />
          <span>企业组织拓扑 (6大单位)</span>
        </div>
      </div>

      {/* 2. 搜索框 */}
      <div className="p-2 border-b border-border bg-card shrink-0">
        <div className="relative">
          <Search className="size-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索单位 / 车间 / 工序..."
            className="w-full pl-8 pr-2.5 py-1 text-xs bg-panel border border-border rounded-lg text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground transition-all"
          />
        </div>
      </div>

      {/* 3. 树节点滚动主体 */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {displayData.length > 0 ? (
          renderTreeNodes(displayData)
        ) : (
          <div className="py-8 text-center text-xs text-muted-foreground">未检索到匹配的组织或单位</div>
        )}
      </div>
    </aside>
  )
}
