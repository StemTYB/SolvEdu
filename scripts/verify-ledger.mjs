/**
 * The money ledger and the award bands are interlocking: the wallet, the
 * submissions table, the public feed, the leaderboard and the profile all quote
 * figures that have to agree with one another. They are hand-authored constants,
 * so they are checked rather than trusted.
 *
 * Node strips the TypeScript annotations natively (Node 22.6+), which is why
 * this can import the data modules directly and needs no build step.
 *
 * Usage: npm run verify
 */
import { CURRENT_USER } from '../src/data/user.ts'
import { LEADERBOARD, TOTAL_SOLVERS } from '../src/data/leaderboard.ts'
import {
  AVAILABLE_TOTAL, LIFETIME_EARNINGS, LIFETIME_PAYOUTS, MONTHLY_EARNINGS,
  PAYOUTS, PENDING_TOTAL, WALLET_ACCOUNTS,
} from '../src/data/earnings.ts'
import { MAX_BOUNTY, MIN_BOUNTY, PROGRAMS } from '../src/data/programs.ts'
import { SUBMISSIONS } from '../src/data/submissions.ts'
import { HACKTIVITY } from '../src/data/hacktivity.ts'
import { DIFFICULTY_BANDS } from '../src/lib/presentation.ts'

const checks = []
const check = (name, ok, detail = '') => checks.push({ name, ok, detail })

const sum = (list, pick) => list.reduce((total, item) => total + pick(item), 0)

const programById = new Map(PROGRAMS.map((program) => [program.id, program]))

// ---------------------------------------------------------------- ledger
check(
  'sum(MONTHLY_EARNINGS.amount) === LIFETIME_EARNINGS',
  sum(MONTHLY_EARNINGS, (m) => m.amount) === LIFETIME_EARNINGS,
  `${sum(MONTHLY_EARNINGS, (m) => m.amount)} vs ${LIFETIME_EARNINGS}`,
)
check(
  'sum(MONTHLY_EARNINGS.payouts) === LIFETIME_PAYOUTS',
  sum(MONTHLY_EARNINGS, (m) => m.payouts) === LIFETIME_PAYOUTS,
  `${sum(MONTHLY_EARNINGS, (m) => m.payouts)} vs ${LIFETIME_PAYOUTS}`,
)
check(
  'sum(WALLET_ACCOUNTS.lifetime) === LIFETIME_EARNINGS',
  sum(WALLET_ACCOUNTS, (a) => a.lifetime) === LIFETIME_EARNINGS,
  `${sum(WALLET_ACCOUNTS, (a) => a.lifetime)} vs ${LIFETIME_EARNINGS}`,
)
check(
  'sum(WALLET_ACCOUNTS.pending) === PENDING_TOTAL',
  sum(WALLET_ACCOUNTS, (a) => a.pending) === PENDING_TOTAL,
  `${sum(WALLET_ACCOUNTS, (a) => a.pending)} vs ${PENDING_TOTAL}`,
)
check(
  'sum(WALLET_ACCOUNTS.available) === AVAILABLE_TOTAL',
  sum(WALLET_ACCOUNTS, (a) => a.available) === AVAILABLE_TOTAL,
  `${sum(WALLET_ACCOUNTS, (a) => a.available)} vs ${AVAILABLE_TOTAL}`,
)
check(
  'lifetime payouts do not exceed valid reports',
  LIFETIME_PAYOUTS <= CURRENT_USER.validReports,
  `${LIFETIME_PAYOUTS} payouts from ${CURRENT_USER.validReports} valid reports`,
)

const me = LEADERBOARD.find((entry) => entry.isCurrentUser)
check('leaderboard has exactly one isCurrentUser', LEADERBOARD.filter((e) => e.isCurrentUser).length === 1)
check('leaderboard entry mirrors CURRENT_USER.rank', me?.rank === CURRENT_USER.rank, `${me?.rank} vs ${CURRENT_USER.rank}`)
check('leaderboard entry mirrors CURRENT_USER.reputation', me?.reputation === CURRENT_USER.reputation)
check('leaderboard entry mirrors CURRENT_USER.validReports', me?.validReports === CURRENT_USER.validReports)
check(
  'leaderboard currentUser.earned === LIFETIME_EARNINGS',
  me?.earned === LIFETIME_EARNINGS,
  `${me?.earned} vs ${LIFETIME_EARNINGS}`,
)
check('CURRENT_USER.rankPool === TOTAL_SOLVERS', CURRENT_USER.rankPool === TOTAL_SOLVERS)

const ranks = LEADERBOARD.map((entry) => entry.rank)
check('leaderboard ranks are 1..N with no gaps', ranks.every((rank, index) => rank === index + 1))
const earnedDescending = LEADERBOARD.every((entry, i) => i === 0 || LEADERBOARD[i - 1].earned >= entry.earned)
check('leaderboard is ordered by earned, descending', earnedDescending)

