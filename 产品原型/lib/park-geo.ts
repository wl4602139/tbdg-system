/* ============================================================
 * 双中心大屏 · 园区地理与指标数据
 * 依据《园区-工厂对应关系表》图，21 家经营单位归属如下园区。
 * 坐标为各园区所在省/市的近似经纬度 [lng, lat]，用于 GIS 地图布点。
 * 所有指标由确定性伪随机生成，保证每次渲染稳定。
 * ============================================================ */

export type ParkStage = '规划' | '在建' | '已认证'
export type ParkIndustry = '变压器' | '线缆' | '开关' | '电容器' | '综合'

export type ParkGeo = {
  id: string
  name: string // 园区全称
  short: string // 园区简称
  province: string
  city: string
  coordinates: [number, number] // [经度, 纬度]
  industry: ParkIndustry
  stage: ParkStage
  units: string[] // 归属经营单位
}

export const parkGeos: ParkGeo[] = [
  { id: 'dbsb', name: '特变电工东北输变电产业园', short: '东北输变电', province: '辽宁', city: '沈阳', coordinates: [123.43, 41.8], industry: '变压器', stage: '已认证', units: ['沈变本部', '智慧能源', '和新套管公司', '康嘉互感器', '印能公司'] },
  { id: 'nfsb', name: '特变电工南方输变电产业园', short: '南方输变电', province: '湖南', city: '衡阳', coordinates: [112.61, 26.9], industry: '变压器', stage: '在建', units: ['衡变本部'] },
  { id: 'ecy', name: '特变电工二次产业园区', short: '二次产业园', province: '江苏', city: '南京', coordinates: [118.8, 32.06], industry: '综合', stage: '在建', units: ['南京电研'] },
  { id: 'yj5g', name: '特变电工云集5G科技产业园', short: '云集5G', province: '湖南', city: '衡阳', coordinates: [112.78, 26.72], industry: '开关', stage: '在建', units: ['云集电气', '湖南电气', '云集高压开关'] },
  { id: 'zndq', name: '特变电工智能电气产业园', short: '智能电气', province: '新疆', city: '昌吉', coordinates: [87.42, 44.12], industry: '开关', stage: '已认证', units: ['新疆自控', '智能电气公司'] },
  { id: 'hnny', name: '特变电工湖南能源建设园区', short: '湖南能源建设', province: '湖南', city: '长沙', coordinates: [112.94, 28.23], industry: '综合', stage: '规划', units: ['特能建'] },
  { id: 'xazb', name: '特变电工西安智能装备产业园', short: '西安智能装备', province: '陕西', city: '西安', coordinates: [108.94, 34.34], industry: '电容器', stage: '在建', units: ['合容电气股份', '合容开关', '合容电力设备'] },
  { id: 'gil', name: '特变电工GIL产业园', short: 'GIL产业园', province: '陕西', city: '西安', coordinates: [108.72, 34.15], industry: '综合', stage: '在建', units: ['赛杰爱迪'] },
  { id: 'sbcp', name: '特变电工输变电产业园', short: '输变电产业园', province: '新疆', city: '昌吉', coordinates: [87.18, 43.9], industry: '变压器', stage: '已认证', units: ['超高压公司', '特变电工新疆线缆厂'] },
  { id: 'tb', name: '特变电工天变产业园', short: '天变产业园', province: '天津', city: '天津', coordinates: [117.2, 39.13], industry: '变压器', stage: '已认证', units: ['天变天津基地', '天变智慧能源', '天变智能科技', '天变衡阳基地', '天变沈阳基地'] },
  { id: 'jjj', name: '特变电工京津冀智能科技产业园', short: '京津冀智能科技', province: '河北', city: '廊坊', coordinates: [116.68, 39.53], industry: '综合', stage: '规划', units: ['京津冀公司', '珠峰硅钢', '智慧能源', '银利电气'] },
  { id: 'hd', name: '特变电工华东输变电科技产业园', short: '华东输变电', province: '山东', city: '济南', coordinates: [117.0, 36.65], industry: '线缆', stage: '在建', units: ['鲁缆本部', '智能公司', '昭和公司'] },
  { id: 'sg', name: '特变电工曙光电缆产业园', short: '曙光电缆', province: '河北', city: '邢台', coordinates: [114.5, 37.07], industry: '线缆', stage: '规划', units: ['曙光公司'] },
  { id: 'xjxl', name: '特变电工新疆线缆产业园', short: '新疆线缆', province: '新疆', city: '昌吉', coordinates: [87.05, 44.16], industry: '线缆', stage: '已认证', units: ['特变电工新疆电缆有限公司'] },
  { id: 'dy', name: '特变电工(德阳)电缆园区', short: '德阳电缆', province: '四川', city: '德阳', coordinates: [104.4, 31.13], industry: '线缆', stage: '在建', units: ['特变电工(德阳)电缆股份有限公司'] },
]

