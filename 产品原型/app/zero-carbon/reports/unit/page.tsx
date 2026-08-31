'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  Download,
  Calendar,
  Search,
  Zap,
  Cable,
  Layers,
  RotateCcw,
  Building2,
  Factory,
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { cn } from '@/lib/utils'

interface TransformerOrderRow {
  id: string
  unitId: string
  unitName: string
  company: string
  model: string
  capacityMva: number
  cutStack: number
  winding: number
  vacuumDry: number
  assemblyTest: number
  unitKwhPerKva: number
  tcePerUnit: number
  yoy: string
}

interface CableOrderRow {
  id: string
  unitId: string
  unitName: string
  company: string
  model: string
  lengthKm: number
  drawing: number
  stranding: number
  crosslinking: number
  sheathing: number
  unitKwhPerKm: number
  tcePerKm: number
  yoy: string
}

// ⚡ 变压器产业产品单耗台账 (覆盖沈变、衡变、新变及其全部二级/车间单位)
const ALL_TRANSFORMER_ROWS: TransformerOrderRow[] = [
  // --- 1. 沈变公司 ---
  {
    id: 'SB-01',
    unitId: 'ws_sb_main',
    unitName: '沈变本部',
    company: '沈变公司',
    model: 'ODFS-334MVA/500kV 单相自耦变压器',
    capacityMva: 334.0,
    cutStack: 12450,
    winding: 8320,
    vacuumDry: 58400,
    assemblyTest: 26830,
    unitKwhPerKva: 0.317,
    tcePerUnit: 13.02,
    yoy: '-6.2%',
  },
  {
    id: 'SB-02',
    unitId: 'ws_sb_main',
    unitName: '沈变本部',
    company: '沈变公司',
    model: 'SSP-840MVA/500kV 三相升压变压器',
    capacityMva: 840.0,
    cutStack: 28400,
    winding: 19800,
    vacuumDry: 142000,
    assemblyTest: 68800,
    unitKwhPerKva: 0.308,
    tcePerUnit: 31.85,
    yoy: '-7.2%',
  },
  {
    id: 'SB-03',
    unitId: 'ws_sb_luna',
    unitName: '露娜公司 (特变电工露娜智能)',
    company: '沈变公司',
    model: 'LN-ZB-110kV 智能变电站集成柜变',
    capacityMva: 63.0,
    cutStack: 2400,
    winding: 1680,
    vacuumDry: 11200,
    assemblyTest: 5320,
    unitKwhPerKva: 0.327,
    tcePerUnit: 2.53,
    yoy: '-5.1%',
  },
  {
    id: 'SB-04',
    unitId: 'ws_sb_zh',
    unitName: '智慧能源',
    company: '沈变公司',
    model: 'ZH-PV-3150kVA 光伏箱式升压变',
    capacityMva: 3.15,
    cutStack: 210,
    winding: 155,
    vacuumDry: 620,
    assemblyTest: 295,
    unitKwhPerKva: 0.406,
    tcePerUnit: 0.16,
    yoy: '-4.8%',
  },
  {
    id: 'SB-05',
    unitId: 'ws_sb_hx',
    unitName: '和新套管公司',
    company: '沈变公司',
    model: 'HX-B-500kV 环氧玻纤复合绝缘套管',
    capacityMva: 10.0,
    cutStack: 180,
    winding: 140,
    vacuumDry: 1850,
    assemblyTest: 860,
    unitKwhPerKva: 0.303,
    tcePerUnit: 0.37,
    yoy: '-5.8%',
  },
  {
    id: 'SB-06',
    unitId: 'ws_sb_kj',
    unitName: '康嘉互感器',
    company: '沈变公司',
    model: 'KJ-LV-500kV 倒置式油浸电流互感器',
    capacityMva: 8.0,
    cutStack: 140,
    winding: 110,
    vacuumDry: 1520,
    assemblyTest: 710,
    unitKwhPerKva: 0.310,
    tcePerUnit: 0.30,
    yoy: '-4.2%',
  },
  {
    id: 'SB-07',
    unitId: 'ws_sb_yn',
    unitName: '印能公司',
    company: '沈变公司',
    model: 'YN-SC-1250kVA 高效特种工业整流变',
    capacityMva: 1.25,
    cutStack: 95,
    winding: 75,
    vacuumDry: 310,
    assemblyTest: 145,
    unitKwhPerKva: 0.500,
    tcePerUnit: 0.08,
    yoy: '-3.9%',
  },

  // --- 2. 衡变公司 ---
  {
    id: 'HB-01',
    unitId: 'ws_hb_main',
    unitName: '衡变本部',
    company: '衡变公司',
    model: 'SFP-240MVA/220kV 三相三线电力变',
    capacityMva: 240.0,
    cutStack: 8900,
    winding: 6120,
    vacuumDry: 41200,
    assemblyTest: 19780,
    unitKwhPerKva: 0.316,
    tcePerUnit: 9.34,
    yoy: '-6.5%',
  },
  {
    id: 'HB-02',
    unitId: 'ws_hb_main',
    unitName: '衡变本部',
    company: '衡变公司',
    model: 'OSFPSZ-334MVA/500kV 特高压自耦变',
    capacityMva: 334.0,
    cutStack: 12200,
    winding: 8100,
    vacuumDry: 57800,
    assemblyTest: 26400,
    unitKwhPerKva: 0.313,
    tcePerUnit: 12.85,
    yoy: '-6.8%',
  },
  {
    id: 'HB-03',
    unitId: 'ws_hb_kg',
    unitName: '云集高压开关',
    company: '衡变公司',
    model: 'YJ-GIS-220kV 气体绝缘组合开关本体变',
    capacityMva: 40.0,
    cutStack: 1600,
    winding: 1100,
    vacuumDry: 7200,
    assemblyTest: 3400,
    unitKwhPerKva: 0.333,
    tcePerUnit: 1.63,
    yoy: '-5.0%',
  },
  {
    id: 'HB-04',
    unitId: 'ws_hb_nj',
    unitName: '南京电研',
    company: '衡变公司',
    model: 'NJ-DY-110kV 智能微电网主变压器',
    capacityMva: 50.0,
    cutStack: 1950,
    winding: 1350,
    vacuumDry: 8600,
    assemblyTest: 3900,
    unitKwhPerKva: 0.316,
    tcePerUnit: 1.94,
    yoy: '-5.6%',
  },
  {
    id: 'HB-05',
    unitId: 'ws_hb_hn',
    unitName: '湖南电气',
    company: '衡变公司',
    model: 'HN-DQ-35kV 矿用隔爆移动变电站',
    capacityMva: 4.0,
    cutStack: 260,
    winding: 190,
    vacuumDry: 950,
    assemblyTest: 460,
    unitKwhPerKva: 0.465,
    tcePerUnit: 0.23,
    yoy: '-4.1%',
  },

  // --- 3. 新变厂 ---
  {
    id: 'XB-01',
    unitId: 'ws_xb_uhv',
    unitName: '超高压公司',
    company: '新变厂',
    model: 'SZ11-50MVA/110kV 有载调压变',
    capacityMva: 50.0,
    cutStack: 2100,
    winding: 1450,
    vacuumDry: 8900,
    assemblyTest: 4050,
    unitKwhPerKva: 0.330,
    tcePerUnit: 2.03,
    yoy: '-4.3%',
  },
  {
    id: 'XB-02',
    unitId: 'ws_xb_uhv',
    unitName: '超高压公司',
    company: '新变厂',
    model: 'S13-M-20000kVA 节能油浸式电力变',
    capacityMva: 20.0,
    cutStack: 880,
    winding: 620,
    vacuumDry: 3800,
    assemblyTest: 1750,
    unitKwhPerKva: 0.353,
    tcePerUnit: 0.87,
    yoy: '-5.2%',
  },
  {
    id: 'XB-03',
    unitId: 'ws_xb_tb',
    unitName: '天变公司',
    company: '新变厂',
    model: 'SCB13-1600kVA 环氧树脂干式变',
    capacityMva: 1.6,
    cutStack: 120,
    winding: 95,
    vacuumDry: 380,
    assemblyTest: 185,
    unitKwhPerKva: 0.487,
    tcePerUnit: 0.12,
    yoy: '-5.4%',
  },
  {
    id: 'XB-04',
    unitId: 'ws_xb_tb',
    unitName: '天变公司',
    company: '新变厂',
    model: 'SCB14-2500kVA 一级能效干式变',
    capacityMva: 2.5,
    cutStack: 165,
    winding: 130,
    vacuumDry: 510,
    assemblyTest: 245,
    unitKwhPerKva: 0.420,
    tcePerUnit: 0.13,
    yoy: '-6.0%',
  },
  {
    id: 'XB-05',
    unitId: 'ws_xb_zndq',
    unitName: '智能电气公司',
    company: '新变厂',
    model: 'ZN-XB-630kVA 预装式智能欧式箱变',
    capacityMva: 0.63,
    cutStack: 55,
    winding: 42,
    vacuumDry: 160,
    assemblyTest: 78,
    unitKwhPerKva: 0.532,
    tcePerUnit: 0.04,
    yoy: '-3.8%',
  },
]

