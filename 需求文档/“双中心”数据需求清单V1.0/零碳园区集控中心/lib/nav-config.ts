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

/* 零碳园区集控中心 */
export const zeroCarbonNav: NavItem[] = [
  { title: '集控中心大屏', href: '/zero-carbon/screen', icon: LayoutDashboard },
  {
    title: '集中监管',
    href: '/zero-carbon/monitor',
    icon: MonitorCog,
    children: [
      { title: '指标管控', href: '/zero-carbon/monitor/indicator' },
      { title: '在线监测', href: '/zero-carbon/monitor/online' },
      { title: '绿电监测', href: '/zero-carbon/monitor/green' },
    ],
  },
  {
    title: '能耗能效分析',
    href: '/zero-carbon/energy',
    icon: Gauge,
    children: [
      { title: '综合对比分析', href: '/zero-carbon/energy/comprehensive' },
      { title: '用能结构分析', href: '/zero-carbon/energy/structure' },
      { title: '能源成本分析', href: '/zero-carbon/energy/cost' },
      { title: '单位产品能耗', href: '/zero-carbon/energy/unit-product' },
      { title: '单位产值能耗', href: '/zero-carbon/energy/unit-output' },
      { title: '对标管理', href: '/zero-carbon/energy/benchmark' },
    ],
  },
  {
    title: '碳管理',
    href: '/zero-carbon/carbon',
    icon: Leaf,
    children: [
      { title: '碳排放核算', href: '/zero-carbon/carbon/accounting' },
      { title: '碳排放分析', href: '/zero-carbon/carbon/analysis' },
      { title: '碳报告与核查', href: '/zero-carbon/carbon/report' },
    ],
  },
  {
    title: '零碳项目评估',
    href: '/zero-carbon/project',
    icon: ClipboardCheck,
    children: [
      { title: '项目档案管理', href: '/zero-carbon/project/archive' },
      { title: '模型管理', href: '/zero-carbon/project/model' },
      { title: '实时监控与效益评估', href: '/zero-carbon/project/benefit' },
      { title: '零碳园区自评估', href: '/zero-carbon/project/self' },
    ],
  },
  {
    title: '统计报表',
    href: '/zero-carbon/reports',
    icon: FileBarChart,
    children: [
      { title: '能源用量报表', href: '/zero-carbon/reports/usage' },
      { title: '能源成本报表', href: '/zero-carbon/reports/cost' },
      { title: '能源单耗报表', href: '/zero-carbon/reports/unit' },
      { title: '碳排放报表', href: '/zero-carbon/reports/carbon' },
    ],
  },
  { title: '数据采集清单', href: '/zero-carbon/data-catalog', icon: Database },
  {
    title: '告警管理',
    href: '/zero-carbon/alarm',
    icon: BellRing,
    children: [
      { title: '告警处理', href: '/zero-carbon/alarm/records' },
      { title: '告警规则配置', href: '/zero-carbon/alarm/rules' },
      { title: '告警推送策略', href: '/zero-carbon/alarm/push' },
    ],
  },
  {
    title: '基础配置',
    href: '/zero-carbon/config',
    icon: Settings2,
    children: [
      { title: '碳排因子', href: '/zero-carbon/config/factor' },
      { title: '费价模型', href: '/zero-carbon/config/price' },
      { title: '能源转换工具', href: '/zero-carbon/config/convert' },
      { title: '接口配置管理', href: '/zero-carbon/config/interface' },
      { title: '数据录入', href: '/zero-carbon/config/entry' },
    ],
  },
  { title: '智能助手', href: '/zero-carbon/assistant', icon: Bot },
]

/* 产品碳足迹集采中心 */
export const carbonFootprintNav: NavItem[] = [
  { title: '对外示范窗口', href: '/carbon-footprint/cockpit', icon: LayoutDashboard },
  {
    title: '多维分析',
    href: '/carbon-footprint/analysis',
    icon: BarChart3,
    children: [
      { title: '产品碳足迹总览', href: '/carbon-footprint/analysis#overview' },
      { title: '同品类横向对比', href: '/carbon-footprint/analysis#compare' },
      { title: '碳热点分析与模拟', href: '/carbon-footprint/analysis#hotspot' },
      { title: '基准管理分析', href: '/carbon-footprint/analysis#benchmark' },
    ],
  },
  {
    title: '实景数据库',
    href: '/carbon-footprint/database',
    icon: Database,
    children: [
      { title: '碳足迹核算', href: '/carbon-footprint/database#accounting' },
      { title: '原始数据穿透', href: '/carbon-footprint/database#trace' },
      { title: '碳足迹报告', href: '/carbon-footprint/database#report' },
      { title: '能耗追踪', href: '/carbon-footprint/database#energy' },
    ],
  },
  {
    title: 'CBAM管理',
    href: '/carbon-footprint/cbam',
    icon: ShieldCheck,
    children: [
      { title: '合规管理', href: '/carbon-footprint/cbam#compliance' },
      { title: '产品与客户', href: '/carbon-footprint/cbam#product' },
      { title: '成本测算', href: '/carbon-footprint/cbam#cost' },
      { title: '知识库', href: '/carbon-footprint/cbam#knowledge' },
      { title: '供应商碳管理', href: '/carbon-footprint/cbam#supplier' },
    ],
  },
  {
    title: '第三方认证管理',
    href: '/carbon-footprint/certification',
    icon: BadgeCheck,
    children: [
      { title: '认证资料维护', href: '/carbon-footprint/certification#material' },
      { title: '认证申请', href: '/carbon-footprint/certification#apply' },
      { title: '认证结果管理', href: '/carbon-footprint/certification#result' },
    ],
  },
  {
    title: '因子库管理',
    href: '/carbon-footprint/factor',
    icon: Boxes,
    children: [
      { title: '股份因子同步', href: '/carbon-footprint/factor#sync' },
      { title: '经营单位因子下发', href: '/carbon-footprint/factor#dispatch' },
      { title: '因子集构建', href: '/carbon-footprint/factor#build' },
    ],
  },
  { title: '数据采集清单', href: '/carbon-footprint/data-catalog', icon: Database },
  { title: '基础配置', href: '/carbon-footprint/config', icon: Settings2 },
  { title: '数据接口', href: '/carbon-footprint/interface', icon: Plug },
]

export type PlatformKey = 'zero-carbon' | 'carbon-footprint'

export const platformMeta: Record<
  PlatformKey,
  { name: string; short: string; nav: NavItem[]; icon: LucideIcon; accent: string }
> = {
  'zero-carbon': {
    name: '零碳园区集控中心',
    short: '零碳集控',
    nav: zeroCarbonNav,
    icon: Globe2,
    accent: 'var(--chart-2)',
  },
  'carbon-footprint': {
    name: '产品碳足迹集采中心',
    short: '碳足迹集采',
    nav: carbonFootprintNav,
    icon: Leaf,
    accent: 'var(--chart-1)',
  },
}
