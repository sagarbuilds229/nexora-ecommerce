import { useEffect, useState } from 'react'
import { formatINRFromINR, productSaleINR } from '../utils/price'
import { ProductImage } from './ProductImage'
import './CheckoutModal.css'

function genOrderId() {
  return 'NX-' + Math.random().toString(36).slice(2, 6).toUpperCase() + '-' + Date.now().toString().slice(-6)
}

export function CheckoutModal({ open, onClose, cart, onPlaceOrder }) {
  const [step, setStep] = useState('form') // form | success
  const [orderId, setOrderId] = useState('')
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    payment: 'cod',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!open) return
    setStep('form')
    setErrors({})
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
  const subtotal = items.reduce((sum, { product, qty }) => sum + productSaleINR(product) * qty, 0)
  const totalCount = items.reduce((s, { qty }) => s + qty, 0)

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Required'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Valid email required'
    if (!/^[0-9]{10}$/.test(form.phone.replace(/\D/g, ''))) e.phone = '10 digit phone'
    if (!form.address.trim()) e.address = 'Required'
    if (!form.city.trim()) e.city = 'Required'
    if (!form.state.trim()) e.state = 'Required'
    if (!/^[0-9]{6}$/.test(form.pincode)) e.pincode = '6 digit pincode'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const id = genOrderId()
    setOrderId(id)
    setStep('success')
    onPlaceOrder?.(id)
  }

  return (
    <div className="checkout" role="dialog" aria-modal="true" aria-label="Checkout">
      <button className="checkout__overlay" onClick={onClose} aria-label="Close checkout" />
      <div className="checkout__panel">
        <button className="checkout__close" onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>

        {step === 'success' ? (
          <div className="checkout__success">
            <div className="checkout__success-icon">✓</div>
            <h2>Order Confirmed</h2>
            <p className="checkout__orderId">{orderId}</p>
            <p>Order summary created for <b>{form.email}</b>. This is a frontend demo — the order stays in your browser, no payment was processed and nothing will be shipped.</p>
            <div className="checkout__success-actions">
              <button className="checkout__primary" onClick={onClose}>Continue shopping</button>
            </div>
            <span className="checkout__demo-note">Frontend demo — no payment was processed</span>
          </div>
        ) : (
          <>
            <div className="checkout__head">
              <h2>Checkout</h2>
              <span>{totalCount} items • {formatINRFromINR(subtotal)}</span>
            </div>

            <div className="checkout__grid">
              <form className="checkout__form" onSubmit={handleSubmit} noValidate>
                <h3>Shipping Details</h3>
                <label>Full Name
                  <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Aarav Sharma" />
                  {errors.fullName && <span className="checkout__err">{errors.fullName}</span>}
                </label>
                <div className="checkout__row">
                  <label>Email
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="aarav@example.com" />
                    {errors.email && <span className="checkout__err">{errors.email}</span>}
                  </label>
                  <label>Phone
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="9876543210" inputMode="numeric" />
                    {errors.phone && <span className="checkout__err">{errors.phone}</span>}
                  </label>
                </div>
                <label>Address
                  <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Street, apartment, landmark" />
                  {errors.address && <span className="checkout__err">{errors.address}</span>}
                </label>
                <div className="checkout__row">
                  <label>City
                    <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Mumbai" />
                    {errors.city && <span className="checkout__err">{errors.city}</span>}
                  </label>
                  <label>Pincode
                    <input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} placeholder="400001" inputMode="numeric" />
                    {errors.pincode && <span className="checkout__err">{errors.pincode}</span>}
                  </label>
                </div>
                <label>State
                  <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="Maharashtra" />
                  {errors.state && <span className="checkout__err">{errors.state}</span>}
                </label>

                <h3 className="checkout__mt">Payment Method</h3>
                <div className="checkout__payments" role="radiogroup" aria-label="Payment method">
                  {[
                    { id: 'cod', label: 'Cash on Delivery', desc: 'Pay on delivery' },
                    { id: 'upi', label: 'UPI', desc: 'PhonePe / GPay / Paytm' },
                    { id: 'card', label: 'Card', desc: 'Visa / Mastercard' },
                  ].map((m) => (
                    <label key={m.id} className={`checkout__pay ${form.payment === m.id ? 'checkout__pay--active' : ''}`}>
                      <input type="radio" name="payment" value={m.id} checked={form.payment === m.id} onChange={(e) => setForm({ ...form, payment: e.target.value })} />
                      <div>
                        <strong>{m.label}</strong>
                        <span>{m.desc}</span>
                      </div>
                      <span className="checkout__radio" aria-hidden />
                    </label>
                  ))}
                </div>

                <button type="submit" className="checkout__primary checkout__submit">Place Order • {formatINRFromINR(subtotal)}</button>
                <span className="checkout__demo-note">Secure demo checkout — no real payment</span>
              </form>

              <aside className="checkout__summary">
                <h3>Order Summary</h3>
                <div className="checkout__items">
                  {items.map(({ product, qty }) => {
                    const unit = productSaleINR(product)
                    return (
                      <div key={product.id} className="checkout__item">
                        <ProductImage product={product} alt={product.title} className="checkout__item-img" bare />
                        <div>
                          <strong>{product.title}</strong>
                          <span>Qty {qty} • {formatINRFromINR(unit)}</span>
                        </div>
                        <b>{formatINRFromINR(unit * qty)}</b>
                      </div>
                    )
                  })}
                </div>
                <div className="checkout__totals">
                  <div><span>Subtotal</span><span>{formatINRFromINR(subtotal)}</span></div>
                  <div><span>Shipping</span><span className="checkout__free">Free</span></div>
                  <div className="checkout__total"><span>Total</span><span>{formatINRFromINR(subtotal)}</span></div>
                </div>
              </aside>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
