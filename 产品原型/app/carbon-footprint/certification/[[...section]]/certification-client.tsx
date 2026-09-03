'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Panel, StatusBadge, Toolbar, DataTable, KpiCard } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'
import { Modal } from '@/components/shared/modal'
import { certMaterials, certApplications, certResults, statusColor } from '@/lib/mock-data'
import { Download, Upload, Plus, FileCheck } from 'lucide-react'

const orgLabel: Record<string, string> = { all: '', tuv: 'TÜV', sgs: 'SGS', bv: 'BV' }

export default function CertificationClient({ tab: propTab }: { tab?: string }) {
  const params = useParams()
  const seg = Array.isArray(params.section) ? params.section[0] : (params.section as string | undefined)
  const tab = propTab ?? seg ?? 'material'
  const [applyOpen, setApplyOpen] = useState(false)
  const [org, setOrg] = useState('all')

  /* 认证机构下拉过滤资料模板表 */
  const materialRows =
    org === 'all' ? certMaterials : certMaterials.filter((r) => r.org?.includes(orgLabel[org]))

  return (
    <div>
      {tab === 'material' && (
        <div className="mt-4 space-y-4">
          <Toolbar>
            <Select
              label="认证机构"
              value={org}
              onChange={setOrg}
              options={[
                { value: 'all', label: '全部机构' },
                { value: 'tuv', label: 'TÜV 莱茵' },
                { value: 'sgs', label: 'SGS' },
                { value: 'bv', label: 'BV 必维' },
              ]}
            />
            <span className="text-xs text-muted-foreground">标准化资料模板供各经营单位下载、申报认证</span>
          </Toolbar>
          <DataTable
            columns={[
              { key: 'name', label: '资料模板名称' },
              { key: 'org', label: '认证机构' },
              { key: 'version', label: '版本', className: 'font-mono' },
              { key: 'updated', label: '更新时间' },
              {
                key: 'action',
                label: '操作',
                render: () => (
                  <button type="button" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                    <Download className="size-3.5" /> 下载模板
                  </button>
                ),
              },
            ]}
            rows={materialRows}
          />
        </div>
      )}

      {tab === 'apply' && (
        <div className="mt-4 space-y-4">
          <Toolbar>
            <button
              type="button"
              onClick={() => setApplyOpen(true)}
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground"
            >
              <Plus className="size-4" /> 发起认证申请
            </button>
            <span className="text-xs text-muted-foreground">在线填报评价与认证需求，下载模板并上传申报材料</span>
          </Toolbar>
          <DataTable
            columns={[
              { key: 'no', label: '申请编号', className: 'font-mono' },
              { key: 'product', label: '产品型号' },
              { key: 'unit', label: '经营单位' },
              { key: 'org', label: '认证机构' },
              { key: 'date', label: '申请日期' },
              {
                key: 'status',
                label: '状态',
                render: (r) => (
                  <StatusBadge tone={r.status === '已通过' ? 'ok' : r.status === '待补件' ? 'warn' : 'info'}>
                    {r.status}
                  </StatusBadge>
                ),
              },
              {
                key: 'action',
                label: '操作',
                render: () => (
                  <button type="button" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                    <Upload className="size-3.5" /> 上传材料
                  </button>
                ),
              },
            ]}
            rows={certApplications}
          />
        </div>
      )}

      {tab === 'result' && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <KpiCard label="有效证书" value="24" unit="份" trend="+3" up />
            <KpiCard label="临期证书" value="2" unit="份" trend="需续期" up={false} />
            <KpiCard label="已过期" value="1" unit="份" trend="已禁用" up={false} />
            <KpiCard label="认证机构" value="3" unit="家" trend="" up />
          </div>
          <Panel title="认证结果归档" desc="统一归档证书编号、产品型号、认证机构、有效期、附件，支持生命周期管理">
            <DataTable
              columns={[
                { key: 'cert', label: '证书编号', className: 'font-mono' },
                { key: 'product', label: '产品型号' },
                { key: 'org', label: '认证机构' },
                { key: 'validTo', label: '有效期至' },
                {
                  key: 'status',
                  label: '状态',
                  render: (r) => <StatusBadge tone={statusColor(r.status)}>{r.status}</StatusBadge>,
                },
                {
                  key: 'action',
                  label: '操作',
                  render: (r) => (
                    <div className="flex items-center gap-3 text-xs">
                      <button type="button" className="inline-flex items-center gap-1 text-primary hover:underline">
                        <Download className="size-3.5" /> 证书
                      </button>
                      {r.status === '临期' && (
                        <button type="button" className="text-[var(--warning)] hover:underline">
                          续期
                        </button>
                      )}
                      {r.status === '已过期' && <span className="text-muted-foreground">已禁用</span>}
                    </div>
                  ),
                },
              ]}
              rows={certResults}
            />
          </Panel>
        </div>
      )}

      <Modal open={applyOpen} onClose={() => setApplyOpen(false)} title="发起认证申请">
        <div className="space-y-4">
          <Select
            label="产品型号"
            value="SZ11-1600"
            onChange={() => {}}
            options={[
              { value: 'SZ11-1600', label: 'SZ11-1600/10 变压器' },
              { value: 'YJV-8.7', label: 'YJV-8.7/15 电缆' },
            ]}
          />
          <Select
            label="认证机构"
            value="tuv"
            onChange={() => {}}
            options={[
              { value: 'tuv', label: 'TÜV 莱茵' },
              { value: 'sgs', label: 'SGS' },
              { value: 'bv', label: 'BV 必维' },
            ]}
          />
          <Select
            label="认证类型"
            value="cfp"
            onChange={() => {}}
            options={[
              { value: 'cfp', label: '产品碳足迹认证（ISO 14067）' },
              { value: 'epd', label: '环境产品声明（EPD）' },
            ]}
          />
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-secondary/40 py-6 text-sm text-muted-foreground hover:border-primary">
            <FileCheck className="size-6 text-primary" />
            点击上传申报材料（PDF / Word / Excel）
            <input type="file" className="hidden" />
          </label>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setApplyOpen(false)}
              className="h-9 rounded-md border border-border px-4 text-sm text-muted-foreground hover:text-foreground"
            >
              取消
            </button>
            <button
              type="button"
              onClick={() => setApplyOpen(false)}
              className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
            >
              提交申请
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
