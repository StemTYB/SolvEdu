import { useMemo, useState } from 'react'

import { Chip } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Icon, type IconName } from '@/components/ui/Icon'
import { Panel, PanelHeader } from '@/components/ui/Panel'
import { Segmented } from '@/components/ui/Segmented'
import { ViewHeader } from '@/components/ui/SectionHeading'
import { RESOURCES } from '@/data/resources'
import type { ResourceDoc } from '@/data/types'
import { cn, formatDate, relativeTime } from '@/lib/format'

type CategoryFilter = 'All' | ResourceDoc['category']

/**
 * Document categories are labelled by icon and name only. This view carries no
 * chart, so it introduces no categorical scale — a fourth hue system on one
 * screen would compete with the status palette for no gain.
 */
const CATEGORY_ICON: Record<ResourceDoc['category'], IconName> = {
  Policy: 'shield',
  Guideline: 'book',
  Playbook: 'target',
  Reference: 'info',
}

const CATEGORIES: ResourceDoc['category'][] = ['Policy', 'Guideline', 'Playbook', 'Reference']

const SAFE_HARBOR = [
  {
    title: 'We will not pursue you',
    body: 'For work inside a published scope, the company waives civil claims and will not refer the finding to law enforcement.',
  },
  {
    title: 'We will triage in good faith',
    body: 'A human reads every report. Median first response across the five companies is 22 hours.',
  },
  {
    title: 'We will pay what we publish',
    body: 'Award bands are fixed before you file. A company cannot reduce an award because the fix was easy.',
  },
  {
    title: 'You will not touch live data',
    body: 'Personal data is out of scope everywhere. Stop at the first proof and report immediately.',
  },
]

