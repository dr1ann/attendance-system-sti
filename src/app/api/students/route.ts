import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient()
export async function GET(req: NextRequest) {
    try {
      const allUsers = await prisma?.user?.findMany();
      
      const allStudents = allUsers.filter((user) => user?.role === 'STUDENT');

      return NextResponse.json(allStudents, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }