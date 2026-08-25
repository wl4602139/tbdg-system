'use client'

import { useState } from 'react'
import { Panel } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'

export default function ConvertPage() {
  const [convertResult, setConvertResult] = useState('—')

  return (
    <Panel title="能源转换工具" desc="维护各类能源折标准煤系数，支持不同能源单位之间的转换计算">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">输入数值</label>
              <input className="w-full rounded-md border border-input bg-panel px-3 py-2 text-sm text-foreground outline-none focus:border-primary" defaultValue="1000" type="number" />
            </div>
            <Select
              label="源单位"
              options={[
                { label: 'kWh 电', value: 'kwh' },
                { label: 'm³ 天然气', value: 'gas' },
                { label: 't 标煤', value: 'tce' },
              ]}
            />
          </div>
          <Select
            label="目标单位"
            options={[
              { label: '吨标准煤 (tce)', value: 'tce' },
              { label: 'GJ', value: 'gj' },
              { label: 'kgCO2', value: 'co2' },
            ]}
          />
          <button
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            onClick={() => setConvertResult('0.1229 tce')}
          >
            计算转换
          </button>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-panel p-6">
          <div className="text-sm text-muted-foreground">转换结果</div>
          <div className="my-2 font-mono text-3xl font-semibold text-primary text-glow">{convertResult}</div>
          <div className="text-xs text-muted-foreground">折标系数 v2025.1 · 1229 kgce/万kWh</div>
        </div>
      </div>
    </Panel>
  )
}
