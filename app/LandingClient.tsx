'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import SchoolSearch from '@/components/SchoolSearch'
import JobTicker from '@/components/JobTicker'
import type { SchoolResult } from '@/lib/data'

interface Props {
  schools: SchoolResult[]
  jobs: { title: string; location?: string }[]
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

const STATS = [
  { value: '17', label: 'Schools scored' },
  { value: '20', label: 'Skill clusters' },
  { value: '1,620', label: 'Jobs analyzed' },
  { value: '2×/yr', label: 'Data refresh' },
]

export default function LandingClient({ schools, jobs }: Props) {
  useReveal()
  const searchRef = useRef<HTMLDivElement>(null)

  const scrollToSearch = () => {
    searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setTimeout(() => { const input = searchRef.current?.querySelector('input'); input?.focus() }, 600)
  }

  const topSchools = [...schools]
    .filter(s => s.overall_alignment_score !== null)
    .sort((a, b) => (b.overall_alignment_score ?? 0) - (a.overall_alignment_score ?? 0))
    .slice(0, 8)

  return (
    <div className="min-h-screen flex flex-col bg-[#f2ede4]">
      <Nav />

      {/* Hero — newspaper broadsheet style */}
      <section className="max-w-5xl mx-auto px-6 pt-28 pb-16 w-full">
        {/* Dateline */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#c8c0b0]">
          <span className="text-xs font-mono text-[#a09890] uppercase tracking-widest">MBA Skills Index</span>
          <span className="w-1 h-1 rounded-full bg-[#c8c0b0]" />
          <span className="text-xs font-mono text-[#10b981]">● Updated biannually</span>
          <span className="ml-auto text-xs font-mono text-[#a09890]">
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
        </div>

        {/* Big editorial headline */}
        <div
          className="mb-8"
          style={{ animation: 'fadeUp 0.5s ease 0.1s both' }}
        >
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.02] text-[#1a1a18] tracking-tight mb-5">
            The first website to compare business schools to the job market.
          </h1>
          <p className="text-base md:text-lg text-[#6b6557] max-w-2xl leading-relaxed font-body">
            Rankings tell you prestige. We tell you preparation — using real job postings, academic NLP methodology, and AI scoring to show which MBAs actually align with what employers hire for.
          </p>
        </div>

        {/* CTA row */}
        <div
          className="flex flex-col sm:flex-row gap-3 mb-16"
          style={{ animation: 'fadeUp 0.5s ease 0.25s both' }}
        >
          <button
            onClick={scrollToSearch}
            className="px-7 py-3 bg-[#1a1a18] hover:bg-[#2d2d2a] text-[#f2ede4] font-body text-sm rounded transition-colors"
          >
            Compare Schools →
          </button>
          <Link
            href="/methodology"
            className="px-7 py-3 border border-[#c8c0b0] hover:border-[#1a1a18] text-[#6b6557] hover:text-[#1a1a18] font-body text-sm rounded transition-colors"
          >
            See How It Works
          </Link>
          <Link
            href="/mission"
            className="px-7 py-3 border border-[#c8c0b0] hover:border-[#1a1a18] text-[#6b6557] hover:text-[#1a1a18] font-body text-sm rounded transition-colors"
          >
            Why We Built This
          </Link>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-[#c8c0b0] rounded overflow-hidden reveal">
          {STATS.map((s, i) => (
            <div key={s.label} className={`flex flex-col items-center py-5 text-center ${i > 0 ? 'border-l border-[#c8c0b0]' : ''}`}>
              <span className="font-display text-3xl font-bold text-[#1a1a18]">{s.value}</span>
              <span className="text-xs font-mono text-[#a09890] mt-1 uppercase tracking-wider">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6 w-full">
        <div className="border-t-2 border-[#1a1a18]" />
        <div className="border-t border-[#c8c0b0] mt-px" />
      </div>

      {/* Search section */}
      <section className="max-w-5xl mx-auto px-6 py-16 w-full relative z-10 bg-[#f2ede4]" ref={searchRef}>
        <div className="reveal mb-8">
          <h2 className="font-display text-3xl font-bold text-[#1a1a18] mb-1">Find your school</h2>
          <p className="text-sm text-[#a09890] font-mono">Type to search · alignment scores vs national job market</p>
        </div>

        <div className="reveal mb-12">
          <SchoolSearch schools={schools} large />
        </div>

        {/* Leaderboard */}
        <div className="reveal">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-mono text-[#a09890] uppercase tracking-widest">Ranked by alignment · National market</p>
            <div className="flex items-center gap-6 text-xs font-mono text-[#a09890]">
              <span>Score</span>
            </div>
          </div>
          <div className="border border-[#c8c0b0] rounded overflow-hidden">
            {topSchools.map((school, i) => (
              <Link
                key={school.school_name}
                href={`/school/${school.school_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`}
                className={`flex items-center gap-4 px-5 py-3.5 hover:bg-[#ede8de] transition-colors group ${i > 0 ? 'border-t border-[#ede8de]' : ''}`}
              >
                <span className="font-mono text-sm text-[#c8c0b0] w-5 text-right shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#1a1a18] group-hover:text-[#10b981] transition-colors truncate font-body">
                    {school.school_name}
                  </p>
                  <p className="text-xs text-[#a09890] font-mono truncate">{school.school_location}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-20 h-0.5 bg-[#ede8de] rounded-full overflow-hidden">
                    <div className="h-full bg-[#10b981] rounded-full" style={{ width: `${(school.overall_alignment_score ?? 0)}%` }} />
                  </div>
                  <span className="font-mono text-sm text-[#10b981] w-10 text-right">
                    {school.overall_alignment_score?.toFixed(1)}
                  </span>
                </div>
                <svg className="w-3.5 h-3.5 text-[#c8c0b0] group-hover:text-[#1a1a18] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works teaser */}
      <section className="border-t-2 border-[#1a1a18] bg-[#1a1a18] text-[#f2ede4] py-16 px-6">
        <div className="max-w-5xl mx-auto reveal">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-mono text-[#10b981] uppercase tracking-widest mb-3">Methodology</p>
              <h2 className="font-display text-3xl font-bold mb-4 leading-tight">Built on peer-reviewed research & real data</h2>
              <p className="text-[#a09890] font-body text-sm leading-relaxed mb-6">
                We scraped 30 days of Indeed job postings, applied the Boshkoska (2025) NLP clustering pipeline, then scored every MBA course against 20 market-derived skill clusters using AI.
              </p>
              <Link href="/methodology"
                className="inline-flex items-center gap-2 text-sm text-[#f2ede4] link-underline hover:text-[#10b981] transition-colors">
                Read the full methodology
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'O*NET', desc: '42 MBA job categories' },
                { label: 'Indeed', desc: '30-day job scrape' },
                { label: 'NLP', desc: 'TF-IDF → LSA → K-means' },
                { label: 'AI', desc: 'Claude course scoring' },
              ].map(item => (
                <div key={item.label} className="border border-white/10 rounded p-4">
                  <p className="font-mono text-[#10b981] text-xs mb-1">{item.label}</p>
                  <p className="text-[#a09890] text-xs font-body">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Job ticker */}
      <JobTicker jobs={jobs} />

      <footer className="py-5 px-6 text-center border-t border-[#c8c0b0]">
        <p className="text-xs text-[#a09890] font-mono">
          © 2025 MBA Skills Index · Job data refreshed biannually · Not affiliated with any business school
        </p>
      </footer>
    </div>
  )
}
