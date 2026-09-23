import type { Company, CompanyId } from './types'

export const COMPANIES: Company[] = [
  {
    id: 'stark',
    name: 'Industrias Stark',
    monogram: 'IS',
    division: 'Materiales avanzados y aeroespacial',
    tagline: 'Firmware de repulsores, contención de arco y superficies de control de vuelo.',
    accent: '#e34948',
    escrowFunded: 386_000,
    openPrograms: 38,
    triageSlaHours: 19,
    safeHarborSince: '2021-03-04',
  },
  {
    id: 'wayne',
    name: 'Industrias Wayne',
    monogram: 'IW',
    division: 'Ciencias aplicadas e infraestructura civil',
    tagline: 'Resiliencia de la red municipal, criptografía aplicada y herramientas forenses.',
    accent: '#6366f1',
    escrowFunded: 492_000,
    openPrograms: 44,
    triageSlaHours: 26,
    safeHarborSince: '2020-11-19',
  },
  {
    id: 'umbrella',
    name: 'Corporación Umbrella',
    monogram: 'CU',
    division: 'Biotecnología y contención',
    tagline:
      'Telemetría de cadena de frío, enclavamientos de contención y canalizaciones bioinformáticas.',
    accent: '#16a34a',
    escrowFunded: 262_000,
    openPrograms: 21,
    triageSlaHours: 41,
    safeHarborSince: '2022-06-30',
  },
  {
    id: 'aperture',
    name: 'Aperture Science',
    monogram: 'AS',
    division: 'Robótica e investigación física',
    tagline: 'Cinemática de portales, bancos de prueba autónomos y planos de control de instalaciones.',
    accent: '#f59e0b',
    escrowFunded: 224_000,
    openPrograms: 17,
    triageSlaHours: 12,
    safeHarborSince: '2021-08-12',
  },
  {
    id: 'oscorp',
    name: 'Oscorp',
    monogram: 'OS',
    division: 'Genética y sistemas energéticos',
    tagline:
      'Biocompiladores, celdas de almacenamiento de alta densidad y modelado interespecie.',
    accent: '#06b6d4',
    escrowFunded: 314_000,
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
