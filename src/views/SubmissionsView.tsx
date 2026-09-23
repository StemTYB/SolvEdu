import { useMemo, useState } from 'react'

import { PipelineBar } from '@/components/charts/PipelineBar'
import { ColorDot, SeverityBadge, StateBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Monogram } from '@/components/ui/Monogram'
import { Panel, PanelHeader } from '@/components/ui/Panel'
import { Segmented } from '@/components/ui/Segmented'
import { ViewHeader } from '@/components/ui/SectionHeading'
import { company } from '@/data/companies'
import { SUBMISSIONS, SUBMISSION_STATES, submissionStateCounts } from '@/data/submissions'
import type { Submission, SubmissionState } from '@/data/types'
import { PROGRAMS } from '@/data/programs'
import { cn, formatDate, formatUsd, relativeTime } from '@/lib/format'
import { SEVERITY_META, STATE_META } from '@/lib/presentation'

type StateFilter = 'Todos' | SubmissionState
type SortKey = 'newest' | 'payout' | 'severity'

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'payout', label: 'Mayor recompensa' },
  { value: 'severity', label: 'Severidad' },
]

function programTitle(programId: string): string {
  return PROGRAMS.find((program) => program.id === programId)?.title ?? 'Programa desconocido'
}

export function SubmissionsView() {
  const [state, setState] = useState<StateFilter>('Todos')
  const [sort, setSort] = useState<SortKey>('newest')

  const counts = submissionStateCounts()

  const rows = useMemo(() => {
    const filtered =
      state === 'Todos' ? SUBMISSIONS : SUBMISSIONS.filter((item) => item.state === state)

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case 'payout':
          return b.payout - a.payout
        case 'severity':
          return SEVERITY_META[b.severity].rank - SEVERITY_META[a.severity].rank
        default:
          return +new Date(b.submittedAt) - +new Date(a.submittedAt)
      }
    })
  }, [state, sort])

  const settled = SUBMISSIONS.reduce(
    (sum, item) => sum + (item.state === 'Pagado' ? item.payout : 0),
    0,
  )
  const awaiting = SUBMISSIONS.reduce(
    (sum, item) => sum + (item.state === 'Aceptado' ? item.payout : 0),
    0,
  )

  const stateOptions: Array<{ value: StateFilter; label: string; count: number }> = [
    { value: 'Todos', label: 'Todos', count: SUBMISSIONS.length },
    ...SUBMISSION_STATES.map((entry) => ({ value: entry, label: entry, count: counts[entry] })),
  ]

  return (
    <>
      <ViewHeader
        title="Mis reportes"
        description="Todos los reportes que has presentado, con su posición actual en el proceso. Las empresas actualizan el estado en el triaje, la aceptación y la liquidación."
        action={
          <Button variant="primary" icon="upload">
            Nuevo reporte
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <Panel className="p-5">
          <p className="text-[11.5px] text-ink-muted">Liquidado hasta la fecha</p>
          <p className="mt-1.5 text-[26px] leading-none font-semibold tracking-tight text-ink">
            {formatUsd(settled)}
          </p>
          <p className="mt-2 text-[11.5px] text-ink-faint">
            {counts.Pagado} reportes pagados en su totalidad
          </p>
        </Panel>
        <Panel className="p-5">
          <p className="text-[11.5px] text-ink-muted">Aceptado, en depósito</p>
          <p className="mt-1.5 text-[26px] leading-none font-semibold tracking-tight text-ink">
            {formatUsd(awaiting)}
          </p>
          <p className="mt-2 text-[11.5px] text-ink-faint">
            Se libera según el calendario de cada empresa
          </p>
        </Panel>
        <Panel className="p-5">
          <p className="text-[11.5px] text-ink-muted">A la espera del primer triaje</p>
          <p className="mt-1.5 text-[26px] leading-none font-semibold tracking-tight text-ink">
            {counts.Pendiente}
            <span className="ml-1 text-[14px] text-ink-muted">
              {counts.Pendiente === 1 ? 'reporte' : 'reportes'}
            </span>
          </p>
          <p className="mt-2 text-[11.5px] text-ink-faint">Primera respuesta mediana: 22 horas</p>
        </Panel>
      </section>

      <Panel className="p-5 sm:p-6">
        <PanelHeader
          title="Proceso"
          description="Dónde se encuentran ahora los doce reportes."
          icon={<Icon name="activity" size={17} />}
          className="px-0 pt-0"
        />
        <PipelineBar counts={counts} className="mt-6" />
      </Panel>

      {/* ---------------------------------------------------------------- Table */}
      <Panel className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4 sm:px-6">
          <Segmented
            label="Filtrar por estado del proceso"
            options={stateOptions}
            value={state}
            onChange={setState}
          />
          <div className="ml-auto">
            <Segmented
              label="Ordenar reportes"
              options={SORT_OPTIONS}
              value={sort}
              onChange={setSort}
            />
          </div>
        </div>

        <div className="overflow-x-auto border-t border-hairline-soft">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <caption className="sr-only">
              Tus reportes presentados, con severidad, estado en el proceso, puntuación CVSS, fecha
              de presentación y recompensa.
            </caption>
            <thead>
              <tr className="text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
                <th scope="col" className="px-5 py-3 sm:px-6">Reporte</th>
                <th scope="col" className="px-3 py-3">Hallazgo</th>
                <th scope="col" className="px-3 py-3">Severidad</th>
                <th scope="col" className="px-3 py-3">Estado</th>
                <th scope="col" className="px-3 py-3 text-right">CVSS</th>
                <th scope="col" className="px-3 py-3">Presentado</th>
                <th scope="col" className="px-5 py-3 text-right sm:px-6">Recompensa</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((submission) => (
                <SubmissionRow key={submission.id} submission={submission} />
              ))}
            </tbody>
          </table>
        </div>

        {rows.length === 0 && (
          <p className="px-6 py-12 text-center text-[13px] text-ink-muted">
            No hay reportes en este estado.
          </p>
        )}
      </Panel>
    </>
  )
}

