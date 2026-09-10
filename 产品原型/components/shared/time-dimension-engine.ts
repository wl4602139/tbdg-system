/**
 * 特变电工能碳数字化双中心 · 工业时序聚合引擎 (Time Dimension Engine)
 * 遵循国家双碳核算规范与 tbea-industrial-design 设计系统
 * 提供月度、季度、年度、日度维度的时序比例缩放、语义标签生成与指标动态自适应
 */

export type TimeDimension = 'day' | 'month' | 'quarter' | 'year'

export interface TimeDimensionParams {
  timeDim?: TimeDimension
  // 月度范围选择
  selectedMonthRange?: { start: string; end: string }
  monthRange?: { start: string; end: string }
  // 单月选择
  selectedMonth?: string
  month?: string
  // 季度选择
  selectedQuarter?: string
  quarter?: string
  // 年度选择
  selectedYear?: string
  year?: string
  // 日期范围
  selectedDateRange?: { start: string; end: string }
  dateRange?: { start: string; end: string }
  // 单日选择
  selectedDate?: string
  date?: string
}

export interface ScaleOptions {
  /**
   * 基准口径：
   * 'month': 静态数据为单月基准 (默认)
   * 'monthRange8': 静态数据为 2026-01 至 2026-08 (8个月累计) 基准
   * 'year': 静态数据为全年基准
   */
  basePeriod?: 'month' | 'monthRange8' | 'year'
}

// 工业负荷月份权重矩阵 (以 2026-08 为标准 1.0 基准，反映夏冬用能高峰与春节淡季)
export const MONTHLY_WEIGHTS: Record<string, number> = {
  '01': 1.05, // 冬季采暖与保供
  '02': 0.82, // 春节假期与检修
  '03': 0.96, // 节后复产
  '04': 0.98, // 稳产期
  '05': 1.02, // 满负荷
  '06': 1.06, // 初夏备汛
  '07': 1.14, // 迎峰度夏负荷顶峰
  '08': 1.12, // 夏季高温制冷高峰 (基准月)
  '09': 1.04, // 秋季平水期
  '10': 0.97, // 国庆排产
  '11': 1.03, // 初冬
  '12': 1.10, // 年末冲刺与冬季负荷
}

/**
 * 解析当前维度下包含的自然月份清单 (YYYY-MM)
 */
export function resolveMonthsList(
  timeDim: TimeDimension,
  params: TimeDimensionParams = {}
): string[] {
  const monthRange = params.selectedMonthRange || params.monthRange
  const singleMonth = params.selectedMonth || params.month
  const quarter = params.selectedQuarter || params.quarter
  const year = params.selectedYear || params.year

  if (timeDim === 'month') {
    if (singleMonth) {
      return [singleMonth]
    }
    const start = monthRange?.start || '2026-01'
    const end = monthRange?.end || '2026-08'
    const [sYear, sMonth] = start.split('-').map(Number)
    const [eYear, eMonth] = end.split('-').map(Number)

    const result: string[] = []
    let curY = sYear
    let curM = sMonth

    while (curY < eYear || (curY === eYear && curM <= eMonth)) {
      result.push(`${curY}-${curM < 10 ? '0' + curM : curM}`)
      curM++
      if (curM > 12) {
        curM = 1
        curY++
      }
    }
    return result.length > 0 ? result : ['2026-08']
  }

  if (timeDim === 'quarter') {
    const qStr = quarter || '2026-Q3'
    const [y, q] = qStr.split('-')
    const qNum = parseInt(q?.replace('Q', '') || '3', 10)
    const qMonthsMap: Record<number, string[]> = {
      1: ['01', '02', '03'],
      2: ['04', '05', '06'],
      3: ['07', '08', '09'],
      4: ['10', '11', '12'],
    }
    const months = qMonthsMap[qNum] || ['07', '08', '09']
    return months.map((m) => `${y}-${m}`)
  }

  if (timeDim === 'year') {
    const y = year || '2026'
    return Array.from({ length: 12 }, (_, i) => {
      const m = i + 1
      return `${y}-${m < 10 ? '0' + m : m}`
    })
  }

  return ['2026-08']
}

/**
 * 计算当前维度相对于基准的放大倍数或微调系数
 * @param metricType 'sum' (累计总量型: 能耗、碳排、费用、产值) | 'intensity' (强度/比率型: 单耗、绿电占比)
 */
