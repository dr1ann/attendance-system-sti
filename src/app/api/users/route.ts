import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const allFacultyAdmins = await prisma?.user?.findMany();
    
    return NextResponse.json(allFacultyAdmins, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, username, password } = body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new faculty admin into the database
    const newFacultyAdmin = await prisma.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
        createdAt: new Date(),
      },
    });

    return NextResponse.json(newFacultyAdmin, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, username, password } = body;

    // Hash the password if provided
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    // Update the faculty admin in the database
    const updatedFacultyAdmin = await prisma.user.update({
      where: { id },
      data: {
        name,
        username,
        ...(hashedPassword && { password: hashedPassword }),
      },
    });

    return NextResponse.json(updatedFacultyAdmin, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    // Delete the faculty admin from the database
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Faculty admin deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}



