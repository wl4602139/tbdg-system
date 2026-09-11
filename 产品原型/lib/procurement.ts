/* ============================================================
 * 产品碳足迹集采中心 · 特变电工电装集团业务数据模型
 * 级联维度：产业 → 产线 → 产品类别 → 产品型号 → 经营单位 → 生产订单 → 生产计划
 * 计量：变压器最小计量单位/特征量 = kVA；单位产品碳足迹 = kgCO2/kVA
 * 所有数值由确定性伪随机生成，保证每次渲染稳定
 * ============================================================ */

/* ---------- 确定性伪随机 ---------- */
function hash(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) / 4294967295
}
/** 以 seed 在 [min,max] 生成稳定数值 */
function rnd(seed: string, min: number, max: number, decimals = 0): number {
  const v = min + hash(seed) * (max - min)
  const p = Math.pow(10, decimals)
  return Math.round(v * p) / p
}

/* ---------- 级联结构：产业 → 产线 → 产品大类 → 产品中类 → 产品型号 ---------- */
export type MajorCategoryMap = Record<string, Record<string, string[]>>
export type IndustryCascade = {
  lines: string[]
  majorCategories: MajorCategoryMap
}

export const LINE_TO_MAJOR_CATEGORIES: Record<string, Record<string, string[]>> = {
  变压器: {
    '高压产线': ['变压器-高压'],
    '超高压产线': ['变压器-高压'],
    '特高压产线': ['变压器-高压'],
    '配变产线（中特）': ['变压器-中低压-油变', '变压器-中低压-干变'],
    '配变产线（油变）': ['变压器-中低压-油变'],
    '配变产线（干变）': ['变压器-中低压-干变'],
    '配变产线（箱变）': ['箱式变电站'],
    '电抗器产线（干式空心）': ['干式电抗器'],
    'GIS 产线': ['高压组合电器 GIS'],
    'GIL 产线': ['管道母线 GIL'],
    '套管产线': ['套管'],
    '互感器产线': ['互感器'],
    '电容器产线（油浸式）': ['电容器'],
    '电容器产线（干式）': ['电容器'],
    '开关柜产线': ['中低压开关柜'],
    '二次产线': ['中低压开关柜'],
    '硅钢产线（横剪）': ['变压器-铁芯'],
  },
  线缆: {
    '导线产线': ['裸导线'],
    '布电线产线': ['布电线'],
    '低压力缆产线': ['低压电力电缆'],
    '中压力缆产线': ['中压电力电缆'],
    '高压力缆产线': ['高压电力电缆'],
    '电气装备电缆产线': ['电气装备用电缆'],
    '橡套电缆产线': ['橡套电缆'],
    '特种电缆产线': ['特种电缆'],
  },
}

