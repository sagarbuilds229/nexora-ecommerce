import { useMemo, useState } from 'react'
import { getProductImageSources } from '../utils/images'
import './ProductImage.css'

/**
 * Renders the actual product photo served by the API. If a URL fails it moves
 * on to the next real image, and only when none can be loaded does it show a
 * neutral "image unavailable" state — never an invented product picture.
 *
 * `src` can pin a specific gallery image; the remaining API images are still
 * used as fallbacks if that one fails.
 */
export function ProductImage({ product, src, alt, className = '', loading = 'lazy', bare = false, sizes }) {
  const sources = useMemo(() => {
    const pinned = typeof src === 'string' && src.trim() !== '' ? [src] : []
    return Array.from(new Set([...pinned, ...getProductImageSources(product)]))
  }, [product, src])

  const [active, setActive] = useState({ sources, index: 0 })
  if (active.sources !== sources) {
    setActive({ sources, index: 0 })
  }
  const current = sources[active.index]

  if (!current) {
    return (
      <span className={`p-img-fallback ${bare ? 'p-img-fallback--bare' : ''} ${className}`.trim()}
            role="img" aria-label={`${alt || 'Product'} — image unavailable`}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <rect x="3" y="4" width="18" height="16" rx="3" />
          <path d="M3 16l4.5-4.5a2 2 0 0 1 2.8 0L15 16" />
          <circle cx="8.5" cy="9" r="1.4" />
        </svg>
        <span>Image unavailable</span>
      </span>
    )
  }

  return (
    <img
      className={className}
      src={current}
      alt={alt || product?.title || 'Product image'}
      loading={loading}
      decoding="async"
      sizes={sizes}
      onError={() => setActive((state) => ({ ...state, index: state.index + 1 }))}
    />
  )
}
