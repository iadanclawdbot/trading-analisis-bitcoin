import { useState } from 'react'
import { HelpCircle } from 'lucide-react'
import { Modal } from '../shared/Modal'
import { EDUCATIONAL_CONTENT } from './content'

interface Props {
  panelId: string
}

export function WhatIsThisButton({ panelId }: Props) {
  const [open, setOpen] = useState(false)
  const content = EDUCATIONAL_CONTENT[panelId]

  if (!content) return null

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-1 text-btc-muted hover:text-btc-orange transition-colors flex items-center gap-1 text-xs font-mono"
        title="¿Qué es esto?"
      >
        <HelpCircle size={12} />
        <span className="hidden sm:inline">¿Qué es esto?</span>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={content.title}>
        <div className="space-y-4">
          {content.sections.map((section, i) => (
            <div key={i}>
              {section.heading && (
                <p className="text-btc-orange text-xs uppercase tracking-widest font-semibold mb-1">
                  {section.heading}
                </p>
              )}
              <p className="text-btc-muted text-sm leading-relaxed whitespace-pre-line">
                {section.text}
              </p>
            </div>
          ))}

          {content.disclaimer && (
            <div className="mt-4 p-3 border border-btc-red/30 bg-btc-red-dim/20">
              <p className="text-btc-red text-xs font-mono leading-relaxed">
                ⚠️ {content.disclaimer}
              </p>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}
