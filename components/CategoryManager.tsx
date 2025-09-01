'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Edit, Trash2, Shield, FileType, Activity, Calendar } from 'lucide-react'

interface TieuChuan {
  id: string
  ten_tieu_chuan: string
  ma_tieu_chuan: string
  mo_ta: string
  phien_ban: string
  ngay_ban_hanh: string
  trang_thai: string
}

interface LoaiTaiLieu {
  id: string
  ma_loai: string
  ten_loai: string
  mo_ta: string
  mau_sac: string
  thu_tu: string
}

interface TrangThai {
  id: string
  ma_trang_thai: string
  ten_trang_thai: string
  mo_ta: string
  mau_sac: string
  thu_tu: string
}

interface Categories {
  tieu_chuan: TieuChuan[]
  loai_tai_lieu: LoaiTaiLieu[]
  trang_thai: TrangThai[]
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<Categories>({
    tieu_chuan: [],
    loai_tai_lieu: [],
    trang_thai: []
  })
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<'tieu_chuan' | 'loai_tai_lieu' | 'trang_thai'>('tieu_chuan')

  // Form states
  const [tieuChuanForm, setTieuChuanForm] = useState({
    ten_tieu_chuan: '',
    ma_tieu_chuan: '',
    mo_ta: '',
    phien_ban: '',
    ngay_ban_hanh: ''
  })

  const [loaiTaiLieuForm, setLoaiTaiLieuForm] = useState({
    ma_loai: '',
    ten_loai: '',
    mo_ta: '',
    mau_sac: 'blue',
    thu_tu: ''
  })

  const [trangThaiForm, setTrangThaiForm] = useState({
    ma_trang_thai: '',
    ten_trang_thai: '',
    mo_ta: '',
    mau_sac: 'green',
    thu_tu: ''
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Lỗi khi tải danh mục:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCategory = async () => {
    try {
      let data: any = {}
      
      switch (currentCategory) {
        case 'tieu_chuan':
          data = tieuChuanForm
          break
        case 'loai_tai_lieu':
          data = loaiTaiLieuForm
          break
        case 'trang_thai':
          data = trangThaiForm
          break
      }

      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: currentCategory,
          data
        }),
      })

