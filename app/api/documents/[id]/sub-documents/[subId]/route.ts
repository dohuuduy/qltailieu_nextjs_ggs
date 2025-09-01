import { NextResponse } from 'next/server'
import { readSheet, updateSheet, SHEET_NAMES } from '@/lib/google-sheets'

// PUT - Cập nhật tài liệu con
export async function PUT(
  request: Request,
  { params }: { params: { id: string; subId: string } }
) {
  try {
    const { id: documentId, subId } = params
    const body = await request.json()
    
    const data = await readSheet(SHEET_NAMES.TAI_LIEU_CON)
    
    if (data.length === 0) {
      return NextResponse.json(
        { error: 'Không tìm thấy dữ liệu tài liệu con' },
        { status: 404 }
      )
    }

    const headers = data[0]
    const rows = data.slice(1)
    
    // Tìm row cần cập nhật
    const rowIndex = rows.findIndex(row => row[0] === subId)
    
    if (rowIndex === -1) {
      return NextResponse.json(
        { error: 'Không tìm thấy tài liệu con' },
        { status: 404 }
      )
    }

    const currentDate = new Date().toISOString().split('T')[0]
    const currentRow = rows[rowIndex]
    
    // Cập nhật dữ liệu (giữ nguyên ID, tài liệu cha, thứ tự, ngày tạo, người tạo)
    const updatedRow = [
      currentRow[0], // id
      currentRow[1], // tai_lieu_cha_id
      body.ten_tai_lieu_con || currentRow[2],
      body.mo_ta || currentRow[3],
      body.loai_tai_lieu || currentRow[4],
      currentRow[5], // trang_thai - giữ nguyên
      currentRow[6], // thu_tu - giữ nguyên
      currentRow[7], // nguoi_tao - giữ nguyên
      currentRow[8], // ngay_tao - giữ nguyên
      body.nguoi_cap_nhat || 'Hệ thống', // nguoi_cap_nhat
      currentDate, // ngay_cap_nhat
      body.url_file || currentRow[11] || '',
      body.ghi_chu || currentRow[12] || ''
    ]

    // Cập nhật trong Google Sheets
    const rowNumber = rowIndex + 2
    await updateSheet(SHEET_NAMES.TAI_LIEU_CON, `A${rowNumber}:Z${rowNumber}`, [updatedRow])

    // Ghi lịch sử thay đổi
    const historyRow = [
      Date.now().toString() + '_h',
      documentId,
      '',
      'cap_nhat_tai_lieu_con',
      `Cập nhật tài liệu con: ${body.ten_tai_lieu_con || currentRow[2]}`,
      body.nguoi_cap_nhat || 'Hệ thống',
      currentDate
    ]

    const { writeSheet } = await import('@/lib/google-sheets')
    await writeSheet(SHEET_NAMES.LICH_SU, [historyRow])

    return NextResponse.json({ 
      success: true, 
      message: 'Cập nhật tài liệu con thành công' 
    })
  } catch (error) {
    console.error('Lỗi khi cập nhật tài liệu con:', error)
    return NextResponse.json(
      { error: 'Không thể cập nhật tài liệu con' },
      { status: 500 }
    )
  }
}

// DELETE - Xóa tài liệu con (soft delete)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; subId: string } }
) {
  try {
    const { id: documentId, subId } = params
    
    const data = await readSheet(SHEET_NAMES.TAI_LIEU_CON)
    
    if (data.length === 0) {
      return NextResponse.json(
        { error: 'Không tìm thấy dữ liệu tài liệu con' },
        { status: 404 }
      )
    }

    const headers = data[0]
    const rows = data.slice(1)
    
    // Tìm row cần xóa
    const rowIndex = rows.findIndex(row => row[0] === subId)
    
    if (rowIndex === -1) {
      return NextResponse.json(
        { error: 'Không tìm thấy tài liệu con' },
        { status: 404 }
      )
    }

    const currentDate = new Date().toISOString().split('T')[0]
    const currentRow = rows[rowIndex]
    
    // Soft delete - đặt trạng thái thành 'da_xoa'
    const updatedRow = [
      ...currentRow.slice(0, 5), // giữ nguyên id, tai_lieu_cha_id, ten, mo_ta, loai
      'da_xoa', // trạng thái
      ...currentRow.slice(6, 9), // giữ nguyên thu_tu, nguoi_tao, ngay_tao
      'Hệ thống', // nguoi_cap_nhat
      currentDate, // ngay_cap_nhat
      ...currentRow.slice(11) // giữ nguyên url_file, ghi_chu
    ]

    const rowNumber = rowIndex + 2
    await updateSheet(SHEET_NAMES.TAI_LIEU_CON, `A${rowNumber}:Z${rowNumber}`, [updatedRow])

    // Ghi lịch sử xóa
    const historyRow = [
      Date.now().toString() + '_h',
      documentId,
      '',
      'xoa_tai_lieu_con',
      `Xóa tài liệu con: ${currentRow[2]}`,
      'Hệ thống',
      currentDate
    ]

    const { writeSheet } = await import('@/lib/google-sheets')
    await writeSheet(SHEET_NAMES.LICH_SU, [historyRow])

    return NextResponse.json({ 
      success: true, 
      message: 'Xóa tài liệu con thành công' 
    })
  } catch (error) {
    console.error('Lỗi khi xóa tài liệu con:', error)
    return NextResponse.json(
      { error: 'Không thể xóa tài liệu con' },
      { status: 500 }
    )
  }
}