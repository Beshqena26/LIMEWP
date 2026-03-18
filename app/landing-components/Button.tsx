import { Icon } from './Icons'

type ButtonVariant = 'primary' | 'secondary' | 'coral'
type ButtonSize = 'default' | 'small'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: string
  href?: string
  onClick?: () => void
  children: React.ReactNode
}

export function Button({ variant = 'primary', size = 'default', icon, href, onClick, children }: ButtonProps) {
  const cls = `btn btn-${variant === 'primary' ? 'p' : variant === 'secondary' ? 's' : 'coral'}${size === 'small' ? ' btn-sm' : ''}`

  if (href) {
    return <a href={href} className={cls}>{children}{icon && <Icon name={icon} />}</a>
  }

  return <button className={cls} onClick={onClick}>{children}{icon && <Icon name={icon} />}</button>
}
