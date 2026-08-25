/* ============================================================
 * 数据采集需求清单
 * 依据《零碳园区集控中心 / 产品碳足迹集采中心数据需求清单》整理
 * 两类数据均从项目公司或工厂收集获取
 * ============================================================ */

export type DataKind = '静态数据' | '动态数据'
export type DataItem = {
  id: number
  kind: DataKind
  name: string // 数据项名称
  unit: string // 数据单位
  object: string // 数据对象：园区/工厂/重点设备/工序
  source: string // 数据来源
  usage: string // 用途
  freq: string // 采集频率 / 备注
}

/* -------------------- 零碳园区集控中心 -------------------- */
export const zeroCarbonDataItems: DataItem[] = [
  { id: 1, kind: '静态数据', name: '光伏装机量', unit: 'MW', object: '园区/工厂', source: '线下收集', usage: '大屏展示', freq: '多家工厂在一个园区的，提供园区整体数据' },
  { id: 2, kind: '静态数据', name: '变压器容量', unit: 'MVA', object: '园区/工厂', source: '线下收集', usage: '大屏展示', freq: '多家工厂在一个园区的，提供园区整体数据' },
  { id: 3, kind: '静态数据', name: '储能装机容量', unit: 'MW/MWh', object: '园区/工厂', source: '线下收集', usage: '大屏展示', freq: '多家工厂在一个园区的，提供园区整体数据' },
  { id: 4, kind: '静态数据', name: '园区照片', unit: '/', object: '园区/工厂', source: '线下收集', usage: '大屏展示', freq: '多家工厂在一个园区的，提供园区整体数据' },
  { id: 5, kind: '静态数据', name: '零碳关键事件', unit: '事件/时间', object: '园区/工厂', source: '线下收集', usage: '大屏展示', freq: '光伏并网、储能并网、碳足迹系统上线、零碳工厂申报、认证等' },
  { id: 6, kind: '动态数据', name: '零碳项目基本信息、照片', unit: '/', object: '园区/工厂', source: '系统界面手动录入', usage: '大屏展示、零碳项目评估', freq: '增量更新' },
  { id: 7, kind: '动态数据', name: '累计发电量', unit: 'MWh', object: '园区及工厂', source: '系统接入', usage: '大屏展示、集中监管、能效分析', freq: '15分钟' },
  { id: 8, kind: '动态数据', name: '累计充电量', unit: 'MWh', object: '园区及工厂', source: '系统接入', usage: '大屏展示、集中监管、能效分析', freq: '15分钟' },
  { id: 9, kind: '动态数据', name: '累计放电量', unit: 'MWh', object: '园区及工厂', source: '系统接入', usage: '大屏展示、集中监管、能效分析', freq: '15分钟' },
  { id: 10, kind: '动态数据', name: '累计市电电量', unit: 'MWh', object: '园区及工厂', source: '系统接入', usage: '大屏展示、集中监管、能效分析', freq: '15分钟' },
  { id: 11, kind: '动态数据', name: '累计消纳电量', unit: 'MWh', object: '园区及工厂', source: '系统接入', usage: '大屏展示、集中监管、能效分析', freq: '15分钟' },
  { id: 12, kind: '动态数据', name: '累计上网电量', unit: 'MWh', object: '园区及工厂', source: '系统接入', usage: '大屏展示、集中监管、能效分析', freq: '15分钟' },
  { id: 13, kind: '动态数据', name: '绿电累计收益', unit: '万元', object: '园区及工厂', source: '系统接入', usage: '大屏展示、集中监管、能效分析', freq: '15分钟' },
  { id: 14, kind: '动态数据', name: '累计负荷用电量', unit: 'MWh', object: '园区及工厂', source: '系统接入', usage: '大屏展示、集中监管、能效分析', freq: '15分钟' },
  { id: 15, kind: '动态数据', name: '购买绿电量', unit: 'MWh', object: '园区/工厂', source: '系统界面手动录入', usage: '大屏展示、集中监管、能效分析', freq: '月' },
  { id: 16, kind: '动态数据', name: '购买绿证量', unit: '个', object: '园区/工厂', source: '系统界面手动录入', usage: '大屏展示、集中监管、能效分析', freq: '月' },
  { id: 17, kind: '动态数据', name: '用水量', unit: 't', object: '工厂', source: '系统接入', usage: '集中监管、能效分析、统计报表', freq: '日' },
  { id: 18, kind: '动态数据', name: '天然气量', unit: 'm3', object: '工厂', source: '系统界面手动录入', usage: '集中监管、能效分析、统计报表', freq: '月度' },
  { id: 19, kind: '动态数据', name: '蒸汽消耗量', unit: 't', object: '工厂', source: '系统接入', usage: '集中监管、能效分析、统计报表', freq: '日' },
  { id: 20, kind: '动态数据', name: '外购热力', unit: 'GJ', object: '工厂', source: '系统接入', usage: '集中监管、能效分析、统计报表', freq: '日' },
  { id: 21, kind: '动态数据', name: '油消耗量（油、煤油、汽油）', unit: 'L', object: '工厂', source: '系统界面手动录入', usage: '集中监管、能效分析、统计报表', freq: '月度' },
  { id: 22, kind: '动态数据', name: '达到或优于能效强制国标 2 级的设备明细（名称、用途、功率等）', unit: 'kW', object: '工厂', source: '系统界面手动录入', usage: '集中监管', freq: '增量更新（纳入统计范围的装备需有适用的能效强制性国标）' },
  { id: 23, kind: '动态数据', name: '纳入统计范围装备明细（名称、用途、功率等）', unit: 'kW', object: '工厂', source: '系统界面手动录入', usage: '集中监管', freq: '增量更新' },
  { id: 24, kind: '动态数据', name: '工业增加值（月度、年度）', unit: '万元', object: '工厂', source: '系统界面手动录入', usage: '集中监管', freq: '月度' },
  { id: 25, kind: '动态数据', name: '产值', unit: '万元', object: '工厂', source: '大数据平台、经营日报管理系统接入', usage: '集中监管', freq: '月度' },
  { id: 26, kind: '动态数据', name: '产量（线缆，分产线）', unit: 'km', object: '工厂', source: '大数据平台', usage: '集中监管', freq: '周' },
  { id: 27, kind: '动态数据', name: '产量（变压器，项目公司）', unit: '/', object: '工厂', source: '系统界面手动录入', usage: '集中监管', freq: '周' },
  { id: 28, kind: '动态数据', name: '能自动采集的表计明细', unit: '块', object: '工厂', source: '系统接入', usage: '集中监管', freq: '日' },
  { id: 29, kind: '动态数据', name: '应该自动采集的表计数量（进出用能单位、进出主要次级用能单位和主要用能设备）', unit: '块', object: '工厂', source: '系统界面手动录入', usage: '集中监管', freq: '增量更新' },
  { id: 30, kind: '动态数据', name: '日负荷尖电量', unit: 'kWh', object: '园区及工厂', source: '系统接入', usage: '集中监管、能效分析', freq: '日' },
  { id: 31, kind: '动态数据', name: '日负荷峰电量', unit: 'kWh', object: '园区及工厂', source: '系统接入', usage: '集中监管、能效分析', freq: '日' },
  { id: 32, kind: '动态数据', name: '日负荷平电量', unit: 'kWh', object: '园区及工厂', source: '系统接入', usage: '集中监管、能效分析', freq: '日' },
  { id: 33, kind: '动态数据', name: '日负荷谷电量', unit: 'kWh', object: '园区及工厂', source: '系统接入', usage: '集中监管、能效分析', freq: '日' },
  { id: 34, kind: '动态数据', name: '日负荷深谷电量', unit: 'kWh', object: '园区及工厂', source: '系统接入', usage: '集中监管、能效分析', freq: '日' },
  { id: 35, kind: '动态数据', name: '新能源发电功率', unit: 'kW', object: '园区/工厂', source: '系统接入', usage: '集中监管、能效分析', freq: '15分钟' },
  { id: 36, kind: '动态数据', name: '总负荷功率', unit: 'kW', object: '园区/工厂', source: '系统接入', usage: '集中监管、能效分析', freq: '15分钟' },
  { id: 37, kind: '动态数据', name: '市电功率', unit: 'kW', object: '园区/工厂', source: '系统接入', usage: '集中监管、能效分析', freq: '15分钟' },
  { id: 38, kind: '动态数据', name: '储能充放电功率', unit: 'kW', object: '园区/工厂', source: '系统接入', usage: '集中监管、能效分析', freq: '15分钟' },
  { id: 39, kind: '动态数据', name: '储能系统 SOC', unit: '%', object: '园区/工厂', source: '系统接入', usage: '集中监管、能效分析', freq: '15分钟' },
  { id: 40, kind: '动态数据', name: '储能系统 SOH', unit: '%', object: '园区/工厂', source: '系统接入', usage: '集中监管、能效分析', freq: '15分钟' },
  { id: 41, kind: '动态数据', name: '重点设备用电功率', unit: 'kW', object: '重点设备', source: '系统接入', usage: '集中监管、能效分析', freq: '15分钟' },
  { id: 42, kind: '动态数据', name: '重点设备用电量', unit: 'kWh', object: '重点设备', source: '系统接入', usage: '集中监管、能效分析', freq: '15分钟' },
  { id: 43, kind: '动态数据', name: '重点设备尖用电量', unit: 'kWh', object: '重点设备', source: '系统接入', usage: '集中监管、能效分析', freq: '日' },
  { id: 44, kind: '动态数据', name: '重点设备峰用电量', unit: 'kWh', object: '重点设备', source: '系统接入', usage: '集中监管、能效分析', freq: '日' },
  { id: 45, kind: '动态数据', name: '重点设备平用电量', unit: 'kWh', object: '重点设备', source: '系统接入', usage: '集中监管、能效分析', freq: '日' },
  { id: 46, kind: '动态数据', name: '重点设备谷用电量', unit: 'kWh', object: '重点设备', source: '系统接入', usage: '集中监管、能效分析', freq: '日' },
  { id: 47, kind: '动态数据', name: '重点设备深谷用电量', unit: 'kWh', object: '重点设备', source: '系统接入', usage: '集中监管、能效分析', freq: '日' },
  { id: 48, kind: '动态数据', name: '用水费用', unit: '万元', object: '工厂', source: '录入', usage: '集中监管、能效分析、统计报表', freq: '月度' },
  { id: 49, kind: '动态数据', name: '天然气费用', unit: '万元', object: '工厂', source: '录入', usage: '集中监管、能效分析、统计报表', freq: '月度' },
  { id: 50, kind: '动态数据', name: '蒸汽费用', unit: '万元', object: '工厂', source: '录入', usage: '集中监管、能效分析、统计报表', freq: '月度' },
  { id: 51, kind: '动态数据', name: '外购热力费用', unit: '万元', object: '工厂', source: '录入', usage: '集中监管、能效分析、统计报表', freq: '月度' },
  { id: 52, kind: '动态数据', name: '油费用', unit: '万元', object: '工厂', source: '录入', usage: '集中监管、能效分析、统计报表', freq: '月度' },
  { id: 53, kind: '动态数据', name: '市电费用', unit: '万元', object: '工厂', source: '录入', usage: '集中监管、能效分析、统计报表', freq: '月度' },
  { id: 54, kind: '动态数据', name: '订单信息（订单基本信息、对应产量）', unit: '/', object: '工厂', source: '系统接入', usage: '集中监管、能效分析', freq: '日' },
  { id: 55, kind: '动态数据', name: '订单各类别能耗（关键工序能耗、非关键工序能耗）', unit: '/', object: '工厂', source: '系统接入', usage: '集中监管、能效分析', freq: '日' },
  { id: 56, kind: '动态数据', name: '关键工序能耗指标', unit: '/', object: '工序', source: '系统接入', usage: '集中监管、能效分析、统计报表', freq: '月度，根据各产业定义的关键工序指标上送数值及对应的分子、分母、统计周期' },
]

