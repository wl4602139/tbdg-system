'use client'

import { useState, useMemo, useEffect } from 'react'
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
  Trees,
  MapPin,
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
 * 🏢 企业组织拓扑数据 (6 大一级单位 ➔ 30 个二级单位)
 */
export const ENTERPRISE_TREE_DATA: StandardOrgNode[] = [
  {
    id: 'ent_root',
    name: '电装集团',
    fullName: '电装集团',
    level: 'group',
    badge: '全集团',
    children: [
      // 1. 沈变公司 (6个二级单位)
      {
        id: 'comp_sb',
        name: '沈变公司',
        level: 'company',
        badge: '6单位',
        children: [
          { id: 'ws_sb_main', name: '沈变本部', level: 'workshop', badge: '主体' },
          { id: 'ws_sb_luna', name: '露娜公司 (特变电工露娜智能)', level: 'workshop', badge: '智能' },
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
          { id: 'ws_hb_hr', name: '合容电气', level: 'workshop', badge: '主体' },
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
          { id: 'ws_xb_tb', name: '天变公司', level: 'workshop', badge: '主体' },
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

/**
 * 🏞️ 零碳园区拓扑数据 (严格依据官方核定表构建：1级集团 ➔ 2级所属园区 ➔ 3级二级单位)
 * 15 个零碳产业园区 ➔ 包含对应的二级单位（及所属三级单位）
 */
export const PARK_ORG_TREE_DATA: StandardOrgNode[] = [
  {
    id: 'park_root',
    name: '电装集团',
    fullName: '特变电工电装集团 (15 零碳园区)',
    level: 'group',
    badge: '15园区',
    children: [
      // 1. 特变电工东北输变电产业园 (4个二级单位)
      {
        id: 'park_01',
        name: '特变电工东北输变电产业园',
        fullName: '特变电工东北输变电产业园',
        level: 'park',
        badge: '沈阳',
        children: [
          { id: 'park_01_sb', name: '沈变本部', fullName: '沈变本部', level: 'workshop', badge: '主体' },
          { id: 'park_01_zh', name: '智慧能源', fullName: '智慧能源', level: 'workshop', badge: '主体' },
          { id: 'park_01_hx', name: '和新套管公司', fullName: '和新套管公司', level: 'workshop', badge: '主体' },
          { id: 'park_01_kj', name: '康嘉互感器', fullName: '康嘉互感器', level: 'workshop', badge: '主体' },
        ],
      },
      // 2. 特变电工南方输变电产业园 (1个二级单位)
      {
        id: 'park_02',
        name: '特变电工南方输变电产业园',
        fullName: '特变电工南方输变电产业园',
        level: 'park',
        badge: '衡阳',
        children: [
          { id: 'park_02_hb', name: '衡变本部', fullName: '衡变本部', level: 'workshop', badge: '主体' },
        ],
      },
      // 3. 特变电工二次产业园区 (1个二级单位)
      {
        id: 'park_03',
        name: '特变电工二次产业园区',
        fullName: '特变电工二次产业园区',
        level: 'park',
        badge: '南京',
        children: [
          { id: 'park_03_nj', name: '南京电研', fullName: '南京电研', level: 'workshop', badge: '主体' },
        ],
      },
      // 4. 特变电工云集5G科技产业园 (3个二级单位)
      {
        id: 'park_04',
        name: '特变电工云集5G科技产业园',
        fullName: '特变电工云集5G科技产业园',
        level: 'park',
        badge: '衡阳',
        children: [
          { id: 'park_04_yj', name: '云集电气', fullName: '云集电气', level: 'workshop', badge: '主体' },
          { id: 'park_04_hn', name: '湖南电气', fullName: '湖南电气', level: 'workshop', badge: '主体' },
          { id: 'park_04_kg', name: '云集高压开关', fullName: '云集高压开关', level: 'workshop', badge: '主体' },
        ],
      },
      // 5. 特变电工智能电气产业园 (2个二级单位)
      {
        id: 'park_05',
        name: '特变电工智能电气产业园',
        fullName: '特变电工智能电气产业园',
        level: 'park',
        badge: '昌吉',
        children: [
          { id: 'park_05_xj', name: '新疆自控', fullName: '新疆自控', level: 'workshop', badge: '主体' },
          { id: 'park_05_zn', name: '智能电气公司', fullName: '智能电气公司', level: 'workshop', badge: '主体' },
        ],
      },
      // 6. 特变电工湖南能源建设园区 (1个二级单位)
      {
        id: 'park_06',
        name: '特变电工湖南能源建设园区',
        fullName: '特变电工湖南能源建设园区',
        level: 'park',
        badge: '衡阳',
        children: [
          { id: 'park_06_tnj', name: '特能建', fullName: '特能建', level: 'workshop', badge: '主体' },
        ],
      },
      // 7. 特变电工西安智能装备产业园 (1个二级单位，含3个三级单位)
      {
        id: 'park_07',
        name: '特变电工西安智能装备产业园',
        fullName: '特变电工西安智能装备产业园',
        level: 'park',
        badge: '西安',
        children: [
          {
            id: 'park_07_hr',
            name: '合容电气',
            fullName: '合容电气',
            level: 'workshop',
            badge: '主体',
            children: [
              { id: 'park_07_hr_gf', name: '合容电气股份', fullName: '合容电气股份', level: 'workshop' },
              { id: 'park_07_hr_kg', name: '合容开关', fullName: '合容开关', level: 'workshop' },
              { id: 'park_07_hr_sb', name: '合容电力设备', fullName: '合容电力设备', level: 'workshop' },
            ],
          },
        ],
      },
      // 8. 特变电工GIL产业园 (1个二级单位)
      {
        id: 'park_08',
        name: '特变电工GIL产业园',
        fullName: '特变电工GIL产业园',
        level: 'park',
        badge: '衡阳',
        children: [
          { id: 'park_08_gil', name: '赛杰爱迪', fullName: '赛杰爱迪', level: 'workshop', badge: '主体' },
        ],
      },
      // 9. 特变电工输变电产业园 (2个二级单位)
      {
        id: 'park_09',
        name: '特变电工输变电产业园',
        fullName: '特变电工输变电产业园',
        level: 'park',
        badge: '昌吉',
        children: [
          { id: 'park_09_uhv', name: '超高压公司', fullName: '超高压公司', level: 'workshop', badge: '主体' },
          { id: 'park_09_xl', name: '特变电工新疆线缆厂', fullName: '特变电工新疆线缆厂', level: 'workshop', badge: '主体' },
        ],
      },
      // 10. 特变电工天变产业园 (1个二级单位，含5个三级基地)
      {
        id: 'park_10',
        name: '特变电工天变产业园',
        fullName: '特变电工天变产业园',
        level: 'park',
        badge: '天津',
        children: [
          {
            id: 'park_10_tb',
            name: '天变公司',
            fullName: '天变公司',
            level: 'workshop',
            badge: '主体',
            children: [
              { id: 'park_10_tb_tj', name: '天变天津基地', fullName: '天变天津基地', level: 'workshop' },
              { id: 'park_10_tb_zh', name: '天变智慧能源', fullName: '天变智慧能源', level: 'workshop' },
              { id: 'park_10_tb_zn', name: '天变智能科技', fullName: '天变智能科技', level: 'workshop' },
              { id: 'park_10_tb_hy', name: '天变衡阳基地', fullName: '天变衡阳基地', level: 'workshop' },
              { id: 'park_10_tb_sy', name: '天变沈阳基地', fullName: '天变沈阳基地', level: 'workshop' },
            ],
          },
        ],
      },
      // 11. 特变电工京津冀智能科技产业园 (2个二级单位)
      {
        id: 'park_11',
        name: '特变电工京津冀智能科技产业园',
        fullName: '特变电工京津冀智能科技产业园',
        level: 'park',
        badge: '武清',
        children: [
          { id: 'park_11_jjj', name: '京津冀公司', fullName: '京津冀公司', level: 'workshop', badge: '主体' },
          { id: 'park_11_zf', name: '珠峰硅钢', fullName: '珠峰硅钢', level: 'workshop', badge: '主体' },
        ],
      },
      // 12. 特变电工华东输变电科技产业园 (2个二级单位)
      {
        id: 'park_12',
        name: '特变电工华东输变电科技产业园',
        fullName: '特变电工华东输变电科技产业园',
        level: 'park',
        badge: '新泰',
        children: [
          { id: 'park_12_ll', name: '鲁缆本部', fullName: '鲁缆本部', level: 'workshop', badge: '主体' },
          { id: 'park_12_zl', name: '智缆公司', fullName: '智缆公司', level: 'workshop', badge: '主体' },
        ],
      },
      // 13. 特变电工曙光电缆产业园 (1个二级单位)
      {
        id: 'park_13',
        name: '特变电工曙光电缆产业园',
        fullName: '特变电工曙光电缆产业园',
        level: 'park',
        badge: '新泰',
        children: [
          { id: 'park_13_sg', name: '曙光公司', fullName: '曙光公司', level: 'workshop', badge: '主体' },
        ],
      },
      // 14. 特变电工新疆电缆产业园 (1个二级单位)
      {
        id: 'park_14',
        name: '特变电工新疆电缆产业园',
        fullName: '特变电工新疆电缆产业园',
        level: 'park',
        badge: '乌市',
        children: [
          { id: 'park_14_xl', name: '特变电工新疆电缆有限公司', fullName: '特变电工新疆电缆有限公司', level: 'workshop', badge: '主体' },
        ],
      },
      // 15. 特变电工(德阳)电缆园区 (1个二级单位)
      {
        id: 'park_15',
        name: '特变电工(德阳)电缆园区',
        fullName: '特变电工(德阳)电缆园区',
        level: 'park',
        badge: '德阳',
        children: [
          { id: 'park_15_dl', name: '特变电工（德阳）电缆股份有限公司', fullName: '特变电工（德阳）电缆股份有限公司', level: 'workshop', badge: '主体' },
        ],
      },
    ],
  },
]

export const TBEA_ORG_TREE_DATA = ENTERPRISE_TREE_DATA

// 生产变压器、线缆的主流项目公司/车间白名单
export const PRODUCT_TRANSFORMER_CABLE_WORKSHOP_IDS = new Set([
  'ws_sb_main',  // 沈变本部 (变压器-高压)
  'ws_hb_main',  // 衡变本部 (变压器-高压)
  'ws_hb_hn',    // 湖南电气 (变压器-高压)
  'ws_hb_tnj',   // 特能建 (变压器-高压)
  'ws_xb_uhv',   // 超高压公司 (变压器-高压)
  'ws_xb_tb',    // 天变公司 (变压器-中低压-干变)
  'ws_xb_zndq',  // 智能电气公司 (变压器-中低压-干变)
  'ws_xb_jjj',   // 京津冀公司 (变压器-中低压-油变)
  'ws_ll_main',  // 鲁缆本部 (线缆-高压、中低压)
  'ws_ll_sg',    // 曙光公司 (线缆-特种电缆)
  'ws_xl_main',  // 特变电工新疆电缆有限公司 (线缆-中低压)
  'ws_xl_sub',   // 特变电工新疆线缆厂 (线缆-中低压)
  'ws_dl_main',  // 特变电工（德阳）电缆股份有限公司 (线缆-中低压、高压)
])

export interface StandardOrgTreeProps {
  selectedNodeId?: string
  selectedId?: string
  onSelectNode?: (node: StandardOrgNode) => void
  onSelect?: (node: StandardOrgNode) => void
  treeType?: 'enterprise' | 'park'
  maxSelectableLevel?: number
  productUnitOnly?: boolean // 仅允许选择生产变压器、线缆的项目公司，其他项目公司置灰不可交互
  className?: string
}

export function StandardOrgTree({
  selectedNodeId,
  selectedId,
  onSelectNode,
  onSelect,
  treeType = 'enterprise',
  maxSelectableLevel,
  productUnitOnly = false,
  className,
}: StandardOrgTreeProps) {
  const currentSelectedId = selectedId || selectedNodeId || (treeType === 'park' ? 'park_ne' : 'ws_sb_main')
  const handleSelect = onSelect || onSelectNode || (() => {})

  const [keyword, setKeyword] = useState('')
  const [collapsedKeys, setCollapsedKeys] = useState<Record<string, boolean>>(() => {
    if (treeType === 'park') {
      const keys: Record<string, boolean> = {}
      // 默认收起全部 15 个园区的下级二级单位节点
      for (let i = 1; i <= 15; i++) {
        const id = `park_${i < 10 ? '0' + i : i}`
        keys[id] = true
      }
      keys['park_07_hr'] = true
      keys['park_10_tb'] = true
      return keys
    }
    return {
      comp_hb: true,
      comp_xb: true,
      comp_ll: true,
      comp_xl: true,
      comp_dl: true,
      ws_hb_hr: true,
      ws_xb_tb: true,
    }
  })

  // 🌟 当 treeType 改变时（如点击切换到“零碳园区”维度），保证全部 15 个园区节点默认收起
  useEffect(() => {
    if (treeType === 'park') {
      const keys: Record<string, boolean> = {}
      for (let i = 1; i <= 15; i++) {
        const id = `park_${i < 10 ? '0' + i : i}`
        keys[id] = true
      }
      keys['park_07_hr'] = true
      keys['park_10_tb'] = true
      setCollapsedKeys(keys)
    } else {
      setCollapsedKeys({
        comp_hb: true,
        comp_xb: true,
        comp_ll: true,
        comp_xl: true,
        comp_dl: true,
        ws_hb_hr: true,
        ws_xb_tb: true,
      })
    }
  }, [treeType])

  const toggleCollapse = (id: string) => {
    setCollapsedKeys((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
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

  const rawTreeData = treeType === 'park' ? PARK_ORG_TREE_DATA : ENTERPRISE_TREE_DATA

  const displayData = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    if (!kw) return rawTreeData
    return rawTreeData.map((n) => filterNode(n, kw)).filter((n): n is StandardOrgNode => n !== null)
  }, [keyword, rawTreeData])

  const renderTreeNodes = (nodes: StandardOrgNode[], level = 0) => {
    return nodes.map((node) => {
      const hasChildren = node.children && node.children.length > 0
      const isCollapsed = Boolean(collapsedKeys[node.id])
      const isSelected = node.id === currentSelectedId
      const currentLevelNum = level + 1
      // 检查节点是否可交互：若开启 productUnitOnly，项目公司(workshop)若不生产变压器/线缆则置灰禁用
      const isProductUnitDisabled = productUnitOnly && node.level === 'workshop' && !PRODUCT_TRANSFORMER_CABLE_WORKSHOP_IDS.has(node.id)
      const isSelectable = (!maxSelectableLevel || currentLevelNum <= maxSelectableLevel) && !isProductUnitDisabled

      return (
        <div key={node.id} className="relative select-none text-[12px]">
          {/* 节点行 */}
          <div
            onClick={() => {
              if (isSelectable) {
                handleSelect(node)
              }
            }}
            className={cn(
              'flex items-center gap-1.5 py-1 px-1.5 rounded-md transition-colors relative group',
              isProductUnitDisabled
                ? 'opacity-40 text-muted-foreground cursor-not-allowed select-none bg-panel/50'
                : isSelectable
                ? 'cursor-pointer'
                : 'cursor-default',
              isSelected && !isProductUnitDisabled
                ? 'bg-primary/15 text-primary font-semibold shadow-xs'
                : !isProductUnitDisabled && isSelectable
                  ? 'hover:bg-accent/50 text-foreground'
                  : !isProductUnitDisabled
                  ? 'text-muted-foreground hover:bg-accent/30'
                  : ''
            )}
            style={{ paddingLeft: `${level * 14 + 6}px` }}
            title={isProductUnitDisabled ? `${node.name} (非变压器/线缆生产单位 · 不参与产品单耗核算)` : !isSelectable ? `${node.name} (仅供结构展示)` : (node.fullName || node.name)}
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
            {node.level === 'park' && <Trees className="size-3.5 text-emerald-400 shrink-0" />}
            {node.level === 'company' && <Building2 className="size-3.5 text-amber-400 shrink-0" />}
            {node.level === 'workshop' && <Factory className="size-3.5 text-muted-foreground shrink-0" />}

            {/* 节点名称 */}
            <span className="truncate flex-1" title={node.fullName || node.name}>
              {node.name}
            </span>
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
          {treeType === 'park' ? (
            <>
              <Trees className="size-4 text-emerald-400" />
              <span>园区拓扑图</span>
            </>
          ) : (
            <>
              <Building2 className="size-4 text-primary" />
              <span>企业组织拓扑 (6大单位)</span>
            </>
          )}
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
            placeholder={treeType === 'park' ? '搜索产业园 / 厂区 / 微电网...' : '搜索单位 / 车间 / 工序...'}
            className="w-full pl-8 pr-2.5 py-1 text-xs bg-panel border border-border rounded-lg text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground transition-all"
          />
        </div>
      </div>

      {/* 3. 树节点滚动主体 */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {displayData.length > 0 ? (
          renderTreeNodes(displayData)
        ) : (
          <div className="py-8 text-center text-xs text-muted-foreground">
            {treeType === 'park' ? '未检索到匹配的零碳园区' : '未检索到匹配的组织或单位'}
          </div>
        )}
      </div>
    </aside>
  )
}
