import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Catalog } from './components/Catalog'
import { ProductModal } from './components/ProductModal'
import { CartDrawer } from './components/CartDrawer'
import { WishlistDrawer } from './components/WishlistDrawer'
import { CheckoutModal } from './components/CheckoutModal'
import { ToastContainer } from './components/Toast'
import { Footer } from './components/Footer'
import { useProducts } from './hooks/useProducts'
import { useProductSearch } from './hooks/useProductSearch'
import { formatProductPrice, formatINRFromINR, productSaleINR } from './utils/price'
import './App.css'

function App() {
  const { products: allProducts, loading, error, retry } = useProducts()

  // Search / filter / sort
  const [search, setSearch] = useState('')
  const searchState = useProductSearch(search)
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('featured')

  // Wishlist & Cart - with localStorage persistence
  const [wishlist, setWishlist] = useState(() => {
    try {
      const raw = localStorage.getItem('nexora_wishlist')
      return raw ? new Set(JSON.parse(raw)) : new Set()
    } catch { return new Set() }
  })
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem('nexora_cart')
      if (!raw) return new Map()
      const arr = JSON.parse(raw) // [[id, {product, qty}], ...]
      return new Map(arr)
    } catch { return new Map() }
  })
  const [addedId, setAddedId] = useState(null)
  const [selected, setSelected] = useState(null)

  // Drawers & toasts
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [toasts, setToasts] = useState([])
  const toastId = useRef(0)

  const showToast = useCallback((message, type = 'default') => {
    const id = ++toastId.current
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600)
  }, [])
  const dismissToast = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), [])

  // Persist
  useEffect(() => {
    try { localStorage.setItem('nexora_wishlist', JSON.stringify([...wishlist])) } catch {}
  }, [wishlist])
  useEffect(() => {
    try { localStorage.setItem('nexora_cart', JSON.stringify([...cart])) } catch {}
  }, [cart])

  // Catalog facts (all derived from the live API response)
  const catalogCount = allProducts.length
  const categoryCount = useMemo(
    () => new Set(allProducts.map((p) => p.category).filter(Boolean)).size,
    [allProducts]
  )
  const brandCount = useMemo(
    () => new Set(allProducts.map((p) => p.brand).filter(Boolean)).size,
    [allProducts]
  )

  // Hero picks — real products, computed from the catalog
  const { heroProduct, promoProduct } = useMemo(() => {
    const withImages = allProducts.filter((p) => p.thumbnail || p.images?.length)
    if (!withImages.length) return { heroProduct: null, promoProduct: null }

    const hero = withImages.reduce((best, p) =>
      (p.rating || 0) > (best.rating || 0) ? p : best
    )
    const discounted = withImages
      .filter((p) => (p.discountPercentage || 0) > 0.5)
      .sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0))

    const promo = discounted.find((p) => p.id !== hero.id) || discounted[0] || hero
    return { heroProduct: hero, promoProduct: promo }
  }, [allProducts])

  // Visible list: API search results while searching, full catalog otherwise
  const filteredSorted = useMemo(() => {
    const base = searchState.active ? searchState.results : allProducts
    let list = [...base]
    if (category !== 'all') {
      list = list.filter((p) => p.category === category)
    }
    switch (sort) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break
      case 'price-desc': list.sort((a, b) => b.price - a.price); break
      case 'rating-desc': list.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break
      case 'name-asc': list.sort((a, b) => a.title.localeCompare(b.title)); break
      default: break
    }
    return list
  }, [allProducts, searchState.active, searchState.results, category, sort])

  const scrollToCatalog = () => {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSearchChange = (val) => setSearch(val)
  const handleNavbarSearch = () => scrollToCatalog()

  const toggleWishlist = useCallback((product) => {
    setWishlist((prev) => {
      const next = new Set(prev)
      const exists = next.has(product.id)
      if (exists) {
        next.delete(product.id)
        showToast(`${product.title} removed from wishlist`, 'default')
      } else {
        next.add(product.id)
        showToast(`${product.title} added to wishlist`, 'wishlist')
      }
      return next
    })
  }, [showToast])

  const addToCart = useCallback((product, qty = 1) => {
    setCart((prev) => {
      const next = new Map(prev)
      const existing = next.get(product.id)
      if (existing) next.set(product.id, { product, qty: existing.qty + qty })
      else next.set(product.id, { product, qty })
      return next
    })
    setAddedId(product.id)
    setTimeout(() => setAddedId((cur) => (cur === product.id ? null : cur)), 1400)
    showToast(`${product.title} added • ${formatProductPrice(product)}`, 'success')
  }, [showToast])

  const cartInc = (id) => {
    setCart((prev) => {
      const next = new Map(prev)
      const entry = next.get(id)
      if (entry) next.set(id, { ...entry, qty: entry.qty + 1 })
      return next
    })
  }
  const cartDec = (id) => {
    setCart((prev) => {
      const next = new Map(prev)
      const entry = next.get(id)
      if (!entry) return next
      if (entry.qty <= 1) {
        next.delete(id)
        showToast(`${entry.product.title} removed from cart`, 'default')
      } else {
        next.set(id, { ...entry, qty: entry.qty - 1 })
      }
      return next
    })
  }
  const cartRemove = (id) => {
    setCart((prev) => {
      const next = new Map(prev)
      const entry = next.get(id)
      if (entry) showToast(`${entry.product.title} removed from cart`, 'default')
      next.delete(id)
      return next
    })
  }
  const cartClear = () => {
    if (cart.size === 0) return
    setCart(new Map())
    showToast('Cart cleared', 'default')
  }

  const wishlistItems = useMemo(() => {
    return allProducts.filter((p) => wishlist.has(p.id))
  }, [allProducts, wishlist])

  const removeWishlist = (id) => {
    setWishlist((prev) => {
      const next = new Set(prev)
      next.delete(id)
      const prod = allProducts.find((p) => p.id === id)
      showToast(prod ? `${prod.title} removed from wishlist` : 'Removed from wishlist', 'default')
      return next
    })
  }
  const clearWishlist = () => {
    if (wishlist.size === 0) return
    setWishlist(new Set())
    showToast('Wishlist cleared', 'default')
  }

  const handleCheckout = () => {
    setCartOpen(false)
    setCheckoutOpen(true)
  }
  const handlePlaceOrder = (orderId) => {
    const total = Array.from(cart.values())
      .reduce((sum, { product, qty }) => sum + productSaleINR(product) * qty, 0)
    setCart(new Map())
    showToast(`Order ${orderId} placed • ${formatINRFromINR(total)}`, 'success')
  }

  // Keyboard shortcut Cmd+K focuses search
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        scrollToCatalog()
        setTimeout(() => {
          document.querySelector('.catalog .searchbar input')?.focus()
        }, 300)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const cartCount = useMemo(() => {
    let total = 0
    for (const { qty } of cart.values()) total += qty
    return total
  }, [cart])
  const wishlistCount = wishlist.size

  return (
    <>
      <div className="ambient-grid" aria-hidden />
      <div className="noise" aria-hidden />

      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onSearch={handleNavbarSearch}
        searchValue={search}
        onSearchChange={handleSearchChange}
        searchLoading={searchState.loading}
        onCartClick={() => setCartOpen(true)}
        onWishlistClick={() => setWishlistOpen(true)}
      />

      <main>
        <Hero
          product={heroProduct}
          promo={promoProduct}
          catalogCount={catalogCount}
          categoryCount={categoryCount}
          brandCount={brandCount}
          onExplore={scrollToCatalog}
          onNewDrops={scrollToCatalog}
          onAddToCart={addToCart}
        />

        <section className="strip">
          <div className="container strip__inner">
            <span className="strip__label">Data source</span>
            <div className="strip__logos" aria-hidden>
              <span>DummyJSON API</span><span>REST</span><span>Live search</span><span>INR pricing</span>
            </div>
            <div className="strip__metrics">
              <span><b>{catalogCount || '—'}</b> products</span>
              <span><b>{categoryCount || '—'}</b> categories</span>
              <span><b>₹</b> rupee pricing</span>
            </div>
          </div>
        </section>

        <Catalog
          products={filteredSorted}
          allProducts={allProducts}
          loading={loading}
          error={error}
          onRetry={retry}
          search={search}
          onSearchChange={handleSearchChange}
          searchActive={searchState.active}
          searchLoading={searchState.loading}
          searchError={searchState.error}
          searchTooShort={searchState.isTooShort}
          onRetrySearch={searchState.retry}
          category={category}
          onCategoryChange={setCategory}
          sort={sort}
          onSortChange={setSort}
          wishlistIds={wishlist}
          onToggleWishlist={toggleWishlist}
          onAddToCart={addToCart}
          onView={setSelected}
          addedId={addedId}
        />

        <section className="features" id="collection">
          <div className="container">
            <div className="features__grid">
              <div className="feature">
                <div className="feature__icon">◈</div>
                <h3>Live API catalog</h3>
                <p>{catalogCount || '—'} products loaded straight from the DummyJSON API — names, images, stock and pricing included.</p>
              </div>
              <div className="feature">
                <div className="feature__icon">◎</div>
                <h3>Server-side search</h3>
                <p>Typing queries the live search endpoint, so results always match what the API returns right now.</p>
              </div>
              <div className="feature">
                <div className="feature__icon">✦</div>
                <h3>Priced in rupees</h3>
                <p>Every price is converted once, centrally, and shown in Indian formatting — with savings calculated from the same numbers.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {selected && (
        <ProductModal
          product={selected}
          isWishlisted={wishlist.has(selected.id)}
          onClose={() => setSelected(null)}
          onToggleWishlist={toggleWishlist}
          onAddToCart={(p, qty) => addToCart(p, qty)}
        />
      )}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onInc={cartInc}
        onDec={cartDec}
        onRemove={cartRemove}
        onClear={cartClear}
        onCheckout={handleCheckout}
      />

      <WishlistDrawer
        open={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        items={wishlistItems}
        onRemove={removeWishlist}
        onAddToCart={(p) => addToCart(p)}
        onClear={clearWishlist}
      />

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
        onPlaceOrder={handlePlaceOrder}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  )
}

export default App
