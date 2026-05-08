import { BrowserRouter, Navigate, Route, Routes, Outlet } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Income from './pages/Income'
import Budget from './pages/Budget'
import Strategy from './pages/Strategy'
import Categories from './pages/Categories'
import './App.css'

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div className="loader">Chargement…</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/income" element={<Income />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/strategy" element={<Strategy />} />
            <Route path="/categories" element={<Categories />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
)

export default App
