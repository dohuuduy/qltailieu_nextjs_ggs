# 📋 Hướng dẫn Quản lý Vòng đời Tài liệu

## 🎯 Tổng quan

Tính năng Quản lý Vòng đời Tài liệu được thiết kế để đáp ứng đầy đủ 12 requirements đã được định nghĩa, bao gồm:

### ✅ 12 Requirements đã implement

1. **Quản lý ngày ban hành và hiệu lực** - Theo dõi ngày ban hành, bắt đầu và kết thúc hiệu lực
2. **Chu kỳ soát xét định kỳ** - Tự động tính toán ngày soát xét tiếp theo
3. **Quy trình phê duyệt** - Workflow phê duyệt với nhiều cấp độ
4. **Người soạn thảo và phê duyệt** - Quản lý người thực hiện các vai trò
5. **Phòng ban chủ quản** - Xác định phòng ban chịu trách nhiệm chính
6. **Phòng ban liên quan** - Danh sách các phòng ban có liên quan
7. **Cấp độ tài liệu** - Phân loại A, B, C theo thẩm quyền phê duyệt
8. **Trạng thái tự động** - Tự động cập nhật trạng thái dựa trên ngày tháng
9. **Cảnh báo hết hạn** - Thông báo tài liệu sắp hết hiệu lực
10. **Cảnh báo soát xét** - Nhắc nhở khi đến hạn soát xét
11. **Lịch sử thay đổi** - Ghi lại lý do và người thực hiện thay đổi
12. **Dashboard tổng quan** - Hiển thị thống kê và trạng thái tổng thể

## 🏗️ Kiến trúc Hệ thống

### 📁 Cấu trúc File

```
components/
├── DocumentLifecycleForm.tsx          # Form quản lý lifecycle
├── DocumentLifecycleDashboard.tsx     # Dashboard tổng quan
├── DocumentManager.tsx                # Component chính (đã cập nhật)
└── ui/
    ├── date-picker.tsx               # Component chọn ngày
    ├── calendar.tsx                  # Calendar component
    ├── popover.tsx                   # Popover component
    ├── textarea.tsx                  # Textarea component
    ├── separator.tsx                 # Separator component
    └── toast.tsx                     # Toast notifications

lib/
├── types/
│   └── document-lifecycle.ts         # Types và utility functions
└── google-sheets.ts                  # Đã cập nhật với lifecycle fields

app/api/documents/
├── lifecycle/
│   ├── route.ts                      # API endpoints chính
│   └── [id]/
│       └── route.ts                  # API cho document cụ thể

scripts/
├── setup-sheets.js                   # Đã cập nhật với lifecycle fields
└── add-lifecycle-sample-data.js      # Script thêm dữ liệu mẫu
```

### 🗄️ Database Schema

Đã mở rộng Google Sheets với các trường mới:

```javascript
// Lifecycle dates
'ngay_ban_hanh',           // Ngày ban hành
'ngay_bat_dau_hieu_luc',   // Ngày bắt đầu hiệu lực
'ngay_ket_thuc_hieu_luc',  // Ngày kết thúc hiệu lực
'chu_ky_soat_xet',         // Chu kỳ soát xét (6_thang, 1_nam, 2_nam, 3_nam, khong_dinh_ky)
'ngay_soat_xet_gan_nhat',  // Ngày soát xét gần nhất
'ngay_soat_xet_tiep_theo', // Ngày soát xét tiếp theo (tự động tính)

// Approval workflow
'nguoi_soan_thao',         // Người soạn thảo
'nguoi_phe_duyet',         // Người phê duyệt
'ngay_phe_duyet',          // Ngày phê duyệt
'trang_thai_phe_duyet',    // Trạng thái phê duyệt

// Department management
'phong_ban_chu_quan',      // Phòng ban chủ quản
'phong_ban_lien_quan',     // Phòng ban liên quan (comma-separated)
'cap_do_tai_lieu',         // Cấp độ tài liệu (A, B, C)

// Additional fields
'ly_do_thay_doi',          // Lý do thay đổi
'ghi_chu_phe_duyet'        // Ghi chú phê duyệt
```

## 🚀 Cách sử dụng

### 1. Truy cập Quản lý Vòng đời

1. Mở ứng dụng và chọn **"Quản lý Tài liệu"**
2. Chọn tab **"Vòng đời tài liệu"**
3. Dashboard sẽ hiển thị tổng quan về tất cả tài liệu

### 2. Tạo Tài liệu mới với Lifecycle

1. Nhấn **"Tạo tài liệu mới"** trong tab Vòng đời
2. Điền thông tin cơ bản:
   - Tên tài liệu
   - Mô tả
   - Loại tài liệu
   - URL file

3. Cấu hình ngày tháng:
   - **Ngày ban hành**: Ngày tài liệu được ban hành
   - **Ngày bắt đầu hiệu lực**: Khi tài liệu có hiệu lực
   - **Ngày kết thúc hiệu lực**: Khi tài liệu hết hiệu lực (tùy chọn)

4. Thiết lập chu kỳ soát xét:
   - Chọn chu kỳ: 6 tháng, 1 năm, 2 năm, 3 năm, hoặc không định kỳ
   - Ngày soát xét tiếp theo sẽ được tự động tính

5. Cấu hình quy trình phê duyệt:
   - Người soạn thảo
   - Người phê duyệt
   - Cấp độ tài liệu (A, B, C)
   - Trạng thái phê duyệt

6. Quản lý phòng ban:
   - Phòng ban chủ quản
   - Các phòng ban liên quan

### 3. Dashboard và Monitoring

