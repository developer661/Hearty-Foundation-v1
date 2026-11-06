import { supabase } from './supabase';

export const notifyAdministrators = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('send-admin-notifications');
    if (error) {
      console.warn('Administrator notification could not be dispatched:', error.message);
      return;
    }
    if (!data || typeof data !== 'object') {
      console.warn('Administrator notification returned an unexpected response');
    }
  } catch (err) {
    console.warn('Administrator notification could not be dispatched:', err);
  }
};
