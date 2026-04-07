interface Props {
  label?: string
}

export function LoadingSpinner({ label = 'Cargando datos...' }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3">
      <div className="relative">
        <div className="w-8 h-8 border-2 border-btc-border-2 border-t-btc-orange animate-spin" />
      </div>
      <span className="text-xs font-mono text-btc-muted tracking-widest uppercase">{label}</span>
    </div>
  )
}
