import apiClient from './axios'

export const fetchExpenses = async (params = {}) => {
  const { data } = await apiClient.get('/expenses', { params })
  return data
}

export const createExpense = async (payload) => {
  const { data } = await apiClient.post('/expenses', payload)
  return data
}

export const updateExpense = async (id, payload) => {
  const { data } = await apiClient.put(`/expenses/${id}`, payload)
  return data
}

export const deleteExpense = async (id) => {
  const { data } = await apiClient.delete(`/expenses/${id}`)
  return data
}
