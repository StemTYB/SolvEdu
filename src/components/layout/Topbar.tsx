import { useEffect, useState } from 'react'

import { Icon, type IconName } from '@/components/ui/Icon'
import { IconButton } from '@/components/ui/Button'
import { Monogram, initialsOf } from '@/components/ui/Monogram'
import { NOTIFICATIONS } from '@/data/notifications'
import { CURRENT_USER } from '@/data/user'
import { university } from '@/data/universities'
import { cn, relativeTime } from '@/lib/format'
import type { NotificationKind } from '@/data/types'
import { ROUTE_TITLES, type RouteId } from '@/lib/routes'

const NOTIFICATION_ICON: Record<NotificationKind, IconName> = {
  pago: 'coins',
  triaje: 'eye',
  programa: 'target',
  rango: 'trophy',
  duplicado: 'copy',
  sistema: 'info',
}

interface TopbarProps {
  route: RouteId
  onNavigate: (route: RouteId) => void
  onOpenNav: () => void
  query: string
  onQueryChange: (value: string) => void
  theme: 'dark' | 'light'
  onToggleTheme: () => void
}

export function Topbar({
  route,
  onNavigate,
  onOpenNav,
  query,
  onQueryChange,
  theme,
  onToggleTheme,
}: TopbarProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [readIds, setReadIds] = useState<Set<string>>(
    () => new Set(NOTIFICATIONS.filter((item) => item.read).map((item) => item.id)),
  )

  const unread = NOTIFICATIONS.filter((item) => !readIds.has(item.id)).length
  const school = university(CURRENT_USER.universityId)

  useEffect(() => {
    if (!notificationsOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setNotificationsOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [notificationsOpen])

  const openNotifications = () => {
    setNotificationsOpen((open) => !open)
    setReadIds(new Set(NOTIFICATIONS.map((item) => item.id)))
  }

  return (
    <header className="sticky top-0 z-30 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="glass flex h-15 items-center gap-2 rounded-2xl px-3 sm:gap-3">
        <button
          type="button"
          onClick={onOpenNav}
          aria-label="Abrir navegación"
          className="grid size-9 shrink-0 place-items-center rounded-xl text-ink-muted hover:bg-glass-soft hover:text-ink lg:hidden"
        >
          <Icon name="menu" size={19} />
        </button>

        {/* Breadcrumb — the sidebar is hidden on mobile, so the route is named here. */}
        <p className="hidden shrink-0 text-[13px] font-semibold text-ink xl:block">
          {ROUTE_TITLES[route]}
        </p>

        <label className="group relative flex min-w-0 flex-1 items-center">
          <span className="sr-only">Busca programas, empresas e investigadores</span>
          <Icon
            name="search"
            size={17}
            className="pointer-events-none absolute left-3 text-ink-faint"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            onFocus={() => onNavigate('programs')}
            placeholder="Busca programas, empresas, stacks…"
            className={cn(
              'h-9 w-full rounded-xl border border-hairline-soft bg-glass-soft pr-3 pl-9 text-[13px] text-ink',
              'placeholder:text-ink-faint focus:border-[var(--solv-brand)] focus:bg-glass focus:outline-none',
              'transition duration-150 [&::-webkit-search-cancel-button]:hidden',
            )}
          />
        </label>

        <div className="flex shrink-0 items-center gap-0.5">
          <IconButton
            icon={theme === 'dark' ? 'sun' : 'moon'}
            label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
            onClick={onToggleTheme}
          />

          <div className="relative">
            <IconButton
              icon="bell"
              label={unread ? `Notificaciones, ${unread} sin leer` : 'Notificaciones'}
              active={notificationsOpen}
              onClick={openNotifications}
            />
            {unread > 0 && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1.5 right-1.5 grid size-4 place-items-center rounded-full bg-[var(--status-critical)] text-[9.5px] font-bold text-white ring-2 ring-[var(--solv-canvas)]"
              >
                {unread}
              </span>
            )}

            {notificationsOpen && (
              <>
                <button
                  type="button"
                  tabIndex={-1}
                  aria-hidden="true"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setNotificationsOpen(false)}
                />
                <div className="glass absolute right-0 z-50 mt-2 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl">
                  <div className="flex items-center justify-between border-b border-hairline-soft px-4 py-3">
                    <h2 className="text-[13px] font-semibold text-ink">Notificaciones</h2>
                    <span className="text-[11.5px] text-ink-faint">
                      {NOTIFICATIONS.length} recientes
                    </span>
                  </div>
                  <ul className="max-h-[22rem] overflow-y-auto">
                    {NOTIFICATIONS.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => {
                            onNavigate(item.href.replace(/^\//, '') as RouteId)
                            setNotificationsOpen(false)
                          }}
                          className="flex w-full gap-3 border-b border-hairline-soft px-4 py-3 text-left transition hover:bg-glass-soft"
                        >
                          <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-brand-wash text-brand-ink">
                            <Icon name={NOTIFICATION_ICON[item.kind]} size={15} />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[12.5px] leading-snug font-semibold text-ink">
                              {item.title}
                            </span>
                            <span className="mt-1 block text-[11.5px] leading-snug text-ink-muted">
                              {item.body}
                            </span>
                            <span className="mt-1.5 block text-[11px] text-ink-faint">
                              {relativeTime(item.at)}
                            </span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className="ml-1 flex items-center gap-2.5 rounded-xl py-1 pr-3 pl-1 transition hover:bg-glass-soft"
          >
            <Monogram
              text={initialsOf(CURRENT_USER.displayName)}
              accent={school.accent}
              size="sm"
            />
            <span className="hidden min-w-0 text-left sm:block">
              <span className="block truncate text-[12.5px] leading-tight font-semibold text-ink">
                {CURRENT_USER.displayName}
              </span>
              <span className="block truncate text-[11px] text-ink-faint">{school.name}</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
