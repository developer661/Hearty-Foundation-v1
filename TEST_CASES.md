# Hearty Foundation - Comprehensive Test Cases

**Version:** 1.0
**Last Updated:** April 19, 2026
**Platform:** Hearty Foundation Volunteer Platform
**Technology:** React, TypeScript, Supabase, Tailwind CSS

---

## Table of Contents

1. [Authentication Tests](#1-authentication-tests)
2. [Navigation & Header Tests](#2-navigation--header-tests)
3. [Volunteer Registration Tests](#3-volunteer-registration-tests)
4. [Care Facility / NGO Registration Tests](#4-care-facility--ngo-registration-tests)
5. [Business Partner Registration Tests](#5-business-partner-registration-tests)
6. [Dashboard & Public Views Tests](#6-dashboard--public-views-tests)
7. [Volunteer Opportunities Tests](#7-volunteer-opportunities-tests)
8. [Upcoming Events Tests](#8-upcoming-events-tests)
9. [Urgent Needs Tests](#9-urgent-needs-tests)
10. [User Profile - Volunteer Tests](#10-user-profile---volunteer-tests)
11. [User Profile - Business Partner Tests](#11-user-profile---business-partner-tests)
12. [User Profile - Care Facility / NGO Tests](#12-user-profile---care-facility--ngo-tests)
13. [Favorites Functionality Tests](#13-favorites-functionality-tests)
14. [Business Partner Team Management Tests](#14-business-partner-team-management-tests)
15. [Contact Form Tests](#15-contact-form-tests)
16. [Responsive Design Tests](#16-responsive-design-tests)
17. [Access Control Tests](#17-access-control-tests)

---

## Test Case Conventions

- **TC-XXX-NNN** = Test Case identifier (module code + number)
- **PASS** = Expected result achieved
- **FAIL** = Expected result not achieved
- **N/A** = Not applicable
- **Prerequisites** = Conditions that must be true before test execution

---

## 1. Authentication Tests

### Overview
These tests verify that users can log in and log out correctly, that invalid credentials are rejected, and that each user type gains the correct access after authentication. The platform supports three user types (Volunteer, Care Facility/NGO, Business Partner), each with their own profile and capabilities.

---

### TC-AUTH-001: Successful Volunteer Login

**Description:**
Verify that a volunteer user can successfully log in using valid credentials and is redirected to the dashboard with the correct user profile loaded.

**Prerequisites:**
- The demo volunteer account exists: `anna.kowalska@example.com`
- The application is loaded and the home page is visible

**Steps:**
1. Navigate to the application home page
2. Locate the "Log In" button in the top navigation bar
3. Click "Log In" to open the dropdown menu
4. Select "Log In as Volunteer" from the dropdown
5. The Login modal should appear
6. Enter email: `anna.kowalska@example.com`
7. Enter password: `volunteer123`
8. Click the "Log In" button
9. Wait for the authentication process to complete

**Expected Result:**
- The login modal closes
- The header navigation changes to show the user's name in a dropdown menu
- The "Log In" and "Join" buttons are no longer visible
- A user menu appears showing options: User Profile, Current Engagements, Upcoming Events, Volunteer Ranking, Log Out
- No error messages are displayed

---

### TC-AUTH-002: Successful Business Partner Login

**Description:**
Verify that a business partner user can successfully log in and that the platform recognizes their role, loading the appropriate business partner profile interface.

**Prerequisites:**
- The demo business partner account exists: `sponsor@example.com`
- The application is loaded

**Steps:**
1. Navigate to the application home page
2. Click "Log In" in the top navigation bar
3. Select "Log In as Business Partner" from the dropdown
4. The Login modal appears
5. Enter email: `sponsor@example.com`
6. Enter password: `sponsor123`
7. Click "Log In"
8. After login, click the user menu (top right)
9. Select "User Profile"
10. Observe the profile page that loads

**Expected Result:**
- Login succeeds without errors
- User menu appears in the header
- User Profile page displays the Business Partner interface including:
  - "Manage Volunteers" button/dropdown
  - Volunteer team management section
  - Business partner statistics (active volunteers, pending invitations, etc.)

---

### TC-AUTH-003: Successful Care Facility Login

**Description:**
Verify that a care facility user can successfully log in and access care-facility-specific features such as the organisation statistics dashboard.

**Prerequisites:**
- The demo care facility account exists: `sunshine@example.com`
- The application is loaded

**Steps:**
1. Navigate to the application home page
2. Click "Log In" in the top navigation bar
3. Select "Log In as Care Facility/NGO Organisation" from the dropdown
4. The Login modal appears
5. Enter email: `sunshine@example.com`
6. Enter password: `sunshine123`
7. Click "Log In"
8. After login, click the user menu and select "User Profile"
9. Observe the profile page

**Expected Result:**
- Login succeeds without errors
- User Profile page displays the Organisation Statistics component
- Statistics section shows metrics relevant to the care facility

---

### TC-AUTH-004: Login with Incorrect Password

**Description:**
Verify that the system correctly rejects a login attempt when the password is wrong and displays a meaningful error message to the user.

**Prerequisites:**
- The application is loaded

**Steps:**
1. Click "Log In" in the navigation
2. Select "Log In as Volunteer"
3. Enter email: `anna.kowalska@example.com`
4. Enter password: `wrongpassword`
5. Click "Log In"
6. Observe the result

**Expected Result:**
- Login is rejected
- An error message is displayed within the modal (e.g., "Profile not found" or "Invalid credentials")
- The modal remains open
- The user is NOT redirected or logged in

---

### TC-AUTH-005: Login with Non-Existent Email

**Description:**
Verify that attempting to log in with an email address that does not exist in the system produces a clear error message rather than a crash or silent failure.

**Prerequisites:**
- The application is loaded

**Steps:**
1. Click "Log In" in the navigation
2. Select "Log In as Volunteer"
3. Enter email: `nonexistent.user@fake.com`
4. Enter password: `anypassword123`
5. Click "Log In"
6. Observe the result

**Expected Result:**
- Login is rejected
- Error message is displayed: "No user found with this email" or equivalent
- Modal remains open
- No crash or unhandled errors occur

---

### TC-AUTH-006: Login with Empty Fields

**Description:**
Verify that the login form requires both email and password fields and does not allow submission with empty fields.

**Prerequisites:**
- The application is loaded and login modal is open

**Steps:**
1. Click "Log In" in the navigation
2. Select "Log In as Volunteer"
3. Leave both email and password fields empty
4. Click "Log In"
5. Observe the result

**Expected Result:**
- Form submission is prevented
- Browser or custom validation messages indicate required fields
- No network request is made with empty credentials

---

### TC-AUTH-007: Successful Logout

**Description:**
Verify that a logged-in user can log out, that the session is cleared, and that the interface returns to the unauthenticated state.

**Prerequisites:**
- A user is currently logged in (any user type)

**Steps:**
1. Confirm a user is logged in (user menu visible in header)
2. Click on the user dropdown menu in the header
3. Locate and click "Log Out"
4. Observe the interface change

**Expected Result:**
- The user is logged out
- The header reverts to showing "Log In" and "Join" buttons
- The user menu disappears
- If on the profile page, the user is redirected to the home page or opportunities view
- No personal data is visible after logout

---

### TC-AUTH-008: Close Login Modal Without Logging In

**Description:**
Verify that the login modal can be dismissed without logging in and that closing it does not cause any errors or unintended navigation.

**Prerequisites:**
- The application is loaded

**Steps:**
1. Click "Log In" in the navigation
2. Select any login option to open the modal
3. Observe the modal is open
4. Click the "X" close button on the modal
5. Observe the result

**Expected Result:**
- The modal closes
- The user is still on the same page
- No error messages appear
- The page state is unchanged

---

### TC-AUTH-009: Demo Credentials Displayed in Modal

**Description:**
Verify that the login modal helpfully displays demo account credentials for testing purposes.

**Prerequisites:**
- The application is loaded

**Steps:**
1. Click "Log In" in the navigation
2. Select "Log In as Volunteer"
3. Observe the full content of the login modal

**Expected Result:**
- A blue information box is visible within the modal
- Demo account credentials are shown:
  - Volunteer: `anna.kowalska@example.com` / `volunteer123`
  - Business Partner: `sponsor@example.com` / `sponsor123`
  - Care Facility: `sunshine@example.com` / `sunshine123`

---

## 2. Navigation & Header Tests

### Overview
These tests verify that all navigation elements work correctly, that dropdown menus appear and close as expected, that page transitions happen without errors, and that navigation differs appropriately between logged-in and logged-out states.

---

### TC-NAV-001: Header Visible on All Pages

**Description:**
Verify that the header navigation bar is present and functional on every page of the application.

**Prerequisites:**
- The application is loaded

**Steps:**
1. Start on the home page and confirm the header is visible
2. Navigate to Volunteer Opportunities (via "Join" or header link)
3. Confirm header is visible
4. Navigate to the Events page
5. Confirm header is visible
6. Navigate to the Contact form
7. Confirm header is visible

**Expected Result:**
- The header (with logo, navigation links, Log In/Join or user menu) is visible on every page visited
- Header layout is consistent across all views

---

### TC-NAV-002: Logo Click Returns to Home Page

**Description:**
Verify that clicking the Hearty Foundation logo in the header navigates the user back to the home page from any view.

**Prerequisites:**
- The application is loaded

**Steps:**
1. Navigate to the Volunteer Opportunities page
2. Locate the logo in the top-left of the header
3. Click the logo
4. Observe the navigation result

**Expected Result:**
- The user is navigated back to the home page
- The hero section and main homepage content is visible

---

### TC-NAV-003: "Join" Dropdown Menu - Unauthenticated

**Description:**
Verify that the "Join" dropdown menu in the header shows all three registration options when the user is not logged in.

**Prerequisites:**
- No user is currently logged in

**Steps:**
1. Locate the "Join" button in the header
2. Click on "Join" to open the dropdown
3. Observe the dropdown options

**Expected Result:**
- Dropdown opens showing three options:
  - "Join as a Volunteer"
  - "Join as Care Facility/NGO Organisation"
  - "Join as Business Partner"
- Each option is clickable

---

### TC-NAV-004: "Join" Dropdown - Volunteer Registration Navigation

**Description:**
Verify that clicking "Join as a Volunteer" from the header dropdown navigates to the volunteer registration form.

**Prerequisites:**
- No user is logged in

**Steps:**
1. Click "Join" in the header
2. Click "Join as a Volunteer"
3. Observe the page that loads

**Expected Result:**
- The volunteer registration form is displayed
- The form shows Step 1 with personal information fields
- Page title or heading indicates this is the volunteer registration

---

### TC-NAV-005: "Join" Dropdown - Care Facility Registration Navigation

**Description:**
Verify that clicking "Join as Care Facility/NGO Organisation" navigates to the care facility registration form.

**Prerequisites:**
- No user is logged in

**Steps:**
1. Click "Join" in the header
2. Click "Join as Care Facility/NGO Organisation"
3. Observe the page

**Expected Result:**
- The care facility / NGO registration form is displayed
- Organisation type selector is visible

---

### TC-NAV-006: "Join" Dropdown - Business Partner Registration Navigation

**Description:**
Verify that clicking "Join as Business Partner" navigates to the business partner registration form.

**Prerequisites:**
- No user is logged in

**Steps:**
1. Click "Join" in the header
2. Click "Join as Business Partner"
3. Observe the page

**Expected Result:**
- The business partner registration form is displayed
- Company information fields are visible

---

### TC-NAV-007: "Log In" Dropdown Shows Role Options

**Description:**
Verify that the "Log In" dropdown presents all available login role options.

**Prerequisites:**
- No user is logged in

**Steps:**
1. Click "Log In" in the header
2. Observe the dropdown

**Expected Result:**
- Dropdown shows at minimum:
  - "Log In as Volunteer"
  - "Log In as Care Facility/NGO Organisation"
  - "Log In as Business Partner"
  - "Log In as Administrator"

---

### TC-NAV-008: User Menu Visible When Logged In

**Description:**
Verify that the "Log In" and "Join" buttons are replaced by a user dropdown menu after successful login.

**Prerequisites:**
- A user is logged in (any role)

**Steps:**
1. Log in with any demo account
2. Observe the header

**Expected Result:**
- "Log In" button is NOT visible
- "Join" button is NOT visible
- A user menu/dropdown showing the user's name is visible
- The dropdown contains: User Profile, Current Engagements, Upcoming Events, Volunteer Ranking, Log Out

---

### TC-NAV-009: User Menu - Navigate to Profile

**Description:**
Verify that clicking "User Profile" from the user menu navigates to the profile page.

**Prerequisites:**
- A user is logged in

**Steps:**
1. Click the user menu dropdown in the header
2. Click "User Profile"
3. Observe the page

**Expected Result:**
- The user's profile page is displayed
- Profile shows the correct user's name, email, and information

---

### TC-NAV-010: Mobile Menu Toggle

**Description:**
Verify that the hamburger menu button appears on small screens and that clicking it opens and closes the mobile navigation menu.

**Prerequisites:**
- Browser is resized to mobile width (< 768px) or developer tools set to mobile viewport

**Steps:**
1. Resize browser to mobile width
2. Locate the hamburger icon (three horizontal lines) in the header
3. Click the hamburger icon
4. Observe the navigation menu
5. Click the hamburger icon again (or an X close button)
6. Observe

**Expected Result:**
- On mobile: hamburger icon is visible, standard nav links are hidden
- Clicking hamburger: mobile menu expands showing all navigation options
- Clicking again or close button: mobile menu collapses
- All navigation options are accessible in the mobile menu

---

### TC-NAV-011: Dashboard Navigation from Header

**Description:**
Verify that clicking "Dashboard" in the header navigates to the main dashboard view.

**Prerequisites:**
- The application is loaded (user may or may not be logged in)

**Steps:**
1. Locate "Dashboard" in the header navigation
2. Click "Dashboard"
3. Observe the page

**Expected Result:**
- The main dashboard view loads
- Platform statistics are visible (volunteer count, teacher count, etc.)

---

## 3. Volunteer Registration Tests

### Overview
These tests verify the complete volunteer registration flow, including form validation, step progression, file upload requirements, and successful account creation. Registration is a two-step process: personal information followed by document upload.

---

### TC-VREG-001: Navigate to Volunteer Registration Form

**Description:**
Verify that the volunteer registration form is accessible and displays Step 1 correctly on first load.

**Prerequisites:**
- No user is logged in

**Steps:**
1. Click "Join" in the header
2. Click "Join as a Volunteer"
3. Observe the form

**Expected Result:**
- Registration form loads
- Step 1 heading is visible (e.g., "Step 1 of 2" or "Personal Information")
- Required fields visible: First Name, Last Name, Email, Password, Confirm Password
- Optional fields visible: Phone, Date of Birth, Profession, Previous Experience, Motivation
- A "Next Step" or "Continue" button is visible

---

### TC-VREG-002: First Name Required Validation

**Description:**
Verify that the First Name field is required and that the form cannot be submitted without it.

**Prerequisites:**
- Volunteer registration form is open at Step 1

**Steps:**
1. Leave the First Name field empty
2. Fill in all other required fields (Last Name, Email, Password, Confirm Password)
3. Click "Next Step" or "Continue"
4. Observe the validation

**Expected Result:**
- Form submission is prevented
- An error message or highlight indicates First Name is required
- The user remains on Step 1

---

### TC-VREG-003: Last Name Required Validation

**Description:**
Verify that the Last Name field is required.

**Prerequisites:**
- Volunteer registration form is open at Step 1

**Steps:**
1. Fill in First Name but leave Last Name empty
2. Fill all other required fields
3. Click "Next Step"

**Expected Result:**
- Form submission is prevented
- Error indicates Last Name is required

---

### TC-VREG-004: Email Format Validation

**Description:**
Verify that the email field validates the format and rejects incorrectly formatted email addresses.

**Prerequisites:**
- Volunteer registration form is open

**Steps:**
1. Fill First Name and Last Name
2. Enter an invalid email: `notanemail` (no @ symbol)
3. Fill Password and Confirm Password
4. Click "Next Step"
5. Observe
6. Repeat with: `missing@domain` and `@nodomain.com`

**Expected Result:**
- Invalid email formats are rejected
- Error message indicates the email format is invalid
- Correctly formatted emails (e.g., `test@example.com`) are accepted

---

### TC-VREG-005: Password Minimum Length Validation

**Description:**
Verify that passwords shorter than 8 characters are rejected.

**Prerequisites:**
- Volunteer registration form is open

**Steps:**
1. Fill all text fields correctly
2. Enter password: `abc` (3 characters)
3. Enter same in Confirm Password
4. Click "Next Step"
5. Observe

**Expected Result:**
- Form is not submitted
- Error message indicates password must be at least 8 characters

---

### TC-VREG-006: Password Confirmation Mismatch

**Description:**
Verify that passwords must match and that a mismatch produces a clear error.

**Prerequisites:**
- Volunteer registration form is open

**Steps:**
1. Fill all required fields
2. Enter password: `Password123`
3. Enter different confirm password: `Password456`
4. Click "Next Step"
5. Observe

**Expected Result:**
- Form not submitted
- Error message: "Passwords do not match" or equivalent

---

### TC-VREG-007: Valid Step 1 Submission Progresses to Step 2

**Description:**
Verify that filling all required fields correctly on Step 1 and clicking Next allows progression to Step 2 (document upload).

**Prerequisites:**
- Volunteer registration form is open

**Steps:**
1. Enter First Name: `Test`
2. Enter Last Name: `Volunteer`
3. Enter Email: `test.volunteer@example.com`
4. Enter Password: `TestPass123`
5. Enter Confirm Password: `TestPass123`
6. Click "Next Step"
7. Observe

**Expected Result:**
- Step 2 loads
- Document upload fields are visible
- An ID Document upload field is present (required)
- A Certifications upload field may be present (optional)

---

### TC-VREG-008: ID Document Upload - Invalid File Type

**Description:**
Verify that uploading an unsupported file type for the ID Document field is rejected.

**Prerequisites:**
- Registration form is on Step 2

**Steps:**
1. Progress to Step 2
2. Attempt to upload a `.txt` or `.mp4` file as the ID Document
3. Observe

**Expected Result:**
- File is rejected
- Error message indicates accepted formats: PDF, JPEG, PNG
- No invalid file is attached

---

### TC-VREG-009: ID Document Upload - File Too Large

**Description:**
Verify that files exceeding the maximum allowed size (5MB) are rejected.

**Prerequisites:**
- Registration form is on Step 2

**Steps:**
1. Progress to Step 2
2. Attempt to upload a file larger than 5MB as the ID Document
3. Observe

**Expected Result:**
- Upload is rejected
- Error message indicates the file size limit (5MB)

---

### TC-VREG-010: Step 2 - ID Document Required for Submission

**Description:**
Verify that the registration cannot be submitted on Step 2 without uploading the required ID Document.

**Prerequisites:**
- Registration form is on Step 2

**Steps:**
1. Leave the ID Document field empty
2. Click "Submit Registration" or equivalent
3. Observe

**Expected Result:**
- Submission is prevented
- Error message indicates ID Document is required

---

### TC-VREG-011: Back Button on Step 2 Returns to Step 1

**Description:**
Verify that clicking "Back" on Step 2 returns the user to Step 1 with their previously entered data preserved.

**Prerequisites:**
- User has progressed to Step 2 with valid Step 1 data

**Steps:**
1. Complete Step 1 and progress to Step 2
2. Click the "Back" button
3. Observe Step 1 form

**Expected Result:**
- Step 1 is displayed again
- Previously entered data (name, email, etc.) is preserved in the form fields

---

### TC-VREG-012: Successful Registration Submission

**Description:**
Verify that a completed registration with valid data and a valid document creates a new user account and shows a success message.

**Prerequisites:**
- Registration form at Step 1
- A valid PDF or image file available to upload

**Steps:**
1. Fill Step 1: First Name `New`, Last Name `Volunteer`, Email `new.volunteer@test.com`, Password `NewPass123`, Confirm `NewPass123`
2. Click "Next Step"
3. Upload a valid PDF/image to ID Document field
4. Click "Submit Registration"
5. Observe

**Expected Result:**
- Success page or message is displayed
- No error messages appear
- User is informed their registration is pending verification

---

### TC-VREG-013: Optional Fields Can Be Left Empty

**Description:**
Verify that optional fields (Phone, Date of Birth, Profession, Experience, Motivation) do not block registration when left empty.

**Prerequisites:**
- Volunteer registration form is open

**Steps:**
1. Fill only required fields: First Name, Last Name, Email, Password, Confirm Password
2. Leave all optional fields empty
3. Click "Next Step"
4. Upload a valid ID Document
5. Submit

**Expected Result:**
- Registration progresses through both steps
- Submission succeeds
- No errors about empty optional fields

---

## 4. Care Facility / NGO Registration Tests

### Overview
These tests verify the care facility and NGO organisation registration form. This form requires organisation-specific information, KRS number for certain organisation types, document uploads, and password creation. Registration results in an account with "in verification" status.

---

### TC-CREG-001: Organisation Type Dropdown Options

**Description:**
Verify that the Organisation Type dropdown presents all valid options.

**Prerequisites:**
- Care Facility registration form is open

**Steps:**
1. Navigate to the Care Facility/NGO registration form
2. Click the Organisation Type dropdown
3. Observe the available options

**Expected Result:**
- Dropdown shows:
  - NGO Organisation
  - Care Facility
  - Teacher
  - School
  - Other

---

### TC-CREG-002: KRS Number Required for NGO Type

**Description:**
Verify that the KRS number field becomes required when "NGO Organisation" is selected as the organisation type.

**Prerequisites:**
- Care Facility registration form is open

**Steps:**
1. Select "NGO Organisation" from the Organisation Type dropdown
2. Fill all other required fields
3. Leave the KRS Number field empty
4. Attempt to submit

**Expected Result:**
- Submission is blocked
- Error indicates KRS Number is required for NGO organisations

---

### TC-CREG-003: KRS Number Required for Care Facility Type

**Description:**
Verify that KRS number is also required when "Care Facility" is selected.

**Prerequisites:**
- Care Facility registration form is open

**Steps:**
1. Select "Care Facility" from Organisation Type
2. Fill all other required fields
3. Leave KRS Number empty
4. Attempt to submit

**Expected Result:**
- Submission blocked
- KRS Number is indicated as required

---

### TC-CREG-004: KRS Number NOT Required for Teacher Type

**Description:**
Verify that KRS Number is not required when "Teacher" is selected as organisation type.

**Prerequisites:**
- Care Facility registration form is open

**Steps:**
1. Select "Teacher" from Organisation Type
2. Fill all required fields
3. Leave KRS Number empty
4. Attempt to submit

**Expected Result:**
- KRS Number field either disappears or is not marked as required
- Form can proceed without KRS Number

---

### TC-CREG-005: Business Profile Character Limit

**Description:**
Verify that the Business Profile textarea enforces the 500-character maximum.

**Prerequisites:**
- Care Facility registration form is open

**Steps:**
1. Click on the Business Profile textarea
2. Type or paste a text that exceeds 500 characters
3. Observe the field

**Expected Result:**
- Input is capped at 500 characters
- A character counter shows remaining characters or maximum reached
- Text beyond 500 characters is not accepted

---

### TC-CREG-006: Secondary Address Toggle

**Description:**
Verify that the secondary address section can be toggled on and off via a checkbox or toggle button.

**Prerequisites:**
- Care Facility registration form is open

**Steps:**
1. Locate the secondary address section (should initially be hidden)
2. Click the toggle/checkbox to enable secondary address
3. Observe the secondary address fields appear
4. Click the toggle again to hide

**Expected Result:**
- Secondary address fields appear when toggle is enabled
- Secondary address fields disappear when toggle is disabled
- Main address field is always visible

---

### TC-CREG-007: Document Upload for NGO Type

**Description:**
Verify that required documents for NGO type (KRS Certificate, Establishment Decision, Operating License) are requestable.

**Prerequisites:**
- Care Facility registration form with "NGO Organisation" selected

**Steps:**
1. Select "NGO Organisation"
2. Observe the document upload section

**Expected Result:**
- Document upload fields appear for:
  - KRS Certificate
  - Establishment Decision
  - Operating License
- At least one document upload is required

---

### TC-CREG-008: Photo Gallery Upload (Optional)

**Description:**
Verify that photos can be uploaded optionally (up to 5 photos) for the organisation profile.

**Prerequisites:**
- Care Facility registration form is open

**Steps:**
1. Locate the Photos section
2. Upload 1 valid JPG or PNG image (under 5MB)
3. Observe that the photo is accepted
4. Upload up to 5 total photos
5. Attempt to upload a 6th photo
6. Observe

**Expected Result:**
- Up to 5 photos accepted
- 6th photo upload is blocked or the add-photo button becomes unavailable
- Only JPG/PNG formats accepted (error if other type attempted)

---

### TC-CREG-009: Successful NGO Registration

**Description:**
Verify complete NGO registration with all required fields and documents results in success.

**Prerequisites:**
- All required documents available for upload

**Steps:**
1. Select Organisation Type: "NGO Organisation"
2. Enter Organisation Name: `Test NGO Organisation`
3. Enter Date of Establishment: any past date
4. Enter Business Profile: short description (under 500 chars)
5. Enter Main Address
6. Enter KRS Number: `1234567890`
7. Upload a required document (KRS Certificate)
8. Enter email: `test.ngo@example.com`
9. Enter password: `NGOPass123`
10. Enter confirm password: `NGOPass123`
11. Submit

**Expected Result:**
- Successful registration
- Success message displayed
- Account created with verification status: "in_verification"

---

## 5. Business Partner Registration Tests

### Overview
These tests cover the business partner (corporate sponsor) registration process. Business partners register their company, provide a NIP (tax ID), assign a contact person, and upload supporting documentation.

---

### TC-BPREG-001: All Required Fields Present

**Description:**
Verify that the business partner registration form contains all required fields.

**Prerequisites:**
- Business partner registration form is open

**Steps:**
1. Navigate to "Join as Business Partner"
2. Observe all form fields present

**Expected Result:**
- The following required fields are visible:
  - Company Name
  - Date of Establishment
  - NIP (Tax ID Number)
  - Business Profile
  - Address
  - Contact Person Name
  - Phone Number
  - Email Address
  - Password
  - Confirm Password
  - Document upload section

---

### TC-BPREG-002: NIP Field Required

**Description:**
Verify that the NIP (tax identification number) field is required and blocks submission when empty.

**Prerequisites:**
- Business partner registration form is open

**Steps:**
1. Fill all fields except NIP
2. Upload a supporting document
3. Attempt to submit
4. Observe

**Expected Result:**
- Submission blocked
- Error indicates NIP is required

---

### TC-BPREG-003: Document Upload Required

**Description:**
Verify that at least one supporting document must be uploaded before submission is allowed.

**Prerequisites:**
- Business partner registration form is open

**Steps:**
1. Fill all text fields with valid data
2. Do NOT upload any documents
3. Attempt to submit
4. Observe

**Expected Result:**
- Submission blocked
- Error indicates at least one document is required

---

### TC-BPREG-004: Password Confirmation Match Required

**Description:**
Verify password and confirm password must match.

**Prerequisites:**
- Business partner registration form is open

**Steps:**
1. Fill all required text fields
2. Enter Password: `CompanyPass123`
3. Enter Confirm Password: `DifferentPass456`
4. Upload a document
5. Submit

**Expected Result:**
- Submission blocked
- Error: passwords do not match

---

### TC-BPREG-005: Successful Business Partner Registration

**Description:**
Verify complete and valid business partner registration results in account creation.

**Prerequisites:**
- Valid company document available for upload

**Steps:**
1. Company Name: `Test Corporation`
2. Date of Establishment: any past date
3. NIP: `1234567890`
4. Business Profile: `We are a test company supporting volunteer initiatives.`
5. Address: `Test Street 1, Warsaw`
6. Contact Person: `Jan Testowy`
7. Phone: `+48 123 456 789`
8. Email: `test.partner@example.com`
9. Password: `PartnerPass123`
10. Confirm Password: `PartnerPass123`
11. Upload a valid PDF document
12. Submit

**Expected Result:**
- Success message displayed
- Account created with verification_status: "in_verification"

---

## 6. Dashboard & Public Views Tests

### Overview
The dashboard shows platform statistics, recent volunteer additions, features, and other public information. It is accessible to all users (logged in or not). These tests verify the data loads correctly and the layout is appropriate.

---

### TC-DASH-001: Dashboard Loads Platform Statistics

**Description:**
Verify that the main dashboard/homepage shows platform statistics.

**Prerequisites:**
- Application is loaded

**Steps:**
1. Navigate to the home page or click "Dashboard" in the header
2. Observe the statistics section

**Expected Result:**
- Platform statistics are displayed including at minimum:
  - Number of active volunteers
  - Number of volunteer hours
  - Number of lives impacted
- Numbers are displayed prominently (e.g., "850+ Active Volunteers")

---

### TC-DASH-002: Hero Section Content Visible

**Description:**
Verify the homepage hero section contains the key messaging and call-to-action buttons.

**Prerequisites:**
- Application is loaded on home page

**Steps:**
1. Navigate to the home page
2. Observe the hero section at the top

**Expected Result:**
- Foundation name or tagline is visible
- At least one call-to-action button is visible (e.g., "Explore Opportunities" or "Request Information")
- Background image or video is displayed

---

### TC-DASH-003: Explore Opportunities Button Navigation

**Description:**
Verify that the "Explore Opportunities" button on the hero section navigates to the Volunteer Opportunities page.

**Prerequisites:**
- Application is loaded on home page

**Steps:**
1. Locate the "Explore Opportunities" button in the hero section
2. Click it
3. Observe the page that loads

**Expected Result:**
- Volunteer Opportunities page loads
- Immediate and ongoing opportunities are shown

---

### TC-DASH-004: Features Section Content

**Description:**
Verify that the features section on the homepage displays the platform's key benefits.

**Prerequisites:**
- Application loaded

**Steps:**
1. Scroll down past the hero section
2. Locate the features section
3. Observe content

**Expected Result:**
- Multiple feature cards or blocks are displayed
- Each feature has a title, description, and icon
- Content relates to volunteering, education, mentorship, etc.

---

### TC-DASH-005: Partners Gallery Visible

**Description:**
Verify that partner organisation logos or names are displayed in the partners gallery section.

**Prerequisites:**
- Application loaded

**Steps:**
1. Scroll to the Partners section on the homepage
2. Observe

**Expected Result:**
- Partner logos or names are displayed
- Gallery is visually organized

---

### TC-DASH-006: Animated Quotes Section

**Description:**
Verify that volunteer testimonials or animated quotes are displayed on the homepage.

**Prerequisites:**
- Application loaded

**Steps:**
1. Scroll through the homepage
2. Locate the quotes/testimonials section
3. Observe if quotes rotate or animate

**Expected Result:**
- Testimonials or quotes are displayed
- If animated, quotes transition between entries

---

## 7. Volunteer Opportunities Tests

### Overview
The volunteer opportunities page displays positions split into "Immediate Opportunities" (urgent needs) and "Ongoing Opportunities" (regular programs). This page is public and accessible without login.

---

### TC-OPP-001: Page Loads With Opportunities

**Description:**
Verify that the Volunteer Opportunities page loads and displays both immediate and ongoing opportunities fetched from the database.

**Prerequisites:**
- Application loaded
- Database contains active opportunities

**Steps:**
1. Navigate to the Volunteer Opportunities page
2. Observe both sections: "Immediate Opportunities" and "Ongoing Opportunities"

**Expected Result:**
- At least one opportunity card is shown in each section
- Each card displays: Title, Description, Category badge, Institution Name, Location, and a button

---

### TC-OPP-002: Category Color Coding

**Description:**
Verify that opportunity categories are displayed with consistent colour-coded badges.

**Prerequisites:**
- Opportunities page loaded with opportunities visible

**Steps:**
1. Observe category badges on opportunity cards
2. Note the colour for each category:
   - Math Education = blue
   - English Education = green
   - Polish Education = purple/pink
   - Sports & Fitness = orange
   - Arts & Creativity = pink
   - Health & Wellness = red

**Expected Result:**
- Each category badge has a distinct, consistent colour
- Colours match the documented colour scheme

---

### TC-OPP-003: Immediate Opportunities Display Limit

**Description:**
Verify that no more than 6 immediate opportunities are displayed even if more exist in the database.

**Prerequisites:**
- Database has more than 6 immediate/urgent opportunities

**Steps:**
1. Navigate to Volunteer Opportunities
2. Count the number of cards in the "Immediate Opportunities" section

**Expected Result:**
- Maximum 6 cards displayed in the immediate section
- If more exist, they are not shown (pagination or "view more" may be present)

---

### TC-OPP-004: Ongoing Opportunities Display Limit

**Description:**
Verify that no more than 4 ongoing opportunities are shown.

**Prerequisites:**
- Database has ongoing opportunities

**Steps:**
1. Navigate to Volunteer Opportunities
2. Count cards in the "Ongoing Opportunities" section

**Expected Result:**
- Maximum 4 cards in ongoing section

---

### TC-OPP-005: "Register as Volunteer" Button Navigation

**Description:**
Verify that the "Register as Volunteer" call-to-action button on the opportunities page navigates to the volunteer registration form.

**Prerequisites:**
- Volunteer Opportunities page is open
- No user is logged in

**Steps:**
1. Locate the "Register as Volunteer" or equivalent CTA button
2. Click it
3. Observe

**Expected Result:**
- Volunteer registration form opens

---

### TC-OPP-006: Statistics Section Visible

**Description:**
Verify that the opportunities page displays impact statistics.

**Prerequisites:**
- Opportunities page loaded

**Steps:**
1. Observe the statistics section on the opportunities page

**Expected Result:**
- Statistics are displayed:
  - 850+ Active Volunteers
  - 12,500+ Hours Contributed
  - 3,200+ Lives Impacted

---

### TC-OPP-007: Opportunity Card - Institution Name and Location

**Description:**
Verify that each opportunity card shows the institution name and location.

**Prerequisites:**
- Opportunities page with at least one opportunity

**Steps:**
1. Observe any opportunity card
2. Look for institution name and location details

**Expected Result:**
- Institution name is visible on the card
- Location (city/area) is displayed on the card

---

## 8. Upcoming Events Tests

### Overview
The Upcoming Events page displays future volunteer events sorted by date. Logged-in users with full access can RSVP. Read-only users can view but not join events.

---

### TC-EVT-001: Events Page Loads Future Events Only

**Description:**
Verify that only events with a date on or after today are displayed.

**Prerequisites:**
- Database contains events (some past, some future)

**Steps:**
1. Navigate to the Events page (via header user menu or navigation)
2. Observe the events displayed
3. Check the dates shown on event cards

**Expected Result:**
- Only events with future dates are shown
- No past events appear on the page

---

### TC-EVT-002: Events Sorted by Date (Ascending)

**Description:**
Verify that events are ordered from soonest to furthest in the future.

**Prerequisites:**
- Events page loaded with multiple future events

**Steps:**
1. Observe the order of event cards
2. Note the dates of the first and last events shown

**Expected Result:**
- Events are ordered with the earliest date first
- Dates progress chronologically from top/left to bottom/right

---

### TC-EVT-003: Event Card Displays Required Information

**Description:**
Verify that each event card shows all necessary information for a potential volunteer.

**Prerequisites:**
- Events page loaded with at least one event

**Steps:**
1. Observe any event card
2. Check for the following information

**Expected Result:**
- Event title visible
- Date displayed (formatted clearly)
- Time displayed
- Location (city/venue)
- Organiser name
- Attendees count
- Category badge

---

### TC-EVT-004: RSVP Button - Authenticated Full Access User

**Description:**
Verify that a verified user with full access can RSVP to an event and that the attendee count increases.

**Prerequisites:**
- User logged in as volunteer (`anna.kowalska@example.com` / `volunteer123`) with full access
- At least one future event exists

**Steps:**
1. Log in as the demo volunteer
2. Navigate to the Events page
3. Note the attendee count on a specific event card
4. Click the "RSVP" or "Join Event" button on that event
5. Observe the attendee count and button state

**Expected Result:**
- Attendee count increases by 1
- RSVP button changes state (e.g., "Joined", disabled, or changes colour)
- No error messages

---

### TC-EVT-005: RSVP Button Not Available for Read-Only Users

**Description:**
Verify that users with read-only access cannot RSVP to events (button absent or disabled).

**Prerequisites:**
- A user with read-only/not-verified status is logged in, OR no user is logged in

**Steps:**
1. Log in as a not-verified user (or view without logging in)
2. Navigate to Events page
3. Observe event cards for RSVP/Join buttons

**Expected Result:**
- RSVP button is either absent, disabled, or replaced with a message indicating verification is required
- Unauthenticated users see no RSVP option

---

### TC-EVT-006: Maximum Events Displayed

**Description:**
Verify that the events page does not display more than 12 events.

**Prerequisites:**
- Database has more than 12 future events

**Steps:**
1. Navigate to Events page
2. Count the displayed event cards

**Expected Result:**
- Maximum 12 event cards displayed
- Additional events not shown (no pagination implies only 12 are shown)

---

### TC-EVT-007: Favourite Button on Event Cards

**Description:**
Verify that logged-in users can favourite events from the Events page and that the favourite state toggles correctly.

**Prerequisites:**
- User is logged in

**Steps:**
1. Navigate to Events page
2. Click the heart/favourite icon on an event card
3. Observe the icon changes state (filled vs outline)
4. Click again to unfavourite
5. Observe icon returns to unfilled state

**Expected Result:**
- Favourite icon fills/colours when clicked (item added to favourites)
- Favourite icon reverts when clicked again (item removed from favourites)
- No error messages

---

## 9. Urgent Needs Tests

### Overview
The Urgent Needs section appears on the homepage and within the dashboard. It shows a maximum of 3 urgent opportunities with a "+N more" card if additional items exist. Users can favourite items and verified users can sign up.

---

### TC-URG-001: Urgent Needs Section Visible on Homepage

**Description:**
Verify that the Urgent Needs section is present on the home page with at least some content.

**Prerequisites:**
- Database contains urgent needs with status "active" and urgency "urgent"

**Steps:**
1. Navigate to the home page
2. Scroll to the Urgent Needs section

**Expected Result:**
- Section is visible
- Up to 3 urgent need cards are displayed
- Each card shows: title, institution name, location, category

---

### TC-URG-002: Maximum 3 Items Shown

**Description:**
Verify that only 3 urgent need cards are shown in the main section regardless of how many exist.

**Prerequisites:**
- Database has more than 3 urgent/active opportunities

**Steps:**
1. Navigate to the home page
2. Count the urgent need cards displayed

**Expected Result:**
- Exactly 3 urgent need cards are shown

---

### TC-URG-003: "More" Card Displayed When Excess Items Exist

**Description:**
Verify that when more than 3 urgent needs exist, a "+N more" card appears after the 3 main cards.

**Prerequisites:**
- Database has more than 3 urgent needs

**Steps:**
1. Navigate to home page
2. Count all visible cards in the Urgent Needs section (including any "more" card)

**Expected Result:**
- 3 regular urgent need cards are shown
- A 4th card displaying "+N more needs" (where N is the count beyond 3) is visible
- Clicking this card navigates to full opportunities list

---

### TC-URG-004: Favourite Button on Urgent Need

**Description:**
Verify that logged-in users can favourite an urgent need and the state persists.

**Prerequisites:**
- User is logged in

**Steps:**
1. Navigate to home page
2. Locate the Urgent Needs section
3. Click the heart/favourite icon on any urgent need card
4. Navigate to User Profile
5. Locate the "My Favourites" section
6. Verify the item appears there

**Expected Result:**
- Heart icon changes state on click
- Item appears in the user's Favourites section on their profile

---

### TC-URG-005: Sign Up for Urgent Need - Verified User

**Description:**
Verify that a verified user with full access can sign up for an urgent need.

**Prerequisites:**
- Verified volunteer is logged in (full access)

**Steps:**
1. Log in as demo volunteer
2. Navigate to Urgent Needs on homepage or dashboard
3. Click "Sign Up" on an urgent need
4. Navigate to User Profile
5. Check "Participated Projects" or "Current Engagements"

**Expected Result:**
- Sign up succeeds
- Urgent need appears in the user's participated projects/engagements

---

### TC-URG-006: Sign Up Not Available for Unauthenticated Users

**Description:**
Verify that visitors who are not logged in cannot sign up for urgent needs.

**Prerequisites:**
- No user is logged in

**Steps:**
1. Navigate to the home page
2. Locate the Urgent Needs section
3. Look for a "Sign Up" button on cards

**Expected Result:**
- Sign Up button is absent or disabled for unauthenticated users
- No way to sign up without logging in

---

## 10. User Profile - Volunteer Tests

### Overview
The volunteer user profile page shows personal information, verification status, skills and interests, participated projects, activity history, favourites, and connections to business partners. This section tests the profile for volunteer-type users.

---

### TC-VPRO-001: Profile Page Loads for Logged-In Volunteer

**Description:**
Verify that a logged-in volunteer's profile page loads correctly with their information.

**Prerequisites:**
- Volunteer is logged in (`anna.kowalska@example.com`)

**Steps:**
1. Log in as demo volunteer
2. Click the user menu in the header
3. Select "User Profile"
4. Observe the profile page

**Expected Result:**
- Profile page loads
- User's full name is displayed in the header section
- Email address is visible
- Location is shown
- Verification status badge is visible

---

### TC-VPRO-002: Verification Status Badge Visible

**Description:**
Verify that the verification status badge on the profile reflects the correct status with appropriate styling.

**Prerequisites:**
- Volunteer logged in

**Steps:**
1. Navigate to User Profile
2. Locate the verification status indicator

**Expected Result:**
- Status badge is visible with one of these states:
  - "Not Verified" (grey or red)
  - "In Verification" (yellow/orange)
  - "Verified" (green)
  - "Rejected" (red)
- The colour corresponds to the documented colour scheme

---

### TC-VPRO-003: Skills and Interests Displayed

**Description:**
Verify that the volunteer's skills and interests are displayed as tags in their profile.

**Prerequisites:**
- Volunteer logged in and profile has skills/interests data

**Steps:**
1. Navigate to User Profile
2. Locate the Skills & Interests section

**Expected Result:**
- Skills are shown as individual tags/badges
- Interests are shown as individual tags/badges
- Both sections are distinctly labelled

---

### TC-VPRO-004: Points Displayed in Profile Header

**Description:**
Verify that the volunteer's total points are visible on the profile.

**Prerequisites:**
- Volunteer logged in

**Steps:**
1. Navigate to User Profile
2. Observe the profile header area

**Expected Result:**
- Points total is visible (e.g., "1250 pts" or similar display)

---

### TC-VPRO-005: Participated Projects Section

**Description:**
Verify that the Participated Projects section shows all opportunities the volunteer has signed up for.

**Prerequisites:**
- Volunteer logged in and has at least one participated project

**Steps:**
1. Navigate to User Profile
2. Scroll to the "Participated Projects" section

**Expected Result:**
- List of projects is shown
- Each project shows: title, status badge, start date
- Status badge reflects: Assigned, In Progress, or Completed

---

### TC-VPRO-006: Recent Activities Section

**Description:**
Verify that the Recent Activities section shows an activity timeline with points earned per activity.

**Prerequisites:**
- Volunteer logged in and has activity history

**Steps:**
1. Navigate to User Profile
2. Scroll to the "Recent Activities" section

**Expected Result:**
- Activities listed chronologically
- Each activity shows: type, description, date, points earned
- Points are positive numbers

---

### TC-VPRO-007: My Favourites Section

**Description:**
Verify that the My Favourites section shows all items the user has favourited (urgent needs and events).

**Prerequisites:**
- Volunteer logged in and has favourited at least one item

**Steps:**
1. Favourite at least one urgent need and one event
2. Navigate to User Profile
3. Scroll to "My Favourites"

**Expected Result:**
- Section shows all favourited items
- Items are categorised or labelled (urgent need vs event)
- Each item has a title and location

---

### TC-VPRO-008: Business Partner Connections Section (Volunteer)

**Description:**
Verify that the volunteer profile shows a section for Business Partner connections and relationship management.

**Prerequisites:**
- Volunteer logged in

**Steps:**
1. Navigate to User Profile
2. Scroll to the Business Partner / Connections section

**Expected Result:**
- Section is visible showing "My Coordinating Partners" or equivalent
- Existing relationships are listed with status (invited, pending, active, released)
- "Find Partner" button is present
- Actions available for different statuses

---

### TC-VPRO-009: Find Business Partner Modal

**Description:**
Verify that clicking "Find Partner" opens a search modal to browse available business partners.

**Prerequisites:**
- Volunteer logged in

**Steps:**
1. Navigate to User Profile
2. Click "Find Partner" button
3. Observe the modal

**Expected Result:**
- Modal opens with a search input
- Available business partners are listed
- Each partner shows: company name, location, bio, points
- "Request to Join" button available per partner

---

### TC-VPRO-010: Request to Join Business Partner

**Description:**
Verify that clicking "Request to Join" sends a join request and the relationship status becomes "pending."

**Prerequisites:**
- Volunteer logged in
- At least one business partner exists that the volunteer is not yet connected to

**Steps:**
1. Open the "Find Partner" modal
2. Click "Request to Join" on a business partner
3. Close the modal
4. Observe the Business Partner Connections section

**Expected Result:**
- New connection appears in the list with status "Pending"
- The request was sent successfully

---

### TC-VPRO-011: Cancel Pending Request

**Description:**
Verify that a volunteer can cancel a pending join request.

**Prerequisites:**
- Volunteer has a pending request to a business partner

**Steps:**
1. Navigate to User Profile
2. Find the pending connection in the Business Partner Connections section
3. Click the cancel button
4. Observe

**Expected Result:**
- The pending connection is removed from the list
- Or status changes to reflect cancellation

---

## 11. User Profile - Business Partner Tests

### Overview
Business partner profiles focus on volunteer team management. These tests verify that business partners can view, invite, register, and manage volunteers.

---

### TC-BPRO-001: Business Partner Profile Shows Team Management Interface

**Description:**
Verify that the business partner profile page shows the volunteer team management section.

**Prerequisites:**
- Business partner logged in (`sponsor@example.com` / `sponsor123`)

**Steps:**
1. Log in as demo business partner
2. Navigate to User Profile
3. Observe the profile page

**Expected Result:**
- "Manage Volunteers" button or dropdown is visible
- Volunteer team statistics are shown:
  - Active Volunteers count
  - Pending Invitations count
  - Join Requests count
  - Total Team Points

---

### TC-BPRO-002: Manage Volunteers Dropdown Options

**Description:**
Verify that the Manage Volunteers dropdown contains all the expected action options.

**Prerequisites:**
- Business partner logged in

**Steps:**
1. Navigate to User Profile
2. Click the "Manage Volunteers" button or dropdown
3. Observe the options

**Expected Result:**
- Options include:
  - "Find & Invite Volunteer"
  - "Register New Volunteer"
  - "Invite Volunteer"
- All options are clickable

---

### TC-BPRO-003: Find & Invite Volunteer Modal Opens

**Description:**
Verify that selecting "Find & Invite Volunteer" opens a search modal.

**Prerequisites:**
- Business partner logged in

**Steps:**
1. Click "Manage Volunteers"
2. Select "Find & Invite Volunteer"
3. Observe

**Expected Result:**
- Modal opens with a search input field
- Available volunteers are listed or searchable
- Each volunteer shows name, location, bio, skills, points
- "Invite" button present per volunteer

---

### TC-BPRO-004: Search Volunteers by Name

**Description:**
Verify that the search function in the Find Volunteers modal filters results by name.

**Prerequisites:**
- Business partner logged in, Find Volunteers modal is open

**Steps:**
1. Open Find & Invite Volunteer modal
2. Type a volunteer's name (or partial name) in the search box
3. Observe the filtered results

**Expected Result:**
- Only volunteers matching the search term are shown
- Search is case-insensitive
- Clearing the search shows all available volunteers

---

### TC-BPRO-005: Invite Volunteer from Modal

**Description:**
Verify that clicking "Invite" on a volunteer in the Find modal creates a relationship with status "invited."

**Prerequisites:**
- Business partner logged in
- At least one unconnected volunteer exists

**Steps:**
1. Open the Find & Invite Volunteer modal
2. Locate an available volunteer
3. Click "Invite"
4. Close the modal
5. Observe the volunteer list or statistics

**Expected Result:**
- Volunteer appears in the partner's volunteer list with status "Invited"
- Pending Invitations count increases by 1

---

### TC-BPRO-006: Register New Volunteer Form

**Description:**
Verify that the Register New Volunteer modal contains a form to create a new volunteer account directly.

**Prerequisites:**
- Business partner logged in

**Steps:**
1. Click "Manage Volunteers"
2. Select "Register New Volunteer"
3. Observe the modal form

**Expected Result:**
- Form contains fields:
  - Full Name
  - Email
  - Location
  - Skills
  - Interests
  - Bio
- A "Register" submit button is present

---

### TC-BPRO-007: Register New Volunteer Creates Account

**Description:**
Verify that filling the register form and submitting creates a new volunteer account linked to the business partner with "active" status.

**Prerequisites:**
- Business partner logged in

**Steps:**
1. Open Register New Volunteer modal
2. Full Name: `Registered Test Volunteer`
3. Email: `registered.test@example.com`
4. Location: `Warsaw`
5. Skills: `Teaching, Mentoring`
6. Interests: `Education, Community`
7. Bio: `A test volunteer registered by business partner`
8. Click "Register"
9. Observe the volunteer list after modal closes

**Expected Result:**
- New volunteer appears in the team list with status "Active"
- Active Volunteers count increases
- No error messages

---

### TC-BPRO-008: View Volunteer Activity History

**Description:**
Verify that clicking the "Activity" button on a volunteer opens their activity history modal.

**Prerequisites:**
- Business partner logged in and has at least one volunteer in their team

**Steps:**
1. Navigate to User Profile
2. Locate a volunteer in the team list
3. Click the "Activity" button for that volunteer
4. Observe the modal

**Expected Result:**
- Activity history modal opens
- Shows a list of the volunteer's activities with:
  - Activity type
  - Description
  - Date
  - Points earned

---

### TC-BPRO-009: Release Volunteer from Team

**Description:**
Verify that clicking "Release" on an active volunteer removes them from the team and changes their status to "released."

**Prerequisites:**
- Business partner logged in with at least one active volunteer in team

**Steps:**
1. Navigate to User Profile
2. Locate an active volunteer in the list
3. Click "Release" button
4. Confirm the action if prompted
5. Observe the list

**Expected Result:**
- Volunteer status changes to "Released"
- Or volunteer is removed from the active list
- Active Volunteers count decreases

---

### TC-BPRO-010: Accept Pending Join Request

**Description:**
Verify that a business partner can accept a volunteer's join request, changing the relationship status to "active."

**Prerequisites:**
- Business partner logged in
- A volunteer has sent a join request (status "pending")

**Steps:**
1. Navigate to User Profile
2. Find the "Pending Join Requests" section
3. Locate a pending request
4. Click "Accept"
5. Observe the changes

**Expected Result:**
- Volunteer moves from pending requests to the active team list
- Relationship status changes to "active"
- Join Requests count decreases

---

### TC-BPRO-011: Reject Pending Join Request

**Description:**
Verify that a business partner can reject a volunteer join request.

**Prerequisites:**
- A pending join request exists

**Steps:**
1. Navigate to User Profile
2. Find a pending join request
3. Click "Reject"
4. Observe

**Expected Result:**
- Request is removed from the pending list
- Volunteer is not added to the active team
- Join Requests count decreases

---

### TC-BPRO-012: Filter Volunteers by Status

**Description:**
Verify that the volunteer list can be filtered by relationship status (all, active, invited).

**Prerequisites:**
- Business partner logged in with volunteers of various statuses

**Steps:**
1. Navigate to User Profile
2. Find the volunteer list
3. Select filter "Active" - observe only active volunteers shown
4. Select filter "Invited" - observe only invited volunteers shown
5. Select "All" - observe all volunteers shown

**Expected Result:**
- Filter correctly narrows the displayed list
- Only volunteers matching the selected status are displayed

---

### TC-BPRO-013: Add Notes to Volunteer

**Description:**
Verify that a business partner can add or edit notes for a volunteer in their team.

**Prerequisites:**
- Business partner logged in with at least one volunteer

**Steps:**
1. Locate a volunteer in the team list
2. Find the notes field or "Add Note" button
3. Enter a note: `Excellent volunteer, very reliable`
4. Save the note
5. Observe

**Expected Result:**
- Note is saved and displayed alongside the volunteer's information

---

## 12. User Profile - Care Facility / NGO Tests

### Overview
Care facility and NGO organisation profiles show an Organisation Statistics dashboard with metrics about volunteer engagement, opportunities posted, and projects completed.

---

### TC-CPRO-001: Organisation Statistics Dashboard Visible

**Description:**
Verify that the care facility profile shows the Organisation Statistics dashboard component.

**Prerequisites:**
- Care facility user logged in (`sunshine@example.com` / `sunshine123`)

**Steps:**
1. Log in as demo care facility
2. Navigate to User Profile
3. Observe the profile page content

**Expected Result:**
- Organisation Statistics dashboard is visible
- Statistics section shows at minimum:
  - Active volunteers count
  - Opportunities posted count
  - Completed projects count

---

### TC-CPRO-002: Organisation Name and Type Displayed

**Description:**
Verify that the care facility's organisation name and type are displayed on the profile.

**Prerequisites:**
- Care facility logged in

**Steps:**
1. Navigate to User Profile
2. Observe the profile header

**Expected Result:**
- Organisation name is displayed
- Organisation type (e.g., "Care Facility", "NGO Organisation") is visible

---

## 13. Favorites Functionality Tests

### Overview
Users can favourite both urgent needs and events. Favourites are stored per user in the database and can be viewed in the profile page. The FavoriteButton component is used across multiple pages.

---

### TC-FAV-001: Add Event to Favourites

**Description:**
Verify that clicking the favourite button on an event card adds it to the user's favourites.

**Prerequisites:**
- User is logged in

**Steps:**
1. Navigate to the Events page
2. Locate an event card
3. Note the current state of the heart/favourite icon (outlined = not favourited)
4. Click the heart icon
5. Observe the icon changes to filled/coloured

**Expected Result:**
- Heart icon changes from outlined to filled
- No error message appears

---

### TC-FAV-002: Remove Event from Favourites

**Description:**
Verify that clicking a filled favourite icon removes the item from favourites.

**Prerequisites:**
- User is logged in with at least one favourited event

**Steps:**
1. Navigate to Events page
2. Find a favourited event (heart icon filled/coloured)
3. Click the filled heart icon
4. Observe the icon

**Expected Result:**
- Heart icon reverts to outline state
- Item is removed from favourites

---

### TC-FAV-003: Favourited Items Appear in Profile

**Description:**
Verify that items favourited from various pages appear in the "My Favourites" section of the user profile.

**Prerequisites:**
- User is logged in and has favourited at least one item

**Steps:**
1. Favourite one urgent need from the homepage
2. Favourite one event from the Events page
3. Navigate to User Profile
4. Scroll to "My Favourites" section

**Expected Result:**
- Both the urgent need and event appear in the Favourites section
- Items show their title and location

---

### TC-FAV-004: Remove Favourite from Profile Page

**Description:**
Verify that favourites can be removed from the profile page.

**Prerequisites:**
- User has at least one item in their Favourites

**Steps:**
1. Navigate to User Profile > My Favourites
2. Click the remove/unfavourite button on an item
3. Observe the list

**Expected Result:**
- Item is removed from the Favourites list
- List updates immediately

---

### TC-FAV-005: Favourites Persist After Page Refresh

**Description:**
Verify that favourited items persist in the database and are still shown after refreshing the page.

**Prerequisites:**
- User logged in with at least one favourite

**Steps:**
1. Add a favourite item (event or urgent need)
2. Refresh the browser page
3. Log in again if session expired
4. Navigate to User Profile > My Favourites

**Expected Result:**
- Previously favourited items are still present
- Favourites were not lost on refresh

---

### TC-FAV-006: Favourite Button Not Available When Not Logged In

**Description:**
Verify that unauthenticated users cannot interact with favourite buttons.

**Prerequisites:**
- No user is logged in

**Steps:**
1. Navigate to Urgent Needs section on homepage
2. Observe the favourite icons on cards

**Expected Result:**
- Favourite buttons are either absent or disabled for unauthenticated users
- Clicking (if available) does not save a favourite or redirects to login

---

## 14. Business Partner Team Management Tests

### Overview
These tests specifically cover the VolunteerBusinessPartnerSection component that appears on both the volunteer's profile (showing their connections) and the business partner profile (showing their team). These tests focus on the relational management between these two entities.

---

### TC-BPTEAM-001: Volunteer Can View Current Business Partner Connections

**Description:**
Verify that a volunteer can see all their current business partner relationships in their profile.

**Prerequisites:**
- Volunteer is logged in and has at least one business partner relationship

**Steps:**
1. Log in as demo volunteer
2. Navigate to User Profile
3. Scroll to "My Coordinating Partners" section

**Expected Result:**
- Section lists all connected business partners
- Each entry shows: partner name, relationship status, joined date
- Status accurately reflects: invited, pending, active, or released

---

### TC-BPTEAM-002: Status Badge Colors Are Correct

**Description:**
Verify that relationship status badges use distinct, appropriate colours.

**Prerequisites:**
- User has relationships with various statuses

**Steps:**
1. Navigate to the relevant connections section
2. Observe status badges of various statuses

**Expected Result:**
- "Active" = green badge
- "Invited" = blue/teal badge
- "Pending" = yellow/orange badge
- "Released" = grey/red badge

---

### TC-BPTEAM-003: Volunteer Cannot See Other Users' Relationships

**Description:**
Verify that a volunteer only sees their own business partner relationships, not those of other volunteers.

**Prerequisites:**
- Multiple volunteers with relationships exist in the database

**Steps:**
1. Log in as demo volunteer (anna.kowalska)
2. Navigate to User Profile > Coordinating Partners
3. Note the relationships shown

**Expected Result:**
- Only relationships belonging to the currently logged-in volunteer are shown
- Other volunteers' relationships are not visible

---

## 15. Contact Form Tests

### Overview
The contact form allows visitors and users to send inquiries to the Hearty Foundation. These tests verify form validation and submission behaviour.

---

### TC-CONT-001: Contact Form Accessible from Home Page

**Description:**
Verify that the contact form is accessible via the "Request Information" button on the homepage.

**Prerequisites:**
- Application loaded on home page

**Steps:**
1. Locate the "Request Information" button on the homepage
2. Click it
3. Observe the page

**Expected Result:**
- Contact form page loads
- Form fields are visible

---

### TC-CONT-002: Contact Form Required Fields

**Description:**
Verify that the contact form requires Full Name, Email, and Message.

**Prerequisites:**
- Contact form is open

**Steps:**
1. Leave all fields empty
2. Click "Submit" or equivalent
3. Observe validation

**Expected Result:**
- Error messages appear for all required fields
- Form is not submitted

---

### TC-CONT-003: Phone Number Optional

**Description:**
Verify that the phone number field on the contact form is optional and its absence does not block submission.

**Prerequisites:**
- Contact form is open

**Steps:**
1. Fill Full Name, Email, and Message
2. Leave Phone Number empty
3. Submit the form

**Expected Result:**
- Form submits successfully without phone number
- No error about missing phone

---

### TC-CONT-004: Email Validation on Contact Form

**Description:**
Verify that the email field on the contact form requires a valid email format.

**Prerequisites:**
- Contact form is open

**Steps:**
1. Enter Full Name: `Test Person`
2. Enter Email: `invalid-email`
3. Enter Message: `Test message`
4. Submit
5. Observe

**Expected Result:**
- Submission blocked
- Error indicates invalid email format

---

### TC-CONT-005: Successful Contact Form Submission

**Description:**
Verify that a valid contact form submission succeeds and shows a confirmation.

**Prerequisites:**
- Contact form is open

**Steps:**
1. Enter Full Name: `Test User`
2. Enter Email: `test.user@example.com`
3. Enter Phone: `+48 987 654 321` (optional)
4. Enter Message: `Hello, I would like more information about volunteering opportunities.`
5. Click "Submit"

**Expected Result:**
- Success message is displayed
- Form resets or success page appears

---

## 16. Responsive Design Tests

### Overview
The platform should be fully usable across desktop, tablet, and mobile screen sizes. These tests verify that key layouts and interactions work at different viewport widths.

---

### TC-RESP-001: Homepage Layout at Mobile Width (375px)

**Description:**
Verify that the homepage is usable and readable at mobile width without horizontal scrolling.

**Prerequisites:**
- Browser resized to 375px width (iPhone equivalent)

**Steps:**
1. Set browser viewport to 375px width
2. Navigate to home page
3. Scroll through the entire page
4. Check for horizontal overflow

**Expected Result:**
- No horizontal scrollbar
- All content is readable without zooming
- Buttons are large enough to tap
- Text does not overflow its containers

---

### TC-RESP-002: Header Navigation at Mobile Width

**Description:**
Verify that the header collapses to a hamburger menu on mobile and all navigation is accessible.

**Prerequisites:**
- Mobile viewport (< 768px)

**Steps:**
1. Resize to mobile width
2. Observe the header
3. Click the hamburger icon
4. Verify all navigation links are accessible

**Expected Result:**
- Desktop navigation links hidden
- Hamburger icon visible
- Mobile menu opens with all navigation options
- Each navigation option is tappable

---

### TC-RESP-003: Volunteer Opportunities Grid at Tablet Width (768px)

**Description:**
Verify that the opportunities grid adjusts appropriately at tablet width.

**Prerequisites:**
- Browser at 768px width

**Steps:**
1. Navigate to Volunteer Opportunities at 768px
2. Observe the grid layout

**Expected Result:**
- Cards display in a 2-column grid (or similar appropriate layout)
- Cards are not stretched or cramped
- Text is readable

---

### TC-RESP-004: Events Page Grid at Desktop Width (1280px)

**Description:**
Verify that the events page uses a 4-column grid at desktop width.

**Prerequisites:**
- Browser at 1280px width

**Steps:**
1. Navigate to Events page at 1280px viewport
2. Observe the card grid

**Expected Result:**
- 4 columns of event cards are displayed
- Cards are evenly spaced
- All card content is visible

---

### TC-RESP-005: Login Modal Usable on Mobile

**Description:**
Verify that the login modal is functional and usable on mobile viewports.

**Prerequisites:**
- Mobile viewport

**Steps:**
1. Set mobile viewport
2. Click Log In in mobile menu
3. Select a login type
4. Observe the modal

**Expected Result:**
- Modal opens and is properly sized for mobile
- Input fields are accessible and touchable
- "Log In" button is accessible
- Modal can be closed
- No overflow outside of viewport

---

## 17. Access Control Tests

### Overview
The platform implements access control based on user type and verification status. These tests verify that read-only users cannot perform write actions, and that different user types only see features relevant to their role.

---

### TC-ACC-001: Not-Verified Volunteer Has Read-Only Access

**Description:**
Verify that a volunteer with "not_verified" status and "read_only" access level cannot create posts, like, comment, or sign up for opportunities.

**Prerequisites:**
- A volunteer account with verification_status "not_verified" exists

**Steps:**
1. Log in as the not-verified volunteer
2. Navigate to the dashboard feed
3. Check for "Create Post" section
4. Try to like a post
5. Try to comment on a post
6. Navigate to Urgent Needs and try to sign up

**Expected Result:**
- No "Create Post" input visible, or it is disabled
- Like button absent or non-functional
- Comment input absent or non-functional
- Sign up button absent or shows a "verification required" message

---

### TC-ACC-002: Verified Volunteer Has Full Access

**Description:**
Verify that a verified volunteer with "full_access" can use all interactive features.

**Prerequisites:**
- Demo volunteer (`anna.kowalska@example.com`) has verified status and full access

**Steps:**
1. Log in as demo volunteer
2. Navigate to dashboard
3. Check for "Create Post" section
4. Like a post
5. Comment on a post
6. Sign up for an urgent need
7. RSVP to an event

**Expected Result:**
- "Create Post" input is visible and functional
- Can like posts
- Can add comments
- Can sign up for opportunities
- Can RSVP to events

---

### TC-ACC-003: Business Partner Profile Not Shown for Volunteer

**Description:**
Verify that a logged-in volunteer does not see the Business Partner team management interface on their profile.

**Prerequisites:**
- Volunteer logged in

**Steps:**
1. Log in as demo volunteer
2. Navigate to User Profile
3. Check for "Manage Volunteers" button, volunteer team stats, and invite/register modals

**Expected Result:**
- "Manage Volunteers" section is NOT visible
- No business partner team management components shown
- Profile shows volunteer-specific sections only

---

### TC-ACC-004: Volunteer Profile Not Shown for Business Partner

**Description:**
Verify that a logged-in business partner does not see volunteer-specific sections (e.g., Coordinating Partners) as their primary view.

**Prerequisites:**
- Business partner logged in

**Steps:**
1. Log in as demo business partner
2. Navigate to User Profile
3. Check for volunteer-specific sections

**Expected Result:**
- Business partner team management view is shown
- The "My Coordinating Partners" (volunteer view) is NOT the primary section shown
- Organisation-specific interface is displayed

---

### TC-ACC-005: Unauthenticated User Cannot Access Profile Page

**Description:**
Verify that navigating to the User Profile without being logged in either redirects to home or shows a login prompt.

**Prerequisites:**
- No user is logged in

**Steps:**
1. Ensure you are logged out
2. Look for or manually attempt to navigate to the profile page
3. Observe

**Expected Result:**
- Profile page is not accessible without login
- User is redirected to home page, or a login prompt is shown
- Profile data of any user is not exposed

---

### TC-ACC-006: Care Facility Sees Organisation Statistics Not Volunteer Features

**Description:**
Verify that a care facility user's profile shows the Organisation Statistics dashboard and not volunteer or business partner specific features.

**Prerequisites:**
- Care facility logged in

**Steps:**
1. Log in as demo care facility user
2. Navigate to User Profile
3. Observe the sections displayed

**Expected Result:**
- Organisation Statistics component is visible
- No "Manage Volunteers" dropdown (business partner feature) shown
- No "My Coordinating Partners" (volunteer feature) shown

---

### TC-ACC-007: Submit Idea Available to All Authenticated Users

**Description:**
Verify that all authenticated users, including those with read-only/not-verified status, can submit ideas to the foundation.

**Prerequisites:**
- Any authenticated user is logged in (including not-verified)

**Steps:**
1. Log in as any user
2. Navigate to User Profile or look for "Submit Idea" in the UI
3. Click "Submit Idea"
4. Fill in a title and description
5. Submit

**Expected Result:**
- Submit Idea functionality is accessible regardless of verification status
- Idea is submitted successfully
- Success message or notification appears

---

### TC-ACC-008: In-Verification User Sees Notification Banner

**Description:**
Verify that users with "in_verification" status see a notification informing them their account is under review.

**Prerequisites:**
- A user with status "in_verification" is logged in

**Steps:**
1. Log in as a newly registered user with status "in_verification"
2. Navigate the platform
3. Look for a notification or banner

**Expected Result:**
- A visible notification or banner informs the user their account is being reviewed
- The banner may include a "Submit Idea" link or encouragement to engage while waiting

---

## Appendix: Test Data

### Demo Accounts

| Role | Email | Password | Access Level | Verification Status |
|------|-------|----------|--------------|---------------------|
| Volunteer | anna.kowalska@example.com | volunteer123 | full_access | verified |
| Business Partner | sponsor@example.com | sponsor123 | full_access | verified |
| Care Facility | sunshine@example.com | sunshine123 | full_access | verified |

### Common Test File Types

| Purpose | Acceptable Formats | Max Size |
|---------|-------------------|----------|
| ID Document | PDF, JPEG, PNG | 5 MB |
| Certifications | PDF, JPEG, PNG | 5 MB |
| Org Documents | PDF, DOC, DOCX, JPG, PNG | 10 MB |
| Profile Photos | JPG, PNG | 5 MB |

### Test Category Values

| Category | Display Colour |
|----------|---------------|
| education_math | Blue |
| education_english | Green |
| education_polish | Purple/Violet |
| sports | Orange |
| arts | Pink |
| health | Red |

---

## Document Version History

**Version 1.0 (April 19, 2026):**
- Initial comprehensive test cases
- 8 test modules covering all major features
- 100+ individual test cases
- Covers authentication, registration, navigation, profile, team management, favourites, access control, and responsive design

---

*For questions about these test cases, contact: contact@hearthy.org*
