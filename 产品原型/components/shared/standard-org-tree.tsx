'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  ChevronRight,
  ChevronDown,
  Building2,
  Factory,
  Network,
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
  unconnected?: boolean // 🌟 不具备数据接入条件的单位，界面置灰
  children?: StandardOrgNode[]
}

/**
 * 🏢 企业组织结构数据 (6 大一级单位 ➔ 30 个二级单位)
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
          { id: 'ws_sb_hx', name: '和新套管', fullName: '特变电工沈变和新高压套管', level: 'workshop', badge: '主体' },
          { id: 'ws_sb_kj', name: '康嘉互感器', fullName: '沈变康嘉互感器制造部', level: 'workshop', badge: '主体' },
          { id: 'ws_sb_luna', name: '露娜智造', fullName: '特变电工露娜智能装备制造', level: 'workshop', badge: '主体' },
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
      // 3. 新变厂 (6个项目公司)
      {
        id: 'comp_xb',
        name: '新变厂',
        level: 'company',
        badge: '6公司',
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
          { id: 'park_12_zl', name: '智缆公司', fullName: '智缆公司', level: 'workshop', badge: '未接入', unconnected: true },
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
          { id: 'park_13_sg', name: '曙光公司', fullName: '曙光公司', level: 'workshop', badge: '未接入', unconnected: true },
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
  'ws_hb_tnj',   // 特缆建 (变压器-高压)
  'ws_xb_uhv',   // 超高压公司 (变压器-高压)
  'ws_xb_tb',    // 天变公司 (变压器-中低压-干变)
  'ws_xb_zndq',  // 智能电气 (变压器-中低压-干变)
  'ws_xb_jjj',   // 京津冀科技 (变压器-中低压-油变)
  'ws_ll_main',  // 鲁缆本部 (线缆-高压、中低压)
  'ws_ll_comp',  // 鲁缆公司
  'ws_ll_sw',    // 昭和 (线缆-高压附件)
  'ws_ll_sg',    // 曙光 (线缆-特种电缆)
  'ws_xl_comp',  // 新缆厂
  'ws_xl_main',  // 新疆电缆 (线缆-中低压)
  'ws_xl_sub',   // 新疆线缆厂 (线缆-中低压)
  'ws_dl_main',  // 德缆公司 (线缆-中低压、高压)
])

export interface StandardOrgTreeProps {
  selectedNodeId?: string
  selectedId?: string
  onSelectNode?: (node: StandardOrgNode) => void
  onSelect?: (node: StandardOrgNode) => void
  treeType?: 'enterprise' | 'park'
  showTreeTypeSwitch?: boolean
  onTreeTypeChange?: (type: 'enterprise' | 'park') => void
  title?: string
  hideHeader?: boolean
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
  showTreeTypeSwitch = false,
  onTreeTypeChange,
  title,
  hideHeader = false,
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
      ws_hb_kg: true,
      ws_hb_hr: true,
      ws_xb_tb: true,
      ws_ll_comp: true,
      ws_xl_comp: true,
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
        ws_hb_kg: true,
        ws_hb_hr: true,
        ws_xb_tb: true,
        ws_ll_comp: true,
        ws_xl_comp: true,
      })
    }
  }, [treeType])

  const rawTreeData = treeType === 'park' ? PARK_ORG_TREE_DATA : ENTERPRISE_TREE_DATA

  // 🌟 当 currentSelectedId 变更时，自动展开其所有父级/祖先节点，确保定位高亮节点可见
  useEffect(() => {
    if (!currentSelectedId) return
    const findAncestors = (nodes: StandardOrgNode[], targetId: string, path: string[] = []): string[] | null => {
      for (const node of nodes) {
        if (node.id === targetId) return path
        if (node.children) {
          const res = findAncestors(node.children, targetId, [...path, node.id])
          if (res) return res
        }
      }
      return null
    }

    const ancestors = findAncestors(rawTreeData, currentSelectedId)
    if (ancestors && ancestors.length > 0) {
      setCollapsedKeys((prev) => {
        let changed = false
        const next = { ...prev }
        for (const ancId of ancestors) {
          if (next[ancId]) {
            next[ancId] = false
            changed = true
          }
        }
        return changed ? next : prev
      })
    }
  }, [currentSelectedId, rawTreeData])

  const toggleCollapse = (id: string) => {
    setCollapsedKeys((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // 递归过滤
  const filterNode = (node: StandardOrgNode, kw: string): StandardOrgNode | null => {
    const matches =
      node.name.toLowerCase().includes(kw) ||
      (node.fullName && node.fullName.toLowerCase().includes(kw)) ||
      (node.badge && node.badge.toLowerCase().includes(kw))
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
    if (!kw) return rawTreeData
    return rawTreeData.map((n) => filterNode(n, kw)).filter((n): n is StandardOrgNode => n !== null)
  }, [keyword, rawTreeData])

  const renderTreeNodes = (nodes: StandardOrgNode[], level = 0) => {
    return nodes.map((node) => {
      const hasChildren = node.children && node.children.length > 0
      const isCollapsed = Boolean(collapsedKeys[node.id])
      const isSelected = node.id === currentSelectedId
      const currentLevelNum = level + 1
      // 检查节点是否属于未接入单位
      const isUnconnected = Boolean(node.unconnected)
      // 检查节点是否可交互：若开启 productUnitOnly，项目公司(workshop)若不生产变压器/线缆则置灰禁用
      const isProductUnitDisabled = productUnitOnly && node.level === 'workshop' && !PRODUCT_TRANSFORMER_CABLE_WORKSHOP_IDS.has(node.id)
      // 🌟 用户需求：园区选项下关联项目公司正常显示但无法选中
      const isParkCompanyDisabled = treeType === 'park' && node.level === 'workshop'
      const isSelectable = (!maxSelectableLevel || currentLevelNum <= maxSelectableLevel) && !isProductUnitDisabled && !isUnconnected && !isParkCompanyDisabled

      return (
        <div key={node.id} className="relative select-none text-sm">
          {/* 节点行 (固定 30px 高度) */}
          <div
            onClick={() => {
              if (isSelectable && !isUnconnected && !isParkCompanyDisabled) {
                handleSelect(node)
              }
            }}
            className={cn(
              'flex items-center gap-1.5 h-[30px] px-2 rounded-lg text-sm transition-colors relative group',
              isUnconnected
                ? 'opacity-35 text-slate-400 dark:text-slate-500 cursor-not-allowed select-none bg-transparent hover:bg-transparent'
                : isParkCompanyDisabled
                ? 'opacity-60 text-slate-400 cursor-not-allowed select-none hover:bg-transparent'
                : isProductUnitDisabled
                ? 'opacity-40 text-slate-400 cursor-not-allowed select-none bg-slate-50/50'
                : isSelectable
                ? 'cursor-pointer'
                : 'cursor-default',
              isSelected && !isProductUnitDisabled && !isUnconnected && !isParkCompanyDisabled
                ? 'bg-[#EBF3FF] dark:bg-primary/20 text-[#2C7CFF] dark:text-primary font-semibold shadow-xs'
                : !isProductUnitDisabled && !isUnconnected && !isParkCompanyDisabled && isSelectable
                  ? 'hover:bg-slate-100/80 dark:hover:bg-accent/40 text-slate-700 dark:text-foreground'
                  : !isProductUnitDisabled && !isUnconnected && !isParkCompanyDisabled
                  ? 'text-slate-400 hover:bg-slate-50 dark:hover:bg-panel'
                  : ''
            )}
            style={{ paddingLeft: `${level * 14 + 6}px` }}
            title={
              isUnconnected
                ? `${node.name} (暂不具备数据接入条件 · 不允许选择)`
                : isParkCompanyDisabled
                ? `${node.name} (园区关联公司 · 仅供结构参考不可直接选中)`
                : isProductUnitDisabled
                ? `${node.name} (非变压器/线缆生产单位 · 不参与产品单耗核算)`
                : !isSelectable
                ? `${node.name} (仅供结构展示)`
                : (node.fullName || node.name)
            }
          >
            {/* 折叠箭头 */}
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleCollapse(node.id)
                }}
                className="size-4 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shrink-0 cursor-pointer"
              >
                {isCollapsed ? (
                  <ChevronRight className="size-3.5" />
                ) : (
                  <ChevronDown className="size-3.5" />
                )}
              </button>
            ) : (
              <span className="size-4 shrink-0 flex items-center justify-center">
                <span className="size-1 rounded-full bg-slate-300 dark:bg-border" />
              </span>
            )}

            {/* 节点图标 */}
            {node.level === 'group' && <Building2 className="size-3.5 text-[#2C7CFF] dark:text-primary shrink-0" />}
            {node.level === 'park' && <Trees className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
            {node.level === 'company' && <Building2 className="size-3.5 text-amber-500 dark:text-amber-400 shrink-0" />}
            {node.level === 'workshop' && <Network className={cn('size-3.5 shrink-0', isUnconnected ? 'opacity-35 text-slate-400 dark:text-slate-500' : 'text-slate-400 dark:text-muted-foreground')} />}

            {/* 节点名称 */}
            <span className={cn('truncate flex-1', isUnconnected ? 'text-slate-400 dark:text-slate-500 font-normal' : '')} title={node.fullName || node.name}>
              {node.name.replace(/\s*\(.*?\)/g, '')}
            </span>
            
          </div>

          {/* 子节点容器 */}
          {hasChildren && !isCollapsed && (
            <div className="relative border-l border-slate-200/80 dark:border-border ml-3.5 my-0.5">
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
        'w-[270px] min-w-[270px] max-w-[270px] shrink-0 bg-white dark:bg-card rounded-lg border border-[#DBE6EE] dark:border-border shadow-xs flex flex-col h-[calc(100vh-84px)] sticky top-0 overflow-hidden',
        className
      )}
    >
      {/* 0. 组织 / 园区 视角切换 Tab (纯粹无冗余自述标题，与标准截面 100% 对齐) */}
      {showTreeTypeSwitch && (
        <div className="p-2 border-b border-slate-100 dark:border-border bg-white dark:bg-card shrink-0">
          <div className="grid grid-cols-2 gap-1 bg-slate-100 dark:bg-panel p-0.5 rounded-lg text-xs font-medium border border-transparent dark:border-border">
            <button
              type="button"
              onClick={() => onTreeTypeChange?.('enterprise')}
              className={cn(
                'py-1 rounded-md transition-all cursor-pointer text-center select-none',
                treeType === 'enterprise'
                  ? 'bg-white dark:bg-primary text-[#2C7CFF] dark:text-primary-foreground font-bold shadow-xs'
                  : 'text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground'
              )}
            >
              组织
            </button>
            <button
              type="button"
              onClick={() => onTreeTypeChange?.('park')}
              className={cn(
                'py-1 rounded-md transition-all cursor-pointer text-center select-none',
                treeType === 'park'
                  ? 'bg-white dark:bg-primary text-[#2C7CFF] dark:text-primary-foreground font-bold shadow-xs'
                  : 'text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground'
              )}
            >
              园区
            </button>
          </div>
        </div>
      )}

      {/* 1. 顶部 Header (仅当显式传入自定义 title 时展示) */}
      {!hideHeader && title && (
        <div className="p-3 border-b border-slate-100 dark:border-border flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-panel">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-foreground">
            {treeType === 'park' ? (
              <Trees className="size-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Building2 className="size-4 text-[#2C7CFF] dark:text-primary" />
            )}
            <span>{title}</span>
          </div>
        </div>
      )}

      {/* 2. 搜索框 */}
      <div className="p-2 border-b border-slate-100 dark:border-border bg-white dark:bg-card shrink-0">
        <div className="relative">
          <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="请输入搜索关键词"
            className="w-full pl-8 pr-2.5 h-9 text-xs bg-panel border border-[#E2E8F0] dark:border-border rounded-lg text-slate-700 dark:text-foreground focus:outline-none focus:border-primary placeholder:text-slate-400 transition-all"
          />
        </div>
      </div>

      {/* 3. 树节点滚动主体 */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {displayData.length > 0 ? (
          renderTreeNodes(displayData)
        ) : (
          <div className="py-8 text-center text-xs text-slate-400">
            {treeType === 'park' ? '未检索到匹配的零碳园区' : '未检索到匹配的组织或单位'}
          </div>
        )}
      </div>
    </aside>
  )
}

/**
 * 🏭 国家级零碳工厂对标单位 ➔ 标准组织架构拓扑树节点权威映射字典 (21 家直报工厂)
 */
export const BENCHMARK_FACTORY_TO_ORG_NODE: Record<
  string,
  { id: string; name: string; fullName: string; level: OrgLevel; badge?: string }
> = {
  'fac-01': { id: 'ws_xb_zf', name: '珠峰硅钢', fullName: '珠峰硅钢精密冲剪退火制造部', level: 'workshop', badge: '主体' },
  'fac-02': { id: 'ws_sb_hx', name: '和新套管', fullName: '特变电工沈变和新高压套管', level: 'workshop', badge: '主体' },
  'fac-03': { id: 'ws_xb_uhv', name: '超高压公司', fullName: '特变电工新疆超高压制造中心', level: 'workshop', badge: '主体' },
  'fac-04': { id: 'ws_sb_kj', name: '康嘉互感器', fullName: '沈变康嘉互感器制造部', level: 'workshop', badge: '主体' },
  'fac-05': { id: 'ws_sb_main', name: '沈变本部', fullName: '特变电工沈阳变压器集团本部', level: 'workshop', badge: '主体' },
  'fac-06': { id: 'ws_xb_zndq', name: '智能电气', fullName: '特变电工智能电气配变车间', level: 'workshop', badge: '主体' },
  'fac-07': { id: 'ws_hb_main', name: '衡变本部', fullName: '特变电工衡阳变压器本部', level: 'workshop', badge: '主体' },
  'fac-08': { id: 'ws_hb_tnj', name: '特缆建', fullName: '特变电工湖南能电建设园区', level: 'workshop', badge: '主体' },
  'fac-09': { id: 'ws_hb_hn', name: '湖南电气', fullName: '特变电工湖南电气装备制造部', level: 'workshop', badge: '主体' },
  'fac-10': { id: 'ws_hb_yj', name: '云集电气', fullName: '特变电工云集5G智能成套设备', level: 'workshop', badge: '主体' },
  'fac-11': { id: 'ws_hb_kg', name: '云集高压开关', fullName: '特变电工云集高压开关有限公司', level: 'workshop', badge: '2三级单位' },
  'fac-12': { id: 'ws_xb_tb', name: '天变公司', fullName: '特变电工天津变压器有限公司', level: 'workshop', badge: '5三级单位' },
  'fac-13': { id: 'ws_xb_jjj', name: '京津冀科技', fullName: '特变电工京津冀智能科技产业基地', level: 'workshop', badge: '主体' },
  'fac-14': { id: 'ws_sb_luna', name: '露娜智造', fullName: '特变电工露娜智能装备制造', level: 'workshop', badge: '主体' },
  'fac-15': { id: 'ws_hb_nj', name: '南京公司', fullName: '特变电工南京智能电气有限公司', level: 'workshop', badge: '主体' },
  'fac-16': { id: 'ws_hb_xj', name: '新疆自控', fullName: '特变电工新疆自控成套车间', level: 'workshop', badge: '主体' },
  'fac-17': { id: 'ws_hb_hr', name: '合容电气', fullName: '特变电工合容电气有限公司', level: 'workshop', badge: '2三级单位' },
  'fac-18': { id: 'ws_hb_gil', name: '事杰爱迪', fullName: '特变电工事杰爱迪GIL公司', level: 'workshop', badge: '主体' },
  'fac-19': { id: 'ws_xl_main', name: '新疆电缆', fullName: '特变电工新疆电缆实业公司', level: 'workshop', badge: '主体' },
  'fac-20': { id: 'ws_ll_main', name: '鲁缆本部', fullName: '鲁缆本部高压交联立塔制造部', level: 'workshop', badge: '主体' },
  'fac-21': { id: 'ws_dl_main', name: '德缆公司', fullName: '特变电工（德阳）电缆股份有限公司', level: 'workshop', badge: '主体' },
}

export function findOrgNodeById(nodes: StandardOrgNode[], targetId: string): StandardOrgNode | null {
  for (const node of nodes) {
    if (node.id === targetId) return node
    if (node.children) {
      const found = findOrgNodeById(node.children, targetId)
      if (found) return found
    }
  }
  return null
}

export function findOrgNodeByKeyword(nodes: StandardOrgNode[], keyword: string): StandardOrgNode | null {
  if (!keyword) return null
  const kw = keyword.trim().toLowerCase()
  for (const node of nodes) {
    if (
      node.name.toLowerCase() === kw ||
      (node.fullName && node.fullName.toLowerCase() === kw) ||
      node.name.toLowerCase().includes(kw) ||
      (node.fullName && node.fullName.toLowerCase().includes(kw))
    ) {
      return node
    }
    if (node.children) {
      const found = findOrgNodeByKeyword(node.children, keyword)
      if (found) return found
    }
  }
  return null
}

/**
 * 🌟 从路由查询参数智能解析出标准组织架构节点
 */
export function resolveOrgNodeFromParams(params: {
  factoryId?: string | null
  nodeId?: string | null
  factoryName?: string | null
  companyName?: string | null
}): StandardOrgNode | null {
  const { factoryId, nodeId, factoryName, companyName } = params

  // 1. 优先按国家级零碳工厂 ID 匹配标准组织节点
  if (factoryId && BENCHMARK_FACTORY_TO_ORG_NODE[factoryId]) {
    const mapped = BENCHMARK_FACTORY_TO_ORG_NODE[factoryId]
    const inTree = findOrgNodeById(ENTERPRISE_TREE_DATA, mapped.id)
    return inTree || mapped
  }

  // 2. 按组织节点 ID 匹配
  if (nodeId) {
    const found = findOrgNodeById(ENTERPRISE_TREE_DATA, nodeId)
    if (found) return found
  }

  // 3. 按工厂全称/简称匹配
  if (factoryName) {
    // 检查映射表中的名字/全称
    for (const [, item] of Object.entries(BENCHMARK_FACTORY_TO_ORG_NODE)) {
      if (
        item.name === factoryName ||
        item.fullName === factoryName ||
        factoryName.includes(item.name) ||
        (item.fullName && factoryName.includes(item.fullName))
      ) {
        const inTree = findOrgNodeById(ENTERPRISE_TREE_DATA, item.id)
        return inTree || item
      }
    }
    // 检查树中节点
    const inTree = findOrgNodeByKeyword(ENTERPRISE_TREE_DATA, factoryName)
    if (inTree) return inTree

    // 特殊别名/关键字容错匹配
    const aliasRules: Array<[string, string]> = [
      ['珠峰', 'ws_xb_zf'],
      ['和新', 'ws_sb_hx'],
      ['超高压', 'ws_xb_uhv'],
      ['康嘉', 'ws_sb_kj'],
      ['沈变本部', 'ws_sb_main'],
      ['智能电气', 'ws_xb_zndq'],
      ['衡变本部', 'ws_hb_main'],
      ['特能建', 'ws_hb_tnj'],
      ['特缆建', 'ws_hb_tnj'],
      ['湖南电气', 'ws_hb_hn'],
      ['云集电气', 'ws_hb_yj'],
      ['云集高压', 'ws_hb_kg'],
      ['天变', 'ws_xb_tb'],
      ['京津冀', 'ws_xb_jjj'],
      ['露娜', 'ws_sb_luna'],
      ['南京', 'ws_hb_nj'],
      ['新疆自控', 'ws_hb_xj'],
      ['合容', 'ws_hb_hr'],
      ['赛杰', 'ws_hb_gil'],
      ['事杰', 'ws_hb_gil'],
      ['新疆电缆', 'ws_xl_main'],
      ['鲁缆', 'ws_ll_main'],
      ['德缆', 'ws_dl_main'],
    ]
    for (const [kw, targetId] of aliasRules) {
      if (factoryName.includes(kw)) {
        const found = findOrgNodeById(ENTERPRISE_TREE_DATA, targetId)
        if (found) return found
      }
    }
  }

  // 4. 按所属公司名称匹配
  if (companyName) {
    const compNode = findOrgNodeByKeyword(ENTERPRISE_TREE_DATA, companyName)
    if (compNode) return compNode
  }

  return null
}
