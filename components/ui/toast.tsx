'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ToastProps {
  id: string
  title?: string
  description?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

interface ToastContextType {
  toasts: ToastProps[]
  addToast: (toast: Omit<ToastProps, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const addToast = React.useCallback((toast: Omit<ToastProps, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }
    
    setToasts((prev) => [...prev, newToast])

    // Auto remove after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, toast.duration || 5000)
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

function ToastContainer({ 
  toasts, 
  removeToast 
}: { 
  toasts: ToastProps[]
  removeToast: (id: string) => void 
}) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

function Toast({ 
  title, 
  description, 
  type = 'info', 
  onClose 
}: ToastProps & { onClose: () => void }) {
  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }

  const iconStyles = {
    success: '🟢',
    error: '🔴', 
    warning: '🟡',
    info: '🔵'
  }

  return (
    <div className={cn(
      'min-w-80 max-w-md p-4 border rounded-lg shadow-lg animate-in slide-in-from-right-full',
      typeStyles[type]
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-2">
          <span className="text-sm">{iconStyles[type]}</span>
          <div className="flex-1">
            {title && (
              <div className="font-medium text-sm">{title}</div>
            )}
            {description && (
              <div className="text-sm opacity-90 mt-1">{description}</div>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}