import type { University, UniversityId } from './types'

export const UNIVERSITIES: University[] = [
  {
    id: 'monsters',
    name: 'Monsters University',
    monogram: 'MU',
    motto: 'Scariness is a science',
    accent: '#7c3aed',
    strengths: ['Energy Grid', 'Materials', 'Robotics'],
    solvers: 1_284,
  },
  {
    id: 'hogwarts',
    name: 'Hogwarts School of Witchcraft & Wizardry',
    monogram: 'HW',
    motto: 'Draco dormiens nunquam titillandus',
    accent: '#ca8a04',
    strengths: ['Arcane Systems', 'Cryptography', 'Materials'],
    solvers: 892,
  },
  {
    id: 'xavier',
    name: 'Xavier Institute for Higher Learning',
    monogram: 'XI',
    motto: 'Mutatis mutandis',
    accent: '#0ea5e9',
    strengths: ['AI & Autonomy', 'Biotech', 'Cryptography'],
    solvers: 1_047,
  },
  {
    id: 'miskatonic',
    name: 'Miskatonic University',
    monogram: 'MK',
    motto: 'Ex umbris in veritatem',
    accent: '#0f766e',
    strengths: ['Arcane Systems', 'Cryptography', 'Biotech'],
    solvers: 463,
  },
  {
    id: 'gotham',
    name: 'Gotham University',
    monogram: 'GU',
    motto: 'Civitas super omnia',
    accent: '#64748b',
    strengths: ['Aerospace', 'Robotics', 'Energy Grid'],
    solvers: 1_612,
  },
]

export const UNIVERSITY_BY_ID: Record<UniversityId, University> = Object.fromEntries(
  UNIVERSITIES.map((university) => [university.id, university]),
) as Record<UniversityId, University>

export function university(id: UniversityId): University {
  return UNIVERSITY_BY_ID[id]
}
