import type { ReactNode } from 'react'

import { Icon, type IconName } from '@/components/ui/Icon'
import type { Severity, SubmissionState } from '@/data/types'
import { STATE_META, SEVERITY_META } from '@/lib/presentation'
import { cn } from '@/lib/format'

interface ChipProps {
  children: ReactNode
  icon?: IconName
  className?: string
  /** Any CSS colour. Used for a tinted fill and a matching icon — never for the label text. */
  tone?: string
  size?: 'xs' | 'sm'
}

/**
 * A tinted pill. The hue lives in the fill and the icon; the label stays in ink
 * so it clears contrast in both themes regardless of how light the hue is.
 */
export function Chip({ children, icon, className, tone, size = 'sm' }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap',
        size === 'xs' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-[12px]',
        tone
          ? 'border-transparent text-ink'
          : 'border-hairline bg-glass-soft text-ink-muted',
        className,
      )}
      style={
        tone
          ? {
              backgroundColor: `color-mix(in oklab, ${tone} 16%, transparent)`,
              boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${tone} 34%, transparent)`,
            }
          : undefined
      }
    >
      {icon && (
        <Icon
          name={icon}
          size={size === 'xs' ? 12 : 13}
          style={tone ? { color: tone } : undefined}
        />
      )}
      {children}
    </span>
  )
}

/**
 * Severity wears the reserved status palette and always ships as icon + label,
 * so the level never rests on colour alone.
 */
export function SeverityBadge({
  severity,
  size = 'sm',
}: {
  severity: Severity
  size?: 'xs' | 'sm'
}) {
  const meta = SEVERITY_META[severity]
  return (
    <Chip tone={meta.color} icon={meta.icon} size={size}>
      {severity}
    </Chip>
  )
}

/** Pipeline state, encoded categorically — the label always names the state. */
export function StateBadge({
  state,
  size = 'sm',
}: {
  state: SubmissionState
  size?: 'xs' | 'sm'
}) {
  const meta = STATE_META[state]
  return (
    <Chip tone={`var(${meta.varName})`} icon={meta.icon} size={size}>
      {state}
    </Chip>
  )
}

/** A small solid dot in a series colour, for legends and inline keys. */
export function ColorDot({ color, className }: { color: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('inline-block size-2.5 shrink-0 rounded-full', className)}
      style={{ backgroundColor: color }}
    />
  )
}
