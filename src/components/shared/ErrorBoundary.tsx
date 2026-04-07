import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  label?: string
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[ErrorBoundary ${this.props.label ?? ''}]`, error, info)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-btc-muted">
          <span className="text-btc-red text-xs font-mono uppercase tracking-widest mb-2">
            Error en {this.props.label ?? 'componente'}
          </span>
          <span className="text-xs font-mono text-btc-muted">
            {this.state.error?.message ?? 'Error desconocido'}
          </span>
        </div>
      )
    }
    return this.props.children
  }
}
