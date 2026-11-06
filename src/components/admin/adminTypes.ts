export type AdminSection = 'dashboard' | 'users' | 'queue' | 'moderation' | 'audit';

export type RequestType = 'volunteer' | 'business_partner' | 'care_facility_ngo' | 'foundation_ngo';
export type RequestStatus = 'pending' | 'approved' | 'rejected';
export type VerificationLevel = 'partially_verified' | 'verified';

export interface AdminRequest {
  id: string;
  request_type: RequestType;
  subject_table: string;
  subject_id: string;
  applicant_name: string;
  applicant_email: string;
  submitted_at: string;
  status: RequestStatus;
  verification_level: VerificationLevel | null;
  decided_at: string | null;
  decision_reason: string | null;
}

export interface AuditEntry {
  id: string;
  admin_name: string;
  action: string;
  entity_type: string;
  entity_label: string;
  previous_status: string | null;
  new_status: string | null;
  reason: string | null;
  created_at: string;
}

export const DOCUMENT_BUCKET = 'registration-documents';

export const REQUEST_TYPE_LABELS: Record<RequestType, string> = {
  volunteer: 'Volunteer',
  business_partner: 'Business partner',
  care_facility_ngo: 'Care facility / NGO',
  foundation_ngo: 'Foundation / NGO',
};

export const STATUS_LABELS: Record<RequestStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
};

export const VERIFICATION_LABELS: Record<VerificationLevel, string> = {
  partially_verified: 'Partially verified',
  verified: 'Verified',
};

export const PROFILE_VERIFICATION_LABELS: Record<string, string> = {
  not_verified: 'Not verified',
  in_verification: 'In verification',
  partially_verified: 'Partially verified',
  verified: 'Verified',
  rejected: 'Rejected',
};

const KNOWN_ADMIN_ERRORS = [
  'Not authorized',
  'Invalid decision',
  'Invalid action',
  'A reason is required',
  'Reason is too long',
  'Request not found',
  'This request has already been decided',
  'Content not found',
  'Content is already',
  'Unknown content type',
  'Unknown request type',
];

export const describeAdminError = (message: string) =>
  KNOWN_ADMIN_ERRORS.some((known) => message.startsWith(known))
    ? message
    : 'Something went wrong. Please try again.';

export const formatDateTime = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '-';

export const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' }) : '-';
