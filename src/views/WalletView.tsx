import { useMemo, useState } from 'react'

import { EarningsChart } from '@/components/charts/EarningsChart'
import { Chip, ColorDot } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Meter } from '@/components/ui/Meter'
import { Monogram } from '@/components/ui/Monogram'
import { Panel, PanelHeader } from '@/components/ui/Panel'
import { Segmented } from '@/components/ui/Segmented'
import { ViewHeader } from '@/components/ui/SectionHeading'
import { company } from '@/data/companies'
import {
  AVAILABLE_TOTAL,
  LIFETIME_EARNINGS,
  LIFETIME_PAYOUTS,
  MONTHLY_EARNINGS,
  PAYOUTS,
  PENDING_TOTAL,
  WALLET_ACCOUNTS,
} from '@/data/earnings'
import type { PayoutState } from '@/data/types'
import { cn, compactNumber, formatDate, relativeTime } from '@/lib/format'
import { PAYOUT_STATE_META } from '@/lib/presentation'

type PayoutFilter = 'All' | PayoutState

const SETTLED_TOTAL = PENDING_TOTAL + AVAILABLE_TOTAL

export function WalletView() {
  const [state, setState] = useState<PayoutFilter>('All')

  const rows = useMemo(
    () => (state === 'All' ? PAYOUTS : PAYOUTS.filter((payout) => payout.state === state)),
    [state],
  )

  const stateOptions: Array<{ value: PayoutFilter; label: string; count: number }> = [
    { value: 'All', label: 'All', count: PAYOUTS.length },
    ...(Object.keys(PAYOUT_STATE_META) as PayoutState[]).map((entry) => ({
      value: entry,
      label: entry,
      count: PAYOUTS.filter((payout) => payout.state === entry).length,
    })),
  ]

  const thisMonth = MONTHLY_EARNINGS[MONTHLY_EARNINGS.length - 1]
  const bestMonth = MONTHLY_EARNINGS.reduce((best, month) =>
    month.amount > best.amount ? month : best,
  )

  return (
    <>
      <ViewHeader
        title="Earnings & Wallet"
        description="Every award is escrowed in its issuing company's own currency and settles 1:1 against the ledger unit, so balances across companies are additive."
        action={
          <>
            <Button icon="download">Export statement</Button>
            <Button variant="primary" icon="wallet">
              Withdraw
            </Button>
          </>
        }
      />

      {/* ------------------------------------------------------------- Balance */}
      <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <Panel className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-ink-muted">
              <Icon name="wallet" size={16} />
              <span className="text-[12.5px] font-semibold">Wallet balance</span>
            </div>
            <Chip size="xs" icon="refresh">
              Reconciled 04:00 UTC
            </Chip>
          </div>

          {/* The view's single hero figure. */}
          <p className="mt-5 text-[48px] leading-none font-bold tracking-tight text-ink sm:text-[56px]">
            {SETTLED_TOTAL.toLocaleString('en-US')}
            <span className="ml-2 text-[20px] font-semibold text-ink-muted">SC</span>
          </p>
          <p className="mt-2.5 text-[13px] text-ink-muted">
            across five company accounts — {LIFETIME_PAYOUTS} awards settled since October 2025
          </p>

          <dl className="mt-7 grid gap-5 border-t border-hairline-soft pt-6 sm:grid-cols-3">
            <div>
              <dt className="flex items-center gap-1.5 text-[11.5px] text-ink-muted">
                <ColorDot color="var(--status-good)" className="size-2" />
                Withdrawable now
              </dt>
              <dd className="mt-1.5 text-[22px] leading-none font-semibold tabular-nums text-ink">
                {compactNumber(AVAILABLE_TOTAL)}
                <span className="ml-1 text-[12px] font-normal text-ink-muted">SC</span>
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-[11.5px] text-ink-muted">
                <ColorDot color="var(--status-warning)" className="size-2" />
                In escrow
              </dt>
              <dd className="mt-1.5 text-[22px] leading-none font-semibold tabular-nums text-ink">
                {compactNumber(PENDING_TOTAL)}
                <span className="ml-1 text-[12px] font-normal text-ink-muted">SC</span>
              </dd>
            </div>
            <div>
              <dt className="text-[11.5px] text-ink-muted">Lifetime settled</dt>
              <dd className="mt-1.5 text-[22px] leading-none font-semibold tabular-nums text-ink">
                {compactNumber(LIFETIME_EARNINGS)}
                <span className="ml-1 text-[12px] font-normal text-ink-muted">SC</span>
              </dd>
            </div>
          </dl>

          <p className="mt-6 rounded-xl border border-hairline-soft bg-glass-soft px-3.5 py-3 text-[12px] leading-relaxed text-ink-muted">
            <Icon
              name="info"
              size={14}
              className="mr-1.5 -mt-0.5 inline align-middle"
              style={{ color: 'var(--status-warning)' }}
            />
            Escrow is not a hold on your work — it is the company's funding commitment. Release
            windows differ per programme and are published before you file.
          </p>
        </Panel>

        <Panel className="p-5 sm:p-6">
          <PanelHeader
            title="This month"
            description="Month to date, against your best month on record."
            icon={<Icon name="calendar" size={17} />}
            className="px-0 pt-0"
          />
          <dl className="mt-6 space-y-5">
            <div>
              <dt className="text-[11.5px] text-ink-muted">{thisMonth.label} 2026 — to date</dt>
              <dd className="mt-1.5 text-[26px] leading-none font-semibold tabular-nums text-ink">
                {compactNumber(thisMonth.amount)}
                <span className="ml-1.5 text-[13px] font-normal text-ink-muted">SC</span>
              </dd>
              <Meter
                value={thisMonth.amount / bestMonth.amount}
                className="mt-3"
                height={6}
              />
              <p className="mt-2 text-[11.5px] text-ink-faint">
                {thisMonth.payouts} awards settled ·{' '}
                {Math.round((thisMonth.amount / bestMonth.amount) * 100)}% of your best month (
                {bestMonth.label} {compactNumber(bestMonth.amount)} SC)
              </p>
            </div>

            <div className="border-t border-hairline-soft pt-5">
              <dt className="text-[11.5px] text-ink-muted">Next release</dt>
              <dd className="mt-1.5 flex flex-wrap items-center gap-2">
                <span className="text-[16px] font-semibold text-ink">
                  {compactNumber(PAYOUTS[0].amount)} {PAYOUTS[0].currencyCode}
                </span>
                <Chip size="xs" icon="clock">
                  {formatDate(PAYOUTS[0].settlesAt, true)}
                </Chip>
              </dd>
              <p className="mt-2 text-[11.5px] text-ink-faint">
                {PAYOUTS[0].id} · {company(PAYOUTS[0].companyId).name} ·{' '}
                {relativeTime(PAYOUTS[0].settlesAt)}
              </p>
            </div>
          </dl>
        </Panel>
      </div>

      {/* ------------------------------------------------------------ Accounts */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[19px] leading-tight font-semibold tracking-tight text-ink">
              Accounts by company
            </h2>
            <p className="mt-1.5 text-[13.5px] text-ink-muted">
              Each company settles in its own unit. The bar shows how much of that account is
              already withdrawable.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {WALLET_ACCOUNTS.map((account) => {
            const employer = company(account.companyId)
            const balance = account.pending + account.available
            const withdrawable = balance === 0 ? 0 : account.available / balance

            return (
              <Panel key={account.companyId} className="flex flex-col p-5">
                <div className="flex items-start gap-3">
                  <Monogram text={employer.monogram} accent={employer.accent} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-semibold text-ink">
                      {employer.name}
                    </p>
                    <p className="truncate text-[11.5px] text-ink-faint">{account.currency.name}</p>
                  </div>
                  <Chip size="xs" tone={employer.accent}>
                    {account.currency.glyph} {account.currency.code}
                  </Chip>
                </div>

                <div className="mt-5">
                  <p className="text-[11.5px] text-ink-muted">Withdrawable</p>
                  <p className="mt-1 text-[24px] leading-none font-semibold tabular-nums text-ink">
                    {compactNumber(account.available)}
                    <span className="ml-1.5 text-[12px] font-normal text-ink-muted">
                      {account.currency.code}
                    </span>
                  </p>
                </div>

                <Meter value={withdrawable} tone={employer.accent} className="mt-4" height={6} />

                <dl className="mt-4 flex flex-1 items-end justify-between gap-3 border-t border-hairline-soft pt-4 text-[11.5px]">
                  <div>
                    <dt className="text-ink-faint">In escrow</dt>
                    <dd className="mt-0.5 font-semibold tabular-nums text-ink">
                      {account.pending > 0
                        ? `${compactNumber(account.pending)} ${account.currency.code}`
                        : '—'}
                    </dd>
                  </div>
                  <div className="text-right">
                    <dt className="text-ink-faint">Lifetime</dt>
                    <dd className="mt-0.5 font-semibold tabular-nums text-ink">
                      {compactNumber(account.lifetime)} {account.currency.code}
                    </dd>
                  </div>
                </dl>

                <p className="mt-3 text-[11px] text-ink-faint">
                  Median {account.settleDays} days from acceptance to settlement
                </p>
              </Panel>
            )
          })}
        </div>
      </section>

      {/* -------------------------------------------------------------- Trend */}
      <Panel className="p-5 sm:p-6">
        <PanelHeader
          title="Settled reward by month"
          description="Normalised to the ledger unit. The current month is month-to-date and will keep moving."
          icon={<Icon name="trending-up" size={17} />}
          className="px-0 pt-0"
          action={<Chip size="sm">{LIFETIME_PAYOUTS} awards</Chip>}
        />
        <EarningsChart data={MONTHLY_EARNINGS} className="mt-6" />
      </Panel>

      {/* ------------------------------------------------------------ Payouts */}
      <Panel className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4 sm:px-6">
          <Segmented
            label="Filter payouts by state"
            options={stateOptions}
            value={state}
            onChange={setState}
          />
          <p className="ml-auto text-[12px] text-ink-faint">
            Showing the six most recent settlements
          </p>
        </div>

        <div className="overflow-x-auto border-t border-hairline-soft">
          <table className="w-full min-w-[860px] border-collapse text-left">
            <caption className="sr-only">
              Recent payouts: reference, company, the accepted report they settle, amount, state,
              request date and settlement date.
            </caption>
            <thead>
              <tr className="text-[11px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
                <th scope="col" className="px-5 py-3 sm:px-6">Reference</th>
                <th scope="col" className="px-3 py-3">Company</th>
                <th scope="col" className="px-3 py-3">Settles report</th>
                <th scope="col" className="px-3 py-3">State</th>
                <th scope="col" className="px-3 py-3">Requested</th>
                <th scope="col" className="px-3 py-3">Releases</th>
                <th scope="col" className="px-5 py-3 text-right sm:px-6">Amount</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((payout) => {
                const employer = company(payout.companyId)
                const meta = PAYOUT_STATE_META[payout.state]

                return (
                  <tr key={payout.id} className="border-t border-hairline-soft transition hover:bg-glass-soft">
                    <td className="px-5 py-3.5 align-top sm:px-6">
                      <span className="font-mono text-[11.5px] text-ink-faint">{payout.id}</span>
                    </td>

                    <td className="px-3 py-3.5 align-top">
                      <div className="flex items-center gap-2.5">
                        <Monogram text={employer.monogram} accent={employer.accent} size="xs" />
                        <span className="text-[12.5px] text-ink">{employer.name}</span>
                      </div>
                    </td>

                    <td className="max-w-[24rem] px-3 py-3.5 align-top">
                      <p className="text-[12.5px] leading-snug text-ink">{payout.title}</p>
                      <p className="mt-1 font-mono text-[11px] text-ink-faint">
                        {payout.submissionId}
                      </p>
                    </td>

                    <td className="px-3 py-3.5 align-top">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline-soft bg-glass-soft px-2 py-0.5 text-[11px] font-medium whitespace-nowrap text-ink">
                        <Icon name={meta.icon} size={12} style={{ color: meta.tone }} />
                        {payout.state}
                      </span>
                    </td>

                    <td className="px-3 py-3.5 align-top">
                      <span className="block text-[12.5px] text-ink">
                        {formatDate(payout.requestedAt)}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-ink-faint">
                        {relativeTime(payout.requestedAt)}
                      </span>
                    </td>

                    <td className="px-3 py-3.5 align-top">
                      <span className="block text-[12.5px] text-ink">
                        {formatDate(payout.settlesAt, true)}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-right align-top sm:px-6">
                      <span
                        className={cn(
                          'block text-[12.5px] font-semibold tabular-nums',
                          payout.state === 'Cleared' ? 'text-ink' : 'text-ink-muted',
                        )}
                      >
                        {compactNumber(payout.amount)} {payout.currencyCode}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {rows.length === 0 && (
          <p className="px-6 py-12 text-center text-[13px] text-ink-muted">
            No payouts in that state.
          </p>
        )}
      </Panel>
    </>
  )
}
