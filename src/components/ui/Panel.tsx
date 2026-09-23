import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/format'

interface PanelProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  /** Drops the frosted surface — for panels nested inside another panel. */
  inset?: boolean
  /** Suppresses the top gloss hairline. */
  flat?: boolean
}

/**
 * The liquid-glass surface every view is built from: a translucent,
 * backdrop-blurred pane with a hairline border and a gloss along its top edge.
 */
export function Panel({ children, className, inset, flat, ...rest }: PanelProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-3xl',
        inset ? 'glass-soft' : 'glass',
        className,
      )}
      {...rest}
    >
      {!flat && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-[var(--solv-sheen)] to-transparent"
        />
      )}
      {children}
    </section>
  )
}

interface PanelHeaderProps {
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  icon?: ReactNode
  className?: string
}

export function PanelHeader({ title, description, action, icon, className }: PanelHeaderProps) {
  return (
    <header className={cn('flex items-start justify-between gap-4 px-5 pt-5 sm:px-6', className)}>
      <div className="flex min-w-0 items-start gap-3">
        {icon && (
          <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-brand-wash text-brand-ink">
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <h2 className="text-[15px] leading-tight font-semibold text-ink">{title}</h2>
          {description && (
            <p className="mt-1 text-[13px] leading-snug text-ink-muted">{description}</p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  )
}
