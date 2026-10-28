import type { Cluster } from '../data/clusters'

type ClusterNavProps = {
  clusters: Cluster[]
  activeId: string | null
  onSelect: (id: string) => void
}

export function ClusterNav({ clusters, activeId, onSelect }: ClusterNavProps) {
  return (
    <nav className="cluster-nav" aria-label="Capability clusters">
      <ul>
        {clusters.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              className={activeId === c.id ? 'is-active' : ''}
              title={c.name}
              style={{ ['--dot' as string]: c.accent }}
              onClick={() => onSelect(c.id)}
            >
              <span className="cluster-nav-label">{c.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
