'use client'

import React, { useState, useMemo } from 'react'
import {
  Cpu,
  Zap,
  Flame,
  Droplets,
  Search,
  ChevronDown,
  ChevronUp,
  Layers,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  PRODUCT_MODELS_DICTIONARY,
  getModelsForSubcategory,
  type ProductModelItem,
} from '@/lib/product-models'

/**
 * 🌟 权威工业单位判定逻辑：
 * - 变压器设备（交流变压器、直流变压器、特种变压器、配变、电抗器、箱变等变压器类设备） -> 台
 * - 线缆设备（力缆、导线、布电线、特种电缆等） -> 万km·mm² (或原有 km)
 * - 套管设备 -> 支
 * - GIS / GIL -> 间隔
 * - 开关柜/控制柜/端子箱 -> 面
 */
export function getProductOutputUnit(lineName = '', subName = '', fallbackUnit = ''): string {
  const text = `${lineName} ${subName}`
  // 1. 套管类 -> 支
  if (text.includes('套管')) return '支'
  // 2. 线缆类 -> 万km·mm² (或原有 km / 万m)
  if (text.includes('电缆') || text.includes('力缆') || text.includes('导线') || text.includes('布电线') || text.includes('线缆')) {
    if (fallbackUnit && (fallbackUnit.includes('km') || fallbackUnit.includes('米') || fallbackUnit.includes('m'))) {
      return fallbackUnit
    }
    return '万km·mm²'
  }
  // 3. GIS / GIL -> 间隔
  if (text.includes('GIS') || text.includes('GIL')) return '间隔'
  // 4. 开关柜/控制柜/端子箱 -> 面 (或台)
  if (text.includes('开关柜') || text.includes('控制柜') || text.includes('端子箱') || text.includes('汇控柜')) return '面'
  // 5. 变压器设备 (包括配变、高压、超高压、特高压、电抗器、箱变、互感器等变压器类设备) -> 台
  if (
    text.includes('变压器') ||
    text.includes('高压') ||
    text.includes('超高压') ||
    text.includes('特高压') ||
    text.includes('配变') ||
    text.includes('电抗器') ||
    text.includes('箱变') ||
    text.includes('互感器')
  ) {
    return '台'
  }
  if (fallbackUnit && !fallbackUnit.includes('万kVA')) return fallbackUnit
  return '台'
}

/**
 * 线缆产线等通用型号动态衍生生成器 (当字典暂未录入该分类细分型号时，提供权威工业标准规格)
 */
