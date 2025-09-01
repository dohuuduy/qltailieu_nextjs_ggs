import { NextRequest, NextResponse } from 'next/server'
import { readSheet, writeSheet, SHEET_NAMES, COLUMNS } from '@/lib/google-sheets'

// GET - Lấy danh sách tài liệu
export async function GET() {
  try {
    const data = await readSheet(SHEET_NAMES.TAI_LIEU)
    
    if (data.length === 0) {
      return NextResponse.json([])
    }

    // Chuyển đổi dữ liệu từ array sang object
    const headers = data[0]
    const documents = data.slice(1)
      .map(row => {
        const doc: any = {}
        headers.forEach((header: string, index: number) => {
          doc[header] = row[index] || ''
        })
        return doc
      })
      .filter(doc => doc.trang_thai !== 'da_xoa') // Lọc bỏ tài liệu đã xóa

    return NextResponse.json(documents)
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu tài liệu:', error)
    return NextResponse.json(
      { error: 'Không thể lấy dữ liệu tài liệu' },
      { status: 500 }
    )
  }
}

// POST - Tạo tài liệu mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Tạo ID mới
    const id = Date.now().toString()
    const currentDate = new Date().toISOString().split('T')[0]
    
    // Chuẩn bị dữ liệu theo thứ tự cột
    const newRow = [
      id,
      body.ten_tai_lieu,
      body.mo_ta,
      body.loai_tai_lieu,
      'hieu_luc', // trạng thái mặc định
      body.nguoi_tao || 'Hệ thống',
      currentDate,
      body.nguoi_tao || 'Hệ thống',
      currentDate,
      '1.0', // phiên bản đầu tiên
      body.tieu_chuan_ap_dung,
      body.url_file || '' // URL file
    ]

    await writeSheet(SHEET_NAMES.TAI_LIEU, [newRow])

    // Tạo phiên bản đầu tiên
    const versionRow = [
      Date.now().toString() + '_v1',
      id,
      '1.0',
      'Phiên bản đầu tiên',
      'Tài liệu được tạo mới',
      body.nguoi_tao || 'Hệ thống',
      currentDate,
      'hieu_luc'
    ]

    await writeSheet(SHEET_NAMES.PHIEN_BAN, [versionRow])

    // Ghi lịch sử
    const historyRow = [
      Date.now().toString() + '_h1',
      id,
      Date.now().toString() + '_v1',
      'tao_moi',
      'Tạo tài liệu mới',
      body.nguoi_tao || 'Hệ thống',
      currentDate
    ]

    await writeSheet(SHEET_NAMES.LICH_SU, [historyRow])

    return NextResponse.json({ 
      success: true, 
      message: 'Tạo tài liệu thành công',
      id 
    })
  } catch (error) {
    console.error('Lỗi khi tạo tài liệu:', error)
    return NextResponse.json(
      { error: 'Không thể tạo tài liệu' },
      { status: 500 }
    )
  }
}