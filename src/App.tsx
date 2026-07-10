import { useState, useEffect } from 'react';
import { Header } from './components/header';
import { HeroSection } from './components/herosection';
import { FeatureSection } from './components/featuresection';
import { VolunteerOpportunities } from './components/volunteeropportunities';
import { VolunteerRegistration } from './components/volunteerregistration';
import { ContactForm } from './components/contactform';
import { LinkedInDashboard } from './components/LinkedInDashboard';
import { UserProfilePage } from './components/UserProfilePage';
import { SuccessMessage } from './components/successmessage';
import { UpcomingEventsPage } from './components/UpcomingEventsPage';
import { CareFacilityRegistration } from './components/CareFacilityRegistration';
import { BusinessPartnerRegistration } from './components/BusinessPartnerRegistration';
import { UrgentNeedsSection } from './components/UrgentNeedsSection';
import { PartnersGallery } from './components/PartnersGallery';
import { OnboardingModal } from './components/OnboardingModal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';

type View = 'home' | 'opportunities' | 'registration' | 'contact' | 'dashboard' | 'profile' | 'success' | 'events' | 'care-facility-ngo-registration' | 'business-partner-registration';

/** Checks if a verified volunteer needs to see the onboarding modal and shows it once. */
const OnboardingGate = ({ children }: { children: React.ReactNode }) => {
  const { userProfile } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!userProfile || checked) return;
    if (userProfile.user_type !== 'volunteer' || userProfile.verification_status !== 'verified') {
      setChecked(true);
      return;
    }

    (async () => {
      const { data } = await supabase
        .from('volunteer_onboarding_reads')
        .select('id')
        .eq('volunteer_id', userProfile.id)
        .maybeSingle();
      setShowOnboarding(!data);
      setChecked(true);
    })();
  }, [userProfile, checked]);

  return (
    <>
      {children}
      {showOnboarding && userProfile && (
        <OnboardingModal
          volunteerId={userProfile.id}
          onDismiss={() => setShowOnboarding(false)}
        />
      )}
    </>
  );
};

function App() {
  const [currentView, setCurrentView] = useState<View>('home');

  const handleViewChange = (view: View) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  if (currentView === 'opportunities') {
    return (
      <AuthProvider>
        <OnboardingGate>
          <VolunteerOpportunities
            onBack={() => handleViewChange('home')}
            onRegister={() => handleViewChange('registration')}
            onContact={() => handleViewChange('contact')}
          />
        </OnboardingGate>
      </AuthProvider>
    );
  }

  if (currentView === 'registration') {
    return (
      <VolunteerRegistration
        onBack={() => handleViewChange('opportunities')}
        onSuccess={() => handleViewChange('success')}
      />
    );
  }

  if (currentView === 'contact') {
    return (
      <ContactForm
        onBack={() => handleViewChange('opportunities')}
      />
    );
  }

  if (currentView === 'dashboard') {
    return (
      <AuthProvider>
        <OnboardingGate>
          <LinkedInDashboard
            onBack={() => handleViewChange('home')}
            onProfileClick={() => handleViewChange('profile')}
          />
        </OnboardingGate>
      </AuthProvider>
    );
  }

  if (currentView === 'profile') {
    return (
      <AuthProvider>
        <OnboardingGate>
          <UserProfilePage
            onBack={() => handleViewChange('home')}
          />
        </OnboardingGate>
      </AuthProvider>
    );
  }

  if (currentView === 'events') {
    return (
      <AuthProvider>
        <OnboardingGate>
          <UpcomingEventsPage
            onBack={() => handleViewChange('home')}
            onJoinVolunteerClick={() => handleViewChange('opportunities')}
            onDashboardClick={() => handleViewChange('dashboard')}
            onProfileClick={() => handleViewChange('profile')}
          />
        </OnboardingGate>
      </AuthProvider>
    );
  }

  if (currentView === 'care-facility-ngo-registration') {
    return (
      <CareFacilityRegistration
        onBack={() => handleViewChange('home')}
        onSuccess={() => handleViewChange('success')}
      />
    );
  }

  if (currentView === 'business-partner-registration') {
    return (
      <BusinessPartnerRegistration
        onBack={() => handleViewChange('home')}
        onSuccess={() => handleViewChange('success')}
      />
    );
  }

  if (currentView === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-8">
        <SuccessMessage />
      </div>
    );
  }

  return (
    <AuthProvider>
      <OnboardingGate>
        <div className="min-h-screen bg-white">
          <Header
            onJoinVolunteerClick={() => handleViewChange('opportunities')}
            onDashboardClick={() => handleViewChange('dashboard')}
            onProfileClick={() => handleViewChange('profile')}
            onEventsClick={() => handleViewChange('events')}
            onJoinCareFacilityNgoClick={() => handleViewChange('care-facility-ngo-registration')}
            onJoinBusinessPartnerClick={() => handleViewChange('business-partner-registration')}
          />

        <main>
          <HeroSection onJoinClick={() => handleViewChange('opportunities')} />
          <UrgentNeedsSection onViewAllClick={() => handleViewChange('opportunities')} />
          <PartnersGallery />
          <FeatureSection />

          <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Ready to Make a Difference?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
                Join our community of dedicated volunteers and help us create lasting impact in children's lives.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => handleViewChange('opportunities')}
                  className="px-10 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Explore Opportunities
                </button>
                <button
                  onClick={() => handleViewChange('contact')}
                  className="px-10 py-4 bg-white text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 transition-colors font-bold text-lg"
                >
                  Request Information
                </button>
              </div>
            </div>
          </section>

          <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">Hearty Foundation</h3>
                  <p className="text-gray-400">
                    Empowering children through education and volunteer support since 2020.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li>
                      <button onClick={() => handleViewChange('opportunities')} className="hover:text-white transition-colors">
                        Volunteer Opportunities
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleViewChange('dashboard')} className="hover:text-white transition-colors">
                        Dashboard
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleViewChange('contact')} className="hover:text-white transition-colors">
                        Contact Us
                      </button>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4">Contact</h3>
                  <p className="text-gray-400">
                    Email: contact@hearthy.org<br />
                    Phone: +48 123 456 789<br />
                    Warsaw, Poland
                  </p>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
                <p>&copy; 2024 Hearty Foundation. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </main>
      </div>
      </OnboardingGate>
    </AuthProvider>
  );
}

export default App;
