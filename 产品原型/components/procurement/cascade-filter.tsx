'use client'

import { Toolbar } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import { ComboBox } from '@/components/shared/combobox'
import {
  industries,
  majorCategoriesOf,
  mediumCategoriesOf,
  modelsOf,
  projectCompaniesOf,
  ALL_COMPANIES,
} from '@/lib/procurement'

export type CascadeSel = {
  ind: string
  company: string
  majorCat: string
  mediumCat: string
  model: string
  cat?: string
}

/** 初始化一个合法的级联选择（产业默认“变压器”，项目公司默认“全部”） */
export function initCascade(ind = '变压器'): CascadeSel {
  const normInd = (ind === '电器' || ind === '开关') ? '变压器' : ind
  const majorCats = majorCategoriesOf(normInd)
  const majorCat = majorCats[0] || (normInd === '线缆' ? '裸导线' : '变压器-高压')
  const mediumCats = mediumCategoriesOf(normInd, majorCat)
  const mediumCat = mediumCats[0] || (normInd === '线缆' ? '钢芯铝绞线' : '交流变压器-110KV')
  const models = modelsOf(normInd, majorCat, mediumCat)
  const model = models[0] || (normInd === '线缆' ? 'LGJ-240' : 'SFZ-63000/110')
  return { ind: normInd, company: ALL_COMPANIES, majorCat, mediumCat, model, cat: mediumCat }
}

/**
 * 筛选：时间 → 产业 → 项目公司 → 产品大类 → 产品中类 → 产品型号
 * 时间置于最前；项目公司为独立的经营单位范围筛选，不影响类别/型号级联。
 * 产业变化时重置项目公司为“全部”并重置下游大类/中类/型号；大类变化时重置中类/型号；中类变化时重置型号。
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
  const majorCats = majorCategoriesOf(value.ind)
  const currentMajorCat = (value.majorCat && majorCats.includes(value.majorCat)) ? value.majorCat : (majorCats[0] || '变压器-高压')
  const mediumCats = mediumCategoriesOf(value.ind, currentMajorCat)
  const currentMediumCat = (value.mediumCat && mediumCats.includes(value.mediumCat)) ? value.mediumCat : (mediumCats[0] || '交流变压器-110KV')
  const models = modelsOf(value.ind, currentMajorCat, currentMediumCat)

  function setInd(ind: string) {
    onChange(initCascade(ind))
  }
  function setCompany(company: string) {
    onChange({ ...value, company })
  }
  function setMajorCat(majorCat: string) {
    const meds = mediumCategoriesOf(value.ind, majorCat)
    const nextMed = meds[0] || ''
    const nextModels = modelsOf(value.ind, majorCat, nextMed)
    const nextModel = nextModels[0] || ''
    onChange({ ...value, majorCat, mediumCat: nextMed, model: nextModel, cat: nextMed })
  }
  function setMediumCat(mediumCat: string) {
    const nextModels = modelsOf(value.ind, currentMajorCat, mediumCat)
    const nextModel = nextModels[0] || ''
    onChange({ ...value, mediumCat, model: nextModel, cat: mediumCat })
  }
  function setModel(model: string) {
    onChange({ ...value, model })
  }

  return (
    <Toolbar>
      {time}
      <Select label="产业" value={value.ind} onChange={setInd} options={industries.map((v) => ({ label: v, value: v }))} />
      <Select label="项目公司" value={value.company} onChange={setCompany} options={companies.map((v) => ({ label: v, value: v }))} />
      <Select label="产品大类" value={currentMajorCat} onChange={setMajorCat} options={majorCats.map((v) => ({ label: v, value: v }))} />
      <Select label="产品中类" value={currentMediumCat} onChange={setMediumCat} options={mediumCats.map((v) => ({ label: v, value: v }))} />
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
