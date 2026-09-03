/**
 * 多维对标数据模型 —— 面向集团领导的零碳管理对标
 *
 * 核心：围绕「零碳工厂」的关键指标，在 5 个维度上互相对标，
 * 一眼看清各工厂/产线/产品种类/产品型号/生产计划与零碳标杆的差距与管理抓手。
 */

import { seedFactor } from './variant'

/* -------------------- 关键对标指标（零碳工厂关注项） -------------------- */
export interface BenchMetric {
  key: string
  name: string
  short: string
  unit: string
  benchmark: number // 零碳标杆值
  base: number // 生成基准
  lowerBetter: boolean // 越低越好
}

export const benchMetrics: BenchMetric[] = [
  { key: 'unitEnergy', name: '单位产品综合能耗', short: '单产能耗', unit: 'kgce/台', benchmark: 400, base: 430, lowerBetter: true },
  { key: 'outputEnergy', name: '单位产值能耗', short: '单位产值能耗', unit: 'tce/万元', benchmark: 0.3, base: 0.34, lowerBetter: true },
  { key: 'unitCarbon', name: '单位产品碳排放', short: '单产碳排', unit: 'kgCO2/台', benchmark: 900, base: 980, lowerBetter: true },
  { key: 'greenRatio', name: '绿电占比', short: '绿电占比', unit: '%', benchmark: 60, base: 52, lowerBetter: false },
  { key: 'pcf', name: '单位产品碳足迹', short: '产品碳足迹', unit: 'kgCO2e/台', benchmark: 1000, base: 1080, lowerBetter: true },
]

export const benchMetricByKey = Object.fromEntries(benchMetrics.map((m) => [m.key, m])) as Record<string, BenchMetric>

/* -------------------- 对标维度 -------------------- */
export interface BenchDimension {
  key: string
  name: string
  desc: string
  entityLabel: string
  metaLabel: string
  /** 生产计划维度：相同产品不同时间批次，用时间序列而非红黑榜 */
  temporal?: boolean
}

export const benchDimensions: BenchDimension[] = [
  { key: 'factory', name: '工厂', desc: '不同工厂横向对标', entityLabel: '工厂', metaLabel: '所属园区' },
  { key: 'line', name: '产线', desc: '同工厂 / 跨工厂产线对标', entityLabel: '产线', metaLabel: '所属工厂' },
  { key: 'category', name: '产品种类', desc: '不同产品种类对标', entityLabel: '产品种类', metaLabel: '主力工厂' },
  { key: 'model', name: '产品型号', desc: '同产线 / 跨产线型号对标', entityLabel: '产品型号', metaLabel: '所属产线' },
  { key: 'plan', name: '生产计划', desc: '相同产品·不同时间批次对标', entityLabel: '生产批次', metaLabel: '生产时间', temporal: true },
]

/* -------------------- 各维度实体 -------------------- */
interface RawEntity {
  id: string
  name: string
  meta: string
}

const factoryEntities: RawEntity[] = [
  { id: 'f-tj', name: '天津变压器厂', meta: '天津园区' },
  { id: 'f-hy', name: '衡阳电缆厂', meta: '衡阳园区' },
  { id: 'f-sy', name: '沈阳开关厂', meta: '沈阳园区' },
  { id: 'f-cj', name: '昌吉线缆厂', meta: '昌吉园区' },
  { id: 'f-xa', name: '西安互感器厂', meta: '西安园区' },
]

const lineEntities: RawEntity[] = [
  { id: 'l-tj-tr', name: '变压器总装线', meta: '天津变压器厂' },
  { id: 'l-tj-wind', name: '绕线制线', meta: '天津变压器厂' },
  { id: 'l-hy-cable', name: '交联电缆线', meta: '衡阳电缆厂' },
  { id: 'l-cj-wire', name: '特种线缆线', meta: '昌吉线缆厂' },
  { id: 'l-sy-switch', name: '开关装配线', meta: '沈阳开关厂' },
  { id: 'l-xa-ct', name: '互感器浇注线', meta: '西安互感器厂' },
]

