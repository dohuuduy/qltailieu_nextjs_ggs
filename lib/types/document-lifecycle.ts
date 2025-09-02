// Document Lifecycle Types

// Define enums first
export type DocumentStatus = 
  | 'soan_thao' 
  | 'cho_xem_xet' 
  | 'cho_phe_duyet' 
  | 'hieu_luc' 
  | 'het_hieu_luc' 
  | 'da_xoa'
  | 'chua_hieu_luc'

export type ApprovalStatus = 
  | 'chua_gui' 
  | 'cho_phe_duyet' 
  | 'da_phe_duyet' 
  | 'tu_choi' 
  | 'can_chinh_sua'

export type ReviewCycle = 
  | '6_thang' 
  | '1_nam' 
  | '2_nam' 
  | '3_nam' 
  | 'khong_dinh_ky'

export type DocumentLevel = 
  | 'A' // Cấp cao - Cần Giám đốc phê duyệt
  | 'B' // Cấp trung - Cần Trưởng phòng phê duyệt  
  | 'C' // Cấp thấp - Cần Phó phòng phê duyệt

export type NotificationType = 
  | 'sap_het_hieu_luc'
  | 'het_hieu_luc' 
  | 'can_soat_xet'
  | 'qua_han_soat_xet'
  | 'cho_phe_duyet'
  | 'da_phe_duyet'
  | 'tu_choi_phe_duyet'
  | 'tai_lieu_moi'

export type Priority = 'thap' | 'trung_binh' | 'cao' | 'khan_cap'

// Main interfaces
export interface DocumentLifecycle {
  // Basic info
  id: string
  ten_tai_lieu: string
  mo_ta: string
  loai_tai_lieu: string
  trang_thai: DocumentStatus
  
  // Creator and updater
  nguoi_tao: string
  ngay_tao: string
  nguoi_cap_nhat: string
  ngay_cap_nhat: string
  
  // Version and standards
  phien_ban_hien_tai: string
  tieu_chuan_ap_dung: string | string[]
  url_file?: string
  
  // Lifecycle dates
  ngay_ban_hanh: string
  ngay_bat_dau_hieu_luc: string
  ngay_ket_thuc_hieu_luc?: string
  
  // Review cycle
  chu_ky_soat_xet: ReviewCycle
  ngay_soat_xet_gan_nhat?: string
  ngay_soat_xet_tiep_theo: string
  
  // Approval workflow
  nguoi_soan_thao: string
  nguoi_phe_duyet: string
  ngay_phe_duyet?: string
  trang_thai_phe_duyet: ApprovalStatus
  
  // Department management
  phong_ban_chu_quan: string
  phong_ban_lien_quan: string[]
  cap_do_tai_lieu: DocumentLevel
  
  // Additional info
  ly_do_thay_doi?: string
  ghi_chu_phe_duyet?: string

  // Computed status (for API responses)
  computed_status?: DocumentStatus
}

export interface Department {
  id: string
  ten_phong_ban: string
  ma_phong_ban: string
  truong_phong: string
  pho_phong: string[]
  mo_ta?: string
}

export interface User {
  id: string
  ho_ten: string
  email: string
  chuc_vu: string
  phong_ban: string
  quyen_phe_duyet: DocumentLevel[]
  active: boolean
}

export interface DocumentNotification {
  id: string
  document_id: string
  loai_thong_bao: NotificationType
  tieu_de: string
  noi_dung: string
  nguoi_nhan: string[]
  ngay_tao: string
  da_doc: boolean
  muc_do_uu_tien: Priority
}

// Utility functions
export const getDocumentStatusName = (status: DocumentStatus): string => {
  const statusMap: Record<DocumentStatus, string> = {
    'soan_thao': 'Đang soạn thảo',
    'cho_xem_xet': 'Chờ xem xét',
    'cho_phe_duyet': 'Chờ phê duyệt',
    'chua_hieu_luc': 'Chưa hiệu lực',
    'hieu_luc': 'Đang hiệu lực',
    'het_hieu_luc': 'Hết hiệu lực',
    'da_xoa': 'Đã xóa'
  }
  return statusMap[status] || status
}

export const getApprovalStatusName = (status: ApprovalStatus): string => {
  const statusMap: Record<ApprovalStatus, string> = {
    'chua_gui': 'Chưa gửi phê duyệt',
    'cho_phe_duyet': 'Chờ phê duyệt',
    'da_phe_duyet': 'Đã phê duyệt',
    'tu_choi': 'Từ chối',
    'can_chinh_sua': 'Cần chỉnh sửa'
  }
  return statusMap[status] || status
}

export const getReviewCycleName = (cycle: ReviewCycle): string => {
  const cycleMap: Record<ReviewCycle, string> = {
    '6_thang': '6 tháng',
    '1_nam': '1 năm',
    '2_nam': '2 năm', 
    '3_nam': '3 năm',
    'khong_dinh_ky': 'Không định kỳ'
  }
  return cycleMap[cycle] || cycle
}

export const getDocumentLevelName = (level: DocumentLevel): string => {
  const levelMap: Record<DocumentLevel, string> = {
    'A': 'Cấp A (Giám đốc)',
    'B': 'Cấp B (Trưởng phòng)',
    'C': 'Cấp C (Phó phòng)'
  }
  return levelMap[level] || level
}

// Date utility functions
export const calculateNextReviewDate = (lastReviewDate: string, cycle: ReviewCycle): string => {
  if (cycle === 'khong_dinh_ky') return ''
  
  const date = new Date(lastReviewDate)
  
  switch (cycle) {
    case '6_thang':
      date.setMonth(date.getMonth() + 6)
      break
    case '1_nam':
      date.setFullYear(date.getFullYear() + 1)
      break
    case '2_nam':
      date.setFullYear(date.getFullYear() + 2)
      break
    case '3_nam':
      date.setFullYear(date.getFullYear() + 3)
      break
  }
  
  return date.toISOString().split('T')[0]
}

export const isDocumentExpiringSoon = (endDate: string, daysThreshold: number = 30): boolean => {
  if (!endDate) return false
  
  const today = new Date()
  const expiry = new Date(endDate)
  const diffTime = expiry.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays <= daysThreshold && diffDays > 0
}

export const isDocumentExpired = (endDate: string): boolean => {
  if (!endDate) return false
  
  const today = new Date()
  const expiry = new Date(endDate)
  
  return today > expiry
}

export const isReviewDue = (nextReviewDate: string, daysThreshold: number = 30): boolean => {
  if (!nextReviewDate) return false
  
  const today = new Date()
  const reviewDate = new Date(nextReviewDate)
  const diffTime = reviewDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays <= daysThreshold
}

export const getCurrentDocumentStatus = (document: DocumentLifecycle): DocumentStatus => {
  const today = new Date()
  const startDate = new Date(document.ngay_bat_dau_hieu_luc)
  const endDate = document.ngay_ket_thuc_hieu_luc ? new Date(document.ngay_ket_thuc_hieu_luc) : null
  
  // Nếu chưa được phê duyệt
  if (document.trang_thai_phe_duyet !== 'da_phe_duyet') {
    return document.trang_thai
  }
  
  // Nếu chưa đến ngày hiệu lực
  if (today < startDate) {
    return 'chua_hieu_luc'
  }
  
  // Nếu đã quá ngày hết hiệu lực
  if (endDate && today > endDate) {
    return 'het_hieu_luc'
  }
  
  // Đang trong thời gian hiệu lực
  return 'hieu_luc'
}