'use client'
import { useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import SchoolRadar from '@/components/SchoolRadar'
import type { SchoolResult } from '@/lib/data'

interface Props {
  school: SchoolResult
  usDomainScores: { domain: string; school: number; market: number }[]
  ilDomainScores: { domain: string; school: number; market: number }[] | null
  ilScore: number | null
  isIllinois: boolean
}

export default function SchoolPageClient({ school, usDomainScores, ilDomainScores, ilScore, isIllinois }: Props) {
  const [market, setMarket] = useState<'us' | 'il'>('us')

  const activeScores = market === 'il' && ilDomainScores ? ilDomainScores : usDomainScores
  const activeScore = market === 'il' && ilScore !== null ? ilScore : school.overall_alignment_score

  const topClusters = Object.values(school.cluster_scores)
    .sort((a, b) => b.school_preparation_score - a.school_preparation_score)
    .slice(0, 5)

  const underPrepared = Object.values(school.cluster_scores)
    .filter(c => c.alignment < -2)
    .sort((a, b) => a.alignment - b.alignment)
    .slice(0, 3)

  const pedagogy = school.pedagogy_distribution

  return (
    <div className="min-h-screen bg-[#f2ede4]">
      <Nav />
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-20">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[#a09890] hover:text-[#1a1a18] font-mono transition-colors mb-8">
          ← Back to search
        </Link>
        <div className="border-t-2 border-[#1a1a18] pt-1 mb-1"><div className="border-t border-[#1a1a18]" /></div>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 py-6 border-b border-[#c8c0b0] mb-10">
          <div>
            <p className="text-xs font-mono text-[#a09890] uppercase tracking-widest mb-2">{school.school_location}</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-[#1a1a18] leading-tight mb-2">{school.school_name}</h1>
            <p className="text-sm text-[#a09890] font-mono">{school.course_count} courses analyzed</p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
            <div className="text-5xl font-display font-bold text-[#10b981]">{activeScore?.toFixed(1)}</div>
            <p className="text-xs text-[#a09890] font-mono">alignment score</p>
            {isIllinois && (
              <div className="flex mt-1 border border-[#c8c0b0] rounded overflow-hidden">
                {(['us', 'il'] as const).map(m => (
                  <button key={m} onClick={() => setMarket(m)} disabled={m === 'il' && !ilDomainScores}
                    className={`px-3 py-1.5 text-xs font-mono transition-colors ${market === m ? 'bg-[#1a1a18] text-[#f2ede4]' : 'bg-white text-[#6b6557] hover:bg-[#ede8de]'} ${m === 'il' && !ilDomainScores ? 'opacity-40 cursor-not-allowed' : ''}`}>
                    {m === 'us' ? 'National' : 'Illinois'}
                  </button>
                ))}
              </div>
            )}
            {isIllinois && !ilDomainScores && <p className="text-xs text-amber-700 font-mono">Local data not yet available</p>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="border border-[#c8c0b0] rounded bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-mono text-[#a09890] uppercase tracking-wider">Curriculum vs Market</h2>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-[#10b981]"><span className="w-3 h-0.5 bg-[#10b981] inline-block" /> School</span>
                <span className="flex items-center gap-1.5 text-[#c8c0b0]"><span className="w-3 inline-block" style={{ borderBottom: '1.5px dashed #c8c0b0' }} /> Market</span>
              </div>
            </div>
            <SchoolRadar data={activeScores} schoolName={school.school_name} />
          </div>

          <div className="flex flex-col gap-4">
            <div className="border border-[#c8c0b0] rounded bg-white p-5">
              <h3 className="text-xs font-mono text-[#a09890] uppercase tracking-wider mb-4">Curriculum Strengths</h3>
              <div className="space-y-3">
                {topClusters.map(c => (
                  <div key={c.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#1a1a18] truncate pr-2">{c.label}</span>
                      <span className="font-mono text-[#10b981] shrink-0">{c.school_preparation_score.toFixed(1)}</span>
                    </div>
                    <div className="h-0.5 bg-[#ede8de] rounded-full overflow-hidden">
                      <div className="h-full bg-[#10b981] rounded-full" style={{ width: `${Math.min(100, c.school_preparation_score)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {underPrepared.length > 0 && (
              <div className="border border-amber-200 rounded bg-amber-50 p-5">
                <h3 className="text-xs font-mono text-amber-700 uppercase tracking-wider mb-4">Curriculum Gaps</h3>
                <div className="space-y-2">
                  {underPrepared.map(c => (
                    <div key={c.label} className="flex justify-between text-xs">
                      <span className="text-[#6b6557]">{c.label}</span>
                      <span className="font-mono text-amber-700">{c.alignment.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border border-[#c8c0b0] rounded bg-white p-5">
              <h3 className="text-xs font-mono text-[#a09890] uppercase tracking-wider mb-3">Teaching Methods</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(pedagogy).map(([method, count]) => (
                  <span key={method} className="px-2.5 py-1 border border-[#c8c0b0] rounded text-xs font-mono text-[#6b6557]">
                    {method.replace('_', ' ')} · {count}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {school.specialization_bonuses && school.specialization_bonuses.length > 0 && (
          <div className="border border-[#10b981]/30 rounded p-5 bg-[#10b981]/5 mb-8">
            <h3 className="text-xs font-mono text-[#10b981] uppercase tracking-wider mb-3">✦ Specialization Bonuses</h3>
            <div className="flex flex-wrap gap-2">
              {school.specialization_bonuses.map((b, i) => (
                <span key={i} className="px-3 py-1.5 border border-[#10b981]/30 rounded text-xs text-[#059669] bg-white">{b}</span>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="border-t border-[#c8c0b0] pt-6 mb-4">
            <h2 className="text-xs font-mono text-[#a09890] uppercase tracking-wider">All 20 Skill Clusters</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-px bg-[#c8c0b0] border border-[#c8c0b0] rounded overflow-hidden">
            {Object.entries(school.cluster_scores).map(([k, c]) => (
              <div key={k} className="flex items-center justify-between px-4 py-3 bg-white hover:bg-[#f8f5f0] transition-colors">
                <span className="text-xs text-[#6b6557] truncate pr-3">{c.label}</span>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs font-mono ${c.alignment >= 0 ? 'text-[#10b981]' : 'text-amber-700'}`}>
                    {c.alignment >= 0 ? '+' : ''}{c.alignment.toFixed(1)}
                  </span>
                  <span className="text-xs font-mono text-[#c8c0b0] w-8 text-right">{c.school_preparation_score.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#a09890] font-mono mt-3">Alignment = school score minus market demand. Positive = over-prepared, negative = gap.</p>
        </div>
      </div>
    </div>
  )
}
