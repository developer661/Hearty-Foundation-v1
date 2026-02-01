export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  interest: string;
  message?: string;
  created_at: string;
}

export interface VolunteerFormData {
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  address: string;
  city: string;
  country: string;
  education_level: string;
  occupation: string;
  skills: string;
  availability: string;
  previous_experience: string;
  motivation: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
}
