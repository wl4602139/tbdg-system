/**
 * ============================================================
 * 特变电工 2级经营单位与 3、4级工厂企业结构树与属地费价模型数据底座
 * 严格对齐集团组织管理架构体系与各制造基地实际电网政策
 * ============================================================
 */

export interface EnterpriseTreeNode {
  id: string
  name: string // 简称，如 '沈变公司', '沈变本部', '天变天津基地'
  fullName: string // 官方全称
  level: 2 | 3 | 4 // 2: 二级经营单位, 3: 三级经营单位/工厂, 4: 四级制造工厂
  companyName: string // 归属二级经营单位简称 (如 '沈变公司')
  industry: '变压器产业' | '电线电缆产业'
  province: string
  city: string
  isFactory?: boolean // 是否为具体生产工厂
  children?: EnterpriseTreeNode[]
}

// 费价模型方案状态类型
export type SchemeStatus = '草稿' | '待生效' | '生效中' | '已归档' | '已停用'

// 单套费价方案接口
export interface FactoryTariffScheme {
  id: string
  versionCode: string
  name: string
  publishYear: string
  effectiveDate: string
  expiryDate: string
  status: SchemeStatus
  updatedAt: string
  operator: string
  description?: string
  policyDoc?: string // 属地政策依据文件号
  // 电力配置
  touRates: {
    deep: string // 深谷单价 (元/kWh)
    valley: string // 低谷单价 (元/kWh)
    flat: string // 平时单价 (元/kWh)
    peak: string // 高峰单价 (元/kWh)
    sharp: string // 尖峰单价 (元/kWh)
    capacityRate: string // 基本电费-容量 (元/kVA·月)
    demandRate: string // 基本电费-需量 (元/kW·月)
    billingMethod: 'capacity' | 'demand' // 核定执行计费方式
    powerFactorBase: string // 功率因数奖惩基准 (如 0.90)
    greenPremium: string // 直供绿电交易加价 (元/kWh)
  }
  // 属地 24 小时分时时段归属甘特分布 (夏令/冬令)
  hourlySlots: {
    summer: Array<'deep' | 'valley' | 'flat' | 'peak' | 'sharp'>
    winter: Array<'deep' | 'valley' | 'flat' | 'peak' | 'sharp'>
  }
  // 天然气配置
  gasPricingMode: 'tiered' | 'flat'
  gasTiers: Array<{
    id: string
    tier: string
    range: string
    price: string
    note?: string
  }>
  // 蒸汽与水耗固定单价 (元/t 或 元/kg)
  heatWaterPrices: {
    steamSuperheat: string // 过热蒸汽
    steamSaturated: string // 饱和蒸汽
    waterFresh: string // 工业自来水
    waterSoftened: string // 软化除盐水
    diesel: string // 轻柴油 0#
  }
}

// 实体基础数据及专属方案库接口
export interface FactoryProfile {
  id: string
  name: string
  shortName: string
  level: 2 | 3 | 4
  companyName: string
  industry: '变压器产业' | '电线电缆产业'
  province: string
  city: string
  gridCompany: string
  gridFeatures: string
  transformerCapacity: string
  maxDemand: string
  schemes: FactoryTariffScheme[]
}

/**
 * 🏢 特变电工标准企业架构拓扑树 (涵盖 6 大 2 级经营单位与 26+ 3/4 级工厂)
 */
