'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Plus, Edit, Trash2, GripVertical, FileText, ExternalLink } from 'lucide-react'
import { useToast } from '@/components/ui/toast'

interface TaiLieuCon {
  id: string
  tai_lieu_cha_id: string
  ten_tai_lieu_con: string
  mo_ta: string
  loai_tai_lieu: string
  trang_thai: string
  thu_tu: number
  nguoi_tao: string
  ngay_tao: string
  nguoi_cap_nhat: string
  ngay_cap_nhat: string
  url_file?: string
  ghi_chu?: string
}

interface SubDocumentManagerProps {
  documentId: string
  documentName: string
}

export default function SubDocumentManager({ documentId, documentName }: SubDocumentManagerProps) {
  const { addToast } = useToast()
  const [subDocuments, setSubDocuments] = useState<TaiLieuCon[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedSubDocument, setSelectedSubDocument] = useState<TaiLieuCon | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    ten_tai_lieu_con: '',
    mo_ta: '',
    loai_tai_lieu: 'bieu_mau',
    url_file: '',
    ghi_chu: ''
  })

  const [editFormData, setEditFormData] = useState({
    ten_tai_lieu_con: '',
    mo_ta: '',
    loai_tai_lieu: '',
    url_file: '',
    ghi_chu: ''
  })

  // Fetch danh sách tài liệu con
  const fetchSubDocuments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/documents/${documentId}/sub-documents`)
      if (response.ok) {
        const data = await response.json()
        setSubDocuments(data)
      } else {
        console.error('Lỗi khi tải danh sách tài liệu con')
        addToast({
          type: 'error',
          title: 'Lỗi!',
          description: 'Không thể tải danh sách tài liệu con'
        })
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách tài liệu con:', error)
      addToast({
        type: 'error',
        title: 'Lỗi!',
        description: 'Có lỗi xảy ra khi tải dữ liệu'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubDocuments()
  }, [documentId])

  // Tạo tài liệu con mới
  const handleCreateSubDocument = async () => {
    try {
      const response = await fetch(`/api/documents/${documentId}/sub-documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          nguoi_tao: 'Người dùng hiện tại'
        }),
      })

      if (response.ok) {
        await fetchSubDocuments() // Tải lại danh sách
        setFormData({
          ten_tai_lieu_con: '',
          mo_ta: '',
          loai_tai_lieu: 'bieu_mau',
          url_file: '',
          ghi_chu: ''
        })
        setIsCreateDialogOpen(false)
        addToast({
          type: 'success',
          title: 'Thành công!',
          description: 'Tài liệu con đã được tạo thành công'
        })
      } else {
        addToast({
          type: 'error',
          title: 'Lỗi!',
          description: 'Không thể tạo tài liệu con. Vui lòng thử lại.'
        })
      }
    } catch (error) {
      console.error('Lỗi khi tạo tài liệu con:', error)
      addToast({
        type: 'error',
        title: 'Lỗi!',
        description: 'Có lỗi xảy ra khi tạo tài liệu con'
      })
    }
  }

  // Sửa tài liệu con
  const handleEditSubDocument = (subDoc: TaiLieuCon) => {
    setSelectedSubDocument(subDoc)
    setEditFormData({
      ten_tai_lieu_con: subDoc.ten_tai_lieu_con,
      mo_ta: subDoc.mo_ta,
      loai_tai_lieu: subDoc.loai_tai_lieu,
      url_file: subDoc.url_file || '',
      ghi_chu: subDoc.ghi_chu || ''
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateSubDocument = async () => {
    if (!selectedSubDocument) return

    try {
      const response = await fetch(`/api/documents/${documentId}/sub-documents/${selectedSubDocument.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editFormData,
          nguoi_cap_nhat: 'Người dùng hiện tại'
        }),
      })

      if (response.ok) {
        await fetchSubDocuments() // Tải lại danh sách
        setIsEditDialogOpen(false)
        setSelectedSubDocument(null)
        addToast({
          type: 'success',
          title: 'Thành công!',
          description: 'Tài liệu con đã được cập nhật thành công'
        })
      } else {
        addToast({
          type: 'error',
          title: 'Lỗi!',
          description: 'Không thể cập nhật tài liệu con. Vui lòng thử lại.'
        })
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật tài liệu con:', error)
      addToast({
        type: 'error',
        title: 'Lỗi!',
        description: 'Có lỗi xảy ra khi cập nhật tài liệu con'
      })
    }
  }

  // Xóa tài liệu con
  const handleDeleteSubDocument = (subDoc: TaiLieuCon) => {
    setSelectedSubDocument(subDoc)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteSubDocument = async () => {
    if (!selectedSubDocument) return

    try {
      const response = await fetch(`/api/documents/${documentId}/sub-documents/${selectedSubDocument.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchSubDocuments() // Tải lại danh sách
        addToast({
          type: 'success',
          title: 'Thành công!',
          description: `Đã xóa tài liệu con "${selectedSubDocument.ten_tai_lieu_con}"`
        })
      } else {
        addToast({
          type: 'error',
          title: 'Lỗi!',
          description: 'Không thể xóa tài liệu con. Vui lòng thử lại.'
        })
      }
    } catch (error) {
      console.error('Lỗi khi xóa tài liệu con:', error)
      addToast({
        type: 'error',
        title: 'Lỗi!',
        description: 'Có lỗi xảy ra khi xóa tài liệu con'
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setSelectedSubDocument(null)
    }
  }

  const getLoaiTaiLieuName = (maLoai: string) => {
    const loaiMapping: Record<string, string> = {
      'bieu_mau': 'Biểu Mẫu',
      'huong_dan': 'Hướng Dẫn',
      'checklist': 'Checklist',
      'bao_cao': 'Báo Cáo',
      'tai_lieu_tham_khao': 'Tài Liệu Tham Khảo',
      'tai_lieu_con': 'Tài Liệu Con'
    }
    return loaiMapping[maLoai] || maLoai
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Tài Liệu Con
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Tài liệu cha: <strong>{documentName}</strong>
              </p>
              <p className="text-xs text-gray-500">
                {loading ? 'Đang tải...' : `${subDocuments.length} tài liệu con`}
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm Tài Liệu Con
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Thêm Tài Liệu Con</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ten_tai_lieu_con">Tên Tài Liệu Con</Label>
                    <Input
                      id="ten_tai_lieu_con"
                      value={formData.ten_tai_lieu_con}
                      onChange={(e) => setFormData({ ...formData, ten_tai_lieu_con: e.target.value })}
                      placeholder="Nhập tên tài liệu con"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mo_ta">Mô Tả</Label>
                    <Input
                      id="mo_ta"
                      value={formData.mo_ta}
                      onChange={(e) => setFormData({ ...formData, mo_ta: e.target.value })}
                      placeholder="Nhập mô tả"
                    />
                  </div>
                  <div>
                    <Label htmlFor="loai_tai_lieu">Loại Tài Liệu</Label>
                    <Select value={formData.loai_tai_lieu} onValueChange={(value) => setFormData({ ...formData, loai_tai_lieu: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bieu_mau">Biểu Mẫu</SelectItem>
                        <SelectItem value="huong_dan">Hướng Dẫn</SelectItem>
                        <SelectItem value="checklist">Checklist</SelectItem>
                        <SelectItem value="bao_cao">Báo Cáo</SelectItem>
                        <SelectItem value="tai_lieu_tham_khao">Tài Liệu Tham Khảo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="url_file">URL File</Label>
                    <Input
                      id="url_file"
                      value={formData.url_file}
                      onChange={(e) => setFormData({ ...formData, url_file: e.target.value })}
                      placeholder="https://drive.google.com/file/d/..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="ghi_chu">Ghi Chú</Label>
                    <Input
                      id="ghi_chu"
                      value={formData.ghi_chu}
                      onChange={(e) => setFormData({ ...formData, ghi_chu: e.target.value })}
                      placeholder="Ghi chú bổ sung"
                    />
                  </div>
                  <Button onClick={handleCreateSubDocument} className="w-full">
                    Tạo Tài Liệu Con
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <span>Đang tải danh sách tài liệu con...</span>
            </div>
          ) : subDocuments.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có tài liệu con</h3>
              <p className="text-gray-600 mb-4">Thêm biểu mẫu, hướng dẫn hoặc tài liệu liên quan.</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm Tài Liệu Con Đầu Tiên
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">STT</TableHead>
                    <TableHead>Tên Tài Liệu Con</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>URL File</TableHead>
                    <TableHead>Ghi Chú</TableHead>
                    <TableHead>Ngày Tạo</TableHead>
                    <TableHead>Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subDocuments.map((subDoc, index) => (
                    <TableRow key={subDoc.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                          {subDoc.thu_tu}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{subDoc.ten_tai_lieu_con}</div>
                          {subDoc.mo_ta && (
                            <div className="text-sm text-gray-600">{subDoc.mo_ta}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getLoaiTaiLieuName(subDoc.loai_tai_lieu)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {subDoc.url_file ? (
                          <a
                            href={subDoc.url_file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Xem file
                          </a>
                        ) : (
                          <span className="text-gray-400">Chưa có</span>
                        )}
                      </TableCell>
                      <TableCell>{subDoc.ghi_chu || '-'}</TableCell>
                      <TableCell>{subDoc.ngay_tao}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditSubDocument(subDoc)}
                            title="Sửa tài liệu con"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteSubDocument(subDoc)}
                            title="Xóa tài liệu con"
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog sửa tài liệu con */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Sửa Tài Liệu Con</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit_ten_tai_lieu_con">Tên Tài Liệu Con</Label>
              <Input
                id="edit_ten_tai_lieu_con"
                value={editFormData.ten_tai_lieu_con}
                onChange={(e) => setEditFormData({ ...editFormData, ten_tai_lieu_con: e.target.value })}
                placeholder="Nhập tên tài liệu con"
              />
            </div>
            <div>
              <Label htmlFor="edit_mo_ta">Mô Tả</Label>
              <Input
                id="edit_mo_ta"
                value={editFormData.mo_ta}
                onChange={(e) => setEditFormData({ ...editFormData, mo_ta: e.target.value })}
                placeholder="Nhập mô tả"
              />
            </div>
            <div>
              <Label htmlFor="edit_loai_tai_lieu">Loại Tài Liệu</Label>
              <Select value={editFormData.loai_tai_lieu} onValueChange={(value) => setEditFormData({ ...editFormData, loai_tai_lieu: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bieu_mau">Biểu Mẫu</SelectItem>
                  <SelectItem value="huong_dan">Hướng Dẫn</SelectItem>
                  <SelectItem value="checklist">Checklist</SelectItem>
                  <SelectItem value="bao_cao">Báo Cáo</SelectItem>
                  <SelectItem value="tai_lieu_tham_khao">Tài Liệu Tham Khảo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit_url_file">URL File</Label>
              <Input
                id="edit_url_file"
                value={editFormData.url_file}
                onChange={(e) => setEditFormData({ ...editFormData, url_file: e.target.value })}
                placeholder="https://drive.google.com/file/d/..."
              />
            </div>
            <div>
              <Label htmlFor="edit_ghi_chu">Ghi Chú</Label>
              <Input
                id="edit_ghi_chu"
                value={editFormData.ghi_chu}
                onChange={(e) => setEditFormData({ ...editFormData, ghi_chu: e.target.value })}
                placeholder="Ghi chú bổ sung"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleUpdateSubDocument} className="flex-1">
                Cập Nhật
              </Button>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">
                Hủy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa tài liệu con</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedSubDocument && (
                <>
                  Bạn có chắc chắn muốn xóa tài liệu con <strong>"{selectedSubDocument.ten_tai_lieu_con}"</strong>?
                  <br />
                  <br />
                  Tài liệu con sẽ được chuyển vào thùng rác và có thể khôi phục sau này.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setIsDeleteDialogOpen(false)
              setSelectedSubDocument(null)
            }}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction 
              variant="destructive"
              onClick={confirmDeleteSubDocument}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}