/* ============================================================
 * 产品碳足迹集采中心 · 特变电工电装集团业务数据模型
 * 级联维度：产业 → 产线 → 产品类别 → 产品型号 → 经营单位 → 生产订单 → 生产计划
 * 计量：变压器最小计量单位/特征量 = kVA；单位产品碳足迹 = kgCO2/kVA
 * 所有数值由确定性伪随机生成，保证每次渲染稳定
 * ============================================================ */

/* ---------- 确定性伪随机 ---------- */
function hash(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) / 4294967295
}
/** 以 seed 在 [min,max] 生成稳定数值 */
function rnd(seed: string, min: number, max: number, decimals = 0): number {
  const v = min + hash(seed) * (max - min)
  const p = Math.pow(10, decimals)
  return Math.round(v * p) / p
}

/* ---------- 级联结构：产业 → 产线 → 产品类别 → 产品型号 ---------- */
export type CategoryMap = Record<string, string[]>
export type LineMap = Record<string, CategoryMap>
export type IndustryMap = Record<string, LineMap>

export const cascade: IndustryMap = {
  变压器: {
    高压产线: {
      电力变压器: ['SFZ11-110', 'SFSZ11-110', 'SZ11-220', 'SFP-360'],
      特种变压器: ['OSFPS-360', 'SFZ-330'],
    },
    中低压产线: {
      电力变压器: ['SZ11-1600', 'S13-M-800'],
      干式变压器: ['SCB13-1600', 'SGB11-2000'],
    },
  },
  线缆: {
    高压产线: {
      交联电缆: ['YJV-8.7/15', 'YJV22-26/35', 'YJV-64/110'],
    },
    中低压产线: {
      架空导线: ['LGJ-240', 'JL/G1A-300'],
    },
  },
  开关: {
    高压产线: {
      户外开关: ['ZW32-12', 'LW3-12'],
      GIS: ['ZF12-126'],
    },
  },
}

export const industries = Object.keys(cascade)
export function linesOf(ind: string) {
  return Object.keys(cascade[ind] ?? {})
}
export function categoriesOf(ind: string, line: string) {
  return Object.keys(cascade[ind]?.[line] ?? {})
}
export function modelsOf(ind: string, line: string, cat: string) {
  return cascade[ind]?.[line]?.[cat] ?? []
}
/** 某产业下全部型号（红黑榜用） */
export function allModelsOf(ind: string): { model: string; line: string; category: string }[] {
  const out: { model: string; line: string; category: string }[] = []
  for (const line of linesOf(ind)) {
    for (const cat of categoriesOf(ind, line)) {
      for (const model of modelsOf(ind, line, cat)) out.push({ model, line, category: cat })
    }
  }
  return out
}

