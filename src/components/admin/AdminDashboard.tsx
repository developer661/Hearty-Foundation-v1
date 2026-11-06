import { useEffect, useState } from 'react';
import { ClipboardList, Users, Building2, Briefcase, BadgeCheck, Activity, ChevronRight, LucideIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminSection, RequestStatus, RequestType } from './adminTypes';
import { UsersTab } from './RegisteredUsers';

interface NavigateOptions {
  queueType?: RequestType | 'all';
  queueStatus?: RequestStatus | 'all';
  usersTab?: UsersTab;
}

interface DashboardCounts {
  pendingRequests: number;
  users: number;
  organisations: number;
  businessPartners: number;
  pendingVolunteers: number;
  otherPending: number;
}

interface SummaryCard {
  key: keyof DashboardCounts;
  label: string;
  description: string;
  icon: LucideIcon;
  target: AdminSection;
  options: NavigateOptions;
}

const CARDS: SummaryCard[] = [
  {
    key: 'pendingRequests',
    label: 'Pending requests',
    description: 'Registrations waiting for a decision',
    icon: ClipboardList,
    target: 'queue',
    options: { queueStatus: 'pending', queueType: 'all' },
  },
  {
    key: 'users',
    label: 'Registered users',
    description: 'All accounts on the platform',
    icon: Users,
    target: 'users',
    options: { usersTab: 'all' },
  },
  {
    key: 'organisations',
    label: 'Organisations',
    description: 'Care facilities, NGOs and foundations',
    icon: Building2,
    target: 'users',
    options: { usersTab: 'organisations' },
  },
  {
    key: 'businessPartners',
    label: 'Business partners',
    description: 'Companies registered as partners',
    icon: Briefcase,
    target: 'users',
    options: { usersTab: 'business' },
  },
  {
    key: 'pendingVolunteers',
    label: 'Pending volunteer verification',
    description: 'Volunteer applications awaiting review',
    icon: BadgeCheck,
    target: 'queue',
    options: { queueStatus: 'pending', queueType: 'volunteer' },
  },
  {
    key: 'otherPending',
    label: 'Other pending actions',
    description: 'Organisation and partner requests to review',
    icon: Activity,
    target: 'queue',
    options: { queueStatus: 'pending', queueType: 'all' },
  },
];

const EMPTY_COUNTS: DashboardCounts = {
  pendingRequests: 0,
  users: 0,
  organisations: 0,
  businessPartners: 0,
  pendingVolunteers: 0,
  otherPending: 0,
};

const countOf = async (query: PromiseLike<{ count: number | null; error: { message: string } | null }>) => {
  const { count, error } = await query;
  if (error) {
    console.error('Error counting rows:', error);
    return 0;
  }
  return count ?? 0;
};

export const AdminDashboard = ({ onNavigate }: { onNavigate: (section: AdminSection, options?: NavigateOptions) => void }) => {
  const [counts, setCounts] = useState<DashboardCounts>(EMPTY_COUNTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      const head = { count: 'exact' as const, head: true };
      const [pendingRequests, users, careFacilities, foundations, businessPartners, pendingVolunteers] = await Promise.all([
        countOf(supabase.from('admin_requests').select('id', head).eq('status', 'pending')),
        countOf(supabase.from('user_profiles').select('id', head)),
        countOf(supabase.from('user_profiles').select('id', head).eq('user_type', 'care_facility_ngo')),
        countOf(supabase.from('foundation_registrations').select('id', head)),
        countOf(supabase.from('user_profiles').select('id', head).eq('user_type', 'business_partner')),
        countOf(supabase.from('admin_requests').select('id', head).eq('status', 'pending').eq('request_type', 'volunteer')),
      ]);

      if (!active) return;
      setCounts({
        pendingRequests,
        users,
        organisations: careFacilities + foundations,
        businessPartners,
        pendingVolunteers,
        otherPending: pendingRequests - pendingVolunteers,
      });
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-700">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of platform activity that needs your attention.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.key}
              onClick={() => onNavigate(card.target, card.options)}
              className="group text-left bg-white rounded-lg border border-gray-200 shadow-sm p-6 hover:border-red-200 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-red-600" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="mt-4 text-3xl font-bold text-gray-700">{loading ? '-' : counts[card.key]}</p>
              <p className="mt-1 font-semibold text-gray-700">{card.label}</p>
              <p className="text-sm text-gray-600">{card.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
