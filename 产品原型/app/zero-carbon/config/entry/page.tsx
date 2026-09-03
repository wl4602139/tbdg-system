'use client'

import React, { useState, useMemo } from 'react'
import {
  FileEdit,
  Save,
  CheckCircle2,
  Calendar,
  History,
  ArrowLeft,
  ArrowRight,
  Search,
  Download,
  Info,
  Layers,
  Sparkles,
  Calculator,
} from 'lucide-react'
import { Panel, Badge } from '@/components/shared/primitives'
import { cn } from '@/lib/utils'

// 17 项严格对应《零碳园区集控中心数据需求清单》中来源为“录入”的数据项定义
interface EntryRowItem {
  id: string
  name: string            // 数据项名称
  category: 'energy' | 'cost' | 'green' | 'economy' | 'equipment'
  categoryLabel: string
  target: '工厂' | '园区及工厂' | '园区/工厂'  // 数据对象
  dimension: '日/月' | '月度' | '月' | '月度/年度' | '增量更新' // 时间维度
  unit: string            // 数据单位
  value: string           // 当前填报值
  remark: string          // 业务填报说明 / 补充信息
}

const INITIAL_ENTRY_ROWS: EntryRowItem[] = [
  // 1. 能源消耗量 (5项)
  {
    id: 'row-1',
    name: '用水量',
    category: 'energy',
    categoryLabel: '能源消耗量',
    target: '工厂',
    dimension: '日/月',
    unit: 't',
    value: '8900',
    remark: '市政自来水表底抄报',
  },
  {
    id: 'row-2',
    name: '天然气量',
    category: 'energy',
    categoryLabel: '能源消耗量',
    target: '工厂',
    dimension: '月度',
    unit: 'm³',
    value: '28400',
    remark: '燃气锅炉与加热消耗',
  },
  {
    id: 'row-3',
    name: '外购蒸汽量',
    category: 'energy',
    categoryLabel: '能源消耗量',
    target: '工厂',
    dimension: '月度',
    unit: 't',
    value: '1420',
    remark: '集中供热管网蒸汽抄表',
  },
  {
    id: 'row-4',
    name: '油消耗量（柴油、煤油、汽油）',
    category: 'energy',
    categoryLabel: '能源消耗量',
    target: '工厂',
    dimension: '月度',
    unit: 'L',
    value: '320',
    remark: '发电机组与厂区叉车领用',
  },
  {
    id: 'row-5',
    name: '液氧',
    category: 'energy',
    categoryLabel: '能源消耗量',
    target: '工厂',
    dimension: '月度',
    unit: 't',
    value: '45.0',
    remark: '切割与焊接助燃液氧消耗',
  },

  // 2. 能源费用账单 (5项)
  {
    id: 'row-6',
    name: '市电费用',
    category: 'cost',
    categoryLabel: '能源费用',
    target: '工厂',
    dimension: '月度',
    unit: '万元',
    value: '142.50',
    remark: '电网结算电费发票总额',
  },
  {
    id: 'row-7',
    name: '天然气费用',
    category: 'cost',
    categoryLabel: '能源费用',
    target: '工厂',
    dimension: '月度',
    unit: '万元',
    value: '8.52',
    remark: '燃气公司月度对账发票',
  },
  {
    id: 'row-8',
    name: '外购蒸汽费用',
    category: 'cost',
    categoryLabel: '能源费用',
    target: '工厂',
    dimension: '月度',
    unit: '万元',
    value: '32.66',
    remark: '园区热力公司结算凭单',
  },
  {
    id: 'row-9',
    name: '用水费用',
    category: 'cost',
    categoryLabel: '能源费用',
    target: '工厂',
    dimension: '月度',
    unit: '万元',
    value: '4.89',
    remark: '自来水水务公司月度水费单',
  },
  {
    id: 'row-10',
    name: '油费用',
    category: 'cost',
    categoryLabel: '能源费用',
    target: '工厂',
    dimension: '月度',
    unit: '万元',
    value: '0.24',
    remark: '柴油发票与加油卡对账凭证',
  },

  // 3. 绿电与绿证交易 (2项)
  {
    id: 'row-11',
    name: '购买绿电量',
    category: 'green',
    categoryLabel: '绿电与绿证',
    target: '园区及工厂',
    dimension: '月',
    unit: 'MWh',
    value: '1482.0',
    remark: '三峡能源哈密200MW光伏电站',
  },
  {
    id: 'row-12',
    name: '购买绿证量',
    category: 'green',
    categoryLabel: '绿电与绿证',
    target: '园区及工厂',
    dimension: '月',
    unit: '个',
    value: '18000',
    remark: 'GEC凭证: CN-GEC-2026-HM-00921',
  },

  // 4. 经济与产量 (2项)
  {
    id: 'row-13',
    name: '工业增加值（月度、年度）',
    category: 'economy',
    categoryLabel: '经济与产量',
    target: '工厂',
    dimension: '月度/年度',
    unit: '万元',
    value: '4200.0',
    remark: '统计局口径工业增加值',
  },
  {
    id: 'row-14',
    name: '产量（非线缆产业、项目公司）',
    category: 'economy',
    categoryLabel: '经济与产量',
    target: '工厂',
    dimension: '月',
    unit: '台/套/件',
    value: '128',
    remark: '变压器等非线缆产业完工量',
  },

  // 5. 重点用能设备与项目事件 (3项)
  {
    id: 'row-15',
    name: '达到或优于能效国家标准2级设备明细',
    category: 'equipment',
    categoryLabel: '用能设备与事件',
    target: '工厂',
    dimension: '增量更新',
    unit: 'kW',
    value: '3200',
    remark: '超高效节能电动机 IE4 & 变压器',
  },
  {
    id: 'row-16',
    name: '纳入统计范围设备明细',
    category: 'equipment',
    categoryLabel: '用能设备与事件',
    target: '工厂',
    dimension: '增量更新',
    unit: 'kW',
    value: '4850',
    remark: '集中压缩空气站组 & 工业制冷机组',
  },
  {
    id: 'row-17',
    name: '零碳关键事件与园区现场照片',
    category: 'equipment',
    categoryLabel: '用能设备与事件',
    target: '园区/工厂',
    dimension: '增量更新',
    unit: '事件/时间',
    value: '光伏扩建并网',
    remark: '2.8MWp分布式光伏扩建工程投运',
  },
]

