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
  Upload,
  Info,
  Image as ImageIcon,
  Plus,
  Trash2,
  X,
  Sparkles,
  Eye,
  Cpu,
  Zap,
  Droplet,
  Flame,
  Gauge,
  Factory,
  Check,
  RotateCcw,
  LayoutGrid,
  Table as TableIcon,
  AlertTriangle,
  FileSpreadsheet,
  Building2,
} from 'lucide-react'
import { Panel, Badge } from '@/components/shared/primitives'
import { cn } from '@/lib/utils'

// 设备明细模型
interface EquipmentItem {
  id: string
  name: string
  type: '超高效电动机' | '节能变压器' | '工业锅炉' | '风机' | '空压机' | '制冷设备' | '热泵' | '其他重点设备'
  usage: string
  powerKw: number
}

// 零碳关键事件模型
interface KeyEventItem {
  id: string
  date: string
  title: string
  type: '光伏并网' | '储能投运' | '碳足迹上线' | '零碳认证' | '技改节电'
}

// 填报指标行模型
interface MetricItem {
  id: string
  name: string
  category: 'energy' | 'cost' | 'green' | 'economy' | 'equipment' | 'park'
  categoryLabel: string
  unit: string
  value: string
  lastMonthValue: string
  remark: string
  icon?: string
}

// 辅助函数：按月度总量生成 31 天合理日数据
const generateInitialDaily = (total: number, days: number = 31) => {
  const avg = total / days
  return Array.from({ length: days }, (_, i) => {
    const factor = 1 + ((i % 5) - 2) * 0.02
    return Math.round(avg * factor * 10) / 10
  })
}

// 指标全量清单 (共 21 项细分指标)
const INITIAL_METRICS: MetricItem[] = [
  // 1. 能源消耗量 (5项)
  { id: 'm-1', name: '用水量', category: 'energy', categoryLabel: '能源消耗量', unit: 't', value: '8900', lastMonthValue: '8650', remark: '市政自来水水表月度抄报底数', icon: 'water' },
  { id: 'm-2', name: '天然气量', category: 'energy', categoryLabel: '能源消耗量', unit: 'm³', value: '28400', lastMonthValue: '27200', remark: '燃气锅炉与车间烘干加热消耗', icon: 'gas' },
  { id: 'm-3', name: '外购蒸汽量', category: 'energy', categoryLabel: '能源消耗量', unit: 't', value: '1420', lastMonthValue: '1380', remark: '集中供热管网蒸汽抄表结算量', icon: 'steam' },
  { id: 'm-4', name: '油消耗量（柴油、煤油、汽油）', category: 'energy', categoryLabel: '能源消耗量', unit: 'L', value: '320', lastMonthValue: '350', remark: '应急发电机组试车与厂区叉车加油领用', icon: 'oil' },
  { id: 'm-5', name: '液氧', category: 'energy', categoryLabel: '能源消耗量', unit: 't', value: '45.0', lastMonthValue: '42.0', remark: '钢板下料切割与绝缘件加工助燃消耗', icon: 'oxygen' },

  // 2. 能源费用账单 (5项)
  { id: 'm-6', name: '市电费用', category: 'cost', categoryLabel: '能源费用', unit: '万元', value: '142.50', lastMonthValue: '138.20', remark: '国网电力月度电费增值税发票总额', icon: 'power' },
  { id: 'm-7', name: '天然气费用', category: 'cost', categoryLabel: '能源费用', unit: '万元', value: '8.52', lastMonthValue: '8.16', remark: '新奥燃气月度发票结算金额', icon: 'gas' },
  { id: 'm-8', name: '外购蒸汽费用', category: 'cost', categoryLabel: '能源费用', unit: '万元', value: '32.66', lastMonthValue: '31.74', remark: '园区热力公司当期发票对账单', icon: 'steam' },
  { id: 'm-9', name: '用水费用', category: 'cost', categoryLabel: '能源费用', unit: '万元', value: '4.89', lastMonthValue: '4.76', remark: '自来水水务集团缴费凭单', icon: 'water' },
  { id: 'm-10', name: '油费用', category: 'cost', categoryLabel: '能源费用', unit: '万元', value: '0.24', lastMonthValue: '0.26', remark: '中石化加油卡充值及柴油发票', icon: 'oil' },

  // 3. 购买绿电交易参数 (4项)
  { id: 'm-11', name: '购买绿电量（kWh）', category: 'green', categoryLabel: '购买绿电', unit: 'kWh', value: '1482000', lastMonthValue: '1200000', remark: '三峡能源哈密200MW光伏电站双边交易电量' },
  { id: 'm-12', name: '购买绿证量', category: 'green', categoryLabel: '购买绿电', unit: '个', value: '18000', lastMonthValue: '15000', remark: '国家绿色电力证书 GEC 划转入账' },
  { id: 'm-12-price', name: '结算单价', category: 'green', categoryLabel: '购买绿电', unit: '元/kWh', value: '0.4280', lastMonthValue: '0.4250', remark: '绿电综合结算到厂单价' },
  { id: 'm-12-date', name: '交易日期', category: 'green', categoryLabel: '购买绿电', unit: '日期', value: '2026-08-18', lastMonthValue: '2026-07-20', remark: '电力交易中心双边合同执行日期' },

  // 4. 经济与产量 (2项)
  { id: 'm-13', name: '工业增加值（月度、年度）', category: 'economy', categoryLabel: '经济与产量', unit: '万元', value: '4200.0', lastMonthValue: '3950.0', remark: '政府统计局联网直报口径工业增加值' },
  { id: 'm-14', name: '产量（非线缆产业、项目公司）', category: 'economy', categoryLabel: '经济与产量', unit: '台/套/件', value: '128', lastMonthValue: '122', remark: '特高压变压器与箱变产成品完工入库量' },

  // 5. 重点设备 (2项，默认2台标准设备)
  { id: 'm-15', name: '达到或优于能效强制性国家标准 2 级的设备', category: 'equipment', categoryLabel: '重点设备', unit: 'kW', value: '1760', lastMonthValue: '1760', remark: '超高效电动机、节能变压器等' },
  { id: 'm-16', name: '纳入统计范围装备', category: 'equipment', categoryLabel: '重点设备', unit: 'kW', value: '1760', lastMonthValue: '1760', remark: '全厂重点用能量测装备清单与装机总功率' },

  // 6. 零碳园区 (3项)
  { id: 'm-17', name: '园区照片', category: 'park', categoryLabel: '零碳园区', unit: '/', value: '2张已上传', lastMonthValue: '2张已上传', remark: '园区高空全貌航拍图、厂区主大门实景' },
  { id: 'm-18', name: '零碳关键事件', category: 'park', categoryLabel: '零碳园区', unit: '事件/时间', value: '2026-08-15 光伏扩建并网', lastMonthValue: '2026-06-20 系统上线', remark: '光伏并网、储能并网、碳足迹系统上线、零碳工厂申报及认证等' },
  { id: 'm-19', name: '零碳园区基本信息', category: 'park', categoryLabel: '零碳园区', unit: '/', value: '特变电工沈变工业示范园区', lastMonthValue: '特变电工沈变工业示范园区', remark: '包含园区名称、位置、建设内容与规模指标等' },
]

// 默认两台标准设备 (超高效电动机、节能变压器)
const INITIAL_EQUIPMENT_LEVEL2: EquipmentItem[] = [
  { id: 'eq-1', name: '超高效电动机', type: '超高效电动机', usage: '生产车间空压机主驱动', powerKw: 160 },
  { id: 'eq-2', name: '节能变压器', type: '节能变压器', usage: '10kV动力变电所主供', powerKw: 1600 },
]

