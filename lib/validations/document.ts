import { z } from 'zod'

// Base document schema
export const documentSchema = z.object({
  ten_tai_lieu: z
    .string()
    .min(1, 'Tên tài liệu là bắt buộc')
    .min(5, 'Tên tài liệu phải có ít nhất 5 ký tự')
    .max(200, 'Tên tài liệu không được vượt quá 200 ký tự'),
  
  mo_ta: z
    .string()
    .min(1, 'Mô tả là bắt buộc')
    .min(10, 'Mô tả phải có ít nhất 10 ký tự')
    .max(1000, 'Mô tả không được vượt quá 1000 ký tự'),
  
  loai_tai_lieu: z
    .string()
    .min(1, 'Loại tài liệu là bắt buộc'),
  
  tieu_chuan_ap_dung: z
    .array(z.string())
    .min(1, 'Phải chọn ít nhất một tiêu chuẩn áp dụng'),
  
  url_file: z
    .string()
    .url('URL file không hợp lệ')
    .optional()
    .or(z.literal(''))
})

// Document lifecycle schema
export const documentLifecycleSchema = documentSchema.extend({
  ngay_ban_hanh: z
    .string()
    .min(1, 'Ngày ban hành là bắt buộc')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Ngày ban hành phải có định dạng YYYY-MM-DD'),
  
  ngay_bat_dau_hieu_luc: z
    .string()
    .min(1, 'Ngày bắt đầu hiệu lực là bắt buộc')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Ngày bắt đầu hiệu lực phải có định dạng YYYY-MM-DD'),
  
  ngay_ket_thuc_hieu_luc: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Ngày kết thúc hiệu lực phải có định dạng YYYY-MM-DD')
    .optional()
    .or(z.literal('')),
  
  chu_ky_soat_xet: z
    .enum(['6_thang', '1_nam', '2_nam', '3_nam', 'khong_dinh_ky'], {
      errorMap: () => ({ message: 'Chu kỳ soát xét không hợp lệ' })
    }),
  
  nguoi_soan_thao: z
    .string()
    .min(1, 'Người soạn thảo là bắt buộc'),
  
  nguoi_phe_duyet: z
    .string()
    .min(1, 'Người phê duyệt là bắt buộc'),
  
  phong_ban_chu_quan: z
    .string()
    .min(1, 'Phòng ban chủ quản là bắt buộc'),
  
  phong_ban_lien_quan: z
    .array(z.string())
    .optional(),
  
  cap_do_tai_lieu: z
    .enum(['A', 'B', 'C'], {
      errorMap: () => ({ message: 'Cấp độ tài liệu phải là A, B hoặc C' })
    }),
  
  trang_thai_phe_duyet: z
    .enum(['soan_thao', 'cho_phe_duyet', 'da_phe_duyet', 'tu_choi', 'can_chinh_sua'])
    .default('soan_thao'),
  
  ly_do_thay_doi: z
    .string()
    .max(500, 'Lý do thay đổi không được vượt quá 500 ký tự')
    .optional(),
  
  ghi_chu_phe_duyet: z
    .string()
    .max(500, 'Ghi chú phê duyệt không được vượt quá 500 ký tự')
    .optional()
})

// Version schema
export const versionSchema = z.object({
  so_phien_ban: z
    .string()
    .min(1, 'Số phiên bản là bắt buộc')
    .regex(/^\d+\.\d+$/, 'Số phiên bản phải có định dạng x.y (ví dụ: 1.0, 2.1)'),
  
  noi_dung: z
    .string()
    .min(1, 'Nội dung thay đổi là bắt buộc')
    .min(10, 'Nội dung thay đổi phải có ít nhất 10 ký tự')
    .max(1000, 'Nội dung thay đổi không được vượt quá 1000 ký tự'),
  
  ghi_chu: z
    .string()
    .max(500, 'Ghi chú không được vượt quá 500 ký tự')
    .optional()
})

// Approval action schema
export const approvalActionSchema = z.object({
  action: z.enum(['approve', 'reject', 'request_changes']),
  ghi_chu_phe_duyet: z
    .string()
    .min(1, 'Ghi chú phê duyệt là bắt buộc')
    .max(500, 'Ghi chú phê duyệt không được vượt quá 500 ký tự')
})

// Review action schema
export const reviewActionSchema = z.object({
  ngay_soat_xet_gan_nhat: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Ngày soát xét phải có định dạng YYYY-MM-DD'),
  
  ly_do_thay_doi: z
    .string()
    .min(1, 'Lý do/kết quả soát xét là bắt buộc')
    .max(500, 'Lý do/kết quả soát xét không được vượt quá 500 ký tự')
})

// Extend validity schema
export const extendValiditySchema = z.object({
  ngay_ket_thuc_hieu_luc: z
    .string()
    .min(1, 'Ngày kết thúc hiệu lực mới là bắt buộc')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Ngày kết thúc hiệu lực phải có định dạng YYYY-MM-DD'),
  
  ly_do_thay_doi: z
    .string()
    .min(1, 'Lý do gia hạn là bắt buộc')
    .max(500, 'Lý do gia hạn không được vượt quá 500 ký tự')
})

// Search/Filter schema
export const documentFilterSchema = z.object({
  search: z.string().optional(),
  loai_tai_lieu: z.string().optional(),
  trang_thai: z.string().optional(),
  phong_ban: z.string().optional(),
  date_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  date_to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20)
})

// Type exports
export type DocumentFormData = z.infer<typeof documentSchema>
export type DocumentLifecycleFormData = z.infer<typeof documentLifecycleSchema>
export type VersionFormData = z.infer<typeof versionSchema>
export type ApprovalActionData = z.infer<typeof approvalActionSchema>
export type ReviewActionData = z.infer<typeof reviewActionSchema>
export type ExtendValidityData = z.infer<typeof extendValiditySchema>
export type DocumentFilterData = z.infer<typeof documentFilterSchema>

// Validation helper functions
export const validateDocument = (data: unknown) => {
  return documentSchema.safeParse(data)
}

export const validateDocumentLifecycle = (data: unknown) => {
  return documentLifecycleSchema.safeParse(data)
}

export const validateVersion = (data: unknown) => {
  return versionSchema.safeParse(data)
}

export const validateApprovalAction = (data: unknown) => {
  return approvalActionSchema.safeParse(data)
}

export const validateReviewAction = (data: unknown) => {
  return reviewActionSchema.safeParse(data)
}

export const validateExtendValidity = (data: unknown) => {
  return extendValiditySchema.safeParse(data)
}

export const validateDocumentFilter = (data: unknown) => {
  return documentFilterSchema.safeParse(data)
}

// Custom validation rules
export const customValidations = {
  // Check if end date is after start date
  isEndDateAfterStartDate: (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return true
    return new Date(endDate) > new Date(startDate)
  },
  
  // Check if issue date is not in the future
  isIssueDateValid: (issueDate: string) => {
    if (!issueDate) return true
    return new Date(issueDate) <= new Date()
  },
  
  // Check if version number is higher than current
  isVersionHigher: (newVersion: string, currentVersion: string) => {
    const parseVersion = (version: string) => {
      const parts = version.split('.').map(Number)
      return parts[0] * 1000 + (parts[1] || 0)
    }
    
    return parseVersion(newVersion) > parseVersion(currentVersion)
  }
}