# Database Migration Instructions

## Clinical Assessment Schema (Phase 1)

### To Apply Clinical Assessment Tables

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy and paste the contents of `schema-clinical.sql`
4. Click **Run** to execute the migration

This will create the following tables:
- `clinical_assessments` - Stores clinical findings and assessments
- `treatment_plans` - Treatment planning and follow-up
- `clinical_findings` - Detailed findings per tooth/region

### Verification

After running the migration, verify the tables were created:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('clinical_assessments', 'treatment_plans', 'clinical_findings');
```

### Rollback (if needed)

If you need to rollback these changes:

```sql
DROP TABLE IF EXISTS clinical_findings CASCADE;
DROP TABLE IF EXISTS treatment_plans CASCADE;
DROP TABLE IF EXISTS clinical_assessments CASCADE;
```

## Notes

- The schema uses UUID for primary keys (consistent with existing tables)
- Foreign keys reference the existing `visits` table
- Row Level Security (RLS) is enabled for all tables
- Indexes are created for common query patterns
