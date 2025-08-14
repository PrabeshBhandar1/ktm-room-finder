import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type ToVerify = Database['public']['Tables']['toverify']['Row'];
type ToVerifyInsert = Database['public']['Tables']['toverify']['Insert'];
type ToVerifyUpdate = Database['public']['Tables']['toverify']['Update'];

export interface CreatePropertyData {
  title: string;
  description?: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  amenities?: string[];
  images?: string[];
  contact_phone?: string;
  contact_email?: string;
}

export class PropertyVerificationService {
  /**
   * Submit a property for verification
   */
  static async submitProperty(propertyData: CreatePropertyData, ownerId: string): Promise<{ data: ToVerify | null; error?: string }> {
    try {
      const propertyInsert: ToVerifyInsert = {
        ...propertyData,
        owner_id: ownerId,
        available: true,
        status: 'pending',
      };

      const { data, error } = await supabase
        .from('toverify')
        .insert(propertyInsert)
        .select()
        .single();

      if (error) {
        console.error('Error submitting property:', error);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error in submitProperty:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Get all pending properties for admin review
   */
  static async getPendingProperties(): Promise<{ data: ToVerify[] | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('toverify')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching pending properties:', error);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error in getPendingProperties:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Get properties by status
   */
  static async getPropertiesByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<{ data: ToVerify[] | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('toverify')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties by status:', error);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error in getPropertiesByStatus:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Get properties submitted by a specific user
   */
  static async getUserProperties(ownerId: string): Promise<{ data: ToVerify[] | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('toverify')
        .select('*')
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user properties:', error);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error in getUserProperties:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Update property status (approve/reject) - Only for admins
   */
  static async updatePropertyStatus(id: string, status: 'approved' | 'rejected'): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('toverify')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Error updating property status:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in updatePropertyStatus:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Delete a property from verification - Only for property owner or admin
   */
  static async deleteProperty(id: string, userId?: string): Promise<{ success: boolean; error?: string }> {
    try {
      // If userId is provided, verify the user owns the property
      if (userId) {
        const { data: property, error: fetchError } = await supabase
          .from('toverify')
          .select('owner_id')
          .eq('id', id)
          .single();

        if (fetchError) {
          return { success: false, error: 'Property not found' };
        }

        if (property.owner_id !== userId) {
          return { success: false, error: 'Unauthorized: You can only delete your own properties' };
        }
      }

      const { error } = await supabase
        .from('toverify')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting property:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in deleteProperty:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
