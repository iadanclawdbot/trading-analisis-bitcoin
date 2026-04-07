import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { MainPanel } from './MainPanel'
import { BottomPanels } from './BottomPanels'
import { usePanelLayout } from '../../hooks/usePanelLayout'

export function AppShell() {
  const { layout, expandPanel } = usePanelLayout()

  return (
    <div className="flex flex-col h-full bg-btc-bg">
      {/* Header: 64px */}
      <Header />

      {/* Body: resto del espacio */}
      <div className="flex flex-1 min-h-0">
        {/* Columna principal */}
        <div className="flex-1 flex flex-col min-w-0 gap-px">
          {/* Panel principal: 55% */}
          <div className="flex-[55] min-h-0">
            <MainPanel panelId={layout.mainPanel} />
          </div>

          {/* Separador */}
          <div className="h-px bg-btc-border flex-shrink-0" />

          {/* Paneles inferiores: 45% */}
          <div className="flex-[45] min-h-0">
            <BottomPanels panels={layout.bottomPanels} onExpand={expandPanel} />
          </div>
        </div>

        {/* Sidebar: 300px fijo */}
        <div className="w-[300px] flex-shrink-0 min-h-0">
          <Sidebar />
        </div>
      </div>
    </div>
  )
}
