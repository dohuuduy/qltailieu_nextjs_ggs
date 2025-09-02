'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Edit, Users, Shield, Loader2 } from 'lucide-react'

interface User {
  id: string
  ho_ten: string
  email: string
  ten_dang_nhap: string
  chuc_vu: string
  phong_ban: string
  quyen_phe_duyet: string[]
  trang_thai: string
  ngay_tao: string
  ngay_cap_nhat: string
}

interface Department {
  id: string
  ten_phong_ban: string
  ma_phong_ban: string
  truong_phong: string
  pho_phong: string[]
  mo_ta?: string
  trang_thai: string
}

interface UserFormData {
  ho_ten: string
  email: string
  ten_dang_nhap: string
  mat_khau: string
  chuc_vu: string
  phong_ban: string
  quyen_phe_duyet: string[]
  trang_thai: string
}

interface DepartmentFormData {
  ten_phong_ban: string
  ma_phong_ban: string
  truong_phong: string
  pho_phong: string[]
  mo_ta: string
  trang_thai: string
}

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false)
  const [isCreateDeptOpen, setIsCreateDeptOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editingDept, setEditingDept] = useState<Department | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Form data
  const [userForm, setUserForm] = useState<UserFormData>({
    ho_ten: '',
    email: '',
    ten_dang_nhap: '',
    mat_khau: '',
    chuc_vu: '',
    phong_ban: '',
    quyen_phe_duyet: [],
    trang_thai: 'active'
  })

  const [deptForm, setDeptForm] = useState<DepartmentFormData>({
    ten_phong_ban: '',
    ma_phong_ban: '',
    truong_phong: '',
    pho_phong: [],
    mo_ta: '',
    trang_thai: 'active'
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')

      // Fetch users and departments from API
      const [usersResponse, deptsResponse] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/departments')
      ])

      if (!usersResponse.ok || !deptsResponse.ok) {
        throw new Error('Failed to fetch data')
      }

      const usersData = await usersResponse.json()
      const deptsData = await deptsResponse.json()

      if (usersData.success) {
        setUsers(usersData.data)
      }

      if (deptsData.success) {
        setDepartments(deptsData.data)
      }

    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Không thể tải dữ liệu. Vui lòng kiểm tra kết nối.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async () => {
    try {
      setSubmitting(true)
      setError('')

      const isEditing = editingUser !== null
      const method = isEditing ? 'PUT' : 'POST'
      const requestBody = isEditing 
        ? { ...userForm, id: editingUser.id }
        : userForm

      const response = await fetch('/api/users', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        await fetchData() // Refresh data
        setIsCreateUserOpen(false)
        resetUserForm()
      } else {
        setError(data.error || (isEditing ? 'Không thể cập nhật người dùng' : 'Không thể tạo người dùng'))
      }
    } catch (error) {
      setError('Lỗi kết nối')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCreateDepartment = async () => {
    try {
      setSubmitting(true)
      setError('')

      const isEditing = editingDept !== null
      const method = isEditing ? 'PUT' : 'POST'
      const requestBody = isEditing 
        ? { ...deptForm, id: editingDept.id }
        : deptForm

      const response = await fetch('/api/departments', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        await fetchData() // Refresh data
        setIsCreateDeptOpen(false)
        resetDeptForm()
      } else {
        setError(data.error || (isEditing ? 'Không thể cập nhật phòng ban' : 'Không thể tạo phòng ban'))
      }
    } catch (error) {
      setError('Lỗi kết nối')
    } finally {
      setSubmitting(false)
    }
  }

  const resetUserForm = () => {
    setUserForm({
      ho_ten: '',
      email: '',
      ten_dang_nhap: '',
      mat_khau: '',
      chuc_vu: '',
      phong_ban: '',
      quyen_phe_duyet: [],
      trang_thai: 'active'
    })
    setEditingUser(null)
  }

  const resetDeptForm = () => {
    setDeptForm({
      ten_phong_ban: '',
      ma_phong_ban: '',
      truong_phong: '',
      pho_phong: [],
      mo_ta: '',
      trang_thai: 'active'
    })
    setEditingDept(null)
  }

  const openEditUser = (user: User) => {
    setUserForm({
      ho_ten: user.ho_ten,
      email: user.email,
      ten_dang_nhap: user.ten_dang_nhap,
      mat_khau: '', // Don't pre-fill password
      chuc_vu: user.chuc_vu,
      phong_ban: user.phong_ban,
      quyen_phe_duyet: user.quyen_phe_duyet,
      trang_thai: user.trang_thai
    })
    setEditingUser(user)
    setIsCreateUserOpen(true)
  }

  const openEditDept = (dept: Department) => {
    setDeptForm({
      ten_phong_ban: dept.ten_phong_ban,
      ma_phong_ban: dept.ma_phong_ban,
      truong_phong: dept.truong_phong,
      pho_phong: dept.pho_phong,
      mo_ta: dept.mo_ta || '',
      trang_thai: dept.trang_thai
    })
    setEditingDept(dept)
    setIsCreateDeptOpen(true)
  }

  const handleToggleDeptStatus = async (dept: Department) => {
    try {
      setSubmitting(true)
      setError('')

      const newStatus = dept.trang_thai === 'active' ? 'inactive' : 'active'
      
      const response = await fetch('/api/departments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: dept.id,
          ten_phong_ban: dept.ten_phong_ban,
          ma_phong_ban: dept.ma_phong_ban,
          truong_phong: dept.truong_phong,
          pho_phong: dept.pho_phong,
          mo_ta: dept.mo_ta || '',
          trang_thai: newStatus
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        await fetchData() // Refresh data
      } else {
        setError(data.error || 'Không thể cập nhật trạng thái phòng ban')
      }
    } catch (error) {
      setError('Lỗi kết nối')
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleUserStatus = async (user: User) => {
    try {
      setSubmitting(true)
      setError('')

      const newStatus = user.trang_thai === 'active' ? 'inactive' : 'active'
      
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user.id,
          ho_ten: user.ho_ten,
          email: user.email,
          ten_dang_nhap: user.ten_dang_nhap,
          chuc_vu: user.chuc_vu,
          phong_ban: user.phong_ban,
          quyen_phe_duyet: user.quyen_phe_duyet,
          trang_thai: newStatus
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        await fetchData() // Refresh data
      } else {
        setError(data.error || 'Không thể cập nhật trạng thái người dùng')
      }
    } catch (error) {
      setError('Lỗi kết nối')
    } finally {
      setSubmitting(false)
    }
  }

  const getPermissionBadgeColor = (permissions: string[]) => {
    if (permissions.includes('A')) return 'bg-red-100 text-red-800'
    if (permissions.includes('B')) return 'bg-orange-100 text-orange-800'
    return 'bg-green-100 text-green-800'
  }

  const getPermissionText = (permissions: string[]) => {
    const levels = permissions.map(p => {
      switch (p) {
        case 'A': return 'Giám đốc'
        case 'B': return 'Trưởng phòng'
        case 'C': return 'Phó phòng'
        default: return p
      }
    })
    return levels.join(', ')
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
          <h2 className="text-2xl font-bold">Quản lý Người dùng & Phòng ban</h2>
          <p className="text-sm text-gray-600 mt-1">
            Quản lý người dùng và phân quyền phê duyệt tài liệu
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateDeptOpen} onOpenChange={setIsCreateDeptOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => { resetDeptForm(); setIsCreateDeptOpen(true) }}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm phòng ban
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingDept ? 'Sửa phòng ban' : 'Thêm phòng ban mới'}
                </DialogTitle>
              </DialogHeader>
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="ten_phong_ban">Tên phòng ban</Label>
                  <Input
                    id="ten_phong_ban"
                    value={deptForm.ten_phong_ban}
                    onChange={(e) => setDeptForm({...deptForm, ten_phong_ban: e.target.value})}
                    placeholder="Nhập tên phòng ban"
                  />
                </div>

                <div>
                  <Label htmlFor="ma_phong_ban">Mã phòng ban</Label>
                  <Input
                    id="ma_phong_ban"
                    value={deptForm.ma_phong_ban}
                    onChange={(e) => setDeptForm({...deptForm, ma_phong_ban: e.target.value})}
                    placeholder="Nhập mã phòng ban"
                  />
                </div>

                <div>
                  <Label htmlFor="truong_phong">Trưởng phòng</Label>
                  <Input
                    id="truong_phong"
                    value={deptForm.truong_phong}
                    onChange={(e) => setDeptForm({...deptForm, truong_phong: e.target.value})}
                    placeholder="Nhập tên trưởng phòng"
                  />
                </div>

                <div>
                  <Label htmlFor="pho_phong">Phó phòng</Label>
                  <Input
                    id="pho_phong"
                    value={Array.isArray(deptForm.pho_phong) ? deptForm.pho_phong.join(', ') : deptForm.pho_phong}
                    onChange={(e) => {
                      const phoPhongList = e.target.value.split(',').map(name => name.trim()).filter(name => name.length > 0);
                      setDeptForm({...deptForm, pho_phong: phoPhongList});
                    }}
                    placeholder="Nhập tên phó phòng (phân cách bằng dấu phẩy nếu có nhiều người)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Có thể nhập nhiều phó phòng, phân cách bằng dấu phẩy. Ví dụ: Nguyễn Văn A, Trần Thị B
                  </p>
                </div>

                <div>
                  <Label htmlFor="mo_ta">Mô tả</Label>
                  <Input
                    id="mo_ta"
                    value={deptForm.mo_ta}
                    onChange={(e) => setDeptForm({...deptForm, mo_ta: e.target.value})}
                    placeholder="Nhập mô tả phòng ban"
                  />
                </div>

                <div>
                  <Label htmlFor="trang_thai_dept">Trạng thái</Label>
                  <Select value={deptForm.trang_thai} onValueChange={(value) => setDeptForm({...deptForm, trang_thai: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="inactive">Không hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDeptOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleCreateDepartment} disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    editingDept ? 'Cập nhật' : 'Tạo mới'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetUserForm(); setIsCreateUserOpen(true) }}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm người dùng
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingUser ? 'Sửa người dùng' : 'Thêm người dùng mới'}
                </DialogTitle>
              </DialogHeader>
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="ho_ten">Họ tên</Label>
                  <Input
                    id="ho_ten"
                    value={userForm.ho_ten}
                    onChange={(e) => setUserForm({...userForm, ho_ten: e.target.value})}
                    placeholder="Nhập họ tên"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                    placeholder="Nhập email"
                  />
                </div>

                <div>
                  <Label htmlFor="ten_dang_nhap">Tên đăng nhập</Label>
                  <Input
                    id="ten_dang_nhap"
                    value={userForm.ten_dang_nhap}
                    onChange={(e) => setUserForm({...userForm, ten_dang_nhap: e.target.value})}
                    placeholder="Nhập tên đăng nhập"
                  />
                </div>

                <div>
                  <Label htmlFor="mat_khau">Mật khẩu</Label>
                  <Input
                    id="mat_khau"
                    type="password"
                    value={userForm.mat_khau}
                    onChange={(e) => setUserForm({...userForm, mat_khau: e.target.value})}
                    placeholder={editingUser ? "Để trống nếu không đổi" : "Nhập mật khẩu"}
                  />
                </div>

                <div>
                  <Label htmlFor="chuc_vu">Chức vụ</Label>
                  <Input
                    id="chuc_vu"
                    value={userForm.chuc_vu}
                    onChange={(e) => setUserForm({...userForm, chuc_vu: e.target.value})}
                    placeholder="Nhập chức vụ"
                  />
                </div>

                <div>
                  <Label htmlFor="phong_ban">Phòng ban</Label>
                  <Select value={userForm.phong_ban} onValueChange={(value) => setUserForm({...userForm, phong_ban: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phòng ban" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.ten_phong_ban}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="quyen_phe_duyet">Quyền phê duyệt</Label>
                  <Select 
                    value={userForm.quyen_phe_duyet.join(',')} 
                    onValueChange={(value) => setUserForm({...userForm, quyen_phe_duyet: value.split(',')})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn quyền" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="C">Nhân viên (C)</SelectItem>
                      <SelectItem value="B,C">Phó phòng (B,C)</SelectItem>
                      <SelectItem value="A,B,C">Trưởng phòng (A,B,C)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="trang_thai_user">Trạng thái</Label>
                  <Select value={userForm.trang_thai} onValueChange={(value) => setUserForm({...userForm, trang_thai: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="inactive">Không hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateUserOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleCreateUser} disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    editingUser ? 'Cập nhật' : 'Tạo mới'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng người dùng</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Phòng ban</p>
                <p className="text-2xl font-bold">{departments.length}</p>
              </div>
              <Shield className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Người dùng hoạt động</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.trang_thai === 'active').length}
                </p>
              </div>
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Quyền cấp A</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.quyen_phe_duyet.includes('A')).length}
                </p>
              </div>
              <Shield className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Người dùng</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tên đăng nhập</TableHead>
                <TableHead>Chức vụ</TableHead>
                <TableHead>Phòng ban</TableHead>
                <TableHead>Quyền phê duyệt</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    Không có dữ liệu người dùng
                  </TableCell>
                </TableRow>
              ) : (
                users.map(user => {
                  const dept = departments.find(d => d.id === user.phong_ban);
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.ho_ten}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.ten_dang_nhap}</TableCell>
                      <TableCell>{user.chuc_vu}</TableCell>
                      <TableCell>{dept?.ten_phong_ban || user.phong_ban}</TableCell>
                      <TableCell>
                        <Badge className={getPermissionBadgeColor(user.quyen_phe_duyet)}>
                          {getPermissionText(user.quyen_phe_duyet)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.trang_thai === 'active' ? 'default' : 'secondary'}>
                          {user.trang_thai === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditUser(user)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant={user.trang_thai === 'active' ? 'destructive' : 'default'} 
                            size="sm" 
                            onClick={() => handleToggleUserStatus(user)}
                            disabled={submitting}
                          >
                            {user.trang_thai === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Departments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Phòng ban</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên phòng ban</TableHead>
                <TableHead>Mã phòng ban</TableHead>
                <TableHead>Trưởng phòng</TableHead>
                <TableHead>Phó phòng</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Không có dữ liệu phòng ban
                  </TableCell>
                </TableRow>
              ) : (
                departments.map(dept => (
                  <TableRow key={dept.id}>
                    <TableCell className="font-medium">{dept.ten_phong_ban}</TableCell>
                    <TableCell>{dept.ma_phong_ban}</TableCell>
                    <TableCell>{dept.truong_phong}</TableCell>
                    <TableCell>{Array.isArray(dept.pho_phong) ? dept.pho_phong.join(', ') : dept.pho_phong}</TableCell>
                    <TableCell>{dept.mo_ta}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDept(dept)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant={dept.trang_thai === 'active' ? 'destructive' : 'default'} 
                          size="sm" 
                          onClick={() => handleToggleDeptStatus(dept)}
                          disabled={submitting}
                        >
                          {dept.trang_thai === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}