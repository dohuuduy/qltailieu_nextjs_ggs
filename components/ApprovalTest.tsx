'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ApprovalActions from './ApprovalActions'
import { DocumentLifecycle } from '@/lib/types/document-lifecycle'

export default function ApprovalTest() {
  const [documents, setDocuments] = useState<DocumentLifecycle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/documents/lifecycle')
      const result = await response.json()
      
      if (result.success) {
        setDocuments(result.data)
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const mockUser = {
    id: '1',
    ho_ten: 'Nguyễn Văn A',
    phong_ban: 'IT',
    quyen_phe_duyet: ['A', 'B', 'C']
  }

  if (loading) {
    return <div>Đang tải...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Test Approval Actions</h2>
      
      {documents.map(doc => (
        <Card key={doc.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{doc.ten_tai_lieu}</span>
              <Badge variant="outline">
                {doc.trang_thai_phe_duyet || 'chua_gui'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Người soạn thảo:</strong> {doc.nguoi_soan_thao}
                </div>
                <div>
                  <strong>Người phê duyệt:</strong> {doc.nguoi_phe_duyet}
                </div>
                <div>
                  <strong>Cấp độ:</strong> {doc.cap_do_tai_lieu}
                </div>
                <div>
                  <strong>Trạng thái:</strong> {doc.trang_thai}
                </div>
              </div>
              
              <ApprovalActions
                document={doc}
                onUpdate={fetchDocuments}
                currentUser={mockUser}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}