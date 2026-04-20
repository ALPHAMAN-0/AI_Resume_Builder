interface Props {
  title: string
  description?: string
}

export function SectionHeader({ title, description }: Props) {
  return (
    <div className="mb-6">
      <h2 className="section-title">{title}</h2>
      {description && <p className="section-desc">{description}</p>}
    </div>
  )
}
