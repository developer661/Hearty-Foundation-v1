export type OrgRole = 'org_admin' | 'opportunity_manager' | null;

interface Profile {
  user_type: 'volunteer' | 'care_facility_ngo' | 'business_partner';
  org_role?: OrgRole;
  verification_status: string;
}

const isOrgAccount = (p: Profile) =>
  p.user_type === 'care_facility_ngo' || p.user_type === 'business_partner';

/** Can create or edit opportunities */
export const canCreateOpportunity = (p: Profile) =>
  isOrgAccount(p) && (p.org_role === 'org_admin' || p.org_role === 'opportunity_manager');

/** Full admin: manage users, org settings, everything */
export const isOrgAdmin = (p: Profile) =>
  isOrgAccount(p) && p.org_role === 'org_admin';

/** Label for display */
export const getOrgRoleLabel = (role: OrgRole): string => {
  switch (role) {
    case 'org_admin': return 'Organization Administrator';
    case 'opportunity_manager': return 'Opportunity Manager';
    default: return 'Volunteer';
  }
};

export const getOrgRoleBadgeColor = (role: OrgRole): string => {
  switch (role) {
    case 'org_admin': return 'bg-red-100 text-red-700 border-red-200';
    case 'opportunity_manager': return 'bg-blue-100 text-blue-700 border-blue-200';
    default: return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};
