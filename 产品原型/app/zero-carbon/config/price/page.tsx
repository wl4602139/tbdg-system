'use client'

import { Panel } from '@/components/shared/primitives'
import { Select } from '@/components/shared/select'

export default function PricePage() {
  return (
    <Panel title="费价模型" desc="维护电、气、水、蒸汽等价格模型，支持分时电价、阶梯气价、基本电费、需量电费复杂计价规则">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <Select
            label="能源介质"
            options={[
              { label: '电', value: 'e' },
              { label: '天然气', value: 'g' },
              { label: '水', value: 'w' },
              { label: '蒸汽', value: 's' },
            ]}
          />
          <Select
            label="计价方式"
            options={[
              { label: '分时电价', value: 'tou' },
              { label: '阶梯气价', value: 'tier' },
              { label: '固定单价', value: 'flat' },
              { label: '需量电费', value: 'demand' },
            ]}
          />
          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">生效时间</label>
            <input className="w-full rounded-md border border-input bg-panel px-3 py-2 text-sm text-foreground outline-none focus:border-primary" type="date" />
          </div>
        </div>
        <div className="rounded-lg border border-border bg-panel p-4">
          <div className="mb-3 text-sm font-medium text-foreground">分时电价段（元/kWh）</div>
          {[
            ['尖峰', '1.28'],
            ['峰', '1.05'],
            ['平', '0.68'],
            ['谷', '0.32'],
          ].map(([k, v]) => (
            <div key={k} className="mb-2 flex items-center gap-3">
              <span className="w-12 text-sm text-muted-foreground">{k}</span>
              <input className="flex-1 rounded-md border border-input bg-panel px-3 py-2 text-sm text-foreground outline-none focus:border-primary" defaultValue={v} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">保存费价方案</button>
      </div>
    </Panel>
  )
}
