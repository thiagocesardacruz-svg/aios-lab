-- ============================================================================
-- TravelTech AIOS - Initial Database Schema
-- Version: 3.1
-- Created: 2026-02-09
-- ============================================================================

-- Note: gen_random_uuid() is built into PostgreSQL 13+, no extension needed

-- ============================================================================
-- USERS & AUTHENTICATION
-- ============================================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT,
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'pt', 'es', 'fr', 'de', 'it', 'ar')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own data
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- ============================================================================
-- MODULAR PRODUCT ARCHITECTURE
-- ============================================================================

-- Products catalog (mirrors Stripe products)
CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('bundle', 'standalone')),
  segment TEXT CHECK (segment IN ('hotel', 'agency', 'dmc', 'dmo', 'all')),
  price_type TEXT NOT NULL CHECK (price_type IN ('subscription', 'one_time')),
  price_usd INTEGER, -- in cents
  stripe_product_id TEXT,
  stripe_price_id TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- What each product grants access to
CREATE TABLE public.product_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('experts', 'prompts', 'tools', 'trails', 'sops', 'tutor', 'guides')),
  segment_filter TEXT CHECK (segment_filter IN ('hotel', 'agency', 'dmc', 'dmo', 'all')),
  UNIQUE (product_id, content_type, segment_filter)
);

-- User's purchased products
CREATE TABLE public.user_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES public.products(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'trial')),
  stripe_subscription_id TEXT,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  trial_ends_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ, -- null = lifetime for subscriptions
  purchased_from TEXT, -- 'landing', 'upsell', 'checkout', 'admin'
  UNIQUE (user_id, product_id)
);

-- Enable RLS
ALTER TABLE public.user_products ENABLE ROW LEVEL SECURITY;

-- Users can only view their own products
CREATE POLICY "Users can view own products" ON public.user_products
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================================
-- BUSINESS DNA
-- ============================================================================

CREATE TABLE public.business_dna (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  -- Mandatory fields (Day 0)
  business_name TEXT NOT NULL,
  location TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  tone TEXT NOT NULL,
  primary_goal TEXT NOT NULL,
  -- Optional fields (progressive profiling)
  usp TEXT,
  team_size TEXT,
  current_tools TEXT,
  challenges TEXT,
  segment_specific JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.business_dna ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own DNA" ON public.business_dna
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own DNA" ON public.business_dna
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own DNA" ON public.business_dna
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- USER PROGRESS & PREFERENCES
-- ============================================================================

-- Favorites
CREATE TABLE public.user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('expert', 'tool', 'prompt', 'trail', 'sop')),
  item_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, item_type, item_id)
);

ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own favorites" ON public.user_favorites
  FOR ALL USING (auth.uid() = user_id);

-- Trail progress
CREATE TABLE public.trail_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  trail_id TEXT NOT NULL,
  current_step INTEGER DEFAULT 0,
  completed_steps INTEGER[] DEFAULT '{}',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE (user_id, trail_id)
);

ALTER TABLE public.trail_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own trail progress" ON public.trail_progress
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to check if user has access to content
CREATE OR REPLACE FUNCTION public.has_access(
  p_user_id UUID,
  p_content_type TEXT,
  p_segment TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  has_access BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM public.user_products up
    JOIN public.product_access pa ON up.product_id = pa.product_id
    WHERE up.user_id = p_user_id
    AND up.status IN ('active', 'trial')
    AND (up.expires_at IS NULL OR up.expires_at > NOW())
    AND (up.trial_ends_at IS NULL OR up.trial_ends_at > NOW() OR up.status != 'trial')
    AND pa.content_type = p_content_type
    AND (pa.segment_filter = p_segment OR pa.segment_filter = 'all' OR pa.segment_filter IS NULL)
  ) INTO has_access;

  RETURN has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's accessible content types
CREATE OR REPLACE FUNCTION public.get_user_access(p_user_id UUID)
RETURNS TABLE (content_type TEXT, segment_filter TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT pa.content_type, pa.segment_filter
  FROM public.user_products up
  JOIN public.product_access pa ON up.product_id = pa.product_id
  WHERE up.user_id = p_user_id
  AND up.status IN ('active', 'trial')
  AND (up.expires_at IS NULL OR up.expires_at > NOW())
  AND (up.trial_ends_at IS NULL OR up.trial_ends_at > NOW() OR up.status != 'trial');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_business_dna_updated_at
  BEFORE UPDATE ON public.business_dna
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_user_products_user_id ON public.user_products(user_id);
CREATE INDEX idx_user_products_status ON public.user_products(status);
CREATE INDEX idx_product_access_product_id ON public.product_access(product_id);
CREATE INDEX idx_product_access_content_type ON public.product_access(content_type);
CREATE INDEX idx_user_favorites_user_id ON public.user_favorites(user_id);
CREATE INDEX idx_trail_progress_user_id ON public.trail_progress(user_id);
