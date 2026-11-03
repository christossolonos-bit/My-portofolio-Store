import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { BookCall } from './components/BookCall'
import { ContactForm } from './components/ContactForm'
import { Hero } from './components/Hero'
import { LayoutToggle, useLayoutMode } from './components/LayoutToggle'
import { ProjectCatalog } from './components/ProjectCatalog'
import { ProjectPage } from './components/ProjectPage'
import { SolonarasGuide } from './components/SolonarasGuide'
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
  const [guideOpenSignal, setGuideOpenSignal] = useState(0)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  )
  const [ideaPrefill, setIdeaPrefill] = useState('')
  const [layoutMode, setLayoutMode] = useLayoutMode()

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) ?? null,
    [selectedProjectId],
  )
  const accent = selectedProject?.accent ?? '#2ee6a6'
  const discord = socials.find((s) => s.id === 'discord')

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const open = () => setGuideOpenSignal((n) => n + 1)
    window.addEventListener('solonaras-open-guide', open)
    return () => window.removeEventListener('solonaras-open-guide', open)
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
    const onOpenCluster = (e: Event) => {
      // Guide may still send cluster actions — land on the work grid.
      void e
      setSelectedProjectId(null)
      window.history.replaceState(null, '', '#work')
      window.setTimeout(() => {
        document
          .getElementById('work')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 40)
    }
    window.addEventListener('solonaras-request-build', onRequest)
    window.addEventListener('solonaras-open-project', onOpenProject)
    window.addEventListener('solonaras-open-cluster', onOpenCluster)
    return () => {
      window.removeEventListener('solonaras-request-build', onRequest)
      window.removeEventListener('solonaras-open-project', onOpenProject)
      window.removeEventListener('solonaras-open-cluster', onOpenCluster)
    }
  }, [])

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace(/^#/, '')
      if (
        !hash ||
        hash === 'hero' ||
        hash === 'outro' ||
        hash === 'work' ||
        hash === 'clusters' ||
        hash === 'personas'
      ) {
        if (hash === 'work' || hash === 'clusters' || hash === 'personas' || !hash) {
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
          SOLONARAS PORTFOLIO
        </a>
        <div className="topbar-right">
          <a className="topbar-meta topbar-hire" href="#outro">
            Available for hire
          </a>
          <LayoutToggle mode={layoutMode} onChange={setLayoutMode} />
        </div>
      </header>

      <main>
        {!selectedProject ? <Hero /> : null}

        {selectedProject ? (
          <ProjectPage project={selectedProject} onBack={closeProject} />
        ) : (
          <ProjectCatalog projects={projects} onOpen={openProject} />
        )}

        <footer className="outro" id="outro">
          <p className="eyebrow">Hire</p>
          <h2>Discuss a project</h2>
          <p>Hiring or collaborating? I usually reply within a day.</p>

          {discord ? (
            <a
              className="cta outro-discord"
              href={discord.href}
              target="_blank"
              rel="noreferrer"
            >
              Message on Discord
            </a>
          ) : null}

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
            Back to projects
          </a>
        </footer>
      </main>

      <SolonarasGuide
        openSignal={guideOpenSignal}
        selectedProjectName={selectedProject?.name ?? null}
        selectedClusterName={null}
        selectedClusterId={null}
      />
    </div>
  )
}

export default App
