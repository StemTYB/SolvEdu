import { MONTHLY_EARNINGS } from './earnings'
import type { TrendPoint } from './types'

/** Sparkline series behind each dashboard stat tile. All twelve points, oldest first. */
export const EARNINGS_TREND: TrendPoint[] = MONTHLY_EARNINGS.map((month) => ({
  label: month.label,
  value: month.amount,
}))

export const REPUTATION_TREND: TrendPoint[] = [
  1_980, 2_410, 2_680, 3_220, 3_890, 4_310, 5_180, 5_870, 6_520, 7_290, 7_940, 8_420,
].map((value, index) => ({
  label: MONTHLY_EARNINGS[index]?.label ?? '',
  value,
}))

/** Lower is better here — the tile inverts the "up is good" default. */
export const RANK_TREND: TrendPoint[] = [
  41, 38, 34, 31, 27, 24, 21, 17, 14, 12, 10, 7,
].map((value, index) => ({
  label: MONTHLY_EARNINGS[index]?.label ?? '',
  value,
}))

/**
 * Every report filed that month, including the ones still open, so the series
 * runs ahead of the settled counts on the profile.
 */
export const SUBMISSIONS_TREND: TrendPoint[] = [
  3, 4, 2, 5, 6, 4, 7, 3, 8, 9, 7, 4,
].map((value, index) => ({
  label: MONTHLY_EARNINGS[index]?.label ?? '',
  value,
}))

/** Share of submitted reports that reached Aceptado or Pagado, per month. */
export const ACCURACY_TREND: TrendPoint[] = [
  0.62, 0.65, 0.63, 0.69, 0.71, 0.7, 0.74, 0.72, 0.77, 0.79, 0.8, 0.8,
].map((value, index) => ({
  label: MONTHLY_EARNINGS[index]?.label ?? '',
  value,
}))
