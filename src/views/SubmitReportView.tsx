import { useMemo, useState, type ReactNode } from 'react'

import { Chip, SeverityBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Monogram } from '@/components/ui/Monogram'
import { Panel, PanelHeader } from '@/components/ui/Panel'
import { ViewHeader } from '@/components/ui/SectionHeading'
import { COMPANIES, company } from '@/data/companies'
import { PROGRAMS } from '@/data/programs'
import type { CompanyId, Severity } from '@/data/types'
import { cn, formatDate } from '@/lib/format'
import { SEVERITIES, SEVERITY_META } from '@/lib/presentation'

/** Maps a CVSS base score onto the platform's severity bands. */
function severityForScore(score: number): Severity {
  if (score === 0) return 'Informational'
  if (score < 4) return 'Low'
  if (score < 7) return 'Medium'
  if (score < 9) return 'High'
  return 'Critical'
}

function Field({
  label,
  hint,
  required,
  children,
  aside,
}: {
  label: string
  hint?: string
  required?: boolean
  children: ReactNode
  aside?: ReactNode
}) {
  return (
    <label className="block">
      <span className="flex flex-wrap items-baseline gap-x-2">
        <span className="text-[12.5px] font-semibold text-ink">
          {label}
          {required && (
            <span className="ml-1 text-[var(--status-critical)]" aria-hidden="true">
              *
            </span>
          )}
        </span>
        {hint && <span className="text-[11.5px] text-ink-faint">{hint}</span>}
        {aside && <span className="ml-auto">{aside}</span>}
      </span>
      <span className="mt-2 block">{children}</span>
    </label>
  )
}

const INPUT_CLASS = cn(
  'w-full rounded-xl border border-hairline-soft bg-glass-soft px-3.5 py-2.5 text-[13px] text-ink',
  'placeholder:text-ink-faint transition duration-150',
  'hover:border-hairline focus:border-[var(--solv-brand)] focus:bg-glass focus:outline-none',
)

