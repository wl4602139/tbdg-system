/* ============================================================
 * 组织架构树：一级单位 → 二级单位 → 三级单位（末级）
 * 依据《园区-工厂对应关系表.xlsx》
 * ============================================================ */

export type OrgNode = {
  name: string
  park?: string
  children?: OrgNode[]
}

export const orgTree: OrgNode[] = [
  {
    name: '沈变公司',
    park: '特变电工东北输变电产业园',
    children: [
      { name: '沈变本部' },
      { name: '智慧能源' },
      { name: '和新套管公司' },
      { name: '康嘉互感器' },
      { name: '印能公司' },
    ],
  },
  {
    name: '衡变公司',
    park: '特变电工南方输变电产业园',
    children: [
      { name: '衡变本部' },
      { name: '南京电研', park: '特变电工二次产业园区' },
      { name: '云集电气', park: '特变电工云集5G科技产业园' },
      { name: '湖南电气' },
      { name: '云集高压开关' },
      { name: '新疆自控', park: '特变电工智能电气产业园' },
      { name: '上开' },
      { name: '柯贝尔' },
      { name: '特能建', park: '特变电工湖南能源建设园区' },
      {
        name: '合容电气',
        park: '特变电工西安智能装备产业园',
        children: [{ name: '合容电气股份' }, { name: '合容开关' }, { name: '合容电力设备' }],
      },
      { name: '赛杰爱迪', park: '特变电工GIL产业园' },
    ],
  },
  {
    name: '新变厂',
    park: '特变电工输变电产业园',
    children: [
      { name: '超高压公司' },
      {
        name: '天变公司',
        park: '特变电工天变产业园',
        children: [
          { name: '天变天津基地' },
          { name: '天变智慧能源' },
          { name: '天变智能科技' },
          { name: '天变衡阳基地' },
          { name: '天变沈阳基地' },
        ],
      },
      { name: '智能电气公司', park: '特变电工智能电气产业园' },
      { name: '京津冀公司', park: '特变电工京津冀智能科技产业园' },
      { name: '珠峰硅钢' },
      { name: '智慧能源' },
      { name: '银利电气' },
    ],
  },
  {
    name: '鲁缆公司',
    park: '特变电工华东输变电科技产业园',
    children: [
      { name: '鲁缆本部' },
      { name: '智缆公司' },
      { name: '昭和公司' },
      { name: '曙光公司', park: '特变电工曙光电缆产业园' },
    ],
  },
  {
    name: '新缆厂',
    children: [
      { name: '特变电工新疆电缆有限公司', park: '特变电工新疆电缆产业园' },
      { name: '特变电工新疆线缆厂', park: '特变电工输变电产业园' },
    ],
  },
  {
    name: '德缆公司',
    children: [{ name: '特变电工（德阳）电缆股份有限公司', park: '特变电工(德阳)电缆园区' }],
  },
]

/* 是否为末级单位（无子级） */
export function isLeaf(node: OrgNode): boolean {
  return !node.children || node.children.length === 0
}

/* 扁平化所有单位节点（含层级信息），便于检索与汇总 */
export type FlatOrg = { name: string; level: 1 | 2 | 3; park?: string; parent?: string }

export function flattenOrg(): FlatOrg[] {
  const out: FlatOrg[] = []
  for (const l1 of orgTree) {
    out.push({ name: l1.name, level: 1, park: l1.park })
    for (const l2 of l1.children ?? []) {
      out.push({ name: l2.name, level: 2, park: l2.park, parent: l1.name })
      for (const l3 of l2.children ?? []) {
        out.push({ name: l3.name, level: 3, park: l3.park, parent: l2.name })
      }
    }
  }
  return out
}

/* 按关键词过滤组织架构树：保留名称匹配的节点及其祖先路径 */
export function filterOrg(nodes: OrgNode[], keyword: string): OrgNode[] {
  if (!keyword) return nodes
  const kw = keyword.trim().toLowerCase()
  const result: OrgNode[] = []
  for (const node of nodes) {
    const nameMatch = node.name.toLowerCase().includes(kw)
    const filteredChildren = node.children ? filterOrg(node.children, keyword) : undefined
    const childMatch = filteredChildren && filteredChildren.length > 0
    if (nameMatch || childMatch) {
      result.push({ ...node, children: nameMatch ? node.children : filteredChildren })
    }
  }
  return result
}

/* 按名称查找单位节点 */
export function findOrgNode(name: string): OrgNode | null {
  for (const l1 of orgTree) {
    if (l1.name === name) return l1
    for (const l2 of l1.children ?? []) {
      if (l2.name === name) return l2
      for (const l3 of l2.children ?? []) {
        if (l3.name === name) return l3
      }
    }
  }
  return null
}
