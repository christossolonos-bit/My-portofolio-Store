import { useRef, type TouchEvent } from 'react'
import { projectsInCluster, type Cluster } from '../data/clusters'
import { maturityLabel, type Project } from '../data/projects'
import { track } from '../lib/analytics'
import { CompareBuilds } from './CompareBuilds'
import { ProjectSection } from './ProjectSection'

type ClusterBoardProps = {
  clusters: Cluster[]
  selectedClusterId: string | null
  selectedProjectId: string | null
  compareIds: string[]
  onSelectCluster: (id: string) => void
  onSelectProject: (id: string) => void
  onToggleCompare: (id: string) => void
  onClearCompare: () => void
}

export function ClusterBoard({
  clusters,
  selectedClusterId,
  selectedProjectId,
  compareIds,
  onSelectCluster,
  onSelectProject,
  onToggleCompare,
  onClearCompare,
}: ClusterBoardProps) {
  const selectedCluster =
    clusters.find((c) => c.id === selectedClusterId) ?? null
  const shelfProjects = selectedCluster
    ? projectsInCluster(selectedCluster)
    : []
  const activeProject =
    shelfProjects.find((p) => p.id === selectedProjectId) ??
    shelfProjects[0] ??
    null
  const activeIndex = activeProject
    ? shelfProjects.findIndex((p) => p.id === activeProject.id)
    : 0
  const touchX = useRef<number | null>(null)

  const onTouchStart = (e: TouchEvent) => {
    touchX.current = e.changedTouches[0]?.clientX ?? null
  }

  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current == null || !activeProject || shelfProjects.length < 2) {
      return
    }
    const x = e.changedTouches[0]?.clientX ?? touchX.current
    const dx = x - touchX.current
    touchX.current = null
    if (Math.abs(dx) < 48) return
    const i = shelfProjects.findIndex((p) => p.id === activeProject.id)
    const next =
      dx < 0
        ? shelfProjects[(i + 1) % shelfProjects.length]
        : shelfProjects[(i - 1 + shelfProjects.length) % shelfProjects.length]
    if (next) {
      track('shelf_swipe', { projectId: next.id })
      onSelectProject(next.id)
    }
  }

  return (
    <section className="clusters" id="clusters">
      <div className="clusters-intro">
        <p className="eyebrow">Capabilities · by type</p>
        <h2 className="clusters-title">Pick a cluster</h2>
        <p className="clusters-lead">
          Four shelves of capabilities — open a type, skim what’s inside, then
          watch the tour. Swipe the shelf on mobile; use arrows when a shelf is
          open.
        </p>
      </div>

      <div className="cluster-grid" role="list">
        {clusters.map((cluster) => {
          const items = projectsInCluster(cluster)
          const selected = cluster.id === selectedClusterId
          return (
            <button
              key={cluster.id}
              type="button"
              role="listitem"
              className={`cluster-card ${selected ? 'is-selected' : ''}`}
              style={{ ['--cluster-accent' as string]: cluster.accent }}
              aria-pressed={selected}
              onClick={() => {
                track('cluster_open', { clusterId: cluster.id })
                onSelectCluster(cluster.id)
              }}
            >
              <div className="cluster-card-top">
                <span className="cluster-card-count">
                  {items.length} build{items.length === 1 ? '' : 's'}
                </span>
              </div>
              <h3 className="cluster-card-name">{cluster.name}</h3>
              <p className="cluster-card-summary">{cluster.summary}</p>
              <p className="cluster-card-case">{cluster.caseLine}</p>
              <ul className="cluster-card-items">
                {items.map((p) => (
                  <li key={p.id}>
                    {p.name}
                    <span className={`maturity-dot maturity-${p.maturity}`} />
                  </li>
                ))}
              </ul>
            </button>
          )
        })}
      </div>

      {selectedCluster && activeProject ? (
        <div
          className="cluster-shelf"
          id={`cluster-${selectedCluster.id}`}
          style={{ ['--accent' as string]: selectedCluster.accent }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="cluster-shelf-head">
            <div>
              <p className="eyebrow">{selectedCluster.name}</p>
              <h3 className="cluster-shelf-title">What’s in this cluster</h3>
              <p className="cluster-shelf-summary">{selectedCluster.summary}</p>
              <p className="cluster-shelf-case">{selectedCluster.caseLine}</p>
            </div>
          </div>

          <div className="cluster-shelf-tiles" role="tablist">
            {shelfProjects.map((project) => (
              <ProjectTile
                key={project.id}
                project={project}
                selected={project.id === activeProject.id}
                comparing={compareIds.includes(project.id)}
                onSelect={() => onSelectProject(project.id)}
                onCompare={() => onToggleCompare(project.id)}
              />
            ))}
          </div>

          <CompareBuilds
            projects={shelfProjects}
            selectedIds={compareIds}
            onToggle={onToggleCompare}
            onClear={onClearCompare}
          />

          <ProjectSection
            project={activeProject}
            index={Math.max(0, activeIndex)}
            active
          />
        </div>
      ) : null}
    </section>
  )
}

function ProjectTile({
  project,
  selected,
  comparing,
  onSelect,
  onCompare,
}: {
  project: Project
  selected: boolean
  comparing: boolean
  onSelect: () => void
  onCompare: () => void
}) {
  return (
    <div
      className={`cluster-tile-wrap ${selected ? 'is-selected' : ''} ${comparing ? 'is-comparing' : ''}`}
      style={{ ['--tile-accent' as string]: project.accent }}
    >
      <button
        type="button"
        role="tab"
        aria-selected={selected}
        className="cluster-tile"
        onClick={onSelect}
      >
        <span className={`maturity-badge maturity-${project.maturity}`}>
          {maturityLabel[project.maturity]}
        </span>
        <span className="cluster-tile-name">{project.name}</span>
        <span className="cluster-tile-tag">{project.tagline}</span>
      </button>
      <button
        type="button"
        className="cluster-tile-compare"
        aria-pressed={comparing}
        onClick={(e) => {
          e.stopPropagation()
          onCompare()
        }}
      >
        {comparing ? 'In compare' : 'Compare'}
      </button>
    </div>
  )
}