/* -------------------- 产品碳足迹集采中心 -------------------- */
export const carbonFootprintDataItems: DataItem[] = [
  { id: 1, kind: '动态数据', name: '开展主要产品碳足迹分析的产品类别', unit: '/', object: '工厂', source: '碳足迹系统获取', usage: '集中监管', freq: '月度' },
  { id: 2, kind: '动态数据', name: '主要产品类别', unit: '/', object: '工厂', source: 'ERP 系统获取', usage: '集中监管', freq: '月度' },
  { id: 3, kind: '动态数据', name: '产品碳足迹核算结果', unit: 'tCO2/台', object: '工厂', source: '本地碳足迹追踪及报告系统', usage: '集中监管、多维分析', freq: '月度' },
  { id: 4, kind: '动态数据', name: '产品碳足迹溯源依据数据', unit: '/', object: '工厂', source: '本地碳足迹追踪及报告系统', usage: '原始数据穿透', freq: '月度' },
  { id: 5, kind: '动态数据', name: '碳足迹报告信息', unit: '/', object: '工厂', source: '本地碳足迹追踪及报告系统', usage: '碳足迹报告、第三方认证', freq: '月度' },
  { id: 6, kind: '动态数据', name: 'BOM 与工艺路线数据', unit: '/', object: '工厂', source: 'ERP / MES 系统获取', usage: '碳足迹核算', freq: '增量更新' },
]

export const dataCatalogNote =
  '所需数据说明：产品及订单碳足迹的核算结果、溯源依据数据、碳足迹报告信息均来源于各经营单位本地的碳足迹追踪及报告系统，本地碳足迹系统会内嵌数据接口。各单位只需做好本地碳足迹系统的实施工作。'

/* 汇总统计（用于清单页概览卡片） */
export function catalogStats(items: DataItem[]) {
  const stat = items.reduce(
    (acc, it) => {
      acc.total += 1
      if (it.kind === '静态数据') acc.static += 1
      else acc.dynamic += 1
      if (it.source.includes('系统接入')) acc.auto += 1
      else if (it.source.includes('录入') || it.source.includes('线下')) acc.manual += 1
      return acc
    },
    { total: 0, static: 0, dynamic: 0, auto: 0, manual: 0 },
  )
  return stat
}
