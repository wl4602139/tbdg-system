import { Suspense } from 'react'
import { RealSceneView } from '@/components/database/real-scene-view'
import { AccountingView } from '@/components/database/accounting-view'
import { ReportView } from '@/components/database/report-view'

export function generateStaticParams() {
  return [
    { section: [] },
    { section: ['realscene'] },
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
  const tab = section?.[0] ?? 'realscene'

  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">加载中...</div>}>
      <div className="mt-4">
        {tab === 'realscene' && <RealSceneView />}
        {tab === 'accounting' && <AccountingView />}
        {/* energy 已并入碳足迹核算的页签，保留 accounting 兼容旧深链 */}
        {tab === 'energy' && <AccountingView />}
        {tab === 'report' && <ReportView />}
      </div>
    </Suspense>
  )
}
