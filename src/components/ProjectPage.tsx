import { maturityLabel, type Project } from '../data/projects'
import { track } from '../lib/analytics'
import { SITE_URL } from '../lib/site-config'
import { ideaFromSelection, requestBuild } from '../lib/store-events'
import { ShopifyProductLink } from './ShopifyProductLink'
import { ProjectVideo } from './ProjectVideo'

type ProjectPageProps = {
  project: Project
  onBack: () => void
}

export function ProjectPage({ project, onBack }: ProjectPageProps) {
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
          title: `${project.name} · Solonaras Portfolio`,
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
      className="product-page"
      id={project.id}
      style={{ ['--accent' as string]: project.accent }}
    >
      <div className="product-page-bar">
        <button type="button" className="ghost-link" onClick={onBack}>
          ← All projects
        </button>
        <span className="product-page-crumb">{project.category}</span>
      </div>

      <div className="product-page-layout">
        <div className="product-page-media">
          <ProjectVideo
            youtubeId={project.youtubeId}
            videoSrc={project.videoSrc}
            posterSrc={project.posterSrc}
            title={project.videoTitle}
            accent={project.accent}
            active
          />
        </div>

        <div className="product-page-copy">
          <div className="project-meta">
            <span className={`maturity-badge maturity-${project.maturity}`}>
              {maturityLabel[project.maturity]}
            </span>
            <span className="project-category">{project.category}</span>
          </div>
          <h1 className="product-page-title">{project.name}</h1>
          <p className="project-tagline">{project.tagline}</p>
          <p className="project-desc">{project.description}</p>
          {project.narration ? (
            <p className="project-narration">{project.narration}</p>
          ) : null}
          <p className="project-scope">{project.priceNote}</p>
          <ul className="project-includes">
            {project.includes.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <div className="product-page-actions">
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
        </div>
      </div>
    </section>
  )
}
