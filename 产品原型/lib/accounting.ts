/* ============================================================
 * 实景数据库 · 碳足迹核算 / 能耗追踪 / 数据追踪 数据模型
 * 说明：产品碳足迹按生命周期阶段（原材料获取/运输/生产制造/废弃物处理）核算，
 *       不按组织碳的范围一/二/三划分。
 * ============================================================ */

import { featureOf, lifecycleStages, ordersOf, producingUnitsOf, projectCompanies, mainMaterials } from './procurement'

/* 确定性伪随机 */
function hash(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) / 4294967295
}
function rnd(seed: string, min: number, max: number, d = 0): number {
  const v = min + hash(seed) * (max - min)
  const p = Math.pow(10, d)
  return Math.round(v * p) / p
}

/* 生产单元（工序） */
export const productionUnits = ['绕线', '器身', '总装', '成品', '公共'] as const

/* 车间产线（能耗/核算筛选用） */
export const workshopLines = [
  '1#车间美变产线',
  '2#车间配变产线',
  '3#车间干变产线',
  '4#车间美变产线',
  '公用工程产线',
] as const

/** 某型号涉及生产的各经营单位核算均值（供 KPI 展示） */
export function accountingAverage(model: string, industry: string) {
  const rows = modelAccounting(model, industry).filter((r) => !r.isProject)
  const n = rows.length || 1
  const avg = (k: 'perUnit' | 'perFeature') => rows.reduce((s, r) => s + r[k], 0) / n
  const perUnit = Math.round(avg('perUnit'))
  const stages = stageBreakdown(perUnit)
  return {
    count: rows.length,
    perUnit,
    perFeature: Math.round(avg('perFeature') * 10000) / 10000,
    feature: rows[0]?.feature ?? 0,
    featureUnit: rows[0]?.featureUnit ?? '',
    produce: stages.find((s) => s.key === 'produce')!.value,
    produceRatio: stages.find((s) => s.key === 'produce')!.ratio,
  }
}

/* ---------- 产品订单：多能源用量明细（电/压缩空气/天然气 等） ---------- */
export type OrderEnergyRow = {
  type: string
  amount: number
  unit: string
  coef: number // 折标系数 kgce/单位
  kgce: number
}
export function orderEnergyDetail(seed: string): OrderEnergyRow[] {
  const totalKwh = rnd(`${seed}|oe-kwh`, 220, 620, 1)
  const gridRatio = rnd(`${seed}|oe-gr`, 0.55, 0.72, 3)
  const gridKwh = Math.round(totalKwh * gridRatio * 10) / 10
  const greenKwh = Math.round((totalKwh - gridKwh) * 10) / 10
  const air = rnd(`${seed}|oe-air`, 10, 42, 1)
  const gas = rnd(`${seed}|oe-gas`, 0, 26, 1)
  const mk = (type: string, amount: number, unit: string, coef: number): OrderEnergyRow => ({
    type,
    amount,
    unit,
    coef,
    kgce: Math.round(amount * coef * 100) / 100,
  })
  return [
    mk('市电', gridKwh, 'kWh', 0.1229),
    mk('绿电', greenKwh, 'kWh', 0.1229),
    mk('压缩空气', air, 'Nm³', 0.04),
    mk('天然气', gas, 'm³', 1.214),
  ]
}

/* ---------- 某型号在某经营单位的核算摘要 ---------- */
export type AcctSummary = {
  unit: string
  isProject: boolean
  perUnit: number // 单台产品碳足迹 kgCO2e/台
  perFeature: number // 单位产品碳足迹 kgCO2e/特征量
  feature: number
  featureUnit: string
}

/** 某型号涉及生产的各经营单位核算结果 */
export function modelAccounting(model: string, industry: string): AcctSummary[] {
  const base = featureOf(model)
  return producingUnitsOf(model, industry).map((unit) => {
    const f = rnd(`${model}|${unit}|acct`, 0.86, 1.18, 3)
    const perUnit = Math.round(base.perUnit * 1000 * f) // kg/台
    return {
      unit,
      isProject: projectCompanies.includes(unit),
      perUnit,
      perFeature: Math.round((perUnit / base.feature) * 10000) / 10000,
      feature: base.feature,
      featureUnit: base.unit,
    }
  })
}

