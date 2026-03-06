interface ToggleProps {
  active: boolean
  onToggle: () => void
  labelLeft: string
  labelRight: string
  badge?: string
}

export function Toggle({ active, onToggle, labelLeft, labelRight, badge }: ToggleProps) {
  return (
    <div className="billing-toggle">
      <span className={!active ? 'on' : ''}>{labelLeft}</span>
      <div className={`tpill${active ? ' yr' : ''}`} onClick={onToggle} />
      <span className={active ? 'on' : ''}>{labelRight}{badge && <span className="save"> {badge}</span>}</span>
    </div>
  )
}
