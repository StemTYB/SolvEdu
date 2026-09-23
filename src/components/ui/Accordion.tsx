import { useId, type ReactNode } from 'react'

import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/format'

interface AccordionItemProps {
  title: string
  /** Heading level for the trigger, so the page outline stays intact. */
  level?: 3 | 4
  open: boolean
  onToggle: () => void
  /** Rendered under the body — document id, reading time, last update. */
  footer?: ReactNode
  children: ReactNode
  id?: string
  className?: string
}

/**
 * One row of a disclosure list. Collapsed it shows nothing but its title and a
 * chevron; expanded it reveals a short body.
 *
 * The open state lives in the list rather than in the row, so a shortcut
 * elsewhere on the page can reveal a specific row.
 *
 * The panel deliberately carries no `role="region"`. A list of these runs to
 * twenty rows, and twenty landmarks would crowd a screen reader's landmark menu
 * for no gain — `aria-expanded` on the trigger and `aria-controls` pointing at
 * the panel already express the relationship. The collapsed panel is `inert`,
 * so its text stays out of the accessibility tree until it is opened.
 */
export function AccordionItem({
  title,
  level = 3,
  open,
  onToggle,
  footer,
  children,
  id,
  className,
}: AccordionItemProps) {
  const uid = useId()
  const triggerId = `${uid}-trigger`
  const panelId = `${uid}-panel`
  const Heading = level === 3 ? 'h3' : 'h4'

  return (
    <div id={id} className={cn('border-t border-hairline-soft first:border-t-0', className)}>
      <Heading>
        <button
          type="button"
          id={triggerId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition duration-150 hover:bg-glass-soft sm:px-6"
        >
          <span className="flex-1 text-[13.5px] leading-snug font-semibold text-ink">{title}</span>
          <span
            aria-hidden="true"
            className={cn(
              'grid size-6 shrink-0 place-items-center rounded-md text-ink-faint',
              'transition-transform duration-300 ease-out motion-reduce:transition-none',
              open && 'rotate-180',
            )}
          >
            <Icon name="chevron-down" size={15} />
          </span>
        </button>
      </Heading>

      {/*
        Animating `grid-template-rows` from 0fr to 1fr gives a real height
        transition without measuring the content in JS. The inner element needs
        `overflow: hidden` both to clip while closed and to zero its automatic
        minimum size — without that the track refuses to collapse.
      */}
      <div
        id={panelId}
        inert={!open}
        className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 sm:px-6 sm:pr-16">
            <p className="max-w-[68ch] text-[13px] leading-relaxed text-ink-muted">{children}</p>
            {footer && <div className="mt-3.5">{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
