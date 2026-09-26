import {
  formatProductPrice,
  formatProductListPrice,
  productSavingsINR,
  formatINRFromINR,
  hasDiscount,
} from '../utils/price'
import { ProductImage } from './ProductImage'
import './ProductCard.css'

export function ProductCard({ product, isWishlisted, onToggleWishlist, onAddToCart, onView, index = 0, addedFlash = false }) {
  const discounted = hasDiscount(product)
  const price = formatProductPrice(product)
  const listPrice = formatProductListPrice(product)
  const savings = formatINRFromINR(productSavingsINR(product))

  return (
    <article
      className="p-card hover-lift"
      style={{ animationDelay: `${Math.min(index * 45, 360)}ms` }}
    >
      <div className="p-card__media" onClick={() => onView?.(product)} role="button" tabIndex={0} onKeyDown={(e)=> e.key==='Enter' && onView?.(product)} aria-label={`View ${product.title} details`}>
        <ProductImage
          product={product}
          alt={product.title}
          className="p-card__img"
          sizes="(max-width: 560px) 50vw, (max-width: 1100px) 33vw, 25vw"
        />
        <div className="p-card__top">
          <span className="p-card__cat">{product.category}</span>
          <button
            type="button"
            className={`p-card__wish ${isWishlisted ? 'p-card__wish--active' : ''}`}
            onClick={(e) => { e.stopPropagation(); onToggleWishlist?.(product) }}
            aria-label={isWishlisted ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
            aria-pressed={isWishlisted}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7" aria-hidden>
              <path d="M12 21s-6.2-4.2-8.6-8.1A5.2 5.2 0 0 1 12 5.1a5.2 5.2 0 0 1 8.6 7.8C18.2 16.8 12 21 12 21z" />
            </svg>
          </button>
        </div>
        {discounted && (
          <span className="p-card__discount">−{Math.round(product.discountPercentage)}%</span>
        )}
        <span className="p-card__rating" aria-label={`Rating ${product.rating} out of 5`}>
          <span className="p-card__star">★</span> {product.rating?.toFixed ? product.rating.toFixed(1) : product.rating}
          <span className="p-card__rating-count">({product.reviews?.length ?? product.stock ?? 0})</span>
        </span>
      </div>

      <div className="p-card__body">
        <span className="p-card__brand">{product.brand || 'NEXORA Select'}</span>
        <h3 className="p-card__title" title={product.title}>{product.title}</h3>
        <p className="p-card__desc">{product.description}</p>

        <div className="p-card__pricing">
          <div className="p-card__price">
            <span className="p-card__price-now">{price}</span>
            {discounted && <span className="p-card__price-was">{listPrice}</span>}
          </div>
          {discounted && <span className="p-card__save">Save {savings}</span>}
        </div>
      </div>

      <div className="p-card__foot">
        <button
          type="button"
          className={`p-card__cta ${addedFlash ? 'p-card__cta--added' : ''}`}
          onClick={() => onAddToCart?.(product)}
          aria-label={`Add ${product.title} to cart`}
        >
          <span className="p-card__cta-icon" aria-hidden>
            {addedFlash ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M6 7h12l-1 9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 7Z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></svg>
            )}
          </span>
          <span>{addedFlash ? 'Added ✓' : 'Add to cart'}</span>
        </button>
        <button type="button" className="p-card__view" onClick={() => onView?.(product)} aria-label={`View ${product.title} details`}>
          View
        </button>
      </div>
    </article>
  )
}
