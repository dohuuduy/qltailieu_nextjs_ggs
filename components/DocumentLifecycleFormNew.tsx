'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DatePicker, DateRangePicker } from '@/components/ui/date-picker'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Calendar, Clock, Users, Shield, AlertTriangle, CheckCircle } from 'lucide-react'
import { useToast } from '@/components/ui/toast'
import ApprovalActions from './ApprovalActions'
import {
  DocumentLifecycle,
  DocumentStatus,
  ApprovalStatus,
  ReviewCycle,
  DocumentLevel,
  getDocumentStatusName,
  getApprovalStatusName,
  getReviewCycleName,
  getDocumentLevelName,
  calculateNextReviewDate,
  getCurrentDocumentStatus,
  isDocumentExpiringSoon,
  isDocumentExpired,
  isReviewDue
} from '@/lib/types/document-lifecycle'

interface DocumentLifecycleFormNewProps {
  document?: Partial<DocumentLifecycle>
  onSave: (data: Partial<DocumentLifecycle>) => Promise<void>
  onCancel: () => void
  mode: 'create' | 'edit'
  currentUser?: {
    id: string
    ho_ten: string
    phong_ban: string
    quyen_phe_duyet: DocumentLevel[]
  }
}

export default function DocumentLifecycleFormNew({
  document,
  onSave,
  onCancel,
  mode,
  currentUser
}: DocumentLifecycleFormNewProps) {
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<DocumentLifecycle>>({
    // Basic info
    ten_tai_lieu: '',
    mo_ta: '',
    loai_tai_lieu: 'quy_trinh',
    trang_thai: 'soan_thao',
    
    // Lifecycle dates
    ngay_ban_hanh: new Date().toISOString().split('T')[0],
    ngay_bat_dau_hieu_luc: new Date().toISOString().split('T')[0],
    ngay_ket_thuc_hieu_luc: '',
    
    // Review cycle
    chu_ky_soat_xet: '1_nam',
    ngay_soat_xet_gan_nhat: new Date().toISOString().split('T')[0],
    
    // Approval workflow
    nguoi_soan_thao: currentUser?.ho_ten || '',
    nguoi_phe_duyet: '',
    trang_thai_phe_duyet: 'chua_gui',
    
    // Department management
    phong_ban_chu_quan: currentUser?.phong_ban || '',
    phong_ban_lien_quan: [],
    cap_do_tai_lieu: 'C',
    
    // Additional
    tieu_chuan_ap_dung: [],
    url_file: '',
    ly_do_thay_doi: '',
    ghi_chu_phe_duyet: '',
    
    ...document
  })

  // Mock data - In real app, fetch from API
  const departments = [
    { id: 'IT', name: 'Phòng Công nghệ thông tin' },
    { id: 'QA', name: 'Phòng Đảm bảo chất lượng' },
    { id: 'HR', name: 'Phòng Nhân sự' },
    { id: 'FIN', name: 'Phòng Tài chính' },
    { id: 'OPS', name: 'Phòng Vận hành' }
  ]

  const users = [
    { id: '1', ho_ten: 'Nguyễn Văn A', phong_ban: 'IT', quyen_phe_duyet: ['A', 'B', 'C'] },
    { id: '2', ho_ten: 'Trần Thị B', phong_ban: 'QA', quyen_phe_duyet: ['B', 'C'] },
    { id: '3', ho_ten: 'Lê Văn C', phong_ban: 'HR', quyen_phe_duyet: ['C'] }
  ]

  // Calculate next review date when cycle or last review changes
  useEffect(() => {
    if (formData.chu_ky_soat_xet && formData.ngay_soat_xet_gan_nhat) {
      const nextDate = calculateNextReviewDate(
        formData.ngay_soat_xet_gan_nhat,
        formData.chu_ky_soat_xet
      )
      setFormData(prev => ({ ...prev, ngay_soat_xet_tiep_theo: nextDate }))
    }
  }, [formData.chu_ky_soat_xet, formData.ngay_soat_xet_gan_nhat])

  // Get current document status
  const currentStatus = formData as DocumentLifecycle
  const computedStatus = getCurrentDocumentStatus(currentStatus)
  const isExpiringSoon = formData.ngay_ket_thuc_hieu_luc ? 
    isDocumentExpiringSoon(formData.ngay_ket_thuc_hieu_luc) : false
  const isExpired = formData.ngay_ket_thuc_hieu_luc ? 
    isDocumentExpired(formData.ngay_ket_thuc_hieu_luc) : false
  const needsReview = formData.ngay_soat_xet_tiep_theo ? 
    isReviewDue(formData.ngay_soat_xet_tiep_theo) : false

  const handleSave = async () => {
    try {
      setLoading(true)
      
      // Validation
      if (!formData.ten_tai_lieu?.trim()) {
        addToast({
          type: 'error',
          title: 'Lỗi!',
          description: 'Vui lòng nhập tên tài liệu'
        })
        return
      }

      if (!formData.ngay_ban_hanh) {
        addToast({
          type: 'error',
          title: 'Lỗi!',
          description: 'Vui lòng chọn ngày ban hành'
        })
        return
      }

      // Validate dates
      const banHanh = new Date(formData.ngay_ban_hanh)
      const batDau = new Date(formData.ngay_bat_dau_hieu_luc || '')
      const ketThuc = formData.ngay_ket_thuc_hieu_luc ? new Date(formData.ngay_ket_thuc_hieu_luc) : null

      if (batDau < banHanh) {
        addToast({
          type: 'error',
          title: 'Lỗi!',
          description: 'Ngày bắt đầu hiệu lực không được trước ngày ban hành'
        })
        return
      }

      if (ketThuc && ketThuc <= batDau) {
        addToast({
          type: 'error',
          title: 'Lỗi!',
          description: 'Ngày kết thúc hiệu lực phải sau ngày bắt đầu hiệu lực'
        })
        return
      }

      await onSave(formData)
      
      addToast({
        type: 'success',
        title: 'Thành công!',
        description: mode === 'create' ? 'Tạo tài liệu thành công' : 'Cập nhật tài liệu thành công'
      })
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Lỗi!',
        description: 'Có lỗi xảy ra khi lưu tài liệu'
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeColor = (status: DocumentStatus) => {
    switch (status) {
      case 'hieu_luc': return 'bg-green-100 text-green-800'
      case 'het_hieu_luc': return 'bg-red-100 text-red-800'
      case 'chua_hieu_luc': return 'bg-yellow-100 text-yellow-800'
      case 'cho_phe_duyet': return 'bg-blue-100 text-blue-800'
      case 'soan_thao': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Trạng thái tài liệu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge className={getStatusBadgeColor(computedStatus)}>
              {getDocumentStatusName(computedStatus)}
            </Badge>
            <Badge variant="outline">
              {getApprovalStatusName(formData.trang_thai_phe_duyet || 'chua_gui')}
            </Badge>
            <Badge variant="outline">
              {getDocumentLevelName(formData.cap_do_tai_lieu || 'C')}
            </Badge>
            
            {isExpired && (
              <Badge className="bg-red-100 text-red-800">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Đã hết hiệu lực
              </Badge>
            )}
            
            {isExpiringSoon && !isExpired && (
              <Badge className="bg-orange-100 text-orange-800">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Sắp hết hiệu lực
              </Badge>
            )}
            
            {needsReview && (
              <Badge className="bg-purple-100 text-purple-800">
                <Clock className="w-3 h-3 mr-1" />
                Cần soát xét
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ten_tai_lieu">Tên tài liệu *</Label>
              <Input
                id="ten_tai_lieu"
                value={formData.ten_tai_lieu || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, ten_tai_lieu: e.target.value }))}
                placeholder="Nhập tên tài liệu"
              />
            </div>
            
            <div>
              <Label htmlFor="loai_tai_lieu">Loại tài liệu</Label>
              <Select 
                value={formData.loai_tai_lieu || ''} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, loai_tai_lieu: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại tài liệu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quy_trinh">Quy trình</SelectItem>
                  <SelectItem value="huong_dan">Hướng dẫn</SelectItem>
                  <SelectItem value="bieu_mau">Biểu mẫu</SelectItem>
                  <SelectItem value="quy_dinh">Quy định</SelectItem>
                  <SelectItem value="tai_lieu_ky_thuat">Tài liệu kỹ thuật</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="mo_ta">Mô tả</Label>
            <Textarea
              id="mo_ta"
              value={formData.mo_ta || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, mo_ta: e.target.value }))}
              placeholder="Mô tả chi tiết về tài liệu"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="url_file">URL File</Label>
            <Input
              id="url_file"
              value={formData.url_file || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, url_file: e.target.value }))}
              placeholder="https://drive.google.com/file/d/..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Lifecycle Dates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Quản lý ngày tháng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Ngày ban hành *</Label>
              <DatePicker
                date={formData.ngay_ban_hanh ? new Date(formData.ngay_ban_hanh) : undefined}
                onDateChange={(date) => setFormData(prev => ({ 
                  ...prev, 
                  ngay_ban_hanh: date?.toISOString().split('T')[0] || '' 
                }))}
                placeholder="Chọn ngày ban hành"
                maxDate={new Date()}
              />
            </div>
            
            <div>
              <Label>Ngày phê duyệt</Label>
              <DatePicker
                date={formData.ngay_phe_duyet ? new Date(formData.ngay_phe_duyet) : undefined}
                onDateChange={(date) => setFormData(prev => ({ 
                  ...prev, 
                  ngay_phe_duyet: date?.toISOString().split('T')[0] || '' 
                }))}
                placeholder="Chọn ngày phê duyệt"
                disabled={formData.trang_thai_phe_duyet !== 'da_phe_duyet'}
              />
            </div>
          </div>
          
          <div>
            <Label>Thời gian hiệu lực</Label>
            <DateRangePicker
              startDate={formData.ngay_bat_dau_hieu_luc ? new Date(formData.ngay_bat_dau_hieu_luc) : undefined}
              endDate={formData.ngay_ket_thuc_hieu_luc ? new Date(formData.ngay_ket_thuc_hieu_luc) : undefined}
              onStartDateChange={(date) => setFormData(prev => ({ 
                ...prev, 
                ngay_bat_dau_hieu_luc: date?.toISOString().split('T')[0] || '' 
              }))}
              onEndDateChange={(date) => setFormData(prev => ({ 
                ...prev, 
                ngay_ket_thuc_hieu_luc: date?.toISOString().split('T')[0] || '' 
              }))}
              startPlaceholder="Ngày bắt đầu hiệu lực"
              endPlaceholder="Ngày kết thúc hiệu lực (tùy chọn)"
            />
          </div>
        </CardContent>
      </Card>

      {/* Review Cycle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Chu kỳ soát xét
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Chu kỳ soát xét</Label>
              <Select 
                value={formData.chu_ky_soat_xet || ''} 
                onValueChange={(value: ReviewCycle) => setFormData(prev => ({ ...prev, chu_ky_soat_xet: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn chu kỳ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6_thang">6 tháng</SelectItem>
                  <SelectItem value="1_nam">1 năm</SelectItem>
                  <SelectItem value="2_nam">2 năm</SelectItem>
                  <SelectItem value="3_nam">3 năm</SelectItem>
                  <SelectItem value="khong_dinh_ky">Không định kỳ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Ngày soát xét gần nhất</Label>
              <DatePicker
                date={formData.ngay_soat_xet_gan_nhat ? new Date(formData.ngay_soat_xet_gan_nhat) : undefined}
                onDateChange={(date) => setFormData(prev => ({ 
                  ...prev, 
                  ngay_soat_xet_gan_nhat: date?.toISOString().split('T')[0] || '' 
                }))}
                placeholder="Chọn ngày soát xét"
                maxDate={new Date()}
              />
            </div>
            
            <div>
              <Label>Ngày soát xét tiếp theo</Label>
              <DatePicker
                date={formData.ngay_soat_xet_tiep_theo ? new Date(formData.ngay_soat_xet_tiep_theo) : undefined}
                onDateChange={(date) => setFormData(prev => ({ 
                  ...prev, 
                  ngay_soat_xet_tiep_theo: date?.toISOString().split('T')[0] || '' 
                }))}
                placeholder="Tự động tính toán"
                disabled={formData.chu_ky_soat_xet === 'khong_dinh_ky'}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approval Actions */}
      {mode === 'edit' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Thao tác phê duyệt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ApprovalActions
              document={formData as DocumentLifecycle}
              onUpdate={() => {
                // Refresh form data or trigger parent refresh
                window.location.reload()
              }}
              currentUser={currentUser}
            />
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-6">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Hủy
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Đang lưu...' : (mode === 'create' ? 'Tạo tài liệu' : 'Cập nhật')}
        </Button>
      </div>
    </div>
  )
}