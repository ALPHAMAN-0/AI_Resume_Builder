import assert from 'node:assert/strict'
import { afterEach, beforeEach, describe, it, mock } from 'node:test'

// In-memory stand-in for the browser's localStorage. It must exist before the store
// module is evaluated (zustand's persist middleware grabs it then), hence the
// dynamic import below.
const storage = new Map()
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => void storage.set(key, value),
    removeItem: (key) => void storage.delete(key),
  },
})

const { useResumeStore } = await import('@/store/useResumeStore')

const STORAGE_KEY = 'ai-resume-builder-v1'
const state = () => useResumeStore.getState()

// Adds one experience entry per title, in order.
function seedExperience(...titles) {
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
  mock.method(Math, 'random', () => (++n + 0.5) / 1e6)
  useResumeStore.setState(useResumeStore.getInitialState(), true)
  storage.clear()
})

afterEach(() => {
  mock.restoreAll()
})

describe('useResumeStore', () => {
  it('adds, updates and removes entries by id', () => {
    seedExperience('Engineer', 'Manager')
    const [first, second] = state().resumeData.experience

    assert.notEqual(first.id, second.id)
    assert.deepEqual(
      { ...first, id: 'x' },
      { id: 'x', title: 'Engineer', company: '', location: '', startDate: '', endDate: '', current: false, bullets: [''], technologies: [] },
    )

    state().updateExperience(second.id, { company: 'Acme', current: true })
    state().removeExperience(first.id)

    const remaining = state().resumeData.experience
    assert.equal(remaining.length, 1)
    assert.deepEqual([remaining[0].id, remaining[0].title, remaining[0].company, remaining[0].current], [second.id, 'Manager', 'Acme', true])
  })

  it('reorders experience entries', () => {
    seedExperience('A', 'B', 'C')

    state().reorderExperience(0, 2)
    assert.deepEqual(experienceTitles(), ['B', 'C', 'A'])

    state().reorderExperience(2, 0)
    assert.deepEqual(experienceTitles(), ['A', 'B', 'C'])
  })

  // The indices come from drag-and-drop data, which any dragged text can supply.
  // An out-of-range index used to insert `undefined` into the persisted list.
  it('ignores reorder requests with out-of-range or non-integer indices', () => {
    seedExperience('A', 'B', 'C')

    for (const [from, to] of [[7, 0], [0, 7], [-1, 0], [0, -1], [NaN, 1], [1.5, 0]]) {
      state().reorderExperience(from, to)

      assert.ok(state().resumeData.experience.every(Boolean), `${from} -> ${to}`)
      assert.deepEqual(experienceTitles(), ['A', 'B', 'C'], `${from} -> ${to}`)
    }
  })

  it('keeps the wizard step within its six steps', () => {
    state().prevStep()
    assert.equal(state().currentStep, 0)

    for (let i = 0; i < 10; i++) state().nextStep()
    assert.equal(state().currentStep, 5)
  })

  it('persists resume data and preferences only', () => {
    state().setPersonalInfo({ fullName: 'Ada Lovelace' })
    state().setTemplateAccent('modern-tech', '#112233')
    state().setJobDescription('Confidential job description')
    state().goToStep(3)

    const persisted = JSON.parse(storage.get(STORAGE_KEY))

    assert.deepEqual(Object.keys(persisted.state).sort(), ['activeTemplate', 'resumeData', 'templateAccents', 'theme'])
    assert.equal(persisted.state.resumeData.personalInfo.fullName, 'Ada Lovelace')
    assert.deepEqual(persisted.state.templateAccents, { 'modern-tech': '#112233' })
  })
})
