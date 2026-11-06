import { useCallback, useEffect, useState } from 'react';
import { EyeOff, RotateCcw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminBadge } from './AdminBadge';
import { ConfirmActionDialog } from './ConfirmActionDialog';
import { describeAdminError, formatDateTime } from './adminTypes';

type ContentKind = 'post' | 'comment' | 'event';
type ModerationStatus = 'active' | 'removed' | 'all';

interface ContentItem {
  id: string;
  kind: ContentKind;
  heading: string;
  body: string;
  meta: string;
  createdAt: string;
  moderationStatus: 'active' | 'removed';
  moderationReason: string | null;
}

interface PendingAction {
  item: ContentItem;
  action: 'remove' | 'restore';
}

const KIND_TABS: { id: ContentKind; label: string }[] = [
  { id: 'post', label: 'Posts' },
  { id: 'comment', label: 'Comments' },
  { id: 'event', label: 'Events and announcements' },
];

const STATUS_FILTERS: { id: ModerationStatus; label: string }[] = [
  { id: 'active', label: 'Visible' },
  { id: 'removed', label: 'Removed' },
  { id: 'all', label: 'All' },
];

const loadItems = async (kind: ContentKind, status: ModerationStatus): Promise<ContentItem[]> => {
  let query;
  if (kind === 'post') {
    query = supabase
      .from('posts')
      .select('id, author_name, content, category, created_at, moderation_status, moderation_reason')
      .order('created_at', { ascending: false })
      .limit(200);
  } else if (kind === 'comment') {
    query = supabase
      .from('post_comments')
      .select('id, user_name, content, created_at, moderation_status, moderation_reason')
      .order('created_at', { ascending: false })
      .limit(200);
  } else {
    query = supabase
      .from('events')
      .select('id, title, description, organizer, created_at, moderation_status, moderation_reason')
      .order('created_at', { ascending: false })
      .limit(200);
  }

  if (status !== 'all') query = query.eq('moderation_status', status);

  const { data, error } = await query;
  if (error) {
    console.error(`Error loading ${kind} content:`, error);
    throw new Error('We could not load this content. Please try again.');
  }

  return (data ?? []).map((row: Record<string, unknown>): ContentItem => {
    const base = {
      id: String(row.id),
      kind,
      createdAt: String(row.created_at),
      moderationStatus: row.moderation_status === 'removed' ? ('removed' as const) : ('active' as const),
      moderationReason: (row.moderation_reason as string | null) ?? null,
    };
    if (kind === 'post') {
      return { ...base, heading: String(row.author_name ?? ''), body: String(row.content ?? ''), meta: String(row.category ?? '') };
    }
    if (kind === 'comment') {
      return { ...base, heading: String(row.user_name ?? ''), body: String(row.content ?? ''), meta: 'Comment' };
    }
    return {
      ...base,
      heading: String(row.title ?? ''),
      body: String(row.description ?? ''),
      meta: String(row.organizer ?? ''),
    };
  });
};

export const ModerationPanel = () => {
  const [kind, setKind] = useState<ContentKind>('post');
  const [status, setStatus] = useState<ModerationStatus>('active');
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await loadItems(kind, status));
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [kind, status]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const submitAction = async (reason: string): Promise<string | null> => {
    if (!pendingAction) return null;
    const { item, action } = pendingAction;
    const { error: rpcError } = await supabase.rpc('admin_moderate_content', {
      p_kind: item.kind,
      p_id: item.id,
      p_action: action,
      p_reason: reason || null,
    });
    if (rpcError) {
      console.error('Moderation failed:', rpcError);
      return describeAdminError(rpcError.message);
    }
    setPendingAction(null);
    refresh();
    return null;
  };

  const removing = pendingAction?.action === 'remove';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-700">Content moderation</h1>
        <p className="text-gray-600 mt-1">
          Removed content is hidden from the public site but kept here, so it can be restored at any time.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex gap-2 overflow-x-auto">
            {KIND_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setKind(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap border transition-colors ${
                  kind === tab.id
                    ? 'bg-red-600 border-red-600 text-white'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-red-200 hover:text-red-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setStatus(filter.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  status === filter.id
                    ? 'bg-gray-700 border-gray-700 text-white'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {loading && <p className="p-6 text-gray-600">Loading content...</p>}
        {error && <p className="p-6 text-red-700">{error}</p>}
        {!loading && !error && items.length === 0 && <p className="p-6 text-gray-600">No content to show.</p>}

        {!loading && !error && items.length > 0 && (
          <ul className="divide-y divide-gray-100">
            {items.map((item) => (
              <li key={`${item.kind}-${item.id}`} className="p-4 flex flex-col sm:flex-row gap-4 sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-gray-700">{item.heading || 'Untitled'}</p>
                    {item.meta && <AdminBadge tone="gray">{item.meta}</AdminBadge>}
                    <AdminBadge tone={item.moderationStatus === 'removed' ? 'red-soft' : 'green'}>
                      {item.moderationStatus === 'removed' ? 'Removed' : 'Visible'}
                    </AdminBadge>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-3 break-words">{item.body || '-'}</p>
                  <p className="text-xs text-gray-600">
                    {formatDateTime(item.createdAt)}
                    {item.moderationStatus === 'removed' && item.moderationReason && ` · Reason: ${item.moderationReason}`}
                  </p>
                </div>
                <div className="shrink-0">
                  {item.moderationStatus === 'active' ? (
                    <button
                      onClick={() => setPendingAction({ item, action: 'remove' })}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      <EyeOff className="w-4 h-4" />
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={() => setPendingAction({ item, action: 'restore' })}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Restore
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {pendingAction && (
        <ConfirmActionDialog
          title={removing ? 'Remove this content?' : 'Restore this content?'}
          description={
            removing
              ? 'It will be hidden from the public site. You can restore it later from this page.'
              : 'It will become visible on the public site again.'
          }
          confirmLabel={removing ? 'Remove' : 'Restore'}
          requireReason={removing}
          reasonLabel="Reason for removal"
          onConfirm={submitAction}
          onClose={() => setPendingAction(null)}
        />
      )}
    </div>
  );
};
