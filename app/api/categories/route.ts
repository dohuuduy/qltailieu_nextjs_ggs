import { NextRequest, NextResponse } from 'next/server'
import { readSheet, writeSheet, SHEET_NAMES } from '@/lib/google-sheets'

// GET - Lấy tất cả danh mục
export async function GET() {
  try {
    // Lấy dữ liệu từ các sheet
    const [tieuChuanData, loaiTaiLieuData, trangThaiData] = await Promise.all([
      readSheet(SHEET_NAMES.TIEU_CHUAN),
      readSheet('loai_tai_lieu'),
      readSheet('trang_thai')
    ])

    // Xử lý dữ liệu tiêu chuẩn
    const tieuChuan = tieuChuanData.length > 1 
      ? tieuChuanData.slice(1).map(row => ({
          id: row[0],
          ten_tieu_chuan: row[1],
          ma_tieu_chuan: row[2],
          mo_ta: row[3],
          phien_ban: row[4],
          ngay_ban_hanh: row[5],
          trang_thai: row[6]
        }))
      : []

    // Xử lý dữ liệu loại tài liệu
    const loaiTaiLieu = loaiTaiLieuData.length > 1
      ? loaiTaiLieuData.slice(1).map(row => ({
          id: row[0],
          ma_loai: row[1],
          ten_loai: row[2],
          mo_ta: row[3],
          mau_sac: row[4],
          thu_tu: row[5]
        }))
      : [
          { id: '1', ma_loai: 'quy_trinh', ten_loai: 'Quy Trình', mo_ta: 'Tài liệu quy trình làm việc', mau_sac: 'blue', thu_tu: '1' },
          { id: '2', ma_loai: 'huong_dan', ten_loai: 'Hướng Dẫn', mo_ta: 'Tài liệu hướng dẫn sử dụng', mau_sac: 'green', thu_tu: '2' },
          { id: '3', ma_loai: 'tai_lieu_ky_thuat', ten_loai: 'Tài Liệu Kỹ Thuật', mo_ta: 'Tài liệu kỹ thuật chuyên môn', mau_sac: 'purple', thu_tu: '3' },
          { id: '4', ma_loai: 'bieu_mau', ten_loai: 'Biểu Mẫu', mo_ta: 'Các biểu mẫu, form', mau_sac: 'orange', thu_tu: '4' }
        ]

    // Xử lý dữ liệu trạng thái
    const trangThai = trangThaiData.length > 1
      ? trangThaiData.slice(1).map(row => ({
          id: row[0],
          ma_trang_thai: row[1],
          ten_trang_thai: row[2],
          mo_ta: row[3],
          mau_sac: row[4],
          thu_tu: row[5]
        }))
      : [
          { id: '1', ma_trang_thai: 'hieu_luc', ten_trang_thai: 'Hiệu Lực', mo_ta: 'Tài liệu đang có hiệu lực', mau_sac: 'green', thu_tu: '1' },
          { id: '2', ma_trang_thai: 'het_hieu_luc', ten_trang_thai: 'Hết Hiệu Lực', mo_ta: 'Tài liệu đã hết hiệu lực', mau_sac: 'red', thu_tu: '2' },
          { id: '3', ma_trang_thai: 'ban_nhap', ten_trang_thai: 'Bản Nháp', mo_ta: 'Tài liệu đang soạn thảo', mau_sac: 'yellow', thu_tu: '3' },
          { id: '4', ma_trang_thai: 'cho_duyet', ten_trang_thai: 'Chờ Duyệt', mo_ta: 'Tài liệu chờ phê duyệt', mau_sac: 'blue', thu_tu: '4' }
        ]

    return NextResponse.json({
      tieu_chuan: tieuChuan,
      loai_tai_lieu: loaiTaiLieu,
      trang_thai: trangThai
    })
  } catch (error) {
    console.error('Lỗi khi lấy danh mục:', error)
    return NextResponse.json(
      { error: 'Không thể lấy dữ liệu danh mục' },
      { status: 500 }
    )
  }
}

// POST - Tạo danh mục mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    const id = Date.now().toString()
    const currentDate = new Date().toISOString().split('T')[0]

    let newRow: string[] = []
    let sheetName = ''

    switch (type) {
      case 'tieu_chuan':
        sheetName = SHEET_NAMES.TIEU_CHUAN
        newRow = [
          id,
          data.ten_tieu_chuan,
          data.ma_tieu_chuan,
          data.mo_ta,
          data.phien_ban,
          data.ngay_ban_hanh || currentDate,
          'hieu_luc'
        ]
        break
      case 'loai_tai_lieu':
        sheetName = 'loai_tai_lieu'
        newRow = [
          id,
          data.ma_loai,
          data.ten_loai,
          data.mo_ta,
          data.mau_sac || 'gray',
          data.thu_tu || '999'
        ]
        break
      case 'trang_thai':
        sheetName = 'trang_thai'
        newRow = [
          id,
          data.ma_trang_thai,
          data.ten_trang_thai,
          data.mo_ta,
          data.mau_sac || 'gray',
          data.thu_tu || '999'
        ]
        break
      default:
        return NextResponse.json(
          { error: 'Loại danh mục không hợp lệ' },
          { status: 400 }
        )
    }

    await writeSheet(sheetName, [newRow])

    return NextResponse.json({ 
      success: true, 
      message: 'Tạo danh mục thành công',
      id 
    })
  } catch (error) {
    console.error('Lỗi khi tạo danh mục:', error)
    return NextResponse.json(
      { error: 'Không thể tạo danh mục' },
      { status: 500 }
    )
  }
}