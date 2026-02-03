-- AI OS V3.1 MVP - Initial Database Schema
-- Follows PRD V3.1 specification exactly

-- =============================================================================
-- ENUMS
-- =============================================================================

CREATE TYPE user_role AS ENUM ('owner', 'manager', 'freelancer', 'consultant', 'employee');
CREATE TYPE tone_of_voice AS ENUM ('casual_friendly', 'professional', 'premium_luxury', 'direct_sales');
CREATE TYPE primary_goal AS ENUM ('get_clients', 'increase_conversions', 'save_time', 'improve_operations', 'build_presence');
CREATE TYPE ai_maturity_level AS ENUM ('never_used', 'beginner', 'intermediate', 'advanced');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'expired');
CREATE TYPE plan_tier AS ENUM ('basic', 'pro', 'advanced');
CREATE TYPE task_status AS ENUM ('pending', 'completed', 'skipped');
CREATE TYPE external_tool_type AS ENUM ('chatgpt', 'claude', 'gemini', 'canva', 'notion', 'other');
CREATE TYPE tenant_type AS ENUM ('core', 'white_label', 'partner');
CREATE TYPE credit_reason AS ENUM ('subscription_grant', 'purchase', 'ai_render', 'refund', 'adjustment');

-- =============================================================================
-- CORE TABLES
-- =============================================================================

-- Tenants (Multi-tenancy support)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type tenant_type NOT NULL DEFAULT 'core',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Products (SKU - each segment is a product)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    segment_slug TEXT NOT NULL,
    description TEXT,
    stripe_product_id TEXT,
    stripe_price_id TEXT,
    price_cents INTEGER NOT NULL DEFAULT 0,
    credits_included INTEGER NOT NULL DEFAULT 100,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Segments (Content domains)
CREATE TABLE segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tenant-Product mapping (which products a tenant can access)
CREATE TABLE tenant_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(tenant_id, product_id)
);

-- User Profiles (extends Supabase auth.users)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    product_id UUID NOT NULL REFERENCES products(id),
    segment_id UUID NOT NULL REFERENCES segments(id),

    -- Business DNA (JSONB for flexibility, flat structure)
    dna_json JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- Individual DNA fields for indexing/querying
    business_name TEXT,
    user_role user_role,
    target_audience TEXT,
    value_proposition TEXT,
    tone_of_voice tone_of_voice,
    primary_goal primary_goal,
    ai_maturity_level ai_maturity_level,

    -- Onboarding state
    onboarding_completed_at TIMESTAMPTZ,
    commitment_signed BOOLEAN NOT NULL DEFAULT false,

    -- Locale
    locale TEXT NOT NULL DEFAULT 'en',

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Plan Templates (Growth plans)
CREATE TABLE plan_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id),
    segment_id UUID NOT NULL REFERENCES segments(id),
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    primary_goal primary_goal,
    duration_days INTEGER NOT NULL,
    recommended_for ai_maturity_level,
    is_active BOOLEAN NOT NULL DEFAULT true,
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(segment_id, slug, version)
);

-- Task Templates (Individual tasks within plans)
CREATE TABLE task_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id),
    segment_id UUID NOT NULL REFERENCES segments(id),
    plan_template_id UUID NOT NULL REFERENCES plan_templates(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    instruction_md TEXT NOT NULL,
    prompt_template TEXT NOT NULL,
    external_tool_type external_tool_type NOT NULL DEFAULT 'chatgpt',
    external_tool_url TEXT NOT NULL DEFAULT 'https://chat.openai.com/',
    definition_of_done JSONB NOT NULL DEFAULT '[]'::jsonb,
    estimated_time_minutes INTEGER NOT NULL DEFAULT 30,
    is_optional BOOLEAN NOT NULL DEFAULT false,
    is_premium BOOLEAN NOT NULL DEFAULT false,
    requires_credits BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(plan_template_id, day_number, version)
);

-- User Plans (Active plan instances for users)
CREATE TABLE user_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    segment_id UUID NOT NULL REFERENCES segments(id),
    plan_template_id UUID NOT NULL REFERENCES plan_templates(id),
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    current_day INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'active',
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User Tasks Log (Track task completion)
CREATE TABLE user_tasks_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_plan_id UUID NOT NULL REFERENCES user_plans(id) ON DELETE CASCADE,
    task_template_id UUID NOT NULL REFERENCES task_templates(id),
    status task_status NOT NULL DEFAULT 'pending',
    note TEXT,
    completed_at TIMESTAMPTZ,
    skipped_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_plan_id, task_template_id)
);

-- Subscriptions (Stripe sync)
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    product_id UUID NOT NULL REFERENCES products(id),
    stripe_subscription_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    plan_tier plan_tier NOT NULL DEFAULT 'basic',
    status subscription_status NOT NULL DEFAULT 'active',
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    credits_included INTEGER NOT NULL DEFAULT 100,
    credits_balance INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Credit Ledger (Audit trail for credits)
