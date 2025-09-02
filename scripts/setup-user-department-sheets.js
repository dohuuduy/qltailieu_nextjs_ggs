const { google } = require('googleapis');

// Script để tạo sheet người dùng và phòng ban
async function setupUserDepartmentSheets() {
  try {
    // Load environment variables
    require('dotenv').config({ path: '.env.local' });

    // Cấu hình xác thực
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SPREADSHEET_ID không được cấu hình trong .env.local');
    }

    console.log('📊 Đang tạo sheet người dùng và phòng ban...');
    console.log('🔗 Spreadsheet ID:', spreadsheetId);

    // Kiểm tra spreadsheet hiện tại
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const existingSheets = spreadsheet.data.sheets.map(sheet => sheet.properties.title);
    console.log('📋 Sheets hiện có:', existingSheets);

    // Tạo sheet nguoi_dung nếu chưa có
    if (!existingSheets.includes('nguoi_dung')) {
      console.log('📝 Tạo sheet: nguoi_dung');
      
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: 'nguoi_dung'
              }
            }
          }]
        }
      });

      // Thêm headers cho sheet nguoi_dung
      const userHeaders = [
        'id', 'ho_ten', 'email', 'ten_dang_nhap', 'mat_khau', 'chuc_vu', 'phong_ban', 
        'quyen_phe_duyet', 'trang_thai', 'ngay_tao', 'ngay_cap_nhat'
      ];

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'nguoi_dung!A1:K1',
        valueInputOption: 'RAW',
        requestBody: {
          values: [userHeaders],
        },
      });

      console.log('✅ Đã tạo sheet nguoi_dung với headers');
    } else {
      console.log('✅ Sheet "nguoi_dung" đã tồn tại');
    }

    // Tạo sheet phong_ban nếu chưa có
    if (!existingSheets.includes('phong_ban')) {
      console.log('📝 Tạo sheet: phong_ban');
      
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: 'phong_ban'
              }
            }
          }]
        }
      });

      // Thêm headers cho sheet phong_ban
      const deptHeaders = [
        'id', 'ten_phong_ban', 'ma_phong_ban', 'truong_phong', 
        'pho_phong', 'mo_ta', 'trang_thai'
      ];

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'phong_ban!A1:G1',
        valueInputOption: 'RAW',
        requestBody: {
          values: [deptHeaders],
        },
      });

      console.log('✅ Đã tạo sheet phong_ban với headers');
    } else {
      console.log('✅ Sheet "phong_ban" đã tồn tại');
    }

    console.log('\n🎉 Hoàn thành tạo sheet người dùng và phòng ban!');
    console.log(`🔗 Truy cập: https://docs.google.com/spreadsheets/d/${spreadsheetId}`);

  } catch (error) {
    console.error('❌ Lỗi khi tạo sheet:', error.message);
    if (error.code === 403) {
      console.log('💡 Gợi ý: Kiểm tra quyền truy cập của service account với spreadsheet');
    }
    process.exit(1);
  }
}

// Chạy script
if (require.main === module) {
  setupUserDepartmentSheets();
}

module.exports = { setupUserDepartmentSheets };