/**
 * 特变电工能碳数字化双中心 - 生产工序与产品中类能耗对标桥接引擎
 * 
 * 核心架构定位：
 * 严格遵照系统设置【生产工序管理】模块 (INITIAL_PROCESS_MASTER_ITEMS) 数据源，
 * 建立制造企业/工厂 ➔ 生产工序 ➔ 关联产品中类 ➔ 能源与能耗实物量/折标核算数据链。
 */

import { INITIAL_PROCESS_MASTER_ITEMS, ProcessMasterItem } from './process-management-data'
import { ERP_SUBCATEGORIES } from './product-model-mapping'

/** 产品中类在工序中的能耗与能源数据实体 */
export interface ProcessSubcategoryEnergyItem {
  id: string
  subCategoryName: string            // 产品中类名称 (如 交流变压器-1000KV)
  subCategoryCode: string            // 产品中类编码
  majorCategoryName: string          // 所属产品大类 (如 变压器、高压组合电器 GIS、高压电力电缆)
  unit: string                       // 计量单位 (万kVA, km, 台, 支, t)
  output: number                     // 统计期产量
  outputFormatted: string            // 格式化产量 (千分位带单位)
  energyTypes: string[]              // 使用能源类型 (['电力', '蒸汽'] 或 ['电力'])
  
  // ⚡ 能源数据 (实物消耗量)
  electricityUsage: number           // 工序耗电量总量 (万kWh)
  electricityUsageFormatted: string  // 格式化工序耗电量 (万kWh)
  electricityIntensity: number       // 工序单位电耗 (kWh/计量单位)
  electricityIntensityFormatted: string

  hasSteam: boolean                  // 是否消耗蒸汽
  steamUsage: number                 // 工序耗蒸汽量总量 (t)
  steamUsageFormatted: string        // 格式化工序耗蒸汽量 (t)
  steamIntensity: number             // 工序单位蒸汽耗 (t/计量单位)
  steamIntensityFormatted: string

  // 🔥 能耗数据 (折标综合能耗与综合单耗)
  totalEnergyTce: number             // 工序折标综合能耗 (tce)
  totalEnergyTceFormatted: string    // 格式化综合能耗 (tce)
  unitEnergyIntensity: number        // 工序综合单耗
  unitEnergyIntensityFormatted: string
  unitEnergyUnit: string             // 工序综合单耗单位 (tce/万kVA 或 kgce/台 等)

  // 结构与对比
  elecRatio: number                  // 电力折标能耗占比 %
  steamRatio: number                 // 蒸汽折标能耗占比 %
  yoy: string                        // 同比变动率 (如 -3.8%)
  isYoyDown: boolean                 // 同比是否下降 (能耗下降为良好)

  // 12 个月工序时序趋势数据 (供弹窗查看)
  monthlyTrend: Array<{
    period: string
    output: number
    unitEnergy: number
    elecUsage: number
    steamUsage: number
    elecIntensity: number
    steamIntensity: number
  }>
}

/** 10 家无关键制造工序企业白名单 (严格依据权威白名单精准判空为 暂无相关工序！) */
const ZERO_PROCESS_UNIT_WHITELIST = [
  '智慧能源',
  '印能公司',
  '南京电研',
  '露娜公司',
  '特变电工露娜智能',
  '露娜智能制造',
  '柯贝尔',
  '上开',
  '智缆',
  '银利电气',
]

/**
 * 依据选中的组织树节点获取关联企业的生产工序列表
 * @param unitName 企业或工厂名称 (如 '沈变公司', '沈变本部', '衡变公司', '电装集团' 等)
 * @param unitLevel 组织层级 ('group' | 'company' | 'workshop')
 */
