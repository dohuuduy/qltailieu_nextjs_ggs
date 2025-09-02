# 🔐 Hướng dẫn Import Environment Variables vào Vercel

## 📁 Files đã tạo sẵn:

1. **`.env.vercel`** - Copy từng dòng thủ công
2. **`vercel-env-import.json`** - Import bulk (nếu Vercel hỗ trợ)

## 🚀 Cách 1: Import thủ công (Khuyến nghị)

### Bước 1: Mở Vercel Dashboard
1. Truy cập https://vercel.com/dashboard
2. Chọn project sau khi import từ GitHub
3. Vào **Settings** > **Environment Variables**

### Bước 2: Thêm từng biến

**GOOGLE_SPREADSHEET_ID:**
```
Key: GOOGLE_SPREADSHEET_ID
Value: 11auJkhP6TtJJUq84BaeIHRa5NpE_8IX9CX_nj_pyjcc
Environments: Production, Preview, Development
```

**GOOGLE_CLIENT_EMAIL:**
```
Key: GOOGLE_CLIENT_EMAIL
Value: qltailieu-nextjs@qltailieu-nextjs.iam.gserviceaccount.com
Environments: Production, Preview, Development
```

**GOOGLE_PRIVATE_KEY:**
```
Key: GOOGLE_PRIVATE_KEY
Value: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDDbp4j1pQs5zjY\nggjkjyH4yXF52dLjSr8I1bLU0FllqeQiH/AKj10H4RKX2qei25W0L8Mjrb4Sqjho\nb2LSmPGywcxTyYEzDNf8GWDl4guUCmecCILmmObVCps+VdwPkh5at4RvUXo4yP8R\nxKZwnc1/829hnj7w0w6ydm9g5ju85PtF0vJRFoqF0OZvQ7clc+cRPuNqs1MwXQK9\n4ufNvCeX+w4hhS1wuCyOhDxRTu1pSIx0VWKzrfeHl4+mHNa/6v0+Er6lmg+LJtWL\nWTcZxD4g6aVsO+HqSKiQCJz9Rztz1HRAu356KIVl6hTKcX8eVNFqGOXzK//vX73j\n9qupUr6nAgMBAAECggEAXQ1b7bt7VQAJQIl1u4HtTnx38+lDsOaDnCzIF+1WS4I/\ndgIX9Kc7SAeiJzy8qd38400EkIXm5RM4hX1Xo+ef2ZnN9K0Sv+BjLI1W5k4hbi0g\nFRq2XR67df+1WFJgU+eiXVZZD/nPBJ+rV2X3S9LPKJeb1nKXDGqp6k5bDNvC4Naf\nCAbX1RDFD/i5uztdX0Aju5rOrbMgkMGLh3Bgs2IQGR8kZgmMh1o0kyWc6/btqxBi\nNmGE6Q3zunFEAEeP6yZiToZKInZcAXKBNaIJm/ZyC9F1jzhRfr3mt1xHXg2IxRyK\ns0CAHLLk03D2rout4waHigVF3Tqs1qdaqVENudofFQKBgQDrYOhE++ki7Z8g4uk8\nCGb3Da+TandfNeOxcISY+rJZodmMF4osEeC7yd3Bi2ysI0U3JAyjBDW8V1wvn7im\nz6RRme+KZPMWNz+izfhb2JTNGfJD5vS98JkqQeuMcL6kWLZtVAWiXsx6Lv2nW/jY\nmCZlrlCk9ArA+CzAmn+B1z62uwKBgQDUjcmpVYRZWbkeYpDcIvDdIWnkWUPWxfjK\n0Kk2f15CnKDDZwalbf8WL34rP1YTwhB/kejkOJmHWLO5LDo48ulApFeBznUdXof/\nkyFOhSJQrDwZIr/gUBP4tsvA49lUsZysQqx85w4knpHfDlvu4ZpJKFetG7ELTXyX\ntVufU5U3BQKBgDvFNfYeigsmkBwHwvZNo+fkf8tNY9a3loQ+cE1wi82a/eVHLP0X\n5RuKnVdCkmv74N2pt9PFg+e5v10QkBE79RwLnPplvBzOFsi+yOx5yP90MULw6QE6\nkYpbhvb4wlB1fo2womWi8QWt3ReckUpfCJEVfMEGf5yU6LhYAzzzbad1AoGAPd5X\niJZ/w5I+M/30tF7nRTZooDLrcCSH2mEKH/bK9RCqKrZeVODDky2Xx/bTk0S1kKxj\n4aon5iGHjqq098ac5lfvsLTrmfTeGSI2W6ic6GZ5x8c5mo00gvySKj8oD2Lze6Cc\nnG6Uy0vsocSINewtAIZhnt2klumjDnWXibTGhhECgYAeN4CTilF6z1+RMyv0skVb\nBoH8k/6S5BgeGT6/O56cxYQDJcsSgtkF/7O6Sgvds763+ggY5ouPUFscH48zOiaD\nuh6OP8ULZeWgb3ug43c3kcZYZ6t/L2H8fULRmg/C3seyROyrrjcBgqXUyk+6hZct\nY4O9x/7lczTx3gHFmnMHEw==\n-----END PRIVATE KEY-----\n"
Environments: Production, Preview, Development
```

**⚠️ Lưu ý quan trọng về GOOGLE_PRIVATE_KEY:**
- Phải bao gồm dấu ngoặc kép ở đầu và cuối
- Giữ nguyên `\n` cho line breaks
- Copy chính xác từ file `.env.vercel`

## 🔧 Cách 2: Sử dụng Vercel CLI (Advanced)

### Bước 1: Cài đặt Vercel CLI
```bash
npm i -g vercel
```

### Bước 2: Login
```bash
vercel login
```

### Bước 3: Link project
```bash
vercel link
```

### Bước 4: Add environment variables
```bash
vercel env add GOOGLE_SPREADSHEET_ID
# Nhập value: 11auJkhP6TtJJUq84BaeIHRa5NpE_8IX9CX_nj_pyjcc

vercel env add GOOGLE_CLIENT_EMAIL  
# Nhập value: qltailieu-nextjs@qltailieu-nextjs.iam.gserviceaccount.com

vercel env add GOOGLE_PRIVATE_KEY
# Nhập value: "-----BEGIN PRIVATE KEY-----\n[full key]\n-----END PRIVATE KEY-----\n"
```

## 📋 Checklist sau khi thêm Environment Variables:

- [ ] GOOGLE_SPREADSHEET_ID đã được thêm
- [ ] GOOGLE_CLIENT_EMAIL đã được thêm  
- [ ] GOOGLE_PRIVATE_KEY đã được thêm với format đúng
- [ ] Tất cả variables được set cho Production, Preview, Development
- [ ] Click "Save" cho mỗi variable

## 🚀 Deploy sau khi cấu hình:

1. **Redeploy project** để áp dụng env vars
2. **Test authentication** với tài khoản: `duy` / `a123`
3. **Kiểm tra API endpoints** hoạt động
4. **Verify Google Sheets connection**

## 🔍 Troubleshooting:

**Lỗi "GOOGLE_PRIVATE_KEY format":**
- Đảm bảo có dấu ngoặc kép
- Giữ nguyên `\n` characters
- Không có spaces thừa

**Lỗi "403 Forbidden":**
- Kiểm tra service account có quyền truy cập spreadsheet
- Verify GOOGLE_CLIENT_EMAIL đúng

**Lỗi "Environment variable not found":**
- Redeploy project sau khi thêm env vars
- Check spelling của variable names

---

**✅ Sau khi hoàn thành, project sẽ sẵn sàng chạy trên Vercel!**