Dashboard cung cấp 4 tab chính:

#### 📊 Tổng quan
- Thống kê tổng số tài liệu
- Số tài liệu đang hiệu lực
- Số tài liệu chờ phê duyệt
- Số tài liệu sắp hết hạn
- Số tài liệu cần soát xét

#### ⚠️ Sắp hết hạn
- Danh sách tài liệu sẽ hết hiệu lực trong 30 ngày
- Nút "Gia hạn" để gia hạn hiệu lực
- Cảnh báo màu cam

#### 📅 Cần soát xét
- Danh sách tài liệu cần soát xét trong 30 ngày
- Nút "Soát xét" để thực hiện soát xét
- Cảnh báo màu tím

#### ⏳ Chờ phê duyệt
- Danh sách tài liệu đang chờ phê duyệt
- Thông tin người soạn thảo và người phê duyệt
- Nút "Phê duyệt" để xử lý

### 4. Trạng thái Tự động

Hệ thống tự động tính toán trạng thái dựa trên:

- **Chưa hiệu lực**: Chưa đến ngày bắt đầu hiệu lực
- **Đang hiệu lực**: Trong thời gian hiệu lực và đã được phê duyệt
- **Hết hiệu lực**: Đã quá ngày kết thúc hiệu lực
- **Chờ phê duyệt**: Đang trong quy trình phê duyệt

### 5. Cảnh báo và Thông báo

Hệ thống hiển thị các badge cảnh báo:

- 🔴 **Đã hết hiệu lực**: Tài liệu đã quá hạn
- 🟠 **Sắp hết hiệu lực**: Còn ít hơn 30 ngày
- 🟣 **Cần soát xét**: Đến hạn soát xét trong 30 ngày
- 🔵 **Chờ phê duyệt**: Đang chờ xử lý phê duyệt

## 🔧 API Endpoints

### GET /api/documents/lifecycle
Lấy danh sách tài liệu với thông tin lifecycle

**Query Parameters:**
- `status`: Lọc theo trạng thái
- `expiring=true`: Chỉ lấy tài liệu sắp hết hạn
- `needsReview=true`: Chỉ lấy tài liệu cần soát xét
- `department`: Lọc theo phòng ban

### POST /api/documents/lifecycle
Tạo tài liệu mới với thông tin lifecycle

### GET /api/documents/lifecycle/[id]
Lấy thông tin chi tiết một tài liệu

### PUT /api/documents/lifecycle/[id]
Cập nhật thông tin lifecycle của tài liệu

### PATCH /api/documents/lifecycle/[id]
Cập nhật một phần thông tin với các action:
- `approve`: Phê duyệt tài liệu
- `reject`: Từ chối tài liệu
- `submit_for_approval`: Gửi phê duyệt
- `mark_for_review`: Đánh dấu đã soát xét
- `extend_validity`: Gia hạn hiệu lực

## 🛠️ Setup và Cài đặt

### 1. Cập nhật Google Sheets

```bash
# Chạy script để cập nhật cấu trúc sheets
node scripts/setup-sheets.js

# Thêm dữ liệu mẫu
node scripts/add-lifecycle-sample-data.js
```

### 2. Cài đặt Dependencies

```bash
npm install react-day-picker date-fns @radix-ui/react-popover @radix-ui/react-separator
```

### 3. Environment Variables

Đảm bảo có các biến môi trường trong `.env.local`:

```env
GOOGLE_SHEET_ID=your_sheet_id
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_private_key
```

## 📈 Tính năng Nâng cao

### 1. Tự động tính toán Ngày soát xét

Hệ thống tự động tính ngày soát xét tiếp theo dựa trên:
- Ngày soát xét gần nhất
- Chu kỳ soát xét đã chọn

### 2. Validation Logic

- Ngày bắt đầu hiệu lực không được trước ngày ban hành
- Ngày kết thúc hiệu lực phải sau ngày bắt đầu
- Người phê duyệt phải có quyền phù hợp với cấp độ tài liệu

### 3. Responsive Design

- Giao diện tối ưu cho desktop và mobile
- Form layout linh hoạt theo kích thước màn hình
- Dashboard responsive với grid system

### 4. Toast Notifications

- Thông báo thành công/lỗi khi thực hiện các thao tác
- Tự động ẩn sau 5 giây
- Có thể đóng thủ công

## 🔍 Troubleshooting

### Lỗi thường gặp:

1. **"Cannot read properties of undefined"**
   - Kiểm tra cấu trúc dữ liệu từ Google Sheets
   - Đảm bảo tất cả trường lifecycle đã được thêm

2. **"Date picker not working"**
   - Kiểm tra import của date-fns và react-day-picker
   - Đảm bảo locale 'vi' được import

3. **"Toast not showing"**
   - Kiểm tra ToastProvider đã được wrap ở Layout
   - Kiểm tra z-index của toast container

### Debug Tips:

1. Kiểm tra Network tab để xem API calls
2. Kiểm tra Console để xem error messages
3. Kiểm tra Google Sheets để đảm bảo dữ liệu được lưu đúng

## 🎉 Kết luận

Tính năng Quản lý Vòng đời Tài liệu đã được implement đầy đủ theo 12 requirements, cung cấp:

- ✅ Giao diện trực quan và dễ sử dụng
- ✅ Tự động hóa các quy trình
- ✅ Cảnh báo và thông báo kịp thời
- ✅ API đầy đủ cho tích hợp
- ✅ Responsive design
- ✅ Validation và error handling

Hệ thống sẵn sàng để sử dụng trong môi trường production với khả năng mở rộng cao.