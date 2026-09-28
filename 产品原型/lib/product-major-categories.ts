/**
 * 特变电工能碳数字化双中心 - 1级标准产品大类与2级产品中类权威映射中枢
 * 
 * 架构规范：
 * 1. 严格对齐系统设置【生产数据维护】中：
 *    - 【产品类型管理】: 14 项 1 级产品大类 + 32 项 2 级产品中类标准字典
 *    - 【产品型号管理】: 订单具体型号、制造工厂与大类中类的映射关系
 * 2. 彻底剥离旧有的“高压产线/超高压产线”车间级概念，全面升级为集团标准产品大类：
 *    - 变压器、高压组合电器 GIS、套管、互感器、电容器、开关柜设备、箱式变电站、
 *      高压电力电缆、中低压电力电缆、裸导线、特种电缆、橡套电缆、电气装备用电缆等
 * 3. 严格与组织树企业节点在【产品型号管理】中的投产范围联动过滤。
 */

import {
  PRODUCT_LINE_DICTIONARY,
  type ProductLineSubcategory,
} from './product-line-subcategories'

export interface MajorMetricSpec {
  unitSuffix: string
  energyVal: string
  elecVal: string
  steamVal?: string
  gasVal?: string
  waterVal?: string
  yoy: string
  isYoyDown: boolean
  hasSteam: boolean
  hasGas: boolean
  hasWater: boolean
}

/** 🌟 1. 各标准产品大类的 5 大指标基准规范 */
export const MAJOR_CATEGORY_METRICS: Record<string, MajorMetricSpec> = {
  '变压器': {
    unitSuffix: '万kVA',
    energyVal: '0.328',
    elecVal: '2,510.0',
    steamVal: '3.92',
    gasVal: '48.0',
    waterVal: '13.1',
    yoy: '-5.2%',
    isYoyDown: true,
    hasSteam: true,
    hasGas: true,
    hasWater: true,
  },
  '高压组合电器 GIS': {
    unitSuffix: '间隔',
    energyVal: '0.245',
    elecVal: '1,820.0',
    steamVal: undefined,
    gasVal: '24.0',
    waterVal: '6.5',
    yoy: '-4.6%',
    isYoyDown: true,
    hasSteam: false,
    hasGas: true,
    hasWater: true,
  },
  '套管': {
    unitSuffix: '支',
    energyVal: '0.062',
    elecVal: '415.0',
    steamVal: '0.85',
    gasVal: '12.0',
    waterVal: '1.8',
    yoy: '-4.8%',
    isYoyDown: true,
    hasSteam: true,
    hasGas: true,
    hasWater: true,
  },
  '互感器': {
    unitSuffix: '台',
    energyVal: '0.054',
    elecVal: '360.0',
    steamVal: '0.65',
    gasVal: '8.5',
    waterVal: '1.2',
    yoy: '-4.3%',
    isYoyDown: true,
    hasSteam: true,
    hasGas: true,
    hasWater: true,
  },
  '电容器': {
    unitSuffix: '台',
    energyVal: '0.038',
    elecVal: '285.0',
    steamVal: undefined,
    gasVal: undefined,
    waterVal: '0.9',
    yoy: '-3.9%',
    isYoyDown: true,
    hasSteam: false,
    hasGas: false,
    hasWater: true,
  },
  '开关柜设备': {
    unitSuffix: '面',
    energyVal: '0.029',
    elecVal: '210.0',
    steamVal: undefined,
    gasVal: undefined,
    waterVal: '0.6',
    yoy: '-3.8%',
    isYoyDown: true,
    hasSteam: false,
    hasGas: false,
    hasWater: true,
  },
  '箱式变电站': {
    unitSuffix: '台',
    energyVal: '0.155',
    elecVal: '1,150.0',
    steamVal: undefined,
    gasVal: '15.0',
    waterVal: '3.2',
    yoy: '-4.5%',
    isYoyDown: true,
    hasSteam: false,
    hasGas: true,
    hasWater: true,
  },
  '高压电力电缆': {
    unitSuffix: '万km·mm²',
    energyVal: '0.485',
    elecVal: '3,850.0',
    steamVal: undefined,
    gasVal: undefined,
    waterVal: '8.5',
    yoy: '-5.1%',
    isYoyDown: true,
    hasSteam: false,
    hasGas: false,
    hasWater: true,
  },
  '中低压电力电缆': {
    unitSuffix: '万km·mm²',
    energyVal: '0.305',
    elecVal: '2,420.0',
    steamVal: undefined,
    gasVal: undefined,
    waterVal: '5.2',
    yoy: '-4.7%',
    isYoyDown: true,
    hasSteam: false,
    hasGas: false,
    hasWater: true,
  },
  '裸导线': {
    unitSuffix: '吨',
    energyVal: '0.088',
    elecVal: '680.0',
    steamVal: undefined,
    gasVal: undefined,
    waterVal: '1.4',
    yoy: '-3.6%',
    isYoyDown: true,
    hasSteam: false,
    hasGas: false,
    hasWater: true,
  },
  '特种电缆': {
    unitSuffix: '万km·mm²',
    energyVal: '0.358',
    elecVal: '2,850.0',
    steamVal: undefined,
    gasVal: undefined,
    waterVal: '5.8',
    yoy: '-4.9%',
    isYoyDown: true,
    hasSteam: false,
    hasGas: false,
    hasWater: true,
  },
  '橡套电缆': {
    unitSuffix: '万km·mm²',
    energyVal: '0.412',
    elecVal: '3,120.0',
    steamVal: '1.20',
    gasVal: undefined,
    waterVal: '6.2',
    yoy: '-4.8%',
    isYoyDown: true,
    hasSteam: true,
    hasGas: false,
    hasWater: true,
  },
  '电气装备用电缆': {
    unitSuffix: '万km·mm²',
    energyVal: '0.248',
    elecVal: '1,950.0',
    steamVal: undefined,
    gasVal: undefined,
    waterVal: '3.8',
    yoy: '-4.2%',
    isYoyDown: true,
    hasSteam: false,
    hasGas: false,
    hasWater: true,
  },
}

