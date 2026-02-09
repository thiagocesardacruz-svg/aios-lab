import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, isDemoMode } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { BusinessDNA } from '../lib/database.types';

// Demo DNA for development
const DEMO_DNA: BusinessDNA = {
  id: 'demo-dna-id',
  user_id: 'demo-user-id',
  business_name: 'Hotel & Spa Belvedere',
  location: 'Lisbon, Portugal',
  segment: 'hotel',
  niche: 'boutique',
  target_audience: 'Business travelers, Couples, Luxury',
  tone: 'Warm & Welcoming',
  primary_goal: null,
  usp: 'Rooftop infinity pool with panoramic city views',
  team_size: '45 employees',
  current_tools: 'Opera PMS, Mailchimp, Instagram',
  challenges: 'Competing with OTAs, improving guest reviews',
  segment_specific: null,
  extended: {
    goals: {
      customer_acquisition: ['increase_direct_bookings', 'improve_ota_visibility'],
      sales_conversion: ['increase_upsell_rate'],
      retention: ['launch_loyalty_program'],
    },
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

interface DNAContextType {
  dna: BusinessDNA | null;
  loading: boolean;
  hasDNA: boolean;
  saveDNA: (data: Partial<BusinessDNA>) => Promise<{ error: Error | null }>;
  updateDNA: (data: Partial<BusinessDNA>) => Promise<{ error: Error | null }>;
  refreshDNA: () => Promise<void>;
}

const DNAContext = createContext<DNAContextType | undefined>(undefined);

export function DNAProvider({ children }: { children: React.ReactNode }) {
  const { user, isDemoMode: authDemoMode } = useAuth();
  const [dna, setDNA] = useState<BusinessDNA | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDNA = useCallback(async () => {
    if (!user) {
      setDNA(null);
      setLoading(false);
      return;
    }

    // Demo mode
    if (authDemoMode || isDemoMode) {
      setDNA(DEMO_DNA);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('business_dna')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!error && data) {
        setDNA(data);
      } else {
        setDNA(null);
      }
    } catch (err) {
      console.error('Error fetching DNA:', err);
      setDNA(null);
    } finally {
      setLoading(false);
    }
  }, [user, authDemoMode]);

  useEffect(() => {
    fetchDNA();
  }, [fetchDNA]);

  const saveDNA = useCallback(async (data: Partial<BusinessDNA>) => {
    if (!user) return { error: new Error('Not authenticated') };

    // Demo mode - just update local state
    if (authDemoMode || isDemoMode) {
      setDNA(prev => ({ ...DEMO_DNA, ...prev, ...data } as BusinessDNA));
      return { error: null };
    }

    try {
      const { error } = await supabase
        .from('business_dna')
        .insert({
          user_id: user.id,
          business_name: data.business_name!,
          location: data.location!,
          segment: data.segment,
          niche: data.niche,
          target_audience: data.target_audience!,
          tone: data.tone!,
          primary_goal: data.primary_goal,
          usp: data.usp,
          team_size: data.team_size,
          current_tools: data.current_tools,
          challenges: data.challenges,
          extended: data.extended,
        });

      if (error) throw error;

      await fetchDNA();
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  }, [user, authDemoMode, fetchDNA]);

  const updateDNA = useCallback(async (data: Partial<BusinessDNA>) => {
    if (!user || !dna) return { error: new Error('Not authenticated or no DNA') };

    // Demo mode - just update local state
    if (authDemoMode || isDemoMode) {
      setDNA(prev => ({ ...prev, ...data } as BusinessDNA));
      return { error: null };
    }

    try {
      const { error } = await supabase
        .from('business_dna')
        .update(data)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchDNA();
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  }, [user, dna, authDemoMode, fetchDNA]);

  const refreshDNA = useCallback(async () => {
    setLoading(true);
    await fetchDNA();
  }, [fetchDNA]);

  return (
    <DNAContext.Provider value={{
      dna,
      loading,
      hasDNA: !!dna,
      saveDNA,
      updateDNA,
      refreshDNA,
    }}>
      {children}
    </DNAContext.Provider>
  );
}

export function useDNA() {
  const context = useContext(DNAContext);
  if (context === undefined) {
    throw new Error('useDNA must be used within a DNAProvider');
  }
  return context;
}
