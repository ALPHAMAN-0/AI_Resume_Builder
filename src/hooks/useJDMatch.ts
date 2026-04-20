import { useMemo } from 'react'
import { useResumeStore } from '@/store/useResumeStore'
import { matchJobDescription } from '@/lib/jdMatcher'

export function useJDMatch() {
  const jd = useResumeStore((s) => s.jobDescription)
  const data = useResumeStore((s) => s.resumeData)
  return useMemo(() => matchJobDescription(jd, data), [jd, data])
}
