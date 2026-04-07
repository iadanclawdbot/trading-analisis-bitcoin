import { useState, useEffect } from 'react'
import type { CurrentPriceData } from '../types'
import { fetchCurrentPrice } from '../lib/data/coingecko'
import { PRICE_POLL_INTERVAL_MS } from '../constants/api'

export function useCurrentPrice(): CurrentPriceData | null {
  const [priceData, setPriceData] = useState<CurrentPriceData | null>(null)

  useEffect(() => {
    let mounted = true

    async function poll() {
      try {
        const data = await fetchCurrentPrice()
        if (mounted) setPriceData(data)
      } catch {
        // ignorar errores de polling — mantener ultimo precio
      }
    }

    poll()
    const interval = setInterval(poll, PRICE_POLL_INTERVAL_MS)
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  return priceData
}
