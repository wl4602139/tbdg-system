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
} from 'lucide-react'
import { cn } from '@/lib/utils'

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
    <div className="space-y-3.5">
      {/* 顶部 Header */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
            <Plug className="size-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">接口配置管理</h1>
            <p className="text-xs text-slate-500 font-sans">
              维护各直属制造单位 SCADA / MES / EMS / IoT 子系统连接参数、字段映射转换规则、连通性探测与变更审计日志
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setEditingIf(null)
              setEditIfModalOpen(true)
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white font-semibold text-xs cursor-pointer shadow-xs transition-colors"
          >
            <Plus className="size-3.5" />
            <span>接入新子系统接口</span>
          </button>

          <button
            type="button"
            onClick={() => {
              showToast('正在对全集团 6 大直属工厂接口发起全量心跳探测...')
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs cursor-pointer shadow-2xs transition-colors"
          >
            <Radio className="size-3.5 text-emerald-600 animate-pulse" />
            <span>一键全量探测</span>
          </button>
        </div>
      </div>

      {/* 提示 Toast */}
      {toastMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span className="font-sans font-medium">{toastMsg}</span>
        </div>
      )}

      {/* 4 大核心接口监控指标 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-sans">
            <span>已接入子系统接口</span>
            <Server className="size-4 text-[#1677ff]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-800">
            {interfaces.length} <span className="text-xs font-normal text-slate-400 font-sans">个通道</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
            <span>正常在线: <strong className="font-mono text-emerald-600">5 个</strong></span>
            <span>延迟告警: <strong className="font-mono text-amber-600">1 个</strong></span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-sans">
            <span>今日实时数据拉取量</span>
            <Activity className="size-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-600">
            184.2 <span className="text-xs font-normal text-slate-400 font-sans">万条点位</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
            <span>数据吞吐成功率: <strong className="font-mono text-emerald-700">99.98%</strong></span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-sans">
            <span>全网平均响应延迟</span>
            <Wifi className="size-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-purple-600">
            118 <span className="text-xs font-normal text-slate-400 font-sans">ms</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
            <span>最优节点 (新疆新变): <strong className="font-mono text-slate-700">45ms</strong></span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-sans">
            <span>字段映射规则库</span>
            <ArrowRightLeft className="size-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-amber-600">
            90 <span className="text-xs font-normal text-slate-400 font-sans">条映射规则</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
            <span>覆盖电/气/热/水/产值全部标准字段</span>
          </div>
        </div>
      </div>

      {/* Tab 导航 */}
      <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1 font-sans text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('interfaces')}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer select-none',
            activeTab === 'interfaces'
              ? 'bg-blue-50 text-[#1677ff] font-bold border border-blue-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
              ? 'bg-blue-50 text-[#1677ff] font-bold border border-blue-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
              ? 'bg-blue-50 text-[#1677ff] font-bold border border-blue-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3.5">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3">所属单位 / 子系统名称</th>
                  <th className="py-2.5 px-3">接口访问地址 (URL)</th>
                  <th className="py-2.5 px-3">通信协议</th>
                  <th className="py-2.5 px-3">认证方式</th>
                  <th className="py-2.5 px-3">超时 / 重试</th>
                  <th className="py-2.5 px-3">运行状态</th>
                  <th className="py-2.5 px-3">响应延迟</th>
                  <th className="py-2.5 px-3">最近同步时间</th>
                  <th className="py-2.5 px-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {interfaces.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{item.factory}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <span className="bg-slate-100 text-slate-600 px-1 rounded text-[10px]">{item.systemType}</span>
                        <span>{item.systemName}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600 max-w-xs truncate" title={item.url}>
                      {item.url}
                    </td>

                    <td className="py-3 px-3 font-semibold text-slate-800">{item.protocol}</td>

                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800">{item.authType}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.authSecretMasked}</div>
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-600">
                      <div>{item.timeoutSec}s 超时</div>
                      <div className="text-[10px] text-slate-400">{item.retryCount} 次 {item.retryStrategy}</div>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium',
                          item.status === '正常在线'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        )}
                      >
                        <span className={cn('size-1.5 rounded-full', item.status === '正常在线' ? 'bg-emerald-500' : 'bg-amber-500')} />
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold">
                      <span className={item.latencyMs < 200 ? 'text-emerald-600' : 'text-amber-600'}>
                        {item.latencyMs} ms
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">{item.lastSyncTime}</td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedIf(item)
                            setMappingDrawerOpen(true)
                          }}
                          className="text-[#1677ff] hover:underline font-medium cursor-pointer"
                        >
                          字段映射 ({item.fieldCount})
                        </button>

                        <button
                          type="button"
                          onClick={() => handleTestConnection(item)}
                          className="text-emerald-600 hover:underline font-medium cursor-pointer"
                        >
                          测试连接
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingIf(item)
                            setEditIfModalOpen(true)
                          }}
                          className="text-slate-600 hover:text-slate-900 hover:underline cursor-pointer"
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
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ArrowRightLeft className="size-4 text-[#1677ff]" />
                工厂侧原始数据字段 ➔ 平台标准统一字段映射与单位换算
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                支持在数据接收时自动完成计量单位换算（如 GJ 换算为吨、Nm³ 标准方修正、万度折算等）
              </p>
            </div>

            <button
              type="button"
              onClick={() => showToast('已成功保存并重新编译字段映射转换规则！')}
              className="px-3.5 py-1.5 bg-[#1677ff] hover:bg-blue-600 text-white font-bold text-xs rounded-lg shadow-xs cursor-pointer"
            >
              保存映射规则
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3">工厂侧原始字段 Key</th>
                  <th className="py-2.5 px-3">源字段描述 / 单位</th>
                  <th className="py-2.5 px-3 text-center">映射方向</th>
                  <th className="py-2.5 px-3">平台标准目标字段 Key</th>
                  <th className="py-2.5 px-3">标准名称 / 单位</th>
                  <th className="py-2.5 px-3">单位换算 / 转换公式</th>
                  <th className="py-2.5 px-3">模拟测算效果</th>
                  <th className="py-2.5 px-3 text-right">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {mappings.map((row) => (
                  <tr key={row.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{row.sourceField}</td>
                    <td className="py-3 px-3">
                      <div>{row.sourceFieldName}</div>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1 rounded font-mono">{row.sourceUnit}</span>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-400">➔</td>
                    <td className="py-3 px-3 font-mono font-bold text-[#1677ff]">{row.targetField}</td>
                    <td className="py-3 px-3">
                      <div>{row.targetFieldName}</div>
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-1 rounded font-mono">{row.targetUnit}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-purple-700 font-bold bg-purple-50/40 px-2 rounded">
                      {row.transformRule}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px]">
                      <span className="text-slate-400">{row.sampleSourceVal}</span> ➔ <strong className="text-emerald-600">{row.sampleTargetVal}</strong>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700">
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
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <History className="size-4 text-[#1677ff]" />
              子系统接口参数变更与操作留痕审计
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              记录所有接口 URL、协议、认证密钥轮转、字段映射变动的操作人与 IP，不可篡改
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3">时间</th>
                  <th className="py-2.5 px-3">操作人</th>
                  <th className="py-2.5 px-3">操作类型</th>
                  <th className="py-2.5 px-3">详细变更内容与目标</th>
                  <th className="py-2.5 px-3 text-right">操作 IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {INITIAL_LOGS.map((log) => (
                  <tr key={log.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-500">{log.time}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{log.user}</td>
                    <td className="py-3 px-3">
                      <span className="bg-blue-50 text-[#1677ff] border border-blue-200 px-2 py-0.5 rounded text-[11px] font-medium">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700">{log.target}</td>
                    <td className="py-3 px-3 font-mono text-slate-400 text-right">{log.ip}</td>
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
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Radio className="size-4 text-emerald-600" />
                接口连通性在线测试
              </h3>
              <button
                type="button"
                onClick={() => setTestModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <span className="text-slate-500">测试目标接口：</span>
                <div className="font-bold text-slate-900">{testTargetIf.factory} - {testTargetIf.systemName}</div>
                <div className="text-[11px] font-mono text-slate-500 bg-slate-50 p-2 rounded border border-slate-200 break-all">
                  {testTargetIf.url}
                </div>
              </div>

              {testTesting ? (
                <div className="py-6 flex flex-col items-center justify-center gap-3">
                  <div className="size-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-slate-600 font-medium">正在握手通信并验证 Token 鉴权...</span>
                </div>
              ) : (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-emerald-900">
                  <div className="flex items-center gap-2 font-bold text-emerald-700">
                    <CheckCircle2 className="size-4" />
                    <span>接口连接成功！通信链路正常</span>
                  </div>
                  <div className="text-[11px] font-mono space-y-1 text-emerald-800">
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
                  className="px-4 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-bold shadow-xs cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Settings className="size-4 text-[#1677ff]" />
                {editingIf ? '编辑子系统接口连接参数' : '接入新子系统接口'}
              </h3>
              <button
                type="button"
                onClick={() => setEditIfModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
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
              className="p-5 space-y-3.5 text-xs font-sans"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">所属工厂 / 制造基地 *</label>
                  <select
                    defaultValue={editingIf?.factory || '沈变公司 · 沈变本部'}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#1677ff]"
                  >
                    <option value="沈变公司 · 沈变本部">沈变公司 · 沈变本部</option>
                    <option value="衡变公司 · 衡变本部">衡变公司 · 衡变本部</option>
                    <option value="新变厂 · 超高压公司">新变厂 · 超高压公司</option>
                    <option value="鲁缆公司 · 鲁缆本部">鲁缆公司 · 鲁缆本部</option>
                    <option value="新缆厂 · 新疆电缆">新缆厂 · 新疆电缆</option>
                    <option value="德缆公司 · 德缆股份">德缆公司 · 德缆股份</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">系统类型 *</label>
                  <select
                    defaultValue={editingIf?.systemType || 'SCADA'}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#1677ff]"
                  >
                    <option value="SCADA">SCADA 自动化监控</option>
                    <option value="MES">MES 生产执行系统</option>
                    <option value="EMS">EMS 能源管理系统</option>
                    <option value="ERP">ERP 财务与物料系统</option>
                    <option value="IoT_Gateway">工业物联网 IoT 网关</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-medium">接口访问端点 (URL / Host:Port) *</label>
                <input
                  defaultValue={editingIf?.url || 'https://api.factory.tbea.local/v1/metrics'}
                  required
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#1677ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">通信协议 *</label>
                  <select
                    defaultValue={editingIf?.protocol || 'RESTful API'}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#1677ff]"
                  >
                    <option value="RESTful API">RESTful API (HTTPS/JSON)</option>
                    <option value="MQTT">MQTT 消息流 (TCP/SSL)</option>
                    <option value="Modbus TCP">Modbus TCP 工业总线</option>
                    <option value="OPC UA">OPC UA 统一架构</option>
                    <option value="Kafka">Kafka 分布式消息队列</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">认证方式 *</label>
                  <select
                    defaultValue={editingIf?.authType || 'Bearer Token'}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#1677ff]"
                  >
                    <option value="Bearer Token">Bearer Token</option>
                    <option value="AppKey & AppSecret">AppKey & AppSecret</option>
                    <option value="Basic Auth">Basic Auth</option>
                    <option value="mTLS Certificate">mTLS 双向证书</option>
                    <option value="None">无认证 (内网专用)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">超时时间 (秒)</label>
                  <input
                    type="number"
                    defaultValue={editingIf?.timeoutSec || 15}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#1677ff]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">最大重试次数</label>
                  <input
                    type="number"
                    defaultValue={editingIf?.retryCount || 3}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#1677ff]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">重试策略</label>
                  <select
                    defaultValue={editingIf?.retryStrategy || '指数退避'}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#1677ff]"
                  >
                    <option value="指数退避">指数退避 (推荐)</option>
                    <option value="线性重试">线性重试</option>
                    <option value="固定间隔">固定间隔</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditIfModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium cursor-pointer"
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
      {/* 抽屉: 单接口字段映射配置 Drawer */}
      {/* ========================================================================= */}
      {mappingDrawerOpen && selectedIf && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl p-5 space-y-4 overflow-y-auto animate-in slide-in-from-right">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <ArrowRightLeft className="size-4 text-[#1677ff]" />
                  【{selectedIf.factory}】字段映射规则
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedIf.systemName}</p>
              </div>
              <button
                type="button"
                onClick={() => setMappingDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">已生效字段映射清单 ({mappings.length})</span>
                <button
                  type="button"
                  onClick={() => showToast('已添加新字段映射规则')}
                  className="text-xs text-[#1677ff] font-bold hover:underline cursor-pointer"
                >
                  + 添加映射字段
                </button>
              </div>

              <div className="space-y-2">
                {mappings.map((m) => (
                  <div key={m.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-800">{m.sourceField} ({m.sourceFieldName})</span>
                      <span className="text-slate-400">➔</span>
                      <span className="font-mono font-bold text-[#1677ff]">{m.targetField} ({m.targetFieldName})</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 font-mono">
                      <span>转换公式: <strong className="text-purple-700">{m.transformRule}</strong></span>
                      <span>单位: {m.sourceUnit} ➔ {m.targetUnit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setMappingDrawerOpen(false)}
                className="px-4 py-1.5 bg-[#1677ff] hover:bg-blue-600 text-white rounded-lg font-bold text-xs shadow-xs cursor-pointer"
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