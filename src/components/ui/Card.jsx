import clsx from 'clsx'

const Card = ({ className, children }) => (
  <div className={clsx('card', className)}>{children}</div>
)

export default Card
