import { useCallback, useEffect, useRef, useState } from 'react'

export const useAsync = (asyncFn, immediate = true) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)
  const inFlightRef = useRef(false)
  const lastDataRef = useRef([])

  const execute = useCallback(
    async (...args) => {
      if (inFlightRef.current) {
        return lastDataRef.current
      }
      inFlightRef.current = true
      setLoading(true)
      setError(null)
      try {
        const response = await asyncFn(...args)
        setData(response)
        lastDataRef.current = response
        return response
      } catch (err) {
        if (err?.response?.status === 404) {
          console.warn('API 404: ressource introuvable, retour d\'une liste vide.')
          setData([])
          lastDataRef.current = []
          setError(null)
          return []
        }
        setError(err)
        throw err
      } finally {
        inFlightRef.current = false
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
