import type { ReactNode, SVGProps } from 'react'

import { cn } from '@/lib/format'

/**
 * A single stroke-based icon set so the chrome stays visually consistent
 * without pulling in an icon dependency. Every glyph is drawn on a 24×24 grid
 * with a 1.75 stroke and round joins.
 */
const PATHS = {
  'arrow-down': <path d="M12 4v15M6 13l6 6 6-6" />,
  'arrow-up': <path d="M12 20V5M6 11l6-6 6 6" />,
  activity: <path d="M3 12h4l2.5-7 5 14L17 12h4" />,
  alert: (
    <>
      <path d="M12 3.5 21 19H3z" />
      <path d="M12 10v4M12 17h.01" />
    </>
  ),
  bell: (
    <>
      <path d="M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6" />
      <path d="M10.5 20a2 2 0 0 0 3 0" />
    </>
  ),
  book: (
    <>
      <path d="M4 5a2 2 0 0 1 2-2h11a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2z" />
      <path d="M6 17h12" />
    </>
  ),
  building: (
    <>
      <path d="M4 3h10v18H4z" />
      <path d="M14 9h5a1 1 0 0 1 1 1v11" />
      <path d="M7.5 7h3M7.5 11h3M7.5 15h3" />
      <path d="M3 21h18" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  check: <path d="M5 13l4.5 4.5L19 7" />,
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.4l2.5 2.5 4.5-5" />
    </>
  ),
  'chevron-down': <path d="M6 9l6 6 6-6" />,
  'chevron-left': <path d="M15 6l-6 6 6 6" />,
  'chevron-right': <path d="M9 6l6 6-6 6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.2 2" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6L6 18" />,
  code: <path d="M9 8l-4 4 4 4M15 8l4 4-4 4" />,
  coins: (
    <>
      <ellipse cx="12" cy="6.5" rx="7" ry="3" />
      <path d="M5 6.5v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" />
      <path d="M5 11.5v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 0 1 2-2h9" />
    </>
  ),
  dashboard: (
    <>
      <rect x="3" y="3" width="7.5" height="9.5" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="5.5" rx="1.5" />
      <rect x="13.5" y="12" width="7.5" height="9" rx="1.5" />
      <rect x="3" y="16" width="7.5" height="5" rx="1.5" />
    </>
  ),
  download: (
    <>
      <path d="M12 4v11M8 11l4 4 4-4" />
      <path d="M4 17v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1" />
    </>
  ),
  external: (
    <>
      <path d="M14 5h5v5M19 5l-7 7" />
      <path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  filter: <path d="M4 6h16l-6 7v5l-4 2v-7z" />,
  flame: (
    <path d="M12 3c3.2 3.6 5.5 6.2 5.5 9.6a5.5 5.5 0 1 1-11 0c0-1.9.8-3.4 1.8-4.7.4 1.4 1.2 2.1 2.2 2.4-.5-2.6.2-5.2 1.5-7.3z" />
  ),
  graduation: (
    <>
      <path d="M12 4L2 9l10 5 10-5z" />
      <path d="M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5" />
    </>
  ),
  inbox: (
    <>
      <path d="M5.6 4.5h12.8l2.6 7.2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6.3z" />
      <path d="M3 12.5h5l1.6 2.8h4.8l1.6-2.8h5" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.8h.01" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10" width="15" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  moon: <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />,
  paperclip: <path d="M20 11l-8.5 8.5a5 5 0 0 1-7-7l8-8a3.5 3.5 0 0 1 5 5l-8 8a2 2 0 0 1-3-3l7-7" />,
  plus: <path d="M12 5v14M5 12h14" />,
  refresh: (
    <>
      <path d="M20.5 11A8.5 8.5 0 0 0 6 5.4L3.5 8" />
      <path d="M3.5 3.5V8h4.5" />
      <path d="M3.5 13A8.5 8.5 0 0 0 18 18.6l2.5-2.6" />
      <path d="M20.5 20.5V16H16" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.6-3.6" />
    </>
  ),
  shield: <path d="M12 3l7 2.8v6.1c0 4.4-2.9 7.7-7 9.1-4.1-1.4-7-4.7-7-9.1V5.8z" />,
  sort: (
    <>
      <path d="M7 5v14M7 19l-3-3M7 19l3-3" />
      <path d="M14 7h6M14 12h4M14 17h2" />
    </>
  ),
  sparkles: (
    <>
      <path d="M11 3l1.7 4.4L17 9.1l-4.3 1.7L11 15.2 9.3 10.8 5 9.1l4.3-1.7z" />
      <path d="M18.5 14.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
    </>
  ),
  star: <path d="M12 3.5l2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 10l6.1-.9z" />,
  subtract: <path d="M5 12h14" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.2M12 19.8V22M2 12h2.2M19.8 12H22M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M19.1 4.9l-1.6 1.6M6.5 17.5l-1.6 1.6" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.6" />
      <circle cx="12" cy="12" r="1.2" />
    </>
  ),
  'trending-up': (
    <>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </>
  ),
  trophy: (
    <>
      <path d="M7 4h10v6a5 5 0 0 1-10 0z" />
      <path d="M7 6H4.5A2.5 2.5 0 0 0 7 10.5" />
      <path d="M17 6h2.5A2.5 2.5 0 0 1 17 10.5" />
      <path d="M12 15v3M9.5 21h5M10.5 18h3" />
    </>
  ),
  upload: (
    <>
      <path d="M12 15.5V4M8 8l4-4 4 4" />
      <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 5.2a3.5 3.5 0 0 1 0 6.6" />
      <path d="M18 14.6a6.5 6.5 0 0 1 3.5 5.4" />
    </>
  ),
  wallet: (
    <>
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H18a2 2 0 0 1 2 2v1.5" />
      <path d="M3 7.5V17a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1.5" />
      <path d="M21 10.5h-4a2.5 2.5 0 0 0 0 5h4z" />
    </>
  ),
  x: <path d="M6 6l12 12M18 6L6 18" />,
  zap: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
} satisfies Record<string, ReactNode>

export type IconName = keyof typeof PATHS

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName
  /** Rendered size in px. Defaults to 20. */
  size?: number
}

export function Icon({ name, size = 20, className, ...rest }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('shrink-0', className)}
      {...rest}
    >
      {PATHS[name]}
    </svg>
  )
}
