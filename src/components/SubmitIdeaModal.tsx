import { useState } from 'react';
import { X, Lightbulb, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface SubmitIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SubmitIdeaModal = ({ isOpen, onClose, onSuccess }: SubmitIdeaModalProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!user) {
      setError('You must be logged in to submit an idea');
      setLoading(false);
      return;
    }

    try {
      const { error: submitError } = await supabase
        .from('idea_submissions')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category || null,
          status: 'pending'
        });

      if (submitError) throw submitError;

      setFormData({ title: '', description: '', category: '' });
      setLoading(false);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit idea. Please try again.');
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden my-auto">
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 text-white">
            <Lightbulb className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Submit Idea to Hearty Foundation</h2>
              <p className="text-red-100 text-sm">Share your ideas to help improve our community</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Idea Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              maxLength={200}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              placeholder="Give your idea a clear, concise title"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category (Optional)
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              disabled={loading}
            >
              <option value="">Select a category</option>
              <option value="event">Event / Activity</option>
              <option value="program">Program / Initiative</option>
              <option value="partnership">Partnership Opportunity</option>
              <option value="improvement">Platform Improvement</option>
              <option value="fundraising">Fundraising</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={6}
              maxLength={2000}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Describe your idea in detail. What problem does it solve? How would it benefit the community?"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length}/2000 characters
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
            <p className="font-medium mb-1">What happens next?</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Your idea will be reviewed by the Hearty Foundation team</li>
              <li>You'll be notified about the status via email</li>
              <li>Selected ideas may be implemented or discussed further with you</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? 'Submitting...' : 'Submit Idea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
