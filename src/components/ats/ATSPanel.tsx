import { ChevronDown, ChevronUp, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react'
import { useATSScore } from '@/hooks/useATSScore'
import { useResumeStore } from '@/store/useResumeStore'
import { ScoreRing } from './ScoreRing'

export function ATSPanel() {
  const result = useATSScore()
  const expanded = useResumeStore((s) => s.atsExpanded)
  const toggleAts = useResumeStore((s) => s.toggleAts)

  const categories = Object.values(result.categories)

  return (
    <div className="flex flex-col border-t border-slate-100 bg-white">
      {/* Header */}
      <button onClick={toggleAts} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50">
        <div className="flex items-center gap-2">
          <TrendingUp size={15} className="text-brand-500" />
          <span className="text-sm font-semibold text-slate-700">ATS Score</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${result.grade === 'A' ? 'bg-green-100 text-green-700' : result.grade === 'B' ? 'bg-lime-100 text-lime-700' : result.grade === 'C' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
            {result.totalScore}/100
          </span>
        </div>
        {expanded ? <ChevronDown size={15} className="text-slate-400" /> : <ChevronUp size={15} className="text-slate-400" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Score ring */}
          <div className="flex justify-center pt-2">
            <ScoreRing score={result.totalScore} grade={result.grade} />
          </div>

          {/* Top suggestions */}
          {result.topSuggestions.length > 0 && (
            <div className="rounded-lg bg-amber-50 p-3 space-y-1.5">
              <p className="text-xs font-semibold text-amber-700 mb-1">Top Improvements</p>
              {result.topSuggestions.map((tip, i) => (
                <div key={i} className="flex gap-2 text-xs text-amber-700">
                  <AlertCircle size={12} className="shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          )}

          {/* Category breakdown */}
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1.5">
                    {cat.passed
                      ? <CheckCircle2 size={11} className="text-green-500" />
                      : <AlertCircle size={11} className="text-amber-400" />}
                    <span className="text-xs text-slate-600">{cat.name}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-700">{cat.score}/{cat.maxScore}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(cat.score / cat.maxScore) * 100}%`,
                      background: cat.passed ? '#22c55e' : cat.score / cat.maxScore > 0.5 ? '#f59e0b' : '#ef4444',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
