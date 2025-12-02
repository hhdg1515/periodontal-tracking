/**
 * Demo Mock Data
 * Sample patients, visits, and X-rays for demonstration purposes
 * This data is used to showcase the application features without a database
 */

export interface DemoPatient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  isSmoker: boolean;
  hasDiabetes: boolean;
}

export interface DemoVisit {
  id: string;
  patientId: string;
  visitDate: Date;
  notes: string;
}

export interface DemoXRay {
  id: string;
  visitId: string;
  imageUrl: string;
  type: string; // Anatomical type: 'periapical', 'bitewing_right', 'bitewing_left', etc.
  uploadedAt: Date;
}

// Sample Patients
export const DEMO_PATIENTS: DemoPatient[] = [
  {
    id: 'demo-001',
    firstName: 'John',
    lastName: 'Smith',
    dateOfBirth: '1975-03-15',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    isSmoker: true,
    hasDiabetes: false,
  },
  {
    id: 'demo-002',
    firstName: 'Emily',
    lastName: 'Davis',
    dateOfBirth: '1982-07-22',
    email: 'emily.davis@example.com',
    phone: '(555) 234-5678',
    isSmoker: false,
    hasDiabetes: true,
  },
  {
    id: 'demo-003',
    firstName: 'Michael',
    lastName: 'Wilson',
    dateOfBirth: '1988-11-08',
    email: 'michael.wilson@example.com',
    phone: '(555) 345-6789',
    isSmoker: false,
    hasDiabetes: false,
  },
];

// Sample Visits (each patient has 2 visits at different times)
export const DEMO_VISITS: DemoVisit[] = [
  {
    id: 'visit-001',
    patientId: 'demo-001',
    visitDate: new Date('2024-06-15'),
    notes: 'Initial periodontal assessment. Moderate inflammation detected.',
  },
  {
    id: 'visit-002',
    patientId: 'demo-001',
    visitDate: new Date('2024-11-15'),
    notes: 'Follow-up after treatment. Significant improvement observed.',
  },
  {
    id: 'visit-003',
    patientId: 'demo-002',
    visitDate: new Date('2024-05-20'),
    notes: 'Routine checkup. Early stage periodontal disease.',
  },
  {
    id: 'visit-004',
    patientId: 'demo-002',
    visitDate: new Date('2024-10-20'),
    notes: 'Post-treatment evaluation. Stable condition.',
  },
  {
    id: 'visit-005',
    patientId: 'demo-003',
    visitDate: new Date('2024-07-10'),
    notes: 'New patient evaluation. Healthy periodontal status.',
  },
  {
    id: 'visit-006',
    patientId: 'demo-003',
    visitDate: new Date('2024-12-10'),
    notes: 'Maintenance visit. Continue current care regimen.',
  },
];

// Sample X-rays (2 per visit for comparison - same anatomical part at different times)
export const DEMO_XRAYS: DemoXRay[] = [
  // John Smith X-rays (periapical views from 2 visits)
  {
    id: 'xray-001',
    visitId: 'visit-001',
    imageUrl: 'https://placehold.co/800x600/1e40af/ffffff?text=John+Smith%0AJune+2024%0APeriapical',
    type: 'periapical',
    uploadedAt: new Date('2024-06-15'),
  },
  {
    id: 'xray-002',
    visitId: 'visit-002',
    imageUrl: 'https://placehold.co/800x600/dc2626/ffffff?text=John+Smith%0ANov+2024%0APeriapical',
    type: 'periapical',
    uploadedAt: new Date('2024-11-15'),
  },
  // Emily Davis X-rays (bitewing_right views from 2 visits)
  {
    id: 'xray-003',
    visitId: 'visit-003',
    imageUrl: 'https://placehold.co/800x600/059669/ffffff?text=Emily+Davis%0AMay+2024%0ABitewing+Right',
    type: 'bitewing_right',
    uploadedAt: new Date('2024-05-20'),
  },
  {
    id: 'xray-004',
    visitId: 'visit-004',
    imageUrl: 'https://placehold.co/800x600/7c3aed/ffffff?text=Emily+Davis%0AOct+2024%0ABitewing+Right',
    type: 'bitewing_right',
    uploadedAt: new Date('2024-10-20'),
  },
  // Michael Wilson X-rays (bitewing_left views from 2 visits)
  {
    id: 'xray-005',
    visitId: 'visit-005',
    imageUrl: 'https://placehold.co/800x600/f59e0b/ffffff?text=Michael+Wilson%0AJuly+2024%0ABitewing+Left',
    type: 'bitewing_left',
    uploadedAt: new Date('2024-07-10'),
  },
  {
    id: 'xray-006',
    visitId: 'visit-006',
    imageUrl: 'https://placehold.co/800x600/06b6d4/ffffff?text=Michael+Wilson%0ADec+2024%0ABitewing+Left',
    type: 'bitewing_left',
    uploadedAt: new Date('2024-12-10'),
  },
];

/**
 * Helper function to get patient by ID
 */
export function getDemoPatientById(id: string): DemoPatient | undefined {
  return DEMO_PATIENTS.find((p) => p.id === id);
}

/**
 * Helper function to get visits by patient ID
 */
export function getDemoVisitsByPatientId(patientId: string): DemoVisit[] {
  return DEMO_VISITS.filter((v) => v.patientId === patientId);
}

/**
 * Helper function to get X-rays by visit ID
 */
export function getDemoXRaysByVisitId(visitId: string): DemoXRay[] {
  return DEMO_XRAYS.filter((x) => x.visitId === visitId);
}

/**
 * Helper function to get patient and their latest visit X-rays for comparison
 */
export function getDemoPatientWithXRays(patientId: string) {
  const patient = getDemoPatientById(patientId);
  if (!patient) return null;

  const visits = getDemoVisitsByPatientId(patientId);
  const latestVisits = visits.slice(-2); // Get last 2 visits for comparison

  const xrays = latestVisits
    .flatMap((visit) => getDemoXRaysByVisitId(visit.id))
    .sort((a, b) => a.uploadedAt.getTime() - b.uploadedAt.getTime());

  return {
    patient,
    visits,
    xrays,
    baselineXRay: xrays.find((x) => x.type === 'baseline'),
    currentXRay: xrays.find((x) => x.type === 'current'),
  };
}
