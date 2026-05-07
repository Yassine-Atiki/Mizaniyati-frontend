import apiClient from './axios'

export const fetchIncome = async (params = {}) => {
  const { data } = await apiClient.get('/income', { params })
  return data
}

export const createIncome = async (payload) => {
  const { data } = await apiClient.post('/income', payload)
  return data
}

export const updateIncome = async (id, payload) => {
  const { data } = await apiClient.put(`/income/${id}`, payload)
  return data
}

export const deleteIncome = async (id) => {
  const { data } = await apiClient.delete(`/income/${id}`)
  return data
}
