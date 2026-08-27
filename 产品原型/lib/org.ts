/* ============================================================
 * 特变电工 3 维视角拓扑数据字典 (Enterprise, Park, Product)
 * 1. 🏢 企业结构 (Enterprise Structure): 2大产业 + 6大公司 + 26车间工序
 * 2. 🏞️ 园区结构 (Park Structure): 15个零碳产业园区
 * 3. 📦 产品种类 (Product Category): 变压器、线缆、开关GIL、新能源、材料 5大品类
 * ============================================================ */

export type TopologyPerspective = 'enterprise' | 'park' | 'product'

export interface TreeNodeData {
  key: string
  label: string
  icon?: string
  badge?: string
  tag?: string
  level: number
  children?: TreeNodeData[]
}

/* 1. 🏢 企业结构 */
export const enterpriseTreeData: TreeNodeData = {
  key: 'root-enterprise',
  label: '特变电工集团 (全景汇总)',
  badge: '全集团',
  level: 0,
  children: [
    {
      key: 'sector-transformer',
      label: '变压器产业',
      badge: '3大公司',
      level: 1,
      children: [
        {
          key: 'comp-sb',
          label: '沈变公司',
          badge: '东北中心',
          level: 2,
          children: [
            { key: 'ws-sb-1', label: '沈变本部 (超高压车间)', level: 3 },
            { key: 'ws-sb-2', label: '智慧能源 (综合能效)', level: 3 },
            { key: 'ws-sb-3', label: '和新套管公司 (卷制干燥)', level: 3 },
            { key: 'ws-sb-4', label: '康嘉互感器 (蒸汽干燥)', level: 3 },
            { key: 'ws-sb-5', label: '印能公司', level: 3 },
          ],
        },
        {
          key: 'comp-hb',
          label: '衡变公司',
          badge: '南方中心',
          level: 2,
          children: [
            { key: 'ws-hb-1', label: '衡变本部 (变压器制造)', level: 3 },
            { key: 'ws-hb-2', label: '南京电研 (二次SMT贴片)', level: 3 },
            { key: 'ws-hb-3', label: '云集电气 (开关柜/钣金喷涂)', level: 3 },
            { key: 'ws-hb-4', label: '湖南电气 (变压器线圈)', level: 3 },
            { key: 'ws-hb-5', label: '云集高压开关 (GIS抽真空)', level: 3 },
            { key: 'ws-hb-6', label: '新疆自控 (开关柜车间)', level: 3 },
            { key: 'ws-hb-7', label: '特能建 (能源建设园区)', level: 3 },
            { key: 'ws-hb-8', label: '合容电气 (电容器卷绕/浸渍)', level: 3 },
            { key: 'ws-hb-9', label: '赛杰爱迪 (GIL管道车间)', level: 3 },
          ],
        },
        {
          key: 'comp-xb',
          label: '新变厂',
          badge: '西北中心',
          level: 2,
          children: [
            { key: 'ws-xb-1', label: '超高压公司 (超高压变压器)', level: 3 },
            { key: 'ws-xb-2', label: '天变公司 (天津/各分支基地)', level: 3 },
            { key: 'ws-xb-3', label: '智能电气公司 (配变车间)', level: 3 },
            { key: 'ws-xb-4', label: '京津冀公司 (智能装备)', level: 3 },
            { key: 'ws-xb-5', label: '珠峰硅钢 (铁心加工/退火)', level: 3 },
          ],
        },
      ],
    },
    {
      key: 'sector-cable',
      label: '线缆产业',
      badge: '3大公司',
      level: 1,
      children: [
        {
          key: 'comp-ll',
          label: '鲁缆公司',
          badge: '华东中心',
          level: 2,
          children: [
            { key: 'ws-ll-1', label: '鲁缆本部 (电缆车间/交联)', level: 3 },
            { key: 'ws-ll-2', label: '智缆公司 (智能特种电缆)', level: 3 },
            { key: 'ws-ll-3', label: '昭和公司 (高压附件制造)', level: 3 },
            { key: 'ws-ll-4', label: '曙光公司 (中低压交联)', level: 3 },
          ],
        },
        {
          key: 'comp-xl',
          label: '新缆厂',
          badge: '新疆中心',
          level: 2,
          children: [
            { key: 'ws-xl-1', label: '新疆电缆公司 (自制氮气站)', level: 3 },
            { key: 'ws-xl-2', label: '新疆线缆厂 (特种线缆制造)', level: 3 },
          ],
        },
        {
          key: 'comp-dl',
          label: '德缆公司',
          badge: '西南中心',
          level: 2,
          children: [{ key: 'ws-dl-1', label: '德缆股份公司 (高低压交联)', level: 3 }],
        },
      ],
    },
  ],
}

