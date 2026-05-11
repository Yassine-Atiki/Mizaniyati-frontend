import apiClient from './axios'

export const fetchStrategies = async () => {
  const { data } = await apiClient.get('/budget-strategies')
  return data
}

export const createStrategy = async (payload) => {
  const { data } = await apiClient.post('/budget-strategies', payload)
  return data
}

export const updateStrategy = async (id, payload) => {
  const { data } = await apiClient.put(`/budget-strategies/${id}`, payload)
  return data
}

export const setActiveStrategy = async (id) => {
  const { data } = await apiClient.patch(`/budget-strategies/${id}/activate`)
  return data
}

export const deactivateStrategy = async (id) => {
  const { data } = await apiClient.patch(`/budget-strategies/${id}/deactivate`)
  return data
}
