interface StatBarProps {
  label: string
  value: number
  color: string
}

export function StatBar({ label, value, color }: StatBarProps) {
  return (
    <div className="stat-row">
      <div className="stat-label"><span>{label}</span><strong>{value}</strong></div>
      <div className="stat-track" aria-label={`${label} ${value}`}>
        <span style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  )
}
