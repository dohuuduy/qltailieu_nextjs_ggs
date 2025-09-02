# Changelog - Cập nhật Date Picker và Tính năng Soát xét/Phê duyệt

## Ngày cập nhật: 02/09/2025

### ✅ Đã hoàn thành

#### 1. Cập nhật Date Picker
- **Xóa bỏ** các thư viện date picker cũ không sử dụng
- **Tạo mới** `components/ui/date-picker.tsx` với shadcn calendar-13 standard
- **Cập nhật** `components/ui/calendar.tsx` với dropdown year/month selection
- **Tích hợp** date-fns với locale tiếng Việt
- **Hỗ trợ** DatePicker và DateRangePicker components

#### 2. Cải thiện Tính năng Soát xét và Phê duyệt
- **Cập nhật** `components/ApprovalActions.tsx`:
  - Sử dụng DatePicker mới cho chọn ngày soát xét
  - Thêm tính năng gia hạn hiệu lực với date picker
  - Cải thiện UX với validation và feedback
  
- **Tạo mới** `components/DocumentLifecycleFormNew.tsx`:
  - Form hoàn chỉnh với date picker mới
  - Validation ngày tháng chính xác
  - Tự động tính toán ngày soát xét tiếp theo
  - Hiển thị trạng thái tài liệu real-time

#### 3. Cập nhật Authentication System
- **Cập nhật** Google Sheets schema cho bảng `nguoi_dung`:
  - Thêm trường `ten_dang_nhap` và `mat_khau`
  - Hỗ trợ đăng nhập bằng email hoặc tên đăng nhập
  - Tích hợp với API authentication

- **Tạo script** `scripts/update-users-sheet.js`:
  - Cập nhật cấu trúc bảng người dùng
  - Thêm dữ liệu mẫu với 5 tài khoản test
  - Hỗ trợ các quyền phê duyệt khác nhau

#### 4. Cải thiện API và Backend
- **Cập nhật** `app/api/auth/login/route.ts`:
  - Kết nối với Google Sheets thay vì dữ liệu cứng
  - Hỗ trợ authentication từ database thực
  
- **Cải thiện** `app/api/documents/lifecycle/[id]/route.ts`:
  - Xử lý các action soát xét và phê duyệt
  - Tự động cập nhật ngày tháng và trạng thái
  - Validation logic nghiệp vụ

#### 5. UI/UX Improvements
- **Thêm** form validation với error messages
- **Cải thiện** date picker với placeholder và disabled states
- **Tối ưu** responsive design cho mobile
- **Thêm** loading states và feedback

### 🔧 Tính năng mới

#### Date Picker Components
```typescript
// Simple Date Picker
<DatePicker
  date={selectedDate}
  onDateChange={setSelectedDate}
  placeholder="Chọn ngày"
  minDate={new Date()}
  maxDate={new Date('2025-12-31')}
/>

// Date Range Picker
<DateRangePicker
  startDate={startDate}
  endDate={endDate}
  onStartDateChange={setStartDate}
  onEndDateChange={setEndDate}
  startPlaceholder="Ngày bắt đầu"
  endPlaceholder="Ngày kết thúc"
/>
```

#### Approval Actions với Date Picker
- **Soát xét tài liệu**: Chọn ngày soát xét với date picker
- **Gia hạn hiệu lực**: Chọn ngày kết thúc mới
- **Phê duyệt**: Tự động set ngày phê duyệt
- **Validation**: Kiểm tra logic ngày tháng

### 📊 Tài khoản Test

| Tên đăng nhập | Mật khẩu | Vai trò | Quyền phê duyệt |
|---------------|----------|---------|-----------------|
| admin | admin123 | Admin | admin,manager,user |
| user1 | user123 | User | user |
| manager1 | manager123 | Manager | manager,user |
| user2 | user123 | User | user |
| manager2 | manager123 | Manager | manager,user |

### 🗂️ Files đã thay đổi

#### Tạo mới:
- `components/ui/date-picker.tsx` - Date picker components
- `components/ui/form.tsx` - Form utilities
- `components/DocumentLifecycleFormNew.tsx` - Form với date picker mới
- `scripts/update-users-sheet.js` - Script cập nhật users
- `middleware.ts` - Route protection

#### Cập nhật:
- `components/ui/calendar.tsx` - Calendar với dropdown
- `components/ApprovalActions.tsx` - Actions với date picker
- `app/api/auth/login/route.ts` - Authentication từ Sheets
- `app/api/auth/verify/route.ts` - Token verification
- `lib/google-sheets.ts` - Schema và authentication
- `app/login/page.tsx` - Login UI updates

#### Xóa bỏ:
- `components/ui/enhanced-date-picker.tsx` - Không sử dụng
- `components/DocumentLifecycleForm.tsx` - Thay thế bằng version mới

### 🚀 Cách sử dụng

1. **Đăng nhập**: Sử dụng tài khoản test ở trên
2. **Quản lý tài liệu**: Vào tab "Quản Lý Tài Liệu"
3. **Thêm lifecycle**: Click "Thêm vòng đời" và điền form
4. **Chọn ngày**: Sử dụng date picker để chọn các ngày quan trọng
5. **Soát xét/Phê duyệt**: Sử dụng các action buttons với date selection

### 🐛 Lỗi đã sửa

- ✅ Date picker không hoạt động với locale tiếng Việt
- ✅ Form validation không chính xác cho ngày tháng
- ✅ Authentication không kết nối với Google Sheets
- ✅ Trạng thái tài liệu không cập nhật sau actions
- ✅ Build errors với zod schema
- ✅ Import errors với enhanced date picker

### 📝 Ghi chú

- Tất cả date picker đều sử dụng format `dd/MM/yyyy` (tiếng Việt)
- Validation logic đảm bảo ngày bắt đầu không trước ngày ban hành
- Tự động tính toán ngày soát xét tiếp theo dựa trên chu kỳ
- Hỗ trợ cả email và tên đăng nhập để authentication
- Responsive design cho mobile và desktop