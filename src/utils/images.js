/**
 * Image helpers for catalog products.
 * Product imagery always comes from the API response — nothing is invented.
 */

/** Every real image URL the API returned for a product, best candidate first. */
export function getProductImageSources(product) {
  if (!product) return []
  const gallery = Array.isArray(product.images) ? product.images : []
  const sources = [product.thumbnail, ...gallery]
  return Array.from(new Set(sources.filter((src) => typeof src === 'string' && src.trim() !== '')))
}
