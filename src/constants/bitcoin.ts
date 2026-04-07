export const GENESIS_DATE = '2009-01-03'
export const GENESIS_TIMESTAMP = new Date(GENESIS_DATE).getTime()

export const DAY_MS = 86_400_000
export const REGRESSION_MIN_DAY = 200 // filtrar primeros 200 dias

export const HALVINGS: { date: string; label: string }[] = [
  { date: '2012-11-28', label: 'Halving 1' },
  { date: '2016-07-09', label: 'Halving 2' },
  { date: '2020-05-11', label: 'Halving 3' },
  { date: '2024-04-20', label: 'Halving 4' },
]

export const BUBBLE_PEAKS: { date: string; price: number }[] = [
  { date: '2011-06-08', price: 31.9 },
  { date: '2013-11-29', price: 1147 },
  { date: '2017-12-17', price: 19783 },
  { date: '2021-11-10', price: 69000 },
]

export const BEAR_BOTTOMS: { date: string; price: number }[] = [
  { date: '2011-11-18', price: 2.01 },
  { date: '2015-01-14', price: 178 },
  { date: '2018-12-15', price: 3236 },
  { date: '2022-11-21', price: 15787 },
]

export function daysSinceGenesis(timestamp: number): number {
  return Math.floor((timestamp - GENESIS_TIMESTAMP) / DAY_MS)
}

export function timestampFromDayIndex(dayIndex: number): number {
  return GENESIS_TIMESTAMP + dayIndex * DAY_MS
}

export function dateKeyFromTimestamp(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10)
}
