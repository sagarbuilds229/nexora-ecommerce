import { useCallback, useEffect, useRef, useState } from 'react'
import { useDebounce } from './useDebounce'

export const SEARCH_ENDPOINT = 'https://dummyjson.com/products/search'
export const MIN_SEARCH_CHARS = 2
export const SEARCH_DEBOUNCE_MS = 300

function dedupeById(list) {
  const seen = new Set()
  const out = []
  for (const product of list) {
    if (!product || product.id == null || seen.has(product.id)) continue
    seen.add(product.id)
    out.push(product)
  }
  return out
}

/**
 * Queries the live DummyJSON search endpoint instead of filtering the loaded
 * catalog in the browser.
 *
 * - debounced input, minimum 2 characters, whitespace trimmed
 * - stale/in-flight requests are aborted and ignored
 * - a failed search clears results (it never falls back to unrelated products)
 */
export function useProductSearch(query, { minChars = MIN_SEARCH_CHARS, debounceMs = SEARCH_DEBOUNCE_MS } = {}) {
  const typedQuery = (query || '').trim()
  const debouncedQuery = useDebounce(typedQuery, debounceMs)
  const wantsSearch = debouncedQuery.length >= minChars
  // Driven by the *typed* value, so clearing the field or dropping below the
  // minimum immediately leaves search mode instead of showing stale results
  // for up to one debounce window.
  const isActive = typedQuery.length >= minChars
  const isTooShort = typedQuery.length > 0 && typedQuery.length < minChars

  const [results, setResults] = useState([])
  const [total, setTotal] = useState(0)
  const [inFlight, setInFlight] = useState(false)
  const [error, setError] = useState(null)
  const [settledQuery, setSettledQuery] = useState('')
  const [attempt, setAttempt] = useState(0)

  const requestRef = useRef({ id: 0, controller: null })
  const mountedRef = useRef(true)

  // The setup body MUST re-arm the flag: StrictMode mounts -> unmounts ->
  // remounts every effect, and an effect that only ever writes `false` leaves
  // the component permanently "unmounted", which silently drops every response.
  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  useEffect(() => {
    // Every run claims a fresh id (even when leaving search mode) so a late or
    // aborted response can never overwrite the state of the newest request.
    const currentId = requestRef.current.id + 1
    requestRef.current.controller?.abort()

    if (!wantsSearch) {
      requestRef.current = { id: currentId, controller: null }
      setResults([])
      setTotal(0)
      setError(null)
      setSettledQuery('')
      setInFlight(false)
      return
    }

    const nextController = new AbortController()
    requestRef.current = { id: currentId, controller: nextController }

    setInFlight(true)
    setError(null)

    fetch(`${SEARCH_ENDPOINT}?q=${encodeURIComponent(debouncedQuery)}`, {
      signal: nextController.signal,
      headers: { Accept: 'application/json' },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => {
        if (!Array.isArray(data?.products)) throw new Error('Invalid API response')
        const items = dedupeById(data.products)
        if (!mountedRef.current || requestRef.current.id !== currentId) return
        setResults(items)
        setTotal(Number.isFinite(data.total) ? data.total : items.length)
        setSettledQuery(debouncedQuery)
      })
      .catch((err) => {
        // AbortError means a newer keystroke (or unmount) won the race: drop the
        // error, and let the request that is actually current own `inFlight`.
        if (err?.name === 'AbortError') return
        if (!mountedRef.current || requestRef.current.id !== currentId) return
        setResults([])
        setTotal(0)
        setError(err?.message || 'Search request failed')
        setSettledQuery(debouncedQuery)
      })
      .finally(() => {
        if (!mountedRef.current || requestRef.current.id !== currentId) return
        setInFlight(false)
      })

    return () => nextController.abort()
  }, [debouncedQuery, wantsSearch, attempt])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  // A search is "loading" from the moment the user edits the field until the
  // results for that exact query have been committed.
  const loading =
    isActive &&
    (inFlight || settledQuery !== debouncedQuery || typedQuery !== debouncedQuery)

  return {
    query: debouncedQuery,
    active: isActive,
    isTooShort,
    loading,
    error: isActive ? error : null,
    results,
    count: results.length,
    total,
    retry,
  }
}
