import './SearchBar.css'

export function SearchBar({
  value,
  onChange,
  loading = false,
  placeholder = 'Search products, brands, categories',
  label = 'Search products',
}) {
  return (
    <div className={`searchbar ${loading ? 'searchbar--busy' : ''}`.trim()} role="search">
      <svg className="searchbar__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        <circle cx="11" cy="11" r="7" /><path d="M20 20L16.65 16.65" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        autoComplete="off"
        spellCheck="false"
      />
      <span className={`searchbar__spinner ${loading ? 'searchbar__spinner--on' : ''}`.trim()} aria-hidden>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="12" cy="12" r="9" opacity="0.25" />
          <path d="M21 12a9 9 0 0 0-9-9" strokeLinecap="round" />
        </svg>
      </span>
      {value && (
        <button
          type="button"
          className="searchbar__clear"
          onClick={() => onChange('')}
          aria-label="Clear search"
          title="Clear search"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      )}
    </div>
  )
}
