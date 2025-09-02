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
import { MultiSelect } from '@/components/ui/multi-select'
import SubDocumentManager from '@/components/SubDocumentManager'
import { Plus, Edit, History, Trash2, FileText, Calendar, Clock } from 'lucide-react'
import { useToast } from '@/components/ui/toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DocumentLifecycleForm from './DocumentLifecycleFormNew'
import DocumentLifecycleDashboard from './DocumentLifecycleDashboard'
import { DocumentLifecycle } from '@/lib/types/document-lifecycle'

interface TaiLieu {
  id: string
  ten_tai_lieu: string
  mo_ta: string
  loai_tai_lieu: string
  trang_thai: string
  nguoi_tao: string
  ngay_tao: string
  phien_ban_hien_tai: string
  tieu_chuan_ap_dung: string | string[] // Hỗ trợ cả string và array
  url_file?: string
}

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

export default function DocumentManager() {
  const { addToast } = useToast()
  const [taiLieuList, setTaiLieuList] = useState<TaiLieu[]>([])
  const [phienBanList, setPhienBanList] = useState<PhienBan[]>([])
  const [selectedTaiLieu, setSelectedTaiLieu] = useState<TaiLieu | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isVersionDialogOpen, setIsVersionDialogOpen] = useState(false)
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLifecycleDialogOpen, setIsLifecycleDialogOpen] = useState(false)
  const [lifecycleMode, setLifecycleMode] = useState<'create' | 'edit'>('create')
  const [selectedLifecycleDoc, setSelectedLifecycleDoc] = useState<Partial<DocumentLifecycle> | null>(null)
  const [activeTab, setActiveTab] = useState('documents')
  const [isSubDocumentDialogOpen, setIsSubDocumentDialogOpen] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState<TaiLieu | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    ten_tai_lieu: '',
    mo_ta: '',
    loai_tai_lieu: 'tai_lieu_ky_thuat',
    tieu_chuan_ap_dung: [] as string[],
    url_file: ''
  })

  const [editFormData, setEditFormData] = useState({
    ten_tai_lieu: '',
    mo_ta: '',
    loai_tai_lieu: '',
    tieu_chuan_ap_dung: [] as string[],
    url_file: ''
  })

  const [categories, setCategories] = useState<{
    tieu_chuan: any[]
    loai_tai_lieu: any[]
    trang_thai: any[]
  }>({
    tieu_chuan: [],
    loai_tai_lieu: [],
    trang_thai: []
  })

  const [versionFormData, setVersionFormData] = useState({
    so_phien_ban: '',
    noi_dung: '',
    ghi_chu: ''
  })

  // Fetch dữ liệu từ Google Sheets hoặc dùng mock data
  useEffect(() => {
    fetchTaiLieu()
    fetchPhienBan()
    fetchCategories()
  }, [])

  const fetchTaiLieu = async () => {
    try {
      const response = await fetch('/api/documents')
      if (response.ok) {
        const data = await response.json()
        setTaiLieuList(data)
      } else {
        // Fallback to mock data nếu API chưa hoạt động
        console.log('Sử dụng dữ liệu mẫu')
        setTaiLieuList(mockTaiLieu)
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách tài liệu, sử dụng dữ liệu mẫu:', error)
      setTaiLieuList(mockTaiLieu)
      addToast({
        type: 'warning',
        title: 'Cảnh báo!',
        description: 'Không thể kết nối Google Sheets, đang sử dụng dữ liệu mẫu'
      })
    }
  }

  const fetchPhienBan = async () => {
    try {
      const response = await fetch('/api/versions')
      if (response.ok) {
        const data = await response.json()
        setPhienBanList(data)
      } else {
        // Fallback to mock data nếu API chưa hoạt động
        setPhienBanList(mockPhienBan)
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách phiên bản, sử dụng dữ liệu mẫu:', error)
      setPhienBanList(mockPhienBan)
      // Không hiển thị toast cho phiên bản vì đã hiển thị cho tài liệu
    }
  }

  // Mock data để demo
  const mockTaiLieu: TaiLieu[] = [
    {
      id: '1',
      ten_tai_lieu: 'Quy trình kiểm tra chất lượng sản phẩm',
      mo_ta: 'Tài liệu mô tả quy trình kiểm tra chất lượng cho tất cả sản phẩm',
      loai_tai_lieu: 'quy_trinh',
      trang_thai: 'hieu_luc',
      nguoi_tao: 'Nguyễn Văn A',
      ngay_tao: '2024-01-15',
      phien_ban_hien_tai: '2.1',
      tieu_chuan_ap_dung: 'ISO 9001:2015; ISO 14001:2015',
      url_file: 'https://drive.google.com/file/d/1abc123/view'
    },
    {
      id: '2',
      ten_tai_lieu: 'Hướng dẫn sử dụng hệ thống ERP',
      mo_ta: 'Tài liệu hướng dẫn chi tiết cách sử dụng hệ thống ERP',
      loai_tai_lieu: 'huong_dan',
      trang_thai: 'hieu_luc',
      nguoi_tao: 'Trần Thị B',
      ngay_tao: '2024-02-01',
      phien_ban_hien_tai: '1.0',
      tieu_chuan_ap_dung: 'Nội bộ; ISO 45001:2018',
      url_file: ''
    }
  ]

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Lỗi khi tải danh mục:', error)
    }
  }

  const mockPhienBan: PhienBan[] = [
    {
      id: '1',
      tai_lieu_id: '1',
      so_phien_ban: '2.1',
      noi_dung: 'Cập nhật quy trình kiểm tra theo tiêu chuẩn mới',
      ghi_chu: 'Thêm bước kiểm tra bổ sung',
      nguoi_tao: 'Nguyễn Văn A',
      ngay_tao: '2024-03-01',
      trang_thai: 'hieu_luc'
    },
    {
      id: '2',
      tai_lieu_id: '1',
      so_phien_ban: '2.0',
      noi_dung: 'Cập nhật quy trình theo yêu cầu khách hàng',
      ghi_chu: 'Điều chỉnh thời gian kiểm tra',
      nguoi_tao: 'Nguyễn Văn A',
      ngay_tao: '2024-02-15',
      trang_thai: 'het_hieu_luc'
    }
  ]

  const handleCreateDocument = async () => {
    try {
      const response = await fetch('/api/documents', {
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
        await fetchTaiLieu() // Tải lại danh sách
        await fetchPhienBan() // Tải lại phiên bản
        setFormData({
          ten_tai_lieu: '',
          mo_ta: '',
          loai_tai_lieu: 'tai_lieu_ky_thuat',
          tieu_chuan_ap_dung: [],
          url_file: ''
        })
        setIsCreateDialogOpen(false)
        addToast({
          type: 'success',
          title: 'Thành công!',
          description: 'Tài liệu đã được tạo thành công'
        })
      } else {
        addToast({
          type: 'error',
          title: 'Lỗi!',
          description: 'Không thể tạo tài liệu. Vui lòng thử lại.'
        })
      }
    } catch (error) {
      console.error('Lỗi khi tạo tài liệu:', error)
      addToast({
        type: 'error',
        title: 'Lỗi!',
        description: 'Có lỗi xảy ra khi tạo tài liệu'
      })
    }
  }

  const handleCreateVersion = async () => {
    if (!selectedTaiLieu) return

    try {
      const response = await fetch('/api/versions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tai_lieu_id: selectedTaiLieu.id,
          ...versionFormData,
          nguoi_tao: 'Người dùng hiện tại'
        }),
      })

      if (response.ok) {
        await fetchTaiLieu() // Tải lại danh sách tài liệu
        await fetchPhienBan() // Tải lại phiên bản
        setVersionFormData({
          so_phien_ban: '',
          noi_dung: '',
          ghi_chu: ''
        })
        setIsVersionDialogOpen(false)
        addToast({
          type: 'success',
          title: 'Thành công!',
          description: 'Phiên bản mới đã được tạo thành công'
        })
      } else {
        addToast({
          type: 'error',
          title: 'Lỗi!',
          description: 'Không thể tạo phiên bản mới. Vui lòng thử lại.'
        })
      }
    } catch (error) {
      console.error('Lỗi khi tạo phiên bản:', error)
      addToast({
        type: 'error',
        title: 'Lỗi!',
        description: 'Có lỗi xảy ra khi tạo phiên bản'
      })
    }
  }

  const getDocumentVersions = (taiLieuId: string) => {
    return phienBanList.filter(version => version.tai_lieu_id === taiLieuId)
  }

  const getLoaiTaiLieuName = (maLoai: string) => {
    // Tìm trong categories trước
    const loaiFromCategories = categories.loai_tai_lieu.find(loai => loai.ma_loai === maLoai)
    if (loaiFromCategories) {
      return loaiFromCategories.ten_loai
    }

    // Fallback mapping nếu không tìm thấy trong categories
    const loaiMapping: Record<string, string> = {
      'quy_trinh': 'Quy Trình',
      'huong_dan': 'Hướng Dẫn',
      'tai_lieu_ky_thuat': 'Tài Liệu Kỹ Thuật',
      'bieu_mau': 'Biểu Mẫu'
    }
    return loaiMapping[maLoai] || maLoai
  }

  const handleEditDocument = (taiLieu: TaiLieu) => {
    setSelectedTaiLieu(taiLieu)
    
    // Xử lý tiêu chuẩn - có thể là string hoặc array
    let tieuChuanArray: string[] = []
    if (typeof taiLieu.tieu_chuan_ap_dung === 'string') {
      // Nếu là string, tách bằng dấu phẩy hoặc semicolon
      tieuChuanArray = taiLieu.tieu_chuan_ap_dung
        .split(/[,;]/)
        .map(s => s.trim())
        .filter(s => s.length > 0)
    } else if (Array.isArray(taiLieu.tieu_chuan_ap_dung)) {
      tieuChuanArray = taiLieu.tieu_chuan_ap_dung
    }
    
    setEditFormData({
      ten_tai_lieu: taiLieu.ten_tai_lieu,
      mo_ta: taiLieu.mo_ta,
      loai_tai_lieu: taiLieu.loai_tai_lieu,
      tieu_chuan_ap_dung: tieuChuanArray,
      url_file: taiLieu.url_file || ''
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateDocument = async () => {
    if (!selectedTaiLieu) return

    try {
      const response = await fetch(`/api/documents/${selectedTaiLieu.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      })

      if (response.ok) {
        await fetchTaiLieu() // Tải lại danh sách
        setIsEditDialogOpen(false)
        setSelectedTaiLieu(null)
        addToast({
          type: 'success',
          title: 'Thành công!',
          description: 'Tài liệu đã được cập nhật thành công'
        })
      } else {
        addToast({
          type: 'error',
          title: 'Lỗi!',
          description: 'Không thể cập nhật tài liệu. Vui lòng thử lại.'
        })
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật tài liệu:', error)
      addToast({
        type: 'error',
        title: 'Lỗi!',
        description: 'Có lỗi xảy ra khi cập nhật tài liệu'
      })
    }
  }

  const handleDeleteDocument = (taiLieu: TaiLieu) => {
    setDocumentToDelete(taiLieu)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteDocument = async () => {
    if (!documentToDelete) return

    try {
      const response = await fetch(`/api/documents/${documentToDelete.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchTaiLieu() // Tải lại danh sách
        addToast({
          type: 'success',
          title: 'Thành công!',
          description: `Đã xóa tài liệu "${documentToDelete.ten_tai_lieu}"`
        })
      } else {
        addToast({
          type: 'error',
          title: 'Lỗi!',
          description: 'Không thể xóa tài liệu. Vui lòng thử lại.'
        })
      }
    } catch (error) {
      console.error('Lỗi khi xóa tài liệu:', error)
      addToast({
        type: 'error',
        title: 'Lỗi!',
        description: 'Có lỗi xảy ra khi xóa tài liệu'
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setDocumentToDelete(null)
    }
  }

  // Lifecycle management functions
  const handleCreateLifecycleDocument = () => {
    setSelectedLifecycleDoc(null)
    setLifecycleMode('create')
    setIsLifecycleDialogOpen(true)
  }

  const handleEditLifecycleDocument = (document: DocumentLifecycle) => {
    setSelectedLifecycleDoc(document)
    setLifecycleMode('edit')
    setIsLifecycleDialogOpen(true)
  }

  const handleSaveLifecycleDocument = async (data: Partial<DocumentLifecycle>) => {
    try {
      const url = lifecycleMode === 'create' 
        ? '/api/documents/lifecycle'
        : `/api/documents/lifecycle/${selectedLifecycleDoc?.id}`
      
      const method = lifecycleMode === 'create' ? 'POST' : 'PUT'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        setIsLifecycleDialogOpen(false)
        // Refresh data if needed
      }
    } catch (error) {
      console.error('Error saving lifecycle document:', error)
      throw error
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Quản lý Tài Liệu</h2>
          <p className="text-sm text-gray-600 mt-1">
            Quản lý tài liệu và vòng đời tài liệu
          </p>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Danh sách tài liệu
          </TabsTrigger>
          <TabsTrigger value="lifecycle" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Vòng đời tài liệu
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6">
          {/* Original Document Management Content */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">Danh Sách Tài Liệu</h3>
              <p className="text-sm text-gray-600 mt-1">
                Hiển thị {taiLieuList.length} tài liệu đang hoạt động
              </p>
            </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tạo Tài Liệu Mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tạo Tài Liệu Mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="ten_tai_lieu">Tên Tài Liệu</Label>
                <Input
                  id="ten_tai_lieu"
                  value={formData.ten_tai_lieu}
                  onChange={(e) => setFormData({ ...formData, ten_tai_lieu: e.target.value })}
                  placeholder="Nhập tên tài liệu"
                />
              </div>
              <div>
                <Label htmlFor="mo_ta">Mô Tả</Label>
                <Input
                  id="mo_ta"
                  value={formData.mo_ta}
                  onChange={(e) => setFormData({ ...formData, mo_ta: e.target.value })}
                  placeholder="Nhập mô tả tài liệu"
                />
              </div>
              <div>
                <Label htmlFor="loai_tai_lieu">Loại Tài Liệu</Label>
                <Select value={formData.loai_tai_lieu} onValueChange={(value) => setFormData({ ...formData, loai_tai_lieu: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.loai_tai_lieu.length > 0 ? (
                      categories.loai_tai_lieu.filter(loai => loai.ma_loai && loai.ma_loai.trim() !== '').map((loai) => (
                        <SelectItem key={loai.id} value={loai.ma_loai}>
                          {loai.ten_loai}
                        </SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="quy_trinh">Quy Trình</SelectItem>
                        <SelectItem value="huong_dan">Hướng Dẫn</SelectItem>
                        <SelectItem value="tai_lieu_ky_thuat">Tài Liệu Kỹ Thuật</SelectItem>
                        <SelectItem value="bieu_mau">Biểu Mẫu</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tieu_chuan_ap_dung">Tiêu Chuẩn Áp Dụng</Label>
                <MultiSelect
                  options={categories.tieu_chuan.length > 0 
                    ? categories.tieu_chuan
                        .filter(tc => tc.ten_tieu_chuan && tc.ten_tieu_chuan.trim() !== '')
                        .map(tc => ({
                          value: tc.ten_tieu_chuan,
                          label: tc.ten_tieu_chuan
                        }))
                    : [
                        { value: "ISO 9001:2015", label: "ISO 9001:2015" },
                        { value: "ISO 14001:2015", label: "ISO 14001:2015" },
                        { value: "ISO 45001:2018", label: "ISO 45001:2018" },
                        { value: "Nội bộ", label: "Nội bộ" }
                      ]
                  }
                  selected={formData.tieu_chuan_ap_dung}
                  onChange={(selected) => setFormData({...formData, tieu_chuan_ap_dung: selected})}
                  placeholder="Chọn tiêu chuẩn áp dụng..."
                />
              </div>
              <div>
                <Label htmlFor="url_file">URL File Tài Liệu</Label>
                <Input
                  id="url_file"
                  value={formData.url_file}
                  onChange={(e) => setFormData({ ...formData, url_file: e.target.value })}
                  placeholder="https://drive.google.com/file/d/..."
                />
              </div>
              <Button onClick={handleCreateDocument} className="w-full">
                Tạo Tài Liệu
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Bảng danh sách tài liệu */}
      <Card>
        <CardHeader>
          <CardTitle>Tài Liệu</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên Tài Liệu</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead>Phiên Bản</TableHead>
                <TableHead>Tiêu Chuẩn</TableHead>
                <TableHead>URL File</TableHead>
                <TableHead>Ngày Tạo</TableHead>
                <TableHead>Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taiLieuList.map((taiLieu) => (
                <TableRow key={taiLieu.id}>
                  <TableCell className="font-medium">{taiLieu.ten_tai_lieu}</TableCell>
                  <TableCell>{getLoaiTaiLieuName(taiLieu.loai_tai_lieu)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${taiLieu.trang_thai === 'hieu_luc'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {taiLieu.trang_thai === 'hieu_luc' ? 'Hiệu lực' : 'Hết hiệu lực'}
                    </span>
                  </TableCell>
                  <TableCell>{taiLieu.phien_ban_hien_tai}</TableCell>
                  <TableCell>
                    {typeof taiLieu.tieu_chuan_ap_dung === 'string' 
                      ? taiLieu.tieu_chuan_ap_dung
                      : Array.isArray(taiLieu.tieu_chuan_ap_dung)
                        ? taiLieu.tieu_chuan_ap_dung.join(', ')
                        : taiLieu.tieu_chuan_ap_dung
                    }
                  </TableCell>
                  <TableCell>
                    {taiLieu.url_file ? (
                      <a
                        href={taiLieu.url_file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        Xem file
                      </a>
                    ) : (
                      <span className="text-gray-400">Chưa có</span>
                    )}
                  </TableCell>
                  <TableCell>{taiLieu.ngay_tao}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditDocument(taiLieu)}
                        title="Sửa tài liệu"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTaiLieu(taiLieu)
                          setIsVersionDialogOpen(true)
                        }}
                        title="Tạo phiên bản mới"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTaiLieu(taiLieu)
                          setIsHistoryDialogOpen(true)
                        }}
                        title="Xem lịch sử"
                      >
                        <History className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTaiLieu(taiLieu)
                          setIsSubDocumentDialogOpen(true)
                        }}
                        title="Quản lý tài liệu con"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDocument(taiLieu)}
                        title="Xóa tài liệu"
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
        </CardContent>
      </Card>

      {/* Dialog sửa tài liệu */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Sửa Tài Liệu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit_ten_tai_lieu">Tên Tài Liệu</Label>
              <Input
                id="edit_ten_tai_lieu"
                value={editFormData.ten_tai_lieu}
                onChange={(e) => setEditFormData({ ...editFormData, ten_tai_lieu: e.target.value })}
                placeholder="Nhập tên tài liệu"
              />
            </div>
            <div>
              <Label htmlFor="edit_mo_ta">Mô Tả</Label>
              <Input
                id="edit_mo_ta"
                value={editFormData.mo_ta}
                onChange={(e) => setEditFormData({ ...editFormData, mo_ta: e.target.value })}
                placeholder="Nhập mô tả tài liệu"
              />
            </div>
            <div>
              <Label htmlFor="edit_loai_tai_lieu">Loại Tài Liệu</Label>
              <Select value={editFormData.loai_tai_lieu} onValueChange={(value) => setEditFormData({ ...editFormData, loai_tai_lieu: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.loai_tai_lieu.length > 0 ? (
                    categories.loai_tai_lieu.filter(loai => loai.ma_loai && loai.ma_loai.trim() !== '').map((loai) => (
                      <SelectItem key={loai.id} value={loai.ma_loai}>
                        {loai.ten_loai}
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      <SelectItem value="quy_trinh">Quy Trình</SelectItem>
                      <SelectItem value="huong_dan">Hướng Dẫn</SelectItem>
                      <SelectItem value="tai_lieu_ky_thuat">Tài Liệu Kỹ Thuật</SelectItem>
                      <SelectItem value="bieu_mau">Biểu Mẫu</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit_tieu_chuan_ap_dung">Tiêu Chuẩn Áp Dụng</Label>
              <MultiSelect
                options={categories.tieu_chuan.length > 0 
                  ? categories.tieu_chuan
                      .filter(tc => tc.ten_tieu_chuan && tc.ten_tieu_chuan.trim() !== '')
                      .map(tc => ({
                        value: tc.ten_tieu_chuan,
                        label: tc.ten_tieu_chuan
                      }))
                  : [
                      { value: "ISO 9001:2015", label: "ISO 9001:2015" },
                      { value: "ISO 14001:2015", label: "ISO 14001:2015" },
                      { value: "ISO 45001:2018", label: "ISO 45001:2018" },
                      { value: "Nội bộ", label: "Nội bộ" }
                    ]
                }
                selected={editFormData.tieu_chuan_ap_dung}
                onChange={(selected) => setEditFormData({...editFormData, tieu_chuan_ap_dung: selected})}
                placeholder="Chọn tiêu chuẩn áp dụng..."
              />
            </div>
            <div>
              <Label htmlFor="edit_url_file">URL File Tài Liệu</Label>
              <Input
                id="edit_url_file"
                value={editFormData.url_file}
                onChange={(e) => setEditFormData({ ...editFormData, url_file: e.target.value })}
                placeholder="https://drive.google.com/file/d/..."
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleUpdateDocument} className="flex-1">
                Cập Nhật
              </Button>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">
                Hủy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog tạo phiên bản mới */}
      <Dialog open={isVersionDialogOpen} onOpenChange={setIsVersionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo Phiên Bản Mới</DialogTitle>
          </DialogHeader>
          {selectedTaiLieu && (
            <div className="space-y-4">
              <div>
                <Label>Tài Liệu: {selectedTaiLieu.ten_tai_lieu}</Label>
              </div>
              <div>
                <Label htmlFor="so_phien_ban">Số Phiên Bản</Label>
                <Input
                  id="so_phien_ban"
                  value={versionFormData.so_phien_ban}
                  onChange={(e) => setVersionFormData({ ...versionFormData, so_phien_ban: e.target.value })}
                  placeholder="VD: 2.1"
                />
              </div>
              <div>
                <Label htmlFor="noi_dung">Nội Dung Thay Đổi</Label>
                <Input
                  id="noi_dung"
                  value={versionFormData.noi_dung}
                  onChange={(e) => setVersionFormData({ ...versionFormData, noi_dung: e.target.value })}
                  placeholder="Mô tả những thay đổi trong phiên bản này"
                />
              </div>
              <div>
                <Label htmlFor="ghi_chu">Ghi Chú</Label>
                <Input
                  id="ghi_chu"
                  value={versionFormData.ghi_chu}
                  onChange={(e) => setVersionFormData({ ...versionFormData, ghi_chu: e.target.value })}
                  placeholder="Ghi chú bổ sung"
                />
              </div>
              <Button onClick={handleCreateVersion} className="w-full">
                Tạo Phiên Bản
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog xem lịch sử phiên bản */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Lịch Sử Phiên Bản</DialogTitle>
          </DialogHeader>
          {selectedTaiLieu && (
            <div className="space-y-4">
              <div>
                <Label>Tài Liệu: {selectedTaiLieu.ten_tai_lieu}</Label>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Phiên Bản</TableHead>
                    <TableHead>Nội Dung</TableHead>
                    <TableHead>Ghi Chú</TableHead>
                    <TableHead>Người Tạo</TableHead>
                    <TableHead>Ngày Tạo</TableHead>
                    <TableHead>Trạng Thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getDocumentVersions(selectedTaiLieu.id).map((version) => (
                    <TableRow key={version.id}>
                      <TableCell className="font-medium">{version.so_phien_ban}</TableCell>
                      <TableCell>{version.noi_dung}</TableCell>
                      <TableCell>{version.ghi_chu}</TableCell>
                      <TableCell>{version.nguoi_tao}</TableCell>
                      <TableCell>{version.ngay_tao}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${version.trang_thai === 'hieu_luc'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                          }`}>
                          {version.trang_thai === 'hieu_luc' ? 'Hiệu lực' : 'Hết hiệu lực'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog quản lý tài liệu con */}
      <Dialog open={isSubDocumentDialogOpen} onOpenChange={setIsSubDocumentDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quản Lý Tài Liệu Con</DialogTitle>
          </DialogHeader>
          {selectedTaiLieu && (
            <SubDocumentManager 
              documentId={selectedTaiLieu.id}
              documentName={selectedTaiLieu.ten_tai_lieu}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa tài liệu */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa tài liệu</AlertDialogTitle>
            <AlertDialogDescription>
              {documentToDelete && (
                <>
                  Bạn có chắc chắn muốn xóa tài liệu <strong>"{documentToDelete.ten_tai_lieu}"</strong>?
                  <br />
                  <br />
                  Hành động này sẽ đánh dấu tài liệu là đã xóa và không thể hoàn tác.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setIsDeleteDialogOpen(false)
              setDocumentToDelete(null)
            }}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={confirmDeleteDocument}
            >
              Xóa tài liệu
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
        </TabsContent>

        <TabsContent value="lifecycle" className="space-y-6">
          <DocumentLifecycleDashboard
            onCreateDocument={handleCreateLifecycleDocument}
            onEditDocument={handleEditLifecycleDocument}
          />
        </TabsContent>
      </Tabs>

      {/* Lifecycle Document Dialog */}
      <Dialog open={isLifecycleDialogOpen} onOpenChange={setIsLifecycleDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {lifecycleMode === 'create' ? 'Tạo tài liệu mới' : 'Chỉnh sửa tài liệu'}
            </DialogTitle>
          </DialogHeader>
          <DocumentLifecycleForm
            document={selectedLifecycleDoc || undefined}
            onSave={handleSaveLifecycleDocument}
            onCancel={() => setIsLifecycleDialogOpen(false)}
            mode={lifecycleMode}
            currentUser={{
              id: '1',
              ho_ten: 'Người dùng hiện tại',
              phong_ban: 'IT',
              quyen_phe_duyet: ['C']
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}