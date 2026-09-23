import type { IconName } from '@/components/ui/Icon'
import type { Difficulty, PayoutState, Severity, SubmissionState } from '@/data/types'

/**
 * Severity wears the reserved status palette — it is a state, never a series.
 * Every render site pairs the colour with its icon and its label, so the colour
 * is never the only channel carrying the level.
 */
export const SEVERITY_META: Record<
  Severity,
  { color: string; icon: IconName; rank: number }
> = {
  Informational: { color: 'var(--solv-ink-faint)', icon: 'info', rank: 0 },
  Low: { color: 'var(--status-good)', icon: 'arrow-down', rank: 1 },
  Medium: { color: 'var(--status-warning)', icon: 'subtract', rank: 2 },
  High: { color: 'var(--status-serious)', icon: 'arrow-up', rank: 3 },
  Critical: { color: 'var(--status-critical)', icon: 'alert', rank: 4 },
}

export const SEVERITIES: Severity[] = ['Informational', 'Low', 'Medium', 'High', 'Critical']

/**
 * Pipeline states are a categorical encoding, not a status — five workflow
 * stages with no good/bad ordering, so they take the validated categorical
 * slots in order. The order below matches the stack order on the dashboard,
 * which is what keeps the rendered adjacency inside the validated pairlist.
 */
export const STATE_META: Record<
  SubmissionState,
  { slot: number; varName: string; icon: IconName }
> = {
  Pending: { slot: 1, varName: '--viz-series-1', icon: 'clock' },
  Triaged: { slot: 2, varName: '--viz-series-2', icon: 'eye' },
  Accepted: { slot: 3, varName: '--viz-series-3', icon: 'check' },
  Duplicated: { slot: 4, varName: '--viz-series-4', icon: 'copy' },
  Paid: { slot: 5, varName: '--viz-series-5', icon: 'coins' },
}

export const PAYOUT_STATE_META: Record<PayoutState, { icon: IconName; tone: string }> = {
  Cleared: { icon: 'check', tone: 'var(--status-good)' },
  Processing: { icon: 'clock', tone: 'var(--status-warning)' },
  Held: { icon: 'shield', tone: 'var(--status-serious)' },
  Scheduled: { icon: 'calendar', tone: 'var(--solv-ink-faint)' },
}

export const DIFFICULTY_META: Record<Difficulty, { dots: number; hint: string }> = {
  Intro: { dots: 1, hint: 'Suitable for a first bounty' },
  Intermediate: { dots: 2, hint: 'Prior triage experience expected' },
  Advanced: { dots: 3, hint: 'Deep familiarity with the stack' },
  Elite: { dots: 4, hint: 'Invitation-style scope; strict rules of engagement' },
}

/** Reputation tiers, keyed by the floor value of each band. */
export const RANK_TIERS = [
  { name: 'Rank I — Initiate', floor: 0 },
  { name: 'Rank II — Field Analyst', floor: 3_500 },
  { name: 'Rank III — Archivist', floor: 9_940 },
  { name: 'Rank IV — Warden', floor: 16_500 },
  { name: 'Rank V — Laureate', floor: 24_000 },
] as const

export function tierFor(reputation: number): { current: string; next: string | null; progress: number } {
  let index = 0
  for (let i = 0; i < RANK_TIERS.length; i += 1) {
    if (reputation >= RANK_TIERS[i].floor) index = i
  }

  const current = RANK_TIERS[index]
  const next = RANK_TIERS[index + 1] ?? null
  const floor = current.floor
  const ceiling = next?.floor ?? current.floor
  const progress = next ? (reputation - floor) / (ceiling - floor) : 1

  return { current: current.name, next: next?.name ?? null, progress: Math.min(1, Math.max(0, progress)) }
}
