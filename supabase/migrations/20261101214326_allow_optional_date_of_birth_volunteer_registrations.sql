/*
# Make volunteer date of birth optional

1. Modified Tables
- `volunteer_registrations`: `date_of_birth` no longer requires a value.

2. Why
- The volunteer sign-up form marks date of birth as optional. When a volunteer left it blank, the registration record could not be saved because the column rejected empty values.

3. Security
- No change to access rules, policies, or grants.

4. Notes
- No existing data is removed or altered. Existing rows keep their values.
*/

ALTER TABLE volunteer_registrations ALTER COLUMN date_of_birth DROP NOT NULL;
