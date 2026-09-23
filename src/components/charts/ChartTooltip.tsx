export interface TooltipRow {
  label: string
  value: string
  color?: string
}

export interface TooltipState {
  /** Position within the chart's relative container, in px. */
  x: number
  y: number
  title: string
  rows: TooltipRow[]
}

/**
 * A floating readout anchored to the hovered mark. Rendered inside a
 * `relative` chart container; pointer events are off so it never steals the
 * hover from the mark underneath it.
 */
export function ChartTooltip({ tip }: { tip: TooltipState | null }) {
  if (!tip) return null

  return (
    <div
      role="tooltip"
      className="glass pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-xl px-3 py-2 whitespace-nowrap shadow-glass"
      style={{ left: tip.x, top: tip.y }}
    >
      <p className="text-[12px] font-semibold text-ink">{tip.title}</p>
      <dl className="mt-1 space-y-0.5">
        {tip.rows.map((row) => (
          <div key={row.label} className="flex items-center gap-2 text-[11.5px]">
            {row.color && (
              <span
                aria-hidden="true"
                className="size-2 rounded-full"
                style={{ backgroundColor: row.color }}
              />
            )}
            <dt className="text-ink-muted">{row.label}</dt>
            <dd className="ml-auto font-semibold tabular-nums text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
