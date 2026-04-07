import { ErrorBoundary } from '../shared/ErrorBoundary'
import { CyclesTimeline } from '../charts/CyclesTimeline'

export function MarketCyclesPanel() {
  return (
    <ErrorBoundary label="Ciclos de Mercado">
      <CyclesTimeline />
    </ErrorBoundary>
  )
}
