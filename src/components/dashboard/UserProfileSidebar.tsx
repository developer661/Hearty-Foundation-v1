import { useEffect, useState } from 'react';
import { User, MapPin, Briefcase, Calendar, Target } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface UserProfileProps {
  user: {
    id: string;
    full_name: string;
    email: string;
    location: string;
    bio: string;
    skills: string[];
    interests: string[];
    points: number;
    avatar_url?: string;
  };
  onProfileClick?: () => void;
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
}

export const UserProfileSidebar = ({ user, onProfileClick }: UserProfileProps) => {
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [assignedOpportunities, setAssignedOpportunities] = useState<AssignedOpportunity[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);

  useEffect(() => {
    fetchUserData();
  }, [user.id]);

  const fetchUserData = async () => {
    const { data: activities } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(4);

    const { data: opportunities } = await supabase
      .from('assigned_opportunities')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3);

    const { data: events } = await supabase
      .from('events')
      .select('*')
      .gte('event_date', new Date().toISOString())
      .order('event_date', { ascending: true })
      .limit(2);

    if (activities) setRecentActivities(activities);
    if (opportunities) setAssignedOpportunities(opportunities);
    if (events) setUpcomingEvents(events);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-16 bg-gradient-to-r from-red-500 to-red-600"></div>
        <div className="px-6 pb-6">
          <div className="flex justify-center -mt-8 mb-4">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white overflow-hidden">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-red-600" />
              )}
            </div>
          </div>

          <div className="text-center mb-4">
            <button
              onClick={onProfileClick}
              className="text-xl font-bold text-gray-900 hover:text-red-600 transition-colors cursor-pointer"
            >
              {user.full_name}
            </button>
            <p className="text-sm text-gray-600 flex items-center justify-center gap-1 mt-1">
              <MapPin className="w-3 h-3" />
              {user.location}
            </p>
          </div>

          <div className="flex justify-center gap-6 py-4 border-t border-b border-gray-200 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{user.points}</div>
              <div className="text-xs text-gray-600">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{assignedOpportunities.length}</div>
              <div className="text-xs text-gray-600">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{recentActivities.length}</div>
              <div className="text-xs text-gray-600">Activities</div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">About me</h4>
            <p className="text-sm text-gray-700">{user.bio}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-red-600" />
          Skills & Interests
        </h4>
        <div className="flex flex-wrap gap-2">
          {user.skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-red-600" />
          Recent Activity
        </h4>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-2 text-sm">
              <div className="w-2 h-2 bg-red-600 rounded-full mt-1.5"></div>
              <div className="flex-1">
                <p className="text-gray-700">{activity.description}</p>
                <p className="text-xs text-gray-500">{formatDate(activity.created_at)} • +{activity.points_earned} pts</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-red-600" />
          Assigned Activities
        </h4>
        <div className="space-y-2">
          {assignedOpportunities.map((opp) => (
            <div key={opp.id} className="p-2 bg-gray-50 rounded border border-gray-200">
              <p className="text-sm font-medium text-gray-900">{opp.opportunity_title}</p>
              <div className="flex items-center justify-between mt-1">
                <span className={`text-xs px-2 py-0.5 rounded ${
                  opp.status === 'in_progress' ? 'bg-green-100 text-green-700' :
                  opp.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {opp.status.replace('_', ' ')}
                </span>
                {opp.start_date && (
                  <span className="text-xs text-gray-500">{formatDate(opp.start_date)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-red-600" />
          My Upcoming Events
        </h4>
        <div className="space-y-2">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="p-2 bg-red-50 rounded border border-red-200">
              <p className="text-sm font-medium text-gray-900">{event.title}</p>
              <p className="text-xs text-gray-600 mt-1">{formatDate(event.event_date)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
