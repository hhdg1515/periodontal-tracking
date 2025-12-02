# Implementation Plan: Phase 1 + Phase 2

## 🎯 Today's Goal
Create investor-ready demo in 1.5 hours with:
- ✅ Working AI analysis demo (main feature)
- ✅ No 404 errors in navigation
- ✅ Add Patient button globally accessible
- ✅ Example patients visible

---

## Task Breakdown (Follow These in Order)

### TASK 1: Create Mock Data Files (10 mins)

**Files to create:**
- `lib/demo/mock-data.ts` - Sample patients, visits, xrays
- `lib/demo/constants.ts` - Configuration constants

**What they contain:**
- 2-3 sample patients with realistic data
- 2-3 visits per patient
- 2-3 X-rays per visit with placeholder image URLs

**Status:** ⬜ Pending

---

### TASK 2: Improve Demo Page (30 mins)

**File to update:**
- `app/dashboard/demo/page.tsx`

**Changes needed:**
1. Import mock data
2. Add demo selector UI (choose which patient to analyze)
3. Pre-load sample patient data
4. Keep existing AI analysis demo
5. Add disclaimers/branding

**Status:** ⬜ Pending

---

### TASK 3: Create Missing Pages (15 mins)

**Files to create:**
- `app/dashboard/analyses/page.tsx` (placeholder)
- `app/dashboard/settings/page.tsx` (placeholder)

**What they should contain:**
- Basic layout with h1 title
- Simple placeholder text
- Same layout style as dashboard

**Status:** ⬜ Pending

---

### TASK 4: Move Add Patient Button Globally (20 mins)

**File to update:**
- `app/dashboard/layout.tsx`

**Changes needed:**
1. Import AddPatientDialog
2. Add useState for dialog open state
3. Add button in header (next to clinic name)
4. Add dialog component
5. Make it work from anywhere

**Status:** ⬜ Pending

---

### TASK 5: Test Full Navigation (15 mins)

**Tests to perform:**
- [ ] /dashboard loads without errors
- [ ] /dashboard/patients loads without errors
- [ ] /dashboard/analyses loads without errors (no 404)
- [ ] /dashboard/settings loads without errors (no 404)
- [ ] /dashboard/demo loads and shows AI analysis
- [ ] "Add Patient" button visible on all pages
- [ ] "Add Patient" button works from header
- [ ] Click patient in list → detail page loads
- [ ] Demo page shows sample patients

**Status:** ⬜ Pending

---

## Implementation Order

**Do these tasks in this exact order:**

1. **Task 1: Mock Data** → Creates foundation
2. **Task 2: Demo Page** → Uses mock data
3. **Task 3: Missing Pages** → Fixes 404s
4. **Task 4: Add Patient Button** → Global access
5. **Task 5: Testing** → Verify everything

**Why this order?**
- Each task depends on previous ones
- Can test as you go
- Quick feedback loop

---

## Code Structure (For Your Reference)

### Mock Data Example:
```typescript
// lib/demo/mock-data.ts
export const DEMO_PATIENTS = [
  {
    id: 'demo-001',
    firstName: 'John',
    lastName: 'Smith',
    dateOfBirth: '1975-03-15',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    isSmoker: true,
    hasDiabetes: false,
  },
  {
    id: 'demo-002',
    firstName: 'Emily',
    lastName: 'Davis',
    dateOfBirth: '1982-07-22',
    email: 'emily@example.com',
    phone: '(555) 234-5678',
    isSmoker: false,
    hasDiabetes: true,
  },
];

export const DEMO_VISITS = [
  {
    id: 'visit-001',
    patientId: 'demo-001',
    visitDate: new Date('2024-06-15'),
    notes: 'Initial periodontal assessment',
  },
  {
    id: 'visit-002',
    patientId: 'demo-001',
    visitDate: new Date('2024-11-15'),
    notes: 'Follow-up after treatment',
  },
];

export const DEMO_XRAYS = [
  {
    id: 'xray-001',
    visitId: 'visit-001',
    imageUrl: 'https://via.placeholder.com/800x600/1e40af/ffffff?text=Baseline+X-Ray',
    type: 'baseline',
    uploadedAt: new Date('2024-06-15'),
  },
  {
    id: 'xray-002',
    visitId: 'visit-002',
    imageUrl: 'https://via.placeholder.com/800x600/dc2626/ffffff?text=Current+X-Ray',
    type: 'current',
    uploadedAt: new Date('2024-11-15'),
  },
];
```

### Demo Page Enhancement:
```typescript
// app/dashboard/demo/page.tsx
// Import mock data
import { DEMO_PATIENTS, DEMO_VISITS, DEMO_XRAYS } from '@/lib/demo/mock-data';

// Add selector for patient
const [selectedPatient, setSelectedPatient] = useState(DEMO_PATIENTS[0]);

// Show patient options
<select onChange={(e) => setSelectedPatient(...)}>
  {DEMO_PATIENTS.map(p => (
    <option value={p.id}>{p.firstName} {p.lastName}</option>
  ))}
</select>

// Rest of demo page stays the same
```

### Add Patient Button in Header:
```typescript
// app/dashboard/layout.tsx
// Add at top of DashboardLayout component
const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);

// In header JSX:
<Button onClick={() => setIsAddPatientOpen(true)}>
  <Plus className="h-4 w-4 mr-2" />
  Add Patient
</Button>

// Add dialog at bottom:
<AddPatientDialog
  open={isAddPatientOpen}
  onOpenChange={setIsAddPatientOpen}
  onSuccess={() => {
    // Refresh or handle
  }}
/>
```

---

## Completion Checklist

When all tasks are done, you should have:

- [ ] Mock data files created
- [ ] Demo page updated with sample selector
- [ ] Analyses page exists (no 404)
- [ ] Settings page exists (no 404)
- [ ] Add Patient button in header
- [ ] Add Patient button works globally
- [ ] No console errors
- [ ] Can show full demo to investors

---

## Success Metrics

**When you're ready to show investors:**
```
1. Open http://localhost:3001/dashboard/demo
2. You see sample patients in a selector
3. Click "Run AI Analysis"
4. AI demo shows results perfectly
5. Can navigate all menu items
6. "Add Patient" button works from anywhere
7. No 404 errors anywhere
```

If all these are true → You're ready! 🎉

---

## Next Step

**Ready to start with Task 1?** I'll guide you through each task step-by-step using your claude.md rules (plan → verify → execute → review).