/* ---------- 组织结构：电装集团 → 二级单位 → 三级经营单位（部分含下级基地/子公司） ---------- */
export type OrgNode = { name: string; industry?: string; park?: string; children?: OrgNode[] }
export const orgTree: OrgNode[] = [
  {
    name: '沈变公司',
    industry: '变压器',
    children: [
      { name: '沈变本部', park: '特变电工东北输变电产业园' },
      { name: '沈变智慧能源', park: '特变电工东北输变电产业园' },
      { name: '和新套管公司', park: '特变电工东北输变电产业园' },
      { name: '康嘉互感器', park: '特变电工东北输变电产业园' },
      { name: '印能公司', park: '特变电工东北输变电产业园' },
    ],
  },
  {
    name: '衡变公司',
    industry: '变压器',
    children: [
      { name: '衡变本部', park: '特变电工南方输变电产业园' },
      { name: '南京电研', park: '特变电工二次产业园区' },
      { name: '云集电气', park: '特变电工云集5G科技产业园' },
      { name: '湖南电气', park: '特变电工云集5G科技产业园' },
      { name: '云集高压开关', industry: '开关', park: '特变电工云集5G科技产业园' },
      { name: '新疆自控', park: '特变电工智能电气产业园' },
      { name: '上开', industry: '开关' },
      { name: '柯贝尔' },
      { name: '特能建', park: '特变电工湖南能源建设园区' },
      {
        name: '合容电气',
        industry: '开关',
        park: '特变电工西安智能装备产业园',
        children: [{ name: '合容电气股份' }, { name: '合容开关' }, { name: '合容电力设备' }],
      },
      { name: '赛杰爱迪', industry: '开关', park: '特变电工GIL产业园' },
    ],
  },
  {
    name: '新变厂',
    industry: '变压器',
    children: [
      { name: '超高压公司', park: '特变电工输变电产业园' },
      {
        name: '天变公司',
        park: '特变电工天变产业园',
        children: [{ name: '天变天津基地' }, { name: '天变智慧能源' }, { name: '天变智能科技' }, { name: '天变衡阳基地' }, { name: '天变沈阳基地' }],
      },
      { name: '智能电气公司', park: '特变电工智能电气产业园' },
      { name: '京津冀公司', park: '特变电工京津冀智能科技产业园' },
      { name: '珠峰硅钢', park: '特变电工京津冀智能科技产业园' },
      { name: '新变智慧能源', park: '特变电工京津冀智能科技产业园' },
      { name: '银利电气', park: '特变电工京津冀智能科技产业园' },
    ],
  },
  {
    name: '鲁缆公司',
    industry: '线缆',
    children: [
      { name: '鲁缆本部', park: '特变电工华东输变电科技产业园' },
      { name: '智缆公司', park: '特变电工华东输变电科技产业园' },
      { name: '昭和公司', park: '特变电工华东输变电科技产业园' },
      { name: '曙光公司', park: '特变电工曙光电缆产业园' },
    ],
  },
  {
    name: '新缆厂',
    industry: '线缆',
    children: [
      { name: '特变电工新疆电缆有限公司', park: '特变电工新疆电缆产业园' },
      { name: '特变电工新疆线缆厂', park: '特变电工输变电产业园' },
    ],
  },
  {
    name: '德缆公司',
    industry: '线缆',
    children: [{ name: '特变电工(德阳)电缆股份有限公司', park: '特变电工(德阳)电缆园区' }],
  },
]

/** 叶子经营单位（含所属产业，继承上级） */
export type LeafUnit = { name: string; industry: string; parent: string; park?: string }
function collectLeaves(nodes: OrgNode[], inheritedInd: string, parent: string, inheritedPark?: string, out: LeafUnit[] = []) {
  for (const n of nodes) {
    const ind = n.industry ?? inheritedInd
    const park = n.park ?? inheritedPark
    if (n.children?.length) collectLeaves(n.children, ind, n.name, park, out)
    else out.push({ name: n.name, industry: ind, parent, park })
  }
  return out
}
export const leafUnits: LeafUnit[] = collectLeaves(orgTree, '变压器', '特变电工电装集团')

/** 某组织节点下的全部叶子经营单位名称（节点名可为任意层级；叶子返回自身） */
export function findOrgNode(name: string, nodes: OrgNode[] = orgTree): OrgNode | null {
  for (const n of nodes) {
    if (n.name === name) return n
    if (n.children) {
      const f = findOrgNode(name, n.children)
      if (f) return f
    }
  }
  return null
}
export function leavesUnder(name: string): string[] {
  const node = findOrgNode(name)
  if (!node) return []
  if (!node.children?.length) return [node.name]
  return collectLeaves(node.children, node.industry ?? '变压器', node.name, node.park).map((l) => l.name)
}
export function industryOfUnit(unit: string) {
  return leafUnits.find((l) => l.name === unit)?.industry ?? '变压器'
}

/* ---------- 经营单位（按产业归属：叶子经营单位） ---------- */
export const unitsByIndustry: Record<string, string[]> = leafUnits.reduce<Record<string, string[]>>((acc, l) => {
  ;(acc[l.industry] ??= []).push(l.name)
  return acc
}, {})
export function unitsOf(ind: string) {
  return unitsByIndustry[ind] ?? []
}
/** 某型号实际有生产记录的经营单位（并非所有单位都生产所有型号，至少保留 3 家） */
export function producingUnitsOf(model: string, ind: string) {
  const all = unitsOf(ind)
  const picked = all.filter((u) => hash(`${model}|${u}|produce?`) > 0.42)
  if (picked.length >= 3) return picked
  return all.slice(0, Math.min(3, all.length))
}

/* 历史遗留：项目公司概念已取消，统一按经营单位展示 */
export const projectCompanies: string[] = []