const categoryEntities: RawEntity[] = [
  { id: 'c-tr', name: '电力变压器', meta: '天津变压器厂' },
  { id: 'c-cable', name: '电力电缆', meta: '衡阳电缆厂' },
  { id: 'c-switch', name: '高压开关', meta: '沈阳开关厂' },
  { id: 'c-wire', name: '特种线缆', meta: '昌吉线缆厂' },
  { id: 'c-ct', name: '互感器', meta: '西安互感器厂' },
]

const modelEntities: RawEntity[] = [
  { id: 'm-sg10', name: 'SG10-2500kVA 变压器', meta: '变压器总装线' },
  { id: 'm-s13', name: 'S13-M-800kVA 变压器', meta: '变压器总装线' },
  { id: 'm-yjv8', name: 'YJV-8.7/15kV 电缆', meta: '交联电缆线' },
  { id: 'm-yjv22', name: 'YJV22-26/35kV 电缆', meta: '交联电缆线' },
  { id: 'm-zw32', name: 'ZW32-12 户外真空开关', meta: '开关装配线' },
  { id: 'm-lw3', name: 'LW3-12 六氟化硫断路器', meta: '开关装配线' },
]

/* 生产计划：相同产品（SG10-2500kVA 变压器）不同时间批次 */
const planEntities: RawEntity[] = [
  { id: 'p-2024q1', name: '2024 Q1 批次', meta: '2024-03' },
  { id: 'p-2024q2', name: '2024 Q2 批次', meta: '2024-06' },
  { id: 'p-2024q3', name: '2024 Q3 批次', meta: '2024-09' },
  { id: 'p-2024q4', name: '2024 Q4 批次', meta: '2024-12' },
  { id: 'p-2025q1', name: '2025 Q1 批次', meta: '2025-03' },
]

const rawByDim: Record<string, RawEntity[]> = {
  factory: factoryEntities,
  line: lineEntities,
  category: categoryEntities,
  model: modelEntities,
  plan: planEntities,
}

/* -------------------- 数值生成 -------------------- */
function rnd(v: number, unit: string) {
  if (unit === 'tce/万元') return Math.round(v * 100) / 100
  if (unit === '%') return Math.round(v * 10) / 10
  return Math.round(v)
}

export interface BenchEntity {
  id: string
  name: string
  meta: string
  values: Record<string, number>
  yoy: Record<string, number> // 同比变化 %（正=数值上升）
}

function genEntity(dim: string, raw: RawEntity, idx: number, total: number): BenchEntity {
  const values: Record<string, number> = {}
  const yoy: Record<string, number> = {}
  for (const m of benchMetrics) {
    let f = seedFactor(dim, raw.id, m.key) // 0.72 ~ 1.28
    // 生产计划维度：随时间逐步改善（体现持续减碳）
    if (dim === 'plan') {
      const improve = 1.14 - (idx / Math.max(1, total - 1)) * 0.26 // 1.14 → 0.88
      f = m.lowerBetter ? improve : 2 - improve
    }
    let val = m.base * f
    if (m.key === 'greenRatio') val = Math.min(val, 82)
    values[m.key] = rnd(val, m.unit)
    // 同比：越好的方向给负向变化（能耗/碳排下降、绿电上升）
    const mag = 2 + (seedFactor(raw.id, m.key, 'yoy') - 0.72) / 0.56 * 10 // 2~12
    const improving = seedFactor(raw.id, m.key, 'dir') > 0.9
    if (m.lowerBetter) yoy[m.key] = +(improving ? -mag : mag * 0.5).toFixed(1)
    else yoy[m.key] = +(improving ? mag : -mag * 0.5).toFixed(1)
  }
  return { id: raw.id, name: raw.name, meta: raw.meta, values, yoy }
}

