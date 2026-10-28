import fs from 'node:fs'

const p = 'src/index.css'
let s = fs.readFileSync(p, 'utf8')
const start = s.indexOf('html.is-phone-layout .topbar {')
const end = s.indexOf('@media (prefers-reduced-motion: reduce)')
if (start < 0 || end < 0) {
  console.error('markers missing', start, end)
  process.exit(1)
}

const phoneCss = `html.is-phone-layout .topbar {
  padding: calc(0.85rem + env(safe-area-inset-top, 0px)) 1rem 0.85rem;
}

html.is-phone-layout .topbar-meta {
  display: none;
}

html.is-phone-layout .layout-toggle-label {
  display: none;
}

html.is-phone-layout .hero {
  min-height: 100svh;
  padding:
    calc(5.25rem + env(safe-area-inset-top, 0px))
    1.1rem
    calc(5.5rem + env(safe-area-inset-bottom, 0px));
  place-items: end stretch;
  align-content: end;
}

html.is-phone-layout .hero-inner {
  width: 100%;
}

html.is-phone-layout .brand {
  font-size: clamp(2.4rem, 14vw, 3.4rem);
  letter-spacing: -0.04em;
}

html.is-phone-layout .hero-line {
  margin: 1rem 0 1.35rem;
  font-size: 1.02rem;
  max-width: none;
}

html.is-phone-layout .hero-actions {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.7rem;
  width: 100%;
}

html.is-phone-layout .hero-actions .cta,
html.is-phone-layout .hero-actions .cta-secondary,
html.is-phone-layout .hero-actions .cta-ghost {
  width: 100%;
  min-height: var(--touch);
  justify-content: center;
}

html.is-phone-layout .clusters {
  padding: 2.5rem 1.1rem 4.5rem;
}

html.is-phone-layout .clusters-title {
  font-size: clamp(1.65rem, 8vw, 2.1rem);
}

html.is-phone-layout .clusters-lead {
  font-size: 0.98rem;
}

html.is-phone-layout .cluster-grid,
html.is-phone-layout .compare-grid {
  grid-template-columns: 1fr;
}

html.is-phone-layout .cluster-card {
  padding: 1.15rem 1.1rem 1.2rem;
  border-radius: 0.9rem;
}

html.is-phone-layout .cluster-card:hover {
  transform: none;
}

html.is-phone-layout .cluster-card-name {
  font-size: 1.22rem;
}

html.is-phone-layout .cluster-shelf-tiles {
  display: flex;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  gap: 0.7rem;
  margin: 1.1rem 0 0.75rem;
  padding: 0.15rem 0.15rem 0.65rem;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

html.is-phone-layout .cluster-shelf-tiles::-webkit-scrollbar {
  display: none;
}

html.is-phone-layout .cluster-tile-wrap {
  flex: 0 0 min(78vw, 260px);
  scroll-snap-align: start;
}

html.is-phone-layout .cluster-tile {
  min-height: 7.5rem;
  padding: 0.9rem;
}

html.is-phone-layout .cluster-tile-compare {
  min-height: 2.5rem;
}

html.is-phone-layout .cluster-shelf .project {
  padding: 1.25rem 0 0.5rem;
}

html.is-phone-layout .project {
  grid-template-columns: 1fr;
  padding-top: 1rem;
  padding-bottom: 2rem;
  min-height: auto;
  gap: 1.25rem;
}

html.is-phone-layout .project-name {
  font-size: clamp(1.55rem, 7vw, 2rem);
}

html.is-phone-layout .project-footer {
  flex-direction: column;
  align-items: stretch;
  gap: 0.85rem;
}

html.is-phone-layout .project-footer .project-link,
html.is-phone-layout .project-footer a {
  min-height: var(--touch);
  display: inline-flex;
  align-items: center;
}

html.is-phone-layout .project-video {
  border-radius: 0.85rem;
  aspect-ratio: 16 / 10;
  width: 100%;
}

html.is-phone-layout .compare {
  margin-top: 0.75rem;
}

html.is-phone-layout .compare-bar {
  flex-wrap: wrap;
  gap: 0.5rem;
}

html.is-phone-layout .book-call-actions {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.65rem;
}

html.is-phone-layout .book-call-actions .cta,
html.is-phone-layout .book-call-actions .cta-secondary {
  width: 100%;
  min-height: var(--touch);
}

html.is-phone-layout .outro {
  width: 100%;
  margin-left: 0;
  padding: 3.5rem 1.1rem calc(7.5rem + env(safe-area-inset-bottom, 0px));
  min-height: auto;
}

html.is-phone-layout .social-list {
  grid-template-columns: 1fr;
}

html.is-phone-layout .social-link {
  min-height: var(--touch);
}

html.is-phone-layout .contact-form {
  gap: 0.85rem;
}

html.is-phone-layout .contact-form input,
html.is-phone-layout .contact-form textarea {
  font-size: 16px;
  min-height: var(--touch);
}

html.is-phone-layout .contact-form textarea {
  min-height: 7.5rem;
}

html.is-phone-layout .contact-form button[type='submit'] {
  width: 100%;
  min-height: var(--touch);
}

html.is-phone-layout .progress-nav,
html.is-phone-layout .cluster-nav {
  display: none;
}

html.is-phone-layout .sol-guide {
  left: 0.75rem;
  right: auto;
  bottom: calc(0.75rem + env(safe-area-inset-bottom, 0px));
}

html.is-phone-layout .sol-guide:has(.sol-guide-panel) {
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0;
}

html.is-phone-layout .sol-guide-fab {
  min-height: var(--touch);
}

html.is-phone-layout .sol-guide-panel {
  width: 100%;
  height: min(78svh, calc(100svh - env(safe-area-inset-top, 0px) - 0.5rem));
  max-height: none;
  border-radius: 1.15rem 1.15rem 0 0;
  border-left: 0;
  border-right: 0;
  border-bottom: 0;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

html.is-phone-layout .sol-guide-composer {
  padding-bottom: calc(0.65rem + env(safe-area-inset-bottom, 0px));
}

html.is-phone-layout .sol-guide-composer input,
html.is-phone-layout .sol-guide-composer textarea {
  font-size: 16px;
}

html.is-phone-layout .sol-guide-widgets {
  grid-template-columns: 1fr;
}

html.is-phone-layout .welcome-tour {
  left: 0.75rem;
  right: 0.75rem;
  width: auto;
  transform: none;
  bottom: calc(5.75rem + env(safe-area-inset-bottom, 0px));
  max-width: none;
}

html.is-phone-layout .welcome-tour-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.55rem;
}

html.is-phone-layout .welcome-tour-actions .cta,
html.is-phone-layout .welcome-tour-actions .cta-secondary {
  width: 100%;
  min-height: var(--touch);
}

html.is-phone-layout .scene-root {
  opacity: 0.72;
}

`

fs.writeFileSync(p, s.slice(0, start) + phoneCss + s.slice(end))
console.log('fixed phone css')