// 🔌 线缆产业产品单耗台账 (覆盖鲁缆、新缆、德缆及其全部车间单位)
const ALL_CABLE_ROWS: CableOrderRow[] = [
  // --- 1. 鲁缆公司 ---
  {
    id: 'LL-01',
    unitId: 'ws_ll_main',
    unitName: '鲁缆本部',
    company: '鲁缆公司',
    model: 'YJLW03-64/110kV 1x1200mm² 高压交联电缆',
    lengthKm: 120.0,
    drawing: 14200,
    stranding: 9800,
    crosslinking: 82400,
    sheathing: 38600,
    unitKwhPerKm: 1.208,
    tcePerKm: 0.18,
    yoy: '-6.1%',
  },
  {
    id: 'LL-02',
    unitId: 'ws_ll_main',
    unitName: '鲁缆本部',
    company: '鲁缆公司',
    model: 'YJV22-8.7/15kV 3x300mm² 铠装中压电缆',
    lengthKm: 210.0,
    drawing: 16800,
    stranding: 11400,
    crosslinking: 89000,
    sheathing: 41200,
    unitKwhPerKm: 0.754,
    tcePerKm: 0.11,
    yoy: '-5.5%',
  },
  {
    id: 'LL-03',
    unitId: 'ws_ll_zl',
    unitName: '智缆公司',
    company: '鲁缆公司',
    model: 'ZL-B1-0.6/1kV 4x120mm² 阻燃智能矿物绝缘电缆',
    lengthKm: 95.0,
    drawing: 7600,
    stranding: 5200,
    crosslinking: 39500,
    sheathing: 18800,
    unitKwhPerKm: 0.748,
    tcePerKm: 0.11,
    yoy: '-4.9%',
  },
  {
    id: 'LL-04',
    unitId: 'ws_ll_sg',
    unitName: '曙光公司',
    company: '鲁缆公司',
    model: 'SG-JKLYJ-10kV 1x185mm² 架空绝缘线',
    lengthKm: 320.0,
    drawing: 19800,
    stranding: 13500,
    crosslinking: 98000,
    sheathing: 44000,
    unitKwhPerKm: 0.548,
    tcePerKm: 0.08,
    yoy: '-5.2%',
  },
  {
    id: 'LL-05',
    unitId: 'ws_ll_sw',
    unitName: '昭和公司',
    company: '鲁缆公司',
    model: 'ZH-DC-1500V 1x70mm² 光伏专用直流电缆',
    lengthKm: 180.0,
    drawing: 9200,
    stranding: 6400,
    crosslinking: 51200,
    sheathing: 24300,
    unitKwhPerKm: 0.506,
    tcePerKm: 0.08,
    yoy: '-4.6%',
  },

  // --- 2. 新缆厂 ---
  {
    id: 'XL-01',
    unitId: 'ws_xl_main',
    unitName: '特变电工新疆电缆有限公司',
    company: '新缆厂',
    model: 'JKLYJ-10kV 1x240mm² 架空绝缘导线',
    lengthKm: 280.0,
    drawing: 18500,
    stranding: 12400,
    crosslinking: 95000,
    sheathing: 42000,
    unitKwhPerKm: 0.599,
    tcePerKm: 0.09,
    yoy: '-5.8%',
  },
  {
    id: 'XL-02',
    unitId: 'ws_xl_main',
    unitName: '特变电工新疆电缆有限公司',
    company: '新缆厂',
    model: 'JL/G1A-630/45 钢芯铝绞线 (特高压大截面导线)',
    lengthKm: 450.0,
    drawing: 28600,
    stranding: 21200,
    crosslinking: 124000,
    sheathing: 53000,
    unitKwhPerKm: 0.504,
    tcePerKm: 0.08,
    yoy: '-6.4%',
  },
  {
    id: 'XL-03',
    unitId: 'ws_xl_sub',
    unitName: '特变电工新疆线缆厂',
    company: '新缆厂',
    model: 'YJV-0.6/1kV 5x16mm² 铜芯交联聚乙烯电缆',
    lengthKm: 140.0,
    drawing: 6800,
    stranding: 4600,
    crosslinking: 38500,
    sheathing: 17200,
    unitKwhPerKm: 0.479,
    tcePerKm: 0.07,
    yoy: '-4.7%',
  },

  // --- 3. 德缆公司 ---
  {
    id: 'DL-01',
    unitId: 'ws_dl_main',
    unitName: '特变电工（德阳）电缆股份有限公司',
    company: '德缆公司',
    model: 'WDZ-YJY-0.6/1kV 4x185mm² 低烟无卤电力电缆',
    lengthKm: 160.0,
    drawing: 11200,
    stranding: 8300,
    crosslinking: 64000,
    sheathing: 29500,
    unitKwhPerKm: 0.706,
    tcePerKm: 0.11,
    yoy: '-4.5%',
  },
  {
    id: 'DL-02',
    unitId: 'ws_dl_main',
    unitName: '特变电工（德阳）电缆股份有限公司',
    company: '德缆公司',
    model: 'NH-YJV-0.6/1kV 4x95mm² 矿用耐火电力电缆',
    lengthKm: 110.0,
    drawing: 7400,
    stranding: 5100,
    crosslinking: 43200,
    sheathing: 20100,
    unitKwhPerKm: 0.689,
    tcePerKm: 0.10,
    yoy: '-5.0%',
  },
]

