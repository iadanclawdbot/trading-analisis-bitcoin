import type { PanelId } from '../../types'
import { PanelContainer } from './PanelContainer'
import { PowerLawPanel } from '../panels/PowerLawPanel'
import { ResidualsPanel } from '../panels/ResidualsPanel'
import { FourierPanel } from '../panels/FourierPanel'
import { MarketCyclesPanel } from '../panels/MarketCyclesPanel'

const PANEL_TITLES: Record<PanelId, string> = {
  'power-law': 'Ley de Potencia',
  'residuals': 'Residuos',
  'fourier': 'Fourier',
  'market-cycles': 'Ciclos',
}

function PanelContent({ panelId }: { panelId: PanelId }) {
  switch (panelId) {
    case 'power-law': return <PowerLawPanel />
    case 'residuals': return <ResidualsPanel />
    case 'fourier': return <FourierPanel />
    case 'market-cycles': return <MarketCyclesPanel />
  }
}

interface Props {
  panels: [PanelId, PanelId, PanelId]
  onExpand: (panelId: PanelId) => void
}

export function BottomPanels({ panels, onExpand }: Props) {
  return (
    <div className="grid grid-cols-3 h-full gap-px bg-btc-border">
      {panels.map((panelId) => (
        <PanelContainer
          key={panelId}
          panelId={panelId}
          title={PANEL_TITLES[panelId]}
          onExpand={() => onExpand(panelId)}
        >
          <PanelContent panelId={panelId} />
        </PanelContainer>
      ))}
    </div>
  )
}
