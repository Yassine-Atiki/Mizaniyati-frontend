import { useState } from 'react'
import { Plus, Trash2, Pencil } from 'lucide-react'
import SectionHeader from '../components/ui/SectionHeader'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Input from '../components/ui/Input'
import EmptyState from '../components/ui/EmptyState'
import { useCategories } from '../hooks/useCategories'

const defaultForm = {
  name: '',
  colorCode: '#5b4bff',
  icon: 'Sparkles',
}

const Categories = () => {
  const { categories, loading, error, create, update, remove } = useCategories()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(defaultForm)
  const [categoryToDelete, setCategoryToDelete] = useState(null)

  const openModal = (category = null) => {
    setEditing(category)
    setForm(category ? category : defaultForm)
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    if (editing) {
      await update(editing.id, form)
    } else {
      await create(form)
    }
    setModalOpen(false)
  }

  const handleDelete = async () => {
    if (!categoryToDelete) return
    await remove(categoryToDelete.id)
    setCategoryToDelete(null)
  }

  return (
    <div className="page-stack">
      <SectionHeader
        title="Catégories"
        subtitle="Ton univers de dépenses"
        action={
          <Button onClick={() => openModal()}>
            <Plus size={16} />
            Nouvelle catégorie
          </Button>
        }
      />

      {error && <p className="error">Erreur lors du chargement des catégories.</p>}
      {loading ? (
        <p className="muted">Chargement…</p>
      ) : categories.length ? (
        <div className="category-grid">
          {categories.map((category) => (
            <Card key={category.id} className="category-card">
              <div className="category-main">
                <div className="category-badge" style={{ background: category.colorCode }}>
                  <span>{category.name?.slice(0, 1)?.toUpperCase() || '•'}</span>
                </div>
                <div>
                  <h3>{category.name}</h3>
                  <p>{category.colorCode}</p>
                </div>
              </div>
              <div className="row-actions">
                <Button variant="ghost" onClick={() => openModal(category)}>
                  <Pencil size={14} />
                </Button>
                <Button variant="ghost" onClick={() => setCategoryToDelete(category)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Aucune catégorie"
          description="Crée des catégories personnalisées pour mieux suivre." 
          actionLabel="Créer"
          onAction={() => openModal()}
        />
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
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
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          />
          <Input
            label="Couleur"
            type="color"
            value={form.colorCode}
            onChange={(event) => setForm((prev) => ({ ...prev, colorCode: event.target.value }))}
          />
          <Input
            label="Icône"
            value={form.icon}
            onChange={(event) => setForm((prev) => ({ ...prev, icon: event.target.value }))}
          />
        </div>
      </Modal>
      <ConfirmDialog
        open={Boolean(categoryToDelete)}
        title="Supprimer cette catégorie ?"
        message={`La catégorie "${categoryToDelete?.name || ''}" sera retirée.`}
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        onCancel={() => setCategoryToDelete(null)}
      />
    </div>
  )
}

export default Categories
