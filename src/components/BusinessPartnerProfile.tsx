import { useEffect, useState } from 'react';
import {
  Users, Search, UserPlus, UserMinus, CheckCircle, XCircle,
  Clock, Mail, MapPin, Award, TrendingUp, Filter, Eye, UserCheck, Building2, Edit2, ChevronDown
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Volunteer {
  id: string;
  full_name: string;
  email: string;
  location: string;
  skills: string[];
  points: number;
  verification_status: string;
}

interface VolunteerRelation {
  id: string;
  volunteer_id: string;
  status: string;
  invitation_type: string;
  joined_at: string | null;
  notes: string | null;
  created_at: string;
  volunteer: Volunteer;
}

interface Activity {
  id: string;
  activity_type: string;
  description: string;
  points_earned: number;
  created_at: string;
}

export const BusinessPartnerProfile = () => {
  const { userProfile } = useAuth();
  const [myVolunteers, setMyVolunteers] = useState<VolunteerRelation[]>([]);
  const [pendingRequests, setPendingRequests] = useState<VolunteerRelation[]>([]);
  const [availableVolunteers, setAvailableVolunteers] = useState<Volunteer[]>([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState<string | null>(null);
  const [volunteerActivities, setVolunteerActivities] = useState<Activity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'invited'>('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showFindModal, setShowFindModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [inviteSearch, setInviteSearch] = useState('');
  const [findSearch, setFindSearch] = useState('');
  const [registerForm, setRegisterForm] = useState({
    full_name: '',
    email: '',
    location: '',
    skills: '',
    interests: '',
    bio: ''
  });

  useEffect(() => {
    if (userProfile) {
      fetchMyVolunteers();
      fetchPendingRequests();
      fetchAvailableVolunteers();
    }
  }, [userProfile]);

  const fetchMyVolunteers = async () => {
    if (!userProfile) return;

    const { data, error } = await supabase
      .from('volunteer_business_partner_relations')
      .select(`
        *,
        volunteer:volunteer_id (
          id,
          full_name,
          email,
          location,
          skills,
          points,
          verification_status
        )
      `)
      .eq('business_partner_id', userProfile.id)
      .in('status', ['active', 'invited'])
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMyVolunteers(data as any);
    }
  };

  const fetchPendingRequests = async () => {
    if (!userProfile) return;

    const { data, error } = await supabase
      .from('volunteer_business_partner_relations')
      .select(`
        *,
        volunteer:volunteer_id (
          id,
          full_name,
          email,
          location,
          skills,
          points,
          verification_status
        )
      `)
      .eq('business_partner_id', userProfile.id)
      .eq('status', 'pending')
      .eq('invitation_type', 'volunteer_request')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPendingRequests(data as any);
    }
  };

  const fetchAvailableVolunteers = async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, full_name, email, location, skills, points, verification_status')
      .eq('user_type', 'volunteer')
      .order('full_name', { ascending: true });

    if (!error && data) {
      setAvailableVolunteers(data);
    }
  };

  const fetchVolunteerActivities = async (volunteerId: string) => {
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', volunteerId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setVolunteerActivities(data);
    }
  };

  const inviteVolunteer = async (volunteerId: string) => {
    if (!userProfile) return;

    const { error } = await supabase
      .from('volunteer_business_partner_relations')
      .insert({
        volunteer_id: volunteerId,
        business_partner_id: userProfile.id,
        status: 'invited',
        invitation_type: 'partner_invite'
      });

    if (!error) {
      setShowInviteModal(false);
      setInviteSearch('');
      fetchMyVolunteers();
      fetchAvailableVolunteers();
    }
  };

  const acceptRequest = async (relationId: string) => {
    const { error } = await supabase
      .from('volunteer_business_partner_relations')
      .update({
        status: 'active',
        joined_at: new Date().toISOString()
      })
      .eq('id', relationId);

    if (!error) {
      fetchMyVolunteers();
      fetchPendingRequests();
    }
  };

  const rejectRequest = async (relationId: string) => {
    const { error } = await supabase
      .from('volunteer_business_partner_relations')
      .delete()
      .eq('id', relationId);

    if (!error) {
      fetchPendingRequests();
    }
  };

  const releaseVolunteer = async (relationId: string) => {
    const { error } = await supabase
      .from('volunteer_business_partner_relations')
      .update({
        status: 'released',
        released_at: new Date().toISOString()
      })
      .eq('id', relationId);

    if (!error) {
      fetchMyVolunteers();
    }
  };

  const updateNotes = async (relationId: string, notes: string) => {
    await supabase
      .from('volunteer_business_partner_relations')
      .update({ notes })
      .eq('id', relationId);
  };

  const viewVolunteerActivity = (volunteerId: string) => {
    setSelectedVolunteer(volunteerId);
    fetchVolunteerActivities(volunteerId);
    setShowActivityModal(true);
  };

  const registerVolunteer = async () => {
    if (!userProfile) return;

    const skillsArray = registerForm.skills.split(',').map(s => s.trim()).filter(s => s);
    const interestsArray = registerForm.interests.split(',').map(s => s.trim()).filter(s => s);

    const { data: newVolunteer, error: volunteerError } = await supabase
      .from('user_profiles')
      .insert({
        full_name: registerForm.full_name,
        email: registerForm.email,
        location: registerForm.location,
        bio: registerForm.bio,
        skills: skillsArray,
        interests: interestsArray,
        points: 0,
        user_type: 'volunteer',
        verification_status: 'verified',
        access_level: 'full_access'
      })
      .select()
      .single();

    if (volunteerError || !newVolunteer) {
      alert('Error registering volunteer. Please try again.');
      return;
    }

    await supabase
      .from('volunteer_business_partner_relations')
      .insert({
        volunteer_id: newVolunteer.id,
        business_partner_id: userProfile.id,
        status: 'active',
        invitation_type: 'partner_invite',
        joined_at: new Date().toISOString()
      });

    setShowRegisterModal(false);
    setRegisterForm({
      full_name: '',
      email: '',
      location: '',
      skills: '',
      interests: '',
      bio: ''
    });
    fetchMyVolunteers();
    fetchAvailableVolunteers();
  };

  const filteredVolunteers = myVolunteers.filter(rel => {
    const matchesSearch = rel.volunteer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rel.volunteer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || rel.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredAvailableVolunteers = availableVolunteers.filter(vol => {
    const alreadyInvited = myVolunteers.some(rel => rel.volunteer_id === vol.id);
    const matchesSearch = vol.full_name.toLowerCase().includes(inviteSearch.toLowerCase()) ||
                         vol.email.toLowerCase().includes(inviteSearch.toLowerCase());
    return !alreadyInvited && matchesSearch;
  });

  if (!userProfile) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="w-7 h-7 text-red-600" />
              Volunteer Team Management
            </h2>
            <p className="text-gray-600 mt-1">Manage and coordinate your volunteer team</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <Users className="w-5 h-5" />
              Manage Volunteers
              <ChevronDown className="w-4 h-4" />
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                <button
                  onClick={() => {
                    setShowFindModal(true);
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-gray-700 font-medium border-b border-gray-100"
                >
                  <Search className="w-4 h-4 text-red-600" />
                  Find Volunteers
                </button>
                <button
                  onClick={() => {
                    setShowInviteModal(true);
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-gray-700 font-medium border-b border-gray-100"
                >
                  <UserPlus className="w-4 h-4 text-red-600" />
                  Invite Volunteers
                </button>
                <button
                  onClick={() => {
                    setShowRegisterModal(true);
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-gray-700 font-medium border-b border-gray-100"
                >
                  <UserCheck className="w-4 h-4 text-red-600" />
                  Register Volunteer
                </button>
                <button
                  onClick={() => {
                    setShowInviteModal(true);
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-gray-700 font-medium border-b border-gray-100"
                >
                  <Mail className="w-4 h-4 text-red-600" />
                  Propose to Join
                </button>
                <button
                  onClick={() => setShowDropdown(false)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-gray-700 font-medium border-b border-gray-100"
                >
                  <UserMinus className="w-4 h-4 text-red-600" />
                  Release Volunteer
                </button>
                <button
                  onClick={() => setShowDropdown(false)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-gray-700 font-medium rounded-b-lg"
                >
                  <TrendingUp className="w-4 h-4 text-red-600" />
                  See Volunteer Activity
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg">
            <div className="text-3xl font-bold text-red-600">{myVolunteers.filter(v => v.status === 'active').length}</div>
            <div className="text-sm text-gray-700 font-medium">Active Volunteers</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">{myVolunteers.filter(v => v.status === 'invited').length}</div>
            <div className="text-sm text-gray-700 font-medium">Pending Invitations</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
            <div className="text-3xl font-bold text-green-600">{pendingRequests.length}</div>
            <div className="text-sm text-gray-700 font-medium">Join Requests</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">
              {myVolunteers.reduce((sum, rel) => sum + (rel.volunteer?.points || 0), 0)}
            </div>
            <div className="text-sm text-gray-700 font-medium">Total Team Points</div>
          </div>
        </div>

        <div className="mb-6">
          <button
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            <Edit2 className="w-4 h-4" />
            Update Profile
          </button>
        </div>

        {pendingRequests.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              Pending Join Requests ({pendingRequests.length})
            </h3>
            <div className="space-y-2">
              {pendingRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{request.volunteer.full_name}</p>
                      <p className="text-sm text-gray-600">{request.volunteer.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => acceptRequest(request.id)}
                      className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Accept
                    </button>
                    <button
                      onClick={() => rejectRequest(request.id)}
                      className="flex items-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search volunteers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-medium"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="invited">Invited</option>
            </select>
            <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-3">
          {filteredVolunteers.length > 0 ? (
            filteredVolunteers.map((relation) => (
              <div key={relation.id} className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">{relation.volunteer.full_name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          relation.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {relation.status}
                        </span>
                        {relation.volunteer.verification_status === 'verified' && (
                          <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-700">
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {relation.volunteer.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {relation.volunteer.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="w-4 h-4 text-red-600" />
                          <span className="font-semibold text-red-600">{relation.volunteer.points} pts</span>
                        </span>
                      </div>
                      {relation.volunteer.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {relation.volunteer.skills.map((skill, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                      {relation.joined_at && (
                        <p className="text-xs text-gray-500">
                          Joined: {new Date(relation.joined_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-3">
                    <button
                      onClick={() => viewVolunteerActivity(relation.volunteer_id)}
                      className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      title="View Activity"
                    >
                      <Eye className="w-4 h-4" />
                      Activity
                    </button>
                    {relation.status === 'active' && (
                      <button
                        onClick={() => releaseVolunteer(relation.id)}
                        className="flex items-center gap-1 bg-gray-600 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                        title="Release Volunteer"
                      >
                        <UserMinus className="w-4 h-4" />
                        Release
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Notes:</label>
                  <textarea
                    defaultValue={relation.notes || ''}
                    onBlur={(e) => updateNotes(relation.id, e.target.value)}
                    placeholder="Add notes about this volunteer..."
                    className="w-full text-sm p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows={2}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No volunteers match your search' : 'No volunteers in your team yet'}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Building2 className="w-7 h-7 text-red-600" />
            About the Firm
          </h2>
        </div>

        <div className="space-y-4">
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">
              <strong className="text-gray-900">{userProfile.full_name}</strong> is a leading corporate partner dedicated to making a meaningful impact in our community through strategic volunteer initiatives and social responsibility programs. With over 15 years of experience in corporate social engagement, we have built strong partnerships with local organizations to create sustainable change.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              Our firm specializes in coordinating skilled volunteers across various sectors including education, technology, and community development. We believe in empowering our team members to contribute their expertise and time to causes that matter, fostering a culture of giving back while developing professional skills and meaningful connections.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              <span className="font-semibold text-gray-900">Current Focus:</span> We are actively engaged in youth mentorship programs, digital literacy initiatives for underserved communities, and environmental sustainability projects. Our coordinated volunteer teams have contributed over 5,000 hours of service this year, impacting more than 2,000 beneficiaries across the region.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="rounded-lg overflow-hidden shadow-sm">
              <img
                src="https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Modern office headquarters"
                className="w-full h-48 object-cover"
              />
              <p className="text-xs text-gray-600 text-center py-2 bg-gray-50">Our Headquarters</p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-sm">
              <img
                src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Team collaboration"
                className="w-full h-48 object-cover"
              />
              <p className="text-xs text-gray-600 text-center py-2 bg-gray-50">Team Collaboration</p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-sm">
              <img
                src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Community engagement"
                className="w-full h-48 object-cover"
              />
              <p className="text-xs text-gray-600 text-center py-2 bg-gray-50">Community Impact</p>
            </div>
          </div>
        </div>
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-red-600" />
                Invite Volunteer to Your Team
              </h3>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search volunteers by name or email..."
                    value={inviteSearch}
                    onChange={(e) => setInviteSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredAvailableVolunteers.length > 0 ? (
                  filteredAvailableVolunteers.map((volunteer) => (
                    <div key={volunteer.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-red-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{volunteer.full_name}</p>
                          <p className="text-sm text-gray-600">{volunteer.email}</p>
                          <p className="text-xs text-gray-500">{volunteer.location}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => inviteVolunteer(volunteer.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                      >
                        Invite
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {inviteSearch ? 'No volunteers match your search' : 'All available volunteers have been invited'}
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteSearch('');
                }}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showActivityModal && selectedVolunteer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-red-600" />
                Volunteer Activity History
              </h3>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              {volunteerActivities.length > 0 ? (
                <div className="space-y-3">
                  {volunteerActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500">
                            {new Date(activity.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                          <span className="text-xs font-semibold text-red-600">+{activity.points_earned} pts</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No activities recorded yet</div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => {
                  setShowActivityModal(false);
                  setSelectedVolunteer(null);
                }}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showFindModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-[450px] h-[450px] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Search className="w-6 h-6 text-red-600" />
                Find Volunteers
              </h3>
              <p className="text-sm text-gray-600 mt-1">Search for registered volunteers by name</p>
            </div>
            <div className="p-6 flex flex-col h-[calc(450px-140px)]">
              <div className="mb-4">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Enter volunteer name..."
                    value={findSearch}
                    onChange={(e) => setFindSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2">
                {availableVolunteers
                  .filter(vol => vol.full_name.toLowerCase().includes(findSearch.toLowerCase()))
                  .slice(0, 10)
                  .map((volunteer) => (
                    <div key={volunteer.id} className="p-3 border border-gray-200 rounded-lg hover:border-red-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{volunteer.full_name}</p>
                          <p className="text-sm text-gray-600">{volunteer.email}</p>
                          <p className="text-xs text-gray-500">{volunteer.location}</p>
                        </div>
                        <button
                          onClick={() => {
                            inviteVolunteer(volunteer.id);
                            setShowFindModal(false);
                            setFindSearch('');
                          }}
                          className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          Invite
                        </button>
                      </div>
                    </div>
                  ))}
                {findSearch && availableVolunteers.filter(vol => vol.full_name.toLowerCase().includes(findSearch.toLowerCase())).length === 0 && (
                  <div className="text-center py-8 text-gray-500">No volunteers found</div>
                )}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => {
                  setShowFindModal(false);
                  setFindSearch('');
                }}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-[450px] h-[450px] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-red-600" />
                Register New Volunteer
              </h3>
              <p className="text-sm text-gray-600 mt-1">Register a volunteer on their behalf</p>
            </div>
            <div className="p-6 overflow-y-auto h-[calc(450px-140px)]">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={registerForm.full_name}
                    onChange={(e) => setRegisterForm({...registerForm, full_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={registerForm.location}
                    onChange={(e) => setRegisterForm({...registerForm, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={registerForm.skills}
                    onChange={(e) => setRegisterForm({...registerForm, skills: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    placeholder="e.g., Teaching, IT Support"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Interests (comma-separated)</label>
                  <input
                    type="text"
                    value={registerForm.interests}
                    onChange={(e) => setRegisterForm({...registerForm, interests: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    placeholder="e.g., Education, Environment"
                  />
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowRegisterModal(false);
                  setRegisterForm({
                    full_name: '',
                    email: '',
                    location: '',
                    skills: '',
                    interests: '',
                    bio: ''
                  });
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={registerVolunteer}
                disabled={!registerForm.full_name || !registerForm.email || !registerForm.location}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
