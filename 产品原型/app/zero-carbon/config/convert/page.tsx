'use client'

import React, { useState, useMemo } from 'react'
import {
  Zap,
  Flame,
  Droplets,
  Wind,
  Layers,
  ArrowRightLeft,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Info,
  BookOpen,
  Fuel,
  Atom,
  CheckCircle2,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// 能源介质标准配置接口
interface EnergyMedium {
  id: string
  name: string
  category: 'fossil' | 'power' | 'heat' | 'gas' | 'water'
  categoryName: string
  unit: string
  icon: any
  heatValMJ: number // 低位发热量 (MJ/标准物理单位)
  tceEquiv: number // 当量折标系数 (kgce/单位)
  tceEqual?: number // 等价值折标系数 (kgce/单位，如电力)
  co2Factor: number // 碳排放因子 (kgCO2/单位)
  standardRef: string // 国家标准出处
  desc: string // 典型工业应用场景
}

// GB/T 2589-2020 标准能源介质数据库
const ENERGY_DATABASE: EnergyMedium[] = [
  {
    id: 'elec_grid',
    name: '电网电力 (市电)',
    category: 'power',
    categoryName: '二次电力',
    unit: 'kWh',
    icon: Zap,
    heatValMJ: 3.6000,
    tceEquiv: 0.1229,
    tceEqual: 0.3150,
    co2Factor: 0.5703,
    standardRef: 'GB/T 2589-2020 (当量) / 全国电网平均',
    desc: '全厂动力用电、变压器温升试验、电缆挤出机驱动',
  },
  {
    id: 'gas_natural',
    name: '管道天然气',
    category: 'fossil',
    categoryName: '化石燃料',
    unit: 'm³',
    icon: Flame,
    heatValMJ: 38.9310,
    tceEquiv: 1.3300,
    co2Factor: 2.1622,
    standardRef: 'GB/T 2589-2020 附录 A',
    desc: '变压器真空干燥窑炉供热、硅钢退火炉、冬季厂房采暖',
  },
  {
    id: 'steam_superheat',
    name: '过热工业蒸汽 (1.6MPa, 300℃)',
    category: 'heat',
    categoryName: '热力工质',
    unit: 't',
    icon: Wind,
    heatValMJ: 3050.0000,
    tceEquiv: 104.1000,
    co2Factor: 77.3000,
    standardRef: 'GB/T 2589-2020 焓值法测算',
    desc: '集中供热蒸汽管网入口主管、重型绝缘件固化',
  },
  {
    id: 'steam_saturated',
    name: '饱和工业蒸汽 (0.8~1.0MPa)',
    category: 'heat',
    categoryName: '热力工质',
    unit: 't',
    icon: Wind,
    heatValMJ: 2756.7000,
    tceEquiv: 94.1000,
    co2Factor: 65.2000,
    standardRef: 'GB/T 2589-2020 饱和蒸汽表',
    desc: '变压器绝缘纸板热压、和新套管卷制干燥罐',
  },
  {
    id: 'diesel_light',
    name: '轻柴油 (生产动力)',
    category: 'fossil',
    categoryName: '化石燃料',
    unit: 'kg',
    icon: Fuel,
    heatValMJ: 42.6520,
    tceEquiv: 1.4571,
    co2Factor: 3.1000,
    standardRef: 'GB/T 2589-2020 表 A.1',
    desc: '厂区重载物流叉车、应急备用柴油发电机组',
  },
  {
    id: 'gasoline',
    name: '车用汽油',
    category: 'fossil',
    categoryName: '化石燃料',
    unit: 'kg',
    icon: Fuel,
    heatValMJ: 43.0700,
    tceEquiv: 1.4714,
    co2Factor: 2.9250,
    standardRef: 'GB/T 2589-2020 表 A.1',
    desc: '厂区巡检车辆、高压试验工程抢修车',
  },
  {
    id: 'coal_raw',
    name: '动力原煤 / 烟煤',
    category: 'fossil',
    categoryName: '化石燃料',
    unit: 'kg',
    icon: Layers,
    heatValMJ: 20.9080,
    tceEquiv: 0.7143,
    co2Factor: 1.9000,
    standardRef: 'GB/T 2589-2020 表 A.1',
    desc: '自备热电厂动力锅炉燃烧用煤',
  },
  {
    id: 'water_industrial',
    name: '工业新鲜自来水',
    category: 'water',
    categoryName: '耗能工质',
    unit: 't',
    icon: Droplets,
    heatValMJ: 2.5100,
    tceEquiv: 0.0857,
    co2Factor: 0.1680,
    standardRef: '地方耗能工质折标通则',
    desc: '变压器水喷雾冷却循环补水、电缆交联冷却水套',
  },
  {
    id: 'water_softened',
    name: '工业软化脱盐纯水',
    category: 'water',
    categoryName: '耗能工质',
    unit: 't',
    icon: Droplets,
    heatValMJ: 14.2300,
    tceEquiv: 0.4857,
    co2Factor: 0.9520,
    standardRef: '高纯水制备折标标准',
    desc: '变压器绝缘油测试清洗、高压试验纯水冷却系统',
  },
  {
    id: 'air_compressed',
    name: '压缩空气 (0.8MPa)',
    category: 'gas',
    categoryName: '动力气体',
    unit: 'm³',
    icon: Wind,
    heatValMJ: 1.1700,
    tceEquiv: 0.0400,
    co2Factor: 0.0230,
    standardRef: '机械工业能耗统计通则',
    desc: '气动工装夹具、开关柜钣金气动冲压、喷涂除尘',
  },
  {
    id: 'gas_hydrogen',
    name: '高纯氢气 (99.999%)',
    category: 'gas',
    categoryName: '工业气体',
    unit: 'm³',
    icon: Atom,
    heatValMJ: 12.7400,
    tceEquiv: 0.4350,
    co2Factor: 0.0000,
    standardRef: '工业气体折标技术规程',
    desc: '新能源制氢储能研发测试、电子级保护气',
  },
  {
    id: 'gas_nitrogen',
    name: '高纯氮气 (N₂)',
    category: 'gas',
    categoryName: '工业气体',
    unit: 'm³',
    icon: Atom,
    heatValMJ: 1.9000,
    tceEquiv: 0.0650,
    co2Factor: 0.0284,
    standardRef: '空分气体工质折标规范',
    desc: '特高压变压器油箱充氮绝缘、防潮密封保护',
  },
]

export default function ConvertPage() {
  // -------------------------------------------------------------
  // 单介质智能换算器状态
  // -------------------------------------------------------------
  const [selectedMediumId, setSelectedMediumId] = useState('elec_grid')
  const [inputVal, setInputVal] = useState<number>(10000)
  const [powerMode, setPowerMode] = useState<'equiv' | 'equal'>('equiv') // 电力当量值 vs 等价值
  const [copied, setCopied] = useState(false)

  const curMedium = useMemo(() => {
    return ENERGY_DATABASE.find((m) => m.id === selectedMediumId) || ENERGY_DATABASE[0]
  }, [selectedMediumId])

  // 计算当前单介质换算结果
  const singleCalc = useMemo(() => {
    const val = Number(inputVal) || 0
    let coeffTce = curMedium.tceEquiv
    if (curMedium.id === 'elec_grid' && powerMode === 'equal') {
      coeffTce = curMedium.tceEqual || 0.3150
    }

    const tceVal = (val * coeffTce) / 1000
    const kgceVal = val * coeffTce
    const heatMJ = val * curMedium.heatValMJ
    const heatGJ = heatMJ / 1000
    const heatKcal = heatMJ * 238.8459 // 1 MJ = 238.8459 kcal
    const co2Kg = val * curMedium.co2Factor
    const co2Ton = co2Kg / 1000

    return {
      tceVal: tceVal.toFixed(4),
      kgceVal: kgceVal.toFixed(2),
      heatMJ: heatMJ.toFixed(2),
      heatGJ: heatGJ.toFixed(4),
      heatKcal: heatKcal.toFixed(0),
      co2Kg: co2Kg.toFixed(2),
      co2Ton: co2Ton.toFixed(4),
      usedCoeff: coeffTce,
    }
  }, [curMedium, inputVal, powerMode])

  // 复制结果
  const handleCopyResult = () => {
    const text = `【特变电工能碳平台·能源折标换算结果】\n输入能源：${inputVal.toLocaleString()} ${curMedium.unit} ${curMedium.name}\n折标准煤：${singleCalc.tceVal} tce (${singleCalc.kgceVal} kgce)\n等效热值：${singleCalc.heatGJ} GJ (${singleCalc.heatMJ} MJ)\n等效碳排：${singleCalc.co2Ton} tCO2 (${singleCalc.co2Kg} kgCO2)\n采用依据：${curMedium.standardRef}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-3.5 font-sans text-foreground">
      {/* 顶部 Header */}
      <div className="bg-card p-3.5 rounded-xl border border-border shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0">
            <ArrowRightLeft className="size-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">折标煤系数与能源转换工具</h1>
            <p className="text-xs text-muted-foreground font-sans">
              维护 GB/T 2589-2020 现行国家标准及各能源介质折标煤系数（当量/等价值），提供多物理单位与碳排放实时换算工具
            </p>
          </div>
        </div>
      </div>

      {/* 🌟 2. 核心主控制区：智能换算器 */}
      <div className="bg-card rounded-xl border border-border shadow-xs p-4.5 space-y-4">
        
        {/* 介质选择 Pills */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Layers className="size-3.5 text-primary" />
              <span>选择待转换能源介质：</span>
            </label>
            <span className="text-[11px] text-muted-foreground font-mono">
              特变电工（电装集团）能效折算中枢
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {ENERGY_DATABASE.map((m) => {
              const IconComponent = m.icon
              const isSelected = m.id === selectedMediumId
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMediumId(m.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all cursor-pointer',
                    isSelected
                      ? 'border-primary bg-primary/20 text-primary font-bold shadow-2xs'
                      : 'border-border bg-panel hover:bg-accent/40 text-muted-foreground hover:text-foreground'
                  )}
                >
                  <IconComponent className="size-3.5" />
                  <span>{m.name}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">({m.unit})</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Bento Grid 双栏主换算区 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* 左栏: 输入控制面板 (col-span-5) */}
          <div className="lg:col-span-5 bg-panel p-4 rounded-xl border border-border space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <ArrowRightLeft className="size-4 text-primary" />
                  <span>输入实物用能量</span>
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-primary/20 text-primary font-mono font-semibold border border-primary/30">
                  {curMedium.categoryName}
                </span>
              </div>

              {/* 数值输入 */}
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">实物数量 ({curMedium.unit})：</label>
                <div className="relative">
                  <input
                    type="number"
                    value={inputVal}
                    onChange={(e) => setInputVal(Number(e.target.value))}
                    className="w-full pl-3 pr-16 py-2 bg-card border border-border rounded-lg text-lg font-bold font-mono text-foreground focus:outline-none focus:border-primary"
                    placeholder="请输入实物量..."
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold font-mono text-muted-foreground">
                    {curMedium.unit}
                  </span>
                </div>
              </div>

              {/* 快捷步进按钮 */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-muted-foreground text-[11px] font-sans">快捷填报:</span>
                <button
                  onClick={() => setInputVal((prev) => (prev || 0) + 1000)}
                  className="px-2 py-1 bg-card border border-border rounded hover:bg-accent/40 text-foreground cursor-pointer"
                >
                  +1,000
                </button>
                <button
                  onClick={() => setInputVal((prev) => (prev || 0) + 10000)}
                  className="px-2 py-1 bg-card border border-border rounded hover:bg-accent/40 text-foreground cursor-pointer"
                >
                  +10,000
                </button>
                <button
                  onClick={() => setInputVal((prev) => (prev || 0) * 10)}
                  className="px-2 py-1 bg-card border border-border rounded hover:bg-accent/40 text-foreground cursor-pointer"
                >
                  ×10
                </button>
                <button
                  onClick={() => setInputVal(1000)}
                  className="p-1 text-muted-foreground hover:text-foreground ml-auto cursor-pointer"
                  title="重置为 1000"
                >
                  <RotateCcw className="size-3.5" />
                </button>
              </div>

              {/* 电力特殊口径切换 */}
              {curMedium.id === 'elec_grid' && (
                <div className="p-2.5 rounded-lg bg-card border border-border text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-foreground">
                    <span>⚡ 电力折标口径选择：</span>
                    <span className="text-[10.5px] font-mono text-primary font-normal">
                      {powerMode === 'equiv' ? '0.1229 kgce/kWh' : '0.3150 kgce/kWh'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPowerMode('equiv')}
                      className={cn(
                        'py-1 rounded text-xs transition-colors font-semibold cursor-pointer',
                        powerMode === 'equiv'
                              ? 'bg-primary text-primary-foreground shadow-2xs'
                              : 'bg-panel text-muted-foreground hover:text-foreground border border-border'
                      )}
                    >
                      当量值 (热值口径)
                    </button>
                    <button
                      onClick={() => setPowerMode('equal')}
                      className={cn(
                        'py-1 rounded text-xs transition-colors font-semibold cursor-pointer',
                        powerMode === 'equal'
                              ? 'bg-primary text-primary-foreground shadow-2xs'
                              : 'bg-panel text-muted-foreground hover:text-foreground border border-border'
                      )}
                    >
                      等价值 (供电煤耗)
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="text-[11px] text-muted-foreground pt-2 border-t border-border">
              <span>典型场景：{curMedium.desc}</span>
            </div>
          </div>

          {/* 右栏: 3 大核心能量/碳排数显看板 (col-span-7) */}
          <div className="lg:col-span-7 bg-panel p-4 rounded-xl border border-border space-y-3.5 flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-foreground">
                  换算结果多维数显看板 · 实时动态核算
                </span>
              </div>
              <button
                onClick={handleCopyResult}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-semibold cursor-pointer transition-colors"
              >
                {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                <span>{copied ? '已复制换算结果' : '一键复制结果'}</span>
              </button>
            </div>

            {/* 3 大核心 Bento 卡片 (3列并排平铺) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* 卡片 1: 标煤 */}
              <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 space-y-1.5">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Flame className="size-3.5 text-amber-400" />
                  综合折标煤 (tce)
                </span>
                <div className="text-2xl font-black font-mono text-amber-400 tracking-tight">
                  {singleCalc.tceVal} <span className="text-xs font-sans font-normal text-muted-foreground">tce</span>
                </div>
                <div className="text-[11px] font-mono text-amber-400/80 pt-1 border-t border-amber-500/20">
                  折合：{Number(singleCalc.kgceVal).toLocaleString()} kgce
                </div>
              </div>

              {/* 卡片 2: 热值 */}
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 space-y-1.5">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                  <Sparkles className="size-3.5 text-rose-400" />
                  等效低位热值 (GJ)
                </span>
                <div className="text-2xl font-black font-mono text-rose-400 tracking-tight">
                  {singleCalc.heatGJ} <span className="text-xs font-sans font-normal text-muted-foreground">GJ</span>
                </div>
                <div className="text-[11px] font-mono text-rose-400/80 pt-1 border-t border-rose-500/20">
                  折合：{Number(singleCalc.heatMJ).toLocaleString()} MJ
                </div>
              </div>

              {/* 卡片 3: 碳排 */}
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 space-y-1.5">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <Atom className="size-3.5 text-emerald-400" />
                  等效碳排放 (tCO2)
                </span>
                <div className="text-2xl font-black font-mono text-emerald-400 tracking-tight">
                  {singleCalc.co2Ton} <span className="text-xs font-sans font-normal text-muted-foreground">tCO2</span>
                </div>
                <div className="text-[11px] font-mono text-emerald-400/80 pt-1 border-t border-emerald-500/20">
                  折合：{Number(singleCalc.co2Kg).toLocaleString()} kgCO2
                </div>
              </div>
            </div>

            {/* 动态公式推导面板 */}
            <div className="p-3 rounded-lg bg-card border border-border font-mono text-xs text-foreground space-y-1.5">
              <div className="font-sans font-bold text-foreground text-[11.5px] flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Info className="size-3.5 text-primary" />
                  <span>数学推导过程与标准溯源：</span>
                </div>
                <span className="text-[10.5px] font-sans font-normal text-muted-foreground">
                  依据：{curMedium.standardRef}
                </span>
              </div>
              <div className="text-[11px] text-muted-foreground bg-panel p-2 rounded border border-border space-y-1">
                <div>
                  <strong className="text-foreground">折标公式：</strong>{inputVal.toLocaleString()} {curMedium.unit} × {singleCalc.usedCoeff} kgce/{curMedium.unit} ÷ 1,000 = <span className="text-amber-400 font-bold">{singleCalc.tceVal} tce</span>
                </div>
                <div>
                  <strong className="text-foreground">碳排公式：</strong>{inputVal.toLocaleString()} {curMedium.unit} × {curMedium.co2Factor} kgCO2/{curMedium.unit} ÷ 1,000 = <span className="text-emerald-400 font-bold">{singleCalc.co2Ton} tCO2</span>
                </div>
                <div>
                  <strong className="text-foreground">热值公式：</strong>{inputVal.toLocaleString()} {curMedium.unit} × {curMedium.heatValMJ} MJ/{curMedium.unit} ÷ 1,000 = <span className="text-rose-400 font-bold">{singleCalc.heatGJ} GJ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
