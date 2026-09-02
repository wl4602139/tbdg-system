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
  MinusSquare,
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
  Folder,
  FolderOpen,
  FileCode,
  Key,
  Shield,
  LayoutDashboard,
  MonitorCog,
  Gauge,
  ClipboardCheck,
  FileBarChart,
  Settings2,
  MapPin,
  Factory,
  Radio,
  Activity,
  Info,
  ExternalLink,
  Cpu,
  Zap,
  MoreHorizontal,
} from 'lucide-react'
import { cn } from '@/lib/utils'

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

// 权限菜单树节点定义
interface PermissionTreeNode {
  id: string
  title: string
  code?: string
  icon?: any
  children?: PermissionTreeNode[]
  actions?: { id: string; label: string; code?: string }[]
}

const PERMISSION_TREE_DATA: PermissionTreeNode[] = [
  {
    id: 'menu_screen',
    title: '集控中心大屏',
    code: 'MOD_SCREEN',
    icon: LayoutDashboard,
    actions: [
      { id: 'screen_view', label: '查阅大屏看板', code: 'screen:view' },
      { id: 'screen_3d', label: '3D 拓扑潮流交互', code: 'screen:3d:interact' },
      { id: 'screen_export', label: '投屏控制与报告导出', code: 'screen:export' },
    ],
  },
  {
    id: 'menu_monitor',
    title: '集中监管',
    code: 'MOD_MONITOR',
    icon: MonitorCog,
    children: [
      {
        id: 'menu_indicator',
        title: '指标管控',
        code: 'MENU_INDICATOR',
        actions: [
          { id: 'ind_view', label: '指标大盘查看', code: 'indicator:view' },
          { id: 'ind_detail', label: 'Mode B 穿透详情', code: 'indicator:detail' },
          { id: 'ind_export', label: '指标台账导出', code: 'indicator:export' },
        ],
      },
      {
        id: 'menu_online_usage',
        title: '用能在线监测',
        code: 'MENU_ONLINE_USAGE',
        actions: [
          { id: 'online_view', label: '在线时序监控', code: 'usage:view' },
          { id: 'online_realtime', label: '15分钟高频数据解析', code: 'usage:realtime' },
          { id: 'online_export', label: '导出原始时序流水', code: 'usage:export' },
        ],
      },
      {
        id: 'menu_online_microgrid',
        title: '工业微电网监测',
        code: 'MENU_MICROGRID',
        actions: [
          { id: 'grid_view', label: '微网潮流与储能监测', code: 'microgrid:view' },
          { id: 'grid_ctrl', label: '储能充放/光伏策略调控', code: 'microgrid:control' },
        ],
      },
      {
        id: 'menu_carbon_emission',
        title: '能源碳排放监测',
        code: 'MENU_CARBON_EMISSION',
        actions: [
          { id: 'carbon_view', label: '碳排大盘与对标查看', code: 'carbon:view' },
          { id: 'carbon_offset', label: '三大绿色抵消核算', code: 'carbon:offset:calc' },
          { id: 'carbon_export', label: '导出对标明细台账', code: 'carbon:export' },
        ],
      },
    ],
  },
  {
    id: 'menu_energy',
    title: '能耗能效分析',
    code: 'MOD_ENERGY',
    icon: Gauge,
    children: [
      {
        id: 'menu_energy_structure',
        title: '用能结构分析',
        code: 'MENU_STRUCTURE',
        actions: [
          { id: 'str_view', label: '能源结构与介质占比查看', code: 'structure:view' },
          { id: 'str_export', label: '导出结构明细报表', code: 'structure:export' },
        ],
      },
      {
        id: 'menu_energy_cost',
        title: '能源成本分析',
        code: 'MENU_COST',
        actions: [
          { id: 'cost_view', label: '成本玫瑰图与时段电费查看', code: 'cost:view' },
          { id: 'cost_optimize', label: '容需量测算与降本建议', code: 'cost:optimize' },
        ],
      },
      {
        id: 'menu_energy_unit_product',
        title: '单位产品能耗',
        code: 'MENU_UNIT_PROD',
        actions: [
          { id: 'prod_view', label: '产品分类单耗看板', code: 'unit:prod:view' },
          { id: 'prod_ledger', label: '型号明细能耗台账', code: 'unit:prod:ledger' },
        ],
      },
      {
        id: 'menu_energy_unit_output',
        title: '单位产值能耗',
        code: 'MENU_UNIT_OUT',
        actions: [
          { id: 'out_view', label: '万元产值单耗看板', code: 'unit:out:view' },
          { id: 'out_yoy', label: '产值单耗同比环比分析', code: 'unit:out:yoy' },
        ],
      },
      {
        id: 'menu_energy_benchmark',
        title: '对标管理',
        code: 'MENU_BENCHMARK',
        actions: [
          { id: 'bm_view', label: '行业标杆值与领跑者对标', code: 'bm:view' },
          { id: 'bm_edit', label: '维护领跑者基准线', code: 'bm:edit' },
          { id: 'bm_audit', label: '对标报告审批与发布', code: 'bm:audit' },
        ],
      },
    ],
  },
  {
    id: 'menu_project',
    title: '零碳项目评估',
    code: 'MOD_PROJECT',
    icon: ClipboardCheck,
    children: [
      {
        id: 'menu_project_archive',
        title: '项目档案管理',
        code: 'MENU_ARCHIVE',
        actions: [
          { id: 'proj_view', label: '档案清单与立项浏览', code: 'proj:view' },
          { id: 'proj_add', label: '新建节能降碳项目', code: 'proj:add' },
          { id: 'proj_audit', label: '项目验收与闭环归档', code: 'proj:audit' },
        ],
      },
      {
        id: 'menu_project_monitoring',
        title: '实时监控',
        code: 'MENU_PROJECT_MONITOR',
        actions: [
          { id: 'proj_mon_view', label: '零碳能源实时出力监视', code: 'proj:mon:view' },
          { id: 'proj_mon_dev', label: '逆变器与储能设备状态', code: 'proj:mon:device' },
        ],
      },
      {
        id: 'menu_project_benefit',
        title: '项目效益评估',
        code: 'MENU_BENEFIT',
        actions: [
          { id: 'proj_eval', label: '实时减碳效益核算', code: 'proj:benefit:calc' },
          { id: 'proj_eval_roi', label: '投资回收期与节能量分析', code: 'proj:benefit:roi' },
        ],
      },
      {
        id: 'menu_project_self',
        title: '零碳工厂自评估',
        code: 'MENU_SELF',
        actions: [
          { id: 'proj_self_score', label: '零碳工厂自评估打分评级', code: 'proj:self:score' },
          { id: 'proj_self_gap', label: '标准差距诊断分析', code: 'proj:self:gap' },
        ],
      },
    ],
  },
  {
    id: 'menu_reports',
    title: '统计报表',
    code: 'MOD_REPORTS',
    icon: FileBarChart,
    children: [
      {
        id: 'menu_rep_usage',
        title: '用能报表',
        code: 'MENU_REP_USAGE',
        actions: [
          { id: 'rep_usage', label: '查阅用能日报/月报/年报', code: 'rep:usage:view' },
          { id: 'rep_usage_exp', label: '导出用能报表 Excel', code: 'rep:usage:export' },
        ],
      },
      {
        id: 'menu_rep_cost',
        title: '成本报表',
        code: 'MENU_REP_COST',
        actions: [
          { id: 'rep_cost', label: '查阅能源成本结算报表', code: 'rep:cost:view' },
          { id: 'rep_cost_exp', label: '导出成本报表 Excel', code: 'rep:cost:export' },
        ],
      },
      {
        id: 'menu_rep_unit',
        title: '单耗报表',
        code: 'MENU_REP_UNIT',
        actions: [
          { id: 'rep_unit', label: '查阅单位产品/产值单耗报表', code: 'rep:unit:view' },
          { id: 'rep_unit_exp', label: '导出单耗报表 Excel', code: 'rep:unit:export' },
        ],
      },
    ],
  },
  {
    id: 'menu_config',
    title: '基础配置',
    code: 'MOD_CONFIG',
    icon: Settings2,
    children: [
      {
        id: 'menu_cfg_permission',
        title: '账号权限',
        code: 'MENU_CFG_PERM',
        actions: [
          { id: 'cfg_permission', label: '账号管理与角色权限授权', code: 'cfg:perm:manage' },
          { id: 'cfg_perm_pwd', label: '重置登录密码', code: 'cfg:perm:pwd' },
        ],
      },
      {
        id: 'menu_cfg_factor',
        title: '碳排因子',
        code: 'MENU_CFG_FACTOR',
        actions: [
          { id: 'cfg_factor', label: '因子库维护与变更审批', code: 'cfg:factor:manage' },
          { id: 'cfg_factor_recalc', label: '历史数据一键重算', code: 'cfg:factor:recalc' },
        ],
      },
      {
        id: 'menu_cfg_price',
        title: '费价模型',
        code: 'MENU_CFG_PRICE',
        actions: [
          { id: 'cfg_price', label: '分时电价与阶梯气价配置', code: 'cfg:price:manage' },
          { id: 'cfg_price_dispatch', label: '价格方案全集团统一下发', code: 'cfg:price:dispatch' },
        ],
      },
      {
        id: 'menu_cfg_convert',
        title: '折标煤系数',
        code: 'MENU_CFG_CONVERT',
        actions: [
          { id: 'cfg_convert', label: '国家标准折标系数维护', code: 'cfg:convert:manage' },
          { id: 'cfg_convert_calc', label: '多介质单位实时换算工具', code: 'cfg:convert:calc' },
        ],
      },
      {
        id: 'menu_cfg_interface',
        title: '接口配置管理',
        code: 'MENU_CFG_IF',
        actions: [
          { id: 'cfg_interface', label: '子系统接口参数与字段映射', code: 'cfg:interface:manage' },
          { id: 'cfg_if_test', label: '在线连通性心跳探测', code: 'cfg:interface:test' },
        ],
      },
      {
        id: 'menu_cfg_entry',
        title: '数据录入',
        code: 'MENU_CFG_ENTRY',
        actions: [
          { id: 'cfg_entry', label: '非电介质月度实物量填报', code: 'cfg:entry:medium' },
          { id: 'cfg_entry_output', label: '财务产值与完工产量填报', code: 'cfg:entry:output' },
          { id: 'cfg_entry_audit', label: '填报台账审核与归档', code: 'cfg:entry:audit' },
        ],
      },
    ],
  },
]

