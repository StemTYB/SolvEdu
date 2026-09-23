import type { University, UniversityId } from './types'

export const UNIVERSITIES: University[] = [
  {
    id: 'monsters',
    name: 'Universidad Monsters',
    monogram: 'UM',
    motto: 'Asustar es una ciencia',
    accent: '#7c3aed',
    strengths: ['Red eléctrica', 'Materiales', 'Robótica'],
    solvers: 1_284,
  },
  {
    id: 'hogwarts',
    name: 'Colegio Hogwarts de Magia y Hechicería',
    monogram: 'CH',
    motto: 'Draco dormiens nunquam titillandus',
    accent: '#ca8a04',
    strengths: ['Sistemas arcanos', 'Criptografía', 'Materiales'],
    solvers: 892,
  },
  {
    id: 'xavier',
    name: 'Instituto Xavier para Estudios Superiores',
    monogram: 'IX',
    motto: 'Mutatis mutandis',
    accent: '#0ea5e9',
    strengths: ['IA y autonomía', 'Biotecnología', 'Criptografía'],
    solvers: 1_047,
  },
  {
    id: 'miskatonic',
    name: 'Universidad Miskatonic',
    monogram: 'MI',
    motto: 'Ex umbris in veritatem',
    accent: '#0f766e',
    strengths: ['Sistemas arcanos', 'Criptografía', 'Biotecnología'],
    solvers: 463,
  },
  {
    id: 'gotham',
    name: 'Universidad de Gotham',
    monogram: 'UG',
    motto: 'Civitas super omnia',
    accent: '#64748b',
    strengths: ['Aeroespacial', 'Robótica', 'Red eléctrica'],
    solvers: 1_612,
  },
]

export const UNIVERSITY_BY_ID: Record<UniversityId, University> = Object.fromEntries(
  UNIVERSITIES.map((university) => [university.id, university]),
) as Record<UniversityId, University>

export function university(id: UniversityId): University {
  return UNIVERSITY_BY_ID[id]
}
