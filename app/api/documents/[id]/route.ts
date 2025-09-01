import { NextRequest, NextResponse } from 'next/server'
import { readSheet, updateSheet, writeSheet, SHEET_NAMES } from '@/lib/google-sheets'

// Helper function để cập nhật trạng thái các phiên bản liên quan
async function updateRelatedVersionsStatus(documentId: string, newStatus: string, currentDate: string) {
  try {
    // Đọc dữ liệu phiên bản
    const versionData = await readSheet(SHEET_NAMES.PHIEN_BAN)
    
    if (versionData.length === 0) return

    const headers = versionData[0]
    const rows = versionData.slice(1)
    
    // Tìm tất cả phiên bản của tài liệu này
    const relatedVersions = rows
      .map((row, index) => ({ row, index }))
      .filter(({ row }) => row[1] === documentId) // tai_lieu_id ở cột index 1
    
    // Cập nhật từng phiên bản
    for (const { row, index } of relatedVersions) {
      const updatedVersionRow = [
        ...row.slice(0, 7), // giữ nguyên id, tai_lieu_id, so_phien_ban, noi_dung, ghi_chu, nguoi_tao, ngay_tao
        newStatus // cập nhật trạng thái
      ]
      
      const rowNumber = index + 2 // +2 vì header và index bắt đầu từ 1
      await updateSheet(SHEET_NAMES.PHIEN_BAN, `A${rowNumber}:Z${rowNumber}`, [updatedVersionRow])
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái phiên bản:', error)
    // Không throw error để không làm gián đoạn quá trình xóa tài liệu chính
  }
}

// PUT - Cập nhật tài liệu
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const documentId = params.id

    // Đọc dữ liệu hiện tại
    const data = await readSheet(SHEET_NAMES.TAI_LIEU)
    
    if (data.length === 0) {
      return NextResponse.json(
        { error: 'Không tìm thấy dữ liệu tài liệu' },
        { status: 404 }
      )
    }

    const headers = data[0]
    const rows = data.slice(1)
    
    // Tìm row cần cập nhật
    const rowIndex = rows.findIndex(row => row[0] === documentId)
    
    if (rowIndex === -1) {
      return NextResponse.json(
        { error: 'Không tìm thấy tài liệu' },
        { status: 404 }
      )
    }

    const currentDate = new Date().toISOString().split('T')[0]
    const currentRow = rows[rowIndex]
    
    // Cập nhật dữ liệu (giữ nguyên ID, ngày tạo, người tạo)
    const updatedRow = [
      currentRow[0], // id
      body.ten_tai_lieu || currentRow[1],
      body.mo_ta || currentRow[2], 
      body.loai_tai_lieu || currentRow[3],
      currentRow[4], // trang_thai - giữ nguyên
      currentRow[5], // nguoi_tao - giữ nguyên
      currentRow[6], // ngay_tao - giữ nguyên
      body.nguoi_cap_nhat || 'Hệ thống', // nguoi_cap_nhat
      currentDate, // ngay_cap_nhat
      currentRow[9], // phien_ban_hien_tai - giữ nguyên
      body.tieu_chuan_ap_dung || currentRow[10],
      body.url_file || currentRow[11] || '' // url_file
    ]

    // Cập nhật trong Google Sheets
    const rowNumber = rowIndex + 2 // +2 vì header và index bắt đầu từ 1
    await updateSheet(SHEET_NAMES.TAI_LIEU, `A${rowNumber}:Z${rowNumber}`, [updatedRow])

    // Ghi lịch sử thay đổi
    const historyRow = [
      Date.now().toString() + '_h',
      documentId,
      '', // version_id - để trống vì đây là cập nhật tài liệu, không phải tạo version
      'cap_nhat',
      `Cập nhật tài liệu: ${body.ten_tai_lieu}`,
      body.nguoi_cap_nhat || 'Hệ thống',
      currentDate
    ]

    await writeSheet(SHEET_NAMES.LICH_SU, [historyRow])

    return NextResponse.json({ 
      success: true, 
      message: 'Cập nhật tài liệu thành công' 
    })
  } catch (error) {
    console.error('Lỗi khi cập nhật tài liệu:', error)
    return NextResponse.json(
      { error: 'Không thể cập nhật tài liệu' },
      { status: 500 }
    )
  }
}

// DELETE - Xóa tài liệu (tùy chọn)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id

    // Đọc dữ liệu hiện tại
    const data = await readSheet(SHEET_NAMES.TAI_LIEU)
    
    if (data.length === 0) {
      return NextResponse.json(
        { error: 'Không tìm thấy dữ liệu tài liệu' },
        { status: 404 }
      )
    }

    const headers = data[0]
    const rows = data.slice(1)
    
    // Tìm row cần xóa
    const rowIndex = rows.findIndex(row => row[0] === documentId)
    
    if (rowIndex === -1) {
      return NextResponse.json(
        { error: 'Không tìm thấy tài liệu' },
        { status: 404 }
      )
    }

    // Thay vì xóa hoàn toàn, chúng ta sẽ đánh dấu trạng thái là "da_xoa"
    const currentRow = rows[rowIndex]
    const currentDate = new Date().toISOString().split('T')[0]
    
    const updatedRow = [
      ...currentRow.slice(0, 4), // giữ nguyên id, tên, mô tả, loại
      'da_xoa', // cập nhật trạng thái
      ...currentRow.slice(5, 7), // giữ nguyên người tạo, ngày tạo
      'Hệ thống', // người cập nhật
      currentDate, // ngày cập nhật
      ...currentRow.slice(9) // giữ nguyên phần còn lại
    ]

    const rowNumber = rowIndex + 2
    await updateSheet(SHEET_NAMES.TAI_LIEU, `A${rowNumber}:Z${rowNumber}`, [updatedRow])

    // Cập nhật trạng thái các phiên bản liên quan
    await updateRelatedVersionsStatus(documentId, 'da_xoa', currentDate)

    // Ghi lịch sử
    const historyRow = [
      Date.now().toString() + '_h',
      documentId,
      '',
      'xoa',
      `Xóa tài liệu: ${currentRow[1]}`,
      'Hệ thống',
      currentDate
    ]

    await writeSheet(SHEET_NAMES.LICH_SU, [historyRow])

    return NextResponse.json({ 
      success: true, 
      message: 'Xóa tài liệu thành công' 
    })
  } catch (error) {
    console.error('Lỗi khi xóa tài liệu:', error)
    return NextResponse.json(
      { error: 'Không thể xóa tài liệu' },
      { status: 500 }
    )
  }
}