function SubmissionRow({ submission }: { submission: Submission }) {
  const employer = company(submission.companyId)
  const settled = submission.state === 'Pagado'

  return (
    <tr className="border-t border-hairline-soft transition hover:bg-glass-soft">
      <td className="px-5 py-3.5 align-top sm:px-6">
        <span className="font-mono text-[11.5px] text-ink-faint">{submission.id}</span>
      </td>

      <td className="max-w-[26rem] px-3 py-3.5 align-top">
        <div className="flex items-start gap-2.5">
          <Monogram text={employer.monogram} accent={employer.accent} size="xs" />
          <div className="min-w-0">
            <p className="text-[13px] leading-snug font-medium text-ink">{submission.title}</p>
            <p className="mt-1 text-[11.5px] text-ink-faint">
              {employer.name} · {programTitle(submission.programId)}
            </p>
            {submission.note && (
              <p
                className={cn(
                  'mt-1.5 rounded-lg border border-hairline-soft bg-glass-soft px-2.5 py-1.5',
                  'text-[11.5px] leading-snug text-ink-muted',
                )}
              >
                {submission.note}
              </p>
            )}
          </div>
        </div>
      </td>

      <td className="px-3 py-3.5 align-top">
        <SeverityBadge severity={submission.severity} size="xs" />
      </td>

      <td className="px-3 py-3.5 align-top">
        <StateBadge state={submission.state} size="xs" />
      </td>

      <td className="px-3 py-3.5 text-right align-top">
        <span className="text-[12.5px] font-semibold tabular-nums text-ink">{submission.cvss}</span>
      </td>

      <td className="px-3 py-3.5 align-top">
        <span className="block text-[12.5px] text-ink">{formatDate(submission.submittedAt)}</span>
        <span className="mt-0.5 block text-[11px] text-ink-faint">
          {relativeTime(submission.submittedAt)}
        </span>
      </td>

      <td className="px-5 py-3.5 text-right align-top sm:px-6">
        {submission.payout > 0 ? (
          <>
            <span className="block text-[12.5px] font-semibold tabular-nums text-ink">
              {formatUsd(submission.payout)}
            </span>
            <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-ink-faint">
              <ColorDot
                color={`var(${STATE_META[submission.state].varName})`}
                className="size-1.5"
              />
              {settled ? 'liquidado' : 'aceptado'}
            </span>
          </>
        ) : (
          <span className="text-[12.5px] text-ink-faint">—</span>
        )}
      </td>
    </tr>
  )
}
