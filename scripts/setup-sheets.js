const { google } = require('googleapis');

// Script để tạo Google Spreadsheet và các sheet cần thiết
async function setupGoogleSheets() {
  try {
    // Cấu hình xác thực
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: 'qltailieu-nextjs@qltailieu-nextjs.iam.gserviceaccount.com',
        private_key: `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDDbp4j1pQs5zjY
ggjkjyH4yXF52dLjSr8I1bLU0FllqeQiH/AKj10H4RKX2qei25W0L8Mjrb4Sqjho
b2LSmPGywcxTyYEzDNf8GWDl4guUCmecCILmmObVCps+VdwPkh5at4RvUXo4yP8R
xKZwnc1/829hnj7w0w6ydm9g5ju85PtF0vJRFoqF0OZvQ7clc+cRPuNqs1MwXQK9
4ufNvCeX+w4hhS1wuCyOhDxRTu1pSIx0VWKzrfeHl4+mHNa/6v0+Er6lmg+LJtWL
WTcZxD4g6aVsO+HqSKiQCJz9Rztz1HRAu356KIVl6hTKcX8eVNFqGOXzK//vX73j
9qupUr6nAgMBAAECggEAXQ1b7bt7VQAJQIl1u4HtTnx38+lDsOaDnCzIF+1WS4I/
dgIX9Kc7SAeiJzy8qd38400EkIXm5RM4hX1Xo+ef2ZnN9K0Sv+BjLI1W5k4hbi0g
FRq2XR67df+1WFJgU+eiXVZZD/nPBJ+rV2X3S9LPKJeb1nKXDGqp6k5bDNvC4Naf
CAbX1RDFD/i5uztdX0Aju5rOrbMgkMGLh3Bgs2IQGR8kZgmMh1o0kyWc6/btqxBi
NmGE6Q3zunFEAEeP6yZiToZKInZcAXKBNaIJm/ZyC9F1jzhRfr3mt1xHXg2IxRyK
s0CAHLLk03D2rout4waHigVF3Tqs1qdaqVENudofFQKBgQDrYOhE++ki7Z8g4uk8
CGb3Da+TandfNeOxcISY+rJZodmMF4osEeC7yd3Bi2ysI0U3JAyjBDW8V1wvn7im
z6RRme+KZPMWNz+izfhb2JTNGfJD5vS98JkqQeuMcL6kWLZtVAWiXsx6Lv2nW/jY
mCZlrlCk9ArA+CzAmn+B1z62uwKBgQDUjcmpVYRZWbkeYpDcIvDdIWnkWUPWxfjK
0Kk2f15CnKDDZwalbf8WL34rP1YTwhB/kejkOJmHWLO5LDo48ulApFeBznUdXof/
kyFOhSJQrDwZIr/gUBP4tsvA49lUsZysQqx85w4knpHfDlvu4ZpJKFetG7ELTXyX
tVufU5U3BQKBgDvFNfYeigsmkBwHwvZNo+fkf8tNY9a3loQ+cE1wi82a/eVHLP0X
5RuKnVdCkmv74N2pt9PFg+e5v10QkBE79RwLnPplvBzOFsi+yOx5yP90MULw6QE6
kYpbhvb4wlB1fo2womWi8QWt3ReckUpfCJEVfMEGf5yU6LhYAzzzbad1AoGAPd5X
iJZ/w5I+M/30tF7nRTZooDLrcCSH2mEKH/bK9RCqKrZeVODDky2Xx/bTk0S1kKxj
4aon5iGHjqq098ac5lfvsLTrmfTeGSI2W6ic6GZ5x8c5mo00gvySKj8oD2Lze6Cc
nG6Uy0vsocSINewtAIZhnt2klumjDnWXibTGhhECgYAeN4CTilF6z1+RMyv0skVb
BoH8k/6S5BgeGT6/O56cxYQDJcsSgtkF/7O6Sgvds763+ggY5ouPUFscH48zOiaD
uh6OP8ULZeWgb3ug43c3kcZYZ6t/L2H8fULRmg/C3seyROyrrjcBgqXUyk+6hZct
Y4O9x/7lczTx3gHFmnMHEw==
-----END PRIVATE KEY-----`,
      },
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file'
      ],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Tạo spreadsheet mới
    const spreadsheet = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: 'Hệ Thống Quản Lý Tài Liệu',
        },
        sheets: [
          {
            properties: {
              title: 'tai_lieu',
            },
          },
          {
            properties: {
              title: 'phien_ban',
            },
          },
          {
            properties: {
              title: 'lich_su',
            },
          },
          {
            properties: {
              title: 'file_dinh_kem',
            },
          },
          {
            properties: {
              title: 'tieu_chuan',
            },
          },
        ],
      },
    });

    const spreadsheetId = spreadsheet.data.spreadsheetId;
    console.log('✅ Đã tạo spreadsheet:', spreadsheetId);
    console.log('🔗 Link:', `https://docs.google.com/spreadsheets/d/${spreadsheetId}`);

    // Thêm headers cho từng sheet
    const headers = {
      tai_lieu: [
        'id', 'ten_tai_lieu', 'mo_ta', 'loai_tai_lieu', 'trang_thai',
        'nguoi_tao', 'ngay_tao', 'nguoi_cap_nhat', 'ngay_cap_nhat',
        'phien_ban_hien_tai', 'tieu_chuan_ap_dung', 'url_file',
        // Lifecycle dates
        'ngay_ban_hanh', 'ngay_bat_dau_hieu_luc', 'ngay_ket_thuc_hieu_luc',
        'chu_ky_soat_xet', 'ngay_soat_xet_gan_nhat', 'ngay_soat_xet_tiep_theo',
        // Approval workflow
        'nguoi_soan_thao', 'nguoi_phe_duyet', 'ngay_phe_duyet', 'trang_thai_phe_duyet',
        'phong_ban_chu_quan', 'phong_ban_lien_quan', 'cap_do_tai_lieu',
        // Additional fields
        'ly_do_thay_doi', 'ghi_chu_phe_duyet'
      ],
      phien_ban: [
        'id', 'tai_lieu_id', 'so_phien_ban', 'noi_dung', 'ghi_chu',
        'nguoi_tao', 'ngay_tao', 'trang_thai'
      ],
      lich_su: [
        'id', 'tai_lieu_id', 'phien_ban_id', 'hanh_dong', 'mo_ta',
        'nguoi_thuc_hien', 'ngay_thuc_hien'
      ],
      file_dinh_kem: [
        'id', 'tai_lieu_id', 'phien_ban_id', 'ten_file', 'duong_dan',
        'kich_thuoc', 'loai_file', 'ngay_tai_len'
      ],
      tieu_chuan: [
        'id', 'ten_tieu_chuan', 'ma_tieu_chuan', 'mo_ta', 'phien_ban',
        'ngay_ban_hanh', 'trang_thai'
      ]
    };

    // Thêm headers vào từng sheet
    for (const [sheetName, headerRow] of Object.entries(headers)) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A1:${String.fromCharCode(65 + headerRow.length - 1)}1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [headerRow],
        },
      });
      console.log(`✅ Đã thêm headers cho sheet: ${sheetName}`);
    }

    // Thêm dữ liệu mẫu
    const sampleData = {
      tai_lieu: [
        [
          '1',
          'Quy trình kiểm tra chất lượng sản phẩm',
          'Tài liệu mô tả quy trình kiểm tra chất lượng cho tất cả sản phẩm',
          'quy_trinh',
          'hieu_luc',
          'Nguyễn Văn A',
          '2024-01-15',
          'Nguyễn Văn A',
          '2024-03-01',
          '2.1',
          'ISO 9001:2015'
        ],
        [
          '2',
          'Hướng dẫn sử dụng hệ thống ERP',
          'Tài liệu hướng dẫn chi tiết cách sử dụng hệ thống ERP',
          'huong_dan',
          'hieu_luc',
          'Trần Thị B',
          '2024-02-01',
          'Trần Thị B',
          '2024-02-01',
          '1.0',
          'Nội bộ'
        ]
      ],
      phien_ban: [
        [
          '1',
          '1',
          '2.1',
          'Cập nhật quy trình kiểm tra theo tiêu chuẩn mới',
          'Thêm bước kiểm tra bổ sung',
          'Nguyễn Văn A',
          '2024-03-01',
          'hieu_luc'
        ],
        [
          '2',
          '1',
          '2.0',
          'Cập nhật quy trình theo yêu cầu khách hàng',
          'Điều chỉnh thời gian kiểm tra',
          'Nguyễn Văn A',
          '2024-02-15',
          'het_hieu_luc'
        ],
        [
          '3',
          '2',
          '1.0',
          'Phiên bản đầu tiên của hướng dẫn ERP',
          'Tài liệu được tạo mới',
          'Trần Thị B',
          '2024-02-01',
          'hieu_luc'
        ]
      ],
      lich_su: [
        [
          '1',
          '1',
          '1',
          'cap_nhat_phien_ban',
          'Tạo phiên bản 2.1: Cập nhật quy trình kiểm tra theo tiêu chuẩn mới',
          'Nguyễn Văn A',
          '2024-03-01'
        ],
        [
          '2',
          '2',
          '3',
          'tao_moi',
          'Tạo tài liệu mới: Hướng dẫn sử dụng hệ thống ERP',
          'Trần Thị B',
          '2024-02-01'
        ]
      ],
      tieu_chuan: [
        [
          '1',
          'ISO 9001:2015',
          'ISO9001-2015',
          'Hệ thống quản lý chất lượng - Yêu cầu',
          '2015',
          '2015-09-15',
          'hieu_luc'
        ],
        [
          '2',
          'Tiêu chuẩn nội bộ',
          'NOI-BO-001',
          'Tiêu chuẩn quy trình nội bộ công ty',
          '1.0',
          '2024-01-01',
          'hieu_luc'
        ]
      ]
    };

    // Thêm dữ liệu mẫu vào từng sheet
    for (const [sheetName, data] of Object.entries(sampleData)) {
      if (data.length > 0) {
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: `${sheetName}!A:Z`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: data,
          },
        });
        console.log(`✅ Đã thêm ${data.length} dòng dữ liệu mẫu cho sheet: ${sheetName}`);
      }
    }

    console.log('\n🎉 Hoàn thành setup Google Sheets!');
    console.log(`📋 Spreadsheet ID: ${spreadsheetId}`);
    console.log('📝 Hãy copy Spreadsheet ID này vào file .env.local');
    console.log(`🔗 Truy cập: https://docs.google.com/spreadsheets/d/${spreadsheetId}`);

    return spreadsheetId;
  } catch (error) {
    console.error('❌ Lỗi khi setup Google Sheets:', error);
    throw error;
  }
}

// Chạy script
if (require.main === module) {
  setupGoogleSheets()
    .then((spreadsheetId) => {
      console.log('\n✅ Setup thành công!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Setup thất bại:', error);
      process.exit(1);
    });
}

module.exports = { setupGoogleSheets };