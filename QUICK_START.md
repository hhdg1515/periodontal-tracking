# Quick Start Guide - PerioTrack AI Demo

## 🚀 Start the Application

```bash
npm run dev
```

**Note**: The dev server runs on port 3002 (or higher if busy)

Access the app at: **http://localhost:3002/dashboard**

---

## 📍 Key Pages

| Page | URL | Description |
|------|-----|-------------|
| **Dashboard** | `/dashboard` | Overview page |
| **Patients** | `/dashboard/patients` | Patient list (includes 3 sample patients) |
| **AI Demo** | `/dashboard/demo` | Main feature - X-ray analysis demo |
| **Analyses** | `/dashboard/analyses` | Analysis history |
| **Settings** | `/dashboard/settings` | App settings |

---

## ✨ Features

### 1. **View Sample Patients**
- Go to `/dashboard/patients`
- See 3 sample patients:
  - John Smith (Smoker)
  - Emily Davis (Diabetic)
  - Michael Wilson (Healthy)

### 2. **Add New Patients**
- Click the **"+ Add Patient"** button (top right, always visible)
- Fill in patient details
- New patients stored in browser localStorage
- Data persists after page refresh

### 3. **AI X-Ray Analysis** (Main Feature)
- Go to `/dashboard/demo`
- Select a sample patient from dropdown
- Click **"Run AI Analysis"** button
- View:
  - Health score (0-10)
  - Concern level
  - Areas of bone loss detected
  - Discussion points
- Download PDF reports (Doctor or Patient version)

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14.2.3 (React)
- **Database**: Mock data + localStorage (no Supabase)
- **Styling**: Tailwind CSS
- **UI Components**: Custom shadcn components
- **AI Analysis**: Mock analysis service (returns realistic data)
- **PDF Generation**: jsPDF library

---

## 📊 Sample Data

### Patients
```
demo-001: John Smith (DOB: 1975-03-15)
demo-002: Emily Davis (DOB: 1982-07-22)
demo-003: Michael Wilson (DOB: 1988-11-08)
```

### Visits & X-rays
Each patient has:
- 2 visits (spanning 6 months)
- 2 X-rays per visit (baseline + current)
- Baseline dates: June/May/July 2024
- Current dates: November/October/December 2024

---

## 💾 Data Storage

**Mock Patients**: Hardcoded in `/lib/demo/mock-data.ts`

**User-Added Patients**: Stored in browser localStorage at key `mock_patients`

```javascript
// Access added patients in browser console:
JSON.parse(localStorage.getItem('mock_patients'))

// Clear all user data:
localStorage.removeItem('mock_patients')
```

---

## 🎯 Demo Workflow

**Perfect for investor presentations:**

1. **Start**: Open http://localhost:3002/dashboard/demo
2. **Show Data**: Select different patients from dropdown
3. **Analyze**: Click "Run AI Analysis" button
4. **Results**: Show health score and detected areas
5. **Reports**: Generate PDF reports
6. **Navigate**: Show other pages via sidebar
7. **Add Patient**: Use "+ Add Patient" button to show form

**Total time**: ~5 minutes for impressive demo

---

## 🐛 Troubleshooting

### "Cannot find module" error
```bash
npm install
```

### Port already in use
- Dev server automatically tries ports 3000, 3001, 3002, etc.
- Check terminal output for actual port
- Don't need to change anything

### localStorage not working
- Check browser DevTools → Application → Local Storage
- Clear site data if needed: right-click site → Clear data
- Data is stored per domain, localhost:3002 is different from 3001

### Images not loading
- Using `placehold.co` placeholder images (no external dependencies)
- Works completely offline
- Images update based on selected patient

---

## 📝 File Structure

```
periodontal-tracking/
├── app/
│   └── dashboard/
│       ├── page.tsx              (Dashboard)
│       ├── layout.tsx            (Navigation & Add Patient button)
│       ├── demo/page.tsx         (AI Analysis demo)
│       ├── patients/page.tsx     (Patient list)
│       ├── analyses/page.tsx     (Analysis history)
│       └── settings/page.tsx     (Settings)
├── lib/
│   ├── demo/
│   │   └── mock-data.ts          (Sample patients, visits, X-rays)
│   ├── hooks/
│   │   └── use-patients.ts       (Patient data hook)
│   ├── ai/
│   │   └── analysis-service.ts   (Mock AI analysis)
│   └── reports/
│       └── pdf-generator.ts      (PDF report generation)
└── components/
    └── patients/
        └── add-patient-dialog.tsx (Add patient form)
```

---

## 🔧 Common Customizations

### Change Sample Patient Names
Edit `/lib/demo/mock-data.ts` - DEMO_PATIENTS array

### Change Sample X-ray Images
Edit `/lib/demo/mock-data.ts` - DEMO_XRAYS array
Replace `imageUrl` with any image URL

### Modify AI Analysis Results
Edit `/lib/ai/analysis-service.ts` - analyzeXRayComparison function

### Change Clinic Name
Search for "Demo Clinic" in `app/dashboard/layout.tsx`

---

## 📞 Support

**Documentation Files**:
- [SUPABASE_REMOVAL_SUMMARY.md](SUPABASE_REMOVAL_SUMMARY.md) - Technical details
- [PHASE_1_2_SUMMARY.md](PHASE_1_2_SUMMARY.md) - Implementation summary
- [tasks/COMPLETION_REPORT.md](tasks/COMPLETION_REPORT.md) - Detailed completion report

**Git History**:
```bash
git log --oneline
# See all commits and changes
```

---

## ✅ Verification Checklist

Before demo/presentation, verify:
- [ ] Dev server running: `npm run dev`
- [ ] Can access: http://localhost:3002/dashboard
- [ ] Can see 3 sample patients in dropdown
- [ ] Can click "Run AI Analysis"
- [ ] Can add new patient with "+ Add Patient" button
- [ ] Can navigate to all pages via sidebar
- [ ] No browser console errors
- [ ] No Supabase API calls (clean network tab)

---

**Status**: ✅ Ready for Demo
**Version**: Phase 1+2 Complete
**Last Updated**: December 2, 2024
