import { useState, useEffect } from 'react';
import { X, CheckCircle, BookOpen, Users, Phone, Calendar, FileText, Star, ChevronRight, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface OnboardingTemplate {
  id: string;
  title: string;
  welcome_message: string;
  instructions: string;
  prep_steps: string[];
  contact_info: string;
  event_guidance: string;
  training_materials: string;
  additional_info: string | null;
}

interface OnboardingModalProps {
  volunteerId: string;
  onDismiss: () => void;
}

type Section = 'welcome' | 'instructions' | 'steps' | 'training' | 'events' | 'contact';

const SECTIONS: { key: Section; label: string; icon: React.ReactNode }[] = [
  { key: 'welcome', label: 'Welcome', icon: <Star className="w-4 h-4" /> },
  { key: 'steps', label: 'Getting Started', icon: <CheckCircle className="w-4 h-4" /> },
  { key: 'instructions', label: 'How It Works', icon: <BookOpen className="w-4 h-4" /> },
  { key: 'training', label: 'Training Materials', icon: <FileText className="w-4 h-4" /> },
  { key: 'events', label: 'Events & Orientation', icon: <Calendar className="w-4 h-4" /> },
  { key: 'contact', label: 'Contact & Support', icon: <Phone className="w-4 h-4" /> },
];

export const OnboardingModal = ({ volunteerId, onDismiss }: OnboardingModalProps) => {
  const [template, setTemplate] = useState<OnboardingTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<Section>('welcome');
  const [visitedSections, setVisitedSections] = useState<Set<Section>>(new Set(['welcome']));
  const [dismissing, setDismissing] = useState(false);

  useEffect(() => {
    fetchTemplate();
  }, []);

  const fetchTemplate = async () => {
    const { data } = await supabase
      .from('onboarding_templates')
      .select('id, title, welcome_message, instructions, prep_steps, contact_info, event_guidance, training_materials, additional_info')
      .eq('is_active', true)
      .is('organization_id', null)
      .maybeSingle();

    setTemplate(data);
    setLoading(false);
  };

  const handleSectionClick = (key: Section) => {
    setActiveSection(key);
    setVisitedSections(prev => new Set([...prev, key]));
  };

  const handleDismiss = async () => {
    if (dismissing) return;
    setDismissing(true);

    await supabase.from('volunteer_onboarding_reads').upsert({
      volunteer_id: volunteerId,
      template_id: template?.id ?? null,
      viewed_at: new Date().toISOString(),
      dismissed_at: new Date().toISOString(),
    }, { onConflict: 'volunteer_id' });

    onDismiss();
  };

  const allSectionsVisited = SECTIONS.every(s => visitedSections.has(s.key));

  if (loading) return null;

  const t = template;
  if (!t) return null;

  const renderContent = () => {
    switch (activeSection) {
      case 'welcome':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-2">
              <Star className="w-8 h-8 text-red-600 fill-red-200" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center">You are now a verified volunteer!</h3>
            <p className="text-gray-700 leading-relaxed">{t.welcome_message}</p>
            {t.additional_info && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-amber-800 leading-relaxed">{t.additional_info}</p>
              </div>
            )}
            <button
              onClick={() => handleSectionClick('steps')}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm"
            >
              Get Started
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        );

      case 'steps':
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900">Your Next Steps</h3>
            <div className="space-y-3">
              {t.prep_steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-red-300 transition-colors">
                  <div className="w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'instructions':
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900">How the Platform Works</h3>
            <p className="text-gray-700 leading-relaxed text-sm">{t.instructions}</p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[
                { icon: <Users className="w-5 h-5" />, title: 'Browse Opportunities', desc: 'Find roles matching your skills and interests' },
                { icon: <CheckCircle className="w-5 h-5" />, title: 'Apply & Get Approved', desc: 'Submit applications and await confirmation' },
                { icon: <Clock className="w-5 h-5" />, title: 'Log Your Hours', desc: 'Track your volunteer time and activities' },
                { icon: <Star className="w-5 h-5" />, title: 'Earn Points', desc: 'Build your volunteer profile and earn recognition' },
              ].map(item => (
                <div key={item.title} className="p-3 bg-red-50 border border-red-100 rounded-lg">
                  <div className="text-red-600 mb-1">{item.icon}</div>
                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'training':
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900">Training Materials</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{t.training_materials}</p>
            <div className="space-y-2 mt-3">
              {['Volunteer Code of Conduct', 'Child Safeguarding Policy', 'Platform User Guide', 'Role-specific Training Guides'].map(doc => (
                <div key={doc} className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="text-sm text-gray-800 font-medium">{doc}</span>
                  <span className="ml-auto text-xs text-blue-600 font-medium">Documents Section</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'events':
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900">Events & Orientation</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{t.event_guidance}</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-3">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-green-700" />
                <p className="text-sm font-semibold text-green-900">Monthly Welcome Orientation</p>
              </div>
              <p className="text-xs text-green-800">First Saturday of every month · 10:00 AM</p>
              <p className="text-xs text-green-700 mt-1">Check the Upcoming Events tab in your dashboard for exact schedule and location.</p>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900">Contact & Support</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{t.contact_info}</p>
            <div className="space-y-3 mt-2">
              {[
                { label: 'General Enquiries', value: 'contact@hearthy.org' },
                { label: 'Phone', value: '+48 123 456 789' },
                { label: 'Office Hours', value: 'Mon–Fri 9:00–17:00 CET' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <span className="text-sm text-gray-900 font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-5 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="text-white">
              <p className="text-red-200 text-xs font-medium uppercase tracking-wide mb-1">Your Onboarding Package</p>
              <h2 className="text-xl font-bold">{t.title}</h2>
              <p className="text-red-100 text-sm mt-1">Read through all sections to get started</p>
            </div>
            <button
              onClick={handleDismiss}
              className="text-white/70 hover:text-white hover:bg-white/20 rounded-full p-1.5 transition-colors ml-4"
              title="Dismiss — you can always find this in your profile"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section nav */}
          <div className="flex gap-1.5 mt-4 flex-wrap">
            {SECTIONS.map(s => (
              <button
                key={s.key}
                onClick={() => handleSectionClick(s.key)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeSection === s.key
                    ? 'bg-white text-red-700 shadow-sm'
                    : visitedSections.has(s.key)
                    ? 'bg-red-400/50 text-white'
                    : 'bg-red-700/40 text-red-100 hover:bg-red-700/60'
                }`}
              >
                {s.icon}
                {s.label}
                {visitedSections.has(s.key) && activeSection !== s.key && (
                  <CheckCircle className="w-3 h-3 text-green-300" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex-shrink-0 flex items-center justify-between bg-gray-50">
          <p className="text-xs text-gray-500">
            {allSectionsVisited
              ? "You've reviewed all sections. This package remains accessible in your profile."
              : `${SECTIONS.length - visitedSections.size} section${SECTIONS.length - visitedSections.size !== 1 ? 's' : ''} remaining`}
          </p>
          <button
            onClick={handleDismiss}
            disabled={dismissing}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              allSectionsVisited
                ? 'bg-green-600 text-white hover:bg-green-700 shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            {dismissing ? 'Saving...' : "I've Read This — Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};
