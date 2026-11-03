import { DISCORD_INVITE } from '../lib/site-config'
import { track } from '../lib/analytics'
import { ideaFromSelection, requestBuild } from '../lib/store-events'
import { ShopifyProductLink } from './ShopifyProductLink'

type BookCallProps = {
  projectName?: string | null
  projectId?: string | null
}

export function BookCall({ projectName, projectId }: BookCallProps) {
  return (
    <div className="book-call">
      <h3>Talk with Christos</h3>
      <p>
        Recruiting, collaboration, or a walkthrough of these builds — Discord for
        a live chat, or the form below.
      </p>
      <div className="book-call-actions">
        <a
          className="cta"
          href={DISCORD_INVITE}
          target="_blank"
          rel="noreferrer"
          onClick={() => track('book_discord', { projectName: projectName ?? '' })}
        >
          Message on Discord
        </a>
        {projectId ? (
          <ShopifyProductLink
            projectId={projectId}
            projectName={projectName ?? undefined}
            variant="cta"
          />
        ) : null}
        <button
          type="button"
          className="cta cta-secondary"
          onClick={() => {
            track('book_inquire', { projectName: projectName ?? '' })
            requestBuild({
              idea:
                ideaFromSelection({ projectName }) ||
                "I'd like to talk about working together.\n",
            })
          }}
        >
          Use contact form
        </button>
      </div>
    </div>
  )
}