export default function UnitReportPage() {
  const [selectedNode, setSelectedNode] = useState<StandardOrgNode>({
    id: 'group_root',
    name: '电装集团',
    fullName: '电装集团',
    level: 'group',
    badge: '全集团',
  })

  // 时间维度与范围 (参照图2样式)
  const [timeDim, setTimeDim] = useState<'month' | 'quarter' | 'year'>('month')
  const [selectedMonthRange, setSelectedMonthRange] = useState({ start: '2026-01', end: '2026-08' })
  const [selectedQuarter, setSelectedQuarter] = useState('2026-Q3')
  const [selectedYear, setSelectedYear] = useState('2026')

  const [activeTab, setActiveTab] = useState<'transformer' | 'cable'>('transformer')
  const [searchKw, setSearchKw] = useState('')

  // 🌟 当左侧拓扑树切换选中节点时，智能自动匹配 Tab
  useEffect(() => {
    if (selectedNode.id === 'group_root' || selectedNode.id === 'ent_root' || selectedNode.id === 'park_root') {
      return
    }
    const nodeName = selectedNode.name
    const nodeId = selectedNode.id

    // 线缆相关节点自动切换到线缆报表
    if (
      nodeName.includes('缆') ||
      nodeName.includes('线') ||
      nodeId.includes('ll') ||
      nodeId.includes('xl') ||
      nodeId.includes('dl')
    ) {
      setActiveTab('cable')
    }
    // 变压器相关节点自动切换到变压器报表
    else if (
      nodeName.includes('变') ||
      nodeName.includes('套管') ||
      nodeName.includes('互感器') ||
      nodeName.includes('开关') ||
      nodeName.includes('超高压') ||
      nodeId.includes('sb') ||
      nodeId.includes('hb') ||
      nodeId.includes('xb')
    ) {
      setActiveTab('transformer')
    }
  }, [selectedNode])

  // 组织树与关键词联动过滤 - 变压器
  const filteredTransOrders = useMemo(() => {
    let rows = [...ALL_TRANSFORMER_ROWS]

    // 组织树联动
    if (selectedNode.id !== 'group_root' && selectedNode.id !== 'ent_root' && selectedNode.id !== 'park_root') {
      const matchKey = selectedNode.name.slice(0, 2)
      const matched = rows.filter((r) => {
        return (
          r.unitId === selectedNode.id ||
          r.unitName.includes(selectedNode.name) ||
          selectedNode.name.includes(r.unitName) ||
          r.company.includes(matchKey) ||
          r.unitName.includes(matchKey)
        )
      })
      if (matched.length > 0) {
        rows = matched
      } else {
        // 如果是在变压器产业，但当前选的是线缆单位，显示空或提示
        rows = rows.filter((r) => r.company.includes(matchKey))
      }
    }

    if (searchKw.trim()) {
      const kw = searchKw.toLowerCase()
      rows = rows.filter((r) => r.model.toLowerCase().includes(kw) || r.unitName.toLowerCase().includes(kw))
    }
    return rows
  }, [selectedNode, searchKw])

  // 组织树与关键词联动过滤 - 线缆
  const filteredCableOrders = useMemo(() => {
    let rows = [...ALL_CABLE_ROWS]

    // 组织树联动
    if (selectedNode.id !== 'group_root' && selectedNode.id !== 'ent_root' && selectedNode.id !== 'park_root') {
      const matchKey = selectedNode.name.slice(0, 2)
      const matched = rows.filter((r) => {
        return (
          r.unitId === selectedNode.id ||
          r.unitName.includes(selectedNode.name) ||
          selectedNode.name.includes(r.unitName) ||
          r.company.includes(matchKey) ||
          r.unitName.includes(matchKey)
        )
      })
      if (matched.length > 0) {
        rows = matched
      } else {
        rows = rows.filter((r) => r.company.includes(matchKey))
      }
    }

    if (searchKw.trim()) {
      const kw = searchKw.toLowerCase()
      rows = rows.filter((r) => r.model.toLowerCase().includes(kw) || r.unitName.toLowerCase().includes(kw))
    }
    return rows
  }, [selectedNode, searchKw])

  const isFiltered = selectedNode.id !== 'group_root' && selectedNode.id !== 'ent_root' && selectedNode.id !== 'park_root'

  return (
    <div className="flex gap-3.5 items-start">
      {/* 左侧 270px 经典工业级拓扑树 */}
      <StandardOrgTree
        selectedId={selectedNode.id}
        onSelect={(node) => setSelectedNode(node)}
      />

      {/* 右侧主面板 */}
      <div className="flex-1 min-w-0 flex flex-col gap-3.5">
        {/* 顶部面包屑与操作栏 */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
              <Layers className="size-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800">单耗报表</h1>
            </div>
          </div>

          {/* 工具栏 (参照指标管控及图2时间查询条件规范) */}
          <div className="flex flex-wrap items-center gap-2">
            {/* 时间维度切换 */}
            <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setTimeDim('month')}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
                  timeDim === 'month' ? 'font-bold bg-white text-[#1677ff] shadow-xs' : 'text-slate-600 hover:text-slate-900',
                )}
              >
                月度
              </button>
              <button
                type="button"
                onClick={() => setTimeDim('quarter')}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
                  timeDim === 'quarter' ? 'font-bold bg-white text-[#1677ff] shadow-xs' : 'text-slate-600 hover:text-slate-900',
                )}
              >
                季度
              </button>
              <button
                type="button"
                onClick={() => setTimeDim('year')}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-all cursor-pointer select-none',
                  timeDim === 'year' ? 'font-bold bg-white text-[#1677ff] shadow-xs' : 'text-slate-600 hover:text-slate-900',
                )}
              >
                年度
              </button>
            </div>

            {/* 时间范围选择控件 (随维度自适应切换，图2样式) */}
            {timeDim === 'month' && (
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs shadow-2xs font-mono">
                <Calendar className="size-3.5 text-slate-400 shrink-0" />
                <input
                  type="month"
                  value={selectedMonthRange.start}
                  onChange={(e) => setSelectedMonthRange((prev) => ({ ...prev, start: e.target.value }))}
                  className="bg-transparent border-0 text-slate-700 text-xs focus:outline-none cursor-pointer"
                  title="起始月份"
                />
                <span className="text-slate-400 font-sans">至</span>
                <input
                  type="month"
                  value={selectedMonthRange.end}
                  onChange={(e) => setSelectedMonthRange((prev) => ({ ...prev, end: e.target.value }))}
                  className="bg-transparent border-0 text-slate-700 text-xs focus:outline-none cursor-pointer"
                  title="结束月份"
                />
              </div>
            )}

            {timeDim === 'quarter' && (
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs shadow-2xs">
                <Calendar className="size-3.5 text-slate-400 shrink-0" />
                <select
                  value={selectedQuarter}
                  onChange={(e) => setSelectedQuarter(e.target.value)}
                  className="bg-transparent border-0 text-slate-700 text-xs font-mono font-medium focus:outline-none cursor-pointer pr-1"
                >
                  <option value="2026-Q1">2026年 第1季度 (Q1)</option>
                  <option value="2026-Q2">2026年 第2季度 (Q2)</option>
                  <option value="2026-Q3">2026年 第3季度 (Q3)</option>
                  <option value="2026-Q4">2026年 第4季度 (Q4)</option>
                  <option value="2025-Q4">2025年 第4季度 (Q4)</option>
                </select>
              </div>
            )}

            {timeDim === 'year' && (
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs shadow-2xs">
                <Calendar className="size-3.5 text-slate-400 shrink-0" />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="bg-transparent border-0 text-slate-700 text-xs font-mono font-medium focus:outline-none cursor-pointer pr-1"
                >
                  <option value="2026">2026 年度</option>
                  <option value="2025">2025 年度</option>
                  <option value="2024">2024 年度</option>
                </select>
              </div>
            )}

            <button
              onClick={() => alert(`正在导出【${selectedNode.name}】产品单耗统计报表 (Excel/PDF)...`)}
              className="h-8 px-3 rounded-lg bg-[#1677ff] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-blue-600 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="size-3.5" />
              <span>导出</span>
            </button>
          </div>
        </div>

        {/* 主数据报表：变压器报表 vs 线缆报表 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          {/* Tab 切换栏与组织联动指示 */}
          <div className="p-2.5 border-b border-slate-200 bg-[#fafbfc] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Tab 切换 */}
              <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('transformer')}
                  className={cn(
                    'px-3.5 py-1.5 rounded-md font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer',
                    activeTab === 'transformer'
                      ? 'bg-white text-[#1677ff]'
                      : 'text-slate-600 hover:text-slate-900 font-medium',
                  )}
                >
                  <Zap className="size-3.5" />
                  <span>变压器报表 ({filteredTransOrders.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('cable')}
                  className={cn(
                    'px-3.5 py-1.5 rounded-md font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer',
                    activeTab === 'cable'
                      ? 'bg-amber-500 text-white'
                      : 'text-slate-600 hover:text-slate-900 font-medium',
                  )}
                >
                  <Cable className="size-3.5" />
                  <span>线缆报表 ({filteredCableOrders.length})</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchKw}
                  onChange={(e) => setSearchKw(e.target.value)}
                  placeholder="搜索产品型号 / 车间单位..."
                  className="h-8 pl-8 pr-2.5 text-xs bg-white border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:border-blue-500 w-60"
                />
              </div>
            </div>
          </div>

          {/* 1. 变压器单耗明细表格 */}
          {activeTab === 'transformer' && (
            <div className="overflow-x-auto custom-scrollbar">
              {filteredTransOrders.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                  <Zap className="size-8 text-slate-300" />
                  <div>所选单位【{selectedNode.name}】暂无变压器产品单耗数据</div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('cable')}
                    className="text-[#1677ff] underline cursor-pointer font-semibold"
                  >
                    前往查看线缆报表 →
                  </button>
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-bold select-none">
                      <th className="py-2.5 px-3 sticky left-0 bg-slate-50 z-10 min-w-[220px]">产品规格型号</th>
                      <th className="py-2.5 px-3 text-right">额定容量 (MVA)</th>
                      <th className="py-2.5 px-3 text-right">剪切叠装 (kWh)</th>
                      <th className="py-2.5 px-3 text-right">线圈绕制 (kWh)</th>
                      <th className="py-2.5 px-3 text-right text-rose-600 font-bold">🔥 真空干燥 (kWh)</th>
                      <th className="py-2.5 px-3 text-right">总装及试验 (kWh)</th>
                      <th className="py-2.5 px-3 text-right font-bold text-slate-900 bg-blue-50/40">
                        综合单耗 (kWh/kVA)
                      </th>
                      <th className="py-2.5 px-3 text-right font-bold text-slate-700">折标煤 (tce/台)</th>
                      <th className="py-2.5 px-3 text-center">同比变动</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11.5px]">
                    {filteredTransOrders.map((r) => (
                      <tr key={r.id} className="hover:bg-blue-50/40 transition-colors">
                        <td className="py-2.5 px-3 sticky left-0 bg-white font-sans font-semibold text-slate-900">
                          {r.model}
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums font-bold">
                          {r.capacityMva.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums">
                          {r.cutStack.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums">
                          {r.winding.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right text-rose-600 font-bold tabular-nums bg-rose-50/30">
                          {r.vacuumDry.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums">
                          {r.assemblyTest.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-blue-700 bg-blue-50/40 tabular-nums">
                          {r.unitKwhPerKva.toFixed(3)}
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums font-bold">
                          {r.tcePerUnit.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">
                          {r.yoy}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* 2. 线缆单耗明细表格 */}
          {activeTab === 'cable' && (
            <div className="overflow-x-auto custom-scrollbar">
              {filteredCableOrders.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                  <Cable className="size-8 text-slate-300" />
                  <div>所选单位【{selectedNode.name}】暂无线缆产品单耗数据</div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('transformer')}
                    className="text-[#1677ff] underline cursor-pointer font-semibold"
                  >
                    前往查看变压器报表 →
                  </button>
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-amber-50/80 text-slate-600 border-b border-amber-200 font-bold select-none">
                      <th className="py-2.5 px-3 sticky left-0 bg-amber-50 z-10 min-w-[220px]">线缆规格型号</th>
                      <th className="py-2.5 px-3 text-right">生产长度 (km)</th>
                      <th className="py-2.5 px-3 text-right">铜/铝拉丝 (kWh)</th>
                      <th className="py-2.5 px-3 text-right">导体绞合 (kWh)</th>
                      <th className="py-2.5 px-3 text-right text-amber-700 font-bold">⚡ 三层共挤交联 (kWh)</th>
                      <th className="py-2.5 px-3 text-right">护套及成缆 (kWh)</th>
                      <th className="py-2.5 px-3 text-right font-bold text-slate-900 bg-amber-100/40">
                        综合单耗 (kWh/km)
                      </th>
                      <th className="py-2.5 px-3 text-right font-bold text-slate-700">折标煤 (tce/km)</th>
                      <th className="py-2.5 px-3 text-center">同比变动</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11.5px]">
                    {filteredCableOrders.map((r) => (
                      <tr key={r.id} className="hover:bg-amber-50/40 transition-colors">
                        <td className="py-2.5 px-3 sticky left-0 bg-white font-sans font-semibold text-slate-900">
                          {r.model}
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums font-bold">
                          {r.lengthKm.toFixed(1)}
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums">
                          {r.drawing.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums">
                          {r.stranding.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right text-amber-700 font-bold tabular-nums bg-amber-50/30">
                          {r.crosslinking.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums">
                          {r.sheathing.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-amber-800 bg-amber-100/40 tabular-nums">
                          {r.unitKwhPerKm.toFixed(3)}
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums font-bold">
                          {r.tcePerKm.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">
                          {r.yoy}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