export const benchData: Record<string, BenchEntity[]> = Object.fromEntries(
  Object.entries(rawByDim).map(([dim, list]) => [dim, list.map((r, i) => genEntity(dim, r, i, list.length))]),
)

/* -------------------- 计算：达标率 / 差距 / 状态 / 得分 -------------------- */

/** 达标系数：>1 优于零碳标杆 */
export function achievement(value: number, m: BenchMetric): number {
  return m.lowerBetter ? m.benchmark / value : value / m.benchmark
}

/** 距零碳标杆差距（%）：正=仍需改进的差距，负=已优于标杆 */
export function gapPct(value: number, m: BenchMetric): number {
  const raw = m.lowerBetter ? (value - m.benchmark) / m.benchmark : (m.benchmark - value) / m.benchmark
  return +(raw * 100).toFixed(1)
}

export type BenchStatus = '优秀' | '正常' | '异常'
export function metricStatus(value: number, m: BenchMetric): BenchStatus {
  const a = achievement(value, m)
  if (a >= 1.0) return '优秀' // 已达到或优于零碳标杆
  if (a >= 0.85) return '正常'
  return '异常'
}

export function statusTone(s: BenchStatus): 'ok' | 'warn' | 'danger' {
  return s === '优秀' ? 'ok' : s === '正常' ? 'warn' : 'danger'
}

/** 零碳综合得分（0-100），由各关键指标达标度加权平均 */
export function compositeScore(values: Record<string, number>): number {
  const avg = benchMetrics.reduce((sum, m) => sum + Math.min(1.15, achievement(values[m.key], m)), 0) / benchMetrics.length
  return Math.round(Math.max(45, Math.min(99, avg * 86)))
}

/* -------------------- 维度聚合（供领导视角宏观卡片） -------------------- */
export interface DimSummary {
  avgScore: number
  reachCount: number // 达到零碳标杆的实体数（综合得分≥90）
  total: number
  avgGap: number // 平均距标杆差距（按综合得分口径）
  best: { name: string; score: number }
  worst: { name: string; score: number }
}

export function dimSummary(dim: string): DimSummary {
  const list = benchData[dim].map((e) => ({ name: e.name, score: compositeScore(e.values) }))
  const sorted = [...list].sort((a, b) => b.score - a.score)
  const avgScore = Math.round(list.reduce((s, e) => s + e.score, 0) / list.length)
  const reachCount = list.filter((e) => e.score >= 90).length
  return {
    avgScore,
    reachCount,
    total: list.length,
    avgGap: Math.max(0, 90 - avgScore),
    best: sorted[0],
    worst: sorted[sorted.length - 1],
  }
}

/** 按指标（或综合得分 'score'）对某维度排名，返回红黑榜数据 */
export interface RankRow extends BenchEntity {
  score: number
  metricValue: number
  metricGap: number
  status: BenchStatus
  rank: number
}

export function rankByMetric(dim: string, metricKey: string): RankRow[] {
  const m = benchMetricByKey[metricKey]
  const rows = benchData[dim].map((e) => {
    const score = compositeScore(e.values)
    if (metricKey === 'score') {
      return { ...e, score, metricValue: score, metricGap: Math.max(0, 90 - score), status: (score >= 90 ? '优秀' : score >= 78 ? '正常' : '异常') as BenchStatus, rank: 0 }
    }
    const value = e.values[metricKey]
    return { ...e, score, metricValue: value, metricGap: gapPct(value, m), status: metricStatus(value, m), rank: 0 }
  })
  // 排序：综合得分或越低越好指标升序表现最好
  rows.sort((a, b) => {
    if (metricKey === 'score') return b.metricValue - a.metricValue
    return m.lowerBetter ? a.metricValue - b.metricValue : b.metricValue - a.metricValue
  })
  rows.forEach((r, i) => (r.rank = i + 1))
  return rows
}
