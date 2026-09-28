export type GranularityOption = 'day' | 'month' | 'year'

export interface CustomIndicatorItem {
  id: string
  code: string
  name: string
  category: string
  unit: string
  granularity: GranularityOption
  formulaExpr: string
  formulaDisplay: string
  baseDataCodes: string[]
  baseDataNames: string[]
  currentValue: number
  yoyRate: string
  momRate: string
  benchmarkValue: number
  desc: string
  updatedAt: string
}

export interface IndicatorTimeSeriesPoint {
  time: string
  value: number
  benchmark: number
  numeratorName?: string
  numeratorVal?: number
  denominatorName?: string
  denominatorVal?: number
  [key: string]: any
}

export interface CustomIndicatorLedgerItem {
  id: string
  timestamp: string
  code: string
  name: string
  value: number
  unit: string
  granularity: string
  baseDataDetail: string
  yoy: string
  mom: string
}

export const INITIAL_CUSTOM_INDICATORS: CustomIndicatorItem[] = [
  {
    id: 'cust-01',
    code: 'CUST-IND-001',
    name: '全厂万元产值综合电耗',
    category: '能效单耗类',
    unit: 'kWh/万元',
    granularity: 'day',
    formulaExpr: '[EN-001] / [OUT-001]',
    formulaDisplay: '电力消费量(kWh) ÷ 工业总产值(万元)',
    baseDataCodes: ['EN-001', 'OUT-001'],
    baseDataNames: ['电力消费量', '工业总产值'],
    currentValue: 186.5,
    yoyRate: '-3.8% ↓',
    momRate: '+0.4% ↑',
    benchmarkValue: 195.0,
    desc: '衡量企业或车间单位产值所耗费的全部电量强度，反映宏观电气化效率与电能产出比。',
    updatedAt: '2026-09-22 11:30',
  },
  {
    id: 'cust-02',
    code: 'CUST-IND-002',
    name: '分布式光伏绿电自消纳率',
    category: '绿电微网类',
    unit: '%',
    granularity: 'day',
    formulaExpr: '([EN-001] - [EN-002]) / [EN-001] * 100',
    formulaDisplay: '(电力消费量 - 市电消费量) ÷ 电力消费量 × 100',
    baseDataCodes: ['EN-001', 'EN-002'],
    baseDataNames: ['电力消费量', '市电消费量'],
    currentValue: 38.4,
    yoyRate: '+5.2% ↑',
    momRate: '+1.1% ↑',
    benchmarkValue: 35.0,
    desc: '分布式光伏发电直接在厂区内部被负荷消纳的电量比例。',
    updatedAt: '2026-09-22 11:45',
  },
  {
    id: 'cust-03',
    code: 'CUST-IND-003',
    name: '关键干燥工序吨蒸汽消耗',
    category: '工序单耗类',
    unit: 't/t',
    granularity: 'month',
    formulaExpr: '[EN-007] / [OUT-002]',
    formulaDisplay: '蒸汽消费量(质量) ÷ 合格产品产量',
    baseDataCodes: ['EN-007', 'OUT-002'],
    baseDataNames: ['蒸汽消费量(质量)', '合格产品产量'],
    currentValue: 0.38,
    yoyRate: '-6.2% ↓',
    momRate: '-0.8% ↓',
    benchmarkValue: 0.42,
    desc: '针对变压器真空注油及气相干燥等高热耗工艺，监测每生产一吨合格品所耗费的外购蒸汽量。',
    updatedAt: '2026-09-22 10:00',
  },
  {
    id: 'cust-04',
    code: 'CUST-IND-004',
    name: '单位产品折标煤综合单耗',
    category: '能源消费类',
    unit: 'tce/t',
    granularity: 'month',
    formulaExpr: '[EN-013] / [OUT-002]',
    formulaDisplay: '综合能源消费量 ÷ 合格产品产量',
    baseDataCodes: ['EN-013', 'OUT-002'],
    baseDataNames: ['综合能源消费量', '合格产品产量'],
    currentValue: 0.142,
    yoyRate: '-2.5% ↓',
    momRate: '+0.2% ↑',
    benchmarkValue: 0.150,
    desc: '将电、气、汽、油等全要素能源统一折算为标准煤后的单位实物产量综合能耗，月度核算结算基准。',
    updatedAt: '2026-09-22 09:00',
  },
  {
    id: 'cust-05',
    code: 'CUST-IND-005',
    name: '万元产值综合碳排放强度',
    category: '碳排合规类',
    unit: 'tCO2/万元',
    granularity: 'year',
    formulaExpr: '[CAR-001] / [OUT-001]',
    formulaDisplay: '综合碳排放量 ÷ 工业总产值',
    baseDataCodes: ['CAR-001', 'OUT-001'],
    baseDataNames: ['综合碳排放量', '工业总产值'],
    currentValue: 0.124,
    yoyRate: '-4.6% ↓',
    momRate: '-0.3% ↓',
    benchmarkValue: 0.135,
    desc: '核算单位工业总产值对应的范围一和范围二温室气体净排放强度，支撑 ESG 披露与绿色财报。',
    updatedAt: '2026-09-22 11:15',
  },
]