/* ---------- 生命周期阶段构成（kgCO2e + 占比） ---------- */
export type StageItem = { key: string; name: string; value: number; ratio: number }
export function stageBreakdown(perUnitKg: number): StageItem[] {
  return lifecycleStages.map((s) => ({
    key: s.key,
    name: s.name,
    value: Math.round(perUnitKg * s.ratio * 100) / 100,
    ratio: s.ratio,
  }))
}

/* ---------- 生产制造：各生产单元能耗碳排及占比（含市电/绿电） ---------- */
export type ProcCarbon = {
  name: string
  carbon: number // kgCO2e
  ratio: number
  energyKgce: number
  gridKwh: number
  greenKwh: number
  gridRatio: number
}
export function processCarbon(seed: string, produceKg: number): ProcCarbon[] {
  const weights = productionUnits.map((u) => rnd(`${seed}|${u}|w`, 0.5, 3, 3))
  const sum = weights.reduce((s, v) => s + v, 0)
  return productionUnits.map((name, i) => {
    const ratio = weights[i] / sum
    const carbon = Math.round(produceKg * ratio * 100) / 100
    const gridRatio = rnd(`${seed}|${name}|g`, 0.35, 0.72, 3)
    const totalKwh = Math.round(carbon * rnd(`${seed}|${name}|k`, 1.6, 2.4, 2))
    return {
      name,
      carbon,
      ratio: Math.round(ratio * 1000) / 1000,
      energyKgce: Math.round(totalKwh * 0.1229 * 100) / 100,
      gridKwh: Math.round(totalKwh * gridRatio),
      greenKwh: Math.round(totalKwh * (1 - gridRatio)),
      gridRatio: Math.round(gridRatio * 1000) / 1000,
    }
  })
}

/* ---------- 各原材料总碳排及占比（原材料获取 + 运输） ---------- */
export type MatCarbon = {
  name: string
  weight: number // kg
  acquire: number // kgCO2e
  transport: number // kgCO2e
  total: number
  ratio: number
}
const extraMaterials = ['缩醛漆包铜扁线', '油箱', '变压器油', '框架', '铜排']
export function materialCarbon(seed: string, materialKg: number): MatCarbon[] {
  const names = [...mainMaterials, ...extraMaterials].slice(0, 8)
  const raw = names.map((n) => ({ n, w: rnd(`${seed}|${n}|acq`, 0.4, 3, 3) }))
  const sum = raw.reduce((s, v) => s + v.w, 0)
  return raw
    .map(({ n, w }) => {
      const acquire = Math.round(materialKg * (w / sum) * 100) / 100
      const transport = Math.round(acquire * rnd(`${seed}|${n}|t`, 0.002, 0.04, 4) * 100) / 100
      const total = Math.round((acquire + transport) * 100) / 100
      return {
        name: n,
        weight: rnd(`${seed}|${n}|kg`, 30, 900, 1),
        acquire,
        transport,
        total,
        ratio: materialKg > 0 ? Math.round((total / materialKg) * 1000) / 1000 : 0,
      }
    })
    .sort((a, b) => b.total - a.total)
}

/* ============================================================
 * 数据追踪弹窗 4~5 页签明细
 * ============================================================ */

/* 原料获取碳：原材料 / 重量 / 重量来源(BOM) / 排放因子 / 因子来源 / 碳排放量 / 占比 */
export type AcquireRow = { name: string; weight: number; wsource: string; factor: number; fsource: string; carbon: number; ratio: number }
export function acquireTrace(seed: string, materialKg: number): AcquireRow[] {
  const mats = materialCarbon(seed, materialKg)
  const total = mats.reduce((s, m) => s + m.acquire, 0) || 1
  return mats.map((m) => ({
    name: m.name,
    weight: m.weight,
    wsource: 'BOM',
    factor: rnd(`${seed}|${m.name}|f`, 0.05, 4.2, 4),
    fsource: 'eFootprint 数据库',
    carbon: m.acquire,
    ratio: Math.round((m.acquire / total) * 1000) / 1000,
  }))
}