/** 辅助去重收集子分类 */
function aggregateSubcategories(lines: string[]): ProductLineSubcategory[] {
  const seen = new Set<string>()
  const result: ProductLineSubcategory[] = []
  lines.forEach((l) => {
    const list = PRODUCT_LINE_DICTIONARY[l] || []
    list.forEach((sub) => {
      if (!seen.has(sub.code)) {
        seen.add(sub.code)
        result.push(sub)
      }
    })
  })
  return result
}

/** 🌟 2. 线缆产业标准 2 级中类数据集 (以电力驱动为主) */
const CABLE_SUB_TYPES: Record<string, ProductLineSubcategory[]> = {
  '高压电力电缆': [
    {
      id: 'sub-2001040101',
      code: '2001040101',
      name: '超高压交联电力电缆 (220kV)',
      fullDesc: '制造业-线缆产品-高压电力电缆-超高压交联电力电缆 (220kV)',
      lineName: '高压电力电缆',
      unitSuffix: '万km·mm²',
      energyVal: '0.485',
      energyUnit: 'tce/万km·mm²',
      elecVal: '3,850.0',
      elecUnit: 'kWh/万km·mm²',
      waterVal: '8.5',
      waterUnit: 't/万km·mm²',
      yoy: '-5.1%',
      isYoyDown: true,
      tipText: '考核统计期内【超高压交联电力电缆 (220kV)】立塔挤出与连续硫化综合单耗。',
      formula: 'e_sub = E_sub / M_sub',
      formulaDesc: '月度指标。e_sub: 综合单耗 (tce/万km·mm²)；E_sub: 消耗综合能源量；M_sub: 合格入库产量。',
      trendHistory: [],
    },
    {
      id: 'sub-2001040201',
      code: '2001040201',
      name: '高压交联电力电缆 (110kV)',
      fullDesc: '制造业-线缆产品-高压电力电缆-高压交联电力电缆 (110kV)',
      lineName: '高压电力电缆',
      unitSuffix: '万km·mm²',
      energyVal: '0.420',
      energyUnit: 'tce/万km·mm²',
      elecVal: '3,320.0',
      elecUnit: 'kWh/万km·mm²',
      waterVal: '7.2',
      waterUnit: 't/万km·mm²',
      yoy: '-4.8%',
      isYoyDown: true,
      tipText: '考核统计期内【高压交联电力电缆 (110kV)】综合单耗。',
      formula: 'e_sub = E_sub / M_sub',
      formulaDesc: '月度指标',
      trendHistory: [],
    },
    {
      id: 'sub-2001040301',
      code: '2001040301',
      name: '特高压电缆 (500kV 皱纹铝套)',
      fullDesc: '制造业-线缆产品-高压电力电缆-500kV 皱纹铝套特高压电力电缆',
      lineName: '高压电力电缆',
      unitSuffix: '万km·mm²',
      energyVal: '0.560',
      energyUnit: 'tce/万km·mm²',
      elecVal: '4,450.0',
      elecUnit: 'kWh/万km·mm²',
      waterVal: '9.8',
      waterUnit: 't/万km·mm²',
      yoy: '-5.4%',
      isYoyDown: true,
      tipText: '特高压 500kV 级电缆单耗。',
      formula: 'e_sub = E_sub / M_sub',
      formulaDesc: '月度指标',
      trendHistory: [],
    },
  ],
  '中低压电力电缆': [
    {
      id: 'sub-2001020101',
      code: '2001020101',
      name: '中压交联电力电缆 (8.7/15kV)',
      fullDesc: '制造业-线缆产品-中低压电力电缆-中压交联电力电缆 (8.7/15kV)',
      lineName: '中低压电力电缆',
      unitSuffix: '万km·mm²',
      energyVal: '0.305',
      energyUnit: 'tce/万km·mm²',
      elecVal: '2,420.0',
      elecUnit: 'kWh/万km·mm²',
      waterVal: '5.2',
      waterUnit: 't/万km·mm²',
      yoy: '-4.7%',
      isYoyDown: true,
      tipText: '中压 10kV~35kV 电力电缆单耗。',
      formula: 'e_sub = E_sub / M_sub',
      formulaDesc: '月度指标',
      trendHistory: [],
    },
    {
      id: 'sub-2001020201',
      code: '2001020201',
      name: '低压交联电力电缆 (0.6/1kV)',
      fullDesc: '制造业-线缆产品-中低压电力电缆-低压交联电力电缆 (0.6/1kV)',
      lineName: '中低压电力电缆',
      unitSuffix: '万km·mm²',
      energyVal: '0.245',
      energyUnit: 'tce/万km·mm²',
      elecVal: '1,940.0',
      elecUnit: 'kWh/万km·mm²',
      waterVal: '4.1',
      waterUnit: 't/万km·mm²',
      yoy: '-4.5%',
      isYoyDown: true,
      tipText: '低压 1kV 级电力电缆单耗。',
      formula: 'e_sub = E_sub / M_sub',
      formulaDesc: '月度指标',
      trendHistory: [],
    },
  ],
  '裸导线': [
    {
      id: 'sub-2001010101',
      code: '2001010101',
      name: '钢芯铝绞线 (JL/G1A)',
      fullDesc: '制造业-线缆产品-裸导线-钢芯铝绞线 (JL/G1A)',
      lineName: '裸导线',
      unitSuffix: '吨',
      energyVal: '0.088',
      energyUnit: 'tce/吨',
      elecVal: '680.0',
      elecUnit: 'kWh/吨',
      waterVal: '1.4',
      waterUnit: 't/吨',
      yoy: '-3.6%',
      isYoyDown: true,
      tipText: '考核统计期内每吨钢芯铝绞线大拉与绞合单耗。',
      formula: 'e_sub = E_sub / M_sub',
      formulaDesc: '月度指标',
      trendHistory: [],
    },
    {
      id: 'sub-2001010201',
      code: '2001010201',
      name: '铝合金绞线及高导电导线',
      fullDesc: '制造业-线缆产品-裸导线-铝合金绞线及高导电导线',
      lineName: '裸导线',
      unitSuffix: '吨',
      energyVal: '0.095',
      energyUnit: 'tce/吨',
      elecVal: '740.0',
      elecUnit: 'kWh/吨',
      waterVal: '1.6',
      waterUnit: 't/吨',
      yoy: '-3.8%',
      isYoyDown: true,
      tipText: '高强度铝合金架空导线单耗。',
      formula: 'e_sub = E_sub / M_sub',
      formulaDesc: '月度指标',
      trendHistory: [],
    },
  ],
  '特种电缆': [
    {
      id: 'sub-2001070101',
      code: '2001070101',
      name: '光伏专用电缆 (PV1-F/H1Z2Z2)',
      fullDesc: '制造业-线缆产品-特种电缆-光伏专用电缆 (PV1-F/H1Z2Z2)',
      lineName: '特种电缆',
      unitSuffix: '万km·mm²',
      energyVal: '0.358',
      energyUnit: 'tce/万km·mm²',
      elecVal: '2,850.0',
      elecUnit: 'kWh/万km·mm²',
      waterVal: '5.8',
      waterUnit: 't/万km·mm²',
      yoy: '-4.9%',
      isYoyDown: true,
      tipText: '双层辐照交联聚烯烃绝缘光伏电缆单耗。',
      formula: 'e_sub = E_sub / M_sub',
      formulaDesc: '月度指标',
      trendHistory: [],
    },
    {
      id: 'sub-2001070201',
      code: '2001070201',
      name: '风力发电耐扭曲电缆',
      fullDesc: '制造业-线缆产品-特种电缆-风力发电耐扭曲电缆',
      lineName: '特种电缆',
      unitSuffix: '万km·mm²',
      energyVal: '0.380',
      energyUnit: 'tce/万km·mm²',
      elecVal: '3,020.0',
      elecUnit: 'kWh/万km·mm²',
      waterVal: '6.1',
      waterUnit: 't/万km·mm²',
      yoy: '-5.0%',
      isYoyDown: true,
      tipText: '风电塔筒抗扭曲阻燃软电缆单耗。',
      formula: 'e_sub = E_sub / M_sub',
      formulaDesc: '月度指标',
      trendHistory: [],
    },
  ],
  '橡套电缆': [
    {
      id: 'sub-2001060101',
      code: '2001060101',
      name: '矿用阻燃橡套软电缆 (MY/MYPT)',
      fullDesc: '制造业-线缆产品-橡套电缆-矿用阻燃橡套软电缆 (MY/MYPT)',
      lineName: '橡套电缆',
      unitSuffix: '万km·mm²',
      energyVal: '0.412',
      energyUnit: 'tce/万km·mm²',
      elecVal: '3,120.0',
      elecUnit: 'kWh/万km·mm²',
      steamVal: '1.20',
      steamUnit: 'GJ/万km·mm²',
      waterVal: '6.2',
      waterUnit: 't/万km·mm²',
      yoy: '-4.8%',
      isYoyDown: true,
      tipText: '井下移动采煤机橡套软电缆连硫与硫化罐单耗。',
      formula: 'e_sub = E_sub / M_sub',
      formulaDesc: '月度指标',
      trendHistory: [],
    },
  ],
  '电气装备用电缆': [
    {
      id: 'sub-2001030101',
      code: '2001030101',
      name: '控制屏蔽电缆 (KVV/KVVP)',
      fullDesc: '制造业-线缆产品-电气装备用电缆-控制屏蔽电缆 (KVV/KVVP)',
      lineName: '电气装备用电缆',
      unitSuffix: '万km·mm²',
      energyVal: '0.248',
      energyUnit: 'tce/万km·mm²',
      elecVal: '1,950.0',
      elecUnit: 'kWh/万km·mm²',
      waterVal: '3.8',
      waterUnit: 't/万km·mm²',
      yoy: '-4.2%',
      isYoyDown: true,
      tipText: '工业二次回路多芯屏蔽控制电缆单耗。',
      formula: 'e_sub = E_sub / M_sub',
      formulaDesc: '月度指标',
      trendHistory: [],
    },
    {
      id: 'sub-2001050101',
      code: '2001050101',
      name: '聚氯乙烯绝缘电线 (BV/BVR)',
      fullDesc: '制造业-线缆产品-电气装备用电缆-聚氯乙烯绝缘电线 (BV/BVR)',
      lineName: '电气装备用电缆',
      unitSuffix: '万km·mm²',
      energyVal: '0.198',
      energyUnit: 'tce/万km·mm²',
      elecVal: '1,560.0',
      elecUnit: 'kWh/万km·mm²',
      waterVal: '3.0',
      waterUnit: 't/万km·mm²',
      yoy: '-4.0%',
      isYoyDown: true,
      tipText: '建筑与电气装备布电线单耗。',
      formula: 'e_sub = E_sub / M_sub',
      formulaDesc: '月度指标',
      trendHistory: [],
    },
  ],
}

