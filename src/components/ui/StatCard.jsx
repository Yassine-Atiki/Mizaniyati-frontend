import Card from './Card'

const StatCard = ({ label, value, hint, icon }) => (
  <Card className="stat-card">
    <div>
      <p className="stat-label">{label}</p>
      <h3>{value}</h3>
      <span className="stat-hint">{hint}</span>
    </div>
    <div className="stat-icon">{icon}</div>
  </Card>
)

export default StatCard
