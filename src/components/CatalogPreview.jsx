import './CatalogPreview.css'

export function CatalogPreview() {
  return (
    <section id="catalog-preview" className="catalog-preview">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="section-kicker">— Curated Catalog</span>
            <h2 className="section-title">Designed for the <span className="gradient-text">next generation</span></h2>
            <p className="section-desc">Live products from DummyJSON API. Search, filter and sort — coming in Phase 2.</p>
          </div>
          <div className="section-head-actions">
            <span className="live-pill"><span className="live-dot" /> API connected</span>
          </div>
        </div>

        {/* Filter bar skeleton */}
        <div className="filter-bar">
          <div className="filter-bar__search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="11" cy="11" r="7"/><path d="M20 20L16.65 16.65"/></svg>
            <span>Search products…</span>
          </div>
          <div className="filter-bar__pills">
            <span className="pill pill--active">All</span>
            <span className="pill">Beauty</span>
            <span className="pill">Fragrances</span>
            <span className="pill">Furniture</span>
            <span className="pill">Groceries</span>
          </div>
          <div className="filter-bar__sort">Price: Low to High ▾</div>
        </div>

        {/* Grid skeleton */}
        <div className="preview-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="preview-card" style={{ animationDelay: `${i * 70}ms` }}>
              <div className="preview-card__img shimmer" />
              <div className="preview-card__body">
                <div className="shimmer-line" style={{ width: '70%' }} />
                <div className="shimmer-line shimmer-line--sm" style={{ width: '45%' }} />
                <div className="preview-card__foot">
                  <div className="shimmer-line" style={{ width: '60px', height: '20px' }} />
                  <div className="shimmer-circle" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="preview-notice glass">
          <div className="preview-notice__icon">✦</div>
          <div>
            <strong>Phase 1 — Foundation Complete</strong>
            <p>Product grid will hydrate from <code>https://dummyjson.com/products</code> with search, category filtering, sorting, wishlist, cart and product details in the next iteration.</p>
          </div>
          <span className="preview-notice__badge">Next: Catalog Engine</span>
        </div>
      </div>
    </section>
  )
}
