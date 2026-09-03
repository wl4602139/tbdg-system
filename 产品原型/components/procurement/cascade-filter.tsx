'use client'

import { Toolbar } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import { ComboBox } from '@/components/shared/combobox'
import { industries, linesOf, categoriesOf, modelsOf } from '@/lib/procurement'

export type CascadeSel = { ind: string; line: string; cat: string; model: string }

/** 初始化一个合法的级联选择 */
export function initCascade(ind = '变压器'): CascadeSel {
  const line = linesOf(ind)[0]
  const cat = categoriesOf(ind, line)[0]
  const model = modelsOf(ind, line, cat)[0]
  return { ind, line, cat, model }
}

/**
 * 级联筛选：产业 → 产线 → 产品类别 → 产品型号
 * 上游变化时自动重置下游为首项，型号支持模糊查询。
 * showModel=false 时（如纵向对比按类别聚合）隐藏型号。
 */
export function CascadeFilter({
  value,
  onChange,
  showModel = true,
  time,
  children,
}: {
  value: CascadeSel
  onChange: (v: CascadeSel) => void
  showModel?: boolean
  time?: React.ReactNode
  children?: React.ReactNode
}) {
  const lines = linesOf(value.ind)
  const cats = categoriesOf(value.ind, value.line)
  const models = modelsOf(value.ind, value.line, value.cat)

  function setInd(ind: string) {
    onChange(initCascade(ind))
  }
  function setLine(line: string) {
    const cat = categoriesOf(value.ind, line)[0]
    const model = modelsOf(value.ind, line, cat)[0]
    onChange({ ind: value.ind, line, cat, model })
  }
  function setCat(cat: string) {
    const model = modelsOf(value.ind, value.line, cat)[0]
    onChange({ ...value, cat, model })
  }
  function setModel(model: string) {
    onChange({ ...value, model })
  }

  return (
    <Toolbar>
      <Select label="产业" value={value.ind} onChange={setInd} options={industries.map((v) => ({ label: v, value: v }))} />
      <Select label="产线" value={value.line} onChange={setLine} options={lines.map((v) => ({ label: v, value: v }))} />
      <Select label="产品类别" value={value.cat} onChange={setCat} options={cats.map((v) => ({ label: v, value: v }))} />
      {time}
      {showModel && <ComboBox label="产品型号" value={value.model} options={models} onChange={setModel} />}
      {children && <div className="ml-auto flex items-center gap-2">{children}</div>}
    </Toolbar>
  )
}

/** 时间筛选：统一为自由区间选择（起始月 → 结束月），查询结果按所选区间排序 */
export function TimeFilter({
  from,
  to,
  onFrom,
  onTo,
}: {
  from: string
  to: string
  onFrom: (v: string) => void
  onTo: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="whitespace-nowrap text-xs text-muted-foreground">时间</span>
      <input
        type="month"
        value={from}
        max={to}
        onChange={(e) => onFrom(e.target.value)}
        className="h-9 rounded-md border border-border bg-panel px-3 text-sm text-foreground outline-none [color-scheme:dark] focus:ring-2 focus:ring-ring"
      />
      <span className="text-xs text-muted-foreground">至</span>
      <input
        type="month"
        value={to}
        min={from}
        onChange={(e) => onTo(e.target.value)}
        className="h-9 rounded-md border border-border bg-panel px-3 text-sm text-foreground outline-none [color-scheme:dark] focus:ring-2 focus:ring-ring"
      />
    </div>
  )
}
