# Task: Fix Dashboard Navigation Menu Active State

## Problem
The left sidebar menu always shows "Patients" as active (blue highlight), regardless of the current page. This makes it impossible to tell which section the user is currently viewing.

## Root Cause
- `app/dashboard/layout.tsx` line 40: The "Patients" link has hardcoded active styling (`bg-blue-50 text-blue-600`)
- No dynamic route detection using `usePathname()`
- Menu doesn't reflect the current URL

## Solution
Use Next.js `usePathname()` hook to dynamically determine which menu item should be highlighted based on the current route.

## Tasks

- [ ] Task 1: Convert layout.tsx to client component (add "use client")
- [ ] Task 2: Import usePathname from next/navigation
- [ ] Task 3: Create a helper function to check if a route is active
- [ ] Task 4: Apply dynamic className logic to all menu items
- [ ] Task 5: Test all navigation routes and verify menu highlighting
- [ ] Task 6: Commit changes to GitHub
- [ ] Task 7: Add review section

## Implementation Details

### Files to modify:
- `app/dashboard/layout.tsx` (ONLY FILE TO CHANGE)

### Changes needed:
1. Add "use client" directive at top
2. Import usePathname
3. Add isActive() helper function
4. Replace hardcoded className with conditional logic

### Files NOT to touch:
- No component changes needed
- No new files needed
- No other layout files

## Review Section
(To be filled after completion)

### Changes Made:
(Summary will go here)

### Testing Results:
(Verification will go here)

### Commits:
(Git commits will be listed here)
