'use client'

import React, { useState } from 'react'
import {
  FileText,
  Download,
  Plus,
  Building2,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Printer,
  ShieldCheck,
  Search,
  ExternalLink,
  X,
  FileCheck,
} from 'lucide-react'
import { OrgTreeSidebar, type OrgNodeItem } from '@/components/shared/org-tree-sidebar'
import { cn } from '@/lib/utils'

interface CarbonReportItem {
  id: string
  title: string
  type: 'ISO 14064-1 权威核查' | 'ESG 责任披露' | '国家零碳工厂认证' | '内部能碳管理月报'
  org: string
  period: string
  verifier: string
  status: '已核查签发' | '编制完成' | '审核中'
  verifiedEmissions: string
  fileSize: string
  date: string
}

const REPORT_LIST: CarbonReportItem[] = [
  {
    id: 'rep-01',
    title: '特变电工集团 2025 年度组织温室气体排放盘查与核查报告 (ISO 14064-1)',
    type: 'ISO 14064-1 权威核查',
    org: '特变电工集团 (全集团汇总)',
    period: '2025 全年度',
    verifier: '通标标准技术服务 (SGS)',
    status: '已核查签发',
    verifiedEmissions: '218.4 万吨 CO₂e',
    fileSize: '8.4 MB',
    date: '2026-03-25',
  },
  {
    id: 'rep-02',
    title: '特变电工沈变公司 2026 年上半年温室气体核查声明与减排绩效报告',
    type: 'ISO 14064-1 权威核查',
    org: '沈变公司 (超高压制造基地)',
    period: '2026-H1',
    verifier: '中国质量认证中心 (CQC)',
    status: '已核查签发',
    verifiedEmissions: '21.5 万吨 CO₂e',
    fileSize: '4.2 MB',
    date: '2026-07-15',
  },
  {
    id: 'rep-03',
    title: '特变电工集团 2025 年度可持续发展与 ESG 碳披露专题报告',
    type: 'ESG 责任披露',
    org: '特变电工集团',
    period: '2025 全年度',
    verifier: '集团可持续发展委员会',
    status: '已核查签发',
    verifiedEmissions: '218.4 万吨 CO₂e',
    fileSize: '12.8 MB',
    date: '2026-04-10',
  },
  {
    id: 'rep-04',
    title: '特变电工鲁缆公司国家五星级零碳工厂自评价与核算报告',
    type: '国家零碳工厂认证',
    org: '鲁缆公司 (华东产业园)',
    period: '2026 动态核算',
    verifier: '中国节能协会 (CECA)',
    status: '编制完成',
    verifiedEmissions: '14.2 万吨 CO₂e',
    fileSize: '5.6 MB',
    date: '2026-08-10',
  },
  {
    id: 'rep-05',
    title: '特变电工集团 2026 年 08 月能碳管控与碳预算执行月报',
    type: '内部能碳管理月报',
    org: '零碳园区集控中心',
    period: '2026-08',
    verifier: '系统自动生成',
    status: '编制完成',
    verifiedEmissions: '18.42 万吨 CO₂e',
    fileSize: '2.1 MB',
    date: '2026-08-20',
  },
]

