import Card from './Card'

const DataTable = ({ columns, rows, renderRow }) => (
  <Card className="table-card">
    <div className="table">
      <div className="table-head">
        {columns.map((col) => (
          <span key={col}>{col}</span>
        ))}
      </div>
      <div className="table-body">
        {rows.map((row) => (
          <div key={row.id} className="table-row">
            {renderRow(row)}
          </div>
        ))}
      </div>
    </div>
  </Card>
)

export default DataTable
