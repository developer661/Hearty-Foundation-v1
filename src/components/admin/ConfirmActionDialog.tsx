import { FormEvent, useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmActionDialogProps {
  title: string;
  description: string;
  confirmLabel: string;
  reasonLabel?: string;
  requireReason?: boolean;
  onConfirm: (reason: string) => Promise<string | null>;
  onClose: () => void;
}

const MAX_REASON_LENGTH = 1000;

export const ConfirmActionDialog = ({
  title,
  description,
  confirmLabel,
  reasonLabel = 'Reason',
  requireReason = false,
  onConfirm,
  onClose,
}: ConfirmActionDialogProps) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, submitting]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = reason.trim();
    if (requireReason && !trimmed) {
      setError('Please provide a reason.');
      return;
    }
    setError(null);
    setSubmitting(true);
    const failure = await onConfirm(trimmed);
    setSubmitting(false);
    if (failure) {
      setError(failure);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-2xl w-full max-w-md">
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-700">{description}</p>

          {requireReason && (
            <div>
              <label htmlFor="action-reason" className="block text-sm font-medium text-gray-700 mb-1">
                {reasonLabel} <span className="text-red-600">*</span>
              </label>
              <textarea
                id="action-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                maxLength={MAX_REASON_LENGTH}
                rows={4}
                disabled={submitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 pb-6">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Working...' : confirmLabel}
          </button>
        </div>
      </form>
    </div>
  );
};
