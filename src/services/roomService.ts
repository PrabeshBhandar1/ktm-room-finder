import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Room = Database['public']['Tables']['rooms']['Row'];
type RoomInsert = Database['public']['Tables']['rooms']['Insert'];
type RoomUpdate = Database['public']['Tables']['rooms']['Update'];

export interface CreateRoomData {
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

export interface UpdateRoomData extends Partial<CreateRoomData> {
  available?: boolean;
}

export class RoomService {
  /**
   * Get all available rooms
   */
  static async getRooms(): Promise<{ data: Room[] | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching rooms:', error);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error in getRooms:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Get rooms by location
   */
  static async getRoomsByLocation(location: string): Promise<{ data: Room[] | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .ilike('location', `%${location}%`)
        .eq('available', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching rooms by location:', error);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error in getRoomsByLocation:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Get a single room by ID
   */
  static async getRoomById(id: string): Promise<{ data: Room | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching room:', error);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error in getRoomById:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Get rooms owned by a specific user
   */
  static async getRoomsByOwner(ownerId: string): Promise<{ data: Room[] | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user rooms:', error);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error in getRoomsByOwner:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Create a new room
   */
  static async createRoom(roomData: CreateRoomData, ownerId: string): Promise<{ data: Room | null; error?: string }> {
    try {
      const roomInsert: RoomInsert = {
        ...roomData,
        owner_id: ownerId,
        available: true,
      };

      const { data, error } = await supabase
        .from('rooms')
        .insert(roomInsert)
        .select()
        .single();

      if (error) {
        console.error('Error creating room:', error);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error in createRoom:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Update a room
   */
  static async updateRoom(id: string, roomData: UpdateRoomData): Promise<{ data: Room | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .update(roomData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating room:', error);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error in updateRoom:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Delete a room
   */
  static async deleteRoom(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting room:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in deleteRoom:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Search rooms by title or location
   */
  static async searchRooms(searchTerm: string): Promise<{ data: Room[] | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .or(`title.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`)
        .eq('available', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error searching rooms:', error);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error in searchRooms:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Filter rooms by price range
   */
  static async filterRoomsByPrice(minPrice: number, maxPrice: number): Promise<{ data: Room[] | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .gte('price', minPrice)
        .lte('price', maxPrice)
        .eq('available', true)
        .order('price', { ascending: true });

      if (error) {
        console.error('Error filtering rooms by price:', error);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error in filterRoomsByPrice:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
