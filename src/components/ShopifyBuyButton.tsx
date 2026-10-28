import { track } from '../lib/analytics'
import { canBuyOnShopify, shopifyCheckoutUrl } from '../lib/shopify'

type ShopifyBuyButtonProps = {
  projectId: string
  projectName?: string
  /** visual variant */
  variant?: 'cta' | 'link'
  className?: string
  label?: string
}

export function ShopifyBuyButton({
  projectId,
  projectName,
  variant = 'cta',
  className = '',
  label = 'Buy on Shopify',
}: ShopifyBuyButtonProps) {
  if (!canBuyOnShopify(projectId)) return null

  const href = shopifyCheckoutUrl(projectId)
  if (!href) return null

  const classes =
    variant === 'link'
      ? `project-link project-link-pay ${className}`.trim()
      : `cta book-call-stripe ${className}`.trim()

  return (
    <a
      className={classes}
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={() =>
        track('shopify_buy', {
          projectId,
          projectName: projectName ?? '',
        })
      }
    >
      {label}
    </a>
  )
}
