import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  MonitorCog,
  Gauge,
  Leaf,
  ClipboardCheck,
  FileBarChart,
  BellRing,
  Settings2,
  Bot,
  BarChart3,
  Database,
  ShieldCheck,
  BadgeCheck,
  Boxes,
  Plug,
  Globe2,
} from 'lucide-react'

export type NavChild = { title: string; href: string }
export type NavItem = {
  title: string
  href: string
  icon: LucideIcon
  children?: NavChild[]
}

/* ============================================================
 * 1. 零碳园区集控中心 10 大核心模块（与 HTML 最终版标准对齐）
 * ============================================================ */
export const zeroCarbonNav: NavItem[] = [
  {
    title: '集控中心大屏',
    href: '/zero-carbon/screen',
    icon: LayoutDashboard,
  },
  {
    title: '集中监管',
    href: '/zero-carbon/monitor',
    icon: MonitorCog,
    children: [
      { title: '指标管控', href: '/zero-carbon/monitor/indicator' },
      { title: '用能在线监测', href: '/zero-carbon/monitor/online/usage' },
      { title: '工业微电网监测', href: '/zero-carbon/monitor/online/microgrid' },
      { title: '能源碳排放监测', href: '/zero-carbon/monitor/carbon-emission' },
    ],
  },
  {
    title: '能耗能效分析',
    href: '/zero-carbon/energy',
    icon: Gauge,
    children: [
      { title: '用能结构分析', href: '/zero-carbon/energy/structure' },
      { title: '能源成本分析', href: '/zero-carbon/energy/cost' },
      { title: '单位产品能耗', href: '/zero-carbon/energy/unit-product' },
      { title: '单位产值能耗', href: '/zero-carbon/energy/unit-output' },
      { title: '对标管理', href: '/zero-carbon/energy/benchmark' },
    ],
  },

  {
    title: '零碳项目评估',
    href: '/zero-carbon/project',
    icon: ClipboardCheck,
    children: [
      { title: '项目档案管理', href: '/zero-carbon/project/archive' },
      { title: '实时监控', href: '/zero-carbon/project/monitoring' },
      { title: '项目运行评估', href: '/zero-carbon/project/benefit' },
      { title: '零碳工厂自评估', href: '/zero-carbon/project/self' },
    ],
  },
  {
    title: '统计报表',
    href: '/zero-carbon/reports',
    icon: FileBarChart,
    children: [
      { title: '用能报表', href: '/zero-carbon/reports/usage' },
      { title: '成本报表', href: '/zero-carbon/reports/cost' },
      { title: '单耗报表', href: '/zero-carbon/reports/unit' },
    ],
  },
]

/* ============================================================
 * 2. 产品碳足迹集采中心 核心模块（与 集采中心 原设计稿 100% 对齐）
 * ============================================================ */
export const carbonFootprintNav: NavItem[] = [
  { title: '对外示范窗口', href: '/carbon-footprint/cockpit', icon: LayoutDashboard },
  {
    title: '多维分析',
    href: '/carbon-footprint/analysis',
    icon: BarChart3,
    children: [
      { title: '横向对比', href: '/carbon-footprint/analysis/compare' },
      { title: '纵向对比', href: '/carbon-footprint/analysis/ranking' },
      { title: '基准对比', href: '/carbon-footprint/analysis/benchmark' },
    ],
  },
  {
    title: '实景数据库',
    href: '/carbon-footprint/database',
    icon: Database,
    children: [
      { title: '碳足迹核算', href: '/carbon-footprint/database/accounting' },
      { title: '能耗追踪', href: '/carbon-footprint/database/energy' },
      { title: '碳足迹报告', href: '/carbon-footprint/database/report' },
    ],
  },
  {
    title: 'CBAM管理',
    href: '/carbon-footprint/cbam',
    icon: ShieldCheck,
    children: [
      { title: '合规管理', href: '/carbon-footprint/cbam/compliance' },
      { title: '申报模拟', href: '/carbon-footprint/cbam/declaration' },
      { title: '知识库', href: '/carbon-footprint/cbam/knowledge' },
    ],
  },
  {
    title: '第三方认证管理',
    href: '/carbon-footprint/certification',
    icon: BadgeCheck,
    children: [
      { title: '认证资料维护', href: '/carbon-footprint/certification/material' },
      { title: '认证申请', href: '/carbon-footprint/certification/apply' },
      { title: '认证结果管理', href: '/carbon-footprint/certification/result' },
    ],
  },
  {
    title: '因子库管理',
    href: '/carbon-footprint/factor',
    icon: Boxes,
    children: [
      { title: '原材料碳排因子', href: '/carbon-footprint/factor/material' },
      { title: '电力碳排因子', href: '/carbon-footprint/factor/power' },
      { title: '能源活动碳排因子', href: '/carbon-footprint/factor/energy' },
      { title: '折标煤系数库', href: '/carbon-footprint/factor/coal' },
    ],
  },
]

export type PlatformKey = 'zero-carbon' | 'carbon-footprint'

export const platformMeta: Record<
  PlatformKey,
  { name: string; short: string; subtitle: string; nav: NavItem[]; icon: LucideIcon; accent: string }
> = {
  'zero-carbon': {
    name: '零碳园区集控中心',
    short: '零碳集控',
    subtitle: '能碳时序监控 / 统计报表',
    nav: zeroCarbonNav,
    icon: Globe2,
    accent: '#1677ff',
  },
  'carbon-footprint': {
    name: '产品碳足迹集采中心',
    short: '碳足迹集采',
    subtitle: 'LCA碳足迹 / CBAM出海',
    nav: carbonFootprintNav,
    icon: Leaf,
    accent: 'var(--chart-1)',
  },
}
