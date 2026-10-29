import { useEffect } from 'react';
import { X, LayoutDashboard, UserPlus, LogIn } from 'lucide-react';

interface DashboardAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: () => void;
  onSignIn: () => void;
}

export const DashboardAccessModal = ({ isOpen, onClose, onRegister, onSignIn }: DashboardAccessModalProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dashboard-access-title"
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 text-center"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mx-auto w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-5">
          <LayoutDashboard className="w-7 h-7 text-red-600" />
        </div>

        <h2 id="dashboard-access-title" className="text-2xl font-bold text-gray-900 mb-3">
          Members-only dashboard
        </h2>
        <p className="text-gray-600 leading-relaxed mb-8">
          Register or sign in to track your engagements, upcoming events, and volunteer ranking.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onRegister}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-md"
          >
            <UserPlus className="w-4 h-4" />
            Register
          </button>
          <button
            onClick={onSignIn}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-red-600 border-2 border-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-5 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
        >
          Continue browsing
        </button>
      </div>
    </div>
  );
};
