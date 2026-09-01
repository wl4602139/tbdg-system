'use client'

import React, { useState, useMemo } from 'react'
import {
  Users,
  ShieldCheck,
  UserPlus,
  KeyRound,
  Building2,
  Lock,
  CheckCircle2,
  AlertCircle,
  Search,
  Plus,
  Edit,
  Trash2,
  RotateCcw,
  CheckSquare,
  Square,
  ChevronRight,
  ChevronDown,
  Layers,
  Sparkles,
  Download,
  Filter,
  Check,
  X,
  Eye,
  SlidersHorizontal,
  FolderTree,
  UserCog,
  FileSpreadsheet,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ENTERPRISE_TREE_DATA, type StandardOrgNode } from '@/components/shared/standard-org-tree'

// 账号数据接口
interface UserAccount {
  id: string
  workNo: string
  name: string
  account: string
  dept: string
  company: string
  roleId: string
  roleName: string
  dataScopeType: 'all' | 'company' | 'factory' | 'custom'
  dataScopeText: string
  phone: string
  email: string
  status: '启用' | '停用'
  lastLoginTime: string
  lastLoginIp: string
}

// 角色模型接口
interface RoleModel {
  id: string
  code: string
  name: string
  type: 'preset' | 'custom'
  desc: string
  userCount: number
  dataScopeDefault: 'all' | 'company' | 'factory' | 'custom'
  menuPermissions: string[] // 选中的菜单与按钮权限 Key
}

// 权限菜单树定义
interface PermissionNode {
  id: string
  title: string
  children?: PermissionNode[]
  actions?: { id: string; label: string }[]
}

const PERMISSION_TREE_DATA: PermissionNode[] = [
  {
    id: 'menu_screen',
    title: '1. 集控中心大屏 (/zero-carbon/screen)',
    actions: [
      { id: 'screen_view', label: '查看大屏' },
      { id: 'screen_3d', label: '3D拓扑交互' },
      { id: 'screen_export', label: '投屏控制' },
    ],
  },
  {
    id: 'menu_monitor',
    title: '2. 集中监管模块 (/zero-carbon/monitor)',
    children: [
      {
        id: 'menu_indicator',
        title: '指标管控 (/zero-carbon/monitor/indicator)',
        actions: [
          { id: 'ind_view', label: '指标查看' },
          { id: 'ind_detail', label: 'Mode B 穿透' },
          { id: 'ind_export', label: '台账导出' },
        ],
      },
      {
        id: 'menu_online_usage',
        title: '用能在线监测 (/zero-carbon/monitor/online/usage)',
        actions: [
          { id: 'online_view', label: '在线时序监控' },
          { id: 'online_realtime', label: '15分钟高频数据' },
          { id: 'online_export', label: '导出原始流水' },
        ],
      },
      {
        id: 'menu_online_microgrid',
        title: '工业微电网监测 (/zero-carbon/monitor/online/microgrid)',
        actions: [
          { id: 'grid_view', label: '微网潮流监测' },
          { id: 'grid_ctrl', label: '储能/光伏调控' },
        ],
      },
      {
        id: 'menu_carbon_emission',
        title: '能源碳排放监测 (/zero-carbon/monitor/carbon-emission)',
        actions: [
          { id: 'carbon_view', label: '碳排大盘查看' },
          { id: 'carbon_offset', label: '绿电抵消核算' },
          { id: 'carbon_export', label: '导出对标明细' },
        ],
      },
    ],
  },
  {
    id: 'menu_energy',
    title: '3. 能耗能效分析 (/zero-carbon/energy)',
    children: [
      {
        id: 'menu_energy_structure',
        title: '用能结构分析',
        actions: [
          { id: 'str_view', label: '结构占比查看' },
          { id: 'str_export', label: '导出明细' },
        ],
      },
      {
        id: 'menu_energy_cost',
        title: '能源成本分析',
        actions: [
          { id: 'cost_view', label: '成本玫瑰图查看' },
          { id: 'cost_optimize', label: '降本建议测算' },
        ],
      },
      {
        id: 'menu_energy_unit_product',
        title: '单位产品能耗',
        actions: [
          { id: 'prod_view', label: '产品分类单耗' },
          { id: 'prod_ledger', label: '型号明细台账' },
        ],
      },
      {
        id: 'menu_energy_unit_output',
        title: '单位产值能耗',
        actions: [
          { id: 'out_view', label: '产值单耗看板' },
          { id: 'out_yoy', label: '同比环比分析' },
        ],
      },
      {
        id: 'menu_energy_benchmark',
        title: '对标管理',
        actions: [
          { id: 'bm_view', label: '行业标杆查看' },
          { id: 'bm_edit', label: '维护基准值' },
          { id: 'bm_audit', label: '对标审批发布' },
        ],
      },
    ],
  },
  {
    id: 'menu_project',
    title: '4. 零碳项目评估 (/zero-carbon/project)',
    children: [
      {
        id: 'menu_project_archive',
        title: '项目档案管理',
        actions: [
          { id: 'proj_view', label: '档案浏览' },
          { id: 'proj_add', label: '项目立项录入' },
          { id: 'proj_audit', label: '项目验收归档' },
        ],
      },
      {
        id: 'menu_project_benefit',
        title: '效益评估与自评估',
        actions: [
          { id: 'proj_eval', label: '减排效益核算' },
          { id: 'proj_self_score', label: '园区自评估打分' },
        ],
      },
    ],
  },
  {
    id: 'menu_reports',
    title: '5. 统计报表 (/zero-carbon/reports)',
    actions: [
      { id: 'rep_usage', label: '用能报表' },
      { id: 'rep_cost', label: '成本报表' },
      { id: 'rep_unit', label: '单耗报表' },
      { id: 'rep_carbon', label: '碳排报表' },
      { id: 'rep_print', label: '批量打印/导出' },
    ],
  },
  {
    id: 'menu_config',
    title: '6. 基础配置模块 (/zero-carbon/config)',
    actions: [
      { id: 'cfg_permission', label: '账号权限管理' },
      { id: 'cfg_factor', label: '碳排因子维护与重算' },
      { id: 'cfg_price', label: '费价模型与分时电价' },
      { id: 'cfg_convert', label: '折标煤系数与转换' },
      { id: 'cfg_interface', label: '接口连接与字段映射' },
      { id: 'cfg_entry', label: '离线数据填报与审批' },
    ],
  },
]

