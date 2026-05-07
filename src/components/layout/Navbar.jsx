import { Search, Bell, Plus } from 'lucide-react'
import Button from '../ui/Button'

const Navbar = ({ onQuickAdd }) => (
  <header className="navbar">
    <div className="search">
      <Search size={18} />
      <input placeholder="Rechercher une transaction, catégorie…" />
    </div>
    <div className="nav-actions">
      <Button variant="ghost" onClick={onQuickAdd}>
        <Plus size={16} />
        Quick add
      </Button>
      <button type="button" className="icon-btn">
        <Bell size={18} />
      </button>
    </div>
  </header>
)

export default Navbar
