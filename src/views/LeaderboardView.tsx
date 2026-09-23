import { useMemo, useState } from 'react'

import { Chip } from '@/components/ui/Badge'
import { Icon } from '@/components/ui/Icon'
import { Monogram, initialsOf } from '@/components/ui/Monogram'
import { Panel, PanelHeader } from '@/components/ui/Panel'
import { FilterChip } from '@/components/ui/Segmented'
import { ViewHeader } from '@/components/ui/SectionHeading'
import { LEADERBOARD, TOTAL_SOLVERS } from '@/data/leaderboard'
import type { LeaderboardEntry, UniversityId } from '@/data/types'
import { UNIVERSITIES, university } from '@/data/universities'
import { CURRENT_USER } from '@/data/user'
import { cn, compactNumber, percent } from '@/lib/format'

const MEDAL_ACCENT: Record<number, string> = {
  1: '#d4a017',
  2: '#9aa4b2',
  3: '#b0713a',
}

function TrendCell({ trend }: { trend: number }) {
  if (trend === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-[12px] text-ink-faint">
        <Icon name="subtract" size={13} />
        <span className="tabular-nums">0</span>
      </span>
    )
  }

  const up = trend > 0
  return (
    <span
      className="inline-flex items-center gap-1 text-[12px] font-semibold"
      style={{ color: up ? 'var(--solv-delta-up)' : 'var(--solv-delta-down)' }}
    >
      <Icon name={up ? 'arrow-up' : 'arrow-down'} size={13} />
      <span className="tabular-nums">{Math.abs(trend)}</span>
      <span className="sr-only">{up ? 'places gained' : 'places lost'}</span>
    </span>
  )
}

