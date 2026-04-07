import { ErrorBoundary } from '../shared/ErrorBoundary'
import { PowerLawCanvas } from '../charts/PowerLawCanvas'
import { useDashboard } from '../../context/DashboardContext'
import { LoadingSpinner } from '../shared/LoadingSpinner'

export function PowerLawPanel() {
  const { data } = useDashboard()

  if (data.length === 0) return <LoadingSpinner label="Cargando datos históricos..." />

  return (
    <ErrorBoundary label="Power Law Chart">
      <div className="w-full h-full">
        <PowerLawCanvas />
      </div>
    </ErrorBoundary>
  )
}
