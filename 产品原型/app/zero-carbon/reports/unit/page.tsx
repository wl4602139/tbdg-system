'use client'

import { useState, useMemo } from 'react'
import {
  Download,
  Calendar,
  Gauge,
  Info,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SearchableUnitSelect } from '@/components/shared/searchable-unit-select'

// 🌟 指标管控 10 大核心参数元数据定义（对齐国家级零碳工厂与集团管理要求）
export interface IndicatorMeta {
  key: string
  name: string
  shortName: string
  unit: string
  tag: '国家级零碳工厂' | '公司管理要求'
  formula: string
  description: string
  benchmark: string
}

export const INDICATOR_METAS: IndicatorMeta[] = [
  {
    key: 'totalTce',
    name: '综合能源消费量',
    shortName: '综合能耗',
    unit: 'tce',
    tag: '国家级零碳工厂',
    formula: 'E = ∑(Ei × ki)，包含电力、天然气、蒸汽、工业用水、柴油等折标',
    description: '统计期内组织综合能源消费的总吨标准煤当量，是衡量企业综合耗能水平的基准。',
    benchmark: '≤ 1,300 tce/月',
  },
  {
    key: 'totalCarbon',
    name: '总碳排放量',
    shortName: '总碳排放',
    unit: 'tCO2',
    tag: '国家级零碳工厂',
    formula: 'C = C燃烧 + C过程 + C购入电 - C输出电 + C购入热 - C输出热 - C抵消',
    description: '涵盖范围1（化石燃料直接燃烧）和范围2（外购电力与蒸汽净碳排放）。',
    benchmark: '≤ 3,000 tCO2/月',
  },
  {
    key: 'carbonPerTce',
    name: '单位能耗碳排放',
    shortName: '能耗碳强度',
    unit: 'tCO2/tce',
    tag: '国家级零碳工厂',
    formula: 'I = C / E（总碳排放量与综合能耗之比，优先采用省级电网电碳因子）',
    description: '反映能源结构的绿色低碳化程度，绿电绿能使用越多，该值越低。',
    benchmark: '≤ 2.30 tCO2/tce',
  },
  {
    key: 'nonFossilRatio',
    name: '非化石能源消费占比',
    shortName: '非化石占比',
    unit: '%',
    tag: '国家级零碳工厂',
    formula: 'r = (R / E) × 100%（自建绿电 + 外部交易绿电 + 绿证认购等非化石总量/综合能耗）',
    description: '企业全部非化石绿色能源消费在综合能源总消费中的占比。',
    benchmark: '≥ 35.0%',
  },
  {
    key: 'physicalGreenRatio',
    name: '非化石电力物理认购占比',
    shortName: '物理绿电占比',
    unit: '%',
    tag: '国家级零碳工厂',
    formula: 'Eui = (Ez / Q) × 100%（仅计算厂区自建光伏消纳与专线直供物理可溯源绿电）',
    description: '具备物理可溯源属性的自发自用绿电占总用电量比例，不含纯凭证类交易。',
    benchmark: '≥ 25.0%',
  },
  {
    key: 'energyPerNva',
    name: '单位工业增加值能耗',
    shortName: '工业增加值能耗',
    unit: 'tce/万元',
    tag: '国家级零碳工厂',
    formula: 'Enva = E / Gnva（综合能源消费量 / 企业工业增加值）',
    description: '国家工业与信息化部“十四五”能耗双控关键考核指标，体现产出能效质量。',
    benchmark: '≤ 0.150 tce/万元',
  },
  {
    key: 'energyPerOutput',
    name: '单位产值能耗',
    shortName: '产值单耗',
    unit: 'tce/万元',
    tag: '公司管理要求',
    formula: 'g = E / G（综合能源消费量 / 产品总产值）',
    description: '衡量单位产值消耗的能源总量，用于集团内部车间与产品线纵向横向对标。',
    benchmark: '≤ 0.058 tce/万元',
  },
  {
    key: 'waterM3',
    name: '水资源消耗量',
    shortName: '工业用水量',
    unit: 't',
    tag: '公司管理要求',
    formula: 'W = ∑(工业生产用水 + 循环补水 + 公辅生活水)',
    description: '统计期内制造单位从市政管网或自备水源取用消耗的全部工业用水总量。',
    benchmark: '≤ 15,000 t/月',
  },
  {
    key: 'energySavingEquipRatio',
    name: '节能装备应用占比',
    shortName: '节能装备占比',
    unit: '%',
    tag: '国家级零碳工厂',
    formula: 'S = (Res / Ets) × 100%（达到或优于国标2级能效的在役装备总额定功率/全部在役功率）',
    description: '包括高效电机、一级能效空压机、变频热泵、节能变压器等先进绿色装备覆盖率。',
    benchmark: '≥ 90.0%',
  },
  {
    key: 'carbonFootprintAnalysisRatio',
    name: '开展产品碳足迹分析占比',
    shortName: '碳足迹分析占比',
    unit: '%',
    tag: '国家级零碳工厂',
    formula: 'Rcf = (Ncf / N) × 100%（开展LCA生命周期碳足迹建模的产品大类 / 总生产产品大类）',
    description: '应对欧盟CBAM出海壁垒及国家绿色供应链采购标准的关键支撑能力指标。',
    benchmark: '≥ 80.0%',
  },
]

