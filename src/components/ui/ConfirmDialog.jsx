import Modal from './Modal'
import Button from './Button'

const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  onConfirm,
  onCancel,
  confirmVariant = 'danger',
}) => (
  <Modal
    open={open}
    onClose={onCancel}
    title={title}
    actions={
      <>
        <Button variant="ghost" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </>
    }
  >
    <p className="muted">{message}</p>
  </Modal>
)

export default ConfirmDialog
