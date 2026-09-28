'use client'

import { useState, useMemo } from 'react'
import {
  ShieldCheck,
  Plus,
  Users,
  Check,
  Leaf,
  Zap,
  Settings,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Search,
  Folder,
  FileText,
  Pencil,
  Trash2,
} from 'lucide-react'
import { Panel } from '@/components/shared/primitives'
import { Modal } from '@/components/shared/modal'
import { Field, inputCls, ActionBtn } from '@/components/system/ui'
import { cn } from '@/lib/utils'

export const DATA_SCOPE_OPTIONS = [
  { value: '全集团', label: '全集团 (全域可穿透)' },
  { value: '所辖园区', label: '所辖园区 (园区级调度与核算)' },
  { value: '本经营单位', label: '本经营单位 (单体经营主体)' },
  { value: '所属单体工厂', label: '所属单体工厂 (制造产线级)' },
  { value: '全集团（只读）', label: '全集团（只读审计）' },
]

export interface PermAction {
  id: string
  label: string
}

export interface PermPage {
  id: string
  name: string
  actions: PermAction[]
}

export interface PermModule {
  id: string
  name: string
  pages: PermPage[]
}

export interface PlatformPerm {
  id: 'procurement' | 'control' | 'system'
  name: string
  shortName: string
  color: string
  icon: any
  modules: PermModule[]
}

