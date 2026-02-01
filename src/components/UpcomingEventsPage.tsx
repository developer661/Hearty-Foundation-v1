import { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Header } from './header';

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  event_date: string;
  organizer: string;
  attendees_count: number;
  created_at: string;
}

interface UpcomingEventsPageProps {
  onBack: () => void;
  onJoinVolunteerClick?: () => void;
  onDashboardClick?: () => void;
  onProfileClick?: () => void;
}

export const UpcomingEventsPage = ({
  onBack,
  onJoinVolunteerClick,
  onDashboardClick,
  onProfileClick
}: UpcomingEventsPageProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningEventId, setJoiningEventId] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true })
        .limit(12);

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async (eventId: string) => {
    setJoiningEventId(eventId);

    try {
      const { data: event } = await supabase
        .from('events')
        .select('attendees_count')
        .eq('id', eventId)
        .single();

      if (event) {
        await supabase
          .from('events')
          .update({ attendees_count: event.attendees_count + 1 })
          .eq('id', eventId);

        await fetchEvents();
      }
    } catch (err) {
      console.error('Error joining event:', err);
    } finally {
      setJoiningEventId(null);
    }
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatEventTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onJoinVolunteerClick={onJoinVolunteerClick}
        onDashboardClick={onDashboardClick}
        onProfileClick={onProfileClick}
        onFavouriteClick={onProfileClick}
      />

      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={onBack}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Upcoming Events</h1>
              <p className="text-gray-600 mt-2">Join events and make a difference in your community</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Upcoming Events</h3>
              <p className="text-gray-600">Check back soon for new volunteer events!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
                  style={{ height: '189px' }}
                >
                  <div className="p-4 flex flex-col h-full">
                    <div className="flex-1 overflow-hidden">
                      <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2">
                        {event.title}
                      </h3>

                      <div className="space-y-1 mb-3">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <MapPin className="w-3 h-3 flex-shrink-0 text-red-600" />
                          <span className="text-xs truncate">{event.location}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Calendar className="w-3 h-3 flex-shrink-0 text-red-600" />
                          <span className="text-xs">{formatEventDate(event.event_date)}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Clock className="w-3 h-3 flex-shrink-0 text-red-600" />
                          <span className="text-xs">{formatEventTime(event.event_date)}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleJoinEvent(event.id)}
                      disabled={joiningEventId === event.id}
                      className="w-full py-2 bg-red-600 text-white text-xs font-semibold rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {joiningEventId === event.id ? 'Joining...' : 'Join Event'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
