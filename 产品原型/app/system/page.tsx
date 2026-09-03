import { Suspense } from 'react'
import { SystemView } from '@/components/system/system-view'

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SystemView />
    </Suspense>
  )
}
