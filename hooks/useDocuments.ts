import { useState, useEffect, useCallback } from 'react'

export interface Document {
  id: string
  ten_tai_lieu: string
  mo_ta: string
  loai_tai_lieu: string
  trang_thai: string
  nguoi_tao: string
  ngay_tao: string
  phien_ban_hien_tai: string
  tieu_chuan_ap_dung: string | string[]
  url_file?: string
}

export interface DocumentFilters {
  search?: string
  loai_tai_lieu?: string
  trang_thai?: string
  phong_ban?: string
  date_from?: string
  date_to?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
}

export const useDocuments = (filters?: DocumentFilters, page = 1, limit = 20) => {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      })

      const response = await fetch(`/api/documents?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch documents')
      }

      const data = await response.json()
      
      if (Array.isArray(data)) {
        // Fallback for current API format
        setDocuments(data)
        setTotal(data.length)
      } else {
        // Future paginated format
        setDocuments(data.data || [])
        setTotal(data.total || 0)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Error fetching documents:', err)
    } finally {
      setLoading(false)
    }
  }, [filters, page, limit])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  const createDocument = async (documentData: Partial<Document>) => {
    try {
      setError(null)
      const response = await fetch('/api/documents', {
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

  const updateDocument = async (id: string, documentData: Partial<Document>) => {
    try {
      setError(null)
      const response = await fetch(`/api/documents/${id}`, {
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

  const deleteDocument = async (id: string) => {
    try {
      setError(null)
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete document')
      }

      const result = await response.json()
      await fetchDocuments() // Refresh list
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete document'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const bulkDelete = async (ids: string[]) => {
    try {
      setError(null)
      const results = await Promise.all(
        ids.map(id => deleteDocument(id))
      )
      return results
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete documents'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  return {
    documents,
    loading,
    error,
    total,
    hasNext: page * limit < total,
    refresh: fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    bulkDelete
  }
}

export const useDocument = (id: string) => {
  const [document, setDocument] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/documents/${id}`)
        
        if (!response.ok) {
          throw new Error('Document not found')
        }

        const data = await response.json()
        setDocument(data)
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