/** 🌟 3. 全集团标准 1 级产品大类 ➔ 2 级产品中类字典 */
export const MAJOR_CATEGORY_DICTIONARY: Record<string, ProductLineSubcategory[]> = {
  '变压器': aggregateSubcategories([
    '高压产线',
    '超高压产线',
    '特高压产线',
    '配变产线（中特）',
    '配变产线（油变）',
    '配变产线（干变）',
    '电抗器产线（干式空心）',
    '硅钢产线（横剪）',
  ]),
  '高压组合电器 GIS': aggregateSubcategories(['GIS 产线', 'GIL 产线']),
  '套管': aggregateSubcategories(['套管产线']),
  '互感器': aggregateSubcategories(['互感器产线']),
  '电容器': aggregateSubcategories(['电容器产线（油浸式）', '电容器产线（干式）']),
  '开关柜设备': aggregateSubcategories(['开关柜产线', '二次产线']),
  '箱式变电站': aggregateSubcategories(['配变产线（箱变）']),
  '高压电力电缆': CABLE_SUB_TYPES['高压电力电缆'] || [],
  '中低压电力电缆': CABLE_SUB_TYPES['中低压电力电缆'] || [],
  '裸导线': CABLE_SUB_TYPES['裸导线'] || [],
  '特种电缆': CABLE_SUB_TYPES['特种电缆'] || [],
  '橡套电缆': CABLE_SUB_TYPES['橡套电缆'] || [],
  '电气装备用电缆': CABLE_SUB_TYPES['电气装备用电缆'] || [],
}

