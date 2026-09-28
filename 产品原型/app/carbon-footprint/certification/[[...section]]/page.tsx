import CertificationClient from './certification-client'

export function generateStaticParams() {
  return [
    { section: [] },
    { section: ['material'] },
    { section: ['apply'] },
    { section: ['result'] },
  ]
}

export default async function CertificationPage({
  params,
}: {
  params: Promise<{ section?: string[] }>
}) {
  const { section } = await params
  const tab = section?.[0] ?? 'material'
  return <CertificationClient tab={tab} />
}
