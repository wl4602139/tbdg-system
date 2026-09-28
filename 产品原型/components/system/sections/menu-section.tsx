'use client'

import React, { useState, useMemo } from 'react'
import {
  LayoutGrid,
  Plus,
  Search,
  ChevronDown,
  ChevronRight,
  Pencil,
  Trash2,
  Check,
  X,
  Zap,
  Leaf,
  Layers,
  Sliders,
  ExternalLink,
  FileCode,
  RotateCcw,
  Download,
  AlertCircle,
  FolderPlus,
  Shield,
  LayoutDashboard,
  MonitorCog,
  Gauge,
  ClipboardCheck,
  FileBarChart,
  Settings2,
  BarChart3,
  Database,
  ShieldCheck,
  BadgeCheck,
  Boxes,
  Activity,
  Cpu,
  PieChart,
  Factory,
  TrendingUp,
  BarChart,
  FileArchive,
  MonitorCheck,
  Coins,
  Award,
  TableProperties,
  Receipt,
  Percent,
  Building,
  FileCheck,
  GitCompare,
  TrendingDown,
  Calculator,
  FileSpreadsheet,
  ShieldAlert,
  BookOpen,
  FolderArchive,
  Send,
  Flame,
  Sparkles,
  SlidersHorizontal,
  Maximize2,
} from 'lucide-react'
import { Panel, Badge, ExportButton } from '@/components/shared/primitives'
import { Modal } from '@/components/shared/modal'
import { Select } from '@/components/shared/select'
import { Field, inputCls, ActionBtn } from '@/components/system/ui'
import { cn } from '@/lib/utils'
import {
  type NavigationMenuItem,
  INITIAL_NAVIGATION_MENUS,
} from '@/lib/navigation-menu-data'

// 图标字典映射表
const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  MonitorCog,
  Gauge,
  ClipboardCheck,
  FileBarChart,
  Settings2,
  BarChart3,
  Database,
  ShieldCheck,
  BadgeCheck,
  Boxes,
  Leaf,
  Zap,
  Activity,
  Sliders,
  PieChart,
  Factory,
  TrendingUp,
  BarChart,
  FileArchive,
  MonitorCheck,
  Coins,
  Award,
  TableProperties,
  Receipt,
  Percent,
  Building,
  FileCheck,
  GitCompare,
  TrendingDown,
  Calculator,
  FileSpreadsheet,
  ShieldAlert,
  BookOpen,
  FolderArchive,
  Send,
  Flame,
  Sparkles,
  SlidersHorizontal,
  Maximize2,
  Layers,
}

