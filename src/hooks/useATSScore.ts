import { useMemo } from 'react'
import { useResumeStore } from '@/store/useResumeStore'
import { scoreResume } from '@/lib/atsScorer'

export function useATSScore() {
  const resumeData = useResumeStore((s) => s.resumeData)
  return useMemo(() => scoreResume(resumeData), [resumeData])
}
