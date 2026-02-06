import { useEffect, useState } from 'react';
import { Users, UserPlus, FileCheck, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface OrganisationStatisticsProps {
  userId: string;
}

interface Statistics {
  total_applications: number;
  in_application: number;
  in_progress: number;
  completed: number;
  total_volunteers: number;
  active_volunteers: number;
}

interface Activity {
  id: string;
  activity_type: string;
  description: string;
  created_at: string;
}

export const OrganisationStatistics = ({ userId }: OrganisationStatisticsProps) => {
  const [statistics, setStatistics] = useState<Statistics>({
    total_applications: 0,
    in_application: 0,
    in_progress: 0,
    completed: 0,
    total_volunteers: 0,
    active_volunteers: 0
  });
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
    fetchRecentActivities();
  }, [userId]);

  const fetchStatistics = async () => {
    try {
      const { data: applications, error: appError } = await supabase
        .from('organisation_applications')
        .select('status')
        .eq('organisation_id', userId);

      if (appError) throw appError;

      const { data: volunteers, error: volError } = await supabase
        .from('organisation_volunteers')
        .select('status')
        .eq('organisation_id', userId);

      if (volError) throw volError;

      const stats = {
        total_applications: applications?.length || 0,
        in_application: applications?.filter(a => a.status === 'in_application').length || 0,
        in_progress: applications?.filter(a => a.status === 'in_progress').length || 0,
        completed: applications?.filter(a => a.status === 'completed').length || 0,
        total_volunteers: volunteers?.length || 0,
        active_volunteers: volunteers?.filter(v => v.status === 'active').length || 0
      };

      setStatistics(stats);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('organisation_activities_log')
        .select('*')
        .eq('organisation_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      setRecentActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'volunteer_onboarded':
        return <UserPlus className="w-5 h-5 text-green-600" />;
      case 'application_received':
        return <FileCheck className="w-5 h-5 text-blue-600" />;
      case 'event_created':
        return <TrendingUp className="w-5 h-5 text-purple-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <p className="text-gray-600">Loading statistics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-red-600" />
          Organisation Statistics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Applications</p>
                <p className="text-3xl font-bold text-blue-900">{statistics.total_applications}</p>
              </div>
              <Users className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Volunteers Onboarded</p>
                <p className="text-3xl font-bold text-green-900">{statistics.total_volunteers}</p>
              </div>
              <UserPlus className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status Breakdown</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <p className="text-2xl font-bold text-orange-600">{statistics.in_application}</p>
              </div>
              <p className="text-sm text-gray-600">In Application</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <p className="text-2xl font-bold text-blue-600">{statistics.in_progress}</p>
              </div>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-2xl font-bold text-green-600">{statistics.completed}</p>
              </div>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mt-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Active Volunteers</p>
            <p className="text-lg font-bold text-gray-900">
              {statistics.active_volunteers} / {statistics.total_volunteers}
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all"
              style={{
                width: statistics.total_volunteers > 0
                  ? `${(statistics.active_volunteers / statistics.total_volunteers) * 100}%`
                  : '0%'
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Clock className="w-6 h-6 text-red-600" />
          Recent Activity
        </h2>

        {recentActivities.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No recent activities</p>
        ) : (
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.activity_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(activity.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
