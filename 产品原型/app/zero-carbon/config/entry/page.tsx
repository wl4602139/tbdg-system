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
  Filter,
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
  source: string          // 数据来源
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
    source: '系统接入/系统界面手动录入',
    value: '8900',
    remark: '自来水表底抄报核对',
  },
  {
    id: 'row-2',
    name: '天然气量',
    category: 'energy',
    categoryLabel: '能源消耗量',
    target: '工厂',
    dimension: '月度',
    unit: 'm³',
    source: '系统界面手动录入',
    value: '28400',
    remark: '燃气锅炉与食堂加热消耗',
  },
  {
    id: 'row-3',
    name: '外购蒸汽量',
    category: 'energy',
    categoryLabel: '能源消耗量',
    target: '工厂',
    dimension: '月度',
    unit: 't',
    source: '系统接入/系统界面手动录入',
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
    source: '系统接入/系统界面手动录入',
    value: '320',
    remark: '发电机组与厂区叉车加油量',
  },
  {
    id: 'row-5',
    name: '液氧',
    category: 'energy',
    categoryLabel: '能源消耗量',
    target: '工厂',
    dimension: '月度',
    unit: 't',
    source: '系统界面手动录入',
    value: '45.0',
    remark: '工业切割与焊接助燃液氧',
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
    source: '录入',
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
    source: '录入',
    value: '8.52',
    remark: '燃气公司月度对账结算发票',
  },
  {
    id: 'row-8',
    name: '外购蒸汽费用',
    category: 'cost',
    categoryLabel: '能源费用',
    target: '工厂',
    dimension: '月度',
    unit: '万元',
    source: '录入',
    value: '32.66',
    remark: '园区热力公司结算凭单金额',
  },
  {
    id: 'row-9',
    name: '用水费用',
    category: 'cost',
    categoryLabel: '能源费用',
    target: '工厂',
    dimension: '月度',
    unit: '万元',
    source: '录入',
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
    source: '录入',
    value: '0.24',
    remark: '柴油采购发票与加油卡对账',
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
    source: '系统界面手动录入',
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
    source: '系统界面手动录入',
    value: '18000',
    remark: 'GEC绿证凭证号: CN-GEC-2026-HM-00921',
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
    source: '系统界面手动录入',
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
    source: '系统界面手动录入',
    value: '128',
    remark: '变压器产业代表性产品规格完工量',
  },

  // 5. 重点用能设备与项目事件 (3项)
  {
    id: 'row-15',
    name: '达到或优于能效强制性国家标准2级的设备明细',
    category: 'equipment',
    categoryLabel: '用能设备与事件',
    target: '工厂',
    dimension: '增量更新',
    unit: 'kW',
    source: '系统界面手动录入',
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
    source: '系统界面手动录入',
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
    source: '系统界面手动录入',
    value: '光伏扩建并网',
    remark: '2.8MWp分布式光伏扩建工程投运 (已附全景航拍图)',
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

// 12 个月度卡片定义
const MONTH_CARDS = [
  { value: '01', label: '01月', isFilled: true },
  { value: '02', label: '02月', isFilled: true },
  { value: '03', label: '03月', isFilled: true },
  { value: '04', label: '04月', isFilled: true },
  { value: '05', label: '05月', isFilled: true },
  { value: '06', label: '06月', isFilled: true },
  { value: '07', label: '07月', isFilled: true },
  { value: '08', label: '08月', isFilled: false },
  { value: '09', label: '09月', isFilled: false },
  { value: '10', label: '10月', isFilled: false },
  { value: '11', label: '11月', isFilled: false },
  { value: '12', label: '12月', isFilled: false },
]

export default function ManualEntryPage() {
  // 页面模式：'entry' (填报清单列表页) | 'history' (历史台账内页)
  const [viewMode, setViewMode] = useState<'entry' | 'history'>('entry')

  // 填报数据对应年、月度 (移除数据对象单位下拉)
  const [selectedYear, setSelectedYear] = useState('2026')
  const [selectedMonth, setSelectedMonth] = useState('08')
  const [submitterName, setSubmitterName] = useState('李工 (能碳专员)')

  // 列表填报数据源
  const [entryRows, setEntryRows] = useState<EntryRowItem[]>(INITIAL_ENTRY_ROWS)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // 历史台账数据源 (内页专用)
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

  // 🌟 计算业务分类在第一列连续行中的合并跨度 (rowSpan)
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

  // 提交保存处理
  const handleSaveEntry = (status: '已入库' | '待复核') => {
    const now = new Date()
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const batchCode = `DR-${selectedYear}${selectedMonth}-${String(historyList.length + 1).padStart(2, '0')}`

    const costRows = entryRows.filter((r) => r.category === 'cost')
    const totalCost = costRows
      .reduce((sum, r) => sum + (parseFloat(r.value) || 0), 0)
      .toFixed(2)

    const summaryText = `水 ${entryRows[0].value}t · 气 ${entryRows[1].value}m³ · 汽 ${entryRows[2].value}t · 购绿电 ${entryRows[10].value}MWh · 增加值 ¥${entryRows[12].value}万`

    const newRecord: HistoryRecord = {
      id: `REC-${Date.now()}`,
      batch: batchCode,
      year: selectedYear,
      month: selectedMonth,
      submitter: submitterName,
      submitTime: timeStr,
      summary: summaryText,
      totalCostWan: totalCost,
      status,
    }

    setHistoryList([newRecord, ...historyList])
    setSuccessToast({
      show: true,
      msg: `${selectedYear}年${selectedMonth}月全量清单数据已成功${status === '已入库' ? '校验入库' : '保存待复核'}！已记入历史台账内页。`,
      batch: batchCode,
    })

    setTimeout(() => {
      setSuccessToast({ show: false, msg: '', batch: '' })
    }, 5000)
  }

  const handleDeleteHistory = (id: string) => {
    if (confirm('确认从历史台账中删除此批次记录？')) {
      setHistoryList(historyList.filter((h) => h.id !== id))
    }
  }

  return (
    <div className="space-y-4">
      {/* 🌟 1. 顶部标题栏：已按要求移除右上角模块，页面清爽直观 */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 border border-primary/30 text-primary">
            {viewMode === 'entry' ? <FileEdit className="size-5" /> : <History className="size-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-foreground">
                {viewMode === 'entry' ? '能碳业务数据填报' : '历史填报台账明细 (内页)'}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-[#1677ff] border border-blue-500/20 font-bold">
                {viewMode === 'entry' ? '月度卡片切换 · 清单17项指标' : '历史归档记录'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {viewMode === 'entry'
                ? '严格基于《数据需求清单》，仅保留数据来源为“录入”的 17 项核心指标。'
                : '已归档的月度填报台账全量记录，支持检索、核对与导出。'}
            </p>
          </div>
        </div>

        {/* 内页返回按钮 (仅在历史台账内页时显示) */}
        {viewMode === 'history' && (
          <button
            type="button"
            onClick={() => setViewMode('entry')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
          >
            <ArrowLeft className="size-3.5" />
            <span>返回数据填报页</span>
          </button>
        )}
      </div>

      {/* 成功提醒横幅 */}
      {successToast.show && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/90 p-3.5 text-xs text-emerald-800 shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">入库成功（批次单号：{successToast.batch}）：</span>
              <span>{successToast.msg}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSuccessToast({ show: false, msg: '', batch: '' })}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 视图 1：列表形式填报页 (已移除数据对象，月度改为卡片形式) */}
      {/* ========================================================================= */}
      {viewMode === 'entry' && (
        <Panel className="p-4 space-y-3.5">
          {/* 🌟 核心要求：已移除数据对象；月度改为卡片形式展示 */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-border bg-panel">
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
              {/* 年度选择下拉 */}
              <div className="flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-xs shadow-2xs shrink-0">
                <Calendar className="size-4 text-blue-500" />
                <span className="font-semibold text-muted-foreground">年度:</span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="border-0 bg-transparent text-xs font-mono font-bold text-foreground focus:outline-none cursor-pointer"
                >
                  <option value="2026">2026 年度</option>
                  <option value="2025">2025 年度</option>
                  <option value="2024">2024 年度</option>
                </select>
              </div>

              {/* 🌟 12 个月度卡片 (直观卡片形式切换填报月度) */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none flex-1">
                {MONTH_CARDS.map((m) => {
                  const isSelected = selectedMonth === m.value
                  return (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setSelectedMonth(m.value)}
                      className={cn(
                        'flex flex-col items-center justify-center py-1.5 px-3 rounded-xl border text-center transition-all cursor-pointer select-none min-w-[58px]',
                        isSelected
                          ? 'bg-[#1677ff] text-white border-blue-600 shadow-sm ring-2 ring-blue-400/30'
                          : 'bg-white hover:bg-slate-100/80 border-border text-foreground'
                      )}
                    >
                      <span className="text-xs font-bold font-mono">{m.label}</span>
                      <span
                        className={cn(
                          'text-[9px] mt-0.5 font-medium',
                          isSelected
                            ? 'text-white/90 font-bold'
                            : m.isFilled
                            ? 'text-emerald-600'
                            : 'text-slate-400'
                        )}
                      >
                        {isSelected ? '填报中' : m.isFilled ? '已填报' : '待填报'}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 操作按钮区 (历史台账内页入口 + 保存按钮) */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('history')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-white hover:bg-slate-100 text-xs font-semibold text-foreground cursor-pointer transition-colors shadow-2xs"
                title="查看历史台账内页"
              >
                <History className="size-3.5 text-[#1677ff]" />
                <span>历史台账内页 ({historyList.length})</span>
                <ArrowRight className="size-3 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleSaveEntry('已入库')}
                className="flex items-center gap-1.5 px-4.5 py-2 rounded-xl bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
              >
                <Save className="size-3.5" />
                <span>保存并入库</span>
              </button>
            </div>
          </div>

          {/* 工具栏：类别筛选器 + 搜索框 */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
            {/* 分类快捷筛选 */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-xs text-muted-foreground/80 mr-1 font-semibold flex items-center gap-1">
                <Filter className="size-3.5" />
                分类过滤:
              </span>
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
                全部指标 (17)
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
                能源消耗量 (5)
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
                用能设备与事件 (3)
              </button>
            </div>

            {/* 搜索框 */}
            <div className="relative min-w-[200px]">
              <Search className="size-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索数据项名称 / 单位 / 对象..."
                className="w-full pl-8 pr-3 py-1 text-xs rounded-lg bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
              />
            </div>
          </div>

          {/* 🌟 核心填报列表表格 (业务分类第1列合并显示，明确显示数据对应年、月度卡片联动) */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-panel text-foreground font-semibold">
                  <th className="py-2.5 px-3 w-32 text-center font-bold">业务分类</th>
                  <th className="py-2.5 px-3 w-12 text-center">序号</th>
                  <th className="py-2.5 px-3 w-48 font-bold">数据项名称</th>
                  <th className="py-2.5 px-3 w-20 text-center">数据对象</th>
                  <th className="py-2.5 px-3 w-20 text-center font-bold text-blue-600">对应年度</th>
                  <th className="py-2.5 px-3 w-20 text-center font-bold text-emerald-600">对应月度</th>
                  <th className="py-2.5 px-3 w-20 text-center">时间维度</th>
                  <th className="py-2.5 px-3 w-16 text-center">单位</th>
                  <th className="py-2.5 px-3 w-56 font-bold text-[#1677ff]">
                    填报录入数值 <span className="text-[10px] font-normal text-slate-400">(直接输入)</span>
                  </th>
                  <th className="py-2.5 px-3">填报说明 / 补充信息</th>
                </tr>
              </thead>
              <tbody className="divide-y border-border/60 text-muted-foreground">
                {rowsWithSpans.map((row, index) => (
                  <tr key={row.id} className="hover:bg-blue-50/20 transition-colors">
                    {/* 1. 业务分类 (第一列，合并单元格显示) */}
                    {row.isFirstOfCategory && (
                      <td
                        rowSpan={row.categoryRowSpan}
                        className="py-3 px-3 text-center align-middle bg-panel/50 border-r border-border/60"
                      >
                        <div className="flex flex-col items-center justify-center gap-1.5 py-1">
                          <span
                            className={cn(
                              'px-2.5 py-1 rounded-lg text-xs font-bold shadow-2xs',
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
                          <span className="text-[10px] text-muted-foreground/80 font-mono font-medium">
                            ({row.categoryRowSpan} 项)
                          </span>
                        </div>
                      </td>
                    )}

                    {/* 2. 序号 */}
                    <td className="py-2.5 px-3 text-center font-mono text-muted-foreground/80">
                      {index + 1}
                    </td>

                    {/* 3. 数据项名称 */}
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-foreground">{row.name}</div>
                      <div className="text-[10px] text-muted-foreground/80 truncate">{row.source}</div>
                    </td>

                    {/* 4. 数据对象 */}
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-foreground font-mono font-medium">
                        {row.target}
                      </span>
                    </td>

                    {/* 5. 对应年度 */}
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-600">
                      {selectedYear} 年
                    </td>

                    {/* 6. 对应月度 (与选中的月度卡片联动) */}
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-600">
                      {row.dimension === '增量更新' ? '增量/基准' : `${selectedMonth} 月`}
                    </td>

                    {/* 7. 时间维度 */}
                    <td className="py-2.5 px-3 font-mono text-[11px] text-center text-foreground">
                      {row.dimension}
                    </td>

                    {/* 8. 数据单位 */}
                    <td className="py-2.5 px-3 font-bold font-mono text-center text-slate-700">
                      {row.unit}
                    </td>

                    {/* 9. 填报录入数值 (直接行内输入框) */}
                    <td className="py-2.5 px-3">
                      <div className="relative flex items-center">
                        <input
                          type={row.unit === '事件/时间' ? 'text' : 'number'}
                          value={row.value}
                          onChange={(e) => handleValueChange(row.id, e.target.value)}
                          className="w-full pl-2.5 pr-12 py-1.5 text-xs font-mono font-bold rounded-lg border border-border bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary shadow-2xs focus:ring-1 focus:ring-blue-500"
                          placeholder="请输入..."
                        />
                        <span className="absolute right-2.5 text-[10px] font-bold text-slate-400 font-mono select-none">
                          {row.unit}
                        </span>
                      </div>
                    </td>

                    {/* 10. 填报说明 / 补充信息 */}
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={row.remark}
                        onChange={(e) => handleRemarkChange(row.id, e.target.value)}
                        className="w-full px-2 py-1 text-[11px] rounded border border-transparent hover:border-slate-200 focus:border-blue-400 bg-transparent text-slate-600 focus:bg-white focus:outline-none transition-colors"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 列表底部快捷提交底栏 */}
          <div className="pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Info className="size-4 text-blue-500 shrink-0" />
              <span>当前填报数据归入【{selectedYear}年{selectedMonth}月】账期。</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSaveEntry('待复核')}
                className="px-4 py-2 rounded-lg border border-border bg-panel text-xs font-semibold text-foreground hover:bg-slate-200/60 cursor-pointer transition-colors"
              >
                暂存草稿
              </button>
              <button
                type="button"
                onClick={() => handleSaveEntry('已入库')}
                className="flex items-center gap-1.5 px-6 py-2 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
              >
                <Save className="size-4" />
                <span>保存并正式入库</span>
              </button>
            </div>
          </div>
        </Panel>
      )}

      {/* ========================================================================= */}
      {/* 视图 2：历史填报台账 (内页模式 viewMode === 'history') */}
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
                  <th className="py-2.5 px-3 text-center">对应年度</th>
                  <th className="py-2.5 px-3 text-center">对应月度</th>
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
                  <tr key={h.id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-foreground">{h.batch}</td>
                    <td className="py-2.5 px-3 font-mono text-center font-bold text-blue-600">{h.year} 年</td>
                    <td className="py-2.5 px-3 font-mono text-center font-bold text-emerald-600">{h.month} 月</td>
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
