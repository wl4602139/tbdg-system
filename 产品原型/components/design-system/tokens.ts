/**
 * 特变电工能碳数字化双中心 · 标准设计系统 Design Tokens
 * 依据特变电工官方《UI页面修改 (2).pdf》与集控中心实战标准定义
 */

export interface EnergyMediaToken {
  id: string
  name: string
  color: string
  unit: string
  tailwindText: string
  tailwindBg: string
  desc: string
}

export interface TouPeriodToken {
  id: 'sharp' | 'peak' | 'flat' | 'valley'
  name: string
  short: string
  color: string
  tailwindText: string
  tailwindBg: string
  desc: string
}

/**
 * 1. 8 大能源介质官方标准色字典 (Color Tokens)
 * 全系统中所有能源图表、卡片指标、进度条及徽章 100% 同步执行
 */
export const ENERGY_MEDIA_TOKENS: Record<string, EnergyMediaToken> = {
  electricity: {
    id: 'electricity',
    name: '总用电量',
    color: '#2C7CFF',
    unit: 'kWh',
    tailwindText: 'text-[#2C7CFF]',
    tailwindBg: 'bg-[#2C7CFF]',
    desc: '平台主题科技主色、全厂总用电量、主操作按钮',
  },
  grid: {
    id: 'grid',
    name: '市电量',
    color: '#41C0FF',
    unit: 'kWh',
    tailwindText: 'text-[#41C0FF]',
    tailwindBg: 'bg-[#41C0FF]',
    desc: '电网购入电量、市电供应占比、受电变压器监测',
  },
  green: {
    id: 'green',
    name: '直供绿电量',
    color: '#00D492',
    unit: 'kWh',
    tailwindText: 'text-[#00D492]',
    tailwindBg: 'bg-[#00D492]',
    desc: '分布式光伏发电、市场化绿电直购、零碳绿电消纳率',
  },
  water: {
    id: 'water',
    name: '水资源',
    color: '#10C4CE',
    unit: 't',
    tailwindText: 'text-[#10C4CE]',
    tailwindBg: 'bg-[#10C4CE]',
    desc: '新鲜工业用水、循环冷却水消耗、万元产值用水量',
  },
  gas: {
    id: 'gas',
    name: '天然气',
    color: '#FF6536',
    unit: 'm³',
    tailwindText: 'text-[#FF6536]',
    tailwindBg: 'bg-[#FF6536]',
    desc: '窑炉天然气消耗、锅炉燃烧热力、烘房用气监测',
  },
  steam: {
    id: 'steam',
    name: '蒸汽',
    color: '#FFBA00',
    unit: 't',
    tailwindText: 'text-[#FFBA00]',
    tailwindBg: 'bg-[#FFBA00]',
    desc: '外购蒸汽总量、工艺干燥固化蒸汽单耗（原管道工作压力规范）',
  },
  oil: {
    id: 'oil',
    name: '油消耗',
    color: '#8E73ED',
    unit: 'L',
    tailwindText: 'text-[#8E73ED]',
    tailwindBg: 'bg-[#8E73ED]',
    desc: '变压器油注油台账、柴油发电机应急燃油消耗',
  },
  nitrogen: {
    id: 'nitrogen',
    name: '液氮',
    color: '#4F39F6',
    unit: 'Nm³',
    tailwindText: 'text-[#4F39F6]',
    tailwindBg: 'bg-[#4F39F6]',
    desc: '低温试验保护、特殊制造氮气介质消耗',
  },
}

/**
 * 2. 分时电量 4 段类型色字典 (TOU: 尖 / 峰 / 平 / 谷)
 */
export const TOU_PERIOD_TOKENS: Record<string, TouPeriodToken> = {
  sharp: {
    id: 'sharp',
    name: '尖峰时段',
    short: '尖',
    color: '#FF6536',
    tailwindText: 'text-[#FF6536]',
    tailwindBg: 'bg-[#FF6536]',
    desc: '尖峰时段用电量、避峰负荷监测',
  },
  peak: {
    id: 'peak',
    name: '高峰时段',
    short: '峰',
    color: '#FFBA00',
    tailwindText: 'text-[#FFBA00]',
    tailwindBg: 'bg-[#FFBA00]',
    desc: '高峰时段用电量、生产班次负荷走势',
  },
  flat: {
    id: 'flat',
    name: '平段时段',
    short: '平',
    color: '#2C7CFF',
    tailwindText: 'text-[#2C7CFF]',
    tailwindBg: 'bg-[#2C7CFF]',
    desc: '平段时段用电量、常规连续负荷',
  },
  valley: {
    id: 'valley',
    name: '低谷时段',
    short: '谷',
    color: '#10C4CE',
    tailwindText: 'text-[#10C4CE]',
    tailwindBg: 'bg-[#10C4CE]',
    desc: '低谷蓄能用电、储能充电时段用电量、谷电消纳占比',
  },
}

/**
 * 3. 工业人机工程布局与尺寸标尺 (Layout Tokens)
 */
export const LAYOUT_TOKENS = {
  tableRowHeight: '44px',           // 强制 44px 工业高密表格行高
  sidebarWidth: '260px',            // 统一固定 260px 左侧导航栏宽度
  treeNodeHeight: '30px',           // 拓扑树与导航项垂直间距/行高 30px
  panelRadius: '8px',               // 全站卡片容器统一 8px 圆角 (rounded-lg)
  panelSpacing: '24px',             // 板块垂直/水平间距 24px (gap-6 / space-y-6)
  exportButton: {
    width: '80px',
    height: '36px',
    bgColor: '#2C7CFF',
    radius: '8px',
  },
  formControls: {
    width: '200px',
    height: '36px',
    radius: '8px',
    borderColor: '#E2E8F0',
  },
  pageBackground: {
    light: '#F3F7FB',
    dark: '#030712',
  },
  panelBorder: {
    light: '#DBE6EE',
    dark: 'rgba(255, 255, 255, 0.1)',
  },
  treeActiveBg: {
    light: '#EBF3FF',
    dark: 'rgba(44, 124, 255, 0.2)',
  },
} as const

/**
 * 4. 全局字体排版标尺 (Typography Tokens)
 */
export const TYPOGRAPHY_TOKENS = {
  panelTitle: { size: '16px', weight: 'bold', class: 'text-base font-bold' },
  cardTitle: { size: '14px', weight: 'medium', class: 'text-sm font-medium' },
  kpiValue: { size: '24px', weight: 'bold', font: 'mono', class: 'font-mono text-2xl font-bold' },
  body: { size: '14px', weight: 'normal', class: 'text-sm' },
  tableCell: { size: '14px', weight: 'normal', class: 'text-sm font-sans' },
  caption: { size: '14px', weight: 'normal', class: 'text-sm text-muted-foreground' },
  badge: { size: '12px', weight: 'medium', class: 'text-xs font-medium' },
} as const
