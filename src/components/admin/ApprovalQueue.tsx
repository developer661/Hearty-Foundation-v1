import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, Check, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminBadge } from './AdminBadge';
import { RequestDecisionDialog } from './RequestDecisionDialog';
import {
  AdminRequest,
  RequestStatus,
  RequestType,
  REQUEST_TYPE_LABELS,
  STATUS_LABELS,
  VERIFICATION_LABELS,
  formatDateTime,
} from './adminTypes';

interface ApprovalQueueProps {
  initialType: RequestType | 'all';
  initialStatus: RequestStatus | 'all';
  onOpenRequest: (requestId: string) => void;
}

interface PendingDecision {
  request: AdminRequest;
  decision: 'approved' | 'rejected';
}

const TYPE_FILTERS: (RequestType | 'all')[] = ['all', 'volunteer', 'business_partner', 'care_facility_ngo', 'foundation_ngo'];
const STATUS_FILTERS: (RequestStatus | 'all')[] = ['pending', 'approved', 'rejected', 'all'];

const statusTone = (status: RequestStatus): 'amber' | 'green' | 'red-soft' => {
  if (status === 'approved') return 'green';
  if (status === 'rejected') return 'red-soft';
  return 'amber';
};

export const ApprovalQueue = ({ initialType, initialStatus, onOpenRequest }: ApprovalQueueProps) => {
  const [typeFilter, setTypeFilter] = useState<RequestType | 'all'>(initialType);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>(initialStatus);
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingDecision, setPendingDecision] = useState<PendingDecision | null>(null);

  const loadRequests = useCallback(async () => {
    let query = supabase
      .from('admin_requests')
      .select('id, request_type, subject_table, subject_id, applicant_name, applicant_email, submitted_at, status, verification_level, decided_at, decision_reason')
      .order('submitted_at', { ascending: false })
      .limit(500);

    if (statusFilter !== 'all') query = query.eq('status', statusFilter);
    if (typeFilter !== 'all') query = query.eq('request_type', typeFilter);

    const { data, error: loadError } = await query;
    if (loadError) {
      console.error('Error loading approval queue:', loadError);
      setError('We could not load the approval queue. Please try again.');
    } else {
      setError(null);
      setRequests((data ?? []) as AdminRequest[]);
    }
    setLoading(false);
  }, [typeFilter, statusFilter]);

  useEffect(() => {
    setLoading(true);
    loadRequests();

    const channel = supabase
      .channel('admin-queue-requests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_requests' }, () => {
        loadRequests();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadRequests]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-700">Approval queue</h1>
        <p className="text-gray-600 mt-1">Review new registrations and decide whether to approve them.</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200 flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  statusFilter === status
                    ? 'bg-red-600 border-red-600 text-white'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-red-200 hover:text-red-600'
                }`}
              >
                {status === 'all' ? 'All' : STATUS_LABELS[status]}
              </button>
            ))}
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as RequestType | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white focus:ring-2 focus:ring-red-500 outline-none"
          >
            {TYPE_FILTERS.map((type) => (
              <option key={type} value={type}>
                {type === 'all' ? 'All request types' : REQUEST_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </div>

        {loading && <p className="p-6 text-gray-600">Loading requests...</p>}
        {error && <p className="p-6 text-red-700">{error}</p>}
        {!loading && !error && requests.length === 0 && (
          <p className="p-6 text-gray-600">No requests match these filters.</p>
        )}

        {!loading && !error && requests.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase text-gray-600 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-semibold">Request</th>
                  <th className="px-4 py-3 font-semibold">Applicant</th>
                  <th className="px-4 py-3 font-semibold">Submitted</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Verification</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <AdminBadge tone="gray">{REQUEST_TYPE_LABELS[request.request_type]}</AdminBadge>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-700">{request.applicant_name}</p>
                      <p className="text-gray-600">{request.applicant_email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatDateTime(request.submitted_at)}</td>
                    <td className="px-4 py-3">
                      <AdminBadge tone={statusTone(request.status)}>{STATUS_LABELS[request.status]}</AdminBadge>
                    </td>
                    <td className="px-4 py-3">
                      {request.verification_level ? (
                        <AdminBadge tone={request.verification_level === 'verified' ? 'green' : 'amber'}>
                          {VERIFICATION_LABELS[request.verification_level]}
                        </AdminBadge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2 whitespace-nowrap">
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => setPendingDecision({ request, decision: 'approved' })}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Approve
                            </button>
                            <button
                              onClick={() => setPendingDecision({ request, decision: 'rejected' })}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-xs font-medium hover:bg-gray-50 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => onOpenRequest(request.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-red-600 text-xs font-medium hover:bg-red-50 transition-colors"
                        >
                          View
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pendingDecision && (
        <RequestDecisionDialog
          request={pendingDecision.request}
          decision={pendingDecision.decision}
          onClose={() => setPendingDecision(null)}
          onDecided={() => {
            setPendingDecision(null);
            loadRequests();
          }}
        />
      )}
    </div>
  );
};
