'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  DollarSign,
  Zap,
  Flame,
  Droplets,
  Building2,
  Factory,
  MapPin,
  Copy,
  Plus,
  Trash2,
  History,
  Download,
  AlertTriangle,
  Lock,
  Check,
  X,
  Search,
  BarChart3,
  ArrowRightLeft,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Share2,
  Layers,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  ENTERPRISE_ORG_TREE,
  INITIAL_FACTORIES_DATA,
  flattenEnterpriseTree,
  type EnterpriseTreeNode,
  type FactoryProfile,
  type FactoryTariffScheme,
  type SchemeStatus,
} from '@/lib/price-enterprise-data'

export type { SchemeStatus, FactoryTariffScheme, FactoryProfile, EnterpriseTreeNode }

// 审计日志接口
interface AuditLogItem {
  id: string
  timestamp: string
  factoryName: string
  operator: string
  action: string
  target: string
  detail: string
}

// 全局初始审计日志
const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log_1',
    timestamp: '2026-01-05 10:30',
    factoryName: '沈变本部 (超高压制造)',
    operator: '张建国 (能碳总监)',
    action: '启用生效方案',
    target: 'v2026.01 辽宁方案',
    detail: '核准辽宁发改委 892 号文件，正式启用 2026 年度五时段方案，同步核算引擎。',
  },
  {
    id: 'log_2',
    timestamp: '2026-01-06 14:20',
    factoryName: '鲁缆本部 (高压立塔)',
    operator: '刘伟 (鲁缆设备动力处)',
    action: '调整时段划分',
    target: 'v2026.01 山东方案',
    detail: '根据山东省发改委最新现货消纳规则，配置 11:00~14:00 为深谷时段 (0.21元)。',
  },
  {
    id: 'log_3',
    timestamp: '2026-01-08 09:40',
    factoryName: '天变天津基地 (配电变压器)',
    operator: '王启华 (天变动力总工)',
    action: '启用生效方案',
    target: 'v2026.01 天津方案',
    detail: '核准静海源网荷储电价模型，配置储能峰谷套利考核。',
  },
]

export interface PriceSectionProps {
  defaultTab?: 'power' | 'gas' | 'steam_water'
}

