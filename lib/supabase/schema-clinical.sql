-- =====================================================
-- Clinical Assessment Tables
-- Purpose: Record clinical findings for perio-endo evaluation
-- =====================================================

-- Clinical assessments table
CREATE TABLE IF NOT EXISTS clinical_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL,
  assessment_date TIMESTAMP DEFAULT NOW(),

  -- Symptoms (patient-reported)
  spontaneous_pain BOOLEAN DEFAULT false,
  thermal_sensitivity VARCHAR(20) CHECK (thermal_sensitivity IN ('none', 'mild', 'severe')),
  percussion_sensitivity VARCHAR(20) CHECK (percussion_sensitivity IN ('none', 'mild', 'severe')),
  palpation_tenderness BOOLEAN DEFAULT false,
  swelling BOOLEAN DEFAULT false,
  sinus_tract BOOLEAN DEFAULT false,

  -- Clinical tests performed
  pulp_vitality_cold VARCHAR(20) CHECK (pulp_vitality_cold IN ('positive', 'negative', 'delayed', 'not_tested')) DEFAULT 'not_tested',
  pulp_vitality_electric VARCHAR(20) CHECK (pulp_vitality_electric IN ('positive', 'negative', 'not_tested')) DEFAULT 'not_tested',
  percussion_test VARCHAR(20) CHECK (percussion_test IN ('normal', 'sensitive', 'painful', 'not_tested')) DEFAULT 'not_tested',
  mobility_grade VARCHAR(20) CHECK (mobility_grade IN ('normal', 'grade_1', 'grade_2', 'grade_3', 'not_tested')) DEFAULT 'not_tested',

  -- Periodontal measurements
  pocket_depth_max INTEGER, -- Maximum pocket depth in mm
  attachment_loss_max INTEGER, -- Maximum attachment loss in mm
  bleeding_on_probing BOOLEAN DEFAULT false,
  furcation_involvement VARCHAR(20) CHECK (furcation_involvement IN ('none', 'grade_1', 'grade_2', 'grade_3', 'not_assessed')) DEFAULT 'not_assessed',

  -- Clinical impression (doctor's judgment)
  perio_status VARCHAR(20) CHECK (perio_status IN ('healthy', 'gingivitis', 'mild', 'moderate', 'severe')),
  endo_concern VARCHAR(20) CHECK (endo_concern IN ('none', 'suspected', 'confirmed')),
  combined_lesion BOOLEAN DEFAULT false, -- Perio-endo lesion

  -- Follow-up needs
  requires_endo_evaluation BOOLEAN DEFAULT false,
  requires_perio_treatment BOOLEAN DEFAULT false,
  requires_specialist_referral BOOLEAN DEFAULT false,
  referral_specialty VARCHAR(50), -- 'endodontist', 'periodontist', 'oral_surgeon'

  -- Doctor's notes
  clinical_notes TEXT,
  differential_diagnosis TEXT,

  -- Metadata
  created_by UUID, -- Reference to users table (future)
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Treatment plans table
CREATE TABLE IF NOT EXISTS treatment_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID REFERENCES clinical_assessments(id) ON DELETE CASCADE NOT NULL,

  -- Immediate actions
  immediate_treatment TEXT,
  pain_management TEXT,
  antibiotics_prescribed BOOLEAN DEFAULT false,

  -- Planned procedures
  planned_procedures TEXT[],
  estimated_duration VARCHAR(50),

  -- Follow-up
  follow_up_weeks INTEGER,
  follow_up_notes TEXT,

  -- Status
  status VARCHAR(20) CHECK (status IN ('proposed', 'accepted', 'in_progress', 'completed', 'cancelled')) DEFAULT 'proposed',

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Clinical findings (for specific teeth/regions)
CREATE TABLE IF NOT EXISTS clinical_findings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID REFERENCES clinical_assessments(id) ON DELETE CASCADE NOT NULL,

  -- Tooth identification
  tooth_number VARCHAR(10), -- FDI notation
  tooth_region VARCHAR(100), -- e.g., "Upper right molar area"

  -- Specific findings
  finding_type VARCHAR(50), -- 'periapical_radiolucency', 'bone_loss', 'widened_pdl', etc.
  description TEXT,
  severity VARCHAR(20) CHECK (severity IN ('mild', 'moderate', 'severe')),

  -- Clinical significance
  requires_attention BOOLEAN DEFAULT false,
  suggested_tests TEXT[], -- Array of suggested clinical tests

  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_clinical_assessments_visit ON clinical_assessments(visit_id);
CREATE INDEX IF NOT EXISTS idx_treatment_plans_assessment ON treatment_plans(assessment_id);
CREATE INDEX IF NOT EXISTS idx_clinical_findings_assessment ON clinical_findings(assessment_id);
CREATE INDEX IF NOT EXISTS idx_clinical_assessments_date ON clinical_assessments(assessment_date);

-- Enable Row Level Security (RLS)
ALTER TABLE clinical_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_findings ENABLE ROW LEVEL SECURITY;

-- RLS Policies (for future multi-user support)
-- For now, allow all operations (will need to be restricted based on clinic/user)
CREATE POLICY "Allow all operations on clinical_assessments" ON clinical_assessments FOR ALL USING (true);
CREATE POLICY "Allow all operations on treatment_plans" ON treatment_plans FOR ALL USING (true);
CREATE POLICY "Allow all operations on clinical_findings" ON clinical_findings FOR ALL USING (true);