export const cascade: Record<string, IndustryCascade> = {
  变压器: {
    lines: [
      '高压产线',
      '超高压产线',
      '特高压产线',
      '配变产线（中特）',
      '配变产线（油变）',
      '配变产线（干变）',
      '配变产线（箱变）',
      'GIS 产线',
      'GIL 产线',
      '开关柜产线',
      '电抗器产线（干式空心）',
      '套管产线',
      '互感器产线',
      '硅钢产线（横剪）',
      '电容器产线（油浸式）',
      '电容器产线（干式）',
      '二次产线',
    ],
    majorCategories: {
      '变压器-高压': {
        '交流变压器-110KV': ['SFZ-63000/110', 'SFSZ-120000/110', 'SFZ11-110', 'SFSZ11-110'],
        '交流变压器-220KV': ['SZ11-220', 'SFZ-180000/220', 'SSZ11-220'],
        '交流变压器-330KV': ['SFZ-330', 'SFP-360/330'],
        '交流变压器-500KV': ['OSFPS-360', 'SFP-500'],
        '交流变压器-750KV': ['ODFS-750', 'SSP-750'],
        '交流变压器-1000KV及以上': ['ODFS-1000', 'SZ-1000'],
        '直流变压器-±110KV~±1100KV': ['ZZDFPZ-±400', 'ZZDFPZ-±500', 'ZZDFPZ-±800', 'ZZDFPZ-±1100'],
        '特种变压器-试验变': ['YD-100/100', 'YDTW-500/250'],
      },
      '变压器-中低压-油变': {
        '油浸式配变-S11': ['S11-M-315/10', 'S11-M-500/10', 'S11-M-630/10'],
        '油浸式配变-S13': ['S13-M-630/10', 'S13-M-800/10', 'S13-M-1250/10'],
        '油浸式配变-S15': ['S15-M-500/10', 'S15-M-800/10', 'S15-M-1000/10'],
        '油浸式配变-硅钢卷铁心': ['S13-M·RL-400/10', 'S13-M·RL-630/10'],
        '油浸式配变-非晶合金': ['SBH15-M-400/10', 'SBH15-M-630/10'],
        '特种变压器-电炉变': ['HSSP-12500/35', 'HKSSP-25000/110'],
        '特种变压器-整流变': ['ZHS-10000/35', 'ZHSFT-20000/110'],
        '特种变压器-牵引变': ['QY-25000/110', 'QYZ-40000/220'],
      },
      '变压器-中低压-干变': {
        '干式配变-硅钢叠铁心': ['SCB13-1600/10', 'SCB14-2000/10', 'SCB18-2500/10'],
        '干式配变-H级干变': ['SGB11-2000/10', 'SGB13-2500/10'],
        '干式配变-F级干变': ['SCB10-1250/10', 'SCB11-1600/10'],
        '干式配变-非晶合金': ['SCBH15-1000/10', 'SCBH15-1600/10'],
      },
      '箱式变电站': {
        '美式箱变': ['ZGS11-H(Z)-500/10', 'ZGS11-H(Z)-800/10'],
        '欧式箱变': ['YB-1250/10', 'YB-1600/10'],
        '华式箱变': ['YBW-630/35', 'YBW-1000/35'],
      },
      '干式电抗器': {
        '干式电抗器-110kV以下': ['CKSC-10', 'XKS-35', 'BKS-66'],
        '干式电抗器-220kV以上': ['CKSC-220', 'BKD-330', 'BKD-500'],
        '油浸式电抗器': ['BKD-35', 'BKS-66', 'BKD-110'],
      },
      '高压组合电器 GIS': {
        '高压开关-GIS-126至145kV': ['ZF12-126', 'ZF12-145'],
        '高压开关-GIS-252至363kV': ['ZF27-252', 'ZF27-363'],
        '高压开关-GIS-420至550kV': ['ZF28-550', 'ZF28-800'],
        '断路器': ['LW25-126', 'LW25-252'],
        '隔地/接地开关': ['GW4-126', 'GW7-252'],
      },
      '管道母线 GIL': {
        '单相GIL': ['GIL-126kV-1P', 'GIL-252kV-1P', 'GIL-550kV-1P'],
        '单相直流GIL': ['GIL-±500kV-DC', 'GIL-±800kV-DC'],
        '三相共箱GIL': ['GIL-126kV-3P', 'GIL-252kV-3P'],
      },
      '套管': {
        '交流套管-40.5kV以下': ['BRDLW-40.5', 'BRLW-40.5'],
        '交流套管-72.5至252kV': ['BRDLW-110', 'BRLW-220'],
        '交流套管-363至550kV': ['BRDLW-363', 'BRLW-550'],
        '交流套管-800kV及以上': ['BRDLW-800', 'BRLW-1000'],
        '直流套管': ['GGF-500', 'FGF-800', 'FGF-1100'],
      },
      '互感器': {
        '电流互感器': ['LVQB-110', 'LB9-220', 'LVQB-500'],
        '电压互感器': ['TYD-110', 'TYD-220', 'JDZX9-35'],
        '组合互感器': ['JLSZV-10', 'JLSZV-35'],
      },
      '电容器': {
        '油浸式电容器': ['BAM-11/100', 'BFM-12/200'],
        '干式电容器': ['CKG-10/50', 'CKG-35/100'],
        '预制舱式电容器成套产品': ['TBC-10/3000', 'TBC-35/6000'],
        '集合式电容器': ['BAM-35-1000', 'BFM-35-2000'],
      },
      '中低压开关柜': {
        '开关柜': ['KYN28A-12', 'KYN28A-24', 'MNS-E', 'GCS-1'],
        '变压器辅助控制-控制柜': ['BKK-1', 'BKK-2'],
        '二次综合自动化': ['TB-SAS-900', 'TB-SAS-920'],
        '配网自动化': ['DTU-800', 'FTU-600'],
      },
      '变压器-铁芯': {
        '硅钢铁芯-常规片': ['TX-B-0.23', 'TX-B-0.27'],
        '横剪片': ['TX-HJ-300', 'TX-HJ-500'],
        '纵剪片': ['TX-ZJ-200', 'TX-ZJ-400'],
        '立体卷铁芯': ['TX-LJ-100', 'TX-LJ-200'],
      },
    },
  },
  线缆: {
    lines: [
      '导线产线',
      '布电线产线',
      '低压力缆产线',
      '中压力缆产线',
      '高压力缆产线',
      '电气装备电缆产线',
      '橡套电缆产线',
      '特种电缆产线',
    ],
    majorCategories: {
      '裸导线': {
        '钢芯铝绞线': ['LGJ-240', 'JL/G1A-300', 'JL/G1A-400/35'],
        '铝合金绞线': ['JLHA2-400', 'JLHA1-500', 'JLHA2-630'],
        '铝合金芯铝绞线': ['JL/LHA1-300', 'JL/LHA2-400'],
        '裸铝绞线': ['LJ-185', 'LJ-240', 'LJ-300'],
        '碳纤维复合芯导线': ['JLRX/US-300/40', 'JLRX/US-400/50'],
      },
      '布电线': {
        '普通塑料布电线': ['BV-2.5', 'BV-4', 'BVR-4', 'BVR-6'],
        '阻燃塑料布电线': ['ZR-BV-2.5', 'ZR-BV-4', 'ZR-BVR-6'],
        '耐火塑料布电线': ['NH-BV-2.5', 'NH-BV-4', 'NH-BVR-4'],
        '低烟无卤阻燃布电线': ['WDZ-BYJ-2.5', 'WDZ-BYJ-4', 'WDZN-BYJ-2.5'],
        '屏蔽布电线': ['RVVP-2*1.5', 'RVVP-3*2.5'],
      },
      '低压电力电缆': {
        '0.6/1kV XLPE电力电缆': ['YJV-0.6/1kV 4*240', 'YJV22-0.6/1kV 4*185', 'YJV-0.6/1kV 5*16'],
        '0.6/1kV PVC电力电缆': ['VV-0.6/1', 'VV22-0.6/1', 'VV-0.6/1 4*120'],
        '低烟无卤电力电缆': ['WDZ-YJY-0.6/1', 'WDZN-YJY23-0.6/1'],
        '刚性/柔性防火电缆': ['BTTZ-4*25', 'YTTW-4*50', 'BTLY-4*70'],
        '铝合金电力电缆': ['YJHLV-0.6/1', 'YJHLV82-0.6/1'],
      },
      '中压电力电缆': {
        '6~35kV XLPE电力电缆': ['YJV-8.7/15', 'YJV22-26/35', 'YJV-12/20'],
        '阻燃中压电缆': ['ZR-YJV-8.7/15', 'ZR-YJV22-26/35'],
        '耐火中压电缆': ['NH-YJV-8.7/15', 'NH-YJV22-12/20'],
        '防水中压电缆': ['FS-YJV-8.7/15', 'FS-YJV22-26/35'],
      },
      '高压电力电缆': {
        '皱纹铝护套电缆-110kV': ['YJLW02-64/110', 'YJLW03-64/110'],
        '平滑铝护套电缆-220kV': ['YJLW03-127/220', 'YJLLW03-127/220'],
        '铅护套电缆-500kV': ['YJQ03-290/500', 'YJLLW03-290/500'],
        '直流高压电缆': ['DC-YJLW03-±320', 'DC-YJLLW03-±535'],
      },
      '电气装备用电缆': {
        'PVC控制电缆': ['KVV-450/750', 'KVV22-450/750'],
        'XLPE控制电缆': ['KYJY-450/750', 'KYJY22-450/750'],
        '计算机屏蔽电缆': ['DJYVP-300/500', 'DJYPVP-300/500'],
        '船用电缆': ['CEFR/DA-0.6/1', 'CHV82/SA-0.6/1'],
        '变频电缆': ['BP-YJVP-0.6/1', 'BP-YJVP2-ZR-8.7/15'],
      },
      '橡套电缆': {
        '通用橡套软电缆': ['YC-450/750', 'YCW-450/750', 'YCZ-450/750'],
        '矿用橡套电缆': ['MY-0.38/0.66', 'MYPT-6/10', 'MC-0.38/0.66'],
        '风电耐低温橡套电缆': ['FD-EYH-0.6/1', 'FD-YCW-0.6/1'],
        '电焊机电缆': ['YH-245IEC81', 'YHF-245IEC82'],
      },
      '特种电缆': {
        '光伏电缆 PV1-F/H1Z2Z2-K': ['PV1-F-4mm²', 'H1Z2Z2-K-6mm²'],
        '风力发电电缆': ['FD-YFF-0.6/1', 'FD-YJE-8.7/15'],
        '盾构机电缆': ['UGEFP-3.6/6', 'UGEFHP-6/10'],
        '储能专用电缆': ['F-CE-1500V', 'ES-YJY-1500V'],
        '补偿导线': ['KX-HS-FFP', 'EX-GS-VVP'],
      },
    },
  },
}

export const industries = Object.keys(cascade)

export function linesOf(ind: string): string[] {
  const norm = (ind === '电器' || ind === '开关') ? '变压器' : ind
  return cascade[norm]?.lines ?? ['高压产线', '中低压产线']
}

export function majorCategoriesOf(ind: string, line?: string): string[] {
  const norm = (ind === '电器' || ind === '开关') ? '变压器' : ind
  if (line && LINE_TO_MAJOR_CATEGORIES[norm]?.[line]) {
    return LINE_TO_MAJOR_CATEGORIES[norm][line]
  }
  return Object.keys(cascade[norm]?.majorCategories ?? {})
}

export function mediumCategoriesOf(ind: string, majorCat: string): string[] {
  const norm = (ind === '电器' || ind === '开关') ? '变压器' : ind
  return Object.keys(cascade[norm]?.majorCategories?.[majorCat] ?? {})
}

