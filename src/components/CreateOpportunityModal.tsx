import { useState } from 'react';
import { X, Plus, Shield, MapPin, Users, Clock, FileText, Utensils, Award, Heart, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { VOLUNTEER_CATEGORIES } from '../lib/categories';
import { useAuth } from '../contexts/AuthContext';

interface CreateOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormState {
  title: string;
  description: string;
  location: string;
  category: string;
  frequency: string;
  volunteers_required: string;
  activity_duration: string;
  urgency: string;
  status: string;
  kamils_law_required: boolean;
  required_documentation: string;
  tags: string[];
  shared_meals: boolean;
  friendly_environment: boolean;
  certificate_available: boolean;
  volunteer_benefits: string;
  additional_notes: string;
}

const FREQUENCY_OPTIONS = [
  'One-time',
  'Weekly',
  'Bi-weekly',
  'Monthly',
  'As needed',
  'Daily',
];

const DURATION_OPTIONS = [
  '1 hour',
  '2 hours',
  '3 hours',
  'Half day (4 hours)',
  'Full day (8 hours)',
  'Multiple days',
  'Flexible',
];

export const CreateOpportunityModal = ({ isOpen, onClose, onSuccess }: CreateOpportunityModalProps) => {
  const { userProfile } = useAuth();
  const [form, setForm] = useState<FormState>({
    title: '',
    description: '',
    location: '',
    category: '',
    frequency: '',
    volunteers_required: '',
    activity_duration: '',
    urgency: 'ongoing',
    status: 'active',
    kamils_law_required: false,
    required_documentation: '',
    tags: [],
    shared_meals: false,
    friendly_environment: false,
    certificate_available: false,
    volunteer_benefits: '',
    additional_notes: '',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showOptional, setShowOptional] = useState(false);

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const validate = (): boolean => {
    const errs: string[] = [];
    if (!form.title.trim()) errs.push('Title is required');
    if (!form.description.trim()) errs.push('Description is required');
    if (!form.location.trim()) errs.push('Location is required');
    if (!form.category) errs.push('Category is required');
    if (!form.frequency) errs.push('Frequency is required');
    if (!form.volunteers_required || parseInt(form.volunteers_required) < 1)
      errs.push('Number of volunteers required must be at least 1');
    if (!form.activity_duration) errs.push('Activity duration is required');
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !userProfile) return;
    setSubmitting(true);

    const { error } = await supabase.from('opportunities').insert({
      title: form.title.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      category: form.category,
      institution_name: userProfile.full_name,
      organization_owner_id: userProfile.id,
      frequency: form.frequency,
      volunteers_required: parseInt(form.volunteers_required),
      activity_duration: form.activity_duration,
      urgency: form.urgency,
      status: form.status,
      kamils_law_required: form.kamils_law_required,
      required_documentation: form.required_documentation.trim() || null,
      tags: form.tags,
      shared_meals: form.shared_meals,
      friendly_environment: form.friendly_environment,
      certificate_available: form.certificate_available,
      volunteer_benefits: form.volunteer_benefits.trim() || null,
      additional_notes: form.additional_notes.trim() || null,
    });

    setSubmitting(false);

    if (error) {
      setErrors(['Failed to create opportunity. Please try again.']);
      return;
    }

    setForm({
      title: '', description: '', location: '', category: '', frequency: '',
      volunteers_required: '', activity_duration: '', urgency: 'ongoing', status: 'active',
      kamils_law_required: false, required_documentation: '', tags: [],
      shared_meals: false, friendly_environment: false, certificate_available: false,
      volunteer_benefits: '', additional_notes: '',
    });
    onSuccess();
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const fieldClass = "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 text-white">
            <Plus className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Create Opportunity / Urgent Need</h2>
              <p className="text-red-100 text-sm mt-0.5">Publishing as: {userProfile?.full_name}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                {errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2 border-b pb-2">
              <FileText className="w-4 h-4 text-red-600" />
              Basic Information
            </h3>

            <div>
              <label className={labelClass}>Opportunity Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                className={fieldClass}
                placeholder="e.g., Math Tutors Needed for After-School Program"
              />
            </div>

            <div>
              <label className={labelClass}>Description *</label>
              <textarea
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                className={fieldClass}
                rows={4}
                placeholder="Describe the opportunity, what volunteers will do, who they'll help..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  <MapPin className="w-3.5 h-3.5 inline mr-1 text-red-600" />
                  Location *
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                  className={fieldClass}
                  placeholder="e.g., Warsaw, Mazovia"
                />
              </div>

              <div>
                <label className={labelClass}>Category *</label>
                <select
                  value={form.category}
                  onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className={fieldClass}
                >
                  <option value="">Select category...</option>
                  {VOLUNTEER_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>
                  <Clock className="w-3.5 h-3.5 inline mr-1 text-red-600" />
                  Frequency *
                </label>
                <select
                  value={form.frequency}
                  onChange={e => setForm(p => ({ ...p, frequency: e.target.value }))}
                  className={fieldClass}
                >
                  <option value="">Select...</option>
                  {FREQUENCY_OPTIONS.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  <Users className="w-3.5 h-3.5 inline mr-1 text-red-600" />
                  Volunteers Required *
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.volunteers_required}
                  onChange={e => setForm(p => ({ ...p, volunteers_required: e.target.value }))}
                  className={fieldClass}
                  placeholder="e.g., 5"
                />
              </div>

              <div>
                <label className={labelClass}>Activity Duration *</label>
                <select
                  value={form.activity_duration}
                  onChange={e => setForm(p => ({ ...p, activity_duration: e.target.value }))}
                  className={fieldClass}
                >
                  <option value="">Select...</option>
                  {DURATION_OPTIONS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Publication Status *</label>
                <select
                  value={form.status}
                  onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                  className={fieldClass}
                >
                  <option value="active">Active (Published)</option>
                  <option value="draft">Draft (Not Published)</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Priority Level *</label>
                <select
                  value={form.urgency}
                  onChange={e => setForm(p => ({ ...p, urgency: e.target.value }))}
                  className={fieldClass}
                >
                  <option value="ongoing">Ongoing</option>
                  <option value="urgent">Urgent (featured)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2 border-b pb-2">
              <Award className="w-4 h-4 text-red-600" />
              Additional Tags / Keywords
              <span className="text-xs text-gray-500 font-normal">(optional — improves volunteer matching)</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {VOLUNTEER_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleTag(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    form.tags.includes(cat)
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-red-400 hover:text-red-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Kamil's Law — mandatory section */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2 border-b pb-2">
              <Shield className="w-4 h-4 text-amber-600" />
              Kamil's Law Compliance *
            </h3>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800 mb-3">
                <strong>Does this opportunity involve working with children?</strong><br />
                If yes, volunteers must provide documentation as required by Polish Kamil's Law (child protection law).
                Only volunteers with the highest verification level will be able to apply.
              </p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, kamils_law_required: true }))}
                  className={`flex-1 py-2.5 rounded-lg font-semibold text-sm border-2 transition-all ${
                    form.kamils_law_required
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-amber-400'
                  }`}
                >
                  Yes — Kamil's Law documentation required
                </button>
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, kamils_law_required: false }))}
                  className={`flex-1 py-2.5 rounded-lg font-semibold text-sm border-2 transition-all ${
                    !form.kamils_law_required
                      ? 'bg-gray-700 text-white border-gray-700'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
                  }`}
                >
                  No — No special documentation required
                </button>
              </div>
              {form.kamils_law_required && (
                <div className="mt-3">
                  <label className={labelClass}>Specify Required Documentation</label>
                  <textarea
                    value={form.required_documentation}
                    onChange={e => setForm(p => ({ ...p, required_documentation: e.target.value }))}
                    className={fieldClass}
                    rows={2}
                    placeholder="e.g., Criminal background check, Child protection training certificate..."
                  />
                </div>
              )}
            </div>
          </div>

          {/* Optional Benefits Section */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setShowOptional(!showOptional)}
              className="w-full flex items-center justify-between text-base font-semibold text-gray-900 border-b pb-2 hover:text-red-600 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-600" />
                Volunteer Benefits & Additional Info
                <span className="text-xs text-gray-500 font-normal">(optional)</span>
              </span>
              {showOptional ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showOptional && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:border-red-400 transition-colors">
                    <input
                      type="checkbox"
                      checked={form.shared_meals}
                      onChange={e => setForm(p => ({ ...p, shared_meals: e.target.checked }))}
                      className="w-4 h-4 text-red-600 rounded"
                    />
                    <span className="flex items-center gap-1.5 text-sm text-gray-700">
                      <Utensils className="w-3.5 h-3.5 text-red-500" />
                      Meals/Refreshments
                    </span>
                  </label>

                  <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:border-red-400 transition-colors">
                    <input
                      type="checkbox"
                      checked={form.friendly_environment}
                      onChange={e => setForm(p => ({ ...p, friendly_environment: e.target.checked }))}
                      className="w-4 h-4 text-red-600 rounded"
                    />
                    <span className="flex items-center gap-1.5 text-sm text-gray-700">
                      <Heart className="w-3.5 h-3.5 text-red-500" />
                      Friendly Environment
                    </span>
                  </label>

                  <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:border-red-400 transition-colors">
                    <input
                      type="checkbox"
                      checked={form.certificate_available}
                      onChange={e => setForm(p => ({ ...p, certificate_available: e.target.checked }))}
                      className="w-4 h-4 text-red-600 rounded"
                    />
                    <span className="flex items-center gap-1.5 text-sm text-gray-700">
                      <Award className="w-3.5 h-3.5 text-red-500" />
                      Certificate
                    </span>
                  </label>
                </div>

                <div>
                  <label className={labelClass}>Volunteer Benefits</label>
                  <textarea
                    value={form.volunteer_benefits}
                    onChange={e => setForm(p => ({ ...p, volunteer_benefits: e.target.value }))}
                    className={fieldClass}
                    rows={2}
                    placeholder="Describe any additional benefits, training, or perks for volunteers..."
                  />
                </div>

                <div>
                  <label className={labelClass}>Additional Notes</label>
                  <textarea
                    value={form.additional_notes}
                    onChange={e => setForm(p => ({ ...p, additional_notes: e.target.value }))}
                    className={fieldClass}
                    rows={2}
                    placeholder="Any other instructions or information volunteers should know..."
                  />
                </div>
              </div>
            )}
          </div>

          {form.kamils_law_required && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">
                This opportunity will only be visible to volunteers with verified status and Kamil's Law compliance documentation.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {submitting ? 'Publishing...' : 'Publish Opportunity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
