'use client'

import React, { useState, useMemo, Fragment } from 'react'
import {
  Cpu,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  getSubcategoryEnergyComposition,
  type ProductLineSubcategory,
  type SubcategoryEnergyComposition,
  type EnergyCompositionSegment,
} from '@/lib/product-line-subcategories'

interface SubcategoryCompositionTableProps {
  title?: string
  hideHeaderTitle?: boolean
  currentProductLine?: string | null
  subcategories: ProductLineSubcategory[]
  lineSpec?: any
  unitName?: string
  searchKey?: string
  onSearchChange?: (key: string) => void
  onSelectMetric: (metric: any) => void
  className?: string
}

import { getProductOutputUnit } from '@/components/shared/product-model-energy-table'

/**
 * 依据产品分类编码与名称，计算合理且符合制造规模的统计期产成品产量
 * 严格遵循权威设备单位：变压器设备为【台】、线缆为【万km·mm²】、套管为【支】
 */
function getSubcategoryOutputVal(sub: ProductLineSubcategory, outputUnit: string): string {
  if ((sub as any).outputVal) return (sub as any).outputVal

  let hash = 0
  const str = sub.code || sub.id
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 37 + str.charCodeAt(i)) % 100000
  }

  if (outputUnit === '台' || outputUnit === '支' || outputUnit === '间隔' || outputUnit === '面') {
    const val = 80 + (hash % 360)
    return val.toLocaleString()
  } else if (outputUnit.includes('km') || outputUnit.includes('米') || outputUnit.includes('m')) {
    const val = 850 + (hash % 2650) + ((hash % 10) / 10)
    return val.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  } else {
    // 默认
    const val = 420 + (hash % 1450) + ((hash % 10) / 10)
    return val.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  }
}

/**
 * 🌟 产线子分类管控指标高密色彩带展示组件 (对齐图 1 阶段构成色彩带规范)
 * 特性：
 * 1. 多色能量构成带（Color Band）：
 *    - 电耗 (#2C7CFF 科技蓝)、蒸汽 (#FFBA00 橙黄)、天然气 (#FF6536 活力橙)、水耗 (#10C4CE 湖水青)
 *    - 依各介质折标煤当量自动计算加权占比，并在胶囊条内展示换算为 tce 后的绝对量，下方保留各介质占比；
 * 2. 紧邻产品中类右侧新增“产品产量”字段列；
 * 3. 44px 工业高密表格标准排版，紧凑精简，带顶栏图例。
 */
