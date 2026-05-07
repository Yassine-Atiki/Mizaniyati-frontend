import apiClient from './axios'

export const fetchBudgets = async () => {
  const { data } = await apiClient.get('/budgets')
  return data
}

export const createBudget = async (payload) => {
  const { data } = await apiClient.post('/budgets', payload)
  return data
}

export const updateBudget = async (id, payload) => {
  const { data } = await apiClient.put(`/budgets/${id}`, payload)
  return data
}

export const deleteBudget = async (id) => {
  const { data } = await apiClient.delete(`/budgets/${id}`)
  return data
}