export function ResourcesView() {
  const [category, setCategory] = useState<CategoryFilter>('All')

  const pinned = useMemo(() => RESOURCES.filter((doc) => doc.pinned), [])
  const docs = useMemo(
    () => (category === 'All' ? RESOURCES : RESOURCES.filter((doc) => doc.category === category)),
    [category],
  )

  const categoryOptions: Array<{ value: CategoryFilter; label: string; count: number }> = [
    { value: 'All', label: 'All', count: RESOURCES.length },
    ...CATEGORIES.map((entry) => ({
      value: entry,
      label: entry,
      count: RESOURCES.filter((doc) => doc.category === entry).length,
    })),
  ]

  return (
    <>
      <ViewHeader
        title="Resources & Guidelines"
        description="Read the policy before you file, not after. Nearly every rejected report on this platform was rejected on a rule that is written down here."
        action={
          <>
            <Button icon="download">Download handbook</Button>
            <Button variant="primary" icon="book">
              Reporting guide
            </Button>
          </>
        }
      />

      {/* --------------------------------------------------------- Safe Harbor */}
      <Panel className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <Icon name="shield" size={18} className="text-brand-ink" />
              <h2 className="text-[17px] leading-tight font-semibold tracking-tight text-ink">
                Safe Harbor at a glance
              </h2>
            </div>
            <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-muted">
              What every client company commits to when you stay inside a published scope. The
              binding text is version 4.2 — the summary below is orientation, not the contract.
            </p>
          </div>
          <Chip size="sm" icon="check" tone="var(--status-good)">
            In effect since 5 Sep 2026
          </Chip>
        </div>

        <dl className="mt-6 grid gap-5 border-t border-hairline-soft pt-6 sm:grid-cols-2 xl:grid-cols-4">
          {SAFE_HARBOR.map((item) => (
            <div key={item.title}>
              <dt className="flex items-start gap-2 text-[13px] font-semibold text-ink">
                <Icon
                  name="check"
                  size={14}
                  className="mt-0.5 shrink-0"
                  style={{ color: 'var(--status-good)' }}
                />
                {item.title}
              </dt>
              <dd className="mt-2 text-[12px] leading-relaxed text-ink-muted">{item.body}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 border-t border-hairline-soft pt-4 text-[12px] leading-relaxed text-ink-muted">
          <strong className="font-semibold text-ink">Out of scope, everywhere.</strong> Live
          production infrastructure, third-party systems, social engineering of company staff, and
          any access to personal data. Physical-access programmes are supervised-only and are
          listed as such on the brief.
        </p>
      </Panel>

      {/* ------------------------------------------------------------- Pinned */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[19px] leading-tight font-semibold tracking-tight text-ink">
              Start here
            </h2>
            <p className="mt-1.5 text-[13.5px] text-ink-muted">
              The three documents that decide most first-time outcomes.
            </p>
          </div>
          <Chip size="sm" icon="book">
            {pinned.length} pinned
          </Chip>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {pinned.map((doc, index) => (
            <Panel key={doc.id} className="flex flex-col p-5">
              <div className="flex items-center gap-2.5">
                <span className="grid size-7 place-items-center rounded-lg bg-brand-wash text-[12px] font-bold tabular-nums text-brand-ink">
                  {index + 1}
                </span>
                <Chip size="xs" icon={CATEGORY_ICON[doc.category]}>
                  {doc.category}
                </Chip>
              </div>
              <h3 className="mt-4 text-[15px] leading-snug font-semibold text-ink">{doc.title}</h3>
              <p className="mt-2.5 flex-1 text-[12.5px] leading-relaxed text-ink-muted">
                {doc.summary}
              </p>
              <div className="mt-5 flex items-center justify-between gap-3 border-t border-hairline-soft pt-4">
                <span className="text-[11.5px] text-ink-faint">{doc.readMinutes} min read</span>
                <Button size="sm" variant="ghost" trailingIcon="chevron-right">
                  Open
                </Button>
              </div>
            </Panel>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------- Library */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[19px] leading-tight font-semibold tracking-tight text-ink">
              Library
            </h2>
            <p className="mt-1.5 text-[13.5px] text-ink-muted">
              Policies bind you. Guidelines and playbooks do not, but they shorten triage.
            </p>
          </div>
          <Segmented
            label="Filter documents by category"
            options={categoryOptions}
            value={category}
            onChange={setCategory}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {docs.map((doc) => (
            <Panel
              key={doc.id}
              className={cn('flex flex-col p-5', doc.pinned && 'bg-glass-strong')}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Icon name={CATEGORY_ICON[doc.category]} size={15} className="text-ink-faint" />
                  <span className="text-[11.5px] font-semibold tracking-[0.1em] text-ink-faint uppercase">
                    {doc.category}
                  </span>
                </div>
                {doc.pinned && (
                  <Chip size="xs" icon="star">
                    Pinned
                  </Chip>
                )}
              </div>

              <h3 className="mt-3.5 text-[14px] leading-snug font-semibold text-ink">{doc.title}</h3>
              <p className="mt-2 flex-1 text-[12.5px] leading-relaxed text-ink-muted">
                {doc.summary}
              </p>

              <dl className="mt-5 flex items-center justify-between gap-3 border-t border-hairline-soft pt-4 text-[11px] text-ink-faint">
                <div className="flex items-center gap-3">
                  <span className="font-mono">{doc.id}</span>
                  <span>{doc.readMinutes} min</span>
                </div>
                <div className="text-right">
                  <dt className="sr-only">Last updated</dt>
                  <dd title={formatDate(doc.updatedAt, true)}>
                    updated {relativeTime(doc.updatedAt)}
                  </dd>
                </div>
              </dl>

              <Button size="sm" variant="ghost" className="mt-3 -ml-3 self-start" trailingIcon="chevron-right">
                Read document
              </Button>
            </Panel>
          ))}
        </div>

        {docs.length === 0 && (
          <Panel className="px-6 py-16 text-center">
            <p className="text-[13px] text-ink-muted">Nothing filed under that category yet.</p>
          </Panel>
        )}
      </section>

      {/* ------------------------------------------------------------ Checklist */}
      <Panel className="p-5 sm:p-6">
        <PanelHeader
          title="Before you hit submit"
          description="A five-point pass that catches most of what triagers bounce."
          icon={<Icon name="check-circle" size={17} />}
          className="px-0 pt-0"
        />
        <ol className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
          {[
            ['Scope', 'The asset is named in the brief’s published scope, as amended today.'],
            ['Reproduction', 'Numbered steps from a clean state, with the environment stated.'],
            ['Evidence', 'A bounded PoC and sanitised captures. No personal data anywhere.'],
            ['Duplicates', 'You searched Hacktivity for the same defect before filing.'],
            ['Impact', 'You stated what an attacker gains, not what you think they might.'],
          ].map(([term, body], index) => (
            <li key={term}>
              <div className="flex items-center gap-2">
                <span className="grid size-6 place-items-center rounded-full bg-brand-wash text-[11px] font-bold tabular-nums text-brand-ink">
                  {index + 1}
                </span>
                <span className="text-[12.5px] font-semibold text-ink">{term}</span>
              </div>
              <p className="mt-2 text-[12px] leading-relaxed text-ink-muted">{body}</p>
            </li>
          ))}
        </ol>
      </Panel>
    </>
  )
}
