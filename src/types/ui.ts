export type PanelId = 'power-law' | 'residuals' | 'fourier' | 'market-cycles'

export interface PanelLayout {
  mainPanel: PanelId
  bottomPanels: [PanelId, PanelId, PanelId]
}

export type DataStatus = 'loading' | 'partial' | 'ready' | 'error'

export interface ModalContent {
  title: string
  body: string
  disclaimer?: string
}
