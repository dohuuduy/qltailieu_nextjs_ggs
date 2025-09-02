'use client'

import React from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error!} retry={this.handleRetry} />
      }

      return <DefaultErrorFallback error={this.state.error!} retry={this.handleRetry} />
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  error: Error
  retry: () => void
}

export function DefaultErrorFallback({ error, retry }: ErrorFallbackProps) {
  return (
    <Card className="max-w-lg mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="w-5 h-5" />
          Đã xảy ra lỗi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Lỗi hệ thống</AlertTitle>
          <AlertDescription>
            {error.message || 'Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.'}
          </AlertDescription>
        </Alert>
        
        <div className="flex gap-2">
          <Button onClick={retry} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Thử lại
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            Tải lại trang
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-gray-600">
              Chi tiết lỗi (Development)
            </summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
      </CardContent>
    </Card>
  )
}

// Hook for error handling in functional components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const handleError = React.useCallback((error: Error | string) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error
    setError(errorObj)
    console.error('Error handled:', errorObj)
  }, [])

  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  return { error, handleError, clearError }
}

// Error message component for API errors
interface ErrorMessageProps {
  error: string | Error | null
  onRetry?: () => void
  className?: string
}

export function ErrorMessage({ error, onRetry, className }: ErrorMessageProps) {
  if (!error) return null

  const errorMessage = typeof error === 'string' ? error : error.message

  return (
    <Alert variant="destructive" className={className}>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Lỗi</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{errorMessage}</span>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw className="w-4 h-4 mr-1" />
            Thử lại
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}

// Network error specific component
export function NetworkError({ onRetry }: { onRetry: () => void }) {
  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardContent className="p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Lỗi kết nối</h3>
        <p className="text-gray-600 mb-4">
          Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet và thử lại.
        </p>
        <Button onClick={onRetry} className="flex items-center gap-2 mx-auto">
          <RefreshCw className="w-4 h-4" />
          Thử lại
        </Button>
      </CardContent>
    </Card>
  )
}

// Not found error component
export function NotFoundError({ message = "Không tìm thấy dữ liệu" }: { message?: string }) {
  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardContent className="p-6 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🔍</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">Không tìm thấy</h3>
        <p className="text-gray-600">{message}</p>
      </CardContent>
    </Card>
  )
}