import { Bell, LogOut, ArrowLeft } from 'lucide-react';

interface AdminHeaderProps {
  username: string;
  pendingCount: number;
  onNotificationsClick: () => void;
  onExit: () => void;
  onSignOut: () => void;
}

export const AdminHeader = ({ username, pendingCount, onNotificationsClick, onExit, onSignOut }: AdminHeaderProps) => {
  const badgeLabel = pendingCount > 99 ? '99+' : String(pendingCount);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onExit}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Back to website"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-red-600 font-semibold">Administration</p>
            <p className="text-sm font-semibold text-gray-700 truncate">{username}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNotificationsClick}
            className="relative p-2.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label={`Pending requests: ${pendingCount}`}
          >
            <Bell className="w-5 h-5" />
            {pendingCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-semibold flex items-center justify-center ring-2 ring-white">
                {badgeLabel}
              </span>
            )}
          </button>
          <button
            onClick={onSignOut}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
