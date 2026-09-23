import type { ReactNode } from 'react'

import { cn } from '@/lib/format'

interface SectionHeadingProps {
  /** Short uppercase kicker above the title. */
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function SectionHeading({ eyebrow, title, description, action, className }: SectionHeadingProps) {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-4', className)}>
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-[11px] font-semibold tracking-[0.16em] text-ink-faint uppercase">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-1.5 text-[19px] leading-tight font-semibold tracking-tight text-ink">
          {title}
        </h2>
        {description && <p className="mt-1.5 max-w-2xl text-[13.5px] text-ink-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

/** Page-level title block. One per view. */
export function ViewHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-[26px] leading-tight font-bold tracking-tight text-ink sm:text-[30px]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-3xl text-[14px] leading-relaxed text-ink-muted">{description}</p>
        )}
      </div>
      {action && <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div>}
    </div>
  )
}