/* ---------- 型号基准（单台 tCO2/台 & 特征量 kVA） ---------- */
const modelBase: Record<string, { perUnit: number; feature: number; unit: string; voltage?: number }> = {
  'SFZ11-110': { perUnit: 9.0, feature: 110000, unit: 'kVA', voltage: 110 },
  'SFSZ11-110': { perUnit: 9.6, feature: 120000, unit: 'kVA', voltage: 110 },
  'SZ11-220': { perUnit: 16.4, feature: 240000, unit: 'kVA', voltage: 220 },
  'SFP-360': { perUnit: 22.8, feature: 360000, unit: 'kVA', voltage: 330 },
  'OSFPS-360': { perUnit: 24.1, feature: 360000, unit: 'kVA', voltage: 500 },
  'SFZ-330': { perUnit: 20.5, feature: 330000, unit: 'kVA', voltage: 330 },
  'SZ11-1600': { perUnit: 1.84, feature: 1600, unit: 'kVA', voltage: 10 },
  'S13-M-800': { perUnit: 1.02, feature: 800, unit: 'kVA', voltage: 10 },
  'SCB13-1600': { perUnit: 1.46, feature: 1600, unit: 'kVA', voltage: 10 },
  'SGB11-2000': { perUnit: 1.72, feature: 2000, unit: 'kVA', voltage: 10 },
  'YJV-8.7/15': { perUnit: 1.2, feature: 1000, unit: 'km' },
  'YJV22-26/35': { perUnit: 2.15, feature: 1000, unit: 'km' },
  'YJV-64/110': { perUnit: 3.4, feature: 1000, unit: 'km' },
  'LGJ-240': { perUnit: 0.9, feature: 1000, unit: 'km' },
  'JL/G1A-300': { perUnit: 1.05, feature: 1000, unit: 'km' },
  'ZW32-12': { perUnit: 0.66, feature: 1, unit: '台' },
  'LW3-12': { perUnit: 0.72, feature: 1, unit: '台' },
  'ZF12-126': { perUnit: 3.8, feature: 1, unit: '台' },
}
export function featureOf(model: string) {
  return modelBase[model] ?? { perUnit: 5, feature: 1000, unit: 'kVA', voltage: undefined }
}
/** 变压器规格：电压等级(kV) + 容量（自动 kVA/MVA 显示） */
export function transformerSpec(model: string): { voltage: string; capacity: string } | null {
  const b = modelBase[model]
  if (!b || b.voltage == null) return null
  const capacity = b.feature >= 1000 ? `${(b.feature / 1000).toLocaleString()} MVA` : `${b.feature.toLocaleString()} kVA`
  return { voltage: `${b.voltage} kV`, capacity }
}

/* ---------- 生命周期阶段构成（占比，主材=原材料获取） ---------- */
export const lifecycleStages = [
  { key: 'material', name: '原材料获取', ratio: 0.62 },
  { key: 'transport', name: '原材料运输', ratio: 0.09 },
  { key: 'produce', name: '生产制造', ratio: 0.21 },
  { key: 'waste', name: '废弃物处理', ratio: 0.08 },
] as const

/* ---------- 核心：某型号 × 各经营单位 指标矩阵 ---------- */
export type UnitMetric = {
  unit: string
  isProject: boolean
  perUnit: number // 单台产品碳足迹 tCO2/台
  perKva: number // 单位产品碳足迹 kgCO2/kVA（或对应特征量单位）
  material: number // 原材料获取(主材) tCO2/台
  transport: number
  produce: number // 生产制造 tCO2/台
  waste: number
  lifecycle: number // 全生命周期 tCO2/台
  qty: number // 产品数（台/km）
  orders: number // 生产订单数
  lines: number // 车间产线数量
  feature: number // 特征量
  featureUnit: string
}