// ------------------------------------------------------------ award bands
check('directory floor is $100', MIN_BOUNTY === 100, String(MIN_BOUNTY))
check('directory ceiling is $3,000', MAX_BOUNTY === 3_000, String(MAX_BOUNTY))

const bandMismatches = PROGRAMS.filter((program) => {
  const band = DIFFICULTY_BANDS[program.difficulty]
  return program.bountyMin !== band.min || program.bountyMax !== band.max
})
check(
  'every program matches its difficulty band exactly',
  bandMismatches.length === 0,
  bandMismatches.map((p) => `${p.id} ${p.difficulty} ${p.bountyMin}-${p.bountyMax}`).join('; '),
)

const missingBand = PROGRAMS.filter((program) => program.bountyMin >= program.bountyMax)
check('every program has min < max', missingBand.length === 0, missingBand.map((p) => p.id).join(','))

// Payouts recorded on reports and on the public feed must sit inside the band
// of the programme they were filed against. Reports carry a programme id; the
// public feed names the programme by title, so join on that instead.
const outOfBand = []
const bandCheck = (id, program, payout) => {
  if (!program) {
    outOfBand.push(`${id} references an unknown programme`)
    return
  }
  if (payout < program.bountyMin || payout > program.bountyMax) {
    outOfBand.push(`${id} ${payout} outside ${program.id} ${program.bountyMin}-${program.bountyMax}`)
  }
}
for (const item of SUBMISSIONS) {
  if (item.payout) bandCheck(item.id, programById.get(item.programId), item.payout)
}
const programByTitle = new Map(PROGRAMS.map((program) => [program.title, program]))
for (const item of HACKTIVITY) {
  if (item.payout) bandCheck(item.id, programByTitle.get(item.programTitle), item.payout)
}
check('every award sits inside its programme band', outOfBand.length === 0, outOfBand.join('; '))

const unknownTitle = HACKTIVITY.filter((item) => !programByTitle.has(item.programTitle))
check(
  'every hacktivity event names a real programme',
  unknownTitle.length === 0,
  unknownTitle.map((item) => `${item.id}: ${item.programTitle}`).join('; '),
)

// Each payout row repeats the amount on its submission.
const payoutDrift = PAYOUTS.filter((payout) => {
  const submission = SUBMISSIONS.find((item) => item.id === payout.submissionId)
  if (!submission) return true
  return submission.payout !== payout.amount
})
check(
  'every payout amount matches its submission',
  payoutDrift.length === 0,
  payoutDrift.map((p) => `${p.id}/${p.submissionId}`).join(', '),
)

const unknownSubmission = PAYOUTS.filter((p) => !SUBMISSIONS.some((s) => s.id === p.submissionId))
check('every payout points at a real submission', unknownSubmission.length === 0)

const settled = sum(SUBMISSIONS.filter((s) => s.state === 'Pagado'), (s) => s.payout)
const awaiting = sum(SUBMISSIONS.filter((s) => s.state === 'Aceptado'), (s) => s.payout)
check(
  'settled reports reconcile against AVAILABLE_TOTAL',
  settled === AVAILABLE_TOTAL,
  `${settled} vs ${AVAILABLE_TOTAL}`,
)
check(
  'accepted reports reconcile against PENDING_TOTAL',
  awaiting === PENDING_TOTAL,
  `${awaiting} vs ${PENDING_TOTAL}`,
)

// Per company, so a total that happens to agree cannot hide two that do not.
const perCompany = []
for (const account of WALLET_ACCOUNTS) {
  const mine = SUBMISSIONS.filter((item) => item.companyId === account.companyId)
  const won = sum(mine.filter((item) => item.state === 'Pagado'), (item) => item.payout)
  const escrow = sum(mine.filter((item) => item.state === 'Aceptado'), (item) => item.payout)
  if (won !== account.available) perCompany.push(`${account.companyId} available ${account.available} vs ${won}`)
  if (escrow !== account.pending) perCompany.push(`${account.companyId} pending ${account.pending} vs ${escrow}`)
  if (account.lifetime < account.pending + account.available) {
    perCompany.push(`${account.companyId} lifetime below its own live balances`)
  }
}
check('per-company balances match that company’s reports', perCompany.length === 0, perCompany.join('; '))

// ---------------------------------------------------------------- report
let failed = 0
for (const entry of checks) {
  if (!entry.ok) failed += 1
  console.log(`${entry.ok ? 'ok  ' : 'FAIL'}  ${entry.name}${entry.detail ? `  → ${entry.detail}` : ''}`)
}
console.log(`\n${failed === 0 ? 'PASS' : `FAIL (${failed})`} — ${checks.length} invariants`)
process.exit(failed === 0 ? 0 : 1)
