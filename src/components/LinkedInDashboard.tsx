import { ArrowLeft } from 'lucide-react';
import { UserProfileSidebar } from './dashboard/UserProfileSidebar';
import { PostFeed } from './dashboard/PostFeed';
import { UpcomingEvents } from './dashboard/UpcomingEvents';
import { UrgentNeedsDashboard } from './dashboard/UrgentNeedsDashboard';
import { VolunteerRanking } from './dashboard/VolunteerRanking';
import { useAuth } from '../contexts/AuthContext';

interface LinkedInDashboardProps {
  onBack: () => void;
}

export const LinkedInDashboard = ({ onBack }: LinkedInDashboardProps) => {
  const { userProfile } = useAuth();

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Please log in to view the dashboard</p>
      </div>
    );
  }

  const isReadOnly = userProfile.verification_status === 'not_verified';

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </button>
            <h1 className="text-2xl font-bold text-red-600">Volunteer Dashboard</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {isReadOnly && (
          <div className="mb-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-orange-800 text-sm">
              <strong>Read-only Mode:</strong> You're viewing in read-only mode. Complete your registration to post, like, comment, and sign up for opportunities.
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <UserProfileSidebar user={userProfile} />
          </div>

          <div className="lg:col-span-6">
            <PostFeed
              currentUserId={userProfile.id}
              currentUserName={userProfile.full_name}
              isReadOnly={isReadOnly}
            />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <UrgentNeedsDashboard userLocation={userProfile.location} isReadOnly={isReadOnly} />
            <UpcomingEvents userLocation={userProfile.location} isReadOnly={isReadOnly} />
            <VolunteerRanking currentUserId={userProfile.id} />
          </div>
        </div>
      </div>
    </div>
  );
};
