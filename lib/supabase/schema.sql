-- PerioTrack AI Database Schema
-- Based on PRD specifications

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clinics table
CREATE TABLE clinics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  subscription_tier VARCHAR(50) DEFAULT 'starter',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Patients table
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id VARCHAR(100) NOT NULL, -- Clinic's own patient ID
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),

  -- Risk factors
  is_smoker BOOLEAN DEFAULT false,
  has_diabetes BOOLEAN DEFAULT false,

  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(clinic_id, patient_id)
);

-- Visits table
CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  visit_date DATE NOT NULL,
  visit_type VARCHAR(50) NOT NULL, -- 'initial', 'followup', 'post_treatment'
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- X-rays table
CREATE TABLE xrays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE,
  xray_type VARCHAR(50) NOT NULL, -- 'bitewing_right', 'bitewing_left', 'panoramic', 'periapical'
  file_url TEXT NOT NULL,
  upload_date TIMESTAMP DEFAULT NOW(),

  -- AI analysis status
  analysis_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'

  created_at TIMESTAMP DEFAULT NOW()
);

-- Analysis results table
CREATE TABLE analysis_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  xray_id UUID REFERENCES xrays(id) ON DELETE CASCADE,

  -- Comparison information
  baseline_xray_id UUID REFERENCES xrays(id),
  comparison_months INTEGER,

  -- Overall results
  total_teeth_analyzed INTEGER,
  worsening_count INTEGER,
  stable_count INTEGER,
  improving_count INTEGER,
  average_change DECIMAL(3,1), -- mm

  -- Detailed results (JSON)
  tooth_findings JSONB,
  /*
  Example structure:
  [
    {
      "tooth_number": 18,
      "baseline_loss": 2.1,
      "current_loss": 3.4,
      "change": 1.3,
      "severity": "moderate",
      "trend": "worsening"
    }
  ]
  */

  -- Recommendations
  recommendation TEXT,
  risk_level VARCHAR(20), -- 'low', 'medium', 'high'

  -- Predictions
  prediction_6_months JSONB,

  analyzed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reports table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis_id UUID REFERENCES analysis_results(id) ON DELETE CASCADE,
  report_type VARCHAR(50) NOT NULL, -- 'doctor', 'patient'
  pdf_url TEXT,
  generated_at TIMESTAMP DEFAULT NOW()
);

-- Treatments table
CREATE TABLE treatments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  recommended_date DATE NOT NULL,
  treatment_type VARCHAR(100) NOT NULL, -- 'srp', 'maintenance', 'surgery'
  status VARCHAR(50) NOT NULL, -- 'recommended', 'accepted', 'declined', 'completed'
  completed_date DATE,
  notes TEXT
);

-- Create indexes for better query performance
CREATE INDEX idx_patients_clinic_id ON patients(clinic_id);
CREATE INDEX idx_visits_patient_id ON visits(patient_id);
CREATE INDEX idx_xrays_visit_id ON xrays(visit_id);
CREATE INDEX idx_analysis_xray_id ON analysis_results(xray_id);
CREATE INDEX idx_reports_analysis_id ON reports(analysis_id);
CREATE INDEX idx_treatments_patient_id ON treatments(patient_id);

-- Row Level Security (RLS) policies
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE xrays ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;

-- Policies will be added based on authentication implementation
