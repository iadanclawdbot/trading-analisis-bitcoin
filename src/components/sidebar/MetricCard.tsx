interface Props {
  label: string
  value: string
  subValue?: string
  valueColor?: string
}

export function MetricCard({ label, value, subValue, valueColor }: Props) {
  return (
    <div className="px-3 py-3 border-b border-btc-border last:border-b-0">
      <p className="text-xs font-mono uppercase tracking-widest text-btc-muted mb-1">{label}</p>
      <p
        className="text-xl font-mono font-bold tabular-nums leading-none"
        style={{ color: valueColor ?? '#f8fafc' }}
      >
        {value}
      </p>
      {subValue && (
        <p className="text-xs font-mono text-btc-muted mt-1 tabular-nums">{subValue}</p>
      )}
    </div>
  )
}
