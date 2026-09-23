import type { MonthlyEarnings, Payout, WalletAccount } from './types'

/**
 * Twelve months of settled award in USD. The final entry (Sep 2026) is
 * month-to-date, which is why it falls back from the August peak.
 *
 * `LIFETIME_EARNINGS` and `LIFETIME_PAYOUTS` are derived from this series, and
 * `WALLET_ACCOUNTS` is built to sum to the same lifetime total — a report that
 * reaches "Pagado" is counted here exactly once.
 */
export const MONTHLY_EARNINGS: MonthlyEarnings[] = [
  { period: '2025-10', label: 'Oct', amount: 800, payouts: 1 },
  { period: '2025-11', label: 'Nov', amount: 1_400, payouts: 2 },
  { period: '2025-12', label: 'Dic', amount: 400, payouts: 1 },
  { period: '2026-01', label: 'Ene', amount: 2_000, payouts: 2 },
  { period: '2026-02', label: 'Feb', amount: 2_600, payouts: 3 },
  { period: '2026-03', label: 'Mar', amount: 1_600, payouts: 2 },
  { period: '2026-04', label: 'Abr', amount: 3_200, payouts: 4 },
  { period: '2026-05', label: 'May', amount: 2_000, payouts: 2 },
  { period: '2026-06', label: 'Jun', amount: 4_600, payouts: 5 },
  { period: '2026-07', label: 'Jul', amount: 6_400, payouts: 6 },
  { period: '2026-08', label: 'Ago', amount: 11_170, payouts: 8 },
  { period: '2026-09', label: 'Sep', amount: 7_000, payouts: 3 },
]

export const LIFETIME_EARNINGS = MONTHLY_EARNINGS.reduce((sum, month) => sum + month.amount, 0)

export const LIFETIME_PAYOUTS = MONTHLY_EARNINGS.reduce((sum, month) => sum + month.payouts, 0)

/**
 * Per-company balances in USD.
 *
 * Both running balances are tied to the report ledger, so the wallet and the
 * submissions table can never tell different stories:
 *
 *   `available` — the company's reports already at "Pagado" (settled, cleared).
 *   `pending`   — the company's reports at "Aceptado" (won, still in escrow).
 *
 * `lifetime` is the all-time figure and sums to LIFETIME_EARNINGS; earlier
 * awards have already been withdrawn, so it is deliberately larger than the
 * two live balances added together.
 */
export const WALLET_ACCOUNTS: WalletAccount[] = [
  {
    companyId: 'stark',
    pending: 2_000,
    available: 0,
    lifetime: 13_400,
    settleDays: 14,
  },
  {
    companyId: 'wayne',
    pending: 600,
    available: 2_000,
    lifetime: 11_200,
    settleDays: 21,
  },
  {
    companyId: 'umbrella',
    pending: 400,
    available: 800,
    lifetime: 6_850,
    settleDays: 18,
  },
  {
    companyId: 'aperture',
    pending: 0,
    available: 3_700,
    lifetime: 7_320,
    settleDays: 11,
  },
  {
    companyId: 'oscorp',
    pending: 0,
    available: 900,
    lifetime: 4_400,
    settleDays: 24,
  },
]

export const PAYOUTS: Payout[] = [
  {
    id: 'PAY-3312',
    companyId: 'stark',
    submissionId: 'SUB-4468',
    title: 'El gobernador térmico se rearma antes de que el dado complete su enfriamiento',
    amount: 2_000,
    state: 'En proceso',
    requestedAt: '2026-09-17T11:30:00Z',
    settlesAt: '2026-10-01',
  },
  {
    id: 'PAY-3308',
    companyId: 'umbrella',
    submissionId: 'SUB-4436',
    title: 'Inyección de plantilla a través de las notas libres del recolector',
    amount: 400,
    state: 'Retenido',
    requestedAt: '2026-08-22T09:14:00Z',
    settlesAt: '2026-10-06',
  },
  {
    id: 'PAY-3299',
    companyId: 'aperture',
    submissionId: 'SUB-4455',
    title: 'El rol de operador alcanza endpoints de planificación de toda la instalación',
    amount: 2_000,
    state: 'Liquidado',
    requestedAt: '2026-08-30T09:00:00Z',
    settlesAt: '2026-09-12',
  },
  {
    id: 'PAY-3287',
    companyId: 'wayne',
    submissionId: 'SUB-4449',
    title: 'Ventana de repetición de tramas de telemetría medida en 11 minutos',
    amount: 2_000,
    state: 'Liquidado',
    requestedAt: '2026-08-22T10:20:00Z',
    settlesAt: '2026-09-04',
  },
  {
    id: 'PAY-3271',
    companyId: 'oscorp',
    submissionId: 'SUB-4430',
    title: 'El rol de acceso de emergencia omite el doble control en lecturas de la bóveda',
    amount: 900,
    state: 'Liquidado',
    requestedAt: '2026-08-01T12:00:00Z',
    settlesAt: '2026-08-15',
  },
  {
    id: 'PAY-3260',
    companyId: 'wayne',
    submissionId: 'SUB-4418',
    title: 'Las reglas de lint omiten el intercambio de claves RSA tras un proxy que termina TLS',
    amount: 600,
    state: 'Programado',
    requestedAt: '2026-08-02T16:10:00Z',
    settlesAt: '2026-10-17',
  },
]

export const PENDING_TOTAL = WALLET_ACCOUNTS.reduce((sum, account) => sum + account.pending, 0)
export const AVAILABLE_TOTAL = WALLET_ACCOUNTS.reduce((sum, account) => sum + account.available, 0)
