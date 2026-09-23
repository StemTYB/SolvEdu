import type { Company, CompanyId } from './types'

export const COMPANIES: Company[] = [
  {
    id: 'stark',
    name: 'Stark Industries',
    monogram: 'SI',
    division: 'Advanced Materials & Aerospace',
    tagline: 'Repulsor firmware, arc containment and flight-control surfaces.',
    accent: '#e34948',
    currency: { code: 'SC', name: 'Stark Credits', glyph: '⌁' },
    escrowFunded: 4_820_000,
    openPrograms: 38,
    triageSlaHours: 19,
    safeHarborSince: '2021-03-04',
  },
  {
    id: 'wayne',
    name: 'Wayne Enterprises',
    monogram: 'WE',
    division: 'Applied Sciences & Civil Infrastructure',
    tagline: 'Municipal grid resilience, applied cryptography and forensic tooling.',
    accent: '#6366f1',
    currency: { code: 'WCG', name: 'WayneCorp Grants', glyph: '◈' },
    escrowFunded: 6_140_000,
    openPrograms: 44,
    triageSlaHours: 26,
    safeHarborSince: '2020-11-19',
  },
  {
    id: 'umbrella',
    name: 'Umbrella Corporation',
    monogram: 'UC',
    division: 'Biotech & Containment',
    tagline: 'Cold-chain telemetry, containment interlocks and bioinformatics pipelines.',
    accent: '#16a34a',
    currency: { code: 'UBR', name: 'Umbrella Bio-Rewards', glyph: '❖' },
    escrowFunded: 3_260_000,
    openPrograms: 21,
    triageSlaHours: 41,
    safeHarborSince: '2022-06-30',
  },
  {
    id: 'aperture',
    name: 'Aperture Science',
    monogram: 'AS',
    division: 'Robotics & Physics Research',
    tagline: 'Portal kinematics, autonomous test rigs and facility control planes.',
    accent: '#f59e0b',
    currency: { code: 'ARS', name: 'Aperture Research Stipends', glyph: '⊕' },
    escrowFunded: 2_780_000,
    openPrograms: 17,
    triageSlaHours: 12,
    safeHarborSince: '2021-08-12',
  },
  {
    id: 'oscorp',
    name: 'Oscorp',
    monogram: 'OS',
    division: 'Genetics & Energy Systems',
    tagline: 'Bio-compilers, high-density storage cells and cross-species modelling.',
    accent: '#06b6d4',
    currency: { code: 'OSF', name: 'Oscorp Fellowships', glyph: '✦' },
    escrowFunded: 3_910_000,
    openPrograms: 29,
    triageSlaHours: 33,
    safeHarborSince: '2022-01-24',
  },
]

export const COMPANY_BY_ID: Record<CompanyId, Company> = Object.fromEntries(
  COMPANIES.map((company) => [company.id, company]),
) as Record<CompanyId, Company>

/** Lookup that fails loudly — placeholder data should never silently render blank. */
export function company(id: CompanyId): Company {
  return COMPANY_BY_ID[id]
}
