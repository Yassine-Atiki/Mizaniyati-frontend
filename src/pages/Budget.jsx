import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import SectionHeader from '../components/ui/SectionHeader'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import ProgressBar from '../components/ui/ProgressBar'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import EmptyState from '../components/ui/EmptyState'
import { useBudgets } from '../hooks/useBudgets'
import { useCategories } from '../hooks/useCategories'
import { formatCurrency } from '../utils/formatters'
import { budgetStatus } from '../utils/theme'

const defaultForm = {
  categoryId: '',
  limitAmount: '',
  startDate: '',
  endDate: '',
}

const Budget = () => {
  const { budgets, loading, error, create, update, remove } = useBudgets()
  const { categories } = useCategories()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(defaultForm)
  const [budgetToDelete, setBudgetToDelete] = useState(null)

  const openModal = (budget = null) => {
    setEditing(budget)
    setForm(
      budget
        ? {
            categoryId: budget.category?.id || '',
            limitAmount: budget.limitAmount,
            startDate: budget.startDate?.slice(0, 10) || '',
            endDate: budget.endDate?.slice(0, 10) || '',
          }
        : defaultForm,
    )
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    const payload = { ...form, limitAmount: Number(form.limitAmount) }
    if (editing) {
      await update(editing.id, payload)
    } else {
      await create(payload)
    }
    setModalOpen(false)
  }

  const handleDelete = async () => {
    if (!budgetToDelete) return
    await remove(budgetToDelete.id)
    setBudgetToDelete(null)
  }

  return (
    <div className="page-stack">
      <SectionHeader
        title="Budgets"
        subtitle="Garde la main sur chaque catégorie"
        action={
          <Button onClick={() => openModal()}>
            <Plus size={16} />
            Nouveau budget
          </Button>
        }
      />

      {error && <p className="error">Erreur lors du chargement des budgets.</p>}
      {loading ? (
        <p className="muted">Chargement…</p>
      ) : budgets.length ? (
        <div className="budget-grid">
          {budgets.map((budget) => {
            const spent = Number(budget.spentAmount || 0)
            const limit = Number(budget.limitAmount || 1)
            const ratio = spent / limit
            const status = budgetStatus(ratio)

            return (
              <Card key={budget.id} className="budget-card">
                <div className="budget-head">
                  <div>
                    <h3>{budget.category?.name || 'Catégorie'}</h3>
                    <p>{formatCurrency(spent)} / {formatCurrency(limit)}</p>
                  </div>
                  <div className="row-actions">
                    <Button variant="ghost" onClick={() => openModal(budget)}>
                      <Pencil size={14} />
                    </Button>
                    <Button variant="ghost" onClick={() => setBudgetToDelete(budget)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
                <ProgressBar value={Math.min(ratio * 100, 100)} variant={status} />
                <p className={`budget-status ${status}`}>
                  {status === 'danger'
                    ? 'Budget dépassé'
                    : status === 'warning'
                    ? 'Proche du plafond'
                    : 'En règle'}
                </p>
              </Card>
            )
          })}
        </div>
      ) : (
        <EmptyState
          title="Aucun budget"
          description="Définis un budget pour chaque catégorie clé." 
          actionLabel="Créer"
          onAction={() => openModal()}
        />
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Modifier le budget' : 'Nouveau budget'}
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
          <label className="input-field">
            <span>Catégorie</span>
            <Select
              value={form.categoryId}
              onChange={(nextValue) => setForm((prev) => ({ ...prev, categoryId: nextValue }))}
              options={[
                { value: '', label: 'Choisir' },
                ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
              ]}
            />
          </label>
          <Input
            label="Limite"
            type="number"
            value={form.limitAmount}
            onChange={(event) => setForm((prev) => ({ ...prev, limitAmount: event.target.value }))}
          />
          <Input
            label="Début"
            type="date"
            value={form.startDate}
            onChange={(event) => setForm((prev) => ({ ...prev, startDate: event.target.value }))}
          />
          <Input
            label="Fin"
            type="date"
            value={form.endDate}
            onChange={(event) => setForm((prev) => ({ ...prev, endDate: event.target.value }))}
          />
        </div>
      </Modal>
      <ConfirmDialog
        open={Boolean(budgetToDelete)}
        title="Supprimer ce budget ?"
        message={`Le budget "${budgetToDelete?.category?.name || 'Catégorie'}" sera supprimé.`}
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        onCancel={() => setBudgetToDelete(null)}
      />
    </div>
  )
}

export default Budget
