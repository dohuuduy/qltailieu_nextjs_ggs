# Hướng dẫn Deploy lên Vercel

## 1. Chuẩn bị project

### Environment Variables cần thiết:
```
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_private_key
```

### Kiểm tra build local:
```bash
npm run build
```

## 2. Commit và Push lên GitHub

```bash
# Add tất cả files
git add .

# Commit với message
git commit -m "feat: Complete authentication system with Google Sheets integration

- ✅ Fixed authentication system with Google Sheets
- ✅ Added user and department management
- ✅ Implemented date picker components with shadcn calendar-13
- ✅ Fixed document lifecycle form with validation
- ✅ Added role-based access control
- ✅ Integrated login/logout functionality
- ✅ Added comprehensive error handling
- ✅ Created setup scripts for Google Sheets data"

# Push lên GitHub
git push origin main
```

## 3. Deploy lên Vercel

### Bước 1: Tạo account Vercel
1. Truy cập https://vercel.com
2. Đăng ký/đăng nhập bằng GitHub account

### Bước 2: Import project
1. Click "New Project"
2. Import từ GitHub repository
3. Chọn repository của bạn

### Bước 3: Cấu hình Environment Variables
Trong Vercel dashboard, vào Settings > Environment Variables và thêm:

```
GOOGLE_SPREADSHEET_ID = 11auJkhP6TtJJUq84BaeIHRa5NpE_8IX9CX_nj_pyjcc
GOOGLE_CLIENT_EMAIL = your_service_account_email
GOOGLE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

**Lưu ý quan trọng về GOOGLE_PRIVATE_KEY:**
- Phải bao gồm dấu ngoặc kép
- Giữ nguyên format với \n cho line breaks
- Không xóa -----BEGIN PRIVATE KEY----- và -----END PRIVATE KEY-----

### Bước 4: Deploy
1. Click "Deploy"
2. Chờ build process hoàn thành
3. Vercel sẽ cung cấp URL production

## 4. Sau khi deploy

### Kiểm tra các tính năng:
- [ ] Login với tài khoản: duy / a123
- [ ] Load danh sách users và departments
- [ ] Document management
- [ ] Date picker functionality
- [ ] Role-based access

### Troubleshooting thường gặp:

**Lỗi Google Sheets API:**
- Kiểm tra service account có quyền truy cập spreadsheet
- Verify environment variables đã set đúng
- Check GOOGLE_PRIVATE_KEY format

**Lỗi Build:**
- Chạy `npm run build` local để test
- Check TypeScript errors
- Verify all dependencies

**Lỗi Runtime:**
- Check Vercel Function Logs
- Verify API routes hoạt động
- Test authentication flow

## 5. Custom Domain (Optional)

1. Vào Settings > Domains
2. Add custom domain
3. Configure DNS records theo hướng dẫn Vercel

## 6. Monitoring và Logs

- Vercel Dashboard > Functions tab để xem API logs
- Analytics tab để monitor performance
- Settings > Git để configure auto-deploy

## Tài khoản test sau deploy:
- **Admin:** duy / a123
- **User:** tranthib / password123
- **Manager:** levanc / password123