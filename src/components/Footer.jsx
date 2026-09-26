import './Footer.css'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <div className="footer__logo">NEXORA</div>
            <p>The Future of Shopping. Premium tech, lifestyle and essentials — curated for the next generation.</p>
            <div className="footer__social">
              <a href="#" aria-label="Instagram">◎</a>
              <a href="#" aria-label="X">𝕏</a>
              <a href="#" aria-label="LinkedIn">in</a>
            </div>
          </div>
          <div className="footer__cols">
            <div>
              <h4>Explore</h4>
              <a href="#catalog">Catalog</a>
              <a href="#catalog">New Drops</a>
              <a href="#collection">Collections</a>
              <a href="#catalog">Search</a>
            </div>
            <div>
              <h4>Support</h4>
              <a href="#">Shipping</a>
              <a href="#">Returns</a>
              <a href="#">Contact</a>
              <a href="#">FAQ</a>
            </div>
            <div>
              <h4>Stay in loop</h4>
              <p className="footer__nl-text">Product updates from the live catalog. Demo form — nothing is sent.</p>
              <form className="footer__nl" onSubmit={e=>e.preventDefault()}>
                <input placeholder="Enter your email" aria-label="Email" />
                <button type="submit">→</button>
              </form>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© 2026 NEXORA Labs. Crafted for internship excellence.</span>
          <span className="footer__links"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Changelog</a></span>
        </div>
      </div>
    </footer>
  )
}
