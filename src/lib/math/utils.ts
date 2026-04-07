export function nextPowerOf2(n: number): number {
  if (n <= 1) return 1
  return Math.pow(2, Math.ceil(Math.log2(n)))
}

export function log10(x: number): number {
  return Math.log(x) / Math.LN10
}

export function mean(arr: number[]): number {
  if (arr.length === 0) return 0
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

export function stdDev(arr: number[]): number {
  if (arr.length === 0) return 0
  const m = mean(arr)
  const variance = arr.reduce((acc, v) => acc + (v - m) ** 2, 0) / arr.length
  return Math.sqrt(variance)
}

export function lerp(a: number, b: number, t: number): number {
  const tc = Math.max(0, Math.min(1, t))
  return a + (b - a) * tc
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function formatPrice(price: number): string {
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(2)}M`
  if (price >= 1_000) return `$${(price / 1_000).toFixed(1)}K`
  if (price >= 1) return `$${price.toFixed(2)}`
  return `$${price.toFixed(4)}`
}

export function formatPriceShort(price: number): string {
  if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1)}M`
  if (price >= 1_000) return `${Math.round(price / 1_000)}K`
  return price.toFixed(2)
}

export function percentileRank(value: number, sorted: number[]): number {
  if (sorted.length === 0) return 50
  let lo = 0
  let hi = sorted.length
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (sorted[mid] < value) lo = mid + 1
    else hi = mid
  }
  return (lo / sorted.length) * 100
}

export function isFinitePositive(n: number): boolean {
  return isFinite(n) && !isNaN(n) && n > 0
}
