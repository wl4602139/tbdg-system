/**
 * 特变电工能碳数字化双中心 - 全域主数据与元数据治理协同中枢 (Data Governance Hub)
 * 
 * 核心三位一体数据架构：
 * 1. 【基础数据管理 (Basic Data)】: 310 项全域底座数据字典（产量、能耗、工序、订单、计量点位）
 * 2. 【产品类型管理 (Product Type)】: 14 项 1 级产品大类 + 32 项 2 级产品中类标准分类与编码体系
 * 3. 【产品型号管理 (Product Model)】: 订单具体型号、制造工厂、两级类别台账与实物量生产映射
 * 
 * 本模块作为统一的业务与数据穿梭引擎，提供跨模块关系推导、关联查询与上下文导航支撑。
 */

import { INITIAL_BASIC_DATA, type BasicDataItem } from './basic-data-dictionary'
import {
  INITIAL_MAJOR_TYPES,
  INITIAL_SUB_TYPES,
  type ProductMajorType,
  type ProductSubType,
} from './product-type-data'
import {
  INITIAL_PRODUCT_MODEL_MAPPINGS,
  type ProductModelMappingItem,
  COMPANY_FACTORY_MAP,
} from './product-model-mapping'

export interface ModelRelationSummary {
  modelCount: number
  models: ProductModelMappingItem[]
  producingCompanies: string[]
  producingFactories: string[]
}

export interface LinkedBasicDataItem {
  code: string
  name: string
  category: string
  unit: string
  freq: string
  sourceChannel: string
  roleInProduct: string // 在该产品中的核算角色（如：订单实物产量、单位综合能耗、分时电耗指标等）
}

/** 1. 获取挂载在指定 1 级产品大类下的所有型号及生产实体 */
export function getModelsByMajorCode(
  majorCode: string,
  modelList: ProductModelMappingItem[] = INITIAL_PRODUCT_MODEL_MAPPINGS
): ModelRelationSummary {
  const models = modelList.filter((m) => m.erpMajorCategoryCode === majorCode)
  const companies = Array.from(new Set(models.map((m) => m.companyName)))
  const factories = Array.from(new Set(models.map((m) => m.factoryName)))
  return {
    modelCount: models.length,
    models,
    producingCompanies: companies,
    producingFactories: factories,
  }
}

/** 2. 获取挂载在指定 2 级产品中类下的所有型号及生产实体 */
export function getModelsBySubCode(
  subCode: string,
  modelList: ProductModelMappingItem[] = INITIAL_PRODUCT_MODEL_MAPPINGS
): ModelRelationSummary {
  const models = modelList.filter((m) => m.erpSubcategoryCode === subCode)
  const companies = Array.from(new Set(models.map((m) => m.companyName)))
  const factories = Array.from(new Set(models.map((m) => m.factoryName)))
  return {
    modelCount: models.length,
    models,
    producingCompanies: companies,
    producingFactories: factories,
  }
}

/** 3. 获取指定产品大类所绑定的核心基础数据项清单 (能耗、产量、订单与工序点位) */
export function getBasicDataForMajor(majorCode: string): LinkedBasicDataItem[] {
  const list: LinkedBasicDataItem[] = []

  // 通用产品核心能耗与产量项
  list.push({
    code: 'OUT-009',
    name: '订单产量（按型号）',
    category: '产量数据',
    unit: '按品种',
    freq: '月更新',
    sourceChannel: '集控平台人工填报',
    roleInProduct: '订单完工入库实物量核算基准',
  })
  list.push({
    code: 'EN-P01',
    name: '产品综合能源消费量',
    category: '产品能源消耗',
    unit: 'tce',
    freq: '月更新',
    sourceChannel: '平台引擎计算',
    roleInProduct: '单位产品能效折标煤综合单耗指标',
  })
  list.push({
    code: 'EN-P02',
    name: '产品电力消费量',
    category: '产品能源消耗',
    unit: 'kWh',
    freq: '日更新',
    sourceChannel: '系统自动采集',
    roleInProduct: '生产过程纯电力驱动电量主参量',
  })
  list.push({
    code: 'OD-001',
    name: '订单基本信息',
    category: '订单数据',
    unit: '—',
    freq: '月更新',
    sourceChannel: '第三方API集成',
    roleInProduct: 'ERP/MES 订单主数据关联与工单追溯',
  })

  // 按具体大类追加特定介质与工序点位
  if (['1001', '1002', '1003', '1004', '1005', '1006', '1007'].includes(majorCode)) {
    // 变压器/电气产业特有项
    list.push({
      code: 'EN-P03',
      name: '产品蒸汽消费量',
      category: '产品能源消耗',
      unit: 'GJ',
      freq: '月更新',
      sourceChannel: '系统自动采集',
      roleInProduct: '变压器干燥与恒温净化蒸汽耗量',
    })
    list.push({
      code: 'OD-004',
      name: '开展产品碳足迹核算的类别',
      category: '订单数据',
      unit: '—',
      freq: '静态数据',
      sourceChannel: '平台引擎计算',
      roleInProduct: '绿色低碳产品认证与碳足迹集采核算',
    })
  }

  if (['200101', '200102', '200103', '200104', '200105', '200106', '200107'].includes(majorCode)) {
    // 线缆产业特有项
    list.push({
      code: 'EN-007',
      name: '液氮消耗量',
      category: '能源数据',
      unit: 't',
      freq: '月更新',
      sourceChannel: '系统自动采集',
      roleInProduct: '立塔交联超高压电缆氮气保护生产耗量',
    })
    list.push({
      code: 'EN-P04',
      name: '产品天然气消费量',
      category: '产品能源消耗',
      unit: 'm³',
      freq: '月更新',
      sourceChannel: '系统自动采集',
      roleInProduct: '铜铝杆连铸连轧拉丝加热退火天然气量',
    })
  }

  return list
}

