/**
 * 特变电工能碳数字化双中心 · 全域统一字段与术语标准字典 (System Field & Terminology Dictionary)
 * 
 * 核心设计目标：
 * 建立全系统唯一的单源真理 (Single Source of Truth, SSOT) 字段表；
 * 防止同一个字段、模块、指标或控件在不同页面中显示不同名称，彻底杜绝界面一致性问题。
 * 
 * 所有业务页面（指标管控、用能监测、设备在线监测、工业微电网、能效对标、碳排监测、报表中心、系统设置等）
 * 的标题、卡片、表头、下拉筛选、单位及操作命名必须无条件以本字典为基准。
 */

export type FieldCategory =
  | 'module_title'       // 业务模块与板块主标题
  | 'product_hierarchy'  // 产品制造与工艺层级
  | 'time_benchmark'     // 时间维度与对标口径
  | 'energy_medium'      // 能源介质与分时类型
  | 'engineering_unit'   // 工业实物量纲与单耗单位
  | 'table_action'       // 表格列名、状态与操作按钮

export interface UnifiedFieldItem {
  id: string
  fieldKey: string
  standardName: string            // 🌟 统一标准显示名称 (全系统强制一致)
  category: FieldCategory
  categoryName: string
  standardUnit?: string           // 标准工业量纲单位 (若适用)
  forbiddenAliases: string[]      // ❌ 严格禁止使用的旧称、衍生词或易混淆名称
  applicablePages: string[]       // 涉及应用的核心业务页面路由或模块
  definition: string              // 字段业务定义与人机交互说明
  tokenColor?: string             // 设计系统标准色值 (针对介质与分时等)
}

/**
 * 🌟 核心常量枚举集合 (供全系统页面直接引入复用)
 */
export const STANDARDIZED_TERMS = {
  // 1. 时间与对标类
  TIME_DIM_DAY: '日',
  TIME_DIM_MONTH: '月',
  TIME_DIM_QUARTER: '季度',
  TIME_DIM_YEAR: '年',
  TIME_DIM_CUSTOM: '自定义',
  BENCHMARK_YOY: '同比',          // 强制：全系统唯一允许的时序对标术语

  // 2. 产品与工艺层级
  PRODUCT_MAJOR: '产品大类',      // 1 级分类 (变压器、线缆、套管等)
  PRODUCT_SUB: '产品中类',        // 2 级分类 (交流变压器-1000kV等，严禁使用产品种类)
  PRODUCT_MODEL: '产品型号',      // 3 级具体型号 (SFZ11-63000/110等)
  PROCESS_NAME: '关键工序',       // 工艺工序 (干燥、试验、拉丝等)
  PRODUCT_DETAIL_TABLE: '产品能耗明细', // 明细表格标准名称

  // 3. 核心板块标题
  SECTION_USAGE_ELEC: '电力数据',
  SECTION_USAGE_ENERGY: '能耗数据',
  SECTION_USAGE_TOU: '市电峰平谷用电分析',
  SECTION_USAGE_TOU_DONUT: '峰平谷用电构成',
  SECTION_USAGE_TOU_BAR: '峰平谷用电分析',
  SECTION_EQUIPMENT_MAIN: '监测设备',
  SECTION_INDICATOR_PROCESS: '关键工序能效指标',
  SECTION_INDICATOR_PRODUCT: '产品管控指标',
  SECTION_INDICATOR_OVERALL: '整体指标',

  // 4. 8 大能源介质
  ENERGY_TOTAL_ELEC: '总用电量',
  ENERGY_GRID_ELEC: '市电用量',
  ENERGY_SOLAR_ELEC: '消纳绿电量',
  ENERGY_WATER: '水资源消耗量',
  ENERGY_GAS: '天然气量',
  ENERGY_STEAM: '外购蒸汽量',
  ENERGY_OIL: '油消耗量',
  ENERGY_NITROGEN: '液氮消耗量',

  // 5. 分时 4 段
  TOU_TIP: '尖峰',
  TOU_PEAK: '高峰',
  TOU_FLAT: '平段',
  TOU_VALLEY: '低谷',

  // 6. 通用操作
  ACTION_QUERY: '查询',
  ACTION_RESET: '重置',
  ACTION_EXPORT: '导出',
  ACTION_DETAIL: '详情',
} as const

