/* ============================================================
 * 电装零碳集控中心 / 产品碳足迹集采中心 管控指标目录
 * 依据《管控指标明细组》整理，供指标管控、能效分析、下钻使用
 * ============================================================ */

export type IndicatorStatus = '正常' | '异常' | '优秀'

export type Indicator = {
  id: number
  name: string
  definition: string // 指标定义
  formula: string // 计算公式（纯文本，安全字符）
  desc: string // 指标说明
  unit: string // 指标单位
  center: '集控' | '集采' // 所属中心
  category: string // 指标类别
  source: string // 指标来源
  scope: string // 覆盖范围
  freq: string // 统计周期
  /* 示例监测值（用于指标管控看板与下钻） */
  factory?: string
  current?: number
  base?: number
  target?: number
  status?: IndicatorStatus
}

/* -------------------- 指标类别 / 来源枚举 -------------------- */
export const indicatorCategories = [
  '碳排放类',
  '综合能耗类',
  '单位产品能耗类',
  '单位产值能耗类',
  '关键工序能耗类',
  '绿电与非化石类',
  '管理效率类',
] as const

/* -------------------- 指标目录（集控 + 集采） -------------------- */
export const indicators: Indicator[] = [
  // ============ 集采中心 ============
  {
    id: 1,
    name: '产品碳足迹',
    definition: '引用 GB/T 24067、ISO14067，主要管控摇篮到大门（或到坟墓）的产品碳足迹值',
    formula: '实时数据，取产品碳足迹核算值',
    desc: '来源于本地产品碳足迹追踪及报告系统的产品碳足迹数值',
    unit: 'tCO2/台',
    center: '集采',
    category: '碳排放类',
    source: '股份管理要求（应对 CBAM）',
    scope: '全产品',
    freq: '实时',
    factory: '天津变压器厂',
    current: 12.68,
    base: 13.2,
    target: 12,
    status: '优秀',
  },
  {
    id: 2,
    name: '开展产品碳足迹分析占比',
    definition: '统计期内开展主要产品碳足迹分析的产品类别数量占主要产品类别总数的比值',
    formula: 'Rcf = Ncf / N × 100%',
    desc: 'Ncf: 已开展分析的主要产品类别数；N: 主要产品类别总数',
    unit: '%',
    center: '集采',
    category: '管理效率类',
    source: '国家级零碳工厂',
    scope: '全工厂',
    freq: '月度',
    factory: '衡阳电缆厂',
    current: 78.5,
    base: 70,
    target: 85,
    status: '正常',
  },
  // ============ 集控中心 · 综合能耗 / 碳排放 ============
  {
    id: 3,
    name: '综合能源消费量',
    definition: '统计期内组织综合能源消费的总吨标准煤',
    formula: 'E = Σ (Ei × ki)',
    desc: '电、天然气、蒸汽、热力、柴油、煤油等各能源折算标准煤。ki 为第 i 种能源折标煤系数',
    unit: 'tce',
    center: '集控',
    category: '综合能耗类',
    source: '国家级零碳工厂',
    scope: '全工厂',
    freq: '月度',
    factory: '天津变压器厂',
    current: 12800,
    base: 13500,
    target: 12000,
    status: '正常',
  },
  {
    id: 4,
    name: '总碳排放量',
    definition: '统计期内企业组织产生的二氧化碳排放量',
    formula: 'E总 = E电 + E气 + E汽 + E热 + E油 + E煤',
    desc: '统计企业生产过程碳排放，回收利用中固碳非常少，本次考虑能源碳排放',
    unit: 'tCO2',
    center: '集控',
    category: '碳排放类',
    source: '国家级零碳工厂',
    scope: '全工厂',
    freq: '月度',
    factory: '昌吉线缆厂',
    current: 8620,
    base: 8100,
    target: 7800,
    status: '异常',
  },
  {
    id: 5,
    name: '单位能耗碳排放',
    definition: '统计期内每消费一吨标准煤产生的二氧化碳排放量',
    formula: 'I = C / E',
    desc: 'C: 单位能耗碳排放量（tCO2）；E: 综合能源消耗量（tce）',
    unit: 'tCO2/tce',
    center: '集控',
    category: '碳排放类',
    source: '国家级零碳工厂',
    scope: '全工厂',
    freq: '月度',
    factory: '沈阳开关厂',
    current: 0.62,
    base: 0.66,
    target: 0.6,
    status: '正常',
  },
  {
    id: 6,
    name: '非化石能源消费占比',
    definition: '统计期内非化石能源消费量与综合能源消费量的比值',
    formula: 'r = R / E × 100%',
    desc: 'R: 各类非化石能源消费量（不含作为原材料的能源）；E: 综合能源消费量',
    unit: '%',
    center: '集控',
    category: '绿电与非化石类',
    source: '国家级零碳工厂',
    scope: '全工厂',
    freq: '月度',
    factory: '衡阳电缆厂',
    current: 34.6,
    base: 30,
    target: 40,
    status: '正常',
  },
  {
    id: 7,
    name: '非化石能源电力消费物理认定占比',
    definition: '统计期内具备物理可溯源条件的非化石电力消费量占总电量的比值',
    formula: 'Ewl = Ex / Q × 100%',
    desc: 'Ex: 具备物理溯源条件的非化石电力消费量；Q: 总电量（万kWh）',
    unit: '%',
    center: '集控',
    category: '绿电与非化石类',
    source: '国家级零碳工厂',
    scope: '全工厂',
    freq: '月度',
    factory: '天津变压器厂',
    current: 28.4,
    base: 25,
    target: 35,
    status: '正常',
  },
  {
    id: 8,
    name: '单位工业增加值能耗',
    definition: '统计期内综合能源消费量与工业增加值的比值',
    formula: 'Emzw = E / Gmzw',
    desc: 'E: 综合能源消费量（tce）；Gmzw: 工业增加值（万元），年度重新汇总',
    unit: 'tce/万元',
    center: '集控',
    category: '单位产值能耗类',
    source: '国家级零碳工厂',
    scope: '全工厂',
    freq: '月度',
    factory: '沈阳开关厂',
    current: 0.38,
    base: 0.42,
    target: 0.35,
    status: '正常',
  },
  {
    id: 9,
    name: '节能装备应用占比',
    definition: '统计期内达到或优于能效强制国标 2 级水平和重点用能产品设备效先进水平的节能水平的装备累计额定总功率与纳入统计范围装备累计额定总功率的比值',
    formula: 'S = Ren / Ez × 100%',
    desc: 'Ren: 达到要求节能水平装备累计额定总功率；Ez: 装备累计额定总功率',
    unit: '%',
    center: '集控',
    category: '管理效率类',
    source: '国家级零碳工厂',
    scope: '全工厂',
    freq: '月度',
    factory: '西安互感器厂',
    current: 82.1,
    base: 78,
    target: 88,
    status: '正常',
  },
  {
    id: 10,
    name: '关键能源数据自动采集率',
    definition: '进出用能单位、进出主要次级用能单位和主要用能设备数据自动采集比例',
    formula: 'Rz = Nz / Nj × 100%',
    desc: 'Nz: 有效自动采集表计数；Nj: 按标准要求应配置表计数',
    unit: '%',
    center: '集控',
    category: '管理效率类',
    source: '股份管理要求',
    scope: '全工厂',
    freq: '月度',
    factory: '天津变压器厂',
    current: 91.5,
    base: 85,
    target: 95,
    status: '优秀',
  },
  {
    id: 11,
    name: '单位产值能耗',
    definition: '统计期内综合能源消费量与产品产值的比值',
    formula: 'g = E / G',
    desc: 'g: 单位产值能耗（tce/万元）；E: 综合能源消费量；G: 产品产值（万元）',
    unit: 'tce/万元',
    center: '集控',
    category: '单位产值能耗类',
    source: '股份管理要求',
    scope: '全工厂',
    freq: '月度',
    factory: '衡阳电缆厂',
    current: 0.42,
    base: 0.45,
    target: 0.4,
    status: '正常',
  },
  {
    id: 12,
    name: '单位产品能耗（型号）',
    definition: '统计期内综合能源消费量与产品产量的比值',
    formula: 'e = E / M',
    desc: 'e: 单位产品能耗（tce/产品单位）；E: 综合能源消费量；M: 产品产量（型号-产品单位对应关系）',
    unit: 'tce/产品单位',
    center: '集控',
    category: '单位产品能耗类',
    source: '国家绿色工厂',
    scope: '全工厂',
    freq: '月度',
    factory: '天津变压器厂',
    current: 86.4,
    base: 82,
    target: 80,
    status: '异常',
  },
  {
    id: 13,
    name: '单位产品电耗',
    definition: '统计期内电能源消费量（包括公辅设备）与产品产量的比值',
    formula: 'q电 = Q电 / M',
    desc: 'q电: 单位产品电耗（kWh/产品单位）；Q电: 电能源消费量；M: 产品产量',
    unit: 'kWh/产品单位',
    center: '集控',
    category: '单位产品能耗类',
    source: '股份管理要求',
    scope: '公司级',
    freq: '月度',
    factory: '沈阳开关厂',
    current: 42.6,
    base: 45,
    target: 40,
    status: '正常',
  },
  {
    id: 14,
    name: '单位产品蒸汽消耗',
    definition: '统计期内蒸汽能源消费量与产品产量的比值',
    formula: 'q蒸汽 = Q蒸汽 / M',
    desc: 'q蒸汽: 单位产品蒸汽消耗（GJ/产品单位）；Q蒸汽: 蒸汽能源消费量；M: 产品产量',
    unit: 'GJ/产品单位',
    center: '集控',
    category: '单位产品能耗类',
    source: '股份管理要求',
    scope: '公司级',
    freq: '月度',
    factory: '天津变压器厂',
    current: 0.42,
    base: 0.4,
    target: 0.38,
    status: '异常',
  },
  {
    id: 15,
    name: '单位产品天然气消耗',
    definition: '统计期内天然气能源消费量与产品产量的比值',
    formula: 'q天然气 = Q天然气 / M',
    desc: 'q天然气: 单位产品天然气消耗（m3/产品单位）；Q天然气: 天然气能源消费量；M: 产品产量',
    unit: 'm3/产品单位',
    center: '集控',
    category: '单位产品能耗类',
    source: '股份管理要求',
    scope: '公司级',
    freq: '月度',
    factory: '衡阳电缆厂',
    current: 3.86,
    base: 4.1,
    target: 3.6,
    status: '正常',
  },
  {
    id: 16,
    name: '单位产品水耗',
    definition: '统计期内水能源消费量与产品产量的比值',
    formula: 'q水 = Q水 / M',
    desc: 'q水: 单位产品水耗（t/产品单位）；Q水: 水能源消费量；M: 产品产量',
    unit: 't/产品单位',
    center: '集控',
    category: '单位产品能耗类',
    source: '股份管理要求',
    scope: '公司级',
    freq: '月度',
    factory: '西安互感器厂',
    current: 156,
    base: 160,
    target: 150,
    status: '正常',
  },
  // ============ 关键工序能耗类 ============
  {
    id: 17,
    name: '吨铜电耗（线缆-拉丝）',
    definition: '拉丝工序，拉 1 吨铜耗电量',
    formula: 'q = Q拉丝电 / M铜',
    desc: '采集拉丝（铜）设备的电耗，统计对应耗铜量，上送电装集控中心',
    unit: 'kWh/t',
    center: '集控',
    category: '关键工序能耗类',
    source: '电装管理要求',
    scope: '线缆（关键工序）',
    freq: '月度',
    factory: '昌吉线缆厂',
    current: 128,
    base: 135,
    target: 120,
    status: '正常',
  },
  {
    id: 18,
    name: '吨铝电耗（线缆-拉丝）',
    definition: '拉丝工序，拉 1 吨铝耗电量',
    formula: 'q = Q拉丝电 / M铝',
    desc: '采集拉丝（铝）设备的电耗，统计对应耗铝量，上送电装集控中心',
    unit: 'kWh/t',
    center: '集控',
    category: '关键工序能耗类',
    source: '电装管理要求',
    scope: '线缆（关键工序）',
    freq: '月度',
    factory: '昌吉线缆厂',
    current: 96,
    base: 102,
    target: 90,
    status: '正常',
  },
  {
    id: 19,
    name: '交联（线缆）',
    definition: '交联工序，单位产量耗电量',
    formula: 'q = Q交联电 / M线缆',
    desc: '采集交联设备的电耗，统计对应线缆产量，上送电装集控中心',
    unit: 'kWh/km',
    center: '集控',
    category: '关键工序能耗类',
    source: '电装管理要求',
    scope: '线缆（关键工序）',
    freq: '月度',
    factory: '昌吉线缆厂',
    current: 210,
    base: 225,
    target: 200,
    status: '正常',
  },
  {
    id: 20,
    name: '单位产值能耗（变压器-干燥）',
    definition: '变压器干燥工序每万元产值综合能耗',
    formula: 'g = E干燥 / G变压器',
    desc: '采集干燥设备（含线圈干燥、器身干燥、绝缘件干燥）的电耗、蒸汽消耗量，统计对应变压器产值，上送电装集控中心',
    unit: 'tce/万元',
    center: '集控',
    category: '关键工序能耗类',
    source: '电装管理要求',
    scope: '变压器（关键工序）',
    freq: '月度',
    factory: '天津变压器厂',
    current: 0.36,
    base: 0.4,
    target: 0.34,
    status: '正常',
  },
  {
    id: 21,
    name: '单位产值电耗（变压器-试验）',
    definition: '变压器试验工序每万元产值电耗',
    formula: 'q = Q试验电 / G变压器',
    desc: '采集试验设备的电耗，统计对应变压器产值，上送电装集控中心',
    unit: 'kWh/万元',
    center: '集控',
    category: '关键工序能耗类',
    source: '电装管理要求',
    scope: '变压器（关键工序）',
    freq: '月度',
    factory: '天津变压器厂',
    current: 182,
    base: 195,
    target: 170,
    status: '正常',
  },
  {
    id: 22,
    name: '单位产值电耗（GIS-抽真空）',
    definition: 'GIS 抽真空工序每万元产值电耗',
    formula: 'q = Q抽真空电 / G(GIS)',
    desc: '采集抽真空设备的电耗，统计对应 GIS 产值，上送电装集控中心',
    unit: 'kWh/万元',
    center: '集控',
    category: '关键工序能耗类',
    source: '电装管理要求',
    scope: '开关-GIS（关键工序）',
    freq: '月度',
    factory: '沈阳开关厂',
    current: 156,
    base: 168,
    target: 150,
    status: '正常',
  },
  {
    id: 23,
    name: '单位产量电耗（硅钢铁心-退火）',
    definition: '生产 1 吨非晶合金铁心、退火工序耗电量',
    formula: 'q = Q退火电 / M铁心',
    desc: '采集非晶合金铁心退火工序耗电量，统计对应产品产量，上送电装集控中心',
    unit: 'kWh/t',
    center: '集控',
    category: '关键工序能耗类',
    source: '电装管理要求',
    scope: '变压器-铁心（新变昌吉）',
    freq: '月度',
    factory: '昌吉线缆厂',
    current: 620,
    base: 660,
    target: 600,
    status: '正常',
  },
]

