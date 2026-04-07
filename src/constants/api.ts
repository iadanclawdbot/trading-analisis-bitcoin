export const COINGECKO_BASE = 'https://api.coingecko.com/api/v3'
export const HISTORY_ENDPOINT = `${COINGECKO_BASE}/coins/bitcoin/market_chart?vs_currency=usd&days=365&interval=daily`
export const PRICE_ENDPOINT = `${COINGECKO_BASE}/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true`

export const CACHE_KEY_HISTORY = 'btc_history_v2'
export const CACHE_KEY_PRICE = 'btc_price_v2'
export const HISTORY_CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutos
export const PRICE_POLL_INTERVAL_MS = 60 * 1000 // 60 segundos
export const HISTORY_POLL_INTERVAL_MS = 5 * 60 * 1000 // 5 minutos

export const FETCH_TIMEOUT_MS = 10_000
export const MAX_RETRIES = 2
export const RETRY_DELAY_MS = 1000