export function unitMetrics(model: string, industry: string): UnitMetric[] {
  const base = featureOf(model)
  return producingUnitsOf(model, industry).map((unit) => {
    // 单位效率因子 0.86 ~ 1.18（越低越好）
    const f = rnd(`${model}|${unit}|eff`, 0.86, 1.18, 3)
    const perUnit = Math.round(base.perUnit * f * 1000) / 1000
    const material = Math.round(perUnit * lifecycleStages[0].ratio * 1000) / 1000
    const transport = Math.round(perUnit * lifecycleStages[1].ratio * 1000) / 1000
    const produce = Math.round(perUnit * lifecycleStages[2].ratio * 1000) / 1000
    const waste = Math.round((perUnit - material - transport - produce) * 1000) / 1000
    // 单位产品碳足迹：单台 tCO2 → kgCO2 / 特征量
    const perKva = Math.round(((perUnit * 1000) / base.feature) * 10000) / 10000
    return {
      unit,
      isProject: projectCompanies.includes(unit),
      perUnit,
      perKva,
      material,
      transport,
      produce,
      waste,
      lifecycle: Math.round(perUnit * 1.12 * 1000) / 1000, // 含使用/回收
      qty: rnd(`${model}|${unit}|qty`, 12, 96, 0),
      orders: rnd(`${model}|${unit}|ord`, 3, 18, 0),
      lines: rnd(`${model}|${unit}|lines`, 1, 4, 0),
      feature: base.feature,
      featureUnit: base.unit,
    }
  })
}

/* ---------- 排序指标定义（横向对比·排序内容切换） ---------- */
export const sortMetrics = [
  { key: 'perKva', name: '单位产品碳足迹', unit: 'kgCO2/kVA' },
  { key: 'perUnit', name: '单台产品碳足迹', unit: 'tCO2/台' },
  { key: 'material', name: '原材料获取阶段碳排', unit: 'tCO2/台' },
  { key: 'produce', name: '生产制造阶段碳排', unit: 'tCO2/台' },
] as const
export type SortMetricKey = (typeof sortMetrics)[number]['key']

/* ---------- 生产订单 & 生产计划（下钻用） ---------- */
export type ProdPlan = {
  plan: string
  window: string
  qty: number
  perUnit: number
  material: number
  produce: number
  transport: number
  waste: number
}
export type ProdOrder = {
  order: string
  customer: string
  qty: number
  perUnit: number
  material: number
  produce: number
  transport: number
  waste: number
  plans: ProdPlan[]
}

const customers = ['国家电网湖南', '南方电网广东', 'EU-TRANS GmbH', '中电装备', '华能新能源', '国网江苏']

export function ordersOf(model: string, unit: string, industry: string): ProdOrder[] {
  const base = featureOf(model)
  const m = unitMetrics(model, industry).find((x) => x.unit === unit)
  const perUnit = m?.perUnit ?? base.perUnit
  const n = 3 + Math.floor(hash(`${model}|${unit}|orders`) * 3) // 3~5 单
  return Array.from({ length: n }, (_, i) => {
    const oid = `SO-${2607 + i}${String(10 + i * 3).slice(-2)}`
    const of = rnd(`${model}|${unit}|${oid}|f`, 0.94, 1.08, 3)
    const opu = Math.round(perUnit * of * 1000) / 1000
    const qty = rnd(`${model}|${unit}|${oid}|q`, 2, 12, 0)
    const planN = 1 + Math.floor(hash(`${oid}|plans`) * 2) // 1~2 个生产计划
    const plans: ProdPlan[] = Array.from({ length: planN }, (_, j) => {
      const pid = `PL-${oid.slice(3)}-0${j + 1}`
      const pf = rnd(`${pid}|f`, 0.95, 1.06, 3)
      const ppu = Math.round(opu * pf * 1000) / 1000
      return {
        plan: pid,
        window: `07-${15 + j * 13} → 07-${28 + j * 13}`.replace('07-41', '08-10'),
        qty: Math.max(1, Math.round(qty / planN)),
        perUnit: ppu,
        material: Math.round(ppu * lifecycleStages[0].ratio * 1000) / 1000,
        produce: Math.round(ppu * lifecycleStages[2].ratio * 1000) / 1000,
        transport: Math.round(ppu * lifecycleStages[1].ratio * 1000) / 1000,
        waste: Math.round(ppu * lifecycleStages[3].ratio * 1000) / 1000,
      }
    })
    return {
      order: oid,
      customer: customers[Math.floor(hash(`${oid}|cust`) * customers.length)],
      qty,
      perUnit: opu,
      material: Math.round(opu * lifecycleStages[0].ratio * 1000) / 1000,
      produce: Math.round(opu * lifecycleStages[2].ratio * 1000) / 1000,
      transport: Math.round(opu * lifecycleStages[1].ratio * 1000) / 1000,
      waste: Math.round(opu * lifecycleStages[3].ratio * 1000) / 1000,
      plans,
    }
  })
}

