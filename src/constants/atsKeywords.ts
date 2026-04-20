export type RoleType = 'swe' | 'data' | 'ml' | 'devops' | 'security' | 'pm' | 'general'

export const ROLE_KEYWORDS: Record<RoleType, string[]> = {
  swe: [
    // Core
    'REST API', 'GraphQL', 'microservices', 'monolith', 'distributed systems', 'system design',
    'scalability', 'high availability', 'fault tolerance', 'latency', 'throughput', 'performance',
    // Languages
    'TypeScript', 'JavaScript', 'Python', 'Go', 'Java', 'Kotlin', 'Rust', 'C++', 'Swift',
    // Frameworks
    'React', 'Next.js', 'Vue', 'Angular', 'Node.js', 'Express', 'Django', 'FastAPI', 'Spring',
    // Data
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'DynamoDB', 'Cassandra', 'Elasticsearch',
    // Infra
    'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Terraform', 'CI/CD',
    // Practices
    'unit testing', 'integration testing', 'TDD', 'code review', 'pair programming',
    'agile', 'scrum', 'git', 'Linux', 'shell scripting',
    // Patterns
    'OAuth', 'JWT', 'WebSocket', 'gRPC', 'event-driven', 'message queue', 'pub/sub',
    'caching', 'indexing', 'sharding', 'replication', 'load balancing',
    // Soft
    'mentoring', 'technical design', 'code quality', 'refactoring',
  ],
  data: [
    'SQL', 'Python', 'R', 'pandas', 'NumPy', 'SciPy', 'scikit-learn',
    'ETL', 'ELT', 'data pipeline', 'data warehouse', 'data lake', 'data modeling',
    'Airflow', 'dbt', 'Snowflake', 'BigQuery', 'Redshift', 'Databricks',
    'Spark', 'Hadoop', 'Kafka', 'Flink',
    'A/B testing', 'hypothesis testing', 'statistical analysis', 'regression',
    'classification', 'clustering', 'time series', 'forecasting',
    'feature engineering', 'exploratory data analysis', 'EDA',
    'Tableau', 'Power BI', 'Looker', 'Metabase', 'data visualization',
    'data quality', 'data governance', 'data catalog',
    'Jupyter', 'notebook', 'SQL optimization', 'query performance',
    'dashboard', 'KPI', 'metrics', 'business intelligence',
  ],
  ml: [
    'machine learning', 'deep learning', 'neural network', 'transformer', 'LLM',
    'PyTorch', 'TensorFlow', 'JAX', 'Keras', 'Hugging Face', 'LangChain',
    'CNN', 'RNN', 'LSTM', 'GAN', 'attention', 'embedding',
    'NLP', 'computer vision', 'reinforcement learning', 'unsupervised',
    'model training', 'fine-tuning', 'transfer learning', 'distillation',
    'feature engineering', 'hyperparameter tuning', 'cross-validation',
    'MLOps', 'model deployment', 'model serving', 'inference', 'batch prediction',
    'vector database', 'RAG', 'prompt engineering', 'RLHF', 'fine-tune',
    'GPU', 'CUDA', 'distributed training', 'data parallel',
    'experiment tracking', 'MLflow', 'Weights & Biases', 'SageMaker', 'Vertex AI',
    'Python', 'SQL', 'pandas', 'scikit-learn', 'research',
  ],
  devops: [
    'Kubernetes', 'Docker', 'Terraform', 'Ansible', 'Pulumi', 'Helm', 'ArgoCD',
    'CI/CD', 'Jenkins', 'GitHub Actions', 'GitLab CI', 'CircleCI', 'Buildkite',
    'AWS', 'GCP', 'Azure', 'cloud architecture', 'multi-cloud',
    'Linux', 'bash', 'shell scripting', 'Python', 'Go',
    'Prometheus', 'Grafana', 'Datadog', 'New Relic', 'Splunk', 'ELK stack',
    'observability', 'monitoring', 'logging', 'tracing', 'OpenTelemetry',
    'SRE', 'reliability', 'SLA', 'SLO', 'SLI', 'error budget',
    'incident response', 'postmortem', 'on-call', 'PagerDuty',
    'infrastructure as code', 'IaC', 'GitOps', 'service mesh', 'Istio',
    'networking', 'DNS', 'load balancer', 'CDN', 'VPC',
    'security', 'IAM', 'secrets management', 'compliance',
    'cost optimization', 'capacity planning', 'auto-scaling',
  ],
  security: [
    'security', 'application security', 'AppSec', 'DevSecOps', 'penetration testing', 'pentest',
    'OWASP', 'XSS', 'CSRF', 'SQL injection', 'SSRF', 'authentication', 'authorization',
    'OAuth', 'SAML', 'OIDC', 'JWT', 'MFA', 'SSO', 'zero trust',
    'encryption', 'TLS', 'SSL', 'PKI', 'certificate', 'HSM', 'KMS',
    'vulnerability', 'CVE', 'CVSS', 'threat modeling', 'risk assessment',
    'SIEM', 'SOC', 'IDS', 'IPS', 'WAF', 'firewall',
    'compliance', 'SOC 2', 'ISO 27001', 'GDPR', 'HIPAA', 'PCI DSS',
    'incident response', 'forensics', 'malware analysis', 'red team', 'blue team',
    'fuzzing', 'static analysis', 'SAST', 'DAST', 'dependency scanning',
    'cloud security', 'IAM', 'secrets management', 'secure coding',
    'Python', 'Go', 'bash', 'networking',
  ],
  pm: [
    'product management', 'product strategy', 'product roadmap', 'roadmap',
    'stakeholders', 'stakeholder management', 'cross-functional', 'leadership',
    'OKR', 'KPI', 'metrics', 'data-driven', 'analytics',
    'agile', 'scrum', 'kanban', 'sprint', 'retrospective',
    'user research', 'customer interviews', 'usability testing', 'customer discovery',
    'A/B testing', 'experimentation', 'hypothesis',
    'go-to-market', 'GTM', 'launch', 'product-market fit', 'PMF',
    'prioritization', 'RICE', 'MoSCoW', 'impact/effort',
    'backlog', 'grooming', 'requirements', 'PRD', 'spec', 'user stories',
    'MVP', 'prototype', 'wireframe', 'mockup', 'Figma',
    'SQL', 'data analysis', 'Tableau', 'Looker', 'Amplitude', 'Mixpanel',
    'API', 'technical background', 'engineering partnership',
    'B2B', 'B2C', 'SaaS', 'enterprise', 'growth',
    'retention', 'activation', 'conversion', 'funnel',
  ],
  general: [
    'leadership', 'collaboration', 'communication', 'problem-solving', 'analytical',
    'cross-functional', 'stakeholder', 'project management', 'strategic',
    'mentoring', 'team building', 'agile', 'innovation',
  ],
}

export function detectRoleType(title: string): RoleType {
  const t = title.toLowerCase()
  if (t.includes('security') || t.includes('appsec') || t.includes('pentest')) return 'security'
  if (t.includes('ml ') || t.includes('machine learning') || t.includes('ai engineer') || t.includes('deep learning') || t.includes('research scientist')) return 'ml'
  if (t.includes('data') || t.includes('analytics') || t.includes('scientist') || t.includes('analyst')) return 'data'
  if (t.includes('devops') || t.includes('sre') || t.includes('platform') || t.includes('infrastructure') || t.includes('reliability')) return 'devops'
  if (t.includes('product manager') || t.includes(' pm ') || t === 'pm' || t.includes('product lead')) return 'pm'
  if (t.includes('engineer') || t.includes('developer') || t.includes('software') || t.includes('fullstack') || t.includes('full stack') || t.includes('backend') || t.includes('frontend')) return 'swe'
  return 'general'
}
