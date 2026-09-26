import { useEffect, useState } from 'react'
import './Navbar.css'

export function Navbar({ cartCount = 0, wishlistCount = 0, onSearch, searchValue = '', onSearchChange, searchLoading = false, onCartClick, onWishlistClick }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  // support both controlled and uncontrolled: if searchValue prop is defined use it, else fallback to internal
  const [internalQ, setInternalQ] = useState('')
  const q = searchValue !== undefined ? searchValue : internalQ
  const setQ = onSearchChange || setInternalQ

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const submit = (e) => {
    e.preventDefault()
    onSearch?.(q)
    const el = document.getElementById('catalog') || document.getElementById('catalog-preview')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''} ${mobileOpen ? 'nav--open' : ''}`}>
      <div className="container nav__inner">
        {/* Logo */}
        <a href="#" className="nav__logo" aria-label="NEXORA home">
          <span className="nav__mark" aria-hidden>
            <span className="nav__mark-glow" />
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M11 2L19.5 7.5V16.5L11 22L2.5 16.5V7.5L11 2Z" fill="url(#nex)" stroke="rgba(255,255,255,0.9)" strokeWidth="0.9"/>
              <path d="M11 2V22M2.5 7.5L19.5 16.5M19.5 7.5L2.5 16.5" stroke="rgba(255,255,255,0.55)" strokeWidth="0.7"/>
              <defs>
                <linearGradient id="nex" x1="2.5" y1="2" x2="19.5" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#8B5CF6"/><stop offset="1" stopColor="#06B6D4"/>
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span className="nav__word">NEXORA</span>
          <span className="nav__dot" aria-hidden />
        </a>

        {/* Desktop Links */}
        <nav className="nav__links" aria-label="Primary">
          <a href="#" onClick={(e)=>{e.preventDefault(); window.scrollTo({top:0, behavior:'smooth'})}} className="nav__link">Home</a>
          <a href="#catalog" className="nav__link">Shop</a>
          <a href="#collection" className="nav__link">Collections</a>
          <a href="#catalog" className="nav__link nav__link--accent">New drops</a>
        </nav>

        {/* Search (desktop) */}
        <form className="nav__search" onSubmit={submit} role="search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
            <circle cx="11" cy="11" r="7"/><path d="M20 20L16.65 16.65"/>
          </svg>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search products, brands, categories" aria-label="Search products" autoComplete="off" />
          <span className={`nav__search-spinner ${searchLoading ? 'nav__search-spinner--on' : ''}`.trim()} aria-hidden>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="9" opacity="0.25" />
              <path d="M21 12a9 9 0 0 0-9-9" strokeLinecap="round" />
            </svg>
          </span>
          {q ? (
            <button type="button" className="nav__search-clear" onClick={()=>setQ('')} aria-label="Clear search" title="Clear search">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          ) : (
            <span className="nav__search-kbd">⌘K</span>
          )}
        </form>

        {/* Actions */}
        <div className="nav__actions">
          <button className="nav__iconBtn" aria-label={`Wishlist ${wishlistCount} items`} onClick={onWishlistClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M12 21s-6.2-4.2-8.6-8.1A5.2 5.2 0 0 1 12 5.1a5.2 5.2 0 0 1 8.6 7.8C18.2 16.8 12 21 12 21z"/>
            </svg>
            {wishlistCount > 0 && <span key={wishlistCount} className="nav__badge">{wishlistCount}</span>}
          </button>

          <button className="nav__iconBtn nav__iconBtn--cart" aria-label={`Cart ${cartCount} items`} onClick={onCartClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 7h12l-1 9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 7Z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/><circle cx="10" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="16" cy="20" r="1.5" fill="currentColor" stroke="none"/>
            </svg>
            {cartCount > 0 && <span key={cartCount} className="nav__badge nav__badge--accent">{cartCount}</span>}
          </button>

          <button className="nav__cta">Sign in</button>

          <button className="nav__burger" aria-label="Toggle menu" aria-expanded={mobileOpen} onClick={()=>setMobileOpen(v=>!v)}>
            <span/><span/><span/>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className="nav__drawer">
        <form className="nav__search nav__search--mobile" onSubmit={submit}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="11" cy="11" r="7"/><path d="M20 20L16.65 16.65"/></svg>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search products, brands, categories" aria-label="Search products" autoComplete="off" />
          {q && (
            <button type="button" className="nav__search-clear" onClick={()=>setQ('')} aria-label="Clear search">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          )}
        </form>
        <a href="#" onClick={(e)=>{e.preventDefault(); setMobileOpen(false); window.scrollTo({top:0, behavior:'smooth'})}} className="nav__drawer-link">Home</a>
        <a href="#catalog" onClick={()=>setMobileOpen(false)} className="nav__drawer-link">Shop</a>
        <a href="#collection" onClick={()=>setMobileOpen(false)} className="nav__drawer-link">Collections</a>
        <a href="#catalog" onClick={()=>setMobileOpen(false)} className="nav__drawer-link">New Drops</a>
      </div>
    </header>
  )
}
