import ExcelJS from 'exceljs';
import moment from 'moment';
import { ActivityLog, Schedule as PrismaSchedule } from '@prisma/client';
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

interface TransformedActivityLog {
  SUBJECT: string | null
  ROOM_NUMBER:string | null
  SCHEDULED_DATE_TIME: string | null
  ACTIVITY: string | null
  UPDATED_ON: string | null
}

interface User {
  studentId: string | null;
  name: string;
  academicLevel: string | null;
  section: string | null;
  program: string | null;
  yearLevel: string | null;
  gender: string | null;
  createdAt: Date;
}



export const ExportAllStudents = async (students: User[], fileName: string) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('All Students');

    // Add header row with custom styles
    const headers = ['Student ID', 'Full name', 'Academic Level', 'Section', 'Program', 'Year Level', 'Gender', 'Joined on'];
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

    // Add student data rows
    students.forEach((student) => {
      const dataRow = worksheet.addRow([
        student.studentId,
        student.name,
        student.academicLevel,
        student.section,
        student.program,
        student.yearLevel,
        student.gender,
        moment(student.createdAt).format('MM/DD/YYYY'),
      ]);
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

    calculateColumnWidthsExportAllStudents(headers, students, worksheet);

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${fileName}.xlsx`);
  } catch (error) {
    console.error("Error exporting students: ", error);
  }
};


export const ExportSchedule = async (data: Schedule[], fileName: string) => {
  // Transform the data and handle possible undefined values
  const transformedData = data.map((schedule) => ({
    TEACHER_NAME: schedule?.teacherName,
    TIME: `${formatTime(schedule.scheduledInTime)} - ${formatTime(schedule.scheduledOutTime)}`,
    ROOM_NUMBER: schedule?.roomNum,
    SUBJECT: schedule?.subject,
    ATTENDANCE_STATUS: schedule?.attendanceStatus,
  }));

  // Create a new workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  // Get student name and scheduled date
  const studentName = data[0].studentName ?? 'Unknown';
  const scheduledDate = moment(data[0].scheduledDate).format('MM/DD/YYYY');

  // Add student name and scheduled date row
  const studentInfoRow = worksheet.addRow(['Student Name:', studentName, 'Scheduled Date (mm/dd/year):', scheduledDate]);
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
  calculateColumnWidthsExportSched(Object.keys(transformedData[0]), transformedData, worksheet);

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
      const scheduledDateRow = worksheet.addRow(['Student Name:', studentName]);
      scheduledDateRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
      worksheet.addRow([]); // Add an empty row for spacing

      const transformedData = schedules.map((schedule) => ({
        TEACHER_NAME: schedule?.teacherName,
        SCHEDULED_DATE:  moment(schedule?.scheduledDate).format('MM/DD/YYYY'),
        TIME: `${formatTime(schedule.scheduledInTime)} - ${formatTime(schedule.scheduledOutTime)}`,
        ROOM_NUMBER: schedule?.roomNum,
        SUBJECT: schedule?.subject,
        ATTENDANCE_STATUS: schedule?.attendanceStatus,
      }));
      // Add header row with custom styles
      const headers = ['Teacher Name', 'Date (mm/dd/year)', 'Time', 'Room Number', 'Subject', 'Attendance Status'];
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
          TEACHER_NAME: schedule?.teacherName,
          SCHEDULED_DATE:  moment(schedule?.scheduledDate).format('MM/DD/YYYY'),
          TIME: `${formatTime(schedule.scheduledInTime)} - ${formatTime(schedule.scheduledOutTime)}`,
          ROOM_NUMBER: schedule?.roomNum,
          SUBJECT: schedule?.subject,
          ATTENDANCE_STATUS: schedule?.attendanceStatus,
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

      calculateColumnWidthsExportSched(headers, transformedData, worksheet);
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
function formatCreatedAtDate(timestamp: Date): string {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true, // Use 12-hour clock
  };
  return new Intl.DateTimeFormat('en-US', options).format(date);
}
const formatDate = (dateString: string | Date | null) => {
  return moment(dateString).format('MM/DD/YYYY');
};

const calculateColumnWidthsExportAllStudents = (headers: string[], data: User[], worksheet: ExcelJS.Worksheet) => {
  // Calculate the maximum length for each data cell
  const dataWidths: number[] = data.reduce((maxWidths: number[], item) => {
    const itemWidths = headers.map(header => String(item[header as keyof User]).length);
    return itemWidths.map((width, index) => Math.max(width, maxWidths[index] || 0));
  }, []);

  // Calculate the maximum width based on the data
  const maxDataWidths = dataWidths.map((maxWidth, index) => Math.max(maxWidth, headers[index].length));

  // Set a minimum width for columns to ensure content visibility
  const minColumnWidth = 20; // Adjust this value as needed
  const maxColumnWidth = 35; // Adjust this value as needed
  const paddingX = 5; // Adjust this value as needed for padding

  headers.forEach((header, index) => {
    // Determine the width for the column with padding
    const columnWidth = Math.min(maxDataWidths[index], maxColumnWidth) + paddingX;

    // Set the column width
    worksheet.getColumn(index + 1).width = Math.max(columnWidth, minColumnWidth);

    // Set cell alignment
    worksheet.getColumn(index + 1).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  });
};

export const ExportActivityLog = async (activityLog: ActivityLog[], studentName: string, fileName: string) => {
  // Transform the data and handle possible undefined values
  const transformedData = activityLog.map((log) => ({
    SUBJECT: log?.subject || 'N/A',
    ROOM_NUMBER: log?.roomNum,
    SCHEDULED_DATE_TIME: `${formatDate(log.scheduledDate)} \n ${formatTime(log.scheduledInTime)} - ${formatTime(log.scheduledOutTime)}`,
    ACTIVITY: log?.activity || 'N/A',
    UPDATED_ON: `${formatCreatedAtDate(log.createdAt)}` || 'N/A',
    
  }));

  // Create a new workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  // Add student name row
  const studentNameRow = worksheet.addRow(['Student Name:', studentName]);
  studentNameRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'left', vertical: 'middle' };
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  });
  worksheet.addRow([]); // Add an empty row for spacing

  // Add header row with custom styles
  const headers = ['Subject', 'Room number', 'Scheduled Date & Time', 'Activtity', 'Updated on'];
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
  calculateColumnWidthsExportActivityLog(Object.keys(transformedData[0]), transformedData, worksheet);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${fileName}.xlsx`);
};

