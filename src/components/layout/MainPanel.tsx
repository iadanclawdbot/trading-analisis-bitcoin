import type { PanelId } from '../../types'
import { PanelContainer } from './PanelContainer'
import { PowerLawPanel } from '../panels/PowerLawPanel'
import { ResidualsPanel } from '../panels/ResidualsPanel'
import { FourierPanel } from '../panels/FourierPanel'
import { MarketCyclesPanel } from '../panels/MarketCyclesPanel'

const PANEL_TITLES: Record<PanelId, string> = {
  'power-law': 'Ley de Potencia (Log-Log)',
  'residuals': 'Residuos y Z-Score',
  'fourier': 'Análisis de Fourier',
  'market-cycles': 'Ciclos de Mercado',
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
  panelId: PanelId
}

export function MainPanel({ panelId }: Props) {
  return (
    <PanelContainer panelId={panelId} title={PANEL_TITLES[panelId]} isMain>
      <PanelContent panelId={panelId} />
    </PanelContainer>
  )
}
