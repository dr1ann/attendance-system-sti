import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(req: NextRequest) {
  const cookie = serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: -1, // Expire the cookie immediately
    path: '/',
  });

  const response = new NextResponse(JSON.stringify({ message: 'Logged out successfully' }), { status: 200 });
  response.headers.set('Set-Cookie', cookie);

  return response;
}
