import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { register } from '../api/authApi'

const Signup = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await register(form)
      navigate('/login')
    } catch (err) {
      setError('Impossible de créer le compte. Vérifie tes informations.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="auth-hero">
          <span className="pill">Mizaniyati</span>
          <h1>Crée ton espace personnel.</h1>
          <p>Configure ton profil et commence à suivre tes finances.</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Prénom"
            value={form.firstName}
            onChange={handleChange('firstName')}
            placeholder="Yassine"
            required
          />
          <Input
            label="Nom"
            value={form.lastName}
            onChange={handleChange('lastName')}
            placeholder="Atiki"
            required
          />
          <Input
            label="Nom d'utilisateur"
            value={form.username}
            onChange={handleChange('username')}
            placeholder="Yassine"
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder="toi@exemple.com"
            required
          />
          <Input
            label="Mot de passe"
            type="password"
            value={form.password}
            onChange={handleChange('password')}
            placeholder="••••••••"
            required
          />
          {error && <p className="error">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? 'Création…' : 'Créer mon compte'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate('/login')}>
            J'ai déjà un compte
          </Button>
        </form>
      </motion.div>
    </div>
  )
}

export default Signup
