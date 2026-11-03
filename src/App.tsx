import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { BookCall } from './components/BookCall'
import { ContactForm } from './components/ContactForm'
import { Hero } from './components/Hero'
import { LayoutToggle, useLayoutMode } from './components/LayoutToggle'
import { ProjectCatalog } from './components/ProjectCatalog'
import { ProjectPage } from './components/ProjectPage'
import { projects } from './data/projects'
import { socials } from './data/socials'
import { track } from './lib/analytics'
import { noteMediaGestureFromEvent } from './lib/media-audio'
import {
  ideaFromSelection,
  type RequestBuildDetail,
} from './lib/store-events'

const Scene = lazy(() =>
  import('./components/Scene').then((m) => ({ default: m.Scene })),
)

function App() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  )
  const [ideaPrefill, setIdeaPrefill] = useState('')
  const [layoutMode, setLayoutMode] = useLayoutMode()

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) ?? null,
    [selectedProjectId],
  )
  const accent = selectedProject?.accent ?? '#3db89a'

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const openProject = (id: string, scroll = true) => {
    if (!projects.some((p) => p.id === id)) return
    noteMediaGestureFromEvent()
    setSelectedProjectId(id)
    window.history.replaceState(null, '', `#${id}`)
    track('project_select', { projectId: id })
    if (scroll) {
      window.setTimeout(() => {
        document
          .getElementById(id)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 40)
    }
  }

  const closeProject = () => {
    setSelectedProjectId(null)
    window.history.replaceState(null, '', '#work')
    window.setTimeout(() => {
      document
        .getElementById('work')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 40)
  }

  useEffect(() => {
    setIdeaPrefill(
      ideaFromSelection({
        projectName: selectedProject?.name,
      }),
    )
  }, [selectedProject?.name])

  useEffect(() => {
    const onRequest = (e: Event) => {
      const detail = (e as CustomEvent<RequestBuildDetail>).detail
      if (!detail) return
      if (detail.projectId) openProject(detail.projectId, false)
      setIdeaPrefill(detail.idea)
      window.setTimeout(() => {
        document.getElementById('outro')?.scrollIntoView({ behavior: 'smooth' })
      }, 40)
    }
    const onOpenProject = (e: Event) => {
      const id = (e as CustomEvent<{ projectId?: string }>).detail?.projectId
      if (id) openProject(id, true)
    }
    window.addEventListener('solonaras-request-build', onRequest)
    window.addEventListener('solonaras-open-project', onOpenProject)
    return () => {
      window.removeEventListener('solonaras-request-build', onRequest)
      window.removeEventListener('solonaras-open-project', onOpenProject)
    }
  }, [])

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace(/^#/, '')
      if (!hash || hash === 'hero' || hash === 'outro' || hash === 'work') {
        if (hash === 'work' || hash === 'hero' || hash === 'outro' || !hash) {
          setSelectedProjectId(null)
        }
        return
      }
      if (hash.startsWith('cluster-')) {
        setSelectedProjectId(null)
        return
      }
      if (projects.some((p) => p.id === hash)) {
        setSelectedProjectId(hash)
      }
    }
    applyHash()
    window.addEventListener('hashchange', applyHash)
    return () => window.removeEventListener('hashchange', applyHash)
  }, [])

  return (
    <div
      className={`app ${layoutMode === 'phone' ? 'app-phone' : 'app-desktop'}`}
      style={{ ['--accent' as string]: accent }}
    >
      <Suspense fallback={null}>
        <Scene
          accent={accent}
          progress={scrollProgress}
          phone={layoutMode === 'phone'}
        />
      </Suspense>

      <header className="topbar">
        <a className="logo" href="#hero">
          SOLONARAS
        </a>
        <div className="topbar-right">
          <a className="topbar-meta topbar-hire" href="#outro">
            Available for hire
          </a>
          <LayoutToggle mode={layoutMode} onChange={setLayoutMode} />
        </div>
      </header>

      <main>
        <Hero />

        {selectedProject ? (
          <ProjectPage project={selectedProject} onBack={closeProject} />
        ) : (
          <ProjectCatalog projects={projects} onOpen={openProject} />
        )}

        <footer className="outro" id="outro">
          <p className="eyebrow">Contact</p>
          <h2>Discuss a project</h2>
          <p>
            Christos Solonos — Cyprus. Companions, voice systems, live agents,
            and custom sites. I usually reply within one business day.
          </p>

          <ul className="social-list">
            {socials.map((social) => (
              <li key={social.id}>
                <a
                  className="social-link"
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="social-label">{social.label}</span>
                  <span className="social-handle">{social.handle}</span>
                </a>
              </li>
            ))}
          </ul>

          <BookCall
            projectName={selectedProject?.name}
            projectId={selectedProject?.id}
          />

          <ContactForm ideaPrefill={ideaPrefill} />

          <a className="ghost-link outro-top" href="#work">
            Back to work
          </a>
        </footer>
      </main>
    </div>
  )
}

export default App
