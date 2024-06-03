import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../utils/auth';
import { PrismaClient, User } from '@prisma/client';

interface AuthenticatedRequest extends NextRequest {
  user?: User;
}

export const authenticated = (handler: (req: AuthenticatedRequest, res: NextResponse) =>Promise<NextResponse | void>) => {
  return async (req: NextRequest, res: NextResponse) => {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return new NextResponse(JSON.stringify({ message: 'Not authenticated' }), { status: 401 });
    }

    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      return new NextResponse(JSON.stringify({ message: 'Invalid token' }), { status: 401 });
    }

    (req as AuthenticatedRequest).user = decodedToken;

    return handler(req, res);
  };
};