export function modelsOf(ind: string, majorCat: string, mediumCat: string): string[] {
  const norm = (ind === '电器' || ind === '开关') ? '变压器' : ind
  return cascade[norm]?.majorCategories?.[majorCat]?.[mediumCat] ?? []
}

/** 兼容历史接口 */
export function categoriesOf(ind: string, line?: string): string[] {
  return majorCategoriesOf(ind, line)
}

export function categoriesOfInd(ind: string): string[] {
  return majorCategoriesOf(ind)
}

export function modelsOfIndCat(ind: string, cat: string): string[] {
  const norm = (ind === '电器' || ind === '开关') ? '变压器' : ind
  const majs = cascade[norm]?.majorCategories ?? {}
  if (majs[cat]) {
    const set = new Set<string>()
    for (const med of Object.keys(majs[cat])) {
      for (const m of majs[cat][med]) set.add(m)
    }
    return [...set]
  }
  for (const maj of Object.keys(majs)) {
    if (majs[maj][cat]) return majs[maj][cat]
  }
  return []
}

/** 某产业下全部型号（红黑榜/纵向对比用） */
export function allModelsOf(
  ind: string,
  majorCat?: string,
  mediumCat?: string,
  line?: string
): { model: string; line: string; majorCategory: string; mediumCategory: string; category: string }[] {
  const norm = (ind === '电器' || ind === '开关') ? '变压器' : ind
  const indData = cascade[norm] ?? cascade['变压器']
  const targetLine = line || indData.lines[0] || '高压产线'
  const out: { model: string; line: string; majorCategory: string; mediumCategory: string; category: string }[] = []
  
  const allowedMajors = line && LINE_TO_MAJOR_CATEGORIES[norm]?.[line]
    ? LINE_TO_MAJOR_CATEGORIES[norm][line]
    : Object.keys(indData.majorCategories)

  const majCats = majorCat && indData.majorCategories[majorCat]
    ? [majorCat]
    : allowedMajors

  for (const maj of majCats) {
    if (!indData.majorCategories[maj]) continue
    const medCats = mediumCat && indData.majorCategories[maj]?.[mediumCat]
      ? [mediumCat]
      : Object.keys(indData.majorCategories[maj] ?? {})
    for (const med of medCats) {
      for (const model of indData.majorCategories[maj][med] ?? []) {
        out.push({
          model,
          line: targetLine,
          majorCategory: maj,
          mediumCategory: med,
          category: med,
        })
      }
    }
  }
  const seen = new Set<string>()
  return out.filter((x) => {
    if (seen.has(x.model)) return false
    seen.add(x.model)
    return true
  })
}

/* ---------- 组织结构：电装集团 → 二级单位 → 三级经营单位（部分含下级基地/子公司） ---------- */
export type OrgNode = { name: string; industry?: string; park?: string; unconnected?: boolean; children?: OrgNode[] }
export const orgTree: OrgNode[] = [
  {
    name: '沈变公司',
    industry: '变压器',
    children: [
      { name: '沈变本部', park: '特变电工东北输变电产业园' },
      { name: '沈变智慧能源', park: '特变电工东北输变电产业园', unconnected: true },
      { name: '和新套管', park: '特变电工东北输变电产业园' },
      { name: '康嘉互感器', park: '特变电工东北输变电产业园' },
      { name: '印能公司', unconnected: true },
    ],
  },
  {
    name: '衡变公司',
    industry: '变压器',
    children: [
      { name: '衡变本部', park: '特变电工南方输变电产业园' },
      { name: '南京公司', park: '特变电工二次产业园区' },
      { name: '云集电气', park: '特变电工云集5G科技产业园' },
      { name: '湖南电气', park: '特变电工云集5G科技产业园' },
      {
        name: '云集高压开关',
        industry: '变压器',
        park: '特变电工云集5G科技产业园',
        children: [
          { name: '云集', park: '特变电工云集5G科技产业园' },
          { name: '上开', park: '上海园区' },
        ],
      },
      { name: '新疆自控', park: '新疆智能电气产业园' },
      { name: '特缆建', park: '特变电工湖南能源建设园区' },
      {
        name: '合容电气',
        industry: '变压器',
        park: '特变电工西安智能装备产业园',
        children: [
          { name: '科贝尔', park: '嘉兴园区' },
          { name: '合容西安基地', park: '特变电工西安智能装备产业园' },
        ],
      },
      { name: '事杰爱迪', industry: '变压器', park: '特变电工GIL产业园' },
    ],
  },
  {
    name: '新变厂',
    industry: '变压器',
    children: [
      { name: '超高压公司', park: '西北输变电科技产业园' },
      {
        name: '天变公司',
        park: '华北输变电科技产业园',
        children: [
          { name: '天变天津基地' },
          { name: '天变智慧能源' },
          { name: '天变智能科技' },
          { name: '天变衡阳基地' },
          { name: '天变沈阳基地' },
        ],
      },
      { name: '智能电气', park: '新疆智能电气产业园' },
      { name: '京津冀科技', park: '特变电工京津冀智能科技产业园' },
      { name: '珠峰硅钢', park: '特变电工京津冀智能科技产业园' },
      { name: '新变智慧能源', unconnected: true },
      { name: '银利电气', unconnected: true },
    ],
  },
  {
    name: '鲁缆公司',
    industry: '线缆',
    children: [
      {
        name: '鲁缆公司',
        park: '特变电工华东输变电科技产业园',
        children: [
          { name: '鲁缆本部', park: '特变电工华东输变电科技产业园' },
          { name: '昭和', park: '特变电工华东输变电科技产业园' },
          { name: '曙光', park: '特变电工曙光电缆产业园', unconnected: true },
        ],
      },
    ],
  },
  {
    name: '新缆厂',
    industry: '线缆',
    children: [
      {
        name: '新缆厂',
        park: '特变电工输变电产业园',
        children: [
          { name: '新疆线缆厂', park: '特变电工输变电产业园' },
          { name: '新疆电缆', park: '特变电工新疆电缆产业园' },
        ],
      },
    ],
  },
  {
    name: '德缆公司',
    industry: '线缆',
    children: [{ name: '德缆公司', park: '特变电工(德阳)电缆园区' }],
  },
]

/** 叶子经营单位（含所属产业，继承上级） */
export type LeafUnit = { name: string; industry: string; parent: string; park?: string }
function collectLeaves(nodes: OrgNode[], inheritedInd: string, parent: string, inheritedPark?: string, out: LeafUnit[] = []) {
  for (const n of nodes) {
    const ind = n.industry ?? inheritedInd
    const park = n.park ?? inheritedPark
    if (n.children?.length) collectLeaves(n.children, ind, n.name, park, out)
    else out.push({ name: n.name, industry: ind, parent, park })
  }
  return out
}
export const leafUnits: LeafUnit[] = collectLeaves(orgTree, '变压器', '特变电工电装集团')

/** 某组织节点下的全部叶子经营单位名称（节点名可为任意层级；叶子返回自身） */
export function findOrgNode(name: string, nodes: OrgNode[] = orgTree): OrgNode | null {
  for (const n of nodes) {
    if (n.name === name) return n
    if (n.children) {
      const f = findOrgNode(name, n.children)
      if (f) return f
    }
  }
  return null
}
export function leavesUnder(name: string): string[] {
  const node = findOrgNode(name)
  if (!node) return []
  if (!node.children?.length) return [node.name]
  return collectLeaves(node.children, node.industry ?? '变压器', node.name, node.park).map((l) => l.name)
}
export function industryOfUnit(unit: string) {
  return leafUnits.find((l) => l.name === unit)?.industry ?? '变压器'
}

