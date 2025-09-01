import { NextResponse } from 'next/server'
import { readSheet, SHEET_NAMES } from '@/lib/google-sheets'

// GET - Lấy thống kê tài liệu
export async function GET() {
  try {
    const data = await readSheet(SHEET_NAMES.TAI_LIEU)
    
    if (data.length === 0) {
      return NextResponse.json({
        total: 0,
        active: 0,
        deleted: 0
      })
    }

    const headers = data[0]
    const documents = data.slice(1).map(row => {
      const doc: any = {}
      headers.forEach((header: string, index: number) => {
        doc[header] = row[index] || ''
      })
      return doc
    })

    const stats = {
      total: documents.length,
      active: documents.filter(doc => doc.trang_thai === 'hieu_luc').length,
      deleted: documents.filter(doc => doc.trang_thai === 'da_xoa').length,
      inactive: documents.filter(doc => doc.trang_thai === 'het_hieu_luc').length
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Lỗi khi lấy thống kê tài liệu:', error)
    return NextResponse.json(
      { error: 'Không thể lấy thống kê tài liệu' },
      { status: 500 }
    )
  }
}