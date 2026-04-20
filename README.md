# ResumeAI Pro

A professional resume builder for high-tech job seekers. Build a recruiter-ready resume, score it against ATS systems, match it to job descriptions, and export to PDF — all in the browser, no backend, no account required.

Live: `https://alphaman-0.github.io/AI_Resume_Builder/` (after GitHub Pages is enabled)

---

## Features

### 📝 Six-step form wizard
Personal Info → Experience → Projects → Skills → Education → Certifications.
- Drag-and-drop reorder for experience entries
- Inline hints: weak phrases like "Responsible for" trigger suggestions ("Led", "Built", "Architected")
- Bullets with no numbers are flagged to prompt quantifiable metrics
- Character counter on the professional summary with sweet-spot feedback (100–500 chars)

### 🎨 Four professional templates
| Template | Style | Best for |
|---|---|---|
| **Modern Tech** | Indigo header, 2-column, tech pill badges | SWE, DevOps, Platform |
| **Classic Executive** | Serif typography, single-column, formal | EM, Director, VP, PM |
| **Creative Pro** | Colored sidebar, bold hierarchy | Startups, design-adjacent roles |
| **ATS Optimized** | Zero graphics, plain text | FAANG, enterprise ATS |

Switch instantly via the TopBar — live preview updates in real time.

### 🎨 Custom accent colors
Modern Tech and Creative Pro support **12 preset colors** + **custom hex picker**. Each template remembers its own color independently. Persisted across sessions.

### 🌙 Light & Dark mode
Full dark mode for the app UI (form, sidebar, ATS panel). The resume preview stays light on purpose — resumes are always viewed/printed on white. Preference saved to localStorage.

### 📊 Real-time ATS scoring
A score from 0–100 (Grade A–F) with six weighted categories:
- **Contact Info** (15 pts) — email, phone, LinkedIn, GitHub, location
- **Section Coverage** (20 pts) — all major sections filled, summary at sweet-spot length
- **Action Verbs** (20 pts) — % of bullets starting with strong verbs from a 150-verb bank
- **Quantified Results** (20 pts) — % of bullets with numbers/%/$/multipliers
- **Keyword Match** (15 pts) — role-specific bank (SWE, Data, ML, DevOps, Security, PM)
- **Format & Length** (10 pts) — date consistency, bullet count, page length heuristics

Shows a honesty disclaimer: "Heuristic — not a guarantee that every ATS will parse your resume."

### 🎯 Job Description matcher
Paste a job description and get:
- **Match %** — keyword overlap with your resume
- **Missing keywords** ranked by frequency in the JD
- Multi-word phrase detection (e.g. "machine learning", "system design")
- Noise word filtering (the, and, you, your, etc.)

### 📄 PDF export
- **ATS Optimized template** uses a **native text-layer PDF** (via `jsPDF.text()`) — real text that Workday/Greenhouse/Lever can parse
- Other templates use **html2canvas + jsPDF** with smart page-break detection that scans the canvas for whitespace rows and avoids slicing text across pages
- Fonts awaited before capture (`document.fonts.ready`) so no fallback-font mismatch
- 3× scale for sharp rendering
- Filename: `{FullName}_Resume_{YYYY-MM-DD}.pdf`

### 💾 Data portability
- **Auto-save** to localStorage on every keystroke
- **JSON export** — download your resume as a structured JSON backup
- **JSON import** — restore from any previous export
- **Load Demo** button to see a sample Senior SWE resume instantly

### ⌨️ Keyboard shortcuts
- `Cmd/Ctrl + P` → Download PDF

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | **React 18 + Vite + TypeScript** |
| Styling | **Tailwind CSS v3** (with `darkMode: 'class'`) |
| State | **Zustand** + `persist` middleware (localStorage) |
| Icons | **Lucide React** |
| PDF | **html2canvas** (visual templates) + **jsPDF** (ATS + page assembly) |
| Fonts | **Inter**, **Playfair Display**, **JetBrains Mono** via Google Fonts |

**No backend.** Everything runs client-side. Your resume data never leaves the browser.

---

## Project structure

