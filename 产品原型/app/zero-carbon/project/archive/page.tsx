'use client'

import React, { useState, useMemo } from 'react'
import {
  FolderKanban,
  Plus,
  Search,
  Building2,
  CheckCircle2,
  Calendar,
  Layers,
  Coins,
  Sun,
  BatteryCharging,
  Flame,
  Zap,
  Download,
  X,
  ExternalLink,
  FileText,
  Clock,
  Filter,
  Paperclip,
  TrendingUp,
  Tag,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  UploadCloud,
  ChevronRight,
  Sparkles,
  Check,
  FileCheck2,
  ShieldCheck,
  DollarSign,
  Leaf,
  Activity,
} from 'lucide-react'
import { StandardOrgTree, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { cn } from '@/lib/utils'

export interface ProjectArchiveItem {
  id: string
  code: string
  name: string
  park: string
  company: string
  category: '节能技改' | '绿电替代' | '储能配置'
  subType: string // 细分技术路线，如 屋顶分布式光伏、用户侧磷酸铁锂、永磁变频、真空余热利用
  capacity: string
  investment: number // 万元
  fundSource: '自筹资金' | '绿色金融信贷' | 'EMC合同能源管理' | '政府专项绿色补贴'
  leaderName: string
  leaderPhone: string
  milestoneApproval: string
  milestoneStart: string
  milestoneGrid: string // 并网/投运日期
  expectedEnergySaving: string // 节电/年发电量
  annualCarbonSaving: number // tCO2/年
  annualRevenue: number // 万元/年
  paybackYears: number // 静态回收期(年)
  irr: string // 预期IRR
  status: '规划批复' | '在建施工' | '并网稳定运行' | '维护优化'
  attachments: { name: string; size: string; type: string; uploadTime: string }[]
  remark?: string
}

// 初始统一零碳项目库预设数据 (覆盖 15 大园区与直属公司)
const INITIAL_PROJECTS: ProjectArchiveItem[] = [
  {
    id: 'p-01',
    code: 'PRJ-2026-PV-001',
    name: '特变电工沈阳变压器厂区 12.8MWp 屋顶分布式光伏一期',
    park: '特变电工东北输变电产业园',
    company: '沈变公司',
    category: '绿电替代',
    subType: '屋顶分布式光伏 (BAPV)',
    capacity: '12.8 MWp',
    investment: 4850.0,
    fundSource: '自筹资金',
    leaderName: '张建国 (能源部)',
    leaderPhone: '138****5621',
    milestoneApproval: '2025-03-15',
    milestoneStart: '2025-05-10',
    milestoneGrid: '2025-11-28',
    expectedEnergySaving: '1,420 万kWh/年',
    annualCarbonSaving: 8098.0,
    annualRevenue: 852.0,
    paybackYears: 5.7,
    irr: '14.2%',
    status: '并网稳定运行',
    attachments: [
      { name: '沈变光伏一期可行性研究报告_v2.pdf', size: '8.4 MB', type: 'PDF', uploadTime: '2025-03-16' },
      { name: '国网辽宁省电力接入系统并网批复意见书.pdf', size: '2.1 MB', type: 'PDF', uploadTime: '2025-04-12' },
      { name: 'EPC工程总承包施工竣工验收单.pdf', size: '4.6 MB', type: 'PDF', uploadTime: '2025-11-30' },
    ],
    remark: '利用 1#、2#、3# 超高压装配车间屋顶建设，自发自用比例 92%',
  },
  {
    id: 'p-02',
    code: 'PRJ-2026-ES-002',
    name: '衡阳变压器公司 6MW/12MWh 磷酸铁锂用户侧储能电站',
    park: '特变电工南方输变电产业园',
    company: '衡变公司',
    category: '储能配置',
    subType: '用户侧磷酸铁锂储能',
    capacity: '6MW / 12MWh',
    investment: 1680.0,
    fundSource: '绿色金融信贷',
    leaderName: '李伟 (装备动力部)',
    leaderPhone: '139****8832',
    milestoneApproval: '2025-06-20',
    milestoneStart: '2025-08-01',
    milestoneGrid: '2025-12-15',
    expectedEnergySaving: '年充放电量 720 万kWh',
    annualCarbonSaving: 2160.0,
    annualRevenue: 345.0,
    paybackYears: 4.9,
    irr: '16.8%',
    status: '并网稳定运行',
    attachments: [
      { name: '衡变储能项目安全评估与消防验收报告.pdf', size: '12.3 MB', type: 'PDF', uploadTime: '2025-12-16' },
      { name: '峰谷时段套利策略运行方案.docx', size: '1.2 MB', type: 'Word', uploadTime: '2025-12-10' },
    ],
    remark: '执行两充两放策略，有效平抑变压器冲击负荷试验峰值',
  },
  {
    id: 'p-03',
    code: 'PRJ-2026-WH-003',
    name: '天津变压器真空干燥罐冷凝余热梯级利用改造',
    park: '特变电工天变产业园',
    company: '天变公司',
    category: '节能技改',
    subType: '工业余热蒸汽梯级回收',
    capacity: '1.8 MWth (热功率)',
    investment: 380.0,
    fundSource: '自筹资金',
    leaderName: '王工 (技改办)',
    leaderPhone: '135****4421',
    milestoneApproval: '2025-09-10',
    milestoneStart: '2025-10-15',
    milestoneGrid: '2026-02-20',
    expectedEnergySaving: '节约工业蒸汽 3,600 t/年',
    annualCarbonSaving: 1440.0,
    annualRevenue: 98.0,
    paybackYears: 3.9,
    irr: '21.5%',
    status: '并网稳定运行',
    attachments: [
      { name: '煤化工与机械热力平衡测试报告.pdf', size: '5.2 MB', type: 'PDF', uploadTime: '2026-02-25' },
    ],
    remark: '回收煤油气相干燥系统余热，冬季替代办公与车间采暖蒸汽',
  },
  {
    id: 'p-04',
    code: 'PRJ-2026-VF-004',
    name: '山东鲁能泰山电缆连续挤塑线永磁变频节能技改',
    park: '特变电工华东输变电科技产业园',
    company: '鲁缆公司',
    category: '节能技改',
    subType: '永磁同步变频电机替换',
    capacity: '48 台套电机替换',
    investment: 290.0,
    fundSource: 'EMC合同能源管理',
    leaderName: '赵明 (生产车间)',
    leaderPhone: '137****9012',
    milestoneApproval: '2025-11-05',
    milestoneStart: '2026-01-10',
    milestoneGrid: '2026-04-18',
    expectedEnergySaving: '节电 185 万kWh/年',
    annualCarbonSaving: 1055.0,
    annualRevenue: 125.0,
    paybackYears: 2.3,
    irr: '32.0%',
    status: '并网稳定运行',
    attachments: [
      { name: 'IE5超高效永磁电机测试报告.pdf', size: '3.1 MB', type: 'PDF', uploadTime: '2026-04-20' },
    ],
    remark: '将原 IE2 异步电机全部置换为 IE5 永磁同步变频电机，综合节电率 18.5%',
  },
  {
    id: 'p-05',
    code: 'PRJ-2026-HP-005',
    name: '德阳电缆产业园高温工业水源热泵蒸汽替代项目',
    park: '特变电工(德阳)电缆园区',
    company: '德缆公司',
    category: '绿电替代',
    subType: '地源/水源热泵蒸汽替代',
    capacity: '2.5 MW (制热量)',
    investment: 620.0,
    fundSource: '绿色金融信贷',
    leaderName: '陈志强 (动力厂)',
    leaderPhone: '136****7721',
    milestoneApproval: '2026-01-15',
    milestoneStart: '2026-03-01',
    milestoneGrid: '2026-09-30',
    expectedEnergySaving: '替代天然气 45 万m³/年',
    annualCarbonSaving: 975.0,
    annualRevenue: 168.0,
    paybackYears: 3.7,
    irr: '23.4%',
    status: '在建施工',
    attachments: [
      { name: '地质勘探与地下水温场测试报告.pdf', size: '9.8 MB', type: 'PDF', uploadTime: '2026-03-05' },
    ],
    remark: '土建基础已完成 85%，主机设备已进场吊装',
  },
  {
    id: 'p-06',
    code: 'PRJ-2026-MG-006',
    name: '新疆电缆智慧微电网 EMS 与柔性负荷控制系统',
    park: '特变电工新疆电缆产业园',
    company: '新缆厂',
    category: '节能技改',
    subType: '微电网智能协同节电系统',
    capacity: '全厂 35kV 变电站接入',
    investment: 450.0,
    fundSource: '自筹资金',
    leaderName: '孙亮 (信息化部)',
    leaderPhone: '133****1154',
    milestoneApproval: '2026-02-18',
    milestoneStart: '2026-04-10',
    milestoneGrid: '2026-10-30',
    expectedEnergySaving: '降低线损与调峰 95 万kWh/年',
    annualCarbonSaving: 540.0,
    annualRevenue: 86.0,
    paybackYears: 5.2,
    irr: '15.6%',
    status: '在建施工',
    attachments: [
      { name: '微电网协调控制策略技术协议.pdf', size: '4.5 MB', type: 'PDF', uploadTime: '2026-04-12' },
    ],
    remark: '正在进行二次保护测控屏与 EMS 服务器组网调试',
  },
  {
    id: 'p-07',
    code: 'PRJ-2026-PV-007',
    name: '新疆特变电工变压器厂区 20MWp 分布式光伏三期',
    park: '特变电工新疆产业园',
    company: '新变厂',
    category: '绿电替代',
    subType: '屋顶及车棚光伏 (BAPV)',
    capacity: '20.0 MWp',
    investment: 7600.0,
    fundSource: '绿色金融信贷',
    leaderName: '郭建平 (基建处)',
    leaderPhone: '138****9922',
    milestoneApproval: '2026-03-01',
    milestoneStart: '2026-05-15',
    milestoneGrid: '2026-11-15',
    expectedEnergySaving: '2,600 万kWh/年',
    annualCarbonSaving: 14820.0,
    annualRevenue: 1350.0,
    paybackYears: 5.6,
    irr: '14.8%',
    status: '在建施工',
    attachments: [
      { name: '新变光伏三期环评批复与可研报告.pdf', size: '14.2 MB', type: 'PDF', uploadTime: '2026-03-10' },
    ],
    remark: '目前正在进行钢结构屋顶荷载加固与支架安装',
  },
  {
    id: 'p-08',
    code: 'PRJ-2026-MC-008',
    name: '天津变压器空压机房磁悬浮离心空压机节能替代',
    park: '特变电工天变产业园',
    company: '天变公司',
    category: '节能技改',
    subType: '磁悬浮无油离心空压机',
    capacity: '3 台套 (总气量 180m³/min)',
    investment: 210.0,
    fundSource: 'EMC合同能源管理',
    leaderName: '刘涛 (动力车间)',
    leaderPhone: '139****3341',
    milestoneApproval: '2026-04-10',
    milestoneStart: '2026-06-01',
    milestoneGrid: '2026-08-15',
    expectedEnergySaving: '节电 120 万kWh/年',
    annualCarbonSaving: 684.0,
    annualRevenue: 78.0,
    paybackYears: 2.7,
    irr: '28.5%',
    status: '并网稳定运行',
    attachments: [
      { name: '空压站气电比节能实测对比报告.pdf', size: '3.8 MB', type: 'PDF', uploadTime: '2026-08-18' },
    ],
    remark: '单位产气电耗由 0.135 kWh/m³ 下降至 0.098 kWh/m³',
  },
]

export default function ProjectArchivePage() {
  const [selectedNode, setSelectedNode] = useState<StandardOrgNode>({
    id: 'group_root',
    name: '电装集团',
    fullName: '电装集团',
    level: 'group',
    badge: '全集团',
  })

  const [projects, setProjects] = useState<ProjectArchiveItem[]>(INITIAL_PROJECTS)
  const [searchKw, setSearchKw] = useState('')
  const [companyFilter, setCompanyFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // 弹窗状态
  const [showFormModal, setShowFormModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formStep, setFormStep] = useState<1 | 2 | 3 | 4>(1)
  const [detailProject, setDetailProject] = useState<ProjectArchiveItem | null>(null)

  // 表单状态 (支持 4 大类完整字段维护)
  const [formData, setFormData] = useState({
    code: `PRJ-2026-${Math.floor(100 + Math.random() * 900)}`,
    name: '',
    park: '特变电工东北输变电产业园',
    company: '沈变公司',
    category: '绿电替代' as ProjectArchiveItem['category'],
    subType: '屋顶分布式光伏 (BAPV)',
    capacity: '',
    investment: '',
    fundSource: '自筹资金' as ProjectArchiveItem['fundSource'],
    leaderName: '张工',
    leaderPhone: '13800000000',
    milestoneApproval: '2026-05-01',
    milestoneStart: '2026-06-01',
    milestoneGrid: '2026-12-31',
    expectedEnergySaving: '',
    annualCarbonSaving: '',
    annualRevenue: '',
    irr: '15.0%',
    status: '规划批复' as ProjectArchiveItem['status'],
    remark: '',
    attachments: [
      { name: '项目立项可研及批复文件包.pdf', size: '6.8 MB', type: 'PDF', uploadTime: '2026-08-28' },
    ],
  })

  // 打开新增项目表单
  const handleOpenCreateModal = () => {
    setIsEditing(false)
    setEditingId(null)
    setFormStep(1)
    setFormData({
      code: `PRJ-2026-${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      park: selectedNode.fullName.includes('园区') ? selectedNode.fullName : '特变电工东北输变电产业园',
      company: selectedNode.level === 'company' ? selectedNode.name : '沈变公司',
      category: '绿电替代',
      subType: '屋顶分布式光伏 (BAPV)',
      capacity: '',
      investment: '',
      fundSource: '自筹资金',
      leaderName: '张工',
      leaderPhone: '13800000000',
      milestoneApproval: '2026-05-01',
      milestoneStart: '2026-06-01',
      milestoneGrid: '2026-12-31',
      expectedEnergySaving: '',
      annualCarbonSaving: '',
      annualRevenue: '',
      irr: '15.0%',
      status: '规划批复',
      remark: '',
      attachments: [
        { name: '项目立项可研及批复文件包.pdf', size: '6.8 MB', type: 'PDF', uploadTime: '2026-08-28' },
      ],
    })
    setShowFormModal(true)
  }

  // 打开编辑项目表单
  const handleOpenEditModal = (item: ProjectArchiveItem) => {
    setIsEditing(true)
    setEditingId(item.id)
    setFormStep(1)
    setFormData({
      code: item.code,
      name: item.name,
      park: item.park,
      company: item.company,
      category: item.category,
      subType: item.subType,
      capacity: item.capacity,
      investment: String(item.investment),
      fundSource: item.fundSource,
      leaderName: item.leaderName,
      leaderPhone: item.leaderPhone,
      milestoneApproval: item.milestoneApproval,
      milestoneStart: item.milestoneStart,
      milestoneGrid: item.milestoneGrid,
      expectedEnergySaving: item.expectedEnergySaving,
      annualCarbonSaving: String(item.annualCarbonSaving),
      annualRevenue: String(item.annualRevenue),
      irr: item.irr,
      status: item.status,
      remark: item.remark || '',
      attachments: [...item.attachments],
    })
    setShowFormModal(true)
  }

  // 删除项目档案
  const handleDeleteProject = (id: string, name: string) => {
    if (confirm(`确定要删除项目档案【${name}】吗？删除后将不可恢复。`)) {
      setProjects((prev) => prev.filter((p) => p.id !== id))
      if (detailProject?.id === id) setDetailProject(null)
    }
  }

  // 保存（新增/编辑）项目
  const handleSaveProject = () => {
    if (!formData.name || !formData.capacity || !formData.investment) {
      alert('请完整填写项目名称、建设容量与总投资额！')
      return
    }

    const inv = parseFloat(formData.investment) || 0
    const rev = parseFloat(formData.annualRevenue) || 0
    const payback = rev > 0 ? Number((inv / rev).toFixed(1)) : 0

    if (isEditing && editingId) {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id === editingId) {
            return {
              ...p,
              name: formData.name,
              park: formData.park,
              company: formData.company,
              category: formData.category,
              subType: formData.subType,
              capacity: formData.capacity,
              investment: inv,
              fundSource: formData.fundSource,
              leaderName: formData.leaderName,
              leaderPhone: formData.leaderPhone,
              milestoneApproval: formData.milestoneApproval,
              milestoneStart: formData.milestoneStart,
              milestoneGrid: formData.milestoneGrid,
              expectedEnergySaving: formData.expectedEnergySaving || '按实测统计',
              annualCarbonSaving: parseFloat(formData.annualCarbonSaving) || 0,
              annualRevenue: rev,
              paybackYears: payback || p.paybackYears,
              irr: formData.irr,
              status: formData.status,
              attachments: formData.attachments,
              remark: formData.remark,
            }
          }
          return p
        })
      )
      alert(`零碳项目档案【${formData.name}】已成功更新并重新汇算！`)
    } else {
      const newItem: ProjectArchiveItem = {
        id: `p-${Date.now()}`,
        code: formData.code,
        name: formData.name,
        park: formData.park,
        company: formData.company,
        category: formData.category,
        subType: formData.subType,
        capacity: formData.capacity,
        investment: inv,
        fundSource: formData.fundSource,
        leaderName: formData.leaderName,
        leaderPhone: formData.leaderPhone,
        milestoneApproval: formData.milestoneApproval,
        milestoneStart: formData.milestoneStart,
        milestoneGrid: formData.milestoneGrid,
        expectedEnergySaving: formData.expectedEnergySaving || '待测算',
        annualCarbonSaving: parseFloat(formData.annualCarbonSaving) || 0,
        annualRevenue: rev,
        paybackYears: payback || 4.5,
        irr: formData.irr || '14.5%',
        status: formData.status,
        attachments: formData.attachments,
        remark: formData.remark,
      }
      setProjects([newItem, ...projects])
      alert(`新零碳项目【${newItem.name}】已成功入库并生成统一档案编号：${newItem.code}`)
    }

    setShowFormModal(false)
  }

  // 模拟附件添加
  const handleAddMockAttachment = () => {
    const names = [
      '特高压装备微电网专项并网安全核准意见书.pdf',
      '节能技改设备验收报告及节电实测单.pdf',
      '绿色金融低碳贷款放款审批单.pdf',
      'EPC工程质量保修及运维技术协议.docx',
    ]
    const randomName = names[Math.floor(Math.random() * names.length)]
    const newAtt = {
      name: randomName,
      size: `${(Math.random() * 8 + 1).toFixed(1)} MB`,
      type: randomName.endsWith('.docx') ? 'Word' : 'PDF',
      uploadTime: '2026-08-28',
    }
    setFormData({
      ...formData,
      attachments: [...formData.attachments, newAtt],
    })
  }

  // 过滤数据 (直属单位 + 类别 + 状态 + 关键字)
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (companyFilter !== 'all') {
        const cleanKey = companyFilter.replace('公司', '').replace('厂', '').replace('本部', '')
        const match =
          p.company === companyFilter ||
          p.company.includes(companyFilter) ||
          p.company.includes(cleanKey) ||
          p.name.includes(companyFilter) ||
          p.name.includes(cleanKey) ||
          (p.park && p.park.includes(cleanKey))
        if (!match) return false
      }
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false
      if (statusFilter !== 'all' && p.status !== statusFilter) return false
      if (
        searchKw &&
        !p.name.toLowerCase().includes(searchKw.toLowerCase()) &&
        !p.code.toLowerCase().includes(searchKw.toLowerCase()) &&
        !p.company.toLowerCase().includes(searchKw.toLowerCase()) &&
        !p.subType.toLowerCase().includes(searchKw.toLowerCase())
      ) {
        return false
      }
      return true
    })
  }, [projects, companyFilter, categoryFilter, statusFilter, searchKw])

  // 汇总统计 KPI (全集团/所选单位自动汇算)
  const stats = useMemo(() => {
    const totalCount = filteredProjects.length
    const totalInvestment = filteredProjects.reduce((acc, p) => acc + p.investment, 0)
    const totalCarbonSaving = filteredProjects.reduce((acc, p) => acc + p.annualCarbonSaving, 0)
    const totalRevenue = filteredProjects.reduce((acc, p) => acc + p.annualRevenue, 0)
    const runningCount = filteredProjects.filter((p) => p.status === '并网稳定运行').length
    const buildingCount = filteredProjects.filter((p) => p.status === '在建施工').length
    const planCount = filteredProjects.filter((p) => p.status === '规划批复').length

    return {
      totalCount,
      totalInvestment,
      totalCarbonSaving,
      totalRevenue,
      runningCount,
      buildingCount,
      planCount,
    }
  }, [filteredProjects])

  const getCategoryIcon = (category: ProjectArchiveItem['category']) => {
    switch (category) {
      case '绿电替代':
        return <Sun className="size-5 text-amber-500" />
      case '储能配置':
        return <BatteryCharging className="size-5 text-emerald-500" />
      case '节能技改':
        return <Zap className="size-5 text-blue-500" />
      case '智慧微网':
        return <Layers className="size-5 text-purple-500" />
      default:
        return <FolderKanban className="size-5 text-[#1677ff]" />
    }
  }

  const getCategoryBadge = (category: ProjectArchiveItem['category']) => {
    switch (category) {
      case '绿电替代':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-bold">
            <Sun className="size-3 text-amber-600" />
            绿电替代
          </span>
        )
      case '储能配置':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
            <BatteryCharging className="size-3 text-emerald-600" />
            储能配置
          </span>
        )
      case '节能技改':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold">
            <Zap className="size-3 text-blue-600" />
            节能技改
          </span>
        )
      case '智慧微网':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-bold">
            <Layers className="size-3 text-purple-600" />
            智慧微网
          </span>
        )
    }
  }

  return (
    <div className="space-y-3.5 font-sans text-slate-800">
      <div className="flex flex-col gap-3.5">
        {/* 1. 顶部 Header (标题 + 导出项目库 + 在线填报新项目) */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
              <FolderKanban className="size-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800">项目档案管理</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert(`已成功导出【${selectedNode.name}】零碳项目库台账清单 (Excel)...`)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Download className="size-3.5 text-slate-500" />
              导出
            </button>
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="px-3.5 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="size-4" />
              在线填报新项目
            </button>
          </div>
        </div>

        {/* 2. 筛选与多维过滤 Toolbar (三大技术类别 + 状态 + 搜索) */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* 四大技术类别快速切换 */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-sans">
              {[
                { key: 'all', label: '全部项目库' },
                { key: '节能技改', label: '⚡ 节能技改' },
                { key: '绿电替代', label: '☀️ 绿电替代' },
                { key: '储能配置', label: '🔋 储能配置' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setCategoryFilter(tab.key)}
                  className={cn(
                    'px-3 py-1.5 rounded-md transition-all cursor-pointer font-medium text-xs',
                    categoryFilter === tab.key
                      ? 'bg-white text-[#1677ff] font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 直属单位过滤 (纯企业结构树层级) */}
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:border-blue-500 font-medium"
            >
              <option value="all">全部所属单位 (全集团)</option>
              <optgroup label="🏢 沈变公司 (一级单位)">
                <option value="沈变公司">沈变公司 (全部)</option>
                <option value="沈变本部">└ 沈变本部</option>
                <option value="露娜公司">└ 露娜公司 (特变电工露娜智能)</option>
                <option value="智慧能源">└ 智慧能源</option>
                <option value="和新套管公司">└ 和新套管公司</option>
                <option value="康嘉互感器">└ 康嘉互感器</option>
                <option value="印能公司">└ 印能公司</option>
              </optgroup>
              <optgroup label="🏢 衡变公司 (一级单位)">
                <option value="衡变公司">衡变公司 (全部)</option>
                <option value="衡变本部">└ 衡变本部</option>
                <option value="南京电研">└ 南京电研</option>
                <option value="云集电气">└ 云集电气</option>
                <option value="湖南电气">└ 湖南电气</option>
                <option value="云集高压开关">└ 云集高压开关</option>
                <option value="新疆自控">└ 新疆自控</option>
                <option value="特能建">└ 特能建</option>
                <option value="合容电气">└ 合容电气</option>
                <option value="赛杰爱迪">└ 赛杰爱迪</option>
              </optgroup>
              <optgroup label="🏢 新变厂 (一级单位)">
                <option value="新变厂">新变厂 (全部)</option>
                <option value="超高压公司">└ 超高压公司</option>
                <option value="天变公司">└ 天变公司</option>
                <option value="智能电气公司">└ 智能电气公司</option>
                <option value="京津冀公司">└ 京津冀公司</option>
                <option value="珠峰硅钢">└ 珠峰硅钢</option>
                <option value="银利电气">└ 银利电气</option>
              </optgroup>
              <optgroup label="🏢 鲁缆公司 (一级单位)">
                <option value="鲁缆公司">鲁缆公司 (全部)</option>
                <option value="鲁缆本部">└ 鲁缆本部</option>
                <option value="智缆公司">└ 智缆公司</option>
                <option value="昭和公司">└ 昭和公司</option>
                <option value="曙光公司">└ 曙光公司</option>
              </optgroup>
              <optgroup label="🏢 新缆厂 (一级单位)">
                <option value="新缆厂">新缆厂 (全部)</option>
                <option value="特变电工新疆电缆有限公司">└ 特变电工新疆电缆有限公司</option>
                <option value="特变电工新疆线缆厂">└ 特变电工新疆线缆厂</option>
              </optgroup>
              <optgroup label="🏢 德缆公司 (一级单位)">
                <option value="德缆公司">德缆公司 (全部)</option>
                <option value="特变电工（德阳）电缆股份有限公司">└ 特变电工（德阳）电缆股份有限公司</option>
              </optgroup>
            </select>

            {/* 状态过滤 */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:border-blue-500 font-medium"
            >
              <option value="all">全部建设状态</option>
              <option value="并网稳定运行">并网稳定运行</option>
              <option value="在建施工">在建施工</option>
              <option value="规划批复">规划批复</option>
            </select>
          </div>

          {/* 模糊搜索框 */}
          <div className="relative">
            <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索项目编码 / 名称 / 填报单位 / 技术细分..."
              value={searchKw}
              onChange={(e) => setSearchKw(e.target.value)}
              className="h-8 pl-8 pr-3 w-64 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-all font-mono"
            />
          </div>
        </div>

        {/* 4. 项目主数据表格卡片 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-[#fafbfc]">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#1677ff]" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                特变电工统一零碳项目全景台账档案库
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-[#1677ff] font-mono font-bold">
                已自动汇总 {filteredProjects.length} 个项目
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono">点击任意行可查看详细档案与附件批复</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse font-mono">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold font-sans border-b border-slate-200">
                  <th className="py-2.5 px-3 min-w-[220px]">项目全称</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">技术主类</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">所属直属单位 / 园区</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">建设规模容量</th>
                  <th className="py-2.5 px-3 whitespace-nowrap text-right">总投资 (万元)</th>
                  <th className="py-2.5 px-3 whitespace-nowrap text-right">年减碳 (tCO2)</th>
                  <th className="py-2.5 px-3 whitespace-nowrap text-right">年收益 (万元)</th>
                  <th className="py-2.5 px-3 whitespace-nowrap text-center">预期IRR</th>
                  <th className="py-2.5 px-3 whitespace-nowrap text-center">投运/并网日</th>
                  <th className="py-2.5 px-3 whitespace-nowrap text-center">建设状态</th>
                  <th className="py-2.5 px-3 whitespace-nowrap text-center">档案操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredProjects.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setDetailProject(item)}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 px-3 font-sans font-bold text-slate-900 group-hover:text-[#1677ff] transition-colors">
                      <div>{item.name}</div>
                    </td>
                    <td className="py-2.5 px-3 font-sans">{getCategoryBadge(item.category)}</td>
                    <td className="py-2.5 px-3 font-sans">
                      <div className="font-bold text-slate-800">{item.company}</div>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{item.capacity}</td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-slate-900">
                      ¥{item.investment.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-purple-700">
                      {item.annualCarbonSaving.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                      ¥{item.annualRevenue.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-[#1677ff]">{item.irr}</td>
                    <td className="py-2.5 px-3 text-center text-slate-600">{item.milestoneGrid}</td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-[10px] font-bold inline-block',
                          item.status === '并网稳定运行'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : item.status === '在建施工'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        )}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-sans" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => setDetailProject(item)}
                          className="p-1 rounded hover:bg-blue-100 text-slate-500 hover:text-[#1677ff] transition-colors"
                          title="查看完整档案"
                        >
                          <Eye className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1 rounded hover:bg-emerald-100 text-slate-500 hover:text-emerald-700 transition-colors"
                          title="在线维护更新"
                        >
                          <Edit className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(item.id, item.name)}
                          className="p-1 rounded hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors"
                          title="删除档案"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 🌟 5. 在线填报/维护零碳项目档案 4 步向导模态框 (Form Modal) */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200 font-sans">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-7xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-blue-50 text-[#1677ff] flex items-center justify-center border border-blue-200">
                  <FolderKanban className="size-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {isEditing ? '在线维护与更新零碳项目档案' : '新建零碳项目档案在线填报'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    填报单位：【{formData.company}】 · 自动同步至全集团统一项目库
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowFormModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* 4 步进度指示条 */}
            <div className="bg-slate-100/70 p-2.5 border-b border-slate-200 flex items-center justify-around text-xs">
              {[
                { step: 1, title: '1. 基本信息与单位归属' },
                { step: 2, title: '2. 技改类型与投资容量' },
                { step: 3, title: '3. 关键节点与预期效益' },
                { step: 4, title: '4. 附件上传与归档' },
              ].map((s) => (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => setFormStep(s.step as any)}
                  className={cn(
                    'flex items-center gap-1.5 font-bold px-3 py-1 rounded-lg transition-all cursor-pointer',
                    formStep === s.step
                      ? 'bg-white text-[#1677ff] shadow-xs'
                      : formStep > s.step
                      ? 'text-emerald-700'
                      : 'text-slate-400 hover:text-slate-600'
                  )}
                >
                  <span
                    className={cn(
                      'size-4.5 rounded-full flex items-center justify-center text-[10px]',
                      formStep === s.step
                        ? 'bg-[#1677ff] text-white'
                        : formStep > s.step
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-300 text-white'
                    )}
                  >
                    {formStep > s.step ? <Check className="size-3" /> : s.step}
                  </span>
                  {s.title}
                </button>
              ))}
            </div>

            {/* Modal Body (分步内容) */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Step 1: 项目基本信息 */}
              {formStep === 1 && (
                <div className="space-y-3.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-[#1677ff]" />
                      一、填报单位与项目基础定义
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">项目编码自动生成</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">项目编码 (档案唯一标识)</label>
                      <input
                        type="text"
                        disabled
                        value={formData.code}
                        className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-500 font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">实施经营单位 (填报主体) *</label>
                      <select
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full h-8 px-2.5 rounded-lg border border-slate-300 bg-white font-bold text-slate-800"
                      >
                        <optgroup label="🏢 沈变公司 (一级单位)">
                          <option value="沈变公司">沈变公司</option>
                          <option value="沈变本部">└ 沈变本部</option>
                          <option value="露娜公司">└ 露娜公司 (特变电工露娜智能)</option>
                          <option value="智慧能源">└ 智慧能源</option>
                          <option value="和新套管公司">└ 和新套管公司</option>
                          <option value="康嘉互感器">└ 康嘉互感器</option>
                          <option value="印能公司">└ 印能公司</option>
                        </optgroup>
                        <optgroup label="🏢 衡变公司 (一级单位)">
                          <option value="衡变公司">衡变公司</option>
                          <option value="衡变本部">└ 衡变本部</option>
                          <option value="南京电研">└ 南京电研</option>
                          <option value="云集电气">└ 云集电气</option>
                          <option value="湖南电气">└ 湖南电气</option>
                          <option value="云集高压开关">└ 云集高压开关</option>
                          <option value="新疆自控">└ 新疆自控</option>
                          <option value="特能建">└ 特能建</option>
                          <option value="合容电气">└ 合容电气</option>
                          <option value="赛杰爱迪">└ 赛杰爱迪</option>
                        </optgroup>
                        <optgroup label="🏢 新变厂 (一级单位)">
                          <option value="新变厂">新变厂</option>
                          <option value="超高压公司">└ 超高压公司</option>
                          <option value="天变公司">└ 天变公司</option>
                          <option value="智能电气公司">└ 智能电气公司</option>
                          <option value="京津冀公司">└ 京津冀公司</option>
                          <option value="珠峰硅钢">└ 珠峰硅钢</option>
                          <option value="银利电气">└ 银利电气</option>
                        </optgroup>
                        <optgroup label="🏢 鲁缆公司 (一级单位)">
                          <option value="鲁缆公司">鲁缆公司</option>
                          <option value="鲁缆本部">└ 鲁缆本部</option>
                          <option value="智缆公司">└ 智缆公司</option>
                          <option value="昭和公司">└ 昭和公司</option>
                          <option value="曙光公司">└ 曙光公司</option>
                        </optgroup>
                        <optgroup label="🏢 新缆厂 (一级单位)">
                          <option value="新缆厂">新缆厂</option>
                          <option value="特变电工新疆电缆有限公司">└ 特变电工新疆电缆有限公司</option>
                          <option value="特变电工新疆线缆厂">└ 特变电工新疆线缆厂</option>
                        </optgroup>
                        <optgroup label="🏢 德缆公司 (一级单位)">
                          <option value="德缆公司">德缆公司</option>
                          <option value="特变电工（德阳）电缆股份有限公司">└ 特变电工（德阳）电缆股份有限公司</option>
                        </optgroup>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-slate-700 font-medium mb-1">项目全称 *</label>
                      <input
                        type="text"
                        placeholder="例如：特变电工沈阳变压器厂区 15MWp 屋顶分布式光伏二期项目"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full h-8 px-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none text-slate-900 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">所属零碳产业园区 *</label>
                      <select
                        value={formData.park}
                        onChange={(e) => setFormData({ ...formData, park: e.target.value })}
                        className="w-full h-8 px-2.5 rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="特变电工东北输变电产业园">特变电工东北输变电产业园 (沈阳)</option>
                        <option value="特变电工南方输变电产业园">特变电工南方输变电产业园 (衡阳)</option>
                        <option value="特变电工新疆产业园">特变电工新疆产业园 (乌鲁木齐/昌吉)</option>
                        <option value="特变电工华东输变电科技产业园">特变电工华东输变电科技产业园 (新泰)</option>
                        <option value="特变电工天变产业园">特变电工天变产业园 (天津)</option>
                        <option value="特变电工(德阳)电缆园区">特变电工(德阳)电缆园区 (德阳)</option>
                        <option value="特变电工新疆电缆产业园">特变电工新疆电缆产业园</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-700 font-medium mb-1">项目负责人</label>
                        <input
                          type="text"
                          value={formData.leaderName}
                          onChange={(e) => setFormData({ ...formData, leaderName: e.target.value })}
                          className="w-full h-8 px-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-medium mb-1">联系电话</label>
                        <input
                          type="text"
                          value={formData.leaderPhone}
                          onChange={(e) => setFormData({ ...formData, leaderPhone: e.target.value })}
                          className="w-full h-8 px-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: 技改类型与投资容量 */}
              {formStep === 2 && (
                <div className="space-y-3.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-emerald-600" />
                      二、零碳技术路线、建设容量与资金投资
                    </span>
                    <span className="text-[11px] text-slate-400">支持 4 大类零碳技术</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">零碳项目主类别 *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => {
                          const cat = e.target.value as ProjectArchiveItem['category']
                          let defaultSub = '屋顶分布式光伏 (BAPV)'
                          if (cat === '储能配置') defaultSub = '用户侧磷酸铁锂储能'
                          if (cat === '节能技改') defaultSub = '永磁变频电机节能技改'
                          setFormData({ ...formData, category: cat, subType: defaultSub })
                        }}
                        className="w-full h-8 px-2.5 rounded-lg border border-slate-300 bg-white font-bold"
                      >
                        <option value="节能技改">⚡ 节能技改 (电机变频 / 余热梯级利用 / 磁悬浮)</option>
                        <option value="绿电替代">☀️ 绿电替代 (分布式光伏 / 风电 / 热泵)</option>
                        <option value="储能配置">🔋 储能配置 (用户侧电化学储能 / 飞轮)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">细分技术路线 / 工艺 *</label>
                      <input
                        type="text"
                        value={formData.subType}
                        onChange={(e) => setFormData({ ...formData, subType: e.target.value })}
                        className="w-full h-8 px-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">建设装机容量 / 规模 *</label>
                      <input
                        type="text"
                        placeholder="例如：12.8 MWp 或 6MW/12MWh 或 48台套"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        className="w-full h-8 px-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">总投资金额 (万元) *</label>
                      <input
                        type="number"
                        placeholder="例如：4850.0"
                        value={formData.investment}
                        onChange={(e) => setFormData({ ...formData, investment: e.target.value })}
                        className="w-full h-8 px-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none font-mono font-bold text-emerald-700"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-slate-700 font-medium mb-1">资金筹措来源</label>
                      <div className="grid grid-cols-4 gap-2">
                        {['自筹资金', '绿色金融信贷', 'EMC合同能源管理', '政府专项绿色补贴'].map((src) => (
                          <button
                            key={src}
                            type="button"
                            onClick={() => setFormData({ ...formData, fundSource: src as any })}
                            className={cn(
                              'p-2 rounded-lg border text-center transition-all cursor-pointer font-medium text-xs',
                              formData.fundSource === src
                                ? 'bg-blue-50 border-blue-300 text-[#1677ff] font-bold'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            )}
                          >
                            {src}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: 关键节点与预期效益 */}
              {formStep === 3 && (
                <div className="space-y-3.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-purple-600" />
                      三、关键里程碑节点与预期减排及收益
                    </span>
                    <span className="text-[11px] text-slate-400">自动测算投资回收期</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">立项批复日期</label>
                      <input
                        type="date"
                        value={formData.milestoneApproval}
                        onChange={(e) => setFormData({ ...formData, milestoneApproval: e.target.value })}
                        className="w-full h-8 px-2.5 rounded-lg border border-slate-300 bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">开工建设日期</label>
                      <input
                        type="date"
                        value={formData.milestoneStart}
                        onChange={(e) => setFormData({ ...formData, milestoneStart: e.target.value })}
                        className="w-full h-8 px-2.5 rounded-lg border border-slate-300 bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">并网 / 投产日期 *</label>
                      <input
                        type="date"
                        value={formData.milestoneGrid}
                        onChange={(e) => setFormData({ ...formData, milestoneGrid: e.target.value })}
                        className="w-full h-8 px-2.5 rounded-lg border border-slate-300 bg-white font-mono font-bold text-[#1677ff]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">预期年节电/发电量</label>
                      <input
                        type="text"
                        placeholder="例如：1,420 万kWh/年"
                        value={formData.expectedEnergySaving}
                        onChange={(e) => setFormData({ ...formData, expectedEnergySaving: e.target.value })}
                        className="w-full h-8 px-2.5 rounded-lg border border-slate-300 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">年减碳量 (tCO2/年) *</label>
                      <input
                        type="number"
                        placeholder="例如：8098.0"
                        value={formData.annualCarbonSaving}
                        onChange={(e) => setFormData({ ...formData, annualCarbonSaving: e.target.value })}
                        className="w-full h-8 px-2.5 rounded-lg border border-slate-300 font-mono font-bold text-purple-700"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">年收益/节费 (万元/年) *</label>
                      <input
                        type="number"
                        placeholder="例如：852.0"
                        value={formData.annualRevenue}
                        onChange={(e) => setFormData({ ...formData, annualRevenue: e.target.value })}
                        className="w-full h-8 px-2.5 rounded-lg border border-slate-300 font-mono font-bold text-emerald-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">预期内部收益率 (IRR)</label>
                      <input
                        type="text"
                        placeholder="例如：14.2%"
                        value={formData.irr}
                        onChange={(e) => setFormData({ ...formData, irr: e.target.value })}
                        className="w-full h-8 px-2.5 rounded-lg border border-slate-300 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">项目建设状态 *</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full h-8 px-2.5 rounded-lg border border-slate-300 bg-white font-bold"
                      >
                        <option value="规划批复">规划批复 (立项准备阶段)</option>
                        <option value="在建施工">在建施工 (工程安装中)</option>
                        <option value="并网稳定运行">并网稳定运行 (正式投运)</option>
                        <option value="维护优化">维护优化 (提效改造中)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: 附件上传与归档 */}
              {formStep === 4 && (
                <div className="space-y-3.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-amber-500" />
                      四、相关附件资料上传 (可研报告 / 并网批复 / 验收单)
                    </span>
                    <span className="text-[11px] text-slate-400">支持多附件自动归档</span>
                  </div>

                  {/* 拖拽上传区域 */}
                  <div
                    onClick={handleAddMockAttachment}
                    className="border-2 border-dashed border-blue-200 rounded-xl p-5 text-center bg-blue-50/30 hover:bg-blue-50/70 hover:border-blue-400 transition-all cursor-pointer space-y-1.5"
                  >
                    <UploadCloud className="size-8 text-[#1677ff] mx-auto" />
                    <p className="text-xs font-bold text-slate-800">
                      点击或拖拽上传项目资料附件
                    </p>
                    <p className="text-[11px] text-slate-500">
                      支持 PDF、Word (.docx)、Excel (.xlsx)、ZIP 文件，单个文件最大不超过 50MB
                    </p>
                    <span className="inline-block px-2.5 py-0.5 rounded bg-white border border-blue-200 text-[#1677ff] text-[10px] font-bold">
                      + 点击模拟添加一份立项批复文件
                    </span>
                  </div>

                  {/* 已上传附件清单 */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>已上传附件档案 ({formData.attachments.length})</span>
                      <span className="text-[11px] text-slate-400 font-mono">上传时间: 2026-08-28</span>
                    </div>

                    {formData.attachments.map((att, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="size-4 text-[#1677ff] shrink-0" />
                          <span className="font-medium text-slate-800 truncate">{att.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">({att.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              attachments: formData.attachments.filter((_, i) => i !== idx),
                            })
                          }}
                          className="text-rose-600 hover:text-rose-800 text-xs font-bold px-2 py-0.5 rounded hover:bg-rose-50 cursor-pointer"
                        >
                          移除
                        </button>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">备注说明</label>
                    <textarea
                      rows={2}
                      placeholder="录入其他需要向集团说明的技术参数或消纳策略..."
                      value={formData.remark}
                      onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer (上一步/下一步/提交) */}
            <div className="p-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                {formStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setFormStep((formStep - 1) as any)}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 bg-white hover:bg-slate-100 text-xs font-medium cursor-pointer"
                  >
                    上一步
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 bg-white hover:bg-slate-100 text-xs font-medium cursor-pointer"
                >
                  取消
                </button>

                {formStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => setFormStep((formStep + 1) as any)}
                    className="px-4 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    下一步
                    <ChevronRight className="size-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSaveProject}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    <Check className="size-3.5" />
                    {isEditing ? '保存修改并重新汇算' : '确认创建并入库'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

            {/* 🌟 6. 详情查看大弹窗 (Detail Modal, max-w-5xl 宽幅工业级 Bento 风格) */}
      {detailProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-200 font-sans">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-7xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50/90 via-blue-50/20 to-slate-50/90 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 min-w-0">
                <div className="size-12 rounded-2xl bg-white border border-blue-200/80 shadow-xs flex items-center justify-center shrink-0 text-[#1677ff] mt-0.5">
                  {getCategoryIcon(detailProject.category)}
                </div>
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-slate-900 leading-snug tracking-tight">
                      {detailProject.name}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-md font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {detailProject.code}
                    </span>
                    {getCategoryBadge(detailProject.category)}
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                      <Building2 className="size-3.5 text-slate-500" />
                      {detailProject.company} · {detailProject.park}
                    </span>
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full font-bold inline-flex items-center gap-1.5',
                        detailProject.status === '并网稳定运行'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : detailProject.status === '在建施工'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      )}
                    >
                      <span
                        className={cn(
                          'size-1.5 rounded-full',
                          detailProject.status === '并网稳定运行'
                            ? 'bg-emerald-500 animate-pulse'
                            : detailProject.status === '在建施工'
                            ? 'bg-blue-500'
                            : 'bg-amber-500'
                        )}
                      />
                      {detailProject.status}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailProject(null)}
                className="p-2 rounded-xl hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer shrink-0"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* 1. 4 大核心指标卡片 (Bento KPI Grid) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* 卡片 1: 建设装机容量 */}
                <div className="bg-gradient-to-br from-blue-50/40 via-white to-slate-50/50 p-4 rounded-xl border border-blue-100 shadow-2xs hover:shadow-xs transition-shadow">
                  <div className="flex items-center justify-between text-slate-500 font-medium mb-1.5">
                    <span className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Zap className="size-3.5 text-[#1677ff]" />
                      建设装机容量
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-[#1677ff] font-bold border border-blue-100">
                      装机规模
                    </span>
                  </div>
                  <div className="text-xl font-extrabold font-mono text-slate-900 tracking-tight">
                    {detailProject.capacity}
                  </div>
                  <div className="text-[11px] text-slate-500 font-sans border-t border-slate-100 pt-1.5 mt-2 truncate">
                    细分：<span className="text-slate-700 font-medium">{detailProject.subType}</span>
                  </div>
                </div>

                {/* 卡片 2: 总投资额 */}
                <div className="bg-gradient-to-br from-emerald-50/40 via-white to-slate-50/50 p-4 rounded-xl border border-emerald-100 shadow-2xs hover:shadow-xs transition-shadow">
                  <div className="flex items-center justify-between text-slate-500 font-medium mb-1.5">
                    <span className="flex items-center gap-1.5 text-xs text-slate-600">
                      <DollarSign className="size-3.5 text-emerald-600" />
                      总投资额 (CapEx)
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">
                      资金筹措
                    </span>
                  </div>
                  <div className="text-xl font-extrabold font-mono text-emerald-700 tracking-tight">
                    ¥{detailProject.investment.toLocaleString()}{' '}
                    <span className="text-xs font-semibold text-emerald-600">万元</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-sans border-t border-slate-100 pt-1.5 mt-2 truncate">
                    来源：<span className="text-slate-700 font-medium">{detailProject.fundSource}</span>
                  </div>
                </div>

                {/* 卡片 3: 年化碳减排 */}
                <div className="bg-gradient-to-br from-purple-50/40 via-white to-slate-50/50 p-4 rounded-xl border border-purple-100 shadow-2xs hover:shadow-xs transition-shadow">
                  <div className="flex items-center justify-between text-slate-500 font-medium mb-1.5">
                    <span className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Leaf className="size-3.5 text-purple-600" />
                      预期年化碳减排
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-bold border border-purple-100">
                      双碳贡献
                    </span>
                  </div>
                  <div className="text-xl font-extrabold font-mono text-purple-700 tracking-tight">
                    {detailProject.annualCarbonSaving.toLocaleString()}{' '}
                    <span className="text-xs font-semibold text-purple-600">tCO₂/年</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono border-t border-slate-100 pt-1.5 mt-2">
                    等效折标煤 <span className="text-slate-700 font-bold">{(detailProject.annualCarbonSaving * 0.214).toFixed(0)}</span> tce/年
                  </div>
                </div>

                {/* 卡片 4: 财务回报 */}
                <div className="bg-gradient-to-br from-amber-50/40 via-white to-slate-50/50 p-4 rounded-xl border border-amber-100 shadow-2xs hover:shadow-xs transition-shadow">
                  <div className="flex items-center justify-between text-slate-500 font-medium mb-1.5">
                    <span className="flex items-center gap-1.5 text-xs text-slate-600">
                      <TrendingUp className="size-3.5 text-amber-600" />
                      年预期收益 / 节费
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold border border-amber-100">
                      财务回报
                    </span>
                  </div>
                  <div className="text-xl font-extrabold font-mono text-amber-700 tracking-tight">
                    ¥{detailProject.annualRevenue.toLocaleString()}{' '}
                    <span className="text-xs font-semibold text-amber-600">万元/年</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono border-t border-slate-100 pt-1.5 mt-2 flex justify-between">
                    <span>回收期: <strong className="text-slate-800">{detailProject.paybackYears} 年</strong></span>
                    <span>IRR: <strong className="text-[#1677ff]">{detailProject.irr}</strong></span>
                  </div>
                </div>
              </div>

              {/* 2. 左右两栏深度详情网格 (7 : 5) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* 左栏 7 栅格：全周期实施进度 + 实施责任主体 + 能源与经济测算明细 */}
                <div className="lg:col-span-7 space-y-4">
                  {/* 里程碑时间轴 Stepper */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3.5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                        <div className="size-6 rounded-lg bg-blue-50 text-[#1677ff] flex items-center justify-center">
                          <Clock className="size-3.5" />
                        </div>
                        项目全周期实施关键里程碑
                      </h4>
                      <span className="text-[11px] text-slate-400 font-mono">全过程跟踪管控</span>
                    </div>

                    {/* Stepper Timeline with Progress Cards */}
                    <div className="grid grid-cols-3 gap-3">
                      {/* Milestone 1 */}
                      <div className="p-3 rounded-xl border border-slate-200/90 bg-slate-50/70 relative space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-slate-500 font-medium">1. 立项批复</span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700 text-[10px] font-bold">已完成</span>
                        </div>
                        <div className="font-mono font-bold text-slate-900 text-xs">
                          {detailProject.milestoneApproval}
                        </div>
                        <p className="text-[10px] text-slate-400">可研与投资决议批复</p>
                      </div>

                      {/* Milestone 2 */}
                      <div className="p-3 rounded-xl border border-blue-200/90 bg-blue-50/40 relative space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-blue-900 font-medium">2. 施工开工</span>
                          <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">工程交付</span>
                        </div>
                        <div className="font-mono font-bold text-slate-900 text-xs">
                          {detailProject.milestoneStart}
                        </div>
                        <p className="text-[10px] text-slate-400">设备进场与工程安装</p>
                      </div>

                      {/* Milestone 3 */}
                      <div className="p-3 rounded-xl border border-emerald-200/90 bg-emerald-50/50 relative space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-emerald-900 font-bold">3. 并网/投运生效</span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">正式投产</span>
                        </div>
                        <div className="font-mono font-bold text-emerald-700 text-xs">
                          {detailProject.milestoneGrid}
                        </div>
                        <p className="text-[10px] text-emerald-600/80">稳定运行与减排核算</p>
                      </div>
                    </div>
                  </div>

                  {/* 实施主体与管理责任 */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                        <div className="size-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <Building2 className="size-3.5" />
                        </div>
                        实施责任主体与属地管理
                      </h4>
                      <span className="text-[11px] text-slate-400 font-mono">组织与联系人</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="text-[11px] text-slate-500 block mb-0.5">实施经营单位</span>
                        <span className="font-bold text-slate-800 text-xs">{detailProject.company}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="text-[11px] text-slate-500 block mb-0.5">所属零碳园区</span>
                        <span className="font-bold text-slate-800 text-xs truncate block" title={detailProject.park}>
                          {detailProject.park}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="text-[11px] text-slate-500 block mb-0.5">项目责任人</span>
                        <span className="font-bold text-slate-800 text-xs">{detailProject.leaderName}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="text-[11px] text-slate-500 block mb-0.5">联系电话</span>
                        <span className="font-mono font-bold text-slate-800 text-xs">{detailProject.leaderPhone}</span>
                      </div>
                    </div>
                  </div>

                  {/* 能源消纳与经济效益参数明细 */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                        <div className="size-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <Activity className="size-3.5" />
                        </div>
                        能源消纳与经济效益参数明细
                      </h4>
                      <span className="text-[11px] text-slate-400 font-mono">财务测算模型</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 flex items-center justify-between">
                        <span className="text-slate-600">预期年节电 / 发电量：</span>
                        <span className="font-bold font-mono text-slate-900">{detailProject.expectedEnergySaving}</span>
                      </div>
                      <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 flex items-center justify-between">
                        <span className="text-slate-600">静态投资回收期：</span>
                        <span className="font-bold font-mono text-emerald-700">{detailProject.paybackYears} 年</span>
                      </div>
                      <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 flex items-center justify-between">
                        <span className="text-slate-600">项目内部收益率 (IRR)：</span>
                        <span className="font-bold font-mono text-[#1677ff]">{detailProject.irr}</span>
                      </div>
                      <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 flex items-center justify-between">
                        <span className="text-slate-600">资金筹措方式：</span>
                        <span className="font-bold font-mono text-slate-800">{detailProject.fundSource}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 右栏 5 栅格：附件资料清单 + 技术方案与存证 */}
                <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
                  {/* 附件资料卡片 */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                        <div className="size-6 rounded-lg bg-blue-50 text-[#1677ff] flex items-center justify-center">
                          <Paperclip className="size-3.5" />
                        </div>
                        支撑附件与批复报告 ({detailProject.attachments.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => alert(`已成功一键打包下载项目【${detailProject.name}】全部支撑附件包！`)}
                        className="text-[#1677ff] hover:text-blue-700 font-bold text-xs cursor-pointer flex items-center gap-1 hover:underline"
                      >
                        <Download className="size-3" />
                        一键打包下载
                      </button>
                    </div>

                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {detailProject.attachments.map((att, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-blue-50/40 hover:border-blue-200 transition-all group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="size-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 text-[#1677ff] font-mono text-[10px] font-bold shadow-2xs">
                              {att.type}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-800 truncate text-xs group-hover:text-[#1677ff] transition-colors">
                                {att.name}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                大小：{att.size} · 上传：{att.uploadTime}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => alert(`正在调取对象存储并下载附件：${att.name}`)}
                            className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 text-[#1677ff] text-[11px] font-bold shrink-0 cursor-pointer shadow-2xs transition-colors ml-2"
                          >
                            下载
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 flex items-start gap-2">
                      <ShieldCheck className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="leading-snug">
                        <strong className="text-slate-800 block mb-0.5">特变电工电子档案存证保障</strong>
                        <span>立项批复、电网接入意见及工程验收单已全量完成电子哈希存证与权限加密。</span>
                      </div>
                    </div>
                  </div>

                  {/* 技术方案与消纳策略说明 */}
                  {detailProject.remark && (
                    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/20 p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                        <FileCheck2 className="size-4 text-[#1677ff]" />
                        <span>技术方案与消纳策略说明</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-sans pl-6">
                        {detailProject.remark}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/90">
              <button
                type="button"
                onClick={() => {
                  const target = detailProject
                  setDetailProject(null)
                  handleOpenEditModal(target)
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <Edit className="size-3.5 text-slate-500" />
                编辑维护此项目档案
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => alert(`已导出项目【${detailProject.name}】全景档案报告 (PDF)`)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <Download className="size-3.5 text-slate-500" />
                  导出档案单 (PDF)
                </button>
                <button
                  type="button"
                  onClick={() => setDetailProject(null)}
                  className="px-6 py-2 rounded-xl bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-bold cursor-pointer shadow-xs transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

