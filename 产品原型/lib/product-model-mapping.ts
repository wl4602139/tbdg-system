/**
 * 特变电工能碳数字化双中心 - 产品型号与 ERP 产品大类、ERP 产品中类映射数据模型
 * 
 * 业务数据链路：
 * [订单型号 (Order Model)] 
 *    ➔ 自动映射解析到 ➔ [ERP 产品大类 (大类名称与大类编码)] 
 *    ➔ 以及 ➔ [ERP 产品中类 (中类名称与10位编码)]
 * 
 * 多组织与 ERP 系统架构特点：
 * 1. 线缆产业（鲁缆公司、新缆厂、德缆公司）：型号与产品种类为统一体系（线缆统一ERP）；
 * 2. 变压器产业（沈变公司、衡变公司、新变厂）：3家变压器各自部署一套独立的 ERP 实例，
 *    系统物理隔离，但型号名称、规格型号、ERP 种类编码规则保持同构一致；
 * 3. 数据维度强约束：必须覆盖【经营单位（二级）】与【归属工厂（三级）】。
 */

export interface ProductModelMappingItem {
  id: string
  companyId: string              // 经营单位代码
  companyName: string            // 经营单位名称
  factoryId: string              // 工厂/车间/基地代码
  factoryName: string            // 制造工厂名称
  industry: 'transformer' | 'cable' // 产业分类
  erpSystem: string              // 来源ERP系统实例
  orderModel: string             // 订单型号 (如 ODFPS-1000000/1000, SFZ11-50000/110)
  
  // 🌟 第 1 组：ERP 产品大类
  erpMajorCategoryName: string   // ERP 产品大类名称 (如 变压器、高压开关、电力电缆)
  erpMajorCategoryCode: string   // ERP 大类编码 (如 1001, 1002, 200104)

  // 🌟 第 2 组：ERP 产品中类
  erpSubcategoryName: string     // ERP 产品中类名称 (如 交流变压器-1000KV)
  erpSubcategoryCode: string     // 10位 ERP 产品中类编码 (如 1001010701)
  
  // 🌟 新增：关联工序
  processName?: string           // 关联制造工序名称 (如 变压器-高压-干燥, 线缆-拉丝 等)
  
  unit: string                   // 计量单位 (台, 万kVA, km, 万m, 吨)
  status: 'enabled' | 'disabled' // 状态
  updatedAt: string              // 维护更新时间
  operator: string               // 维护人员
  remark?: string                // 备注说明
}

/** 全集团标准生产工序选项字典 */
export const ALL_PROCESS_OPTIONS: string[] = [
  '变压器-高压-干燥',
  '变压器-中低压-干变-固化',
  '变压器-中低压-油变-干燥',
  '变压器-试验',
  '套管-干燥',
  '互感器-干燥',
  '互感器-试验',
  '中低压开关柜-钣金加工',
  '中低压开关柜-钣金喷涂',
  'GIS-抽真空',
  'GIS-绝缘件干燥',
  'GIS-工频耐压试验',
  'GIS-空调恒温除湿',
  '干式电抗器-固化',
  '干式电抗器-试验',
  '电容器-芯子卷绕',
  '电容器-真空浸渍',
  '电容器-喷漆',
  '电容器-试验',
  'GIL-螺旋焊管生产',
  'GIL-绝缘子生产',
  'GIL-测试',
  '二次-SMT贴片',
  '二次-高温老化',
  '二次-波峰焊',
  '非晶合金铁心-退火',
  '硅钢铁心-纵剪',
  '硅钢铁心-中型叠装',
  '硅钢铁心-大型叠装',
  '线缆-拉丝',
  '线缆-中低压-交联（干法）',
  '线缆-高压-交联（干法）',
  '线缆-高压-交联（氮气）',
  '线缆-特种电缆制造',
]

/** 各制造工厂涉及的关键工序快速映射 */
export const FACTORY_PROCESS_OPTIONS: Record<string, string[]> = {
  fac_sb_main: ['变压器-高压-干燥', '变压器-试验'],
  fac_sb_hx: ['套管-干燥'],
  fac_sb_kj: ['互感器-干燥', '互感器-试验'],
  fac_hb_main: ['变压器-高压-干燥', '变压器-试验'],
  fac_hb_nj: ['二次-SMT贴片', '二次-高温老化', '二次-波峰焊'],
  fac_hb_yj: ['中低压开关柜-钣金加工', '中低压开关柜-钣金喷涂'],
  fac_hb_hr: ['干式电抗器-固化', '干式电抗器-试验', '电容器-芯子卷绕', '电容器-真空浸渍', '电容器-喷漆', '电容器-试验'],
  fac_hb_kg: ['GIS-抽真空', 'GIS-绝缘件干燥', 'GIS-工频耐压试验', 'GIS-空调恒温除湿'],
  fac_xb_uhv: ['变压器-高压-干燥', '变压器-试验'],
  fac_xb_tb_tj: ['变压器-中低压-干变-固化', '变压器-试验'],
  fac_xb_tb_hy: ['变压器-中低压-干变-固化', '变压器-试验'],
  fac_xb_elec: ['变压器-高压-干燥', '变压器-中低压-干变-固化', '变压器-中低压-油变-干燥', '变压器-试验'],
  fac_xb_zf: ['非晶合金铁心-退火', '硅钢铁心-纵剪', '硅钢铁心-中型叠装', '硅钢铁心-大型叠装'],
  fac_ll_main: ['线缆-拉丝', '线缆-中低压-交联（干法）', '线缆-高压-交联（干法）'],
  fac_ll_sw: ['线缆-拉丝', '线缆-中低压-交联（干法）'],
  fac_ll_sg: ['线缆-特种电缆制造', '线缆-拉丝'],
  fac_xl_main: ['线缆-拉丝', '线缆-高压-交联（氮气）', '线缆-中低压-交联（干法）'],
  fac_dl_main: ['线缆-拉丝', '线缆-中低压-交联（干法）', '线缆-高压-交联（干法）'],
  fac_dl_my: ['线缆-特种电缆制造', '线缆-拉丝'],
  fac_dl_tz: ['线缆-特种电缆制造', '线缆-拉丝'],
}

export interface CompanyFactoryOption {
  companyId: string
  companyName: string
  industry: 'transformer' | 'cable'
  erpSystem: string
  factories: { factoryId: string; factoryName: string }[]
}

