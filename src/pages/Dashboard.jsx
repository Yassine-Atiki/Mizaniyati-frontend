import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { Wallet, TrendingUp, Target, Coins } from 'lucide-react'
import { useMemo } from 'react'
import SectionHeader from '../components/ui/SectionHeader'
import StatCard from '../components/ui/StatCard'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import { useExpenses } from '../hooks/useExpenses'
import { useIncome } from '../hooks/useIncome'
import { useBudgets } from '../hooks/useBudgets'
import { useStrategies } from '../hooks/useStrategies'
import { formatCurrency, formatDate } from '../utils/formatters'
import { chartPalette } from '../utils/theme'
import Gauge from '../components/ui/Gauge'

const Dashboard = () => {
  const { expenses, loading: expensesLoading, error: expensesError } = useExpenses()
  const { income, loading: incomeLoading, error: incomeError } = useIncome()
  const { budgets } = useBudgets()
  const { activeStrategy } = useStrategies()

  const currency = 'MAD'

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [expenses],
  )
  const totalIncome = useMemo(
    () => income.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [income],
  )
  const netBalance = totalIncome - totalExpenses
  const budgetRemaining = useMemo(
    () => budgets.reduce((sum, item) => sum + Number(item.limitAmount || 0), 0) - totalExpenses,
    [budgets, totalExpenses],
  )

  const expenseByCategory = useMemo(() => {
    const map = new Map()
    expenses.forEach((item) => {
      const key = item.category?.name || 'Autres'
      map.set(key, (map.get(key) || 0) + Number(item.amount || 0))
    })
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }))
  }, [expenses])

  const monthlySeries = useMemo(() => {
    const map = new Map()
    const items = [...expenses, ...income]
    items.forEach((item) => {
      const date = new Date(item.date)
      const label = `${date.getMonth() + 1}/${date.getFullYear()}`
      const existing = map.get(label) || { label, income: 0, expenses: 0 }
      if (item.source || item.isRecurring !== undefined) {
        existing.income += Number(item.amount || 0)
      } else {
        existing.expenses += Number(item.amount || 0)
      }
      map.set(label, existing)
    })
    return Array.from(map.values()).slice(-12)
  }, [expenses, income])

  const latestTransactions = useMemo(() => {
    const merged = [
      ...expenses.map((item) => ({ ...item, kind: 'expense' })),
      ...income.map((item) => ({ ...item, kind: 'income' })),
    ]
    return merged
      .filter((item) => item.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
  }, [expenses, income])

  const loading = expensesLoading || incomeLoading
  const error = expensesError || incomeError

  return (
    <div className="dashboard">
      <SectionHeader
        title="Vue globale"
        subtitle="Aperçu instantané"
      />

      {error && <p className="error">Impossible de charger les données.</p>}

      <div className="stats-grid">
        <StatCard
          label="Total revenus"
          value={formatCurrency(totalIncome, currency)}
          hint="Ce mois-ci"
          icon={<TrendingUp size={20} />}
        />
        <StatCard
          label="Total dépenses"
          value={formatCurrency(totalExpenses, currency)}
          hint="Ce mois-ci"
          icon={<Wallet size={20} />}
        />
        <StatCard
          label="Solde net"
          value={formatCurrency(netBalance, currency)}
          hint="Après dépenses"
          icon={<Coins size={20} />}
        />
        <StatCard
          label="Budget restant"
          value={formatCurrency(budgetRemaining, currency)}
          hint="Reste à allouer"
          icon={<Target size={20} />}
        />
      </div>

      <div className="dashboard-grid">
        <Card className="chart-card">
          <h3>Dépenses par catégorie</h3>
          {loading ? (
            <p className="muted">Chargement…</p>
          ) : expenseByCategory.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={expenseByCategory} dataKey="value" nameKey="name" innerRadius={60}>
                  {expenseByCategory.map((entry, index) => (
                    <Cell key={entry.name} fill={chartPalette[index % chartPalette.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value, currency)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState
              title="Aucune dépense"
              description="Ajoute ta première dépense pour révéler la répartition."
            />
          )}
        </Card>

        <Card className="chart-card">
          <h3>Revenus vs dépenses</h3>
          {monthlySeries.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={monthlySeries}>
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value, currency)} />
                <Line type="monotone" dataKey="income" stroke="#2fd6ff" strokeWidth={3} />
                <Line type="monotone" dataKey="expenses" stroke="#ff7d6b" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState
              title="Historique insuffisant"
              description="Ajoute quelques transactions pour activer la timeline."
            />
          )}
        </Card>
      </div>

      <div className="dashboard-grid">
        <Card className="transactions">
          <h3>Dernières transactions</h3>
          {latestTransactions.length ? (
            <div className="transactions-list">
              {latestTransactions.map((item) => (
                <div key={item.id} className="transaction">
                  <div className="transaction-main">
                    <h4>{item.description || item.source || 'Transaction'}</h4>
                    <span>{formatDate(item.date)}</span>
                  </div>
                  <div className="transaction-meta">
                    <Badge variant={item.kind === 'income' ? 'success' : 'danger'}>
                      {item.kind === 'income' ? 'Revenu' : 'Dépense'}
                    </Badge>
                    <strong>{formatCurrency(item.amount, currency)}</strong>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Aucune transaction"
              description="Les transactions récentes apparaîtront ici."
            />
          )}
        </Card>

        <Card className="strategy">
          <h3>Stratégie active</h3>
          {activeStrategy ? (
            <div className="strategy-card">
              <div>
                <h4>{activeStrategy.name}</h4>
                <p>{activeStrategy.isActive ? 'Active' : 'En pause'}</p>
              </div>
              <div className="gauges">
                <Gauge label="Saving" value={activeStrategy.savingPercentage} color="#5b4bff" />
                <Gauge label="Needs" value={activeStrategy.needsPercentage} color="#2fd6ff" />
                <Gauge label="Wants" value={activeStrategy.wantsPercentage} color="#ff7d6b" />
              </div>
            </div>
          ) : (
            <EmptyState
              title="Stratégie manquante"
              description="Crée une stratégie pour guider tes allocations."
            />
          )}
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