/* 原料运输碳：原材料 / 制造单位 / 重量 / 里程 / 运输方式 / 因子 / 来源 / 碳排 / 占比 */
export type TransportRow = {
  name: string
  maker: string
  weight: number
  distance: number
  mode: string
  factor: number
  fsource: string
  carbon: number
  ratio: number
}
const makers = ['南通启瑞', '珠峰硅钢', '国创电力', '鲁能材料', '西部铜业']
export function transportTrace(seed: string, materialKg: number): TransportRow[] {
  const mats = materialCarbon(seed, materialKg)
  const total = mats.reduce((s, m) => s + m.transport, 0) || 1
  return mats.map((m) => ({
    name: m.name,
    maker: makers[Math.floor(hash(`${seed}|${m.name}|mk`) * makers.length)],
    weight: m.weight,
    distance: rnd(`${seed}|${m.name}|d`, 1, 1200, 0),
    mode: '陆运-轻型货车',
    factor: 0.000083,
    fsource: 'CPCD',
    carbon: m.transport,
    ratio: Math.round((m.transport / total) * 1000) / 1000,
  }))
}

/* 生产制造碳：生产环节 → 生产工序 → 能源类型(市电/绿电) 的能耗因子级明细 */
const GRID_FACTOR = 0.5366 // 市电排放因子 kgCO2/kWh（国家温室气体数据库）
const GREEN_FACTOR = 0.05664 // 绿电排放因子 kgCO2/kWh（IPCC）
const stageProcesses: Record<string, string[]> = {
  绕线: ['特种变低压箔绕', '特种变低压检验', '特种变高压绕制'],
  器身: ['器身装配', '引线装配'],
  总装: ['总装入箱', '真空干燥'],
  成品: ['密封检验', '例行试验'],
  公共: ['公用工程'],
}
export type ManuRow = {
  stage: string // 生产环节
  process: string // 生产工序
  energy: '市电' | '绿电'
  unit: string
  amount: number // 用量 kWh
  convert: number // 能源转换 kgce（折标）
  factor: number
  fsource: string
  carbon: number
}
export function manufactureTrace(seed: string, produceKg: number): ManuRow[] {
  const procs = processCarbon(seed, produceKg)
  const rows: ManuRow[] = []
  procs.forEach((p) => {
    const processes = stageProcesses[p.name] ?? [p.name]
    // 将该生产环节的用量按工序权重拆分
    const w = processes.map((pr) => hash(`${seed}|${p.name}|${pr}`) + 0.3)
    const wsum = w.reduce((s, v) => s + v, 0)
    processes.forEach((pr, i) => {
      const share = w[i] / wsum
      const grid = Math.round(p.gridKwh * share * 100) / 100
      const green = Math.round(p.greenKwh * share * 100) / 100
      rows.push({
        stage: p.name,
        process: pr,
        energy: '市电',
        unit: 'kWh',
        amount: grid,
        convert: Math.round(grid * 0.1229 * 100) / 100,
        factor: GRID_FACTOR,
        fsource: '国家温室气体数据库',
        carbon: Math.round(grid * GRID_FACTOR * 100) / 100,
      })
      rows.push({
        stage: p.name,
        process: pr,
        energy: '绿电',
        unit: 'kWh',
        amount: green,
        convert: Math.round(green * 0.1229 * 100) / 100,
        factor: GREEN_FACTOR,
        fsource: 'IPCC',
        carbon: Math.round(green * GREEN_FACTOR * 100) / 100,
      })
    })
  })
  return rows
}
/* 生产制造碳合计：净碳排 = 总市电口径排放 - 绿电减排 */
export function manufactureTotals(rows: ManuRow[]) {
  const net = rows.reduce((s, r) => s + r.carbon, 0)
  const gridAll = rows.reduce((s, r) => s + r.amount * GRID_FACTOR, 0) // 全部按市电口径
  const greenReduction = rows.filter((r) => r.energy === '绿电').reduce((s, r) => s + r.amount * (GRID_FACTOR - GREEN_FACTOR), 0)
  return {
    net: Math.round(net * 100) / 100,
    gross: Math.round(gridAll * 100) / 100,
    reduction: Math.round(greenReduction * 100) / 100,
  }
}

