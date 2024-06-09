import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body: {
      studentId: string,
      teacherName?: string,
      scheduledDate: Date,
      scheduledInTime: string,
      scheduledOutTime: string,
      roomNum?: string,
      subject?: string,
      attendanceStatus?: string,
      gender?: string
    } = await req.json();

    const {
      studentId,
      teacherName,
      scheduledDate,
      scheduledInTime,
      scheduledOutTime,
      roomNum,
      subject,
      attendanceStatus = 'PENDING',
      gender
    } = body;

    // Check if the student exists
    const student = await prisma.user.findUnique({
      where: {
        id: studentId,
      },
    });

    if (!student) {
      return NextResponse.json({ message: 'STUDENT NOT FOUND' }, { status: 404 });
    }
console.log(studentId)
    // Create the new schedule associated with the student
    const newSchedule = await prisma.schedule.create({
      data: {
        studentId, // Associate the schedule with the student
        teacherName,
        scheduledDate,
        scheduledInTime,
        scheduledOutTime,
        roomNum,
        subject,
        attendanceStatus,
        gender,
        createdAt: new Date(),
      },
    });

    // Return the new schedule
    return NextResponse.json(newSchedule, { status: 201 });
  } catch (error) {
    console.error('Error creating schedule:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
