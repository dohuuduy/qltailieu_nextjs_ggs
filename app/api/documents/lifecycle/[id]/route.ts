import { NextRequest, NextResponse } from 'next/server'
import { readSheet, updateSheet, SHEET_NAMES } from '@/lib/google-sheets'
import { DocumentLifecycle } from '@/lib/types/document-lifecycle'

// GET /api/documents/lifecycle/[id] - Get specific document lifecycle
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentsData = await readSheet(SHEET_NAMES.TAI_LIEU)
    const documentRow = documentsData.find((row: any[]) => row[0] === params.id)
    
    if (!documentRow) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      )
    }
    
    const [
      id, ten_tai_lieu, mo_ta, loai_tai_lieu, trang_thai,
      nguoi_tao, ngay_tao, nguoi_cap_nhat, ngay_cap_nhat,
      phien_ban_hien_tai, tieu_chuan_ap_dung, url_file,
      // Lifecycle fields
      ngay_ban_hanh, ngay_bat_dau_hieu_luc, ngay_ket_thuc_hieu_luc,
      chu_ky_soat_xet, ngay_soat_xet_gan_nhat, ngay_soat_xet_tiep_theo,
      nguoi_soan_thao, nguoi_phe_duyet, ngay_phe_duyet, trang_thai_phe_duyet,
      phong_ban_chu_quan, phong_ban_lien_quan, cap_do_tai_lieu,
      ly_do_thay_doi, ghi_chu_phe_duyet
    ] = documentRow
    
    const document = {
      id, ten_tai_lieu, mo_ta, loai_tai_lieu, trang_thai,
      nguoi_tao, ngay_tao, nguoi_cap_nhat, ngay_cap_nhat,
      phien_ban_hien_tai, 
      tieu_chuan_ap_dung: tieu_chuan_ap_dung ? tieu_chuan_ap_dung.split(',') : [],
      url_file,
      ngay_ban_hanh, ngay_bat_dau_hieu_luc, ngay_ket_thuc_hieu_luc,
      chu_ky_soat_xet, ngay_soat_xet_gan_nhat, ngay_soat_xet_tiep_theo,
      nguoi_soan_thao, nguoi_phe_duyet, ngay_phe_duyet, trang_thai_phe_duyet,
      phong_ban_chu_quan, 
      phong_ban_lien_quan: phong_ban_lien_quan ? phong_ban_lien_quan.split(',') : [],
      cap_do_tai_lieu, ly_do_thay_doi, ghi_chu_phe_duyet
    }
    
    return NextResponse.json({
      success: true,
      data: document
    })

  } catch (error) {
    console.error('Error fetching document lifecycle:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch document' },
      { status: 500 }
    )
  }
}

// PUT /api/documents/lifecycle/[id] - Update document lifecycle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    // Get existing document data
    const documentsData = await readSheet(SHEET_NAMES.TAI_LIEU)
    const documentIndex = documentsData.findIndex((row: any[]) => row[0] === params.id)
    
    if (documentIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData = {
      ...data,
      nguoi_cap_nhat: data.nguoi_cap_nhat || 'System',
      ngay_cap_nhat: new Date().toISOString().split('T')[0],
      tieu_chuan_ap_dung: Array.isArray(data.tieu_chuan_ap_dung) 
        ? data.tieu_chuan_ap_dung.join(',') 
        : data.tieu_chuan_ap_dung || '',
      phong_ban_lien_quan: Array.isArray(data.phong_ban_lien_quan)
        ? data.phong_ban_lien_quan.join(',')
        : data.phong_ban_lien_quan || ''
    }

    // Prepare row data for update
    const rowData = [
      updateData.id, updateData.ten_tai_lieu, updateData.mo_ta, 
      updateData.loai_tai_lieu, updateData.trang_thai,
      updateData.nguoi_tao, updateData.ngay_tao, 
      updateData.nguoi_cap_nhat, updateData.ngay_cap_nhat,
      updateData.phien_ban_hien_tai, updateData.tieu_chuan_ap_dung, 
      updateData.url_file || '',
      // Lifecycle fields
      updateData.ngay_ban_hanh, updateData.ngay_bat_dau_hieu_luc, 
      updateData.ngay_ket_thuc_hieu_luc || '',
      updateData.chu_ky_soat_xet, updateData.ngay_soat_xet_gan_nhat || '', 
      updateData.ngay_soat_xet_tiep_theo || '',
      updateData.nguoi_soan_thao, updateData.nguoi_phe_duyet, 
      updateData.ngay_phe_duyet || '', updateData.trang_thai_phe_duyet,
      updateData.phong_ban_chu_quan, updateData.phong_ban_lien_quan || '', 
      updateData.cap_do_tai_lieu,
      updateData.ly_do_thay_doi || '', updateData.ghi_chu_phe_duyet || ''
    ]

    // Update the specific row (documentIndex + 2 because of header row and 1-based indexing)
    const range = `${SHEET_NAMES.TAI_LIEU}!A${documentIndex + 2}:AA${documentIndex + 2}`
    await updateSheet(SHEET_NAMES.TAI_LIEU, range, [rowData])

    return NextResponse.json({
      success: true,
      data: updateData,
      message: 'Document updated successfully'
    })

  } catch (error) {
    console.error('Error updating document lifecycle:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update document' },
      { status: 500 }
    )
  }
}

