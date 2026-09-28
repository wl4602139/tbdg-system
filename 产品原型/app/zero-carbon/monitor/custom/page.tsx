'use client'

import React, { useState, useMemo, useCallback } from 'react'
import {
  Sliders,
  Plus,
  Calculator,
  Calendar,
  Download,
  RefreshCw,
  Edit3,
  Trash2,
  Play,
  CheckCircle2,
  Layers,
  Search,
  X,
  ChevronRight,
  Info,
  TrendingDown,
  TrendingUp,
  Activity,
  Database,
  Sparkles,
  Check,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Filter,
} from 'lucide-react'
import {
  INITIAL_BASIC_DATA,
  type BasicDataItem,
} from '@/lib/basic-data-dictionary'
import {
  INITIAL_CUSTOM_INDICATORS,
  type CustomIndicatorItem,
  type GranularityOption,
  GRANULARITY_OPTIONS,
  generateIndicatorTrend,
  generateIndicatorLedger,
} from '@/lib/custom-indicators-data'
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { ExportButton } from '@/components/shared/primitives'
import { cn } from '@/lib/utils'

export default function CustomIndicatorMonitorPage() {
  // 1. 自定义指标库状态
  const [indicators, setIndicators] = useState<CustomIndicatorItem[]>(INITIAL_CUSTOM_INDICATORS)
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string>(indicators[0]?.id || 'cust-01')
  const [activeGranularity, setActiveGranularity] = useState<GranularityOption>('day')
  const [activeTab, setActiveTab] = useState<'ledger' | 'manage'>('ledger')
  const [searchKw, setSearchKw] = useState('')

  // 当前选中的指标
  const currentIndicator = useMemo(() => {
    return indicators.find((item) => item.id === selectedIndicatorId) || indicators[0]
  }, [indicators, selectedIndicatorId])

  // 切换选中指标时，自动采用该指标配置的展示颗粒度
  React.useEffect(() => {
    if (currentIndicator?.granularity) {
      setActiveGranularity(currentIndicator.granularity)
    }
  }, [currentIndicator?.id, currentIndicator?.granularity])

  // 2. 时序曲线与台账数据生成
  const trendData = useMemo(() => {
    if (!currentIndicator) return []
    return generateIndicatorTrend(currentIndicator, activeGranularity)
  }, [currentIndicator, activeGranularity])

  const ledgerData = useMemo(() => {
    if (!currentIndicator) return []
    return generateIndicatorLedger(currentIndicator, activeGranularity)
  }, [currentIndicator, activeGranularity])

  // 3. 新建/编辑弹窗状态
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // 弹窗表单状态
  const [formName, setFormName] = useState('')
  const [formCode, setFormCode] = useState('')
  const [formCategory, setFormCategory] = useState('能效单耗类')
  const [formUnit, setFormUnit] = useState('')
  const [formGranularity, setFormGranularity] = useState<GranularityOption>('day')
  const [formFormulaExpr, setFormFormulaExpr] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formBenchmark, setFormBenchmark] = useState<number>(0)
  const [selectedBaseDataCodes, setSelectedBaseDataCodes] = useState<string[]>([])

  // 基础数据选择弹窗内部搜索与分类
  const [baseDataSearch, setBaseDataSearch] = useState('')
  const [baseDataCatFilter, setBaseDataCatFilter] = useState('全部')

  // 打开新建弹窗
  const handleOpenCreate = () => {
    setEditingId(null)
    const newIdx = indicators.length + 1
    setFormCode(`CUST-IND-${String(newIdx).padStart(3, '0')}`)
    setFormName('')
    setFormCategory('能效单耗类')
    setFormUnit('kWh/万元')
    setFormGranularity('day')
    setFormFormulaExpr('[EN-001] / [OUT-001]')
    setFormDesc('')
    setFormBenchmark(180)
    setSelectedBaseDataCodes(['EN-001', 'OUT-001'])
    setIsModalOpen(true)
  }

  // 打开编辑弹窗
  const handleOpenEdit = (item: CustomIndicatorItem) => {
    setEditingId(item.id)
    setFormCode(item.code)
    setFormName(item.name)
    setFormCategory(item.category)
    setFormUnit(item.unit)
    setFormGranularity(item.granularity)
    setFormFormulaExpr(item.formulaExpr)
    setFormDesc(item.desc)
    setFormBenchmark(item.benchmarkValue)
    setSelectedBaseDataCodes([...item.baseDataCodes])
    setIsModalOpen(true)
  }

  // 删除自定义指标
  const handleDeleteIndicator = (id: string) => {
    if (indicators.length <= 1) {
      alert('系统至少需保留一个自定义指标监测项！')
      return
    }
    if (confirm('确认删除该自定义指标吗？删除后将停止其监测时序计算。')) {
      const remaining = indicators.filter((i) => i.id !== id)
      setIndicators(remaining)
      if (selectedIndicatorId === id) {
        setSelectedIndicatorId(remaining[0].id)
      }
    }
  }

  // 基础数据字典过滤列表
  const filteredBaseData = useMemo(() => {
    return INITIAL_BASIC_DATA.filter((b) => {
      const matchCat = baseDataCatFilter === '全部' || b.category.includes(baseDataCatFilter)
      const matchKw =
        !baseDataSearch ||
        b.name.toLowerCase().includes(baseDataSearch.toLowerCase()) ||
        b.code.toLowerCase().includes(baseDataSearch.toLowerCase())
      return matchCat && matchKw
    }).slice(0, 30) // 限制展示前 30 项防卡顿
  }, [baseDataSearch, baseDataCatFilter])

  // 添加/移除基础数据关联项
  const toggleSelectBaseData = (code: string) => {
    if (selectedBaseDataCodes.includes(code)) {
      setSelectedBaseDataCodes(selectedBaseDataCodes.filter((c) => c !== code))
    } else {
      setSelectedBaseDataCodes([...selectedBaseDataCodes, code])
      // 自动追加变量 Token 到公式末尾
      setFormFormulaExpr((prev) => (prev ? `${prev} + [${code}]` : `[${code}]`))
    }
  }

  // 插入运算符或数字
  const handleInsertToken = (token: string) => {
    setFormFormulaExpr((prev) => `${prev} ${token} `)
  }

  // 公式校验与预览
  const formulaCheck = useMemo(() => {
    if (!formFormulaExpr.trim()) {
      return { valid: false, msg: '公式表达式不能为空' }
    }
    // 检查括号匹配
    let openCount = 0
    for (const c of formFormulaExpr) {
      if (c === '(') openCount++
      if (c === ')') openCount--
      if (openCount < 0) return { valid: false, msg: '公式中右括号未匹配' }
    }
    if (openCount !== 0) return { valid: false, msg: '公式中括号未正确闭合' }

    // 检查变量是否均已定义
    const varMatches = formFormulaExpr.match(/\[([A-Z0-9_-]+)\]/g) || []
    const codesInExpr = varMatches.map((m) => m.replace(/[\[\]]/g, ''))

    if (codesInExpr.length === 0) {
      return { valid: false, msg: '公式中必须包含至少一项基础数据变量' }
    }

    return {
      valid: true,
      msg: `公式语法合法，已关联 ${codesInExpr.length} 项底层基础数据变量`,
      codes: codesInExpr,
    }
  }, [formFormulaExpr])

  // 测试计算预览值
  const testCalcValue = useMemo(() => {
    if (!formulaCheck.valid) return '--'
    try {
      // 替换变量为测试数值
      let expr = formFormulaExpr
      formulaCheck.codes?.forEach((c) => {
        const bd = INITIAL_BASIC_DATA.find((b) => b.code === c)
        const val = bd && Number(bd.defaultVal) > 0 ? Number(bd.defaultVal) : 100
        expr = expr.replaceAll(`[${c}]`, String(val))
      })
      // 简单安全求值
      expr = expr.replaceAll('×', '*').replaceAll('÷', '/')
      // 仅允许基本数学字符
      if (/^[0-9+\-*/().\s]+$/.test(expr)) {
        // eslint-disable-next-line no-eval
        const result = eval(expr)
        if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
          return result.toFixed(3)
        }
      }
      return '--'
    } catch {
      return '--'
    }
  }, [formFormulaExpr, formulaCheck])

  // 保存新建/编辑
  const handleSaveIndicator = () => {
    if (!formName.trim()) {
      alert('请输入自定义指标名称！')
      return
    }
    if (!formulaCheck.valid) {
      alert(`公式校验未通过：${formulaCheck.msg}`)
      return
    }

    const baseNames = selectedBaseDataCodes.map((c) => {
      const item = INITIAL_BASIC_DATA.find((b) => b.code === c)
      return item?.name || c
    })

    if (editingId) {
      // 更新
      setIndicators((prev) =>
        prev.map((ind) =>
          ind.id === editingId
            ? {
                ...ind,
                code: formCode,
                name: formName,
                category: formCategory,
                unit: formUnit,
                granularity: formGranularity,
                formulaExpr: formFormulaExpr,
                formulaDisplay: formFormulaExpr,
                baseDataCodes: selectedBaseDataCodes,
                baseDataNames: baseNames,
                benchmarkValue: Number(formBenchmark) || ind.benchmarkValue,
                desc: formDesc,
                currentValue: Number(testCalcValue) > 0 ? Number(testCalcValue) : ind.currentValue,
                updatedAt: '刚刚',
              }
            : ind
        )
      )
    } else {
      // 新建
      const newInd: CustomIndicatorItem = {
        id: `cust-${Date.now()}`,
        code: formCode,
        name: formName,
        category: formCategory,
        unit: formUnit,
        granularity: formGranularity,
        formulaExpr: formFormulaExpr,
        formulaDisplay: formFormulaExpr,
        baseDataCodes: selectedBaseDataCodes,
        baseDataNames: baseNames,
        currentValue: Number(testCalcValue) > 0 ? Number(testCalcValue) : 128.5,
        yoyRate: '-2.8% ↓',
        momRate: '+0.5% ↑',
        benchmarkValue: Number(formBenchmark) || 150,
        desc: formDesc || '自定义业务能耗与单耗核算指标。',
        updatedAt: '刚刚',
      }
      setIndicators((prev) => [newInd, ...prev])
      setSelectedIndicatorId(newInd.id)
    }
    setIsModalOpen(false)
  }

  // 导出台账 CSV
  const handleExportCsv = () => {
    const headers = ['#', '时间戳', '指标编码', '指标名称', '计算值', '计量单位', '数据颗粒度', '基础数据入参', '同比']
    const rows = ledgerData.map((row, idx) => [
      idx + 1,
      row.timestamp,
      row.code,
      row.name,
      row.value,
      row.unit,
      row.granularity,
      `"${row.baseDataDetail}"`,
      row.yoy,
    ])
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `自定义指标监测_${currentIndicator?.name || '台账'}_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
        {/* ========================================================================= */}
        {/* 顶部主控制栏 (参考用能监测标准高度 p-3.5 完全统一对齐) */}
        {/* ========================================================================= */}
        <div className="bg-white p-3.5 rounded-lg border border-[#DBE6EE] shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2C7CFF] shrink-0">
              <Sliders className="size-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800">
                自定义指标监测
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 导出按钮 (标准 80x36px) */}
            <ExportButton onExport={handleExportCsv} />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 板块一：自定义指标卡片轮播 (Bento 架构，自解释边框高亮) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
          {indicators.map((ind) => {
            const isSelected = ind.id === selectedIndicatorId
            return (
              <div
                key={ind.id}
                onClick={() => setSelectedIndicatorId(ind.id)}
                className={cn(
                  'p-4 rounded-lg border bg-white cursor-pointer transition-all relative group shadow-xs',
                  isSelected
                    ? 'border-[#2C7CFF] ring-2 ring-[#2C7CFF]/30 bg-blue-50/15'
                    : 'border-[#DBE6EE] hover:border-slate-300 hover:shadow-sm'
                )}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#2C7CFF]">{ind.category}</span>
                  <span
                    className="px-1.5 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200/80 leading-none shrink-0"
                    title={`时间颗粒度: ${GRANULARITY_OPTIONS.find((g) => g.key === ind.granularity)?.label || ind.granularity}`}
                  >
                    {GRANULARITY_OPTIONS.find((g) => g.key === ind.granularity)?.label || ind.granularity}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-800 leading-snug line-clamp-1" title={ind.name}>
                  {ind.name}
                </h3>

                <div className="mt-2.5 flex items-baseline gap-1.5">
                  <span className="font-mono text-2xl font-extrabold text-[#2C7CFF]">
                    {ind.currentValue.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 font-sans">{ind.unit}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* ========================================================================= */}
        {/* 板块二：当前自定义指标时序走势与多维分解图 */}
        {/* ========================================================================= */}
        <div className="bg-white p-6 rounded-lg border border-[#DBE6EE] shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-3.5 w-1 rounded-full bg-[#2C7CFF] shrink-0" />
              <h2 className="text-base font-bold text-slate-800">
                数据变化趋势
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="size-2.5 rounded-full bg-[#2C7CFF]" />
                <span>实测计算值 ({currentIndicator.unit})</span>
                <span className="size-2.5 rounded-full bg-[#FFBA00] ml-2" />
                <span>管控基准线 ({currentIndicator.benchmarkValue})</span>
              </div>
            </div>
          </div>

          {/* Recharts 高对比度时序图表 */}
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIndicator" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2C7CFF" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2C7CFF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#CBD5E1' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#CBD5E1' }} />
                <Tooltip
                  cursor={{ stroke: 'rgba(56, 189, 248, 0.25)', strokeWidth: 1 }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const p = payload[0].payload
                      return (
                        <div className="bg-slate-900/95 text-white p-3 rounded-lg border border-slate-700 text-xs shadow-xl min-w-[200px]">
                          <div className="font-semibold text-slate-300 mb-1 border-b border-slate-700/60 pb-1">
                            时间戳: {label}
                          </div>
                          <div className="text-sm font-extrabold text-[#38bdf8] my-1">
                            {currentIndicator.name}: {p.value} {currentIndicator.unit}
                          </div>
                          <div className="text-[11px] text-amber-300 mb-2">
                            基准值: {p.benchmark} {currentIndicator.unit}
                          </div>
                          {p.numeratorName && (
                            <div className="pt-1.5 border-t border-slate-700/60 text-[11px] space-y-0.5 text-slate-300">
                              <div>{p.numeratorName}: <span className="font-mono text-white">{p.numeratorVal}</span></div>
                              <div>{p.denominatorName}: <span className="font-mono text-white">{p.denominatorVal}</span></div>
                            </div>
                          )}
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <ReferenceLine y={currentIndicator.benchmarkValue} stroke="#FFBA00" strokeDasharray="4 4" strokeWidth={1.5} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#2C7CFF"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorIndicator)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 板块三：双 TAB 下方工作台 (监测明细台账 VS 指标库配置管理) */}
        {/* ========================================================================= */}
        <div className="bg-white p-6 rounded-lg border border-[#DBE6EE] shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
            {/* 业务切换 TAB */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('ledger')}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm transition-all cursor-pointer select-none',
                  activeTab === 'ledger'
                    ? 'bg-[#2C7CFF] text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                )}
              >
                高频监测明细台账 ({ledgerData.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('manage')}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm transition-all cursor-pointer select-none',
                  activeTab === 'manage'
                    ? 'bg-[#2C7CFF] text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                )}
              >
                自定义指标库管理 ({indicators.length})
              </button>
            </div>

            <button
              type="button"
              onClick={handleOpenCreate}
              className="h-8 px-3 rounded-lg bg-[#2C7CFF] text-white text-xs font-bold flex items-center gap-1 hover:bg-blue-600 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="size-3.5" />
              新建自定义指标
            </button>
          </div>

          {/* TAB 1: 高频监测明细台账 */}
          {activeTab === 'ledger' && (
            <div className="overflow-x-auto border border-slate-200/80 rounded-lg">
              <table className="w-full min-w-[1080px] table-fixed text-left border-collapse font-sans text-xs">
                <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200 select-none">
                  <tr className="h-[44px]">
                    <th className="px-2 text-center w-[4%] font-mono whitespace-nowrap">#</th>
                    <th className="px-3 w-[15%] whitespace-nowrap">监测时间戳</th>
                    <th className="px-3 w-[18%] whitespace-nowrap">指标名称</th>
                    <th className="px-3 text-center w-[11%] font-mono whitespace-nowrap">实时计算值</th>
                    <th className="px-2 text-center w-[6%] whitespace-nowrap">单位</th>
                    <th className="px-3 text-center w-[8%] whitespace-nowrap">数据颗粒度</th>
                    <th className="px-4 w-[30%] whitespace-nowrap">关联基础数据入参</th>
                    <th className="px-3 text-center w-[8%] whitespace-nowrap">同比</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100" suppressHydrationWarning>
                  {ledgerData.map((row, idx) => (
                    <tr key={row.id} className="h-[44px] hover:bg-blue-50/30 transition-colors">
                      <td className="px-2 text-center font-mono text-slate-400 whitespace-nowrap">
                        {String(idx + 1).padStart(2, '0')}
                      </td>
                      <td className="px-3 font-mono text-slate-700 whitespace-nowrap">
                        {row.timestamp}
                      </td>
                      <td className="px-3 font-semibold text-slate-900 truncate" title={row.name}>
                        {row.name}
                      </td>
                      <td className="px-3 text-center font-mono font-bold text-[#2C7CFF] whitespace-nowrap">
                        {row.value.toLocaleString()}
                      </td>
                      <td className="px-2 text-center font-mono text-slate-600 whitespace-nowrap">
                        {row.unit}
                      </td>
                      <td className="px-3 text-center whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-600 border border-slate-200">
                          {row.granularity}
                        </span>
                      </td>
                      <td className="px-4 text-slate-600 truncate font-mono text-[11px]" title={row.baseDataDetail}>
                        {row.baseDataDetail}
                      </td>
                      <td className="px-3 text-center font-mono text-xs whitespace-nowrap">
                        <span className={cn('font-semibold', row.yoy.includes('↓') ? 'text-emerald-600' : 'text-amber-600')}>
                          {row.yoy}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: 自定义指标库配置管理 */}
          {activeTab === 'manage' && (
            <div className="overflow-x-auto border border-slate-200/80 rounded-lg">
              <table className="w-full min-w-[1080px] table-fixed text-left border-collapse font-sans text-xs">
                <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200 select-none">
                  <tr className="h-[44px]">
                    <th className="px-2 text-center w-[4%] font-mono whitespace-nowrap">#</th>
                    <th className="px-3 w-[10%] font-mono whitespace-nowrap">指标代码</th>
                    <th className="px-4 w-[18%] whitespace-nowrap">指标名称</th>
                    <th className="px-2 text-center w-[10%] whitespace-nowrap">业务分类</th>
                    <th className="px-3 w-[27%] whitespace-nowrap">计算公式</th>
                    <th className="px-2 text-center w-[8%] whitespace-nowrap">数据颗粒度</th>
                    <th className="px-2 text-center w-[8%] whitespace-nowrap">单位</th>
                    <th className="px-2 text-center w-[9%] font-mono whitespace-nowrap">当前计算值</th>
                    <th className="px-3 text-center w-[6%] whitespace-nowrap">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {indicators.map((item, idx) => (
                    <tr key={item.id} className="h-[44px] hover:bg-blue-50/30 transition-colors">
                      <td className="px-2 text-center font-mono text-slate-400 whitespace-nowrap">
                        {String(idx + 1).padStart(2, '0')}
                      </td>
                      <td className="px-3 font-mono font-bold text-[#2C7CFF] whitespace-nowrap">
                        {item.code}
                      </td>
                      <td className="px-4 font-semibold text-slate-900 truncate" title={item.name}>
                        {item.name}
                      </td>
                      <td className="px-2 text-center whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-blue-50 text-[#2C7CFF]">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-3 font-mono text-[11px] text-slate-700 truncate" title={item.formulaDisplay}>
                        {item.formulaExpr}
                      </td>
                      <td className="px-2 text-center whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-600">
                          {GRANULARITY_OPTIONS.find((g) => g.key === item.granularity)?.label || item.granularity}
                        </span>
                      </td>
                      <td className="px-2 text-center font-mono text-slate-600 whitespace-nowrap">
                        {item.unit}
                      </td>
                      <td className="px-2 text-center font-mono font-bold text-[#2C7CFF] whitespace-nowrap">
                        {item.currentValue.toLocaleString()}
                      </td>
                      <td className="px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="text-[#2C7CFF] hover:underline font-medium cursor-pointer"
                          >
                            编辑
                          </button>
                          <span className="text-slate-300">|</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteIndicator(item.id)}
                            className="text-rose-600 hover:underline font-medium cursor-pointer"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      {/* ========================================================================= */}
      {/* 核心 Modal: 【新建 / 编辑自定义指标】 (公式构建器 + 基础数据选择) */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* 弹窗头部 */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-[#2C7CFF] text-white flex items-center justify-center">
                  <Calculator className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {editingId ? '编辑自定义指标' : '新建自定义指标'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    从全平台基础数据字典中按需选取量测字段，自由组合运算符构建业务计算公式与展示颗粒度。
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* 弹窗表单滚动区 */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* 基础属性网格 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    指标名称 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="如：全厂单位产值综合电耗"
                    className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-xs text-slate-800 focus:border-[#2C7CFF] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">指标代码</label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-slate-50 font-mono text-xs text-slate-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">业务分类</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-xs text-slate-800 focus:border-[#2C7CFF] focus:outline-none cursor-pointer"
                  >
                    <option value="能效单耗类">能效单耗类</option>
                    <option value="能源消费类">能源消费类</option>
                    <option value="绿电微网类">绿电微网类</option>
                    <option value="工序单耗类">工序单耗类</option>
                    <option value="碳排合规类">碳排合规类</option>
                    <option value="设备工况类">设备工况类</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    计量单位 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    placeholder="如：kWh/万元、tce/t、%"
                    className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-xs text-slate-800 focus:border-[#2C7CFF] focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    数据颗粒度 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formGranularity}
                    onChange={(e) => setFormGranularity(e.target.value as GranularityOption)}
                    className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-xs text-slate-800 focus:border-[#2C7CFF] focus:outline-none cursor-pointer"
                  >
                    {GRANULARITY_OPTIONS.map((g) => (
                      <option key={g.key} value={g.key}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">目标基准线数值</label>
                  <input
                    type="number"
                    step="any"
                    value={formBenchmark}
                    onChange={(e) => setFormBenchmark(e.target.value)}
                    placeholder="如：195.0"
                    className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-xs text-slate-800 focus:border-[#2C7CFF] focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* 核心联动区域：基础数据选择器 */}
              <div className="space-y-2 border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Database className="size-4 text-[#2C7CFF]" />
                    <span className="text-xs font-bold text-slate-800">
                      基础数据字段选择 (来自全平台基础数据字典 · 共 310 项)
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    已选入公式变量池: <strong className="text-[#2C7CFF]">{selectedBaseDataCodes.length}</strong> 项
                  </span>
                </div>

                {/* 过滤筛选条 */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="size-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={baseDataSearch}
                      onChange={(e) => setBaseDataSearch(e.target.value)}
                      placeholder="按数据项名称或代码 (如 EN-001) 筛选..."
                      className="w-full h-8 pl-8 pr-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-[#2C7CFF]"
                    />
                  </div>

                  <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
                    {['全部', '能源', '产量', '碳排', '产值', '设备'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setBaseDataCatFilter(cat)}
                        className={cn(
                          'px-2 py-1 rounded transition-colors cursor-pointer whitespace-nowrap',
                          baseDataCatFilter === cat
                            ? 'bg-[#2C7CFF] text-white font-bold'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 候选基础数据网格 */}
                <div className="max-h-36 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
                  {filteredBaseData.map((b) => {
                    const isAdded = selectedBaseDataCodes.includes(b.code)
                    return (
                      <div
                        key={b.id}
                        onClick={() => toggleSelectBaseData(b.code)}
                        className={cn(
                          'p-2 rounded-lg border text-xs flex items-center justify-between gap-2 cursor-pointer transition-all',
                          isAdded
                            ? 'bg-blue-50 border-[#2C7CFF] text-[#2C7CFF] font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        )}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-[10px] text-[#2C7CFF] shrink-0">[{b.code}]</span>
                            <span className="truncate font-medium" title={b.name}>{b.name}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            单位: {b.unit || '无'} · {b.freq}
                          </div>
                        </div>
                        <span className={cn('size-5 rounded-full flex items-center justify-center shrink-0 text-xs', isAdded ? 'bg-[#2C7CFF] text-white' : 'bg-slate-100 text-slate-400')}>
                          {isAdded ? <Check className="size-3" /> : <Plus className="size-3" />}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 运算符与变量快捷操作栏 (位于公式模块正上方) */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-50/90 rounded-lg border border-slate-200 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-sans">基础数据变量:</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {selectedBaseDataCodes.length === 0 ? (
                      <span className="text-[11px] text-slate-400">（请在上方面板勾选基础数据）</span>
                    ) : (
                      selectedBaseDataCodes.map((code) => {
                        const item = INITIAL_BASIC_DATA.find((b) => b.code === code)
                        return (
                          <button
                            key={code}
                            type="button"
                            onClick={() => handleInsertToken(`[${code}]`)}
                            className="px-2 py-1 rounded bg-white border border-blue-200 text-[#2C7CFF] font-mono text-[11px] hover:bg-blue-50 transition-colors cursor-pointer shadow-2xs"
                            title={item?.name}
                          >
                            [{code}] {item?.name}
                          </button>
                        )
                      })
                    )}
                  </div>

                  <div className="w-px h-5 bg-slate-200 mx-1" />

                  <span className="text-[11px] text-slate-500 font-sans">运算符:</span>
                  <div className="flex items-center gap-1">
                    {['+', '-', '×', '÷', '(', ')', '100', '1000'].map((op) => (
                      <button
                        key={op}
                        type="button"
                        onClick={() => handleInsertToken(op)}
                        className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-800 font-mono font-bold text-xs hover:bg-slate-100 hover:border-[#2C7CFF] hover:text-[#2C7CFF] transition-colors cursor-pointer shadow-2xs"
                      >
                        {op}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setFormFormulaExpr('')}
                  className="px-2 py-1 rounded bg-rose-50 border border-rose-200 text-rose-600 text-xs hover:bg-rose-100 ml-auto cursor-pointer"
                >
                  清空
                </button>
              </div>

              {/* 核心联动区域：计算公式表达式构建 (公式模块) */}
              <div className="space-y-2 border border-slate-200 rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Calculator className="size-4 text-[#2C7CFF]" />
                    计算公式表达式构建 <span className="text-rose-500">*</span>
                  </label>
                  <span className={cn('text-xs font-medium flex items-center gap-1', formulaCheck.valid ? 'text-emerald-600' : 'text-amber-600')}>
                    {formulaCheck.valid ? <CheckCircle2 className="size-3.5" /> : <AlertCircle className="size-3.5" />}
                    {formulaCheck.msg}
                  </span>
                </div>

                {/* 公式输入框 */}
                <textarea
                  rows={2}
                  value={formFormulaExpr}
                  onChange={(e) => setFormFormulaExpr(e.target.value)}
                  placeholder="如：[EN-001] / [OUT-001] 或 ([EN-001] - [EN-002]) / [EN-001] * 100"
                  className="w-full p-3 rounded-lg border border-[#E2E8F0] font-mono text-xs text-slate-900 focus:border-[#2C7CFF] focus:outline-none leading-relaxed bg-slate-50/40"
                />

                {/* 测试计算预览 */}
                <div className="flex items-center justify-between bg-blue-50/60 p-2.5 rounded-lg border border-blue-100 text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-[#2C7CFF]" />
                    <span className="text-slate-600">当前基准样本试算结果：</span>
                    <span className="font-mono font-extrabold text-slate-900 text-sm">
                      {testCalcValue} {formUnit}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    注：系统内置 `--` 软兜底除零防御机制
                  </span>
                </div>
              </div>

              {/* 描述说明 */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">业务核算口径说明</label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="说明该自定义指标的应用场景、核算范围与管理考核口径..."
                  className="w-full p-2.5 rounded-lg border border-[#E2E8F0] text-xs text-slate-800 focus:border-[#2C7CFF] focus:outline-none"
                />
              </div>
            </div>

            {/* 弹窗底部操作按钮 */}
            <div className="px-6 py-3.5 border-t border-slate-200 flex items-center justify-between bg-slate-50/80">
              <span className="text-xs text-slate-500">
                支持高频 15 分钟连续采样与月度周期核算多粒度无缝呈现
              </span>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-9 px-4 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleSaveIndicator}
                  className="h-9 px-5 rounded-lg bg-[#2C7CFF] text-white text-xs font-bold hover:bg-blue-600 transition-colors shadow-xs cursor-pointer"
                >
                  保存并启用监测
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
