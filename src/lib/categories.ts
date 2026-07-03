export const VOLUNTEER_CATEGORIES = [
  'Teaching & Tutoring',
  'Mentoring Programs',
  'Arts & Music Education',
  'Sports & Physical Activities',
  'Technology & Digital Skills',
  'Language Learning Support',
  'Healthcare Support',
  'Environmental & Nature',
  'Community Outreach',
  'Food & Nutrition',
  'Mental Health & Wellbeing',
  'Senior Care',
  'Children & Youth Support',
  'Animal Welfare',
  'Crisis & Emergency Response',
] as const;

export type VolunteerCategory = (typeof VOLUNTEER_CATEGORIES)[number];
