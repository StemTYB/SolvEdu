const BLOBS = [
  {
    // brand violet — the anchor, top-left
    style: {
      top: '-16%',
      left: '-8%',
      width: '52vw',
      height: '52vw',
      background: 'radial-gradient(circle at 50% 50%, #7c5cff 0%, transparent 68%)',
    },
    className: 'animate-drift',
  },
  {
    // cyan — the counterweight, right edge
    style: {
      top: '4%',
      right: '-12%',
      width: '44vw',
      height: '44vw',
      background: 'radial-gradient(circle at 50% 50%, #22d3ee 0%, transparent 68%)',
    },
    className: 'animate-drift-alt',
  },
  {
    // magenta — mid-left, gives the glass something warm to refract
    style: {
      top: '42%',
      left: '12%',
      width: '38vw',
      height: '38vw',
      background: 'radial-gradient(circle at 50% 50%, #f472b6 0%, transparent 70%)',
    },
    className: 'animate-drift-alt',
  },
  {
    // emerald — bottom-left
    style: {
      bottom: '-18%',
      left: '-6%',
      width: '46vw',
      height: '46vw',
      background: 'radial-gradient(circle at 50% 50%, #34d399 0%, transparent 70%)',
    },
    className: 'animate-drift',
  },
  {
    // amber — bottom-right, the accent that keeps the field from going cool-only
    style: {
      bottom: '-14%',
      right: '6%',
      width: '40vw',
      height: '40vw',
      background: 'radial-gradient(circle at 50% 50%, #fbbf24 0%, transparent 70%)',
    },
    className: 'animate-drift-alt',
  },
] as const

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/**
 * The vibrant abstract field the glass panels refract. Fixed behind everything
 * and inert — it carries no meaning, only depth.
 */
export function GlassBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-canvas" />

      <div className="absolute inset-0 opacity-35 dark:opacity-55">
        {BLOBS.map((blob, index) => (
          <div
            key={index}
            className={`absolute rounded-full blur-[110px] ${blob.className}`}
            style={blob.style}
          />
        ))}
      </div>

      {/* Fine grid, masked so it dissolves before it reaches the content. */}
      <div
        className="absolute inset-0 opacity-[0.05] dark:opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--solv-ink) 1px, transparent 1px), linear-gradient(to bottom, var(--solv-ink) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse 90% 60% at 50% 0%, black 10%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 60% at 50% 0%, black 10%, transparent 78%)',
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.22] mix-blend-overlay dark:opacity-[0.16]"
        style={{ backgroundImage: NOISE }}
      />

      {/* Vignette — pulls the eye to the centre of the content column. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 120% 90% at 50% 40%, transparent 40%, color-mix(in oklab, var(--solv-canvas) 78%, transparent) 100%)',
        }}
      />
    </div>
  )
}
