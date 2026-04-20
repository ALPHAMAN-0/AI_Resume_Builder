import { User, Briefcase, Code2, Zap, GraduationCap, Award } from 'lucide-react'
import { useResumeStore } from '@/store/useResumeStore'
import { PersonalInfoStep } from './steps/PersonalInfoStep'
import { ExperienceStep } from './steps/ExperienceStep'
import { ProjectsStep } from './steps/ProjectsStep'
import { SkillsStep } from './steps/SkillsStep'
import { EducationStep } from './steps/EducationStep'
import { CertificationsStep } from './steps/CertificationsStep'

const STEPS = [
  { id: 0, label: 'Personal', icon: User, component: PersonalInfoStep },
  { id: 1, label: 'Experience', icon: Briefcase, component: ExperienceStep },
  { id: 2, label: 'Projects', icon: Code2, component: ProjectsStep },
  { id: 3, label: 'Skills', icon: Zap, component: SkillsStep },
  { id: 4, label: 'Education', icon: GraduationCap, component: EducationStep },
  { id: 5, label: 'Certifications', icon: Award, component: CertificationsStep },
]

export function FormWizard() {
  const currentStep = useResumeStore((s) => s.currentStep)
  const goToStep = useResumeStore((s) => s.goToStep)
  const nextStep = useResumeStore((s) => s.nextStep)
  const prevStep = useResumeStore((s) => s.prevStep)

  const ActiveStep = STEPS[currentStep].component

  return (
    <div className="flex h-full flex-col">
      {/* Step tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-4">
        {STEPS.map((step) => {
          const Icon = step.icon
          const active = step.id === currentStep
          const done = step.id < currentStep
          return (
            <button
              key={step.id}
              onClick={() => goToStep(step.id)}
              className={`flex flex-1 flex-col items-center gap-1 pb-3 text-xs font-medium transition-colors border-b-2 ${
                active
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : done
                    ? 'border-transparent text-slate-400 dark:text-slate-500'
                    : 'border-transparent text-slate-300 dark:text-slate-600'
              }`}
            >
              <Icon size={16} />
              <span className="hidden sm:block">{step.label}</span>
            </button>
          )
        })}
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto p-5 bg-slate-50 dark:bg-slate-900">
        <ActiveStep />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-3">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30"
        >
          ← Previous
        </button>
        <span className="text-xs text-slate-400 dark:text-slate-500">{currentStep + 1} / {STEPS.length}</span>
        <button
          onClick={nextStep}
          disabled={currentStep === STEPS.length - 1}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-30"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
