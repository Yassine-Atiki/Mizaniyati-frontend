import { useCallback, useMemo } from 'react'
import * as strategyApi from '../api/strategyApi'
import { useAsync } from './useAsync'
import { useAuth } from './useAuth'
import { demoStrategies } from '../utils/demoData'

export const useStrategies = () => {
  const { isDemo } = useAuth()
  const { data, setData, loading, error, execute } = useAsync(strategyApi.fetchStrategies)
  const demoData = useMemo(() => demoStrategies, [])

  const activeStrategy = useMemo(
    () => (isDemo ? demoData : data || []).find((strategy) => strategy.isActive),
    [data, demoData, isDemo],
  )

  const create = useCallback(
    async (payload) => {
      const created = await strategyApi.createStrategy(payload)
      setData((prev) => [created, ...prev])
      return created
    },
    [setData],
  )

  const update = useCallback(
    async (id, payload) => {
      const updated = await strategyApi.updateStrategy(id, payload)
      setData((prev) => prev.map((item) => (item.id === id ? updated : item)))
      return updated
    },
    [setData],
  )

  const activate = useCallback(
    async (id) => {
      const updated = await strategyApi.setActiveStrategy(id)
      setData((prev) =>
        prev.map((item) => ({ ...item, isActive: item.id === id })),
      )
      return updated
    },
    [setData],
  )

  if (isDemo) {
    return {
      strategies: demoData,
      activeStrategy,
      loading: false,
      error: null,
      refresh: () => {},
      create: async () => {},
      update: async () => {},
      activate: async () => {},
    }
  }

  return {
    strategies: data || [],
    activeStrategy,
    loading,
    error,
    refresh: execute,
    create,
    update,
    activate,
  }
}
