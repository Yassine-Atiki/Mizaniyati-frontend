import clsx from 'clsx'

const Badge = ({ variant = 'info', children }) => (
  <span className={clsx('badge', `badge-${variant}`)}>{children}</span>
)

export default Badge
