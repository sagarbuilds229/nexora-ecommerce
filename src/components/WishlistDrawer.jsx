import { useEffect } from 'react'
import {
  formatProductPrice,
  formatProductListPrice,
  formatINRFromINR,
  productSaleINR,
  hasDiscount,
} from '../utils/price'
import { ProductImage } from './ProductImage'
import './Drawer.css'

export function WishlistDrawer({ open, onClose, items, onRemove, onAddToCart, onClear }) {
  useEffect(() => {
    if (!open) return
    const onEsc = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onEsc)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const totalINR = items.reduce((sum, p) => sum + productSaleINR(p), 0)

  return (
    <div className="drawer" role="dialog" aria-modal="true" aria-label="Wishlist">
      <button className="drawer__overlay" onClick={onClose} aria-label="Close wishlist" />
      <div className="drawer__panel">
        <div className="drawer__head">
          <div>
            <h2>Wishlist</h2>
            <span>{items.length} {items.length === 1 ? 'item' : 'items'}</span>
          </div>
          <button className="drawer__close" onClick={onClose} aria-label="Close wishlist">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="drawer__empty">
            <div className="drawer__empty-icon">♥</div>
            <h3>Your wishlist is empty</h3>
            <p>Tap the heart on any product to save it for later.</p>
            <button className="drawer__cta" onClick={onClose}>Explore products</button>
          </div>
        ) : (
          <>
            <div className="drawer__list">
              {items.map((product) => (
                <div key={product.id} className="drawer__item">
                  <ProductImage product={product} alt={product.title} className="drawer__item-img" bare />
                  <div className="drawer__item-body">
                    <span className="drawer__item-brand">{product.brand || 'NEXORA'}</span>
                    <h4>{product.title}</h4>
                    <span className="drawer__item-price">
                      <b>{formatProductPrice(product)}</b>
                      {hasDiscount(product) && <span className="drawer__was">{formatProductListPrice(product)}</span>}
                    </span>
                    <div className="drawer__qty">
                      <button className="drawer__add" onClick={() => onAddToCart(product)} aria-label={`Add ${product.title} to cart`}>Add to cart</button>
                      <button className="drawer__remove" onClick={() => onRemove(product.id)} aria-label={`Remove ${product.title} from wishlist`}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="drawer__foot">
              <div className="drawer__subtotal">
                <span>Wishlist value</span>
                <b>{formatINRFromINR(totalINR)}</b>
              </div>
              <button className="drawer__clear" onClick={onClear}>Clear wishlist</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
