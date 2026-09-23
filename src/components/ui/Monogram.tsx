import { cn } from '@/lib/format'

const SIZES = {
  xs: 'size-7 rounded-lg text-[10.5px]',
  sm: 'size-9 rounded-xl text-[12.5px]',
  md: 'size-11 rounded-2xl text-[14.5px]',
  lg: 'size-14 rounded-2xl text-[18px]',
  xl: 'size-20 rounded-3xl text-[26px]',
} as const

interface MonogramProps {
  /** One to three letters. Always paired with a visible name elsewhere on the card. */
  text: string
  accent: string
  size?: keyof typeof SIZES
  className?: string
  /** When true the accent fills the tile solid, for the highest-emphasis slot. */
  solid?: boolean
}

/**
 * A company or university identity tile. The accent tints the surface and the
 * initials stay in ink, so the mark is legible whatever hue it carries.
 */
export function Monogram({ text, accent, size = 'md', className, solid }: MonogramProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid shrink-0 place-items-center font-bold tracking-tight',
        SIZES[size],
        className,
      )}
      style={
        solid
          ? { backgroundColor: accent, color: '#fff', boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.35)' }
          : {
              backgroundColor: `color-mix(in oklab, ${accent} 18%, transparent)`,
              boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${accent} 38%, transparent)`,
              color: 'var(--solv-ink)',
            }
      }
    >
      {text}
    </span>
  )
}

/** Derives up to two initials from a display name. */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}
