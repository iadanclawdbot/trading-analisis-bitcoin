interface CacheEntry<T> {
  data: T
  timestamp: number
  version: number
}

const CACHE_VERSION = 2

export function cacheSet<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      version: CACHE_VERSION,
    }
    localStorage.setItem(key, JSON.stringify(entry))
  } catch {
    // localStorage lleno o deshabilitado
  }
}

export function cacheGet<T>(key: string, ttlMs: number): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const entry: CacheEntry<T> = JSON.parse(raw)
    if (entry.version !== CACHE_VERSION) return null
    if (Date.now() - entry.timestamp > ttlMs) return null
    return entry.data
  } catch {
    return null
  }
}

export function cacheInvalidate(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    // ignorar
  }
}
