import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminBadge } from './AdminBadge';
import { AuditEntry, formatDateTime } from './adminTypes';

const ACTION_LABELS: Record<string, string> = {
  approve_registration: 'Approved registration',
  reject_registration: 'Rejected registration',
  remove_content: 'Removed content',
  restore_content: 'Restored content',
};

const ENTITY_LABELS: Record<string, string> = {
  registration_request: 'Registration',
  post: 'Post',
  comment: 'Comment',
  event: 'Event',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  active: 'Visible',
  removed: 'Removed',
};

const actionTone = (action: string): 'green' | 'red-soft' | 'gray' => {
  if (action === 'approve_registration' || action === 'restore_content') return 'green';
  if (action === 'reject_registration' || action === 'remove_content') return 'red-soft';
  return 'gray';
};

export const AuditTrail = () => {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error: loadError } = await supabase
        .from('admin_audit_log')
        .select('id, admin_name, action, entity_type, entity_label, previous_status, new_status, reason, created_at')
        .order('created_at', { ascending: false })
        .limit(500);

      if (!active) return;
      if (loadError) {
        console.error('Error loading audit trail:', loadError);
        setError('We could not load the audit trail. Please try again.');
      } else {
        setEntries((data ?? []) as AuditEntry[]);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return entries.filter((entry) => {
      if (actionFilter !== 'all' && entry.action !== actionFilter) return false;
      if (!term) return true;
      return `${entry.admin_name} ${entry.entity_label} ${entry.reason ?? ''}`.toLowerCase().includes(term);
    });
  }, [entries, search, actionFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-700">Audit trail</h1>
        <p className="text-gray-600 mt-1">A record of every decision and moderation action taken by administrators.</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by administrator, item or reason"
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white focus:ring-2 focus:ring-red-500 outline-none"
          >
            <option value="all">All actions</option>
            {Object.entries(ACTION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {loading && <p className="p-6 text-gray-600">Loading audit trail...</p>}
        {error && <p className="p-6 text-red-700">{error}</p>}
        {!loading && !error && visible.length === 0 && <p className="p-6 text-gray-600">No actions match these filters.</p>}

        {!loading && !error && visible.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase text-gray-600 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-semibold">Time</th>
                  <th className="px-4 py-3 font-semibold">Administrator</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                  <th className="px-4 py-3 font-semibold">Item</th>
                  <th className="px-4 py-3 font-semibold">Change</th>
                  <th className="px-4 py-3 font-semibold">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visible.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 transition-colors align-top">
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatDateTime(entry.created_at)}</td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{entry.admin_name}</td>
                    <td className="px-4 py-3">
                      <AdminBadge tone={actionTone(entry.action)}>{ACTION_LABELS[entry.action] ?? entry.action}</AdminBadge>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-700 font-medium">{entry.entity_label || '-'}</p>
                      <p className="text-xs text-gray-600">{ENTITY_LABELS[entry.entity_type] ?? entry.entity_type}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      {entry.previous_status ? STATUS_LABELS[entry.previous_status] ?? entry.previous_status : '-'}
                      <span className="text-gray-400 mx-1">to</span>
                      {entry.new_status ? STATUS_LABELS[entry.new_status] ?? entry.new_status : '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-700 max-w-xs whitespace-pre-line break-words">{entry.reason || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
