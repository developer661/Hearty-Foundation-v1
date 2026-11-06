import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export const usePendingRequestCount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let active = true;

    const loadCount = async () => {
      const { count: pending, error } = await supabase
        .from('admin_requests')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (error) {
        console.error('Error loading pending requests:', error);
        return;
      }
      if (active) setCount(pending ?? 0);
    };

    loadCount();

    const channel = supabase
      .channel('admin-requests-pending')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_requests' }, () => {
        loadCount();
      })
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return count;
};
