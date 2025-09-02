import { google } from 'googleapis';

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

// Định nghĩa cấu trúc bảng
export const SHEET_NAMES = {
  TAI_LIEU: 'tai_lieu',
  TAI_LIEU_CON: 'tai_lieu_con',
  PHIEN_BAN: 'phien_ban',
  LICH_SU: 'lich_su',
  FILE_DINH_KEM: 'file_dinh_kem',
  TIEU_CHUAN: 'tieu_chuan',
  NGUOI_DUNG: 'nguoi_dung',
  PHONG_BAN: 'phong_ban'
};

// Cấu trúc cột cho từng bảng
export const COLUMNS = {
  TAI_LIEU: [
    'id', 'ten_tai_lieu', 'mo_ta', 'loai_tai_lieu', 'trang_thai',
    'nguoi_tao', 'ngay_tao', 'nguoi_cap_nhat', 'ngay_cap_nhat',
    'phien_ban_hien_tai', 'tieu_chuan_ap_dung', 'url_file'
  ],
  TAI_LIEU_CON: [
    'id', 'tai_lieu_cha_id', 'ten_tai_lieu_con', 'mo_ta', 'loai_tai_lieu',
    'trang_thai', 'thu_tu', 'nguoi_tao', 'ngay_tao', 'nguoi_cap_nhat', 
    'ngay_cap_nhat', 'url_file', 'ghi_chu'
  ],
  PHIEN_BAN: [
    'id', 'tai_lieu_id', 'so_phien_ban', 'noi_dung', 'ghi_chu',
    'nguoi_tao', 'ngay_tao', 'trang_thai'
  ],
  LICH_SU: [
    'id', 'tai_lieu_id', 'phien_ban_id', 'hanh_dong', 'mo_ta',
    'nguoi_thuc_hien', 'ngay_thuc_hien'
  ],
  FILE_DINH_KEM: [
    'id', 'tai_lieu_id', 'phien_ban_id', 'ten_file', 'duong_dan',
    'kich_thuoc', 'loai_file', 'ngay_tai_len'
  ],
  TIEU_CHUAN: [
    'id', 'ten_tieu_chuan', 'ma_tieu_chuan', 'mo_ta', 'phien_ban',
    'ngay_ban_hanh', 'trang_thai'
  ],
  NGUOI_DUNG: [
    'id', 'ho_ten', 'email', 'ten_dang_nhap', 'mat_khau', 'chuc_vu', 'phong_ban', 
    'quyen_phe_duyet', 'trang_thai', 'ngay_tao', 'ngay_cap_nhat'
  ],
  PHONG_BAN: [
    'id', 'ten_phong_ban', 'ma_phong_ban', 'truong_phong', 
    'pho_phong', 'mo_ta', 'trang_thai'
  ]
};

export interface TaiLieu {
  id: string;
  ten_tai_lieu: string;
  mo_ta: string;
  loai_tai_lieu: string;
  trang_thai: string;
  nguoi_tao: string;
  ngay_tao: string;
  nguoi_cap_nhat: string;
  ngay_cap_nhat: string;
  phien_ban_hien_tai: string;
  tieu_chuan_ap_dung: string;
  url_file?: string;
}

export interface PhienBan {
  id: string;
  tai_lieu_id: string;
  so_phien_ban: string;
  noi_dung: string;
  ghi_chu: string;
  nguoi_tao: string;
  ngay_tao: string;
  trang_thai: string;
}

export interface LichSu {
  id: string;
  tai_lieu_id: string;
  phien_ban_id: string;
  hanh_dong: string;
  mo_ta: string;
  nguoi_thuc_hien: string;
  ngay_thuc_hien: string;
}

// Hàm đọc dữ liệu từ Google Sheets
export async function readSheet(sheetName: string, range?: string) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: range || `${sheetName}!A:Z`,
    });
    return response.data.values || [];
  } catch (error) {
    console.error('Lỗi đọc dữ liệu:', error);
    throw error;
  }
}

