import { useState, type ReactNode } from 'react'

import { GlassBackground } from '@/components/layout/GlassBackground'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { useTheme } from '@/lib/router'
import type { RouteId } from '@/lib/routes'

interface AppShellProps {
  route: RouteId
  onNavigate: (route: RouteId) => void
  query: string
  onQueryChange: (value: string) => void
  children: ReactNode
}

/**
 * The persistent frame: a fixed blurred backdrop, a navigation rail, a floating
 * toolbar, and the scrolling content column.
 */
export function AppShell({ route, onNavigate, query, onQueryChange, children }: AppShellProps) {
  const [navOpen, setNavOpen] = useState(false)
  const [theme, toggleTheme] = useTheme()

  return (
    <>
      <GlassBackground />

      <div className="flex min-h-dvh">
        <Sidebar
          route={route}
          onNavigate={onNavigate}
          open={navOpen}
          onClose={() => setNavOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar
            route={route}
            onNavigate={onNavigate}
            onOpenNav={() => setNavOpen(true)}
            query={query}
            onQueryChange={onQueryChange}
            theme={theme}
            onToggleTheme={toggleTheme}
          />

          {/* `key` restarts the entrance animation on every route change. */}
          <main key={route} className="animate-rise flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto w-full max-w-[1440px] space-y-6">{children}</div>
          </main>

          <footer className="px-4 pb-8 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center gap-x-4 gap-y-2 text-[11.5px] text-ink-faint">
              <span>SolvEDU — plataforma ficticia con fines de demostración.</span>
              <span className="hidden sm:inline">Política de Puerto seguro v4.2 en vigor.</span>
              <span className="ml-auto">
                Todas las empresas, universidades y recompensas son inventadas.
              </span>
            </div>
          </footer>
        </div>
      </div>
    </>
  )
}
