import { NextRequest, NextResponse } from 'next/server';
import { authenticated } from '@/app/middleware/auth';
import { User } from '@prisma/client';

interface AuthenticatedRequest extends NextRequest {
  user?: User;
}
const handler = async (req: AuthenticatedRequest) => {
  const user = req.user;

  if (!user || !user.role) {
    return new NextResponse(JSON.stringify({ message: 'Invalid user' }), { status: 400 });
  }

  if (user.role === 'STUDENT') {
    return new NextResponse(JSON.stringify({ message: 'ACCESS GRANTED' }), { status: 200 });
  }  else {
    return new NextResponse(JSON.stringify({ message: 'ACCESS DENIED' }), { status: 403 });
  }
};

export const GET = authenticated(handler);