/** 组织维度字典：经营单位 + 工厂维度 */
export const COMPANY_FACTORY_MAP: CompanyFactoryOption[] = [
  {
    companyId: 'comp_sb',
    companyName: '沈变公司',
    industry: 'transformer',
    erpSystem: '沈变ERP (SAP-S4/HANA)',
    factories: [
      { factoryId: 'fac_sb_main', factoryName: '沈变本部' },
      { factoryId: 'fac_sb_hx', factoryName: '和新套管' },
      { factoryId: 'fac_sb_kj', factoryName: '康嘉互感器' },
    ],
  },
  {
    companyId: 'comp_hb',
    companyName: '衡变公司',
    industry: 'transformer',
    erpSystem: '衡变ERP (SAP-ECC)',
    factories: [
      { factoryId: 'fac_hb_main', factoryName: '衡变本部' },
      { factoryId: 'fac_hb_nj', factoryName: '南京公司' },
      { factoryId: 'fac_hb_yj', factoryName: '云集电气' },
      { factoryId: 'fac_hb_hr', factoryName: '合容电气' },
      { factoryId: 'fac_hb_kg', factoryName: '云集高压开关' },
    ],
  },
  {
    companyId: 'comp_xb',
    companyName: '新变厂',
    industry: 'transformer',
    erpSystem: '新变ERP (用友U8/NC)',
    factories: [
      { factoryId: 'fac_xb_uhv', factoryName: '超高压公司' },
      { factoryId: 'fac_xb_tb_tj', factoryName: '天变天津基地' },
      { factoryId: 'fac_xb_tb_hy', factoryName: '天变衡阳基地' },
      { factoryId: 'fac_xb_elec', factoryName: '智能电气' },
      { factoryId: 'fac_xb_zf', factoryName: '珠峰硅钢' },
    ],
  },
  {
    companyId: 'comp_ll',
    companyName: '鲁缆公司',
    industry: 'cable',
    erpSystem: '线缆统一ERP (SAP-Cable)',
    factories: [
      { factoryId: 'fac_ll_main', factoryName: '鲁缆本部 (高压立塔)' },
      { factoryId: 'fac_ll_sw', factoryName: '昭和制造区' },
      { factoryId: 'fac_ll_sg', factoryName: '曙光制造部' },
    ],
  },
  {
    companyId: 'comp_xl',
    companyName: '新缆厂',
    industry: 'cable',
    erpSystem: '线缆统一ERP (SAP-Cable)',
    factories: [
      { factoryId: 'fac_xl_main', factoryName: '新疆线缆厂本部' },
      { factoryId: 'fac_xl_xl', factoryName: '新缆交联分厂' },
      { factoryId: 'fac_xl_dx', factoryName: '新缆特种导线车间' },
    ],
  },
  {
    companyId: 'comp_dl',
    companyName: '德缆公司',
    industry: 'cable',
    erpSystem: '线缆统一ERP (SAP-Cable)',
    factories: [
      { factoryId: 'fac_dl_main', factoryName: '德缆本部制造区' },
      { factoryId: 'fac_dl_my', factoryName: '德缆矿用电缆车间' },
      { factoryId: 'fac_dl_tz', factoryName: '德缆特缆分厂' },
    ],
  },
]

/** ERP 产品大类 (Major Category) 权威标准定义库 */
export interface ErpMajorCategoryDef {
  code: string          // 大类编码 (如 1001, 1002, 200104)
  name: string          // 大类名称
  industry: 'transformer' | 'cable'
  description: string
}

export const ERP_MAJOR_CATEGORIES: ErpMajorCategoryDef[] = [
  // 变压器产业
  { code: '1001', name: '变压器', industry: 'transformer', description: '涵盖交流/直流/特高压/超高压主变、配电变压器、非晶合金配变、箱式变电站等' },
  { code: '1002', name: '高压组合电器 GIS', industry: 'transformer', description: '126kV ~ 800kV 封闭式断路器与气体绝缘高压开关设备组合' },
  { code: '1003', name: '套管', industry: 'transformer', description: '40.5kV ~ 1100kV 交流油纸电容式与特高压直流穿墙套管系列' },
  { code: '1004', name: '互感器', industry: 'transformer', description: '高压电流、电压及电子式精密计量互感器' },
  { code: '1005', name: '电容器', industry: 'transformer', description: '变电站高压并联无功补偿装置与预制舱式电容器' },
  { code: '1006', name: '开关柜设备', industry: 'transformer', description: 'KYN28A 中置柜及 GCK/GGD 低压配电成套开关柜' },
  { code: '1007', name: '硅钢剪切铁芯', industry: 'transformer', description: '高导磁高牌号取向硅钢片横剪加工变压器铁芯' },

  // 线缆产业
  { code: '200101', name: '裸导线', industry: 'cable', description: '钢芯铝绞线、铝合金导线、特高压大截面大跨越高导电率导线' },
  { code: '200102', name: '布电线', industry: 'cable', description: 'BV/BVR 聚氯乙烯绝缘铜芯民用与工程建筑电线' },
  { code: '200103', name: '中低压电力电缆', industry: 'cable', description: '0.6/1kV ~ 26/35kV 交联聚乙烯绝缘中低压电力电缆与铠装电缆' },
  { code: '200104', name: '高压电力电缆', industry: 'cable', description: '64/110kV ~ 290/500kV 皱纹铝/平滑铝护套超高压交联立塔电缆' },
  { code: '200105', name: '电气装备用电缆', industry: 'cable', description: '控制电缆、计算机屏蔽电缆、船用电缆、变频专用电缆' },
  { code: '200106', name: '橡套电缆', industry: 'cable', description: 'YC/YCW 重型橡套软电缆、风电耐扭转电缆、矿用阻燃电缆' },
  { code: '200107', name: '特种电缆', industry: 'cable', description: '光伏 PV1-F、储能专用电缆、盾构机专用抗拉电缆' },
]

/** ERP 产品中类 (Subcategory) 标准定义库 (包含10位中类编码与挂靠的大类编码) */
export interface ErpSubcategoryDef {
  code: string                  // 10位中类编码
  name: string                  // 中类名称
  industry: 'transformer' | 'cable'
  majorCategoryCode: string     // 归属 ERP 产品大类编码
  majorCategoryName: string     // 归属 ERP 产品大类名称
  unit: string
}

