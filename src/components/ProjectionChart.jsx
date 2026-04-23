import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { formatCHF, formatCHFCompact } from '../utils/formatting.js'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl p-3 text-xs" style={{ background: 'var(--navy-mid)', border: '1px solid var(--navy-light)' }}>
      <p className="font-semibold mb-2" style={{ color: 'var(--cream)' }}>Age {label}</p>
      {payload.map(entry => (
        <div key={entry.dataKey} className="flex justify-between gap-4 mb-1">
          <span style={{ color: entry.color ?? 'var(--cream-dim)' }}>{entry.name}</span>
          <span className="font-medium" style={{ color: 'var(--cream)' }}>{formatCHF(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function ProjectionChart({ data }) {
  if (!data?.length) return null

  const ticks = []
  if (data.length > 0) {
    ticks.push(data[0].age)
    for (let a = Math.ceil(data[0].age / 5) * 5; a < 65; a += 5) ticks.push(a)
    ticks.push(65)
  }

  const maxVal = Math.max(...data.map(d => d.investedThreeA))
  const yMax = Math.ceil(maxVal * 1.1 / 50000) * 50000

  return (
    <div style={{ touchAction: 'pan-y' }}>
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#C9A84C" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" vertical={false} />
        <XAxis
          dataKey="age"
          ticks={ticks}
          tick={{ fill: 'var(--cream-dim)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          label={{ value: 'Age', position: 'insideBottom', offset: -2, fill: 'var(--cream-dim)', fontSize: 11 }}
        />
        <YAxis
          domain={[0, yMax]}
          tickFormatter={v => v >= 1000 ? `${v/1000}k` : v}
          tick={{ fill: 'var(--cream-dim)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={52}
        />
        <Tooltip content={<CustomTooltip />} />

        <Area
          type="monotone"
          dataKey="noThreeA"
          name="No 3a"
          stroke="rgba(168,160,144,.4)"
          strokeWidth={1.5}
          strokeDasharray="4 3"
          fill="transparent"
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="cashThreeA"
          name="Cash 3a"
          stroke="rgba(168,160,144,.7)"
          strokeWidth={1.5}
          fill="transparent"
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="investedThreeA"
          name="Invested 3a"
          stroke="#C9A84C"
          strokeWidth={2.5}
          fill="url(#goldFill)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
    </div>
  )
}
