'use client'

import React, { useState, useMemo, useRef } from 'react'
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
  Save,
} from 'lucide-react'
import { StandardOrgTree, PARK_ORG_TREE_DATA, type StandardOrgNode } from '@/components/shared/standard-org-tree'
import { cn } from '@/lib/utils'

export interface ProjectArchiveItem {
  id: string
  code: string
  name: string
  park: string
  company: string
  category: '光伏' | '储能' | '热泵'
  subType: string // 细分技术路线，如 屋顶分布式光伏、用户侧磷酸铁锂、高温工业水源热泵
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
    company: '沈变本部',
    category: '光伏',
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
    company: '衡变本部',
    category: '储能',
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
    category: '热泵',
    subType: '工业余热水源热泵梯级回收',
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
    name: '山东鲁能泰山电缆屋顶光储直柔分布式光伏',
    park: '特变电工华东输变电科技产业园',
    company: '鲁缆本部',
    category: '光伏',
    subType: '分布式光伏 (BAPV)',
    capacity: '5.6 MWp',
    investment: 2190.0,
    fundSource: 'EMC合同能源管理',
    leaderName: '赵明 (生产车间)',
    leaderPhone: '137****9012',
    milestoneApproval: '2025-11-05',
    milestoneStart: '2026-01-10',
    milestoneGrid: '2026-04-18',
    expectedEnergySaving: '发电 620 万kWh/年',
    annualCarbonSaving: 3534.0,
    annualRevenue: 385.0,
    paybackYears: 4.3,
    irr: '22.0%',
    status: '并网稳定运行',
    attachments: [
      { name: '鲁缆光伏并网检测报告.pdf', size: '3.1 MB', type: 'PDF', uploadTime: '2026-04-20' },
    ],
    remark: '高压电缆车间屋顶光伏建设，就地消纳率 98%',
  },
  {
    id: 'p-05',
    code: 'PRJ-2026-HP-005',
    name: '德阳电缆产业园高温工业水源热泵蒸汽替代项目',
    park: '特变电工(德阳)电缆园区',
    company: '特变电工（德阳）电缆股份有限公司',
    category: '热泵',
    subType: '高温工业水源热泵蒸汽替代',
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
    name: '新疆电缆智慧微电网 EMS 与 2MW/4MWh 用户侧储能系统',
    park: '特变电工新疆电缆产业园',
    company: '特变电工新疆电缆有限公司',
    category: '储能',
    subType: '用户侧磷酸铁锂储能',
    capacity: '2MW / 4MWh',
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
    company: '超高压公司',
    category: '光伏',
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
    name: '天津变压器空压机房余热工业空气源热泵节能替代',
    park: '特变电工天变产业园',
    company: '天变公司',
    category: '热泵',
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
    category: '光伏' as ProjectArchiveItem['category'],
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
      category: '光伏',
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

  // 本地文件上传与拖拽支持
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleRealFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const newFiles = Array.from(e.target.files).map((file) => {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
      const isWord = file.name.endsWith('.docx') || file.name.endsWith('.doc')
      const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
      const isZip = file.name.endsWith('.zip') || file.name.endsWith('.rar')
      let type = 'PDF'
      if (isWord) type = 'Word'
      if (isExcel) type = 'Excel'
      if (isZip) type = 'ZIP'

      return {
        name: file.name,
        size: `${Math.max(0.1, parseFloat(sizeMb))} MB`,
        type,
        uploadTime: new Date().toISOString().split('T')[0],
      }
    })
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...newFiles],
    }))
    e.target.value = ''
  }

  const handleDropFiles = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return
    const newFiles = Array.from(e.dataTransfer.files).map((file) => {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
      const isWord = file.name.endsWith('.docx') || file.name.endsWith('.doc')
      const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
      const isZip = file.name.endsWith('.zip') || file.name.endsWith('.rar')
      let type = 'PDF'
      if (isWord) type = 'Word'
      if (isExcel) type = 'Excel'
      if (isZip) type = 'ZIP'

      return {
        name: file.name,
        size: `${Math.max(0.1, parseFloat(sizeMb))} MB`,
        type,
        uploadTime: new Date().toISOString().split('T')[0],
      }
    })
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...newFiles],
    }))
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
      size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
      type: randomName.endsWith('.docx') ? 'Word' : 'PDF',
      uploadTime: new Date().toISOString().split('T')[0],
    }
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, newAtt],
    }))
  }

  const getCategoryBadge = (category: ProjectArchiveItem['category']) => {
    switch (category) {
      case '光伏':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
            <Sun className="size-3 text-amber-400" />
            光伏
          </span>
        )
      case '储能':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
            <BatteryCharging className="size-3 text-emerald-400" />
            储能
          </span>
        )
      case '热泵':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 font-bold">
            <Flame className="size-3 text-primary" />
            热泵
          </span>
        )
      default:
        return null
    }
  }

  const filteredProjects = projects.filter((p) => {
    if (searchKw && !p.name.includes(searchKw) && !p.code.includes(searchKw) && !p.leaderName.includes(searchKw)) {
      return false
    }
    if (companyFilter !== 'all' && p.company !== companyFilter) {
      return false
    }
    if (categoryFilter !== 'all' && p.category !== categoryFilter) {
      return false
    }
    if (statusFilter !== 'all' && p.status !== statusFilter) {
      return false
    }
    if (selectedNode.level === 'company' && p.company !== selectedNode.name) {
      return false
    }
    return true
  })

  return (
    <div className="space-y-3.5 font-sans text-foreground">
      <div className="flex flex-col gap-3.5">
        {/* 1. 顶部 Header (标题 + 导出项目库 + 在线填报新项目) */}
        <div className="bg-card p-3.5 rounded-xl border border-border shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0">
              <FolderKanban className="size-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground">项目档案管理</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert(`已成功导出【${selectedNode.name}】零碳项目库台账清单 (Excel)...`)}
              className="px-3 py-1.5 rounded-lg border border-border text-foreground bg-panel hover:bg-accent/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Download className="size-3.5 text-muted-foreground" />
              导出
            </button>
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="size-4" />
              添加项目
            </button>
          </div>
        </div>

        {/* 2. 筛选与多维过滤 Toolbar (三大技术类别 + 状态 + 搜索) */}
        <div className="bg-card p-3 rounded-xl border border-border shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* 三大技术类别快速切换 */}
            <div className="flex items-center gap-1 bg-panel p-0.5 rounded-lg text-xs font-sans border border-border">
              {[
                { key: 'all', label: '全部项目' },
                { key: '光伏', label: '☀️ 光伏' },
                { key: '储能', label: '🔋 储能' },
                { key: '热泵', label: '♨️ 热泵' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setCategoryFilter(tab.key)}
                  className={cn(
                    'px-3 py-1.5 rounded-md transition-all cursor-pointer font-medium text-xs',
                    categoryFilter === tab.key
                      ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
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
              className="h-8 px-2.5 rounded-lg border border-border bg-panel text-xs text-foreground focus:outline-none focus:border-primary font-medium"
            >
              <option value="all" className="bg-card text-foreground">全部所属单位 (全集团)</option>
              <optgroup label="🏢 沈变公司 (一级单位)" className="bg-card text-foreground">
                <option value="沈变公司">沈变公司 (全部)</option>
                <option value="沈变本部">└ 沈变本部</option>
                <option value="露娜公司">└ 露娜公司 (特变电工露娜智能)</option>
                <option value="智慧能源">└ 智慧能源</option>
                <option value="和新套管公司">└ 和新套管公司</option>
                <option value="康嘉互感器">└ 康嘉互感器</option>
                <option value="印能公司">└ 印能公司</option>
              </optgroup>
              <optgroup label="🏢 衡变公司 (一级单位)" className="bg-card text-foreground">
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
              <optgroup label="🏢 新变厂 (一级单位)" className="bg-card text-foreground">
                <option value="新变厂">新变厂 (全部)</option>
                <option value="超高压公司">└ 超高压公司</option>
                <option value="天变公司">└ 天变公司</option>
                <option value="智能电气公司">└ 智能电气公司</option>
                <option value="京津冀公司">└ 京津冀公司</option>
                <option value="珠峰硅钢">└ 珠峰硅钢</option>
                <option value="银利电气">└ 银利电气</option>
              </optgroup>
              <optgroup label="🏢 鲁缆公司 (一级单位)" className="bg-card text-foreground">
                <option value="鲁缆公司">鲁缆公司 (全部)</option>
                <option value="鲁缆本部">└ 鲁缆本部</option>
                <option value="智缆公司">└ 智缆公司</option>
                <option value="昭和公司">└ 昭和公司</option>
                <option value="曙光公司">└ 曙光公司</option>
              </optgroup>
              <optgroup label="🏢 新缆厂 (一级单位)" className="bg-card text-foreground">
                <option value="新缆厂">新缆厂 (全部)</option>
                <option value="特变电工新疆电缆有限公司">└ 特变电工新疆电缆有限公司</option>
                <option value="特变电工新疆线缆厂">└ 特变电工新疆线缆厂</option>
              </optgroup>
              <optgroup label="🏢 德缆公司 (一级单位)" className="bg-card text-foreground">
                <option value="德缆公司">德缆公司 (全部)</option>
                <option value="特变电工（德阳）电缆股份有限公司">└ 特变电工（德阳）电缆股份有限公司</option>
              </optgroup>
            </select>

            {/* 状态过滤 */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 px-2.5 rounded-lg border border-border bg-panel text-xs text-foreground focus:outline-none focus:border-primary font-medium"
            >
              <option value="all" className="bg-card text-foreground">全部建设状态</option>
              <option value="并网稳定运行" className="bg-card text-foreground">并网稳定运行</option>
              <option value="在建施工" className="bg-card text-foreground">在建施工</option>
              <option value="规划批复" className="bg-card text-foreground">规划批复</option>
            </select>
          </div>

          {/* 模糊搜索框 */}
          <div className="relative">
            <Search className="size-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索项目名称 / 建设单位 / 细分技术..."
              value={searchKw}
              onChange={(e) => setSearchKw(e.target.value)}
              className="h-8 pl-8 pr-3 w-64 rounded-lg border border-border bg-panel text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all font-sans"
            />
          </div>
        </div>

        {/* 4. 项目主数据表格卡片 */}
        <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
          <div className="p-3.5 border-b border-border/60 flex items-center justify-between bg-panel">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary" />
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                项目台账档案库
              </h3>
            </div>
            <span className="text-xs text-muted-foreground font-mono">点击任意行可查看详细档案与附件批复</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse font-mono">
              <thead>
                <tr className="bg-panel text-muted-foreground font-bold font-sans border-b border-border">
                  <th className="py-2.5 px-3 min-w-[220px]">项目名称</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">项目类型</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">所属园区</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">建设单位</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">建设规模容量</th>
                  <th className="py-2.5 px-3 whitespace-nowrap text-right">总投资 (万元)</th>
                  <th className="py-2.5 px-3 whitespace-nowrap text-right">年收益 (万元)</th>
                  <th className="py-2.5 px-3 whitespace-nowrap text-center">投运/并网日</th>
                  <th className="py-2.5 px-3 whitespace-nowrap text-center">建设状态</th>
                  <th className="py-2.5 px-3 whitespace-nowrap text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-foreground">
                {filteredProjects.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setDetailProject(item)}
                    className="hover:bg-accent/30 transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 px-3 font-sans font-bold text-foreground group-hover:text-primary transition-colors">
                      <div>{item.name}</div>
                    </td>
                    <td className="py-2.5 px-3 font-sans">{getCategoryBadge(item.category)}</td>
                    <td className="py-2.5 px-3 font-sans">
                      <div className="font-bold text-foreground">{item.park}</div>
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      <div className="text-muted-foreground font-medium">{item.company}</div>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-foreground">{item.capacity}</td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-foreground">
                      ¥{item.investment.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                      ¥{item.annualRevenue.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-center text-muted-foreground">{item.milestoneGrid}</td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-[10px] font-bold inline-block',
                          item.status === '并网稳定运行'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : item.status === '在建施工'
                            ? 'bg-primary/20 text-primary border border-primary/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
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
                          className="p-1 rounded hover:bg-accent/40 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                          title="查看完整档案"
                        >
                          <Eye className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1 rounded hover:bg-emerald-500/20 text-muted-foreground hover:text-emerald-400 transition-colors cursor-pointer"
                          title="在线维护更新"
                        >
                          <Edit className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(item.id, item.name)}
                          className="p-1 rounded hover:bg-rose-500/20 text-muted-foreground hover:text-rose-400 transition-colors cursor-pointer"
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

      {/* 🌟 5. 在线填报/维护零碳项目档案 宽屏单窗口弹窗 (Single-Window Wide Modal) */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-200 font-sans">
          <div className="bg-card rounded-2xl shadow-2xl border border-border w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between bg-panel">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center border border-primary/30">
                  <FolderKanban className="size-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    {isEditing ? '编辑项目档案' : '添加项目档案'}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowFormModal(false)}
                className="p-1.5 rounded-lg hover:bg-accent/40 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Body: 统一单窗口表单 (宽幅两列/三列布局) */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              {/* 隐藏的真实本地文件输入框 */}
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.png,.jpg,.jpeg"
                onChange={handleRealFileUpload}
                className="hidden"
              />

              {/* 模块一：项目基本信息 */}
              <div className="bg-panel p-4 rounded-xl border border-border space-y-3">
                <div className="flex items-center gap-2 pb-1.5 border-b border-border/60">
                  <span className="size-2 rounded-full bg-primary" />
                  <span className="font-bold text-foreground text-xs">基本信息与单位归属</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="md:col-span-3">
                    <label className="block text-foreground font-medium mb-1">项目名称 *</label>
                    <input
                      type="text"
                      placeholder="例如：特变电工沈阳变压器厂区 15MWp 屋顶分布式光伏二期项目"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg border border-border bg-card focus:border-primary focus:outline-none text-foreground font-medium placeholder:text-muted-foreground"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-foreground font-medium mb-1">零碳项目类型 *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        const cat = e.target.value as ProjectArchiveItem['category']
                        setFormData({ ...formData, category: cat })
                      }}
                      className="w-full h-8 px-2.5 rounded-lg border border-border bg-card font-bold text-foreground focus:outline-none focus:border-primary"
                    >
                      <option value="光伏" className="bg-card text-foreground">☀️ 光伏</option>
                      <option value="储能" className="bg-card text-foreground">🔋 储能</option>
                      <option value="热泵" className="bg-card text-foreground">♨️ 热泵</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-foreground font-medium mb-1">
                      实施经营单位 (所属零碳园区与主体) *
                    </label>
                    <select
                      value={`${formData.park}::${formData.company}`}
                      onChange={(e) => {
                        const [pName, cName] = e.target.value.split('::')
                        setFormData({ ...formData, park: pName, company: cName })
                      }}
                      className="w-full h-8 px-2.5 rounded-lg border border-border bg-card font-bold text-foreground focus:outline-none focus:border-primary"
                    >
                      {PARK_ORG_TREE_DATA[0].children?.map((park) => {
                        const units: { id: string; name: string }[] = []
                        const traverse = (node: StandardOrgNode) => {
                          if (node.level === 'workshop' || node.level === 'company') {
                            units.push({ id: node.id, name: node.name })
                          }
                          if (node.children) {
                            node.children.forEach(traverse)
                          }
                        }
                        if (park.children) park.children.forEach(traverse)

                        return (
                          <optgroup key={park.id} label={`🏞️ ${park.name} (${park.badge || '园区'})`} className="bg-card text-foreground">
                            {units.map((u) => (
                              <option key={u.id} value={`${park.name}::${u.name}`} className="bg-card text-foreground">
                                └ {u.name}
                              </option>
                            ))}
                          </optgroup>
                        )
                      })}
                    </select>
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-foreground font-medium mb-1">项目负责人</label>
                    <input
                      type="text"
                      placeholder="如：张工"
                      value={formData.leaderName}
                      onChange={(e) => setFormData({ ...formData, leaderName: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg border border-border bg-card focus:border-primary focus:outline-none text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-foreground font-medium mb-1">联系电话</label>
                    <input
                      type="text"
                      placeholder="如：138****0000"
                      value={formData.leaderPhone}
                      onChange={(e) => setFormData({ ...formData, leaderPhone: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg border border-border bg-card focus:border-primary focus:outline-none font-mono text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              </div>

              {/* 模块二：技术类型、容量投资与建设节点 */}
              <div className="bg-panel p-4 rounded-xl border border-border space-y-3">
                <div className="flex items-center gap-2 pb-1.5 border-b border-border/60">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  <span className="font-bold text-foreground text-xs">建设规模、投资金额与关键节点</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="md:col-span-1">
                    <label className="block text-foreground font-medium mb-1">建设容量 / 规模 *</label>
                    <input
                      type="text"
                      placeholder="例如：12.8 MWp"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg border border-border bg-card focus:border-primary focus:outline-none font-mono font-bold text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-foreground font-medium mb-1">总投资额 (万元) *</label>
                    <input
                      type="number"
                      placeholder="例如：4850.0"
                      value={formData.investment}
                      onChange={(e) => setFormData({ ...formData, investment: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg border border-border bg-card focus:border-primary focus:outline-none font-mono font-bold text-emerald-400 placeholder:text-muted-foreground"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-foreground font-medium mb-1">立项批复日期</label>
                    <input
                      type="date"
                      value={formData.milestoneApproval}
                      onChange={(e) => setFormData({ ...formData, milestoneApproval: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg border border-border bg-card font-mono text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-foreground font-medium mb-1">开工建设日期</label>
                    <input
                      type="date"
                      value={formData.milestoneStart}
                      onChange={(e) => setFormData({ ...formData, milestoneStart: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg border border-border bg-card font-mono text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-foreground font-medium mb-1">并网 / 投产日期 *</label>
                    <input
                      type="date"
                      value={formData.milestoneGrid}
                      onChange={(e) => setFormData({ ...formData, milestoneGrid: e.target.value })}
                      className="w-full h-8 px-2.5 rounded-lg border border-border bg-card font-mono font-bold text-primary focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* 模块三：项目附件与批复资料 (真实本地上传 + 拖拽支持) */}
              <div className="bg-panel p-4 rounded-xl border border-border space-y-3">
                <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-amber-400" />
                    <span className="font-bold text-foreground text-xs">
                      资料附件与支撑文件 ({formData.attachments.length})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                    >
                      <UploadCloud className="size-3.5" />
                      选择本地文件上传
                    </button>
                    {formData.attachments.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, attachments: [] })}
                        className="text-[11px] text-muted-foreground hover:text-rose-400 font-medium transition-colors cursor-pointer px-1"
                      >
                        清空
                      </button>
                    )}
                  </div>
                </div>

                {/* 拖拽/点击上传提示框 */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDropFiles}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    'border-2 border-dashed rounded-xl p-3.5 text-center transition-all cursor-pointer flex items-center justify-center gap-2',
                    isDragging
                      ? 'border-primary bg-primary/20'
                      : 'border-border hover:border-primary/50 hover:bg-accent/20 bg-card/60'
                  )}
                >
                  <UploadCloud className="size-4.5 text-primary" />
                  <span className="text-xs font-bold text-foreground">点击此处或拖拽本地文件到此处上传</span>
                  <span className="text-[11px] text-muted-foreground font-sans">
                    (支持 PDF / Word / Excel / ZIP，单个最大 50MB)
                  </span>
                </div>

                {/* 已上传文件列表网格 */}
                {formData.attachments.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                    {formData.attachments.map((att, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-2xs transition-all group"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <FileText className="size-4 text-primary shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-foreground truncate text-xs" title={att.name}>
                              {att.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground font-mono">
                              {att.size} · {att.uploadTime}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setFormData({
                              ...formData,
                              attachments: formData.attachments.filter((_, i) => i !== idx),
                            })
                          }}
                          className="text-muted-foreground hover:text-rose-400 p-1 rounded hover:bg-accent/40 transition-colors cursor-pointer shrink-0"
                          title="移除此附件"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-1 text-muted-foreground text-xs">
                    暂未上传任何项目附件，可点击上方按钮上传立项批复或技术文件
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer (取消与直接保存) */}
            <div className="px-6 py-3.5 border-t border-border/60 flex items-center justify-between bg-panel">
              <span className="text-[11px] text-muted-foreground font-medium">带 * 为必填项</span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-1.5 rounded-lg border border-border text-muted-foreground bg-card hover:bg-accent/40 text-xs font-medium transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleSaveProject}
                  className="px-5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="size-3.5" />
                  {isEditing ? '保存修改' : '保存档案并入库'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🌟 6. 详情查看大弹窗 (Detail Modal, max-w-5xl 工业级现代化 Bento 风格，对齐最新精简字段体系) */}
      {detailProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-200 font-sans">
          <div className="bg-card rounded-2xl shadow-2xl border border-border w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-border/60 bg-panel flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="size-11 rounded-xl bg-card border border-border shadow-xs flex items-center justify-center shrink-0 text-primary mt-0.5">
                  {getCategoryIcon(detailProject.category)}
                </div>
                <div className="space-y-1.5 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug tracking-tight">
                    {detailProject.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {getCategoryBadge(detailProject.category)}
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-panel text-muted-foreground border border-border font-medium">
                      <Building2 className="size-3.5 text-muted-foreground" />
                      {detailProject.park} · {detailProject.company}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailProject(null)}
                className="p-1.5 rounded-xl hover:bg-accent/40 text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* 1. 3 大核心指标卡片 (装机容量 + 投资金额 + 并网投产日期) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* 卡片 1: 建设装机容量 */}
                <div className="bg-panel/60 p-4 rounded-xl border border-border shadow-2xs hover:shadow-xs transition-shadow">
                  <div className="flex items-center justify-between text-muted-foreground font-medium mb-1.5">
                    <span className="flex items-center gap-1.5 text-xs text-foreground font-bold">
                      <Zap className="size-4 text-primary" />
                      建设装机容量 / 规模
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-bold border border-primary/30">
                      装机规模
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold font-mono text-foreground tracking-tight my-1">
                    {detailProject.capacity}
                  </div>
                  <div className="text-[11px] text-muted-foreground font-sans border-t border-border/60 pt-1.5 mt-1.5">
                    技术分类：<span className="text-foreground font-bold">{detailProject.category}工程</span>
                  </div>
                </div>

                {/* 卡片 2: 总投资额 */}
                <div className="bg-panel/60 p-4 rounded-xl border border-border shadow-2xs hover:shadow-xs transition-shadow">
                  <div className="flex items-center justify-between text-muted-foreground font-medium mb-1.5">
                    <span className="flex items-center gap-1.5 text-xs text-foreground font-bold">
                      <DollarSign className="size-4 text-emerald-400" />
                      总投资金额 (CapEx)
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                      投资总额
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold font-mono text-emerald-400 tracking-tight my-1">
                    ¥{detailProject.investment.toLocaleString()}{' '}
                    <span className="text-xs font-semibold text-emerald-400">万元</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground font-sans border-t border-border/60 pt-1.5 mt-1.5">
                    固定资产与工程安装投资
                  </div>
                </div>

                {/* 卡片 3: 并网 / 投产日期 */}
                <div className="bg-panel/60 p-4 rounded-xl border border-border shadow-2xs hover:shadow-xs transition-shadow">
                  <div className="flex items-center justify-between text-muted-foreground font-medium mb-1.5">
                    <span className="flex items-center gap-1.5 text-xs text-foreground font-bold">
                      <Calendar className="size-4 text-purple-400" />
                      并网 / 投产生效日期
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30">
                      关键节点
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold font-mono text-purple-400 tracking-tight my-1">
                    {detailProject.milestoneGrid}
                  </div>
                  <div className="text-[11px] text-muted-foreground font-sans border-t border-border/60 pt-1.5 mt-1.5">
                    正式投产运行时间
                  </div>
                </div>
              </div>

              {/* 2. 左右两栏深度详情网格 (7 : 5) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* 左栏 7 栅格：全周期实施进度 + 实施责任主体 + 备注说明 */}
                <div className="lg:col-span-7 space-y-4">
                  {/* 里程碑时间轴 Stepper */}
                  <div className="bg-panel p-4.5 rounded-xl border border-border shadow-2xs space-y-3.5">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                      <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                        <div className="size-6 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                          <Clock className="size-3.5" />
                        </div>
                        项目全周期实施关键里程碑
                      </h4>
                      <span className="text-[11px] text-muted-foreground font-mono">全过程跟踪管控</span>
                    </div>

                    {/* Stepper Timeline */}
                    <div className="grid grid-cols-3 gap-3">
                      {/* Milestone 1 */}
                      <div className="p-3 rounded-xl border border-border bg-card space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-muted-foreground font-medium">1. 立项批复</span>
                        </div>
                        <div className="font-mono font-bold text-foreground text-xs">
                          {detailProject.milestoneApproval || '暂无'}
                        </div>
                        <p className="text-[10px] text-muted-foreground">可研与投资决议批复</p>
                      </div>

                      {/* Milestone 2 */}
                      <div className="p-3 rounded-xl border border-primary/30 bg-primary/10 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-primary font-medium">2. 施工开工</span>
                        </div>
                        <div className="font-mono font-bold text-foreground text-xs">
                          {detailProject.milestoneStart || '暂无'}
                        </div>
                        <p className="text-[10px] text-muted-foreground">设备进场与工程安装</p>
                      </div>

                      {/* Milestone 3 */}
                      <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-emerald-400 font-bold">3. 并网 / 投产</span>
                        </div>
                        <div className="font-mono font-bold text-emerald-400 text-xs">
                          {detailProject.milestoneGrid}
                        </div>
                        <p className="text-[10px] text-emerald-400/80">正式投产运行</p>
                      </div>
                    </div>
                  </div>

                  {/* 实施主体与管理责任 */}
                  <div className="bg-panel p-4.5 rounded-xl border border-border shadow-2xs space-y-3">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                        <div className="size-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                          <Building2 className="size-3.5" />
                        </div>
                        实施责任主体与属地管理 (园区结构树)
                      </h4>
                      <span className="text-[11px] text-muted-foreground font-mono">组织与联系人</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-card border border-border">
                        <span className="text-[11px] text-muted-foreground block mb-0.5">实施经营单位 (填报主体)</span>
                        <span className="font-bold text-foreground text-xs">{detailProject.company}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-card border border-border">
                        <span className="text-[11px] text-muted-foreground block mb-0.5">所属零碳产业园区</span>
                        <span className="font-bold text-foreground text-xs truncate block" title={detailProject.park}>
                          {detailProject.park}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-card border border-border">
                        <span className="text-[11px] text-muted-foreground block mb-0.5">项目责任人</span>
                        <span className="font-bold text-foreground text-xs">{detailProject.leaderName}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-card border border-border">
                        <span className="text-[11px] text-muted-foreground block mb-0.5">联系电话</span>
                        <span className="font-mono font-bold text-foreground text-xs">{detailProject.leaderPhone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 右栏 5 栅格：附件资料清单 + 权威存证 */}
                <div className="lg:col-span-5 space-y-4">
                  {/* 附件资料卡片 */}
                  <div className="bg-panel p-4.5 rounded-xl border border-border shadow-2xs space-y-3">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <span className="text-xs font-bold text-foreground flex items-center gap-2">
                        <div className="size-6 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                          <Paperclip className="size-3.5" />
                        </div>
                        支撑附件与批复报告 ({detailProject.attachments.length})
                      </span>
                      {detailProject.attachments.length > 0 && (
                        <button
                          type="button"
                          onClick={() => alert(`已成功一键打包下载项目【${detailProject.name}】全部支撑附件包！`)}
                          className="text-primary hover:underline font-bold text-xs cursor-pointer flex items-center gap-1"
                        >
                          <Download className="size-3" />
                          一键打包下载
                        </button>
                      )}
                    </div>

                    {detailProject.attachments.length > 0 ? (
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {detailProject.attachments.map((att, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-card hover:border-primary/50 transition-all group"
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <div className="size-8 rounded-lg bg-panel border border-border flex items-center justify-center shrink-0 text-primary font-mono text-[10px] font-bold shadow-2xs">
                                {att.type || 'PDF'}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-bold text-foreground truncate text-xs group-hover:text-primary transition-colors" title={att.name}>
                                  {att.name}
                                </p>
                                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                                  大小：{att.size} · 上传：{att.uploadTime}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => alert(`正在调取对象存储并下载附件：${att.name}`)}
                              className="px-2.5 py-1 rounded-lg bg-panel hover:bg-accent/40 border border-border text-primary text-[11px] font-bold shrink-0 cursor-pointer shadow-2xs transition-colors ml-2"
                            >
                              下载
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground text-xs">
                        暂无附件文件
                      </div>
                    )}

                    <div className="p-3 rounded-lg bg-card border border-border text-[11px] text-muted-foreground flex items-start gap-2">
                      <ShieldCheck className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="leading-snug">
                        <strong className="text-foreground block mb-0.5">特变电工电子档案存证保障</strong>
                        <span>立项批复、电网接入意见及工程验收单已全量完成电子哈希存证与权限加密。</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-border/60 flex items-center justify-between bg-panel">
              <button
                type="button"
                onClick={() => {
                  const target = detailProject
                  setDetailProject(null)
                  handleOpenEditModal(target)
                }}
                className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-accent/40 text-foreground text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <Edit className="size-3.5 text-muted-foreground" />
                编辑维护此项目档案
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => alert(`已导出项目【${detailProject.name}】全景档案报告 (PDF)`)}
                  className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-accent/40 text-foreground text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <Download className="size-3.5 text-muted-foreground" />
                  导出档案单 (PDF)
                </button>
                <button
                  type="button"
                  onClick={() => setDetailProject(null)}
                  className="px-6 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold cursor-pointer shadow-xs transition-colors"
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

