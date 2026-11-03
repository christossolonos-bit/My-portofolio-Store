import { type Project } from '../data/projects'
import { track } from '../lib/analytics'

type ProjectCatalogProps = {
  projects: Project[]
  onOpen: (id: string) => void
}

export function ProjectCatalog({ projects, onOpen }: ProjectCatalogProps) {
  return (
    <section className="work" id="work">
      <div className="work-grid">
        {projects.map((project) => (
          <button
            key={project.id}
            type="button"
            className="work-card"
            style={{ ['--accent' as string]: project.accent }}
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
              <h3 className="work-card-name">{project.name}</h3>
              <p className="work-card-tagline">{project.tagline}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
