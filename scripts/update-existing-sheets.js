const { google } = require('googleapis');

// Script để cập nhật spreadsheet hiện có với các trường lifecycle
async function updateExistingSheets() {
  try {
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

    console.log('📊 Đang cập nhật cấu trúc Google Sheets...');
    console.log('🔗 Spreadsheet ID:', spreadsheetId);

    // Kiểm tra spreadsheet hiện tại
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    console.log('✅ Đã kết nối thành công với spreadsheet:', spreadsheet.data.properties.title);

    // Lấy thông tin sheet TAI_LIEU hiện tại
    const taiLieuSheet = spreadsheet.data.sheets.find(sheet => 
      sheet.properties.title === 'tai_lieu'
    );

    if (!taiLieuSheet) {
      console.log('❌ Không tìm thấy sheet "tai_lieu"');
      return;
    }

    // Lấy headers hiện tại
    const currentHeaders = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'tai_lieu!1:1',
    });

    console.log('📋 Headers hiện tại:', currentHeaders.data.values[0]);

    // Headers mới với lifecycle fields
    const newHeaders = [
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
    ];

    // Cập nhật headers
    // Tính toán column cuối cùng (có thể vượt quá Z)
    function getColumnName(columnNumber) {
      let columnName = '';
      while (columnNumber > 0) {
        const remainder = (columnNumber - 1) % 26;
        columnName = String.fromCharCode(65 + remainder) + columnName;
        columnNumber = Math.floor((columnNumber - 1) / 26);
      }
      return columnName;
    }
    
    const endColumn = getColumnName(newHeaders.length);
    console.log(`📊 Cập nhật range: tai_lieu!A1:${endColumn}1 (${newHeaders.length} cột)`);
    
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `tai_lieu!A1:${endColumn}1`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [newHeaders],
      },
    });

    console.log('✅ Đã cập nhật headers cho sheet tai_lieu');
    console.log('📊 Số cột mới:', newHeaders.length);

    // Kiểm tra và tạo các sheet khác nếu chưa có
    const requiredSheets = ['phien_ban', 'lich_su', 'file_dinh_kem', 'tieu_chuan', 'nguoi_dung', 'phong_ban'];
    const existingSheets = spreadsheet.data.sheets.map(sheet => sheet.properties.title);

    for (const sheetName of requiredSheets) {
      if (!existingSheets.includes(sheetName)) {
        console.log(`📝 Tạo sheet mới: ${sheetName}`);
        
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [{
              addSheet: {
                properties: {
                  title: sheetName
                }
              }
            }]
          }
        });

        // Thêm headers cho sheet mới
        let headers = [];
        switch (sheetName) {
          case 'phien_ban':
            headers = ['id', 'tai_lieu_id', 'so_phien_ban', 'noi_dung', 'ghi_chu', 'nguoi_tao', 'ngay_tao', 'trang_thai'];
            break;
          case 'lich_su':
            headers = ['id', 'tai_lieu_id', 'phien_ban_id', 'hanh_dong', 'mo_ta', 'nguoi_thuc_hien', 'ngay_thuc_hien'];
            break;
          case 'file_dinh_kem':
            headers = ['id', 'tai_lieu_id', 'phien_ban_id', 'ten_file', 'duong_dan', 'kich_thuoc', 'loai_file', 'ngay_tai_len'];
            break;
          case 'tieu_chuan':
            headers = ['id', 'ten_tieu_chuan', 'ma_tieu_chuan', 'mo_ta', 'phien_ban', 'ngay_ban_hanh', 'trang_thai'];
            break;
          case 'nguoi_dung':
            headers = ['id', 'ho_ten', 'email', 'mat_khau', 'chuc_vu', 'phong_ban', 'quyen_phe_duyet', 'trang_thai', 'ngay_tao', 'ngay_cap_nhat'];
            break;
          case 'phong_ban':
            headers = ['id', 'ten_phong_ban', 'ma_phong_ban', 'truong_phong', 'pho_phong', 'mo_ta', 'trang_thai'];
            break;
        }

        if (headers.length > 0) {
          await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${sheetName}!A1:${getColumnName(headers.length)}1`,
            valueInputOption: 'RAW',
            requestBody: {
              values: [headers],
            },
          });
          console.log(`✅ Đã thêm headers cho sheet: ${sheetName}`);
        }
      } else {
        console.log(`✅ Sheet "${sheetName}" đã tồn tại`);
      }
    }

    console.log('\n🎉 Hoàn thành cập nhật cấu trúc Google Sheets!');
    console.log(`🔗 Truy cập: https://docs.google.com/spreadsheets/d/${spreadsheetId}`);

  } catch (error) {
    console.error('❌ Lỗi khi cập nhật Google Sheets:', error.message);
    if (error.code === 403) {
      console.log('💡 Gợi ý: Kiểm tra quyền truy cập của service account với spreadsheet');
      console.log('💡 Đảm bảo service account được chia sẻ quyền "Editor" cho spreadsheet');
    }
    process.exit(1);
  }
}

// Chạy script
if (require.main === module) {
  // Load environment variables
  require('dotenv').config({ path: '.env.local' });
  updateExistingSheets();
}

module.exports = { updateExistingSheets };