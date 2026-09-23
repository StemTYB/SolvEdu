import { useMemo } from 'react'

import { SeverityBars } from '@/components/charts/SeverityBars'
import { Chip } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Meter } from '@/components/ui/Meter'
import { Monogram, initialsOf } from '@/components/ui/Monogram'
import { Panel, PanelHeader } from '@/components/ui/Panel'
import { Sparkline } from '@/components/ui/Sparkline'
import { ViewHeader } from '@/components/ui/SectionHeading'
import { company } from '@/data/companies'
import { SUBMISSIONS } from '@/data/submissions'
import { EARNINGS_TREND, REPUTATION_TREND } from '@/data/trends'
import type { Badge, CompanyId, Severity } from '@/data/types'
import { university } from '@/data/universities'
import { CURRENT_USER } from '@/data/user'
import { cn, compactNumber, formatDate, percent, relativeTime } from '@/lib/format'
import { SEVERITIES, tierFor } from '@/lib/presentation'

const TIER_ACCENT: Record<Badge['tier'], string> = {
  Bronze: '#b0713a',
  Silver: '#8f9aa8',
  Gold: '#c9971b',
  Platinum: '#7c8bd6',
}

/**
 * Validation outcome is a status, not a series: valid is the good state,
 * invalid the bad one, duplicates a neutral third. Every segment is named in
 * the legend beneath and carries its own icon, so the colour never stands alone.
 */
const OUTCOME_META = {
  valid: { label: 'Valid', color: 'var(--status-good)', icon: 'check-circle' },
  invalid: { label: 'Invalid', color: 'var(--status-critical)', icon: 'alert' },
  duplicate: { label: 'Duplicate', color: 'var(--solv-ink-faint)', icon: 'copy' },
} as const

type OutcomeKey = keyof typeof OUTCOME_META

const COMPANY_COLUMN: CompanyId[] = ['stark', 'wayne', 'umbrella', 'aperture', 'oscorp']