/* ---------- 经营单位（按产业归属：叶子经营单位） ---------- */
export const unitsByIndustry: Record<string, string[]> = leafUnits.reduce<Record<string, string[]>>((acc, l) => {
  ;(acc[l.industry] ??= []).push(l.name)
  return acc
}, {})
export function unitsOf(ind: string) {
  const norm = (ind === '电器' || ind === '开关') ? '变压器' : ind
  return unitsByIndustry[norm] ?? []
}
/* ---------- 项目公司（= 经营单位）筛选选项，含“全部”哨兵 ---------- */
export const ALL_COMPANIES = '全部项目公司'
export function projectCompaniesOf(ind: string): string[] {
  return [ALL_COMPANIES, ...unitsOf(ind)]
}
/** 某型号实际有生产记录的经营单位（并非所有单位都生产所有型号，至少保留 3 家） */
export function producingUnitsOf(model: string, ind: string) {
  const norm = (ind === '电器' || ind === '开关') ? '变压器' : ind
  const all = unitsOf(norm)
  const picked = all.filter((u) => hash(`${model}|${u}|produce?`) > 0.42)
  if (picked.length >= 3) return picked
  return all.slice(0, Math.min(3, all.length))
}

/* 历史遗留：项目公司概念已取消，统一按经营单位展示 */
export const projectCompanies: string[] = []

