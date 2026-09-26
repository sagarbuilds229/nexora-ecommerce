import { useEffect, useState } from 'react'
import {
  formatProductPrice,
  formatProductListPrice,
  formatINRFromINR,
  formatShippingThreshold,
  productSaleINR,
  hasDiscount,
} from '../utils/price'
import { ProductImage } from './ProductImage'
import { getProductImageSources } from '../utils/images'
import './ProductModal.css'

export function ProductModal({ product, isWishlisted, onClose, onToggleWishlist, onAddToCart }) {
  const [activeImg, setActiveImg] = useState(0)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    if (!product) return
    setActiveImg(0)
    setQty(1)
    const onEsc = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onEsc)
      document.body.style.overflow = ''
    }
  }, [product, onClose])

  if (!product) return null

  const unitINR = productSaleINR(product)
  const images = getProductImageSources(product)
  const discounted = hasDiscount(product)

  const handleAdd = () => {
    onAddToCart?.(product, qty)
    onClose?.()
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={`${product.title} details`}>
      <button className="modal__backdrop" onClick={onClose} aria-label="Close product details" />
      <div className="modal__card">
        <button className="modal__close" onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>

        <div className="modal__media">
          <ProductImage
            product={product}
            src={images[activeImg]}
            alt={`${product.title} — image ${activeImg + 1}`}
            className="modal__img"
            loading="eager"
          />
          <span className="modal__cat">{product.category}</span>
          {discounted && <span className="modal__discount">−{Math.round(product.discountPercentage)}% OFF</span>}
          {images.length > 1 && (
            <div className="modal__thumbs">
              {images.slice(0, 6).map((img, i) => (
                <button
                  key={img}
                  type="button"
                  className={`modal__thumb ${i === activeImg ? 'modal__thumb--active' : ''}`}
                  onClick={() => setActiveImg(i)}
                  aria-label={`View image ${i + 1} of ${product.title}`}
                  aria-pressed={i === activeImg}
                >
                  <ProductImage product={product} src={img} alt="" className="modal__thumb-img" bare />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="modal__body">
          <span className="modal__brand">{product.brand || 'NEXORA Select'}</span>
          <h2 className="modal__title">{product.title}</h2>
          <div className="modal__rating" aria-label={`Rating ${product.rating}`}>
            <span className="modal__star">★</span> {product.rating?.toFixed(1)} <span className="modal__muted">• {product.stock} in stock • {product.brand || 'NEXORA Select'}</span>
            <span className="modal__stock">{product.availabilityStatus || (product.stock > 0 ? 'In stock' : 'Out of stock')}</span>
          </div>
          <p className="modal__desc">{product.description}</p>

          {product.dimensions && (
            <div className="modal__specs">
              <span>W: {product.dimensions.width} × H: {product.dimensions.height} × D: {product.dimensions.depth}</span>
              <span>Weight: {product.weight} • Warranty: {product.warrantyInformation || '—'} • SKU: {product.sku || '—'}</span>
            </div>
          )}

          <div className="modal__pricing">
            <div>
              <span className="modal__price">{formatProductPrice(product)}</span>
              {discounted && <span className="modal__was">{formatProductListPrice(product)}</span>}
              <span className="modal__vat">per unit</span>
            </div>
            <span className="modal__shipping">
              {product.shippingInformation || `Free shipping over ${formatShippingThreshold()}`}
            </span>
          </div>

          <div className="modal__qty">
            <span>Quantity</span>
            <div className="modal__qty-ctrl">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
              <span aria-live="polite">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">+</button>
            </div>
            <span className="modal__qty-total">{formatINRFromINR(unitINR * qty)} total</span>
          </div>

          <div className="modal__actions">
            <button className="modal__cta" onClick={handleAdd}>Add to cart • {formatINRFromINR(unitINR * qty)}</button>
            <button className={`modal__wish ${isWishlisted ? 'modal__wish--active' : ''}`} onClick={() => onToggleWishlist?.(product)} aria-label="Toggle wishlist">
              <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7"><path d="M12 21s-6.2-4.2-8.6-8.1A5.2 5.2 0 0 1 12 5.1a5.2 5.2 0 0 1 8.6 7.8C18.2 16.8 12 21 12 21z"/></svg>
              {isWishlisted ? 'Saved' : 'Save'}
            </button>
          </div>

          {product.reviews?.length > 0 && (
            <div className="modal__reviews">
              <h3>Reviews</h3>
              {product.reviews.slice(0,2).map((r,i)=>(
                <div key={i} className="modal__review">
                  <strong>{r.reviewerName}</strong> <span>★ {r.rating}</span>
                  <p>{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
