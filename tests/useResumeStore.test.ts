import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useResumeStore } from '@/store/useResumeStore'

// In-memory stand-in for the browser's localStorage. vi.hoisted runs this before
// the store module is evaluated, which is when zustand's persist middleware grabs it.
const storage = vi.hoisted(() => {
  const data = new Map<string, string>()
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
  })
  return data
})

const STORAGE_KEY = 'ai-resume-builder-v1'
const state = () => useResumeStore.getState()

// Adds one experience entry per title, in order.
function seedExperience(...titles: string[]): void {
  for (const title of titles) {
    state().addExperience()
    const { experience } = state().resumeData
    state().updateExperience(experience[experience.length - 1].id, { title })
  }
}
const experienceTitles = () => state().resumeData.experience.map((e) => e.title)

beforeEach(() => {
  // generateId() is Math.random based — make it a predictable sequence.
  let n = 0
  vi.spyOn(Math, 'random').mockImplementation(() => (++n + 0.5) / 1e6)
  useResumeStore.setState(useResumeStore.getInitialState(), true)
  storage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useResumeStore', () => {
  it('adds, updates and removes entries by id', () => {
    seedExperience('Engineer', 'Manager')
    const [first, second] = state().resumeData.experience

    expect(first.id).not.toBe(second.id)
    expect(first).toMatchObject({ title: 'Engineer', company: '', current: false, bullets: [''], technologies: [] })

    state().updateExperience(second.id, { company: 'Acme', current: true })
    state().removeExperience(first.id)

    expect(state().resumeData.experience).toHaveLength(1)
    expect(state().resumeData.experience[0]).toMatchObject({ id: second.id, title: 'Manager', company: 'Acme', current: true })
  })

  it('reorders experience entries', () => {
    seedExperience('A', 'B', 'C')

    state().reorderExperience(0, 2)
    expect(experienceTitles()).toEqual(['B', 'C', 'A'])

    state().reorderExperience(2, 0)
    expect(experienceTitles()).toEqual(['A', 'B', 'C'])
  })

  it('keeps the wizard step within its six steps', () => {
    state().prevStep()
    expect(state().currentStep).toBe(0)

    for (let i = 0; i < 10; i++) state().nextStep()
    expect(state().currentStep).toBe(5)
  })

  it('persists resume data and preferences only', () => {
    state().setPersonalInfo({ fullName: 'Ada Lovelace' })
    state().setTemplateAccent('modern-tech', '#112233')
    state().setJobDescription('Confidential job description')
    state().goToStep(3)

    const persisted = JSON.parse(storage.get(STORAGE_KEY)!)

    expect(Object.keys(persisted.state).sort()).toEqual(['activeTemplate', 'resumeData', 'templateAccents', 'theme'])
    expect(persisted.state.resumeData.personalInfo.fullName).toBe('Ada Lovelace')
    expect(persisted.state.templateAccents).toEqual({ 'modern-tech': '#112233' })
  })
})
