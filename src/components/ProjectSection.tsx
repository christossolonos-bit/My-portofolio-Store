import { maturityLabel, type Project } from '../data/projects'
import { track } from '../lib/analytics'
import { SITE_URL } from '../lib/site-config'
import { ideaFromSelection, requestBuild } from '../lib/store-events'
import { ShopifyProductLink } from './ShopifyProductLink'
import { ProjectVideo } from './ProjectVideo'

type ProjectSectionProps = {
  project: Project
  index: number
  active: boolean
}

export function ProjectSection({
  project,
  index,
  active,
}: ProjectSectionProps) {
  const number = String(index + 1).padStart(2, '0')

  const onRequest = () => {
    track('request_build', { projectId: project.id })
    requestBuild({
      projectId: project.id,
      idea: ideaFromSelection({ projectName: project.name }),
    })
  }

  const onShare = async () => {
    const url = `${SITE_URL}/#${project.id}`
    track('share_project', { projectId: project.id })
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${project.name} · Solonaras`,
          text: project.tagline,
          url,
        })
        return
      }
      await navigator.clipboard.writeText(url)
    } catch {
      await navigator.clipboard.writeText(url).catch(() => undefined)
    }
  }

  return (
    <section
      className={`project project-video-first ${active ? 'is-active' : ''}`}
      id={project.id}
      style={{ ['--accent' as string]: project.accent }}
    >
      <ProjectVideo
        youtubeId={project.youtubeId}
        videoSrc={project.videoSrc}
        posterSrc={project.posterSrc}
        title={project.videoTitle}
        accent={project.accent}
        active={active}
      />

      <div className="project-inner">
        <div className="project-meta">
          <span className="project-index">{number}</span>
          <span className="project-category">{project.category}</span>
          <span className={`maturity-badge maturity-${project.maturity}`}>
            {maturityLabel[project.maturity]}
          </span>
        </div>
        <h2 className="project-name">{project.name}</h2>
        <p className="project-tagline">{project.tagline}</p>

        <div className="project-footer">
          <button type="button" className="cta" onClick={onRequest}>
            Discuss this build
          </button>
          <ShopifyProductLink
            projectId={project.id}
            projectName={project.name}
          />
          <button
            type="button"
            className="project-link"
            onClick={() => void onShare()}
          >
            Share
          </button>
        </div>

        <details className="project-details">
          <summary>Details</summary>
          <p className="project-desc">{project.description}</p>
          <p className="project-scope">{project.priceNote}</p>
          <ul className="project-includes">
            {project.includes.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <div className="project-chips">
            <span>{project.capability}</span>
          </div>
        </details>
      </div>
    </section>
  )
}
