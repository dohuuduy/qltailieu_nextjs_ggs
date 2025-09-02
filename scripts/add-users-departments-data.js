const { google } = require('googleapis');

// Script để thêm dữ liệu mẫu cho người dùng và phòng ban
async function addUsersAndDepartmentsData() {
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

    console.log('📊 Đang thêm dữ liệu mẫu cho người dùng và phòng ban...');

    // Dữ liệu mẫu cho phòng ban
    const departmentsData = [
      ['DEPT_001', 'Phòng Hành chính', 'HC', 'Nguyễn Văn A', 'Trần Thị B', 'Quản lý hành chính tổng hợp', 'active'],
      ['DEPT_002', 'Phòng Kỹ thuật', 'KT', 'Lê Văn C', 'Phạm Thị D,Hoàng Văn E', 'Phòng kỹ thuật và công nghệ', 'active'],
      ['DEPT_003', 'Phòng Tài chính', 'TC', 'Vũ Thị F', 'Đặng Văn G', 'Quản lý tài chính và kế toán', 'active'],
      ['DEPT_004', 'Phòng Nhân sự', 'NS', 'Bùi Văn H', 'Ngô Thị I', 'Quản lý nhân sự và đào tạo', 'active'],
      ['DEPT_005', 'Phòng Kinh doanh', 'KD', 'Trương Văn J', 'Lý Thị K,Phan Văn L', 'Phòng kinh doanh và marketing', 'active']
    ];

    // Dữ liệu mẫu cho người dùng
    const usersData = [
      ['USER_001', 'Nguyễn Văn A', 'nguyenvana@company.com', 'nguyenvana', 'password123', 'Trưởng phòng', 'DEPT_001', 'A,B,C', 'active', '2024-01-01', '2024-01-01'],
      ['USER_002', 'Trần Thị B', 'tranthib@company.com', 'tranthib', 'password123', 'Phó phòng', 'DEPT_001', 'B,C', 'active', '2024-01-01', '2024-01-01'],
      ['USER_003', 'Lê Văn C', 'levanc@company.com', 'levanc', 'password123', 'Trưởng phòng', 'DEPT_002', 'A,B,C', 'active', '2024-01-01', '2024-01-01'],
      ['USER_004', 'Phạm Thị D', 'phamthid@company.com', 'phamthid', 'password123', 'Phó phòng', 'DEPT_002', 'B,C', 'active', '2024-01-01', '2024-01-01'],
      ['USER_005', 'Hoàng Văn E', 'hoangvane@company.com', 'hoangvane', 'password123', 'Phó phòng', 'DEPT_002', 'B,C', 'active', '2024-01-01', '2024-01-01'],
      ['USER_006', 'Vũ Thị F', 'vuthif@company.com', 'vuthif', 'password123', 'Trưởng phòng', 'DEPT_003', 'A,B,C', 'active', '2024-01-01', '2024-01-01'],
      ['USER_007', 'Đặng Văn G', 'dangvang@company.com', 'dangvang', 'password123', 'Phó phòng', 'DEPT_003', 'B,C', 'active', '2024-01-01', '2024-01-01'],
      ['USER_008', 'Bùi Văn H', 'buivanh@company.com', 'buivanh', 'password123', 'Trưởng phòng', 'DEPT_004', 'A,B,C', 'active', '2024-01-01', '2024-01-01'],
      ['USER_009', 'Ngô Thị I', 'ngothii@company.com', 'ngothii', 'password123', 'Phó phòng', 'DEPT_004', 'B,C', 'active', '2024-01-01', '2024-01-01'],
      ['USER_010', 'Trương Văn J', 'truongvanj@company.com', 'truongvanj', 'password123', 'Trưởng phòng', 'DEPT_005', 'A,B,C', 'active', '2024-01-01', '2024-01-01'],
      ['USER_011', 'Lý Thị K', 'lythik@company.com', 'lythik', 'password123', 'Phó phòng', 'DEPT_005', 'B,C', 'active', '2024-01-01', '2024-01-01'],
      ['USER_012', 'Phan Văn L', 'phanvanl@company.com', 'phanvanl', 'password123', 'Phó phòng', 'DEPT_005', 'B,C', 'active', '2024-01-01', '2024-01-01'],
      ['USER_013', 'Cao Thị M', 'caothim@company.com', 'caothim', 'password123', 'Nhân viên', 'DEPT_001', 'C', 'active', '2024-01-01', '2024-01-01'],
      ['USER_014', 'Đinh Văn N', 'dinhvann@company.com', 'dinhvann', 'password123', 'Nhân viên', 'DEPT_002', 'C', 'active', '2024-01-01', '2024-01-01'],
      ['USER_015', 'Hồ Thị O', 'hothio@company.com', 'hothio', 'password123', 'Nhân viên', 'DEPT_003', 'C', 'active', '2024-01-01', '2024-01-01']
    ];

    // Kiểm tra và thêm dữ liệu vào sheet phong_ban
    console.log('📝 Thêm dữ liệu phòng ban...');
    
    // Kiểm tra dữ liệu hiện có
    const existingDepts = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'phong_ban!A:A',
    });

    const existingDeptIds = existingDepts.data.values ? 
      existingDepts.data.values.slice(1).map(row => row[0]).filter(Boolean) : [];

    // Chỉ thêm phòng ban chưa tồn tại
    const newDepartments = departmentsData.filter(dept => !existingDeptIds.includes(dept[0]));
    
    if (newDepartments.length > 0) {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'phong_ban!A:G',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: newDepartments,
        },
      });
      console.log(`✅ Đã thêm ${newDepartments.length} phòng ban mới`);
    } else {
      console.log('✅ Tất cả phòng ban đã tồn tại');
    }

    // Kiểm tra và thêm dữ liệu vào sheet nguoi_dung
    console.log('📝 Thêm dữ liệu người dùng...');
    
    const existingUsers = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'nguoi_dung!A:A',
    });

    const existingUserIds = existingUsers.data.values ? 
      existingUsers.data.values.slice(1).map(row => row[0]).filter(Boolean) : [];

    // Chỉ thêm người dùng chưa tồn tại
    const newUsers = usersData.filter(user => !existingUserIds.includes(user[0]));
    
    if (newUsers.length > 0) {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'nguoi_dung!A:K',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: newUsers,
        },
      });
      console.log(`✅ Đã thêm ${newUsers.length} người dùng mới`);
    } else {
      console.log('✅ Tất cả người dùng đã tồn tại');
    }

    console.log('\n🎉 Hoàn thành thêm dữ liệu mẫu!');
    console.log(`🔗 Kiểm tra tại: https://docs.google.com/spreadsheets/d/${spreadsheetId}`);
    
    // Hiển thị thống kê
    console.log('\n📊 Thống kê dữ liệu:');
    console.log(`- Phòng ban: ${departmentsData.length} phòng ban`);
    console.log(`- Người dùng: ${usersData.length} người dùng`);
    console.log('- Quyền phê duyệt: A (Toàn quyền), B (Phê duyệt), C (Xem)');

  } catch (error) {
    console.error('❌ Lỗi khi thêm dữ liệu:', error.message);
    if (error.code === 403) {
      console.log('💡 Gợi ý: Kiểm tra quyền truy cập của service account với spreadsheet');
    }
    process.exit(1);
  }
}

// Chạy script
if (require.main === module) {
  addUsersAndDepartmentsData();
}

module.exports = { addUsersAndDepartmentsData };