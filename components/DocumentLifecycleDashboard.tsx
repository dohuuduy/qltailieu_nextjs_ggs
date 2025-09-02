'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Users,
  TrendingUp,
  Filter
} from 'lucide-react'
import { DocumentLifecycle, getDocumentStatusName, isDocumentExpiringSoon, isReviewDue } from '@/lib/types/document-lifecycle'

interface DocumentLifecycleDashboardProps {
  onCreateDocument: () => void
  onEditDocument: (document: DocumentLifecycle) => void
}

export default function DocumentLifecycleDashboard({
  onCreateDocument,
  onEditDocument
}: DocumentLifecycleDashboardProps) {
  const [documents, setDocuments] = useState<DocumentLifecycle[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

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

  // Calculate statistics
  const stats = {
    total: documents.length,
    active: documents.filter(doc => doc.computed_status === 'hieu_luc').length,
    pending: documents.filter(doc => doc.trang_thai_phe_duyet === 'cho_phe_duyet').length,
    expiring: documents.filter(doc => 
      doc.ngay_ket_thuc_hieu_luc && isDocumentExpiringSoon(doc.ngay_ket_thuc_hieu_luc)
    ).length,
    needsReview: documents.filter(doc => 
      doc.ngay_soat_xet_tiep_theo && isReviewDue(doc.ngay_soat_xet_tiep_theo)
    ).length
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hieu_luc': return 'bg-green-100 text-green-800'
      case 'het_hieu_luc': return 'bg-red-100 text-red-800'
      case 'chua_hieu_luc': return 'bg-yellow-100 text-yellow-800'
      case 'cho_phe_duyet': return 'bg-blue-100 text-blue-800'
      case 'soan_thao': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý vòng đời tài liệu</h1>
          <p className="text-gray-600">Theo dõi và quản lý ngày tháng, phê duyệt và soát xét tài liệu</p>
        </div>
        <Button onClick={onCreateDocument} className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Tạo tài liệu mới
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng số tài liệu</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đang hiệu lực</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Chờ phê duyệt</p>
                <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sắp hết hạn</p>
                <p className="text-2xl font-bold text-orange-600">{stats.expiring}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cần soát xét</p>
                <p className="text-2xl font-bold text-purple-600">{stats.needsReview}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="expiring">Sắp hết hạn</TabsTrigger>
          <TabsTrigger value="review">Cần soát xét</TabsTrigger>
          <TabsTrigger value="approval">Chờ phê duyệt</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách tài liệu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.slice(0, 10).map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <h3 className="font-medium">{doc.ten_tai_lieu}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>Phòng ban: {doc.phong_ban_chu_quan}</span>
                        <span>Hiệu lực: {formatDate(doc.ngay_bat_dau_hieu_luc)} - {formatDate(doc.ngay_ket_thuc_hieu_luc || '')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(doc.computed_status || doc.trang_thai)}>
                        {getDocumentStatusName(doc.computed_status || doc.trang_thai)}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onEditDocument(doc)}
                      >
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expiring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Tài liệu sắp hết hiệu lực
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents
                  .filter(doc => doc.ngay_ket_thuc_hieu_luc && isDocumentExpiringSoon(doc.ngay_ket_thuc_hieu_luc))
                  .map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border border-orange-200 rounded-lg bg-orange-50">
                      <div className="flex-1">
                        <h3 className="font-medium">{doc.ten_tai_lieu}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>Hết hạn: {formatDate(doc.ngay_ket_thuc_hieu_luc || '')}</span>
                          <span>Phòng ban: {doc.phong_ban_chu_quan}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-orange-100 text-orange-800">
                          Sắp hết hạn
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onEditDocument(doc)}
                        >
                          Gia hạn
                        </Button>
                      </div>
                    </div>
                  ))}
                {documents.filter(doc => doc.ngay_ket_thuc_hieu_luc && isDocumentExpiringSoon(doc.ngay_ket_thuc_hieu_luc)).length === 0 && (
                  <p className="text-center text-gray-500 py-8">Không có tài liệu nào sắp hết hiệu lực</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Tài liệu cần soát xét
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents
                  .filter(doc => doc.ngay_soat_xet_tiep_theo && isReviewDue(doc.ngay_soat_xet_tiep_theo))
                  .map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border border-purple-200 rounded-lg bg-purple-50">
                      <div className="flex-1">
                        <h3 className="font-medium">{doc.ten_tai_lieu}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>Soát xét: {formatDate(doc.ngay_soat_xet_tiep_theo || '')}</span>
                          <span>Chu kỳ: {doc.chu_ky_soat_xet}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-purple-100 text-purple-800">
                          Cần soát xét
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onEditDocument(doc)}
                        >
                          Soát xét
                        </Button>
                      </div>
                    </div>
                  ))}
                {documents.filter(doc => doc.ngay_soat_xet_tiep_theo && isReviewDue(doc.ngay_soat_xet_tiep_theo)).length === 0 && (
                  <p className="text-center text-gray-500 py-8">Không có tài liệu nào cần soát xét</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approval" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Tài liệu chờ phê duyệt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents
                  .filter(doc => doc.trang_thai_phe_duyet === 'cho_phe_duyet')
                  .map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border border-blue-200 rounded-lg bg-blue-50">
                      <div className="flex-1">
                        <h3 className="font-medium">{doc.ten_tai_lieu}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>Người soạn: {doc.nguoi_soan_thao}</span>
                          <span>Cấp độ: {doc.cap_do_tai_lieu}</span>
                          <span>Người phê duyệt: {doc.nguoi_phe_duyet}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800">
                          Chờ phê duyệt
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onEditDocument(doc)}
                        >
                          Xem chi tiết
                        </Button>
                      </div>
                    </div>
                  ))}
                {documents.filter(doc => doc.trang_thai_phe_duyet === 'cho_phe_duyet').length === 0 && (
                  <p className="text-center text-gray-500 py-8">Không có tài liệu nào chờ phê duyệt</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}