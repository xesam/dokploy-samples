import { NextResponse } from 'next/server';

const mockUsers = [
  { id: 1, name: '张三', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', email: 'lisi@example.com' },
  { id: 3, name: '王五', email: 'wangwu@example.com' },
  { id: 4, name: '赵六', email: 'zhaoliu@example.com' }
];

export async function GET() {
  return NextResponse.json({
    users: mockUsers,
    total: mockUsers.length,
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: '请提供 name 和 email' },
        { status: 400 }
      );
    }

    const newUser = {
      id: mockUsers.length + 1,
      name,
      email
    };

    return NextResponse.json({
      success: true,
      user: newUser,
      message: '用户创建成功'
    }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: '无效的请求数据' },
      { status: 400 }
    );
  }
}