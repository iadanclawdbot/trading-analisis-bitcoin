import { useState, useEffect, useCallback } from 'react'
import type { MergedDataPoint, DataStatus } from '../types'
import { BTC_HISTORICAL } from '../data/btc-historical'
import { fetch365DayHistory } from '../lib/data/coingecko'
import { mergeDataSources } from '../lib/data/merge'
import { cacheGet, cacheSet } from '../lib/data/cache'
import { CACHE_KEY_HISTORY, HISTORY_CACHE_TTL_MS, HISTORY_POLL_INTERVAL_MS } from '../constants/api'
import type { RawPricePoint } from '../types'

export interface UseBtcDataResult {
  data: MergedDataPoint[]
  status: DataStatus
  lastUpdated: Date | null
  error: string | null
}

export function useBtcData(): UseBtcDataResult {
  const [data, setData] = useState<MergedDataPoint[]>(() =>
    mergeDataSources(BTC_HISTORICAL, []),
  )
  const [status, setStatus] = useState<DataStatus>('partial')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchAndMerge = useCallback(async () => {
    try {
      // Intentar cache primero
      const cached = cacheGet<RawPricePoint[]>(CACHE_KEY_HISTORY, HISTORY_CACHE_TTL_MS)
      let livePoints: RawPricePoint[]

      if (cached) {
        livePoints = cached
      } else {
        livePoints = await fetch365DayHistory()
        cacheSet(CACHE_KEY_HISTORY, livePoints)
      }

      const merged = mergeDataSources(BTC_HISTORICAL, livePoints)
      setData(merged)
      setStatus('ready')
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      setError(msg)
      // Mantener datos bundled como fallback
      setStatus('partial')
    }
  }, [])

  useEffect(() => {
    fetchAndMerge()

    const interval = setInterval(fetchAndMerge, HISTORY_POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [fetchAndMerge])

  return { data, status, lastUpdated, error }
}
