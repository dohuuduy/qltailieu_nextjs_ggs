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
  PHIEN_BAN: 'phien_ban',
  LICH_SU: 'lich_su',
  FILE_DINH_KEM: 'file_dinh_kem',
  TIEU_CHUAN: 'tieu_chuan'
};

// Cấu trúc cột cho từng bảng
export const COLUMNS = {
  TAI_LIEU: [
    'id', 'ten_tai_lieu', 'mo_ta', 'loai_tai_lieu', 'trang_thai',
    'nguoi_tao', 'ngay_tao', 'nguoi_cap_nhat', 'ngay_cap_nhat',
    'phien_ban_hien_tai', 'tieu_chuan_ap_dung', 'url_file'
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