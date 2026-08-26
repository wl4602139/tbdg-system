'use client'

import { useEffect, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Search,
  Building2,
  Factory,
  Cog,
  SlidersHorizontal,
  Zap,
  Flame,
  Droplets,
  Package,
  Tags,
  Award,
  Swords,
  Gauge,
  Sparkles,
  ShieldAlert,
  Calendar,
  Download,
  BarChart3,
  List,
  FileCheck,
  X,
  Send,
  CheckCircle2,
  ExternalLink,
  Layers,
  Filter,
  FolderTree,
  FileText,
  Clock,
  Coins,
  Cpu,
} from 'lucide-react'
import { TreeView, type TreeViewNode } from '@/components/shared/tree-view'
import { LineTrend, Donut, BarGroup } from '@/components/shared/charts'
import { cn } from '@/lib/utils'


// —— 抽屉图表 mock 数据（基于工厂当期数值平滑外推，仅供演示）——
const TREND_MONTHS = ['9月', '10月', '11月', '12月', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月']
const TREND_WAVE = [0.88, 0.86, 0.92, 0.98, 0.84, 0.8, 0.86, 0.9, 0.95, 1.0, 1.05, 1.12]

function genEnergyTrend(energy: number, carbon: number) {
  const eb = energy / 12
  const cb = carbon / 12
  return TREND_MONTHS.map((month, i) => ({
    month,
    综合能耗: Math.max(0, Math.round(eb * TREND_WAVE[i])),
    碳排放: Math.max(0, Math.round(cb * (TREND_WAVE[i] + 0.12))),
  }))
}

function genWeekTou() {
  return [
    { day: '周一', 高峰: 86, 平段: 52, 低谷: 31 },
    { day: '周二', 高峰: 91, 平段: 49, 低谷: 33 },
    { day: '周三', 高峰: 95, 平段: 54, 低谷: 30 },
    { day: '周四', 高峰: 88, 平段: 50, 低谷: 32 },
    { day: '周五', 高峰: 78, 平段: 46, 低谷: 29 },
    { day: '周六', 高峰: 42, 平段: 38, 低谷: 26 },
    { day: '周日', 高峰: 38, 平段: 40, 低谷: 27 },
  ]
}

function genPowerCurve() {
  const curve = [62, 58, 54, 68, 118, 152, 146, 172, 198, 214, 168, 96]
  return curve.map((v, i) => ({ hour: i * 2 + '时', 用电负荷: v }))
}


function genPointCurve(pt: any) {
  const hours = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]
  const name = pt?.name || ''
  const group = pt?.group || ''
  const sameDay = [0.62, 0.58, 0.54, 0.68, 1.18, 1.52, 1.46, 1.72, 1.98, 2.14, 1.68, 0.96]
  let base: number[]
  if (name === '电压') base = [10.15, 10.12, 10.1, 10.18, 10.22, 10.2, 10.18, 10.22, 10.25, 10.2, 10.16, 10.12]
  else if (name === '电流') base = sameDay.map((v) => Math.round(v * 320))
  else if (name === '总有功功率') base = sameDay.map((v) => Math.round(v * 4000))
  else if (name === '功率因数') base = [0.95, 0.95, 0.96, 0.94, 0.95, 0.94, 0.96, 0.95, 0.94, 0.96, 0.95, 0.95]
  else if (name === '正向有功电能') base = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => Math.round(8450 * (0.52 + i * 0.082)))
  else if (name === '反向有功电能') base = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => Math.round(12.5 * (0.6 + i * 0.075)))
  else if (name === '正向无功电能') base = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => Math.round(1280 * (0.55 + i * 0.075)))
  else if (name === '反向无功电能') base = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => Math.round(25.6 * (0.55 + i * 0.07)))
  else if (name === '水压') base = [0.4, 0.39, 0.38, 0.41, 0.43, 0.44, 0.43, 0.42, 0.41, 0.4, 0.39, 0.38]
  else if (name === '累计流量') base = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => Math.round((group === '气' ? 124 : 42) * (0.5 + i * 0.0833)))
  else if (name === '瞬时流量') base = [14, 12, 11, 15, 18, 21, 19, 20, 18, 16, 14, 12]
  else base = sameDay.map((v) => Math.round(v * 1000))
  return hours.map((h, i) => ({ hour: h + '时', 监测值: base[i] }))
}

