import jsPDF from 'jspdf';
import { AnalysisResult } from '@/lib/ai/analysis-service';

interface PatientInfo {
  name: string;
  patientId: string;
  dateOfBirth: string;
  phone?: string;
  email?: string;
}

interface ReportData {
  patient: PatientInfo;
  analysis: AnalysisResult;
  baselineDate: string;
  currentDate: string;
  clinicName?: string;
  doctorName?: string;
}

/**
 * Add demo watermark to every page
 */
function addDemoWatermark(pdf: jsPDF) {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Save current state
  pdf.saveGraphicsState();

  // Set watermark style
  pdf.setTextColor(255, 0, 0); // Red color
  pdf.setFontSize(60);
  pdf.setFont('helvetica', 'bold');

  // Add diagonal watermark
  const watermarkText = 'DEMO SAMPLE';
  pdf.text(watermarkText, pageWidth / 2, pageHeight / 2, {
    align: 'center',
    angle: 45,
    renderingMode: 'stroke',
    opacity: 0.1,
  });

  // Add second line
  pdf.setFontSize(40);
  pdf.text('NOT FOR CLINICAL USE', pageWidth / 2, pageHeight / 2 + 20, {
    align: 'center',
    angle: 45,
    renderingMode: 'stroke',
    opacity: 0.1,
  });

  // Restore state
  pdf.restoreGraphicsState();
}

/**
 * Add full-page disclaimer as first page
 */
function addDisclaimerPage(pdf: jsPDF) {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 30;

  // Red border
  pdf.setDrawColor(220, 38, 38);
  pdf.setLineWidth(3);
  pdf.rect(margin - 10, margin - 10, pageWidth - (margin - 10) * 2, pageHeight - (margin - 10) * 2);

  // Warning icon (triangle)
  pdf.setFillColor(239, 68, 68);
  const centerX = pageWidth / 2;
  pdf.triangle(centerX - 15, 60, centerX + 15, 60, centerX, 35, 'F');

  // Exclamation mark
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('!', centerX, 53, { align: 'center' });

  // Title
  pdf.setTextColor(220, 38, 38);
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text('IMPORTANT NOTICE', centerX, 80, { align: 'center' });

  // Disclaimer content
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');

  const disclaimerLines = [
    '',
    'This is a DEMONSTRATION REPORT',
    'using SAMPLE DATA',
    '',
  ];

  let yPos = 100;
  disclaimerLines.forEach(line => {
    pdf.text(line, centerX, yPos, { align: 'center' });
    yPos += 10;
  });

  // Main warning text
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  const warningText = [
    '',
    'DO NOT USE for medical decisions',
    'DO NOT share with healthcare providers as clinical data',
    'DO NOT rely on for diagnosis or treatment',
    '',
    'This report is generated for UI/UX demonstration purposes only.',
    'All data, analysis, and recommendations shown are simulated.',
    '',
    'For actual diagnosis and treatment:',
    '✓ Consult a licensed dental professional',
    '✓ Request professional diagnostic imaging',
    '✓ Obtain proper clinical measurements',
    '',
  ];

  warningText.forEach(line => {
    pdf.text(line, centerX, yPos, { align: 'center' });
    yPos += 7;
  });

  // Footer box
  pdf.setFillColor(254, 243, 199); // Yellow background
  pdf.roundedRect(margin, yPos, pageWidth - margin * 2, 35, 3, 3, 'F');

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  yPos += 10;
  pdf.text('Medical Disclaimer:', centerX, yPos, { align: 'center' });
  yPos += 7;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  const disclaimerNote = pdf.splitTextToSize(
    'This software is not FDA-approved for diagnostic use. It does not replace ' +
    'professional medical judgment. Always seek the advice of qualified health ' +
    'providers with any questions regarding medical conditions or treatment.',
    pageWidth - margin * 2 - 10
  );

  disclaimerNote.forEach((line: string) => {
    pdf.text(line, centerX, yPos, { align: 'center' });
    yPos += 5;
  });
}

/**
 * Generate a demo doctor report with prominent disclaimers
 */
