import { NavLink } from 'react-router-dom'
import {
  LayoutGrid,
  Wallet,
  TrendingUp,
  Layers,
  Target,
  Shapes,
  LogOut,
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import ConfirmDialog from '../ui/ConfirmDialog'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/expenses', label: 'Dépenses', icon: Wallet },
  { to: '/income', label: 'Revenus', icon: TrendingUp },
  { to: '/budget', label: 'Budgets', icon: Layers },
  { to: '/strategy', label: 'Stratégie', icon: Target },
  { to: '/categories', label: 'Catégories', icon: Shapes },
]

const Sidebar = () => {
  const { logout, user } = useAuth()
  const [logoutOpen, setLogoutOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    setLogoutOpen(false)
  }

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ')
  const emailFallback = user?.email ? user.email.split('@')[0] : ''
  const displayName = fullName || user?.username || emailFallback || 'Invité'

  return (
    <aside className="sidebar">
      <div>
        <div className="logo">
          <span>M</span>
          <div>
            <h1>Mizaniyati</h1>
            <p>Budget Studio</p>
          </div>
        </div>
        <nav>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="sidebar-footer">
        <div className="user-card">
          <div>
            <span>{displayName}</span>
            <small>{user?.email || 'guest@mizaniyati.app'}</small>
          </div>
        </div>
        <button type="button" onClick={() => setLogoutOpen(true)} className="logout">
          <LogOut size={16} />
          Se déconnecter
        </button>
      </div>
      <ConfirmDialog
        open={logoutOpen}
        title="Confirmer la déconnexion"
        message="Tu vas être déconnecté de ta session actuelle."
        confirmLabel="Se déconnecter"
        onConfirm={handleLogout}
        onCancel={() => setLogoutOpen(false)}
      />
    </aside>
  )
}

export default Sidebar
