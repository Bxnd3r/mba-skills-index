'use client'
import { useState } from 'react'

interface Job { title: string; location?: string }
interface Props { jobs: Job[] }

export default function JobTicker({ jobs }: Props) {
  const [paused, setPaused] = useState(false)
  const doubled = [...jobs, ...jobs]

  return (
    <div className="border-t border-b border-[#c8c0b0] bg-[#ede8de] py-3 overflow-hidden">
      <div className="flex items-center gap-4 mb-1.5 px-6">
        <span className="flex items-center gap-2 text-xs font-mono text-[#10b981] shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
          LIVE JOB FEED
        </span>
        <span className="text-xs text-[#a09890] font-mono">MBA-level positions · last 30 days</span>
      </div>
      <div className="overflow-hidden cursor-pointer"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}>
        <div className="flex gap-10 whitespace-nowrap"
          style={{ animation: 'ticker 80s linear infinite', animationPlayState: paused ? 'paused' : 'running' }}>
          {doubled.map((job, i) => (
            <span key={i} className="flex items-center gap-3 text-sm text-[#6b6557] shrink-0">
              <span className="w-1 h-1 rounded-full bg-[#c8c0b0]" />
              <span>{job.title}</span>
              {job.location && <span className="text-xs text-[#a09890] font-mono">{job.location}</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
