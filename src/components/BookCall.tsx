import { DISCORD_INVITE } from '../lib/site-config'
import { track } from '../lib/analytics'
import { ideaFromSelection, requestBuild } from '../lib/store-events'
import {
  canBuyOnShopify,
  isShopifyConfigured,
  SHOPIFY_STORE_URL,
  shopifyProductsReadyCount,
} from '../lib/shopify'
import { ShopifyBuyButton } from './ShopifyBuyButton'
import { ShopifyProductLink } from './ShopifyProductLink'

type BookCallProps = {
  projectName?: string | null
  projectId?: string | null
}

export function BookCall({ projectName, projectId }: BookCallProps) {
  const shopifyReady = isShopifyConfigured()
  const canBuy = projectId ? canBuyOnShopify(projectId) : false
  const mapped = shopifyProductsReadyCount()

  return (
    <div className="book-call">
      <h3>Book a live call{shopifyReady ? ' or buy' : ''}</h3>
      <p>
        Prefer a walkthrough? Jump into Discord. Ready to start? Send the form
        below, or open the Shopify store for product pages
        {canBuy ? ' and checkout' : ''}.
      </p>
      <div className="book-call-actions">
        <a
          className="cta"
          href={DISCORD_INVITE}
          target="_blank"
          rel="noreferrer"
          onClick={() => track('book_discord', { projectName: projectName ?? '' })}
        >
          Book via Discord
        </a>
        {projectId ? (
          <ShopifyProductLink
            projectId={projectId}
            projectName={projectName ?? undefined}
            variant="cta"
          />
        ) : (
          <a
            className="cta cta-secondary"
            href={SHOPIFY_STORE_URL}
            target="_blank"
            rel="noreferrer"
            onClick={() => track('shopify_store_open', {})}
          >
            Open Shopify
          </a>
        )}
        {canBuy && projectId ? (
          <ShopifyBuyButton
            projectId={projectId}
            projectName={projectName ?? undefined}
            variant="cta"
            label={projectName ? `Buy ${projectName}` : 'Buy on Shopify'}
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
                "I'd like to talk about a build.\n",
            })
          }}
        >
          Use contact form
        </button>
      </div>
      {shopifyReady && mapped === 0 ? (
        <p className="book-call-hint">
          Store:{' '}
          <a href={SHOPIFY_STORE_URL} target="_blank" rel="noreferrer">
            {SHOPIFY_STORE_URL}
          </a>
          . Add product handles in <code>VITE_SHOPIFY_HANDLES</code> to deep-link
          each build.
        </p>
      ) : null}
    </div>
  )
}
