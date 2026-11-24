import { useState, useEffect } from 'react'

let toastListener = null

export function showToast(message, type = 'info') {
  if (toastListener) {
    toastListener({ id: Date.now(), message, type })
  }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    toastListener = (toast) => {
      setToasts((prev) => [...prev, toast])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id))
      }, 3500)
    }
    return () => {
      toastListener = null
    }
  }, [])

  return (
    <div className="fixed bottom-5 right-5 z-[99999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border transition-all animate-in fade-in slide-in-from-bottom-2 duration-200 ${
            t.type === 'success'
              ? 'bg-neutral-900 border-neutral-700 text-white'
              : t.type === 'error'
              ? 'bg-red-950 border-red-800 text-red-200'
              : 'bg-neutral-800 border-neutral-700 text-neutral-200'
          }`}
        >
          <span>{t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  )
}