/* 废弃物排放碳：年份 / 名称 / 重量 / 碳排放量 / 总碳排 / 总产量 / 单位产量碳排 */
export type WasteRow = {
  year: string
  name: string
  weight: number
  factor: number
  carbon: number // 单台
  totalCarbon: number // 批次总碳排
  output: number // 总产量（特征量）
  perFeature: number
}
const wasteTypes = [
  { name: '废钢材', factor: 0.0182 },
  { name: '废铜', factor: 0.0154 },
  { name: '废绝缘油', factor: 0.086 },
  { name: '包装废弃物', factor: 0.021 },
  { name: '危废(含油废料)', factor: 0.14 },
]
export function wasteTrace(seed: string, wasteKg: number, feature: number): WasteRow[] {
  const w = wasteTypes.map((t) => hash(`${seed}|${t.name}|ww`) + 0.2)
  const wsum = w.reduce((s, v) => s + v, 0)
  const qty = Math.max(1, Math.round(rnd(`${seed}|wqty`, 2, 9, 0)))
  return wasteTypes.map((t, i) => {
    const carbon = Math.round(wasteKg * (w[i] / wsum) * 100) / 100
    const weight = rnd(`${seed}|${t.name}|wkg`, 2, 60, 1)
    return {
      year: '2026',
      name: t.name,
      weight,
      factor: t.factor,
      carbon,
      totalCarbon: Math.round(carbon * qty * 100) / 100,
      output: Math.round(feature * qty),
      perFeature: feature > 0 ? Math.round((carbon / feature) * 100000) / 100000 : 0,
    }
  })
}

/* 产品订单明细：订单 / 原材料获取碳排 / 运输碳排 / 生产制造碳排 / 生产制造日期 */
export type OrderDetailRow = {
  order: string
  acquire: number
  transport: number
  produce: number
  window: string
}
export function orderDetailTrace(model: string, unit: string, industry: string): OrderDetailRow[] {
  const orders = ordersOf(model, unit, industry)
  return orders.map((o) => ({
    order: o.order,
    acquire: Math.round(o.material * 1000 * 100) / 100,
    transport: Math.round(o.transport * 1000 * 100) / 100,
    produce: Math.round(o.produce * 1000 * 100) / 100,
    window: o.plans[0]?.window ?? '—',
  }))
}

/* ============================================================
 * 能耗追踪
 * ============================================================ */
export type EnergyProfile = {
  totalKgce: number // 综合能耗 kgce（单台）
  perFeatureKgce: number // 单位产品能耗 kgce/特征量
  totalKwh: number
  gridKwh: number
  greenKwh: number
  gridRatio: number
  greenRatio: number
  airNm3: number // 压缩空气
  feature: number
  featureUnit: string
}
export function energyProfile(model: string, seed: string): EnergyProfile {
  const base = featureOf(model)
  const totalKwh = rnd(`${seed}|kwh`, 380, 640, 2)
  const gridRatio = rnd(`${seed}|gr`, 0.55, 0.72, 3)
  const gridKwh = Math.round(totalKwh * gridRatio * 100) / 100
  const greenKwh = Math.round((totalKwh - gridKwh) * 100) / 100
  const airNm3 = rnd(`${seed}|air`, 12, 40, 1)
  const elecKgce = totalKwh * 0.1229
  const airKgce = airNm3 * 0.04
  const totalKgce = Math.round((elecKgce + airKgce) * 100) / 100
  return {
    totalKgce,
    perFeatureKgce: Math.round((totalKgce / base.feature) * 10000) / 10000,
    totalKwh,
    gridKwh,
    greenKwh,
    gridRatio: Math.round(gridRatio * 1000) / 1000,
    greenRatio: Math.round((1 - gridRatio) * 1000) / 1000,
    airNm3,
    feature: base.feature,
    featureUnit: base.unit,
  }
}

