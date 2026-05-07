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
import { useIncome } from '../hooks/useIncome'
import { formatCurrency, formatDate } from '../utils/formatters'

const defaultForm = {
  source: '',
  amount: '',
  date: '',
  type: 'DYNAMIC',
  frequency: 'MONTHLY',
  isRecurring: false,
}

const Income = () => {
  const { income, loading, error, create, update, remove } = useIncome()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(defaultForm)
  const [filters, setFilters] = useState({ query: '' })
  const [incomeToDelete, setIncomeToDelete] = useState(null)

  const filtered = useMemo(
    () =>
      income.filter((item) =>
        item.source?.toLowerCase().includes(filters.query.toLowerCase()),
      ),
    [income, filters],
  )

  const openModal = (item = null) => {
    setEditing(item)
    setForm(
      item
        ? {
            source: item.source,
            amount: item.amount,
            date: item.date?.slice(0, 10) || '',
            type: item.type,
            frequency: item.frequency,
            isRecurring: item.isRecurring,
          }
        : defaultForm,
    )
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    const payload = { ...form, amount: Number(form.amount) }
    if (editing) {
      await update(editing.id, payload)
    } else {
      await create(payload)
    }
    setModalOpen(false)
  }

  const handleDelete = async () => {
    if (!incomeToDelete) return
    await remove(incomeToDelete.id)
    setIncomeToDelete(null)
  }

  return (
    <div className="page-stack">
      <SectionHeader
        title="Revenus"
        subtitle="Sources et récurrence"
        action={
          <Button onClick={() => openModal()}>
            <Plus size={16} />
            Nouveau revenu
          </Button>
        }
      />

      <div className="filters">
        <Input
          placeholder="Filtrer par source"
          value={filters.query}
          onChange={(event) => setFilters((prev) => ({ ...prev, query: event.target.value }))}
        />
      </div>

      {error && <p className="error">Erreur lors du chargement des revenus.</p>}
      {loading ? (
        <p className="muted">Chargement…</p>
      ) : filtered.length ? (
        <DataTable
          columns={['Source', 'Date', 'Montant', 'Type', 'Fréquence', 'Récurrent', 'Actions']}
          rows={filtered}
          renderRow={(item) => (
            <>
              <span>{item.source}</span>
              <span>{formatDate(item.date)}</span>
              <span>{formatCurrency(item.amount)}</span>
              <span>
                <Badge variant={item.type === 'FIXED' ? 'info' : 'warning'}>{item.type}</Badge>
              </span>
              <span>
                <Badge variant="success">{item.frequency}</Badge>
              </span>
              <span>{item.isRecurring ? 'Oui' : 'Non'}</span>
              <span className="row-actions">
                <Button variant="ghost" onClick={() => openModal(item)}>
                  <Pencil size={14} />
                </Button>
                <Button variant="ghost" onClick={() => setIncomeToDelete(item)}>
                  <Trash2 size={14} />
                </Button>
              </span>
            </>
          )}
        />
      ) : (
        <EmptyState
          title="Aucun revenu"
          description="Ajoute une source de revenu pour commencer."
          actionLabel="Ajouter"
          onAction={() => openModal()}
        />
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Modifier le revenu' : 'Nouveau revenu'}
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
            label="Source"
            value={form.source}
            onChange={(event) => setForm((prev) => ({ ...prev, source: event.target.value }))}
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
          <label className="input-field checkbox">
            <span>Récurrent</span>
            <input
              type="checkbox"
              checked={form.isRecurring}
              onChange={(event) => setForm((prev) => ({ ...prev, isRecurring: event.target.checked }))}
            />
          </label>
        </div>
      </Modal>
      <ConfirmDialog
        open={Boolean(incomeToDelete)}
        title="Supprimer ce revenu ?"
        message={`Le revenu "${incomeToDelete?.source || 'sans source'}" sera supprimé.`}
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        onCancel={() => setIncomeToDelete(null)}
      />
    </div>
  )
}

export default Income
