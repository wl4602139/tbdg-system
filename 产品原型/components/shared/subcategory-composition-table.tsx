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
  title: string
  currentProductLine?: string | null
  subcategories: ProductLineSubcategory[]
  lineSpec?: any
  unitName?: string
  searchKey?: string
  onSearchChange?: (key: string) => void
  onSelectMetric: (metric: any) => void
  className?: string
}

/**
 * 🌟 产线子分类管控指标高密色彩带展示组件 (对齐图 1 阶段构成色彩带规范)
 * 特性：
 * 1. 多色能量构成带（Color Band）：
 *    - 电耗 (#2C7CFF 科技蓝)、蒸汽 (#FFBA00 橙黄)、天然气 (#FF6536 活力橙)、水耗 (#10C4CE 湖水青)
 *    - 依各介质折标煤当量自动计算加权占比，并在胶囊条内展示百分比；
 * 2. 44px / 52px 工业高密表格标准排版，紧凑精简，带顶栏图例。
 */
export function SubcategoryCompositionTable({
  title,
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
      {/* 模块头部：标题、产线元信息、能源介质图例 */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
        {/* 左侧：标题与产线信息 */}
        <div className="min-w-0 flex items-center gap-2">
          <span className="h-3.5 w-1 rounded-full bg-cyan-400 shrink-0" />
          <h2 className="text-base font-bold text-foreground shrink-0">{title}</h2>
          {currentProductLine && (
            <span className="text-[11px] font-medium text-muted-foreground hidden sm:inline">
              所属产线: <span className="font-semibold text-foreground">{currentProductLine}</span>
              <span className="mx-1.5 text-border">|</span>
              产品种类: <span className="font-semibold text-cyan-400 font-mono">{filteredList.length} 类</span>
            </span>
          )}
        </div>

        {/* 右侧：能源介质图例（100% 对齐图 1 顶部规范） */}
        <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground bg-secondary/50 border border-border/60 px-3 py-1.5 rounded-lg select-none">
          <span className="text-[11px] text-muted-foreground/80 font-sans">色彩带构成:</span>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#2C7CFF] shadow-2xs" />
            <span className="text-foreground text-[11px] font-sans">电</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#FFBA00] shadow-2xs" />
            <span className="text-foreground text-[11px] font-sans">蒸汽</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#FF6536] shadow-2xs" />
            <span className="text-foreground text-[11px] font-sans">天然气</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#10C4CE] shadow-2xs" />
            <span className="text-foreground text-[11px] font-sans">水</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono pl-1 border-l border-border/50">
            各介质折标煤占比
          </span>
        </div>
      </div>

      {/* 内容区域：空状态 或 工业高密表格 */}
      {filteredList.length === 0 ? (
        <div className="py-10 flex items-center justify-center text-center text-muted-foreground">
          <span className="text-sm font-medium">暂无相关产品种类！</span>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="overflow-x-auto border border-border/60 rounded-lg">
            <table className="w-full text-left border-collapse font-sans">
              <thead className="bg-secondary/40 text-muted-foreground text-[11px] font-semibold border-b border-border/60 select-none">
                <tr className="h-[44px]">
                  <th className="px-3 text-center w-12 font-mono">序号</th>
                  <th className="px-3 w-[180px] max-w-[200px]">产品种类</th>
                  <th className="px-3 text-center w-20 font-mono">单位</th>
                  <th className="px-3 text-right w-36 font-mono">综合能耗</th>
                  <th className="px-4">能耗构成 (加权折标占比)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-sm">
                {displayedList.map((sub, sIdx) => {
                  const comp = getSubcategoryEnergyComposition(sub, lineSpec, unitName)
                  const { energyMetric, segments } = comp

                  return (
                    <tr
                      key={sub.id}
                      onClick={() => onSelectMetric(energyMetric)}
                      className="h-[52px] hover:bg-cyan-500/10 dark:hover:bg-cyan-500/10 transition-colors group cursor-pointer"
                      title={`点击查看【${sub.name}】能耗详情与时序走势`}
                    >
                      {/* 1. 序号 */}
                      <td className="px-3 text-center font-mono text-xs text-muted-foreground">
                        {String(sIdx + 1).padStart(2, '0')}
                      </td>

                      {/* 2. 产品种类名称 (紧凑窄列) */}
                      <td className="px-3 w-[180px] max-w-[200px]">
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

                      {/* 3. 单位 */}
                      <td className="px-3 text-center font-mono text-xs text-muted-foreground">
                        {sub.unitSuffix || '万kVA'}
                      </td>

                      {/* 4. 综合能耗 (加粗 Mono + 同比) */}
                      <td className="px-3 text-right w-36">
                        <div className="inline-block">
                          <div className="font-mono text-sm font-bold text-foreground group-hover:text-cyan-400 transition-colors">
                            {energyMetric.curVal}{' '}
                            <span className="text-[10px] font-normal text-muted-foreground">
                              {energyMetric.unit}
                            </span>
                          </div>
                          <div className="text-[10px] font-mono text-emerald-400 flex items-center justify-end gap-0.5">
                            <span className="text-muted-foreground/80 font-sans">同比</span>
                            <span className="font-semibold">{energyMetric.yoy} ↓</span>
                          </div>
                        </div>
                      </td>

                      {/* 5. 能耗构成色彩带 (加权折标煤占比 - 纯图表展示，无跳转链接) */}
                      <td className="px-4">
                        <div className="space-y-1.5 py-1">
                          {/* 贯穿圆角胶囊能量带 */}
                          <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-secondary/80 border border-border/40 shadow-inner">
                            {segments.map((seg) => (
                              <div
                                key={seg.id}
                                style={{ width: `${seg.ratio}%`, backgroundColor: seg.color }}
                                className="h-full relative flex items-center justify-center text-[9px] font-mono font-bold text-white leading-none px-0.5 select-none"
                                title={`${seg.name}: ${seg.val} ${seg.unit} (折标煤当量: ${seg.tceVal.toFixed(4)} tce, 占比: ${seg.ratio}%)`}
                              >
                                {seg.ratio >= 8 ? `${seg.ratio}%` : ''}
                              </div>
                            ))}
                          </div>

                          {/* 构成百分比标签文本列表 */}
                          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted-foreground select-none">
                            {segments.map((seg, idx) => (
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

          {/* 产品种类超过 4 个时的展开/收起按钮 */}
          {filteredList.length > 4 && searchKey.trim() === '' && (
            <div className="pt-2 flex items-center justify-center border-t border-border/40">
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-panel hover:bg-cyan-500/10 border border-border hover:border-cyan-400/40 text-foreground transition-all cursor-pointer shadow-2xs group"
              >
                {isExpanded ? (
                  <>
                    <span>收起产品种类</span>
                    <ChevronUp className="size-3.5 text-muted-foreground group-hover:text-cyan-400 transition-colors" />
                  </>
                ) : (
                  <>
                    <span>展开全部产品种类 (共 {filteredList.length} 类)</span>
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