// 预设用户账号数据
const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr_001',
    workNo: 'TB-00101',
    name: '张建国',
    account: 'zhangjg@tbea.com',
    company: '电装集团总部',
    dept: '能碳管理中心',
    roleId: 'role_admin',
    roleName: '集团超级管理员',
    dataScopeType: 'all',
    dataScopeText: '全集团 (6大直属制造公司 · 30个车间工厂)',
    phone: '138****0001',
    email: 'zhangjg@tbea.com',
    status: '启用',
    lastLoginTime: '2026-09-01 14:28:10',
    lastLoginIp: '10.20.1.18',
  },
  {
    id: 'usr_002',
    workNo: 'TB-00108',
    name: '李雅静',
    account: 'liyajing@tbea.com',
    company: '电装集团总部',
    dept: '能碳战略与ESG部',
    roleId: 'role_director',
    roleName: '集团能碳总监',
    dataScopeType: 'all',
    dataScopeText: '全集团 (全域指标查阅、对标与报表)',
    phone: '139****1122',
    email: 'liyajing@tbea.com',
    status: '启用',
    lastLoginTime: '2026-09-01 11:15:32',
    lastLoginIp: '10.20.1.45',
  },
  {
    id: 'usr_003',
    workNo: 'TB-02105',
    name: '王少华',
    account: 'wangsh@tbea.com',
    company: '沈变公司',
    dept: '动力能源处',
    roleId: 'role_park_mgr',
    roleName: '园区能管主管',
    dataScopeType: 'company',
    dataScopeText: '沈变公司 (含沈变本部、露娜、智慧能源等6单位)',
    phone: '137****3388',
    email: 'wangsh@tbea.com',
    status: '启用',
    lastLoginTime: '2026-09-01 10:02:18',
    lastLoginIp: '10.21.3.12',
  },
  {
    id: 'usr_004',
    workNo: 'TB-02188',
    name: '刘海波',
    account: 'liuhb_sb@tbea.com',
    company: '沈变公司',
    dept: '超高压变压器车间',
    roleId: 'role_reporter',
    roleName: '工厂能耗申报员',
    dataScopeType: 'factory',
    dataScopeText: '沈变本部 (超高压制造基地)',
    phone: '135****6699',
    email: 'liuhb_sb@tbea.com',
    status: '启用',
    lastLoginTime: '2026-08-31 17:40:11',
    lastLoginIp: '10.21.8.66',
  },
  {
    id: 'usr_005',
    workNo: 'TB-03102',
    name: '陈志明',
    account: 'chenzm@tbea.com',
    company: '衡变公司',
    dept: '南方制造中心设备部',
    roleId: 'role_park_mgr',
    roleName: '园区能管主管',
    dataScopeType: 'company',
    dataScopeText: '衡变公司 (含衡变本部、南京电研等11单位)',
    phone: '136****5522',
    email: 'chenzm@tbea.com',
    status: '启用',
    lastLoginTime: '2026-09-01 09:18:40',
    lastLoginIp: '10.22.2.19',
  },
  {
    id: 'usr_006',
    workNo: 'TB-04106',
    name: '马俊杰',
    account: 'majunjie@tbea.com',
    company: '新变厂',
    dept: '特高压制造生产部',
    roleId: 'role_reporter',
    roleName: '工厂能耗申报员',
    dataScopeType: 'factory',
    dataScopeText: '超高压公司 (新疆特高压基地)',
    phone: '138****7711',
    email: 'majunjie@tbea.com',
    status: '启用',
    lastLoginTime: '2026-08-30 16:30:25',
    lastLoginIp: '10.23.4.15',
  },
  {
    id: 'usr_007',
    workNo: 'TB-05101',
    name: '赵立峰',
    account: 'zhaolf@tbea.com',
    company: '鲁缆公司',
    dept: '新泰生产基地能管科',
    roleId: 'role_park_mgr',
    roleName: '园区能管主管',
    dataScopeType: 'company',
    dataScopeText: '鲁缆公司 (含鲁缆本部、智缆等4单位)',
    phone: '139****8833',
    email: 'zhaolf@tbea.com',
    status: '启用',
    lastLoginTime: '2026-09-01 08:50:11',
    lastLoginIp: '10.24.1.8',
  },
  {
    id: 'usr_008',
    workNo: 'TB-06109',
    name: '周晓琴',
    account: 'zhouxq@tbea.com',
    company: '电装集团总部',
    dept: '审计与合规风控部',
    roleId: 'role_auditor',
    roleName: '审计合规专员',
    dataScopeType: 'all',
    dataScopeText: '全集团 (操作审计与配置留痕全量只读)',
    phone: '133****4455',
    email: 'zhouxq@tbea.com',
    status: '启用',
    lastLoginTime: '2026-08-29 11:20:00',
    lastLoginIp: '10.20.5.21',
  },
]

