/**
 * 光伏设备主数据模型与初始数据集 (Photovoltaic Equipment Data Model & Dataset)
 * 严格对齐特变电工（TBEA）零碳园区光伏资产管理规范
 * 聚焦基础信息：归属园区必选、下级工厂非必选，彻底剥离设备编码与多余硬件参数
 */

export interface ParkOption {
  park: string
  factories: string[]
}

// 🌟 15 大零碳产业园区与下级工厂级联字典 (严格对齐全系统组织架构)
export const PARK_FACTORY_HIERARCHY: ParkOption[] = [
  {
    park: '特变电工东北输变电产业园',
    factories: ['沈变本部', '和新套管', '康嘉互感器'],
  },
  {
    park: '特变电工南方输变电产业园',
    factories: ['衡变本部'],
  },
  {
    park: '特变电工输变电产业园',
    factories: ['超高压公司', '特变电工新疆线缆厂'],
  },
  {
    park: '特变电工华东输变电科技产业园',
    factories: ['鲁缆本部', '智缆公司'],
  },
  {
    park: '特变电工(德阳)电缆园区',
    factories: ['特变电工（德阳）电缆股份有限公司'],
  },
  {
    park: '特变电工天变产业园',
    factories: ['天变公司', '天变天津基地', '天变智慧能源', '天变智能科技'],
  },
  {
    park: '特变电工智能电气产业园',
    factories: ['新疆自控', '智能电气公司'],
  },
  {
    park: '特变电工云集5G科技产业园',
    factories: ['云集电气', '湖南电气', '云集高压开关'],
  },
  {
    park: '特变电工二次产业园区',
    factories: ['南京电研'],
  },
  {
    park: '特变电工西安智能装备产业园',
    factories: ['合容电气', '合容开关', '合容电力设备'],
  },
  {
    park: '特变电工京津冀智能科技产业园',
    factories: ['京津冀公司', '珠峰硅钢'],
  },
  {
    park: '特变电工GIL产业园',
    factories: ['赛杰爱迪'],
  },
  {
    park: '特变电工湖南能源建设园区',
    factories: ['特能建'],
  },
  {
    park: '特变电工曙光电缆产业园',
    factories: ['曙光公司'],
  },
  {
    park: '特变电工新疆电缆产业园',
    factories: ['特变电工新疆电缆有限公司'],
  },
]

// 🌟 光伏设备基础信息实体定义
export interface PvEquipmentItem {
  id: string
  name: string               // 光伏设备/电站名称 (*)
  park: string               // 归属园区 (*)
  factory?: string | null    // 关联下级工厂 (非必选，为 null/空时代表园区直辖公用资产)
  location: string           // 安装物理位置/屋面区域
  capacityKW: number         // 装机容量 (kWp) (*)
  commissionDate: string     // 投运年月 (YYYY-MM)
  status: '启用' | '停用' // 状态 (启用 / 停用)
  responsiblePerson: string  // 管理责任人
  contactPhone: string       // 运维联系电话
  description?: string       // 备注说明
  createdAt?: string
  updatedAt?: string
}