function generateFallbackModelsForLine(lineName: string, subcategoryName: string): ProductModelItem[] {
  const isCable = lineName.includes('缆') || lineName.includes('导线') || subcategoryName.includes('缆') || subcategoryName.includes('导线')

  if (isCable) {
    if (lineName.includes('布电线')) {
      return [
        {
          id: 'mod-cable-bv-2.5',
          model: 'BV-2.5 mm²',
          desc: '聚氯乙烯绝缘单芯硬导体无护套电线',
          lineName,
          subcategoryName,
          capacity: '450/750V',
          voltage: '450/750V',
          unitSuffix: '万km·mm²',
          energyVal: '0.218',
          energyUnit: 'tce/万km·mm²',
          elecVal: '1,680.0',
          elecUnit: 'kWh/万km·mm²',
          yoy: '-5.2%',
          isYoyDown: true,
          tipText: '考核【BV-2.5 mm²】单卷电线生产挤塑与拉丝单耗。',
          formula: 'e = E / M',
          formulaDesc: '月度型号单耗',
          trendHistory: [],
        },
        {
          id: 'mod-cable-bv-4.0',
          model: 'BV-4.0 mm²',
          desc: '聚氯乙烯绝缘单芯铜电线',
          lineName,
          subcategoryName,
          capacity: '450/750V',
          voltage: '450/750V',
          unitSuffix: '万km·mm²',
          energyVal: '0.224',
          energyUnit: 'tce/万km·mm²',
          elecVal: '1,710.0',
          elecUnit: 'kWh/万km·mm²',
          yoy: '-5.1%',
          isYoyDown: true,
          tipText: '考核【BV-4.0 mm²】电线生产综合能耗。',
          formula: 'e = E / M',
          formulaDesc: '月度型号单耗',
          trendHistory: [],
        },
        {
          id: 'mod-cable-bvr-2.5',
          model: 'BVR-2.5 mm²',
          desc: '铜芯聚氯乙烯绝缘软电线',
          lineName,
          subcategoryName,
          capacity: '450/750V',
          voltage: '450/750V',
          unitSuffix: '万km·mm²',
          energyVal: '0.231',
          energyUnit: 'tce/万km·mm²',
          elecVal: '1,750.0',
          elecUnit: 'kWh/万km·mm²',
          yoy: '-5.0%',
          isYoyDown: true,
          tipText: '考核【BVR-2.5 mm²】生产综合能耗。',
          formula: 'e = E / M',
          formulaDesc: '月度型号单耗',
          trendHistory: [],
        },
        {
          id: 'mod-cable-wdz-2.5',
          model: 'WDZ-BYJ-2.5 mm²',
          desc: '低烟无卤阻燃交联聚烯烃绝缘电线',
          lineName,
          subcategoryName,
          capacity: '450/750V',
          voltage: '450/750V',
          unitSuffix: '万km·mm²',
          energyVal: '0.238',
          energyUnit: 'tce/万km·mm²',
          elecVal: '1,790.0',
          elecUnit: 'kWh/万km·mm²',
          yoy: '-4.9%',
          isYoyDown: true,
          tipText: '考核【WDZ-BYJ-2.5 mm²】环保电线生产综合能耗。',
          formula: 'e = E / M',
          formulaDesc: '月度型号单耗',
          trendHistory: [],
        },
      ]
    }

    if (lineName.includes('导线')) {
      return [
        {
          id: 'mod-wire-lgj-400',
          model: 'LGJ-400/35',
          desc: '钢芯铝绞线 400/35 国标输电线路架空导线',
          lineName,
          subcategoryName,
          capacity: '400/35 mm²',
          voltage: '220-500 kV',
          unitSuffix: '万km·mm²',
          energyVal: '0.192',
          energyUnit: 'tce/万km·mm²',
          elecVal: '1,480.0',
          elecUnit: 'kWh/万km·mm²',
          yoy: '-4.8%',
          isYoyDown: true,
          tipText: '考核【LGJ-400/35】架空导线生产单耗。',
          formula: 'e = E / M',
          formulaDesc: '月度型号单耗',
          trendHistory: [],
        },
        {
          id: 'mod-wire-lgj-300',
          model: 'LGJ-300/40',
          desc: '钢芯铝绞线 300/40 特高压电网重冰区导线',
          lineName,
          subcategoryName,
          capacity: '300/40 mm²',
          voltage: '220-750 kV',
          unitSuffix: '万km·mm²',
          energyVal: '0.196',
          energyUnit: 'tce/万km·mm²',
          elecVal: '1,510.0',
          elecUnit: 'kWh/万km·mm²',
          yoy: '-4.7%',
          isYoyDown: true,
          tipText: '考核【LGJ-300/40】导线生产单耗。',
          formula: 'e = E / M',
          formulaDesc: '月度型号单耗',
          trendHistory: [],
        },
        {
          id: 'mod-wire-jl-g1a',
          model: 'JL/G1A-400/35',
          desc: '圆线同心绞架空导线 高导电率节能型',
          lineName,
          subcategoryName,
          capacity: '400/35 mm²',
          voltage: '500 kV',
          unitSuffix: '万km·mm²',
          energyVal: '0.188',
          energyUnit: 'tce/万km·mm²',
          elecVal: '1,450.0',
          elecUnit: 'kWh/万km·mm²',
          yoy: '-5.1%',
          isYoyDown: true,
          tipText: '考核节能型架空导线生产单耗。',
          formula: 'e = E / M',
          formulaDesc: '月度型号单耗',
          trendHistory: [],
        },
      ]
    }

    // 中低压力缆产线
    return [
      {
        id: 'mod-cable-yjv-10kv',
        model: 'YJV-8.7/15kV 3*300',
        desc: '中压交联聚乙烯绝缘聚氯乙烯护套电力电缆',
        lineName,
        subcategoryName,
        capacity: '3*300 mm²',
        voltage: '10 kV (8.7/15kV)',
        unitSuffix: '万km·mm²',
        energyVal: '0.338',
        energyUnit: 'tce/万km·mm²',
        elecVal: '2,580.0',
        elecUnit: 'kWh/万km·mm²',
        steamVal: '3.90',
        steamUnit: 'GJ/万km·mm²',
        yoy: '-6.0%',
        isYoyDown: true,
        tipText: '考核【YJV-8.7/15kV 3*300】电缆连硫与挤包工序能耗。',
        formula: 'e = E / M',
        formulaDesc: '月度型号单耗',
        trendHistory: [],
      },
      {
        id: 'mod-cable-yjv22-35kv',
        model: 'YJV22-26/35kV 3*400',
        desc: '中高压钢带铠装交联聚乙烯电力电缆',
        lineName,
        subcategoryName,
        capacity: '3*400 mm²',
        voltage: '35 kV (26/35kV)',
        unitSuffix: '万km·mm²',
        energyVal: '0.352',
        energyUnit: 'tce/万km·mm²',
        elecVal: '2,680.0',
        elecUnit: 'kWh/万km·mm²',
        steamVal: '4.25',
        steamUnit: 'GJ/万km·mm²',
        yoy: '-6.2%',
        isYoyDown: true,
        tipText: '考核【YJV22-26/35kV 3*400】铠装电缆生产综合能耗。',
        formula: 'e = E / M',
        formulaDesc: '月度型号单耗',
        trendHistory: [],
      },
      {
        id: 'mod-cable-wdzn-1kv',
        model: 'WDZN-YJY-0.6/1kV 4*185',
        desc: '低压无卤低烟耐火电力电缆',
        lineName,
        subcategoryName,
        capacity: '4*185 mm²',
        voltage: '0.6/1 kV',
        unitSuffix: '万km·mm²',
        energyVal: '0.278',
        energyUnit: 'tce/万km·mm²',
        elecVal: '2,120.0',
        elecUnit: 'kWh/万km·mm²',
        steamVal: '2.70',
        steamUnit: 'GJ/万km·mm²',
        yoy: '-5.8%',
        isYoyDown: true,
        tipText: '考核低烟无卤耐火环保电缆生产综合能耗。',
        formula: 'e = E / M',
        formulaDesc: '月度型号单耗',
        trendHistory: [],
      },
    ]
  }

  // 变压器类默认型号
  return [
    {
      id: 'mod-trans-s11-1000',
      model: 'S11-M-1000/10',
      desc: '全密封油浸式配电变压器',
      lineName,
      subcategoryName,
      capacity: '1,000 kVA',
      voltage: '10 kV',
      unitSuffix: '台',
      energyVal: '0.252',
      energyUnit: 'tce/台',
      elecVal: '1,920.0',
      elecUnit: 'kWh/台',
      steamVal: '2.95',
      steamUnit: 'GJ/台',
      yoy: '-4.4%',
      isYoyDown: true,
      tipText: '考核统计期内【S11-M-1000/10】单台制造综合能耗。',
      formula: 'e = E / M',
      formulaDesc: '月度型号单耗',
      trendHistory: [],
    },
    {
      id: 'mod-trans-scb13-1600',
      model: 'SCB13-1600/10',
      desc: '环氧树脂浇注干式变压器',
      lineName,
      subcategoryName,
      capacity: '1,600 kVA',
      voltage: '10 kV',
      unitSuffix: '台',
      energyVal: '0.246',
      energyUnit: 'tce/台',
      elecVal: '1,890.0',
      elecUnit: 'kWh/台',
      steamVal: '2.80',
      steamUnit: 'GJ/台',
      yoy: '-4.5%',
      isYoyDown: true,
      tipText: '考核【SCB13-1600/10】干变浇注固化工序能耗。',
      formula: 'e = E / M',
      formulaDesc: '月度型号单耗',
      trendHistory: [],
    },
  ]
}

