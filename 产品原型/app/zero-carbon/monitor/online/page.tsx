'use client'

import React, { useState, useMemo } from 'react'
import {
  Activity,
  Zap,
  Sun,
  BatteryCharging,
  Flame,
  Droplets,
  Building2,
  Factory,
  Layers,
  Search,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  Gauge,
  Sparkles,
  RefreshCw,
  Cpu,
  Clock,
  Download,
  Calendar,
  Plus,
  Coins,
  DollarSign,
  PieChart,
  FileText,
  X,
  Filter,
  Check,
} from 'lucide-react'
import { LineTrend } from '@/components/shared/charts'
import { cn } from '@/lib/utils'

// 17 个零碳产业园区拓扑数据
interface GridCompanyItem {
  id: string
  name: string
}

interface ParkNode {
  id: string
  name: string
  company: string
  loadKw: number
  pvKw: number
  storageKw: number
  pvSavings: string
  surplusRevenue: string
  greenRate: number
  companies: GridCompanyItem[]
  gridPoints: {
    name: string
    accountName: string
    voltage: string
    loadKw: number
    status: '正常' | '检修' | '无变压器'
  }[]
}

const ALL_17_PARKS: ParkNode[] = [
  {
    id: 'park_01',
    name: '特变电工东北输变电产业园',
    company: '沈变公司',
    loadKw: 12450,
    pvKw: 4850,
    storageKw: 1200,
    pvSavings: '¥42.5万/月',
    surplusRevenue: '¥8.6万/月',
    greenRate: 48.6,
    companies: [
      { id: 'comp_sb_main', name: '沈变公司 (沈变本部)' },
      { id: 'comp_sb_hx', name: '和新套管公司' },
      { id: 'comp_sb_kj', name: '康嘉互感器' },
    ],
    gridPoints: [
      { name: '开户并网点 A', accountName: '沈变本部 10kV 第一开闭所', voltage: '10.22 kV', loadKw: 6400, status: '正常' },
      { name: '开户并网点 B', accountName: '和新套管 10kV 专用配电所', voltage: '10.20 kV', loadKw: 3600, status: '正常' },
      { name: '开户并网点 C', accountName: '康嘉互感器 10kV 配电所', voltage: '10.25 kV', loadKw: 2450, status: '正常' },
    ],
  },
  {
    id: 'park_02',
    name: '特变电工南方输变电产业园',
    company: '衡变公司',
    loadKw: 11200,
    pvKw: 4200,
    storageKw: 950,
    pvSavings: '¥38.2万/月',
    surplusRevenue: '¥6.4万/月',
    greenRate: 46.0,
    companies: [
      { id: 'comp_hb_main', name: '衡变公司 (衡变本部)' },
      { id: 'comp_hb_yg', name: '云高电气 (GIS厂)' },
      { id: 'comp_hb_nj', name: '南京电研研发中心' },
    ],
    gridPoints: [
      { name: '开户并网点 A', accountName: '衡变制造中心 10kV 主配电房', voltage: '10.18 kV', loadKw: 7200, status: '正常' },
      { name: '开户并网点 B', accountName: '云高电气 GIS 厂 10kV 配电房', voltage: '10.15 kV', loadKw: 4000, status: '正常' },
      { name: '开户并网点 C', accountName: '南京电研研发中心并网点', voltage: '0.00 kV', loadKw: 0, status: '无变压器' },
    ],
  },
  {
    id: 'park_03',
    name: '特变电工二次产业园区',
    company: '自动化事业部',
    loadKw: 4500,
    pvKw: 1800,
    storageKw: 400,
    pvSavings: '¥15.8万/月',
    surplusRevenue: '¥2.1万/月',
    greenRate: 42.5,
    companies: [{ id: 'comp_zdh', name: '自动化事业部' }],
    gridPoints: [
      { name: '开户并网点 A', accountName: '二次产业园 10kV 总配电房', voltage: '10.20 kV', loadKw: 4500, status: '正常' },
    ],
  },
  {
    id: 'park_04',
    name: '特变电工云集5G科技产业园',
    company: '云集科技',
    loadKw: 5800,
    pvKw: 2100,
    storageKw: 500,
    pvSavings: '¥19.4万/月',
    surplusRevenue: '¥3.2万/月',
    greenRate: 44.1,
    companies: [{ id: 'comp_yj', name: '云集科技' }],
    gridPoints: [
      { name: '开户并网点 A', accountName: '云集5G数据中心开闭所', voltage: '10.21 kV', loadKw: 5800, status: '正常' },
    ],
  },
  {
    id: 'park_05',
    name: '特变电工智能电气产业园',
    company: '智能电气公司',
    loadKw: 8900,
    pvKw: 3500,
    storageKw: 750,
    pvSavings: '¥31.0万/月',
    surplusRevenue: '¥5.5万/月',
    greenRate: 45.8,
    companies: [{ id: 'comp_zndq', name: '智能电气公司' }],
    gridPoints: [
      { name: '开户并网点 A', accountName: '智能电气1号配电房', voltage: '10.19 kV', loadKw: 5200, status: '正常' },
      { name: '开户并网点 B', accountName: '智能电气2号配电房', voltage: '10.22 kV', loadKw: 3700, status: '正常' },
    ],
  },
  {
    id: 'park_06',
    name: '特变电工湖南能源建设园区',
    company: '湖南能源',
    loadKw: 3600,
    pvKw: 1200,
    storageKw: 300,
    pvSavings: '¥11.2万/月',
    surplusRevenue: '¥1.5万/月',
    greenRate: 39.2,
    companies: [{ id: 'comp_hn', name: '湖南能源' }],
    gridPoints: [
      { name: '开户并网点 A', accountName: '能建园区开闭所', voltage: '10.15 kV', loadKw: 3600, status: '正常' },
    ],
  },
  {
    id: 'park_07',
    name: '特变电工西安智能装备产业园',
    company: '西安智能',
    loadKw: 9200,
    pvKw: 4100,
    storageKw: 800,
    pvSavings: '¥36.5万/月',
    surplusRevenue: '¥7.0万/月',
    greenRate: 47.3,
    companies: [{ id: 'comp_xa', name: '西安智能' }],
    gridPoints: [
      { name: '开户并网点 A', accountName: '西安智能装备 10kV 配电所', voltage: '10.24 kV', loadKw: 9200, status: '正常' },
    ],
  },
  {
    id: 'park_08',
    name: '特变电工GIL产业园',
    company: 'GIL事业部',
    loadKw: 6100,
    pvKw: 2400,
    storageKw: 500,
    pvSavings: '¥21.3万/月',
    surplusRevenue: '¥3.8万/月',
    greenRate: 43.0,
    companies: [{ id: 'comp_gil', name: 'GIL事业部' }],
    gridPoints: [
      { name: '开户并网点 A', accountName: 'GIL 生产车间总配电房', voltage: '10.20 kV', loadKw: 6100, status: '正常' },
    ],
  },
  {
    id: 'park_09',
    name: '特变电工输变电产业园',
    company: '新变厂',
    loadKw: 14800,
    pvKw: 6800,
    storageKw: -800,
    pvSavings: '¥56.0万/月',
    surplusRevenue: '¥12.4万/月',
    greenRate: 51.4,
    companies: [
      { id: 'comp_xb_uhv', name: '新变厂 (超高压公司)' },
      { id: 'comp_xb_tb', name: '天变公司' },
    ],
    gridPoints: [
      { name: '开户并网点 A', accountName: '超高压变压器 10kV 开闭所', voltage: '10.25 kV', loadKw: 8800, status: '正常' },
      { name: '开户并网点 B', accountName: '天变中低压制造中心配电房', voltage: '10.21 kV', loadKw: 6000, status: '正常' },
    ],
  },
  {
    id: 'park_10',
    name: '特变电工天变产业园',
    company: '天变公司',
    loadKw: 7200,
    pvKw: 2400,
    storageKw: 400,
    pvSavings: '¥22.5万/月',
    surplusRevenue: '¥3.9万/月',
    greenRate: 38.9,
    companies: [{ id: 'comp_tb', name: '天变公司天津基地' }],
    gridPoints: [
      { name: '开户并网点 A', accountName: '天津基地 10kV 总配电房', voltage: '10.18 kV', loadKw: 7200, status: '正常' },
    ],
  },
  {
    id: 'park_11',
    name: '特变电工京津冀智能科技产业园',
    company: '京津冀科技',
    loadKw: 5100,
    pvKw: 1900,
    storageKw: 350,
    pvSavings: '¥16.9万/月',
    surplusRevenue: '¥2.8万/月',
    greenRate: 41.2,
    companies: [{ id: 'comp_jjj', name: '京津冀科技' }],
    gridPoints: [
      { name: '开户并网点 A', accountName: '京津冀科技配电房', voltage: '10.20 kV', loadKw: 5100, status: '正常' },
    ],
  },
  {
    id: 'park_12',
    name: '特变电工华东输变电科技产业园',
    company: '鲁缆公司',
    loadKw: 9600,
    pvKw: 3800,
    storageKw: 650,
    pvSavings: '¥33.8万/月',
    surplusRevenue: '¥6.2万/月',
    greenRate: 46.4,
    companies: [
      { id: 'comp_ll_main', name: '鲁缆公司 (鲁缆本部)' },
      { id: 'comp_ll_draw', name: '高速拉丝厂' },
    ],
    gridPoints: [
      { name: '开户并网点 A', accountName: '超高压立塔 10kV 专用开闭所', voltage: '10.23 kV', loadKw: 6100, status: '正常' },
      { name: '开户并网点 B', accountName: '高速拉丝车间配电房', voltage: '10.19 kV', loadKw: 3500, status: '正常' },
    ],
  },
  {
    id: 'park_13',
    name: '特变电工曙光电缆产业园',
    company: '曙光电缆',
    loadKw: 7800,
    pvKw: 2900,
    storageKw: 550,
    pvSavings: '¥25.6万/月',
    surplusRevenue: '¥4.5万/月',
    greenRate: 42.8,
    companies: [{ id: 'comp_sg', name: '曙光电缆' }],
    gridPoints: [
      { name: '开户并网点 A', accountName: '曙光电缆总配电房', voltage: '10.20 kV', loadKw: 7800, status: '正常' },
    ],
  },
  {
    id: 'park_14',
    name: '特变电工新疆电缆产业园',
    company: '新缆厂',
    loadKw: 8200,
    pvKw: 3200,
    storageKw: 600,
    pvSavings: '¥28.4万/月',
    surplusRevenue: '¥5.1万/月',
    greenRate: 44.5,
    companies: [{ id: 'comp_xl', name: '新缆厂' }],
    gridPoints: [
      { name: '开户并网点 A', accountName: '新疆电缆 10kV 开闭所', voltage: '10.22 kV', loadKw: 8200, status: '正常' },
    ],
  },
  {
    id: 'park_15',
    name: '特变电工(德阳)电缆园区',
    company: '德缆公司',
    loadKw: 6800,
    pvKw: 1800,
    storageKw: 300,
    pvSavings: '¥16.5万/月',
    surplusRevenue: '¥2.4万/月',
    greenRate: 30.9,
    companies: [{ id: 'comp_dl', name: '德缆公司' }],
    gridPoints: [
      { name: '开户并网点 A', accountName: '德阳电缆 10kV 配电房', voltage: '10.16 kV', loadKw: 6800, status: '正常' },
    ],
  },
  {
    id: 'park_16',
    name: '特变电工山东特能产业园',
    company: '山东特能',
    loadKw: 4200,
    pvKw: 1500,
    storageKw: 250,
    pvSavings: '¥13.2万/月',
    surplusRevenue: '¥1.9万/月',
    greenRate: 40.1,
    companies: [{ id: 'comp_sdtn', name: '山东特能' }],
    gridPoints: [
      { name: '开户并网点 A', accountName: '山东特能配电所', voltage: '10.19 kV', loadKw: 4200, status: '正常' },
    ],
  },
  {
    id: 'park_17',
    name: '特变电工天津装备制造园区',
    company: '天津装备',
    loadKw: 5500,
    pvKw: 2000,
    storageKw: 350,
    pvSavings: '¥17.8万/月',
    surplusRevenue: '¥3.0万/月',
    greenRate: 41.8,
    companies: [{ id: 'comp_tjzb', name: '天津装备' }],
    gridPoints: [
      { name: '开户并网点 A', accountName: '天津装备开闭所', voltage: '10.20 kV', loadKw: 5500, status: '正常' },
    ],
  },
]

