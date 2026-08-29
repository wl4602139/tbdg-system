'use client'

import React, { useState, useMemo } from 'react'
import {
  Sun,
  FileText,
  Download,
  Activity,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  Layers,
  Zap,
  ArrowUpRight,
  TrendingUp,
  X,
  Building2,
  Coins,
  DollarSign,
  Info,
  Check,
  Trees,
  MapPin,
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { LineTrend } from '@/components/shared/charts'
import { cn } from '@/lib/utils'

// 园区新能源与绿电交易数据字典
interface GreenParkInfo {
  id: string
  name: string
  parkName: string
  location: string
  feedInTariff: string // 上网电价 (各地差异大，如天津 0.30元, 山西 0.45元, 辽宁 0.375元, 新疆 0.25元)
  industrialPrice: string // 工商业电价
  pvCapacity: string
  pvGenerationKWh: string // 新能源月发电量
  selfUseKWh: string // 自用电量
  gridExportKWh: string // 上网电量
  selfUseSavings: string // 自用省钱收益
  gridExportRevenue: string // 上网创收收益
  totalRevenue: string // 综合总收益
  purchasedGreenElec: string // 月度购买绿电量
  gecCertificateCount: number // 月度购买绿证张数
}

const GREEN_PARK_DATA: Record<string, GreenParkInfo> = {
  park_root: {
    id: 'park_root',
    name: '电装集团',
    parkName: '特变电工 17 大零碳产业园区',
    location: '全国 17 个产业基地',
    feedInTariff: '0.250 ~ 0.450 元/kWh (各省基准上网价)',
    industrialPrice: '0.620 元/kWh (平均)',
    pvCapacity: '48.5 MWp',
    pvGenerationKWh: '1,280.5 万kWh',
    selfUseKWh: '1,020.2 万kWh',
    gridExportKWh: '260.3 万kWh',
    selfUseSavings: '¥632.6 万元/月',
    gridExportRevenue: '¥88.2 万元/月',
    totalRevenue: '¥720.8 万元/月',
    purchasedGreenElec: '380.5 万kWh',
    gecCertificateCount: 85000,
  },
  park_01: {
    id: 'park_01',
    name: '特变电工东北输变电产业园',
    parkName: '特变电工东北输变电产业园 (沈阳)',
    location: '沈阳市',
    feedInTariff: '0.375 元/kWh (辽宁脱硫燃气基准价)',
    industrialPrice: '0.680 元/kWh',
    pvCapacity: '5.8 MWp',
    pvGenerationKWh: '182.6 万kWh',
    selfUseKWh: '148.2 万kWh',
    gridExportKWh: '34.4 万kWh',
    selfUseSavings: '¥100.8 万元/月',
    gridExportRevenue: '¥12.9 万元/月',
    totalRevenue: '¥113.7 万元/月',
    purchasedGreenElec: '80.1 万kWh',
    gecCertificateCount: 18000,
  },
  park_02: {
    id: 'park_02',
    name: '特变电工南方输变电产业园',
    parkName: '特变电工南方输变电产业园 (衡阳)',
    location: '衡阳市',
    feedInTariff: '0.450 元/kWh (湖南标杆价)',
    industrialPrice: '0.720 元/kWh',
    pvCapacity: '4.2 MWp',
    pvGenerationKWh: '142.0 万kWh',
    selfUseKWh: '118.0 万kWh',
    gridExportKWh: '24.0 万kWh',
    selfUseSavings: '¥85.0 万元/月',
    gridExportRevenue: '¥10.8 万元/月',
    totalRevenue: '¥95.8 万元/月',
    purchasedGreenElec: '65.0 万kWh',
    gecCertificateCount: 12000,
  },
  park_03: {
    id: 'park_03',
    name: '特变电工二次产业园区',
    parkName: '特变电工二次产业园区 (南京)',
    location: '南京市',
    feedInTariff: '0.391 元/kWh',
    industrialPrice: '0.690 元/kWh',
    pvCapacity: '1.5 MWp',
    pvGenerationKWh: '52.0 万kWh',
    selfUseKWh: '44.0 万kWh',
    gridExportKWh: '8.0 万kWh',
    selfUseSavings: '¥30.4 万元/月',
    gridExportRevenue: '¥3.1 万元/月',
    totalRevenue: '¥33.5 万元/月',
    purchasedGreenElec: '20.0 万kWh',
    gecCertificateCount: 3000,
  },
  park_04: {
    id: 'park_04',
    name: '特变电工云集5G科技产业园',
    parkName: '特变电工云集5G科技产业园',
    location: '衡阳市',
    feedInTariff: '0.450 元/kWh',
    industrialPrice: '0.720 元/kWh',
    pvCapacity: '1.8 MWp',
    pvGenerationKWh: '62.0 万kWh',
    selfUseKWh: '50.0 万kWh',
    gridExportKWh: '12.0 万kWh',
    selfUseSavings: '¥36.0 万元/月',
    gridExportRevenue: '¥5.4 万元/月',
    totalRevenue: '¥41.4 万元/月',
    purchasedGreenElec: '25.0 万kWh',
    gecCertificateCount: 4000,
  },
  park_05: {
    id: 'park_05',
    name: '特变电工智能电气产业园',
    parkName: '特变电工智能电气产业园 (自控)',
    location: '昌吉市',
    feedInTariff: '0.250 元/kWh',
    industrialPrice: '0.420 元/kWh',
    pvCapacity: '1.5 MWp',
    pvGenerationKWh: '50.0 万kWh',
    selfUseKWh: '42.0 万kWh',
    gridExportKWh: '8.0 万kWh',
    selfUseSavings: '¥17.6 万元/月',
    gridExportRevenue: '¥2.0 万元/月',
    totalRevenue: '¥19.6 万元/月',
    purchasedGreenElec: '10.0 万kWh',
    gecCertificateCount: 2000,
  },
  park_06: {
    id: 'park_06',
    name: '特变电工湖南能源建设园区',
    parkName: '特变电工湖南能源建设园区',
    location: '衡阳市',
    feedInTariff: '0.450 元/kWh',
    industrialPrice: '0.720 元/kWh',
    pvCapacity: '1.4 MWp',
    pvGenerationKWh: '48.0 万kWh',
    selfUseKWh: '40.0 万kWh',
    gridExportKWh: '8.0 万kWh',
    selfUseSavings: '¥28.8 万元/月',
    gridExportRevenue: '¥3.6 万元/月',
    totalRevenue: '¥32.4 万元/月',
    purchasedGreenElec: '12.0 万kWh',
    gecCertificateCount: 2500,
  },
  park_07: {
    id: 'park_07',
    name: '特变电工西安智能装备产业园',
    parkName: '特变电工西安智能装备产业园',
    location: '西安市',
    feedInTariff: '0.354 元/kWh',
    industrialPrice: '0.660 元/kWh',
    pvCapacity: '2.1 MWp',
    pvGenerationKWh: '74.0 万kWh',
    selfUseKWh: '62.0 万kWh',
    gridExportKWh: '12.0 万kWh',
    selfUseSavings: '¥40.9 万元/月',
    gridExportRevenue: '¥4.2 万元/月',
    totalRevenue: '¥45.1 万元/月',
    purchasedGreenElec: '30.0 万kWh',
    gecCertificateCount: 5000,
  },
  park_08: {
    id: 'park_08',
    name: '特变电工GIL产业园',
    parkName: '特变电工GIL产业园',
    location: '湖南省',
    feedInTariff: '0.450 元/kWh',
    industrialPrice: '0.720 元/kWh',
    pvCapacity: '1.5 MWp',
    pvGenerationKWh: '52.0 万kWh',
    selfUseKWh: '42.0 万kWh',
    gridExportKWh: '10.0 万kWh',
    selfUseSavings: '¥30.2 万元/月',
    gridExportRevenue: '¥4.5 万元/月',
    totalRevenue: '¥34.7 万元/月',
    purchasedGreenElec: '20.0 万kWh',
    gecCertificateCount: 3500,
  },
  park_09: {
    id: 'park_09',
    name: '特变电工输变电产业园',
    parkName: '特变电工输变电产业园 (超高压变压器)',
    location: '昌吉回族自治州',
    feedInTariff: '0.250 元/kWh (新疆平价)',
    industrialPrice: '0.420 元/kWh',
    pvCapacity: '8.5 MWp',
    pvGenerationKWh: '285.0 万kWh',
    selfUseKWh: '240.0 万kWh',
    gridExportKWh: '45.0 万kWh',
    selfUseSavings: '¥100.8 万元/月',
    gridExportRevenue: '¥11.3 万元/月',
    totalRevenue: '¥112.1 万元/月',
    purchasedGreenElec: '0.0 万kWh',
    gecCertificateCount: 25000,
  },
  park_10: {
    id: 'park_10',
    name: '特变电工天变产业园',
    parkName: '特变电工天变产业园 (天津)',
    location: '天津市',
    feedInTariff: '0.365 元/kWh',
    industrialPrice: '0.680 元/kWh',
    pvCapacity: '2.8 MWp',
    pvGenerationKWh: '96.0 万kWh',
    selfUseKWh: '80.0 万kWh',
    gridExportKWh: '16.0 万kWh',
    selfUseSavings: '¥54.4 万元/月',
    gridExportRevenue: '¥5.8 万元/月',
    totalRevenue: '¥60.2 万元/月',
    purchasedGreenElec: '40.0 万kWh',
    gecCertificateCount: 7000,
  },
  park_11: {
    id: 'park_11',
    name: '特变电工智能电气产业园',
    parkName: '特变电工智能电气产业园 (配电智能)',
    location: '昌吉市',
    feedInTariff: '0.250 元/kWh',
    industrialPrice: '0.420 元/kWh',
    pvCapacity: '1.75 MWp',
    pvGenerationKWh: '60.0 万kWh',
    selfUseKWh: '50.0 万kWh',
    gridExportKWh: '10.0 万kWh',
    selfUseSavings: '¥21.0 万元/月',
    gridExportRevenue: '¥2.5 万元/月',
    totalRevenue: '¥23.5 万元/月',
    purchasedGreenElec: '15.0 万kWh',
    gecCertificateCount: 3000,
  },
  park_12: {
    id: 'park_12',
    name: '特变电工京津冀智能科技产业园',
    parkName: '特变电工京津冀智能科技产业园',
    location: '河北省',
    feedInTariff: '0.364 元/kWh',
    industrialPrice: '0.670 元/kWh',
    pvCapacity: '1.9 MWp',
    pvGenerationKWh: '65.0 万kWh',
    selfUseKWh: '54.0 万kWh',
    gridExportKWh: '11.0 万kWh',
    selfUseSavings: '¥36.2 万元/月',
    gridExportRevenue: '¥4.0 万元/月',
    totalRevenue: '¥40.2 万元/月',
    purchasedGreenElec: '25.0 万kWh',
    gecCertificateCount: 4000,
  },
  park_13: {
    id: 'park_13',
    name: '特变电工华东输变电科技产业园',
    parkName: '特变电工华东输变电科技产业园 (新泰)',
    location: '新泰市',
    feedInTariff: '0.395 元/kWh (山东标杆价)',
    industrialPrice: '0.700 元/kWh',
    pvCapacity: '3.8 MWp',
    pvGenerationKWh: '128.0 万kWh',
    selfUseKWh: '105.0 万kWh',
    gridExportKWh: '23.0 万kWh',
    selfUseSavings: '¥73.5 万元/月',
    gridExportRevenue: '¥9.1 万元/月',
    totalRevenue: '¥82.6 万元/月',
    purchasedGreenElec: '50.0 万kWh',
    gecCertificateCount: 10000,
  },
  park_14: {
    id: 'park_14',
    name: '特变电工曙光电缆产业园',
    parkName: '特变电工曙光电缆产业园 (新泰)',
    location: '山东省',
    feedInTariff: '0.395 元/kWh',
    industrialPrice: '0.700 元/kWh',
    pvCapacity: '1.65 MWp',
    pvGenerationKWh: '58.0 万kWh',
    selfUseKWh: '48.0 万kWh',
    gridExportKWh: '10.0 万kWh',
    selfUseSavings: '¥33.6 万元/月',
    gridExportRevenue: '¥4.0 万元/月',
    totalRevenue: '¥37.6 万元/月',
    purchasedGreenElec: '22.0 万kWh',
    gecCertificateCount: 3800,
  },
  park_15: {
    id: 'park_15',
    name: '特变电工新疆电缆产业园',
    parkName: '特变电工新疆电缆产业园 (乌鲁木齐)',
    location: '乌鲁木齐市',
    feedInTariff: '0.250 元/kWh',
    industrialPrice: '0.420 元/kWh',
    pvCapacity: '2.0 MWp',
    pvGenerationKWh: '68.0 万kWh',
    selfUseKWh: '56.0 万kWh',
    gridExportKWh: '12.0 万kWh',
    selfUseSavings: '¥23.5 万元/月',
    gridExportRevenue: '¥3.0 万元/月',
    totalRevenue: '¥26.5 万元/月',
    purchasedGreenElec: '20.0 万kWh',
    gecCertificateCount: 3500,
  },
  park_16: {
    id: 'park_16',
    name: '特变电工输变电产业园',
    parkName: '特变电工输变电产业园 (线缆车间)',
    location: '昌吉回族自治州',
    feedInTariff: '0.250 元/kWh',
    industrialPrice: '0.420 元/kWh',
    pvCapacity: '1.8 MWp',
    pvGenerationKWh: '62.0 万kWh',
    selfUseKWh: '50.0 万kWh',
    gridExportKWh: '12.0 万kWh',
    selfUseSavings: '¥21.0 万元/月',
    gridExportRevenue: '¥3.0 万元/月',
    totalRevenue: '¥24.0 万元/月',
    purchasedGreenElec: '15.0 万kWh',
    gecCertificateCount: 2500,
  },
  park_17: {
    id: 'park_17',
    name: '特变电工(德阳)电缆园区',
    parkName: '特变电工(德阳)电缆园区',
    location: '德阳市',
    feedInTariff: '0.380 元/kWh',
    industrialPrice: '0.640 元/kWh',
    pvCapacity: '2.4 MWp',
    pvGenerationKWh: '82.0 万kWh',
    selfUseKWh: '68.0 万kWh',
    gridExportKWh: '14.0 万kWh',
    selfUseSavings: '¥43.5 万元/月',
    gridExportRevenue: '¥5.3 万元/月',
    totalRevenue: '¥48.8 万元/月',
    purchasedGreenElec: '35.0 万kWh',
    gecCertificateCount: 6000,
  },
}

// 绿电与绿证月度交易明细台账
interface GreenRecord {
  id: string
  no: string
  type: '市场化绿电 (江苏交易中心)' | '中国绿证 (GEC)' | '自建新能源 (光伏)'
  company: string
  amount: string
  price: string
  status: '已核销' | '已消纳结算' | '交易履约中'
  carbonOffset: number // 减碳量 tCO2
  month: string
}

const GREEN_RECORDS: GreenRecord[] = [
  {
    id: 'rec-01',
    no: 'GEC-2026-LN-008921',
    type: '中国绿证 (GEC)',
    company: '东北输变电产业园 (沈阳)',
    amount: '18,000 张 (180万kWh)',
    price: '18.5 元/张',
    status: '已核销',
    carbonOffset: 1026.54,
    month: '2026-08',
  },
  {
    id: 'rec-02',
    no: 'PV-SB-202608-01',
    type: '自建新能源 (光伏)',
    company: '东北输变电产业园 (沈阳)',
    amount: '182.6 万kWh',
    price: '0.268 元/kWh (折合)',
    status: '已消纳结算',
    carbonOffset: 1041.36,
    month: '2026-08',
  },
  {
    id: 'rec-03',
    no: 'PWR-TRD-2026-08-091',
    type: '市场化绿电 (江苏交易中心)',
    company: '东北输变电产业园 (沈阳)',
    amount: '80.1 万kWh',
    price: '0.415 元/kWh',
    status: '交易履约中',
    carbonOffset: 456.81,
    month: '2026-08',
  },
  {
    id: 'rec-04',
    no: 'GEC-2026-HN-004312',
    type: '中国绿证 (GEC)',
    company: '南方输变电产业园 (衡阳)',
    amount: '12,000 张 (120万kWh)',
    price: '19.0 元/张',
    status: '已核销',
    carbonOffset: 684.36,
    month: '2026-08',
  },
  {
    id: 'rec-05',
    no: 'PV-HB-202608-01',
    type: '自建新能源 (光伏)',
    company: '南方输变电产业园 (衡阳)',
    amount: '142.0 万kWh',
    price: '0.275 元/kWh (折合)',
    status: '已消纳结算',
    carbonOffset: 809.82,
    month: '2026-08',
  },
  {
    id: 'rec-06',
    no: 'GEC-2026-XJ-011029',
    type: '中国绿证 (GEC)',
    company: '输变电产业园 (新疆/昌吉)',
    amount: '25,000 张 (250万kWh)',
    price: '16.8 元/张',
    status: '已核销',
    carbonOffset: 1425.75,
    month: '2026-08',
  },
]

export default function ZeroCarbonGreenMonitorPage() {
  // 当前选中的园区节点 (默认为东北输变电产业园)
  const [selectedNode, setSelectedNode] = useState<StandardOrgNode>({
    id: 'park_01',
    name: '东北输变电产业园',
    level: 'park',
    badge: '沈阳',
  })

  // 按月颗粒度统计账期
  const [selectedMonth, setSelectedMonth] = useState('2026-08')
  const [filterType, setFilterType] = useState('all')
  const [showModal, setShowModal] = useState(false)

  // 绿度购买/录入表单
  const [formData, setFormData] = useState({
    no: `GEC-2026-${Date.now().toString().slice(-6)}`,
    type: '中国绿证 (GEC)',
    company: '东北输变电产业园 (沈阳)',
    amount: '10,000 张',
    price: '18.0 元/张',
    month: '2026-08',
  })

  const [records, setRecords] = useState<GreenRecord[]>(GREEN_RECORDS)

  // 获取当前选择的产业园区绿电数据 (支持 1 级全域、2 级园区、3 级车间工段向上匹配与全局兜底)
  const currentParkInfo = useMemo(() => {
    const pId = selectedNode.id
    // 1. 精准匹配
    if (GREEN_PARK_DATA[pId]) return GREEN_PARK_DATA[pId]
    
    // 2. 如果是 3 级车间/工段子节点 (如 park_01_main, park_02_gc 等)，按前缀自动向上匹配至所属 2 级园区
    const matchedKey = Object.keys(GREEN_PARK_DATA).find((key) => key !== 'park_root' && pId.startsWith(key))
    if (matchedKey && GREEN_PARK_DATA[matchedKey]) {
      return GREEN_PARK_DATA[matchedKey]
    }
    
    // 3. 全局安全兜底
    return GREEN_PARK_DATA['park_01'] || GREEN_PARK_DATA['park_root']
  }, [selectedNode.id])

  // 新能源消纳与超发上网 24 小时曲线 (合并展示消纳与上网)
  const pvOutputTrendData = [
    { time: '00:00', 新能源出力: 0, 厂区自用电量: 0, 超发上网电量: 0 },
    { time: '04:00', 新能源出力: 0, 厂区自用电量: 0, 超发上网电量: 0 },
    { time: '08:00', 新能源出力: 2100, 厂区自用电量: 2100, 超发上网电量: 0 },
    { time: '11:00', 新能源出力: 4500, 厂区自用电量: 3800, 超发上网电量: 700 },
    { time: '13:00', 新能源出力: 4850, 厂区自用电量: 3600, 超发上网电量: 1250 },
    { time: '15:00', 新能源出力: 4100, 厂区自用电量: 3800, 超发上网电量: 300 },
    { time: '18:00', 新能源出力: 350, 厂区自用电量: 350, 超发上网电量: 0 },
    { time: '22:00', 新能源出力: 0, 厂区自用电量: 0, 超发上网电量: 0 },
  ]

  // 提交绿证购买录入
  const handleAddTrade = (e: React.FormEvent) => {
    e.preventDefault()
    const newRec: GreenRecord = {
      id: `rec-${Date.now()}`,
      no: formData.no,
      type: formData.type as any,
      company: formData.company,
      amount: formData.amount,
      price: formData.price,
      status: '已核销',
      carbonOffset: 570.3,
      month: formData.month,
    }
    setRecords([newRec, ...records])
    setShowModal(false)
    alert(`✅ 已经成功录入【${formData.company}】在 ${formData.month} 账期的绿证购买凭单，数据已归集至园区！`)
  }

  return (
    <div className="flex w-full items-start gap-3.5">
      {/* 🌟 左侧 270px 经典工业级拓扑树 (园区结构) */}
      <StandardOrgTree
        treeType="park"
        selectedId={selectedNode.id}
        onSelect={(node) => setSelectedNode(node)}
      />

      {/* 🌟 右侧主面板 */}
      <div className="flex-1 min-w-0 space-y-3.5">
        
        {/* 1. 顶部 Header 与 务实定位说明 */}
        <div className="bg-white p-3.5 rounded-xl border border-[#e5e7eb] shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
              <Trees className="size-5" />
            </div>
            <h1 className="text-base font-bold text-slate-800">绿电监测</h1>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs font-mono bg-slate-50 p-1 rounded-lg border border-slate-200">
              <Calendar className="size-3.5 text-slate-500" />
              <span className="text-slate-600">月度核算账期:</span>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-white border border-slate-300 rounded px-2 py-0.5 text-slate-800 font-bold"
              />
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>录入绿证/交易凭证</span>
            </button>
          </div>
        </div>

        {/* 2. 核心 KPI 看板 (包含新能源月发电量、自用省钱收益、超发上网收益、绿电/绿证来源与折合月度总收益) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* 卡片 1: 新能源月度发电量 (装机容量 + 自用/上网拆解) */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                <Sun className="size-3.5 text-amber-500" />
                新能源月度发电
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono font-semibold">
                装机 {currentParkInfo.pvCapacity}
              </span>
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold font-mono text-slate-900 tracking-tight">
                {currentParkInfo.pvGenerationKWh.split(' ')[0]} <span className="text-xs text-slate-500 font-sans">万kWh</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mt-1 pt-1.5 border-t border-slate-100">
                <span>自用: <strong className="text-emerald-700">{currentParkInfo.selfUseKWh}</strong></span>
                <span>上网: <strong className="text-blue-700">{currentParkInfo.gridExportKWh}</strong></span>
              </div>
            </div>
          </div>

          {/* 卡片 2: 自用省钱收益 (按工商业电价折合节省电费) */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                <Coins className="size-3.5 text-emerald-500" />
                自用省钱收益
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-mono font-semibold">
                折合电价核算
              </span>
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold font-mono text-emerald-600 tracking-tight">
                {currentParkInfo.selfUseSavings.split(' ')[0]} <span className="text-xs text-slate-500 font-sans">万元/月</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mt-1 pt-1.5 border-t border-slate-100">
                <span>电价核算: {currentParkInfo.industrialPrice}</span>
                <span className="text-emerald-600 font-semibold">直接省电费</span>
              </div>
            </div>
          </div>

          {/* 卡片 3: 超发上网收益 (全额上网或余电上网由电网结算) */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                <TrendingUp className="size-3.5 text-blue-500" />
                超发上网收益
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono font-semibold">
                余电上网
              </span>
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold font-mono text-blue-600 tracking-tight">
                {currentParkInfo.gridExportRevenue.split(' ')[0]} <span className="text-xs text-slate-500 font-sans">万元/月</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mt-1 pt-1.5 border-t border-slate-100">
                <span>上网价: {currentParkInfo.feedInTariff.split(' ')[0]}</span>
                <span className="text-blue-600 font-semibold">电网结算</span>
              </div>
            </div>
          </div>

          {/* 卡片 4: 月度绿电/绿证来源 (按月统计交易凭单) */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                <FileText className="size-3.5 text-purple-500" />
                月度绿电/绿证来源
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-mono font-semibold">
                按月按厂录入
              </span>
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold font-mono text-purple-600 tracking-tight">
                {currentParkInfo.gecCertificateCount.toLocaleString()} <span className="text-xs text-slate-500 font-sans">张绿证</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mt-1 pt-1.5 border-t border-slate-100">
                <span>交易绿电: {currentParkInfo.purchasedGreenElec}</span>
                <span className="text-purple-600 font-semibold">园区汇总</span>
              </div>
            </div>
          </div>

          {/* 卡片 5: 新能源月度总收益 (领导重点关注的一眼看懂指标) */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                <DollarSign className="size-3.5 text-amber-600" />
                新能源月度总收益
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-mono font-semibold">
                省费+创收
              </span>
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold font-mono text-amber-600 tracking-tight">
                {currentParkInfo.totalRevenue.split(' ')[0]} <span className="text-xs text-slate-500 font-sans">万元/月</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mt-1 pt-1.5 border-t border-slate-100">
                <span>领导关注: 一眼看懂省钱</span>
                <span className="text-amber-700 font-bold font-sans">折合总效益</span>
              </div>
            </div>
          </div>

        </div>

        {/* 3. 绿电来源构成 + 24 小时消纳与超发上网曲线 (务实合并图表) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-xs font-bold text-slate-800">
                【{currentParkInfo.name}】绿电来源构成与 24 小时消纳曲线分析 (功率/kW)
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">
                各地上网电价: {currentParkInfo.feedInTariff}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-sans">
              <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                <span className="size-2.5 rounded-full bg-emerald-500" />
                新能源总出力
              </span>
              <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <span className="size-2.5 rounded-full bg-slate-800" />
                厂区自用消纳
              </span>
              <span className="flex items-center gap-1.5 text-blue-600 font-semibold">
                <span className="size-2.5 rounded-full bg-blue-500" />
                超发上网电量 (基准线上)
              </span>
            </div>
          </div>

          {/* 来源构成 3 大卡片 (自建光伏 50%、交易绿电 28%、中国绿证 14%) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/40 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-800 flex items-center gap-1">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  1. 自建分布式光伏 (50%)
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 font-bold">
                  自发自用
                </span>
              </div>
              <p className="text-[11px] text-slate-500">厂区屋顶 {currentParkInfo.pvCapacity} 分布式光伏，直接注入配电网络</p>
              <div className="flex justify-between items-center text-xs pt-1 font-mono">
                <span className="text-slate-600">本日日光: 7.3 万kWh</span>
                <span className="text-emerald-700 font-bold">本月累计: {currentParkInfo.pvGenerationKWh}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg border border-blue-200 bg-blue-50/40 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-blue-800 flex items-center gap-1">
                  <span className="size-2 rounded-full bg-blue-500" />
                  2. 市场化交易绿电 (28%)
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 font-bold">
                  跨省交易
                </span>
              </div>
              <p className="text-[11px] text-slate-500">通过电力交易中心购入陆上风电与三峡水电，具备溯源凭证</p>
              <div className="flex justify-between items-center text-xs pt-1 font-mono">
                <span className="text-slate-600">本日结算: 3.5 万kWh</span>
                <span className="text-blue-700 font-bold">本月累计: {currentParkInfo.purchasedGreenElec}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg border border-purple-200 bg-purple-50/40 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-purple-800 flex items-center gap-1">
                  <span className="size-2 rounded-full bg-purple-500" />
                  3. 中国绿证 (GEC) 核销 (14%)
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 font-bold">
                  核发核销
                </span>
              </div>
              <p className="text-[11px] text-slate-500">国家能源局统一核发中国绿色电力证书，1张GEC等效1000kWh</p>
              <div className="flex justify-between items-center text-xs pt-1 font-mono">
                <span className="text-slate-600">本日核销: 1.8 万张</span>
                <span className="text-purple-700 font-bold">本月累计: {currentParkInfo.gecCertificateCount.toLocaleString()} 万张</span>
              </div>
            </div>
          </div>

          {/* 24小时消纳曲线图表 */}
          <div className="h-[260px] w-full pt-2">
            <LineTrend
              data={pvOutputTrendData}
              xKey="time"
              lines={[
                { key: '厂区自用电量', color: '#1e293b', name: '厂区自用消纳 (kW)' },
                { key: '新能源出力', color: '#10b981', name: '新能源总出力 (kW)' },
                { key: '超发上网电量', color: '#3b82f6', name: '超发上网电量 (kW)' },
              ]}
            />
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between font-mono">
            <span>差异化上网电价说明：</span>
            <span>各地上网电价存在区域差异（天津 0.30元/kWh · 山西 0.45元/kWh · 辽宁 0.375元/kWh · 新疆 0.25元/kWh）</span>
          </div>
        </div>

        {/* 4. 绿电与绿证交易明细台账 (按月归集、支持按园区汇总) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-emerald-600" />
              <h2 className="text-xs font-bold text-slate-800">
                【上/下月度绿电与绿证 (GEC) 购买交易台账 (园区统管汇总)】
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">
                涵盖所属园区交易核定结果
              </span>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700"
              >
                <option value="all">全部交易类型</option>
                <option value="gec">中国绿证 (GEC)</option>
                <option value="grid">自建新能源 (光伏)</option>
                <option value="trade">市场化绿电</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold font-sans">
                  <th className="py-2.5 px-3">凭证 / 交易编号</th>
                  <th className="py-2.5 px-3">交易类型</th>
                  <th className="py-2.5 px-3">归属 / 声明主体</th>
                  <th className="py-2.5 px-3">交易数量 / 电量</th>
                  <th className="py-2.5 px-3">结算单价</th>
                  <th className="py-2.5 px-3">状态</th>
                  <th className="py-2.5 px-3">抵扣碳排 (tCO2)</th>
                  <th className="py-2.5 px-3">核算月份</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-900">{rec.no}</td>
                    <td className="py-2.5 px-3">
                      <span className={cn(
                        'px-2 py-0.5 rounded text-[10.5px] font-sans font-bold',
                        rec.type.includes('绿证') && 'bg-purple-50 text-purple-700 border border-purple-200',
                        rec.type.includes('光伏') && 'bg-emerald-50 text-emerald-700 border border-emerald-200',
                        rec.type.includes('市场化') && 'bg-blue-50 text-blue-700 border border-blue-200'
                      )}>
                        {rec.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-800">{rec.company}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{rec.amount}</td>
                    <td className="py-2.5 px-3 text-slate-600">{rec.price}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10.5px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-sans font-bold">
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-emerald-600">-{rec.carbonOffset.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono">{rec.month}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* 🌟 录入绿证/交易凭证 模态弹窗 */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-800">录入月度绿电 / 绿证凭证</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="size-4" />
              </button>
            </div>
            <form onSubmit={handleAddTrade} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">交易编号 / 绿证编号</label>
                <input
                  type="text"
                  value={formData.no}
                  onChange={(e) => setFormData({ ...formData, no: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-slate-800 font-mono"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">交易类型</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-slate-800 font-sans"
                  >
                    <option value="中国绿证 (GEC)">中国绿证 (GEC)</option>
                    <option value="市场化绿电 (江苏交易中心)">市场化绿电 (交易中心)</option>
                    <option value="自建新能源 (光伏)">自建新能源 (光伏)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">归属产业园区</label>
                  <select
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-slate-800 font-sans"
                  >
                    <option value="东北输变电产业园 (沈阳)">东北输变电产业园 (沈阳)</option>
                    <option value="南方输变电产业园 (衡阳)">南方输变电产业园 (衡阳)</option>
                    <option value="输变电产业园 (新疆/昌吉)">输变电产业园 (新疆/昌吉)</option>
                    <option value="华东输变电产业园 (新泰)">华东输变电产业园 (新泰)</option>
                    <option value="德阳电缆产业园区 (四川)">德阳电缆产业园区 (四川)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">交易数量 / 绿证张数</label>
                  <input
                    type="text"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-slate-800 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">结算单价</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-slate-800 font-mono"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-600 font-bold mb-1">核算月份</label>
                <input
                  type="month"
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-slate-800 font-mono"
                  required
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  确认保存凭单
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
