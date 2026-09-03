import { Suspense } from 'react'
import { AccountingView } from '@/components/database/accounting-view'
import { EnergyView } from '@/components/database/energy-view'
import { ReportView } from '@/components/database/report-view'

export function generateStaticParams() {
  return [
    { section: [] },
    { section: ['accounting'] },
    { section: ['energy'] },
    { section: ['report'] },
  ]
}

export default async function DatabasePage({
  params,
}: {
  params: Promise<{ section?: string[] }>
}) {
  const { section } = await params
  const tab = section?.[0] ?? 'accounting'

  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">加载中...</div>}>
      <div className="mt-4">
        {tab === 'accounting' && <AccountingView />}
        {tab === 'energy' && <EnergyView />}
        {tab === 'report' && <ReportView />}
      </div>
    </Suspense>
  )
}