export function MenuSection() {
  // 菜单数据状态源
  const [menuList, setMenuList] = useState<NavigationMenuItem[]>(INITIAL_NAVIGATION_MENUS)

  // 筛选与视图状态
  const [activeSystemTab, setActiveSystemTab] = useState<'zero-carbon' | 'carbon-footprint'>('zero-carbon')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | '启用' | '停用'>('all')
  const [levelFilter, setLevelFilter] = useState<'all' | '1' | '2'>('all')

  // 折叠与展开控制 (默认全部展开一级菜单)
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    INITIAL_NAVIGATION_MENUS.filter((m) => m.level === 1).forEach((m) => {
      initial[m.id] = true
    })
    return initial
  })

  // 弹窗状态
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  // 当前操作项
  const [currentMenu, setCurrentMenu] = useState<NavigationMenuItem | null>(null)
  const [itemToDelete, setItemToDelete] = useState<NavigationMenuItem | null>(null)

  // 表单状态
  const [formSystemKey, setFormSystemKey] = useState<'zero-carbon' | 'carbon-footprint'>('zero-carbon')
  const [formLevel, setFormLevel] = useState<1 | 2>(1)
  const [formParentId, setFormParentId] = useState<string>('')
  const [formTitle, setFormTitle] = useState('')
  const [formRoute, setFormRoute] = useState('')
  const [formIconName, setFormIconName] = useState('LayoutDashboard')
  const [formSortOrder, setFormSortOrder] = useState<number>(1)
  const [formStatus, setFormStatus] = useState<'启用' | '停用'>('启用')
  const [formActions, setFormActions] = useState<string[]>(['查看'])
  const [formDesc, setFormDesc] = useState('')

  // 可选的一级父菜单列表（随所属系统动态联动）
  const availableParents = useMemo(() => {
    return menuList.filter((m) => m.level === 1 && m.systemKey === formSystemKey)
  }, [menuList, formSystemKey])

  // 统计概览指标
  const stats = useMemo(() => {
    const totalPrimary = menuList.filter((m) => m.level === 1).length
    const totalSecondary = menuList.filter((m) => m.level === 2).length
    const zcPrimary = menuList.filter((m) => m.systemKey === 'zero-carbon' && m.level === 1).length
    const zcSecondary = menuList.filter((m) => m.systemKey === 'zero-carbon' && m.level === 2).length
    const cfPrimary = menuList.filter((m) => m.systemKey === 'carbon-footprint' && m.level === 1).length
    const cfSecondary = menuList.filter((m) => m.systemKey === 'carbon-footprint' && m.level === 2).length
    return {
      totalPrimary,
      totalSecondary,
      zcPrimary,
      zcSecondary,
      cfPrimary,
      cfSecondary,
    }
  }, [menuList])

  // 过滤后的菜单列表
  const filteredHierarchy = useMemo(() => {
    const kw = searchKeyword.trim().toLowerCase()

    // 1. 系统过滤
    let list = menuList.filter((m) => m.systemKey === activeSystemTab)

    // 2. 状态过滤
    if (statusFilter !== 'all') {
      list = list.filter((m) => m.status === statusFilter)
    }

    // 3. 关键字过滤（搜索匹配自身或匹配子页面）
    if (kw) {
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(kw) ||
          m.route.toLowerCase().includes(kw) ||
          m.actions.some((a) => a.toLowerCase().includes(kw)) ||
          (m.desc && m.desc.toLowerCase().includes(kw)) ||
          (m.parentTitle && m.parentTitle.toLowerCase().includes(kw))
      )
    }

    // 4. 层级过滤
    if (levelFilter === '1') {
      return list.filter((m) => m.level === 1)
    }
    if (levelFilter === '2') {
      return list.filter((m) => m.level === 2)
    }

    // 5. 组装父子树状视图
    // 找出所有符合条件的一级菜单
    const primaryMenus = menuList
      .filter((m) => m.level === 1 && m.systemKey === activeSystemTab)
      .sort((a, b) => a.sortOrder - b.sortOrder)

    const result: Array<{
      item: NavigationMenuItem
      isPrimary: boolean
      isExpanded: boolean
      hasChildren: boolean
      childCount: number
    }> = []

    primaryMenus.forEach((pm) => {
      // 找到该一级菜单下的所有二级菜单
      const children = menuList
        .filter((m) => m.level === 2 && m.parentId === pm.id)
        .sort((a, b) => a.sortOrder - b.sortOrder)

      // 检查当前一级菜单或其子菜单是否命中筛选
      const pmMatches = list.some((item) => item.id === pm.id)
      const matchingChildren = children.filter((child) => list.some((item) => item.id === child.id))

      if (pmMatches || matchingChildren.length > 0) {
        const isExp = expandedMap[pm.id] ?? true
        result.push({
          item: pm,
          isPrimary: true,
          isExpanded: isExp,
          hasChildren: children.length > 0,
          childCount: children.length,
        })

        // 若处于展开状态，呈现二级子页面
        if (isExp) {
          const displayChildren = kw ? matchingChildren : children
          displayChildren.forEach((cm) => {
            result.push({
              item: cm,
              isPrimary: false,
              isExpanded: false,
              hasChildren: false,
              childCount: 0,
            })
          })
        }
      }
    })

    return result
  }, [menuList, activeSystemTab, statusFilter, levelFilter, searchKeyword, expandedMap])

  // 打开新增一级菜单弹窗
  const handleOpenAddPrimary = () => {
    setCurrentMenu(null)
    setFormSystemKey(activeSystemTab === 'carbon-footprint' ? 'carbon-footprint' : 'zero-carbon')
    setFormLevel(1)
    setFormParentId('')
    setFormTitle('')
    setFormRoute('')
    setFormIconName('LayoutDashboard')
    setFormSortOrder(
      menuList.filter((m) => m.level === 1 && m.systemKey === (activeSystemTab === 'carbon-footprint' ? 'carbon-footprint' : 'zero-carbon')).length + 1
    )
    setFormStatus('启用')
    setFormActions(['查看', '导出'])
    setFormDesc('')
    setEditModalOpen(true)
  }

  // 打开新增子菜单弹窗
  const handleOpenAddChild = (parent: NavigationMenuItem) => {
    setCurrentMenu(null)
    setFormSystemKey(parent.systemKey)
    setFormLevel(2)
    setFormParentId(parent.id)
    setFormTitle('')
    setFormRoute(parent.route.endsWith('/') ? parent.route : `${parent.route}/`)
    setFormIconName('FileCode')
    setFormSortOrder(menuList.filter((m) => m.level === 2 && m.parentId === parent.id).length + 1)
    setFormStatus('启用')
    setFormActions(['查看', '导出'])
    setFormDesc('')
    setEditModalOpen(true)
  }

  // 打开编辑菜单弹窗
  const handleOpenEdit = (menu: NavigationMenuItem) => {
    setCurrentMenu(menu)
    setFormSystemKey(menu.systemKey)
    setFormLevel(menu.level)
    setFormParentId(menu.parentId || '')
    setFormTitle(menu.title)
    setFormRoute(menu.route)
    setFormIconName(menu.iconName)
    setFormSortOrder(menu.sortOrder)
    setFormStatus(menu.status)
    setFormActions([...menu.actions])
    setFormDesc(menu.desc || '')
    setEditModalOpen(true)
  }

  // 保存新增或编辑菜单
  const handleSaveMenu = () => {
    if (!formTitle.trim()) {
      alert('请输入菜单名称！')
      return
    }
    if (!formRoute.trim()) {
      alert('请输入路由地址！')
      return
    }

    const systemName = formSystemKey === 'zero-carbon' ? '零碳园区集控中心' : '产品碳足迹集采中心'
    const parent = formLevel === 2 ? menuList.find((m) => m.id === formParentId) : undefined

    if (currentMenu) {
      // 编辑现有菜单
      setMenuList((prev) =>
        prev.map((item) => {
          if (item.id === currentMenu.id) {
            return {
              ...item,
              systemKey: formSystemKey,
              systemName,
              title: formTitle.trim(),
              route: formRoute.trim(),
              iconName: formIconName,
              level: formLevel,
              parentId: formLevel === 2 ? formParentId : undefined,
              parentTitle: parent?.title,
              sortOrder: formSortOrder,
              status: formStatus,
              actions: formActions,
              desc: formDesc.trim(),
            }
          }
          // 若编辑的是一级菜单，同步更新子菜单的 parentTitle
          if (item.parentId === currentMenu.id) {
            return {
              ...item,
              systemKey: formSystemKey,
              systemName,
              parentTitle: formTitle.trim(),
            }
          }
          return item
        })
      )
    } else {
      // 新增菜单
      const newId = `${formSystemKey === 'zero-carbon' ? 'zc' : 'cf'}_${formLevel === 1 ? 'm' : 'p'}_${Date.now()}`
      const newItem: NavigationMenuItem = {
        id: newId,
        systemKey: formSystemKey,
        systemName,
        title: formTitle.trim(),
        route: formRoute.trim(),
        iconName: formIconName,
        level: formLevel,
        parentId: formLevel === 2 ? formParentId : undefined,
        parentTitle: parent?.title,
        sortOrder: formSortOrder,
        status: formStatus,
        actions: formActions.length > 0 ? formActions : ['查看'],
        desc: formDesc.trim(),
      }
      setMenuList((prev) => [...prev, newItem])

      // 若新增为子菜单，默认展开父菜单
      if (formLevel === 2 && formParentId) {
        setExpandedMap((prev) => ({ ...prev, [formParentId]: true }))
      }
    }

    setEditModalOpen(false)
  }

  // 切换一级菜单展开/折叠
  const toggleExpand = (id: string) => {
    setExpandedMap((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // 全部展开 / 全部收起
  const toggleAllExpand = (expand: boolean) => {
    const next: Record<string, boolean> = {}
    menuList.filter((m) => m.level === 1).forEach((m) => {
      next[m.id] = expand
    })
    setExpandedMap(next)
  }

  // 快速切换启用/停用状态
  const toggleMenuStatus = (item: NavigationMenuItem) => {
    const newStatus = item.status === '启用' ? '停用' : '启用'
    setMenuList((prev) =>
      prev.map((m) => {
        if (m.id === item.id) return { ...m, status: newStatus }
        // 若停用一级菜单，联动提示或同步子菜单
        return m
      })
    )
  }

  // 打开删除确认
  const handleOpenDelete = (item: NavigationMenuItem) => {
    setItemToDelete(item)
    setDeleteConfirmOpen(true)
  }

  // 确认删除菜单
  const handleConfirmDelete = () => {
    if (!itemToDelete) return
    setMenuList((prev) => prev.filter((m) => m.id !== itemToDelete.id && m.parentId !== itemToDelete.id))
    setDeleteConfirmOpen(false)
    setItemToDelete(null)
  }

  return (
    <Panel title="菜单与功能" icon={LayoutGrid}>

      {/* 🌟 1. 顶层业务中心切换 Tabs 栏 (零碳集控中心 vs 产品碳足迹集采中心) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* 零碳园区集控中心卡片 */}
        <div
          onClick={() => setActiveSystemTab('zero-carbon')}
          className={cn(
            'p-3.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between',
            activeSystemTab === 'zero-carbon'
              ? 'border-[#2C7CFF] ring-2 ring-[#2C7CFF]/25 bg-blue-50/20'
              : 'border-[#DBE6EE] bg-white hover:border-slate-300'
          )}
        >
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2C7CFF] shrink-0">
              <Zap className="size-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span>零碳园区集控中心</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-[#2C7CFF] font-medium">集控</span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">时序监测 / 能效分析 / 零碳评估</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold font-mono text-[#2C7CFF]">
              {stats.zcPrimary} <span className="text-xs font-normal text-slate-500">主模块</span>
            </div>
            <div className="text-xs text-slate-500 font-mono">{stats.zcSecondary} 个功能页面</div>
          </div>
        </div>

        {/* 产品碳足迹集采中心卡片 */}
        <div
          onClick={() => setActiveSystemTab('carbon-footprint')}
          className={cn(
            'p-3.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between',
            activeSystemTab === 'carbon-footprint'
              ? 'border-emerald-500 ring-2 ring-emerald-500/25 bg-emerald-50/20'
              : 'border-[#DBE6EE] bg-white hover:border-slate-300'
          )}
        >
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
              <Leaf className="size-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span>产品碳足迹集采中心</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 font-medium">集采</span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">LCA实景核算 / CBAM / 因子库</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold font-mono text-emerald-600">
              {stats.cfPrimary} <span className="text-xs font-normal text-slate-500">主模块</span>
            </div>
            <div className="text-xs text-slate-500 font-mono">{stats.cfSecondary} 个功能页面</div>
          </div>
        </div>
      </div>

      {/* 🌟 2. 筛选与控制操作栏 */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-50/80 p-3 rounded-lg border border-slate-200">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* 关键字模糊检索 */}
          <div className="relative w-72">
            <Search className="size-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="搜索菜单名称或路由..."
              className="w-full pl-8 pr-3 h-9 bg-white border border-[#E2E8F0] rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#2C7CFF]"
            />
            {searchKeyword && (
              <button
                onClick={() => setSearchKeyword('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* 层级筛选 */}
          <div className="w-48 [&_button]:min-w-0">
            <Select
              className="w-full h-9"
              value={levelFilter}
              onChange={(val) => setLevelFilter(val as any)}
              options={[
                { label: '全部菜单层级', value: 'all' },
                { label: '一级主导航', value: '1' },
                { label: '二级子页面', value: '2' },
              ]}
            />
          </div>

          {/* 状态筛选 */}
          <div className="w-40 [&_button]:min-w-0">
            <Select
              className="w-full h-9"
              value={statusFilter}
              onChange={(val) => setStatusFilter(val as any)}
              options={[
                { label: '全部状态', value: 'all' },
                { label: '已启用', value: '启用' },
                { label: '已停用', value: '停用' },
              ]}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {levelFilter === 'all' && (
            <>
              <button
                type="button"
                onClick={() => toggleAllExpand(true)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs text-slate-700 font-medium transition-colors cursor-pointer"
              >
                全部展开
              </button>
              <button
                type="button"
                onClick={() => toggleAllExpand(false)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs text-slate-700 font-medium transition-colors cursor-pointer"
              >
                全部折叠
              </button>
            </>
          )}
          <span className="text-xs text-slate-500 font-mono ml-1">
            匹配项: <strong className="text-slate-800">{filteredHierarchy.length}</strong>
          </span>
        </div>
      </div>

      {/* 🌟 3. 树状高密菜单管理表格 (44px 工业基准行高，100% 黄金自适应宽度分配) */}
      <div className="border border-[#DBE6EE] rounded-lg overflow-hidden bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-left text-xs table-fixed border-collapse font-sans">
            <thead>
              <tr className="bg-slate-50 border-b border-[#DBE6EE] text-slate-700 font-bold h-10 select-none text-xs">
                <th className="px-3 w-[4%] text-center whitespace-nowrap">#</th>
                <th className="px-3 w-[13%] whitespace-nowrap">所属业务中心</th>
                <th className="px-3 w-[33%] whitespace-nowrap">菜单与功能层级</th>
                <th className="px-3 w-[25%] whitespace-nowrap">路由路径 (URL)</th>
                <th className="px-3 w-[6%] text-center whitespace-nowrap">排序</th>
                <th className="px-3 w-[7%] text-center whitespace-nowrap">状态</th>
                <th className="px-3 w-[12%] text-right pr-4 whitespace-nowrap">管理操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredHierarchy.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 text-xs">
                    暂无符合条件的导航菜单数据！
                  </td>
                </tr>
              ) : (
                filteredHierarchy.map(({ item, isPrimary, isExpanded, hasChildren, childCount }, idx) => {
                  const IconComp = ICON_MAP[item.iconName] || FileCode
                  const isZc = item.systemKey === 'zero-carbon'

                  return (
                    <tr
                      key={item.id}
                      className={cn(
                        'h-[44px] transition-colors',
                        isPrimary
                          ? 'bg-slate-50/50 hover:bg-blue-50/30 font-semibold'
                          : 'bg-white hover:bg-slate-50/70'
                      )}
                    >
                      {/* 1. 序号 */}
                      <td className="px-3 text-center text-xs font-mono text-slate-400 whitespace-nowrap">
                        {idx + 1}
                      </td>

                      {/* 2. 所属业务中心 */}
                      <td className="px-3 whitespace-nowrap">
                        {isZc ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-[#2C7CFF] border border-blue-200">
                            <Zap className="size-3 text-[#2C7CFF]" />
                            <span>零碳集控</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Leaf className="size-3 text-emerald-600" />
                            <span>碳足迹集采</span>
                          </span>
                        )}
                      </td>

                      {/* 3. 菜单层级与名称 */}
                      <td className="px-3 overflow-hidden">
                        <div className="flex items-center gap-2 overflow-hidden min-w-0">
                          {isPrimary ? (
                            <>
                              <button
                                type="button"
                                onClick={() => toggleExpand(item.id)}
                                className="size-5 rounded flex items-center justify-center hover:bg-slate-200 text-slate-500 cursor-pointer shrink-0 transition-transform"
                                title={isExpanded ? '折叠子页面' : '展开子页面'}
                              >
                                {isExpanded ? (
                                  <ChevronDown className="size-4" />
                                ) : (
                                  <ChevronRight className="size-4" />
                                )}
                              </button>
                              <div className="size-6 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                                <IconComp className="size-3.5" />
                              </div>
                              <span className="font-bold text-slate-900 truncate" title={item.title}>
                                {item.title}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                                一级主导
                              </span>
                              {hasChildren && (
                                <span className="text-[10px] px-1 rounded bg-blue-50 text-blue-600 font-mono">
                                  {childCount}
                                </span>
                              )}
                            </>
                          ) : (
                            <div className="flex items-center gap-2 pl-6 overflow-hidden min-w-0">
                              <span className="text-slate-300 select-none shrink-0">↳</span>
                              <div className="size-5 rounded bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                                <IconComp className="size-3" />
                              </div>
                              <span className="text-slate-800 truncate" title={item.title}>
                                {item.title}
                              </span>
                              <span className="text-[10px] text-slate-400 font-sans truncate shrink-0">
                                (属于: {item.parentTitle})
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 4. 路由路径 */}
                      <td className="px-3 overflow-hidden">
                        <span
                          className="font-mono text-xs text-blue-700 bg-blue-50/70 border border-blue-100 rounded px-2 py-0.5 truncate inline-block max-w-full"
                          title={item.route}
                        >
                          {item.route}
                        </span>
                      </td>

                      {/* 5. 排序 */}
                      <td className="px-3 text-center font-mono text-xs text-slate-600 whitespace-nowrap">
                        {item.sortOrder}
                      </td>

                      {/* 6. 状态 */}
                      <td className="px-3 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => toggleMenuStatus(item)}
                          className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium cursor-pointer transition-colors select-none',
                            item.status === '启用'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                          )}
                          title="点击快速切换启用/停用"
                        >
                          <span
                            className={cn(
                              'size-1.5 rounded-full',
                              item.status === '启用' ? 'bg-emerald-500' : 'bg-slate-400'
                            )}
                          />
                          <span>{item.status}</span>
                        </button>
                      </td>

                      {/* 7. 管理操作 */}
                      <td className="px-3 text-right pr-4 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2 text-xs">
                          {isPrimary && (
                            <button
                              type="button"
                              onClick={() => handleOpenAddChild(item)}
                              className="text-[#2C7CFF] hover:text-blue-700 hover:underline flex items-center gap-0.5 cursor-pointer"
                              title="添加下属二级子页面"
                            >
                              <FolderPlus className="size-3" />
                              <span>加子页</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="text-slate-600 hover:text-slate-900 hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            <Pencil className="size-3" />
                            <span>编辑</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(item)}
                            className="text-red-500 hover:text-red-700 hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            <Trash2 className="size-3" />
                            <span>删除</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🌟 4. 新增 / 编辑菜单弹窗 (Modal) */}
      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={currentMenu ? `编辑菜单：${currentMenu.title}` : '新增系统导航菜单'}
        footer={
          <>
            <ActionBtn onClick={() => setEditModalOpen(false)}>取消</ActionBtn>
            <ActionBtn variant="primary" onClick={handleSaveMenu}>
              <Check className="size-4" /> 确认保存
            </ActionBtn>
          </>
        }
      >
        <div className="grid gap-4 text-xs font-sans">
          {/* 所属系统 */}
          <Field label="所属业务中心" required>
            <Select
              className="w-full [&>div]:w-full"
              value={formSystemKey}
              onChange={(val) => {
                const nextSys = val as 'zero-carbon' | 'carbon-footprint'
                setFormSystemKey(nextSys)
                // 切换系统时重置上级父菜单
                const newParents = menuList.filter((m) => m.level === 1 && m.systemKey === nextSys)
                if (newParents.length > 0) {
                  setFormParentId(newParents[0].id)
                }
              }}
              options={[
                { label: '⚡ 零碳园区集控中心 (Park Control)', value: 'zero-carbon' },
                { label: '🍃 产品碳足迹集采中心 (Carbon Footprint)', value: 'carbon-footprint' },
              ]}
            />
          </Field>

          {/* 菜单层级 */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="菜单层级" required>
              <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setFormLevel(1)}
                  className={cn(
                    'flex-1 py-1 rounded text-xs font-medium cursor-pointer transition-all',
                    formLevel === 1
                      ? 'bg-[#2C7CFF] text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  一级主导航
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormLevel(2)
                    if (!formParentId && availableParents.length > 0) {
                      setFormParentId(availableParents[0].id)
                    }
                  }}
                  className={cn(
                    'flex-1 py-1 rounded text-xs font-medium cursor-pointer transition-all',
                    formLevel === 2
                      ? 'bg-[#2C7CFF] text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  二级子页面
                </button>
              </div>
            </Field>

            {/* 排序号 */}
            <Field label="展示排序序号">
              <input
                type="number"
                value={formSortOrder}
                onChange={(e) => setFormSortOrder(Number(e.target.value) || 1)}
                className={inputCls}
                min={1}
                max={99}
              />
            </Field>
          </div>

          {/* 上级父菜单 (仅在二级子菜单时展示) */}
          {formLevel === 2 && (
            <Field label="上级主导航模块" required hint="二级子页面将挂载于选定的一级主导航下拉菜单中">
              <Select
                className="w-full [&>div]:w-full"
                value={formParentId}
                onChange={setFormParentId}
                options={availableParents.map((pm) => ({
                  label: `${pm.title} (${pm.route})`,
                  value: pm.id,
                }))}
              />
            </Field>
          )}

          {/* 菜单名称 & 路由地址 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="菜单/页面名称" required>
              <input
                className={inputCls}
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="例如: 重点用能设备 或 CBAM管理"
              />
            </Field>

            <Field label="路由地址 (Route Path)" required>
              <input
                className={`${inputCls} font-mono`}
                value={formRoute}
                onChange={(e) => setFormRoute(e.target.value)}
                placeholder="/zero-carbon/monitor/... 或 /carbon-footprint/..."
              />
            </Field>
          </div>

          {/* 图标与状态 */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="导航图标标识">
              <Select
                className="w-full [&>div]:w-full"
                value={formIconName}
                onChange={setFormIconName}
                options={Object.keys(ICON_MAP).map((k) => ({
                  label: k,
                  value: k,
                }))}
              />
            </Field>

            <Field label="启用状态">
              <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setFormStatus('启用')}
                  className={cn(
                    'flex-1 py-1 rounded text-xs font-medium cursor-pointer transition-all',
                    formStatus === '启用'
                      ? 'bg-emerald-600 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  启用
                </button>
                <button
                  type="button"
                  onClick={() => setFormStatus('停用')}
                  className={cn(
                    'flex-1 py-1 rounded text-xs font-medium cursor-pointer transition-all',
                    formStatus === '停用'
                      ? 'bg-slate-600 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  停用
                </button>
              </div>
            </Field>
          </div>

          {/* 业务描述 */}
          <Field label="功能定位与业务描述">
            <input
              className={inputCls}
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              placeholder="简要描述该模块在集控中心或集采中心承担的业务职责"
            />
          </Field>
        </div>
      </Modal>

      {/* 🌟 5. 删除确认弹窗 (Modal) */}
      <Modal
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="确认删除该导航菜单？"
        description="删除菜单将同步影响角色权限授权及业务导航呈现，此操作不可逆"
        footer={
          <>
            <ActionBtn onClick={() => setDeleteConfirmOpen(false)}>取消</ActionBtn>
            <ActionBtn variant="destructive" onClick={handleConfirmDelete}>
              <Trash2 className="size-4" /> 确认删除
            </ActionBtn>
          </>
        }
      >
        {itemToDelete && (
          <div className="space-y-3 text-xs text-slate-700 font-sans">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-start gap-2">
              <AlertCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                您确定要删除菜单【<strong className="text-red-900">{itemToDelete.title}</strong>】（
                <span className="font-mono">{itemToDelete.route}</span>）吗？
                {itemToDelete.level === 1 && (
                  <p className="mt-1 font-bold text-red-700">
                    ⚠️ 警告：这是一级主导航，删除后其下属的所有二级子功能页面也将被同步一并移除！
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Panel>
  )
}
