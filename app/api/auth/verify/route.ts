import { NextRequest, NextResponse } from 'next/server';
import { getUserById, getDepartmentById } from '@/lib/google-sheets';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    console.log('Verifying token:', token);

    if (!token) {
      console.log('No token provided');
      return NextResponse.json(
        { success: false, error: 'Token không hợp lệ' },
        { status: 401 }
      );
    }

    // Extract user ID from token (simple demo implementation)
    // Token format: token_USER_001_timestamp
    const tokenParts = token.split('_');
    if (tokenParts.length < 4 || tokenParts[0] !== 'token') {
      console.log('Invalid token format:', tokenParts);
      return NextResponse.json(
        { success: false, error: 'Token không hợp lệ' },
        { status: 401 }
      );
    }

    const userId = `${tokenParts[1]}_${tokenParts[2]}`; // USER_001
    console.log('Extracted user ID:', userId);

    const user = await getUserById(userId);
    console.log('User found:', user ? user.ho_ten : 'null');

    if (!user || user.trang_thai !== 'active') {
      console.log('User not found or inactive');
      return NextResponse.json(
        { success: false, error: 'Người dùng không tồn tại hoặc đã bị vô hiệu hóa' },
        { status: 401 }
      );
    }

    // Get department info
    const department = await getDepartmentById(user.phong_ban);

    // Return user info
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

    console.log('Token verification successful for user:', userInfo.name);

    return NextResponse.json({
      success: true,
      user: userInfo
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi server', details: error.message },
      { status: 500 }
    );
  }
}