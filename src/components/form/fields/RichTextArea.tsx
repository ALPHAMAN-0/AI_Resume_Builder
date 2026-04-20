import { useRef, KeyboardEvent } from 'react'
import { Lightbulb } from 'lucide-react'
import { ACTION_VERBS, WEAK_PHRASES, STRONG_VERB_SUGGESTIONS } from '@/constants/actionVerbs'

interface Props {
  bullets: string[]
  onChange: (bullets: string[]) => void
  placeholder?: string
}

function getWeakPhrase(bullet: string): string | null {
  const lower = bullet.toLowerCase().trim()
  for (const phrase of WEAK_PHRASES) {
    if (lower.startsWith(phrase)) return phrase
  }
  return null
}

function startsWithActionVerb(bullet: string): boolean {
  const firstWord = bullet.trim().toLowerCase().split(/\s+/)[0]
  return ACTION_VERBS.has(firstWord)
}

function hasMetric(bullet: string): boolean {
  return /\d/.test(bullet)
}

export function RichTextArea({ bullets, onChange, placeholder }: Props) {
  const refs = useRef<(HTMLTextAreaElement | null)[]>([])

  const update = (index: number, value: string) => {
    const updated = [...bullets]
    updated[index] = value
    onChange(updated)
  }

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const updated = [...bullets]
      updated.splice(index + 1, 0, '')
      onChange(updated)
      setTimeout(() => refs.current[index + 1]?.focus(), 0)
    } else if (e.key === 'Backspace' && bullets[index] === '' && bullets.length > 1) {
      e.preventDefault()
      const updated = bullets.filter((_, i) => i !== index)
      onChange(updated)
      setTimeout(() => refs.current[Math.max(0, index - 1)]?.focus(), 0)
    }
  }

  return (
    <div className="space-y-1.5">
      {bullets.map((bullet, i) => {
        const weak = getWeakPhrase(bullet)
        const noVerb = bullet.trim().length > 5 && !startsWithActionVerb(bullet) && !weak
        const noMetric = bullet.trim().length > 20 && !hasMetric(bullet)
        const suggestions = weak ? STRONG_VERB_SUGGESTIONS[weak] : null

        return (
          <div key={i} className="group relative">
            <div className="flex items-start gap-2">
              <span className="mt-2.5 text-slate-300 select-none">•</span>
              <textarea
                ref={(el) => { refs.current[i] = el }}
                value={bullet}
                onChange={(e) => update(i, e.target.value)}
                onKeyDown={(e) => handleKey(e, i)}
                placeholder={i === 0 && placeholder ? placeholder : 'Add an achievement...'}
                rows={1}
                className="flex-1 resize-none rounded border-none bg-transparent py-2 text-sm text-slate-700 outline-none placeholder:text-slate-300"
                style={{ minHeight: '36px' }}
              />
            </div>

            {/* Weak phrase warning */}
            {weak && suggestions && (
              <div className="ml-5 mt-0.5 flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-700">
                <Lightbulb size={11} className="shrink-0" />
                <span>Try: {suggestions.map((s) => <button key={s} onClick={() => update(i, bullet.replace(new RegExp(`^${weak}`, 'i'), s))} className="font-medium underline mr-1 hover:text-amber-900">{s}</button>)}</span>
              </div>
            )}

            {/* No action verb hint */}
            {noVerb && !weak && (
              <p className="ml-5 mt-0.5 text-xs text-orange-400">Start with an action verb (e.g., "Built", "Reduced", "Led")</p>
            )}

            {/* No metric hint */}
            {noMetric && !noVerb && !weak && (
              <p className="ml-5 mt-0.5 text-xs text-blue-400">Add a number or metric to strengthen this bullet</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
