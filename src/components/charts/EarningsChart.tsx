import { useState } from 'react'

import { ChartTooltip, type TooltipState } from '@/components/charts/ChartTooltip'
import type { MonthlyEarnings } from '@/data/types'
import { cn, formatUsd } from '@/lib/format'

interface EarningsChartProps {
  data: MonthlyEarnings[]
  className?: string
}

const TONE = 'var(--viz-series-1)'
const HEIGHT = 168

/** Rounds an axis maximum up to a clean 1 / 2 / 5 × 10ⁿ step. */
function niceMax(value: number): number {
  const magnitude = 10 ** Math.floor(Math.log10(value))
  for (const step of [1, 1.5, 2, 2.5, 3, 4, 5, 7.5, 10]) {
    const candidate = step * magnitude
    if (candidate >= value) return candidate
  }
  return 10 * magnitude
}

function formatTick(value: number): string {
  if (value === 0) return '0'
  if (value >= 1_000) return `${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)}K`
  return String(value)
}

/**
 * Settled reward by month. A single series, so there is no legend box — the
 * panel title names what is plotted. Only the peak and the current month carry
 * a direct label; the axis and the hover readout carry the rest.
 */
export function EarningsChart({ data, className }: EarningsChartProps) {
  const [tip, setTip] = useState<TooltipState | null>(null)

  const max = niceMax(Math.max(...data.map((month) => month.amount)))
  const peakIndex = data.reduce(
    (best, month, index) => (month.amount > data[best].amount ? index : best),
    0,
  )
  const lastIndex = data.length - 1
  const ticks = [max, max / 2, 0]

  return (
    <div className={cn('relative', className)}>
      <div className="flex gap-3">
        {/* Axis ticks sit outside the plot area so no bar overlaps its own label. */}
        <div
          className="flex w-9 shrink-0 flex-col justify-between text-right text-[11px] tabular-nums text-ink-faint"
          style={{ height: HEIGHT }}
          aria-hidden="true"
        >
          {ticks.map((tick) => (
            <span key={tick}>{formatTick(tick)}</span>
          ))}
        </div>

        <div className="relative min-w-0 flex-1">
          {/* Recessive hairline gridlines, solid, one step off the surface. */}
          <div
            className="pointer-events-none absolute inset-0 flex flex-col justify-between"
            style={{ height: HEIGHT }}
            aria-hidden="true"
          >
            {ticks.map((tick, index) => (
              <span
                key={tick}
                className="block w-full"
                style={{
                  borderTop: `1px solid ${index === ticks.length - 1 ? 'var(--viz-axis)' : 'var(--viz-grid)'}`,
                }}
              />
            ))}
          </div>

          <div className="relative flex items-end gap-0.5" style={{ height: HEIGHT }}>
            {data.map((month, index) => {
              const isEmphasised = index === peakIndex || index === lastIndex
              const heightPct = (month.amount / max) * 100

              return (
                <button
                  key={month.period}
                  type="button"
                  className="group relative flex h-full min-w-0 flex-1 cursor-default items-end"
                  onMouseEnter={(event) => {
                    const host = event.currentTarget.parentElement?.parentElement?.parentElement
                    if (!host) return
                    const bounds = host.getBoundingClientRect()
                    const own = event.currentTarget.getBoundingClientRect()
                    setTip({
                      x: own.left - bounds.left + own.width / 2,
                      y: own.top - bounds.top + (HEIGHT * (100 - heightPct)) / 100,
                      // The year comes from the period key, not a literal: the
                      // series crosses a year boundary.
                      title: `${month.label} ${month.period.slice(0, 4)}`,
                      rows: [
                        { label: 'Liquidado', value: formatUsd(month.amount) },
                        { label: 'Recompensas', value: String(month.payouts) },
                      ],
                    })
                  }}
                  onMouseLeave={() => setTip(null)}
                  onFocus={() => setTip(null)}
                >
                  <span
                    className="block w-full max-w-6 transition-opacity duration-150 group-hover:opacity-80"
                    style={{
                      height: `${Math.max(heightPct, 1.5)}%`,
                      backgroundColor: TONE,
                      opacity: isEmphasised ? 1 : 0.42,
                      // 4px rounded data-end, square at the baseline.
                      borderTopLeftRadius: 4,
                      borderTopRightRadius: 4,
                    }}
                  />
                  <span className="sr-only">
                    {month.label} {month.period.slice(0, 4)}: {formatUsd(month.amount)} en{' '}
                    {month.payouts} recompensas
                  </span>
                </button>
              )
            })}
          </div>

          {/* Direct labels ride only the peak and the current month. */}
          <div className="relative mt-2 flex gap-0.5">
            {data.map((month, index) => (
              <span
                key={month.period}
                className="min-w-0 flex-1 text-center text-[10.5px] font-medium text-ink-faint"
              >
                {index === peakIndex || index === lastIndex ? (
                  <span className="font-semibold text-ink">{month.label}</span>
                ) : (
                  month.label
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      <ChartTooltip tip={tip} />
    </div>
  )
}