/* ---------- 型号基准（单台 tCO2/台 & 特征量 kVA/km/台/间隔/面/支） ---------- */
const modelBase: Record<string, { perUnit: number; feature: number; unit: string; voltage?: number }> = {
  // 变压器-高压
  'SFZ-63000/110': { perUnit: 8.5, feature: 63000, unit: 'kVA', voltage: 110 },
  'SFSZ-120000/110': { perUnit: 9.6, feature: 120000, unit: 'kVA', voltage: 110 },
  'SFZ11-110': { perUnit: 9.0, feature: 110000, unit: 'kVA', voltage: 110 },
  'SFSZ11-110': { perUnit: 9.6, feature: 120000, unit: 'kVA', voltage: 110 },
  'SZ11-220': { perUnit: 16.4, feature: 240000, unit: 'kVA', voltage: 220 },
  'SFZ-180000/220': { perUnit: 15.8, feature: 180000, unit: 'kVA', voltage: 220 },
  'SSZ11-220': { perUnit: 17.2, feature: 240000, unit: 'kVA', voltage: 220 },
  'SFZ-330': { perUnit: 20.5, feature: 330000, unit: 'kVA', voltage: 330 },
  'SFP-360/330': { perUnit: 22.8, feature: 360000, unit: 'kVA', voltage: 330 },
  'SFP-360': { perUnit: 22.8, feature: 360000, unit: 'kVA', voltage: 330 },
  'OSFPS-360': { perUnit: 24.1, feature: 360000, unit: 'kVA', voltage: 500 },
  'SFP-500': { perUnit: 26.5, feature: 500000, unit: 'kVA', voltage: 500 },
  'ODFS-750': { perUnit: 32.0, feature: 750000, unit: 'kVA', voltage: 750 },
  'SSP-750': { perUnit: 33.5, feature: 750000, unit: 'kVA', voltage: 750 },
  'ODFS-1000': { perUnit: 42.0, feature: 1000000, unit: 'kVA', voltage: 1000 },
  'SZ-1000': { perUnit: 44.5, feature: 1000000, unit: 'kVA', voltage: 1000 },
  'ZZDFPZ-±400': { perUnit: 25.0, feature: 400000, unit: 'kVA', voltage: 400 },
  'ZZDFPZ-±500': { perUnit: 30.0, feature: 500000, unit: 'kVA', voltage: 500 },
  'ZZDFPZ-±800': { perUnit: 45.0, feature: 800000, unit: 'kVA', voltage: 800 },
  'ZZDFPZ-±1100': { perUnit: 58.0, feature: 1100000, unit: 'kVA', voltage: 1100 },
  'YD-100/100': { perUnit: 5.2, feature: 100000, unit: 'kVA', voltage: 100 },
  'YDTW-500/250': { perUnit: 12.0, feature: 250000, unit: 'kVA', voltage: 250 },

  // 变压器-中低压-油变
  'S11-M-315/10': { perUnit: 0.85, feature: 315, unit: 'kVA', voltage: 10 },
  'S11-M-500/10': { perUnit: 0.95, feature: 500, unit: 'kVA', voltage: 10 },
  'S11-M-630/10': { perUnit: 1.05, feature: 630, unit: 'kVA', voltage: 10 },
  'S13-M-630/10': { perUnit: 0.98, feature: 630, unit: 'kVA', voltage: 10 },
  'S13-M-800/10': { perUnit: 1.02, feature: 800, unit: 'kVA', voltage: 10 },
  'S13-M-800': { perUnit: 1.02, feature: 800, unit: 'kVA', voltage: 10 },
  'S13-M-1250/10': { perUnit: 1.25, feature: 1250, unit: 'kVA', voltage: 10 },
  'S15-M-500/10': { perUnit: 0.88, feature: 500, unit: 'kVA', voltage: 10 },
  'S15-M-800/10': { perUnit: 0.98, feature: 800, unit: 'kVA', voltage: 10 },
  'S15-M-1000/10': { perUnit: 1.15, feature: 1000, unit: 'kVA', voltage: 10 },
  'S13-M·RL-400/10': { perUnit: 0.82, feature: 400, unit: 'kVA', voltage: 10 },
  'S13-M·RL-630/10': { perUnit: 0.96, feature: 630, unit: 'kVA', voltage: 10 },
  'SBH15-M-400/10': { perUnit: 0.78, feature: 400, unit: 'kVA', voltage: 10 },
  'SBH15-M-630/10': { perUnit: 0.92, feature: 630, unit: 'kVA', voltage: 10 },
  'HSSP-12500/35': { perUnit: 4.5, feature: 12500, unit: 'kVA', voltage: 35 },
  'HKSSP-25000/110': { perUnit: 7.2, feature: 25000, unit: 'kVA', voltage: 110 },
  'ZHS-10000/35': { perUnit: 3.8, feature: 10000, unit: 'kVA', voltage: 35 },
  'ZHSFT-20000/110': { perUnit: 6.5, feature: 20000, unit: 'kVA', voltage: 110 },
  'QY-25000/110': { perUnit: 7.0, feature: 25000, unit: 'kVA', voltage: 110 },
  'QYZ-40000/220': { perUnit: 9.8, feature: 40000, unit: 'kVA', voltage: 220 },
  'SZ11-1600': { perUnit: 1.84, feature: 1600, unit: 'kVA', voltage: 10 },

  // 变压器-中低压-干变
  'SCB13-1600/10': { perUnit: 1.46, feature: 1600, unit: 'kVA', voltage: 10 },
  'SCB13-1600': { perUnit: 1.46, feature: 1600, unit: 'kVA', voltage: 10 },
  'SCB14-2000/10': { perUnit: 1.68, feature: 2000, unit: 'kVA', voltage: 10 },
  'SCB18-2500/10': { perUnit: 1.95, feature: 2500, unit: 'kVA', voltage: 10 },
  'SGB11-2000/10': { perUnit: 1.72, feature: 2000, unit: 'kVA', voltage: 10 },
  'SGB11-2000': { perUnit: 1.72, feature: 2000, unit: 'kVA', voltage: 10 },
  'SGB13-2500/10': { perUnit: 1.98, feature: 2500, unit: 'kVA', voltage: 10 },
  'SCB10-1250/10': { perUnit: 1.35, feature: 1250, unit: 'kVA', voltage: 10 },
  'SCB11-1600/10': { perUnit: 1.52, feature: 1600, unit: 'kVA', voltage: 10 },
  'SCBH15-1000/10': { perUnit: 1.18, feature: 1000, unit: 'kVA', voltage: 10 },
  'SCBH15-1600/10': { perUnit: 1.42, feature: 1600, unit: 'kVA', voltage: 10 },

  // 箱式变电站
  'ZGS11-H(Z)-500/10': { perUnit: 2.1, feature: 500, unit: 'kVA', voltage: 10 },
  'ZGS11-H(Z)-800/10': { perUnit: 2.5, feature: 800, unit: 'kVA', voltage: 10 },
  'YB-1250/10': { perUnit: 3.2, feature: 1250, unit: 'kVA', voltage: 10 },
  'YB-1600/10': { perUnit: 3.8, feature: 1600, unit: 'kVA', voltage: 10 },
  'YBW-630/35': { perUnit: 2.8, feature: 630, unit: 'kVA', voltage: 35 },
  'YBW-1000/35': { perUnit: 3.5, feature: 1000, unit: 'kVA', voltage: 35 },

  // 干式电抗器
  'CKSC-10': { perUnit: 1.1, feature: 10000, unit: 'kVA', voltage: 10 },
  'XKS-35': { perUnit: 2.8, feature: 35000, unit: 'kVA', voltage: 35 },
  'BKS-66': { perUnit: 5.4, feature: 66000, unit: 'kVA', voltage: 66 },
  'CKSC-220': { perUnit: 12.0, feature: 220000, unit: 'kVA', voltage: 220 },
  'BKD-330': { perUnit: 15.5, feature: 330000, unit: 'kVA', voltage: 330 },
  'BKD-500': { perUnit: 21.0, feature: 500000, unit: 'kVA', voltage: 500 },
  'BKD-35': { perUnit: 3.2, feature: 35000, unit: 'kVA', voltage: 35 },
  'BKD-110': { perUnit: 7.5, feature: 110000, unit: 'kVA', voltage: 110 },

  // 高压组合电器 GIS
  'ZF12-126': { perUnit: 3.8, feature: 1, unit: '间隔', voltage: 126 },
  'ZF12-145': { perUnit: 4.2, feature: 1, unit: '间隔', voltage: 145 },
  'ZF27-252': { perUnit: 7.2, feature: 1, unit: '间隔', voltage: 252 },
  'ZF27-363': { perUnit: 9.8, feature: 1, unit: '间隔', voltage: 363 },
  'ZF28-550': { perUnit: 14.5, feature: 1, unit: '间隔', voltage: 550 },
  'ZF28-800': { perUnit: 21.0, feature: 1, unit: '间隔', voltage: 800 },
  'LW25-126': { perUnit: 2.5, feature: 1, unit: '台', voltage: 126 },
  'LW25-252': { perUnit: 4.8, feature: 1, unit: '台', voltage: 252 },
  'GW4-126': { perUnit: 1.1, feature: 1, unit: '台', voltage: 126 },
  'GW7-252': { perUnit: 2.2, feature: 1, unit: '台', voltage: 252 },

  // 管道母线 GIL
  'GIL-126kV-1P': { perUnit: 1.8, feature: 100, unit: 'm', voltage: 126 },
  'GIL-252kV-1P': { perUnit: 3.2, feature: 100, unit: 'm', voltage: 252 },
  'GIL-550kV-1P': { perUnit: 5.5, feature: 100, unit: 'm', voltage: 550 },
  'GIL-±500kV-DC': { perUnit: 6.2, feature: 100, unit: 'm', voltage: 500 },
  'GIL-±800kV-DC': { perUnit: 9.5, feature: 100, unit: 'm', voltage: 800 },
  'GIL-126kV-3P': { perUnit: 3.5, feature: 100, unit: 'm', voltage: 126 },
  'GIL-252kV-3P': { perUnit: 6.0, feature: 100, unit: 'm', voltage: 252 },

  // 套管
  'BRDLW-40.5': { perUnit: 0.32, feature: 1, unit: '支', voltage: 40.5 },
  'BRLW-40.5': { perUnit: 0.35, feature: 1, unit: '支', voltage: 40.5 },
  'BRDLW-110': { perUnit: 0.52, feature: 1, unit: '支', voltage: 110 },
  'BRLW-220': { perUnit: 0.96, feature: 1, unit: '支', voltage: 220 },
  'BRDLW-363': { perUnit: 1.45, feature: 1, unit: '支', voltage: 363 },
  'BRLW-550': { perUnit: 2.1, feature: 1, unit: '支', voltage: 550 },
  'BRDLW-800': { perUnit: 3.2, feature: 1, unit: '支', voltage: 800 },
  'BRLW-1000': { perUnit: 4.5, feature: 1, unit: '支', voltage: 1000 },
  'GGF-500': { perUnit: 1.85, feature: 1, unit: '支', voltage: 500 },
  'FGF-800': { perUnit: 2.95, feature: 1, unit: '支', voltage: 800 },
  'FGF-1100': { perUnit: 4.8, feature: 1, unit: '支', voltage: 1100 },

  // 互感器
  'LVQB-110': { perUnit: 0.45, feature: 1, unit: '台', voltage: 110 },
  'LB9-220': { perUnit: 0.82, feature: 1, unit: '台', voltage: 220 },
  'LVQB-500': { perUnit: 1.65, feature: 1, unit: '台', voltage: 500 },
  'TYD-110': { perUnit: 0.42, feature: 1, unit: '台', voltage: 110 },
  'TYD-220': { perUnit: 0.78, feature: 1, unit: '台', voltage: 220 },
  'JDZX9-35': { perUnit: 0.35, feature: 1, unit: '台', voltage: 35 },
  'JLSZV-10': { perUnit: 0.28, feature: 1, unit: '台', voltage: 10 },
  'JLSZV-35': { perUnit: 0.48, feature: 1, unit: '台', voltage: 35 },

  // 电容器
  'BAM-11/100': { perUnit: 0.45, feature: 1, unit: '台', voltage: 11 },
  'BFM-12/200': { perUnit: 0.65, feature: 1, unit: '台', voltage: 12 },
  'CKG-10/50': { perUnit: 0.38, feature: 1, unit: '台', voltage: 10 },
  'CKG-35/100': { perUnit: 0.58, feature: 1, unit: '台', voltage: 35 },
  'TBC-10/3000': { perUnit: 4.5, feature: 1, unit: '套', voltage: 10 },
  'TBC-35/6000': { perUnit: 7.8, feature: 1, unit: '套', voltage: 35 },
  'BAM-35-1000': { perUnit: 2.2, feature: 1, unit: '台', voltage: 35 },
  'BFM-35-2000': { perUnit: 3.5, feature: 1, unit: '台', voltage: 35 },

  // 中低压开关柜
  'KYN28A-12': { perUnit: 1.15, feature: 1, unit: '面', voltage: 12 },
  'KYN28A-24': { perUnit: 1.25, feature: 1, unit: '面', voltage: 24 },
  'MNS-E': { perUnit: 0.88, feature: 1, unit: '面', voltage: 0.4 },
  'GCS-1': { perUnit: 0.85, feature: 1, unit: '面', voltage: 0.4 },
  'BKK-1': { perUnit: 0.62, feature: 1, unit: '面', voltage: 0.4 },
  'BKK-2': { perUnit: 0.72, feature: 1, unit: '面', voltage: 0.4 },
  'TB-SAS-900': { perUnit: 0.95, feature: 1, unit: '套' },
  'TB-SAS-920': { perUnit: 1.05, feature: 1, unit: '套' },
  'DTU-800': { perUnit: 0.45, feature: 1, unit: '台' },
  'FTU-600': { perUnit: 0.38, feature: 1, unit: '台' },

  // 变压器-铁芯
  'TX-B-0.23': { perUnit: 1.2, feature: 1000, unit: 'kg' },
  'TX-B-0.27': { perUnit: 1.15, feature: 1000, unit: 'kg' },
  'TX-HJ-300': { perUnit: 1.35, feature: 1000, unit: 'kg' },
  'TX-HJ-500': { perUnit: 1.3, feature: 1000, unit: 'kg' },
  'TX-ZJ-200': { perUnit: 1.28, feature: 1000, unit: 'kg' },
  'TX-ZJ-400': { perUnit: 1.25, feature: 1000, unit: 'kg' },
  'TX-LJ-100': { perUnit: 1.45, feature: 1000, unit: 'kg' },
  'TX-LJ-200': { perUnit: 1.4, feature: 1000, unit: 'kg' },

  // 线缆 · 裸导线
  'LGJ-240': { perUnit: 0.9, feature: 1000, unit: 'km' },
  'JL/G1A-300': { perUnit: 1.05, feature: 1000, unit: 'km' },
  'JL/G1A-400/35': { perUnit: 1.22, feature: 1000, unit: 'km' },
  'JLHA2-400': { perUnit: 1.28, feature: 1000, unit: 'km' },
  'JLHA1-500': { perUnit: 1.55, feature: 1000, unit: 'km' },
  'JLHA2-630': { perUnit: 1.82, feature: 1000, unit: 'km' },
  'JL/LHA1-300': { perUnit: 1.12, feature: 1000, unit: 'km' },
  'JL/LHA2-400': { perUnit: 1.35, feature: 1000, unit: 'km' },
  'LJ-185': { perUnit: 0.78, feature: 1000, unit: 'km' },
  'LJ-240': { perUnit: 0.92, feature: 1000, unit: 'km' },
  'LJ-300': { perUnit: 1.08, feature: 1000, unit: 'km' },
  'JLRX/US-300/40': { perUnit: 1.65, feature: 1000, unit: 'km' },
  'JLRX/US-400/50': { perUnit: 1.95, feature: 1000, unit: 'km' },

  // 线缆 · 布电线
  'BV-2.5': { perUnit: 0.12, feature: 1000, unit: 'km' },
  'BV-4': { perUnit: 0.16, feature: 1000, unit: 'km' },
  'BVR-4': { perUnit: 0.18, feature: 1000, unit: 'km' },
  'BVR-6': { perUnit: 0.24, feature: 1000, unit: 'km' },
  'ZR-BV-2.5': { perUnit: 0.13, feature: 1000, unit: 'km' },
  'ZR-BV-4': { perUnit: 0.17, feature: 1000, unit: 'km' },
  'ZR-BVR-6': { perUnit: 0.26, feature: 1000, unit: 'km' },
  'NH-BV-2.5': { perUnit: 0.15, feature: 1000, unit: 'km' },
  'NH-BV-4': { perUnit: 0.19, feature: 1000, unit: 'km' },
  'NH-BVR-4': { perUnit: 0.21, feature: 1000, unit: 'km' },
  'WDZ-BYJ-2.5': { perUnit: 0.14, feature: 1000, unit: 'km' },
  'WDZ-BYJ-4': { perUnit: 0.18, feature: 1000, unit: 'km' },
  'WDZN-BYJ-2.5': { perUnit: 0.16, feature: 1000, unit: 'km' },
  'RVVP-2*1.5': { perUnit: 0.22, feature: 1000, unit: 'km' },
  'RVVP-3*2.5': { perUnit: 0.32, feature: 1000, unit: 'km' },

  // 线缆 · 低压电力电缆
  'YJV-0.6/1kV 4*240': { perUnit: 2.85, feature: 1000, unit: 'km' },
  'YJV22-0.6/1kV 4*185': { perUnit: 2.65, feature: 1000, unit: 'km' },
  'YJV-0.6/1kV 5*16': { perUnit: 0.65, feature: 1000, unit: 'km' },
  'VV-0.6/1': { perUnit: 0.85, feature: 1000, unit: 'km' },
  'VV22-0.6/1': { perUnit: 1.35, feature: 1000, unit: 'km' },
  'VV-0.6/1 4*120': { perUnit: 1.65, feature: 1000, unit: 'km' },
  'WDZ-YJY-0.6/1': { perUnit: 1.15, feature: 1000, unit: 'km' },
  'WDZN-YJY23-0.6/1': { perUnit: 1.55, feature: 1000, unit: 'km' },
  'BTTZ-4*25': { perUnit: 1.85, feature: 1000, unit: 'km' },
  'YTTW-4*50': { perUnit: 2.15, feature: 1000, unit: 'km' },
  'BTLY-4*70': { perUnit: 2.45, feature: 1000, unit: 'km' },
  'YJHLV-0.6/1': { perUnit: 1.05, feature: 1000, unit: 'km' },
  'YJHLV82-0.6/1': { perUnit: 1.42, feature: 1000, unit: 'km' },

  // 线缆 · 中压电力电缆
  'YJV-8.7/15': { perUnit: 1.2, feature: 1000, unit: 'km' },
  'YJV22-26/35': { perUnit: 2.15, feature: 1000, unit: 'km' },
  'YJV-12/20': { perUnit: 1.65, feature: 1000, unit: 'km' },
  'ZR-YJV-8.7/15': { perUnit: 1.28, feature: 1000, unit: 'km' },
  'ZR-YJV22-26/35': { perUnit: 2.25, feature: 1000, unit: 'km' },
  'NH-YJV-8.7/15': { perUnit: 1.35, feature: 1000, unit: 'km' },
  'NH-YJV22-12/20': { perUnit: 1.82, feature: 1000, unit: 'km' },
  'FS-YJV-8.7/15': { perUnit: 1.32, feature: 1000, unit: 'km' },
  'FS-YJV22-26/35': { perUnit: 2.32, feature: 1000, unit: 'km' },

  // 线缆 · 高压电力电缆
  'YJLW02-64/110': { perUnit: 3.4, feature: 1000, unit: 'km' },
  'YJLW03-64/110': { perUnit: 3.55, feature: 1000, unit: 'km' },
  'YJLW03-127/220': { perUnit: 5.2, feature: 1000, unit: 'km' },
  'YJLLW03-127/220': { perUnit: 4.85, feature: 1000, unit: 'km' },
  'YJQ03-290/500': { perUnit: 8.9, feature: 1000, unit: 'km' },
  'YJLLW03-290/500': { perUnit: 7.9, feature: 1000, unit: 'km' },
  'DC-YJLW03-±320': { perUnit: 6.5, feature: 1000, unit: 'km' },
  'DC-YJLLW03-±535': { perUnit: 9.8, feature: 1000, unit: 'km' },

  // 线缆 · 电气装备用电缆
  'KVV-450/750': { perUnit: 0.65, feature: 1000, unit: 'km' },
  'KVV22-450/750': { perUnit: 0.88, feature: 1000, unit: 'km' },
  'KYJY-450/750': { perUnit: 0.72, feature: 1000, unit: 'km' },
  'KYJY22-450/750': { perUnit: 0.95, feature: 1000, unit: 'km' },
  'DJYVP-300/500': { perUnit: 0.55, feature: 1000, unit: 'km' },
  'DJYPVP-300/500': { perUnit: 0.68, feature: 1000, unit: 'km' },
  'CEFR/DA-0.6/1': { perUnit: 1.15, feature: 1000, unit: 'km' },
  'CHV82/SA-0.6/1': { perUnit: 1.35, feature: 1000, unit: 'km' },
  'BP-YJVP-0.6/1': { perUnit: 1.05, feature: 1000, unit: 'km' },
  'BP-YJVP2-ZR-8.7/15': { perUnit: 1.85, feature: 1000, unit: 'km' },

  // 线缆 · 橡套电缆
  'YC-450/750': { perUnit: 0.82, feature: 1000, unit: 'km' },
  'YCW-450/750': { perUnit: 0.95, feature: 1000, unit: 'km' },
  'YCZ-450/750': { perUnit: 1.05, feature: 1000, unit: 'km' },
  'MY-0.38/0.66': { perUnit: 1.15, feature: 1000, unit: 'km' },
  'MYPT-6/10': { perUnit: 1.95, feature: 1000, unit: 'km' },
  'MC-0.38/0.66': { perUnit: 0.95, feature: 1000, unit: 'km' },
  'FD-EYH-0.6/1': { perUnit: 1.45, feature: 1000, unit: 'km' },
  'FD-YCW-0.6/1': { perUnit: 1.35, feature: 1000, unit: 'km' },
  'YH-245IEC81': { perUnit: 0.75, feature: 1000, unit: 'km' },
  'YHF-245IEC82': { perUnit: 0.88, feature: 1000, unit: 'km' },

  // 线缆 · 特种电缆
  'PV1-F-4mm²': { perUnit: 0.22, feature: 1000, unit: 'km' },
  'H1Z2Z2-K-6mm²': { perUnit: 0.31, feature: 1000, unit: 'km' },
  'FD-YFF-0.6/1': { perUnit: 1.25, feature: 1000, unit: 'km' },
  'FD-YJE-8.7/15': { perUnit: 1.95, feature: 1000, unit: 'km' },
  'UGEFP-3.6/6': { perUnit: 2.85, feature: 1000, unit: 'km' },
  'UGEFHP-6/10': { perUnit: 3.45, feature: 1000, unit: 'km' },
  'F-CE-1500V': { perUnit: 0.85, feature: 1000, unit: 'km' },
  'ES-YJY-1500V': { perUnit: 0.95, feature: 1000, unit: 'km' },
  'KX-HS-FFP': { perUnit: 0.38, feature: 1000, unit: 'km' },
  'EX-GS-VVP': { perUnit: 0.42, feature: 1000, unit: 'km' },
}

