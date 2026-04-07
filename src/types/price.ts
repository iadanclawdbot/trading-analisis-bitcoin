export type RawPricePoint = [number, number] // [timestamp_ms, price_usd]

export interface MergedDataPoint {
  timestamp: number
  date: string // 'YYYY-MM-DD'
  dayIndex: number // dias desde genesis (2009-01-03)
  price: number // USD
  source: 'bundled' | 'live' | 'current'
}

export interface CoinGeckoMarketChart {
  prices: [number, number][] // [timestamp_ms, price]
}

export interface CurrentPriceData {
  price: number
  change24h: number | null
  timestamp: number
}
