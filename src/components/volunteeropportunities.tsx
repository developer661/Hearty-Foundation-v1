import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Building2, Clock, Heart, Users, Award, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  institution_name: string;
  location: string;
  urgency: string;
  status: string;
}

interface VolunteerOpportunitiesProps {
  onBack: () => void;
  onRegister: () => void;
  onContact: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  education_math: 'bg-blue-100 text-blue-700 border-blue-300',
  education_english: 'bg-green-100 text-green-700 border-green-300',
  education_polish: 'bg-purple-100 text-purple-700 border-purple-300',
  sports: 'bg-orange-100 text-orange-700 border-orange-300',
  arts: 'bg-pink-100 text-pink-700 border-pink-300',
  health: 'bg-red-100 text-red-700 border-red-300'
};

const CATEGORY_LABELS: Record<string, string> = {
  education_math: 'Math Education',
  education_english: 'English Education',
  education_polish: 'Polish Education',
  sports: 'Sports & Fitness',
  arts: 'Arts & Creativity',
  health: 'Health & Wellness'
};

export const VolunteerOpportunities = ({ onBack, onRegister, onContact }: VolunteerOpportunitiesProps) => {
  const [urgentOpportunities, setUrgentOpportunities] = useState<Opportunity[]>([]);
  const [ongoingOpportunities, setOngoingOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    const { data: urgent } = await supabase
      .from('opportunities')
      .select('*')
      .eq('status', 'active')
      .eq('urgency', 'immediate')
      .order('created_at', { ascending: false })
      .limit(6);

    const { data: ongoing } = await supabase
      .from('opportunities')
      .select('*')
      .eq('status', 'active')
      .eq('urgency', 'ongoing')
      .order('created_at', { ascending: false })
      .limit(4);

    if (urgent) setUrgentOpportunities(urgent);
    if (ongoing) setOngoingOpportunities(ongoing);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="bg-white border-b-4 border-red-600 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-red-600">Join Our Volunteer Community</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Make a Difference Today
          </h2>
          <p className="text-base text-gray-600 mb-8">
            Join hundreds of volunteers who are transforming lives through education, sports, and community support. Your time and skills can create lasting impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onRegister}
              className="px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Register as Volunteer
            </button>
            <button
              onClick={onContact}
              className="px-8 py-4 bg-white text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 transition-colors font-bold text-lg"
            >
              Request More Info
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-red-600">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">850+</div>
                <div className="text-sm text-gray-600">Active Volunteers</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-600">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">12,500+</div>
                <div className="text-sm text-gray-600">Hours Contributed</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-600">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">3,200+</div>
                <div className="text-sm text-gray-600">Lives Impacted</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-8 h-8 text-red-600" />
                Immediate Opportunities
              </h3>
              <p className="text-gray-600 mt-2">Most urgent needs - your help is needed now!</p>
            </div>
            <div className="px-4 py-2 bg-red-100 text-red-700 rounded-full font-semibold">
              {urgentOpportunities.length} Open Positions
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {urgentOpportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border-2 border-red-200 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-red-500 to-red-600 px-4 py-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm font-bold uppercase">Urgent</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${CATEGORY_COLORS[opp.category] || 'bg-gray-100 text-gray-700'}`}>
                        {CATEGORY_LABELS[opp.category] || opp.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-3">{opp.title}</h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{opp.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-start gap-2 text-sm text-gray-700">
                        <Building2 className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="font-medium">{opp.institution_name}</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-700">
                        <MapPin className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span>{opp.location}</span>
                      </div>
                    </div>
                    <button
                      onClick={onRegister}
                      className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-8 mb-12 border-2 border-red-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-red-600" />
            Partner Organizations We Support
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              Warsaw Community Schools
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              Integration Center
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              Youth Development Foundation
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              Children's Library Network
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              Creative Kids Foundation
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              Health & Wellness Centers
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              Sports Academy
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              Community Arts Program
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Voices from Our Community
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-4xl mb-4">"</div>
              <p className="text-gray-700 italic mb-4">
                Volunteering with Hearthy Foundation has been the most rewarding experience of my life. Seeing the children's faces light up when they finally understand a math concept makes every minute worth it.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold">AK</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900">Anna Kowalska</div>
                  <div className="text-sm text-gray-600">Math Tutor, 2 years</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-4xl mb-4">"</div>
              <p className="text-gray-700 italic mb-4">
                The foundation gave me hope when I needed it most. My volunteer tutor helped me improve my English and now I can communicate confidently. I'm forever grateful!
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">MH</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900">Maria Hassan</div>
                  <div className="text-sm text-gray-600">Student Beneficiary</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-4xl mb-4">"</div>
              <p className="text-gray-700 italic mb-4">
                I joined as a sports coach and found a second family. The community here is incredible, and knowing we're making a real difference keeps me coming back every week.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">PW</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900">Piotr Wiśniewski</div>
                  <div className="text-sm text-gray-600">Sports Coach, 3 years</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-3xl font-bold text-gray-900">Ongoing Opportunities</h3>
              <p className="text-gray-600 mt-2">Long-term commitments for sustained impact</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {ongoingOpportunities.map((opp) => (
              <div
                key={opp.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <h4 className="text-xl font-bold text-gray-900 flex-1">{opp.title}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${CATEGORY_COLORS[opp.category] || 'bg-gray-100 text-gray-700'}`}>
                    {CATEGORY_LABELS[opp.category] || opp.category}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{opp.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <span>{opp.institution_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{opp.location}</span>
                  </div>
                </div>
                <button
                  onClick={onRegister}
                  className="w-full py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Learn More
                </button>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button className="text-red-600 hover:text-red-700 font-semibold text-lg flex items-center gap-2 mx-auto">
              See More Volunteer Opportunities
              <TrendingUp className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-12 text-center text-white">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Make a Difference?
          </h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join our community of dedicated volunteers and help us create lasting impact in children's lives. Every hour you give makes a world of difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onRegister}
              className="px-10 py-4 bg-white text-red-600 rounded-lg hover:bg-gray-100 transition-colors font-bold text-lg shadow-lg"
            >
              Register Now
            </button>
            <button
              onClick={onContact}
              className="px-10 py-4 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-red-600 transition-colors font-bold text-lg"
            >
              Get More Information
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