export function getPeriodScaleFactor(
  metricType: 'sum' | 'intensity',
  timeDim: TimeDimension,
  params: TimeDimensionParams = {},
  options?: ScaleOptions
): number {
  // 日维度处理
  if (timeDim === 'day') {
    const dr = params.selectedDateRange || params.dateRange
    if (dr?.start && dr?.end) {
      const t1 = new Date(dr.start).getTime()
      const t2 = new Date(dr.end).getTime()
      const days = Math.max(1, Math.round((t2 - t1) / (1000 * 3600 * 24)) + 1)
      if (metricType === 'sum') {
        // 相对于 1 天的比例
        return days
      }
      return 1.0
    }
    return 1.0
  }

  const months = resolveMonthsList(timeDim, params)
  const baseMonthWeight = MONTHLY_WEIGHTS['08'] || 1.12
  // Jan-Aug 2026 (8个月) 累计权重之和约为 8.15
  const base8MonthWeight = 8.15

  // 年份调整因子 (2024能耗 > 2025 > 2026 技术改造递进)
  const yearStr = params.selectedYear || params.year || (months[0] ? months[0].split('-')[0] : '2026')
  const yearNum = parseInt(yearStr, 10)
  const yearFactor = yearNum === 2024 ? 1.08 : yearNum === 2025 ? 1.04 : 1.0

  if (metricType === 'sum') {
    const totalWeights = months.reduce((acc, ym) => {
      const m = ym.split('-')[1] || '08'
      return acc + (MONTHLY_WEIGHTS[m] || 1.0)
    }, 0)

    if (options?.basePeriod === 'monthRange8') {
      return (totalWeights / base8MonthWeight) * yearFactor
    }
    return (totalWeights / baseMonthWeight) * yearFactor
  }

  // 强度比率型
  const avgWeight =
    months.reduce((acc, ym) => {
      const m = ym.split('-')[1] || '08'
      return acc + (MONTHLY_WEIGHTS[m] || 1.0)
    }, 0) / months.length
  
  const intensityYearFactor = yearNum === 2024 ? 1.06 : yearNum === 2025 ? 1.03 : 1.0
  return (1.0 + (avgWeight - baseMonthWeight) * 0.05) * intensityYearFactor
}

/**
 * 获取当前时间周期的可读语义标签
 */
export function getTimeDimensionName(timeDim: TimeDimension): string {
  switch (timeDim) {
    case 'day': return '日度'
    case 'quarter': return '季度'
    case 'year': return '年度'
    case 'month':
    default:
      return '月度'
  }
}

export function getTimeDimensionLabel(
  timeDim: TimeDimension,
  params: TimeDimensionParams = {}
): string {
  const monthRange = params.selectedMonthRange || params.monthRange
  const singleMonth = params.selectedMonth || params.month
  const quarter = params.selectedQuarter || params.quarter
  const year = params.selectedYear || params.year
  const dateRange = params.selectedDateRange || params.dateRange
  const singleDate = params.selectedDate || params.date

  if (timeDim === 'day') {
    if (dateRange) return `${dateRange.start} 至 ${dateRange.end}`
    if (singleDate) return singleDate
    return '当日'
  }

  if (timeDim === 'month') {
    if (singleMonth) {
      const [y, m] = singleMonth.split('-')
      return `${y}年${m}月`
    }
    const start = monthRange?.start || '2026-01'
    const end = monthRange?.end || '2026-08'
    if (start === end) {
      const [y, m] = start.split('-')
      return `${y}年${m}月 (当月)`
    }
    const [sy, sm] = start.split('-')
    const [ey, em] = end.split('-')
    const count = resolveMonthsList('month', params).length
    return `${sy}年${sm}月 至 ${ey}年${em}月 (${count}个月)`
  }

  if (timeDim === 'quarter') {
    const qStr = quarter || '2026-Q3'
    const [y, q] = qStr.split('-')
    return `${y}年 第${q?.replace('Q', '')}季度 (${q}累计)`
  }

  if (timeDim === 'year') {
    const y = year || '2026'
    return `${y} 年度`
  }

  return '当前统计周期'
}

/**
 * 获取对应维度的图例/表格单位后缀
 */
export function getTimeDimensionSuffix(timeDim: TimeDimension): string {
  switch (timeDim) {
    case 'day':
      return '/日'
    case 'month':
      return '/月'
    case 'quarter':
      return '/季'
    case 'year':
      return '/年'
    default:
      return ''
  }
}

/**
 * 对带千分符或纯数字字符串进行时序缩放并保持标准格式
 */
export function scaleFormattedNumber(
  valStr: string | number,
  factor: number,
  fixedDecimals?: number
): string {
  if (typeof valStr === 'number') {
    const res = valStr * factor
    return fixedDecimals !== undefined ? res.toFixed(fixedDecimals) : res.toLocaleString()
  }

  const clean = valStr.replace(/,/g, '').trim()
  const num = parseFloat(clean)
  if (isNaN(num)) return valStr

  const scaled = num * factor

  let decimals = fixedDecimals
  if (decimals === undefined) {
    const parts = clean.split('.')
    decimals = parts.length > 1 ? parts[1].length : 0
  }

  const rounded = scaled.toFixed(decimals)
  const [intPart, decPart] = rounded.split('.')
  const withCommas = parseInt(intPart, 10).toLocaleString()

  return decPart !== undefined ? `${withCommas}.${decPart}` : withCommas
}
