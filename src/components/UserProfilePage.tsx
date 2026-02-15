import { useEffect, useState } from 'react';
import { ArrowLeft, User, MapPin, Mail, Calendar, Award, FileText, Briefcase, Target, TrendingUp, AlertCircle, Heart, Users, Search, UserPlus, UserCheck, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { OrganisationStatistics } from './OrganisationStatistics';
import { BusinessPartnerProfile } from './BusinessPartnerProfile';
import { VolunteerBusinessPartnerSection } from './VolunteerBusinessPartnerSection';

interface UserProfilePageProps {
  onBack: () => void;
}

interface Activity {
  id: string;
  activity_type: string;
  description: string;
  points_earned: number;
  created_at: string;
}

interface AssignedOpportunity {
  id: string;
  opportunity_title: string;
  status: string;
  start_date: string;
  created_at: string;
}

interface FavoriteItem {
  id: string;
  item_id: string;
  item_type: 'urgent_need' | 'event';
  item_title?: string;
  item_location?: string;
  created_at: string;
}

export const UserProfilePage = ({ onBack }: UserProfilePageProps) => {
  const { userProfile } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [opportunities, setOpportunities] = useState<AssignedOpportunity[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showFindModal, setShowFindModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [findSearch, setFindSearch] = useState('');
  const [inviteSearch, setInviteSearch] = useState('');
  const [availableVolunteers, setAvailableVolunteers] = useState<any[]>([]);
  const [registerForm, setRegisterForm] = useState({
    full_name: '',
    email: '',
    location: '',
    skills: '',
    interests: '',
    bio: ''
  });

  const getVerificationStatusLabel = (status: string) => {
    switch (status) {
      case 'not_verified':
        return 'Not Verified';
      case 'in_verification':
        return 'In Verification';
      case 'verified':
        return 'Verified';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case 'not_verified':
        return 'text-gray-600 bg-gray-100';
      case 'in_verification':
        return 'text-blue-600 bg-blue-100';
      case 'verified':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  useEffect(() => {
    if (userProfile) {
      fetchUserData();
      if (userProfile.user_type === 'business_partner') {
        fetchAvailableVolunteers();
      }
    }
  }, [userProfile]);

  const fetchUserData = async () => {
    if (!userProfile) return;

    const { data: activitiesData } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userProfile.id)
      .order('created_at', { ascending: false });

    const { data: opportunitiesData } = await supabase
      .from('assigned_opportunities')
      .select('*')
      .eq('user_id', userProfile.id)
      .order('created_at', { ascending: false });

    const { data: favoritesData } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userProfile.id)
      .order('created_at', { ascending: false });

    if (activitiesData) setActivities(activitiesData);
    if (opportunitiesData) setOpportunities(opportunitiesData);

    if (favoritesData) {
      const enrichedFavorites = await Promise.all(
        favoritesData.map(async (fav) => {
          if (fav.item_type === 'urgent_need') {
            const { data: needData } = await supabase
              .from('opportunities')
              .select('title, location')
              .eq('id', fav.item_id)
              .maybeSingle();
            return {
              ...fav,
              item_title: needData?.title,
              item_location: needData?.location
            };
          } else {
            const { data: eventData } = await supabase
              .from('events')
              .select('title, location')
              .eq('id', fav.item_id)
              .maybeSingle();
            return {
              ...fav,
              item_title: eventData?.title,
              item_location: eventData?.location
            };
          }
        })
      );
      setFavorites(enrichedFavorites);
    }
  };

  const fetchAvailableVolunteers = async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, full_name, email, location, skills, points, verification_status')
      .eq('user_type', 'volunteer')
      .order('full_name', { ascending: true });

    if (!error && data) {
      setAvailableVolunteers(data);
    }
  };

  const inviteVolunteer = async (volunteerId: string) => {
    if (!userProfile) return;

    const { error } = await supabase
      .from('volunteer_business_partner_relations')
      .insert({
        volunteer_id: volunteerId,
        business_partner_id: userProfile.id,
        status: 'invited',
        invitation_type: 'partner_invite'
      });

    if (!error) {
      setShowFindModal(false);
      setShowInviteModal(false);
      setFindSearch('');
      setInviteSearch('');
      fetchAvailableVolunteers();
    }
  };

  const registerVolunteer = async () => {
    if (!userProfile) return;

    const skillsArray = registerForm.skills.split(',').map(s => s.trim()).filter(s => s);
    const interestsArray = registerForm.interests.split(',').map(s => s.trim()).filter(s => s);

    const { data: newVolunteer, error: volunteerError } = await supabase
      .from('user_profiles')
      .insert({
        full_name: registerForm.full_name,
        email: registerForm.email,
        location: registerForm.location,
        bio: registerForm.bio,
        skills: skillsArray,
        interests: interestsArray,
        points: 0,
        user_type: 'volunteer',
        verification_status: 'verified',
        access_level: 'full_access'
      })
      .select()
      .single();

    if (volunteerError || !newVolunteer) {
      alert('Error registering volunteer. Please try again.');
      return;
    }

    await supabase
      .from('volunteer_business_partner_relations')
      .insert({
        volunteer_id: newVolunteer.id,
        business_partner_id: userProfile.id,
        status: 'active',
        invitation_type: 'partner_invite',
        joined_at: new Date().toISOString()
      });

    setShowRegisterModal(false);
    setRegisterForm({
      full_name: '',
      email: '',
      location: '',
      skills: '',
      interests: '',
      bio: ''
    });
    fetchAvailableVolunteers();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Please log in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
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
              onClick={onBack}
              className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </header>

      <div className="pt-32 pb-12 px-4 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-between px-8">
            <p className="text-white text-lg font-medium">
              User status: <span className={`font-bold px-3 py-1 rounded-full ${getVerificationStatusColor(userProfile.verification_status)}`}>
                {getVerificationStatusLabel(userProfile.verification_status)}
              </span>
            </p>
            {userProfile.verification_status !== 'verified' ? (
              <div className="relative">
                <button
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors"
                >
                  <AlertCircle className="w-5 h-5" />
                  Complete Registration
                </button>
                {showTooltip && (
                  <div className="absolute top-full mt-2 right-0 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg whitespace-nowrap z-10">
                    Complete your registration to effectively use the platform
                    <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
          <div className="px-8 pb-8">
            <div className="flex items-start gap-6 -mt-12">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-white flex-shrink-0 overflow-hidden">
                {userProfile.avatar_url ? (
                  <img src={userProfile.avatar_url} alt={userProfile.full_name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-red-600" />
                )}
              </div>

              <div className="flex-1 pt-16">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                      {userProfile.full_name}
                    </h1>
                    <p className="text-gray-600 flex items-center gap-2 mb-1">
                      <Mail className="w-4 h-4" />
                      {userProfile.email}
                    </p>
                    <p className="text-gray-600 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {userProfile.location}
                    </p>
                  </div>

                  <div className="flex gap-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600">{userProfile.points}</div>
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        Total Points
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600">{opportunities.length}</div>
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        Projects
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600">{activities.length}</div>
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        Activities
                      </div>
                    </div>
                  </div>
                </div>

                {userProfile.bio && (
                  <div className="mt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">About Me</h3>
                    <p className="text-gray-700 leading-relaxed">{userProfile.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {userProfile.user_type === 'care_facility_ngo' ? (
          <div className="mt-6">
            <OrganisationStatistics userId={userProfile.id} />
          </div>
        ) : userProfile.user_type === 'business_partner' ? (
          <div className="mt-6">
            <BusinessPartnerProfile />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <VolunteerBusinessPartnerSection volunteerId={userProfile.id} />
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-red-600" />
                Skills & Interests
              </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {userProfile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {userProfile.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-600" />
              Personal Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Email</p>
                  <p className="text-sm text-gray-600">{userProfile.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Location</p>
                  <p className="text-sm text-gray-600">{userProfile.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Member Since</p>
                  <p className="text-sm text-gray-600">December 2024</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-red-600" />
              Participated Projects
            </h2>
            <div className="space-y-3">
              {opportunities.length > 0 ? (
                opportunities.map((opp) => (
                  <div key={opp.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-red-300 transition-colors">
                    <h3 className="font-semibold text-gray-900 mb-2">{opp.opportunity_title}</h3>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        opp.status === 'in_progress' ? 'bg-green-100 text-green-700' :
                        opp.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {opp.status.replace('_', ' ')}
                      </span>
                      {opp.start_date && (
                        <span className="text-xs text-gray-500">Started: {formatDate(opp.start_date)}</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No participated projects yet</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-600" />
              Recent Activities
            </h2>
            <div className="space-y-3">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">{formatDate(activity.created_at)}</span>
                        <span className="text-xs font-semibold text-red-600">+{activity.points_earned} pts</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No recent activities</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-600" />
              My Favourites
            </h2>
            <div className="space-y-3">
              {favorites.length > 0 ? (
                favorites.map((favorite) => (
                  <div key={favorite.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-red-300 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 flex-1">{favorite.item_title || 'Unknown Item'}</h3>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        favorite.item_type === 'urgent_need' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {favorite.item_type === 'urgent_need' ? 'Urgent Need' : 'Event'}
                      </span>
                    </div>
                    {favorite.item_location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{favorite.item_location}</span>
                      </div>
                    )}
                    <div className="mt-2 text-xs text-gray-500">
                      Added on {formatDate(favorite.created_at)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No favourites yet. Start adding items to your favourites!</p>
              )}
            </div>
          </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-600" />
            Documents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-red-300 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-red-600" />
                <div>
                  <p className="font-semibold text-gray-900">Volunteer Certificate</p>
                  <p className="text-xs text-gray-500">Uploaded on Dec 10, 2024</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-red-300 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-red-600" />
                <div>
                  <p className="font-semibold text-gray-900">Background Check</p>
                  <p className="text-xs text-gray-500">Uploaded on Dec 5, 2024</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-red-300 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-red-600" />
                <div>
                  <p className="font-semibold text-gray-900">Training Completion</p>
                  <p className="text-xs text-gray-500">Uploaded on Nov 28, 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showFindModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-[450px] h-[450px] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Search className="w-6 h-6 text-red-600" />
                  Find Volunteers
                </h3>
                <button
                  onClick={() => {
                    setShowFindModal(false);
                    setFindSearch('');
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm text-gray-600">Search for registered volunteers by name</p>
            </div>
            <div className="p-6 flex flex-col h-[calc(450px-140px)]">
              <div className="mb-4">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Enter volunteer name..."
                    value={findSearch}
                    onChange={(e) => setFindSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2">
                {availableVolunteers
                  .filter(vol => vol.full_name.toLowerCase().includes(findSearch.toLowerCase()))
                  .slice(0, 10)
                  .map((volunteer) => (
                    <div key={volunteer.id} className="p-3 border border-gray-200 rounded-lg hover:border-red-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{volunteer.full_name}</p>
                          <p className="text-sm text-gray-600">{volunteer.email}</p>
                          <p className="text-xs text-gray-500">{volunteer.location}</p>
                        </div>
                        <button
                          onClick={() => {
                            inviteVolunteer(volunteer.id);
                            setShowFindModal(false);
                            setFindSearch('');
                          }}
                          className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          Invite
                        </button>
                      </div>
                    </div>
                  ))}
                {findSearch && availableVolunteers.filter(vol => vol.full_name.toLowerCase().includes(findSearch.toLowerCase())).length === 0 && (
                  <div className="text-center py-8 text-gray-500">No volunteers found</div>
                )}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => {
                  setShowFindModal(false);
                  setFindSearch('');
                }}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <UserPlus className="w-6 h-6 text-red-600" />
                  Invite Volunteer to Your Team
                </h3>
                <button
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteSearch('');
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search volunteers by name or email..."
                    value={inviteSearch}
                    onChange={(e) => setInviteSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {availableVolunteers
                  .filter(vol =>
                    vol.full_name.toLowerCase().includes(inviteSearch.toLowerCase()) ||
                    vol.email.toLowerCase().includes(inviteSearch.toLowerCase())
                  )
                  .map((volunteer) => (
                    <div key={volunteer.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-red-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{volunteer.full_name}</p>
                          <p className="text-sm text-gray-600">{volunteer.email}</p>
                          <p className="text-xs text-gray-500">{volunteer.location}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => inviteVolunteer(volunteer.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                      >
                        Invite
                      </button>
                    </div>
                  ))}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteSearch('');
                }}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-[450px] h-[450px] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <UserCheck className="w-6 h-6 text-red-600" />
                  Register New Volunteer
                </h3>
                <button
                  onClick={() => {
                    setShowRegisterModal(false);
                    setRegisterForm({
                      full_name: '',
                      email: '',
                      location: '',
                      skills: '',
                      interests: '',
                      bio: ''
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm text-gray-600">Register a volunteer on their behalf</p>
            </div>
            <div className="p-6 overflow-y-auto h-[calc(450px-140px)]">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={registerForm.full_name}
                    onChange={(e) => setRegisterForm({...registerForm, full_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={registerForm.location}
                    onChange={(e) => setRegisterForm({...registerForm, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={registerForm.skills}
                    onChange={(e) => setRegisterForm({...registerForm, skills: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    placeholder="e.g., Teaching, IT Support"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Interests (comma-separated)</label>
                  <input
                    type="text"
                    value={registerForm.interests}
                    onChange={(e) => setRegisterForm({...registerForm, interests: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    placeholder="e.g., Education, Environment"
                  />
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowRegisterModal(false);
                  setRegisterForm({
                    full_name: '',
                    email: '',
                    location: '',
                    skills: '',
                    interests: '',
                    bio: ''
                  });
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={registerVolunteer}
                disabled={!registerForm.full_name || !registerForm.email || !registerForm.location}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