// 预设角色定义
const INITIAL_ROLES: RoleModel[] = [
  {
    id: 'role_admin',
    code: 'ROLE_SUPER_ADMIN',
    name: '集团超级管理员',
    type: 'preset',
    desc: '拥有特变电工电装集团全平台最高管理权限，可执行全部功能与配置变更',
    userCount: 2,
    dataScopeDefault: 'all',
    menuPermissions: [
      'screen_view', 'screen_3d', 'screen_export',
      'ind_view', 'ind_detail', 'ind_export',
      'online_view', 'online_realtime', 'online_export',
      'grid_view', 'grid_ctrl',
      'carbon_view', 'carbon_offset', 'carbon_export',
      'str_view', 'str_export',
      'cost_view', 'cost_optimize',
      'prod_view', 'prod_ledger',
      'out_view', 'out_yoy',
      'bm_view', 'bm_edit', 'bm_audit',
      'proj_view', 'proj_add', 'proj_audit',
      'proj_eval', 'proj_self_score',
      'rep_usage', 'rep_cost', 'rep_unit', 'rep_carbon', 'rep_print',
      'cfg_permission', 'cfg_factor', 'cfg_price', 'cfg_convert', 'cfg_interface', 'cfg_entry',
    ],
  },
  {
    id: 'role_director',
    code: 'ROLE_CARBON_DIRECTOR',
    name: '集团能碳总监',
    type: 'preset',
    desc: '集团级决策层，可查阅全集团与各制造单位能碳大盘、对标分析、效益报告与统计报表',
    userCount: 4,
    dataScopeDefault: 'all',
    menuPermissions: [
      'screen_view', 'screen_3d',
      'ind_view', 'ind_detail', 'ind_export',
      'online_view', 'carbon_view', 'carbon_offset', 'carbon_export',
      'str_view', 'str_export', 'cost_view', 'cost_optimize',
      'prod_view', 'prod_ledger', 'out_view', 'out_yoy',
      'bm_view', 'bm_audit',
      'proj_view', 'proj_eval', 'proj_self_score',
      'rep_usage', 'rep_cost', 'rep_unit', 'rep_carbon', 'rep_print',
      'cfg_factor', 'cfg_price', 'cfg_convert',
    ],
  },
  {
    id: 'role_park_mgr',
    code: 'ROLE_PARK_MANAGER',
    name: '园区能管主管',
    type: 'preset',
    desc: '负责直属制造公司与工业园区整体用能监管、微电网调控、数据审批与对标推进',
    userCount: 12,
    dataScopeDefault: 'company',
    menuPermissions: [
      'screen_view', 'ind_view', 'ind_detail', 'ind_export',
      'online_view', 'online_realtime', 'online_export', 'grid_view', 'grid_ctrl',
      'carbon_view', 'carbon_offset',
      'str_view', 'cost_view', 'prod_view', 'prod_ledger', 'out_view', 'out_yoy', 'bm_view',
      'proj_view', 'proj_add', 'proj_eval',
      'rep_usage', 'rep_cost', 'rep_unit', 'rep_carbon',
      'cfg_entry', 'cfg_convert',
    ],
  },
  {
    id: 'role_reporter',
    code: 'ROLE_FACTORY_REPORTER',
    name: '工厂能耗申报员',
    type: 'preset',
    desc: '负责具体车间、工序离线能源介质数据录入、表计填报及本车间单耗台账查看',
    userCount: 26,
    dataScopeDefault: 'factory',
    menuPermissions: [
      'ind_view', 'online_view', 'prod_view', 'prod_ledger', 'out_view',
      'cfg_entry', 'cfg_convert',
    ],
  },
  {
    id: 'role_auditor',
    code: 'ROLE_AUDITOR',
    name: '审计合规专员',
    type: 'preset',
    desc: '拥有全系统配置、碳排因子、历史数据重算及报表导出的只读审计与溯源权限',
    userCount: 4,
    dataScopeDefault: 'all',
    menuPermissions: [
      'screen_view', 'ind_view', 'online_view', 'carbon_view',
      'str_view', 'cost_view', 'prod_view', 'out_view', 'bm_view',
      'proj_view', 'rep_usage', 'rep_cost', 'rep_unit', 'rep_carbon', 'rep_print',
      'cfg_factor', 'cfg_interface',
    ],
  },
]