export function featureOf(model: string) {
  if (modelBase[model]) return modelBase[model]
  // 智能推断容量与电压
  const vMatch = model.match(/(?:±|\/|-)(\d{2,4})(?:kV|kv)?/i)
  const voltage = vMatch ? parseInt(vMatch[1]) : undefined
  const capMatch = model.match(/(?:-|\/)(\d{3,6})(?:\/|$)/)
  const feature = capMatch ? parseInt(capMatch[1]) : 1000
  return { perUnit: 5.0, feature, unit: 'kVA', voltage }
}

/** 变压器规格：电压等级(kV) + 容量（自动 kVA/MVA 显示） */
export function transformerSpec(model: string): { voltage: string; capacity: string } | null {
  const b = featureOf(model)
  if (b.voltage == null) return null
  const capacity = b.feature >= 1000 ? `${(b.feature / 1000).toLocaleString()} MVA` : `${b.feature.toLocaleString()} kVA`
  return { voltage: `${b.voltage} kV`, capacity }
}

/* ---------- 生命周期阶段构成（占比，主材=原材料获取） ---------- */
export const lifecycleStages = [
  { key: 'material', name: '原材料获取', ratio: 0.62 },
  { key: 'transport', name: '原材料运输', ratio: 0.09 },
  { key: 'produce', name: '生产制造', ratio: 0.21 },
  { key: 'waste', name: '废弃物处理', ratio: 0.08 },
] as const

