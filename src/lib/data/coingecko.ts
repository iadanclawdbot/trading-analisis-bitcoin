import { HISTORY_ENDPOINT, PRICE_ENDPOINT, FETCH_TIMEOUT_MS, MAX_RETRIES, RETRY_DELAY_MS } from '../../constants/api'
import type { CoinGeckoMarketChart, CurrentPriceData, RawPricePoint } from '../../types'

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { signal: controller.signal })
    return res
  } finally {
    clearTimeout(id)
  }
}

async function fetchWithRetry(url: string): Promise<Response> {
  let lastError: Error | null = null
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * attempt))
    }
    try {
      const res = await fetchWithTimeout(url, FETCH_TIMEOUT_MS)
      if (res.status === 429) {
        // Rate limit — esperar mas
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * 3))
        continue
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
    }
  }
  throw lastError ?? new Error('Fetch fallido')
}

export async function fetch365DayHistory(): Promise<RawPricePoint[]> {
  const res = await fetchWithRetry(HISTORY_ENDPOINT)
  const data: CoinGeckoMarketChart = await res.json()
  return data.prices.map(([ts, price]) => [ts, price] as RawPricePoint)
}

export async function fetchCurrentPrice(): Promise<CurrentPriceData> {
  const res = await fetchWithRetry(PRICE_ENDPOINT)
  const data = await res.json()
  const btc = data.bitcoin
  return {
    price: btc.usd as number,
    change24h: (btc.usd_24h_change as number) ?? null,
    timestamp: Date.now(),
  }
}
