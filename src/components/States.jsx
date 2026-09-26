import './States.css'

export function LoadingSkeleton({ count = 8 }) {
  return (
    <div className="skeleton-grid" aria-label="Loading products" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card" style={{ animationDelay: `${i * 55}ms` }}>
          <div className="skeleton-img shimmer" />
          <div className="skeleton-body">
            <div className="skeleton-line" style={{ width: '58%' }} />
            <div className="skeleton-line skeleton-line--title" />
            <div className="skeleton-line skeleton-line--desc" />
            <div className="skeleton-line skeleton-line--desc" style={{ width: '72%' }} />
            <div className="skeleton-foot">
              <div className="skeleton-line" style={{ width: '94px', height: '20px' }} />
              <div className="skeleton-circle" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ErrorState({ title, description, message, onRetry, retryLabel = 'Try Again' }) {
  return (
    <div className="state state--error" role="alert">
      <div className="state__icon state__icon--error">⚠</div>
      <h3>{title || 'Unable to load products'}</h3>
      <p>{description || `Our catalog is temporarily unreachable. ${message ? `(${message})` : 'Please check your connection and try again.'}`}</p>
      {onRetry && (
        <button type="button" className="state__cta" onClick={onRetry}>{retryLabel}</button>
      )}
    </div>
  )
}

export function EmptyState({ query, searchActive = false, category, onClearSearch, onClearCategory }) {
  const hasCategory = Boolean(category && category !== 'all')

  return (
    <div className="state state--empty" role="status">
      <div className="state__icon">◍</div>
      <h3>No products found</h3>
      <p>
        {searchActive
          ? `The API returned no matches for “${query}”. Try another product, brand, or category.`
          : 'Try another product, brand, or category.'}
      </p>
      <div className="state__actions">
        {searchActive && onClearSearch && (
          <button type="button" className="state__cta" onClick={onClearSearch}>Clear Search</button>
        )}
        {hasCategory && onClearCategory && (
          <button type="button" className="state__cta state__cta--ghost" onClick={onClearCategory}>
            View all products
          </button>
        )}
      </div>
    </div>
  )
}
