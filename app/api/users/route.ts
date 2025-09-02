import { NextRequest, NextResponse } from 'next/server'
import { readSheet, writeSheet, SHEET_NAMES } from '@/lib/google-sheets'

// GET /api/users - Get all users
export async function GET() {
  try {
    const usersData = await readSheet('nguoi_dung')
    
    if (!usersData || usersData.length === 0) {
      return NextResponse.json({
        success: true,
        data: []
      })
    }

    // Skip header row
    const dataRows = usersData.slice(1)
    
    const users = dataRows.map((row: any[]) => {
      const [
        id, ho_ten, email, ten_dang_nhap, mat_khau, chuc_vu, phong_ban, 
        quyen_phe_duyet, trang_thai, ngay_tao, ngay_cap_nhat
      ] = row
      
      return {
        id: id || '',
        ho_ten: ho_ten || '',
        email: email || '',
        ten_dang_nhap: ten_dang_nhap || '',
        chuc_vu: chuc_vu || '',
        phong_ban: phong_ban || '',
        quyen_phe_duyet: quyen_phe_duyet ? quyen_phe_duyet.split(',').map((s: string) => s.trim()) : [],
        trang_thai: trang_thai || 'active',
        ngay_tao: ngay_tao || '',
        ngay_cap_nhat: ngay_cap_nhat || ''
      }
    }).filter(user => user.id) // Filter out empty rows

    return NextResponse.json({
      success: true,
      data: users
    })

  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.ho_ten || !data.email || !data.chuc_vu || !data.phong_ban) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate ID
    const id = `USER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Prepare user data
    const userData = [
      id,
      data.ho_ten,
      data.email,
      data.ten_dang_nhap || data.email,
      data.mat_khau || 'password123', // Default password
      data.chuc_vu,
      data.phong_ban,
      Array.isArray(data.quyen_phe_duyet) ? data.quyen_phe_duyet.join(',') : (data.quyen_phe_duyet || 'C'),
      data.trang_thai || 'active',
      new Date().toISOString().split('T')[0],
      new Date().toISOString().split('T')[0]
    ]

    await writeSheet('nguoi_dung', [userData])

    return NextResponse.json({
      success: true,
      data: {
        id, 
        ho_ten: data.ho_ten, 
        email: data.email, 
        ten_dang_nhap: data.ten_dang_nhap || data.email,
        chuc_vu: data.chuc_vu,
        phong_ban: data.phong_ban, 
        quyen_phe_duyet: Array.isArray(data.quyen_phe_duyet) ? data.quyen_phe_duyet : data.quyen_phe_duyet.split(','),
        trang_thai: data.trang_thai || 'active',
        ngay_tao: new Date().toISOString().split('T')[0],
        ngay_cap_nhat: new Date().toISOString().split('T')[0]
      },
      message: 'User created successfully'
    })

  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    )
  }
}