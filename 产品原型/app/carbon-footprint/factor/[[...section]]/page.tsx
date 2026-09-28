import FactorClient from './factor-client'

export function generateStaticParams() {
  return [
    { section: [] },
    { section: ['material'] },
    { section: ['power'] },
    { section: ['energy'] },
    { section: ['coal'] },
  ]
}

export default async function FactorPage({
  params,
}: {
  params: Promise<{ section?: string[] }>
}) {
  const { section } = await params
  const tab = section?.[0] ?? 'material'
  return <FactorClient tab={tab} />
}