function PodiumCard({ entry, place }: { entry: LeaderboardEntry; place: number }) {
  const school = university(entry.universityId)

  return (
    <Panel
      className={cn(
        'relative flex flex-col items-center p-5 text-center',
        place === 1 && 'sm:-mt-4 sm:pb-7',
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 top-0 h-24 rounded-full opacity-25 blur-2xl"
        style={{ backgroundColor: MEDAL_ACCENT[place] }}
      />
      <div className="relative flex flex-col items-center">
        <span
          className="grid size-8 place-items-center rounded-full text-[12px] font-bold"
          style={{
            backgroundColor: `color-mix(in oklab, ${MEDAL_ACCENT[place]} 22%, transparent)`,
            color: 'var(--solv-ink)',
            boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${MEDAL_ACCENT[place]} 45%, transparent)`,
          }}
        >
          {place}
        </span>
        <Monogram
          text={initialsOf(entry.displayName)}
          accent={school.accent}
          size={place === 1 ? 'xl' : 'lg'}
          className="mt-3"
        />
        <p className="mt-3 text-[14.5px] font-semibold text-ink">{entry.displayName}</p>
        <p className="mt-0.5 font-mono text-[11.5px] text-ink-faint">{entry.handle}</p>
        <p className="mt-2 text-[11.5px] text-ink-muted">{school.name}</p>

        <p className="mt-4 text-[24px] leading-none font-bold tracking-tight text-ink">
          {compactNumber(entry.reputation)}
        </p>
        <p className="mt-1 text-[11px] tracking-[0.12em] text-ink-faint uppercase">reputation</p>

        <p className="mt-3 text-[12px] text-ink-muted">
          {compactNumber(entry.earned)} SC earned · {percent(entry.accuracy, 1)} valid
        </p>
      </div>
    </Panel>
  )
}

export function LeaderboardView() {
  const [school, setSchool] = useState<UniversityId | 'all'>('all')

  const filtered = useMemo(
    () => (school === 'all' ? LEADERBOARD : LEADERBOARD.filter((entry) => entry.universityId === school)),
    [school],
  )

  const podium = LEADERBOARD.slice(0, 3)
  const currentUserVisible = filtered.some((entry) => entry.isCurrentUser)

  return (
    <>
      <ViewHeader
        title="Leaderboard"
        description="Ranks are global and recomputed nightly. Filtering by university narrows the list without re-ranking it — a #7 is seventh everywhere."
        action={
          <>
            <Chip icon="refresh" size="sm">
              Updated 04:00 UTC
            </Chip>
          </>
        }
      />

      {school === 'all' && (
        <section aria-label="Top three" className="grid gap-4 sm:grid-cols-3">
          {[podium[1], podium[0], podium[2]].map((entry) =>
            entry ? <PodiumCard key={entry.handle} entry={entry} place={entry.rank} /> : null,
          )}
        </section>
      )}

      <Panel className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2 text-ink-muted">
            <Icon name="graduation" size={16} />
            <span className="text-[12.5px] font-semibold">University</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterChip active={school === 'all'} onClick={() => setSchool('all')} count={LEADERBOARD.length}>
              All
            </FilterChip>
            {UNIVERSITIES.map((entry) => (
              <FilterChip
                key={entry.id}
                active={school === entry.id}
                onClick={() => setSchool(entry.id)}
                keyColor={entry.accent}
                count={LEADERBOARD.filter((solver) => solver.universityId === entry.id).length}
              >
                {entry.monogram}
              </FilterChip>
            ))}
          </div>
          <p className="ml-auto text-[12px] text-ink-faint">
            {compactNumber(TOTAL_SOLVERS)} active solvers
          </p>
        </div>

        <div className="overflow-x-auto border-t border-hairline-soft">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <caption className="sr-only">
              Global solver standings: rank, reputation, lifetime earnings, valid reports, accuracy
              and thirty-day movement.
            </caption>
            <thead>
              <tr className="text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
                <th scope="col" className="px-5 py-3 sm:px-6">#</th>
                <th scope="col" className="px-3 py-3">Solver</th>
                <th scope="col" className="px-3 py-3">University</th>
                <th scope="col" className="px-3 py-3 text-right">Reputation</th>
                <th scope="col" className="px-3 py-3 text-right">Earned</th>
                <th scope="col" className="px-3 py-3 text-right">Valid</th>
                <th scope="col" className="px-3 py-3">Accuracy</th>
                <th scope="col" className="px-5 py-3 text-right sm:px-6">30d</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => {
                const entrySchool = university(entry.universityId)
                return (
                  <tr
                    key={entry.handle}
                    className={cn(
                      'border-t border-hairline-soft transition',
                      entry.isCurrentUser ? 'bg-brand-wash' : 'hover:bg-glass-soft',
                    )}
                  >
                    <td className="px-5 py-3.5 sm:px-6">
                      <span className="text-[13px] font-semibold tabular-nums text-ink">
                        {entry.rank}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <Monogram
                          text={initialsOf(entry.displayName)}
                          accent={entrySchool.accent}
                          size="xs"
                        />
                        <div className="min-w-0">
                          <p className="flex items-center gap-2 truncate text-[13px] font-medium text-ink">
                            {entry.displayName}
                            {entry.isCurrentUser && (
                              <Chip size="xs" tone="var(--solv-brand)">
                                You
                              </Chip>
                            )}
                          </p>
                          <p className="truncate font-mono text-[11px] text-ink-faint">
                            {entry.handle}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="text-[12.5px] text-ink-muted">{entrySchool.name}</span>
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <span className="text-[13px] font-semibold tabular-nums text-ink">
                        {compactNumber(entry.reputation)}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <span className="text-[12.5px] tabular-nums text-ink-muted">
                        {compactNumber(entry.earned)} SC
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <span className="text-[12.5px] tabular-nums text-ink-muted">
                        {entry.validReports}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="w-11 text-[12px] tabular-nums text-ink">
                          {percent(entry.accuracy, 1)}
                        </span>
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-16 overflow-hidden rounded-full"
                          style={{ backgroundColor: 'color-mix(in oklab, var(--solv-brand) 20%, transparent)' }}
                        >
                          <span
                            className="block h-full rounded-full bg-brand"
                            style={{ width: `${entry.accuracy * 100}%` }}
                          />
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right sm:px-6">
                      <TrendCell trend={entry.trend} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <p className="px-6 py-12 text-center text-[13px] text-ink-muted">
            No ranked solvers from that university yet.
          </p>
        )}

        {/* Pinned standing — keeps your position visible when a filter hides it. */}
        {!currentUserVisible && (
          <div className="flex items-center gap-3 border-t border-hairline bg-brand-wash px-5 py-3.5 sm:px-6">
            <span className="text-[13px] font-semibold tabular-nums text-ink">
              {CURRENT_USER.rank}
            </span>
            <Monogram
              text={initialsOf(CURRENT_USER.displayName)}
              accent={university(CURRENT_USER.universityId).accent}
              size="xs"
            />
            <span className="text-[13px] font-medium text-ink">{CURRENT_USER.displayName}</span>
            <Chip size="xs" tone="var(--solv-brand)">
              You
            </Chip>
            <span className="ml-auto text-[12.5px] font-semibold tabular-nums text-ink">
              {compactNumber(CURRENT_USER.reputation)}
            </span>
          </div>
        )}
      </Panel>

      <Panel className="p-5 sm:p-6">
        <PanelHeader
          title="How rank is computed"
          description="Reputation is weighted by severity band, scope difficulty and the accuracy of your history. It decays slowly if you stop filing, so the board rewards people who are still active."
          icon={<Icon name="info" size={17} />}
          className="px-0 pt-0"
        />
        <dl className="mt-5 grid gap-5 sm:grid-cols-3">
          {[
            ['Severity weight', '40%', 'Critical findings carry five times an Informational.'],
            ['Accuracy', '35%', 'Valid ÷ total submitted. Duplicates are counted as invalid.'],
            ['Scope difficulty', '25%', 'Elite briefs and physical-access work score highest.'],
          ].map(([term, value, description]) => (
            <div key={term}>
              <dt className="flex items-baseline gap-2 text-[12.5px] font-semibold text-ink">
                {term}
                <span className="text-[15px] tabular-nums text-brand-ink">{value}</span>
              </dt>
              <dd className="mt-1.5 text-[12px] leading-relaxed text-ink-muted">{description}</dd>
            </div>
          ))}
        </dl>
      </Panel>
    </>
  )
}
