import type { IconName } from '@/components/ui/Icon'

/*
 * Route ids stay in English on purpose: they are the URL fragments the hash
 * router reads, so translating them would break every existing deep link.
 * Everything a reader sees — labels and titles — is Spanish.
 */
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
    label: 'Resumen',
    items: [{ id: 'dashboard', label: 'Panel', icon: 'dashboard' }],
  },
  {
    label: 'Explorar',
    items: [
      { id: 'programs', label: 'Programas', icon: 'target' },
      { id: 'hacktivity', label: 'Hacktividad', icon: 'activity' },
      { id: 'leaderboard', label: 'Clasificación', icon: 'trophy' },
    ],
  },
  {
    label: 'Espacio de trabajo',
    items: [
      { id: 'submissions', label: 'Mis reportes', icon: 'inbox', badge: '12' },
      { id: 'submit', label: 'Enviar reporte', icon: 'upload' },
    ],
  },
  {
    label: 'Cuenta',
    items: [
      { id: 'wallet', label: 'Ganancias', icon: 'wallet' },
      { id: 'profile', label: 'Perfil', icon: 'user' },
      { id: 'resources', label: 'Recursos', icon: 'book' },
    ],
  },
]

export const ROUTE_TITLES: Record<RouteId, string> = {
  dashboard: 'Panel',
  programs: 'Programas y retos',
  submissions: 'Mis reportes',
  submit: 'Enviar reporte',
  leaderboard: 'Clasificación',
  profile: 'Perfil',
  wallet: 'Ganancias y cartera',
  hacktivity: 'Hacktividad',
  resources: 'Recursos y directrices',
}
