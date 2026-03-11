'use client'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'

interface RadarDataPoint { domain: string; school: number; market: number }
interface Props { data: RadarDataPoint[]; schoolName: string }

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  return (
    <div className="bg-[#f2ede4] border border-[#c8c0b0] rounded px-3 py-2 text-xs shadow-md">
      <p className="font-display font-semibold text-[#1a1a18] mb-1">{d.domain}</p>
      <p style={{ color: '#10b981' }}>School: {d.school.toFixed(1)}</p>
      <p style={{ color: '#6b6557' }}>Market: {d.market.toFixed(1)}</p>
      <p className={`mt-1 ${d.school > d.market ? 'text-[#10b981]' : 'text-amber-700'}`}>
        {d.school > d.market ? `+${(d.school - d.market).toFixed(1)} over-prepared` : `${(d.school - d.market).toFixed(1)} gap`}
      </p>
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

export default function SchoolRadar({ data, schoolName }: Props) {
  return (
    <div className="radar-container w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
          <PolarGrid stroke="#c8c0b0" gridType="polygon" />
          <PolarAngleAxis dataKey="domain" tick={<CustomTick />} />
          <Radar name="Market" dataKey="market" stroke="#c8c0b0" fill="#c8c0b0" fillOpacity={0.15} strokeWidth={1.5} strokeDasharray="4 4" />
          <Radar name={schoolName} dataKey="school" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
