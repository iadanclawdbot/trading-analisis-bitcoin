import type { MergedDataPoint, RawPricePoint } from '../../types'
import { daysSinceGenesis, dateKeyFromTimestamp } from '../../constants/bitcoin'

export function mergeDataSources(
  bundled: RawPricePoint[],
  live: RawPricePoint[],
): MergedDataPoint[] {
  const map = new Map<string, MergedDataPoint>()

  // Primero bundled
  for (const [ts, price] of bundled) {
    if (price <= 0) continue
    const key = dateKeyFromTimestamp(ts)
    const dayIndex = daysSinceGenesis(ts)
    if (dayIndex < 0) continue
    map.set(key, { timestamp: ts, date: key, dayIndex, price, source: 'bundled' })
  }

  // Live sobreescribe overlaps (datos mas frescos)
  for (const [ts, price] of live) {
    if (price <= 0) continue
    const key = dateKeyFromTimestamp(ts)
    const dayIndex = daysSinceGenesis(ts)
    if (dayIndex < 0) continue
    map.set(key, { timestamp: ts, date: key, dayIndex, price, source: 'live' })
  }

  // Ordenar por timestamp
  return Array.from(map.values()).sort((a, b) => a.timestamp - b.timestamp)
}

export function updateCurrentPrice(
  data: MergedDataPoint[],
  price: number,
  timestamp: number,
): MergedDataPoint[] {
  const key = dateKeyFromTimestamp(timestamp)
  const dayIndex = daysSinceGenesis(timestamp)
  if (dayIndex < 0) return data

  const lastKey = data.length > 0 ? data[data.length - 1].date : ''
  const newPoint: MergedDataPoint = {
    timestamp,
    date: key,
    dayIndex,
    price,
    source: 'current',
  }

  if (lastKey === key) {
    // Reemplazar ultimo punto del dia
    return [...data.slice(0, -1), newPoint]
  } else {
    return [...data, newPoint]
  }
}