/* 2. 🏞️ 园区结构 */
export const parkTreeData: TreeNodeData = {
  key: 'root-park',
  label: '零碳产业园区 (全域汇总)',
  badge: '15园区',
  level: 0,
  children: [
    {
      key: 'park-ne',
      label: '东北输变电产业园',
      badge: '沈阳',
      level: 1,
      children: [
        { key: 'park-ne-1', label: '沈变本部 (超高压厂房)', level: 2 },
        { key: 'park-ne-2', label: '和新套管制造基地', level: 2 },
        { key: 'park-ne-3', label: '康嘉互感器制造基地', level: 2 },
        { key: 'park-ne-4', label: '园区微电网与储能站', level: 2 },
      ],
    },
    {
      key: 'park-south',
      label: '南方输变电产业园',
      badge: '衡阳',
      level: 1,
      children: [
        { key: 'park-south-1', label: '衡变本部制造厂区', level: 2 },
        { key: 'park-south-2', label: '国创油箱车间', level: 2 },
        { key: 'park-south-3', label: '南方园区屋顶光伏电站', level: 2 },
      ],
    },
    {
      key: 'park-xj',
      label: '输变电产业园 (新疆)',
      badge: '昌吉',
      level: 1,
      children: [
        { key: 'park-xj-1', label: '新变超高压变压器厂区', level: 2 },
        { key: 'park-xj-2', label: '新疆线缆厂制造车间', level: 2 },
      ],
    },
    {
      key: 'park-east',
      label: '华东输变电产业园',
      badge: '新泰',
      level: 1,
      children: [
        { key: 'park-east-1', label: '鲁缆高压交联立塔厂区', level: 2 },
        { key: 'park-east-2', label: '智缆科技制造中心', level: 2 },
      ],
    },
    { key: 'park-dy', label: '德阳电缆产业园区', badge: '四川', level: 1 },
    { key: 'park-xa', label: '西安智能装备产业园', badge: '西安', level: 1 },
    { key: 'park-yj', label: '云集5G科技产业园', badge: '云集', level: 1 },
    { key: 'park-nj', label: '二次产业园区', badge: '南京', level: 1 },
    { key: 'park-tj', label: '天变产业园', badge: '天津', level: 1 },
    { key: 'park-jjj', label: '京津冀智能科技产业园', badge: '河北', level: 1 },
    { key: 'park-gil', label: '特变电工GIL产业园', badge: '湖南GIL', level: 1 },
    { key: 'park-sg', label: '曙光电缆产业园', badge: '山东', level: 1 },
  ],
}

/* 3. 📦 产品种类 */
export const productTreeData: TreeNodeData = {
  key: 'root-product',
  label: '全谱系装备与产品 (全景)',
  badge: '5大品类',
  level: 0,
  children: [
    {
      key: 'prod-trans',
      label: '变压器类产品',
      badge: '6系列',
      level: 1,
      children: [
        { key: 'prod-trans-1', label: '特高压直流换流变 (±1100kV)', level: 2 },
        { key: 'prod-trans-2', label: '超高压变压器 (750kV/1000kV)', level: 2 },
        { key: 'prod-trans-3', label: '主变压器 (220kV/500kV)', level: 2 },
        { key: 'prod-trans-4', label: '智能配电变 (10kV-110kV)', level: 2 },
        { key: 'prod-trans-5', label: '和新高压套管产品', level: 2 },
        { key: 'prod-trans-6', label: '康嘉精密互感器', level: 2 },
      ],
    },
    {
      key: 'prod-cable',
      label: '电线电缆类产品',
      badge: '5系列',
      level: 1,
      children: [
        { key: 'prod-cable-1', label: '超高压交联电缆 (500kV)', level: 2 },
        { key: 'prod-cable-2', label: '中低压交联电缆 (10-35kV)', level: 2 },
        { key: 'prod-cable-3', label: '特种橡胶与机车电缆', level: 2 },
        { key: 'prod-cable-4', label: '智能海底电缆 (海缆)', level: 2 },
        { key: 'prod-cable-5', label: '架空绝缘导线与铝导线', level: 2 },
      ],
    },
    {
      key: 'prod-switch',
      label: '高压开关与GIL',
      badge: '3系列',
      level: 1,
      children: [
        { key: 'prod-switch-1', label: 'GIS气体绝缘开关 (550kV)', level: 2 },
        { key: 'prod-switch-2', label: 'GIL刚性绝缘输电管道', level: 2 },
        { key: 'prod-switch-3', label: '中低压成套开关柜', level: 2 },
      ],
    },
    {
      key: 'prod-newenergy',
      label: '电力电子与新能源',
      badge: '3系列',
      level: 1,
      children: [
        { key: 'prod-ne-1', label: '光伏并网逆变器 (1500V)', level: 2 },
        { key: 'prod-ne-2', label: '储能变流器 (PCS)', level: 2 },
        { key: 'prod-ne-3', label: '合容高压电力电容器', level: 2 },
      ],
    },
    {
      key: 'prod-material',
      label: '核心材料与部件',
      badge: '2系列',
      level: 1,
      children: [
        { key: 'prod-mat-1', label: '珠峰取向硅钢铁心 (退火)', level: 2 },
        { key: 'prod-mat-2', label: '电工级无氧铜杆与绝缘件', level: 2 },
      ],
    },
  ],
}

/* 兼容历史旧导出 */
export const orgTree = [enterpriseTreeData]
