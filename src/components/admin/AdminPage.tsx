import { useState } from 'react';
import { LogIn, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { LoginModal } from '../LoginModal';
import { AdminHeader } from './AdminHeader';
import { AdminDashboard } from './AdminDashboard';
import { RegisteredUsers, UsersTab } from './RegisteredUsers';
import { ApprovalQueue } from './ApprovalQueue';
import { RequestDetail } from './RequestDetail';
import { ModerationPanel } from './ModerationPanel';
import { AuditTrail } from './AuditTrail';
import { AdminSection, RequestStatus, RequestType } from './adminTypes';
import { usePendingRequestCount } from './usePendingRequestCount';

interface NavigateOptions {
  queueType?: RequestType | 'all';
  queueStatus?: RequestStatus | 'all';
  usersTab?: UsersTab;
}

const NAV_ITEMS: { id: AdminSection; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'users', label: 'Registered users' },
  { id: 'queue', label: 'Approval queue' },
  { id: 'moderation', label: 'Moderation' },
  { id: 'audit', label: 'Audit trail' },
];

export const AdminPage = ({ onExit }: { onExit: () => void }) => {
  const { user, userProfile, loading, isPlatformAdmin, signOut } = useAuth();
  const pendingCount = usePendingRequestCount();
  const [showLogin, setShowLogin] = useState(false);
  const [section, setSection] = useState<AdminSection>('dashboard');
  const [queueType, setQueueType] = useState<RequestType | 'all'>('all');
  const [queueStatus, setQueueStatus] = useState<RequestStatus | 'all'>('pending');
  const [usersTab, setUsersTab] = useState<UsersTab>('all');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const navigate = (target: AdminSection, options: NavigateOptions = {}) => {
    if (options.queueType) setQueueType(options.queueType);
    if (options.queueStatus) setQueueStatus(options.queueStatus);
    if (options.usersTab) setUsersTab(options.usersTab);
    setSelectedRequestId(null);
    setSection(target);
    window.scrollTo(0, 0);
  };

  if (loading || (user && !userProfile)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!isPlatformAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 max-w-md w-full text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <ShieldAlert className="w-6 h-6 text-red-600" />
          </div>
          <h1 className="text-xl font-semibold text-gray-700 mb-2">
            {user ? 'This area is not available' : 'Sign in to continue'}
          </h1>
          <p className="text-gray-600 mb-6">
            {user
              ? 'Your account does not have access to this page.'
              : 'Please sign in to access this page.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {!user && (
              <button
                onClick={() => setShowLogin(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Sign in
              </button>
            )}
            <button
              onClick={onExit}
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Back to home
            </button>
          </div>
        </div>
        <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader
        username={userProfile?.username || userProfile?.full_name || 'Administrator'}
        pendingCount={pendingCount}
        onNotificationsClick={() => navigate('queue', { queueStatus: 'pending', queueType: 'all' })}
        onExit={onExit}
        onSignOut={async () => {
          await signOut();
          onExit();
        }}
      />

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1 overflow-x-auto">
          {NAV_ITEMS.map((item) => {
            const active = section === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  active
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {item.label}
                {item.id === 'queue' && pendingCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-600 text-white text-xs">
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {section === 'dashboard' && <AdminDashboard onNavigate={navigate} />}
        {section === 'users' && <RegisteredUsers initialTab={usersTab} />}
        {section === 'queue' && selectedRequestId && (
          <RequestDetail requestId={selectedRequestId} onBack={() => setSelectedRequestId(null)} />
        )}
        {section === 'queue' && !selectedRequestId && (
          <ApprovalQueue
            initialType={queueType}
            initialStatus={queueStatus}
            onOpenRequest={setSelectedRequestId}
          />
        )}
        {section === 'moderation' && <ModerationPanel />}
        {section === 'audit' && <AuditTrail />}
      </main>
    </div>
  );
};
