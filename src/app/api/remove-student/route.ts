import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';

const prisma = new PrismaClient();


export async function DELETE(req: NextRequest) {
  try {
    const body: { id: string } = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ message: 'ID IS REQUIRED' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      return NextResponse.json({ message: 'STUDENT NOT FOUND' }, { status: 404 });
    }

    await prisma.user.delete({
      where: {
        id,
      },
    });

   

    const response = new NextResponse(JSON.stringify({ message: 'Student deleted successfully' }), { status: 200 });
   

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
