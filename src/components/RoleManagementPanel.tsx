import { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, ChevronDown, X, Mail, User, Crown, Briefcase, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getOrgRoleLabel, getOrgRoleBadgeColor, type OrgRole } from '../lib/permissions';

interface TeamMember {
  id: string;
  full_name: string;
  email: string;
  org_role: OrgRole;
  verification_status: string;
}

interface RoleManagementPanelProps {
  orgAdminId: string;
  orgAdminName: string;
}

const ROLE_OPTIONS: { value: OrgRole; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    value: 'org_admin',
    label: 'Organization Administrator',
    desc: 'Full access: manage users, settings, create/edit/delete opportunities',
    icon: <Crown className="w-4 h-4 text-red-600" />,
  },
  {
    value: 'opportunity_manager',
    label: 'Opportunity Manager',
    desc: 'Create, edit and publish opportunities; manage volunteer applications',
    icon: <Briefcase className="w-4 h-4 text-blue-600" />,
  },
];

export const RoleManagementPanel = ({ orgAdminId, orgAdminName }: RoleManagementPanelProps) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ full_name: '', email: '', org_role: 'opportunity_manager' as OrgRole });
  const [addError, setAddError] = useState('');
  const [adding, setAdding] = useState(false);
  const [changingRole, setChangingRole] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers();
  }, [orgAdminId]);

  const fetchMembers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('user_profiles')
      .select('id, full_name, email, org_role, verification_status')
      .eq('organization_id', orgAdminId)
      .order('full_name', { ascending: true });

    setMembers((data ?? []) as TeamMember[]);
    setLoading(false);
  };

  const updateRole = async (memberId: string, newRole: OrgRole) => {
    setChangingRole(memberId);
    await supabase
      .from('user_profiles')
      .update({ org_role: newRole })
      .eq('id', memberId);
    setChangingRole(null);
    fetchMembers();
  };

  const removeMember = async (memberId: string) => {
    await supabase
      .from('user_profiles')
      .update({ organization_id: null, org_role: null })
      .eq('id', memberId);
    fetchMembers();
  };

  const addMember = async () => {
    setAddError('');
    if (!addForm.full_name.trim() || !addForm.email.trim()) {
      setAddError('Name and email are required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addForm.email)) {
      setAddError('Enter a valid email address.');
      return;
    }

    setAdding(true);

    const { data: existing } = await supabase
      .from('user_profiles')
      .select('id, full_name, org_role, organization_id')
      .eq('email', addForm.email.trim().toLowerCase())
      .maybeSingle();

    if (existing) {
      if (existing.organization_id && existing.organization_id !== orgAdminId) {
        setAddError('This user already belongs to another organization.');
        setAdding(false);
        return;
      }
      await supabase
        .from('user_profiles')
        .update({ organization_id: orgAdminId, org_role: addForm.org_role })
        .eq('id', existing.id);
    } else {
      await supabase.from('user_profiles').insert({
        full_name: addForm.full_name.trim(),
        email: addForm.email.trim().toLowerCase(),
        organization_id: orgAdminId,
        org_role: addForm.org_role,
        user_type: 'business_partner',
        verification_status: 'verified',
        access_level: 'full_access',
        points: 0,
        skills: [],
        interests: [],
        bio: `Team member of ${orgAdminName}`,
        location: '',
      });
    }

    setAdding(false);
    setShowAddModal(false);
    setAddForm({ full_name: '', email: '', org_role: 'opportunity_manager' });
    fetchMembers();
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            Role Management
          </h2>
          <p className="text-sm text-gray-600 mt-0.5">Manage team members and their permissions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
        >
          <UserPlus className="w-4 h-4" />
          Add Team Member
        </button>
      </div>

      {/* Role legend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {ROLE_OPTIONS.map(r => (
          <div key={r.value} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="mt-0.5">{r.icon}</div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{r.label}</p>
              <p className="text-xs text-gray-600 mt-0.5">{r.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-6 text-gray-500">Loading team members...</div>
      ) : members.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Users className="w-10 h-10 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No additional team members yet.</p>
          <p className="text-xs text-gray-400 mt-1">Add team members to delegate opportunity management.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {members.map(member => (
            <div key={member.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-red-300 transition-colors">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{member.full_name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <p className="text-sm text-gray-600 truncate">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getOrgRoleBadgeColor(member.org_role)}`}>
                  {getOrgRoleLabel(member.org_role)}
                </span>
                <RoleDropdown
                  currentRole={member.org_role}
                  onChange={role => updateRole(member.id, role)}
                  disabled={changingRole === member.id}
                />
                <button
                  onClick={() => removeMember(member.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove from organization"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-5">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  <h3 className="text-lg font-bold">Add Team Member</h3>
                </div>
                <button
                  onClick={() => { setShowAddModal(false); setAddError(''); }}
                  className="text-white/70 hover:text-white hover:bg-white/20 rounded-full p-1.5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-red-100 text-sm mt-1">
                Existing users will be linked to your organization. New emails will create a new account.
              </p>
            </div>

            <div className="p-5 space-y-4">
              {addError && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{addError}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={addForm.full_name}
                  onChange={e => setAddForm(p => ({ ...p, full_name: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  placeholder="e.g. Jan Kowalski"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={addForm.email}
                  onChange={e => setAddForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  placeholder="jan@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                <div className="space-y-2">
                  {ROLE_OPTIONS.map(r => (
                    <label key={r.value} className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      addForm.org_role === r.value ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="org_role"
                        value={r.value ?? ''}
                        checked={addForm.org_role === r.value}
                        onChange={() => setAddForm(p => ({ ...p, org_role: r.value }))}
                        className="mt-1 text-red-600"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          {r.icon}
                          <p className="text-sm font-semibold text-gray-900">{r.label}</p>
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5">{r.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 p-4 flex gap-3">
              <button
                onClick={() => { setShowAddModal(false); setAddError(''); }}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={addMember}
                disabled={adding}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm disabled:opacity-50"
              >
                {adding ? 'Adding...' : 'Add Member'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RoleDropdown = ({
  currentRole,
  onChange,
  disabled,
}: {
  currentRole: OrgRole;
  onChange: (r: OrgRole) => void;
  disabled: boolean;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={disabled}
        className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
      >
        Change Role
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-20">
            {ROLE_OPTIONS.map(r => (
              <button
                key={r.value}
                onClick={() => { onChange(r.value); setOpen(false); }}
                className={`w-full text-left px-3 py-2.5 hover:bg-gray-50 flex items-center gap-2 transition-colors ${
                  currentRole === r.value ? 'bg-red-50' : ''
                }`}
              >
                {r.icon}
                <div>
                  <p className="text-sm font-medium text-gray-900">{r.label}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
