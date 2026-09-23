import { EarningsChart } from '@/components/charts/EarningsChart'
import { PipelineBar } from '@/components/charts/PipelineBar'
import { ProgramCard } from '@/components/program/ProgramCard'
import { Panel, PanelHeader } from '@/components/ui/Panel'
import { Button } from '@/components/ui/Button'
import { Icon, type IconName } from '@/components/ui/Icon'
import { Monogram, initialsOf } from '@/components/ui/Monogram'
import { Delta, StatTile } from '@/components/ui/StatTile'
import { ColorDot, Chip } from '@/components/ui/Badge'
import { ViewHeader } from '@/components/ui/SectionHeading'
import { company } from '@/data/companies'
import { MONTHLY_EARNINGS, PAYOUTS, PENDING_TOTAL, AVAILABLE_TOTAL, LIFETIME_EARNINGS, LIFETIME_PAYOUTS } from '@/data/earnings'
import { NOTIFICATIONS } from '@/data/notifications'
import { PROGRAMS } from '@/data/programs'
import { SUBMISSIONS, submissionStateCounts } from '@/data/submissions'
import {
  ACCURACY_TREND,
  EARNINGS_TREND,
  RANK_TREND,
  REPUTATION_TREND,
  SUBMISSIONS_TREND,
} from '@/data/trends'
import { CURRENT_USER } from '@/data/user'
import { university } from '@/data/universities'
import { PAYOUT_STATE_META, STATE_META, tierFor } from '@/lib/presentation'
import { compactNumber, formatDate, percent, relativeTime } from '@/lib/format'
import type { NotificationKind } from '@/data/types'
import type { RouteId } from '@/lib/routes'

const NOTIFICATION_ICON: Record<NotificationKind, IconName> = {
  payout: 'coins',
  triage: 'eye',
  program: 'target',
  rank: 'trophy',
  duplicate: 'copy',
  system: 'info',
}

interface DashboardViewProps {
  onNavigate: (route: RouteId) => void
}

