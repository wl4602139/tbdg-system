/**
 * 让下拉/筛选项能确定性地改变展示数据的工具。
 * 同一组筛选值 → 同一份结果（可信、稳定），切换筛选值 → 数据随之变化。
 */

/* 由任意字符串生成 0.72 ~ 1.28 之间的确定性系数 */
export function seedFactor(...seeds: (string | number)[]): number {
  const s = seeds.join('|')
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) & 0xffffffff
  }
  const frac = (Math.abs(h) % 1000) / 1000 // 0 ~ 0.999
  return 0.72 + frac * 0.56 // 0.72 ~ 1.28
}

/* 按有效数字合理地保留小数位 */
function round(v: number): number {
  const a = Math.abs(v)
  if (a >= 100) return Math.round(v)
  if (a >= 10) return Math.round(v * 10) / 10
  if (a >= 1) return Math.round(v * 100) / 100
  return Math.round(v * 1000) / 1000
}

/**
 * 按系数缩放行数据里的数值字段。
 * @param rows  原始数据
 * @param factor  缩放系数（一般来自 seedFactor）
 * @param opts.skip  不缩放的字段（如枚举、标签、百分比等）
 * @param opts.only  仅缩放这些字段（优先级高于 skip）
 */
export function vary<T extends Record<string, any>>(
  rows: T[],
  factor: number,
  opts: { skip?: string[]; only?: string[] } = {},
): T[] {
  const { skip = [], only } = opts
  return rows.map((row) => {
    const next: Record<string, any> = { ...row }
    for (const key of Object.keys(row)) {
      if (typeof row[key] !== 'number') continue
      if (only && !only.includes(key)) continue
      if (!only && skip.includes(key)) continue
      next[key] = round(row[key] * factor)
    }
    return next as T
  })
}

/* 缩放单个数值并格式化为字符串（用于 KPI 卡） */
export function varyNum(value: number, factor: number): number {
  return round(value * factor)
}
