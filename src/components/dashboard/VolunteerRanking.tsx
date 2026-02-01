import { useEffect, useState } from 'react';
import { Trophy, TrendingUp, Award, Crown } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Volunteer {
  id: string;
  full_name: string;
  location: string;
  points: number;
}

interface VolunteerRankingProps {
  currentUserId: string;
}

export const VolunteerRanking = ({ currentUserId }: VolunteerRankingProps) => {
  const [topVolunteers, setTopVolunteers] = useState<Volunteer[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRankings();
  }, [currentUserId]);

  const fetchRankings = async () => {
    const { data: allVolunteers } = await supabase
      .from('user_profiles')
      .select('id, full_name, location, points')
      .order('points', { ascending: false });

    if (allVolunteers) {
      setTopVolunteers(allVolunteers.slice(0, 10));

      const userRankIndex = allVolunteers.findIndex(v => v.id === currentUserId);
      if (userRankIndex !== -1) {
        setCurrentUserRank(userRankIndex + 1);
      }
    }
    setLoading(false);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Award className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-orange-600" />;
    return <span className="text-sm font-bold text-gray-500">#{rank}</span>;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500';
    if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-600';
    return 'bg-gray-100';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-red-600" />
          Top Volunteers
        </h3>
        <TrendingUp className="w-4 h-4 text-green-600" />
      </div>

      {currentUserRank && currentUserRank <= 10 && (
        <div className="mb-4 p-3 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Your Rank</span>
            <div className="flex items-center gap-2">
              {getRankIcon(currentUserRank)}
              <span className="text-lg font-bold text-red-600">#{currentUserRank}</span>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <div className="space-y-2">
          {topVolunteers.map((volunteer, index) => {
            const rank = index + 1;
            const isCurrentUser = volunteer.id === currentUserId;

            return (
              <div
                key={volunteer.id}
                className={`p-3 rounded-lg transition-all ${
                  isCurrentUser
                    ? 'bg-red-50 border-2 border-red-600 shadow-md'
                    : rank <= 3
                    ? 'bg-gradient-to-r from-gray-50 to-white border border-gray-200'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    rank <= 3 ? getRankBadge(rank) : 'bg-gray-200'
                  }`}>
                    {rank <= 3 ? (
                      <span className="text-white font-bold text-sm">{rank}</span>
                    ) : (
                      <span className="text-gray-600 font-bold text-sm">{rank}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-bold text-sm truncate ${
                        isCurrentUser ? 'text-red-700' : 'text-gray-900'
                      }`}>
                        {volunteer.full_name}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs font-medium text-red-600">(You)</span>
                        )}
                      </h4>
                      <div className="flex items-center gap-1">
                        <Trophy className="w-3 h-3 text-yellow-600" />
                        <span className="text-sm font-bold text-gray-900">
                          {volunteer.points}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 truncate">{volunteer.location}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {currentUserRank && currentUserRank > 10 && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-gray-600">Your current rank</p>
            <p className="text-2xl font-bold text-gray-900">#{currentUserRank}</p>
            <p className="text-xs text-gray-500 mt-1">Keep volunteering to climb up!</p>
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-600">Points are earned through:</p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">Volunteering +50</span>
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">Events +30</span>
            <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">Posts +10</span>
          </div>
        </div>
      </div>
    </div>
  );
};
