# Hearty Foundation - Volunteer Platform Documentation

**Version:** 1.0
**Last Updated:** March 4, 2026
**Platform Type:** Web Application
**Technology Stack:** React, TypeScript, Supabase, Tailwind CSS

---

## Table of Contents

1. [Introduction](#introduction)
2. [Platform Overview](#platform-overview)
3. [User Roles](#user-roles)
4. [Getting Started](#getting-started)
5. [Registration Procedures](#registration-procedures)
6. [Using the Platform](#using-the-platform)
7. [Features by User Role](#features-by-user-role)
8. [Dashboard Guide](#dashboard-guide)
9. [Profile Management](#profile-management)
10. [Support & Contact](#support--contact)

---

## 1. Introduction

### What is Hearty Foundation Volunteer Platform?

The Hearty Foundation Volunteer Platform is a comprehensive volunteer management system that connects volunteers with care facilities, NGO organizations, and business partners. The platform facilitates meaningful connections, tracks volunteer activities, and creates a supportive community dedicated to helping children through education and volunteer support.

### Key Benefits

- **For Volunteers:** Find meaningful volunteer opportunities, earn recognition, connect with like-minded individuals
- **For Care Facilities/NGOs:** Access a pool of qualified volunteers, manage volunteer assignments, track impact
- **For Business Partners:** Build and manage volunteer teams, contribute to community initiatives, track corporate social responsibility activities

### Platform Statistics

- 850+ Active Volunteers
- 12,500+ Volunteer Hours Completed
- 3,200+ Lives Impacted

---

## 2. Platform Overview

### Main Components

The platform consists of several key sections:

#### **Public Pages** (Accessible without login)
- **Homepage:** Overview of the foundation and its mission
- **Volunteer Opportunities:** Browse available volunteer positions
- **About Us:** Information about Hearty Foundation
- **Contact Form:** Request information or assistance

#### **Authenticated Areas** (Requires login)
- **Dashboard:** Social feed with posts, urgent needs, events, and rankings
- **User Profile:** Personal information, activities, achievements
- **Events Calendar:** Upcoming volunteer events
- **Business Partner Management:** Team coordination tools (for business partners)
- **Organization Statistics:** Impact metrics (for care facilities/NGOs)

### Navigation Structure

**Main Menu:**
- About Us
- Dashboard
- Urgent Needs (dropdown with categories)
- Join (dropdown for registration)
- Log In (dropdown by role)
- User Menu (when logged in)

---

## 3. User Roles

### 3.1 Volunteer

**Purpose:** Individuals who want to contribute their time and skills to help children and communities.

**Capabilities:**
- Browse and sign up for volunteer opportunities
- Participate in events
- Create posts and engage with community
- Earn points and climb volunteer rankings
- Join business partner teams
- Track volunteer activities and achievements

**Verification Levels:**
- **Not Verified:** Initial state, read-only access
- **In Verification:** Under review by administrators
- **Verified:** Full access to all features
- **Rejected:** Registration declined

### 3.2 Care Facility / NGO Organization

**Purpose:** Organizations that need volunteer support for their programs and activities.

**Capabilities:**
- Post volunteer opportunities
- Manage volunteer assignments
- View organization statistics
- Track volunteer engagement
- Participate in community as volunteers

**Organization Types:**
- NGO Organization
- Care Facility
- Teacher
- School
- Other

### 3.3 Business Partner

**Purpose:** Companies and corporate sponsors who want to organize employee volunteer programs or support community initiatives.

**Capabilities:**
- Manage volunteer teams
- Invite and register volunteers
- Track team activities
- Record corporate social responsibility initiatives
- Monitor volunteer participation and impact

### 3.4 Administrator

**Purpose:** Platform administrators who manage user verifications and moderate content.

**Capabilities:**
- Approve/reject registrations
- Change user verification status
- Grant access levels
- Review submitted ideas
- Moderate content

---

## 4. Getting Started

### System Requirements

**Browser Compatibility:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Device Compatibility:**
- Desktop computers
- Laptops
- Tablets
- Mobile phones

**Internet Connection:**
- Stable internet connection required
- Minimum speed: 1 Mbps

### First Visit

When you first visit the platform:

1. You will see the homepage with information about Hearty Foundation
2. Browse volunteer opportunities without logging in
3. Read testimonials from current volunteers
4. View partner organizations
5. Choose to register or log in when ready

---

## 5. Registration Procedures

### 5.1 Volunteer Registration

**Step-by-Step Process:**

1. **Access Registration Page**
   - Click "Join" in the main menu
   - Select "Join as a Volunteer"
   - Alternatively, visit the Volunteer Opportunities page and click "Register as Volunteer"

2. **Complete Required Fields**
   - First Name
   - Last Name
   - Email Address (will be your login)
   - Password (minimum 8 characters)
   - Confirm Password

3. **Add Optional Information** (Recommended)
   - Phone Number
   - Date of Birth
   - Profession
   - Previous Volunteer Experience
   - Motivation for Volunteering

4. **Upload Documents** (Required)
   - ID Document (PDF, JPEG, or PNG, max 5MB)
   - Certifications (optional, PDF, JPEG, or PNG, max 5MB)

5. **Submit Registration**
   - Review all information
   - Click "Submit Registration"
   - You will see a success message

6. **Initial Access**
   - Your account is created with **read-only access**
   - Status: **Not Verified**
   - You can log in and browse content
   - Cannot post, like, or sign up for opportunities yet

7. **Verification Process**
   - Administrators review your documents
   - Status changes to **In Verification**
   - Wait for approval (typically 1-3 business days)

8. **Full Access Granted**
   - Once approved, status changes to **Verified**
   - Access level changes to **Full Access**
   - You can now use all platform features

**Important Notes:**
- Use a valid email address (required for login)
- Choose a strong password
- Upload clear, readable documents
- Provide accurate information

### 5.2 Care Facility / NGO Registration

**Step-by-Step Process:**

1. **Access Registration Page**
   - Click "Join" in the main menu
   - Select "Join as Care Facility/NGO Organisation"

2. **Select Organization Type**
   - NGO Organisation
   - Care Facility
   - Teacher
   - School
   - Other

3. **Complete Required Fields**
   - Organization Name
   - Date of Establishment
   - Business Profile (brief summary, max 500 characters)
   - Main Address
   - Email Address (login)
   - Password (minimum 8 characters)
   - Confirm Password

4. **Add Conditional Fields**
   - **KRS Number** (required for NGO and Care Facility types)
   - Legal registration number in Poland

5. **Optional Information**
   - Detailed Description (max 2000 characters)
   - Secondary Address (if applicable)
   - Photo Gallery (up to 5 photos, JPG/PNG, max 5MB each)

6. **Upload Required Documents**
   - **For NGO/Care Facility:**
     - KRS Certificate
     - Establishment Decision
     - Operating License
   - **For Teacher:**
     - Agreement with School
     - Teaching Certificate
   - **For School:**
     - School Registration
     - Operating License
   - **For Other:**
     - Relevant Registration Documents

   *Accepted formats: PDF, DOC, DOCX, JPG, PNG (max 10MB per file)*

7. **Submit Registration**
   - Review all information
   - Click "Submit Registration"
   - Success message displayed

8. **Initial Status**
   - Account created with status: **In Verification**
   - Read-only access granted
   - Can browse platform and submit ideas

9. **Verification Process**
   - Administrators verify organization legitimacy
   - Review documents and registration details
   - Typical timeframe: 2-5 business days

10. **Full Access**
    - Status changes to **Verified**
    - Full access granted
    - Can post opportunities and manage volunteers

**Important Notes:**
- Ensure KRS number is accurate (if applicable)
- Upload official documents only
- Provide complete organization details
- Secondary address useful for multi-location organizations

### 5.3 Business Partner Registration

**Step-by-Step Process:**

1. **Access Registration Page**
   - Click "Join" in the main menu
   - Select "Join as Business Partner"

2. **Complete Company Information**
   - Company Name
   - Date of Establishment
   - Business Profile (company mission and partnership goals)
   - Company Address
   - NIP (Tax ID Number)

3. **Add Contact Details**
   - Contact Person Name
   - Phone Number
   - Email Address (login)
   - Password (minimum 8 characters)
   - Confirm Password

4. **Upload Supporting Documents**
   - Company registration documents
   - Tax identification certificate
   - Authorization letter (if applicable)

   *Accepted formats: PDF, PNG, JPG (max 10MB per file)*
   *At least one document required*

5. **Submit Registration**
   - Review all information
   - Click "Submit Registration"
   - Success message displayed

6. **Initial Status**
   - Account created with status: **Pending**
   - Verification status: **In Verification**
   - Read-only access granted

7. **Verification Process**
   - Administrators verify company legitimacy
   - Review business documents
   - May contact for additional information
   - Typical timeframe: 3-7 business days

8. **Approval**
   - Status changes to **Approved**
   - Verification status: **Verified**
   - Full access granted
   - Can manage volunteer teams

**Important Notes:**
- Provide official company documentation
- NIP number must be valid
- Contact person should be authorized representative
- Email used for all communications

---

## 6. Using the Platform

### 6.1 Logging In

**Login Procedure:**

1. **Access Login**
   - Click "Log In" in the main menu
   - Select your role:
     - Log In as Volunteer
     - Log In as Care Facility/NGO Organisation
     - Log In as Business Partner
     - Log In as Administrator

2. **Enter Credentials**
   - Email Address (used during registration)
   - Password

3. **Submit**
   - Click "Log In" button
   - Wait for authentication

4. **Access Dashboard**
   - Upon successful login, redirected to dashboard
   - See personalized content based on your role

**Login Issues:**

If you cannot log in:
- Verify email address is correct
- Check password (case-sensitive)
- Ensure account has been created
- Contact support if issues persist

**Demo Accounts Available:**
- **Volunteer:** anna.kowalska@example.com / volunteer123
- **Business Partner:** sponsor@example.com / sponsor123
- **Care Facility:** sunshine@example.com / sunshine123

### 6.2 Navigating the Dashboard

The dashboard is your central hub for all activities:

**Layout:**
- **Left Column:** Your profile summary
- **Center Column:** Activity feed with posts
- **Right Column:** Urgent needs, events, and rankings

**Key Actions:**
- Create posts (if verified)
- Browse community content
- Sign up for opportunities
- View upcoming events
- Check your ranking
- Manage favorites

### 6.3 Submitting Ideas

All users, including those in verification, can submit ideas:

1. **Access Idea Submission**
   - Look for notification banner if in verification
   - Click "Submit Idea" button
   - Or access from user menu

2. **Fill Out Form**
   - Title (max 200 characters)
   - Description (max 2000 characters)
   - Category (optional):
     - Event / Activity
     - Program / Initiative
     - Partnership Opportunity
     - Platform Improvement
     - Fundraising
     - Other

3. **Submit**
   - Click "Submit Idea"
   - Success notification displayed
   - Idea sent to administrators for review

4. **Tracking**
   - Ideas tracked in database
   - Status: Pending → Under Review → Approved/Rejected
   - Future: Email notifications planned

---

## 7. Features by User Role

### 7.1 Volunteer Features

#### **All Volunteers (Including Not Verified)**

**Browse Content:**
- View dashboard with read-only access
- Browse posts (cannot like or comment)
- View urgent needs
- View events calendar
- See volunteer rankings

**Favorites:**
- Favorite urgent needs
- Favorite events
- View favorites in profile

**Communication:**
- Submit ideas to foundation
- Contact foundation via contact form

#### **Verified Volunteers (Full Access)**

**Social Engagement:**
- Create posts in feed
- Like posts from others
- Comment on posts
- Filter posts by category and location

**Volunteer Activities:**
- Sign up for urgent needs
- RSVP to events
- View current engagements
- Track participated projects

**Business Partner Relationships:**
- Search for business partners
- Request to join partner teams
- View relationship status
- Cancel pending requests
- View coordinating partners

**Profile Management:**
- Edit profile information
- Manage skills and interests
- Upload profile picture
- Update bio and location

**Points & Recognition:**
- Earn points for activities
- Climb volunteer ranking
- View activity history
- Track achievements

**Available Categories for Volunteering:**
- Teaching & Tutoring
- Mentorship Programs
- Arts & Music Education
- Sports & Physical Activities
- Technology & Digital Skills
- Language Learning Support
- Health & Wellness
- Community Service

### 7.2 Care Facility / NGO Features

#### **All Care Facility Features**
(Includes all verified volunteer features, plus:)

**Opportunity Management:**
- Post volunteer opportunities
- Set urgency level (urgent/immediate/ongoing)
- Categorize opportunities
- Update opportunity status

**Volunteer Management:**
- View volunteer applications
- Assign volunteers to opportunities
- Track volunteer progress
- Manage volunteer assignments

**Statistics Dashboard:**
- View active volunteers
- Track opportunities posted
- Monitor completed projects
- Measure impact metrics
- Analyze volunteer engagement

**Organization Profile:**
- Display organization information
- Showcase facilities and programs
- Upload photos
- Share mission and goals

### 7.3 Business Partner Features

#### **All Business Partner Features**
(Includes all verified volunteer features, plus:)

**Volunteer Team Management:**

1. **Find & Invite Volunteer**
   - **Purpose:** Search existing verified volunteers and invite them to join your team
   - **Process:**
     - Click "Find & Invite Volunteer" button
     - Search modal opens
     - Search by name or location
     - View volunteer profiles (bio, skills, points)
     - Click "Invite" on desired volunteer
     - Invitation sent with status: **invited**
   - **Follow-up:** Volunteer receives invitation and can accept/decline

2. **Register New Volunteer**
   - **Purpose:** Directly register a volunteer and add them to your team
   - **Process:**
     - Click "Register New Volunteer" button
     - Registration form modal opens
     - Fill volunteer details:
       - Full Name
       - Email
       - Location
       - Skills (comma-separated)
       - Interests (comma-separated)
       - Bio
     - Click "Register"
     - Volunteer account created with:
       - User type: Volunteer
       - Verification status: **Verified**
       - Access level: **Full Access**
       - Relationship status: **Active** (auto-linked to your team)
   - **Benefit:** Immediate onboarding, no waiting for verification

3. **Invite Volunteer**
   - **Purpose:** Send invitation to specific volunteer
   - **Process:**
     - Click "Invite Volunteer" button
     - Invite modal opens
     - Search for volunteer by name
     - Select volunteer from results
     - Click "Invite"
     - Invitation sent with status: **invited**

**View All Volunteers:**
- See all volunteers linked to your team
- Filter by relationship status:
  - **Invited:** You sent invitation, awaiting response
  - **Pending:** Volunteer requested to join, awaiting approval
  - **Active:** Relationship confirmed, volunteer is on your team
  - **Released:** Relationship ended
- View volunteer details:
  - Name, email, location
  - Skills and interests
  - Points and verification status
- Add notes about volunteers
- Track joined date

**Volunteer Requests:**
- Review volunteer join requests
- Approve or reject requests
- View volunteer profiles before deciding

**Relationship Management:**
- Release volunteers from team (ends relationship)
- View relationship history
- Track joined and released dates
- Add relationship notes

**Activity Tracking:**
- Record business partner activities:
  - Events organized
  - Activities sponsored
  - Donations
  - Collaborations
- Track activity details:
  - Title and description
  - Date and location
  - Participant counts
  - Amount contributed
  - Status (planned/ongoing/completed/cancelled)

**Impact Measurement:**
- View number of volunteers managed
- Track total volunteer hours
- Monitor team activities
- Measure corporate social responsibility impact

---

## 8. Dashboard Guide

### 8.1 Dashboard Layout

The dashboard uses a three-column layout:

**Left Column (User Profile Sidebar):**
- Your avatar or initials
- Full name
- Location
- Points badge
- Bio summary
- Skills count
- Interests count
- "View Full Profile" button

**Center Column (Post Feed):**
- Create post section (if verified)
- Filter options (category and location)
- Post cards with:
  - Author information
  - Category badge
  - Post content
  - Like and comment buttons
  - Comment section

**Right Column (Quick Access Widgets):**
- Urgent Needs Dashboard
- Upcoming Events
- Volunteer Ranking

### 8.2 Creating Posts

**For Verified Users Only:**

1. **Access Create Post**
   - Located at top of center column
   - Textarea: "Share your volunteer experience or ask for help..."

2. **Write Content**
   - Type your post content
   - Be specific and engaging
   - Share experiences, ask questions, or offer help

3. **Select Category**
   - Click category dropdown
   - Options:
     - Math Education (blue badge)
     - English Education (green badge)
     - Polish Education (purple badge)
     - Health & Wellness (red badge)
     - Events (orange badge)
     - Community Service (teal badge)

4. **Set Location**
   - Enter location (defaults to "Warsaw, Poland")
   - Helps volunteers find local opportunities

5. **Submit Post**
   - Click "Post" button
   - Post appears in feed immediately
   - Others can like and comment

**Best Practices:**
- Write clear, concise posts
- Use appropriate categories
- Include specific details (dates, times, locations)
- Be respectful and professional
- Share positive experiences

### 8.3 Engaging with Posts

**Liking Posts:**
- Click heart icon on any post
- Heart fills with red color
- Like count increases
- Click again to unlike

**Commenting:**
- Click comment icon on post
- Comment section expands
- Type your comment in text box
- Press Enter or click "Post" to submit
- Your comment appears with timestamp

**Viewing Comments:**
- Click comment icon to expand/collapse
- See all comments with:
  - Author avatar
  - Author name
  - Comment text
  - Timestamp

### 8.4 Urgent Needs Widget

**Purpose:** Quick access to critical volunteer opportunities

**Features:**
- Displays up to 5 urgent needs
- Filtered by your location
- Shows:
  - Opportunity title
  - Institution name
  - Location
  - Category badge
  - Favorite button
  - Sign-up button (if verified)

**Actions:**
1. **Favorite an Opportunity**
   - Click heart icon
   - Added to your favorites
   - Access from profile page

2. **Sign Up for Opportunity**
   - Click "Sign Up" button
   - Confirmation displayed
   - Added to "Current Engagements"
   - Tracked in profile

**Read-Only Users:**
- Can view all opportunities
- Can favorite opportunities
- Cannot sign up (need full access)

### 8.5 Upcoming Events Widget

**Purpose:** Stay informed about volunteer events

**Features:**
- Displays next 5 events
- Filtered by your location
- Shows:
  - Event date (formatted)
  - Event title
  - Organizer
  - Location
  - Category badge
  - Attendees count
  - Favorite button
  - RSVP button (if verified)

**Actions:**
1. **Favorite an Event**
   - Click heart icon
   - Added to favorites
   - Quick access from profile

2. **RSVP to Event**
   - Click "RSVP" button
   - Confirm attendance
   - Attendee count increases
   - Event tracked in profile

3. **View All Events**
   - Click "View All" link
   - Opens full events page
   - See complete calendar
   - Filter by category and location

### 8.6 Volunteer Ranking Widget

**Purpose:** Recognize top volunteers and motivate participation

**Features:**
- Displays top 10 volunteers
- Shows:
  - Rank number (1-10)
  - Avatar or initials
  - Full name
  - Points total
- Special badges for top 3:
  - 1st place: Gold badge
  - 2nd place: Silver badge
  - 3rd place: Bronze badge
- Current user highlighted in different color

**How Points are Earned:**
- Completing volunteer work
- Creating posts
- Commenting on posts
- Attending events
- Active participation

**Viewing Your Rank:**
- Look for your name (highlighted)
- Check your position
- See points total
- Track progress

---

## 9. Profile Management

### 9.1 Accessing Your Profile

**From Dashboard:**
- Click "User Profile" in user menu (top right)
- Or click "View Full Profile" in left sidebar

**From Any Page:**
- User menu always accessible in header
- Click your name dropdown
- Select "User Profile"

### 9.2 Volunteer Profile Sections

#### **Profile Header**
- Avatar or initials
- Full name
- Location
- Email address
- Verification status badge
- Access level display

#### **Profile Statistics**
- Total points earned
- Volunteer ranking position
- Activities completed
- Events attended

#### **Skills & Interests**
- List of your skills
- List of your interests
- Edit button to update

#### **Bio Section**
- Personal description
- Motivation for volunteering
- Edit button to update

#### **Participated Projects**
- List of opportunities you've signed up for
- Status tracking:
  - **Assigned:** Accepted into opportunity
  - **In Progress:** Currently participating
  - **Completed:** Finished volunteering
- Start dates
- Opportunity details

#### **Activity History**
- Timeline of your activities
- Types tracked:
  - Volunteered
  - Posted
  - Commented
  - Attended Event
- Points earned per activity
- Dates and descriptions

#### **Favorites Collection**
- Urgent needs you've favorited
- Events you've favorited
- Quick access to saved items
- Remove from favorites option

#### **My Coordinating Partners** (Volunteer only)
- List of business partners you're connected with
- Relationship statuses:
  - **Invited:** Partner invited you (pending your acceptance)
  - **Pending:** You requested to join (awaiting partner approval)
  - **Active:** Confirmed relationship
  - **Released:** Relationship ended
- Joined dates
- Partner details
- Actions:
  - Request to join new partners
  - Cancel pending requests
  - View partner profiles

**Finding Business Partners:**
1. Click "Find Partner" button
2. Search modal opens
3. Search by company name or location
4. View partner profiles:
   - Company name
   - Location
   - Bio
   - Points
5. Click "Request to Join"
6. Request sent (status: pending)
7. Wait for partner approval

### 9.3 Care Facility / NGO Profile

**Organization Statistics Dashboard:**
- Active volunteers count
- Total opportunities posted
- Completed projects count
- Impact metrics
- Volunteer engagement data

**Organization Details:**
- Organization name and type
- Date of establishment
- Business profile
- Addresses
- KRS number (if applicable)
- Photo gallery

**Volunteer Management:**
- View assigned volunteers
- Track volunteer progress
- Manage opportunity assignments

### 9.4 Business Partner Profile

**Volunteer Team Management Interface:**

**Three Action Buttons:**
1. "Find & Invite Volunteer" (search icon)
2. "Register New Volunteer" (user-plus icon)
3. "Invite Volunteer" (user-check icon)

**View All Volunteers Section:**
- Table/list of all volunteers
- Columns:
  - Name
  - Email
  - Location
  - Skills
  - Status
  - Joined Date
- Filter by status
- Action buttons per volunteer

**Business Partner Statistics:**
- Total volunteers managed
- Active volunteers count
- Activities organized
- Total impact

**Activity Tracking:**
- Record new activities
- View activity history
- Track participant counts
- Monitor contributions

### 9.5 Editing Profile Information

**Edit Profile Process:**

1. **Access Edit Mode**
   - Click "Edit Profile" button on profile page
   - Form fields become editable

2. **Update Information**
   - Full name
   - Location
   - Bio
   - Skills (comma-separated)
   - Interests (comma-separated)

3. **Upload Avatar** (Future feature)
   - Click avatar placeholder
   - Select image file
   - Crop and adjust
   - Save

4. **Save Changes**
   - Click "Save Changes" button
   - Confirmation message displayed
   - Profile updated in database

**Editable Fields:**
- Profile picture
- Full name
- Location
- Bio
- Skills list
- Interests list
- Phone number
- Availability

**Non-Editable Fields:**
- Email address (contact admin to change)
- User type
- Verification status
- Access level
- Points earned
- Registration date

---

## 10. Support & Contact

### 10.1 Getting Help

**Common Issues:**

**Cannot Log In:**
- Verify email and password
- Check if account is created
- Try password reset (future feature)
- Contact support

**Verification Taking Too Long:**
- Normal timeframe: 1-5 business days
- Check if all documents uploaded
- Ensure documents are clear and readable
- Contact support if exceeds timeframe

**Cannot Sign Up for Opportunity:**
- Verify you have full access
- Check verification status
- Complete profile if prompted
- Ensure opportunity is still active

**Cannot Post or Comment:**
- Verify you have full access (not read-only)
- Check verification status
- Must be verified volunteer/organization/partner

**Business Partner Cannot Invite Volunteers:**
- Verify account is verified
- Check if volunteer already on team
- Ensure volunteer exists in system
- Try different invitation method

### 10.2 Contact Information

**Hearty Foundation:**
- **Email:** contact@hearthy.org
- **Phone:** +48 123 456 789
- **Address:** Warsaw, Poland
- **Website:** https://www.serdeczna.org

**Contact Form:**
- Available on website
- Access from main menu
- Fill out:
  - Full Name
  - Email Address
  - Phone Number (optional)
  - Message
- Submit and wait for response

**Response Times:**
- General inquiries: 1-2 business days
- Technical support: 2-3 business days
- Verification issues: 1 business day
- Emergency: Call during business hours

### 10.3 Best Practices

**Account Security:**
- Use strong passwords (mix of letters, numbers, symbols)
- Do not share login credentials
- Log out on shared computers
- Update password periodically

**Profile Completeness:**
- Fill all optional fields for better matching
- Upload clear profile picture
- List relevant skills and interests
- Keep bio up-to-date
- Update availability regularly

**Community Guidelines:**
- Be respectful in posts and comments
- Use appropriate language
- Stay on topic
- Share constructive feedback
- Report inappropriate content
- Respect privacy of others

**Volunteer Engagement:**
- Sign up for opportunities you can commit to
- Show up on time
- Complete assigned tasks
- Communicate if unable to attend
- Provide feedback after volunteering
- Share experiences in posts

**For Business Partners:**
- Verify volunteers before inviting
- Provide clear instructions to team
- Track volunteer activities accurately
- Recognize volunteer contributions
- Maintain active communication
- Update activity records promptly

### 10.4 Frequently Asked Questions

**Q: How long does verification take?**
A: Typically 1-5 business days, depending on document completeness and volume.

**Q: Can I change my user type after registration?**
A: No, user type is permanent. Contact administrators for exceptional cases.

**Q: How are points calculated?**
A: Points are earned through activities: volunteering, posting, commenting, attending events. Specific values set by administrators.

**Q: Can I volunteer for multiple organizations?**
A: Yes, verified volunteers can sign up for multiple opportunities across different organizations.

**Q: Can business partners see volunteer personal information?**
A: Business partners can see name, email, location, skills, and interests of volunteers they manage. Full privacy policy applies.

**Q: What happens if I cancel a volunteer commitment?**
A: Contact the organization directly as soon as possible. Repeated cancellations may affect your account status.

**Q: Can I delete my account?**
A: Contact administrators to request account deletion. Some data may be retained per legal requirements.

**Q: Are there any fees to use the platform?**
A: No, the Hearty Foundation Volunteer Platform is completely free for all users.

**Q: Can I volunteer if I'm under 18?**
A: Some opportunities may have age restrictions. Check specific opportunity requirements and obtain parental consent if required.

**Q: How do I suggest improvements to the platform?**
A: Use the "Submit Idea" feature available to all users. Administrators review all suggestions.

---

## Appendix A: Verification Status Guide

### Status Definitions

**Not Verified:**
- Initial state after registration
- Account created, login possible
- Read-only access only
- Can view content and favorite items
- Cannot post, like, comment, or sign up

**In Verification:**
- Documents under review
- Administrators checking information
- Read-only access continues
- Can submit ideas
- Typical duration: 1-5 business days

**Verified:**
- Documents approved
- Full access granted
- Can use all platform features
- Can post, like, comment
- Can sign up for opportunities

**Rejected:**
- Registration declined
- Documents insufficient or invalid
- Read-only access only
- Contact administrators for clarification
- May resubmit with correct documentation

### Access Level Definitions

**Read-Only:**
- View posts, opportunities, events
- Browse community content
- Favorite items
- Submit ideas
- View rankings
- Cannot create posts
- Cannot like or comment
- Cannot sign up for opportunities

**Full Access:**
- All read-only features
- Create posts
- Like and comment
- Sign up for opportunities
- RSVP to events
- Join business partner teams
- Earn points
- Complete access to platform

---

## Appendix B: Category Guide

### Post Categories

**Math Education (Blue):**
- Math tutoring opportunities
- STEM programs
- Math competition support
- Educational resources

**English Education (Green):**
- English language tutoring
- Conversation practice
- Writing workshops
- ESL support

**Polish Education (Purple):**
- Polish language tutoring
- Literature programs
- Cultural education
- Language support for immigrants

**Health & Wellness (Red):**
- Health programs
- Mental health support
- Physical fitness activities
- Wellness workshops

**Events (Orange):**
- Community events
- Fundraisers
- Celebrations
- Special activities

**Community Service (Teal):**
- General volunteering
- Community projects
- Social initiatives
- Service programs

### Urgency Levels

**Urgent:**
- Immediate need
- Critical staffing shortage
- Time-sensitive opportunity
- High priority

**Immediate:**
- Soon-needed position
- Upcoming event support
- Near-term commitment
- Medium priority

**Ongoing:**
- Long-term commitment
- Regular volunteering
- Continuous programs
- Standard priority

---

## Appendix C: Point System

### How to Earn Points

**Volunteering Activities:**
- Complete volunteer assignments
- Attend volunteer sessions
- Finish projects
- Points vary by opportunity

**Social Engagement:**
- Create posts (contribution to community)
- Comment on posts (engagement)
- Active participation in discussions

**Event Participation:**
- Attend events
- RSVP and show up
- Participate actively

**Other Activities:**
- Complete profile (initial points)
- Reach milestones
- Special achievements

### Point Rankings

**Leaderboard:**
- Top 10 volunteers displayed
- Updated in real-time
- Based on total points
- Special badges for top 3

**Benefits of High Ranking:**
- Community recognition
- Highlighted in rankings widget
- Increased visibility
- Motivation for others
- Pride and accomplishment

---

## Appendix D: Technical Specifications

### Supported File Formats

**Documents:**
- PDF (.pdf)
- Microsoft Word (.doc, .docx)
- JPEG Images (.jpg, .jpeg)
- PNG Images (.png)

**Maximum File Sizes:**
- Registration documents: 5-10 MB
- Profile pictures: 5 MB
- Photo gallery: 5 MB per photo

### Browser Compatibility

**Recommended Browsers:**
- Google Chrome 90+
- Mozilla Firefox 88+
- Safari 14+
- Microsoft Edge 90+

**Mobile Browsers:**
- Chrome Mobile
- Safari Mobile
- Firefox Mobile

### Privacy & Security

**Data Protection:**
- Secure HTTPS connection
- Encrypted password storage
- Role-based access control
- Row-level security on database

**Information Collected:**
- Registration information
- Profile data
- Activity logs
- Usage analytics

**Information Shared:**
- Profile information (public)
- Posts and comments (public)
- Organization details (public)
- Private: password, documents, email (controlled access)

---

## Appendix E: Keyboard Shortcuts

### Global Shortcuts

- **Esc:** Close modals and dialogs
- **Enter:** Submit forms (when in text fields)
- **Ctrl/Cmd + Enter:** Submit comments quickly

### Navigation Shortcuts

*Future enhancement - not currently implemented*

---

## Document Version History

**Version 1.0 (March 4, 2026):**
- Initial comprehensive documentation
- Complete platform overview
- All user role procedures
- Feature descriptions
- Best practices and guidelines

---

## Glossary

**Access Level:** Permission level determining what actions a user can perform (read-only or full access)

**Business Partner:** Company or corporate sponsor managing volunteer teams

**Care Facility:** Organization providing care services, requiring volunteer support

**Dashboard:** Main interface showing posts, opportunities, events, and rankings

**Favorite:** Saved item (opportunity or event) for quick access

**Full Access:** Permission level allowing all platform features

**NGO:** Non-governmental organization focused on social causes

**Opportunity:** Volunteer position or assignment posted by organization

**Points:** Recognition system for volunteer activities and engagement

**Post:** Social media-style content shared in community feed

**Profile:** User account page showing information and activities

**Ranking:** Leaderboard showing top volunteers by points

**Read-Only:** Limited permission level allowing viewing but not interaction

**RSVP:** Confirm attendance to an event

**Status:** Current state of registration or relationship (invited, pending, active, etc.)

**Urgent Need:** Critical volunteer opportunity requiring immediate attention

**Verification:** Process of reviewing and approving user registrations

**Volunteer:** Individual contributing time and skills to help communities

---

**END OF DOCUMENTATION**

For additional support, visit: https://www.serdeczna.org
Contact: contact@hearthy.org | +48 123 456 789