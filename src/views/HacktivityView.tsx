import { useMemo, useState } from 'react'

import { Chip, SeverityBadge, StateBadge } from '@/components/ui/Badge'
import { Icon } from '@/components/ui/Icon'
import { Monogram, initialsOf } from '@/components/ui/Monogram'
import { Panel } from '@/components/ui/Panel'
import { FilterChip, Segmented } from '@/components/ui/Segmented'
import { ViewHeader } from '@/components/ui/SectionHeading'
import { COMPANIES } from '@/data/companies'
import { HACKTIVITY } from '@/data/hacktivity'
import { university } from '@/data/universities'
import type { Severity } from '@/data/types'
import { cn, compactNumber, formatUsd, relativeTime } from '@/lib/format'
import { SEVERITIES } from '@/lib/presentation'

type SeverityFilter = 'Todos' | Severity

export function HacktivityView() {
  const [companies, setCompanies] = useState<Set<string>>(new Set())
  const [severity, setSeverity] = useState<SeverityFilter>('Todos')
  const [disclosedOnly, setDisclosedOnly] = useState(false)
  const [upvoted, setUpvoted] = useState<Set<string>>(new Set())

  const events = useMemo(
    () =>
      HACKTIVITY.filter((event) => {
        if (companies.size && !companies.has(event.companyId)) return false
        if (severity !== 'Todos' && event.severity !== severity) return false
        if (disclosedOnly && !event.disclosed) return false
        return true
      }),
    [companies, severity, disclosedOnly],
  )

  const severityOptions: Array<{ value: SeverityFilter; label: string; count: number }> = [
    { value: 'Todos', label: 'Todos', count: HACKTIVITY.length },
    ...SEVERITIES.map((entry) => ({
      value: entry,
      label: entry,
      count: HACKTIVITY.filter((event) => event.severity === entry).length,
    })),
  ]

  const toggleUpvote = (id: string) => {
    setUpvoted((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <>
      <ViewHeader
        title="Hacktividad"
        description="Un feed público de reportes resueltos recientemente, publicados con el consentimiento de quien los presentó. Léelos antes de enviar nada: la mayoría de los duplicados son reescrituras de algo ya resuelto aquí."
        action={
          <Chip icon="users" size="sm">
            {compactNumber(2_140)} siguiendo
          </Chip>
        }
      />

      <Panel className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <Segmented
            label="Filtrar por severidad"
            options={severityOptions}
            value={severity}
            onChange={setSeverity}
          />
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {COMPANIES.map((employer) => (
              <FilterChip
                key={employer.id}
                active={companies.has(employer.id)}
                onClick={() =>
                  setCompanies((current) => {
                    const next = new Set(current)
                    if (next.has(employer.id)) next.delete(employer.id)
                    else next.add(employer.id)
                    return next
                  })
                }
                keyColor={employer.accent}
              >
                {employer.monogram}
              </FilterChip>
            ))}
            <button
              type="button"
              aria-pressed={disclosedOnly}
              onClick={() => setDisclosedOnly((value) => !value)}
              className={cn(
                'inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[12.5px] font-medium transition',
                disclosedOnly
                  ? 'border-transparent bg-brand-wash text-ink'
                  : 'border-hairline bg-glass-soft text-ink-muted hover:text-ink',
              )}
            >
              <Icon name={disclosedOnly ? 'check' : 'eye'} size={13} />
              Solo divulgados
            </button>
          </div>
        </div>
      </Panel>

      {events.length === 0 ? (
        <Panel className="grid place-items-center px-6 py-16 text-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-brand-wash text-brand-ink">
            <Icon name="activity" size={22} />
          </span>
          <h2 className="mt-4 text-[16px] font-semibold text-ink">Nada en esa combinación</h2>
          <p className="mt-2 max-w-md text-[13px] text-ink-muted">
            Amplía el filtro de severidad o quita una empresa para ver más del feed.
          </p>
        </Panel>
      ) : (
        <ol className="space-y-3">
          {events.map((event) => {
            const employer = COMPANIES.find((entry) => entry.id === event.companyId)
            const school = university(event.universityId)
            const hasUpvoted = upvoted.has(event.id)

            return (
              <li key={event.id}>
                <Panel className="p-5">
                  <div className="flex flex-wrap items-start gap-4">
                    <Monogram
                      text={initialsOf(event.handle.replace('@', ''))}
                      accent={school.accent}
                      size="md"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px]">
                        <span className="font-semibold text-ink">{event.handle}</span>
                        <span className="text-ink-faint">·</span>
                        <span className="text-ink-muted">{school.name}</span>
                        <span className="text-ink-faint">·</span>
                        <span className="text-ink-faint">{relativeTime(event.at)}</span>
                        {event.disclosed && (
                          <Chip size="xs" icon="eye" className="ml-1">
                            Divulgado
                          </Chip>
                        )}
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {employer && <Chip size="xs" tone={employer.accent}>{employer.name}</Chip>}
                        <SeverityBadge severity={event.severity} size="xs" />
                        <StateBadge state={event.state} size="xs" />
                      </div>

                      <h3 className="mt-3 text-[14px] leading-snug font-semibold text-ink">
                        {event.programTitle}
                      </h3>
                      <p className="mt-2 text-[12.5px] leading-relaxed text-ink-muted">
                        {event.summary}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                        {event.payout > 0 ? (
                          <span className="inline-flex items-center gap-1.5 text-[12.5px]">
                            <Icon name="coins" size={14} className="text-ink-faint" />
                            <span className="font-semibold tabular-nums text-ink">
                              {formatUsd(event.payout)}
                            </span>
                            <span className="text-ink-faint">otorgados</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-faint">
                            <Icon name="clock" size={14} />
                            Recompensa pendiente de triaje
                          </span>
                        )}

                        <button
                          type="button"
                          aria-pressed={hasUpvoted}
                          onClick={() => toggleUpvote(event.id)}
                          className={cn(
                            'inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[12.5px] font-medium transition',
                            hasUpvoted
                              ? 'bg-brand-wash text-brand-ink'
                              : 'text-ink-muted hover:bg-glass-soft hover:text-ink',
                          )}
                        >
                          <Icon name="star" size={14} />
                          <span className="tabular-nums">{event.upvotes + (hasUpvoted ? 1 : 0)}</span>
                        </button>

                        <span className="ml-auto font-mono text-[11px] text-ink-faint">
                          {event.id}
                        </span>
                      </div>
                    </div>
                  </div>
                </Panel>
              </li>
            )
          })}
        </ol>
      )}
    </>
  )
}
