import CbamClient from './cbam-client'

export function generateStaticParams() {
  return [
    { section: [] },
    { section: ['compliance'] },
    { section: ['declaration'] },
    { section: ['knowledge'] },
  ]
}

export default async function CbamPage({
  params,
}: {
  params: Promise<{ section?: string[] }>
}) {
  const { section } = await params
  const tab = section?.[0] ?? 'compliance'
  return <CbamClient tab={tab} />
}
