/**
 * NEXORA — centralised money layer.
 *
 * The catalog API (DummyJSON) publishes prices in USD. Every rupee amount that
 * reaches the UI is produced here, in one single place, so the same product
 * always renders the same price on cards, details, cart, wishlist and checkout.
 * Components must never do their own conversion arithmetic.
 */

export const INR_PER_USD = 95.61
export const FREE_SHIPPING_USD = 250

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

/** Convert a base-currency (USD) amount to whole rupees. */
export function usdToInr(usdAmount) {
  const amount = Number(usdAmount)
  if (!Number.isFinite(amount)) return 0
  return Math.round(amount * INR_PER_USD)
}

/** Format an amount that is already in rupees (₹1,34,999). */
export function formatINRFromINR(inrAmount) {
  const amount = Number(inrAmount)
  return inrFormatter.format(Number.isFinite(amount) ? Math.round(amount) : 0)
}

/** Format a base-currency (USD) price directly as INR. */
export function formatINR(usdPrice) {
  return formatINRFromINR(usdToInr(usdPrice))
}

/* ---- Product helpers — one rounding path for the whole app ---- */

/** List price of a product in INR. */
export function productListINR(product) {
  return usdToInr(product?.price)
}

/** Price the customer actually pays (after the API discount), in INR. */
export function productSaleINR(product) {
  const list = productListINR(product)
  const discount = Number(product?.discountPercentage) || 0
  if (discount <= 0) return list
  return Math.max(0, Math.round(list * (1 - discount / 100)))
}

/** Absolute saving versus the list price, in INR. */
export function productSavingsINR(product) {
  return Math.max(0, productListINR(product) - productSaleINR(product))
}

export function hasDiscount(product) {
  return Number(product?.discountPercentage) > 0.5
}

/* ---- Ready-to-render strings ---- */

export function formatProductPrice(product) {
  return formatINRFromINR(productSaleINR(product))
}

export function formatProductListPrice(product) {
  return formatINRFromINR(productListINR(product))
}

/** "Save ₹4,500" */
export function formatSavings(product) {
  return `Save ${formatINRFromINR(productSavingsINR(product))}`
}

export function formatShippingThreshold() {
  return formatINR(FREE_SHIPPING_USD)
}
