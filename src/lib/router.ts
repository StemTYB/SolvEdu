import { useCallback, useEffect, useState } from 'react'

import { DEFAULT_ROUTE, isRoute, type RouteId } from '@/lib/routes'

function readHash(): RouteId {
  const raw = window.location.hash.replace(/^#\/?/, '').split('?')[0]
  return isRoute(raw) ? raw : DEFAULT_ROUTE
}

/**
 * Hash routing, so every view is deep-linkable without pulling in a router
 * dependency. The hash is the single source of truth — state is derived from
 * the URL rather than kept alongside it.
 */
export function useRoute(): [RouteId, (route: RouteId) => void] {
  const [route, setRoute] = useState<RouteId>(() =>
    typeof window === 'undefined' ? DEFAULT_ROUTE : readHash(),
  )

  useEffect(() => {
    const onHashChange = () => setRoute(readHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = useCallback((next: RouteId) => {
    if (readHash() === next) {
      setRoute(next)
      return
    }
    window.location.hash = `/${next}`
  }, [])

  return [route, navigate]
}

/** Persisted light/dark preference, applied to <html> as a class. */
export function useTheme(): ['dark' | 'light', () => void] {
  const [theme, setTheme] = useState<'dark' | 'light'>(() =>
    typeof document === 'undefined' || document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light',
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem('solv-edu:theme', theme)
    } catch {
      /* Storage is unavailable in some private modes; the class still applies. */
    }
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  return [theme, toggle]
}
