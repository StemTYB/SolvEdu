import { useState } from 'react'

import { ChartTooltip, type TooltipState } from '@/components/charts/ChartTooltip'
import { ColorDot } from '@/components/ui/Badge'
import { SUBMISSION_STATES } from '@/data/submissions'
import type { SubmissionState } from '@/data/types'
import { cn } from '@/lib/format'
import { STATE_META } from '@/lib/presentation'

interface PipelineBarProps {
  counts: Record<SubmissionState, number>
  className?: string
}

const stateColor = (state: SubmissionState) => `var(${STATE_META[state].varName})`

/**
 * Where every open report currently sits in the pipeline. States are a
 * categorical encoding (five workflow stages, no good/bad ordering), so they
 * take the validated categorical slots in order — and the legend below always
 * names each one, so identity never rests on colour.
 */
export function PipelineBar({ counts, className }: PipelineBarProps) {
  const [tip, setTip] = useState<TooltipState | null>(null)
  const total = SUBMISSION_STATES.reduce((sum, state) => sum + counts[state], 0)

  if (total === 0) return null

  return (
    <div className={cn('relative', className)}>
      {/* The surface gap between segments is 2px of panel, not a stroke. */}
      <div className="flex h-3.5 w-full gap-0.5" onMouseLeave={() => setTip(null)}>
        {SUBMISSION_STATES.map((state, index) => {
          const count = counts[state]
          if (count === 0) return null
          const share = count / total

          return (
            <div
              key={state}
              className={cn(
                'h-full',
                index === SUBMISSION_STATES.length - 1 && 'rounded-r-[4px]',
              )}
              style={{ flexGrow: count, backgroundColor: stateColor(state) }}
              onMouseEnter={(event) => {
                const host = event.currentTarget.parentElement?.parentElement
                if (!host) return
                const bounds = host.getBoundingClientRect()
                const own = event.currentTarget.getBoundingClientRect()
                setTip({
                  x: own.left - bounds.left + own.width / 2,
                  y: own.top - bounds.top,
                  title: state,
                  rows: [
                    { label: 'Reports', value: String(count), color: stateColor(state) },
                    { label: 'Share', value: `${(share * 100).toFixed(1)}%` },
                  ],
                })
              }}
            >
              <span className="sr-only">
                {state}: {count} of {total}
              </span>
            </div>
          )
        })}
      </div>

      <ChartTooltip tip={tip} />

      {/* Legend — always present for two or more series, and the relief that
          makes the light-mode contrast warning compliant. */}
      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 lg:grid-cols-5">
        {SUBMISSION_STATES.map((state) => (
          <li key={state} className="flex items-center gap-2 text-[12px]">
            <ColorDot color={stateColor(state)} />
            <span className="truncate text-ink-muted">{state}</span>
            <span className="ml-auto font-semibold tabular-nums text-ink">{counts[state]}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
