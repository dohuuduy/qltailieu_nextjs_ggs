# Hệ Thống Quản Lý Tài Liệu

Ứng dụng quản lý tài liệu với kiểm soát phiên bản, lịch sử thay đổi và file đính kèm, sử dụng Google Sheets làm backend.

## Tính Năng

- ✅ Quản lý tài liệu với thông tin chi tiết
- ✅ Kiểm soát phiên bản tài liệu
- ✅ Lịch sử thay đổi chi tiết
- ✅ Quản lý file đính kèm
- ✅ Áp dụng tiêu chuẩn cho tài liệu
- ✅ Giao diện thân thiện với Shadcn UI

## Công Nghệ Sử Dụng

- **Frontend**: Next.js 14, React, TypeScript
- **UI**: Shadcn UI, Tailwind CSS
- **Backend**: Google Sheets API
- **Icons**: Lucide React

## Cấu Trúc Database (Google Sheets)

### Bảng `tai_lieu`
- `id`: ID tài liệu
- `ten_tai_lieu`: Tên tài liệu
- `mo_ta`: Mô tả
- `loai_tai_lieu`: Loại tài liệu (quy_trinh, huong_dan, tai_lieu_ky_thuat, bieu_mau)
- `trang_thai`: Trạng thái (hieu_luc, het_hieu_luc)
- `nguoi_tao`: Người tạo
- `ngay_tao`: Ngày tạo
- `nguoi_cap_nhat`: Người cập nhật cuối
- `ngay_cap_nhat`: Ngày cập nhật cuối
- `phien_ban_hien_tai`: Phiên bản hiện tại
- `tieu_chuan_ap_dung`: Tiêu chuẩn áp dụng

### Bảng `phien_ban`
- `id`: ID phiên bản
- `tai_lieu_id`: ID tài liệu
- `so_phien_ban`: Số phiên bản (VD: 1.0, 2.1)
- `noi_dung`: Nội dung thay đổi
- `ghi_chu`: Ghi chú
- `nguoi_tao`: Người tạo phiên bản
- `ngay_tao`: Ngày tạo
- `trang_thai`: Trạng thái phiên bản

### Bảng `lich_su`
- `id`: ID lịch sử
- `tai_lieu_id`: ID tài liệu
- `phien_ban_id`: ID phiên bản
- `hanh_dong`: Hành động (tao_moi, cap_nhat_phien_ban, xoa)
- `mo_ta`: Mô tả chi tiết
- `nguoi_thuc_hien`: Người thực hiện
- `ngay_thuc_hien`: Ngày thực hiện

### Bảng `file_dinh_kem`
- `id`: ID file
- `tai_lieu_id`: ID tài liệu
- `phien_ban_id`: ID phiên bản
- `ten_file`: Tên file
- `duong_dan`: Đường dẫn file
- `kich_thuoc`: Kích thước file
- `loai_file`: Loại file
- `ngay_tai_len`: Ngày tải lên

### Bảng `tieu_chuan`
- `id`: ID tiêu chuẩn
- `ten_tieu_chuan`: Tên tiêu chuẩn
- `ma_tieu_chuan`: Mã tiêu chuẩn
- `mo_ta`: Mô tả
- `phien_ban`: Phiên bản tiêu chuẩn
- `ngay_ban_hanh`: Ngày ban hành
- `trang_thai`: Trạng thái

## Cài Đặt

### Development
1. Clone repository:
```bash
git clone <repository-url>
cd quan-ly-tai-lieu
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Cấu hình Google Sheets:
   - Tạo Google Service Account
   - Tải file JSON credentials
   - Tạo Google Spreadsheet và chia sẻ với service account email
   - Copy file `.env.example` thành `.env.local` và điền thông tin

4. Setup dữ liệu:
```bash
# Tạo cấu trúc sheets
node scripts/setup-user-department-sheets.js

# Thêm dữ liệu mẫu
node scripts/add-users-departments-data.js
```

5. Chạy ứng dụng:
```bash
npm run dev
```

### Production (Vercel)
1. Push code lên GitHub
2. Import project vào Vercel
3. Cấu hình Environment Variables
4. Deploy tự động

**Chi tiết deployment:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### Tài khoản test:
- **Admin:** duy / a123
- **User:** tranthib / password123
- **Manager:** levanc / password123

## Cấu Hình Google Sheets

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Bật Google Sheets API
4. Tạo Service Account và tải file JSON
5. Tạo Google Spreadsheet với các sheet tương ứng
6. Chia sẻ spreadsheet với email service account

## Sử Dụng

1. **Tạo tài liệu mới**: Click nút "Tạo Tài Liệu Mới"
2. **Quản lý phiên bản**: Click icon Edit để tạo phiên bản mới
3. **Xem lịch sử**: Click icon History để xem lịch sử thay đổi
4. **Quản lý file**: Tính năng sẽ được bổ sung trong phiên bản tiếp theo

## Phát Triển Tiếp

- [ ] Upload và quản lý file đính kèm
- [ ] Tìm kiếm và lọc tài liệu
- [ ] Xuất báo cáo
- [ ] Phân quyền người dùng
- [ ] Thông báo khi có thay đổi
- [ ] API tích hợp với hệ thống khác

## Đóng Góp

Mọi đóng góp đều được chào đón! Vui lòng tạo issue hoặc pull request.

## License

MIT License