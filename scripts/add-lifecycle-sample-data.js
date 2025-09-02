const { google } = require('googleapis');

// Script để thêm dữ liệu mẫu với thông tin lifecycle
async function addLifecycleSampleData() {
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

    console.log('📊 Đang thêm dữ liệu mẫu lifecycle...');

    // Dữ liệu mẫu với thông tin lifecycle
    const sampleData = [
      [
        'DOC_001', // id
        'Quy trình Quản lý Tài liệu ISO 9001:2015', // ten_tai_lieu
        'Quy trình chi tiết về quản lý tài liệu theo tiêu chuẩn ISO 9001:2015', // mo_ta
        'quy_trinh', // loai_tai_lieu
        'hieu_luc', // trang_thai
        'Nguyễn Văn A', // nguoi_tao
        '2024-01-15', // ngay_tao
        'Nguyễn Văn A', // nguoi_cap_nhat
        '2024-01-15', // ngay_cap_nhat
        '1.0', // phien_ban_hien_tai
        'ISO 9001:2015,Nội bộ', // tieu_chuan_ap_dung
        'https://drive.google.com/file/d/sample1', // url_file
        // Lifecycle dates
        '2024-01-10', // ngay_ban_hanh
        '2024-01-15', // ngay_bat_dau_hieu_luc
        '2025-01-15', // ngay_ket_thuc_hieu_luc
        '1_nam', // chu_ky_soat_xet
        '2024-01-15', // ngay_soat_xet_gan_nhat
        '2025-01-15', // ngay_soat_xet_tiep_theo
        // Approval workflow
        'Nguyễn Văn A', // nguoi_soan_thao
        'Trần Thị B', // nguoi_phe_duyet
        '2024-01-12', // ngay_phe_duyet
        'da_phe_duyet', // trang_thai_phe_duyet
        'QA', // phong_ban_chu_quan
        'IT,HR', // phong_ban_lien_quan
        'B', // cap_do_tai_lieu
        // Additional fields
        '', // ly_do_thay_doi
        'Phê duyệt lần đầu' // ghi_chu_phe_duyet
      ],
      [
        'DOC_002',
        'Hướng dẫn Bảo mật Thông tin',
        'Hướng dẫn chi tiết về các biện pháp bảo mật thông tin trong tổ chức',
        'huong_dan',
        'cho_phe_duyet',
        'Lê Văn C',
        '2024-02-01',
        'Lê Văn C',
        '2024-02-05',
        '2.1',
        'ISO 27001:2013,Nội bộ',
        'https://drive.google.com/file/d/sample2',
        // Lifecycle dates
        '2024-02-01',
        '2024-02-10',
        '2025-02-10',
        '6_thang',
        '2024-02-01',
        '2024-08-01',
        // Approval workflow
        'Lê Văn C',
        'Nguyễn Văn A',
        '',
        'cho_phe_duyet',
        'IT',
        'QA,HR,FIN',
        'A',
        // Additional fields
        'Cập nhật theo quy định mới',
        ''
      ],
      [
        'DOC_003',
        'Biểu mẫu Đánh giá Rủi ro',
        'Biểu mẫu chuẩn để đánh giá và quản lý rủi ro trong dự án',
        'bieu_mau',
        'het_hieu_luc',
        'Phạm Thị D',
        '2023-06-15',
        'Phạm Thị D',
        '2023-12-20',
        '1.5',
        'ISO 31000:2018',
        'https://drive.google.com/file/d/sample3',
        // Lifecycle dates
        '2023-06-10',
        '2023-06-15',
        '2024-01-31',
        '2_nam',
        '2023-06-15',
        '2025-06-15',
        // Approval workflow
        'Phạm Thị D',
        'Trần Thị B',
        '2023-06-12',
        'da_phe_duyet',
        'OPS',
        'IT,QA',
        'C',
        // Additional fields
        '',
        'Phê duyệt với điều kiện cập nhật định kỳ'
      ],
      [
        'DOC_004',
        'Quy định An toàn Lao động',
        'Quy định chi tiết về an toàn lao động và sức khỏe nghề nghiệp',
        'quy_dinh',
        'chua_hieu_luc',
        'Hoàng Văn E',
        '2024-03-01',
        'Hoàng Văn E',
        '2024-03-05',
        '3.0',
        'ISO 45001:2018,Luật Lao động',
        'https://drive.google.com/file/d/sample4',
        // Lifecycle dates
        '2024-03-01',
        '2024-04-01',
        '2026-04-01',
        '1_nam',
        '2024-03-01',
        '2025-03-01',
        // Approval workflow
        'Hoàng Văn E',
        'Nguyễn Văn A',
        '2024-03-03',
        'da_phe_duyet',
        'HR',
        'IT,QA,OPS,FIN',
        'A',
        // Additional fields
        'Cập nhật theo luật mới',
        'Phê duyệt với yêu cầu đào tạo toàn bộ nhân viên'
      ],
      [
        'DOC_005',
        'Tài liệu Kỹ thuật API Documentation',
        'Tài liệu kỹ thuật chi tiết về các API của hệ thống',
        'tai_lieu_ky_thuat',
        'soan_thao',
        'Vũ Thị F',
        '2024-03-10',
        'Vũ Thị F',
        '2024-03-15',
        '1.0',
        'Nội bộ',
        'https://drive.google.com/file/d/sample5',
        // Lifecycle dates
        '2024-03-10',
        '2024-04-01',
        '',
        'khong_dinh_ky',
        '2024-03-10',
        '',
        // Approval workflow
        'Vũ Thị F',
        'Lê Văn C',
        '',
        'chua_gui',
        'IT',
        'QA',
        'C',
        // Additional fields
        '',
        ''
      ]
    ];

    // Thêm dữ liệu vào sheet TAI_LIEU
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'tai_lieu!A2:Z', // Bắt đầu từ hàng 2 (sau header)
      valueInputOption: 'RAW',
      requestBody: {
        values: sampleData,
      },
    });

    console.log('✅ Đã thêm dữ liệu mẫu lifecycle thành công!');
    console.log(`📊 Đã thêm ${sampleData.length} tài liệu mẫu`);
    console.log('🔗 Kiểm tra tại:', `https://docs.google.com/spreadsheets/d/${spreadsheetId}`);

    // Thêm một số phiên bản mẫu
    const versionData = [
      [
        'VER_001',
        'DOC_001',
        '1.1',
        'Cập nhật quy trình theo phản hồi từ audit',
        'Sửa đổi nhỏ theo yêu cầu',
        'Nguyễn Văn A',
        '2024-02-15',
        'hieu_luc'
      ],
      [
        'VER_002',
        'DOC_002',
        '2.0',
        'Thêm chương về bảo mật cloud',
        'Mở rộng phạm vi áp dụng',
        'Lê Văn C',
        '2024-02-05',
        'cho_phe_duyet'
      ]
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'phien_ban!A2:H',
      valueInputOption: 'RAW',
      requestBody: {
        values: versionData,
      },
    });

    console.log('✅ Đã thêm dữ liệu phiên bản mẫu!');

  } catch (error) {
    console.error('❌ Lỗi khi thêm dữ liệu mẫu:', error.message);
    process.exit(1);
  }
}

// Chạy script
if (require.main === module) {
  // Load environment variables
  require('dotenv').config({ path: '.env.local' });
  addLifecycleSampleData();
}

module.exports = { addLifecycleSampleData };