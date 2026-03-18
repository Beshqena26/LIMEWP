import { Icon } from './Icons'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className = '', hover = true }: CardProps) {
  return <div className={`card${hover ? ' card-hover' : ''} ${className}`}>{children}</div>
}

interface IconBoxProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  color?: 'lime' | 'green' | 'blue' | 'purple' | 'orange'
}

export function IconBox({ name, size = 'md', color = 'lime' }: IconBoxProps) {
  return (
    <div className={`icon-box icon-box-${size} icon-box-${color}`}>
      <Icon name={name} />
    </div>
  )
}