const calculateColumnWidthsExportSched = (headers: string[], data: TransformedSchedule[], worksheet: ExcelJS.Worksheet) => {
  // Calculate the maximum length for each data cell
  const dataWidths: number[] = data.reduce((maxWidths: number[], item) => {
    const itemWidths = headers.map(header => String(item[header as keyof TransformedSchedule]).length);
    return itemWidths.map((width, index) => Math.max(width, maxWidths[index] || 0));
  }, []);

  // Calculate the maximum width based on the data
  const maxDataWidths = dataWidths.map((maxWidth, index) => Math.max(maxWidth, headers[index].length));

  // Set a minimum width for columns to ensure content visibility
  const minColumnWidth = 20; // Adjust this value as needed
  const maxColumnWidth = 35; // Adjust this value as needed
  const paddingX = 5; // Adjust this value as needed for padding

  headers.forEach((header, index) => {
    // Determine the width for the column with padding
    const columnWidth = Math.min(maxDataWidths[index], maxColumnWidth) + paddingX;

    // Set the column width
    worksheet.getColumn(index + 1).width = Math.max(columnWidth, minColumnWidth);

    // Set cell alignment
    worksheet.getColumn(index + 1).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  });
};





export const ExportAllActivityLog = async (activities: ActivityLog[], fileName: string) => {
  try {
    const workbook = new ExcelJS.Workbook();

    const activitiesByStudent = activities.reduce((acc: { [key: string]: ActivityLog[] }, activity) => {
      const studentName = activity.studentName ?? 'Unknown';
      if (!acc[studentName]) {
        acc[studentName] = [];
      }
      acc[studentName].push(activity);
      return acc;
    }, {});

    for (const [studentName, studentActivities] of Object.entries(activitiesByStudent)) {
      const worksheet = workbook.addWorksheet(`${studentName} Activities`);

      // Add student name row
      const studentNameRow = worksheet.addRow(['Student Name:', studentName]);
      studentNameRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
      worksheet.addRow([]); // Add an empty row for spacing

      // Add header row with custom styles
      const headers = ['Subject', 'Room number', 'Scheduled Date & Time', 'Activity', 'Updated on'];
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

      // Transform the activity data
      const transformedActivities: TransformedActivityLog[] = studentActivities.map((activity) => ({
        SUBJECT: activity.subject || 'N/A',
        ROOM_NUMBER: activity.roomNum || 'N/A',
        SCHEDULED_DATE_TIME: `${formatDate(activity.scheduledDate)} \n ${formatTime(activity.scheduledInTime)} - ${formatTime(activity.scheduledOutTime)}`,
        ACTIVITY: activity.activity || 'N/A',
        UPDATED_ON: formatCreatedAtDate(activity.createdAt) || 'N/A',
      }));

      // Add student data rows
      transformedActivities.forEach((activity) => {
        const dataRow = worksheet.addRow([
          activity.SUBJECT,
          activity.ROOM_NUMBER,
          activity.SCHEDULED_DATE_TIME,
          activity.ACTIVITY,
          activity.UPDATED_ON,
        ]);
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

      calculateColumnWidthsExportActivityLog(headers, transformedActivities, worksheet);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${fileName}.xlsx`);
  } catch (error) {
    console.error("Error exporting activities: ", error);
  }
};












const calculateColumnWidthsExportActivityLog = (headers: string[], data: TransformedActivityLog[], worksheet: ExcelJS.Worksheet) => {
  // Calculate the maximum length for each data cell
  const dataWidths: number[] = data.reduce((maxWidths: number[], item) => {
    const itemWidths = headers.map(header => String(item[header as keyof TransformedActivityLog]).length);
    return itemWidths.map((width, index) => Math.max(width, maxWidths[index] || 0));
  }, []);

  // Calculate the maximum width based on the data
  const maxDataWidths = dataWidths.map((maxWidth, index) => Math.max(maxWidth, headers[index].length));

  // Set a minimum width for columns to ensure content visibility
  const minColumnWidth = 20; // Adjust this value as needed
  const maxColumnWidth = 35; // Adjust this value as needed
  const paddingX = 5; // Adjust this value as needed for padding

  headers.forEach((header, index) => {
    // Determine the width for the column with padding
    const columnWidth = Math.min(maxDataWidths[index], maxColumnWidth) + paddingX;

    // Set the column width
    worksheet.getColumn(index + 1).width = Math.max(columnWidth, minColumnWidth);

    // Set cell alignment
    worksheet.getColumn(index + 1).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  });
};