// Hàm ghi dữ liệu vào Google Sheets
export async function writeSheet(sheetName: string, values: any[][]) {
  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:Z`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi ghi dữ liệu:', error);
    throw error;
  }
}

// Hàm cập nhật dữ liệu
export async function updateSheet(sheetName: string, range: string, values: any[][]) {
  try {
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!${range}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi cập nhật dữ liệu:', error);
    throw error;
  }
}

// Interfaces cho User và Department
export interface NguoiDung {
  id: string;
  ho_ten: string;
  email: string;
  ten_dang_nhap: string;
  mat_khau: string;
  chuc_vu: string;
  phong_ban: string;
  quyen_phe_duyet: string; // Comma-separated: A,B,C
  trang_thai: string;
  ngay_tao: string;
  ngay_cap_nhat: string;
}

export interface PhongBan {
  id: string;
  ten_phong_ban: string;
  ma_phong_ban: string;
  truong_phong: string;
  pho_phong: string; // Comma-separated
  mo_ta?: string;
  trang_thai: string;
}

// Utility functions để convert array to object
function arrayToObject(headers: string[], row: string[]): any {
  const obj: any = {};
  headers.forEach((header, index) => {
    obj[header] = row[index] || '';
  });
  return obj;
}

// Functions để làm việc với Users
export async function getUsers(): Promise<NguoiDung[]> {
  try {
    const data = await readSheet(SHEET_NAMES.NGUOI_DUNG);
    if (data.length === 0) return [];
    
    const headers = data[0];
    const rows = data.slice(1);
    
    return rows.map(row => arrayToObject(headers, row) as NguoiDung);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách người dùng:', error);
    return [];
  }
}

export async function getUserById(id: string): Promise<NguoiDung | null> {
  try {
    const users = await getUsers();
    return users.find(user => user.id === id) || null;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error);
    return null;
  }
}

export async function getUsersByDepartment(departmentId: string): Promise<NguoiDung[]> {
  try {
    const users = await getUsers();
    return users.filter(user => user.phong_ban === departmentId);
  } catch (error) {
    console.error('Lỗi khi lấy người dùng theo phòng ban:', error);
    return [];
  }
}

// Functions để làm việc với Departments
export async function getDepartments(): Promise<PhongBan[]> {
  try {
    const data = await readSheet(SHEET_NAMES.PHONG_BAN);
    if (data.length === 0) return [];
    
    const headers = data[0];
    const rows = data.slice(1);
    
    return rows.map(row => arrayToObject(headers, row) as PhongBan);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách phòng ban:', error);
    return [];
  }
}

export async function getDepartmentById(id: string): Promise<PhongBan | null> {
  try {
    const departments = await getDepartments();
    return departments.find(dept => dept.id === id) || null;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin phòng ban:', error);
    return null;
  }
}

// Functions để làm việc với Documents (cập nhật để hỗ trợ lifecycle)
export async function getDocuments(): Promise<TaiLieu[]> {
  try {
    const data = await readSheet(SHEET_NAMES.TAI_LIEU);
    if (data.length === 0) return [];
    
    const headers = data[0];
    const rows = data.slice(1);
    
    return rows.map(row => {
      const obj = arrayToObject(headers, row);
      // Convert comma-separated strings to arrays
      if (obj.tieu_chuan_ap_dung && typeof obj.tieu_chuan_ap_dung === 'string') {
        obj.tieu_chuan_ap_dung = obj.tieu_chuan_ap_dung.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
      if (obj.phong_ban_lien_quan && typeof obj.phong_ban_lien_quan === 'string') {
        obj.phong_ban_lien_quan = obj.phong_ban_lien_quan.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
      return obj as TaiLieu;
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tài liệu:', error);
    return [];
  }
}

export async function getDocumentById(id: string): Promise<TaiLieu | null> {
  try {
    const documents = await getDocuments();
    return documents.find(doc => doc.id === id) || null;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin tài liệu:', error);
    return null;
  }
}

export async function addDocument(document: Partial<TaiLieu>): Promise<void> {
  try {
    const headers = COLUMNS.TAI_LIEU;
    const row = headers.map(header => {
      const value = (document as any)[header];
      // Convert arrays to comma-separated strings
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      return value || '';
    });
    
    await writeSheet(SHEET_NAMES.TAI_LIEU, [row]);
  } catch (error) {
    console.error('Lỗi khi thêm tài liệu:', error);
    throw error;
  }
}

export async function updateDocument(id: string, document: Partial<TaiLieu>): Promise<void> {
  try {
    const documents = await getDocuments();
    const index = documents.findIndex(doc => doc.id === id);
    
    if (index === -1) {
      throw new Error('Không tìm thấy tài liệu');
    }
    
    const headers = COLUMNS.TAI_LIEU;
    const updatedDoc = { ...documents[index], ...document };
    const row = headers.map(header => {
      const value = (updatedDoc as any)[header];
      // Convert arrays to comma-separated strings
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      return value || '';
    });
    
    // Update row (index + 2 because of header row and 1-based indexing)
    const rowNumber = index + 2;
    const range = `A${rowNumber}:${String.fromCharCode(65 + headers.length - 1)}${rowNumber}`;
    
    await updateSheet(SHEET_NAMES.TAI_LIEU, range, [row]);
  } catch (error) {
    console.error('Lỗi khi cập nhật tài liệu:', error);
    throw error;
  }
}

// Export class for backward compatibility
export class GoogleSheetsService {
  async getDocuments() {
    return getDocuments();
  }
  
  async getDocument(id: string) {
    return getDocumentById(id);
  }
  
  async addDocument(document: Partial<TaiLieu>) {
    return addDocument(document);
  }
  
  async updateDocument(id: string, document: Partial<TaiLieu>) {
    return updateDocument(id, document);
  }
  
  async getUsers() {
    return getUsers();
  }
  
  async getDepartments() {
    return getDepartments();
  }
}

// Function để authenticate user
export async function authenticateUser(username: string, password: string): Promise<NguoiDung | null> {
  try {
    console.log('Authenticating user:', username);
    const users = await getUsers();
    console.log('Total users found:', users.length);
    
    if (users.length === 0) {
      console.log('No users found in sheet');
      return null;
    }

    const user = users.find(u => {
      const matchUsername = u.ten_dang_nhap === username || u.email === username;
      const matchPassword = u.mat_khau === password;
      const isActive = u.trang_thai === 'active';
      
      console.log(`Checking user ${u.ho_ten}: username match=${matchUsername}, password match=${matchPassword}, active=${isActive}`);
      
      return matchUsername && matchPassword && isActive;
    });
    
    console.log('Authentication result:', user ? 'SUCCESS' : 'FAILED');
    return user || null;
  } catch (error) {
    console.error('Lỗi khi xác thực người dùng:', error);
    return null;
  }
}