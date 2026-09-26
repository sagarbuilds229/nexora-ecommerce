import { useCallback, useEffect, useState } from 'react'

const API_URL = 'https://dummyjson.com/products?limit=0'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      if (!Array.isArray(data.products)) throw new Error('Invalid API response')
      setProducts(data.products)
      setTotal(Number.isFinite(data.total) ? data.total : data.products.length)
    } catch (err) {
      setError(err.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return { products, total, loading, error, retry: fetchProducts }
}
