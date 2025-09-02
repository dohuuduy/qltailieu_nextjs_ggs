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
/
/ PUT /api/users - Update user
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    
    if (!data.id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Read current data
    const usersData = await readSheet('nguoi_dung')
    if (!usersData || usersData.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No users found' },
        { status: 404 }
      )
    }

    // Find the row to update
    const headerRow = usersData[0]
    const dataRows = usersData.slice(1)
    const rowIndex = dataRows.findIndex((row: any[]) => row[0] === data.id)
    
    if (rowIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Get current row data
    const currentRow = dataRows[rowIndex]
    
    // Update the row (keep password if not provided)
    const updatedRow = [
      data.id,
      data.ho_ten,
      data.email,
      data.ten_dang_nhap || data.email,
      data.mat_khau || currentRow[4], // Keep existing password if not provided
      data.chuc_vu,
      data.phong_ban,
      Array.isArray(data.quyen_phe_duyet) ? data.quyen_phe_duyet.join(',') : (data.quyen_phe_duyet || 'C'),
      data.trang_thai || 'active',
      currentRow[9], // Keep original creation date
      new Date().toISOString().split('T')[0] // Update modification date
    ]

    // Replace the entire sheet with updated data
    const updatedData = [headerRow, ...dataRows]
    updatedData[rowIndex + 1] = updatedRow // +1 because we include header

    // Clear and rewrite the sheet
    const { GoogleSpreadsheet } = require('google-spreadsheet')
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID)
    
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_CLIENT_EMAIL!,
      private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    })
    
    await doc.loadInfo()
    const sheet = doc.sheetsByTitle['nguoi_dung']
    
    // Clear existing data
    await sheet.clear()
    
    // Write updated data
    await sheet.addRows(updatedData.slice(1).map(row => ({
      id: row[0],
      ho_ten: row[1],
      email: row[2],
      ten_dang_nhap: row[3],
      mat_khau: row[4],
      chuc_vu: row[5],
      phong_ban: row[6],
      quyen_phe_duyet: row[7],
      trang_thai: row[8],
      ngay_tao: row[9],
      ngay_cap_nhat: row[10]
    })))

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        ho_ten: data.ho_ten,
        email: data.email,
        ten_dang_nhap: data.ten_dang_nhap || data.email,
        chuc_vu: data.chuc_vu,
        phong_ban: data.phong_ban,
        quyen_phe_duyet: Array.isArray(data.quyen_phe_duyet) ? data.quyen_phe_duyet : data.quyen_phe_duyet?.split(',') || [],
        trang_thai: data.trang_thai,
        ngay_tao: currentRow[9],
        ngay_cap_nhat: new Date().toISOString().split('T')[0]
      },
      message: 'User updated successfully'
    })

  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

// DELETE /api/users - Soft delete user (mark as inactive)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Read current data
    const usersData = await readSheet('nguoi_dung')
    if (!usersData || usersData.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No users found' },
        { status: 404 }
      )
    }

    // Find the row to update
    const headerRow = usersData[0]
    const dataRows = usersData.slice(1)
    const rowIndex = dataRows.findIndex((row: any[]) => row[0] === id)
    
    if (rowIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Mark as inactive
    const updatedRow = [...dataRows[rowIndex]]
    updatedRow[8] = 'inactive' // trang_thai column
    updatedRow[10] = new Date().toISOString().split('T')[0] // Update modification date

    // Replace the entire sheet with updated data
    const updatedData = [headerRow, ...dataRows]
    updatedData[rowIndex + 1] = updatedRow // +1 because we include header

    // Clear and rewrite the sheet
    const { GoogleSpreadsheet } = require('google-spreadsheet')
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID)
    
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_CLIENT_EMAIL!,
      private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    })
    
    await doc.loadInfo()
    const sheet = doc.sheetsByTitle['nguoi_dung']
    
    // Clear existing data
    await sheet.clear()
    
    // Write updated data
    await sheet.addRows(updatedData.slice(1).map(row => ({
      id: row[0],
      ho_ten: row[1],
      email: row[2],
      ten_dang_nhap: row[3],
      mat_khau: row[4],
      chuc_vu: row[5],
      phong_ban: row[6],
      quyen_phe_duyet: row[7],
      trang_thai: row[8],
      ngay_tao: row[9],
      ngay_cap_nhat: row[10]
    })))

    return NextResponse.json({
      success: true,
      message: 'User marked as inactive successfully'
    })

  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}