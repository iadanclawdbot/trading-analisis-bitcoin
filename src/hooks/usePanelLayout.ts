import { useState, useCallback } from 'react'
import type { PanelId, PanelLayout } from '../types'

const DEFAULT_LAYOUT: PanelLayout = {
  mainPanel: 'power-law',
  bottomPanels: ['residuals', 'fourier', 'market-cycles'],
}

export function usePanelLayout() {
  const [layout, setLayout] = useState<PanelLayout>(DEFAULT_LAYOUT)

  const expandPanel = useCallback((panelId: PanelId) => {
    setLayout((prev) => {
      if (prev.mainPanel === panelId) return DEFAULT_LAYOUT // toggle: volver al default

      const bottomIndex = prev.bottomPanels.indexOf(panelId)
      if (bottomIndex === -1) return prev

      const newBottom = [...prev.bottomPanels] as [PanelId, PanelId, PanelId]
      newBottom[bottomIndex] = prev.mainPanel

      return { mainPanel: panelId, bottomPanels: newBottom }
    })
  }, [])

  return { layout, expandPanel }
}
