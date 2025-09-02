import { NextRequest, NextResponse } from 'next/server'
import { readSheet, writeSheet, SHEET_NAMES } from '@/lib/google-sheets'
import { DocumentLifecycle, getCurrentDocumentStatus } from '@/lib/types/document-lifecycle'

// GET /api/documents/lifecycle - Get all documents with lifecycle info
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const expiring = searchParams.get('expiring') === 'true'
    const needsReview = searchParams.get('needsReview') === 'true'
    const department = searchParams.get('department')

    const documentsData = await readSheet(SHEET_NAMES.TAI_LIEU)
    const documents = documentsData.map((row: any[]) => {
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
      ] = row
      
      return {
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
    })
    
    let filteredDocs = documents.map(doc => {
      const lifecycle = doc as DocumentLifecycle
      const computedStatus = getCurrentDocumentStatus(lifecycle)
      return {
        ...lifecycle,
        computed_status: computedStatus
      }
    })

    // Apply filters
    if (status) {
      filteredDocs = filteredDocs.filter(doc => doc.computed_status === status)
    }

    if (expiring) {
      const today = new Date()
      const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
      
      filteredDocs = filteredDocs.filter(doc => {
        if (!doc.ngay_ket_thuc_hieu_luc) return false
        const endDate = new Date(doc.ngay_ket_thuc_hieu_luc)
        return endDate <= thirtyDaysFromNow && endDate > today
      })
    }

    if (needsReview) {
      const today = new Date()
      const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
      
      filteredDocs = filteredDocs.filter(doc => {
        if (!doc.ngay_soat_xet_tiep_theo) return false
        const reviewDate = new Date(doc.ngay_soat_xet_tiep_theo)
        return reviewDate <= thirtyDaysFromNow
      })
    }

    if (department) {
      filteredDocs = filteredDocs.filter(doc => 
        doc.phong_ban_chu_quan === department || 
        doc.phong_ban_lien_quan?.includes(department)
      )
    }

    return NextResponse.json({
      success: true,
      data: filteredDocs,
      total: filteredDocs.length
    })

  } catch (error) {
    console.error('Error fetching lifecycle documents:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}

// POST /api/documents/lifecycle - Create document with lifecycle info
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.ten_tai_lieu || !data.ngay_ban_hanh || !data.ngay_bat_dau_hieu_luc) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate ID
    const id = `DOC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Prepare document data
    const documentData = {
      id,
      ...data,
      nguoi_tao: data.nguoi_soan_thao || 'System',
      ngay_tao: new Date().toISOString().split('T')[0],
      nguoi_cap_nhat: data.nguoi_soan_thao || 'System',
      ngay_cap_nhat: new Date().toISOString().split('T')[0],
      phien_ban_hien_tai: '1.0',
      tieu_chuan_ap_dung: Array.isArray(data.tieu_chuan_ap_dung) 
        ? data.tieu_chuan_ap_dung.join(',') 
        : data.tieu_chuan_ap_dung || '',
      phong_ban_lien_quan: Array.isArray(data.phong_ban_lien_quan)
        ? data.phong_ban_lien_quan.join(',')
        : data.phong_ban_lien_quan || ''
    }

    // Prepare data for Google Sheets
    const rowData = [
      documentData.id, documentData.ten_tai_lieu, documentData.mo_ta, 
      documentData.loai_tai_lieu, documentData.trang_thai,
      documentData.nguoi_tao, documentData.ngay_tao, 
      documentData.nguoi_cap_nhat, documentData.ngay_cap_nhat,
      documentData.phien_ban_hien_tai, documentData.tieu_chuan_ap_dung, 
      documentData.url_file || '',
      // Lifecycle fields
      documentData.ngay_ban_hanh, documentData.ngay_bat_dau_hieu_luc, 
      documentData.ngay_ket_thuc_hieu_luc || '',
      documentData.chu_ky_soat_xet, documentData.ngay_soat_xet_gan_nhat || '', 
      documentData.ngay_soat_xet_tiep_theo || '',
      documentData.nguoi_soan_thao, documentData.nguoi_phe_duyet, 
      documentData.ngay_phe_duyet || '', documentData.trang_thai_phe_duyet,
      documentData.phong_ban_chu_quan, documentData.phong_ban_lien_quan || '', 
      documentData.cap_do_tai_lieu,
      documentData.ly_do_thay_doi || '', documentData.ghi_chu_phe_duyet || ''
    ]
    
    await writeSheet(SHEET_NAMES.TAI_LIEU, [rowData])

    return NextResponse.json({
      success: true,
      data: documentData,
      message: 'Document created successfully'
    })

  } catch (error) {
    console.error('Error creating lifecycle document:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create document' },
      { status: 500 }
    )
  }
}