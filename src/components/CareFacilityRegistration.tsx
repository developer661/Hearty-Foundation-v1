import { useState } from 'react';
import { ArrowLeft, Upload, FileText, Plus, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CareFacilityRegistrationProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const CareFacilityRegistration = ({ onBack, onSuccess }: CareFacilityRegistrationProps) => {
  const [formData, setFormData] = useState({
    organisationType: '',
    name: '',
    dateOfEstablishment: '',
    businessProfile: '',
    detailedDescription: '',
    address: '',
    secondaryAddress: '',
    krs: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showSecondaryAddress, setShowSecondaryAddress] = useState(false);
  const [documents, setDocuments] = useState<File[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const getRequiredDocuments = (orgType: string) => {
    switch (orgType) {
      case 'ngo_organisation':
      case 'care_facility':
        return 'KRS certificate, establishment decision, operating license';
      case 'teacher':
        return 'Agreement with school, teaching certificate';
      case 'school':
        return 'School registration, operating license';
      case 'other':
        return 'Relevant registration documents';
      default:
        return 'Required documents';
    }
  };

  const isKRSRequired = () => {
    return formData.organisationType === 'ngo_organisation' || formData.organisationType === 'care_facility';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.organisationType) {
      setError('Please select an organisation type');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (isKRSRequired() && !formData.krs) {
      setError('KRS number is required for NGO and Care Facility organisations');
      return;
    }

    if (documents.length === 0) {
      setError('Please upload at least one document');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            email: formData.email,
            full_name: formData.name,
            user_type: 'care_facility_ngo',
            location: formData.address,
            bio: formData.businessProfile,
            verification_status: 'in_verification',
            access_level: 'read_only',
            points: 0,
            skills: [],
            interests: []
          });

        if (profileError) throw profileError;

        const { data: registration, error: regError } = await supabase
          .from('care_facility_registrations')
          .insert({
            organisation_type: formData.organisationType,
            name: formData.name,
            date_of_establishment: formData.dateOfEstablishment,
            business_profile: formData.businessProfile,
            detailed_description: formData.detailedDescription,
            address: formData.address,
            secondary_address: showSecondaryAddress ? formData.secondaryAddress : null,
            krs: formData.krs || null,
            email: formData.email,
            password_hash: formData.password,
            status: 'pending'
          })
          .select()
          .single();

        if (regError) throw regError;

        for (const file of documents) {
          await supabase
            .from('care_facility_documents')
            .insert({
              registration_id: registration.id,
              document_type: file.name.split('.').pop() || 'document',
              file_name: file.name,
              file_url: '',
              file_size: file.size
            });
        }
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-red-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Care Facility/NGO Organisation Registration</h1>
              <p className="text-gray-600 mt-1">Join our network of care providers and organisations</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Organisation Type *
              </label>
              <select
                name="organisationType"
                value={formData.organisationType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Select organisation type</option>
                <option value="ngo_organisation">NGO Organisation</option>
                <option value="care_facility">Care Facility</option>
                <option value="teacher">Teacher</option>
                <option value="school">School</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Organisation Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date of Establishment *
              </label>
              <input
                type="date"
                name="dateOfEstablishment"
                value={formData.dateOfEstablishment}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Business Profile (Brief Summary) *
              </label>
              <textarea
                name="businessProfile"
                value={formData.businessProfile}
                onChange={handleInputChange}
                required
                rows={3}
                maxLength={500}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Brief summary of your organisation..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.businessProfile.length}/500 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Detailed Description & Operating Model
              </label>
              <textarea
                name="detailedDescription"
                value={formData.detailedDescription}
                onChange={handleInputChange}
                rows={6}
                maxLength={2000}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Provide a detailed description of your organisation, its mission, values, operating model, services provided, and target audience..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.detailedDescription.length}/2000 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Organisation Photos (Optional)
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Upload photos of your facility, activities, or team
              </p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-red-500 transition-colors">
                <input
                  type="file"
                  onChange={handlePhotoChange}
                  multiple
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Click to upload photos</p>
                  <p className="text-xs text-gray-500">JPG, PNG (Max 5MB each, up to 5 photos)</p>
                </label>
              </div>
              {photos.length > 0 && (
                <div className="mt-3 space-y-2">
                  {photos.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <ImageIcon className="w-4 h-4" />
                      <span>{file.name}</span>
                      <span className="text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Main Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Street, City, Postal Code"
                  />
                </div>

                {!showSecondaryAddress && (
                  <button
                    type="button"
                    onClick={() => setShowSecondaryAddress(true)}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Secondary Address
                  </button>
                )}

                {showSecondaryAddress && (
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Secondary Address (Optional)
                    </label>
                    <input
                      type="text"
                      name="secondaryAddress"
                      value={formData.secondaryAddress}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Additional location (if applicable)"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowSecondaryAddress(false);
                        setFormData({ ...formData, secondaryAddress: '' });
                      }}
                      className="absolute right-2 top-9 text-gray-400 hover:text-red-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {isKRSRequired() && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  KRS Number *
                </label>
                <input
                  type="text"
                  name="krs"
                  value={formData.krs}
                  onChange={handleInputChange}
                  required={isKRSRequired()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="0000000000"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Required Documents *
              </label>
              <p className="text-xs text-gray-500 mb-2">
                {formData.organisationType
                  ? `Please upload: ${getRequiredDocuments(formData.organisationType)}`
                  : 'Select organisation type to see required documents'}
              </p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-500 transition-colors">
                <input
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="hidden"
                  id="document-upload"
                />
                <label htmlFor="document-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Click to upload documents</p>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG (Max 10MB each)</p>
                </label>
              </div>
              {documents.length > 0 && (
                <div className="mt-3 space-y-2">
                  {documents.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="w-4 h-4" />
                      <span>{file.name}</span>
                      <span className="text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Login Credentials</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email (Login) *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
