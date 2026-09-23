import type { ButtonHTMLAttributes } from 'react'

import { Icon, type IconName } from '@/components/ui/Icon'
import { cn } from '@/lib/format'

type Variant = 'primary' | 'secondary' | 'ghost' | 'quiet'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: IconName
  trailingIcon?: IconName
  /** Stretches the button to its container — used in sidebars and empty states. */
  block?: boolean
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-linear-to-br from-[var(--solv-brand)] to-[var(--solv-accent)] text-on-brand shadow-[0_10px_28px_-12px_var(--solv-brand)] hover:brightness-110 active:brightness-95',
  secondary:
    'glass-soft text-ink hover:bg-glass-strong active:bg-glass-strong',
  ghost: 'text-ink-muted hover:bg-glass-soft hover:text-ink',
  quiet: 'bg-brand-wash text-brand-ink hover:brightness-105',
}

const SIZES: Record<Size, string> = {
  sm: 'h-8 gap-1.5 px-3 text-[12.5px] rounded-lg',
  md: 'h-10 gap-2 px-4 text-[13.5px] rounded-xl',
  lg: 'h-12 gap-2 px-5 text-[14.5px] rounded-2xl',
}

const ICON_SIZE: Record<Size, number> = { sm: 15, md: 17, lg: 18 }

export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  trailingIcon,
  block,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center font-semibold whitespace-nowrap transition duration-150',
        'disabled:pointer-events-none disabled:opacity-45',
        VARIANTS[variant],
        SIZES[size],
        block && 'w-full',
        className,
      )}
      {...rest}
    >
      {icon && <Icon name={icon} size={ICON_SIZE[size]} />}
      {children}
      {trailingIcon && <Icon name={trailingIcon} size={ICON_SIZE[size]} />}
    </button>
  )
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName
  /** Required: an icon-only control still needs an accessible name. */
  label: string
  size?: number
  active?: boolean
}

export function IconButton({
  icon,
  label,
  size = 18,
  active,
  className,
  type = 'button',
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'relative grid size-9 place-items-center rounded-xl transition duration-150',
        active ? 'bg-brand-wash text-brand-ink' : 'text-ink-muted hover:bg-glass-soft hover:text-ink',
        className,
      )}
      {...rest}
    >
      <Icon name={icon} size={size} />
    </button>
  )
}
