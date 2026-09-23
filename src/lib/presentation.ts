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
  Informativa: { color: 'var(--solv-ink-faint)', icon: 'info', rank: 0 },
  Baja: { color: 'var(--status-good)', icon: 'arrow-down', rank: 1 },
  Media: { color: 'var(--status-warning)', icon: 'subtract', rank: 2 },
  Alta: { color: 'var(--status-serious)', icon: 'arrow-up', rank: 3 },
  Crítica: { color: 'var(--status-critical)', icon: 'alert', rank: 4 },
}

export const SEVERITIES: Severity[] = ['Informativa', 'Baja', 'Media', 'Alta', 'Crítica']

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
  Pendiente: { slot: 1, varName: '--viz-series-1', icon: 'clock' },
  Triaje: { slot: 2, varName: '--viz-series-2', icon: 'eye' },
  Aceptado: { slot: 3, varName: '--viz-series-3', icon: 'check' },
  Duplicado: { slot: 4, varName: '--viz-series-4', icon: 'copy' },
  Pagado: { slot: 5, varName: '--viz-series-5', icon: 'coins' },
}

export const PAYOUT_STATE_META: Record<PayoutState, { icon: IconName; tone: string }> = {
  Liquidado: { icon: 'check', tone: 'var(--status-good)' },
  'En proceso': { icon: 'clock', tone: 'var(--status-warning)' },
  Retenido: { icon: 'shield', tone: 'var(--status-serious)' },
  Programado: { icon: 'calendar', tone: 'var(--solv-ink-faint)' },
}

export const DIFFICULTY_META: Record<Difficulty, { dots: number; hint: string }> = {
  Inicial: { dots: 1, hint: 'Apta como primer bounty' },
  Intermedia: { dots: 2, hint: 'Se espera experiencia previa en triaje' },
  Avanzada: { dots: 3, hint: 'Dominio profundo del stack' },
  Élite: { dots: 4, hint: 'Alcance por invitación; reglas de enfrentamiento estrictas' },
}

/**
 * Award bands in USD, one per difficulty. They are deliberately contiguous so
 * that a programme's band is implied by its difficulty and the whole directory
 * spans exactly the advertised $100 – $3,000 range.
 */
export const DIFFICULTY_BANDS: Record<Difficulty, { min: number; max: number }> = {
  Inicial: { min: 100, max: 400 },
  Intermedia: { min: 400, max: 1_000 },
  Avanzada: { min: 1_000, max: 2_000 },
  Élite: { min: 2_000, max: 3_000 },
}

/** Reputation tiers, keyed by the floor value of each band. */
export const RANK_TIERS = [
  { name: 'Rango I — Iniciado', floor: 0 },
  { name: 'Rango II — Analista de campo', floor: 3_500 },
  { name: 'Rango III — Archivista', floor: 9_940 },
  { name: 'Rango IV — Guardián', floor: 16_500 },
  { name: 'Rango V — Laureado', floor: 24_000 },
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
