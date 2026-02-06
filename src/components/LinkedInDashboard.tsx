import { useState } from 'react';
import { ArrowLeft, Lightbulb } from 'lucide-react';
import { UserProfileSidebar } from './dashboard/UserProfileSidebar';
import { PostFeed } from './dashboard/PostFeed';
import { UpcomingEvents } from './dashboard/UpcomingEvents';
import { UrgentNeedsDashboard } from './dashboard/UrgentNeedsDashboard';
import { VolunteerRanking } from './dashboard/VolunteerRanking';
import { SubmitIdeaModal } from './SubmitIdeaModal';
import { useAuth } from '../contexts/AuthContext';

interface LinkedInDashboardProps {
  onBack: () => void;
  onProfileClick?: () => void;
}

export const LinkedInDashboard = ({ onBack, onProfileClick }: LinkedInDashboardProps) => {
  const { userProfile } = useAuth();
  const [showIdeaModal, setShowIdeaModal] = useState(false);
  const [ideaSubmitted, setIdeaSubmitted] = useState(false);

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Please log in to view the dashboard</p>
      </div>
    );
  }

  const isReadOnly = userProfile.access_level === 'read_only' || userProfile.verification_status === 'in_verification';
  const isInVerification = userProfile.verification_status === 'in_verification';

  const handleIdeaSuccess = () => {
    setIdeaSubmitted(true);
    setTimeout(() => setIdeaSubmitted(false), 5000);
  };

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
        {ideaSubmitted && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm">
              <strong>Success!</strong> Your idea has been submitted to the Hearty Foundation team. We'll review it and get back to you soon.
            </p>
          </div>
        )}

        {isInVerification && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-blue-800 text-sm font-medium mb-1">
                  Account In Verification
                </p>
                <p className="text-blue-700 text-sm">
                  Your account is being reviewed by our team. While in verification, you have read-only access. You can browse content, add items to favorites, and submit ideas to the Hearty Foundation.
                </p>
              </div>
              <button
                onClick={() => setShowIdeaModal(true)}
                className="ml-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
              >
                <Lightbulb className="w-4 h-4" />
                Submit Idea
              </button>
            </div>
          </div>
        )}

        {isReadOnly && !isInVerification && (
          <div className="mb-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-orange-800 text-sm">
              <strong>Read-only Mode:</strong> You're viewing in read-only mode. Complete your registration to post, like, comment, and sign up for opportunities.
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <UserProfileSidebar user={userProfile} onProfileClick={onProfileClick} />
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

      <SubmitIdeaModal
        isOpen={showIdeaModal}
        onClose={() => setShowIdeaModal(false)}
        onSuccess={handleIdeaSuccess}
      />
    </div>
  );
};
