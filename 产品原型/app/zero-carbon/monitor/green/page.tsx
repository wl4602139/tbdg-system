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
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { LineTrend } from '@/components/shared/charts'
import { cn } from '@/lib/utils'

// 园区新能源与绿电交易数据
interface GreenParkInfo {
  id: string
  name: string
  company: string
  feedInTariff: string // 上网电价 (各地差异大，如天津 0.30元, 山西 0.45元, 辽宁 0.375元)
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
  comp_shenbian: {
    id: 'comp_shenbian',
    name: '特变电工东北输变电产业园 (沈变)',
    company: '沈变公司',
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
  comp_hengbian: {
    id: 'comp_hengbian',
    name: '特变电工南方输变电产业园 (衡变)',
    company: '衡变公司',
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
  comp_xinbian: {
    id: 'comp_xinbian',
    name: '特变电工输变电科技产业园 (新变厂)',
    company: '新变厂',
    feedInTariff: '0.250 元/kWh (新疆平价)',
    industrialPrice: '0.420 元/kWh',
    pvCapacity: '8.5 MWp',
    pvGenerationKWh: '285.0 万kWh',
    selfUseKWh: '240.0 万kWh',
    gridExportKWh: '45.0 万kWh',
    selfUseSavings: '¥100.8 万元/月',
    gridExportRevenue: '¥11.3 万元/月',
    totalRevenue: '¥112.1 万元/月',
    purchasedGreenElec: '0.0 万kWh (未买外部绿电，仅买绿证)',
    gecCertificateCount: 25000,
  },
}

// 绿电与绿证月度交易明细台账
interface GreenRecord {
  id: string
  no: string
  type: '自建新能源 (光伏)' | '市场化绿电交易' | '中国绿证 (GEC)'
  company: string
  amount: string
  price: string
  status: '已核销' | '已消纳结算'
  carbonOffset: number
  month: string
}

const GREEN_RECORDS: GreenRecord[] = [
  { id: 'rec-01', no: 'GEC-2026-LN-008921', type: '中国绿证 (GEC)', company: '沈变公司', amount: '18,000 张 (180万kWh)', price: '18.5 元/张', status: '已核销', carbonOffset: 1026.54, month: '2026-08' },
  { id: 'rec-02', no: 'PV-SB-202608-01', type: '自建新能源 (光伏)', company: '沈变公司', amount: '182.6 万kWh', price: '0.268 元/kWh (折合)', status: '已消纳结算', carbonOffset: 1041.36, month: '2026-08' },
  { id: 'rec-03', no: 'TRD-2026-LN-WIND08', type: '市场化绿电交易', company: '沈变公司', amount: '80.1 万kWh', price: '0.415 元/kWh', status: '已消纳结算', carbonOffset: 456.81, month: '2026-08' },
  { id: 'rec-04', no: 'PV-HB-202608-02', type: '自建新能源 (光伏)', company: '衡变公司', amount: '142.0 万kWh', price: '0.272 元/kWh (折合)', status: '已消纳结算', carbonOffset: 809.82, month: '2026-08' },
  { id: 'rec-05', no: 'GEC-2026-XJ-004128', type: '中国绿证 (GEC)', company: '新变厂', amount: '25,000 张 (250万kWh)', price: '16.8 元/张', status: '已核销', carbonOffset: 1425.75, month: '2026-08' },
]

export default function GreenPowerMonitoringPage() {
  const [selectedNode, setSelectedNode] = useState<StandardOrgNode>({
    id: 'comp_shenbian',
    name: '沈变公司',
    level: 'company',
    badge: '变压器',
  })

  // 按月颗粒度统计账期
  const [selectedMonth, setSelectedMonth] = useState('2026-08')
  const [filterType, setFilterType] = useState('all')
  const [showModal, setShowModal] = useState(false)

  // 绿度购买/录入表单
  const [formData, setFormData] = useState({
    no: `GEC-2026-${Date.now().toString().slice(-6)}`,
    type: '中国绿证 (GEC)',
    company: '沈变公司',
    amount: '10,000 张',
    price: '18.0 元/张',
    month: '2026-08',
  })

  const [records, setRecords] = useState<GreenRecord[]>(GREEN_RECORDS)

  // 获取当前选择的项目公司/园区绿电数据
  const currentParkInfo = useMemo(() => {
    return GREEN_PARK_DATA[selectedNode.id] || GREEN_PARK_DATA['comp_shenbian']
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
      {/* 🌟 左侧 270px 经典工业级拓扑树 (黏性固定) */}
      <StandardOrgTree
        selectedId={selectedNode.id}
        onSelect={(node) => setSelectedNode(node)}
      />

      {/* 🌟 右侧主面板 */}
      <div className="flex-1 min-w-0 space-y-3.5">
        
        {/* 1. 顶部 Header 与 务实定位说明 */}
        <div className="bg-white p-3.5 rounded-xl border border-[#e5e7eb] shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
              <Sun className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-slate-800">绿电监测看板 · 交易、溯源与收益</h1>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold">
                  按月统计交易 · 园区打包归集
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-mono">
                当前主体：【<span className="font-bold text-emerald-700 font-sans">{currentParkInfo.name}</span>】 · 
                各地上网电价标注：<strong className="text-blue-700 font-sans">{currentParkInfo.feedInTariff}</strong>
              </p>
            </div>
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
              type="button"
              onClick={() => setShowModal(true)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Plus className="size-4" />
              <span>+ 登记绿电/绿证购买</span>
            </button>

            <button
              type="button"
              onClick={() => alert(`正在导出【${currentParkInfo.name}】${selectedMonth} 绿电收益与绿证核销分析报告 (Excel)...`)}
              className="px-3 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer transition-all"
            >
              <Download className="size-3.5" />
              <span>导出收益分析表</span>
            </button>
          </div>
        </div>

        {/* 2. 核心双碳能效与收益 Bento 卡片 (领导重点关注：省钱金额 + 实际使用 vs 月度购买) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono">
          
          {/* 卡片 1: 新能源月度总发电量 */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1 hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-600 font-sans">
              <span className="font-bold text-emerald-800 flex items-center gap-1">
                <Sun className="size-3.5 text-emerald-600" />
                新能源月度发电
              </span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                装机 {currentParkInfo.pvCapacity}
              </span>
            </div>
            <div className="text-xl font-extrabold text-emerald-700">
              {currentParkInfo.pvGenerationKWh}
            </div>
            <div className="text-[11px] font-sans text-slate-500 pt-1 border-t border-slate-100 flex justify-between">
              <span>自用: <strong className="text-slate-800">{currentParkInfo.selfUseKWh}</strong></span>
              <span>上网: <strong className="text-blue-600">{currentParkInfo.gridExportKWh}</strong></span>
            </div>
          </div>

          {/* 卡片 2: 光伏自用省钱收益 */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1 hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-600 font-sans">
              <span className="font-bold text-emerald-800 flex items-center gap-1">
                <Coins className="size-3.5 text-emerald-600" />
                自用省钱收益
              </span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                折合电价核算
              </span>
            </div>
            <div className="text-xl font-extrabold text-emerald-700">
              {currentParkInfo.selfUseSavings}
            </div>
            <div className="text-[11px] font-sans text-slate-500 pt-1 border-t border-slate-100 flex justify-between">
              <span>按电价: <strong className="text-slate-800">{currentParkInfo.industrialPrice}</strong></span>
              <span className="text-emerald-600 font-bold">直接省电费</span>
            </div>
          </div>

          {/* 卡片 3: 超发上网创收收益 (图中标注上网电价) */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1 hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-600 font-sans">
              <span className="font-bold text-blue-800 flex items-center gap-1">
                <TrendingUp className="size-3.5 text-[#1677ff]" />
                超发上网收益
              </span>
              <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">
                余电上网
              </span>
            </div>
            <div className="text-xl font-extrabold text-[#1677ff]">
              {currentParkInfo.gridExportRevenue}
            </div>
            <div className="text-[11px] font-sans text-slate-500 pt-1 border-t border-slate-100 flex justify-between">
              <span>上网价: <strong className="text-blue-700 font-bold">{currentParkInfo.feedInTariff.split(' ')[0]}</strong></span>
              <span className="text-blue-600 font-bold">电网结算</span>
            </div>
          </div>

          {/* 卡片 4: 月度采购绿电/绿证 */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1 hover:border-purple-300 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-600 font-sans">
              <span className="font-bold text-purple-800 flex items-center gap-1">
                <Zap className="size-3.5 text-purple-600" />
                月度绿电/绿证采购
              </span>
              <span className="px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 text-[10px] font-bold">
                按月按工厂录入
              </span>
            </div>
            <div className="text-xl font-extrabold text-purple-700">
              {currentParkInfo.gecCertificateCount.toLocaleString()} <span className="text-xs font-normal text-slate-500 font-sans">张绿证</span>
            </div>
            <div className="text-[11px] font-sans text-slate-500 pt-1 border-t border-slate-100 flex justify-between">
              <span>交易绿电: <strong className="text-slate-800">{currentParkInfo.purchasedGreenElec.split(' ')[0]}</strong></span>
              <span className="text-purple-600 font-bold">园区汇总</span>
            </div>
          </div>

          {/* 卡片 5: 新能源月度综合总收益 */}
          <div className="p-3.5 bg-white rounded-xl border border-amber-200 bg-amber-50/20 shadow-xs space-y-1 hover:border-amber-400 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-600 font-sans">
              <span className="font-bold text-amber-900 flex items-center gap-1">
                <DollarSign className="size-3.5 text-amber-600" />
                新能源月度总收益
              </span>
              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                省费+创收
              </span>
            </div>
            <div className="text-xl font-extrabold text-amber-700">
              {currentParkInfo.totalRevenue}
            </div>
            <div className="text-[11px] font-sans text-slate-500 pt-1 border-t border-amber-200 flex justify-between">
              <span>领导关注: <strong className="text-amber-800 font-bold">一眼看懂省钱</strong></span>
              <span className="text-amber-700 font-bold">折合核算</span>
            </div>
          </div>

        </div>

        {/* 3. 新能源自用电量与超发上网整合图表 (并在图中标注各地上网电价基准线) */}
        <div className="bg-white p-4 rounded-xl border border-[#e5e7eb] shadow-xs space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="h-3.5 w-1 rounded-full bg-emerald-500 shrink-0" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                【{currentParkInfo.name}】绿电来源构成与 24 小时消纳曲线分析 (功率/kW)
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-[#1677ff] font-mono font-bold">
                标注上网电价：{currentParkInfo.feedInTariff}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                <span className="size-2.5 rounded-full bg-emerald-500" /> 新能源总出力
              </span>
              <span className="flex items-center gap-1 text-slate-800 font-bold">
                <span className="size-2.5 rounded-full bg-[#1e293b]" /> 厂区自用消纳
              </span>
              <span className="flex items-center gap-1 text-blue-600 font-bold">
                <span className="size-2.5 rounded-full bg-[#1677ff]" /> 超发上网电量 (基准线上)
              </span>
            </div>
          </div>

          {/* 🌟 绿电来源构成 3 大卡片 (参照图片 2) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
            <div className="p-3.5 bg-emerald-50/40 rounded-xl border border-emerald-200/80 space-y-2">
              <div className="flex items-center justify-between font-sans">
                <span className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  1. 自建分布式光伏 (50%)
                </span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                  自发自用
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                厂房屋顶 12.8MWp 分布式光伏，直接注入配电网消纳
              </p>
              <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[11px] font-sans">
                <span className="text-slate-500">本日日均: <strong className="text-slate-800 font-mono">7.3 万kWh</strong></span>
                <span className="text-slate-500">本月累计: <strong className="text-emerald-700 font-mono font-extrabold">{currentParkInfo.pvGenerationKWh}</strong></span>
              </div>
            </div>

            <div className="p-3.5 bg-blue-50/40 rounded-xl border border-blue-200/80 space-y-2">
              <div className="flex items-center justify-between font-sans">
                <span className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[#1677ff]" />
                  2. 市场化交易绿电 (28%)
                </span>
                <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 text-[10px] font-bold">
                  跨省交易
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                通过电力交易中心购入蒙东风电与三峡水电，具备绿电凭证
              </p>
              <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between text-[11px] font-sans">
                <span className="text-slate-500">本日日均: <strong className="text-slate-800 font-mono">3.5 万kWh</strong></span>
                <span className="text-slate-500">本月累计: <strong className="text-blue-700 font-mono font-extrabold">{currentParkInfo.purchasedGreenElec}</strong></span>
              </div>
            </div>

            <div className="p-3.5 bg-purple-50/40 rounded-xl border border-purple-200/80 space-y-2">
              <div className="flex items-center justify-between font-sans">
                <span className="font-bold text-purple-900 text-xs flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-purple-600" />
                  3. 中国绿证 (GEC) 核销 (14%)
                </span>
                <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 text-[10px] font-bold">
                  核销溯源
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                国家能源局统一核发中国绿色电力证书，1张GEC等效1000kWh
              </p>
              <div className="pt-2 border-t border-purple-200/60 flex items-center justify-between text-[11px] font-sans">
                <span className="text-slate-500">本日核销: <strong className="text-slate-800 font-mono">1.8 万张</strong></span>
                <span className="text-slate-500">本月累计: <strong className="text-purple-700 font-mono font-extrabold">{(currentParkInfo.gecCertificateCount / 10).toLocaleString()} 万kWh</strong></span>
              </div>
            </div>
          </div>

          <div className="h-[280px]">
            <LineTrend
              data={pvOutputTrendData}
              xKey="time"
              height={280}
              lines={[
                { key: '新能源出力', name: '新能源总出力 (kW)', color: '#10b981' },
                { key: '厂区自用电量', name: '厂区自用消纳 (kW)', color: '#1e293b' },
                { key: '超发上网电量', name: '超发上网电量 (kW)', color: '#1677ff' },
              ]}
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 font-mono flex items-center justify-between">
            <span>差异化上网电价说明:</span>
            <span className="font-bold text-slate-800">
              各地上网电价存在区域差异 (天津 0.30元/kWh · 山西 0.45元/kWh · 辽宁 0.375元/kWh · 新疆 0.25元/kWh)
            </span>
          </div>
        </div>

        {/* 4. 绿电 / 绿证月度交易台账与手动录入 (工厂按月录入，园区汇总) */}
        <div className="bg-white p-4 rounded-xl border border-[#e5e7eb] shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="h-3.5 w-1 rounded-full bg-purple-600 shrink-0" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                【工厂月度绿电与绿证 (GEC) 购买交易台账 (园区统管汇总)】
              </h2>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 font-mono">
                满足新疆园区仅买绿证场景
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-700 focus:outline-none focus:border-[#1677ff]"
              >
                <option value="all">全部交易类型</option>
                <option value="自建新能源 (光伏)">自建新能源 (光伏)</option>
                <option value="市场化绿电交易">市场化绿电交易</option>
                <option value="中国绿证 (GEC)">中国绿证 (GEC)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold font-sans">
                <tr>
                  <th className="py-2.5 px-3">凭证 / 交易编号</th>
                  <th className="py-2.5 px-3">交易类型</th>
                  <th className="py-2.5 px-3">采购 / 声明主体</th>
                  <th className="py-2.5 px-3 text-right">交易数量 / 电量</th>
                  <th className="py-2.5 px-3 text-right">结算单价</th>
                  <th className="py-2.5 px-3 text-center">状态</th>
                  <th className="py-2.5 px-3 text-right">抵扣碳减排 (tCO2)</th>
                  <th className="py-2.5 px-3 text-center">核算月份</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                {records.filter(r => filterType === 'all' || r.type === filterType).map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-800">{r.no}</td>
                    <td className="py-2.5 px-3 font-sans">
                      <span
                        className={cn(
                          'px-1.5 py-0.2 rounded border text-[10px] font-bold',
                          r.type === '中国绿证 (GEC)'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : r.type === '自建新能源 (光伏)'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-blue-50 text-[#1677ff] border-blue-200'
                        )}
                      >
                        {r.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-sans font-medium">{r.company}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">{r.amount}</td>
                    <td className="py-2.5 px-3 text-right text-slate-600">{r.price}</td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                        {r.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700">{r.carbonOffset}</td>
                    <td className="py-2.5 px-3 text-center">{r.month}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* 手动录入绿证 Modal 弹窗 (解决新疆等仅买绿证特殊场景) */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Coins className="size-5 text-emerald-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  手动登记工厂绿电 / 绿证 (GEC) 购买凭单
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleAddTrade} className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">交易类型</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="中国绿证 (GEC)">中国绿证 (GEC - 适用于单独购买绿证场景)</option>
                  <option value="市场化绿电交易">市场化绿电交易</option>
                  <option value="自建新能源 (光伏)">自建新能源 (光伏)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">采购 / 声明工厂主体</label>
                <select
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="沈变公司">沈变公司 (辽宁)</option>
                  <option value="衡变公司">衡变公司 (湖南)</option>
                  <option value="新变厂">新变厂 (新疆)</option>
                  <option value="鲁缆公司">鲁缆公司 (山东)</option>
                  <option value="德缆公司">德缆公司 (四川)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">交易数量 (万kWh / 张)</label>
                  <input
                    type="text"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">结算单价 (元/张 或 元/kWh)</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">核算账期</label>
                  <input
                    type="month"
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">凭证 / 证书编号</label>
                  <input
                    type="text"
                    value={formData.no}
                    onChange={(e) => setFormData({ ...formData, no: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
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
