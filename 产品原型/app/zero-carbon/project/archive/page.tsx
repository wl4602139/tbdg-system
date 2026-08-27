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
} from 'lucide-react'
import { OrgTreeSidebar, type OrgNodeItem } from '@/components/shared/org-tree-sidebar'
import { cn } from '@/lib/utils'

interface ProjectLedgerItem {
  id: string
  code: string
  name: string
  base: string
  type: '分布式光伏' | '用户侧储能' | '余热利用' | '变频技改'
  capacity: string
  investment: number // 万元
  carbonSaving: number // tCO2/年
  onlineDate: string
  status: '并网稳定运行' | '削峰填谷运行' | '技改投产运行' | '在建中'
  irr: string
}

const PROJECT_LIST: ProjectLedgerItem[] = [
  {
    id: 'p-01',
    code: 'PRJ-2026-PV01',
    name: '沈变本部 5.8MWp 屋顶分布式光伏一期',
    base: '沈变本部',
    type: '分布式光伏',
    capacity: '5.8 MWp',
    investment: 2320.0,
    carbonSaving: 3850.0,
    onlineDate: '2025-11-28',
    status: '并网稳定运行',
    irr: '13.5%',
  },
  {
    id: 'p-02',
    code: 'PRJ-2026-ES02',
    name: '新变厂 4MW/8MWh 磷酸铁锂储能电站',
    base: '新变厂',
    type: '用户侧储能',
    capacity: '4MW/8MWh',
    investment: 1120.0,
    carbonSaving: 1240.0,
    onlineDate: '2026-03-15',
    status: '削峰填谷运行',
    irr: '12.8%',
  },
  {
    id: 'p-03',
    code: 'PRJ-2026-WHR03',
    name: '衡变真空干燥罐烟气余热回收蒸汽系统',
    base: '衡变本部',
    type: '余热利用',
    capacity: '1.2 t/h 蒸汽',
    investment: 450.0,
    carbonSaving: 1580.0,
    onlineDate: '2026-05-10',
    status: '技改投产运行',
    irr: '11.2%',
  },
  {
    id: 'p-04',
    code: 'PRJ-2026-PV04',
    name: '鲁缆公司 4.2MWp 柔性支架屋顶光伏',
    base: '鲁缆公司',
    type: '分布式光伏',
    capacity: '4.2 MWp',
    investment: 1680.0,
    carbonSaving: 2780.0,
    onlineDate: '2025-09-20',
    status: '并网稳定运行',
    irr: '11.9%',
  },
  {
    id: 'p-05',
    code: 'PRJ-2026-VFD05',
    name: '新缆厂大型塑料挤出机变频永磁同步技改',
    base: '新缆厂',
    type: '变频技改',
    capacity: '850 kW 永磁',
    investment: 280.0,
    carbonSaving: 920.0,
    onlineDate: '2026-04-01',
    status: '技改投产运行',
    irr: '14.2%',
  },
]

