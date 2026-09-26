import { useMemo } from 'react'
import { SearchBar } from './SearchBar'
import { CategoryFilter } from './CategoryFilter'
import { SortSelect } from './SortSelect'
import { ProductGrid } from './ProductGrid'
import { LoadingSkeleton, EmptyState, ErrorState } from './States'
import { MIN_SEARCH_CHARS } from '../hooks/useProductSearch'
import './Catalog.css'

export function Catalog({
  products,
  allProducts,
  loading,
  error,
  onRetry,
  search,
  onSearchChange,
  searchActive = false,
  searchLoading = false,
  searchError = null,
  onRetrySearch,
  searchTooShort = false,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onView,
  addedId,
}) {
  const categories = useMemo(() => {
    const source = allProducts && allProducts.length ? allProducts : products
    const cats = new Set(source.map((p) => p.category).filter(Boolean))
    return ['all', ...Array.from(cats).sort()]
  }, [products, allProducts])

  const total = products.length
  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`

  const countText = loading
    ? 'Loading catalog…'
    : searchLoading
      ? 'Searching the API…'
      : searchActive
        ? `${plural(total, 'result')} for “${search.trim()}”`
        : searchTooShort
          ? `Type ${MIN_SEARCH_CHARS}+ characters to search`
          : `Showing ${plural(total, 'product')}`

  const showGrid = total > 0
  const searching = searchLoading && showGrid && !error

  return (
    <section id="catalog" className="catalog">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="section-kicker">— Curated Catalog</span>
            <h2 className="section-title">Designed for the <span className="gradient-text">next generation</span></h2>
            <p className="section-desc">Hand-picked essentials, live from the DummyJSON collection. Search, filter and sort — all premium, all smooth.</p>
          </div>
          <div className="section-head-actions">
            <span className="live-pill"><span className="live-dot" /> Live inventory</span>
          </div>
        </div>

        {/* Controls */}
        <div className="catalog__controls">
          <SearchBar value={search} onChange={onSearchChange} loading={searchLoading} />
          <SortSelect value={sort} onChange={onSortChange} />
        </div>

        <div className="catalog__filters">
          <CategoryFilter categories={categories} selected={category} onSelect={onCategoryChange} />
          <span className="catalog__count" aria-live="polite">
            {countText}
          </span>
        </div>

        {/* Content states */}
        {loading ? (
          <LoadingSkeleton count={8} />
        ) : error ? (
          <ErrorState message={error} onRetry={onRetry} />
        ) : searchActive && searchError ? (
          <ErrorState
            title="Unable to search products"
            description="Please check your connection and try again."
            onRetry={onRetrySearch}
            retryLabel="Try Again"
          />
        ) : showGrid ? (
          <div className={`catalog__grid-wrap ${searching ? 'catalog__grid-wrap--searching' : ''}`.trim()}>
            <ProductGrid
              products={products}
              wishlistIds={wishlistIds}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}
              onView={onView}
              addedId={addedId}
            />
          </div>
        ) : searchLoading ? (
          <LoadingSkeleton count={8} />
        ) : (
          <EmptyState
            query={search.trim()}
            searchActive={searchActive}
            category={category}
            onClearSearch={() => onSearchChange('')}
            onClearCategory={() => onCategoryChange('all')}
          />
        )}
      </div>
    </section>
  )
}
