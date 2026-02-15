import { useEffect, useState } from 'react';
import { Search, Building2, MapPin, Award, UserPlus, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BusinessPartner {
  id: string;
  full_name: string;
  email: string;
  location: string;
  bio: string;
  skills: string[];
  points: number;
}

interface MyPartner {
  id: string;
  business_partner_id: string;
  status: string;
  joined_at: string | null;
  created_at: string;
  business_partner: BusinessPartner;
}

interface VolunteerBusinessPartnerSectionProps {
  volunteerId: string;
}

export const VolunteerBusinessPartnerSection = ({ volunteerId }: VolunteerBusinessPartnerSectionProps) => {
  const [businessPartners, setBusinessPartners] = useState<BusinessPartner[]>([]);
  const [myPartners, setMyPartners] = useState<MyPartner[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBusinessPartners();
    fetchMyPartners();
  }, [volunteerId]);

  const fetchBusinessPartners = async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_type', 'business_partner')
      .eq('verification_status', 'verified')
      .order('full_name', { ascending: true });

    if (!error && data) {
      setBusinessPartners(data);
    }
  };

  const fetchMyPartners = async () => {
    const { data, error } = await supabase
      .from('volunteer_business_partner_relations')
      .select(`
        *,
        business_partner:business_partner_id (
          id,
          full_name,
          email,
          location,
          bio,
          skills,
          points
        )
      `)
      .eq('volunteer_id', volunteerId)
      .in('status', ['active', 'pending', 'invited'])
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMyPartners(data as any);
    }
  };

  const requestToJoin = async (partnerId: string) => {
    const { error } = await supabase
      .from('volunteer_business_partner_relations')
      .insert({
        volunteer_id: volunteerId,
        business_partner_id: partnerId,
        status: 'pending',
        invitation_type: 'volunteer_request'
      });

    if (!error) {
      setShowModal(false);
      setSearchTerm('');
      fetchMyPartners();
    }
  };

  const cancelRequest = async (relationId: string) => {
    const { error } = await supabase
      .from('volunteer_business_partner_relations')
      .delete()
      .eq('id', relationId);

    if (!error) {
      fetchMyPartners();
    }
  };

  const filteredPartners = businessPartners.filter(partner => {
    const matchesSearch = partner.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.location.toLowerCase().includes(searchTerm.toLowerCase());
    const notAlreadyConnected = !myPartners.some(mp => mp.business_partner_id === partner.id);
    return matchesSearch && notAlreadyConnected;
  });

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-red-600" />
          My Coordinating Partners
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
        >
          <UserPlus className="w-4 h-4" />
          Find Partner
        </button>
      </div>

      <div className="space-y-3">
        {myPartners.length > 0 ? (
          myPartners.map((relation) => (
            <div key={relation.id} className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{relation.business_partner.full_name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        relation.status === 'active' ? 'bg-green-100 text-green-700' :
                        relation.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {relation.status === 'pending' ? 'Awaiting Approval' : relation.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{relation.business_partner.bio}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {relation.business_partner.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-red-600" />
                        <span className="font-semibold text-red-600">{relation.business_partner.points} pts</span>
                      </span>
                    </div>
                    {relation.joined_at && (
                      <p className="text-xs text-gray-500 mt-2">
                        Joined: {new Date(relation.joined_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>
                {relation.status === 'pending' && (
                  <button
                    onClick={() => cancelRequest(relation.id)}
                    className="ml-3 text-gray-600 hover:text-red-600 transition-colors"
                    title="Cancel Request"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p>You are not connected to any coordinating partners yet</p>
            <p className="text-sm mt-1">Click "Find Partner" to connect with a business partner</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-red-600" />
                  Find Coordinating Business Partner
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSearchTerm('');
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm text-gray-600">Search and request to join a business partner's volunteer team</p>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredPartners.length > 0 ? (
                  filteredPartners.map((partner) => (
                    <div key={partner.id} className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-6 h-6 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-1">{partner.full_name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{partner.bio}</p>
                            <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {partner.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Award className="w-4 h-4 text-red-600" />
                                <span className="font-semibold text-red-600">{partner.points} pts</span>
                              </span>
                            </div>
                            {partner.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {partner.skills.slice(0, 3).map((skill, idx) => (
                                  <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                                    {skill}
                                  </span>
                                ))}
                                {partner.skills.length > 3 && (
                                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                                    +{partner.skills.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => requestToJoin(partner.id)}
                          className="ml-3 flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm whitespace-nowrap"
                        >
                          <UserPlus className="w-4 h-4" />
                          Request to Join
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No business partners match your search' : 'No available business partners at this time'}
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSearchTerm('');
                }}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