export async function generateDoctorReport(data: ReportData): Promise<Blob> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;

  // Page 1: Full disclaimer
  addDisclaimerPage(pdf);

  // Page 2: Report content
  pdf.addPage();
  addDemoWatermark(pdf);

  let yPos = margin;

  // Demo badge
  pdf.setFillColor(249, 115, 22); // Orange
  pdf.roundedRect(pageWidth - 70, 10, 50, 12, 2, 2, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DEMO SAMPLE', pageWidth - 45, 17, { align: 'center' });

  // Header
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Sample Comparison Report', margin, yPos);
  yPos += 8;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPos);
  yPos += 15;

  // Patient Info (sample)
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Sample Patient Information', margin, yPos);
  yPos += 7;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Name: ${data.patient.name} (Demo)`, margin + 3, yPos);
  yPos += 6;
  pdf.text(`ID: ${data.patient.patientId}`, margin + 3, yPos);
  yPos += 15;

  // Comparison Period
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Comparison Period', margin, yPos);
  yPos += 7;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Baseline: ${data.baselineDate}`, margin + 3, yPos);
  yPos += 6;
  pdf.text(`Current: ${data.currentDate}`, margin + 3, yPos);
  yPos += 15;

  // Bone Health Score
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Bone Health Score (Demo)', margin, yPos);
  yPos += 7;

  pdf.setFontSize(24);
  pdf.setFillColor(59, 130, 246);
  pdf.text(`${data.analysis.health_score.toFixed(1)}/10`, margin + 3, yPos);

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const trend = data.analysis.score_change < 0 ? '↓' : data.analysis.score_change > 0 ? '↑' : '→';
  pdf.text(`${trend} ${Math.abs(data.analysis.score_change).toFixed(1)} from baseline`, margin + 40, yPos);
  yPos += 15;

  // Concern Level
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Concern Level', margin, yPos);
  yPos += 7;

  const concernColor = data.analysis.concern_level === 'high'
    ? [239, 68, 68]
    : data.analysis.concern_level === 'medium'
    ? [251, 191, 36]
    : [34, 197, 94];

  pdf.setFillColor(concernColor[0], concernColor[1], concernColor[2]);
  pdf.roundedRect(margin + 3, yPos - 5, 40, 8, 2, 2, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text(data.analysis.concern_level.toUpperCase(), margin + 23, yPos, { align: 'center' });
  pdf.setTextColor(0, 0, 0);
  yPos += 15;

  // Summary
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Summary', margin, yPos);
  yPos += 7;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const summaryLines = pdf.splitTextToSize(data.analysis.overall_summary, pageWidth - margin * 2);
  summaryLines.forEach((line: string) => {
    if (yPos > pageHeight - 40) {
      pdf.addPage();
      addDemoWatermark(pdf);
      yPos = margin;
    }
    pdf.text(line, margin + 3, yPos);
    yPos += 5;
  });
  yPos += 10;

  // Observed Changes
  if (yPos > pageHeight - 60) {
    pdf.addPage();
    addDemoWatermark(pdf);
    yPos = margin;
  }

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Observed Changes (Sample Data)', margin, yPos);
  yPos += 7;

  pdf.setFontSize(10);
  data.analysis.indicators.forEach((indicator) => {
    if (yPos > pageHeight - 35) {
      pdf.addPage();
      addDemoWatermark(pdf);
      yPos = margin;
    }

    pdf.setFont('helvetica', 'bold');
    pdf.text(`• ${indicator.tooth_region}`, margin + 3, yPos);
    yPos += 5;

    pdf.setFont('helvetica', 'normal');
    pdf.text(`  ${indicator.description}`, margin + 5, yPos);
    yPos += 5;

    pdf.text(`  Level: ${indicator.change_level} | Priority: ${indicator.priority}`, margin + 5, yPos);
    yPos += 8;
  });

  // Discussion Points
  if (yPos > pageHeight - 60) {
    pdf.addPage();
    addDemoWatermark(pdf);
    yPos = margin;
  }

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Discussion Points', margin, yPos);
  yPos += 7;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  data.analysis.discussion_points.forEach((point, index) => {
    if (yPos > pageHeight - 30) {
      pdf.addPage();
      addDemoWatermark(pdf);
      yPos = margin;
    }
    pdf.text(`${index + 1}. ${point}`, margin + 3, yPos);
    yPos += 6;
  });

  // Footer disclaimer on every page
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(220, 38, 38);
    pdf.setFont('helvetica', 'bold');
    pdf.text(
      'DEMO REPORT - NOT FOR CLINICAL USE',
      pageWidth / 2,
      pageHeight - 5,
      { align: 'center' }
    );
  }

  return pdf.output('blob');
}

