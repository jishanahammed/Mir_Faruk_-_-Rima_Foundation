Run from the backend root:

```powershell
dotnet run --project tests/CRM.VolunteerChecks
```

Uses the configured development SQL Server database after applying migrations. Test locations and volunteers are created inside a transaction that is always rolled back. Covers registration defaults, normalization, duplicates, location hierarchy and activity, editing, status changes, filtering, pagination, soft deletion and controller authorization metadata.
