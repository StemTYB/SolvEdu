import { cn } from '@/lib/format'

interface MeterProps {
  /** Fill fraction, 0–1. */
  value: number
  tone?: string
  className?: string
  height?: number
  /** Segments the bar into discrete steps, e.g. difficulty pips. */
  segments?: number
}

/**
 * A progress meter. The unfilled track is a lighter step of the fill's own
 * ramp, so the whole bar reads as one scale rather than two colours.
 */
export function Meter({ value, tone = 'var(--solv-brand)', className, height = 6, segments }: MeterProps) {
  const clamped = Math.min(1, Math.max(0, value))

  if (segments) {
    return (
      <div className={cn('flex gap-1', className)} role="presentation">
        {Array.from({ length: segments }, (_, index) => (
          <span
            key={index}
            className="h-1.5 flex-1 rounded-full"
            style={{
              backgroundColor:
                index < Math.round(clamped * segments)
                  ? tone
                  : `color-mix(in oklab, ${tone} 20%, transparent)`,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn('w-full overflow-hidden rounded-full', className)}
      style={{
        height,
        backgroundColor: `color-mix(in oklab, ${tone} 20%, transparent)`,
      }}
      role="progressbar"
      aria-valuenow={Math.round(clamped * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full transition-[width] duration-500"
        style={{ width: `${clamped * 100}%`, backgroundColor: tone }}
      />
    </div>
  )
}
