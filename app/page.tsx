import { promises as fs } from 'fs'
import path from 'path'
import LandingClient from './LandingClient'
import type { ScoresData } from '@/lib/data'

export default async function HomePage() {
  const usPath = path.join(process.cwd(), 'public/data/school_scores_united_states.json')
  const jobsPath = path.join(process.cwd(), 'public/data/jobs_db.json')

  const usData: ScoresData = JSON.parse(await fs.readFile(usPath, 'utf8'))

  let jobs: { title: string; location?: string }[] = []
  try {
    const raw = JSON.parse(await fs.readFile(jobsPath, 'utf8'))
    // jobs_db.json is an array or object with jobs
    const jobArr = Array.isArray(raw) ? raw : (raw.jobs || raw.results || [])
    jobs = jobArr
      .slice(0, 200)
      .map((j: any) => ({
        title: j.title || j.job_title || j.name || 'MBA Role',
        location: j.location || j.city || undefined,
      }))
      .filter((j: any) => j.title && j.title.length < 60)
  } catch {
    // jobs_db not available, use fallback
    jobs = [
      { title: 'Strategy Associate', location: 'New York, NY' },
      { title: 'Investment Banking Analyst', location: 'Chicago, IL' },
      { title: 'Product Manager', location: 'San Francisco, CA' },
      { title: 'Management Consultant', location: 'Boston, MA' },
      { title: 'Financial Analyst', location: 'New York, NY' },
      { title: 'Operations Manager', location: 'Chicago, IL' },
      { title: 'Marketing Director', location: 'Los Angeles, CA' },
      { title: 'Supply Chain Manager', location: 'Detroit, MI' },
      { title: 'Business Development Manager', location: 'Austin, TX' },
      { title: 'Corporate Development Associate', location: 'New York, NY' },
      { title: 'Healthcare Administrator', location: 'Chicago, IL' },
      { title: 'Data Analytics Manager', location: 'Seattle, WA' },
      { title: 'Private Equity Associate', location: 'New York, NY' },
      { title: 'Brand Manager', location: 'Cincinnati, OH' },
      { title: 'ESG Analyst', location: 'San Francisco, CA' },
      { title: 'Technology Consultant', location: 'Dallas, TX' },
    ]
  }

  return <LandingClient schools={usData.results} jobs={jobs} />
}