interface ProductModelEnergyTableProps {
  title?: string
  currentProductLine?: string | null
  currentSubcategoryName?: string | null
  metricName?: string
  unitName?: string
  className?: string
  onSelectModel?: (model: ProductModelItem) => void
}

/**
 * 🌟 产品能耗明细表组件 (内页核心新增模块)
 * 严格响应用户指令：
 * “内页中需要增加产品产量和产品型号对应的能耗类型和能耗量；”
 * “产品产量的单位有问题，变压器设备单位是台、线缆、套管显示对应单位；”
 */
export function ProductModelEnergyTable({
  title = '产品能耗明细',
  currentProductLine = '高压产线',
  currentSubcategoryName = '',
  metricName = '单位产品能耗',
  className,
  onSelectModel,
}: ProductModelEnergyTableProps) {
  const [searchKey, setSearchKey] = useState<string>('')
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  const lineName = currentProductLine || '高压产线'
  const subName = currentSubcategoryName || ''

  // 1. 获取该产线与产品中类下的型号列表
  const rawModels = useMemo(() => {
    let models = getModelsForSubcategory(lineName, subName, '')
    if (!models || models.length === 0) {
      // 尝试从该产线下获取全部子分类的型号合并
      const lineDict = PRODUCT_MODELS_DICTIONARY[lineName]
      if (lineDict) {
        models = Object.values(lineDict).flat()
      }
    }
    if (!models || models.length === 0) {
      models = generateFallbackModelsForLine(lineName, subName)
    }
    return models
  }, [lineName, subName])

  // 2. 搜索过滤
  const filteredModels = useMemo(() => {
    const q = searchKey.trim().toLowerCase()
    if (!q) return rawModels
    return rawModels.filter(
      (m) =>
        m.model.toLowerCase().includes(q) ||
        m.desc.toLowerCase().includes(q) ||
        (m.capacity && m.capacity.toLowerCase().includes(q)) ||
        (m.voltage && m.voltage.toLowerCase().includes(q)) ||
        (m.code && m.code.includes(q))
    )
  }, [rawModels, searchKey])

  // 3. 折叠/展开（默认展示前 6 款型号，超出可展开）
  const displayedModels = useMemo(() => {
    if (isExpanded || searchKey.trim() !== '') {
      return filteredModels
    }
    return filteredModels.slice(0, 6)
  }, [filteredModels, isExpanded, searchKey])

  // 4. 计算产出量与能耗量
  const modelsWithEnergy = useMemo(() => {
    return displayedModels.map((m, idx) => {
      // 权威单位判定：变压器设备强制为【台】，线缆显示【万km·mm²】，套管显示【支】
      const outputUnit = getProductOutputUnit(lineName, m.subcategoryName || subName, m.unitSuffix)

      // 确定性推算该型号统计期产量
      let hash = 0
      const str = m.id || m.model
      for (let i = 0; i < str.length; i++) {
        hash = (hash * 37 + str.charCodeAt(i)) % 100000
      }

      let outputNum = 0
      let outputStr = ''
      if (outputUnit === '台' || outputUnit === '支' || outputUnit === '间隔' || outputUnit === '面') {
        outputNum = 20 + (hash % 65)
        outputStr = outputNum.toLocaleString()
      } else if (outputUnit.includes('km') || outputUnit.includes('米') || outputUnit.includes('m')) {
        outputNum = 120 + (hash % 380) + ((hash % 10) / 10)
        outputStr = outputNum.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
      } else {
        outputNum = 50 + (hash % 150)
        outputStr = outputNum.toLocaleString()
      }

      // 能耗类型与能耗量
      const elecValNum = parseFloat(m.elecVal?.replace(/,/g, '') || '2400')
      const steamValNum = parseFloat(m.steamVal?.replace(/,/g, '') || '0')
      const hasSteam = steamValNum > 0 || lineName.includes('变压器') || lineName.includes('高压') || lineName.includes('配变')

      // 实物量计算 = 单耗 × 产量
      const totalElec = Math.round(elecValNum * outputNum)
      const totalSteam = hasSteam ? parseFloat((steamValNum * outputNum).toFixed(1)) : 0

      // 折标量计算 (tce)
      const elecTce = (totalElec * 0.0001229)
      const steamTce = (totalSteam * 0.0341)
      const totalTce = parseFloat((elecTce + steamTce).toFixed(2))

      // 单耗展示
      const unitEnergy = m.energyVal || (elecValNum * 0.0001229 + steamValNum * 0.0341).toFixed(3)

      return {
        ...m,
        outputUnit,
        outputStr,
        hasSteam,
        totalElec: totalElec.toLocaleString(),
        totalSteam: totalSteam > 0 ? totalSteam.toLocaleString() : null,
        totalTce: totalTce.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        unitEnergy,
      }
    })
  }, [displayedModels, lineName, subName])

  return (
    <div className={cn('bg-white dark:bg-card p-6 rounded-lg border border-[#DBE6EE] dark:border-border shadow-xs space-y-4', className)}>
      {/* 头部标题与控制区 */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-border pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
          <h2 className="text-base font-bold text-slate-800 dark:text-foreground shrink-0">
            {title}
          </h2>
        </div>

        {/* 右侧搜索框 */}
        <div className="relative w-64 max-w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 dark:text-muted-foreground" />
          <input
            type="text"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            placeholder="搜索产品型号或规格参数..."
            className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-[#E2E8F0] dark:border-border bg-white dark:bg-background text-slate-800 dark:text-foreground placeholder:text-slate-400 dark:placeholder:text-muted-foreground focus:outline-none focus:border-[#2C7CFF]"
          />
        </div>
      </div>

      {/* 表格区域 */}
      {filteredModels.length === 0 ? (
        <div className="py-10 flex items-center justify-center text-center text-slate-400 dark:text-muted-foreground">
          <span className="text-xs font-medium">暂无匹配的产品型号！</span>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="overflow-x-auto border border-[#DBE6EE] dark:border-border rounded-lg">
            <table className="w-full text-left border-collapse font-sans min-w-[960px]">
              <thead className="bg-slate-50/70 dark:bg-panel text-slate-500 dark:text-muted-foreground text-[11px] font-semibold border-b border-[#DBE6EE] dark:border-border select-none">
                <tr className="h-[44px]">
                  <th className="px-3 text-center w-12 font-mono">序号</th>
                  <th className="px-3 w-[220px]">产品型号</th>
                  <th className="px-3 w-[180px]">规格容量 / 电压</th>
                  <th className="px-3 text-right w-28 font-mono text-slate-700 dark:text-foreground">产品产量</th>
                  <th className="px-3 text-center w-32">对应能耗类型</th>
                  <th className="px-3 text-right w-44 font-mono">实物能耗量</th>
                  <th className="px-3 text-right w-36 font-mono text-[#2C7CFF] dark:text-primary">折标综合能耗量</th>
                  <th className="px-3 text-right w-32 font-mono">单位综合单耗</th>
                  <th className="px-3 text-right w-20 font-mono">同比</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-border/60 text-sm">
                {modelsWithEnergy.map((item, idx) => {
                  return (
                    <tr
                      key={item.id}
                      onClick={() => onSelectModel?.(item)}
                      className="h-[44px] hover:bg-blue-50/50 dark:hover:bg-primary/10 transition-colors group cursor-pointer"
                      title={`点击查看【${item.model}】型号能效走势`}
                    >
                      {/* 1. 序号 */}
                      <td className="px-3 text-center font-mono text-xs text-slate-400 dark:text-muted-foreground">
                        {String(idx + 1).padStart(2, '0')}
                      </td>

                      {/* 2. 产品型号 */}
                      <td className="px-3 w-[220px]">
                        <div className="flex items-center gap-2">
                          <div className="size-6 rounded bg-blue-50 dark:bg-primary/10 border border-blue-100 dark:border-primary/20 text-[#2C7CFF] dark:text-primary flex items-center justify-center shrink-0">
                            <Cpu className="size-3.5" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-800 dark:text-foreground truncate text-xs group-hover:text-[#2C7CFF] dark:group-hover:text-primary transition-colors" title={item.model}>
                              {item.model}
                            </div>
                            <div className="text-[10px] text-slate-400 dark:text-muted-foreground truncate" title={item.desc}>
                              {item.desc}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 3. 规格容量 / 电压 */}
                      <td className="px-3 w-[180px]">
                        <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-mono text-slate-600 dark:text-muted-foreground">
                          {item.capacity && (
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-secondary/40 border border-slate-200 dark:border-border text-slate-700 dark:text-foreground text-[10px]">
                              {item.capacity}
                            </span>
                          )}
                          {item.voltage && (
                            <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-primary/10 border border-blue-200 dark:border-primary/20 text-blue-700 dark:text-blue-300 text-[10px]">
                              {item.voltage}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 4. 产品产量 */}
                      <td className="px-3 text-right w-28">
                        <div className="font-mono text-sm font-bold text-slate-900 dark:text-foreground group-hover:text-[#2C7CFF] dark:group-hover:text-primary transition-colors">
                          {item.outputStr}{' '}
                          <span className="text-xs font-normal text-slate-500 dark:text-muted-foreground font-sans">
                            {item.outputUnit}
                          </span>
                        </div>
                      </td>

                      {/* 5. 对应能耗类型 */}
                      <td className="px-3 text-center w-32">
                        <div className="inline-flex items-center gap-1.5 justify-center flex-wrap">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#2C7CFF]/10 text-[#2C7CFF] dark:text-primary border border-[#2C7CFF]/20">
                            <Zap className="size-2.5" /> 电
                          </span>
                          {item.hasSteam && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#FFBA00]/10 text-[#FFBA00] border border-[#FFBA00]/20">
                              <Flame className="size-2.5" /> 蒸汽
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 6. 实物能耗量 */}
                      <td className="px-3 text-right w-44">
                        <div className="space-y-0.5 font-mono text-xs">
                          <div className="text-slate-800 dark:text-foreground">
                            <span className="text-[10px] text-slate-400 dark:text-muted-foreground font-sans mr-1">电:</span>
                            <span className="font-bold text-[#2C7CFF] dark:text-primary">{item.totalElec}</span>{' '}
                            <span className="text-[10px] text-slate-500 dark:text-muted-foreground">kWh</span>
                          </div>
                          {item.totalSteam && (
                            <div className="text-slate-800 dark:text-foreground">
                              <span className="text-[10px] text-slate-400 dark:text-muted-foreground font-sans mr-1">汽:</span>
                              <span className="font-bold text-[#FFBA00]">{item.totalSteam}</span>{' '}
                              <span className="text-[10px] text-slate-500 dark:text-muted-foreground">GJ</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 7. 折标综合能耗量 */}
                      <td className="px-3 text-right w-36">
                        <div className="font-mono text-sm font-extrabold text-[#2C7CFF] dark:text-primary">
                          {item.totalTce}{' '}
                          <span className="text-xs font-normal text-slate-500 dark:text-muted-foreground font-sans">tce</span>
                        </div>
                      </td>

                      {/* 8. 单位产品综合单耗 */}
                      <td className="px-3 text-right w-32">
                        <div className="font-mono text-xs font-bold text-slate-800 dark:text-foreground">
                          {item.unitEnergy}{' '}
                          <span className="text-[10px] font-normal text-slate-500 dark:text-muted-foreground font-sans">
                            tce/{item.outputUnit}
                          </span>
                        </div>
                      </td>

                      {/* 9. 同比 */}
                      <td className="px-3 text-right w-20">
                        <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {item.yoy}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* 展开/收起按钮 */}
          {filteredModels.length > 6 && searchKey.trim() === '' && (
            <div className="pt-2 flex items-center justify-center border-t border-slate-100 dark:border-border">
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-panel hover:bg-blue-50 dark:hover:bg-primary/10 border border-slate-200 dark:border-border hover:border-blue-300 dark:hover:border-primary/30 text-slate-700 dark:text-foreground hover:text-[#2C7CFF] dark:hover:text-primary transition-all cursor-pointer shadow-2xs group"
              >
                {isExpanded ? (
                  <>
                    <span>收起型号明细</span>
                    <ChevronUp className="size-3.5 text-slate-400 dark:text-muted-foreground group-hover:text-[#2C7CFF] dark:group-hover:text-primary transition-colors" />
                  </>
                ) : (
                  <>
                    <span>展开全部产品型号 (共 {filteredModels.length} 款)</span>
                    <ChevronDown className="size-3.5 text-slate-400 dark:text-muted-foreground group-hover:text-[#2C7CFF] dark:group-hover:text-primary transition-colors" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
