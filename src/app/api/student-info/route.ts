import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient()
export async function POST(req: NextRequest) {

      
    try {
        const body: {currentId: User['id'] } = await req.json();
        const { currentId } = body;
        const studentProfile = await prisma.user.findUnique({ where: { id: currentId } });
      


  return new NextResponse(
    JSON.stringify( studentProfile ),
    { status: 200 }
  );
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }



export async function PUT(req: NextRequest) {
  try {
    const body: { currentId: User['id'], data: Partial<User> } = await req.json();
    const { currentId, data } = body;

    const newStudentID = data.studentId;

    if (newStudentID) {
      const existingUser = await prisma.user.findFirst({
        where: {
          studentId: newStudentID,
          NOT: {
            id: currentId,
          },
        },
      });
    
      if (existingUser) {
        return NextResponse.json({ message: 'STUDENT ID ALREADY TAKEN' }, { status: 400 });
      }
    }
    

    const updatedProfile = await prisma.user.update({
      where: { id: currentId },
      data,
    });

    return NextResponse.json(updatedProfile, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
