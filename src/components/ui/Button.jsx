import { motion } from 'framer-motion'
import clsx from 'clsx'

const variants = {
  primary: 'btn btn-primary',
  ghost: 'btn btn-ghost',
  outline: 'btn btn-outline',
  danger: 'btn btn-danger',
}

const Button = ({ variant = 'primary', className, children, ...props }) => (
  <motion.button
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.98 }}
    className={clsx(variants[variant], className)}
    {...props}
  >
    {children}
  </motion.button>
)

export default Button
