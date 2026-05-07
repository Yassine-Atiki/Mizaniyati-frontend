const SectionHeader = ({ title, subtitle, action }) => (
  <div className="section-header">
    <div>
      <p className="eyebrow">{subtitle}</p>
      <h2>{title}</h2>
    </div>
    {action}
  </div>
)

export default SectionHeader
