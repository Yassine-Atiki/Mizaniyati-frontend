import apiClient from './axios'

export const fetchCategories = async () => {
  const { data } = await apiClient.get('/categories')
  return data
}

export const createCategory = async (payload) => {
  const { data } = await apiClient.post('/categories', payload)
  return data
}

export const updateCategory = async (id, payload) => {
  const { data } = await apiClient.put(`/categories/${id}`, payload)
  return data
}

export const deleteCategory = async (id) => {
  const { data } = await apiClient.delete(`/categories/${id}`)
  return data
}