export const GRANULARITY_OPTIONS = [
  { key: 'day' as GranularityOption, label: '日' },
  { key: 'month' as GranularityOption, label: '月' },
  { key: 'year' as GranularityOption, label: '年' },
]

// 模拟时序曲线生成算法 (纯确定性数学波动，杜绝 Math.random() 引起的服务端/客户端 Hydration 水合不一致)
export function generateIndicatorTrend(
  indicator: CustomIndicatorItem,
  granularity: GranularityOption,
  factoryId: string = 'all'
): IndicatorTimeSeriesPoint[] {
  const base = indicator.currentValue || 100
  const bench = indicator.benchmarkValue || base * 1.05

  // 根据指标和工厂生成确定性种子
  const seedStr = `${indicator.id || indicator.code}_${factoryId}`
  const seed = seedStr.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const factor = 0.95 + (seed % 10) * 0.01

  if (granularity === 'day') {
    const points: IndicatorTimeSeriesPoint[] = []
    for (let i = 1; i <= 30; i++) {
      const time = `08-${String(i).padStart(2, '0')}`
      // 采用确定性正余弦复合波动，避免 SSR 与 Client 生成不一致
      const wave = Math.cos(i * 0.28 + (seed % 5)) * (base * 0.08)
      const microWave = Math.sin(i * 1.7) * (base * 0.02)
      const val = Number((base * factor + wave + microWave).toFixed(2))
      const denomVariation = Math.cos(i * 0.45) * 45
      points.push({
        time,
        value: Math.max(0.01, val),
        benchmark: Number((bench * factor).toFixed(2)),
        numeratorName: indicator.baseDataNames[0] || '分子参数',
        numeratorVal: Number((val * 1500).toFixed(1)),
        denominatorName: indicator.baseDataNames[1] || '分母参数',
        denominatorVal: Number((1500 + denomVariation).toFixed(1)),
      })
    }
    return points
  }

  if (granularity === 'month') {
    const points: IndicatorTimeSeriesPoint[] = []
    for (let i = 1; i <= 12; i++) {
      const time = `${i}月`
      const wave = Math.sin(i * 0.5 + (seed % 3)) * (base * 0.12)
      const val = Number((base * factor + wave).toFixed(2))
      const denomVariation = Math.sin(i * 0.6) * 600
      points.push({
        time,
        value: Math.max(0.01, val),
        benchmark: Number((bench * factor).toFixed(2)),
        numeratorName: indicator.baseDataNames[0] || '分子参数',
        numeratorVal: Number((val * 35000).toFixed(1)),
        denominatorName: indicator.baseDataNames[1] || '分母参数',
        denominatorVal: Number((35000 + denomVariation).toFixed(1)),
      })
    }
    return points
  }

  // year
  const points: IndicatorTimeSeriesPoint[] = []
  const currentYear = 2026
  for (let i = 4; i >= 0; i--) {
    const yr = currentYear - i
    const time = `${yr}年`
    const wave = Math.sin((5 - i) * 0.6 + (seed % 4)) * (base * 0.12)
    const val = Number((base * factor + wave).toFixed(2))
    const denomVariation = Math.sin((5 - i) * 0.5) * 8000
    points.push({
      time,
      value: Math.max(0.01, val),
      benchmark: Number((bench * factor).toFixed(2)),
      numeratorName: indicator.baseDataNames[0] || '分子参数',
      numeratorVal: Number((val * 420000).toFixed(1)),
      denominatorName: indicator.baseDataNames[1] || '分母参数',
      denominatorVal: Number((420000 + denomVariation).toFixed(1)),
    })
  }
  return points
}

// 模拟生成明细台账 (纯确定性正弦余弦波动，无 Math.random())
export function generateIndicatorLedger(
  indicator: CustomIndicatorItem,
  granularity: GranularityOption,
  factoryName: string = '沈变本部'
): CustomIndicatorLedgerItem[] {
  const points = generateIndicatorTrend(indicator, granularity, factoryName).slice(-15).reverse()
  return points.map((p, idx) => {
    const yoyCalc = (Math.sin(idx * 1.3 + 0.8) * 3.6 - 0.5).toFixed(1)
    const momCalc = (Math.cos(idx * 1.5 + 0.3) * 2.2).toFixed(1)
    const yoyNum = Number(yoyCalc)
    const momNum = Number(momCalc)
    return {
      id: `led-${idx + 1}`,
      timestamp:
        granularity === 'day'
          ? `2026-${p.time}`
          : granularity === 'month'
          ? `2026年${p.time}`
          : `${p.time}`,
      code: indicator.code,
      name: indicator.name,
      value: p.value,
      unit: indicator.unit,
      granularity: GRANULARITY_OPTIONS.find((g) => g.key === granularity)?.label || '日',
      baseDataDetail: `${p.numeratorName}: ${p.numeratorVal?.toLocaleString()} | ${p.denominatorName}: ${p.denominatorVal?.toLocaleString()}`,
      yoy: `${yoyNum >= 0 ? '+' : ''}${yoyCalc}% ${yoyNum < 0 ? '↓' : '↑'}`,
      mom: `${momNum >= 0 ? '+' : ''}${momCalc}% ${momNum < 0 ? '↓' : '↑'}`,
    }
  })
}
