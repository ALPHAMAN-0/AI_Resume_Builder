export const ACTION_VERBS = new Set([
  // Engineering & Development
  'architected', 'built', 'coded', 'debugged', 'deployed', 'designed',
  'developed', 'engineered', 'implemented', 'integrated', 'launched',
  'migrated', 'modernized', 'optimized', 'programmed', 'refactored',
  'released', 'shipped', 'wrote', 'created', 'established', 'authored',

  // Leadership & Management
  'accelerated', 'championed', 'collaborated', 'coordinated', 'directed',
  'drove', 'facilitated', 'guided', 'headed', 'led', 'managed', 'mentored',
  'owned', 'oversaw', 'partnered', 'spearheaded', 'supervised',

  // Problem Solving & Improvement
  'analyzed', 'automated', 'consolidated', 'eliminated', 'enhanced',
  'fixed', 'identified', 'improved', 'increased', 'reduced', 'resolved',
  'revamped', 'simplified', 'solved', 'streamlined', 'transformed',

  // Data & Research
  'assessed', 'benchmarked', 'evaluated', 'investigated', 'measured',
  'modeled', 'monitored', 'researched', 'tested', 'validated',

  // Product & Business
  'defined', 'delivered', 'devised', 'executed', 'generated', 'initiated',
  'introduced', 'planned', 'prioritized', 'produced', 'proposed',
  'scaled', 'secured', 'standardized', 'strategized',

  // Communication & Collaboration
  'advised', 'communicated', 'documented', 'presented', 'trained',

  // Infrastructure & DevOps
  'configured', 'containerized', 'hardened', 'instrumented', 'provisioned',
  'secured', 'set up', 'administered',

  // Data Science & ML
  'classified', 'clustered', 'fine-tuned', 'predicted', 'preprocessed',
  'trained', 'tuned',
])

export const WEAK_PHRASES = [
  'responsible for',
  'worked on',
  'helped with',
  'assisted in',
  'involved in',
  'participated in',
  'contributed to',
  'was part of',
  'duties included',
  'tasks included',
]

export const STRONG_VERB_SUGGESTIONS: Record<string, string[]> = {
  'responsible for': ['Led', 'Owned', 'Managed', 'Directed'],
  'worked on': ['Developed', 'Built', 'Engineered', 'Implemented'],
  'helped with': ['Collaborated on', 'Contributed to', 'Supported', 'Partnered on'],
  'assisted in': ['Supported', 'Contributed to', 'Aided in', 'Partnered on'],
}
