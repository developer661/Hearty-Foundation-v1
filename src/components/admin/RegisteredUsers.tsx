import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminBadge } from './AdminBadge';
import { PROFILE_VERIFICATION_LABELS, formatDate } from './adminTypes';

export type UsersTab = 'all' | 'volunteers' | 'organisations' | 'business';
type EntryGroup = 'volunteer' | 'organisation' | 'business';
type SortKey = 'newest' | 'oldest' | 'name_asc' | 'name_desc';

interface RegisteredEntry {
  key: string;
  name: string;
  email: string;
  location: string;
  group: EntryGroup;
  verification: string | null;
  registration: string | null;
  createdAt: string;
}

interface ProfileRow {
  id: string;
  full_name: string | null;
  email: string | null;
  location: string | null;
  user_type: string | null;
  verification_status: string | null;
  created_at: string;
}

interface FoundationRow {
  id: string;
  name: string | null;
  email: string | null;
  address: string | null;
  status: string | null;
  created_at: string;
}

const TABS: { id: UsersTab; label: string }[] = [
  { id: 'all', label: 'All users' },
  { id: 'volunteers', label: 'Volunteers' },
  { id: 'organisations', label: 'Organisations' },
  { id: 'business', label: 'Business partners' },
];

const GROUP_LABELS: Record<EntryGroup, string> = {
  volunteer: 'Volunteer',
  organisation: 'Organisation',
  business: 'Business partner',
};

const GROUP_TONES: Record<EntryGroup, 'gray' | 'green' | 'amber'> = {
  volunteer: 'green',
  organisation: 'amber',
  business: 'gray',
};

const profileGroup = (userType: string | null): EntryGroup => {
  if (userType === 'care_facility_ngo') return 'organisation';
  if (userType === 'business_partner') return 'business';
  return 'volunteer';
};

const toEntries = (profiles: ProfileRow[], foundations: FoundationRow[]): RegisteredEntry[] => [
  ...profiles.map((p) => ({
    key: `profile-${p.id}`,
    name: p.full_name || p.email || 'Unnamed account',
    email: p.email || '',
    location: p.location || '',
    group: profileGroup(p.user_type),
    verification: p.verification_status,
    registration: null,
    createdAt: p.created_at,
  })),
  ...foundations.map((f) => ({
    key: `foundation-${f.id}`,
    name: f.name || f.email || 'Unnamed organisation',
    email: f.email || '',
    location: f.address || '',
    group: 'organisation' as const,
    verification: null,
    registration: f.status,
    createdAt: f.created_at,
  })),
];

const verificationTone = (status: string | null): 'gray' | 'green' | 'amber' | 'red-soft' => {
  if (status === 'verified') return 'green';
  if (status === 'partially_verified' || status === 'in_verification') return 'amber';
  if (status === 'rejected') return 'red-soft';
  return 'gray';
};

const tabMatches = (tab: UsersTab, entry: RegisteredEntry) => {
  if (tab === 'all') return true;
  if (tab === 'volunteers') return entry.group === 'volunteer';
  if (tab === 'organisations') return entry.group === 'organisation';
  return entry.group === 'business';
};

export const RegisteredUsers = ({ initialTab }: { initialTab: UsersTab }) => {
  const [tab, setTab] = useState<UsersTab>(initialTab);
  const [entries, setEntries] = useState<RegisteredEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');
  const [sort, setSort] = useState<SortKey>('newest');

  useEffect(() => {
    let active = true;

    (async () => {
      const [profilesRes, foundationsRes] = await Promise.all([
        supabase
          .from('user_profiles')
          .select('id, full_name, email, location, user_type, verification_status, created_at')
          .order('created_at', { ascending: false })
          .limit(1000),
        supabase
          .from('foundation_registrations')
          .select('id, name, email, address, status, created_at')
          .order('created_at', { ascending: false })
          .limit(1000),
      ]);

      if (!active) return;

      if (profilesRes.error || foundationsRes.error) {
        console.error('Error loading registered users:', profilesRes.error || foundationsRes.error);
        setError('We could not load the registered users. Please try again.');
        setLoading(false);
        return;
      }

      setEntries(toEntries((profilesRes.data ?? []) as ProfileRow[], (foundationsRes.data ?? []) as FoundationRow[]));
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = entries.filter((entry) => {
      if (!tabMatches(tab, entry)) return false;
      if (verificationFilter !== 'all' && entry.verification !== verificationFilter) return false;
      if (term && !`${entry.name} ${entry.email} ${entry.location}`.toLowerCase().includes(term)) return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case 'oldest':
          return a.createdAt.localeCompare(b.createdAt);
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        default:
          return b.createdAt.localeCompare(a.createdAt);
      }
    });
  }, [entries, tab, search, verificationFilter, sort]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-700">Registered users</h1>
        <p className="text-gray-600 mt-1">Individuals, volunteers, organisations and business partners.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors border ${
              tab === item.id
                ? 'bg-red-600 border-red-600 text-white'
                : 'bg-white border-gray-200 text-gray-700 hover:border-red-200 hover:text-red-600'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or location"
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white focus:ring-2 focus:ring-red-500 outline-none"
          >
            <option value="all">All verification statuses</option>
            {Object.entries(PROFILE_VERIFICATION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white focus:ring-2 focus:ring-red-500 outline-none"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name_asc">Name A-Z</option>
            <option value="name_desc">Name Z-A</option>
          </select>
        </div>

        {error && <p className="p-6 text-red-700">{error}</p>}
        {loading && !error && <p className="p-6 text-gray-600">Loading users...</p>}

        {!loading && !error && (
          <>
            <p className="px-4 pt-3 text-sm text-gray-600">{visible.length} {visible.length === 1 ? 'result' : 'results'}</p>
            {visible.length === 0 ? (
              <p className="p-6 text-gray-600">No users match these filters.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase text-gray-600 bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Name</th>
                      <th className="px-4 py-3 font-semibold">Type</th>
                      <th className="px-4 py-3 font-semibold">Email</th>
                      <th className="px-4 py-3 font-semibold">Location</th>
                      <th className="px-4 py-3 font-semibold">Verification</th>
                      <th className="px-4 py-3 font-semibold">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {visible.map((entry) => (
                      <tr key={entry.key} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-700">{entry.name}</td>
                        <td className="px-4 py-3">
                          <AdminBadge tone={GROUP_TONES[entry.group]}>{GROUP_LABELS[entry.group]}</AdminBadge>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{entry.email || '-'}</td>
                        <td className="px-4 py-3 text-gray-600">{entry.location || '-'}</td>
                        <td className="px-4 py-3">
                          {entry.verification ? (
                            <AdminBadge tone={verificationTone(entry.verification)}>
                              {PROFILE_VERIFICATION_LABELS[entry.verification] ?? entry.verification}
                            </AdminBadge>
                          ) : entry.registration ? (
                            <AdminBadge tone={entry.registration === 'approved' ? 'green' : entry.registration === 'rejected' ? 'red-soft' : 'gray'}>
                              Registration {entry.registration}
                            </AdminBadge>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatDate(entry.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
