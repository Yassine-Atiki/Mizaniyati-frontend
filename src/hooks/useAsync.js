import { useCallback, useEffect, useState } from 'react'

export const useAsync = (asyncFn, immediate = true) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)

  const execute = useCallback(
    async (...args) => {
      setLoading(true)
      setError(null)
      try {
        const response = await asyncFn(...args)
        setData(response)
        return response
      } catch (err) {
        setError(err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [asyncFn],
  )

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { data, setData, loading, error, execute }
}
