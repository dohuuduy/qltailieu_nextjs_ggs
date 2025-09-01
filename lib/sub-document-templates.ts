// Template system cho tài liệu con
export interface SubDocumentTemplate {
  id: string
  loai_tai_lieu: string
  ten_mau: string
  mo_ta_mau: string
  ghi_chu_mau: string
  url_mau?: string
  icon: string
  color: string
}

export const SUB_DOCUMENT_TEMPLATES: SubDocumentTemplate[] = [
  // Biểu mẫu templates
  {
    id: 'bieu_mau_kiem_tra',
    loai_tai_lieu: 'bieu_mau',
    ten_mau: 'Biểu mẫu kiểm tra chất lượng [Tên sản phẩm]',
    mo_ta_mau: 'Form kiểm tra chất lượng theo quy trình chuẩn',
    ghi_chu_mau: 'Thay [Tên sản phẩm] bằng tên sản phẩm cụ thể. Sử dụng cho tất cả sản phẩm cùng loại.',
    url_mau: 'https://drive.google.com/file/d/template-bieu-mau-kiem-tra',
    icon: '📋',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'bieu_mau_danh_gia',
    loai_tai_lieu: 'bieu_mau',
    ten_mau: 'Form đánh giá hiệu suất [Bộ phận]',
    mo_ta_mau: 'Biểu mẫu đánh giá hiệu suất nhân viên theo tháng/quý',
    ghi_chu_mau: 'Điều chỉnh tiêu chí đánh giá phù hợp với từng bộ phận',
    icon: '⭐',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'bieu_mau_yeu_cau',
    loai_tai_lieu: 'bieu_mau',
    ten_mau: 'Phiếu yêu cầu thay đổi [Quy trình]',
    mo_ta_mau: 'Form yêu cầu thay đổi quy trình, tài liệu hoặc hệ thống',
    ghi_chu_mau: 'Cần có chữ ký phê duyệt từ quản lý trực tiếp',
    icon: '📝',
    color: 'bg-blue-100 text-blue-800'
  },

  // Hướng dẫn templates
  {
    id: 'huong_dan_su_dung',
    loai_tai_lieu: 'huong_dan',
    ten_mau: 'Hướng dẫn sử dụng [Thiết bị/Phần mềm]',
    mo_ta_mau: 'Hướng dẫn chi tiết cách sử dụng thiết bị hoặc phần mềm',
    ghi_chu_mau: 'Bao gồm hình ảnh minh họa và video hướng dẫn nếu có',
    icon: '📖',
    color: 'bg-green-100 text-green-800'
  },
  {
    id: 'huong_dan_quy_trinh',
    loai_tai_lieu: 'huong_dan',
    ten_mau: 'Quy trình thực hiện [Công việc cụ thể]',
    mo_ta_mau: 'Hướng dẫn từng bước thực hiện công việc theo quy trình',
    ghi_chu_mau: 'Cập nhật khi có thay đổi quy trình hoặc công cụ',
    icon: '🔄',
    color: 'bg-green-100 text-green-800'
  },
  {
    id: 'huong_dan_an_toan',
    loai_tai_lieu: 'huong_dan',
    ten_mau: 'Hướng dẫn an toàn [Khu vực làm việc]',
    mo_ta_mau: 'Quy định và hướng dẫn đảm bảo an toàn lao động',
    ghi_chu_mau: 'Tuân thủ nghiêm ngặt các quy định về ATVSLĐ',
    icon: '⚠️',
    color: 'bg-green-100 text-green-800'
  },

  // Checklist templates
  {
    id: 'checklist_cuoi_ca',
    loai_tai_lieu: 'checklist',
    ten_mau: 'Checklist kiểm tra cuối ca [Ca làm việc]',
    mo_ta_mau: 'Danh sách kiểm tra các hạng mục cuối ca làm việc',
    ghi_chu_mau: 'Thực hiện hàng ngày, lưu trữ bản checklist đã hoàn thành',
    icon: '✅',
    color: 'bg-yellow-100 text-yellow-800'
  },
  {
    id: 'checklist_truoc_hanh_dong',
    loai_tai_lieu: 'checklist',
    ten_mau: 'Danh sách kiểm tra trước khi [Hành động]',
    mo_ta_mau: 'Checklist đảm bảo đầy đủ điều kiện trước khi thực hiện',
    ghi_chu_mau: 'Không bỏ qua bất kỳ hạng mục nào trong danh sách',
    icon: '🔍',
    color: 'bg-yellow-100 text-yellow-800'
  },
  {
    id: 'checklist_bao_tri',
    loai_tai_lieu: 'checklist',
    ten_mau: 'Checklist bảo trì [Thiết bị]',
    mo_ta_mau: 'Danh sách kiểm tra và bảo trì thiết bị định kỳ',
    ghi_chu_mau: 'Thực hiện theo lịch bảo trì, ghi nhận kết quả',
    icon: '🔧',
    color: 'bg-yellow-100 text-yellow-800'
  },

  // Báo cáo templates
  {
    id: 'bao_cao_tuan',
    loai_tai_lieu: 'bao_cao',
    ten_mau: 'Báo cáo tuần [Bộ phận/Dự án]',
    mo_ta_mau: 'Báo cáo tổng kết hoạt động và kết quả trong tuần',
    ghi_chu_mau: 'Gửi báo cáo vào cuối tuần, CC cho quản lý cấp trên',
    icon: '📊',
    color: 'bg-purple-100 text-purple-800'
  },
  {
    id: 'bao_cao_su_co',
    loai_tai_lieu: 'bao_cao',
    ten_mau: 'Báo cáo sự cố [Loại sự cố]',
    mo_ta_mau: 'Báo cáo chi tiết về sự cố và biện pháp khắc phục',
    ghi_chu_mau: 'Báo cáo ngay khi xảy ra sự cố, đề xuất giải pháp phòng ngừa',
    icon: '🚨',
    color: 'bg-purple-100 text-purple-800'
  },
  {
    id: 'bao_cao_kiem_tra',
    loai_tai_lieu: 'bao_cao',
    ten_mau: 'Báo cáo kết quả kiểm tra [Đối tượng]',
    mo_ta_mau: 'Báo cáo kết quả kiểm tra, đánh giá và khuyến nghị',
    ghi_chu_mau: 'Đính kèm bằng chứng, ảnh chụp và dữ liệu đo lường',
    icon: '📋',
    color: 'bg-purple-100 text-purple-800'
  },

  // Tài liệu tham khảo templates
  {
    id: 'tai_lieu_tieu_chuan',
    loai_tai_lieu: 'tai_lieu_tham_khao',
    ten_mau: 'Tiêu chuẩn [Tên tiêu chuẩn] - Phần [X]',
    mo_ta_mau: 'Tài liệu tham khảo về tiêu chuẩn kỹ thuật áp dụng',
    ghi_chu_mau: 'Cập nhật khi có phiên bản mới của tiêu chuẩn',
    icon: '📚',
    color: 'bg-gray-100 text-gray-800'
  },
  {
    id: 'tai_lieu_phap_ly',
    loai_tai_lieu: 'tai_lieu_tham_khao',
    ten_mau: 'Văn bản pháp lý [Số hiệu] - [Tên văn bản]',
    mo_ta_mau: 'Tài liệu tham khảo về quy định pháp lý liên quan',
    ghi_chu_mau: 'Kiểm tra tính hiệu lực và cập nhật thường xuyên',
    icon: '⚖️',
    color: 'bg-gray-100 text-gray-800'
  },
  {
    id: 'tai_lieu_ky_thuat',
    loai_tai_lieu: 'tai_lieu_tham_khao',
    ten_mau: 'Tài liệu kỹ thuật [Sản phẩm/Thiết bị]',
    mo_ta_mau: 'Thông số kỹ thuật, catalog và tài liệu từ nhà sản xuất',
    ghi_chu_mau: 'Lưu trữ bản gốc và bản dịch nếu cần thiết',
    icon: '🔬',
    color: 'bg-gray-100 text-gray-800'
  }
]

// Hàm lấy templates theo loại
export function getTemplatesByType(loaiTaiLieu: string): SubDocumentTemplate[] {
  return SUB_DOCUMENT_TEMPLATES.filter(template => template.loai_tai_lieu === loaiTaiLieu)
}

// Hàm lấy template theo ID
export function getTemplateById(templateId: string): SubDocumentTemplate | undefined {
  return SUB_DOCUMENT_TEMPLATES.find(template => template.id === templateId)
}

// Hàm tạo tên tài liệu từ template
export function generateDocumentName(template: SubDocumentTemplate, customName?: string): string {
  if (customName) {
    return template.ten_mau.replace(/\[.*?\]/g, customName)
  }
  return template.ten_mau
}

// Hàm lấy tất cả loại tài liệu có template
export function getAvailableTypes(): string[] {
  return [...new Set(SUB_DOCUMENT_TEMPLATES.map(t => t.loai_tai_lieu))]
}