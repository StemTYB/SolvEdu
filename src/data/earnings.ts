import type { MonthlyEarnings, Payout, WalletAccount } from './types'

/**
 * Twelve months of settled reward, normalised to the ledger unit.
 * The final entry (Sep 2026) is month-to-date.
 */
export const MONTHLY_EARNINGS: MonthlyEarnings[] = [
  { period: '2025-10', label: 'Oct', amount: 4_200, payouts: 2 },
  { period: '2025-11', label: 'Nov', amount: 6_800, payouts: 3 },
  { period: '2025-12', label: 'Dec', amount: 3_100, payouts: 1 },
  { period: '2026-01', label: 'Jan', amount: 9_400, payouts: 4 },
  { period: '2026-02', label: 'Feb', amount: 11_200, payouts: 5 },
  { period: '2026-03', label: 'Mar', amount: 7_600, payouts: 3 },
  { period: '2026-04', label: 'Apr', amount: 14_800, payouts: 6 },
  { period: '2026-05', label: 'May', amount: 8_600, payouts: 2 },
  { period: '2026-06', label: 'Jun', amount: 18_400, payouts: 7 },
  { period: '2026-07', label: 'Jul', amount: 24_200, payouts: 9 },
  { period: '2026-08', label: 'Aug', amount: 31_600, payouts: 11 },
  { period: '2026-09', label: 'Sep', amount: 12_800, payouts: 4 },
]

export const LIFETIME_EARNINGS = MONTHLY_EARNINGS.reduce((sum, month) => sum + month.amount, 0)

export const LIFETIME_PAYOUTS = MONTHLY_EARNINGS.reduce((sum, month) => sum + month.payouts, 0)

/** Per-company balances. `lifetime` across accounts sums to LIFETIME_EARNINGS. */
export const WALLET_ACCOUNTS: WalletAccount[] = [
  {
    companyId: 'stark',
    currency: { code: 'SC', name: 'Stark Credits', glyph: '⌁' },
    pending: 38_000,
    available: 12_500,
    lifetime: 61_400,
    settleDays: 14,
  },
  {
    companyId: 'wayne',
    currency: { code: 'WCG', name: 'WayneCorp Grants', glyph: '◈' },
    pending: 0,
    available: 9_800,
    lifetime: 34_700,
    settleDays: 21,
  },
  {
    companyId: 'umbrella',
    currency: { code: 'UBR', name: 'Umbrella Bio-Rewards', glyph: '❖' },
    pending: 14_000,
    available: 2_100,
    lifetime: 21_500,
    settleDays: 18,
  },
  {
    companyId: 'aperture',
    currency: { code: 'ARS', name: 'Aperture Research Stipends', glyph: '⊕' },
    pending: 0,
    available: 6_300,
    lifetime: 24_600,
    settleDays: 11,
  },
  {
    companyId: 'oscorp',
    currency: { code: 'OSF', name: 'Oscorp Fellowships', glyph: '✦' },
    pending: 0,
    available: 3_400,
    lifetime: 10_500,
    settleDays: 24,
  },
]

export const PAYOUTS: Payout[] = [
  {
    id: 'PAY-3312',
    companyId: 'stark',
    submissionId: 'SUB-4468',
    title: 'Thermal governor re-arms before die cooldown completes',
    amount: 38_000,
    currencyCode: 'SC',
    state: 'Processing',
    requestedAt: '2026-09-17T11:30:00Z',
    settlesAt: '2026-10-01',
  },
  {
    id: 'PAY-3308',
    companyId: 'umbrella',
    submissionId: 'SUB-4436',
    title: 'Template injection through collector free-text notes',
    amount: 14_000,
    currencyCode: 'UBR',
    state: 'Held',
    requestedAt: '2026-08-22T09:14:00Z',
    settlesAt: '2026-10-06',
  },
  {
    id: 'PAY-3299',
    companyId: 'aperture',
    submissionId: 'SUB-4455',
    title: 'Operator role reaches facility-wide scheduling endpoints',
    amount: 61_500,
    currencyCode: 'ARS',
    state: 'Cleared',
    requestedAt: '2026-08-30T09:00:00Z',
    settlesAt: '2026-09-12',
  },
  {
    id: 'PAY-3287',
    companyId: 'wayne',
    submissionId: 'SUB-4449',
    title: 'Telemetry frame replay window measured at 11 minutes',
    amount: 54_000,
    currencyCode: 'WCG',
    state: 'Cleared',
    requestedAt: '2026-08-22T10:20:00Z',
    settlesAt: '2026-09-04',
  },
  {
    id: 'PAY-3271',
    companyId: 'oscorp',
    submissionId: 'SUB-4430',
    title: 'Break-glass role bypasses dual control on vault reads',
    amount: 18_000,
    currencyCode: 'OSF',
    state: 'Cleared',
    requestedAt: '2026-08-01T12:00:00Z',
    settlesAt: '2026-08-15',
  },
  {
    id: 'PAY-3260',
    companyId: 'wayne',
    submissionId: 'SUB-4418',
    title: 'Lint rules miss RSA key exchange behind a TLS-terminating proxy',
    amount: 9_500,
    currencyCode: 'WCG',
    state: 'Scheduled',
    requestedAt: '2026-08-02T16:10:00Z',
    settlesAt: '2026-10-17',
  },
]

export const PENDING_TOTAL = WALLET_ACCOUNTS.reduce((sum, account) => sum + account.pending, 0)
export const AVAILABLE_TOTAL = WALLET_ACCOUNTS.reduce((sum, account) => sum + account.available, 0)
