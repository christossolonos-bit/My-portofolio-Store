import type { Project } from '../data/projects'

type ProgressNavProps = {
  projects: Project[]
  activeId: string | null
  progress: number
}

export function ProgressNav({ projects, activeId, progress }: ProgressNavProps) {
  return (
    <nav className="progress-nav" aria-label="Project progress">
      <div className="progress-track">
        <div className="progress-fill" style={{ height: `${progress * 100}%` }} />
      </div>
      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            <a
              href={`#${p.id}`}
              className={activeId === p.id ? 'is-active' : ''}
              title={p.name}
              style={{ ['--dot' as string]: p.accent }}
            >
              <span className="sr-only">{p.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
