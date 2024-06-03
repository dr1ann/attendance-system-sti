import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    
    const body: {
      studentId: User['studentId'],
      name: User['name'],
      username: User['username'],
      password: string,
      academicLevel: User['academicLevel'],
      section: User['section'],
      program: User['program'],
      yearLevel: User['yearLevel'],
      gender: User['gender']
    } = await req.json();

    const { studentId, name, username, password, academicLevel, section, program, yearLevel, gender } = body;
   
    if (studentId) {
      const existingUser = await prisma.user.findUnique({
       
        where: {
          studentId,
        },
      });
      if (existingUser) {
        return NextResponse.json({ message: 'STUDENT ID ALREADY TAKEN' }, { status: 400 });
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = await prisma.user.create({
      data: {
        studentId,
        name,
        username,
        password: hashedPassword,
        academicLevel,
        section,
        program,
        yearLevel,
        gender,
        role: 'STUDENT', // Ensure role is set to STUDENT
        createdAt: new Date(),
      },
    });


   

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
  
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
