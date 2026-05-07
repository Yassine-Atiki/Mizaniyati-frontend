import Button from './Button'

const EmptyState = ({ title, description, actionLabel, onAction }) => (
  <div className="empty-state">
    <div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
    {actionLabel && <Button onClick={onAction}>{actionLabel}</Button>}
  </div>
)

export default EmptyState
