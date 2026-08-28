'use client'

import React, { useState, useMemo } from 'react'
import {
  ShieldCheck,
  CheckCircle2,
  Award,
  TrendingUp,
  Download,
  Building2,
  Layers,
  Sparkles,
  Zap,
  Leaf,
  Sun,
  Flame,
  FileCheck,
  Save,
  CheckSquare,
  Square,
  AlertCircle,
  HelpCircle,
  Info,
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { cn } from '@/lib/utils'

interface AssessmentItem {
  id: string
  category: '1. 能源结构清洁化' | '2. 生产能效与降碳' | '3. 智慧微网与储能' | '4. 碳中和抵销机制' | '5. 绿色运营与管理'
  name: string
  scoreWeight: number
  isAutoLinked: boolean
  linkedValue?: string
  checked: boolean
  standardDesc: string
}

// 评估建设项标准清单
const DEFAULT_ASSESSMENT_ITEMS: AssessmentItem[] = [
  // 1. 能源结构清洁化 (30分)
  {
    id: 'e-1',
    category: '1. 能源结构清洁化',
    name: '园区屋顶分布式光伏装机覆盖率 ≥ 40%',
    scoreWeight: 10,
    isAutoLinked: true,
    linkedValue: '实测 48.2% (已达标)',
    checked: true,
    standardDesc: '利用主要生产车间与库房屋顶建设光伏，自发自用比例超过 85%',
  },
  {
    id: 'e-2',
    category: '1. 能源结构清洁化',
    name: '绿电交易与跨省绿电采购消纳占比 ≥ 30%',
    scoreWeight: 10,
    isAutoLinked: true,
    linkedValue: '实测 38.6% (已达标)',
    checked: true,
    standardDesc: '通过电力交易中心常态化采购水电、风电等绿色电力',
  },
  {
    id: 'e-3',
    category: '1. 能源结构清洁化',
    name: '工业用能全面电气化替代 (电加热/热泵替代直接燃煤燃气)',
    scoreWeight: 10,
    isAutoLinked: false,
    checked: true,
    standardDesc: '除特定高温工序外，全面淘汰直燃煤与工业锅炉',
  },

  // 2. 生产能效与降碳 (25分)
  {
    id: 'f-1',
    category: '2. 生产能效与降碳',
    name: '重点设备 1 级能效电机与变频器普及率 ≥ 80%',
    scoreWeight: 10,
    isAutoLinked: false,
    checked: true,
    standardDesc: '车间水泵、风机、空压机均选用国家一级能效永磁同步电机',
  },
  {
    id: 'f-2',
    category: '2. 生产能效与降碳',
    name: '工业余热/废热梯级回收系统投运',
    scoreWeight: 8,
    isAutoLinked: false,
    checked: true,
    standardDesc: '真空干燥罐及空压站配备水冷余热回收系统并接入园区管网',
  },
  {
    id: 'f-3',
    category: '2. 生产能效与降碳',
    name: '单位产品能耗指标达到行业先进标杆值',
    scoreWeight: 7,
    isAutoLinked: true,
    linkedValue: '优于国标先进值 6.2%',
    checked: true,
    standardDesc: '变压器/线缆单耗优于行业领跑者基准线',
  },

  // 3. 智慧微网与储能 (20分)
  {
    id: 'm-1',
    category: '3. 智慧微网与储能',
    name: '配备用户侧电化学储能 (容量 ≥ 变压器容量 10%)',
    scoreWeight: 8,
    isAutoLinked: true,
    linkedValue: '已投运 6MW/12MWh',
    checked: true,
    standardDesc: '具备两充两放削峰填谷与毫秒级应急保供电能力',
  },
  {
    id: 'm-2',
    category: '3. 智慧微网与储能',
    name: '接入特变电工能碳双中心数字化集控平台',
    scoreWeight: 7,
    isAutoLinked: true,
    linkedValue: '100% 测点在线接入',
    checked: true,
    standardDesc: '实现 15 分钟颗粒度电、气、水、汽时序数据自动采集与告警',
  },
  {
    id: 'm-3',
    category: '3. 智慧微网与储能',
    name: '微电网 EMS 能量管理与负荷柔性调控',
    scoreWeight: 5,
    isAutoLinked: false,
    checked: false,
    standardDesc: '实现车间冲击性试验负荷与光储协同智能调度',
  },

  // 4. 碳中和抵销机制 (15分)
  {
    id: 'c-1',
    category: '4. 碳中和抵销机制',
    name: '完成年度 ISO 14064-1 组织级温室气体核查',
    scoreWeight: 6,
    isAutoLinked: false,
    checked: true,
    standardDesc: '取得第三方权威机构出具的核查声明书',
  },
  {
    id: 'c-2',
    category: '4. 碳中和抵销机制',
    name: '绿色电力证书 (GEC) 全额核销或 CCER 碳汇抵销',
    scoreWeight: 5,
    isAutoLinked: false,
    checked: true,
    standardDesc: '通过绿色电力证书核销剩余外购电网间接排放',
  },
  {
    id: 'c-3',
    category: '4. 碳中和抵销机制',
    name: '核心产品取得 ISO 14067 碳足迹认证或 EPD 环境声明',
    scoreWeight: 4,
    isAutoLinked: false,
    checked: false,
    standardDesc: '至少 3 款主型号产品完成产品碳足迹报告与认证',
  },

  // 5. 绿色运营与管理 (10分)
  {
    id: 'g-1',
    category: '5. 绿色运营与管理',
    name: '设立园区零碳管理专岗与双碳目标考核机制',
    scoreWeight: 5,
    isAutoLinked: false,
    checked: true,
    standardDesc: '设立专职能源管理员，将节能降碳纳入车间月度 KPI 考核',
  },
  {
    id: 'g-2',
    category: '5. 绿色运营与管理',
    name: '绿色低碳物流车/叉车电动化率 ≥ 90%',
    scoreWeight: 5,
    isAutoLinked: false,
    checked: true,
    standardDesc: '园区内部搬运叉车与短途驳运车辆全面完成电动化置换',
  },
]

/* ============================================================
 * 🌟 放大版·工业级高保真五维评估雷达图 (Large Five-Dimension SVG Radar)
 * ============================================================ */
interface DimensionItem {
  key: string
  name: string
  shortName: string
  score: number
  max: number
  color: string
}

function FiveDimensionRadarChart({ dimensions }: { dimensions: DimensionItem[] }) {
  // 放大雷达中心与半径 (由 88 放大至 125，整体更饱满清晰)
  const cx = 230
  const cy = 180
  const radius = 125

  // 5个顶点的角度 (顶部为 -90度, 顺时针分布 72度)
  const angles = [
    -Math.PI / 2, // 0: 顶部 能源结构清洁化
    -Math.PI / 2 + (2 * Math.PI) / 5, // 1: 右上 生产能效与降碳
    -Math.PI / 2 + (4 * Math.PI) / 5, // 2: 右下 智慧微网与储能
    -Math.PI / 2 + (6 * Math.PI) / 5, // 3: 左下 碳中和抵销机制
    -Math.PI / 2 + (8 * Math.PI) / 5, // 4: 左上 绿色运营与管理
  ]

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0]

  const getPoints = (scale: number) => {
    return angles
      .map((angle) => {
        const x = cx + radius * scale * Math.cos(angle)
        const y = cy + radius * scale * Math.sin(angle)
        return `${x.toFixed(1)},${y.toFixed(1)}`
      })
      .join(' ')
  }

  const actualPoints = angles
    .map((angle, i) => {
      const dim = dimensions[i]
      const ratio = dim && dim.max > 0 ? Math.min(1, Math.max(0.08, dim.score / dim.max)) : 0.08
      const x = cx + radius * ratio * Math.cos(angle)
      const y = cy + radius * ratio * Math.sin(angle)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  const dotCoords = angles.map((angle, i) => {
    const dim = dimensions[i]
    const ratio = dim && dim.max > 0 ? Math.min(1, Math.max(0.08, dim.score / dim.max)) : 0.08
    return {
      x: cx + radius * ratio * Math.cos(angle),
      y: cy + radius * ratio * Math.sin(angle),
      dim,
    }
  })

  const labelPositions = [
    { textAnchor: 'middle', dx: 0, dy: -16 },
    { textAnchor: 'start', dx: 14, dy: -4 },
    { textAnchor: 'start', dx: 12, dy: 16 },
    { textAnchor: 'end', dx: -12, dy: 16 },
    { textAnchor: 'end', dx: -14, dy: -4 },
  ]

  return (
    <div className="w-full flex flex-col items-center select-none py-2">
      <svg
        viewBox="0 0 460 360"
        className="w-full max-w-[440px] h-[330px] overflow-visible"
      >
        {/* 同心五边形网格 */}
        {gridLevels.map((level, idx) => (
          <polygon
            key={idx}
            points={getPoints(level)}
            fill={idx % 2 === 1 ? '#f8fafc' : '#ffffff'}
            stroke="#e2e8f0"
            strokeWidth={level === 1.0 ? 1.5 : 1}
            strokeDasharray={level < 1.0 ? '3 3' : undefined}
          />
        ))}

        {/* 5 条主轴放射线 */}
        {angles.map((angle, i) => {
          const x2 = cx + radius * Math.cos(angle)
          const y2 = cy + radius * Math.sin(angle)
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={x2}
              y2={y2}
              stroke="#cbd5e1"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          )
        })}

        {/* 满分标杆基准多边形 (外圈虚线) */}
        <polygon
          points={getPoints(1.0)}
          fill="none"
          stroke="#94a3b8"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* 实际得分填充多边形 (特变蓝渐变质感) */}
        <polygon
          points={actualPoints}
          fill="rgba(22, 119, 255, 0.22)"
          stroke="#1677ff"
          strokeWidth="2.8"
          className="transition-all duration-300 ease-out"
        />

        {/* 5 个顶点圆点 */}
        {dotCoords.map((pt, i) => (
          <g key={i} className="transition-all duration-300 ease-out">
            <circle
              cx={pt.x}
              cy={pt.y}
              r={5.5}
              fill="#1677ff"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <circle cx={pt.x} cy={pt.y} r={9} fill="#1677ff" fillOpacity="0.25" />
          </g>
        ))}

        {/* 5 个维度的外部文字与分值标签 (字号加大) */}
        {angles.map((angle, i) => {
          const dim = dimensions[i]
          if (!dim) return null
          const labelDist = radius * 1.25
          const lx = cx + labelDist * Math.cos(angle)
          const ly = cy + labelDist * Math.sin(angle)
          const pos = labelPositions[i]
          const pct = dim.max > 0 ? ((dim.score / dim.max) * 100).toFixed(0) : '0'

          return (
            <g key={i} transform={`translate(${lx + pos.dx}, ${ly + pos.dy})`}>
              <text
                textAnchor={pos.textAnchor as any}
                className="text-xs font-bold fill-slate-800"
              >
                {dim.shortName}
              </text>
              <text
                textAnchor={pos.textAnchor as any}
                y={16}
                className="text-[11px] font-mono fill-[#1677ff] font-bold"
              >
                {dim.score} / {dim.max}分 ({pct}%)
              </text>
            </g>
          )
        })}
      </svg>

      {/* 图例 */}
      <div className="flex items-center justify-center gap-6 text-xs font-mono pt-3 text-slate-600">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-xs bg-[#1677ff]/30 border border-[#1677ff]" />
          <span className="font-bold text-slate-800">本园区自评得分 (实际)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-0.5 border-t-2 border-dashed border-slate-400" />
          <span className="text-slate-500">满分标杆基准 (100%)</span>
        </div>
      </div>
    </div>
  )
}

export default function ParkSelfAssessmentPage() {
  const [selectedNode, setSelectedNode] = useState<StandardOrgNode>({
    id: 'park_01',
    name: '特变电工东北输变电产业园',
    fullName: '特变电工东北输变电产业园 (沈阳市)',
    level: 'park',
    badge: '沈阳',
  })

  const [items, setItems] = useState<AssessmentItem[]>(DEFAULT_ASSESSMENT_ITEMS)
  const [saveToast, setSaveToast] = useState(false)

  // 切换单项勾选
  const handleToggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    )
  }

  // 动态计算总分与五维雷达得分
  const evaluationResult = useMemo(() => {
    let totalScore = 0
    const catScores: Record<string, { current: number; max: number; short: string }> = {
      '1. 能源结构清洁化': { current: 0, max: 30, short: '能源结构清洁化' },
      '2. 生产能效与降碳': { current: 0, max: 25, short: '生产能效与降碳' },
      '3. 智慧微网与储能': { current: 0, max: 20, short: '智慧微网与储能' },
      '4. 碳中和抵销机制': { current: 0, max: 15, short: '碳中和抵销机制' },
      '5. 绿色运营与管理': { current: 0, max: 10, short: '绿色运营与管理' },
    }

    let checkedCount = 0

    items.forEach((item) => {
      if (item.checked) {
        totalScore += item.scoreWeight
        checkedCount++
        if (catScores[item.category]) {
          catScores[item.category].current += item.scoreWeight
        }
      }
    })

    // 星级判定
    let starLevel = '⭐️⭐️ 二星级低碳园区'
    let badgeClass = 'bg-blue-50 text-blue-700 border-blue-200'
    if (totalScore >= 95) {
      starLevel = '⭐️⭐️⭐️⭐️⭐️ 五星级零碳示范领跑园区'
      badgeClass = 'bg-purple-50 text-purple-700 border-purple-200'
    } else if (totalScore >= 85) {
      starLevel = '⭐️⭐️⭐️⭐️ 四星级近零碳标杆园区'
      badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200'
    } else if (totalScore >= 75) {
      starLevel = '⭐️⭐️⭐️ 三星级低碳先行园区'
      badgeClass = 'bg-amber-50 text-amber-700 border-amber-200'
    }

    // 五维雷达数据项
    const dimensions: DimensionItem[] = [
      {
        key: 'clean',
        name: '1. 能源结构清洁化 (30分)',
        shortName: '能源清洁化',
        score: catScores['1. 能源结构清洁化'].current,
        max: 30,
        color: '#1677ff',
      },
      {
        key: 'efficiency',
        name: '2. 生产能效与降碳 (25分)',
        shortName: '能效与降碳',
        score: catScores['2. 生产能效与降碳'].current,
        max: 25,
        color: '#10b981',
      },
      {
        key: 'microgrid',
        name: '3. 智慧微网与储能 (20分)',
        shortName: '智慧微网',
        score: catScores['3. 智慧微网与储能'].current,
        max: 20,
        color: '#f59e0b',
      },
      {
        key: 'neutrality',
        name: '4. 碳中和抵销机制 (15分)',
        shortName: '中和抵销',
        score: catScores['4. 碳中和抵销机制'].current,
        max: 15,
        color: '#8b5cf6',
      },
      {
        key: 'management',
        name: '5. 绿色运营与管理 (10分)',
        shortName: '绿色运营',
        score: catScores['5. 绿色运营与管理'].current,
        max: 10,
        color: '#06b6d4',
      },
    ]

    return {
      totalScore,
      starLevel,
      badgeClass,
      checkedCount,
      totalCount: items.length,
      dimensions,
    }
  }, [items])

  const handleSaveSelfEval = () => {
    setSaveToast(true)
    setTimeout(() => setSaveToast(false), 3000)
  }

  return (
    <div className="flex gap-3.5 items-start font-sans">
      {/* 🌟 左侧 270px 17 个零碳园区拓扑树 */}
      <StandardOrgTree
        selectedId={selectedNode.id}
        onSelect={(node) => setSelectedNode(node)}
        treeType="park"
      />

      {/* 🌟 右侧主面板 */}
      <div className="flex-1 min-w-0 flex flex-col gap-3.5">
        {/* 1. 顶部 Header (单行主标题 + 自评保存与导出) */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
              <ShieldCheck className="size-5" />
            </div>
            <h1 className="text-base font-bold text-slate-800">零碳园区自评估</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert(`已生成【${selectedNode.name}】零碳园区建设自评估综合诊断报告！`)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="size-3.5 text-slate-500" />
              导出自评报告
            </button>
            <button
              type="button"
              onClick={handleSaveSelfEval}
              className="px-3.5 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="size-3.5" />
              保存自评估结果
            </button>
          </div>
        </div>

        {saveToast && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-600" />
              【${selectedNode.name}】零碳自评估得分与建设项进度已成功保存归档！
            </span>
            <span className="font-mono text-[10px] text-emerald-600">综合得分: {evaluationResult.totalScore}分</span>
          </div>
        )}

        {/* 2. 当前园区自评估概览卡片 (总分 + 星级 + 实测能碳指标联动) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="size-12 rounded-xl bg-blue-50 border border-blue-200 flex flex-col items-center justify-center font-mono font-bold text-[#1677ff] shrink-0">
              <span className="text-lg leading-none">{evaluationResult.totalScore}</span>
              <span className="text-[9px] text-slate-500">综合得分</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">{selectedNode.name}</h2>
                <span className={cn('px-2 py-0.5 rounded-full text-xs font-bold border', evaluationResult.badgeClass)}>
                  {evaluationResult.starLevel}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                已达标建设项：<b className="text-slate-800">{evaluationResult.checkedCount}</b> / {evaluationResult.totalCount} 项 · 
                完成率：<b className="text-[#1677ff]">{((evaluationResult.checkedCount / evaluationResult.totalCount) * 100).toFixed(1)}%</b>
              </p>
            </div>
          </div>

          {/* 实时联动能碳数据快照 */}
          <div className="flex items-center gap-4 text-xs font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 block font-sans">绿电消纳率</span>
              <span className="font-bold text-emerald-600">38.6%</span>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div>
              <span className="text-[10px] text-slate-400 block font-sans">单位产值能耗</span>
              <span className="font-bold text-blue-600">0.58 tce/万元</span>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div>
              <span className="text-[10px] text-slate-400 block font-sans">自动采集率</span>
              <span className="font-bold text-purple-600">96.8%</span>
            </div>
          </div>
        </div>

        {/* 3. 中部：五维能力雷达图 (大幅放大并居中) + 在线勾选建设项清单 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
          {/* 左侧 5 列：五维雷达图 (已彻底移除建议框，图表饱满居中) */}
          <div className="lg:col-span-5 bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-start">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#1677ff]" />
                <h3 className="text-xs font-bold text-slate-800">零碳园区五维评估雷达模型</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">100分制评估体系</span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono mb-2">
              当前自评得分 vs 集团五星标杆满分基准线
            </p>

            {/* 🌟 放大版高保真 SVG 五维雷达图 */}
            <div className="flex-1 flex items-center justify-center min-h-[380px] bg-[#fafbfc]/50 rounded-xl border border-slate-100 p-2">
              <FiveDimensionRadarChart dimensions={evaluationResult.dimensions} />
            </div>
          </div>

          {/* 右侧 7 列：在线自评勾选与填报清单 */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
            <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-[#fafbfc]">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500" />
                <h3 className="text-xs font-bold text-slate-800">
                  零碳园区建设项清单 (支持在线勾选/修改填报)
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">勾选后系统即时自动重算总分与图表</span>
            </div>

            <div className="p-3.5 overflow-y-auto max-h-[560px] space-y-3 divide-y divide-slate-100 text-xs">
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleToggle(item.id)}
                  className="pt-3 first:pt-0 flex items-start gap-3 cursor-pointer hover:bg-slate-50/80 p-2 rounded-lg transition-colors group"
                >
                  <div className="mt-0.5 shrink-0 text-[#1677ff]">
                    {item.checked ? (
                      <CheckSquare className="size-4.5 text-[#1677ff]" />
                    ) : (
                      <Square className="size-4.5 text-slate-300 group-hover:text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 group-hover:text-[#1677ff] transition-colors">
                          {item.name}
                        </span>
                        {item.isAutoLinked && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold">
                            实测联动: {item.linkedValue}
                          </span>
                        )}
                      </div>
                      <span className="font-mono font-bold text-slate-700 shrink-0">
                        +{item.scoreWeight} 分
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {item.standardDesc}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                      维度：{item.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