/* ---------- 主材构成（订单/型号下钻 · 柱状对比） ---------- */
export const mainMaterials = ['硅钢片', '电解铜', '绝缘油', '绝缘纸板', '钢结构件']
export function materialBreakdown(seed: string): { name: string; value: number }[] {
  return mainMaterials.map((name) => ({
    name,
    value: rnd(`${seed}|${name}`, 120, 980, 0),
  }))
}
/* 生产环节构成 */
export const produceSteps = ['铁心叠装', '线圈绕制', '器身装配', '真空干燥', '总装试验']
export function produceBreakdown(seed: string): { name: string; value: number }[] {
  return produceSteps.map((name) => ({
    name,
    value: rnd(`${seed}|${name}`, 60, 420, 0),
  }))
}

/* ---------- 基准对比：车间产线 vs 基准值 ---------- */
export type WorkshopLine = {
  name: string // 车间产线
  unit: string // 所属经营单位
  perUnit: number // 单台碳足迹 tCO2/台
  material: number // 主材碳排 tCO2/台
  produce: number // 生产环节碳排 tCO2/台
}
/* 各维度基准值 */
export const benchmarkValues = { perUnit: 9.0, material: 5.4, produce: 1.9 }

export function workshopLines(model: string, industry: string): WorkshopLine[] {
  const units = unitsOf(industry)
  const names = ['一号总装线', '二号总装线', '高压试验线']
  const out: WorkshopLine[] = []
  units.slice(0, 4).forEach((unit) => {
    const cnt = 1 + Math.floor(hash(`${unit}|wsN`) * 2)
    for (let i = 0; i < cnt; i++) {
      const seed = `${model}|${unit}|${names[i]}`
      const f = rnd(seed, 0.82, 1.22, 3)
      const perUnit = Math.round(benchmarkValues.perUnit * f * 100) / 100
      out.push({
        name: `${unit}·${names[i]}`,
        unit,
        perUnit,
        material: Math.round(perUnit * 0.6 * 100) / 100,
        produce: Math.round(perUnit * 0.21 * 100) / 100,
      })
    }
  })
  return out
}

/* ---------- 高碳排热点 ---------- */
export const carbonHotspots = [
  {
    title: '真空干燥工序电耗偏高',
    line: '沈变本部·二号总装线',
    over: '+18.4%',
    tone: 'danger' as const,
    advice: '该工序单台电耗高于基准 18.4%，建议核查干燥罐保温层与真空泵运行策略，评估余热回收改造。',
  },
  {
    title: '硅钢片主材碳排超基准',
    line: '新变超高压·一号总装线',
    over: '+12.1%',
    tone: 'warn' as const,
    advice: '主材碳排高于基准 12.1%，主因供应商硅钢片因子偏高，建议切换 A 级低碳供应商或提升成材率。',
  },
  {
    title: '市电占比过高',
    line: '衡变本部·高压试验线',
    over: '+9.6%',
    tone: 'warn' as const,
    advice: '生产环节绿电占比不足，建议提升厂区分布式光伏自发自用比例并申购绿电。',
  },
]

/* ---------- 对外示范窗口 · 分产业均值趋势 ---------- */
export const industryMeanTrend = [
  { month: '3月', 变压器: 0.92, 线缆: 1.24, 开关: 0.71 },
  { month: '4月', 变压器: 0.9, 线缆: 1.2, 开关: 0.7 },
  { month: '5月', 变压器: 0.89, 线缆: 1.18, 开关: 0.69 },
  { month: '6月', 变压器: 0.87, 线缆: 1.15, 开关: 0.68 },
  { month: '7月', 变压器: 0.85, 线缆: 1.12, 开关: 0.67 },
  { month: '8月', 变压器: 0.84, 线缆: 1.1, 开关: 0.66 },
]

/* 状态判定：相对基准的达标度 */
export function benchTone(actual: number, benchmark: number, lowerBetter = true) {
  const ratio = actual / benchmark
  if (lowerBetter) {
    if (ratio <= 1.0) return 'ok' as const
    if (ratio <= 1.1) return 'warn' as const
    return 'danger' as const
  }
  if (ratio >= 1.0) return 'ok' as const
  if (ratio >= 0.9) return 'warn' as const
  return 'danger' as const
}
