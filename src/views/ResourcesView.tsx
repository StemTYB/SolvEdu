import { useMemo, useState } from 'react'

import { Chip } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Icon, type IconName } from '@/components/ui/Icon'
import { Panel, PanelHeader } from '@/components/ui/Panel'
import { Segmented } from '@/components/ui/Segmented'
import { ViewHeader } from '@/components/ui/SectionHeading'
import { RESOURCES } from '@/data/resources'
import type { ResourceDoc } from '@/data/types'
import { cn, formatDate, relativeTime } from '@/lib/format'

type CategoryFilter = 'Todas' | ResourceDoc['category']

/**
 * Document categories are labelled by icon and name only. This view carries no
 * chart, so it introduces no categorical scale — a fourth hue system on one
 * screen would compete with the status palette for no gain.
 */
const CATEGORY_ICON: Record<ResourceDoc['category'], IconName> = {
  Política: 'shield',
  Directriz: 'book',
  'Guía práctica': 'target',
  Referencia: 'info',
}

const CATEGORIES: ResourceDoc['category'][] = [
  'Política',
  'Directriz',
  'Guía práctica',
  'Referencia',
]

const SAFE_HARBOR = [
  {
    title: 'No te perseguiremos',
    body: 'Por el trabajo realizado dentro de un alcance publicado, la empresa renuncia a las reclamaciones civiles y no pondrá el hallazgo en conocimiento de las autoridades.',
  },
  {
    title: 'Haremos el triaje de buena fe',
    body: 'Una persona lee cada reporte. La primera respuesta mediana entre las cinco empresas es de 22 horas.',
  },
  {
    title: 'Pagaremos lo que publicamos',
    body: 'Las bandas de recompensa se fijan antes de que presentes el reporte. Una empresa no puede reducir un pago porque la corrección fuera sencilla.',
  },
  {
    title: 'No tocarás datos reales',
    body: 'Los datos personales quedan fuera de alcance en todas partes. Detente en la primera prueba e informa de inmediato.',
  },
]

