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
    const main = brand.querySelector('.brand-main') as HTMLElement | null

    const fit = () => {
      const maxWidth = wrap.clientWidth
      if (maxWidth <= 0) return
      const target = main ?? brand

      let lo = 28
      let hi = Math.min(120, Math.floor(maxWidth * 0.22))
      let best = lo
      brand.style.fontSize = `${hi}px`

      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2)
        brand.style.fontSize = `${mid}px`
        if (target.scrollWidth <= maxWidth) {
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
    document.fonts?.ready.then(fit).catch(() => undefined)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [])

  return (
    <section className="hero" id="hero">
      <div className="hero-inner" ref={wrapRef}>
        <p className="eyebrow">Available for hire · Cyprus</p>
        <h1 className="brand" ref={brandRef}>
          <span className="brand-main">SOLONARAS</span>
          <span className="brand-sub">PORTFOLIO</span>
        </h1>
        <p className="hero-line">AI builds you can watch.</p>
        <div className="hero-actions">
          <button
            type="button"
            className="cta"
            onClick={() => {
              if (onVoiceTour) onVoiceTour()
              else onStart()
            }}
          >
            Watch tour
          </button>
          <a className="cta cta-secondary" href="#clusters">
            See work
          </a>
        </div>
      </div>
      <div className="scroll-hint" aria-hidden="true">
        <span>Groups</span>
        <div className="scroll-line" />
      </div>
    </section>
  )
}
