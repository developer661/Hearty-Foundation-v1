import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface FavoriteButtonProps {
  itemId: string;
  itemType: 'urgent_need' | 'event';
}

export const FavoriteButton = ({ itemId, itemType }: FavoriteButtonProps) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkIfFavorite();
    }
  }, [user, itemId, itemType]);

  const checkIfFavorite = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('item_id', itemId)
        .eq('item_type', itemType)
        .maybeSingle();

      if (error) throw error;
      setIsFavorite(!!data);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      alert('Please log in to add favorites');
      return;
    }

    setLoading(true);

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('item_id', itemId)
          .eq('item_type', itemType);

        if (error) throw error;
        setIsFavorite(false);
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            item_id: itemId,
            item_type: itemType
          });

        if (error) throw error;
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorite. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className="group relative p-2 rounded-full hover:bg-red-50 transition-colors"
      title={isFavorite ? "Remove from favourites" : "Add to favourites"}
    >
      <Heart
        className={`w-5 h-5 transition-all ${
          isFavorite
            ? 'fill-red-500 text-red-500'
            : 'text-gray-400 hover:text-red-500'
        } ${loading ? 'opacity-50' : ''}`}
      />
      <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {isFavorite ? "Remove from favourites" : "Add to favourites"}
      </span>
    </button>
  );
};
