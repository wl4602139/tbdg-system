'use client'

import React, { useState, useMemo } from 'react'
import {
  Activity,
  Download,
  Calendar,
  Building2,
  Factory,
  Zap,
  Flame,
  CloudRain,
  Car,
  Trees,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Sliders,
  TrendingUp,
  FileSpreadsheet,
  Check,
  RotateCcw,
  Info,
  ChevronRight,
  ShieldAlert,
  Radio,
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { LineTrend, BarChartGroup } from '@/components/shared/charts'
import { cn } from '@/lib/utils'

// 1. 集团下属各三级工厂/车间数据字典映射
interface CompanyUnitData {
  id: string
  name: string
  parentCompany: string
  province: string
  gridFactor: number // 分省电力排放因子 (tCO2/MWh)
  hasLiquidNitrogen: boolean // 是否有液氮录入项 (仅露娜公司)
  elecKWh: number
  gasM3: number
  steamT: number
  oilL: number
  nitrogenT?: number
  treeCount: number
  treeType: string
  solarSelfKWh: number
  cleanOutputKWh: number
}

const FACTORY_PRESETS: Record<string, CompanyUnitData> = {
  ws_sb_main: {
    id: 'ws_sb_main',
    name: '沈变本部 (超高压制造基地)',
    parentCompany: '沈变公司',
    province: '辽宁省 (东北电网)',
    gridFactor: 0.5703,
    hasLiquidNitrogen: false,
    elecKWh: 8450000,
    gasM3: 320000,
    steamT: 4200,
    oilL: 12500,
    treeCount: 3500,
    treeType: '油松 (0.025 tCO2/株/年)',
    solarSelfKWh: 3250000,
    cleanOutputKWh: 560000,
  },
  ws_sb_luna: {
    id: 'ws_sb_luna',
    name: '露娜公司 (特变电工露娜智能电气)',
    parentCompany: '沈变公司',
    province: '天津市 (华北电网)',
    gridFactor: 0.5810,
    hasLiquidNitrogen: true, // 🌟 仅露娜公司可见外购液氮
    elecKWh: 5200000,
    gasM3: 180000,
    steamT: 1850,
    oilL: 8200,
    nitrogenT: 45.0, // 45吨外购液氮
    treeCount: 1800,
    treeType: '侧柏 (0.022 tCO2/株/年)',
    solarSelfKWh: 1980000,
    cleanOutputKWh: 280000,
  },
  ws_sb_zh: {
    id: 'ws_sb_zh',
    name: '沈变智慧能源中心',
    parentCompany: '沈变公司',
    province: '辽宁省 (东北电网)',
    gridFactor: 0.5703,
    hasLiquidNitrogen: false,
    elecKWh: 3200000,
    gasM3: 120000,
    steamT: 1200,
    oilL: 5400,
    treeCount: 1500,
    treeType: '油松 (0.025 tCO2/株/年)',
    solarSelfKWh: 2100000,
    cleanOutputKWh: 450000,
  },
  ws_hb_main: {
    id: 'ws_hb_main',
    name: '衡变本部 (南方特高压基地)',
    parentCompany: '衡变公司',
    province: '湖南省 (华中电网)',
    gridFactor: 0.5271,
    hasLiquidNitrogen: false,
    elecKWh: 7800000,
    gasM3: 290000,
    steamT: 3900,
    oilL: 11000,
    treeCount: 4200,
    treeType: '杨树 (0.028 tCO2/株/年)',
    solarSelfKWh: 2890000,
    cleanOutputKWh: 420000,
  },
  ws_xb_uhv: {
    id: 'ws_xb_uhv',
    name: '新变厂 (新疆特高压制造部)',
    parentCompany: '新变厂',
    province: '新疆维吾尔自治区 (西北电网)',
    gridFactor: 0.5691,
    hasLiquidNitrogen: false,
    elecKWh: 9200000,
    gasM3: 350000,
    steamT: 4600,
    oilL: 14000,
    treeCount: 5000,
    treeType: '胡杨 (0.030 tCO2/株/年)',
    solarSelfKWh: 4100000,
    cleanOutputKWh: 680000,
  },
  ws_ll_main: {
    id: 'ws_ll_main',
    name: '鲁缆本部 (山东特变线缆基地)',
    parentCompany: '鲁缆公司',
    province: '山东省 (华东电网)',
    gridFactor: 0.5884,
    hasLiquidNitrogen: false,
    elecKWh: 6800000,
    gasM3: 210000,
    steamT: 2800,
    oilL: 9500,
    treeCount: 2200,
    treeType: '黑松 (0.024 tCO2/株/年)',
    solarSelfKWh: 2100000,
    cleanOutputKWh: 310000,
  },
  ws_xl_main: {
    id: 'ws_xl_main',
    name: '特变电工新疆电缆有限公司',
    parentCompany: '新缆厂',
    province: '新疆维吾尔自治区 (西北电网)',
    gridFactor: 0.5691,
    hasLiquidNitrogen: false,
    elecKWh: 4900000,
    gasM3: 150000,
    steamT: 1900,
    oilL: 7800,
    treeCount: 2600,
    treeType: '胡杨 (0.030 tCO2/株/年)',
    solarSelfKWh: 1800000,
    cleanOutputKWh: 250000,
  },
  ws_dl_main: {
    id: 'ws_dl_main',
    name: '特变电工（德阳）电缆股份有限公司',
    parentCompany: '德缆公司',
    province: '四川省 (西南电网)',
    gridFactor: 0.3850,
    hasLiquidNitrogen: false,
    elecKWh: 4300000,
    gasM3: 120000,
    steamT: 1500,
    oilL: 6200,
    treeCount: 1600,
    treeType: '银杏 (0.022 tCO2/株/年)',
    solarSelfKWh: 1500000,
    cleanOutputKWh: 210000,
  },
}

// 集团近 12 个月月度碳排放与能耗走势数据
const GROUP_12M_CARBON_TREND = [
  { month: '25-09', 碳排放总量: 29850, 净碳排放量: 25980, 碳抵消量: 3870, 综合用能: 15820 },
  { month: '25-10', 碳排放总量: 29420, 净碳排放量: 25520, 碳抵消量: 3900, 综合用能: 15650 },
  { month: '25-11', 碳排放总量: 29180, 净碳排放量: 25300, 碳抵消量: 3880, 综合用能: 15490 },
  { month: '25-12', 碳排放总量: 29750, 净碳排放量: 25890, 碳抵消量: 3860, 综合用能: 15780 },
  { month: '26-01', 碳排放总量: 28860, 净碳排放量: 24950, 碳抵消量: 3910, 综合用能: 15310 },
  { month: '26-02', 碳排放总量: 28720, 净碳排放量: 24800, 碳抵消量: 3920, 综合用能: 15280 },
  { month: '26-03', 碳排放总量: 29010, 净碳排放量: 25050, 碳抵消量: 3960, 综合用能: 15440 },
  { month: '26-04', 碳排放总量: 28750, 净碳排放量: 24720, 碳抵消量: 4030, 综合用能: 15290 },
  { month: '26-05', 碳排放总量: 28620, 净碳排放量: 24510, 碳抵消量: 4110, 综合用能: 15260 },
  { month: '26-06', 碳排放总量: 28890, 净碳排放量: 24680, 碳抵消量: 4210, 综合用能: 15320 },
  { month: '26-07', 碳排放总量: 28580, 净碳排放量: 24390, 碳抵消量: 4190, 综合用能: 15180 },
  { month: '26-08', 碳排放总量: 28452, 净碳排放量: 24216, 碳抵消量: 4236, 综合用能: 15134 },
]

// 集团 11 家二级/直属公司大盘汇总清单
const GROUP_COMPANY_RANKINGS = [
  { id: 'ws_sb_main', name: '沈变公司', totalCarbon: 58240, netCarbon: 49820, totalTce: 31200, intensity: 1.87, nonFossilRatio: 41.2, elecTenKwh: 17200 },
  { id: 'ws_xb_uhv', name: '新变厂', totalCarbon: 62450, netCarbon: 53100, totalTce: 33400, intensity: 1.87, nonFossilRatio: 44.5, elecTenKwh: 18500 },
  { id: 'ws_hb_main', name: '衡变公司', totalCarbon: 52180, netCarbon: 44520, totalTce: 28100, intensity: 1.86, nonFossilRatio: 43.8, elecTenKwh: 15600 },
  { id: 'ws_ll_main', name: '鲁缆公司', totalCarbon: 46820, netCarbon: 40150, totalTce: 24800, intensity: 1.89, nonFossilRatio: 38.5, elecTenKwh: 13900 },
  { id: 'ws_sb_luna', name: '露娜公司', totalCarbon: 34210, netCarbon: 29840, totalTce: 18600, intensity: 1.84, nonFossilRatio: 48.2, elecTenKwh: 10500 },
  { id: 'ws_xl_main', name: '新缆厂', totalCarbon: 28450, netCarbon: 24320, totalTce: 15200, intensity: 1.87, nonFossilRatio: 42.0, elecTenKwh: 8900 },
  { id: 'ws_dl_main', name: '德缆公司', totalCarbon: 16170, netCarbon: 13810, totalTce: 8440, intensity: 1.81, nonFossilRatio: 52.4, elecTenKwh: 5200 },
]

export default function CarbonEmissionMonitoringPage() {
  // 左侧组织拓扑树选中节点 (三级驱动)
  const [selectedOrgNode, setSelectedOrgNode] = useState<StandardOrgNode>({
    id: 'ent_root',
    name: '特变电工集团 (全景汇总)',
    fullName: '特变电工集团 (全景汇总)',
    level: 'group',
    badge: '全集团',
  })

  // 层级穿透状态：'group' (集团/二级公司总览) | 'unit' (三级单位/工厂明细填报)
  const [levelView, setLevelView] = useState<'group' | 'unit'>('group')
  const [selectedUnitKey, setSelectedUnitKey] = useState<string>('ws_sb_main')
  const [timeDim, setTimeDim] = useState<'month' | 'quarter' | 'year'>('month')

  // 对标与基准 Tab: 'horizontal' | 'vertical' | 'benchmark'
  const [benchmarkTab, setBenchmarkTab] = useState<'horizontal' | 'vertical' | 'benchmark'>('horizontal')
  const [productCat, setProductCat] = useState<'transformer_500kv' | 'transformer_220kv' | 'cable_ehv'>('transformer_500kv')

  // 基准值微调状态 (Tab 3)
  const [benchmarkMethod, setBenchmarkMethod] = useState<'weighted' | 'average'>('weighted')
  const [manualAdjustment, setManualAdjustment] = useState<string>('0.00')

  // 当前选中工厂的数据可编辑状态 (由树状节点直接驱动)
  const activeFactory = FACTORY_PRESETS[selectedUnitKey] || FACTORY_PRESETS.ws_sb_main

  // 手动录入字段状态
  const [oilInput, setOilInput] = useState<number>(activeFactory.oilL)
  const [nitrogenInput, setNitrogenInput] = useState<number>(activeFactory.nitrogenT || 45.0)
  const [treeCountInput, setTreeCountInput] = useState<number>(activeFactory.treeCount)
  const [treeTypeInput, setTreeTypeInput] = useState<string>(activeFactory.treeType)
  const [savedSuccess, setSavedSuccess] = useState(false)

  // 当组织树节点切换时，同步更新工厂数据模型
  const handleSelectTreeNode = (node: StandardOrgNode) => {
    setSelectedOrgNode(node)
    
    // 如果点击的是全集团根节点，进入集团总览看板
    if (node.id === 'ent_root' || node.id === 'group_root' || node.level === 'group') {
      setLevelView('group')
      return
    }

    // 点击任意二级公司或三级车间/工厂节点，直接进入三级工厂明细与监测
    setLevelView('unit')

    // 智能匹配对应的工厂配置预设
    let targetKey = 'ws_sb_main'
    if (FACTORY_PRESETS[node.id]) {
      targetKey = node.id
    } else {
      const foundKey = Object.keys(FACTORY_PRESETS).find(
        (k) =>
          node.id.toLowerCase().includes(k.replace('ws_', '')) ||
          node.name.includes(FACTORY_PRESETS[k].parentCompany) ||
          node.name.includes(FACTORY_PRESETS[k].name.slice(0, 2))
      )
      if (foundKey) targetKey = foundKey
    }

    setSelectedUnitKey(targetKey)
    const f = FACTORY_PRESETS[targetKey] || FACTORY_PRESETS.ws_sb_main
    setOilInput(f.oilL)
    setNitrogenInput(f.nitrogenT || 45.0)
    setTreeCountInput(f.treeCount)
    setTreeTypeInput(f.treeType)
    setSavedSuccess(false)
  }

  // 1. 实时精准折标煤与碳排放核算算法
  const calculations = useMemo(() => {
    // 能源折标煤 (tce)
    const elecTce = (activeFactory.elecKWh * 0.1229) / 1000
    const gasTce = (activeFactory.gasM3 * 1.2143) / 1000
    const steamTce = activeFactory.steamT * 0.0943
    const oilTce = (oilInput * 1.09) / 1000
    const nitrogenTce = activeFactory.hasLiquidNitrogen ? (nitrogenInput * 0.66) : 0
    const totalTce = elecTce + gasTce + steamTce + oilTce + nitrogenTce

    // 各能源占比
    const elecRatio = Number(((elecTce / totalTce) * 100).toFixed(1))
    const gasRatio = Number(((gasTce / totalTce) * 100).toFixed(1))
    const steamRatio = Number(((steamTce / totalTce) * 100).toFixed(1))
    const oilRatio = Number(((oilTce / totalTce) * 100).toFixed(1))
    const nitrogenRatio = activeFactory.hasLiquidNitrogen ? Number(((nitrogenTce / totalTce) * 100).toFixed(1)) : 0

    // 碳排放核算 (tCO2)
    const elecCarbon = (activeFactory.elecKWh / 1000) * activeFactory.gridFactor
    const gasCarbon = (activeFactory.gasM3 / 10000) * 21.62
    const steamCarbon = activeFactory.steamT * 0.11
    const oilCarbon = oilInput * 0.0023
    // 🌟 关键业务规则：液氮不计入碳排放！
    const nitrogenCarbon = 0 

    const totalCarbon = elecCarbon + gasCarbon + steamCarbon + oilCarbon + nitrogenCarbon

    // 碳抵销核算 (tCO2)
    const solarOffset = (activeFactory.solarSelfKWh / 1000) * activeFactory.gridFactor
    const outputOffset = (activeFactory.cleanOutputKWh / 1000) * activeFactory.gridFactor
    const treeFactor = treeTypeInput.includes('油松') ? 0.025 : treeTypeInput.includes('侧柏') ? 0.022 : treeTypeInput.includes('胡杨') ? 0.030 : 0.028
    const treeOffset = treeCountInput * treeFactor

    const totalOffset = solarOffset + outputOffset + treeOffset
    const netCarbon = Math.max(0, totalCarbon - totalOffset)
    const intensity = Number((totalCarbon / totalTce).toFixed(2))

    return {
      elecTce,
      gasTce,
      steamTce,
      oilTce,
      nitrogenTce,
      totalTce,
      elecRatio,
      gasRatio,
      steamRatio,
      oilRatio,
      nitrogenRatio,
      elecCarbon,
      gasCarbon,
      steamCarbon,
      oilCarbon,
      nitrogenCarbon,
      totalCarbon,
      solarOffset,
      outputOffset,
      treeOffset,
      totalOffset,
      netCarbon,
      intensity,
    }
  }, [activeFactory, oilInput, nitrogenInput, treeCountInput, treeTypeInput])

  // 纵向历史趋势数据
  const verticalHistoryData = [
    { month: '2024年', 实际碳排放强度: 2.05, 行业基准线: 1.85 },
    { month: '2025年Q1', 实际碳排放强度: 1.98, 行业基准线: 1.85 },
    { month: '2025年Q2', 实际碳排放强度: 1.94, 行业基准线: 1.85 },
    { month: '2025年Q3', 实际碳排放强度: 1.91, 行业基准线: 1.85 },
    { month: '2025年Q4', 实际碳排放强度: 1.89, 行业基准线: 1.85 },
    { month: '2026年08月(当前)', 实际碳排放强度: calculations.intensity, 行业基准线: 1.85 },
  ]

  const handleSaveData = (e: React.FormEvent) => {
    e.preventDefault()
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  return (
    <div className="flex gap-3.5 items-start">
      {/* 🌟 左侧 270px 经典工业级企业组织拓扑树 */}
      <StandardOrgTree
        selectedId={selectedOrgNode.id}
        onSelect={handleSelectTreeNode}
      />

      {/* 🌟 右侧主面板 */}
      <div className="flex-1 min-w-0 flex flex-col gap-3.5 font-sans text-slate-800">
        {/* 1. 顶部 Header 与 统一标准时间筛选 */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
              <Activity className="size-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800">能源碳排放监测</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* 时间维度统一 (月度/季度/年度) */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setTimeDim('month')}
                className={cn(
                  'px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer',
                  timeDim === 'month' ? 'font-bold bg-white text-[#1677ff] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                )}
              >
                月度 (08月)
              </button>
              <button
                type="button"
                onClick={() => setTimeDim('quarter')}
                className={cn(
                  'px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer',
                  timeDim === 'quarter' ? 'font-bold bg-white text-[#1677ff] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                )}
              >
                季度 (Q3)
              </button>
              <button
                type="button"
                onClick={() => setTimeDim('year')}
                className={cn(
                  'px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer',
                  timeDim === 'year' ? 'font-bold bg-white text-[#1677ff] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                )}
              >
                年度 (2026)
              </button>
            </div>

            <button
              type="button"
              onClick={() => alert('已成功导出【能源碳排放监测基础数据台账】(Excel)...')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
            >
              <FileSpreadsheet className="size-3.5" />
              <span>导出基础报表 (Excel)</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🌟 1. 集团 / 二级公司层级（总览页）                                         */}
        {/* ========================================================================= */}
        {levelView === 'group' && (
          <div className="space-y-3.5">
            {/* 顶部 11 项核心指标的总量卡片 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Building2 className="size-3.5 text-blue-600" />
                  【{selectedOrgNode.name}】11 项核心能源与碳排放总量指标看板
                </span>
                <span>点击卡片可查看对应下属公司穿透数据</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 font-mono">
                {[
                  { title: '碳排放总量', value: '284,520', unit: 'tCO2', note: '同比 -3.2% ↓', tone: 'blue' },
                  { title: '净碳排放量', value: '242,160', unit: 'tCO2', note: '扣除碳抵销后', tone: 'emerald' },
                  { title: '综合碳排放强度', value: '1.88', unit: 'tCO2/tce', note: '总碳排 ÷ 总用能', tone: 'slate' },
                  { title: '综合用能总量', value: '151,340', unit: 'tce', note: '同比 -1.8% ↓', tone: 'slate' },
                  { title: '非化石能源占比', value: '42.6%', unit: '', note: '绿电 + 自发清洁', tone: 'emerald' },
                  { title: '物理认定绿电占比', value: '38.2%', unit: '', note: '电网实际消纳', tone: 'emerald' },
                  { title: '绿证认定绿电占比', value: '45.8%', unit: '', note: '含 GEC 交易核销', tone: 'emerald' },
                  { title: '电力消耗总量', value: '84,200', unit: '万kWh', note: '占能耗 68.5%', tone: 'blue' },
                  { title: '天然气消耗量', value: '3,450', unit: '万m³', note: '占能耗 18.2%', tone: 'amber' },
                  { title: '外购蒸汽消耗量', value: '42,800', unit: 't', note: '自产已剔除', tone: 'purple' },
                  { title: '碳抵销总量', value: '42,360', unit: 'tCO2', note: '光伏+外供+碳汇', tone: 'emerald' },
                ].map((card, idx) => (
                  <div
                    key={idx}
                    onClick={() => alert(`【穿透明细】已调取【${card.title}】全集团各直属单位分项时序数据台账。`)}
                    className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs hover:border-[#1677ff] hover:shadow-xs transition-all cursor-pointer space-y-1 group"
                  >
                    <div className="text-[11px] font-sans text-slate-500 font-medium truncate group-hover:text-[#1677ff] transition-colors">
                      {card.title}
                    </div>
                    <div className="text-base font-extrabold text-slate-900 truncate">
                      {card.value} <span className="text-[10px] font-normal text-slate-400 font-sans">{card.unit}</span>
                    </div>
                    <div className="text-[10px] font-sans text-slate-400 border-t border-slate-100 pt-0.5 flex justify-between items-center">
                      <span>{card.note}</span>
                      <ChevronRight className="size-3 text-slate-300 group-hover:text-[#1677ff] transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

                        {/* 🌟 2. 中部核心图表展示区 (近 12 个月碳排放与净碳走势 + 7 大直属制造板块横向对比) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
              
              {/* 左侧 7 栏：近 12 个月碳排放总量与净碳排放量走势 */}
              <div className="lg:col-span-7 bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-3.5 w-1 rounded-full bg-[#1677ff] shrink-0" />
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      【全集团】近 12 个月碳排放与净碳排放时序走势 (tCO2)
                    </h3>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-[#1677ff] font-mono font-bold">
                    2025.09 ~ 2026.08 (月度连续核算)
                  </span>
                </div>

                {/* 趋势折线图 */}
                <div className="h-[220px]">
                  <LineTrend
                    data={GROUP_12M_CARBON_TREND}
                    xKey="month"
                    height={220}
                    lines={[
                      { key: '碳排放总量', name: '碳排放总量 (tCO2)', color: '#1677ff' },
                      { key: '净碳排放量', name: '净碳排放量 (tCO2)', color: '#10b981' },
                      { key: '碳抵消量', name: '碳抵消量 (tCO2)', color: '#8b5cf6' },
                    ]}
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-sans text-slate-500">
                  <span>核算范围：范围一直接燃烧 + 范围二外购电力与蒸汽 (扣除光伏自用与碳汇抵销)</span>
                  <span className="text-emerald-700 font-bold font-mono">净碳排放同比 -5.4% ↓</span>
                </div>
              </div>

              {/* 右侧 5 栏：7 大直属制造单位综合能耗与碳排放横向对标 */}
              <div className="lg:col-span-5 bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-3.5 w-1 rounded-full bg-emerald-600 shrink-0" />
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      7 大直属制造单位碳排放与能耗对比
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">当月实测 (tCO2 vs tce)</span>
                </div>

                {/* 直属单位柱状对比图 */}
                <div className="h-[220px]">
                  <BarChartGroup
                    data={GROUP_COMPANY_RANKINGS.map((c) => ({
                      name: c.name.replace('公司', '').replace('厂', ''),
                      碳排放总量: c.totalCarbon,
                      综合用能: c.totalTce,
                    }))}
                    xKey="name"
                    height={220}
                    bars={[
                      { key: '碳排放总量', name: '碳排放 (tCO2)', color: '#1677ff' },
                      { key: '综合用能', name: '综合用能 (tce)', color: '#10b981' },
                    ]}
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-sans text-slate-500">
                  <span>排名前三：新变厂、沈变公司、衡变公司</span>
                  <span className="text-[#1677ff] font-bold font-mono">贡献占比 61.2%</span>
                </div>
              </div>

            </div>

            {/* 各直属二级/三级公司数据列表与横向对比 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between bg-slate-50/60 gap-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-blue-600" />
                  <h3 className="text-xs font-bold text-slate-800">
                    各直属单位碳排放与能耗数据汇总清单 (点击行可穿透至三级单位填报与监测明细)
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">共 7 大重点制造板块 · 纯客观数据</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold font-sans">
                      <th className="py-2.5 px-3">序号</th>
                      <th className="py-2.5 px-3">直属制造单位</th>
                      <th className="py-2.5 px-3">碳排放总量 (tCO2)</th>
                      <th className="py-2.5 px-3">净碳排放量 (tCO2)</th>
                      <th className="py-2.5 px-3">综合用能总量 (tce)</th>
                      <th className="py-2.5 px-3">碳排放强度 (tCO2/tce)</th>
                      <th className="py-2.5 px-3">非化石能源占比 (%)</th>
                      <th className="py-2.5 px-3">用电量 (万kWh)</th>
                      <th className="py-2.5 px-3 text-right">穿透操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {GROUP_COMPANY_RANKINGS.map((row, idx) => (
                      <tr
                        key={row.id}
                        onClick={() => {
                          setSelectedUnitKey(row.id)
                          setSelectedOrgNode({
                            id: row.id,
                            name: row.name,
                            fullName: row.name,
                            level: 'workshop',
                          })
                          setLevelView('unit')
                        }}
                        className="hover:bg-blue-50/50 transition-colors cursor-pointer"
                      >
                        <td className="py-2.5 px-3 text-slate-400">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-sans font-bold text-slate-900 flex items-center gap-1.5">
                          <Factory className="size-3.5 text-[#1677ff]" />
                          {row.name}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{row.totalCarbon.toLocaleString()}</td>
                        <td className="py-2.5 px-3 font-bold text-emerald-700">{row.netCarbon.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-blue-700">{row.totalTce.toLocaleString()}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-800">{row.intensity}</td>
                        <td className="py-2.5 px-3 text-emerald-700 font-bold">{row.nonFossilRatio}%</td>
                        <td className="py-2.5 px-3">{row.elecTenKwh.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="text-xs text-[#1677ff] font-semibold hover:underline flex items-center justify-end gap-0.5">
                            进入填报与监测 <ChevronRight className="size-3" />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 🌟 2. 三级单位 / 工厂层级（明细填报与监测页，由左侧树直接驱动）              */}
        {/* ========================================================================= */}
        {levelView === 'unit' && (
          <div className="space-y-3.5">
            {/* 🌟 当前选中三级监测节点状态条 (完全由树结构驱动，移除冗余横向按钮) */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span className="font-bold text-slate-800">
                  当前三级监测实体：
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 border border-blue-200 text-[#1677ff] font-bold font-mono">
                  {selectedOrgNode.fullName || selectedOrgNode.name}
                </span>
                <span className="text-slate-400 font-sans text-[11px]">(在左侧组织树点击任意三级单位可随时切换)</span>
              </div>

              <div className="text-slate-500 font-mono flex items-center gap-2">
                <span>所属电网区域: <strong className="text-slate-800">{activeFactory.province}</strong></span>
                <span className="text-slate-300">|</span>
                <span>分省基准排放因子: <strong className="text-[#1677ff]">{activeFactory.gridFactor} tCO2/MWh</strong></span>
              </div>
            </div>

            {/* 核心板块 1 & 2: 数据录入区 (左) 与 能源结构监测区 (右) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
              {/* 1. 数据录入区 (手动兜底，做减法) - 占 7 列 */}
              <div className="lg:col-span-7 bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-blue-600" />
                    <h3 className="text-xs font-bold text-slate-900">
                      数据录入区 (自动采集展示 + 手动兜底录入)
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-sans">
                    电、气、蒸汽自动采集 · 油/液氮/碳汇手动补充
                  </span>
                </div>

                <form onSubmit={handleSaveData} className="space-y-3 text-xs font-sans">
                  {/* 自动采集只读展示行 */}
                  <div className="grid grid-cols-3 gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 font-mono">
                    <div>
                      <span className="text-[11px] text-slate-500 font-sans block">工业用电 (自动拉取)</span>
                      <span className="text-sm font-bold text-slate-900">{activeFactory.elecKWh.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400 font-sans block">kWh</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 font-sans block">天然气 (自动拉取)</span>
                      <span className="text-sm font-bold text-slate-900">{activeFactory.gasM3.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400 font-sans block">m³</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 font-sans block">外购蒸汽 (自动拉取)</span>
                      <span className="text-sm font-bold text-slate-900">{activeFactory.steamT.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400 font-sans block">吨 (仅统计外购，自产已剔除)</span>
                    </div>
                  </div>

                  {/* 手动录入字段 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* 公务车用油 */}
                    <div className="space-y-1">
                      <label className="text-slate-700 font-bold flex items-center gap-1">
                        <Car className="size-3.5 text-slate-500" />
                        公务车用油 (升/月)：
                      </label>
                      <input
                        type="number"
                        value={oilInput}
                        onChange={(e) => setOilInput(Number(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono font-bold focus:outline-none focus:border-[#1677ff]"
                      />
                      <span className="text-[10px] text-slate-400 block font-mono">
                        折标煤: {((oilInput * 1.09) / 1000).toFixed(2)} tce · 碳排: {(oilInput * 0.0023).toFixed(2)} tCO2
                      </span>
                    </div>

                    {/* 外购液氮 (🌟 仅露娜公司可见此字段) */}
                    {activeFactory.hasLiquidNitrogen ? (
                      <div className="space-y-1">
                        <label className="text-slate-700 font-bold flex items-center justify-between">
                          <span>外购液氮 (吨/月)：</span>
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-normal">露娜专用</span>
                        </label>
                        <input
                          type="number"
                          value={nitrogenInput}
                          onChange={(e) => setNitrogenInput(Number(e.target.value) || 0)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono font-bold focus:outline-none focus:border-[#1677ff]"
                        />
                        <span className="text-[10px] text-slate-400 block font-mono">
                          折标煤: {(nitrogenInput * 0.66).toFixed(2)} tce · <span className="text-slate-400 bg-slate-100 px-1 py-0.2 rounded">不计入碳排放 (仅计能源结构)</span>
                        </span>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-dashed border-slate-200 text-slate-400 text-[11px] flex items-center justify-center">
                        该制造基地无外购液氮核算项 (仅露娜公司适用)
                      </div>
                    )}
                  </div>

                  {/* 碳汇基础数据录入 */}
                  <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Trees className="size-3.5 text-emerald-600" />
                        厂区绿化植树碳汇基础数据 (用于碳抵扣)
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">自动套用内置吸收系数</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-slate-600 text-[11px]">主要树种类型：</label>
                        <select
                          value={treeTypeInput}
                          onChange={(e) => setTreeTypeInput(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#1677ff]"
                        >
                          <option value="油松 (0.025 tCO2/株/年)">油松 (0.025 tCO2/株/年)</option>
                          <option value="侧柏 (0.022 tCO2/株/年)">侧柏 (0.022 tCO2/株/年)</option>
                          <option value="杨树 (0.028 tCO2/株/年)">杨树 (0.028 tCO2/株/年)</option>
                          <option value="胡杨 (0.030 tCO2/株/年)">胡杨 (0.030 tCO2/株/年)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-600 text-[11px]">在册成活树木数量 (株)：</label>
                        <input
                          type="number"
                          value={treeCountInput}
                          onChange={(e) => setTreeCountInput(Number(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono font-bold focus:outline-none focus:border-[#1677ff]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="text-[11px] text-slate-400">
                      {savedSuccess ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <Check className="size-3.5" /> 已保存并完成全量数据实时核算！
                        </span>
                      ) : (
                        <span>修改任意数值即时在右侧与下方核算生效</span>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white font-bold text-xs shadow-xs cursor-pointer transition-colors"
                    >
                      保存并执行核算
                    </button>
                  </div>
                </form>
              </div>

              {/* 2. 能源结构监测区 (图表极简) - 占 5 列 */}
              <div className="lg:col-span-5 bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-emerald-500" />
                      <h3 className="text-xs font-bold text-slate-900">
                        能源结构监测 (电 · 天然气 · 蒸汽 · 油)
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      总折标煤: {calculations.totalTce.toFixed(1)} tce
                    </span>
                  </div>

                  {/* 极简横向堆叠条形图 */}
                  <div className="pt-4 space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono font-bold text-slate-700">
                        <span>能源占比结构 (按折标煤比例)</span>
                        <span>100%</span>
                      </div>

                      <div className="h-6 w-full rounded-lg overflow-hidden flex shadow-inner bg-slate-100">
                        <div
                          style={{ width: `${calculations.elecRatio}%` }}
                          className="bg-[#1677ff] h-full flex items-center justify-center text-[10px] text-white font-bold font-mono transition-all duration-300"
                          title={`工业用电: ${calculations.elecRatio}% (${calculations.elecTce.toFixed(1)} tce)`}
                        >
                          {calculations.elecRatio > 15 ? `电 ${calculations.elecRatio}%` : ''}
                        </div>
                        <div
                          style={{ width: `${calculations.gasRatio}%` }}
                          className="bg-amber-500 h-full flex items-center justify-center text-[10px] text-white font-bold font-mono transition-all duration-300"
                          title={`天然气: ${calculations.gasRatio}% (${calculations.gasTce.toFixed(1)} tce)`}
                        >
                          {calculations.gasRatio > 10 ? `气 ${calculations.gasRatio}%` : ''}
                        </div>
                        <div
                          style={{ width: `${calculations.steamRatio}%` }}
                          className="bg-purple-500 h-full flex items-center justify-center text-[10px] text-white font-bold font-mono transition-all duration-300"
                          title={`外购蒸汽: ${calculations.steamRatio}% (${calculations.steamTce.toFixed(1)} tce)`}
                        >
                          {calculations.steamRatio > 8 ? `汽 ${calculations.steamRatio}%` : ''}
                        </div>
                        <div
                          style={{ width: `${calculations.oilRatio}%` }}
                          className="bg-slate-600 h-full flex items-center justify-center text-[10px] text-white font-bold font-mono transition-all duration-300"
                          title={`公务车用油: ${calculations.oilRatio}% (${calculations.oilTce.toFixed(1)} tce)`}
                        >
                          {calculations.oilRatio > 5 ? `油 ${calculations.oilRatio}%` : ''}
                        </div>
                        {activeFactory.hasLiquidNitrogen && (
                          <div
                            style={{ width: `${calculations.nitrogenRatio}%` }}
                            className="bg-cyan-500 h-full flex items-center justify-center text-[10px] text-white font-bold font-mono transition-all duration-300"
                            title={`外购液氮: ${calculations.nitrogenRatio}% (${calculations.nitrogenTce.toFixed(1)} tce)`}
                          >
                            {calculations.nitrogenRatio > 5 ? `氮 ${calculations.nitrogenRatio}%` : ''}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 结构图例清单 */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="size-2.5 rounded-sm bg-[#1677ff]" />
                        <span className="text-slate-600 font-sans">工业用电:</span>
                        <strong>{calculations.elecTce.toFixed(1)} tce</strong>
                        <span className="text-slate-400">({calculations.elecRatio}%)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="size-2.5 rounded-sm bg-amber-500" />
                        <span className="text-slate-600 font-sans">天然气:</span>
                        <strong>{calculations.gasTce.toFixed(1)} tce</strong>
                        <span className="text-slate-400">({calculations.gasRatio}%)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="size-2.5 rounded-sm bg-purple-500" />
                        <span className="text-slate-600 font-sans">外购蒸汽:</span>
                        <strong>{calculations.steamTce.toFixed(1)} tce</strong>
                        <span className="text-slate-400">({calculations.steamRatio}%)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="size-2.5 rounded-sm bg-slate-600" />
                        <span className="text-slate-600 font-sans">公务车用油:</span>
                        <strong>{calculations.oilTce.toFixed(1)} tce</strong>
                        <span className="text-slate-400">({calculations.oilRatio}%)</span>
                      </div>
                      {activeFactory.hasLiquidNitrogen && (
                        <div className="flex items-center gap-1.5 col-span-2 text-cyan-800">
                          <span className="size-2.5 rounded-sm bg-cyan-500" />
                          <span className="font-sans">外购液氮 (折标煤):</span>
                          <strong>{calculations.nitrogenTce.toFixed(1)} tce</strong>
                          <span className="text-slate-400">({calculations.nitrogenRatio}% · 不计碳排)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 关键标注要求 */}
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 space-y-0.5 font-sans">
                  <div>⚡ 蒸汽数据说明：<strong className="text-slate-700">仅统计外购量，自产蒸汽已剔除，杜绝重复计算。</strong></div>
                  <div>🌿 绿电消纳说明：光伏自发自用电量已由电力监控网关自动核销。</div>
                </div>
              </div>
            </div>

            {/* 核心板块 3: 碳排放核算结果区 (报表化，去评价化) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-slate-800" />
                  <h3 className="text-xs font-bold text-slate-900">
                    碳排放核算结果区 (报表化 · 无主观评价 · 纯客观数值)
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  公式固化：组织总碳排放量 ÷ 总tce用能量
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 font-mono">
                {/* 总碳排放量 */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                  <div className="text-xs text-slate-600 font-sans font-medium flex justify-between">
                    <span>总碳排放量</span>
                    <span className="text-slate-400 text-[10px]">基于分省因子自动核算</span>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900">
                    {calculations.totalCarbon.toFixed(1)} <span className="text-xs font-normal text-slate-500 font-sans">tCO2</span>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 font-sans flex justify-between">
                    <span>电力排放: {calculations.elecCarbon.toFixed(1)} t</span>
                    <span>化石与蒸汽: {(calculations.gasCarbon + calculations.steamCarbon + calculations.oilCarbon).toFixed(1)} t</span>
                  </div>
                </div>

                {/* 碳排放强度 */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                  <div className="text-xs text-slate-600 font-sans font-medium flex justify-between">
                    <span>碳排放强度 (组织级)</span>
                    <span className="text-slate-400 text-[10px]">组织总碳排 ÷ 总用能量</span>
                  </div>
                  <div className="text-2xl font-extrabold text-blue-700">
                    {calculations.intensity} <span className="text-xs font-normal text-slate-500 font-sans">tCO2/tce</span>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 font-sans flex justify-between">
                    <span>总碳排: {calculations.totalCarbon.toFixed(0)} t</span>
                    <span>总能耗: {calculations.totalTce.toFixed(0)} tce</span>
                  </div>
                </div>

                {/* 净碳排放量 */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                  <div className="text-xs text-slate-600 font-sans font-medium flex justify-between">
                    <span>净碳排放量</span>
                    <span className="text-emerald-700 text-[10px] font-bold">扣除碳抵销后最终值</span>
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-700">
                    {calculations.netCarbon.toFixed(1)} <span className="text-xs font-normal text-slate-500 font-sans">tCO2</span>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 font-sans flex justify-between">
                    <span>总抵扣量: -{calculations.totalOffset.toFixed(1)} t</span>
                    <span>净减碳率: {((calculations.totalOffset / calculations.totalCarbon) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 核心板块 4: 碳抵销（抵扣）明细区 (抓大放小) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-900">
                    碳抵销 (抵扣) 明细区 (可再生自用 + 外供清洁能源 + 植树碳汇)
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  合计抵扣量: <strong className="text-emerald-700">{calculations.totalOffset.toFixed(1)} tCO2</strong>
                </span>
              </div>

              {/* 3 个独立抵扣卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 font-mono">
                <div className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/30 space-y-1">
                  <span className="text-xs text-emerald-800 font-sans font-bold block">1. 可再生能源自用抵扣量</span>
                  <div className="text-xl font-extrabold text-emerald-700">
                    {calculations.solarOffset.toFixed(1)} <span className="text-xs font-normal text-slate-500 font-sans">tCO2</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-sans block">分布式光伏自发自用 {(activeFactory.solarSelfKWh / 10000).toFixed(1)} 万kWh 自动核销</span>
                </div>

                <div className="p-3 rounded-xl border border-blue-100 bg-blue-50/30 space-y-1">
                  <span className="text-xs text-blue-800 font-sans font-bold block">2. 对外输送清洁能源抵扣量</span>
                  <div className="text-xl font-extrabold text-blue-700">
                    {calculations.outputOffset.toFixed(1)} <span className="text-xs font-normal text-slate-500 font-sans">tCO2</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-sans block">园区微电网向外供电 {(activeFactory.cleanOutputKWh / 10000).toFixed(1)} 万kWh</span>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                  <span className="text-xs text-slate-800 font-sans font-bold block">3. 厂区植树碳汇抵扣量</span>
                  <div className="text-xl font-extrabold text-slate-800">
                    {calculations.treeOffset.toFixed(1)} <span className="text-xs font-normal text-slate-500 font-sans">tCO2</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-sans block">成活 {treeCountInput} 株 {treeTypeInput.split(' ')[0]} 吸收核算</span>
                </div>
              </div>

              {/* 抵扣流水列表 */}
              <div className="overflow-x-auto border border-slate-100 rounded-lg">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold font-sans">
                      <th className="py-2 px-3">核销日期</th>
                      <th className="py-2 px-3">抵扣分类</th>
                      <th className="py-2 px-3">凭据编号 / 绿电溯源码</th>
                      <th className="py-2 px-3">核算电量 / 数量</th>
                      <th className="py-2 px-3 text-right">抵扣减碳量 (tCO2)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="py-2 px-3">2026-08-01 ~ 08-26</td>
                      <td className="py-2 px-3 font-sans font-medium text-emerald-800">屋顶光伏自发自用</td>
                      <td className="py-2 px-3">PV-TBEA-202608-001</td>
                      <td className="py-2 px-3">{(activeFactory.solarSelfKWh).toLocaleString()} kWh</td>
                      <td className="py-2 px-3 text-right font-bold text-emerald-700">-{calculations.solarOffset.toFixed(1)}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">2026-08-01 ~ 08-26</td>
                      <td className="py-2 px-3 font-sans font-medium text-blue-800">对外清洁微电网输送</td>
                      <td className="py-2 px-3">GRID-OUT-202608-088</td>
                      <td className="py-2 px-3">{(activeFactory.cleanOutputKWh).toLocaleString()} kWh</td>
                      <td className="py-2 px-3 text-right font-bold text-blue-700">-{calculations.outputOffset.toFixed(1)}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">2026-08-01 ~ 08-26</td>
                      <td className="py-2 px-3 font-sans font-medium text-slate-800">厂区植树固碳核算</td>
                      <td className="py-2 px-3">FOREST-CERT-2026</td>
                      <td className="py-2 px-3">{treeCountInput} 株</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-800">-{calculations.treeOffset.toFixed(1)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 核心板块 5: 对标与基准区 (三大维度，摒弃树状图) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-blue-600" />
                  <h3 className="text-xs font-bold text-slate-900">
                    对标与基准区 (横向对标 · 纵向历史 · 基准值微调)
                  </h3>
                </div>

                {/* 3 个 Tab 切换 */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-sans">
                  <button
                    type="button"
                    onClick={() => setBenchmarkTab('horizontal')}
                    className={cn(
                      'px-3 py-1 rounded-md font-bold transition-all cursor-pointer',
                      benchmarkTab === 'horizontal' ? 'bg-white text-[#1677ff] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    )}
                  >
                    Tab 1: 横向对比
                  </button>
                  <button
                    type="button"
                    onClick={() => setBenchmarkTab('vertical')}
                    className={cn(
                      'px-3 py-1 rounded-md font-bold transition-all cursor-pointer',
                      benchmarkTab === 'vertical' ? 'bg-white text-[#1677ff] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    )}
                  >
                    Tab 2: 纵向对比
                  </button>
                  <button
                    type="button"
                    onClick={() => setBenchmarkTab('benchmark')}
                    className={cn(
                      'px-3 py-1 rounded-md font-bold transition-all cursor-pointer',
                      benchmarkTab === 'benchmark' ? 'bg-white text-[#1677ff] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    )}
                  >
                    Tab 3: 基准对比与微调
                  </button>
                </div>
              </div>

              {/* Tab 1: 横向对比 */}
              {benchmarkTab === 'horizontal' && (
                <div className="space-y-2.5 text-xs font-sans">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 font-bold">选择同类型产品类别进行内部单耗横向比较：</span>
                    <select
                      value={productCat}
                      onChange={(e) => setProductCat(e.target.value as any)}
                      className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-[#1677ff]"
                    >
                      <option value="transformer_500kv">ODFS-334MVA/500kV 单相特高压变压器</option>
                      <option value="transformer_220kv">SZ-110kV/63000kVA 三相双绕组主变</option>
                      <option value="cable_ehv">500kV 超高压交联立塔线缆</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-xs text-slate-500 font-sans block">沈变本部 (当前工厂)</span>
                      <span className="text-lg font-bold text-slate-900">0.317 kWh/kVA</span>
                      <span className="text-[10px] text-slate-400 font-sans block pt-0.5">单台产品碳排: 0.181 tCO2</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-xs text-slate-500 font-sans block">衡变制造基地</span>
                      <span className="text-lg font-bold text-slate-900">0.316 kWh/kVA</span>
                      <span className="text-[10px] text-slate-400 font-sans block pt-0.5">单台产品碳排: 0.166 tCO2</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-xs text-slate-500 font-sans block">新变特高压部</span>
                      <span className="text-lg font-bold text-slate-900">0.308 kWh/kVA</span>
                      <span className="text-[10px] text-slate-400 font-sans block pt-0.5">单台产品碳排: 0.175 tCO2</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: 纵向对比 */}
              {benchmarkTab === 'vertical' && (
                <div className="space-y-2 text-xs font-sans">
                  <div className="flex justify-between items-center text-slate-500">
                    <span>该企业自身历史三年各周期碳排放强度折线走势 (tCO2/tce)</span>
                    <span className="font-mono">基准线: 1.85 tCO2/tce</span>
                  </div>
                  <div className="h-[200px]">
                    <LineTrend
                      data={verticalHistoryData}
                      xKey="month"
                      height={200}
                      lines={[
                        { key: '实际碳排放强度', name: '实测组织碳排放强度', color: '#1677ff' },
                        { key: '行业基准线', name: '行业参考基准 (1.85)', color: '#10b981' },
                      ]}
                    />
                  </div>
                </div>
              )}

              {/* Tab 3: 基准对比与微调 */}
              {benchmarkTab === 'benchmark' && (
                <div className="space-y-3 text-xs font-sans">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">基准生成算法：</span>
                        <div className="flex items-center bg-white p-0.5 rounded border border-slate-200 text-xs">
                          <button
                            type="button"
                            onClick={() => setBenchmarkMethod('weighted')}
                            className={cn('px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer', benchmarkMethod === 'weighted' ? 'bg-blue-50 text-[#1677ff] font-bold' : 'text-slate-600')}
                          >
                            加权平均法 (近6月订单量加权)
                          </button>
                          <button
                            type="button"
                            onClick={() => setBenchmarkMethod('average')}
                            className={cn('px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer', benchmarkMethod === 'average' ? 'bg-blue-50 text-[#1677ff] font-bold' : 'text-slate-600')}
                          >
                            简单算术平均法
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-700">人工微调输入：</span>
                        <input
                          type="text"
                          value={manualAdjustment}
                          onChange={(e) => setManualAdjustment(e.target.value)}
                          placeholder="±0.00"
                          className="w-20 px-2 py-0.5 bg-white border border-slate-300 rounded font-mono text-center font-bold text-blue-700 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => alert(`已成功应用基准微调参数 【${manualAdjustment}】 到系统核算引擎！`)}
                          className="px-2.5 py-0.5 rounded bg-slate-800 text-white font-medium hover:bg-slate-700 cursor-pointer"
                        >
                          应用微调
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 font-mono text-xs pt-1">
                      <div>系统计算基准值: <strong>1.86 tCO2/tce</strong></div>
                      <div>微调后目标基准值: <strong className="text-blue-700">{(1.86 + (Number(manualAdjustment) || 0)).toFixed(2)} tCO2/tce</strong></div>
                      <div>数据源跨度: <strong>2026-02 ~ 2026-07 历史订单数据</strong></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 边界清晰化注脚说明 (红线规范要求) */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-[11.5px] text-slate-500 font-sans space-y-1">
              <div className="font-bold text-slate-700 flex items-center gap-1">
                <Info className="size-3.5 text-slate-400" />
                核算边界清晰化说明：
              </div>
              <div className="pl-4 text-slate-400 space-y-0.5">
                <div>1. 本监测报表严格仅统计组织法人边界内的直接能源燃烧（范围一）与外购电力/蒸汽间接排放（范围二）。</div>
                <div>2. 露娜公司外购液氮仅折标煤计入综合能耗结构，<strong className="text-slate-600">严禁且不计入温室气体碳排放总量</strong>。</div>
                <div>3. 本模块不含原材料上游供应链碳盘查，不含产品生命周期全阶段碳足迹（LCA）。</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
