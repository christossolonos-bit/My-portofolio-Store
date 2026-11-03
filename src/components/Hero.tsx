import { useEffect, useRef } from 'react'

export function Hero() {
  const brandRef = useRef<HTMLHeadingElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const brand = brandRef.current
    const wrap = wrapRef.current
    if (!brand || !wrap) return

    const fit = () => {
      const maxWidth = wrap.clientWidth
      if (maxWidth <= 0) return

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
          SOLONARAS
        </h1>
        <p className="hero-line">
          Christos Solonos builds AI companions, voice systems, and live agents
          for teams that need them shipped — with demos you can watch on each
          project page.
        </p>
        <div className="hero-actions">
          <a className="cta" href="#outro">
            Discuss a project
          </a>
          <a className="cta cta-secondary" href="#work">
            See projects
          </a>
        </div>
      </div>
      <div className="scroll-hint" aria-hidden="true">
        <span>Projects</span>
        <div className="scroll-line" />
      </div>
    </section>
  )
}