/* ---------- 核心：某型号 × 各经营单位 指标矩阵 ---------- */
export type UnitMetric = {
  unit: string
  isProject: boolean
  perUnit: number // 单台产品碳足迹 tCO2/台
  perKva: number // 单位产品碳足迹 kgCO2/kVA（或对应特征量单位）
  material: number // 原材料获取(主材) tCO2/台
  transport: number
  produce: number // 生产制造 tCO2/台
  waste: number
  lifecycle: number // 全生命周期 tCO2/台
  qty: number // 产品数（台/km）
  orders: number // 生产订单数
  lines: number // 车间产线数量
  feature: number // 特征量
  featureUnit: string
}

export function unitMetrics(model: string, industry: string): UnitMetric[] {
  const base = featureOf(model)
  return producingUnitsOf(model, industry).map((unit) => {
    // 单位效率因子 0.86 ~ 1.18（越低越好）
    const f = rnd(`${model}|${unit}|eff`, 0.86, 1.18, 3)
    const perUnit = Math.round(base.perUnit * f * 1000) / 1000
    const material = Math.round(perUnit * lifecycleStages[0].ratio * 1000) / 1000
    const transport = Math.round(perUnit * lifecycleStages[1].ratio * 1000) / 1000
    const produce = Math.round(perUnit * lifecycleStages[2].ratio * 1000) / 1000
    const waste = Math.round((perUnit - material - transport - produce) * 1000) / 1000
    // 单位产品碳足迹：单台 tCO2 → kgCO2 / 特征量
    const perKva = Math.round(((perUnit * 1000) / base.feature) * 10000) / 10000
    return {
      unit,
      isProject: projectCompanies.includes(unit),
      perUnit,
      perKva,
      material,
      transport,
      produce,
      waste,
      lifecycle: Math.round(perUnit * 1.12 * 1000) / 1000, // 含使用/回收
      qty: rnd(`${model}|${unit}|qty`, 12, 96, 0),
      orders: rnd(`${model}|${unit}|ord`, 3, 18, 0),
      lines: rnd(`${model}|${unit}|lines`, 1, 4, 0),
      feature: base.feature,
      featureUnit: base.unit,
    }
  })
}

/* ---------- 排序指标定义（横向对比·排序内容切换） ---------- */
export const sortMetrics = [
  { key: 'perKva', name: '单位产品碳足迹', unit: 'kgCO2/kVA' },
  { key: 'perUnit', name: '单台产品碳足迹', unit: 'tCO2/台' },
  { key: 'material', name: '原材料获取阶段碳排', unit: 'tCO2/台' },
  { key: 'produce', name: '生产制造阶段碳排', unit: 'tCO2/台' },
] as const
export type SortMetricKey = (typeof sortMetrics)[number]['key']

