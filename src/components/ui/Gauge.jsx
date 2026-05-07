import { motion } from 'framer-motion'

const Gauge = ({ label, value, color }) => (
  <div className="gauge">
    <div className="gauge-rail">
      <motion.span
        className="gauge-fill"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
      />
    </div>
    <div className="gauge-meta">
      <span>{label}</span>
      <strong>{value}%</strong>
    </div>
  </div>
)

export default Gauge
