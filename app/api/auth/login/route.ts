import { NextRequest, NextResponse } from 'next/server';

// POST /api/auth/login - 验证管理员密码
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { success: false, error: '密码不能为空' },
        { status: 400 }
      );
    }

    // 从环境变量获取管理员密码
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error('ADMIN_PASSWORD 环境变量未设置');
      return NextResponse.json(
        { success: false, error: '服务器配置错误' },
        { status: 500 }
      );
    }

    if (password === adminPassword) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: '密码错误' },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
