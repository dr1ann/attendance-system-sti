import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
  try {
    const { scheduleId, attendanceStatus }: { scheduleId: string, attendanceStatus: string } = await req.json();

    if (!scheduleId) {
      return NextResponse.json({ message: 'SCHEDULE ID IS REQUIRED' }, { status: 400 });
    }

    if (!attendanceStatus) {
      return NextResponse.json({ message: 'ATTENDANCE STATUS IS REQUIRED' }, { status: 400 });
    }

    // Update the attendance status of the schedule
    await prisma.schedule.update({
      where: { id: scheduleId },
      data: { attendanceStatus },
    });

    // Return success message
    return NextResponse.json({ message: 'Attendance status updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating attendance status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
