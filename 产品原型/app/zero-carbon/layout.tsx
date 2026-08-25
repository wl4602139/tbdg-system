import { PlatformShell } from '@/components/shared/platform-shell'

export default function ZeroCarbonLayout({ children }: { children: React.ReactNode }) {
  return <PlatformShell platform="zero-carbon">{children}</PlatformShell>
}
