'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { GitBranch, Plus, Eye, Calendar, User } from 'lucide-react'

interface PhienBan {
  id: string
  tai_lieu_id: string
  so_phien_ban: string
  noi_dung: string
  ghi_chu: string
  nguoi_tao: string
  ngay_tao: string
  trang_thai: string
}

interface TaiLieu {
  id: string
  ten_tai_lieu: string
  phien_ban_hien_tai: string
}

export default function VersionManager() {
  const [versions, setVersions] = useState<PhienBan[]>([])
  const [documents, setDocuments] = useState<TaiLieu[]>([])
  const [selectedDocument, setSelectedDocument] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [versionsRes, documentsRes] = await Promise.all([
        fetch('/api/versions'),
        fetch('/api/documents')
      ])

      if (versionsRes.ok) {
        const versionsData = await versionsRes.json()
        setVersions(versionsData)
      }

      if (documentsRes.ok) {
        const documentsData = await documentsRes.json()
        setDocuments(documentsData)
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error)
      // Mock data fallback
      setVersions([
        {
          id: '1',
          tai_lieu_id: '1',
          so_phien_ban: '2.1',
          noi_dung: 'Cập nhật quy trình kiểm tra theo tiêu chuẩn mới',
          ghi_chu: 'Thêm bước kiểm tra bổ sung',
          nguoi_tao: 'Nguyễn Văn A',
          ngay_tao: '2024-03-01',
          trang_thai: 'hieu_luc'
        }
      ])
      setDocuments([
        {
          id: '1',
          ten_tai_lieu: 'Quy trình kiểm tra chất lượng sản phẩm',
          phien_ban_hien_tai: '2.1'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredVersions = selectedDocument && selectedDocument !== 'all'
    ? versions.filter(v => v.tai_lieu_id === selectedDocument)
    : versions

  const getDocumentName = (taiLieuId: string) => {
    const doc = documents.find(d => d.id === taiLieuId)
    return doc?.ten_tai_lieu || 'Không xác định'
  }

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
        <h2 className="text-2xl font-bold tracking-tight">Quản Lý Phiên Bản</h2>
        <p className="text-muted-foreground">
          Theo dõi và quản lý các phiên bản của tài liệu
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <GitBranch className="mr-2 h-5 w-5" />
            Bộ Lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="document-filter">Lọc theo tài liệu</Label>
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
            <div className="flex items-end">
              <Button onClick={() => setSelectedDocument('all')} variant="outline">
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Versions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh Sách Phiên Bản</CardTitle>
            <div className="text-sm text-muted-foreground">
              Tổng: {filteredVersions.length} phiên bản
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredVersions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tài Liệu</TableHead>
                    <TableHead>Phiên Bản</TableHead>
                    <TableHead>Nội Dung</TableHead>
                    <TableHead>Ghi Chú</TableHead>
                    <TableHead>Người Tạo</TableHead>
                    <TableHead>Ngày Tạo</TableHead>
                    <TableHead>Trạng Thái</TableHead>
                    <TableHead>Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVersions.map((version) => (
                    <TableRow key={version.id}>
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate" title={getDocumentName(version.tai_lieu_id)}>
                          {getDocumentName(version.tai_lieu_id)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <GitBranch className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="font-mono font-medium">
                            {version.so_phien_ban}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={version.noi_dung}>
                          {version.noi_dung}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={version.ghi_chu}>
                          {version.ghi_chu || '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4 text-muted-foreground" />
                          {version.nguoi_tao}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          {version.ngay_tao}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          version.trang_thai === 'hieu_luc' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {version.trang_thai === 'hieu_luc' ? 'Hiệu lực' : 'Hết hiệu lực'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <GitBranch className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Không có phiên bản nào</p>
              <p className="text-sm">
                {selectedDocument && selectedDocument !== 'all'
                  ? 'Tài liệu được chọn chưa có phiên bản nào'
                  : 'Chưa có phiên bản nào được tạo'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}