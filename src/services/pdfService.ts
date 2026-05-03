import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Student } from '../types';

// Extend jsPDF with autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const pdfService = {
  generateStudentsReport: (students: Student[]) => {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });

    doc.setFontSize(22);
    doc.text('Class Performance Summary', 105, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text(`EduGrade - Teacher: Belhia Yacine`, 105, 30, { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 38, { align: 'center' });

    const tableData = students.map(s => [
      s.rank || '-',
      s.studentNumber || '-',
      s.name,
      s.overallAverage?.toFixed(2) || '-',
      (s.overallAverage || 0) >= 10 ? 'Passed' : 'Needs Support'
    ]);

    doc.autoTable({
      startY: 50,
      head: [['Rank', 'ID', 'Student Name', 'Overall Avg', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 3 },
      alternateRowStyles: { fillColor: [241, 245, 249] }
    });

    doc.save('class_report.pdf');
  },

  generateSingleStudentReport: (student: Student) => {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });

    doc.setFontSize(22);
    doc.text('Individual Performance Analysis', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text(`Student: ${student.name}`, 20, 40);
    doc.text(`Overall Average: ${student.overallAverage?.toFixed(2) || '-'}/20`, 20, 50);
    doc.text(`Class Rank: ${student.rank || '-'}`, 20, 60);

    const gradesData = Object.entries(student.grades).map(([subject, g]) => [
      subject,
      g.evaluation || '-',
      g.practical || '-',
      g.quiz || '-',
      g.exam || '-',
      g.average?.toFixed(2) || '-'
    ]);

    doc.autoTable({
      startY: 70,
      head: [['Subject', 'Eval', 'Prac/Oral', 'Quiz', 'Exam', 'Final Avg']],
      body: gradesData,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
      styles: { fontSize: 11, cellPadding: 5 }
    });

    const filename = `${student.name.replace(/\s+/g, '_')}_analysis.pdf`;
    doc.save(filename);
  }
};