```
src/
├── main.tsx
├── App.tsx
├── index.css
├── types/resume.ts              # All TypeScript interfaces
├── store/useResumeStore.ts      # Zustand store (data + UI state)
├── lib/
│   ├── atsScorer.ts             # Pure scoring function (6 categories)
│   ├── jdMatcher.ts             # Job description keyword overlap
│   ├── atsPdfExport.ts          # Native text-layer PDF for ATS template
│   ├── pdfExport.ts             # html2canvas PDF for visual templates
│   ├── jsonPortability.ts       # Import/export resume as JSON
│   └── utils.ts                 # cn(), generateId(), formatDate()
├── constants/
│   ├── actionVerbs.ts           # 150+ tech action verbs + weak phrases
│   ├── atsKeywords.ts           # Role-specific keyword banks (80+ per role)
│   ├── templates.ts             # Template metadata
│   └── demoData.ts              # Sample resume data
├── hooks/
│   ├── useATSScore.ts
│   ├── useJDMatch.ts
│   └── usePDFExport.ts
└── components/
    ├── layout/
    │   ├── AppShell.tsx         # 3-column layout + dark mode orchestrator
    │   ├── TopBar.tsx           # Logo, templates, theme toggle, accent, export
    │   └── AccentPicker.tsx     # Color picker for Modern Tech / Creative Pro
    ├── form/
    │   ├── FormWizard.tsx       # Multi-step form orchestrator
    │   ├── steps/               # 6 step components
    │   └── fields/              # TagInput, RichTextArea, DateRangePicker
    ├── preview/
    │   ├── ResumePreview.tsx    # Live preview wrapper + hidden print root
    │   └── templates/           # 4 template components
    ├── ats/
    │   ├── ATSPanel.tsx         # Score ring, category breakdown, feedback
    │   ├── JDMatcher.tsx        # Paste JD → match %
    │   └── ScoreRing.tsx        # Animated SVG score circle
    └── shared/                  # SectionHeader, AddItemButton, RemoveButton
```

---

## Getting started

### Prerequisites
- Node.js 18+
- npm

### Install & run

```bash
git clone https://github.com/ALPHAMAN-0/AI_Resume_Builder.git
cd AI_Resume_Builder
npm install
npm run dev
```

Open `http://localhost:5173`.

### Build for production

```bash
npm run build
npm run preview
```

Output lands in `dist/`.

---

## Deploy to GitHub Pages

This repo ships with a GitHub Actions workflow at `.github/workflows/deploy.yml` that auto-deploys on every push to `main`.

**One-time setup:**

1. Go to **repo Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. Push to `main`

Site goes live at `https://<your-username>.github.io/AI_Resume_Builder/`.

The `base` path is set to `/AI_Resume_Builder/` in [vite.config.ts](vite.config.ts).

---

## Data model

Everything is typed in [src/types/resume.ts](src/types/resume.ts):

```typescript
interface ResumeData {
  personalInfo: PersonalInfo       // name, title, contact, summary
  experience: Role[]               // jobs with bullets + tech tags
  projects: Project[]              // name, description, bullets, repo/live URLs
  skills: Skill[]                  // name + level (beginner→expert) + category
  education: Education[]           // degree, institution, GPA, coursework
  certifications: Certification[]  // name, issuer, dates, credential ID
}
```

Auto-saved under `localStorage['ai-resume-builder-v1']`.

---

## Known limitations

Documented in the honest review — see [the plan file](../.claude/plans/i-want-to-build-bright-kazoo.md) if you have access:

- **ATS score is a heuristic.** Real ATS systems (Workday, Greenhouse, Lever, Taleo) all parse differently. The score is useful directional feedback, not a pass/fail guarantee.
- **Visual templates (Modern/Classic/Creative) produce image-based PDFs** via html2canvas. Only the **ATS Optimized** template produces a true text-layer PDF. If you need guaranteed ATS parseability, use that template.
- **No tests yet.** The scorer is a pure function and easily testable — Vitest setup is a welcome contribution.
- **Publications / Open-Source / Patents sections** aren't supported yet (relevant for research / ML / staff+ roles).

---

## Contributing

Open an issue before any major work. Quick wins welcome:
- Vitest setup + tests for the ATS scorer
- More role-specific keyword banks
- Additional templates
- Accessibility improvements (ARIA, keyboard nav)

---

## License

MIT
