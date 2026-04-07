import { ErrorBoundary } from './components/shared/ErrorBoundary'
import { DashboardProvider } from './context/DashboardProvider'
import { AppShell } from './components/layout/AppShell'

export default function App() {
  return (
    <ErrorBoundary label="App">
      <DashboardProvider>
        <AppShell />
      </DashboardProvider>
    </ErrorBoundary>
  )
}
