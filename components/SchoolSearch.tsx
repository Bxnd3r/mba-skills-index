'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SchoolResult, slugify } from '@/lib/data'

interface Props { schools: SchoolResult[]; large?: boolean }

export default function SchoolSearch({ schools, large }: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const filtered = query.length > 0
    ? schools.filter(s => s.school_name.toLowerCase().includes(query.toLowerCase()) && s.overall_alignment_score !== null).slice(0, 8)
    : []

  useEffect(() => { setHighlighted(0) }, [filtered.length])

  const go = (school: SchoolResult) => {
    router.push(`/school/${slugify(school.school_name)}`)
    setQuery(''); setOpen(false)
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted(h => Math.min(h + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)) }
    if (e.key === 'Enter' && filtered[highlighted]) go(filtered[highlighted])
    if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur() }
  }

  return (
    <div className={`relative w-full ${large ? 'max-w-2xl' : 'max-w-md'}`}>
      <div className={`flex items-center gap-3 bg-white border rounded transition-all ${
        open && filtered.length > 0 ? 'border-[#1a1a18] shadow-sm' : 'border-[#c8c0b0] hover:border-[#6b6557]'
      } ${large ? 'px-5 py-3.5' : 'px-4 py-2.5'}`}>
        <svg className="w-4 h-4 text-[#a09890] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input ref={inputRef} type="text" value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={onKey}
          placeholder="Search business schools…"
          className={`bg-transparent flex-1 outline-none text-[#1a1a18] placeholder-[#a09890] font-body ${large ? 'text-base' : 'text-sm'}`}
        />
        {query && (
          <button onClick={() => { setQuery(''); setOpen(false) }} className="text-[#a09890] hover:text-[#1a1a18] text-lg leading-none transition-colors">×</button>
        )}
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#c8c0b0] rounded shadow-lg overflow-hidden z-50">
          {filtered.map((school, i) => (
            <button key={school.school_name} onClick={() => go(school)}
              className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                i === highlighted ? 'bg-[#f2ede4]' : 'hover:bg-[#f8f5f0]'
              } ${i > 0 ? 'border-t border-[#ede8de]' : ''}`}>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm text-[#1a1a18] truncate">{school.school_name}</span>
                <span className="text-xs text-[#a09890] font-mono truncate">{school.school_location || 'Location unknown'}</span>
              </div>
              <div className="flex flex-col items-end shrink-0 ml-4">
                <span className="text-sm font-mono font-medium text-[#10b981]">{school.overall_alignment_score?.toFixed(1)}</span>
                <span className="text-[10px] text-[#a09890]">alignment</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {open && query.length > 0 && filtered.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#c8c0b0] rounded px-4 py-3 text-sm text-[#a09890] z-50">
          No schools found for "{query}"
        </div>
      )}
    </div>
  )
}
