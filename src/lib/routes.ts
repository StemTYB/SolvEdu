import type { IconName } from '@/components/ui/Icon'

export const ROUTES = [
  'dashboard',
  'programs',
  'submissions',
  'submit',
  'leaderboard',
  'profile',
  'wallet',
  'hacktivity',
  'resources',
] as const

export type RouteId = (typeof ROUTES)[number]

export const DEFAULT_ROUTE: RouteId = 'dashboard'

export function isRoute(value: string): value is RouteId {
  return (ROUTES as readonly string[]).includes(value)
}

export interface NavItem {
  id: RouteId
  label: string
  icon: IconName
  /** Count rendered as a trailing pill. */
  badge?: string
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ id: 'dashboard', label: 'Dashboard', icon: 'dashboard' }],
  },
  {
    label: 'Discover',
    items: [
      { id: 'programs', label: 'Programs', icon: 'target' },
      { id: 'hacktivity', label: 'Hacktivity', icon: 'activity' },
      { id: 'leaderboard', label: 'Leaderboard', icon: 'trophy' },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { id: 'submissions', label: 'My Submissions', icon: 'inbox', badge: '12' },
      { id: 'submit', label: 'Submit Report', icon: 'upload' },
    ],
  },
  {
    label: 'Account',
    items: [
      { id: 'wallet', label: 'Earnings', icon: 'wallet' },
      { id: 'profile', label: 'Profile', icon: 'user' },
      { id: 'resources', label: 'Resources', icon: 'book' },
    ],
  },
]

export const ROUTE_TITLES: Record<RouteId, string> = {
  dashboard: 'Dashboard',
  programs: 'Programs & Challenges',
  submissions: 'My Submissions',
  submit: 'Submit Report',
  leaderboard: 'Leaderboard',
  profile: 'Profile',
  wallet: 'Earnings & Wallet',
  hacktivity: 'Hacktivity',
  resources: 'Resources & Guidelines',
}
