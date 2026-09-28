import { Suspense } from 'react'
import { SystemView } from '@/components/system/system-view'

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">加载中...</div>}>
      <SystemView />
    </Suspense>
  )
}
