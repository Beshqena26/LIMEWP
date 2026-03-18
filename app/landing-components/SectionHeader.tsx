interface SectionHeaderProps {
  label: string
  title: string
  desc?: string
  center?: boolean
}

export function SectionHeader({ label, title, desc, center = false }: SectionHeaderProps) {
  return (
    <div className={center ? 'sc' : ''}>
      <div className="sl">{label}</div>
      <div className="st" dangerouslySetInnerHTML={{ __html: title }} />
      {desc && <p className="sd">{desc}</p>}
    </div>
  )
}
