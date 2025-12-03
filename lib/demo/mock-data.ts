import { PeriodontalMeasurementEntry } from "@/lib/types/clinical";

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
    firstName: 'Sarah',
    lastName: 'Johnson',
    dateOfBirth: '1987-04-12',
    email: 'sarah.johnson@example.com',
    phone: '(555) 201-8845',
    isSmoker: false,
    hasDiabetes: false,
  },
  {
    id: 'demo-002',
    firstName: 'Michael',
    lastName: 'Chen',
    dateOfBirth: '1983-09-03',
    email: 'michael.chen@example.com',
    phone: '(555) 234-5678',
    isSmoker: false,
    hasDiabetes: false,
  },
  {
    id: 'demo-003',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    dateOfBirth: '1990-01-25',
    email: 'emily.rodriguez@example.com',
    phone: '(555) 345-6789',
    isSmoker: true,
    hasDiabetes: false,
  },
  {
    id: 'demo-004',
    firstName: 'David',
    lastName: 'Kim',
    dateOfBirth: '1992-06-18',
    email: 'david.kim@example.com',
    phone: '(555) 402-9981',
    isSmoker: false,
    hasDiabetes: false,
  },
  {
    id: 'demo-005',
    firstName: 'Lisa',
    lastName: 'Wang',
    dateOfBirth: '1989-02-07',
    email: 'lisa.wang@example.com',
    phone: '(555) 553-1100',
    isSmoker: false,
    hasDiabetes: false,
  },
  {
    id: 'demo-006',
    firstName: 'Robert',
    lastName: 'Zhang',
    dateOfBirth: '1978-10-09',
    email: 'robert.zhang@example.com',
    phone: '(555) 661-8024',
    isSmoker: false,
    hasDiabetes: true,
  },
  {
    id: 'demo-007',
    firstName: 'Jennifer',
    lastName: 'Liu',
    dateOfBirth: '1985-12-14',
    email: 'jennifer.liu@example.com',
    phone: '(555) 744-2210',
    isSmoker: false,
    hasDiabetes: false,
  },
  {
    id: 'demo-008',
    firstName: 'Anna',
    lastName: 'Wu',
    dateOfBirth: '1979-08-21',
    email: 'anna.wu@example.com',
    phone: '(555) 932-4477',
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
  // Sarah Johnson X-rays (periapical views from 2 visits)
  {
    id: 'xray-001',
    visitId: 'visit-001',
    imageUrl: 'https://placehold.co/800x600/1e40af/ffffff?text=Sarah+Johnson%0AJune+2024%0APeriapical',
    type: 'periapical',
    uploadedAt: new Date('2024-06-15'),
  },
  {
    id: 'xray-002',
    visitId: 'visit-002',
    imageUrl: 'https://placehold.co/800x600/dc2626/ffffff?text=Sarah+Johnson%0ANov+2024%0APeriapical',
    type: 'periapical',
    uploadedAt: new Date('2024-11-15'),
  },
  // Michael Chen X-rays (bitewing_right views from 2 visits)
  {
    id: 'xray-003',
    visitId: 'visit-003',
    imageUrl: 'https://placehold.co/800x600/059669/ffffff?text=Michael+Chen%0AMay+2024%0ABitewing+Right',
    type: 'bitewing_right',
    uploadedAt: new Date('2024-05-20'),
  },
  {
    id: 'xray-004',
    visitId: 'visit-004',
    imageUrl: 'https://placehold.co/800x600/7c3aed/ffffff?text=Michael+Chen%0AOct+2024%0ABitewing+Right',
    type: 'bitewing_right',
    uploadedAt: new Date('2024-10-20'),
  },
  // Emily Rodriguez X-rays (bitewing_left views from 2 visits)
  {
    id: 'xray-005',
    visitId: 'visit-005',
    imageUrl: 'https://placehold.co/800x600/f59e0b/ffffff?text=Emily+Rodriguez%0AJuly+2024%0ABitewing+Left',
    type: 'bitewing_left',
    uploadedAt: new Date('2024-07-10'),
  },
  {
    id: 'xray-006',
    visitId: 'visit-006',
    imageUrl: 'https://placehold.co/800x600/06b6d4/ffffff?text=Emily+Rodriguez%0ADec+2024%0ABitewing+Left',
    type: 'bitewing_left',
    uploadedAt: new Date('2024-12-10'),
  },
];

const createChart = (
  entries: Array<[
    string,
    string,
    number,
    number,
    boolean,
    PeriodontalMeasurementEntry['priority']
  ]>
): PeriodontalMeasurementEntry[] =>
  entries.map(([tooth, surface, pocketDepth, attachmentLoss, bleeding, priority]) => ({
    tooth,
    surface,
    pocket_depth: pocketDepth,
    attachment_loss: attachmentLoss,
    bleeding,
    priority,
  }));

export const DEMO_PERIODONTAL_CHARTS: Record<string, PeriodontalMeasurementEntry[]> = {
  default: createChart([
    ['14', 'MB', 6, 4, true, 'attention'],
    ['24', 'DB', 5, 3, false, 'routine'],
    ['36', 'Buccal', 4, 2, false, 'routine'],
  ]),
  'visit-001': createChart([
    ['14', 'MB', 8, 6, true, 'urgent'],
    ['14', 'DL', 6, 4, true, 'attention'],
    ['15', 'MB', 5, 3, false, 'routine'],
  ]),
  'visit-002': createChart([
    ['14', 'MB', 6, 4, true, 'attention'],
    ['14', 'DL', 5, 3, false, 'routine'],
    ['16', 'ML', 4, 2, false, 'routine'],
  ]),
  'visit-003': createChart([
    ['26', 'MB', 7, 5, true, 'urgent'],
    ['25', 'DB', 6, 4, true, 'attention'],
    ['24', 'MB', 5, 3, false, 'routine'],
  ]),
  'visit-004': createChart([
    ['26', 'MB', 5, 3, false, 'routine'],
    ['25', 'DB', 5, 3, false, 'routine'],
    ['24', 'MB', 4, 2, false, 'routine'],
  ]),
  'visit-005': createChart([
    ['32', 'Lingual', 6, 4, true, 'attention'],
    ['31', 'Buccal', 5, 3, false, 'routine'],
    ['33', 'Lingual', 4, 2, false, 'routine'],
  ]),
  'visit-006': createChart([
    ['32', 'Lingual', 4, 2, false, 'routine'],
    ['31', 'Buccal', 4, 2, false, 'routine'],
    ['33', 'Lingual', 3, 1, false, 'routine'],
  ]),
};

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

export function getDemoPeriodontalChartByVisitId(visitId: string) {
  return DEMO_PERIODONTAL_CHARTS[visitId] || DEMO_PERIODONTAL_CHARTS.default;
}
