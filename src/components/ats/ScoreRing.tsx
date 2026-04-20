interface Props { score: number; grade: string }

const GRADE_COLORS: Record<string, string> = {
  A: '#22c55e', B: '#84cc16', C: '#f59e0b', D: '#f97316', F: '#ef4444'
}

export function ScoreRing({ score, grade }: Props) {
  const r = 36
  const circumference = 2 * Math.PI * r
  const offset = circumference - (score / 100) * circumference
  const color = GRADE_COLORS[grade] || '#6366f1'

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={90} height={90} viewBox="0 0 90 90">
          <circle cx={45} cy={45} r={r} fill="none" stroke="#e2e8f0" strokeWidth={7} />
          <circle
            cx={45} cy={45} r={r}
            fill="none"
            stroke={color}
            strokeWidth={7}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 45 45)"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-xl font-bold text-slate-800">{score}</p>
          <p className="text-xs text-slate-500">/ 100</p>
        </div>
      </div>
      <div className="mt-1 flex items-center gap-1.5">
        <span className="text-sm font-bold" style={{ color }}>Grade {grade}</span>
      </div>
    </div>
  )
}
