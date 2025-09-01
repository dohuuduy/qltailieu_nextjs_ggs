'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { History, Calendar, User, Activity, Filter } from 'lucide-react'

interface LichSu {
  id: string
  tai_lieu_id: string
  phien_ban_id: string
  hanh_dong: string
  mo_ta: string
  nguoi_thuc_hien: string
  ngay_thuc_hien: string
}

interface TaiLieu {
  id: string
  ten_tai_lieu: string
}

export default function HistoryViewer() {
  const [history, setHistory] = useState<LichSu[]>([])
  const [documents, setDocuments] = useState<TaiLieu[]>([])
  const [selectedDocument, setSelectedDocument] = useState<string>('all')
  const [selectedAction, setSelectedAction] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [historyRes, documentsRes] = await Promise.all([
        fetch('/api/history'),
        fetch('/api/documents')
      ])

      if (historyRes.ok) {
        const historyData = await historyRes.json()
        setHistory(historyData)
      }

      if (documentsRes.ok) {
        const documentsData = await documentsRes.json()
        setDocuments(documentsData)
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error)
      // Mock data fallback
      setHistory([
        {
          id: '1',
          tai_lieu_id: '1',
          phien_ban_id: '1',
          hanh_dong: 'cap_nhat_phien_ban',
          mo_ta: 'Tạo phiên bản 2.1: Cập nhật quy trình kiểm tra theo tiêu chuẩn mới',
          nguoi_thuc_hien: 'Nguyễn Văn A',
          ngay_thuc_hien: '2024-03-01'
        }
      ])
      setDocuments([
        {
          id: '1',
          ten_tai_lieu: 'Quy trình kiểm tra chất lượng sản phẩm'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredHistory = history.filter(item => {
    const documentMatch = selectedDocument === 'all' || item.tai_lieu_id === selectedDocument
    const actionMatch = selectedAction === 'all' || item.hanh_dong === selectedAction
    return documentMatch && actionMatch
  })

  const getDocumentName = (taiLieuId: string) => {
    const doc = documents.find(d => d.id === taiLieuId)
    return doc?.ten_tai_lieu || 'Không xác định'
  }

  const getActionLabel = (action: string) => {
    const actions: Record<string, string> = {
      'tao_moi': 'Tạo mới',
      'cap_nhat_phien_ban': 'Cập nhật phiên bản',
      'xoa': 'Xóa',
      'sua_doi': 'Sửa đổi'
    }
    return actions[action] || action
  }

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      'tao_moi': 'bg-green-100 text-green-800',
      'cap_nhat_phien_ban': 'bg-blue-100 text-blue-800',
      'xoa': 'bg-red-100 text-red-800',
      'sua_doi': 'bg-yellow-100 text-yellow-800'
    }
    return colors[action] || 'bg-gray-100 text-gray-800'
  }

  const uniqueActions = Array.from(new Set(history.map(item => item.hanh_dong).filter(action => action && action.trim() !== '')))

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Lịch Sử Thay Đổi</h2>
        <p className="text-muted-foreground">
          Theo dõi tất cả các hoạt động và thay đổi trong hệ thống
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Bộ Lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select value={selectedDocument} onValueChange={setSelectedDocument}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả tài liệu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả tài liệu</SelectItem>
                  {documents.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id}>
                      {doc.ten_tai_lieu}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả hành động" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả hành động</SelectItem>
                  {uniqueActions.map((action) => (
                    <SelectItem key={action} value={action}>
                      {getActionLabel(action)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSelectedDocument('all')
                  setSelectedAction('all')
                }}
                variant="outline"
              >
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Dòng Thời Gian</CardTitle>
            <div className="text-sm text-muted-foreground">
              Tổng: {filteredHistory.length} hoạt động
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredHistory.length > 0 ? (
            <div className="space-y-4">
              {filteredHistory.map((item, index) => (
                <div key={item.id} className="relative">
                  {/* Timeline line */}
                  {index < filteredHistory.length - 1 && (
                    <div className="absolute left-4 top-8 w-0.5 h-16 bg-border"></div>
                  )}

                  {/* Timeline item */}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Activity className="h-4 w-4 text-primary-foreground" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 bg-muted/50 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(item.hanh_dong)}`}>
                              {getActionLabel(item.hanh_dong)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {getDocumentName(item.tai_lieu_id)}
                            </span>
                          </div>

                          <p className="text-sm font-medium text-foreground mb-2">
                            {item.mo_ta}
                          </p>

                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <User className="mr-1 h-3 w-3" />
                              {item.nguoi_thuc_hien}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              {item.ngay_thuc_hien}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <History className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Không có lịch sử nào</p>
              <p className="text-sm">
                {selectedDocument || selectedAction
                  ? 'Không tìm thấy hoạt động nào với bộ lọc hiện tại'
                  : 'Chưa có hoạt động nào được ghi nhận'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}