/** 🌟 4. 全系统组织架构节点与 1 级标准产品大类映射字典 (严格对齐型号管理投产实况) */
export const UNIT_TO_MAJOR_CATEGORIES_MAPPING: Record<string, string[]> = {
  // 集团级
  '特变电工': ['变压器', '高压组合电器 GIS', '套管', '互感器', '高压电力电缆', '中低压电力电缆', '特种电缆'],
  '电装集团': ['变压器', '高压组合电器 GIS', '套管', '互感器', '高压电力电缆', '中低压电力电缆', '特种电缆'],
  '全集团': ['变压器', '高压组合电器 GIS', '套管', '互感器', '高压电力电缆', '中低压电力电缆', '特种电缆'],

  // 1. 沈变公司体系
  '沈变公司': ['变压器', '套管', '互感器'],
  '沈变本部': ['变压器'],
  '和新套管': ['套管'],
  '和新套管公司': ['套管'],
  '康嘉互感器': ['互感器'],
  '智慧能源': [],
  '印能公司': [],
  '露娜智能制造': [],
  '露娜公司': [],

  // 2. 衡变公司体系
  '衡变公司': ['变压器', '高压组合电器 GIS', '电容器', '开关柜设备'],
  '衡变本部': ['变压器'],
  '云集高压开关': ['高压组合电器 GIS'],
  '云集': ['高压组合电器 GIS'],
  '合容电气': ['电容器'],
  '云集电气': ['开关柜设备'],
  '湖南电气': ['变压器', '箱式变电站'],
  '特能建': ['变压器'],
  '特缆建': ['变压器'],
  '南京电研': [],
  '南京公司': [],
  '上开': [],
  '新疆自控': ['开关柜设备'],
  '赛杰爱迪': ['高压组合电器 GIS'],

  // 3. 新变厂体系
  '新变厂': ['变压器', '箱式变电站'],
  '新变厂公司': ['变压器', '箱式变电站'],
  '超高压公司': ['变压器'],
  '天变公司': ['变压器', '箱式变电站'],
  '天变天津基地': ['变压器', '箱式变电站'],
  '天变衡阳基地': ['变压器'],
  '天变沈阳基地': ['变压器'],
  '天变智能科技': ['箱式变电站'],
  '智能电气': ['变压器', '箱式变电站'],
  '智能电气公司': ['变压器', '箱式变电站'],
  '京津冀科技': ['变压器', '箱式变电站'],
  '京津冀公司': ['变压器', '箱式变电站'],
  '珠峰硅钢': ['变压器'],
  '天变智慧能源': [],
  '银利电气': [],

  // 4. 鲁缆公司体系
  '鲁缆公司': ['高压电力电缆', '中低压电力电缆', '裸导线'],
  '鲁缆本部': ['高压电力电缆', '中低压电力电缆'],
  '昭和': ['裸导线'],
  '昭和公司': ['裸导线'],
  '曙光': ['特种电缆'],
  '曙光公司': ['特种电缆'],
  '智缆公司': [],

  // 5. 新缆厂体系
  '新缆厂': ['中低压电力电缆', '裸导线', '特种电缆'],
  '新缆厂本部': ['中低压电力电缆', '特种电缆'],
  '新疆线缆厂': ['中低压电力电缆', '特种电缆'],
  '特变电工新疆线缆厂': ['中低压电力电缆', '特种电缆'],
  '新疆电缆': ['中低压电力电缆', '特种电缆'],
  '特变电工新疆电缆有限公司': ['中低压电力电缆', '特种电缆'],
  '特种导线车间': ['裸导线'],

  // 6. 德缆公司体系
  '德缆公司': ['橡套电缆', '特种电缆', '电气装备用电缆'],
  '德缆公司本部': ['橡套电缆', '特种电缆', '电气装备用电缆'],
  '特变电工（德阳）电缆股份有限公司': ['橡套电缆', '特种电缆', '电气装备用电缆'],
  '德缆矿用电缆车间': ['橡套电缆'],
  '德缆特缆分厂': ['特种电缆'],
  '德缆本部制造区': ['电气装备用电缆'],
}

