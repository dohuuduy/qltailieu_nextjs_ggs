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

async function setupSubDocumentsSheet() {
  try {
    console.log('🚀 Bắt đầu tạo sheet tài liệu con...');

    // Tạo sheet mới cho tài liệu con
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: 'tai_lieu_con',
                gridProperties: {
                  rowCount: 1000,
                  columnCount: 13
                }
              }
            }
          }
        ]
      }
    });

    console.log('✅ Đã tạo sheet "tai_lieu_con"');

    // Thêm header cho sheet tài liệu con
    const headers = [
      'id',
      'tai_lieu_cha_id', 
      'ten_tai_lieu_con',
      'mo_ta',
      'loai_tai_lieu',
      'trang_thai',
      'thu_tu',
      'nguoi_tao',
      'ngay_tao',
      'nguoi_cap_nhat',
      'ngay_cap_nhat',
      'url_file',
      'ghi_chu'
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'tai_lieu_con!A1:M1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [headers]
      }
    });

    console.log('✅ Đã thêm headers cho sheet tài liệu con');

    // Thêm dữ liệu mẫu
    const sampleData = [
      [
        '1_sub',
        '1', // ID tài liệu cha
        'Biểu mẫu kiểm tra chất lượng sản phẩm',
        'Form kiểm tra chất lượng theo quy trình chuẩn',
        'bieu_mau',
        'hieu_luc',
        '1',
        'Nguyễn Văn A',
        '2024-01-15',
        'Nguyễn Văn A',
        '2024-01-15',
        'https://drive.google.com/file/d/1abc123/view',
        'Sử dụng cho tất cả sản phẩm'
      ],
      [
        '2_sub',
        '1', // ID tài liệu cha
        'Hướng dẫn sử dụng thiết bị đo',
        'Hướng dẫn chi tiết cách sử dụng các thiết bị đo lường',
        'huong_dan',
        'hieu_luc',
        '2',
        'Nguyễn Văn A',
        '2024-01-16',
        'Nguyễn Văn A',
        '2024-01-16',
        '',
        'Cập nhật theo thiết bị mới'
      ],
      [
        '3_sub',
        '1', // ID tài liệu cha
        'Checklist kiểm tra cuối ca',
        'Danh sách kiểm tra các hạng mục cuối ca làm việc',
        'checklist',
        'hieu_luc',
        '3',
        'Trần Thị B',
        '2024-01-17',
        'Trần Thị B',
        '2024-01-17',
        'https://drive.google.com/file/d/1def456/view',
        'Thực hiện hàng ngày'
      ]
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'tai_lieu_con!A2:M4',
      valueInputOption: 'RAW',
      requestBody: {
        values: sampleData
      }
    });

    console.log('✅ Đã thêm dữ liệu mẫu cho tài liệu con');

    // Format header row
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: await getSheetId('tai_lieu_con'),
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: 13
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: {
                    red: 0.2,
                    green: 0.6,
                    blue: 1.0
                  },
                  textFormat: {
                    foregroundColor: {
                      red: 1.0,
                      green: 1.0,
                      blue: 1.0
                    },
                    bold: true
                  }
                }
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat)'
            }
          }
        ]
      }
    });

    console.log('✅ Đã format header row');
    console.log('🎉 Hoàn thành setup sheet tài liệu con!');

  } catch (error) {
    console.error('❌ Lỗi khi setup sheet:', error);
    
    if (error.message?.includes('already exists')) {
      console.log('ℹ️  Sheet "tai_lieu_con" đã tồn tại, bỏ qua việc tạo mới');
    } else {
      throw error;
    }
  }
}

async function getSheetId(sheetName) {
  const response = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID
  });
  
  const sheet = response.data.sheets?.find(s => s.properties?.title === sheetName);
  return sheet?.properties?.sheetId || 0;
}

// Chạy script
setupSubDocumentsSheet()
  .then(() => {
    console.log('✅ Script hoàn thành thành công!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script thất bại:', error);
    process.exit(1);
  });