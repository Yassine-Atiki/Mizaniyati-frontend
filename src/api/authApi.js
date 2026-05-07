import apiClient from './axios'

export const login = async (payload) => {
  const { data } = await apiClient.post('/auth/login', payload)
  return data
}

export const getProfile = async () => {
  const { data } = await apiClient.get('/auth/me')
  return data
}