export const ENTERPRISE_ORG_TREE: EnterpriseTreeNode[] = [
  // 1. 沈变公司 (2级经营单位 · 变压器产业 · 辽宁沈阳)
  {
    id: 'comp_sb',
    name: '沈变公司',
    fullName: '特变电工沈阳变压器集团有限公司',
    level: 2,
    companyName: '沈变公司',
    industry: '变压器产业',
    province: '辽宁省',
    city: '沈阳市',
    children: [
      {
        id: 'ws_sb_main',
        name: '沈变本部',
        fullName: '沈变本部 (超高压变压器制造厂区)',
        level: 3,
        companyName: '沈变公司',
        industry: '变压器产业',
        province: '辽宁省',
        city: '沈阳市',
        isFactory: true,
      },
      {
        id: 'ws_sb_hx',
        name: '和新套管',
        fullName: '特变电工沈变和新高压套管分厂',
        level: 3,
        companyName: '沈变公司',
        industry: '变压器产业',
        province: '辽宁省',
        city: '沈阳市',
        isFactory: true,
      },
      {
        id: 'ws_sb_kj',
        name: '康嘉互感器',
        fullName: '沈变康嘉互感器制造部',
        level: 3,
        companyName: '沈变公司',
        industry: '变压器产业',
        province: '辽宁省',
        city: '沈阳市',
        isFactory: true,
      },

      {
        id: 'ws_sb_yn',
        name: '印能公司',
        fullName: '沈变印能电气制造分厂',
        level: 3,
        companyName: '沈变公司',
        industry: '变压器产业',
        province: '辽宁省',
        city: '沈阳市',
        isFactory: true,
      },
    ],
  },
  // 2. 衡变公司 (2级经营单位 · 变压器产业 · 湖南衡阳)
  {
    id: 'comp_hb',
    name: '衡变公司',
    fullName: '特变电工衡阳变压器有限公司',
    level: 2,
    companyName: '衡变公司',
    industry: '变压器产业',
    province: '湖南省',
    city: '衡阳市',
    children: [
      {
        id: 'ws_hb_main',
        name: '衡变本部',
        fullName: '衡变本部 (特高压制造厂区)',
        level: 3,
        companyName: '衡变公司',
        industry: '变压器产业',
        province: '湖南省',
        city: '衡阳市',
        isFactory: true,
      },
      {
        id: 'ws_hb_nj',
        name: '南京公司',
        fullName: '特变电工南京智能电气生产基地',
        level: 3,
        companyName: '衡变公司',
        industry: '变压器产业',
        province: '江苏省',
        city: '南京市',
        isFactory: true,
      },
      {
        id: 'ws_hb_yj',
        name: '云集电气',
        fullName: '特变电工云集5G智能成套设备厂区',
        level: 3,
        companyName: '衡变公司',
        industry: '变压器产业',
        province: '湖南省',
        city: '衡阳市',
        isFactory: true,
      },
      {
        id: 'ws_hb_hn',
        name: '湖南电气',
        fullName: '特变电工湖南电气装备制造部',
        level: 3,
        companyName: '衡变公司',
        industry: '变压器产业',
        province: '湖南省',
        city: '衡阳市',
        isFactory: true,
      },
      {
        id: 'ws_hb_kg',
        name: '云集高压开关',
        fullName: '特变电工云集高压开关有限公司',
        level: 3,
        companyName: '衡变公司',
        industry: '变压器产业',
        province: '湖南省',
        city: '衡阳市',
        children: [
          {
            id: 'ws_hb_kg_yj',
            name: '云集',
            fullName: '云集高压开关制造基地',
            level: 4,
            companyName: '衡变公司',
            industry: '变压器产业',
            province: '湖南省',
            city: '衡阳市',
            isFactory: true,
          },
          {
            id: 'ws_hb_sk',
            name: '上开',
            fullName: '上海开件高压开关制造厂',
            level: 4,
            companyName: '衡变公司',
            industry: '变压器产业',
            province: '上海市',
            city: '上海市',
            isFactory: true,
          },
        ],
      },
      {
        id: 'ws_hb_xj',
        name: '新疆自控',
        fullName: '特变电工新疆自控成套车间',
        level: 3,
        companyName: '衡变公司',
        industry: '变压器产业',
        province: '新疆维吾尔自治区',
        city: '昌吉市',
        isFactory: true,
      },
      {
        id: 'ws_hb_tnj',
        name: '特缆建',
        fullName: '特变电工湖南能电建设园区',
        level: 3,
        companyName: '衡变公司',
        industry: '变压器产业',
        province: '湖南省',
        city: '衡阳市',
        isFactory: true,
      },
      {
        id: 'ws_hb_hr',
        name: '合容电气',
        fullName: '特变电工合容电气有限公司',
        level: 3,
        companyName: '衡变公司',
        industry: '变压器产业',
        province: '陕西省',
        city: '西安市',
        children: [
          {
            id: 'ws_hb_kbe',
            name: '科贝尔',
            fullName: '科贝尔高压材料制造基地',
            level: 4,
            companyName: '衡变公司',
            industry: '变压器产业',
            province: '浙江省',
            city: '嘉兴市',
            isFactory: true,
          },
          {
            id: 'ws_hb_hr_xa',
            name: '合容西安基地',
            fullName: '合容西安智能电力装备制造基地',
            level: 4,
            companyName: '衡变公司',
            industry: '变压器产业',
            province: '陕西省',
            city: '西安市',
            isFactory: true,
          },
        ],
      },
      {
        id: 'ws_hb_gil',
        name: '事杰爱迪',
        fullName: '特变电工事杰爱迪GIL产业基地',
        level: 3,
        companyName: '衡变公司',
        industry: '变压器产业',
        province: '湖南省',
        city: '衡阳市',
        isFactory: true,
      },
    ],
  },
  // 3. 新变厂 (2级经营单位 · 变压器产业 · 新疆昌吉)
  {
    id: 'comp_xb',
    name: '新变厂',
    fullName: '特变电工新疆变压器厂',
    level: 2,
    companyName: '新变厂',
    industry: '变压器产业',
    province: '新疆维吾尔自治区',
    city: '昌吉市',
    children: [
      {
        id: 'ws_xb_uhv',
        name: '超高压公司',
        fullName: '特变电工新疆超高压变压器制造中心',
        level: 3,
        companyName: '新变厂',
        industry: '变压器产业',
        province: '新疆维吾尔自治区',
        city: '昌吉市',
        isFactory: true,
      },
      {
        id: 'ws_xb_tb',
        name: '天变公司',
        fullName: '特变电工天津变压器有限公司',
        level: 3,
        companyName: '新变厂',
        industry: '变压器产业',
        province: '天津市',
        city: '静海区',
        children: [
          {
            id: 'ws_xb_tb_tj',
            name: '天变天津基地',
            fullName: '天变天津生产基地 (配电变压器)',
            level: 4,
            companyName: '新变厂',
            industry: '变压器产业',
            province: '天津市',
            city: '静海区',
            isFactory: true,
          },
          {
            id: 'ws_xb_tb_zh',
            name: '天变智慧能源',
            fullName: '天变智慧能源制造中心',
            level: 4,
            companyName: '新变厂',
            industry: '变压器产业',
            province: '天津市',
            city: '静海区',
            isFactory: true,
          },
          {
            id: 'ws_xb_tb_zn',
            name: '天变智能科技',
            fullName: '天变智能科技研发制造中心',
            level: 4,
            companyName: '新变厂',
            industry: '变压器产业',
            province: '天津市',
            city: '静海区',
            isFactory: true,
          },
          {
            id: 'ws_xb_tb_hy',
            name: '天变衡阳基地',
            fullName: '天变衡阳干式变压器车间',
            level: 4,
            companyName: '新变厂',
            industry: '变压器产业',
            province: '湖南省',
            city: '衡阳市',
            isFactory: true,
          },
          {
            id: 'ws_xb_tb_sy',
            name: '天变沈阳基地',
            fullName: '天变沈阳特变基地',
            level: 4,
            companyName: '新变厂',
            industry: '变压器产业',
            province: '辽宁省',
            city: '沈阳市',
            isFactory: true,
          },
        ],
      },
      {
        id: 'ws_xb_zndq',
        name: '智能电气',
        fullName: '特变电工智能电气配变制造部',
        level: 3,
        companyName: '新变厂',
        industry: '变压器产业',
        province: '新疆维吾尔自治区',
        city: '昌吉市',
        isFactory: true,
      },
      {
        id: 'ws_xb_jjj',
        name: '京津冀科技',
        fullName: '特变电工京津冀智能科技产业基地',
        level: 3,
        companyName: '新变厂',
        industry: '变压器产业',
        province: '天津市',
        city: '武清区',
        isFactory: true,
      },
      {
        id: 'ws_xb_zf',
        name: '珠峰硅钢',
        fullName: '珠峰硅钢精密冲剪退火制造部',
        level: 3,
        companyName: '新变厂',
        industry: '变压器产业',
        province: '天津市',
        city: '静海区',
        isFactory: true,
      },

      {
        id: 'ws_xb_yl',
        name: '银利电气',
        fullName: '特变电工银利智能电气制造厂',
        level: 3,
        companyName: '新变厂',
        industry: '变压器产业',
        province: '宁夏回族自治区',
        city: '银川市',
        isFactory: true,
      },
    ],
  },
  // 4. 鲁缆公司 (2级经营单位 · 电线电缆产业 · 山东泰安)
  {
    id: 'comp_ll',
    name: '鲁缆公司',
    fullName: '特变电工山东鲁能泰山电缆有限公司',
    level: 2,
    companyName: '鲁缆公司',
    industry: '电线电缆产业',
    province: '山东省',
    city: '泰安市',
    children: [
      {
        id: 'ws_ll_comp',
        name: '鲁缆公司',
        fullName: '特变电工山东鲁能泰山电缆制造总厂',
        level: 3,
        companyName: '鲁缆公司',
        industry: '电线电缆产业',
        province: '山东省',
        city: '泰安市',
        children: [
          {
            id: 'ws_ll_main',
            name: '鲁缆本部',
            fullName: '鲁缆本部高压交联立塔制造分厂',
            level: 4,
            companyName: '鲁缆公司',
            industry: '电线电缆产业',
            province: '山东省',
            city: '泰安市',
            isFactory: true,
          },
          {
            id: 'ws_ll_sw',
            name: '昭和',
            fullName: '特变电工昭和高压电缆附件制造厂',
            level: 4,
            companyName: '鲁缆公司',
            industry: '电线电缆产业',
            province: '山东省',
            city: '泰安市',
            isFactory: true,
          },
          {
            id: 'ws_ll_sg',
            name: '曙光',
            fullName: '特变电工曙光特种电缆分厂',
            level: 4,
            companyName: '鲁缆公司',
            industry: '电线电缆产业',
            province: '山东省',
            city: '新泰市',
            isFactory: true,
          },
        ],
      },
    ],
  },
  // 5. 新缆厂 (2级经营单位 · 电线电缆产业 · 新疆昌吉)
  {
    id: 'comp_xl',
    name: '新缆厂',
    fullName: '特变电工新疆线缆厂',
    level: 2,
    companyName: '新缆厂',
    industry: '电线电缆产业',
    province: '新疆维吾尔自治区',
    city: '昌吉市',
    children: [
      {
        id: 'ws_xl_comp',
        name: '新缆厂',
        fullName: '特变电工新疆线缆制造总厂',
        level: 3,
        companyName: '新缆厂',
        industry: '电线电缆产业',
        province: '新疆维吾尔自治区',
        city: '昌吉市',
        children: [
          {
            id: 'ws_xl_sub',
            name: '新疆线缆厂',
            fullName: '特变电工新疆特种线缆制造厂',
            level: 4,
            companyName: '新缆厂',
            industry: '电线电缆产业',
            province: '新疆维吾尔自治区',
            city: '昌吉市',
            isFactory: true,
          },
          {
            id: 'ws_xl_main',
            name: '新疆电缆',
            fullName: '特变电工新疆电缆实业制造部',
            level: 4,
            companyName: '新缆厂',
            industry: '电线电缆产业',
            province: '新疆维吾尔自治区',
            city: '昌吉市',
            isFactory: true,
          },
        ],
      },
    ],
  },
  // 6. 德缆公司 (2级经营单位 · 电线电缆产业 · 四川德阳)
  {
    id: 'comp_dl',
    name: '德缆公司',
    fullName: '特变电工（德阳）电缆股份有限公司',
    level: 2,
    companyName: '德缆公司',
    industry: '电线电缆产业',
    province: '四川省',
    city: '德阳市',
    children: [
      {
        id: 'ws_dl_main',
        name: '德缆公司',
        fullName: '特变电工（德阳）电缆制造基地',
        level: 3,
        companyName: '德缆公司',
        industry: '电线电缆产业',
        province: '四川省',
        city: '德阳市',
        isFactory: true,
      },
    ],
  },
]

