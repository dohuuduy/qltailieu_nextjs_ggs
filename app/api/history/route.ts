import { NextRequest, NextResponse } from 'next/server'
import { readSheet, writeSheet, SHEET_NAMES } from '@/lib/google-sheets'

// GET - Lấy lịch sử thay đổi
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const taiLieuId = searchParams.get('tai_lieu_id')

    const data = await readSheet(SHEET_NAMES.LICH_SU)
    
    if (data.length === 0) {
      return NextResponse.json([])
    }

    const headers = data[0]
    let history = data.slice(1).map(row => {
      const record: any = {}
      headers.forEach((header: string, index: number) => {
        record[header] = row[index] || ''
      })
      return record
    })

    // Lọc theo tài liệu nếu có
    if (taiLieuId) {
      history = history.filter((h: any) => h.tai_lieu_id === taiLieuId)
    }

    // Sắp xếp theo ngày mới nhất
    history.sort((a: any, b: any) => new Date(b.ngay_thuc_hien).getTime() - new Date(a.ngay_thuc_hien).getTime())

    return NextResponse.json(history)
  } catch (error) {
    console.error('Lỗi khi lấy lịch sử:', error)
    return NextResponse.json(
      { error: 'Không thể lấy lịch sử' },
      { status: 500 }
    )
  }
}

// POST - Ghi lịch sử mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const id = Date.now().toString()
    const currentDate = new Date().toISOString().split('T')[0]
    
    const historyRow = [
      id,
      body.tai_lieu_id,
      body.phien_ban_id || '',
      body.hanh_dong,
      body.mo_ta,
      body.nguoi_thuc_hien || 'Hệ thống',
      currentDate
    ]

    await writeSheet(SHEET_NAMES.LICH_SU, [historyRow])

    return NextResponse.json({ 
      success: true, 
      message: 'Ghi lịch sử thành công',
      id 
    })
  } catch (error) {
    console.error('Lỗi khi ghi lịch sử:', error)
    return NextResponse.json(
      { error: 'Không thể ghi lịch sử' },
      { status: 500 }
    )
  }
}