/* 阶段配色（品牌语义色） */
export const stageStyle: Record<ParkStage, { label: string; color: string; token: string }> = {
  规划: { label: '规划', color: 'var(--muted-foreground)', token: 'plan' },
  在建: { label: '在建', color: 'var(--warning)', token: 'building' },
  已认证: { label: '已认证', color: 'var(--success)', token: 'certified' },
}

/* 产业配色 */
export const parkIndustryColor: Record<ParkIndustry, string> = {
  变压器: 'var(--chart-1)',
  线缆: 'var(--chart-3)',
  开关: 'var(--chart-4)',
  电容器: 'var(--chart-5)',
  综合: 'var(--chart-2)',
}

/* ---------- 确定性伪随机 ---------- */
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

/* ---------- 集控中心大屏：园区零碳指标 ---------- */
export type ParkEnergyMetric = {
  carbonTotal: number // 总碳排放量 万tCO2
  intensity: number // 碳排放强度 tCO2/万元
  greenRatio: number // 绿电占比 %
  nonFossilRatio: number // 非化石能源占比 %
  saving: number // 年度累计节能量 万kWh
  pv: number // 屋顶光伏装机 MW
  storage: number // 储能装机 MWh
  generation: number // 累计发电量 MWh
  score: number // 综合评分
  progress: number // 建设进度 %
}
export function parkEnergy(p: ParkGeo): ParkEnergyMetric {
  const s = p.id
  const stageBase = p.stage === '已认证' ? 0.9 : p.stage === '在建' ? 0.62 : 0.32
  return {
    carbonTotal: rnd(`${s}|ct`, 1.8, 8.6, 2),
    intensity: rnd(`${s}|it`, 0.16, 0.36, 3),
    greenRatio: rnd(`${s}|gr`, 26, 68, 1),
    nonFossilRatio: rnd(`${s}|nf`, 30, 74, 1),
    saving: rnd(`${s}|sv`, 6, 32, 1),
    pv: rnd(`${s}|pv`, 2.2, 18.5, 1),
    storage: rnd(`${s}|st`, 4, 40, 1),
    generation: rnd(`${s}|gn`, 800, 9200, 0),
    score: Math.round(60 + stageBase * 35 + hash(`${s}|sc`) * 4),
    progress: p.stage === '已认证' ? 100 : Math.round(stageBase * 100),
  }
}

/* ---------- 集采中心大屏：园区产品碳足迹指标 ---------- */
export type ParkFootprintMetric = {
  footprintTotal: number // 产品碳足迹总量 万tCO2e
  unitIntensity: number // 单位产品碳强度 tCO2/万元
  analysisRatio: number // 产品碳足迹分析占比 %
  modelCount: number // 产品型号数
  certifiedCount: number // 已认证型号数
  orders: number // 实景库订单
  meanFootprint: number // 碳足迹均值 tCO2/台套
}
export function parkFootprint(p: ParkGeo): ParkFootprintMetric {
  const s = p.id
  const modelCount = rnd(`${s}|mc`, 8, 42, 0)
  const certRatio = p.stage === '已认证' ? rnd(`${s}|cr`, 0.55, 0.85, 2) : p.stage === '在建' ? rnd(`${s}|cr`, 0.3, 0.55, 2) : rnd(`${s}|cr`, 0.08, 0.3, 2)
  return {
    footprintTotal: rnd(`${s}|ft`, 0.8, 6.2, 2),
    unitIntensity: rnd(`${s}|ui`, 0.15, 0.36, 3),
    analysisRatio: rnd(`${s}|ar`, 38, 96, 1),
    modelCount,
    certifiedCount: Math.round(modelCount * certRatio),
    orders: rnd(`${s}|od`, 320, 4200, 0),
    meanFootprint: rnd(`${s}|mf`, 0.42, 3.6, 2),
  }
}

/* 单位碳强度三档色阶：绿 <0.22 / 黄 0.22~0.30 / 红 >0.30 */
export function intensityColor(v: number): string {
  if (v < 0.22) return 'var(--success)'
  if (v <= 0.3) return 'var(--warning)'
  return 'var(--destructive)'
}
