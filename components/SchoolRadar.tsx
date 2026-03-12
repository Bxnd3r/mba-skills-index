'use client'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'

interface RadarDataPoint { domain: string; school: number; market: number }
interface Props {
  data: RadarDataPoint[]
  schoolName: string
  compareData?: RadarDataPoint[]
  compareName?: string
}

const CustomTooltip = ({ active, payload, compareName }: any) => {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  return (
    <div className="bg-[#f2ede4] border border-[#c8c0b0] rounded px-3 py-2 text-xs shadow-md">
      <p className="font-display font-semibold text-[#1a1a18] mb-1">{d.domain}</p>
      <p style={{ color: '#10b981' }}>School A: {d.school.toFixed(1)}</p>
      {d.compare !== undefined && <p style={{ color: '#6366f1' }}>School B: {d.compare.toFixed(1)}</p>}
      <p style={{ color: '#c8c0b0' }}>Market: {d.market.toFixed(1)}</p>
    </div>
  )
}

const CustomTick = ({ x, y, payload }: any) => {
  const words = payload.value.split(' ')
  const lines: string[][] = []
  let cur: string[] = []
  words.forEach((w: string) => { cur.push(w); if (cur.join(' ').length > 14) { lines.push(cur); cur = [] } })
  if (cur.length) lines.push(cur)
  return (
    <g>
      {lines.map((line, i) => (
        <text key={i} x={x} y={y + (i - (lines.length - 1) / 2) * 12}
          textAnchor="middle" fill="#6b6557" fontSize={10} fontFamily="DM Sans, sans-serif">
          {line.join(' ')}
        </text>
      ))}
    </g>
  )
}

export default function SchoolRadar({ data, schoolName, compareData, compareName }: Props) {
  // Merge compare data into main data if present
  const mergedData = compareData
    ? data.map(d => ({ ...d, compare: compareData.find(c => c.domain === d.domain)?.school ?? 0 }))
    : data

  return (
    <div className="radar-container w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={mergedData} margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
          <PolarGrid stroke="#c8c0b0" gridType="polygon" />
          <PolarAngleAxis dataKey="domain" tick={<CustomTick />} />
          <Radar name="Market" dataKey="market" stroke="#c8c0b0" fill="#c8c0b0" fillOpacity={0.15} strokeWidth={1.5} strokeDasharray="4 4" />
          <Radar name={schoolName} dataKey="school" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
          {compareData && (
            <Radar name={compareName} dataKey="compare" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
          )}
          <Tooltip content={<CustomTooltip compareName={compareName} />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
