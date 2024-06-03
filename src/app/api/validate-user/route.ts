import { NextRequest, NextResponse } from 'next/server';
import { authenticated } from '@/app/middleware/auth';
import { User } from '@prisma/client';


interface AuthenticatedRequest extends NextRequest {
  user?: User;
}

const handler = async (req: AuthenticatedRequest) => {
  const user = req.user;

  if (!user || !user.role) {
    return new NextResponse(JSON.stringify({ message: 'INVALID USER' }), { status: 400 });
  }

  else if (user?.role === 'FACULTY') {
    return new NextResponse(JSON.stringify({ message: 'USER IS FACULTY' }), { status: 200 });
  }

  else if (user?.role === 'STUDENT') {
    return new NextResponse(JSON.stringify({ message: 'USER IS STUDENT' }), { status: 200 });
  }
  else {
    return new NextResponse(JSON.stringify({ message: 'UNKNOWN ROLE' }), { status: 400 });
  }
 
};

export const GET = authenticated(handler);
