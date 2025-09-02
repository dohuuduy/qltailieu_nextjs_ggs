const { google } = require('googleapis');

// Script để thêm dữ liệu mẫu người dùng và phòng ban
async function addUsersSampleData() {
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

    console.log('👥 Đang thêm dữ liệu mẫu người dùng và phòng ban...');

    // Dữ liệu mẫu phòng ban
    const departmentData = [
      [
        'DEPT_001', // id
        'Phòng Công nghệ thông tin', // ten_phong_ban
        'IT', // ma_phong_ban
        'Nguyễn Văn A', // truong_phong
        'Lê Văn C,Phạm Thị D', // pho_phong
        'Phòng chuyên trách về công nghệ thông tin và hệ thống', // mo_ta
        'hoat_dong' // trang_thai
      ],
      [
        'DEPT_002',
        'Phòng Đảm bảo chất lượng',
        'QA',
        'Trần Thị B',
        'Hoàng Văn E',
        'Phòng đảm bảo chất lượng sản phẩm và dịch vụ',
        'hoat_dong'
      ],
      [
        'DEPT_003',
        'Phòng Nhân sự',
        'HR',
        'Vũ Thị F',
        'Đỗ Văn G',
        'Phòng quản lý nhân sự và tổ chức',
        'hoat_dong'
      ],
      [
        'DEPT_004',
        'Phòng Tài chính',
        'FIN',
        'Bùi Văn H',
        '',
        'Phòng quản lý tài chính và kế toán',
        'hoat_dong'
      ],
      [
        'DEPT_005',
        'Phòng Vận hành',
        'OPS',
        'Cao Thị I',
        'Lý Văn J',
        'Phòng vận hành và sản xuất',
        'hoat_dong'
      ]
    ];

    // Dữ liệu mẫu người dùng
    const userData = [
      [
        'USER_001', // id
        'Nguyễn Văn A', // ho_ten
        'nguyen.van.a@company.com', // email
        'admin123', // mat_khau
        'giam_doc', // chuc_vu
        'IT', // phong_ban
        'A,B,C', // quyen_phe_duyet
        'hoat_dong', // trang_thai
        '2024-01-01', // ngay_tao
        '2024-01-01' // ngay_cap_nhat
      ],
      [
        'USER_002',
        'Trần Thị B',
        'tran.thi.b@company.com',
        'admin123',
        'truong_phong',
        'QA',
        'B,C',
        'hoat_dong',
        '2024-01-01',
        '2024-01-01'
      ],
      [
        'USER_003',
        'Lê Văn C',
        'le.van.c@company.com',
        'admin123',
        'pho_phong',
        'IT',
        'C',
        'hoat_dong',
        '2024-01-01',
        '2024-01-01'
      ],
      [
        'USER_004',
        'Phạm Thị D',
        'pham.thi.d@company.com',
        'admin123',
        'pho_phong',
        'IT',
        'C',
        'hoat_dong',
        '2024-01-01',
        '2024-01-01'
      ],
      [
        'USER_005',
        'Hoàng Văn E',
        'hoang.van.e@company.com',
        'admin123',
        'pho_phong',
        'QA',
        'C',
        'hoat_dong',
        '2024-01-01',
        '2024-01-01'
      ],
      [
        'USER_006',
        'Vũ Thị F',
        'vu.thi.f@company.com',
        'admin123',
        'truong_phong',
        'HR',
        'B,C',
        'hoat_dong',
        '2024-01-01',
        '2024-01-01'
      ],
      [
        'USER_007',
        'Đỗ Văn G',
        'do.van.g@company.com',
        'admin123',
        'pho_phong',
        'HR',
        'C',
        'hoat_dong',
        '2024-01-01',
        '2024-01-01'
      ],
      [
        'USER_008',
        'Bùi Văn H',
        'bui.van.h@company.com',
        'admin123',
        'truong_phong',
        'FIN',
        'B,C',
        'hoat_dong',
        '2024-01-01',
        '2024-01-01'
      ]
    ];

    // Thêm dữ liệu phòng ban
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'phong_ban!A2:G',
      valueInputOption: 'RAW',
      requestBody: {
        values: departmentData,
      },
    });

    console.log('✅ Đã thêm dữ liệu phòng ban thành công!');
    console.log(`📊 Đã thêm ${departmentData.length} phòng ban mẫu`);

    // Thêm dữ liệu người dùng
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'nguoi_dung!A2:J',
      valueInputOption: 'RAW',
      requestBody: {
        values: userData,
      },
    });

    console.log('✅ Đã thêm dữ liệu người dùng thành công!');
    console.log(`👥 Đã thêm ${userData.length} người dùng mẫu`);
    console.log('🔗 Kiểm tra tại:', `https://docs.google.com/spreadsheets/d/${spreadsheetId}`);

    console.log('\n📋 Thông tin đăng nhập mẫu:');
    console.log('Email: nguyen.van.a@company.com | Mật khẩu: admin123 | Quyền: A,B,C (Giám đốc)');
    console.log('Email: tran.thi.b@company.com | Mật khẩu: admin123 | Quyền: B,C (Trưởng phòng QA)');
    console.log('Email: le.van.c@company.com | Mật khẩu: admin123 | Quyền: C (Phó phòng IT)');

  } catch (error) {
    console.error('❌ Lỗi khi thêm dữ liệu mẫu:', error.message);
    process.exit(1);
  }
}

// Chạy script
if (require.main === module) {
  // Load environment variables
  require('dotenv').config({ path: '.env.local' });
  addUsersSampleData();
}

module.exports = { addUsersSampleData };