import { useCallback, useMemo, useState } from 'react'
import * as budgetApi from '../api/budgetApi'
import { useAsync } from './useAsync'
import { useAuth } from './useAuth'
import { demoBudgets, demoCategories } from '../utils/demoData'

export const useBudgets = () => {
  const { isDemo } = useAuth()
  const { data, setData, loading, error, execute } = useAsync(budgetApi.fetchBudgets)
  const demoData = useMemo(() => demoBudgets, [])
  const [demoBudgetsState, setDemoBudgetsState] = useState(demoData)

  const create = useCallback(
    async (payload) => {
      const created = await budgetApi.createBudget(payload)
      setData((prev) => [created, ...prev])
      return created
    },
    [setData],
  )

  const update = useCallback(
    async (id, payload) => {
      const updated = await budgetApi.updateBudget(id, payload)
      setData((prev) => prev.map((item) => (item.id === id ? updated : item)))
      return updated
    },
    [setData],
  )

  const remove = useCallback(
    async (id) => {
      await budgetApi.deleteBudget(id)
      setData((prev) => prev.filter((item) => item.id !== id))
    },
    [setData],
  )

  if (isDemo) {
    return {
      budgets: demoBudgetsState,
      loading: false,
      error: null,
      refresh: () => {},
      create: async (payload) => {
        const category = demoCategories.find((item) => item.id === payload.categoryId)
        const created = {
          id: `bud-demo-${Date.now()}`,
          spentAmount: 0,
          ...payload,
          category,
        }
        setDemoBudgetsState((prev) => [created, ...prev])
        return created
      },
      update: async (id, payload) => {
        setDemoBudgetsState((prev) =>
          prev.map((item) => {
            if (item.id !== id) return item
            const category = demoCategories.find((entry) => entry.id === payload.categoryId)
            return { ...item, ...payload, category: category || item.category }
          }),
        )
      },
      remove: async (id) => {
        setDemoBudgetsState((prev) => prev.filter((item) => item.id !== id))
      },
    }
  }

  return { budgets: data || [], loading, error, refresh: execute, create, update, remove }
}
