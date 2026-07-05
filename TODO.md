# TODO

## Registration Status Migration

- Add an explicit `PENDING` registration status to replace the current
  `DRAFT + registeredAt != null` meaning.
- Keep `DRAFT` for unsubmitted registration drafts only.
- Update registration submission, review, public status mapping, Partner API
  participation writes, exports, docs, and tests during the migration.
- Add a data migration that converts existing submitted draft registrations
  with `registeredAt != null` to `PENDING`.