/* -------------------- 状态色映射（供徽章使用） -------------------- */
export function indicatorTone(status?: IndicatorStatus): 'ok' | 'warn' | 'danger' | 'info' {
  if (status === '优秀') return 'ok'
  if (status === '异常') return 'danger'
  return 'info'
}

/* -------------------- 下钻：原始数据明细 -------------------- */
export type RawRow = { period: string; molecule: number; denominator: number; value: number; source: string }

/* 依据指标确定性生成原始数据（分子/分母/结果），供下钻展示 */
export function indicatorRawData(ind: Indicator, periods: string[]): RawRow[] {
  const base = ind.current ?? 100
  const src =
    ind.freq === '实时' ? '系统接入（15分钟）' : ind.category === '关键工序能耗类' ? '工序表计接入' : '系统接入 / 手动录入'
  return periods.map((p, i) => {
    const wobble = 1 + (((ind.id * 7 + i * 13) % 11) - 5) / 100 // ±5% 确定性波动
    const value = +(base * wobble).toFixed(base < 10 ? 2 : base < 100 ? 1 : 0)
    // 反推一组合理的分子/分母
    const denominator = +(((ind.id % 5) + 2) * 100 * (1 + i / 20)).toFixed(1)
    const molecule = +(value * denominator).toFixed(1)
    return { period: p, molecule, denominator, value, source: src }
  })
}

/* -------------------- 下钻：变化曲线数据 -------------------- */
export function indicatorTrend(ind: Indicator, periods: string[]) {
  const base = ind.current ?? 100
  const target = ind.target ?? base * 0.95
  return periods.map((p, i) => {
    const wobble = 1 + (((ind.id * 5 + i * 9) % 13) - 6) / 100
    return {
      month: p,
      实际值: +(base * wobble).toFixed(base < 10 ? 2 : base < 100 ? 1 : 0),
      目标值: +target.toFixed(base < 10 ? 2 : base < 100 ? 1 : 0),
    }
  })
}

/* 常用统计周期标签 */
export const periodLabels: Record<'month' | 'quarter' | 'year', string[]> = {
  month: ['1月', '2月', '3月', '4月', '5月', '6月'],
  quarter: ['Q1', 'Q2', 'Q3', 'Q4'],
  year: ['2022', '2023', '2024', '2025', '2026'],
}
