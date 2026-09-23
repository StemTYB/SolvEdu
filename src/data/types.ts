export type CompanyId = 'stark' | 'wayne' | 'umbrella' | 'aperture' | 'oscorp'

export type UniversityId = 'monsters' | 'hogwarts' | 'xavier' | 'miskatonic' | 'gotham'

export type Severity = 'Informational' | 'Low' | 'Medium' | 'High' | 'Critical'

/** Workflow state of a report — an ordered pipeline, not a severity. */
export type SubmissionState = 'Pending' | 'Triaged' | 'Accepted' | 'Duplicated' | 'Paid'

export type Scope = 'Web Surface' | 'Firmware' | 'Protocol' | 'Physical Access' | 'Pure Research'

export type Difficulty = 'Intro' | 'Intermediate' | 'Advanced' | 'Elite'

export type Category =
  | 'Cryptography'
  | 'Robotics'
  | 'Biotech'
  | 'Aerospace'
  | 'AI & Autonomy'
  | 'Energy Grid'
  | 'Arcane Systems'
  | 'Materials'

/**
 * A settlement unit. `SC` is the platform ledger unit; every company currency
 * escrows and settles 1:1 against it, so cross-company totals are additive.
 */
export interface Currency {
  code: string
  name: string
  glyph: string
}

export interface Company {
  id: CompanyId
  name: string
  monogram: string
  division: string
  tagline: string
  /** Identity mark colour. Always accompanied by the name — never meaning alone. */
  accent: string
  currency: Currency
  escrowFunded: number
  openPrograms: number
  /** Median hours from submission to first human triage. */
  triageSlaHours: number
  safeHarborSince: string
}

export interface University {
  id: UniversityId
  name: string
  monogram: string
  motto: string
  accent: string
  /** Disciplines the university's students most often solve for. */
  strengths: Category[]
  solvers: number
}

export interface Program {
  id: string
  companyId: CompanyId
  title: string
  summary: string
  category: Category
  stack: string[]
  bountyMin: number
  bountyMax: number
  scope: Scope
  difficulty: Difficulty
  deadline: string
  postedAt: string
  /** Open seats on the program roster this term. */
  slots: number
  submissions: number
  safeHarbor: boolean
  /** 0–1 personal fit score driving the "Recommended" rail. */
  match: number
  tags: string[]
}

export interface Submission {
  id: string
  programId: string
  companyId: CompanyId
  title: string
  severity: Severity
  state: SubmissionState
  cvss: number
  submittedAt: string
  updatedAt: string
  payout: number
  currencyCode: string
  hash: string
  note?: string
}

export interface LeaderboardEntry {
  rank: number
  handle: string
  displayName: string
  universityId: UniversityId
  reputation: number
  /** Lifetime settled rewards, normalised to the ledger unit. */
  earned: number
  validReports: number
  /** Valid ÷ (valid + invalid + duplicate). */
  accuracy: number
  /** Rank movement over 30 days; positive means climbing. */
  trend: number
  badges: string[]
  isCurrentUser?: boolean
}

export type NotificationKind = 'payout' | 'triage' | 'program' | 'rank' | 'duplicate' | 'system'

export interface AppNotification {
  id: string
  kind: NotificationKind
  title: string
  body: string
  at: string
  read: boolean
  href: string
  companyId?: CompanyId
}

export interface MonthlyEarnings {
  /** `YYYY-MM`, so the series stays sortable regardless of display format. */
  period: string
  label: string
  amount: number
  payouts: number
}

export interface WalletAccount {
  companyId: CompanyId
  currency: Currency
  /** Awarded, awaiting the escrow release window. */
  pending: number
  /** Cleared and withdrawable. */
  available: number
  lifetime: number
  /** Median days from acceptance to settlement. */
  settleDays: number
}

export type PayoutState = 'Processing' | 'Cleared' | 'Held' | 'Scheduled'

export interface Payout {
  id: string
  companyId: CompanyId
  submissionId: string
  title: string
  amount: number
  currencyCode: string
  state: PayoutState
  requestedAt: string
  settlesAt: string
}

export interface HacktivityEvent {
  id: string
  at: string
  handle: string
  universityId: UniversityId
  companyId: CompanyId
  programTitle: string
  severity: Severity
  state: Extract<SubmissionState, 'Triaged' | 'Accepted' | 'Paid'>
  payout: number
  currencyCode: string
  summary: string
  upvotes: number
  disclosed: boolean
}

export interface Badge {
  id: string
  name: string
  description: string
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
  glyph: string
  earnedAt?: string
  /** Progress toward earning, 0–1. Absent once earned. */
  progress?: number
}

export interface CurrentUser {
  handle: string
  displayName: string
  universityId: UniversityId
  degree: string
  year: string
  reputation: number
  rank: number
  rankPool: number
  validReports: number
  invalidReports: number
  duplicates: number
  /** Consecutive weeks with at least one accepted report. */
  streakWeeks: number
  joinedAt: string
  badges: Badge[]
  /** Reputation required for the next rank tier. */
  nextTierAt: number
  nextTierName: string
}

/** A single point in a sparkline series — label for the axis, value for the line. */
export interface TrendPoint {
  label: string
  value: number
}

export interface ResourceDoc {
  id: string
  title: string
  category: 'Policy' | 'Guideline' | 'Playbook' | 'Reference'
  summary: string
  updatedAt: string
  readMinutes: number
  pinned: boolean
}
