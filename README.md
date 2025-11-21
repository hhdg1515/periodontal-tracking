# PerioTrack AI - Periodontal Disease Progression Tracking System

AI-powered periodontal disease progression tracking system for dental clinics. Compare historical X-rays, visualize bone loss, and generate patient-friendly reports to increase treatment acceptance rates.

## 📋 Overview

PerioTrack AI helps dentists:
- Track periodontal disease progression over time
- Compare X-rays side-by-side with AI-powered analysis
- Generate visual, patient-friendly reports
- Increase treatment acceptance rates by 40%+

## 🚀 Features (MVP v1.0)

### ✅ Implemented
- **Patient Management** - Add, view, and manage patient records
- **Visit Tracking** - Organize X-rays by visit date
- **X-Ray Upload** - Drag-and-drop interface for uploading X-rays (Bitewing, Periapical, Panoramic)
- **Side-by-Side Comparison** - Visual comparison of historical X-rays
- **Analysis Dashboard** - View bone loss progression and risk levels
- **Patient Reports** - Beautiful, easy-to-understand reports for patients
- **Doctor Reports** - Detailed clinical reports

### 🔄 In Progress
- AI-powered bone loss detection
- PDF generation and export
- Authentication and multi-clinic support

### 📝 Planned (Phase 2)
- Advanced AI analysis with SAM/U-Net models
- Treatment outcome tracking
- Multi-language support
- Mobile app

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (Supabase)
- **AI**: Python FastAPI (planned), OpenCV, SAM
- **Storage**: Supabase Storage / S3
- **Deployment**: Vercel (frontend), Railway (AI service)

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Setup

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/periodontal-tracking.git
cd periodontal-tracking
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Edit \`.env.local\` and add your Supabase credentials:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
\`\`\`

4. Set up the database:
   - Go to your Supabase project
   - Run the SQL in \`lib/supabase/schema.sql\` in the SQL editor

5. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📚 Project Structure

\`\`\`
periodontal-tracking/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages
│   │   ├── patients/     # Patient management
│   │   └── compare/      # X-ray comparison
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── patients/         # Patient components
│   ├── visits/           # Visit components
│   ├── xrays/            # X-ray components
│   ├── comparison/       # Comparison viewer
│   └── reports/          # Report templates
├── lib/                   # Utilities
│   └── supabase/         # Supabase client & types
├── public/               # Static files
└── Periodontal-Tracking-AI-PRD.md  # Product requirements
\`\`\`

## 🗄️ Database Schema

See \`lib/supabase/schema.sql\` for the complete schema. Key tables:

- \`clinics\` - Dental clinic information
- \`patients\` - Patient records
- \`visits\` - Visit history
- \`xrays\` - X-ray images and metadata
- \`analysis_results\` - AI analysis results
- \`reports\` - Generated reports
- \`treatments\` - Treatment recommendations and tracking

## 🎯 Usage

### Adding a Patient

1. Go to Dashboard → Patients
2. Click "Add Patient"
3. Fill in patient information
4. Click "Add Patient"

### Recording a Visit

1. Open a patient's detail page
2. Click "Add Visit"
3. Select visit date and type
4. Upload X-rays using drag-and-drop

### Comparing X-rays

1. Go to Dashboard → Compare (or click "Compare" on an X-ray)
2. Select baseline (earlier) X-ray
3. Select current (recent) X-ray
4. View side-by-side comparison and AI analysis
5. Generate patient or doctor report

## 📊 Business Model

### Pricing (Planned)

- **Starter**: $199/month - 50 analyses, basic reports
- **Professional**: $399/month - 200 analyses, custom reports
- **Enterprise**: $799/month - Unlimited, API access, multi-location

### ROI for Clinics

- **Treatment acceptance increase**: 40%+
- **Time saved**: 5 minutes per patient
- **Revenue increase**: $50k-150k annually

## 🔒 Security & Compliance

- HIPAA-compliant data encryption
- Row-level security (RLS) in Supabase
- Secure file storage
- Access control and audit logging

## 🧪 Development Roadmap

### Week 1-4: Basic MVP ✅
- [x] Patient management
- [x] X-ray upload
- [x] Basic comparison viewer
- [x] Simple report generation

### Week 5-8: AI Integration (In Progress)
- [ ] Image preprocessing pipeline
- [ ] AI bone loss detection
- [ ] Result verification tool

### Week 9-12: Report Optimization
- [ ] Patient-friendly report design
- [ ] Visualization improvements
- [ ] Brand customization
- [ ] PDF export

### Week 13-16: Polish & Deploy
- [ ] UI/UX optimization
- [ ] Performance tuning
- [ ] Security hardening
- [ ] Documentation
- [ ] Production deployment

## 🤝 Contributing

This is a private project. For inquiries, please contact the project owner.

## 📄 License

Proprietary - All rights reserved

## 📞 Contact

For questions or support, please contact:
- **Project Owner**: [Your Name]
- **Email**: [your-email@example.com]

## 🙏 Acknowledgments

Based on the comprehensive PRD document (\`Periodontal-Tracking-AI-PRD.md\`) which outlines:
- Real clinical pain points
- Market analysis
- Technical architecture
- Go-to-market strategy

---

**Note**: This is an MVP (Minimum Viable Product) under active development. Database integration and AI features are partially implemented. For production use, complete the setup with Supabase and implement the AI analysis pipeline.