/** 4. 获取具体产品型号所挂载的全套基础数据指标链条 */
export function getBasicDataForModel(orderModel: string): LinkedBasicDataItem[] {
  // 查找该型号所属产业
  const modelItem = INITIAL_PRODUCT_MODEL_MAPPINGS.find((m) => m.orderModel === orderModel)
  const majorCode = modelItem?.erpMajorCategoryCode || '1001'
  return getBasicDataForMajor(majorCode)
}

/** 5. 查询某个基础数据项所覆盖的产品大类、中类及型号清单 */
export function getProductRelationsForBasicData(basicDataCode: string): {
  isProductRelated: boolean
  coveredMajorNames: string[]
  coveredSubNames: string[]
  sampleModels: string[]
  relationDescription: string
} {
  // 产量数据、产品能耗、订单数据
  if (['OUT-009', 'EN-P01', 'EN-P02', 'OD-001', 'OD-002', 'OD-003', 'OD-005'].includes(basicDataCode)) {
    return {
      isProductRelated: true,
      coveredMajorNames: INITIAL_MAJOR_TYPES.map((m) => m.name),
      coveredSubNames: INITIAL_SUB_TYPES.slice(0, 10).map((s) => s.name),
      sampleModels: ['ODFPS-1000000/1000', 'SFZ11-50000/110', 'YJLW03-127/220kV-1×1200', '2FZ7-252/T4000-50'],
      relationDescription: '全域通用核心产品项：覆盖变压器产业与线缆产业全部 14 大类与 21+ 重点在库型号。',
    }
  }

  if (['EN-P03', 'OUT-KM01', 'OUT-KM02', 'OUT-KM03', 'OUT-KM04', 'OUT-KM05', 'OUT-KM06', 'OUT-KM07', 'OUT-KM08', 'OUT-KM09', 'OUT-KM10', 'OUT-KM11', 'OUT-KM12', 'OUT-KM13', 'OUT-KM14', 'OUT-KM40'].includes(basicDataCode)) {
    return {
      isProductRelated: true,
      coveredMajorNames: ['变压器'],
      coveredSubNames: ['交流变压器-1000KV', '交流变压器-750kV', '交流变压器-500KV', '干式配变-硅钢叠铁心', '美式箱变'],
      sampleModels: ['ODFPS-1000000/1000', 'SZ11-63000/110', 'SFZ11-50000/110', 'SCB14-2000/10'],
      relationDescription: '变压器产业专用工序产出与蒸汽干燥耗能项，对应变压器各大电压等级型号。',
    }
  }

  if (['OUT-KM15', 'OUT-KM16', 'OUT-KM17', 'OUT-KM18'].includes(basicDataCode)) {
    return {
      isProductRelated: true,
      coveredMajorNames: ['电容器'],
      coveredSubNames: ['高压并联电容器'],
      sampleModels: ['BAM-11/100-1W'],
      relationDescription: '电容器产业专用喷漆/浸渍/卷绕/试验产量数据。',
    }
  }

  if (['OUT-KM19', 'OUT-KM20', 'OUT-KM21'].includes(basicDataCode)) {
    return {
      isProductRelated: true,
      coveredMajorNames: ['硅钢剪切铁芯'],
      coveredSubNames: ['变压器取向硅钢剪切铁芯'],
      sampleModels: ['TX-QG-1000/110'],
      relationDescription: '硅钢剪切铁芯叠装与纵剪产出物理实物量。',
    }
  }

  if (['EN-007', 'OUT-KM22', 'OUT-KM23', 'OUT-KM24', 'OUT-KM25', 'OUT-KM26', 'OUT-KM27', 'OUT-KM28', 'OUT-KM29', 'OUT-KM30', 'OUT-KM31', 'OUT-KM32', 'OUT-KM33', 'OUT-KM34', 'OUT-KM35', 'OUT-KM36', 'OUT-KM37', 'OUT-KM38', 'OUT-KM39'].includes(basicDataCode)) {
    return {
      isProductRelated: true,
      coveredMajorNames: ['裸导线', '布电线', '中低压电力电缆', '高压电力电缆', '电气装备用电缆', '橡套电缆', '特种电缆'],
      coveredSubNames: ['钢芯铝绞线 (JL/G1A)', '中压交联电力电缆 (8.7/15kV)', '超高压交联电力电缆 (220kV)', '光伏专用电缆'],
      sampleModels: ['JL/G1A-400/35', 'YJV22-8.7/15kV-3×400', 'YJLW03-127/220kV-1×1200', 'PV1-F-1×4'],
      relationDescription: '线缆产业专用拉丝、交联工序产量与液氮冷却保护耗量。',
    }
  }

  return {
    isProductRelated: false,
    coveredMajorNames: [],
    coveredSubNames: [],
    sampleModels: [],
    relationDescription: '非单一产品直接绑定项（属于园区公辅、外购能源或环境类全局基础指标）。',
  }
}

/** 三大模块基础信息字典（用于跨模块导航互通胶囊组件，统一归属于【基础参数】模块） */
export const GOVERNANCE_MODULES = [
  {
    id: 'product-type',
    title: '产品类型管理',
    desc: '维护 1 级大类与 2 级中类标准定义与计量单位',
    tag: '14 大类 · 32 中类',
  },
  {
    id: 'product-model',
    title: '产品型号管理',
    desc: '映射订单具体型号、制造工厂与产品分类台账',
    tag: '21 重点型号台账',
  },
  {
    id: 'basic-data',
    title: '基础数据管理',
    desc: '纳管 310 项全域底座数据字段与来源规则',
    tag: '310 项全域字段',
  },
]
