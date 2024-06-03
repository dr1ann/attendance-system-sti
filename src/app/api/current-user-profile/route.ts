import { NextRequest, NextResponse } from 'next/server';
import { authenticated } from '@/app/middleware/user-profile';
import { PrismaClient, User } from '@prisma/client';

interface AuthenticatedRequest extends NextRequest {
  user?: User;
}

const prisma = new PrismaClient();

const handler = async (req: AuthenticatedRequest, res: NextResponse) => {
  const user = req.user;


  const userProfile = await prisma.user.findUnique({ where: { id: user?.id } });

  return new NextResponse(
    JSON.stringify( userProfile ),
    { status: 200 }
  );
};

export const GET = authenticated(handler);
