import type { ReactNode } from 'react'
import { Maximize2 } from 'lucide-react'
import { WhatIsThisButton } from '../educational/WhatIsThisButton'
import type { PanelId } from '../../types'

interface Props {
  panelId: PanelId
  title: string
  children: ReactNode
  onExpand?: () => void
  isMain?: boolean
  indicator?: ReactNode
}

export function PanelContainer({ panelId, title, children, onExpand, isMain = false, indicator }: Props) {
  return (
    <div className="flex flex-col h-full bg-btc-surface border border-btc-border overflow-hidden group">
      {/* Title bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-btc-border bg-btc-surface-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-btc-muted uppercase tracking-widest">
            {title}
          </span>
          {indicator}
        </div>
        <div className="flex items-center gap-2">
          <WhatIsThisButton panelId={panelId} />
          {!isMain && onExpand && (
            <button
              onClick={onExpand}
              className="p-1 text-btc-border-2 hover:text-btc-orange transition-colors opacity-0 group-hover:opacity-100"
              title="Expandir"
            >
              <Maximize2 size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden min-h-0">{children}</div>
    </div>
  )
}
