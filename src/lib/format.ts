/** Join class names, dropping anything falsy. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

/**
 * Compact currency for stat tiles and dense tables.
 * `compactCurrency(284500, 'SC')` -> `"284.5K SC"`
 */
export function compactCurrency(amount: number, code: string): string {
  return `${compactNumber(amount)} ${code}`
}

/** `compactNumber(1284)` -> `"1,284"`, `compactNumber(12900)` -> `"12.9K"` */
export function compactNumber(value: number, maximumFractionDigits = 1): string {
  const abs = Math.abs(value)

  if (abs < 10_000) {
    return value.toLocaleString('en-US', { maximumFractionDigits: 0 })
  }

  const units: Array<[number, string]> = [
    [1_000_000_000, 'B'],
    [1_000_000, 'M'],
    [1_000, 'K'],
  ]

  for (const [size, suffix] of units) {
    if (abs >= size) {
      const scaled = value / size
      const digits = Math.abs(scaled) < 100 ? maximumFractionDigits : 0
      return `${scaled.toFixed(digits).replace(/\.0$/, '')}${suffix}`
    }
  }

  return String(value)
}

/** Rating-style numbers keep one decimal: `4` -> `"4.0"` */
export function oneDecimal(value: number): string {
  return value.toFixed(1)
}

/** Percentage with an explicit sign, for deltas: `12.4` -> `"+12.4%"` */
export function signedPercent(value: number): string {
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${sign}${Math.abs(value).toFixed(1)}%`
}

/** Multiplier for match scores and conversion ratios: `0.864` -> `"86.4%"` */
export function percent(ratio: number, digits = 0): string {
  return `${(ratio * 100).toFixed(digits)}%`
}

const DATE_FMT = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
const DATE_YEAR_FMT = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

export function formatDate(iso: string, withYear = false): string {
  const date = new Date(iso)
  return (withYear ? DATE_YEAR_FMT : DATE_FMT).format(date)
}

const UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ['year', 365 * 24 * 60 * 60 * 1000],
  ['month', 30 * 24 * 60 * 60 * 1000],
  ['week', 7 * 24 * 60 * 60 * 1000],
  ['day', 24 * 60 * 60 * 1000],
  ['hour', 60 * 60 * 1000],
  ['minute', 60 * 1000],
]

const RELATIVE_FMT = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' })

/** `"3 days ago"` / `"in 2 weeks"`, relative to `now`. */
export function relativeTime(iso: string, now: Date = new Date()): string {
  const delta = new Date(iso).getTime() - now.getTime()

  for (const [unit, size] of UNITS) {
    if (Math.abs(delta) >= size) {
      return RELATIVE_FMT.format(Math.round(delta / size), unit)
    }
  }

  return 'just now'
}

/** Days remaining, floored at zero: used for bounty deadlines. */
export function daysUntil(iso: string, now: Date = new Date()): number {
  const ms = new Date(iso).getTime() - now.getTime()
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)))
}

/** Truncate a hash for display, keeping both ends legible. */
export function shortHash(hash: string, lead = 6, tail = 4): string {
  if (hash.length <= lead + tail + 1) return hash
  return `${hash.slice(0, lead)}…${hash.slice(-tail)}`
}