export function getProcessesForUnit(
  unitName: string = '',
  unitLevel?: string
): ProcessMasterItem[] {
  const normName = (unitName || '').trim()

  // 1. 若属于 10 家无工序企业白名单，严格返回空数组
  if (ZERO_PROCESS_UNIT_WHITELIST.some((z) => normName.includes(z))) {
    return []
  }

  // 2. 集团根节点或全集团层级：展示全量标准生产工序
  if (
    !normName ||
    normName === '电装集团' ||
    normName === '特变电工集团' ||
    normName === '全集团' ||
    normName === 'ent_root' ||
    unitLevel === 'group'
  ) {
    return INITIAL_PROCESS_MASTER_ITEMS
  }

  // 3. 产业分类节点
  if (normName.includes('变压器产业')) {
    return INITIAL_PROCESS_MASTER_ITEMS.filter(
      (p) => p.category === 'transformer' || p.category === 'core'
    )
  }
  if (normName.includes('线缆产业')) {
    return INITIAL_PROCESS_MASTER_ITEMS.filter((p) => p.category === 'cable')
  }

  // 4. 直属制造公司与工厂匹配
  return INITIAL_PROCESS_MASTER_ITEMS.filter((proc) => {
    // 匹配 factories 明细中的 companyName 或 factoryName
    const matchFactory = proc.factories.some(
      (f) =>
        f.companyName.includes(normName) ||
        normName.includes(f.companyName) ||
        f.factoryName.includes(normName) ||
        normName.includes(f.factoryName)
    )
    if (matchFactory) return true

    // 匹配 linkedFactories 名称
    const matchLinked = proc.linkedFactories.some(
      (fac) => fac.includes(normName) || normName.includes(fac)
    )
    if (matchLinked) return true

    return false
  })
}