export default function CarbonReportPage() {
  const [selectedOrg, setSelectedOrg] = useState<OrgNodeItem>({
    id: 'group_all',
    name: '特变电工集团 (全景汇总)',
    fullName: '特变电工集团（电装板块全景）',
    level: 'group',
  })

  const [searchKw, setSearchKw] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [showGenerateModal, setShowGenerateModal] = useState(false)

  // 过滤后的报告
  const filteredReports = REPORT_LIST.filter((r) => {
    if (typeFilter !== 'all' && r.type !== typeFilter) return false
    if (searchKw && !r.title.toLowerCase().includes(searchKw.toLowerCase()) && !r.org.toLowerCase().includes(searchKw.toLowerCase())) {
      return false
    }
    return true
  })

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
        {/* 顶部 Header 与 操作按钮 */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-blue-50 text-[#1677ff] flex items-center justify-center font-bold text-base shrink-0 border border-blue-200 shadow-2xs">
              📑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-slate-800">组织级碳核算权威报告与合规披露中心</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold flex items-center gap-1">
                  ISO 14064-1 / ESG 披露
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                支持第三方机构核验报告归档、一键生成标准合规报告与全量活动数据佐证包导出
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center">
            <button
              onClick={() => setShowGenerateModal(true)}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-[#1677ff] hover:bg-blue-600 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <Plus className="size-3.5" />
              <span>生成新核算报告</span>
            </button>
            <button
              onClick={() => alert('正在打包全基地 2026-08 原始活动水平数据与表底凭单佐证包 (ZIP)...')}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <Download className="size-3.5" />
              <span>打包佐证资料</span>
            </button>
          </div>
        </div>

        {/* 4 栏报告归档大盘统计 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 mb-1 font-bold">已签发权威 ISO 14064 报告</div>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-2xl font-extrabold font-mono text-blue-600">8</span>
              <span className="text-xs text-slate-500">份 (全覆盖)</span>
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between font-mono">
              <span>SGS / CQC 权威认证</span>
              <span className="text-emerald-700 font-bold">国际互认</span>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 mb-1 font-bold">国家零碳工厂认证申报</div>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-2xl font-extrabold font-mono text-emerald-600">3</span>
              <span className="text-xs text-slate-500">家基地在建</span>
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between font-mono">
              <span>沈变/鲁缆/新变</span>
              <span className="text-emerald-700 font-bold">五星级标准</span>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 mb-1 font-bold">ESG 披露核查达标率</div>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-2xl font-extrabold font-mono text-slate-900">100.0%</span>
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between font-mono">
              <span>满足 GRI / ISSB 准则</span>
              <span className="text-blue-700 font-bold">无不符合项</span>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 mb-1 font-bold">自动核算凭单归档总数</div>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-2xl font-extrabold font-mono text-indigo-600">1,248</span>
              <span className="text-xs text-slate-500">份佐证</span>
            </div>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between font-mono">
              <span>发票/电表底数/绿证</span>
              <span className="text-indigo-700 font-bold">区块链存证</span>
            </div>
          </div>
        </div>

        {/* 报告归档列表 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#1677ff]" />
              <h3 className="text-xs font-bold text-slate-900">组织级碳核算与披露报告归档清单</h3>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <div className="relative">
                <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchKw}
                  onChange={(e) => setSearchKw(e.target.value)}
                  placeholder="搜索报告名称/机构..."
                  className="pl-7 pr-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:border-[#1677ff]"
                />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-2 py-1 rounded-md border border-slate-200 bg-slate-50 text-xs text-slate-700"
              >
                <option value="all">全部报告类型</option>
                <option value="ISO 14064-1 权威核查">ISO 14064-1 权威核查</option>
                <option value="ESG 责任披露">ESG 责任披露</option>
                <option value="国家零碳工厂认证">国家零碳工厂认证</option>
                <option value="内部能碳管理月报">内部能碳管理月报</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#f8fafc] text-slate-600 border-b border-slate-200 font-semibold font-sans">
                <tr>
                  <th className="px-3 py-2.5">报告名称</th>
                  <th className="px-3 py-2.5">报告类型</th>
                  <th className="px-3 py-2.5">核算组织边界</th>
                  <th className="px-3 py-2.5">核算周期</th>
                  <th className="px-3 py-2.5">核验/发证机构</th>
                  <th className="px-3 py-2.5 text-right">核定排放量</th>
                  <th className="px-3 py-2.5 text-center">报告状态</th>
                  <th className="px-3 py-2.5 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                {filteredReports.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-3 py-2.5 font-sans font-medium text-slate-900 flex items-center gap-1.5">
                      <FileText className="size-4 text-[#1677ff] shrink-0" />
                      <span>{r.title}</span>
                    </td>
                    <td className="px-3 py-2.5 font-sans">
                      <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                        {r.type}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-sans text-slate-600">{r.org}</td>
                    <td className="px-3 py-2.5">{r.period}</td>
                    <td className="px-3 py-2.5 font-sans text-slate-600">{r.verifier}</td>
                    <td className="px-3 py-2.5 text-right font-bold text-slate-900">{r.verifiedEmissions}</td>
                    <td className="px-3 py-2.5 text-center font-sans">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                        {r.status}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right font-sans">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => alert(`正在在线预览【${r.title}】...`)}
                          className="text-[#1677ff] hover:underline"
                        >
                          预览
                        </button>
                        <button
                          onClick={() => alert(`正在下载报告【${r.title}】(${r.fileSize})...`)}
                          className="text-emerald-700 hover:underline flex items-center gap-0.5"
                        >
                          <Download className="size-3" />
                          <span>下载</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 报告标准模板库卡片 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-900">碳核算与披露标准报告模板库</h3>
            <span className="text-[11px] text-slate-400">支持一键套用模板导出</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:border-blue-300 transition-all space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <FileCheck className="size-4 text-blue-600" />
                <span>ISO 14064-1 标准模板</span>
              </div>
              <p className="text-[11px] text-slate-500">国际通用组织温室气体量化和报告规范模板，含直接/间接排放清单。</p>
              <button
                onClick={() => alert('已套用 ISO 14064-1 模板生成报告草稿！')}
                className="text-[11px] font-bold text-[#1677ff] hover:underline"
              >
                套用生成 →
              </button>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:border-blue-300 transition-all space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <ShieldCheck className="size-4 text-emerald-600" />
                <span>CBAM 欧盟碳关税申报模板</span>
              </div>
              <p className="text-[11px] text-slate-500">针对出口变压器与线缆产品的隐含碳排放核算与官方 XML/PDF 报告。</p>
              <button
                onClick={() => alert('已套用 CBAM 欧盟碳关税模板生成报告草稿！')}
                className="text-[11px] font-bold text-emerald-600 hover:underline"
              >
                套用生成 →
              </button>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:border-blue-300 transition-all space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Sparkles className="size-4 text-purple-600" />
                <span>国家零碳工厂自评价模板</span>
              </div>
              <p className="text-[11px] text-slate-500">依据国家节能协会《零碳工厂评价规范》，含四维评价指标与证据链。</p>
              <button
                onClick={() => alert('已套用零碳工厂评价模板生成报告草稿！')}
                className="text-[11px] font-bold text-purple-600 hover:underline"
              >
                套用生成 →
              </button>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:border-blue-300 transition-all space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <FileText className="size-4 text-amber-600" />
                <span>集团能碳管控月度通报</span>
              </div>
              <p className="text-[11px] text-slate-500">面向集团高管与各厂总经理的双碳考核与指标红黑榜通报模版。</p>
              <button
                onClick={() => alert('已套用集团月报模板生成报告草稿！')}
                className="text-[11px] font-bold text-amber-600 hover:underline"
              >
                套用生成 →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 生成报告弹窗 Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="size-4 text-[#1677ff]" />
                生成组织碳核算与合规披露报告
              </h3>
              <button onClick={() => setShowGenerateModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">选择核算组织边界</label>
                <select className="w-full h-8 px-2.5 rounded-md border border-slate-300 bg-white">
                  <option>特变电工集团 (全集团汇总)</option>
                  <option>沈变公司 (沈变本部及分厂)</option>
                  <option>衡变公司 (衡变本部及分厂)</option>
                  <option>新变厂 (新疆特高压基地)</option>
                  <option>鲁缆公司 (华东电缆科技园)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">报告标准模板</label>
                  <select className="w-full h-8 px-2.5 rounded-md border border-slate-300 bg-white">
                    <option>ISO 14064-1 组织温室气体核查</option>
                    <option>ESG 可持续发展披露报告</option>
                    <option>国家零碳工厂自评价报告</option>
                    <option>CBAM 欧盟碳关税合规报告</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">统计核算周期</label>
                  <input type="month" defaultValue="2026-08" className="w-full h-8 px-2.5 rounded-md border border-slate-300" />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">导出文件格式</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="format" defaultChecked />
                    <span>PDF 高清排版格式 (含防伪水印)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="format" />
                    <span>Word 可编辑格式</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-600 bg-slate-100 hover:bg-slate-200"
              >
                取消
              </button>
              <button
                onClick={() => {
                  alert('报告生成成功！已自动归档至列表并开始下载。')
                  setShowGenerateModal(false)
                }}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-[#1677ff] hover:bg-blue-600 shadow-xs"
              >
                开始生成
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
