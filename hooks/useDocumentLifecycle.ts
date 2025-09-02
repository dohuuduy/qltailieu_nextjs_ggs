import { useState, useEffect, useCallback } from 'react'
import { DocumentLifecycle } from '@/lib/types/document-lifecycle'

export interface LifecycleFilters {
  status?: string
  expiring?: boolean
  needsReview?: boolean
  department?: string
}

export interface LifecycleStats {
  total: number
  active: number
  pending: number
  expiring: number
  needsReview: number
}

export const useDocumentLifecycle = (filters?: LifecycleFilters) => {
  const [documents, setDocuments] = useState<DocumentLifecycle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<LifecycleStats>({
    total: 0,
    active: 0,
    pending: 0,
    expiring: 0,
    needsReview: 0
  })

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filters?.status) params.append('status', filters.status)
      if (filters?.expiring) params.append('expiring', 'true')
      if (filters?.needsReview) params.append('needsReview', 'true')
      if (filters?.department) params.append('department', filters.department)

      const response = await fetch(`/api/documents/lifecycle?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch lifecycle documents')
      }

      const result = await response.json()
      
      if (result.success) {
        setDocuments(result.data)
        calculateStats(result.data)
      } else {
        throw new Error(result.error || 'Failed to fetch documents')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Error fetching lifecycle documents:', err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const calculateStats = (docs: DocumentLifecycle[]) => {
    const newStats: LifecycleStats = {
      total: docs.length,
      active: docs.filter(doc => doc.computed_status === 'hieu_luc').length,
      pending: docs.filter(doc => doc.trang_thai_phe_duyet === 'cho_phe_duyet').length,
      expiring: docs.filter(doc => {
        if (!doc.ngay_ket_thuc_hieu_luc) return false
        const endDate = new Date(doc.ngay_ket_thuc_hieu_luc)
        const today = new Date()
        const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
        return endDate <= thirtyDaysFromNow && endDate > today
      }).length,
      needsReview: docs.filter(doc => {
        if (!doc.ngay_soat_xet_tiep_theo) return false
        const reviewDate = new Date(doc.ngay_soat_xet_tiep_theo)
        const today = new Date()
        const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
        return reviewDate <= thirtyDaysFromNow
      }).length
    }
    setStats(newStats)
  }

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  const createLifecycleDocument = async (documentData: Partial<DocumentLifecycle>) => {
    try {
      setError(null)
      const response = await fetch('/api/documents/lifecycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(documentData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create document')
      }

      const result = await response.json()
      await fetchDocuments() // Refresh list
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create document'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateLifecycleDocument = async (id: string, documentData: Partial<DocumentLifecycle>) => {
    try {
      setError(null)
      const response = await fetch(`/api/documents/lifecycle/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(documentData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update document')
      }

      const result = await response.json()
      await fetchDocuments() // Refresh list
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update document'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const performLifecycleAction = async (
    id: string, 
    action: 'approve' | 'reject' | 'request_changes' | 'submit_for_approval' | 'mark_for_review' | 'extend_validity',
    data?: any
  ) => {
    try {
      setError(null)
      const response = await fetch(`/api/documents/lifecycle/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...data })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to perform action')
      }

      const result = await response.json()
      await fetchDocuments() // Refresh list
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to perform action'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const getExpiringDocuments = () => {
    return documents.filter(doc => {
      if (!doc.ngay_ket_thuc_hieu_luc) return false
      const endDate = new Date(doc.ngay_ket_thuc_hieu_luc)
      const today = new Date()
      const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
      return endDate <= thirtyDaysFromNow && endDate > today
    })
  }

  const getDocumentsNeedingReview = () => {
    return documents.filter(doc => {
      if (!doc.ngay_soat_xet_tiep_theo) return false
      const reviewDate = new Date(doc.ngay_soat_xet_tiep_theo)
      const today = new Date()
      const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
      return reviewDate <= thirtyDaysFromNow
    })
  }

  const getPendingApprovalDocuments = () => {
    return documents.filter(doc => doc.trang_thai_phe_duyet === 'cho_phe_duyet')
  }

  return {
    documents,
    loading,
    error,
    stats,
    refresh: fetchDocuments,
    createLifecycleDocument,
    updateLifecycleDocument,
    performLifecycleAction,
    getExpiringDocuments,
    getDocumentsNeedingReview,
    getPendingApprovalDocuments
  }
}

export const useLifecycleDocument = (id: string) => {
  const [document, setDocument] = useState<DocumentLifecycle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/documents/lifecycle/${id}`)
        
        if (!response.ok) {
          throw new Error('Document not found')
        }

        const result = await response.json()
        if (result.success) {
          setDocument(result.data)
        } else {
          throw new Error(result.error || 'Failed to fetch document')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchDocument()
    }
  }, [id])

  return { document, loading, error }
}