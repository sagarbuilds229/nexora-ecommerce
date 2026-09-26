import './SortSelect.css'

const OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Rating: High to Low' },
  { value: 'name-asc', label: 'Name: A–Z' },
]

export function SortSelect({ value, onChange }) {
  return (
    <label className="sort">
      <span className="sort__label">Sort</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label="Sort products">
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <svg className="sort__chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M6 9l6 6 6-6" />
      </svg>
    </label>
  )
}
