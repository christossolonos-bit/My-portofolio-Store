import { useEffect, useRef } from 'react'

type HeroProps = {
  onStart: () => void
  onVoiceTour?: () => void
}

export function Hero({ onStart, onVoiceTour }: HeroProps) {
  const brandRef = useRef<HTMLHeadingElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const brand = brandRef.current
    const wrap = wrapRef.current
    if (!brand || !wrap) return

    const fit = () => {
      const maxWidth = wrap.clientWidth
      if (maxWidth <= 0) return

      // Binary search a font size that fits “SOLONARAS” in the hero column
      let lo = 28
      let hi = Math.min(120, Math.floor(maxWidth * 0.22))
      let best = lo
      brand.style.fontSize = `${hi}px`

      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2)
        brand.style.fontSize = `${mid}px`
        if (brand.scrollWidth <= maxWidth) {
          best = mid
          lo = mid + 1
        } else {
          hi = mid - 1
        }
      }
      brand.style.fontSize = `${best}px`
    }

    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(wrap)
    window.addEventListener('resize', fit)
    // Fonts may load after first paint
    document.fonts?.ready.then(fit).catch(() => undefined)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [])

  return (
    <section className="hero" id="hero">
      <div className="hero-inner" ref={wrapRef}>
        <p className="eyebrow">Cyprus · What I can create</p>
        <h1 className="brand" ref={brandRef}>
          SOLONARAS
        </h1>
        <p className="hero-line">
          A portfolio of what I can build — companions, voice & stage, live &
          games, author & web. Open a cluster, then watch the tour.
        </p>
        <div className="hero-actions">
          <button
            type="button"
            className="cta"
            onClick={() => {
              if (onVoiceTour) onVoiceTour()
              else onStart()
            }}
          >
            Start voice tour
          </button>
          <button type="button" className="cta cta-secondary" onClick={onStart}>
            Ask the guide
          </button>
          <a className="cta cta-ghost" href="#clusters">
            Browse clusters
          </a>
        </div>
      </div>
      <div className="scroll-hint" aria-hidden="true">
        <span>Clusters</span>
        <div className="scroll-line" />
      </div>
    </section>
  )
}
