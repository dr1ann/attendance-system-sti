// api/update-attendance-status.ts

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

    // Fetch the current schedule data with additional details
    const scheduleWithDetails = await prisma.schedule.findUnique({
      where: { id: scheduleId },
      include: { 
        student: true,
      },
    });

    if (!scheduleWithDetails || !scheduleWithDetails.studentId) {
      return NextResponse.json({ message: 'Schedule or student not found' }, { status: 404 });
    }

    // Extract necessary details from the schedule
    const {studentName, teacherName, attendanceStatus: oldAttendanceStatus, scheduledDate, scheduledInTime, scheduledOutTime } = scheduleWithDetails;

    // Handle null values for subject and roomNum
    const subjectValue = scheduleWithDetails.subject ?? 'Unknown Subject';
    const roomNumValue = scheduleWithDetails.roomNum ?? 'Unknown Room';

    // Update the attendance status of the schedule
    await prisma.schedule.update({
      where: { id: scheduleId },
      data: { attendanceStatus },
    });

    // Create an activity log for the student with all the necessary details
    await prisma.activityLog.create({
      data: {
        studentName,
        studentId: scheduleWithDetails.studentId,
        subject: subjectValue,
        roomNum: roomNumValue,
        scheduledDate,
        scheduledInTime,
        scheduledOutTime,
        attendanceStatus: attendanceStatus,
        activity: `Updated ${teacherName}'s attendance status from ${oldAttendanceStatus} to ${attendanceStatus}.`,
      },
    });

    // Return success message
    return NextResponse.json({ message: 'Attendance status and activity log updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating attendance status and creating activity log:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
