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
  unconnected?: boolean // 🌟 不具备数据接入条件的单位，界面置灰
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
      // 1. 沈变公司 (5个项目公司)
      {
        id: 'comp_sb',
        name: '沈变公司',
        level: 'company',
        badge: '5公司',
        children: [
          { id: 'ws_sb_main', name: '沈变本部', fullName: '特变电工沈阳变压器集团本部', level: 'workshop', badge: '主体' },
          { id: 'ws_sb_zh', name: '智慧能源', fullName: '沈变智慧能源中心', level: 'workshop', badge: '未接入', unconnected: true },
          { id: 'ws_sb_hx', name: '和新套管', fullName: '特变电工沈变和新高压套管', level: 'workshop', badge: '主体' },
          { id: 'ws_sb_kj', name: '康嘉互感器', fullName: '沈变康嘉互感器制造部', level: 'workshop', badge: '主体' },
          { id: 'ws_sb_yn', name: '印能公司', fullName: '沈变印能电气制造分厂', level: 'workshop', badge: '未接入', unconnected: true },
        ],
      },
      // 2. 衡变公司 (9个项目公司)
      {
        id: 'comp_hb',
        name: '衡变公司',
        level: 'company',
        badge: '9公司',
        children: [
          { id: 'ws_hb_main', name: '衡变本部', fullName: '特变电工衡阳变压器本部', level: 'workshop', badge: '主体' },
          { id: 'ws_hb_nj', name: '南京公司', fullName: '特变电工南京智能电气有限公司', level: 'workshop', badge: '主体' },
          { id: 'ws_hb_yj', name: '云集电气', fullName: '特变电工云集5G智能成套设备', level: 'workshop', badge: '主体' },
          { id: 'ws_hb_hn', name: '湖南电气', fullName: '特变电工湖南电气装备制造部', level: 'workshop', badge: '主体' },
          {
            id: 'ws_hb_kg',
            name: '云集高压开关',
            fullName: '特变电工云集高压开关有限公司',
            level: 'workshop',
            badge: '2三级单位',
            children: [
              { id: 'ws_hb_kg_yj', name: '云集', fullName: '云集制造基地', level: 'workshop', badge: '三级单位' },
              { id: 'ws_hb_sk', name: '上开', fullName: '上海开件制造厂', level: 'workshop', badge: '三级单位' },
            ],
          },
          { id: 'ws_hb_xj', name: '新疆自控', fullName: '特变电工新疆自控成套车间', level: 'workshop', badge: '主体' },
          { id: 'ws_hb_tnj', name: '特缆建', fullName: '特变电工湖南能电建设园区', level: 'workshop', badge: '主体' },
          {
            id: 'ws_hb_hr',
            name: '合容电气',
            fullName: '特变电工合容电气有限公司',
            level: 'workshop',
            badge: '2三级单位',
            children: [
              { id: 'ws_hb_kbe', name: '科贝尔', fullName: '科贝尔高压材料基地', level: 'workshop', badge: '三级单位' },
              { id: 'ws_hb_hr_xa', name: '合容西安基地', fullName: '合容西安智能装备基地', level: 'workshop', badge: '三级单位' },
            ],
          },
          { id: 'ws_hb_gil', name: '事杰爱迪', fullName: '特变电工事杰爱迪GIL公司', level: 'workshop', badge: '主体' },
        ],
      },
      // 3. 新变厂 (7个项目公司)
      {
        id: 'comp_xb',
        name: '新变厂',
        level: 'company',
        badge: '7公司',
        children: [
          { id: 'ws_xb_uhv', name: '超高压公司', fullName: '特变电工新疆超高压制造中心', level: 'workshop', badge: '主体' },
          {
            id: 'ws_xb_tb',
            name: '天变公司',
            fullName: '特变电工天津变压器有限公司',
            level: 'workshop',
            badge: '5三级单位',
            children: [
              { id: 'ws_xb_tb_tj', name: '天变天津基地', fullName: '天变天津生产基地', level: 'workshop', badge: '三级单位' },
              { id: 'ws_xb_tb_zh', name: '天变智慧能源', fullName: '天变智慧能源制造中心', level: 'workshop', badge: '三级单位' },
              { id: 'ws_xb_tb_zn', name: '天变智能科技', fullName: '天变智能科技研发制造中心', level: 'workshop', badge: '三级单位' },
              { id: 'ws_xb_tb_hy', name: '天变衡阳基地', fullName: '天变衡阳干变车间', level: 'workshop', badge: '三级单位' },
              { id: 'ws_xb_tb_sy', name: '天变沈阳基地', fullName: '天变沈阳特变基地', level: 'workshop', badge: '三级单位' },
            ],
          },
          { id: 'ws_xb_zndq', name: '智能电气', fullName: '特变电工智能电气配变车间', level: 'workshop', badge: '主体' },
          { id: 'ws_xb_jjj', name: '京津冀科技', fullName: '特变电工京津冀智能科技产业基地', level: 'workshop', badge: '主体' },
          { id: 'ws_xb_zf', name: '珠峰硅钢', fullName: '珠峰硅钢精密冲剪退火制造部', level: 'workshop', badge: '主体' },
          { id: 'ws_xb_zhny', name: '智慧能源', fullName: '新变智慧能源综合能管部', level: 'workshop', badge: '未接入', unconnected: true },
          { id: 'ws_xb_yl', name: '银利电气', fullName: '特变电工银利智能电气制造厂', level: 'workshop', badge: '未接入', unconnected: true },
        ],
      },
      // 4. 鲁缆公司 (1个项目公司 · 3个三级单位)
      {
        id: 'comp_ll',
        name: '鲁缆公司',
        level: 'company',
        badge: '1公司',
        children: [
          {
            id: 'ws_ll_comp',
            name: '鲁缆公司',
            fullName: '特变电工山东鲁能泰山电缆有限公司',
            level: 'workshop',
            badge: '3三级单位',
            children: [
              { id: 'ws_ll_main', name: '鲁缆本部', fullName: '鲁缆本部高压交联立塔制造部', level: 'workshop', badge: '主体' },
              { id: 'ws_ll_sw', name: '昭和', fullName: '特变电工昭和高压电缆附件制造厂', level: 'workshop', badge: '三级单位' },
              { id: 'ws_ll_sg', name: '曙光', fullName: '特变电工曙光特种电缆分厂', level: 'workshop', badge: '未接入', unconnected: true },
            ],
          },
        ],
      },
      // 5. 新缆厂 (1个项目公司 · 2个三级单位)
      {
        id: 'comp_xl',
        name: '新缆厂',
        level: 'company',
        badge: '1公司',
        children: [
          {
            id: 'ws_xl_comp',
            name: '新缆厂',
            fullName: '特变电工新疆线缆厂制造总厂',
            level: 'workshop',
            badge: '2三级单位',
            children: [
              { id: 'ws_xl_sub', name: '新疆线缆厂', fullName: '特变电工新疆特种线缆制造厂', level: 'workshop', badge: '主体' },
              { id: 'ws_xl_main', name: '新疆电缆', fullName: '特变电工新疆电缆实业公司', level: 'workshop', badge: '主体' },
            ],
          },
        ],
      },
      // 6. 德缆公司 (1个项目公司 · 无三级单位)
      {
        id: 'comp_dl',
        name: '德缆公司',
        level: 'company',
        badge: '1公司',
        children: [
          { id: 'ws_dl_main', name: '德缆公司', fullName: '特变电工（德阳）电缆股份有限公司', level: 'workshop', badge: '主体' },
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
    ws_hb_kg: true,
    ws_hb_hr: true,
    ws_xb_tb: true,
    ws_ll_comp: true,
    ws_xl_comp: true,
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
      ws_hb_kg: true,
      ws_hb_hr: true,
      ws_xb_tb: true,
      ws_ll_comp: true,
      ws_xl_comp: true,
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

      const isUnconnected = Boolean(node.unconnected)

      return (
        <div key={node.id} className="relative select-none text-[12px]">
          {/* 节点行 */}
          <div
            onClick={() => {
              if (!isUnconnected) {
                handleSelect(node)
              }
            }}
            className={cn(
              'flex items-center gap-1.5 py-1 px-1.5 rounded-md transition-colors relative group',
              isUnconnected
                ? 'opacity-35 text-slate-400 dark:text-slate-500 cursor-not-allowed select-none bg-transparent hover:bg-transparent'
                : isSelected
                ? 'bg-primary/15 text-primary font-semibold shadow-xs cursor-pointer'
                : 'hover:bg-accent/50 text-foreground cursor-pointer'
            )}
            title={isUnconnected ? `${node.name} (暂不具备数据接入条件 · 不允许选择)` : (node.fullName || node.name)}
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
              {node.name.replace(/\s*\(.*?\)/g, '')}
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
