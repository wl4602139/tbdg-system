'use client'

import React, { useState, useMemo } from 'react'
import {
  PieChart,
  Calendar,
  Download,
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
  Percent,
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { LineTrend } from '@/components/shared/charts'
import { cn } from '@/lib/utils'

// 1. 各三级工厂用能结构基础数据字典 (电·天然气·外购蒸汽·用油·液氮·碳汇)
interface FactoryEnergyStructureData {
  id: string
  name: string
  parentCompany: string
  province: string
  gridFactor: number // 分省电力排放因子 (tCO2/MWh)
  hasLiquidNitrogen: boolean // 是否有液氮项 (仅露娜公司)
  gridElecKWh: number // 常规外购电 (kWh)
  greenElecKWh: number // 物理认定绿电 (kWh)
  gasM3: number // 天然气 (m³)
  steamT: number // 外购蒸汽/热力 (吨, 仅统计外购)
  oilL: number // 公务车用油 (升)
  nitrogenT?: number // 外购液氮 (吨, 仅露娜)
  treeCount: number // 碳汇树木 (株)
  treeType: string
  solarSelfKWh: number // 光伏自用
  cleanOutputKWh: number // 外送清洁电
}

const FACTORY_ENERGY_MAP: Record<string, FactoryEnergyStructureData> = {
  ws_sb_main: {
    id: 'ws_sb_main',
    name: '沈变本部 (超高压制造基地)',
    parentCompany: '沈变公司',
    province: '辽宁省 (东北电网)',
    gridFactor: 0.5703,
    hasLiquidNitrogen: false,
    gridElecKWh: 5200000,
    greenElecKWh: 3250000,
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
    hasLiquidNitrogen: true, // 🌟 仅露娜公司涉及外购液氮
    gridElecKWh: 3220000,
    greenElecKWh: 1980000,
    gasM3: 180000,
    steamT: 1850,
    oilL: 8200,
    nitrogenT: 45.0, // 45吨外购液氮
    treeCount: 1800,
    treeType: '侧柏 (0.022 tCO2/株/年)',
    solarSelfKWh: 1980000,
    cleanOutputKWh: 280000,
  },
  ws_hb_main: {
    id: 'ws_hb_main',
    name: '衡变本部 (南方特高压基地)',
    parentCompany: '衡变公司',
    province: '湖南省 (华中电网)',
    gridFactor: 0.5271,
    hasLiquidNitrogen: false,
    gridElecKWh: 4910000,
    greenElecKWh: 2890000,
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
    gridElecKWh: 5100000,
    greenElecKWh: 4100000,
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
    gridElecKWh: 4700000,
    greenElecKWh: 2100000,
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
    gridElecKWh: 3100000,
    greenElecKWh: 1800000,
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
    gridElecKWh: 2800000,
    greenElecKWh: 1500000,
    gasM3: 120000,
    steamT: 1500,
    oilL: 6200,
    treeCount: 1600,
    treeType: '银杏 (0.022 tCO2/株/年)',
    solarSelfKWh: 1500000,
    cleanOutputKWh: 210000,
  },
}

// 集团直属公司能源结构横向对比清单
const GROUP_COMPANIES_ENERGY_LIST = [
  { id: 'ws_sb_main', name: '沈变公司', totalTce: 31200, elecRatio: 66.8, greenRatio: 38.5, gasRatio: 18.2, steamRatio: 11.5, oilRatio: 3.5, nitrogenRatio: 0, intensity: 1.87, nonFossilRatio: 41.2 },
  { id: 'ws_xb_uhv', name: '新变厂', totalTce: 33400, elecRatio: 68.2, greenRatio: 44.6, gasRatio: 17.5, steamRatio: 10.8, oilRatio: 3.5, nitrogenRatio: 0, intensity: 1.87, nonFossilRatio: 44.5 },
  { id: 'ws_hb_main', name: '衡变公司', totalTce: 28100, elecRatio: 65.4, greenRatio: 37.1, gasRatio: 19.1, steamRatio: 12.0, oilRatio: 3.5, nitrogenRatio: 0, intensity: 1.86, nonFossilRatio: 43.8 },
  { id: 'ws_ll_main', name: '鲁缆公司', totalTce: 24800, elecRatio: 69.5, greenRatio: 30.9, gasRatio: 16.8, steamRatio: 10.2, oilRatio: 3.5, nitrogenRatio: 0, intensity: 1.89, nonFossilRatio: 38.5 },
  { id: 'ws_sb_luna', name: '露娜公司', totalTce: 18600, elecRatio: 62.1, greenRatio: 38.1, gasRatio: 17.2, steamRatio: 9.8, oilRatio: 3.2, nitrogenRatio: 7.7, intensity: 1.84, nonFossilRatio: 48.2 },
  { id: 'ws_xl_main', name: '新缆厂', totalTce: 15200, elecRatio: 68.0, greenRatio: 36.7, gasRatio: 18.0, steamRatio: 10.5, oilRatio: 3.5, nitrogenRatio: 0, intensity: 1.87, nonFossilRatio: 42.0 },
  { id: 'ws_dl_main', name: '德缆公司', totalTce: 8440, elecRatio: 72.0, greenRatio: 34.9, gasRatio: 14.5, steamRatio: 9.5, oilRatio: 4.0, nitrogenRatio: 0, intensity: 1.81, nonFossilRatio: 52.4 },
]

export default function EnergyStructurePage() {
  // 左侧组织拓扑树节点状态
  const [selectedOrgNode, setSelectedOrgNode] = useState<StandardOrgNode>({
    id: 'ent_root',
    name: '特变电工集团 (全景汇总)',
    fullName: '特变电工集团 (全景汇总)',
    level: 'group',
    badge: '全集团',
  })

  // 层级模式：'group' (集团总览看板) | 'unit' (三级工厂填报与明细)
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
  const activeFactory = FACTORY_ENERGY_MAP[selectedUnitKey] || FACTORY_ENERGY_MAP.ws_sb_main

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

    let targetKey = 'ws_sb_main'
    if (FACTORY_ENERGY_MAP[node.id]) {
      targetKey = node.id
    } else {
      const foundKey = Object.keys(FACTORY_ENERGY_MAP).find(
        (k) =>
          node.id.toLowerCase().includes(k.replace('ws_', '')) ||
          node.name.includes(FACTORY_ENERGY_MAP[k].parentCompany) ||
          node.name.includes(FACTORY_ENERGY_MAP[k].name.slice(0, 2))
      )
      if (foundKey) targetKey = foundKey
    }

    setSelectedUnitKey(targetKey)
    const f = FACTORY_ENERGY_MAP[targetKey] || FACTORY_ENERGY_MAP.ws_sb_main
    setOilInput(f.oilL)
    setNitrogenInput(f.nitrogenT || 45.0)
    setTreeCountInput(f.treeCount)
    setTreeTypeInput(f.treeType)
    setSavedSuccess(false)
  }

  // 1. 实时精准折标煤与碳排放核算算法 (严格符合会议纪要)
  // 标煤系数: 电 0.1229 kgce/kWh, 天然气 1.2143 kgce/m³, 蒸汽 0.0943 kgce/kg, 汽油 1.4714 kgce/kg (约 1.09 kgce/L), 液氮 0.6600 kgce/kg
  const calculations = useMemo(() => {
    const totalElecKWh = activeFactory.gridElecKWh + activeFactory.greenElecKWh
    const gridElecTce = (activeFactory.gridElecKWh * 0.1229) / 1000
    const greenElecTce = (activeFactory.greenElecKWh * 0.1229) / 1000
    const elecTce = gridElecTce + greenElecTce
    const gasTce = (activeFactory.gasM3 * 1.2143) / 1000
    const steamTce = activeFactory.steamT * 0.0943
    const oilTce = (oilInput * 1.09) / 1000
    const nitrogenTce = activeFactory.hasLiquidNitrogen ? (nitrogenInput * 0.66) : 0
    const totalTce = elecTce + gasTce + steamTce + oilTce + nitrogenTce

    // 各能源占比 (按折标煤)
    const gridElecRatio = Number(((gridElecTce / totalTce) * 100).toFixed(1))
    const greenElecRatio = Number(((greenElecTce / totalTce) * 100).toFixed(1))
    const elecRatio = Number(((elecTce / totalTce) * 100).toFixed(1))
    const gasRatio = Number(((gasTce / totalTce) * 100).toFixed(1))
    const steamRatio = Number(((steamTce / totalTce) * 100).toFixed(1))
    const oilRatio = Number(((oilTce / totalTce) * 100).toFixed(1))
    const nitrogenRatio = activeFactory.hasLiquidNitrogen ? Number(((nitrogenTce / totalTce) * 100).toFixed(1)) : 0

    // 绿电与非化石占比
    const physicalGreenRatio = Number(((activeFactory.greenElecKWh / totalElecKWh) * 100).toFixed(1))
    const nonFossilRatio = Number(((greenElecTce / totalTce) * 100).toFixed(1))

    // 碳排放核算 (tCO2)
    const elecCarbon = (activeFactory.gridElecKWh / 1000) * activeFactory.gridFactor
    const gasCarbon = (activeFactory.gasM3 / 10000) * 21.62
    const steamCarbon = activeFactory.steamT * 0.11
    const oilCarbon = oilInput * 0.0023
    // 🌟 会议拍板：液氮不计入碳排放！
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
      totalElecKWh,
      gridElecTce,
      greenElecTce,
      elecTce,
      gasTce,
      steamTce,
      oilTce,
      nitrogenTce,
      totalTce,
      gridElecRatio,
      greenElecRatio,
      elecRatio,
      gasRatio,
      steamRatio,
      oilRatio,
      nitrogenRatio,
      physicalGreenRatio,
      nonFossilRatio,
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

  // 纵向历史走势数据
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
    <div className="flex gap-3.5 items-start font-sans text-slate-800">
      {/* 🌟 左侧 270px 经典工业级企业组织拓扑树 (从最顶端对齐) */}
      <StandardOrgTree
        selectedId={selectedOrgNode.id}
        onSelect={handleSelectTreeNode}
      />

      {/* 🌟 右侧主面板 */}
      <div className="flex-1 min-w-0 flex flex-col gap-3.5">
        {/* 1. 顶部 Header 与 统一标准时间筛选 */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
              <PieChart className="size-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800">用能结构分析</h1>
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
              onClick={() => alert('已成功导出【用能结构与碳排放基础数据报表】(Excel)...')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
            >
              <FileSpreadsheet className="size-3.5" />
              <span>导出基础报表 (Excel)</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🌟 1. 集团 / 二级公司层级（总览看板）                                         */}
        {/* ========================================================================= */}
        {levelView === 'group' && (
          <div className="space-y-3.5">
            {/* 顶部 11 项核心指标总量卡片 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Building2 className="size-3.5 text-blue-600" />
                  【{selectedOrgNode.name}】11 项核心用能与碳排放总量指标看板
                </span>
                <span>点击卡片可穿透查看各下属公司明细</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 font-mono">
                {[
                  { title: '非化石能源占比', value: '42.6%', unit: '', note: '绿电 + 自发清洁', tone: 'emerald' },
                  { title: '物理认定绿电占比', value: '38.2%', unit: '', note: '电网实际消纳', tone: 'emerald' },
                  { title: '综合用能总量', value: '151,340', unit: 'tce', note: '同比 -1.8% ↓', tone: 'slate' },
                  { title: '碳排放总量', value: '284,520', unit: 'tCO2', note: '基于分省因子', tone: 'blue' },
                  { title: '净碳排放量', value: '242,160', unit: 'tCO2', note: '扣除碳抵销后', tone: 'emerald' },
                  { title: '综合碳排放强度', value: '1.88', unit: 'tCO2/tce', note: '总碳排 ÷ 总用能', tone: 'slate' },
                  { title: '外购常规电量', value: '52,000', unit: '万kWh', note: '占总电量 61.8%', tone: 'blue' },
                  { title: '物理认定绿电量', value: '32,200', unit: '万kWh', note: '占总电量 38.2%', tone: 'emerald' },
                  { title: '天然气消耗量', value: '3,450', unit: '万m³', note: '折标 41,893 tce', tone: 'amber' },
                  { title: '外购蒸汽/热力', value: '42,800', unit: 't', note: '仅外购量，自产已剔除', tone: 'purple' },
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

            {/* 中部：各公司能源结构横向对比 (归一化堆叠条形图) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-blue-600" />
                  <h3 className="text-xs font-bold text-slate-900">
                    全集团各直属公司用能结构横向对比 (按折标煤归一化占比)
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
                  <span className="flex items-center gap-1"><span className="size-2.5 rounded-sm bg-[#1677ff]" /> 常规电</span>
                  <span className="flex items-center gap-1"><span className="size-2.5 rounded-sm bg-emerald-500" /> 物理绿电</span>
                  <span className="flex items-center gap-1"><span className="size-2.5 rounded-sm bg-amber-500" /> 天然气</span>
                  <span className="flex items-center gap-1"><span className="size-2.5 rounded-sm bg-purple-500" /> 外购蒸汽</span>
                  <span className="flex items-center gap-1"><span className="size-2.5 rounded-sm bg-slate-600" /> 公务用油</span>
                  <span className="flex items-center gap-1"><span className="size-2.5 rounded-sm bg-cyan-500" /> 液氮</span>
                </div>
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                {GROUP_COMPANIES_ENERGY_LIST.map((comp) => (
                  <div key={comp.id} className="space-y-1">
                    <div className="flex justify-between items-center text-slate-700">
                      <span className="font-sans font-bold flex items-center gap-1.5">
                        <Factory className="size-3.5 text-[#1677ff]" />
                        {comp.name}
                      </span>
                      <span>总折标: {comp.totalTce.toLocaleString()} tce · 非化石占比: <strong className="text-emerald-700">{comp.nonFossilRatio}%</strong></span>
                    </div>

                    <div className="h-5 w-full rounded-md overflow-hidden flex bg-slate-100 shadow-inner">
                      <div style={{ width: `${comp.elecRatio - comp.greenRatio * 0.4}%` }} className="bg-[#1677ff] h-full" title={`常规电: ${(comp.elecRatio - comp.greenRatio * 0.4).toFixed(1)}%`} />
                      <div style={{ width: `${comp.greenRatio * 0.4}%` }} className="bg-emerald-500 h-full" title={`物理绿电: ${(comp.greenRatio * 0.4).toFixed(1)}%`} />
                      <div style={{ width: `${comp.gasRatio}%` }} className="bg-amber-500 h-full" title={`天然气: ${comp.gasRatio}%`} />
                      <div style={{ width: `${comp.steamRatio}%` }} className="bg-purple-500 h-full" title={`外购蒸汽: ${comp.steamRatio}%`} />
                      <div style={{ width: `${comp.oilRatio}%` }} className="bg-slate-600 h-full" title={`公务用油: ${comp.oilRatio}%`} />
                      {comp.nitrogenRatio > 0 && (
                        <div style={{ width: `${comp.nitrogenRatio}%` }} className="bg-cyan-500 h-full" title={`外购液氮: ${comp.nitrogenRatio}% (不计碳排)`} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 底部：直属公司能耗与碳排汇总清单 (点击行穿透至工厂明细) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between bg-slate-50/60 gap-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-800">
                    各直属单位用能构成与碳排放强度台账清单 (点击行可穿透至三级工厂填报与明细)
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">共 7 大重点制造板块 · 纯客观报表</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold font-sans">
                      <th className="py-2.5 px-3">序号</th>
                      <th className="py-2.5 px-3">直属制造单位</th>
                      <th className="py-2.5 px-3">综合用能量 (tce)</th>
                      <th className="py-2.5 px-3">电力用能占比 (%)</th>
                      <th className="py-2.5 px-3">物理认定绿电占比 (%)</th>
                      <th className="py-2.5 px-3">天然气占比 (%)</th>
                      <th className="py-2.5 px-3">外购蒸汽占比 (%)</th>
                      <th className="py-2.5 px-3">碳排放强度 (tCO2/tce)</th>
                      <th className="py-2.5 px-3 text-right">穿透操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {GROUP_COMPANIES_ENERGY_LIST.map((row, idx) => (
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
                        <td className="py-2.5 px-3 font-bold text-slate-900">{row.totalTce.toLocaleString()}</td>
                        <td className="py-2.5 px-3">{row.elecRatio}%</td>
                        <td className="py-2.5 px-3 text-emerald-700 font-bold">{row.greenRatio}%</td>
                        <td className="py-2.5 px-3 text-amber-700">{row.gasRatio}%</td>
                        <td className="py-2.5 px-3 text-purple-700">{row.steamRatio}%</td>
                        <td className="py-2.5 px-3 font-bold text-slate-800">{row.intensity}</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="text-xs text-[#1677ff] font-semibold hover:underline flex items-center justify-end gap-0.5">
                            进入明细填报 <ChevronRight className="size-3" />
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
        {/* 🌟 2. 三级单位 / 工厂层级（明细填报与监测页，5 大核心区域）                  */}
        {/* ========================================================================= */}
        {levelView === 'unit' && (
          <div className="space-y-3.5">
            {/* 状态指示条 */}
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

            {/* 核心板块 1 & 2: 区域一 数据录入区 (左) 与 区域二 能源结构监测区 (右) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
              {/* 区域一：数据录入区 (手动兜底，做减法) - 占 7 列 */}
              <div className="lg:col-span-7 bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-blue-600" />
                    <h3 className="text-xs font-bold text-slate-900">
                      区域一：数据录入区 (自动采集灰显锁定 + 手动兜底录入)
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-sans">
                    电/气/蒸汽自动直采 · 油/液氮/碳汇手动补充
                  </span>
                </div>

                <form onSubmit={handleSaveData} className="space-y-3 text-xs font-sans">
                  {/* 自动采集只读展示行 */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 font-mono">
                    <div>
                      <span className="text-[10.5px] text-slate-500 font-sans block truncate">常规外购电 (自动)</span>
                      <span className="text-xs font-bold text-slate-900">{activeFactory.gridElecKWh.toLocaleString()}</span>
                      <span className="text-[9.5px] text-slate-400 font-sans block">kWh</span>
                    </div>
                    <div>
                      <span className="text-[10.5px] text-emerald-700 font-sans font-bold block truncate">物理认定绿电 (自动)</span>
                      <span className="text-xs font-bold text-emerald-700">{activeFactory.greenElecKWh.toLocaleString()}</span>
                      <span className="text-[9.5px] text-emerald-600/70 font-sans block">kWh (核销非化石)</span>
                    </div>
                    <div>
                      <span className="text-[10.5px] text-slate-500 font-sans block truncate">天然气 (自动)</span>
                      <span className="text-xs font-bold text-slate-900">{activeFactory.gasM3.toLocaleString()}</span>
                      <span className="text-[9.5px] text-slate-400 font-sans block">m³</span>
                    </div>
                    <div>
                      <span className="text-[10.5px] text-slate-500 font-sans block truncate">外购蒸汽/热力 (自动)</span>
                      <span className="text-xs font-bold text-slate-900">{activeFactory.steamT.toLocaleString()}</span>
                      <span className="text-[9.5px] text-slate-400 font-sans block">吨 (自产已剔除)</span>
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
                          折标煤: {(nitrogenInput * 0.66).toFixed(2)} tce · <span className="text-slate-400 bg-slate-100 px-1 py-0.2 rounded font-bold">不计入碳排放 (仅计能源结构)</span>
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
                      <span className="text-[10px] text-slate-400 font-mono">系统套用内置吸收系数</span>
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

              {/* 区域二：能源结构监测区 (图表极简) - 占 5 列 */}
              <div className="lg:col-span-5 bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-emerald-500" />
                      <h3 className="text-xs font-bold text-slate-900">
                        区域二：能源结构监测 (电 · 天然气 · 蒸汽/热力 · 油)
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
                          style={{ width: `${calculations.gridElecRatio}%` }}
                          className="bg-[#1677ff] h-full flex items-center justify-center text-[10px] text-white font-bold font-mono transition-all duration-300"
                          title={`常规外购电: ${calculations.gridElecRatio}% (${calculations.gridElecTce.toFixed(1)} tce)`}
                        >
                          {calculations.gridElecRatio > 12 ? `常规电 ${calculations.gridElecRatio}%` : ''}
                        </div>
                        <div
                          style={{ width: `${calculations.greenElecRatio}%` }}
                          className="bg-emerald-500 h-full flex items-center justify-center text-[10px] text-white font-bold font-mono transition-all duration-300"
                          title={`物理认定绿电: ${calculations.greenElecRatio}% (${calculations.greenElecTce.toFixed(1)} tce)`}
                        >
                          {calculations.greenElecRatio > 10 ? `绿电 ${calculations.greenElecRatio}%` : ''}
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
                        <span className="text-slate-600 font-sans">常规外购电:</span>
                        <strong>{calculations.gridElecTce.toFixed(1)} tce</strong>
                        <span className="text-slate-400">({calculations.gridElecRatio}%)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                        <span className="size-2.5 rounded-sm bg-emerald-500" />
                        <span className="font-sans">物理认定绿电:</span>
                        <strong>{calculations.greenElecTce.toFixed(1)} tce</strong>
                        <span className="text-emerald-600">({calculations.greenElecRatio}%)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="size-2.5 rounded-sm bg-amber-500" />
                        <span className="text-slate-600 font-sans">天然气:</span>
                        <strong>{calculations.gasTce.toFixed(1)} tce</strong>
                        <span className="text-slate-400">({calculations.gasRatio}%)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="size-2.5 rounded-sm bg-purple-500" />
                        <span className="text-slate-600 font-sans">外购蒸汽/热力:</span>
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

                {/* 关键标注要求 (灰字备注) */}
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 space-y-1 font-sans">
                  <div>• 蒸汽数据说明：<strong className="text-slate-700">仅统计外购量，自产燃气锅炉仅计燃气，避免重复计算。</strong></div>
                  <div>• 液氮数据说明：<strong className="text-slate-700">载能介质，计入能源结构但不计碳排放（仅露娜）。</strong></div>
                  <div>• 绿电消纳说明：<strong className="text-emerald-700">物理认定绿电，用于核算非化石能源占比。</strong></div>
                </div>
              </div>
            </div>

            {/* 区域三：碳排放核算结果区 (报表化，去评价化) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-slate-800" />
                  <h3 className="text-xs font-bold text-slate-900">
                    区域三：碳排放核算结果区 (报表化 · 纯客观数字与环比箭头 · 无定性评价)
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  公式固化：组织总碳排放量 ÷ 总tce用能量
                </span>
              </div>

              {/* 5 项指标卡片 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 font-mono">
                {/* 1. 总碳排放量 */}
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                  <span className="text-xs text-slate-600 font-sans font-medium block truncate">总碳排放量</span>
                  <div className="text-xl font-extrabold text-slate-900 flex items-center justify-between">
                    <span>{calculations.totalCarbon.toFixed(1)} <span className="text-[10px] font-normal text-slate-500 font-sans">tCO2</span></span>
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center"><ArrowDownRight className="size-3" /> 3.2%</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-sans block pt-0.5 border-t border-slate-200/60">
                    电×因子+气+汽+油
                  </span>
                </div>

                {/* 2. 碳排放强度 */}
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                  <span className="text-xs text-slate-600 font-sans font-medium block truncate">碳排放强度</span>
                  <div className="text-xl font-extrabold text-blue-700 flex items-center justify-between">
                    <span>{calculations.intensity} <span className="text-[10px] font-normal text-slate-500 font-sans">t/tce</span></span>
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center"><ArrowDownRight className="size-3" /> 1.8%</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-sans block pt-0.5 border-t border-slate-200/60">
                    总碳排 ÷ 总用能量
                  </span>
                </div>

                {/* 3. 净碳排放量 */}
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                  <span className="text-xs text-slate-600 font-sans font-medium block truncate">净碳排放量</span>
                  <div className="text-xl font-extrabold text-emerald-700 flex items-center justify-between">
                    <span>{calculations.netCarbon.toFixed(1)} <span className="text-[10px] font-normal text-slate-500 font-sans">tCO2</span></span>
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center"><ArrowDownRight className="size-3" /> 5.4%</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-sans block pt-0.5 border-t border-slate-200/60">
                    总排放 − 碳抵销量
                  </span>
                </div>

                {/* 4. 非化石能源占比 */}
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                  <span className="text-xs text-slate-600 font-sans font-medium block truncate">非化石能源占比</span>
                  <div className="text-xl font-extrabold text-emerald-700">
                    {calculations.nonFossilRatio}%
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-emerald-500 h-full" style={{ width: `${calculations.nonFossilRatio}%` }} />
                  </div>
                  <span className="text-[9.5px] text-slate-400 font-sans block pt-0.5">
                    绿电/非化石 ÷ 总能
                  </span>
                </div>

                {/* 5. 物理认定绿电占比 */}
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                  <span className="text-xs text-slate-600 font-sans font-medium block truncate">物理认定绿电占比</span>
                  <div className="text-xl font-extrabold text-blue-700">
                    {calculations.physicalGreenRatio}%
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-[#1677ff] h-full" style={{ width: `${calculations.physicalGreenRatio}%` }} />
                  </div>
                  <span className="text-[9.5px] text-slate-400 font-sans block pt-0.5">
                    绿电量 ÷ 总用电量
                  </span>
                </div>
              </div>
            </div>

            {/* 区域四：碳抵销（抵扣）明细区 (抓大放小) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-900">
                    区域四：碳抵销 (抵扣) 明细区 (可再生能源自用 + 对外输送能源 + 植树碳汇)
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  总抵扣量: <strong className="text-emerald-700">{calculations.totalOffset.toFixed(1)} tCO2</strong>
                </span>
              </div>

              {/* 3 个独立抵扣卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 font-mono">
                <div className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/30 space-y-1">
                  <span className="text-xs text-emerald-800 font-sans font-bold block">1. 可再生能源自用</span>
                  <div className="text-xl font-extrabold text-emerald-700">
                    {calculations.solarOffset.toFixed(1)} <span className="text-xs font-normal text-slate-500 font-sans">tCO2</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-sans block">光伏数据自动拉取 (自发自用 {(activeFactory.solarSelfKWh / 10000).toFixed(1)} 万kWh)</span>
                </div>

                <div className="p-3 rounded-xl border border-blue-100 bg-blue-50/30 space-y-1">
                  <span className="text-xs text-blue-800 font-sans font-bold block">2. 对外输送能源抵扣</span>
                  <div className="text-xl font-extrabold text-blue-700">
                    {calculations.outputOffset.toFixed(1)} <span className="text-xs font-normal text-slate-500 font-sans">tCO2</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-sans block">外送量 = 发电 − 自用 (外送 {(activeFactory.cleanOutputKWh / 10000).toFixed(1)} 万kWh 自动算)</span>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                  <span className="text-xs text-slate-800 font-sans font-bold block">3. 厂区植树碳汇抵扣</span>
                  <div className="text-xl font-extrabold text-slate-800">
                    {calculations.treeOffset.toFixed(1)} <span className="text-xs font-normal text-slate-500 font-sans">tCO2</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-sans block">成活 {treeCountInput} 株 {treeTypeInput.split(' ')[0]} 吸收系数自动算</span>
                </div>
              </div>

              {/* 抵扣流水明细表 */}
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
                      <td className="py-2 px-3 font-sans font-medium text-emerald-800">分布式光伏自发自用</td>
                      <td className="py-2 px-3">PV-TBEA-202608-001</td>
                      <td className="py-2 px-3">{(activeFactory.solarSelfKWh).toLocaleString()} kWh</td>
                      <td className="py-2 px-3 text-right font-bold text-emerald-700">-{calculations.solarOffset.toFixed(1)}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">2026-08-01 ~ 08-26</td>
                      <td className="py-2 px-3 font-sans font-medium text-blue-800">微电网对外清洁电输送</td>
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

            {/* 区域五：对标与基准区 (三大维度，摒弃树状图) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-blue-600" />
                  <h3 className="text-xs font-bold text-slate-900">
                    区域五：对标与基准区 (横向对比 · 纵向对比 · 基准对比与微调)
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
                    <span className="text-slate-600 font-bold">选择同类型产品大类类别进行内部单耗比较：</span>
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

            {/* 核算边界清晰化固定注脚 (灰字备注) */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-[11.5px] text-slate-500 font-sans space-y-1">
              <div className="font-bold text-slate-700 flex items-center gap-1">
                <Info className="size-3.5 text-slate-400" />
                核算边界说明：
              </div>
              <div className="pl-4 text-slate-400 space-y-0.5 leading-relaxed">
                <div>• 仅统计外购蒸汽，自产蒸汽（燃气锅炉）仅计燃气量，避免重复计算；</div>
                <div>• 外购液氮作为载能介质计入能源结构（折算标煤），但不计入碳排放（仅露娜公司）；</div>
                <div>• 本功能仅覆盖能源碳排放（组织碳），不含材料碳盘查与产品碳足迹；</div>
                <div>• 电力排放因子按省份单独维护，数据口径截止 2026-08。</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
