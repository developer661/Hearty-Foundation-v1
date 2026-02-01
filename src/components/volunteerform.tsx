import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { VolunteerFormData } from '../types/volunteer';
import { Heart, Loader2 } from 'lucide-react';

interface VolunteerFormProps {
  onSuccess: () => void;
}

export function VolunteerForm({ onSuccess }: VolunteerFormProps) {
  const [formData, setFormData] = useState<VolunteerFormData>({
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    address: '',
    city: '',
    country: '',
    education_level: '',
    occupation: '',
    skills: '',
    availability: '',
    previous_experience: '',
    motivation: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('Form submission started');
    console.log('Form data:', formData);

    try {
      const { data, error: submitError } = await supabase
        .from('volunteers')
        .insert([formData])
        .select();

      console.log('Supabase response:', { data, error: submitError });

      if (submitError) {
        console.error('Submission error:', submitError);
        throw submitError;
      }

      console.log('Registration successful:', data);
      onSuccess();
    } catch (err) {
      console.error('Caught error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit registration');
    } finally {
      setLoading(false);
      console.log('Form submission completed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-semibold mb-4" style={{ color: '#091B27', fontFamily: 'DM Sans', fontWeight: 600 }}>Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium mb-2" style={{ color: '#091B27', fontFamily: 'DM Sans', fontWeight: 500 }}>
                Full Name *
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border transition-all"
                style={{ borderColor: '#AFAFAF', fontFamily: 'DM Sans' }}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#091B27', fontFamily: 'DM Sans', fontWeight: 500 }}>
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border transition-all" style={{ borderColor: '#AFAFAF', fontFamily: 'DM Sans' }}
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2" style={{ color: '#091B27', fontFamily: 'DM Sans', fontWeight: 500 }}>
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border transition-all" style={{ borderColor: '#AFAFAF', fontFamily: 'DM Sans' }}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div>
              <label htmlFor="date_of_birth" className="block text-sm font-medium mb-2" style={{ color: '#091B27', fontFamily: 'DM Sans', fontWeight: 500 }}>
                Date of Birth *
              </label>
              <input
                type="date"
                id="date_of_birth"
                name="date_of_birth"
                required
                value={formData.date_of_birth}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border transition-all" style={{ borderColor: '#AFAFAF', fontFamily: 'DM Sans' }}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-4" style={{ color: '#091B27', fontFamily: 'DM Sans', fontWeight: 600 }}>Address Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium mb-2" style={{ color: '#091B27', fontFamily: 'DM Sans', fontWeight: 500 }}>
                Street Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border transition-all" style={{ borderColor: '#AFAFAF', fontFamily: 'DM Sans' }}
                placeholder="123 Main Street, Apt 4B"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-2" style={{ color: '#091B27', fontFamily: 'DM Sans', fontWeight: 500 }}>
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border transition-all" style={{ borderColor: '#AFAFAF', fontFamily: 'DM Sans' }}
                placeholder="New York"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-2" style={{ color: '#091B27', fontFamily: 'DM Sans', fontWeight: 500 }}>
                Country *
              </label>
              <input
                type="text"
                id="country"
                name="country"
                required
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border transition-all" style={{ borderColor: '#AFAFAF', fontFamily: 'DM Sans' }}
                placeholder="United States"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-4" style={{ color: '#091B27', fontFamily: 'DM Sans', fontWeight: 600 }}>Background Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="education_level" className="block text-sm font-medium mb-2" style={{ color: '#091B27', fontFamily: 'DM Sans', fontWeight: 500 }}>
                Education Level *
              </label>
              <select
                id="education_level"
                name="education_level"
                required
                value={formData.education_level}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border transition-all" style={{ borderColor: '#AFAFAF', fontFamily: 'DM Sans' }}
              >
                <option value="">Select education level</option>
                <option value="high_school">High School</option>
                <option value="associate">Associate Degree</option>
                <option value="bachelor">Bachelor's Degree</option>
                <option value="master">Master's Degree</option>
                <option value="doctorate">Doctorate</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="occupation" className="block text-sm font-medium mb-2" style={{ color: '#091B27', fontFamily: 'DM Sans', fontWeight: 500 }}>
                Current Occupation *
              </label>
              <input
                type="text"
                id="occupation"
                name="occupation"
                required
                value={formData.occupation}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border transition-all" style={{ borderColor: '#AFAFAF', fontFamily: 'DM Sans' }}
                placeholder="Teacher, Engineer, Student, etc."
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="skills" className="block text-sm font-medium mb-2" style={{ color: '#091B27', fontFamily: 'DM Sans', fontWeight: 500 }}>
                Skills & Expertise *
              </label>
              <textarea
                id="skills"
                name="skills"
                required
                value={formData.skills}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border transition-all resize-none" style={{ borderColor: '#AFAFAF', fontFamily: 'DM Sans' }}
                placeholder="List your relevant skills (e.g., teaching, tutoring, mentoring, art, music, sports, etc.)"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-4" style={{ color: '#091B27', fontFamily: 'DM Sans', fontWeight: 600 }}>Volunteer Details</h3>
          <div className="space-y-6">
            <div>
              <label htmlFor="availability" className="block text-sm font-medium mb-2" style={{ color: '#091B27', fontFamily: 'DM Sans', fontWeight: 500 }}>
                Availability *
              </label>
              <input
                type="text"
                id="availability"
                name="availability"
                required
                value={formData.availability}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border transition-all" style={{ borderColor: '#AFAFAF', fontFamily: 'DM Sans' }}
                placeholder="e.g., Weekends, Monday-Friday evenings, etc."
              />
            </div>

            <div>
              <label htmlFor="previous_experience" className="block text-sm font-medium mb-2" style={{ color: '#091B27', fontFamily: 'DM Sans', fontWeight: 500 }}>
                Previous Volunteering Experience
              </label>
              <textarea
                id="previous_experience"
                name="previous_experience"
                value={formData.previous_experience}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border transition-all resize-none" style={{ borderColor: '#AFAFAF', fontFamily: 'DM Sans' }}
                placeholder="Describe any previous volunteering or teaching experience (optional)"
              />
            </div>

            <div>
              <label htmlFor="motivation" className="block text-sm font-medium mb-2" style={{ color: '#091B27', fontFamily: 'DM Sans', fontWeight: 500 }}>
                Why do you want to volunteer with us? *
              </label>
              <textarea
                id="motivation"
                name="motivation"
                required
                value={formData.motivation}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border transition-all resize-none" style={{ borderColor: '#AFAFAF', fontFamily: 'DM Sans' }}
                placeholder="Share your motivation for volunteering with our children's education program"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-4" style={{ color: '#091B27', fontFamily: 'DM Sans', fontWeight: 600 }}>Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="emergency_contact_name" className="block text-sm font-medium mb-2" style={{ color: '#091B27', fontFamily: 'DM Sans', fontWeight: 500 }}>
                Contact Name *
              </label>
              <input
                type="text"
                id="emergency_contact_name"
                name="emergency_contact_name"
                required
                value={formData.emergency_contact_name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border transition-all" style={{ borderColor: '#AFAFAF', fontFamily: 'DM Sans' }}
                placeholder="Emergency contact name"
              />
            </div>

            <div>
              <label htmlFor="emergency_contact_phone" className="block text-sm font-medium mb-2" style={{ color: '#091B27', fontFamily: 'DM Sans', fontWeight: 500 }}>
                Contact Phone *
              </label>
              <input
                type="tel"
                id="emergency_contact_phone"
                name="emergency_contact_phone"
                required
                value={formData.emergency_contact_phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border transition-all" style={{ borderColor: '#AFAFAF', fontFamily: 'DM Sans' }}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg" style={{ backgroundColor: '#9C242F20', border: '1px solid #9C242F', color: '#9C242F', fontFamily: 'DM Sans' }}>
          {error}
        </div>
      )}

      <div className="flex justify-center pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-4 text-white font-semibold rounded-lg focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 min-w-[200px] justify-center"
          style={{ backgroundColor: '#C53542', fontFamily: 'DM Sans', fontWeight: 600 }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9C242F'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#C53542'}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Heart className="w-5 h-5" />
              Submit Registration
            </>
          )}
        </button>
      </div>
    </form>
  );
}
