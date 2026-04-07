import { ErrorBoundary } from '../shared/ErrorBoundary'
import { ResidualsChart } from '../charts/ResidualsChart'
import { useDashboard } from '../../context/DashboardContext'
import { LoadingSpinner } from '../shared/LoadingSpinner'
import { COLORS } from '../../constants/theme'

export function ResidualsPanel() {
  const { residuals } = useDashboard()

  if (!residuals) return <LoadingSpinner label="Calculando residuos..." />

  const z = residuals.currentZScore
  const zColor = z < -1 ? COLORS.green : z > 1 ? COLORS.red : COLORS.muted

  return (
    <ErrorBoundary label="Residuos">
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center gap-3 px-3 py-1.5 border-b border-btc-border flex-shrink-0">
          <span className="text-xs font-mono text-btc-muted">Z-Score actual:</span>
          <span className="text-sm font-mono font-bold tabular-nums" style={{ color: zColor }}>
            {z.toFixed(3)}
          </span>
          <span className="text-xs font-mono text-btc-muted">
            P{residuals.percentile.toFixed(0)}
          </span>
        </div>
        <div className="flex-1 min-h-0">
          <ResidualsChart />
        </div>
      </div>
    </ErrorBoundary>
  )
}
