import { Icon } from '@/components/ui/Icon'
import { Meter } from '@/components/ui/Meter'
import { CURRENT_USER } from '@/data/user'
import { cn } from '@/lib/format'
import { tierFor } from '@/lib/presentation'
import { NAV_GROUPS, type RouteId } from '@/lib/routes'

interface SidebarProps {
  route: RouteId
  onNavigate: (route: RouteId) => void
  open: boolean
  onClose: () => void
}

function BrandMark() {
  return (
    <div className="flex min-w-0 items-center gap-3 px-2">
      <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-[var(--solv-brand)] to-[var(--solv-accent)] shadow-[0_10px_26px_-10px_var(--solv-brand)]">
        <Icon name="target" size={21} className="text-on-brand" />
      </span>
      <span className="min-w-0">
        <span className="block text-[16px] leading-none font-bold tracking-tight text-ink">
          SolvEDU
        </span>
        <span className="mt-1 block truncate text-[11px] text-ink-faint">
          Bounty platform for student researchers
        </span>
      </span>
    </div>
  )
}

function NavList({ route, onNavigate }: Pick<SidebarProps, 'route' | 'onNavigate'>) {
  return (
    <nav className="flex-1 space-y-6 overflow-y-auto px-2 py-4" aria-label="Primary">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="px-3 pb-2 text-[10.5px] font-semibold tracking-[0.15em] text-ink-faint uppercase">
            {group.label}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = item.id === route
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13.5px] font-medium transition duration-150',
                      active
                        ? 'bg-glass-strong text-ink shadow-[inset_0_1px_0_0_var(--solv-glow)]'
                        : 'text-ink-muted hover:bg-glass-soft hover:text-ink',
                    )}
                  >
                    <Icon
                      name={item.icon}
                      size={18}
                      className={active ? 'text-brand-ink' : 'text-ink-faint group-hover:text-ink-muted'}
                    />
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          'ml-auto rounded-full px-1.5 py-0.5 text-[10.5px] font-semibold tabular-nums',
                          active ? 'bg-brand-wash text-brand-ink' : 'bg-glass-soft text-ink-faint',
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function TierCard() {
  const tier = tierFor(CURRENT_USER.reputation)

  return (
    <div className="mx-2 mb-2 rounded-2xl border border-hairline-soft bg-glass-soft p-3.5">
      <div className="flex items-center gap-2">
        <Icon name="shield" size={15} className="text-brand-ink" />
        <span className="truncate text-[12px] font-semibold text-ink">{tier.current}</span>
      </div>
      <Meter value={tier.progress} className="mt-3" />
      <p className="mt-2 text-[11px] leading-snug text-ink-faint">
        {tier.next
          ? `${(CURRENT_USER.nextTierAt - CURRENT_USER.reputation).toLocaleString('en-US')} reputation to ${tier.next}`
          : 'Highest tier reached'}
      </p>
    </div>
  )
}

/**
 * The persistent rail on desktop and the slide-in drawer on mobile. Both share
 * one content tree so the navigation can never drift between the two.
 */
export function Sidebar({ route, onNavigate, open, onClose }: SidebarProps) {
  const go = (next: RouteId) => {
    onNavigate(next)
    onClose()
  }

  return (
    <>
      {/* Desktop rail */}
      <aside className="sticky top-0 hidden h-dvh w-[268px] shrink-0 flex-col border-r border-hairline-soft py-5 lg:flex">
        <BrandMark />
        <NavList route={route} onNavigate={onNavigate} />
        <TierCard />
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden',
          open ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        aria-hidden={!open}
      >
        <button
          type="button"
          tabIndex={open ? 0 : -1}
          aria-label="Close navigation"
          onClick={onClose}
          className={cn(
            'absolute inset-0 bg-black/45 backdrop-blur-sm transition-opacity duration-250',
            open ? 'opacity-100' : 'opacity-0',
          )}
        />
        <aside
          className={cn(
            'glass absolute inset-y-0 left-0 flex w-[286px] flex-col py-5 transition-transform duration-300 ease-out',
            open ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex items-center justify-between pr-3">
            <BrandMark />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation"
              className="grid size-9 shrink-0 place-items-center rounded-xl text-ink-muted hover:bg-glass-soft hover:text-ink"
            >
              <Icon name="close" size={18} />
            </button>
          </div>
          <NavList route={route} onNavigate={go} />
          <TierCard />
        </aside>
      </div>
    </>
  )
}