export function DashboardView({ onNavigate }: DashboardViewProps) {
  const counts = submissionStateCounts()
  const recommended = [...PROGRAMS].sort((a, b) => b.match - a.match).slice(0, 3)
  const nextPayout = PAYOUTS.find((payout) => payout.state === 'Processing') ?? PAYOUTS[0]
  const tier = tierFor(CURRENT_USER.reputation)
  const school = university(CURRENT_USER.universityId)

  const recent = [...SUBMISSIONS]
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
    .slice(0, 4)

  const openReports = SUBMISSIONS.filter(
    (item) => item.state === 'Pending' || item.state === 'Triaged',
  ).length

  const reputationDelta = ((8_420 - 7_940) / 7_940) * 100
  const rankDelta = ((7 - 10) / 10) * 100
  const accuracyDelta = ((0.804 - 0.77) / 0.77) * 100

  return (
    <>
      <ViewHeader
        title="Dashboard"
        description="Your position across every programme — what has settled, where you stand, and what needs attention this week."
        action={
          <Chip size="sm" icon="refresh">
            Updated 04:00 UTC
          </Chip>
        }
      />

      {/* ---------------------------------------------------------------- Hero */}
      <section className="grid gap-5 lg:grid-cols-[1.55fr_1fr]">
        <Panel className="overflow-hidden p-5 sm:p-7">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-linear-to-br from-brand-wash to-accent-wash blur-3xl"
          />

          <div className="relative">
            <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-ink-muted">
              <Icon name="sparkles" size={15} className="text-brand-ink" />
              <span>
                Welcome back, {CURRENT_USER.displayName.split(' ')[0]} — {school.name}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold tracking-[0.16em] text-ink-faint uppercase">
                  Lifetime settled reward
                </p>
                {/*
                  The one hero figure on this view. Proportional figures on
                  purpose — tabular-nums reads loose at display sizes.
                */}
                <p className="mt-2 text-[48px] leading-none font-bold tracking-tight text-ink sm:text-[56px]">
                  {LIFETIME_EARNINGS.toLocaleString('en-US')}
                  <span className="ml-2 text-[20px] font-semibold text-ink-muted sm:text-[24px]">
                    SC
                  </span>
                </p>
                <p className="mt-3 text-[13px] text-ink-muted">
                  Across {LIFETIME_PAYOUTS} settled awards in 5 company currencies, normalised to
                  the ledger unit.
                </p>
              </div>

              <div className="shrink-0">
                <svg
                  role="img"
                  aria-label="Settled reward over the last twelve months, rising to 31,600 SC in August"
                  width={252}
                  height={78}
                  viewBox="0 0 252 78"
                  className="overflow-visible"
                >
                  {(() => {
                    const values = EARNINGS_TREND.map((point) => point.value)
                    const max = Math.max(...values) * 1.15
                    const stepX = 252 / (values.length - 1)
                    const coords = values.map((value, index) => ({
                      x: index * stepX,
                      y: 78 - (value / max) * 78,
                    }))
                    const line = coords
                      .map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`)
                      .join(' ')
                    const tail = coords.slice(-2)
                    const last = coords[coords.length - 1]

                    return (
                      <>
                        <polyline
                          points={line}
                          fill="none"
                          stroke="color-mix(in oklab, var(--solv-ink-faint) 45%, transparent)"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <polyline
                          points={`${tail[0].x},${tail[0].y} ${tail[1].x},${tail[1].y}`}
                          fill="none"
                          stroke="var(--viz-series-1)"
                          strokeWidth={2}
                          strokeLinecap="round"
                        />
                        <circle
                          cx={last.x}
                          cy={last.y}
                          r={4}
                          fill="var(--viz-series-1)"
                          stroke="var(--viz-surface)"
                          strokeWidth={2}
                        />
                      </>
                    )
                  })()}
                </svg>
                <p className="mt-1 text-right text-[11px] text-ink-faint">
                  Last 12 months · peak {compactNumber(31_600)} SC
                </p>
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-hairline-soft pt-5 sm:grid-cols-3">
              <div>
                <dt className="text-[11.5px] text-ink-muted">In escrow</dt>
                <dd className="mt-1 text-[17px] font-semibold text-ink">
                  {compactNumber(PENDING_TOTAL)} SC
                </dd>
              </div>
              <div>
                <dt className="text-[11.5px] text-ink-muted">Withdrawable</dt>
                <dd className="mt-1 text-[17px] font-semibold text-ink">
                  {compactNumber(AVAILABLE_TOTAL)} SC
                </dd>
              </div>
              <div>
                <dt className="text-[11.5px] text-ink-muted">Active streak</dt>
                <dd className="mt-1 inline-flex items-center gap-1.5 text-[17px] font-semibold text-ink">
                  <Icon name="flame" size={16} className="text-brand-ink" />
                  {CURRENT_USER.streakWeeks} weeks
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <Button variant="primary" icon="target" onClick={() => onNavigate('programs')}>
                Browse programs
              </Button>
              <Button icon="upload" onClick={() => onNavigate('submit')}>
                Submit a report
              </Button>
            </div>
          </div>
        </Panel>

        {/* Next payout */}
        <div className="flex flex-col gap-5">
          <Panel className="p-5">
            <div className="flex items-center gap-2 text-ink-muted">
              <Icon name="coins" size={15} />
              <span className="text-[12.5px] font-medium">Next payout</span>
            </div>

            {nextPayout && (
              <>
                <div className="mt-3 flex items-center gap-3">
                  <Monogram
                    text={company(nextPayout.companyId).monogram}
                    accent={company(nextPayout.companyId).accent}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-ink">
                      {company(nextPayout.companyId).name}
                    </p>
                    <p className="truncate text-[11.5px] text-ink-faint">
                      {nextPayout.submissionId} · {nextPayout.currencyCode}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-[30px] leading-none font-bold tracking-tight text-ink">
                  {compactNumber(nextPayout.amount)}
                  <span className="ml-1.5 text-[15px] font-semibold text-ink-muted">
                    {nextPayout.currencyCode}
                  </span>
                </p>

                <div className="mt-3 inline-flex items-center gap-1.5 text-[12px]">
                  <Icon
                    name={PAYOUT_STATE_META[nextPayout.state].icon}
                    size={13}
                    style={{ color: PAYOUT_STATE_META[nextPayout.state].tone }}
                  />
                  <span className="text-ink-muted">
                    {nextPayout.state} · settles {formatDate(nextPayout.settlesAt, true)}
                  </span>
                </div>
              </>
            )}

            <Button
              size="sm"
              block
              className="mt-4"
              trailingIcon="chevron-right"
              onClick={() => onNavigate('wallet')}
            >
              Open wallet
            </Button>
          </Panel>

          <Panel className="flex-1 p-5">
            <div className="flex items-center gap-2 text-ink-muted">
              <Icon name="shield" size={15} />
              <span className="text-[12.5px] font-medium">Reputation tier</span>
            </div>
            <p className="mt-3 text-[15px] font-semibold text-ink">{tier.current}</p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-brand-wash">
              <div
                className="h-full rounded-full bg-brand transition-[width] duration-500"
                style={{ width: `${tier.progress * 100}%` }}
              />
            </div>
            <p className="mt-2.5 text-[11.5px] leading-snug text-ink-faint">
              {tier.next
                ? `${(CURRENT_USER.nextTierAt - CURRENT_USER.reputation).toLocaleString('en-US')} reputation to ${tier.next}.`
                : 'Highest tier reached.'}
            </p>
            <button
              type="button"
              onClick={() => onNavigate('leaderboard')}
              className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-brand-ink hover:underline"
            >
              See the standings
              <Icon name="chevron-right" size={14} />
            </button>
          </Panel>
        </div>
      </section>

      {/* ---------------------------------------------------------- Stat tiles */}
      <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Reputation"
          value={compactNumber(CURRENT_USER.reputation)}
          icon="shield"
          caption={tier.current}
          delta={{ value: reputationDelta, period: 'vs last 30 days' }}
          trend={REPUTATION_TREND}
          trendTone="var(--viz-series-1)"
        />
        <StatTile
          label="Global rank"
          value={`#${CURRENT_USER.rank}`}
          icon="trophy"
          caption={`of ${compactNumber(CURRENT_USER.rankPool)} solvers`}
          delta={{ value: rankDelta, period: 'vs last 30 days', goodWhenUp: false }}
          trend={RANK_TREND}
          trendTone="var(--viz-series-1)"
          invertTrend
        />
        <StatTile
          label="Acceptance rate"
          value={percent(CURRENT_USER.validReports / (CURRENT_USER.validReports + CURRENT_USER.invalidReports + CURRENT_USER.duplicates), 1)}
          icon="check-circle"
          caption={`${CURRENT_USER.validReports} valid · ${CURRENT_USER.invalidReports} invalid · ${CURRENT_USER.duplicates} duplicate`}
          delta={{ value: accuracyDelta, period: 'vs last 30 days' }}
          trend={ACCURACY_TREND}
          trendTone="var(--viz-series-1)"
        />
        <StatTile
          label="Open reports"
          value={String(openReports)}
          icon="inbox"
          caption="Awaiting triage or payout"
          trend={SUBMISSIONS_TREND}
          trendTone="var(--viz-series-1)"
        />
      </section>

      {/* ------------------------------------------------------- Main columns */}
      <section className="grid gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <Panel className="p-5 sm:p-6">
            <PanelHeader
              title="Recommended programs"
              description="Ranked by fit against your accepted findings, stacks and category history."
              icon={<Icon name="target" size={17} />}
              className="px-0 pt-0"
              action={
                <Button size="sm" variant="ghost" trailingIcon="chevron-right" onClick={() => onNavigate('programs')}>
                  All 149
                </Button>
              }
            />

            <div className="mt-5 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {recommended.map((program) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  compact
                  onOpen={() => onNavigate('programs')}
                />
              ))}
            </div>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <PanelHeader
              title="Report pipeline"
              description={`${SUBMISSIONS.length} reports filed this cycle, by current state.`}
              icon={<Icon name="activity" size={17} />}
              className="px-0 pt-0"
              action={
                <Button size="sm" variant="ghost" trailingIcon="chevron-right" onClick={() => onNavigate('submissions')}>
                  Details
                </Button>
              }
            />

            <PipelineBar counts={counts} className="mt-6" />

            <div className="mt-6 border-t border-hairline-soft pt-5">
              <EarningsChart data={MONTHLY_EARNINGS} />
            </div>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel className="p-5">
            <PanelHeader
              title="Recent notifications"
              icon={<Icon name="bell" size={17} />}
              className="px-0 pt-0"
              action={
                <span className="rounded-full bg-brand-wash px-2 py-0.5 text-[11px] font-semibold text-brand-ink">
                  {NOTIFICATIONS.filter((item) => !item.read).length} new
                </span>
              }
            />

            <ul className="mt-4 space-y-1">
              {NOTIFICATIONS.slice(0, 5).map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.href.replace(/^\//, '') as RouteId)}
                    className="flex w-full gap-3 rounded-xl p-2.5 text-left transition hover:bg-glass-soft"
                  >
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-brand-wash text-brand-ink">
                      <Icon name={NOTIFICATION_ICON[item.kind]} size={15} />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-start gap-2">
                        <span className="text-[12.5px] leading-snug font-semibold text-ink">
                          {item.title}
                        </span>
                        {!item.read && (
                          <span
                            aria-label="Unread"
                            className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand"
                          />
                        )}
                      </span>
                      <span className="mt-0.5 block text-[11.5px] text-ink-faint">
                        {relativeTime(item.at)}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel className="p-5">
            <PanelHeader
              title="Recent activity"
              description="Latest movement on your reports."
              icon={<Icon name="clock" size={17} />}
              className="px-0 pt-0"
            />

            <ul className="mt-4 space-y-3">
              {recent.map((submission) => (
                <li key={submission.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate('submissions')}
                    className="w-full rounded-xl p-2.5 text-left transition hover:bg-glass-soft"
                  >
                    <div className="flex items-center gap-2">
                      <ColorDot color={`var(${STATE_META[submission.state].varName})`} />
                      <span className="font-mono text-[11px] text-ink-faint">{submission.id}</span>
                      <span className="ml-auto shrink-0 text-[11px] text-ink-faint">
                        {relativeTime(submission.updatedAt)}
                      </span>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-snug text-ink">
                      {submission.title}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2 text-[11px]">
                      <span className="text-ink-muted">{submission.state}</span>
                      <span className="text-ink-faint">·</span>
                      <span className="text-ink-muted">{company(submission.companyId).name}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex items-center gap-2 border-t border-hairline-soft pt-4">
              <Monogram
                text={initialsOf(CURRENT_USER.displayName)}
                accent={school.accent}
                size="xs"
              />
              <p className="text-[11.5px] text-ink-faint">
                Rank #{CURRENT_USER.rank} · {CURRENT_USER.streakWeeks}-week streak
              </p>
              <Delta
                value={rankDelta}
                period="30d"
                goodWhenUp={false}
                className="ml-auto shrink-0"
              />
            </div>
          </Panel>
        </div>
      </section>
    </>
  )
}
