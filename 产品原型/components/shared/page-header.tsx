export function PageHeader({
  actions,
}: {
  title?: string
  desc?: string
  positioning?: string
  actions?: React.ReactNode
}) {
  if (!actions) return null
  return (
    <div className="mb-5 flex flex-wrap items-center justify-end gap-2">
      {actions}
    </div>
  )
}