export function ResourcesView() {
  const [category, setCategory] = useState<CategoryFilter>('Todas')

  const pinned = useMemo(() => RESOURCES.filter((doc) => doc.pinned), [])
  const docs = useMemo(
    () =>
      category === 'Todas' ? RESOURCES : RESOURCES.filter((doc) => doc.category === category),
    [category],
  )

  const categoryOptions: Array<{ value: CategoryFilter; label: string; count: number }> = [
    { value: 'Todas', label: 'Todas', count: RESOURCES.length },
    ...CATEGORIES.map((entry) => ({
      value: entry,
      label: entry,
      count: RESOURCES.filter((doc) => doc.category === entry).length,
    })),
  ]

  return (
    <>
      <ViewHeader
        title="Recursos y directrices"
        description="Lee la política antes de presentar, no después. Casi todos los reportes rechazados en esta plataforma se rechazaron por una regla que está escrita aquí."
        action={
          <>
            <Button icon="download">Descargar manual</Button>
            <Button variant="primary" icon="book">
              Guía de reporte
            </Button>
          </>
        }
      />

      {/* --------------------------------------------------------- Safe Harbor */}
      <Panel className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <Icon name="shield" size={18} className="text-brand-ink" />
              <h2 className="text-[17px] leading-tight font-semibold tracking-tight text-ink">
                Puerto seguro de un vistazo
              </h2>
            </div>
            <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-muted">
              A lo que se compromete cada empresa cliente cuando te mantienes dentro de un alcance
              publicado. El texto vinculante es la versión 4.2: el resumen de abajo orienta, pero no
              es el contrato.
            </p>
          </div>
          <Chip size="sm" icon="check" tone="var(--status-good)">
            En vigor desde el 5 sep 2026
          </Chip>
        </div>

        <dl className="mt-6 grid gap-5 border-t border-hairline-soft pt-6 sm:grid-cols-2 xl:grid-cols-4">
          {SAFE_HARBOR.map((item) => (
            <div key={item.title}>
              <dt className="flex items-start gap-2 text-[13px] font-semibold text-ink">
                <Icon
                  name="check"
                  size={14}
                  className="mt-0.5 shrink-0"
                  style={{ color: 'var(--status-good)' }}
                />
                {item.title}
              </dt>
              <dd className="mt-2 text-[12px] leading-relaxed text-ink-muted">{item.body}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 border-t border-hairline-soft pt-4 text-[12px] leading-relaxed text-ink-muted">
          <strong className="font-semibold text-ink">Fuera de alcance, en todas partes.</strong>{' '}
          Infraestructura de producción real, sistemas de terceros, ingeniería social contra el
          personal de la empresa y cualquier acceso a datos personales. Los programas de acceso
          físico son siempre supervisados y así se indican en la convocatoria.
        </p>
      </Panel>

      {/* ------------------------------------------------------------- Pinned */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[19px] leading-tight font-semibold tracking-tight text-ink">
              Empieza por aquí
            </h2>
            <p className="mt-1.5 text-[13.5px] text-ink-muted">
              Los tres documentos que deciden la mayoría de los primeros resultados.
            </p>
          </div>
          <Chip size="sm" icon="book">
            {pinned.length} fijados
          </Chip>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {pinned.map((doc, index) => (
            <Panel key={doc.id} className="flex flex-col p-5">
              <div className="flex items-center gap-2.5">
                <span className="grid size-7 place-items-center rounded-lg bg-brand-wash text-[12px] font-bold tabular-nums text-brand-ink">
                  {index + 1}
                </span>
                <Chip size="xs" icon={CATEGORY_ICON[doc.category]}>
                  {doc.category}
                </Chip>
              </div>
              <h3 className="mt-4 text-[15px] leading-snug font-semibold text-ink">{doc.title}</h3>
              <p className="mt-2.5 flex-1 text-[12.5px] leading-relaxed text-ink-muted">
                {doc.summary}
              </p>
              <div className="mt-5 flex items-center justify-between gap-3 border-t border-hairline-soft pt-4">
                <span className="text-[11.5px] text-ink-faint">
                  {doc.readMinutes} min de lectura
                </span>
                <Button size="sm" variant="ghost" trailingIcon="chevron-right">
                  Abrir
                </Button>
              </div>
            </Panel>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------- Library */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[19px] leading-tight font-semibold tracking-tight text-ink">
              Biblioteca
            </h2>
            <p className="mt-1.5 text-[13.5px] text-ink-muted">
              Las políticas te obligan. Las directrices y las guías prácticas no, pero acortan el
              triaje.
            </p>
          </div>
          <Segmented
            label="Filtrar documentos por categoría"
            options={categoryOptions}
            value={category}
            onChange={setCategory}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {docs.map((doc) => (
            <Panel
              key={doc.id}
              className={cn('flex flex-col p-5', doc.pinned && 'bg-glass-strong')}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Icon name={CATEGORY_ICON[doc.category]} size={15} className="text-ink-faint" />
                  <span className="text-[11.5px] font-semibold tracking-[0.1em] text-ink-faint uppercase">
                    {doc.category}
                  </span>
                </div>
                {doc.pinned && (
                  <Chip size="xs" icon="star">
                    Fijado
                  </Chip>
                )}
              </div>

              <h3 className="mt-3.5 text-[14px] leading-snug font-semibold text-ink">{doc.title}</h3>
              <p className="mt-2 flex-1 text-[12.5px] leading-relaxed text-ink-muted">
                {doc.summary}
              </p>

              <dl className="mt-5 flex items-center justify-between gap-3 border-t border-hairline-soft pt-4 text-[11px] text-ink-faint">
                <div className="flex items-center gap-3">
                  <span className="font-mono">{doc.id}</span>
                  <span>{doc.readMinutes} min</span>
                </div>
                <div className="text-right">
                  <dt className="sr-only">Última actualización</dt>
                  <dd title={formatDate(doc.updatedAt, true)}>
                    actualizado {relativeTime(doc.updatedAt)}
                  </dd>
                </div>
              </dl>

              <Button
                size="sm"
                variant="ghost"
                className="mt-3 -ml-3 self-start"
                trailingIcon="chevron-right"
              >
                Leer documento
              </Button>
            </Panel>
          ))}
        </div>

        {docs.length === 0 && (
          <Panel className="px-6 py-16 text-center">
            <p className="text-[13px] text-ink-muted">
              Todavía no hay nada archivado en esa categoría.
            </p>
          </Panel>
        )}
      </section>

      {/* ------------------------------------------------------------ Checklist */}
      <Panel className="p-5 sm:p-6">
        <PanelHeader
          title="Antes de pulsar enviar"
          description="Una pasada de cinco puntos que atrapa casi todo lo que los triadores devuelven."
          icon={<Icon name="check-circle" size={17} />}
          className="px-0 pt-0"
        />
        <ol className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
          {[
            ['Alcance', 'El activo está nombrado en el alcance publicado de la convocatoria, tal como está hoy.'],
            ['Reproducción', 'Pasos numerados desde un estado limpio y con el entorno indicado.'],
            ['Evidencia', 'Una PoC acotada y capturas saneadas. Ningún dato personal en ningún sitio.'],
            ['Duplicados', 'Has buscado el mismo defecto en Hacktividad antes de presentar.'],
            ['Impacto', 'Has declarado lo que un atacante consigue, no lo que crees que podría conseguir.'],
          ].map(([term, body], index) => (
            <li key={term}>
              <div className="flex items-center gap-2">
                <span className="grid size-6 place-items-center rounded-full bg-brand-wash text-[11px] font-bold tabular-nums text-brand-ink">
                  {index + 1}
                </span>
                <span className="text-[12.5px] font-semibold text-ink">{term}</span>
              </div>
              <p className="mt-2 text-[12px] leading-relaxed text-ink-muted">{body}</p>
            </li>
          ))}
        </ol>
      </Panel>
    </>
  )
}
