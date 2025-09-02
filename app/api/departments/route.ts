import { NextRequest, NextResponse } from 'next/server'
import { readSheet, writeSheet } from '@/lib/google-sheets'

// GET /api/departments - Get all departments
export async function GET() {
  try {
    const departmentsData = await readSheet('phong_ban')
    
    if (!departmentsData || departmentsData.length === 0) {
      return NextResponse.json({
        success: true,
        data: []
      })
    }

    // Skip header row
    const dataRows = departmentsData.slice(1)
    
    const departments = dataRows.map((row: any[]) => {
      const [
        id, ten_phong_ban, ma_phong_ban, truong_phong, 
        pho_phong, mo_ta, trang_thai
      ] = row
      
      return {
        id: id || '',
        ten_phong_ban: ten_phong_ban || '',
        ma_phong_ban: ma_phong_ban || '',
        truong_phong: truong_phong || '',
        pho_phong: pho_phong ? pho_phong.split(',').map((s: string) => s.trim()) : [],
        mo_ta: mo_ta || '',
        trang_thai: trang_thai || 'active'
      }
    }).filter(dept => dept.id) // Filter out empty rows

    return NextResponse.json({
      success: true,
      data: departments
    })

  } catch (error) {
    console.error('Error fetching departments:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch departments', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST /api/departments - Create new department
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.ten_phong_ban || !data.ma_phong_ban) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate ID
    const id = `DEPT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Prepare department data
    const deptData = [
      id,
      data.ten_phong_ban,
      data.ma_phong_ban,
      data.truong_phong || '',
      Array.isArray(data.pho_phong) ? data.pho_phong.join(',') : (data.pho_phong || ''),
      data.mo_ta || '',
      data.trang_thai || 'active'
    ]

    await writeSheet('phong_ban', [deptData])

    return NextResponse.json({
      success: true,
      data: {
        id, 
        ten_phong_ban: data.ten_phong_ban, 
        ma_phong_ban: data.ma_phong_ban,
        truong_phong: data.truong_phong, 
        pho_phong: Array.isArray(data.pho_phong) ? data.pho_phong : data.pho_phong.split(','),
        mo_ta: data.mo_ta, 
        trang_thai: data.trang_thai || 'active'
      },
      message: 'Department created successfully'
    })

  } catch (error) {
    console.error('Error creating department:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create department' },
      { status: 500 }
    )
  }
}

// PUT /api/departments - Update department
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    
    if (!data.id) {
      return NextResponse.json(
        { success: false, error: 'Department ID is required' },
        { status: 400 }
      )
    }

    // Read current data
    const departmentsData = await readSheet('phong_ban')
    if (!departmentsData || departmentsData.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No departments found' },
        { status: 404 }
      )
    }

    // Find the row to update
    const headerRow = departmentsData[0]
    const dataRows = departmentsData.slice(1)
    const rowIndex = dataRows.findIndex((row: any[]) => row[0] === data.id)
    
    if (rowIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Department not found' },
        { status: 404 }
      )
    }

    // Update the row
    const updatedRow = [
      data.id,
      data.ten_phong_ban,
      data.ma_phong_ban,
      data.truong_phong || '',
      Array.isArray(data.pho_phong) ? data.pho_phong.join(',') : (data.pho_phong || ''),
      data.mo_ta || '',
      data.trang_thai || 'active'
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
    const sheet = doc.sheetsByTitle['phong_ban']
    
    // Clear existing data
    await sheet.clear()
    
    // Write updated data
    await sheet.addRows(updatedData.slice(1).map(row => ({
      id: row[0],
      ten_phong_ban: row[1],
      ma_phong_ban: row[2],
      truong_phong: row[3],
      pho_phong: row[4],
      mo_ta: row[5],
      trang_thai: row[6]
    })))

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        ten_phong_ban: data.ten_phong_ban,
        ma_phong_ban: data.ma_phong_ban,
        truong_phong: data.truong_phong,
        pho_phong: Array.isArray(data.pho_phong) ? data.pho_phong : data.pho_phong?.split(',') || [],
        mo_ta: data.mo_ta,
        trang_thai: data.trang_thai
      },
      message: 'Department updated successfully'
    })

  } catch (error) {
    console.error('Error updating department:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update department' },
      { status: 500 }
    )
  }
}

// DELETE /api/departments - Soft delete department (mark as inactive)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Department ID is required' },
        { status: 400 }
      )
    }

    // Read current data
    const departmentsData = await readSheet('phong_ban')
    if (!departmentsData || departmentsData.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No departments found' },
        { status: 404 }
      )
    }

    // Find the row to update
    const headerRow = departmentsData[0]
    const dataRows = departmentsData.slice(1)
    const rowIndex = dataRows.findIndex((row: any[]) => row[0] === id)
    
    if (rowIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Department not found' },
        { status: 404 }
      )
    }

    // Mark as inactive
    const updatedRow = [...dataRows[rowIndex]]
    updatedRow[6] = 'inactive' // trang_thai column

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
    const sheet = doc.sheetsByTitle['phong_ban']
    
    // Clear existing data
    await sheet.clear()
    
    // Write updated data
    await sheet.addRows(updatedData.slice(1).map(row => ({
      id: row[0],
      ten_phong_ban: row[1],
      ma_phong_ban: row[2],
      truong_phong: row[3],
      pho_phong: row[4],
      mo_ta: row[5],
      trang_thai: row[6]
    })))

    return NextResponse.json({
      success: true,
      message: 'Department marked as inactive successfully'
    })

  } catch (error) {
    console.error('Error deleting department:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete department' },
      { status: 500 }
    )
  }
}