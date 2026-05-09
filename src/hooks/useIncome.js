import { useCallback, useMemo } from 'react'
import * as incomeApi from '../api/incomeApi'
import { useAsync } from './useAsync'
import { useAuth } from './useAuth'
import { demoIncome } from '../utils/demoData'

export const useIncome = (filters = {}) => {
  const { isDemo } = useAuth()
  const filtersKey = useMemo(() => JSON.stringify(filters), [filters])
  const fetchIncome = useCallback(
    () => incomeApi.fetchIncome(filters),
    [filtersKey],
  )
  const { data, setData, loading, error, execute } = useAsync(fetchIncome)
  const demoData = useMemo(() => demoIncome, [])

  const create = useCallback(
    async (payload) => {
      const created = await incomeApi.createIncome(payload)
      setData((prev) => [created, ...prev])
      return created
    },
    [setData],
  )

  const update = useCallback(
    async (id, payload) => {
      const updated = await incomeApi.updateIncome(id, payload)
      setData((prev) => prev.map((item) => (item.id === id ? updated : item)))
      return updated
    },
    [setData],
  )

  const remove = useCallback(
    async (id) => {
      await incomeApi.deleteIncome(id)
      setData((prev) => prev.filter((item) => item.id !== id))
    },
    [setData],
  )

  if (isDemo) {
    return {
      income: demoData,
      loading: false,
      error: null,
      refresh: () => {},
      create: async () => {},
      update: async () => {},
      remove: async () => {},
    }
  }

  return { income: data || [], loading, error, refresh: execute, create, update, remove }
}