export default function AccountPermissionPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'scope' | 'org'>('users')
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS)
  const [roles, setRoles] = useState<RoleModel[]>(INITIAL_ROLES)
  const [selectedRoleId, setSelectedRoleId] = useState<string>('role_admin')

  // 筛选状态
  const [searchKw, setSearchKw] = useState('')
  const [filterCompany, setFilterCompany] = useState('all')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  // 弹窗状态
  const [userModalOpen, setUserModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null)
  const [pwdModalOpen, setPwdModalOpen] = useState(false)
  const [pwdTargetUser, setPwdTargetUser] = useState<UserAccount | null>(null)
  const [newPwdVal, setNewPwdVal] = useState('Tbea@2026!')
  const [roleModalOpen, setRoleModalOpen] = useState(false)

  // 成功操作 Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  // 过滤后的用户列表
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (filterCompany !== 'all' && !u.company.includes(filterCompany)) return false
      if (filterRole !== 'all' && u.roleId !== filterRole) return false
      if (filterStatus !== 'all' && u.status !== filterStatus) return false
      if (searchKw) {
        const kw = searchKw.toLowerCase()
        return (
          u.name.toLowerCase().includes(kw) ||
          u.account.toLowerCase().includes(kw) ||
          u.workNo.toLowerCase().includes(kw) ||
          u.dept.toLowerCase().includes(kw)
        )
      }
      return true
    })
  }, [users, filterCompany, filterRole, filterStatus, searchKw])

  // 当前选中角色
  const selectedRole = useMemo(() => {
    return roles.find((r) => r.id === selectedRoleId) || roles[0]
  }, [roles, selectedRoleId])

  // 切换角色权限勾选
  const handleTogglePermission = (actId: string) => {
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id !== selectedRoleId) return r
        const has = r.menuPermissions.includes(actId)
        const updated = has
          ? r.menuPermissions.filter((id) => id !== actId)
          : [...r.menuPermissions, actId]
        return { ...r, menuPermissions: updated }
      })
    )
  }

  // 全选/反选某一模块权限
  const handleToggleModuleAll = (node: PermissionNode) => {
    const allActIds: string[] = []
    const collect = (n: PermissionNode) => {
      if (n.actions) {
        n.actions.forEach((a) => allActIds.push(a.id))
      }
      if (n.children) {
        n.children.forEach(collect)
      }
    }
    collect(node)

    const isAllChecked = allActIds.every((id) => selectedRole.menuPermissions.includes(id))
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id !== selectedRoleId) return r
        let nextPerms = [...r.menuPermissions]
        if (isAllChecked) {
          nextPerms = nextPerms.filter((id) => !allActIds.includes(id))
        } else {
          allActIds.forEach((id) => {
            if (!nextPerms.includes(id)) nextPerms.push(id)
          })
        }
        return { ...r, menuPermissions: nextPerms }
      })
    )
  }

  // 切换用户状态 (启用/停用)
  const handleToggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextStatus = u.status === '启用' ? '停用' : '启用'
          showToast(`已${nextStatus}账号【${u.name} (${u.account})】`)
          return { ...u, status: nextStatus }
        }
        return u
      })
    )
  }

  // 保存用户表单 (新增 / 编辑)
  const handleSaveUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    const name = formData.get('name') as string
    const workNo = formData.get('workNo') as string
    const account = formData.get('account') as string
    const company = formData.get('company') as string
    const dept = formData.get('dept') as string
    const roleId = formData.get('roleId') as string
    const dataScopeType = formData.get('dataScopeType') as any
    const phone = formData.get('phone') as string
    const email = formData.get('email') as string

    const targetRole = roles.find((r) => r.id === roleId) || roles[0]

    let scopeText = '全集团'
    if (dataScopeType === 'company') scopeText = `${company} (含下属全部车间)`
    if (dataScopeType === 'factory') scopeText = `${dept} (仅本级车间)`

    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                name,
                workNo,
                account,
                company,
                dept,
                roleId,
                roleName: targetRole.name,
                dataScopeType,
                dataScopeText: scopeText,
                phone,
                email,
              }
            : u
        )
      )
      showToast(`已成功更新用户【${name}】账号信息`)
    } else {
      const newUser: UserAccount = {
        id: `usr_${Date.now()}`,
        name,
        workNo,
        account,
        company,
        dept,
        roleId,
        roleName: targetRole.name,
        dataScopeType,
        dataScopeText: scopeText,
        phone,
        email,
        status: '启用',
        lastLoginTime: '刚刚创建 · 未登录',
        lastLoginIp: '-',
      }
      setUsers((prev) => [newUser, ...prev])
      showToast(`已成功创建账号【${name} (${account})】`)
    }

    setUserModalOpen(false)
    setEditingUser(null)
  }

  return (
    <div className="space-y-3.5">
      {/* 顶部 Header */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
            <Users className="size-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">账号权限管理</h1>
            <p className="text-xs text-slate-500 font-sans">
              基于特变电工集团组织架构实现统一账号、预设与自定义角色、功能菜单树与园区/工厂数据范围细粒度权限管控
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setEditingUser(null)
              setUserModalOpen(true)
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white font-semibold text-xs cursor-pointer shadow-xs transition-colors"
          >
            <UserPlus className="size-3.5" />
            <span>新增账号</span>
          </button>
          <button
            type="button"
            onClick={() => setRoleModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs cursor-pointer shadow-2xs transition-colors"
          >
            <ShieldCheck className="size-3.5 text-purple-600" />
            <span>创建自定义角色</span>
          </button>
          <button
            type="button"
            onClick={() => alert('正在导出全集团能碳管理人员权限名单 (Excel)...')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs cursor-pointer shadow-2xs transition-colors"
          >
            <Download className="size-3.5 text-slate-500" />
            <span>导出名册</span>
          </button>
        </div>
      </div>

      {/* 状态 Toast */}
      {toastMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span className="font-sans font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Tab 导航 */}
      <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1 font-sans text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer select-none',
            activeTab === 'users'
              ? 'bg-blue-50 text-[#1677ff] font-bold border border-blue-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          )}
        >
          <Users className="size-3.5" />
          <span>用户账号列表 ({users.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('roles')}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer select-none',
            activeTab === 'roles'
              ? 'bg-blue-50 text-[#1677ff] font-bold border border-blue-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          )}
        >
          <ShieldCheck className="size-3.5" />
          <span>角色与功能权限树 ({roles.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('scope')}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer select-none',
            activeTab === 'scope'
              ? 'bg-blue-50 text-[#1677ff] font-bold border border-blue-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          )}
        >
          <SlidersHorizontal className="size-3.5" />
          <span>数据范围权限矩阵</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('org')}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer select-none',
            activeTab === 'org'
              ? 'bg-blue-50 text-[#1677ff] font-bold border border-blue-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          )}
        >
          <FolderTree className="size-3.5" />
          <span>组织架构与权责拓扑</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* Tab 1: 用户账号列表 */}
      {/* ========================================================================= */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs space-y-3.5 p-4">
          {/* 筛选过滤工具条 */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="relative">
                <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索姓名、工号、账号或部门..."
                  value={searchKw}
                  onChange={(e) => setSearchKw(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs w-64 focus:bg-white focus:outline-none focus:border-[#1677ff]"
                />
              </div>

              <select
                value={filterCompany}
                onChange={(e) => setFilterCompany(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#1677ff]"
              >
                <option value="all">全部所属公司</option>
                <option value="电装集团">电装集团总部</option>
                <option value="沈变">沈变公司</option>
                <option value="衡变">衡变公司</option>
                <option value="新变">新变厂</option>
                <option value="鲁缆">鲁缆公司</option>
                <option value="新缆">新缆厂</option>
                <option value="德缆">德缆公司</option>
              </select>

              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#1677ff]"
              >
                <option value="all">全部角色类型</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#1677ff]"
              >
                <option value="all">全部状态</option>
                <option value="启用">正常启用</option>
                <option value="停用">已停用</option>
              </select>
            </div>

            <div className="text-xs text-slate-500 font-mono">
              共查询到 <strong className="text-[#1677ff] font-bold">{filteredUsers.length}</strong> 位人员账号
            </div>
          </div>

          {/* 账号表格 */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3">人员姓名 / 工号</th>
                  <th className="py-2.5 px-3">登录账号</th>
                  <th className="py-2.5 px-3">所属公司与部门</th>
                  <th className="py-2.5 px-3">系统角色</th>
                  <th className="py-2.5 px-3">数据权限范围</th>
                  <th className="py-2.5 px-3">账号状态</th>
                  <th className="py-2.5 px-3">最近登录时间</th>
                  <th className="py-2.5 px-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <div className="size-6 rounded-full bg-blue-100 text-[#1677ff] font-mono text-[11px] font-bold flex items-center justify-center">
                          {user.name.slice(0, 1)}
                        </div>
                        <span>{user.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{user.workNo}</div>
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-700">{user.account}</td>

                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800">{user.company}</div>
                      <div className="text-[11px] text-slate-400">{user.dept}</div>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border',
                          user.roleId === 'role_admin'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : user.roleId === 'role_director'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : user.roleId === 'role_park_mgr'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        )}
                      >
                        {user.roleName}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-[11px] text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 block max-w-xs truncate" title={user.dataScopeText}>
                        {user.dataScopeText}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium',
                          user.status === '启用' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        )}
                      >
                        <span className={cn('size-1.5 rounded-full', user.status === '启用' ? 'bg-emerald-500' : 'bg-slate-400')} />
                        {user.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                      <div>{user.lastLoginTime}</div>
                      <div className="text-[10px] text-slate-400">IP: {user.lastLoginIp}</div>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingUser(user)
                            setUserModalOpen(true)
                          }}
                          className="text-[#1677ff] hover:underline font-medium cursor-pointer"
                        >
                          编辑
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setPwdTargetUser(user)
                            setNewPwdVal('Tbea@2026!')
                            setPwdModalOpen(true)
                          }}
                          className="text-slate-600 hover:text-slate-900 hover:underline cursor-pointer"
                        >
                          重置密码
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleUserStatus(user.id)}
                          className={cn(
                            'hover:underline cursor-pointer font-medium',
                            user.status === '启用' ? 'text-amber-600' : 'text-emerald-600'
                          )}
                        >
                          {user.status === '启用' ? '停用' : '启用'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Tab 2: 角色与功能权限树 */}
      {/* ========================================================================= */}
      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
          {/* 左侧 4/12: 角色列表 */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs p-3.5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-[#1677ff]" />
                角色模型清单 ({roles.length})
              </h3>
              <button
                type="button"
                onClick={() => setRoleModalOpen(true)}
                className="text-xs text-[#1677ff] font-bold hover:underline cursor-pointer"
              >
                + 新增角色
              </button>
            </div>

            <div className="space-y-2">
              {roles.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setSelectedRoleId(r.id)}
                  className={cn(
                    'p-3 rounded-lg border text-xs cursor-pointer transition-all space-y-1.5',
                    selectedRoleId === r.id
                      ? 'bg-blue-50/70 border-[#1677ff] ring-2 ring-blue-100'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      {r.name}
                      {r.type === 'preset' ? (
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1 rounded font-normal">预设</span>
                      ) : (
                        <span className="text-[10px] bg-purple-50 text-purple-700 px-1 rounded font-normal">自定义</span>
                      )}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{r.userCount} 人</span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 右侧 8/12: 功能菜单与按钮权限配置树 */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>【{selectedRole.name}】功能菜单与按钮操作权限授权</span>
                  <span className="text-xs font-mono text-slate-400 font-normal">({selectedRole.code})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedRole.desc}</p>
              </div>

              <button
                type="button"
                onClick={() => showToast(`已成功保存并下发角色【${selectedRole.name}】的全新权限配置！`)}
                className="px-3.5 py-1.5 bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer transition-colors"
              >
                保存权限设定
              </button>
            </div>

            {/* 权限树列表 */}
            <div className="space-y-3">
              {PERMISSION_TREE_DATA.map((module) => {
                return (
                  <div key={module.id} className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                    {/* 模块标题栏 */}
                    <div className="bg-slate-50/80 px-3.5 py-2.5 flex items-center justify-between border-b border-slate-200">
                      <span className="font-bold text-slate-800 font-sans flex items-center gap-2">
                        <FolderTree className="size-4 text-blue-600" />
                        {module.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleModuleAll(module)}
                        className="text-[11px] text-[#1677ff] font-medium hover:underline cursor-pointer"
                      >
                        模块全选 / 反选
                      </button>
                    </div>

                    <div className="p-3 bg-white space-y-3">
                      {/* 直接 actions */}
                      {module.actions && (
                        <div className="flex flex-wrap gap-3">
                          {module.actions.map((act) => {
                            const isChecked = selectedRole.menuPermissions.includes(act.id)
                            return (
                              <label
                                key={act.id}
                                onClick={() => handleTogglePermission(act.id)}
                                className={cn(
                                  'flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-xs cursor-pointer select-none transition-all',
                                  isChecked
                                    ? 'bg-blue-50/70 border-blue-300 text-blue-900 font-medium'
                                    : 'bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                )}
                              >
                                {isChecked ? (
                                  <CheckSquare className="size-3.5 text-[#1677ff]" />
                                ) : (
                                  <Square className="size-3.5 text-slate-400" />
                                )}
                                <span>{act.label}</span>
                              </label>
                            )
                          })}
                        </div>
                      )}

                      {/* 子菜单 children */}
                      {module.children && (
                        <div className="space-y-2 pl-2 border-l-2 border-slate-100">
                          {module.children.map((child) => (
                            <div key={child.id} className="space-y-1.5">
                              <div className="font-medium text-slate-700 flex items-center gap-1.5">
                                <span className="size-1.5 rounded-full bg-slate-400" />
                                {child.title}
                              </div>
                              {child.actions && (
                                <div className="flex flex-wrap gap-2.5 pl-3">
                                  {child.actions.map((act) => {
                                    const isChecked = selectedRole.menuPermissions.includes(act.id)
                                    return (
                                      <label
                                        key={act.id}
                                        onClick={() => handleTogglePermission(act.id)}
                                        className={cn(
                                          'flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs cursor-pointer select-none transition-all',
                                          isChecked
                                            ? 'bg-blue-50/70 border-blue-300 text-blue-900 font-medium'
                                            : 'bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                        )}
                                      >
                                        {isChecked ? (
                                          <CheckSquare className="size-3.5 text-[#1677ff]" />
                                        ) : (
                                          <Square className="size-3.5 text-slate-400" />
                                        )}
                                        <span>{act.label}</span>
                                      </label>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Tab 3: 数据范围权限矩阵 */}
      {/* ========================================================================= */}
      {activeTab === 'scope' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-[#1677ff]" />
              各角色在特变电工 6 大直属制造公司的数据访问范围矩阵
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              根据集团分级风控规则，保障各工厂核心工艺数据、财务产值与单耗指标的隔离与授权穿透
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3">角色名称</th>
                  <th className="py-2.5 px-3">沈变公司 (6单位)</th>
                  <th className="py-2.5 px-3">衡变公司 (11单位)</th>
                  <th className="py-2.5 px-3">新变厂 (7单位)</th>
                  <th className="py-2.5 px-3">鲁缆公司 (4单位)</th>
                  <th className="py-2.5 px-3">新缆厂 (4单位)</th>
                  <th className="py-2.5 px-3">德缆公司 (3单位)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3 px-3 font-bold text-slate-900">集团超级管理员</td>
                  <td className="py-3 px-3 text-emerald-600 font-medium">全量读写 · 审计</td>
                  <td className="py-3 px-3 text-emerald-600 font-medium">全量读写 · 审计</td>
                  <td className="py-3 px-3 text-emerald-600 font-medium">全量读写 · 审计</td>
                  <td className="py-3 px-3 text-emerald-600 font-medium">全量读写 · 审计</td>
                  <td className="py-3 px-3 text-emerald-600 font-medium">全量读写 · 审计</td>
                  <td className="py-3 px-3 text-emerald-600 font-medium">全量读写 · 审计</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-slate-900">集团能碳总监</td>
                  <td className="py-3 px-3 text-blue-600 font-medium">全量查看 · 报表审批</td>
                  <td className="py-3 px-3 text-blue-600 font-medium">全量查看 · 报表审批</td>
                  <td className="py-3 px-3 text-blue-600 font-medium">全量查看 · 报表审批</td>
                  <td className="py-3 px-3 text-blue-600 font-medium">全量查看 · 报表审批</td>
                  <td className="py-3 px-3 text-blue-600 font-medium">全量查看 · 报表审批</td>
                  <td className="py-3 px-3 text-blue-600 font-medium">全量查看 · 报表审批</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-slate-900">园区能管主管</td>
                  <td className="py-3 px-3 text-blue-700 font-bold bg-blue-50/50">沈变辖区读写</td>
                  <td className="py-3 px-3 text-slate-400">无权限</td>
                  <td className="py-3 px-3 text-slate-400">无权限</td>
                  <td className="py-3 px-3 text-slate-400">无权限</td>
                  <td className="py-3 px-3 text-slate-400">无权限</td>
                  <td className="py-3 px-3 text-slate-400">无权限</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-slate-900">工厂能耗申报员</td>
                  <td className="py-3 px-3 text-amber-700 font-medium bg-amber-50/40">沈变本部数据填报</td>
                  <td className="py-3 px-3 text-slate-400">无权限</td>
                  <td className="py-3 px-3 text-slate-400">无权限</td>
                  <td className="py-3 px-3 text-slate-400">无权限</td>
                  <td className="py-3 px-3 text-slate-400">无权限</td>
                  <td className="py-3 px-3 text-slate-400">无权限</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-slate-900">审计合规专员</td>
                  <td className="py-3 px-3 text-slate-600 font-medium">只读留痕</td>
                  <td className="py-3 px-3 text-slate-600 font-medium">只读留痕</td>
                  <td className="py-3 px-3 text-slate-600 font-medium">只读留痕</td>
                  <td className="py-3 px-3 text-slate-600 font-medium">只读留痕</td>
                  <td className="py-3 px-3 text-slate-600 font-medium">只读留痕</td>
                  <td className="py-3 px-3 text-slate-600 font-medium">只读留痕</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Tab 4: 组织架构与权责拓扑 */}
      {/* ========================================================================= */}
      {activeTab === 'org' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FolderTree className="size-4 text-emerald-600" />
              特变电工（电装集团）多级组织架构管理与权限归属
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              维护 1 级集团、6 大二级直属制造单位与 30 个三级车间工厂的层级拓扑与负责人绑定
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {ENTERPRISE_TREE_DATA[0].children?.map((comp) => (
              <div key={comp.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Building2 className="size-4 text-[#1677ff]" />
                    {comp.name}
                  </span>
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-mono">
                    {comp.children?.length || 0} 个下属单位
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  {comp.children?.map((child) => (
                    <div
                      key={child.id}
                      className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between hover:border-blue-300 transition-colors"
                    >
                      <span className="text-slate-700 font-medium">{child.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">已配置权限</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 弹窗 1: 新增/编辑用户账号 Modal */}
      {/* ========================================================================= */}
      {userModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <UserPlus className="size-4 text-[#1677ff]" />
                {editingUser ? '编辑人员账号与权限' : '新增人员账号'}
              </h3>
              <button
                type="button"
                onClick={() => setUserModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-5 space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">人员姓名 *</label>
                  <input
                    name="name"
                    required
                    defaultValue={editingUser?.name || ''}
                    placeholder="如：李明"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#1677ff]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">员工工号 *</label>
                  <input
                    name="workNo"
                    required
                    defaultValue={editingUser?.workNo || `TB-${Math.floor(10000 + Math.random() * 90000)}`}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#1677ff]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-medium">登录账号 / 邮箱 *</label>
                <input
                  name="account"
                  type="email"
                  required
                  defaultValue={editingUser?.account || ''}
                  placeholder="如：liming@tbea.com"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#1677ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">所属直属公司 *</label>
                  <select
                    name="company"
                    defaultValue={editingUser?.company || '沈变公司'}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#1677ff]"
                  >
                    <option value="电装集团总部">电装集团总部</option>
                    <option value="沈变公司">沈变公司</option>
                    <option value="衡变公司">衡变公司</option>
                    <option value="新变厂">新变厂</option>
                    <option value="鲁缆公司">鲁缆公司</option>
                    <option value="新缆厂">新缆厂</option>
                    <option value="德缆公司">德缆公司</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">所属车间 / 部门 *</label>
                  <input
                    name="dept"
                    required
                    defaultValue={editingUser?.dept || '超高压变压器制造部'}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#1677ff]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-medium">分配系统角色 *</label>
                <select
                  name="roleId"
                  defaultValue={editingUser?.roleId || 'role_park_mgr'}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#1677ff]"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.desc.slice(0, 20)}...)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-medium">数据权限范围 *</label>
                <select
                  name="dataScopeType"
                  defaultValue={editingUser?.dataScopeType || 'company'}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#1677ff]"
                >
                  <option value="all">全集团 (可查阅全部6大公司及下属工厂)</option>
                  <option value="company">本直属公司 (仅本公司及辖区内全部车间)</option>
                  <option value="factory">仅限本车间/工厂 (细粒度工厂级填报)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">手机号码</label>
                  <input
                    name="phone"
                    defaultValue={editingUser?.phone || '13800000000'}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#1677ff]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">初始登录密码</label>
                  <input
                    disabled={!!editingUser}
                    defaultValue="Tbea@2026!"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono bg-slate-50 text-slate-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUserModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  确认保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 弹窗 2: 重置密码 Modal */}
      {/* ========================================================================= */}
      {pwdModalOpen && pwdTargetUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <KeyRound className="size-4 text-amber-500" />
                重置用户密码
              </h3>
              <button
                type="button"
                onClick={() => setPwdModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs font-sans">
              <p className="text-slate-600">
                正在为用户 <strong className="text-slate-900">【{pwdTargetUser.name}】</strong>（{pwdTargetUser.account}）重置登录密码：
              </p>

              <div className="space-y-1">
                <label className="text-slate-700 font-medium">新密码</label>
                <div className="flex items-center gap-2">
                  <input
                    value={newPwdVal}
                    onChange={(e) => setNewPwdVal(e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#1677ff]"
                  />
                  <button
                    type="button"
                    onClick={() => setNewPwdVal(`TB@${Math.floor(100000 + Math.random() * 900000)}`)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-mono cursor-pointer"
                  >
                    随机生成
                  </button>
                </div>
              </div>

              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px]">
                密码重置后，用户首次登录将被强制要求修改密码，并记录审计日志。
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPwdModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast(`已成功为【${pwdTargetUser.name}】重置密码为：${newPwdVal}`)
                    setPwdModalOpen(false)
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  确认重置
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 弹窗 3: 创建自定义角色 Modal */}
      {/* ========================================================================= */}
      {roleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="size-4 text-purple-600" />
                创建自定义权限角色
              </h3>
              <button
                type="button"
                onClick={() => setRoleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.currentTarget
                const formData = new FormData(form)
                const roleName = formData.get('roleName') as string
                const roleCode = formData.get('roleCode') as string
                const desc = formData.get('desc') as string

                const newRole: RoleModel = {
                  id: `role_${Date.now()}`,
                  code: roleCode,
                  name: roleName,
                  type: 'custom',
                  desc,
                  userCount: 0,
                  dataScopeDefault: 'company',
                  menuPermissions: ['screen_view', 'ind_view', 'online_view', 'prod_view'],
                }
                setRoles((prev) => [...prev, newRole])
                setSelectedRoleId(newRole.id)
                setRoleModalOpen(false)
                showToast(`已成功创建自定义角色【${roleName}】！请在右侧继续配置详细功能权限。`)
              }}
              className="p-5 space-y-3.5 text-xs font-sans"
            >
              <div className="space-y-1">
                <label className="text-slate-700 font-medium">角色名称 *</label>
                <input
                  name="roleName"
                  required
                  placeholder="如：绿电交易核算专员"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#1677ff]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-medium">角色编码 *</label>
                <input
                  name="roleCode"
                  required
                  placeholder="如：ROLE_GREEN_POWER_TRADER"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#1677ff]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-medium">角色职责与使用场景描述</label>
                <textarea
                  name="desc"
                  rows={3}
                  placeholder="描述该角色的业务范围、可操作的子系统模块与职责边界..."
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#1677ff]"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRoleModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  创建并前往授权
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
