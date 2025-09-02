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

// Updated columns with lifecycle fields
const LIFECYCLE_COLUMNS = [
  'id', 'ten_tai_lieu', 'mo_ta', 'loai_tai_lieu', 'trang_thai',
  'nguoi_tao', 'ngay_tao', 'nguoi_cap_nhat', 'ngay_cap_nhat',
  'phien_ban_hien_tai', 'tieu_chuan_ap_dung', 'url_file',
  // Lifecycle fields
  'ngay_ban_hanh', 'ngay_bat_dau_hieu_luc', 'ngay_ket_thuc_hieu_luc',
  'chu_ky_soat_xet', 'ngay_soat_xet_gan_nhat', 'ngay_soat_xet_tiep_theo',
  'nguoi_soan_thao', 'nguoi_phe_duyet', 'ngay_phe_duyet', 'trang_thai_phe_duyet',
  'phong_ban_chu_quan', 'phong_ban_lien_quan', 'cap_do_tai_lieu',
  'ly_do_thay_doi', 'ghi_chu_phe_duyet'
];

async function updateLifecycleColumns() {
  try {
    console.log('🔄 Updating tai_lieu sheet with lifecycle columns...');
    
    // Read existing data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'tai_lieu!A:Z',
    });
    
    const existingData = response.data.values || [];
    console.log(`📊 Found ${existingData.length} rows in tai_lieu sheet`);
    
    if (existingData.length === 0) {
      // Create new sheet with lifecycle columns
      console.log('📝 Creating new tai_lieu sheet with lifecycle columns...');
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: 'tai_lieu!A1:AA1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [LIFECYCLE_COLUMNS],
        },
      });
      console.log('✅ Created new tai_lieu sheet with lifecycle columns');
      return;
    }
    
    const existingHeaders = existingData[0] || [];
    const existingRows = existingData.slice(1);
    
    console.log(`📋 Existing columns: ${existingHeaders.length}`);
    console.log(`📋 New columns: ${LIFECYCLE_COLUMNS.length}`);
    
    // Map existing data to new structure
    const updatedRows = existingRows.map(row => {
      const newRow = new Array(LIFECYCLE_COLUMNS.length).fill('');
      
      // Copy existing data
      existingHeaders.forEach((header, index) => {
        const newIndex = LIFECYCLE_COLUMNS.indexOf(header);
        if (newIndex !== -1 && row[index] !== undefined) {
          newRow[newIndex] = row[index];
        }
      });
      
      // Set default values for new lifecycle fields
      const defaultValues = {
        'ngay_ban_hanh': new Date().toISOString().split('T')[0],
        'ngay_bat_dau_hieu_luc': new Date().toISOString().split('T')[0],
        'chu_ky_soat_xet': '1_nam',
        'ngay_soat_xet_gan_nhat': new Date().toISOString().split('T')[0],
        'trang_thai_phe_duyet': 'chua_gui',
        'cap_do_tai_lieu': 'C',
        'nguoi_soan_thao': newRow[LIFECYCLE_COLUMNS.indexOf('nguoi_tao')] || 'System',
        'nguoi_phe_duyet': 'Admin',
        'phong_ban_chu_quan': 'IT'
      };
      
      // Apply default values for empty lifecycle fields
      Object.entries(defaultValues).forEach(([field, value]) => {
        const index = LIFECYCLE_COLUMNS.indexOf(field);
        if (index !== -1 && !newRow[index]) {
          newRow[index] = value;
        }
      });
      
      // Calculate next review date
      const chuKyIndex = LIFECYCLE_COLUMNS.indexOf('chu_ky_soat_xet');
      const soatXetGanNhatIndex = LIFECYCLE_COLUMNS.indexOf('ngay_soat_xet_gan_nhat');
      const soatXetTiepTheoIndex = LIFECYCLE_COLUMNS.indexOf('ngay_soat_xet_tiep_theo');
      
      if (newRow[chuKyIndex] && newRow[soatXetGanNhatIndex] && !newRow[soatXetTiepTheoIndex]) {
        const lastReview = new Date(newRow[soatXetGanNhatIndex]);
        const cycle = newRow[chuKyIndex];
        
        switch (cycle) {
          case '6_thang':
            lastReview.setMonth(lastReview.getMonth() + 6);
            break;
          case '1_nam':
            lastReview.setFullYear(lastReview.getFullYear() + 1);
            break;
          case '2_nam':
            lastReview.setFullYear(lastReview.getFullYear() + 2);
            break;
          case '3_nam':
            lastReview.setFullYear(lastReview.getFullYear() + 3);
            break;
        }
        
        if (cycle !== 'khong_dinh_ky') {
          newRow[soatXetTiepTheoIndex] = lastReview.toISOString().split('T')[0];
        }
      }
      
      return newRow;
    });
    
    // Clear existing data and write new structure
    console.log('🧹 Clearing existing data...');
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: 'tai_lieu!A:Z',
    });
    
    console.log('📝 Writing updated data with lifecycle columns...');
    const allData = [LIFECYCLE_COLUMNS, ...updatedRows];
    
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `tai_lieu!A1:AA${allData.length}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: allData,
      },
    });
    
    console.log(`✅ Successfully updated tai_lieu sheet!`);
    console.log(`📊 Updated ${updatedRows.length} documents with lifecycle fields`);
    console.log(`📋 Total columns: ${LIFECYCLE_COLUMNS.length}`);
    
    // Log sample of new structure
    if (updatedRows.length > 0) {
      console.log('\n📋 Sample updated row:');
      LIFECYCLE_COLUMNS.forEach((col, index) => {
        if (updatedRows[0][index]) {
          console.log(`  ${col}: ${updatedRows[0][index]}`);
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Error updating lifecycle columns:', error);
    throw error;
  }
}

async function addSampleLifecycleData() {
  try {
    console.log('\n🔄 Adding sample lifecycle documents...');
    
    const sampleDocuments = [
      {
        id: `DOC_${Date.now()}_001`,
        ten_tai_lieu: 'Quy trình phê duyệt tài liệu',
        mo_ta: 'Quy trình chi tiết về việc phê duyệt và quản lý vòng đời tài liệu',
        loai_tai_lieu: 'quy_trinh',
        trang_thai: 'hieu_luc',
        nguoi_tao: 'Admin',
        ngay_tao: new Date().toISOString().split('T')[0],
        nguoi_cap_nhat: 'Admin',
        ngay_cap_nhat: new Date().toISOString().split('T')[0],
        phien_ban_hien_tai: '1.0',
        tieu_chuan_ap_dung: 'ISO 9001:2015',
        url_file: 'https://drive.google.com/file/d/sample1',
        // Lifecycle fields
        ngay_ban_hanh: '2024-01-15',
        ngay_bat_dau_hieu_luc: '2024-02-01',
        ngay_ket_thuc_hieu_luc: '2025-02-01',
        chu_ky_soat_xet: '1_nam',
        ngay_soat_xet_gan_nhat: '2024-01-15',
        ngay_soat_xet_tiep_theo: '2025-01-15',
        nguoi_soan_thao: 'Nguyễn Văn A',
        nguoi_phe_duyet: 'Trần Thị B',
        ngay_phe_duyet: '2024-01-20',
        trang_thai_phe_duyet: 'da_phe_duyet',
        phong_ban_chu_quan: 'IT',
        phong_ban_lien_quan: 'QA,HR',
        cap_do_tai_lieu: 'B',
        ly_do_thay_doi: 'Tài liệu mới',
        ghi_chu_phe_duyet: 'Đã phê duyệt theo quy trình'
      },
      {
        id: `DOC_${Date.now()}_002`,
        ten_tai_lieu: 'Hướng dẫn sử dụng hệ thống',
        mo_ta: 'Hướng dẫn chi tiết cách sử dụng hệ thống quản lý tài liệu',
        loai_tai_lieu: 'huong_dan',
        trang_thai: 'cho_phe_duyet',
        nguoi_tao: 'User1',
        ngay_tao: new Date().toISOString().split('T')[0],
        nguoi_cap_nhat: 'User1',
        ngay_cap_nhat: new Date().toISOString().split('T')[0],
        phien_ban_hien_tai: '1.0',
        tieu_chuan_ap_dung: 'Nội bộ',
        url_file: 'https://drive.google.com/file/d/sample2',
        // Lifecycle fields
        ngay_ban_hanh: new Date().toISOString().split('T')[0],
        ngay_bat_dau_hieu_luc: new Date().toISOString().split('T')[0],
        ngay_ket_thuc_hieu_luc: '',
        chu_ky_soat_xet: '6_thang',
        ngay_soat_xet_gan_nhat: new Date().toISOString().split('T')[0],
        ngay_soat_xet_tiep_theo: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        nguoi_soan_thao: 'Lê Văn C',
        nguoi_phe_duyet: 'Nguyễn Văn A',
        ngay_phe_duyet: '',
        trang_thai_phe_duyet: 'cho_phe_duyet',
        phong_ban_chu_quan: 'IT',
        phong_ban_lien_quan: '',
        cap_do_tai_lieu: 'C',
        ly_do_thay_doi: 'Tài liệu hướng dẫn mới',
        ghi_chu_phe_duyet: ''
      }
    ];
    
    const rows = sampleDocuments.map(doc => 
      LIFECYCLE_COLUMNS.map(col => doc[col] || '')
    );
    
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'tai_lieu!A:AA',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: rows,
      },
    });
    
    console.log(`✅ Added ${sampleDocuments.length} sample lifecycle documents`);
    
  } catch (error) {
    console.error('❌ Error adding sample data:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 Starting lifecycle columns update...\n');
    
    await updateLifecycleColumns();
    await addSampleLifecycleData();
    
    console.log('\n🎉 Lifecycle columns update completed successfully!');
    console.log('\n📋 New lifecycle fields added:');
    const lifecycleFields = LIFECYCLE_COLUMNS.slice(12); // Skip basic fields
    lifecycleFields.forEach(field => console.log(`  - ${field}`));
    
    console.log('\n🔗 You can now test the approval and review features at:');
    console.log('  - /test-approval (Test page)');
    console.log('  - API endpoints: /api/documents/lifecycle');
    
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}