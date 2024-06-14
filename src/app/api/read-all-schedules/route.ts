import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
      // Fetch all schedules without filtering by user ID
      const schedules = await prisma.schedule.findMany();
  
      // Return the schedules
      return NextResponse.json(schedules, { status: 200 });
    } catch (error) {
      console.error('Error fetching schedules:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
  