/** 辅助：根据产品中类基准特征生成工序实物量与综合能耗 */
export function getSubcategoryEnergyForProcess(
  processItem: ProcessMasterItem,
  unitName: string = ''
): ProcessSubcategoryEnergyItem[] {
  if (!processItem || !processItem.linkedProductModels || processItem.linkedProductModels.length === 0) {
    return []
  }

  const hasSteam = processItem.energyTypes.includes('蒸汽')
  const isTrHighDry = processItem.code === 'PROC-TR-DRY-01' // 变压器-高压-干燥
  const isTrTest = processItem.code === 'PROC-TR-TEST-01' // 变压器-试验
  const isTrOilDry = processItem.code === 'PROC-TR-DRY-02' // 变压器-中低压-油变-干燥
  const isTrCure = processItem.code === 'PROC-TR-CURE-01' // 变压器-中低压-干变-固化
  const isCableDraw = processItem.code === 'PROC-CB-DRW-01' // 拉丝
  const isCableHighCv = processItem.code === 'PROC-CB-CV-01' // 高压交联
  const isCableMidCv = processItem.code === 'PROC-CB-CV-02' // 中压交联
  const isCoreAnl = processItem.code === 'PROC-CR-ANL-01' // 铁心退火
  const isCoreSlt = processItem.code === 'PROC-CR-SLT-01' // 铁心纵剪
  const isCoreStk = processItem.code.includes('CR-STK') // 铁心叠装
  const isBushingDry = processItem.code.includes('TG-DRY') // 套管干燥
  const isCtDry = processItem.code.includes('HG-DRY') // 互感器干燥

  return processItem.linkedProductModels.map((modelName, idx) => {
    // 查找 ERP 中类元数据
    const erpMatch = ERP_SUBCATEGORIES.find((s) => s.name === modelName)
    const code = erpMatch?.code || `SUB-${idx + 101}`
    const majorCategory = erpMatch?.majorCategoryName || processItem.categoryLabel || '变压器'
    const unit = erpMatch?.unit || processItem.unit || '万kVA'

    // 1. 基准产量设计 (结合中类体量)
    let output = 350
    if (unit === '万kVA') {
      if (modelName.includes('1000KV') || modelName.includes('±800')) output = 280 + (idx % 3) * 60
      else if (modelName.includes('750KV')) output = 340 + (idx % 2) * 50
      else if (modelName.includes('500KV')) output = 420 + (idx % 3) * 70
      else if (modelName.includes('220KV')) output = 490 + (idx % 2) * 60
      else if (modelName.includes('110KV')) output = 580 + (idx % 3) * 80
      else output = 320 + idx * 40
    } else if (unit === 'km' || unit === 'km*mm2' || unit === '万m') {
      output = 1200 + (idx % 4) * 850
    } else if (unit === 't') {
      output = 800 + (idx % 3) * 600
    } else if (unit === '支') {
      output = 260 + (idx % 2) * 120
    } else {
      output = 180 + (idx % 4) * 90
    }

    // 2. 实物能源单耗 (kWh/单位, t/单位) 与能耗核算
    let elecIntensity = 280.0
    let steamIntensity = 0.0

    if (isTrHighDry) {
      // 高压干燥：电耗 285~305 kWh/万kVA，汽耗 0.82~0.88 t/万kVA
      elecIntensity = Number((285.0 + (idx % 5) * 4.2).toFixed(1))
      steamIntensity = Number((0.825 + (idx % 4) * 0.018).toFixed(3))
    } else if (isTrTest) {
      // 变压器试验：纯电，122~132 kWh/万kVA
      elecIntensity = Number((124.5 + (idx % 4) * 2.1).toFixed(1))
      steamIntensity = 0
    } else if (isTrOilDry) {
      // 油变干燥：电耗 242~256 kWh/万kVA，汽耗 0.70~0.74 t/万kVA
      elecIntensity = Number((245.0 + (idx % 3) * 4.5).toFixed(1))
      steamIntensity = Number((0.710 + (idx % 3) * 0.015).toFixed(3))
    } else if (isTrCure) {
      // 干变固化：纯电，226~238 kWh/万kVA
      elecIntensity = Number((230.0 + (idx % 3) * 3.6).toFixed(1))
      steamIntensity = 0
    } else if (isCableDraw) {
      // 线缆拉丝：纯电，铜 142.5 kWh/t，铝 215.0 kWh/t
      elecIntensity = modelName.includes('铝') ? 215.0 : 142.5
      steamIntensity = 0
    } else if (isCableHighCv) {
      // 高压交联：纯电，23.5~25.2 kWh/km*mm2
      elecIntensity = Number((24.0 + (idx % 3) * 0.6).toFixed(1))
      steamIntensity = 0
    } else if (isCableMidCv) {
      // 中压交联：纯电，17.8~19.2 kWh/km*mm2
      elecIntensity = Number((18.4 + (idx % 3) * 0.4).toFixed(1))
      steamIntensity = 0
    } else if (isCoreAnl) {
      // 铁心退火：纯电，265.0 kWh/t
      elecIntensity = 265.0
      steamIntensity = 0
    } else if (isCoreSlt) {
      // 铁心纵剪：纯电，48.2 kWh/t
      elecIntensity = 48.2
      steamIntensity = 0
    } else if (isCoreStk) {
      // 铁心叠装：纯电，36.5 kWh/t
      elecIntensity = 36.5
      steamIntensity = 0
    } else if (isBushingDry) {
      // 套管干燥：纯电，310.0 kWh/支
      elecIntensity = 310.0
      steamIntensity = 0
    } else if (isCtDry) {
      // 互感器干燥：电 185.0 kWh/台，汽 0.45 t/台
      elecIntensity = 185.0
      steamIntensity = 0.45
    } else {
      elecIntensity = hasSteam ? 210.0 : 160.0
      steamIntensity = hasSteam ? 0.65 : 0
    }

    // 3. 实物总量计算
    // 万kWh = (单耗 kWh * 产量) / 10000
    const electricityUsage = Number(((elecIntensity * output) / 10000).toFixed(2))
    // 汽总量 t = 单耗 t * 产量
    const steamUsage = Number((steamIntensity * output).toFixed(1))

    // 4. 折标综合能耗计算 (依据 GB/T 2589: 电力 1.229 tce/万kWh，蒸汽 0.1286 tce/t)
    const elecTce = electricityUsage * 1.229
    const steamTce = steamUsage * 0.1286
    const totalEnergyTce = Number((elecTce + steamTce).toFixed(2))

    // 5. 工序综合单耗 (tce/单位 或 kgce/单位)
    const rawIntensity = totalEnergyTce / (output || 1)
    let unitEnergyIntensity = Number(rawIntensity.toFixed(4))
    let unitEnergyUnit = `tce/${unit}`

    // 若数值小于 0.001 则换算为 kgce
    if (unitEnergyIntensity < 0.001) {
      unitEnergyIntensity = Number((rawIntensity * 1000).toFixed(2))
      unitEnergyUnit = `kgce/${unit}`
    }

    // 6. 电力与蒸汽折标能量占比
    const elecRatio = totalEnergyTce > 0 ? Number(((elecTce / totalEnergyTce) * 100).toFixed(1)) : 100
    const steamRatio = totalEnergyTce > 0 ? Number(((steamTce / totalEnergyTce) * 100).toFixed(1)) : 0

    // 7. 同比
    const yoyVal = Number((-3.2 - (idx % 5) * 0.45).toFixed(1))
    const yoy = `${yoyVal}%`

    // 8. 过去 12 个月月度工序时序趋势 (供时序分析弹窗)
    const months = ['25-09', '25-10', '25-11', '25-12', '26-01', '26-02', '26-03', '26-04', '26-05', '26-06', '26-07', '26-08']
    const monthlyTrend = months.map((m, mIdx) => {
      const decay = 1 + (11 - mIdx) * 0.006 // 历史单耗稍高，体现节能趋势
      const mElecInt = Number((elecIntensity * decay).toFixed(1))
      const mSteamInt = Number((steamIntensity * decay).toFixed(3))
      const mOut = Number((output * (0.92 + (mIdx % 4) * 0.04)).toFixed(0))
      const mElec = Number(((mElecInt * mOut) / 10000).toFixed(2))
      const mSteam = Number((mSteamInt * mOut).toFixed(1))
      const mTotal = Number((mElec * 1.229 + mSteam * 0.1286).toFixed(2))
      const mUnit = Number((mTotal / (mOut || 1)).toFixed(4))
      return {
        period: m,
        output: mOut,
        unitEnergy: mUnit,
        elecUsage: mElec,
        steamUsage: mSteam,
        elecIntensity: mElecInt,
        steamIntensity: mSteamInt,
      }
    })

    return {
      id: `proc_sub_${processItem.code}_${code}`,
      subCategoryName: modelName,
      subCategoryCode: code,
      majorCategoryName: majorCategory,
      unit,
      output,
      outputFormatted: output.toLocaleString('zh-CN'),
      energyTypes: processItem.energyTypes,
      electricityUsage,
      electricityUsageFormatted: electricityUsage.toLocaleString('zh-CN', { minimumFractionDigits: 1, maximumFractionDigits: 2 }),
      electricityIntensity: elecIntensity,
      electricityIntensityFormatted: elecIntensity.toLocaleString('zh-CN', { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
      hasSteam,
      steamUsage,
      steamUsageFormatted: hasSteam ? steamUsage.toLocaleString('zh-CN', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : '--',
      steamIntensity,
      steamIntensityFormatted: hasSteam ? steamIntensity.toFixed(3) : '--',
      totalEnergyTce,
      totalEnergyTceFormatted: totalEnergyTce.toLocaleString('zh-CN', { minimumFractionDigits: 1, maximumFractionDigits: 2 }),
      unitEnergyIntensity,
      unitEnergyIntensityFormatted: unitEnergyIntensity.toFixed(4),
      unitEnergyUnit,
      elecRatio,
      steamRatio,
      yoy,
      isYoyDown: yoyVal < 0,
      monthlyTrend,
    }
  })
}

/** 计算当前选中的工序 4 列能耗总览微卡片数据 */
export function getProcessOverallSummary(
  processItem: ProcessMasterItem,
  subcategories: ProcessSubcategoryEnergyItem[]
) {
  if (!subcategories || subcategories.length === 0) {
    return {
      totalEnergyTce: '0.0',
      totalElecUsage: '0.0',
      totalSteamUsage: '--',
      avgUnitEnergy: '0.0000',
      unitEnergyUnit: 'tce/单位',
      avgElecIntensity: '0.0',
      avgSteamIntensity: '--',
      hasSteam: false,
      yoyEnergy: '-4.2%',
      yoyElec: '-3.8%',
      yoySteam: '-4.5%',
      subCategoryCount: 0,
    }
  }

  const hasSteam = processItem.energyTypes.includes('蒸汽')
  const totalEnergy = subcategories.reduce((acc, cur) => acc + cur.totalEnergyTce, 0)
  const totalElec = subcategories.reduce((acc, cur) => acc + cur.electricityUsage, 0)
  const totalSteam = subcategories.reduce((acc, cur) => acc + (cur.hasSteam ? cur.steamUsage : 0), 0)
  const totalOutput = subcategories.reduce((acc, cur) => acc + cur.output, 0)

  const avgElecIntensity = totalOutput > 0 ? (totalElec * 10000) / totalOutput : 0
  const avgSteamIntensity = totalOutput > 0 && hasSteam ? totalSteam / totalOutput : 0
  const avgUnitEnergy = totalOutput > 0 ? totalEnergy / totalOutput : 0
  const unit = subcategories[0]?.unit || '万kVA'

  return {
    totalEnergyTce: totalEnergy.toLocaleString('zh-CN', { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
    totalElecUsage: totalElec.toLocaleString('zh-CN', { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
    totalSteamUsage: hasSteam ? totalSteam.toLocaleString('zh-CN', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : '--',
    avgUnitEnergy: avgUnitEnergy.toFixed(4),
    unitEnergyUnit: `tce/${unit}`,
    avgElecIntensity: avgElecIntensity.toFixed(1),
    avgSteamIntensity: hasSteam ? avgSteamIntensity.toFixed(3) : '--',
    hasSteam,
    yoyEnergy: '-4.6%',
    yoyElec: '-4.0%',
    yoySteam: '-4.3%',
    subCategoryCount: subcategories.length,
  }
}

/** 保持之前简单模式的工序卡片指标项接口 */
export interface ProcessCardMetric {
  id: string
  code: string
  name: string
  unit: string
  curVal: string
  yoy: string
  isYoyDown: boolean
  badge: string
  category: 'process'
  categoryName: string
  subCategoryName?: string
  energyType?: string
}

/**
 * 依据当前选中的生产工序和关联产品中类，生成保持之前简单卡片风格的指标列表 (Card Grid)
 */
export function getProcessSimpleCardMetrics(
  processItem: ProcessMasterItem,
  subcategories: ProcessSubcategoryEnergyItem[],
  selectedSubId?: string,
  searchKey?: string
): ProcessCardMetric[] {
  if (!processItem || !subcategories || subcategories.length === 0) {
    return []
  }

  const summary = getProcessOverallSummary(processItem, subcategories)
  const hasSteam = processItem.energyTypes.includes('蒸汽')
  const unit = subcategories[0]?.unit || '万kVA'
  const metrics: ProcessCardMetric[] = []

  // 1. 若选中的是 'ALL' (全部中类综合)，首先呈现该工序级 6-8 张综合指标卡片 (完全对应原图 8 卡片规范)
  if (!selectedSubId || selectedSubId === 'ALL') {
    // 卡片 1: 单位产量能耗 (综合能耗)
    metrics.push({
      id: `pcm-${processItem.id}-unit-energy`,
      code: 'PCM-01',
      name: `单位产量能耗 (${processItem.name})`,
      unit: `tce/${unit}`,
      curVal: summary.avgUnitEnergy,
      yoy: summary.yoyEnergy,
      isYoyDown: true,
      badge: '综合能耗',
      category: 'process',
      categoryName: '关键工序能效指标',
    })

    // 卡片 2: 单位产量电耗 (能源数据)
    metrics.push({
      id: `pcm-${processItem.id}-unit-elec`,
      code: 'PCM-02',
      name: `单位产量电耗 (${processItem.name})`,
      unit: `kWh/${unit}`,
      curVal: summary.avgElecIntensity,
      yoy: summary.yoyElec,
      isYoyDown: true,
      badge: '实物电耗',
      category: 'process',
      categoryName: '关键工序能效指标',
    })

    // 卡片 3: 单位产量蒸汽消耗 (能源数据，若有蒸汽)
    if (hasSteam) {
      metrics.push({
        id: `pcm-${processItem.id}-unit-steam`,
        code: 'PCM-03',
        name: `单位产量蒸汽消耗 (${processItem.name})`,
        unit: `t/${unit}`,
        curVal: summary.avgSteamIntensity,
        yoy: summary.yoySteam,
        isYoyDown: true,
        badge: '实物汽耗',
        category: 'process',
        categoryName: '关键工序能效指标',
      })
    }

    // 卡片 4: 单位产值能耗 (综合能耗)
    metrics.push({
      id: `pcm-${processItem.id}-val-energy`,
      code: 'PCM-04',
      name: `单位产值能耗 (${processItem.name})`,
      unit: 'tce/万元',
      curVal: (parseFloat(summary.avgUnitEnergy) * 0.335).toFixed(4),
      yoy: '-5.1%',
      isYoyDown: true,
      badge: '产值能耗',
      category: 'process',
      categoryName: '关键工序能效指标',
    })

    // 卡片 5: 单位产值电耗 (能源数据)
    metrics.push({
      id: `pcm-${processItem.id}-val-elec`,
      code: 'PCM-05',
      name: `单位产值电耗 (${processItem.name})`,
      unit: 'kWh/万元',
      curVal: (parseFloat(summary.avgElecIntensity) * 0.335).toFixed(1),
      yoy: '-4.0%',
      isYoyDown: true,
      badge: '产值电耗',
      category: 'process',
      categoryName: '关键工序能效指标',
    })

    // 卡片 6: 单位产值蒸汽消耗 (能源数据，若有蒸汽)
    if (hasSteam) {
      metrics.push({
        id: `pcm-${processItem.id}-val-steam`,
        code: 'PCM-06',
        name: `单位产值蒸汽消耗 (${processItem.name})`,
        unit: 't/万元',
        curVal: (parseFloat(summary.avgSteamIntensity) * 0.335).toFixed(3),
        yoy: '-4.2%',
        isYoyDown: true,
        badge: '产值汽耗',
        category: 'process',
        categoryName: '关键工序能效指标',
      })
    }

    // 平铺各关联产品中类的能耗与综合能耗指标卡片
    subcategories.forEach((sub, idx) => {
      // 产品中类综合能耗
      metrics.push({
        id: `pcm-sub-${sub.id}-energy`,
        code: `SUB-E-${idx + 1}`,
        name: `单位产量能耗 (${sub.subCategoryName})`,
        unit: sub.unitEnergyUnit,
        curVal: sub.unitEnergyIntensityFormatted,
        yoy: sub.yoy,
        isYoyDown: sub.isYoyDown,
        badge: '产品中类',
        category: 'process',
        categoryName: '关键工序能效指标',
        subCategoryName: sub.subCategoryName,
      })

      // 产品中类实物电耗
      metrics.push({
        id: `pcm-sub-${sub.id}-elec`,
        code: `SUB-EL-${idx + 1}`,
        name: `单位产量电耗 (${sub.subCategoryName})`,
        unit: `kWh/${sub.unit}`,
        curVal: sub.electricityIntensityFormatted,
        yoy: '-3.9%',
        isYoyDown: true,
        badge: '产品电耗',
        category: 'process',
        categoryName: '关键工序能效指标',
        subCategoryName: sub.subCategoryName,
      })

      // 产品中类实物汽耗 (若有蒸汽)
      if (sub.hasSteam) {
        metrics.push({
          id: `pcm-sub-${sub.id}-steam`,
          code: `SUB-ST-${idx + 1}`,
          name: `单位产量蒸汽消耗 (${sub.subCategoryName})`,
          unit: `t/${sub.unit}`,
          curVal: sub.steamIntensityFormatted,
          yoy: '-4.3%',
          isYoyDown: true,
          badge: '产品汽耗',
          category: 'process',
          categoryName: '关键工序能效指标',
          subCategoryName: sub.subCategoryName,
        })
      }
    })
  } else {
    // 2. 若用户在二级胶囊中聚焦选定了某个具体的【产品中类】
    const targetSub = subcategories.find((s) => s.id === selectedSubId || s.subCategoryName === selectedSubId)
    if (targetSub) {
      metrics.push({
        id: `pcm-sub-${targetSub.id}-unit-energy`,
        code: 'PSUB-01',
        name: `单位产量能耗 (${targetSub.subCategoryName})`,
        unit: targetSub.unitEnergyUnit,
        curVal: targetSub.unitEnergyIntensityFormatted,
        yoy: targetSub.yoy,
        isYoyDown: targetSub.isYoyDown,
        badge: '中类综合能耗',
        category: 'process',
        categoryName: '关键工序能效指标',
        subCategoryName: targetSub.subCategoryName,
      })

      metrics.push({
        id: `pcm-sub-${targetSub.id}-unit-elec`,
        code: 'PSUB-02',
        name: `单位产量电耗 (${targetSub.subCategoryName})`,
        unit: `kWh/${targetSub.unit}`,
        curVal: targetSub.electricityIntensityFormatted,
        yoy: '-4.0%',
        isYoyDown: true,
        badge: '中类实物电耗',
        category: 'process',
        categoryName: '关键工序能效指标',
        subCategoryName: targetSub.subCategoryName,
      })

      if (targetSub.hasSteam) {
        metrics.push({
          id: `pcm-sub-${targetSub.id}-unit-steam`,
          code: 'PSUB-03',
          name: `单位产量蒸汽消耗 (${targetSub.subCategoryName})`,
          unit: `t/${targetSub.unit}`,
          curVal: targetSub.steamIntensityFormatted,
          yoy: '-4.4%',
          isYoyDown: true,
          badge: '中类实物汽耗',
          category: 'process',
          categoryName: '关键工序能效指标',
          subCategoryName: targetSub.subCategoryName,
        })
      }

      metrics.push({
        id: `pcm-sub-${targetSub.id}-val-energy`,
        code: 'PSUB-04',
        name: `单位产值能耗 (${targetSub.subCategoryName})`,
        unit: 'tce/万元',
        curVal: (parseFloat(targetSub.unitEnergyIntensityFormatted) * 0.335).toFixed(4),
        yoy: '-5.0%',
        isYoyDown: true,
        badge: '中类产值能耗',
        category: 'process',
        categoryName: '关键工序能效指标',
        subCategoryName: targetSub.subCategoryName,
      })

      metrics.push({
        id: `pcm-sub-${targetSub.id}-val-elec`,
        code: 'PSUB-05',
        name: `单位产值电耗 (${targetSub.subCategoryName})`,
        unit: 'kWh/万元',
        curVal: (parseFloat(targetSub.electricityIntensityFormatted) * 0.335).toFixed(1),
        yoy: '-4.1%',
        isYoyDown: true,
        badge: '中类产值电耗',
        category: 'process',
        categoryName: '关键工序能效指标',
        subCategoryName: targetSub.subCategoryName,
      })

      if (targetSub.hasSteam) {
        metrics.push({
          id: `pcm-sub-${targetSub.id}-val-steam`,
          code: 'PSUB-06',
          name: `单位产值蒸汽消耗 (${targetSub.subCategoryName})`,
          unit: 't/万元',
          curVal: (parseFloat(targetSub.steamIntensityFormatted) * 0.335).toFixed(3),
          yoy: '-4.3%',
          isYoyDown: true,
          badge: '中类产值汽耗',
          category: 'process',
          categoryName: '关键工序能效指标',
          subCategoryName: targetSub.subCategoryName,
        })
      }

      metrics.push({
        id: `pcm-sub-${targetSub.id}-total-elec`,
        code: 'PSUB-07',
        name: `工序实物耗电量 (${targetSub.subCategoryName})`,
        unit: '万kWh',
        curVal: targetSub.electricityUsageFormatted,
        yoy: '-3.8%',
        isYoyDown: true,
        badge: '实物电总量',
        category: 'process',
        categoryName: '关键工序能效指标',
        subCategoryName: targetSub.subCategoryName,
      })

      metrics.push({
        id: `pcm-sub-${targetSub.id}-total-energy`,
        code: 'PSUB-08',
        name: `工序折标综合能耗 (${targetSub.subCategoryName})`,
        unit: 'tce',
        curVal: targetSub.totalEnergyTceFormatted,
        yoy: targetSub.yoy,
        isYoyDown: targetSub.isYoyDown,
        badge: '折标煤总量',
        category: 'process',
        categoryName: '关键工序能效指标',
        subCategoryName: targetSub.subCategoryName,
      })
    }
  }

  // 3. 搜索过滤
  if (searchKey && searchKey.trim()) {
    const q = searchKey.trim().toLowerCase()
    return metrics.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.unit.toLowerCase().includes(q) ||
        m.badge.toLowerCase().includes(q) ||
        (m.subCategoryName && m.subCategoryName.toLowerCase().includes(q))
    )
  }

  return metrics
}
