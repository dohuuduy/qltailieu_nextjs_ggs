// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { google } = require('googleapis');

// Cấu hình Google Sheets API
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

async function readSheet(sheetName) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:Z`,
    });
    return response.data.values || [];
  } catch (error) {
    console.error('Lỗi đọc dữ liệu:', error);
    throw error;
  }
}

async function testConnection() {
  try {
    console.log('🧪 Testing Google Sheets connection...\n');
    
    // Test users
    console.log('1. Testing nguoi_dung sheet');
    const usersData = await readSheet('nguoi_dung');
    console.log(`✅ Found ${usersData.length} rows (including header)`);
    if (usersData.length > 1) {
      console.log('Headers:', usersData[0]);
      console.log('First user row:', usersData[1]);
    }
    console.log('');
    
    // Test departments
    console.log('2. Testing phong_ban sheet');
    const deptsData = await readSheet('phong_ban');
    console.log(`✅ Found ${deptsData.length} rows (including header)`);
    if (deptsData.length > 1) {
      console.log('Headers:', deptsData[0]);
      console.log('First dept row:', deptsData[1]);
    }
    console.log('');
    
    // Test authentication logic
    console.log('3. Testing authentication logic');
    if (usersData.length > 1) {
      const dataRows = usersData.slice(1);
      const users = dataRows.map((row) => {
        const [
          id, ho_ten, email, ten_dang_nhap, mat_khau, chuc_vu, phong_ban, 
          quyen_phe_duyet, trang_thai, ngay_tao, ngay_cap_nhat
        ] = row;
        
        return {
          id: id || '',
          ho_ten: ho_ten || '',
          email: email || '',
          ten_dang_nhap: ten_dang_nhap || '',
          mat_khau: mat_khau || '',
          chuc_vu: chuc_vu || '',
          phong_ban: phong_ban || '',
          quyen_phe_duyet: quyen_phe_duyet || '',
          trang_thai: trang_thai || '',
          ngay_tao: ngay_tao || '',
          ngay_cap_nhat: ngay_cap_nhat || ''
        };
      }).filter(user => user.id);
      
      console.log(`Processed ${users.length} users`);
      
      // Try to find test user
      const testUser = users.find(u => 
        (u.ten_dang_nhap === 'nguyenvana' || u.email === 'nguyenvana') && 
        u.mat_khau === 'password123' &&
        u.trang_thai === 'active'
      );
      
      if (testUser) {
        console.log('✅ Found test user:', testUser.ho_ten);
      } else {
        console.log('❌ Test user not found');
        console.log('Available users:');
        users.slice(0, 3).forEach(u => {
          console.log(`  - ${u.ten_dang_nhap} / ${u.mat_khau} (${u.trang_thai})`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testConnection();