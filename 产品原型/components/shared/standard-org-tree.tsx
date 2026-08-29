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
    name: '特变电工集团 (全景汇总)',
    fullName: '特变电工集团 (全景汇总)',
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

/**
 * 🏞️ 零碳园区拓扑数据 (15 个零碳产业园区)
 */
export const PARK_ORG_TREE_DATA: StandardOrgNode[] = [
  {
    id: 'park_root',
    name: '所属园区 (17 园区汇总)',
    fullName: '特变电工所属园区 (17 园区全域汇总)',
    level: 'group',
    badge: '17园区',
    children: [
      {
        id: 'park_01',
        name: '特变电工东北输变电产业园',
        fullName: '特变电工东北输变电产业园',
        level: 'park',
        badge: '沈阳',
        children: [
          { id: 'park_01_main', name: '沈变本部 (超高压厂房)', level: 'workshop', badge: '主体' },
          { id: 'park_01_hx', name: '和新套管制造基地', level: 'workshop', badge: '主体' },
          { id: 'park_01_kj', name: '康嘉互感器制造基地', level: 'workshop', badge: '主体' },
          { id: 'park_01_grid', name: '园区微电网与储能站', level: 'workshop', badge: '微网' },
        ],
      },
      {
        id: 'park_02',
        name: '特变电工南方输变电产业园',
        fullName: '特变电工南方输变电产业园',
        level: 'park',
        badge: '衡阳',
        children: [
          { id: 'park_02_main', name: '衡变本部制造厂区', level: 'workshop', badge: '主体' },
          { id: 'park_02_gc', name: '国创油箱车间', level: 'workshop', badge: '主体' },
          { id: 'park_02_pv', name: '南方园区屋顶光伏电站', level: 'workshop', badge: '光伏' },
        ],
      },
      {
        id: 'park_03',
        name: '特变电工二次产业园区',
        fullName: '特变电工二次产业园区',
        level: 'park',
        badge: '南京',
        children: [
          { id: 'park_03_smt', name: '南京电研自动化 SMT 车间', level: 'workshop' },
        ],
      },
      {
        id: 'park_04',
        name: '特变电工云集5G科技产业园',
        fullName: '特变电工云集5G科技产业园',
        level: 'park',
        badge: '衡阳',
        children: [
          { id: 'park_04_switch', name: '云集高压开关与钣金智能车间', level: 'workshop' },
        ],
      },
      {
        id: 'park_05',
        name: '特变电工智能电气产业园',
        fullName: '特变电工智能电气产业园 (自控)',
        level: 'park',
        badge: '昌吉',
        children: [
          { id: 'park_05_main', name: '新疆自控成套开关车间', level: 'workshop' },
        ],
      },
      {
        id: 'park_06',
        name: '特变电工湖南能源建设园区',
        fullName: '特变电工湖南能源建设园区',
        level: 'park',
        badge: '衡阳',
        children: [
          { id: 'park_06_main', name: '特能建新能源集成装配区', level: 'workshop' },
        ],
      },
      {
        id: 'park_07',
        name: '特变电工西安智能装备产业园',
        fullName: '特变电工西安智能装备产业园',
        level: 'park',
        badge: '西安',
        children: [
          { id: 'park_07_rnd', name: '电力电子与储能逆变研发基地', level: 'workshop' },
          { id: 'park_07_hr', name: '合容电气电力电容器生产区', level: 'workshop' },
        ],
      },
      {
        id: 'park_08',
        name: '特变电工GIL产业园',
        fullName: '特变电工GIL产业园',
        level: 'park',
        badge: '衡阳',
        children: [
          { id: 'park_08_main', name: '赛杰爱迪特高压GIL管道车间', level: 'workshop' },
        ],
      },
      {
        id: 'park_09',
        name: '特变电工输变电产业园',
        fullName: '特变电工输变电产业园 (超高压变压器)',
        level: 'park',
        badge: '昌吉',
        children: [
          { id: 'park_09_trans', name: '新变超高压变压器厂区', level: 'workshop', badge: '主体' },
        ],
      },
      {
        id: 'park_10',
        name: '特变电工天变产业园',
        fullName: '特变电工天变产业园',
        level: 'park',
        badge: '天津',
        children: [
          { id: 'park_10_main', name: '天变干式变压器生产基地', level: 'workshop' },
        ],
      },
      {
        id: 'park_11',
        name: '特变电工智能电气产业园',
        fullName: '特变电工智能电气产业园 (配电智能)',
        level: 'park',
        badge: '昌吉',
        children: [
          { id: 'park_11_main', name: '配电变压器智能装配车间', level: 'workshop' },
        ],
      },
      {
        id: 'park_12',
        name: '特变电工京津冀智能科技产业园',
        fullName: '特变电工京津冀智能科技产业园',
        level: 'park',
        badge: '武清',
        children: [
          { id: 'park_12_box', name: '箱式变电站与环网柜制造厂区', level: 'workshop' },
        ],
      },
      {
        id: 'park_13',
        name: '特变电工华东输变电科技产业园',
        fullName: '特变电工华东输变电科技产业园',
        level: 'park',
        badge: '新泰',
        children: [
          { id: 'park_13_tower', name: '鲁缆高压交联立塔厂区', level: 'workshop', badge: '主体' },
          { id: 'park_13_smart', name: '智缆科技制造中心', level: 'workshop', badge: '主体' },
        ],
      },
      {
        id: 'park_14',
        name: '特变电工曙光电缆产业园',
        fullName: '特变电工曙光电缆产业园',
        level: 'park',
        badge: '新泰',
        children: [
          { id: 'park_14_main', name: '曙光中低压环保交联线缆车间', level: 'workshop' },
        ],
      },
      {
        id: 'park_15',
        name: '特变电工新疆电缆产业园',
        fullName: '特变电工新疆电缆产业园',
        level: 'park',
        badge: '乌市',
        children: [
          { id: 'park_15_main', name: '新疆电缆超高压阻燃交联电缆生产区', level: 'workshop' },
        ],
      },
      {
        id: 'park_16',
        name: '特变电工输变电产业园',
        fullName: '特变电工输变电产业园 (线缆车间)',
        level: 'park',
        badge: '昌吉',
        children: [
          { id: 'park_16_cable', name: '新疆线缆厂动力线缆车间', level: 'workshop', badge: '主体' },
        ],
      },
      {
        id: 'park_17',
        name: '特变电工(德阳)电缆园区',
        fullName: '特变电工(德阳)电缆园区',
        level: 'park',
        badge: '德阳',
        children: [
          { id: 'park_17_main', name: '德缆股份交联与连铸连轧厂区', level: 'workshop', badge: '主体' },
        ],
      },
    ],
  },
]

