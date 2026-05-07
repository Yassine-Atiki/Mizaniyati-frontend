import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'

const Layout = () => {
  const [quickOpen, setQuickOpen] = useState(false)
  const shellRef = useRef(null)
  const { pathname } = useLocation()
  const pageTone = pathname.split('/')[1] || 'dashboard'

  useEffect(() => {
    const shell = shellRef.current
    if (!shell) return undefined

    const updateGlow = (event) => {
      const rect = shell.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      shell.style.setProperty('--cursor-x', `${x}px`)
      shell.style.setProperty('--cursor-y', `${y}px`)
    }

    const clearGlow = () => {
      shell.style.setProperty('--cursor-x', '-999px')
      shell.style.setProperty('--cursor-y', '-999px')
    }

    shell.addEventListener('pointermove', updateGlow)
    shell.addEventListener('pointerleave', clearGlow)
    return () => {
      shell.removeEventListener('pointermove', updateGlow)
      shell.removeEventListener('pointerleave', clearGlow)
    }
  }, [])

  return (
    <div className="app-shell" ref={shellRef}>
      <span className="cursor-glow" aria-hidden="true" />
      <Sidebar />
      <main className="main">
        <Navbar onQuickAdd={() => setQuickOpen(true)} />
        <section className={`page page-${pageTone}`}>
          <Outlet />
        </section>
      </main>
      <Modal
        open={quickOpen}
        onClose={() => setQuickOpen(false)}
        title="Nouvelle transaction rapide"
        actions={
          <>
            <Button variant="ghost" onClick={() => setQuickOpen(false)}>
              Annuler
            </Button>
            <Button>Enregistrer</Button>
          </>
        }
      >
        <div className="form-grid">
          <Input label="Montant" placeholder="1200" />
          <Input label="Type" placeholder="Dépense" />
          <Input label="Catégorie" placeholder="Maison" />
          <Input label="Date" type="date" />
        </div>
      </Modal>
    </div>
  )
}

export default Layout
