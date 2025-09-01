'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Edit, History } from 'lucide-react'

interface TaiLieu {
  id: string
  ten_tai_lieu: string
  mo_ta: string
  loai_tai_lieu: string
  trang_thai: string
  nguoi_tao: string
  ngay_tao: string
  phien_ban_hien_tai: string
  tieu_chuan_ap_dung: string
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
  const [taiLieuList, setTaiLieuList] = useState<TaiLieu[]>([])
  const [phienBanList, setPhienBanList] = useState<PhienBan[]>([])
  const [selectedTaiLieu, setSelectedTaiLieu] = useState<TaiLieu | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isVersionDialogOpen, setIsVersionDialogOpen] = useState(false)
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    ten_tai_lieu: '',
    mo_ta: '',
    loai_tai_lieu: 'tai_lieu_ky_thuat',
    tieu_chuan_ap_dung: 'ISO 9001:2015'
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
      tieu_chuan_ap_dung: 'ISO 9001:2015'
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
      tieu_chuan_ap_dung: 'Nội bộ'
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
          tieu_chuan_ap_dung: ''
        })
        setIsCreateDialogOpen(false)
      } else {
        console.error('Lỗi khi tạo tài liệu')
      }
    } catch (error) {
      console.error('Lỗi khi tạo tài liệu:', error)
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
      } else {
        console.error('Lỗi khi tạo phiên bản')
      }
    } catch (error) {
      console.error('Lỗi khi tạo phiên bản:', error)
    }
  }

  const getDocumentVersions = (taiLieuId: string) => {
    return phienBanList.filter(version => version.tai_lieu_id === taiLieuId)
  }

  return (
    <div className="space-y-6">
      {/* Header với nút tạo mới */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Danh Sách Tài Liệu</h2>
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
                  onChange={(e) => setFormData({...formData, ten_tai_lieu: e.target.value})}
                  placeholder="Nhập tên tài liệu"
                />
              </div>
              <div>
                <Label htmlFor="mo_ta">Mô Tả</Label>
                <Input
                  id="mo_ta"
                  value={formData.mo_ta}
                  onChange={(e) => setFormData({...formData, mo_ta: e.target.value})}
                  placeholder="Nhập mô tả tài liệu"
                />
              </div>
              <div>
                <Label htmlFor="loai_tai_lieu">Loại Tài Liệu</Label>
                <Select value={formData.loai_tai_lieu} onValueChange={(value) => setFormData({...formData, loai_tai_lieu: value})}>
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
                <Select value={formData.tieu_chuan_ap_dung} onValueChange={(value) => setFormData({...formData, tieu_chuan_ap_dung: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tiêu chuẩn" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.tieu_chuan.length > 0 ? (
                      categories.tieu_chuan.filter(tc => tc.ten_tieu_chuan && tc.ten_tieu_chuan.trim() !== '').map((tc) => (
                        <SelectItem key={tc.id} value={tc.ten_tieu_chuan}>
                          {tc.ten_tieu_chuan}
                        </SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="ISO 9001:2015">ISO 9001:2015</SelectItem>
                        <SelectItem value="ISO 14001:2015">ISO 14001:2015</SelectItem>
                        <SelectItem value="Nội bộ">Nội bộ</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
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
                <TableHead>Ngày Tạo</TableHead>
                <TableHead>Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taiLieuList.map((taiLieu) => (
                <TableRow key={taiLieu.id}>
                  <TableCell className="font-medium">{taiLieu.ten_tai_lieu}</TableCell>
                  <TableCell>{taiLieu.loai_tai_lieu}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      taiLieu.trang_thai === 'hieu_luc' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {taiLieu.trang_thai === 'hieu_luc' ? 'Hiệu lực' : 'Hết hiệu lực'}
                    </span>
                  </TableCell>
                  <TableCell>{taiLieu.phien_ban_hien_tai}</TableCell>
                  <TableCell>{taiLieu.tieu_chuan_ap_dung}</TableCell>
                  <TableCell>{taiLieu.ngay_tao}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTaiLieu(taiLieu)
                          setIsVersionDialogOpen(true)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTaiLieu(taiLieu)
                          setIsHistoryDialogOpen(true)
                        }}
                      >
                        <History className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card> 
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
                  onChange={(e) => setVersionFormData({...versionFormData, so_phien_ban: e.target.value})}
                  placeholder="VD: 2.1"
                />
              </div>
              <div>
                <Label htmlFor="noi_dung">Nội Dung Thay Đổi</Label>
                <Input
                  id="noi_dung"
                  value={versionFormData.noi_dung}
                  onChange={(e) => setVersionFormData({...versionFormData, noi_dung: e.target.value})}
                  placeholder="Mô tả những thay đổi trong phiên bản này"
                />
              </div>
              <div>
                <Label htmlFor="ghi_chu">Ghi Chú</Label>
                <Input
                  id="ghi_chu"
                  value={versionFormData.ghi_chu}
                  onChange={(e) => setVersionFormData({...versionFormData, ghi_chu: e.target.value})}
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
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          version.trang_thai === 'hieu_luc' 
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
    </div>
  )
}