// 单耗与指标管控行数据模型
export interface UnitIndicatorRow {
  id: string
  unitId: string
  unitName: string
  company: string
  // 10 大管控参数
  totalTce: number                     // 1. 综合能源消费量 (tce)
  totalCarbon: number                  // 2. 总碳排放量 (tCO2)
  carbonPerTce: number                 // 3. 单位能耗碳排放 (tCO2/tce)
  nonFossilRatio: number               // 4. 非化石能源消费占比 (%)
  physicalGreenRatio: number           // 5. 非化石电力物理认购占比 (%)
  energyPerNva: number                 // 6. 单位工业增加值能耗 (tce/万元)
  energyPerOutput: number              // 7. 单位产值能耗 (tce/万元)
  waterM3: number                      // 8. 水资源消耗量 (t)
  energySavingEquipRatio: number       // 9. 节能装备应用占比 (%)
  carbonFootprintAnalysisRatio: number // 10. 开展产品碳足迹分析占比 (%)
  // 变动趋势
  tceYoy: number                       // 综合能耗同比变动 (%)
  carbonYoy: number                    // 碳排同比变动 (%)
}

// 🏭 特变电工 6 大重点制造企业 17 个单位/车间 单耗与指标管控全量台账
const ALL_UNIT_ROWS: UnitIndicatorRow[] = [
  // --- 1. 沈变公司 ---
  {
    id: 'SB-01',
    unitId: 'ws_sb_main',
    unitName: '沈变本部',
    company: '沈变公司',
    totalTce: 1284.5,
    totalCarbon: 2946.8,
    carbonPerTce: 2.294,
    nonFossilRatio: 38.6,
    physicalGreenRatio: 27.8,
    energyPerNva: 0.1425,
    energyPerOutput: 0.0553,
    waterM3: 15480,
    energySavingEquipRatio: 92.4,
    carbonFootprintAnalysisRatio: 85.7,
    tceYoy: -4.8,
    carbonYoy: -5.4,
  },
  {
    id: 'SB-02',
    unitId: 'ws_sb_luna',
    unitName: '露娜公司 (特变电工露娜智能)',
    company: '沈变公司',
    totalTce: 312.4,
    totalCarbon: 685.2,
    carbonPerTce: 2.193,
    nonFossilRatio: 42.5,
    physicalGreenRatio: 31.2,
    energyPerNva: 0.1280,
    energyPerOutput: 0.0482,
    waterM3: 3820,
    energySavingEquipRatio: 95.0,
    carbonFootprintAnalysisRatio: 90.0,
    tceYoy: -5.2,
    carbonYoy: -6.1,
  },
  {
    id: 'SB-03',
    unitId: 'ws_sb_zh',
    unitName: '智慧能源',
    company: '沈变公司',
    totalTce: 185.0,
    totalCarbon: 398.6,
    carbonPerTce: 2.155,
    nonFossilRatio: 45.8,
    physicalGreenRatio: 35.0,
    energyPerNva: 0.1150,
    energyPerOutput: 0.0420,
    waterM3: 1950,
    energySavingEquipRatio: 96.5,
    carbonFootprintAnalysisRatio: 80.0,
    tceYoy: -6.0,
    carbonYoy: -7.2,
  },
  {
    id: 'SB-04',
    unitId: 'ws_sb_hx',
    unitName: '和新套管公司',
    company: '沈变公司',
    totalTce: 245.8,
    totalCarbon: 562.4,
    carbonPerTce: 2.288,
    nonFossilRatio: 36.5,
    physicalGreenRatio: 25.4,
    energyPerNva: 0.1520,
    energyPerOutput: 0.0610,
    waterM3: 2860,
    energySavingEquipRatio: 89.0,
    carbonFootprintAnalysisRatio: 75.0,
    tceYoy: -3.8,
    carbonYoy: -4.5,
  },
  {
    id: 'SB-05',
    unitId: 'ws_sb_kj',
    unitName: '康嘉互感器',
    company: '沈变公司',
    totalTce: 198.2,
    totalCarbon: 450.8,
    carbonPerTce: 2.274,
    nonFossilRatio: 35.2,
    physicalGreenRatio: 24.1,
    energyPerNva: 0.1480,
    energyPerOutput: 0.0590,
    waterM3: 2120,
    energySavingEquipRatio: 88.5,
    carbonFootprintAnalysisRatio: 70.0,
    tceYoy: -4.1,
    carbonYoy: -4.9,
  },
  {
    id: 'SB-06',
    unitId: 'ws_sb_yn',
    unitName: '印能公司',
    company: '沈变公司',
    totalTce: 142.6,
    totalCarbon: 326.8,
    carbonPerTce: 2.292,
    nonFossilRatio: 34.0,
    physicalGreenRatio: 22.8,
    energyPerNva: 0.1560,
    energyPerOutput: 0.0635,
    waterM3: 1680,
    energySavingEquipRatio: 87.0,
    carbonFootprintAnalysisRatio: 66.7,
    tceYoy: -3.5,
    carbonYoy: -4.0,
  },

  // --- 2. 衡变公司 ---
  {
    id: 'HB-01',
    unitId: 'ws_hb_main',
    unitName: '衡变本部',
    company: '衡变公司',
    totalTce: 1180.2,
    totalCarbon: 2725.6,
    carbonPerTce: 2.309,
    nonFossilRatio: 37.2,
    physicalGreenRatio: 26.5,
    energyPerNva: 0.1450,
    energyPerOutput: 0.0568,
    waterM3: 14200,
    energySavingEquipRatio: 91.8,
    carbonFootprintAnalysisRatio: 83.3,
    tceYoy: -5.0,
    carbonYoy: -5.8,
  },
  {
    id: 'HB-02',
    unitId: 'ws_hb_yj',
    unitName: '云集高压开关',
    company: '衡变公司',
    totalTce: 286.4,
    totalCarbon: 642.0,
    carbonPerTce: 2.242,
    nonFossilRatio: 39.5,
    physicalGreenRatio: 28.0,
    energyPerNva: 0.1360,
    energyPerOutput: 0.0515,
    waterM3: 3450,
    energySavingEquipRatio: 93.0,
    carbonFootprintAnalysisRatio: 78.5,
    tceYoy: -4.6,
    carbonYoy: -5.2,
  },
  {
    id: 'HB-03',
    unitId: 'ws_hb_nf',
    unitName: '南方电抗',
    company: '衡变公司',
    totalTce: 232.0,
    totalCarbon: 528.4,
    carbonPerTce: 2.278,
    nonFossilRatio: 36.8,
    physicalGreenRatio: 25.6,
    energyPerNva: 0.1490,
    energyPerOutput: 0.0582,
    waterM3: 2640,
    energySavingEquipRatio: 90.5,
    carbonFootprintAnalysisRatio: 72.0,
    tceYoy: -4.2,
    carbonYoy: -4.7,
  },

  // --- 3. 新变厂 ---
  {
    id: 'XB-01',
    unitId: 'ws_xb_main',
    unitName: '新疆变压器厂',
    company: '新变厂',
    totalTce: 1360.5,
    totalCarbon: 3180.2,
    carbonPerTce: 2.338,
    nonFossilRatio: 35.8,
    physicalGreenRatio: 25.0,
    energyPerNva: 0.1495,
    energyPerOutput: 0.0586,
    waterM3: 16800,
    energySavingEquipRatio: 90.2,
    carbonFootprintAnalysisRatio: 81.5,
    tceYoy: -4.4,
    carbonYoy: -5.0,
  },
  {
    id: 'XB-02',
    unitId: 'ws_xb_tb',
    unitName: '天变公司',
    company: '新变厂',
    totalTce: 620.4,
    totalCarbon: 1425.0,
    carbonPerTce: 2.297,
    nonFossilRatio: 38.0,
    physicalGreenRatio: 26.8,
    energyPerNva: 0.1410,
    energyPerOutput: 0.0545,
    waterM3: 7200,
    energySavingEquipRatio: 92.0,
    carbonFootprintAnalysisRatio: 76.0,
    tceYoy: -4.7,
    carbonYoy: -5.5,
  },

  // --- 4. 鲁缆公司 ---
  {
    id: 'LL-01',
    unitId: 'ws_ll_main',
    unitName: '鲁缆本部',
    company: '鲁缆公司',
    totalTce: 980.6,
    totalCarbon: 2280.4,
    carbonPerTce: 2.325,
    nonFossilRatio: 36.2,
    physicalGreenRatio: 24.9,
    energyPerNva: 0.1465,
    energyPerOutput: 0.0572,
    waterM3: 11500,
    energySavingEquipRatio: 91.0,
    carbonFootprintAnalysisRatio: 84.0,
    tceYoy: -4.9,
    carbonYoy: -5.6,
  },
  {
    id: 'LL-02',
    unitId: 'ws_ll_fj',
    unitName: '电缆附件厂',
    company: '鲁缆公司',
    totalTce: 215.8,
    totalCarbon: 486.2,
    carbonPerTce: 2.253,
    nonFossilRatio: 38.8,
    physicalGreenRatio: 27.2,
    energyPerNva: 0.1380,
    energyPerOutput: 0.0520,
    waterM3: 2480,
    energySavingEquipRatio: 92.5,
    carbonFootprintAnalysisRatio: 74.0,
    tceYoy: -4.3,
    carbonYoy: -5.1,
  },
  {
    id: 'LL-03',
    unitId: 'ws_ll_yg',
    unitName: '阳光公司',
    company: '鲁缆公司',
    totalTce: 178.4,
    totalCarbon: 395.0,
    carbonPerTce: 2.214,
    nonFossilRatio: 41.2,
    physicalGreenRatio: 30.5,
    energyPerNva: 0.1290,
    energyPerOutput: 0.0495,
    waterM3: 1890,
    energySavingEquipRatio: 94.0,
    carbonFootprintAnalysisRatio: 80.0,
    tceYoy: -5.5,
    carbonYoy: -6.4,
  },

  // --- 5. 新缆厂 ---
  {
    id: 'XL-01',
    unitId: 'ws_xl_main',
    unitName: '特变电工新疆线缆有限公司',
    company: '新缆厂',
    totalTce: 720.5,
    totalCarbon: 1685.0,
    carbonPerTce: 2.339,
    nonFossilRatio: 35.5,
    physicalGreenRatio: 24.5,
    energyPerNva: 0.1480,
    energyPerOutput: 0.0579,
    waterM3: 8650,
    energySavingEquipRatio: 90.8,
    carbonFootprintAnalysisRatio: 82.0,
    tceYoy: -4.5,
    carbonYoy: -5.2,
  },
  {
    id: 'XL-02',
    unitId: 'ws_xl_sub',
    unitName: '特变电工新缆线缆厂',
    company: '新缆厂',
    totalTce: 345.2,
    totalCarbon: 798.5,
    carbonPerTce: 2.313,
    nonFossilRatio: 37.0,
    physicalGreenRatio: 26.0,
    energyPerNva: 0.1430,
    energyPerOutput: 0.0550,
    waterM3: 4120,
    energySavingEquipRatio: 91.5,
    carbonFootprintAnalysisRatio: 75.0,
    tceYoy: -4.8,
    carbonYoy: -5.5,
  },

  // --- 6. 德缆公司 ---
  {
    id: 'DL-01',
    unitId: 'ws_dl_main',
    unitName: '特变电工（德阳）电缆股份有限公司',
    company: '德缆公司',
    totalTce: 680.0,
    totalCarbon: 1560.0,
    carbonPerTce: 2.294,
    nonFossilRatio: 38.2,
    physicalGreenRatio: 27.0,
    energyPerNva: 0.1405,
    energyPerOutput: 0.0540,
    waterM3: 7850,
    energySavingEquipRatio: 92.2,
    carbonFootprintAnalysisRatio: 85.0,
    tceYoy: -4.7,
    carbonYoy: -5.4,
  },
]

