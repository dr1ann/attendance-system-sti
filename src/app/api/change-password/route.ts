import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const MIN_PASSWORD_LENGTH = 8; // Adjust the minimum password length as needed
const MAX_PASSWORD_LENGTH = 30; // Adjust the maximum password length as needed
const SPECIAL_CHARACTERS = /[!@#$%^&*(),.?":{}|<>]/; // Regex for special characters
const UPPERCASE_LETTER = /[A-Z]/; // Regex for uppercase letters

export async function POST(req: NextRequest) {
  try {
    const body: { currentId: string, currentPassword: string, newPassword: string } = await req.json();
    const { currentId, currentPassword, newPassword } = body;

    const userToUpdate = await prisma.user.findUniqueOrThrow({
      where: { id: currentId }, 
    });

    if (!userToUpdate) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const isPasswordMatch = await bcrypt.compare(currentPassword, userToUpdate.password);
    if (!isPasswordMatch) {
      return NextResponse.json({ message: 'ERROR', error: 'Incorrect current password' }, { status: 400 });
    }


    if (newPassword.length < MIN_PASSWORD_LENGTH || newPassword.length > MAX_PASSWORD_LENGTH) {
      return NextResponse.json({ message: 'ERROR', error: `New password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters` }, { status: 400 });
    }


    if (!UPPERCASE_LETTER.test(newPassword)) {
      return NextResponse.json({ message: 'ERROR', error: 'New password must contain at least one uppercase letter' }, { status: 400 });
    }

    
    if (!SPECIAL_CHARACTERS.test(newPassword)) {
      return NextResponse.json({ message: 'ERROR', error: 'New password must contain at least one special character' }, { status: 400 });
    }

    
    const isNewPasswordSameAsCurrent = await bcrypt.compare(newPassword, userToUpdate.password);
    if (isNewPasswordSameAsCurrent) {
      return NextResponse.json({ message: 'ERROR', error: 'New password cannot be the same as the current password' }, { status: 400 });
    }

   
    const hashedNewPassword: string = await bcrypt.hash(newPassword, 10); 

    const updatedUser = await prisma.user.update({
      where: { id: userToUpdate.id },
      data: {
        password: hashedNewPassword,
      },
    });

    return NextResponse.json({ updatedUser, message: 'SUCCESS' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