/**
 * Generate a patient-friendly demo report
 */
export async function generatePatientReport(data: ReportData): Promise<Blob> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;

  // Page 1: Full disclaimer
  addDisclaimerPage(pdf);

  // Page 2: Simplified report
  pdf.addPage();
  addDemoWatermark(pdf);

  let yPos = margin;

  // Demo badge
  pdf.setFillColor(249, 115, 22);
  pdf.roundedRect(pageWidth - 70, 10, 50, 12, 2, 2, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DEMO SAMPLE', pageWidth - 45, 17, { align: 'center' });

  // Title
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Your Oral Health Snapshot', pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'italic');
  pdf.text('(Sample Report for Demonstration)', pageWidth / 2, yPos, { align: 'center' });
  yPos += 20;

  // Friendly greeting
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Hello ${data.patient.name.split(' ')[0]},`, margin, yPos);
  yPos += 10;

  const intro = `This sample report shows how we track changes in your oral health over time. ` +
    `Remember, this is demonstration data and should not be used for actual health decisions.`;
  const introLines = pdf.splitTextToSize(intro, pageWidth - margin * 2);
  introLines.forEach((line: string) => {
    pdf.text(line, margin, yPos);
    yPos += 6;
  });
  yPos += 10;

  // Score visualization
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Your Health Score', margin, yPos);
  yPos += 10;

  const scoreWidth = 100;
  const scoreHeight = 30;
  const scoreX = (pageWidth - scoreWidth) / 2;

  // Score box
  pdf.setFillColor(59, 130, 246);
  pdf.roundedRect(scoreX, yPos, scoreWidth, scoreHeight, 5, 5, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(32);
  pdf.setFont('helvetica', 'bold');
  pdf.text(
    `${data.analysis.health_score.toFixed(1)}/10`,
    scoreX + scoreWidth / 2,
    yPos + scoreHeight / 2 + 5,
    { align: 'center' }
  );

  pdf.setTextColor(0, 0, 0);
  yPos += scoreHeight + 15;

  // What this means
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('What Should You Do?', margin, yPos);
  yPos += 8;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  const actionItems = [
    'Schedule a checkup with your dentist',
    'Discuss the changes shown in your X-rays',
    'Ask about preventive care options',
    'Follow your dentist\'s recommendations',
    'Maintain good oral hygiene habits',
  ];

  actionItems.forEach((item) => {
    pdf.text(`☑ ${item}`, margin + 5, yPos);
    yPos += 8;
  });
  yPos += 10;

  // Important reminder
  pdf.setFillColor(254, 243, 199);
  pdf.roundedRect(margin, yPos, pageWidth - margin * 2, 30, 3, 3, 'F');

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('💡 Important Reminder', margin + 5, yPos + 10);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  const reminder = pdf.splitTextToSize(
    'This is a sample report for demonstration purposes. For real health advice, ' +
    'always consult with your dental professional. Only they can provide accurate ' +
    'diagnosis and treatment recommendations.',
    pageWidth - margin * 2 - 10
  );

  let reminderY = yPos + 17;
  reminder.forEach((line: string) => {
    pdf.text(line, margin + 5, reminderY);
    reminderY += 4;
  });

  // Footer
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(220, 38, 38);
    pdf.setFont('helvetica', 'bold');
    pdf.text(
      'DEMO REPORT - NOT FOR CLINICAL USE',
      pageWidth / 2,
      pageHeight - 5,
      { align: 'center' }
    );
  }

  return pdf.output('blob');
}

/**
 * Download a PDF file
 */
export function downloadPDF(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
