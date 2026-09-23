import { useState } from 'react'

import { AppShell } from '@/components/layout/AppShell'
import { useRoute } from '@/lib/router'
import { DashboardView } from '@/views/DashboardView'
import { HacktivityView } from '@/views/HacktivityView'
import { LeaderboardView } from '@/views/LeaderboardView'
import { ProfileView } from '@/views/ProfileView'
import { ProgramsView } from '@/views/ProgramsView'
import { ResourcesView } from '@/views/ResourcesView'
import { SubmitReportView } from '@/views/SubmitReportView'
import { SubmissionsView } from '@/views/SubmissionsView'
import { WalletView } from '@/views/WalletView'

/**
 * The application root. Routing lives in the URL hash, the search term lives
 * here so the topbar and the programs directory stay in step, and everything
 * else is owned by the view that needs it.
 */
export function App() {
  const [route, navigate] = useRoute()
  const [query, setQuery] = useState('')

  return (
    <AppShell route={route} onNavigate={navigate} query={query} onQueryChange={setQuery}>
      {route === 'dashboard' && <DashboardView onNavigate={navigate} />}
      {route === 'programs' && <ProgramsView query={query} onQueryChange={setQuery} />}
      {route === 'submissions' && <SubmissionsView />}
      {route === 'submit' && <SubmitReportView />}
      {route === 'leaderboard' && <LeaderboardView />}
      {route === 'profile' && <ProfileView />}
      {route === 'wallet' && <WalletView />}
      {route === 'hacktivity' && <HacktivityView />}
      {route === 'resources' && <ResourcesView />}
    </AppShell>
  )
}
