'use client'

import { useMemo, useState } from 'react'
import { Database, Cpu, Layers, Download, X, Search, Factory, FileSpreadsheet, Link2 } from 'lucide-react'
import { Panel, DataTable, StatusBadge, KpiCard, Toolbar, SearchInput, ExportButton } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import {
  platformBasicDataItems,
  catalogStats,
  type PlatformDictionaryItem,
  type DataItem,
} from '@/lib/data-catalog'

export function DataCatalogView({
  items: legacyItems,
  title = '特变电工能碳数字化双中心 · 全平台基础数据字典',
  desc = '汇集全平台底层遥测、工况、工单产出、财务费用、供应链物料、CBAM 报关及标准因子，面向数据资产治理与开发联调，不区分分子分母',
  note,
}: {
  items?: (PlatformDictionaryItem | DataItem)[]
  title?: string
  desc?: string
  note?: string
}) {
  const allItems: PlatformDictionaryItem[] = useMemo(() => {
    return platformBasicDataItems
  }, [])

  const [search, setSearch] = useState('')
  const [currentDomain, setCurrentDomain] = useState('全部')
  const [industryFilter, setIndustryFilter] = useState('全部')
  const [sourceFilter, setSourceFilter] = useState('全部')
  const [metricFilter, setMetricFilter] = useState('全部')

  // 详情抽屉模态框
  const [activeItem, setActiveItem] = useState<PlatformDictionaryItem | null>(null)

  // 10 大核心工业业务领域列表
  const domains = useMemo(() => [
    '全部',
    '能源计量与实时物联',
    '微电网与储能遥测',
    '重点装备工况遥测',
    '生产制造与工单产出',
    '财务经营与能源费用',
    '碳足迹与实景供应链',
    'CBAM 欧盟碳关税申报',
    '节能项目与零碳评估',
    '计量表计与设备档案',
    '标准基准与排放因子',
  ], [])

  // 过滤数据项
  const filteredRows = useMemo(() => {
    const q = search.toLowerCase().trim()
    return allItems.filter((i) => {
      if (currentDomain !== '全部' && i.domain !== currentDomain) return false
      if (industryFilter !== '全部' && i.industry !== industryFilter) return false
      if (sourceFilter !== '全部' && !i.sourceSys.includes(sourceFilter)) return false
      if (metricFilter === '已入模' && (!i.associatedMetrics || i.associatedMetrics.length === 0)) return false
      if (metricFilter === '未入模' && (i.associatedMetrics && i.associatedMetrics.length > 0)) return false

      if (q) {
        const metricsStr = (i.associatedMetrics || []).map(m => m.metricId + ' ' + m.metricName + ' ' + m.role).join(' ')
        const match =
          i.name.toLowerCase().includes(q) ||
          i.key.toLowerCase().includes(q) ||
          i.definition.toLowerCase().includes(q) ||
          i.sourceSys.toLowerCase().includes(q) ||
          i.protocol.toLowerCase().includes(q) ||
          i.spatialScope.toLowerCase().includes(q) ||
          i.unit.toLowerCase().includes(q) ||
          metricsStr.toLowerCase().includes(q)
        if (!match) return false
      }
      return true
    })
  }, [allItems, search, currentDomain, industryFilter, sourceFilter, metricFilter])

  // 统计概览
  const stat = catalogStats(allItems)

  // 导出专业 Excel 工作簿
  const handleExportExcel = () => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="宋体" x:CharSet="134" ss:Size="11" ss:Color="#000000"/>
  </Style>
  <Style ss:ID="HeaderStyle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DBE6EE"/>
   </Borders>
   <Font ss:FontName="微软雅黑" ss:Size="11" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#2C7CFF" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="RowStyle">
   <Alignment ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#F1F5F9"/>
   </Borders>
   <Font ss:FontName="微软雅黑" ss:Size="10"/>
  </Style>
  <Style ss:ID="CenterStyle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#F1F5F9"/>
   </Borders>
   <Font ss:FontName="微软雅黑" ss:Size="10"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="全平台基础数据字典(108项)">
  <Table ss:DefaultColumnWidth="90" ss:DefaultRowHeight="24">
   <Column ss:Width="45"/>
   <Column ss:Width="160"/>
   <Column ss:Width="150"/>
   <Column ss:Width="120"/>
   <Column ss:Width="160"/>
   <Column ss:Width="65"/>
   <Column ss:Width="80"/>
   <Column ss:Width="95"/>
   <Column ss:Width="260"/>
   <Column ss:Width="130"/>
   <Column ss:Width="110"/>
   <Column ss:Width="140"/>
   <Column ss:Width="85"/>
   <Column ss:Width="200"/>
   <Row ss:Height="28">
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">序号</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">基础数据项中文名称</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">字段英文标识 (Key)</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">业务领域归属</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">关联核算指标</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">工程单位</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">数据类型</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">采集更新时效</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">物理量定义与业务口径</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">数据源系统</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">通信规约协议</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">安装测点/空间层级</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">产业适用性</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">防错校验规则</Data></Cell>
   </Row>`

    const escapeXml = (s: any) =>
      String(s ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')

    filteredRows.forEach((r) => {
      const metricsStr = (r.associatedMetrics && r.associatedMetrics.length > 0)
        ? r.associatedMetrics.map(m => `${m.metricId}(${m.role})`).join('; ')
        : '-'

      xml += `
   <Row ss:Height="24">
    <Cell ss:StyleID="CenterStyle"><Data ss:Type="Number">${r.id}</Data></Cell>
    <Cell ss:StyleID="RowStyle"><Data ss:Type="String">${escapeXml(r.name)}</Data></Cell>
    <Cell ss:StyleID="RowStyle"><Data ss:Type="String">${escapeXml(r.key)}</Data></Cell>
    <Cell ss:StyleID="CenterStyle"><Data ss:Type="String">${escapeXml(r.domain)}</Data></Cell>
    <Cell ss:StyleID="RowStyle"><Data ss:Type="String">${escapeXml(metricsStr)}</Data></Cell>
    <Cell ss:StyleID="CenterStyle"><Data ss:Type="String">${escapeXml(r.unit)}</Data></Cell>
    <Cell ss:StyleID="CenterStyle"><Data ss:Type="String">${escapeXml(r.dataType)}</Data></Cell>
    <Cell ss:StyleID="CenterStyle"><Data ss:Type="String">${escapeXml(r.freq)}</Data></Cell>
    <Cell ss:StyleID="RowStyle"><Data ss:Type="String">${escapeXml(r.definition)}</Data></Cell>
    <Cell ss:StyleID="RowStyle"><Data ss:Type="String">${escapeXml(r.sourceSys)}</Data></Cell>
    <Cell ss:StyleID="CenterStyle"><Data ss:Type="String">${escapeXml(r.protocol)}</Data></Cell>
    <Cell ss:StyleID="RowStyle"><Data ss:Type="String">${escapeXml(r.spatialScope)}</Data></Cell>
    <Cell ss:StyleID="CenterStyle"><Data ss:Type="String">${escapeXml(r.industry)}</Data></Cell>
    <Cell ss:StyleID="RowStyle"><Data ss:Type="String">${escapeXml(r.validation)}</Data></Cell>
   </Row>`
    })

    xml += `
  </Table>
 </Worksheet>
</Workbook>`

    const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `特变电工能碳双中心_全平台基础数据字典_${new Date().toISOString().slice(0, 10)}.xls`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* 顶部统计指示条 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KpiCard
          label="全平台数据项总数"
          value={String(stat.total)}
          unit="项标准字段"
          icon={Database}
        />
        <KpiCard
          label="关联核算指标入模"
          value={String(stat.linked)}
          unit="项 (56指标引用)"
          icon={Link2}
        />
        <KpiCard
          label="系统/物联自动采集"
          value={String(stat.autoAcq)}
          unit="项 (78.7%)"
          icon={Cpu}
        />
        <KpiCard
          label="变压器产业专属"
          value={String(stat.transformer)}
          unit="项 (万kVA分母)"
          icon={Factory}
        />
        <KpiCard
          label="电线电缆产业专属"
          value={String(stat.cable)}
          unit="项 (万km·mm²分母)"
          icon={Layers}
        />
      </div>

      <Panel title={title} desc={desc}>
        {/* 工具栏与筛选区 */}
        <Toolbar className="justify-between">
          <div className="flex flex-wrap items-center gap-2.5">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="检索名称 / Key / 定义 / 测点 / 指标(M01)..."
              className="w-[240px]"
            />
            <Select
              label="适用产业"
              value={industryFilter}
              onChange={setIndustryFilter}
              options={['全部', '通用综合', '变压器产业', '电线电缆产业'].map((k) => ({
                label: k,
                value: k,
              }))}
            />
            <Select
              label="数据源系统"
              value={sourceFilter}
              onChange={setSourceFilter}
              options={['全部', 'SCADA', 'EMS', 'MES', 'ERP', 'SRM', '关口表', '国标'].map((s) => ({
                label: s,
                value: s,
              }))}
            />
            <Select
              label="入模状态"
              value={metricFilter}
              onChange={setMetricFilter}
              options={['全部', '已入模', '未入模'].map((s) => ({
                label: s,
                value: s,
              }))}
            />
          </div>

          <div className="flex items-center gap-2">
            <ExportButton onClick={handleExportExcel} title="导出" />
          </div>
        </Toolbar>

        {/* 10 大业务领域胶囊切换 */}
        <div className="mb-4 flex flex-wrap gap-1.5 border-b border-border/50 pb-3">
          {domains.map((dom) => (
            <button
              key={dom}
              type="button"
              onClick={() => setCurrentDomain(dom)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer select-none ${
                currentDomain === dom
                  ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                  : 'bg-accent/40 text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              {dom}
              {dom === '全部' ? ` (${allItems.length})` : ''}
            </button>
          ))}
        </div>

        {/* 高密数据字典表格 (44px 行高) */}
        <DataTable
          columns={[
            {
              key: 'id',
              label: '序号',
              className: 'font-mono text-center font-bold text-primary w-12',
            },
            {
              key: 'name',
              label: '数据项中文名称',
              className: 'font-bold text-foreground max-w-[170px] whitespace-normal',
            },
            {
              key: 'key',
              label: '字段英文标识 (Key)',
              render: (r: PlatformDictionaryItem) => (
                <code className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs text-primary font-medium">
                  {r.key}
                </code>
              ),
            },
            {
              key: 'domain',
              label: '业务领域',
              render: (r: PlatformDictionaryItem) => (
                <StatusBadge tone="info">{r.domain}</StatusBadge>
              ),
            },
            {
              key: 'associatedMetrics',
              label: '关联核算指标 (M01~M56)',
              render: (r: PlatformDictionaryItem) => {
                if (!r.associatedMetrics || r.associatedMetrics.length === 0) {
                  return <span className="text-xs text-muted-foreground/60">-</span>
                }
                return (
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {r.associatedMetrics.map((m) => (
                      <span
                        key={m.metricId + m.role}
                        className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          m.role === '分子'
                            ? 'bg-blue-500/15 text-blue-500 border border-blue-500/30'
                            : 'bg-purple-500/15 text-purple-500 border border-purple-500/30'
                        }`}
                        title={`${m.metricId} (${m.role}): ${m.metricName}`}
                      >
                        {m.metricId} ({m.role})
                      </span>
                    ))}
                  </div>
                )
              },
            },
            {
              key: 'unit',
              label: '工程单位',
              className: 'font-mono text-center font-semibold text-[var(--success)]',
            },
            {
              key: 'dataType',
              label: '数据类型',
              className: 'font-mono text-xs text-muted-foreground',
            },
            {
              key: 'freq',
              label: '采集时效',
              className: 'text-xs text-muted-foreground',
            },
            {
              key: 'definition',
              label: '物理量定义与业务口径',
              className: 'max-w-[260px] whitespace-normal text-xs text-muted-foreground/90 leading-relaxed',
            },
            {
              key: 'sourceSys',
              label: '数据源系统',
              className: 'font-medium text-foreground text-xs',
            },
            {
              key: 'protocol',
              label: '通信规约',
              className: 'text-xs text-muted-foreground',
            },
            {
              key: 'spatialScope',
              label: '安装测点 / 空间层级',
              className: 'text-xs text-muted-foreground',
            },
            {
              key: 'industry',
              label: '产业归属',
              render: (r: PlatformDictionaryItem) => (
                <StatusBadge
                  tone={
                    r.industry === '变压器产业'
                      ? 'warn'
                      : r.industry === '电线电缆产业'
                      ? 'ok'
                      : 'muted'
                  }
                >
                  {r.industry}
                </StatusBadge>
              ),
            },
            {
              key: 'validation',
              label: '防错与约束规则',
              className: 'font-mono text-xs text-[var(--warning)] max-w-[170px] whitespace-normal',
            },
            {
              key: 'actions',
              label: '画像',
              render: (r: PlatformDictionaryItem) => (
                <button
                  type="button"
                  onClick={() => setActiveItem(r)}
                  className="rounded border border-border px-2 py-0.5 text-xs text-foreground/80 hover:bg-primary hover:text-white transition-colors cursor-pointer"
                >
                  画像
                </button>
              ),
            },
          ]}
          rows={filteredRows}
          emptyText="暂无匹配的基础数据字典项"
        />

        {/* 底部备注规范 */}
        <div className="mt-4 rounded-lg bg-accent/30 p-3 text-xs text-muted-foreground flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">权威工业设计规范契约：</span>
            <span>
              本数据字典面向特变电工数字化平台底层统一建模，反向闭环映射 56 项指标核算分量，严格遵循 44px 高密表格规范与客观中立原则。
            </span>
          </div>
          <div className="font-mono text-xs text-primary font-semibold">
            共 {filteredRows.length} / {allItems.length} 项
          </div>
        </div>
      </Panel>

      {/* 数据项全息画像抽屉 */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 顶栏 */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                  <Database className="size-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    【#{activeItem.id}】{activeItem.name}
                  </h3>
                  <code className="text-xs text-primary font-mono">{activeItem.key}</code>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* 元数据网格 */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg border border-border/60 bg-panel p-2.5">
                <span className="text-muted-foreground">业务领域：</span>
                <span className="font-semibold text-foreground ml-1">{activeItem.domain}</span>
              </div>
              <div className="rounded-lg border border-border/60 bg-panel p-2.5">
                <span className="text-muted-foreground">工程计量单位：</span>
                <span className="font-mono font-bold text-[var(--success)] ml-1">{activeItem.unit}</span>
              </div>
              <div className="rounded-lg border border-border/60 bg-panel p-2.5">
                <span className="text-muted-foreground">数据类型与精度：</span>
                <span className="font-mono text-foreground ml-1">{activeItem.dataType}</span>
              </div>
              <div className="rounded-lg border border-border/60 bg-panel p-2.5">
                <span className="text-muted-foreground">采集频率 / 时效：</span>
                <span className="text-foreground ml-1">{activeItem.freq}</span>
              </div>
              <div className="rounded-lg border border-border/60 bg-panel p-2.5">
                <span className="text-muted-foreground">数据源系统：</span>
                <span className="text-foreground ml-1">{activeItem.sourceSys}</span>
              </div>
              <div className="rounded-lg border border-border/60 bg-panel p-2.5">
                <span className="text-muted-foreground">通信规约 / 协议：</span>
                <span className="text-foreground ml-1">{activeItem.protocol}</span>
              </div>
              <div className="rounded-lg border border-border/60 bg-panel p-2.5">
                <span className="text-muted-foreground">安装测点 / 空间：</span>
                <span className="text-foreground ml-1">{activeItem.spatialScope}</span>
              </div>
              <div className="rounded-lg border border-border/60 bg-panel p-2.5">
                <span className="text-muted-foreground">适用制造产业：</span>
                <span className="text-foreground ml-1">{activeItem.industry}</span>
              </div>
            </div>

            {/* 关联核算指标专属板块 */}
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary">📐 关联核算指标 (Associated Metrics)：</span>
                <span className="text-[11px] text-muted-foreground">
                  {activeItem.associatedMetrics && activeItem.associatedMetrics.length > 0
                    ? `共 ${activeItem.associatedMetrics.length} 个指标引用`
                    : '基础底数 / 未直接入模'}
                </span>
              </div>
              {activeItem.associatedMetrics && activeItem.associatedMetrics.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {activeItem.associatedMetrics.map((m) => (
                    <div
                      key={m.metricId + m.role}
                      className="flex items-center gap-1.5 rounded bg-panel border border-border px-2.5 py-1"
                    >
                      <span
                        className={`rounded px-1 text-[10px] font-bold ${
                          m.role === '分子'
                            ? 'bg-blue-500/15 text-blue-500'
                            : 'bg-purple-500/15 text-purple-500'
                        }`}
                      >
                        {m.metricId} ({m.role})
                      </span>
                      <span className="font-medium text-foreground">{m.metricName}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground">
                  本数据项属于工厂物联底数或静态档案，暂未作为分子或分母直接参与指标公式计算。
                </div>
              )}
            </div>

            {/* 物理量定义 */}
            <div className="rounded-lg border border-border/60 bg-panel p-3 text-xs space-y-1">
              <div className="font-bold text-foreground">物理量定义与业务口径：</div>
              <div className="text-muted-foreground leading-relaxed">{activeItem.definition}</div>
            </div>

            {/* 防错与约束规则 */}
            <div className="rounded-lg border border-[var(--warning)]/30 bg-[var(--warning)]/5 p-3 text-xs space-y-1">
              <div className="font-bold text-[var(--warning)]">防错与取值范围约束：</div>
              <div className="font-mono text-foreground/90">{activeItem.validation}</div>
            </div>

            {/* DDL 示例 */}
            <div className="text-xs space-y-1">
              <div className="font-bold text-muted-foreground">时序数据库 DDL 表结构定义示例：</div>
              <pre className="rounded-lg bg-black/50 p-3 font-mono text-[11px] text-primary border border-border/60 overflow-x-auto">
{`CREATE TABLE telemetry_${activeItem.key} (
  time TIMESTAMPTZ NOT NULL,
  tag_id VARCHAR(32) NOT NULL,
  val DOUBLE PRECISION, -- 工程单位: ${activeItem.unit}
  quality_flag INT DEFAULT 0,
  PRIMARY KEY (time, tag_id)
);`}
              </pre>
            </div>

            {/* API JSON Schema */}
            <div className="text-xs space-y-1">
              <div className="font-bold text-muted-foreground">API 接口字段 Schema 契约：</div>
              <pre className="rounded-lg bg-black/50 p-3 font-mono text-[11px] text-emerald-400 border border-border/60 overflow-x-auto">
{JSON.stringify(
  {
    field_key: activeItem.key,
    name_cn: activeItem.name,
    unit: activeItem.unit,
    data_type: activeItem.dataType,
    sampling_freq: activeItem.freq,
    source_system: activeItem.sourceSys,
    protocol: activeItem.protocol,
    validation_rule: activeItem.validation,
    associated_metrics: activeItem.associatedMetrics || [],
  },
  null,
  2
)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