export const ERP_SUBCATEGORIES: ErpSubcategoryDef[] = [
  // 变压器产业 - 变压器 (1001)
  { code: '1001010701', name: '交流变压器-1000KV', industry: 'transformer', majorCategoryCode: '1001', majorCategoryName: '变压器', unit: '万kVA' },
  { code: '1001010601', name: '交流变压器-750kV', industry: 'transformer', majorCategoryCode: '1001', majorCategoryName: '变压器', unit: '万kVA' },
  { code: '1001010501', name: '交流变压器-500KV', industry: 'transformer', majorCategoryCode: '1001', majorCategoryName: '变压器', unit: '万kVA' },
  { code: '1001010401', name: '交流变压器-330KV', industry: 'transformer', majorCategoryCode: '1001', majorCategoryName: '变压器', unit: '万kVA' },
  { code: '1001010301', name: '交流变压器-220KV', industry: 'transformer', majorCategoryCode: '1001', majorCategoryName: '变压器', unit: '万kVA' },
  { code: '1001010201', name: '交流变压器-110KV', industry: 'transformer', majorCategoryCode: '1001', majorCategoryName: '变压器', unit: '万kVA' },
  { code: '1001010101', name: '交流变压器-35KV及以下', industry: 'transformer', majorCategoryCode: '1001', majorCategoryName: '变压器', unit: '万kVA' },
  { code: '1001020101', name: '直流变压器-±400kv及以下', industry: 'transformer', majorCategoryCode: '1001', majorCategoryName: '变压器', unit: '万kVA' },
  { code: '1001020201', name: '直流变压器-±500kv', industry: 'transformer', majorCategoryCode: '1001', majorCategoryName: '变压器', unit: '万kVA' },
  { code: '1001020301', name: '直流变压器-±600kv', industry: 'transformer', majorCategoryCode: '1001', majorCategoryName: '变压器', unit: '万kVA' },
  { code: '1001020401', name: '直流变压器-±800kv', industry: 'transformer', majorCategoryCode: '1001', majorCategoryName: '变压器', unit: '万kVA' },
  { code: '1001020501', name: '直流变压器-±1100kv', industry: 'transformer', majorCategoryCode: '1001', majorCategoryName: '变压器', unit: '万kVA' },
  { code: '1001030101', name: '特种变压器-工业整流变-35kV及以下', industry: 'transformer', majorCategoryCode: '1001', majorCategoryName: '变压器', unit: '万kVA' },
  { code: '1001030103', name: '特种变压器-工业整流变-220kV', industry: 'transformer', majorCategoryCode: '1001', majorCategoryName: '变压器', unit: '万kVA' },
  { code: '1001030201', name: '特种变压器-电炉变-35kV', industry: 'transformer', majorCategoryCode: '1001', majorCategoryName: '变压器', unit: '万kVA' },
  { code: '1001030302', name: '特种变压器-站用牵引变-220kV', industry: 'transformer', majorCategoryCode: '1001', majorCategoryName: '变压器', unit: '万kVA' },
  { code: '1001040101', name: '干式配变-硅钢叠铁心', industry: 'transformer', majorCategoryCode: '1001', majorCategoryName: '变压器', unit: '万kVA' },
  { code: '1001040102', name: '干式配变-非晶合金', industry: 'transformer', majorCategoryCode: '1001', majorCategoryName: '变压器', unit: '万kVA' },
  { code: '1001040201', name: '干式配变-H级干变', industry: 'transformer', majorCategoryCode: '1001', majorCategoryName: '变压器', unit: '万kVA' },
  { code: '1001070101', name: '美式箱变', industry: 'transformer', majorCategoryCode: '1001', majorCategoryName: '变压器', unit: '台' },
  { code: '1001070201', name: '欧式箱变', industry: 'transformer', majorCategoryCode: '1001', majorCategoryName: '变压器', unit: '台' },
  { code: '1001050101', name: '电抗器-油浸式电抗器-35kV以下', industry: 'transformer', majorCategoryCode: '1001', majorCategoryName: '变压器', unit: '万kVA' },
  { code: '1001050201', name: '干式电抗器-110kV以下', industry: 'transformer', majorCategoryCode: '1001', majorCategoryName: '变压器', unit: '万kVA' },

  // 变压器产业 - 高压开关与组件 (1002 ~ 1007)
  { code: '1002010101', name: '高压开关-GIS-126至145kV', industry: 'transformer', majorCategoryCode: '1002', majorCategoryName: '高压组合电器 GIS', unit: '间隔' },
  { code: '1002010201', name: '高压开关-GIS-252至363kV', industry: 'transformer', majorCategoryCode: '1002', majorCategoryName: '高压组合电器 GIS', unit: '间隔' },
  { code: '1003010101', name: '交流套管-72.5至252kV', industry: 'transformer', majorCategoryCode: '1003', majorCategoryName: '套管', unit: '支' },
  { code: '1003010301', name: '直流套管-±500至±1100kV', industry: 'transformer', majorCategoryCode: '1003', majorCategoryName: '套管', unit: '支' },
  { code: '1004010101', name: '高压电流互感器', industry: 'transformer', majorCategoryCode: '1004', majorCategoryName: '互感器', unit: '台' },
  { code: '1005010101', name: '高压并联电容器', industry: 'transformer', majorCategoryCode: '1005', majorCategoryName: '电容器', unit: '台' },
  { code: '1006010101', name: '中低压金属封闭开关柜', industry: 'transformer', majorCategoryCode: '1006', majorCategoryName: '开关柜设备', unit: '面' },
  { code: '1007010101', name: '变压器取向硅钢剪切铁芯', industry: 'transformer', majorCategoryCode: '1007', majorCategoryName: '硅钢剪切铁芯', unit: '吨' },

  // 线缆产业 (200101 ~ 200107)
  { code: '2001010101', name: '钢芯铝绞线 (JL/G1A)', industry: 'cable', majorCategoryCode: '200101', majorCategoryName: '裸导线', unit: '吨' },
  { code: '2001010201', name: '铝合金绞线及高导电导线', industry: 'cable', majorCategoryCode: '200101', majorCategoryName: '裸导线', unit: '吨' },
  { code: '2001020101', name: '聚氯乙烯绝缘电线 (BV/BVR)', industry: 'cable', majorCategoryCode: '200102', majorCategoryName: '布电线', unit: '万m' },
  { code: '2001030101', name: '低压交联电力电缆 (0.6/1kV)', industry: 'cable', majorCategoryCode: '200103', majorCategoryName: '中低压电力电缆', unit: 'km' },
  { code: '2001030201', name: '中压交联电力电缆 (8.7/15kV)', industry: 'cable', majorCategoryCode: '200103', majorCategoryName: '中低压电力电缆', unit: 'km' },
  { code: '2001030301', name: '中压铠装电力电缆 (26/35kV)', industry: 'cable', majorCategoryCode: '200103', majorCategoryName: '中低压电力电缆', unit: 'km' },
  { code: '2001040101', name: '高压交联电力电缆 (110kV)', industry: 'cable', majorCategoryCode: '200104', majorCategoryName: '高压电力电缆', unit: 'km' },
  { code: '2001040201', name: '超高压交联电力电缆 (220kV)', industry: 'cable', majorCategoryCode: '200104', majorCategoryName: '高压电力电缆', unit: 'km' },
  { code: '2001040301', name: '特高压电力电缆 (500kV)', industry: 'cable', majorCategoryCode: '200104', majorCategoryName: '高压电力电缆', unit: 'km' },
  { code: '2001050101', name: '控制屏蔽电缆 (KVV/KVVP)', industry: 'cable', majorCategoryCode: '200105', majorCategoryName: '电气装备用电缆', unit: 'km' },
  { code: '2001050201', name: '变频与计算机专用电缆', industry: 'cable', majorCategoryCode: '200105', majorCategoryName: '电气装备用电缆', unit: 'km' },
  { code: '2001060101', name: '通用重型橡套软电缆 (YC/YCW)', industry: 'cable', majorCategoryCode: '200106', majorCategoryName: '橡套电缆', unit: 'km' },
  { code: '2001060201', name: '矿用阻燃橡套软电缆 (MY/MYPT)', industry: 'cable', majorCategoryCode: '200106', majorCategoryName: '橡套电缆', unit: 'km' },
  { code: '2001070101', name: '光伏专用电缆 (PV1-F/H1Z2Z2)', industry: 'cable', majorCategoryCode: '200107', majorCategoryName: '特种电缆', unit: 'km' },
  { code: '2001070201', name: '风力发电耐扭曲电缆', industry: 'cable', majorCategoryCode: '200107', majorCategoryName: '特种电缆', unit: 'km' },
  { code: '2001070301', name: '储能集装箱专用电缆', industry: 'cable', majorCategoryCode: '200107', majorCategoryName: '特种电缆', unit: 'km' },
]

