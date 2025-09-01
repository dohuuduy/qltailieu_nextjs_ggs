import { NextRequest, NextResponse } from 'next/server'
import { readSheet, writeSheet, updateSheet, SHEET_NAMES } from '@/lib/google-sheets'

// GET - Lấy danh sách phiên bản theo tài liệu
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const taiLieuId = searchParams.get('tai_lieu_id')

    const data = await readSheet(SHEET_NAMES.PHIEN_BAN)
    
    if (data.length === 0) {
      return NextResponse.json([])
    }

    const headers = data[0]
    let versions = data.slice(1)
      .map(row => {
        const version: any = {}
        headers.forEach((header: string, index: number) => {
          version[header] = row[index] || ''
        })
        return version
      })
      .filter((v: any) => v.trang_thai !== 'da_xoa') // Lọc bỏ phiên bản đã xóa

    // Lọc theo tài liệu nếu có
    if (taiLieuId) {
      versions = versions.filter((v: any) => v.tai_lieu_id === taiLieuId)
    }

    return NextResponse.json(versions)
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu phiên bản:', error)
    return NextResponse.json(
      { error: 'Không thể lấy dữ liệu phiên bản' },
      { status: 500 }
    )
  }
}

// POST - Tạo phiên bản mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const id = Date.now().toString()
    const currentDate = new Date().toISOString().split('T')[0]
    
    // Chuẩn bị dữ liệu phiên bản mới
    const newVersionRow = [
      id,
      body.tai_lieu_id,
      body.so_phien_ban,
      body.noi_dung,
      body.ghi_chu,
      body.nguoi_tao || 'Hệ thống',
      currentDate,
      'hieu_luc'
    ]

    await writeSheet(SHEET_NAMES.PHIEN_BAN, [newVersionRow])

    // Cập nhật phiên bản hiện tại trong bảng tài liệu
    // Đây là một cách đơn giản, trong thực tế cần tìm và cập nhật dòng cụ thể
    
    // Ghi lịch sử
    const historyRow = [
      Date.now().toString() + '_h',
      body.tai_lieu_id,
      id,
      'cap_nhat_phien_ban',
      `Tạo phiên bản ${body.so_phien_ban}: ${body.noi_dung}`,
      body.nguoi_tao || 'Hệ thống',
      currentDate
    ]

    await writeSheet(SHEET_NAMES.LICH_SU, [historyRow])

    return NextResponse.json({ 
      success: true, 
      message: 'Tạo phiên bản thành công',
      id 
    })
  } catch (error) {
    console.error('Lỗi khi tạo phiên bản:', error)
    return NextResponse.json(
      { error: 'Không thể tạo phiên bản' },
      { status: 500 }
    )
  }
}