export function PriceSection({ defaultTab = 'power' }: PriceSectionProps) {
  // 全量实体与工厂数据列表状态 (覆盖 6 大 2 级经营单位与 26+ 3/4 级工厂)
  const [factories, setFactories] = useState<FactoryProfile[]>(INITIAL_FACTORIES_DATA)
  // 当前选中的实体/工厂 ID (默认沈变本部 ws_sb_main)
  const [selectedFactoryId, setSelectedFactoryId] = useState<string>('ws_sb_main')
  // 企业结构树搜索过滤关键词
  const [factorySearchTerm, setFactorySearchTerm] = useState('')

  // 当前选中工厂下选中的方案版本 ID
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('sch_ws_sb_main_2026_01')

  // 内部三大能源 Tab 切换
  const [activeEnergyTab, setActiveEnergyTab] = useState<'power' | 'gas' | 'steam_water'>('power')

  // 季节口径切换 (夏季 vs 冬季)
  const [seasonMode, setSeasonMode] = useState<'summer' | 'winter'>('summer')

  // 审计日志列表
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS)

  // 弹窗状态管理
  const [isNewSchemeModalOpen, setIsNewSchemeModalOpen] = useState(false)
  const [isCloneModalOpen, setIsCloneModalOpen] = useState(false)
  const [isBenchmarkModalOpen, setIsBenchmarkModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false)

  // 费价多厂同步弹窗状态与选择项
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false)
  const [syncTargetFactoryIds, setSyncTargetFactoryIds] = useState<string[]>([])
  const [syncScope, setSyncScope] = useState({
    power: true,
    gas: true,
    steamWater: true,
  })

  // 企业结构树折叠状态：初始默认仅展开第一个节点 (沈变公司 comp_sb)，其余 2 级经营单位与 4 级工厂默认折叠
  const [collapsedKeys, setCollapsedKeys] = useState<Record<string, boolean>>({
    // 其余 5 大 2 级经营单位初始默认折叠 (仅第 1 个节点 comp_sb 沈变公司展开)
    comp_hb: true,
    comp_xb: true,
    comp_ll: true,
    comp_xl: true,
    comp_dl: true,
    // 下挂 4 级工厂的 3 级单位初始默认折叠
    ws_hb_kg: true,
    ws_hb_hr: true,
    ws_xb_tb: true,
    ws_ll_comp: true,
    ws_xl_comp: true,
  })

  const toggleCollapse = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setCollapsedKeys((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // 递归过滤企业结构树 (支持按经营单位、工厂简称、全称、省市模糊搜索)
  const filteredTree = useMemo(() => {
    if (!factorySearchTerm.trim()) return ENTERPRISE_ORG_TREE
    const q = factorySearchTerm.trim().toLowerCase()

    function filterNode(node: EnterpriseTreeNode): EnterpriseTreeNode | null {
      const matchSelf =
        node.name.toLowerCase().includes(q) ||
        node.fullName.toLowerCase().includes(q) ||
        node.city.toLowerCase().includes(q) ||
        node.province.toLowerCase().includes(q)

      const matchedChildren: EnterpriseTreeNode[] = []
      if (node.children && node.children.length > 0) {
        for (const child of node.children) {
          const res = filterNode(child)
          if (res) matchedChildren.push(res)
        }
      }

      if (matchSelf || matchedChildren.length > 0) {
        return {
          ...node,
          children: matchedChildren.length > 0 ? matchedChildren : node.children,
        }
      }
      return null
    }

    const res: EnterpriseTreeNode[] = []
    for (const rootNode of ENTERPRISE_ORG_TREE) {
      const matched = filterNode(rootNode)
      if (matched) res.push(matched)
    }
    return res
  }, [factorySearchTerm])

  // 跨厂克隆模板表单状态
  const [cloneSourceFactoryId, setCloneSourceFactoryId] = useState<string>('fac_sb')

  // 新建方案表单状态
  const [newSchemeForm, setNewSchemeForm] = useState({
    name: '',
    publishYear: '2026',
    effectiveDate: '2026-07-01',
    expiryDate: '2026-12-31',
    policyDoc: '',
    description: '',
  })

  // Toast 消息提示
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'warning' | 'info'; text: string } | null>(null)
  const showToast = (text: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToastMsg({ type, text })
    setTimeout(() => setToastMsg(null), 3500)
  }

  // 当前激活的工厂对象
  const currentFactory = useMemo(() => {
    return factories.find((f) => f.id === selectedFactoryId) || factories[0]
  }, [factories, selectedFactoryId])

  // 当前激活的费价方案对象
  const currentScheme = useMemo(() => {
    const matched = currentFactory.schemes.find((s) => s.id === selectedSchemeId)
    return matched || currentFactory.schemes[0]
  }, [currentFactory, selectedSchemeId])

  // 当切换工厂时，自动将选中的方案同步为该工厂的第一个方案 (通常是生效中方案)
  const handleSelectFactory = (factoryId: string) => {
    setSelectedFactoryId(factoryId)
    const targetFac = factories.find((f) => f.id === factoryId)
    if (targetFac && targetFac.schemes.length > 0) {
      // 优先选中处于“生效中”的方案
      const active = targetFac.schemes.find((s) => s.status === '生效中') || targetFac.schemes[0]
      setSelectedSchemeId(active.id)
    }
  }

  // 方案是否处于只读状态 (生效中、已归档、已停用 禁止直接改单价；调价必须复制生成新版本草稿)
  const isReadOnly = currentScheme.status === '生效中' || currentScheme.status === '已归档' || currentScheme.status === '已停用'

  // 更新当前工厂当前方案的表单字段
  const updateCurrentScheme = (updater: (prev: FactoryTariffScheme) => FactoryTariffScheme) => {
    if (isReadOnly) {
      showToast('当前方案处于生效中，价格锁定只读。如需调价，请点击右上方【复制调价】创建新草稿。', 'warning')
      return
    }
    setFactories((prev) =>
      prev.map((f) => {
        if (f.id === currentFactory.id) {
          return {
            ...f,
            schemes: f.schemes.map((s) => {
              if (s.id === currentScheme.id) {
                const next = updater(s)
                return {
                  ...next,
                  updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
                }
              }
              return s
            }),
          }
        }
        return f
      })
    )
  }

  // 电价分时单价变更
  const handleTouRateChange = (field: keyof FactoryTariffScheme['touRates'], value: string) => {
    updateCurrentScheme((sch) => ({
      ...sch,
      touRates: { ...sch.touRates, [field]: value },
    }))
  }

  // 24小时时段归属变更 (点击某个小时快速切换时段类型：深谷->低谷->平时->高峰->尖峰->深谷)
  const cycleHourSlot = (hourIdx: number) => {
    if (isReadOnly) {
      showToast('当前方案处于生效中，时段划分锁定只读。请先复制为新草稿再调整时段。', 'warning')
      return
    }
    const order: Array<'deep' | 'valley' | 'flat' | 'peak' | 'sharp'> = ['deep', 'valley', 'flat', 'peak', 'sharp']
    const curType = currentScheme.hourlySlots[seasonMode][hourIdx]
    const nextType = order[(order.indexOf(curType) + 1) % order.length]

    updateCurrentScheme((sch) => {
      const nextArr = [...sch.hourlySlots[seasonMode]]
      nextArr[hourIdx] = nextType
      return {
        ...sch,
        hourlySlots: {
          ...sch.hourlySlots,
          [seasonMode]: nextArr,
        },
      }
    })
  }

  // 阶梯天然气操作
  const handleAddGasTier = () => {
    if (isReadOnly) {
      showToast('当前方案处于生效中，已锁定只读。调价请点击【复制调价】', 'warning')
      return
    }
    const nextIdx = currentScheme.gasTiers.length + 1
    const newTier = {
      id: `gt_${Date.now()}`,
      tier: `第${nextIdx}档 (增容调节)`,
      range: '> 1,500,000 m³/月',
      price: '3.8500',
      note: '属地管网高阶加价',
    }
    updateCurrentScheme((sch) => ({
      ...sch,
      gasTiers: [...sch.gasTiers, newTier],
    }))
    showToast(`已成功新增【${newTier.tier}】`)
  }

  const handleDeleteGasTier = (tierId: string) => {
    if (isReadOnly) {
      showToast('当前方案处于生效中，已锁定只读。', 'warning')
      return
    }
    if (currentScheme.gasTiers.length <= 1) {
      showToast('至少须保留一档基准天然气计价档位', 'warning')
      return
    }
    updateCurrentScheme((sch) => ({
      ...sch,
      gasTiers: sch.gasTiers.filter((t) => t.id !== tierId),
    }))
    showToast('已删除指定阶梯档位')
  }

  const handleUpdateGasTier = (tierId: string, field: 'tier' | 'range' | 'price' | 'note', value: string) => {
    updateCurrentScheme((sch) => ({
      ...sch,
      gasTiers: sch.gasTiers.map((t) => (t.id === tierId ? { ...t, [field]: value } : t)),
    }))
  }

  // 蒸汽与水费价变更
  const handleHeatWaterChange = (field: keyof FactoryTariffScheme['heatWaterPrices'], value: string) => {
    updateCurrentScheme((sch) => ({
      ...sch,
      heatWaterPrices: { ...sch.heatWaterPrices, [field]: value },
    }))
  }

  // 核心功能 1：复制调价 (生成该工厂的新版本草稿，调价最佳实践)
  const handleCopySchemeForAdjustment = () => {
    const nextVerCode = `${currentScheme.versionCode.replace(/-草稿/g, '')}.02-草稿`
    const newId = `sch_${currentFactory.id}_${Date.now()}`
    const copiedScheme: FactoryTariffScheme = {
      ...currentScheme,
      id: newId,
      versionCode: nextVerCode,
      name: `${currentScheme.name.replace(/ \(调价新版本\)/g, '')} (调价草稿)`,
      status: '草稿',
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      operator: '工厂能碳主管',
      description: `基于原【${currentScheme.versionCode}】复制生成的调价草稿，待调整后提交生效。`,
    }

    setFactories((prev) =>
      prev.map((f) => {
        if (f.id === currentFactory.id) {
          return {
            ...f,
            schemes: [copiedScheme, ...f.schemes],
          }
        }
        return f
      })
    )
    setSelectedSchemeId(newId)

    // 记录审计日志
    const newLog: AuditLogItem = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      factoryName: currentFactory.shortName,
      operator: '工厂能碳主管',
      action: '复制调价草稿',
      target: nextVerCode,
      detail: `由生效方案【${currentScheme.versionCode}】复制生成调价草稿，单价解除锁定，可自由修改。`,
    }
    setAuditLogs((prev) => [newLog, ...prev])
    showToast(`已成功为【${currentFactory.shortName}】复制生成调价草稿【${nextVerCode}】！价格已解锁可编辑。`)
  }

  // 核心功能 2：新建方案草稿
  const handleCreateNewScheme = () => {
    if (!newSchemeForm.name.trim()) {
      showToast('请输入方案名称', 'warning')
      return
    }
    const newId = `sch_${currentFactory.id}_${Date.now()}`
    const nextVerCode = `v${newSchemeForm.publishYear}.${String(currentFactory.schemes.length + 1).padStart(2, '0')}-草稿`
    const newScheme: FactoryTariffScheme = {
      id: newId,
      versionCode: nextVerCode,
      name: newSchemeForm.name,
      publishYear: newSchemeForm.publishYear,
      effectiveDate: newSchemeForm.effectiveDate,
      expiryDate: newSchemeForm.expiryDate,
      status: '草稿',
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      operator: '工厂能碳主管',
      policyDoc: newSchemeForm.policyDoc || '发改委工商业目录电价文件',
      description: newSchemeForm.description || '新建工厂专属费价草稿',
      touRates: { ...currentScheme.touRates },
      hourlySlots: {
        summer: [...currentScheme.hourlySlots.summer],
        winter: [...currentScheme.hourlySlots.winter],
      },
      gasPricingMode: currentScheme.gasPricingMode,
      gasTiers: [...currentScheme.gasTiers],
      heatWaterPrices: { ...currentScheme.heatWaterPrices },
    }

    setFactories((prev) =>
      prev.map((f) => (f.id === currentFactory.id ? { ...f, schemes: [newScheme, ...f.schemes] } : f))
    )
    setSelectedSchemeId(newId)
    setIsNewSchemeModalOpen(false)
    setNewSchemeForm({
      name: '',
      publishYear: '2026',
      effectiveDate: '2026-07-01',
      expiryDate: '2026-12-31',
      policyDoc: '',
      description: '',
    })

    const newLog: AuditLogItem = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      factoryName: currentFactory.shortName,
      operator: '工厂能碳主管',
      action: '新建方案草稿',
      target: nextVerCode,
      detail: `新建费价方案，设定起止周期为 ${newScheme.effectiveDate} ~ ${newScheme.expiryDate}。`,
    }
    setAuditLogs((prev) => [newLog, ...prev])
    showToast(`已成功为【${currentFactory.shortName}】创建方案草稿【${nextVerCode}】`)
  }

  // 核心功能 3：跨工厂复制方案模板 (借鉴其他工厂成熟方案结构)
  const handleCloneFromOtherFactory = () => {
    const srcFactory = factories.find((f) => f.id === cloneSourceFactoryId)
    if (!srcFactory || srcFactory.schemes.length === 0) {
      showToast('源工厂暂无可用方案', 'warning')
      return
    }
    const srcScheme = srcFactory.schemes.find((s) => s.status === '生效中') || srcFactory.schemes[0]
    const newId = `sch_${currentFactory.id}_clone_${Date.now()}`
    const nextVerCode = `v2026.${String(currentFactory.schemes.length + 1).padStart(2, '0')}-克隆`

    const clonedScheme: FactoryTariffScheme = {
      ...srcScheme,
      id: newId,
      versionCode: nextVerCode,
      name: `${currentFactory.shortName}专属费价方案 (参考${srcFactory.shortName}模板)`,
      status: '草稿',
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      operator: '集团能碳工程师',
      description: `从【${srcFactory.shortName}】方案【${srcScheme.versionCode}】克隆导入，请针对本地发改委电价政策调整单价。`,
    }

    setFactories((prev) =>
      prev.map((f) => (f.id === currentFactory.id ? { ...f, schemes: [clonedScheme, ...f.schemes] } : f))
    )
    setSelectedSchemeId(newId)
    setIsCloneModalOpen(false)

    const newLog: AuditLogItem = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      factoryName: currentFactory.shortName,
      operator: '集团能碳工程师',
      action: '跨厂克隆方案',
      target: nextVerCode,
      detail: `从【${srcFactory.shortName}】成功克隆方案结构，当前为草稿状态，待属地化校验。`,
    }
    setAuditLogs((prev) => [newLog, ...prev])
    showToast(`已成功将【${srcFactory.shortName}】的方案克隆至【${currentFactory.shortName}】！`)
  }

  // 核心功能 4：启用方案并进行“同一工厂时间重叠冲突校验”
  const handleActivateScheme = (targetSchemeId: string) => {
    const targetScheme = currentFactory.schemes.find((s) => s.id === targetSchemeId)
    if (!targetScheme) return

    const targetStart = new Date(targetScheme.effectiveDate).getTime()
    const targetEnd = new Date(targetScheme.expiryDate).getTime()

    // 检查该工厂内其他处于“生效中”的方案是否存在时间重叠
    const overlappingScheme = currentFactory.schemes.find(
      (s) =>
        s.id !== targetSchemeId &&
        s.status === '生效中' &&
        Math.max(targetStart, new Date(s.effectiveDate).getTime()) <=
          Math.min(targetEnd, new Date(s.expiryDate).getTime())
    )

    let conflictWarning = ''
    if (overlappingScheme) {
      conflictWarning = `原生效方案【${overlappingScheme.versionCode} (${overlappingScheme.effectiveDate} ~ ${overlappingScheme.expiryDate})】因周期重叠，已自动失效归档。`
    }

    const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 16)

    setFactories((prev) =>
      prev.map((f) => {
        if (f.id === currentFactory.id) {
          return {
            ...f,
            schemes: f.schemes.map((s) => {
              if (s.id === targetSchemeId) {
                return { ...s, status: '生效中', updatedAt: nowTime }
              }
              // 重叠的原生效方案自动切换为“已归档”
              if (s.id === overlappingScheme?.id) {
                return { ...s, status: '已归档', updatedAt: nowTime }
              }
              return s
            }),
          }
        }
        return f
      })
    )

    const newLog: AuditLogItem = {
      id: `log_${Date.now()}`,
      timestamp: nowTime,
      factoryName: currentFactory.shortName,
      operator: '集团能碳总监',
      action: '正式启用方案',
      target: targetScheme.versionCode,
      detail: `方案正式启用为【生效中】。${conflictWarning}`,
    }
    setAuditLogs((prev) => [newLog, ...prev])
    showToast(`方案【${targetScheme.versionCode}】已正式生效！${conflictWarning}`)
  }

  // 可接收同步的目标工厂列表 (排除当前源工厂)
  const availableTargetFactories = useMemo(() => {
    return factories.filter((f) => f.id !== currentFactory.id)
  }, [factories, currentFactory.id])

  // 全选/清空同步目标工厂
  const toggleSelectAllSync = () => {
    if (syncTargetFactoryIds.length === availableTargetFactories.length) {
      setSyncTargetFactoryIds([])
    } else {
      setSyncTargetFactoryIds(availableTargetFactories.map((f) => f.id))
    }
  }

  const toggleSelectSyncFactory = (id: string) => {
    setSyncTargetFactoryIds((prev) =>
      prev.includes(id) ? prev.filter((fId) => fId !== id) : [...prev, id]
    )
  }

  // 按照6大二级经营单位分组目标工厂
  const companyGroups = useMemo(() => {
    return ENTERPRISE_ORG_TREE.map((co) => {
      const coFactories = availableTargetFactories.filter(
        (f) => f.companyName === co.name || f.shortName === co.name
      )
      return {
        company: co,
        factories: coFactories,
      }
    }).filter((g) => g.factories.length > 0)
  }, [availableTargetFactories])

  // 按二级经营单位全选/反选下属工厂
  const toggleSelectCompanyFactories = (companyName: string) => {
    const groupFacs = availableTargetFactories.filter(
      (f) => f.companyName === companyName || f.shortName === companyName
    )
    const groupIds = groupFacs.map((f) => f.id)
    const allSelected = groupIds.length > 0 && groupIds.every((id) => syncTargetFactoryIds.includes(id))
    if (allSelected) {
      setSyncTargetFactoryIds((prev) => prev.filter((id) => !groupIds.includes(id)))
    } else {
      setSyncTargetFactoryIds((prev) => Array.from(new Set([...prev, ...groupIds])))
    }
  }

  // 核心功能 5：批量同步费价到其他工厂
  const handleExecuteSync = () => {
    if (syncTargetFactoryIds.length === 0) {
      showToast('请至少选择一家要同步的目标工厂', 'warning')
      return
    }

    const nowTime = new Date().toISOString().replace('T', ' ').substring(0, 16)
    const targetNames = factories
      .filter((f) => syncTargetFactoryIds.includes(f.id))
      .map((f) => f.shortName)

    setFactories((prev) =>
      prev.map((fac) => {
        if (syncTargetFactoryIds.includes(fac.id)) {
          const newSchemeId = `sch_${fac.id}_sync_${Date.now()}`
          const nextVerCode = `v2026.${String(fac.schemes.length + 1).padStart(2, '0')}-同步`
          const baseScheme = fac.schemes.find((s) => s.status === '生效中') || fac.schemes[0]

          const syncedScheme: FactoryTariffScheme = {
            ...baseScheme,
            id: newSchemeId,
            versionCode: nextVerCode,
            name: `${fac.shortName}费价方案 (同步自${currentFactory.shortName})`,
            status: '草稿',
            updatedAt: nowTime,
            operator: '集团能碳管理员',
            description: `由【${currentFactory.shortName}】方案【${currentScheme.versionCode}】同步导入，待核对本厂属地政策后启用。`,
            touRates: syncScope.power ? { ...currentScheme.touRates } : baseScheme.touRates,
            hourlySlots: syncScope.power ? { ...currentScheme.hourlySlots } : baseScheme.hourlySlots,
            gasPricingMode: syncScope.gas ? currentScheme.gasPricingMode : baseScheme.gasPricingMode,
            gasTiers: syncScope.gas ? [...currentScheme.gasTiers] : baseScheme.gasTiers,
            heatWaterPrices: syncScope.steamWater ? { ...currentScheme.heatWaterPrices } : baseScheme.heatWaterPrices,
          }

          return {
            ...fac,
            schemes: [syncedScheme, ...fac.schemes],
          }
        }
        return fac
      })
    )

    // 记录审计日志
    const newLog: AuditLogItem = {
      id: `log_${Date.now()}`,
      timestamp: nowTime,
      factoryName: currentFactory.shortName,
      operator: '集团能碳管理员',
      action: '费价批量同步',
      target: `同步至 ${targetNames.length} 家工厂`,
      detail: `将【${currentFactory.shortName}】的方案【${currentScheme.versionCode}】配置同步至：${targetNames.join('、')}。已在各厂生成同步草稿。`,
    }
    setAuditLogs((prev) => [newLog, ...prev])
    setIsSyncModalOpen(false)
    setSyncTargetFactoryIds([])
    showToast(`已成功将【${currentFactory.shortName}】费价配置同步至 ${targetNames.length} 家目标工厂！`)
  }

  // 核心功能 6：导出 CSV 报表 (当前工厂或全集团报表)
  const handleExportAll = () => {
    const csvRows: string[] = []
    csvRows.push('特变电工集团直属工厂能源费价模型与属地政策汇总表')
    csvRows.push(`导出时间,${new Date().toISOString().replace('T', ' ').substring(0, 19)}`)
    csvRows.push('')
    csvRows.push('工厂名称,所属省市,电网公司,当前生效方案,生效周期,执行计费方式,深谷(元),低谷(元),平时(元),高峰(元),尖峰(元),最大峰谷差(元),天然气基准价(元/m³),过热蒸汽(元/t)')

    factories.forEach((f) => {
      const active = f.schemes.find((s) => s.status === '生效中') || f.schemes[0]
      const spread = (parseFloat(active.touRates.sharp) - parseFloat(active.touRates.deep)).toFixed(4)
      csvRows.push(
        `"${f.name}","${f.province} ${f.city}","${f.gridCompany}","${active.versionCode}","${active.effectiveDate} ~ ${active.expiryDate}","${active.touRates.billingMethod === 'demand' ? '两部制(需量)' : '两部制(容量)'}",${active.touRates.deep},${active.touRates.valley},${active.touRates.flat},${active.touRates.peak},${active.touRates.sharp},${spread},${active.gasTiers[0]?.price || '2.85'},${active.heatWaterPrices.steamSuperheat}`
      )
    })

    const blob = new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `特变电工_集团多工厂能源费价总览表_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('全集团直属工厂费价报表导出成功！')
  }

  // 过滤后的工厂列表
  const filteredFactories = useMemo(() => {
    if (!factorySearchTerm.trim()) return factories
    const q = factorySearchTerm.toLowerCase()
    return factories.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.shortName.toLowerCase().includes(q) ||
        f.province.toLowerCase().includes(q) ||
        f.city.toLowerCase().includes(q) ||
        f.industry.toLowerCase().includes(q)
    )
  }, [factories, factorySearchTerm])

  // 时段色块属性工具函数
  const getSlotMeta = (type: 'deep' | 'valley' | 'flat' | 'peak' | 'sharp') => {
    switch (type) {
      case 'deep':
        return { label: '深谷', color: 'bg-[#00D492]', textColor: 'text-[#00D492]', border: 'border-[#00D492]' }
      case 'valley':
        return { label: '低谷', color: 'bg-[#10C4CE]', textColor: 'text-[#10C4CE]', border: 'border-[#10C4CE]' }
      case 'flat':
        return { label: '平段', color: 'bg-[#2C7CFF]', textColor: 'text-[#2C7CFF]', border: 'border-[#2C7CFF]' }
      case 'peak':
        return { label: '高峰', color: 'bg-[#FFBA00]', textColor: 'text-[#FFBA00]', border: 'border-[#FFBA00]' }
      case 'sharp':
        return { label: '尖峰', color: 'bg-[#FF6536]', textColor: 'text-[#FF6536]', border: 'border-[#FF6536]' }
    }
  }

  return (
    <div className="space-y-5 font-sans text-foreground">
      {/* Toast 交互提示 */}
      {toastMsg && (
        <div className="fixed top-6 right-8 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={cn(
              'px-4 py-3 rounded-lg shadow-lg border text-sm font-medium flex items-center gap-2 max-w-md',
              toastMsg.type === 'success' && 'bg-emerald-50 text-emerald-800 border-emerald-200',
              toastMsg.type === 'warning' && 'bg-amber-50 text-amber-800 border-amber-300',
              toastMsg.type === 'info' && 'bg-blue-50 text-blue-800 border-blue-200'
            )}
          >
            {toastMsg.type === 'success' && <Check className="size-4 text-emerald-600 shrink-0" />}
            {toastMsg.type === 'warning' && <AlertTriangle className="size-4 text-amber-600 shrink-0" />}
            {toastMsg.type === 'info' && <Info className="size-4 text-blue-600 shrink-0" />}
            <span>{toastMsg.text}</span>
          </div>
        </div>
      )}

      {/* 顶部 Header 面板：全景标题 */}
      <div className="bg-white p-4.5 rounded-lg border border-[#DBE6EE] shadow-xs flex items-center gap-3">
        <div className="size-10 rounded-lg bg-[#2C7CFF]/10 border border-[#2C7CFF]/20 flex items-center justify-center text-[#2C7CFF] shrink-0">
          <DollarSign className="size-5" />
        </div>
        <div>
          <h1 className="text-base font-bold text-foreground">直属工厂能源费价模型管理</h1>
        </div>
      </div>

      {/* 主工作区：左侧企业结构树 (固定 260px 规范宽度) + 右侧企业费价方案工作台 (自适应 flex-1) */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* 左侧：企业结构树 (完整涵盖 2 级经营单位与 3、4 级工厂，单行 30px 高密纯净展示) */}
        <div className="w-full lg:w-[260px] lg:shrink-0 bg-white rounded-lg border border-[#DBE6EE] shadow-xs overflow-hidden">
          <div className="p-3 border-b border-[#DBE6EE] bg-[#F3F7FB] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Building2 className="size-3.5 text-[#2C7CFF]" />
                企业结构树
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">6 经营单位 · 26+ 工厂</span>
            </div>

            {/* 搜索框 */}
            <div className="relative">
              <Search className="size-3 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索单位/工厂/城市..."
                value={factorySearchTerm}
                onChange={(e) => setFactorySearchTerm(e.target.value)}
                className="w-full h-7 pl-7 pr-2 text-xs bg-white border border-[#E2E8F0] rounded-[6px] focus:outline-none focus:ring-1 focus:ring-[#2C7CFF]"
              />
            </div>
          </div>

          {/* 结构树节点渲染 (简洁单行 30px 高度，分层完整展开) */}
          <div className="p-1.5 space-y-0.5 max-h-[720px] overflow-y-auto text-xs">
            {/* 顶层：特变电工股份有限公司 */}
            <div className="flex items-center gap-1.5 px-2 h-[30px] text-slate-700 font-bold text-xs">
              <Layers className="size-3.5 text-[#2C7CFF] shrink-0" />
              <span className="truncate">特变电工股份有限公司</span>
            </div>

            {/* 渲染 2 级经营单位及其 3、4 级工厂 */}
            {filteredTree.map((comp) => {
              const isCompExpanded = factorySearchTerm.trim() ? true : !collapsedKeys[comp.id]
              const isCompSelected = comp.id === selectedFactoryId

              return (
                <div key={comp.id} className="space-y-0.5">
                  {/* 2 级经营单位行 (30px 高度) */}
                  <div
                    onClick={() => {
                      toggleCollapse(comp.id)
                      handleSelectFactory(comp.id)
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-2 h-[30px] rounded-md text-xs font-semibold transition-colors cursor-pointer select-none group',
                      isCompSelected
                        ? 'bg-[#EBF3FF] text-[#2C7CFF]'
                        : 'text-slate-800 hover:bg-slate-100/80'
                    )}
                    title={`${comp.fullName} · 2级经营单位 (${comp.province} · ${comp.city})`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <button
                        type="button"
                        onClick={(e) => toggleCollapse(comp.id, e)}
                        className="size-3.5 flex items-center justify-center text-slate-400 hover:text-slate-700 shrink-0 cursor-pointer"
                      >
                        {isCompExpanded ? (
                          <ChevronDown className="size-3" />
                        ) : (
                          <ChevronRight className="size-3" />
                        )}
                      </button>
                      <Building2 className={cn('size-3.5 shrink-0', isCompSelected ? 'text-[#2C7CFF]' : 'text-slate-500')} />
                      <span className="truncate">{comp.name}</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200/80 text-slate-600 font-mono shrink-0">
                      {comp.children?.length || 0}
                    </span>
                  </div>

                  {/* 3 级单位/工厂展开列表 */}
                  {isCompExpanded && comp.children && (
                    <div className="pl-3.5 space-y-0.5 border-l border-slate-200 ml-3">
                      {comp.children.map((child) => {
                        const hasSubChildren = child.children && child.children.length > 0
                        const isChildExpanded = factorySearchTerm.trim() ? true : !collapsedKeys[child.id]
                        const isChildSelected = child.id === selectedFactoryId

                        return (
                          <div key={child.id} className="space-y-0.5">
                            {/* 3 级行 (30px 高度) */}
                            <div
                              onClick={() => {
                                if (hasSubChildren) toggleCollapse(child.id)
                                handleSelectFactory(child.id)
                              }}
                              className={cn(
                                'h-[30px] px-2 rounded-md transition-colors cursor-pointer flex items-center justify-between gap-1.5 text-xs select-none',
                                isChildSelected
                                  ? 'bg-[#EBF3FF] text-[#2C7CFF] font-semibold'
                                  : 'hover:bg-slate-100 text-slate-700'
                              )}
                              title={`${child.fullName} · 3级单位/工厂 (${child.province} · ${child.city})`}
                            >
                              <div className="flex items-center gap-1.5 truncate min-w-0">
                                {hasSubChildren ? (
                                  <button
                                    type="button"
                                    onClick={(e) => toggleCollapse(child.id, e)}
                                    className="size-3.5 flex items-center justify-center text-slate-400 hover:text-slate-700 shrink-0 cursor-pointer"
                                  >
                                    {isChildExpanded ? (
                                      <ChevronDown className="size-3" />
                                    ) : (
                                      <ChevronRight className="size-3" />
                                    )}
                                  </button>
                                ) : (
                                  <Factory className={cn('size-3 shrink-0', isChildSelected ? 'text-[#2C7CFF]' : 'text-slate-400')} />
                                )}
                                <span className="truncate">{child.name}</span>
                              </div>
                              <span
                                className={cn(
                                  'text-[10px] shrink-0 font-normal',
                                  isChildSelected ? 'text-[#2C7CFF]/70' : 'text-slate-400'
                                )}
                              >
                                {child.city}
                              </span>
                            </div>

                            {/* 4 级工厂展开列表 */}
                            {hasSubChildren && isChildExpanded && child.children && (
                              <div className="pl-3.5 space-y-0.5 border-l border-slate-200 ml-3">
                                {child.children.map((subChild) => {
                                  const isSubSelected = subChild.id === selectedFactoryId

                                  return (
                                    <div
                                      key={subChild.id}
                                      onClick={() => handleSelectFactory(subChild.id)}
                                      className={cn(
                                        'h-[30px] px-2 rounded-md transition-colors cursor-pointer flex items-center justify-between gap-1.5 text-xs select-none',
                                        isSubSelected
                                          ? 'bg-[#EBF3FF] text-[#2C7CFF] font-semibold'
                                          : 'hover:bg-slate-100 text-slate-700'
                                      )}
                                      title={`${subChild.fullName} · 4级制造工厂 (${subChild.province} · ${subChild.city})`}
                                    >
                                      <div className="flex items-center gap-1.5 truncate min-w-0">
                                        <Factory
                                          className={cn(
                                            'size-3 shrink-0',
                                            isSubSelected ? 'text-[#2C7CFF]' : 'text-slate-400'
                                          )}
                                        />
                                        <span className="truncate">{subChild.name}</span>
                                      </div>
                                      <span
                                        className={cn(
                                          'text-[10px] shrink-0 font-normal',
                                          isSubSelected ? 'text-[#2C7CFF]/70' : 'text-slate-400'
                                        )}
                                      >
                                        {subChild.city}
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
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* 右侧：企业专属费价模型工作台 (自适应宽屏 flex-1 min-w-0) */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* 企业当前方案版本卡片 */}
          <div className="bg-white p-4.5 rounded-lg border border-[#DBE6EE] shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-foreground">
                  {currentFactory.shortName || currentFactory.name.replace(/\s*\(.*?\)\s*/g, '')}
                </h2>
              </div>

              {/* 操作按钮组：同步到其他企业、复制调价、新建草稿 */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* 核心新增动作：同步到其他企业 (可复选目标企业) */}
                <button
                  type="button"
                  onClick={() => {
                    setSyncTargetFactoryIds([])
                    setIsSyncModalOpen(true)
                  }}
                  className="h-8 px-3 rounded-[6px] bg-[#2C7CFF] hover:bg-[#2568d8] text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  title="将当前选中的费价方案同步配置到其他企业（支持复选多企业）"
                >
                  <Share2 className="size-3.5" />
                  同步到其他企业
                </button>

                {/* 核心动作：复制调价 (生成新版本) */}
                <button
                  type="button"
                  onClick={handleCopySchemeForAdjustment}
                  className="h-8 px-3 rounded-[6px] bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                  title="调价最佳实践：克隆当前生效方案生成新草稿并解锁编辑"
                >
                  <Copy className="size-3" />
                  复制调价 (生成新版本)
                </button>

                {/* 新建草稿 */}
                <button
                  type="button"
                  onClick={() => setIsNewSchemeModalOpen(true)}
                  className="h-8 px-2.5 rounded-[6px] border border-[#DBE6EE] bg-white hover:bg-slate-50 text-foreground font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="size-3 text-[#2C7CFF]" />
                  新建草稿
                </button>
              </div>
            </div>

            {/* 方案版本选择器与状态条 */}
            <div className="p-3 rounded-lg bg-[#F3F7FB] border border-[#DBE6EE] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-semibold text-foreground">切换查看方案：</span>
                <select
                  value={selectedSchemeId}
                  onChange={(e) => setSelectedSchemeId(e.target.value)}
                  className="h-8 w-64 px-2.5 rounded border border-[#E2E8F0] bg-white font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-[#2C7CFF]"
                >
                  {currentFactory.schemes.map((s) => (
                    <option key={s.id} value={s.id}>
                      [{s.status}] {s.versionCode} - {s.name}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-3 text-muted-foreground font-mono">
                  <span>
                    执行周期：<strong>{currentScheme.effectiveDate} ~ {currentScheme.expiryDate}</strong>
                  </span>
                  <span>依据：{currentScheme.policyDoc || '发改委电价通知'}</span>
                </div>
              </div>

              {/* 若当前方案是“草稿”或“待生效”，提供【正式启用此方案】按钮 */}
              {(currentScheme.status === '草稿' || currentScheme.status === '待生效') && (
                <button
                  type="button"
                  onClick={() => handleActivateScheme(currentScheme.id)}
                  className="h-7 px-3 rounded bg-[#2C7CFF] hover:bg-[#2568d8] text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                >
                  <CheckCircle2 className="size-3.5" />
                  正式启用此方案 (防重叠生效)
                </button>
              )}
            </div>
          </div>

          {/* 核心能源配置面板：3 大 Tab 切换 */}
          <div className="bg-white rounded-lg border border-[#DBE6EE] shadow-xs">
            {/* Tab 导航头 */}
            <div className="p-3.5 border-b border-[#DBE6EE] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveEnergyTab('power')}
                  className={cn(
                    'px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5',
                    activeEnergyTab === 'power'
                      ? 'bg-[#2C7CFF] text-white font-bold rounded-[8px]'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Zap className="size-3.5" />
                  电费费价
                </button>

                <button
                  type="button"
                  onClick={() => setActiveEnergyTab('gas')}
                  className={cn(
                    'px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5',
                    activeEnergyTab === 'gas'
                      ? 'bg-[#2C7CFF] text-white font-bold rounded-[8px]'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Flame className="size-3.5" />
                  天然气费价
                </button>

                <button
                  type="button"
                  onClick={() => setActiveEnergyTab('steam_water')}
                  className={cn(
                    'px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5',
                    activeEnergyTab === 'steam_water'
                      ? 'bg-[#2C7CFF] text-white font-bold rounded-[8px]'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Droplets className="size-3.5" />
                  蒸汽与水费价
                </button>
              </div>

              {/* 电力分时下的夏季/冬季切换 */}
              {activeEnergyTab === 'power' && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground font-medium">执行季节时段：</span>
                  <div className="flex items-center bg-[#F3F7FB] p-0.5 rounded-lg border border-[#DBE6EE]">
                    <button
                      type="button"
                      onClick={() => setSeasonMode('summer')}
                      className={cn(
                        'px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer',
                        seasonMode === 'summer' ? 'bg-[#2C7CFF] text-white' : 'text-muted-foreground'
                      )}
                    >
                      夏季时段
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeasonMode('winter')}
                      className={cn(
                        'px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer',
                        seasonMode === 'winter' ? 'bg-[#2C7CFF] text-white' : 'text-muted-foreground'
                      )}
                    >
                      秋冬季时段
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* TAB 1: 大工业电力费价 */}
            {activeEnergyTab === 'power' && (
              <div className="p-5 space-y-5">
                {/* 1. 五时段单价卡片组 (深谷、低谷、平时、高峰、尖峰) */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h3 className="text-xs font-bold text-foreground">
                      属地五时段结算单价 (元/kWh)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {/* 深谷 */}
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 space-y-1.5">
                      <div className="flex items-center justify-between text-[#00D492] font-bold text-xs">
                        <span>深谷 (Deep Valley)</span>
                        <span className="text-[10px] px-1 py-0.2 bg-emerald-500/20 rounded">优惠消纳</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <input
                          type="number"
                          step="0.0001"
                          disabled={isReadOnly}
                          value={currentScheme.touRates.deep}
                          onChange={(e) => handleTouRateChange('deep', e.target.value)}
                          className={cn(
                            'w-full h-8 px-2 font-mono font-bold text-lg text-[#00D492] rounded focus:outline-none',
                            isReadOnly ? 'bg-transparent border-none' : 'bg-white border border-[#E2E8F0]'
                          )}
                        />
                        <span className="text-xs text-muted-foreground">元</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground">新能源及午夜消纳电价</div>
                    </div>

                    {/* 低谷 */}
                    <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 space-y-1.5">
                      <div className="flex items-center justify-between text-[#10C4CE] font-bold text-xs">
                        <span>低谷 (Valley)</span>
                        <span className="text-[10px] px-1 py-0.2 bg-cyan-500/20 rounded">低负荷</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <input
                          type="number"
                          step="0.0001"
                          disabled={isReadOnly}
                          value={currentScheme.touRates.valley}
                          onChange={(e) => handleTouRateChange('valley', e.target.value)}
                          className={cn(
                            'w-full h-8 px-2 font-mono font-bold text-lg text-[#10C4CE] rounded focus:outline-none',
                            isReadOnly ? 'bg-transparent border-none' : 'bg-white border border-[#E2E8F0]'
                          )}
                        />
                        <span className="text-xs text-muted-foreground">元</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground">夜间电网平稳运行电价</div>
                    </div>

                    {/* 平时 */}
                    <div className="p-3 rounded-lg bg-[#2C7CFF]/10 border border-[#2C7CFF]/30 space-y-1.5">
                      <div className="flex items-center justify-between text-[#2C7CFF] font-bold text-xs">
                        <span>平时 (Flat)</span>
                        <span className="text-[10px] px-1 py-0.2 bg-[#2C7CFF]/20 rounded">基准</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <input
                          type="number"
                          step="0.0001"
                          disabled={isReadOnly}
                          value={currentScheme.touRates.flat}
                          onChange={(e) => handleTouRateChange('flat', e.target.value)}
                          className={cn(
                            'w-full h-8 px-2 font-mono font-bold text-lg text-[#2C7CFF] rounded focus:outline-none',
                            isReadOnly ? 'bg-transparent border-none' : 'bg-white border border-[#E2E8F0]'
                          )}
                        />
                        <span className="text-xs text-muted-foreground">元</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground">购电基准核定电价</div>
                    </div>

                    {/* 高峰 */}
                    <div className="p-3 rounded-lg bg-[#FFBA00]/10 border border-[#FFBA00]/30 space-y-1.5">
                      <div className="flex items-center justify-between text-[#FFBA00] font-bold text-xs">
                        <span>高峰 (Peak)</span>
                        <span className="text-[10px] px-1 py-0.2 bg-[#FFBA00]/20 rounded">上浮</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <input
                          type="number"
                          step="0.0001"
                          disabled={isReadOnly}
                          value={currentScheme.touRates.peak}
                          onChange={(e) => handleTouRateChange('peak', e.target.value)}
                          className={cn(
                            'w-full h-8 px-2 font-mono font-bold text-lg text-[#FFBA00] rounded focus:outline-none',
                            isReadOnly ? 'bg-transparent border-none' : 'bg-white border border-[#E2E8F0]'
                          )}
                        />
                        <span className="text-xs text-muted-foreground">元</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground">日间高负荷生产浮动电价</div>
                    </div>

                    {/* 尖峰 */}
                    <div className="p-3 rounded-lg bg-[#FF6536]/10 border border-[#FF6536]/30 space-y-1.5">
                      <div className="flex items-center justify-between text-[#FF6536] font-bold text-xs">
                        <span>尖峰 (Sharp)</span>
                        <span className="text-[10px] px-1 py-0.2 bg-[#FF6536]/20 rounded">严控</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <input
                          type="number"
                          step="0.0001"
                          disabled={isReadOnly}
                          value={currentScheme.touRates.sharp}
                          onChange={(e) => handleTouRateChange('sharp', e.target.value)}
                          className={cn(
                            'w-full h-8 px-2 font-mono font-bold text-lg text-[#FF6536] rounded focus:outline-none',
                            isReadOnly ? 'bg-transparent border-none' : 'bg-white border border-[#E2E8F0]'
                          )}
                        />
                        <span className="text-xs text-muted-foreground">元</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground">极热/极寒顶峰严控电价</div>
                    </div>
                  </div>
                </div>

                {/* 2. 属地化 24 小时分时色谱甘特映射条 (支持点击微调时段) */}
                <div className="p-3.5 rounded-lg bg-[#F3F7FB] border border-[#DBE6EE] space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between text-xs">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <span>属地 24 小时分时甘特时段划分 ({seasonMode === 'summer' ? '夏季' : '秋冬季'})</span>
                      {!isReadOnly && <span className="text-[11px] text-[#2C7CFF] font-normal">(点击时段色块可循环切换时段属性)</span>}
                    </span>

                    {/* 图例 */}
                    <div className="flex items-center gap-2.5 text-[11px]">
                      <span className="flex items-center gap-1">
                        <span className="size-2 rounded-full bg-[#00D492]" /> 深谷
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="size-2 rounded-full bg-[#10C4CE]" /> 低谷
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="size-2 rounded-full bg-[#2C7CFF]" /> 平段
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="size-2 rounded-full bg-[#FFBA00]" /> 高峰
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="size-2 rounded-full bg-[#FF6536]" /> 尖峰
                      </span>
                    </div>
                  </div>

                  {/* 24 小时色带 */}
                  <div className="grid grid-cols-24 gap-0.5 h-8 rounded bg-slate-200 p-0.5">
                    {currentScheme.hourlySlots[seasonMode].map((type, h) => {
                      const meta = getSlotMeta(type)
                      return (
                        <div
                          key={h}
                          onClick={() => cycleHourSlot(h)}
                          title={`${String(h).padStart(2, '0')}:00 - ${String(h + 1).padStart(2, '0')}:00【${meta.label}】`}
                          className={cn(
                            'h-full flex items-center justify-center text-[10px] font-bold text-white transition-opacity select-none',
                            meta.color,
                            isReadOnly ? 'cursor-default' : 'cursor-pointer hover:opacity-80'
                          )}
                        >
                          {meta.label}
                        </div>
                      )
                    })}
                  </div>

                  {/* 小时刻度 */}
                  <div className="grid grid-cols-24 text-[10px] text-muted-foreground font-mono text-center">
                    {Array.from({ length: 24 }, (_, h) => (
                      <span key={h}>{h % 2 === 0 ? `${h}h` : ''}</span>
                    ))}
                  </div>
                </div>

                {/* 3. 两部制基本电费与力调考核参数 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2 border-t border-[#DBE6EE]">
                  {/* 两部制 */}
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-[#DBE6EE] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">两部制基本电费</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-[#2C7CFF] font-medium">
                        当前执行: {currentScheme.touRates.billingMethod === 'demand' ? '按最大需量' : '按变压器容量'}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">变压器容量单价:</span>
                        <div className="flex items-center gap-1 font-mono font-bold">
                          <input
                            type="number"
                            step="0.01"
                            disabled={isReadOnly}
                            value={currentScheme.touRates.capacityRate}
                            onChange={(e) => handleTouRateChange('capacityRate', e.target.value)}
                            className={cn('w-20 h-7 px-1.5 rounded text-right', isReadOnly ? 'bg-transparent' : 'bg-white border border-[#E2E8F0]')}
                          />
                          <span className="text-[11px] text-muted-foreground">元/kVA·月</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">最大需量单价:</span>
                        <div className="flex items-center gap-1 font-mono font-bold">
                          <input
                            type="number"
                            step="0.01"
                            disabled={isReadOnly}
                            value={currentScheme.touRates.demandRate}
                            onChange={(e) => handleTouRateChange('demandRate', e.target.value)}
                            className={cn('w-20 h-7 px-1.5 rounded text-right', isReadOnly ? 'bg-transparent' : 'bg-white border border-[#E2E8F0]')}
                          />
                          <span className="text-[11px] text-muted-foreground">元/kW·月</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 功率因数考核 */}
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-[#DBE6EE] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">力调电费考核基准</span>
                      <span className="text-[10px] text-muted-foreground">无功补偿调节</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-muted-foreground">基准功率因数:</span>
                      <div className="flex items-center gap-1 font-mono font-bold">
                        <input
                          type="number"
                          step="0.01"
                          disabled={isReadOnly}
                          value={currentScheme.touRates.powerFactorBase}
                          onChange={(e) => handleTouRateChange('powerFactorBase', e.target.value)}
                          className={cn('w-20 h-7 px-1.5 rounded text-right', isReadOnly ? 'bg-transparent' : 'bg-white border border-[#E2E8F0]')}
                        />
                        <span className="text-[11px] text-muted-foreground">COS φ</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-tight">
                      高于该值享受电费奖励减免，低于该值按阶梯加收惩罚力调电费。
                    </p>
                  </div>

                  {/* 绿电交易溢价 */}
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-[#DBE6EE] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">直供绿电交易溢价</span>
                      <span className="text-[10px] text-emerald-600 font-medium">绿色能源折算</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-muted-foreground">基准溢价系数:</span>
                      <div className="flex items-center gap-1 font-mono font-bold text-emerald-700">
                        <input
                          type="number"
                          step="0.0001"
                          disabled={isReadOnly}
                          value={currentScheme.touRates.greenPremium}
                          onChange={(e) => handleTouRateChange('greenPremium', e.target.value)}
                          className={cn('w-20 h-7 px-1.5 rounded text-right', isReadOnly ? 'bg-transparent' : 'bg-white border border-[#E2E8F0]')}
                        />
                        <span className="text-[11px] text-muted-foreground">元/kWh</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-tight">
                      工厂外购绿电及绿证交易环境权益溢价，计入产品碳足迹绿电抵扣。
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: 工商业天然气费价 */}
            {activeEnergyTab === 'gas' && (
              <div className="p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-bold text-foreground">
                      天然气计价模型
                    </h3>
                  </div>

                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={handleAddGasTier}
                      className="h-8 px-3 rounded-[6px] bg-[#2C7CFF] hover:bg-[#2568d8] text-white text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                    >
                      <Plus className="size-3" />
                      新增阶梯档位
                    </button>
                  )}
                </div>

                {/* 阶梯表格 (强制 44px 行高) */}
                <div className="border border-[#DBE6EE] rounded-lg overflow-hidden bg-white shadow-xs">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#F3F7FB] text-muted-foreground font-semibold border-b border-[#DBE6EE]">
                      <tr className="h-[44px]">
                        <th className="px-4 py-0">阶梯档位名称</th>
                        <th className="px-4 py-0">月度用气量区间</th>
                        <th className="px-4 py-0">对应结算单价 (元/m³)</th>
                        <th className="px-4 py-0">计费说明与适用工序</th>
                        {!isReadOnly && <th className="px-4 py-0 text-center w-20">操作</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DBE6EE]">
                      {currentScheme.gasTiers.map((tier) => (
                        <tr key={tier.id} className="h-[44px] hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-0 font-medium text-foreground">
                            {isReadOnly ? (
                              tier.tier
                            ) : (
                              <input
                                type="text"
                                value={tier.tier}
                                onChange={(e) => handleUpdateGasTier(tier.id, 'tier', e.target.value)}
                                className="h-7 w-full bg-white border border-[#E2E8F0] rounded px-2 text-xs"
                              />
                            )}
                          </td>
                          <td className="px-4 py-0 font-mono text-muted-foreground">
                            {isReadOnly ? (
                              tier.range
                            ) : (
                              <input
                                type="text"
                                value={tier.range}
                                onChange={(e) => handleUpdateGasTier(tier.id, 'range', e.target.value)}
                                className="h-7 w-full bg-white border border-[#E2E8F0] rounded px-2 text-xs"
                              />
                            )}
                          </td>
                          <td className="px-4 py-0">
                            {isReadOnly ? (
                              <span className="font-mono font-bold text-[#FF6536] text-sm">{tier.price}</span>
                            ) : (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  step="0.0001"
                                  value={tier.price}
                                  onChange={(e) => handleUpdateGasTier(tier.id, 'price', e.target.value)}
                                  className="h-7 w-24 bg-white border border-[#E2E8F0] rounded px-2 font-mono font-bold text-[#FF6536] text-xs"
                                />
                                <span className="text-muted-foreground">元</span>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-0 text-muted-foreground">
                            {isReadOnly ? (
                              tier.note
                            ) : (
                              <input
                                type="text"
                                value={tier.note}
                                onChange={(e) => handleUpdateGasTier(tier.id, 'note', e.target.value)}
                                className="h-7 w-full bg-white border border-[#E2E8F0] rounded px-2 text-xs"
                              />
                            )}
                          </td>
                          {!isReadOnly && (
                            <td className="px-4 py-0 text-center">
                              <button
                                type="button"
                                onClick={() => handleDeleteGasTier(tier.id)}
                                className="text-rose-600 hover:text-rose-700 p-1 rounded hover:bg-rose-50 cursor-pointer"
                                title="删除该档位"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: 蒸汽与水费价 (属地介质) */}
            {activeEnergyTab === 'steam_water' && (
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-foreground">
                    蒸汽与水费价
                  </h3>
                </div>

                {/* 介质列表表格 (强制 44px 行高) */}
                <div className="border border-[#DBE6EE] rounded-lg overflow-hidden bg-white shadow-xs">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#F3F7FB] text-muted-foreground font-semibold border-b border-[#DBE6EE]">
                      <tr className="h-[44px]">
                        <th className="px-4 py-0">介质名称</th>
                        <th className="px-4 py-0">供能来源与参数标准</th>
                        <th className="px-4 py-0">属地结算单价 (元)</th>
                        <th className="px-4 py-0">计量单位</th>
                        <th className="px-4 py-0">结算口径说明</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DBE6EE]">
                      {/* 过热蒸汽 */}
                      <tr className="h-[44px] hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-0 align-middle font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-[#FFBA00] shrink-0" />
                            <span>过热蒸汽 (Steam Superheat)</span>
                          </div>
                        </td>
                        <td className="px-4 py-0 text-muted-foreground">园区热力管网 1.6MPa, 350℃</td>
                        <td className="px-4 py-0">
                          {isReadOnly ? (
                            <span className="font-mono font-bold text-[#FFBA00] text-sm">
                              {currentScheme.heatWaterPrices.steamSuperheat}
                            </span>
                          ) : (
                            <input
                              type="number"
                              step="0.01"
                              value={currentScheme.heatWaterPrices.steamSuperheat}
                              onChange={(e) => handleHeatWaterChange('steamSuperheat', e.target.value)}
                              className="h-7 w-24 bg-white border border-[#E2E8F0] rounded px-2 font-mono font-bold text-[#FFBA00] text-xs"
                            />
                          )}
                        </td>
                        <td className="px-4 py-0 font-mono text-muted-foreground">元/吨 (t)</td>
                        <td className="px-4 py-0 text-muted-foreground">进厂涡街流量计累计抄表按月结算</td>
                      </tr>

                      {/* 饱和蒸汽 */}
                      <tr className="h-[44px] hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-0 align-middle font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-[#FFBA00] shrink-0" />
                            <span>饱和蒸汽 (Steam Saturated)</span>
                          </div>
                        </td>
                        <td className="px-4 py-0 text-muted-foreground">车间采暖与预热 0.8MPa</td>
                        <td className="px-4 py-0">
                          {isReadOnly ? (
                            <span className="font-mono font-bold text-[#FFBA00] text-sm">
                              {currentScheme.heatWaterPrices.steamSaturated}
                            </span>
                          ) : (
                            <input
                              type="number"
                              step="0.01"
                              value={currentScheme.heatWaterPrices.steamSaturated}
                              onChange={(e) => handleHeatWaterChange('steamSaturated', e.target.value)}
                              className="h-7 w-24 bg-white border border-[#E2E8F0] rounded px-2 font-mono font-bold text-[#FFBA00] text-xs"
                            />
                          )}
                        </td>
                        <td className="px-4 py-0 font-mono text-muted-foreground">元/吨 (t)</td>
                        <td className="px-4 py-0 text-muted-foreground">蒸汽管网折标煤折算基准参数</td>
                      </tr>

                      {/* 脱盐软化水 */}
                      <tr className="h-[44px] hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-0 align-middle font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-[#10C4CE] shrink-0" />
                            <span>脱盐软化水 (Softened Water)</span>
                          </div>
                        </td>
                        <td className="px-4 py-0 text-muted-foreground">自备/园区纯水站电导率≤0.2μS/cm</td>
                        <td className="px-4 py-0">
                          {isReadOnly ? (
                            <span className="font-mono font-bold text-[#10C4CE] text-sm">
                              {currentScheme.heatWaterPrices.waterSoftened}
                            </span>
                          ) : (
                            <input
                              type="number"
                              step="0.01"
                              value={currentScheme.heatWaterPrices.waterSoftened}
                              onChange={(e) => handleHeatWaterChange('waterSoftened', e.target.value)}
                              className="h-7 w-24 bg-white border border-[#E2E8F0] rounded px-2 font-mono font-bold text-[#10C4CE] text-xs"
                            />
                          )}
                        </td>
                        <td className="px-4 py-0 font-mono text-muted-foreground">元/吨 (t)</td>
                        <td className="px-4 py-0 text-muted-foreground">按锅炉给水表按月分摊</td>
                      </tr>

                      {/* 工业自来水 */}
                      <tr className="h-[44px] hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-0 align-middle font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-[#10C4CE] shrink-0" />
                            <span>工业自来水 (Fresh Water)</span>
                          </div>
                        </td>
                        <td className="px-4 py-0 text-muted-foreground">{currentFactory.city}市政自来水集团</td>
                        <td className="px-4 py-0">
                          {isReadOnly ? (
                            <span className="font-mono font-bold text-[#10C4CE] text-sm">
                              {currentScheme.heatWaterPrices.waterFresh}
                            </span>
                          ) : (
                            <input
                              type="number"
                              step="0.01"
                              value={currentScheme.heatWaterPrices.waterFresh}
                              onChange={(e) => handleHeatWaterChange('waterFresh', e.target.value)}
                              className="h-7 w-24 bg-white border border-[#E2E8F0] rounded px-2 font-mono font-bold text-[#10C4CE] text-xs"
                            />
                          )}
                        </td>
                        <td className="px-4 py-0 font-mono text-muted-foreground">元/吨 (t)</td>
                        <td className="px-4 py-0 text-muted-foreground">包含水资源费与排污处理费</td>
                      </tr>

                      {/* 轻柴油 */}
                      <tr className="h-[44px] hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-0 align-middle font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-[#8E73ED] shrink-0" />
                            <span>轻柴油 0# (Diesel Oil)</span>
                          </div>
                        </td>
                        <td className="px-4 py-0 text-muted-foreground">中石化月度大宗集中采购</td>
                        <td className="px-4 py-0">
                          {isReadOnly ? (
                            <span className="font-mono font-bold text-[#8E73ED] text-sm">
                              {currentScheme.heatWaterPrices.diesel}
                            </span>
                          ) : (
                            <input
                              type="number"
                              step="0.01"
                              value={currentScheme.heatWaterPrices.diesel}
                              onChange={(e) => handleHeatWaterChange('diesel', e.target.value)}
                              className="h-7 w-24 bg-white border border-[#E2E8F0] rounded px-2 font-mono font-bold text-[#8E73ED] text-xs"
                            />
                          )}
                        </td>
                        <td className="px-4 py-0 font-mono text-muted-foreground">元/公斤 (kg)</td>
                        <td className="px-4 py-0 text-muted-foreground">应急备用发电机与厂内特种搬运叉车</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* 下方：当前工厂历史方案版本链条与归档记录 */}
          <div className="bg-white p-4.5 rounded-lg border border-[#DBE6EE] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-foreground flex items-center gap-2">
                <History className="size-4 text-primary" />
                <span>费价方案版本历史</span>
              </h3>
              <span className="text-[11px] text-muted-foreground font-mono">
                共维护 {currentFactory.schemes.length} 个历史版本
              </span>
            </div>

            <div className="border border-[#DBE6EE] rounded-lg overflow-hidden bg-white shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F3F7FB] text-muted-foreground font-semibold border-b border-[#DBE6EE]">
                  <tr className="h-[44px]">
                    <th className="px-4 py-0">版本号</th>
                    <th className="px-4 py-0">方案名称</th>
                    <th className="px-4 py-0">生效周期</th>
                    <th className="px-4 py-0">状态</th>
                    <th className="px-4 py-0">维护责任人</th>
                    <th className="px-4 py-0">更新时间</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DBE6EE]">
                  {currentFactory.schemes.map((s) => {
                    const isSelected = s.id === currentScheme.id
                    return (
                      <tr
                        key={s.id}
                        onClick={() => setSelectedSchemeId(s.id)}
                        className={cn(
                          'h-[44px] transition-colors cursor-pointer',
                          isSelected ? 'bg-blue-50/50 font-medium' : 'hover:bg-slate-50/80'
                        )}
                        title="点击切换查看此方案详情"
                      >
                        <td className="px-4 py-0 font-mono font-bold text-foreground">
                          {s.versionCode}
                          {s.status === '生效中' && <span className="ml-1 text-[10px] text-emerald-600">(执行中)</span>}
                        </td>
                        <td className="px-4 py-0 font-medium text-foreground">{s.name}</td>
                        <td className="px-4 py-0 font-mono text-muted-foreground text-[11px]">
                          {s.effectiveDate} ~ {s.expiryDate}
                        </td>
                        <td className="px-4 py-0">
                          {s.status === '生效中' && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              ● 生效中
                            </span>
                          )}
                          {s.status === '草稿' && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-300">
                              草稿 (可编辑)
                            </span>
                          )}
                          {s.status === '已归档' && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] text-zinc-500 border border-zinc-200">
                              已归档
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-0 text-muted-foreground">{s.operator}</td>
                        <td className="px-4 py-0 font-mono text-muted-foreground">{s.updatedAt}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>



      {/* MODAL 2: 跨工厂克隆借用方案模板 */}
      {isCloneModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#DBE6EE] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-[#DBE6EE] flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <ArrowRightLeft className="size-4 text-[#2C7CFF]" />
                跨厂借用成熟费价方案模板
              </h3>
              <button
                type="button"
                onClick={() => setIsCloneModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-blue-50 text-blue-800 rounded-lg text-xs leading-relaxed">
                当前目标工厂：<strong className="text-foreground">{currentFactory.name}</strong>。<br />
                跨厂克隆将复制源工厂的时段划分结构、阶梯气价档位与介质清单，并自动在本厂生成可编辑的【草稿】版本，方便您根据本厂实际电价进行微调。
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">选择参考借用的源工厂：</label>
                <select
                  value={cloneSourceFactoryId}
                  onChange={(e) => setCloneSourceFactoryId(e.target.value)}
                  className="w-full h-9 px-3 rounded-[6px] border border-[#E2E8F0] bg-white text-xs font-medium"
                >
                  {factories
                    .filter((f) => f.id !== currentFactory.id)
                    .map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.shortName} ({f.province} · {f.gridCompany})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-[#DBE6EE] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsCloneModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleCloneFromOtherFactory}
                className="px-4 py-2 rounded-[6px] bg-[#2C7CFF] hover:bg-[#2568d8] text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors"
              >
                确认克隆为草稿
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: 新建方案草稿弹窗 */}
      {isNewSchemeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#DBE6EE] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-[#DBE6EE] flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Plus className="size-4 text-[#2C7CFF]" />
                为【{currentFactory.shortName}】新建费价方案草稿
              </h3>
              <button
                type="button"
                onClick={() => setIsNewSchemeModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  方案名称 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder={`例如：${currentFactory.city}大工业五时段电价及秋冬供暖调价预案`}
                  value={newSchemeForm.name}
                  onChange={(e) => setNewSchemeForm({ ...newSchemeForm, name: e.target.value })}
                  className="w-full h-9 px-3 rounded-[6px] border border-[#E2E8F0] bg-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">生效起始日期</label>
                  <input
                    type="date"
                    value={newSchemeForm.effectiveDate}
                    onChange={(e) => setNewSchemeForm({ ...newSchemeForm, effectiveDate: e.target.value })}
                    className="w-full h-9 px-3 rounded-[6px] border border-[#E2E8F0] bg-white text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">生效终止日期</label>
                  <input
                    type="date"
                    value={newSchemeForm.expiryDate}
                    onChange={(e) => setNewSchemeForm({ ...newSchemeForm, expiryDate: e.target.value })}
                    className="w-full h-9 px-3 rounded-[6px] border border-[#E2E8F0] bg-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">发改委/供电局依据文件号</label>
                <input
                  type="text"
                  placeholder="例如：发改价格〔2026〕102号"
                  value={newSchemeForm.policyDoc}
                  onChange={(e) => setNewSchemeForm({ ...newSchemeForm, policyDoc: e.target.value })}
                  className="w-full h-9 px-3 rounded-[6px] border border-[#E2E8F0] bg-white text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">方案说明与编制背景</label>
                <textarea
                  rows={2}
                  placeholder="填写编制背景，如峰谷浮动比例调整、尖峰时段变更等..."
                  value={newSchemeForm.description}
                  onChange={(e) => setNewSchemeForm({ ...newSchemeForm, description: e.target.value })}
                  className="w-full p-2 rounded-[6px] border border-[#E2E8F0] bg-white text-xs resize-none"
                />
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-[#DBE6EE] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsNewSchemeModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleCreateNewScheme}
                className="px-4 py-2 rounded-[6px] bg-[#2C7CFF] hover:bg-[#2568d8] text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors"
              >
                确认创建草稿
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: 全局调价审计流水弹窗 */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#DBE6EE] shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-[#DBE6EE] flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <History className="size-4 text-[#2C7CFF]" />
                集团多工厂能源费价调价审计流水
              </h3>
              <button
                type="button"
                onClick={() => setIsAuditModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-6 max-h-[480px] overflow-y-auto">
              <div className="border border-[#DBE6EE] rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F3F7FB] text-muted-foreground font-semibold border-b border-[#DBE6EE]">
                    <tr className="h-[44px]">
                      <th className="px-4 py-0 w-36">操作时间</th>
                      <th className="px-4 py-0 w-36">目标工厂</th>
                      <th className="px-4 py-0 w-28">操作人</th>
                      <th className="px-4 py-0 w-28">操作动作</th>
                      <th className="px-4 py-0">审计流水明细</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DBE6EE]">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="h-[44px] hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-0 font-mono text-muted-foreground">{log.timestamp}</td>
                        <td className="px-4 py-0 font-bold text-foreground">{log.factoryName}</td>
                        <td className="px-4 py-0 text-muted-foreground">{log.operator}</td>
                        <td className="px-4 py-0">
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[11px] border border-blue-200">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-4 py-0 text-muted-foreground text-[11px] truncate max-w-xs" title={log.detail}>
                          {log.detail}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-[#DBE6EE] flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsAuditModalOpen(false)}
                className="px-4 py-2 rounded-[6px] bg-white border border-[#DBE6EE] text-xs font-semibold text-foreground hover:bg-slate-100 cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: 费价同步到其他工厂弹窗 (可复选目标工厂与介质) */}
      {isSyncModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#DBE6EE] shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-[#DBE6EE] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-[#2C7CFF]/10 text-[#2C7CFF] flex items-center justify-center">
                  <Share2 className="size-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    同步费价方案至其他企业
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSyncModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {/* 1. 同步能源介质范围勾选 */}
              <div className="p-3.5 bg-[#F3F7FB] rounded-lg border border-[#DBE6EE] space-y-2">
                <span className="font-bold text-foreground">1. 选择需要同步的能源介质项：</span>
                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={syncScope.power}
                      onChange={(e) => setSyncScope({ ...syncScope, power: e.target.checked })}
                      className="rounded border-[#E2E8F0] text-[#2C7CFF] focus:ring-[#2C7CFF]"
                    />
                    <span className="font-medium text-foreground flex items-center gap-1">
                      <Zap className="size-3.5 text-[#2C7CFF]" /> 电费费价
                    </span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={syncScope.gas}
                      onChange={(e) => setSyncScope({ ...syncScope, gas: e.target.checked })}
                      className="rounded border-[#E2E8F0] text-[#2C7CFF] focus:ring-[#2C7CFF]"
                    />
                    <span className="font-medium text-foreground flex items-center gap-1">
                      <Flame className="size-3.5 text-[#FF6536]" /> 天然气费价
                    </span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={syncScope.steamWater}
                      onChange={(e) => setSyncScope({ ...syncScope, steamWater: e.target.checked })}
                      className="rounded border-[#E2E8F0] text-[#2C7CFF] focus:ring-[#2C7CFF]"
                    />
                    <span className="font-medium text-foreground flex items-center gap-1">
                      <Droplets className="size-3.5 text-[#10C4CE]" /> 蒸汽与水费价
                    </span>
                  </label>
                </div>
              </div>

              {/* 2. 目标工厂多选列表 (按 6 大二级经营单位层级分组) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">
                    2. 选择接收同步的目标企业/工厂 (可多选，已选 {syncTargetFactoryIds.length} / {availableTargetFactories.length} 家)：
                  </span>
                  <button
                    type="button"
                    onClick={toggleSelectAllSync}
                    className="text-xs text-[#2C7CFF] hover:underline font-semibold cursor-pointer"
                  >
                    {syncTargetFactoryIds.length === availableTargetFactories.length ? '清空全选' : '全选所有工厂'}
                  </button>
                </div>

                <div className="border border-[#DBE6EE] rounded-lg p-3 max-h-72 overflow-y-auto space-y-3 bg-slate-50/50">
                  {companyGroups.map(({ company, factories: groupFacs }) => {
                    const groupIds = groupFacs.map((f) => f.id)
                    const isAllGroupSelected =
                      groupIds.length > 0 && groupIds.every((id) => syncTargetFactoryIds.includes(id))
                    const selectedCountInGroup = groupIds.filter((id) =>
                      syncTargetFactoryIds.includes(id)
                    ).length

                    return (
                      <div
                        key={company.id}
                        className="bg-white rounded-lg border border-[#DBE6EE] p-3 space-y-2 shadow-2xs"
                      >
                        {/* 二级经营单位头部 */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-2">
                            <Building2 className="size-4 text-[#2C7CFF]" />
                            <span className="font-bold text-xs text-foreground">{company.name}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                              {company.industry}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {company.province}·{company.city}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleSelectCompanyFactories(company.name)}
                            className="text-[11px] text-[#2C7CFF] hover:underline cursor-pointer font-medium"
                          >
                            {isAllGroupSelected
                              ? '取消全选'
                              : `全选本单位 (${selectedCountInGroup}/${groupFacs.length})`}
                          </button>
                        </div>

                        {/* 下属 3级 / 4级工厂网格 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {groupFacs.map((targetFac) => {
                            const isChecked = syncTargetFactoryIds.includes(targetFac.id)

                            return (
                              <label
                                key={targetFac.id}
                                className={cn(
                                  'flex items-center justify-between p-2 rounded-md border text-xs cursor-pointer transition-colors',
                                  isChecked
                                    ? 'bg-blue-50/70 border-[#2C7CFF] font-medium'
                                    : 'bg-white border-[#E2E8F0] hover:bg-slate-50'
                                )}
                              >
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => toggleSelectSyncFactory(targetFac.id)}
                                    className="rounded border-[#E2E8F0] text-[#2C7CFF] focus:ring-[#2C7CFF]"
                                  />
                                  <span
                                    className={cn(
                                      'text-[9px] px-1 py-0.5 rounded font-mono shrink-0 font-medium',
                                      targetFac.level === 2
                                        ? 'bg-purple-100 text-purple-700'
                                        : targetFac.level === 3
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-emerald-100 text-emerald-700'
                                    )}
                                  >
                                    {targetFac.level}级
                                  </span>
                                  <span className="truncate">{targetFac.shortName}</span>
                                </div>
                                <span className="text-[10px] text-muted-foreground font-mono shrink-0 ml-1">
                                  {targetFac.city}
                                </span>
                              </label>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-800 text-[11px] leading-relaxed">
                提示：执行同步后，系统将自动为所选企业创建名为【v2026.02-同步】的草稿方案并注入上述费价，各企业能碳主管可核对本地电网政策后正式启用，避免直接篡改历史结算数据。
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-[#DBE6EE] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsSyncModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleExecuteSync}
                className="px-4 py-2 rounded-[6px] bg-[#2C7CFF] hover:bg-[#2568d8] text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Check className="size-3.5" />
                确认同步至选定企业 ({syncTargetFactoryIds.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
