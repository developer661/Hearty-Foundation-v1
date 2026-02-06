import { useEffect, useState } from 'react';
import { ArrowLeft, User, MapPin, Mail, Calendar, Award, FileText, Briefcase, Target, TrendingUp, AlertCircle, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { OrganisationStatistics } from './OrganisationStatistics';

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
            {userProfile.verification_status !== 'verified' && (
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
            )}
          </div>
          <div className="px-8 pb-8">
            <div className="flex items-start gap-6 -mt-12">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-white flex-shrink-0">
                <User className="w-16 h-16 text-red-600" />
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
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
    </div>
  );
};