// 收集节点及其所有后代 Action ID
function getAllActionIds(node: PermissionTreeNode): string[] {
  const ids: string[] = []
  if (node.actions) {
    node.actions.forEach((a) => ids.push(a.id))
  }
  if (node.children) {
    node.children.forEach((c) => {
      ids.push(...getAllActionIds(c))
    })
  }
  return ids
}

// 收集所有全部 Action ID
function collectAllSystemActionIds(): string[] {
  const all: string[] = []
  PERMISSION_TREE_DATA.forEach((m) => {
    all.push(...getAllActionIds(m))
  })
  return all
}

// ============================================================================
// 企业组织结构层级关系数据定义
// ============================================================================
interface WorkshopNode {
  id: string
  name: string
  code: string
  badge: '主体' | '智能' | '综合' | '制造'
  status: '在线' | '同步中'
  meters: number
  lead: string
  craftDesc: string
}

interface CompanyTopologyNode {
  id: string
  code: string
  name: string
  sector: 'transformer' | 'cable'
  sectorName: string
  province: string
  city: string
  manager: string
  managerPhone: string
  meterCount: number
  workshops: WorkshopNode[]
}

const INITIAL_ORG_COMPANIES: CompanyTopologyNode[] = [
  {
    id: 'comp_sb',
    code: 'COMP_SB_01',
    name: '沈变公司',
    sector: 'transformer',
    sectorName: '输变电变压器产业',
    province: '辽宁省',
    city: '沈阳市铁西区',
    manager: '王少华',
    managerPhone: '137****3388',
    meterCount: 320,
    workshops: [
      { id: 'ws_sb_main', name: '沈变本部', code: 'WS_SB_MAIN', badge: '主体', status: '在线', meters: 120, lead: '刘海波', craftDesc: '1000kV特高压变压器装配、干燥窑炉与绝缘试验' },
      { id: 'ws_sb_luna', name: '露娜智能制造', code: 'WS_SB_LUNA', badge: '智能', status: '在线', meters: 45, lead: '张晓明', craftDesc: '智能化数字装配车间与微网动力配电' },
      { id: 'ws_sb_zh', name: '智慧能源中心', code: 'WS_SB_ZH', badge: '综合', status: '在线', meters: 52, lead: '李晨', craftDesc: '分布式光伏屋顶、储能电站与主变热力泵房' },
      { id: 'ws_sb_hx', name: '和新套管公司', code: 'WS_SB_HX', badge: '主体', status: '在线', meters: 40, lead: '王鹏', craftDesc: '特高压胶浸纸电容式套管卷制与真空固化' },
      { id: 'ws_sb_kj', name: '康嘉互感器', code: 'WS_SB_KJ', badge: '主体', status: '在线', meters: 35, lead: '赵宇', craftDesc: '气体绝缘互感器 GIS 装配与高压试验' },
      { id: 'ws_sb_yn', name: '印能制造分厂', code: 'WS_SB_YN', badge: '制造', status: '在线', meters: 28, lead: '孙强', craftDesc: '高密度绝缘纸板热压、层压木及印制电路' },
    ],
  },
  {
    id: 'comp_hb',
    code: 'COMP_HB_02',
    name: '衡变公司',
    sector: 'transformer',
    sectorName: '输变电变压器产业',
    province: '湖南省',
    city: '衡阳市雁峰区',
    manager: '陈志明',
    managerPhone: '136****5522',
    meterCount: 480,
    workshops: [
      { id: 'ws_hb_main', name: '衡变本部', code: 'WS_HB_MAIN', badge: '主体', status: '在线', meters: 140, lead: '周伟', craftDesc: '特高压直流换流变压器总装及出厂试验大厅' },
      { id: 'ws_hb_nj', name: '南京电研', code: 'WS_HB_NJ', badge: '主体', status: '在线', meters: 60, lead: '吴强', craftDesc: '电力系统自动化与继电保护中试基地' },
      { id: 'ws_hb_yj', name: '云集电气', code: 'WS_HB_YJ', badge: '主体', status: '在线', meters: 42, lead: '黄俊', craftDesc: '智能配网成套开关设备加工与涂装' },
      { id: 'ws_hb_hn', name: '湖南电气', code: 'WS_HB_HN', badge: '主体', status: '在线', meters: 38, lead: '郑勇', craftDesc: '箱式变电站及新能源升压成套' },
      { id: 'ws_hb_kg', name: '云集高压开关', code: 'WS_HB_KG', badge: '主体', status: '在线', meters: 45, lead: '罗敏', craftDesc: 'GIS 气体绝缘组合电器装配清洁间' },
      { id: 'ws_hb_xj', name: '新疆自控', code: 'WS_HB_XJ', badge: '主体', status: '在线', meters: 30, lead: '钱辉', craftDesc: '工业过程综合监控与变电所自动化' },
      { id: 'ws_hb_sk', name: '上开制造部', code: 'WS_HB_SK', badge: '制造', status: '在线', meters: 25, lead: '许博', craftDesc: '精密钣金加工与母线冲剪成型' },
      { id: 'ws_hb_kbe', name: '柯贝尔材料', code: 'WS_HB_KBE', badge: '制造', status: '在线', meters: 22, lead: '蒋平', craftDesc: '特种绝缘件精密数控机加工' },
      { id: 'ws_hb_tnj', name: '特能建', code: 'WS_HB_TNJ', badge: '主体', status: '在线', meters: 28, lead: '彭飞', craftDesc: '新能源微电网示范工程运维中枢' },
      { id: 'ws_hb_hr', name: '合容电气', code: 'WS_HB_HR', badge: '主体', status: '在线', meters: 30, lead: '邓超', craftDesc: '高压并联电容器与电力滤波成套' },
      { id: 'ws_hb_gil', name: '赛杰爱迪', code: 'WS_HB_GIL', badge: '主体', status: '在线', meters: 20, lead: '蔡华', craftDesc: '特高压气体绝缘金属封闭输电线路 (GIL)' },
    ],
  },
  {
    id: 'comp_xb',
    code: 'COMP_XB_03',
    name: '新变厂',
    sector: 'transformer',
    sectorName: '输变电变压器产业',
    province: '新疆维吾尔自治区',
    city: '昌吉市延安北路',
    manager: '马俊杰',
    managerPhone: '138****7711',
    meterCount: 360,
    workshops: [
      { id: 'ws_xb_uhv', name: '超高压公司', code: 'WS_XB_UHV', badge: '主体', status: '在线', meters: 110, lead: '马俊杰', craftDesc: '昌吉 ±1100kV 特高压变压器研制基地' },
      { id: 'ws_xb_tb', name: '天变公司', code: 'WS_XB_TB', badge: '主体', status: '在线', meters: 55, lead: '冯刚', craftDesc: '环氧树脂浇注干式变压器智能产线' },
      { id: 'ws_xb_zndq', name: '智能电气公司', code: 'WS_XB_ZNDQ', badge: '主体', status: '在线', meters: 48, lead: '丁亮', craftDesc: '新能源储能一体化升压变集成工位' },
      { id: 'ws_xb_jjj', name: '京津冀公司', code: 'WS_XB_JJJ', badge: '主体', status: '在线', meters: 36, lead: '薛涛', craftDesc: '华北区域试验与智慧运维中心' },
      { id: 'ws_xb_zf', name: '珠峰硅钢', code: 'WS_XB_ZF', badge: '主体', status: '在线', meters: 50, lead: '袁帅', craftDesc: '高磁感取向硅钢纵剪与横剪自动化' },
      { id: 'ws_xb_zhny', name: '智慧能源', code: 'WS_XB_ZHNY', badge: '综合', status: '在线', meters: 35, lead: '严冬', craftDesc: '源网荷储微电网及地源热泵站' },
      { id: 'ws_xb_yl', name: '银利电气', code: 'WS_XB_YL', badge: '制造', status: '在线', meters: 26, lead: '顾磊', craftDesc: '换位导线与电磁线高温漆包工序' },
    ],
  },
  {
    id: 'comp_ll',
    code: 'COMP_LL_04',
    name: '鲁缆公司',
    sector: 'cable',
    sectorName: '智慧线缆产业',
    province: '山东省',
    city: '泰安市新泰',
    manager: '赵立峰',
    managerPhone: '139****8833',
    meterCount: 240,
    workshops: [
      { id: 'ws_ll_main', name: '鲁缆本部', code: 'WS_LL_MAIN', badge: '主体', status: '在线', meters: 90, lead: '赵立峰', craftDesc: '500kV 超高压交联电缆 VCV 超高立塔车间' },
      { id: 'ws_ll_zl', name: '智缆公司', code: 'WS_LL_ZL', badge: '智能', status: '在线', meters: 55, lead: '谭斌', craftDesc: '智慧工业柔性特种控制线缆产线' },
      { id: 'ws_ll_sw', name: '昭和公司', code: 'WS_LL_SW', badge: '制造', status: '在线', meters: 45, lead: '陆成', craftDesc: '高导耐热铝合金杆连铸连轧车间' },
      { id: 'ws_ll_sg', name: '曙光公司', code: 'WS_LL_SG', badge: '主体', status: '在线', meters: 50, lead: '尹健', craftDesc: '新能源汽车与充电桩专用高压线束' },
    ],
  },
  {
    id: 'comp_xl',
    code: 'COMP_XL_05',
    name: '新缆厂',
    sector: 'cable',
    sectorName: '智慧线缆产业',
    province: '新疆维吾尔自治区',
    city: '乌鲁木齐市新市区',
    manager: '张海涛',
    managerPhone: '138****6621',
    meterCount: 160,
    workshops: [
      { id: 'ws_xl_main', name: '特变电工新疆电缆有限公司', code: 'WS_XL_MAIN', badge: '主体', status: '在线', meters: 95, lead: '张海涛', craftDesc: '高低压交联电力电缆与阻燃耐火缆' },
      { id: 'ws_xl_sub', name: '特变电工新疆线缆厂', code: 'WS_XL_SUB', badge: '主体', status: '在线', meters: 65, lead: '董亮', craftDesc: '钢芯铝绞线、铝包钢及架空绝缘导线' },
    ],
  },
  {
    id: 'comp_dl',
    code: 'COMP_DL_06',
    name: '德缆公司',
    sector: 'cable',
    sectorName: '智慧线缆产业',
    province: '四川省',
    city: '德阳市旌阳区',
    manager: '许建国',
    managerPhone: '139****1108',
    meterCount: 120,
    workshops: [
      { id: 'ws_dl_main', name: '特变电工（德阳）电缆股份有限公司', code: 'WS_DL_MAIN', badge: '主体', status: '在线', meters: 120, lead: '许建国', craftDesc: '西南特高压线缆、轨道交通专用电缆与环保BTTZ矿物绝缘缆' },
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
    menuPermissions: collectAllSystemActionIds(),
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

  // 树展开状态 (默认全展开)
  const allTreeKeys = useMemo(() => {
    const keys: string[] = []
    PERMISSION_TREE_DATA.forEach((m) => {
      keys.push(m.id)
      if (m.children) {
        m.children.forEach((c) => keys.push(c.id))
      }
    })
    return keys
  }, [])
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set(allTreeKeys))
  const [treeSearchKw, setTreeSearchKw] = useState('')

  // 组织架构公司与车间列表可变 State
  const [orgCompanies, setOrgCompanies] = useState<CompanyTopologyNode[]>(INITIAL_ORG_COMPANIES)
  const [topologySearchKw, setTopologySearchKw] = useState('')
  const [expandedCompanyIds, setExpandedCompanyIds] = useState<Set<string>>(
    new Set(['comp_sb', 'comp_hb', 'comp_xb', 'comp_ll', 'comp_xl', 'comp_dl'])
  )
  const [selectedNodeModal, setSelectedNodeModal] = useState<{
    type: 'group' | 'company' | 'workshop'
    data: any
  }>({
    type: 'group',
    data: {
      name: '特变电工（电装集团）双中心能碳管控平台',
      code: 'TBEA_GROUP_ROOT',
      sub: '集团总指挥中枢',
      desc: '统筹全集团 2 大产业集群、6 大直属制造公司、31 个车间工厂的能耗双控、碳排放配额核算与实时微电网调优',
      stat: '6 大公司 · 31 个工厂 · 1,680 个在线测点 · 48 位在册能管人员',
      manager: '张建国 (超级管理员)',
      province: '集团总部',
      city: '能碳管理中心',
      meterCount: 1680,
    },
  })

  // 组织架构增删改弹窗状态
  const [orgModalOpen, setOrgModalOpen] = useState(false)
  const [orgModalMode, setOrgModalMode] = useState<'add_company' | 'edit_company' | 'add_workshop' | 'edit_workshop'>('add_company')
  const [orgModalParentCompanyId, setOrgModalParentCompanyId] = useState<string>('comp_sb')
  const [orgModalTarget, setOrgModalTarget] = useState<any>(null)

  // 删除确认框
  const [orgDeleteConfirm, setOrgDeleteConfirm] = useState<{
    type: 'company' | 'workshop'
    id: string
    name: string
    parentCompanyId?: string
  } | null>(null)

  // 筛选状态
  const [searchKw, setSearchKw] = useState('')
  const [filterCompany, setFilterCompany] = useState('all')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  // 用户弹窗状态
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

  // 计算当前组织架构总车间数
  const totalWorkshopCount = useMemo(() => {
    return orgCompanies.reduce((sum, c) => sum + c.workshops.length, 0)
  }, [orgCompanies])

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

  // 展开 / 折叠单个权限树节点
  const toggleExpand = (nodeId: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(nodeId)) {
        next.delete(nodeId)
      } else {
        next.add(nodeId)
      }
      return next
    })
  }

  // 全部展开
  const handleExpandAll = () => {
    setExpandedKeys(new Set(allTreeKeys))
  }

  // 全部折叠
  const handleCollapseAll = () => {
    setExpandedKeys(new Set())
  }

  // 企业组织公司节点展开/收起切换
  const toggleCompanyTopology = (compCode: string) => {
    setExpandedCompanyIds((prev) => {
      const next = new Set(prev)
      if (next.has(compCode)) {
        next.delete(compCode)
      } else {
        next.add(compCode)
      }
      return next
    })
  }

  // 全选系统全部权限
  const handleSelectAllPermissions = () => {
    const all = collectAllSystemActionIds()
    setRoles((prev) =>
      prev.map((r) => (r.id === selectedRoleId ? { ...r, menuPermissions: all } : r))
    )
    showToast(`已全选角色【${selectedRole.name}】的全部功能与按钮权限`)
  }

  // 全不选
  const handleDeselectAllPermissions = () => {
    setRoles((prev) =>
      prev.map((r) => (r.id === selectedRoleId ? { ...r, menuPermissions: [] } : r))
    )
    showToast(`已清空角色【${selectedRole.name}】的权限`)
  }

  // 切换单个 Action 权限
  const handleToggleAction = (actId: string) => {
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

  // 切换父节点（递归勾选/反选其下所有子节点与 actions）
  const handleToggleNode = (node: PermissionTreeNode) => {
    const nodeActionIds = getAllActionIds(node)
    const isAllChecked = nodeActionIds.every((id) => selectedRole.menuPermissions.includes(id))

    setRoles((prev) =>
      prev.map((r) => {
        if (r.id !== selectedRoleId) return r
        let nextPerms = [...r.menuPermissions]
        if (isAllChecked) {
          nextPerms = nextPerms.filter((id) => !nodeActionIds.includes(id))
        } else {
          nodeActionIds.forEach((id) => {
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

  // =========================================================================
  // 组织架构增加/编辑处理函数
  // =========================================================================
  const handleSaveOrgNode = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    if (orgModalMode === 'add_company') {
      const name = formData.get('name') as string
      const code = formData.get('code') as string
      const province = formData.get('province') as string
      const city = formData.get('city') as string
      const manager = formData.get('manager') as string
      const managerPhone = formData.get('managerPhone') as string
      const meterCount = Number(formData.get('meterCount')) || 100

      const newCompany: CompanyTopologyNode = {
        id: `comp_${Date.now()}`,
        code: code || `COMP_${Date.now().toString().slice(-4)}`,
        name,
        sector: 'transformer',
        sectorName: '制造板块',
        province,
        city,
        manager,
        managerPhone,
        meterCount,
        workshops: [],
      }

      setOrgCompanies((prev) => [...prev, newCompany])
      setExpandedCompanyIds((prev) => new Set([...prev, newCompany.id]))
      setSelectedNodeModal({ type: 'company', data: newCompany })
      showToast(`已成功创建直属公司【${name}】`)
    } else if (orgModalMode === 'edit_company' && orgModalTarget) {
      const name = formData.get('name') as string
      const code = formData.get('code') as string
      const province = formData.get('province') as string
      const city = formData.get('city') as string
      const manager = formData.get('manager') as string
      const managerPhone = formData.get('managerPhone') as string
      const meterCount = Number(formData.get('meterCount')) || orgModalTarget.meterCount

      const updatedCompany: CompanyTopologyNode = {
        ...orgModalTarget,
        name,
        code,
        province,
        city,
        manager,
        managerPhone,
        meterCount,
      }

      setOrgCompanies((prev) =>
        prev.map((c) => (c.id === orgModalTarget.id ? updatedCompany : c))
      )
      setSelectedNodeModal({ type: 'company', data: updatedCompany })
      showToast(`已成功修改直属公司【${name}】档案资料`)
    } else if (orgModalMode === 'add_workshop') {
      const parentCompId = (formData.get('parentCompanyId') as string) || orgModalParentCompanyId
      const name = formData.get('name') as string
      const code = formData.get('code') as string
      const badge = formData.get('badge') as any
      const lead = formData.get('lead') as string
      const meters = Number(formData.get('meters')) || 30
      const craftDesc = formData.get('craftDesc') as string

      const newWorkshop: WorkshopNode = {
        id: `ws_${Date.now()}`,
        name,
        code: code || `WS_${Date.now().toString().slice(-4)}`,
        badge,
        status: '在线',
        meters,
        lead,
        craftDesc,
      }

      setOrgCompanies((prev) =>
        prev.map((c) => {
          if (c.id === parentCompId) {
            return {
              ...c,
              meterCount: c.meterCount + meters,
              workshops: [...c.workshops, newWorkshop],
            }
          }
          return c
        })
      )
      const parentComp = orgCompanies.find((c) => c.id === parentCompId)
      setSelectedNodeModal({
        type: 'workshop',
        data: {
          ...newWorkshop,
          companyName: parentComp?.name || '直属公司',
          province: parentComp?.province || '辽宁省',
          city: parentComp?.city || '沈阳市',
        },
      })
      showToast(`已成功添加车间工序【${name}】`)
    } else if (orgModalMode === 'edit_workshop' && orgModalTarget) {
      const name = formData.get('name') as string
      const code = formData.get('code') as string
      const badge = formData.get('badge') as any
      const lead = formData.get('lead') as string
      const meters = Number(formData.get('meters')) || orgModalTarget.meters
      const craftDesc = formData.get('craftDesc') as string

      const updatedWorkshop: WorkshopNode = {
        ...orgModalTarget,
        name,
        code,
        badge,
        lead,
        meters,
        craftDesc,
      }

      setOrgCompanies((prev) =>
        prev.map((c) => {
          const hasWs = c.workshops.some((w) => w.id === orgModalTarget.id)
          if (!hasWs) return c
          return {
            ...c,
            workshops: c.workshops.map((w) => (w.id === orgModalTarget.id ? updatedWorkshop : w)),
          }
        })
      )
      setSelectedNodeModal((prev) =>
        prev ? { ...prev, data: { ...prev.data, ...updatedWorkshop } } : null
      )
      showToast(`已成功更新车间【${name}】档案资料`)
    }

    setOrgModalOpen(false)
    setOrgModalTarget(null)
  }

  // 执行删除组织节点
  const handleConfirmDeleteOrg = () => {
    if (!orgDeleteConfirm) return

    if (orgDeleteConfirm.type === 'company') {
      setOrgCompanies((prev) => prev.filter((c) => c.id !== orgDeleteConfirm.id))
      showToast(`已成功删除直属公司【${orgDeleteConfirm.name}】及其全部下属车间`)
      setSelectedNodeModal({
        type: 'group',
        data: {
          name: '特变电工（电装集团）双中心能碳管控平台',
          code: 'TBEA_GROUP_ROOT',
          sub: '集团总指挥中枢',
          desc: '统筹全集团 2 大产业集群、6 大直属制造公司、31 个车间工厂的能耗双控、碳排放配额核算与实时微电网调优',
          stat: '6 大公司 · 31 个工厂 · 1,680 个在线测点 · 48 位在册能管人员',
          manager: '张建国 (超级管理员)',
          province: '集团总部',
          city: '能碳管理中心',
          meterCount: 1680,
        },
      })
    } else if (orgDeleteConfirm.type === 'workshop') {
      setOrgCompanies((prev) =>
        prev.map((c) => {
          const targetWs = c.workshops.find((w) => w.id === orgDeleteConfirm.id)
          if (!targetWs) return c
          return {
            ...c,
            meterCount: Math.max(0, c.meterCount - targetWs.meters),
            workshops: c.workshops.filter((w) => w.id !== orgDeleteConfirm.id),
          }
        })
      )
      showToast(`已成功删除车间工序【${orgDeleteConfirm.name}】`)
      const parentComp = orgCompanies.find((c) => c.id === orgDeleteConfirm.parentCompanyId)
      if (parentComp) {
        setSelectedNodeModal({ type: 'company', data: parentComp })
      }
    }

    setOrgDeleteConfirm(null)
  }

  // 递归权限树节点渲染组件
  const renderTreeNode = (node: PermissionTreeNode, depth = 0) => {
    const nodeActionIds = getAllActionIds(node)
    const checkedCount = nodeActionIds.filter((id) => selectedRole.menuPermissions.includes(id)).length
    const isAllChecked = nodeActionIds.length > 0 && checkedCount === nodeActionIds.length
    const isIndeterminate = checkedCount > 0 && checkedCount < nodeActionIds.length
    const isExpanded = expandedKeys.has(node.id)
    const hasChildren = (node.children && node.children.length > 0) || (node.actions && node.actions.length > 0)

    // 搜索过滤匹配
    if (treeSearchKw) {
      const kw = treeSearchKw.toLowerCase()
      const matchSelf = node.title.toLowerCase().includes(kw)
      const matchActions = node.actions?.some((a) => a.label.toLowerCase().includes(kw))
      const matchChildren = node.children?.some((c) => getAllActionIds(c).some((id) => id.includes(kw)))
      if (!matchSelf && !matchActions && !matchChildren) {
        return null
      }
    }

    return (
      <div key={node.id} className="select-none">
        {/* 节点行 */}
        <div
          className={cn(
            'flex items-center justify-between py-1.5 px-2 rounded-lg transition-colors hover:bg-accent/40 group',
            depth === 0 ? 'bg-panel border border-border mb-1' : 'ml-4'
          )}
        >
          <div className="flex items-center gap-2 flex-1">
            {/* 展开折叠三角 */}
            {hasChildren ? (
              <button
                type="button"
                onClick={() => toggleExpand(node.id)}
                className="size-5 rounded hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {isExpanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
              </button>
            ) : (
              <span className="size-5" />
            )}

            {/* Checkbox */}
            <button
              type="button"
              onClick={() => handleToggleNode(node)}
              className="cursor-pointer text-foreground hover:opacity-80 flex items-center justify-center"
            >
              {isAllChecked ? (
                <CheckSquare className="size-4 text-primary" />
              ) : isIndeterminate ? (
                <MinusSquare className="size-4 text-primary" />
              ) : (
                <Square className="size-4 text-muted-foreground/40 group-hover:text-muted-foreground" />
              )}
            </button>

            {/* 图标 */}
            {depth === 0 ? (
              <Folder className={cn('size-4', isAllChecked ? 'text-primary' : 'text-muted-foreground')} />
            ) : (
              <FolderOpen className={cn('size-3.5', isAllChecked ? 'text-primary' : 'text-muted-foreground/60')} />
            )}

            {/* 标题 */}
            <span
              onClick={() => toggleExpand(node.id)}
              className={cn(
                'text-xs cursor-pointer',
                depth === 0 ? 'font-bold text-foreground' : 'font-medium text-foreground'
              )}
            >
              {node.title}
            </span>

            {/* 编码 */}
            {node.code && (
              <span className="text-[10px] font-mono text-muted-foreground bg-panel border border-border px-1 py-0.2 rounded">
                {node.code}
              </span>
            )}
          </div>

          {/* 右侧统计 */}
          <div className="flex items-center gap-2 text-[11px] font-mono">
            <span
              className={cn(
                'px-1.5 py-0.5 rounded text-[10px] border',
                isAllChecked
                  ? 'bg-primary/20 text-primary border-primary/30 font-bold'
                  : checkedCount > 0
                  ? 'bg-primary/10 text-primary border-primary/20'
                  : 'bg-panel text-muted-foreground border-border'
              )}
            >
              {checkedCount} / {nodeActionIds.length} 项
            </span>
          </div>
        </div>

        {/* 展开的子节点 & Actions */}
        {isExpanded && (
          <div className={cn('space-y-1', depth === 0 ? 'pl-4 border-l-2 border-border ml-4.5 my-1.5' : 'pl-4 border-l border-border/80 ml-4.5')}>
            {/* 渲染二级子菜单 */}
            {node.children && node.children.map((child) => renderTreeNode(child, depth + 1))}

            {/* 渲染叶子 Action 按钮权限 */}
            {node.actions && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 py-1 pl-6">
                {node.actions.map((act) => {
                  const isActChecked = selectedRole.menuPermissions.includes(act.id)
                  return (
                    <label
                      key={act.id}
                      onClick={() => handleToggleAction(act.id)}
                      className={cn(
                        'flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer select-none transition-all',
                        isActChecked
                          ? 'bg-primary/20 border-primary/30 text-primary font-medium shadow-2xs'
                          : 'bg-card border-border text-muted-foreground hover:bg-accent/40 hover:text-foreground'
                      )}
                    >
                      {isActChecked ? (
                        <CheckSquare className="size-3.5 text-primary shrink-0" />
                      ) : (
                        <Square className="size-3.5 text-muted-foreground/40 shrink-0" />
                      )}
                      <Key className={cn('size-3 shrink-0', isActChecked ? 'text-primary' : 'text-muted-foreground')} />
                      <span className="truncate flex-1">{act.label}</span>
                      {act.code && (
                        <span className="text-[9px] font-mono text-muted-foreground bg-panel px-1 rounded shrink-0 border border-border">
                          {act.code}
                        </span>
                      )}
                    </label>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3.5 font-sans text-foreground">
      {/* 顶部 Header */}
      <div className="bg-card p-3.5 rounded-xl border border-border shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0">
            <Users className="size-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">账号权限管理</h1>
            <p className="text-xs text-muted-foreground font-sans">
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs cursor-pointer shadow-xs transition-colors"
          >
            <UserPlus className="size-3.5" />
            <span>新增账号</span>
          </button>
          <button
            type="button"
            onClick={() => setRoleModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-panel border border-border hover:bg-accent/40 text-foreground font-semibold text-xs cursor-pointer shadow-2xs transition-colors"
          >
            <ShieldCheck className="size-3.5 text-purple-400" />
            <span>创建自定义角色</span>
          </button>
          <button
            type="button"
            onClick={() => alert('正在导出全集团能碳管理人员权限名单 (Excel)...')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-panel border border-border hover:bg-accent/40 text-foreground font-medium text-xs cursor-pointer shadow-2xs transition-colors"
          >
            <Download className="size-3.5 text-muted-foreground" />
            <span>导出名册</span>
          </button>
        </div>
      </div>

      {/* 状态 Toast */}
      {toastMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
          <span className="font-sans font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Tab 导航 */}
      <div className="bg-card p-1 rounded-xl border border-border shadow-xs flex items-center gap-1 font-sans text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer select-none',
            activeTab === 'users'
              ? 'bg-primary/20 text-primary font-bold border border-primary/30 shadow-2xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
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
              ? 'bg-primary/20 text-primary font-bold border border-primary/30 shadow-2xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
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
              ? 'bg-primary/20 text-primary font-bold border border-primary/30 shadow-2xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
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
              ? 'bg-primary/20 text-primary font-bold border border-primary/30 shadow-2xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
          )}
        >
          <FolderTree className="size-3.5" />
          <span>组织架构</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* Tab 1: 用户账号列表 */}
      {/* ========================================================================= */}
      {activeTab === 'users' && (
        <div className="bg-card rounded-xl border border-border shadow-xs space-y-3.5 p-4">
          {/* 筛选过滤工具条 */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-border/60">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="relative">
                <Search className="size-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索姓名、工号、账号或部门..."
                  value={searchKw}
                  onChange={(e) => setSearchKw(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-panel border border-border rounded-lg text-xs w-64 text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <select
                value={filterCompany}
                onChange={(e) => setFilterCompany(e.target.value)}
                className="bg-panel border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
              >
                <option value="all">全部所属公司</option>
                <option value="电装集团">电装集团总部</option>
                {orgCompanies.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="bg-panel border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
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
                className="bg-panel border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
              >
                <option value="all">全部状态</option>
                <option value="启用">正常启用</option>
                <option value="停用">已停用</option>
              </select>
            </div>

            <div className="text-xs text-muted-foreground font-mono">
              共查询到 <strong className="text-primary font-bold">{filteredUsers.length}</strong> 位人员账号
            </div>
          </div>

          {/* 账号表格 */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="bg-panel border-b border-border text-muted-foreground font-semibold">
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
              <tbody className="divide-y divide-border/60 text-foreground">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-accent/30 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-foreground flex items-center gap-1.5">
                        <div className="size-6 rounded-full bg-primary/20 text-primary border border-primary/30 font-mono text-[11px] font-bold flex items-center justify-center">
                          {user.name.slice(0, 1)}
                        </div>
                        <span>{user.name}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono mt-0.5">{user.workNo}</div>
                    </td>

                    <td className="py-3 px-3 font-mono text-foreground">{user.account}</td>

                    <td className="py-3 px-3">
                      <div className="font-medium text-foreground">{user.company}</div>
                      <div className="text-[11px] text-muted-foreground">{user.dept}</div>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border',
                          user.roleId === 'role_admin'
                            ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                            : user.roleId === 'role_director'
                            ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                            : user.roleId === 'role_park_mgr'
                            ? 'bg-primary/20 text-primary border-primary/30'
                            : 'bg-panel text-muted-foreground border-border'
                        )}
                      >
                        {user.roleName}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-[11px] text-muted-foreground bg-panel px-2 py-0.5 rounded border border-border block max-w-xs truncate" title={user.dataScopeText}>
                        {user.dataScopeText}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium',
                          user.status === '启用' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-panel text-muted-foreground border border-border'
                        )}
                      >
                        <span className={cn('size-1.5 rounded-full', user.status === '启用' ? 'bg-emerald-400' : 'bg-muted-foreground')} />
                        {user.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono text-muted-foreground text-[11px]">
                      <div>{user.lastLoginTime}</div>
                      <div className="text-[10px] text-muted-foreground/60">IP: {user.lastLoginIp}</div>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingUser(user)
                            setUserModalOpen(true)
                          }}
                          className="text-primary hover:underline font-medium cursor-pointer"
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
                          className="text-muted-foreground hover:text-foreground hover:underline cursor-pointer"
                        >
                          重置密码
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleUserStatus(user.id)}
                          className={cn(
                            'hover:underline cursor-pointer font-medium',
                            user.status === '启用' ? 'text-amber-400' : 'text-emerald-400'
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
      {/* Tab 2: 角色与功能权限树 (树状结构展示与勾选) */}
      {/* ========================================================================= */}
      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
          {/* 左侧 4/12: 角色列表 */}
          <div className="lg:col-span-4 bg-card rounded-xl border border-border shadow-xs p-3.5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-primary" />
                角色模型清单 ({roles.length})
              </h3>
              <button
                type="button"
                onClick={() => setRoleModalOpen(true)}
                className="text-xs text-primary font-bold hover:underline cursor-pointer"
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
                      ? 'bg-primary/15 border-primary ring-2 ring-primary/30 shadow-xs'
                      : 'bg-panel border-border hover:border-border/80'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      {r.name}
                      {r.type === 'preset' ? (
                        <span className="text-[10px] bg-card text-muted-foreground px-1.5 py-0.2 rounded font-normal border border-border">预设</span>
                      ) : (
                        <span className="text-[10px] bg-purple-500/20 text-purple-400 border border-purple-500/30 px-1.5 py-0.2 rounded font-normal">自定义</span>
                      )}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">{r.userCount} 人</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 右侧 8/12: 功能菜单与按钮权限树状勾选面板 */}
          <div className="lg:col-span-8 bg-card rounded-xl border border-border shadow-xs p-4 space-y-4">
            {/* 顶栏信息与操作按钮 */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border/60">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <FolderTree className="size-4 text-primary" />
                  <span>【{selectedRole.name}】功能菜单与按钮权限树</span>
                  <span className="text-xs font-mono text-muted-foreground font-normal">({selectedRole.code})</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">{selectedRole.desc}</p>
              </div>

              <button
                type="button"
                onClick={() => showToast(`已成功保存并下发角色【${selectedRole.name}】的全新权限树配置！`)}
                className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-lg shadow-xs cursor-pointer transition-colors"
              >
                保存权限设定
              </button>
            </div>

            {/* 树控制工具条 */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-panel rounded-xl border border-border text-xs">
              {/* 搜索框 */}
              <div className="relative">
                <Search className="size-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索菜单或权限项名称..."
                  value={treeSearchKw}
                  onChange={(e) => setTreeSearchKw(e.target.value)}
                  className="pl-8 pr-3 py-1 bg-card border border-border rounded-lg text-xs w-60 text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              {/* 快捷批量操作 */}
              <div className="flex items-center gap-2 font-medium">
                <button
                  type="button"
                  onClick={handleExpandAll}
                  className="text-muted-foreground hover:text-foreground hover:underline px-2 py-0.5 cursor-pointer"
                >
                  全部展开
                </button>
                <span className="text-muted-foreground/40">|</span>
                <button
                  type="button"
                  onClick={handleCollapseAll}
                  className="text-muted-foreground hover:text-foreground hover:underline px-2 py-0.5 cursor-pointer"
                >
                  全部折叠
                </button>
                <span className="text-muted-foreground/40">|</span>
                <button
                  type="button"
                  onClick={handleSelectAllPermissions}
                  className="text-primary hover:underline px-2 py-0.5 cursor-pointer"
                >
                  全选全部
                </button>
                <span className="text-muted-foreground/40">|</span>
                <button
                  type="button"
                  onClick={handleDeselectAllPermissions}
                  className="text-muted-foreground hover:text-foreground hover:underline px-2 py-0.5 cursor-pointer"
                >
                  清空全不选
                </button>
              </div>
            </div>

            {/* 树状结构视图主体 */}
            <div className="space-y-1.5 border border-border rounded-xl p-3 bg-card max-h-[620px] overflow-y-auto">
              {PERMISSION_TREE_DATA.map((moduleNode) => renderTreeNode(moduleNode, 0))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Tab 3: 数据范围权限矩阵 */}
      {/* ========================================================================= */}
      {activeTab === 'scope' && (
        <div className="bg-card rounded-xl border border-border shadow-xs p-4 space-y-4">
          <div className="border-b border-border/60 pb-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-primary" />
              各角色在特变电工 6 大直属制造公司的数据访问范围矩阵
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              根据集团分级风控规则，保障各工厂核心工艺数据、财务产值与单耗指标的隔离与授权穿透
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="bg-panel border-b border-border text-muted-foreground font-semibold">
                  <th className="py-2.5 px-3">角色名称</th>
                  {orgCompanies.map((c) => (
                    <th key={c.id} className="py-2.5 px-3">
                      {c.name} ({c.workshops.length}单位)
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-foreground">
                <tr className="hover:bg-accent/30 transition-colors">
                  <td className="py-3 px-3 font-bold text-foreground">集团超级管理员</td>
                  {orgCompanies.map((c) => (
                    <td key={c.id} className="py-3 px-3 text-emerald-400 font-medium">全量读写 · 审计</td>
                  ))}
                </tr>
                <tr className="hover:bg-accent/30 transition-colors">
                  <td className="py-3 px-3 font-bold text-foreground">集团能碳总监</td>
                  {orgCompanies.map((c) => (
                    <td key={c.id} className="py-3 px-3 text-primary font-medium">全量查看 · 报表审批</td>
                  ))}
                </tr>
                <tr className="hover:bg-accent/30 transition-colors">
                  <td className="py-3 px-3 font-bold text-foreground">园区能管主管</td>
                  <td className="py-3 px-3 text-primary font-bold bg-primary/10">沈变辖区读写</td>
                  {orgCompanies.slice(1).map((c) => (
                    <td key={c.id} className="py-3 px-3 text-muted-foreground/60">无权限</td>
                  ))}
                </tr>
                <tr className="hover:bg-accent/30 transition-colors">
                  <td className="py-3 px-3 font-bold text-foreground">工厂能耗申报员</td>
                  <td className="py-3 px-3 text-amber-400 font-medium bg-amber-500/10">沈变本部数据填报</td>
                  {orgCompanies.slice(1).map((c) => (
                    <td key={c.id} className="py-3 px-3 text-muted-foreground/60">无权限</td>
                  ))}
                </tr>
                <tr className="hover:bg-accent/30 transition-colors">
                  <td className="py-3 px-3 font-bold text-foreground">审计合规专员</td>
                  {orgCompanies.map((c) => (
                    <td key={c.id} className="py-3 px-3 text-muted-foreground font-medium">只读留痕</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Tab 4: 组织架构 (支持企业结构层级 增加、编辑、删除 CRUD) */}
      {/* ========================================================================= */}
      {activeTab === 'org' && (
        <div className="space-y-3.5 font-sans">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
            {/* 左侧 5/12: 企业结构层级树状面板 */}
            <div className="lg:col-span-5 bg-card rounded-xl border border-border shadow-xs p-3.5 space-y-3">
              {/* 树主体 */}
              <div className="space-y-1 text-xs select-none max-h-[660px] overflow-y-auto pr-1">
                {/* 根节点：集团总部 */}
                <div
                  onClick={() =>
                    setSelectedNodeModal({
                      type: 'group',
                      data: {
                        name: '特变电工（电装集团）双中心能碳管控平台',
                        code: 'TBEA_GROUP_ROOT',
                        sub: '集团总指挥中枢',
                        desc: '统筹全集团 2 大产业集群、直属制造公司与基层车间工厂的能耗双控、碳排放配额核算与实时微电网调优',
                        stat: `${orgCompanies.length} 大公司 · ${totalWorkshopCount} 个工厂 · 1,680 个在线测点 · 48 位在册能管人员`,
                        manager: '张建国 (超级管理员)',
                        province: '集团总部',
                        city: '能碳管理中心',
                        meterCount: orgCompanies.reduce((s, c) => s + c.meterCount, 0),
                      },
                    })
                  }
                  className={cn(
                    'flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer group',
                    selectedNodeModal?.type === 'group'
                      ? 'bg-primary/20 border-primary ring-2 ring-primary/30 shadow-2xs font-bold text-primary'
                      : 'bg-panel border-border text-foreground hover:bg-accent/40'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="size-4 text-primary" />
                    <span className="font-bold text-foreground">特变电工（电装集团）总部</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-primary/20 text-primary border border-primary/30 px-1.5 py-0.2 rounded font-mono font-bold">
                      集团级
                    </span>
                    <button
                      type="button"
                      title="新增直属公司"
                      onClick={(e) => {
                        e.stopPropagation()
                        setOrgModalMode('add_company')
                        setOrgModalTarget(null)
                        setOrgModalOpen(true)
                      }}
                      className="hidden group-hover:flex items-center gap-0.5 p-1 rounded hover:bg-primary/30 text-primary text-[10px] font-bold cursor-pointer"
                    >
                      <Plus className="size-3" />
                      <span>新增公司</span>
                    </button>
                  </div>
                </div>

                {/* 直属公司与车间层级树 (不区分产业集群) */}
                <div className="pl-3 border-l-2 border-border ml-3 space-y-1.5 mt-2">
                  {orgCompanies.map((comp) => {
                    const isExpanded = expandedCompanyIds.has(comp.id)
                    const isSelected = selectedNodeModal?.type === 'company' && selectedNodeModal.data.id === comp.id
                    return (
                      <div key={comp.id} className="space-y-1">
                        {/* 公司节点 */}
                        <div
                          className={cn(
                            'flex items-center justify-between py-1.5 px-2 rounded-lg border transition-all cursor-pointer group',
                            isSelected
                              ? 'bg-primary/20 border-primary/40 ring-1 ring-primary/30 font-bold text-primary'
                              : 'bg-panel border-border text-foreground hover:bg-accent/40'
                          )}
                        >
                          <div
                            onClick={() => setSelectedNodeModal({ type: 'company', data: comp })}
                            className="flex items-center gap-1.5 flex-1 truncate"
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleCompanyTopology(comp.id)
                              }}
                              className="size-4 rounded hover:bg-accent/40 flex items-center justify-center text-muted-foreground cursor-pointer"
                            >
                              {isExpanded ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
                            </button>
                            <Folder className="size-3.5 text-primary shrink-0" />
                            <span className="font-semibold truncate text-foreground">{comp.name}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">({comp.province.slice(0, 2)})</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <span
                              onClick={() => setSelectedNodeModal({ type: 'company', data: comp })}
                              className="text-[10px] bg-card text-muted-foreground border border-border px-1.5 rounded font-mono"
                            >
                              {comp.workshops.length}
                            </span>

                            {/* 悬浮快捷操作 */}
                            <div className="hidden group-hover:flex items-center gap-1 pl-1">
                              <button
                                type="button"
                                title="添加车间"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setOrgModalMode('add_workshop')
                                  setOrgModalParentCompanyId(comp.id)
                                  setOrgModalTarget(null)
                                  setOrgModalOpen(true)
                                }}
                                className="p-1 rounded hover:bg-primary/20 text-primary cursor-pointer"
                              >
                                <Plus className="size-3" />
                              </button>
                              <button
                                type="button"
                                title="编辑公司"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setOrgModalMode('edit_company')
                                  setOrgModalTarget(comp)
                                  setOrgModalOpen(true)
                                }}
                                className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer"
                              >
                                <Edit className="size-3" />
                              </button>
                              <button
                                type="button"
                                title="删除公司"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setOrgDeleteConfirm({
                                    type: 'company',
                                    id: comp.id,
                                    name: comp.name,
                                  })
                                }}
                                className="p-1 rounded hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                              >
                                <Trash2 className="size-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* 车间子列表 */}
                        {isExpanded && (
                          <div className="pl-4 border-l border-primary/30 ml-3 space-y-1 py-0.5">
                            {comp.workshops.map((ws) => {
                              const isWsSelected = selectedNodeModal?.type === 'workshop' && selectedNodeModal.data.id === ws.id
                              return (
                                <div
                                  key={ws.id}
                                  onClick={() =>
                                    setSelectedNodeModal({
                                      type: 'workshop',
                                      data: { ...ws, companyName: comp.name, province: comp.province, city: comp.city },
                                    })
                                  }
                                  className={cn(
                                    'flex items-center justify-between py-1 px-2 rounded-md transition-all cursor-pointer text-[11px] group/ws',
                                    isWsSelected
                                      ? 'bg-primary/20 text-primary font-bold shadow-2xs border border-primary/30'
                                      : 'text-muted-foreground hover:bg-accent/40 hover:text-foreground'
                                  )}
                                >
                                  <div className="flex items-center gap-1.5 truncate flex-1">
                                    <Factory className={cn('size-3 shrink-0', isWsSelected ? 'text-primary' : 'text-muted-foreground')} />
                                    <span className="truncate">{ws.name}</span>
                                  </div>

                                  <div className="flex items-center gap-1">
                                    <span className="text-[9px] bg-panel text-muted-foreground border border-border px-1 rounded font-mono shrink-0">
                                      {ws.badge}
                                    </span>

                                    {/* 车间快捷编辑/删除 */}
                                    <div className="hidden group-hover/ws:flex items-center gap-0.5 pl-1">
                                      <button
                                        type="button"
                                        title="编辑车间"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setOrgModalMode('edit_workshop')
                                          setOrgModalTarget(ws)
                                          setOrgModalOpen(true)
                                        }}
                                        className="p-0.5 rounded hover:bg-primary/20 text-primary cursor-pointer"
                                      >
                                        <Edit className="size-2.5" />
                                      </button>
                                      <button
                                        type="button"
                                        title="删除车间"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setOrgDeleteConfirm({
                                            type: 'workshop',
                                            id: ws.id,
                                            name: ws.name,
                                            parentCompanyId: comp.id,
                                          })
                                        }}
                                        className="p-0.5 rounded hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                                      >
                                        <Trash2 className="size-2.5" />
                                      </button>
                                    </div>
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
            </div>

            {/* 右侧 7/12: 选中组织机构详细权责与能管档案面板 */}
            <div className="lg:col-span-7 bg-card rounded-xl border border-border shadow-xs p-5 space-y-4">
              {selectedNodeModal ? (
                <div className="space-y-4 text-xs">
                  {/* 头部标题与层级 + 操作工具 */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border/60">
                    <div className="flex items-center gap-2.5">
                      <div className="size-9 rounded-xl bg-primary/20 border border-primary/30 text-primary flex items-center justify-center font-bold">
                        {selectedNodeModal.type === 'group' ? (
                          <Building2 className="size-5" />
                        ) : selectedNodeModal.type === 'company' ? (
                          <Folder className="size-5" />
                        ) : (
                          <Factory className="size-5" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">{selectedNodeModal.data.name}</h4>
                        <span className="text-[11px] font-mono text-muted-foreground">
                          组织代码: {selectedNodeModal.data.code || 'TBEA_ROOT'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'px-2.5 py-1 rounded-full text-[11px] font-bold',
                          selectedNodeModal.type === 'group'
                            ? 'bg-primary/20 text-primary border border-primary/30'
                            : selectedNodeModal.type === 'company'
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        )}
                      >
                        {selectedNodeModal.type === 'group'
                          ? '1级 集团总部'
                          : selectedNodeModal.type === 'company'
                          ? '2级 直属制造公司'
                          : '3级 基层车间工厂'}
                      </span>

                      {/* 编辑 / 删除按钮 */}
                      {selectedNodeModal.type === 'company' && (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setOrgModalMode('add_workshop')
                              setOrgModalParentCompanyId(selectedNodeModal.data.id)
                              setOrgModalTarget(null)
                              setOrgModalOpen(true)
                            }}
                            className="px-2.5 py-1 rounded-lg bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 font-bold cursor-pointer transition-colors"
                          >
                            + 添加车间
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setOrgModalMode('edit_company')
                              setOrgModalTarget(selectedNodeModal.data)
                              setOrgModalOpen(true)
                            }}
                            className="px-2.5 py-1 rounded-lg bg-panel hover:bg-accent border border-border text-foreground font-medium cursor-pointer"
                          >
                            编辑
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setOrgDeleteConfirm({
                                type: 'company',
                                id: selectedNodeModal.data.id,
                                name: selectedNodeModal.data.name,
                              })
                            }}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-400 font-medium cursor-pointer"
                          >
                            删除
                          </button>
                        </div>
                      )}

                      {selectedNodeModal.type === 'workshop' && (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setOrgModalMode('edit_workshop')
                              setOrgModalTarget(selectedNodeModal.data)
                              setOrgModalOpen(true)
                            }}
                            className="px-2.5 py-1 rounded-lg bg-panel hover:bg-accent border border-border text-foreground font-medium cursor-pointer"
                          >
                            编辑车间
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setOrgDeleteConfirm({
                                type: 'workshop',
                                id: selectedNodeModal.data.id,
                                name: selectedNodeModal.data.name,
                              })
                            }}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-400 font-medium cursor-pointer"
                          >
                            删除车间
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 核心指标 4 宫格 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-panel rounded-xl border border-border space-y-1">
                      <span className="text-muted-foreground text-[11px]">能管责任人 / 申报专员</span>
                      <div className="font-bold text-foreground text-xs">
                        {selectedNodeModal.data.lead || selectedNodeModal.data.manager || '张建国 (总管)'}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        联系电话: {selectedNodeModal.data.managerPhone || '138****0001'}
                      </div>
                    </div>

                    <div className="p-3 bg-panel rounded-xl border border-border space-y-1">
                      <span className="text-muted-foreground text-[11px]">在线遥测测点规模</span>
                      <div className="font-bold font-mono text-primary text-sm">
                        {selectedNodeModal.data.meters || selectedNodeModal.data.meterCount || 1680}{' '}
                        <span className="text-xs font-normal text-muted-foreground">个点位</span>
                      </div>
                      <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                        <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        SCADA / IoT 数据采集正常
                      </div>
                    </div>
                  </div>

                  {/* 工艺与用能描述 */}
                  {selectedNodeModal.data.craftDesc && (
                    <div className="space-y-1">
                      <label className="text-foreground font-bold">主要制造工艺与用能特征：</label>
                      <div className="p-3 bg-panel rounded-xl border border-border text-foreground leading-relaxed">
                        {selectedNodeModal.data.craftDesc}
                      </div>
                    </div>
                  )}

                  {/* 地理信息与数据权限范围 */}
                  <div className="p-3 bg-panel rounded-xl border border-border space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">地理辖区 / 厂址：</span>
                      <span className="font-medium text-foreground">
                        {selectedNodeModal.data.province || '辽宁省'} {selectedNodeModal.data.city || '沈阳市铁西区'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-border/60">
                      <span className="text-muted-foreground">数据范围隔离模式：</span>
                      <span className="font-bold text-primary">
                        {selectedNodeModal.type === 'group'
                          ? '全集团 (跨公司穿透)'
                          : selectedNodeModal.type === 'company'
                          ? '本直属公司 (含辖区全部车间)'
                          : '仅限本车间 (单工序填报)'}
                      </span>
                    </div>
                  </div>

                  {/* 若选中的是公司或集团，展示下属车间清单 */}
                  {selectedNodeModal.type === 'company' && selectedNodeModal.data.workshops && (
                    <div className="space-y-2">
                      <div className="font-bold text-foreground flex items-center justify-between">
                        <span>下属车间工序清单 ({selectedNodeModal.data.workshops.length} 个)</span>
                        <button
                          type="button"
                          onClick={() => {
                            setOrgModalMode('add_workshop')
                            setOrgModalParentCompanyId(selectedNodeModal.data.id)
                            setOrgModalTarget(null)
                            setOrgModalOpen(true)
                          }}
                          className="text-primary hover:underline font-bold cursor-pointer text-xs"
                        >
                          + 添加车间
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedNodeModal.data.workshops.map((w: any) => (
                          <div
                            key={w.id}
                            className="p-2.5 bg-panel rounded-lg border border-border flex items-center justify-between group"
                          >
                            <div>
                              <div className="font-medium text-foreground">{w.name}</div>
                              <div className="text-[10px] text-muted-foreground font-mono">管辖: {w.lead}</div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] bg-primary/20 text-primary border border-primary/30 px-1.5 py-0.5 rounded font-mono">
                                {w.meters} 测点
                              </span>
                              <button
                                type="button"
                                title="编辑车间"
                                onClick={() => {
                                  setOrgModalMode('edit_workshop')
                                  setOrgModalTarget(w)
                                  setOrgModalOpen(true)
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-accent text-muted-foreground hover:text-foreground rounded cursor-pointer"
                              >
                                <Edit className="size-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center text-muted-foreground space-y-2">
                  <Building2 className="size-10 text-muted-foreground/40" />
                  <p className="text-xs">请在左侧企业组织树中点击任意机构或车间节点，查看详细权责与能管档案</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 弹窗: 组织机构 增加 / 编辑 Modal (公司 / 车间) */}
      {/* ========================================================================= */}
      {orgModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 text-foreground">
            <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between bg-panel">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <FolderTree className="size-4 text-primary" />
                {orgModalMode === 'add_company' && '新增直属制造公司'}
                {orgModalMode === 'edit_company' && '编辑直属制造公司档案'}
                {orgModalMode === 'add_workshop' && '新增基层车间工序'}
                {orgModalMode === 'edit_workshop' && '编辑基层车间工序档案'}
              </h3>
              <button
                type="button"
                onClick={() => setOrgModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSaveOrgNode} className="p-5 space-y-3.5 text-xs font-sans">
              {/* 如果是增加/编辑公司 */}
              {(orgModalMode === 'add_company' || orgModalMode === 'edit_company') && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-foreground font-medium">公司全称 *</label>
                      <input
                        name="name"
                        required
                        defaultValue={orgModalTarget?.name || ''}
                        placeholder="如：天津特变电工公司"
                        className="w-full px-3 py-1.5 bg-panel border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-foreground font-medium">组织机构代码 *</label>
                      <input
                        name="code"
                        required
                        defaultValue={orgModalTarget?.code || `COMP_TB_${Math.floor(10 + Math.random() * 90)}`}
                        placeholder="如：COMP_TJ_07"
                        className="w-full px-3 py-1.5 bg-panel border border-border rounded-lg text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-foreground font-medium">省份 *</label>
                      <input
                        name="province"
                        required
                        defaultValue={orgModalTarget?.province || '天津市'}
                        placeholder="如：天津市"
                        className="w-full px-3 py-1.5 bg-panel border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-foreground font-medium">城市/园区厂址 *</label>
                      <input
                        name="city"
                        required
                        defaultValue={orgModalTarget?.city || '武清区京滨工业园'}
                        placeholder="如：武清区京滨工业园"
                        className="w-full px-3 py-1.5 bg-panel border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-foreground font-medium">能管负责人 *</label>
                      <input
                        name="manager"
                        required
                        defaultValue={orgModalTarget?.manager || '李明'}
                        placeholder="如：李明"
                        className="w-full px-3 py-1.5 bg-panel border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-foreground font-medium">联系电话</label>
                      <input
                        name="managerPhone"
                        defaultValue={orgModalTarget?.managerPhone || '138****6688'}
                        className="w-full px-3 py-1.5 bg-panel border border-border rounded-lg text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-foreground font-medium">测点总数</label>
                      <input
                        name="meterCount"
                        type="number"
                        defaultValue={orgModalTarget?.meterCount || 100}
                        className="w-full px-3 py-1.5 bg-panel border border-border rounded-lg text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* 如果是增加/编辑车间 */}
              {(orgModalMode === 'add_workshop' || orgModalMode === 'edit_workshop') && (
                <>
                  {orgModalMode === 'add_workshop' && (
                    <div className="space-y-1">
                      <label className="text-foreground font-medium">所属直属公司 *</label>
                      <select
                        name="parentCompanyId"
                        defaultValue={orgModalParentCompanyId}
                        className="w-full px-3 py-1.5 bg-panel border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                      >
                        {orgCompanies.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.province})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-foreground font-medium">车间/工序名称 *</label>
                      <input
                        name="name"
                        required
                        defaultValue={orgModalTarget?.name || ''}
                        placeholder="如：超高压换流变智能装配车间"
                        className="w-full px-3 py-1.5 bg-panel border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-foreground font-medium">车间代码 *</label>
                      <input
                        name="code"
                        required
                        defaultValue={orgModalTarget?.code || `WS_${Date.now().toString().slice(-4)}`}
                        placeholder="如：WS_TJ_MAIN"
                        className="w-full px-3 py-1.5 bg-panel border border-border rounded-lg text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-foreground font-medium">工序分类 *</label>
                      <select
                        name="badge"
                        defaultValue={orgModalTarget?.badge || '主体'}
                        className="w-full px-3 py-1.5 bg-panel border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                      >
                        <option value="主体">主体制造</option>
                        <option value="智能">智能产线</option>
                        <option value="综合">综合能源/微网</option>
                        <option value="制造">配套精工制造</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-foreground font-medium">现场管辖专员 *</label>
                      <input
                        name="lead"
                        required
                        defaultValue={orgModalTarget?.lead || '张强'}
                        placeholder="如：张强"
                        className="w-full px-3 py-1.5 bg-panel border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-foreground font-medium">在线测点规模</label>
                      <input
                        name="meters"
                        type="number"
                        defaultValue={orgModalTarget?.meters || 35}
                        className="w-full px-3 py-1.5 bg-panel border border-border rounded-lg text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-foreground font-medium">主要制造工艺与用能特征描述</label>
                    <textarea
                      name="craftDesc"
                      rows={2}
                      defaultValue={orgModalTarget?.craftDesc || '特高压变压器装配、全自动真空干燥窑炉与绝缘油加注试验'}
                      placeholder="描述该车间主要工序的重点用能介质（如高温热风、大功率干燥、立塔挤出等）..."
                      className="w-full px-3 py-1.5 bg-panel border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </>
              )}

              <div className="pt-3 border-t border-border/60 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOrgModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg border border-border hover:bg-accent/40 text-muted-foreground text-xs font-medium cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-xs cursor-pointer transition-colors"
                >
                  确认保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 弹窗: 删除确认 Dialog */}
      {/* ========================================================================= */}
      {orgDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in text-foreground">
            <div className="p-5 space-y-3 text-xs font-sans">
              <div className="size-10 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
                <AlertCircle className="size-6" />
              </div>

              <div className="text-center space-y-1">
                <h4 className="text-sm font-bold text-foreground">
                  确认删除【{orgDeleteConfirm.name}】？
                </h4>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  {orgDeleteConfirm.type === 'company'
                    ? '删除该直属公司将同步移除其下属全部车间工序及数据采集绑定，此操作不可撤销！'
                    : '删除该车间工序将同步解除其在线测点与单耗台账映射，请确认是否继续？'}
                </p>
              </div>

              <div className="pt-3 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setOrgDeleteConfirm(null)}
                  className="px-4 py-1.5 rounded-lg border border-border hover:bg-accent/40 text-muted-foreground text-xs font-medium cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteOrg}
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 弹窗 1: 新增/编辑用户账号 Modal */}
      {/* ========================================================================= */}
      {userModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 text-foreground">
            <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between bg-panel">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <UserPlus className="size-4 text-primary" />
                {editingUser ? '编辑人员账号与权限' : '新增人员账号'}
              </h3>
              <button
                type="button"
                onClick={() => setUserModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-5 space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-foreground font-medium">人员姓名 *</label>
                  <input
                    name="name"
                    required
                    defaultValue={editingUser?.name || ''}
                    placeholder="如：李明"
                    className="w-full px-3 py-1.5 bg-panel border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-foreground font-medium">员工工号 *</label>
                  <input
                    name="workNo"
                    required
                    defaultValue={editingUser?.workNo || `TB-${Math.floor(10000 + Math.random() * 90000)}`}
                    className="w-full px-3 py-1.5 bg-panel border border-border rounded-lg text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-foreground font-medium">登录账号 / 邮箱 *</label>
                <input
                  name="account"
                  type="email"
                  required
                  defaultValue={editingUser?.account || ''}
                  placeholder="如：liming@tbea.com"
                  className="w-full px-3 py-1.5 bg-panel border border-border rounded-lg text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-foreground font-medium">所属直属公司 *</label>
                  <select
                    name="company"
                    defaultValue={editingUser?.company || orgCompanies[0]?.name || '沈变公司'}
                    className="w-full px-3 py-1.5 bg-panel border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="电装集团总部">电装集团总部</option>
                    {orgCompanies.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-foreground font-medium">所属车间 / 部门 *</label>
                  <input
                    name="dept"
                    required
                    defaultValue={editingUser?.dept || '超高压变压器制造部'}
                    className="w-full px-3 py-1.5 bg-panel border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-foreground font-medium">分配系统角色 *</label>
                <select
                  name="roleId"
                  defaultValue={editingUser?.roleId || 'role_park_mgr'}
                  className="w-full px-3 py-1.5 bg-panel border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.desc.slice(0, 20)}...)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-foreground font-medium">数据权限范围 *</label>
                <select
                  name="dataScopeType"
                  defaultValue={editingUser?.dataScopeType || 'company'}
                  className="w-full px-3 py-1.5 bg-panel border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="all">全集团 (可查阅全部直属公司及下属工厂)</option>
                  <option value="company">本直属公司 (仅本公司及辖区内全部车间)</option>
                  <option value="factory">仅限本车间/工厂 (细粒度工厂级填报)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-foreground font-medium">手机号码</label>
                  <input
                    name="phone"
                    defaultValue={editingUser?.phone || '13800000000'}
                    className="w-full px-3 py-1.5 bg-panel border border-border rounded-lg text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-foreground font-medium">初始登录密码</label>
                  <input
                    disabled={!!editingUser}
                    defaultValue="Tbea@2026!"
                    className="w-full px-3 py-1.5 bg-panel border border-border rounded-lg text-xs font-mono text-muted-foreground"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUserModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg border border-border hover:bg-accent/40 text-muted-foreground text-xs font-medium cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-xs cursor-pointer transition-colors"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in text-foreground">
            <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between bg-panel">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <KeyRound className="size-4 text-amber-400" />
                重置用户密码
              </h3>
              <button
                type="button"
                onClick={() => setPwdModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs font-sans">
              <p className="text-muted-foreground">
                正在为用户 <strong className="text-foreground">【{pwdTargetUser.name}】</strong>（{pwdTargetUser.account}）重置登录密码：
              </p>

              <div className="space-y-1">
                <label className="text-foreground font-medium">新密码</label>
                <div className="flex items-center gap-2">
                  <input
                    value={newPwdVal}
                    onChange={(e) => setNewPwdVal(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-panel border border-border rounded-lg text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setNewPwdVal(`TB@${Math.floor(100000 + Math.random() * 900000)}`)}
                    className="px-2.5 py-1.5 bg-panel hover:bg-accent border border-border text-foreground rounded-lg text-xs font-mono cursor-pointer"
                  >
                    随机生成
                  </button>
                </div>
              </div>

              <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-[11px]">
                密码重置后，用户首次登录将被强制要求修改密码，并记录审计日志。
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPwdModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-border hover:bg-accent/40 text-muted-foreground text-xs font-medium cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast(`已成功为【${pwdTargetUser.name}】重置密码为：${newPwdVal}`)
                    setPwdModalOpen(false)
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-xs cursor-pointer transition-colors"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in text-foreground">
            <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between bg-panel">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="size-4 text-purple-400" />
                创建自定义权限角色
              </h3>
              <button
                type="button"
                onClick={() => setRoleModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
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
                showToast(`已成功创建自定义角色【${roleName}】！请在右侧树中继续配置详细权限。`)
              }}
              className="p-5 space-y-3.5 text-xs font-sans"
            >
              <div className="space-y-1">
                <label className="text-foreground font-medium">角色名称 *</label>
                <input
                  name="roleName"
                  required
                  placeholder="如：绿电交易核算专员"
                  className="w-full px-3 py-1.5 bg-panel border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-foreground font-medium">角色编码 *</label>
                <input
                  name="roleCode"
                  required
                  placeholder="如：ROLE_GREEN_POWER_TRADER"
                  className="w-full px-3 py-1.5 bg-panel border border-border rounded-lg text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-foreground font-medium">角色职责与使用场景描述</label>
                <textarea
                  name="desc"
                  rows={3}
                  placeholder="描述该角色的业务范围、可操作的子系统模块与职责边界..."
                  className="w-full px-3 py-1.5 bg-panel border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRoleModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-border hover:bg-accent/40 text-muted-foreground text-xs font-medium cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
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
