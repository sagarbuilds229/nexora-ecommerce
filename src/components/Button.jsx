import './Button.css'

export function Button({ variant = 'primary', size = 'md', children, icon, iconRight, className = '', ...props }) {
  return (
    <button className={`btn btn--${variant} btn--${size} ${className}`} {...props}>
      {icon && <span className="btn__icon" aria-hidden>{icon}</span>}
      <span className="btn__label">{children}</span>
      {iconRight && <span className="btn__icon btn__icon--right" aria-hidden>{iconRight}</span>}
    </button>
  )
}
