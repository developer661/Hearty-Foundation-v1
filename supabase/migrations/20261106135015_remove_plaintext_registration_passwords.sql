/*
# Remove plaintext passwords from organisation registrations

1. Modified Tables
- `care_facility_registrations.password_hash`: no longer required.
- `foundation_registrations.password_hash`: no longer required.

2. Data
- Existing plaintext values are cleared. Each registering organisation's password is already stored securely by the sign-in system, so these copies were redundant and unsafe.

3. Important Notes
- Registration forms no longer write a password into these tables.
- No other data is removed.
*/

ALTER TABLE care_facility_registrations ALTER COLUMN password_hash DROP NOT NULL;
ALTER TABLE foundation_registrations ALTER COLUMN password_hash DROP NOT NULL;

UPDATE care_facility_registrations SET password_hash = NULL WHERE password_hash IS NOT NULL;
UPDATE foundation_registrations SET password_hash = NULL WHERE password_hash IS NOT NULL;