/**
 * 核心解析引擎：输入订单型号 (Order Model) 自动解析匹配出：
 * 1. ERP 产品大类名称与大类编码
 * 2. ERP 产品中类名称与 10 位中类编码
 */
export function resolveOrderModelToErpSubcategory(
  orderModel: string,
  industryHint?: 'transformer' | 'cable'
): {
  matched: boolean
  subCode: string
  subName: string
  majorCode: string
  majorName: string
  unit: string
} {
  const modelUpper = (orderModel || '').trim().toUpperCase()

  // 1. 特高压/超高压交流变压器
  if (/ODFPS|OSFPS|SSZ|SZ|SFP|DFP/.test(modelUpper)) {
    if (/\/1000(\b|_|-)/.test(modelUpper) || /1000KV/i.test(modelUpper)) {
      return { matched: true, subCode: '1001010701', subName: '交流变压器-1000KV', majorCode: '1001', majorName: '变压器', unit: '万kVA' }
    }
    if (/\/750(\b|_|-)/.test(modelUpper) || /750KV/i.test(modelUpper)) {
      return { matched: true, subCode: '1001010601', subName: '交流变压器-750kV', majorCode: '1001', majorName: '变压器', unit: '万kVA' }
    }
    if (/\/500(\b|_|-)/.test(modelUpper) || /500KV/i.test(modelUpper)) {
      return { matched: true, subCode: '1001010501', subName: '交流变压器-500KV', majorCode: '1001', majorName: '变压器', unit: '万kVA' }
    }
    if (/\/330(\b|_|-)/.test(modelUpper) || /330KV/i.test(modelUpper)) {
      return { matched: true, subCode: '1001010401', subName: '交流变压器-330KV', majorCode: '1001', majorName: '变压器', unit: '万kVA' }
    }
    if (/\/220(\b|_|-)/.test(modelUpper) || /220KV/i.test(modelUpper)) {
      return { matched: true, subCode: '1001010301', subName: '交流变压器-220KV', majorCode: '1001', majorName: '变压器', unit: '万kVA' }
    }
    if (/\/110(\b|_|-)/.test(modelUpper) || /110KV/i.test(modelUpper)) {
      return { matched: true, subCode: '1001010201', subName: '交流变压器-110KV', majorCode: '1001', majorName: '变压器', unit: '万kVA' }
    }
    if (/\/35(\b|_|-)/.test(modelUpper) || /35KV/i.test(modelUpper)) {
      return { matched: true, subCode: '1001010101', subName: '交流变压器-35KV及以下', majorCode: '1001', majorName: '变压器', unit: '万kVA' }
    }
  }

  // 2. 直流换流变
  if (/ZZDFPZ|ZF|DC-/.test(modelUpper) || /换流变|直流/.test(modelUpper)) {
    if (/1100/.test(modelUpper)) {
      return { matched: true, subCode: '1001020501', subName: '直流变压器-±1100kv', majorCode: '1001', majorName: '变压器', unit: '万kVA' }
    }
    if (/800/.test(modelUpper)) {
      return { matched: true, subCode: '1001020401', subName: '直流变压器-±800kv', majorCode: '1001', majorName: '变压器', unit: '万kVA' }
    }
    if (/500/.test(modelUpper)) {
      return { matched: true, subCode: '1001020201', subName: '直流变压器-±500kv', majorCode: '1001', majorName: '变压器', unit: '万kVA' }
    }
    return { matched: true, subCode: '1001020101', subName: '直流变压器-±400kv及以下', majorCode: '1001', majorName: '变压器', unit: '万kVA' }
  }

  // 3. 干式配变 (SCB, SGB, SCBH)
  if (/^SCB|^SGB|^SCBH/.test(modelUpper)) {
    if (/SCBH/.test(modelUpper)) {
      return { matched: true, subCode: '1001040102', subName: '干式配变-非晶合金', majorCode: '1001', majorName: '变压器', unit: '万kVA' }
    }
    if (/SGB/.test(modelUpper)) {
      return { matched: true, subCode: '1001040201', subName: '干式配变-H级干变', majorCode: '1001', majorName: '变压器', unit: '万kVA' }
    }
    return { matched: true, subCode: '1001040101', subName: '干式配变-硅钢叠铁心', majorCode: '1001', majorName: '变压器', unit: '万kVA' }
  }

  // 4. 油浸式配电变压器 (S11, S13, S20, S22, SBH)
  if (/^S11|^S13|^S14|^S18|^S20|^S22|^SBH/.test(modelUpper)) {
    return { matched: true, subCode: '1001010101', subName: '交流变压器-35KV及以下', majorCode: '1001', majorName: '变压器', unit: '万kVA' }
  }

  // 5. 特种变压器 (整流变、电炉变、牵引变)
  if (/^ZHS|^ZHSFT/.test(modelUpper)) {
    return { matched: true, subCode: '1001030101', subName: '特种变压器-工业整流变-35kV及以下', majorCode: '1001', majorName: '变压器', unit: '万kVA' }
  }
  if (/^HSSP|^HKSSP/.test(modelUpper)) {
    return { matched: true, subCode: '1001030201', subName: '特种变压器-电炉变-35kV', majorCode: '1001', majorName: '变压器', unit: '万kVA' }
  }

  // 6. 箱变
  if (/^ZGS|^YB|^YBW/.test(modelUpper)) {
    if (/^ZGS/.test(modelUpper)) {
      return { matched: true, subCode: '1001070101', subName: '美式箱变', majorCode: '1001', majorName: '变压器', unit: '台' }
    }
    return { matched: true, subCode: '1001070201', subName: '欧式箱变', majorCode: '1001', majorName: '变压器', unit: '台' }
  }

  // 7. 电抗器 (BKD, BKS, CKSC)
  if (/^BKD|^BKS|^CKSC|^XKS/.test(modelUpper)) {
    return { matched: true, subCode: '1001050201', subName: '干式电抗器-110kV以下', majorCode: '1001', majorName: '变压器', unit: '万kVA' }
  }

  // 8. GIS / 开关设备 (ZF, LW, GW)
  if (/^ZF12|^ZF14|^ZF27|^ZF28/.test(modelUpper)) {
    if (/ZF27|ZF28/.test(modelUpper)) {
      return { matched: true, subCode: '1002010201', subName: '高压开关-GIS-252至363kV', majorCode: '1002', majorName: '高压组合电器 GIS', unit: '间隔' }
    }
    return { matched: true, subCode: '1002010101', subName: '高压开关-GIS-126至145kV', majorCode: '1002', majorName: '高压组合电器 GIS', unit: '间隔' }
  }

  // 9. 套管与互感器
  if (/^BRDLW|^BRLW|^GGF|^FGF/.test(modelUpper)) {
    if (/800|1000|1100/.test(modelUpper)) {
      return { matched: true, subCode: '1003010301', subName: '直流套管-±500至±1100kV', majorCode: '1003', majorName: '套管', unit: '支' }
    }
    return { matched: true, subCode: '1003010101', subName: '交流套管-72.5至252kV', majorCode: '1003', majorName: '套管', unit: '支' }
  }
  if (/^LVQB|^LB9|^TYD|^JLSZV/.test(modelUpper)) {
    return { matched: true, subCode: '1004010101', subName: '高压电流互感器', majorCode: '1004', majorName: '互感器', unit: '台' }
  }

  // 10. 线缆 - 高压电缆 (YJLW, YJLLW, YJQ)
  if (/^YJLW|^YJLLW|^YJQ|^DC-YJLW/.test(modelUpper)) {
    if (/290\/500|500KV/i.test(modelUpper)) {
      return { matched: true, subCode: '2001040301', subName: '特高压电力电缆 (500kV)', majorCode: '200104', majorName: '高压电力电缆', unit: 'km' }
    }
    if (/127\/220|220KV/i.test(modelUpper)) {
      return { matched: true, subCode: '2001040201', subName: '超高压交联电力电缆 (220kV)', majorCode: '200104', majorName: '高压电力电缆', unit: 'km' }
    }
    return { matched: true, subCode: '2001040101', subName: '高压交联电力电缆 (110kV)', majorCode: '200104', majorName: '高压电力电缆', unit: 'km' }
  }

  // 11. 线缆 - 中压电缆
  if (/YJV22-26\/35|YJV-26\/35|35KV/i.test(modelUpper)) {
    return { matched: true, subCode: '2001030301', subName: '中压铠装电力电缆 (26/35kV)', majorCode: '200103', majorName: '中低压电力电缆', unit: 'km' }
  }
  if (/8\.7\/15|12\/20|15KV|20KV/i.test(modelUpper) || (/^YJV|^ZR-YJV|^NH-YJV/.test(modelUpper) && !/0\.6\/1/.test(modelUpper))) {
    return { matched: true, subCode: '2001030201', subName: '中压交联电力电缆 (8.7/15kV)', majorCode: '200103', majorName: '中低压电力电缆', unit: 'km' }
  }

  // 12. 线缆 - 低压电缆 (0.6/1kV)
  if (/0\.6\/1|^VV|^YJV-0\.6/.test(modelUpper)) {
    return { matched: true, subCode: '2001030101', subName: '低压交联电力电缆 (0.6/1kV)', majorCode: '200103', majorName: '中低压电力电缆', unit: 'km' }
  }

  // 13. 线缆 - 裸导线 (JL/G1A, JLHA, ACSR)
  if (/^JL\/|^JLHA|^ACSR|^JL/.test(modelUpper)) {
    if (/JLHA|高导电/.test(modelUpper)) {
      return { matched: true, subCode: '2001010201', subName: '铝合金绞线及高导电导线', majorCode: '200101', majorName: '裸导线', unit: '吨' }
    }
    return { matched: true, subCode: '2001010101', subName: '钢芯铝绞线 (JL/G1A)', majorCode: '200101', majorName: '裸导线', unit: '吨' }
  }

  // 14. 线缆 - 布电线 (BV, BVR, RVV)
  if (/^BV|^BVR|^RVV/.test(modelUpper)) {
    return { matched: true, subCode: '2001020101', subName: '聚氯乙烯绝缘电线 (BV/BVR)', majorCode: '200102', majorName: '布电线', unit: '万m' }
  }

  // 15. 线缆 - 控制/屏蔽/装备电缆 (KVV, KYJY, DJYPVP)
  if (/^KVV|^KYJY|^DJY|^CEFR|^BP-YJV/.test(modelUpper)) {
    if (/BP-YJV|DJY/.test(modelUpper)) {
      return { matched: true, subCode: '2001050201', subName: '变频与计算机专用电缆', majorCode: '200105', majorName: '电气装备用电缆', unit: 'km' }
    }
    return { matched: true, subCode: '2001050101', subName: '控制屏蔽电缆 (KVV/KVVP)', majorCode: '200105', majorName: '电气装备用电缆', unit: 'km' }
  }

  // 16. 线缆 - 橡套与矿用 (YC, YCW, MY, MYPT)
  if (/^YC|^YCW|^MY|^MC|^FD-/.test(modelUpper)) {
    if (/^MY|^MC/.test(modelUpper)) {
      return { matched: true, subCode: '2001060201', subName: '矿用阻燃橡套软电缆 (MY/MYPT)', majorCode: '200106', majorName: '橡套电缆', unit: 'km' }
    }
    return { matched: true, subCode: '2001060101', subName: '通用重型橡套软电缆 (YC/YCW)', majorCode: '200106', majorName: '橡套电缆', unit: 'km' }
  }

  // 17. 线缆 - 特种与光伏 (PV1-F, H1Z2Z2, ES-YJY)
  if (/PV1-F|H1Z2Z2|ES-YJY|F-CE|UGEFP/.test(modelUpper)) {
    if (/PV1|H1Z2/.test(modelUpper)) {
      return { matched: true, subCode: '2001070101', subName: '光伏专用电缆 (PV1-F/H1Z2Z2)', majorCode: '200107', majorName: '特种电缆', unit: 'km' }
    }
    return { matched: true, subCode: '2001070301', subName: '储能集装箱专用电缆', majorCode: '200107', majorName: '特种电缆', unit: 'km' }
  }

  // 兜底匹配
  if (industryHint === 'cable') {
    return { matched: false, subCode: '2001030201', subName: '中压交联电力电缆 (8.7/15kV)', majorCode: '200103', majorName: '中低压电力电缆', unit: 'km' }
  }
  return { matched: false, subCode: '1001010201', subName: '交流变压器-110KV', majorCode: '1001', majorName: '变压器', unit: '万kVA' }
}

