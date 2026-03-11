'use client'
import { useEffect, useRef, useState } from 'react'

const STEPS = [
  {
    id: 'onet',
    number: '01',
    shortLabel: 'O*NET',
    title: 'Starting with O*NET: 42 MBA Job Categories',
    summary: "We ground our analysis in the U.S. Department of Labor's O*NET database — the gold standard for occupational data.",
    detail: `The Occupational Information Network (O*NET) classifies hundreds of job types by required skills, education, and tasks. We identified 42 occupational categories that typically require an MBA or graduate business degree.

These categories span the full range of business careers: from investment banking and management consulting to healthcare administration and supply chain management. Using O*NET ensures our analysis is anchored in standardized, government-verified occupational data rather than subjective judgment.

The 42 categories were selected based on: (1) median education requirement of graduate degree, (2) alignment with business school career outcomes, and (3) coverage across diverse MBA specializations.`,
    stat: '42', statLabel: 'O*NET categories',
  },
  {
    id: 'titles',
    number: '02',
    shortLabel: 'Job Titles',
    title: 'AI-Decoded: 42 Most Common MBA Job Titles',
    summary: "O*NET categories are broad. We used AI to translate each category into the specific job titles that appear on real job boards.",
    detail: `Each O*NET category maps to dozens of real-world job titles. For example, "Financial Managers" maps to titles like "VP of Finance," "Controller," "Treasury Manager," and "CFO." Using broad category names in job searches would yield poor results.

We used AI to analyze each O*NET category and identify the single most commonly posted MBA-relevant job title for that category. This gave us 42 precise search queries that would yield high-quality, relevant job postings when scraped.

The result: a curated list of 42 job titles per market (national, plus each state), each directly traceable to an O*NET occupational classification. This ensures complete coverage of the MBA job market while maintaining search precision.`,
    stat: '42 × 2', statLabel: 'Titles per market',
  },
  {
    id: 'scraping',
    number: '03',
    shortLabel: 'Scraping',
    title: '30 Days of Job Market Data',
    summary: "We scrape Indeed every day for 30 days, capturing a real-time snapshot of MBA hiring demand.",
    detail: `For each of the 42 job titles, we scrape Indeed job postings across two geographic scopes: the United States (national) and individual states (starting with Illinois). This gives us both national and local market perspectives.

The scraper captures: job title, company, location, full job description, required qualifications, and preferred skills. We collect 4 postings per job title per day, yielding approximately 10,000 raw postings over 30 days.

After filtering for MBA-required positions (requiring graduate degrees or 5+ years experience), we retained ~1,620 high-quality job postings for analysis. This filtering is critical — it ensures our skill clusters reflect genuine MBA-level positions rather than entry-level roles.

Data is refreshed biannually to capture market evolution.`,
    stat: '~1,620', statLabel: 'MBA-level jobs captured',
  },
  {
    id: 'clustering',
    number: '04',
    shortLabel: 'Clustering',
    title: 'Boshkoska NLP Pipeline: TF-IDF → LSA → K-Means',
    summary: "We apply a peer-reviewed academic methodology to extract 20 skill clusters from job description text.",
    detail: `Our clustering methodology follows Boshkoska et al. (2025), a peer-reviewed NLP pipeline designed specifically for labor market skill analysis.

**Step 1 — TF-IDF Vectorization:** Each job description is transformed into a 5,000-feature vector using Term Frequency-Inverse Document Frequency. This captures which terms are uniquely important to each posting versus common across all postings. Bigrams (two-word phrases like "financial modeling") are included. Custom MBA-specific stopwords are removed.

**Step 2 — LSA Dimensionality Reduction:** The 5,000-dimensional space is compressed to 100 dimensions using Latent Semantic Analysis (TruncatedSVD). This surfaces latent skill themes that individual terms don't capture alone — for example, grouping "P&L management," "budgeting," and "forecasting" into an underlying financial planning skill concept.

**Step 3 — K-Means Clustering:** The 100-dimension vectors are grouped into 20 clusters. Each cluster represents a bundle of skills that co-occur in similar job postings. Clusters are run separately for each geographic market, so Illinois clusters reflect local demand while US clusters reflect national demand.

The output: 20 skill bundles, each representing a distinct functional area of MBA careers. Labels like "Investment Banking" or "Digital Transformation Consulting" describe what type of role the skills belong to.`,
    stat: '20', statLabel: 'Skill clusters per market',
  },
  {
    id: 'curricula',
    number: '05',
    shortLabel: 'Schools',
    title: 'Scraping MBA Curricula',
    summary: "We built automated scrapers to extract every course title and description from business school catalogs.",
    detail: `Business school websites vary enormously — some use static HTML course catalogs, others use dynamic single-page applications with search interfaces, others use popup modals for course descriptions. We built a browser-automation scraper using Playwright that detects and handles 5 different catalog patterns.

For each school, we capture: course code, course title, and full course description. The descriptions are critical — a course titled "Advanced Analytics" could mean anything from basic Excel to machine learning. The description tells us what skills it actually teaches.

After scraping, courses go through a migration pipeline that standardizes formatting, removes duplicate entries, strips administrative noise (section numbers, credit hours, prerequisites) from the text fields, and detects teaching methodology keywords (case study, simulation, capstone, practicum, etc.).

Currently 17 elite programs are scored, with a pipeline to scale to 320+ schools.`,
    stat: '320+', statLabel: 'Schools in pipeline',
  },
  {
    id: 'scoring',
    number: '06',
    shortLabel: 'Scoring',
    title: 'AI Scoring: Course × Cluster Alignment',
    summary: "For each course, AI scores its relevance to all 20 skill clusters, then we apply pedagogy multipliers.",
    detail: `Rules-based matching can't capture the nuance of MBA courses. A course called "Healthcare Strategy" might teach financial modeling, operations, or policy — the description determines which skill clusters it maps to.

**Course Scoring:** We send each course title + description to the AI in batches of 10. It returns a 0–100 relevance score for each of the 20 skill clusters. A "Corporate Valuation" course might score 95 for Investment Banking, 40 for Corporate Strategy, and 5 for Marketing.

**Pedagogy Weighting:** Course descriptions are scanned for teaching method keywords. More experiential methods receive higher multipliers:
- Lecture: 1.0× (baseline)
- Case Study: 1.1×
- Simulation: 1.2×
- Workshop: 1.3×
- Practicum / Field Study: 1.4×
- Capstone / Consulting Project: 1.5×

Schools with more hands-on pedagogy score 10–15% higher on preparation, correctly rewarding experiential learning.

**Specialization Bonuses:** A separate AI call maps a school's declared specializations and concentrations to skill clusters. These appear as "bonus" callouts on the school page — indicating the school has intentionally built depth in specific areas beyond what individual courses show.`,
    stat: '1.0–1.5×', statLabel: 'Pedagogy multipliers',
  },
  {
    id: 'output',
    number: '07',
    shortLabel: 'Output',
    title: 'Alignment Scores & Radar Visualization',
    summary: "Cluster scores are aggregated into 6 domains and visualized as radar charts comparing school preparation to market demand.",
    detail: `**Alignment Score Calculation:** Each school receives a preparation score for each of 20 skill clusters (0–100 scale). These are compared to the market demand percentages from our job data. We use cosine similarity to compute an overall alignment score — this measures how well the shape of a school's curriculum matches the shape of market demand, not just the raw totals.

**6-Domain Aggregation:** The 20 clusters are grouped into 6 domains for radar visualization:
- Finance & Investment
- Strategy & Consulting
- Marketing & Sales
- Operations & Supply Chain
- Technology & Data
- Healthcare

Each domain score is the average of its constituent cluster scores, making the radar chart readable without losing the underlying 20-cluster precision.

**Dual Market View:** Illinois schools are scored against both the national US market and the Illinois-specific market. Illinois has 30% more finance jobs than the national average — a school perfectly aligned nationally might be better or worse for Chicago careers.

**Interpretation:** An alignment score near 100 means the school's curriculum distribution closely matches market demand. Positive cluster alignment means the school over-prepares students in that area; negative means a gap exists.`,
    stat: '6', statLabel: 'Display domains',
  },
]

