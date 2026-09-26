import { ProductCard } from './ProductCard'
import './ProductGrid.css'

export function ProductGrid({ products, wishlistIds, onToggleWishlist, onAddToCart, onView, addedId }) {
  return (
    <div className="product-grid" role="list">
      {products.map((p, i) => (
        <div key={p.id} role="listitem" className="product-grid__item">
          <ProductCard
            product={p}
            index={i}
            isWishlisted={wishlistIds.has(p.id)}
            onToggleWishlist={onToggleWishlist}
            onAddToCart={onAddToCart}
            onView={onView}
            addedFlash={addedId === p.id}
          />
        </div>
      ))}
    </div>
  )
}
