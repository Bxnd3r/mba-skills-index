'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import SchoolRadar from '@/components/SchoolRadar'
import type { SchoolResult } from '@/lib/data'
import { slugify, computeDomainScores, US_DOMAIN_MAP } from '@/lib/data'
import { useRouter } from 'next/navigation'

interface Props {
  school: SchoolResult
  allSchools: SchoolResult[]
  usDomainScores: { domain: string; school: number; market: number }[]
  ilDomainScores: { domain: string; school: number; market: number }[] | null
  ilScore: number | null
  isIllinois: boolean
}

function MiniSearch({ schools, onSelect, exclude }: {
  schools: SchoolResult[]
  onSelect: (s: SchoolResult) => void
  exclude: string
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = query.length > 0
    ? schools.filter(s => s.school_name !== exclude && s.school_name.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : schools.filter(s => s.school_name !== exclude).slice(0, 8)

  useEffect(() => { inputRef.current?.focus() }, [])

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2 bg-white border border-[#1a1a18] rounded px-3 py-2">
        <svg className="w-3.5 h-3.5 text-[#a09890] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search schools to compare…"
          className="flex-1 bg-transparent outline-none text-sm text-[#1a1a18] placeholder-[#a09890] font-body"
        />
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#c8c0b0] rounded shadow-lg overflow-hidden z-50">
          {filtered.map((s, i) => (
            <button key={s.school_name} onMouseDown={() => onSelect(s)}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-[#f2ede4] transition-colors ${i > 0 ? 'border-t border-[#ede8de]' : ''}`}>
              <span className="text-sm text-[#1a1a18] truncate">{s.school_name}</span>
              <span className="text-xs font-mono text-[#10b981] shrink-0 ml-3">{s.overall_alignment_score?.toFixed(1)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function SchoolColumn({ school, domainScores, label }: {
  school: SchoolResult
  domainScores: { domain: string; school: number; market: number }[]
  label?: string
}) {
  const topClusters = Object.values(school.cluster_scores)
    .sort((a, b) => b.school_preparation_score - a.school_preparation_score)
    .slice(0, 5)

  const underPrepared = Object.values(school.cluster_scores)
    .filter(c => c.alignment < -2)
    .sort((a, b) => a.alignment - b.alignment)
    .slice(0, 3)

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-[#c8c0b0] pb-4">
        {label && <p className="text-[10px] font-mono text-[#10b981] uppercase tracking-widest mb-1">{label}</p>}
        <p className="text-xs font-mono text-[#a09890] uppercase tracking-widest mb-1">{school.school_location}</p>
        <h2 className="font-display text-xl font-bold text-[#1a1a18] leading-tight mb-1">{school.school_name}</h2>
        <p className="text-xs text-[#a09890] font-mono">{school.course_count} courses</p>
        <div className="text-4xl font-display font-bold text-[#10b981] mt-2">{school.overall_alignment_score?.toFixed(1)}</div>
        <p className="text-xs text-[#a09890] font-mono">alignment score</p>
      </div>

      <div className="border border-[#c8c0b0] rounded bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-mono text-[#a09890] uppercase tracking-wider">Curriculum vs Market</h3>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1 text-[#10b981]"><span className="w-2.5 h-0.5 bg-[#10b981] inline-block" /> School</span>
            <span className="flex items-center gap-1 text-[#c8c0b0]"><span className="w-2.5 inline-block" style={{ borderBottom: '1.5px dashed #c8c0b0' }} /> Market</span>
          </div>
        </div>
        <SchoolRadar data={domainScores} schoolName={school.school_name} />
      </div>

      <div className="border border-[#c8c0b0] rounded bg-white p-4">
        <h3 className="text-xs font-mono text-[#a09890] uppercase tracking-wider mb-3">Curriculum Strengths</h3>
        <div className="space-y-2.5">
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
        <div className="border border-amber-200 rounded bg-amber-50 p-4">
          <h3 className="text-xs font-mono text-amber-700 uppercase tracking-wider mb-3">Curriculum Gaps</h3>
          <div className="space-y-1.5">
            {underPrepared.map(c => (
              <div key={c.label} className="flex justify-between text-xs">
                <span className="text-[#6b6557]">{c.label}</span>
                <span className="font-mono text-amber-700">{c.alignment.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border border-[#c8c0b0] rounded bg-white p-4">
        <h3 className="text-xs font-mono text-[#a09890] uppercase tracking-wider mb-3">Teaching Methods</h3>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(school.pedagogy_distribution).map(([method, count]) => (
            <span key={method} className="px-2 py-1 border border-[#c8c0b0] rounded text-xs font-mono text-[#6b6557]">
              {method.replace('_', ' ')} · {count}
            </span>
          ))}
        </div>
      </div>

      <div>
        <div className="border-t border-[#c8c0b0] pt-4 mb-3">
          <h3 className="text-xs font-mono text-[#a09890] uppercase tracking-wider">All 20 Skill Clusters</h3>
        </div>
        <div className="flex flex-col gap-px bg-[#c8c0b0] border border-[#c8c0b0] rounded overflow-hidden">
          {Object.entries(school.cluster_scores).map(([k, c]) => (
            <div key={k} className="flex items-center justify-between px-3 py-2.5 bg-white hover:bg-[#f8f5f0] transition-colors">
              <span className="text-xs text-[#6b6557] truncate pr-3">{c.label}</span>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs font-mono ${c.alignment >= 0 ? 'text-[#10b981]' : 'text-amber-700'}`}>
                  {c.alignment >= 0 ? '+' : ''}{c.alignment.toFixed(1)}
                </span>
                <span className="text-xs font-mono text-[#c8c0b0] w-8 text-right">{c.school_preparation_score.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function SchoolPageClient({ school, allSchools, usDomainScores, ilDomainScores, ilScore, isIllinois }: Props) {
  const [compareSchool, setCompareSchool] = useState<SchoolResult | null>(null)
  const [showComparePicker, setShowComparePicker] = useState(false)
  const [market, setMarket] = useState<'us' | 'il'>('us')
  const router = useRouter()

  const activeScores = market === 'il' && ilDomainScores ? ilDomainScores : usDomainScores
  const activeScore = market === 'il' && ilScore !== null ? ilScore : school.overall_alignment_score
  const compareDomainScores = compareSchool ? computeDomainScores(compareSchool.cluster_scores, US_DOMAIN_MAP) : null
  const isComparing = compareSchool !== null

  return (
    <div className="min-h-screen bg-[#f2ede4]">
      <Nav />
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-20">

        {/* Top nav bar */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[#a09890] hover:text-[#1a1a18] font-mono transition-colors shrink-0">
            ← Home
          </Link>
          <div className="flex items-center gap-3 w-full max-w-lg">
            <div className="flex-1">
              <MiniSearch
                schools={allSchools}
                exclude={school.school_name}
                onSelect={s => router.push(`/school/${slugify(s.school_name)}`)}
              />
            </div>
            {!isComparing ? (
              <button
                onClick={() => setShowComparePicker(v => !v)}
                className="shrink-0 px-4 py-2 border border-[#c8c0b0] hover:border-[#1a1a18] text-[#6b6557] hover:text-[#1a1a18] font-body text-xs rounded transition-colors whitespace-nowrap"
              >
                + Compare
              </button>
            ) : (
              <button
                onClick={() => { setCompareSchool(null); setShowComparePicker(false) }}
                className="shrink-0 px-4 py-2 border border-[#c8c0b0] hover:border-[#1a1a18] text-[#6b6557] hover:text-[#1a1a18] font-body text-xs rounded transition-colors whitespace-nowrap"
              >
                ✕ Clear
              </button>
            )}
          </div>
        </div>

        {/* Compare school picker */}
        {showComparePicker && !isComparing && (
          <div className="mb-8 border border-[#1a1a18] rounded bg-white p-4">
            <p className="text-xs font-mono text-[#a09890] uppercase tracking-wider mb-3">Select a school to compare</p>
            <MiniSearch
              schools={allSchools}
              exclude={school.school_name}
              onSelect={s => { setCompareSchool(s); setShowComparePicker(false) }}
            />
          </div>
        )}

        {/* Double rule */}
        <div className="border-t-2 border-[#1a1a18] pt-1 mb-1"><div className="border-t border-[#1a1a18]" /></div>

        {!isComparing ? (
          /* ── SINGLE VIEW ── */
          <>
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
                    {Object.values(school.cluster_scores).sort((a, b) => b.school_preparation_score - a.school_preparation_score).slice(0, 5).map(c => (
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

                {Object.values(school.cluster_scores).filter(c => c.alignment < -2).length > 0 && (
                  <div className="border border-amber-200 rounded bg-amber-50 p-5">
                    <h3 className="text-xs font-mono text-amber-700 uppercase tracking-wider mb-4">Curriculum Gaps</h3>
                    <div className="space-y-2">
                      {Object.values(school.cluster_scores).filter(c => c.alignment < -2).sort((a, b) => a.alignment - b.alignment).slice(0, 3).map(c => (
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
                    {Object.entries(school.pedagogy_distribution).map(([method, count]) => (
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
          </>
        ) : (
          /* ── COMPARE VIEW ── */
          <>
            <div className="py-4 border-b border-[#c8c0b0] mb-8">
              <p className="text-xs font-mono text-[#a09890] uppercase tracking-wider">Comparing schools · National market</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <SchoolColumn school={school} domainScores={usDomainScores} label="School A" />
              {compareDomainScores && (
                <SchoolColumn school={compareSchool!} domainScores={compareDomainScores} label="School B" />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