export type EnergyStage = {
  name: string
  kgce: number
  ratio: number
  gridKwh: number
  greenKwh: number
  gridRatio: number
}
export function energyStages(seed: string, totalKgce: number): EnergyStage[] {
  const weights = productionUnits.map((u) => rnd(`${seed}|${u}|ew`, 0.4, 3.2, 3))
  const sum = weights.reduce((s, v) => s + v, 0)
  return productionUnits.map((name, i) => {
    const ratio = weights[i] / sum
    const kgce = Math.round(totalKgce * ratio * 100) / 100
    const kwh = kgce / 0.1229
    const gridRatio = rnd(`${seed}|${name}|eg`, 0.38, 0.7, 3)
    return {
      name,
      kgce,
      ratio: Math.round(ratio * 1000) / 1000,
      gridKwh: Math.round(kwh * gridRatio * 10) / 10,
      greenKwh: Math.round(kwh * (1 - gridRatio) * 10) / 10,
      gridRatio: Math.round(gridRatio * 1000) / 1000,
    }
  })
}

/* ---------- 某型号在各经营单位的能耗摘要（对齐 modelAccounting 结构） ---------- */
export type EnergySummary = {
  unit: string
  isProject: boolean
  perUnitKgce: number // 单台综合能耗 kgce/台
  perFeatureKgce: number // 单位产品能耗 kgce/特征量
  totalKwh: number
  gridKwh: number
  greenKwh: number
  feature: number
  featureUnit: string
}
export function modelEnergy(model: string, industry: string): EnergySummary[] {
  return producingUnitsOf(model, industry).map((unit) => {
    const prof = energyProfile(model, `${model}|${unit}|acct-e`)
    return {
      unit,
      isProject: projectCompanies.includes(unit),
      perUnitKgce: prof.totalKgce,
      perFeatureKgce: prof.perFeatureKgce,
      totalKwh: prof.totalKwh,
      gridKwh: prof.gridKwh,
      greenKwh: prof.greenKwh,
      feature: prof.feature,
      featureUnit: prof.featureUnit,
    }
  })
}
export function energyAverage(model: string, industry: string) {
  const rows = modelEnergy(model, industry).filter((r) => !r.isProject)
  const n = rows.length || 1
  return {
    count: rows.length,
    perUnitKgce: Math.round((rows.reduce((s, r) => s + r.perUnitKgce, 0) / n) * 100) / 100,
    perFeatureKgce: Math.round((rows.reduce((s, r) => s + r.perFeatureKgce, 0) / n) * 10000) / 10000,
    feature: rows[0]?.feature ?? 0,
    featureUnit: rows[0]?.featureUnit ?? '',
  }
}

/* 经营单位地理分布（核算一张图 · 示意坐标 %） */
export type UnitGeo = { unit: string; industry: string; loc: string; x: number; y: number }
export const unitGeos: UnitGeo[] = [
  { unit: '衡变本部', industry: '变压器', loc: '湖南·衡阳', x: 62, y: 62 },
  { unit: '沈变本部', industry: '变压器', loc: '辽宁·沈阳', x: 82, y: 28 },
  { unit: '新变超高压', industry: '变压器', loc: '新���·昌吉', x: 22, y: 34 },
  { unit: '沈变康嘉', industry: '变压器', loc: '辽宁·沈阳', x: 84, y: 33 },
  { unit: '特变山东', industry: '变压器', loc: '山东·济南', x: 70, y: 45 },
  { unit: '德阳电装', industry: '变压器', loc: '四川·德阳', x: 48, y: 56 },
  { unit: '新疆线缆', industry: '线缆', loc: '新疆·昌吉', x: 25, y: 30 },
  { unit: '山东电缆', industry: '线缆', loc: '山东·青岛', x: 74, y: 44 },
  { unit: '衡阳线缆', industry: '线缆', loc: '湖南·衡阳', x: 63, y: 66 },
  { unit: '沈阳开关', industry: '开关', loc: '辽宁·沈阳', x: 80, y: 30 },
  { unit: '德阳开关', industry: '开关', loc: '四川·德阳', x: 46, y: 58 },
]
export const industryColor: Record<string, string> = {
  变压器: 'var(--chart-1)',
  线缆: 'var(--chart-3)',
  开关: 'var(--chart-4)',
}
