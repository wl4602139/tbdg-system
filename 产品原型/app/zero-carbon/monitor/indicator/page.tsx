'use client'

import { useState } from 'react'
import {
  Layers,
  Activity,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Search,
  Building2,
  Factory,
  Cog,
  ChevronRight,
  ChevronDown,
  SlidersHorizontal,
  Bot,
  Zap,
  Flame,
  Droplets,
  Package,
  Award,
  Swords,
  Gauge,
  Sparkles,
  ShieldAlert,
  Calendar,
} from 'lucide-react'
import { LineTrend, BarChartGroup, Donut } from '@/components/shared/charts'
import { indicators, type IndicatorItem } from '@/lib/indicators'
import { seedFactor, varyNum } from '@/lib/variant'
import { cn } from '@/lib/utils'

export default function IndicatorControlPage() {
  const [selectedTreePath, setSelectedTreePath] = useState<string>('特变电工集团 / 沈变公司 / 沈变本部')
  const [selectedOrg, setSelectedOrg] = useState<string>('沈变本部')
  const [activePeriod, setActivePeriod] = useState<string>('2026-08')
  
  // 4 大硬刚 PK 维度
  const [pkTab, setPkTab] = useState<'factory' | 'product' | 'line' | 'batch'>('factory')

  // 1. 维度一：全集团 21 家工厂总能耗与总碳排放大 PK (工厂之间)
  const factoryPkList = [
    { rank: 1, name: '新变超高压公司', energy: 1520.0, carbon: 4150.2, green: '31.2%', status: 'worst', delta: '+18.4%', reason: '【最费电·高耗能重点监管】气相真空干燥蒸汽泄漏，能耗严重超标' },
    { rank: 2, name: '沈变本部 (沈阳)', energy: 1284.5, carbon: 3420.8, green: '38.6%', status: 'normal', delta: '+2.1%', reason: '能耗平稳受控，超高压试验负荷略高' },
    { rank: 3, name: '衡变本部 (衡阳)', energy: 1190.0, carbon: 3180.5, green: '41.2%', status: 'good', delta: '-3.5%', reason: '绿电消纳优秀，低碳工厂标杆' },
    { rank: 4, name: '鲁缆本部 (泰安)', energy: 980.0, carbon: 2610.0, green: '37.5%', status: 'normal', delta: '-0.8%', reason: '立塔交联挤出产线能耗正常' },
    { rank: 5, name: '德缆股份 (德阳)', energy: 840.0, carbon: 2250.0, green: '35.0%', status: 'normal', delta: '-1.2%', reason: '铜拉丝与绞线工序节能运行' },
    { rank: 6, name: '新缆厂 (昌吉)', energy: 680.0, carbon: 1820.0, green: '44.0%', status: 'best', delta: '-8.6%', reason: '【集团能效标杆】屋顶分布式光伏全额消纳，低碳运行' },
  ]

  // 2. 维度二：同产品跨工厂低碳 PK (同一个产品，哪家工厂做得更低碳)
  const crossFactoryProductPk = [
    {
      factory: '衡变本部 (衡阳基地)',
      unitEnergy: 1.18,
      diffPct: '-1.6% (达标)',
      isBest: true,
      status: '🟢 优胜标杆 (低碳工厂)',
      elec: '8,250 kWh/台',
      steam: '3.40 GJ/台',
      carbon: '1.15 tCO2/台',
      diagnosis: '真空干燥罐密封性极佳，冷凝水 100% 回收利用',
    },
    {
      factory: '沈变本部 (沈阳基地)',
      unitEnergy: 1.45,
      diffPct: '+20.8% (偏高)',
      isBest: false,
      status: '🟡 正常受控 (蒸汽略高)',
      elec: '10,420 kWh/台',
      steam: '4.82 GJ/台',
      carbon: '1.42 tCO2/台',
      diagnosis: '试验大厅无局放试验变频机组存在空载损耗',
    },
    {
      factory: '新变超高压 (昌吉基地)',
      unitEnergy: 1.58,
      diffPct: '+31.6% (超标)',
      isWorst: true,
      status: '🔴 严重拖后腿 (重点整改)',
      elec: '10,800 kWh/台',
      steam: '5.10 GJ/台',
      carbon: '1.55 tCO2/台',
      diagnosis: '2号干燥罐温控疏水阀微漏，保温层老化热散失大',
    },
  ]

  // 3. 维度三：同厂不同产线 PK (哪条产线能耗拖了后腿 - 以沈变本部为例)
  const linePkList = [
    {
      name: '超高压真空干燥车间',
      unitOutputEnergy: 0.89,
      target: 0.60,
      diffPct: '+48.3% ▲',
      isWorst: true,
      status: '🔴 严重拖后腿 (重点整改)',
      reason: '2号真空干燥罐温控疏水阀微漏，加热升温曲线异常',
      lossCost: '当月超标电费 12.8 万元',
    },
    {
      name: '无局放超高压试验大厅',
      unitOutputEnergy: 0.58,
      target: 0.55,
      diffPct: '+5.4% ▲',
      isWorst: false,
      status: '🟡 轻微偏高',
      reason: '大容量变压器满负荷升温试验无功损耗',
      lossCost: '正常受控',
    },
    {
      name: '铁芯数控剪切自动叠装线',
      unitOutputEnergy: 0.32,
      target: 0.35,
      diffPct: '-8.5% ▼',
      isBest: true,
      status: '🟢 优秀达标',
      reason: '全自动高精伺服电机节能改造见效',
      lossCost: '节约电费 4.2 万元',
    },
    {
      name: '自动化绝缘绕线车间',
      unitOutputEnergy: 0.28,
      target: 0.30,
      diffPct: '-6.6% ▼',
      isBest: true,
      status: '🟢 优秀达标',
      reason: '恒张力变频卷线机组平稳运行',
      lossCost: '节约电费 3.5 万元',
    },
  ]

  // 4. 维度四：同产品不同批次 PK (生产波动对碳排放的影响)
  const batchPkList = [
    { batch: '#202604 批次', unitKwh: 10100, carbon: 1.38, status: '正常受控', isWorst: false },
    { batch: '#202605 批次', unitKwh: 10250, carbon: 1.40, status: '正常受控', isWorst: false },
    { batch: '#202606 批次', unitKwh: 10200, carbon: 1.39, status: '正常受控', isWorst: false },
    { batch: '#202607 批次', unitKwh: 10350, carbon: 1.41, status: '正常受控', isWorst: false },
    { batch: '#202608 批次 (当期)', unitKwh: 12800, carbon: 1.72, status: '🔴 异常突增 +24.5%', isWorst: true },
  ]

  // 贯穿架构树（集团→工厂→产线→产品→批次）
  const enterpriseTree = [
    {
      id: 'group',
      name: '特变电工股份有限公司（电装集团）',
      children: [
        {
          id: 'sb',
          name: '沈变公司',
          children: [
            {
              id: 'sb-bb',
              name: '沈变本部',
              lines: [
                {
                  name: '超高压真空干燥车间',
                  status: 'danger',
                  products: [
                    { name: 'ODFS-334MVA/500kV 变压器', batches: ['#202608 批次 (异常)', '#202607 批次'] },
                    { name: 'SZ-110kV/63000kVA 变压器', batches: ['#202608 批次'] },
                  ],
                },
                {
                  name: '总装与无局放试验大厅',
                  status: 'normal',
                  products: [{ name: '特高压试验批次', batches: ['#202608 批次'] }],
                },
                {
                  name: '铁芯数控剪切叠装车间',
                  status: 'ok',
                  products: [{ name: 'S13-M-800kVA 配电变', batches: ['#202608 批次'] }],
                },
              ],
            },
          ],
        },
        {
          id: 'hb',
          name: '衡变公司',
          children: [
            {
              id: 'hb-bb',
              name: '衡变本部',
              lines: [
                {
                  name: '超高压制造车间',
                  status: 'ok',
                  products: [{ name: 'ODFS-334MVA/500kV 变压器', batches: ['#202608 批次 (标杆)'] }],
                },
              ],
            },
          ],
        },
        {
          id: 'xb',
          name: '新变厂',
          children: [
            {
              id: 'xb-cg',
              name: '新变超高压公司',
              lines: [
                {
                  name: '超高压试验制造区',
                  status: 'danger',
                  products: [{ name: 'ODFS-334MVA/500kV 变压器', batches: ['#202608 批次 (超标)'] }],
                },
              ],
            },
          ],
        },
      ],
    },
  ]

  return (
    <div className="space-y-3">
      {/* 顶部控制栏：当前穿透路径 + 4 大硬刚 PK 切换器 */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-[#e5e7eb] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <Swords className="size-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-800">
                指标管控 · 4 维横向硬核 PK 看板
              </h1>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-50 text-red-600 border border-red-200 font-mono font-bold">
                用数据抓管理 · 用对比分优劣
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              当前穿透路径：<span className="text-[#1677ff] font-bold">{selectedTreePath}</span>
            </p>
          </div>
        </div>

        {/* 4 个对比维度大切换 Tab */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setPkTab('factory')}
            className={cn(
              'px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5',
              pkTab === 'factory' ? 'bg-[#1677ff] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <Factory className="size-3.5" />
            1. 工厂之间 PK (总能碳)
          </button>
          <button
            onClick={() => setPkTab('product')}
            className={cn(
              'px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5',
              pkTab === 'product' ? 'bg-[#1677ff] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <Package className="size-3.5" />
            2. 同产品跨工厂 PK (单耗)
          </button>
          <button
            onClick={() => setPkTab('line')}
            className={cn(
              'px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5',
              pkTab === 'line' ? 'bg-[#1677ff] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <Cog className="size-3.5" />
            3. 同厂不同产线 PK (抓落后)
          </button>
          <button
            onClick={() => setPkTab('batch')}
            className={cn(
              'px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5',
              pkTab === 'batch' ? 'bg-[#1677ff] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <Activity className="size-3.5" />
            4. 同产品不同批次 PK (抓波动)
          </button>
        </div>
      </div>

      {/* 主体两栏：左侧固定架构树 (集团→工厂→产线→产品→批次) + 右侧白底高反差 PK 视口 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* 左侧架构树 */}
        <div className="lg:col-span-3">
          <div className="bg-white p-3.5 rounded-lg border border-[#e5e7eb] shadow-xs space-y-2 h-full">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Building2 className="size-4 text-[#1677ff]" />
                企业架构穿透树
              </span>
              <span className="text-[10px] text-slate-400 font-mono">直钻产品批次</span>
            </div>

            <div className="space-y-1 text-xs max-h-[600px] overflow-y-auto pr-1">
              <div className="font-bold text-slate-800 py-1 px-1.5 bg-slate-50 rounded flex items-center gap-1.5 border border-slate-200">
                <ChevronDown className="size-3.5 text-[#1677ff]" />
                <span className="truncate">特变电工股份有限公司</span>
              </div>

              <div className="ml-3 pl-2 border-l border-slate-200 space-y-1 mt-1">
                {enterpriseTree[0].children.map((bu) => (
                  <div key={bu.id} className="space-y-1">
                    <div className="font-semibold text-slate-700 py-0.5 px-1 rounded flex items-center gap-1">
                      <ChevronDown className="size-3 text-slate-400" />
                      <span>{bu.name}</span>
                    </div>

                    <div className="ml-3 pl-2 border-l border-slate-200 space-y-1">
                      {bu.children.map((fac) => (
                        <div key={fac.id} className="space-y-1">
                          <div
                            onClick={() => {
                              setSelectedOrg(fac.name)
                              setSelectedTreePath(`特变电工集团 / ${bu.name} / ${fac.name}`)
                            }}
                            className={cn(
                              'py-1 px-2 rounded cursor-pointer transition-colors flex items-center gap-1.5',
                              selectedOrg === fac.name
                                ? 'bg-blue-50 text-[#1677ff] font-bold border border-blue-200'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            )}
                          >
                            <Factory className="size-3.5 text-[#1677ff]" />
                            <span>{fac.name}</span>
                          </div>

                          {fac.lines && (
                            <div className="ml-3 pl-2 border-l border-slate-100 space-y-0.5">
                              {fac.lines.map((line) => (
                                <div key={line.name} className="space-y-0.5">
                                  <div
                                    onClick={() => setSelectedTreePath(`特变电工 / ${bu.name} / ${fac.name} / ${line.name}`)}
                                    className={cn(
                                      'py-0.5 px-1.5 rounded text-[11px] cursor-pointer flex items-center justify-between',
                                      line.status === 'danger'
                                        ? 'text-red-600 font-bold bg-red-50 border border-red-200'
                                        : line.status === 'ok'
                                        ? 'text-emerald-600 hover:bg-emerald-50'
                                        : 'text-slate-600 hover:bg-slate-50'
                                    )}
                                  >
                                    <div className="flex items-center gap-1 overflow-hidden">
                                      <Cog className="size-3 shrink-0" />
                                      <span className="truncate">{line.name}</span>
                                    </div>
                                    {line.status === 'danger' && <span className="size-1.5 rounded-full bg-red-500 animate-ping shrink-0" />}
                                  </div>

                                  <div className="ml-3 pl-2 border-l border-slate-100 space-y-0.5">
                                    {line.products.map((prod) => (
                                      <div key={prod.name} className="space-y-0.5">
                                        <div
                                          onClick={() => setSelectedTreePath(`特变电工 / ${bu.name} / ${fac.name} / ${line.name} / ${prod.name}`)}
                                          className="py-0.5 px-1 rounded text-[10px] text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
                                        >
                                          <Package className="size-2.5 text-blue-500 shrink-0" />
                                          <span className="truncate">{prod.name}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 右侧白底强对比 PK 视口 */}
        <div className="lg:col-span-9 space-y-3">
          {/* 1. 维度一：全集团 21 家工厂总能碳大 PK */}
          {pkTab === 'factory' && (
            <div className="bg-white p-4 rounded-lg border border-[#e5e7eb] shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="font-bold text-xs text-slate-800 flex items-center gap-2">
                  <span className="size-2 rounded-full bg-red-500" />
                  【维度一】全集团 21 家工厂总能耗与总碳排放排行榜（按综合能耗降序排列）
                </span>
                <span className="text-xs text-slate-400 font-mono">2026-08 统计周期</span>
              </div>

              <div className="space-y-2 font-mono">
                {factoryPkList.map((item) => (
                  <div
                    key={item.name}
                    className={cn(
                      'p-3 rounded-lg border transition-all flex flex-wrap items-center justify-between gap-3',
                      item.status === 'worst'
                        ? 'bg-red-50/70 border-red-300'
                        : item.status === 'best'
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : 'bg-white border-slate-200'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          'size-6 rounded text-xs font-extrabold flex items-center justify-center',
                          item.status === 'worst'
                            ? 'bg-red-600 text-white'
                            : item.status === 'best'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-700'
                        )}
                      >
                        {item.rank}
                      </span>
                      <div>
                        <span className="font-bold text-sm text-slate-800 font-sans block">{item.name}</span>
                        <span className={cn('text-[11px] font-sans', item.status === 'worst' ? 'text-red-700 font-semibold' : 'text-slate-500')}>
                          {item.reason}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">综合能耗</span>
                        <span className={cn('text-lg font-bold', item.status === 'worst' ? 'text-red-600' : item.status === 'best' ? 'text-emerald-600' : 'text-slate-800')}>
                          {item.energy} <span className="text-xs font-normal text-slate-400">tce</span>
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">总碳排放</span>
                        <span className={cn('text-lg font-bold', item.status === 'worst' ? 'text-red-600' : item.status === 'best' ? 'text-emerald-600' : 'text-slate-800')}>
                          {item.carbon} <span className="text-xs font-normal text-slate-400">tCO2</span>
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">绿电占比</span>
                        <span className="text-base font-bold text-emerald-600">{item.green}</span>
                      </div>

                      <span
                        className={cn(
                          'px-2.5 py-1 rounded text-xs font-sans font-bold border',
                          item.status === 'worst'
                            ? 'bg-red-100 text-red-700 border-red-300'
                            : item.status === 'best'
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        )}
                      >
                        {item.status === 'worst' ? '🔴 最耗能 (重点监管)' : item.status === 'best' ? '🟢 能效标杆 (最优)' : '🟡 正常受控'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. 维度二：同产品跨工厂 */}
          {pkTab === 'product' && (
            <div className="bg-white p-4 rounded-lg border border-[#e5e7eb] shadow-xs space-y-3 font-mono">
              <div className="border-b border-slate-100 pb-2.5">
                <span className="font-bold text-xs text-slate-800">
                  【维度二】同型号产品跨厂低碳对标 PK：ODFS-334MVA/500kV 单相自耦变压器
                </span>
                <p className="text-[11px] text-slate-500 font-sans mt-0.5">国家行业标杆值：1.20 tce/万kVA · 谁做得更低碳一目了然</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {crossFactoryProductPk.map((item) => (
                  <div
                    key={item.factory}
                    className={cn(
                      'p-4 rounded-xl border space-y-2.5',
                      item.isBest
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : item.isWorst
                        ? 'bg-red-50/70 border-red-300'
                        : 'bg-white border-slate-200'
                    )}
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="font-bold text-sm text-slate-800 font-sans">{item.factory}</span>
                      <span className={cn('text-xs px-2 py-0.5 rounded font-sans font-bold border', item.isBest ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : item.isWorst ? 'bg-red-100 text-red-700 border-red-300' : 'bg-slate-100 text-slate-600 border-slate-200')}>
                        {item.status}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">综合单耗 (tce/万kVA)</span>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className={cn('text-3xl font-extrabold', item.isWorst ? 'text-red-600' : item.isBest ? 'text-emerald-700' : 'text-slate-900')}>
                          {item.unitEnergy}
                        </span>
                        <span className={cn('text-xs font-bold font-sans', item.isWorst ? 'text-red-600' : 'text-emerald-600')}>
                          {item.diffPct}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600 font-sans pt-2 border-t border-slate-100">
                      <div className="flex justify-between"><span>单台电耗：</span><span className="font-bold font-mono text-slate-900">{item.elec}</span></div>
                      <div className="flex justify-between"><span>蒸汽消耗：</span><span className={cn('font-bold font-mono', item.isWorst ? 'text-red-600' : 'text-slate-900')}>{item.steam}</span></div>
                      <div className="flex justify-between"><span>单台碳足迹：</span><span className="font-bold font-mono text-emerald-700">{item.carbon}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. 维度三：同厂不同产线 */}
          {pkTab === 'line' && (
            <div className="bg-white p-4 rounded-lg border border-[#e5e7eb] shadow-xs space-y-3 font-mono">
              <div className="border-b border-slate-100 pb-2.5">
                <span className="font-bold text-xs text-slate-800">
                  【维度三】沈变本部各车间产线能效 PK（直接定位哪个车间在拖后腿）
                </span>
                <p className="text-[11px] text-slate-500 font-sans mt-0.5">万元产值标杆基准：0.60 tce/万 · 产线超标责任到车间</p>
              </div>

              <div className="space-y-2">
                {linePkList.map((item) => (
                  <div
                    key={item.name}
                    className={cn(
                      'p-3 rounded-lg border flex flex-wrap items-center justify-between gap-3',
                      item.isWorst
                        ? 'bg-red-50/70 border-red-300'
                        : item.isBest
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : 'bg-white border-slate-200'
                    )}
                  >
                    <div>
                      <span className="font-bold text-sm text-slate-800 font-sans block">{item.name}</span>
                      <span className={cn('text-[11px] font-sans', item.isWorst ? 'text-red-700 font-semibold' : 'text-slate-500')}>
                        排查归因：{item.reason}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">产值能耗</span>
                        <span className={cn('text-lg font-bold', item.isWorst ? 'text-red-600' : 'text-emerald-700')}>
                          {item.unitOutputEnergy} <span className="text-xs font-normal text-slate-400">tce/万</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">偏差幅度</span>
                        <span className={cn('text-sm font-bold', item.isWorst ? 'text-red-600' : 'text-emerald-700')}>{item.diffPct}</span>
                      </div>
                      <span className={cn('px-2.5 py-1 rounded text-xs font-sans font-bold border', item.isWorst ? 'bg-red-100 text-red-700 border-red-300' : 'bg-emerald-100 text-emerald-700 border-emerald-300')}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. 维度四：同产品不同批次 */}
          {pkTab === 'batch' && (
            <div className="bg-white p-4 rounded-lg border border-[#e5e7eb] shadow-xs space-y-3 font-mono">
              <div className="border-b border-slate-100 pb-2.5">
                <span className="font-bold text-xs text-slate-800">
                  【维度四】同型号变压器连续 5 个生产批次单耗与碳排波动离散 PK
                </span>
                <p className="text-[11px] text-slate-500 font-sans mt-0.5">锁定异常突增生产批次，精准回溯工艺波动</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {batchPkList.map((b) => (
                  <div
                    key={b.batch}
                    className={cn(
                      'p-3.5 rounded-xl border space-y-2',
                      b.isWorst
                        ? 'bg-red-50/70 border-red-300'
                        : 'bg-white border-slate-200'
                    )}
                  >
                    <span className="font-bold text-xs text-slate-700 font-sans block">{b.batch}</span>
                    <div>
                      <span className="text-[10px] text-slate-400 font-sans block">单台电耗</span>
                      <span className={cn('text-xl font-bold', b.isWorst ? 'text-red-600' : 'text-slate-900')}>{b.unitKwh.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400"> kWh</span>
                    </div>
                    <div className="pt-2 border-t border-slate-100 text-[11px]">
                      <span className="text-slate-400 font-sans">碳排：</span>
                      <span className={cn('font-bold', b.isWorst ? 'text-red-600' : 'text-emerald-700')}>{b.carbon} tCO2</span>
                    </div>
                    <span className={cn('block text-[10px] font-sans font-bold px-1.5 py-0.5 rounded text-center border', b.isWorst ? 'bg-red-100 text-red-700 border-red-300' : 'bg-slate-100 text-slate-600 border-slate-200')}>
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
