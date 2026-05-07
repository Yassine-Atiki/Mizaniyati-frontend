import { useMemo, useState } from 'react'
import { Plus, Trash2, Pencil } from 'lucide-react'
import SectionHeader from '../components/ui/SectionHeader'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import DataTable from '../components/ui/DataTable'
import EmptyState from '../components/ui/EmptyState'
import { useExpenses } from '../hooks/useExpenses'
import { useCategories } from '../hooks/useCategories'
import { formatCurrency, formatDate } from '../utils/formatters'

const defaultForm = {
  amount: '',
  date: '',
  description: '',
  type: 'DYNAMIC',
  frequency: 'MONTHLY',
  categoryId: '',
}

const Expenses = () => {
  const { expenses, loading, error, create, update, remove } = useExpenses()
  const { categories } = useCategories()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(defaultForm)
  const [filters, setFilters] = useState({ query: '', type: 'ALL' })
  const [expenseToDelete, setExpenseToDelete] = useState(null)

  const filtered = useMemo(() => {
    return expenses.filter((item) => {
      const matchesQuery = item.description
        ?.toLowerCase()
        .includes(filters.query.toLowerCase())
      const matchesType = filters.type === 'ALL' || item.type === filters.type
      return matchesQuery && matchesType
    })
  }, [expenses, filters])

  const openModal = (expense = null) => {
    setEditing(expense)
    setForm(
      expense
        ? {
            amount: expense.amount,
            date: expense.date?.slice(0, 10) || '',
            description: expense.description,
            type: expense.type,
            frequency: expense.frequency,
            categoryId: expense.category?.id || '',
          }
        : defaultForm,
    )
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    const payload = {
      ...form,
      amount: Number(form.amount),
      categoryId: form.categoryId || undefined,
    }
    if (editing) {
      await update(editing.id, payload)
    } else {
      await create(payload)
    }
    setModalOpen(false)
  }

  const handleDelete = async () => {
    if (!expenseToDelete) return
    await remove(expenseToDelete.id)
    setExpenseToDelete(null)
  }

  return (
    <div className="page-stack">
      <SectionHeader
        title="Dépenses"
        subtitle="Pilote ton cashflow"
        action={
          <Button onClick={() => openModal()}>
            <Plus size={16} />
            Nouvelle dépense
          </Button>
        }
      />

      <div className="filters">
        <Input
          placeholder="Filtrer par description"
          value={filters.query}
          onChange={(event) => setFilters((prev) => ({ ...prev, query: event.target.value }))}
        />
        <Select
          className="select-filter"
          value={filters.type}
          onChange={(nextValue) => setFilters((prev) => ({ ...prev, type: nextValue }))}
          options={[
            { value: 'ALL', label: 'Tous types' },
            { value: 'FIXED', label: 'Fixe' },
            { value: 'DYNAMIC', label: 'Variable' },
          ]}
        />
      </div>

      {error && <p className="error">Erreur lors du chargement des dépenses.</p>}
      {loading ? (
        <p className="muted">Chargement…</p>
      ) : filtered.length ? (
        <DataTable
          columns={[
            'Description',
            'Catégorie',
            'Date',
            'Montant',
            'Type',
            'Fréquence',
            'Actions',
          ]}
          rows={filtered}
          renderRow={(item) => (
            <>
              <span>{item.description}</span>
              <span>{item.category?.name || '—'}</span>
              <span>{formatDate(item.date)}</span>
              <span>{formatCurrency(item.amount)}</span>
              <span>
                <Badge variant={item.type === 'FIXED' ? 'info' : 'warning'}>{item.type}</Badge>
              </span>
              <span>
                <Badge variant="success">{item.frequency}</Badge>
              </span>
              <span className="row-actions">
                <Button variant="ghost" onClick={() => openModal(item)}>
                  <Pencil size={14} />
                </Button>
                <Button variant="ghost" onClick={() => setExpenseToDelete(item)}>
                  <Trash2 size={14} />
                </Button>
              </span>
            </>
          )}
        />
      ) : (
        <EmptyState
          title="Aucune dépense"
          description="Crée la première pour démarrer le suivi." 
          actionLabel="Ajouter"
          onAction={() => openModal()}
        />
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Modifier la dépense' : 'Nouvelle dépense'}
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
            label="Description"
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          />
          <Input
            label="Montant"
            type="number"
            value={form.amount}
            onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
          />
          <Input
            label="Date"
            type="date"
            value={form.date}
            onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
          />
          <label className="input-field">
            <span>Catégorie</span>
            <Select
              value={form.categoryId}
              onChange={(nextValue) => setForm((prev) => ({ ...prev, categoryId: nextValue }))}
              options={[
                { value: '', label: 'Aucune' },
                ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
              ]}
            />
          </label>
          <label className="input-field">
            <span>Type</span>
            <Select
              value={form.type}
              onChange={(nextValue) => setForm((prev) => ({ ...prev, type: nextValue }))}
              options={[
                { value: 'FIXED', label: 'Fixe' },
                { value: 'DYNAMIC', label: 'Variable' },
              ]}
            />
          </label>
          <label className="input-field">
            <span>Fréquence</span>
            <Select
              value={form.frequency}
              onChange={(nextValue) => setForm((prev) => ({ ...prev, frequency: nextValue }))}
              options={[
                { value: 'WEEKLY', label: 'Hebdo' },
                { value: 'MONTHLY', label: 'Mensuel' },
                { value: 'YEARLY', label: 'Annuel' },
              ]}
            />
          </label>
        </div>
      </Modal>
      <ConfirmDialog
        open={Boolean(expenseToDelete)}
        title="Supprimer cette dépense ?"
        message={`La dépense "${expenseToDelete?.description || 'sans titre'}" sera supprimée.`}
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        onCancel={() => setExpenseToDelete(null)}
      />
    </div>
  )
}

export default Expenses