export function SubmitReportView() {
  const [companyId, setCompanyId] = useState<CompanyId>('stark')
  const [programId, setProgramId] = useState('')
  const [title, setTitle] = useState('')
  const [severity, setSeverity] = useState<Severity>('Medium')
  const [cvss, setCvss] = useState('')
  const [description, setDescription] = useState('')
  const [steps, setSteps] = useState('')
  const [impact, setImpact] = useState('')
  const [attachments, setAttachments] = useState<string[]>([])
  const [attested, setAttested] = useState({ scope: false, data: false, disclosure: false })
  const [submitted, setSubmitted] = useState(false)

  const employer = company(companyId)
  const programs = useMemo(
    () => PROGRAMS.filter((program) => program.companyId === companyId),
    [companyId],
  )
  const selectedProgram = programs.find((program) => program.id === programId)

  const score = Number.parseFloat(cvss)
  const scoreValid = Number.isFinite(score) && score >= 0 && score <= 10
  const impliedSeverity = scoreValid ? severityForScore(score) : null
  const severityMismatch = impliedSeverity !== null && impliedSeverity !== severity

  const checks = [
    { label: 'A program is selected', ok: Boolean(selectedProgram) },
    { label: 'Title is at least 12 characters', ok: title.trim().length >= 12 },
    { label: 'Description is at least 40 characters', ok: description.trim().length >= 40 },
    { label: 'Reproduction steps are at least 20 characters', ok: steps.trim().length >= 20 },
    { label: 'All three attestations are confirmed', ok: Object.values(attested).every(Boolean) },
  ]
  const ready = checks.every((check) => check.ok)

  const addAttachment = () => {
    const next = `poc-${String(attachments.length + 1).padStart(2, '0')}-capture.png`
    setAttachments((current) => [...current, next])
  }

  if (submitted) {
    return (
      <>
        <ViewHeader
          title="Report submitted"
          description="Your report is queued for triage. You will be notified at each state change."
        />
        <Panel className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-4">
            <span className="grid size-12 place-items-center rounded-2xl bg-brand-wash text-brand-ink">
              <Icon name="check-circle" size={24} />
            </span>
            <div>
              <p className="text-[15px] font-semibold text-ink">
                SUB-4472 filed against {employer.name}
              </p>
              <p className="mt-1 text-[13px] text-ink-muted">
                {title.trim() || 'Untitled finding'} · {severity}
              </p>
            </div>
          </div>

          <dl className="mt-7 grid gap-5 border-t border-hairline-soft pt-6 sm:grid-cols-3">
            <div>
              <dt className="text-[11.5px] text-ink-muted">Median first response</dt>
              <dd className="mt-1 text-[17px] font-semibold text-ink">
                {employer.triageSlaHours} hours
              </dd>
            </div>
            <div>
              <dt className="text-[11.5px] text-ink-muted">Award ceiling on this brief</dt>
              <dd className="mt-1 text-[17px] font-semibold text-ink">
                {selectedProgram
                  ? `${selectedProgram.bountyMax.toLocaleString('en-US')} ${employer.currency.code}`
                  : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-[11.5px] text-ink-muted">Disclosure default</dt>
              <dd className="mt-1 text-[17px] font-semibold text-ink">90 days</dd>
            </div>
          </dl>

          <div className="mt-7 flex flex-wrap gap-2.5">
            <Button variant="primary" icon="inbox" onClick={() => setSubmitted(false)}>
              File another report
            </Button>
            <Button icon="book">Read the reporting guide</Button>
          </div>
        </Panel>
      </>
    )
  }

  return (
    <>
      <ViewHeader
        title="Submit Report"
        description="Reports that a triager can reproduce in one pass are accepted fastest. Structure the evidence, state the impact, and attach a bounded proof of concept."
        action={
          <>
            <Button icon="download">Download template</Button>
            <Button variant="primary" icon="upload" disabled={!ready}>
              Submit report
            </Button>
          </>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
        <div className="space-y-5">
          {/* ------------------------------------------------- Target company */}
          <Panel className="p-5 sm:p-6">
            <PanelHeader
              title="Target"
              description="Which company and which published brief does this finding belong to?"
              icon={<Icon name="building" size={17} />}
              className="px-0 pt-0"
            />

            <fieldset className="mt-5">
              <legend className="mb-2.5 text-[11px] font-semibold tracking-[0.14em] text-ink-faint uppercase">
                Company <span aria-hidden="true">*</span>
              </legend>
              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {COMPANIES.map((entry) => {
                  const active = entry.id === companyId
                  return (
                    <button
                      key={entry.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        setCompanyId(entry.id)
                        setProgramId('')
                      }}
                      className={cn(
                        'flex items-center gap-3 rounded-2xl border p-3 text-left transition duration-150',
                        active
                          ? 'border-transparent bg-brand-wash'
                          : 'border-hairline-soft bg-glass-soft hover:border-hairline',
                      )}
                      style={
                        active
                          ? {
                              boxShadow:
                                'inset 0 0 0 1px color-mix(in oklab, var(--solv-brand) 45%, transparent)',
                            }
                          : undefined
                      }
                    >
                      <Monogram text={entry.monogram} accent={entry.accent} size="sm" />
                      <span className="min-w-0">
                        <span className="block truncate text-[12.5px] font-semibold text-ink">
                          {entry.name}
                        </span>
                        <span className="block truncate text-[11px] text-ink-faint">
                          {entry.currency.code} · {entry.openPrograms} open
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <div className="mt-5">
              <Field label="Program" required hint="Only briefs published by the selected company">
                <select
                  value={programId}
                  onChange={(event) => setProgramId(event.target.value)}
                  className={cn(INPUT_CLASS, 'appearance-none')}
                >
                  <option value="">Select a brief…</option>
                  {programs.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.id} — {program.title}
                    </option>
                  ))}
                </select>
              </Field>

              {selectedProgram && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Chip size="xs">{selectedProgram.category}</Chip>
                  <Chip size="xs">{selectedProgram.scope}</Chip>
                  <Chip size="xs" icon="clock">
                    closes {formatDate(selectedProgram.deadline)}
                  </Chip>
                  {selectedProgram.safeHarbor && (
                    <Chip size="xs" icon="shield">
                      Safe Harbor
                    </Chip>
                  )}
                  <span className="ml-auto text-[11.5px] text-ink-faint">
                    ceiling {selectedProgram.bountyMax.toLocaleString('en-US')}{' '}
                    {employer.currency.code}
                  </span>
                </div>
              )}
            </div>
          </Panel>

          {/* -------------------------------------------------------- The report */}
          <Panel className="p-5 sm:p-6">
            <PanelHeader
              title="The finding"
              description="Lead with the defect. Keep the narrative out of the title."
              icon={<Icon name="code" size={17} />}
              className="px-0 pt-0"
            />

            <div className="mt-5 space-y-5">
              <Field label="Title" required hint="12–140 characters">
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  maxLength={140}
                  placeholder="Thermal governor re-arms before die cool-down completes"
                  className={INPUT_CLASS}
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Your severity assessment" hint="Triagers may adjust this">
                  <div className="flex flex-wrap gap-1.5">
                    {SEVERITIES.map((entry) => {
                      const active = entry === severity
                      return (
                        <button
                          key={entry}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setSeverity(entry)}
                          className={cn(
                            'inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-[12px] font-medium transition',
                            active
                              ? 'border-transparent bg-glass-strong text-ink'
                              : 'border-hairline-soft text-ink-muted hover:text-ink',
                          )}
                        >
                          <Icon
                            name={SEVERITY_META[entry].icon}
                            size={12}
                            style={{ color: SEVERITY_META[entry].color }}
                          />
                          {entry}
                        </button>
                      )
                    })}
                  </div>
                </Field>

                <Field label="CVSS base score" hint="0.0 – 10.0">
                  <input
                    value={cvss}
                    onChange={(event) => setCvss(event.target.value)}
                    inputMode="decimal"
                    placeholder="7.8"
                    className={INPUT_CLASS}
                  />
                </Field>
              </div>

              {severityMismatch && (
                <p className="flex items-start gap-2 rounded-xl border border-hairline-soft bg-glass-soft px-3.5 py-2.5 text-[12px] text-ink-muted">
                  <Icon
                    name="info"
                    size={15}
                    className="mt-0.5 shrink-0"
                    style={{ color: 'var(--status-warning)' }}
                  />
                  <span>
                    A CVSS of {score.toFixed(1)} maps to{' '}
                    <strong className="font-semibold text-ink">{impliedSeverity}</strong> under{' '}
                    {employer.name}’s rubric. Reports filed at the matching band triage faster —
                    mismatches are the most common reason an award is reduced.
                  </span>
                </p>
              )}

              <Field label="Description" required hint="What is wrong, and where">
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={4}
                  placeholder="The fallback governor re-arms on a fixed timer rather than a die-temperature read…"
                  className={cn(INPUT_CLASS, 'resize-y leading-relaxed')}
                />
              </Field>

              <Field label="Steps to reproduce" required hint="Numbered, minimal, from a clean state">
                <textarea
                  value={steps}
                  onChange={(event) => setSteps(event.target.value)}
                  rows={5}
                  placeholder={'1. Flash the supplied image to the H-3 bench unit\n2. Command a sustained hover at 400 m\n3. Observe…'}
                  className={cn(INPUT_CLASS, 'resize-y font-mono text-[12px] leading-relaxed')}
                />
              </Field>

              <Field label="Impact" hint="What an attacker gains, and the realistic blast radius">
                <textarea
                  value={impact}
                  onChange={(event) => setImpact(event.target.value)}
                  rows={3}
                  placeholder="Sustained thermal excursion past the emitter's rated envelope…"
                  className={cn(INPUT_CLASS, 'resize-y leading-relaxed')}
                />
              </Field>
            </div>
          </Panel>

          {/* ------------------------------------------------------------ PoC */}
          <Panel className="p-5 sm:p-6">
            <PanelHeader
              title="Proof of concept"
              description="Bounded scripts, sanitised captures and logs. Redact anything containing personal data."
              icon={<Icon name="paperclip" size={17} />}
              className="px-0 pt-0"
              action={
                <Button size="sm" icon="plus" onClick={addAttachment}>
                  Attach
                </Button>
              }
            />

            <ul className="mt-5 space-y-2">
              {attachments.map((file) => (
                <li
                  key={file}
                  className="flex items-center gap-3 rounded-xl border border-hairline-soft bg-glass-soft px-3.5 py-2.5"
                >
                  <Icon name="paperclip" size={15} className="text-ink-faint" />
                  <span className="truncate font-mono text-[12px] text-ink">{file}</span>
                  <span className="ml-auto shrink-0 text-[11px] text-ink-faint">248 KB</span>
                  <button
                    type="button"
                    aria-label={`Remove ${file}`}
                    onClick={() =>
                      setAttachments((current) => current.filter((entry) => entry !== file))
                    }
                    className="grid size-6 shrink-0 place-items-center rounded-md text-ink-faint hover:bg-glass-strong hover:text-ink"
                  >
                    <Icon name="close" size={14} />
                  </button>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={addAttachment}
              className="mt-3 grid w-full place-items-center rounded-2xl border border-dashed border-hairline px-4 py-7 text-center transition hover:border-[var(--solv-brand)] hover:bg-glass-soft"
            >
              <Icon name="upload" size={20} className="text-ink-faint" />
              <span className="mt-2 text-[12.5px] font-medium text-ink">
                Drop captures, scripts or logs
              </span>
              <span className="mt-1 text-[11.5px] text-ink-faint">
                PNG, PCAP, TXT or ZIP up to 25 MB each
              </span>
            </button>
          </Panel>
        </div>

        {/* ------------------------------------------------------------ Aside */}
        <div className="space-y-5">
          <Panel className="p-5">
            <PanelHeader
              title="Ready to submit"
              icon={<Icon name="check-circle" size={17} />}
              className="px-0 pt-0"
            />
            <ul className="mt-4 space-y-2.5">
              {checks.map((check) => (
                <li key={check.label} className="flex items-start gap-2.5 text-[12.5px]">
                  <Icon
                    name={check.ok ? 'check-circle' : 'info'}
                    size={15}
                    className="mt-0.5 shrink-0"
                    style={{ color: check.ok ? 'var(--status-good)' : 'var(--solv-ink-faint)' }}
                  />
                  <span className={check.ok ? 'text-ink-muted line-through' : 'text-ink'}>
                    {check.label}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              variant="primary"
              block
              className="mt-5"
              icon="upload"
              disabled={!ready}
              onClick={() => setSubmitted(true)}
            >
              Submit report
            </Button>
            <p className="mt-2.5 text-center text-[11px] text-ink-faint">
              You can edit the report until first triage.
            </p>
          </Panel>

          <Panel className="p-5">
            <PanelHeader
              title="Attestations"
              description="Required before a report can be filed."
              icon={<Icon name="shield" size={17} />}
              className="px-0 pt-0"
            />
            <div className="mt-4 space-y-3">
              {(
                [
                  ['scope', `I stayed inside ${employer.name}’s published scope.`],
                  ['data', 'I did not access, copy or retain any personal data.'],
                  ['disclosure', 'I will not disclose this publicly before the 90-day window.'],
                ] as const
              ).map(([key, text]) => (
                <label key={key} className="flex cursor-pointer items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={attested[key]}
                    onChange={(event) =>
                      setAttested((current) => ({ ...current, [key]: event.target.checked }))
                    }
                    className="mt-0.5 size-4 shrink-0 rounded accent-[var(--solv-brand)]"
                  />
                  <span className="text-[12px] leading-snug text-ink-muted">{text}</span>
                </label>
              ))}
            </div>
          </Panel>

          <Panel className="p-5">
            <PanelHeader
              title={`${employer.name} at a glance`}
              icon={<Icon name="building" size={17} />}
              className="px-0 pt-0"
            />
            <dl className="mt-4 space-y-3 text-[12.5px]">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-muted">Median first response</dt>
                <dd className="font-semibold text-ink">{employer.triageSlaHours} h</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-muted">Open programs</dt>
                <dd className="font-semibold tabular-nums text-ink">{employer.openPrograms}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-muted">Escrow funded</dt>
                <dd className="font-semibold tabular-nums text-ink">
                  {employer.escrowFunded.toLocaleString('en-US')} {employer.currency.code}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-muted">Safe Harbor since</dt>
                <dd className="font-semibold text-ink">{formatDate(employer.safeHarborSince, true)}</dd>
              </div>
            </dl>
            <p className="mt-4 border-t border-hairline-soft pt-3.5 text-[11.5px] leading-relaxed text-ink-faint">
              {employer.tagline}
            </p>
          </Panel>

          <Panel className="p-5">
            <PanelHeader
              title="Severity rubric"
              description="Mapped to the reserved status scale used across the platform."
              icon={<Icon name="alert" size={17} />}
              className="px-0 pt-0"
            />
            <ul className="mt-4 space-y-2.5">
              {[...SEVERITIES].reverse().map((entry) => (
                <li key={entry} className="flex items-center justify-between gap-3">
                  <SeverityBadge severity={entry} size="xs" />
                  <span className="text-[11.5px] tabular-nums text-ink-faint">
                    {entry === 'Informational' && '0.0'}
                    {entry === 'Low' && '0.1 – 3.9'}
                    {entry === 'Medium' && '4.0 – 6.9'}
                    {entry === 'High' && '7.0 – 8.9'}
                    {entry === 'Critical' && '9.0 – 10.0'}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </>
  )
}
