import './CategoryFilter.css'

export function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <div className="cat-filter" role="group" aria-label="Filter by category">
      {categories.map((cat) => {
        const isActive = selected === cat
        return (
          <button
            key={cat}
            type="button"
            className={`cat-pill ${isActive ? 'cat-pill--active' : ''}`}
            onClick={() => onSelect(cat)}
            aria-pressed={isActive}
          >
            {cat === 'all' ? 'All' : cat}
          </button>
        )
      })}
    </div>
  )
}