export default function IndicatorControlPage() {
  // 4 大硬刚 PK 维度
  const [pkTab, setPkTab] = useState<'factory' | 'product' | 'line' | 'batch'>('factory')

  // 1. 维度一：选中的产业群或基地
  const [selectedFactoryGroup, setSelectedFactoryGroup] = useState<string>('all')

  // 2. 维度二：选中的产品型号
  const [selectedProductModel, setSelectedProductModel] = useState<string>('ODFS-334MVA/500kV')

  // 3. 维度三：选中的工厂
  const [selectedLineFactory, setSelectedLineFactory] = useState<string>('沈变本部 (沈阳基地)')

  // 4. 维度四：选中的批次产品型号
  const [selectedBatchProduct, setSelectedBatchProduct] = useState<string>('ODFS-334MVA/500kV')

  // 二级工序穿透抽屉选中的实体
  const [selectedDrawerEntity, setSelectedDrawerEntity] = useState<any | null>(null)

  // 实时量测点位选中状态（联动下方 24h 监测曲线）
  const [activeRtPoint, setActiveRtPoint] = useState<any | null>(null)

  // 树内搜索关键字
  const [treeSearch, setTreeSearch] = useState('')

  // 折叠展开状态
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    group_all: true,
    group_transformer: true,
    group_cable: true,
    group_newenergy: true,
    prod_root: true,
    prod_trans: true,
    prod_cable: true,
    prod_energy: true,
    line_root: true,
    fac_sb: true,
    fac_hb: true,
    fac_xb: true,
    fac_ll: true,
    batch_root: true,
    batch_odfs: true,
    batch_sz: true,
  })

  const toggleNode = (nodeKey: string) => {
    setExpandedNodes((prev) => ({ ...prev, [nodeKey]: !prev[nodeKey] }))
  }

  // 切换 PK 维度标签时，自动展开该维度的树状图
  useEffect(() => {
    setExpandedNodes((prev) => {
      const next: Record<string, boolean> = { ...prev }
      for (const k of Object.keys(next)) next[k] = true
      return next
    })
  }, [pkTab])


  // —— 经典标准树数据（4 大 PK 维度）——
  // —— 依据《园区-工厂对应关系表.xlsx》完整组织拓扑树 ——
  // —— 依据《园区-工厂对应关系表.xlsx》仅展示 1、2 级组织架构树 ——
  const factoryTreeData: TreeViewNode[] = [
    {
      key: 'group_all',
      label: '特变电工集团 (全量经营单位)',
      icon: <Building2 className="size-3.5 shrink-0 text-[#1677ff]" />,
      selected: selectedFactoryGroup === 'all',
      badge: <span className="rounded bg-blue-50 px-1.5 py-px text-[10px] text-[#1677ff] font-bold">全量</span>,
      onSelect: () => setSelectedFactoryGroup('all'),
      children: [
        // 1. 沈变公司 (一级单位) -> 二级单位
        {
          key: 'comp_sb',
          label: '沈变公司 (一级单位)',
          selected: selectedFactoryGroup === 'sb_all',
          onSelect: () => setSelectedFactoryGroup('sb_all'),
          children: [
            { key: 'f_sb_main', label: '沈变本部', icon: <Factory className="size-3.5 shrink-0 text-slate-400" />, onSelect: () => setSelectedFactoryGroup('f_sb') },
            { key: 'f_sb_zh', label: '智慧能源', icon: <Factory className="size-3.5 shrink-0 text-slate-400" /> },
            { key: 'f_sb_hx', label: '和新套管公司', icon: <Factory className="size-3.5 shrink-0 text-slate-400" /> },
            { key: 'f_sb_kj', label: '康嘉互感器', icon: <Factory className="size-3.5 shrink-0 text-slate-400" /> },
            { key: 'f_sb_yn', label: '印能公司', icon: <Factory className="size-3.5 shrink-0 text-slate-400" /> },
          ],
        },

        // 2. 衡变公司 (一级单位) -> 二级单位
        {
          key: 'comp_hb',
          label: '衡变公司 (一级单位)',
          selected: selectedFactoryGroup === 'hb_all',
          onSelect: () => setSelectedFactoryGroup('hb_all'),
          children: [
            { key: 'f_hb_main', label: '衡变本部', icon: <Factory className="size-3.5 shrink-0 text-slate-400" />, onSelect: () => setSelectedFactoryGroup('f_hb') },
            { key: 'f_hb_nj', label: '南京电研', icon: <Factory className="size-3.5 shrink-0 text-slate-400" /> },
            { key: 'f_hb_yjdq', label: '云集电气', icon: <Factory className="size-3.5 shrink-0 text-slate-400" /> },
            { key: 'f_hb_hndq', label: '湖南电气', icon: <Factory className="size-3.5 shrink-0 text-slate-400" /> },
            { key: 'f_hb_yjgy', label: '云集高压开关', icon: <Factory className="size-3.5 shrink-0 text-slate-400" /> },
            { key: 'f_hb_xjzk', label: '新疆自控', icon: <Factory className="size-3.5 shrink-0 text-slate-400" /> },
            { key: 'f_hb_tnj', label: '特能建', icon: <Factory className="size-3.5 shrink-0 text-slate-400" /> },
            { key: 'f_hb_hr', label: '合容电气', icon: <Factory className="size-3.5 shrink-0 text-slate-400" /> },
            { key: 'f_hb_gil', label: '赛杰爱迪', icon: <Factory className="size-3.5 shrink-0 text-slate-400" /> },
          ],
        },

        // 3. 新变厂 (一级单位) -> 二级单位
        {
          key: 'comp_xb',
          label: '新变厂 (一级单位)',
          selected: selectedFactoryGroup === 'xb_all',
          onSelect: () => setSelectedFactoryGroup('xb_all'),
          children: [
            { key: 'f_xb_uhv', label: '超高压公司', icon: <Factory className="size-3.5 shrink-0 text-slate-400" />, onSelect: () => setSelectedFactoryGroup('f_xb') },
            { key: 'f_tb_main', label: '天变公司', icon: <Factory className="size-3.5 shrink-0 text-slate-400" />, onSelect: () => setSelectedFactoryGroup('f_tj') },
            { key: 'f_xb_zndq', label: '智能电气公司', icon: <Factory className="size-3.5 shrink-0 text-slate-400" /> },
            { key: 'f_xb_jjj', label: '京津冀公司', icon: <Factory className="size-3.5 shrink-0 text-slate-400" /> },
            { key: 'f_xb_zf', label: '珠峰硅钢', icon: <Factory className="size-3.5 shrink-0 text-slate-400" /> },
          ],
        },

        // 4. 鲁缆公司 (一级单位) -> 二级单位
        {
          key: 'comp_ll',
          label: '鲁缆公司 (一级单位)',
          selected: selectedFactoryGroup === 'll_all',
          onSelect: () => setSelectedFactoryGroup('ll_all'),
          children: [
            { key: 'f_ll_main', label: '鲁缆本部', icon: <Factory className="size-3.5 shrink-0 text-slate-400" />, onSelect: () => setSelectedFactoryGroup('f_ll') },
            { key: 'f_ll_zl', label: '智缆公司', icon: <Factory className="size-3.5 shrink-0 text-slate-400" /> },
            { key: 'f_ll_sh', label: '昭和公司', icon: <Factory className="size-3.5 shrink-0 text-slate-400" /> },
            { key: 'f_ll_sg', label: '曙光公司', icon: <Factory className="size-3.5 shrink-0 text-slate-400" /> },
          ],
        },

        // 5. 新缆厂 (一级单位) -> 二级单位
        {
          key: 'comp_xlc',
          label: '新缆厂 (一级单位)',
          selected: selectedFactoryGroup === 'xlc_all',
          onSelect: () => setSelectedFactoryGroup('xlc_all'),
          children: [
            { key: 'f_xlc_main', label: '新疆电缆公司', icon: <Factory className="size-3.5 shrink-0 text-slate-400" />, onSelect: () => setSelectedFactoryGroup('f_xlc') },
            { key: 'f_xlc_sbd', label: '新疆线缆厂', icon: <Factory className="size-3.5 shrink-0 text-slate-400" /> },
          ],
        },

        // 6. 德缆公司 (一级单位) -> 二级单位
        {
          key: 'comp_dl',
          label: '德缆公司 (一级单位)',
          selected: selectedFactoryGroup === 'dl_all',
          onSelect: () => setSelectedFactoryGroup('dl_all'),
          children: [
            { key: 'f_dl_main', label: '德缆股份公司', icon: <Factory className="size-3.5 shrink-0 text-slate-400" />, onSelect: () => setSelectedFactoryGroup('f_dl') },
          ],
        },
      ],
    },
  ]

  const productTreeData: TreeViewNode[] = [
    {
      key: 'prod_root',
      label: '特变电工重点产品目录',
      icon: <Package className="size-3.5 shrink-0 text-[#1677ff]" />,
      children: [
        {
          key: 'prod_trans',
          label: '输变电与特高压变压器',
          selected: false,
          children: [
            {
              key: 'm_odfs',
              label: (
                <span className="flex items-baseline gap-1.5">
                  <span className="font-mono">ODFS-334MVA/500kV</span>
                  <span className="text-[10px] text-slate-400">单相自耦变 (3 厂共造)</span>
                </span>
              ),
              selected: selectedProductModel === 'ODFS-334MVA/500kV',
              onSelect: () => setSelectedProductModel('ODFS-334MVA/500kV'),
            },
            {
              key: 'm_sz',
              label: (
                <span className="flex items-baseline gap-1.5">
                  <span className="font-mono">SZ-110kV/63000kVA</span>
                  <span className="text-[10px] text-slate-400">三相油浸电力变 (4 厂共造)</span>
                </span>
              ),
              selected: selectedProductModel === 'SZ-110kV/63000kVA',
              onSelect: () => setSelectedProductModel('SZ-110kV/63000kVA'),
            },
            {
              key: 'm_s13',
              label: (
                <span className="flex items-baseline gap-1.5">
                  <span className="font-mono">S13-M-800kVA</span>
                  <span className="text-[10px] text-slate-400">节能配电变 (5 厂共造)</span>
                </span>
              ),
              selected: selectedProductModel === 'S13-M-800kVA',
              onSelect: () => setSelectedProductModel('S13-M-800kVA'),
            },
          ],
        },
        {
          key: 'prod_cable',
          label: '高压与特种线缆',
          children: [
            {
              key: 'm_yj',
              label: (
                <span className="flex items-baseline gap-1.5">
                  <span className="font-mono">YJLW03-64/110kV</span>
                  <span className="text-[10px] text-slate-400">高压交联电缆 (3 厂共造)</span>
                </span>
              ),
              selected: selectedProductModel === 'YJLW03-64/110kV',
              onSelect: () => setSelectedProductModel('YJLW03-64/110kV'),
            },
          ],
        },
      ],
    },
  ]

  const lineTreeData: TreeViewNode[] = [
    {
      key: 'line_root',
      label: '特变电工制造基地与车间',
      icon: <Building2 className="size-3.5 shrink-0 text-[#1677ff]" />,
      children: [
        {
          key: 'fac_sb',
          label: '沈变本部 (沈阳基地)',
          icon: <Factory className="size-3.5 shrink-0 text-slate-400" />,
          selected: selectedLineFactory === '沈变本部 (沈阳基地)',
          onSelect: () => setSelectedLineFactory('沈变本部 (沈阳基地)'),
          children: [
            {
              key: 'ws_dry',
              label: '超高压真空干燥车间',
              icon: <Cog className="size-3.5 shrink-0 text-slate-400" />,
              className: 'font-semibold text-red-600',
              badge: <span className="size-1.5 rounded-full bg-red-500" />,
            },
            { key: 'ws_test', label: '无局放超高压试验大厅', icon: <Cog className="size-3.5 shrink-0 text-slate-400" /> },
            {
              key: 'ws_shear',
              label: '铁芯剪切自动叠装线',
              icon: <Cog className="size-3.5 shrink-0 text-slate-400" />,
              className: 'font-semibold text-emerald-700',
              badge: <span className="size-1.5 rounded-full bg-emerald-500" />,
            },
            { key: 'ws_wind', label: '自动化绝缘绕线车间', icon: <Cog className="size-3.5 shrink-0 text-slate-400" /> },
          ],
        },
        {
          key: 'fac_hb',
          label: '衡变本部 (衡阳基地)',
          icon: <Factory className="size-3.5 shrink-0 text-slate-400" />,
          selected: selectedLineFactory === '衡变本部 (衡阳基地)',
          onSelect: () => setSelectedLineFactory('衡变本部 (衡阳基地)'),
        },
        {
          key: 'fac_xb',
          label: '新变超高压 (昌吉基地)',
          icon: <Factory className="size-3.5 shrink-0 text-slate-400" />,
          selected: selectedLineFactory === '新变超高压 (昌吉基地)',
          onSelect: () => setSelectedLineFactory('新变超高压 (昌吉基地)'),
        },
      ],
    },
  ]

  const batchTreeData: TreeViewNode[] = [
    {
      key: 'batch_root',
      label: '产品批次追溯目录',
      icon: <Tags className="size-3.5 shrink-0 text-[#1677ff]" />,
      children: [
        {
          key: 'batch_odfs',
          label: (
            <span className="flex items-baseline gap-1.5">
              <span className="font-mono">ODFS-334MVA/500kV</span>
              <span className="rounded bg-red-50 px-1 py-px text-[10px] font-semibold text-red-600">当期异常</span>
            </span>
          ),
          selected: selectedBatchProduct === 'ODFS-334MVA/500kV',
          onSelect: () => setSelectedBatchProduct('ODFS-334MVA/500kV'),
          children: [
            {
              key: 'bat_202608',
              label: '#202608 批次 (突增 +24.5%)',
              icon: <FileText className="size-3.5 shrink-0 text-slate-400" />,
              className: 'font-semibold text-red-600',
              badge: <span className="size-1.5 rounded-full bg-red-500" />,
            },
            { key: 'bat_202607', label: '#202607 批次 (正常)', icon: <FileText className="size-3.5 shrink-0 text-slate-400" /> },
            { key: 'bat_202606', label: '#202606 批次 (正常)', icon: <FileText className="size-3.5 shrink-0 text-slate-400" /> },
          ],
        },
        {
          key: 'batch_sz',
          label: <span className="font-mono">SZ-110kV/63000kVA</span>,
          selected: selectedBatchProduct === 'SZ-110kV/63000kVA',
          onSelect: () => setSelectedBatchProduct('SZ-110kV/63000kVA'),
        },
      ],
    },
  ]

  // 1. 维度一数据：全集团工厂 PK
  const factoryPkList = [
    {
      rank: 1,
      name: '新变超高压公司',
      group: 'transformer',
      energy: 1520.0,
      carbon: 4150.2,
      green: '31.2%',
      status: 'worst',
      delta: '+18.4% ▲',
      barWidth: 100,
      reason: '【重点监管】真空干燥蒸汽泄漏，能耗严重超标',
      lossCost: '180 吨蒸汽 (12.8万元)',
      pic: '新变超高压基地 (昌吉)',
      yoy: '+18.4%',
      mom: '+9.2%',
      avoidedCarbon: '1,240.5',
      avgCost: '0.685',
      media: {
        elec: { val: '8,450 MWh', tce: '1,038.5 tce', pct: '68.3%', status: '受控' },
        steam: { val: '3,820 GJ', tce: '326.2 tce', pct: '21.5%', status: '🔴 严重超标 (+34.2%)' },
        gas: { val: '12.4 万 Nm³', tce: '121.6 tce', pct: '8.0%', status: '正常' },
        other: { val: '4.2 万吨水', tce: '33.7 tce', pct: '2.2%', status: '正常' },
      },
      tou: {
        tip: '28.4%',
        peak: '36.2%',
        flat: '22.1%',
        valley: '13.3%',
      },
      sensors: [
        { tag: 'TT-204', desc: '2号真空干燥罐壁温', val: '142 ℃', limit: '128 ℃', status: '🔴 异常偏高 (漏热)' },
        { tag: 'ST-02', desc: '干燥罐温控蒸汽疏水阀', val: '开度 85% 持续常开', limit: '脉动排汽', status: '🔴 阀芯卡死微漏' },
        { tag: 'VF-01', desc: '试验大厅变频机组待机功率', val: '42 kW', limit: '0 kW', status: '🟡 空载未停机' },
        { tag: 'FLOW-03', desc: '车间蒸汽总管实时流量', val: '5.8 t/h', limit: '4.2 t/h', status: '🔴 超标 38%' },
      ],
      actions: [
        {
          title: '更换 2号干燥罐温控疏水阀并加装气凝胶隔热套',
          roi: '预估月节蒸汽 180 吨 · 月省 12.8 万元 · 年减碳 112.5 tCO2 · 静态回收期 0.8 个月',
          priority: '🔴 极高 (本周内闭环)',
        },
        {
          title: '试验大厅加装变频器自动休眠逻辑与避峰试验排产',
          roi: '预估年节约电费 8.4 万元 · 尖峰用电占比降低 4.2%',
          priority: '🟡 中 (下月纳入排产)',
        },
      ],
      meta: {
        indicatorName: '综合能源消费量',
        period: '2026-08 (月)',
        current: '1,520.0 tce',
        benchmark: '1,280.0 tce',
        benchmarkSource: '国家《零碳工厂评价规范》GB/T 36132-2018',
        result: '🔴 异常（高于基准 18.8%）',
        dataSource: '电装能源管理平台自动采集（电/蒸汽/热力）+ 人工录入（天然气/柴油）',
        formula: 'E = Σ(Ei × ki)：各能源介质实物量 × 折标准煤系数（电力取当量值）',
      },
      products: [
        { model: 'ODFS-334MVA/500kV', energy: '1.58 tce/台', elec: '10,800 kWh/台', steam: '5.10 GJ/台', gas: '132 m³/台', water: '42 t/台', mom: '+31.6%' },
        { model: 'SZ-110kV/63000kVA', energy: '1.45 tce/台', elec: '9,650 kWh/台', steam: '4.86 GJ/台', gas: '118 m³/台', water: '36 t/台', mom: '+21.0%' },
        { model: 'GIS-252kV/63kA', energy: '0.98 tce/台', elec: '6,850 kWh/台', steam: '2.42 GJ/台', gas: '72 m³/台', water: '26 t/台', mom: '+9.6%' },
      ],
      realtime: [
        { group: '电', name: '电压', val: '10.2 kV', status: '正常' },
        { group: '电', name: '电流', val: '486.3 A', status: '正常' },
        { group: '电', name: '总有功功率', val: '7,820 kW', status: '🔴 超限' },
        { group: '电', name: '功率因数', val: '0.94', status: '🟡 偏低' },
        { group: '电', name: '正向有功电能', val: '8,450,320 kWh', status: '正常' },
        { group: '电', name: '反向有功电能', val: '12,480 kWh', status: '正常' },
        { group: '电', name: '正向无功电能', val: '1,280,450 kvarh', status: '正常' },
        { group: '电', name: '反向无功电能', val: '25,600 kvarh', status: '正常' },
        { group: '水', name: '水压', val: '0.42 MPa', status: '正常' },
        { group: '水', name: '累计流量', val: '42,000 t', status: '正常' },
        { group: '水', name: '瞬时流量', val: '18.6 t/h', status: '正常' },
        { group: '气', name: '累计流量', val: '124,000 Nm³', status: '正常' },
      ],
      newEnergy: [
        { name: '光伏发电功率', val: '2,860 kW' },
        { name: '逆变器效率', val: '98.2%' },
        { name: '光伏消纳率', val: '91.5%' },
        { name: '储能充放电功率', val: '±1,200 kW' },
        { name: '储能 SOC', val: '62.4%' },
        { name: '储能 SOH', val: '94.8%' },
        { name: '储能直流电压', val: '735.6 V' },
        { name: '储能直流电流', val: '128.4 A' },
        { name: '市电负荷', val: '6,280 kW' },
      ],
    },
    {
      rank: 2,
      name: '沈变本部 (沈阳基地)',
      group: 'transformer',
      energy: 1284.5,
      carbon: 3420.8,
      green: '38.6%',
      status: 'normal',
      delta: '+2.1% ▲',
      barWidth: 84.5,
      reason: '能耗平稳受控，超高压试验负荷略高',
      lossCost: '受控范围内',
      pic: '沈变铁西园区 (沈阳)',
      yoy: '+2.1%',
      mom: '-1.0%',
      avoidedCarbon: '1,580.0',
      avgCost: '0.620',
      media: {
        elec: { val: '7,800 MWh', tce: '958.6 tce', pct: '74.6%', status: '正常' },
        steam: { val: '2,200 GJ', tce: '187.9 tce', pct: '14.6%', status: '正常' },
        gas: { val: '11.0 万 Nm³', tce: '107.9 tce', pct: '8.4%', status: '正常' },
        other: { val: '3.8 万吨水', tce: '30.1 tce', pct: '2.4%', status: '正常' },
      },
      tou: {
        tip: '22.0%',
        peak: '38.0%',
        flat: '25.0%',
        valley: '15.0%',
      },
      sensors: [
        { tag: 'TT-101', desc: '1号退火炉均温区温度', val: '650 ℃', limit: '650±10 ℃', status: '🟢 正常' },
        { tag: 'VF-03', desc: '变频升压补偿电容器组', val: '功率因数 0.96', limit: '≥0.95', status: '🟢 优良' },
      ],
      actions: [
        {
          title: '优化试验大厅夜间无功补偿投入策略',
          roi: '预估年节约力调电费 3.2 万元',
          priority: '🟢 正常维护',
        },
      ],
      meta: {
        indicatorName: '综合能源消费量',
        period: '2026-08 (月)',
        current: '1,284.5 tce',
        benchmark: '1,280.0 tce',
        benchmarkSource: '国家《零碳工厂评价规范》GB/T 36132-2018',
        result: '🟡 正常（高于基准 0.4%）',
        dataSource: '电装能源管理平台自动采集（电/蒸汽/热力）+ 人工录入（天然气）',
        formula: 'E = Σ(Ei × ki)：各能源介质实物量 × 折标准煤系数（电力取当量值）',
      },
      products: [
        { model: 'ODFS-334MVA/500kV', energy: '1.45 tce/台', elec: '10,420 kWh/台', steam: '4.82 GJ/台', gas: '126 m³/台', water: '38 t/台', mom: '+20.8%' },
        { model: 'SZ-110kV/63000kVA', energy: '0.92 tce/台', elec: '6,100 kWh/台', steam: '2.10 GJ/台', gas: '88 m³/台', water: '25 t/台', mom: '-3.2%' },
        { model: 'S13-M-800kVA', energy: '0.65 tce/台', elec: '3,550 kWh/台', steam: '0.92 GJ/台', gas: '45 m³/台', water: '18 t/台', mom: '+4.8%' },
      ],
      realtime: [
        { group: '电', name: '电压', val: '10.5 kV', status: '正常' },
        { group: '电', name: '电流', val: '412.8 A', status: '正常' },
        { group: '电', name: '总有功功率', val: '6,840 kW', status: '正常' },
        { group: '电', name: '功率因数', val: '0.97', status: '正常' },
        { group: '电', name: '正向有功电能', val: '7,800,320 kWh', status: '正常' },
        { group: '电', name: '反向有功电能', val: '9,860 kWh', status: '正常' },
        { group: '电', name: '正向无功电能', val: '1,020,400 kvarh', status: '正常' },
        { group: '电', name: '反向无功电能', val: '18,900 kvarh', status: '正常' },
        { group: '水', name: '水压', val: '0.40 MPa', status: '正常' },
        { group: '水', name: '累计流量', val: '38,000 t', status: '正常' },
        { group: '水', name: '瞬时流量', val: '16.2 t/h', status: '正常' },
        { group: '气', name: '累计流量', val: '110,000 Nm³', status: '正常' },
      ],
      newEnergy: [
        { name: '光伏发电功率', val: '2,150 kW' },
        { name: '逆变器效率', val: '98.0%' },
        { name: '光伏消纳率', val: '88.6%' },
        { name: '储能充放电功率', val: '±900 kW' },
        { name: '储能 SOC', val: '55.8%' },
        { name: '储能 SOH', val: '96.2%' },
        { name: '储能直流电压', val: '748.2 V' },
        { name: '储能直流电流', val: '96.5 A' },
        { name: '市电负荷', val: '5,860 kW' },
      ],
    },
    {
      rank: 3,
      name: '衡变本部 (衡阳基地)',
      group: 'transformer',
      energy: 1190.0,
      carbon: 3180.5,
      green: '41.2%',
      status: 'good',
      delta: '-3.5% ▼',
      barWidth: 78.3,
      reason: '绿电消纳优秀，工艺能耗控制良好，集团标杆工厂',
      lossCost: '节约 8.5 万元',
      pic: '衡变雁峰园区 (衡阳)',
      yoy: '-3.5%',
      mom: '-2.4%',
      avoidedCarbon: '1,890.2',
      avgCost: '0.582',
      media: {
        elec: { val: '7,100 MWh', tce: '872.6 tce', pct: '73.3%', status: '低碳优胜' },
        steam: { val: '1,950 GJ', tce: '166.5 tce', pct: '14.0%', status: '优胜' },
        gas: { val: '12.8 万 Nm³', tce: '125.6 tce', pct: '10.6%', status: '正常' },
        other: { val: '3.1 万吨水', tce: '25.3 tce', pct: '2.1%', status: '优胜' },
      },
      tou: {
        tip: '16.5%',
        peak: '33.5%',
        flat: '28.0%',
        valley: '22.0%',
      },
      sensors: [
        { tag: 'TT-302', desc: '洁净装配间恒温恒湿空调', val: '22.5 ℃ / 48%', limit: '23±2 ℃', status: '🟢 优胜' },
        { tag: 'HEAT-01', desc: '余热回收换热器出口水温', val: '68 ℃', limit: '≥60 ℃', status: '🟢 高效回收' },
      ],
      actions: [
        {
          title: '推广真空干燥冷凝水 100% 回收经验至新变与沈变',
          roi: '集团协同预计可复制降碳效益 180 万元/年',
          priority: '🟢 标杆经验输出',
        },
      ],
      meta: {
        indicatorName: '综合能源消费量',
        period: '2026-08 (月)',
        current: '1,190.0 tce',
        benchmark: '1,280.0 tce',
        benchmarkSource: '国家《零碳工厂评价规范》GB/T 36132-2018',
        result: '🟢 优秀（低于基准 7.0%）',
        dataSource: '电装能源管理平台自动采集 + 衡变 MES 产量数据',
        formula: 'E = Σ(Ei × ki)：各能源介质实物量 × 折标准煤系数（电力取当量值）',
      },
      products: [
        { model: 'ODFS-334MVA/500kV', energy: '1.18 tce/台', elec: '8,250 kWh/台', steam: '3.40 GJ/台', gas: '98 m³/台', water: '30 t/台', mom: '-1.6%' },
        { model: 'SZ-110kV/63000kVA', energy: '0.98 tce/台', elec: '6,450 kWh/台', steam: '2.25 GJ/台', gas: '82 m³/台', water: '24 t/台', mom: '+3.1%' },
        { model: 'GIS-252kV/63kA', energy: '0.88 tce/台', elec: '5,900 kWh/台', steam: '2.30 GJ/台', gas: '76 m³/台', water: '22 t/台', mom: '-2.8%' },
      ],
      realtime: [
        { group: '电', name: '电压', val: '10.8 kV', status: '正常' },
        { group: '电', name: '电流', val: '398.5 A', status: '正常' },
        { group: '电', name: '总有功功率', val: '6,320 kW', status: '正常' },
        { group: '电', name: '功率因数', val: '0.98', status: '正常' },
        { group: '电', name: '正向有功电能', val: '7,100,260 kWh', status: '正常' },
        { group: '电', name: '反向有功电能', val: '6,540 kWh', status: '正常' },
        { group: '电', name: '正向无功电能', val: '980,200 kvarh', status: '正常' },
        { group: '电', name: '反向无功电能', val: '12,300 kvarh', status: '正常' },
        { group: '水', name: '水压', val: '0.45 MPa', status: '正常' },
        { group: '水', name: '累计流量', val: '31,000 t', status: '正常' },
        { group: '水', name: '瞬时流量', val: '14.8 t/h', status: '正常' },
        { group: '气', name: '累计流量', val: '128,000 Nm³', status: '正常' },
      ],
      newEnergy: [
        { name: '光伏发电功率', val: '3,460 kW' },
        { name: '逆变器效率', val: '98.6%' },
        { name: '光伏消纳率', val: '96.8%' },
        { name: '储能充放电功率', val: '±1,500 kW' },
        { name: '储能 SOC', val: '68.2%' },
        { name: '储能 SOH', val: '97.1%' },
        { name: '储能直流电压', val: '742.4 V' },
        { name: '储能直流电流', val: '152.8 A' },
        { name: '市电负荷', val: '4,980 kW' },
      ],
    },
    {
      rank: 4,
      name: '鲁缆本部 (泰安基地)',
      group: 'cable',
      energy: 980.0,
      carbon: 2610.0,
      green: '37.5%',
      status: 'normal',
      delta: '-0.8% ▼',
      barWidth: 64.5,
      reason: '立塔交联挤出产线能耗正常受控',
      lossCost: '正常运行',
      pic: '鲁缆高新园区 (泰安)',
      yoy: '-0.8%',
      mom: '+0.5%',
      avoidedCarbon: '1,120.0',
      avgCost: '0.615',
      media: {
        elec: { val: '6,400 MWh', tce: '786.6 tce', pct: '80.3%', status: '正常' },
        steam: { val: '1,100 GJ', tce: '93.9 tce', pct: '9.6%', status: '正常' },
        gas: { val: '7.8 万 Nm³', tce: '76.5 tce', pct: '7.8%', status: '正常' },
        other: { val: '2.8 万吨水', tce: '23.0 tce', pct: '2.3%', status: '正常' },
      },
      tou: { tip: '20.0%', peak: '36.0%', flat: '26.0%', valley: '18.0%' },
      sensors: [{ tag: 'VCV-01', desc: '立塔交联管道氮气循环温度', val: '210 ℃', limit: '210±5 ℃', status: '🟢 受控' }],
      actions: [{ title: '挤出机变频螺杆润滑保养', roi: '维持稳定运行', priority: '🟢 常规' }],
      meta: {
        indicatorName: '综合能源消费量',
        period: '2026-08 (月)',
        current: '980.0 tce',
        benchmark: '1,080.0 tce',
        benchmarkSource: '国家《零碳工厂评价规范》GB/T 36132-2018',
        result: '🟢 优秀（低于基准 9.3%）',
        dataSource: '电装能源管理平台自动采集（电/蒸汽/热力）+ 人工录入（天然气）',
        formula: 'E = Σ(Ei × ki)：各能源介质实物量 × 折标准煤系数（电力取当量值）',
      },
      products: [
        { model: 'YJLW03-64/110kV', energy: '0.42 tce/km', elec: '2,800 kWh/km', steam: '1.10 GJ/km', gas: '35 m³/km', water: '12 t/km', mom: '-6.7%' },
        { model: 'YJV22-8.7/15kV', energy: '0.31 tce/km', elec: '2,050 kWh/km', steam: '0.85 GJ/km', gas: '28 m³/km', water: '9 t/km', mom: '-3.4%' },
        { model: 'OPJY-500kV', energy: '0.55 tce/km', elec: '3,600 kWh/km', steam: '1.42 GJ/km', gas: '48 m³/km', water: '15 t/km', mom: '+5.2%' },
      ],
      realtime: [
        { group: '电', name: '电压', val: '10.4 kV', status: '正常' },
        { group: '电', name: '电流', val: '356.2 A', status: '正常' },
        { group: '电', name: '总有功功率', val: '5,780 kW', status: '正常' },
        { group: '电', name: '功率因数', val: '0.96', status: '正常' },
        { group: '电', name: '正向有功电能', val: '6,400,180 kWh', status: '正常' },
        { group: '电', name: '反向有功电能', val: '8,240 kWh', status: '正常' },
        { group: '电', name: '正向无功电能', val: '860,500 kvarh', status: '正常' },
        { group: '电', name: '反向无功电能', val: '15,700 kvarh', status: '正常' },
        { group: '水', name: '水压', val: '0.38 MPa', status: '正常' },
        { group: '水', name: '累计流量', val: '28,000 t', status: '正常' },
        { group: '水', name: '瞬时流量', val: '12.6 t/h', status: '正常' },
        { group: '气', name: '累计流量', val: '78,000 Nm³', status: '正常' },
      ],
      newEnergy: [
        { name: '光伏发电功率', val: '1,680 kW' },
        { name: '逆变器效率', val: '97.6%' },
        { name: '光伏消纳率', val: '90.2%' },
        { name: '储能充放电功率', val: '±700 kW' },
        { name: '储能 SOC', val: '48.6%' },
        { name: '储能 SOH', val: '95.4%' },
        { name: '储能直流电压', val: '751.0 V' },
        { name: '储能直流电流', val: '68.2 A' },
        { name: '市电负荷', val: '5,120 kW' },
      ],
    },
    {
      rank: 5,
      name: '德缆股份 (德阳基地)',
      group: 'cable',
      energy: 840.0,
      carbon: 2250.0,
      green: '35.0%',
      status: 'normal',
      delta: '-1.2% ▼',
      barWidth: 55.2,
      reason: '铜拉丝与高速绞线工序节能稳定运行',
      lossCost: '节约 3.2 万元',
      pic: '德缆旌阳园区 (德阳)',
      yoy: '-1.2%',
      mom: '-1.5%',
      avoidedCarbon: '980.0',
      avgCost: '0.608',
      media: {
        elec: { val: '5,800 MWh', tce: '712.8 tce', pct: '84.9%', status: '正常' },
        steam: { val: '520 GJ', tce: '44.4 tce', pct: '5.3%', status: '正常' },
        gas: { val: '6.5 万 Nm³', tce: '63.8 tce', pct: '7.6%', status: '正常' },
        other: { val: '2.3 万吨水', tce: '19.0 tce', pct: '2.2%', status: '正常' },
      },
      tou: { tip: '18.0%', peak: '35.0%', flat: '27.0%', valley: '20.0%' },
      sensors: [{ tag: 'DRAW-02', desc: '大拉机乳化液恒温系统', val: '45 ℃', limit: '45±3 ℃', status: '🟢 受控' }],
      actions: [{ title: '非晶立体卷铁芯节能工艺迭代', roi: '提升能效 2.5%', priority: '🟢 工艺优化' }],
      meta: {
        indicatorName: '综合能源消费量',
        period: '2026-08 (月)',
        current: '840.0 tce',
        benchmark: '960.0 tce',
        benchmarkSource: '国家《零碳工厂评价规范》GB/T 36132-2018',
        result: '🟢 优秀（低于基准 12.5%）',
        dataSource: '电装能源管理平台自动采集（电/热力）+ 人工录入（天然气/柴油）',
        formula: 'E = Σ(Ei × ki)：各能源介质实物量 × 折标准煤系数（电力取当量值）',
      },
      products: [
        { model: 'S13-M-800kVA', energy: '0.58 tce/台', elec: '3,200 kWh/台', steam: '0.80 GJ/台', gas: '28 m³/台', water: '10 t/台', mom: '-6.4%' },
        { model: 'YJV22-8.7/15kV', energy: '0.35 tce/km', elec: '2,300 kWh/km', steam: '0.92 GJ/km', gas: '30 m³/km', water: '10 t/km', mom: '-2.1%' },
        { model: '轨道交通直流电缆', energy: '0.47 tce/km', elec: '3,120 kWh/km', steam: '1.18 GJ/km', gas: '38 m³/km', water: '13 t/km', mom: '+4.0%' },
      ],
      realtime: [
        { group: '电', name: '电压', val: '10.2 kV', status: '正常' },
        { group: '电', name: '电流', val: '332.5 A', status: '正常' },
        { group: '电', name: '总有功功率', val: '5,460 kW', status: '正常' },
        { group: '电', name: '功率因数', val: '0.97', status: '正常' },
        { group: '电', name: '正向有功电能', val: '5,800,420 kWh', status: '正常' },
        { group: '电', name: '反向有功电能', val: '7,120 kWh', status: '正常' },
        { group: '电', name: '正向无功电能', val: '780,300 kvarh', status: '正常' },
        { group: '电', name: '反向无功电能', val: '13,800 kvarh', status: '正常' },
        { group: '水', name: '水压', val: '0.36 MPa', status: '正常' },
        { group: '水', name: '累计流量', val: '23,000 t', status: '正常' },
        { group: '水', name: '瞬时流量', val: '11.4 t/h', status: '正常' },
        { group: '气', name: '累计流量', val: '65,000 Nm³', status: '正常' },
      ],
      newEnergy: [
        { name: '光伏发电功率', val: '1,240 kW' },
        { name: '逆变器效率', val: '97.2%' },
        { name: '光伏消纳率', val: '86.4%' },
        { name: '储能充放电功率', val: '±600 kW' },
        { name: '储能 SOC', val: '52.1%' },
        { name: '储能 SOH', val: '95.8%' },
        { name: '储能直流电压', val: '740.8 V' },
        { name: '储能直流电流', val: '58.4 A' },
        { name: '市电负荷', val: '4,860 kW' },
      ],
    },
    {
      rank: 6,
      name: '新缆厂 (昌吉总部)',
      group: 'cable',
      energy: 680.0,
      carbon: 1820.0,
      green: '44.0%',
      status: 'best',
      delta: '-8.6% ▼',
      barWidth: 44.7,
      reason: '【集团能效标杆】屋顶分布式光伏全额消纳，低碳运行典范',
      lossCost: '节约 14.6 万元',
      pic: '新缆昌吉园区 (昌吉)',
      yoy: '-8.6%',
      mom: '-4.2%',
      avoidedCarbon: '1,450.0',
      avgCost: '0.540',
      media: {
        elec: { val: '4,500 MWh', tce: '553.1 tce', pct: '81.3%', status: '低碳标杆' },
        steam: { val: '480 GJ', tce: '41.0 tce', pct: '6.0%', status: '优胜' },
        gas: { val: '6.8 万 Nm³', tce: '66.7 tce', pct: '9.8%', status: '正常' },
        other: { val: '2.3 万吨水', tce: '19.2 tce', pct: '2.9%', status: '优胜' },
      },
      tou: { tip: '12.0%', peak: '30.0%', flat: '30.0%', valley: '28.0%' },
      sensors: [{ tag: 'PV-ROOF', desc: '屋顶光伏实时出力', val: '3,200 kW', limit: '光照充足', status: '🟢 100% 就地消纳' }],
      actions: [{ title: '持续保持屋顶光伏组件清洗与逆变器巡检', roi: '年绿电发电量超 520 万 kWh', priority: '🟢 标杆维护' }],
      meta: {
        indicatorName: '综合能源消费量',
        period: '2026-08 (月)',
        current: '680.0 tce',
        benchmark: '960.0 tce',
        benchmarkSource: '国家《零碳工厂评价规范》GB/T 36132-2018',
        result: '🟢 优秀（低于基准 29.2%）',
        dataSource: '电装能源管理平台自动采集（电/热力）+ 人工录入（天然气）',
        formula: 'E = Σ(Ei × ki)：各能源介质实物量 × 折标准煤系数（电力取当量值）',
      },
      products: [
        { model: 'YJLW03-64/110kV', energy: '0.48 tce/km', elec: '3,150 kWh/km', steam: '1.28 GJ/km', gas: '40 m³/km', water: '14 t/km', mom: '+6.6%' },
        { model: '大截面铝导体电缆', energy: '0.44 tce/km', elec: '2,900 kWh/km', steam: '1.05 GJ/km', gas: '36 m³/km', water: '12 t/km', mom: '-5.0%' },
        { model: 'OPJY-330kV', energy: '0.52 tce/km', elec: '3,400 kWh/km', steam: '1.30 GJ/km', gas: '42 m³/km', water: '14 t/km', mom: '-6.8%' },
      ],
      realtime: [
        { group: '电', name: '电压', val: '10.6 kV', status: '正常' },
        { group: '电', name: '电流', val: '288.4 A', status: '正常' },
        { group: '电', name: '总有功功率', val: '4,220 kW', status: '正常' },
        { group: '电', name: '功率因数', val: '0.98', status: '正常' },
        { group: '电', name: '正向有功电能', val: '4,500,180 kWh', status: '正常' },
        { group: '电', name: '反向有功电能', val: '4,860 kWh', status: '正常' },
        { group: '电', name: '正向无功电能', val: '620,400 kvarh', status: '正常' },
        { group: '电', name: '反向无功电能', val: '9,800 kvarh', status: '正常' },
        { group: '水', name: '水压', val: '0.41 MPa', status: '正常' },
        { group: '水', name: '累计流量', val: '23,000 t', status: '正常' },
        { group: '水', name: '瞬时流量', val: '10.2 t/h', status: '正常' },
        { group: '气', name: '累计流量', val: '68,000 Nm³', status: '正常' },
      ],
      newEnergy: [
        { name: '光伏发电功率', val: '3,200 kW' },
        { name: '逆变器效率', val: '98.4%' },
        { name: '光伏消纳率', val: '100%' },
        { name: '储能充放电功率', val: '±800 kW' },
        { name: '储能 SOC', val: '58.8%' },
        { name: '储能 SOH', val: '96.9%' },
        { name: '储能直流电压', val: '736.4 V' },
        { name: '储能直流电流', val: '82.6 A' },
        { name: '市电负荷', val: '2,880 kW' },
      ],
    },
  ]

  const filteredFactories = factoryPkList.filter((f) => {
    if (selectedFactoryGroup === 'all') return true
    return f.group === selectedFactoryGroup
  })

  // 2. 维度二数据：产品型号库及其跨厂对比数据
  const crossFactoryDataByProduct: Record<string, any[]> = {
    'ODFS-334MVA/500kV': [
      {
        factory: '衡变本部 (衡阳基地)',
        unitEnergy: 1.18,
        diffPct: '-1.6% (达标)',
        isBest: true,
        status: '🟢 优胜标杆 (低碳工厂)',
        elec: '8,250 kWh/台',
        steam: '3.40 GJ/台',
        carbon: '1.15 tCO2/台',
        diagnosis: '真空干燥罐密封性极佳，冷凝水 100% 回收利用',
      },
      {
        factory: '沈变本部 (沈阳基地)',
        unitEnergy: 1.45,
        diffPct: '+20.8% (偏高)',
        isBest: false,
        status: '🟡 正常受控 (蒸汽略高)',
        elec: '10,420 kWh/台',
        steam: '4.82 GJ/台',
        carbon: '1.42 tCO2/台',
        diagnosis: '试验大厅无局放试验变频机组存在空载损耗',
      },
      {
        factory: '新变超高压 (昌吉基地)',
        unitEnergy: 1.58,
        diffPct: '+31.6% (超标)',
        isWorst: true,
        status: '🔴 严重拖后腿 (重点整改)',
        elec: '10,800 kWh/台',
        steam: '5.10 GJ/台',
        carbon: '1.55 tCO2/台',
        diagnosis: '2号干燥罐温控疏水阀微漏，保温层老化热散失大',
      },
    ],
    'SZ-110kV/63000kVA': [
      {
        factory: '沈变本部 (沈阳基地)',
        unitEnergy: 0.92,
        diffPct: '-3.2% (达标)',
        isBest: true,
        status: '🟢 优胜标杆',
        elec: '6,100 kWh/台',
        steam: '2.10 GJ/台',
        carbon: '0.88 tCO2/台',
        diagnosis: '自动化铁芯剪切线伺服节能，工艺能耗受控',
      },
      {
        factory: '衡变本部 (衡阳基地)',
        unitEnergy: 0.98,
        diffPct: '+3.1% (平稳)',
        isBest: false,
        status: '🟡 正常受控',
        elec: '6,450 kWh/台',
        steam: '2.25 GJ/台',
        carbon: '0.94 tCO2/台',
        diagnosis: '线圈绕组退火温控平稳，符合标准',
      },
      {
        factory: '天津变压器厂',
        unitEnergy: 1.15,
        diffPct: '+21.0% (超标)',
        isWorst: true,
        status: '🔴 偏高待优化',
        elec: '7,320 kWh/台',
        steam: '2.90 GJ/台',
        carbon: '1.10 tCO2/台',
        diagnosis: '老旧烘房保温棉老化，热效率低于行业基准',
      },
    ],
    'S13-M-800kVA': [
      {
        factory: '德缆股份配电车间',
        unitEnergy: 0.58,
        diffPct: '-6.4% (达标)',
        isBest: true,
        status: '🟢 能效标杆',
        elec: '3,200 kWh/台',
        steam: '0.80 GJ/台',
        carbon: '0.52 tCO2/台',
        diagnosis: '全自动流水线作业，非晶合金立体卷铁芯节能明显',
      },
      {
        factory: '沈变配电变压器分厂',
        unitEnergy: 0.65,
        diffPct: '+4.8%',
        isBest: false,
        status: '🟡 正常受控',
        elec: '3,550 kWh/台',
        steam: '0.92 GJ/台',
        carbon: '0.61 tCO2/台',
        diagnosis: '喷涂烘干线采用电加热辅热，略有波动',
      },
    ],
    'YJLW03-64/110kV': [
      {
        factory: '鲁缆本部 (泰安基地)',
        unitEnergy: 0.42,
        diffPct: '-6.7% (优胜)',
        isBest: true,
        status: '🟢 低碳标杆',
        elec: '2,800 kWh/km',
        steam: '1.10 GJ/km',
        carbon: '0.39 tCO2/km',
        diagnosis: '立塔交联全氮气循环系统，热回收效率 88%',
      },
      {
        factory: '新缆厂 (昌吉总部)',
        unitEnergy: 0.48,
        diffPct: '+6.6%',
        isWorst: true,
        status: '🔴 轻度偏高',
        elec: '3,150 kWh/km',
        steam: '1.28 GJ/km',
        carbon: '0.46 tCO2/km',
        diagnosis: '牵引收线电机功率因数需加装就地补偿',
      },
    ],
    'ESS-5MWh-Container': [
      {
        factory: '西安新能源成套基地',
        unitEnergy: 1.72,
        diffPct: '-7.0%',
        isBest: true,
        status: '🟢 标杆工厂',
        elec: '12,500 kWh/舱',
        steam: '0.00 GJ/舱',
        carbon: '1.65 tCO2/舱',
        diagnosis: '纯电充放电老化测试 100% 接入储能逆变回馈电网',
      },
      {
        factory: '昌吉成套制造厂',
        unitEnergy: 2.05,
        diffPct: '+10.8%',
        isWorst: true,
        status: '🔴 待优化',
        elec: '14,800 kWh/舱',
        steam: '0.00 GJ/舱',
        carbon: '1.98 tCO2/舱',
        diagnosis: '负载测试电阻箱未进行能量回馈，造成电能散失',
      },
    ],
  }

  // 3. 维度三数据：各工厂车间产线
  const factoryLineData: Record<string, any[]> = {
    '沈变本部 (沈阳基地)': [
      {
        name: '超高压真空干燥车间',
        unitOutputEnergy: 0.89,
        target: 0.60,
        diffPct: '+48.3% ▲',
        isWorst: true,
        status: '🔴 重点整改',
        reason: '2号真空干燥罐温控疏水阀微漏，加热升温曲线异常',
        lossCost: '超标电费 12.8 万元',
      },
      {
        name: '无局放超高压试验大厅',
        unitOutputEnergy: 0.58,
        target: 0.55,
        diffPct: '+5.4% ▲',
        isWorst: false,
        status: '🟡 轻微偏高',
        reason: '大容量变压器满负荷升温试验无功损耗',
        lossCost: '正常受控',
      },
      {
        name: '铁芯数控剪切自动叠装线',
        unitOutputEnergy: 0.32,
        target: 0.35,
        diffPct: '-8.5% ▼',
        isBest: true,
        status: '🟢 优秀达标',
        reason: '全自动高精伺服电机节能改造见效',
        lossCost: '节约电费 4.2 万元',
      },
      {
        name: '自动化绝缘绕线车间',
        unitOutputEnergy: 0.28,
        target: 0.30,
        diffPct: '-6.6% ▼',
        isBest: true,
        status: '🟢 优秀达标',
        reason: '恒张力变频卷线机组平稳运行',
        lossCost: '节约电费 3.5 万元',
      },
    ],
    '衡变本部 (衡阳基地)': [
      {
        name: '特高压变压器装配车间',
        unitOutputEnergy: 0.52,
        target: 0.55,
        diffPct: '-5.4% ▼',
        isBest: true,
        status: '🟢 优秀达标',
        reason: '数字化洁净装配车间恒温恒湿精准变频控制',
        lossCost: '节约 3.8 万元',
      },
      {
        name: '油浸绝缘干燥车间',
        unitOutputEnergy: 0.58,
        target: 0.60,
        diffPct: '-3.3% ▼',
        isBest: true,
        status: '🟢 正常受控',
        reason: '余热蒸汽回收系统正常运转',
        lossCost: '节约 2.1 万元',
      },
    ],
    '新变超高压 (昌吉基地)': [
      {
        name: '2号气相干燥生产线',
        unitOutputEnergy: 0.96,
        target: 0.60,
        diffPct: '+60.0% ▲',
        isWorst: true,
        status: '🔴 严重超标',
        reason: '管道阀门保温破损，蒸汽泄漏导致能耗剧增',
        lossCost: '损失 16.5 万元',
      },
      {
        name: '高压试验屏蔽机房',
        unitOutputEnergy: 0.62,
        target: 0.55,
        diffPct: '+12.7% ▲',
        isWorst: false,
        status: '🟡 偏高预警',
        reason: '谐波滤波装置效率下降',
        lossCost: '超标 3.2 万元',
      },
    ],
    '鲁缆本部 (泰安基地)': [
      {
        name: '超高压立塔悬垂生产线',
        unitOutputEnergy: 0.44,
        target: 0.45,
        diffPct: '-2.2% ▼',
        isBest: true,
        status: '🟢 达标受控',
        reason: '交联加热区温控 PID 自整定算法运行良好',
        lossCost: '正常',
      },
    ],
  }

  // 4. 维度四数据：产品批次波动
  const batchDataByProduct: Record<string, any[]> = {
    'ODFS-334MVA/500kV': [
      { batch: '#202608 批次 (当期)', unitKwh: 12800, carbon: 1.72, status: '🔴 异常突增 +24.5%', isWorst: true },
      { batch: '#202607 批次', unitKwh: 10350, carbon: 1.41, status: '正常受控', isWorst: false },
      { batch: '#202606 批次', unitKwh: 10200, carbon: 1.39, status: '正常受控', isWorst: false },
      { batch: '#202605 批次', unitKwh: 10250, carbon: 1.40, status: '正常受控', isWorst: false },
      { batch: '#202604 批次', unitKwh: 10100, carbon: 1.38, status: '正常受控', isWorst: false },
    ],
    'SZ-110kV/63000kVA': [
      { batch: '#202608 批次 (当期)', unitKwh: 6850, carbon: 0.98, status: '🟡 波动 +10.5%', isWorst: true },
      { batch: '#202607 批次', unitKwh: 6200, carbon: 0.89, status: '正常受控', isWorst: false },
      { batch: '#202606 批次', unitKwh: 6150, carbon: 0.88, status: '正常受控', isWorst: false },
      { batch: '#202605 批次', unitKwh: 6100, carbon: 0.87, status: '正常受控', isWorst: false },
      { batch: '#202604 批次', unitKwh: 6050, carbon: 0.86, status: '正常受控', isWorst: false },
    ],
    'S13-M-800kVA': [
      { batch: '#202608 批次 (当期)', unitKwh: 3220, carbon: 0.51, status: '🟢 极其平稳', isWorst: false },
      { batch: '#202607 批次', unitKwh: 3210, carbon: 0.51, status: '正常受控', isWorst: false },
      { batch: '#202606 批次', unitKwh: 3180, carbon: 0.50, status: '正常受控', isWorst: false },
      { batch: '#202605 批次', unitKwh: 3250, carbon: 0.52, status: '正常受控', isWorst: false },
      { batch: '#202604 批次', unitKwh: 3200, carbon: 0.51, status: '正常受控', isWorst: false },
    ],
    'YJLW03-64/110kV': [
      { batch: '#202608 批次 (当期)', unitKwh: 3150, carbon: 0.46, status: '🔴 突增 +11.7%', isWorst: true },
      { batch: '#202607 批次', unitKwh: 2820, carbon: 0.39, status: '正常受控', isWorst: false },
      { batch: '#202606 批次', unitKwh: 2790, carbon: 0.38, status: '正常受控', isWorst: false },
      { batch: '#202605 批次', unitKwh: 2850, carbon: 0.40, status: '正常受控', isWorst: false },
      { batch: '#202604 批次', unitKwh: 2800, carbon: 0.39, status: '正常受控', isWorst: false },
    ],
  }

  return (
    <div className="space-y-3 relative">
      {/* 顶部控制栏：4 大硬刚 PK 切换器 + 统计周期 + 导出对标红黑榜 */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-[#e5e7eb] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <Swords className="size-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-800">
                指标管控 · 4 维横向硬核 PK 看板
              </h1>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-50 text-red-600 border border-red-200 font-mono font-bold">
                用数据抓管理 · 用对比分优劣
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              左侧选择树状节点 · 右侧实时对比优劣 · 统计周期：2026-08
            </p>
          </div>
        </div>

        {/* 4 个对比维度大切换 Tab */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setPkTab('factory')}
              className={cn(
                'px-3.5 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5',
                pkTab === 'factory' ? 'bg-[#1677ff] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <Factory className="size-3.5" />
              1. 工厂之间 PK (总能碳)
            </button>
            <button
              onClick={() => setPkTab('product')}
              className={cn(
                'px-3.5 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5',
                pkTab === 'product' ? 'bg-[#1677ff] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <Package className="size-3.5" />
              2. 同产品跨工厂 PK (单耗)
            </button>
            <button
              onClick={() => setPkTab('line')}
              className={cn(
                'px-3.5 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5',
                pkTab === 'line' ? 'bg-[#1677ff] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <Cog className="size-3.5" />
              3. 同厂不同产线 PK (抓落后)
            </button>
            <button
              onClick={() => setPkTab('batch')}
              className={cn(
                'px-3.5 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5',
                pkTab === 'batch' ? 'bg-[#1677ff] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <Activity className="size-3.5" />
              4. 同产品不同批次 PK (抓波动)
            </button>
          </div>

          {/* 导出红黑榜按钮 */}
          <button
            onClick={() => alert('已导出本月《特变电工能效对标红黑榜 (2026年08月)》PDF/Excel 报告！')}
            className="px-3 py-1.5 rounded bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold flex items-center gap-1.5 shadow-xs"
            title="导出对标红黑榜"
          >
            <Download className="size-3.5 text-[#1677ff]" />
            <span>导出对标红黑榜</span>
          </button>
        </div>
      </div>

      {/* 主体两栏：左侧【对应维度的动态树状结构】 + 右侧【严格对齐的 PK 视口】 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch min-h-[calc(100vh-170px)]">
        {/* ======================================================== */}
        {/* 🌟 1. 左侧动态树状结构选择器 (依据当前 PK 维度展开匹配树) */}
        {/* ======================================================== */}
        <div className="lg:col-span-3">
          <div className="bg-white p-3.5 rounded-lg border border-[#e5e7eb] shadow-xs space-y-3 h-full flex flex-col justify-between">
            <div className="space-y-2.5">
              {/* 树顶部标题 */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <FolderTree className="size-4 text-[#1677ff]" />
                  {pkTab === 'factory' && '产业群与工厂树'}
                  {pkTab === 'product' && '产品品类与型号树'}
                  {pkTab === 'line' && '制造基地与车间树'}
                  {pkTab === 'batch' && '产品批次追溯树'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">树状穿透</span>
              </div>

              {/* 快速搜索框 */}
              <div className="relative">
                <Search className="size-3.5 text-slate-400 absolute left-2.5 top-2" />
                <input
                  type="text"
                  value={treeSearch}
                  onChange={(e) => setTreeSearch(e.target.value)}
                  placeholder="搜索树节点名称..."
                  className="w-full bg-slate-50 border border-slate-200 rounded pl-8 pr-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-[#1677ff]"
                />
              </div>

              {/* 树节点滚动区 */}
              <div className="max-h-[520px] overflow-y-auto pr-1">
                {pkTab === 'factory' && <TreeView data={factoryTreeData} expandedKeys={expandedNodes} onToggle={toggleNode} />}
                {pkTab === 'product' && <TreeView data={productTreeData} expandedKeys={expandedNodes} onToggle={toggleNode} />}
                {pkTab === 'line' && <TreeView data={lineTreeData} expandedKeys={expandedNodes} onToggle={toggleNode} />}
                {pkTab === 'batch' && <TreeView data={batchTreeData} expandedKeys={expandedNodes} onToggle={toggleNode} />}
              </div>

            </div>

            {/* 左侧底部提示 */}
            <div className="pt-2.5 border-t border-slate-100 text-[11px] text-slate-400 font-mono flex items-center gap-1">
              <Sparkles className="size-3 text-[#1677ff]" />
              <span>点击树节点实时刷新右侧 PK</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 🌟 2. 右侧白底高反差 PK 视口 (标准对齐栅格 Grid Table) */}
        {/* ======================================================== */}
        <div className="lg:col-span-9 space-y-3 flex flex-col justify-between">
          {/* 1. 维度一：全集团 21 家工厂总能碳大 PK */}
          {pkTab === 'factory' && (
            <div className="bg-white p-4.5 rounded-lg border border-[#e5e7eb] shadow-xs space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                      【维度一】全集团工厂总能耗与总碳排放排行榜（按综合能耗降序排列）
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">2026-08 统计周期 · 能耗差值直观条</span>
                </div>

                {/* 严格垂直对齐表头 (Grid Columns) */}
                <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 items-center select-none">
                  <div className="col-span-4">工厂及重点工序</div>
                  <div className="col-span-2 text-center">能耗规模对比条 (相较基准)</div>
                  <div className="col-span-2 text-right">综合能耗 (tce)</div>
                  <div className="col-span-2 text-right">总碳排放 (tCO2)</div>
                  <div className="col-span-1 text-center">绿电占比</div>
                  <div className="col-span-1 text-center">操作 / 诊断</div>
                </div>

                {/* 严格对齐数据行 (Data Rows) */}
                <div className="space-y-2 font-mono">
                  {filteredFactories.map((item) => (
                    <div
                      key={item.name}
                      className={cn(
                        'grid grid-cols-1 md:grid-cols-12 gap-3 px-4 py-3 rounded-lg border items-center transition-all',
                        item.status === 'worst'
                          ? 'bg-red-50/70 border-red-300 shadow-xs'
                          : item.status === 'best'
                          ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-blue-300'
                      )}
                    >
                      {/* 列 1: 序号、工厂名称与归因 (col-span-4) */}
                      <div className="md:col-span-4 flex items-center gap-3 overflow-hidden">
                        <span
                          className={cn(
                            'size-6 rounded text-xs font-extrabold flex items-center justify-center shrink-0',
                            item.status === 'worst'
                              ? 'bg-red-600 text-white animate-pulse'
                              : item.status === 'best'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-700'
                          )}
                        >
                          {item.rank}
                        </span>
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 font-sans truncate">{item.name}</span>
                            {item.status === 'worst' && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-100 text-red-700 font-sans font-bold border border-red-300">
                                重点监管
                              </span>
                            )}
                            {item.status === 'best' && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 font-sans font-bold border border-emerald-300">
                                能效标杆
                              </span>
                            )}
                          </div>
                          <span className={cn('text-[11px] font-sans truncate block', item.status === 'worst' ? 'text-red-700 font-semibold' : 'text-slate-500')}>
                            {item.reason}
                          </span>
                        </div>
                      </div>

                      {/* 列 2: 能耗规模对比能量条 (col-span-2) */}
                      <div className="md:col-span-2 space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-500 font-sans">
                          <span>差值幅度</span>
                          <span className={cn('font-bold font-mono', item.status === 'worst' ? 'text-red-600' : item.status === 'best' ? 'text-emerald-600' : 'text-slate-700')}>
                            {item.delta}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all duration-500',
                              item.status === 'worst'
                                ? 'bg-red-500'
                                : item.status === 'best'
                                ? 'bg-emerald-500'
                                : 'bg-[#1677ff]'
                            )}
                            style={{ width: `${item.barWidth}%` }}
                          />
                        </div>
                      </div>

                      {/* 列 3: 综合能耗 (col-span-2 text-right) */}
                      <div className="md:col-span-2 text-right">
                        <span className={cn('text-base font-bold', item.status === 'worst' ? 'text-red-600' : item.status === 'best' ? 'text-emerald-600' : 'text-slate-800')}>
                          {item.energy.toFixed(1)}
                        </span>
                        <span className="text-xs text-slate-400 font-sans ml-1">tce</span>
                      </div>

                      {/* 列 4: 总碳排放 (col-span-2 text-right) */}
                      <div className="md:col-span-2 text-right">
                        <span className={cn('text-base font-bold', item.status === 'worst' ? 'text-red-600' : item.status === 'best' ? 'text-emerald-600' : 'text-slate-800')}>
                          {item.carbon.toFixed(1)}
                        </span>
                        <span className="text-xs text-slate-400 font-sans ml-1">tCO2</span>
                      </div>

                      {/* 列 5: 绿电占比 (col-span-1 text-center) */}
                      <div className="md:col-span-1 text-center font-mono font-semibold text-xs text-slate-700">
                        {item.green}
                      </div>

                      {/* 列 6: 操作 - 显示明细 (col-span-1 text-center) */}
                      <div className="md:col-span-1 text-center font-sans">
                        <button
                          onClick={() => setSelectedDrawerEntity(item)}
                          className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-[#1677ff] border border-blue-200 font-semibold text-xs transition-colors whitespace-nowrap shadow-xs"
                        >
                          显示明细
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 font-mono">
                <span>当前筛选工厂月度平均能耗：<strong>1,082.3 tce</strong> · 绿电平均消纳率：<strong>38.6%</strong></span>
                <span className="text-slate-400">💡 点击【显示明细】可滑出工厂能碳指标与监测明细（指标核算/产品单耗/实时量测/新能源资产）</span>
              </div>
            </div>
          )}

          {/* 2. 维度二：同产品跨工厂 */}
          {pkTab === 'product' && (
            <div className="bg-white p-4.5 rounded-lg border border-[#e5e7eb] shadow-xs space-y-3.5 font-mono">
              <div className="border-b border-slate-100 pb-2.5">
                <span className="font-bold text-xs text-slate-800 flex items-center gap-2">
                  <Package className="size-4 text-[#1677ff]" />
                  【维度二】同型号产品跨厂低碳对标 PK：{selectedProductModel}
                </span>
                <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                  已匹配各基地生产批次横向对标 · 谁做得更低碳一目了然
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(crossFactoryDataByProduct[selectedProductModel] || crossFactoryDataByProduct['ODFS-334MVA/500kV']).map((item) => (
                  <div
                    key={item.factory}
                    className={cn(
                      'p-4.5 rounded-xl border space-y-3.5',
                      item.isBest
                        ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                        : item.isWorst
                        ? 'bg-red-50/70 border-red-300 shadow-xs'
                        : 'bg-white border-slate-200'
                    )}
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="font-bold text-sm text-slate-800 font-sans">{item.factory}</span>
                      <span className={cn('text-xs px-2.5 py-0.5 rounded font-sans font-bold border', item.isBest ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : item.isWorst ? 'bg-red-100 text-red-700 border-red-300' : 'bg-slate-100 text-slate-600 border-slate-200')}>
                        {item.status}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">综合单耗 (tce/万kVA)</span>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className={cn('text-3xl font-extrabold', item.isWorst ? 'text-red-600' : item.isBest ? 'text-emerald-700' : 'text-slate-900')}>
                          {item.unitEnergy}
                        </span>
                        <span className={cn('text-xs font-bold font-sans', item.isWorst ? 'text-red-600' : 'text-emerald-600')}>
                          {item.diffPct}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 font-sans pt-2 border-t border-slate-100">
                      <div className="flex justify-between"><span>单台电耗：</span><span className="font-bold font-mono text-slate-900">{item.elec}</span></div>
                      <div className="flex justify-between"><span>蒸汽消耗：</span><span className={cn('font-bold font-mono', item.isWorst ? 'text-red-600' : 'text-slate-900')}>{item.steam}</span></div>
                      <div className="flex justify-between"><span>单台碳足迹：</span><span className="font-bold font-mono text-emerald-700">{item.carbon}</span></div>
                    </div>

                    <div className={cn('p-2.5 rounded text-xs font-sans', item.isWorst ? 'bg-red-100/80 text-red-800 border border-red-200' : 'bg-slate-50 text-slate-600')}>
                      <strong>工艺归因：</strong>{item.diagnosis}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. 维度三：同厂不同产线 */}
          {pkTab === 'line' && (
            <div className="bg-white p-4.5 rounded-lg border border-[#e5e7eb] shadow-xs space-y-3.5 font-mono">
              <div className="border-b border-slate-100 pb-2.5">
                <span className="font-bold text-xs text-slate-800 flex items-center gap-2">
                  <Cog className="size-4 text-red-500" />
                  【维度三】{selectedLineFactory} 各车间产线能效 PK（直接定位哪个车间在拖后腿）
                </span>
                <p className="text-[11px] text-slate-500 font-sans mt-0.5">万元产值标杆基准：<strong className="text-emerald-600">0.60 tce/万</strong> · 产线超标责任到车间</p>
              </div>

              <div className="space-y-3">
                {(factoryLineData[selectedLineFactory] || factoryLineData['沈变本部 (沈阳基地)']).map((item) => (
                  <div
                    key={item.name}
                    className={cn(
                      'p-4 rounded-lg border flex flex-wrap items-center justify-between gap-4',
                      item.isWorst
                        ? 'bg-red-50/70 border-red-300 shadow-xs'
                        : item.isBest
                        ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                        : 'bg-white border-slate-200'
                    )}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-800 font-sans">{item.name}</span>
                        <span className={cn('text-[10px] px-2 py-0.5 rounded font-sans font-bold border', item.isWorst ? 'bg-red-100 text-red-700 border-red-300' : 'bg-emerald-100 text-emerald-700 border-emerald-300')}>
                          {item.lossCost}
                        </span>
                      </div>
                      <span className={cn('text-xs font-sans block mt-1', item.isWorst ? 'text-red-700 font-semibold' : 'text-slate-500')}>
                        排查归因：{item.reason}
                      </span>
                    </div>

                    <div className="flex items-center gap-8 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">产值能耗</span>
                        <span className={cn('text-xl font-bold', item.isWorst ? 'text-red-600' : 'text-emerald-700')}>
                          {item.unitOutputEnergy} <span className="text-xs font-normal text-slate-400">tce/万</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">偏差幅度</span>
                        <span className={cn('text-base font-bold', item.isWorst ? 'text-red-600' : 'text-emerald-700')}>{item.diffPct}</span>
                      </div>
                      <span className={cn('px-3 py-1 rounded text-xs font-sans font-bold border', item.isWorst ? 'bg-red-100 text-red-700 border-red-300' : 'bg-emerald-100 text-emerald-700 border-emerald-300')}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. 维度四：同产品不同批次 */}
          {pkTab === 'batch' && (
            <div className="bg-white p-4.5 rounded-lg border border-[#e5e7eb] shadow-xs space-y-3.5 font-mono">
              <div className="border-b border-slate-100 pb-2.5">
                <span className="font-bold text-xs text-slate-800 flex items-center gap-2">
                  <Activity className="size-4 text-red-500" />
                  【维度四】{selectedBatchProduct} 连续 5 个生产批次单耗与碳排波动离散 PK
                </span>
                <p className="text-[11px] text-slate-500 font-sans mt-0.5">锁定异常突增生产批次，精准回溯工艺波动</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5">
                {(batchDataByProduct[selectedBatchProduct] || batchDataByProduct['ODFS-334MVA/500kV']).map((b) => (
                  <div
                    key={b.batch}
                    className={cn(
                      'p-4 rounded-xl border space-y-2.5',
                      b.isWorst
                        ? 'bg-red-50/70 border-red-300 shadow-xs'
                        : 'bg-white border-slate-200'
                    )}
                  >
                    <span className="font-bold text-xs text-slate-700 font-sans block">{b.batch}</span>
                    <div>
                      <span className="text-[10px] text-slate-400 font-sans block">单台电耗</span>
                      <span className={cn('text-2xl font-bold', b.isWorst ? 'text-red-600' : 'text-slate-900')}>{b.unitKwh.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400"> kWh</span>
                    </div>
                    <div className="pt-2 border-t border-slate-100 text-xs">
                      <span className="text-slate-400 font-sans">碳排：</span>
                      <span className={cn('font-bold', b.isWorst ? 'text-red-600' : 'text-emerald-700')}>{b.carbon} tCO2</span>
                    </div>
                    <span className={cn('block text-xs font-sans font-bold px-2 py-0.5 rounded text-center border', b.isWorst ? 'bg-red-100 text-red-700 border-red-300' : 'bg-slate-100 text-slate-600 border-slate-200')}>
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 🌟 工业级 7 大板块：工厂能碳指标与监测明细抽屉（按需求对齐） */}
      {/* ======================================================== */}
      {selectedDrawerEntity && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-4xl lg:max-w-5xl bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
            {/* 抽屉顶部头部 */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-[#1677ff] text-white flex items-center justify-center font-bold shadow-xs">
                  <Factory className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-sm text-slate-900 font-sans">
                      {selectedDrawerEntity.name} · 工厂能碳指标与监测明细
                    </h2>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-[#1677ff] font-bold font-mono">
                      监测报告 2026-08
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    主体：{selectedDrawerEntity.pic || '特变电工基地'} · 指标核算/产品单耗/实时量测/新能源资产全量监测
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`已成功导出《${selectedDrawerEntity.name}能碳指标与监测明细报告(2026-08)》PDF 文件！`)}
                  className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1 shadow-xs"
                >
                  <Download className="size-3.5 text-[#1677ff]" />
                  <span>导出PDF</span>
                </button>
                <button
                  onClick={() => setSelectedDrawerEntity(null)}
                  className="p-1 rounded text-slate-400 hover:text-slate-800"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* 抽屉内容主体 (7 大板块滚动区) */}
            <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* 板块 1: 核心指标概况与同环比 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-slate-800 font-bold border-b border-slate-100 pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Gauge className="size-4 text-[#1677ff]" />
                    1. 综合能碳概况与同环比趋势
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">行业先进对标</span>
                </div>

                <div className="grid grid-cols-4 gap-2 font-mono">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-sans">月度综合能耗</span>
                    <div className="text-base font-bold text-slate-900">{selectedDrawerEntity.energy} <span className="text-[10px] font-normal text-slate-400 font-sans">tce</span></div>
                    <div className="text-[10px] text-red-600 font-semibold mt-0.5">同比 {selectedDrawerEntity.yoy || '+18.4%'} ▲</div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-sans">月度总碳排放</span>
                    <div className="text-base font-bold text-slate-900">{selectedDrawerEntity.carbon} <span className="text-[10px] font-normal text-slate-400 font-sans">tCO2</span></div>
                    <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">减碳 -{selectedDrawerEntity.avoidedCarbon || '1,240'} t</div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-sans">绿电消纳占比</span>
                    <div className="text-base font-bold text-emerald-600">{selectedDrawerEntity.green}</div>
                    <div className="text-[10px] text-slate-400 font-sans mt-0.5">标杆基准 44.0%</div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-sans">综合度电成本</span>
                    <div className="text-base font-bold text-slate-900">{selectedDrawerEntity.avgCost || '0.685'} <span className="text-[10px] font-normal text-slate-400 font-sans">元/度</span></div>
                    <div className="text-[10px] text-red-600 font-semibold mt-0.5">尖峰电费偏高</div>
                  </div>
                </div>
              </div>

              {/* 板块 1.2: 近12个月综合能耗与碳排放趋势 */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between pb-1.5">
                  <span className="text-[11px] font-bold text-slate-700 font-sans flex items-center gap-1.5">
                    <Activity className="size-3.5 text-[#1677ff]" />
                    近12个月综合能耗与碳排放趋势
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">月 / 当量值</span>
                </div>
                <LineTrend
                  height={180}
                  xKey="month"
                  keys={[
                    { key: '综合能耗', name: '综合能耗 (tce)', color: '#1677ff' },
                    { key: '碳排放', name: '碳排放 (tCO2)', color: '#52c41a' },
                  ]}
                  data={genEnergyTrend(selectedDrawerEntity.energy, selectedDrawerEntity.carbon)}
                />
              </div>

              {/* 板块 2: 能源介质解构 (电/蒸汽/天然气/水) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-slate-800 font-bold border-b border-slate-100 pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Layers className="size-4 text-[#1677ff]" />
                    2. 能源介质消耗构成 (分项能耗)
                  </span>
                  <span className="text-[10px] text-red-600 font-semibold">🔴 蒸汽为主要超标介质</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                  <div className="p-2 bg-blue-50/60 rounded border border-blue-200 space-y-1">
                    <div className="flex items-center justify-between font-sans">
                      <span className="font-bold text-slate-800 flex items-center gap-1"><Zap className="size-3 text-[#1677ff]" />外购电力</span>
                      <span className="text-[10px] text-blue-700 font-bold">{selectedDrawerEntity.media?.elec.pct || '68.3%'}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900">{selectedDrawerEntity.media?.elec.val || '8,450 MWh'}</div>
                    <div className="text-[10px] text-slate-500">折标: {selectedDrawerEntity.media?.elec.tce || '1,038 tce'}</div>
                  </div>

                  <div className="p-2 bg-red-50 rounded border border-red-200 space-y-1">
                    <div className="flex items-center justify-between font-sans">
                      <span className="font-bold text-red-800 flex items-center gap-1"><Flame className="size-3 text-red-600" />工业蒸汽</span>
                      <span className="text-[10px] text-red-700 font-bold">{selectedDrawerEntity.media?.steam.pct || '21.5%'}</span>
                    </div>
                    <div className="text-xs font-bold text-red-600">{selectedDrawerEntity.media?.steam.val || '3,820 GJ'}</div>
                    <div className="text-[10px] text-red-700 font-semibold">{selectedDrawerEntity.media?.steam.status || '🔴 严重超标'}</div>
                  </div>

                  <div className="p-2 bg-slate-50 rounded border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between font-sans">
                      <span className="font-bold text-slate-800 flex items-center gap-1"><Flame className="size-3 text-amber-500" />天然气</span>
                      <span className="text-[10px] text-slate-500">{selectedDrawerEntity.media?.gas.pct || '8.0%'}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-800">{selectedDrawerEntity.media?.gas.val || '12.4万 Nm³'}</div>
                    <div className="text-[10px] text-slate-500">折标: {selectedDrawerEntity.media?.gas.tce || '121.6 tce'}</div>
                  </div>

                  <div className="p-2 bg-slate-50 rounded border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between font-sans">
                      <span className="font-bold text-slate-800 flex items-center gap-1"><Droplets className="size-3 text-cyan-600" />软水/气</span>
                      <span className="text-[10px] text-slate-500">{selectedDrawerEntity.media?.other.pct || '2.2%'}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-800">{selectedDrawerEntity.media?.other.val || '4.2万吨'}</div>
                    <div className="text-[10px] text-slate-500">正常受控</div>
                  </div>
                </div>
              </div>

              {/* 板块 2.1: 能源介质占比构成（环形图） */}
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[11px] font-bold text-slate-700 font-sans pb-1">能源介质占比构成</div>
                <Donut
                  height={185}
                  data={[
                    { name: '外购电力', value: parseFloat(String(selectedDrawerEntity.media?.elec.pct || '68.3%').replace('%', '')) },
                    { name: '工业蒸汽', value: parseFloat(String(selectedDrawerEntity.media?.steam.pct || '21.5%').replace('%', '')) },
                    { name: '天然气', value: parseFloat(String(selectedDrawerEntity.media?.gas.pct || '8.0%').replace('%', '')) },
                    { name: '软水/气', value: parseFloat(String(selectedDrawerEntity.media?.other.pct || '2.2%').replace('%', '')) },
                  ]}
                />
              </div>

              {/* 板块 3: 峰平谷分时用电结构透视 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-slate-800 font-bold border-b border-slate-100 pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-4 text-[#1677ff]" />
                    3. 峰平谷用电结构透视 (避峰填谷潜力)
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">峰谷比 64.6% : 13.3%</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 font-mono">
                  {/* 分时比例条 */}
                  <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex">
                    <div className="bg-red-500 h-full" style={{ width: selectedDrawerEntity.tou?.tip || '28.4%' }} title="尖峰 28.4%" />
                    <div className="bg-amber-400 h-full" style={{ width: selectedDrawerEntity.tou?.peak || '36.2%' }} title="高峰 36.2%" />
                    <div className="bg-blue-400 h-full" style={{ width: selectedDrawerEntity.tou?.flat || '22.1%' }} title="平段 22.1%" />
                    <div className="bg-emerald-500 h-full" style={{ width: selectedDrawerEntity.tou?.valley || '13.3%' }} title="低谷 13.3%" />
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-[11px] font-sans pt-1">
                    <div className="flex items-center gap-1">
                      <span className="size-2 rounded-full bg-red-500 shrink-0" />
                      <span>尖峰: <strong className="font-mono text-red-600">{selectedDrawerEntity.tou?.tip || '28.4%'}</strong> (偏高)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="size-2 rounded-full bg-amber-400 shrink-0" />
                      <span>高峰: <strong className="font-mono text-slate-800">{selectedDrawerEntity.tou?.peak || '36.2%'}</strong></span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="size-2 rounded-full bg-blue-400 shrink-0" />
                      <span>平段: <strong className="font-mono text-slate-800">{selectedDrawerEntity.tou?.flat || '22.1%'}</strong></span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                      <span>低谷: <strong className="font-mono text-emerald-700">{selectedDrawerEntity.tou?.valley || '13.3%'}</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 板块 3.1: 近7日峰谷电量分布 */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between pb-1.5">
                  <span className="text-[11px] font-bold text-slate-700 font-sans flex items-center gap-1.5">
                    <BarChart3 className="size-3.5 text-[#1677ff]" />
                    近7日峰谷电量分布
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">MWh / 日</span>
                </div>
                <BarGroup
                  height={170}
                  xKey="day"
                  keys={[
                    { key: '高峰', name: '高峰', color: '#f5222d' },
                    { key: '平段', name: '平段', color: '#1677ff' },
                    { key: '低谷', name: '低谷', color: '#52c41a' },
                  ]}
                  data={genWeekTou()}
                />
              </div>

              {/* 板块 4: 车间工序能流与设备负荷下钻 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-slate-800 font-bold border-b border-slate-100 pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Cog className="size-4 text-[#1677ff]" />
                    4. 车间重点工序能流与能耗占比
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">对应《"双中心"项目能碳管控指标体系V1.4》关键工序指标</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
                  {/* 左侧：工序能耗占比饼图 */}
                  <div className="lg:col-span-2 p-2.5 bg-white rounded-lg border border-slate-200 flex flex-col">
                    <div className="text-[11px] font-bold text-slate-700 font-sans pb-1">工序能耗占比构成</div>
                    <Donut
                      height={190}
                      data={[
                        { name: '高压真空干燥', value: 32.6 },
                        { name: '超高压试验大厅', value: 22.1 },
                        { name: '铁芯数控叠装', value: 14.1 },
                        { name: '绝缘绕线车间', value: 11.2 },
                      ]}
                    />
                  </div>

                  {/* 右侧：工序能耗明细占比列表 */}
                  <div className="lg:col-span-3 space-y-2.5">
                    <div className="space-y-1 font-mono">
                      <div className="flex justify-between items-center text-[11px] font-sans">
                        <span className="font-semibold text-slate-800">1. 高压真空干燥工序 (超标源头)</span>
                        <span className="font-bold text-red-600 font-mono">32.6% · 4,200 MWh</span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full w-[32.6%]" />
                      </div>
                    </div>

                    <div className="space-y-1 font-mono">
                      <div className="flex justify-between items-center text-[11px] font-sans">
                        <span className="font-semibold text-slate-800">2. 无局放超高压试验大厅</span>
                        <span className="font-bold text-slate-700 font-mono">22.1% · 2,850 MWh</span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#1677ff] rounded-full w-[22.1%]" />
                      </div>
                    </div>

                    <div className="space-y-1 font-mono">
                      <div className="flex justify-between items-center text-[11px] font-sans">
                        <span className="font-semibold text-slate-800">3. 铁芯数控叠装与自动化装配 (伺服节能)</span>
                        <span className="font-bold text-emerald-700 font-mono">14.1% · 1,820 MWh</span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full w-[14.1%]" />
                      </div>
                    </div>

                    <div className="space-y-1 font-mono">
                      <div className="flex justify-between items-center text-[11px] font-sans">
                        <span className="font-semibold text-slate-800">4. 自动化绝缘绕线车间</span>
                        <span className="font-bold text-slate-700 font-mono">11.2% · 1,450 MWh</span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-400 rounded-full w-[11.2%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

                            {/* 板块 5: 产品型号级产品管控指标（需求：5类单耗到产品型号） */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-slate-800 font-bold border-b border-slate-100 pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Package className="size-4 text-[#1677ff]" />
                    5. 产品型号级产品管控指标（单位产品5类单耗）
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">需求：单耗均到产品型号 · 环比同型号对比</span>
                </div>
                <div className="border border-slate-200 rounded-lg overflow-hidden font-mono">
                  <table className="w-full text-[11px] text-left">
                    <thead className="bg-slate-100 text-slate-600 font-sans font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2">产品型号</th>
                        <th className="p-2 text-right">单位产品能耗</th>
                        <th className="p-2 text-right">单位产品电耗</th>
                        <th className="p-2 text-right">单位产品蒸汽消耗</th>
                        <th className="p-2 text-right">单位产品天然气消耗</th>
                        <th className="p-2 text-right">单位产品水耗</th>
                        <th className="p-2 text-center">环比</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {(selectedDrawerEntity.products && selectedDrawerEntity.products.length ? selectedDrawerEntity.products : [
                        { model: 'ODFS-334MVA/500kV', energy: '1.58 tce/台', elec: '10,800 kWh/台', steam: '5.10 GJ/台', gas: '132 m³/台', water: '42 t/台', mom: '+31.6%' },
                      ]).map((p: any) => (
                        <tr key={p.model} className="hover:bg-slate-50">
                          <td className="p-2 font-bold text-[#1677ff]">{p.model}</td>
                          <td className="p-2 text-right">{p.energy}</td>
                          <td className="p-2 text-right">{p.elec}</td>
                          <td className="p-2 text-right">{p.steam}</td>
                          <td className="p-2 text-right">{p.gas}</td>
                          <td className="p-2 text-right">{p.water}</td>
                          <td className="p-2 text-center">
                            <span className={cn('px-1.5 py-0.2 rounded font-bold text-[10px]', p.mom.startsWith('-') ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700')}>
                              {p.mom} 环比
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 板块 6: 工序能耗实时量测点位（需求：电/水/天然气实时数据） */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-slate-800 font-bold border-b border-slate-100 pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="size-4 text-[#1677ff]" />
                    6. 工序能耗实时量测点位（电 / 水 / 天然气）
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">需求：电压/电流/功率/电能/水压/流量</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {(selectedDrawerEntity.realtime && selectedDrawerEntity.realtime.length ? selectedDrawerEntity.realtime : [
                    { group: '电', name: '电压', val: '10.2 kV', status: '正常' },
                  ]).map((s: any, i: number) => (
                    <div
                      key={i}
                      onClick={() => setActiveRtPoint(s)}
                      className={cn(
                        'p-2.5 bg-white rounded-lg border shadow-xs font-mono flex flex-col gap-1.5 cursor-pointer transition-all',
                        activeRtPoint?.name === s.name ? 'border-[#1677ff] ring-1 ring-[#1677ff]/30' : 'border-slate-200 hover:border-blue-300',
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className={cn('px-1.5 py-0.2 rounded font-bold text-[10px] font-sans', s.group === '电' ? 'bg-blue-100 text-blue-700' : s.group === '水' ? 'bg-cyan-100 text-cyan-700' : 'bg-amber-100 text-amber-700')}>
                          {s.group}
                        </span>
                        <span className={cn('px-1.5 py-0.2 rounded font-bold text-[10px] font-sans', s.status.includes('🔴') ? 'bg-red-100 text-red-700 border border-red-300' : s.status.includes('🟡') ? 'bg-amber-50 text-amber-700 border border-amber-300' : 'bg-slate-100 text-slate-600')}>
                          {s.status}
                        </span>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 block font-sans">{s.name}</div>
                        <div className="text-sm font-bold text-slate-900">{s.val}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 板块 6.1: 选中点位 24小时监测曲线（点击上方卡片联动切换） */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between pb-1.5">
                  <span className="text-[11px] font-bold text-slate-700 font-sans flex items-center gap-1.5">
                    <Zap className="size-3.5 text-[#1677ff]" />
                    {(activeRtPoint?.name || '正向有功电能')} · 24小时监测曲线
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">当前值 {activeRtPoint?.val || '…'}</span>
                </div>
                <LineTrend
                  height={160}
                  xKey="hour"
                  keys={[{ key: '监测值', name: (activeRtPoint?.name || '正向有功电能') + ' 监测值', color: '#1677ff' }]}
                  data={genPointCurve(activeRtPoint)}
                />
              </div>

                          </div>

            {/* 抽屉底部操作栏：关闭 */}
            <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
              <button
                onClick={() => setSelectedDrawerEntity(null)}
                className="px-4 py-2 rounded bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold text-xs shadow-xs"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
