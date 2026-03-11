export interface ClusterScore {
  label: string
  school_preparation_score: number
  market_demand: number
  alignment: number
}

export interface SchoolResult {
  school_name: string
  school_location: string
  market_location: string
  course_count: number
  pedagogy_distribution: Record<string, number>
  cluster_scores: Record<string, ClusterScore>
  overall_alignment_score: number | null
  data_quality?: string
  specialization_bonuses?: string[]
}

export interface ScoresData {
  generated_date: string
  market_location: string
  schools_analyzed: number
  results: SchoolResult[]
}

// 6-domain grouping of the 20 US clusters
export const US_DOMAIN_MAP: Record<string, string[]> = {
  'Finance & Investment': [
    'Private Equity & Investment',
    'Financial Analysis',
    'Public Sector Finance',
  ],
  'Strategy & Consulting': [
    'Management Consulting',
    'Corporate Strategy',
    'Strategic Project Management',
    'Tech Product & Strategy',
  ],
  'Marketing & Sales': [
    'Marketing & Communications',
    'Product Marketing',
    'Sales Operations',
  ],
  'Operations & Supply Chain': [
    'Supply Chain Management',
    'HR & People Operations',
  ],
  'Technology & Data': [
    'Business Intelligence & Analytics',
    'Cloud & Infrastructure',
    'Product Management',
    'Sustainability & ESG',
    'Compliance & Regulatory',
  ],
  'Healthcare': [
    'Healthcare Operations',
    'Pharmaceutical Product Management',
    'Medical Education Administration',
  ],
}

// Illinois domain map
export const IL_DOMAIN_MAP: Record<string, string[]> = {
  'Finance & Investment': [
    'Investment Banking',
    'Corporate Finance',
    'Financial Planning & Analysis',
  ],
  'Strategy & Consulting': [
    'Management Consulting & Strategy',
    'Strategy Consulting',
    'Digital Transformation Consulting',
    'Cloud Strategy & Consulting',
  ],
  'Marketing & Sales': [
    'Marketing & Brand Management',
    'Sales & Business Development',
  ],
  'Operations & Supply Chain': [
    'Operations Management',
    'Supply Chain & Procurement',
    'Strategic Leadership',
  ],
  'Technology & Data': [
    'Data Engineering & Analytics',
    'Technology Consulting',
    'Product Management',
    'Pharmaceutical Strategy',
  ],
  'Healthcare': [
    'Healthcare Administration',
    'Healthcare Product Management',
    'Clinical Operations',
    'Compliance & Risk Management',
  ],
}

export function computeDomainScores(
  clusterScores: Record<string, ClusterScore>,
  domainMap: Record<string, string[]>
): { domain: string; school: number; market: number }[] {
  return Object.entries(domainMap).map(([domain, labels]) => {
    const matching = Object.values(clusterScores).filter(c =>
      labels.some(l => c.label.toLowerCase().includes(l.toLowerCase()) || l.toLowerCase().includes(c.label.toLowerCase()))
    )
    const school = matching.length
      ? matching.reduce((s, c) => s + c.school_preparation_score, 0) / matching.length
      : 0
    const market = matching.length
      ? matching.reduce((s, c) => s + c.market_demand, 0) / matching.length
      : 0
    return { domain, school: Math.round(school * 10) / 10, market: Math.round(market * 10) / 10 }
  })
}

export function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function deslugify(slug: string, schools: SchoolResult[]): SchoolResult | undefined {
  return schools.find(s => slugify(s.school_name) === slug)
}

export const ILLINOIS_KEYWORDS = [
  'booth', 'kellogg', 'university of illinois', 'loyola', 'depaul',
  'northern illinois', 'illinois institute'
]

export function isIllinoisSchool(name: string): boolean {
  const lower = name.toLowerCase()
  return ILLINOIS_KEYWORDS.some(k => lower.includes(k))
}
