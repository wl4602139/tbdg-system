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
      { title: '模型管理', href: '/zero-carbon/project/model' },
      { title: '实时监控与项目效益评估', href: '/zero-carbon/project/benefit' },
      { title: '零碳园区自评估', href: '/zero-carbon/project/self' },
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
      { title: '碳排报表', href: '/zero-carbon/reports/carbon' },
    ],
  },
  {
    title: '基础配置',
    href: '/zero-carbon/config',
    icon: Settings2,
    children: [
      { title: '账号权限', href: '/zero-carbon/config/permission' },
      { title: '碳排因子', href: '/zero-carbon/config/factor' },
      { title: '费价模型', href: '/zero-carbon/config/price' },
      { title: '折标煤系数', href: '/zero-carbon/config/convert' },
      { title: '接口配置管理', href: '/zero-carbon/config/interface' },
      { title: '数据录入', href: '/zero-carbon/config/entry' },
    ],
  },
]

/* ============================================================
 * 2. 产品碳足迹集采中心 9 大核心模块（与 HTML 最终版标准对齐）
 * ============================================================ */
export const carbonFootprintNav: NavItem[] = [
  {
    title: '示范窗口 (Cockpit)',
    href: '/carbon-footprint/cockpit',
    icon: LayoutDashboard,
  },
  {
    title: '多维分析 (Analysis)',
    href: '/carbon-footprint/analysis',
    icon: BarChart3,
    children: [
      { title: '同品类跨厂对比', href: '/carbon-footprint/analysis#horizontal' },
      { title: '红黑榜 Top10', href: '/carbon-footprint/analysis#vertical' },
      { title: '基准与热点分析', href: '/carbon-footprint/analysis#benchmark' },
      { title: '低碳选型模拟', href: '/carbon-footprint/analysis#simulate' },
    ],
  },
  {
    title: '实景数据库 (Database)',
    href: '/carbon-footprint/database',
    icon: Database,
    children: [
      { title: '核算一张图', href: '/carbon-footprint/database#accounting' },
      { title: '工序能耗时序', href: '/carbon-footprint/database#energy' },
      { title: 'BOM 数据链穿透', href: '/carbon-footprint/database#bom' },
    ],
  },
  {
    title: 'CBAM 申报管理',
    href: '/carbon-footprint/cbam',
    icon: ShieldCheck,
    children: [
      { title: 'HS 编码映射', href: '/carbon-footprint/cbam#hs' },
      { title: '关税情景测算', href: '/carbon-footprint/cbam#cost' },
      { title: 'XML 申报包下载', href: '/carbon-footprint/cbam#export' },
    ],
  },
  {
    title: '第三方认证证书',
    href: '/carbon-footprint/certification',
    icon: BadgeCheck,
  },
  {
    title: '因子库管理',
    href: '/carbon-footprint/factor',
    icon: Boxes,
    children: [
      { title: '股份因子同步', href: '/carbon-footprint/factor#sync' },
      { title: '因子集构建与下发', href: '/carbon-footprint/factor#dispatch' },
    ],
  },
  {
    title: '系统配置',
    href: '/carbon-footprint/config',
    icon: Settings2,
  },
  {
    title: '数据接口管理',
    href: '/carbon-footprint/interface',
    icon: Plug,
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
    accent: '#10b981',
  },
}
