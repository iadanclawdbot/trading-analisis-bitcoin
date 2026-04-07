interface Props {
  label: string
  color?: 'green' | 'red' | 'orange' | 'blue' | 'muted'
  size?: 'sm' | 'md'
}

const COLOR_MAP = {
  green: 'bg-btc-green-dim text-btc-green border-btc-green/30',
  red: 'bg-btc-red-dim text-btc-red border-btc-red/30',
  orange: 'bg-btc-orange-dim text-btc-orange border-btc-orange/30',
  blue: 'bg-btc-blue-dim text-btc-blue border-btc-blue/30',
  muted: 'bg-btc-surface-2 text-btc-muted border-btc-border-2',
}

export function Badge({ label, color = 'muted', size = 'sm' }: Props) {
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'
  return (
    <span
      className={`inline-flex items-center font-mono font-semibold uppercase tracking-widest border ${sizeClass} ${COLOR_MAP[color]}`}
    >
      {label}
    </span>
  )
}
