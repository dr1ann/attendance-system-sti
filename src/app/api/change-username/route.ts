import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

const MIN_USERNAME_LENGTH = 6;
const MAX_USERNAME_LENGTH = 20;
const ALLOWED_USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;


export async function POST(req: NextRequest) {
  try {
    const body: {currentId: User['id'], currentUsername: User['username'], newUsername: User['username'] } = await req.json();
    const {currentId, currentUsername, newUsername } = body;

    
    const userToUpdate = await prisma.user.findUnique({
      where: { id: currentId },
    });

    if (!userToUpdate) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    


    if (currentUsername === newUsername) {
      return NextResponse.json({ message: 'ERROR', error: 'Cannot be the same as your current username. Try again' }, { status: 400 });
    }


    if (newUsername.length < MIN_USERNAME_LENGTH || newUsername.length > MAX_USERNAME_LENGTH) {
      return NextResponse.json({ message: 'ERROR', error: `Username must be between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters` }, { status: 400 });
    }


    if (!ALLOWED_USERNAME_REGEX.test(newUsername)) {
      return NextResponse.json({ message: 'ERROR', error: 'Username can only contain letters, numbers, and underscores' }, { status: 400 });
    }

   


    const existingUser = await prisma.user.findUnique({
      where: { username: newUsername },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'ERROR', error: 'Username is already taken. Try again' }, { status: 400 });
    }


    const updatedUser = await prisma.user.update({
      where: { id: userToUpdate.id },
      data: {
        username: newUsername,
      },
    });

    return NextResponse.json({ updatedUser, message: 'SUCCESS' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
