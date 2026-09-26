import { useEffect } from 'react'
import { productSaleINR, formatINRFromINR, formatShippingThreshold } from '../utils/price'
import { ProductImage } from './ProductImage'
import './Drawer.css'

export function CartDrawer({ open, onClose, cart, onInc, onDec, onRemove, onClear, onCheckout }) {
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

  const items = Array.from(cart.values())
  const subtotalINR = items.reduce((sum, { product, qty }) => sum + productSaleINR(product) * qty, 0)
  const totalCount = items.reduce((s, { qty }) => s + qty, 0)

  return (
    <div className="drawer" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <button className="drawer__overlay" onClick={onClose} aria-label="Close cart" />
      <div className="drawer__panel">
        <div className="drawer__head">
          <div>
            <h2>Cart</h2>
            <span>{totalCount} {totalCount === 1 ? 'item' : 'items'}</span>
          </div>
          <button className="drawer__close" onClick={onClose} aria-label="Close cart">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="drawer__empty">
            <div className="drawer__empty-icon">◈</div>
            <h3>Your cart is empty</h3>
            <p>Add products to see them here. Your picks will stay saved.</p>
            <button className="drawer__cta" onClick={onClose}>Continue shopping</button>
          </div>
        ) : (
          <>
            <div className="drawer__list">
              {items.map(({ product, qty }) => {
                const priceINR = productSaleINR(product)
                return (
                  <div key={product.id} className="drawer__item">
                    <ProductImage product={product} alt={product.title} className="drawer__item-img" bare />
                    <div className="drawer__item-body">
                      <span className="drawer__item-brand">{product.brand || 'NEXORA'}</span>
                      <h4>{product.title}</h4>
                      <span className="drawer__item-price">{formatINRFromINR(priceINR)} × {qty} = <b>{formatINRFromINR(priceINR * qty)}</b></span>
                      <div className="drawer__qty">
                        <button onClick={() => onDec(product.id)} aria-label={`Decrease ${product.title} quantity`}>−</button>
                        <span aria-live="polite">{qty}</span>
                        <button onClick={() => onInc(product.id)} aria-label={`Increase ${product.title} quantity`}>+</button>
                        <button className="drawer__remove" onClick={() => onRemove(product.id)} aria-label={`Remove ${product.title}`}>Remove</button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="drawer__foot">
              <div className="drawer__subtotal">
                <span>Subtotal</span>
                <b>{formatINRFromINR(subtotalINR)}</b>
              </div>
              <p className="drawer__hint">Free shipping over {formatShippingThreshold()} • Demo checkout — no payment is processed</p>
              <button className="drawer__checkout" onClick={onCheckout}>Checkout • {formatINRFromINR(subtotalINR)}</button>
              <button className="drawer__clear" onClick={onClear}>Clear cart</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
