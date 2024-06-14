import ExcelJS from 'exceljs';
import moment from 'moment';
import { Schedule as PrismaSchedule } from '@prisma/client';
import { saveAs } from 'file-saver';

// Ensure Schedule interface includes studentName and handle possible undefined values
interface Schedule extends PrismaSchedule {
  studentName: string | null;
}

interface TransformedSchedule {
  TEACHER_NAME: string | null;
  SCHEDULED_DATE?: string | null;
  TIME: string | null;
  ROOM_NUMBER: string | null;
  SUBJECT: string | null;
  ATTENDANCE_STATUS: string | null;
}

export const ExportSchedule = async (data: Schedule[], fileName: string) => {
  // Transform the data and handle possible undefined values
  const transformedData = data.map((item) => ({
    TEACHER_NAME: item.teacherName,
    TIME: `${formatTime(item.scheduledInTime)} - ${formatTime(item.scheduledOutTime)}`,
    ROOM_NUMBER: item.roomNum,
    SUBJECT: item.subject,
    ATTENDANCE_STATUS: item.attendanceStatus,
  }));

  // Create a new workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  // Get student name and scheduled date
  const studentName = data[0].studentName ?? 'Unknown';
  const scheduledDate = moment(data[0].scheduledDate).format('MM/DD/YYYY');

  // Add student name and scheduled date row
  const studentInfoRow = worksheet.addRow(['Student Name:', studentName, 'Scheduled Date:', scheduledDate]);
  studentInfoRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'left', vertical: 'middle' };
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  });
  worksheet.addRow([]); // Add an empty row for spacing

  // Add header row with custom styles
  const headers = ['Teacher Name', 'Time', 'Room Number', 'Subject', 'Attendance Status'];
  const headerRow = worksheet.addRow(headers);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF01579B' },
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  });

  // Add data rows with custom styles
  transformedData.forEach((row) => {
    const dataRow = worksheet.addRow(Object.values(row));
    dataRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF5F5F5' },
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });
  });

  // Calculate the maximum width for each column and set the column widths
  calculateColumnWidths(Object.keys(transformedData[0]), transformedData, worksheet);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${fileName}.xlsx`);
};

export const ExportAllSchedules = async (data: Schedule[], fileName: string) => {
  try {
    const workbook = new ExcelJS.Workbook();

    const schedulesByStudent = data.reduce((acc: { [key: string]: Schedule[] }, schedule) => {
      const studentName = schedule.studentName ?? 'Unknown';
      if (!acc[studentName]) {
        acc[studentName] = [];
      }
      acc[studentName].push(schedule);
      return acc;
    }, {});

    for (const [studentName, schedules] of Object.entries(schedulesByStudent)) {
      const worksheet = workbook.addWorksheet(`${studentName} Schedules`);

      // Add scheduled date row
      const scheduledDateRow = worksheet.addRow(['Scheduled Date:', moment(schedules[0].scheduledDate).format('MM/DD/YYYY')]);
      scheduledDateRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
      worksheet.addRow([]); // Add an empty row for spacing

      const transformedData = schedules.map((schedule) => ({
        TEACHER_NAME: schedule.teacherName,
        TIME: `${formatTime(schedule.scheduledInTime)} - ${formatTime(schedule.scheduledOutTime)}`,
        ROOM_NUMBER: schedule.roomNum,
        SUBJECT: schedule.subject,
        ATTENDANCE_STATUS: schedule.attendanceStatus,
      }));
      // Add header row with custom styles
      const headers = ['Teacher Name', 'Time', 'Room Number', 'Subject', 'Attendance Status'];
      const headerRow = worksheet.addRow(headers);
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF01579B' },
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });

      // Transform and add data rows with custom styles
      schedules.forEach((schedule) => {
        const transformedData: TransformedSchedule = {
          TEACHER_NAME: schedule.teacherName,
          TIME: `${formatTime(schedule.scheduledInTime)} - ${formatTime(schedule.scheduledOutTime)}`,
          ROOM_NUMBER: schedule.roomNum,
          SUBJECT: schedule.subject,
          ATTENDANCE_STATUS: schedule.attendanceStatus,
        };

        const dataRow = worksheet.addRow(Object.values(transformedData));
        dataRow.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF5F5F5' },
          };
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });
      });

     calculateColumnWidths(headers, transformedData, worksheet);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${fileName}.xlsx`);
  } catch (error) {
    console.error("Error exporting schedules: ", error);
  }
};

const formatTime = (timeString: string): string => {
  return moment(timeString, 'HH:mm').format('hh:mm A');
};

const calculateColumnWidths = (headers: string[], data: TransformedSchedule[], worksheet: ExcelJS.Worksheet) => {
  const headerWidths: number[] = headers.map(header => header.length);

  headers.forEach((header, index) => {
    const dataWidths = data.map((item) => String(item[header as keyof TransformedSchedule]).length);
    const maxDataWidth = Math.max(...dataWidths);
    headerWidths[index] = Math.max(headerWidths[index], maxDataWidth, header.length);
  });

  headerWidths.forEach((headerWidth, index) => {
    worksheet.getColumn(index + 1).width = headerWidth + 20;
  });
};

// Usage example (assuming `sortLatestInOutTimes` is the sorted array of schedules and `fileName` is the desired file name)