// 属地电网与典型能源价格模版参数
const PROVINCE_CONFIGS: Record<
  string,
  {
    gridCompany: string
    gridFeatures: string
    rates: { deep: string; valley: string; flat: string; peak: string; sharp: string }
    gasPrice: string
    steamSuperheat: string
    steamSaturated: string
    waterFresh: string
    waterSoftened: string
    diesel: string
    defaultCapacity: string
    defaultDemand: string
    hourlySlots: {
      summer: Array<'deep' | 'valley' | 'flat' | 'peak' | 'sharp'>
      winter: Array<'deep' | 'valley' | 'flat' | 'peak' | 'sharp'>
    }
  }
> = {
  辽宁省: {
    gridCompany: '国网辽宁省电力有限公司 (沈阳供电局)',
    gridFeatures: '东北大电网大工业输配电价，秋冬季采暖季有气价保供上浮，夜间低谷水电消纳',
    rates: { deep: '0.2650', valley: '0.3520', flat: '0.7250', peak: '1.1680', sharp: '1.4200' },
    gasPrice: '2.8500',
    steamSuperheat: '320.00',
    steamSaturated: '260.00',
    waterFresh: '4.20',
    waterSoftened: '12.50',
    diesel: '7.85',
    defaultCapacity: '120,000 kVA',
    defaultDemand: '78,500 kW',
    hourlySlots: {
      summer: [
        'valley', 'valley', 'valley', 'valley', 'deep', 'deep', 'flat', 'flat',
        'peak', 'peak', 'sharp', 'sharp', 'peak', 'flat', 'flat', 'flat',
        'peak', 'peak', 'sharp', 'sharp', 'peak', 'flat', 'valley', 'valley',
      ],
      winter: [
        'valley', 'valley', 'valley', 'valley', 'valley', 'valley', 'flat', 'flat',
        'peak', 'peak', 'peak', 'flat', 'flat', 'flat', 'flat', 'peak',
        'sharp', 'sharp', 'sharp', 'peak', 'peak', 'flat', 'valley', 'valley',
      ],
    },
  },
  湖南省: {
    gridCompany: '国网湖南省电力有限公司 (衡阳供电分公司)',
    gridFeatures: '华中夏冬双高峰电网：7~8月执行极热高温尖峰加价政策，枯水期水火互补',
    rates: { deep: '0.2380', valley: '0.3650', flat: '0.7320', peak: '1.1950', sharp: '1.4550' },
    gasPrice: '3.1000',
    steamSuperheat: '310.00',
    steamSaturated: '250.00',
    waterFresh: '4.10',
    waterSoftened: '12.00',
    diesel: '7.80',
    defaultCapacity: '110,000 kVA',
    defaultDemand: '72,000 kW',
    hourlySlots: {
      summer: [
        'valley', 'valley', 'valley', 'valley', 'deep', 'deep', 'flat', 'flat',
        'peak', 'peak', 'sharp', 'sharp', 'peak', 'peak', 'flat', 'flat',
        'peak', 'sharp', 'sharp', 'sharp', 'peak', 'flat', 'valley', 'valley',
      ],
      winter: [
        'valley', 'valley', 'valley', 'valley', 'valley', 'valley', 'flat', 'flat',
        'peak', 'peak', 'peak', 'flat', 'flat', 'flat', 'flat', 'peak',
        'sharp', 'sharp', 'sharp', 'peak', 'peak', 'flat', 'valley', 'valley',
      ],
    },
  },
  新疆维吾尔自治区: {
    gridCompany: '国网新疆电力有限公司 (昌吉/乌市供电公司)',
    gridFeatures: '新疆准东煤电大基地输配电价，全国电价洼地 (平段约0.485元)，长协管道气2.20元/m³',
    rates: { deep: '0.1850', valley: '0.2600', flat: '0.4850', peak: '0.7850', sharp: '0.9650' },
    gasPrice: '2.2000',
    steamSuperheat: '260.00',
    steamSaturated: '210.00',
    waterFresh: '3.60',
    waterSoftened: '10.50',
    diesel: '7.50',
    defaultCapacity: '135,000 kVA',
    defaultDemand: '88,000 kW',
    hourlySlots: {
      summer: [
        'deep', 'deep', 'valley', 'valley', 'valley', 'valley', 'flat', 'flat',
        'flat', 'peak', 'peak', 'sharp', 'sharp', 'peak', 'flat', 'flat',
        'flat', 'peak', 'peak', 'sharp', 'peak', 'flat', 'valley', 'valley',
      ],
      winter: [
        'valley', 'valley', 'valley', 'valley', 'valley', 'valley', 'flat', 'flat',
        'flat', 'peak', 'peak', 'peak', 'flat', 'flat', 'flat', 'flat',
        'peak', 'peak', 'sharp', 'sharp', 'peak', 'flat', 'valley', 'valley',
      ],
    },
  },
  山东省: {
    gridCompany: '国网山东省电力公司 (泰安供电公司)',
    gridFeatures: '山东特有现货联动：分布式光伏大发，中午 11:00~14:00 实行深谷电价 (低至0.21元)，早晚双高峰',
    rates: { deep: '0.2100', valley: '0.3300', flat: '0.6800', peak: '1.1200', sharp: '1.3900' },
    gasPrice: '2.9500',
    steamSuperheat: '295.00',
    steamSaturated: '240.00',
    waterFresh: '4.50',
    waterSoftened: '13.00',
    diesel: '7.82',
    defaultCapacity: '95,000 kVA',
    defaultDemand: '62,000 kW',
    hourlySlots: {
      summer: [
        'valley', 'valley', 'valley', 'valley', 'valley', 'flat', 'flat', 'peak',
        'peak', 'flat', 'deep', 'deep', 'deep', 'flat', 'flat', 'peak',
        'peak', 'sharp', 'sharp', 'sharp', 'peak', 'flat', 'valley', 'valley',
      ],
      winter: [
        'valley', 'valley', 'valley', 'valley', 'valley', 'flat', 'flat', 'peak',
        'peak', 'flat', 'deep', 'deep', 'deep', 'flat', 'flat', 'peak',
        'sharp', 'sharp', 'sharp', 'peak', 'flat', 'flat', 'valley', 'valley',
      ],
    },
  },
  天津市: {
    gridCompany: '国网天津市电力公司 (城南/静海供电分公司)',
    gridFeatures: '华北电网蒙西绿电通道接入，落实大工业五时段结算，园区微电网峰谷套利试验',
    rates: { deep: '0.2450', valley: '0.3600', flat: '0.7180', peak: '1.1850', sharp: '1.4600' },
    gasPrice: '3.2500',
    steamSuperheat: '315.00',
    steamSaturated: '255.00',
    waterFresh: '5.10',
    waterSoftened: '13.80',
    diesel: '7.85',
    defaultCapacity: '40,000 kVA',
    defaultDemand: '26,000 kW',
    hourlySlots: {
      summer: [
        'deep', 'deep', 'valley', 'valley', 'valley', 'valley', 'flat', 'flat',
        'peak', 'peak', 'sharp', 'sharp', 'sharp', 'flat', 'flat', 'flat',
        'peak', 'peak', 'sharp', 'sharp', 'peak', 'flat', 'valley', 'valley',
      ],
      winter: [
        'valley', 'valley', 'valley', 'valley', 'valley', 'valley', 'flat', 'flat',
        'peak', 'peak', 'peak', 'flat', 'flat', 'flat', 'flat', 'peak',
        'sharp', 'sharp', 'sharp', 'peak', 'peak', 'flat', 'valley', 'valley',
      ],
    },
  },
  四川省: {
    gridCompany: '国网四川省电力公司 (德阳供电公司)',
    gridFeatures: '四川西南水电大省：丰水期 (6-10月) 水电消纳电价大幅优惠，枯水期水火互补',
    rates: { deep: '0.2150', valley: '0.3150', flat: '0.6450', peak: '1.0850', sharp: '1.3650' },
    gasPrice: '2.6800',
    steamSuperheat: '280.00',
    steamSaturated: '230.00',
    waterFresh: '3.80',
    waterSoftened: '11.50',
    diesel: '7.70',
    defaultCapacity: '75,000 kVA',
    defaultDemand: '48,000 kW',
    hourlySlots: {
      summer: [
        'deep', 'deep', 'deep', 'valley', 'valley', 'valley', 'flat', 'flat',
        'peak', 'peak', 'sharp', 'sharp', 'flat', 'flat', 'flat', 'flat',
        'peak', 'peak', 'sharp', 'sharp', 'peak', 'flat', 'valley', 'valley',
      ],
      winter: [
        'valley', 'valley', 'valley', 'valley', 'valley', 'valley', 'flat', 'flat',
        'peak', 'peak', 'peak', 'flat', 'flat', 'flat', 'flat', 'peak',
        'sharp', 'sharp', 'peak', 'peak', 'peak', 'flat', 'valley', 'valley',
      ],
    },
  },
  江苏省: {
    gridCompany: '国网江苏省电力公司 (南京供电公司)',
    gridFeatures: '华东经济大省两部制大工业电价，负荷高、峰谷差大，夏冬双高峰响应充分',
    rates: { deep: '0.2520', valley: '0.3580', flat: '0.7150', peak: '1.1750', sharp: '1.4350' },
    gasPrice: '3.1500',
    steamSuperheat: '315.00',
    steamSaturated: '255.00',
    waterFresh: '4.60',
    waterSoftened: '12.80',
    diesel: '7.80',
    defaultCapacity: '45,000 kVA',
    defaultDemand: '29,000 kW',
    hourlySlots: {
      summer: [
        'valley', 'valley', 'valley', 'valley', 'valley', 'flat', 'flat', 'peak',
        'peak', 'sharp', 'sharp', 'peak', 'flat', 'flat', 'flat', 'flat',
        'peak', 'peak', 'sharp', 'sharp', 'peak', 'flat', 'valley', 'valley',
      ],
      winter: [
        'valley', 'valley', 'valley', 'valley', 'valley', 'valley', 'flat', 'flat',
        'peak', 'peak', 'peak', 'flat', 'flat', 'flat', 'flat', 'peak',
        'sharp', 'sharp', 'sharp', 'peak', 'peak', 'flat', 'valley', 'valley',
      ],
    },
  },
  上海市: {
    gridCompany: '国网上海市电力公司',
    gridFeatures: '超大城市工业配电网，高可靠性两部制容量电费，分时响应机制健全',
    rates: { deep: '0.2600', valley: '0.3700', flat: '0.7200', peak: '1.1800', sharp: '1.4500' },
    gasPrice: '3.3000',
    steamSuperheat: '330.00',
    steamSaturated: '270.00',
    waterFresh: '5.20',
    waterSoftened: '14.00',
    diesel: '7.90',
    defaultCapacity: '30,000 kVA',
    defaultDemand: '19,500 kW',
    hourlySlots: {
      summer: [
        'valley', 'valley', 'valley', 'valley', 'valley', 'flat', 'flat', 'peak',
        'peak', 'sharp', 'sharp', 'peak', 'flat', 'flat', 'flat', 'flat',
        'peak', 'peak', 'sharp', 'sharp', 'peak', 'flat', 'valley', 'valley',
      ],
      winter: [
        'valley', 'valley', 'valley', 'valley', 'valley', 'valley', 'flat', 'flat',
        'peak', 'peak', 'peak', 'flat', 'flat', 'flat', 'flat', 'peak',
        'sharp', 'sharp', 'sharp', 'peak', 'peak', 'flat', 'valley', 'valley',
      ],
    },
  },
  陕西省: {
    gridCompany: '国网陕西省电力公司 (西安供电公司)',
    gridFeatures: '西北电网关中骨干枢纽，大工业两部制用电，天然气气源就近供应保障好',
    rates: { deep: '0.2350', valley: '0.3400', flat: '0.6950', peak: '1.1350', sharp: '1.3950' },
    gasPrice: '2.7500',
    steamSuperheat: '290.00',
    steamSaturated: '240.00',
    waterFresh: '4.00',
    waterSoftened: '11.80',
    diesel: '7.75',
    defaultCapacity: '60,000 kVA',
    defaultDemand: '39,000 kW',
    hourlySlots: {
      summer: [
        'deep', 'deep', 'valley', 'valley', 'valley', 'valley', 'flat', 'flat',
        'peak', 'peak', 'sharp', 'sharp', 'flat', 'flat', 'flat', 'flat',
        'peak', 'peak', 'sharp', 'sharp', 'peak', 'flat', 'valley', 'valley',
      ],
      winter: [
        'valley', 'valley', 'valley', 'valley', 'valley', 'valley', 'flat', 'flat',
        'peak', 'peak', 'peak', 'flat', 'flat', 'flat', 'flat', 'peak',
        'sharp', 'sharp', 'peak', 'peak', 'peak', 'flat', 'valley', 'valley',
      ],
    },
  },
  浙江省: {
    gridCompany: '国网浙江省电力公司 (嘉兴供电公司)',
    gridFeatures: '华东区域高密度工业负荷，尖峰平谷执行精准，分时浮动充分，供水供气管网发达',
    rates: { deep: '0.2580', valley: '0.3680', flat: '0.7220', peak: '1.1820', sharp: '1.4420' },
    gasPrice: '3.2000',
    steamSuperheat: '325.00',
    steamSaturated: '265.00',
    waterFresh: '4.80',
    waterSoftened: '13.20',
    diesel: '7.85',
    defaultCapacity: '35,000 kVA',
    defaultDemand: '23,000 kW',
    hourlySlots: {
      summer: [
        'valley', 'valley', 'valley', 'valley', 'valley', 'flat', 'flat', 'peak',
        'peak', 'sharp', 'sharp', 'peak', 'flat', 'flat', 'flat', 'flat',
        'peak', 'peak', 'sharp', 'sharp', 'peak', 'flat', 'valley', 'valley',
      ],
      winter: [
        'valley', 'valley', 'valley', 'valley', 'valley', 'valley', 'flat', 'flat',
        'peak', 'peak', 'peak', 'flat', 'flat', 'flat', 'flat', 'peak',
        'sharp', 'sharp', 'sharp', 'peak', 'peak', 'flat', 'valley', 'valley',
      ],
    },
  },
  宁夏回族自治区: {
    gridCompany: '国网宁夏电力公司 (银川供电公司)',
    gridFeatures: '宁夏新能源大基地，大工业输配电价低廉，光伏风电消纳比例高',
    rates: { deep: '0.2050', valley: '0.2950', flat: '0.5600', peak: '0.8900', sharp: '1.0800' },
    gasPrice: '2.4500',
    steamSuperheat: '275.00',
    steamSaturated: '225.00',
    waterFresh: '3.70',
    waterSoftened: '11.00',
    diesel: '7.60',
    defaultCapacity: '22,000 kVA',
    defaultDemand: '14,000 kW',
    hourlySlots: {
      summer: [
        'deep', 'deep', 'valley', 'valley', 'valley', 'valley', 'flat', 'flat',
        'flat', 'peak', 'peak', 'sharp', 'sharp', 'peak', 'flat', 'flat',
        'flat', 'peak', 'peak', 'sharp', 'peak', 'flat', 'valley', 'valley',
      ],
      winter: [
        'valley', 'valley', 'valley', 'valley', 'valley', 'valley', 'flat', 'flat',
        'flat', 'peak', 'peak', 'peak', 'flat', 'flat', 'flat', 'flat',
        'peak', 'peak', 'sharp', 'sharp', 'peak', 'flat', 'valley', 'valley',
      ],
    },
  },
}

