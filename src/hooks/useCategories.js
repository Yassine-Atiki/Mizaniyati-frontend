import { useCallback, useMemo, useState } from 'react'
import * as categoryApi from '../api/categoryApi'
import { useAsync } from './useAsync'
import { useAuth } from './useAuth'
import { demoCategories } from '../utils/demoData'

export const useCategories = () => {
  const { isDemo } = useAuth()
  const { data, setData, loading, error, execute } = useAsync(categoryApi.fetchCategories)
  const demoData = useMemo(() => demoCategories, [])
  const [demoCategoriesState, setDemoCategoriesState] = useState(demoData)

  const create = useCallback(
    async (payload) => {
      const created = await categoryApi.createCategory(payload)
      setData((prev) => [created, ...prev])
      return created
    },
    [setData],
  )

  const update = useCallback(
    async (id, payload) => {
      const updated = await categoryApi.updateCategory(id, payload)
      setData((prev) => prev.map((item) => (item.id === id ? updated : item)))
      return updated
    },
    [setData],
  )

  const remove = useCallback(
    async (id) => {
      await categoryApi.deleteCategory(id)
      setData((prev) => prev.filter((item) => item.id !== id))
    },
    [setData],
  )

  if (isDemo) {
    return {
      categories: demoCategoriesState,
      loading: false,
      error: null,
      refresh: () => {},
      create: async (payload) => {
        const created = { id: `cat-demo-${Date.now()}`, ...payload }
        setDemoCategoriesState((prev) => [created, ...prev])
        return created
      },
      update: async (id, payload) => {
        setDemoCategoriesState((prev) =>
          prev.map((item) => (item.id === id ? { ...item, ...payload } : item)),
        )
      },
      remove: async (id) => {
        setDemoCategoriesState((prev) => prev.filter((item) => item.id !== id))
      },
    }
  }

  return { categories: data || [], loading, error, refresh: execute, create, update, remove }
}
