import { useState, useEffect } from 'react';
import { MapPin, AlertCircle, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UrgentNeed {
  id: string;
  title: string;
  description: string;
  location: string;
  institution_name: string;
  urgency: string;
  category: string;
}

interface UrgentNeedsSectionProps {
  onViewAllClick?: () => void;
}

export const UrgentNeedsSection = ({ onViewAllClick }: UrgentNeedsSectionProps) => {
  const [urgentNeeds, setUrgentNeeds] = useState<UrgentNeed[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUrgentNeeds();
  }, []);

  const fetchUrgentNeeds = async () => {
    try {
      const { count } = await supabase
        .from('opportunities')
        .select('*', { count: 'exact', head: true })
        .eq('urgency', 'urgent')
        .eq('status', 'active');

      setTotalCount(count || 0);

      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('urgency', 'urgent')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setUrgentNeeds(data || []);
    } catch (error) {
      console.error('Error fetching urgent needs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-8 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (urgentNeeds.length === 0 && totalCount === 0) {
    return null;
  }

  const remainingCount = Math.max(0, totalCount - 3);

  return (
    <section className="py-8 bg-gradient-to-b from-red-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {urgentNeeds.map((need) => (
            <div
              key={need.id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-red-200 hover:border-red-400 group cursor-pointer aspect-square"
            >
              <div className="p-4 h-full flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <div className="bg-red-100 rounded-full p-1.5">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                    URGENT
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors line-clamp-2 flex-shrink-0">
                  {need.title}
                </h3>

                <div className="flex-grow"></div>

                <button className="w-full mb-3 py-2 px-3 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors">
                  More information
                </button>

                <div className="space-y-1 flex-shrink-0">
                  <div className="flex items-center gap-1 text-xs text-gray-700">
                    <MapPin className="w-3 h-3 text-red-500 flex-shrink-0" />
                    <span className="line-clamp-1">{need.location}</span>
                  </div>
                  <div className="text-xs text-gray-500 font-medium line-clamp-1">
                    {need.institution_name}
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-gray-200">
                  <span className="inline-block text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                    {need.category}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {remainingCount > 0 && (
            <div
              onClick={onViewAllClick}
              className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group aspect-square"
            >
              <div className="p-4 h-full flex flex-col items-center justify-center text-white">
                <div className="mb-2">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center group-hover:bg-opacity-30 transition-all">
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-1">More Urgent Needs</h3>

                <div className="text-4xl font-bold mb-2">+{remainingCount}</div>

                <p className="text-xs text-red-100 text-center px-2">
                  View all urgent opportunities
                </p>

                <div className="mt-2 flex items-center gap-1 text-xs font-semibold group-hover:gap-2 transition-all">
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
