import { PlatformShell } from '@/components/shared/platform-shell'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PlatformShell platform="carbon-footprint">{children}</PlatformShell>
}
