
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../utils/auth';
import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie'

const prisma = new PrismaClient();




export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    const user = await prisma?.user?.findUnique({ where: { username: username } });

    if (user?.role !== 'FACULTY' || !(await bcrypt.compare(password, user.password))) {
      return new NextResponse(
        JSON.stringify({ message: 'Incorrect username or password. Try again' }),
        { status: 401 }
      );
    }

    const token = generateToken(user.id, user.role);

    // Set the cookie
    const cookie = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600,
      path: '/',
    });

    const response = new NextResponse(
      JSON.stringify({ message: 'Login successful', token }),
      { status: 200 }
    );
    response.headers.set('Set-Cookie', cookie);

    return response;
  } catch (error) {
    console.error('Error:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server error' }),
      { status: 500 }
    );
  }
}



