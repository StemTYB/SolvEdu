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
import { formatDate, formatNumber, formatUsd, formatUsdShort, percent, relativeTime } from '@/lib/format'
import type { NotificationKind } from '@/data/types'
import type { RouteId } from '@/lib/routes'

const NOTIFICATION_ICON: Record<NotificationKind, IconName> = {
  pago: 'coins',
  triaje: 'eye',
  programa: 'target',
  rango: 'trophy',
  duplicado: 'copy',
  sistema: 'info',
}

interface DashboardViewProps {
  onNavigate: (route: RouteId) => void
}

export function DashboardView({ onNavigate }: DashboardViewProps) {
  const counts = submissionStateCounts()
  const recommended = [...PROGRAMS].sort((a, b) => b.match - a.match).slice(0, 3)
  const nextPayout = PAYOUTS.find((payout) => payout.state === 'En proceso') ?? PAYOUTS[0]
  const tier = tierFor(CURRENT_USER.reputation)
  const school = university(CURRENT_USER.universityId)

  const recent = [...SUBMISSIONS]
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
    .slice(0, 4)

  const openReports = SUBMISSIONS.filter(
    (item) => item.state === 'Pendiente' || item.state === 'Triaje',
  ).length

  const reputationDelta = ((8_420 - 7_940) / 7_940) * 100
  const rankDelta = ((7 - 10) / 10) * 100
  const accuracyDelta = ((0.804 - 0.77) / 0.77) * 100

  // The sparkline's peak comes from the series, not a literal, so the caption
  // and the drawn line can never disagree.
  const peakEarnings = Math.max(...EARNINGS_TREND.map((point) => point.value))

  return (
    <>
      <ViewHeader
        title="Panel"
        description="Tu posición en todos los programas: lo que ya se ha liquidado, dónde estás y qué requiere atención esta semana."
        action={
          <Chip size="sm" icon="refresh">
            Actualizado a las 04:00 UTC
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
                Bienvenido de nuevo, {CURRENT_USER.displayName.split(' ')[0]} — {school.name}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold tracking-[0.16em] text-ink-faint uppercase">
                  Recompensa liquidada histórica
                </p>
                {/*
                  The one hero figure on this view. Proportional figures on
                  purpose — tabular-nums reads loose at display sizes.
                */}
                <p className="mt-2 text-[48px] leading-none font-bold tracking-tight text-ink sm:text-[56px]">
                  {formatUsdShort(LIFETIME_EARNINGS)}
                  <span className="ml-2 text-[20px] font-semibold text-ink-muted sm:text-[24px]">
                    USD
                  </span>
                </p>
                <p className="mt-3 text-[13px] text-ink-muted">
                  Repartidos en {LIFETIME_PAYOUTS} recompensas liquidadas con las cinco empresas
                  cliente.
                </p>
              </div>

              <div className="shrink-0">
                <svg
                  role="img"
                  aria-label={`Recompensa liquidada en los últimos doce meses, con un máximo de ${formatUsd(peakEarnings)}`}
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
                  Últimos 12 meses · máximo {formatUsd(peakEarnings)}
                </p>
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-hairline-soft pt-5 sm:grid-cols-3">
              <div>
                <dt className="text-[11.5px] text-ink-muted">En depósito</dt>
                <dd className="mt-1 text-[17px] font-semibold text-ink">
                  {formatUsd(PENDING_TOTAL)}
                </dd>
              </div>
              <div>
                <dt className="text-[11.5px] text-ink-muted">Retirable</dt>
                <dd className="mt-1 text-[17px] font-semibold text-ink">
                  {formatUsd(AVAILABLE_TOTAL)}
                </dd>
              </div>
              <div>
                <dt className="text-[11.5px] text-ink-muted">Racha activa</dt>
                <dd className="mt-1 inline-flex items-center gap-1.5 text-[17px] font-semibold text-ink">
                  <Icon name="flame" size={16} className="text-brand-ink" />
                  {CURRENT_USER.streakWeeks} semanas
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <Button variant="primary" icon="target" onClick={() => onNavigate('programs')}>
                Explorar programas
              </Button>
              <Button icon="upload" onClick={() => onNavigate('submit')}>
                Enviar un reporte
              </Button>
            </div>
          </div>
        </Panel>

        {/* Next payout */}
        <div className="flex flex-col gap-5">
          <Panel className="p-5">
            <div className="flex items-center gap-2 text-ink-muted">
              <Icon name="coins" size={15} />
              <span className="text-[12.5px] font-medium">Próximo pago</span>
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
                      {nextPayout.submissionId} · solicitado el {formatDate(nextPayout.requestedAt)}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-[30px] leading-none font-bold tracking-tight text-ink">
                  {formatUsdShort(nextPayout.amount)}
                  <span className="ml-1.5 text-[15px] font-semibold text-ink-muted">USD</span>
                </p>

                <div className="mt-3 inline-flex items-center gap-1.5 text-[12px]">
                  <Icon
                    name={PAYOUT_STATE_META[nextPayout.state].icon}
                    size={13}
                    style={{ color: PAYOUT_STATE_META[nextPayout.state].tone }}
                  />
                  <span className="text-ink-muted">
                    {nextPayout.state} · se libera el {formatDate(nextPayout.settlesAt, true)}
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
              Abrir cartera
            </Button>
          </Panel>

          <Panel className="flex-1 p-5">
            <div className="flex items-center gap-2 text-ink-muted">
              <Icon name="shield" size={15} />
              <span className="text-[12.5px] font-medium">Rango de reputación</span>
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
                ? `${formatNumber(CURRENT_USER.nextTierAt - CURRENT_USER.reputation)} de reputación para ${tier.next}.`
                : 'Rango máximo alcanzado.'}
            </p>
            <button
              type="button"
              onClick={() => onNavigate('leaderboard')}
              className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-brand-ink hover:underline"
            >
              Ver la clasificación
              <Icon name="chevron-right" size={14} />
            </button>
          </Panel>
        </div>
      </section>

      {/* ---------------------------------------------------------- Stat tiles */}
      <section aria-label="Métricas clave" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Reputación"
          value={formatNumber(CURRENT_USER.reputation)}
          icon="shield"
          caption={tier.current}
          delta={{ value: reputationDelta, period: 'frente a los últimos 30 días' }}
          trend={REPUTATION_TREND}
          trendTone="var(--viz-series-1)"
        />
        <StatTile
          label="Puesto global"
          value={`#${CURRENT_USER.rank}`}
          icon="trophy"
          caption={`de ${formatNumber(CURRENT_USER.rankPool)} investigadores`}
          delta={{ value: rankDelta, period: 'frente a los últimos 30 días', goodWhenUp: false }}
          trend={RANK_TREND}
          trendTone="var(--viz-series-1)"
          invertTrend
        />
        <StatTile
          label="Tasa de aceptación"
          value={percent(CURRENT_USER.validReports / (CURRENT_USER.validReports + CURRENT_USER.invalidReports + CURRENT_USER.duplicates), 1)}
          icon="check-circle"
          caption={`${CURRENT_USER.validReports} válidos · ${CURRENT_USER.invalidReports} inválidos · ${CURRENT_USER.duplicates} duplicados`}
          delta={{ value: accuracyDelta, period: 'frente a los últimos 30 días' }}
          trend={ACCURACY_TREND}
          trendTone="var(--viz-series-1)"
        />
        <StatTile
          label="Reportes abiertos"
          value={String(openReports)}
          icon="inbox"
          caption="A la espera de triaje o de pago"
          trend={SUBMISSIONS_TREND}
          trendTone="var(--viz-series-1)"
        />
      </section>

      {/* ------------------------------------------------------- Main columns */}
      <section className="grid gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <Panel className="p-5 sm:p-6">
            <PanelHeader
              title="Programas recomendados"
              description="Ordenados por afinidad con tus hallazgos aceptados, tus stacks y tu historial de categorías."
              icon={<Icon name="target" size={17} />}
              className="px-0 pt-0"
              action={
                <Button size="sm" variant="ghost" trailingIcon="chevron-right" onClick={() => onNavigate('programs')}>
                  Todos ({PROGRAMS.length})
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
              title="Proceso de reportes"
              description={`${SUBMISSIONS.length} reportes presentados en este ciclo, por estado actual.`}
              icon={<Icon name="activity" size={17} />}
              className="px-0 pt-0"
              action={
                <Button size="sm" variant="ghost" trailingIcon="chevron-right" onClick={() => onNavigate('submissions')}>
                  Detalles
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
              title="Notificaciones recientes"
              icon={<Icon name="bell" size={17} />}
              className="px-0 pt-0"
              action={
                <span className="rounded-full bg-brand-wash px-2 py-0.5 text-[11px] font-semibold text-brand-ink">
                  {NOTIFICATIONS.filter((item) => !item.read).length} nuevas
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
                            aria-label="Sin leer"
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
              title="Actividad reciente"
              description="Últimos movimientos en tus reportes."
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
                Puesto n.º {CURRENT_USER.rank} · racha de {CURRENT_USER.streakWeeks} semanas
              </p>
              <Delta
                value={rankDelta}
                period="30 d"
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
