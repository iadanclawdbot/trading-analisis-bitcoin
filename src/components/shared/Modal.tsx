import { useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function Modal({ open, onClose, title, children }: Props) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, handleKeyDown])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-btc-bg/80 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative z-10 bg-btc-surface border border-btc-border-2 p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-mono font-semibold text-btc-text uppercase tracking-widest">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-btc-muted hover:text-btc-text transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Content */}
        <div className="text-sm font-mono text-btc-muted leading-relaxed">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