export function SubcategoryCompositionTable({
  title = '【产品中类管控指标】',
  hideHeaderTitle = false,
  currentProductLine,
  subcategories,
  lineSpec,
  unitName = '',
  searchKey = '',
  onSearchChange,
  onSelectMetric,
  className,
}: SubcategoryCompositionTableProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  // 过滤后的列表
  const filteredList = useMemo(() => {
    const q = searchKey.trim().toLowerCase()
    if (!q) return subcategories
    return subcategories.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.code.includes(q) ||
        s.lineName.toLowerCase().includes(q) ||
        s.fullDesc.toLowerCase().includes(q)
    )
  }, [subcategories, searchKey])

  // 折叠与展开控制（默认展示前 4 项，种类大于 4 时支持展开收起）
  const displayedList = useMemo(() => {
    if (isExpanded || searchKey.trim() !== '') {
      return filteredList
    }
    return filteredList.slice(0, 4)
  }, [filteredList, isExpanded, searchKey])

  return (
    <div className={cn('bg-card p-6 rounded-lg border border-border shadow-xs space-y-4', className)}>
      {/* 模块头部：仅在未隐藏标题时展示标题与产线信息 */}
      {!hideHeaderTitle && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
          <div className="min-w-0 flex items-center gap-2">
            <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
            <h2 className="text-base font-bold text-foreground shrink-0">{title}</h2>
            {currentProductLine && (
              <span className="text-[11px] font-medium text-muted-foreground hidden sm:inline">
                所属产线: <span className="font-semibold text-foreground">{currentProductLine}</span>
                <span className="mx-1.5 text-border">|</span>
                产品中类: <span className="font-semibold text-cyan-400 font-mono">{filteredList.length} 类</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* 内容区域：空状态 或 工业高密表格 */}
      {filteredList.length === 0 ? (
        <div className="py-10 flex items-center justify-center text-center text-muted-foreground">
          <span className="text-sm font-medium">暂无相关产品中类！</span>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="overflow-x-auto border border-border/60 rounded-lg">
            <table className="w-full text-left border-collapse font-sans">
              <thead className="bg-secondary/40 text-muted-foreground text-[11px] font-semibold border-b border-border/60 select-none">
                <tr className="h-[44px]">
                  <th className="px-3 text-center w-12 font-mono">序号</th>
                  <th className="px-3 w-[200px]">产品中类</th>
                  <th className="px-3 text-right w-36 font-mono">产品产量</th>
                  <th className="px-3 text-right w-44 font-mono">单位产品综合能耗</th>
                  <th className="px-4 font-normal">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-muted-foreground">
                        能耗构成 (加权折标占比)
                      </span>
                      {/* 右侧：能源介质类型图例 (已移动至能耗构成右侧) */}
                      <div className="flex items-center gap-3 text-xs font-normal text-muted-foreground select-none pr-1">
                        <div className="flex items-center gap-1.5">
                          <span className="size-2 rounded-full bg-[#2C7CFF]" />
                          <span className="text-foreground text-[11px] font-sans font-medium">电</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="size-2 rounded-full bg-[#FFBA00]" />
                          <span className="text-foreground text-[11px] font-sans font-medium">蒸汽</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="size-2 rounded-full bg-[#FF6536]" />
                          <span className="text-foreground text-[11px] font-sans font-medium">天然气</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="size-2 rounded-full bg-[#10C4CE]" />
                          <span className="text-foreground text-[11px] font-sans font-medium">水</span>
                        </div>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-sm">
                {displayedList.map((sub, sIdx) => {
                  const comp = getSubcategoryEnergyComposition(sub, lineSpec, unitName)
                  const { energyMetric, segments } = comp
                  const outputUnit = getProductOutputUnit(sub.lineName, sub.name, sub.unitSuffix)
                  const outputVal = getSubcategoryOutputVal(sub, outputUnit)
                  const subTotalEnergyNum = parseFloat(sub.energyVal) || parseFloat(energyMetric.curVal) || 0.313

                  // 计算换算成 tce 后的介质绝对量，确保各介质折标量之和与单位产品综合能耗严密吻合
                  let sumPriorTce = 0
                  const displaySegments = segments.map((seg, idx) => {
                    let segTce = Math.round(subTotalEnergyNum * (seg.ratio / 100) * 1000) / 1000
                    if (idx === segments.length - 1 && segments.length > 1) {
                      segTce = Math.max(0.001, Math.round((subTotalEnergyNum - sumPriorTce) * 1000) / 1000)
                    } else {
                      sumPriorTce += segTce
                    }
                    return {
                      ...seg,
                      displayTce: segTce.toFixed(3),
                    }
                  })

                  return (
                    <tr
                      key={sub.id}
                      onClick={() => onSelectMetric(energyMetric)}
                      className="h-[44px] hover:bg-cyan-500/10 dark:hover:bg-cyan-500/10 transition-colors group cursor-pointer"
                      title={`点击查看【${sub.name}】能耗详情与时序走势`}
                    >
                      {/* 1. 序号 */}
                      <td className="px-3 text-center font-mono text-xs text-muted-foreground">
                        {String(sIdx + 1).padStart(2, '0')}
                      </td>

                      {/* 2. 产品中类名称 (紧凑窄列) */}
                      <td className="px-3 w-[200px]">
                        <div className="flex items-center gap-2">
                          <div className="size-6 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                            <Cpu className="size-3.5" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-foreground truncate text-xs group-hover:text-cyan-400 transition-colors" title={sub.name}>
                              {sub.name}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 3. 产品产量 (紧邻产品中类右侧) */}
                      <td className="px-3 text-right w-36">
                        <div className="font-mono text-sm font-semibold text-foreground group-hover:text-cyan-400 transition-colors">
                          {outputVal}{' '}
                          <span className="text-xs font-normal text-muted-foreground font-sans">
                            {outputUnit}
                          </span>
                        </div>
                      </td>

                      {/* 4. 单位产品综合能耗 (数值 + 单位，移除同比) */}
                      <td className="px-3 text-right w-44">
                        <div className="font-mono text-sm font-bold text-foreground group-hover:text-cyan-400 transition-colors">
                          {energyMetric.curVal}{' '}
                          <span className="text-xs font-normal text-muted-foreground font-sans">
                            {energyMetric.unit}
                          </span>
                        </div>
                      </td>

                      {/* 5. 能耗构成色彩带 (图表显示折标煤 tce 绝对量，下方保留占比) */}
                      <td className="px-4">
                        <div className="space-y-1.5 py-1">
                          {/* 贯穿圆角胶囊能量带 */}
                          <div className="flex h-4 w-full overflow-hidden rounded-full bg-secondary/80 border border-border/40 shadow-inner">
                            {displaySegments.map((seg) => (
                              <div
                                key={seg.id}
                                style={{ width: `${seg.ratio}%`, backgroundColor: seg.color }}
                                className="h-full relative flex items-center justify-center text-[9px] font-mono font-bold text-white leading-none px-0.5 select-none overflow-hidden"
                                title={`${seg.name}: ${seg.val} ${seg.unit} (换算折标量: ${seg.displayTce} tce, 占比: ${seg.ratio}%)`}
                              >
                                {seg.ratio >= 15
                                  ? `${seg.displayTce} tce`
                                  : seg.ratio >= 7
                                  ? `${seg.displayTce}`
                                  : ''}
                              </div>
                            ))}
                          </div>

                          {/* 构成百分比标签文本列表 (下方占比显示保持不变) */}
                          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted-foreground select-none">
                            {displaySegments.map((seg, idx) => (
                              <Fragment key={seg.id}>
                                {idx > 0 && <span className="text-muted-foreground/30">/</span>}
                                <span
                                  style={{ color: seg.color }}
                                  className="font-semibold"
                                >
                                  {seg.shortName} {seg.ratio}%
                                </span>
                              </Fragment>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* 产品中类超过 4 个时的展开/收起按钮 */}
          {filteredList.length > 4 && searchKey.trim() === '' && (
            <div className="pt-2 flex items-center justify-center border-t border-border/40">
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-panel hover:bg-cyan-500/10 border border-border hover:border-cyan-400/40 text-foreground transition-all cursor-pointer shadow-2xs group"
              >
                {isExpanded ? (
                  <>
                    <span>收起产品中类</span>
                    <ChevronUp className="size-3.5 text-muted-foreground group-hover:text-cyan-400 transition-colors" />
                  </>
                ) : (
                  <>
                    <span>展开全部产品中类 (共 {filteredList.length} 类)</span>
                    <ChevronDown className="size-3.5 text-muted-foreground group-hover:text-cyan-400 transition-colors" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