// 重点用能设备列表
interface EquipmentItem {
  id: string
  name: string
  code: string
  company: string
  energyType: 'elec' | 'steam' | 'multi'
  powerKW?: number
  energyKWh?: number
  steamFlowT?: number
  pressureMpa?: number
  status: '运行中' | '待机' | '告警'
}

const KEY_EQUIPMENT_LIST: EquipmentItem[] = [
  {
    id: 'eq-dry-01',
    name: '1# 1000kV级煤油气相真空干燥罐组',
    code: 'EQ-SB-DRY-01',
    company: '沈变公司',
    energyType: 'multi',
    powerKW: 4680,
    energyKWh: 112340,
    steamFlowT: 1.85,
    pressureMpa: 0.005,
    status: '运行中',
  },
  {
    id: 'eq-test-02',
    name: '2# 特高压无局放无屏蔽综合试验台',
    code: 'EQ-SB-TEST-02',
    company: '沈变公司',
    energyType: 'elec',
    powerKW: 6850,
    energyKWh: 164400,
    status: '运行中',
  },
  {
    id: 'eq-tower-03',
    name: '3# 500kV 悬垂立塔交联生产线',
    code: 'EQ-LL-TOWER-03',
    company: '鲁缆公司',
    energyType: 'multi',
    powerKW: 3850,
    energyKWh: 92400,
    steamFlowT: 2.10,
    pressureMpa: 1.25,
    status: '运行中',
  },
  {
    id: 'eq-draw-cu-04',
    name: '4# 高速连续铜拉丝机组 (含退火包覆)',
    code: 'EQ-LL-DRAW-04',
    company: '鲁缆公司',
    energyType: 'elec',
    powerKW: 1420,
    energyKWh: 34080,
    status: '运行中',
  },
  {
    id: 'eq-furnace-05',
    name: '5# 取向硅钢片中频感应退火电阻炉',
    code: 'EQ-XB-FURN-05',
    company: '新变厂',
    energyType: 'elec',
    powerKW: 3120,
    energyKWh: 74880,
    status: '运行中',
  },
  {
    id: 'eq-incubator-06',
    name: '6# 横店特种孵化炉 (独立监控单元)',
    code: 'EQ-HD-INC-06',
    company: '衡变公司',
    energyType: 'multi',
    powerKW: 1850,
    energyKWh: 44400,
    steamFlowT: 0.95,
    pressureMpa: 0.65,
    status: '运行中',
  },
]

