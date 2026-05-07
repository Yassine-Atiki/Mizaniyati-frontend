import { AnimatePresence, motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import Button from './Button'

const Modal = ({ open, onClose, title, children, actions }) => {
  const content = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <header>
              <div>
                <p className="eyebrow">Mizaniyati</p>
                <h3>{title}</h3>
              </div>
              <Button variant="ghost" onClick={onClose}>
                Fermer
              </Button>
            </header>
            <div className="modal-content">{children}</div>
            {actions && <div className="modal-actions">{actions}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return createPortal(content, document.body)
}

export default Modal
