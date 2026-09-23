import { useState } from 'react'

import { ChartTooltip, type TooltipState } from '@/components/charts/ChartTooltip'
import { Icon } from '@/components/ui/Icon'
import type { Severity } from '@/data/types'
import { cn } from '@/lib/format'
import { SEVERITIES, SEVERITY_META } from '@/lib/presentation'

interface SeverityBarsProps {
  counts: Record<Severity, number>
  className?: string
  /** Names what the bars count, for the accessible summary and the tooltip. */
  unit?: string
}

/**
 * Findings by severity. Severity wears the reserved status palette and every
 * bar is labelled with its icon and name, so the level survives full-severity
 * colour blindness. Bars grow from a shared baseline; the value sits at the tip.
 */
export function SeverityBars({ counts, className, unit = 'Hallazgos' }: SeverityBarsProps) {
  const [tip, setTip] = useState<TooltipState | null>(null)
  const max = Math.max(...SEVERITIES.map((severity) => counts[severity]), 1)
  const total = SEVERITIES.reduce((sum, severity) => sum + counts[severity], 0)

  // Highest severity first — the order a triager reads in.
  const ordered = [...SEVERITIES].reverse()

  return (
    <div className={cn('relative', className)}>
      <ul className="space-y-3">
        {ordered.map((severity) => {
          const count = counts[severity]
          const meta = SEVERITY_META[severity]

          return (
            <li key={severity} className="flex items-center gap-3">
              <span className="flex w-[104px] shrink-0 items-center gap-1.5 text-[12px] text-ink-muted">
                <Icon name={meta.icon} size={13} style={{ color: meta.color }} />
                {severity}
              </span>

              <span
                className="relative flex h-2.5 min-w-0 flex-1 items-center"
                onMouseEnter={(event) => {
                  const host = event.currentTarget.closest('ul')?.parentElement
                  if (!host) return
                  const bounds = host.getBoundingClientRect()
                  const own = event.currentTarget.getBoundingClientRect()
                  setTip({
                    x: own.left - bounds.left + (own.width * count) / max / 2,
                    y: own.top - bounds.top,
                    title: severity,
                    rows: [
                      { label: unit, value: String(count), color: meta.color },
                      {
                        label: 'Proporción',
                        value: total ? `${((count / total) * 100).toFixed(0)} %` : '0 %',
                      },
                    ],
                  })
                }}
                onMouseLeave={() => setTip(null)}
              >
                <span
                  className="block h-full rounded-r-[4px] transition-[width] duration-500"
                  style={{
                    width: `${(count / max) * 100}%`,
                    backgroundColor: meta.color,
                    minWidth: count > 0 ? 3 : 0,
                  }}
                />
              </span>

              <span className="w-8 shrink-0 text-right text-[12.5px] font-semibold tabular-nums text-ink">
                {count}
              </span>
            </li>
          )
        })}
      </ul>

      <ChartTooltip tip={tip} />
    </div>
  )
}