export const TBEA_ORG_TREE_DATA = ENTERPRISE_TREE_DATA

export interface StandardOrgTreeProps {
  selectedNodeId?: string
  selectedId?: string
  onSelectNode?: (node: StandardOrgNode) => void
  onSelect?: (node: StandardOrgNode) => void
  treeType?: 'enterprise' | 'park'
  className?: string
}

export function StandardOrgTree({
  selectedNodeId,
  selectedId,
  onSelectNode,
  onSelect,
  treeType = 'enterprise',
  className,
}: StandardOrgTreeProps) {
  const currentSelectedId = selectedId || selectedNodeId || (treeType === 'park' ? 'park_ne' : 'ws_sb_main')
  const handleSelect = onSelect || onSelectNode || (() => {})

  const [keyword, setKeyword] = useState('')
  const [collapsedKeys, setCollapsedKeys] = useState<Record<string, boolean>>(() => {
    if (treeType === 'park') {
      const keys: Record<string, boolean> = {}
      // 默认收起全部 17 个园区的下级子车间/微网节点
      for (let i = 1; i <= 17; i++) {
        const id = `park_${i < 10 ? '0' + i : i}`
        keys[id] = true
      }
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

      return (
        <div key={node.id} className="relative select-none text-[12px]">
          {/* 节点行 */}
          <div
            onClick={() => handleSelect(node)}
            className={cn(
              'flex items-center gap-1.5 py-1 px-1.5 rounded cursor-pointer transition-colors relative group',
              isSelected
                ? 'bg-[#e6f4ff] text-[#1677ff] font-semibold shadow-2xs'
                : 'hover:bg-slate-100/80 text-slate-700'
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
                className="size-4 flex items-center justify-center text-slate-400 hover:text-slate-700 shrink-0"
              >
                {isCollapsed ? (
                  <ChevronRight className="size-3.5" />
                ) : (
                  <ChevronDown className="size-3.5" />
                )}
              </button>
            ) : (
              <span className="size-4 shrink-0 flex items-center justify-center">
                <span className="size-1 rounded-full bg-slate-300" />
              </span>
            )}

            {/* 节点图标 */}
            {node.level === 'group' && <Building2 className="size-3.5 text-[#1677ff] shrink-0" />}
            {node.level === 'park' && <Trees className="size-3.5 text-emerald-600 shrink-0" />}
            {node.level === 'company' && <Building2 className="size-3.5 text-amber-500 shrink-0" />}
            {node.level === 'workshop' && <Factory className="size-3.5 text-slate-400 shrink-0" />}

            {/* 节点名称 */}
            <span className="truncate flex-1" title={node.fullName || node.name}>
              {node.name}
            </span>
          </div>

          {/* 子节点容器 (带 Ant Design 风格垂直导线) */}
          {hasChildren && !isCollapsed && (
            <div className="relative border-l border-slate-200/80 ml-3.5 my-0.5">
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
        'w-[270px] min-w-[270px] max-w-[270px] shrink-0 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-[calc(100vh-84px)] sticky top-0 overflow-hidden',
        className
      )}
    >
      {/* 1. 顶部 Header 与 快捷操作 */}
      <div className="p-3 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          {treeType === 'park' ? (
            <>
              <Trees className="size-4 text-emerald-600" />
              <span>零碳园区拓扑 (15大园区)</span>
            </>
          ) : (
            <>
              <Building2 className="size-4 text-[#1677ff]" />
              <span>企业组织拓扑 (6大单位)</span>
            </>
          )}
        </div>
      </div>

      {/* 2. 搜索框 */}
      <div className="p-2 border-b border-slate-100 bg-white shrink-0">
        <div className="relative">
          <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={treeType === 'park' ? '搜索产业园 / 厂区 / 微电网...' : '搜索单位 / 车间 / 工序...'}
            className="w-full pl-8 pr-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1677ff] focus:bg-white transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* 3. 树节点滚动主体 */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5 custom-scrollbar">
        {displayData.length > 0 ? (
          renderTreeNodes(displayData)
        ) : (
          <div className="py-8 text-center text-xs text-slate-400">
            {treeType === 'park' ? '未检索到匹配的零碳园区' : '未检索到匹配的组织或单位'}
          </div>
        )}
      </div>

      {/* 4. 底部统计栏 */}
      <div className="p-2 border-t border-slate-100 bg-slate-50/70 text-[10.5px] text-slate-500 flex items-center justify-between shrink-0 font-mono">
        {treeType === 'park' ? (
          <>
            <span>15大零碳园区 · 全域微网</span>
            <span className="text-emerald-600 font-semibold">100% 在线</span>
          </>
        ) : (
          <>
            <span>6大一级单位 · 30二级单位</span>
            <span className="text-emerald-600 font-semibold">100% 在线</span>
          </>
        )}
      </div>
    </aside>
  )
}
