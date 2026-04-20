export type RoleType = 'swe' | 'data' | 'devops' | 'pm' | 'general'

export const ROLE_KEYWORDS: Record<RoleType, string[]> = {
  swe: [
    'REST API', 'microservices', 'CI/CD', 'Docker', 'Kubernetes', 'AWS', 'GCP',
    'Azure', 'TypeScript', 'React', 'Node.js', 'Python', 'Go', 'Java',
    'system design', 'distributed systems', 'scalability', 'performance',
    'unit testing', 'code review', 'agile', 'PostgreSQL', 'Redis', 'GraphQL',
    'OAuth', 'Git', 'Linux', 'API', 'backend', 'frontend', 'full stack',
  ],
  data: [
    'machine learning', 'deep learning', 'Python', 'PyTorch', 'TensorFlow',
    'scikit-learn', 'pandas', 'SQL', 'ETL', 'data pipeline', 'A/B testing',
    'statistical analysis', 'data visualization', 'Spark', 'Hadoop', 'Airflow',
    'feature engineering', 'model training', 'regression', 'classification',
    'NLP', 'computer vision', 'Tableau', 'Power BI', 'BigQuery', 'Snowflake',
  ],
  devops: [
    'Kubernetes', 'Docker', 'Terraform', 'Ansible', 'CI/CD', 'Jenkins',
    'GitHub Actions', 'AWS', 'GCP', 'Azure', 'Linux', 'bash', 'monitoring',
    'Prometheus', 'Grafana', 'ELK stack', 'infrastructure as code', 'SRE',
    'reliability', 'SLA', 'SLO', 'incident response', 'helm', 'ArgoCD',
  ],
  pm: [
    'roadmap', 'stakeholders', 'OKR', 'KPI', 'agile', 'scrum', 'sprint',
    'product strategy', 'user research', 'A/B testing', 'go-to-market',
    'prioritization', 'customer discovery', 'product-market fit', 'metrics',
    'cross-functional', 'requirements', 'backlog', 'MVP', 'PRD', 'wireframe',
  ],
  general: [
    'agile', 'collaboration', 'communication', 'leadership', 'problem-solving',
    'analytical', 'cross-functional', 'stakeholder', 'project management',
  ],
}

export function detectRoleType(title: string): RoleType {
  const t = title.toLowerCase()
  if (t.includes('data') || t.includes('ml') || t.includes('machine learning') || t.includes('scientist')) return 'data'
  if (t.includes('devops') || t.includes('sre') || t.includes('platform') || t.includes('infrastructure')) return 'devops'
  if (t.includes('product manager') || t.includes(' pm ') || t === 'pm') return 'pm'
  if (t.includes('engineer') || t.includes('developer') || t.includes('software') || t.includes('fullstack') || t.includes('backend') || t.includes('frontend')) return 'swe'
  return 'general'
}