// PATCH /api/documents/lifecycle/[id] - Update specific lifecycle actions
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const { action, ...updateData } = data

    // Get existing document data
    const documentsData = await readSheet(SHEET_NAMES.TAI_LIEU)
    const documentIndex = documentsData.findIndex((row: any[]) => row[0] === params.id)
    
    if (documentIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      )
    }

    const existingRow = documentsData[documentIndex]
    let finalUpdateData = { ...updateData }

    // Handle specific actions
    switch (action) {
      case 'approve':
        finalUpdateData = {
          ...finalUpdateData,
          trang_thai_phe_duyet: 'da_phe_duyet',
          ngay_phe_duyet: new Date().toISOString().split('T')[0],
          trang_thai: 'hieu_luc',
          ghi_chu_phe_duyet: updateData.ghi_chu_phe_duyet || 'Đã phê duyệt'
        }
        break

      case 'reject':
        finalUpdateData = {
          ...finalUpdateData,
          trang_thai_phe_duyet: 'tu_choi',
          trang_thai: 'soan_thao',
          ghi_chu_phe_duyet: updateData.ghi_chu_phe_duyet || 'Từ chối phê duyệt'
        }
        break

      case 'request_changes':
        finalUpdateData = {
          ...finalUpdateData,
          trang_thai_phe_duyet: 'can_chinh_sua',
          trang_thai: 'soan_thao',
          ghi_chu_phe_duyet: updateData.ghi_chu_phe_duyet || 'Yêu cầu chỉnh sửa'
        }
        break

      case 'submit_for_approval':
        finalUpdateData = {
          ...finalUpdateData,
          trang_thai_phe_duyet: 'cho_phe_duyet',
          trang_thai: 'cho_phe_duyet',
          ghi_chu_phe_duyet: 'Đã gửi phê duyệt'
        }
        break

      case 'mark_for_review':
        const today = new Date().toISOString().split('T')[0]
        const nextReviewDate = calculateNextReviewDate(today, existingRow[15] || '1_nam') // chu_ky_soat_xet
        
        finalUpdateData = {
          ...finalUpdateData,
          ngay_soat_xet_gan_nhat: today,
          ngay_soat_xet_tiep_theo: nextReviewDate,
          ly_do_thay_doi: updateData.ly_do_thay_doi || 'Đã thực hiện soát xét'
        }
        break

      case 'extend_validity':
        if (updateData.ngay_ket_thuc_hieu_luc) {
          finalUpdateData = {
            ...finalUpdateData,
            ly_do_thay_doi: updateData.ly_do_thay_doi || 'Gia hạn hiệu lực'
          }
        }
        break
    }

    // Add audit fields
    finalUpdateData.nguoi_cap_nhat = updateData.nguoi_cap_nhat || 'System'
    finalUpdateData.ngay_cap_nhat = new Date().toISOString().split('T')[0]

    // Merge with existing data
    const mergedData = {
      id: existingRow[0],
      ten_tai_lieu: finalUpdateData.ten_tai_lieu || existingRow[1],
      mo_ta: finalUpdateData.mo_ta || existingRow[2],
      loai_tai_lieu: finalUpdateData.loai_tai_lieu || existingRow[3],
      trang_thai: finalUpdateData.trang_thai || existingRow[4],
      nguoi_tao: existingRow[5],
      ngay_tao: existingRow[6],
      nguoi_cap_nhat: finalUpdateData.nguoi_cap_nhat,
      ngay_cap_nhat: finalUpdateData.ngay_cap_nhat,
      phien_ban_hien_tai: finalUpdateData.phien_ban_hien_tai || existingRow[9],
      tieu_chuan_ap_dung: finalUpdateData.tieu_chuan_ap_dung || existingRow[10],
      url_file: finalUpdateData.url_file || existingRow[11] || '',
      // Lifecycle fields
      ngay_ban_hanh: finalUpdateData.ngay_ban_hanh || existingRow[12],
      ngay_bat_dau_hieu_luc: finalUpdateData.ngay_bat_dau_hieu_luc || existingRow[13],
      ngay_ket_thuc_hieu_luc: finalUpdateData.ngay_ket_thuc_hieu_luc || existingRow[14] || '',
      chu_ky_soat_xet: finalUpdateData.chu_ky_soat_xet || existingRow[15],
      ngay_soat_xet_gan_nhat: finalUpdateData.ngay_soat_xet_gan_nhat || existingRow[16] || '',
      ngay_soat_xet_tiep_theo: finalUpdateData.ngay_soat_xet_tiep_theo || existingRow[17] || '',
      nguoi_soan_thao: finalUpdateData.nguoi_soan_thao || existingRow[18],
      nguoi_phe_duyet: finalUpdateData.nguoi_phe_duyet || existingRow[19],
      ngay_phe_duyet: finalUpdateData.ngay_phe_duyet || existingRow[20] || '',
      trang_thai_phe_duyet: finalUpdateData.trang_thai_phe_duyet || existingRow[21],
      phong_ban_chu_quan: finalUpdateData.phong_ban_chu_quan || existingRow[22],
      phong_ban_lien_quan: finalUpdateData.phong_ban_lien_quan || existingRow[23] || '',
      cap_do_tai_lieu: finalUpdateData.cap_do_tai_lieu || existingRow[24],
      ly_do_thay_doi: finalUpdateData.ly_do_thay_doi || existingRow[25] || '',
      ghi_chu_phe_duyet: finalUpdateData.ghi_chu_phe_duyet || existingRow[26] || ''
    }

    // Prepare row data for update
    const rowData = [
      mergedData.id, mergedData.ten_tai_lieu, mergedData.mo_ta, 
      mergedData.loai_tai_lieu, mergedData.trang_thai,
      mergedData.nguoi_tao, mergedData.ngay_tao, 
      mergedData.nguoi_cap_nhat, mergedData.ngay_cap_nhat,
      mergedData.phien_ban_hien_tai, mergedData.tieu_chuan_ap_dung, 
      mergedData.url_file,
      // Lifecycle fields
      mergedData.ngay_ban_hanh, mergedData.ngay_bat_dau_hieu_luc, 
      mergedData.ngay_ket_thuc_hieu_luc,
      mergedData.chu_ky_soat_xet, mergedData.ngay_soat_xet_gan_nhat, 
      mergedData.ngay_soat_xet_tiep_theo,
      mergedData.nguoi_soan_thao, mergedData.nguoi_phe_duyet, 
      mergedData.ngay_phe_duyet, mergedData.trang_thai_phe_duyet,
      mergedData.phong_ban_chu_quan, mergedData.phong_ban_lien_quan, 
      mergedData.cap_do_tai_lieu,
      mergedData.ly_do_thay_doi, mergedData.ghi_chu_phe_duyet
    ]

    // Update the specific row
    const range = `${SHEET_NAMES.TAI_LIEU}!A${documentIndex + 2}:AA${documentIndex + 2}`
    await updateSheet(SHEET_NAMES.TAI_LIEU, range, [rowData])

    return NextResponse.json({
      success: true,
      data: mergedData,
      message: getActionMessage(action)
    })

  } catch (error) {
    console.error('Error patching document lifecycle:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update document' },
      { status: 500 }
    )
  }
}

// Helper function to calculate next review date
function calculateNextReviewDate(lastReviewDate: string, cycle: string): string {
  if (cycle === 'khong_dinh_ky') return ''
  
  const date = new Date(lastReviewDate)
  
  switch (cycle) {
    case '6_thang':
      date.setMonth(date.getMonth() + 6)
      break
    case '1_nam':
      date.setFullYear(date.getFullYear() + 1)
      break
    case '2_nam':
      date.setFullYear(date.getFullYear() + 2)
      break
    case '3_nam':
      date.setFullYear(date.getFullYear() + 3)
      break
  }
  
  return date.toISOString().split('T')[0]
}

// Helper function to get action message
function getActionMessage(action: string): string {
  const messages: Record<string, string> = {
    'approve': 'Tài liệu đã được phê duyệt thành công',
    'reject': 'Tài liệu đã bị từ chối',
    'request_changes': 'Đã yêu cầu chỉnh sửa tài liệu',
    'submit_for_approval': 'Tài liệu đã được gửi phê duyệt',
    'mark_for_review': 'Đã đánh dấu hoàn thành soát xét',
    'extend_validity': 'Đã gia hạn hiệu lực tài liệu'
  }
  return messages[action] || 'Cập nhật tài liệu thành công'
}