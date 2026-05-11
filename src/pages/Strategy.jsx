import { useState } from 'react'
import SectionHeader from '../components/ui/SectionHeader'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Gauge from '../components/ui/Gauge'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import EmptyState from '../components/ui/EmptyState'
import ProgressBar from '../components/ui/ProgressBar'
import { useStrategies } from '../hooks/useStrategies'
import { useExpenses } from '../hooks/useExpenses'
import { useIncome } from '../hooks/useIncome'
import { formatCurrency } from '../utils/formatters'

const defaultForm = {
  name: '',
  savingPercentage: 20,
  needsPercentage: 50,
  wantsPercentage: 30,
}

const Strategy = () => {
  const { strategies, activeStrategy, loading, error, create, update, activate, deactivate } = useStrategies()
  const { expenses } = useExpenses()
  const { income } = useIncome()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(defaultForm)

  const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  const totalIncome = income.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  const spendingRatio = totalIncome ? Math.min((totalExpenses / totalIncome) * 100, 100) : 0

  const openModal = (strategy = null) => {
    setEditing(strategy)
    setForm(
      strategy
        ? {
            name: strategy.name || '',
            savingPercentage: strategy.savingPercentage,
            needsPercentage: strategy.needsPercentage,
            wantsPercentage: strategy.wantsPercentage,
          }
        : defaultForm,
    )
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    const payload = {
      ...form,
      savingPercentage: Number(form.savingPercentage),
      needsPercentage: Number(form.needsPercentage),
      wantsPercentage: Number(form.wantsPercentage),
    }
    if (editing) {
      await update(editing.id, payload)
    } else {
      await create(payload)
    }
    setModalOpen(false)
  }

  return (
    <div className="page-stack">
      <SectionHeader
        title="Stratégie de budget"
        subtitle="Répartis chaque dirham avec intention"
        action={
          <Button onClick={() => openModal()}>
            Nouvelle stratégie
          </Button>
        }
      />

      {error && <p className="error">Erreur lors du chargement des stratégies.</p>}
      {loading ? (
        <p className="muted">Chargement…</p>
      ) : activeStrategy ? (
        <Card className="strategy-active">
          <div>
            <h3>{activeStrategy.name}</h3>
            <p>Stratégie active</p>
          </div>
          <div className="gauges">
            <Gauge
              label="Saving"
              value={activeStrategy.savingPercentage}
              color="#5b4bff"
            />
            <Gauge label="Needs" value={activeStrategy.needsPercentage} color="#2fd6ff" />
            <Gauge label="Wants" value={activeStrategy.wantsPercentage} color="#ff7d6b" />
          </div>
        </Card>
      ) : (
        <EmptyState
          title="Aucune stratégie active"
          description="Crée une stratégie pour guider ton mois."
          actionLabel="Créer"
          onAction={() => openModal()}
        />
      )}

      <Card className="strategy-compare">
        <h3>Prévu vs réel</h3>
        <div className="compare-grid">
          <div>
            <p className="muted">Revenus du mois</p>
            <h4>{formatCurrency(totalIncome)}</h4>
          </div>
          <div>
            <p className="muted">Dépenses du mois</p>
            <h4>{formatCurrency(totalExpenses)}</h4>
          </div>
          <div>
            <p className="muted">Taux d'utilisation</p>
            <h4>{Math.round(spendingRatio)}%</h4>
          </div>
        </div>
        <ProgressBar value={spendingRatio} variant={spendingRatio > 80 ? 'warning' : 'success'} />
      </Card>

      {strategies.length > 0 && (
        <div className="strategy-list">
          {strategies.map((strategy) => (
            <Card key={strategy.id} className="strategy-item">
              <div>
                <h4>{strategy.name}</h4>
                <p>
                  {strategy.savingPercentage}% / {strategy.needsPercentage}% / {strategy.wantsPercentage}%
                </p>
              </div>
              <div className="row-actions">
                <Button variant="ghost" onClick={() => openModal(strategy)}>
                  Modifier
                </Button>
                <Button 
                  variant={strategy.isActive ? 'ghost' : 'outline'} 
                  onClick={() => strategy.isActive ? deactivate(strategy.id) : activate(strategy.id)}
                >
                  {strategy.isActive ? 'Désactiver' : 'Activer'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Modifier la stratégie' : 'Nouvelle stratégie'}
        actions={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>{editing ? 'Mettre à jour' : 'Créer'}</Button>
          </>
        }
      >
        <div className="form-grid">
          <Input
            label="Nom"
            name="name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          />
          <Input
            label="Saving %"
            name="savingPercentage"
            type="number"
            value={form.savingPercentage}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, savingPercentage: event.target.value }))
            }
          />
          <Input
            label="Needs %"
            name="needsPercentage"
            type="number"
            value={form.needsPercentage}
            onChange={(event) => setForm((prev) => ({ ...prev, needsPercentage: event.target.value }))}
          />
          <Input
            label="Wants %"
            name="wantsPercentage"
            type="number"
            value={form.wantsPercentage}
            onChange={(event) => setForm((prev) => ({ ...prev, wantsPercentage: event.target.value }))}
          />
        </div>
      </Modal>
    </div>
  )
}

export default Strategy
