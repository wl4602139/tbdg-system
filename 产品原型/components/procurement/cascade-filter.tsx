'use client'

import { Toolbar } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import { ComboBox } from '@/components/shared/combobox'
import { industries, categoriesOfInd, modelsOfIndCat, projectCompaniesOf, ALL_COMPANIES } from '@/lib/procurement'

export type CascadeSel = { ind: string; company: string; cat: string; model: string }

/** 初始化一个合法的级联选择（项目公司默认“全部”） */
export function initCascade(ind = '变压器'): CascadeSel {
  const cat = categoriesOfInd(ind)[0]
  const model = modelsOfIndCat(ind, cat)[0]
  return { ind, company: ALL_COMPANIES, cat, model }
}

/**
 * 筛选：时间 → 产业 → 项目公司 → 产品类别 → 产品型号
 * 时间置于最前；项目公司为独立的经营单位范围筛选，不影响类别/型号级联。
 * 产业变化时重置项目公司为“全部”并重置下游类别/型号；类别变化时重置型号。
 * showModel=false 时（如按类别聚合）隐藏型号。
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
  const companies = projectCompaniesOf(value.ind)
  const cats = categoriesOfInd(value.ind)
  const models = modelsOfIndCat(value.ind, value.cat)

  function setInd(ind: string) {
    onChange(initCascade(ind))
  }
  function setCompany(company: string) {
    onChange({ ...value, company })
  }
  function setCat(cat: string) {
    const model = modelsOfIndCat(value.ind, cat)[0]
    onChange({ ...value, cat, model })
  }
  function setModel(model: string) {
    onChange({ ...value, model })
  }

  return (
    <Toolbar>
      {time}
      <Select label="产业" value={value.ind} onChange={setInd} options={industries.map((v) => ({ label: v, value: v }))} />
      <Select label="项目公司" value={value.company} onChange={setCompany} options={companies.map((v) => ({ label: v, value: v }))} />
      <Select label="产品类别" value={value.cat} onChange={setCat} options={cats.map((v) => ({ label: v, value: v }))} />
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