export default function ProjectArchivePage() {
  const [selectedOrg, setSelectedOrg] = useState<OrgNodeItem>({
    id: 'group_all',
    name: '特变电工集团 (电装大盘)',
    fullName: '特变电工集团（电装板块全景）',
    level: 'group',
  })

  const [searchKw, setSearchKw] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredProjects = useMemo(() => {
    return PROJECT_LIST.filter((p) => {
      if (typeFilter !== 'all' && p.type !== typeFilter) return false
      if (
        searchKw &&
        !p.name.toLowerCase().includes(searchKw.toLowerCase()) &&
        !p.code.toLowerCase().includes(searchKw.toLowerCase()) &&
        !p.base.toLowerCase().includes(searchKw.toLowerCase())
      ) {
        return false
      }
      return true
    })
  }, [typeFilter, searchKw])

  return (
    <div className="flex w-full items-start gap-4">
      {/* 🌟 左侧 270px 经典工业级导线拓扑树 */}
      <OrgTreeSidebar
        title="工厂与用能拓扑 (3级)"
        subtitle="全层级穿透"
        selectedId={selectedOrg.id}
        onSelect={(node) => setSelectedOrg(node)}
      />

      {/* 🌟 右侧主面板 */}
      <div className="flex-1 min-w-0 space-y-3.5">
        {/* 顶部控制与视角提示卡片 */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-base shrink-0 border border-emerald-200 shadow-2xs">
              📁
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-slate-800">{selectedOrg.name}</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold flex items-center gap-1">
                  🏢 集团全局大盘视角 (电装宏观总览)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                全集团分布式光伏、储能电站、工业余热回收、变频节能技改项目全生命周期数字台账
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-[#1677ff] hover:bg-blue-600 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <Plus className="size-3.5" />
              <span>登记新项目</span>
            </button>
          </div>
        </div>

        {/* 4 栏大盘核心资产卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 mb-1 font-bold">全集团减排项目总投资</div>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-2xl font-extrabold font-mono text-slate-900">1.85</span>
              <span className="text-xs text-slate-500">亿元</span>
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between font-mono">
              <span>在建/并网: 18 个</span>
              <span className="text-emerald-700 font-bold">综合 IRR: 11.8%</span>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 mb-1 font-bold">分布式光伏总装机容量</div>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-2xl font-extrabold font-mono text-emerald-600">32.5</span>
              <span className="text-xs text-slate-500">MWp</span>
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between font-mono">
              <span>年均发电: 3,900 万kWh</span>
              <span className="text-emerald-700 font-bold">自用率 92%</span>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 mb-1 font-bold">用户侧储能配置规模</div>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-2xl font-extrabold font-mono text-blue-600">10.0</span>
              <span className="text-xs text-slate-500">MW / 20MWh</span>
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between font-mono">
              <span>两充两放策略</span>
              <span className="text-blue-700 font-bold">年套利 480 万元</span>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 mb-1 font-bold">年化总碳减排量</div>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-2xl font-extrabold font-mono text-emerald-600">3.82</span>
              <span className="text-xs text-slate-500">万吨 CO₂/年</span>
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between font-mono">
              <span>等效植树: 210 万棵</span>
              <span className="text-emerald-700 font-bold">CCER 备选</span>
            </div>
          </div>
        </div>

        {/* 减排项目数字台账列表 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900">减排项目全景台账与建设运维进度</h3>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <div className="relative">
                <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchKw}
                  onChange={(e) => setSearchKw(e.target.value)}
                  placeholder="搜索项目/基地..."
                  className="pl-7 pr-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:border-[#1677ff]"
                />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-2 py-1 rounded-md border border-slate-200 bg-slate-50 text-xs text-slate-700"
              >
                <option value="all">全部类型 (光伏/储能/余热/技改)</option>
                <option value="分布式光伏">分布式光伏 (PV)</option>
                <option value="用户侧储能">用户侧储能 (BESS)</option>
                <option value="余热利用">余热利用 (WHR)</option>
                <option value="变频技改">变频技改 (VFD)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#f8fafc] text-slate-600 border-b border-slate-200 font-semibold font-sans">
                <tr>
                  <th className="px-3 py-2.5">项目编号</th>
                  <th className="px-3 py-2.5">项目名称</th>
                  <th className="px-3 py-2.5">所属基地</th>
                  <th className="px-3 py-2.5">项目类型</th>
                  <th className="px-3 py-2.5">装机规模</th>
                  <th className="px-3 py-2.5 text-right">总投资(万元)</th>
                  <th className="px-3 py-2.5 text-right">年节碳(tCO₂)</th>
                  <th className="px-3 py-2.5 text-center">内部收益率(IRR)</th>
                  <th className="px-3 py-2.5">投产日期</th>
                  <th className="px-3 py-2.5 text-center">运行状态</th>
                  <th className="px-3 py-2.5 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-3 py-2.5 font-bold text-[#1677ff]">{p.code}</td>
                    <td className="px-3 py-2.5 font-sans font-medium text-slate-900">{p.name}</td>
                    <td className="px-3 py-2.5 font-sans text-slate-600">{p.base}</td>
                    <td className="px-3 py-2.5 font-sans">
                      <span
                        className={cn(
                          'px-1.5 py-0.2 rounded border text-[10px] font-bold',
                          p.type === '分布式光伏'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : p.type === '用户侧储能'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200',
                        )}
                      >
                        {p.type}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-bold text-slate-800">{p.capacity}</td>
                    <td className="px-3 py-2.5 text-right font-bold text-slate-900">{p.investment.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-right font-bold text-emerald-700">{p.carbonSaving.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-center font-bold text-emerald-600">{p.irr}</td>
                    <td className="px-3 py-2.5 text-slate-500">{p.onlineDate}</td>
                    <td className="px-3 py-2.5 text-center font-sans">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                        {p.status}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right font-sans">
                      <button
                        onClick={() => alert(`正在查看【${p.name}】实时遥测舱与工况数据...`)}
                        className="text-[#1677ff] hover:underline"
                      >
                        查看遥测
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 登记新项目弹窗 Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Plus className="size-4 text-[#1677ff]" />
                登记新建减排 / 节能技改项目
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">项目名称</label>
                <input
                  type="text"
                  placeholder="例如 沈变本部 3MWp 屋顶光伏二期项目"
                  className="w-full h-8 px-2.5 rounded-md border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">所属基地</label>
                  <select className="w-full h-8 px-2.5 rounded-md border border-slate-300 bg-white">
                    <option>沈变本部</option>
                    <option>衡变本部</option>
                    <option>新变厂</option>
                    <option>鲁缆公司</option>
                    <option>新缆厂</option>
                    <option>德缆公司</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">项目类型</label>
                  <select className="w-full h-8 px-2.5 rounded-md border border-slate-300 bg-white">
                    <option>分布式光伏 (PV)</option>
                    <option>用户侧储能 (BESS)</option>
                    <option>余热利用 (WHR)</option>
                    <option>变频节能技改 (VFD)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">装机容量 / 规模</label>
                  <input type="text" placeholder="例如 3.0 MWp" className="w-full h-8 px-2.5 rounded-md border border-slate-300" />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">总投资预算 (万元)</label>
                  <input type="number" placeholder="例如 1200" className="w-full h-8 px-2.5 rounded-md border border-slate-300" />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">预估年节碳量 (tCO₂/年)</label>
                <input type="number" placeholder="例如 1980" className="w-full h-8 px-2.5 rounded-md border border-slate-300" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-600 bg-slate-100 hover:bg-slate-200"
              >
                取消
              </button>
              <button
                onClick={() => {
                  alert('项目登记成功，已纳入全集团数字台账并开始跟踪建设进度！')
                  setShowAddModal(false)
                }}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-[#1677ff] hover:bg-blue-600 shadow-xs"
              >
                确认登记
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
