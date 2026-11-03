import { maturityLabel, type Project } from '../data/projects'
import { track } from '../lib/analytics'

type ProjectCatalogProps = {
  projects: Project[]
  onOpen: (id: string) => void
}

export function ProjectCatalog({ projects, onOpen }: ProjectCatalogProps) {
  return (
    <section className="work" id="work">
      <div className="work-intro">
        <p className="eyebrow">Selected work</p>
        <h2 className="work-title">Projects</h2>
        <p className="work-lead">
          Open any build for the full description and product tour video.
        </p>
      </div>

      <div className="work-grid" role="list">
        {projects.map((project) => (
          <button
            key={project.id}
            type="button"
            role="listitem"
            className="work-card"
            onClick={() => {
              track('project_open', { projectId: project.id })
              onOpen(project.id)
            }}
          >
            <div className="work-card-media">
              {project.posterSrc ? (
                <img
                  src={project.posterSrc}
                  alt=""
                  loading="lazy"
                  className="work-card-poster"
                />
              ) : (
                <div className="work-card-poster work-card-poster-empty" />
              )}
            </div>
            <div className="work-card-body">
              <div className="work-card-meta">
                <span>{project.category}</span>
                <span className={`maturity-badge maturity-${project.maturity}`}>
                  {maturityLabel[project.maturity]}
                </span>
              </div>
              <h3 className="work-card-name">{project.name}</h3>
              <p className="work-card-tagline">{project.tagline}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