/** 初始台账数据源（包含 2 组 ERP 产品大类与 ERP 产品中类数据） */
export const INITIAL_PRODUCT_MODEL_MAPPINGS: ProductModelMappingItem[] = [
  // 沈变公司
  {
    id: 'pm-001',
    companyId: 'comp_sb',
    companyName: '沈变公司',
    factoryId: 'fac_sb_main',
    factoryName: '沈变本部',
    industry: 'transformer',
    erpSystem: '沈变ERP (SAP-S4/HANA)',
    orderModel: 'ODFPS-1000000/1000',
    erpMajorCategoryName: '变压器',
    erpMajorCategoryCode: '1001',
    erpSubcategoryName: '交流变压器-1000KV',
    erpSubcategoryCode: '1001010701',
    processName: '变压器-高压-干燥',
    unit: '万kVA',
    status: 'enabled',
    updatedAt: '2026-03-18 10:24',
    operator: '张建军 (工艺处)',
    remark: '国家电网白鹤滩-江苏特高压直流送端主变',
  },
  {
    id: 'pm-002',
    companyId: 'comp_sb',
    companyName: '沈变公司',
    factoryId: 'fac_sb_main',
    factoryName: '沈变本部',
    industry: 'transformer',
    erpSystem: '沈变ERP (SAP-S4/HANA)',
    orderModel: 'OSFPS-750000/500',
    erpMajorCategoryName: '变压器',
    erpMajorCategoryCode: '1001',
    erpSubcategoryName: '交流变压器-500KV',
    erpSubcategoryCode: '1001010501',
    processName: '变压器-高压-干燥',
    unit: '万kVA',
    status: 'enabled',
    updatedAt: '2026-03-15 14:12',
    operator: '李伟 (设计部)',
    remark: '西北750/500kV变电站主变项目',
  },
  {
    id: 'pm-003',
    companyId: 'comp_sb',
    companyName: '沈变公司',
    factoryId: 'fac_sb_hx',
    factoryName: '和新套管',
    industry: 'transformer',
    erpSystem: '沈变ERP (SAP-S4/HANA)',
    orderModel: 'BRDLW-1000/2000-4',
    erpMajorCategoryName: '套管',
    erpMajorCategoryCode: '1003',
    erpSubcategoryName: '直流套管-±500至±1100kV',
    erpSubcategoryCode: '1003010301',
    processName: '套管-干燥',
    unit: '支',
    status: 'enabled',
    updatedAt: '2026-03-12 09:30',
    operator: '孙工 (套管技术部)',
    remark: '特高压换流变直流穿墙套管',
  },
  {
    id: 'pm-004',
    companyId: 'comp_sb',
    companyName: '沈变公司',
    factoryId: 'fac_sb_kj',
    factoryName: '康嘉互感器',
    industry: 'transformer',
    erpSystem: '沈变ERP (SAP-S4/HANA)',
    orderModel: 'LVQB-500W3',
    erpMajorCategoryName: '互感器',
    erpMajorCategoryCode: '1004',
    erpSubcategoryName: '高压电流互感器',
    erpSubcategoryCode: '1004010101',
    processName: '互感器-干燥',
    unit: '台',
    status: 'enabled',
    updatedAt: '2026-03-10 16:45',
    operator: '赵工 (互感器检验部)',
    remark: '500kV SF6气体绝缘倒置式电流互感器',
  },

  // 衡变公司
  {
    id: 'pm-005',
    companyId: 'comp_hb',
    companyName: '衡变公司',
    factoryId: 'fac_hb_main',
    factoryName: '衡变本部',
    industry: 'transformer',
    erpSystem: '衡变ERP (SAP-ECC)',
    orderModel: 'SFZ11-50000/110',
    erpMajorCategoryName: '变压器',
    erpMajorCategoryCode: '1001',
    erpSubcategoryName: '交流变压器-110KV',
    erpSubcategoryCode: '1001010201',
    processName: '变压器-高压-干燥',
    unit: '万kVA',
    status: 'enabled',
    updatedAt: '2026-03-19 11:20',
    operator: '刘强 (生产制造部)',
    remark: '南方电网110kV智能变电站标品',
  },
  {
    id: 'pm-006',
    companyId: 'comp_hb',
    companyName: '衡变公司',
    factoryId: 'fac_hb_main',
    factoryName: '衡变本部',
    industry: 'transformer',
    erpSystem: '衡变ERP (SAP-ECC)',
    orderModel: 'ZZDFPZ-407500/500-±800',
    erpMajorCategoryName: '变压器',
    erpMajorCategoryCode: '1001',
    erpSubcategoryName: '直流变压器-±800kv',
    erpSubcategoryCode: '1001020401',
    processName: '变压器-高压-干燥',
    unit: '万kVA',
    status: 'enabled',
    updatedAt: '2026-03-14 17:05',
    operator: '刘强 (生产制造部)',
    remark: '陕北-安徽±800kV特高压直流工程换流变',
  },
  {
    id: 'pm-007',
    companyId: 'comp_hb',
    companyName: '衡变公司',
    factoryId: 'fac_hb_kg',
    factoryName: '云集高压开关',
    industry: 'transformer',
    erpSystem: '衡变ERP (SAP-ECC)',
    orderModel: 'ZF27-252/T4000-50',
    erpMajorCategoryName: '高压组合电器 GIS',
    erpMajorCategoryCode: '1002',
    erpSubcategoryName: '高压开关-GIS-252至363kV',
    erpSubcategoryCode: '1002010201',
    processName: 'GIS-抽真空',
    unit: '间隔',
    status: 'enabled',
    updatedAt: '2026-03-11 13:50',
    operator: '陈明 (开关车间)',
    remark: '252kV 组合电器开关柜项目',
  },
  {
    id: 'pm-008',
    companyId: 'comp_hb',
    companyName: '衡变公司',
    factoryId: 'fac_hb_hr',
    factoryName: '合容电气',
    industry: 'transformer',
    erpSystem: '衡变ERP (SAP-ECC)',
    orderModel: 'BAM-11/100-1W',
    erpMajorCategoryName: '电容器',
    erpMajorCategoryCode: '1005',
    erpSubcategoryName: '高压并联电容器',
    erpSubcategoryCode: '1005010101',
    processName: '电容器-真空浸渍',
    unit: '台',
    status: 'enabled',
    updatedAt: '2026-03-08 15:10',
    operator: '王霞 (合容技术科)',
    remark: '变电站无功补偿装置用电容器单元',
  },

  // 新变厂
  {
    id: 'pm-009',
    companyId: 'comp_xb',
    companyName: '新变厂',
    factoryId: 'fac_xb_uhv',
    factoryName: '超高压公司',
    industry: 'transformer',
    erpSystem: '新变ERP (用友U8/NC)',
    orderModel: 'SFP-400000/220',
    erpMajorCategoryName: '变压器',
    erpMajorCategoryCode: '1001',
    erpSubcategoryName: '交流变压器-220KV',
    erpSubcategoryCode: '1001010301',
    processName: '变压器-高压-干燥',
    unit: '万kVA',
    status: 'enabled',
    updatedAt: '2026-03-17 08:55',
    operator: '阿不都 (超高压工艺组)',
    remark: '新疆准东新能源外送基地配套主变',
  },
  {
    id: 'pm-010',
    companyId: 'comp_xb',
    companyName: '新变厂',
    factoryId: 'fac_xb_tb_tj',
    factoryName: '天变天津基地',
    industry: 'transformer',
    erpSystem: '新变ERP (用友U8/NC)',
    orderModel: 'SCB14-2000/10',
    erpMajorCategoryName: '变压器',
    erpMajorCategoryCode: '1001',
    erpSubcategoryName: '干式配变-硅钢叠铁心',
    erpSubcategoryCode: '1001040101',
    processName: '变压器-中低压-干变-固化',
    unit: '万kVA',
    status: 'enabled',
    updatedAt: '2026-03-16 16:30',
    operator: '郭海 (天变计划科)',
    remark: '天津地铁线路专用低噪阻燃干变',
  },
  {
    id: 'pm-011',
    companyId: 'comp_xb',
    companyName: '新变厂',
    factoryId: 'fac_xb_tb_tj',
    factoryName: '天变天津基地',
    industry: 'transformer',
    erpSystem: '新变ERP (用友U8/NC)',
    orderModel: 'ZGS11-H(Z)-800/10',
    erpMajorCategoryName: '变压器',
    erpMajorCategoryCode: '1001',
    erpSubcategoryName: '美式箱变',
    erpSubcategoryCode: '1001070101',
    processName: '变压器-试验',
    unit: '台',
    status: 'enabled',
    updatedAt: '2026-03-13 14:40',
    operator: '郭海 (天变计划科)',
    remark: '光伏电站预装式升压箱变',
  },
  {
    id: 'pm-012',
    companyId: 'comp_xb',
    companyName: '新变厂',
    factoryId: 'fac_xb_elec',
    factoryName: '智能电气',
    industry: 'transformer',
    erpSystem: '新变ERP (用友U8/NC)',
    orderModel: 'S11-M-1000/10',
    erpMajorCategoryName: '变压器',
    erpMajorCategoryCode: '1001',
    erpSubcategoryName: '交流变压器-35KV及以下',
    erpSubcategoryCode: '1001010101',
    processName: '变压器-中低压-油变-干燥',
    unit: '万kVA',
    status: 'enabled',
    updatedAt: '2026-03-09 10:15',
    operator: '艾力 (智能电气车间)',
    remark: '农网改造三相油浸配电变压器',
  },

  // 鲁缆公司 (线缆统一ERP)
  {
    id: 'pm-013',
    companyId: 'comp_ll',
    companyName: '鲁缆公司',
    factoryId: 'fac_ll_main',
    factoryName: '鲁缆本部 (高压立塔)',
    industry: 'cable',
    erpSystem: '线缆统一ERP (SAP-Cable)',
    orderModel: 'YJLW03-127/220kV-1×1200',
    erpMajorCategoryName: '高压电力电缆',
    erpMajorCategoryCode: '200104',
    erpSubcategoryName: '超高压交联电力电缆 (220kV)',
    erpSubcategoryCode: '2001040201',
    processName: '线缆-高压-交联（干法）',
    unit: 'km',
    status: 'enabled',
    updatedAt: '2026-03-19 15:30',
    operator: '周志刚 (高压线缆部)',
    remark: '国网华东重点工程220kV平滑铝护套立塔电缆',
  },
  {
    id: 'pm-014',
    companyId: 'comp_ll',
    companyName: '鲁缆公司',
    factoryId: 'fac_ll_main',
    factoryName: '鲁缆本部 (高压立塔)',
    industry: 'cable',
    erpSystem: '线缆统一ERP (SAP-Cable)',
    orderModel: 'YJV22-8.7/15kV-3×400',
    erpMajorCategoryName: '中低压电力电缆',
    erpMajorCategoryCode: '200103',
    erpSubcategoryName: '中压交联电力电缆 (8.7/15kV)',
    erpSubcategoryCode: '2001030201',
    processName: '线缆-中低压-交联（干法）',
    unit: 'km',
    status: 'enabled',
    updatedAt: '2026-03-18 09:15',
    operator: '周志刚 (高压线缆部)',
    remark: '城市配电网中压交联铠装电缆',
  },
  {
    id: 'pm-015',
    companyId: 'comp_ll',
    companyName: '鲁缆公司',
    factoryId: 'fac_ll_sw',
    factoryName: '昭和制造区',
    industry: 'cable',
    erpSystem: '线缆统一ERP (SAP-Cable)',
    orderModel: 'JL/G1A-630/45',
    erpMajorCategoryName: '裸导线',
    erpMajorCategoryCode: '200101',
    erpSubcategoryName: '钢芯铝绞线 (JL/G1A)',
    erpSubcategoryCode: '2001010101',
    processName: '线缆-拉丝',
    unit: '吨',
    status: 'enabled',
    updatedAt: '2026-03-14 11:45',
    operator: '吴燕 (昭和调度室)',
    remark: '输电线路跨越区特种钢芯铝绞线',
  },

  // 新缆厂 (线缆统一ERP)
  {
    id: 'pm-016',
    companyId: 'comp_xl',
    companyName: '新缆厂',
    factoryId: 'fac_xl_main',
    factoryName: '新疆线缆厂本部',
    industry: 'cable',
    erpSystem: '线缆统一ERP (SAP-Cable)',
    orderModel: 'YJV-0.6/1kV-4×240+1×120',
    erpMajorCategoryName: '中低压电力电缆',
    erpMajorCategoryCode: '200103',
    erpSubcategoryName: '低压交联电力电缆 (0.6/1kV)',
    erpSubcategoryCode: '2001030101',
    processName: '线缆-中低压-交联（干法）',
    unit: 'km',
    status: 'enabled',
    updatedAt: '2026-03-17 14:00',
    operator: '买买提 (生产计划科)',
    remark: '大型工业园区配电低压电力电缆',
  },
  {
    id: 'pm-017',
    companyId: 'comp_xl',
    companyName: '新缆厂',
    factoryId: 'fac_xl_dx',
    factoryName: '新缆特种导线车间',
    industry: 'cable',
    erpSystem: '线缆统一ERP (SAP-Cable)',
    orderModel: 'JLHA3-630',
    erpMajorCategoryName: '裸导线',
    erpMajorCategoryCode: '200101',
    erpSubcategoryName: '铝合金绞线及高导电导线',
    erpSubcategoryCode: '2001010201',
    processName: '线缆-拉丝',
    unit: '吨',
    status: 'enabled',
    updatedAt: '2026-03-12 16:10',
    operator: '买买提 (生产计划科)',
    remark: '特高压线路低损耗铝合金节能导线',
  },
  {
    id: 'pm-018',
    companyId: 'comp_xl',
    companyName: '新缆厂',
    factoryId: 'fac_xl_main',
    factoryName: '新疆线缆厂本部',
    industry: 'cable',
    erpSystem: '线缆统一ERP (SAP-Cable)',
    orderModel: 'PV1-F-1×4mm²',
    erpMajorCategoryName: '特种电缆',
    erpMajorCategoryCode: '200107',
    erpSubcategoryName: '光伏专用电缆 (PV1-F/H1Z2Z2)',
    erpSubcategoryCode: '2001070101',
    processName: '线缆-特种电缆制造',
    unit: 'km',
    status: 'enabled',
    updatedAt: '2026-03-10 10:20',
    operator: '买买提 (生产计划科)',
    remark: '新疆大基地光伏组件直流耐候汇流电缆',
  },

  // 德缆公司 (线缆统一ERP)
  {
    id: 'pm-019',
    companyId: 'comp_dl',
    companyName: '德缆公司',
    factoryId: 'fac_dl_my',
    factoryName: '德缆矿用电缆车间',
    industry: 'cable',
    erpSystem: '线缆统一ERP (SAP-Cable)',
    orderModel: 'MYPTJ-3.6/6kV-3×50+3×16/3+3×2.5',
    erpMajorCategoryName: '橡套电缆',
    erpMajorCategoryCode: '200106',
    erpSubcategoryName: '矿用阻燃橡套软电缆 (MY/MYPT)',
    erpSubcategoryCode: '2001060201',
    processName: '线缆-特种电缆制造',
    unit: 'km',
    status: 'enabled',
    updatedAt: '2026-03-15 13:40',
    operator: '何建国 (矿缆工艺)',
    remark: '西南大型煤矿井下移动高压屏蔽橡套电缆',
  },
  {
    id: 'pm-020',
    companyId: 'comp_dl',
    companyName: '德缆公司',
    factoryId: 'fac_dl_tz',
    factoryName: '德缆特缆分厂',
    industry: 'cable',
    erpSystem: '线缆统一ERP (SAP-Cable)',
    orderModel: 'FD-YJE-8.7/15kV',
    erpMajorCategoryName: '特种电缆',
    erpMajorCategoryCode: '200107',
    erpSubcategoryName: '风力发电耐扭曲电缆',
    erpSubcategoryCode: '2001070201',
    processName: '线缆-特种电缆制造',
    unit: 'km',
    status: 'enabled',
    updatedAt: '2026-03-11 09:20',
    operator: '何建国 (矿缆工艺)',
    remark: '海上及高寒风机塔筒内部耐扭曲电缆',
  },
  {
    id: 'pm-021',
    companyId: 'comp_dl',
    companyName: '德缆公司',
    factoryId: 'fac_dl_main',
    factoryName: '德缆本部制造区',
    industry: 'cable',
    erpSystem: '线缆统一ERP (SAP-Cable)',
    orderModel: 'KVVP2-22-450/750V-10×1.5',
    erpMajorCategoryName: '电气装备用电缆',
    erpMajorCategoryCode: '200105',
    erpSubcategoryName: '控制屏蔽电缆 (KVV/KVVP)',
    erpSubcategoryCode: '2001050101',
    processName: '线缆-拉丝',
    unit: 'km',
    status: 'enabled',
    updatedAt: '2026-03-07 14:15',
    operator: '何建国 (矿缆工艺)',
    remark: '变电站微机保护弱电屏蔽控制电缆',
  },
]
