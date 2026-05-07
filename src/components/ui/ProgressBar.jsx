import clsx from 'clsx'

const ProgressBar = ({ value, variant = 'success' }) => (
  <div className="progress">
    <span className={clsx('progress-bar', `progress-${variant}`)} style={{ width: `${value}%` }} />
  </div>
)

export default ProgressBar
