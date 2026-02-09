import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, isDemoMode } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { Product, UserProduct } from '../lib/database.types';

// Demo products for development
const DEMO_USER_PRODUCTS: (UserProduct & { product: Product })[] = [
  {
    id: 'demo-up-1',
    user_id: 'demo-user-id',
    product_id: 'hotel-aios',
    status: 'active',
    stripe_subscription_id: null,
    purchased_at: new Date().toISOString(),
    trial_ends_at: null,
    expires_at: null,
    purchased_from: 'demo',
    product: {
      id: 'hotel-aios',
      name: 'Hotel AIOS',
      description: 'Complete AI system for hotels',
      type: 'bundle',
      segment: 'hotel',
      price_type: 'subscription',
      price_usd: 19900,
      stripe_product_id: null,
      stripe_price_id: null,
      is_active: true,
      created_at: new Date().toISOString(),
    },
  },
];

// Demo access map
const DEMO_ACCESS: Record<string, string[]> = {
  experts: ['hotel'],
  prompts: ['hotel'],
  tools: ['all'],
  trails: ['hotel'],
  sops: ['hotel'],
  tutor: ['all'],
  guides: ['all'],
};

interface ProductsContextType {
  userProducts: (UserProduct & { product: Product })[];
  loading: boolean;
  hasAccess: (contentType: string, segment: string) => boolean;
  hasAnyProduct: boolean;
  hasBundle: boolean;
  hasStandalone: boolean;
  canUpgrade: boolean;
  refreshProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const { user, isDemoMode: authDemoMode } = useAuth();
  const [userProducts, setUserProducts] = useState<(UserProduct & { product: Product })[]>([]);
  const [accessMap, setAccessMap] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    if (!user) {
      setUserProducts([]);
      setAccessMap({});
      setLoading(false);
      return;
    }

    // Demo mode
    if (authDemoMode || isDemoMode) {
      setUserProducts(DEMO_USER_PRODUCTS);
      setAccessMap(DEMO_ACCESS);
      setLoading(false);
      return;
    }

    try {
      // Fetch user's products
      const { data: products, error: productsError } = await supabase
        .from('user_products')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', user.id)
        .in('status', ['active', 'trial']);

      if (productsError) throw productsError;

      setUserProducts(products || []);

      // Fetch access map
      const { data: access, error: accessError } = await supabase
        .rpc('get_user_access', { p_user_id: user.id });

      if (accessError) throw accessError;

      // Convert to map
      const map: Record<string, string[]> = {};
      (access || []).forEach((item: { content_type: string; segment_filter: string }) => {
        if (!map[item.content_type]) {
          map[item.content_type] = [];
        }
        map[item.content_type].push(item.segment_filter || 'all');
      });
      setAccessMap(map);
    } catch (err) {
      console.error('Error fetching products:', err);
      setUserProducts([]);
      setAccessMap({});
    } finally {
      setLoading(false);
    }
  }, [user, authDemoMode]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const hasAccess = useCallback((contentType: string, segment: string): boolean => {
    const segments = accessMap[contentType];
    if (!segments) return false;
    return segments.includes(segment) || segments.includes('all');
  }, [accessMap]);

  const hasBundle = userProducts.some(p => p.product?.type === 'bundle');
  const hasStandalone = userProducts.some(p => p.product?.type === 'standalone');
  const canUpgrade = hasStandalone && !hasBundle;
  const hasAnyProduct = userProducts.length > 0;

  const refreshProducts = useCallback(async () => {
    setLoading(true);
    await fetchProducts();
  }, [fetchProducts]);

  return (
    <ProductsContext.Provider value={{
      userProducts,
      loading,
      hasAccess,
      hasAnyProduct,
      hasBundle,
      hasStandalone,
      canUpgrade,
      refreshProducts,
    }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
