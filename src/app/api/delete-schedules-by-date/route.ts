// In your server code
import moment from 'moment';
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
    try {
      const { scheduledDate }: { scheduledDate?: string } = await req.json();
  
      if (!scheduledDate) {
        return NextResponse.json({ message: 'DATE IS REQUIRED' }, { status: 400 });
      }
  
      // Format the date as dd/MM/YYYY
      const formattedDate = moment.utc(scheduledDate, 'DD/MM/YYYY').format('DD/MM/YYYY');

  
      // Get the start and end dates for the given day
      const startDate = moment.utc(formattedDate, 'DD/MM/YYYY').startOf('day').toDate();
      const endDate = moment.utc(formattedDate, 'DD/MM/YYYY').endOf('day').toDate();
  
      // Delete all schedules for the given date
      await prisma.schedule.deleteMany({
        where: {
          AND: [
            { scheduledDate: { gte: startDate } }, // Greater than or equal to start of day
            { scheduledDate: { lte: endDate } }   // Less than or equal to end of day
          ]
        }
      });
  
      return NextResponse.json({ message: `All schedules for ${formattedDate} deleted successfully` }, { status: 200 });
    } catch (error) {
      console.error('Error deleting schedules:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
