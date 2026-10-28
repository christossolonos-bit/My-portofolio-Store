import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { BookCall } from './components/BookCall'
import { ClusterBoard } from './components/ClusterBoard'
import { ClusterNav } from './components/ClusterNav'
import { ContactForm } from './components/ContactForm'
import { Hero } from './components/Hero'
import { MUTE_KEY, SolonarasGuide } from './components/SolonarasGuide'
import { WelcomeTour } from './components/WelcomeTour'
import {
  clusterForProject,
  clusters,
  projectsInCluster,
} from './data/clusters'
import { projects } from './data/projects'
import { socials } from './data/socials'
import { track } from './lib/analytics'
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
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(
    null,
  )
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  )
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [ideaPrefill, setIdeaPrefill] = useState('')
  const [guideMuted] = useState(() => {
    try {
      return localStorage.getItem(MUTE_KEY) === '1'
    } catch {
      return false
    }
  })

  const selectedCluster =
    clusters.find((c) => c.id === selectedClusterId) ?? null
  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) ?? null,
    [selectedProjectId],
  )
  const accent =
    selectedProject?.accent || selectedCluster?.accent || '#2ee6a6'
  const shelfProjects = selectedCluster
    ? projectsInCluster(selectedCluster)
    : []

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

  const selectCluster = (id: string, scroll = true) => {
    const cluster = clusters.find((c) => c.id === id)
    if (!cluster) return
    const first = projectsInCluster(cluster)[0]
    setSelectedClusterId(id)
    setSelectedProjectId((prev) =>
      prev && cluster.projectIds.includes(prev) ? prev : (first?.id ?? null),
    )
    setCompareIds((prev) => prev.filter((pid) => cluster.projectIds.includes(pid)))
    window.history.replaceState(null, '', `#cluster-${id}`)
    if (scroll) {
      window.setTimeout(() => {
        document
          .getElementById(`cluster-${id}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 60)
    }
  }

  const selectProject = (id: string) => {
    const parent = clusterForProject(id)
    if (parent) setSelectedClusterId(parent.id)
    setSelectedProjectId(id)
    window.history.replaceState(null, '', `#${id}`)
    track('project_select', { projectId: id })
  }

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      const next = [...prev, id].slice(-2)
      track('compare_toggle', { projectId: id, count: next.length })
      return next
    })
  }

  useEffect(() => {
    setIdeaPrefill(
      ideaFromSelection({
        projectName: selectedProject?.name,
        clusterName: selectedCluster?.name,
      }),
    )
  }, [selectedProject?.name, selectedCluster?.name])

  useEffect(() => {
    const onRequest = (event: Event) => {
      const detail = (event as CustomEvent<RequestBuildDetail>).detail
      if (!detail) return
      if (detail.projectId) selectProject(detail.projectId)
      else if (detail.clusterId) selectCluster(detail.clusterId, false)
      setIdeaPrefill(detail.idea)
      window.setTimeout(() => {
        document.getElementById('outro')?.scrollIntoView({ behavior: 'smooth' })
      }, 40)
    }
    const onOpenCluster = (event: Event) => {
      const id = (event as CustomEvent<{ clusterId: string }>).detail?.clusterId
      if (id) selectCluster(id, true)
    }
    const onOpenProject = (event: Event) => {
      const id = (event as CustomEvent<{ projectId: string }>).detail?.projectId
      if (id) {
        selectProject(id)
        const parent = clusterForProject(id)
        if (parent) {
          window.setTimeout(() => {
            document
              .getElementById(`cluster-${parent.id}`)
              ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }, 60)
        }
      }
    }
    window.addEventListener('solonaras-request-build', onRequest)
    window.addEventListener('solonaras-open-cluster', onOpenCluster)
    window.addEventListener('solonaras-open-project', onOpenProject)
    return () => {
      window.removeEventListener('solonaras-request-build', onRequest)
      window.removeEventListener('solonaras-open-cluster', onOpenCluster)
      window.removeEventListener('solonaras-open-project', onOpenProject)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace(/^#/, '')
      if (!hash || hash === 'hero' || hash === 'outro' || hash === 'clusters') {
        return
      }
      if (hash.startsWith('cluster-')) {
        const id = hash.slice('cluster-'.length)
        if (clusters.some((c) => c.id === id)) selectCluster(id, false)
        return
      }
      const parent = clusterForProject(hash)
      if (parent) {
        setSelectedClusterId(parent.id)
        setSelectedProjectId(hash)
      }
    }
    applyHash()
    window.addEventListener('hashchange', applyHash)
    return () => window.removeEventListener('hashchange', applyHash)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Arrow keys switch shelf tiles when a cluster is open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!selectedClusterId || shelfProjects.length < 2) return
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
      const i = Math.max(
        0,
        shelfProjects.findIndex((p) => p.id === selectedProjectId),
      )
      const next =
        e.key === 'ArrowRight'
          ? shelfProjects[(i + 1) % shelfProjects.length]
          : shelfProjects[(i - 1 + shelfProjects.length) % shelfProjects.length]
      if (next) {
        e.preventDefault()
        selectProject(next.id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedClusterId, selectedProjectId, shelfProjects])

  const startTour = () => {
    window.dispatchEvent(new Event('solonaras-open-guide'))
    document.getElementById('clusters')?.scrollIntoView({ behavior: 'smooth' })
  }

  const startVoiceTour = () => {
    setGuideOpenSignal((n) => n + 1)
    window.dispatchEvent(new Event('solonaras-start-welcome-tour'))
  }

  return (
    <div className="app" style={{ ['--accent' as string]: accent }}>
      <Suspense fallback={null}>
        <Scene accent={accent} progress={scrollProgress} />
      </Suspense>

      <header className="topbar">
        <a className="logo" href="#hero">
          SOLONARAS
        </a>
        <span className="topbar-meta">Portfolio · Clusters</span>
      </header>

      <ClusterNav
        clusters={clusters}
        activeId={selectedClusterId}
        onSelect={(id) => selectCluster(id)}
      />

      <main>
        <Hero onStart={startTour} onVoiceTour={startVoiceTour} />

        <ClusterBoard
          clusters={clusters}
          selectedClusterId={selectedClusterId}
          selectedProjectId={selectedProjectId}
          compareIds={compareIds}
          onSelectCluster={(id) => selectCluster(id)}
          onSelectProject={selectProject}
          onToggleCompare={toggleCompare}
          onClearCompare={() => setCompareIds([])}
        />

        <footer className="outro" id="outro">
          <p className="eyebrow">Contact</p>
          <h2>Interested in working together?</h2>
          <p>
            This is a portfolio of what I can build — companions, voice systems,
            vision co-hosts, desktop agents, and custom sites. Reach out if you’re
            hiring or want to collaborate.
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

          <a className="ghost-link outro-top" href="#clusters">
            Back to clusters
          </a>
        </footer>
      </main>

      <SolonarasGuide
        openSignal={guideOpenSignal}
        selectedProjectName={selectedProject?.name ?? null}
        selectedClusterName={selectedCluster?.name ?? null}
        selectedClusterId={selectedClusterId}
      />

      <WelcomeTour
        muted={guideMuted}
        onOpenGuide={() => setGuideOpenSignal((n) => n + 1)}
      />
    </div>
  )
}

export default App