export default function UnitReportPage() {
  // 时间维度与范围
  const [timeDim, setTimeDim] = useState<'month' | 'quarter' | 'year'>('month')
  const [selectedMonthRange, setSelectedMonthRange] = useState({ start: '2026-01', end: '2026-08' })
  const [selectedQuarter, setSelectedQuarter] = useState('2026-Q3')
  const [selectedYear, setSelectedYear] = useState('2026')

  // 级联筛选条件
  const [companyFilter, setCompanyFilter] = useState<string>('all')
  const [unitFilter, setUnitFilter] = useState<string>('all')

  // 指标详情弹窗状态
  const [selectedIndicator, setSelectedIndicator] = useState<IndicatorMeta | null>(null)
  const [selectedRowDetail, setSelectedRowDetail] = useState<{ row: UnitIndicatorRow; indicator: IndicatorMeta } | null>(null)

  // 提取企业列表
  const allCompanies = useMemo(() => {
    return Array.from(new Set(ALL_UNIT_ROWS.map((r) => r.company)))
  }, [])

  // 根据当前企业级联获取所属单位列表
  const availableUnits = useMemo(() => {
    if (companyFilter === 'all') {
      return ALL_UNIT_ROWS.map((r) => ({ id: r.unitId, name: r.unitName, company: r.company }))
    }
    return ALL_UNIT_ROWS
      .filter((r) => r.company === companyFilter)
      .map((r) => ({ id: r.unitId, name: r.unitName, company: r.company }))
  }, [companyFilter])

  // 级联过滤表格行
  const filteredRows = useMemo(() => {
    let rows = [...ALL_UNIT_ROWS]

    // 1. 企业过滤
    if (companyFilter !== 'all') {
      rows = rows.filter((r) => r.company === companyFilter)
    }

    // 2. 单位过滤
    if (unitFilter !== 'all') {
      rows = rows.filter((r) => r.unitName === unitFilter || r.unitId === unitFilter)
    }

    return rows
  }, [companyFilter, unitFilter])

  // 预计算相同公司的 rowSpan 合并信息
  const companyRowSpans = useMemo(() => {
    const spans: number[] = []
    let i = 0
    while (i < filteredRows.length) {
      let span = 1
      while (i + span < filteredRows.length && filteredRows[i + span].company === filteredRows[i].company) {
        span++
      }
      spans[i] = span
      for (let k = 1; k < span; k++) {
        spans[i + k] = 0
      }
      i += span
    }
    return spans
  }, [filteredRows])

  // 汇总与加权平均统计
  const totals = useMemo(() => {
    const sum = filteredRows.reduce(
      (acc, r) => {
        acc.totalTce += r.totalTce
        acc.totalCarbon += r.totalCarbon
        acc.waterM3 += r.waterM3
        // 加权累加
        acc.weightedNonFossil += r.nonFossilRatio * r.totalTce
        acc.weightedPhysical += r.physicalGreenRatio * r.totalTce
        acc.weightedEnva += r.energyPerNva * r.totalTce
        acc.weightedOutput += r.energyPerOutput * r.totalTce
        acc.weightedEquip += r.energySavingEquipRatio * r.totalTce
        acc.weightedFootprint += r.carbonFootprintAnalysisRatio * r.totalTce
        return acc
      },
      {
        totalTce: 0,
        totalCarbon: 0,
        waterM3: 0,
        weightedNonFossil: 0,
        weightedPhysical: 0,
        weightedEnva: 0,
        weightedOutput: 0,
        weightedEquip: 0,
        weightedFootprint: 0,
      },
    )

    const totalTce = sum.totalTce > 0 ? sum.totalTce : 1
    return {
      totalTce: Number(sum.totalTce.toFixed(1)),
      totalCarbon: Number(sum.totalCarbon.toFixed(1)),
      carbonPerTce: Number((sum.totalCarbon / totalTce).toFixed(3)),
      nonFossilRatio: Number((sum.weightedNonFossil / totalTce).toFixed(1)),
      physicalGreenRatio: Number((sum.weightedPhysical / totalTce).toFixed(1)),
      energyPerNva: Number((sum.weightedEnva / totalTce).toFixed(4)),
      energyPerOutput: Number((sum.weightedOutput / totalTce).toFixed(4)),
      waterM3: sum.waterM3,
      energySavingEquipRatio: Number((sum.weightedEquip / totalTce).toFixed(1)),
      carbonFootprintAnalysisRatio: Number((sum.weightedFootprint / totalTce).toFixed(1)),
    }
  }, [filteredRows])

  return (
    <div className="flex flex-col gap-3.5 w-full font-sans">
      {/* 顶部面包屑与操作栏 */}
      <div className="bg-card p-3.5 rounded-xl border border-border shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0">
            <Gauge className="size-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">单耗报表 (指标管控十参数)</h1>
          </div>
        </div>

        {/* 时间维度与导出工具栏 */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 时间维度切换 */}
          <div className="flex rounded-lg border border-border bg-panel p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setTimeDim('month')}
              className={cn(
                'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
                timeDim === 'month' ? 'font-bold bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              月度
            </button>
            <button
              type="button"
              onClick={() => setTimeDim('quarter')}
              className={cn(
                'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
                timeDim === 'quarter' ? 'font-bold bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              季度
            </button>
            <button
              type="button"
              onClick={() => setTimeDim('year')}
              className={cn(
                'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
                timeDim === 'year' ? 'font-bold bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              年度
            </button>
          </div>

          {/* 时间范围选择控件 */}
          {timeDim === 'month' && (
            <div className="flex items-center gap-1.5 bg-panel px-2.5 py-1 rounded-lg border border-border text-xs shadow-2xs font-mono">
              <Calendar className="size-3.5 text-muted-foreground shrink-0" />
              <input
                type="month"
                value={selectedMonthRange.start}
                onChange={(e) => setSelectedMonthRange((prev) => ({ ...prev, start: e.target.value }))}
                className="bg-transparent border-0 text-foreground text-xs focus:outline-none cursor-pointer"
                title="起始月份"
              />
              <span className="text-muted-foreground font-sans">至</span>
              <input
                type="month"
                value={selectedMonthRange.end}
                onChange={(e) => setSelectedMonthRange((prev) => ({ ...prev, end: e.target.value }))}
                className="bg-transparent border-0 text-foreground text-xs focus:outline-none cursor-pointer"
                title="结束月份"
              />
            </div>
          )}

          {timeDim === 'quarter' && (
            <div className="flex items-center gap-1.5 bg-panel px-2.5 py-1 rounded-lg border border-border text-xs shadow-2xs">
              <Calendar className="size-3.5 text-muted-foreground shrink-0" />
              <select
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value)}
                className="bg-panel border-0 text-foreground text-xs font-mono font-medium focus:outline-none cursor-pointer pr-1"
              >
                <option value="2026-Q1">2026年 第1季度 (Q1)</option>
                <option value="2026-Q2">2026年 第2季度 (Q2)</option>
                <option value="2026-Q3">2026年 第3季度 (Q3)</option>
                <option value="2026-Q4">2026年 第4季度 (Q4)</option>
                <option value="2025-Q4">2025年 第4季度 (Q4)</option>
              </select>
            </div>
          )}

          {timeDim === 'year' && (
            <div className="flex items-center gap-1.5 bg-panel px-2.5 py-1 rounded-lg border border-border text-xs shadow-2xs">
              <Calendar className="size-3.5 text-muted-foreground shrink-0" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-panel border-0 text-foreground text-xs font-mono font-medium focus:outline-none cursor-pointer pr-1"
              >
                <option value="2026">2026 年度</option>
                <option value="2025">2025 年度</option>
                <option value="2024">2024 年度</option>
              </select>
            </div>
          )}

          <button
            onClick={() => alert('正在导出单耗及指标管控明细台账 (Excel/PDF)...')}
            className="h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 hover:bg-primary/90 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="size-3.5" />
            <span>导出</span>
          </button>
        </div>
      </div>

      {/* 主数据报表 */}
      <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden flex flex-col">
        {/* 操作搜索栏 */}
        <div className="p-2.5 border-b border-border/60 bg-panel flex flex-wrap items-center justify-between gap-3 font-sans">
          <div className="flex flex-wrap items-center gap-3">
            {/* 所属企业下拉筛选 */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-foreground whitespace-nowrap">所属企业：</span>
              <select
                value={companyFilter}
                onChange={(e) => {
                  setCompanyFilter(e.target.value)
                  setUnitFilter('all') // 联动重置下属单位
                }}
                className="h-8 px-2.5 rounded-lg border border-border bg-panel text-xs text-foreground font-medium focus:outline-none focus:border-primary shadow-2xs cursor-pointer"
              >
                <option value="all">全部所属企业</option>
                {allCompanies.map((comp) => (
                  <option key={comp} value={comp}>
                    {comp}
                  </option>
                ))}
              </select>
            </div>

            {/* 所属单位下拉筛选 (带顶部模糊匹配搜索框，与企业联动) */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-foreground whitespace-nowrap">所属单位：</span>
              <SearchableUnitSelect
                options={availableUnits}
                value={unitFilter}
                onChange={(val) => setUnitFilter(val)}
                placeholder="全部所属单位"
              />
            </div>
          </div>
        </div>

        {/* 表格区域 */}
        <div className="overflow-x-auto custom-scrollbar">
          {filteredRows.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground text-xs flex flex-col items-center gap-2">
              <div>暂无匹配的单耗指标数据</div>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-panel text-muted-foreground border-b border-border font-bold select-none text-[11px] font-sans">
                  {/* 固定左侧前两列 */}
                  <th className="py-2.5 px-3 sticky left-0 bg-panel z-10 min-w-[110px] text-center border-r border-border/60">
                    企业名称
                  </th>
                  <th className="py-2.5 px-3 sticky left-[110px] bg-panel z-10 min-w-[160px] border-r border-border/60">
                    单位名称
                  </th>

                  {/* 10 个管控指标参数表头（带提示与单位） */}
                  {INDICATOR_METAS.map((meta) => (
                    <th
                      key={meta.key}
                      onClick={() => setSelectedIndicator(meta)}
                      className="py-2.5 px-2.5 min-w-[115px] text-right font-bold text-muted-foreground hover:bg-accent/30 cursor-pointer transition-colors group"
                      title="点击查看指标计算公式与管控要求"
                    >
                      <div className="flex flex-col items-end gap-0.5">
                        <div className="flex items-center gap-1">
                          <span className="group-hover:text-primary transition-colors">{meta.name}</span>
                          <Info className="size-3 text-muted-foreground group-hover:text-primary shrink-0" />
                        </div>
                        <span className="text-[10px] font-normal text-muted-foreground font-mono">({meta.unit})</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-border/60 text-foreground font-mono text-[11.5px]">
                {filteredRows.map((row, idx) => {
                  const span = companyRowSpans[idx]
                  return (
                    <tr key={row.id} className="hover:bg-accent/30 transition-colors group">
                      {/* 企业名称单元格 (同企业行跨行合并居中) */}
                      {span > 0 && (
                        <td
                          rowSpan={span}
                          className="py-2.5 px-3 font-bold text-foreground bg-card border-r border-b border-border text-center align-middle font-sans shadow-2xs sticky left-0 z-5"
                        >
                          <div className="inline-flex items-center justify-center font-bold text-foreground">
                            {row.company}
                          </div>
                        </td>
                      )}

                      {/* 单位名称单元格 */}
                      <td className="py-2.5 px-3 font-sans font-medium text-foreground sticky left-[110px] bg-card group-hover:bg-accent/40 border-r border-border/80 z-5">
                        <div className="truncate max-w-[200px]" title={row.unitName}>
                          {row.unitName}
                        </div>
                      </td>

                      {/* 1. 综合能源消费量 (tce) */}
                      <td
                        onClick={() => setSelectedRowDetail({ row, indicator: INDICATOR_METAS[0] })}
                        className="py-2.5 px-2.5 text-right font-semibold text-primary hover:underline cursor-pointer"
                        title="点击查看综合能耗构成"
                      >
                        {row.totalTce.toLocaleString('zh-CN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                      </td>

                      {/* 2. 总碳排放量 (tCO2) */}
                      <td
                        onClick={() => setSelectedRowDetail({ row, indicator: INDICATOR_METAS[1] })}
                        className="py-2.5 px-2.5 text-right font-medium text-foreground hover:underline cursor-pointer"
                        title="点击查看碳排放明细"
                      >
                        {row.totalCarbon.toLocaleString('zh-CN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                      </td>

                      {/* 3. 单位能耗碳排放 (tCO2/tce) */}
                      <td className="py-2.5 px-2.5 text-right font-medium text-muted-foreground">
                        {row.carbonPerTce.toFixed(3)}
                      </td>

                      {/* 4. 非化石能源消费占比 (%) */}
                      <td className="py-2.5 px-2.5 text-right font-semibold text-emerald-400">
                        {row.nonFossilRatio.toFixed(1)}%
                      </td>

                      {/* 5. 非化石电力物理认购占比 (%) */}
                      <td className="py-2.5 px-2.5 text-right font-medium text-emerald-400">
                        {row.physicalGreenRatio.toFixed(1)}%
                      </td>

                      {/* 6. 单位工业增加值能耗 (tce/万元) */}
                      <td className="py-2.5 px-2.5 text-right font-medium text-foreground">
                        {row.energyPerNva.toFixed(4)}
                      </td>

                      {/* 7. 单位产值能耗 (tce/万元) */}
                      <td className="py-2.5 px-2.5 text-right font-medium text-foreground">
                        {row.energyPerOutput.toFixed(4)}
                      </td>

                      {/* 8. 水资源消耗量 (t) */}
                      <td className="py-2.5 px-2.5 text-right font-medium text-muted-foreground">
                        {row.waterM3.toLocaleString('zh-CN')}
                      </td>

                      {/* 9. 节能装备应用占比 (%) */}
                      <td className="py-2.5 px-2.5 text-right font-medium text-purple-400">
                        {row.energySavingEquipRatio.toFixed(1)}%
                      </td>

                      {/* 10. 开展产品碳足迹分析占比 (%) */}
                      <td className="py-2.5 px-2.5 text-right font-medium text-primary">
                        {row.carbonFootprintAnalysisRatio.toFixed(1)}%
                      </td>
                    </tr>
                  )
                })}
              </tbody>

              {/* 汇总统计行 */}
              <tfoot>
                <tr className="bg-panel font-bold border-t-2 border-border text-foreground font-mono text-[11.5px]">
                  <td colSpan={2} className="py-3 px-3 text-center font-sans font-bold sticky left-0 bg-panel z-10 border-r border-border">
                    全集团总计汇总 / 集团加权平均
                  </td>
                  {/* 1. 综合能源消费量 (tce) */}
                  <td className="py-3 px-2.5 text-right text-primary">
                    {totals.totalTce.toLocaleString('zh-CN', { minimumFractionDigits: 1 })}
                  </td>
                  {/* 2. 总碳排放量 (tCO2) */}
                  <td className="py-3 px-2.5 text-right text-foreground">
                    {totals.totalCarbon.toLocaleString('zh-CN', { minimumFractionDigits: 1 })}
                  </td>
                  {/* 3. 单位能耗碳排放 (tCO2/tce) */}
                  <td className="py-3 px-2.5 text-right text-muted-foreground">
                    {totals.carbonPerTce.toFixed(3)}
                  </td>
                  {/* 4. 非化石能源消费占比 (%) */}
                  <td className="py-3 px-2.5 text-right text-emerald-400">
                    {totals.nonFossilRatio.toFixed(1)}%
                  </td>
                  {/* 5. 非化石电力物理认购占比 (%) */}
                  <td className="py-3 px-2.5 text-right text-emerald-400">
                    {totals.physicalGreenRatio.toFixed(1)}%
                  </td>
                  {/* 6. 单位工业增加值能耗 (tce/万元) */}
                  <td className="py-3 px-2.5 text-right text-foreground">
                    {totals.energyPerNva.toFixed(4)}
                  </td>
                  {/* 7. 单位产值能耗 (tce/万元) */}
                  <td className="py-3 px-2.5 text-right text-foreground">
                    {totals.energyPerOutput.toFixed(4)}
                  </td>
                  {/* 8. 水资源消耗量 (t) */}
                  <td className="py-3 px-2.5 text-right text-muted-foreground">
                    {totals.waterM3.toLocaleString('zh-CN')}
                  </td>
                  {/* 9. 节能装备应用占比 (%) */}
                  <td className="py-3 px-2.5 text-right text-purple-400">
                    {totals.energySavingEquipRatio.toFixed(1)}%
                  </td>
                  {/* 10. 开展产品碳足迹分析占比 (%) */}
                  <td className="py-3 px-2.5 text-right text-primary">
                    {totals.carbonFootprintAnalysisRatio.toFixed(1)}%
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>

      {/* 💡 指标定义与管控标准快速详情弹窗 */}
      {selectedIndicator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-card rounded-xl shadow-2xl border border-border max-w-lg w-full p-5 flex flex-col gap-4 font-sans text-foreground">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                  <Gauge className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{selectedIndicator.name}</h3>
                  <span className="text-[10px] font-medium text-primary bg-primary/20 border border-primary/30 px-1.5 py-0.5 rounded">
                    {selectedIndicator.tag}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedIndicator(null)}
                className="size-7 rounded-lg hover:bg-accent/40 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs text-muted-foreground">
              <div>
                <span className="font-bold text-foreground block mb-0.5">指标含义与定义：</span>
                <p className="bg-panel p-2.5 rounded-lg border border-border leading-relaxed text-foreground">
                  {selectedIndicator.description}
                </p>
              </div>

              <div>
                <span className="font-bold text-foreground block mb-0.5">计算公式与核算模型：</span>
                <p className="bg-panel p-2.5 rounded-lg border border-border font-mono text-[11px] text-primary leading-relaxed">
                  {selectedIndicator.formula}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-lg border border-border bg-panel">
                  <span className="text-[11px] text-muted-foreground block">计量单位</span>
                  <span className="text-xs font-bold text-foreground font-mono">{selectedIndicator.unit}</span>
                </div>
                <div className="p-2.5 rounded-lg border border-border bg-panel">
                  <span className="text-[11px] text-muted-foreground block">管控基准标准值</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">{selectedIndicator.benchmark}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedIndicator(null)}
                className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 shadow-xs transition-colors cursor-pointer"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📊 单位指标明细穿透弹窗 */}
      {selectedRowDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-card rounded-xl shadow-2xl border border-border max-w-lg w-full p-5 flex flex-col gap-4 font-sans text-foreground">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <div className="text-xs text-muted-foreground font-medium">
                  {selectedRowDetail.row.company} · {selectedRowDetail.row.unitName}
                </div>
                <h3 className="text-sm font-bold text-foreground mt-0.5">
                  {selectedRowDetail.indicator.name} 监测详情
                </h3>
              </div>
              <button
                onClick={() => setSelectedRowDetail(null)}
                className="size-7 rounded-lg hover:bg-accent/40 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-panel border border-border flex flex-col gap-1">
                <span className="text-xs text-primary font-medium">当前统计期数值</span>
                <span className="text-lg font-bold text-primary font-mono">
                  {String((selectedRowDetail.row as any)[selectedRowDetail.indicator.key])} {selectedRowDetail.indicator.unit}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-panel border border-border flex flex-col gap-1">
                <span className="text-xs text-emerald-400 font-medium">管控目标与基准</span>
                <span className="text-lg font-bold text-emerald-400 font-mono">
                  {selectedRowDetail.indicator.benchmark}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-xs text-muted-foreground">
              <span className="font-bold text-foreground">计算公式：</span>
              <p className="bg-panel p-2.5 rounded-lg border border-border font-mono text-[11px] text-foreground">
                {selectedRowDetail.indicator.formula}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedRowDetail(null)}
                className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 shadow-xs transition-colors cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
