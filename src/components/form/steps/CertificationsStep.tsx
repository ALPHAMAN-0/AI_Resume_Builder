import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useResumeStore } from '@/store/useResumeStore'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { AddItemButton } from '@/components/shared/AddItemButton'
import { RemoveButton } from '@/components/shared/RemoveButton'
import type { Certification } from '@/types/resume'

const inputClass = "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"

function CertCard({ cert, index }: { cert: Certification; index: number }) {
  const [expanded, setExpanded] = useState(index === 0)
  const update = useResumeStore((s) => s.updateCertification)
  const remove = useResumeStore((s) => s.removeCertification)

  return (
    <div className="step-card">
      <div className="flex items-center gap-3 p-4">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-800 dark:text-slate-100 truncate">{cert.name || 'Certification Name'}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{cert.issuer || 'Issuing Organization'}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <RemoveButton onClick={() => remove(cert.id)} label="" />
          <button onClick={() => setExpanded(!expanded)} className="p-1 text-slate-400 hover:text-slate-700">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-4 border-t step-card-divider p-4">
          <div>
            <label className="mb-1 block field-label-sm">Certification Name</label>
            <input className={inputClass} placeholder="AWS Solutions Architect Professional" value={cert.name} onChange={(e) => update(cert.id, { name: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block field-label-sm">Issuing Organization</label>
            <input className={inputClass} placeholder="Amazon Web Services" value={cert.issuer} onChange={(e) => update(cert.id, { issuer: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block field-label-sm">Issue Date</label>
              <input type="month" className={inputClass} value={cert.issueDate} onChange={(e) => update(cert.id, { issueDate: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block field-label-sm">Expiry Date (if any)</label>
              <input type="month" className={inputClass} value={cert.expiryDate} onChange={(e) => update(cert.id, { expiryDate: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="mb-1 block field-label-sm">Credential ID (optional)</label>
            <input className={inputClass} placeholder="AWS-SAP-12345" value={cert.credentialId} onChange={(e) => update(cert.id, { credentialId: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block field-label-sm">Verification URL (optional)</label>
            <input className={inputClass} placeholder="aws.amazon.com/verify" value={cert.url} onChange={(e) => update(cert.id, { url: e.target.value })} />
          </div>
        </div>
      )}
    </div>
  )
}

export function CertificationsStep() {
  const certifications = useResumeStore((s) => s.resumeData.certifications)
  const addCertification = useResumeStore((s) => s.addCertification)

  return (
    <div>
      <SectionHeader title="Certifications" description="Cloud, security, and professional certifications strengthen tech resumes significantly." />
      <div className="space-y-3">
        {certifications.map((cert, i) => <CertCard key={cert.id} cert={cert} index={i} />)}
      </div>
      <AddItemButton label="Add Certification" onClick={addCertification} />
    </div>
  )
}
