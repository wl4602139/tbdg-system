'use client'

import { useState } from 'react'
import { Plug } from 'lucide-react'
import { Panel, DataTable, StatusBadge } from '@/components/shared/primitives'
import { Modal } from '@/components/shared/modal'

export default function InterfacePage() {
  const [testResult, setTestResult] = useState<string | null>(null)

  return (
    <div className="space-y-3.5">
      {/* 顶部 Header */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1677ff] shrink-0">
              <Plug className="size-5" />
            </div>
            <h1 className="text-base font-bold text-slate-800">接口配置管理</h1>
          </div>
      </div>

      <Panel title="接口配置管理" desc="维护各工厂子系统接口连接参数，支持字段映射、单位换算与接口测试">
      <DataTable
        columns={[
          { key: 'factory', label: '工厂/系统' },
          { key: 'url', label: '访问地址(URL)' },
          { key: 'protocol', label: '协议' },
          { key: 'auth', label: '认证方式' },
          { key: 'status', label: '运行状态', render: (r) => <StatusBadge tone={r.status === '正常' ? 'ok' : 'danger'}>{r.status}</StatusBadge> },
          {
            key: 'op',
            label: '操作',
            render: () => (
              <div className="flex gap-3">
                <button className="text-xs text-primary hover:underline">字段映射</button>
                <button className="text-xs text-primary hover:underline" onClick={() => setTestResult('连接成功 · 响应 128ms')}>
                  测试连接
                </button>
              </div>
            ),
          },
        ]}
        rows={[
          { factory: '天津变压器厂 能管系统', url: 'https://tj.tbea.com/api', protocol: 'RESTful', auth: 'Token', status: '正常' },
          { factory: '衡阳电缆厂 SCADA', url: 'https://hy.tbea.com/scada', protocol: 'RESTful', auth: 'AppKey', status: '正常' },
          { factory: '沈阳开关厂 能耗采集', url: 'https://sy.tbea.com/energy', protocol: 'MQTT', auth: 'Token', status: '异常' },
        ]}
      />

      <Modal open={!!testResult} onClose={() => setTestResult(null)} title="接口连接测试" size="md">
        <div className="flex flex-col items-center py-4">
          <StatusBadge tone="ok">测试通过</StatusBadge>
          <p className="mt-3 text-sm text-muted-foreground">{testResult}</p>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90" onClick={() => setTestResult(null)}>
            知道了
          </button>
        </div>
      </Modal>
    </Panel>
    </div>
  )
}