interface HistoryRecord {
  id: string
  batch: string
  year: string
  month: string
  submitter: string
  submitTime: string
  summary: string
  totalCostWan: string
  status: '已入库' | '待复核'
}

// 12 个月度卡片
const MONTH_CARDS = [
  { value: '01', label: '1月', isFilled: true },
  { value: '02', label: '2月', isFilled: true },
  { value: '03', label: '3月', isFilled: true },
  { value: '04', label: '4月', isFilled: true },
  { value: '05', label: '5月', isFilled: true },
  { value: '06', label: '6月', isFilled: true },
  { value: '07', label: '7月', isFilled: true },
  { value: '08', label: '8月', isFilled: false },
  { value: '09', label: '9月', isFilled: false },
  { value: '10', label: '10月', isFilled: false },
  { value: '11', label: '11月', isFilled: false },
  { value: '12', label: '12月', isFilled: false },
]

export default function ManualEntryPage() {
  // 页面模式：'entry' (填报清单列表页) | 'history' (历史台账内页)
  const [viewMode, setViewMode] = useState<'entry' | 'history'>('entry')

  // 年份与月度状态
  const [selectedYear, setSelectedYear] = useState('2026')
  const [selectedMonth, setSelectedMonth] = useState('08')
  const [submitterName, setSubmitterName] = useState('李工 (能碳专员)')

  // 列表填报数据源
  const [entryRows, setEntryRows] = useState<EntryRowItem[]>(INITIAL_ENTRY_ROWS)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // 历史台账数据源
  const [historyList, setHistoryList] = useState<HistoryRecord[]>([
    {
      id: 'REC-01',
      batch: 'DR-202608-01',
      year: '2026',
      month: '08',
      submitter: '李工 (能碳专员)',
      submitTime: '2026-08-28 09:30',
      summary: '用水 8,900t · 气 28,400m³ · 蒸汽 1,420t · 购绿电 1,482MWh · 增加值 ¥4,200万',
      totalCostWan: '188.81',
      status: '已入库',
    },
    {
      id: 'REC-02',
      batch: 'DR-202607-02',
      year: '2026',
      month: '07',
      submitter: '王强',
      submitTime: '2026-07-28 14:15',
      summary: '用水 8,650t · 气 27,200m³ · 蒸汽 1,380t · 购绿电 1,200MWh · 增加值 ¥3,950万',
      totalCostWan: '175.40',
      status: '已入库',
    },
    {
      id: 'REC-03',
      batch: 'DR-202607-01',
      year: '2026',
      month: '07',
      submitter: '刘伟',
      submitTime: '2026-07-26 11:20',
      summary: '柴油 350L · 液氧 42t · 购绿电 2,100MWh · 绿证 15,000个 · 2级设备 3,400kW',
      totalCostWan: '162.15',
      status: '已入库',
    },
    {
      id: 'REC-04',
      batch: 'DR-202606-03',
      year: '2026',
      month: '06',
      submitter: '张海',
      submitTime: '2026-06-28 10:45',
      summary: '用水 6,200t · 气 19,800m³ · 购绿电 850MWh · 绿证 8,000个 · 统计设备 4,200kW',
      totalCostWan: '141.20',
      status: '已入库',
    },
  ])

  // 成功提示
  const [successToast, setSuccessToast] = useState<{ show: boolean; msg: string; batch: string }>({
    show: false,
    msg: '',
    batch: '',
  })

  // 行内数值更新
  const handleValueChange = (id: string, newVal: string) => {
    setEntryRows((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value: newVal } : item))
    )
  }

  // 行内备注更新
  const handleRemarkChange = (id: string, newRemark: string) => {
    setEntryRows((prev) =>
      prev.map((item) => (item.id === id ? { ...item, remark: newRemark } : item))
    )
  }

  // 过滤后的列表填报行
  const filteredRows = useMemo(() => {
    return entryRows.filter((r) => {
      const matchCat = categoryFilter === 'all' || r.category === categoryFilter
      const matchQuery =
        !searchQuery.trim() ||
        r.name.includes(searchQuery.trim()) ||
        r.categoryLabel.includes(searchQuery.trim()) ||
        r.target.includes(searchQuery.trim())
      return matchCat && matchQuery
    })
  }, [entryRows, categoryFilter, searchQuery])

  // 计算业务分类在第一列连续行中的合并跨度 (rowSpan)
  const rowsWithSpans = useMemo(() => {
    return filteredRows.map((row, idx, arr) => {
      const isFirst = idx === 0 || arr[idx - 1].category !== row.category
      let span = 1
      if (isFirst) {
        for (let i = idx + 1; i < arr.length; i++) {
          if (arr[i].category === row.category) {
            span++
          } else {
            break
          }
        }
      }
      return {
        ...row,
        isFirstOfCategory: isFirst,
        categoryRowSpan: span,
      }
    })
  }, [filteredRows])

  // 动态计算当期费用合计
  const currentCostTotal = useMemo(() => {
    return entryRows
      .filter((r) => r.category === 'cost')
      .reduce((sum, r) => sum + (parseFloat(r.value) || 0), 0)
      .toFixed(2)
  }, [entryRows])

  // 提交保存处理
  const handleSaveEntry = (status: '已入库' | '待复核') => {
    const now = new Date()
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const batchCode = `DR-${selectedYear}${selectedMonth}-${String(historyList.length + 1).padStart(2, '0')}`

    const summaryText = `水 ${entryRows[0].value}t · 气 ${entryRows[1].value}m³ · 汽 ${entryRows[2].value}t · 购绿电 ${entryRows[10].value}MWh · 增加值 ¥${entryRows[12].value}万`

    const newRecord: HistoryRecord = {
      id: `REC-${Date.now()}`,
      batch: batchCode,
      year: selectedYear,
      month: selectedMonth,
      submitter: submitterName,
      submitTime: timeStr,
      summary: summaryText,
      totalCostWan: currentCostTotal,
      status,
    }

    setHistoryList([newRecord, ...historyList])
    setSuccessToast({
      show: true,
      msg: `${selectedYear}年${selectedMonth}月全量数据已成功${status === '已入库' ? '校验入库' : '保存待复核'}！已记入历史台账内页。`,
      batch: batchCode,
    })

    setTimeout(() => {
      setSuccessToast({ show: false, msg: '', batch: '' })
    }, 4500)
  }

  const handleDeleteHistory = (id: string) => {
    if (confirm('确认从历史台账中删除此批次记录？')) {
      setHistoryList(historyList.filter((h) => h.id !== id))
    }
  }

  return (
    <div className="space-y-3.5">
      {/* 🌟 1. 极简顶部标题栏：清晰利落，功能操作一触即达 */}
      <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/20 border border-primary/30 text-primary">
            {viewMode === 'entry' ? <FileEdit className="size-4.5" /> : <History className="size-4.5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-foreground">
                {viewMode === 'entry' ? '能碳数据手动录入' : '历史填报台账全量明细'}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-[#1677ff] font-bold">
                {viewMode === 'entry' ? '清单标准 17 项指标' : '归档数据'}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {viewMode === 'entry'
                ? '严格对齐零碳园区集控中心需求清单，仅展示数据来源为“录入”指标，支持直接修改与一键入库。'
                : '查看以往月份已归档入库的能碳指标记录。'}
            </p>
          </div>
        </div>

        {/* 顶部操作入口 */}
        <div className="flex items-center gap-2">
          {viewMode === 'entry' ? (
            <>
              <button
                type="button"
                onClick={() => setViewMode('history')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-panel hover:bg-slate-200/60 text-xs font-semibold text-foreground cursor-pointer transition-colors"
              >
                <History className="size-3.5 text-[#1677ff]" />
                <span>历史台账 ({historyList.length})</span>
                <ArrowRight className="size-3 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => handleSaveEntry('已入库')}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-bold shadow-2xs cursor-pointer transition-colors"
              >
                <Save className="size-3.5" />
                <span>保存并正式入库</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setViewMode('entry')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
            >
              <ArrowLeft className="size-3.5" />
              <span>返回数据填报页</span>
            </button>
          )}
        </div>
      </div>

      {/* 成功提醒横幅 */}
      {successToast.show && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/90 px-4 py-2.5 text-xs text-emerald-800 shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span className="font-bold">入库成功（{successToast.batch}）：</span>
            <span>{successToast.msg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessToast({ show: false, msg: '', batch: '' })}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 视图 1：录入工作台 (整洁、简约、好操作) */}
      {/* ========================================================================= */}
      {viewMode === 'entry' && (
        <Panel className="p-3.5 space-y-3">
          {/* 🌟 2. 月度卡片切换条：规整、等宽、醒目、极简 */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl border border-border bg-panel">
            {/* 年份选择器 */}
            <div className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 py-1 text-xs shadow-2xs shrink-0">
              <Calendar className="size-3.5 text-blue-500" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="border-0 bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer"
              >
                <option value="2026">2026 年</option>
                <option value="2025">2025 年</option>
                <option value="2024">2024 年</option>
              </select>
            </div>

            {/* 12个月度平铺切换卡片 (整齐划一，点击即切换) */}
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-1 flex-1 min-w-[500px]">
              {MONTH_CARDS.map((m) => {
                const isSelected = selectedMonth === m.value
                return (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setSelectedMonth(m.value)}
                    className={cn(
                      'flex flex-col items-center justify-center py-1 px-1.5 rounded-lg border text-center transition-all cursor-pointer select-none text-xs',
                      isSelected
                        ? 'bg-[#1677ff] text-white border-blue-600 font-bold shadow-xs ring-2 ring-blue-500/20'
                        : m.isFilled
                        ? 'bg-white hover:bg-blue-50/50 border-border text-foreground'
                        : 'bg-white/70 hover:bg-slate-100/70 border-dashed border-slate-200 text-muted-foreground'
                    )}
                  >
                    <span className="font-mono text-xs">{m.label}</span>
                    <span
                      className={cn(
                        'text-[9px] scale-90 leading-tight',
                        isSelected
                          ? 'text-white/90 font-medium'
                          : m.isFilled
                          ? 'text-emerald-600 font-medium'
                          : 'text-slate-400'
                      )}
                    >
                      {isSelected ? '填报中' : m.isFilled ? '已填报' : '未录入'}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* 当前月份状态小标 */}
            <div className="shrink-0 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200/80 text-[11px] font-mono text-[#1677ff] font-bold hidden lg:flex items-center gap-1">
              <span>{selectedYear}年{selectedMonth}月</span>
              <span className="text-[10px] text-blue-500 font-normal">填报中</span>
            </div>
          </div>

          {/* 🌟 3. 规整的单行分类过滤栏与搜索框 */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 pb-1">
            {/* 分类快捷切换 Pill */}
            <div className="flex flex-wrap items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => setCategoryFilter('all')}
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors',
                  categoryFilter === 'all'
                    ? 'bg-[#1677ff] text-white font-bold'
                    : 'bg-panel text-muted-foreground hover:bg-slate-200/60'
                )}
              >
                全部 ({entryRows.length})
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('energy')}
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors',
                  categoryFilter === 'energy'
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-panel text-muted-foreground hover:bg-slate-200/60'
                )}
              >
                能源消耗 (5)
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('cost')}
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors',
                  categoryFilter === 'cost'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-panel text-muted-foreground hover:bg-slate-200/60'
                )}
              >
                能源费用 (5)
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('green')}
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors',
                  categoryFilter === 'green'
                    ? 'bg-purple-600 text-white font-bold'
                    : 'bg-panel text-muted-foreground hover:bg-slate-200/60'
                )}
              >
                绿电与绿证 (2)
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('economy')}
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors',
                  categoryFilter === 'economy'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-panel text-muted-foreground hover:bg-slate-200/60'
                )}
              >
                经济与产量 (2)
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('equipment')}
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors',
                  categoryFilter === 'equipment'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-panel text-muted-foreground hover:bg-slate-200/60'
                )}
              >
                重点设备与事件 (3)
              </button>
            </div>

            {/* 搜索框与费用统计小计 */}
            <div className="flex items-center gap-3">
              <div className="relative min-w-[200px]">
                <Search className="size-3.5 text-slate-400 absolute left-2.5 top-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="快速过滤指标名称..."
                  className="w-full pl-8 pr-3 py-1 text-xs rounded-lg bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span>当期费用合计:</span>
                <span className="font-mono font-bold text-amber-600">¥ {currentCostTotal} 万元</span>
              </div>
            </div>
          </div>

          {/* 🌟 4. 极致规整清晰的填报数据表格 (无重复年度月度列，布局开阔整齐) */}
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-panel text-foreground font-semibold">
                  <th className="py-2.5 px-3 w-12 text-center text-slate-400 font-mono">序号</th>
                  <th className="py-2.5 px-3 w-32 text-center font-bold">业务分类</th>
                  <th className="py-2.5 px-3 w-64 font-bold text-foreground">数据项名称</th>
                  <th className="py-2.5 px-3 w-24 text-center">数据对象</th>
                  <th className="py-2.5 px-3 w-24 text-center">时间维度</th>
                  <th className="py-2.5 px-3 w-20 text-center">单位</th>
                  <th className="py-2.5 px-3 w-64 font-bold text-[#1677ff]">
                    填报录入数值 <span className="text-[10px] font-normal text-slate-400">(直接输入)</span>
                  </th>
                  <th className="py-2.5 px-3">填报说明 / 补充参数</th>
                </tr>
              </thead>
              <tbody className="divide-y border-border/60 text-muted-foreground">
                {rowsWithSpans.map((row, index) => (
                  <tr key={row.id} className="hover:bg-panel/60 transition-colors">
                    {/* 1. 序号 */}
                    <td className="py-2.5 px-3 text-center font-mono text-muted-foreground/80">
                      {index + 1}
                    </td>

                    {/* 2. 业务分类 (第一大列，合并单元格显示) */}
                    {row.isFirstOfCategory && (
                      <td
                        rowSpan={row.categoryRowSpan}
                        className="py-3 px-3 text-center align-middle bg-panel/40 border-r border-border/60"
                      >
                        <div className="flex flex-col items-center justify-center gap-1">
                          <span
                            className={cn(
                              'px-2.5 py-1 rounded-md text-[11px] font-bold shadow-2xs',
                              row.category === 'energy'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : row.category === 'cost'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : row.category === 'green'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : row.category === 'economy'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            )}
                          >
                            {row.categoryLabel}
                          </span>
                          <span className="text-[10px] text-muted-foreground/80 font-mono">
                            {row.categoryRowSpan} 项
                          </span>
                        </div>
                      </td>
                    )}

                    {/* 3. 数据项名称 */}
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-foreground text-xs">{row.name}</div>
                    </td>

                    {/* 4. 数据对象 */}
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-foreground font-mono font-medium">
                        {row.target}
                      </span>
                    </td>

                    {/* 5. 时间维度 */}
                    <td className="py-2.5 px-3 font-mono text-[11px] text-center text-foreground">
                      {row.dimension}
                    </td>

                    {/* 6. 数据单位 */}
                    <td className="py-2.5 px-3 font-bold font-mono text-center text-slate-700">
                      {row.unit}
                    </td>

                    {/* 7. 填报录入数值 (整洁专业的行内输入框) */}
                    <td className="py-2 px-3">
                      <div className="relative flex items-center">
                        <input
                          type={row.unit === '事件/时间' ? 'text' : 'number'}
                          value={row.value}
                          onChange={(e) => handleValueChange(row.id, e.target.value)}
                          className="w-full pl-3 pr-12 py-1.5 text-xs font-mono font-bold rounded-lg border border-border bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 shadow-2xs"
                          placeholder="请输入数值..."
                        />
                        <span className="absolute right-3 text-[11px] font-bold text-slate-400 font-mono select-none pointer-events-none">
                          {row.unit}
                        </span>
                      </div>
                    </td>

                    {/* 8. 填报说明 / 补充信息 */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={row.remark}
                        onChange={(e) => handleRemarkChange(row.id, e.target.value)}
                        className="w-full px-2.5 py-1.5 text-[11px] rounded-lg border border-border bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-600 transition-colors"
                        placeholder="选填备注..."
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 🌟 5. 极简规整的底部操作栏 */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Info className="size-3.5 text-blue-500 shrink-0" />
              <span>
                当前填报属于【{selectedYear}年{selectedMonth}月】。数据保存后将自动归入台账并驱动大屏展示与能碳核算。
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleSaveEntry('待复核')}
                className="px-3.5 py-1.5 rounded-lg border border-border bg-panel text-xs font-semibold text-foreground hover:bg-slate-200/60 cursor-pointer transition-colors"
              >
                暂存草稿
              </button>
              <button
                type="button"
                onClick={() => handleSaveEntry('已入库')}
                className="flex items-center gap-1.5 px-5 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
              >
                <Save className="size-3.5" />
                <span>一键保存入库</span>
              </button>
            </div>
          </div>
        </Panel>
      )}

      {/* ========================================================================= */}
      {/* 视图 2：历史填报台账 (内页模式) */}
      {/* ========================================================================= */}
      {viewMode === 'history' && (
        <Panel className="p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <History className="size-4.5 text-[#1677ff]" />
              <h3 className="text-sm font-bold text-foreground">历史填报台账全量归档</h3>
              <Badge tone="info">{historyList.length} 个归档批次</Badge>
            </div>
            <button
              type="button"
              onClick={() => alert('正在导出历史台账 (Excel)...')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-panel hover:bg-slate-200/60 text-xs font-semibold text-foreground cursor-pointer transition-colors"
            >
              <Download className="size-3.5 text-slate-500" />
              <span>导出台账 (Excel)</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-panel text-foreground font-semibold">
                  <th className="py-2.5 px-3">批次单号</th>
                  <th className="py-2.5 px-3 text-center">所属账期</th>
                  <th className="py-2.5 px-3 font-bold">17项指标录入摘要</th>
                  <th className="py-2.5 px-3 text-right">能源费用合计</th>
                  <th className="py-2.5 px-3">填报人</th>
                  <th className="py-2.5 px-3">录入时间</th>
                  <th className="py-2.5 px-3 text-center">状态</th>
                  <th className="py-2.5 px-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y border-border/60 text-muted-foreground">
                {historyList.map((h) => (
                  <tr key={h.id} className="hover:bg-panel/60 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-foreground">{h.batch}</td>
                    <td className="py-2.5 px-3 font-mono text-center font-bold text-blue-600">{h.year}年{h.month}月</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-foreground">{h.summary}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-600 text-right">¥ {h.totalCostWan} 万</td>
                    <td className="py-2.5 px-3">{h.submitter}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-400 text-[11px]">{h.submitTime}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 font-bold">
                        {h.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteHistory(h.id)}
                        className="text-rose-500 hover:underline cursor-pointer"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </div>
  )
}