export function ProfileView() {
  const user = CURRENT_USER
  const school = university(user.universityId)
  const tier = tierFor(user.reputation)

  const outcomes: Record<OutcomeKey, number> = {
    valid: user.validReports,
    invalid: user.invalidReports,
    duplicate: user.duplicates,
  }
  const total = outcomes.valid + outcomes.invalid + outcomes.duplicate
  const validShare = outcomes.valid / total

  const severityCounts = useMemo(() => {
    const counts = Object.fromEntries(SEVERITIES.map((entry) => [entry, 0])) as Record<
      Severity,
      number
    >
    for (const submission of SUBMISSIONS) counts[submission.severity] += 1
    return counts
  }, [])

  const earnedBadges = user.badges.filter((badge) => badge.earnedAt)
  const inProgress = user.badges.filter((badge) => !badge.earnedAt)

  const reputationToNext = Math.max(0, user.nextTierAt - user.reputation)

  return (
    <>
      <ViewHeader
        title="Profile"
        description="Your public solver record. Companies see this page when they consider an invitation, so the accuracy ratio matters as much as the headline reputation."
        action={
          <>
            <Button icon="external">View public page</Button>
            <Button variant="primary" icon="sparkles">
              Edit profile
            </Button>
          </>
        }
      />

      {/* ------------------------------------------------------------ Identity */}
      <Panel className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start gap-5">
          <Monogram text={initialsOf(user.displayName)} accent={school.accent} size="xl" />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <h2 className="text-[21px] leading-tight font-bold tracking-tight text-ink">
                {user.displayName}
              </h2>
              <span className="font-mono text-[13px] text-ink-faint">{user.handle}</span>
              <Chip tone="var(--solv-brand)" size="xs" icon="trophy">
                {tier.current}
              </Chip>
            </div>

            <dl className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px]">
              <div className="flex items-center gap-1.5">
                <Icon name="graduation" size={14} className="text-ink-faint" />
                <dt className="sr-only">University</dt>
                <dd className="text-ink-muted">{school.name}</dd>
              </div>
              <div className="flex items-center gap-1.5">
                <Icon name="book" size={14} className="text-ink-faint" />
                <dt className="sr-only">Programme</dt>
                <dd className="text-ink-muted">
                  {user.degree} · {user.year}
                </dd>
              </div>
              <div className="flex items-center gap-1.5">
                <Icon name="calendar" size={14} className="text-ink-faint" />
                <dt className="sr-only">Joined</dt>
                <dd className="text-ink-muted">
                  Joined {formatDate(user.joinedAt, true)} · {relativeTime(user.joinedAt)}
                </dd>
              </div>
            </dl>

            <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-ink-muted">
              Working across cryptography and hardware firmware, with a focus on control systems
              where a defect has a physical consequence. Filing under Safe Harbor v4.2 on every
              engagement.
            </p>
          </div>

          <div className="grid w-full shrink-0 grid-cols-2 gap-4 border-t border-hairline-soft pt-5 sm:w-auto sm:grid-cols-3 sm:border-0 sm:pt-0 lg:grid-cols-1 lg:text-right">
            <div>
              <p className="text-[11px] tracking-[0.12em] text-ink-faint uppercase">Global rank</p>
              <p className="mt-1 text-[20px] leading-none font-semibold tabular-nums text-ink">
                #{user.rank}
              </p>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.12em] text-ink-faint uppercase">Reputation</p>
              <p className="mt-1 text-[20px] leading-none font-semibold text-ink">
                {compactNumber(user.reputation)}
              </p>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.12em] text-ink-faint uppercase">Streak</p>
              <p className="mt-1 text-[20px] leading-none font-semibold text-ink">
                {user.streakWeeks}
                <span className="ml-1 text-[12px] font-normal text-ink-muted">wks</span>
              </p>
            </div>
          </div>
        </div>
      </Panel>

      {/* ------------------------------------------------- Quality vs. standing */}
      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Panel className="p-5 sm:p-6">
          <PanelHeader
            title="Report quality"
            description="The ratio companies weigh most heavily. A duplicate counts against you the same as an invalid report."
            icon={<Icon name="target" size={17} />}
            className="px-0 pt-0"
          />

          <div className="mt-6 flex flex-wrap items-end gap-x-6 gap-y-4">
            <div>
              {/* The view's single hero figure. */}
              <p className="text-[48px] leading-none font-bold tracking-tight text-ink sm:text-[56px]">
                {percent(validShare, 1)}
              </p>
              <p className="mt-2 text-[13px] text-ink-muted">
                valid — {outcomes.valid} of {total} reports filed
              </p>
            </div>

            <div className="min-w-[200px] flex-1">
              <Sparkline
                points={EARNINGS_TREND}
                tone="var(--viz-series-1)"
                label="Settled reward over the last twelve months"
                width={220}
                height={56}
                className="w-full"
              />
              <p className="mt-2 text-[11.5px] text-ink-faint">
                Settled reward, last twelve months
              </p>
            </div>
          </div>

          {/* Proportion bar — 2px of surface between each outcome, named below. */}
          <div className="mt-6 flex h-3.5 w-full gap-0.5" aria-hidden="true">
            {(Object.keys(OUTCOME_META) as OutcomeKey[]).map((key) => (
              <span
                key={key}
                className="h-full rounded-[3px]"
                style={{
                  flexGrow: outcomes[key],
                  backgroundColor: OUTCOME_META[key].color,
                }}
              />
            ))}
          </div>

          <ul className="mt-4 grid gap-x-4 gap-y-2.5 sm:grid-cols-3">
            {(Object.keys(OUTCOME_META) as OutcomeKey[]).map((key) => {
              const meta = OUTCOME_META[key]
              return (
                <li key={key} className="flex items-center gap-2 text-[12.5px]">
                  <Icon name={meta.icon} size={14} style={{ color: meta.color }} />
                  <span className="text-ink-muted">{meta.label}</span>
                  <span className="ml-auto font-semibold tabular-nums text-ink">
                    {outcomes[key]}
                  </span>
                  <span className="w-11 text-right tabular-nums text-ink-faint">
                    {percent(outcomes[key] / total, 0)}
                  </span>
                </li>
              )
            })}
          </ul>

          <p className="mt-5 border-t border-hairline-soft pt-4 text-[12px] leading-relaxed text-ink-muted">
            Your ratio sits {validShare >= 0.8 ? 'above' : 'below'} the platform median of 74%.
            Two of your six invalid reports were out-of-scope submissions on briefs that had been
            amended after you began work — the platform does not currently discount those, and an
            appeal is open on both.
          </p>
        </Panel>

        <div className="space-y-5">
          <Panel className="p-5 sm:p-6">
            <PanelHeader
              title="Standing"
              description={tier.next ? `Next tier at ${compactNumber(user.nextTierAt)} reputation.` : 'Top tier reached.'}
              icon={<Icon name="trending-up" size={17} />}
              className="px-0 pt-0"
            />

            <p className="mt-5 text-[22px] leading-none font-semibold text-ink">
              {compactNumber(user.reputation)}
              <span className="ml-2 text-[12.5px] font-normal text-ink-muted">reputation</span>
            </p>

            <Sparkline
              points={REPUTATION_TREND}
              tone="var(--viz-series-1)"
              label="Reputation over the last twelve months"
              width={280}
              height={56}
              className="mt-4 w-full"
            />

            <div className="mt-5">
              <div className="flex items-baseline justify-between gap-3 text-[12px]">
                <span className="text-ink-muted">{tier.current}</span>
                <span className="text-ink-faint">{tier.next ?? 'Highest tier'}</span>
              </div>
              <Meter value={tier.progress} className="mt-2" height={7} />
              <p className="mt-2 text-[11.5px] text-ink-faint">
                {tier.next
                  ? `${compactNumber(reputationToNext)} reputation to ${user.nextTierName}`
                  : 'You hold the platform’s highest rank.'}
              </p>
            </div>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <PanelHeader
              title="University"
              icon={<Icon name="graduation" size={17} />}
              action={
                <Chip size="xs" tone={school.accent}>
                  {school.monogram}
                </Chip>
              }
              className="px-0 pt-0"
            />
            <p className="mt-4 text-[14.5px] font-semibold text-ink">{school.name}</p>
            <p className="mt-1 text-[12.5px] text-ink-muted italic">“{school.motto}”</p>

            <dl className="mt-5 space-y-3 text-[12.5px]">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-muted">Registered solvers</dt>
                <dd className="font-semibold tabular-nums text-ink">
                  {compactNumber(school.solvers)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-muted">Your standing</dt>
                <dd className="font-semibold text-ink">#1 of {compactNumber(school.solvers)}</dd>
              </div>
            </dl>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {school.strengths.map((strength) => (
                <Chip key={strength} size="xs">
                  {strength}
                </Chip>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* ------------------------------------------------------------ Findings */}
      <div className="grid gap-5 xl:grid-cols-2">
        <Panel className="p-5 sm:p-6">
          <PanelHeader
            title="Findings by severity"
            description="Everything you have filed this term, banded the way triagers read it."
            icon={<Icon name="alert" size={17} />}
            className="px-0 pt-0"
          />
          <SeverityBars counts={severityCounts} unit="Findings" className="mt-6" />
        </Panel>

        <Panel className="p-5 sm:p-6">
          <PanelHeader
            title="Where the work lands"
            description="Reward concentration across the five client companies."
            icon={<Icon name="building" size={17} />}
            className="px-0 pt-0"
          />
          <ul className="mt-6 space-y-4">
            {COMPANY_COLUMN.map((id) => {
              const employer = company(id)
              const reports = SUBMISSIONS.filter((item) => item.companyId === employer.id).length
              const settled = SUBMISSIONS.filter(
                (item) => item.companyId === employer.id && item.state === 'Paid',
              ).reduce((sum, item) => sum + item.payout, 0)

              return (
                <li key={employer.id} className="flex items-center gap-3">
                  <Monogram text={employer.monogram} accent={employer.accent} size="xs" />
                  <span className="w-32 shrink-0 truncate text-[12.5px] text-ink">
                    {employer.name}
                  </span>
                  <Meter
                    value={reports / 5}
                    tone={employer.accent}
                    className="min-w-0 flex-1"
                    height={6}
                  />
                  <span className="w-24 shrink-0 text-right text-[12px] tabular-nums text-ink-muted">
                    {compactNumber(settled)} {employer.currency.code}
                  </span>
                </li>
              )
            })}
          </ul>
          <p className="mt-5 border-t border-hairline-soft pt-4 text-[11.5px] leading-relaxed text-ink-faint">
            Bar length is reports filed, not reward — a single Elite brief can settle for more
            than a dozen small ones.
          </p>
        </Panel>
      </div>

      {/* -------------------------------------------------------------- Badges */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[19px] leading-tight font-semibold tracking-tight text-ink">
              Achievements
            </h2>
            <p className="mt-1.5 text-[13.5px] text-ink-muted">
              {earnedBadges.length} of {user.badges.length} earned. Badges are permanent once
              awarded.
            </p>
          </div>
          <Chip size="sm" icon="trophy">
            {earnedBadges.length} / {user.badges.length}
          </Chip>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[...earnedBadges, ...inProgress].map((badge) => {
            const earned = Boolean(badge.earnedAt)
            return (
              <Panel
                key={badge.id}
                className={cn('flex flex-col p-5', !earned && 'opacity-90')}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    aria-hidden="true"
                    className="grid size-11 place-items-center rounded-2xl text-[20px]"
                    style={{
                      backgroundColor: `color-mix(in oklab, ${TIER_ACCENT[badge.tier]} 18%, transparent)`,
                      boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${TIER_ACCENT[badge.tier]} 38%, transparent)`,
                      color: 'var(--solv-ink)',
                    }}
                  >
                    {badge.glyph}
                  </span>
                  <Chip size="xs" tone={TIER_ACCENT[badge.tier]}>
                    {badge.tier}
                  </Chip>
                </div>

                <p className="mt-4 text-[14px] font-semibold text-ink">{badge.name}</p>
                <p className="mt-1.5 flex-1 text-[12px] leading-relaxed text-ink-muted">
                  {badge.description}
                </p>

                {earned ? (
                  <p className="mt-4 flex items-center gap-1.5 text-[11.5px] text-ink-faint">
                    <Icon name="check-circle" size={13} style={{ color: 'var(--status-good)' }} />
                    Earned {formatDate(badge.earnedAt!, true)}
                  </p>
                ) : (
                  <div className="mt-4">
                    <Meter value={badge.progress ?? 0} height={5} />
                    <p className="mt-2 text-[11.5px] text-ink-faint">
                      {percent(badge.progress ?? 0, 0)} complete
                    </p>
                  </div>
                )}
              </Panel>
            )
          })}
        </div>
      </section>
    </>
  )
}