      if (response.ok) {
        await fetchCategories()
        resetForms()
        setIsCreateDialogOpen(false)
      } else {
        console.error('Lỗi khi tạo danh mục')
      }
    } catch (error) {
      console.error('Lỗi khi tạo danh mục:', error)
    }
  }

  const resetForms = () => {
    setTieuChuanForm({
      ten_tieu_chuan: '',
      ma_tieu_chuan: '',
      mo_ta: '',
      phien_ban: '',
      ngay_ban_hanh: ''
    })
    setLoaiTaiLieuForm({
      ma_loai: '',
      ten_loai: '',
      mo_ta: '',
      mau_sac: 'blue',
      thu_tu: ''
    })
    setTrangThaiForm({
      ma_trang_thai: '',
      ten_trang_thai: '',
      mo_ta: '',
      mau_sac: 'green',
      thu_tu: ''
    })
  }

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      purple: 'bg-purple-100 text-purple-800',
      orange: 'bg-orange-100 text-orange-800',
      gray: 'bg-gray-100 text-gray-800'
    }
    return colors[color] || colors.gray
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Quản Lý Danh Mục</h2>
        <p className="text-muted-foreground">
          Quản lý các danh mục hỗ trợ nhập liệu: tiêu chuẩn, loại tài liệu, trạng thái
        </p>
      </div>

      {/* Create Button */}
      <div className="flex justify-end">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm Danh Mục
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Thêm Danh Mục Mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category-type">Loại Danh Mục</Label>
                <Select value={currentCategory} onValueChange={(value: any) => setCurrentCategory(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tieu_chuan">Tiêu Chuẩn</SelectItem>
                    <SelectItem value="loai_tai_lieu">Loại Tài Liệu</SelectItem>
                    <SelectItem value="trang_thai">Trạng Thái</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Form cho Tiêu Chuẩn */}
              {currentCategory === 'tieu_chuan' && (
                <>
                  <div>
                    <Label htmlFor="ten_tieu_chuan">Tên Tiêu Chuẩn</Label>
                    <Input
                      id="ten_tieu_chuan"
                      value={tieuChuanForm.ten_tieu_chuan}
                      onChange={(e) => setTieuChuanForm({...tieuChuanForm, ten_tieu_chuan: e.target.value})}
                      placeholder="VD: ISO 9001:2015"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ma_tieu_chuan">Mã Tiêu Chuẩn</Label>
                    <Input
                      id="ma_tieu_chuan"
                      value={tieuChuanForm.ma_tieu_chuan}
                      onChange={(e) => setTieuChuanForm({...tieuChuanForm, ma_tieu_chuan: e.target.value})}
                      placeholder="VD: ISO9001-2015"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mo_ta">Mô Tả</Label>
                    <Input
                      id="mo_ta"
                      value={tieuChuanForm.mo_ta}
                      onChange={(e) => setTieuChuanForm({...tieuChuanForm, mo_ta: e.target.value})}
                      placeholder="Mô tả tiêu chuẩn"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phien_ban">Phiên Bản</Label>
                    <Input
                      id="phien_ban"
                      value={tieuChuanForm.phien_ban}
                      onChange={(e) => setTieuChuanForm({...tieuChuanForm, phien_ban: e.target.value})}
                      placeholder="VD: 2015"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ngay_ban_hanh">Ngày Ban Hành</Label>
                    <Input
                      id="ngay_ban_hanh"
                      type="date"
                      value={tieuChuanForm.ngay_ban_hanh}
                      onChange={(e) => setTieuChuanForm({...tieuChuanForm, ngay_ban_hanh: e.target.value})}
                    />
                  </div>
                </>
              )}

              {/* Form cho Loại Tài Liệu */}
              {currentCategory === 'loai_tai_lieu' && (
                <>
                  <div>
                    <Label htmlFor="ma_loai">Mã Loại</Label>
                    <Input
                      id="ma_loai"
                      value={loaiTaiLieuForm.ma_loai}
                      onChange={(e) => setLoaiTaiLieuForm({...loaiTaiLieuForm, ma_loai: e.target.value})}
                      placeholder="VD: quy_trinh"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ten_loai">Tên Loại</Label>
                    <Input
                      id="ten_loai"
                      value={loaiTaiLieuForm.ten_loai}
                      onChange={(e) => setLoaiTaiLieuForm({...loaiTaiLieuForm, ten_loai: e.target.value})}
                      placeholder="VD: Quy Trình"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mo_ta_loai">Mô Tả</Label>
                    <Input
                      id="mo_ta_loai"
                      value={loaiTaiLieuForm.mo_ta}
                      onChange={(e) => setLoaiTaiLieuForm({...loaiTaiLieuForm, mo_ta: e.target.value})}
                      placeholder="Mô tả loại tài liệu"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mau_sac">Màu Sắc</Label>
                    <Select value={loaiTaiLieuForm.mau_sac} onValueChange={(value) => setLoaiTaiLieuForm({...loaiTaiLieuForm, mau_sac: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blue">Xanh Dương</SelectItem>
                        <SelectItem value="green">Xanh Lá</SelectItem>
                        <SelectItem value="red">Đỏ</SelectItem>
                        <SelectItem value="yellow">Vàng</SelectItem>
                        <SelectItem value="purple">Tím</SelectItem>
                        <SelectItem value="orange">Cam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Form cho Trạng Thái */}
              {currentCategory === 'trang_thai' && (
                <>
                  <div>
                    <Label htmlFor="ma_trang_thai">Mã Trạng Thái</Label>
                    <Input
                      id="ma_trang_thai"
                      value={trangThaiForm.ma_trang_thai}
                      onChange={(e) => setTrangThaiForm({...trangThaiForm, ma_trang_thai: e.target.value})}
                      placeholder="VD: hieu_luc"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ten_trang_thai">Tên Trạng Thái</Label>
                    <Input
                      id="ten_trang_thai"
                      value={trangThaiForm.ten_trang_thai}
                      onChange={(e) => setTrangThaiForm({...trangThaiForm, ten_trang_thai: e.target.value})}
                      placeholder="VD: Hiệu Lực"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mo_ta_trang_thai">Mô Tả</Label>
                    <Input
                      id="mo_ta_trang_thai"
                      value={trangThaiForm.mo_ta}
                      onChange={(e) => setTrangThaiForm({...trangThaiForm, mo_ta: e.target.value})}
                      placeholder="Mô tả trạng thái"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mau_sac_trang_thai">Màu Sắc</Label>
                    <Select value={trangThaiForm.mau_sac} onValueChange={(value) => setTrangThaiForm({...trangThaiForm, mau_sac: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="green">Xanh Lá</SelectItem>
                        <SelectItem value="red">Đỏ</SelectItem>
                        <SelectItem value="yellow">Vàng</SelectItem>
                        <SelectItem value="blue">Xanh Dương</SelectItem>
                        <SelectItem value="purple">Tím</SelectItem>
                        <SelectItem value="orange">Cam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <Button onClick={handleCreateCategory} className="w-full">
                Tạo Danh Mục
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Tabs */}
      <Tabs defaultValue="tieu_chuan" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tieu_chuan" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Tiêu Chuẩn
          </TabsTrigger>
          <TabsTrigger value="loai_tai_lieu" className="flex items-center gap-2">
            <FileType className="h-4 w-4" />
            Loại Tài Liệu
          </TabsTrigger>
          <TabsTrigger value="trang_thai" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Trạng Thái
          </TabsTrigger>
        </TabsList>

        {/* Tiêu Chuẩn Tab */}
        <TabsContent value="tieu_chuan">
          <Card>
            <CardHeader>
              <CardTitle>Danh Sách Tiêu Chuẩn</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên Tiêu Chuẩn</TableHead>
                    <TableHead>Mã Tiêu Chuẩn</TableHead>
                    <TableHead>Mô Tả</TableHead>
                    <TableHead>Phiên Bản</TableHead>
                    <TableHead>Ngày Ban Hành</TableHead>
                    <TableHead>Trạng Thái</TableHead>
                    <TableHead>Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.tieu_chuan.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.ten_tieu_chuan}</TableCell>
                      <TableCell>{item.ma_tieu_chuan}</TableCell>
                      <TableCell>{item.mo_ta}</TableCell>
                      <TableCell>{item.phien_ban}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          {item.ngay_ban_hanh}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.trang_thai === 'hieu_luc' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.trang_thai === 'hieu_luc' ? 'Hiệu lực' : 'Hết hiệu lực'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
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
        </TabsContent>

        {/* Loại Tài Liệu Tab */}
        <TabsContent value="loai_tai_lieu">
          <Card>
            <CardHeader>
              <CardTitle>Danh Sách Loại Tài Liệu</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã Loại</TableHead>
                    <TableHead>Tên Loại</TableHead>
                    <TableHead>Mô Tả</TableHead>
                    <TableHead>Màu Sắc</TableHead>
                    <TableHead>Thứ Tự</TableHead>
                    <TableHead>Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.loai_tai_lieu.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono">{item.ma_loai}</TableCell>
                      <TableCell className="font-medium">{item.ten_loai}</TableCell>
                      <TableCell>{item.mo_ta}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getColorClass(item.mau_sac)}`}>
                          {item.ten_loai}
                        </span>
                      </TableCell>
                      <TableCell>{item.thu_tu}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
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
        </TabsContent>

        {/* Trạng Thái Tab */}
        <TabsContent value="trang_thai">
          <Card>
            <CardHeader>
              <CardTitle>Danh Sách Trạng Thái</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã Trạng Thái</TableHead>
                    <TableHead>Tên Trạng Thái</TableHead>
                    <TableHead>Mô Tả</TableHead>
                    <TableHead>Màu Sắc</TableHead>
                    <TableHead>Thứ Tự</TableHead>
                    <TableHead>Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.trang_thai.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono">{item.ma_trang_thai}</TableCell>
                      <TableCell className="font-medium">{item.ten_trang_thai}</TableCell>
                      <TableCell>{item.mo_ta}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getColorClass(item.mau_sac)}`}>
                          {item.ten_trang_thai}
                        </span>
                      </TableCell>
                      <TableCell>{item.thu_tu}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
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
        </TabsContent>
      </Tabs>
    </div>
  )
}