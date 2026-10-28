import { track } from '../lib/analytics'
import {
  getShopifyHandle,
  isShopifyConfigured,
  shopifyProductUrl,
} from '../lib/shopify'

type ShopifyProductLinkProps = {
  projectId: string
  projectName?: string
  className?: string
  /** `link` = project footer; `cta` = contact section */
  variant?: 'link' | 'cta'
}

export function ShopifyProductLink({
  projectId,
  projectName,
  className = '',
  variant = 'link',
}: ShopifyProductLinkProps) {
  if (!isShopifyConfigured()) return null

  const href = shopifyProductUrl(projectId)
  const hasProduct = Boolean(getShopifyHandle(projectId))
  const label = hasProduct ? 'View on Shopify' : 'Open Shopify'
  const classes =
    variant === 'cta'
      ? `cta cta-secondary ${className}`.trim()
      : `project-link project-link-shopify ${className}`.trim()

  return (
    <a
      className={classes}
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={() =>
        track('shopify_product_link', {
          projectId,
          projectName: projectName ?? '',
          hasProduct,
        })
      }
    >
      {label}
    </a>
  )
}
