import { PlatformShell } from '@/components/shared/platform-shell'
import { DesignSystemShowcaseView } from '@/components/design-system/showcase-view'

export const metadata = {
  title: '特变电工能碳双中心 · 标准前端组件库',
  description: '以零碳园区集控中心为权威模板构建的特变电工标准前端组件体系与交互画廊',
}

export default function DesignSystemPage() {
  return (
    <PlatformShell>
      <DesignSystemShowcaseView />
    </PlatformShell>
  )
}
