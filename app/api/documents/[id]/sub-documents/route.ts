import { NextResponse } from 'next/server'
import { readSheet, writeSheet, updateSheet, SHEET_NAMES } from '@/lib/google-sheets'

// GET - Lấy danh sách tài liệu con của một tài liệu
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id
    
    const data = await readSheet(SHEET_NAMES.TAI_LIEU_CON)
    
    if (data.length === 0) {
      return NextResponse.json([])
    }

    // Chuyển đổi dữ liệu từ array sang object
    const headers = data[0]
    const subDocuments = data.slice(1)
      .map(row => {
        const doc: any = {}
        headers.forEach((header: string, index: number) => {
          doc[header] = row[index] || ''
        })
        return doc
      })
      .filter(doc => doc.tai_lieu_cha_id === documentId && doc.trang_thai !== 'da_xoa')
      .sort((a, b) => parseInt(a.thu_tu) - parseInt(b.thu_tu)) // Sắp xếp theo thứ tự

    return NextResponse.json(subDocuments)
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tài liệu con:', error)
    return NextResponse.json(
      { error: 'Không thể lấy danh sách tài liệu con' },
      { status: 500 }
    )
  }
}

// POST - Tạo tài liệu con mới
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id
    const body = await request.json()
    
    // Validate dữ liệu đầu vào
    if (!body.ten_tai_lieu_con) {
      return NextResponse.json(
        { error: 'Thiếu tên tài liệu con' },
        { status: 400 }
      )
    }

    // Kiểm tra tài liệu cha có tồn tại không
    const parentDocData = await readSheet(SHEET_NAMES.TAI_LIEU)
    const parentExists = parentDocData.slice(1).some(row => row[0] === documentId)
    
    if (!parentExists) {
      return NextResponse.json(
        { error: 'Tài liệu cha không tồn tại' },
        { status: 404 }
      )
    }

    const currentDate = new Date().toISOString().split('T')[0]
    const id = Date.now().toString() + '_sub'

    // Lấy thứ tự tiếp theo
    const existingSubDocs = await readSheet(SHEET_NAMES.TAI_LIEU_CON)
    const maxOrder = existingSubDocs.slice(1)
      .filter(row => row[1] === documentId) // tai_lieu_cha_id
      .reduce((max, row) => Math.max(max, parseInt(row[6]) || 0), 0) // thu_tu column

    const newRow = [
      id,
      documentId, // tai_lieu_cha_id
      body.ten_tai_lieu_con,
      body.mo_ta || '',
      body.loai_tai_lieu || 'tai_lieu_con',
      'hieu_luc', // trạng thái mặc định
      (maxOrder + 1).toString(), // thu_tu
      body.nguoi_tao || 'Hệ thống',
      currentDate,
      body.nguoi_tao || 'Hệ thống',
      currentDate,
      body.url_file || '',
      body.ghi_chu || ''
    ]

    await writeSheet(SHEET_NAMES.TAI_LIEU_CON, [newRow])

    // Ghi lịch sử
    const historyRow = [
      Date.now().toString() + '_h',
      documentId,
      '',
      'tao_tai_lieu_con',
      `Tạo tài liệu con: ${body.ten_tai_lieu_con}`,
      body.nguoi_tao || 'Hệ thống',
      currentDate
    ]

    await writeSheet(SHEET_NAMES.LICH_SU, [historyRow])

    return NextResponse.json({ 
      success: true, 
      message: 'Tạo tài liệu con thành công',
      id 
    })
  } catch (error) {
    console.error('Lỗi khi tạo tài liệu con:', error)
    return NextResponse.json(
      { error: 'Không thể tạo tài liệu con' },
      { status: 500 }
    )
  }
}

// PUT - Cập nhật thứ tự tài liệu con
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id
    const body = await request.json()
    
    if (!body.subDocuments || !Array.isArray(body.subDocuments)) {
      return NextResponse.json(
        { error: 'Dữ liệu thứ tự không hợp lệ' },
        { status: 400 }
      )
    }

    const data = await readSheet(SHEET_NAMES.TAI_LIEU_CON)
    
    if (data.length === 0) {
      return NextResponse.json(
        { error: 'Không tìm thấy dữ liệu tài liệu con' },
        { status: 404 }
      )
    }

    const headers = data[0]
    const rows = data.slice(1)
    
    // Cập nhật thứ tự cho từng tài liệu con
    for (const subDoc of body.subDocuments) {
      const rowIndex = rows.findIndex(row => row[0] === subDoc.id)
      
      if (rowIndex !== -1) {
        rows[rowIndex][6] = subDoc.thu_tu.toString() // cột thu_tu
        
        const rowNumber = rowIndex + 2
        await updateSheet(SHEET_NAMES.TAI_LIEU_CON, `A${rowNumber}:Z${rowNumber}`, [rows[rowIndex]])
      }
    }

    // Ghi lịch sử
    const currentDate = new Date().toISOString().split('T')[0]
    const historyRow = [
      Date.now().toString() + '_h',
      documentId,
      '',
      'sap_xep_tai_lieu_con',
      'Cập nhật thứ tự tài liệu con',
      'Hệ thống',
      currentDate
    ]

    await writeSheet(SHEET_NAMES.LICH_SU, [historyRow])

    return NextResponse.json({ 
      success: true, 
      message: 'Cập nhật thứ tự thành công' 
    })
  } catch (error) {
    console.error('Lỗi khi cập nhật thứ tự tài liệu con:', error)
    return NextResponse.json(
      { error: 'Không thể cập nhật thứ tự' },
      { status: 500 }
    )
  }
}