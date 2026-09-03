import { CompareView } from '@/components/procurement/compare-view'
import { RankingView } from '@/components/procurement/ranking-view'
import { BenchmarkView } from '@/components/procurement/benchmark-view'

export function generateStaticParams() {
  return [
    { section: [] },
    { section: ['compare'] },
    { section: ['ranking'] },
    { section: ['benchmark'] },
  ]
}

export default async function AnalysisPage({
  params,
}: {
  params: Promise<{ section?: string[] }>
}) {
  const { section } = await params
  const tab = section?.[0] ?? 'compare'

  if (tab === 'ranking') return <RankingView />
  if (tab === 'benchmark') return <BenchmarkView />
  return <CompareView />
}
