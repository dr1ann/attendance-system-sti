// api/student-activity-log.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { studentId }: { studentId: string } = await req.json();

    if (!studentId) {
      return NextResponse.json({ message: 'STUDENT ID IS REQUIRED' }, { status: 400 });
    }

    // Fetch the activity log of the student
    const activityLog = await prisma.activityLog.findMany({
      where: { studentId },
     
    });

    // Return the activity log
    return NextResponse.json(activityLog, { status: 200 });
  } catch (error) {
    console.error('Error fetching activity log:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Fetch all schedules without filtering by user ID
    const activities = await prisma.activityLog.findMany();

    // Check if no schedules are found
    if (activities.length === 0) {
      return NextResponse.json({ error: 'No activity logs found' }, { status: 404 });
    }

    // Check if any schedule has a null activity property
    for (const activity of activities) {
      if (activity.activity === null) {
        return NextResponse.json({ error: 'One or more schedules have a null activity property' }, { status: 400 });
      }
    }

    // Return the schedules
    return NextResponse.json(activities, { status: 200 });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
  