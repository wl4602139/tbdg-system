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
  Download,
  Info,
  Image as ImageIcon,
  Upload,
  Plus,
  Trash2,
  X,
  Cpu,
  Sparkles,
  Eye,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { Panel, Badge } from '@/components/shared/primitives'
import { cn } from '@/lib/utils'

// 设备明细模型
interface EquipmentItem {
  id: string
  name: string
  type: '电动机' | '变压器' | '工业锅炉' | '风机' | '容积式空气压缩机' | '工业制冷设备' | '热泵' | '其他重点装备'
  usage: string
  powerKw: number
  standardLevel: '1级 (超高效)' | '2级 (达到国标)' | '未达标/无标准'
  deployDate: string
}

// 零碳关键事件模型
interface KeyEventItem {
  id: string
  date: string
  title: string
  type: '光伏并网' | '储能投运' | '碳足迹上线' | '零碳认证' | '技改节电'
}

// 常规数据项行定义
interface EntryRowItem {
  id: string
  name: string
  category: 'energy' | 'cost' | 'green' | 'economy' | 'equipment' | 'park'
  categoryLabel: string
  target: '工厂' | '园区及工厂' | '园区/工厂'
  dimension: '日/月' | '月度' | '月' | '月度/年度' | '增量更新' | '静态/定期'
  unit: string
  value: string
  remark: string
  type: 'number' | 'photo' | 'event' | 'project_info_photo'
  detailScope?: string
}

const INITIAL_EQUIPMENT_LEVEL2: EquipmentItem[] = [
  { id: 'eq-1', name: '超高效变频永磁同步电机', type: '电动机', usage: '主厂区空压机组主驱', powerKw: 160, standardLevel: '1级 (超高效)', deployDate: '2025-06-15' },
  { id: 'eq-2', name: '非晶合金节能型配电变压器', type: '变压器', usage: '10kV动力变电所主供', powerKw: 1600, standardLevel: '2级 (达到国标)', deployDate: '2024-11-20' },
  { id: 'eq-3', name: '磁悬浮工业冷水离心机组', type: '工业制冷设备', usage: '高压试验大厅恒温空调', powerKw: 850, standardLevel: '1级 (超高效)', deployDate: '2025-04-10' },
  { id: 'eq-4', name: '后倾离心高压节能风机', type: '风机', usage: '浇注车间高效排风除尘', powerKw: 590, standardLevel: '2级 (达到国标)', deployDate: '2025-08-01' },
]

const INITIAL_EQUIPMENT_ALL: EquipmentItem[] = [
  { id: 'eq-5', name: '双螺杆容积式无油空压机', type: '容积式空气压缩机', usage: '全厂动力压缩空气主管网', powerKw: 950, standardLevel: '2级 (达到国标)', deployDate: '2024-08-18' },
  { id: 'eq-6', name: '空气源热泵工业采暖热水机组', type: '热泵', usage: '办公及生活区冬季低碳供暖', powerKw: 700, standardLevel: '2级 (达到国标)', deployDate: '2025-10-12' },
]

