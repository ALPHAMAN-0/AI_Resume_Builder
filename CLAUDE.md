# CLAUDE.md

## Commands
- Dev server: `npm run dev` (package.json)
- Build: `npm run build` (runs `tsc && vite build`) (package.json)
- Preview production build: `npm run preview` (package.json)

No test or lint script is defined in package.json.

## Rules
- Use the `@/` path alias for imports from `src/` — e.g. `import { AppShell } from '@/components/layout/AppShell'` (src/App.tsx:1)

## Read first
- src/types/resume.ts — the full data model (all TS interfaces)
- src/store/useResumeStore.ts — global state (Zustand + persist)
- README.md — feature overview, project structure, data model

Architecture: see ARCHITECTURE.md — read before structural changes
