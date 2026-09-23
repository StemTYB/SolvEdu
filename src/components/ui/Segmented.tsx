import type { ReactNode } from 'react'

import { cn } from '@/lib/format'

export interface SegmentedOption<T extends string> {
  value: T
  label: string
  count?: number
}

interface SegmentedProps<T extends string> {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  /** Accessible name for the group. */
  label: string
  className?: string
}

/**
 * A single-select pill group. Selecting the "All" option is an explicit entry in
 * the list rather than a cleared state, so the current filter is always named.
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: SegmentedProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn('inline-flex flex-wrap items-center gap-1', className)}
    >
      {options.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[12.5px] font-semibold transition duration-150',
              selected
                ? 'bg-linear-to-br from-[var(--solv-brand)] to-[var(--solv-accent)] text-on-brand'
                : 'text-ink-muted hover:bg-glass-soft hover:text-ink',
            )}
          >
            {option.label}
            {option.count !== undefined && (
              <span className={cn('tabular-nums', selected ? 'opacity-80' : 'text-ink-faint')}>
                {option.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

interface FilterChipProps {
  active: boolean
  onClick: () => void
  children: ReactNode
  /** Series colour used as a leading key when the chip selects a category. */
  keyColor?: string
  count?: number
}

/** A multi-select filter pill. */
export function FilterChip({ active, onClick, children, keyColor, count }: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[12.5px] font-medium transition duration-150',
        active
          ? 'border-transparent bg-brand-wash text-ink'
          : 'border-hairline bg-glass-soft text-ink-muted hover:text-ink',
      )}
      style={
        active
          ? { boxShadow: 'inset 0 0 0 1px color-mix(in oklab, var(--solv-brand) 45%, transparent)' }
          : undefined
      }
    >
      {keyColor && (
        <span
          aria-hidden="true"
          className="size-2 rounded-full"
          style={{ backgroundColor: keyColor, opacity: active ? 1 : 0.5 }}
        />
      )}
      {children}
      {count !== undefined && <span className="tabular-nums text-ink-faint">{count}</span>}
    </button>
  )
}