// 关键工序 (1级企业 ➔ 2级车间工序)
interface CompanyProcessGroup {
  company: string
  processes: { id: string; name: string; type: string }[]
}

const COMPANY_PROCESSES: CompanyProcessGroup[] = [
  {
    company: '沈变公司',
    processes: [
      { id: 'prc_sb_01', name: '真空干燥工段 (煤油气相)', type: '离线按日分析' },
      { id: 'prc_sb_02', name: '铁芯剪切与叠装工序', type: '分表求和' },
      { id: 'prc_sb_03', name: '线圈绕制与绝缘处理', type: '分表求和' },
      { id: 'prc_sb_04', name: '总装配与高压试验', type: '离线按日分析' },
    ],
  },
  {
    company: '衡变公司',
    processes: [
      { id: 'prc_hb_01', name: 'GIS 封闭组合电器工序', type: '离线按日分析' },
      { id: 'prc_hb_02', name: '特种孵化固化工段', type: '分表求和' },
    ],
  },
  {
    company: '新变厂',
    processes: [
      { id: 'prc_xb_01', name: '超高压干燥与退火工序', type: '离线按日分析' },
      { id: 'prc_xb_02', name: '硅钢片退火工段', type: '分表求和' },
    ],
  },
  {
    company: '鲁缆公司',
    processes: [
      { id: 'prc_ll_01', name: '500kV 悬垂立塔共挤工段', type: '离线按日分析' },
      { id: 'prc_ll_02', name: '铜拉丝与导体绞合工序', type: '分表求和' },
    ],
  },
  {
    company: '新缆厂',
    processes: [{ id: 'prc_xl_01', name: '中低压交联绝缘工段', type: '离线按日分析' }],
  },
  {
    company: '德缆公司',
    processes: [{ id: 'prc_dl_01', name: '特种装备绞合工段', type: '分表求和' }],
  },
]

// 绿电绿证交易采购台账
interface GreenTradeRecord {
  id: string
  period: string
  company: string
  greenElecKWh: string
  greenCertificateCount: number
  carbonOffsetTCO2: string
  voucherNo: string
}

const INITIAL_GREEN_TRADES: GreenTradeRecord[] = [
  { id: 'gt-01', period: '2026-08', company: '沈变公司', greenElecKWh: '1,200,000', greenCertificateCount: 1200, carbonOffsetTCO2: '684.3', voucherNo: 'TBEA-GC-20260801' },
  { id: 'gt-02', period: '2026-08', company: '衡变公司', greenElecKWh: '950,000', greenCertificateCount: 950, carbonOffsetTCO2: '541.7', voucherNo: 'TBEA-GC-20260802' },
  { id: 'gt-03', period: '2026-08', company: '鲁缆公司', greenElecKWh: '850,000', greenCertificateCount: 850, carbonOffsetTCO2: '484.7', voucherNo: 'TBEA-GC-20260803' },
  { id: 'gt-04', period: '2026-07', company: '沈变公司', greenElecKWh: '1,150,000', greenCertificateCount: 1150, carbonOffsetTCO2: '655.8', voucherNo: 'TBEA-GC-20260701' },
]

// 🌟 动态根据 activeTab 呈现的左侧拓扑树组件
interface DynamicSidebarTreeProps {
  activeTab: 'microgrid' | 'equipment' | 'process'
  selectedParkId: string
  onSelectPark: (id: string) => void
  selectedEqId: string
  onSelectEq: (id: string) => void
}

