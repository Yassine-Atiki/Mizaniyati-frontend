import { useCallback, useMemo } from 'react'
import * as expenseApi from '../api/expenseApi'
import { useAsync } from './useAsync'
import { useAuth } from './useAuth'
import { demoExpenses } from '../utils/demoData'

export const useExpenses = (filters = {}) => {
  const { isDemo } = useAuth()
  const { data, setData, loading, error, execute } = useAsync(() => expenseApi.fetchExpenses(filters))
  const demoData = useMemo(() => demoExpenses, [])

  const create = useCallback(
    async (payload) => {
      const created = await expenseApi.createExpense(payload)
      setData((prev) => [created, ...prev])
      return created
    },
    [setData],
  )

  const update = useCallback(
    async (id, payload) => {
      const updated = await expenseApi.updateExpense(id, payload)
      setData((prev) => prev.map((item) => (item.id === id ? updated : item)))
      return updated
    },
    [setData],
  )

  const remove = useCallback(
    async (id) => {
      await expenseApi.deleteExpense(id)
      setData((prev) => prev.filter((item) => item.id !== id))
    },
    [setData],
  )

  if (isDemo) {
    return {
      expenses: demoData,
      loading: false,
      error: null,
      refresh: () => {},
      create: async () => {},
      update: async () => {},
      remove: async () => {},
    }
  }

  return { expenses: data || [], loading, error, refresh: execute, create, update, remove }
}
