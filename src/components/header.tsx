import { ChevronDown, Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoginModal } from './LoginModal';

interface HeaderProps {
  onJoinVolunteerClick?: () => void;
  onDashboardClick?: () => void;
  onProfileClick?: () => void;
  onEventsClick?: () => void;
  onJoinCareFacilityNgoClick?: () => void;
  onJoinBusinessPartnerClick?: () => void;
}

export const Header = ({ onJoinVolunteerClick, onDashboardClick, onProfileClick, onEventsClick, onJoinCareFacilityNgoClick, onJoinBusinessPartnerClick }: HeaderProps) => {
  const { user, userProfile, signOut } = useAuth();
  const [joinOpen, setJoinOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [urgentNeedsOpen, setUrgentNeedsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogout = async () => {
    await signOut();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-red-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo-podstawowe copy.png"
              alt="Hearthy Foundation Logo"
              className="h-16 w-auto object-contain"
            />
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-red-600 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <nav className="hidden md:flex items-center gap-2">
            <a
              href="https://www.serdeczna.org"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg font-bold transition-colors"
            >
              About us
            </a>

            <button
              onClick={onDashboardClick}
              className="px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg font-bold transition-colors"
            >
              Dashboard
            </button>

            <div className="relative">
              <button
                onClick={() => {
                  setUrgentNeedsOpen(!urgentNeedsOpen);
                  setJoinOpen(false);
                  setLoginOpen(false);
                }}
                className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg font-bold transition-colors"
              >
                Urgent Needs
                <ChevronDown className={`w-4 h-4 transition-transform ${urgentNeedsOpen ? 'rotate-180' : ''}`} />
              </button>
              {urgentNeedsOpen && (
                <div className="absolute top-full mt-1 left-0 bg-white rounded-lg shadow-xl border border-red-200 py-2 min-w-[250px] z-[100]">
                  <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors">
                    Teaching & Tutoring
                  </button>
                  <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors">
                    Mentorship Programs
                  </button>
                  <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors">
                    Arts & Music Education
                  </button>
                  <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors">
                    Sports & Physical Activities
                  </button>
                  <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors">
                    Technology & Digital Skills
                  </button>
                  <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors">
                    Language Learning Support
                  </button>
                </div>
              )}
            </div>

            {!user && (
              <div className="relative">
                <button
                  onClick={() => {
                    setJoinOpen(!joinOpen);
                    setLoginOpen(false);
                    setUrgentNeedsOpen(false);
                  }}
                  className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg font-bold transition-colors"
                >
                  Join
                  <ChevronDown className={`w-4 h-4 transition-transform ${joinOpen ? 'rotate-180' : ''}`} />
                </button>
                {joinOpen && (
                  <div className="absolute top-full mt-1 left-0 bg-white rounded-lg shadow-xl border border-red-200 py-2 min-w-[280px] z-[100]">
                    <button
                      onClick={() => {
                        setJoinOpen(false);
                        onJoinVolunteerClick?.();
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      Join as a Volunteer
                    </button>
                    <button
                      onClick={() => {
                        setJoinOpen(false);
                        onJoinCareFacilityNgoClick?.();
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      Join as Care Facility/NGO Organisation
                    </button>
                    <button
                      onClick={() => {
                        setJoinOpen(false);
                        onJoinBusinessPartnerClick?.();
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      Join as Business Partner
                    </button>
                  </div>
                )}
              </div>
            )}

            {user && userProfile ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setUserMenuOpen(!userMenuOpen);
                    setJoinOpen(false);
                    setUrgentNeedsOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg font-bold transition-colors"
                >
                  <User className="w-4 h-4" />
                  {userProfile.full_name}
                  <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {userMenuOpen && (
                  <div className="absolute top-full mt-1 right-0 bg-white rounded-lg shadow-xl border border-red-200 py-2 min-w-[220px] z-[100]">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onProfileClick?.();
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      User Profile
                    </button>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onDashboardClick?.();
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      Current Engagements
                    </button>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onEventsClick?.();
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      Upcoming Events
                    </button>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onDashboardClick?.();
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      Volunteer Ranking
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => {
                    setLoginOpen(!loginOpen);
                    setJoinOpen(false);
                    setUrgentNeedsOpen(false);
                  }}
                  className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg font-bold transition-colors"
                >
                  Log In
                  <ChevronDown className={`w-4 h-4 transition-transform ${loginOpen ? 'rotate-180' : ''}`} />
                </button>
                {loginOpen && (
                  <div className="absolute top-full mt-1 right-0 bg-white rounded-lg shadow-xl border border-red-200 py-2 min-w-[280px] z-[100]">
                    <button
                      onClick={() => {
                        setLoginOpen(false);
                        setShowLoginModal(true);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors whitespace-nowrap"
                    >
                      Log In as Volunteer
                    </button>
                    <button
                      onClick={() => {
                        setLoginOpen(false);
                        setShowLoginModal(true);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors whitespace-nowrap"
                    >
                      Log In as Care Facility/NGO Organisation
                    </button>
                    <button
                      onClick={() => {
                        setLoginOpen(false);
                        setShowLoginModal(true);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors whitespace-nowrap"
                    >
                      Log In as Business Partner
                    </button>
                    <button
                      onClick={() => {
                        setLoginOpen(false);
                        setShowLoginModal(true);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors whitespace-nowrap"
                    >
                      Log In as Administrator
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-red-200 shadow-lg">
          <nav className="px-4 py-4 space-y-2">
            <a
              href="https://www.serdeczna.org"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-red-50 rounded-lg font-bold transition-colors"
            >
              About us
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onDashboardClick?.();
              }}
              className="w-full text-left px-4 py-3 text-gray-700 hover:bg-red-50 rounded-lg font-bold transition-colors"
            >
              Dashboard
            </button>

            <div>
              <button
                onClick={() => setUrgentNeedsOpen(!urgentNeedsOpen)}
                className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-red-50 rounded-lg font-bold transition-colors"
              >
                <span>Urgent Needs</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${urgentNeedsOpen ? 'rotate-180' : ''}`} />
              </button>
              {urgentNeedsOpen && (
                <div className="mt-2 ml-4 space-y-1">
                  <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
                    Teaching & Tutoring
                  </button>
                  <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
                    Mentorship Programs
                  </button>
                  <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
                    Arts & Music Education
                  </button>
                  <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
                    Sports & Physical Activities
                  </button>
                  <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
                    Technology & Digital Skills
                  </button>
                  <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
                    Language Learning Support
                  </button>
                </div>
              )}
            </div>

            {!user && (
              <div>
                <button
                  onClick={() => setJoinOpen(!joinOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-red-50 rounded-lg font-bold transition-colors"
                >
                  <span>Join</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${joinOpen ? 'rotate-180' : ''}`} />
                </button>
                {joinOpen && (
                  <div className="mt-2 ml-4 space-y-1">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setJoinOpen(false);
                        onJoinVolunteerClick?.();
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    >
                      Join as a Volunteer
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setJoinOpen(false);
                        onJoinCareFacilityNgoClick?.();
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    >
                      Join as Care Facility/NGO Organisation
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setJoinOpen(false);
                        onJoinBusinessPartnerClick?.();
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    >
                      Join as Business Partner
                    </button>
                  </div>
                )}
              </div>
            )}

            {user && userProfile ? (
              <div>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-red-50 rounded-lg font-bold transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {userProfile.full_name}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {userMenuOpen && (
                  <div className="mt-2 ml-4 space-y-1">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setUserMenuOpen(false);
                        onProfileClick?.();
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    >
                      User Profile
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setUserMenuOpen(false);
                        onDashboardClick?.();
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    >
                      Current Engagements
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setUserMenuOpen(false);
                        onEventsClick?.();
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    >
                      Upcoming Events
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setUserMenuOpen(false);
                        onDashboardClick?.();
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    >
                      Volunteer Ranking
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <button
                  onClick={() => setLoginOpen(!loginOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-red-50 rounded-lg font-bold transition-colors"
                >
                  <span>Log In</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${loginOpen ? 'rotate-180' : ''}`} />
                </button>
                {loginOpen && (
                  <div className="mt-2 ml-4 space-y-1">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setLoginOpen(false);
                        setShowLoginModal(true);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors whitespace-nowrap"
                    >
                      Log In as Volunteer
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setLoginOpen(false);
                        setShowLoginModal(true);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors whitespace-nowrap"
                    >
                      Log In as Care Facility/NGO Organisation
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setLoginOpen(false);
                        setShowLoginModal(true);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors whitespace-nowrap"
                    >
                      Log In as Business Partner
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setLoginOpen(false);
                        setShowLoginModal(true);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors whitespace-nowrap"
                    >
                      Log In as Administrator
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      )}

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </header>
  );
};
