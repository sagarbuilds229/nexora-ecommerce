import { Button } from './Button'
import { ProductImage } from './ProductImage'
import {
  formatProductPrice,
  formatINRFromINR,
  productSavingsINR,
  formatShippingThreshold,
} from '../utils/price'
import './Hero.css'

export function Hero({
  product,
  promo,
  catalogCount = 0,
  categoryCount = 0,
  brandCount = 0,
  onExplore,
  onNewDrops,
  onAddToCart,
}) {
  const promoPrice = promo ? formatProductPrice(promo) : '—'
  const promoSavings = promo ? productSavingsINR(promo) : 0
  const productMeta = product
    ? [product.brand, `★ ${product.rating?.toFixed?.(1) ?? product.rating}`, `${product.stock} in stock`]
        .filter(Boolean)
        .join('  •  ')
    : 'Live catalog data from the product API'

  return (
    <section className="hero">
      {/* Ambient orbs */}
      <div className="hero__orbs" aria-hidden>
        <div className="orb orb--violet" />
        <div className="orb orb--cyan" />
        <div className="orb orb--teal" />
        <div className="hero__grid" />
      </div>

      <div className="container hero__inner">
        {/* Left copy */}
        <div className="hero__copy">
          <div className="hero__eyebrow animate-fadeIn" style={{ animationDelay: '0.05s' }}>
            <span className="hero__eyebrow-dot" />
            <span>{catalogCount ? `${catalogCount} products` : 'Live catalog'} — straight from the API</span>
            <span className="hero__eyebrow-pill">Dynamic</span>
          </div>

          <h1 className="hero__title">
            <span className="hero__title-line animate-fadeInUp" style={{ animationDelay: '0.12s' }}>The Future</span>
            <span className="hero__title-line hero__title-line--gradient animate-fadeInUp" style={{ animationDelay: '0.22s' }}>of Shopping</span>
            <span className="hero__title-line animate-fadeInUp" style={{ animationDelay: '0.32s' }}>is Here.</span>
          </h1>

          <p className="hero__desc animate-fadeInUp" style={{ animationDelay: '0.42s' }}>
            Experience NEXORA — a curated universe of next-gen technology,
            refined essentials and collectible design. Crafted for those who shop ahead of time.
          </p>

          <div className="hero__ctas animate-fadeInUp" style={{ animationDelay: '0.52s' }}>
            <Button
              size="lg"
              onClick={onExplore}
              iconRight={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              }
            >
              Explore Catalog
            </Button>
            <Button variant="secondary" size="lg" onClick={onNewDrops}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              View Lookbook
            </Button>
          </div>

          {/* Truthful application facts */}
          <div className="hero__meta animate-fadeIn" style={{ animationDelay: '0.62s' }}>
            <div className="hero__meta-live">
              <span className="hero__meta-live-dot" />
              <span>Live API data</span>
            </div>
            <div className="hero__meta-divider" />
            <div className="hero__meta-stats">
              <span><b>{catalogCount || '—'}</b> products</span>
              <span><b>{categoryCount || '—'}</b> categories</span>
              <span><b>{brandCount || '—'}</b> brands</span>
            </div>
          </div>

          {/* Statement bar */}
          <div className="hero__trust animate-fadeIn" style={{ animationDelay: '0.72s' }}>
            <span className="hero__trust-label">BUILT FOR THE NEXT GENERATION</span>
            <span className="hero__trust-logos">
              <span>DISCOVER</span><span>•</span><span>EXPLORE</span><span>•</span><span>SHOP</span>
            </span>
          </div>
        </div>

        {/* Right visual */}
        <div className="hero__visual animate-scaleIn" style={{ animationDelay: '0.25s' }}>
          <div className="hero__device-wrap">
            {/* Main glass card — real product from the API */}
            <div className="hero__card hero__card--main">
              <div className="hero__card-top">
                <span className="hero__badge">{product?.category ? product.category : 'NEXORA'}</span>
                <span className="hero__price">{product ? formatProductPrice(product) : '—'}</span>
              </div>
              <div className="hero__product-img">
                <div className="hero__product-glow" />
                <ProductImage
                  product={product}
                  alt={product?.title || 'Featured product'}
                  className="hero__product-photo"
                  loading="eager"
                  sizes="420px"
                />
              </div>
              <div className="hero__card-bottom">
                <div className="hero__card-info">
                  <h3 title={product?.title}>{product?.title || 'Loading catalog…'}</h3>
                  <p>{productMeta}</p>
                </div>
                <button
                  className="hero__add"
                  aria-label={product ? `Add ${product.title} to cart` : 'Add to cart'}
                  onClick={() => product && onAddToCart?.(product)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 5v14M5 12h14"/></svg>
                </button>
              </div>
            </div>

            {/* Shipping chip */}
            <div className="hero__card hero__card--mini hero__card--mini-1">
              <div className="hero__mini-icon">◈</div>
              <div>
                <strong>Free shipping</strong>
                <span>On orders over {formatShippingThreshold()}</span>
              </div>
              <span className="hero__mini-check">✓</span>
            </div>

            {/* Promotional card — real product, INR only */}
            <div className="hero__card hero__promo">
              <div className="hero__promo-thumb">
                <ProductImage product={promo} alt={promo?.title || 'Special price product'} className="hero__promo-img" loading="lazy" bare />
              </div>
              <div className="hero__promo-text">
                <span className="hero__promo-label">SPECIAL PRICE</span>
                <span className="hero__promo-price">{promoPrice}</span>
                {promoSavings > 0 ? (
                  <span className="hero__promo-save">Save {formatINRFromINR(promoSavings)}</span>
                ) : (
                  promo && <span className="hero__promo-name" title={promo.title}>{promo.title}</span>
                )}
              </div>
            </div>

            {/* Real spec pill */}
            <div className="hero__spec">
              <span className="hero__spec-dot" />
              <span className="hero__spec-text">
                {product ? `${product.availabilityStatus || 'In stock'} • ${product.warrantyInformation || 'Standard warranty'}` : 'Waiting for API response'}
              </span>
            </div>
          </div>

          {/* Background halo */}
          <div className="hero__halo" aria-hidden />
        </div>
      </div>
    </section>
  )
}
