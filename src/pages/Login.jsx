import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'

const Login = () => {
  const navigate = useNavigate()
  const { login, demoLogin, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login({ email, password })
      navigate('/dashboard')
    } catch (err) {
      setError('Identifiants invalides. Réessaie avec tes accès.')
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
          <h1>Reprends le contrôle de ton budget.</h1>
          <p>
            Une expérience premium pour visualiser, ajuster et dominer tes
            dépenses.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="toi@exemple.com"
            required
          />
          <Input
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            required
          />
          {error && <p className="error">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? 'Connexion…' : 'Entrer dans Mizaniyati'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              demoLogin()
              navigate('/dashboard')
            }}
          >
            Entrer en mode démo
          </Button>
          <p className="muted">
            Le mode démo simule un compte sans backend. Parfait pour explorer
            l’interface.
          </p>
        </form>
      </motion.div>
    </div>
  )
}

export default Login
