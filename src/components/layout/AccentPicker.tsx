import { useState, useRef, useEffect } from 'react'
import { Palette } from 'lucide-react'
import { useResumeStore } from '@/store/useResumeStore'
import type { TemplateId } from '@/types/resume'

// Default accent per template (matches original design)
const DEFAULT_ACCENTS: Record<TemplateId, string> = {
  'modern-tech': '#4f46e5',
  'classic-executive': '#1e3a5f',
  'two-column-creative': '#0d9488',
  'ats-minimal': '#111827',
  'elegant-cream': '#5d40cc',
}

const PRESETS = [
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Blue', value: '#2563eb' },
  { name: 'Sky', value: '#0284c7' },
  { name: 'Teal', value: '#0d9488' },
  { name: 'Emerald', value: '#059669' },
  { name: 'Amber', value: '#d97706' },
  { name: 'Rose', value: '#e11d48' },
  { name: 'Violet', value: '#7c3aed' },
  { name: 'Fuchsia', value: '#c026d3' },
  { name: 'Slate', value: '#475569' },
  { name: 'Navy', value: '#1e3a5f' },
  { name: 'Black', value: '#111827' },
]

export function getAccentForTemplate(
  id: TemplateId,
  overrides: Partial<Record<TemplateId, string>>
): string {
  return overrides[id] ?? DEFAULT_ACCENTS[id]
}

export function AccentPicker() {
  const activeTemplate = useResumeStore((s) => s.activeTemplate)
  const accents = useResumeStore((s) => s.templateAccents)
  const setAccent = useResumeStore((s) => s.setTemplateAccent)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Modern Tech, Creative Pro, and Elegant Cream support custom accent
  const supported =
    activeTemplate === 'modern-tech' ||
    activeTemplate === 'two-column-creative' ||
    activeTemplate === 'elegant-cream'
  const current = getAccentForTemplate(activeTemplate, accents)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  if (!supported) return null

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        title="Pick accent color"
        className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
      >
        <Palette size={13} />
        <div className="h-4 w-4 rounded-full ring-2 ring-slate-200 dark:ring-slate-600" style={{ background: current }} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-60 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 shadow-xl">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Accent color
          </p>
          <div className="grid grid-cols-6 gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.value}
                onClick={() => { setAccent(activeTemplate, p.value); setOpen(false) }}
                title={p.name}
                className={`h-7 w-7 rounded-md ring-2 transition-transform hover:scale-110 ${
                  current.toLowerCase() === p.value.toLowerCase() ? 'ring-offset-2 ring-slate-400 dark:ring-offset-slate-800' : 'ring-transparent'
                }`}
                style={{ background: p.value }}
              />
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 block">
              Custom
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={current}
                onChange={(e) => setAccent(activeTemplate, e.target.value)}
                className="h-8 w-10 cursor-pointer rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700"
              />
              <input
                type="text"
                value={current}
                onChange={(e) => {
                  const v = e.target.value
                  if (/^#[0-9a-f]{0,6}$/i.test(v)) setAccent(activeTemplate, v)
                }}
                className="flex-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-2 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
