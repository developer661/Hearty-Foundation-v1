import { useEffect, useState } from 'react';
import { Users, Mail, Phone, Calendar, MapPin, ArrowLeft, UserPlus, BookOpen, Award } from 'lucide-react';
import { VideoBackground } from './videobackground';
import { AnimatedQuotes } from './animatedquotes';
import { supabase } from '../lib/supabase';
import type { Volunteer } from '../types/volunteer';

interface DashboardViewProps {
  onBack: () => void;
}

const features = [
  {
    icon: Users,
    title: "Volunteer Network",
    description: "Connect with passionate individuals dedicated to making a difference in children's lives.",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: BookOpen,
    title: "Educational Programs",
    description: "Access diverse teaching materials and structured programs for effective learning.",
    color: "from-cyan-500 to-cyan-600"
  },
  {
    icon: Calendar,
    title: "Event Management",
    description: "Organize and participate in workshops, tutoring sessions, and community activities.",
    color: "from-teal-500 to-teal-600"
  },
  {
    icon: Award,
    title: "Recognition System",
    description: "Earn badges and certificates as you contribute to our mission of education.",
    color: "from-emerald-500 to-emerald-600"
  }
];

export const DashboardView = ({ onBack }: DashboardViewProps) => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const { data, error } = await supabase
        .from('volunteers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVolunteers(data || []);
    } catch (err) {
      console.error('Error fetching volunteers:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const recentVolunteers = volunteers.slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative h-screen w-full overflow-hidden">
        <VideoBackground />

        <div className="relative z-20 h-full flex flex-col">
          <div className="absolute top-6 left-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg hover:bg-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
              <span className="text-gray-700 font-medium">Back to Home</span>
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <div className="text-center mb-8 animate-fade-in">
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl leading-tight">
                Volunteer <span className="text-cyan-400">Dashboard</span>
              </h2>
              <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto mb-12 drop-shadow-lg">
                Track your impact and connect with our growing community of volunteers making a difference.
              </p>
            </div>

            <AnimatedQuotes />
          </div>

          <div className="pb-16 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/40">
                <div className="flex flex-wrap items-center justify-center gap-8 text-gray-700">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600">
                      {loading ? '...' : volunteers.length}
                    </div>
                    <div className="text-sm font-medium mt-1">Total Volunteers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-cyan-600">
                      {loading ? '...' : volunteers.filter(v => v.interest === 'Teaching').length}
                    </div>
                    <div className="text-sm font-medium mt-1">Teachers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-teal-600">
                      {loading ? '...' : volunteers.filter(v => v.interest === 'Mentoring').length}
                    </div>
                    <div className="text-sm font-medium mt-1">Mentors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-emerald-600">
                      {loading ? '...' : volunteers.filter(v => v.interest === 'Event Organization').length}
                    </div>
                    <div className="text-sm font-medium mt-1">Event Organizers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/60 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-scroll" />
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Platform Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the powerful tools and support network that make volunteering rewarding and impactful.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Recent Volunteers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the latest members joining our mission to make a difference.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : recentVolunteers.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No volunteers yet</h3>
              <p className="text-gray-600">Volunteer applications will appear here once submitted.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentVolunteers.map((volunteer) => (
                <div
                  key={volunteer.id}
                  className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-blue-100 rounded-full p-3">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(volunteer.created_at)}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-3">{volunteer.name}</h3>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm truncate">{volunteer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{volunteer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{volunteer.location}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500 uppercase">Interest</span>
                      <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {volunteer.interest}
                      </span>
                    </div>
                  </div>

                  {volunteer.message && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Message</p>
                      <p className="text-sm text-gray-700 line-clamp-3">{volunteer.message}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
