'use client'

import React, { useState, useMemo } from 'react'
import {
  Plug,
  Activity,
  ArrowRightLeft,
  Settings,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  Search,
  Plus,
  Edit,
  Trash2,
  SlidersHorizontal,
  History,
  FileCode,
  Check,
  X,
  Server,
  Layers,
  Sparkles,
  Wifi,
  WifiOff,
  Radio,
  ExternalLink,
  Code2,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  Building2,
  Factory,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// 全集团 6 大直属制造公司与 31 个车间工序层级树定义
interface OrgTopologyCompany {
  id: string
  name: string
  province: string
  workshops: { id: string; name: string; badge: string }[]
}

const ORG_TREE_COMPANIES: OrgTopologyCompany[] = [
  {
    id: 'comp_sb',
    name: '沈变公司',
    province: '辽宁沈阳',
    workshops: [
      { id: 'ws_sb_main', name: '沈变本部', badge: '主体' },
      { id: 'ws_sb_luna', name: '露娜智能制造', badge: '智能' },
      { id: 'ws_sb_zh', name: '智慧能源中心', badge: '综合' },
      { id: 'ws_sb_hx', name: '和新套管公司', badge: '主体' },
      { id: 'ws_sb_kj', name: '康嘉互感器', badge: '主体' },
      { id: 'ws_sb_yn', name: '印能制造分厂', badge: '制造' },
    ],
  },
  {
    id: 'comp_hb',
    name: '衡变公司',
    province: '湖南衡阳',
    workshops: [
      { id: 'ws_hb_main', name: '衡变本部', badge: '主体' },
      { id: 'ws_hb_nj', name: '南京电研', badge: '主体' },
      { id: 'ws_hb_yj', name: '云集电气', badge: '主体' },
      { id: 'ws_hb_hn', name: '湖南电气', badge: '主体' },
      { id: 'ws_hb_kg', name: '云集高压开关', badge: '主体' },
      { id: 'ws_hb_xj', name: '新疆自控', badge: '主体' },
      { id: 'ws_hb_sk', name: '上开制造部', badge: '制造' },
      { id: 'ws_hb_kbe', name: '柯贝尔材料', badge: '制造' },
      { id: 'ws_hb_tnj', name: '特能建', badge: '主体' },
      { id: 'ws_hb_hr', name: '合容电气', badge: '主体' },
      { id: 'ws_hb_gil', name: '赛杰爱迪', badge: '主体' },
    ],
  },
  {
    id: 'comp_xb',
    name: '新变厂',
    province: '新疆昌吉',
    workshops: [
      { id: 'ws_xb_uhv', name: '超高压公司', badge: '主体' },
      { id: 'ws_xb_tb', name: '天变公司', badge: '主体' },
      { id: 'ws_xb_zndq', name: '智能电气公司', badge: '主体' },
      { id: 'ws_xb_jjj', name: '京津冀公司', badge: '主体' },
      { id: 'ws_xb_zf', name: '珠峰硅钢', badge: '主体' },
      { id: 'ws_xb_zhny', name: '智慧能源', badge: '综合' },
      { id: 'ws_xb_yl', name: '银利电气', badge: '制造' },
    ],
  },
  {
    id: 'comp_ll',
    name: '鲁缆公司',
    province: '山东新泰',
    workshops: [
      { id: 'ws_ll_main', name: '鲁缆本部', badge: '主体' },
      { id: 'ws_ll_zl', name: '智缆公司', badge: '智能' },
      { id: 'ws_ll_sw', name: '昭和公司', badge: '制造' },
      { id: 'ws_ll_sg', name: '曙光公司', badge: '主体' },
    ],
  },
  {
    id: 'comp_xl',
    name: '新缆厂',
    province: '新疆乌鲁木齐',
    workshops: [
      { id: 'ws_xl_main', name: '新疆电缆', badge: '主体' },
      { id: 'ws_xl_sub', name: '新疆线缆厂', badge: '主体' },
    ],
  },
  {
    id: 'comp_dl',
    name: '德缆公司',
    province: '四川德阳',
    workshops: [
      { id: 'ws_dl_main', name: '德缆股份', badge: '主体' },
    ],
  },
]

// 接口定义接口
interface SubsystemInterface {
  id: string
  factory: string
  systemName: string
  systemType: 'SCADA' | 'MES' | 'EMS' | 'ERP' | 'IoT_Gateway'
  url: string
  protocol: 'RESTful API' | 'MQTT' | 'Modbus TCP' | 'OPC UA' | 'Kafka'
  authType: 'Bearer Token' | 'AppKey & AppSecret' | 'Basic Auth' | 'mTLS Certificate' | 'None'
  authSecretMasked: string
  timeoutSec: number
  retryCount: number
  retryStrategy: '线性重试' | '指数退避' | '固定间隔'
  syncFreq: string
  status: '正常在线' | '连接异常' | '同步延迟'
  latencyMs: number
  lastSyncTime: string
  fieldCount: number
}

// 字段映射项定义
interface FieldMappingItem {
  id: string
  sourceField: string
  sourceFieldName: string
  sourceUnit: string
  targetField: string
  targetFieldName: string
  targetUnit: string
  transformRule: string // 换算公式，如 `val * 1` 或 `val / 1000`
  sampleSourceVal: string
  sampleTargetVal: string
  status: '有效' | '待校验'
}

// 预设接口列表
const INITIAL_INTERFACES: SubsystemInterface[] = [
  {
    id: 'if_tj',
    factory: '沈变公司 · 沈变本部',
    systemName: '沈变特高压 SCADA 与能管系统',
    systemType: 'SCADA',
    url: 'https://scada-api.sb.tbea.local/v2/energy/telemetry',
    protocol: 'RESTful API',
    authType: 'Bearer Token',
    authSecretMasked: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    timeoutSec: 15,
    retryCount: 3,
    retryStrategy: '指数退避',
    syncFreq: '每 5 分钟',
    status: '正常在线',
    latencyMs: 86,
    lastSyncTime: '2026-09-01 15:25:00',
    fieldCount: 18,
  },
  {
    id: 'if_hy',
    factory: '衡变公司 · 衡变本部',
    systemName: '衡变南方制造 EMS 智慧能耗系统',
    systemType: 'EMS',
    url: 'https://ems.hy.tbea.local/api/v1/metrics/pull',
    protocol: 'RESTful API',
    authType: 'AppKey & AppSecret',
    authSecretMasked: 'AK_HY_789021_SEC_***998',
    timeoutSec: 20,
    retryCount: 3,
    retryStrategy: '指数退避',
    syncFreq: '每 5 分钟',
    status: '正常在线',
    latencyMs: 112,
    lastSyncTime: '2026-09-01 15:25:00',
    fieldCount: 22,
  },
  {
    id: 'if_xb',
    factory: '新变厂 · 超高压公司',
    systemName: '新疆特高压工业物联网 IoT 网关',
    systemType: 'IoT_Gateway',
    url: 'mqtt://iot-broker.xb.tbea.local:1883/tbea/xb/energy/#',
    protocol: 'MQTT',
    authType: 'Bearer Token',
    authSecretMasked: 'mqtt_tbea_token_xb_***',
    timeoutSec: 10,
    retryCount: 5,
    retryStrategy: '固定间隔',
    syncFreq: '实时消息流',
    status: '正常在线',
    latencyMs: 45,
    lastSyncTime: '2026-09-01 15:29:12',
    fieldCount: 16,
  },
  {
    id: 'if_ll',
    factory: '鲁缆公司 · 鲁缆本部',
    systemName: '鲁缆新泰线缆 MES 生产能耗工位系统',
    systemType: 'MES',
    url: 'https://mes.ll.tbea.local/api/energy/workshop/feed',
    protocol: 'RESTful API',
    authType: 'AppKey & AppSecret',
    authSecretMasked: 'AK_LL_442109_SEC_***112',
    timeoutSec: 30,
    retryCount: 2,
    retryStrategy: '线性重试',
    syncFreq: '每 15 分钟',
    status: '正常在线',
    latencyMs: 145,
    lastSyncTime: '2026-09-01 15:15:00',
    fieldCount: 14,
  },
  {
    id: 'if_xl',
    factory: '新缆厂 · 新疆电缆',
    systemName: '新疆电缆厂变电所自动化综合监控',
    systemType: 'SCADA',
    url: 'opc.tcp://opc-srv.xl.tbea.local:4840',
    protocol: 'OPC UA',
    authType: 'mTLS Certificate',
    authSecretMasked: 'CERT_SHA256_F98A21B90...',
    timeoutSec: 25,
    retryCount: 3,
    retryStrategy: '指数退避',
    syncFreq: '每 5 分钟',
    status: '同步延迟',
    latencyMs: 480,
    lastSyncTime: '2026-09-01 15:00:18',
    fieldCount: 12,
  },
  {
    id: 'if_dl',
    factory: '德缆公司 · 德缆股份',
    systemName: '德阳线缆基地 ERP 财务用能量数据中间表',
    systemType: 'ERP',
    url: 'https://erp.dl.tbea.local/odata/v4/EnergyLedger',
    protocol: 'RESTful API',
    authType: 'Basic Auth',
    authSecretMasked: 'dl_erp_admin:***',
    timeoutSec: 30,
    retryCount: 3,
    retryStrategy: '指数退避',
    syncFreq: '每日定时 (24:00)',
    status: '正常在线',
    latencyMs: 160,
    lastSyncTime: '2026-09-01 00:05:12',
    fieldCount: 8,
  },
]

// 预设字段映射示例数据 (以沈变为例)
const INITIAL_FIELD_MAPPINGS: FieldMappingItem[] = [
  {
    id: 'map_01',
    sourceField: 'sb_total_kwh',
    sourceFieldName: '总有功电量底数',
    sourceUnit: 'kWh',
    targetField: 'power_total_consumption',
    targetFieldName: '全厂工业总用电量',
    targetUnit: 'kWh',
    transformRule: 'val * 1',
    sampleSourceVal: '14,850,200',
    sampleTargetVal: '14,850,200 kWh',
    status: '有效',
  },
  {
    id: 'map_02',
    sourceField: 'sb_pv_self_gen',
    sourceFieldName: '屋顶光伏并网发电量',
    sourceUnit: 'kWh',
    targetField: 'solar_self_used_kwh',
    targetFieldName: '直供绿电自发自用量',
    targetUnit: 'kWh',
    transformRule: 'val * 1',
    sampleSourceVal: '3,250,000',
    sampleTargetVal: '3,250,000 kWh',
    status: '有效',
  },
  {
    id: 'map_03',
    sourceField: 'sb_gas_flow_nm3',
    sourceFieldName: '天然气流量计实测读数',
    sourceUnit: 'Nm³ (标方)',
    targetField: 'gas_natural_m3',
    targetFieldName: '管道天然气实物消耗量',
    targetUnit: 'm³',
    transformRule: 'val * 1.002',
    sampleSourceVal: '28,400',
    sampleTargetVal: '28,456.8 m³',
    status: '有效',
  },
  {
    id: 'map_04',
    sourceField: 'sb_steam_heat_gj',
    sourceFieldName: '供热管道蒸汽热量累积',
    sourceUnit: 'GJ (吉焦)',
    targetField: 'steam_consumption_t',
    targetFieldName: '外购蒸汽折算质量',
    targetUnit: 't (吨)',
    transformRule: 'val / 2.7567',
    sampleSourceVal: '3,914.5',
    sampleTargetVal: '1,420.0 t',
    status: '有效',
  },
  {
    id: 'map_05',
    sourceField: 'sb_main_trans_kva',
    sourceFieldName: '主变压器完工容量',
    sourceUnit: 'kVA',
    targetField: 'product_yield_kva',
    targetFieldName: '合格产品完工总容量',
    targetUnit: '万 kVA',
    transformRule: 'val / 10000',
    sampleSourceVal: '380,000',
    sampleTargetVal: '38.0 万 kVA',
    status: '有效',
  },
]

// 操作审计日志
const INITIAL_LOGS = [
  { id: 'log_01', time: '2026-09-01 14:10', user: '张建国 (管理员)', action: '更新接口连接参数', target: '沈变本部 SCADA 接口超时从 10s 调整为 15s', ip: '10.20.1.18' },
  { id: 'log_02', time: '2026-09-01 11:35', user: '李雅静 (ESG专员)', action: '新增字段映射规则', target: '衡变南方制造: 光伏微网反送电量 ➔ reverse_grid_kwh', ip: '10.20.1.45' },
  { id: 'log_03', time: '2026-08-31 16:20', user: '马俊杰 (新变厂)', action: '测试接口连通性', target: '新变厂 IoT 网关 MQTT 连接测试 (成功, 延迟 45ms)', ip: '10.23.4.15' },
  { id: 'log_04', time: '2026-08-30 09:15', user: '张建国 (管理员)', action: '更新 Token 凭证', target: '德缆股份 ERP 接口授权密钥轮转更新', ip: '10.20.1.18' },
]

export default function InterfaceConfigPage() {
  const [activeTab, setActiveTab] = useState<'interfaces' | 'mapping' | 'audit'>('interfaces')
  const [interfaces, setInterfaces] = useState<SubsystemInterface[]>(INITIAL_INTERFACES)
  const [mappings, setMappings] = useState<FieldMappingItem[]>(INITIAL_FIELD_MAPPINGS)
  const [selectedIf, setSelectedIf] = useState<SubsystemInterface>(INITIAL_INTERFACES[0])

  // 弹窗与抽屉
  const [testModalOpen, setTestModalOpen] = useState(false)
  const [testTesting, setTestTesting] = useState(false)
  const [testTargetIf, setTestTargetIf] = useState<SubsystemInterface | null>(null)
  const [editIfModalOpen, setEditIfModalOpen] = useState(false)
  const [editingIf, setEditingIf] = useState<SubsystemInterface | null>(null)
  const [selectedFactoryVal, setSelectedFactoryVal] = useState<string>('沈变公司 · 沈变本部')
  const [treeSelectOpen, setTreeSelectOpen] = useState(false)
  const [treeSelectSearch, setTreeSelectSearch] = useState('')
  const [expandedTreeCompanies, setExpandedTreeCompanies] = useState<Set<string>>(
    new Set(['comp_sb', 'comp_hb', 'comp_xb', 'comp_ll', 'comp_xl', 'comp_dl'])
  )
  const [mappingDrawerOpen, setMappingDrawerOpen] = useState(false)

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  // 执行接口测试连接
  const handleTestConnection = (item: SubsystemInterface) => {
    setTestTargetIf(item)
    setTestModalOpen(true)
    setTestTesting(true)
    setTimeout(() => {
      setTestTesting(false)
    }, 1200)
  }

  return (
    <div className="space-y-3.5 font-sans text-foreground">
      {/* 顶部 Header */}
      <div className="bg-card p-3.5 rounded-xl border border-border shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0">
            <Plug className="size-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">接口配置管理</h1>
            <p className="text-xs text-muted-foreground font-sans">
              维护各直属制造单位 SCADA / MES / EMS / IoT 子系统连接参数、字段映射转换规则、连通性探测与变更审计日志
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setEditingIf(null)
              setSelectedFactoryVal('沈变公司 · 沈变本部')
              setTreeSelectOpen(false)
              setEditIfModalOpen(true)
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs cursor-pointer shadow-xs transition-colors"
          >
            <Plus className="size-3.5" />
            <span>接入新子系统接口</span>
          </button>

          <button
            type="button"
            onClick={() => {
              showToast('正在对全集团 6 大直属工厂接口发起全量心跳探测...')
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-panel border border-border hover:bg-accent/40 text-foreground font-semibold text-xs cursor-pointer shadow-2xs transition-colors"
          >
            <Radio className="size-3.5 text-emerald-400 animate-pulse" />
            <span>一键全量探测</span>
          </button>
        </div>
      </div>

      {/* 提示 Toast */}
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
          onClick={() => setActiveTab('interfaces')}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer select-none',
            activeTab === 'interfaces'
              ? 'bg-primary/20 text-primary font-bold border border-primary/30 shadow-2xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
          )}
        >
          <Plug className="size-3.5" />
          <span>工厂子系统接口列表 ({interfaces.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('mapping')}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer select-none',
            activeTab === 'mapping'
              ? 'bg-primary/20 text-primary font-bold border border-primary/30 shadow-2xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
          )}
        >
          <ArrowRightLeft className="size-3.5" />
          <span>字段映射与单位换算规则</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer select-none',
            activeTab === 'audit'
              ? 'bg-primary/20 text-primary font-bold border border-primary/30 shadow-2xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
          )}
        >
          <History className="size-3.5" />
          <span>接口配置变更审计日志</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* Tab 1: 接口列表 */}
      {/* ========================================================================= */}
      {activeTab === 'interfaces' && (
        <div className="bg-card rounded-xl border border-border shadow-xs p-4 space-y-3.5">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="bg-panel border-b border-border text-muted-foreground font-semibold">
                  <th className="py-2.5 px-3">所属单位 / 接入工厂</th>
                  <th className="py-2.5 px-3">接口访问地址 (URL)</th>
                  <th className="py-2.5 px-3">通信协议</th>
                  <th className="py-2.5 px-3">认证方式</th>
                  <th className="py-2.5 px-3">超时时间</th>
                  <th className="py-2.5 px-3">运行状态</th>
                  <th className="py-2.5 px-3">响应延迟</th>
                  <th className="py-2.5 px-3">最近同步时间</th>
                  <th className="py-2.5 px-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-foreground">
                {interfaces.map((item) => (
                  <tr key={item.id} className="hover:bg-accent/30 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-foreground">{item.factory}</div>
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-muted-foreground max-w-xs truncate" title={item.url}>
                      {item.url}
                    </td>

                    <td className="py-3 px-3 font-semibold text-foreground">{item.protocol}</td>

                    <td className="py-3 px-3">
                      <div className="font-medium text-foreground">{item.authType}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{item.authSecretMasked}</div>
                    </td>

                    <td className="py-3 px-3 font-mono text-muted-foreground">
                      {item.timeoutSec}s
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium',
                          item.status === '正常在线'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        )}
                      >
                        <span className={cn('size-1.5 rounded-full', item.status === '正常在线' ? 'bg-emerald-400' : 'bg-amber-400')} />
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold">
                      <span className={item.latencyMs < 200 ? 'text-emerald-400' : 'text-amber-400'}>
                        {item.latencyMs} ms
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono text-muted-foreground text-[11px]">{item.lastSyncTime}</td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedIf(item)
                            setMappingDrawerOpen(true)
                          }}
                          className="text-primary hover:underline font-medium cursor-pointer"
                        >
                          字段映射 ({item.fieldCount})
                        </button>

                        <button
                          type="button"
                          onClick={() => handleTestConnection(item)}
                          className="text-emerald-400 hover:underline font-medium cursor-pointer"
                        >
                          测试连接
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingIf(item)
                            setSelectedFactoryVal(item.factory)
                            setTreeSelectOpen(false)
                            setEditIfModalOpen(true)
                          }}
                          className="text-muted-foreground hover:text-foreground hover:underline cursor-pointer"
                        >
                          配置参数
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
      {/* Tab 2: 字段映射与转换规则 */}
      {/* ========================================================================= */}
      {activeTab === 'mapping' && (
        <div className="bg-card rounded-xl border border-border shadow-xs p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border/60">
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <ArrowRightLeft className="size-4 text-primary" />
                工厂侧原始数据字段 ➔ 平台标准统一字段映射与单位换算
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                支持在数据接收时自动完成计量单位换算（如 GJ 换算为吨、Nm³ 标准方修正、万度折算等）
              </p>
            </div>

            <button
              type="button"
              onClick={() => showToast('已成功保存并重新编译字段映射转换规则！')}
              className="px-3.5 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs rounded-lg shadow-xs cursor-pointer"
            >
              保存映射规则
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="bg-panel border-b border-border text-muted-foreground font-semibold">
                  <th className="py-2.5 px-3">工厂原始数据项 / 采集单位</th>
                  <th className="py-2.5 px-3">平台标准指标项 / 目标单位</th>
                  <th className="py-2.5 px-3">单位换算 / 转换公式</th>
                  <th className="py-2.5 px-3">模拟测算效果</th>
                  <th className="py-2.5 px-3 text-right">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-foreground">
                {mappings.map((row) => (
                  <tr key={row.id} className="hover:bg-accent/30 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-foreground">{row.sourceFieldName}</div>
                      <span className="text-[10px] bg-panel text-muted-foreground px-1 rounded font-mono mt-0.5 inline-block border border-border">{row.sourceUnit}</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-foreground">{row.targetFieldName}</div>
                      <span className="text-[10px] bg-primary/20 text-primary px-1 rounded font-mono mt-0.5 inline-block border border-primary/30">{row.targetUnit}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-purple-400 font-bold">
                      <span className="bg-panel px-2 py-0.5 rounded border border-border inline-block">{row.transformRule}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px]">
                      <span className="text-muted-foreground">{row.sampleSourceVal}</span> ➔ <strong className="text-emerald-400">{row.sampleTargetVal}</strong>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Tab 3: 操作审计日志 */}
      {/* ========================================================================= */}
      {activeTab === 'audit' && (
        <div className="bg-card rounded-xl border border-border shadow-xs p-4 space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <History className="size-4 text-primary" />
              子系统接口参数变更与操作留痕审计
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              记录所有接口 URL、协议、认证密钥轮转、字段映射变动的操作人与 IP，不可篡改
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="bg-panel border-b border-border text-muted-foreground font-semibold">
                  <th className="py-2.5 px-3">时间</th>
                  <th className="py-2.5 px-3">操作人</th>
                  <th className="py-2.5 px-3">操作类型</th>
                  <th className="py-2.5 px-3">详细变更内容与目标</th>
                  <th className="py-2.5 px-3 text-right">操作 IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-foreground">
                {INITIAL_LOGS.map((log) => (
                  <tr key={log.id} className="hover:bg-accent/30 transition-colors">
                    <td className="py-3 px-3 font-mono text-muted-foreground">{log.time}</td>
                    <td className="py-3 px-3 font-bold text-foreground">{log.user}</td>
                    <td className="py-3 px-3">
                      <span className="bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded text-[11px] font-medium">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-foreground">{log.target}</td>
                    <td className="py-3 px-3 font-mono text-muted-foreground text-right">{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 弹窗 1: 测试连接 Modal */}
      {/* ========================================================================= */}
      {testModalOpen && testTargetIf && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in text-foreground">
            <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between bg-panel">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Radio className="size-4 text-emerald-400" />
                接口连通性在线测试
              </h3>
              <button
                type="button"
                onClick={() => setTestModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <span className="text-muted-foreground">测试目标接口：</span>
                <div className="font-bold text-foreground">{testTargetIf.factory} - {testTargetIf.systemName}</div>
                <div className="text-[11px] font-mono text-muted-foreground bg-panel p-2 rounded border border-border break-all">
                  {testTargetIf.url}
                </div>
              </div>

              {testTesting ? (
                <div className="py-6 flex flex-col items-center justify-center gap-3">
                  <div className="size-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-muted-foreground font-medium">正在握手通信并验证 Token 鉴权...</span>
                </div>
              ) : (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-2 text-foreground">
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <CheckCircle2 className="size-4" />
                    <span>接口连接成功！通信链路正常</span>
                  </div>
                  <div className="text-[11px] font-mono space-y-1 text-emerald-400">
                    <div>HTTP 状态码: 200 OK</div>
                    <div>握手与数据回传延迟: {testTargetIf.latencyMs} ms</div>
                    <div>鉴权状态: Bearer Token 校验通过</div>
                    <div>可解析遥测测点: {testTargetIf.fieldCount} 个</div>
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTestModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-xs cursor-pointer"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 弹窗 2: 编辑/新增接口连接参数 Modal */}
      {/* ========================================================================= */}
      {editIfModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 text-foreground">
            <div className="px-6 py-4.5 border-b border-border/60 flex items-center justify-between bg-panel">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Settings className="size-4 text-primary" />
                {editingIf ? '编辑子系统接口连接参数' : '接入新子系统接口'}
              </h3>
              <button
                type="button"
                onClick={() => setEditIfModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                showToast('已成功保存接口连接参数！')
                setEditIfModalOpen(false)
              }}
              className="p-6 space-y-4 text-xs font-sans"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 relative">
                  <label className="text-foreground font-medium">所属工厂 / 制造基地 *</label>
                  <input type="hidden" name="factory" value={selectedFactoryVal} />
                  
                  {/* 树状选择器触发按钮 */}
                  <button
                    type="button"
                    onClick={() => setTreeSelectOpen(!treeSelectOpen)}
                    className="w-full px-3.5 py-2 bg-panel border border-border rounded-lg text-xs flex items-center justify-between text-left focus:outline-none focus:border-primary cursor-pointer transition-all hover:border-primary/60 text-foreground"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <Factory className="size-3.5 text-primary shrink-0" />
                      <span className="font-bold text-foreground truncate">{selectedFactoryVal}</span>
                    </div>
                    <ChevronDown className={cn("size-3.5 text-muted-foreground shrink-0 transition-transform", treeSelectOpen && "rotate-180")} />
                  </button>

                  {/* 下拉层级树状弹出层 */}
                  {treeSelectOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-xl p-2.5 space-y-2 max-h-72 overflow-y-auto animate-in fade-in text-foreground">
                      {/* 搜索框 */}
                      <div className="relative">
                        <Search className="size-3 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="搜索公司或车间..."
                          value={treeSelectSearch}
                          onChange={(e) => setTreeSelectSearch(e.target.value)}
                          className="w-full pl-7 pr-2.5 py-1.5 bg-panel border border-border rounded-lg text-[11px] text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>

                      {/* 树状节点列表 */}
                      <div className="space-y-1 select-none">
                        {ORG_TREE_COMPANIES.map((comp) => {
                          const isCompExpanded = expandedTreeCompanies.has(comp.id)
                          const filteredWorkshops = comp.workshops.filter((w) =>
                            !treeSelectSearch ||
                            comp.name.includes(treeSelectSearch) ||
                            w.name.includes(treeSelectSearch)
                          )

                          if (treeSelectSearch && filteredWorkshops.length === 0 && !comp.name.includes(treeSelectSearch)) {
                            return null
                          }

                          return (
                            <div key={comp.id} className="space-y-0.5">
                              {/* 公司父节点 */}
                              <div
                                onClick={() => {
                                  setExpandedTreeCompanies((prev) => {
                                    const next = new Set(prev)
                                    if (next.has(comp.id)) next.delete(comp.id)
                                    else next.add(comp.id)
                                    return next
                                  })
                                }}
                                className="flex items-center justify-between py-1 px-1.5 rounded-lg hover:bg-accent/40 cursor-pointer text-foreground text-[11px] font-semibold"
                              >
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setExpandedTreeCompanies((prev) => {
                                        const next = new Set(prev)
                                        if (next.has(comp.id)) next.delete(comp.id)
                                        else next.add(comp.id)
                                        return next
                                      })
                                    }}
                                    className="size-3.5 flex items-center justify-center text-muted-foreground hover:text-foreground"
                                  >
                                    {isCompExpanded ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
                                  </button>
                                  <Folder className="size-3.5 text-primary" />
                                  <span>{comp.name}</span>
                                  <span className="text-[10px] text-muted-foreground font-mono font-normal">({comp.province})</span>
                                </div>
                                <span className="text-[10px] bg-panel text-muted-foreground px-1 rounded font-mono border border-border">
                                  {comp.workshops.length}车间
                                </span>
                              </div>

                              {/* 车间子节点列表 */}
                              {isCompExpanded && (
                                <div className="pl-4 border-l border-border ml-2.5 space-y-0.5 py-0.5">
                                  {filteredWorkshops.map((ws) => {
                                    const fullVal = `${comp.name} · ${ws.name}`
                                    const isSelected = selectedFactoryVal === fullVal
                                    return (
                                      <div
                                        key={ws.id}
                                        onClick={() => {
                                          setSelectedFactoryVal(fullVal)
                                          setTreeSelectOpen(false)
                                        }}
                                        className={cn(
                                          "flex items-center justify-between py-1 px-2 rounded-lg cursor-pointer text-[11px] transition-colors",
                                          isSelected
                                            ? "bg-primary/20 text-primary font-bold"
                                            : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                                        )}
                                      >
                                        <div className="flex items-center gap-1.5">
                                          <Factory className={cn("size-3", isSelected ? "text-primary" : "text-muted-foreground")} />
                                          <span>{ws.name}</span>
                                        </div>
                                        <span className="text-[9px] bg-panel text-muted-foreground px-1 rounded font-mono border border-border">
                                          {ws.badge}
                                        </span>
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
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-foreground font-medium">系统类型 *</label>
                  <select
                    defaultValue={editingIf?.systemType || 'SCADA'}
                    className="w-full px-3.5 py-2 bg-panel border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="SCADA">SCADA 自动化监控</option>
                    <option value="MES">MES 生产执行系统</option>
                    <option value="EMS">EMS 能源管理系统</option>
                    <option value="ERP">ERP 财务与物料系统</option>
                    <option value="IoT_Gateway">工业物联网 IoT 网关</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground font-medium">接口访问端点 (URL / Host:Port) *</label>
                <input
                  defaultValue={editingIf?.url || 'https://api.factory.tbea.local/v1/metrics'}
                  required
                  className="w-full px-3.5 py-2 bg-panel border border-border rounded-lg text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-foreground font-medium">通信协议 *</label>
                  <select
                    defaultValue={editingIf?.protocol || 'RESTful API'}
                    className="w-full px-3.5 py-2 bg-panel border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="RESTful API">RESTful API (HTTPS/JSON)</option>
                    <option value="MQTT">MQTT 消息流 (TCP/SSL)</option>
                    <option value="Modbus TCP">Modbus TCP 工业总线</option>
                    <option value="OPC UA">OPC UA 统一架构</option>
                    <option value="Kafka">Kafka 分布式消息队列</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-foreground font-medium">认证方式 *</label>
                  <select
                    defaultValue={editingIf?.authType || 'Bearer Token'}
                    className="w-full px-3.5 py-2 bg-panel border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="Bearer Token">Bearer Token</option>
                    <option value="AppKey & AppSecret">AppKey & AppSecret</option>
                    <option value="Basic Auth">Basic Auth</option>
                    <option value="mTLS Certificate">mTLS 双向证书</option>
                    <option value="None">无认证 (内网专用)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-foreground font-medium">超时时间 (秒)</label>
                  <input
                    type="number"
                    defaultValue={editingIf?.timeoutSec || 15}
                    className="w-full px-3.5 py-2 bg-panel border border-border rounded-lg text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-foreground font-medium">最大重试次数</label>
                  <input
                    type="number"
                    defaultValue={editingIf?.retryCount || 3}
                    className="w-full px-3.5 py-2 bg-panel border border-border rounded-lg text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-foreground font-medium">重试策略</label>
                  <select
                    defaultValue={editingIf?.retryStrategy || '指数退避'}
                    className="w-full px-3.5 py-2 bg-panel border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="指数退避">指数退避 (推荐)</option>
                    <option value="线性重试">线性重试</option>
                    <option value="固定间隔">固定间隔</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditIfModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border hover:bg-accent/40 text-muted-foreground text-xs font-medium cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-xs cursor-pointer transition-colors"
                >
                  确认保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 抽屉: 单接口字段映射配置 Drawer */}
      {/* ========================================================================= */}
      {mappingDrawerOpen && selectedIf && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="bg-card w-full max-w-xl h-full shadow-2xl p-5 space-y-4 overflow-y-auto animate-in slide-in-from-right text-foreground border-l border-border">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <ArrowRightLeft className="size-4 text-primary" />
                  【{selectedIf.factory}】字段映射规则
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">{selectedIf.systemName}</p>
              </div>
              <button
                type="button"
                onClick={() => setMappingDrawerOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">已生效字段映射清单 ({mappings.length})</span>
                <button
                  type="button"
                  onClick={() => showToast('已添加新字段映射规则')}
                  className="text-xs text-primary font-bold hover:underline cursor-pointer"
                >
                  + 添加映射字段
                </button>
              </div>

              <div className="space-y-2">
                {mappings.map((m) => (
                  <div key={m.id} className="p-3 bg-panel rounded-lg border border-border space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-foreground">{m.sourceField} ({m.sourceFieldName})</span>
                      <span className="text-muted-foreground">➔</span>
                      <span className="font-mono font-bold text-primary">{m.targetField} ({m.targetFieldName})</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/60 font-mono">
                      <span>转换公式: <strong className="text-purple-400">{m.transformRule}</strong></span>
                      <span>单位: {m.sourceUnit} ➔ {m.targetUnit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border/60 flex justify-end">
              <button
                type="button"
                onClick={() => setMappingDrawerOpen(false)}
                className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-bold text-xs shadow-xs cursor-pointer"
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