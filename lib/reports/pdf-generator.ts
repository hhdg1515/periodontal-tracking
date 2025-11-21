import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
 * Generate a professional PDF report for doctors
 * Includes detailed analysis, measurements, and recommendations
 */
export async function generateDoctorReport(data: ReportData): Promise<Blob> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yPos = margin;

  // Header
  pdf.setFillColor(37, 99, 235); // Blue
  pdf.rect(0, 0, pageWidth, 30, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text(data.clinicName || 'PerioTrack AI', margin, 20);

  // Reset text color
  pdf.setTextColor(0, 0, 0);
  yPos = 45;

  // Report Title
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Periodontal Analysis Report', margin, yPos);
  yPos += 10;

  // Report Date
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Report Date: ${new Date().toLocaleDateString()}`, margin, yPos);
  yPos += 15;

  // Patient Information Section
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Patient Information', margin, yPos);
  yPos += 8;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Name: ${data.patient.name}`, margin + 5, yPos);
  yPos += 6;
  pdf.text(`Patient ID: ${data.patient.patientId}`, margin + 5, yPos);
  yPos += 6;
  pdf.text(`Date of Birth: ${data.patient.dateOfBirth}`, margin + 5, yPos);
  yPos += 6;
  if (data.patient.phone) {
    pdf.text(`Phone: ${data.patient.phone}`, margin + 5, yPos);
    yPos += 6;
  }
  yPos += 10;

  // Analysis Period
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Analysis Period', margin, yPos);
  yPos += 8;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Baseline X-ray: ${data.baselineDate}`, margin + 5, yPos);
  yPos += 6;
  pdf.text(`Current X-ray: ${data.currentDate}`, margin + 5, yPos);
  yPos += 15;

  // Overall Assessment
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Overall Assessment', margin, yPos);
  yPos += 8;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const assessmentLines = pdf.splitTextToSize(
    data.analysis.overall_assessment,
    pageWidth - margin * 2
  );
  pdf.text(assessmentLines, margin + 5, yPos);
  yPos += assessmentLines.length * 6 + 10;

  // Risk Level Box
  const riskColor =
    data.analysis.risk_level === 'high'
      ? [239, 68, 68]
      : data.analysis.risk_level === 'medium'
      ? [251, 191, 36]
      : [34, 197, 94];

  pdf.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
  pdf.rect(margin, yPos, 50, 12, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Risk Level: ${data.analysis.risk_level.toUpperCase()}`, margin + 5, yPos + 8);
  pdf.setTextColor(0, 0, 0);

  pdf.setFont('helvetica', 'normal');
  pdf.text(
    `Average Bone Loss: ${data.analysis.average_bone_loss.toFixed(1)}mm`,
    margin + 60,
    yPos + 8
  );
  yPos += 25;

  // Detailed Findings
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Detailed Findings', margin, yPos);
  yPos += 8;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  data.analysis.annotations.forEach((annotation, index) => {
    // Check if we need a new page
    if (yPos > pageHeight - 40) {
      pdf.addPage();
      yPos = margin;
    }

    const severityColor =
      annotation.severity === 'severe'
        ? [239, 68, 68]
        : annotation.severity === 'moderate'
        ? [249, 115, 22]
        : [251, 191, 36];

    // Tooth number and severity badge
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Tooth #${annotation.tooth_number}`, margin + 5, yPos);

    pdf.setFillColor(severityColor[0], severityColor[1], severityColor[2]);
    pdf.rect(margin + 35, yPos - 4, 20, 6, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.text(annotation.severity.toUpperCase(), margin + 37, yPos);
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);

    // Bone loss measurement
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${annotation.bone_loss_mm}mm`, margin + 60, yPos);
    pdf.setFont('helvetica', 'normal');
    yPos += 6;

    // Description
    const descLines = pdf.splitTextToSize(annotation.description, pageWidth - margin * 2 - 10);
    pdf.text(descLines, margin + 10, yPos);
    yPos += descLines.length * 5 + 8;
  });

  // Recommendations
  if (yPos > pageHeight - 80) {
    pdf.addPage();
    yPos = margin;
  }

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Treatment Recommendations', margin, yPos);
  yPos += 8;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  data.analysis.recommendations.forEach((rec, index) => {
    if (yPos > pageHeight - 30) {
      pdf.addPage();
      yPos = margin;
    }

    pdf.setFont('helvetica', 'bold');
    pdf.text(`${index + 1}.`, margin + 5, yPos);
    pdf.setFont('helvetica', 'normal');
    const recLines = pdf.splitTextToSize(rec, pageWidth - margin * 2 - 15);
    pdf.text(recLines, margin + 12, yPos);
    yPos += recLines.length * 6 + 3;
  });

  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(128, 128, 128);
  pdf.text(
    `Generated by PerioTrack AI - ${new Date().toLocaleString()}`,
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

  if (data.doctorName) {
    pdf.text(`Dr. ${data.doctorName}`, margin, pageHeight - 10);
  }

  return pdf.output('blob');
}

/**
 * Generate a patient-friendly PDF report
 * Simplified language, visual aids, and actionable advice
 */
export async function generatePatientReport(data: ReportData): Promise<Blob> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yPos = margin;

  // Header with friendly design
  pdf.setFillColor(59, 130, 246); // Lighter blue
  pdf.rect(0, 0, pageWidth, 35, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Your Gum Health Report', pageWidth / 2, 22, { align: 'center' });

  pdf.setTextColor(0, 0, 0);
  yPos = 50;

  // Friendly greeting
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Hello ${data.patient.name.split(' ')[0]},`, margin, yPos);
  yPos += 10;

  const intro = `This report shows the progress of your gum health between ${data.baselineDate} and ${data.currentDate}. We've made it easy to understand what's happening and what you can do to improve.`;
  const introLines = pdf.splitTextToSize(intro, pageWidth - margin * 2);
  pdf.text(introLines, margin, yPos);
  yPos += introLines.length * 6 + 15;

  // Risk Level - Visual indicator
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Your Risk Level', margin, yPos);
  yPos += 10;

  const riskColor =
    data.analysis.risk_level === 'high'
      ? [239, 68, 68]
      : data.analysis.risk_level === 'medium'
      ? [251, 191, 36]
      : [34, 197, 94];

  const riskText =
    data.analysis.risk_level === 'high'
      ? 'Needs Attention'
      : data.analysis.risk_level === 'medium'
      ? 'Monitor Closely'
      : 'Looking Good';

  pdf.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
  pdf.roundedRect(margin, yPos, 80, 15, 3, 3, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text(riskText, margin + 40, yPos + 10, { align: 'center' });
  pdf.setTextColor(0, 0, 0);
  yPos += 25;

  // What we found
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('What We Found', margin, yPos);
  yPos += 10;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  const findings = `We looked at ${data.analysis.annotations.length} areas and found an average change of ${data.analysis.average_bone_loss.toFixed(1)}mm. This means your gum health needs some attention to prevent further issues.`;
  const findingsLines = pdf.splitTextToSize(findings, pageWidth - margin * 2);
  pdf.text(findingsLines, margin, yPos);
  yPos += findingsLines.length * 6 + 15;

  // Affected teeth in simple language
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Areas That Need Care', margin, yPos);
  yPos += 8;

  pdf.setFontSize(10);
  data.analysis.annotations.forEach((annotation) => {
    if (yPos > pageHeight - 40) {
      pdf.addPage();
      yPos = margin;
    }

    pdf.setFont('helvetica', 'bold');
    pdf.text(`• Tooth #${annotation.tooth_number}`, margin + 5, yPos);
    yPos += 6;

    pdf.setFont('helvetica', 'normal');
    const simpleDesc = annotation.description.replace(/technical terms/gi, 'gum changes');
    const descLines = pdf.splitTextToSize(simpleDesc, pageWidth - margin * 2 - 10);
    pdf.text(descLines, margin + 10, yPos);
    yPos += descLines.length * 5 + 5;
  });
  yPos += 10;

  // What you can do - Action items
  if (yPos > pageHeight - 100) {
    pdf.addPage();
    yPos = margin;
  }

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('What You Can Do', margin, yPos);
  yPos += 10;

  const actionItems = [
    'Brush twice daily for 2 minutes with a soft-bristled toothbrush',
    'Floss or use interdental brushes once a day',
    'Use an antibacterial mouthwash',
    'Schedule regular dental cleanings every 3-6 months',
    'Avoid smoking and limit sugary foods',
  ];

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  actionItems.forEach((item, index) => {
    if (yPos > pageHeight - 30) {
      pdf.addPage();
      yPos = margin;
    }

    // Checkbox
    pdf.rect(margin + 5, yPos - 3, 4, 4, 'S');
    pdf.text(item, margin + 12, yPos);
    yPos += 8;
  });

  // Encouraging footer
  yPos += 10;
  if (yPos > pageHeight - 40) {
    pdf.addPage();
    yPos = margin;
  }

  pdf.setFillColor(240, 253, 244); // Light green background
  pdf.roundedRect(margin, yPos, pageWidth - margin * 2, 25, 3, 3, 'F');
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('💪 You\'ve Got This!', margin + 5, yPos + 8);
  pdf.setFont('helvetica', 'normal');
  const encouragement = 'With consistent care and regular checkups, you can improve your gum health. We\'re here to support you every step of the way!';
  const encLines = pdf.splitTextToSize(encouragement, pageWidth - margin * 2 - 10);
  pdf.text(encLines, margin + 5, yPos + 14);

  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(128, 128, 128);
  pdf.text(
    `Report generated on ${new Date().toLocaleDateString()}`,
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

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
