# Hướng dẫn Deploy lên Vercel - Chi tiết từng bước

## 🚀 Bước 1: Chuẩn bị Vercel Account

1. **Truy cập Vercel:**
   - Vào https://vercel.com
   - Click "Sign Up" nếu chưa có account

2. **Đăng ký bằng GitHub:**
   - Chọn "Continue with GitHub"
   - Authorize Vercel truy cập GitHub account của bạn

## 🔗 Bước 2: Import Project từ GitHub

1. **Tạo Project mới:**
   - Trong Vercel Dashboard, click "New Project"
   - Hoặc click "Add New..." → "Project"

2. **Import Repository:**
   - Tìm repository `qltailieu_nextjs_ggs`
   - Click "Import" bên cạnh repository

3. **Configure Project:**
   - **Project Name:** `qltailieu-nextjs` (hoặc tên bạn muốn)
   - **Framework Preset:** Next.js (tự động detect)
   - **Root Directory:** `./` (mặc định)
   - **Build Command:** `npm run build` (mặc định)
   - **Output Directory:** `.next` (mặc định)

## ⚙️ Bước 3: Cấu hình Environment Variables

**QUAN TRỌNG:** Phải cấu hình đúng các biến môi trường trước khi deploy!

1. **Trong Configure Project page:**
   - Mở rộng section "Environment Variables"

2. **Thêm các biến sau:**

   **GOOGLE_SPREADSHEET_ID:**
   ```
   Name: GOOGLE_SPREADSHEET_ID
   Value: 11auJkhP6TtJJUq84BaeIHRa5NpE_8IX9CX_nj_pyjcc
   ```

   **GOOGLE_CLIENT_EMAIL:**
   ```
   Name: GOOGLE_CLIENT_EMAIL  
   Value: [Email service account của bạn]
   ```
   *Ví dụ: my-service@my-project.iam.gserviceaccount.com*

   **GOOGLE_PRIVATE_KEY:**
   ```
   Name: GOOGLE_PRIVATE_KEY
   Value: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
   ```

   **⚠️ Lưu ý về GOOGLE_PRIVATE_KEY:**
   - Phải bao gồm dấu ngoặc kép ở đầu và cuối
   - Giữ nguyên `\n` cho line breaks
   - Bao gồm cả `-----BEGIN PRIVATE KEY-----` và `-----END PRIVATE KEY-----`
   - Copy toàn bộ từ file JSON service account

## 🚀 Bước 4: Deploy

1. **Click "Deploy"**
   - Vercel sẽ bắt đầu build process
   - Thời gian build: khoảng 2-5 phút

2. **Theo dõi Build Process:**
   - Xem real-time logs
   - Kiểm tra có lỗi gì không

3. **Hoàn thành:**
   - Khi thành công, bạn sẽ thấy "🎉 Your project has been deployed"
   - Vercel cung cấp URL production

## 🔍 Bước 5: Kiểm tra Deployment

### Test các tính năng chính:

1. **Truy cập URL production**
2. **Test Authentication:**
   - Vào `/login`
   - Đăng nhập với: `duy` / `a123`
   - Kiểm tra redirect về dashboard

3. **Test API Endpoints:**
   - `/api/users` - Load danh sách users
   - `/api/departments` - Load danh sách phòng ban
   - `/api/auth/verify` - Verify token

4. **Test UI Components:**
   - Date picker functionality
   - Document management
   - User dropdown menu

## 🛠️ Troubleshooting

### Lỗi thường gặp và cách sửa:

**1. Build Error - TypeScript:**
```
Solution: Kiểm tra TypeScript errors local trước khi deploy
Command: npm run build
```

**2. Google Sheets API Error:**
```
Error: "Error: 403 Forbidden"
Solution: 
- Kiểm tra service account có quyền truy cập spreadsheet
- Verify GOOGLE_CLIENT_EMAIL đúng
- Check GOOGLE_PRIVATE_KEY format
```

**3. Environment Variables Error:**
```
Error: "GOOGLE_SPREADSHEET_ID is not defined"
Solution:
- Vào Vercel Dashboard > Settings > Environment Variables
- Kiểm tra tất cả biến đã được set
- Redeploy sau khi update env vars
```

**4. Authentication Error:**
```
Error: "401 Unauthorized"
Solution:
- Check Google Sheets có dữ liệu users không
- Verify password trong sheets
- Test API endpoints trực tiếp
```

## 📊 Bước 6: Monitoring và Logs

1. **Function Logs:**
   - Vercel Dashboard > Functions tab
   - Xem real-time API logs
   - Debug authentication issues

2. **Analytics:**
   - Monitor traffic và performance
   - Track user behavior

3. **Alerts:**
   - Setup alerts cho errors
   - Monitor uptime

## 🌐 Bước 7: Custom Domain (Optional)

1. **Add Domain:**
   - Settings > Domains
   - Add your custom domain

2. **DNS Configuration:**
   - Add CNAME record pointing to Vercel
   - Wait for DNS propagation

3. **SSL Certificate:**
   - Vercel tự động provision SSL
   - Force HTTPS redirect

## 🔄 Bước 8: Auto-Deploy Setup

1. **Git Integration:**
   - Settings > Git
   - Configure auto-deploy từ main branch

2. **Preview Deployments:**
   - Mỗi PR tạo preview URL
   - Test changes trước khi merge

## 📝 Thông tin quan trọng sau deploy:

### URLs:
- **Production:** https://your-project.vercel.app
- **Dashboard:** https://vercel.com/dashboard

### Tài khoản test:
- **Admin:** duy / a123
- **User:** tranthib / password123  
- **Manager:** levanc / password123

### API Endpoints:
- `/api/auth/login` - Authentication
- `/api/users` - User management
- `/api/departments` - Department management
- `/api/documents` - Document management

## 🎯 Next Steps sau khi deploy thành công:

1. **Test toàn bộ functionality**
2. **Setup monitoring và alerts**
3. **Configure custom domain nếu cần**
4. **Share URL với team để test**
5. **Document API endpoints cho integration**

---

**🎉 Chúc mừng! Project của bạn đã được deploy thành công lên Vercel!**

Nếu gặp vấn đề gì, check logs trong Vercel Dashboard hoặc liên hệ để được hỗ trợ.