function OverviewFlowchart({ onStepClick }: { onStepClick: (id: string) => void }) {
  return (
    <div className="overflow-x-auto py-2">
      <div className="min-w-[640px] flex items-center">
        {STEPS.map((step, i) => (
          <div key={step.id} className="flex items-center flex-1">
            <button onClick={() => onStepClick(step.id)}
              className="flex flex-col items-center gap-2 group w-full">
              <div className="w-10 h-10 rounded-full border border-[#c8c0b0] bg-[#f2ede4] flex items-center justify-center group-hover:border-[#1a1a18] group-hover:bg-white transition-all">
                <span className="font-mono text-xs text-[#6b6557] group-hover:text-[#1a1a18]">{step.number}</span>
              </div>
              <span className="text-[10px] font-mono text-[#a09890] group-hover:text-[#6b6557] text-center leading-tight transition-colors">
                {step.shortLabel}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <div className="h-px bg-[#c8c0b0] flex-1 mt-[-12px] mx-1" />
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-[#a09890] font-mono mt-4">
        Click any node to jump · or scroll to explore each step
      </p>
    </div>
  )
}

export default function MethodologyClient() {
  const [activeStep, setActiveStep] = useState(0)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = sectionRefs.current.indexOf(entry.target as HTMLElement)
            if (idx !== -1) setActiveStep(idx)
          }
        })
      },
      { threshold: 0.4, rootMargin: '-20% 0px -20% 0px' }
    )
    sectionRefs.current.forEach(el => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  const scrollToStep = (id: string) => {
    const idx = STEPS.findIndex(s => s.id === id)
    if (idx !== -1 && sectionRefs.current[idx]) {
      sectionRefs.current[idx]!.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <div className="min-h-screen bg-[#f2ede4] pt-14">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 py-14 border-b border-[#c8c0b0]">
        <div className="border-t-2 border-[#1a1a18] pt-4 mb-1"><div className="border-t border-[#1a1a18]" /></div>
        <div className="pt-5">
          <p className="text-xs font-mono text-[#a09890] uppercase tracking-widest mb-3">Methodology</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[#1a1a18] mb-4 leading-tight">
            How MBA Skills Index works
          </h1>
          <p className="text-[#6b6557] font-body text-base max-w-2xl leading-relaxed">
            A 7-step pipeline combining government labor data, academic NLP research, web scraping, and AI to score MBA curricula against real job market demand.
          </p>
        </div>
      </div>

      {/* Overview flowchart */}
      <div className="max-w-4xl mx-auto px-6 py-10 border-b border-[#c8c0b0]">
        <p className="text-xs font-mono text-[#a09890] uppercase tracking-wider mb-6">Full pipeline overview</p>
        <OverviewFlowchart onStepClick={scrollToStep} />
      </div>

      {/* Steps with side timeline */}
      <div className="relative max-w-5xl mx-auto px-6 py-16 pb-32">
        <div className="flex gap-16">

          {/* Sticky side timeline */}
          <div className="hidden lg:flex flex-col sticky top-24 h-fit w-32 shrink-0 pt-2">
            {STEPS.map((step, i) => (
              <button key={step.id} onClick={() => scrollToStep(step.id)}
                className="flex items-start gap-3 py-2 text-left group">
                <div className="flex flex-col items-center mt-0.5">
                  <div className={`w-2 h-2 rounded-full border transition-all duration-200 ${
                    i === activeStep ? 'bg-[#10b981] border-[#10b981]'
                    : i < activeStep ? 'bg-[#c8c0b0] border-[#c8c0b0]'
                    : 'bg-transparent border-[#c8c0b0]'
                  }`} />
                  {i < STEPS.length - 1 && (
                    <div className={`w-px h-8 transition-all duration-300 ${i < activeStep ? 'bg-[#c8c0b0]' : 'bg-[#ede8de]'}`} />
                  )}
                </div>
                <span className={`text-xs font-mono transition-colors leading-tight mt-px ${
                  i === activeStep ? 'text-[#10b981] font-medium'
                  : i < activeStep ? 'text-[#c8c0b0]'
                  : 'text-[#c8c0b0] group-hover:text-[#6b6557]'
                }`}>
                  {step.shortLabel}
                </span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 space-y-24">
            {STEPS.map((step, i) => (
              <section key={step.id} id={step.id} ref={el => { sectionRefs.current[i] = el }} className="scroll-mt-24">
                <div className="border-t border-[#c8c0b0] pt-6 mb-5">
                  <span className="font-mono text-xs text-[#a09890]">Step {step.number}</span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1a1a18] mb-3 leading-snug">
                  {step.title}
                </h2>
                <p className="text-[#6b6557] font-body text-base leading-relaxed mb-6">{step.summary}</p>

                <div className="bg-white border border-[#c8c0b0] rounded p-6 mb-5">
                  {step.detail.split('\n\n').map((para, j) => (
                    <p key={j} className="text-[#6b6557] font-body text-sm leading-relaxed mb-4 last:mb-0"
                      dangerouslySetInnerHTML={{
                        __html: para
                          .replace(/\*\*(.+?)\*\*/g, '<strong class="text-[#1a1a18] font-medium">$1</strong>')
                          .replace(/\n/g, '<br/>')
                      }}
                    />
                  ))}
                </div>

                <div className="inline-flex flex-col border border-[#c8c0b0] rounded px-5 py-3 bg-white">
                  <span className="font-display text-2xl font-bold text-[#10b981]">{step.stat}</span>
                  <span className="text-xs text-[#a09890] font-mono">{step.statLabel}</span>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t-2 border-[#1a1a18] bg-[#1a1a18] py-14 text-center px-6">
        <p className="text-[#a09890] font-body text-sm mb-5 max-w-md mx-auto">
          Ready to see how your school compares?
        </p>
        <a href="/"
          className="inline-flex items-center gap-2 px-7 py-3 bg-[#f2ede4] hover:bg-white text-[#1a1a18] font-body font-semibold text-sm rounded transition-colors">
          Compare Schools →
        </a>
      </div>
    </div>
  )
}
