import { useMemo, useState } from 'react'

import { ProgramCard } from '@/components/program/ProgramCard'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Panel } from '@/components/ui/Panel'
import { FilterChip, Segmented } from '@/components/ui/Segmented'
import { ViewHeader } from '@/components/ui/SectionHeading'
import { COMPANIES, company } from '@/data/companies'
import {
  ALL_STACKS,
  MAX_BOUNTY,
  PROGRAMS,
  PROGRAM_CATEGORIES,
  PROGRAM_SCOPES,
} from '@/data/programs'
import { cn, formatUsd } from '@/lib/format'

type SortKey = 'match' | 'bounty' | 'deadline' | 'newest'

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: 'match', label: 'Mejor afinidad' },
  { value: 'bounty', label: 'Mayor recompensa' },
  { value: 'deadline', label: 'Cierre próximo' },
  { value: 'newest', label: 'Más recientes' },
]

/** The slider moves in $100 steps — one notch per dollar band the directory can hit. */
const BOUNTY_STEP = 100

function toggle<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set)
  if (next.has(value)) next.delete(value)
  else next.add(value)
  return next
}

interface ProgramsViewProps {
  query: string
  onQueryChange: (value: string) => void
}

export function ProgramsView({ query, onQueryChange }: ProgramsViewProps) {
  const [companies, setCompanies] = useState<Set<string>>(new Set())
  const [categories, setCategories] = useState<Set<string>>(new Set())
  const [scopes, setScopes] = useState<Set<string>>(new Set())
  const [stacks, setStacks] = useState<Set<string>>(new Set())
  const [minBounty, setMinBounty] = useState(0)
  const [sort, setSort] = useState<SortKey>('match')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const activeCount =
    companies.size + categories.size + scopes.size + stacks.size + (minBounty > 0 ? 1 : 0)

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()

    const filtered = PROGRAMS.filter((program) => {
      if (companies.size && !companies.has(program.companyId)) return false
      if (categories.size && !categories.has(program.category)) return false
      if (scopes.size && !scopes.has(program.scope)) return false
      if (stacks.size && !program.stack.some((entry) => stacks.has(entry))) return false
      if (program.bountyMax < minBounty) return false

      if (needle) {
        const employer = company(program.companyId)
        const haystack = [
          program.title,
          program.summary,
          program.category,
          program.scope,
          employer.name,
          employer.division,
          ...program.stack,
          ...program.tags,
        ]
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(needle)) return false
      }

      return true
    })

    return filtered.sort((a, b) => {
      switch (sort) {
        case 'bounty':
          return b.bountyMax - a.bountyMax
        case 'deadline':
          return +new Date(a.deadline) - +new Date(b.deadline)
        case 'newest':
          return +new Date(b.postedAt) - +new Date(a.postedAt)
        default:
          return b.match - a.match
      }
    })
  }, [companies, categories, scopes, stacks, minBounty, query, sort])

  const clearAll = () => {
    setCompanies(new Set())
    setCategories(new Set())
    setScopes(new Set())
    setStacks(new Set())
    setMinBounty(0)
    onQueryChange('')
  }

  const escrowTotal = results.reduce((sum, program) => sum + program.bountyMax, 0)

  return (
    <>
      <ViewHeader
        title="Programas y retos"
        description="Todos los encargos abiertos de las cinco empresas cliente. El alcance se publica por adelantado y cada programa lleva sus propias condiciones de Puerto seguro."
        action={
          <>
            <Button size="md" icon="refresh" variant="secondary">
              Actualizar
            </Button>
            <Button size="md" variant="primary" icon="sparkles">
              Sugerir para mí
            </Button>
          </>
        }
      />

      {/* ------------------------------------------------------------- Filters */}
      <Panel className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <div className="flex items-center gap-2 text-ink-muted">
            <Icon name="filter" size={16} />
            <span className="text-[12.5px] font-semibold">Filtros</span>
            {activeCount > 0 && (
              <span className="rounded-full bg-brand-wash px-1.5 py-0.5 text-[10.5px] font-semibold text-brand-ink tabular-nums">
                {activeCount}
              </span>
            )}
          </div>

          <Segmented label="Ordenar programas" options={SORT_OPTIONS} value={sort} onChange={setSort} />

          <div className="ml-auto flex items-center gap-2">
            {activeCount > 0 && (
              <Button size="sm" variant="ghost" icon="close" onClick={clearAll}>
                Limpiar
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              icon="chevron-down"
              className={cn('transition', filtersOpen && 'rotate-180')}
              onClick={() => setFiltersOpen((open) => !open)}
            >
              Avanzados
            </Button>
          </div>
        </div>

        {filtersOpen && (
          <div className="mt-5 space-y-5 border-t border-hairline-soft pt-5">
            <fieldset>
              <legend className="mb-2.5 text-[11px] font-semibold tracking-[0.14em] text-ink-faint uppercase">
                Empresa
              </legend>
              <div className="flex flex-wrap gap-2">
                {COMPANIES.map((employer) => (
                  <FilterChip
                    key={employer.id}
                    active={companies.has(employer.id)}
                    onClick={() => setCompanies((set) => toggle(set, employer.id))}
                    keyColor={employer.accent}
                    count={PROGRAMS.filter((program) => program.companyId === employer.id).length}
                  >
                    {employer.name}
                  </FilterChip>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-2.5 text-[11px] font-semibold tracking-[0.14em] text-ink-faint uppercase">
                Categoría
              </legend>
              <div className="flex flex-wrap gap-2">
                {PROGRAM_CATEGORIES.map((category) => (
                  <FilterChip
                    key={category}
                    active={categories.has(category)}
                    onClick={() => setCategories((set) => toggle(set, category))}
                    count={PROGRAMS.filter((program) => program.category === category).length}
                  >
                    {category}
                  </FilterChip>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-5 md:grid-cols-2">
              <fieldset>
                <legend className="mb-2.5 text-[11px] font-semibold tracking-[0.14em] text-ink-faint uppercase">
                  Alcance
                </legend>
                <div className="flex flex-wrap gap-2">
                  {PROGRAM_SCOPES.map((scope) => (
                    <FilterChip
                      key={scope}
                      active={scopes.has(scope)}
                      onClick={() => setScopes((set) => toggle(set, scope))}
                    >
                      {scope}
                    </FilterChip>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-2.5 text-[11px] font-semibold tracking-[0.14em] text-ink-faint uppercase">
                  Techo mínimo de recompensa
                </legend>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={MAX_BOUNTY}
                    step={BOUNTY_STEP}
                    value={minBounty}
                    onChange={(event) => setMinBounty(Number(event.target.value))}
                    aria-label="Techo mínimo de recompensa"
                    className="h-1.5 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-brand-wash accent-[var(--solv-brand)]"
                    style={{
                      background: `linear-gradient(to right, var(--solv-brand) ${(minBounty / MAX_BOUNTY) * 100}%, color-mix(in oklab, var(--solv-brand) 20%, transparent) ${(minBounty / MAX_BOUNTY) * 100}%)`,
                    }}
                  />
                  <span className="w-28 shrink-0 text-right text-[12.5px] font-semibold tabular-nums text-ink">
                    {minBounty === 0 ? 'Cualquiera' : `≥ ${formatUsd(minBounty)}`}
                  </span>
                </div>
              </fieldset>
            </div>

            <fieldset>
              <legend className="mb-2.5 text-[11px] font-semibold tracking-[0.14em] text-ink-faint uppercase">
                Stack tecnológico
              </legend>
              <div className="flex flex-wrap gap-2">
                {ALL_STACKS.map((entry) => (
                  <FilterChip
                    key={entry}
                    active={stacks.has(entry)}
                    onClick={() => setStacks((set) => toggle(set, entry))}
                  >
                    <span className="font-mono text-[11.5px]">{entry}</span>
                  </FilterChip>
                ))}
              </div>
            </fieldset>
          </div>
        )}
      </Panel>

      {/* ------------------------------------------------------------- Results */}
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-[13px] text-ink-muted">
          <span className="font-semibold text-ink tabular-nums">{results.length}</span> de{' '}
          {PROGRAMS.length} programas
          {query.trim() && (
            <>
              {' '}
              que coinciden con <span className="font-medium text-ink">“{query.trim()}”</span>
            </>
          )}
        </p>
        {results.length > 0 && (
          <p className="text-[12px] text-ink-faint">
            Depósito en garantía combinado{' '}
            <span className="font-semibold text-ink-muted tabular-nums">
              {formatUsd(escrowTotal)}
            </span>
          </p>
        )}
      </div>

      {results.length === 0 ? (
        <Panel className="grid place-items-center px-6 py-16 text-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-brand-wash text-brand-ink">
            <Icon name="search" size={22} />
          </span>
          <h2 className="mt-4 text-[16px] font-semibold text-ink">
            Ningún programa coincide con esos filtros
          </h2>
          <p className="mt-2 max-w-md text-[13px] text-ink-muted">
            Prueba a ampliar el rango de recompensa o a quitar un filtro de tecnología: la lista de
            stacks exige coincidencia exacta, así que dos selecciones reducen mucho el directorio.
          </p>
          <Button className="mt-5" variant="primary" icon="refresh" onClick={clearAll}>
            Limpiar todos los filtros
          </Button>
        </Panel>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {results.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      )}
    </>
  )
}
