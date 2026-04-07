import { ErrorBoundary } from '../shared/ErrorBoundary'
import { FourierChart } from '../charts/FourierChart'
import { useDashboard } from '../../context/DashboardContext'
import { LoadingSpinner } from '../shared/LoadingSpinner'

function periodLabel(days: number): string {
  if (days > 300) return `${(days / 365).toFixed(1)}a`
  if (days > 30) return `${Math.round(days / 30)}m`
  return `${Math.round(days)}d`
}

export function FourierPanel() {
  const { fourierResult, fourier } = useDashboard()

  if (!fourierResult) return <LoadingSpinner label="Ejecutando análisis de Fourier..." />

  const { topComponents, enabledBins, toggleBin, enableAll, disableAll } = fourier

  return (
    <ErrorBoundary label="Análisis Fourier">
      <div className="w-full h-full flex flex-col">
        {/* Controles de armónicos */}
        <div className="flex-shrink-0 px-2 py-1.5 border-b border-btc-border">
          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={enableAll}
              className="text-xs font-mono px-2 py-0.5 border border-btc-border-2 text-btc-muted hover:text-btc-text hover:border-btc-muted transition-colors"
            >
              Todas
            </button>
            <button
              onClick={disableAll}
              className="text-xs font-mono px-2 py-0.5 border border-btc-border-2 text-btc-muted hover:text-btc-text hover:border-btc-muted transition-colors"
            >
              Ninguna
            </button>
            {topComponents.map((c) => {
              const active = enabledBins.has(c.bin)
              return (
                <button
                  key={c.bin}
                  onClick={() => toggleBin(c.bin)}
                  className="text-xs font-mono px-2 py-0.5 border transition-all"
                  style={{
                    borderColor: active ? c.color + '80' : '#334155',
                    color: active ? c.color : '#94a3b8',
                    backgroundColor: active ? c.color + '15' : 'transparent',
                  }}
                  title={`${c.label} · ${periodLabel(c.periodDays)}`}
                >
                  {c.label === 'Fundamental' ? 'Fund.' : c.label.replace('Armónico ', 'A')}
                  {' '}
                  <span className="opacity-70">{periodLabel(c.periodDays)}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Grafico */}
        <div className="flex-1 min-h-0">
          <FourierChart />
        </div>
      </div>
    </ErrorBoundary>
  )
}
