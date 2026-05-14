import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Hello from Next.js API!',
    timestamp: new Date().toISOString(),
    environment: process.env.APP_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      received: body,
      message: '数据已接收'
    });
  } catch {
    return NextResponse.json(
      { error: '无效的 JSON 数据' },
      { status: 400 }
    );
  }
}