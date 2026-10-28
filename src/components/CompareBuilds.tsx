import { formatPrice, maturityLabel, type Project } from '../data/projects'
import { ideaFromSelection, requestBuild } from '../lib/store-events'
import { track } from '../lib/analytics'

type CompareBuildsProps = {
  projects: Project[]
  selectedIds: string[]
  onToggle: (id: string) => void
  onClear: () => void
}

export function CompareBuilds({
  projects,
  selectedIds,
  onToggle,
  onClear,
}: CompareBuildsProps) {
  const selected = selectedIds
    .map((id) => projects.find((p) => p.id === id))
    .filter((p): p is Project => Boolean(p))
    .slice(0, 2)

  if (selected.length === 0) return null

  return (
    <div className="compare" id="compare">
      <div className="compare-bar">
        <p className="compare-bar-title">
          Compare {selected.length}/2
          <span className="compare-bar-hint"> · tap tiles to add</span>
        </p>
        <button type="button" className="ghost-link" onClick={onClear}>
          Clear
        </button>
      </div>

      {selected.length === 2 ? (
        <div className="compare-grid">
          {selected.map((p) => (
            <article
              key={p.id}
              className="compare-card"
              style={{ ['--accent' as string]: p.accent }}
            >
              <header>
                <span className={`maturity-badge maturity-${p.maturity}`}>
                  {maturityLabel[p.maturity]}
                </span>
                <h3>{p.name}</h3>
                <p>{p.tagline}</p>
                <strong className="compare-price">
                  From {formatPrice(p.startingPrice)}
                </strong>
              </header>
              <ul>
                {p.includes.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className="compare-note">{p.priceNote}</p>
              <button
                type="button"
                className="cta compare-cta"
                onClick={() => {
                  track('compare_request', { projectId: p.id })
                  requestBuild({
                    projectId: p.id,
                    idea: ideaFromSelection({ projectName: p.name }),
                  })
                }}
              >
                Request {p.name}
              </button>
              <button
                type="button"
                className="ghost-link"
                onClick={() => onToggle(p.id)}
              >
                Remove
              </button>
            </article>
          ))}
        </div>
      ) : (
        <p className="compare-wait">Pick one more build to compare side by side.</p>
      )}
    </div>
  )
}
