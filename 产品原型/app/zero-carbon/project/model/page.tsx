'use client'

import React, { useState, useMemo } from 'react'
import {
  Cpu,
  Plus,
  Search,
  History,
  RotateCcw,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  X,
  Sparkles,
  Download,
  Calendar,
  Layers,
  Zap,
  Sun,
  BatteryCharging,
  Flame,
  Check,
  FileCode,
  Tag,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// 单个历史版本记录
export interface ModelHistoryItem {
  version: string
  releaseTime: string
  author: string
  description: string
  paramsSnapshot: Record<string, string>
  isCurrent?: boolean
}

// 统一模型定义 (覆盖实时监控模型与经济效益评估模型)
export interface ZeroCarbonModel {
  id: string
  code: string
  name: string
  category: '实时监控计算模型' | '项目经济效益评估模型'
  version: string
  updateTime: string
  description: string
  formula: string
  standard: string
  status: '生效中' | '已停用'
  author: string
  params: { key: string; label: string; value: string }[]
  history: ModelHistoryItem[]
}

// 初始模型列表数据
const INITIAL_MODELS: ZeroCarbonModel[] = [
  {
    id: 'mdl-01',
    code: 'MDL-MON-PV-01',
    name: '分布式光伏实时出力与衰减模型',
    category: '实时监控计算模型',
    version: 'v2.1',
    updateTime: '2026-08-15 14:30',
    description: '依据 IEC 61724 规范，结合光照辐射与电池温度，实时测算分布式光伏理论发电出力、首年及逐年衰减率与系统性能比 PR。',
    formula: 'P_theory(t) = G(t) / 1000 × P_installed × [1 - α × (Y - 1)] × PR',
    standard: 'IEC 61724 国际规范',
    status: '生效中',
    author: '集团能碳资产管理部',
    params: [
      { key: 'deg_y1', label: '首年衰减基准', value: '2.0%' },
      { key: 'deg_annual', label: '逐年衰减率 (α)', value: '0.55%/年' },
      { key: 'pr', label: '系统综合性能比 (PR)', value: '82.0%' },
      { key: 'temp_coeff', label: '温度功率修正系数', value: '-0.38%/°C' },
    ],
    history: [
      {
        version: 'v2.1',
        releaseTime: '2026-08-15 14:30',
        author: '集团能碳资产管理部',
        description: '更新组件抗衰减修正参数，首年衰减由 2.5% 下调至 2.0%，逐年衰减下调至 0.55%。',
        paramsSnapshot: { 首年衰减: '2.0%', 逐年衰减: '0.55%/年', 系统PR: '82.0%' },
        isCurrent: true,
      },
      {
        version: 'v2.0',
        releaseTime: '2026-01-10 10:15',
        author: '能源数字化项目组',
        description: '引入动态阴影遮挡补偿因子与灰尘遮蔽修正算法。',
        paramsSnapshot: { 首年衰减: '2.5%', 逐年衰减: '0.60%/年', 系统PR: '80.5%' },
        isCurrent: false,
      },
      {
        version: 'v1.0',
        releaseTime: '2025-06-01 09:00',
        author: '战略规划部',
        description: '基础静态光伏装机出力估算模型初版发布。',
        paramsSnapshot: { 首年衰减: '3.0%', 逐年衰减: '0.70%/年', 系统PR: '78.0%' },
        isCurrent: false,
      },
    ],
  },
  {
    id: 'mdl-02',
    code: 'MDL-MON-ES-02',
    name: '电化学储能充放电与度电成本模型',
    category: '实时监控计算模型',
    version: 'v2.2',
    updateTime: '2026-08-18 09:20',
    description: '采用 LCOS 平准化度电成本模型，根据电芯循环次数与健康度 SOH，计算充放电往返效率 RTE 及两充两放峰谷套利收益。',
    formula: 'RTE = E_discharge / E_charge × 100% | LCOS = TotalCost / TotalEnergy',
    standard: 'LCOS 经济核算规范',
    status: '生效中',
    author: '装备动力部',
    params: [
      { key: 'rte', label: '往返充放效率 (RTE)', value: '88.5%' },
      { key: 'cycle_life', label: '设计循环寿命基准', value: '6,000 次' },
      { key: 'c_rate', label: '充放电倍率 (C-rate)', value: '0.5 C' },
      { key: 'dod', label: '设计放电深度 (DoD)', value: '90.0%' },
    ],
    history: [
      {
        version: 'v2.2',
        releaseTime: '2026-08-18 09:20',
        author: '装备动力部',
        description: '优化磷酸铁锂高温衰减曲线，RTE 综合基准由 86.0% 提升至 88.5%。',
        paramsSnapshot: { RTE效率: '88.5%', 循环寿命: '6,000次', DoD: '90.0%' },
        isCurrent: true,
      },
      {
        version: 'v2.0',
        releaseTime: '2026-02-15 16:40',
        author: '储能研发中心',
        description: '支持尖峰/平谷四段电价自动调度与套利测算。',
        paramsSnapshot: { RTE效率: '86.0%', 循环寿命: '5,000次', DoD: '85.0%' },
        isCurrent: false,
      },
      {
        version: 'v1.0',
        releaseTime: '2025-08-20 11:00',
        author: '战略规划部',
        description: '单充单放基础储能度电成本模型。',
        paramsSnapshot: { RTE效率: '84.0%', 循环寿命: '4,000次', DoD: '80.0%' },
        isCurrent: false,
      },
    ],
  },
  {
    id: 'mdl-03',
    code: 'MDL-MON-WH-03',
    name: '工业余热利用热力学折标模型',
    category: '实时监控计算模型',
    version: 'v2.0',
    updateTime: '2026-08-10 11:00',
    description: '依据 GB/T 2589 综合能耗折标标准，测算煤油气相干燥与真空干燥罐冷凝余热梯级回收量、等效蒸汽量与折标煤节能量。',
    formula: 'Q_heat = m × (h_steam - h_water) × η_recover',
    standard: 'GB/T 2589 推荐值',
    status: '生效中',
    author: '工艺技改办',
    params: [
      { key: 'steam_factor', label: '蒸汽折标煤系数', value: '0.1286 kgce/kg' },
      { key: 'recover_eff', label: '热回收换热效率 (η)', value: '86.5%' },
      { key: 'temp_diff', label: '梯级温差门限', value: '65 °C' },
    ],
    history: [
      {
        version: 'v2.0',
        releaseTime: '2026-08-10 11:00',
        author: '工艺技改办',
        description: '升级为双级热泵余热提升算法，换热效率提升至 86.5%。',
        paramsSnapshot: { 折标系数: '0.1286 kgce/kg', 换热效率: '86.5%' },
        isCurrent: true,
      },
      {
        version: 'v1.0',
        releaseTime: '2025-10-12 14:00',
        author: '沈变动力车间',
        description: '单级板换基础蒸汽余热折算初版。',
        paramsSnapshot: { 折标系数: '0.1286 kgce/kg', 换热效率: '78.0%' },
        isCurrent: false,
      },
    ],
  },
  {
    id: 'mdl-04',
    code: 'MDL-BEN-FIN-04',
    name: '零碳技改项目财务与经济效益评估模型',
    category: '项目经济效益评估模型',
    version: 'v2.1',
    updateTime: '2026-08-20 16:50',
    description: '支持输入项目投资、年节电/发电量、折现率、内部碳定价与运维费率，动态推演项目全周期 IRR、NPV 财务净现值与动态投资回收期。',
    formula: 'NPV = ∑(CI - CO)_t / (1 + ic)^t | IRR: NPV(IRR) = 0',
    standard: '建设项目经济评价方法与参数 (第三版)',
    status: '生效中',
    author: '财务资产管理中心',
    params: [
      { key: 'discount_rate', label: '财务基准折现率 (ic)', value: '6.0%' },
      { key: 'carbon_price', label: '集团内部碳定价', value: '¥85.0 元/吨' },
      { key: 'opex_rate', label: '年运维保险费率', value: '1.5%' },
      { key: 'grid_factor', label: '全国电网碳排放因子', value: '0.5350 tCO2/MWh' },
    ],
    history: [
      {
        version: 'v2.1',
        releaseTime: '2026-08-20 16:50',
        author: '财务资产管理中心',
        description: '按生态环境部 2026 最新要求，调整电网碳因子为 0.5350 tCO2/MWh，内部碳价上调至 85元/吨。',
        paramsSnapshot: { 折现率: '6.0%', 内部碳价: '¥85.0/吨', 电网因子: '0.5350 tCO2/MWh' },
        isCurrent: true,
      },
      {
        version: 'v2.0',
        releaseTime: '2026-01-05 15:30',
        author: '战略发展部',
        description: '引入 MACC 边际减排成本曲线分析算法与动态碳资产溢价收益。',
        paramsSnapshot: { 折现率: '6.5%', 内部碳价: '¥80.0/吨', 电网因子: '0.5703 tCO2/MWh' },
        isCurrent: false,
      },
      {
        version: 'v1.0',
        releaseTime: '2025-05-18 10:00',
        author: '财务部',
        description: '单一静态回收期经济测算初版模型。',
        paramsSnapshot: { 折现率: '7.0%', 内部碳价: '¥65.0/吨', 电网因子: '0.5703 tCO2/MWh' },
        isCurrent: false,
      },
    ],
  },
  {
    id: 'mdl-05',
    code: 'MDL-MON-MG-05',
    name: '微电网潮流协同与负荷柔性控制模型',
    category: '实时监控计算模型',
    version: 'v1.5',
    updateTime: '2026-07-28 17:10',
    description: '符合 IEEE 2030.7 标准，结合生产车间变压器试验冲击负荷曲线，实时调度储能与微电网负荷，实现秒级需量削峰与防逆流控制。',
    formula: 'P_grid(t) = P_load(t) - P_pv(t) - P_es_discharge(t) + P_es_charge(t)',
    standard: 'IEEE 2030.7 标准',
    status: '生效中',
    author: '信息化部 & 自动化所',
    params: [
      { key: 'response_time', label: '削峰响应时间', value: '≤ 200 ms' },
      { key: 'balance_target', label: '微网自平衡率', value: '≥ 92.0%' },
      { key: 'flex_range', label: '柔性调节深度', value: '25.0%' },
    ],
    history: [
      {
        version: 'v1.5',
        releaseTime: '2026-07-28 17:10',
        author: '信息化部',
        description: '优化冲击负荷超前 10s 预预测算法，将响应时延缩短至 200ms 内。',
        paramsSnapshot: { 响应时间: '≤ 200ms', 自平衡率: '≥ 92.0%' },
        isCurrent: true,
      },
      {
        version: 'v1.0',
        releaseTime: '2026-03-12 11:20',
        author: '自动化所',
        description: '微网静态功率平衡调度初版。',
        paramsSnapshot: { 响应时间: '≤ 1000ms', 自平衡率: '≥ 85.0%' },
        isCurrent: false,
      },
    ],
  },
]

export default function ModelManagePage() {
  const [models, setModels] = useState<ZeroCarbonModel[]>(INITIAL_MODELS)
  const [searchKw, setSearchKw] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<'all' | '实时监控计算模型' | '项目经济效益评估模型'>('all')

  // Toast 提示
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3500)
  }

  // 弹窗状态
  const [showAddModal, setShowAddModal] = useState(false)
  const [editModel, setEditModel] = useState<ZeroCarbonModel | null>(null)
  const [historyModalModel, setHistoryModalModel] = useState<ZeroCarbonModel | null>(null)
  const [detailModalModel, setDetailModalModel] = useState<ZeroCarbonModel | null>(null)

  // 添加模型表单状态
  const [formData, setFormData] = useState({
    name: '',
    category: '实时监控计算模型' as ZeroCarbonModel['category'],
    version: 'v1.0',
    formula: '',
    standard: '',
    description: '',
    author: '集团能碳资产管理部',
  })

  // 列表过滤
  const filteredModels = useMemo(() => {
    return models.filter((m) => {
      if (categoryFilter !== 'all' && m.category !== categoryFilter) return false
      if (searchKw.trim()) {
        const kw = searchKw.trim().toLowerCase()
        return (
          m.name.toLowerCase().includes(kw) ||
          m.code.toLowerCase().includes(kw) ||
          m.description.toLowerCase().includes(kw) ||
          m.version.toLowerCase().includes(kw)
        )
      }
      return true
    })
  }, [models, categoryFilter, searchKw])

  // 新增模型保存
  const handleSaveNewModel = () => {
    if (!formData.name || !formData.formula) {
      alert('请填写模型名称与计算公式！')
      return
    }

    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const newModel: ZeroCarbonModel = {
      id: `mdl-${Date.now()}`,
      code: `MDL-USER-${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name,
      category: formData.category,
      version: formData.version || 'v1.0',
      updateTime: nowStr,
      description: formData.description || '用户在线新增模型定义',
      formula: formData.formula,
      standard: formData.standard || '集团标准',
      status: '生效中',
      author: formData.author || '集团能碳资产管理部',
      params: [
        { key: 'param_1', label: '基准计算系数', value: '1.0' },
        { key: 'param_2', label: '修正因子', value: '0.95' },
      ],
      history: [
        {
          version: formData.version || 'v1.0',
          releaseTime: nowStr,
          author: formData.author || '集团能碳资产管理部',
          description: formData.description || '模型初版发布并生效',
          paramsSnapshot: { 基准系数: '1.0', 修正因子: '0.95' },
          isCurrent: true,
        },
      ],
    }

    setModels([newModel, ...models])
    setShowAddModal(false)
    setFormData({
      name: '',
      category: '实时监控计算模型',
      version: 'v1.0',
      formula: '',
      standard: '',
      description: '',
      author: '集团能碳资产管理部',
    })
    showToast(`✅ 新模型【${newModel.name}】已成功创建并加入模型库！`)
  }

  // 编辑模型保存
  const handleSaveEditModel = () => {
    if (!editModel) return
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)

    setModels((prev) =>
      prev.map((m) => {
        if (m.id === editModel.id) {
          return {
            ...editModel,
            updateTime: nowStr,
          }
        }
        return m
      })
    )

    setEditModel(null)
    showToast(`✅ 模型【${editModel.name}】配置已成功更新并重新发布！`)
  }

  // 历史版本回溯核心功能
  const handleRollback = (modelId: string, targetVersion: ModelHistoryItem) => {
    if (
      confirm(
        `确定要将模型【${historyModalModel?.name}】回溯恢复至历史版本【${targetVersion.version}】吗？\n恢复后将加载历史参数快照并重新生效。`
      )
    ) {
      const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)

      setModels((prev) =>
        prev.map((m) => {
          if (m.id === modelId) {
            const updatedHistory = m.history.map((h) => ({
              ...h,
              isCurrent: h.version === targetVersion.version,
            }))

            return {
              ...m,
              version: targetVersion.version,
              updateTime: nowStr,
              description: `[已回溯至 ${targetVersion.version}] ` + targetVersion.description,
              history: updatedHistory,
            }
          }
          return m
        })
      )

      // 更新当前查看的历史弹窗状态
      if (historyModalModel && historyModalModel.id === modelId) {
        setHistoryModalModel((prev) =>
          prev
            ? {
                ...prev,
                version: targetVersion.version,
                updateTime: nowStr,
                history: prev.history.map((h) => ({
                  ...h,
                  isCurrent: h.version === targetVersion.version,
                })),
              }
            : null
        )
      }

      showToast(`🔄 成功回溯！模型已恢复至历史版本【${targetVersion.version}】并生效！`)
    }
  }

  // 删除模型
  const handleDeleteModel = (id: string, name: string) => {
    if (confirm(`确定要停用/删除模型【${name}】吗？`)) {
      setModels((prev) => prev.filter((m) => m.id !== id))
      showToast(`🗑️ 模型【${name}】已移除`)
    }
  }

  return (
    <div className="space-y-3.5 font-sans text-slate-800 pb-10">
      {/* 顶部全局提示 Toast */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 p-3.5 bg-slate-900/90 text-white rounded-xl shadow-2xl border border-slate-700 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <Sparkles className="size-4 text-amber-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. 顶部 Header (操作栏) */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
            <Cpu className="size-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">模型管理</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="size-4" />
            添加模型
          </button>
          <button
            type="button"
            onClick={() => alert('已导出特变电工统一计算模型体系清单 (Excel)...')}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Download className="size-3.5 text-slate-500" />
            导出
          </button>
        </div>
      </div>

      {/* 2. 筛选过滤工具栏 */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">模型类别：</span>
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              className={cn(
                'px-3 py-1 rounded-md font-bold transition-all cursor-pointer',
                categoryFilter === 'all'
                  ? 'bg-white text-[#1677ff] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              全部模型 ({models.length})
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('实时监控计算模型')}
              className={cn(
                'px-3 py-1 rounded-md font-bold transition-all cursor-pointer',
                categoryFilter === '实时监控计算模型'
                  ? 'bg-white text-[#1677ff] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              实时监控计算模型 (
              {models.filter((m) => m.category === '实时监控计算模型').length}
              )
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('项目经济效益评估模型')}
              className={cn(
                'px-3 py-1 rounded-md font-bold transition-all cursor-pointer',
                categoryFilter === '项目经济效益评估模型'
                  ? 'bg-white text-[#1677ff] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              经济效益评估模型 (
              {models.filter((m) => m.category === '项目经济效益评估模型').length}
              )
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜索模型名称 / 编码 / 算法描述 / 版本号..."
            value={searchKw}
            onChange={(e) => setSearchKw(e.target.value)}
            className="h-8 pl-8 pr-3 w-72 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 font-mono transition-all"
          />
        </div>
      </div>

      {/* 3. 核心功能：模型管理标准数据列表 (Table) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-bold select-none">
                <th className="py-2.5 px-3 whitespace-nowrap min-w-[200px]">模型名称</th>
                <th className="py-2.5 px-3 whitespace-nowrap">模型类别</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-center">当前版本</th>
                <th className="py-2.5 px-3 whitespace-nowrap min-w-[280px]">核心算法与描述</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-center">历史版本</th>
                <th className="py-2.5 px-3 whitespace-nowrap">更新时间</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-center min-w-[140px]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredModels.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    暂无符合条件的模型数据
                  </td>
                </tr>
              ) : (
                filteredModels.map((m) => (
                  <tr
                    key={m.id}
                    className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                    onClick={() => setDetailModalModel(m)}
                  >
                    {/* 模型名称 */}
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900 group-hover:text-[#1677ff] transition-colors flex items-center gap-1.5">
                        <span>{m.name}</span>
                      </div>
                    </td>

                    {/* 模型类别 */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded text-[11px] font-bold border inline-block',
                          m.category === '实时监控计算模型'
                            ? 'bg-blue-50 text-[#1677ff] border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        )}
                      >
                        {m.category}
                      </span>
                    </td>

                    {/* 当前版本 */}
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-xs font-extrabold font-mono bg-blue-100 text-[#1677ff]">
                        {m.version}
                      </span>
                    </td>

                    {/* 描述 */}
                    <td className="py-2.5 px-3">
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {m.description}
                      </p>
                      <div className="text-[10.5px] font-mono text-blue-700 mt-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 truncate max-w-[340px]">
                        {m.formula}
                      </div>
                    </td>

                    {/* 历史版本 (可点击下钻回溯) */}
                    <td className="py-2.5 px-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setHistoryModalModel(m)}
                        className="px-2 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold flex items-center gap-1 mx-auto transition-colors cursor-pointer"
                        title="查看并回溯历史版本"
                      >
                        <History className="size-3.5 text-purple-600" />
                        <span>{m.history.length} 个版本</span>
                      </button>
                    </td>

                    {/* 更新时间 */}
                    <td className="py-2.5 px-3 whitespace-nowrap font-mono text-slate-500 text-[11px]">
                      {m.updateTime}
                    </td>

                    {/* 操作列 */}
                    <td className="py-2.5 px-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => setEditModel(m)}
                          className="p-1 rounded hover:bg-blue-100 text-slate-500 hover:text-[#1677ff] transition-colors"
                          title="编辑模型与修改参数"
                        >
                          <Edit className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setHistoryModalModel(m)}
                          className="p-1 rounded hover:bg-purple-100 text-slate-500 hover:text-purple-700 transition-colors"
                          title="版本演进与回溯"
                        >
                          <RotateCcw className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDetailModalModel(m)}
                          className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                          title="查看完整详情"
                        >
                          <Eye className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteModel(m.id, m.name)}
                          className="p-1 rounded hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors"
                          title="删除模型"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 表格底部汇总条 */}
        <div className="p-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 bg-slate-50/50">
          <div>
            当前模型库总计：<strong className="text-slate-800 font-mono">{filteredModels.length}</strong> 套模型在线受控 · 
            全生命周期版本追踪受区块链审计保护
          </div>
        </div>
      </div>

      {/* 🌟 4. 模态框：添加新模型 (Add Model Modal) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-blue-50 border border-blue-200 text-[#1677ff] flex items-center justify-center">
                  <Plus className="size-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">在线添加新计算模型</h3>
                  <p className="text-[11px] text-slate-500 font-mono">录入后将自动生成首版版本快照</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">模型名称 *</label>
                  <input
                    type="text"
                    placeholder="例如：工业空压站气电比能效优化模型"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">模型所属类别 *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-300 bg-white font-bold text-slate-800"
                  >
                    <option value="实时监控计算模型">⚡ 实时监控计算模型</option>
                    <option value="项目经济效益评估模型">💰 项目经济效益评估模型</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">初始版本号 *</label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-300 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">遵循行业/国家标准</label>
                  <input
                    type="text"
                    placeholder="例如：GB/T 2589-2020 / IEC 61724"
                    value={formData.standard}
                    onChange={(e) => setFormData({ ...formData, standard: e.target.value })}
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">计算公式 / 算法表达式 (LaTeX / 纯文本) *</label>
                <input
                  type="text"
                  placeholder="例如：Eff_air = V_output / P_input × (1 + Temp_factor)"
                  value={formData.formula}
                  onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
                  className="w-full h-8 px-2.5 rounded-lg border border-slate-300 font-mono font-bold text-blue-700 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">模型功能与算法描述</label>
                <textarea
                  rows={3}
                  placeholder="详细说明模型的适用场景、输入变量、输出指标与工程约束条件..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none text-xs"
                />
              </div>
            </div>

            <div className="p-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 font-medium"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveNewModel}
                className="px-4 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white font-bold shadow-xs flex items-center gap-1"
              >
                <Check className="size-3.5" />
                确认创建并入库
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🌟 5. 模态框：编辑与修改模型 (Edit Model Modal) */}
      {editModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-blue-50 border border-blue-200 text-[#1677ff] flex items-center justify-center">
                  <Edit className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">修改与维护模型信息</h3>
                  <p className="text-[11px] text-slate-500 font-mono">{editModel.name} ({editModel.code})</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditModel(null)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">模型名称 *</label>
                <input
                  type="text"
                  value={editModel.name}
                  onChange={(e) => setEditModel({ ...editModel, name: e.target.value })}
                  className="w-full h-8 px-2.5 rounded-lg border border-slate-300 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">计算公式 / 算法表达式 *</label>
                <input
                  type="text"
                  value={editModel.formula}
                  onChange={(e) => setEditModel({ ...editModel, formula: e.target.value })}
                  className="w-full h-8 px-2.5 rounded-lg border border-slate-300 font-mono font-bold text-blue-700"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">模型功能与算法描述</label>
                <textarea
                  rows={3}
                  value={editModel.description}
                  onChange={(e) => setEditModel({ ...editModel, description: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 block">模型核心计算参数调整：</span>
                <div className="grid grid-cols-2 gap-2">
                  {editModel.params.map((p, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-[11px] text-slate-500 block mb-1">{p.label}</span>
                      <input
                        type="text"
                        value={p.value}
                        onChange={(e) => {
                          const newParams = [...editModel.params]
                          newParams[idx].value = e.target.value
                          setEditModel({ ...editModel, params: newParams })
                        }}
                        className="w-full h-7 px-2 rounded border border-slate-300 bg-white font-mono font-bold text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setEditModel(null)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 font-medium"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveEditModel}
                className="px-4 py-1.5 rounded-lg bg-[#1677ff] hover:bg-blue-600 text-white font-bold"
              >
                保存修改
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🌟 6. 核心功能模态框：历史版本演进与一键回溯 (History & Rollback Modal) */}
      {historyModalModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 via-blue-50/30 to-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center">
                  <History className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    【{historyModalModel.name}】历史版本演进与回溯
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    当前生效版本: <strong className="text-[#1677ff]">{historyModalModel.version}</strong> · 支持一键版本恢复
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHistoryModalModel(null)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Body: 版本时间轴列表 */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="divide-y divide-slate-100">
                {historyModalModel.history.map((ver, idx) => {
                  const isCurrent = ver.version === historyModalModel.version
                  return (
                    <div
                      key={idx}
                      className={cn(
                        'py-3.5 px-3 rounded-xl transition-colors space-y-2',
                        isCurrent ? 'bg-blue-50/50 border border-blue-200' : 'hover:bg-slate-50'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm font-mono text-slate-900">{ver.version}</span>
                          {isCurrent ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              ● 当前正在生效
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                              已归档历史版
                            </span>
                          )}
                          <span className="text-[11px] text-slate-400 font-mono">发布时间: {ver.releaseTime}</span>
                        </div>

                        {/* 回溯按钮 */}
                        <div>
                          {isCurrent ? (
                            <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle2 className="size-3.5" />
                              运行中
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleRollback(historyModalModel.id, ver)}
                              className="px-3 py-1 rounded-lg bg-white hover:bg-purple-600 text-purple-700 hover:text-white border border-purple-300 text-xs font-bold flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                            >
                              <RotateCcw className="size-3.5" />
                              <span>回溯至此版本</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-sans">{ver.description}</p>
                      <span className="text-[11px] text-slate-400 block font-mono">维护责任人: {ver.author}</span>

                      {/* 参数快照 */}
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 font-mono text-[11px] space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase font-sans">版本参数快照：</span>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {Object.entries(ver.paramsSnapshot).map(([k, v]) => (
                            <span key={k} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              {k}: <strong className="text-blue-700">{v}</strong>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">
                回溯操作将自动更新全集团该计算模型的实时生效版本与运算参数。
              </span>
              <button
                type="button"
                onClick={() => setHistoryModalModel(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-white font-bold"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🌟 7. 模态框：查看模型完整详情 (Detail Modal) */}
      {detailModalModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-blue-50 border border-blue-200 text-[#1677ff] flex items-center justify-center font-mono font-bold text-sm">
                  {detailModalModel.version}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{detailModalModel.name}</h3>
                  <p className="text-[11px] text-slate-500 font-mono">{detailModalModel.code}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalModel(null)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 font-mono space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase font-sans">标准与计算公式：</div>
                <div className="text-blue-700 font-bold bg-white p-2 rounded border border-slate-200 text-[11.5px]">
                  {detailModalModel.formula}
                </div>
                <div className="text-slate-500 text-[11px] font-sans pt-1">
                  规范依据: {detailModalModel.standard}
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-sans block mb-1 font-bold">算法功能说明：</span>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-sans">
                  {detailModalModel.description}
                </p>
              </div>

              <div>
                <span className="text-slate-500 font-sans block mb-1 font-bold">基准参数配置集：</span>
                <div className="grid grid-cols-2 gap-2">
                  {detailModalModel.params.map((p, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex justify-between">
                      <span className="text-slate-500">{p.label}:</span>
                      <strong className="font-mono text-blue-700">{p.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-end text-xs">
              <button
                type="button"
                onClick={() => setDetailModalModel(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-white font-bold"
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
