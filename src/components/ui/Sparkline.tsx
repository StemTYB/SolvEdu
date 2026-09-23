import type { TrendPoint } from '@/data/types'
import { cn } from '@/lib/format'

interface SparklineProps {
  points: TrendPoint[]
  /** Series colour for the current period and its end marker. */
  tone: string
  /** Accessible name — sparklines carry no axis, so they need one in words. */
  label: string
  width?: number
  height?: number
  /** Set when a falling line is the good outcome, e.g. rank position. */
  invert?: boolean
  className?: string
}

const PAD = 5

/**
 * A twelve-point trend line for a stat tile. The history sits in the
 * de-emphasis hue; the current period and its end marker carry the series
 * colour, so the eye lands on "now" without a label on every point.
 */
export function Sparkline({
  points,
  tone,
  label,
  width = 132,
  height = 40,
  invert,
  className,
}: SparklineProps) {
  if (points.length < 2) return null

  const values = points.map((point) => point.value)
  const rawMin = Math.min(...values)
  const rawMax = Math.max(...values)
  const span = rawMax - rawMin || 1
  const min = rawMin - span * 0.18
  const max = rawMax + span * 0.18

  const stepX = (width - PAD * 2) / (points.length - 1)
  const scaleY = (value: number) => {
    const ratio = (value - min) / (max - min)
    const oriented = invert ? 1 - ratio : ratio
    return height - PAD - oriented * (height - PAD * 2)
  }

  const coords = points.map((point, index) => ({
    x: PAD + index * stepX,
    y: scaleY(point.value),
  }))

  const line = coords.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(' ')
  const tail = coords.slice(-2)
  const last = coords[coords.length - 1]

  return (
    <svg
      role="img"
      aria-label={label}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn('overflow-visible', className)}
    >
      <polyline
        points={line}
        fill="none"
        stroke="color-mix(in oklab, var(--solv-ink-faint) 55%, transparent)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Current period, in the series colour. */}
      <polyline
        points={`${tail[0].x.toFixed(2)},${tail[0].y.toFixed(2)} ${tail[1].x.toFixed(2)},${tail[1].y.toFixed(2)}`}
        fill="none"
        stroke={tone}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* 2px ring in the surface colour keeps the marker legible where it crosses the line. */}
      <circle cx={last.x} cy={last.y} r={4} fill={tone} stroke="var(--viz-surface)" strokeWidth={2} />
    </svg>
  )
}