/**
 * 📚 全系统 80+ 核心统一字段标准对照清单
 */
export const UNIFIED_FIELD_DICTIONARY: UnifiedFieldItem[] = [
  // =========================================================================
  // 1. 业务模块与板块主标题 (module_title)
  // =========================================================================
  {
    id: 'UF-001',
    fieldKey: 'sec_usage_elec',
    standardName: '电力数据',
    category: 'module_title',
    categoryName: '业务模块与板块',
    forbiddenAliases: ['电力负荷与消纳整体监测', '电力负荷监测', '用电量整体控件', '电力概览'],
    applicablePages: ['/zero-carbon/monitor/online/usage'],
    definition: '用能在线监测页面第一排卡片整体控件主标题，统揽总用电量、市电用量与消纳绿电量三大核心电能数据。',
  },
  {
    id: 'UF-002',
    fieldKey: 'sec_usage_energy',
    standardName: '能耗数据',
    category: 'module_title',
    categoryName: '业务模块与板块',
    forbiddenAliases: ['全厂能耗走势', '能耗明细台账', '能源走势图', '能耗时序分析'],
    applicablePages: ['/zero-carbon/monitor/online/usage'],
    definition: '用能在线监测页面主图表板块标题，支持折线走势图与高密数据表双模式平滑切换及数据导出。',
  },
  {
    id: 'UF-003',
    fieldKey: 'sec_usage_tou_donut',
    standardName: '峰平谷用电构成',
    category: 'module_title',
    categoryName: '业务模块与板块',
    forbiddenAliases: ['市电峰平谷总体构成', '峰平谷总体分布', '分时电量环形图', '市电分时构成'],
    applicablePages: ['/zero-carbon/monitor/online/usage'],
    definition: '市电分时用电分析左侧环形图子卡片标题，以纯粹文字呈现尖峰平谷四大时段电量占比，剥离标题栏总量数值。',
  },
  {
    id: 'UF-004',
    fieldKey: 'sec_usage_tou_bar',
    standardName: '峰平谷用电分析',
    category: 'module_title',
    categoryName: '业务模块与板块',
    forbiddenAliases: ['市电峰平谷用电连续分布 (万kWh)', '市电峰平谷构成', '分时连续堆叠柱状图', '尖/峰/平/谷 连续堆叠'],
    applicablePages: ['/zero-carbon/monitor/online/usage'],
    definition: '市电分时用电分析右侧分时时序堆叠柱状图子卡片标题，与左侧“峰平谷用电构成”形成工整的“构成与分析”严整对称体系。',
  },
  {
    id: 'UF-005',
    fieldKey: 'sec_equip_monitor',
    standardName: '监测设备',
    category: 'module_title',
    categoryName: '业务模块与板块',
    forbiddenAliases: ['1# 1000kV级气相白真空干燥罐组 (直接写死设备名)', '重点设备监测', '设备详情卡片'],
    applicablePages: ['/zero-carbon/monitor/online/equipment'],
    definition: '重点用能设备监控页面主卡片标准标题，消除特定编号与具体型号标题硬编码，由左侧架构树与悬停 Tooltip 联动呈现具体实体。',
  },
  {
    id: 'UF-006',
    fieldKey: 'sec_indicator_process',
    standardName: '关键工序能效指标',
    category: 'module_title',
    categoryName: '业务模块与板块',
    forbiddenAliases: ['关键制造工序能效对标指标', '工序能耗对标', '关键工序对标指标', '关键制造工序'],
    applicablePages: ['/zero-carbon/monitor/indicator'],
    definition: '指标管控看板中单体工厂视角下的关键工序指标板块标题，剥离冗余的“制造”与“对标”二字。',
  },
  {
    id: 'UF-007',
    fieldKey: 'sec_indicator_product',
    standardName: '产品管控指标',
    category: 'module_title',
    categoryName: '业务模块与板块',
    forbiddenAliases: ['主要产品分类', '产品产线分类', '主要产品能耗', '产品指标对标'],
    applicablePages: ['/zero-carbon/monitor/indicator', '/zero-carbon/energy/unit-product'],
    definition: '反映企业核心产品大类及中类单耗的考核控制板块标题，统一采用 Amber 琥珀色指示条。',
  },
  {
    id: 'UF-008',
    fieldKey: 'sec_indicator_overall',
    standardName: '整体指标',
    category: 'module_title',
    categoryName: '业务模块与板块',
    forbiddenAliases: ['经营单位及项目公司整体指标', '综合大盘指标', '厂区整体能效', '核心经营指标'],
    applicablePages: ['/zero-carbon/monitor/indicator'],
    definition: '指标管控大盘第一板块，集中展现全厂或集团的综合能耗、用电量、万元产值能耗、非化石占比等全局指标。',
  },
  {
    id: 'UF-009',
    fieldKey: 'report_unit_product',
    standardName: '单耗报表',
    category: 'module_title',
    categoryName: '业务模块与板块',
    forbiddenAliases: ['单位产品能耗报表', '产品单耗报表', '产品能耗台账', '单位产品报表', '能碳指标报表'],
    applicablePages: ['/zero-carbon/reports/unit'],
    definition: '统计报表中心第三大标准报表名称，涵盖单位产品能耗、综合能耗及碳排放强度的综合台账报表。',
  },
  {
    id: 'UF-010',
    fieldKey: 'report_usage',
    standardName: '用能分析报表',
    category: 'module_title',
    categoryName: '业务模块与板块',
    forbiddenAliases: ['用能报表', '能源消耗报表', '电力与介质分析报表'],
    applicablePages: ['/zero-carbon/reports/usage'],
    definition: '报表管理中心第一大报表，按日/月/季度/年时序动态命名，第一列固定为统计时间。',
  },
  {
    id: 'UF-011',
    fieldKey: 'report_cost',
    standardName: '成本分析报表',
    category: 'module_title',
    categoryName: '业务模块与板块',
    forbiddenAliases: ['能源成本报表', '用能成本报表', '电费成本明细表'],
    applicablePages: ['/zero-carbon/reports/cost'],
    definition: '报表管理中心第二大报表，仅保留综合电价列，第一列固定为统计时间。',
  },

  // =========================================================================
  // 2. 产品制造与工艺层级 (product_hierarchy)
  // =========================================================================
  {
    id: 'UF-020',
    fieldKey: 'hierarchy_major',
    standardName: '产品大类',
    category: 'product_hierarchy',
    categoryName: '产品制造层级',
    forbiddenAliases: ['主要产品', '产品类别', '制造大类', '产品线', '生产线'],
    applicablePages: ['/zero-carbon/monitor/indicator', '/zero-carbon/energy/unit-product', '/zero-carbon/energy/benchmark', '/system?section=product-model'],
    definition: '特变电工 1 级标准产品谱系（如变压器、线缆、套管、互感器、GIS 组合电器、中低压开关柜等）。',
  },
  {
    id: 'UF-021',
    fieldKey: 'hierarchy_sub',
    standardName: '产品中类',
    category: 'product_hierarchy',
    categoryName: '产品制造层级',
    forbiddenAliases: ['产品种类', '产线子分类', '子大类', '所属产线', '二级分类', '产品子类'],
    applicablePages: ['/zero-carbon/monitor/indicator', '/zero-carbon/energy/unit-product', '/zero-carbon/energy/benchmark', '/system?section=product-model'],
    definition: '特变电工 2 级标准中类（如交流变压器-1000kV、高压交联电力电缆等），全系统统一规范更名为“产品中类”。',
  },
  {
    id: 'UF-022',
    fieldKey: 'hierarchy_model',
    standardName: '产品型号',
    category: 'product_hierarchy',
    categoryName: '产品制造层级',
    forbiddenAliases: ['型号编码', '规格型号', '产品代码', '规格代码'],
    applicablePages: ['/zero-carbon/monitor/indicator', '/zero-carbon/energy/unit-product', '/zero-carbon/energy/benchmark', '/system?section=product-model'],
    definition: '企业 MES/ERP 生产的具体工程型号（如 SFZ11-63000/110、YJV-0.6/1kV 等）。',
  },
  {
    id: 'UF-023',
    fieldKey: 'hierarchy_process',
    standardName: '关键工序',
    category: 'product_hierarchy',
    categoryName: '产品制造层级',
    forbiddenAliases: ['关键制造工序', '主要生产工序', '制造工艺', '生产工段', '能耗工序'],
    applicablePages: ['/zero-carbon/monitor/indicator', '/zero-carbon/energy/benchmark', '/system?section=process-manage'],
    definition: '企业产品生产过程中的关键能耗工序（如器身干燥、试验、拉丝、交联、固化等）。',
  },
  {
    id: 'UF-024',
    fieldKey: 'table_product_energy',
    standardName: '产品能耗明细',
    category: 'product_hierarchy',
    categoryName: '产品制造层级',
    forbiddenAliases: ['产品型号能耗明细', '产品型号单耗明细', '型号能耗明细表', '完工订单台账'],
    applicablePages: ['/zero-carbon/monitor/indicator', '/zero-carbon/energy/unit-product'],
    definition: '呈现具体产品型号产量、用能类型、实物消耗量、折标能耗量及单耗变动的核心表格标题。',
  },

  // =========================================================================
  // 3. 时间维度与对标口径 (time_benchmark)
  // =========================================================================
  {
    id: 'UF-030',
    fieldKey: 'dim_day',
    standardName: '日',
    category: 'time_benchmark',
    categoryName: '时间与对标',
    forbiddenAliases: ['日度', '按日', '每日', '天'],
    applicablePages: ['/zero-carbon/monitor/online/usage', '/zero-carbon/monitor/online/equipment', '/zero-carbon/monitor/online/microgrid'],
    definition: '全系统顶栏时间维度按钮统一单字标准，表示按自然日为统计颗粒度。',
  },
  {
    id: 'UF-031',
    fieldKey: 'dim_month',
    standardName: '月',
    category: 'time_benchmark',
    categoryName: '时间与对标',
    forbiddenAliases: ['月度', '按月', '每月', '自然月'],
    applicablePages: ['全系统所有业务页面'],
    definition: '全系统顶栏时间维度按钮统一单字标准，表示按自然月为统计与考核颗粒度。',
  },
  {
    id: 'UF-032',
    fieldKey: 'dim_quarter',
    standardName: '季度',
    category: 'time_benchmark',
    categoryName: '时间与对标',
    forbiddenAliases: ['季', '季报', '按季'],
    applicablePages: ['全系统所有业务页面'],
    definition: '全系统顶栏时间维度按钮统一标准，支持 Q1、Q2、Q3、Q4 跨月加权考核。',
  },
  {
    id: 'UF-033',
    fieldKey: 'dim_year',
    standardName: '年',
    category: 'time_benchmark',
    categoryName: '时间与对标',
    forbiddenAliases: ['年度', '按年', '全年', '年度累计'],
    applicablePages: ['全系统所有业务页面'],
    definition: '全系统顶栏时间维度按钮统一单字标准，表示跨自然年度的宏观对标。',
  },
  {
    id: 'UF-034',
    fieldKey: 'dim_custom',
    standardName: '自定义',
    category: 'time_benchmark',
    categoryName: '时间与对标',
    forbiddenAliases: ['自定义范围', '时间段', '起止时间', '自由选期'],
    applicablePages: ['/zero-carbon/energy/structure', '/zero-carbon/energy/unit-product', '/zero-carbon/energy/unit-output', '/zero-carbon/energy/benchmark'],
    definition: '支持用户自定义选择起始月与结束月的时间区间控件模式。',
  },
  {
    id: 'UF-035',
    fieldKey: 'benchmark_yoy',
    standardName: '同比',
    category: 'time_benchmark',
    categoryName: '时间与对标',
    forbiddenAliases: [
      '同比增长', '同比下降', '同比变化', '同比变动', '碳排同比', '物理认定量同比', '同期对比', '同比上期',
      '环比', '环比增长', '环比变化', '环比变动', 'MoM' // ❌ 全系统绝对禁止出现任何环比数据
    ],
    applicablePages: ['全系统所有业务页面、卡片、图表、表格与导出文件'],
    definition: '反映统计期相对历史同期对比的变动比率，全系统强制固定显示为“同比”二字，严禁附带任何多余修饰。',
  },

  // =========================================================================
  // 4. 8 大能源介质与分时类型 (energy_medium)
  // =========================================================================
  {
    id: 'UF-040',
    fieldKey: 'medium_total_elec',
    standardName: '总用电量',
    category: 'energy_medium',
    categoryName: '能源介质与分时',
    standardUnit: '万kWh / kWh',
    tokenColor: '#2C7CFF',
    forbiddenAliases: ['综合电量', '用电总量', '电力消耗总量', '全厂总电耗'],
    applicablePages: ['/zero-carbon/monitor/online/usage', '/zero-carbon/monitor/indicator', '/zero-carbon/energy/structure'],
    definition: '统计期内消费的全部电力总和（总用电量 = 市电用量 + 消纳绿电量），主题色为科技蓝 #2C7CFF。',
  },
  {
    id: 'UF-041',
    fieldKey: 'medium_grid_elec',
    standardName: '市电用量',
    category: 'energy_medium',
    categoryName: '能源介质与分时',
    standardUnit: '万kWh / kWh',
    tokenColor: '#41C0FF',
    forbiddenAliases: ['市电量', '网购电量', '电网购电', '市网供电量'],
    applicablePages: ['/zero-carbon/monitor/online/usage', '/zero-carbon/monitor/indicator'],
    definition: '从国家电网或南方电网等外部公共电网购入结算的常规电力消费量，主题色为天蓝色 #41C0FF。',
  },
  {
    id: 'UF-042',
    fieldKey: 'medium_solar_elec',
    standardName: '消纳绿电量',
    category: 'energy_medium',
    categoryName: '能源介质与分时',
    standardUnit: '万kWh / kWh',
    tokenColor: '#00D492',
    forbiddenAliases: ['直供绿电量', '绿电量', '分布式光伏自用', '光伏发电量', '绿电消纳量'],
    applicablePages: ['/zero-carbon/monitor/online/usage', '/zero-carbon/monitor/indicator'],
    definition: '企业自建分布式光伏、交易绿电或自备可再生能源自发自用并就地消纳的绿色电量，主题色为翠绿 #00D492。',
  },
  {
    id: 'UF-043',
    fieldKey: 'medium_water',
    standardName: '水资源消耗量',
    category: 'energy_medium',
    categoryName: '能源介质与分时',
    standardUnit: 'm³',
    tokenColor: '#10C4CE',
    forbiddenAliases: ['水量', '水资源总量', '用水量', '生产用水'],
    applicablePages: ['/zero-carbon/monitor/online/usage', '/zero-carbon/monitor/indicator'],
    definition: '生产制造与厂区公辅消耗的新鲜自来水及工业循环水总量，主题色为青蓝 #10C4CE。',
  },
  {
    id: 'UF-044',
    fieldKey: 'medium_gas',
    standardName: '天然气量',
    category: 'energy_medium',
    categoryName: '能源介质与分时',
    standardUnit: 'm³',
    tokenColor: '#FF6536',
    forbiddenAliases: ['天然气消耗量', '燃气量', '天然气用量', '天然气消耗'],
    applicablePages: ['/zero-carbon/monitor/online/usage', '/zero-carbon/monitor/indicator'],
    definition: '锅炉、退火炉等工业热工装备消耗的管道天然气总量，主题色为活力橙 #FF6536。',
  },
  {
    id: 'UF-045',
    fieldKey: 'medium_steam',
    standardName: '外购蒸汽量',
    category: 'energy_medium',
    categoryName: '能源介质与分时',
    standardUnit: 't',
    tokenColor: '#FFBA00',
    forbiddenAliases: ['管道工作压力 (已废弃纠偏)', '蒸汽消耗量', '蒸汽量', '蒸汽耗量'],
    applicablePages: ['/zero-carbon/monitor/online/usage', '/zero-carbon/monitor/indicator', '/zero-carbon/monitor/online/equipment'],
    definition: '从外部热力管网购入用于真空干燥罐、固化工序的工业饱和/过热蒸汽量，主题色为琥珀金 #FFBA00。',
  },
  {
    id: 'UF-046',
    fieldKey: 'medium_oil',
    standardName: '油消耗量',
    category: 'energy_medium',
    categoryName: '能源介质与分时',
    standardUnit: 'L',
    tokenColor: '#8E73ED',
    forbiddenAliases: ['油消耗', '柴油量', '工业油耗', '燃油消耗量'],
    applicablePages: ['/zero-carbon/monitor/online/usage'],
    definition: '厂区特种车辆、备用柴油发电机组等消耗的工业燃油总量，主题色为雅紫 #8E73ED。',
  },
  {
    id: 'UF-047',
    fieldKey: 'medium_nitrogen',
    standardName: '液氮消耗量',
    category: 'energy_medium',
    categoryName: '能源介质与分时',
    standardUnit: 't',
    tokenColor: '#4F39F6',
    forbiddenAliases: ['液氮量', '工业液氮', '氮气量', '液氮耗量'],
    applicablePages: ['/zero-carbon/monitor/online/usage'],
    definition: '线缆产业连续硫化、交联管路保护等特种生产工序所必需的工业液氮总量，主题色为深蓝靛 #4F39F6。',
  },
  {
    id: 'UF-048',
    fieldKey: 'tou_tip',
    standardName: '尖峰',
    category: 'energy_medium',
    categoryName: '能源介质与分时',
    tokenColor: '#FF6536',
    forbiddenAliases: ['尖峰电量', '尖峰时段', '尖段', '尖段用电'],
    applicablePages: ['/zero-carbon/monitor/online/usage', '/zero-carbon/energy/cost'],
    definition: '电网最高负荷时段，执行惩罚性尖峰高电价，主题色 #FF6536。',
  },
  {
    id: 'UF-049',
    fieldKey: 'tou_peak',
    standardName: '高峰',
    category: 'energy_medium',
    categoryName: '能源介质与分时',
    tokenColor: '#FFBA00',
    forbiddenAliases: ['高峰电量', '高峰时段', '峰段', '峰段用电'],
    applicablePages: ['/zero-carbon/monitor/online/usage', '/zero-carbon/energy/cost'],
    definition: '电网日间高负荷时段，执行高峰电价，主题色 #FFBA00。',
  },
  {
    id: 'UF-050',
    fieldKey: 'tou_flat',
    standardName: '平段',
    category: 'energy_medium',
    categoryName: '能源介质与分时',
    tokenColor: '#2C7CFF',
    forbiddenAliases: ['平段电量', '平时段', '平电', '平时'],
    applicablePages: ['/zero-carbon/monitor/online/usage', '/zero-carbon/energy/cost'],
    definition: '常规基准负荷时段，执行平段基准电价，主题色 #2C7CFF。',
  },
  {
    id: 'UF-051',
    fieldKey: 'tou_valley',
    standardName: '低谷',
    category: 'energy_medium',
    categoryName: '能源介质与分时',
    tokenColor: '#10C4CE',
    forbiddenAliases: ['低谷电量', '谷段', '谷段用电', '谷时段'],
    applicablePages: ['/zero-carbon/monitor/online/usage', '/zero-carbon/energy/cost'],
    definition: '电网夜间低负荷时段，执行优惠低电价，主题色 #10C4CE。',
  },

  // =========================================================================
  // 5. 工业实物量纲与单耗单位 (engineering_unit)
  // =========================================================================
  {
    id: 'UF-060',
    fieldKey: 'unit_transformer_output',
    standardName: '变压器产量单位',
    category: 'engineering_unit',
    categoryName: '工业量纲单位',
    standardUnit: '台',
    forbiddenAliases: ['万kVA (此为容量单位，严禁作为变压器产量)', 'kVA', '套'],
    applicablePages: ['/zero-carbon/monitor/indicator', '/zero-carbon/energy/unit-product', '/zero-carbon/reports/unit'],
    definition: '变压器属于大型单件离散制造装备，其实物产量统计单位必须严格固定为“台”。',
  },
  {
    id: 'UF-061',
    fieldKey: 'unit_cable_output',
    standardName: '线缆产量单位',
    category: 'engineering_unit',
    categoryName: '工业量纲单位',
    standardUnit: '万km·mm² / km',
    forbiddenAliases: ['台 (线缆非离散台套)', '支', '件'],
    applicablePages: ['/zero-carbon/monitor/indicator', '/zero-carbon/energy/unit-product'],
    definition: '线缆属于连续长度截面挤出制造，标准产量为“折合万km·mm²”或“km”。',
  },
  {
    id: 'UF-062',
    fieldKey: 'unit_bushing_output',
    standardName: '套管产量单位',
    category: 'engineering_unit',
    categoryName: '工业量纲单位',
    standardUnit: '支',
    forbiddenAliases: ['台', '套', '件'],
    applicablePages: ['/zero-carbon/monitor/indicator', '/zero-carbon/energy/unit-product'],
    definition: '特高压/超高压套管实物装备的标准计量单位固定为“支”。',
  },
  {
    id: 'UF-063',
    fieldKey: 'unit_transformer_capacity',
    standardName: '变压器容量规模',
    category: 'engineering_unit',
    categoryName: '工业量纲单位',
    standardUnit: '万kVA',
    forbiddenAliases: ['台', 'kW', 'MW'],
    applicablePages: ['/zero-carbon/monitor/indicator', '/zero-carbon/energy/unit-product'],
    definition: '变压器出厂视在功率总容量规摸单位，用于单位容量折标综合单耗核算（tce/万kVA）。',
  },
  {
    id: 'UF-064',
    fieldKey: 'unit_energy_tce',
    standardName: '综合能耗总量',
    category: 'engineering_unit',
    categoryName: '工业量纲单位',
    standardUnit: 'tce',
    forbiddenAliases: ['吨标煤', 'tce煤', 'TEC'],
    applicablePages: ['全系统所有能耗分析页面'],
    definition: '各类能源介质按照国家当量/等价折标系数折算后的吨标准煤当量。',
  },

  // =========================================================================
  // 6. 表格列名、状态与操作按钮 (table_action)
  // =========================================================================
  {
    id: 'UF-070',
    fieldKey: 'action_query',
    standardName: '查询',
    category: 'table_action',
    categoryName: '表格与操作',
    forbiddenAliases: ['搜索', '筛选', '过滤', '确定'],
    applicablePages: ['全系统工具栏'],
    definition: '统一为实心科技蓝胶囊按钮（#2C7CFF），白字白图标，触发检索过滤。',
  },
  {
    id: 'UF-071',
    fieldKey: 'action_reset',
    standardName: '重置',
    category: 'table_action',
    categoryName: '表格与操作',
    forbiddenAliases: ['清空', '恢复默认', '刷新筛选'],
    applicablePages: ['全系统工具栏'],
    definition: '统一为浅灰描边圆角按钮，将当前页面的筛选条件一键还原为初始化默认状态。',
  },
  {
    id: 'UF-072',
    fieldKey: 'action_export',
    standardName: '导出',
    category: 'table_action',
    categoryName: '表格与操作',
    forbiddenAliases: ['导出Excel', '下载报表', '数据导出', '导出表格'],
    applicablePages: ['全系统所有数据图表与台账页面'],
    definition: '统一固定规格：宽度 80px，高度 36px，填充色 #2C7CFF，圆角 8px，白字白图标。',
  },
  {
    id: 'UF-073',
    fieldKey: 'action_detail',
    standardName: '详情',
    category: 'table_action',
    categoryName: '表格与操作',
    forbiddenAliases: ['查看用能实况', '查看详情', '点击查看', '查看', '进入内页'],
    applicablePages: ['全系统数据表格操作列'],
    definition: '表格数据行末尾的跳转或浮层操作，统一规范固定为“详情”二字。',
  },
  {
    id: 'UF-074',
    fieldKey: 'col_index',
    standardName: '序号',
    category: 'table_action',
    categoryName: '表格与操作',
    forbiddenAliases: ['#', 'No.', '编号', '序号列'],
    applicablePages: ['全系统 44px 工业高密数据表格'],
    definition: '数据表格首列，统一固定居中紧凑显示为“序号”或简短“#”。',
  },
  {
    id: 'UF-075',
    fieldKey: 'state_equipment',
    standardName: '启用 / 停用',
    category: 'table_action',
    categoryName: '表格与操作',
    forbiddenAliases: ['运行中', '待机', '检修', '在用', '开机'],
    applicablePages: ['/system?section=key-equipment', '/system?section=pv-equipment'],
    definition: '重点用能设备与光伏设备主数据台账状态，全面收敛为标准化“启用”或“停用”。',
  },
  {
    id: 'UF-076',
    fieldKey: 'state_project',
    standardName: '改造成功 / 改造中 / 改造失败',
    category: 'table_action',
    categoryName: '表格与操作',
    forbiddenAliases: ['已完工', '进行中', '未达标', '建设中', '验收通过'],
    applicablePages: ['/zero-carbon/project/archive'],
    definition: '节能项目台账改造后状态，全系统严格收敛为 3 种权威标准状态。',
  },
]

