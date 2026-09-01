'use client'

import React, { useState, useMemo } from 'react'
import {
  DollarSign,
  Zap,
  Flame,
  Droplets,
  Wind,
  Layers,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Edit,
  History,
  FileSpreadsheet,
  Download,
  Share2,
  SlidersHorizontal,
  Info,
  Check,
  X,
  Building2,
  ArrowRight,
  TrendingDown,
  Percent,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// 费价模型版本方案接口
interface TariffSchemeVersion {
  id: string
  versionCode: string
  name: string
  publishYear: string
  effectiveDate: string
  expiryDate: string
  status: '生效中' | '待生效' | '已归档'
  appliedUnitsCount: number
  updatedAt: string
  operator: string
}

// 预设版本方案数据
const TARIFF_VERSIONS: TariffSchemeVersion[] = [
  {
    id: 'ver_2026_01',
    versionCode: 'v2026.01',
    name: '2026年度电装集团统一能源费价方案 (夏季分时)',
    publishYear: '2026',
    effectiveDate: '2026-01-01',
    expiryDate: '2026-12-31',
    status: '生效中',
    appliedUnitsCount: 6,
    updatedAt: '2026-01-05',
    operator: '张建国 (能碳总监)',
  },
  {
    id: 'ver_2026_10',
    versionCode: 'v2026.10',
    name: '2026年四季度能源保供与秋冬阶梯气价预设方案',
    publishYear: '2026',
    effectiveDate: '2026-10-01',
    expiryDate: '2027-03-31',
    status: '待生效',
    appliedUnitsCount: 0,
    updatedAt: '2026-08-20',
    operator: '李雅静 (ESG专员)',
  },
  {
    id: 'ver_2025_01',
    versionCode: 'v2025.01',
    name: '2025年度电装集团综合工商业费价基准方案',
    publishYear: '2025',
    effectiveDate: '2025-01-01',
    expiryDate: '2025-12-31',
    status: '已归档',
    appliedUnitsCount: 6,
    updatedAt: '2025-01-10',
    operator: '张建国 (能碳总监)',
  },
]

// 24小时时段分布
const HOURS_24 = Array.from({ length: 24 }, (_, i) => i)

export default function TariffPricePage() {
  const [selectedVerId, setSelectedVerId] = useState('ver_2026_01')
  const [activeTab, setActiveTab] = useState<'power' | 'gas' | 'steam_water' | 'dispatch'>('power')
  const [powerSeason, setPowerSeason] = useState<'summer' | 'winter' | 'normal'>('summer')

  // 分时电价表单状态 (元/kWh)
  const [touRates, setTouRates] = useState({
    deep: '0.2850', // 深谷
    valley: '0.3620', // 谷段
    flat: '0.7150', // 平段
    peak: '1.1480', // 峰段
    sharp: '1.3820', // 尖峰
    capacityRate: '32.00', // 变压器容量基本电费 (元/kVA·月)
    demandRate: '48.00', // 最大需量基本电费 (元/kW·月)
    powerFactorBase: '0.90', // 力调电费功率因数考核基准
    greenPremium: '0.0420', // 绿电交易平均溢价 (元/kWh)
  })

  // 阶梯气价表单状态
  const [gasTiers, setGasTiers] = useState([
    { tier: '第一档 (基础配额)', range: '0 ~ 500,000 m³/月', price: '2.8500', note: '日常生产恒温干燥用气' },
    { tier: '第二档 (增产用气)', range: '500,001 ~ 1,200,000 m³/月', price: '3.2000', note: '超产负荷气量溢价' },
    { tier: '第三档 (冬季高阶)', range: '> 1,200,000 m³/月', price: '3.6500', note: '冬季调峰惩罚性阶梯价' },
  ])

  // 热力与水耗费价
  const [heatWaterPrices, setHeatWaterPrices] = useState({
    steamSuperheat: '320.00', // 过热蒸汽 (元/t)
    steamSaturated: '260.00', // 饱和蒸汽 (元/t)
    waterFresh: '4.20', // 工业自来水 (元/t)
    waterSoftened: '12.50', // 软化除盐水 (元/t)
    diesel: '7.85', // 轻柴油 (元/kg)
  })

  // Toast 提示
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  // 24 小时分时时段映射 (夏令分时)
  const getHourType = (h: number) => {
    if (powerSeason === 'summer') {
      if (h >= 0 && h < 6) return { type: '谷段', color: 'bg-emerald-400', label: '谷' }
      if (h >= 6 && h < 8) return { type: '平段', color: 'bg-blue-400', label: '平' }
      if (h >= 8 && h < 11) return { type: '峰段', color: 'bg-amber-400', label: '峰' }
      if (h >= 11 && h < 14) return { type: '尖峰', color: 'bg-red-500', label: '尖' }
      if (h >= 14 && h < 17) return { type: '平段', color: 'bg-blue-400', label: '平' }
      if (h >= 17 && h < 21) return { type: '峰段', color: 'bg-amber-400', label: '峰' }
      if (h >= 21 && h < 23) return { type: '尖峰', color: 'bg-red-500', label: '尖' }
      return { type: '谷段', color: 'bg-emerald-400', label: '谷' }
    }
    if (h >= 0 && h < 7) return { type: '谷段', color: 'bg-emerald-400', label: '谷' }
    if (h >= 7 && h < 10) return { type: '平段', color: 'bg-blue-400', label: '平' }
    if (h >= 10 && h < 16) return { type: '峰段', color: 'bg-amber-400', label: '峰' }
    if (h >= 16 && h < 20) return { type: '平段', color: 'bg-blue-400', label: '平' }
    return { type: '谷段', color: 'bg-emerald-400', label: '谷' }
  }

  const currentVer = useMemo(() => {
    return TARIFF_VERSIONS.find((v) => v.id === selectedVerId) || TARIFF_VERSIONS[0]
  }, [selectedVerId])

  return (
    <div className="space-y-3.5">
      {/* 顶部 Header */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
            <DollarSign className="size-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">能源费价模型管理</h1>
            <p className="text-xs text-slate-500 font-sans">
              维护电、气、水、蒸汽多能源介质价格模型，支持分时电价（尖峰平谷）、阶梯气价、容需量电费，多版本集中管控与统一下发
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 版本切换下拉 */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
            <span className="text-slate-500">方案版本：</span>
            <select
              value={selectedVerId}
              onChange={(e) => {
                setSelectedVerId(e.target.value)
                showToast(`已切换至方案版本【${e.target.selectedOptions[0].text}】`)
              }}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              {TARIFF_VERSIONS.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.versionCode} - {v.status}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => showToast('已成功保存当前能源费价模型变更并已同步成本计算引擎！')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white font-semibold text-xs cursor-pointer shadow-xs transition-colors"
          >
            <Check className="size-3.5" />
            <span>保存当前方案</span>
          </button>

          <button
            type="button"
            onClick={() => showToast('正在向沈变公司、衡变公司、新变厂、鲁缆、新缆、德缆6大单位下发最新费价模型...')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs cursor-pointer shadow-2xs transition-colors"
          >
            <Share2 className="size-3.5 text-emerald-600" />
            <span>全集团统一下发</span>
          </button>
        </div>
      </div>

      {/* 提示 Toast */}
      {toastMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span className="font-sans font-medium">{toastMsg}</span>
        </div>
      )}



      {/* Tab 选项卡 */}
      <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1 font-sans text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('power')}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer select-none',
            activeTab === 'power'
              ? 'bg-blue-50 text-[#1677ff] font-bold border border-blue-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          )}
        >
          <Zap className="size-3.5 text-amber-500" />
          <span>电力费价模型 (分时电价 · 容需量 · 力调)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gas')}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer select-none',
            activeTab === 'gas'
              ? 'bg-blue-50 text-[#1677ff] font-bold border border-blue-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          )}
        >
          <Flame className="size-3.5 text-orange-500" />
          <span>天然气与燃料费价 (阶梯气价 · 采办单价)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('steam_water')}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer select-none',
            activeTab === 'steam_water'
              ? 'bg-blue-50 text-[#1677ff] font-bold border border-blue-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          )}
        >
          <Wind className="size-3.5 text-purple-500" />
          <span>蒸汽与水耗费价 (热力工质 · 水资源)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('dispatch')}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer select-none',
            activeTab === 'dispatch'
              ? 'bg-blue-50 text-[#1677ff] font-bold border border-blue-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          )}
        >
          <Building2 className="size-3.5 text-emerald-600" />
          <span>直属制造单位下发状态 ({currentVer.appliedUnitsCount}/6)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* Tab 1: 电力费价模型 */}
      {/* ========================================================================= */}
      {activeTab === 'power' && (
        <div className="space-y-3.5">
          {/* 1. 分时电价段与 24 小时时段分布 */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3.5">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
              <span className="size-2 rounded-full bg-amber-500" />
              <h3 className="text-xs font-bold text-slate-900">
                一、大工业用电分时时段电价配置 (元/kWh)
              </h3>
            </div>

            {/* 5 大分时电价卡片输入 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-red-50/60 border border-red-200 space-y-1.5">
                <div className="flex items-center justify-between text-red-900 font-bold">
                  <span>尖峰时段 (Sharp)</span>
                  <span className="text-[10px] bg-red-100 px-1.5 py-0.2 rounded">11~14h, 21~23h</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <input
                    type="number"
                    step="0.0001"
                    value={touRates.sharp}
                    onChange={(e) => setTouRates({ ...touRates, sharp: e.target.value })}
                    className="w-full bg-white border border-red-300 rounded px-2 py-1 font-mono font-bold text-red-700 text-base focus:outline-none"
                  />
                  <span className="text-slate-500 shrink-0">元</span>
                </div>
                <div className="text-[10px] text-red-600">电网最高负荷时段上浮 80%</div>
              </div>

              <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200 space-y-1.5">
                <div className="flex items-center justify-between text-amber-900 font-bold">
                  <span>高峰时段 (Peak)</span>
                  <span className="text-[10px] bg-amber-100 px-1.5 py-0.2 rounded">8~11h, 17~21h</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <input
                    type="number"
                    step="0.0001"
                    value={touRates.peak}
                    onChange={(e) => setTouRates({ ...touRates, peak: e.target.value })}
                    className="w-full bg-white border border-amber-300 rounded px-2 py-1 font-mono font-bold text-amber-700 text-base focus:outline-none"
                  />
                  <span className="text-slate-500 shrink-0">元</span>
                </div>
                <div className="text-[10px] text-amber-600">生产主负荷高峰上浮 50%</div>
              </div>

              <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-200 space-y-1.5">
                <div className="flex items-center justify-between text-blue-900 font-bold">
                  <span>平时段 (Flat)</span>
                  <span className="text-[10px] bg-blue-100 px-1.5 py-0.2 rounded">6~8h, 14~17h</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <input
                    type="number"
                    step="0.0001"
                    value={touRates.flat}
                    onChange={(e) => setTouRates({ ...touRates, flat: e.target.value })}
                    className="w-full bg-white border border-blue-300 rounded px-2 py-1 font-mono font-bold text-[#1677ff] text-base focus:outline-none"
                  />
                  <span className="text-slate-500 shrink-0">元</span>
                </div>
                <div className="text-[10px] text-blue-600">基准购电结算电价</div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                <div className="flex items-center justify-between text-emerald-900 font-bold">
                  <span>低谷时段 (Valley)</span>
                  <span className="text-[10px] bg-emerald-100 px-1.5 py-0.2 rounded">0~6h, 23~24h</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <input
                    type="number"
                    step="0.0001"
                    value={touRates.valley}
                    onChange={(e) => setTouRates({ ...touRates, valley: e.target.value })}
                    className="w-full bg-white border border-emerald-300 rounded px-2 py-1 font-mono font-bold text-emerald-700 text-base focus:outline-none"
                  />
                  <span className="text-slate-500 shrink-0">元</span>
                </div>
                <div className="text-[10px] text-emerald-600">谷段下浮 50% (储能充放电)</div>
              </div>

              <div className="p-3 rounded-lg bg-teal-50/60 border border-teal-200 space-y-1.5">
                <div className="flex items-center justify-between text-teal-900 font-bold">
                  <span>深谷时段 (Deep)</span>
                  <span className="text-[10px] bg-teal-100 px-1.5 py-0.2 rounded">新能源富余段</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <input
                    type="number"
                    step="0.0001"
                    value={touRates.deep}
                    onChange={(e) => setTouRates({ ...touRates, deep: e.target.value })}
                    className="w-full bg-white border border-teal-300 rounded px-2 py-1 font-mono font-bold text-teal-700 text-base focus:outline-none"
                  />
                  <span className="text-slate-500 shrink-0">元</span>
                </div>
                <div className="text-[10px] text-teal-600">重大节假日或弃光深谷结算</div>
              </div>
            </div>

            {/* 24 小时甘特时段图 */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>24 小时分时时段分布示意（点击或悬停查看）</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-red-500" /> 尖峰</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-amber-400" /> 高峰</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-blue-400" /> 平段</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-emerald-400" /> 低谷</span>
                </div>
              </div>

              <div className="grid grid-cols-24 gap-0.5 h-7 rounded-lg overflow-hidden bg-slate-100 p-0.5 border border-slate-200">
                {HOURS_24.map((h) => {
                  const info = getHourType(h)
                  return (
                    <div
                      key={h}
                      className={cn(
                        'flex items-center justify-center text-[10px] font-bold text-white transition-transform hover:scale-105 cursor-pointer rounded-xs',
                        info.color
                      )}
                      title={`${h}:00 ~ ${h + 1}:00 - ${info.type}`}
                    >
                      {h}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* 2. 基本电费与力调电费核算规则 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            {/* 卡片 1: 容量与需量基本电费 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="size-2 rounded-full bg-[#1677ff]" />
                <h3 className="text-xs font-bold text-slate-900">
                  二、两部制大工业基本电费计费规则
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                    <label className="font-bold text-slate-700 block">按变压器容量计费</label>
                    <div className="flex items-baseline gap-1">
                      <input
                        type="number"
                        value={touRates.capacityRate}
                        onChange={(e) => setTouRates({ ...touRates, capacityRate: e.target.value })}
                        className="w-24 bg-white border border-slate-300 rounded px-2 py-1 font-mono font-bold text-slate-800 text-sm focus:outline-none"
                      />
                      <span className="text-[11px] text-slate-500">元 / (kVA·月)</span>
                    </div>
                    <p className="text-[10px] text-slate-400">总容量 = 全厂主变报装容量总和</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                    <label className="font-bold text-slate-700 block">按最大需量计费</label>
                    <div className="flex items-baseline gap-1">
                      <input
                        type="number"
                        value={touRates.demandRate}
                        onChange={(e) => setTouRates({ ...touRates, demandRate: e.target.value })}
                        className="w-24 bg-white border border-slate-300 rounded px-2 py-1 font-mono font-bold text-slate-800 text-sm focus:outline-none"
                      />
                      <span className="text-[11px] text-slate-500">元 / (kW·月)</span>
                    </div>
                    <p className="text-[10px] text-slate-400">需量 = 月度 15 分钟最大采集负荷</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-200 text-[11px] text-blue-900 flex items-start gap-1.5">
                  <Info className="size-3.5 text-[#1677ff] mt-0.5 shrink-0" />
                  <span>
                    系统成本分析模块将根据各工厂实时最大需量与报装容量，自动执行「需量 vs 容量」月度最优计费推荐，每年可为直属制造单位节约 15%~25% 基本电费。
                  </span>
                </div>
              </div>
            </div>

            {/* 卡片 2: 力调电费与绿电交易溢价 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="size-2 rounded-full bg-emerald-500" />
                <h3 className="text-xs font-bold text-slate-900">
                  三、功率因数力调电费与绿电交易参数
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                    <label className="font-bold text-slate-700 block">功率因数考核基准 (cos φ)</label>
                    <div className="flex items-baseline gap-1">
                      <input
                        type="number"
                        step="0.01"
                        value={touRates.powerFactorBase}
                        onChange={(e) => setTouRates({ ...touRates, powerFactorBase: e.target.value })}
                        className="w-24 bg-white border border-slate-300 rounded px-2 py-1 font-mono font-bold text-slate-800 text-sm focus:outline-none"
                      />
                      <span className="text-[11px] text-slate-500">(0.90 达标基准)</span>
                    </div>
                    <p className="text-[10px] text-slate-400">低于 0.90 罚款，高于 0.90 阶梯奖励</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                    <label className="font-bold text-slate-700 block">市场化绿电综合溢价</label>
                    <div className="flex items-baseline gap-1">
                      <input
                        type="number"
                        step="0.0001"
                        value={touRates.greenPremium}
                        onChange={(e) => setTouRates({ ...touRates, greenPremium: e.target.value })}
                        className="w-24 bg-white border border-slate-300 rounded px-2 py-1 font-mono font-bold text-emerald-600 text-sm focus:outline-none"
                      />
                      <span className="text-[11px] text-slate-500">元 / kWh</span>
                    </div>
                    <p className="text-[10px] text-slate-400">跨省中长期交易绿电附加环境权益价</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>
                    全集团屋顶分布式光伏自发自用绿电实行 <strong>零电价/自消纳模式</strong>，直接抵扣外购电量与碳排放基准。
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Tab 2: 天然气与燃料费价 */}
      {/* ========================================================================= */}
      {activeTab === 'gas' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Flame className="size-4 text-orange-500" />
                工商业管道天然气阶梯计费模型 (元/m³)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                用于各制造基地干燥窑炉、退火炉及冬季供热天然气成本与碳核算
              </p>
            </div>

            <button
              type="button"
              onClick={() => showToast('已成功更新阶梯气价方案！')}
              className="px-3 py-1.5 bg-[#1677ff] hover:bg-blue-600 text-white font-bold text-xs rounded-lg shadow-xs cursor-pointer"
            >
              保存气价设置
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3">阶梯档位</th>
                  <th className="py-2.5 px-3">月度用气量区间</th>
                  <th className="py-2.5 px-3">结算单价 (元/m³)</th>
                  <th className="py-2.5 px-3">适用工序与用能说明</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {gasTiers.map((row, idx) => (
                  <tr key={idx} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{row.tier}</td>
                    <td className="py-3 px-3 font-mono">{row.range}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="0.0001"
                          defaultValue={row.price}
                          className="w-28 bg-white border border-slate-200 rounded px-2 py-1 font-mono font-bold text-orange-600 text-sm focus:outline-none focus:border-[#1677ff]"
                        />
                        <span className="text-slate-500 font-mono">元/m³</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Tab 3: 蒸汽与水耗费价 */}
      {/* ========================================================================= */}
      {activeTab === 'steam_water' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Wind className="size-4 text-purple-600" />
              集中供热蒸汽、工业水资源与燃油采办单价表
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              作为全集团《用能结构成本》与《综合能耗折标》统一结算基准
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
            <div className="p-3.5 bg-purple-50/50 rounded-xl border border-purple-200 space-y-2">
              <span className="font-bold text-purple-900 block">过热工业蒸汽 (1.6MPa, 300℃)</span>
              <div className="flex items-baseline gap-1">
                <input
                  type="number"
                  value={heatWaterPrices.steamSuperheat}
                  onChange={(e) => setHeatWaterPrices({ ...heatWaterPrices, steamSuperheat: e.target.value })}
                  className="w-28 bg-white border border-purple-300 rounded px-2 py-1 font-mono font-bold text-purple-700 text-sm focus:outline-none"
                />
                <span className="text-slate-500">元 / 吨</span>
              </div>
              <p className="text-[10px] text-slate-500">管网集中供热主管计量单价</p>
            </div>

            <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2">
              <span className="font-bold text-blue-900 block">饱和工业蒸汽 (0.8~1.0MPa)</span>
              <div className="flex items-baseline gap-1">
                <input
                  type="number"
                  value={heatWaterPrices.steamSaturated}
                  onChange={(e) => setHeatWaterPrices({ ...heatWaterPrices, steamSaturated: e.target.value })}
                  className="w-28 bg-white border border-blue-300 rounded px-2 py-1 font-mono font-bold text-blue-700 text-sm focus:outline-none"
                />
                <span className="text-slate-500">元 / 吨</span>
              </div>
              <p className="text-[10px] text-slate-500">绝缘纸板热压与干燥罐供热</p>
            </div>

            <div className="p-3.5 bg-cyan-50/50 rounded-xl border border-cyan-200 space-y-2">
              <span className="font-bold text-cyan-900 block">工业新鲜自来水</span>
              <div className="flex items-baseline gap-1">
                <input
                  type="number"
                  value={heatWaterPrices.waterFresh}
                  onChange={(e) => setHeatWaterPrices({ ...heatWaterPrices, waterFresh: e.target.value })}
                  className="w-28 bg-white border border-cyan-300 rounded px-2 py-1 font-mono font-bold text-cyan-700 text-sm focus:outline-none"
                />
                <span className="text-slate-500">元 / 吨</span>
              </div>
              <p className="text-[10px] text-slate-500">市政供水水费及污水处理附加</p>
            </div>

            <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-200 space-y-2">
              <span className="font-bold text-indigo-900 block">工业高纯脱盐软化水</span>
              <div className="flex items-baseline gap-1">
                <input
                  type="number"
                  value={heatWaterPrices.waterSoftened}
                  onChange={(e) => setHeatWaterPrices({ ...heatWaterPrices, waterSoftened: e.target.value })}
                  className="w-28 bg-white border border-indigo-300 rounded px-2 py-1 font-mono font-bold text-indigo-700 text-sm focus:outline-none"
                />
                <span className="text-slate-500">元 / 吨</span>
              </div>
              <p className="text-[10px] text-slate-500">试验站纯水冷却与油品清洗制备</p>
            </div>

            <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200 space-y-2">
              <span className="font-bold text-amber-900 block">轻柴油 (生产动力/物流)</span>
              <div className="flex items-baseline gap-1">
                <input
                  type="number"
                  value={heatWaterPrices.diesel}
                  onChange={(e) => setHeatWaterPrices({ ...heatWaterPrices, diesel: e.target.value })}
                  className="w-28 bg-white border border-amber-300 rounded px-2 py-1 font-mono font-bold text-amber-700 text-sm focus:outline-none"
                />
                <span className="text-slate-500">元 / kg</span>
              </div>
              <p className="text-[10px] text-slate-500">叉车重载物流与应急发电机燃料</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Tab 4: 集团直属单位下发状态 */}
      {/* ========================================================================= */}
      {activeTab === 'dispatch' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="size-4 text-emerald-600" />
                费价方案在 6 大直属制造单位的应用状态
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                集团平台统一下发后，各单位的能耗成本核算与能效优化模型自动绑定最新方案
              </p>
            </div>

            <button
              type="button"
              onClick={() => showToast('已成功向全集团直属单位推送最新费价方案！')}
              className="px-3.5 py-1.5 bg-[#1677ff] hover:bg-blue-600 text-white font-bold text-xs rounded-lg shadow-xs cursor-pointer"
            >
              一键全量下发
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3">直属制造单位</th>
                  <th className="py-2.5 px-3">当前执行费价方案</th>
                  <th className="py-2.5 px-3">生效状态</th>
                  <th className="py-2.5 px-3">电费计费方式</th>
                  <th className="py-2.5 px-3">最近同步时间</th>
                  <th className="py-2.5 px-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {[
                  { name: '沈变公司', ver: 'v2026.01', status: '已生效同步', method: '需量计费 (最优)', syncTime: '2026-08-31 16:30' },
                  { name: '衡变公司', ver: 'v2026.01', status: '已生效同步', method: '容量计费', syncTime: '2026-08-31 16:30' },
                  { name: '新变厂', ver: 'v2026.01', status: '已生效同步', method: '需量计费 (最优)', syncTime: '2026-08-31 16:30' },
                  { name: '鲁缆公司', ver: 'v2026.01', status: '已生效同步', method: '容量计费', syncTime: '2026-08-31 16:30' },
                  { name: '新缆厂', ver: 'v2026.01', status: '已生效同步', method: '需量计费 (最优)', syncTime: '2026-08-31 16:30' },
                  { name: '德缆公司', ver: 'v2026.01', status: '已生效同步', method: '容量计费', syncTime: '2026-08-31 16:30' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{row.name}</td>
                    <td className="py-3 px-3 font-mono text-[#1677ff] font-semibold">{row.ver}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">{row.method}</td>
                    <td className="py-3 px-3 font-mono text-slate-400">{row.syncTime}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => showToast(`已重新同步【${row.name}】费价模型与成本核算引擎`)}
                        className="text-[#1677ff] hover:underline font-medium cursor-pointer"
                      >
                        重新下发
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
