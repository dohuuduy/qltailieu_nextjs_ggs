const { google } = require('googleapis');
require('dotenv').config({ path: '.env.local' });

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: GOOGLE_CLIENT_EMAIL,
    private_key: GOOGLE_PRIVATE_KEY,
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function updateUsersSheet() {
  try {
    console.log('Đang cập nhật sheet nguoi_dung...');

    // Cập nhật header với trường ten_dang_nhap
    const headers = [
      'id', 'ho_ten', 'email', 'ten_dang_nhap', 'mat_khau', 'chuc_vu', 
      'phong_ban', 'quyen_phe_duyet', 'trang_thai', 'ngay_tao', 'ngay_cap_nhat'
    ];

    // Xóa dữ liệu cũ và thêm header mới
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: 'nguoi_dung!A:Z',
    });

    // Thêm header
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'nguoi_dung!A1:K1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [headers],
      },
    });

    // Thêm dữ liệu mẫu
    const sampleUsers = [
      [
        '1', 'Quản trị viên', 'admin@company.com', 'admin', 'admin123',
        'Quản trị hệ thống', 'IT', 'admin,manager,user', 'active',
        new Date().toISOString().split('T')[0], new Date().toISOString().split('T')[0]
      ],
      [
        '2', 'Nguyễn Văn A', 'user1@company.com', 'user1', 'user123',
        'Nhân viên', 'Kế toán', 'user', 'active',
        new Date().toISOString().split('T')[0], new Date().toISOString().split('T')[0]
      ],
      [
        '3', 'Trần Thị B', 'manager1@company.com', 'manager1', 'manager123',
        'Trưởng phòng', 'Nhân sự', 'manager,user', 'active',
        new Date().toISOString().split('T')[0], new Date().toISOString().split('T')[0]
      ],
      [
        '4', 'Lê Văn C', 'user2@company.com', 'user2', 'user123',
        'Chuyên viên', 'Kỹ thuật', 'user', 'active',
        new Date().toISOString().split('T')[0], new Date().toISOString().split('T')[0]
      ],
      [
        '5', 'Phạm Thị D', 'manager2@company.com', 'manager2', 'manager123',
        'Phó phòng', 'Kế toán', 'manager,user', 'active',
        new Date().toISOString().split('T')[0], new Date().toISOString().split('T')[0]
      ]
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'nguoi_dung!A:K',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: sampleUsers,
      },
    });

    console.log('✅ Đã cập nhật sheet nguoi_dung thành công!');
    console.log('📋 Thông tin đăng nhập mẫu:');
    console.log('   - Admin: admin / admin123');
    console.log('   - User1: user1 / user123');
    console.log('   - Manager1: manager1 / manager123');
    console.log('   - User2: user2 / user123');
    console.log('   - Manager2: manager2 / manager123');
    console.log('💡 Có thể sử dụng email hoặc tên đăng nhập để đăng nhập');

  } catch (error) {
    console.error('❌ Lỗi khi cập nhật sheet:', error.message);
    if (error.message.includes('Unable to parse range')) {
      console.log('💡 Hãy đảm bảo sheet "nguoi_dung" đã được tạo trong Google Sheets');
    }
  }
}

// Chạy script
updateUsersSheet();