const INITIAL_KEY_EVENTS: KeyEventItem[] = [
  { id: 'ev-1', date: '2026-08-15', title: '特变电工沈变本部 2.8MWp 分布式光伏扩建工程顺利并网投运', type: '光伏并网' },
  { id: 'ev-2', date: '2026-06-20', title: '零碳智慧园区能源管理系统 2.0 (SCADA/IoT) 全面验收上线', type: '碳足迹上线' },
  { id: 'ev-3', date: '2026-03-10', title: '通过中国质量认证中心 (CQC) 零碳工厂 (三星级) 现场初核', type: '零碳认证' },
]

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
    remark: '市政自来水水表月度抄报底数',
    type: 'number',
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
    remark: '燃气锅炉与车间烘干加热消耗',
    type: 'number',
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
    remark: '集中供热管网蒸汽抄表结算量',
    type: 'number',
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
    remark: '应急发电机组试车与厂区叉车加油领用',
    type: 'number',
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
    remark: '钢板下料切割与绝缘件加工助燃消耗',
    type: 'number',
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
    remark: '国网电力月度电费增值税发票总额',
    type: 'number',
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
    remark: '新奥燃气月度发票结算金额',
    type: 'number',
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
    remark: '园区热力公司当期发票对账单',
    type: 'number',
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
    remark: '自来水水务集团缴费凭单',
    type: 'number',
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
    remark: '中石化加油卡充值及柴油发票',
    type: 'number',
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
    remark: '三峡能源哈密200MW光伏电站双边交易',
    type: 'number',
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
    remark: '国家绿色电力证书 GEC: CN-GEC-2026-HM-00921',
    type: 'number',
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
    remark: '政府统计局联网直报口径工业增加值',
    type: 'number',
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
    remark: '特高压变压器与箱变产成品完工入库量',
    type: 'number',
  },

  // 5. 零碳园区 (3项)
  {
    id: 'row-17',
    name: '园区照片',
    category: 'park',
    categoryLabel: '零碳园区',
    target: '园区/工厂',
    dimension: '静态/定期',
    unit: '/',
    value: '2张已上传',
    remark: '园区高空全貌航拍图、厂区主大门实景（大屏背景与园区轮播展示）',
    type: 'photo',
  },
  {
    id: 'row-18',
    name: '零碳关键事件',
    category: 'park',
    categoryLabel: '零碳园区',
    target: '园区/工厂',
    dimension: '增量更新',
    unit: '事件/时间',
    value: '2026-08-15 光伏扩建并网',
    remark: '光伏并网、储能并网、碳足迹系统上线、零碳工厂申报及第三方核查认证等关键里程碑',
    type: 'event',
  },
  {
    id: 'row-19',
    name: '零碳项目基本信息、照片',
    category: 'park',
    categoryLabel: '零碳园区',
    target: '园区/工厂',
    dimension: '增量更新',
    unit: '/',
    value: '沈变屋顶光伏二期 (2.8MWp)',
    remark: '零碳技改项目基本参数、建设内容与现场施工/投运实景照片',
    type: 'project_info_photo',
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

  // 设备明细台账数据源 (融入主表格中)
  const [equipListLevel2, setEquipListLevel2] = useState<EquipmentItem[]>(INITIAL_EQUIPMENT_LEVEL2)
  const [equipListAll, setEquipListAll] = useState<EquipmentItem[]>(INITIAL_EQUIPMENT_ALL)

  // 展开状态
  const [isLevel2Expanded, setIsLevel2Expanded] = useState(true)
  const [isAllEquipExpanded, setIsAllEquipExpanded] = useState(true)

  // 照片管理数据
  const [parkPhotos, setParkPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=500&auto=format&fit=crop&q=60',
  ])
  const [projectPhotos, setProjectPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=500&auto=format&fit=crop&q=60',
  ])
  const [activePhotoModal, setActivePhotoModal] = useState<'park' | 'project' | null>(null)

  // 零碳关键事件数据
  const [keyEvents, setKeyEvents] = useState<KeyEventItem[]>(INITIAL_KEY_EVENTS)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [newEventDate, setNewEventDate] = useState('2026-08-15')
  const [newEventTitle, setNewEventTitle] = useState('特变电工沈变本部 2.8MWp 分布式光伏扩建工程顺利并网投运')

  // 历史台账数据源
  const [historyList, setHistoryList] = useState<HistoryRecord[]>([
    {
      id: 'REC-01',
      batch: 'DR-202608-01',
      year: '2026',
      month: '08',
      submitter: '李工 (能碳专员)',
      submitTime: '2026-08-28 09:30',
      summary: '用水 8,900t · 气 28,400m³ · 2级重点设备 3,200kW · 零碳园区照片与事件已归档',
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
      summary: '柴油 350L · 液氧 42t · 购绿电 2,100MWh · 绿证 15,000个 · 2级设备 3,200kW',
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

  // 设备功率直接在行内更新
  const handleEquipPowerChange = (target: 'level2' | 'all', id: string, newKw: string) => {
    const val = parseFloat(newKw) || 0
    if (target === 'level2') {
      setEquipListLevel2((prev) => prev.map((e) => (e.id === id ? { ...e, powerKw: val } : e)))
    } else {
      setEquipListAll((prev) => prev.map((e) => (e.id === id ? { ...e, powerKw: val } : e)))
    }
  }

  // 设备用途/位置直接在行内更新
  const handleEquipUsageChange = (target: 'level2' | 'all', id: string, newUsage: string) => {
    if (target === 'level2') {
      setEquipListLevel2((prev) => prev.map((e) => (e.id === id ? { ...e, usage: newUsage } : e)))
    } else {
      setEquipListAll((prev) => prev.map((e) => (e.id === id ? { ...e, usage: newUsage } : e)))
    }
  }

  // 表格行内新增设备行
  const handleAddEquipmentRow = (target: 'level2' | 'all') => {
    const newId = `eq-${Date.now()}`
    const defaultItem: EquipmentItem = {
      id: newId,
      name: target === 'level2' ? '新入网高效电机/变压器' : '新纳入统计用能机组',
      type: target === 'level2' ? '电动机' : '容积式空气压缩机',
      usage: '生产现场主供设备',
      powerKw: 100,
      standardLevel: '2级 (达到国标)',
      deployDate: `${selectedYear}-${selectedMonth}-01`,
    }

    if (target === 'level2') {
      setEquipListLevel2([...equipListLevel2, defaultItem])
      setIsLevel2Expanded(true)
    } else {
      setEquipListAll([...equipListAll, defaultItem])
      setIsAllEquipExpanded(true)
    }
  }

  // 表格行内删除设备行
  const handleDeleteEquipmentRow = (target: 'level2' | 'all', id: string) => {
    if (target === 'level2') {
      setEquipListLevel2(equipListLevel2.filter((e) => e.id !== id))
    } else {
      setEquipListAll(equipListAll.filter((e) => e.id !== id))
    }
  }

  // 计算两类重点设备总功率
  const level2TotalKw = useMemo(() => equipListLevel2.reduce((s, e) => s + e.powerKw, 0), [equipListLevel2])
  const allEquipTotalKw = useMemo(() => equipListAll.reduce((s, e) => s + e.powerKw, 0), [equipListAll])

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

    const summaryText = `水 ${entryRows[0].value}t · 气 ${entryRows[1].value}m³ · 2级重点设备 ${level2TotalKw}kW · 零碳园区已归档`

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
      msg: `${selectedYear}年${selectedMonth}月全量数据（含重点设备明细）已成功${status === '已入库' ? '校验入库' : '保存待复核'}！已记入历史台账。`,
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

  // 模拟添加照片
  const handleAddPhoto = (target: 'park' | 'project') => {
    const sample = 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=500&auto=format&fit=crop&q=60'
    if (target === 'park') {
      setParkPhotos([...parkPhotos, sample])
      alert('已成功模拟上传 1 张园区现场高分照片！')
    } else {
      setProjectPhotos([...projectPhotos, sample])
      alert('已成功模拟上传 1 张零碳项目实景照片！')
    }
  }

  // 添加关键事件
  const handleAddKeyEvent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEventTitle.trim()) return
    const newEv: KeyEventItem = {
      id: `ev-${Date.now()}`,
      date: newEventDate,
      title: newEventTitle,
      type: '光伏并网',
    }
    setKeyEvents([newEv, ...keyEvents])
    setNewEventTitle('')
    alert('已成功添加零碳关键事件！')
  }

  // 重点设备分类所占的主表格 rowSpan（包括主行和各设备子明细行）
  const equipTotalRowSpan = (1 + (isLevel2Expanded ? equipListLevel2.length : 0)) + (1 + (isAllEquipExpanded ? equipListAll.length : 0))

  return (
    <div className="space-y-3.5">
      {/* 🌟 1. 顶部标题栏 */}
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
                {viewMode === 'entry' ? '标准 19 项指标 · 设备台账融入表格' : '归档数据'}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {viewMode === 'entry'
                ? '独立拆分【重点设备】与【零碳园区】，设备明细台账无缝融入主表格，支持行内直接录入设备名称、类型、功率并实时汇总。'
                : '查看以往月份已归档入库的能碳指标与设备资产台账明细。'}
            </p>
          </div>
        </div>

        {/* 顶部操作入口：历史台账内页 */}
        <div className="flex items-center gap-2">
          {viewMode === 'entry' ? (
            <button
              type="button"
              onClick={() => setViewMode('history')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-border bg-panel hover:bg-slate-200/60 text-xs font-semibold text-foreground cursor-pointer transition-colors shadow-2xs"
            >
              <History className="size-3.5 text-[#1677ff]" />
              <span>历史台账 ({historyList.length})</span>
              <ArrowRight className="size-3 text-slate-400" />
            </button>
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
      {/* 视图 1：录入工作台 (设备明细无缝融入主表格) */}
      {/* ========================================================================= */}
      {viewMode === 'entry' && (
        <Panel className="p-3.5 space-y-3">
          {/* 🌟 2. 月度卡片切换条 */}
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

            {/* 12个月度平铺切换卡片 */}
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

          {/* 🌟 3. 单行分类过滤栏 (拆分为【重点设备】和【零碳园区】) */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 pb-1">
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
                全部 (19)
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
                重点设备 (2项及明细)
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('park')}
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors',
                  categoryFilter === 'park'
                    ? 'bg-teal-600 text-white font-bold'
                    : 'bg-panel text-muted-foreground hover:bg-slate-200/60'
                )}
              >
                零碳园区 (3)
              </button>
            </div>
          </div>

          {/* 🌟 4. 设备明细台账完全融入主表格 (同一套表头，行内直接录入与汇总) */}
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-panel text-foreground font-semibold">
                  <th className="py-2.5 px-3 w-14 text-center text-slate-400 font-mono">序号</th>
                  <th className="py-2.5 px-3 w-28 text-center font-bold">业务分类</th>
                  <th className="py-2.5 px-3 w-72 font-bold text-foreground">数据项 / 重点设备名称</th>
                  <th className="py-2.5 px-3 w-20 text-center">数据对象</th>
                  <th className="py-2.5 px-3 w-20 text-center">时间维度</th>
                  <th className="py-2.5 px-3 w-16 text-center">单位</th>
                  <th className="py-2.5 px-3 min-w-[300px] font-bold text-[#1677ff]">
                    录入数值 / 设备明细
                  </th>
                  <th className="py-2.5 px-3">填报说明 / 设备用途与范围</th>
                </tr>
              </thead>
              <tbody className="divide-y border-border/60 text-muted-foreground">
                {/* 1. 能源消耗量 (row-1 ~ row-5) */}
                {(categoryFilter === 'all' || categoryFilter === 'energy') &&
                  entryRows.slice(0, 5).map((row, idx) => (
                    <tr key={row.id} className="hover:bg-panel/60 transition-colors">
                      <td className="py-2.5 px-3 text-center font-mono text-muted-foreground/80">{idx + 1}</td>
                      {idx === 0 && (
                        <td rowSpan={5} className="py-3 px-3 text-center align-middle bg-panel/40 border-r border-border/60">
                          <div className="flex flex-col items-center justify-center gap-1">
                            <span className="px-2 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs whitespace-nowrap">
                              能源消耗量
                            </span>
                            <span className="text-[10px] text-muted-foreground/80 font-mono">5 项</span>
                          </div>
                        </td>
                      )}
                      <td className="py-2.5 px-3 font-bold text-foreground text-xs">{row.name}</td>
                      <td className="py-2.5 px-3 text-center"><span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-foreground font-mono">{row.target}</span></td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-center text-foreground">{row.dimension}</td>
                      <td className="py-2.5 px-3 font-bold font-mono text-center text-slate-700">{row.unit}</td>
                      <td className="py-2 px-3">
                        <div className="relative flex items-center">
                          <input
                            type="number"
                            value={row.value}
                            onChange={(e) => handleValueChange(row.id, e.target.value)}
                            className="w-full pl-3 pr-12 py-1.5 text-xs font-mono font-bold rounded-lg border border-border bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 shadow-2xs"
                            placeholder="请输入数值..."
                          />
                          <span className="absolute right-3 text-[11px] font-bold text-slate-400 font-mono select-none pointer-events-none">{row.unit}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={row.remark}
                          onChange={(e) => handleRemarkChange(row.id, e.target.value)}
                          className="w-full px-2.5 py-1.5 text-[11px] rounded-lg border border-border bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-600"
                        />
                      </td>
                    </tr>
                  ))}

                {/* 2. 能源费用 (row-6 ~ row-10) */}
                {(categoryFilter === 'all' || categoryFilter === 'cost') &&
                  entryRows.slice(5, 10).map((row, idx) => (
                    <tr key={row.id} className="hover:bg-panel/60 transition-colors">
                      <td className="py-2.5 px-3 text-center font-mono text-muted-foreground/80">{idx + 6}</td>
                      {idx === 0 && (
                        <td rowSpan={5} className="py-3 px-3 text-center align-middle bg-panel/40 border-r border-border/60">
                          <div className="flex flex-col items-center justify-center gap-1">
                            <span className="px-2 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs whitespace-nowrap">
                              能源费用
                            </span>
                            <span className="text-[10px] text-muted-foreground/80 font-mono">5 项</span>
                          </div>
                        </td>
                      )}
                      <td className="py-2.5 px-3 font-bold text-foreground text-xs">{row.name}</td>
                      <td className="py-2.5 px-3 text-center"><span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-foreground font-mono">{row.target}</span></td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-center text-foreground">{row.dimension}</td>
                      <td className="py-2.5 px-3 font-bold font-mono text-center text-slate-700">{row.unit}</td>
                      <td className="py-2 px-3">
                        <div className="relative flex items-center">
                          <input
                            type="number"
                            value={row.value}
                            onChange={(e) => handleValueChange(row.id, e.target.value)}
                            className="w-full pl-3 pr-12 py-1.5 text-xs font-mono font-bold rounded-lg border border-border bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 shadow-2xs"
                            placeholder="请输入数值..."
                          />
                          <span className="absolute right-3 text-[11px] font-bold text-slate-400 font-mono select-none pointer-events-none">{row.unit}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={row.remark}
                          onChange={(e) => handleRemarkChange(row.id, e.target.value)}
                          className="w-full px-2.5 py-1.5 text-[11px] rounded-lg border border-border bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-600"
                        />
                      </td>
                    </tr>
                  ))}

                {/* 3. 绿电与绿证 (row-11 ~ row-12) */}
                {(categoryFilter === 'all' || categoryFilter === 'green') &&
                  entryRows.slice(10, 12).map((row, idx) => (
                    <tr key={row.id} className="hover:bg-panel/60 transition-colors">
                      <td className="py-2.5 px-3 text-center font-mono text-muted-foreground/80">{idx + 11}</td>
                      {idx === 0 && (
                        <td rowSpan={2} className="py-3 px-3 text-center align-middle bg-panel/40 border-r border-border/60">
                          <div className="flex flex-col items-center justify-center gap-1">
                            <span className="px-2 py-1 rounded-md text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs whitespace-nowrap">
                              绿电与绿证
                            </span>
                            <span className="text-[10px] text-muted-foreground/80 font-mono">2 项</span>
                          </div>
                        </td>
                      )}
                      <td className="py-2.5 px-3 font-bold text-foreground text-xs">{row.name}</td>
                      <td className="py-2.5 px-3 text-center"><span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-foreground font-mono">{row.target}</span></td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-center text-foreground">{row.dimension}</td>
                      <td className="py-2.5 px-3 font-bold font-mono text-center text-slate-700">{row.unit}</td>
                      <td className="py-2 px-3">
                        <div className="relative flex items-center">
                          <input
                            type="number"
                            value={row.value}
                            onChange={(e) => handleValueChange(row.id, e.target.value)}
                            className="w-full pl-3 pr-12 py-1.5 text-xs font-mono font-bold rounded-lg border border-border bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 shadow-2xs"
                            placeholder="请输入数值..."
                          />
                          <span className="absolute right-3 text-[11px] font-bold text-slate-400 font-mono select-none pointer-events-none">{row.unit}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={row.remark}
                          onChange={(e) => handleRemarkChange(row.id, e.target.value)}
                          className="w-full px-2.5 py-1.5 text-[11px] rounded-lg border border-border bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-600"
                        />
                      </td>
                    </tr>
                  ))}

                {/* 4. 经济与产量 (row-13 ~ row-14) */}
                {(categoryFilter === 'all' || categoryFilter === 'economy') &&
                  entryRows.slice(12, 14).map((row, idx) => (
                    <tr key={row.id} className="hover:bg-panel/60 transition-colors">
                      <td className="py-2.5 px-3 text-center font-mono text-muted-foreground/80">{idx + 13}</td>
                      {idx === 0 && (
                        <td rowSpan={2} className="py-3 px-3 text-center align-middle bg-panel/40 border-r border-border/60">
                          <div className="flex flex-col items-center justify-center gap-1">
                            <span className="px-2 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs whitespace-nowrap">
                              经济与产量
                            </span>
                            <span className="text-[10px] text-muted-foreground/80 font-mono">2 项</span>
                          </div>
                        </td>
                      )}
                      <td className="py-2.5 px-3 font-bold text-foreground text-xs">{row.name}</td>
                      <td className="py-2.5 px-3 text-center"><span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-foreground font-mono">{row.target}</span></td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-center text-foreground">{row.dimension}</td>
                      <td className="py-2.5 px-3 font-bold font-mono text-center text-slate-700">{row.unit}</td>
                      <td className="py-2 px-3">
                        <div className="relative flex items-center">
                          <input
                            type="number"
                            value={row.value}
                            onChange={(e) => handleValueChange(row.id, e.target.value)}
                            className="w-full pl-3 pr-12 py-1.5 text-xs font-mono font-bold rounded-lg border border-border bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 shadow-2xs"
                            placeholder="请输入数值..."
                          />
                          <span className="absolute right-3 text-[11px] font-bold text-slate-400 font-mono select-none pointer-events-none">{row.unit}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={row.remark}
                          onChange={(e) => handleRemarkChange(row.id, e.target.value)}
                          className="w-full px-2.5 py-1.5 text-[11px] rounded-lg border border-border bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-600"
                        />
                      </td>
                    </tr>
                  ))}

                {/* 5. 🌟 重点设备分类 (台账明细完全融入主表格) */}
                {(categoryFilter === 'all' || categoryFilter === 'equipment') && (
                  <>
                    {/* A. 主指标 15：达到或优于能效强制性国家标准 2 级设备明细 */}
                    <tr className="bg-indigo-50/40 font-semibold border-t-2 border-indigo-100">
                      <td className="py-2 px-3 text-center font-mono text-indigo-700 font-bold">15</td>
                      <td rowSpan={equipTotalRowSpan} className="py-3 px-3 text-center align-middle bg-panel/40 border-r border-border/60">
                        <div className="flex flex-col items-center justify-center gap-1">
                          <span className="px-2 py-1 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs whitespace-nowrap">
                            重点设备
                          </span>
                          <span className="text-[10px] text-muted-foreground/80 font-mono">2 大类台账</span>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="font-bold text-indigo-950 text-xs">达到或优于能效强制性国家标准 2 级的设备明细</div>
                        <div className="text-[10px] text-indigo-600 font-normal mt-0.5">
                          范围：电动机、变压器、工业锅炉、风机、容积式空气压缩机、工业制冷设备、热泵等
                        </div>
                      </td>
                      <td className="py-2 px-3 text-center"><span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-mono">工厂</span></td>
                      <td className="py-2 px-3 text-center font-mono text-[11px] text-slate-700">增量更新</td>
                      <td className="py-2 px-3 text-center font-mono font-bold text-indigo-700">kW</td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <div className="flex items-baseline font-mono bg-indigo-100/80 px-2 py-0.5 rounded text-xs">
                            <span className="text-[10px] text-indigo-700 font-normal mr-1">总功率:</span>
                            <span className="font-black text-indigo-950 text-sm">{level2TotalKw.toLocaleString()}</span>
                            <span className="ml-1 text-[10px] font-bold text-indigo-700">kW</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAddEquipmentRow('level2')}
                            className="flex items-center gap-1 px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold cursor-pointer shadow-2xs transition-colors"
                          >
                            <Plus className="size-3" />
                            <span>添加设备行</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsLevel2Expanded(!isLevel2Expanded)}
                            className="flex items-center gap-0.5 text-[11px] text-indigo-600 hover:underline cursor-pointer ml-auto"
                          >
                            <span>{isLevel2Expanded ? '收起明细' : `展开(${equipListLevel2.length}台)`}</span>
                            {isLevel2Expanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                          </button>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-[11px] text-indigo-700 font-medium">
                        纳入统计范围需有适用能效强制性国家标准，无适用标准装备不纳入统计
                      </td>
                    </tr>

                    {/* A 的子设备明细行 (同一套主表格列，融入表格中) */}
                    {isLevel2Expanded &&
                      equipListLevel2.map((eq, i) => (
                        <tr key={eq.id} className="bg-panel/20 hover:bg-indigo-50/60 transition-colors">
                          <td className="py-1.5 px-3 text-center font-mono text-slate-400 text-[11px]">15-{i + 1}</td>
                          <td className="py-1.5 px-3 pl-6">
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-400 font-mono text-xs">↳</span>
                              <input
                                type="text"
                                value={eq.name}
                                onChange={(e) => {
                                  const val = e.target.value
                                  setEquipListLevel2(equipListLevel2.map((item) => (item.id === eq.id ? { ...item, name: val } : item)))
                                }}
                                className="font-semibold text-slate-800 text-xs bg-white border border-slate-200 rounded px-2 py-1 w-52"
                              />
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                                {eq.type}
                              </span>
                            </div>
                          </td>
                          <td className="py-1.5 px-3 text-center"><span className="text-[10px] text-slate-400">工厂</span></td>
                          <td className="py-1.5 px-3 text-center font-mono text-[10px] text-slate-400">{eq.deployDate}</td>
                          <td className="py-1.5 px-3 text-center font-mono text-[11px] text-slate-500">kW</td>
                          <td className="py-1.5 px-3">
                            <div className="flex items-center gap-2">
                              <div className="relative flex items-center w-32">
                                <input
                                  type="number"
                                  value={eq.powerKw}
                                  onChange={(e) => handleEquipPowerChange('level2', eq.id, e.target.value)}
                                  className="w-full pl-2.5 pr-8 py-1 text-xs font-mono font-bold rounded border border-slate-200 bg-white"
                                />
                                <span className="absolute right-2 text-[10px] text-slate-400 font-mono">kW</span>
                              </div>
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                                {eq.standardLevel}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDeleteEquipmentRow('level2', eq.id)}
                                className="text-rose-400 hover:text-rose-600 p-1 cursor-pointer"
                                title="从列表中删除"
                              >
                                <Trash2 className="size-3" />
                              </button>
                            </div>
                          </td>
                          <td className="py-1.5 px-3">
                            <input
                              type="text"
                              value={eq.usage}
                              onChange={(e) => handleEquipUsageChange('level2', eq.id, e.target.value)}
                              placeholder="设备安装位置 / 节能用途说明"
                              className="w-full px-2 py-1 text-[11px] rounded border border-slate-200 bg-white text-slate-600"
                            />
                          </td>
                        </tr>
                      ))}

                    {/* B. 主指标 16：纳入统计范围装备明细 */}
                    <tr className="bg-indigo-50/40 font-semibold border-t border-indigo-100">
                      <td className="py-2 px-3 text-center font-mono text-indigo-700 font-bold">16</td>
                      <td className="py-2 px-3">
                        <div className="font-bold text-indigo-950 text-xs">纳入统计范围装备明细（名称、用途、功率等）</div>
                        <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                          全厂主要用能装备及生产辅助机组汇总
                        </div>
                      </td>
                      <td className="py-2 px-3 text-center"><span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-mono">工厂</span></td>
                      <td className="py-2 px-3 text-center font-mono text-[11px] text-slate-700">增量更新</td>
                      <td className="py-2 px-3 text-center font-mono font-bold text-indigo-700">kW</td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <div className="flex items-baseline font-mono bg-indigo-100/80 px-2 py-0.5 rounded text-xs">
                            <span className="text-[10px] text-indigo-700 font-normal mr-1">总功率:</span>
                            <span className="font-black text-indigo-950 text-sm">{allEquipTotalKw.toLocaleString()}</span>
                            <span className="ml-1 text-[10px] font-bold text-indigo-700">kW</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAddEquipmentRow('all')}
                            className="flex items-center gap-1 px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold cursor-pointer shadow-2xs transition-colors"
                          >
                            <Plus className="size-3" />
                            <span>添加设备行</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsAllEquipExpanded(!isAllEquipExpanded)}
                            className="flex items-center gap-0.5 text-[11px] text-indigo-600 hover:underline cursor-pointer ml-auto"
                          >
                            <span>{isAllEquipExpanded ? '收起明细' : `展开(${equipListAll.length}台)`}</span>
                            {isAllEquipExpanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                          </button>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-[11px] text-slate-600 font-medium">
                        全厂重点用能量测装备清单与装机总功率
                      </td>
                    </tr>

                    {/* B 的子设备明细行 (融入主表格) */}
                    {isAllEquipExpanded &&
                      equipListAll.map((eq, i) => (
                        <tr key={eq.id} className="bg-panel/20 hover:bg-indigo-50/60 transition-colors">
                          <td className="py-1.5 px-3 text-center font-mono text-slate-400 text-[11px]">16-{i + 1}</td>
                          <td className="py-1.5 px-3 pl-6">
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-400 font-mono text-xs">↳</span>
                              <input
                                type="text"
                                value={eq.name}
                                onChange={(e) => {
                                  const val = e.target.value
                                  setEquipListAll(equipListAll.map((item) => (item.id === eq.id ? { ...item, name: val } : item)))
                                }}
                                className="font-semibold text-slate-800 text-xs bg-white border border-slate-200 rounded px-2 py-1 w-52"
                              />
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                                {eq.type}
                              </span>
                            </div>
                          </td>
                          <td className="py-1.5 px-3 text-center"><span className="text-[10px] text-slate-400">工厂</span></td>
                          <td className="py-1.5 px-3 text-center font-mono text-[10px] text-slate-400">{eq.deployDate}</td>
                          <td className="py-1.5 px-3 text-center font-mono text-[11px] text-slate-500">kW</td>
                          <td className="py-1.5 px-3">
                            <div className="flex items-center gap-2">
                              <div className="relative flex items-center w-32">
                                <input
                                  type="number"
                                  value={eq.powerKw}
                                  onChange={(e) => handleEquipPowerChange('all', eq.id, e.target.value)}
                                  className="w-full pl-2.5 pr-8 py-1 text-xs font-mono font-bold rounded border border-slate-200 bg-white"
                                />
                                <span className="absolute right-2 text-[10px] text-slate-400 font-mono">kW</span>
                              </div>
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                                {eq.standardLevel}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDeleteEquipmentRow('all', eq.id)}
                                className="text-rose-400 hover:text-rose-600 p-1 cursor-pointer"
                                title="从列表中删除"
                              >
                                <Trash2 className="size-3" />
                              </button>
                            </div>
                          </td>
                          <td className="py-1.5 px-3">
                            <input
                              type="text"
                              value={eq.usage}
                              onChange={(e) => handleEquipUsageChange('all', eq.id, e.target.value)}
                              placeholder="设备安装位置 / 运行用途"
                              className="w-full px-2 py-1 text-[11px] rounded border border-slate-200 bg-white text-slate-600"
                            />
                          </td>
                        </tr>
                      ))}
                  </>
                )}

                {/* 6. 🌟 零碳园区分类 (row-17 ~ row-19) */}
                {(categoryFilter === 'all' || categoryFilter === 'park') &&
                  entryRows.slice(14, 17).map((row, idx) => (
                    <tr key={row.id} className="hover:bg-panel/60 transition-colors border-t border-slate-200">
                      <td className="py-2.5 px-3 text-center font-mono text-muted-foreground/80">{idx + 17}</td>
                      {idx === 0 && (
                        <td rowSpan={3} className="py-3 px-3 text-center align-middle bg-panel/40 border-r border-border/60">
                          <div className="flex flex-col items-center justify-center gap-1">
                            <span className="px-2 py-1 rounded-md text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200 shadow-2xs whitespace-nowrap">
                              零碳园区
                            </span>
                            <span className="text-[10px] text-muted-foreground/80 font-mono">3 项</span>
                          </div>
                        </td>
                      )}
                      <td className="py-2.5 px-3 font-bold text-foreground text-xs">{row.name}</td>
                      <td className="py-2.5 px-3 text-center"><span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-foreground font-mono">{row.target}</span></td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-center text-foreground">{row.dimension}</td>
                      <td className="py-2.5 px-3 font-bold font-mono text-center text-slate-700">{row.unit === '/' ? '-' : row.unit}</td>
                      <td className="py-2 px-3">
                        {/* 园区照片 */}
                        {row.type === 'photo' && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setActivePhotoModal('park')}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-teal-300 bg-teal-50/60 hover:bg-teal-100 text-teal-700 text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                            >
                              <ImageIcon className="size-3.5" />
                              <span>管理园区照片 ({parkPhotos.length}张已上传)</span>
                            </button>
                          </div>
                        )}

                        {/* 零碳关键事件 */}
                        {row.type === 'event' && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setIsEventModalOpen(true)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal-200 bg-teal-50/60 hover:bg-teal-100 text-teal-700 text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                            >
                              <Sparkles className="size-3.5 text-amber-500" />
                              <span>登记关键事件 ({keyEvents.length}条)</span>
                            </button>
                            <span className="text-[11px] font-mono text-slate-500 truncate max-w-[140px]">
                              最新: {keyEvents[0]?.date}
                            </span>
                          </div>
                        )}

                        {/* 零碳项目基本信息、照片 */}
                        {row.type === 'project_info_photo' && (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={row.value}
                              onChange={(e) => handleValueChange(row.id, e.target.value)}
                              placeholder="如：沈变屋顶2.8MWp光伏二期"
                              className="w-48 pl-2.5 pr-2 py-1.5 text-xs rounded-lg border border-border bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
                            />
                            <button
                              type="button"
                              onClick={() => setActivePhotoModal('project')}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-dashed border-teal-300 bg-teal-50/70 hover:bg-teal-100 text-teal-700 text-xs font-bold cursor-pointer transition-colors shrink-0 shadow-2xs"
                            >
                              <Upload className="size-3" />
                              <span>现场实景 ({projectPhotos.length}张)</span>
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={row.remark}
                          onChange={(e) => handleRemarkChange(row.id, e.target.value)}
                          className="w-full px-2.5 py-1.5 text-[11px] rounded-lg border border-border bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-600"
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* 🌟 5. 底部操作栏：右侧增加足够间距 (pr-48)，彻底避开右下角 AI 助手悬浮球遮挡 */}
          <div className="pt-3 pb-2 border-t border-border/60 flex flex-wrap items-center justify-between gap-3 text-xs pr-48">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Info className="size-3.5 text-blue-500 shrink-0" />
              <span>
                当前填报属于【{selectedYear}年{selectedMonth}月】账期 · 费用合计：<span className="font-mono font-bold text-amber-600">¥ {currentCostTotal} 万元</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSaveEntry('待复核')}
                className="px-4 py-2 rounded-lg border border-border bg-white hover:bg-slate-50 text-xs font-semibold text-foreground cursor-pointer shadow-2xs transition-colors"
              >
                暂存草稿
              </button>
              <button
                type="button"
                onClick={() => handleSaveEntry('已入库')}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
              >
                <Save className="size-4" />
                <span>一键保存正式入库</span>
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
                  <th className="py-2.5 px-3 font-bold">填报指标与资产摘要</th>
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

      {/* ========================================================================= */}
      {/* 照片管理弹窗 */}
      {/* ========================================================================= */}
      {activePhotoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl border bg-card border-border shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-border/60 flex items-center justify-between bg-panel">
              <div className="flex items-center gap-2">
                <ImageIcon className="size-5 text-[#1677ff]" />
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    {activePhotoModal === 'park' ? '园区实景照片采集与管理' : '零碳项目现场照片采集与管理'}
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    支持 JPG, PNG 格式，单张最大 10MB。用于集控中心大屏轮播展示与零碳项目验收。
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActivePhotoModal(null)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(activePhotoModal === 'park' ? parkPhotos : projectPhotos).map((url, idx) => (
                  <div key={idx} className="relative group rounded-xl border border-border overflow-hidden aspect-video bg-slate-100 shadow-2xs">
                    <img src={url} alt="现场实景" className="size-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => alert('全屏高清大图查看')}
                        className="p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-800 cursor-pointer"
                      >
                        <Eye className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('确认删除这张照片？')) {
                            if (activePhotoModal === 'park') setParkPhotos(parkPhotos.filter((_, i) => i !== idx))
                            else setProjectPhotos(projectPhotos.filter((_, i) => i !== idx))
                          }
                        }}
                        className="p-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white cursor-pointer"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => handleAddPhoto(activePhotoModal)}
                  className="aspect-video rounded-xl border-2 border-dashed border-teal-300 hover:border-teal-500 bg-teal-50/40 hover:bg-teal-50 flex flex-col items-center justify-center gap-1 text-teal-700 cursor-pointer transition-all"
                >
                  <Upload className="size-5" />
                  <span className="text-xs font-bold">+ 点击上传照片</span>
                </button>
              </div>
            </div>

            <div className="p-3 border-t border-border/60 flex justify-end bg-panel">
              <button
                type="button"
                onClick={() => setActivePhotoModal(null)}
                className="px-4 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-bold cursor-pointer"
              >
                完成
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 零碳关键事件登记弹窗 */}
      {/* ========================================================================= */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl border bg-card border-border shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-border/60 flex items-center justify-between bg-panel">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-amber-500" />
                <div>
                  <h3 className="text-sm font-bold text-foreground">零碳关键事件登记（事件/时间）</h3>
                  <p className="text-[11px] text-muted-foreground">
                    涵盖光伏并网、储能投运、碳足迹系统上线、零碳工厂申报及认证等重大里程碑。
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEventModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <form onSubmit={handleAddKeyEvent} className="p-3 rounded-xl border border-border bg-panel space-y-2.5">
                <div className="text-xs font-bold text-foreground">+ 新增关键事件</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="date"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="p-2 text-xs rounded-lg border border-border bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono"
                    required
                  />
                  <input
                    type="text"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    placeholder="事件内容: 如沈变2.8MWp光伏并网"
                    className="sm:col-span-2 p-2 text-xs rounded-lg border border-border bg-panel border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
                  >
                    保存该事件
                  </button>
                </div>
              </form>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-500">已归档关键事件 ({keyEvents.length})</div>
                <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                  {keyEvents.map((ev) => (
                    <div key={ev.id} className="p-2.5 rounded-lg border border-border bg-white flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-amber-50 text-amber-800 font-mono font-bold border border-amber-200 shrink-0">
                          {ev.date}
                        </span>
                        <span className="text-xs font-medium text-slate-800">{ev.title}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setKeyEvents(keyEvents.filter((k) => k.id !== ev.id))}
                        className="text-rose-400 hover:text-rose-600 cursor-pointer p-1"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-border/60 flex justify-end bg-panel">
              <button
                type="button"
                onClick={() => setIsEventModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-bold cursor-pointer"
              >
                完成
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
