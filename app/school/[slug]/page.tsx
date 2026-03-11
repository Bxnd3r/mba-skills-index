import { promises as fs } from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import type { ScoresData } from '@/lib/data'
import { slugify, deslugify, isIllinoisSchool, computeDomainScores, US_DOMAIN_MAP, IL_DOMAIN_MAP } from '@/lib/data'
import SchoolPageClient from './SchoolPageClient'

export async function generateStaticParams() {
  const usPath = path.join(process.cwd(), 'public/data/school_scores_united_states.json')
  const usData: ScoresData = JSON.parse(await fs.readFile(usPath, 'utf8'))
  return usData.results.map(s => ({ slug: slugify(s.school_name) }))
}

export default async function SchoolPage({ params }: { params: { slug: string } }) {
  const usPath = path.join(process.cwd(), 'public/data/school_scores_united_states.json')
  const ilPath = path.join(process.cwd(), 'public/data/school_scores_illinois.json')

  const usData: ScoresData = JSON.parse(await fs.readFile(usPath, 'utf8'))
  const school = deslugify(params.slug, usData.results)
  if (!school) notFound()

  const usDomainScores = computeDomainScores(school.cluster_scores, US_DOMAIN_MAP)

  let ilDomainScores = null
  let ilSchool = null
  if (isIllinoisSchool(school.school_name)) {
    try {
      const ilData: ScoresData = JSON.parse(await fs.readFile(ilPath, 'utf8'))
      ilSchool = deslugify(params.slug, ilData.results) || null
      if (ilSchool) {
        ilDomainScores = computeDomainScores(ilSchool.cluster_scores, IL_DOMAIN_MAP)
      }
    } catch { /* no IL data */ }
  }

  return (
    <SchoolPageClient
      school={school}
      usDomainScores={usDomainScores}
      ilDomainScores={ilDomainScores}
      ilScore={ilSchool?.overall_alignment_score ?? null}
      isIllinois={isIllinoisSchool(school.school_name)}
    />
  )
}