// 扁平化树节点
export function flattenEnterpriseTree(nodes: EnterpriseTreeNode[]): EnterpriseTreeNode[] {
  const result: EnterpriseTreeNode[] = []
  function traverse(list: EnterpriseTreeNode[]) {
    for (const node of list) {
      result.push(node)
      if (node.children && node.children.length > 0) {
        traverse(node.children)
      }
    }
  }
  traverse(nodes)
  return result
}

// 生成指定节点的初始方案集合
function createSchemesForNode(
  id: string,
  shortName: string,
  province: string,
  city: string,
  capacity: string,
  demand: string
): FactoryTariffScheme[] {
  const cfg = PROVINCE_CONFIGS[province] || PROVINCE_CONFIGS['辽宁省']

  const activeScheme: FactoryTariffScheme = {
    id: `sch_${id}_2026_01`,
    versionCode: 'v2026.01',
    name: `2026年度${city}大工业五时段电价与能源核算方案`,
    publishYear: '2026',
    effectiveDate: '2026-01-01',
    expiryDate: '2026-12-31',
    status: '生效中',
    updatedAt: '2026-01-05 10:30',
    operator: '系统管理员 (能碳中心)',
    policyDoc: `${province.substring(0, 1)}发改价格〔2025〕${id.length * 73 + 120}号`,
    description: `落实${province}最新发改委工商业分时电价，执行大工业五时段结算。`,
    touRates: {
      deep: cfg.rates.deep,
      valley: cfg.rates.valley,
      flat: cfg.rates.flat,
      peak: cfg.rates.peak,
      sharp: cfg.rates.sharp,
      capacityRate: '32.00',
      demandRate: '48.00',
      billingMethod: 'demand',
      powerFactorBase: '0.90',
      greenPremium: '0.0400',
    },
    hourlySlots: cfg.hourlySlots,
    gasPricingMode: cfg.gasPrice === '2.2000' ? 'flat' : 'tiered',
    gasTiers: [
      {
        id: `gt_${id}_1`,
        tier: '第一档 (基础用气)',
        range: '0 ~ 500,000 m³/月',
        price: cfg.gasPrice,
        note: '基准生产与干燥用气',
      },
      {
        id: `gt_${id}_2`,
        tier: '第二档 (增量用气)',
        range: '> 500,000 m³/月',
        price: (parseFloat(cfg.gasPrice) + 0.4).toFixed(4),
        note: '超额调控溢价',
      },
    ],
    heatWaterPrices: {
      steamSuperheat: cfg.steamSuperheat,
      steamSaturated: cfg.steamSaturated,
      waterFresh: cfg.waterFresh,
      waterSoftened: cfg.waterSoftened,
      diesel: cfg.diesel,
    },
  }

  const historyScheme: FactoryTariffScheme = {
    id: `sch_${id}_2025_01`,
    versionCode: 'v2025.01',
    name: `2025年度${city}能源核算基准方案 (已归档)`,
    publishYear: '2025',
    effectiveDate: '2025-01-01',
    expiryDate: '2025-12-31',
    status: '已归档',
    updatedAt: '2025-01-10 09:00',
    operator: '张建国 (能碳总监)',
    policyDoc: `${province.substring(0, 1)}发改价格〔2024〕620号`,
    touRates: {
      deep: (parseFloat(cfg.rates.deep) - 0.01).toFixed(4),
      valley: (parseFloat(cfg.rates.valley) - 0.015).toFixed(4),
      flat: (parseFloat(cfg.rates.flat) - 0.02).toFixed(4),
      peak: (parseFloat(cfg.rates.peak) - 0.025).toFixed(4),
      sharp: (parseFloat(cfg.rates.sharp) - 0.03).toFixed(4),
      capacityRate: '30.00',
      demandRate: '45.00',
      billingMethod: 'demand',
      powerFactorBase: '0.90',
      greenPremium: '0.0350',
    },
    hourlySlots: cfg.hourlySlots,
    gasPricingMode: 'tiered',
    gasTiers: [
      {
        id: `gt_${id}_old`,
        tier: '第一档',
        range: '0 ~ 500,000 m³/月',
        price: (parseFloat(cfg.gasPrice) - 0.08).toFixed(4),
        note: '2025基准',
      },
    ],
    heatWaterPrices: {
      steamSuperheat: (parseFloat(cfg.steamSuperheat) - 15).toFixed(2),
      steamSaturated: (parseFloat(cfg.steamSaturated) - 12).toFixed(2),
      waterFresh: (parseFloat(cfg.waterFresh) - 0.2).toFixed(2),
      waterSoftened: (parseFloat(cfg.waterSoftened) - 0.7).toFixed(2),
      diesel: (parseFloat(cfg.diesel) - 0.25).toFixed(2),
    },
  }

  return [activeScheme, historyScheme]
}

/**
 * 🏭 全量实体与工厂数据清单 (覆盖全部 2 级经营单位与 3、4 级工厂)
 */
export const INITIAL_FACTORIES_DATA: FactoryProfile[] = flattenEnterpriseTree(ENTERPRISE_ORG_TREE).map((node) => {
  const cfg = PROVINCE_CONFIGS[node.province] || PROVINCE_CONFIGS['辽宁省']
  const capacity = cfg.defaultCapacity
  const demand = cfg.defaultDemand

  return {
    id: node.id,
    name: node.fullName,
    shortName: node.name,
    level: node.level,
    companyName: node.companyName,
    industry: node.industry,
    province: node.province,
    city: node.city,
    gridCompany: cfg.gridCompany,
    gridFeatures: cfg.gridFeatures,
    transformerCapacity: capacity,
    maxDemand: demand,
    schemes: createSchemesForNode(node.id, node.name, node.province, node.city, capacity, demand),
  }
})
