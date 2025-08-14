import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type UserLogin = Database['public']['Tables']['user_logins']['Insert'];

export interface UserLoginData {
  user_id: string;
  username?: string | null;
  email: string;
  phone_number?: string | null;
}

export class UserService {
  /**
   * Store user login information in Supabase
   */
  static async storeUserLogin(userData: UserLoginData): Promise<{ success: boolean; error?: string }> {
    try {
      const loginData: UserLogin = {
        user_id: userData.user_id,
        username: userData.username || null,
        email: userData.email,
        phone_number: userData.phone_number || null,
        logged_in_date: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('user_logins')
        .insert(loginData)
        .select()
        .single();

      if (error) {
        console.error('Error storing user login:', error);
        return { success: false, error: error.message };
      }

      console.log('User login stored successfully:', data);
      return { success: true };
    } catch (error) {
      console.error('Error in storeUserLogin:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Get user login history
   */
  static async getUserLoginHistory(userId: string): Promise<{ data: any[] | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('user_logins')
        .select('*')
        .eq('user_id', userId)
        .order('logged_in_date', { ascending: false });

      if (error) {
        console.error('Error fetching user login history:', error);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error in getUserLoginHistory:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Check if user already has a login record for today
   */
  static async hasLoginToday(userId: string): Promise<{ hasLogin: boolean; error?: string }> {
    try {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

      const { data, error } = await supabase
        .from('user_logins')
        .select('id')
        .eq('user_id', userId)
        .gte('logged_in_date', startOfDay)
        .lt('logged_in_date', endOfDay)
        .limit(1);

      if (error) {
        console.error('Error checking today\'s login:', error);
        return { hasLogin: false, error: error.message };
      }

      return { hasLogin: data && data.length > 0 };
    } catch (error) {
      console.error('Error in hasLoginToday:', error);
      return { hasLogin: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
