/**
 * Demo Data Seed Script
 * Run this script to populate the database with sample data for demonstration
 *
 * Usage:
 * node --loader ts-node/esm scripts/seed-demo-data.ts
 * or
 * tsx scripts/seed-demo-data.ts
 */

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const DEMO_CLINIC_ID = '00000000-0000-0000-0000-000000000001';

// Demo patients
const demoPatients = [
  {
    patient_id: 'JS-001',
    first_name: 'John',
    last_name: 'Smith',
    date_of_birth: '1975-03-15',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    is_smoker: true,
    has_diabetes: false,
  },
  {
    patient_id: 'EM-002',
    first_name: 'Emily',
    last_name: 'Martinez',
    date_of_birth: '1982-07-22',
    email: 'emily.martinez@example.com',
    phone: '(555) 234-5678',
    is_smoker: false,
    has_diabetes: true,
  },
  {
    patient_id: 'MW-003',
    first_name: 'Michael',
    last_name: 'Wilson',
    date_of_birth: '1990-11-08',
    email: 'michael.wilson@example.com',
    phone: '(555) 345-6789',
    is_smoker: false,
    has_diabetes: false,
  },
  {
    patient_id: 'ST-004',
    first_name: 'Sarah',
    last_name: 'Taylor',
    date_of_birth: '1968-05-30',
    email: 'sarah.taylor@example.com',
    phone: '(555) 456-7890',
    is_smoker: true,
    has_diabetes: true,
  },
  {
    patient_id: 'DB-005',
    first_name: 'David',
    last_name: 'Brown',
    date_of_birth: '1995-09-12',
    email: 'david.brown@example.com',
    phone: '(555) 567-8901',
    is_smoker: false,
    has_diabetes: false,
  },
];

// Demo visits for each patient
const generateVisits = (patientId: string, count: number) => {
  const visits = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const monthsAgo = (count - i - 1) * 6; // 6 months apart
    const visitDate = new Date(today);
    visitDate.setMonth(visitDate.getMonth() - monthsAgo);

    visits.push({
      patient_id: patientId,
      visit_date: visitDate.toISOString().split('T')[0],
      visit_type: i === 0 ? 'initial_consultation' : i === count - 1 ? 'follow_up' : 'regular_checkup',
      notes: `${i === 0 ? 'Initial assessment' : i === count - 1 ? 'Follow-up examination' : 'Regular checkup'} - Patient ${i === count - 1 ? 'showing' : 'reported'} ${i % 2 === 0 ? 'good' : 'some'} oral hygiene.`,
    });
  }

  return visits;
};

async function seedDemoData() {
  console.log('🌱 Starting demo data seed...\n');

  try {
    // 1. Create demo clinic if it doesn't exist
    console.log('📋 Creating demo clinic...');
    const { data: existingClinic } = await supabase
      .from('clinics')
      .select('id')
      .eq('id', DEMO_CLINIC_ID)
      .single();

    if (!existingClinic) {
      const { error: clinicError } = await supabase.from('clinics').insert({
        id: DEMO_CLINIC_ID,
        name: 'Demo Dental Clinic',
        address: '123 Main Street, Medical District',
        phone: '(555) 100-2000',
        email: 'info@democlinic.com',
      });

      if (clinicError) {
        console.error('❌ Error creating clinic:', clinicError);
        return;
      }
      console.log('✅ Demo clinic created\n');
    } else {
      console.log('✅ Demo clinic already exists\n');
    }

    // 2. Create demo patients
    console.log('👥 Creating demo patients...');
    const createdPatients = [];

    for (const patient of demoPatients) {
      const { data, error } = await supabase
        .from('patients')
        .insert({
          clinic_id: DEMO_CLINIC_ID,
          ...patient,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          // Patient already exists, fetch it
          const { data: existing } = await supabase
            .from('patients')
            .select('*')
            .eq('clinic_id', DEMO_CLINIC_ID)
            .eq('patient_id', patient.patient_id)
            .single();

          if (existing) {
            createdPatients.push(existing);
            console.log(`  ℹ️  Patient ${patient.first_name} ${patient.last_name} already exists`);
          }
        } else {
          console.error(`❌ Error creating patient ${patient.first_name}:`, error);
        }
      } else {
        createdPatients.push(data);
        console.log(`  ✅ Created patient: ${patient.first_name} ${patient.last_name}`);
      }
    }
    console.log(`\n✅ ${createdPatients.length} patients ready\n`);

    // 3. Create visits for each patient
    console.log('📅 Creating visits...');
    const createdVisits = [];

    for (const patient of createdPatients) {
      const visitCount = Math.floor(Math.random() * 3) + 2; // 2-4 visits per patient
      const visits = generateVisits(patient.id, visitCount);

      for (const visit of visits) {
        const { data, error } = await supabase
          .from('visits')
          .insert(visit)
          .select()
          .single();

        if (error) {
          console.error(`❌ Error creating visit for ${patient.first_name}:`, error);
        } else {
          createdVisits.push(data);
          console.log(`  ✅ Created visit for ${patient.first_name} on ${visit.visit_date}`);
        }
      }
    }
    console.log(`\n✅ ${createdVisits.length} visits created\n`);

    // 4. Summary
    console.log('📊 Demo Data Summary:');
    console.log(`   Clinic: 1`);
    console.log(`   Patients: ${createdPatients.length}`);
    console.log(`   Visits: ${createdVisits.length}`);
    console.log('\n✅ Demo data seeding complete!\n');
    console.log('💡 Note: X-ray images need to be uploaded manually through the UI');
    console.log('   You can use sample dental X-ray images from online sources.\n');

  } catch (error) {
    console.error('❌ Fatal error during seeding:', error);
  }
}

// Run the seed function
seedDemoData();