/** 🌟 5. 获取指定组织单位纳管的 1 级标准产品大类列表 */
export function getProductMajorsForUnit(unitName: string): string[] {
  if (!unitName) return []
  if (UNIT_TO_MAJOR_CATEGORIES_MAPPING[unitName]) {
    return UNIT_TO_MAJOR_CATEGORIES_MAPPING[unitName]
  }
  for (const [k, v] of Object.entries(UNIT_TO_MAJOR_CATEGORIES_MAPPING)) {
    if (unitName === k || (unitName.length >= 3 && k.includes(unitName)) || (k.length >= 3 && unitName.includes(k))) {
      return v
    }
  }
  // 未匹配的默认为变压器产业代表性大类
  return ['变压器']
}

/** 🌟 6. 获取指定产品大类下的 2 级产品中类列表 (支持搜索过滤) */
export function getSubcategoriesForMajor(majorName: string, searchKey = ''): ProductLineSubcategory[] {
  const items = MAJOR_CATEGORY_DICTIONARY[majorName] || []
  if (!searchKey || !searchKey.trim()) {
    return items
  }
  const q = searchKey.trim().toLowerCase()
  return items.filter(
    (it) =>
      it.name.toLowerCase().includes(q) ||
      it.code.toLowerCase().includes(q) ||
      it.fullDesc.toLowerCase().includes(q)
  )
}