/* ---------- 生产订单 & 生产计划（下钻用） ---------- */
export type ProdPlan = {
  plan: string
  window: string
  qty: number
  perUnit: number
  material: number
  produce: number
  transport: number
  waste: number
}
export type ProdOrder = {
  order: string
  customer: string
  qty: number
  perUnit: number
  material: number
  produce: number
  transport: number
  waste: number
  plans: ProdPlan[]
}

const customers = ['国家电网湖南', '南方电网广东', 'EU-TRANS GmbH', '中电装备', '华能新能源', '国网江苏']

export function ordersOf(model: string, unit: string, industry: string): ProdOrder[] {
  const base = featureOf(model)
  const m = unitMetrics(model, industry).find((x) => x.unit === unit)
  const perUnit = m?.perUnit ?? base.perUnit
  const n = 3 + Math.floor(hash(`${model}|${unit}|orders`) * 3) // 3~5 单
  return Array.from({ length: n }, (_, i) => {
    const oid = `SO-${2607 + i}${String(10 + i * 3).slice(-2)}`
    const of = rnd(`${model}|${unit}|${oid}|f`, 0.94, 1.08, 3)
    const opu = Math.round(perUnit * of * 1000) / 1000
    const qty = rnd(`${model}|${unit}|${oid}|q`, 2, 12, 0)
    const planN = 1 + Math.floor(hash(`${oid}|plans`) * 2) // 1~2 个生产计划
    const plans: ProdPlan[] = Array.from({ length: planN }, (_, j) => {
      const pid = `PL-${oid.slice(3)}-0${j + 1}`
      const pf = rnd(`${pid}|f`, 0.95, 1.06, 3)
      const ppu = Math.round(opu * pf * 1000) / 1000
      return {
        plan: pid,
        window: `07-${15 + j * 13} → 07-${28 + j * 13}`.replace('07-41', '08-10'),
        qty: Math.max(1, Math.round(qty / planN)),
        perUnit: ppu,
        material: Math.round(ppu * lifecycleStages[0].ratio * 1000) / 1000,
        produce: Math.round(ppu * lifecycleStages[2].ratio * 1000) / 1000,
        transport: Math.round(ppu * lifecycleStages[1].ratio * 1000) / 1000,
        waste: Math.round(ppu * lifecycleStages[3].ratio * 1000) / 1000,
      }
    })
    return {
      order: oid,
      customer: customers[Math.floor(hash(`${oid}|cust`) * customers.length)],
      qty,
      perUnit: opu,
      material: Math.round(opu * lifecycleStages[0].ratio * 1000) / 1000,
      produce: Math.round(opu * lifecycleStages[2].ratio * 1000) / 1000,
      transport: Math.round(opu * lifecycleStages[1].ratio * 1000) / 1000,
      waste: Math.round(opu * lifecycleStages[3].ratio * 1000) / 1000,
      plans,
    }
  })
}

/* ---------- 主材构成（订单/型号下钻 · 柱状对比��� ---------- */
export const mainMaterials = ['硅钢片', '电解铜', '绝缘油', '绝缘纸板', '钢结构件']
export function materialBreakdown(seed: string): { name: string; value: number }[] {
  return mainMaterials.map((name) => ({
    name,
    value: rnd(`${seed}|${name}`, 120, 980, 0),
  }))
}
/* 生产环节构成 */
export const produceSteps = ['铁心叠装', '线圈绕制', '器身装配', '真空干燥', '总装试验']
export function produceBreakdown(seed: string): { name: string; value: number }[] {
  return produceSteps.map((name) => ({
    name,
    value: rnd(`${seed}|${name}`, 60, 420, 0),
  }))
}

/* ---------- 基准对比：车间产线 vs 基准值 ---------- */
export type WorkshopLine = {
  name: string // 车间产线
  unit: string // 所属经营单位
  perUnit: number // 单台碳足迹 tCO2/台
  material: number // 主材碳排 tCO2/台
  produce: number // 生产环节碳排 tCO2/台
}
/* 各维度基准值 */
export const benchmarkValues = { perUnit: 9.0, material: 5.4, produce: 1.9 }

export function workshopLines(model: string, industry: string): WorkshopLine[] {
  const units = unitsOf(industry)
  const names = ['一号总装线', '二号总装线', '高压试验线']
  const out: WorkshopLine[] = []
  units.slice(0, 4).forEach((unit) => {
    const cnt = 1 + Math.floor(hash(`${unit}|wsN`) * 2)
    for (let i = 0; i < cnt; i++) {
      const seed = `${model}|${unit}|${names[i]}`
      const f = rnd(seed, 0.82, 1.22, 3)
      const perUnit = Math.round(benchmarkValues.perUnit * f * 100) / 100
      out.push({
        name: `${unit}·${names[i]}`,
        unit,
        perUnit,
        material: Math.round(perUnit * 0.6 * 100) / 100,
        produce: Math.round(perUnit * 0.21 * 100) / 100,
      })
    }
  })
  return out
}

/* ---------- 高碳排热点 ---------- */
export const carbonHotspots = [
  {
    title: '真空干燥工序电耗偏高',
    line: '沈变本部·二号总装线',
    over: '+18.4%',
    tone: 'danger' as const,
    advice: '该工序单台电耗高于基准 18.4%，建议核查干燥罐保温层与真空泵运行策略，评估余热回收改造。',
  },
  {
    title: '硅钢片主材碳排超基准',
    line: '新变超高压·一号总装线',
    over: '+12.1%',
    tone: 'warn' as const,
    advice: '主材碳排高于基准 12.1%，主因供应商硅钢片因子偏高，建议切换 A 级低碳供应商或提升成材率。',
  },
  {
    title: '市电占比过高',
    line: '衡变本部·高压试验线',
    over: '+9.6%',
    tone: 'warn' as const,
    advice: '生产环节绿电占比不足，建议提升厂区分布式光伏自发自用比例并申购绿电。',
  },
]

/* ---------- 对外示范窗口 · 分产业均值趋势 ---------- */
export const industryMeanTrend = [
  { month: '3月', 变压器: 0.92, 线缆: 1.24, 开关: 0.71 },
  { month: '4月', 变压器: 0.9, 线缆: 1.2, 开关: 0.7 },
  { month: '5月', 变压器: 0.89, 线缆: 1.18, 开关: 0.69 },
  { month: '6月', 变压器: 0.87, 线缆: 1.15, 开关: 0.68 },
  { month: '7月', 变压器: 0.85, 线缆: 1.12, 开关: 0.67 },
  { month: '8月', 变压器: 0.84, 线缆: 1.1, 开关: 0.66 },
]

/* 状态判定：相对基准的达标度 */
export function benchTone(actual: number, benchmark: number, lowerBetter = true) {
  const ratio = actual / benchmark
  if (lowerBetter) {
    if (ratio <= 1.0) return 'ok' as const
    if (ratio <= 1.1) return 'warn' as const
    return 'danger' as const
  }
  if (ratio >= 1.0) return 'ok' as const
  if (ratio >= 0.9) return 'warn' as const
  return 'danger' as const
}