// 🌟 全集团光伏设备初始基础数据集 (16 项真实基准，兼具工厂关联与纯园区直辖)
export const INITIAL_PV_EQUIPMENT_LIST: PvEquipmentItem[] = [
  // 1. 特变电工东北输变电产业园
  {
    id: 'pv-001',
    name: '沈变厂区 12.8MWp 屋顶分布式光伏一期',
    park: '特变电工东北输变电产业园',
    factory: '沈变本部',
    location: '特高压一车间及二车间金属彩钢瓦屋面',
    capacityKW: 12800,
    commissionDate: '2021-06',
    status: '启用',
    responsiblePerson: '关志鹏',
    contactPhone: '138-4012-9981',
    description: '特高压主厂区大跨度屋面自发自用分布式光伏，所发电量就地供给干燥罐与总装线消纳。',
  },
  {
    id: 'pv-002',
    name: '沈变和新套管 2.4MWp 柔性屋面光伏电站',
    park: '特变电工东北输变电产业园',
    factory: '和新套管',
    location: '特高压胶浸纸电容式套管车间楼顶',
    capacityKW: 2400,
    commissionDate: '2022-09',
    status: '启用',
    responsiblePerson: '刘海波',
    contactPhone: '139-4022-8877',
    description: '和新套管独立屋面分布式光伏，高精度防尘涂层组件，所发绿电直供套管固化加热炉。',
  },
  {
    id: 'pv-003',
    name: '东北输变电产业园 1# 智能车棚光伏系统',
    park: '特变电工东北输变电产业园',
    factory: null, // 园区直辖公用资产
    location: '园区南门公共智慧充电车棚 (A区与B区)',
    capacityKW: 850,
    commissionDate: '2023-03',
    status: '启用',
    responsiblePerson: '张绍辉',
    contactPhone: '137-0402-1166',
    description: '园区公共服务配套光储充一体化车棚，直接并入园区内部微电网公用母线。',
  },

  // 2. 特变电工南方输变电产业园
  {
    id: 'pv-004',
    name: '衡变特高压基地 8.5MWp 建筑一体化光伏',
    park: '特变电工南方输变电产业园',
    factory: '衡变本部',
    location: '特超高压制造中心北跨与总装二跨采光顶',
    capacityKW: 8500,
    commissionDate: '2021-11',
    status: '启用',
    responsiblePerson: '赵建国',
    contactPhone: '138-7341-2299',
    description: '衡变特大跨度钢结构厂房 BIPV 建筑一体化光伏，消纳率超过 95%。',
  },
  {
    id: 'pv-005',
    name: '南方输变电产业园动力总站公用光伏站',
    park: '特变电工南方输变电产业园',
    factory: null, // 园区直辖公用资产
    location: '园区动力公用工程枢纽站房屋顶',
    capacityKW: 1600,
    commissionDate: '2022-04',
    status: '启用',
    responsiblePerson: '吴天明',
    contactPhone: '139-7345-3322',
    description: '园区动力泵房与公用变电所独立光伏发电设备，保障循环水泵全天候清洁电力供给。',
  },

  // 3. 特变电工输变电产业园 (新疆昌吉)
  {
    id: 'pv-006',
    name: '新变工业园 15.2MWp 柔性支架及厂房屋顶光伏',
    park: '特变电工输变电产业园',
    factory: '超高压公司',
    location: '主变总装大跨屋面与厂区主干道大车棚',
    capacityKW: 15200,
    commissionDate: '2020-08',
    status: '启用',
    responsiblePerson: '买买提江',
    contactPhone: '138-9982-5566',
    description: '西北特变输变电生产基地大型屋顶与车棚光伏电站，年均有效利用小时数达 1450 小时。',
  },
  {
    id: 'pv-007',
    name: '输变电产业园行政管理中心楼顶光伏阵列',
    park: '特变电工输变电产业园',
    factory: null, // 园区直辖公用资产
    location: '总部科技研发大厦与专家公寓楼顶',
    capacityKW: 1200,
    commissionDate: '2022-07',
    status: '停用',
    responsiblePerson: '陈培栋',
    contactPhone: '139-9981-2211',
    description: '园区公共办公区节能减排示范光伏系统，接入楼宇自动化配电微网。',
  },

  // 4. 特变电工华东输变电科技产业园 (山东新泰)
  {
    id: 'pv-008',
    name: '鲁缆超高压基地 6.4MWp 绿色工厂分布式光伏',
    park: '特变电工华东输变电科技产业园',
    factory: '鲁缆本部',
    location: '超高压立塔车间裙楼及交联挤出分厂屋面',
    capacityKW: 6400,
    commissionDate: '2021-05',
    status: '启用',
    responsiblePerson: '马振华',
    contactPhone: '138-5382-7711',
    description: '电缆超高压立塔生产线配套分布式光伏，高压并网柜就近消纳自发电力。',
  },
  {
    id: 'pv-009',
    name: '华东电缆科技园 2# 集中生态光伏车棚',
    park: '特变电工华东输变电科技产业园',
    factory: null, // 园区直辖公用资产
    location: '物流重卡装卸区东侧光伏防雨车棚',
    capacityKW: 980,
    commissionDate: '2023-01',
    status: '启用',
    responsiblePerson: '朱长胜',
    contactPhone: '137-5381-6600',
    description: '园区公用重卡与叉车集中充电站遮阳光伏发电设备，兼具雨棚与发电双重功效。',
  },

  // 5. 特变电工(德阳)电缆园区 (四川德阳)
  {
    id: 'pv-010',
    name: '德阳电缆智慧园区 4.6MWp 屋顶分布式光伏',
    park: '特变电工(德阳)电缆园区',
    factory: '特变电工（德阳）电缆股份有限公司',
    location: '重型矿用橡套电缆连续硫化车间屋面',
    capacityKW: 4600,
    commissionDate: '2022-10',
    status: '启用',
    responsiblePerson: '何建平',
    contactPhone: '138-8102-4455',
    description: '德阳电缆制造总厂核心屋顶电站，抗湿热防硫化专用封装组件。',
  },
  {
    id: 'pv-011',
    name: '德阳电缆园区公用工程循环水站光伏',
    park: '特变电工(德阳)电缆园区',
    factory: null, // 园区直辖公用资产
    location: '园区动力循环水泵站平顶屋面',
    capacityKW: 650,
    commissionDate: '2023-06',
    status: '启用',
    responsiblePerson: '罗小勇',
    contactPhone: '139-8103-6622',
    description: '园区公用水系统直配光伏，直接为高压循环水冷却塔动力风机供电。',
  },

  // 6. 特变电工天变产业园 (天津)
  {
    id: 'pv-012',
    name: '天变天津基地 5.2MWp 环氧浇注车间屋顶光伏',
    park: '特变电工天变产业园',
    factory: '天变天津基地',
    location: '干式变压器微电脑真空浇注分厂屋面',
    capacityKW: 5200,
    commissionDate: '2021-09',
    status: '启用',
    responsiblePerson: '高志强',
    contactPhone: '138-2011-8844',
    description: '服务京津冀绿色电网干变生产基地，年发电量有效抵减配网生产碳排放。',
  },
  {
    id: 'pv-013',
    name: '天变智能科技 1.8MWp 智能箱变装配区光伏',
    park: '特变电工天变产业园',
    factory: '天变智能科技',
    location: '配网智能化装配车间屋顶',
    capacityKW: 1800,
    commissionDate: '2022-12',
    status: '停用',
    responsiblePerson: '郭海波',
    contactPhone: '137-2012-3399',
    description: '正在进行逆变器母线端定期绝缘巡检，预计本周末恢复并网运行。',
  },

  // 7. 特变电工京津冀智能科技产业园 (武清)
  {
    id: 'pv-014',
    name: '京津冀产业园 3.8MWp 珠峰硅钢剪切线光伏',
    park: '特变电工京津冀智能科技产业园',
    factory: '珠峰硅钢',
    location: '高牌号取向硅钢数控横剪车间屋面',
    capacityKW: 3800,
    commissionDate: '2023-04',
    status: '启用',
    responsiblePerson: '李向东',
    contactPhone: '136-2015-7711',
    description: '超高压硅钢片精密深加工厂房屋顶电站，电能质量达到一级净化标准。',
  },
  {
    id: 'pv-015',
    name: '京津冀产业园综合能源站公用光伏',
    park: '特变电工京津冀智能科技产业园',
    factory: null, // 园区直辖公用资产
    location: '园区公用微电网中枢控制站房屋面',
    capacityKW: 1100,
    commissionDate: '2023-08',
    status: '启用',
    responsiblePerson: '孙德明',
    contactPhone: '139-2016-8800',
    description: '园区公用虚拟电厂（VPP）核心光伏节点，参与电网需求侧动态响应调峰。',
  },

  // 8. 特变电工云集5G科技产业园 (衡阳)
  {
    id: 'pv-016',
    name: '云集科技园 4.2MWp 湖南电气配网制造区光伏',
    park: '特变电工云集5G科技产业园',
    factory: '湖南电气',
    location: '智能配电柜自动化制造厂房屋面',
    capacityKW: 4200,
    commissionDate: '2022-03',
    status: '启用',
    responsiblePerson: '黄文斌',
    contactPhone: '138-7348-1122',
    description: '云集5G智能制造基地标志性能源工程，实现白天生产高峰期绿电完全自给自足。',
  },
]
