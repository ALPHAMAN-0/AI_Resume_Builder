interface Props {
  title: string
  description?: string
}

export function SectionHeader({ title, description }: Props) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>
  )
}