function DynamicSidebarTree({
  activeTab,
  selectedParkId,
  onSelectPark,
  selectedEqId,
  onSelectEq,
}: DynamicSidebarTreeProps) {
  const [searchKw, setSearchKw] = useState('')
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({})

  const toggleExpand = (id: string) => {
    setExpandedKeys((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // 1. 电网全景: 园区 ➔ 关联企业
  const gridParkTree = useMemo(() => {
    const kw = searchKw.trim().toLowerCase()
    return ALL_17_PARKS.filter((p) => {
      if (!kw) return true
      return (
        p.name.toLowerCase().includes(kw) ||
        p.company.toLowerCase().includes(kw) ||
        p.companies.some((c) => c.name.toLowerCase().includes(kw))
      )
    })
  }, [searchKw])

  // 2. 重点设备: 6大经营企业 ➔ 下级推送设备
  const companyEquipmentMap = useMemo(() => {
    const map: Record<string, EquipmentItem[]> = {
      沈变公司: [],
      衡变公司: [],
      新变厂: [],
      鲁缆公司: [],
      新缆厂: [],
      德缆公司: [],
    }
    KEY_EQUIPMENT_LIST.forEach((eq) => {
      if (!map[eq.company]) map[eq.company] = []
      map[eq.company].push(eq)
    })
    return map
  }, [])

  return (
    <aside className="w-[270px] min-w-[270px] max-w-[270px] shrink-0 sticky top-0 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-[calc(100vh-84px)] overflow-hidden">
      {/* 1. 动态 Header 标题 */}
      <div className="p-3 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <Building2 className="size-4 text-[#1677ff]" />
          <span>
            {activeTab === 'microgrid' && '园区与企业拓扑 (电网全景)'}
            {activeTab === 'equipment' && '企业及下级推送设备拓扑'}
            {activeTab === 'process' && '企业与关键工序拓扑 (1,2级)'}
          </span>
        </div>
        <span className="text-[10px] text-[#1677ff] font-mono font-bold">
          {activeTab === 'microgrid' && '17 园区'}
          {activeTab === 'equipment' && '设备感知'}
          {activeTab === 'process' && '日更新'}
        </span>
      </div>

      {/* 2. 检索框 */}
      <div className="p-2 border-b border-slate-100 bg-white shrink-0">
        <div className="relative">
          <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchKw}
            onChange={(e) => setSearchKw(e.target.value)}
            placeholder="搜索节点 / 企业 / 设备..."
            className="w-full pl-8 pr-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1677ff] placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* 3. 动态树节点 */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar text-xs">
        
        {/* ========================================================================= */}
        {/* 模式 A: 切换到【电网全景监测】时，显示园区结构，园区下包含关联的企业 */}
        {/* ========================================================================= */}
        {activeTab === 'microgrid' && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 py-1 px-1.5 rounded bg-blue-50/70 text-[#1677ff] font-bold">
              <Building2 className="size-3.5 shrink-0 text-[#1677ff]" />
              <span className="flex-1 truncate">特变电工集团 (17园区全景)</span>
              <span className="text-[9.5px] px-1 py-0.2 rounded bg-blue-100 text-blue-700 font-mono">17 园区</span>
            </div>

            <div className="border-l border-slate-200 ml-3.5 pl-2 space-y-1">
              {gridParkTree.map((park) => {
                const isExpanded = Boolean(expandedKeys[park.id])
                const isCollapsed = !isExpanded
                const isParkSelected = selectedParkId === park.id

                return (
                  <div key={park.id} className="space-y-0.5">
                    {/* 园区节点 */}
                    <div
                      onClick={() => onSelectPark(park.id)}
                      className={cn(
                        'flex items-center gap-1.5 py-1 px-1.5 rounded cursor-pointer transition-colors text-[11.5px]',
                        isParkSelected
                          ? 'bg-[#e6f4ff] text-[#1677ff] font-bold shadow-2xs'
                          : 'hover:bg-slate-100 text-slate-800'
                      )}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleExpand(park.id)
                        }}
                        className="size-3.5 flex items-center justify-center text-slate-400 shrink-0"
                      >
                        <ChevronRight className={cn('size-3 transition-transform', !isCollapsed && 'rotate-90')} />
                      </button>
                      <span className="flex-1 truncate" title={park.name}>{park.name}</span>
                      <span className="text-[10px] font-mono text-emerald-600 font-bold shrink-0">{park.loadKw}kW</span>
                    </div>

                    {/* 园区下关联的企业节点 */}
                    {!isCollapsed && (
                      <div className="border-l border-slate-200 ml-3 pl-2 space-y-0.5">
                        {park.companies.map((c) => (
                          <div
                            key={c.id}
                            className="flex items-center gap-1.5 py-1 px-1.5 rounded text-slate-600 hover:bg-slate-100 cursor-pointer text-[11px]"
                          >
                            <Factory className="size-3 text-slate-400 shrink-0" />
                            <span className="truncate">{c.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 模式 B: 切换到【重点用能设备】时，显示企业结构，企业下显示下级推送的重点设备 */}
        {/* ========================================================================= */}
        {activeTab === 'equipment' && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 py-1 px-1.5 rounded bg-blue-50/70 text-[#1677ff] font-bold">
              <Building2 className="size-3.5 shrink-0 text-[#1677ff]" />
              <span className="flex-1 truncate">特变电工集团 (经营企业)</span>
              <span className="text-[9.5px] px-1 py-0.2 rounded bg-blue-100 text-blue-700 font-mono">6 大企业</span>
            </div>

            <div className="border-l border-slate-200 ml-3.5 pl-2 space-y-1">
              {Object.entries(companyEquipmentMap).map(([companyName, eqList]) => {
                const isExpanded = Boolean(expandedKeys[`comp_eq_${companyName}`])
                const isCollapsed = !isExpanded

                return (
                  <div key={companyName} className="space-y-0.5">
                    {/* 企业节点 */}
                    <div
                      onClick={() => toggleExpand(`comp_eq_${companyName}`)}
                      className="flex items-center gap-1.5 py-1 px-1.5 rounded text-slate-800 font-bold hover:bg-slate-100 cursor-pointer transition-colors"
                    >
                      <button type="button" className="size-3.5 flex items-center justify-center text-slate-400 shrink-0">
                        <ChevronRight className={cn('size-3 transition-transform', !isCollapsed && 'rotate-90')} />
                      </button>
                      <span className="flex-1 truncate">{companyName}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 font-mono font-bold">
                        {eqList.length} 台设备
                      </span>
                    </div>

                    {/* 企业下显示的下级推送重点用能设备 */}
                    {!isCollapsed && (
                      <div className="border-l border-slate-200 ml-3 pl-2 space-y-0.5">
                        {eqList.map((eq) => {
                          const isEqSelected = selectedEqId === eq.id
                          return (
                            <div
                              key={eq.id}
                              onClick={() => onSelectEq(eq.id)}
                              className={cn(
                                'flex items-center justify-between py-1 px-1.5 rounded cursor-pointer transition-colors text-[11px]',
                                isEqSelected
                                  ? 'bg-[#e6f4ff] text-[#1677ff] font-bold shadow-2xs'
                                  : 'hover:bg-slate-100 text-slate-700'
                              )}
                            >
                              <div className="flex items-center gap-1 truncate">
                                <Cpu className="size-3 text-[#1677ff] shrink-0" />
                                <span className="truncate" title={eq.name}>{eq.name}</span>
                              </div>
                              <span className="text-[9.5px] font-mono text-emerald-600 shrink-0 font-bold ml-1">
                                {eq.powerKW}kW
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 模式 C: 切换到【关键工序监测】时，显示企业结构 (1级企业 ➔ 2级车间工序) */}
        {/* ========================================================================= */}
        {activeTab === 'process' && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 py-1 px-1.5 rounded bg-blue-50/70 text-[#1677ff] font-bold">
              <Building2 className="size-3.5 shrink-0 text-[#1677ff]" />
              <span className="flex-1 truncate">特变电工集团 (1,2级企业工序)</span>
              <span className="text-[9.5px] px-1 py-0.2 rounded bg-blue-100 text-blue-700 font-mono">日更新</span>
            </div>

            <div className="border-l border-slate-200 ml-3.5 pl-2 space-y-1">
              {COMPANY_PROCESSES.map((cp) => {
                const isExpanded = Boolean(expandedKeys[`comp_prc_${cp.company}`])
                const isCollapsed = !isExpanded

                return (
                  <div key={cp.company} className="space-y-0.5">
                    {/* 1 级经营企业 */}
                    <div
                      onClick={() => toggleExpand(`comp_prc_${cp.company}`)}
                      className="flex items-center gap-1.5 py-1 px-1.5 rounded text-slate-800 font-bold hover:bg-slate-100 cursor-pointer transition-colors"
                    >
                      <button type="button" className="size-3.5 flex items-center justify-center text-slate-400 shrink-0">
                        <ChevronRight className={cn('size-3 transition-transform', !isCollapsed && 'rotate-90')} />
                      </button>
                      <span className="flex-1 truncate">{cp.company} (1级企业)</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-mono font-bold">
                        {cp.processes.length} 工序
                      </span>
                    </div>

                    {/* 2 级车间工序 */}
                    {!isCollapsed && (
                      <div className="border-l border-slate-200 ml-3 pl-2 space-y-0.5">
                        {cp.processes.map((prc) => (
                          <div
                            key={prc.id}
                            className="flex items-center justify-between py-1 px-1.5 rounded text-slate-700 hover:bg-slate-100 cursor-pointer text-[11px]"
                          >
                            <div className="flex items-center gap-1 truncate">
                              <Layers className="size-3 text-purple-600 shrink-0" />
                              <span className="truncate">{prc.name} (2级工序)</span>
                            </div>
                            <span className="text-[9px] font-mono text-purple-700 bg-purple-50 px-1 py-0.2 rounded shrink-0">
                              {prc.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>

      {/* 4. 底部状态栏 */}
      <div className="px-3 py-2 bg-slate-50/80 border-t border-slate-100 text-[10.5px] text-slate-500 flex items-center justify-between font-mono shrink-0">
        <span>拓扑数据动态感知就绪</span>
        <span className="text-emerald-600 font-bold">100% 在线</span>
      </div>
    </aside>
  )
}

export default function OnlineMonitoringPage() {
  // 核心 3 大 Tab 划分
  const [activeTab, setActiveTab] = useState<'microgrid' | 'equipment' | 'process'>('microgrid')

  // 电网全景: 当前选中园区
  const [selectedParkId, setSelectedParkId] = useState<string>('park_01')

  // 时间筛选 (自定义日期与15分钟颗粒度)
  const [queryDate, setQueryDate] = useState('2026-08-27')

  // 重点设备: 当前选中设备与设备检索关键词
  const [selectedEqId, setSelectedEqId] = useState<string>('eq-dry-01')
  const [eqSearchKey, setEqSearchKey] = useState('')

  // 绿电绿证手动录入 Modal
  const [showAddTradeModal, setShowAddTradeModal] = useState(false)
  const [greenTrades, setGreenTrades] = useState<GreenTradeRecord[]>(INITIAL_GREEN_TRADES)
  const [newTrade, setNewTrade] = useState({
    period: '2026-08',
    company: '沈变公司',
    greenElecKWh: '500,000',
    greenCertificateCount: 500,
    carbonOffsetTCO2: '285.1',
    voucherNo: `TBEA-GC-${Date.now().toString().slice(-6)}`,
  })

  // 当前选中园区对象
  const selectedPark = useMemo(() => {
    return ALL_17_PARKS.find((p) => p.id === selectedParkId) || ALL_17_PARKS[0]
  }, [selectedParkId])

  // 过滤后的设备列表
  const filteredEquipments = useMemo(() => {
    if (!eqSearchKey.trim()) return KEY_EQUIPMENT_LIST
    return KEY_EQUIPMENT_LIST.filter(
      (e) =>
        e.name.toLowerCase().includes(eqSearchKey.toLowerCase()) ||
        e.code.toLowerCase().includes(eqSearchKey.toLowerCase()) ||
        e.company.toLowerCase().includes(eqSearchKey.toLowerCase())
    )
  }, [eqSearchKey])

  const selectedEq = useMemo(() => {
    return KEY_EQUIPMENT_LIST.find((e) => e.id === selectedEqId) || KEY_EQUIPMENT_LIST[0]
  }, [selectedEqId])

  // 24小时源网荷储微电网负荷与发供平衡曲线模拟 (合并曲线)
  const dayTrendData = [
    { time: '00:00', 园区总负荷: 6800, 光伏出力: 0, 市电受电: 6800, 储能充放: 0 },
    { time: '03:00', 园区总负荷: 6200, 光伏出力: 0, 市电受电: 6200, 储能充放: 0 },
    { time: '06:00', 园区总负荷: 7800, 光伏出力: 450, 市电受电: 7350, 储能充放: 0 },
    { time: '09:00', 园区总负荷: 11400, 光伏出力: 3100, 市电受电: 7500, 储能充放: 800 },
    { time: '12:00', 园区总负荷: 12450, 光伏出力: 4850, 市电受电: 6400, 储能充放: 1200 },
    { time: '15:00', 园区总负荷: 13800, 光伏出力: 4100, 市电受电: 8500, 储能充放: 1200 },
    { time: '18:00', 园区总负荷: 10500, 光伏出力: 350, 市电受电: 9350, 储能充放: 800 },
    { time: '21:00', 园区总负荷: 8900, 光伏出力: 0, 市电受电: 8900, 储能充放: 0 },
  ]

  // 设备 24 小时工况走势模拟
  const eqTrendData = [
    { time: '00:00', 实时功率KW: 4200, 累计电量KWh: 98000, 蒸汽流量T: 1.70 },
    { time: '04:00', 实时功率KW: 4400, 累计电量KWh: 102000, 蒸汽流量T: 1.75 },
    { time: '08:00', 实时功率KW: 4680, 累计电量KWh: 106000, 蒸汽流量T: 1.85 },
    { time: '12:00', 实时功率KW: 4650, 累计电量KWh: 110000, 蒸汽流量T: 1.82 },
    { time: '16:00', 实时功率KW: 4600, 累计电量KWh: 112000, 蒸汽流量T: 1.80 },
    { time: '20:00', 实时功率KW: 4300, 累计电量KWh: 114000, 蒸汽流量T: 1.72 },
  ]

  // 新增交易记录处理
  const handleAddTrade = (e: React.FormEvent) => {
    e.preventDefault()
    const item: GreenTradeRecord = {
      id: `gt-${Date.now()}`,
      ...newTrade,
    }
    setGreenTrades([item, ...greenTrades])
    setShowAddTradeModal(false)
    alert('✅ 绿电/绿证购买记录手动录入成功，已同步计入园区月度绿电汇总！')
  }

  return (
    <div className="flex w-full items-start gap-4">
      {/* 🌟 左侧 270px 动态根据 3 大 Tab 调整的拓扑树 Component */}
      <DynamicSidebarTree
        activeTab={activeTab}
        selectedParkId={selectedParkId}
        onSelectPark={(id) => setSelectedParkId(id)}
        selectedEqId={selectedEqId}
        onSelectEq={(id) => setSelectedEqId(id)}
      />

      {/* 🌟 右侧工作主面板 */}
      <div className="flex-1 min-w-0 space-y-3.5">
        
        {/* 顶部 3 大核心 Tab 导航与时间筛选 */}
        <div className="bg-white p-3.5 rounded-xl border border-[#e5e7eb] shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
              <Activity className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-slate-800">在线监测中心 · 电力与用能全景</h1>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-[#1677ff] border border-blue-200 font-mono font-bold">
                  15分钟颗粒度
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-mono">
                当前监控对象：【<span className="font-bold text-[#1677ff] font-sans">{selectedPark.name}</span>】 · 归属公司：{selectedPark.company}
              </p>
            </div>
          </div>

          {/* 3 大板块 Tab 切换 */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('microgrid')}
              className={cn(
                'px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5 cursor-pointer',
                activeTab === 'microgrid'
                  ? 'bg-[#1677ff] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <Zap className="size-3.5" />
              1. 电网全景监测 (微电网)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('equipment')}
              className={cn(
                'px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5 cursor-pointer',
                activeTab === 'equipment'
                  ? 'bg-[#1677ff] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <Cpu className="size-3.5" />
              2. 重点用能设备监测
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('process')}
              className={cn(
                'px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5 cursor-pointer',
                activeTab === 'process'
                  ? 'bg-[#1677ff] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <Layers className="size-3.5" />
              3. 关键工序监测 (日更新)
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 板块 1: 电网全景监测 (微电网群体监测) */}
        {/* ========================================================================= */}
        {activeTab === 'microgrid' && (
          <div className="space-y-3.5">
            {/* 时间筛选与绿电录入操作栏 */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Calendar className="size-4 text-[#1677ff]" />
                  <span>历史数据 15 分钟颗粒度查询:</span>
                </span>
                <input
                  type="date"
                  value={queryDate}
                  onChange={(e) => setQueryDate(e.target.value)}
                  className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md font-mono text-slate-800 focus:outline-none focus:border-[#1677ff]"
                />
                <span className="text-slate-400 font-mono">默认展示当天实时采样数据</span>
              </div>

              <button
                type="button"
                onClick={() => setShowAddTradeModal(true)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
              >
                <Plus className="size-4" />
                <span>+ 手动录入绿电/绿证购买</span>
              </button>
            </div>

            {/* 4 栏微电网实时 KPI 卡片 (只保留功率、电量、省钱金额，砍掉 SOC/SOH) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
                <div className="text-xs text-slate-500 font-sans flex items-center justify-between">
                  <span>⚡ 园区受电总负荷 (市电)</span>
                  <span className="text-[10px] px-1 py-0.2 rounded bg-blue-50 text-blue-700 font-bold">
                    实时在线
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-slate-900">
                  {selectedPark.loadKw.toLocaleString()} <span className="text-xs font-normal text-slate-500 font-sans">kW</span>
                </div>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex justify-between font-sans">
                  <span>日累计用电: 215.4 MWh</span>
                  <span className="text-blue-600 font-mono">10kV 进线</span>
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
                <div className="text-xs text-slate-500 font-sans flex items-center justify-between">
                  <span>☀️ 光伏实时功率与收益</span>
                  <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold">
                    发供平衡
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-emerald-600">
                  {selectedPark.pvKw.toLocaleString()} <span className="text-xs font-normal text-slate-500 font-sans">kW</span>
                </div>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex justify-between font-sans">
                  <span>光伏发电省钱: <strong className="text-emerald-700">{selectedPark.pvSavings}</strong></span>
                  <span className="text-emerald-600 font-mono font-bold">消纳 100%</span>
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
                <div className="text-xs text-slate-500 font-sans flex items-center justify-between">
                  <span>🔋 储能充放电功率</span>
                  <span className="text-[10px] px-1 py-0.2 rounded bg-amber-50 text-amber-700 font-bold">
                    削峰放电
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-amber-600">
                  {selectedPark.storageKw} <span className="text-xs font-normal text-slate-500 font-sans">kW</span>
                </div>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex justify-between font-sans">
                  <span>日充放电量: 4,800 kWh</span>
                  <span className="text-amber-700 font-mono">充放功率</span>
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
                <div className="text-xs text-slate-500 font-sans flex items-center justify-between">
                  <span>💰 超发上网收益与绿电比</span>
                  <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold">
                    收益测算
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-emerald-700">
                  {selectedPark.surplusRevenue}
                </div>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex justify-between font-sans">
                  <span>绿电占比: <strong className="text-slate-800 font-mono">{selectedPark.greenRate}%</strong></span>
                  <span className="text-emerald-700 font-mono font-bold">超发上网</span>
                </div>
              </div>
            </div>

            {/* 24 小时微电网合并走势曲线 (园区总负荷、光伏、市电、储能) */}
            <div className="bg-white p-4 rounded-xl border border-[#e5e7eb] shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#1677ff]" />
                  <h3 className="text-xs font-bold text-slate-800">
                    【{selectedPark.name}】24 小时源网荷储微电网合并平衡曲线 (功率/kW)
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="flex items-center gap-1 text-slate-800 font-bold">
                    <span className="size-2.5 rounded-full bg-[#1e293b]" /> 园区总负荷
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 font-bold">
                    <span className="size-2.5 rounded-full bg-emerald-500" /> 光伏出力
                  </span>
                  <span className="flex items-center gap-1 text-blue-600 font-bold">
                    <span className="size-2.5 rounded-full bg-[#1677ff]" /> 市电受电
                  </span>
                  <span className="flex items-center gap-1 text-amber-600 font-bold">
                    <span className="size-2.5 rounded-full bg-amber-500" /> 储能充放电
                  </span>
                </div>
              </div>

              <div className="h-[280px]">
                <LineTrend
                  data={dayTrendData}
                  xKey="time"
                  height={280}
                  lines={[
                    { key: '园区总负荷', name: '园区总负荷', color: '#1e293b' },
                    { key: '光伏出力', name: '分布式光伏', color: '#10b981' },
                    { key: '市电受电', name: '市电主网供', color: '#1677ff' },
                    { key: '储能充放', name: '储能充放', color: '#f59e0b' },
                  ]}
                />
              </div>
            </div>

            {/* 并网点拆分呈现 (按经营单位独立开户，如无变压器显 0) */}
            <div className="bg-white p-4 rounded-xl border border-[#e5e7eb] shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-800">
                    【{selectedPark.name}】开户并网点拆分呈现 (按经营单位独立开户)
                  </h3>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
                    底层系统直接读取
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">无变压器节点直接显示“0”</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {selectedPark.gridPoints.map((gp, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900">{gp.name}</span>
                      <span
                        className={cn(
                          'text-[10px] px-1.5 py-0.2 rounded font-bold',
                          gp.status === '正常'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-200 text-slate-600'
                        )}
                      >
                        {gp.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 font-medium">{gp.accountName}</div>
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-mono">
                      <span>母线电压: <strong className="text-blue-600">{gp.voltage}</strong></span>
                      <span>实时负荷: <strong className="text-slate-900">{gp.loadKw} kW</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 月度绿电绿证采购台账 (按工厂月度录入与汇总) */}
            <div className="bg-white p-4 rounded-xl border border-[#e5e7eb] shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <Coins className="size-4 text-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-800">
                    【{selectedPark.name}】旗下工厂月度绿电直供与绿证购买台账
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">按月汇总核算</span>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#f8fafc] text-slate-600 border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="px-3 py-2">采购账期</th>
                      <th className="px-3 py-2">工厂/项目公司</th>
                      <th className="px-3 py-2 font-mono">直供绿电量 (kWh)</th>
                      <th className="px-3 py-2 font-mono">绿证购买张数 (张)</th>
                      <th className="px-3 py-2 font-mono">折抵碳减排 (tCO2)</th>
                      <th className="px-3 py-2">交易凭证编号</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {greenTrades.map((gt) => (
                      <tr key={gt.id} className="hover:bg-slate-50">
                        <td className="px-3 py-2 font-bold text-slate-800">{gt.period}</td>
                        <td className="px-3 py-2 font-sans font-semibold text-slate-900">{gt.company}</td>
                        <td className="px-3 py-2 text-emerald-600 font-bold">{gt.greenElecKWh}</td>
                        <td className="px-3 py-2 text-blue-600 font-bold">{gt.greenCertificateCount} 张</td>
                        <td className="px-3 py-2 text-slate-700">{gt.carbonOffsetTCO2} tCO2</td>
                        <td className="px-3 py-2 font-sans text-slate-500">{gt.voucherNo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 板块 2: 重点用能设备监测 (重点设备挂载至项目公司，只保留功率与电量) */}
        {/* ========================================================================= */}
        {activeTab === 'equipment' && (
          <div className="space-y-3.5">
            {/* 搜索与卡片式列表 */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 max-w-sm">
                <Search className="size-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={eqSearchKey}
                  onChange={(e) => setEqSearchKey(e.target.value)}
                  placeholder="输入设备名称/编号 (如: 干燥罐 / 试验台 / 立塔交联机)..."
                  className="w-full px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#1677ff]"
                />
              </div>
              <span className="text-slate-400 font-mono">
                挂载节点：项目公司（二级单位） · 仅监控关键设备
              </span>
            </div>

            {/* 当前选中重点设备卡片 */}
            <div className="p-4 bg-white rounded-xl border border-[#e5e7eb] shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <Cpu className="size-5 text-purple-600" />
                  <div>
                    <h2 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      {selectedEq.name}
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
                        {selectedEq.code}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-bold">
                        {selectedEq.company}
                      </span>
                    </h2>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      能源类型：{selectedEq.energyType === 'multi' ? '⚡ 电能 + ♨️ 蒸汽 多能源' : '⚡ 单纯电力'}
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  ● 运行中
                </span>
              </div>

              {/* 实时参数 (严格遵循规则：只保留功率和电量/流量，不显示电流电压) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 space-y-1">
                  <span className="text-[11px] text-slate-500 font-sans block">⚡ 实时有功功率</span>
                  <div className="text-xl font-extrabold text-blue-700">
                    {selectedEq.powerKW ? selectedEq.powerKW.toLocaleString() : 0} <span className="text-xs font-normal text-slate-500 font-sans">kW</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1">
                  <span className="text-[11px] text-slate-500 font-sans block">⚡ 当月累计用电量</span>
                  <div className="text-xl font-extrabold text-emerald-700">
                    {selectedEq.energyKWh ? selectedEq.energyKWh.toLocaleString() : 0} <span className="text-xs font-normal text-slate-500 font-sans">kWh</span>
                  </div>
                </div>

                {selectedEq.steamFlowT ? (
                  <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 space-y-1">
                    <span className="text-[11px] text-slate-500 font-sans block">♨️ 蒸汽瞬时流量</span>
                    <div className="text-xl font-extrabold text-purple-700">
                      {selectedEq.steamFlowT} <span className="text-xs font-normal text-slate-500 font-sans">t/h</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 opacity-60">
                    <span className="text-[11px] text-slate-400 font-sans block">♨️ 蒸汽介质</span>
                    <div className="text-xs font-bold text-slate-400 py-1 font-sans">未配置蒸汽介质</div>
                  </div>
                )}

                {selectedEq.pressureMpa ? (
                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1">
                    <span className="text-[11px] text-slate-500 font-sans block">♨️ 管道工作压力</span>
                    <div className="text-xl font-extrabold text-amber-700">
                      {selectedEq.pressureMpa} <span className="text-xs font-normal text-slate-500 font-sans">MPa</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 opacity-60">
                    <span className="text-[11px] text-slate-400 font-sans block">♨️ 压力监控</span>
                    <div className="text-xs font-bold text-slate-400 py-1 font-sans">未关联管道压力</div>
                  </div>
                )}
              </div>
            </div>

            {/* 重点设备切换列表 */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-800 block">重点用能设备清单 (点击切换监控)</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {filteredEquipments.map((eq) => {
                  const isSelected = selectedEqId === eq.id
                  return (
                    <div
                      key={eq.id}
                      onClick={() => setSelectedEqId(eq.id)}
                      className={cn(
                        'p-3 rounded-xl border cursor-pointer transition-all space-y-1.5',
                        isSelected
                          ? 'border-[#1677ff] bg-blue-50/40 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      )}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <strong className="text-slate-900 truncate font-sans">{eq.name}</strong>
                        <span className="text-[10px] text-emerald-600 font-bold shrink-0">{eq.status}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
                        <span>{eq.company} · {eq.energyType === 'multi' ? '⚡电 + ♨️汽' : '⚡电力'}</span>
                        <span className="text-[#1677ff] font-bold">{eq.powerKW} kW</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 24 小时运行负荷走势 */}
            <div className="bg-white p-4 rounded-xl border border-[#e5e7eb] shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold text-slate-800">
                  【{selectedEq.name}】24 小时运行负荷与用能走势
                </h3>
                <span className="text-xs text-slate-400 font-mono">15分钟传感器实时采样</span>
              </div>
              <div className="h-[260px]">
                <LineTrend
                  data={eqTrendData}
                  xKey="time"
                  height={260}
                  lines={[
                    { key: '实时功率KW', name: '实时功率 (kW)', color: '#3b82f6' },
                    { key: '蒸汽流量T', name: '蒸汽流量 (t/h)', color: '#a855f7' },
                  ]}
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 板块 3: 关键工序监测 (按日更新离线分析，支持分表求和兜底) */}
        {/* ========================================================================= */}
        {activeTab === 'process' && (
          <div className="space-y-3.5">
            <div className="p-3.5 bg-purple-50/80 rounded-xl border border-purple-200 text-xs text-purple-900 leading-relaxed font-mono">
              <div className="font-bold flex items-center gap-1.5 text-purple-800 mb-1 font-sans">
                <Layers className="size-4 text-purple-600" />
                <span>关键工序监测说明 (日更新):</span>
              </div>
              工序监测按日更新，非高频实时数据。针对无法单独安表计量的主导工序，系统自动采用
              <strong className="underline">“旗下多设备分表求和”</strong> 计算兜底逻辑，确保无计量死角。
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-[#fafbfc]">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-purple-600" />
                  <h3 className="text-xs font-bold text-slate-800">
                    全集团重点关键工序日能耗统计与计量兜底台账
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">数据采集频率：按日更新 (每日 00:00)</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold font-sans">
                      <th className="py-2.5 px-3">归属公司</th>
                      <th className="py-2.5 px-3">关键工序名称</th>
                      <th className="py-2.5 px-3">计量模式与逻辑</th>
                      <th className="py-2.5 px-3 text-right">昨日用电量 (kWh)</th>
                      <th className="py-2.5 px-3 text-right">昨日用汽量 (t)</th>
                      <th className="py-2.5 px-3 text-right font-bold text-purple-700 bg-purple-50/40">
                        日折标能耗 (tce)
                      </th>
                      <th className="py-2.5 px-3 text-center">状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr className="hover:bg-purple-50/30">
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-900">沈变公司</td>
                      <td className="py-2.5 px-3 font-sans font-medium text-purple-700">真空干燥工段 (煤油气相)</td>
                      <td className="py-2.5 px-3 text-slate-500 font-sans">独立总表离线采样 (按日更新)</td>
                      <td className="py-2.5 px-3 text-right font-bold">58,400</td>
                      <td className="py-2.5 px-3 text-right font-bold text-purple-700">18.5</td>
                      <td className="py-2.5 px-3 text-right font-bold text-purple-700 bg-purple-50/30">10.2</td>
                      <td className="py-2.5 px-3 text-center font-sans text-emerald-600 font-bold">正常</td>
                    </tr>
                    <tr className="hover:bg-purple-50/30">
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-900">沈变公司</td>
                      <td className="py-2.5 px-3 font-sans font-medium text-purple-700">铁芯剪切与叠装工序</td>
                      <td className="py-2.5 px-3 text-slate-500 font-sans">分表求和兜底 (3台离线表汇总)</td>
                      <td className="py-2.5 px-3 text-right font-bold">12,450</td>
                      <td className="py-2.5 px-3 text-right text-slate-400">-</td>
                      <td className="py-2.5 px-3 text-right font-bold text-purple-700 bg-purple-50/30">1.53</td>
                      <td className="py-2.5 px-3 text-center font-sans text-emerald-600 font-bold">正常</td>
                    </tr>
                    <tr className="hover:bg-purple-50/30">
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-900">衡变公司</td>
                      <td className="py-2.5 px-3 font-sans font-medium text-purple-700">GIS 封闭组合电器工序</td>
                      <td className="py-2.5 px-3 text-slate-500 font-sans">分表求和兜底 (5台离线表汇总)</td>
                      <td className="py-2.5 px-3 text-right font-bold">41,200</td>
                      <td className="py-2.5 px-3 text-right font-bold text-purple-700">9.5</td>
                      <td className="py-2.5 px-3 text-right font-bold text-purple-700 bg-purple-50/30">6.81</td>
                      <td className="py-2.5 px-3 text-center font-sans text-emerald-600 font-bold">正常</td>
                    </tr>
                    <tr className="hover:bg-purple-50/30">
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-900">鲁缆公司</td>
                      <td className="py-2.5 px-3 font-sans font-medium text-purple-700">500kV 悬垂立塔共挤工段</td>
                      <td className="py-2.5 px-3 text-slate-500 font-sans">独立总表离线采样 (按日更新)</td>
                      <td className="py-2.5 px-3 text-right font-bold">82,400</td>
                      <td className="py-2.5 px-3 text-right font-bold text-purple-700">21.0</td>
                      <td className="py-2.5 px-3 text-right font-bold text-purple-700 bg-purple-50/30">14.12</td>
                      <td className="py-2.5 px-3 text-center font-sans text-emerald-600 font-bold">正常</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 手动录入绿电/绿证购买 Modal 弹窗 */}
      {showAddTradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-[#fafbfc]">
              <div className="flex items-center gap-2">
                <Plus className="size-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-800">
                  手动登记工厂绿电直供 / 绿证 (GEC) 购买台账
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddTradeModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleAddTrade} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">采购账期 (月份)</label>
                  <input
                    type="month"
                    value={newTrade.period}
                    onChange={(e) => setNewTrade({ ...newTrade, period: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 font-mono"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">归属工厂 / 项目公司</label>
                  <select
                    value={newTrade.company}
                    onChange={(e) => setNewTrade({ ...newTrade, company: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 font-bold"
                  >
                    <option value="沈变公司">沈变公司</option>
                    <option value="衡变公司">衡变公司</option>
                    <option value="新变厂">新变厂</option>
                    <option value="鲁缆公司">鲁缆公司</option>
                    <option value="新缆厂">新缆厂</option>
                    <option value="德缆公司">德缆公司</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block font-sans">直供绿电量 (kWh)</label>
                  <input
                    type="text"
                    value={newTrade.greenElecKWh}
                    onChange={(e) => setNewTrade({ ...newTrade, greenElecKWh: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 font-bold"
                    placeholder="如: 500,000"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block font-sans">购买绿证张数 (张)</label>
                  <input
                    type="number"
                    value={newTrade.greenCertificateCount}
                    onChange={(e) =>
                      setNewTrade({
                        ...newTrade,
                        greenCertificateCount: Number(e.target.value),
                        carbonOffsetTCO2: (Number(e.target.value) * 0.5703).toFixed(1),
                      })
                    }
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 font-bold"
                    placeholder="如: 500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1 font-mono">
                <label className="text-slate-700 font-bold block font-sans">国家电力交易凭证编号 / 绿证核销码</label>
                <input
                  type="text"
                  value={newTrade.voucherNo}
                  onChange={(e) => setNewTrade({ ...newTrade, voucherNo: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 font-bold"
                  required
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 leading-relaxed font-sans">
                💡 录入说明：针对新疆等仅采购国家绿证 (GEC) 的场景，系统自动按按系数 (0.5703 tCO2/张) 换算碳抵扣额度。
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTradeModal(false)}
                  className="px-4 py-1.5 rounded-lg bg-slate-100 text-slate-600 font-bold hover:bg-slate-200"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-xs"
                >
                  确认保存登记
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
