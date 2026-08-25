'use client'

import { useState } from 'react'
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
  ChevronRight,
  ChevronDown,
  SlidersHorizontal,
  Zap,
  Flame,
  Droplets,
  Package,
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
  Check,
  FolderTree,
  FileText,
  Clock,
  Coins,
  Cpu,
  Wrench,
  CheckCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

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

  // 工单下发成功提示
  const [ticketCreated, setTicketCreated] = useState(false)

  // 树内搜索关键字
  const [treeSearch, setTreeSearch] = useState('')

  // 折叠展开状态
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    group_all: true,
    group_transformer: true,
    group_cable: true,
    group_newenergy: true,
    prod_trans: true,
    prod_cable: true,
    prod_energy: true,
    fac_sb: true,
    fac_hb: true,
    fac_xb: true,
    fac_ll: true,
    batch_odfs: true,
    batch_sz: true,
  })

  const toggleNode = (nodeKey: string) => {
    setExpandedNodes((prev) => ({ ...prev, [nodeKey]: !prev[nodeKey] }))
  }

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

  const handleCreateTicket = () => {
    setTicketCreated(true)
    setTimeout(() => setTicketCreated(false), 4000)
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
              <div className="space-y-1 text-xs max-h-[520px] overflow-y-auto pr-1">
                {/* ---------------------------------------------------- */}
                {/* 维度 1: 产业群与工厂树 */}
                {/* ---------------------------------------------------- */}
                {pkTab === 'factory' && (
                  <div className="space-y-1">
                    <div
                      onClick={() => setSelectedFactoryGroup('all')}
                      className={cn(
                        'p-1.5 rounded flex items-center justify-between cursor-pointer border',
                        selectedFactoryGroup === 'all'
                          ? 'bg-blue-50 border-[#1677ff] text-[#1677ff] font-bold shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                      )}
                    >
                      <div className="flex items-center gap-1.5">
                        <Building2 className="size-3.5 text-[#1677ff]" />
                        <span>特变电工集团 (全量 21 家厂)</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">全部</span>
                    </div>

                    <div className="ml-2 pl-2 border-l border-slate-200 space-y-1 mt-1">
                      {/* 变压器产业群 */}
                      <div>
                        <div
                          onClick={() => {
                            toggleNode('group_transformer')
                            setSelectedFactoryGroup('transformer')
                          }}
                          className={cn(
                            'p-1 rounded flex items-center justify-between cursor-pointer',
                            selectedFactoryGroup === 'transformer' ? 'bg-blue-50 text-[#1677ff] font-bold' : 'text-slate-700 hover:bg-slate-50'
                          )}
                        >
                          <div className="flex items-center gap-1">
                            {expandedNodes.group_transformer ? <ChevronDown className="size-3 text-slate-400" /> : <ChevronRight className="size-3 text-slate-400" />}
                            <span>⚡ 变压器产业群 (8家)</span>
                          </div>
                        </div>
                        {expandedNodes.group_transformer && (
                          <div className="ml-4 pl-2 border-l border-slate-100 space-y-0.5 mt-0.5 text-[11px] text-slate-600">
                            <div className="py-0.5 px-1 rounded hover:bg-slate-50 cursor-pointer">🏬 沈变本部 (沈阳基地)</div>
                            <div className="py-0.5 px-1 rounded hover:bg-slate-50 cursor-pointer">🏬 衡变本部 (衡阳基地)</div>
                            <div className="py-0.5 px-1 rounded hover:bg-slate-50 cursor-pointer text-red-600 font-semibold">🏬 新变超高压 (昌吉) 🔴</div>
                            <div className="py-0.5 px-1 rounded hover:bg-slate-50 cursor-pointer">🏬 天津变压器厂</div>
                          </div>
                        )}
                      </div>

                      {/* 输配电线缆产业群 */}
                      <div>
                        <div
                          onClick={() => {
                            toggleNode('group_cable')
                            setSelectedFactoryGroup('cable')
                          }}
                          className={cn(
                            'p-1 rounded flex items-center justify-between cursor-pointer',
                            selectedFactoryGroup === 'cable' ? 'bg-blue-50 text-[#1677ff] font-bold' : 'text-slate-700 hover:bg-slate-50'
                          )}
                        >
                          <div className="flex items-center gap-1">
                            {expandedNodes.group_cable ? <ChevronDown className="size-3 text-slate-400" /> : <ChevronRight className="size-3 text-slate-400" />}
                            <span>🔌 输配电线缆产业群 (7家)</span>
                          </div>
                        </div>
                        {expandedNodes.group_cable && (
                          <div className="ml-4 pl-2 border-l border-slate-100 space-y-0.5 mt-0.5 text-[11px] text-slate-600">
                            <div className="py-0.5 px-1 rounded hover:bg-slate-50 cursor-pointer">🏬 鲁缆本部 (泰安基地)</div>
                            <div className="py-0.5 px-1 rounded hover:bg-slate-50 cursor-pointer">🏬 德缆股份 (德阳基地)</div>
                            <div className="py-0.5 px-1 rounded hover:bg-slate-50 cursor-pointer text-emerald-700 font-semibold">🏬 新缆厂 (昌吉总部) 🟢</div>
                          </div>
                        )}
                      </div>

                      {/* 新能源与集成成套 */}
                      <div>
                        <div
                          onClick={() => {
                            toggleNode('group_newenergy')
                            setSelectedFactoryGroup('newenergy')
                          }}
                          className={cn(
                            'p-1 rounded flex items-center justify-between cursor-pointer',
                            selectedFactoryGroup === 'newenergy' ? 'bg-blue-50 text-[#1677ff] font-bold' : 'text-slate-700 hover:bg-slate-50'
                          )}
                        >
                          <div className="flex items-center gap-1">
                            {expandedNodes.group_newenergy ? <ChevronDown className="size-3 text-slate-400" /> : <ChevronRight className="size-3 text-slate-400" />}
                            <span>☀️ 新能源与成套产业群 (6家)</span>
                          </div>
                        </div>
                        {expandedNodes.group_newenergy && (
                          <div className="ml-4 pl-2 border-l border-slate-100 space-y-0.5 mt-0.5 text-[11px] text-slate-600">
                            <div className="py-0.5 px-1 rounded hover:bg-slate-50 cursor-pointer">🏬 西安新能源成套基地</div>
                            <div className="py-0.5 px-1 rounded hover:bg-slate-50 cursor-pointer">🏬 昌吉成套装备厂</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 维度 2: 产品品类与型号树 */}
                {pkTab === 'product' && (
                  <div className="space-y-1">
                    <div className="font-bold text-slate-800 py-1 px-1.5 bg-slate-50 rounded flex items-center gap-1.5 border border-slate-200">
                      <ChevronDown className="size-3.5 text-[#1677ff]" />
                      <span>特变电工重点产品目录</span>
                    </div>

                    <div className="ml-2 pl-2 border-l border-slate-200 space-y-1 mt-1">
                      <div>
                        <div
                          onClick={() => toggleNode('prod_trans')}
                          className="font-semibold text-slate-700 py-0.5 px-1 flex items-center gap-1 cursor-pointer"
                        >
                          {expandedNodes.prod_trans ? <ChevronDown className="size-3 text-slate-400" /> : <ChevronRight className="size-3 text-slate-400" />}
                          <span>⚡ 输变电与特高压变压器</span>
                        </div>
                        {expandedNodes.prod_trans && (
                          <div className="ml-4 pl-2 border-l border-slate-100 space-y-1 mt-0.5">
                            <div
                              onClick={() => setSelectedProductModel('ODFS-334MVA/500kV')}
                              className={cn(
                                'p-1.5 rounded cursor-pointer transition-colors',
                                selectedProductModel === 'ODFS-334MVA/500kV'
                                  ? 'bg-blue-50 text-[#1677ff] font-bold border border-blue-200'
                                  : 'text-slate-600 hover:bg-slate-50'
                              )}
                            >
                              <div className="font-mono text-xs">ODFS-334MVA/500kV</div>
                              <span className="text-[10px] text-slate-500 block">单相自耦变 (3 厂共造)</span>
                            </div>

                            <div
                              onClick={() => setSelectedProductModel('SZ-110kV/63000kVA')}
                              className={cn(
                                'p-1.5 rounded cursor-pointer transition-colors',
                                selectedProductModel === 'SZ-110kV/63000kVA'
                                  ? 'bg-blue-50 text-[#1677ff] font-bold border border-blue-200'
                                  : 'text-slate-600 hover:bg-slate-50'
                              )}
                            >
                              <div className="font-mono text-xs">SZ-110kV/63000kVA</div>
                              <span className="text-[10px] text-slate-500 block">三相油浸电力变 (4 厂共造)</span>
                            </div>

                            <div
                              onClick={() => setSelectedProductModel('S13-M-800kVA')}
                              className={cn(
                                'p-1.5 rounded cursor-pointer transition-colors',
                                selectedProductModel === 'S13-M-800kVA'
                                  ? 'bg-blue-50 text-[#1677ff] font-bold border border-blue-200'
                                  : 'text-slate-600 hover:bg-slate-50'
                              )}
                            >
                              <div className="font-mono text-xs">S13-M-800kVA</div>
                              <span className="text-[10px] text-slate-500 block">节能配电变 (5 厂共造)</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <div
                          onClick={() => toggleNode('prod_cable')}
                          className="font-semibold text-slate-700 py-0.5 px-1 flex items-center gap-1 cursor-pointer"
                        >
                          {expandedNodes.prod_cable ? <ChevronDown className="size-3 text-slate-400" /> : <ChevronRight className="size-3 text-slate-400" />}
                          <span>🔌 高压与特种线缆</span>
                        </div>
                        {expandedNodes.prod_cable && (
                          <div className="ml-4 pl-2 border-l border-slate-100 space-y-1 mt-0.5">
                            <div
                              onClick={() => setSelectedProductModel('YJLW03-64/110kV')}
                              className={cn(
                                'p-1.5 rounded cursor-pointer transition-colors',
                                selectedProductModel === 'YJLW03-64/110kV'
                                  ? 'bg-blue-50 text-[#1677ff] font-bold border border-blue-200'
                                  : 'text-slate-600 hover:bg-slate-50'
                              )}
                            >
                              <div className="font-mono text-xs">YJLW03-64/110kV</div>
                              <span className="text-[10px] text-slate-500 block">高压交联电缆 (3 厂共造)</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 维度 3: 制造基地与车间树 */}
                {pkTab === 'line' && (
                  <div className="space-y-1">
                    <div className="font-bold text-slate-800 py-1 px-1.5 bg-slate-50 rounded flex items-center gap-1.5 border border-slate-200">
                      <ChevronDown className="size-3.5 text-[#1677ff]" />
                      <span>特变电工制造基地与车间</span>
                    </div>

                    <div className="ml-2 pl-2 border-l border-slate-200 space-y-1 mt-1">
                      <div>
                        <div
                          onClick={() => {
                            toggleNode('fac_sb')
                            setSelectedLineFactory('沈变本部 (沈阳基地)')
                          }}
                          className={cn(
                            'p-1.5 rounded flex items-center justify-between cursor-pointer',
                            selectedLineFactory === '沈变本部 (沈阳基地)' ? 'bg-blue-50 text-[#1677ff] font-bold' : 'text-slate-700 hover:bg-slate-50'
                          )}
                        >
                          <div className="flex items-center gap-1">
                            {expandedNodes.fac_sb ? <ChevronDown className="size-3 text-slate-400" /> : <ChevronRight className="size-3 text-slate-400" />}
                            <span>🏬 沈变本部 (沈阳基地)</span>
                          </div>
                          {selectedLineFactory === '沈变本部 (沈阳基地)' && <Check className="size-3 text-[#1677ff]" />}
                        </div>
                        {expandedNodes.fac_sb && (
                          <div className="ml-4 pl-2 border-l border-slate-100 space-y-0.5 mt-0.5 text-[11px] text-slate-600">
                            <div className="py-0.5 px-1 rounded text-red-600 font-semibold bg-red-50">⚙️ 超高压真空干燥车间 🔴</div>
                            <div className="py-0.5 px-1 rounded hover:bg-slate-50">⚙️ 无局放超高压试验大厅</div>
                            <div className="py-0.5 px-1 rounded text-emerald-700 hover:bg-slate-50">⚙️ 铁芯剪切自动叠装线 🟢</div>
                            <div className="py-0.5 px-1 rounded hover:bg-slate-50">⚙️ 自动化绝缘绕线车间</div>
                          </div>
                        )}
                      </div>

                      <div
                        onClick={() => {
                          setSelectedLineFactory('衡变本部 (衡阳基地)')
                        }}
                        className={cn(
                          'p-1.5 rounded flex items-center justify-between cursor-pointer',
                          selectedLineFactory === '衡变本部 (衡阳基地)' ? 'bg-blue-50 text-[#1677ff] font-bold' : 'text-slate-700 hover:bg-slate-50'
                        )}
                      >
                        <div className="flex items-center gap-1">
                          <Factory className="size-3 text-slate-400" />
                          <span>🏬 衡变本部 (衡阳基地)</span>
                        </div>
                        {selectedLineFactory === '衡变本部 (衡阳基地)' && <Check className="size-3 text-[#1677ff]" />}
                      </div>

                      <div
                        onClick={() => {
                          setSelectedLineFactory('新变超高压 (昌吉基地)')
                        }}
                        className={cn(
                          'p-1.5 rounded flex items-center justify-between cursor-pointer',
                          selectedLineFactory === '新变超高压 (昌吉基地)' ? 'bg-blue-50 text-[#1677ff] font-bold' : 'text-slate-700 hover:bg-slate-50'
                        )}
                      >
                        <div className="flex items-center gap-1">
                          <Factory className="size-3 text-slate-400" />
                          <span>🏬 新变超高压 (昌吉基地)</span>
                        </div>
                        {selectedLineFactory === '新变超高压 (昌吉基地)' && <Check className="size-3 text-[#1677ff]" />}
                      </div>
                    </div>
                  </div>
                )}

                {/* 维度 4: 产品批次追溯树 */}
                {pkTab === 'batch' && (
                  <div className="space-y-1">
                    <div className="font-bold text-slate-800 py-1 px-1.5 bg-slate-50 rounded flex items-center gap-1.5 border border-slate-200">
                      <ChevronDown className="size-3.5 text-[#1677ff]" />
                      <span>产品批次追溯目录</span>
                    </div>

                    <div className="ml-2 pl-2 border-l border-slate-200 space-y-1 mt-1">
                      <div>
                        <div
                          onClick={() => {
                            toggleNode('batch_odfs')
                            setSelectedBatchProduct('ODFS-334MVA/500kV')
                          }}
                          className={cn(
                            'p-1.5 rounded flex items-center justify-between cursor-pointer',
                            selectedBatchProduct === 'ODFS-334MVA/500kV' ? 'bg-blue-50 text-[#1677ff] font-bold' : 'text-slate-700 hover:bg-slate-50'
                          )}
                        >
                          <div className="flex items-center gap-1">
                            {expandedNodes.batch_odfs ? <ChevronDown className="size-3 text-slate-400" /> : <ChevronRight className="size-3 text-slate-400" />}
                            <span className="font-mono">ODFS-334MVA/500kV</span>
                          </div>
                          <span className="text-[10px] text-red-600 font-bold">当期异常</span>
                        </div>
                        {expandedNodes.batch_odfs && (
                          <div className="ml-4 pl-2 border-l border-slate-100 space-y-0.5 mt-0.5 text-[11px]">
                            <div className="py-0.5 px-1 rounded text-red-600 font-bold bg-red-50">🏷️ #202608 批次 (突增 +24.5%) 🔴</div>
                            <div className="py-0.5 px-1 rounded text-slate-600">🏷️ #202607 批次 (正常)</div>
                            <div className="py-0.5 px-1 rounded text-slate-600">🏷️ #202606 批次 (正常)</div>
                          </div>
                        )}
                      </div>

                      <div
                        onClick={() => setSelectedBatchProduct('SZ-110kV/63000kVA')}
                        className={cn(
                          'p-1.5 rounded cursor-pointer',
                          selectedBatchProduct === 'SZ-110kV/63000kVA' ? 'bg-blue-50 text-[#1677ff] font-bold' : 'text-slate-700 hover:bg-slate-50'
                        )}
                      >
                        <span className="font-mono">SZ-110kV/63000kVA</span>
                      </div>
                    </div>
                  </div>
                )}
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
                <span className="text-slate-400">💡 点击【显示明细】可滑出 6 大深度工序能碳诊断与闭环工单抽屉</span>
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
      {/* 🌟 工业级 6 大深度板块：工序能碳全景诊断与闭环抽屉 (Drawer) */}
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
                      {selectedDrawerEntity.name} · 工序能碳全景诊断明细
                    </h2>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-[#1677ff] font-bold font-mono">
                      诊断报告 2026-08
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    主体：{selectedDrawerEntity.pic || '特变电工基地'} · 产线自动化与动力装备诊断
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`已成功导出《${selectedDrawerEntity.name}能碳诊断与消缺建议报告(2026-08)》PDF 文件！`)}
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

            {/* 抽屉内容主体 (6 大板块滚动区) */}
            <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* 工单下发成功浮层 */}
              {ticketCreated && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <CheckCheck className="size-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold block">整改工单已成功下发至生产动力运维系统！</span>
                    <span className="text-[11px] text-emerald-700 font-mono">工单编号: #GD-202608-019 · 指派责任人: 特变电工动力装备部主管 (3个工作日内消缺)</span>
                  </div>
                </div>
              )}

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

              {/* 板块 4: 车间工序能流与设备负荷下钻 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-slate-800 font-bold border-b border-slate-100 pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Cog className="size-4 text-[#1677ff]" />
                    4. 车间重点工序能流与能耗占比
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">责任落实到车间</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5">
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

              {/* 板块 5: 现场关键设备实时测点与遥测数据 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-slate-800 font-bold border-b border-slate-100 pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="size-4 text-[#1677ff]" />
                    5. 异常设备现场实时测点遥测诊断
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">现场 SCADA / IoT 遥测</span>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden font-mono">
                  <table className="w-full text-[11px] text-left">
                    <thead className="bg-slate-100 text-slate-600 font-sans font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2">测点编号</th>
                        <th className="p-2 font-sans">监测参数描述</th>
                        <th className="p-2 text-right">实时遥测值</th>
                        <th className="p-2 text-right">设计限值</th>
                        <th className="p-2 font-sans text-center">诊断结论</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {(selectedDrawerEntity.sensors || [
                        { tag: 'TT-204', desc: '2号真空干燥罐壁温', val: '142 ℃', limit: '128 ℃', status: '🔴 异常偏高 (漏热)' },
                        { tag: 'ST-02', desc: '干燥罐蒸汽疏水阀', val: '开度 85% 常开', limit: '脉动排汽', status: '🔴 阀芯卡死微漏' },
                        { tag: 'VF-01', desc: '试验大厅变频机组待机', val: '42 kW', limit: '0 kW', status: '🟡 空载未停机' },
                        { tag: 'FLOW-03', desc: '蒸汽总管实时流量', val: '5.8 t/h', limit: '4.2 t/h', status: '🔴 超标 38%' },
                      ]).map((s: any) => (
                        <tr key={s.tag} className="hover:bg-slate-50">
                          <td className="p-2 font-bold text-[#1677ff]">{s.tag}</td>
                          <td className="p-2 font-sans text-slate-700">{s.desc}</td>
                          <td className="p-2 text-right font-bold text-slate-900">{s.val}</td>
                          <td className="p-2 text-right text-slate-400">{s.limit}</td>
                          <td className="p-2 font-sans text-center">
                            <span className={cn('px-1.5 py-0.2 rounded font-bold text-[10px]', s.status.includes('🔴') ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-slate-100 text-slate-600')}>
                              {s.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 板块 6: 优化建议与闭环管理 (ROI 效益测算) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-slate-800 font-bold border-b border-slate-100 pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Wrench className="size-4 text-[#1677ff]" />
                    6. 降碳节能治理对策与 ROI 效益测算
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold">年节约潜力 150+ 万元</span>
                </div>

                <div className="space-y-2">
                  {(selectedDrawerEntity.actions || [
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
                  ]).map((act: any, idx: number) => (
                    <div key={idx} className="p-3 bg-red-50/80 rounded-lg border border-red-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 font-sans flex items-center gap-1.5">
                          <span className="size-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold">
                            {idx + 1}
                          </span>
                          {act.title}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-100 text-red-700 border border-red-300">
                          {act.priority}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-sans pl-5">
                        <strong>预计效益：</strong>{act.roi}
                      </p>
                    </div>
                  ))}
                </div>
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
