import './Toast.css'

export function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null
  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.type || 'default'}`} role="status">
          <span className="toast__icon" aria-hidden>
            {t.type === 'success' ? '✓' : t.type === 'error' ? '!' : t.type === 'wishlist' ? '♥' : '◈'}
          </span>
          <span className="toast__msg">{t.message}</span>
          <button className="toast__close" onClick={() => onDismiss(t.id)} aria-label="Dismiss notification">×</button>
        </div>
      ))}
    </div>
  )
}
