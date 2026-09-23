import { Chip } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Monogram } from '@/components/ui/Monogram'
import { Panel } from '@/components/ui/Panel'
import type { Program } from '@/data/types'
import { company } from '@/data/companies'
import { cn, compactNumber, daysUntil, formatDate } from '@/lib/format'
import { DIFFICULTY_META } from '@/lib/presentation'

interface ProgramCardProps {
  program: Program
  onOpen?: (program: Program) => void
  /** Hides the summary and stack for use in dense rails. */
  compact?: boolean
  className?: string
}

function DifficultyPips({ program }: { program: Program }) {
  const meta = DIFFICULTY_META[program.difficulty]
  return (
    <span className="inline-flex items-center gap-1.5" title={meta.hint}>
      <span aria-hidden="true" className="flex gap-0.5">
        {Array.from({ length: 4 }, (_, index) => (
          <span
            key={index}
            className={cn('size-1.5 rounded-full', index < meta.dots ? 'bg-brand' : 'bg-hairline')}
          />
        ))}
      </span>
      <span className="text-[11.5px] text-ink-muted">{program.difficulty}</span>
    </span>
  )
}

export function ProgramCard({ program, onOpen, compact, className }: ProgramCardProps) {
  const employer = company(program.companyId)
  const days = daysUntil(program.deadline)
  const closingSoon = days <= 21

  return (
    <Panel
      className={cn(
        'flex flex-col p-4 transition duration-200 hover:border-[color-mix(in_oklab,var(--solv-brand)_38%,transparent)] sm:p-5',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <Monogram text={employer.monogram} accent={employer.accent} size="md" />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="truncate text-[12.5px] font-semibold text-ink">{employer.name}</p>
            <Chip tone="var(--solv-brand)" size="xs">
              {Math.round(program.match * 100)}% match
            </Chip>
          </div>
          <h3 className="mt-1 text-[14.5px] leading-snug font-semibold text-ink">
            {program.title}
          </h3>
        </div>
      </div>

      {!compact && (
        <p className="mt-3 text-[12.5px] leading-relaxed text-ink-muted">{program.summary}</p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
        <Chip size="xs">{program.category}</Chip>
        <Chip size="xs">{program.scope}</Chip>
        <DifficultyPips program={program} />
        {program.safeHarbor && (
          <Chip size="xs" icon="shield">
            Safe Harbor
          </Chip>
        )}
      </div>

      {!compact && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {program.stack.map((entry) => (
            <span
              key={entry}
              className="rounded-md border border-hairline-soft bg-glass-soft px-2 py-0.5 font-mono text-[10.5px] text-ink-muted"
            >
              {entry}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto pt-4">
        <div className="flex flex-wrap items-end justify-between gap-3 border-t border-hairline-soft pt-3.5">
          <div>
            <p className="text-[10.5px] font-semibold tracking-[0.14em] text-ink-faint uppercase">
              Bounty
            </p>
            <p className="mt-0.5 text-[15px] font-semibold tracking-tight text-ink">
              {compactNumber(program.bountyMin)} – {compactNumber(program.bountyMax)}{' '}
              <span className="text-[12px] font-medium text-ink-muted">
                {employer.currency.code}
              </span>
            </p>
          </div>

          <div className="text-right">
            <p
              className="inline-flex items-center gap-1 text-[12px] font-medium"
              style={{ color: closingSoon ? 'var(--solv-delta-down)' : 'var(--solv-ink-muted)' }}
            >
              <Icon name="clock" size={13} />
              {days} days left
            </p>
            <p className="mt-0.5 text-[11px] text-ink-faint">
              {program.submissions} reports · closes {formatDate(program.deadline)}
            </p>
          </div>
        </div>

        {onOpen && (
          <Button
            variant="quiet"
            size="sm"
            block
            className="mt-3"
            trailingIcon="chevron-right"
            onClick={() => onOpen(program)}
          >
            Open brief
          </Button>
        )}
      </div>
    </Panel>
  )
}
