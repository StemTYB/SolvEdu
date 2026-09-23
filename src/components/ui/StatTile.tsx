import { Icon, type IconName } from '@/components/ui/Icon'
import { Panel } from '@/components/ui/Panel'
import { Sparkline } from '@/components/ui/Sparkline'
import type { TrendPoint } from '@/data/types'
import { cn, signedPercent } from '@/lib/format'

interface DeltaProps {
  /** Signed percentage change, e.g. `12.4`. */
  value: number
  period: string
  /** Set false when a fall is the good outcome, e.g. rank position. */
  goodWhenUp?: boolean
  className?: string
}

/**
 * A signed change against a named period. Direction is carried by the arrow and
 * the sign as well as the colour, so it survives a colourblind reader.
 */
export function Delta({ value, period, goodWhenUp = true, className }: DeltaProps) {
  const isFlat = value === 0
  const isGood = goodWhenUp ? value > 0 : value < 0
  const tone = isFlat ? 'var(--solv-ink-faint)' : isGood ? 'var(--solv-delta-up)' : 'var(--solv-delta-down)'

  return (
    <span className={cn('inline-flex items-center gap-1 text-[12.5px] font-semibold', className)}>
      <Icon
        name={isFlat ? 'subtract' : value > 0 ? 'trending-up' : 'arrow-down'}
        size={13}
        style={{ color: tone }}
      />
      <span style={{ color: tone }}>{isFlat ? 'sin cambios' : signedPercent(value)}</span>
      <span className="font-normal text-ink-faint">{period}</span>
    </span>
  )
}

interface StatTileProps {
  label: string
  value: string
  icon: IconName
  /** Small caption under the value — units, pool size, or a qualifier. */
  caption?: string
  delta?: DeltaProps
  trend?: TrendPoint[]
  trendTone?: string
  /** When true the sparkline is inverted, so "down" renders as an upward line. */
  invertTrend?: boolean
}

export function StatTile({
  label,
  value,
  icon,
  caption,
  delta,
  trend,
  trendTone = 'var(--viz-series-1)',
  invertTrend,
}: StatTileProps) {
  return (
    <Panel className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-ink-muted">
            <Icon name={icon} size={15} />
            <span className="truncate text-[12.5px] font-medium">{label}</span>
          </div>
          {/*
            Proportional figures on purpose: tabular-nums gives every digit the
            width of a zero, which reads loose at display sizes.
          */}
          <p className="mt-2 text-[28px] leading-none font-semibold tracking-tight text-ink">
            {value}
          </p>
          {caption && <p className="mt-1.5 text-[12px] text-ink-faint">{caption}</p>}
        </div>

        {trend && (
          <Sparkline
            points={trend}
            tone={trendTone}
            invert={invertTrend}
            label={`${label} en los últimos doce meses`}
            width={104}
            height={44}
            className="mt-1 hidden shrink-0 sm:block"
          />
        )}
      </div>

      {delta && <Delta {...delta} className="mt-4" />}
    </Panel>
  )
}
