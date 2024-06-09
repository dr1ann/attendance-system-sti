import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { studentId }: { studentId: string } = await req.json();

    if (!studentId) {
      return NextResponse.json({ message: 'STUDENT ID IS REQUIRED' }, { status: 400 });
    }

    // Check if the student exists
    const student = await prisma.user.findUnique({
      where: {
        id: studentId, // Use studentId to find the student
      },
    });

    if (!student) {
      return NextResponse.json({ message: 'STUDENT NOT FOUND' }, { status: 404 });
    }

    // Fetch the schedules associated with the student
    const schedules = await prisma.schedule.findMany({
      where: {
        studentId: student.id,  // Use the user's id to fetch schedules
      },
    });

    // Return the schedules
    return NextResponse.json(schedules, { status: 200 });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, updatedSchedule }: { id: string; updatedSchedule: any } = await req.json();

    if (!id) {
      return NextResponse.json({ message: 'SCHEDULE ID IS REQUIRED' }, { status: 400 });
    }

    // Check if the schedule exists
    const schedule = await prisma.schedule.findUnique({
      where: {
        id: id, // Use id to find the schedule
      },
    });

    if (!schedule) {
      return NextResponse.json({ message: 'SCHEDULE NOT FOUND' }, { status: 404 });
    }

    // Update the schedule
    const updated = await prisma.schedule.update({
      where: { id: id },
      data: updatedSchedule,
    });

    // Return the updated schedule
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('Error updating schedule:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