/* 3大平台标准化 3 级权限架构字典：1级业务模块 ➔ 2级功能垂直布局 ➔ 3级操作权限点简洁直观便于操作 */
export const PLATFORM_PERMS: PlatformPerm[] = [
  {
    id: 'procurement',
    name: '产品碳足迹集采中心',
    shortName: '集采',
    color: '#00D492',
    icon: Leaf,
    modules: [
      {
        id: 'cf_mod_cockpit',
        name: '对外示范窗口',
        pages: [
          {
            id: 'cf_page_cockpit',
            name: '碳足迹驾驶舱',
            actions: [
              { id: 'cf_cockpit:view', label: '查看驾驶舱' },
              { id: 'cf_cockpit:export', label: '指标数据导出' },
              { id: 'cf_cockpit:drilldown', label: '态势深度下钻' },
            ],
          },
        ],
      },
      {
        id: 'cf_mod_analysis',
        name: '碳足迹多维分析',
        pages: [
          {
            id: 'cf_page_compare',
            name: '横向对比',
            actions: [
              { id: 'cf_analysis:compare', label: '综合产品对比' },
              { id: 'cf_analysis:benchmark', label: '行业标杆对标' },
              { id: 'cf_analysis:export', label: '对比报告导出' },
            ],
          },
          {
            id: 'cf_page_ranking',
            name: '纵向对比',
            actions: [
              { id: 'cf_analysis:process', label: '工序能碳下钻' },
              { id: 'cf_analysis:ranking', label: '纵向趋势追踪' },
            ],
          },
        ],
      },
      {
        id: 'cf_mod_database',
        name: '实景数据库与核算台账',
        pages: [
          {
            id: 'cf_page_db',
            name: '实景数据库',
            actions: [
              { id: 'cf_database:view', label: '实景台账查看' },
              { id: 'cf_database:supply', label: '供应链溯源分析' },
              { id: 'cf_database:maintain', label: '实景数据维护' },
            ],
          },
          {
            id: 'cf_page_calc',
            name: '碳足迹核算',
            actions: [
              { id: 'cf_database:input', label: '碳足迹核算录入' },
              { id: 'cf_database:release', label: '核算基准发布' },
            ],
          },
          {
            id: 'cf_page_report',
            name: '碳足迹报告',
            actions: [
              { id: 'cf_database:export', label: '台账全量导出' },
              { id: 'cf_database:archive', label: '报告生成与归档' },
            ],
          },
        ],
      },
      {
        id: 'cf_mod_factor',
        name: '因子库管理',
        pages: [
          {
            id: 'cf_page_factor',
            name: '标准因子库',
            actions: [
              { id: 'cf_factor:search', label: '因子库检索' },
              { id: 'cf_factor:add', label: '新增省局/行业因子' },
              { id: 'cf_factor:edit', label: '因子版本维护' },
              { id: 'cf_factor:disable', label: '废止/停用因子' },
              { id: 'cf_factor:import', label: '批量导入' },
            ],
          },
        ],
      },
      {
        id: 'cf_mod_cbam',
        name: 'CBAM 碳关税管理',
        pages: [
          {
            id: 'cf_page_cbam_comp',
            name: '合规管理',
            actions: [
              { id: 'cf_cbam:view', label: '申报台账查看' },
              { id: 'cf_cbam:gap', label: '合规差距自查' },
            ],
          },
          {
            id: 'cf_page_cbam_decl',
            name: '申报模拟',
            actions: [
              { id: 'cf_cbam:calc', label: '碳关税测算模拟' },
              { id: 'cf_cbam:export', label: '申报报表导出' },
            ],
          },
          {
            id: 'cf_page_cbam_kb',
            name: '知识库',
            actions: [
              { id: 'cf_cbam:kb_view', label: '规则政策查阅' },
              { id: 'cf_cbam:kb_edit', label: '知识库维护' },
            ],
          },
        ],
      },
      {
        id: 'cf_mod_cert',
        name: '第三方认证管理',
        pages: [
          {
            id: 'cf_page_cert',
            name: '认证项目管理',
            actions: [
              { id: 'cf_cert:register', label: '认证项目登记' },
              { id: 'cf_cert:apply', label: '认证申请发起' },
              { id: 'cf_cert:material', label: '佐证材料归档' },
              { id: 'cf_cert:result', label: '证书结果录入' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'control',
    name: '零碳园区集控中心',
    shortName: '集控',
    color: '#2C7CFF',
    icon: Zap,
    modules: [
      {
        id: 'zc_mod_screen',
        name: '集控中心大屏',
        pages: [
          {
            id: 'zc_page_screen_exec',
            name: '全景屏幕大屏',
            actions: [
              { id: 'zc_screen:exec', label: '零碳园区集成大屏' },
              { id: 'zc_screen:switch', label: '多园区自由切换' },
            ],
          },
          {
            id: 'zc_page_screen_cockpit',
            name: '综合集控大屏',
            actions: [
              { id: 'zc_screen:cockpit', label: '领导决策驾驶舱指标' },
              { id: 'zc_screen:link', label: '园区大屏联动' },
            ],
          },
        ],
      },
      {
        id: 'zc_mod_monitor',
        name: '集中监管 (实时监控)',
        pages: [
          {
            id: 'zc_page_indicator',
            name: '指标管控',
            actions: [
              { id: 'zc_mon:indicator', label: '指标偏差监控' },
              { id: 'zc_mon:indicator_drill', label: '10大指标深度下钻' },
            ],
          },
          {
            id: 'zc_page_usage',
            name: '用能在线监测',
            actions: [
              { id: 'zc_mon:usage', label: '用能实时监测' },
              { id: 'zc_mon:usage_switch', label: '能源介质切换' },
              { id: 'zc_mon:usage_export', label: '用能明细导出' },
            ],
          },
          {
            id: 'zc_page_equip',
            name: '生产用电设备',
            actions: [
              { id: 'zc_mon:equipment', label: '设备在线监测' },
              { id: 'zc_mon:equipment_param', label: '运行参数拉取' },
            ],
          },
          {
            id: 'zc_page_microgrid',
            name: '工业微电网监测',
            actions: [
              { id: 'zc_mon:microgrid', label: '工业微网监测' },
              { id: 'zc_mon:microgrid_balance', label: '发用网储综合平衡' },
            ],
          },
          {
            id: 'zc_page_carbon',
            name: '碳排放排放监测',
            actions: [
              { id: 'zc_mon:carbon', label: '碳排放实时监测' },
              { id: 'zc_mon:alarm', label: '范围规则与推送' },
            ],
          },
        ],
      },
      {
        id: 'zc_mod_energy',
        name: '能耗能效分析',
        pages: [
          {
            id: 'zc_page_struct',
            name: '用能结构分析',
            actions: [
              { id: 'zc_energy:cost', label: '能源成本看板' },
              { id: 'zc_energy:structure', label: '用能结构分析' },
              { id: 'zc_energy:composite', label: '综合能耗分析' },
            ],
          },
          {
            id: 'zc_page_bench',
            name: '能效对标分析',
            actions: [
              { id: 'zc_energy:benchmark', label: '能效对标分析' },
              { id: 'zc_energy:unit_product', label: '单位产品能耗' },
              { id: 'zc_energy:unit_output', label: '万元产值能耗' },
            ],
          },
        ],
      },
      {
        id: 'zc_mod_accounting',
        name: '碳核算与评估',
        pages: [
          {
            id: 'zc_page_carbon_acc',
            name: '碳核算与报告',
            actions: [
              { id: 'zc_carbon:online', label: '碳排放在线监测' },
              { id: 'zc_carbon:accounting', label: '碳排放核算与报告' },
              { id: 'zc_carbon:report', label: '碳盘查报告生成' },
              { id: 'zc_carbon:export', label: '碳数据导出' },
            ],
          },
          {
            id: 'zc_page_proj_self',
            name: '专项能效与自评估',
            actions: [
              { id: 'zc_proj:self', label: '零碳工厂自评估' },
              { id: 'zc_proj:benefit', label: '节能效益评估' },
              { id: 'zc_proj:retrofit', label: '技改项目综合监控' },
              { id: 'zc_proj:archive', label: '项目档案归档' },
            ],
          },
        ],
      },
      {
        id: 'zc_mod_reports',
        name: '统计报表中心',
        pages: [
          {
            id: 'zc_page_rep_all',
            name: '统计报表与批量导出',
            actions: [
              { id: 'zc_rep:usage', label: '用能统计报表' },
              { id: 'zc_rep:cost', label: '成本统计报表' },
              { id: 'zc_rep:unit', label: '单耗统计报表' },
              { id: 'zc_rep:carbon', label: '碳排统计报表' },
              { id: 'zc_rep:export', label: '报表批量导出' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'system',
    name: '系统管理平台',
    shortName: '系统',
    color: '#8E73ED',
    icon: Settings,
    modules: [
      {
        id: 'sys_mod_perm',
        name: '权限管控',
        pages: [
          {
            id: 'sys_page_org_user',
            name: '组织与用户管理',
            actions: [
              { id: 'sys_perm:org', label: '组织管理' },
              { id: 'sys_perm:user', label: '用户管理' },
            ],
          },
          {
            id: 'sys_page_role_menu',
            name: '角色与功能权限',
            actions: [
              { id: 'sys_perm:role', label: '角色与权限' },
              { id: 'sys_perm:menu', label: '菜单与功能' },
            ],
          },
        ],
      },
      {
        id: 'sys_mod_factor',
        name: '能碳基础因子管理',
        pages: [
          {
            id: 'sys_page_factor',
            name: '标准因子库',
            actions: [
              { id: 'sys_factor:view', label: '基础因子查看' },
              { id: 'sys_factor:add', label: '新增因子' },
              { id: 'sys_factor:edit', label: '编辑因子' },
              { id: 'sys_factor:disable', label: '停用/废止' },
              { id: 'sys_factor:io', label: '批量导入导出' },
            ],
          },
        ],
      },
      {
        id: 'sys_mod_price',
        name: '电价模型配置',
        pages: [
          {
            id: 'sys_page_price',
            name: '电价模型维护',
            actions: [
              { id: 'sys_price:tou', label: '时段配置' },
              { id: 'sys_price:ladder', label: '阶梯电价维护' },
              { id: 'sys_price:coef', label: '尖峰平谷系数' },
              { id: 'sys_price:history', label: '费价历史回溯' },
            ],
          },
        ],
      },
      {
        id: 'sys_mod_prod',
        name: '产品型号管理',
        pages: [
          {
            id: 'sys_page_prod',
            name: '型号工序与基准',
            actions: [
              { id: 'sys_prod:model', label: '型号字典库' },
              { id: 'sys_prod:route', label: '工序路线绑定' },
              { id: 'sys_prod:bind', label: '能耗基准绑定' },
            ],
          },
        ],
      },
      {
        id: 'sys_mod_log',
        name: '日志管理',
        pages: [
          {
            id: 'sys_page_log',
            name: '操作与安全审计',
            actions: [
              { id: 'sys_log:op', label: '操作审计日志' },
              { id: 'sys_log:login', label: '登录安全日志' },
              { id: 'sys_log:export', label: '日志全量导出' },
            ],
          },
        ],
      },
    ],
  },
]

// 提取全量功能权限 ID 列表
export const ALL_ACTION_IDS: string[] = PLATFORM_PERMS.flatMap((p) =>
  p.modules.flatMap((m) => m.pages.flatMap((pg) => pg.actions.map((a) => a.id))),
)

// 提取所有模块 ID
export const ALL_MODULE_IDS: string[] = PLATFORM_PERMS.flatMap((p) =>
  p.modules.map((m) => m.id),
)

// 平台动作映射函数
function getPlatformActionIds(platform: PlatformPerm): string[] {
  return platform.modules.flatMap((m) => m.pages.flatMap((pg) => pg.actions.map((a) => a.id)))
}

export interface RoleDef {
  id: string
  name: string
  scope: string
  desc: string
  users: number
  builtin: boolean
  perms: string[]
}

const INITIAL_ROLES: RoleDef[] = [
  {
    id: 'superadmin',
    name: '集团管理员',
    scope: '全集团',
    desc: '集团最高层级权限，可同时管理与管控集采、集控、系统管理 3 个平台的全部功能与数据。',
    users: 2,
    builtin: true,
    perms: [...ALL_ACTION_IDS],
  },
  {
    id: 'park_mgr',
    name: '园区管理员',
    scope: '所辖园区',
    desc: '负责所辖园区的能效实时调度与集采业务核算，具备园区级管理权限。',
    users: 6,
    builtin: true,
    perms: [
      // 集控中心全量
      ...getPlatformActionIds(PLATFORM_PERMS[1]),
      // 集采中心核心功能
      'cf_cockpit:view',
      'cf_cockpit:export',
      'cf_cockpit:drilldown',
      'cf_analysis:compare',
      'cf_analysis:benchmark',
      'cf_analysis:export',
      'cf_database:view',
      'cf_database:supply',
      'cf_cbam:view',
      'cf_cbam:gap',
      // 系统平台
      'sys_perm:role',
      'sys_factor:view',
      'sys_log:op',
    ],
  },
  {
    id: 'business_unit',
    name: '经营单位',
    scope: '本经营单位',
    desc: '单体经营主体业务角色，负责各分公司/厂区自身能效报表查看与产品碳足迹数据申报。',
    users: 23,
    builtin: false,
    perms: [
      'zc_mon:indicator',
      'zc_mon:usage',
      'zc_mon:equipment',
      'zc_energy:cost',
      'zc_energy:unit_product',
      'zc_energy:unit_output',
      'zc_rep:usage',
      'zc_rep:cost',
      'cf_cockpit:view',
      'cf_analysis:compare',
      'cf_analysis:export',
      'cf_database:view',
      'cf_factor:search',
      'cf_cbam:view',
      'cf_cert:register',
    ],
  },
  {
    id: 'energy_specialist',
    name: '节能专员',
    scope: '所辖园区',
    desc: '聚焦园区节能技改与能效对标分析，负责实时能源在线监控、微电网运行与自评估申报。',
    users: 11,
    builtin: false,
    perms: [
      // 集控中心全量
      ...getPlatformActionIds(PLATFORM_PERMS[1]),
      // 集采中心
      'cf_cockpit:view',
      'cf_analysis:compare',
      'cf_database:view',
    ],
  },
  {
    id: 'auditor',
    name: '审计员',
    scope: '全集团（只读）',
    desc: '集团审计与合规风控岗位，具备跨平台只读权限与全量日志审查能力。',
    users: 1,
    builtin: true,
    perms: [
      'zc_mon:indicator',
      'zc_mon:usage',
      'zc_carbon:accounting',
      'zc_carbon:report',
      'zc_rep:usage',
      'zc_rep:carbon',
      'cf_cockpit:view',
      'cf_analysis:compare',
      'cf_database:view',
      'cf_cbam:view',
      'sys_factor:view',
      'sys_log:op',
      'sys_log:login',
    ],
  },
]

export function RoleSection() {
  const [roleList, setRoleList] = useState<RoleDef[]>(INITIAL_ROLES)
  const [selectedId, setSelectedId] = useState<string>(INITIAL_ROLES[0].id)
  const [activePlatform, setActivePlatform] = useState<'procurement' | 'control' | 'system'>('procurement')

  // 1 级业务模块展开状态（默认全展开）
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    () => new Set(ALL_MODULE_IDS),
  )

  // 搜索关键词
  const [searchQuery, setSearchQuery] = useState('')

  // 权限映射表
  const [rolePermMap, setRolePermMap] = useState<Record<string, string[]>>(() => {
    const map: Record<string, string[]> = {}
    INITIAL_ROLES.forEach((r) => {
      map[r.id] = r.perms
    })
    return map
  })

  const [saveSuccess, setSaveSuccess] = useState(false)

  // 新增角色弹窗
  const [addOpen, setAddOpen] = useState(false)
  const [newRoleName, setNewRoleName] = useState('')
  const [newRoleScope, setNewRoleScope] = useState('所辖园区')
  const [newRoleDesc, setNewRoleDesc] = useState('')

  // 修改角色弹窗
  const [editOpen, setEditOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<RoleDef | null>(null)
  const [editRoleName, setEditRoleName] = useState('')
  const [editRoleScope, setEditRoleScope] = useState('所辖园区')
  const [editRoleDesc, setEditRoleDesc] = useState('')

  const currentRole = useMemo(
    () => roleList.find((r) => r.id === selectedId) || roleList[0],
    [roleList, selectedId],
  )

  const currentPerms = useMemo(
    () => new Set(rolePermMap[currentRole.id] || []),
    [rolePermMap, currentRole.id],
  )

  // 统计各平台已选数量
  const platformStats = useMemo(() => {
    const stats: Record<string, { selected: number; total: number }> = {}
    PLATFORM_PERMS.forEach((p) => {
      const allActionIds = getPlatformActionIds(p)
      const selectedCount = allActionIds.filter((id) => currentPerms.has(id)).length
      stats[p.id] = { selected: selectedCount, total: allActionIds.length }
    })
    return stats
  }, [currentPerms])

  // 1 级业务模块展开/折叠
  const toggleModuleExpand = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev)
      if (next.has(moduleId)) next.delete(moduleId)
      else next.add(moduleId)
      return next
    })
  }

  const handleExpandAll = () => {
    setExpandedModules(new Set(ALL_MODULE_IDS))
  }

  const handleCollapseAll = () => {
    setExpandedModules(new Set())
  }

  // 切换单个 3 级操作权限点
  const handleToggleAction = (actionId: string) => {
    setRolePermMap((prev) => {
      const set = new Set(prev[currentRole.id] || [])
      if (set.has(actionId)) set.delete(actionId)
      else set.add(actionId)
      return { ...prev, [currentRole.id]: Array.from(set) }
    })
    setSaveSuccess(false)
  }

  // 切换 2 级功能页面全选（垂直行）
  const handleTogglePage = (page: PermPage) => {
    const actionIds = page.actions.map((a) => a.id)
    const allChecked = actionIds.every((id) => currentPerms.has(id))
    setRolePermMap((prev) => {
      const set = new Set(prev[currentRole.id] || [])
      if (allChecked) {
        actionIds.forEach((id) => set.delete(id))
      } else {
        actionIds.forEach((id) => set.add(id))
      }
      return { ...prev, [currentRole.id]: Array.from(set) }
    })
    setSaveSuccess(false)
  }

  // 切换 1 级业务模块全选
  const handleToggleModule = (mod: PermModule) => {
    const actionIds = mod.pages.flatMap((pg) => pg.actions.map((a) => a.id))
    const allChecked = actionIds.every((id) => currentPerms.has(id))
    setRolePermMap((prev) => {
      const set = new Set(prev[currentRole.id] || [])
      if (allChecked) {
        actionIds.forEach((id) => set.delete(id))
      } else {
        actionIds.forEach((id) => set.add(id))
      }
      return { ...prev, [currentRole.id]: Array.from(set) }
    })
    setSaveSuccess(false)
  }

  // 全选指定平台
  const handleSelectPlatformAll = (platformId: string) => {
    const p = PLATFORM_PERMS.find((item) => item.id === platformId)
    if (!p) return
    const pActionIds = getPlatformActionIds(p)
    setRolePermMap((prev) => {
      const set = new Set(prev[currentRole.id] || [])
      pActionIds.forEach((id) => set.add(id))
      return { ...prev, [currentRole.id]: Array.from(set) }
    })
    setSaveSuccess(false)
  }

  // 清空指定平台
  const handleClearPlatform = (platformId: string) => {
    const p = PLATFORM_PERMS.find((item) => item.id === platformId)
    if (!p) return
    const pActionIds = new Set(getPlatformActionIds(p))
    setRolePermMap((prev) => {
      const set = new Set(prev[currentRole.id] || [])
      pActionIds.forEach((id) => set.delete(id))
      return { ...prev, [currentRole.id]: Array.from(set) }
    })
    setSaveSuccess(false)
  }

  // 全选当前视图中所有节点
  const handleSelectAllVisible = () => {
    setRolePermMap((prev) => {
      const set = new Set(prev[currentRole.id] || [])
      visiblePlatforms.forEach((p) => {
        p.modules.forEach((m) => {
          m.pages.forEach((pg) => {
            pg.actions.forEach((a) => set.add(a.id))
          })
        })
      })
      return { ...prev, [currentRole.id]: Array.from(set) }
    })
    setSaveSuccess(false)
  }

  // 清空当前视图中所有节点
  const handleClearAllVisible = () => {
    setRolePermMap((prev) => {
      const set = new Set(prev[currentRole.id] || [])
      visiblePlatforms.forEach((p) => {
        p.modules.forEach((m) => {
          m.pages.forEach((pg) => {
            pg.actions.forEach((a) => set.delete(a.id))
          })
        })
      })
      return { ...prev, [currentRole.id]: Array.from(set) }
    })
    setSaveSuccess(false)
  }

  // 保存授权
  const handleSavePerms = () => {
    const activePermList = rolePermMap[currentRole.id] || []
    setRoleList((prev) =>
      prev.map((r) => (r.id === currentRole.id ? { ...r, perms: activePermList } : r)),
    )
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  // 打开修改角色弹窗
  const handleOpenEdit = (role: RoleDef) => {
    setEditingRole(role)
    setEditRoleName(role.name)
    setEditRoleScope(role.scope)
    setEditRoleDesc(role.desc)
    setEditOpen(true)
  }

  // 保存修改角色
  const handleSaveEditRole = () => {
    if (!editingRole) return
    if (!editRoleName.trim()) {
      alert('请填写角色名称！')
      return
    }
    setRoleList((prev) =>
      prev.map((r) =>
        r.id === editingRole.id
          ? {
              ...r,
              name: editRoleName.trim(),
              scope: editRoleScope,
              desc: editRoleDesc.trim(),
            }
          : r,
      ),
    )
    setEditOpen(false)
  }

  // 删除自定义角色
  const handleDeleteRole = () => {
    if (!editingRole || editingRole.builtin) return
    if (confirm(`确定要删除角色【${editingRole.name}】吗？删除后不可恢复。`)) {
      const remaining = roleList.filter((r) => r.id !== editingRole.id)
      setRoleList(remaining)
      if (selectedId === editingRole.id) {
        setSelectedId(remaining[0]?.id || '')
      }
      setEditOpen(false)
    }
  }

  // 创建新角色
  const handleCreateRole = () => {
    if (!newRoleName.trim()) {
      alert('请填写角色名称！')
      return
    }
    const newId = `R${String(roleList.length + 1).padStart(3, '0')}`
    const initialPerms: string[] = [
      'zc_mon:indicator',
      'zc_mon:usage',
      'cf_cockpit:view',
    ]

    const newRole: RoleDef = {
      id: newId,
      name: newRoleName.trim(),
      scope: newRoleScope || '所辖园区',
      desc: newRoleDesc.trim() || '自定义业务角色',
      users: 0,
      builtin: false,
      perms: initialPerms,
    }

    setRoleList((prev) => [...prev, newRole])
    setRolePermMap((prev) => ({ ...prev, [newId]: initialPerms }))
    setSelectedId(newId)
    setAddOpen(false)
    setNewRoleName('')
    setNewRoleScope('所辖园区')
    setNewRoleDesc('')
  }

  // 过滤展示的平台与搜索项
  const visiblePlatforms = useMemo(() => {
    const filtered = PLATFORM_PERMS.filter((p) => p.id === activePlatform)

    if (!searchQuery.trim()) return filtered

    const q = searchQuery.trim().toLowerCase()
    return filtered
      .map((p) => {
        const matchingModules = p.modules
          .map((m) => {
            const matchingPages = m.pages
              .map((pg) => {
                const matchActions = pg.actions.filter((a) =>
                  a.label.toLowerCase().includes(q),
                )
                if (pg.name.toLowerCase().includes(q) || matchActions.length > 0) {
                  return {
                    ...pg,
                    actions: pg.name.toLowerCase().includes(q) ? pg.actions : matchActions,
                  }
                }
                return null
              })
              .filter(Boolean) as PermPage[]

            if (m.name.toLowerCase().includes(q) || matchingPages.length > 0) {
              return {
                ...m,
                pages: m.name.toLowerCase().includes(q) ? m.pages : matchingPages,
              }
            }
            return null
          })
          .filter(Boolean) as PermModule[]

        if (p.name.toLowerCase().includes(q) || matchingModules.length > 0) {
          return {
            ...p,
            modules: p.name.toLowerCase().includes(q) ? p.modules : matchingModules,
          }
        }
        return null
      })
      .filter(Boolean) as PlatformPerm[]
  }, [activePlatform, searchQuery])

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
      {/* 左侧：角色列表 */}
      <Panel
        title="角色列表"
        icon={Users}
        actions={
          <ActionBtn variant="primary" onClick={() => setAddOpen(true)}>
            <Plus className="size-4" /> 新增角色
          </ActionBtn>
        }
      >
        <ul className="flex flex-col gap-2.5">
          {roleList.map((r) => {
            const isSel = r.id === selectedId
            const rolePerms = new Set(rolePermMap[r.id] || [])

            const cfCount = getPlatformActionIds(PLATFORM_PERMS[0]).filter((id) =>
              rolePerms.has(id),
            ).length
            const zcCount = getPlatformActionIds(PLATFORM_PERMS[1]).filter((id) =>
              rolePerms.has(id),
            ).length
            const sysCount = getPlatformActionIds(PLATFORM_PERMS[2]).filter((id) =>
              rolePerms.has(id),
            ).length

            return (
              <li key={r.id}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setSelectedId(r.id)
                    setSaveSuccess(false)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSelectedId(r.id)
                      setSaveSuccess(false)
                    }
                  }}
                  className={cn(
                    'w-full text-left p-3.5 rounded-lg border transition-all cursor-pointer select-none',
                    isSel
                      ? 'bg-blue-50/40 border-[#2C7CFF] ring-1 ring-[#2C7CFF] shadow-xs'
                      : 'bg-white border-[#DBE6EE] hover:border-slate-300 hover:bg-slate-50/60',
                  )}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">{r.name}</span>
                      {r.builtin ? (
                        <span className="px-1.5 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          内置
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-600 border border-amber-200">
                          自定义
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenEdit(r)
                        }}
                        title="修改角色"
                        className="p-1 text-slate-400 hover:text-primary hover:bg-slate-100 rounded transition-colors cursor-pointer"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <span className="text-xs text-muted-foreground font-mono">
                        {r.users} 名用户
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                    数据范围：{r.scope}
                  </p>

                  {/* 3 平台授权分布标签 */}
                  <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-100 text-[11px]">
                    <span
                      className={cn(
                        'px-1.5 py-0.5 rounded-sm font-mono transition-colors',
                        cfCount > 0
                          ? 'bg-emerald-50 text-emerald-700 font-medium border border-emerald-200/60'
                          : 'bg-slate-100 text-slate-400',
                      )}
                    >
                      集采 ({cfCount})
                    </span>
                    <span
                      className={cn(
                        'px-1.5 py-0.5 rounded-sm font-mono transition-colors',
                        zcCount > 0
                          ? 'bg-blue-50 text-blue-700 font-medium border border-blue-200/60'
                          : 'bg-slate-100 text-slate-400',
                      )}
                    >
                      集控 ({zcCount})
                    </span>
                    <span
                      className={cn(
                        'px-1.5 py-0.5 rounded-sm font-mono transition-colors',
                        sysCount > 0
                          ? 'bg-purple-50 text-purple-700 font-medium border border-purple-200/60'
                          : 'bg-slate-100 text-slate-400',
                      )}
                    >
                      系统 ({sysCount})
                    </span>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </Panel>

      {/* 右侧：3 级标准化权限配置工作台（二级功能垂直布局 + 三级权限节点简洁直观） */}
      <Panel
        title={`权限配置 · ${currentRole.name}`}
        icon={ShieldCheck}
        actions={
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs text-muted-foreground font-normal">
              已授权 <span className="font-bold text-primary">{currentPerms.size}</span> / {ALL_ACTION_IDS.length} 项功能点
            </span>
            <ActionBtn onClick={() => handleOpenEdit(currentRole)}>
              <Pencil className="size-3.5" /> 修改角色
            </ActionBtn>
            {saveSuccess && (
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="size-3.5" /> 权限已成功保存
              </span>
            )}
            <ActionBtn variant="primary" onClick={handleSavePerms}>
              <Check className="size-4" /> 保存授权
            </ActionBtn>
          </div>
        }
      >
        {/* 3 平台切换 Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#DBE6EE] pb-2.5 mb-3">
          {PLATFORM_PERMS.map((p) => {
            const stats = platformStats[p.id] || { selected: 0, total: 0 }
            const isActive = activePlatform === p.id
            const Icon = p.icon
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePlatform(p.id)}
                className={cn(
                  'px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer',
                  isActive
                    ? 'bg-[#2C7CFF] text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-foreground hover:bg-slate-100',
                )}
              >
                <Icon className="size-3.5" />
                <span>{p.name}</span>
                <span
                  className={cn(
                    'px-1.5 py-0.2 rounded-full text-[10px] font-mono',
                    isActive ? 'bg-white/25 text-white' : 'bg-slate-200/80 text-slate-600',
                  )}
                >
                  {stats.selected}/{stats.total}
                </span>
              </button>
            )
          })}
        </div>

        {/* 树状权限控制工具栏 */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 px-0.5">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="快速搜索功能权限点..."
              className="w-full h-8 pl-8 pr-2.5 text-xs rounded-md border border-[#E2E8F0] bg-white text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[#2C7CFF] focus:ring-1 focus:ring-[#2C7CFF]"
            />
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={handleExpandAll}
              className="text-slate-600 hover:text-foreground cursor-pointer px-2 py-1 rounded hover:bg-slate-100 transition-colors"
            >
              全部展开
            </button>
            <span className="text-muted-foreground/30">|</span>
            <button
              type="button"
              onClick={handleCollapseAll}
              className="text-slate-600 hover:text-foreground cursor-pointer px-2 py-1 rounded hover:bg-slate-100 transition-colors"
            >
              全部折叠
            </button>
            <span className="text-muted-foreground/30">|</span>
            <button
              type="button"
              onClick={handleSelectAllVisible}
              className="text-primary hover:underline cursor-pointer px-1.5 py-1 font-medium"
            >
              全选所有
            </button>
            <span className="text-muted-foreground/30">|</span>
            <button
              type="button"
              onClick={handleClearAllVisible}
              className="text-muted-foreground hover:text-foreground cursor-pointer px-1.5 py-1"
            >
              全部清空
            </button>
          </div>
        </div>

        {/* 平台级汇总控制条 */}
        {visiblePlatforms.map((p) => {
          const pActionIds = getPlatformActionIds(p)
          const pCheckedCount = pActionIds.filter((id) => currentPerms.has(id)).length
          const pAllChecked = pCheckedCount === pActionIds.length && pActionIds.length > 0
          const pSomeChecked = pCheckedCount > 0 && !pAllChecked
          const Icon = p.icon

          return (
            <div key={p.id} className="space-y-3">
              <div className="flex items-center justify-between bg-slate-50/90 px-3 py-2 rounded-lg border border-[#DBE6EE] select-none">
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pAllChecked}
                      ref={(el) => {
                        if (el) el.indeterminate = pSomeChecked
                      }}
                      onChange={() => {
                        if (pAllChecked) handleClearPlatform(p.id)
                        else handleSelectPlatformAll(p.id)
                      }}
                      className="size-4 rounded border-[#E2E8F0] accent-[#2C7CFF] cursor-pointer"
                    />
                    <div className="size-2 rounded-full" style={{ backgroundColor: p.color }} />
                    <Icon className="size-3.5 text-slate-700" />
                    <span className="font-bold text-xs text-foreground">{p.name}</span>
                  </label>
                  <span className="text-[11px] font-mono text-muted-foreground font-medium">
                    (已授权 {pCheckedCount} / {pActionIds.length} 项)
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleSelectPlatformAll(p.id)}
                    className="text-[11px] text-primary hover:underline cursor-pointer"
                  >
                    全选本平台
                  </button>
                  <span className="text-muted-foreground/30">|</span>
                  <button
                    type="button"
                    onClick={() => handleClearPlatform(p.id)}
                    className="text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    清空本平台
                  </button>
                </div>
              </div>

              {/* 1 级业务模块卡片列表 */}
              <div className="space-y-3">
                {p.modules.map((m) => {
                  const isModuleExpanded = expandedModules.has(m.id)
                  const mActionIds = m.pages.flatMap((pg) => pg.actions.map((a) => a.id))
                  const mCheckedCount = mActionIds.filter((id) => currentPerms.has(id)).length
                  const mAllChecked = mCheckedCount === mActionIds.length && mActionIds.length > 0
                  const mSomeChecked = mCheckedCount > 0 && !mAllChecked

                  return (
                    <div
                      key={m.id}
                      className="rounded-lg border border-[#DBE6EE] bg-white overflow-hidden shadow-2xs transition-shadow hover:shadow-xs"
                    >
                      {/* Level 1: 业务模块头部行 */}
                      <div className="flex items-center justify-between py-2 px-3 bg-slate-50/80 border-b border-slate-200/70 select-none">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleModuleExpand(m.id)}
                            className="p-0.5 text-slate-500 hover:text-slate-800 rounded cursor-pointer transition-colors"
                          >
                            {isModuleExpanded ? (
                              <ChevronDown className="size-4 text-slate-600" />
                            ) : (
                              <ChevronRight className="size-4 text-slate-600" />
                            )}
                          </button>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={mAllChecked}
                              ref={(el) => {
                                if (el) el.indeterminate = mSomeChecked
                              }}
                              onChange={() => handleToggleModule(m)}
                              className="size-4 rounded border-[#E2E8F0] accent-[#2C7CFF] cursor-pointer"
                            />
                            <Folder className="size-4 text-amber-500 fill-amber-500/20" />
                            <span className="font-bold text-xs text-foreground">{m.name}</span>
                          </label>
                          <span className="text-[11px] font-mono text-muted-foreground font-medium">
                            ({mCheckedCount}/{mActionIds.length})
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleModule(m)}
                          className="text-xs text-slate-500 hover:text-primary cursor-pointer px-2 py-0.5 font-medium transition-colors"
                        >
                          {mAllChecked ? '取消全选' : '全选模块'}
                        </button>
                      </div>

                      {/* Level 2 (二级功能垂直布局) + Level 3 (三级操作权限节点简洁直观、便于操作) */}
                      {isModuleExpanded && (
                        <div className="divide-y divide-slate-100">
                          {m.pages.map((pg) => {
                            const pgActionIds = pg.actions.map((a) => a.id)
                            const pgCheckedCount = pgActionIds.filter((id) => currentPerms.has(id)).length
                            const pgAllChecked = pgCheckedCount === pgActionIds.length && pgActionIds.length > 0
                            const pgSomeChecked = pgCheckedCount > 0 && !pgAllChecked

                            return (
                              <div
                                key={pg.id}
                                className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-center min-h-[44px] px-3 py-1.5 hover:bg-slate-50/60 transition-colors"
                              >
                                {/* 二级功能权限：严格垂直布局，每一行一个功能页面 */}
                                <div className="flex items-center gap-2 py-1 pr-3 border-b md:border-b-0 md:border-r border-slate-100">
                                  <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                      type="checkbox"
                                      checked={pgAllChecked}
                                      ref={(el) => {
                                        if (el) el.indeterminate = pgSomeChecked
                                      }}
                                      onChange={() => handleTogglePage(pg)}
                                      className="size-3.5 rounded border-[#E2E8F0] accent-[#2C7CFF] cursor-pointer"
                                    />
                                    <FileText className="size-3.5 text-blue-500 shrink-0" />
                                    <span className="font-semibold text-xs text-foreground truncate">
                                      {pg.name}
                                    </span>
                                  </label>
                                  <span className="text-[11px] font-mono text-muted-foreground shrink-0">
                                    ({pgCheckedCount}/{pgActionIds.length})
                                  </span>
                                </div>

                                {/* 三级操作权限：简洁直观的微型胶囊按钮组，便于高频勾选 */}
                                <div className="flex flex-wrap items-center gap-2 py-1 md:pl-3">
                                  {pg.actions.map((a) => {
                                    const isChecked = currentPerms.has(a.id)
                                    return (
                                      <label
                                        key={a.id}
                                        className={cn(
                                          'inline-flex items-center gap-1.5 py-1 px-2.5 rounded-md text-xs cursor-pointer transition-colors select-none',
                                          isChecked
                                            ? 'text-[#2C7CFF] font-medium bg-[#2C7CFF]/10 ring-1 ring-[#2C7CFF]/25 shadow-2xs'
                                            : 'text-slate-600 hover:text-foreground hover:bg-slate-100 border border-transparent',
                                        )}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isChecked}
                                          onChange={() => handleToggleAction(a.id)}
                                          className="size-3.5 rounded border-[#E2E8F0] accent-[#2C7CFF] cursor-pointer"
                                        />
                                        <span>{a.label}</span>
                                      </label>
                                    )
                                  })}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </Panel>

      {/* 新增角色弹窗 */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="新增角色"
        description="创建自定义业务角色，并配置其数据权限范围与职责"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <Field label="角色名称" required>
            <input
              type="text"
              placeholder="请输入角色名称，如：能碳分析专家"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              className={inputCls}
            />
          </Field>

          <Field label="数据范围" required hint="该角色默认可见的数据边界">
            <select
              value={newRoleScope}
              onChange={(e) => setNewRoleScope(e.target.value)}
              className={cn(inputCls, 'cursor-pointer')}
            >
              {DATA_SCOPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="角色职责说明">
            <textarea
              rows={3}
              placeholder="描述该角色的主要工作职责与权限范围..."
              value={newRoleDesc}
              onChange={(e) => setNewRoleDesc(e.target.value)}
              className={cn(inputCls, 'h-auto py-2')}
            />
          </Field>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#DBE6EE]">
            <ActionBtn onClick={() => setAddOpen(false)}>取消</ActionBtn>
            <ActionBtn variant="primary" onClick={handleCreateRole}>
              创建并配置权限
            </ActionBtn>
          </div>
        </div>
      </Modal>

      {/* 修改角色弹窗 */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={`修改角色 · ${editingRole?.name || ''}`}
        description="修改角色的基本属性、数据可见范围与职责说明"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <Field label="角色名称" required>
            <input
              type="text"
              placeholder="请输入角色名称"
              value={editRoleName}
              onChange={(e) => setEditRoleName(e.target.value)}
              className={inputCls}
            />
          </Field>

          <Field label="数据范围" required hint="该角色默认可见的数据边界">
            <select
              value={editRoleScope}
              onChange={(e) => setEditRoleScope(e.target.value)}
              className={cn(inputCls, 'cursor-pointer')}
            >
              {DATA_SCOPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="角色职责说明">
            <textarea
              rows={3}
              placeholder="描述该角色的主要工作职责与权限范围..."
              value={editRoleDesc}
              onChange={(e) => setEditRoleDesc(e.target.value)}
              className={cn(inputCls, 'h-auto py-2')}
            />
          </Field>

          <div className="flex items-center justify-between pt-3 border-t border-[#DBE6EE]">
            <div>
              {editingRole && !editingRole.builtin && (
                <button
                  type="button"
                  onClick={handleDeleteRole}
                  className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                >
                  <Trash2 className="size-3.5" /> 删除角色
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <ActionBtn onClick={() => setEditOpen(false)}>取消</ActionBtn>
              <ActionBtn variant="primary" onClick={handleSaveEditRole}>
                保存修改
              </ActionBtn>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