/**
 * 🔍 智能反查与标准化格式化引擎
 * 传入任意历史旧称、衍生词或标准 key，自动解析并返回唯一标准统一名称
 */
export function resolveStandardFieldName(termOrKey: string): string {
  if (!termOrKey) return ''
  const trimmed = termOrKey.trim()

  // 1. 直接命中标准名称
  const exactMatch = UNIFIED_FIELD_DICTIONARY.find(
    (item) => item.standardName === trimmed || item.fieldKey === trimmed
  )
  if (exactMatch) return exactMatch.standardName

  // 2. 命中禁止别名列表
  const aliasMatch = UNIFIED_FIELD_DICTIONARY.find((item) =>
    item.forbiddenAliases.some((alias) => alias.toLowerCase() === trimmed.toLowerCase())
  )
  if (aliasMatch) return aliasMatch.standardName

  return trimmed
}

/**
 * 🛡️ 字段合规性自检工具
 * 返回该字段名是否存在违规用词及纠正建议
 */
export function checkTermCompliance(term: string): { isCompliant: boolean; standardName?: string; reason?: string } {
  if (!term) return { isCompliant: true }
  const trimmed = term.trim()

  for (const item of UNIFIED_FIELD_DICTIONARY) {
    if (item.standardName === trimmed) {
      return { isCompliant: true }
    }
    const hitAlias = item.forbiddenAliases.find((alias) => alias.toLowerCase() === trimmed.toLowerCase())
    if (hitAlias) {
      return {
        isCompliant: false,
        standardName: item.standardName,
        reason: `检测到禁止词汇「${hitAlias}」，请统一更正为标准名称「${item.standardName}」 (所属分类: ${item.categoryName})`,
      }
    }
  }

  return { isCompliant: true }
}
