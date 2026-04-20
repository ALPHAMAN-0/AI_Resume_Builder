import { useRef, useState } from 'react'
import { Upload, X, Camera } from 'lucide-react'
import { useResumeStore } from '@/store/useResumeStore'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { fileToResizedDataUrl } from '@/lib/imageUtils'

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="field-label">{label}</label>
      {children}
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  )
}

const inputClass = "rounded-lg border border-slate-200 px-3 py-2.5 text-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"

function PhotoUploader() {
  const photo = useResumeStore((s) => s.resumeData.personalInfo.photo)
  const setPersonalInfo = useResumeStore((s) => s.setPersonalInfo)
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    setError(null)
    try {
      const dataUrl = await fileToResizedDataUrl(file, 400, 0.85)
      setPersonalInfo({ photo: dataUrl })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const remove = () => setPersonalInfo({ photo: '' })

  return (
    <div className="flex items-center gap-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        {photo ? (
          <img src={photo} alt="Profile" className="h-full w-full object-cover" />
        ) : (
          <Camera size={24} className="text-slate-300 dark:text-slate-600" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="field-label">Profile Photo</p>
        <p className="field-hint mb-2">Used by the Elegant Cream template. Square photos look best.</p>
        <div className="flex flex-wrap gap-2">
          <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700 disabled:opacity-60"
          >
            <Upload size={12} />
            {busy ? 'Uploading…' : photo ? 'Replace' : 'Upload'}
          </button>
          {photo && (
            <button
              type="button"
              onClick={remove}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <X size={12} /> Remove
            </button>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      </div>
    </div>
  )
}

export function PersonalInfoStep() {
  const info = useResumeStore((s) => s.resumeData.personalInfo)
  const setPersonalInfo = useResumeStore((s) => s.setPersonalInfo)

  const handle = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setPersonalInfo({ [field]: e.target.value })

  return (
    <div>
      <SectionHeader title="Personal Information" description="This appears at the top of your resume. Make it count." />
      <div className="space-y-4">
        <PhotoUploader />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Full Name">
            <input className={inputClass} placeholder="Alex Chen" value={info.fullName} onChange={handle('fullName')} />
          </Field>
          <Field label="Professional Title" hint="e.g. Senior Software Engineer">
            <input className={inputClass} placeholder="Senior Software Engineer" value={info.title} onChange={handle('title')} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Email">
            <input type="email" className={inputClass} placeholder="alex@email.com" value={info.email} onChange={handle('email')} />
          </Field>
          <Field label="Phone">
            <input type="tel" className={inputClass} placeholder="+1 (415) 555-0192" value={info.phone} onChange={handle('phone')} />
          </Field>
        </div>
        <Field label="Location" hint="City, State is enough — don't include street address">
          <input className={inputClass} placeholder="San Francisco, CA" value={info.location} onChange={handle('location')} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="LinkedIn URL">
            <input className={inputClass} placeholder="linkedin.com/in/yourname" value={info.linkedIn} onChange={handle('linkedIn')} />
          </Field>
          <Field label="GitHub URL">
            <input className={inputClass} placeholder="github.com/yourname" value={info.github} onChange={handle('github')} />
          </Field>
        </div>
        <Field label="Portfolio / Website">
          <input className={inputClass} placeholder="yoursite.dev" value={info.portfolio} onChange={handle('portfolio')} />
        </Field>
        <Field label="Professional Summary" hint="2–4 sentences. Mention your years of experience, key strengths, and what makes you unique. Aim for 100–500 characters.">
          <textarea
            className={`${inputClass} resize-none`}
            rows={4}
            placeholder="Senior Software Engineer with 6+ years of experience building scalable distributed systems..."
            value={info.summary}
            onChange={handle('summary')}
          />
          <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500">
            <span>{info.summary.length} chars</span>
            <span className={info.summary.length >= 100 && info.summary.length <= 500 ? 'text-green-500' : 'text-amber-500'}>
              {info.summary.length < 100 ? `${100 - info.summary.length} more to reach minimum` : info.summary.length > 500 ? 'Consider shortening' : 'Good length'}
            </span>
          </div>
        </Field>
      </div>
    </div>
  )
}
