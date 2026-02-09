import { useState, useEffect, useCallback } from 'react';
import { supabase, isDemoMode } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { UserFavorite } from '../lib/database.types';

type ItemType = 'expert' | 'tool' | 'prompt' | 'trail' | 'sop';

export function useFavorites(itemType?: ItemType) {
  const { user, isDemoMode: authDemoMode } = useAuth();
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [loading, setLoading] = useState(true);

  // Local storage for demo mode
  const demoKey = 'traveltech_favorites';

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    // Demo mode - use localStorage
    if (authDemoMode || isDemoMode) {
      const stored = localStorage.getItem(demoKey);
      const allFavorites: UserFavorite[] = stored ? JSON.parse(stored) : [];
      const filtered = itemType
        ? allFavorites.filter(f => f.item_type === itemType)
        : allFavorites;
      setFavorites(filtered);
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', user.id);

      if (itemType) {
        query = query.eq('item_type', itemType);
      }

      const { data, error } = await query;

      if (error) throw error;
      setFavorites(data || []);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [user, authDemoMode, itemType]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const isFavorite = useCallback((itemId: string, type?: ItemType): boolean => {
    const checkType = type || itemType;
    return favorites.some(f => f.item_id === itemId && (!checkType || f.item_type === checkType));
  }, [favorites, itemType]);

  const toggleFavorite = useCallback(async (itemId: string, type: ItemType): Promise<boolean> => {
    if (!user) return false;

    const exists = isFavorite(itemId, type);

    // Demo mode - use localStorage
    if (authDemoMode || isDemoMode) {
      const stored = localStorage.getItem(demoKey);
      let allFavorites: UserFavorite[] = stored ? JSON.parse(stored) : [];

      if (exists) {
        allFavorites = allFavorites.filter(f => !(f.item_id === itemId && f.item_type === type));
      } else {
        allFavorites.push({
          id: `demo-${Date.now()}`,
          user_id: user.id,
          item_type: type,
          item_id: itemId,
          created_at: new Date().toISOString(),
        });
      }

      localStorage.setItem(demoKey, JSON.stringify(allFavorites));
      await fetchFavorites();
      return !exists;
    }

    try {
      if (exists) {
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('item_id', itemId)
          .eq('item_type', type);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            item_type: type,
            item_id: itemId,
          });

        if (error) throw error;
      }

      await fetchFavorites();
      return !exists;
    } catch (err) {
      console.error('Error toggling favorite:', err);
      return exists;
    }
  }, [user, authDemoMode, isFavorite, fetchFavorites]);

  return {
    favorites,
    loading,
    isFavorite,
    toggleFavorite,
    refresh: fetchFavorites,
  };
}
