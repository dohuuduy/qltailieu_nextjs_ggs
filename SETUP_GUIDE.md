# Hướng Dẫn Cài Đặt Google Sheets

## Bước 1: Tạo Google Cloud Project và Service Account

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Bật Google Sheets API:
   - Vào "APIs & Services" > "Library"
   - Tìm "Google Sheets API" và bật nó

4. Tạo Service Account:
   - Vào "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Điền tên service account
   - Tạo và tải file JSON credentials

## Bước 2: Tạo Google Spreadsheet

1. Truy cập [Google Sheets](https://sheets.google.com)
2. Tạo spreadsheet mới với tên "Hệ Thống Quản Lý Tài Liệu"
3. Tạo 5 sheet với tên:
   - `tai_lieu`
   - `phien_ban`
   - `lich_su`
   - `file_dinh_kem`
   - `tieu_chuan`

## Bước 3: Thêm Headers cho từng Sheet

### Sheet `tai_lieu` (A1:K1):
```
id | ten_tai_lieu | mo_ta | loai_tai_lieu | trang_thai | nguoi_tao | ngay_tao | nguoi_cap_nhat | ngay_cap_nhat | phien_ban_hien_tai | tieu_chuan_ap_dung
```

### Sheet `phien_ban` (A1:H1):
```
id | tai_lieu_id | so_phien_ban | noi_dung | ghi_chu | nguoi_tao | ngay_tao | trang_thai
```

### Sheet `lich_su` (A1:G1):
```
id | tai_lieu_id | phien_ban_id | hanh_dong | mo_ta | nguoi_thuc_hien | ngay_thuc_hien
```

### Sheet `file_dinh_kem` (A1:H1):
```
id | tai_lieu_id | phien_ban_id | ten_file | duong_dan | kich_thuoc | loai_file | ngay_tai_len
```

### Sheet `tieu_chuan` (A1:G1):
```
id | ten_tieu_chuan | ma_tieu_chuan | mo_ta | phien_ban | ngay_ban_hanh | trang_thai
```

## Bước 4: Thêm Dữ Liệu Mẫu

### Sheet `tai_lieu`:
```
1 | Quy trình kiểm tra chất lượng sản phẩm | Tài liệu mô tả quy trình kiểm tra chất lượng cho tất cả sản phẩm | quy_trinh | hieu_luc | Nguyễn Văn A | 2024-01-15 | Nguyễn Văn A | 2024-03-01 | 2.1 | ISO 9001:2015

2 | Hướng dẫn sử dụng hệ thống ERP | Tài liệu hướng dẫn chi tiết cách sử dụng hệ thống ERP | huong_dan | hieu_luc | Trần Thị B | 2024-02-01 | Trần Thị B | 2024-02-01 | 1.0 | Nội bộ
```

### Sheet `phien_ban`:
```
1 | 1 | 2.1 | Cập nhật quy trình kiểm tra theo tiêu chuẩn mới | Thêm bước kiểm tra bổ sung | Nguyễn Văn A | 2024-03-01 | hieu_luc

2 | 1 | 2.0 | Cập nhật quy trình theo yêu cầu khách hàng | Điều chỉnh thời gian kiểm tra | Nguyễn Văn A | 2024-02-15 | het_hieu_luc

3 | 2 | 1.0 | Phiên bản đầu tiên của hướng dẫn ERP | Tài liệu được tạo mới | Trần Thị B | 2024-02-01 | hieu_luc
```

### Sheet `lich_su`:
```
1 | 1 | 1 | cap_nhat_phien_ban | Tạo phiên bản 2.1: Cập nhật quy trình kiểm tra theo tiêu chuẩn mới | Nguyễn Văn A | 2024-03-01

2 | 2 | 3 | tao_moi | Tạo tài liệu mới: Hướng dẫn sử dụng hệ thống ERP | Trần Thị B | 2024-02-01
```

### Sheet `tieu_chuan`:
```
1 | ISO 9001:2015 | ISO9001-2015 | Hệ thống quản lý chất lượng - Yêu cầu | 2015 | 2015-09-15 | hieu_luc

2 | Tiêu chuẩn nội bộ | NOI-BO-001 | Tiêu chuẩn quy trình nội bộ công ty | 1.0 | 2024-01-01 | hieu_luc
```

## Bước 5: Chia Sẻ Spreadsheet

1. Click nút "Share" ở góc phải trên
2. Thêm email service account (từ file JSON credentials)
3. Cấp quyền "Editor"
4. Copy Spreadsheet ID từ URL (phần giữa `/d/` và `/edit`)

## Bước 6: Cấu Hình Ứng Dụng

1. Mở file `.env.local`
2. Thay thế `your_spreadsheet_id_here` bằng Spreadsheet ID thực tế
3. Cập nhật thông tin service account nếu cần

## Bước 7: Chạy Ứng Dụng

```bash
npm run dev
```

Truy cập http://localhost:3000 để sử dụng ứng dụng!

## Lưu Ý

- Đảm bảo service account có quyền truy cập spreadsheet
- Kiểm tra Google Sheets API đã được bật
- Spreadsheet ID phải chính xác
- Tên các sheet phải khớp với cấu hình