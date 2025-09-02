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