const INITIAL_EQUIPMENT_ALL: EquipmentItem[] = [
  { id: 'eq-3', name: '超高效电动机', type: '超高效电动机', usage: '生产车间空压机主驱动', powerKw: 160 },
  { id: 'eq-4', name: '节能变压器', type: '节能变压器', usage: '10kV动力变电所主供', powerKw: 1600 },
]

const INITIAL_KEY_EVENTS: KeyEventItem[] = [
  { id: 'ev-1', date: '2026-08-15', title: '特变电工沈变本部 2.8MWp 分布式光伏扩建工程顺利并网投运', type: '光伏并网' },
  { id: 'ev-2', date: '2026-06-20', title: '零碳智慧园区能源管理系统 2.0 (SCADA/IoT) 全面验收上线', type: '碳足迹上线' },
  { id: 'ev-3', date: '2026-03-10', title: '通过中国质量认证中心 (CQC) 零碳工厂 (三星级) 现场初核', type: '零碳认证' },
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

export default function FactoryMonthlyReportingPage() {
  // 视图模式：'entry' (填报工作台) | 'history' (历史台账)
  const [viewMode, setViewMode] = useState<'entry' | 'history'>('entry')
  // 填报展现布局：'card' (业务分组卡片·推荐) | 'table' (极简对比表格)
  const [displayLayout, setDisplayLayout] = useState<'card' | 'table'>('card')

  // 申报账期
  const [selectedYear, setSelectedYear] = useState('2026')
  const [selectedMonth, setSelectedMonth] = useState('08')
  const [submitterName, setSubmitterName] = useState('李工 (能碳专员)')

  // 21 项指标数据
  const [metrics, setMetrics] = useState<MetricItem[]>(INITIAL_METRICS)

  // 用水量 (m-1) 与 外购蒸汽量 (m-3) 的 日 / 月 填报模式切换
  const [dimModes, setDimModes] = useState<{ 'm-1': 'month' | 'day'; 'm-3': 'month' | 'day' }>({
    'm-1': 'month',
    'm-3': 'month',
  })

  // 31 天日数据数组存储 (8月份共31天)
  const [waterDailyList, setWaterDailyList] = useState<number[]>(() => generateInitialDaily(8900, 31))
  const [steamDailyList, setSteamDailyList] = useState<number[]>(() => generateInitialDaily(1420, 31))

  // 每日数据弹窗控制
  const [activeDailyModal, setActiveDailyModal] = useState<'m-1' | 'm-3' | null>(null)
  const [tempDailyList, setTempDailyList] = useState<number[]>([])

  // 设备台账
  const [equipListLevel2, setEquipListLevel2] = useState<EquipmentItem[]>(INITIAL_EQUIPMENT_LEVEL2)
  const [equipListAll, setEquipListAll] = useState<EquipmentItem[]>(INITIAL_EQUIPMENT_ALL)

  // 添加设备弹窗
  const [addModalTarget, setAddModalTarget] = useState<'m-15' | 'm-16' | null>(null)
  const [formDevType, setFormDevType] = useState<EquipmentItem['type']>('超高效电动机')
  const [formDevName, setFormDevName] = useState('')
  const [formDevUsage, setFormDevUsage] = useState('')
  const [formDevPower, setFormDevPower] = useState('')

  // 零碳园区基本信息
  const [parkInfo, setParkInfo] = useState({
    name: '特变电工沈变工业示范园区',
    location: '辽宁省沈阳市铁西区经济技术开发区二十二号路',
    content: '2.8MWp分布式屋顶光伏扩建工程、10kV智能变配电节能改造、空压机余热循环利用、全厂能碳微电网数字化系统',
    scale: '光伏装机2.8MWp，年发绿电约320万kWh，园区绿电消纳率超65%',
  })
  const [isParkInfoModalOpen, setIsParkInfoModalOpen] = useState(false)

  // 园区照片状态
  const [parkPhotos, setParkPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=500&auto=format&fit=crop&q=60',
  ])
  const [isParkPhotoModalOpen, setIsParkPhotoModalOpen] = useState(false)

  // 零碳关键事件
  const [keyEvents, setKeyEvents] = useState<KeyEventItem[]>(INITIAL_KEY_EVENTS)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [newEventDate, setNewEventDate] = useState('2026-08-15')
  const [newEventTitle, setNewEventTitle] = useState('特变电工沈变本部 2.8MWp 分布式光伏扩建工程顺利并网投运')

  // 成功反馈
  const [successToast, setSuccessToast] = useState<{ show: boolean; msg: string; batch: string }>({
    show: false,
    msg: '',
    batch: '',
  })

  // 历史台账
  const [historyList, setHistoryList] = useState<HistoryRecord[]>([
    {
      id: 'REC-01',
      batch: 'DR-202608-01',
      year: '2026',
      month: '08',
      submitter: '李工 (能碳专员)',
      submitTime: '2026-08-28 09:30',
      summary: '用水 8,900t · 气 28,400m³ · 绿电 1,482,000kWh · 2级设备 1,760kW · 园区信息已归档',
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
      summary: '用水 8,650t · 气 27,200m³ · 蒸汽 1,380t · 购绿电 1,200,000kWh · 增加值 ¥3,950万',
      totalCostWan: '175.40',
      status: '已入库',
    },
  ])

  // 修改单个指标值
  const handleMetricChange = (id: string, newVal: string) => {
    setMetrics((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value: newVal } : item))
    )
  }

  // 切换 日 / 月 填报模式
  const handleToggleDimMode = (id: 'm-1' | 'm-3', mode: 'month' | 'day') => {
    setDimModes((prev) => ({ ...prev, [id]: mode }))
    if (mode === 'day') {
      const list = id === 'm-1' ? waterDailyList : steamDailyList
      const sum = Math.round(list.reduce((a, b) => a + b, 0) * 10) / 10
      handleMetricChange(id, String(sum))
    }
  }

  // 打开每日数据录入弹窗
  const handleOpenDailyModal = (id: 'm-1' | 'm-3') => {
    setActiveDailyModal(id)
    const current = id === 'm-1' ? waterDailyList : steamDailyList
    setTempDailyList([...current])
  }

  // 计算弹窗内 31 天临时总和
  const tempDailySum = useMemo(() => {
    return Math.round(tempDailyList.reduce((a, b) => a + (parseFloat(b as any) || 0), 0) * 10) / 10
  }, [tempDailyList])

  // 弹窗保存并同步回填
  const handleSaveDailyModal = () => {
    if (!activeDailyModal) return
    if (activeDailyModal === 'm-1') {
      setWaterDailyList(tempDailyList)
      handleMetricChange('m-1', String(tempDailySum))
    } else {
      setSteamDailyList(tempDailyList)
      handleMetricChange('m-3', String(tempDailySum))
    }
    setActiveDailyModal(null)
  }

  // 智能均摊 31 天
  const handleDistributeAverage = (targetTotal: number) => {
    const list = generateInitialDaily(targetTotal, 31)
    setTempDailyList(list)
  }

  // 快捷功能：⚡ 一键带入上月数据
  const handleApplyLastMonthData = () => {
    if (confirm('确认使用【2026年07月】历史基准数据自动填充当前申报表？')) {
      setMetrics((prev) =>
        prev.map((item) => ({ ...item, value: item.lastMonthValue }))
      )
      setSuccessToast({
        show: true,
        msg: '已成功带入上月基准数据！您可以针对本月实际变动项进行微调后直接提交。',
        batch: 'FAST-FILL',
      })
      setTimeout(() => setSuccessToast({ show: false, msg: '', batch: '' }), 4000)
    }
  }

  // 计算填报完成进度
  const completedCount = useMemo(() => {
    return metrics.filter((m) => m.value && m.value.trim() !== '').length
  }, [metrics])
  const progressPercent = Math.round((completedCount / metrics.length) * 100)

  // 计算本月能源费用总支出
  const totalCostWan = useMemo(() => {
    return metrics
      .filter((m) => m.category === 'cost')
      .reduce((sum, m) => sum + (parseFloat(m.value) || 0), 0)
      .toFixed(2)
  }, [metrics])

  // 设备总装机功率
  const level2TotalKw = useMemo(() => equipListLevel2.reduce((s, e) => s + e.powerKw, 0), [equipListLevel2])
  const allEquipTotalKw = useMemo(() => equipListAll.reduce((s, e) => s + e.powerKw, 0), [equipListAll])

  // 确认添加设备
  const handleConfirmAddEquipment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formDevName.trim() || !formDevPower.trim()) {
      alert('请填写设备名称及额定功率！')
      return
    }
    const kw = parseFloat(formDevPower) || 0
    const newItem: EquipmentItem = {
      id: `eq-${Date.now()}`,
      name: formDevName.trim(),
      type: formDevType,
      usage: formDevUsage.trim() || '生产车间主供机组',
      powerKw: kw,
    }

    if (addModalTarget === 'm-15') {
      const updated = [...equipListLevel2, newItem]
      setEquipListLevel2(updated)
      handleMetricChange('m-15', String(updated.reduce((s, x) => s + x.powerKw, 0)))
    } else {
      const updated = [...equipListAll, newItem]
      setEquipListAll(updated)
      handleMetricChange('m-16', String(updated.reduce((s, x) => s + x.powerKw, 0)))
    }

    setFormDevName('')
    setFormDevUsage('')
    setFormDevPower('')
    setAddModalTarget(null)
  }

  // 删除设备
  const handleDeleteEquipment = (target: 'm-15' | 'm-16', eqId: string) => {
    if (target === 'm-15') {
      const updated = equipListLevel2.filter((e) => e.id !== eqId)
      setEquipListLevel2(updated)
      handleMetricChange('m-15', String(updated.reduce((s, x) => s + x.powerKw, 0)))
    } else {
      const updated = equipListAll.filter((e) => e.id !== eqId)
      setEquipListAll(updated)
      handleMetricChange('m-16', String(updated.reduce((s, x) => s + x.powerKw, 0)))
    }
  }

  // 提交保存入库
  const handleSaveEntry = (status: '已入库' | '待复核') => {
    const now = new Date()
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const batchCode = `DR-${selectedYear}${selectedMonth}-${String(historyList.length + 1).padStart(2, '0')}`

    const summaryText = `水 ${metrics[0].value}t · 气 ${metrics[1].value}m³ · 绿电 ${metrics[10].value}kWh · 2级设备 ${level2TotalKw}kW · 园区基本信息已归档`

    const newRecord: HistoryRecord = {
      id: `REC-${Date.now()}`,
      batch: batchCode,
      year: selectedYear,
      month: selectedMonth,
      submitter: submitterName,
      submitTime: timeStr,
      summary: summaryText,
      totalCostWan,
      status,
    }

    setHistoryList([newRecord, ...historyList])
    setSuccessToast({
      show: true,
      msg: `${selectedYear}年${selectedMonth}月工厂数据申报已成功${status === '已入库' ? '校验入库' : '保存待复核'}！已自动计入台账。`,
      batch: batchCode,
    })

    setTimeout(() => setSuccessToast({ show: false, msg: '', batch: '' }), 4500)
  }

  return (
    <div className="space-y-4">
      {/* 🌟 1. 顶部工厂月度申报看板 */}
      <div className="rounded-2xl border bg-card border-border p-4 shadow-sm space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 border border-primary/30 text-primary">
              <Factory className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-foreground">
                  {selectedYear} 年 {selectedMonth} 月度工厂能碳数据定时申报
                </h1>
                <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  申报开放中
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                申报单位：<span className="font-semibold text-foreground">特变电工沈阳变压器工厂</span> · 截止时间：2026-09-05 24:00 (剩余 2 天)
              </p>
            </div>
          </div>

          {/* 快捷操作区 */}
          <div className="flex items-center gap-2">
            {/* 一键带入上月数据 */}
            <button
              type="button"
              onClick={handleApplyLastMonthData}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-bold cursor-pointer transition-all shadow-2xs"
              title="复用7月份已有数据，快速完成8月微调"
            >
              <Zap className="size-3.5 text-amber-400 fill-amber-400" />
              <span>⚡ 一键带入上月数据</span>
            </button>

            {/* 导出/导入 */}
            <button
              type="button"
              onClick={() => alert('已为您生成 2026年08月 离线申报 Excel 模板！')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-panel/70 border-border hover:bg-panel/80 text-xs font-semibold text-foreground cursor-pointer transition-colors shadow-2xs"
            >
              <Download className="size-3.5 text-muted-foreground" />
              <span>下载模板</span>
            </button>

            {/* 历史台账 */}
            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'entry' ? 'history' : 'entry')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-panel/70 border-border hover:bg-panel/80 text-xs font-bold text-foreground cursor-pointer transition-colors shadow-2xs"
            >
              <History className="size-3.5 text-primary" />
              <span>历史台账 ({historyList.length})</span>
            </button>
          </div>
        </div>

        {/* 申报进度条与视图切换控制 */}
        <div className="pt-2 border-t border-border/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 flex-1 min-w-[300px]">
            <span className="font-bold text-foreground shrink-0">
              申报完成度：
              <span className="text-primary font-mono text-sm">{completedCount}</span> / {metrics.length} 项
            </span>
            <div className="flex-1 max-w-xs h-2 rounded-full bg-slate-800 overflow-hidden border border-border/60">
              <div
                className="h-full bg-linear-to-r from-blue-500 to-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-mono text-xs font-bold text-muted-foreground/70">{progressPercent}%</span>
          </div>

          {/* 切换卡片视图 vs 紧凑表格 */}
          <div className="flex items-center gap-1 bg-[#0b1324] border-border p-0.5 rounded-lg border">
            <button
              type="button"
              onClick={() => setDisplayLayout('card')}
              className={cn(
                'flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold cursor-pointer transition-all',
                displayLayout === 'card'
                  ? 'bg-card text-primary shadow-xs border border-border'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <LayoutGrid className="size-3.5" />
              <span>业务分组卡片</span>
            </button>
            <button
              type="button"
              onClick={() => setDisplayLayout('table')}
              className={cn(
                'flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold cursor-pointer transition-all',
                displayLayout === 'table'
                  ? 'bg-card text-primary shadow-xs border border-border'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <TableIcon className="size-3.5" />
              <span>紧凑对比表格</span>
            </button>
          </div>
        </div>
      </div>

      {/* 成功入库提示 */}
      {successToast.show && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-4 py-2.5 text-xs text-emerald-300 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
            <span className="font-bold">操作成功（{successToast.batch}）：</span>
            <span>{successToast.msg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessToast({ show: false, msg: '', batch: '' })}
            className="text-emerald-400 hover:text-emerald-200 cursor-pointer font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 视图模式 1：填报工作台 */}
      {/* ========================================================================= */}
      {viewMode === 'entry' && (
        <div className="space-y-4">
          {/* A. 业务分组卡片布局 */}
          {displayLayout === 'card' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* 卡片 1：💧 能源介质消耗量 (5项，支持用水量和蒸汽量选择日/月填报，已移除环比) */}
              <div className="rounded-2xl border bg-card border-border p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center">
                      <Droplet className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">1. 能源介质实物消耗量</h3>
                      <p className="text-[11px] text-muted-foreground">水、气、蒸汽、油料、液氧实测消耗（支持日/月灵活填报）</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950/40 text-amber-300 border border-amber-800/60 font-bold">
                    5 项指标
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {metrics.slice(0, 5).map((m) => {
                    const isDayMonthSupported = m.id === 'm-1' || m.id === 'm-3'
                    const mode = isDayMonthSupported ? dimModes[m.id as 'm-1' | 'm-3'] : 'month'

                    return (
                      <div key={m.id} className="p-3 rounded-xl border border-border bg-panel/70 border-border space-y-1.5 focus-within:border-primary transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-foreground">{m.name}</span>
                            {/* 日 / 月 填报选择胶囊 */}
                            {isDayMonthSupported && (
                              <div className="flex items-center bg-[#0b1324] border border-border p-0.5 rounded-md text-[10px]">
                                <button
                                  type="button"
                                  onClick={() => handleToggleDimMode(m.id as 'm-1' | 'm-3', 'month')}
                                  className={cn(
                                    'px-1.5 py-0.5 rounded font-bold cursor-pointer transition-all',
                                    mode === 'month'
                                      ? 'bg-card text-primary shadow-2xs border border-border'
                                      : 'text-muted-foreground/70 hover:text-foreground'
                                  )}
                                >
                                  月数据
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleToggleDimMode(m.id as 'm-1' | 'm-3', 'day')}
                                  className={cn(
                                    'px-1.5 py-0.5 rounded font-bold cursor-pointer transition-all',
                                    mode === 'day'
                                      ? 'bg-primary text-primary-foreground shadow-2xs'
                                      : 'text-muted-foreground/70 hover:text-foreground'
                                  )}
                                >
                                  日数据
                                </button>
                              </div>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-muted-foreground/70">上月: {m.lastMonthValue} {m.unit}</span>
                        </div>

                        {/* 输入框与日数据录入按钮布局 */}
                        {isDayMonthSupported && mode === 'day' ? (
                          <div className="flex items-center gap-2">
                            <div className="relative flex items-center flex-1">
                              <input
                                type="text"
                                readOnly
                                value={m.value}
                                className="w-full pl-3 pr-16 py-1.5 bg-primary/10 border border-primary/30 text-primary rounded-lg text-xs font-mono font-bold shadow-2xs"
                              />
                              <span className="absolute right-3 text-[10px] font-bold text-primary select-none">
                                {m.unit} (日累加)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleOpenDailyModal(m.id as 'm-1' | 'm-3')}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer transition-colors shrink-0 shadow-2xs"
                            >
                              <Calendar className="size-3.5" />
                              <span>录入日数据</span>
                            </button>
                          </div>
                        ) : (
                          <div className="relative flex items-center">
                            <input
                              type="number"
                              step="any"
                              value={m.value}
                              onChange={(e) => handleMetricChange(m.id, e.target.value)}
                              className="w-full pl-3 pr-12 py-1.5 bg-[#0b1324] border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg text-xs font-mono font-bold shadow-2xs focus:outline-none"
                              placeholder={isDayMonthSupported ? "输入本月总数据..." : "输入数值..."}
                            />
                            <span className="absolute right-3 text-xs font-mono font-bold text-muted-foreground/70 select-none">
                              {m.unit}
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 卡片 2：💰 能源费用账单 (5项，已移除环比) */}
              <div className="rounded-2xl border bg-card border-border p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                      <Zap className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">2. 能源费用发票账单</h3>
                      <p className="text-[11px] text-muted-foreground">市电、天然气、蒸汽、水务、油品结算总额</p>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 font-mono text-xs font-bold">
                    <span className="text-[10px] text-emerald-400 font-normal">费用合计:</span>
                    <span className="text-sm font-black">¥ {totalCostWan}</span>
                    <span className="text-[10px]">万元</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {metrics.slice(5, 10).map((m) => {
                    return (
                      <div key={m.id} className="p-3 rounded-xl border border-border bg-panel/70 border-border space-y-1.5 focus-within:border-emerald-500 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">{m.name}</span>
                          <span className="text-[11px] font-mono text-muted-foreground/70">上月: ¥{m.lastMonthValue}万</span>
                        </div>
                        <div className="relative flex items-center">
                          <input
                            type="number"
                            step="any"
                            value={m.value}
                            onChange={(e) => handleMetricChange(m.id, e.target.value)}
                            className="w-full pl-3 pr-14 py-1.5 bg-[#0b1324] border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg text-xs font-mono font-bold shadow-2xs focus:outline-none focus:border-emerald-500"
                            placeholder="输入金额..."
                          />
                          <span className="absolute right-3 text-xs font-mono font-bold text-muted-foreground/70 select-none">
                            万元
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 卡片 3：🌿 购买绿电与经济指标 (4项绿电参数 + 2项经济指标，已移除环比) */}
              <div className="rounded-2xl border bg-card border-border p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
                      <Sparkles className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">3. 购买绿电与经济指标</h3>
                      <p className="text-[11px] text-muted-foreground">购买绿电交易参数（电量、绿证、单价、日期）与工业增加值、总产量</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-purple-950/40 text-purple-300 border border-purple-800/60 font-bold">
                    6 项指标
                  </span>
                </div>

                {/* 购买绿电交易参数 (4项) */}
                <div className="p-3 rounded-xl border border-purple-900/40 bg-purple-950/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-purple-300">购买绿电交易参数</span>
                    <span className="text-[10px] font-mono text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded font-bold">
                      4 项参数
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {metrics.slice(10, 14).map((m) => (
                      <div key={m.id} className="p-2.5 rounded-lg border bg-[#0e182e] border-border hover:border-primary/40 text-foreground space-y-1 focus-within:border-purple-500">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">{m.name}</span>
                          <span className="text-[10px] font-mono text-muted-foreground/70">
                            上月: {m.lastMonthValue} {m.unit !== '日期' ? m.unit : ''}
                          </span>
                        </div>
                        <div className="relative flex items-center">
                          {m.unit === '日期' ? (
                            <input
                              type="date"
                              value={m.value}
                              onChange={(e) => handleMetricChange(m.id, e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-[#0b1324] border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg text-xs font-mono font-bold shadow-2xs focus:outline-none focus:border-purple-500"
                            />
                          ) : (
                            <>
                              <input
                                type="number"
                                step="any"
                                value={m.value}
                                onChange={(e) => handleMetricChange(m.id, e.target.value)}
                                className="w-full pl-3 pr-16 py-1.5 bg-[#0b1324] border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg text-xs font-mono font-bold shadow-2xs focus:outline-none focus:border-purple-500"
                                placeholder="输入数值..."
                              />
                              <span className="absolute right-3 text-xs font-mono font-bold text-muted-foreground/70 select-none">
                                {m.unit}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 经济与产量 (2项) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {metrics.slice(14, 16).map((m) => (
                    <div key={m.id} className="p-3 rounded-xl border border-border bg-panel/70 border-border space-y-1.5 focus-within:border-primary transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">{m.name}</span>
                        <span className="text-[11px] font-mono text-muted-foreground/70">上月: {m.lastMonthValue} {m.unit}</span>
                      </div>
                      <div className="relative flex items-center">
                        <input
                          type="number"
                          step="any"
                          value={m.value}
                          onChange={(e) => handleMetricChange(m.id, e.target.value)}
                          className="w-full pl-3 pr-16 py-1.5 bg-[#0b1324] border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg text-xs font-mono font-bold shadow-2xs focus:outline-none focus:border-primary"
                          placeholder="输入数值..."
                        />
                        <span className="absolute right-3 text-xs font-mono font-bold text-muted-foreground/70 select-none">
                          {m.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 卡片 4：⚙️ 重点用能设备模块 (默认2个设备：超高效电动机、节能变压器) */}
              <div className="rounded-2xl border bg-card border-border p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                      <Cpu className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">4. 重点用能设备模块</h3>
                      <p className="text-[11px] text-muted-foreground">清晰显示设备名称、运行用途、额定功率与总装机汇总</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-950/40 text-indigo-300 border border-indigo-800/60 font-bold">
                    2 类重点资产
                  </span>
                </div>

                <div className="space-y-3">
                  {/* 项 15：达到或优于国标 2 级的设备 */}
                  <div className="p-3.5 rounded-xl border border-indigo-900/40 bg-indigo-950/20 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-indigo-300">达到或优于国标 2 级的设备</span>
                        <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-900/50 border border-indigo-700/50 px-2 py-0.5 rounded">
                          {level2TotalKw.toLocaleString()} kW ({equipListLevel2.length}台)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setAddModalTarget('m-15')
                          setFormDevType('超高效电动机')
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer shadow-2xs transition-colors"
                      >
                        <Plus className="size-3" />
                        <span>添加设备</span>
                      </button>
                    </div>

                    {/* 设备列表卡片展示 */}
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {equipListLevel2.map((dev) => (
                        <div
                          key={dev.id}
                          className="flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl border bg-[#0e182e] border-border hover:border-primary/40 text-foreground transition-colors text-xs shadow-2xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-bold text-foreground shrink-0">{dev.name}</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/20 text-primary border border-primary/30 font-medium shrink-0">
                              {dev.type}
                            </span>
                            <span className="text-[11px] text-muted-foreground truncate">
                              用途：<span className="text-foreground font-medium">{dev.usage || '主厂区主供设备'}</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5 shrink-0">
                            <span className="font-mono font-bold text-indigo-300 bg-indigo-950/60 border-indigo-800/60 text-xs px-2 py-0.5 rounded border">
                              {dev.powerKw.toLocaleString()} kW
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteEquipment('m-15', dev.id)}
                              className="text-muted-foreground hover:text-rose-500 p-0.5 cursor-pointer transition-colors"
                              title="移除此设备"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {equipListLevel2.length === 0 && (
                        <div className="text-xs text-muted-foreground/70 italic py-2 text-center">暂无已录入设备，请点击右上方【添加设备】</div>
                      )}
                    </div>
                  </div>

                  {/* 项 16：纳入统计范围装备 */}
                  <div className="p-3.5 rounded-xl border border-indigo-900/40 bg-indigo-950/20 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-indigo-300">纳入统计范围装备</span>
                        <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-900/50 border border-indigo-700/50 px-2 py-0.5 rounded">
                          {allEquipTotalKw.toLocaleString()} kW ({equipListAll.length}台)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setAddModalTarget('m-16')
                          setFormDevType('空压机')
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer shadow-2xs transition-colors"
                      >
                        <Plus className="size-3" />
                        <span>添加装备</span>
                      </button>
                    </div>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {equipListAll.map((dev) => (
                        <div
                          key={dev.id}
                          className="flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl border bg-[#0e182e] border-border hover:border-primary/40 text-foreground transition-colors text-xs shadow-2xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-bold text-foreground shrink-0">{dev.name}</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/20 text-primary border border-primary/30 font-medium shrink-0">
                              {dev.type}
                            </span>
                            <span className="text-[11px] text-muted-foreground truncate">
                              用途：<span className="text-foreground font-medium">{dev.usage || '动力及辅助机组'}</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5 shrink-0">
                            <span className="font-mono font-bold text-indigo-300 bg-indigo-950/60 border-indigo-800/60 text-xs px-2 py-0.5 rounded border">
                              {dev.powerKw.toLocaleString()} kW
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteEquipment('m-16', dev.id)}
                              className="text-muted-foreground hover:text-rose-500 p-0.5 cursor-pointer transition-colors"
                              title="移除此装备"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {equipListAll.length === 0 && (
                        <div className="text-xs text-muted-foreground/70 italic py-2 text-center">暂无已录入装备，请点击右上方【添加装备】</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 卡片 5：🏛️ 零碳园区与重大事件 (3项) */}
              <div className="lg:col-span-2 rounded-2xl border bg-card border-border p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-lg bg-teal-500/15 text-teal-400 flex items-center justify-center">
                      <Building2 className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">5. 零碳园区与重大里程碑</h3>
                      <p className="text-[11px] text-muted-foreground">园区全貌实景、零碳关键事件登记及零碳园区基本信息（名称、位置、建设内容）</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-teal-950/40 text-teal-300 border border-teal-800/60 font-bold">
                    3 项园区要素
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* 园区照片 */}
                  <div className="p-3.5 rounded-xl border border-teal-900/40 bg-teal-950/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-300">园区全貌航拍实景</span>
                      <span className="text-[10px] font-mono text-teal-300 bg-teal-900/50 px-1.5 py-0.5 rounded font-bold">
                        {parkPhotos.length} 张已上传
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">用于集控中心大屏轮播展示与现场初核核验。</p>
                    <button
                      type="button"
                      onClick={() => setIsParkPhotoModalOpen(true)}
                      className="w-full py-1.5 rounded-lg border border-teal-800/60 bg-[#0e182e] hover:bg-teal-950/50 text-teal-300 text-xs font-bold cursor-pointer transition-colors shadow-2xs flex items-center justify-center gap-1.5"
                    >
                      <ImageIcon className="size-3.5" />
                      <span>管理园区照片</span>
                    </button>
                  </div>

                  {/* 零碳关键事件 */}
                  <div className="p-3.5 rounded-xl border border-teal-900/40 bg-teal-950/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-300">零碳重大关键事件</span>
                      <span className="text-[10px] font-mono text-teal-300 bg-teal-900/50 px-1.5 py-0.5 rounded font-bold">
                        {keyEvents.length} 条已归档
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate" title={keyEvents[0]?.title}>
                      最新: {keyEvents[0]?.title || '暂无'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsEventModalOpen(true)}
                      className="w-full py-1.5 rounded-lg border border-teal-800/60 bg-[#0e182e] hover:bg-teal-950/50 text-teal-300 text-xs font-bold cursor-pointer transition-colors shadow-2xs flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="size-3.5 text-amber-500" />
                      <span>登记关键事件</span>
                    </button>
                  </div>

                  {/* 零碳园区基本信息 */}
                  <div className="p-3.5 rounded-xl border border-teal-900/40 bg-teal-950/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-300">零碳园区基本信息</span>
                      <span className="text-[10px] font-mono text-teal-300 bg-teal-900/50 px-1.5 py-0.5 rounded font-bold">
                        已维护
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      维护零碳园区名称、地理位置及低碳建设内容。
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsParkInfoModalOpen(true)}
                      className="w-full py-1.5 rounded-lg border border-teal-800/60 bg-[#0e182e] hover:bg-teal-950/50 text-teal-300 text-xs font-bold cursor-pointer transition-colors shadow-2xs flex items-center justify-center gap-1.5"
                    >
                      <FileEdit className="size-3.5" />
                      <span>维护园区基本信息</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* B. 紧凑对比表格布局 (配色修复：彻底适配深色/浅色模式) */}
          {displayLayout === 'table' && (
            <div className="rounded-2xl border bg-card border-border overflow-hidden shadow-sm">
              <div className="p-3 bg-[#111c33] text-foreground border-b border-border flex items-center justify-between text-xs">
                <span className="font-bold text-foreground">工厂月度定时申报全量指标明细对照表</span>
                <span className="text-[11px] text-muted-foreground/70">支持键盘 Tab 键快速向下切换输入</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-[#0e172a] text-muted-foreground font-semibold">
                      <th className="py-2.5 px-3 w-12 text-center text-muted-foreground/70 font-mono">#</th>
                      <th className="py-2.5 px-3 w-28 font-bold">业务分类</th>
                      <th className="py-2.5 px-3 w-72 font-bold text-foreground">指标名称</th>
                      <th className="py-2.5 px-3 w-56 font-bold text-primary">本月申报值</th>
                      <th className="py-2.5 px-3 w-16 text-center">单位</th>
                      <th className="py-2.5 px-3 w-28 text-center text-muted-foreground/70">上月参考</th>
                      <th className="py-2.5 px-3">补充说明</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-border/60 text-muted-foreground">
                    {metrics.map((m, idx) => {
                      const isEquip = m.category === 'equipment'
                      const isPark = m.category === 'park'
                      const isDayMonthSupported = m.id === 'm-1' || m.id === 'm-3'
                      const mode = isDayMonthSupported ? dimModes[m.id as 'm-1' | 'm-3'] : 'month'

                      return (
                        <tr key={m.id} className="hover:bg-white/[0.03] transition-colors">
                          <td className="py-2.5 px-3 text-center font-mono text-muted-foreground/70">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-semibold text-muted-foreground">{m.categoryLabel}</td>
                          <td className="py-2.5 px-3 font-bold text-foreground">{m.name}</td>
                          <td className="py-2 px-3">
                            {isEquip ? (
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-bold text-indigo-300 bg-indigo-950/50 border-indigo-800/50 px-2 py-1 rounded border">
                                  {m.id === 'm-15' ? level2TotalKw : allEquipTotalKw} kW
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAddModalTarget(m.id as any)
                                    setFormDevType(m.id === 'm-15' ? '超高效电动机' : '空压机')
                                  }}
                                  className="px-2 py-1 rounded bg-primary hover:bg-primary/90 text-primary-foreground text-[11px] font-bold cursor-pointer"
                                >
                                  +添加
                                </button>
                              </div>
                            ) : isPark ? (
                              <button
                                type="button"
                                onClick={() => {
                                  if (m.id === 'm-17') setIsParkPhotoModalOpen(true)
                                  else if (m.id === 'm-18') setIsEventModalOpen(true)
                                  else setIsParkInfoModalOpen(true)
                                }}
                                className="px-2.5 py-1 rounded bg-teal-950/40 hover:bg-teal-900/50 text-teal-300 border-teal-800/60 border text-xs font-bold cursor-pointer"
                              >
                                {m.id === 'm-19' ? '维护基本信息' : '维护凭证'}
                              </button>
                            ) : isDayMonthSupported ? (
                              <div className="flex items-center gap-1.5">
                                <div className="flex items-center bg-[#0b1324] border border-border p-0.5 rounded text-[10px] shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleDimMode(m.id as 'm-1' | 'm-3', 'month')}
                                    className={cn(
                                      'px-1.5 py-0.5 rounded font-bold cursor-pointer',
                                      mode === 'month' ? 'bg-card text-primary shadow-2xs border border-border' : 'text-muted-foreground/70'
                                    )}
                                  >
                                    月
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleDimMode(m.id as 'm-1' | 'm-3', 'day')}
                                    className={cn(
                                      'px-1.5 py-0.5 rounded font-bold cursor-pointer',
                                      mode === 'day' ? 'bg-primary text-primary-foreground shadow-2xs' : 'text-muted-foreground/70'
                                    )}
                                  >
                                    日
                                  </button>
                                </div>
                                {mode === 'day' ? (
                                  <div className="flex items-center gap-1 flex-1">
                                    <span className="font-mono font-bold text-primary bg-primary/15 border-primary/30 px-2 py-0.5 rounded border text-xs">
                                      {m.value} t
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenDailyModal(m.id as 'm-1' | 'm-3')}
                                      className="px-2 py-0.5 rounded bg-primary/10 hover:bg-primary/20 text-primary border-primary/30 border text-[10px] font-bold cursor-pointer"
                                    >
                                      编辑31天
                                    </button>
                                  </div>
                                ) : (
                                  <div className="relative flex items-center flex-1">
                                    <input
                                      type="number"
                                      step="any"
                                      value={m.value}
                                      onChange={(e) => handleMetricChange(m.id, e.target.value)}
                                      className="w-full pl-2 pr-8 py-1 text-xs font-mono font-bold rounded border bg-[#0b1324] border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
                                    />
                                    <span className="absolute right-2 text-[10px] text-muted-foreground/70">{m.unit}</span>
                                  </div>
                                )}
                              </div>
                            ) : m.unit === '日期' ? (
                              <input
                                type="date"
                                value={m.value}
                                onChange={(e) => handleMetricChange(m.id, e.target.value)}
                                className="w-full px-2 py-1 text-xs font-mono font-bold rounded border bg-[#0b1324] border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
                              />
                            ) : (
                              <div className="relative flex items-center">
                                <input
                                  type="number"
                                  step="any"
                                  value={m.value}
                                  onChange={(e) => handleMetricChange(m.id, e.target.value)}
                                  className="w-full pl-3 pr-10 py-1 text-xs font-mono font-bold rounded border bg-[#0b1324] border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
                                />
                                <span className="absolute right-2 text-[10px] font-bold text-muted-foreground/70 font-mono">
                                  {m.unit}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono text-muted-foreground">{m.unit}</td>
                          <td className="py-2.5 px-3 text-center font-mono text-muted-foreground/70">{m.lastMonthValue}</td>
                          <td className="py-2 px-3 text-muted-foreground/70">
                            {isDayMonthSupported && mode === 'day' ? `已启用日数据填报（31天合计 ${m.value} ${m.unit}）` : m.remark}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 🌟 5. 底部固定保存栏：右侧预留 pr-48 彻底避开右下角 AI 悬浮球 */}
          <div className="rounded-2xl border bg-card border-border p-3.5 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs pr-48">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Info className="size-4 text-primary shrink-0" />
              <span>
                申报状态：已完成 <strong className="text-primary">{completedCount}/{metrics.length} 项</strong> · 当月费用支出：<strong className="text-amber-500">¥ {totalCostWan} 万元</strong> · 本地草稿已自动保存
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSaveEntry('待复核')}
                className="px-4 py-2 rounded-lg border border-border bg-panel hover:bg-panel/80 text-foreground border-border text-xs font-bold cursor-pointer shadow-2xs transition-colors"
              >
                暂存草稿
              </button>
              <button
                type="button"
                onClick={() => handleSaveEntry('已入库')}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-xs cursor-pointer transition-colors"
              >
                <CheckCircle2 className="size-4" />
                <span>立即提交月度申报 (正式入库)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 视图模式 2：历史台账归档 */}
      {/* ========================================================================= */}
      {viewMode === 'history' && (
        <Panel className="p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <History className="size-4.5 text-primary" />
              <h3 className="text-sm font-bold text-foreground">工厂每月数据申报历史台账</h3>
              <Badge tone="info">{historyList.length} 个归档批次</Badge>
            </div>
            <button
              type="button"
              onClick={() => setViewMode('entry')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold cursor-pointer"
            >
              <ArrowLeft className="size-3.5" />
              <span>返回当前月度申报</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-[#0e172a] text-muted-foreground font-semibold">
                  <th className="py-2.5 px-3">申报批次</th>
                  <th className="py-2.5 px-3 text-center">所属月份</th>
                  <th className="py-2.5 px-3 font-bold">申报主要摘要</th>
                  <th className="py-2.5 px-3 text-right">当月总费用</th>
                  <th className="py-2.5 px-3">填报专员</th>
                  <th className="py-2.5 px-3">提报时间</th>
                  <th className="py-2.5 px-3 text-center">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y border-border/60 text-muted-foreground">
                {historyList.map((h) => (
                  <tr key={h.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-foreground">{h.batch}</td>
                    <td className="py-2.5 px-3 font-mono text-center font-bold text-primary">{h.year}年{h.month}月</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-foreground">{h.summary}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-500 text-right">¥ {h.totalCostWan} 万</td>
                    <td className="py-2.5 px-3">{h.submitter}</td>
                    <td className="py-2.5 px-3 font-sans text-muted-foreground/70 text-[11px]">{h.submitTime}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                        {h.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {/* ========================================================================= */}
      {/* 弹窗 A：逐日数据填报弹窗 */}
      {/* ========================================================================= */}
      {activeDailyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl border bg-[#0e172a] border-border text-foreground shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-border/60 flex items-center justify-between bg-[#131f38] border-border shrink-0">
              <div className="flex items-center gap-2">
                <Calendar className="size-5 text-primary" />
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    2026 年 08 月【{activeDailyModal === 'm-1' ? '用水量' : '外购蒸汽量'}】每日数据填报
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    录入 8 月 1 日 ~ 31 日每日抄表数据，系统自动汇总求和并同步回填本月申报值。
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveDailyModal(null)}
                className="p-1 rounded-lg hover:bg-slate-700/40 text-muted-foreground/70 hover:text-foreground cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* 快捷操作与总计条 */}
            <div className="px-4 py-2.5 border-b border-border/60 bg-[#0f1b33] flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
              <div className="flex items-baseline gap-2">
                <span className="text-muted-foreground font-medium">31天日数据合计:</span>
                <span className="font-mono text-base font-black text-primary">
                  {tempDailySum.toLocaleString()}
                </span>
                <span className="font-bold text-muted-foreground/70">t</span>
                <span className="text-[11px] text-muted-foreground/70 ml-2">
                  (日均: {(tempDailySum / 31).toFixed(2)} t/天)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDistributeAverage(activeDailyModal === 'm-1' ? 8900 : 1420)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-panel hover:bg-panel/80 text-foreground border-border text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  <Zap className="size-3 text-primary" />
                  <span>智能均摊 ({activeDailyModal === 'm-1' ? '8,900' : '1,420'}t)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTempDailyList(Array(31).fill(0))}
                  className="px-2.5 py-1 rounded-md border border-border bg-panel hover:bg-panel/80 text-foreground border-border text-xs cursor-pointer shadow-2xs"
                >
                  清零
                </button>
              </div>
            </div>

            {/* 31天数据录入网格 */}
            <div className="p-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {tempDailyList.map((val, idx) => {
                  const dayNum = idx + 1
                  const dateObj = new Date(2026, 7, dayNum)
                  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
                  const weekday = weekdays[dateObj.getDay()]
                  const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6

                  return (
                    <div
                      key={dayNum}
                      className={cn(
                        'p-2 rounded-xl border text-xs space-y-1 transition-colors',
                        isWeekend
                          ? 'bg-amber-950/20 border-amber-800/40'
                          : 'bg-panel/70 border-border border-border focus-within:border-primary'
                      )}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-foreground font-mono">8月{dayNum}日</span>
                        <span className={cn('text-[10px] font-medium', isWeekend ? 'text-amber-500' : 'text-muted-foreground/70')}>
                          {weekday}
                        </span>
                      </div>
                      <div className="relative flex items-center">
                        <input
                          type="number"
                          step="any"
                          value={val}
                          onChange={(e) => {
                            const v = parseFloat(e.target.value) || 0
                            const next = [...tempDailyList]
                            next[idx] = v
                            setTempDailyList(next)
                          }}
                          className="w-full pl-2 pr-6 py-1 bg-[#0b1324] border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-md text-xs font-mono font-bold focus:outline-none focus:border-primary"
                        />
                        <span className="absolute right-2 text-[10px] font-mono text-muted-foreground/70 select-none">
                          t
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 弹窗底部 */}
            <div className="p-3.5 border-t border-border/60 flex items-center justify-between bg-[#131f38] border-border shrink-0 text-xs">
              <div className="text-muted-foreground">
                本月31天合计：<strong className="text-primary font-mono text-sm">{tempDailySum}</strong> t
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveDailyModal(null)}
                  className="px-4 py-2 rounded-lg border border-border bg-panel hover:bg-panel/80 text-foreground border-border font-semibold cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleSaveDailyModal}
                  className="px-5 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold cursor-pointer shadow-xs"
                >
                  保存并同步月总数据
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 弹窗 1：重点设备录入 */}
      {/* ========================================================================= */}
      {addModalTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border bg-[#0e172a] border-border text-foreground shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-border/60 flex items-center justify-between bg-[#131f38] border-border">
              <div className="flex items-center gap-2">
                <Cpu className="size-5 text-primary" />
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    {addModalTarget === 'm-15' ? '添加达到或优于国标 2 级节能设备' : '添加纳入统计范围用能装备'}
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    可按国标规范选择 7 大类用能设备，录入设备名称、用途及额定功率。
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAddModalTarget(null)}
                className="p-1 rounded-lg hover:bg-slate-700/40 text-muted-foreground/70 hover:text-foreground cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmAddEquipment} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-foreground mb-1.5">
                  设备类型 <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formDevType}
                  onChange={(e) => setFormDevType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#0b1324] border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg text-xs font-semibold focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="超高效电动机" className="bg-[#0e172a] text-foreground">超高效电动机</option>
                  <option value="节能变压器" className="bg-[#0e172a] text-foreground">节能变压器</option>
                  <option value="工业锅炉" className="bg-[#0e172a] text-foreground">工业锅炉</option>
                  <option value="风机" className="bg-[#0e172a] text-foreground">风机</option>
                  <option value="空压机" className="bg-[#0e172a] text-foreground">空压机</option>
                  <option value="制冷设备" className="bg-[#0e172a] text-foreground">制冷设备</option>
                  <option value="热泵" className="bg-[#0e172a] text-foreground">热泵</option>
                  <option value="其他重点设备" className="bg-[#0e172a] text-foreground">其他重点设备</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1.5">
                  设备名称 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formDevName}
                  onChange={(e) => setFormDevName(e.target.value)}
                  placeholder="如：超高效电动机 #3"
                  className="w-full px-3 py-2 bg-[#0b1324] border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg text-xs font-medium focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1.5">
                  安装用途 / 运行说明
                </label>
                <input
                  type="text"
                  value={formDevUsage}
                  onChange={(e) => setFormDevUsage(e.target.value)}
                  placeholder="如：车间空压机组主驱、10kV动力变电所主供"
                  className="w-full px-3 py-2 bg-[#0b1324] border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg text-xs font-medium focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1.5">
                  额定功率 (kW) <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="any"
                    value={formDevPower}
                    onChange={(e) => setFormDevPower(e.target.value)}
                    placeholder="输入设备装机额定功率"
                    className="w-full pl-3 pr-12 py-2 bg-[#0b1324] border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg text-xs font-mono font-bold focus:outline-none focus:border-primary"
                    required
                  />
                  <span className="absolute right-3 text-xs font-mono font-bold text-muted-foreground/70">
                    kW
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setAddModalTarget(null)}
                  className="px-4 py-2 rounded-lg border border-border bg-panel hover:bg-panel/80 text-foreground border-border font-semibold cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold cursor-pointer shadow-xs"
                >
                  确认添加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 弹窗 2：零碳园区基本信息维护 */}
      {/* ========================================================================= */}
      {isParkInfoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border bg-[#0e172a] border-border text-foreground shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-border/60 flex items-center justify-between bg-[#131f38] border-border">
              <div className="flex items-center gap-2">
                <Building2 className="size-5 text-primary" />
                <div>
                  <h3 className="text-sm font-bold text-foreground">零碳园区基本信息维护</h3>
                  <p className="text-[11px] text-muted-foreground">
                    维护零碳园区名称、地理位置及低碳重点建设内容等信息。
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsParkInfoModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-700/40 text-muted-foreground/70 hover:text-foreground cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-foreground mb-1.5">
                  零碳园区 / 项目名称 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={parkInfo.name}
                  onChange={(e) => setParkInfo({ ...parkInfo, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0b1324] border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg text-xs font-semibold focus:outline-none focus:border-primary"
                  placeholder="如：特变电工沈变工业示范园区"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1.5">
                  地理位置 / 厂区地址 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={parkInfo.location}
                  onChange={(e) => setParkInfo({ ...parkInfo, location: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0b1324] border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg text-xs font-medium focus:outline-none focus:border-primary"
                  placeholder="如：辽宁省沈阳市铁西区经济技术开发区二十二号路"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1.5">
                  建设内容与主要低碳举措 <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={parkInfo.content}
                  onChange={(e) => setParkInfo({ ...parkInfo, content: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0b1324] border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg text-xs font-medium focus:outline-none focus:border-primary leading-relaxed"
                  placeholder="如：2.8MWp分布式屋顶光伏扩建工程、10kV智能节能变配电系统改造、空压机余热循环利用、全厂能碳微电网数字化系统..."
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1.5">
                  建设规模与指标说明
                </label>
                <input
                  type="text"
                  value={parkInfo.scale}
                  onChange={(e) => setParkInfo({ ...parkInfo, scale: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0b1324] border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg text-xs font-medium focus:outline-none focus:border-primary"
                  placeholder="如：光伏装机2.8MWp，年发绿电约320万kWh，园区绿电消纳率超65%"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsParkInfoModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border bg-panel hover:bg-panel/80 text-foreground border-border font-semibold cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleMetricChange('m-19', parkInfo.name)
                    setIsParkInfoModalOpen(false)
                    alert('零碳园区基本信息已成功更新并保存！')
                  }}
                  className="px-5 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold cursor-pointer shadow-xs"
                >
                  保存信息
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 弹窗 3：园区航拍照片管理 */}
      {/* ========================================================================= */}
      {isParkPhotoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl border bg-[#0e172a] border-border text-foreground shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-border/60 flex items-center justify-between bg-[#131f38] border-border">
              <div className="flex items-center gap-2">
                <ImageIcon className="size-5 text-primary" />
                <div>
                  <h3 className="text-sm font-bold text-foreground">园区全貌航拍照片管理</h3>
                  <p className="text-[11px] text-muted-foreground">用于集控中心大屏轮播展示与现场初核核验。</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsParkPhotoModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-700/40 text-muted-foreground/70 hover:text-foreground cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {parkPhotos.map((url, idx) => (
                  <div key={idx} className="relative group rounded-xl border border-border overflow-hidden aspect-video bg-black/40 shadow-2xs">
                    <img src={url} alt="现场实景" className="size-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => alert('全屏大图预览')}
                        className="p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-800 cursor-pointer"
                      >
                        <Eye className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('确认删除这张照片？')) {
                            setParkPhotos(parkPhotos.filter((_, i) => i !== idx))
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
                  onClick={() => {
                    const sample = 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=500&auto=format&fit=crop&q=60'
                    setParkPhotos([...parkPhotos, sample])
                    alert('已上传 1 张园区现场照片')
                  }}
                  className="aspect-video rounded-xl border-2 border-dashed border-teal-700/50 hover:border-teal-500 bg-teal-950/20 hover:bg-teal-950/40 text-teal-300 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all"
                >
                  <Upload className="size-5" />
                  <span className="text-xs font-bold">+ 上传照片</span>
                </button>
              </div>
            </div>

            <div className="p-3 border-t border-border/60 flex justify-end bg-[#131f38] border-border">
              <button
                type="button"
                onClick={() => setIsParkPhotoModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer"
              >
                完成
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 弹窗 4：关键事件登记 */}
      {/* ========================================================================= */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl border bg-[#0e172a] border-border text-foreground shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-border/60 flex items-center justify-between bg-[#131f38] border-border">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-amber-500" />
                <div>
                  <h3 className="text-sm font-bold text-foreground">零碳关键事件登记（事件/时间）</h3>
                  <p className="text-[11px] text-muted-foreground">涵盖光伏并网、储能投运、碳足迹上线等重大里程碑。</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEventModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-700/40 text-muted-foreground/70 hover:text-foreground cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!newEventTitle.trim()) return
                  setKeyEvents([{ id: `ev-${Date.now()}`, date: newEventDate, title: newEventTitle, type: '光伏并网' }, ...keyEvents])
                  setNewEventTitle('')
                }}
                className="p-3 rounded-xl border border-border bg-panel/70 border-border space-y-2.5"
              >
                <div className="text-xs font-bold text-foreground">+ 新增关键事件</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="date"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="p-2 text-xs rounded-lg border border-border bg-[#0b1324] border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 font-mono"
                    required
                  />
                  <input
                    type="text"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    placeholder="事件内容: 如沈变2.8MWp光伏并网"
                    className="sm:col-span-2 p-2 text-xs rounded-lg border border-border bg-[#0b1324] border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer shadow-xs"
                  >
                    保存该事件
                  </button>
                </div>
              </form>

              <div className="space-y-2">
                <div className="text-xs font-bold text-muted-foreground">已归档关键事件 ({keyEvents.length})</div>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {keyEvents.map((ev) => (
                    <div key={ev.id} className="p-2.5 rounded-lg border bg-[#0e182e] border-border hover:border-primary/40 text-foreground flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950/40 text-amber-300 border border-amber-800/60 font-mono font-bold shrink-0">
                          {ev.date}
                        </span>
                        <span className="text-xs font-medium text-foreground">{ev.title}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setKeyEvents(keyEvents.filter((k) => k.id !== ev.id))}
                        className="text-muted-foreground hover:text-rose-500 cursor-pointer p-1"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-border/60 flex justify-end bg-[#131f38] border-border">
              <button
                type="button"
                onClick={() => setIsEventModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer"
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
