import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, getDepartmentById } from '@/lib/google-sheets';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Vui lòng nhập đầy đủ thông tin' },
        { status: 400 }
      );
    }

    // Authenticate user from Google Sheets
    const user = await authenticateUser(username, password);

    if (!user) {
      return NextResponse.json(
        { error: 'Tên đăng nhập hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }

    // Get department info
    const department = await getDepartmentById(user.phong_ban);

    // Create token (in real app, use JWT)
    const token = `token_${user.id}_${Date.now()}`;

    // Return user info without password
    const userInfo = {
      id: user.id,
      username: user.ten_dang_nhap || user.email,
      name: user.ho_ten,
      email: user.email,
      role: user.quyen_phe_duyet.includes('A') ? 'admin' : 
            user.quyen_phe_duyet.includes('B') ? 'manager' : 'user',
      department: department?.ten_phong_ban || user.phong_ban,
      position: user.chuc_vu,
      permissions: user.quyen_phe_duyet.split(',').map(p => p.trim()).filter(Boolean)
    };

    return NextResponse.json({
      success: true,
      token,
      user: userInfo
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Lỗi server. Vui lòng kiểm tra kết nối Google Sheets.' },
      { status: 500 }
    );
  }
}