CREATE TABLE credit_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id),
    amount INTEGER NOT NULL,
    reason credit_reason NOT NULL,
    reference_id UUID,
    reference_type TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Favorites (Resolve Now shortcuts)
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL,
    item_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, item_type, item_id)
);

-- Analytics Events (Simple event log)
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    tenant_id UUID REFERENCES tenants(id),
    product_id UUID REFERENCES products(id),
    segment_id UUID REFERENCES segments(id),
    event_name TEXT NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_segment_id ON user_profiles(segment_id);
CREATE INDEX idx_user_profiles_product_id ON user_profiles(product_id);
CREATE INDEX idx_plan_templates_segment_id ON plan_templates(segment_id);
CREATE INDEX idx_task_templates_plan_id ON task_templates(plan_template_id);
CREATE INDEX idx_task_templates_segment_id ON task_templates(segment_id);
CREATE INDEX idx_user_plans_user_id ON user_plans(user_id);
CREATE INDEX idx_user_tasks_log_user_plan_id ON user_tasks_log(user_plan_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_credit_ledger_user_id ON credit_ledger(user_id);
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tasks_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Helper function to get user's segment_id
CREATE OR REPLACE FUNCTION get_user_segment_id()
RETURNS UUID AS $$
    SELECT segment_id FROM user_profiles WHERE user_id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Helper function to get user's product_id
CREATE OR REPLACE FUNCTION get_user_product_id()
RETURNS UUID AS $$
    SELECT product_id FROM user_profiles WHERE user_id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Helper function to get user's tenant_id
CREATE OR REPLACE FUNCTION get_user_tenant_id()
RETURNS UUID AS $$
    SELECT tenant_id FROM user_profiles WHERE user_id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- =============================================================================
-- RLS POLICIES
-- =============================================================================

-- Products: Public read for active products
CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (is_active = true);

-- Segments: Public read for active segments
CREATE POLICY "Segments are viewable by everyone" ON segments
    FOR SELECT USING (is_active = true);

-- User Profiles: Users can only access their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Plan Templates: Users can only view plans for their segment
CREATE POLICY "Users can view plans for their segment" ON plan_templates
    FOR SELECT USING (
        is_active = true
        AND segment_id = get_user_segment_id()
    );

-- Task Templates: Users can only view tasks for their segment
CREATE POLICY "Users can view tasks for their segment" ON task_templates
    FOR SELECT USING (
        is_active = true
        AND segment_id = get_user_segment_id()
    );

-- User Plans: Users can only access their own plans
CREATE POLICY "Users can view own plans" ON user_plans
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own plans" ON user_plans
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own plans" ON user_plans
    FOR UPDATE USING (user_id = auth.uid());

-- User Tasks Log: Users can only access their own task logs
CREATE POLICY "Users can view own task logs" ON user_tasks_log
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own task logs" ON user_tasks_log
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own task logs" ON user_tasks_log
    FOR UPDATE USING (user_id = auth.uid());

-- Subscriptions: Users can only view their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (user_id = auth.uid());

-- Credit Ledger: Users can only view their own credits
CREATE POLICY "Users can view own credit ledger" ON credit_ledger
    FOR SELECT USING (user_id = auth.uid());

-- Favorites: Users can manage their own favorites
CREATE POLICY "Users can view own favorites" ON favorites
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own favorites" ON favorites
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own favorites" ON favorites
    FOR DELETE USING (user_id = auth.uid());

-- Analytics Events: Users can insert their own events
CREATE POLICY "Users can insert own events" ON analytics_events
    FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- =============================================================================
-- FUNCTIONS & TRIGGERS
-- =============================================================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_plans_updated_at
    BEFORE UPDATE ON user_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_tasks_log_updated_at
    BEFORE UPDATE ON user_tasks_log
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenants_updated_at
    BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to sync DNA fields to dna_json
CREATE OR REPLACE FUNCTION sync_dna_json()
RETURNS TRIGGER AS $$
BEGIN
    NEW.dna_json = jsonb_build_object(
        'business_name', COALESCE(NEW.business_name, ''),
        'user_role', COALESCE(NEW.user_role::text, ''),
        'target_audience', COALESCE(NEW.target_audience, ''),
        'value_proposition', COALESCE(NEW.value_proposition, ''),
        'tone_of_voice', COALESCE(NEW.tone_of_voice::text, ''),
        'primary_goal', COALESCE(NEW.primary_goal::text, ''),
        'ai_maturity_level', COALESCE(NEW.ai_maturity_level::text, '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_dna_json_trigger
    BEFORE INSERT OR UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION sync_dna_json();

-- Function to create initial task logs when plan starts
CREATE OR REPLACE FUNCTION create_initial_task_logs()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_tasks_log (user_id, user_plan_id, task_template_id, status)
    SELECT
        NEW.user_id,
        NEW.id,
        tt.id,
        'pending'::task_status
    FROM task_templates tt
    WHERE tt.plan_template_id = NEW.plan_template_id
      AND tt.is_active = true
    ORDER BY tt.day_number;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_task_logs_on_plan_start
    AFTER INSERT ON user_plans
    FOR EACH ROW EXECUTE FUNCTION create_initial_task_logs();
