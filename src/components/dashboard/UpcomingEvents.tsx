import { useEffect, useState } from 'react';
import { Calendar, MapPin, Users, Clock, ChevronDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { FavoriteButton } from '../FavoriteButton';

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  event_date: string;
  organizer: string;
  attendees_count: number;
}

interface UpcomingEventsProps {
  userLocation: string;
  isReadOnly?: boolean;
}

type SortOption = 'location' | 'date' | 'category';

export const UpcomingEvents = ({ userLocation, isReadOnly = false }: UpcomingEventsProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('location');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [sortBy]);

  const fetchEvents = async () => {
    let query = supabase
      .from('events')
      .select('*')
      .gte('event_date', new Date().toISOString())
      .limit(2);

    if (sortBy === 'date') {
      query = query.order('event_date', { ascending: true });
    } else if (sortBy === 'category') {
      query = query.order('category', { ascending: true });
    } else {
      query = query.order('location', { ascending: true });
    }

    const { data } = await query;

    if (data) {
      if (sortBy === 'location') {
        const sorted = [...data].sort((a, b) => {
          const aDistance = calculateLocationDistance(a.location, userLocation);
          const bDistance = calculateLocationDistance(b.location, userLocation);
          return aDistance - bDistance;
        });
        setEvents(sorted);
      } else {
        setEvents(data);
      }
    }
    setLoading(false);
  };

  const calculateLocationDistance = (location1: string, location2: string): number => {
    const loc1Lower = location1.toLowerCase();
    const loc2Lower = location2.toLowerCase();

    if (loc1Lower === loc2Lower) return 0;
    if (loc1Lower.includes(loc2Lower) || loc2Lower.includes(loc1Lower)) return 1;

    const city1 = loc1Lower.split(',')[0].trim();
    const city2 = loc2Lower.split(',')[0].trim();
    if (city1 === city2) return 2;

    return 3;
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const formatEventTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'location': return 'Location';
      case 'date': return 'Date (ascending)';
      case 'category': return 'Activity Type';
      default: return 'Location';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-red-600" />
          Upcoming Events
        </h3>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
          >
            <span>{getSortLabel()}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  setSortBy('location');
                  setIsDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors ${
                  sortBy === 'location' ? 'bg-red-50 text-red-600 font-medium' : 'text-gray-700'
                }`}
              >
                Location
              </button>
              <button
                onClick={() => {
                  setSortBy('date');
                  setIsDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors ${
                  sortBy === 'date' ? 'bg-red-50 text-red-600 font-medium' : 'text-gray-700'
                }`}
              >
                Date (ascending)
              </button>
              <button
                onClick={() => {
                  setSortBy('category');
                  setIsDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors ${
                  sortBy === 'category' ? 'bg-red-50 text-red-600 font-medium' : 'text-gray-700'
                }`}
              >
                Activity Type
              </button>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No upcoming events</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="p-3 border-l-4 border-red-600 bg-red-50 rounded-r-lg hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-gray-900 text-sm line-clamp-2 flex-1">{event.title}</h4>
                <div className="flex items-center gap-1 ml-2">
                  <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded">
                    {formatEventDate(event.event_date)}
                  </span>
                  <FavoriteButton itemId={event.id} itemType="event" />
                </div>
              </div>

              <div className="space-y-1 mb-3">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Clock className="w-3 h-3" />
                  <span>{formatEventTime(event.event_date)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <MapPin className="w-3 h-3" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Users className="w-3 h-3" />
                  <span>{event.attendees_count} attending</span>
                </div>
                <span className="inline-block text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                  {event.category}
                </span>
              </div>

              <button
                disabled={isReadOnly}
                className={`w-full py-2 rounded text-xs font-medium transition-colors ${
                  isReadOnly
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
                title={isReadOnly ? 'Complete registration to register for events' : ''}
              >
                Register
              </button>
            </div>
          ))}
        </div>
      )}

      <button className="mt-4 w-full py-2 text-red-600 hover:bg-red-50 rounded text-sm font-medium transition-colors">
        View All Events
      </button>
    </div>
  );
};
