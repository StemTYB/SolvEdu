import type { ResourceDoc } from './types'

export const RESOURCES: ResourceDoc[] = [
  {
    id: 'RES-01',
    title: 'Safe Harbor policy v4.2',
    category: 'Policy',
    summary:
      'The platform-wide commitment: what companies agree not to pursue, what falls outside protection, and how a scope dispute is escalated.',
    updatedAt: '2026-09-05',
    readMinutes: 9,
    pinned: true,
  },
  {
    id: 'RES-02',
    title: 'Rules of engagement for physical-access programmes',
    category: 'Policy',
    summary:
      'Supervised-only testing, bench-unit handling, chain of custody, and the hard prohibition on testing live infrastructure of any kind.',
    updatedAt: '2026-08-30',
    readMinutes: 12,
    pinned: true,
  },
  {
    id: 'RES-03',
    title: 'Writing a report a triager can reproduce in one pass',
    category: 'Guideline',
    summary:
      'Environment, precondition, minimal steps, observed versus expected. The four sections that decide whether your report is triaged or bounced.',
    updatedAt: '2026-08-14',
    readMinutes: 7,
    pinned: true,
  },
  {
    id: 'RES-04',
    title: 'Severity rubric and CVSS mapping',
    category: 'Reference',
    summary:
      'How each company maps CVSS to its internal severity bands, and why the same finding can settle at different tiers across programmes.',
    updatedAt: '2026-09-11',
    readMinutes: 6,
    pinned: false,
  },
  {
    id: 'RES-05',
    title: 'Proof-of-concept standards',
    category: 'Guideline',
    summary:
      'What counts as sufficient evidence: bounded scripts, sanitised captures, and the redaction rules for anything containing personal data.',
    updatedAt: '2026-07-28',
    readMinutes: 8,
    pinned: false,
  },
  {
    id: 'RES-06',
    title: 'Duplicates, collisions and credit splitting',
    category: 'Policy',
    summary:
      'How the platform resolves two reports of the same defect, when partial credit is awarded, and how to appeal a duplicate decision.',
    updatedAt: '2026-06-19',
    readMinutes: 5,
    pinned: false,
  },
  {
    id: 'RES-07',
    title: 'Escrow, settlement and the reward calendar',
    category: 'Policy',
    summary:
      'Why awards sit in escrow, per-company release windows, tax documentation for fellowship income, and withdrawal thresholds.',
    updatedAt: '2026-08-06',
    readMinutes: 11,
    pinned: false,
  },
  {
    id: 'RES-08',
    title: 'Reputation, tiers and how rank is computed',
    category: 'Reference',
    summary:
      'The weighting between severity, scope difficulty and accuracy — and the decay that keeps the leaderboard honest over time.',
    updatedAt: '2026-09-01',
    readMinutes: 7,
    pinned: false,
  },
  {
    id: 'RES-09',
    title: 'Hardware and firmware testing checklist',
    category: 'Playbook',
    summary:
      'Bench setup, power isolation, thermal limits, and the logging you must capture before you touch a provided unit.',
    updatedAt: '2026-08-22',
    readMinutes: 14,
    pinned: false,
  },
  {
    id: 'RES-10',
    title: 'Arcane Systems: an outsider’s primer',
    category: 'Playbook',
    summary:
      'Mapped analogues for runic ritual pipelines, why a ward is a state machine, and the common failure modes worth testing first.',
    updatedAt: '2026-07-15',
    readMinutes: 16,
    pinned: false,
  },
  {
    id: 'RES-11',
    title: 'Disclosure timelines and coordinated release',
    category: 'Policy',
    summary:
      '90 days as the default, the extensions a company may request, and what happens when a vendor misses the deadline.',
    updatedAt: '2026-05-30',
    readMinutes: 6,
    pinned: false,
  },
  {
    id: 'RES-12',
    title: 'Academic integrity and coursework overlap',
    category: 'Guideline',
    summary:
      'How to declare a bounty that overlaps your coursework, and the line between a class project and a billable engagement.',
    updatedAt: '2026-06-27',
    readMinutes: 5,
    pinned: false,
  },
]
