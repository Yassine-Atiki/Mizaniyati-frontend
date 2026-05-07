import clsx from 'clsx'

const Input = ({ label, hint, className, ...props }) => (
  <label className={clsx('input-field', className)}>
    {label && <span>{label}</span>}
    <input {...props} />
    {hint && <small>{hint}</small>}
  </label>
)

export default Input
